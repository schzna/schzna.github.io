function pageselect(page) {
    const num_entries = 8;
    Array.from(document.querySelector("notes").children).forEach((elem, i) => {
        if (i < (page-1) * num_entries || i >= ((page) * num_entries)) {
            elem.remove();
        }
    });
}

function display_pagenavigator(category, page, num_pages) {
    const nav = document.querySelectorAll("page-navigator")[0];
    nav.querySelectorAll("#page-first").forEach(elem => { 
        if (page == 1) {
            elem.innerHTML = "  ";
            elem.setAttribute("href", "#");
        } else {
            `./notes.html?category=${category}&page=1`;
        }
    });

    nav.querySelectorAll("#page-last").forEach(elem => { 
        if (page == num_pages) {
            elem.innerHTML = "  ";
            elem.setAttribute("href", "#");
        } else {
            elem.setAttribute("href", `./notes.html?category=${category}&page=${num_pages}`);
        }
    });

    nav.querySelectorAll("#page-prev").forEach(elem => {
        if (page == 1) {
            elem.innerHTML = "  ";
            elem.setAttribute("href", "#");
        } else {
            elem.setAttribute("href", `./notes.html?category=${category}&page=${page-1}`);
        }
    });
    nav.querySelectorAll("#page-indicator").forEach(elem => { 
        elem.innerHTML = `${page}/${num_pages}`;
    });
    nav.querySelectorAll("#page-next").forEach(elem => { 
        if (page == num_pages) {
            elem.innerHTML = "  ";
            elem.setAttribute("href", "#");
        } else {
            elem.setAttribute("href", `./notes.html?category=${category}&page=${page+1}`);
        }
    });
}

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

    const num_notes = Array.from(document.querySelector("notes").children).length;

    Array.from(document.querySelector("categories").children).forEach(elem => { 
        if (elem.id === category) {
            elem.setAttribute("id", "selected")
        } else {
            elem.setAttribute("id", "")
        }
    })

    const filter_page = (page_str, num_notes) => {
        if (page_str === null) {
            return 1;
        } else {
            const n = Number(page_str)
            if (n < 1) {
                return 1;
            }
            if (n > num_notes) {
                return num_notes;
            }
            return n;
        }
    };

    const page = filter_page(params.get("page"), num_notes);

    pageselect(page);
    display_pagenavigator(category, page, Math.ceil(num_notes / 8));
})