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

    // socket = io.connect('http://localhost:3003');


    // socket.on('join', (data) =>
    // {
    //     console.log("Join event triggered");
    //     if (gameLogic.player == null)
    //         gameLogic.player = data

    //     console.log("Join data", data);
    // });

    // socket.on('move-piece', (data) =>
    // {
    //     const x = data[0];
    //     const y = data[1];
    //     board.cells[ball.position.x][ball.position.y] = true;
    //     board.cells[x][y] = false;
    //     ball.position.x = x;
    //     ball.position.y = y;
    //     gameLogic.switchPlayerTurn()
    // });

    // socket.on('switch-turn', () =>
    // {
    //     console.log('Switching player turn');
    //     gameLogic.playerOneTurn = !gameLogic.playerOneTurn
    // });

    // socket.on('announce-winner', (message) =>
    // {
    //     console.log("Winner message: " + message);

    //     alert(message)

    //     setTimeout(() =>
    //     {
    //         gameLogic.resetGame();
    //     }, 5000)
    // });

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
