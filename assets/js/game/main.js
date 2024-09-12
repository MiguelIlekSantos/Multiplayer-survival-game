const canvas = document.getElementById("canvas")

var game
var listener
var names = []
let indexPlayer = 0

function resizeCanvas() {
    canvas.width = window.innerWidth    
    canvas.height = window.innerHeight
    game.ctx.imageSmoothingEnabled = false;    
    game.draw(); 
}

window.addEventListener("resize", () => {
    resizeCanvas()
})

webSocket.on("gameStarted", (data) => {
    if (data.length === 1) {
        names.push(data.players.name)
    } else {
        let players = data["players"]

        let index = 1
        for(let people in players){
            let player = players[people]
            if (player.name === namePlayerOne) {
                indexPlayer = index
            }
            names.push(player.name)
            index++
        }
 
    }

    game = new Game(canvas, names, indexPlayer, 3)
    listener = new Listener()
    resizeCanvas()
})

webSocket.on("updateGame", (data) => {
    data["keySet"] = listener.moveSet

    game.update(data)
    game.draw()

    let info = {
        "keySet" : listener.moveSet,
        "actualImgAction" : game.player.action,
        "actualImgFrame" : game.player.animation.frame,
        "tilemapRect" : game.tilemap.playableArea,
        "playerRect" : game.player.rect,
    }
    sendMessage("updatePlayer", info)
})



