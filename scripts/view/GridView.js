import {TILE_SIZE, TileView} from "./TileView";

export class GridView {

    constructor(parentElement, model, controller) {
        this.parentElement = parentElement;
        const temp = this.createGridDOM()
        this.gridDOM = temp.container;
        this.gridSupContainer = temp.supContainer;
        this.model = model;
        this.controller = controller;
        this.tilesView = null;
    }

    updateStyle() {
        this.parentElement.style.setProperty("--nbColumns", this.controller.model.width);
        this.parentElement.style.setProperty("--nbRows", this.controller.model.height);
        this.parentElement.style.setProperty("--tileSize", TILE_SIZE + "px");
        return this;
    }

    createGridDOM() {
        const supContainer = document.createElement("div");
        supContainer.classList.add("grid--sup-container");

        const container = document.createElement("div");
        container.classList.add("grid--container");

        supContainer.appendChild(container);

        return {supContainer, container};
    }

    createTilesDOM() {
        const temp = [];
        this.model.tiles.flat().forEach((tileModel, index) => {
            temp.push(new TileView(tileModel, this, index));
        })
        return temp;
    }

    getTileView(x, y) {
        return this.tilesView.find(tileView => tileView.x === x && tileView.y === y);
    }

    render(tilesChanged) {
        if (!this.tilesView) {
            this.tilesView = this.createTilesDOM(this.model);
            this.parentElement.appendChild(this.gridSupContainer);
        }
        this.updateStyle()

        if (tilesChanged) {
            for (let tile of tilesChanged) {
                this.tilesView[tile.x * this.model.height + tile.y].render()
            }
        }
    }

    renderSwapTiles(tile1, tile2) {
        this.getTileView(tile1.x, tile1.y).renderSwap(tile2.x, tile2.y)
        this.getTileView(tile2.x, tile2.y).renderSwap(tile1.x, tile1.y)
        return 1000;
    }

    renderComboTiles(tilesComboSet) {
        this.parseByChunk(Array.from(tilesComboSet)).forEach(chunk => {
            chunk.tiles.forEach(tile => {
                this.getTileView(tile.x, tile.y).renderCombo(chunk.center)
            })
        })

        return 750;
    }

    parseByChunk(tilesCombo) {
        const chunks = [];
        while (tilesCombo.length > 0) {
            let i = 1;
            const tileStart = tilesCombo[0];
            const tempChunk = [tileStart];
            const indexToRemove = [0];
            while (i < tilesCombo.length) {
                if (this.isAdjacentToChunk(tempChunk, tilesCombo[i]) && tileStart.isSameType(tilesCombo[i])) {
                    tempChunk.push(tilesCombo[i]);
                    indexToRemove.push(i);
                }
                i++;
            }
            chunks.push(this.createChunk(tempChunk));
            indexToRemove.reverse()
            for (let index of indexToRemove) {
                tilesCombo.splice(index, 1);
            }
        }
        return chunks
    }

    createChunk(arrayChunk) {
        let center = {tile: null, score: 0};
        for (let tile of arrayChunk) {
            let tileScore = tile.scoreAdjacentSameTypeTiles();
            if (center.score < tileScore)
                center = {tile: tile, score: tileScore};
        }
        return {center: center.tile, tiles: arrayChunk};
    }

    isAdjacentToChunk(chunk, tile) {
        for (let tileChunk of chunk) {
            if (tileChunk.isAdjacent(tile))
                return true;
        }
        return false;
    }

    renderFallingTiles(fallingTiles) {
        for (let tileView of this.tilesView) {
            const fallingTilesIndex = fallingTiles.findIndex(tile => tile.x === tileView.x && tile.y === tileView.y)
            let fallData = false;
            if (fallingTilesIndex >= 0) {
                fallData = fallingTiles[fallingTilesIndex].fallData;
                fallingTiles.splice(fallingTilesIndex, 1)
            }
            tileView.renderFall(fallData)
        }

        return 1000;
    }

    renderRefillTiles(tilesChanged) {
        for (let tile of tilesChanged) {
            this.getTileView(tile.x, tile.y).renderRefill()
        }
        return 1000;
    }

}