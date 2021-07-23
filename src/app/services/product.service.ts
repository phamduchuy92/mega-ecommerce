import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  find(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.get<any>(
      SERVER_API_URL + `/services/product-mgmt/api/product/${id}`,
      {
        observe: 'response',
      }
    );
  }

  query(): Observable<HttpResponse<any>> {
    return this.httpClient.get<any>(
      SERVER_API_URL + `/services/product-mgmt/api/product`,
      { observe: 'response' }
    );
  }
}
