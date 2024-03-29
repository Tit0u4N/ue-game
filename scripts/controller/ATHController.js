export class ATHController {

    constructor(ATHModel) {
        this.ATHModel = ATHModel;
        this.ATHView = null;
    }

    setView(ATHView) {
        this.ATHView = ATHView;
    }

    setGameMode(mode) {
        if (mode === "infinity") {
            this.mode = "infinity";
        } else if (mode === "classic") {
            this.mode = "classic";
        }
        return this;
    }

    addScore(chunks, round = 1) {
        let score = 0;
        chunks.forEach(chunk => {
            if (chunk.tiles.length <= 3) {
                score += chunk.tiles.length * 10;
            } else if (chunk.tiles.length <= 4) {
                score += chunk.tiles.length * 15;
            } else if (chunk.tiles.length <= 5) {
                score += chunk.tiles.length * 20;
            } else {
                score += chunk.tiles.length * 25;
            }
        });
        this.ATHModel.score += score * round;
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

    stopTimer() {
        clearInterval(this.timer);
    }
}