class GameLogic
{
    constructor(board, ball, houses)
    {
        this.board = board;
        this.ball = ball;
        this.houses = houses;
        this.currentPlayer = 0;
    }

    mousePressed()
    {
        // Handle mouse pressed event
        const x = Math.floor(mouseX / cellSize);
        const y = Math.floor(mouseY / cellSize);
        if (x === this.ball.position.x && y === this.ball.position.y)
        {
            isDragging = true;
            offsetX = mouseX - ballPos.x * cellSize;
            offsetY = mouseY - ballPos.y * cellSize;
        }
    }

    mouseReleased()
    {
        // Handle mouse released event
        // Check if mouse released position is a legal move and perform actions accordingly
        const x = Math.floor(mouseX / cellSize);
        const y = Math.floor(mouseY / cellSize);
        if (this.isLegalMove(x, y))
        {
            this.movePiece(x, y);
            this.currentPlayer = 1 - this.currentPlayer;
            if (this.isBlocked())
            {
                setTimeout(() =>
                {
                    const playAgain = confirm("No legal moves available. Player " + (this.currentPlayer + 1) + " wins! Want to play again?");
                    if (playAgain)
                    {
                        this.resetGame();
                    }
                }, 100);
            }
        }
    }

    isLegalMove(x, y)
    {
        // Check if the move is legal
        if (x < 0 || x >= boardSize || y < 0 || y >= boardSize)
        {
            console.log("Out of bounds ", x, y);
            return false; // Out of bounds
        }

        // Check if the target is a house and allow adjacent move
        for (const house of this.houses)
        {
            if (x === house.position[0] && y === house.position[1])
            {
                const dx = Math.abs(x - this.ball.position.x);
                const dy = Math.abs(y - this.ball.position.y);
                if (dx <= 1 && dy <= 1)
                {
                    return true; // Allow move to house if adjacent
                }
                return false; // House but not adjacent
            }
        }

        // Check for regular adjacent move (including diagonally)
        const dx = Math.abs(x - this.ball.position.x);
        const dy = Math.abs(y - this.ball.position.y);
        if (dx <= 1 && dy <= 1 && !this.board.cells[x][y])
        {
            return true;
        }

        if (this.board.cells[x][y])
        {
            console.log("Cell occupied ", x, y);
        }
        return false;
    }

    movePiece(x, y)
    {
        // Move the ball
        this.board.cells[this.ball.position.x][this.ball.position.y] = true;
        this.board.cells[x][y] = false;
        this.ball.position.x = x;
        this.ball.position.y = y;

        // Check if the ball reached any house
        for (const house of this.houses)
        {
            if (x === house.position[0] && y === house.position[1])
            {
                this.ball.position.x = house.position[0];
                this.ball.position.y = house.position[1];
                setTimeout(() =>
                {
                    const playAgain = confirm("Player " + (this.currentPlayer + 1) + " won! Want to play again?");
                    if (playAgain)
                    {
                        this.resetGame();
                    }
                }, 100);
                break;
            }
        }

        this.currentPlayer = 1 - this.currentPlayer; // Switch player turn
    }


    resetGame()
    {
        // Reset the game
        this.board.cells = this.board.initializeBoard();
        this.ball.position = { x: 3, y: 4 };
        this.currentPlayer = 0;
    }

    isBlocked()
    {
        // Check if there are any legal moves available
        for (let dx = -1; dx <= 1; dx++)
        {
            for (let dy = -1; dy <= 1; dy++)
            {
                if (!(dx === 0 && dy === 0))
                {
                    const newX = this.ball.position.x + dx;
                    const newY = this.ball.position.y + dy;
                    if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && !this.board.cells[newX][newY])
                    {
                        return false; // At least one legal move is available
                    }
                }
            }
        }
        return true; // No legal moves available
    }
}
