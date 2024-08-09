import { Component } from "./base/Component";
import { IEvents } from "./base/events";


interface ICardsContainer {
    catalog: HTMLElement[];
    totalBasket: HTMLElement;
}

export class CardsContainer extends Component<ICardsContainer>{
    protected _catalog: HTMLElement;
    protected _totalBasket?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        this.events = events;

        this._button = this.container.querySelector('.button');
        this._totalBasket = this.container.querySelector('.basket__price');

        if (this._button) {
            this._button.addEventListener('click', () => this.events.emit ('basket:order'))
        }
    }

    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren( ...items);
    }

    /*
    set totalBasket(totalPrice: number) { //totalPrice вычисляется в BasketData, сумма прайсов всех product
        if (this.totalBasket) {
        this._totalBasket.textContent = totalPrice.toString() + ' синапсов';
      }
    }
      */
        
}

