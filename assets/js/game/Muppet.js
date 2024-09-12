class Muppet {
    constructor(name, color, index, ctx, scale) {
        this.name = name
        this.color = color
        this.ctx = ctx
        this.index = index
        this.scale = scale
        this.action = "Idle"
        this.actualImg = PlayerSprites["Idle"][0]
        this.frame

        this.rect = new Rect(this.x, this.y, this.actualImg.width, this.actualImg.height)

        this.x = 50 * this.index
        this.y = 50 * this.index
        this.preX
        this.preY

        this.nameLabel = new NameLabel(this.name, this.color, this.ctx)

    }

    update(playerData) {
        this.preX = this.x
        this.preY = this.y
        this.x = playerData["x"]
        this.y = playerData["y"]
        let actualImg = playerData["actualImg"]
        if (actualImg == 0) {
            this.action = "Idle"
            this.frame = 0
        } else {
            this.action = actualImg[0]
            this.frame = actualImg[1]
        }
        this.actualImg = PlayerSprites[this.action][this.frame]
    }

    draw(render_scroll) {
        this.nameLabel.draw(this.x - render_scroll[0], this.y - render_scroll[1])

        if (this.action === "Walk") {
            if (this.x > this.preX) {
                this.ctx.drawImage(this.actualImg, this.x - render_scroll[0], this.y - render_scroll[1], this.actualImg.width * this.scale, this.actualImg.height * this.scale);
            } else if (this.x < this.preX) {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(this.actualImg, -(this.x - render_scroll[0]) - this.actualImg.width * this.scale, this.y - render_scroll[1], this.actualImg.width * this.scale, this.actualImg.height * this.scale);
                this.ctx.restore();
            }
        } else {
            this.ctx.drawImage(this.actualImg, this.x - render_scroll[0], this.y - render_scroll[1], this.actualImg.width * this.scale, this.actualImg.height * this.scale);
        }
    }

}