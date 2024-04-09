class Board
{
    constructor(size)
    {
        this.size = size;
        this.cells = this.initializeBoard();
    }

    initializeBoard()
    {
        return Array.from({ length: this.size }, () => Array(this.size).fill(false));
    }

    draw()
    {

        const cellSize = width / this.size;
        for (let x = 0; x < this.size; x++)
        {
            for (let y = 0; y < this.size; y++)
            {
                if (this.cells[x][y] === true)
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
}
