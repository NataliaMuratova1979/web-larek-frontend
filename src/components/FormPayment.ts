import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IFormPaymentView {
    input: string;
    payment: string;
    error: string;
    valid: boolean;
}

export class FormPayment extends Component<IFormPaymentView> {
    
    //protected _form: HTMLFormElement; // это сама форма
    protected input: HTMLInputElement; // это инпут адрес
    protected payments: NodeListOf<HTMLButtonElement>; // это кнопки оплаты
    protected submitButton: HTMLButtonElement; // это кнопка сабмита
    protected errorSpan: HTMLElement; // это спан ошибки
    protected formName: string; // Это имя этой формы name="order"


    constructor (container: HTMLElement, protected events: IEvents) {
        super(container); 
        this.events = events;
      
        this.input =  this.container.querySelector<HTMLInputElement>('input[name="address"]');

        if (!this.input) {
            console.error('Инпут не найден!');
            return; 
        }
    
        this.formName = this.container.getAttribute('name');
        this.payments = this.container.querySelectorAll<HTMLButtonElement>('.button order__buttons');
        this.submitButton = this.container.querySelector('.order__button');
        this.errorSpan = this.container.querySelector('.form__errors');
     
        this.container.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
		    this.events.emit(`${this.formName}:input`, { field, value });
		});

        this.container.addEventListener('submit', (evt) => {
			evt.preventDefault();
		   this.events.emit(`${this.formName}:submit`, /*this.getInputValue()*/);
		});
        
      


    }
   
    set address(value: string) {   
        this.input.value = value;
    }

    protected getInputValue(input: HTMLInputElement): string {
        console.log(input.value);
        console.log('выше значение инпута');
        return input.value;
    };







}









 



/* 
    protected getInputValue() {
        const valuesObject: Record<string, string> = {};
            
    }

   
    get form() {
        return this._form;

    }
*/




        
/*

    private handleSubmit(event: Event) {
        event.preventDefault();

        if (this.state.valid && this.state.payment) {
            // Логика отправки формы
            console.log('Форма отправлена:', this.state);
        } else {
            this.error.textContent = 'Пожалуйста, заполните все поля.';
        }'
        */










    











/*
export class FormPayment extends Component<IFormPaymentView> {

    protected _form: HTMLFormElement;
    protected input: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errorContainer: HTMLElement;
    protected buttons: NodeListOf<HTMLButtonElement>;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._form = this.createForm();
        this._errorContainer = document.createElement('div');
        this._errorContainer.className = 'form__errors';
        this._form.appendChild(this._errorContainer);
        
        this.container.appendChild(this._form);

        this._submitButton = this._form.querySelector('.order__button') as HTMLButtonElement;
        this._submitButton.disabled = true; // Блокируем кнопку по умолчанию

        this.attachEventListeners();
    }

    private createForm(): HTMLFormElement {
        const form = document.createElement('form');
        form.name = 'order';
        
        const addressInput = document.createElement('input');
        addressInput.type = 'text';
        addressInput.name = 'address';
        addressInput.placeholder = 'Введите адрес доставки';
        addressInput.required = true;

        const paymentButtonsContainer = document.createElement('div');
        paymentButtonsContainer.className = 'order__buttons';

        ['card', 'cash'].forEach(method => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = method;
            button.name = method;
            paymentButtonsContainer.appendChild(button);
        });

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'order__button';
        submitButton.textContent = 'Далее';

        form.append(addressInput, paymentButtonsContainer, submitButton);
        return form;
    }

    private attachEventListeners(): void {
        const paymentButtons = this._form.querySelectorAll('.order__buttons button');

        paymentButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const selectedMethod = (event.target as HTMLButtonElement).name;
                console.log(Выбран способ оплаты: ${selectedMethod});
                this._submitButton.disabled = false; // Активируем кнопку "Далее"
            });
        });

        this._form.addEventListener('submit', (event) => {
            event.preventDefault();
            const addressInput = this._form.querySelector('input[name="address"]') as HTMLInputElement;

            if (addressInput.value.trim() === '') {
                this.showError('Введите адрес доставки.');
            } else {
                // Здесь можно добавить логику для обработки данных формы
                console.log('Адрес доставки: ${addressInput.value}');
                this.events.emit('order:submit', { address: addressInput.value });
            }
        });
    }

    private showError(message: string): void {
        this._errorContainer.textContent = message;
    }
}
*/