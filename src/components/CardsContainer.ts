import { Component } from "./base/Component";
import { IEvents } from "./base/events";


interface ICardsContainer {
    catalog: HTMLElement[];
}

export class CardsContainer extends Component<ICardsContainer>{
    protected _catalog: HTMLElement;
    protected _totalPrice?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        this.events = events;

        this._button = this.container.querySelector('.button');
        this._totalPrice = this.container.querySelector('.basket__price');

        if (this._button) {
            this._button.addEventListener('click', () => this.events.emit ('basket:order'))
        }
    }

    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren( ...items);
    }

    set totalPrice(price: number) { //totalPrice вычисляется в BasketData, сумма прайсов всех product
        if (this.totalPrice) {
        this._totalPrice.textContent = price.toString() + ' синапсов';
      }
    }
        
}

