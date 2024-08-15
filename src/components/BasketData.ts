/*
#### Класс BasketData
Класс отвечает за хранение и логику работы с данными товаров, добавленных в корзину.\
Данные товаров - это массив объектов товаров. Их можно добавлять и удалять, а также подсчитывать общую стоимость товаров, добавленных в корзину. 
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- _products: IProduct[] - массив товаров, добавленных в корзину
- _preview: string | null - id товара, выбранного для удаления из корзины
- events: IEvent - экземпляр класса `EventEmitter`

Также класс предоставляет набор методов для взаимодействия с этими данными.
 
- addProduct(product: IProduct): void - добавляет одну карточку товара в конец массива и вызывает событие изменения массива.
- deleteProduct(productId: string, payload: Function | null): void - удаляет карточку из массива. Если передан колбэк, то выполняет его после удаления, если нет, то вызывает событие изменени массива.
- getProduct(productId: string): IProduct - возвращает товар по его id;
- сеттеры и геттеры;
*/


import { IProduct, IProductsData } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IProductsData {
    protected _products: IProduct[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
       this.events = events;
    }

    set products(products:IProduct[]) {
        this._products = products;
        this.events.emit('basket:changed')
    }   

    get products () {
        return this._products;
    }

    totalPrice(products: IProduct[]) {
        return products.reduce((total, product) => total + product.price, 0);
      }

    getProductIndex(product: IProduct): number {
        return this._products.indexOf(product);
    }

    addProduct(product: IProduct) {
       this._products = [...this._products, product]
       this.events.emit('basket:changed')        
    }

    deleteProduct(productId: string, payload: Function | null = null) {
        this._products = this._products.filter(product => product.id !== productId);

        if(payload) {
            payload();
        } else {
            this.events.emit('basket:open')
        }
    }

    getProduct(productId: string) {
        return this._products.find((item) => item.id === productId)
    }

    getProducts() {
        return this._products;
      }

    set preview(productId: string | null) {
        if (!productId) {
            this._preview = null;
            return;
        }
        const selectedProduct = this.getProduct(productId);
        if (selectedProduct) {
            this._preview = productId;
            this.events.emit('item:selected')
        }
    }

    get preview () {
        return this._preview;
    }

    getTotal() {
        return this._products.length;
    }

    //set status - ordered или нет

    //set impolssible -  если нет цены, в корзну не добавить 
}