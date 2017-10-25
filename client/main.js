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
	console.log('here');



})

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

function movement() {
	clear();

	player.x += player.vx;
	player.y += player.vy;

	// Apple Eating Check
	if (Math.abs(player.x - apple.x) <= apple.radius * 2) {
		if (Math.abs(player.y - apple.y) <= apple.radius * 2) {
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


function playerMovement(keyCode) {

	switch (keyCode) {
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

	if (map.length >= 2) {

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

	if (map.length < 2) {
		if (map.length > 0) {
			if (map[0] == event.keyCode) {
				return;
			}
		}

		map.push(event.keyCode);
	}
	playerMovement(event.keyCode);
	console.log(map);
}


function keyListenUP(e) {

	console.log(map + " : " + e.keyCode);

	e.keyCode == map[0] ? map.splice(0, 1) : map.splice(1, 1);
	console.log(map);

	if (map.length >= 1) {
		playerMovement(map[0]);

	} else {
		socket.emit('change direction', {
			vx: 0,
			vy: 0
		});
	}

}


function witRand() {
	return Math.floor((Math.random() * canvas.width));
}

function heiRand() {
	return Math.floor((Math.random() * canvas.height));
}

var shootLoop;
canvas.addEventListener('mousedown', function (e) {

	shootLoop = setInterval(function () {
		socket.emit('shoot', {
			x: e.clientX,
			y: e.clientY
		});
	}, 200);



});

canvas.addEventListener('mouseup', function (e) {

	clearInterval(shootLoop);

});

/*
canvas.addEventListener('mousemove', function (e) {
	ball.y = e.clientY;
});*/
