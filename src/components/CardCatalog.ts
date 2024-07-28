import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export interface ICardCatalog{
     : HTMLElement[]; // DOM-элемент, где размещен список товаров 
     : number; // количество товаров в корзине 
}

export class CardCatalog extends Component<ICardCatalog> implements IProductItem{
    //protected productItemContainer: HTMLElement;
    //protected counterTotalProducts: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.cardContainer = ensureElement('.gallery__item', this.container);
        this.counterTotalProducts = ensureElement('.header__basket-counter', this.container);
    }

    set productList(items: HTMLElement[]) {
        this.productContainer.replaceChildren(...items);
    }

    set productTotalNumber(value: number) {
        this.setText(this.counterTotalProducts, `${String(value)}`);
     }   
}