import {GridView} from "./GridView";
import {ATHView} from "./ATHView";

export class MainView {
    constructor(parentDOMView, mainController, mainModel) {
        this.mainController = mainController;
        this.mainModel = mainModel;
        this.controlPanel = parentDOMView.querySelector('#control-panel')
        this.gridViews = new GridView(parentDOMView, this.mainModel.getGridModel(), this.mainController.getGridController());
        this.ATHView = new ATHView(parentDOMView, this.mainModel.getATHModel(), this.mainController.getATHController());

        this.initGameModePanel()
        this.initGridSizePanel()
        this.initStartButton()
    }

    getGridView() {
        return this.gridViews;
    }

    getATHView() {
        return this.ATHView;
    }

    initGameModePanel() {
        const nodes = this.controlPanel.querySelectorAll(".control-gamemode")
        const desc = this.controlPanel.querySelector("#gamemode-desc")

        const resetSelected = () => {
            nodes.forEach((element) => {
                element.classList.remove('selected')
            })
        }

        const selectMode = (elem) => {
            resetSelected()
            elem.classList.add('selected')
            desc.innerHTML = elem.getAttribute('data-desc')
        }

        nodes.forEach((element) => {
            element.addEventListener('click', (e) => {
                this.mainController.setGameMode(element.getAttribute('data-gamemode'))
                selectMode(element)
            })
        })
    }

    initGridSizePanel() {
        const nodes = this.controlPanel.querySelectorAll(".grid-size")

        const nodeNbRows = this.controlPanel.querySelector("#nb-rows")
        const nodeNbColumns = this.controlPanel.querySelector("#nb-columns")

        nodes.forEach((element) => {
            element.addEventListener('click', (e) => {
                const action = element.getAttribute("data-grid-size")
                if (action === "row-") {
                    nodeNbRows.innerHTML = this.mainController.addNbRows(-1)
                } else if (action === "row+") {
                    nodeNbRows.innerHTML = this.mainController.addNbRows(1)
                } else if (action === "col-") {
                    nodeNbColumns.innerHTML = this.mainController.addNbColumns(-1)
                } else if (action === "col+") {
                    nodeNbColumns.innerHTML = this.mainController.addNbColumns(1)
                }

            })
        })
    }

    initStartButton() {
        const startButton = this.controlPanel.querySelector("#start-game")
        startButton.addEventListener('click', (e) => {
            this.mainController.init()
            this.toggleHideControlPanel(true)
        })
    }

    toggleHideControlPanel(hide) {
        if (hide) {
            this.controlPanel.parentNode.classList.add("hide")
        } else {
            this.controlPanel.parentNode.classList.remove("hide")
        }
    }

}