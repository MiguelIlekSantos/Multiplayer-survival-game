class NameLabel {
    constructor(name, color, ctx) {
        this.name = name;
        this.color = color;
        this.ctx = ctx;

        this.width = this.name.length * 10;
        this.height = 25;
    }

    drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.arcTo(x, y, x + radius, y, radius);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    draw(x, y) {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 3;

        this.drawRoundedRect(x, y - 20, this.width, this.height, 10);

        this.ctx.font = "bold 12px Verdana";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.name, x + 5, y);
    }
}
