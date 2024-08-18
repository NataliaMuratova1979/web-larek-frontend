// Это класс отображения второй формы 


import { Component } from "./base/Component";
import { createElement } from "../utils/utils";

import { IEvents } from "./base/events";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class FormContacts<T> extends Component<IFormState> {
    
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

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`order:send`); // !!!!!!!!!!!!!!!
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










/*
interface IFormState {
    valid: boolean;
    errors: string[];
}
*/
/*
export class FormContacts extends Component<IFormPaymentView> {
    
    
    protected inputs: NodeListOf<HTMLInputElement>;
    protected submitButton: HTMLButtonElement; // это кнопка сабмита
    protected errorSpan: HTMLElement; // это спан ошибки
    protected formName: string; // Это имя этой формы name="contacts"
    
    protected savedEmail: string = ''; //свойство для хранения почты
    protected savedPhone: string = ''; //свойство для хранения телефона

    protected isPhoneValid: boolean = false;
    protected isEmailValid: boolean = false;

    constructor (container: HTMLElement, protected events: IEvents) {
        super(container); 
        this.events = events;


        this.inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');

        this.formName = this.container.getAttribute('name');
        this.submitButton = this.container.querySelector('.order__button');
        this.errorSpan = this.container.querySelector('.form__errors');

                
        
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
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

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }




    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}

*/