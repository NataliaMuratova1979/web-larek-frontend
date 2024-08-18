import { Component } from "./base/Component";

import { IEvents } from "./base/events";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}


export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = this.container.querySelector('.order-success__close');

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
}

