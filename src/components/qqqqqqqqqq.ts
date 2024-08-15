export class FormPayment extends Component<IFormPaymentView> {
    private formElement: HTMLFormElement;
    private addressInput: HTMLInputElement;
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private submitButton: HTMLButtonElement;
    private errorSpan: HTMLElement;

    constructor(formElement: HTMLFormElement) {
        super();

        // Сохраняем переданный элемент формы
        this.formElement = formElement;

        // Получаем элементы формы
        this.addressInput = this.formElement.querySelector('input[name="address"]') as HTMLInputElement;
        this.paymentButtons = this.formElement.querySelectorAll('.order__buttons button');
        this.submitButton = this.formElement.querySelector('.order__button') as HTMLButtonElement;
        this.errorSpan = this.formElement.querySelector('.form__errors') as HTMLElement;

        // Инициализация состояния
        this.state = {
            address: '',
            payment: '',
            error: '',
            valid: false,
        };

        // Добавляем обработчики событий
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', this.handlePaymentSelection.bind(this));
        });

        this.addressInput.addEventListener('input', this.handleAddressInput.bind(this));
        this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private handlePaymentSelection(event: Event) {
        const target = event.target as HTMLButtonElement;
        this.state.payment = target.name;

        // Обновляем кнопку "Далее"
        this.updateSubmitButtonState();
    }

    private handleAddressInput(event: Event) {
        this.state.address = (event.target as HTMLInputElement).value;

        // Проверяем валидность адреса
        this.state.valid = this.state.address.trim() !== '';

        // Обновляем кнопку "Далее"
        this.updateSubmitButtonState();
    }

    private updateSubmitButtonState() {
        this.submitButton.disabled = !this.state.valid || !this.state.payment;
        this.errorSpan.textContent = this.state.valid ? '' : 'Введите адрес доставки';
    }

    private handleSubmit(event: Event) {
        event.preventDefault();

        if (this.state.valid && this.state.payment) {
            // Логика отправки формы
            console.log('Форма отправлена:', this.state);
        } else {
            this.errorSpan.textContent = 'Пожалуйста, заполните все поля.';
        }
    }
}






export class FormPayment extends Component<IFormPaymentView> {
    private formElement: HTMLFormElement;
    private addressInput: HTMLInputElement;
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private submitButton: HTMLButtonElement;
    private errorSpan: HTMLElement;

    constructor(formElement: HTMLFormElement) {
        super();

        // Сохраняем переданный элемент формы
        this.formElement = formElement;

        // Получаем элементы формы
        this.addressInput = this.formElement.querySelector('input[name="address"]') as HTMLInputElement;
        this.paymentButtons = this.formElement.querySelectorAll('.order__buttons button');
        this.submitButton = this.formElement.querySelector('.order__button') as HTMLButtonElement;
        this.errorSpan = this.formElement.querySelector('.form__errors') as HTMLElement;

        // Инициализация состояния
        this.state = {
            address: '',
            payment: '',
            error: '',
            valid: false,
        };

        // Добавляем обработчики событий
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', this.handlePaymentSelection.bind(this));
        });

        this.addressInput.addEventListener('input', this.handleAddressInput.bind(this));
        this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private handlePaymentSelection(event: Event) {
        const target = event.target as HTMLButtonElement;
        this.state.payment = target.name;

        // Генерируем событие выбора способа оплаты
        this.events.emit('payment:selected', { payment: this.state.payment });

        // Обновляем кнопку "Далее"
        this.updateSubmitButtonState();
    }

    private handleAddressInput(event: Event) {
        this.state.address = (event.target as HTMLInputElement).value;

        // Проверяем валидность адреса
        this.state.valid = this.state.address.trim() !== '';

        // Обновляем кнопку "Далее"
        this.updateSubmitButtonState();
    }

    private updateSubmitButtonState() {
        this.submitButton.disabled = !this.state.valid || !this.state.payment;
        this.errorSpan.textContent = this.state.valid ? '' : 'Введите адрес доставки';
    }

    private handleSubmit(event: Event) {
        event.preventDefault();

        if (this.state.valid && this.state.payment) {
            // Генерируем событие отправки формы
            this.events.emit('form:submitted', { address: this.state.address, payment: this.state.payment });

            // Логика отправки формы
            console.log('Форма отправлена:', this.state);
        } else {
            this.errorSpan.textContent = 'Пожалуйста, заполните все поля.';
        }
    }
}


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

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.events = events;

        this.input = this.container.querySelector<HTMLInputElement>('.form__input');
        this.submitButton = this.container.querySelector<HTMLButtonElement>('.order__button');

        if (this.submitButton) {
            this.submitButton.addEventListener('click', (event) => this.handleSubmit(event));
        }
    }

    getInputValue(): string {
        return this.input.value;
    }

    protected handleSubmit(event: Event): void {
        event.preventDefault(); // предотвращаем стандартное поведение формы
        const inputValue = this.getInputValue();
        console.log('Значение инпута:', inputValue);

        // Здесь можно добавить логику для обработки значения инпута
    }
}