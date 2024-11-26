const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Função para desenhar um retângulo
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Função para desenhar o círculo (bola)
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

// Função para desenhar texto
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "45px sans-serif";
    context.fillText(text, x, y);
}

// Objetos do jogo
const user = { x: 0, y: 200 - 50, width: 10, height: 100, color: "WHITE", score: 0 };
const ai = { x: 790, y: 200 - 50, width: 10, height: 100, color: "WHITE", score: 0 };
const ball = { x: 400, y: 200, radius: 10, speed: 5, velocityX: 5, velocityY: 5, color: "WHITE" };

// Rede do meio
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "WHITE");
    }
}

// Atualizar e renderizar o jogo
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Rebater bola nas paredes
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Controle da IA
    ai.y += (ball.y - (ai.y + ai.height / 2)) * 0.1;

    // Colisão com os jogadores
    let player = ball.x < canvas.width / 2 ? user : ai;
    if (collision(ball, player)) {
        ball.velocityX = -ball.velocityX;
    }

    // Pontuação
    if (ball.x - ball.radius < 0) {
        ai.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");
    drawNet();
    drawText(user.score, canvas.width / 4, 50, "WHITE");
    drawText(ai.score, (3 * canvas.width) / 4, 50, "WHITE");
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Detecção de colisão
function collision(b, p) {
    return (
        b.x - b.radius < p.x + p.width &&
        b.x + b.radius > p.x &&
        b.y - b.radius < p.y + p.height &&
        b.y + b.radius > p.y
    );
}

// Reiniciar a posição da bola
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
}

// Controle do jogador
canvas.addEventListener("mousemove", (evt) => {
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
});

// Loop do jogo
function game() {
    update();
    render();
}

setInterval(game, 1000 / 50);
