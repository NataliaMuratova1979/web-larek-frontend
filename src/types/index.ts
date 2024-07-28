export interface IProductServerData { // Это объект - Товар, который мы получаем с сервера
    // Мы можем отображать товар, используя эти данные
        id: string;
        description: string;
        image: string;
        title: string;
        category: string;
        price: number;
}

export interface IProduct extends IProductServerData {
    ordered?: boolean;
}

export interface IBasket {
    items: IProduct[]; 
    preview: string | null; // указатель на тот товар, который мы хотим посмотреть 
    total: IProductOrderPrice[];
    addProduct(product: IProduct): void;
    deleteProduct(productId: string, payload: Function | null): void;
    getProduct(productId: string): IProduct;
   // getTotal( IProductOrderPrice[] ): // получаем сумму заказанных товаров
}

export interface IUserData {
    payment: string;
    email: string;
    phone: string;
    address: string;
   // addData() // добавляем данные в объект заказа
   // checkValidation(data: Record<keyof IOrderFormData, string>): boolean;
}

export interface IOrder { // это объект - Заказ, изначально он пустой
    data: IUserData;
    items: IBasket; // это массив карточек, добавленных в корзинку
   // setOrder(): // тут собираем все данные для отправления заказа на сервер
   // getOrder(): // метод возвращает данные, полученные с сервера после успешной отправки заказа
}
     
    // Коллекция, каталог товаров
export interface IProductData { // это данные товаров и действия, которые мы можем с ними выполнять
    products: IProduct[];
    preview: string | null; // указатель на тот товар, который мы хотим посмотреть       
    getProduct(productId: string): IProduct;
}
    
    export type IProductMainPage = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>
    
    export type IProductPopup = Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'>
    
    export type IProductToAdd = Pick<IProduct, 'id' | 'title' | 'price' >
     
    export type IProductOrderPrice = Pick<IProduct, 'price'> // Здесь должна быть цена выбранного товара
    
   // export type IOrderFormData = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'> // Данные, вводимые в формы при оформлении заказа
    
    export type IOrderProducts = Pick<IOrder, 'items'> // Список товаров, добавленных в корзину
    
    