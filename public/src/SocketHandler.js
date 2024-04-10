class SocketHandler
{
    constructor()
    {
        this.socket = null
        this.gameLogic = null;
    }

    setGameLogic(gameLogic)
    {
        this.gameLogic = gameLogic;
    }


    emmitSwitchPlayerTurn()
    {
        this.socket.emit('switch-turn', () =>
        {
            console.log('Switching player turn');
        });
    }

    emmitWInnerAnnouncment(message)
    {
        this.socket.emit('announce-winner', message, () =>
        {
            console.log('Annoucing winner');
        });
    }

    emmitPieceMovement(data)
    {
        this.socket.emit('move-piece', data)
    }

    initializeSocket()
    {
        this.socket = io.connect('http://localhost:3003');

        this.socket.on('join', (data) =>
        {
            console.log("Join event triggered");
            console.log(this.gameLogic);
            console.log(data);
            if (this.gameLogic.player == null)
                this.gameLogic.player = data

            console.log("Join data", data);
        });

        this.socket.on('move-piece', (data) =>
        {
            const x = data[0];
            const y = data[1];
            board.cells[ball.position.x][ball.position.y] = true;
            board.cells[x][y] = false;
            ball.position.x = x;
            ball.position.y = y;
            this.emmitSwitchPlayerTurn()
        });

        this.socket.on('switch-turn', () =>
        {
            let turnVar = document.querySelector('#turnIndicator')

            console.log('Switching player turn');
            this.gameLogic.playerOneTurn = !gameLogic.playerOneTurn

            if (this.gameLogic.playerOneTurn && this.gameLogic.player == "Player 1")
            {
                turnVar.textContent = "Your turn!"
            } else if (!this.gameLogic.playerOneTurn && this.gameLogic.player == "Player 2")
            {
                turnVar.textContent = "Your turn!"
            }
            else
            {
                turnVar.textContent = ""

            }
        });

        this.socket.on('announce-winner', (message) =>
        {
            console.log("Winner message: " + message);

            alert(message)

            setTimeout(() =>
            {
                this.gameLogic.resetGame();
            }, 300)
        });
    }

}
