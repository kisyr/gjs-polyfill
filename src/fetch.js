const Soup = imports.gi.Soup;

function Response(session, message) {
	this.headers = message.response_headers;
	this.url = message.get_uri().to_string(false);
	this.status = message.status_code;
	this.statusText = Soup.status_get_phrase(this.status);
	this.ok = this.status >= 200 && this.status <= 299;

	const retrieve = new Promise(resolve => {
		resolve(message);
	});

	this.text = function() {
		return retrieve.then(r => r.response_body.data.toString());
	};

	this.json = function() {
		return retrieve.then(r => JSON.parse(r.response_body.data.toString()));
	};

	this.blob = function() {
		return retrieve.then(r => JSON.parse(r.response_body.data));
	};
}

function fetch(uri, options = {
	method: 'GET',
}) {
	const session = new Soup.SessionAsync();

	Soup.Session.prototype.add_feature.call(
		session,
		new Soup.ProxyResolverDefault(),
	);

	const message = new Soup.Message({
		method: options.method,
		uri: new Soup.URI(uri),
	});

	if (options.headers) {
		Object.entries(options.headers).forEach(([ key, value ]) => {
			message.request_headers.append(key, value);
		});
	}

	if (options.body) {
		message.request_body.append(options.body);
	}

	return new Promise(resolve => {
		session.queue_message(message, (session, message) => {
			resolve(new Response(session, message));
		});
	});
};

module.exports = fetch;

