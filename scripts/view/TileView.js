import {TransitionHandler} from "./TransitionHandler";

export const TILE_SIZE = 60;

export class TileView {

    constructor(tileModel, gridView, index) {
        this.tileModel = tileModel;
        this.gridModel = tileModel.gridModel;
        this.gridController = gridView.controller;
        this.x = tileModel.x;
        this.y = tileModel.y;
        this.gridView = gridView;

        this.tileDOM = this.createTileDOM(index);
        this.imgDOMConainer = this.tileDOM.querySelector(".img--container");
        this.imgDOM = this.imgDOMConainer.querySelector("img");
        this.gridView.gridDOM.appendChild(this.tileDOM);

        this.isSelect = false;
    }

    createTileDOM(index) {
        const temp = document.createElement("div");
        temp.classList.add("grid--item");
        temp.setAttribute("item-index", index);
        temp.innerHTML = `<div class="img--container"><img src="${this.getImgUrl()}" alt="${this.tileModel.type.name}"/></div>`

        temp.addEventListener("click", async () => {
            await this.gridController.selectTile(this);
        })

        temp.addEventListener("dragstart", async (e) => {
            await this.gridController.selectTile(this);
        })

        temp.addEventListener("dragover", (e) => {
            e.preventDefault();
        })

        temp.addEventListener("drop", async (e) => {
            e.preventDefault();
            await this.gridController.selectTile(this);
        })

        return temp;
    }

    render() {
        this.tileModel = this.gridModel.tiles[this.x][this.y];
        if (!this.tileModel) {
            this.toggleVisibility(false);
            return;
        }

        this.updateImage().toggleVisibility(true)
    }

    async renderSwap(xToSwap, yToSwap) {
        this.tileModel = this.gridModel.tiles[this.x][this.y];
        this.translateImgTo(xToSwap, yToSwap, 1000, () => this.updateImage())
    }

    async renderCombo(centerTile) {
        this.scaleImgTo(0, 750)
        this.translateImgTo(centerTile.x, centerTile.y, 500, () => this.toggleVisibility(false))
    }

    async renderFall(fallData) {
        this.tileModel = this.gridModel.tiles[this.x][this.y];
        if (fallData === 0 && this.tileModel) {
            setTimeout(() => this.toggleVisibility(true).updateImage(), 1000)
            return
        }

        this.translateImgTo(fallData.actualX, this.y, 1000, () => this.tileModel ? this.toggleVisibility(true) .updateImage(): null)
    }

      async renderRefill() {
        this.render();
      }

    // Animation

    async translateImgTo(x, y, duration = 1000, callBackFunction, autoRemoveDuration = duration) {
        const transition = new TransitionHandler(this.imgDOMConainer, "inset", duration, "ease-in-out")
        x = x - this.x;
        y = y - this.y;
        this.imgDOMConainer.style.inset = `${x * TILE_SIZE}px 0px 0px ${y * TILE_SIZE}px`;
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
        this.imgDOMConainer.style.inset = `0px 0px 0px 0px`;
    }

    async scaleImgTo(scale, duration = 1000, callBackFunction, autoRemoveDuration = duration) {
        const transition = new TransitionHandler(this.imgDOMConainer, "scale", duration, "ease-in-out")
        this.imgDOMConainer.style.scale = scale;
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
        this.imgDOMConainer.style.scale = `1`;
    }

    // Utils
    getImgUrl(hightlighted = false) {
        if (hightlighted) return "assets/images/" + this.tileModel.type.name + "-Highlighted@2x.png";
        return "assets/images/" + this.tileModel.type.name + ".png";
    }

    // View update
    setBackground(color) {
        if (color === null) {
            this.tileDOM.style.background = "";
        } else {
            color = color || "red";
            this.tileDOM.style.background = color;
        }
        return this;
    }

    toggleSelect(selected) {
        this.isSelect = selected;
        this.updateImage(selected)
        this.tileDOM.classList.toggle("grid--item--selected", selected);
        return this;
    }

    updateImage(hightlighted = false) {
        this.imgDOM.src = this.getImgUrl(hightlighted);
        return this;
    }

    toggleVisibility(visible) {
        this.tileDOM.style.visibility = visible ? "visible" : "hidden";
        return this;
    }
}