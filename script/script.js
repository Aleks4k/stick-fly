//Varijable
var left_button = false;
var right_button = false;
var up_button = false;
var down_button = false;
var dead = true;
var score = 0;
var enemy_timer = 20;
var audio;

class Enemy {
	constructor() {
		//x, y, rotation, speed
		var x = Math.floor(Math.random() * document.body.clientWidth + 20.0);
		var y = window.innerHeight;
		var rotation = Math.random() * 360;
		var speed = 5 + Math.random() * 1;
		var num = Math.floor(Math.random() * 14 + 1);
		var el = document.getElementById("enemy_layer");
		var div = document.createElement("div");
		var img = document.createElement("img");
		div.style.position = "absolute";
		div.style.left = x + "px";
		div.style.top = y + "px";
		img.setAttribute('src', `assets/obstacles/obstacle_${num}.png`);
		img.setAttribute('alt', ``);
		div.setAttribute('speed', speed);
		div.appendChild(img);
		el.appendChild(div);
	}
}

class Cloud {
	constructor() {
		//x, y, alpha, speed.
		var x = Math.floor(Math.random() * document.body.clientWidth + 20.0);
		var y = window.innerHeight;
		var a = Math.random() * 0.6 + 0.4;
		var speed = 2 + Math.random() * 2;
		var num = Math.floor(Math.random() * 20 + 1);
		var cl = document.getElementById("cloud_layer");
		var div = document.createElement("div");
		var img = document.createElement("img");
		div.style.position = "absolute";
		div.style.left = x + "px";
		div.style.top = y + "px";
		div.style.opacity = a;
		img.setAttribute('src', `assets/clouds/cloud_${num}.png`);
		img.setAttribute('alt', ``);
		div.setAttribute('speed', speed);
		div.appendChild(img);
		cl.appendChild(div);
	}
}

document.addEventListener("keydown", function(event) {
	switch(event.key) {
		case "a":
			left_button = true;
			break;
		case "d":
			right_button = true;
			break;
		case "w":
			up_button = true;
			break;
		case "s":
			down_button = true;
			break;
		case "ArrowRight":
			right_button = true;
			break;
		case "ArrowLeft":
			left_button = true;
			break;
		case "ArrowDown":
			down_button = true;
			break;
		case "ArrowUp":
			up_button = true;
			break;
		default:
			break;
	}
});

document.addEventListener("keyup", function(event) {
	switch(event.key) {
		case "a":
			left_button = false;
			break;
		case "d":
			right_button = false;
			break;
		case "w":
			up_button = false;
			break;
		case "s":
			down_button = false;
			break;
		case "ArrowRight":
			right_button = false;
			break;
		case "ArrowLeft":
			left_button = false;
			break;
		case "ArrowDown":
			down_button = false;
			break;
		case "ArrowUp":
			up_button = false;
			break;
		default:
			break;
	}
});

function startGame(){
	audio = new Audio('assets/sounds/click.mp3');
	audio.play();
	dead = false;
	score = 0;
	enemy_timer = 20;
	var stick = document.getElementById("stickman");
	//HTML
	document.getElementById("play_button").style.display = "none";
	document.getElementById("tip").style.display = "none";
	document.getElementById("last_score_text").style.display = "none";
	stick.style.display = "inline";
	document.getElementById("cloud_layer").style.display = "inline";
	document.getElementById("enemy_layer").style.display = "inline";
	document.getElementById("score_text").style.display = "inline";
	stick.style.top = 35 + 'px';
	stick.style.left = 10 + 'px';
	stick.style.rotate = "y 0deg";
	console.log(typeof audio);
	audio = new Audio('assets/sounds/falling.mp3');
	audio.play();
	audio.loop = true;
	setTimeout(addCloud, 1000);
	setTimeout(loop, 25);
}

function addCloud(){
	if(dead) return;
	new Cloud();
	setTimeout(addCloud, 800 + Math.random()*500);
}

function rectCollision(rectA, rectB) {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.height + rectA.y > rectB.y
  );
}

function loop(){
	if(dead) return;
	score += 1;
	document.getElementById("score_text").innerHTML = `Score: ${score}`;
	var stick = document.getElementById("stickman");
	var rect = stick.getBoundingClientRect();
	var width = document.body.clientWidth;
	if(left_button && !right_button){
		//Move left.
		if(rect.left > 10.0){
			stick.style.left = rect.left - 10 + 'px';
			stick.style.rotate = "y 180deg";
		}
	}
	if(right_button && !left_button){
		if(rect.right < width){
			stick.style.left = rect.left + 10 + 'px';
			stick.style.rotate = "y 0deg";
		}
	}
	if(up_button && !down_button){
		//Move up.
		if(rect.top > 35.0){
			stick.style.top = rect.top - 10 + 'px';
		}
	}
	if(down_button && !up_button){
		//Move down.
		if(rect.bottom + 10 < window.innerHeight){
			stick.style.top = rect.top + 10 + 'px';
		}
	}
	//Check if player is out of bounds.
	rect = stick.getBoundingClientRect(); //Get coordinates again, because char could have moved.
	if(rect.left < 5.0){
		stick.style.left = 0 + 'px';
		stick.style.rotate = "y 0deg";
	}
	if(rect.right > width + 10.0){
		stick.style.left = width - 30.0 + 'px';
		stick.style.rotate = "y 180deg";
	}
	if(rect.top < 30.0){
		stick.style.top = 35 + 'px';
	}
	if(rect.bottom > window.innerHeight){
		stick.style.top = window.innerHeight - 25 + 'px';
	}
	//Update clouds
	var clouds = document.getElementById("cloud_layer").childNodes;
	for (let i = 1; i < clouds.length; i++) {
		var rect_cl = clouds[i].getBoundingClientRect();
		clouds[i].style.top = rect_cl.top - clouds[i].getAttribute('speed') + "px";
		if(rect_cl.bottom < 0){
			clouds[i].remove();
		}
	}
	//Enemy
	if(enemy_timer < 0){
		new Enemy();
		enemy_timer = 20 - Math.floor(score / 200);
	} else {
		enemy_timer -= 1;
	}
	//Update obstacles
	var obstacles = document.getElementById("enemy_layer").childNodes;
	for (let i = 1; i < obstacles.length; i++) {
		var rect_cl = obstacles[i].getBoundingClientRect();
		obstacles[i].style.top = rect_cl.top - obstacles[i].getAttribute('speed') + "px";
		if(rectCollision(rect_cl, rect)){
			dead = true;
			audio.pause();
			document.getElementById("enemy_layer").innerHTML = '';
			document.getElementById("cloud_layer").innerHTML = '';
			document.getElementById("play_button").style.display = "inline-block";
			document.getElementById("tip").style.display = "inline";
			document.getElementById("last_score_text").innerHTML = `Last score: ${score}`;
			document.getElementById("last_score_text").style.display = "block";
			document.getElementById("stickman").style.display = "none";
			document.getElementById("cloud_layer").style.display = "none";
			document.getElementById("enemy_layer").style.display = "none";
			document.getElementById("score_text").style.display = "none";
			break;
		}
		if(rect_cl.bottom < 0){
			obstacles[i].remove();
			continue;
		}
	}
	setTimeout(loop, 25);
}