import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { IProductsData } from "../types";


export class Card extends Component<IProductsData> {
    
    protected _button?: HTMLButtonElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _title: HTMLElement;
    protected _description?: HTMLElement;
    protected _price: HTMLElement;
    protected _id: string;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
    
        //this.cardItem = ensureElement('.card', this.container);
        this._button = ensureElement('.gallery__item', this.container) as HTMLButtonElement;
        this._image = ensureElement('.card__image', this.container) as HTMLImageElement;
        this._category = ensureElement('.card__category', this.container);
        this._title = ensureElement('.card__title', this.container);
        this._description = ensureElement('.card__text', this.container);
        this._price = ensureElement('.card__price', this.container);
    
        this._button.addEventListener('click', () => this.events.emit('product:select', {id: this._id}))
    }

    set id(value: string) {
        this._id = value;
    }  

    get id() { // выводим id товара
        return this.id;
    }    
    
    set category(value: string) {
        this.setText(this._category, value);
    }  

    set title(value: string) {
        this.setText(this._title, value);
    }  

    set description(value: string) {
       this.setText(this._description, value);
    } 

    set price(value: number) {
        this.setText(this._price, value);
    }   

    set image(value:string) {
        this.setImage(this._image, value);
    }
     
}
// непонятно, что делать с кнопкой
// непонятно, что делать с картинкой