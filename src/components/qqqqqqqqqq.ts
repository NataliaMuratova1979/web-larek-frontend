import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IFormPaymentView {
    input: string;
    payment: string;
    error: string;
    valid: boolean;
}

export class FormPayment extends Component<IFormPaymentView> {
    protected input: HTMLInputElement; // это инпут адрес
    protected payments: NodeListOf<HTMLButtonElement>; // это кнопки оплаты
    protected submitButton: HTMLButtonElement; // это кнопка сабмита
    protected errorSpan: HTMLElement; // это спан ошибки
    protected formName: string; // Это имя этой формы name="order"
    
    // Новые переменные для отслеживания состояния
    protected isAddressValid: boolean = false;
    protected selectedPayment: string | null = null;

    constructor (container: HTMLElement, protected events: IEvents) {
        super(container); 
        this.events = events;
      
        this.input = this.container.querySelector<HTMLInputElement>('input[name="address"]');
        this.formName = this.container.getAttribute('name');
        this.payments = this.container.querySelectorAll<HTMLButtonElement>('.button.order__buttons');
        this.submitButton = this.container.querySelector('.order__button');
        this.errorSpan = this.container.querySelector('.form__errors');

        this.container.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;

            this.events.emit('address:input', { field, value });

            // Проверяем валидность адреса
            this.isAddressValid = value.trim() !== '';
            this.updateSubmitButtonState();
        });

        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.events.emit(`${this.formName}:submit`, this.getInputValue(this.input));
        });

        this.container.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLButtonElement;

            // Проверяем, что целевой элемент действительно является кнопкой
            if (target.tagName === 'BUTTON') {
                console.log('нажали на кнопку');
                console.log(target);
                console.log(target.name);

                // Получаем текст кнопки
                const value = target.textContent || '';
                console.log(value);

                // Вызываем getPaymentValue с текстом кнопки или её именем
                const paymentValue = this.getPaymentValue(target);
                console.log(paymentValue);
                
                // Запоминаем выбранный способ оплаты
                this.selectedPayment = paymentValue;

                // Эмитим событие с полученным значением
                this.events.emit(`${target.name}:selected`, { value: paymentValue });

                // Обновляем состояние кнопки отправки
                this.updateSubmitButtonState();
            }
        });
    }

    set address(value: string) {   
        this.input.value = value;
    }

    protected getInputValue(input: HTMLInputElement): string {
        console.log(input.value);
        console.log('получили адрес');
        return input.value;
    }

    protected getPaymentValue(button: HTMLButtonElement): string {
        console.log(button.textContent);
        console.log('получили значение оплаты');
        return button.textContent || '';
    }

    // Метод для обновления состояния кнопки отправки
    private updateSubmitButtonState(): void {
        if (this.isAddressValid && this.selectedPayment) {
            this.submitButton.disabled = false; // Активируем кнопку
        } else {
            this.submitButton.disabled = true; // Деактивируем кнопку
        }
    }
}