import './scss/styles.scss';
import { EventEmitter } from './components/base/events'; // брокер событий
import { ProductData } from './components/ProductData'; // данные - массив товаров
import { Payment } from './components/Payment'; // отображение - внутрянка первой формы
import { Contacts } from './components/Contacts'; // отображение - внутрянка первой формы
import { Success } from './components/Success'; // отображение - окошко заказ выполнен успешно 

import { OrderData } from './components/OrderData'; // данные - массив товаров в корзине

import { Modal } from './components/Modal'; // отображение - модальное окно 

import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { IApi } from './types';
import { IPaymentForm, IContactsForm } from './types';

import { Page } from './components/Page'; // отображение - одна карточка

import { Card } from './components/Card'; // отображение - одна карточка
import { CardsContainer } from './components/CardsContainer'; // отображение - контейнер с карточками 
import { BasketCounter } from './components/BasketCounter'; // отображение - цифра на корзинке
import { Basket } from './components/Basket'; // отображение - открытая корзина 
//import { FormPayment } from './components/FormPayment'; // отображение - открытая первая форма
//import { FormContacts } from './components/FormContacts'; // отображение - открытая вторая форма

import { cloneTemplate, ensureElement } from './utils/utils';
import { settings } from './utils/constants';
import { API_URL } from './utils/constants';


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
    console.log(data.items);
    events.emit('products:loaded'); // сгенерировали событие
  })
  .catch((err) => {
    console.error(err);
  });


// ---------------- Глобальные контейнеры и шаблоны ---------------- //


const cardTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-catalog'); // шаблон карточки в каталоге на главной странице

const cardModalTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-preview'); // шаблон карточки в превью

const galleryContainer = new CardsContainer(
  ensureElement<HTMLTemplateElement>('.gallery'), events
); // контейнер галерея карточек на главной странице

const orderData = new OrderData(events); //данные товара попадают сразу в заказ в корзине
orderData.basket = []; // инициируем пустой массив для будущих товаров

//const page = ensureElement<HTMLTemplateElement>('.page');
const page = new Page(document.body, events);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#basket'); // это клон темплейта всей корзины

const basket = new Basket(cloneTemplate(basketTemplate), events); // Это экземпляр класса  Basket, с его помощью будем отображать список товаров корзины, кнопку оформить и общую сумму

const cardBasketTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-basket');  // шаблон карточки внутри корзины  

const basketCounter = new BasketCounter(ensureElement<HTMLTemplateElement>('.header__basket'), events);

const paymentFormTemplate: HTMLTemplateElement =
ensureElement<HTMLTemplateElement>('#order'); 
  // шаблон первой формы способ оплаты и адрес доставки

const payments = new Payment(cloneTemplate(paymentFormTemplate), events);

const contactsFormTemplate: HTMLTemplateElement =
ensureElement<HTMLTemplateElement>('#contacts'); 
  // шаблон первой формы способ оплаты и адрес доставки

const contacts = new Contacts(cloneTemplate(contactsFormTemplate), events);

const successTemplate: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#success'); 



// Пользователь обновил страницу, данные товаров загрузились, отображаем их на странице

events.on('products:loaded', () => {
  const cardsArray = productData.products.map((card) => {
    const cardInstant = new Card(cloneTemplate(cardTemplate), events);
    return cardInstant.render(card);
  });

  galleryContainer.render({ catalog: cardsArray });
});


// Пользователь кликнул на карточку товара на главной странице. 

events.on('card:open', (data: { card: Card }) => {
    const { card } = data;
    const productModalData = productData.getProduct(card.id);   
    const cardModal = new Card(cloneTemplate(cardModalTemplate), events);

    // Проверяем, содержится ли товар в массиве заказанных

    const orderedProducts = orderData.getProducts();
    const isOrdered = orderedProducts.some(orderedProduct => orderedProduct.id === productModalData.id);

    cardModal.ordered = isOrdered; // Устанавливаем значение, что товар заказан

    modal.render({
        content: cardModal.render(productModalData)
    });
});


// Пользователь кликнул на корзинку на главной странице

events.on('basket:open', () => { 


  basket.items = orderData.basket.map((card, index) => {
  const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);
  cardBasket.index = index + 1; 
 
  return cardBasket.render(card);
 
});

  const basketTotal = orderData.totalPrice();
  basket.total = basketTotal;  

  // получили сумму заказанных товаров, которая будет присвоена total в классе Basket

modal.render({ // отображаем содержимое в модальном окне
  content: basket.render()  
})
})


// Пользователь нажал на кнопку "В корзину"

events.on('product:add', (data: { card: Card }) => {
  const { card } = data; 
  const basketItemData = productData.getProduct(card.id);

  orderData.addProduct(basketItemData); // обновленный массив данных корзины  

  modal.close();
  basketCounter.counter = orderData.getTotal();    

});


// Пользователь кликнул на значок удаления товара из корзины. 

events.on('product:delete', (data: { card: Card }) => {

  const { card } = data; 
  const basketItemData = productData.getProduct(card.id); //??? должно быть basketData???

  orderData.deleteProduct(basketItemData.id); // обновленный массив данных корзины  
  
  basketCounter.counter = orderData.getTotal(); 

});


// Обновился массив данных в корзине, обновляем значение счетчика на корзинке

events.on('basket:changed', () => { 
  // обновляем значение счётчика при изменении данных корзины
  basketCounter.counter = orderData.getTotal(); 
});


events.on('order:make', () => {
  console.log('ниже товары корзины'); 
 // console.log(basketData.products);
}
)

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
  orderData.setPaymentField(data.field, data.value);
});


// Изменилось состояние валидации формы

events.on('formErrors:change', (errors: Partial<IPaymentForm>) => {
  const { payment, address } = errors;
  payments.valid = !payment && !address;
  payments.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});


// Пользователь кликнул на кнопку Далее

events.on('formPayment:submit', (data) => {
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
  orderData.setContactsField(data.field, data.value);
});


// Изменилось состояние валидации формы

events.on('formErrors:change', (errors: Partial<IContactsForm>) => {
  const { phone, email } = errors;
  contacts.valid = !phone && !email;
  contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});



events.on('order:send', () => {
  
  const orderToSend = orderData.getOrder();

  api.postOrder(orderToSend)
  .then((result) => { 

    // Выполняем действия перед созданием экземпляра Success
    orderData.clearOrder();
    events.emit('order:sent');                
    basketCounter.counter = 0;

    // Создаем экземпляр класса Success
    const success = new Success(cloneTemplate(successTemplate), {
      onClick: () => {
        console.log('что происходит в onClick ');
        modal.close();
      }
    });

    // Рендерим модальное окно
    modal.render({
      content: success.render({
        total: orderToSend.total
      })
    });
  })
  .catch(err => {
    console.error(err);
  });
});


// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});





// ---------- Господи, неужели все ---------- //