var Connection = require('./Connection.js'),
	fs = require('fs');

loopFunc();
setInterval(loopFunc, 47 * 60 * 1000);

function loopFunc() {
	fs.readFile('options.json', 'utf8', function(err, data) {
		var opts = JSON.parse(data);
		for (var i = opts.credentials.length - 1; i >= 0; i--) {
			(function(i){
				var connection = new Connection(opts.credentials[i]);
				var rand = Math.random() * (17 * 60 * 1000 - 2500) + 2500;
				console.log(rand);
				setTimeout(function(connection, opts) {
					connection.setKarmaOpts(opts.karma).start();
				}, rand, connection, opts);
			})(i);
		};
	});
}