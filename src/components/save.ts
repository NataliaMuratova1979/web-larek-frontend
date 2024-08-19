
//-----------------------------FormPayment--------------------------------//

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
    protected savedAddress: string = ''; //свойство для хранения адреса

     // Новые переменные для отслеживания состояния
     protected isAddressValid: boolean = false;
     protected selectedPayment: string | null = null;

    constructor (container: HTMLFormElement, protected events: IEvents) {
        super(container); 
        this.events = events;
      
        this.input =  this.container.querySelector<HTMLInputElement>('input[name="address"]');
    
        this.formName = this.container.getAttribute('name');
        this.payments = this.container.querySelectorAll<HTMLButtonElement>('.button order__buttons');
        this.submitButton = this.container.querySelector('.order__button');
        this.errorSpan = this.container.querySelector('.form__errors');
     


        this.container.addEventListener('input', (event: InputEvent) => {
            
            const target = event.target as HTMLInputElement;
            const value = target.value;
            
            this.savedAddress = value;
            //this.events.emit(`address:input`, { value });

            console.log('получаем адрес');
            const savedAddress = this.getInputValue(target);
            console.log(this.savedAddress);
            console.log('Успешно получили адрес');

            console.log(value);

            // Проверяем валидность адреса
            this.isAddressValid = value.trim() !== '';
            this.updateSubmitButtonState();   
            
            this.events.emit(`address:input`, { savedAddress: this.savedAddress });
        });
      

        this.container.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLButtonElement;
        
            // Проверяем, что целевой элемент действительно является нашей кнопкой
            if (target.classList.contains('button_alt')) {
                console.log('нажали на кнопку выбора способа оплаты');        
                console.log(target);
                console.log(target.name);
        
                // Получаем текст кнопки
                    const value = target.textContent || '';
                    console.log(value);

                // Вызываем getPaymentValue с текстом кнопки или её именем
                    const paymentValue = this.getPaymentValue(target); // 
                    console.log(paymentValue);

                    // Запоминаем выбранный способ оплаты
                    this.selectedPayment = paymentValue;

               // Эмитим событие с полученным значением
                     this.events.emit(`${target.name}:input`, { value: paymentValue });

                     // Обновляем состояние кнопки отправки
                    this.updateSubmitButtonState();
                 }
            });

            
        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();

            const address = this.savedAddress;
            console.log('тут должен быть адрес');
            console.log(address);
            console.log('тут должен быть адрес');

            const paymentMethod = this.selectedPayment;

            console.log('Отправка данных:', { address, paymentMethod });

            this.events.emit(`${this.formName}:submit`, { address, paymentMethod });
        }); 
    } 
    
    set address(value: string) {   
        this.input.value = value;
        console.log(this.address);
    } 
      
    protected getInputValue(input: HTMLInputElement): string {
        console.log(input.value);
        console.log('получили адрес');
        return input.value;
    };

    getSavedAddress(): string {
        return this.savedAddress;
    }

    protected getPaymentValue(button: HTMLButtonElement): string {
        console.log(button.textContent);
        console.log('получили значение оплаты');
        return button.textContent || '';
    }

      // Метод для обновления состояния кнопки отправки
      protected updateSubmitButtonState(): void {
        if (this.isAddressValid && this.selectedPayment) {
            this.submitButton.disabled = false; // Активируем кнопку
        } else {
            this.submitButton.disabled = true; // Деактивируем кнопку
        }
    }
} 
//---------------------------------------------------------------------------------//

    
    
    
    
  