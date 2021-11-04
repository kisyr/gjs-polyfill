const { GLib } = imports.gi;

function homedir() {
	return GLib.get_home_dir();
}

module.exports = {
	homedir,
};

