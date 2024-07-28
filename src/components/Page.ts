import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export interface IPage {
    productList: HTMLElement[]; // DOM-элемент, где размещен список товаров 
    productTotalNumber: number; // количество товаров в корзине 
}

export class Page extends Component<IPage> implements IPage{
    protected productContainer: HTMLElement;
    protected counterTotalProducts: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.productContainer = ensureElement('.gallery', this.container);
        this.counterTotalProducts = ensureElement('.header__basket-counter', this.container);
    }

    set productList(items: HTMLElement[]) {
        this.productContainer.replaceChildren(...items);
    }

    set productTotalNumber(value: number) {
        this.setText(this.counterTotalProducts, `${String(value)}`);
     }   
}