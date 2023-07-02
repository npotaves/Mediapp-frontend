import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Rol } from '../model/rol';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService  extends GenericService<Rol> { 

  private profileChange = new Subject<Rol[]>();
  
  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/profile`);
  }

  getRoleByUsername(username: string){
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
     return this.http.post<Rol[]>(`${this.url}/role`, username, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json')
    });  
  }

  getProfileChange(){
    return this.profileChange.asObservable();
  }

  setProfileChange(menus: Rol[]){
    this.profileChange.next(menus);
  }
}
