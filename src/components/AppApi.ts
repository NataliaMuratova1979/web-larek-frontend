import { IApi, IProduct, IData } from '../types';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getProducts(): Promise<IData> {
		return this._baseApi.get<IData>(`/product`).then((products: IData) => products);
	}
}
