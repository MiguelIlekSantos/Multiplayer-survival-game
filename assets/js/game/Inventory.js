class AvgSlot {
    constructor(ctx, scale, canvas) {
        this.canvas = canvas
        this.ctx = ctx
        this.scale = scale
        this.slotImg = InventorySprite[3]
        this.type = "any"
        this.item = 0
        this.drawDescription = false
        this.width = this.slotImg.width * this.scale
        this.height = this.slotImg.height * this.scale
        this.rect = new Rect(0, 0, this.width, this.height)
        this.selected = false
    }

    drawBorder() {
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.rect.x, this.rect.y, this.width, this.height);
    }

    drawItemDescription() {
        let xpos = this.rect.x + this.width
        let ypos = this.rect.y + this.height
        if (xpos + 400 > this.canvas.width) {
            xpos -= (400 + this.width)
        }

        if (ypos + 200 > this.canvas.height) {
            ypos -= (200 + this.height)
        }

        console.log(this.canvas.width)
        console.log(this.canvas.height)

        this.item.draw(this.ctx, xpos, ypos)
    }

    draw(x, y) {
        this.rect.update(x, y)
        this.ctx.drawImage(this.slotImg, x, y, this.slotImg.width * this.scale, this.slotImg.height * this.scale)
        if (this.selected) {
            this.drawBorder()
        }
        if (this.item != 0) {
            this.ctx.drawImage(this.item.img, x + 15, y + 15, this.slotImg.width * (this.scale - 2), this.slotImg.height * (this.scale - 2))
        }
    }
}

class MainSlot {
    constructor(ctx, scale, type, slotTypes, canvas) {
        this.canvas = canvas
        this.ctx = ctx
        this.scale = scale
        this.slotImg = InventorySprite[3]
        this.itemImg = voidItensSprite[type]
        this.item = 0
        this.drawDescription = false
        this.typeOriginal = type
        this.type = slotTypes[type]
        this.width = this.slotImg.width * this.scale
        this.height = this.slotImg.height * this.scale
        this.rect = new Rect(0, 0, this.width, this.height)
        this.selected = false
    }

    drawBorder() {
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.rect.x, this.rect.y, this.width, this.height);
    }

    drawItemDescription() {
        let xpos = this.rect.x + this.width
        let ypos = this.rect.y + this.height

        if (xpos > this.canvas.width) {
            xpos = this.rect.x - 400
        }

        if (ypos > this.canvas.height) {
            ypos = this.rect.y - 200
        }

        this.item.draw(this.ctx, xpos, ypos)
    }

    draw(x, y) {
        if (this.itemImg == 0) {
            this.itemImg = voidItensSprite[this.typeOriginal]
        }
        this.rect.update(x, y)
        this.ctx.drawImage(this.slotImg, x, y, this.slotImg.width * this.scale, this.slotImg.height * this.scale)
        if (this.item) {
            this.ctx.drawImage(this.item.img, x + 15, y + 15, this.itemImg.width * (this.scale - 2), this.itemImg.height * (this.scale - 2))
        }
        else {
            this.ctx.drawImage(this.itemImg, x, y, this.itemImg.width * this.scale, this.itemImg.height * this.scale)
        }
        if (this.selected) {
            this.drawBorder()
        }
    }
}


class Inventory {
    constructor(ctx, scale, canvas) {
        this.ctx = ctx
        this.scale = scale
        this.canvas = canvas
        this.bgAvgItens = InventorySprite[2]
        this.bgMainItens = InventorySprite[4]
        this.closeBtn = InventorySprite[1]
        this.mainSlotTypes = ["necklace", "helmet", "sword", "ring", "breastplate", "shield", "legs"]
        this.avgBgx
        this.avgBgy

        this.avgSlots = []
        for (let a = 0; a < 3; a++) {
            let avgBar = []
            for (let b = 0; b < 7; b++) {
                let slot = new AvgSlot(this.ctx, this.scale + 0.6, this.canvas)

                if (a == 0 && b == 0) {
                    slot.item = Swords[0].copy()
                }

                // if (a == 2 && b == 0) {
                //     slot.item = Rings[5].copy()
                // }
                // if (a == 2 && b == 1) {
                //     slot.item = Shields[6].copy()
                // }
                // if (a == 2 && b == 2) {
                //     slot.item = Swords[18].copy()
                // }
                // if (a == 2 && b == 3) {
                //     slot.item = Necklaces[3].copy()
                // }
                // if (a == 2 && b == 4) {
                //     slot.item = Armors["obsidian"][0].copy()
                // }
                // if (a == 2 && b == 5) {
                //     slot.item = Armors["obsidian"][1].copy()
                // }
                // if (a == 2 && b == 6) {
                //     slot.item = Armors["obsidian"][2].copy()
                // }
                avgBar.push(slot)
            }
            this.avgSlots.push(avgBar)
        }

        this.mainSlots = []
        let limit = 3
        let counter = 0
        for (let a = 0; a < 3; a++) {
            let avgBar = []
            if (a == 2) {
                limit = 1
            }
            for (let a = 0; a < limit; a++) {
                let slot = new MainSlot(this.ctx, this.scale + 0.6, counter, this.mainSlotTypes, this.canvas)
                avgBar.push(slot)
                counter++
            }
            this.mainSlots.push(avgBar)
        }

        this.allSlots = []

        this.avgSlots.forEach(avgBar => {
            this.allSlots.push(avgBar)
        });

        this.mainSlots.forEach(mainBar => {
            this.allSlots.push(mainBar)
        });
    }

    update(canvasWidth, canvasHeight) {
        this.avgBgx = canvasWidth * 0.1
        this.avgBgy = canvasHeight * 0.2
    }

    draw(showInventory) {
        if (showInventory) {
            let some = this.avgSlots[0][0].width + 5

            this.ctx.drawImage(this.bgMainItens, this.avgBgx, this.avgBgy, this.bgMainItens.width * this.scale, this.bgMainItens.height * this.scale)

            let a = this.avgBgx + 40
            let b = this.avgBgy + 35

            this.mainSlots.forEach(mainBar => {
                a = this.avgBgx + 40
                mainBar.forEach(slot => {
                    if (slot.type == "legs") {
                        slot.draw(a + some, b)
                    } else {
                        slot.draw(a, b)
                        a += some
                    }
                });
                b += some
            });


            let mainBgx = this.avgBgx + 400
            let mainBgy = this.avgBgy

            this.ctx.drawImage(this.bgAvgItens, mainBgx, mainBgy, this.bgAvgItens.width * this.scale, this.bgAvgItens.height * this.scale)

            let x = mainBgx + 30
            let y = mainBgy + 35

            this.avgSlots.forEach(avgBar => {
                x = mainBgx + 30
                avgBar.forEach(slot => {
                    slot.draw(x, y)
                    x += some
                });
                y += some
            });

            this.allSlots.forEach(bar => {
                bar.forEach(slot => {
                    if (slot.drawDescription) {
                        slot.drawItemDescription()
                    }
                });
            });
        }
    }
}