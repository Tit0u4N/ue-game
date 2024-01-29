export class ATHModel {
    constructor(nbSwap = 0, time = 0, score = 0) {
        this.nbSwap = nbSwap;
        this.time = time;
        this.score = score;
    }

    setGameParams(nbSwap = 0, time = 0, score = 0) {
        this.nbSwap = nbSwap;
        this.time = time;
        this.score = score;
    }

    getNbSwap() {
        return this.nbSwap;
    }

    getTime() {
        return this.time;
    }

    getScore() {
        return this.score;
    }

}