# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/utils/objects.ts — файл c массивом объектов товаров 


## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

1. Это объект - Товар, который мы получаем с сервера
Мы не можем редактировать эти данные
Мы можем отображать товар, используя эти данные
export interface IProduct {  
        id: string;
        description: string;
        image: string;
        title: string;
        category: string;
        price: number;
    }
    
2. Это объект - Корзина, изначально он пустой. Мы можем добавлять и удалять товары, выбирать товар по id
export interface IBasket {
    items: IProduct[]; 
    preview: string | null;
    total: IProductOrderPrice[];
    addProduct(product: IProduct): void;
    deleteProduct(productId: string, payload: Function | null): void;
    getProduct(productId: string): IProduct;
    getTotal( IProductOrderPrice[] ): 
}

3. Это объект - Данные пользователя, которые мы будем вводить в форму, валидировать  и передавать на сервер
export interface IUserData {
    payment: string;
    email: string;
    phone: string;
    address: string;
    addData() // добавляем данные в объект заказа
    checkValidation(data: Record<keyof IOrderFormData, string>): boolean;
}

4. Это объект - Заказ, изначально он пустой. Мы будем отраправлять его на сервер.
export interface IOrder {
    data: IUserData;
    items: IBasket; // это массив карточек, добавленных в корзинку
    setOrder(): // тут собираем все данные для отправления заказа на сервер
    getOrder(): // метод возвращает данные, полученные с сервера после успешной отправки заказа
}
     
    // Коллекция, каталог товаров
5. export interface IProductData { // это данные товаров и действия, которые мы можем с ними выполнять
    products: IProduct[];
    preview: string | null; // указатель на тот товар, который мы хотим посмотреть       
    getProduct(productId: string): IProduct;
}
    
6. export type IProductMainPage = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>
    
7. export type IProductPopup = Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'>
    
8. export type IProductToAdd = Pick<IProduct, 'id' | 'title' | 'price' >
     
9. export type IProductOrderPrice = Pick<IProduct, 'price'> // Здесь должна быть цена выбранного товара
    
10. export type IOrderFormData = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'> // Данные, вводимые в формы при оформлении заказа
    
11. export type IOrderProducts = Pick<IOrder, 'items'> // Список товаров, добавленных в корзину

## Архитектура приложения

- слой представления отечает за отображение данных на странице
- слой данных отвечает за хранение и изменение данных
- презентер отвечает за связь представления и данных

### Базовый код

Класс АPI содержит базовую логику отправки запросов.

#### Класс EventEmitter
 
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 
Основные методы, реализуемые классом, описаны интерфейсом 'IEvents': 

export interface IEvents {
    // подписка на событие:
    on<T extends object>(event: EventName, callback: (data: T) => void): void;

    // инициализация события:
    emit<T extends object>(event: string, data?: T): void;

    // возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие:
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
'''

### Слой данных 

Один класс будет отвечать за работу с товарами, другой класс - за работу с заказом. 

#### Класс ProductData
Класс отвечает за хранение и логику работы с данными товаров, отображаемых на странице и добавляемых в корзинку.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- _products: IProduct[] - массив объектов товаров
- _preview: string | null - id товара, выбранного для просмотра в модальном окне
- events: IEvent - экземпляр класса `EventEmitter`

Также класс предоставляет набор методов для взаимодействия с этими данными.
 
- addProduct(product: IProduct): void - добавляет одну карточку товара в конец массива и вызывает событие изменения массива.
- deleteProduct(productId: string, payload: Function | null): void - удаляет карточку из массива. Если передан колбэк, то выполняет его после удаления, если нет, то вызывает событие изменени массива.
- getProduct(productId: string): IProduct - возвращает товар по его id;
- сеттеры и геттеры;

#### Класс BasketData
Класс отвечает за хранение и логику работы с данными товаров, добавленных в корзину.\
Данные товаров - это массив объектов товаров. Их можно добавлять и удалять, а также подсчитывать общую стоимость товаров, добавленных в корзину. 
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- _products: IProduct[] - массив товаров, добавленных в корзину
- _preview: string | null - id товара, выбранного для удаления из корзины
- events: IEvent - экземпляр класса `EventEmitter`

Также класс предоставляет набор методов для взаимодействия с этими данными.
 
- addProduct(product: IProduct): void - добавляет одну карточку товара в конец массива и вызывает событие изменения массива.
- deleteProduct(productId: string, payload: Function | null): void - удаляет карточку из массива. Если передан колбэк, то выполняет его после удаления, если нет, то вызывает событие изменени массива.
- getProduct(productId: string): IProduct - возвращает товар по его id;
- сеттеры и геттеры;

### Класс UserData
Класс отвечает за хранение и логику работы с данными, вводимыми в формы оформления заказа.\
Их можно проверять на валидность.
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следущие данные: 
- payment: string;
- email: string;
- phone: string;
- address: string;

Для взаимодействия с данными нам нужны такие методы:
- addUserData - добавляем данные в объект данных пользователя.
- clearUserData - удаляем данные из объекта данных пользователя
- updateUserData - обновляем данные в объекте данных пользователя
- checkValidation(data: Record<keyof IOrderFormData, string>): boolean;

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказа.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- _basket: IBasket[] - массив товаров, добавленных в корзину
- _userdata: IUserData = объект данных с информацией о пользователе
- total: IProductOrderedPrice[] - информация о сумме заказа
- events: IEvent - экземпляр класса `EventEmitter`

Также класс предоставляет набор методов для взаимодействия с этими данными.
- addOrderData - добавляем данные в объект заказа
- getTotal - получаем сумму заказа
- метод для подсчета количества заказанных товаров;
- setOrder() - отправляем данные на сервер
- getOrder() - метод возвращает данные, полученные с сервера после успешной отправки заказа
- checkValidation(data: Record<keyof IOrderFormData, string>): boolean;
- cleanOrder - очищаем объект заказа 

### Слой представления 
Все классы представляния отвечают за отображения внутри контейнера (DOM-элемент) передаваемых в них данных. 

### Класс Component
Класс Component содержит защищённое свойство element, которое является элементом, с которым будет работать компонент. Также класс содержит метод render(), который должен быть реализован в каждом классе-наследнике. Остальные классы наследуются от Component.

#### Класс Modal
Класс наследует класс Component, при этом добавляются элементы для открытия и закрытия модального окна.
Исходя из верстки, у нас есть одно модальное окно, внутри которого размещается контент вызванного модального окна. 
Внутри может быть:\
- div class="modal__container\
- div class="card card_full карточка с полным описанием товара и - кнопка в корзину\
- div class="basket" - корзина со всеми выбранными товарами и кнопка оформить\
- form class="form"> - форма заполнения данных покупателя и кнопка далее\
- form class="form"> - форма заполнения данных покупателя и кнопка оплатить\
- div class="order-success"> - извещение об успешном оформлении заказа и кнопка перехода на главную страницу\

Это реализуется путем вставления внутрь модального окна таких шаблонов (последовательность взята из верстки): 
- template id="success">
- template id="card-catalog">
- template id="card-preview">
- template id="card-basket">
- template id="basket">
- template id="order">
- template id="contacts">
Соответственно, как происходит работа с модальными окнами?
Пользователь нажимает определенную кнопку, открывается модальное окно, внутри которого определенный DOM-элемент. Таким образом реализуется метод `open`.

Также предоставляетcя метод `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.

- constructor(selector: string, events: IEvents) Конструктор принимает темплейт, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- events: IEvents - брокер событий
- openButton: HTMLButtonElement - кнопка отрытия модального окна
- goFurtherButton: HTMLButtonElement - кнопка, открывающая следующее модальное окно (или завершающая заказ)
- handleSubmit: Function - функция, которая будет выполняться после подтвеждения
- close (): закрытие модального окна

#### Класс Form
Наследует класс Component. При этом добавляются возможности вводить данные, а также совершать с ними действия (submit).
Предназначен для реализации модального окна с формой, содержащей поля ввода. При сабмите инициирует событие, передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.\
- submitButton: HTMLButtonElement - кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы
- errors: Record<string, HTMLElement> - объект, хранящий все эелементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- getInputValues(): Record<string, string> - возвращает объект с данными из полей форы, гд ключ - name инпута, значение - данные, введенные пользователем
- setInputValues(data: Record<string, string>): void - принимает объект с данными для заполнения полей формы
- setError(data: { field: string, value: string, validInformation: string}): void - принимает объект с данными для отображения или сокрытия текстов ошибок под полями ввода
- showInputError (field: string, errorMessage: string): void - отображает полученный текс ошибки под указанным полем ввода.
- hideInputError (field: string): void - очищает текст ошибки под указанным полем ввода
- get form: HTMLElement - геттер для получения элемента формы
- checkValidation - проверка на валидность всей формы\

В константах необходимо описать правила для проверки инпутов. (Отдельное правило для каждой формы).
Написать функции, которые используют эти константы и проверяют поля. Универсальная проверка, которое будет проверять любое поле. 

### Класс Product
Отвечает за отображение товара, задавая в товаре данные названия, описания, изображения, цены. Класс используется для отображения товара на главной странице, в модальном окне, в корзине. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать разные варианты верстки товара. Слушатель событий отслеживает, на какую карточку произошел клик. 
Поля класса (в разных модальных окнах разные комбинации):
- template для отрисовки конкретного отображения 
- description: string;
- image: string;
- title: string;
- category: string;
- price: number

Методы
- setData(productData: IProduct): void - заполняет атрибуты элементов товара данными
- render(): HTMLElement - метод возвращает заполненный элемент товара
- геттер id возвращает уникальный id выбранной карточки

Пример создания
const product = new Product(productTemlate, events)


### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы, реализующие взаимодействие с бэкендом сервиса.

#### Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой, находится в файле `index.ts`, выполняющий роль презентера.\
Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий. 

#### Цепочки основных событий:

Событие: клик по карточке товара - отрисовка карточки товара.
Состояние 1. Открыта главная страница.
Состояние 2. Открыта карточка товара, по которому кликнул пользователь.
Что происходит с данными: Данные товара (Product) отображаются в модальном окне (Modal).
1. Пользователь кликнул по какой-то карточке в галерее товара.
2. Действие приложения перешло в класс Product (это класс отображения View)
3. Обработчик события клика, привязанный в Product к элементу карточки товара в галерее, вызывает метод посредника emit, который вызывает обработчик события `product:select`, передавая ему данные - объект конкретного товара, по карточке которого кликнули.
4. Обработчик `product:select`, получая данные, вызывает метод модели setPreview, который вызывает метод посредника emit, который вызывает обработчик события `preview:change` и передает ему данные - объект конкретного товара.
5. В обработчике события `preview:change` выполнение приложения переходит в класс Modal (опять View), который с помощью своих методов отрисовывает модальное окно конкретного товара, получая его данные. 

Событие: клик по кнопке "Купить".
Состояние 1. Открыта карточка товара.
Состояние 2. Открыта корзина с товарами. 
Что происходит с данными: Данные товара (Product) добавляются в массив товаров в корзине (Basket). Пересчитывается общая стоимость выбранных товаров. 
1. Пользователь кликнул по кнопке "Купить" на карточке товара.
2. Действие приложения перешло в класс Product (это класс отображения View).
3. Обработчик события клика, привязанный в Product к товару, открытому в модальном окне, вызывает обработчик события `product:add`, передавая ему данные - объект конкретного товара, который выбрали для покупки.
4. Обработчик `product:add`, получая данные, вызывает метод модели (класса BasketProducts, Model) addProduct, который опять вызывает метод посредника emit, который вызывает обработчик события `basket:change` и передает ему данные - массив товаров в корзине. Также происходит подсчет стоимости выбранных товаро. 
5. В обработчике события `basket:change` выполнение приложения переходит в класс Basket (опять View), который с помощью своих методов отрисовывает модальное окно корзины. На иконке корзины на главной странице обновляется количество выбранных товаров. 

Событие: клик по кнопке удаления товара из Корзины
Состояние 1. Открыта корзина со списком товаров. Отображается суммарная стоимость товаров в корзине. 
Состояние 2. Открыта корзина со списком товаров (минус один товар, по которому кликнул пользователь). Отображается новая суммарная стоимость товаров в корзине. 
Что происходит с данными: Данные товара (Product) убираются из массива товаров (Basket). Пересчитывается общая стоимость выбранных товаров. 
1. Пользователь кликнул по кнопке удаления какого-то товара из Корзины.
2. Действие приложения перешло в класс Product (это класс отображения View)
3. Обработчик события клика, привязанный в Product к элементу карточки товара в корзине, вызывает метод посредника emit, который вызывает обработчик события `product:remove`, передавая ему данные - объект конкретного товара, по кнопке удаления которого кликнули.
4. Обработчик `product:remove`, получая данные, вызвает метод модели removeProduct, который вызывает метод посредника emit, который вызвает обработчик события `basket:change` и передает ему данные - массив товаров в корзине. Также происходит подсчет стоимости выбранных товаров. 
5. В обработчике события `basket:change` выполнение приложения переходит в класс Basket (View), который с помощью своих методов отрисовывает модальное окно корзины. На иконке корзины на главной странице обновляется количество выбранных товаров. 

Событие: клик по корзине на Главной странице
Состояние 1. Открыта главная страница.
Состояние 2. Открыта корзина.
Что происходит с данными: Данные не изменяются. Происходит подсчет суммы стоимости купленных товаров. 
1. Пользователь кликнул на иконку корзины на главной странице.
2. Действие приложения перешло в класс Basket (это класс отображения View)
3. Обработчик события клика, привязанный к Basket, вызывает метод посредника emit, который вызвывает обработчик события `basket:select`, передавая ему данные - массив товаров, находящихся в корзине.
4. Обработчик `basket:select`, получая данные, вызывает метод модели SetPreview, который вызывает метод посредника emit, который вызывает обработчик события `basket:preview`.
5. В обработчике события `basket:preview` выполнение приложения переходит в класс Basket, который с помощью своих методов отрисовывает модальное окно корзины. 

Событие: клик по кнопке "Оформить"
Состояние 1. Открыта корзина.
Состояние 2. Открыто модальное окно способ оплаты и адрес.
Что происходит с данными: Массив товаров Basket перемещается в объект Order.
1. Пользователь кликнул по кнопке "Оформить" в корзине.
2. Действие приложения перешло в класс Basket (это класс отображения View)
3. Обработчик события клика, привязанный в Basket к списку товаров в галерее, вызывает метод посредника emit, который вызывает обработчик события `order:change`, передавая ему данные - массив товаров, находящихся в корзине.
4. Обработчик `order:change`, получая данные, вызывает метод модели SetOrder, который вызывает обработчик события `form:preview`.
5. В обработчике события `form:preview` выполнение приложение переходит в класс Form (опять View), который отрисовывает модальное окно формы заказа. 

Событие: клик по кнопке "Онлайн" или "При получении"
Состояние 1. Открыто модальное окно способ оплаты и адрес, кнопки "Онлайн" и "При получении".
Состояние 2. Активирована кнопка "Онлайн" или "При получении"
ЧТо происходит с данными: Данные проходят вылидацию на уровне браузера, заполняется поле в объекте UserData
1. Пользователь кликнул по кнопке "Онлайн" или "При получении" в форме заказа
2. Действие приложения перешло в класс Form (Это класс отображения View)
3. Обработчик события клика, привязанный в Form к конкретной кнопке, вызывает посредника emit, который вызывает обработчик события `payment:select`, передавая ему данные - поле кнопки, по которой кликнули. 
4. Обработчик `payment:select`, получая данные, вызывает метод модели SetUserData, который вызывает обработчик события `order:payment` и передает ему данные - выбранный способ оплаты.
5. В обработчике `order:payment` выполнение приложения переходит в класс Form (опять View), который делает активной выбранную кнопку. 

Событие: ввод данных в инпут адреса
Состояние 1. Открыто модальное окно способ оплаты и адрес.
Состояние 2 (ошибка). Высвечивается сообщение об ошибке. 
Состояние 2 (успешно). В поле адрес введены данные.
Что происходит с данными: Данные валидируются на уровне браузера 
1. Пользователь ввел данные в поле инпута адреса.
2. Действие приложения перешло в класс Input (Это класс отображения View)
3. Обработчик поля ввода, привязанный в Input к этому полю, вызывает посредника emit, который вызывает обработчик события `address:input`, передавая ему данные, введенные пользователем. 
4. Обработчик `address:input`, получая данные, вызывает метод модели CheckValidation, который проверяет данные на валидность и либо вызывает метод модели SetError, который вызывает обработчик события `validation:error` и передает ему данные об ошибке, либо метод модели SetUserData, который вызывает обработчик события `address:success` и передает ему данные - адрес покупателя.
5. В обработчике `validation:error` выполнение приложения переходит в класс Error (опять view), который отрисовывает сообщение об ошибке.
5. В обработчике `address:success` происходит проверка, заполнены ли оба поля формы. 
 
Событие: Введены данные в инпуты payment и address (Для второой формы та же схема)
Cостояние 1. Активирована кнопка способа оплаты, в поле адрес введены данные. Неактивна кнопка Далее. 
Состояние 2. Активируется кнопка Далее.
Что происходит с данными: Прошла проверка, что в оба инпута введены валидные данные. 
1. Обработчик `form:validaiton` получает данные, что заполнены поля payment и address. 
2. Вызывает метод ActivateButton, который вызывает метод посредника emit, который вызывает обработчик события `button:activate` и передает ему данные - объект кнопки.
3. В обработчике события `button:activate` выполнение приложения переходи в класс Form, который с помощью своих методов отрисовывает активную кнопку Далее.

Событие: клик по кнопке "Далее"
Состояние 1. Открыта форма ввода способа оплаты и адреса.
Состояние 2. Открыта форма ввода почты и телефона. 
Что происходит с даными: Данные payment и address сохраняются в объект Order. 
1. Пользователь кликнул по кнопке "Далее".
2. Действие приложения перешло в класс Form (это класс отображения View).
3. Обработчик события клика, привязанный к кнопке "Далее", вызывает метод посредника emit, который вызывает обработчик события `order:change` и передает ему данные - поля способа оплаты и адреса. 
4. Обработчик `order:change` получает данные и сохраняет их в объект Order, вызывает метод модели openForm, который вызывает метод посредника emit, который вызывает обработчик события `form:open`, передавая ему данные - объект формы, которую необходимо открыть. 
4. В обработчике события `form:open` выполнение приложения переходит в класс Form, который с помощью своих методов отрисовывает модальное окно формы ввода почты и телефона. 

Событие: ввод данных в инпут "Email" 
Состояние 1. Открыта форма ввода почты и телефона. 
Состояние 2. Высвечивается сообщение об ошибке.
Состояние 2. Поле ввода почты заполнено.
Что происходит с данными: данные проходят валидацию на уровне браузера
1. Пользователь ввел данные в поле инпута email.
2. Действие приложения перешло в класс Input.
3. Обработчик поля ввода, привязанный в Input к этому полю, вызывает посредника emit, который вызывает обработчик события `email:input`, передавая ему даные, введенные пользователем.
4. Обработчик `email:input`, получая данные, вызывает метод модели CheckValidation, который проверяет данные на валидность и либо вызывает метод SetError, который вызывает обработчик события `validation:error` и передает ему данные об ошибке, либо метод модели SetUserData, который вызывает обработчик события `email:success` и передает ему данные - email покупателя.
5. В обработчике `validation:error` выполнение приложения переходит в класс Error (опять View), который отрисовывает сообщение об ошибке.
5. В обработчике `email:success` происходит проверка, заполнены ли оба поля формы.  

Событие: ввод данных в инпут телефон
Состояние 1. Открыто модальное окно почта и телефон.
Состояние 2. Высвечивается сообщение об ошибке. 
Состояние 2. В поле телефон введены данные.
Что происходит с данными: Данные проходят валидацию на уровне браузера
1. Пользователь ввел данные в поле инпута телефон.
2. Действие приложения перешло в класс Form (Это класс отображения View)
3. Обработчик поля ввода, привязанный в Form к этому полю, вызывает посредника emit, который вызывает обработчик события `phone:input`, передавая ему данные, введенные пользователем. 
4. Обработчик `phone:input`, получая данные, вызывает метод модели CheckValidation, который проверяет данные на валидность и либо вызывает метод модели SetError, который вызывает обработчик события `validation:error` и передает ему данные об ошибке, либо метод модели SetInput, который вызывает обработчик события `phone:success` и передает ему данные - телефон покупателя.
5. В обработчике `validation:error` выполнение приложения переходит в класс Error (опять view), который отрисовывает сообщение об ошибке.
5. В обработчике `phone:succuss` происходит проверка, заполнены ли оба поля формы. 

Событие: в объекте Order заполнены данные email и phone.
Cостояние 1. В полях формы введены данные. Неактивна кнопка Оплатить.
Состояние 2. Активируется кнопка Оплатить.
Что происходит с данными: Происходит валидация данных, что в объекте Order заполнены все поля. 
1. Обработчик `form:validaiton` получает данные, что заполнены все поля.
2. Вызывает метод ActivateButton, который вызывает метод посредника emit, который вызывает обработчик события `button:activate` и передает ему данные - объект кнопки.
3. В обработчике события `button:activate` выполнение приложения переходи в класс Form, который с помощью своих методов отрисовывает активную кнопку Оплатить. 

Событие: клик на кнопку Оплатить.
Состояние 1. Открыта форма ввода почты телефона, кнопка Оплатить активна.
Состояние 2. Открыто модальное окно Заказ оформлен.
Что происходит с данными: Подсчитывается стоимость заказа. На сервер отправляется объект заказа Order. C сервера приходит подтверждение об успешном выполнении заказа. 
1. Пользователь кликает на кнопку "Оплатить". 
2. Действие приложения происходит в класс Form (это класс отображения), вызывает обработчик события `order:submit`.
3. Oбработчик события `order:submit` вызывает метод модели SendOrder, который отправляет заказ на сервер, получает данные с сервера, вызывает обработчик события `order:success` и передает ему данные, пришедшие с сервера.
4. Обработчик события `order:success` переводит выполнение приложения в класс Modal, который отрисовывает модальное окно Заказ оформлен. 

 

__________________________________________________________________

#### Черновик

Что можно делать с данными товара:
1. Мы получаем с сервера массив объектов товара с набором данных.
2. Для каждого объекта мы рисуем карточку товара на главной странице, отображая часть данных.
3. При клике на карточку товара мы рисуем попап товара, отображая все данные. 
4. При клике на кнопку "В корзину" мы добавляем объект в массив заказанных товаров. 
5. Мы можем удалать товар из корзины. 

Что может делать функция-колбэк:
- открыть попап с карточкой товара 
- добавить товар в массив заказанных товаров 

Что можно делать с данными заказа:
1. Валидировать их
2. Отправлять на сервер

Что можно сделать с корзиной?
1. Мы кладем туда товары (== создаем массив товаров для заказа).
2. Мы рисуем модальное окно Корзина (== отображаем список товаров в массиве. Каждый товар имеет набор данных).
3. Мы суммируем стоимость всех заказанных товаров.
4. Мы можем удалять товары из массива. Общая стоимость должна меняться.
5. Мы можем подтвердить оформление заказа (== кнопка "Оформить" становится активной).
6. Мы можем проверить наличие товара в массиве (кнопка "Оформить" не становится активной).
7. Мы можем закрыть корзину. 

Что можно сделать с формой:
1. Мы рисуем модальное окно формы.
2. Внести данные в инпуты.
3. Валидировать данные. 
4. Активировать кнопку в случае верных данных.
2. Мы можем закрыть форму без сохранения данных.

Обработчик будет
1. Получать данные из формы.
2. Добавляет данные в объект данных заказа.
3. При сабмите последней формы - отправлять данные заказа на сервер и получать список id заказанных товаров, а также суммарную стоимость. 

Пользовательские сценарии

1. Получить данные товаров с сервера
2. Отобразить товары, используя данные, полученные с сервера

Компоненты

- Главная страница => Карточки товаров на главной странице
- Главная страница => Значок корзины с количеством выбранных товаров
- Модальное окно с подробной информацией о товаре
- Модальное окно Корзина => cтроки с информацией о товарах
- Модальное окно с формой способ оплаты + адрес доставки
- Модальное окно с формой почта + телефон
- Модальное окно подтверждение оформления заказа (есть данные об общей стоимости товара)

Заказ - создается пустой объект, который мы заполняем данными, которые вводим в форму

Класс создает объект товара. 
Класс отвечает за работу с данными товара и отображение карточек.\
Конструктор класса принимает инстант брокера событий.\




Вот пример абстрактного класса `Component` и двух классов, которые его наследуют:

```typescript
abstract class Component {
  protected readonly element: HTMLElement; // элемент, с которым работает компонент

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public abstract render(): void; // метод, который должен быть переопределён в наследниках

  // общие методы для всех компонентов
  public show(): void {
    console.log('Компонент:', this.element);
  }

  public hide(): void {
    this.element.style.display = 'none';
  }
}

class Button extends Component {
  private text: string;

  constructor(text: string, element: HTMLElement) {
    super(element);
    this.text = text;
  }

  public render() {
    this.element.textContent = this.text;
  }
}

const button = new Button('Нажми меня', document.createElement('button'));
button.render();
button.show(); // Нажми меня

class TextBox extends Component {
  private placeholder: string;

  constructor(placeholder: string, element: HTMLElement) {
    super(element);
    this.placeholder = placeholder;
  }

  public render() {
    this.element.setAttribute('placeholder', this.placeholder);
  }
}

const textBox = new TextBox('Введите текст', document.createElement('input'));
textBox.render();
textBox.show();
```

В этом примере класс `Component` содержит защищённое свойство `element`, которое является элементом, с которым будет работать компонент. Также класс содержит метод `render()`, который должен быть реализован в каждом классе-наследнике.

Класс `Button` наследуется от `Component` и реализует метод `render()` так, чтобы он устанавливал текст кнопки. Класс `TextBox` также наследуется от `Component`, но устанавливает атрибут `placeholder` элемента `<input>`.