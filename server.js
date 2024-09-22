const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/itens', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'itens.json'));
});

const TICK_RATE = 60;
const TICK_INTERVAL = 1000 / TICK_RATE;


class Player {
    constructor(id, active, name) {
        this.id = id;
        this.active = active;
        this.name = name;
        this.timer
        this.gameData = {
            "x": 0,
            "y": 0,
            "actualImg": 0,
            "speed": 5,
        }
    }
}

class Party {
    constructor(player1, player2) {
        this.players = {
            "Player1": player1,
            "Player2": player2
        }
        this.timer
        this.playing = false
    }
}

var players = {}
var partys = []


var visualizingMode = false


io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        showReceivedMessage("disconnect", 0)

        let playerGrou = findParty(socket.id)

        if (playerGrou) {
            let playerGroup = playerGrou.players
            let index = 0

            for (let p in playerGroup) {
                let player = playerGroup[p]
                if (player.id === socket.id) {
                    delete playerGroup[p]
                    break
                }
                index++
            }

            index++

            for (let i = index; i <= 4; i++) {
                let string = `Player${i}`

                if (playerGroup.hasOwnProperty(string)) {
                    playerGroup[`Player${i - 1}`] = playerGroup[string]
                    delete playerGroup[string]
                }
            }

            if (Object.keys(playerGroup).length === 1) {
                let player = playerGroup["Player1"]
                player.active = "Online"
                sendMessage(player.id, "updateParty", playerGrou)
                partys = partys.filter(p => p !== playerGrou);
            } else {
                updateParty(playerGrou);
            }
        }

        delete players[socket.id]
        updateEnemyList()
    });

    socket.on('register', (data) => {
        showReceivedMessage("Register", data)

        let flag = false
        for (let id in players) {
            if (players[id].name === data) {
                flag = true;
                break;
            }
        }

        if (!flag) {
            let player = new Player(socket.id, "Online", data)
            players[socket.id] = player
            sendMessage(socket.id, "login", data)
            updateEnemyList()
        } else {
            sendMessage(socket.id, "loginFailed", 0)
        }
    })

    socket.on('offerRequest', (data) => {
        showReceivedMessage("offerRequest", data)

        let sender = findUser(socket.id)
        let requested = findUser(data)

        if (sender.active != "Playing" && requested.active != "Playing") {
            sendMessage(requested.id, "tryRequest", sender)
        }
    })

    socket.on('acceptRequest', (data) => {
        showReceivedMessage("acceptRequest", data)

        let sender = findUser(data)
        let requested = findUser(socket.id)

        if (sender.active != "Playing" && requested.active != "Playing") {
            if (sender.active === "InGroup") {
                let senderParty = findParty(sender.id)
                let length = Object.keys(senderParty.players).length + 1;
                let key = `Player${length}`

                senderParty.players[key] = requested
                requested.active = "InGroup"

                updateParty(senderParty)
                updateEnemyList()

            } else {
                let newParty = new Party(sender, requested)

                sender.active = "InGroup"
                requested.active = "InGroup"

                updateParty(newParty)
                updateEnemyList()
                partys.push(newParty)
            }


        }
    })

    socket.on("startCount", () => {
        showReceivedMessage("startCount", 0)

        let actualParty = findParty(socket.id)

        if (actualParty) {
            sendMessageToParty(actualParty, "PrimaryStartCount", 0)

            let counter = 5
            actualParty.timer = setInterval(() => {
                counter--
                sendMessageToParty(actualParty, "startCount", counter)
                if (counter == 0) {
                    clearInterval(actualParty.timer)
                    let data = {
                        "players": actualParty.players,
                        "length": Object.keys(actualParty.players).length
                    }
                    actualParty.playing = true
                    sendMessageToParty(actualParty, "gameStarted", data)
                    let players = actualParty.players
                    let index = 1
                    for (let a in players) {
                        let player = players[a];
                        switch (index) {
                            case 1:
                                player.gameData["x"] += 0
                                player.gameData["y"] += 0
                                break;
                            case 2:
                                player.gameData["x"] += 100
                                player.gameData["y"] += 0
                                break;
                            case 3:
                                player.gameData["x"] += 0
                                player.gameData["y"] += 100
                                break;
                            case 4:
                                player.gameData["x"] += 100
                                player.gameData["y"] += 100
                                break;
                        }

                        index++
                    }
                }
            }, 1000);
        } else {
            let actualPlayer = findUser(socket.id)

            sendMessage(socket.id, "PrimaryStartCount", 0)

            let counter = 5
            actualPlayer.timer = setInterval(() => {
                counter--
                sendMessage(socket.id, "startCount", counter)
                if (counter == 0) {
                    clearInterval(actualPlayer.timer)
                    let data = {
                        "players": actualPlayer,
                        "length": 1
                    }
                    sendMessage(socket.id, "gameStarted", data)
                }
            }, 1000);

        }



    })

    socket.on("cancelStart", () => {
        showReceivedMessage("cancelStart", 0)

        let actualParty = findParty(socket.id)

        if (actualParty) {
            clearInterval(actualParty.timer)
            sendMessageToParty(actualParty, "cancelStart", 0)
        } else {
            let actualPlayer = findUser(socket.id)

            if (actualPlayer.timer) {
                clearInterval(actualPlayer.timer)
            }

            sendMessage(socket.id, "cancelStart", 0)
        }

    })

    socket.on("updatePlayer", (data) => {
        showReceivedMessage("updatePlayer", 0)
        let actualPlayer = findUser(socket.id)
        handleData(actualPlayer, data)
    })





});

