import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { cloneTemplate, ensureElement } from '../utils/utils';


interface IFormState {
    valid: boolean;
    errors: string[];
}

export class FormPayment<T> extends Component<IFormState> {
    
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;
 
    constructor (protected container: HTMLFormElement, protected events: IEvents) {
        super(container); 
        
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);            
        });

        const paymentButtons = this.container.querySelectorAll('.order__buttons .button');

        paymentButtons.forEach(button => {
            button.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLButtonElement;
                const field = 'payment' as keyof T; // Укажите имя поля, которое вы хотите использовать
                const value = target.textContent; // Получаем текст кнопки как значение                
                this.onInputChange(field, value); // Вызов метода с полем и значением
            });
        });
        
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`formPayment:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    } //событие отслеживается в файле index.ts
    
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
    
    
    
    