protected updateBasketButtonState() {
    if (this._basketButton) {
        // Отключаем кнопку, если ordered == true или price == null
        this._basketButton.disabled = this.ordered || this.price === null;
    }
}

set price(price: number | null) {
    // Сохраняем текущее значение цены
    this._priceValue = price; // Предполагается, что вы добавили это свойство

    if (price !== null) {
        this._price.textContent = price.toString() + ' синапсов';
        this._isBasketButtonDisabled = false; // Кнопка активна
    } else {
        this._price.textContent = 'Бесценно';
        this._isBasketButtonDisabled = true; // Кнопка неактивна
    }
    
    // Обновляем состояние кнопки
    if (this._basketButton) {
        this._basketButton.disabled = this._isBasketButtonDisabled; // Устанавливаем состояние кнопки
        this._basketButton.textContent = this._isBasketButtonDisabled ? 'Не продается' : 'В корзину'; // Устанавливаем текст кнопки
    }

    // Обновляем состояние кнопки с учетом ordered
    this.updateBasketButtonState();
}

// Добавьте новое свойство для хранения значения цены
protected _priceValue: number | null = null;

// Также обновите метод render, чтобы вызвать updateBasketButtonState после установки цены
render(productData: Partial<IProduct> | undefined) { 
    const { ...allProductData } = productData;
    Object.assign(this, allProductData); 
    this.updateBasketButtonState(); // Обновляем состояние кнопки после рендера
    console.log('возвращаем контейнер внутри рендера', this.container);
    return this.container;
}
