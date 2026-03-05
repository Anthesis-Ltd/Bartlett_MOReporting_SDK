import { Component, OnInit, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { SohoDataGridComponent, SohoMessageService, SohoModalDialogService } from 'ids-enterprise-ng';
import { IUserContext } from '@infor-up/m3-odin';
import { ArrayUtil, MIRecord, IBookmark, IMIRequest, IMIResponse } from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { GlobalStore } from '../../store/global-store';
import { UserService } from '@infor-up/m3-odin-angular';


@Component({
   selector: 'app-whsl-lookup',
   templateUrl: './whsl-lookup.component.html',
   styleUrls: ['./whsl-lookup.component.css']
})
export class WhslLookupComponent implements OnInit {

   userContext = {} as IUserContext;
   currentCONO: any;
   currentDIVI: any;
   userDateFmt: any;
  // state$ = this.globalStore.state$.pipe();
   isBusy = false;

   txtITNO: string;
   selectedITNO: string;
   selectedFUDS: string;

   gridOptions?: SohoDataGridOptions = undefined;
   datagridOptions: SohoDataGridOptions;

   itemsToDisplay: any[] = [];
   hasSelected: boolean;

   private maxRecords = 1000;
   private pageSize = 32;
   currentWHLO: string;
   selectedPACT: any;
   selectedPANM: any;
   selectedCFI1: any;
   selectedBUYE: any;
   selectedWHSL: any;

   constructor(private globalStore: GlobalStore,
      protected miService: MIService, private userService: UserService,
      protected messageService: SohoMessageService) {
      this.userContext = this.globalStore.getUserContext();
      if (this.userContext.USID === undefined) {
         this.getUserContext();
      }
   }

   @ViewChild('NoledgerDatagrid') datagrid: SohoDataGridComponent;


   ngOnInit(): void {
      this.txtITNO = this.globalStore.getITNO();
      this.hasSelected = false;

      this.listItems();
      this.initGrid();
   }
   private getUserContext() {
      console.log('getUserContext');
      this.userService.getUserContext().subscribe((userContext: IUserContext) => {
         this.userContext = userContext;
         this.globalStore.setUserContext(this.userContext);
         this.currentCONO = this.userContext.currentCompany;
         this.currentDIVI = this.userContext.currentDivision;
         this.currentWHLO = this.userContext.WHLO;

      });
   }

   private initGrid() {
      const options: SohoDataGridOptions = {
         selectable: 'single' as SohoDataGridSelectable,
         disableRowDeactivation: true,
         clickToSelect: true,
         alternateRowShading: true,
         rowHeight: 'short',
         filterable: true,
         userObject: this,
         editable: true,
         cellNavigation: false,
         idProperty: 'col-itno',
         paging: false,
         pagesize: this.pageSize,
         indeterminate: false,
         columns: [

            {
               id: 'col-stky', field: 'WHLO', name: 'Warehouse',
               resizable: true, filterType: 'text', sortable: true, singleline: true, maxWidth: 50
            },
            {
               id: 'col-stky', field: 'WHSL', name: 'Location',
               resizable: true, filterType: 'text', sortable: true, singleline: true, maxWidth: 50
            },
            {
               id: 'col-tx15', field: 'SLDS', name: 'Description',
               resizable: true, filterType: 'text', sortable: true, singleline: true, maxWidth: 50
            },


         ],
         dataset: [],
         emptyMessage: {
            title: '',
            icon: 'icon-empty-no-data'
         }
      };
      this.datagridOptions = options;
   }
   private updateGridData() {
      this.datagrid ? this.datagrid.dataset = this.itemsToDisplay : this.datagridOptions.dataset = this.itemsToDisplay;
   }
   onChangeITNO(event: any) {
      if (event.target.value.trim() !== "") {
         this.listItems();
      }
      console.log(event.target.value);
   }
   btnSearchClicked() {
      //if (this.txtITNO.trim() != "") {
      this.listItems();
      //}
   }
   private listItems() {
      var transaction = "ListLocations";
      var record = {};
      this.isBusy = true;
      const request: IMIRequest = {
         includeMetadata: true,
         program: "MMS010MI",
         transaction: transaction,
         maxReturnedRecords: 5000,
         outputFields: ['WHLO', 'WHSL', 'SLDS'],
         typedOutput: true,
         record: {WHLO: this.globalStore.getFACI()}

      };

      this.miService.execute(request).subscribe((response: IMIResponse) => {

         if (!response.hasError()) {
            for (var i = 0; i < response.items.length; i++) {

               this.itemsToDisplay.push({
                  WHLO: response.items[i].WHLO.trim(),
                  WHSL: response.items[i].WHSL.trim(),
                  SLDS: response.items[i].SLDS.trim(),
               });
            }
            this.isBusy = false;
            this.updateGridData();
         } else {
            this.onError('Failed to list transaction data');
         }
         this.updateGridData();
      }, (error: IMIResponse) => {
         this.isBusy = false;
         if (error.errorCode != "XRE0103") {
            this.onError('Failed to list transaction data', error);
         }
      });

   }

   onSelected(args: any[], isSingleSelect?: boolean) {
      const newCount = args.length;
      const selected = args && newCount === 1 ? args[0].data : null;
      this.hasSelected = !!selected;
      if (this.hasSelected) {
         this.selectedWHSL = selected.WHSL;
         this.globalStore.setWHSL(this.selectedWHSL);
      }
   }
   private onError(message: string, error?: any) {
      //this.logError(message, error ? '- Error: ' + JSON.stringify(error) : '');
      const buttons = [{ text: 'Ok', click: (e, modal) => { modal.close(); } }];
      this.messageService.error()
         .title('An error occured')
         .message(message + '. More details might be available in the browser console.')
         .buttons(buttons)
         .open();
   }
}
