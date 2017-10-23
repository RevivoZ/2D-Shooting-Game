var socket = io();
var canvas = document.getElementById("canv");
var ctx = canvas.getContext('2d');
var points = document.getElementById("counter");
var counterPoints = 0;
var looper;
var spaceX;
var spaceY;
var bodySize = [];
var speed = 1;
var users;


$("#SendNick").click(function () {
	$("#darkBox").hide(300);
	socket.emit('new user', document.getElementById('nickName').value);
})

socket.on('update', function (data) {
	clear();
	for (i = 0; i < data.length; i++) {
		draw(data[i]);
	}
})

function draw(data) {
	ctx.beginPath();
	ctx.arc(data.x, data.y, data.radius, 0, 2 * Math.PI);
	ctx.fillStyle = data.color;
	ctx.fill();
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*

function circ(_x, _y, _radi, _colo) {

	this.x = _x;
	this.y = _y;
	this.vx = 0;
	this.vy = 0;
	this.radius = _radi;
	this.color = _colo;

	this.draw = function () {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	this.drawBody = function () {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}


*/


function movement() {
	clear();

	player.x += player.vx;
	player.y += player.vy;

	// Apple Eating Check
	if (Math.abs(player.x - apple.x) <= apple.radius * 1.7) {
		if (Math.abs(player.y - apple.y) <= apple.radius * 1.7) {
			counterPoints++;
			apple.x = witRand();
			apple.y = heiRand();
			var snakeLength = points.innerHTML = "Points : " + counterPoints;
		}
	}

	// Walls Check
	if (player.x >= canvas.width) {
		player.x = 0;
	} else if (player.y >= canvas.height) {
		player.y = 0;
	} else if (player.x <= 0) {
		player.x = canvas.width;
	} else if (player.y <= 0) {
		player.y = canvas.height;
	}

	player.draw();
	apple.draw();

	looper = window.requestAnimationFrame(movement);

}

function keyListen(event) {
	switch (event.keyCode) {
		case 37: // Left
			socket.emit('change direction', {
				vx: -speed,
				vy: 0
			});
			break;
		case 38: // Up
			socket.emit('change direction', {
				vx: 0,
				vy: -speed
			});
			break;
		case 39: // Right
			socket.emit('change direction', {
				vx: speed,
				vy: 0
			});
			break;
		case 40: // Down
			socket.emit('change direction', {
				vx: 0,
				vy: speed
			});
			break;
	}

}


function witRand() {
	return Math.floor((Math.random() * canvas.width));
}

function heiRand() {
	return Math.floor((Math.random() * canvas.height));
}


canvas.addEventListener('click', function (e) {

	socket.emit('shoot', {
		x: e.clientX,
		y: e.clientY
	});

});

/*
canvas.addEventListener('mousemove', function (e) {
	ball.y = e.clientY;
});*/
