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

  getDocumentsByEmail(token: string, email: string): Observable<Document[]> {
    this.header = this.header.set('Authorization', 'Bearer ' + token);

    const params = new HttpParams().append('email',email);
    return this.httpClient.get<Document[]>('http://localhost:8888/documents', {params, 'headers': this.header})
  }

  sendDocument(token: string, email: string, form: FormData) {
    this.header = this.header.set('Authorization', 'Bearer ' + token);
    this.httpClient.post('http://localhost:8888/document', form, { 'headers': this.header, params: { email: email } }).subscribe(
      (res) => console.log(res),
      (err) => console.error(err)
    );
  }

}
