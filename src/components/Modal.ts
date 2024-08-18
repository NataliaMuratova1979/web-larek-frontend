import { Component } from "./base/Component";
import { IEvents } from './base/events';

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = this.container.querySelector('.modal__close');
        this._content = this.container.querySelector('.modal__content');

        this._closeButton.addEventListener('click', this.close.bind(this));

        this.container.addEventListener('click', this.close.bind(this));

        this.container.addEventListener('click', (event) => {
            // Проверяем, был ли клик на самом контейнере (оверлее)
            if (event.target === this.container) {
                this.close();
            }
        });

        this._content.addEventListener('click', (event) => event.stopPropagation());
      
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        console.log('Вызываем метод close');
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}


