import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable(
  {
    providedIn: "root"
  }
)

export class AppService {
  private header = new HttpHeaders();

  constructor(private httpClient: HttpClient) {
  }

  loginApi(payload: any) {
    return this.httpClient.post('http://localhost:8888/auth/login', payload)
  }

  getDocumentsByEmail(token: string, email: string, keyword?: string, title?: string, minDate?: string, maxDate?: string, minWordsNumber?: string, maxWordsNumber?: string): Observable<Document[]> {
    this.header = this.header.set('Authorization', 'Bearer ' + token);

    const params = new HttpParams()
        .append('email',email)
        .append('keyword', keyword ? keyword : '')
        .append('title', title ? title : '')
        .append('minDate', minDate ? minDate : '')
        .append('maxDate', maxDate ? maxDate : '')
        .append('minWordsNumber', minWordsNumber ? minWordsNumber : '')
        .append('maxWordsNumber', maxWordsNumber ? maxWordsNumber : '');
    return this.httpClient.get<Document[]>('http://localhost:8888/documents', {params, 'headers': this.header})
  }

  sendDocument(token: string, email: string, form: FormData) {
    this.header = this.header.set('Authorization', 'Bearer ' + token);
    this.httpClient.post('http://localhost:8888/document', form, { 'headers': this.header, params: { email: email } }).subscribe(
      (res) => console.log(res),
      (err) => console.error(err)
    );
  }
  deleteDocument(token: string, id: string) {
  this.header = this.header.set('Authorization', 'Bearer ' + token);
  const options = { headers: this.header, params: { id: id } };
  this.httpClient.post('http://localhost:8888/remove-document', null, options).subscribe(
    (res) => console.log(res),
    (err) => console.error(err)
  );
  }

  downloadFile(token: string, id: string) {
  console.log('Downloading file with id:', id);
  this.header = this.header.set('Authorization', 'Bearer ' + token);
  const options = { headers: this.header, params: { id: id }, responseType: 'blob' as const };
  return this.httpClient.get('http://localhost:8888/download', options);
  }
}

