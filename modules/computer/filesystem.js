class StorageInterface{
	constructor() {
	}

	store(key, value) {
		return undefined;
	}

	load(key) {
		return undefined;
	}

	list() {
		return undefined;
	}
}

class VariableStorage extends StorageInterface{
	constructor() {
		super();
		this.storage = {};
	}

	store(key, value) {
		this["storage"][key] = value;
		return true;
	}

	delete(key) {
		delete this["storage"][key];
	}

	load(key) {
		return this["storage"][key];
	}

	list() {
		return Object.keys(this["storage"]);
	}
}

class LocalStorage extends StorageInterface{
	constructor() {
		super();
		if (storage_available('localStorage')) {
			
		}
	}

	store(key, value) {
		localStorage.setItem(key, value);
		return true;
	}

	delete(key) {
		localStorage.removeItem(key);
	}

	load(key) {
		return localStorage.getItem(key);
	}

	list() {
		return Object.keys(localStorage);
	}
}

function storage_available(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

export class FileSystem {
	constructor(type) {
		switch (type) {
			case 'localStorage':
				this.interface = new LocalStorage();
				break;
			case 'default':
				this.interface = new VariableStorage();
				break;		
			default:
				this.interface = new VariableStorage();
				break;
		}
	}

	create_file(name, type, content) {
		this.interface.store(name, JSON.stringify({
			type: type,
			content: content
		}));
		return true;
	}

	get_file(name) {
		return JSON.parse(this.interface.load(name));
	}

	list_files() {
		return this.interface.list();
	}

	remove_file(name) {
		if (this.interface.load(name) != undefined) {
			this.interface.delete(name);
			return true;
		}
		return undefined;
	}
}