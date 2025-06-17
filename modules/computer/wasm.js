function parse_uN(N, code, i) {
	let k = i;
	let res = 0;
	while (code[k] >= (1 << 7) && k < (i + N / 8) && k < code.length) {
		res += ((code[k] - (1 << 7)) << (7 * (k - i)));
		k += 1;
	}
	res += (code[k] << (7 * (k - i)));
	return {
		"num": res,
		"i": k + 1
	};
}

function parse_sN(N, code, i) {
	let k = i;
	let res = 0;
	while (code[k] >= (1 << 7) && k < (i + N / 8) && k < code.length) {
		res += ((code[k] - (1 << 7)) << (7 * (k - i)));
		k += 1;
	}
	if (code[k] < (1 << 6)) {
		res += (code[k] << (7 * (k - i)));
	} else {
		res += ((code[k] - (1 << 7)) << (7 * (k - i)));
	}

	return {
		"num": res,
		"i": k + 1
	};
}

function parse_name(code, i) {
	const { i: k, num: n } = parse_uN(32, code, i);
	return {
		size: n,
		name: code.slice(k, k + n),
		i: k + n
	};
}

function parse_section(code, i) {
	const N = code[i];
	const { num: size, i: ii } = parse_uN(32, code, i + 1);
	return {
		"N": N,
		"size": size,
		"i": ii + size,
		pre_i: ii
	};
}

function parse_custom_section(code, i) {
	const info = parse_section(code, i);
	if (info.N != 0) {
		return undefined;
	}
	const name = parse_name(code, info.pre_i);
	return {
		i: info.i,
		name: name,
		content: code.slice(name.i, info.i)
	};
}

function parse_const(c, code, i) {
	const ok = code.slice(i, c.length).every((val, i) => val == c[i]);
	return ok;
}

function parse_more(f, code, i, lim = 0) {
	let res = [];
	let k = i;
	let count = 0;
	while ((res.length == 0 || res[res.length - 1] != undefined) && (lim == 0 || count < lim + 1)) {
		res.push(f(code, k));
		if (res[res.length - 1] != undefined) {
			k = res[res.length - 1]["i"];
		}
		count += 1;
	}
	res.pop();
	return {
		"elems": res,
		"i": (res.length > 0) ? (res[res.length - 1]["i"]) : i
	};
}

function parse_vec(f, code, i) {
	const n = parse_uN(32, code, i);
	if (n.num == 0) {
		return {
			elems: [],
			i: n.i,
			size: n.num
		};
	}
	const B = parse_more(f, code, n.i, n.num);
	return {
		elems: B.elems,
		i: B.i,
		size: n.num
	};
}

function parse_valtype(code, i) {
	let type = "";
	switch (code[i]) {
		case 0x7f:
			type = "i32";
			break;
		case 0x7e:
			type = "i64";
			break;
		case 0x7d:
			type = "f32";
			break;
		case 0x7c:
			type = "f64";
			break;
		case 0x7b:
			type = "v128";
			break;
		case 0x70:
			type = "funcref";
			break;
		case 0x6f:
			type = "externref";
			break;
		default:
			break;
	}
	if (type.length == 0) {
		return undefined;
	}
	return {
		type: type,
		i: i + 1
	}
}

function parse_functype(code, i) {
	if (code[i] != 0x60) {
		return undefined;
	}
	const rt1 = parse_vec(parse_valtype, code, i + 1);
	if (rt1 == undefined) {
		return undefined;
	}
	const rt2 = parse_vec(parse_valtype, code, rt1.i);
	if (rt2 == undefined) {
		return undefined;
	}
	return {
		rt1: rt1.elems,
		rt2: rt2.elems,
		i: rt2.i
	}
}

function parse_type_section(code, i) {
	const info = parse_section(code, i);
	if (info.N != 1) {
		return undefined;
	}
	const fts = parse_vec(parse_functype, code, info.pre_i);
	if (fts == undefined) {
		return undefined;
	}
	return {
		fts: fts.elems,
		size: info.size,
		N: info.N
	}
}


function parse_import_section(code, i) {
	const info = parse_section(code, i);
	if (info.N != 2) {
		return undefined;
	}
	return {
		size: info.size,
		N: info.N
	}
}

function parse_module(code) {
	if (parse_const([0x00, 0x61, 0x73, 0x6d], code, 0)) {
		console.log("Wasm module magic detected.");
	}
	if (parse_const([0x01, 0x00, 0x00, 0x00], code, 4)) {
		console.log("Wasm version 1.0.");
	}
	let customs = []
	customs.push(parse_more(parse_custom_section, code, 8));
	const type_sec = parse_more(parse_type_section, code, customs[customs.length - 1].i);
	customs.push(parse_more(parse_custom_section, code, 8));
	console.log(type_sec);

}

function f(buf) {
	let bytes = new Uint8Array(buf);
	console.log(bytes);
	parse_module(bytes);
}

function test() {
	//console.log(parse_uN(32, [0x80, 0x01], 0));
	//console.log(parse_uN(32, [0xE5, 0x8E, 0x26], 0));
	//console.log(parse_sN(32, [0xC0, 0xBB, 0x78], 0));

	fetch("./simple.wasm").then(res => res.arrayBuffer().then(buf => f(buf)));
}

document.addEventListener("DOMContentLoaded", test);