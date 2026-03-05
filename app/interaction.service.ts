import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class InteractionService {


   constructor() { }

   private subject = new Subject<any>();


   // tslint:disable-next-line:variable-name
   private _MessageSource = new Subject<string>();
   Message$ = this._MessageSource.asObservable();


   // tslint:disable-next-line:typedef
   sendMessage(message: string) {

      this._MessageSource.next(message);



   }


}
