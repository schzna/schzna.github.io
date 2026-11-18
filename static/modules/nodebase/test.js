function pathd2obj(d) {
    return d
        .split(" ")
        .map((e) => e.replace(",", ""))
        .filter((e) => e != "")
        .reduce((s, e) => {
            const n = Number(e);
            if (isNaN(n)) {
                return s.concat([[e]]);
            } else {
                let ss = s;
                ss.at(-1).push(n);
                return ss;
            }
        }, []);
}

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

        this.adj = [];

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
            const cx = 0;
            const cy = (h * (i + 1)) / (inputs.length + 1);
            input.setAttribute("cx", cx);
            input.setAttribute("cy", cy);
            input.setAttribute("r", 5);

            this.element.appendChild(input);

            this.ports[id] = {
                owner: this.id,
                name: name,
                relx: cx,
                rely: cy,
            };
        });

        outputs.forEach((e, i) => {
            const [id, name] = e;
            const output = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );
            const cx = w;
            const cy = (h * (i + 1)) / (outputs.length + 1);
            output.setAttribute("cx", cx);
            output.setAttribute("cy", cy);
            output.setAttribute("r", 5);

            this.element.appendChild(output);
            this.ports[id] = {
                owner: this.id,
                name: name,
                relx: cx,
                rely: cy,
            };
        });

        const label = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );
        label.innerHTML = name;
        label.setAttribute("x", 10);
        label.setAttribute("y", 25);

        this.element.appendChild(label);

        this.element.selected = false;

        this.element.onmousedown = (e) => {
            this.selected = true;
            this.element.setAttribute("sel", "true");
            this.element.parentElement.appendChild(this.element);
            this.selpos = [e.clientX, e.clientY];
        };

        this.element.ontouchstart = (e) => {
            this.selected = true;
            this.element.setAttribute("sel", "true");
            this.element.parentElement.appendChild(this.element);
            this.selpos = [e.touches[0].clientX, e.touches[0].clientY];
        };

        window.addEventListener("mousemove", (e) => {
            if (this.selected) {
                const [difx, dify] = [
                    e.clientX - this.selpos[0],
                    e.clientY - this.selpos[1],
                ];

                this.x = difx + this.x;
                this.y = dify + this.y;
                const T = this.owner.createSVGTransform();
                T.setTranslate(Math.round(this.x), Math.round(this.y));
                this.element.transform.baseVal.initialize(T);
                for (const po of this.adj) {
                    const info = pathd2obj(po.elem.getAttribute("d"));

                    let x2 = info[1][3];
                    let x_to = info[1][5];
                    let y2 = info[1][4];
                    let y_to = info[1][6];

                    let x1 = info[1][1];
                    let x_from = info[0][1];
                    let y1 = info[1][2];
                    let y_from = info[0][2];

                    if (po.dir == "in") {
                        x2 += difx;
                        x_to += difx;
                        y2 += dify;
                        y_to += dify;
                    } else {
                        x1 += difx;
                        x_from += difx;
                        y1 += dify;
                        y_from += dify;
                    }

                    let cmd = "";
                    cmd += ` M ${x_from} ${y_from}`;
                    cmd += ` C ${x1} ${y1}, ${x2} ${y2}, ${x_to} ${y_to}`;
                    po.elem.setAttribute("d", cmd);
                }
                this.selpos = [e.clientX, e.clientY];
            }
        });

        this.element.ontouchmove = (e) => {
            if (this.selected) {
                const [difx, dify] = [
                    e.touches[0].clientX - this.selpos[0],
                    e.touches[0].clientY - this.selpos[1],
                ];

                this.x = Math.round(difx + this.x);
                this.y = Math.round(dify + this.y);
                const T = this.owner.createSVGTransform();
                T.setTranslate(this.x, this.y);
                this.element.transform.baseVal.initialize(T);
                for (const po of this.adj) {
                    const info = pathd2obj(po.elem.getAttribute("d"));

                    let x2 = info[1][3];
                    let x_to = info[1][5];
                    let y2 = info[1][4];
                    let y_to = info[1][6];

                    let x1 = info[1][1];
                    let x_from = info[0][1];
                    let y1 = info[1][2];
                    let y_from = info[0][2];

                    if (po.dir == "in") {
                        x2 += difx;
                        x_to += difx;
                        y2 += dify;
                        y_to += dify;
                    } else {
                        x1 += difx;
                        x_from += difx;
                        y1 += dify;
                        y_from += dify;
                    }

                    let cmd = "";
                    cmd += ` M ${x_from} ${y_from}`;
                    cmd += ` C ${x1} ${y1}, ${x2} ${y2}, ${x_to} ${y_to}`;
                    po.elem.setAttribute("d", cmd);
                }
                this.selpos = [e.touches[0].clientX, e.touches[0].clientY];
            }
        };

        window.addEventListener("mouseup", (e) => {
            this.selected = false;
            this.element.removeAttribute("sel");
        });

        this.element.ontouchend = (e) => {
            this.selected = false;
            this.element.removeAttribute("sel");
        };

        this.element.ontouchend = this.element.onmouseup;

        const T = this.owner.createSVGTransform();
        T.setTranslate(x, y);
        this.element.transform.baseVal.initialize(T);
    }
}

