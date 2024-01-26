import {MainModel} from "./model/MainModel";
import {MainController} from "./controller/MainController";
import {MainView} from "./view/MainView";

import * as CanvasView from "./view/canvasView/MainView";


const ModelDOM = new MainModel(5);
const ControllerDOM = new MainController(ModelDOM);
const ViewDOM = new MainView(document.getElementById("gameContainer"), ControllerDOM, ModelDOM);

ControllerDOM.setView(ViewDOM).init();

const ModelCanvas = new MainModel(5);
const ControllerCanvas = new MainController(ModelCanvas);
const ViewCanvas = new CanvasView.MainView(document.getElementById("gameContainerCanvas"), ControllerCanvas, ModelCanvas);

ControllerCanvas.setView(ViewCanvas).init();
