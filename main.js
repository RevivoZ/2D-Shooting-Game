var canvas = document.getElementById("canv");
var ctx = canvas.getContext('2d');
var points = document.getElementById("counter");
var counterPoints = 0
var looper;
var spaceX;
var spaceY;
var bodySize = [];
var speed = 1;



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



function clear() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

}


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
			var snakeLength =
				points.innerHTML = "Points : " + counterPoints;

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
			window.cancelAnimationFrame(looper);
			player.vx = -speed;
			player.vy = 0;
			movement();
			break;
		case 38: // Up
			window.cancelAnimationFrame(looper);
			player.vx = 0;
			player.vy = -speed;
			movement();
			break;
		case 39: // Right
			window.cancelAnimationFrame(looper);
			player.vx = speed;
			player.vy = 0;
			movement();
			break;
		case 40: // Down
			window.cancelAnimationFrame(looper);
			player.vx = 0;
			player.vy = speed;
			movement();
			break;
	}

}


bodySize.push(new circ(canvas.width / 2, canvas.height / 2, 5, 'green'));
var player = new circ(canvas.width / 2, canvas.height / 2, 10, 'blue');


function witRand() {
	return Math.floor((Math.random() * canvas.width));
}

function heiRand() {
	return Math.floor((Math.random() * canvas.height));
}




var apple = new circ(witRand(), heiRand(), 10, 'red');

player.draw();
apple.draw();
