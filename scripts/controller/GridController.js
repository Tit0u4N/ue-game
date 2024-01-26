import _ from "../lib/lodash.js";

export class GridController {
    constructor(model, ATHController) {
        this.model = model;
        this.ATHController = ATHController;
        this.view = null;
        this.selectedTile = null;

        this.canSelect = true;
        this.started = false;
    }

    setView(view) {
        this.view = view;
    }

    init() {
        if (!this.view) throw new Error("GridView is not defined");
        let tilesCombo = this.checkCombo();
        while (tilesCombo.size > 0) {
            this.model.deleteTiles(tilesCombo).fallTiles();
            this.model.refill();
            tilesCombo = this.checkCombo();
        }
        this.view.render();
    }

    async waitView(ms) {
        return await new Promise(resolve => setTimeout(resolve, ms + 50));
    }

    async doRound() {
        this.canSelect = false;
        let tilesCombo = this.checkCombo();
        while (tilesCombo.size > 0) {
            await this.waitView(this.view.renderComboTiles(tilesCombo));
            this.ATHController.addScore(tilesCombo.size);
            // console.table(this.model.tiles.map(row => row.map(tile => tile ? tile.type.name : null)));

            await this.waitView(this.view.renderFallingTiles(this.model.deleteTiles(tilesCombo).fallTiles()));

            const temp = this.model.refill();
            await this.waitView(this.view.renderRefillTiles(temp));
            tilesCombo = this.checkCombo();
        }
        this.canSelect = true;
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
                await this.swapTiles(tileModel, this.selectedTile.tileModel);
                await this.doRound([tileModel, this.selectedTile.tileModel]);
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

    checkCombo() {
        const tilesToCheck = _.slice(this.model.tiles, this.model.height / 2, this.model.height);
        return new Set([...this.checkRows(tilesToCheck), ...this.checkColumns(tilesToCheck)]);
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

}