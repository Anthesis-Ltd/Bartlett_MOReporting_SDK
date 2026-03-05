import { Component, OnInit } from '@angular/core';
import { SohoLookupComponent } from 'ids-enterprise-ng';
import { CoreBase, IUserContext } from '@infor-up/m3-odin';
import { MIService, UserService } from '@infor-up/m3-odin-angular';

import { InteractionService } from '../interaction.service';

@Component({
   selector: 'app-homepages',
   templateUrl: './homepages.component.html',
   styleUrls: ['./homepages.component.css']
})
export class HomepagesComponent extends CoreBase implements OnInit {
   userContext = {} as IUserContext;
   isBusy = false;
   company: string;
   currentCompany: string;
   division: string;
   currentDivision: string;
   language: string;
   currentLanguage: string;
   model: any;
   single01s: string;
   single02s: string;
   curcono: string;
   curcono01: string;
   reportstatus: string;
   reportrows: string;

   // tslint:disable-next-line:variable-name
   constructor(private _interactionService: InteractionService, private miService: MIService, private userService: UserService) {
      super('HomepagesComponent');

      this.userService.getUserContext().subscribe((userContext: IUserContext) => {
         this.userContext = userContext;
         const lang = userContext.currentLanguage;
         const divi = userContext.currentDivision;
         this.curcono = userContext.currentCompany;
         const usid = userContext.USID;
         this.logInfo('User context: ' + usid + ', cono: ' + this.curcono + ', divi: ' + divi + ', lang: ' + lang);
      }, (errorContext: IUserContext) => {
         // Handle error
         this.logError(errorContext.errorMessage);
      });
   }

   // tslint:disable-next-line:typedef
   ngOnInit() {

      this._interactionService.Message$
         .subscribe(message => {
            if (message.split('~')[0] === 'curstat') {
               this.reportstatus = message.split('~')[1];
            }
            if (message.split('~')[0] === 'currows') {
               this.reportrows = message.split('~')[1];
               if (this.reportrows === 'undefined') { this.reportrows = null }
            }
         })
   }

   onClickLoad(): void {
      this.logInfo('onClickLoad');
      this.setBusy(true);
      this.userService.getUserContext().subscribe((userContext: IUserContext) => {
         this.setBusy(false);
         this.logInfo('onClickLoad: Received user context');
         this.userContext = userContext;
         this.updateUserValues(userContext);
      }, (error) => {
         this.setBusy(false);
         this.logError('Unable to get userContext ' + error);
      });
   }


   ipoline() {
      this._interactionService.sendMessage('ipoline');
   }


   onChange(e: SohoDropDownEvent) {
      console.log(`change ${e.target}`);
      console.log('this is the first value' + this.model.single01);
      console.log('this is the second value' + this.model.single02);

   }

   exportToExcel() {
      this._interactionService.sendMessage('exportexcel');
   }

   runReport() {
      this._interactionService.sendMessage('runreport');
      this.curcono01 = 'curcono' + '~' + this.curcono;
      this._interactionService.sendMessage(this.curcono01);

   }

   updateUserValues(userContext: IUserContext) {
      this.company = userContext.company;
      this.division = userContext.division;
      this.language = userContext.language;

      this.currentCompany = userContext.currentCompany;
      this.currentDivision = userContext.currentDivision;
      this.currentLanguage = userContext.currentLanguage;
   }

   private setBusy(isBusy: boolean) {
      this.isBusy = isBusy;
   }
}
