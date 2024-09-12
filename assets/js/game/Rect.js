class Rect{
    constructor(x, y, width, height){
        this.x = x
        this.y = y
        this.width = width
        this.height = height 
        this.centerX = this.x + this.width/2
        this.centerY = this.y + this.height/2
    }

    update(x, y){
        this.x = x
        this.y = y
        this.centerX = this.x + this.width/2
        this.centerY = this.y + this.height/2
    }

    collideRect(rect) {
        return (
            this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y
        );
    }

}