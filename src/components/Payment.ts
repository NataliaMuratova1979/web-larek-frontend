import { FormPayment } from "./FormPayment";
import { IEvents } from "./base/events";
import {ensureElement} from "../utils/utils";
import { IPaymentForm } from '../types';



export class Payment extends FormPayment<IPaymentForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.initPaymentButtons();
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set payment(value: string) {
        // Устанавливаем значение в поле payment
        const cashButton = this.container.elements.namedItem('cash') as HTMLButtonElement;
        const cardButton = this.container.elements.namedItem('card') as HTMLButtonElement;

        // Обновляем состояние кнопок
        if (value === 'cash') {
            cashButton.classList.add('active');
            cardButton.classList.remove('active');
        } else if (value === 'card') {
            cardButton.classList.add('active');
            cashButton.classList.remove('active');
        }
    }

    private initPaymentButtons() {
        const cashButton = this.container.elements.namedItem('cash') as HTMLButtonElement;
        const cardButton = this.container.elements.namedItem('card') as HTMLButtonElement;

        cashButton.addEventListener('click', () => {
            this.payment = 'cash'; // Устанавливаем значение при нажатии кнопки
        });

        cardButton.addEventListener('click', () => {
            this.payment = 'card'; // Устанавливаем значение при нажатии кнопки
        });
    }

  
}