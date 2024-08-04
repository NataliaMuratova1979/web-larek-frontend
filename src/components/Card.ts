import { ensureElement, cloneTemplate } from "../utils/utils";
//import { Component } from "./base/Component";
import { Component } from "./Component";

import { IEvents } from "./base/events";
import { IProductsData, IProduct } from "../types";



export class Card extends Component<IProduct> {
    
    protected events: IEvents;

    //protected _button?: HTMLButtonElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _title: HTMLElement;
    protected _description?: HTMLElement;
    protected _price: HTMLElement;
    protected _id: string;
    protected _ordered: boolean;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
 
        this.events = events;
       // this.container = cloneTemplate(template);
    
        //this._button = ensureElement('.DELETE', this.container) as HTMLButtonElement;
        this._image = this.container.querySelector('.card__image');
        this._category = this.container.querySelector('.card__category');
        this._title = this.container.querySelector('.card__title');
        this._description = this.container.querySelector('.card__text');
        this._price = this.container.querySelector('.card__price');

    
        //this._button.addEventListener('click', () => this.events.emit('card:delete', { card: this }))
        this.container.addEventListener('click', () => this.events.emit('card:select', { card: this }))

    }



    render(productData: Partial<IProduct> | undefined ) { 
        
        const { ...allProductData} = productData;
        Object.assign(this, allProductData); 
        return this.container;
    }

    set id (id) {
        this._id = id;
    }
 
    get id() { // выводим id товара
       return this._id;
    }    

    set title (title: string) {
        this._title.textContent = title;
    }  

    set image(image: string) {
        this._image.src = `url(${image})`;
    }
       
    //set description(description: string) {
        //this._description.textContent = description;
    //} 
   
    set price(price: number | null) {
      price ? this._price.textContent = price.toString() + ' синапсов' : this._price.textContent = 'Бесценно';
    }   

    set category(category: string) {
        this._category.textContent = category;
    } 

    set ordered (ordered: boolean) {
        this._ordered = ordered;
    }
     
/*
    isOrdered() {
        // return если уже в корзине
        
    }

    isBlocked() {
        // неактивна кнопка купить, если нет цены
    }
*/


    deleteCard() {
        this.container.remove();
       // this.element = null;
    }

     
}
// непонятно, что делать с кнопкой
// непонятно, что делать с картинкой
