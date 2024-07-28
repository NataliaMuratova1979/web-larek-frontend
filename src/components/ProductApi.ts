import { IProduct, IProductServerData } from "../types";
import { Api } from "./base/api";

export class ProductApi extends Api {

    constructor( baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    getProducts(): Promise<IProductServerData[]> {
        return this.get<IProductServerData[]>(`/product`);
    }

}