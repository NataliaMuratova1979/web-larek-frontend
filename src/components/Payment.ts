import { FormPayment } from "./FormPayment";
import { IEvents } from "./base/events";
import {ensureElement} from "../utils/utils";
import { IPaymentForm } from '../types';



export class Payment extends FormPayment<IPaymentForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
            }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set payment(value: string) {
        // Устанавливаем значение в поле payment
        const cashButton = this.container.elements.namedItem('cash') as HTMLButtonElement;
        const cardButton = this.container.elements.namedItem('card') as HTMLButtonElement;
     
        cashButton.addEventListener('click', () => {
            console.log('кликнули на кнопку выбора способа оплаты');
            this.payment = 'cash'; // Устанавливаем значение при нажатии кнопки
        });

        cardButton.addEventListener('click', () => {
            console.log('кликнули на кнопку выбора способа оплаты');
            this.payment = 'card'; // Устанавливаем значение при нажатии кнопки
        });

        // Обновляем состояние кнопок
        if (value === 'cash') {
            cashButton.classList.add('button_alt-active');
            cardButton.classList.remove('button_alt-active');
        } else if (value === 'card') {
            cardButton.classList.add('button_alt-active');
            cashButton.classList.remove('button_alt-active');
        }
    }
}

  
