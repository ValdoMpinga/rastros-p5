class house
{
    constructor(position)
    {
        this.position = position;
    }

    draw()
    {
        const cellSize = width / boardSize;
       fill(255, 69, 0); 
        rect(this.position[0] * cellSize, this.position[1] * cellSize, cellSize, cellSize);
    }
}
