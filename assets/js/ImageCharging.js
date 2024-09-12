const BASE_PATH = "assets/imgs"

var PlayerIdleSprites
var PlayerDieSprites
var PlayerSitSprites
var PlayerWalkSprites

var PlayerSprites

var InventorySprite

class ImageCharging {
    constructor(path) {
        this.img = new Image();
        this.img.src = path;
    }

    returnImg() {
        return new Promise((resolve, reject) => {
            this.img.onload = () => resolve(this.img);
            this.img.onerror = () => reject(`Falha ao carregar a imagem: ${this.img.src}`);
        });
    }
}

class Sprites {
    constructor() {
        this.sprites = [];
    }

    async loadSprites(paths) {
        const spritePromises = paths.map(path => {
            const sprite = new ImageCharging(BASE_PATH + path);
            return sprite.returnImg();
        });

        this.sprites = await Promise.all(spritePromises);
        return this.sprites;
    }
}

class Path {
    constructor(basepath, numberImgs) {
        this.paths = [];
        for (let a = 0; a < numberImgs; a++) {
            let path = `${basepath}/${a}.png`; 
            this.paths.push(path);
        }
    }

    returnPaths() {
        return this.paths;
    }
}


const playerIdlePath = new Path("/character/idle", 2).returnPaths();
const playerDiePath = new Path("/character/die", 4).returnPaths();
const playerSitPath = new Path("/character/sit", 2).returnPaths();
const playerWalkPath = new Path("/character/walk", 8).returnPaths();
const tilemapPath = new Path("/tilemap", 3).returnPaths();
const inventoryPath = new Path("/inventory", 5).returnPaths();

(async () => {
    const idleSpritesInstance = new Sprites();
    const dieSpritesInstance = new Sprites();
    const sitSpritesInstance = new Sprites();
    const walkSpritesInstance = new Sprites();
    const tilemapSpritesInstance = new Sprites();
    const inventorySpritesInstance = new Sprites();

    PlayerIdleSprites = await idleSpritesInstance.loadSprites(playerIdlePath);
    PlayerDieSprites = await dieSpritesInstance.loadSprites(playerDiePath);
    PlayerSitSprites = await sitSpritesInstance.loadSprites(playerSitPath);
    PlayerWalkSprites = await walkSpritesInstance.loadSprites(playerWalkPath);
    TilemapSprite = await tilemapSpritesInstance.loadSprites(tilemapPath);
    InventorySprite = await inventorySpritesInstance.loadSprites(inventoryPath);

    PlayerSprites = {
        "Idle": PlayerIdleSprites,
        "Die": PlayerDieSprites,
        "Sit": PlayerSitSprites,
        "Walk": PlayerWalkSprites,
    }

})();
