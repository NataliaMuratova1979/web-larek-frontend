export interface IProduct { // Это объект - Товар, который мы получаем с сервера
        id: string;
        description: string;
        image: string;
        title: string;
        category: string;
        price: number;
        ordered?: boolean;
        blocked?: boolean;
}

export interface IData {
    total: number;
    items: IProduct[]
}

    // Коллекция, каталог товаров
export interface IProductsData { // это данные товаров и действия, которые мы можем с ними выполнять
    products: IProduct[];
    preview: string | null; // указатель на тот товар, который мы хотим посмотреть       
    getProduct(productId: string): void;
    addProduct(product: IProduct): void;
    deleteProduct(productId: string, payload: Function | null): void; 
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data: object, method?: ApiPostMethods): Promise<T>;
}





//export type IProductCard = Pick<IProductServerData, 'id' | 'image'| 'title' | 'category' | 'price' | 'description'>




/*
export interface IToDoServerData {
    id: number;
    title: string;
    completed: boolean;
    userId: number;
  }

export type IToDoItem = Pick<IToDoServerData, 'id' | 'title' | 'completed'>
*/




export interface IBasket {
    items: IProduct[]; 
    preview: string | null; // указатель на тот товар, который мы хотим посмотреть 
    total: IProductOrderPrice[];
    addProduct(product: IProduct): void;
    deleteProduct(productId: string, payload: Function | null): void;
    getProduct(productId: string): IProduct;
   // getTotal( IProductOrderPrice[] ): // получаем сумму заказанных товаров
}

export interface IUserContacts {
    payment: "Онлайн" | "При получении";
    address: string;
   // addData() // добавляем данные в объект заказа
   // checkValidation(data: Record<keyof IOrderFormData, string>): boolean;
}

export interface IUserPayment {
    email: string;
    phone: string;
   // addData() // добавляем данные в объект заказа
   // checkValidation(data: Record<keyof IOrderFormData, string>): boolean;
}

export interface IUserData {
    email: string;
    phone: string;
   // addData() // добавляем данные в объект заказа
   // checkValidation(data: Record<keyof IOrderFormData, string>): boolean;
}




/*
export interface IOrder { // это объект - Заказ, изначально он пустой
    data: IUserData;

    items: IBasket; // это массив карточек, добавленных в корзинку
   // setOrder(): // тут собираем все данные для отправления заказа на сервер
   // getOrder(): // метод возвращает данные, полученные с сервера после успешной отправки заказа
}
   */  

    
    export type IProductMainPage = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>
    
    export type IProductPopup = Pick<IProduct, 'image' | 'title' | 'category' | 'price' | 'description'>
    
    export type IProductToAdd = Pick<IProduct, 'id' | 'title' | 'price' >
     
    export type IProductOrderPrice = Pick<IProduct, 'price'> // Здесь должна быть цена выбранного товара
    
   // export type IOrderFormData = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'> // Данные, вводимые в формы при оформлении заказа
    
    //export type IOrderProducts = Pick<IOrder, 'items'> // Список товаров, добавленных в корзину
    
    