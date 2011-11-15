var net = require('net');

/*
// Serve up an HTML page
var app = require('http').createServer(function( req, res ){
	require('fs').readFile(__dirname + '/index.html', function (err, data) {
		res.writeHead(200);
		res.end(data);
	});
});
app.listen(8000);

// Bind socket.io to HTTP
var io = require('socket.io').listen(app);
io.sockets.on('connection', function (websocket) {
	
	websocket.emit('hello','world');
	
});
*/


// Set up TCP server
var sockets = [];
var server = net.createServer(function(socket){
	sockets.push(socket);
	
	socket.write('Hello');
	socket.on('data',function(data){
		for ( var i = 0; i < sockets.length; i++ ){
			if ( socket != sockets[i] ) {
				sockets[i].write(data);
			}
		}
		//io.sockets.emit('data',data);
	})
	
});
server.listen(8100);