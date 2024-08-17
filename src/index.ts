import './scss/styles.scss';
import { EventEmitter } from './components/base/events'; // брокер событий
import { ProductData } from './components/ProductData'; // данные - массив товаров
import { Payment } from './components/Payment'; // отображение - внутрянка первой формы
import { Contacts } from './components/Contacts'; // отображение - внутрянка первой формы



import { OrderData } from './components/OrderData'; // данные - массив товаров в корзине
//import { UserContactsData } from './components/UserContactsData'; // данные, полученные из второй формы
//import { UserPaymentData } from './components/UserPaymentData'; // данные, полученный из первой формы

import { Modal } from './components/Modal'; // отображение - модальное окно 

import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { IApi } from './types';
import { IPaymentForm, IContactsForm } from './types';


import { Page } from './components/Page';
import { Card } from './components/Card'; // отображение - одна карточка
import { CardsContainer } from './components/CardsContainer'; // отображение - контейнер с карточками 
import { BasketCounter } from './components/BasketCounter'; // отображение - цифра на корзинке
import { Basket } from './components/Basket'; // отображение - открытая корзина 
//import { FormPayment } from './components/FormPayment'; // отображение - открытая первая форма
//import { FormContacts } from './components/FormContacts'; // отображение - открытая вторая форма



import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductsContainer } from './components/ProductsContainer';
import { settings } from './utils/constants';
import { API_URL } from './utils/constants';
import { productExamples } from './utils/tempConstants'; 
import { FormPayment } from './components/FormPayment';


const events = new EventEmitter();
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

events.onAll((event) => {
    console.log(event.eventName, event.data)
})

const productData = new ProductData(events); //это экземпляр класса, который содержит массив товаров, а также позволяет совершать действия с ними. Мы будем использовать его для хранения данных товаров, загруженных с сервера 

// ------------------ Получаем карточки с сервера ------------------ //
const promise = api.getProducts();

promise
  .then((data) => {
    productData.products = data.items;
    events.emit('products:loaded'); // сгенерировали событие
  })
  .catch((err) => {
    console.error(err);
  });


const cardTemplate: HTMLTemplateElement = document.querySelector('#card-catalog'); // шаблон карточки в каталоге на главной странице

const cardModalTemplate: HTMLTemplateElement = document.querySelector('#card-preview'); // шаблон карточки в превью

const galleryContainer = new CardsContainer(
  document.querySelector('.gallery'), events
); // контейнер галерея карточек на главной странице


// Пользователь обновил страницу, данные товаров загрузились, отображаем их на странице

events.on('products:loaded', () => {
  const cardsArray = productData.products.map((card) => {
    const cardInstant = new Card(cloneTemplate(cardTemplate), events);
    return cardInstant.render(card);
  });

  galleryContainer.render({ catalog: cardsArray });
});

// Глобальные контейнеры
const page = document.querySelector('.page');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


// Пользователь кликнул на карточку товара на главной странице. 
// В модальном окне отрисовывается превью карточки. 

events.on('card:open', (data: { card: Card }) => {
  const { card } = data;
  const productModalData = productData.getProduct(card.id);   
  const cardModal = new Card(cloneTemplate(cardModalTemplate), events); 

  // нужно проверить, содержится ли productModalData в массиве заказанных товаров
  // если содержно присвоить значение cardModal.ordered true
  // в этом случае не должна отрисовываться кнопка "В корзину"

  modal.render({
    content: cardModal.render(productModalData)
  })
});

//  ----------------- OrderData - класс данных заказа ---------------------- //

const orderData = new OrderData(events); //данные товара попадают сразу в заказ в корзине
orderData.basket = []; // инициируем пустой массив для будущих товаров


// Пользователь нажал на кнопку "В корзину"
// обновляем массив данных товаров в заказе 
// закрываем модальное окно 

events.on('product:add', (data: { card: Card }) => {
  const { card } = data; 
  const basketItemData = productData.getProduct(card.id);

  orderData.addProduct(basketItemData); // обновленный массив данных корзины  
  console.log('обновился массив товаров в заказе', orderData.basket );

  modal.close();
});

// Обновился массив данных в корзине, обновляем значение счетчика на корзинке
// Каждый товар в корзинке должен получить актуальный индекс


const basketCounter = new BasketCounter(document.querySelector('.header__basket'), events);

events.on('basket:changed', () => { 
  // обновляем значение счётчика при изменении данных корзины
  basketCounter.counter = orderData.getTotal(); 
});




/*
- Пользователь кликнул на значок корзины на главной странице. 
- Надо отрисовать модальное окно с содержимым. Событие basket:open прописано в файле Page.ts
- Пользователь удалил товар из корзинки. Надо заново отрисовать модальное окно с содержимым. 
- Надо присвоить каждому cardBasket индекс, взяв его из basketData.products 
 Надо посчитать сумму всех товаров в корзине
*/

const basketTemplate: HTMLTemplateElement = document.querySelector('#basket'); // это клон темплейта всей корзины

const basket = new Basket(cloneTemplate(basketTemplate), events); // Это экземпляр класса  Basket, с его помощью будем отображать список товаров корзины, кнопку оформить и общую сумму

const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');  // шаблон карточки внутри корзины  



