const boardSize = 7;
const cellSize = 60;

let board;
let ball;
let houses;
let gameLogic;
let playerOneHouseColor
let playerTwoHouseColor

function setup()
{

    createCanvas(boardSize * cellSize, boardSize * cellSize);
    socketHandler = new SocketHandler()

    playerOneHouseColor = color(0, 153, 255)
    playerTwoHouseColor = color(51, 255, 51)
    board = new Board(boardSize);
    ball = new Ball(3, 4);
    houses = [
        new house([0, boardSize - 1], playerOneHouseColor),
        new house([boardSize - 1, 0], playerTwoHouseColor),
    ];

    gameLogic = new GameLogic(board, ball, houses, cellSize, socketHandler);

    socketHandler.setGameLogic(gameLogic);

    socketHandler.initializeSocket(gameLogic)

    setTimeout(() =>
    {
        if (!gameLogic.playerOneTurn && gameLogic.player == "Player 2")
        {
            let turnVar = document.querySelector('#turnIndicator')
            turnVar.textContent = "Your turn!"
        }
    }, 700)
}

function draw()
{
    background(255);
    board.draw();
    houses.forEach(house => house.draw());
    ball.draw();
}

function mouseReleased()
{
    if ((gameLogic.playerOneTurn && gameLogic.player === 'Player 1') || (!gameLogic.playerOneTurn && gameLogic.player === 'Player 2'))
    {
        gameLogic.mouseReleased();
    }
}
