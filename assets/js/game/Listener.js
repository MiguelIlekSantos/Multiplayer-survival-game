class Listener {
    constructor() {
        this.moveSet = {
            top: false,
            left: false,
            bottom: false,
            right: false,
            inventory: false
        };

        this.inventoryKeyPressed = false; 

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        if (event.key === "a") {
            this.moveSet.left = true;
        }
        if (event.key === "s") {
            this.moveSet.bottom = true;
        }
        if (event.key === "d") {
            this.moveSet.right = true;
        }
        if (event.key === "w") {
            this.moveSet.top = true;
        }
        if (event.key === "e" && !this.inventoryKeyPressed) {
            this.moveSet.inventory = !this.moveSet.inventory;
            this.inventoryKeyPressed = true; 
        }
    }

    handleKeyUp(event) {
        if (event.key === "a") {
            this.moveSet.left = false;
        }
        if (event.key === "s") {
            this.moveSet.bottom = false;
        }
        if (event.key === "d") {
            this.moveSet.right = false;
        }
        if (event.key === "w") {
            this.moveSet.top = false;
        }
        if (event.key === "e") {
            this.inventoryKeyPressed = false; 
        }
    }
}
