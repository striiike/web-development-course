<script>
    import { useUserState } from "../states/userState.svelte.js";
    const userState = useUserState();

    let { id } = $props();

    let exercise = $state(null);
    let loading = $state(true);
    let error = $state(null);
    let textContent = $state("");
    let showStats = $state(false);
    let characterCount = $state(0);
    let ifCount = $state(0);

    let grading_status = $state(null);
    let grade = $state(null);
    
    let prediction = $state(null);
    let predictionTimer = null;
    let hasStartedTyping = $state(false);

    async function fetchExercise() {
        try {
            const response = await fetch(`/api/exercises/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch exercise");
            }
            exercise = await response.json();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    }

    async function getPrediction() {
        if (!textContent.trim()) {
            prediction = null;
            return;
        }
        
        try {
            const response = await fetch('/inference-api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    exercise: parseInt(id),
                    code: textContent
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                prediction = Math.round(data.prediction);
            }
        } catch (err) {
            console.error('Prediction error:', err.message);
        }
    }

    function handleTextareaInput() {
        hasStartedTyping = true;
        
        if (predictionTimer) {
            clearTimeout(predictionTimer);
        }
        
        predictionTimer = setTimeout(() => {
            getPrediction();
        }, 500);
    }

    async function handleSubmit() {
        characterCount = textContent.length;

        const regex = /if/gi;
        const matches = textContent.match(regex);
        ifCount = matches ? matches.length : 0;

        showStats = true;

        try {
            const response = await fetch(`/api/exercises/${id}/submissions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ source_code: textContent }),
            });
            if (!response.ok) {
                throw new Error("Failed to submit exercise");
            }

            const submissionId = (await response.json()).id;
            console.log("Submission ID:", submissionId);
            for (;;) {
                await new Promise((res) => setTimeout(res, 500));
                const statusResponse = await fetch(
                    `/api/submissions/${submissionId}/status`,
                );
                const statusData = await statusResponse.json();
                grading_status = statusData.grading_status;
                grade = statusData.grade;
                if (statusData.grading_status === "graded") {
                    break;
                }
                console.log("statusData:", statusData);
            }
        } catch (err) {
            console.error("Submission error:", err.message);
        }
    }

    fetchExercise();
</script>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p>Error: {error}</p>
{:else if exercise}
    <h1>{exercise.title}</h1>
    <p>{exercise.description}</p>
    {#if userState.email}
        <textarea bind:value={textContent} oninput={handleTextareaInput}></textarea>
        <button onclick={handleSubmit}>Submit</button>

        {#if hasStartedTyping && prediction !== null}
            <p>Correctness estimate: {prediction}%</p>
        {/if}

        {#if showStats}
            <p>Characters: {characterCount}</p>
            <p>ifs: {ifCount}</p>
        {/if}
        <p>Grading status: {grading_status}</p>
        <p>Grade: {grade}</p>
    {:else}
        <p>Login or register to complete exercises.</p>
    {/if}
{/if}
