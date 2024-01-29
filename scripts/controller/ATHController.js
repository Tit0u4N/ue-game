export class ATHController {

    constructor(ATHModel) {
        this.ATHModel = ATHModel;
        this.ATHView = null;
    }

    setView(ATHView) {
        this.ATHView = ATHView;
    }

    setGameMode(mode) {
        if (mode === "speed") {
            this.mode = "speed";
        } else if (mode === "classic") {
            this.mode = "classic";
        }
        return this;
    }

    addScore(nbCombo) {
        this.ATHModel.score += nbCombo * 10;
        this.ATHView.updateScore();
    }

    addSwap() {
        this.ATHModel.nbSwap++;
        this.ATHView.updateNbSwap();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.ATHModel.time++;
            this.ATHView.updateTime();
        }, 100);
    }

    init() {
        if (!this.ATHView) throw new Error("ATHView is not defined");
        this.ATHView.render();
    }
}