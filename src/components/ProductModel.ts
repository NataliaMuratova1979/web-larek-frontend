import { IProduct } from '../types';
// import { IToDoItem } from '../types';
import { IEvents } from './base/events';

export class ProductModel {
  protected items: IProduct[] = [];
  constructor(protected events: IEvents) {}

  addItem(item: IProduct) {
    this.items = [item, ...this.items];
    this.events.emit('items: changed');
  }

  editItem(id: string, data: Partial<IProduct>) {
    const item = this.getItem(id);
    if (item) {
      Object.assign(item, data);
      //this.events.emit('items: changed');
    }
  }

  checkItem(id: string) {
    const item = this.getItem(id);
    if (item) {
      item.ordered = !item.ordered;
      //this.events.emit('items: changed');
    }
  }

  getItem(id: string) {
    return this.items.find((item) => item.id === id);
  }

  getItems() {
    return this.items;
  }
  
  setItems(items: IProduct[]) {
    this.items = items;
    this.events.emit('items: changed');
  }

  deleteItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    //this.events.emit('items: changed');
  }

  getTotal() {
    return this.items.length;
  }

  getDone() {
    return this.items.filter((item) => item.ordered).length;
  }

}
