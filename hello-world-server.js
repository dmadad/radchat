var http = require('http');
var fs = require('fs');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var connectHandler = function connected() {
	   console.log('connection succesful.');
	  
	   // Fire the data_received event 
	   eventEmitter.emit('data_received');
	};

eventEmitter.on('connection', connectHandler);

//Bind the data_received event with the anonymous function
eventEmitter.on('data_received', function(){
   console.log('data received succesfully.');
});

//Fire the connection event 

console.log("Program Ended.");

/*
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({ contactPoints: ['10.211.55.101']});
client.connect(function (err) {
  console.log("connection error",err.info);
});

var query = "select user_id,group_id,audio_id from voice_by_group where group_id = 100";
client.execute(query, function (err, result) {
	for (var i = 0; i < result.rows.length; i++) {
		console.log('id=' + result.rows[i].get('user_id') + ' test_value=' + result.rows[i].get('audio_id'));
	}
});*/



var cql = require('node-cassandra-cql');

var client = new cql.Client({hosts: ['54.174.32.37:9042'], keyspace: 'radchat'});

client.execute('select * from voice_by_group', [],

  function(err, result) {

    if (err) {
		console.log('execute failed', err);

    } else {
    	console.log('DATA from table ');
		for (var i = 0; i < result.rows.length; i++) {
			console.log('id=' + result.rows[i].get('user_id') + ' test_value=' + result.rows[i].get('audio_id'));
		}
		
		process.exit(0);
    }

  }
);


http.createServer(function handler(req, res) {
	var data = fs.readFile("README.md", function(err, data) {
		 console.log(data.toString());
		 console.log("data read finished Ended");
	});
	data="new text";
	eventEmitter.emit('connection');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World first application \n'+data);
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
