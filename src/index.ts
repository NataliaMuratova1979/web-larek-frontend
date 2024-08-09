import './scss/styles.scss';
import { EventEmitter } from './components/base/events'; // брокер событий
import { ProductData } from './components/ProductData'; // данные - массив товаров
import { BasketData } from './components/BasketData'; // данные - массив товаров в корзине

import { IProduct, IProductsData } from "././types";


import { Modal } from './components/Modal'; // отображение - модальное окно 

import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { IApi } from './types';

import { Page } from './components/Page';
import { Card } from './components/Card'; // отображение - одна карточка
import { CardsContainer } from './components/CardsContainer'; // отображение - контейнер с карточками 
import { BasketCounter } from './components/BasketCounter'; // отображение - цифра на корзинке
import { Basket } from './components/Basket'; // отображение - открытая корзина 


import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductsContainer } from './components/ProductsContainer';
import { settings } from './utils/constants';
import { API_URL } from './utils/constants';
import { productExamples } from './utils/tempConstants'; 


const events = new EventEmitter();
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

events.onAll((event) => {
    console.log(event.eventName, event.data)
})

const productData = new ProductData(events); //это экземпляр класса, который содержит массив товаров, а также позволяет совершать действия с ними. Мы будем использовать его для хранения данных товаров, загруженных с сервера 

// Получаем карточки с сервера
const promise = api.getProducts();

promise
  .then((data) => {
    productData.products = data.items;
    events.emit('products:loaded'); // сгенерировали событие
  })
  .catch((err) => {
    console.error(err);
  });


const cardTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog'); // шаблон карточки в каталоге на главной странице

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
const basketCounter = new BasketCounter(document.querySelector('.header__basket'), events);


// Пользователь кликнул на карточку товара на главной странице. В модальном окне отрисовывается превью карточки. 

events.on('card:open', (data: { card: Card }) => {
  const { card } = data; 
 //console.log(card);
  //console.log(card.id);
  const productModalData = productData.getProduct(card.id);
  //console.log(productModalData);
  //console.log(productModalData.description); 
  
   
  const cardModal = new Card(cloneTemplate(cardModalTemplate), events); 
  //console.log(cardModal);

  modal.render({
    content: cardModal.render(productModalData)
  })
});


const basketData = new BasketData(events); //данные товаров в корзине
basketData.products = [];

// Пользователь добавил товар в корзину, обновляем массив данных товаров в корзине

events.on('product:add', (data: { card: Card }) => {
  const { card } = data; 
  const basketItemData = productData.getProduct(card.id);

  basketData.addProduct(basketItemData); // обновленный массив данных корзины  

});



// Обновился массив данных в корзине, обновляем значение счетчика на корзинке
// Каждый товар в корзинке должен получить актуальный индекс

events.on('basket:changed', () => { // обновляем значение счётчика при изменении данных корзины
  const total = basketData.getTotal(); 
  basketCounter.counter = basketData.getTotal();
  console.log(basketData);  
  console.log(basketData.products);

});


// Пользователь кликнул на значок корзины на главной странице. 
// Надо отрисовать модальное окно с содержимым. Событие basket:open прописано в файле Page.ts
// Пользователь удалил товар из корзинки. Надо заново отрисовать модальное окно с содержимым. 
// Надо присвоить каждому cardBasket индекс, взяв его из basketData.products 
// Надо посчитать сумму всех товаров в корзине

const basketTemplate: HTMLTemplateElement = document.querySelector('#basket'); // это клон темплейта всей корзины

const basket = new Basket(cloneTemplate(basketTemplate), events); // Это экземпляр класса  Basket, с его помощью будем отображать список товаров корзины, кнопку оформить и общую сумму

const basketContainer = new CardsContainer(
  document.querySelector('.basket__list'), events // это контейнер для карточек
); // этот контейнер нам не пригодится 
  
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');  // шаблон карточки внутри корзины  



events.on('basket:open', () => { 
  // каждая карточка - клонируем шаблон <template id="card-basket">
  // basket вмещает в себя контейнер для карточек, общую сумму и кнопку
  // внутри modal рендерится basket (клонируем шаблон <template id="basket">)

  basket.items = basketData.products.map((card, index) => {
  const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);
  cardBasket.index = index + 1; 
  return cardBasket.render(card);
  // получили каждую карточку
  // получили индекс каждой карточки 
  // получили массив карточек basketCardsArray, который будет массивом items[] в классе Basket
});

console.log('ниже массив карточек для корзины');
console.log(basket.items);

  const basketTotal = basketData.totalPrice(basketData.products);
  basket.total = basketTotal;

  console.log("ниже сумма заказанных товаров"); 
  console.log(basketTotal);
  // получили сумму заказанных товаров, которая будет присвоена total в классе Basket

modal.render({ // отображаем содержимое в модальном окне
  content: basket.render()  
})
})


//Пользователь кликнул на значок удаления товара из корзины. В классе Card срабатывает событие product:delete. В классе BasketData вызывается метод deleteProduct, после отработки которого возникате событие basket:open, которое заново отрисует модальное окно с товарами корзины

events.on('product:delete', (data: { card: Card }) => {

  const { card } = data; 
  const basketItemData = productData.getProduct(card.id); //??? должно быть basketData???

  basketData.deleteProduct(basketItemData.id); // обновленный массив данных корзины  

});


// Пользователь нажал на кнпку



















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