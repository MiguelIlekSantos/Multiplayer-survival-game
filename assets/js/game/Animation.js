class Animation {
    constructor(sprites, frames) {
        this.sprites = sprites;
        this.frames = frames;
        this.frame = 0;
        this.counter = 0;
        this.loop = true;
    }

    updateImg(action) {
        if (action === "die" || action === "sit") {
            this.loop = false;
        }

        if (this.loop) {
            if (this.counter % this.frames === 0) {
                this.frame++;
            }

            if (this.frame >= this.sprites[action].length) {
                this.frame = 0;
            }

            this.counter++;
            return this.sprites[action][this.frame];
        } else {
            if (this.counter % this.frames === 0) {
                this.frame++;
            }

            if (this.frame >= this.sprites[action].length) {
                this.frame = this.sprites[action].length - 1;
            }

            this.counter++;
            return this.sprites[action][this.frame];
        }
    }
}
