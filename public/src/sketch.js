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
    houses = [new house([0, boardSize - 1]), new house([boardSize - 1, 0])];
    gameLogic = new GameLogic(board, ball, houses, cellSize);

    // Initialize socket connection
    socket = io.connect('http://localhost:3003');


    socket.on('join', (data) =>
    {
        console.log("Join event triggered");
        if (gameLogic.player == null)
            gameLogic.player = data

        console.log("Join data", data);
    });

    // Handle socket events
    socket.on('move-piece', (data) =>
    {

        // Update the board with the received move data
        const x = data[0];
        const y = data[1];
        board.cells[ball.position.x][ball.position.y] = true;
        board.cells[x][y] = false;
        ball.position.x = x;
        ball.position.y = y;
        gameLogic.switchPlayerTurn()
    });

    socket.on('switch-turn', () =>
    {
        console.log('Switching player turn');
        gameLogic.playerOneTurn = !gameLogic.playerOneTurn 
    });

 

}


function draw()
{
    background(255);
    board.draw();
    houses.forEach(house => house.draw());
    ball.draw();
}


function mousePressed()
{
    if ((gameLogic.playerOneTurn && gameLogic.player === 'Player 1') || (!gameLogic.playerOneTurn && gameLogic.player === 'Player 2'))
    {
        gameLogic.mousePressed();
    }
}

function mouseReleased()
{
    if ((gameLogic.playerOneTurn && gameLogic.player === 'Player 1') || (!gameLogic.playerOneTurn && gameLogic.player === 'Player 2'))
    {
        gameLogic.mouseReleased();
    }
}
