module.exports = {
	firstMessage: function(connection) {
		connection.send('["version",[2,"TiXchat web","b6c975f971ea"]]');
	},
	login: function(credentials, connection) {
		connection.send('["request", {"method":"login", "params": {"email":"' + credentials.email + '","password":"' + credentials.password + '" }, "id":1 }]');
	},
	auth: function(cookies, connection) {
		connection.send('["auth",{"cookie":"' + cookies + '","localSettings":{}}]')
	},
	parseCookies: function(msg) {
		var msg = JSON.parse(msg);
		var cookies = ''
		if (msg[0] === 'response') {
			if (msg[1].id === 1) {
				cookies = msg[1].data.cookie;
			}
		}
		return cookies;
	},
	getUser: function(msg) {
		var msg = JSON.parse(msg);
		if (msg[0] === 'auth') {
			return msg[1].user;
		}
		return null;
	},
	ping: function(connection) {
		connection.send('["ping"]');
	},
	collectCookies: function(user, connection) {
		connection.send('["request",{"scope":"user","user":"' + user.id + '","method":"allowance"}]');
		console.log('user: ' + user.displayName + ' | ' + user.id + '  \r\n  email ' + user.email + '  \r\n  cookies ' + user.coins);
	},
	changeKarma: function(karmaOpts, connection) {
		var karmaAction = '',
			diff = 0;

		if (karmaOpts.karmaDiff > 0) {
			karmaAction = 'plusKarma';
			diff = 1;
		} else if (karmaOpts.karmaDiff < 0) {
			karmaAction = 'minusKarma';
			diff = -1;
		} else {
			return;
		}

		for (var i = Math.abs(karmaOpts.karmaDiff) - 1; i >= 0; i--) {
			connection.send('["request",{"scope":"user","user":"' + karmaOpts.karmaId + '","method":"karmaTransaction","params":{"amount":"' + diff + '","action":"' + karmaAction + '"}}]');
		};
		console.log('karma was changed for user ' + karmaOpts.karmaId + ' by ' + karmaOpts.karmaDiff);
	}
}
