
import { ensureElement, cloneTemplate } from "../utils/utils";
import { Component } from "./base/Component";
//import { Component } from "./Component";

import { IEvents } from "./base/events";
import { IProductsData, IProduct } from "../types";
import { CDN_URL } from "../utils/constants";



export class Card extends Component<IProduct> {
    
    protected events: IEvents;

    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _title: HTMLElement;
    protected _description?: HTMLElement;
    protected _price: HTMLElement;
    protected _id: string;

    protected _ordered: boolean = false; // это поле для проверки, является ли товар уже заказанным

    protected _deleteButton?: HTMLButtonElement;
    protected _basketButton?: HTMLButtonElement;
    protected _product: IProduct;
    protected _index: HTMLElement;  

    // Добавьте новое свойство для хранения значения цены
    protected _priceValue: number | null = null;

     // Новое поле для управления состоянием кнопки 
    protected _isBasketButtonDisabled: boolean = false;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
 
        this.events = events;
    
        this._deleteButton = this.container.querySelector('.basket__item-delete');
        this._basketButton = this.container.querySelector('.button.card__button');

        this._image = this.container.querySelector('.card__image');
        this._category = this.container.querySelector('.card__category');
        this._title = this.container.querySelector('.card__title');
        this._description = this.container.querySelector('.card__text');
        this._price = this.container.querySelector('.card__price');
        this._index = this.container.querySelector('.basket__item-index');


        if (this._basketButton) {
            this._basketButton.addEventListener('click', (event) => {
                event.stopPropagation(); // Останавливаем всплытие события

                //this._basketButton.disabled = true;                

                this.events.emit('product:add', { card: this });
            });
        }

        if (this._deleteButton) {
            this._deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();

               //this._basketButton.disabled = false;

                this.events.emit('product:delete', { card: this });
            // При срабатывании этого события объект товара удаляется из массива товаров заказа orderData.deleteProduct
        });            
        }                 

        this.container.addEventListener('click', () => this.events.emit('card:open', { card: this }));
    }

    render(productData: Partial<IProduct> | undefined) { 
        const { ...allProductData } = productData;
        Object.assign(this, allProductData); 
        this.updateBasketButtonState(); // Обновляем состояние кнопки после рендера
        console.log('возвращаем контейнер внутри рендера', this.container);
        return this.container;
    }

    protected updateBasketButtonState() {
        if (this._basketButton) {
            this._basketButton.disabled = this.ordered || this._priceValue === null; // Отключаем кнопку, если ordered == true
        }
    }

    set ordered(value: boolean) {
        console.log('Сеттер вызван с значением:', value);
        this._ordered = value;
        
        if (this._basketButton) {
            this._basketButton.disabled = value; // Отключаем кнопку, если ordered == true
        }
    }
   
    set price(price: number | null) {
        // Сохраняем текущее значение цены
        this._priceValue = price; // Предполагается, что вы добавили это свойство
    
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
    
        // Обновляем состояние кнопки с учетом ordered
        this.updateBasketButtonState();
    } 
    
    get ordered(): boolean {
        return this._ordered;
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

    set image(url: string) {
        if (this._image) 
        this._image.src = CDN_URL + url;    
    }
       
    set description(description: string) {
        if (this._description) {
        this._description.textContent = description;
    }
    }  

    set category(category: string) {
        if (this._category) {
            // Удаляем все возможные классы перед добавлением нового
            this._category.classList.remove('card__category_other', 'card__category_soft', 'card__category_hard', 'card__category_additional', 'card__category_button');
    
            // Устанавливаем текст
            this._category.textContent = category;
    
            // Добавляем класс в зависимости от значения category
            switch (category) {
                case 'другое':
                    this._category.classList.add('card__category_other');
                    break;
                case 'дополнительное':
                    this._category.classList.add('card__category_additional');
                    break;
                case 'софт-скил':
                    this._category.classList.add('card__category_soft');
                    break;
                case 'хард-скил':
                    this._category.classList.add('card__category_hard');
                    break;
                case 'кнопка':
                    this._category.classList.add('card__category_button');
                    break;
                default:
                    
                    break;
            }
        }
    } 

    deleteCard() {
        this.container.remove();
        // this.events.emit('basketProduct:delete', )
    }
     
}