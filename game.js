

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
highscore = 0
colisoes = 0
tamanho = 0
contador = 0
power = 0

//Carregar Placar
const scoreText = new PIXI.Text("pontos: 0")
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
scoreText.x += 10
scoreText.y += 10
app.stage.addChild(scoreText)

function setScore() {
    scoreText.text = ("Score: " + score);
}

// set player and ball
let player = PIXI.Sprite.from('../assets/player.png');
player.anchor.set(0.5);
player.x = app.screen.width / 2;
player.y = app.screen.height - 40;

let ball = PIXI.Sprite.from('../assets/ball.png');
ball.anchor.set(0.5);
ball.x = app.screen.width / 2;
ball.y = app.screen.height - 60;
ball.vx = 1;
ball.vy = 1;
speedball = 3;

let powerenergy = PIXI.Sprite.from('../assets/energy.png');
powerenergy.visible = false
powerenergy.anchor.set(0.5);

let plusenergy = PIXI.Sprite.from('../assets/plusSize.png');
plusenergy.visible = false
plusenergy.anchor.set(0.5);

//set audios
var pointSound = new Howl({
    src: ['../assets/sounds/point.mp3']
});
var gameOverSound = new Howl({
    src: ['../assets/sounds/gameover3.mp3']
});
var energySound = new Howl({
    src: ['../assets/sounds/energy.mp3']
});
var plusSound = new Howl({
    src: ['../assets/sounds/plussize.mp3']
});
Howler.volume(0.02)


const containerbricks = new PIXI.Container();
containerbricks.x = app.screen.height - 520;
containerbricks.y = app.screen.height - 500;
containerbricks.pivot.x = containerbricks.width / 2;
containerbricks.pivot.y = containerbricks.height / 2;
containerbricks.interactiveChildren = true

const menu = new PIXI.Container();
menu.pivot.x = menu.width + 100;
menu.pivot.y = menu.height / 2;
menu.x = app.screen.height / 2;
menu.y = app.screen.height / 2;
menu.interactiveChildren = true
menu.visible = false

let bricks1 = PIXI.Texture.from('../assets/brick1.png');
let bricks2 = PIXI.Texture.from('../assets/brick2.png');
let bricks3 = PIXI.Texture.from('../assets/brick3.png');
let energy = PIXI.Texture.from('../assets/energy.png');
let plusSize = PIXI.Texture.from('../assets/plusSize.png');

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
    size: 63,
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
            1, 2, 1, 2, 1, 2, 1, 2, 1,
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
    mapa4:
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
    //BRICKS COLOR SET => 0=nada 1=verde 2=roxo 3=rosa 4=amarelo
    //POWER SET = > 0.1=energy 0.2=plusSize
}

