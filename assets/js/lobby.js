const webSocket = io();

const loginPage = document.getElementById("login")
const dashboardPage = document.getElementById("dashboard")
const startingPage = document.getElementById("starting")
const canvasPage = document.getElementById("canvas-content")
const inputNickname = document.getElementById("nickname")
const enemyList = document.getElementById("enemyList")
const party1 = document.getElementById("party1")
const party2 = document.getElementById("party2")
const requestList = document.getElementById("requestList")
const startingNum = document.getElementById("startingNum")
const cancelStartingBtn = document.getElementById("cancelStarting")
const p1Nick = document.getElementById("play1nick")



//              0           1               2           3
const windows = [loginPage, dashboardPage, startingPage, canvasPage]


var namePlayerOne
var partyCounter = 0
var requestTimers = []
var requestId = 0
var actualGroup = 1
var timeToStart
var canvasPlayers = []




// --------------------------------LOGIN------------------------------------






function register() {
    if (verifyName(inputNickname.value)) {
        sendMessage('register', inputNickname.value)
        namePlayerOne = inputNickname.value
    } else {
        alert("Your nickname must have between 2 and 20 letters")
    }
}

function verifyName(name) {
    if (name.length >= 2) {
        if (name.length < 20) {
            return true
        }
    }
    return false
}






// ----------------------------MESSAGES HANDLING------------------------------------






webSocket.on("login", () => {
    actualWindow([1])
    p1Nick.innerHTML = inputNickname.value
    partyCounter = 1
    let actualCanvas = document.getElementById(`canvas-1`)

    let newCanvas = new lobbyCanvas(actualCanvas)
    newCanvas.draw()
    canvasPlayers.push(newCanvas)
})

webSocket.on("loginFailed", () => {
    inputNickname.style.border = "1px solid red"
    alert("There is already a user logged in with this nickname, please choose a different one")
})

webSocket.on("enemyList", (data) => {
    enemyList.innerHTML = ""
    data.forEach(enemy => {
        enemyList.innerHTML += `<div class="enemy topics" onclick="sendRequest('${enemy.id}', '${enemy.active}')">
                                    <div class="border"></div>
                                    <div class="enemy-info sup-border">
                                        <p>${enemy.name}</p>
                                        <div>
                                            <div class="ball ${enemyState(enemy.active)}"></div>
                                            <p>${enemy.active}</p>
                                        </div>
                                    </div>
                                </div>`
    });
    if (enemyList.innerHTML === "") {
        enemyList.innerHTML = "<p>Nobody is online :(</p>";
    }

})

webSocket.on("tryRequest", (data) => {

    requestList.innerHTML += `  <div class="request topics" id="${requestId}">
                                    <div class="request-counter" id="${requestId}-counter">
                                        5
                                    </div>
                                    <div class="names">
                                        <p>Request from :</p>
                                        <p>${data.name}</p>
                                    </div>
                                    <div class="options">
                                        <div onclick="acceptRequest('${data.id}', '${requestId}')">Accept</div>
                                        <div onclick="refuseRequest('${requestId}')">Refuse</div>
                                    </div>
                                </div>`

    createTimerRequest(requestId);
    requestId++;
})

webSocket.on("updateParty", (data) => {
    party1.innerHTML = "";
    party2.innerHTML = "";
    canvasPlayers = [];

    let labels = ["one", "two", "three", "four"];
    let a = 0;
    let counter = 1

    for (let key in data.players) {
        let player = data.players[key];

        if (a <= 1) {
            party1.innerHTML += `<div class="player player-${labels[a]}">
                                        <p class="player-${labels[a]}" id="play${a + 1}nick">${player.name}</p>
                                        <canvas id="canvas-${a + 1}"></canvas>
                                    </div>`;
        } else {
            party2.innerHTML += `<div class="player player-${labels[a]}">
                                        <p class="player-${labels[a]}" id="play${a + 1}nick">${player.name}</p>
                                        <canvas id="canvas-${a + 1}"></canvas>
                                    </div>`;
        }

        counter++;
        a++;
    }

    for (let b = 1; b <= a; b++) {
        let actualCanvas = document.getElementById(`canvas-${b}`)

        let newCanvas = new lobbyCanvas(actualCanvas)
        newCanvas.draw()
        canvasPlayers.push(newCanvas)       
    }

    actualGroup = a
});

webSocket.on("PrimaryStartCount", () => {
    startingNum.innerHTML = "5"
    actualWindow([1, 2])
})

webSocket.on("startCount", (data) => {
    startingNum.innerHTML = data
})

webSocket.on("cancelStart", () => {
    actualWindow([1])
})

webSocket.on("gameStarted", () => {
    actualWindow([3])
})








// ------------------------------MANAGING FUNCTIONS--------------------------










function startCounting() {
    sendMessage("startCount", 0)
}

function cancelStart() {
    sendMessage("cancelStart", 0)
}

function acceptRequest(enemyId, id) {
    if (actualGroup >= 4) {
        alert("Your current group is already full")
    } else {
        sendMessage("acceptRequest", enemyId)
        const request = document.getElementById(id);
        request.remove()
    }
}

function refuseRequest(id) {
    const request = document.getElementById(id);
    request.remove()
}

function sendRequest(enemyId, state) {
    if (actualGroup >= 4) {
        alert("Your current group is already full")
    } else if (state === "InGroup" || state === "Playing") {
        alert("This player is already in a group")
    } else {
        sendMessage("offerRequest", enemyId)
    }
}

function enemyState(state) {
    if (state == "Online") {
        return "green"
    } else if (state == "Playing") {
        return "red"
    } else if (state == "InGroup") {
        return "yellow"
    }
}

function actualWindow(showWindows) {
    windows.forEach((window, index) => {
        window.style.display = showWindows.includes(index) ? "flex" : "none";
    });
}

function createTimerRequest(id) {
    requestTimers[id] = 5
    const counter = document.getElementById(`${id}-counter`)
    const timer = setInterval(() => {
        requestTimers[id]--
        counter.innerText = requestTimers[id]
        if (requestTimers[id] <= 0) {
            const request = document.getElementById(id);
            if (request) {
                request.remove();
            }
            clearInterval(timer);
        }
    }, 1000);
}



function sendMessage(type, data) {
    webSocket.emit(`${type}`, data);
}

