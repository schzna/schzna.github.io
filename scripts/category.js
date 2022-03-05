document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(document.location.search.substring(1));
    category = params.get("category")
    if (category === null) {
        category = "all"
    }
    
    Array.from(document.body.children).forEach(elem => {
        if (elem.tagName === "NOTES" && elem.id != category) {
            elem.remove()
        }
    });

    Array.from(document.querySelector("categories").children).forEach(elem => { 
        if (elem.id === category) {
            elem.setAttribute("id", "selected")
        } else {
            elem.setAttribute("id", "")
        }
    })
})