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

    protected _ordered: boolean; // это поле для проверки, является ли товар уже заказанным 



    protected _deleteButton?: HTMLButtonElement;
    protected _basketButton?: HTMLButtonElement;
    protected _product: IProduct;
    protected _index: HTMLElement;  

     // Новое поле для управления состоянием кнопки 
    protected _isBasketButtonDisabled: boolean = false;

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
        this._index = this.container.querySelector('.basket__item-index');


        if (this._basketButton) {
            this._basketButton.addEventListener('click', () => this.events.emit('product:add', { card: this })); 
            // При срабатывании этого события объект товара попадает в массив товаров заказа orderData.addProduct
        }

        if (this._deleteButton) {
            this._deleteButton.addEventListener('click', () => this.events.emit('product:delete', { card: this }));
            // При срабатывании этого события объект товара удаляется из массива товаров заказа orderData.deleteProduct
            
        }                 

        this.container.addEventListener('click', () => this.events.emit('card:open', { card: this }));
    }

    render(productData: Partial<IProduct> | undefined ) { 

        const { ...allProductData} = productData;
        Object.assign(this, allProductData); 
        return this.container;
    }    
    
    set index(index: number) {
        if (this._index) {
        this._index.textContent = index.toString();
    }
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
        if (this.image) {
        this._image.src = `url(${image})`;
    }
    }
       

    set description(description: string) {
        if (this._description) {
        this._description.textContent = description;
    }
    }  


    set category(category: string) {
        if (this._category) {
        this._category.textContent = category;
    }
    } 

    set price(price: number | null) {
        if (price !== null) {
            this._price.textContent = price.toString() + ' синапсов';
            this._isBasketButtonDisabled = false; // Кнопка активна
        } else {
            this._price.textContent = 'Бесценно';
            this._isBasketButtonDisabled = true; // Кнопка неактивна
        }
        
        // Обновляем состояние кнопки
        if (this._basketButton) {
            this._basketButton.disabled = this._isBasketButtonDisabled; // Устанавливаем состояние кнопки
            this._basketButton.textContent = this._isBasketButtonDisabled ? 'Не продается' : 'В корзину'; // Устанавливаем текст кнопки
        }
    }   


    deleteCard() {
        this.container.remove();
        // this.events.emit('basketProduct:delete', )
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