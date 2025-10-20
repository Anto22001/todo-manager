export const priorities = [
    {
        id: 0,
        title: "HIGH",
        color: "#ad3b33ff",
        icon: "/priority/high.svg"
    },
    {
        id: 1,
        title: "NORMAL",
        color: "#b47517ff",
        icon: "/priority/medium.svg"
    },
    {
        id: 2,
        title: "LOW",
        color: "#39783bff",
        icon: "/priority/low.svg"
    }
]

export const handleError = (err) => {
    const message = err.response?.data?.error || "Si è verificato un errore imprevisto!";
    console.error(err.response?.data || err);
    alert(message);
};