let buffer = "";

export function flash() {
	document.body.querySelectorAll("*").forEach(elem => {
		elem.remove();
	});
	document.body.insertAdjacentHTML('beforeend', '<terminal></terminal>');
	const terminal = document.querySelector("terminal");
	const lines = buffer.split('\n');
	lines.forEach((line, i) => {
		if (i == (lines.length-1)) {
			terminal.insertAdjacentHTML('afterbegin', `<line><stdout>${line}</stdout><csr>|</csr> </line> <br/>`);
		} else {
			terminal.insertAdjacentHTML('afterbegin', `<line><stdout>${line}</stdout></line> <br/>`);
		}
	});
}

export function clear() {
	buffer = "";
}

export function stdout(str) {
	buffer += str;
	flash();
}

export function del() {
	buffer = buffer.slice(0, -1);
	flash();
}