import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebService {

  private httpclient = inject(HttpClient)
  token : string;

  url : string = 'https://jsonplaceholder.typicode.com';
  path: string = 'post/1';
  body : any = {
    title: 'foo',
    body: 'bar',
    userId: 1,
  }
  type: string = 'GET';

  constructor() {
  }

  async login(username: string, password: string){
    const url = environment.apiUrl;
    const path = 'Client/login';
    const query = `?user=${username}&password=${password}`;
    const body = { user: username, password };

    const res = await this.request('POST', url, path, body);

    // console.log(res)

    return res;
  }

  request<Response>(type: 'POST' | 'GET', url: string,path: string,body: any = {} ){
    return new Promise<Response>((resolve) => {
      const headers = new HttpHeaders({
        'Content-Type' : 'application/json',
        //para token
        'authorization' : `Bearer ${this.token}`,
      })
      if(type == 'POST'){
        this.httpclient.post<Response>(url + '/' + path, body, {headers}).subscribe((data) =>{
          // console.log(data)
          resolve(data);
          return;
        })
      }
      if(type == 'GET'){
        this.httpclient.get<Response>(url + '/' + path, {headers}).subscribe((data) =>{
          resolve(data);
          return;
        })
      }
    })
  }
 }

