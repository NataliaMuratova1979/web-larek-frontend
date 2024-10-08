
import { IProduct, IProductsData } from "../types";
import { IEvents } from "./base/events";

export class ProductData implements IProductsData {
    protected _products: IProduct[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
       this.events = events;
    }

    set products(products:IProduct[]) {
        this._products = products;
        this.events.emit('products:changed')
    }

    get products () {
        return this._products;
    }

    addProduct(product: IProduct) {
       this._products = [...this._products, product]
       this.events.emit('products:changed')        
    }

    deleteProduct(productId: string, payload: Function | null = null) {
        this._products = this._products.filter(product => product.id !== productId);

        if(payload) {
            payload();
        } else {
            this.events.emit('products:changed')
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
            this.events.emit('product:selected')
        }
    }

    get preview () {
        return this._preview;
    }

    getTotal() {
        return this._products.length;
    }

}


