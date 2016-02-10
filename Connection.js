var WebSocketClient = require('websocket').client,
	Helper = require('./Helper.js');

function Connection(credentials) {
	this.authWS = new WebSocketClient();
	this.mainWS = new WebSocketClient();
	this.credentials = {
		email: credentials.email,
		password: credentials.password
	};
	this.user = null;
}

Connection.prototype.start = function() {
	var self = this;
	self.authWS.connect('wss://tixchat.com/ws/', null, 'https://tixchat.com', {});

	self.authWS.on('connect', function(connection) {
		Helper.firstMessage(connection);
		Helper.login(self.credentials, connection);

		connection.on('message', function(message) {
			if (message.type === 'utf8') {
				var cookies = Helper.parseCookies(message.utf8Data);
				if (cookies) {
					self.startMainWS(cookies);
					// console.log('closing authWS...');
					connection.close();
					self.authWS = null;
				}
			}
		});
	});
}

Connection.prototype.startMainWS = function(cookies) {
	var self = this;
	self.mainWS.connect('wss://tixchat.com/ws/', null, 'https://tixchat.com', {
		'Cookie': 'jauth=' + cookies
	});

	self.mainWS.on('connect', function(connection) {
		Helper.firstMessage(connection);
		Helper.auth(cookies, connection);
		Helper.ping(connection);
		var pingInterval = setInterval(Helper.ping, 2000, connection);

		connection.on('message', function(message) {
			if (message.type === 'utf8') {
				self.user = self.user || Helper.getUser(message.utf8Data);
			}
		});

		setTimeout(function(self, connection, pingInterval) {
			if (self.user) {
				Helper.collectCookies(self.user, connection);
				self.karmaOpts && Helper.changeKarma(self.karmaOpts, connection);
			}
			clearInterval(pingInterval);
			connection.close();
		}, 2000, self, connection, pingInterval);
	});
}

Connection.prototype.setKarmaOpts = function(opts) {
	this.karmaOpts = opts;
	return this;
}

module.exports = Connection;