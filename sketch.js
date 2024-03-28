const boardSize = 7;
const cellSize = 60;
let board;
let ball;
let houses;
let gameLogic;

function setup()
{
    createCanvas(boardSize * cellSize, boardSize * cellSize);
    board = new Board(boardSize);
    ball = new Ball(3, 4);
    houses = [new House([0, boardSize - 1]), new House([boardSize - 1, 0])];
    gameLogic = new GameLogic(board, ball, houses, cellSize);
}


function draw()
{
    background(255);
    board.draw();
    ball.draw();
    houses.forEach(house => house.draw());
}

function mousePressed()
{
    gameLogic.mousePressed();
}

function mouseReleased()
{
    gameLogic.mouseReleased();
}
