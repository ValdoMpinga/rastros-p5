class Ball
{
    constructor(x, y)
    {
        this.position = { x, y };
    }

    draw()
    {
        const cellSize = width / boardSize;
        fill(255, 255, 0);
        ellipse(this.position.x * cellSize + cellSize / 2, this.position.y * cellSize + cellSize / 2, cellSize * 0.8);
    }
}
