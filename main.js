var http = require('http');
var cassandra = require('cassandra-driver');
var async = require('async');
var dispatcher = require('httpdispatcher');
var cql = require('node-cassandra-cql');

const
PORT = 8090;

//Lets use our dispatcher
function handleRequest(request, response) {
	try {
		//log the request on console
		console.log(request.url);
		//Disptach
		dispatcher.dispatch(request, response);
	} catch (err) {
		console.log(err);
	}
}

//For all your static (js/css/images/etc.) set the directory name (relative path).
dispatcher.setStatic('resources');

//A sample GET request    
dispatcher.onGet("/page1", function(req, res) {
	res.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	
//	var client = new cql.Client({
	//	hosts : [ '54.174.32.37:9042' ],
		//keyspace : 'radchat',
	//	user : 'cassandra',
//		pass : 'YSBpQ10fqd5B1'
	//});
	
	var client = new cassandra.Client({contactPoints: ['54.174.32.37'], keyspace: 'radchat', authProvider : new cassandra.auth.PlainTextAuthProvider('cassandra', 'YSBpQ10fqd5B')});
	//console.log('clinet code executed');
		
	client.execute('select * from t', [],
			function(err, result) {
				console.log('inside funct');
				if (err) {
					console.log('execute failed', err);

				} else {
					console.log('execute success');
					for (var i = 0; i < result.rows.length; i++) {
						console.log('id=' + result.rows[i].get('pk') + ' test_value='+ result.rows[i].get('v'));
					}
					
					
					res.end('Page One');
					//process.exit(0);
				}

			});
	
});

//A sample GET request    
dispatcher.onGet("/post1", function(req, res) {
	res.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	res.end('Post One');
});

//A sample POST request
dispatcher.onPost("/post1", function(req, res) {
	res.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	res.end('Got Post Data');
});



var server = http.createServer(handleRequest);

server.listen(PORT, function() {
	console.log("Server listening on: http://localhost:%s", PORT);
});
