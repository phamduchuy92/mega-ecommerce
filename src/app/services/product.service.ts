import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'src/environments/environment';
import { createRequestOption } from '../core/request/request-util';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  find(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.get<any>(
      SERVER_API_URL + `/services/product-mgmt/api/products/${id}`,
      {
        observe: 'response',
      }
    );
  }

  query(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.httpClient.get<any>(
      SERVER_API_URL + `/services/product-mgmt/api/products`,
      { params: options, observe: 'response' }
    );
  }
}
