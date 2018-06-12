export class Store {
    constructor(dispatcher) {
        this.__listeners = [];
        this.__state = this.getInitialState();
        dispatcher.register(this.__onDispatch.bind(this));
    }
    __onDispatch() {
        throw new Error("Abstract method must be explicitly overridden");
    }
    getInitialState() {
        throw new Error("Abstract method must be explicitly overridden");
    }
    addListener(listener) {
        this.__listeners.push(listener);
    }
    __emitChange() {
        this.__listeners.forEach(listener => listener(this.__state));
    }
}