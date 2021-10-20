const Gio = imports.gi.Gio;

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
	exec,
};

