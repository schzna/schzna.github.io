function init_tree(tree) {
    tree.querySelectorAll('ul p').forEach((elem_) => {
        let elem = elem_.nextElementSibling?.nextElementSibling;
        if (elem != null && elem.children.length != 0) {
            if (elem_.getAttribute('expand') == '') {
                elem_.setAttribute('expand', 'false');
            }
            elem_.addEventListener("click", (e) => {
                let elem = e.target?.nextElementSibling?.nextElementSibling;
                let val = e.target.getAttribute('expand');
                if (val === 'true') {
                    e.target.setAttribute('expand', 'false');
                } else {
                    e.target.setAttribute('expand', 'true');
                }
                if (elem != null) {
                    let val = elem.getAttribute('expand');
                    if (val === 'true') {
                        elem.setAttribute('expand', 'false');
                    } else {
                        elem.setAttribute('expand', 'true');
                    }
                }
            });
            if (elem != null && elem.getAttribute('expans') == '') {
                elem.setAttribute('expand', 'false');
            }
        } else {
            elem_.setAttribute('expand', 'none');
        }
    });
}

function init() {
    document.querySelectorAll('Tree').forEach((tree) => {
        init_tree(tree)
    });
}

document.addEventListener('DOMContentLoaded', init);