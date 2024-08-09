import { Component } from "./base/Component";
import { createElement } from "./../utils/utils";

import { IEvents } from "./base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    //selected: string[];
}

export class Basket extends Component<IBasketView> {

    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.events = events;

        this._list = this.container.querySelector('.basket__list');
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('orderForm:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }
   
    set total(total: number) {
        this._total.textContent = total.toString() + ' синапсов';
    }
}