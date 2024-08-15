class YourClass {
    private savedAddress: string = ''; // Свойство для хранения адреса
    private isAddressValid: boolean = false; // Свойство для хранения валидности адреса
    private container: HTMLElement; // Ваш контейнер
    private input: HTMLInputElement; // Ваш элемент ввода
    private selectedPayment: string; // Метод оплаты
    private formName: string; // Имя формы
    private events: { emit: (event: string, data: any) => void }; // Эмиттер событий

    constructor(container: HTMLElement, input: HTMLInputElement, formName: string, events: any) {
        this.container = container;
        this.input = input;
        this.formName = formName;
        this.events = events;

        this.container.addEventListener('input', (event: InputEvent) => {
            const target = event.target as HTMLInputElement;
            const value = target.value;

            // Сохраняем адрес
            this.savedAddress = value;

            console.log('получаем адрес');
            console.log(this.savedAddress);
            console.log('Успешно получили адрес');
            console.log(value);

            // Проверяем валидность адреса
            this.isAddressValid = value.trim() !== '';
            this.updateSubmitButtonState();

            // Эмитируем событие с сохраненным адресом
            this.events.emit('address:input', { savedAddress: this.savedAddress });
        });

        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            
            // Используем savedAddress из класса
            const address = this.savedAddress; 
            console.log('тут должен быть адрес');
            console.log(address);
            console.log('тут должен быть адрес');

            const paymentMethod = this.selectedPayment;

            console.log('Отправка данных:', { address, paymentMethod });

            this.events.emit(${this.formName}:submit, { address, paymentMethod });
        });
    }

    // Метод для получения значения из поля ввода
    public getInputValue(): string {
        return this.savedAddress;
    }

    // Пример метода для обновления состояния кнопки отправки
    private updateSubmitButtonState() {
        // Логика для обновления состояния кнопки отправки
    }
}

// Пример использования класса
const inputContainer = document.getElementById('input-container'); // Получите ваш контейнер
const inputElement = document.getElementById('input-field') as HTMLInputElement; // Ваш элемент ввода
const formName = 'yourFormName'; // Имя вашей формы
const events = { emit: (event: string, data: any) => console.log(event, data) }; // Эмиттер событий

const yourClassInstance = new YourClass(inputContainer, inputElement, formName, events);