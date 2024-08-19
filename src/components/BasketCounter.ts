import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { cloneTemplate, ensureElement } from '../utils/utils';


interface IBasketCounter {
    counter: number;
}

export class BasketCounter extends Component<IBasketCounter>{
    protected _counter: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', this.container);

        this.container.addEventListener('click', () => this.events.emit('basket:open', { basket: this}))
    }

    set counter(quantity: number) {
        this.setText(this._counter, quantity.toString());
    }
}



