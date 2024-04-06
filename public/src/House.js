class House
{
    constructor(position,color)
    {
        this.position = position;
        this.color = color;
    }

    draw()
    {
        const cellSize = width / boardSize;
        fill(this.color);
        rect(this.position[0] * cellSize, this.position[1] * cellSize, cellSize, cellSize);
    }
}
