class Player {
    constructor(name, color, index, ctx, scale) {
        this.name = name
        this.color = color
        this.ctx = ctx
        this.scale = scale
        this.action = "Idle"
        this.direction
        this.actualImg = PlayerSprites[this.action][0]

        this.x = 0
        this.y = 0

        this.nameLabel = new NameLabel(this.name, this.color, this.ctx)
        this.animation = new Animation(PlayerSprites, 5)
        this.inventory = new Inventory(this.ctx, 5)
        this.inventoryOpen = false

        this.rect = new Rect(this.x, this.y, this.actualImg.width, this.actualImg.height)
    }

    update(playerData, keySetData) {
        this.x = playerData["x"]
        this.y = playerData["y"]

        this.rect.update(this.x, this.y)

        if (keySetData.right) {
            this.action = "Walk"
            this.direction = "right"
        } else if (keySetData.left) {
            this.action = "Walk"
            this.direction = "left"
        } else{
            this.action = "Idle"
        }

        if (keySetData.inventory) {
            this.inventoryOpen = true
        }else if (!keySetData.inventory) {
            this.inventoryOpen = false
            
        } 

    }

    draw(render_scroll) {
        this.actualImg = this.animation.updateImg(this.action);
        this.nameLabel.draw(this.x - render_scroll[0], this.y - render_scroll[1])
        
        if (this.action === "Walk") {
            if (this.direction === "right") {
                this.ctx.drawImage(this.actualImg, this.x - render_scroll[0], this.y - render_scroll[1], this.actualImg.width * this.scale, this.actualImg.height * this.scale);
            } else if (this.direction === "left") {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(this.actualImg, -(this.x - render_scroll[0]) - this.actualImg.width * this.scale, this.y - render_scroll[1], this.actualImg.width * this.scale, this.actualImg.height * this.scale);
                this.ctx.restore();
            }
        } else {
            this.ctx.drawImage(this.actualImg, this.x - render_scroll[0], this.y - render_scroll[1], this.actualImg.width * this.scale, this.actualImg.height * this.scale);
        }

        
        this.inventory.draw(this.inventoryOpen)
    }
    

}