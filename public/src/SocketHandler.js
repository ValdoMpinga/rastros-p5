class SocketHandler
{
    constructor()
    {
        this.socket = null
        this.gameLogic = null;
        this.ip = "192.168.1.2" 

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
        this.socket = io.connect(`http://${this.ip}:3003`);

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
            console.log("moving piece");
            const x = data[0];
            const y = data[1];
            board.cells[ball.position.x][ball.position.y] = true;
            board.cells[x][y] = false;
            ball.position.x = x;
            ball.position.y = y;
            this.emmitSwitchPlayerTurn()
            turnIndicator.textContent = ""

        });

        this.socket.on('switch-turn', () =>
        {
            console.log("dzomei no switch turn");
            console.log('Is player one turn', this.gameLogic.playerOneTurn);
            this.gameLogic.playerOneTurn = !gameLogic.playerOneTurn

            // console.log('Is player one turn', this.gameLogic.playerOneTurn);

            // if (this.gameLogic.player == "Player 1" && this.gameLogic.playerOneTurn == true)
            // {
            //     console.log("Saying it player one turn");
            //     const turnIndicator = document.querySelector('#turnIndicator');
            //     turnIndicator.textContent = "IT'S YOUR TURN!"
            // } else if (this.gameLogic.player == "Player 2" && this.gameLogic.playerOneTurn == false)
            // {
            //     console.log("Saying it player two turn");

            //     const turnIndicator = document.querySelector('#turnIndicator');
            //     turnIndicator.textContent = "IT'S YOUR TURN!"
            // }

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
