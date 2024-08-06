import { ensureElement, cloneTemplate } from "../utils/utils";
import { Component } from "./base/Component";
//import { Component } from "./Component";

import { IEvents } from "./base/events";
import { IProductsData, IProduct } from "../types";



export class Card extends Component<IProduct> {
    
    protected events: IEvents;

    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _title: HTMLElement;
    protected _description?: HTMLElement;
    protected _price: HTMLElement;
    protected _id: string;
    protected _deleteButton?: HTMLButtonElement;
    protected _basketButton?: HTMLButtonElement;
    protected _product: IProduct;


    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
 
        this.events = events;
    
        this._deleteButton = this.container.querySelector('.basket__item-delete');
        this._basketButton = this.container.querySelector('.card__button');

        this._image = this.container.querySelector('.card__image');
        this._category = this.container.querySelector('.card__category');
        this._title = this.container.querySelector('.card__title');
        this._description = this.container.querySelector('.card__text');
        this._price = this.container.querySelector('.card__price');

        if (this._basketButton) {
            this._basketButton.addEventListener('click', () => this.events.emit('product:add', { card: this }));
        }

        if (this._deleteButton) {
            this._deleteButton.addEventListener('click', () => this.events.emit('product:delete', { card: this }));
        }                 

        this.container.addEventListener('click', () => this.events.emit('card:open', { card: this }))
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

/*
    set description(description: string) {
       if (this._description === null) {
       console.log('Здесь нет описания ')
    } else {
       this._description.textContent = description;
    }
    }
*/

    set description(description: string) {
        if (this._description) {
        this._description.textContent = description;
    }
    }

  
    set price(price: number | null) {
      price ? this._price.textContent = price.toString() + ' синапсов' : this._price.textContent = 'Бесценно';
    }   

    set category(category: string) {
        this._category.textContent = category;
    }     


    deleteCard() {
        this.container.remove();
       // this.element = null;
    }
     
}













// непонятно, что делать с кнопкой
// непонятно, что делать с картинкой

/*
set ordered (ordered: boolean) {
    this._ordered = ordered;
}

get ordered() {
    return this._ordered;
}

set blocked (blocked: boolean) {
    if (this._price.textContent = 'Бесценно') {
        this.blocked = true;
    }
}

get blocked() {
    return this.blocked;
}
    */



/*
    isOrdered() {
        // return если уже в корзине
        
    }

    isBlocked() {
        // неактивна кнопка купить, если нет цены
    }
*/