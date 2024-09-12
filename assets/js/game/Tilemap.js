class Tilemap{
    constructor(ctx, map, scale){
        this.ctx = ctx
        this.map = map
        this.scale = scale
        this.x = ((this.map.width/2) - this.map.width) * scale + 90
        this.y = ((this.map.height/2) - this.map.height) * scale + 100

        this.iniPoint = this.x + (160 * scale)
        this.endPoint = this.x + (1760 * scale)
        this.playableArea = new Rect(this.iniPoint, this.iniPoint, this.endPoint, this.endPoint)
    }

    draw(render_scroll){
        this.ctx.drawImage(this.map, this.x - render_scroll[0], this.y - render_scroll[1], this.map.width * this.scale, this.map.height * this.scale)
    }


}