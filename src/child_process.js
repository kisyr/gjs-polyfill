const Gio = imports.gi.Gio;

// TODO: Conform more to Nodes version; This is enough for now.
function spawn(command, options = {
	stdio: 'pipe',
	detached: false,
}) {
	const commandArray = typeof command === 'string'
		? command.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/)
		: command;

	let flags = 0;

	if (options.stdio === 'pipe') {
		flags =
			Gio.SubprocessFlags.STDIN_PIPE |
			Gio.SubprocessFlags.STDOUT_PIPE |
			Gio.SubprocessFlags.STDERR_PIPE;
	}

	const proc = new Gio.Subprocess({
		argv: commandArray,
		flags: flags,
	});

	proc.init(null);

	return {
		unref: () => {},
	};
}

function exec(command) {
	const commandArray = typeof command === 'string'
		? command.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/)
		: command;

	const proc = new Gio.Subprocess({
		argv: commandArray,
		flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE,
	});

	proc.init(null);

	return new Promise((resolve, reject) => {
		proc.communicate_utf8_async(null, null, (proc, result) => {
			const [ ok, stdout, stderr ] = proc.communicate_utf8_finish(result);
			resolve({ stdout, stderr });
		});
	});
}

module.exports = {
	spawn,
	exec,
};

