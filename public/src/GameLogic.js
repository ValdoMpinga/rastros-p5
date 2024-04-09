class GameLogic
{
    constructor(board, ball, houses, cellSize, socketHandler)
    {
        this.board = board;
        this.ball = ball;
        this.houses = houses;
        this.cellSize = cellSize;
        this.player = null;
        this.currentPlayer = true;
        this.playerOneTurn = false
        this.socketHandler = socketHandler
    }

    mouseReleased()
    {
        if ((this.player === "Player 1" && !this.playerOneTurn) || (this.player === "Player 2" && this.playerOneTurn))
        {
            return;
        }

        this.isDragging = false;
        const x = Math.floor(mouseX / this.cellSize);
        const y = Math.floor(mouseY / this.cellSize);

        if (this.isLegalMove(x, y))
        {
            this.movePiece(x, y);
            if (this.isBlocked())
            {
                setTimeout(() =>
                {
                    console.log(this.player + " is blocked")
                    if (this.player === "Player 1")
                    {
                        this.socketHandler.emmitWInnerAnnouncment("The winner is Player 1 because the Player 2 is blocked.");
                    }
                    else if (this.player === "Player 2")
                    {
                        this.socketHandler.emmitWInnerAnnouncment("The winner is Player 2, because the Player 1 is blocked.");
                    }

                }, 100);
            } else
            {
                this.socketHandler.emmitSwitchPlayerTurn()
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
        this.board.cells[this.ball.position.x][this.ball.position.y] = true;
        this.board.cells[x][y] = false;
        this.ball.position.x = x;
        this.ball.position.y = y;
        const data = [x, y];

        this.socketHandler.emmitPieceMovement(data)

        for (const house of this.houses)
        {
            if (x === house.position[0] && y === house.position[1])
            {
                console.log("Player 1, won");
                setTimeout(() =>
                {
                    this.socketHandler.emmitWInnerAnnouncment("Player 1 won! Want to play again?")
                }, 100);
                break;
            } else if (
                (x === house.position[1] && y === house.position[0])
            )
            {
                console.log("Player 2, won");

                setTimeout(() =>
                {
                    this.socketHandler.emmitWInnerAnnouncment("Player 2 won! Want to play again?")
                }, 100);
                break;
            }
        }
    }

    resetGame()
    {
        this.board.cells = this.board.initializeBoard();
        this.ball.position = { x: 3, y: 4 };
        this.playerOneTurn = false;
    }

    isBlocked()
    {
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
                        return false;
                    }
                }
            }
        }
        return true;
    }

    getPlayer()
    {
        return this.player;
    }
}
