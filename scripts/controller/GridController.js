import _ from "lodash";
export class GridController {
    constructor(model, ATHController) {
        this.model = model;
        this.ATHController = ATHController;
        this.view = null;
        this.selectedTile = null;

        this.canSelect = true;
        this.started = false;
        this.mode = "speed"
    }

    setView(view) {
        this.view = view;
    }

    setGameMode(rules) {
        if (rules === "infinity") this.mode = "infinity";
        else if (rules === "classic") this.mode = "classic";
        return this;
    }

    init() {
        if (!this.view) throw new Error("GridView is not defined");
        let combo = this.checkCombo();
        while (combo.exist) {
            this.model.deleteTiles(combo.tiles).fallTiles();
            this.model.refill();
            combo = this.checkCombo();
        }
        this.view.render();
    }

    async waitView(ms) {
        return await new Promise(resolve => setTimeout(resolve, ms + 50));
    }

    /**
     * Effectue un tour de jeu
     * @returns true si un combo a été effectué
     */
    async doRound() {
        this.canSelect = false;
        let combo = this.checkCombo(true);
        let cpt = 1;
        while (combo.exist && cpt < 1000) {
            await this.waitView(this.view.renderComboTiles(combo.chunks));
            this.ATHController.addScore(combo.chunks, cpt);
            await this.waitView(this.view.renderFallingTiles(this.model.deleteTiles(combo.tiles).fallTiles()));
            const temp = this.model.refill();
            await this.waitView(this.view.renderRefillTiles(temp));
            combo = this.checkCombo(true);
            cpt++;
        }
        this.canSelect = true;
        return cpt >= 2;
    }

    async selectTile(tileView) {
        if (!this.started) {
            this.started = true;
            this.ATHController.startTimer();
        }
        if (!this.canSelect) return;
        const tileModel = tileView.tileModel;
        if (this.selectedTile) {
            // Test if the selected tile is adjacent to the clicked tile or same tile
            if (tileView === this.selectedTile || !tileModel.isAdjacent(this.selectedTile.tileModel)) {
                this.selectedTile.toggleSelect(false);
                this.selectedTile = null;
            } else {
                // Swap the tiles
                this.ATHController.addSwap();
                this.selectedTile.toggleSelect(false);
                tileView.toggleSelect(false);
                const tempTile = {x: tileModel.x, y: tileModel.y};
                await this.swapTiles(tileModel, this.selectedTile.tileModel);
                const swapped = await this.doRound([tileModel, this.selectedTile.tileModel]);
                if (!swapped && this.mode !== "infinity") {
                    await this.swapTiles(this.selectedTile.tileModel, this.model.tiles[tempTile.x][tempTile.y]);
                }
                this.selectedTile = null;
            }
        } else {
            this.selectedTile = tileView;
            tileView.toggleSelect(true);
        }
    }

    async swapTiles(tile1, tile2) {
        this.model.swapTiles(tile1, tile2);
        await this.waitView(this.view.renderSwapTiles(tile1, tile2));
    }

    checkCombo(parseByChunk = false) {
        const tilesToCheck = _.slice(this.model.tiles, this.model.height / 2, this.model.height);
        const tilesCombo = new Set([...this.checkRows(tilesToCheck), ...this.checkColumns(tilesToCheck)]);
        if (!parseByChunk) return { exist: tilesCombo.size > 0, tiles: [...tilesCombo]};
        return { chunks: this.parseByChunk([...tilesCombo]), tiles: [...tilesCombo] , exist: tilesCombo.size > 0};
    }


    checkRows(tilesToCheck) {
        return _.flatMap(tilesToCheck, (row) => {
            return this.checkSequence(row);
        });
    }

    checkColumns(tilesToCheck) {
        return _.flatMap(_.zip.apply(_, tilesToCheck), (column) => {
            return this.checkSequence(column);
        });
    }

    checkSequence(sequence) {
        const tilesChanged = [];
        let i = 0;
        while (i < sequence.length - 2) {
            const tile1 = sequence[i];
            if (!tile1) {
                i++;
                continue;
            }
            const tile2 = sequence[i + 1];
            const tile3 = sequence[i + 2];
            if (tile1.isSameType(tile2) && tile1.isSameType(tile3)) {
                tilesChanged.push(tile1, tile2, tile3);
                i += 2;
                while (i < sequence.length - 1 && tile1.isSameType(sequence[i + 1])) {
                    tilesChanged.push(sequence[i + 1]);
                    i++;
                }
            } else {
                i++;
            }
        }
        return tilesChanged;
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

    stop() {
        this.canSelect = false;
    }
}