import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  constructor(private httpClient: HttpClient) {}

  create(item: any): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      SERVER_API_URL + `/services/order-mgmt/api/order-detail/`,
      item,
      {
        observe: 'response',
      }
    );
  }
}
