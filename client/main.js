var socket = io();
var canvas = document.getElementById("canv");
var ctx = canvas.getContext('2d');
var points = document.getElementById("counter");
var counterPoints = 0;
var looper;
var spaceX;
var spaceY;
var bodySize = [];
var speed = 3;
var users;
var shootLoop;
var mouseX;
var mouseY;
var map = [];



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

socket.on('gameOver', function (data) {

 // delete();

})
function _delete(){
	console.log('hello!!');

}

function draw(data) {
	ctx.beginPath();
	ctx.arc(data.x, data.y, data.radius, 0, 2 * Math.PI);
	ctx.fillStyle = data.color;
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(data.x - 20, data.y + 25);
	ctx.lineTo(data.x - 20 + data.health, data.y + 25);

	ctx.closePath();

	ctx.strokeStyle = 'green';
	ctx.lineWidth = 5;
	ctx.stroke();


	for (j = 0; j < data.arrows.length; j++) {
		ctx.beginPath();
		ctx.arc(data.arrows[j].x, data.arrows[j].y, data.arrows[j].radius, 0, 2 * Math.PI);
		ctx.fillStyle = data.arrows[j].color;
		ctx.fill();
	}

}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}



function playerMovement() {

	if (map.length == 1) {
		switch (map[0]) {
			case 65: // Left
				socket.emit('change direction', {
					vx: -speed,
					vy: 0
				});
				break;
			case 87: // Up
				socket.emit('change direction', {
					vx: 0,
					vy: -speed
				});
				break;
			case 68: // Right
				socket.emit('change direction', {
					vx: speed,
					vy: 0
				});
				break;
			case 83: // Down
				socket.emit('change direction', {
					vx: 0,
					vy: speed
				});
				break;
		}
	} else {

		switch (map.join(' ')) {

			// Up Left
			case '87 65':
			case '65 87':
				socket.emit('change direction', {
					vx: -(speed / 2),
					vy: -(speed / 2)
				});
				break;
				// Up Right
			case '87 68':
			case '68 87':
				socket.emit('change direction', {
					vx: (speed / 2),
					vy: -(speed / 2)
				});
				break;
				// Down Right
			case '83 68':
			case '68 83':
				socket.emit('change direction', {
					vx: (speed / 2),
					vy: (speed / 2)
				});
				break;
				// Down Left
			case '83 65':
			case '65 83':
				socket.emit('change direction', {
					vx: -(speed / 2),
					vy: (speed / 2)
				});
				break;
		}
	}
}

function keyListen(event) {

	for (i = 0; i < map.length; i++) {
		if (event.keyCode == map[i]) {
			return;
		}
	}
	map.push(event.keyCode);
	playerMovement();
}

function keyListenUP(e) {

	for (i = 0; i < map.length; i++) {
		if (e.keyCode == map[i]) {
			map.splice(i, 1);
		}
	}

	if (map.length >= 1) {
		playerMovement();

	} else {
		socket.emit('change direction', {
			vx: 0,
			vy: 0
		});
	}
}



/*************** Mouse Shooting Engine *****************/
function shooting() {
	shootLoop = setInterval(function () {
		socket.emit('shoot', {
			x: mouseX,
			y: mouseY
		});
	}, 150);
}

canvas.addEventListener('mousedown', function (e) {
	clearInterval(shootLoop);
	mouseX = e.clientX;
	mouseY = e.clientY;
	shooting();
});

canvas.addEventListener('mouseup', function (e) {
	mouseDown = false;
	clearInterval(shootLoop);
});

canvas.addEventListener('mousemove', function (e) {
	mouseX = e.clientX;
	mouseY = e.clientY;
});
/******************************************************/
