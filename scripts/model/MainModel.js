import {GridModel} from "./GridModel";
import {ATHModel} from "./ATHModel";

export class MainModel {
    constructor() {
        this.gridModel = new GridModel();
        this.ATHModel = new ATHModel();
    }

    setGameParams(gridWidth, gridHeight, score = 0, nbSwap = 0, time = 0) {
        this.gridModel.setGameParams(gridWidth, gridHeight);
        this.ATHModel.setGameParams(nbSwap, time, score);
        return this;
    }

    init() {
        this.gridModel.init();
    }

    getGridModel() {
        return this.gridModel;
    }

    getATHModel() {
        return this.ATHModel;
    }
}