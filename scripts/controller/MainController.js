import {GridController} from "./GridController";
import {ATHController} from "./ATHController";

export class MainController {

    constructor(MainModel) {
        this.MainModel = MainModel;
        this.MainView = null;
        this.ATHController = new ATHController(MainModel.getATHModel());
        this.gridController = new GridController(MainModel.getGridModel(), this.ATHController);

        this.gameParams = {
            nbRows : 4,
            nbColumns : 4,
            mode : "speed",
        }
    }

    setView(MainView) {
        this.MainView = MainView;
        this.gridController.setView(MainView.getGridView());
        this.ATHController.setView(MainView.getATHView());
        return this;
    }

    getGridController() {
        return this.gridController;
    }

    getATHController() {
        return this.ATHController;
    }

    init() {
        this.MainModel.setGameParams(this.gameParams.nbColumns, this.gameParams.nbRows).init();
        this.gridController.setGameMode(this.gameParams.mode).init();
        this.ATHController.setGameMode(this.gameParams.mode).init();
    }

    setGameMode(mode) {
        this.gameParams.mode = mode;
    }

    addNbRows(nbRows) {
        const nbRowsCalc = this.gameParams.nbRows + nbRows;
        if (nbRowsCalc < 4) {
            this.gameParams.nbRows = 4;
        } else if (nbRowsCalc > 10) {
            this.gameParams.nbRows = 10;
        } else {
            this.gameParams.nbRows = nbRowsCalc;
        }
        return this.gameParams.nbRows;
    }

    addNbColumns(nbColumns) {
        const nbColumnsCalc = this.gameParams.nbColumns + nbColumns;
        if (nbColumnsCalc < 4) {
            this.gameParams.nbColumns = 4;
        } else if (nbColumnsCalc > 10) {
            this.gameParams.nbColumns = 10;
        } else {
            this.gameParams.nbColumns = nbColumnsCalc;
        }
        return this.gameParams.nbColumns;
    }
}