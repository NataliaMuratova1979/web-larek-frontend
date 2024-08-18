import { IUserPayment } from "../types";
import { IEvents } from "./base/events";



export class UserPaymentData implements IUserPayment {
    protected _address: string;
    protected _payment: string;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this.address = '';
        this.payment = '';
    }

    set address(address: string) {
        this._address = address;
    }

    set payment(payment: string) {
        this._payment = payment;
    }
    
    get address(): string {
        console.log('возвращаем', this._address)
        return this._address;
    }

    get payment(): string {
        console.log('возвращаем', this._payment)
        return this._payment;
    }
    
    checkAndEmitEvent() {
        const isAddressValid = typeof this.address === 'string' && this.address.trim() !== '';
        const isPaymentValid = typeof this.payment === 'string' && this.payment.trim() !== '';
    
        if (isAddressValid && isPaymentValid) {
            this.events.emit('formContacts:open');
            console.log('пора открывать вторую форму');
        } else {
            console.log('address или payment не являются корректными строками');
        }
    }

}
 