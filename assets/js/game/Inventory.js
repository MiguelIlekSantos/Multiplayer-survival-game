class Slot{
    constructor(){
        this.slotImg = InventorySprite[3]
        this.itemImg 
        this.itemName 
    }
}


class Inventory{
    constructor(ctx, scale){
        this.ctx = ctx
        this.scale = scale
        this.bgAvgItens = InventorySprite[2]
        this.bgMainItens = InventorySprite[4]
        this.closeBtn = InventorySprite[1]
    }

    draw(showInventory){
        let avgBgx = 200
        let avgBgy = 200

        if (showInventory) {
            this.ctx.drawImage(this.bgMainItens, avgBgx, avgBgy, this.bgMainItens.width * this.scale, this.bgMainItens.height * this.scale)
            
            let mainBgx = avgBgx + 400
            let mainBgy = avgBgy 
            
            this.ctx.drawImage(this.bgAvgItens, mainBgx, mainBgy, this.bgAvgItens.width * this.scale, this.bgAvgItens.height * this.scale)
        }
    }    
}