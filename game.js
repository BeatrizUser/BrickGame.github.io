

let app = new PIXI.Application({
    width: 502,
    height: 582,
    background: "#1099bb"
});
document.body.appendChild(app.view);

// variaveis
btnleft = false;
btnright = false;
speed = 3;
score = 0;
vida = 0;

//Carregar Placar
const scoreText = new PIXI.Text("Pontos: 0")
scoreText.style = new PIXI.TextStyle({
    dropShadow: true,
    dropShadowAlpha: 0.2,
    dropShadowDistance: 4,
    dropShadowBlur: 3,
    fill: "#fff",
    fontSize: 22,
    fontVariant: "small-caps",
    fontWeight: "bold"
})
app.stage.addChild(scoreText)

function setScore(){
    scoreText.text = ("Score: " + score);
}

// set player and ball
let player = PIXI.Sprite.from('./assets/player.png');
player.anchor.set(0.5);
player.x = app.screen.width / 2;
player.y = app.screen.height - 40;

let ball = PIXI.Sprite.from('./assets/ball.png');
ball.anchor.set(0.5);
ball.x = app.screen.width / 2;
ball.y = app.screen.height - 60;
ball.vx = 1;
ball.vy = 1;
speedball = 3;

//set audios
var pointSound = new Howl({
    src: ['./assets/sounds/point.mp3']
  });
var gameOverSound = new Howl({
    src: ['./assets/sounds/gameover2.mp3']
  });
Howler.volume(0.05)


const containerbricks = new PIXI.Container();
containerbricks.x = app.screen.height - 520;
containerbricks.y = app.screen.height - 500;
containerbricks.pivot.x = containerbricks.width / 2;
containerbricks.pivot.y = containerbricks.height / 2;
containerbricks.interactiveChildren = true

const menu = new PIXI.Container();
menu.x = app.screen.height/2;
menu.y = app.screen.height/2;
menu.pivot.x = menu.width / 2;
menu.pivot.y = menu.height / 2;
menu.interactiveChildren = true

let bricks1 = PIXI.Texture.from('./assets/brick1.png');
let bricks2 = PIXI.Texture.from('./assets/brick2.png');
let bricks3 = PIXI.Texture.from('./assets/brick3.png');

app.stage.addChild(player);
app.stage.addChild(ball);
app.stage.addChild(containerbricks);
app.stage.addChild(menu);

//fases1

app.ticker.add(gameloop);

// desenha a fases
let fases = {
    column: 9,
    row: 7,
    size: 54,
    mapa1:
        [
            0, 0, 2, 2, 0, 2, 2, 0, 0,
            0, 2, 3, 3, 2, 3, 3, 2, 0,
            0, 2, 3, 3, 3, 3, 3, 2, 0,
            0, 0, 2, 3, 3, 3, 2, 0, 0,
            0, 0, 0, 2, 3, 2, 0, 0, 0,
            2, 3, 0, 0, 2, 0, 0, 3, 2,
            3, 2, 0, 0, 0, 0, 0, 2, 3,
        ],
    mapa2:
        [
            1, 2, 1, 1, 1, 2, 1, 2, 1,
            0, 1, 2, 1, 2, 1, 2, 1, 0,
            0, 0, 1, 2, 1, 2, 1, 0, 0,
            0, 0, 0, 1, 2, 1, 0, 0, 0,
            1, 2, 0, 0, 1, 0, 0, 2, 1,
            2, 3, 2, 0, 0, 0, 2, 3, 2,
            0, 2, 0, 0, 0, 0, 0, 2, 0,
        ],
    mapa3:
        [
            0, 1, 0, 0, 0, 0, 0, 1, 0,
            1, 3, 1, 0, 0, 0, 1, 3, 1,
            0, 1, 0, 0, 2, 0, 0, 1, 0,
            0, 0, 0, 2, 3, 2, 0, 0, 0,
            0, 2, 0, 0, 2, 0, 0, 2, 0,
            2, 3, 2, 0, 0, 0, 2, 3, 2,
            0, 2, 0, 0, 0, 0, 0, 2, 0,
        ],
    //0=nada 1=verde 2=roxo 3=rosa 4=amarelo
}

