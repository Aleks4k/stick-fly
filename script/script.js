//================================== [ Info ] ==================================//
	//Lastest update: 28.04.2023
	//Update log:
		//Added rockets
		//Optimized gameplay
		//Added Multithread support
		//Added Phone support
		//Added Mute, Fullscreen and Pause options.
//================================ [ Variables ] ================================//
var left_button = false;
var right_button = false;
var up_button = false;
var down_button = false;
var dead = true;
var score = 0;
var enemy_timer = 20;
var audio;
var rocket_audio;
var support = false;
var worker = null;
var next_rocket = 0;
var rocket_warning = false;
var isTouch = false;
var joystick = null;
var paused = false;
var user_disabled_fullscreen = false;
//================================ [ Mobile Detection ] ================================//
window.addEventListener("mousemove", computer);
window.addEventListener("touchstart", phone);
//================================ [ Worker Init ] ================================//
if (typeof(Worker) !== "undefined") { //Check if browser support workers.
	support = true;
}
if(window.location.protocol == "file:") { //If you are in local you cant load workers.
	support = false;
}
if(support){
	worker = new Worker('script/check_death.js');
	worker.onmessage = function(event) {
		if(event.data){
			console.log("pwned");
			endGame(false);
		}
	};
}
//================================ [ Classes ] ================================//
class Enemy {
	constructor() {
		//x, y, rotation, speed
		var x = Math.floor(Math.random() * document.body.clientWidth + 20.0);
		var y = window.innerHeight;
		var rotation = Math.random() * 360;
		var speed = Math.floor(window.innerHeight/140) + Math.random() * 3;
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
//==============================================================================//
class RocketWarning {
	constructor(x){
		var y = window.innerHeight - 40;
		var layer = document.getElementById("rocket_layer");
		var div = document.createElement("div");
		var effect = document.createElement("div");
		var img = document.createElement("img");
		div.style.position = "absolute";
		div.style.left = x;
		div.style.top = y + "px";
		img.setAttribute('src', `assets/rocket/rocket_warning.png`);
		img.setAttribute('alt', ``);
		effect.style.animation = "glow 0.3s ease-in-out infinite alternate";
		div.appendChild(effect);
		div.appendChild(img);
		div.id = "rocket_warning_sign";
		layer.appendChild(div);
		if(!isMuted()){
			rocket_audio = new Audio('assets/sounds/rocket_warning.mp3');
			rocket_audio.play();
			rocket_audio.loop = true;
		}
	}
}
//==============================================================================//
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
//================================ [ Listeners ] ================================//
document.addEventListener("keydown", function(event) {
	switch(event.key.toLowerCase()) {
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
		case "arrowright":
			right_button = true;
			break;
		case "arrowleft":
			left_button = true;
			break;
		case "arrowdown":
			down_button = true;
			break;
		case "arrowup":
			up_button = true;
			break;
		case "f":
			toggleFullScreen(true);
			break;
		case "p":
			pause();
			break;
		default:
			break;
	}
});
//==============================================================================//
document.addEventListener("keyup", function(event) {
	switch(event.key.toLowerCase()) {
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
		case "arrowright":
			right_button = false;
			break;
		case "arrowleft":
			left_button = false;
			break;
		case "arrowdown":
			down_button = false;
			break;
		case "arrowup":
			up_button = false;
			break;
		default:
			break;
	}
});
//================================ [ Functions ] ================================//
function computer(){
	isTouch = false;
	console.log("Playing from computer.");
	window.removeEventListener("mousemove", computer);
	window.removeEventListener("touchstart", phone);
	document.getElementById("fullscreen_button").style.display = "none";
}
//==============================================================================//
function phone(){
	isTouch = true;
	console.log("Playing from phone.");
	window.removeEventListener("touchstart", phone);
	window.removeEventListener("mousemove", computer);
}
//==============================================================================//
function pause(){
	if(!dead){
		paused = !(paused);
		if(paused){
			var x = document.body.clientWidth;
			var y = window.innerHeight;
			var div = document.createElement("div");
			var img = document.createElement("img");
			div.style.position = "absolute";
			div.style.left = x/2 - 45 + "px";
			div.style.top = y/2 - 45 + "px";
			img.setAttribute('src', `assets/pause.png`);
			img.setAttribute('alt', ``);
			img.style.width = "90px";
			div.appendChild(img);
			div.id = "pause_info";
			document.body.appendChild(div);
		} else {
			setTimeout(addCloud, 1000);
			setTimeout(loop, 25);
			document.getElementById("pause_info").remove();
		}
	}
}
//==============================================================================//
function toggleFullScreen(by_user) {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
		if(by_user){
			user_disabled_fullscreen = false;
		}
	} else if (document.exitFullscreen) {
		document.exitFullscreen();
		if(by_user){
			user_disabled_fullscreen = true;
		}
	}
}
//==============================================================================//
function startGame(){
	if(isTouch){
		joystick = new JoyStick({
			radius: 80,
			x: window.innerWidth - 100,
			y: window.innerHeight - 100,
			inner_radius: 60
		});
		document.getElementById("pause_button").style.display = "inline";
		if(!user_disabled_fullscreen && !document.fullscreenElement){ //For mobile phones its recommended to play on fullscreen.
			toggleFullScreen(false);
		}
	}
	new Audio('assets/sounds/click.mp3').play();
	dead = false;
	paused = false;
	score = 0;
	enemy_timer = 20;
	//Rocket timer
	initRocket();
	var stick = document.getElementById("stickman");
	//HTML
	document.getElementById("play_button").style.display = "none";
	document.getElementById("tip").style.display = "none";
	document.getElementById("last_score_text").style.display = "none";
	stick.style.display = "inline";
	document.getElementById("cloud_layer").style.display = "inline";
	document.getElementById("smoke_layer").style.display = "inline";
	document.getElementById("enemy_layer").style.display = "inline";
	document.getElementById("score_text").style.display = "inline";
	if(!isTouch){
		document.getElementById("game_tips").style.display = "inline";
		document.getElementById("game_tips").innerHTML = "Press P to pause";
		setTimeout(change_tip, 2000);
	}
	document.getElementById("rocket_layer").style.display = "inline";
	stick.style.top = 35 + 'px';
	stick.style.left = 10 + 'px';
	stick.style.rotate = "y 0deg";
	if(!isMuted()){
		audio = new Audio('assets/sounds/falling.mp3');
		audio.play();
		audio.loop = true;
	}
	setTimeout(addCloud, 1000);
	setTimeout(loop, 25);
}
//==============================================================================//
function mute(){
	new Audio('assets/sounds/click.mp3').play();
	var button = document.getElementById('mute_button');
	if(isMuted()){
		if(!dead){
			if (typeof(audio) !== "undefined") {
				audio.play();
			}
			if (typeof(rocket_audio) !== "undefined" && rocket_warning) {
				rocket_audio.play();
			}
		}
		button.style.backgroundImage = "url(assets/buttons/mute.png)";
	} else {
		if (typeof(rocket_audio) !== "undefined") {
			rocket_audio.pause();
		}
		if (typeof(audio) !== "undefined") {
			audio.pause();
		}
		button.style.backgroundImage = "url(assets/buttons/unmute.png)";
	}
}
//==============================================================================//
function isMuted(){
	var button = document.getElementById('mute_button');
	var prop = window.getComputedStyle(button).getPropertyValue('background-image');
	if(prop.search(/unmute/i) != -1){
		return true;
	}
	return false;
}
//==============================================================================//
function change_tip(){
	if(dead) return;
	if(document.getElementById("game_tips").innerHTML === "Press P to pause"){
		document.getElementById("game_tips").innerHTML = "Press F for fullscreen";
	} else {
		document.getElementById("game_tips").innerHTML = "Press P to pause";
	}
	setTimeout(change_tip, 2000);
}
//==============================================================================//
function endGame(rocket){
	if(isTouch){
		document.getElementById("joystick").remove();
		joystick = null;
		JOYSTICK_DIV = null;
		document.getElementById("pause_button").style.display = "none";
	}
	dead = true;
	paused = false;
	audio.pause();
	if (typeof(rocket_audio) !== "undefined") {
		rocket_audio.pause();
	}
	if(rocket){
		if(!isMuted()){
			rocket_audio = new Audio('assets/sounds/rocket_death.mp3');
			rocket_audio.play();
		}
	}
	document.getElementById("enemy_layer").innerHTML = '';
	document.getElementById("cloud_layer").innerHTML = '';
	document.getElementById("rocket_layer").innerHTML = '';
	document.getElementById("smoke_layer").innerHTML = '';
	document.getElementById("play_button").style.display = "inline-block";
	document.getElementById("tip").style.display = "inline";
	document.getElementById("last_score_text").innerHTML = `Last score: ${score}`;
	document.getElementById("last_score_text").style.display = "block";
	document.getElementById("stickman").style.display = "none";
	document.getElementById("cloud_layer").style.display = "none";
	document.getElementById("rocket_layer").style.display = "none";
	document.getElementById("smoke_layer").style.display = "none";
	document.getElementById("enemy_layer").style.display = "none";
	document.getElementById("game_tips").style.display = "none";
	document.getElementById("score_text").style.display = "none";
}
//==============================================================================//
function initRocket(){
	if(dead || paused) return;
	next_rocket = Math.floor(Math.random() * 160 + 320);
	rocket_warning = false;
}
//==============================================================================//
function launchRocket(x){
	if(dead || paused) return;
	var y = window.innerHeight;
	var layer = document.getElementById("rocket_layer");
	var div = document.createElement("div");
	var img = document.createElement("img");
	var smoke_effect = document.createElement("div");
	div.style.position = "absolute";
	div.style.left = x + "px";
	div.style.top = y + "px";
	img.setAttribute('src', `assets/rocket/rocket.png`);
	img.setAttribute('alt', ``);
	smoke_effect.id = "smoke_effect";
	div.appendChild(smoke_effect);
	div.appendChild(img);
	div.id = "rocket_itself";
	layer.appendChild(div);
}
//==============================================================================//
function addSmoke(top, left){
	if(dead || paused) return;
	var smoke_layer = document.getElementById("smoke_layer");
	var div = document.createElement("div");
	var img = document.createElement("img");
	div.style.position = "absolute";
	div.style.left = left - 7 + "px"; //Rocket width
	div.style.top = top + "px";
	img.setAttribute('src', `assets/rocket/rocket_smoke.png`);
	img.setAttribute('alt', ``);
	img.style.animation = "fadeOut 1.5s";
	div.appendChild(img);
	smoke_layer.appendChild(div);
	img.addEventListener("animationend", function(event) {
		smoke_layer.removeChild(div);
	});
}
//==============================================================================//
function addCloud(){
	if(dead || paused) return;
	new Cloud();
	setTimeout(addCloud, 1000 + Math.random()*500);
}
//==============================================================================//
function rectCollision(rectA, rectB) {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.height + rectA.y > rectB.y
  );
}
//==============================================================================//
function loop(){
	if(dead || paused) return;
	if(isTouch){
		left_button = false;
		right_button = false;
		up_button = false;
		down_button = false;
		if(joystick.up) up_button = true;
		if(joystick.down) down_button = true;
		if(joystick.left) left_button = true;
		if(joystick.right) right_button = true;
	}
	score += 1;
	document.getElementById("score_text").innerHTML = `Score: ${score}`;
	var stick = document.getElementById("stickman");
	var rect = stick.getBoundingClientRect();
	var width = document.body.clientWidth;
	//Check if player is out of bounds.
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
	//Player movements
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
	rect = stick.getBoundingClientRect(); //Get coordinates again, because char could have moved.
	//Update rocket
	if(next_rocket < 0){
		if(rocket_warning){ //Lanuch rocket.
			var r_layer = document.getElementById("rocket_warning_sign");
			var rect_rocket = r_layer.getBoundingClientRect();
			document.getElementById("rocket_layer").innerHTML = '';
			if (typeof(rocket_audio) !== "undefined") {
				rocket_audio.pause();
			}
			rocket_warning = false;
			next_rocket = 9999; //Ignore this.
			launchRocket(rect_rocket.left);
		} else { //Start warning
			rocket_warning = true;
			next_rocket = Math.floor(Math.random() * 40 + 80);
			new RocketWarning(stick.style.left);
		}
	} else {
		if(rocket_warning){
			var r_layer = document.getElementById("rocket_warning_sign");
			var rect_rocket = r_layer.getBoundingClientRect();
			//Update warning position.
			if(Math.abs(rect.left - rect_rocket.left) > 12 * 2)
			{
				if(rect.left < rect_rocket.left)
				{
					r_layer.style.left = rect_rocket.left - 12 + "px";
				}
				else
				{
					r_layer.style.left = rect_rocket.left + 12 + "px";
				}
			}
		}
		next_rocket -= 1;
	}
	var rocket_object = document.getElementById("rocket_itself");
	if(rocket_object != null){ //It means rocket exists.
		var rect_rocket_object = rocket_object.getBoundingClientRect();
		if(rectCollision(rect_rocket_object, rect)){
			endGame(true);
			return;
		}
		rocket_object.style.top = rect_rocket_object.top - Math.floor(window.innerHeight/18) + "px";
		if(!isTouch){ //This can degrade perfomances on phone so much.
			addSmoke(rect_rocket_object.top + 80, rect_rocket_object.left);
		}
		if(rect_rocket_object.bottom < 0){
			document.getElementById("rocket_layer").innerHTML = '';
			initRocket();
		}
	}
	//Update clouds
	var clouds = document.getElementById("cloud_layer").childNodes;
	for (let i = 1; i < clouds.length; i++) {
		var rect_cl = clouds[i].getBoundingClientRect();
		if(rect_cl.bottom < 0){
			clouds[i].remove();
			continue;
		}
		clouds[i].style.top = rect_cl.top - clouds[i].getAttribute('speed') + "px";
	}
	//Enemy
	if(enemy_timer < 0){
		new Enemy();
		enemy_timer = 30 - Math.floor(width / 60) - Math.floor(score / 400);
	} else {
		enemy_timer -= 1;
	}
	//Update obstacles
	var obstacles = document.getElementById("enemy_layer").childNodes;
	for (let i = 1; i < obstacles.length; i++) {
		if(dead || paused) return;
		var rect_cl = obstacles[i].getBoundingClientRect();
		if(rect_cl.bottom < 0){
			obstacles[i].remove();
			continue;
		}
		if(support){
			worker.postMessage({task: 'check', arg_1: rect_cl, arg_2: rect});
		} else { //Browser does not support workers.
			if(rectCollision(rect_cl, rect)){
				endGame(false);
				break;
			}
		}
		obstacles[i].style.top = rect_cl.top - obstacles[i].getAttribute('speed') + "px";
	}
	setTimeout(loop, 25);
}
//================================ [ End ] ================================//