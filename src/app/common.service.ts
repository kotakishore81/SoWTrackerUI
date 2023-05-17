import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  user:any;
  setUser(user:any){
    this.user=user
  }
  getUser(){
    return this.user;
  }
}
