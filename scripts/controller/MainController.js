import {GridController} from "./GridController";
import {ATHController} from "./ATHController";

export class MainController {

    constructor(MainModel) {
        this.MainModel = MainModel;
        this.MainView = null;
        this.ATHController = new ATHController(MainModel.getATHModel());
        this.gridController = new GridController(MainModel.getGridModel(), this.ATHController);
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
        this.gridController.init();
        this.ATHController.init();
    }
}