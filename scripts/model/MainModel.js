import {GridModel} from "./GridModel";
import {ATHModel} from "./ATHModel";

export class MainModel {
    constructor(gridWidth, gridHeight = null, nbType = 0, nbSwap = 0, time = 0) {
        this.gridModel = new GridModel(gridWidth, gridHeight, nbType);
        this.ATHModel = new ATHModel(nbSwap, time);
    }

    getGridModel() {
        return this.gridModel;
    }

    getATHModel() {
        return this.ATHModel;
    }
}