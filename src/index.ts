import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ProductData } from './components/ProductData';
import { IProduct, IProductsData } from "././types";



import { AppApi } from './components/AppApi';
import { Api } from './components/base/api'
import { IApi } from './types'
//import { Page } from './components/Page';
import { Card } from './components/Card';
import { CardsContainer } from './components/CardsContainer';
import { BasketCounter } from './components/BasketCounter';



//import { Card } from './components/Card';
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




const productData = new ProductData(events);

// Получаем карточки с сервера
const promise = api.getProducts();

promise
  .then((data) => {
    productData.products = data.items;
    console.log(productData);
    events.emit('products:loaded'); // сгенерировали событие
    console.log(productData.getProduct("854cef69-976d-4c2a-a18c-2aa45046c390"));
    console.log(productData.getProduct("b06cde61-912f-4663-9751-09956c0eed67"));

  })
  .catch((err) => {
    console.error(err);
  });

//const gallerySection = document.querySelector('.gallery');

const cardTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');

  const galleryContainer = new CardsContainer(
    document.querySelector('.gallery')
  );

const card1 = new Card(cloneTemplate(cardTemplate), events);
const card2 = new Card(cloneTemplate(cardTemplate), events);
const cardArray = [];

cardArray.push(card1.render(productExamples[0]));
cardArray.push(card2.render(productExamples[1]));

galleryContainer.render({catalog:cardArray});

const basketCounter = new BasketCounter(document.querySelector('.header__basket'), events);

basketCounter.counter = 20;
console.log(basketCounter);

events.on('products:loaded', () => {
  const cardsArray = productData.products.map((card) => {
    const cardInstant = new Card(cloneTemplate(cardTemplate), events);
    return cardInstant.render(card);
  });

  galleryContainer.render({ catalog: cardsArray });
});












   





  










