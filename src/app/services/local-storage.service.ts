import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  data : any

  constructor() {
    this.getAll()

  }

     // JSON "set" example
    async setObject(key : string, value : any) {
      await Preferences.set({
        key: key,
        value: JSON.stringify(value)
      });
    }

    // JSON "get" example
    async getObject(key : string) {
      const ret = await Preferences.get({ key: key });
      const value = JSON.parse(ret.value);
      return value
    }

    async getAll(){
      const { keys } = await Preferences.keys();
      let items : any[] =[]
      if(keys.length > 0){
        const promises = keys.map(async (key) =>{
          const data = await this.getObject(key);
          return data
        });
        items = await Promise.all(promises);
        console.log('items ->', items)
        this.ordenar(items)
        return items;


      }
      else{
        return null;
      }



    }

    ordenar(items : any){
      const customOrder = ['password', 'google', 'facebook', 'apple', ];
      items.sort((a : any, b : any) => {
        return customOrder.indexOf(a.id) - customOrder.indexOf(b.id);
      });
    }
}
