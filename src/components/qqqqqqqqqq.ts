this.container.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    const field = target.name as keyof T;
    const value = target.value;
    this.onInputChange(field, value);            
});

// Обработчик для кнопок "Онлайн" и "При получении"
const paymentButtons = this.container.querySelectorAll('.order__buttons .button');

paymentButtons.forEach(button => {
    button.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLButtonElement;
        const field = 'paymentMethod' as keyof T; // Укажите имя поля, которое вы хотите использовать
        const value = target.textContent; // Получаем текст кнопки как значение
        this.onInputChange(field, value); // Вызов метода с полем и значением
    });
});
