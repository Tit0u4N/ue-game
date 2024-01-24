export const TYPES = [
    {id: 0, name: "Croissant"},
    {id: 1, name: "Cupcake"},
    {id: 2, name: "Donut"},
    {id: 3, name: "Danish"},
    {id: 4, name: "Macaroon"},
    {id: 5, name: "SugarCookie"},
]

export class TileModel {

    constructor(x, y, type, gridModel) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.gridModel = gridModel;
    }

    isAdjacent(tile) {
        return Math.abs(this.x - tile.x) + Math.abs(this.y - tile.y) === 1;
    }

    scoreAdjacentSameTypeTiles() {
        let adjacentTiles = new Set();
        if (this.x > 0 && this.isSameType(this.gridModel.tiles[this.x - 1][this.y]))
            adjacentTiles.add("LEFT");
        if (this.x < this.gridModel.height - 1 && this.isSameType(this.gridModel.tiles[this.x + 1][this.y]))
            adjacentTiles.add("RIGHT");
        if (this.y > 0 && this.isSameType(this.gridModel.tiles[this.x][this.y - 1]))
            adjacentTiles.add("TOP");
        if (this.y < this.gridModel.width - 1 && this.isSameType(this.gridModel.tiles[this.x][this.y + 1]))
            adjacentTiles.add("BOTTOM");

        let cpt = adjacentTiles.size;
        if (cpt < 2) return cpt;
        if (   (adjacentTiles.has("TOP") && adjacentTiles.has("RIGHT"))
            || (adjacentTiles.has("RIGHT") && adjacentTiles.has("BOTTOM"))
            || (adjacentTiles.has("BOTTOM") && adjacentTiles.has("LEFT"))
            || (adjacentTiles.has("LEFT") && adjacentTiles.has("TOP"))
        ) return cpt + 1;
        return cpt;
    }

    isSameType(tile) {
        if (tile == null)
            return false;
        return this.type.id === tile.type.id;
    }

    fall() {
        const beforeFallX = this.x;
        let cptX = this.x;
        while (cptX < this.gridModel.height - 1 && this.gridModel.tiles[cptX + 1][this.y] == null) {
            cptX++;
        }

        if (cptX !== this.x) {
            this.gridModel.tiles[this.x][this.y] = null;
            this.gridModel.tiles[cptX][this.y] = this;
            this.x = cptX;
            return {beforeFallX: beforeFallX, actualX: cptX};
        }

        return false;
    }

    static createRandomTile(x, y, gridModel) {
        const type = TYPES[Math.floor(Math.random() * TYPES.length)];
        return new TileModel(x, y, type, gridModel);
    }
}