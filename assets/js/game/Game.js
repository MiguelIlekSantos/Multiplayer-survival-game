class Game {
    constructor(canvas, names, actualPlayerIndex, scale) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.scale = scale
        this.muppets = []
        this.player
        this.colors = ["red", "yellow", "blue", "green"]

        names.forEach((name, index) => {
            if (index + 1 == actualPlayerIndex) {
                this.player = new Player(name, this.colors[index], index + 1, this.ctx, this.scale, this.canvas)
            }
            else {
                let muppet = new Muppet(name, this.colors[index], index + 1, this.ctx, this.scale)
                this.muppets.push(muppet)
            }
        });

        this.players = []
        this.players.push(this.player)
        this.muppets.forEach(muppet => {
            this.players.push(muppet)
        });

        this.tilemap = new Tilemap(this.ctx, TilemapSprite[2], 2)
        this.minimap = new Minimap(this.ctx, 0.1, TilemapSprite[2], this.players)

        this.scroll = [0, 0]
        this.render_scroll = [0, 0]
    }

    colorByOrder(order) {
        switch (order) {
            case 1:
                return "red"
            case 2:
                return "yellow"
            case 3:
                return "blue"
            case 4:
                return "green"
        }
    }

    update(data) {
        let playersData = data["PlayersData"]
        let keySetData = data["keySet"]

        let index = 0
        for (let playe in playersData) {
            let play = playersData[playe]

            if (play.name === this.player.name) {
                this.player.update(play.gameData, keySetData, this.canvas)
            }
            else {
                this.muppets.forEach(muppet => {
                    if (muppet.index == index + 1) {
                        muppet.update(play.gameData)
                    }
                });
            }
            index++
        }

        this.minimap.update(this.players)

        this.scroll[0] += (this.player.rect.centerX - this.canvas.width / 2 - this.scroll[0]) / 10
        this.scroll[1] += (this.player.rect.centerY - this.canvas.height / 2 - this.scroll[1]) / 10

        this.render_scroll = [(this.scroll[0]).toFixed(0), (this.scroll[1]).toFixed(0)]
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.tilemap.draw(this.render_scroll)
        this.muppets.forEach(muppet => {
            muppet.draw(this.render_scroll)
        });
        this.minimap.draw(this.player.x, this.player.y)
        this.player.draw(this.render_scroll)
    }
}
