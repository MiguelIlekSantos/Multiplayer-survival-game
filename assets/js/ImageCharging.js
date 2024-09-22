const BASE_PATH = "assets/imgs"

var PlayerIdleSprites
var PlayerDieSprites
var PlayerSitSprites
var PlayerWalkSprites

var PlayerSprites

var InventorySprite
var voidItensSprite
var metalArmorSprite
var goldArmorSprite
var diamondArmorSprite
var obidianArmorSprite

var Armors = []
var Shields = []
var Rings = []
var Necklaces = []
var Swords = []
var ItemsNames = []


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

class SpriteLoader {
    constructor(basepath, numberImgs) {
        this.basepath = basepath;
        this.numberImgs = numberImgs;
        this.sprites = [];
    }

    async loadSprites() {
        const paths = this.generatePaths();
        const spritePromises = paths.map(path => {
            const sprite = new ImageCharging(BASE_PATH + path);
            return sprite.returnImg();
        });
        this.sprites = await Promise.all(spritePromises);
        return this.sprites;
    }

    generatePaths() {
        let paths = [];
        for (let a = 0; a < this.numberImgs; a++) {
            let path = `${this.basepath}/${a}.png`;
            paths.push(path);
        }
        return paths;
    }
}

async function loadSprites(basepath, numberImgs) {
    const loader = new SpriteLoader(basepath, numberImgs);
    return await loader.loadSprites();
}

(async () => {
    // Personagem
    PlayerIdleSprites = await loadSprites("/character/idle", 2);
    PlayerDieSprites = await loadSprites("/character/die", 4);
    PlayerSitSprites = await loadSprites("/character/sit", 2);
    PlayerWalkSprites = await loadSprites("/character/walk", 8);

    // Tilemap
    TilemapSprite = await loadSprites("/tilemap", 3);

    // Inventário
    InventorySprite = await loadSprites("/inventory", 5);
    voidItensSprite = await loadSprites("/inventory/voidItens", 7);

    // Armaduras
    metalArmorSprite = await loadSprites("/itens/Armors/Metal", 3);
    goldArmorSprite = await loadSprites("/itens/Armors/Gold", 3);
    diamondArmorSprite = await loadSprites("/itens/Armors/Diamond", 3);
    obidianArmorSprite = await loadSprites("/itens/Armors/Obsidian", 3);

    // Outros itens
    necklaceSprite = await loadSprites("/itens/Necklace", 4);
    ringSprite = await loadSprites("/itens/Ring", 6);
    shieldSprite = await loadSprites("/itens/Shield", 7);
    swordSprite = await loadSprites("/itens/Sword", 19);



    ArmorSprites = [metalArmorSprite, goldArmorSprite, diamondArmorSprite, obidianArmorSprite];
    armorTypes = ["metal", "gold", "diamond", "obsidian"];

    fetch('/itens')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let armors = data["Armors"];
            var index = 0;
            for (let i in armors) {
                let armor = armors[i];

                let helmetInfo = armor["helmet"];
                let breastplateInfo = armor["breastplate"];
                let legsInfo = armor["legs"];

                let helmet = new Armor(ArmorSprites[index][0], i + " helmet", "helmet", helmetInfo["def"], helmetInfo["description"], 50);
                let breastplate = new Armor(ArmorSprites[index][1], i + " breastplate", "breastplate", breastplateInfo["def"], breastplateInfo["description"], 20);
                let legs = new Armor(ArmorSprites[index][2], i + " legs", "legs", legsInfo["def"], legsInfo["description"], 30);

                ItemsNames.push(i + " helmet");
                ItemsNames.push(i + " breastplate");
                ItemsNames.push(i + " legs");

                let armorSet = [helmet, breastplate, legs];
                Armors[armorTypes[index]] = armorSet;

                index++;
            }

            let shields = data["Shields"];
            index = 0;
            for (let i in shields) {
                let shieldInfo = shields[i];

                let shield = new Shield(shieldSprite[index], i, shieldInfo["def"], shieldInfo["description"], shieldInfo["spawnChance"]);

                Shields.push(shield);
                ItemsNames.push(i);

                index++;
            }

            let necklaces = data["Necklaces"];
            index = 0;
            for (let i in necklaces) {
                let necklacesInfo = necklaces[i];

                let necklace = new Necklace(necklaceSprite[index], i, necklacesInfo["points"], necklacesInfo["effects"], necklacesInfo["description"], necklacesInfo["spawnChance"]);

                Necklaces.push(necklace);
                ItemsNames.push(i);

                index++;
            }

            let rings = data["Rings"];
            index = 0;
            for (let i in rings) {
                let ringsInfo = rings[i];

                let ring = new Ring(ringSprite[index], i, ringsInfo["points"], ringsInfo["effects"], ringsInfo["description"], ringsInfo["spawnChance"]);

                Rings.push(ring);
                ItemsNames.push(i);

                index++;
            }

            let swords = data["Swords"];
            index = 0;
            for (let i in swords) {
                let swordInfo = swords[i];

                let sword = new Sword(swordSprite[index], i, swordInfo["description"], swordInfo["atkDamage"], swordInfo["area"], swordInfo["effect"], swordInfo["particleColor"], swordInfo["spawnChance"]);

                Swords.push(sword);
                ItemsNames.push(i);

                index++;
            }

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    PlayerSprites = {
        "Idle": PlayerIdleSprites,
        "Die": PlayerDieSprites,
        "Sit": PlayerSitSprites,
        "Walk": PlayerWalkSprites,
    };

})();
