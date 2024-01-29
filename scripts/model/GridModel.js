import {TileModel} from "./TileModel";

export class GridModel {

    constructor(width = 5, height = 5) {
        this.setGameParams(width, height);
    }

    setGameParams(width, height) {
        this.width = width;
        this.height = height * 2 || width * 2;
    }

    init() {
        this.tiles = [];
        for (let x = 0; x < this.height; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.width; y++) {
                this.tiles[x][y] = TileModel.createRandomTile(x, y, this);
            }
        }
    }

    swapTiles(tile1, tile2) {
        const tempX = tile1.x;
        const tempY = tile1.y;
        tile1.x = tile2.x;
        tile1.y = tile2.y;
        this.tiles[tempX][tempY] = tile2;
        this.tiles[tile2.x][tile2.y] = tile1;
        tile2.x = tempX;
        tile2.y = tempY;
    }

    refill() {
        const tilesChanged = []
        for (let x = 0; x < this.height; x++) {
            for (let y = this.width - 1; y >= 0; y--) {
                if (this.tiles[x][y] == null) {
                    this.tiles[x][y] = TileModel.createRandomTile(x, y, this);
                    tilesChanged.push(this.tiles[x][y]);
                }
            }
        }
        return tilesChanged;
    }

    deleteTiles(tilesChanged) {
        for (let tile of tilesChanged) {
            this.tiles[tile.x][tile.y] = null;
        }
        return this;
    }

    fallTiles() {
        const tilesChanged = new Set();
        for (let y = 0; y < this.width; y++) {
            for (let x = this.height - 1; x >= 0; x--) {
                if (this.tiles[x][y]) {
                    const tile = this.tiles[x][y];
                    const fall = tile.fall();
                    if (fall)
                        tilesChanged.add({x, y, fallData: fall});
                }
            }
        }

        return Array.from(tilesChanged) ;
    }

}