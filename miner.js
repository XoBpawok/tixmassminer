var Connection = require('./Connection.js'),
	fs = require('fs');

loopFunc();
setInterval(loopFunc, 27 * 60 * 1000);

function loopFunc() {
	console.log('/---------------------------------');
	console.log('Queue started at ' + new Date());
	fs.readFile('options.json', 'utf8', function(err, data) {
		var opts = JSON.parse(data);
		console.log('Read ' + opts.credentials.length + ' accounts')
		for (var i = opts.credentials.length - 1; i >= 0; i--) {
			(function(i){
				var connection = new Connection(opts.credentials[i]);
				var rand = Math.random() * (26 * 60 * 1000 - 2500) + 2500;
				setTimeout(function(connection, opts) {
					console.log('Trying to process account ' + opts.credentials[i].email + '...');
					connection.setKarmaOpts(opts.karma).start();
				}, rand, connection, opts);
			})(i);
		};
	});
}