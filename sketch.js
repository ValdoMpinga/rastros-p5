const boardSize = 7;
const cellSize = 60;
let board = [];
let currentPlayer = 0; // 0 for white, 1 for black
let houses = [[0, 0], [boardSize - 1, boardSize - 1]]; // [x, y]
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
                fill(255, 0, 0); // Red color for houses
            } else if (board[x][y] === true)
            {
                fill(0); // Black color for blocks
            } else
            {
                fill(255); // White color for empty cells
            }
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function drawBall()
{
    fill(255, 255, 0); // Yellow color for the ball
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
        currentPlayer = 1 - currentPlayer; // Switch player
    }
}

function mouseDragged()
{
    if (isDragging)
    {
        // Update the position of the ball to follow the mouse cursor
        const targetX = Math.floor((mouseX - offsetX + cellSize / 2) / cellSize);
        const targetY = Math.floor((mouseY - offsetY + cellSize / 2) / cellSize);

        // Check if the target position is a valid move and is a house
        if (isLegalMove(targetX, targetY) && board[targetX][targetY] === 'house')
        {
            ballPos.x = targetX;
            ballPos.y = targetY;
        }
    }
}





function isLegalMove(x, y)
{
    if (x < 0 || x >= boardSize || y < 0 || y >= boardSize)
    {
        return false; // Out of bounds
    }
    if (board[x][y] !== false)
    {
        return false; // Cell already occupied
    }
    // Check if the target position is adjacent to the current position of the ball
    const dx = Math.abs(x - ballPos.x);
    const dy = Math.abs(y - ballPos.y);
    return (dx <= 1 && dy <= 1);
}

function movePiece(x, y)
{
    board[ballPos.x][ballPos.y] = true; // Mark the previous cell as occupied
    board[x][y] = false; // Mark the new cell as empty
    ballPos.x = x;
    ballPos.y = y;
}
