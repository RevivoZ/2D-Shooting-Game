var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv, {});
var looper;
var users = [];

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
serv.listen(80);

console.log('server Started');


// Player Constractor
function circ(_nick, _id, _x, _y, _radi, _team) {

	this.nick = _nick;
	this.id = _id;
	this.x = _x;
	this.y = _y;
	this.vx = 0;
	this.vy = 0;
	this.radius = _radi;
	this.team = _team;
	this.color = this.team ? 'red' : 'blue';

}


// The Main Loop For All Objects Movement
function loop() {
	io.sockets.emit('hey');
}
looper = setInterval(loop, 500);


// Socket.IO Controller
io.sockets.on('connection', function (socket) {
	console.log('User Connect !');


	// Create A New User
	socket.on('new user', function (data) {
		users.push(new circ(data, socket.id, 0, 0, 10, (users.length % 2 == 0)));
	});

	// User Disconnect
	socket.on('disconnect', function (data) {
		console.log('User Disconnect !');

	})



});
