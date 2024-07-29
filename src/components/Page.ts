import { ensureElement } from "../utils/utils"; // = querySelector
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export interface IPage {
    catalog: HTMLElement[]; // DOM-элемент, где размещен список товаров 
    counter: number; // количество товаров в корзине
}

export class Page extends Component<IPage> implements IPage{
    protected _catalog: HTMLElement;
    protected _counter: HTMLElement;
    protected _basket: HTMLElement


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._catalog = ensureElement('.gallery', this.container);
        this._counter = ensureElement('.header__basket-counter', this.container);
        this._basket = ensureElement('.header__basket', this.container);

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:select');
        });
    }

    set catalog(items: HTMLElement[]) { //это контейнер, в котором будут размещены карточки
        this._catalog.replaceChildren(...items);
    }
    
    set counter(value: number) {
        this.setText(this._counter, Number(value));
     }   
}