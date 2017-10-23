var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv, {});
var users = [];

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
serv.listen(80);

console.log('server Started');


io.sockets.on('connection', function (socket) {
	console.log('User Connect !');
	socket.on('new user' , function (data)){



	}


	socket.on('disconnect', function (data) {
		console.log('User Disconnect');

	})

});
