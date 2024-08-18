import { Component } from "./base/Component";

import { IEvents } from "./base/events";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLButtonElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = this.container.querySelector('.order-success__close');
        this._total = this.container.querySelector('.order-success__description');

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(total: number) {
        this._total.textContent = 'Cписано '+ total.toString() + ' синапсов';
    }
}

