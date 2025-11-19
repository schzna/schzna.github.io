class Node {
    constructor(
        svg,
        id,
        name,
        inputs,
        outputs,
        x = 0,
        y = 0,
        w = 200,
        h = 120
    ) {
        this.owner = svg;
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );
        this.element.setAttribute("class", "node");

        const block = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        block.setAttribute("x", 0);
        block.setAttribute("y", 0);
        block.setAttribute("width", w);
        block.setAttribute("height", h);
        this.element.appendChild(block);

        this.ports = {};

        inputs.forEach((e, i) => {
            const [id, name] = e;
            const input = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );

            input.setAttribute("cx", 0);
            input.setAttribute("cy", h / 2);
            input.setAttribute("r", 5);

            this.element.appendChild(input);
        });

        outputs.forEach((e, i) => {
            const [id, name] = e;
            const output = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );

            output.setAttribute("cx", w);
            output.setAttribute("cy", h / 2);
            output.setAttribute("r", 5);

            this.element.appendChild(output);
        });

        const label = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );
        label.innerHTML = name;
        label.setAttribute("x", 10);
        label.setAttribute("y", 25);

        this.element.appendChild(label);

        const T = this.owner.createSVGTransform();
        T.setTranslate(x, y);
        this.element.transform.baseVal.appendItem(T);
    }
}

function draw_nodebase(nodebase) {
    if (nodebase != null) {
        const parent = nodebase.parentElement;
        const root = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        root.setAttribute("id", "nodebase-root");
        root.setAttribute("width", "700");
        root.setAttribute("height", "300");
        root.setAttribute("version", "1.1");

        Array.from(nodebase.children).forEach((elem, i) => {
            const type = elem.tagName;
            const name = elem.getAttribute("name") || type;
            const id = elem.getAttribute("id") || `node-${i}`;

            const inputs = Array.from(elem.querySelectorAll("in")).map(
                (e, i) => {
                    const e_id = `${id}[${i}]`;
                    return [e_id, e.innerHTML || e_id];
                }
            );

            const outputs = Array.from(elem.querySelectorAll("out")).map(
                (e, i) => {
                    const e_id = `${id}[${i}]`;
                    return [e_id, e.innerHTML || e_id];
                }
            );

            const node = new Node(
                root,
                id,
                name,
                inputs,
                outputs,
                100 + i * 250,
                50
            );
            root.appendChild(node.element);
        });

        parent.insertBefore(root, nodebase);
        nodebase.remove();
    }
}

function main() {
    draw_nodebase(document.querySelector("nodebase"));
}

document.addEventListener("DOMContentLoaded", (ev) => {
    main();
});
