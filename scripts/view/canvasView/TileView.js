const TILE_SIZE = 40;

export class TileView {

    static assets;

    constructor(tileModel, gridView) {
        this.tileModel = tileModel;
        this.gridModel = tileModel.gridModel;
        this.gridController = gridView.controller;
        this.x = tileModel.x;
        this.y = tileModel.y;
        this.gridView = gridView;

        this.createTileDOM()
        this.ctx = this.gridView.ctx;

        this.isSelect = false;
    }

    createTileDOM() {
        this.img = new Image(TILE_SIZE, TILE_SIZE);
        this.img.src = this.getImgUrl();
    }

    updateCoordsFromModel() {
        if (!this.tileModel) return this;
        this.x = this.tileModel.x;
        this.y = this.tileModel.y;
        return this;
    }

    render(x = null,y = null) {
        if (!this.tileModel) return;
        if (this.isSelect) this.setBackground("red");
        this.img.src = this.getImgUrl();
        this.img.onload = () => {
            if (x !== null && y !== null) {
                this.ctx.drawImage(this.img, y, x)
            } else {
                this.ctx.drawImage(this.img, this.y * TILE_SIZE, this.x * TILE_SIZE)
            }
        }
    }

    async renderSwap() {

        this.toggleSelect(false).translateTo(this.tileModel.x, this.tileModel.y, 1000, () => this.updateCoordsFromModel())
    }

    async translateTo(x, y, duration = 1000, callBackFunction) {
        if (this.x === x) {
            for (let i = y * TILE_SIZE; i <= TILE_SIZE; i++) {
                this.render(x, i )
                window.requestAnimationFrame(() => this.render(x, y))
            }
        } else if (this.y === y) {
            for (let i = x * TILE_SIZE; i <= TILE_SIZE; i++) {
                this.render(i, y)
                window.requestAnimationFrame(() => this.render(x, y))
            }
        }

        callBackFunction();

    }

    async renderCombo(centerTile) {
        // this.scaleImgTo(0, 750)
        // this.translateImgTo(centerTile.x, centerTile.y, 500, () => this.toggleVisibility(false))
    }

    async renderFall(fallData) {
        // this.tileModel = this.gridModel.tiles[this.x][this.y];
        // if (fallData === 0 && this.tileModel) {
        //     setTimeout(() => this.toggleVisibility(true).updateImage(), 1000)
        //     return
        // }
        //
        // this.translateImgTo(fallData.actualX, this.y, 1000, () => this.tileModel ? this.toggleVisibility(true) .updateImage(): null)
    }

      async renderRefill() {
        this.render();
      }

    // Animation

    async translateImgTo(x, y, duration = 1000, callBackFunction, autoRemoveDuration = duration) {
        const transition = new TransitionHandler(this.imgDOM, "inset", duration, "ease-in-out")
        x = x - this.x;
        y = y - this.y;
        this.imgDOM.style.inset = `${x * TILE_SIZE}px 0px 0px ${y * TILE_SIZE}px`;
        if (autoRemoveDuration > 0) {
            setTimeout(() => {
                transition.removeTransition();
                this.resetImgTranslate();
                if (typeof callBackFunction === "function") callBackFunction();
            }, autoRemoveDuration)
        }
        return this;
    }

    resetImgTranslate() {
        this.imgDOM.style.inset = `0px 0px 0px 0px`;
    }

    async scaleImgTo(scale, duration = 1000, callBackFunction, autoRemoveDuration = duration) {
        const transition = new TransitionHandler(this.imgDOM, "scale", duration, "ease-in-out")
        this.imgDOM.style.scale = scale;
        if (autoRemoveDuration > 0) {
            setTimeout(() => {
                transition.removeTransition();
                this.resetImgScale();
                if (typeof callBackFunction === "function") callBackFunction();
            }, autoRemoveDuration)
        }
        return this;
    }

    resetImgScale() {
        this.imgDOM.style.scale = `1`;
    }

    // Utils
    getImgUrl() {
        return "/assets/images/" + this.tileModel.type.name + ".png";
    }

    // View update
    setBackground(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.y * TILE_SIZE, this.x * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    toggleSelect(selected) {
        this.isSelect = selected;
        this.ctx.clearRect(this.y * TILE_SIZE, this.x * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        this.render();
        return this;
    }

    updateImage() {
        this.imgDOM.src = this.getImgUrl();
        return this;
    }

    toggleVisibility(visible) {
        this.tileDOM.style.visibility = visible ? "visible" : "hidden";
        return this;
    }

    getDOMBounds() {
        return this.imgDOM.getBoundingClientRect();
    }
}