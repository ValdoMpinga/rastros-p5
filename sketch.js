const boardSize = 7;
const cellSize = 60;
let board = [];
let currentPlayer = 0; 
let houses = [[0, boardSize - 1], [boardSize - 1, 0]]; 
let ballPos = { x: 3, y: 4 };
let isDragging = false;
let offsetX, offsetY;

function setup()
{
    createCanvas(boardSize * cellSize, boardSize * cellSize);
    initializeBoard();
}

function initializeBoard()
{
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));
    for (const [x, y] of houses)
    {
        board[x][y] = 'house';
    }
}

function draw()
{
    background(255);
    drawBoard();
    drawBall();
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
    isDragging = false;
    const x = Math.floor(mouseX / cellSize);
    const y = Math.floor(mouseY / cellSize);
    if (isLegalMove(x, y))
    {
        movePiece(x, y);
        currentPlayer = 1 - currentPlayer; 
    }
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
    if (dx <= 1 && dy <= 1)
    {
        return true;
    }

    if (board[x][y] !== false)
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
}
