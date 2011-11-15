var http = require('http'),
	fs = require('fs'),
	TagEmitter = require('./tag-emitter.js').TagEmitter,
	socketio = require('socket.io');


var emitter = new TagEmitter({
	track:'WhatYouFindInLadiesHandbags,codeken2011'
});


var app = http.createServer(function( req, res ){
	
	fs.readFile(__dirname + '/index.html', function (err, data) {
		res.writeHead(200);
		res.end(data);
	});
	
});

app.listen(8000);

var io = socketio.listen(app);

io.sockets.on('connection', function (socket) {
	
	setTimeout(function(){
		socket.emit('hello','world');
	},1000);
});














/*


var TagEmitter = require('./tag-emitter');
var http = require('http');
//var socketio = require('socket.io');
var fs = require('fs');


var searchEmitter = new TagEmitter({
	track:'richmarr,ThingsPeopleShouldntDo'
});
	

var app = http.createServer(function(req,res){
	fs.readFile(__dirname + '/index.html', function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		res.writeHead(200);
		res.end(data);
	});
});

app.listen(8900);

var io = socketio.listen(app);

io.sockets.on('connection', function (socket) {
	searchEmitter.on('tweet',function(tweet){
		socket.emit('search-tweet',tweet);
	});
	socket.on('filter',function(value){
		socket.emit('debug','switching search to monitor '+value.text);
		console.log('switching search to monitor '+value.text)
		searchEmitter.close();
		searchEmitter = new TagEmitter({
			track:value.text
		});
	});
});



/*

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(80);

function handler (req, res) {
	fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});*/