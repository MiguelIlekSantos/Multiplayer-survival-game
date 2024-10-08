class Listener {
    constructor() {
        this.moveSet = {
            top: false,
            left: false,
            bottom: false,
            right: false,
            inventory: false,
            mouse: {
                "click": false,
                "x": 0,
                "y": 0,
            }
        };

        this.flagMouse = false;
        this.inventoryKeyPressed = false;

        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
        document.addEventListener("mousedown", this.handleMouseDown.bind(this));
        document.addEventListener("mouseup", this.handleMouseUp.bind(this));
        document.addEventListener("mousemove", this.handleMouseMove.bind(this)); 
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

    handleMouseDown(event) {
        if (event.button === 0 && this.flagMouse) { 
            this.moveSet.mouse["click"] = true;
            this.moveSet.mouse["x"] = event.clientX;
            this.moveSet.mouse["y"] = event.clientY;
        }
        this.flagMouse = false;
    }

    handleMouseUp(event) {
        if (event.button === 0) { 
            this.moveSet.mouse["click"] = false;
            this.moveSet.mouse["x"] = 0;
            this.moveSet.mouse["y"] = 0;
            this.flagMouse = true;
        }
    }

    handleMouseMove(event) {
        this.moveSet.mouse["x"] = event.clientX;
        this.moveSet.mouse["y"] = event.clientY;
    }
}
