function countHeadChar(str, judge) {
	let num = 0;
	for (const ch of Array.from(str)) {
		if (judge(ch)) {
			num += 1;
		} else {
			break;
		}
	}
	return num;
}

function parseMD(content) {
	const parser = new DOMParser();
	const lines = content.replaceAll("\r", "").split("\n");

	const parse_linebreak = function (parsed, lines) {
		if (lines[0].length == 0) {
			return [parsed + "<br>", lines.slice(1)];
		}
	}
	const parse_header = function (parsed, lines) {
		if (lines[0][0] == "#") {
			const num = countHeadChar(lines[0], ch => ch == "#");
			return [parsed + `<h${num}> ${lines[0].substring(num + 1)} </h${num}>`, lines.slice(1)];
		}
	}
	const parse_list = function (parsed, lines) {
		if (lines[0][0] == "-") {
			let p = `<ul>`
			let dep = 0
			for (const line of lines) {
				if (line.trimStart()[0] == "-") {
					const num = countHeadChar(line, ch => { return ch == "\t" || ch == " " });
					if (num < dep) {
						p += "</ul>".repeat(dep - num);
					}
					if (num >= dep) {
						p += "<ul>".repeat(num - dep);
					}
					p += `<li>${line.trimStart().substring(1)}</li>`
					dep = num;
					lines = lines.slice(1);
				} else {
					break;
				}
			}
			p += "</ul>".repeat(dep + 1);
			return [parsed + p, lines];
		}
	}
	const parse_plain = function (parsed, lines) {
		return [parsed + `<p>${lines[0]}</p>`, lines.slice(1)];
	}
	const ext_attributes = function (parsed, lines) {
		let obj = {};
		if (lines[0].startsWith("!---")) {
			lines = lines.slice(1);
			for (const line of lines) {
				if (line.startsWith("---")) {
					lines = lines.slice(1);
					break;
				} else {
					const [key, value] = line.split(":").map(s => s.trim());
					obj[key] = value;
					lines = lines.slice(1);
				}
			}
		}
		return [parsed, lines, obj];
	}
	let attrs = {};
	const parse_md = function (parsed, lines) {
		const parsers = [parse_linebreak, parse_header, parse_list, parse_plain];
		while (lines.length > 0) {
			let obj = {};
			[parsed, lines, obj] = ext_attributes(parsed, lines);
			for (const [key, value] of Object.entries(obj)) {
				attrs[key] = value;
			}
			for (const ps of parsers) {
				const p = ps(parsed, lines);
				//console.log(p);
				if (p != undefined) {
					[parsed, lines] = p;
					break;
				}
			}
		}
		return parsed;
	}
	const parsed = parse_md("", lines);
	const res = `${parsed}`;
	const doc = parser.parseFromString(res, "text/html");
	for (const [key, value] of Object.entries(attrs)) {
		doc.body.setAttribute(key, value);
	}
	return doc.body;
}

function display(content) {
	const dom = document.querySelectorAll("content")[0];
	dom.childNodes.forEach(node => {
		dom.removeChild(node);
	});
	dom.appendChild(parseMD(content));
}

function main(params) {
	fetch("./test.md").then(res => res.text().then(value => display(value)));

	const inputElement = document.getElementById("file");
	inputElement.addEventListener("change", handleFiles, false);
	function handleFiles() {
		const fileList = this.files;
		const reader = new FileReader();
		reader.addEventListener(
			"load",
			() => {
				display(reader.result);
			},
			false,
		);
		reader.readAsText(fileList[0])
	}

}

document.addEventListener("DOMContentLoaded", (ev) => {
	main();
});