var http = require('http');

var app = http.createServer(function( req, res ){
	setTimeout(function(){
		res.end("world");
	},1000)
	res.write("Hello");
	res.flush();
	
});

app.listen(8000);