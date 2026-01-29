function levenshteinDistance(a, b) {
    return a.length === 0 ? b.length :
        b.length === 0 ? a.length :
            Math.min(
                levenshteinDistance(a.slice(1), b) + 1,
                levenshteinDistance(a, b.slice(1)) + 1,
                levenshteinDistance(a.slice(1), b.slice(1)) + (a[0] === b[0] ? 0 : 1)
            );
}

export { levenshteinDistance };