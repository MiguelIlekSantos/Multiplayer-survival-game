class lobbyCanvas {
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.scale = 1;
    }
    
    draw(){
        let player = PlayerSprites["Idle"]

        let img1 = player[0]
        let img2 = player[1]

        let a = 2;
        setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (a % 2 == 0) {
                this.ctx.drawImage(img1, this.canvas.width/2 - 50, this.canvas.height/2 - 50, 100, 100);
            } else {
                this.ctx.drawImage(img2, this.canvas.width/2 - 50, this.canvas.height/2 - 50, 100, 100);
            }
            a++;
        }, 350);
    }
}
