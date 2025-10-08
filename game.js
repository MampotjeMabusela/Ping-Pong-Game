const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Paddles
let leftPaddle = {
    x: 10,
    y: HEIGHT/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let rightPaddle = {
    x: WIDTH - PADDLE_WIDTH - 10,
    y: HEIGHT/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

// Ball
let ball = {
    x: WIDTH/2,
    y: HEIGHT/2,
    vx: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
    vy: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1)
};

// Mouse movement for left paddle
canvas.addEventListener('mousemove', function(e) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height/2;
    // Clamp paddle to canvas bounds
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > HEIGHT) leftPaddle.y = HEIGHT - leftPaddle.height;
});

// Simple AI for right paddle
function moveRightPaddle() {
    let target = ball.y - rightPaddle.height/2 + BALL_RADIUS/2;
    if (rightPaddle.y < target) {
        rightPaddle.y += PADDLE_SPEED;
    } else if (rightPaddle.y > target) {
        rightPaddle.y -= PADDLE_SPEED;
    }
    // Clamp paddle to canvas bounds
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > HEIGHT) rightPaddle.y = HEIGHT - rightPaddle.height;
}

// Collision detection
function checkCollision(paddle) {
    return (
        ball.x - BALL_RADIUS < paddle.x + paddle.width &&
        ball.x + BALL_RADIUS > paddle.x &&
        ball.y + BALL_RADIUS > paddle.y &&
        ball.y - BALL_RADIUS < paddle.y + paddle.height
    );
}

// Ball movement and wall collision
function moveBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collision (top/bottom)
    if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > HEIGHT) {
        ball.vy *= -1;
    }

    // Paddle collision
    if (checkCollision(leftPaddle)) {
        ball.vx = Math.abs(ball.vx);
        // Add a bit of randomness
        ball.vy += (Math.random() - 0.5) * 2;
    }
    if (checkCollision(rightPaddle)) {
        ball.vx = -Math.abs(ball.vx);
        ball.vy += (Math.random() - 0.5) * 2;
    }

    // Reset ball if it goes out of bounds (left or right)
    if (ball.x < 0 || ball.x > WIDTH) {
        ball.x = WIDTH/2;
        ball.y = HEIGHT/2;
        ball.vx = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
        ball.vy = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Center line
    ctx.strokeStyle = "#444";
    ctx.beginPath();
    ctx.setLineDash([10, 15]);
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Left paddle
    ctx.fillStyle = "#0f7";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

    // Right paddle
    ctx.fillStyle = "#f70";
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.fill();
}

// Main game loop
function loop() {
    moveRightPaddle();
    moveBall();
    draw();
    requestAnimationFrame(loop);
}

loop();