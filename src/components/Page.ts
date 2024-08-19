import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

interface IPage {
    
    locked: boolean;
}

export class Page extends Component<IPage> {
 
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

  
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = document.querySelector('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }

  

}