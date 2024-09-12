class Point{
    constructor(ctx, x, y, color){
        this.ctx = ctx
        this.x = x
        this.y = y
        this.color = color
    }

    update(x, y){
        this.x = (x / 20) + 110
        this.y = (y / 20) + 110
    }

    draw(){
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(this.x, this.y, 8, 8);
    }
}


class Minimap{
    constructor(ctx, scale, map, players){
        this.ctx = ctx
        this.scale = scale
        this.map = map
        this.points = [] 

        players.forEach(player => {
            let point = new Point(this.ctx, player.x, player.y, player.color)
            this.points.push(point)
        });
        
    }

    update(muppets){
        this.points.forEach(point => {
            muppets.forEach(muppet => {
                if (point.color == muppet.color) {
                    point.update(muppet.x, muppet.y)
                }
            });
        });
    }

    draw(){
        let scaledWidth = this.map.width * this.scale;
        let scaledHeight = this.map.height * this.scale;
        let x = 20;
        let y = 20;
        
        this.ctx.drawImage(this.map, x, y, scaledWidth, scaledHeight);
        
        this.ctx.strokeStyle = 'black'; 
        this.ctx.lineWidth = 3;         
        this.ctx.strokeRect(x, y, scaledWidth, scaledHeight); 

        this.points.forEach(point => {
            point.draw();
        });
    }    
}