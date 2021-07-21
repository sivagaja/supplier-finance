import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InvoicePageType } from '../invoice.page.type';
import { environment } from '../../../environments/environment';

const { API_PATH } = environment;

@Injectable({
  providedIn: 'root',
})
export class ViewSingleInvoicesService {
  constructor(private http: HttpClient) {}

  public getInvoiceById(invoiceId: number): Promise<InvoicePageType> {
    console.log(invoiceId);
    return this.http
      .get<InvoicePageType>(`${API_PATH}/invoices/getById/${invoiceId}`)
      .toPromise();
  }
}