const mapa = [];
function drawBrick(fase) {
    for(i=0; i< fase.length; i++){
        if(fase[i] != 0){
            tamanho++
        }
    }
    console.log(tamanho)
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
drawBrick(fases.mapa1);

// Menu
function Menu() {
    const menuText = new PIXI.Text("Game Over")
    menuText.style = new PIXI.TextStyle({
        dropShadow: true,
        dropShadowAlpha: 0.2,
        dropShadowDistance: 4,
        dropShadowBlur: 3,
        fill: "#fff",
        fontSize: 40,
        fontVariant: "small-caps",
        fontWeight: "bold"
    })
    menu.x = app.screen.width / 2
    menu.y = app.screen.height / 2
    menu.cursor = 'pointer';
    menu.interactive = true

    const menuSubText = new PIXI.Text("click to restart")
    menuSubText.style = new PIXI.TextStyle({
        dropShadow: true,
        dropShadowAlpha: 0.2,
        dropShadowDistance: 4,
        dropShadowBlur: 3,
        fill: "#fff",
        fontSize: 15,
        fontVariant: "small-caps",
        fontWeight: "bold"
    })
    menuSubText.anchor.set(0.5)
    menuSubText.y += 50
    menuSubText.x += menuText.width / 2

    const highScoreText = new PIXI.Text("HIGH SCORE " + highscore)
    highScoreText.style = new PIXI.TextStyle({
        dropShadow: true,
        dropShadowAlpha: 0.2,
        dropShadowDistance: 4,
        dropShadowBlur: 3,
        fill: "#fff",
        fontSize: 20,
        fontVariant: "small-caps",
        fontWeight: "bold"
    })
    highScoreText.anchor.set(0.5)
    highScoreText.y += menuSubText.height + 50
    highScoreText.x += menuText.width / 2

    menu.addChild(menuText)
    menu.addChild(menuSubText)
    menu.addChild(highScoreText)

    highScoreText.text = (score.value);
}
Menu();

function Restart() {
    for (i = 0; i < mapa.length; i++) {
        if (mapa[i].visible == false) {
            mapa[i].visible = true
        }
    }
    score = 0
    speedball = 3
    ball.x = app.screen.width / 2;
    ball.y = app.screen.height - 56;
    ball.vy *= -1;
    ball.vx *= -1;
    menu.visible = false
}
function getPower(){
    if(colisoes == power){
        colisoes++
        rest = power % 2
        if(rest == 0){
            powerenergy.x = ball.x
            powerenergy.y = ball.y
            powerenergy.visible = true
            app.stage.addChild(powerenergy)
            powerenergy.interactive = true
        }else{
            plusenergy.x = ball.x
            plusenergy.y = ball.y
            plusenergy.visible = true
            app.stage.addChild(plusenergy)
            plusenergy.interactive = true
        }
    }
    if(colisao(powerenergy, player)){
        powerenergy.visible = false
        colisoes = 0
        if(energySound.playing([1]) == false){
            energySound.play()
            power = 1
        }
    }else
    if(colisao(plusenergy, player)){
        plusenergy.visible = false
        colisoes = 0
        if(plusSound.playing([1]) == false){
            plusSound.play()
            power = 2 
        }
        player.width *= 1.01
    }
}

function movePower(delta){
    powerenergy.y += 1.2
    plusenergy.y += 1.2
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
    if (btnleft == true && player.x >= player.width/2 + 10) {
        player.x -= 10
    } else if (btnright == true && player.x <= (502 - player.width/2 - 10)) {
        player.x += 10
    }
}

function moveBall(delta) {
    ball.y = ball.y + (ball.vy * -speedball)
    ball.x = ball.x + (ball.vx * -speedball)

    if (colisao(ball, player)) {
        ball.vy *= -1;
        ball.vx *= -1;
        speedball += 0
    } else
        if (ball.x <= 0 || ball.x >= 498) {
            ball.vy *= 1;
            ball.vx *= -1;
        } else
            if (ball.y <= 0) {
                ball.vy *= -1;
                ball.vx *= 1;
            }
}
function winLose() {
    faseAtual = fases.mapa2
    if (ball.y >= 598) {
        menu.visible = true
        menu.on("pointerdown", Restart)
    }
    if(tamanho == contador){
        console.log("Ganhou!")
        drawBrick(faseAtual);
        contador=0
    }
}
function hitBrick() {
    for (i = 0; i < mapa.length; i++) {
        if (mapa[i].visible) {
            if (colisao(ball, mapa[i])) {
                if(mapa[i]._texture.textureCacheIds[0] == "../assets/energy.png"){
                    console.log("Bateu energy")
                    power.vy = power.vx *1;
                    ball.vy = ball.vy * -1;
                    mapa[i].visible = false
                    score = ball.x0
                    energySound.play()
                }else
                if(mapa[i]._texture.textureCacheIds[0] == "../assets/plusSize.png"){
                    console.log("Bateu Plus")
                    ball.vy = ball.vy * -1;
                    mapa[i].visible = false
                    score = ball.x0
                    plusSound.play()
                }else{
                    ball.vy = ball.vy * -1;
                    mapa[i].visible = false
                    score += Math.floor(10.5 * speedball)
                    pointSound.play()
                }
                colisoes++
                contador++
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
    getPower();
    movePower()
}

function colisao(a, b) {
    const obj1 = a.getBounds();
    const obj2 = b.getBounds();

    return obj1.x < obj2.x + obj2.width +1
        && obj1.x + obj1.width > obj2.x
        && obj1.y < obj2.y + obj2.height +1
        && obj1.y + obj1.height > obj2.y;
}
