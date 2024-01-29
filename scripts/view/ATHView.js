export class ATHView {
    constructor(parentDOMView, ATHModel) {
        this.ATHModel = ATHModel;

        this.parentDOMView = parentDOMView;
        this.ATHDOM = this.parentDOMView.querySelector(".ath--container");
        this.scoreDOM = this.ATHDOM.querySelector(".ath--score .value");
        this.timeDOM = this.ATHDOM.querySelector(".ath--timer .value");
        this.nbSwapDOM = this.ATHDOM.querySelector(".ath--nb-swap .value");
    }

    toggleHide(hide) {
        if (hide) {
            this.ATHDOM.classList.add("hide");
        } else {
            this.ATHDOM.classList.remove("hide");
        }
    }

    render() {
        this.toggleHide(false)
        this.parentDOMView.insertBefore(this.ATHDOM, this.parentDOMView.firstChild);
        this.updateScore().updateTime().updateNbSwap();
    }

    updateScore() {
        this.scoreDOM.innerHTML = this.ATHModel.getScore();
        return this;
    }

    updateTime() {
        // affichage du temps minute:seconde:centième
        let time = this.ATHModel.getTime();
        let seconde = Math.floor(time / 10);
        let centieme = time - seconde * 10;
        this.timeDOM.innerHTML = `${seconde},${centieme}s`;
        return this;
    }

    updateNbSwap() {
        this.nbSwapDOM.innerHTML = this.ATHModel.getNbSwap();
        return this;
    }

}