class NodebaseSystem {
    constructor(base) {
        this.parent = base.parentElement;
        this.dom = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        this.parent.insertBefore(this.dom, base);

        const vh = document.documentElement.clientWidth * 0.7;
        const vw = document.documentElement.clientWidth * 0.8;

        this.connections = [];
        this.ports = {};
        this.nodes = {};
        const node_elems = Array.from(base.children);
        node_elems.forEach((elem, i) => {
            const type = elem.tagName;
            const name = elem.getAttribute("name") || type;
            const id = elem.getAttribute("id") || `node-${i}`;

            const w = vw / 5;
            const h = vh / 4;

            const inputs = Array.from(elem.querySelectorAll("in")).map(
                (e, i) => {
                    const e_id = `${id}.in[${i}]`;
                    const from = e.getAttribute("from");
                    if (from != undefined) {
                        this.connections.push([from, e_id]);
                    }
                    return [e_id, e.innerHTML || e_id];
                }
            );

            const outputs = Array.from(elem.querySelectorAll("out")).map(
                (e, i) => {
                    const e_id = `${id}.out[${i}]`;
                    return [e_id, e.innerHTML || e_id];
                }
            );

            const node = new Node(
                this.dom,
                id,
                name,
                inputs,
                outputs,
                ((vw - node_elems.length * w) * (i + 1)) /
                    (node_elems.length + 1) +
                    w * i,
                ((vh - node_elems.length * h) * (i + 1)) /
                    (node_elems.length + 1) +
                    h * i,
                w,
                h
            );

            this.nodes[id] = node;
            this.ports = { ...this.ports, ...node.ports };
            this.dom.appendChild(node.element);
        });
        base.remove();

        this.connections.forEach((e) => {
            const [from_id, to_id] = e;
            const from = this.ports[from_id];
            const from_node = this.nodes[from["owner"]];
            const to = this.ports[to_id];
            const to_node = this.nodes[to["owner"]];

            const path = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );

            const from_x = from_node["x"] + from["relx"];
            const from_y = from_node["y"] + from["rely"];

            const to_x = to_node["x"] + to["relx"];
            const to_y = to_node["y"] + to["rely"];

            const rr = 10;

            const x1 = (from_x + to_x * rr) / (rr + 1);
            const y1 = from_y;

            const x2 = (from_x * rr + to_x) / (rr + 1);
            const y2 = to_y;

            let cmd = "";
            cmd += ` M ${from_x} ${from_y}`;
            cmd += ` C ${x1} ${y1}, ${x2} ${y2}, ${to_x} ${to_y}`;

            path.setAttribute("d", cmd);

            let pathobj_from = {
                elem: path,
                dir: "out",
            };
            from_node.adj.push(pathobj_from);

            let pathobj_to = {
                elem: path,
                dir: "in",
            };
            to_node.adj.push(pathobj_to);

            this.dom.appendChild(path);
        });

        this.dom.setAttribute("id", "nodebase-root");
        this.dom.setAttribute("height", `${vh}px`);
        this.dom.setAttribute("width", `${vw}px`);
        this.dom.setAttribute("version", "1.1");
    }

    update_node(id, x, y) {}
}

function draw_nodebase(nodebase) {
    if (nodebase != null) {
        const ns = new NodebaseSystem(nodebase);
        sessionStorage.setItem("ns", JSON.stringify(ns));
    }
}

function main() {
    draw_nodebase(document.querySelector("nodebase"));
}

document.addEventListener("DOMContentLoaded", (ev) => {
    main();
});
