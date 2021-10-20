const { GLib } = imports.gi;

const setInterval = function(func, delay, ...args) {
	return GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
		func(...args);
		return GLib.SOURCE_CONTINUE;
	});
};

const clearInterval = GLib.source_remove;

const setTimeout = function(func, delay, ...args) {
	return GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
		func(...args);
		return GLib.SOURCE_REMOVE;
	});
};

const clearTimeout = GLib.source_remove;

const log = function(...args) {
	print(...args);
};

const console = { log: print, warn: print, error: print };

const stringify = function(data) {
	return JSON.stringify(data, (key, value) => typeof value === 'undefined' ? null : value);
};

module.exports = {
	setInterval,
	clearInterval,
	setTimeout,
	clearTimeout,
	log,
	console,
	stringify,
};

