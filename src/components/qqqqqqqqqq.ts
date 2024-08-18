export class Card extends Component<IProduct> {
    // ... ваш код ...

    protected _ordered: boolean = false; // Изначально не заказан

    // ... ваш код ...

    render(productData: Partial<IProduct> | undefined) { 
        const { ...allProductData } = productData;
        Object.assign(this, allProductData); 

        // Установите состояние кнопки на основе _ordered
        this.updateBasketButtonState();

        return this.container;
    }

    // Новый сеттер для _ordered
    set ordered(value: boolean) {
        this._ordered = value;
        this.updateBasketButtonState();
    }

    // Метод для обновления состояния кнопки
    private updateBasketButtonState() {
        if (this._basketButton) {
            this._basketButton.disabled = this._ordered; // Устанавливаем состояние кнопки
            this._basketButton.textContent = this._ordered ? 'Заказан' : 'В корзину'; // Устанавливаем текст кнопки
        }
    }

    // ... ваш код ...
}
