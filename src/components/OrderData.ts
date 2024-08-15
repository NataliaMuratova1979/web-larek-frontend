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


import { IUserContacts, IUserPayment, IProduct } from "../types";
import { IEvents } from "./base/events";

export interface IOrderData { // это данные товаров и действия, которые мы можем с ними выполнять
    basket: IProduct[];
    //userContacts: IUserContacts;
   // userPayment: IUserPayment;
}

export class OrderData implements IOrderData {
    protected _basket: IProduct[];
   // protected _userContacts: IUserContacts;
   // protected _userPayment: IUserPayment; 
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

    /*
    set user(user: IUserData) {
        this._user = user;
        this.events.emit('order:ready')
    }
        */

    //set userContacts

}
     