function gameLoop() {
    partys.forEach(party => {
        if (party.playing) {
            let data = {
                "PlayersData": party.players,
                "MapData": 0,
            }

            let a = data["PlayersData"]
            for (let play in a) {
                let element = a[play];
                // console.log(element)
            }

            sendMessageToParty(party, "updateGame", data)
        }
    });
}

setInterval(gameLoop, TICK_INTERVAL);




function handleData(player, data) {
    let speed = player.gameData["speed"]
    let tilemapRect = data["tilemapRect"]
    let playerRect = data["playerRect"]
    player.gameData["actualImg"] = ["Idle", 0]
    
    if (!data["keySet"].inventory) {
        player.gameData["actualImg"] = [data["actualImgAction"], data["actualImgFrame"]]

        if (data["keySet"].top) {
            if (tilemapRect.y < playerRect.y - speed) {
                player.gameData["y"] -= speed
            }
        }
        if (data["keySet"].bottom) {
            if (tilemapRect.height > playerRect.y + speed) {
                player.gameData["y"] += speed
            }
        }
        if (data["keySet"].left) {
            if (tilemapRect.x < playerRect.x - speed) {
                player.gameData["x"] -= speed
            }
        }
        if (data["keySet"].right) {
            if (tilemapRect.width > playerRect.x + speed) {
                player.gameData["x"] += speed
            }
        }
    }

}

function updateEnemyList() {
    for (let id in players) {
        const enemies = Object.values(players).filter(p => p.id !== id);
        io.to(id).emit('enemyList', enemies);
    }
}

function updateParty(party) {
    for (let key in party.players) {
        let player = party.players[key]
        sendMessage(player.id, "updateParty", party)
    }
}

function findParty(socketId) {
    for (let i = 0; i < partys.length; i++) {
        let party = partys[i];
        for (let player in party.players) {
            let playerr = party.players[player];
            if (playerr.id === socketId) {
                return party;
            }
        }
    }
}

function findUser(socketId) {
    for (let id in players) {
        if (players[id].id === socketId) {
            return players[id]
        }
    }
}

function showReceivedMessage(type, data) {
    if (visualizingMode) {
        console.log("\x1b[33m------------------------------------\x1b[0m"); // Amarelo
        console.log("\x1b[32m- Receiving...\x1b[0m"); // Verde
        console.log("\x1b[36m- Type Message: \x1b[0m" + type); // Ciano
        console.log("\x1b[36m- Data: \x1b[0m" + data); // Ciano
        console.log("\x1b[33m------------------------------------\x1b[0m"); // Amarelo
    }
}

function sendMessageToParty(party, type, data) {
    for (play in party.players) {
        let player = party.players[play]
        sendMessage(player.id, type, data)
    }
}

function sendMessage(socket, type, data) {
    if (visualizingMode) {
        console.log("\x1b[33m------------------------------------\x1b[0m"); // Amarelo
        console.log("\x1b[32m- Sending...\x1b[0m"); // Verde
        console.log("\x1b[36m- Type Message: \x1b[0m" + type); // Ciano
        console.log("\x1b[36m- Data: \x1b[0m" + data); // Ciano
        console.log("\x1b[33m------------------------------------\x1b[0m"); // Amarelo
    }

    io.to(socket).emit(`${type}`, data)
}



server.listen(3000, () => {
    console.log('listening on *:3000');
});
