import { Component } from "./base/Component";
import { createElement } from "./../utils/utils";
import { cloneTemplate, ensureElement } from '../utils/utils';


import { IEvents } from "./base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {

    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;
    protected _orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.events = events;

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = ensureElement<HTMLElement>('.basket__price', this.container);
        this._orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        if (this._orderButton) {
            this._orderButton.addEventListener('click', () => {
                events.emit('formPayment:open'); //?
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._orderButton.disabled = false; // Активируем кнопку, если есть элементы
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this._orderButton.disabled = true; // Деактивируем кнопку, если корзина пуста
        }
    }
   
    set total(total: number) {
        this.setText(this._total, total.toString() + ' синапсов');
    }
}

