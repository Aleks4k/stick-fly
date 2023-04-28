function rectCollision(rectA, rectB) {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.height + rectA.y > rectB.y
  );
}

onmessage = function(event){ //Does not check task because we wont send any other task here expect 'check'
	if(rectCollision(event.data.arg_1, event.data.arg_2)){
		postMessage(true);
	} else {
		postMessage(false);
	}
}