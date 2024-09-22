class ItemDescription {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    draw(ctx, x, y) {
        ctx.fillStyle = '#632e38';
        ctx.fillRect(x, y, 400, 200);

        ctx.strokeStyle = '#38191f';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, 400, 200);

        ctx.fillStyle = '#c7ac00';
        ctx.font = 'bold 35px "New Amsterdam"';
        ctx.fillText(this.name, x + 10, y + 40);

        ctx.fillStyle = 'white';
        ctx.font = '20px "Inconsolata"';

        this.wrapText(ctx, this.description, x + 10, y + 80, 380, 20);
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        let words = text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }
}


class Item {
    constructor(img, name, description, spawnChance) {
        this.img = img
        this.name = name
        this.description = description
        this.spawnChance = spawnChance
        this.itemDescription = new ItemDescription(this.name, this.description)
    }
    draw(ctx, x, y){
        this.itemDescription.draw(ctx, x, y)
    }
}

class Armor extends Item {
    constructor(img, name, type, def, description, spawnChance) {
        super(img, name, description, spawnChance)
        this.type = type
        this.def = def
    }
    copy() {
        let item = new Armor(this.img, this.name, this.type, this.def, this.description, this.spawnChance)
        return item
    }
}

class Necklace extends Item {
    constructor(img, name, points, effects, description, spawnChance) {
        super(img, name, description, spawnChance)
        this.points = points
        this.effect = effects
        this.type = "necklace"
    }
    copy() {
        let item = new Necklace(this.img, this.name, this.points, this.effects, this.description, this.spawnChance)
        return item
    }
}

class Ring extends Item {
    constructor(img, name, points, effect, description, spawnChance) {
        super(img, name, description, spawnChance)
        this.points = points
        this.effect = effect
        this.type = "ring"
    }
    copy() {
        let item = new Ring(this.img, this.name, this.points, this.effect, this.description, this.spawnChance)
        return item
    }
}

class Sword extends Item {
    constructor(img, name, description, atk, area, effect, particleColor, spawnChance) {
        super(img, name, description, spawnChance)
        this.atk = atk
        this.area = area
        this.effect = effect
        this.particleColor = particleColor
        this.type = "sword"
    }
    copy() {
        let item = new Sword(this.img, this.name, this.description, this.atk, this.area, this.effect, this.particleColor, this.spawnChance)
        return item
    }
}

class Shield extends Item {
    constructor(img, name, def, description, spawnChance) {
        super(img, name, description, spawnChance)
        this.def = def
        this.type = "shield"
    }
    copy() {
        let item = new Shield(this.img, this.name, this.def, this.description, this.spawnChance)
        return item
    }
}
