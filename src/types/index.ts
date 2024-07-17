export interface IProduct { // Это объект - Товар, который мы получаем с сервера
    // Мы не можем редактировать эти данные
    // Мы можем отображать товар, используя эти данные
        id: string;
        description: string;
        image: string;
        title: string;
        category: string;
        price: number;
    }
    
    
    export interface IOrder { // это объект - Заказ, изначально он пустой
        payment: string;
        email: string;
        phone: string;
        address: string;
        total: IProductOrderPrice[];
        items: IProductData; // это массив карточек, добавленных в корзинку
        addOrderData() // добавляем данные в объект заказа
        getTotal( IProductOrderPrice[] ): // получаем сумму заказанных товаров
        setOrder(): // тут собираем все данные для отправления заказа на сервер
        getOrder(): // метод возвращает данные, полученные с сервера после успешной отправки заказа
        checkValidation(data: Record<keyof IOrderFormData, string>): boolean;
    }
     
    // Коллекция, каталог товаров
    export interface IProductData { // это данные товаров и действия, которые мы можем с ними выполнять
        products: IProduct[];
        preview: string | null; // указатель на тот товар, который мы хотим посмотреть 
        addProduct(product: IProduct): void;
        deleteProduct(productId: string, payload: Function | null): void;
        getProduct(productId: string): IProduct;
    }
    
    export type IProductMainPage = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>
    
    export type IProductPopup = Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'>
    
    export type IProductToAdd = Pick<IProduct, 'id' | 'title' | 'price' >
     
    export type IProductOrderPrice = Pick<IProduct, 'price'> // Здесь должна быть цена выбранного товара
    
    export type IOrderFormData = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'> // Данные, вводимые в формы при оформлении заказа
    
    export type IOrderProducts = Pick<IOrder, 'items'> // Список товаров, добавленных в корзину
    
    