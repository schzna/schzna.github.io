import { flash, stdout, del, clear, copyright } from "./display.js";
import { FileSystem } from "./filesystem.js";

const fs = new FileSystem("localStorage");

function init() {
	document.addEventListener("keypress", input);
	document.addEventListener("keyup", input_ctrl);

	fetch('https://schzna.github.io/index.html', { method: 'GET', mode: 'cors', headers: new Headers() })
		.then((response) => response.text()).then(data => console.log(data));

	stdout('This is a schzna\'s computer(for PC visitor).\n');
	stdout('This terminal prints downward.\n');
	stdout('\'help\' command gives you more detail.\n')
	copyright();
	stdout(prompt);
	flash();
	setInterval(flash, 10_000);
}

const prompt = ">";
let stdin = "";

function parse_cmd(str) {
	return str.split(' ');
}

function input_ctrl(e) {
	switch (e.key) {
		case "Backspace":
			if (stdin.length > 0) {
				stdin = stdin.slice(0, -1);
				del();
			}
			break;
		default:
			break;
	}
}

function help() {
	stdout("\'clear\' : clear the terminal buffer.\n");
	stdout("\'exit\' : exit this computer.\n");
	stdout("\'create\' [file] : create [file].\n");
	stdout("\'cat\' [file] : shows the contents of [file].\n");
	stdout("\'rm\' [file] : remove [file].\n");
	stdout("\'ls\' : list files. there are no directories now.\n");
	stdout("\'copyright\' : display copyright.\n");
}

function input(e) {
	let c = String.fromCharCode(e.keyCode);
	stdout(c);
	switch (c) {
		case "\r":
			{
				const cmd = parse_cmd(stdin);
				stdout("\n");
				switch (cmd[0]) {
					case "clear":
						clear();
						break;
					case "help":
						help();
						break;
					case "create":
						fs.create_file(cmd[1], "file", cmd[2]);
						break;
					case "cat":
						stdout(`${fs.get_file(cmd[1]).content}\n`);
						break;
					case "rm":
						const res = fs.remove_file(cmd[1]);
						if (res === undefined) {
							stdout(`not found ${cmd[1]}\n`);
						} else {
							stdout(`${cmd[1]} removed\n`);
						}
						break;
					case "ls":
						const fl = fs.list_files();
						fl.forEach(f => {
							stdout(`${f}\n`);
						});
						break;
					case "copyright":
						copyright();
						break;
					case "exit":
						window.location.href = "/modules/modules.html"
						break;
					case "":
						break;
					default:
						stdout(`command not found '${cmd[0]}' \n`);
						break;
				}
				stdout(prompt);
				stdin = "";
			}
			break;
		default:
			{
				stdin += c;
			}
			break;
	}

	flash();
}

document.addEventListener("DOMContentLoaded", init);