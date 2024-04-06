class GameLogic
{
    constructor(board, ball, houses, cellSize)
    {
        this.board = board;
        this.ball = ball;
        this.houses = houses;
        this.cellSize = cellSize;
        this.player = null;
        this.currentPlayer = true;
        this.playerOneTurn = false
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
                        this.announceWinner("Player 2 is blocked, the winner is Player 1!")
                    else
                        this.announceWinner("Player 1 is blocked, the winner is Player 2!")
          
                }, 100);
            } else
            {
                this.switchPlayerTurn()
            }
        }
    }

    switchPlayerTurn()
    {
        socket.emit('switch-turn', () =>
        {
            console.log('Switching player turn');
        });
    }


    announceWinner(message)
    {
        socket.emit('announce-winner', message, () =>
        {
            console.log('Annoucing winner');
        });
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
        socket.emit('move-piece', data);

        for (const house of this.houses)
        {
            if (x === house.position[0] && y === house.position[1])
            {
                setTimeout(() =>
                {

                    this.announceWinner("Player 1 won! Want to play again?")
                }, 100);
                break;
            } else if (
                (x === house.position[1] && y === house.position[0])
            )
            {
                setTimeout(() =>
                {

                    this.announceWinner("Player 2 won! Want to play again?")

                }, 100);
            }
        }
    }

    resetGame()
    {
        this.board.cells = this.board.initializeBoard();
        this.ball.position = { x: 3, y: 4 };
        this.currentPlayer = 0;
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



}
