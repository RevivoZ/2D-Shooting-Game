var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv, {});
var looper;
var canvWidth = 400;
var canvHeight = 400;
var users = [];

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
serv.listen(80);

console.log('server Started');


// Player Constractor
function circ(_nick, _id, _radi, _team) {

	this.nick = _nick;
	this.id = _id;
	this.team = _team;
	this.x = this.team ? (canvWidth - 20) : 20;
	this.y = Math.random() * (canvHeight - 20);
	this.vx = 0;
	this.vy = 0;
	this.radius = _radi;
	this.color = this.team ? 'red' : 'blue';
	this.arrows = [];

}

// Arrow Constractor
function arrow(_x, _y) {

	this.x = _x;
	this.y = _y;
	this.vx = 0;
	this.vy = 0;
	this.radius = 5;
	this.color = 'black';

}

// 100 100
// 110 200

// The Main Loop For All Objects Movement
function loop() {

	for (i = 0; i < users.length; i++) {
		users[i].x += users[i].vx;
		users[i].y += users[i].vy;
	}

	io.sockets.emit('update', users);
}
looper = setInterval(loop, 20);


// Socket.IO Controller
io.sockets.on('connection', function (socket) {
	console.log('User Connect !');


	// Create A New User
	socket.on('new user', function (data) {
		users.push(new circ(data, socket.id, 10, (users.length % 2 == 0)));
		console.log(users);
		if (users.length % 2 == 0 && users.length > 0) {
			io.sockets.emit('update', users);
		}

	});

	// Change Direction Of Object
	socket.on('change direction', function (data) {
		for (i = 0; i < users.length; i++) {
			if (socket.id == users[i].id) {
				users[i].vx = data.vx;
				users[i].vy = data.vy;
				io.sockets.emit('update', users);
				return;
			}
		}
	})

	// Shoot 
	socket.on('shoot', function (data) {
		for (i = 0; i < users.length; i++) {
			if (socket.id == users[i].id) {
				var arrow = new arrow(users[i].x, users[i].y)
				arrow.vx = 0;
				arrow.vy = 0;

				users[i].arrows.push(arrow);
				return;
			}
		}
	})

	// User Disconnect
	socket.on('disconnect', function (data) {
		console.log('User Disconnect !');


	})



});
