import {MainModel} from "./model/MainModel";
import {MainController} from "./controller/MainController";
import {MainView} from "./view/MainView";

const gamesParams = {
    nbRows : 5,
    nbColumns : 5,
    mode : "speed",
}


const ModelDOM = new MainModel();
const ControllerDOM = new MainController(ModelDOM);
const ViewDOM = new MainView(document.getElementById("gameContainer"), ControllerDOM, ModelDOM);

ControllerDOM.setView(ViewDOM)
