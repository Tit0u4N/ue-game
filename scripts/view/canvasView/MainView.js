import {GridView} from "./GridView";
import {ATHView} from "./ATHView";

export class MainView {
    constructor(parentDOMView, mainController, mainModel) {
        this.mainController = mainController;
        this.mainModel = mainModel;

        this.gridViews = new GridView(parentDOMView.querySelector('canvas'), this.mainModel.getGridModel(), this.mainController.getGridController());
        this.ATHView = new ATHView(parentDOMView, this.mainModel.getATHModel(), this.mainController.getATHController());
    }

    getGridView() {
        return this.gridViews;
    }

    getATHView() {
        return this.ATHView;
    }
}