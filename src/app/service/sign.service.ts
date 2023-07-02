import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Sign } from '../model/sign';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Patient } from '../model/patient';

@Injectable({
  providedIn: 'root'
})
export class SignService extends GenericService<Sign>{

  private signChange = new Subject<Sign[]>;
  private messageChange = new Subject<string>;
  private patientChange = new Subject<Patient[]>;
  private patientControlChange = new Subject<Patient>;

  constructor(protected override http: HttpClient){
    super(http, `${environment.HOST}/signs`)
  }

  listPageable(p: number, s: number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getSignChange(){
    return this.signChange.asObservable();
  }

  setSignChange(data: Sign[]){
    this.signChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }


  getPatientChange(){
    return this.patientChange.asObservable();
  }

  setPatientChange(data: Patient[]){
    this.patientChange.next(data);
  }

  getPatientControlChange(){
    return this.patientControlChange.asObservable();
  }

  setPatientControlChange(data: Patient){
    this.patientControlChange.next(data);
  }

}
