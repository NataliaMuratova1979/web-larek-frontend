import { IApi, IProduct, IData, IOrderSendData, IResponse } from '../types';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getProducts(): Promise<IData> {
		return this._baseApi.get<IData>(`/product`).then((result: IData) => result);
	}

	/*
	postOrder(orderData: IOrderSendData): Promise<IResponse> {
        return this._baseApi.post<IResponse>('/order', orderData)
            .then((result: IResponse) => result);
    }*/
	
}

