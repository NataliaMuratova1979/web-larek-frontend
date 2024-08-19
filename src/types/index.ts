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

export interface IData { // используется в AppApi
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

export interface IPaymentForm {
    address: string;
    payment: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface IBasket {
    items: IProduct[]; 
    preview: string | null; // указатель на тот товар, который мы хотим посмотреть 
    //total: IProductOrderPrice[];
    addProduct(product: IProduct): void;
    deleteProduct(productId: string, payload: Function | null): void;
    getProduct(productId: string): IProduct;
   // getTotal( IProductOrderPrice[] ): // получаем сумму заказанных товаров
}

export interface IUserPayment {
    payment: string;
    address: string;
   // addData() // добавляем данные в объект заказа
   // checkValidation(data: Record<keyof IOrderFormData, string>): boolean;
}

export interface IUserContacts  {
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


export interface IUserPayment { // это мы получаем из первой формы
    address: string;
    payment: string;
}

export interface IUser extends IUserPayment {
    email: string;
    phone: string;
}

export type FormErrors = Partial<Record<keyof IUser, string>>;


export interface IOrderData { // это данные товаров и действия, которые мы можем с ними выполнять
    basket: IProduct[];
    userContacts: IUserContacts;
    userPayment: IUserPayment;
    //getProduct(productId: string): void;
    //addProduct(product: IProduct): void;
    //deleteProduct(productId: string, payload: Function | null): void;
}

export interface IOrderSendData { // данные заказа, сформированные для отправки на сервер.
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}


export interface IResponse { // это данные, получаемые с сервера после успешной отправки заказа 
    id: string;
    total: number;
}

