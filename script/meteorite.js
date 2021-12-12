const parser = new DOMParser();

function start_starline() {
    const next = 2000 + Math.random() * 500;
    const y = -400 + Math.random() * 1000;
    const l = 100 + Math.random() * 300;
    const w = 3 + Math.random() * 10;
    const duration = 1000 + Math.random() * 500;
    const svg = document.body.querySelector(".starline svg");
    const elm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    elm.setAttribute("rx", (w/2).toString());
    elm.setAttribute("ry", (w/2).toString());
    elm.setAttribute("x", "0");
    elm.setAttribute("y", y.toString());
    elm.setAttribute("width", l.toString());
    elm.setAttribute("height", w.toString());
    elm.setAttribute("style", `animation-duration: ${duration}ms;`);
    svg.appendChild(elm);
    setTimeout(end_starline, next, elm);
}

function end_starline(elm) {
    elm.remove();
    start_starline();
}

function start_meteorite() {
    const next = 100 + Math.random() * 100;
    const x = 400 + Math.random() * 10 + scrollX;
    const y = 200 + Math.random() * 10 + screenY;
    const a = 30 + Math.random() * 10;
    const meteo = document.querySelector(".meteorite svg g");
    meteo.setAttribute("style", `
        transform: translateX(${x}px) translateY(${y}px) rotate(${a}deg);
    `);
    
    setTimeout(start_meteorite, next);
}

function start_meteorite_impact(type) {
    const next = 800 + Math.random() * 100;
    const a = 30 + Math.random() * 10;
    const r = 60 + Math.random() * 10;
    const meteo = document.querySelector(".meteorite svg g");
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    if (type === 1) {
        l.setAttribute("d", `
            M ${r} 0
            A ${r} ${r} 0 0 0 0 -${r}
        `);
    } else {
        l.setAttribute("d", `
            M ${r} 0
            A ${r} ${r} 0 0 1 0 ${r}
        `);
    }
    l.setAttribute("class", `particle`);
    l.setAttribute("style", `animation-duration: ${next}ms;`);
    meteo.appendChild(l);
    setTimeout(end_meteorite_impact, next, l, type);
}

function end_meteorite_impact(e, type) {
    e.remove();
    start_meteorite_impact(type);
}

document.addEventListener("DOMContentLoaded", e => {
    start_meteorite();
    for (let index = 0; index < 30; index++) {
        const delay = Math.random() * 3000;
        const type = Math.floor(Math.random()*2) + 1;
        setTimeout(start_starline, delay);
    }

});