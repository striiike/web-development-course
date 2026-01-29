let comments = $state([]);

const useCommentState = () => {

    if (import.meta.env.SSR) {
        comments = [];
    } else {
        const storedComments = localStorage?.getItem("commentState");
        comments = storedComments ? JSON.parse(storedComments) : [];
    }
    return {
        get count() {
            return comments.length;
        },
        get comments() {
            return comments;
        },
        add: (comment) => {
            comments.push(comment);
            localStorage.setItem("commentState", JSON.stringify(comments));
        },
    };
};

export { useCommentState };
