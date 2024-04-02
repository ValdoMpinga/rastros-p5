const boardSize = 7;
const cellSize = 60;
let board = [];
let currentPlayer = 0;
let houses = [[0, boardSize - 1], [boardSize - 1, 0]];
let ballPos = { x: 3, y: 4 };
let isDragging = false;
let offsetX, offsetY;
let socket
let player = null
let playerOneTurn = true

function setup()
{
    initializeSocket()
    createCanvas(boardSize * cellSize, boardSize * cellSize);
    initializeBoard();
}

function initializeBoard()
{
    try
    {
        board = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));
        for (const [x, y] of houses)
        {
            board[x][y] = 'house';
        }
    } catch (e)
    {
        console.log("bellow");
        console.log(e);
    }

}

function draw()
{
    background(255);
    drawBoard();
    drawBall();
    drawPlayer()
}

function drawPlayer()
{
    fill(0);
    textSize(20);
    textAlign(CENTER);
    text("Current Player: " + (player), width / 2, 20);
}

function drawBoard()
{
    for (let x = 0; x < boardSize; x++)
    {
        for (let y = 0; y < boardSize; y++)
        {
            if (board[x][y] === 'house')
            {
                fill(255, 0, 0);
            } else if (board[x][y] === true)
            {
                fill(0);
            } else
            {
                fill(255);
            }
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function drawBall()
{
    fill(255, 255, 0);
    ellipse(ballPos.x * cellSize + cellSize / 2, ballPos.y * cellSize + cellSize / 2, cellSize * 0.8);
}

function mousePressed()
{
    if ((player === "Player 1" && !playerOneTurn) || (player === "Player 2" && playerOneTurn))
    {
        return; // Prevent interaction for the current player if it's not their turn
    }

    const x = Math.floor(mouseX / cellSize);
    const y = Math.floor(mouseY / cellSize);
    if (x === ballPos.x && y === ballPos.y)
    {
        isDragging = true;
        offsetX = mouseX - ballPos.x * cellSize;
        offsetY = mouseY - ballPos.y * cellSize;
    }
}

function mouseReleased()
{
    if ((player === "Player 1" && !playerOneTurn) || (player === "Player 2" && playerOneTurn))
    {
        return; // Prevent interaction for the current player if it's not their turn
    }

    isDragging = false;
    const x = Math.floor(mouseX / cellSize);
    const y = Math.floor(mouseY / cellSize);
    if (isLegalMove(x, y))
    {
        movePiece(x, y);

        if (isBlocked())
        {
            setTimeout(() =>
            {
                const playAgain = confirm("No legal moves available. Player " + (currentPlayer + 1) + " wins! Want to play again?");
                if (playAgain)
                {
                    resetGame();
                }
            }, 100);
        } else
        {
            switchPlayerTurn();
        }
    }
}


function isBlocked()
{
    for (let dx = -1; dx <= 1; dx++)
    {
        for (let dy = -1; dy <= 1; dy++)
        {
            if (!(dx === 0 && dy === 0))
            { // Exclude the current position
                const newX = ballPos.x + dx;
                const newY = ballPos.y + dy;
                if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && board[newX][newY] !== true)
                {
                    return false; // At least one legal move is available
                }
            }
        }
    }
    return true; // No legal moves available
}

function isLegalMove(x, y)
{
    if (x < 0 || x >= boardSize || y < 0 || y >= boardSize)
    {
        console.log("Out of bounds ", x, y);
        return false; // Out of bounds
    }

    // Check if the target is a house and allow adjacent move
    if ((x === houses[0][0] && y === houses[0][1]) || (x === houses[1][0] && y === houses[1][1]))
    {
        const dx = Math.abs(x - ballPos.x);
        const dy = Math.abs(y - ballPos.y);
        if (dx <= 1 && dy <= 1)
        {
            return true; // Allow move to house if adjacent
        }
        return false; // House but not adjacent
    }

    // Check for regular adjacent move (including diagonally)
    const dx = Math.abs(x - ballPos.x);
    const dy = Math.abs(y - ballPos.y);
    if (dx <= 1 && dy <= 1 && board[x][y] !== true)
    {
        return true;
    }

    if (board[x][y] === true)
    {
        console.log("Cell occupied ", x, y);
    }
    return false;
}

function movePiece(x, y)
{

    board[ballPos.x][ballPos.y] = true;
    board[x][y] = false;
    ballPos.x = x;
    ballPos.y = y;
    data = [ballPos.x, ballPos.y]
    moveEvent(data)


    socket.emit('move-piece', data);

    // Check if the ball reached house 1
    if (x === houses[0][0] && y === houses[0][1])
    {
        setTimeout(() =>
        {
            const playAgain = confirm("Player 1 won! Want to play again?");
            if (playAgain)
            {
                resetGame();
            }
        }, 100);
    }
    // Check if the ball reached house 2
    else if (x === houses[1][0] && y === houses[1][1])
    {
        setTimeout(() =>
        {
            const playAgain = confirm("Player 2 won! Want to play again?");
            if (playAgain)
            {
                resetGame();
            }
        }, 100);
    }
}



function resetGame()
{
    initializeBoard();
    ballPos = { x: 3, y: 4 };
    currentPlayer = 0;
}

function initializeSocket()
{
    try
    {
        socket = io.connect('http://localhost:3003');

        socket.on('join', (data) =>
        {
            console.log("Join event triggered");
            if (player == null)
                player = data
            console.log(data);
        });

        socket.on('move-piece', (data) =>
        {
            console.log(`Move event triggered to coordinates: x: ${data[0]}, y: ${data[1]}`);
            // Update the board with the received move data
            const x = data[0];
            const y = data[1];
            board[ballPos.x][ballPos.y] = true;
            board[x][y] = false;
            ballPos.x = x;
            ballPos.y = y;
            switchPlayerTurn()
        });


        socket.on('switch-turn', () =>
        {
            console.log('Switching player event triggered');
            playerOneTurn = !playerOneTurn;
        });

    } catch (e)
    {
        console.log(e);
    }

}

function switchPlayerTurn()
{
    socket.emit('switch-turn', () =>
    {
        console.log('Switching player turn');
    });
}

function moveEvent(data)
{
    socket.emit('move-piece', data, () =>
    {
        console.log('Server acknowledged the move event:');
    });
}
