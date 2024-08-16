import { Component } from "./base/Component";
import { IEvents } from "./base/events";


interface IFormState {
    valid: boolean;
    errors: string[];
}

export class FormPayment<T> extends Component<IFormState> {
    
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;
 
    constructor (protected container: HTMLFormElement, protected events: IEvents) {
        super(container); 

        this._submit = this.container.querySelector('button[type=submit]');
        this._errors = this.container.querySelector('.form__errors');

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);            
        });

        this.container.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;         
            // Проверяем, что кликнули именно на кнопку с классом button_alt
            if (target.classList.contains('button_alt')) {
                const paymentMethod = target.getAttribute('name'); 
                // Получаем значение атрибута name
                this.onPaymentMethodChange(paymentMethod);
            }
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    protected onPaymentMethodChange(method: string | null) {
        if (method) {
            this.events.emit(`${this.container.name}.${method}:change`, {
                method
            });
        }
    }
    
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}  
    
    
    
    