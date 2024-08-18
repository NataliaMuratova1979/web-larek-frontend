import { Basket } from './Basket';
/*
#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказа.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- _basket: IBasket[] - массив товаров, добавленных в корзину
- _userdata: IUserData = объект данных с информацией о пользователе
- total: IProductOrderedPrice[] - информация о сумме заказа
- events: IEvent - экземпляр класса `EventEmitter`
!!!!! - добавить поле completed (boolean) - отправлени или нет. 

Также класс предоставляет набор методов для взаимодействия с этими данными.
- addOrderData - добавляем данные в объект заказа
- getTotal - получаем сумму заказа
- метод для подсчета количества заказанных товаров;
- setOrder() - отправляем данные на сервер
- getOrder() - метод возвращает данные, полученные с сервера после успешной отправки заказа
- checkValidation(data: Record<keyof IOrderFormData, string>): boolean;
- cleanOrder - очищаем объект заказа 
*/


/*export interface IUserPayment {
    payment: string;
    address: string;
   // addData() // добавляем данные в объект заказа
   // checkValidation(data: Record<keyof IOrderFormData, string>): boolean;
}

export interface IUserContacts  {
    address: string;
    phone: string;
   // addData() // добавляем данные в объект заказа
   // checkValidation(data: Record<keyof IOrderFormData, string>): boolean;
}
   */

import { FormErrors, IUserContacts, IUserPayment, IPaymentForm, IContactsForm, IProduct } from "../types";
import { IEvents } from "./base/events";

export interface IOrderData { // это данные товаров и действия, которые мы можем с ними выполнять
    basket: IProduct[];
    userContacts: IUserContacts;
    userPayment: IUserPayment;
    //getProduct(productId: string): void;
    //addProduct(product: IProduct): void;
    //deleteProduct(productId: string, payload: Function | null): void;
}


export class OrderData implements IOrderData {
     _basket: IProduct[];    
    userPayment: IUserPayment = {
        payment: '',
        address: ''
    };
    userContacts: IUserContacts = {
        email: '',
        phone: ''
    };
    preview: string | null;
    formErrors: FormErrors = {}; //добавить интерфейс
  
    protected events: IEvents;   


    constructor(events: IEvents) {
        this.events = events;
    }
   
    set basket(basket: IProduct[]) {
        this._basket = basket;
        this.events.emit('formPayment:open')
    }

    get basket () {
        return this._basket;
    }

    addProduct(product: IProduct) {
        this._basket = [...this._basket, product];
        this.events.emit('basket:changed', this._basket);
        console.log('Пользователь добавил товар в корзину.', this._basket);

     }

    getTotal() {
        return this._basket.length;
    }

    totalPrice(): number { // Изменяем метод для возврата типа number
        return this._basket.reduce((total, product) => total + product.price, 0);
    }

    deleteProduct(productId: string, payload: Function | null = null) {
        this._basket = this.basket.filter(product => product.id !== productId);

        if(payload) {
            payload();
        } else {
            this.events.emit('basket:open');
            console.log('Пользователь добавил товар в корзину.', this._basket);

        }
    }

    getProducts() {
        return this._basket;
    }

    setPaymentField(field: keyof IPaymentForm, value: string) {
        this.userPayment[field] = value;

        if (this.validatePaymentForm()) {
            this.events.emit('formContacts:open', this.userPayment );
        }
    }

    setContactsField(field: keyof IContactsForm, value: string) {
        this.userContacts[field] = value;

        if (this.validateContactsForm()) {
            this.events.emit('order:submit', this.userContacts );
        }
    }

    validatePaymentForm() {
        const errors: typeof this.formErrors = {};       
        if (!this.userPayment.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.userPayment.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }


    validateContactsForm() {
        const errors: typeof this.formErrors = {};       
        if (!this.userContacts.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.userContacts.email) {
            errors.email = 'Необходимо указать электронную почту';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    getOrder() {
        return {
            items: this._basket.map(product => product.id),
            payment: this.userPayment.payment,
            address: this.userPayment.address,
            email: this.userContacts.email,
            phone: this.userContacts.phone,
            total: this.totalPrice()
        };
    }

    clearOrder() {
        this._basket = []; // Очищаем корзину
        this.events.emit('basket:changed', this._basket); // Уведомляем об изменении корзины
        console.log('Корзина очищена.', this._basket);
    }   

}
     