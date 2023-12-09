const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 600;

function createRect(x,y,width,height,color){

    context.fillStyle = color;
    context.fillRect(x,y,width,height)
}

// computer paddle
const com = {
    x: canvas.width/2,
    y: 10,
    width: 100,
    height: 10,
    color : "blue",
    score :0

}

// user Paddle
const user = {
    x: canvas.width/2,
    y: canvas.height-20,
    width: 100,
    height: 10,
    color : "blue",
    score: 0

}

// center Line
function centerLine(){
    context.beginPath();
    context.setLineDash([6]);
    context.moveTo(0,canvas.height/2);
    context.lineTo(canvas.width,canvas.height/2);
    context.strokeStyle = "white",
    context.stroke();
}

// draw a circle
function drawCircle(x,y,r,color){
    context.beginPath();
    context.arc(x,y,r,2*Math.PI,false);
    context.fillStyle= color;
    context.fill()
}

// create a ball
const ball={
    x: canvas.width/2,
    y: canvas.height/2,
    r:10,
    speed:1,
    velocityX: 5,
    velocityY: 5,
    color: "yellow"
}

// draw text
function drawText(text,x,y,color){
    context.fillStyle= color;
    context.font = "32px josefin sans";
    context.fillText(text,x,y)
}

function render(){
    // call create Rect
    createRect(0,0,1200,600,"green");

    // compter Paddle
    createRect(com.x,com.y,com.width,com.height,com.color)

    // user Paddle
    createRect(user.x,user.y,user.width,user.height,user.color)

    // center :Line
    centerLine();

    // draw a circle
    drawCircle(ball.x,ball.y,ball.r,ball.color);

    // draw Text
    drawText(com.score,10,canvas.height/2-30)

    // draw Text
    drawText(user.score,10,canvas.height/2+50)

}
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(e){
    let rect = canvas.getBoundingClientRect();
    user.x = e.clientX - rect.left - user.width/2
}

// collession detection
function collession(b,p){ //b=ball, p=player
    b.top = b.y - b.r;
    b.bottom = b.y + b.r
    b.left = b.x -b.r
    b.right = b.x + b.r

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width

    return p.right>b.left && p.left < b.right && b.bottom > p.top && b.top < p.bottom

}

// function Reset ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2

    ball.speed =1
    ball.velocityY = -ball.velocityY
}

// Game Over function
function showGameOver(){
    canvas.style.display = "none";
    const can = document.getElementById("can");
    can.style.display = "none";

    const result = document.getElementById("result");
    result.style.display = "block";
}

// ball movement
function update(){
    ball.x += ball.velocityX*ball.speed;
    ball.y += ball.velocityY*ball.speed;

    // control the computer paddle
    let computerLevel = 0.1;
    com.x += (ball.x - (com.x + com.width/2)) + computerLevel;

    if(ball.speed>2){
        com.x += ball.x + 100;
    }
    // reflect from wall
    if(ball.x + ball.r >canvas.width || ball.x - ball.r <0){
        ball.velocityX = -ball.velocityX
    }

    // if collession happens
    let player = (ball.y < canvas.height/2) ? com : user;

    if(collession(ball,player)){
        ball.velocityY = -ball.velocityY;
        ball.speed += 0.1
    }

    // score
    if(ball.y - ball.r < 0){
        user.score++;
        resetBall();
    }else if(ball.y + ball.r > canvas.height){
        com.score++;
        resetBall();
    }

    // Game Over
    if(user.score>4 || com.score>4){
        clearInterval(loop);
        showGameOver();
    }
}

function start(){
    update();
    render();
}

// loop
const loop = setInterval(start,1000/50)