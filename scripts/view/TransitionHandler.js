export class TransitionHandler {
    constructor(DOMElem, transition, duration = null, timingFunction = null) {
        this.DOMElem = DOMElem;
        this.transition = transition;
        this.duration = duration;
        this.timingFunction = timingFunction;
        this.baseKey = "--transition-" + this.transition;
        this.addTransitionToElem();
    }

    static create(DOMElem, transition, duration = null, timingFunction = null) {
        return new TransitionHandler(DOMElem, transition, duration, timingFunction);
    }

    addTransitionToElem() {
        this.DOMElem.classList.add("transition--" + this.transition);
        this.setProperty("duration", this.duration + "ms");
        this.setProperty("timing-function", this.timingFunction);
    }

    removeTransition() {
        this.DOMElem.classList.remove("transition--" + this.transition);
        this.resetProperty("duration");
        this.resetProperty("timing-function");
    }

    setProperty(property, value) {
        if (property && value)
            this.DOMElem.style.setProperty(this.baseKey + "-" + property, value);
    }

    resetProperty(property) {
        this.DOMElem.style.setProperty(this.baseKey + "-" + property, null);
    }

}