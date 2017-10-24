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
function Circ(_nick, _id, _radi, _team) {

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
function Arrow(_x, _y) {

	this.x = _x;
	this.y = _y;
	this.vx = 0;
	this.vy = 0;
	this.radius = 5;
	this.color = 'black';

}



// Get Direction For Arrow Shooting
function getDirection(playerX, playerY, mouseX, mouseY) {

	var dircX = mouseX - playerX;
	var dircY = mouseY - playerY;

	var splitX = (dircY / Math.abs(dircX));
	var splitY = (dircX / Math.abs(dircY));

	var totX = 5 / (Math.abs(splitX) + 1);
	var totY = 5 / (Math.abs(splitY) + 1);

	var vx = totX * (dircX / Math.abs(dircX));
	var vy = totY * (dircY / Math.abs(dircY));

	return [vx, vy];
}



/**** The Main Loop For All Objects Movement ****/
function loop() {

	for (i = 0; i < users.length; i++) {
		users[i].x += users[i].vx;
		users[i].y += users[i].vy;

		for (j = 0; j < users[i].arrows.length; j++) {
			users[i].arrows[j].x += users[i].arrows[j].vx;
			users[i].arrows[j].y += users[i].arrows[j].vy;
		}
	}

	io.sockets.emit('update', users);
}
looper = setInterval(loop, 20);
/************************************************/





// Socket.IO Controller
io.sockets.on('connection', function (socket) {
	console.log('User Connect !');


	// Create A New User
	socket.on('new user', function (data) {
		users.push(new Circ(data, socket.id, 10, (users.length % 2 == 0)));
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
				var arrow = new Arrow(users[i].x, users[i].y);

				var direc = getDirection(users[i].x, users[i].y, data.x, data.y);

				arrow.vx = direc[0];
				arrow.vy = direc[1];
				arrow.color = users[i].color;

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