events.on('basket:open', () => { 
  // каждая карточка - клонируем шаблон <template id="card-basket">
  // basket вмещает в себя контейнер для карточек, общую сумму и кнопку
  // внутри modal рендерится basket (клонируем шаблон <template id="basket">)

  basket.items = orderData.basket.map((card, index) => {
  const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);
  cardBasket.index = index + 1; 
 
  return cardBasket.render(card);
  // получили каждую карточку
  // получили индекс каждой карточки 
  // получили массив карточек basketCardsArray, который будет массивом items[] в классе Basket
});

  const basketTotal = orderData.totalPrice(orderData.basket);
  basket.total = basketTotal;  
  console.log('Сумма покупки', basketTotal);



  // получили сумму заказанных товаров, которая будет присвоена total в классе Basket

modal.render({ // отображаем содержимое в модальном окне
  content: basket.render()  
})
})


// Пользователь кликнул на значок удаления товара из корзины. 
// В классе Card срабатывает событие product:delete. 
// В классе BasketData вызывается метод deleteProduct, после отработки которого возникает событие basket:open, которое заново отрисует модальное окно с товарами корзины

events.on('product:delete', (data: { card: Card }) => {

  const { card } = data; 
  const basketItemData = productData.getProduct(card.id); //??? должно быть basketData???

  orderData.deleteProduct(basketItemData.id); // обновленный массив данных корзины  

});


//const order = new OrderData(events); // срздаем экземпляр класса данных для заказа 
//order.basket = []; // инициируем массив для товаров

// Пользователь нажал на кнопку оформить в корзине
// Сработало событие order:make 
// Нам необходимо добавить товары в заказ OrderData  
// После изменения данных откроется форма 

events.on('order:make', () => {
  console.log('ниже товары корзины'); 
 // console.log(basketData.products);
  const orderedProducts = orderData.getProducts;
  console.log(orderedProducts);
  //order.basket = basketData.products;
  console.log('ниже товары заказа'); 
  console.log(orderData.basket);
  console.log('выщше товары заказа'); 

}
)

// В классе OrderData сработало событие 'formPayment:open'
// Необходимо отрисовать форму заполнения данных 
// Создаем класс отображения formPayment
// После заполнения данные попадут в класс UserPaymentData


// Открыть первую форму заказа formPayment

const paymentFormTemplate: HTMLTemplateElement =
	document.querySelector('#order'); 
  // шаблон первой формы способ оплаты и адрес доставки
console.log(paymentFormTemplate);

const payments = new Payment(cloneTemplate(paymentFormTemplate), events);

// открыть первую форму 
events.on('formPayment:open', () => {
  modal.render({
    content: payments.render({
      address: '',
      payment: '',
      valid: false,
      errors: []
    })
  });
});

// Изменилось одно из полей. событие происходит в файле FormPayment
events.on(/^order\..*?:change$/, (data: { field: keyof IPaymentForm, value: string }) => {
  console.log('изменилось одно из полей');
  orderData.setPaymentField(data.field, data.value);
  console.log(data);
});


// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IPaymentForm>) => {
  const { payment, address } = errors;
  payments.valid = !payment && !address;
  payments.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});


// Пользователь кликнул на кнопку Далее
// Произошло событие formPayment:submit (в классе FormPayment)
// Открывается форма FormContacts


// Открыть первую форму заказа formPayment

const contactsFormTemplate: HTMLTemplateElement =
	document.querySelector('#contacts'); 
  // шаблон первой формы способ оплаты и адрес доставки
console.log(contactsFormTemplate);

const contacts = new Contacts(cloneTemplate(contactsFormTemplate), events);


events.on('formPayment:submit', (data) => {
   console.log('пора открывать вторую форму');
   modal.render({
    content: contacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: []
    })
  });
});


// Изменилось одно из полей. событие происходит в файле FormContacts
events.on(/^contacts\..*?:change$/, (data: { field: keyof IContactsForm, value: string }) => {
  console.log('изменилось одно из полей');
  orderData.setContactsField(data.field, data.value);
  console.log(data);
});


// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IContactsForm>) => {
  const { phone, email } = errors;
  contacts.valid = !phone && !email;
  contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on('order:submit', () => {
  console.log('пора отправлять заказ');
  const orderDetails = orderData.getOrder(); // Вызов функции getOrder
  console.log(orderDetails); // Вывод результата в консоль
});

























/*
events.on('products:loaded', () => {
  const cardsArray = productData.products.map((card) => {
    const cardInstant = new Card(cloneTemplate(cardTemplate), events);
    return cardInstant.render(card);
  });

  galleryContainer.render({ catalog: cardsArray });
});

*/








//КОРЗИНА

/*
const basketContainer = new CardsContainer(
document.querySelector('.basket__list')
);

const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');  // шаблон карточки внутри корзины  
*/
  




/*
events.on('card:select', (data: { card: Card }) => {
	const { card } = data;
	const {name, link} = cardsData.getCard(card._id);
	const image = {name, link}
	imageModal.render({image})
});
*/


/*events.on('basket:open', () => { // здесь надо рендерить basketContainer
  //рендерим карточки <template id="card-basket"> внутри <ul class="basket__list"></ul>
  // рендерим <ul class="basket__list"></ul> внутри <template id="basket">
  // рендерим <template id="basket"> внутри modal 

  const basketCardsArray = basketData.products.map((card, index) => {
  const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);

  cardBasket.index = index + 1; 
  
  return cardBasket.render(card);
});

  const basketTotal = basketData.totalPrice(basketData.products);
  console.log(basketTotal);
  console.log("Выше сумма заказанных товаров"); 

modal.render({

  content: basketContainer.render({ 
    catalog: basketCardsArray,
    //totalBasket: 
    //button: 
  })
})

});
*/