const mapa = [];
function drawBrick(fase) {
    for (i = 0; i < fase.length; i++) {
        bricktype = fase[i]
        if (bricktype == 1) {
            const brick = new PIXI.Sprite(bricks1)
            brick.anchor.set(0.5)
            brick.x = (i % 9) * 45
            brick.y = Math.floor(i / 9) * 22;
            brick.interactive = true;
            containerbricks.addChild(brick)
            mapa.push(brick)
        } 
        else if (bricktype == 2) {
                const brick = new PIXI.Sprite(bricks2)
                brick.anchor.set(0.5)
                brick.x = (i % 9) * 45
                brick.y = Math.floor(i / 9) * 22;
                brick.interactive = true;
                containerbricks.addChild(brick)
                mapa.push(brick)
            }
        else if (bricktype == 3) {
                const brick = new PIXI.Sprite(bricks3)
                brick.anchor.set(0.5)
                brick.x = (i % 9) * 45
                brick.y = Math.floor(i / 9) * 22;
                brick.interactive = true;
                containerbricks.addChild(brick)
                mapa.push(brick)
            }
    }
}
drawBrick(fases.mapa3);

// Menu
function Menu(score){
    const menuText = new PIXI.Text("Pontos: 0")
    menuText.style = new PIXI.TextStyle({
    dropShadow: true,
    dropShadowAlpha: 0.2,
    dropShadowDistance: 4,
    dropShadowBlur: 3,
    fill: "#fff",
    fontSize: 22,
    fontVariant: "small-caps",
    fontWeight: "bold"
})
app.menu.addChild(menuText)

}

// events
window.addEventListener("keydown", keysDown)
window.addEventListener("keyup", keysUp)
// keycodes: 37 esquerda | 39 direita
function keysDown(e) {
    if (e.keyCode == 37) {
        btnleft = true
    } else if (e.keyCode == 39) {
        btnright = true
    }
}
function keysUp(e) {
    if (e.keyCode == 37) {
        btnleft = false
    } else if (e.keyCode == 39)
        btnright = false
}

// funcoes de movimento do player
function movePlayer() {
    gameOverSound.stop()
    if (btnleft == true && player.x >= 60) {
        player.x -= 5
    } else if (btnright == true && player.x <= 440) {
        player.x += 5
    }
}
function start() {
    alert('Start!')
}

function moveBall(delta) {
    ball.y = ball.y + (ball.vy * -speedball)
    ball.x = ball.x + (ball.vx * -speedball)

    if (colisao(ball, player)) {
        ball.vy *= -1;
        ball.vx *= -1;
        speedball+=0.5
    } else
        if (ball.x <= 0 || ball.x >= 500) {
            ball.vy *= 1;
            ball.vx *= -1;
    } else
        if (ball.y <= 0 || ball.y >= 600) {
            ball.vy *= -1;
            ball.vx *=  1;
        }
}
function winLose() {
    if (ball.y >= 600) {
        gameOverSound.play()
        alert('Restart!')
        ball.x = app.screen.width / 2;
        ball.y = app.screen.height - 56;
    }
}
function hitBrick() {
    for (i = 0; i < mapa.length; i++) {
        if (mapa[i].visible) {
            if (colisao(ball, mapa[i])) {
                ball.vy = ball.vy * -1;
                mapa[i].visible = false
                score += Math.floor(10.5*speedball)
                pointSound.play()
            }
        }
    }
}
function gameloop() {
    movePlayer();
    moveBall();
    hitBrick();
    setScore();
    winLose();
}

function colisao(a, b) {
    const obj1 = a.getBounds();
    const obj2 = b.getBounds();

    return obj1.x < obj2.x + obj2.width
        && obj1.x + obj1.width > obj2.x
        && obj1.y < obj2.y + obj2.height
        && obj1.y + obj1.height > obj2.y;
}
