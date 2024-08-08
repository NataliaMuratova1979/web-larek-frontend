import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ProductData } from './components/ProductData';
import { BasketData } from './components/BasketData';

import { IProduct, IProductsData } from "././types";


import { Modal } from './components/Modal';

import { AppApi } from './components/AppApi';
import { Api } from './components/base/api'
import { IApi } from './types'
import { Page } from './components/Page';
import { Card } from './components/Card';
import { CardsContainer } from './components/CardsContainer';
import { BasketCounter } from './components/BasketCounter';



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

//const gallerySection = document.querySelector('.gallery');

const cardTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog'); // шаблон карточки в каталоге на главной странице

const cardModalTemplate: HTMLTemplateElement = document.querySelector('#card-preview'); // шаблон карточки в превью

const galleryContainer = new CardsContainer(
  document.querySelector('.gallery'), events
); // контейнер галерея карточек на главной странице

const basketContainer = new CardsContainer(
document.querySelector('.basket__list'), events
);

const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');  // шаблон карточки внутри корзины  




/*
const card1 = new Card(cloneTemplate(cardTemplate), events);
const card2 = new Card(cloneTemplate(cardTemplate), events);
const cardArray = [];
cardArray.push(card1.render(productExamples[0]));
cardArray.push(card2.render(productExamples[1]));

galleryContainer.render({catalog:cardArray});
*/


const basketCounter = new BasketCounter(document.querySelector('.header__basket'), events);

//basketCounter.counter = 20;

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


// Пользователь кликнул на карточку товара на главной странице. В модальном окне отрисовывается превью карточки. 

events.on('card:open', (data: { card: Card }) => {
  const { card } = data; 
 //console.log(card);
  //console.log(card.id);
  const productModalData = productData.getProduct(card.id);
  //console.log(productModalData);
  //console.log(productModalData.description); // все работает, в консоль выводится, ну это же просто замечательно 
  
   
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


// Пользователь кликнул на значок корзины на главной странице. Надо отрисовать модальное окно с содержимым. Событие basket:open прописано в файле Page.ts
// Пользователь удалил товар из корзинки. Надо заново отрисовать модальное окно с содержимым. 

events.on('basket:open', () => { 
  console.log('кликнули по корзинке');
  const basketCardsArray = basketData.products.map((card, index) => {
  const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);

  cardBasket.index = index + 1; // индекс равен порядковому номеру cardBasket в массиве плюс один

  //надо присвоить каждому cardBasket индекс, взяв его из basketData.products 
 
  
  return cardBasket.render(card);
});

modal.render({
  content: basketContainer.render({ catalog: basketCardsArray})
})

});

//Пользователь кликнул на значок удаления товара из корзины. В классе Card срабатывает событие product:delete. В классе BasketData вызывается метод deleteProduct, после отработки которого возникате событие basket:open, которое заново отрисует модальное окно с товарами корзины

events.on('product:delete', (data: { card: Card }) => {

  const { card } = data; 
  const basketItemData = productData.getProduct(card.id);

  basketData.deleteProduct(basketItemData.id); // обновленный массив данных корзины  

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