import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IBasketCounter {
    counter: number;
}

//"header__container"

export class BasketCounter extends Component<IBasketCounter>{
    protected _counter: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        
        this._counter = this.container.querySelector('.header__basket-counter');

        this.container.addEventListener('click', () => this.events.emit('basket:open', { basket: this}))
    }

    set counter(quantity: number) {
        this._counter.textContent = quantity.toString();
    }
}
