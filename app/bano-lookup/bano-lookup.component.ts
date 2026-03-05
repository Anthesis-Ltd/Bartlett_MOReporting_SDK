import { Component, OnInit, ViewChild } from '@angular/core';
import {
  SohoDataGridComponent,
  SohoMessageService,
  SohoModalDialogService,
} from 'ids-enterprise-ng';
import { IUserContext, IMIRequest, IMIResponse } from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { GlobalStore } from '../../store/global-store';
import { UserService } from '@infor-up/m3-odin-angular';

@Component({
  selector: 'app-bano-lookup',
  templateUrl: './bano-lookup.component.html',
  styleUrls: ['./bano-lookup.component.css'],
})
export class BanoLookupComponent implements OnInit {
  userContext = {} as IUserContext;
  currentCONO: any;
  currentDIVI: any;
  userDateFmt: any;

  isBusy = false;

  txtITNO: string;
  gWHSL: string;
  selectedITNO: string;
  selectedFUDS: string;

  // ✅ ties to the HTML I provided
  public model1 = {
    showAllLocations: false,
  };

  // ✅ unique id per component instance (prevents label/checkbox glitches)
  public showAllLocationsId = `showAllLocations-${Math.random()
    .toString(16)
    .slice(2)}`;

  gWCLN: string;
  id1: any;
  model: any;

  gridOptions?: SohoDataGridOptions = undefined;
  datagridOptions: SohoDataGridOptions;

  itemsToDisplay: any[] = [];
  hasSelected: boolean;

  private maxRecords = 600;
  private pageSize = 32;
  currentWHLO: string;
  selectedPACT: any;
  selectedPANM: any;
  selectedCFI1: any;
  selectedBUYE: any;
  selectedABCD: any;
  cFACI: string;

  constructor(
    private globalStore: GlobalStore,
    protected miService: MIService,
    private userService: UserService,
    protected messageService: SohoMessageService
  ) {
    this.userContext = this.globalStore.getUserContext();
    if (this.userContext.USID === undefined) {
      this.getUserContext();
    }
  }

  @ViewChild('NoledgerDatagrid') datagrid: SohoDataGridComponent;

  ngOnInit(): void {
    this.txtITNO = this.globalStore.getITNO();
    this.hasSelected = false;

    const whsl = this.globalStore.getWHSL() || '';
    this.gWHSL = whsl.length >= 3 ? whsl.slice(0, -3) + 'HOP' : 'HOP';

    this.initGrid();

    // initial load (filtered)
    this.listItems(this.globalStore.getPRNO(), this.gWHSL);
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

  // ✅ called from HTML: (change)="onShowAllLocationsChanged()"
  onShowAllLocationsChanged() {
    this.itemsToDisplay = [];
    this.updateGridData();

    if (this.model1.showAllLocations === true) {
      this.listItemsAll(this.globalStore.getPRNO());
    } else {
      // use the same location logic as initial load
      const whsl = this.globalStore.getWHSL() || '';
      const loc = whsl.length >= 3 ? whsl.slice(0, -3) + 'HOP' : 'HOP';
      this.gWHSL = loc;
      this.listItems(this.globalStore.getPRNO(), loc);
    }
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

      // ✅ must be a dataset FIELD, not a column id
      idProperty: 'BANO',

      paging: false,
      pagesize: this.pageSize,
      indeterminate: false,
      columns: [
        {
          id: 'col-prno',
          field: 'PRNO',
          name: 'Product',
          resizable: true,
          filterType: 'text',
          sortable: true,
          singleline: true,
          maxWidth: 50,
        },
        {
          id: 'col-bano',
          field: 'BANO',
          name: 'Lot Number',
          resizable: true,
          filterType: 'text',
          sortable: true,
          singleline: true,
          maxWidth: 50,
        },
        {
          id: 'col-camu',
          field: 'CAMU',
          name: 'Container no',
          resizable: true,
          filterType: 'text',
          sortable: true,
          singleline: true,
          maxWidth: 50,
        },
        {
          id: 'col-whsl',
          field: 'WHSL',
          name: 'Location',
          resizable: true,
          filterType: 'text',
          sortable: true,
          singleline: true,
          maxWidth: 50,
        },
        {
          id: 'col-stqt',
          field: 'STQT',
          name: 'Lot Qty',
          resizable: true,
          filterType: 'text',
          sortable: true,
          singleline: true,
          maxWidth: 50,
        },
      ],
      dataset: [],
      emptyMessage: {
        title: '',
        icon: 'icon-empty-no-data',
      },
    };
    this.datagridOptions = options;
  }

  private updateGridData() {
    this.datagrid
      ? (this.datagrid.dataset = this.itemsToDisplay)
      : (this.datagridOptions.dataset = this.itemsToDisplay);
  }

  onChangeITNO(event: any) {
    if (event.target.value.trim() !== '') {
      const whsl = this.globalStore.getWHSL() || '';
      const loc = whsl.length >= 3 ? whsl.slice(0, -3) + 'HOP' : 'HOP';
      this.gWHSL = loc;
      this.listItems(this.globalStore.getPRNO(), loc);
    }
    console.log(event.target.value);
  }

  btnSearchClicked() {
    const whsl = this.globalStore.getWHSL() || '';
    const loc = whsl.length >= 3 ? whsl.slice(0, -3) + 'HOP' : 'HOP';
    this.gWHSL = loc;
    this.listItems(this.globalStore.getPRNO(), loc);
  }

  listItemsAll(itno) {
    this.cFACI = this.globalStore.getFACI();

    // ✅ clear to avoid duplicates
    this.itemsToDisplay = [];
    this.updateGridData();

    const transaction = 'Lst_ZLOT';
    this.isBusy = true;

    const request: IMIRequest = {
      includeMetadata: true,
      program: 'CMS100MI',
      transaction: transaction,
      maxReturnedRecords: 5000,
      outputFields: [
        'MLITNO',
        'MLBANO',
        'MLWHSL',
        'MLCAMU',
        'MLSTQT',
        'AGATID, AGATVA',
        'AHATID',
        'AHATVA',
        'AIATID',
        'AIATVA',
        'AJATID',
        'AJATVA',
        'AKATID',
        'AKATVA',
      ],
      typedOutput: true,
      record: {
        MLWHLO: this.cFACI,
        MLITNO: itno,
      },
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        if (!response.hasError()) {
          for (let i = 0; i < response.items.length; i++) {
            this.itemsToDisplay.push({
              PRNO: response.items[i].MLITNO,
              BANO: response.items[i].MLBANO,
              CAMU: response.items[i].MLCAMU,
              STQT: response.items[i].MLSTQT,
              WHSL: response.items[i].MLWHSL,
            });
          }
        }

        // ✅ always stop busy (even if hasError is true)
        this.isBusy = false;
        this.updateGridData();
      },
      (_error: IMIResponse) => {
        this.isBusy = false;
      }
    );
  }

  private listItems(itno, whsl) {
    this.cFACI = this.globalStore.getFACI();

    // ✅ clear to avoid duplicates
    this.itemsToDisplay = [];
    this.updateGridData();

    const transaction = 'Lst_ZLOT';
    this.isBusy = true;

    const request: IMIRequest = {
      includeMetadata: true,
      program: 'CMS100MI',
      transaction: transaction,
      maxReturnedRecords: 5000,
      outputFields: [
        'MLITNO',
        'MLBANO',
        'MLWHSL',
        'MLCAMU',
        'MLSTQT',
        'AGATID, AGATVA',
        'AHATID',
        'AHATVA',
        'AIATID',
        'AIATVA',
        'AJATID',
        'AJATVA',
        'AKATID',
        'AKATVA',
      ],
      typedOutput: true,
      record: {
        MLWHLO: this.cFACI,
        MLITNO: itno,
        F_WHSL: whsl,
        T_WHSL: whsl,
      },
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        if (!response.hasError()) {
          for (let i = 0; i < response.items.length; i++) {
            this.itemsToDisplay.push({
              PRNO: response.items[i].MLITNO,
              BANO: response.items[i].MLBANO,
              CAMU: response.items[i].MLCAMU,
              STQT: response.items[i].MLSTQT,
              WHSL: response.items[i].MLWHSL,
            });
          }
        }

        // ✅ always stop busy
        this.isBusy = false;
        this.updateGridData();
      },
      (_error: IMIResponse) => {
        this.isBusy = false;
      }
    );
  }

  onSelected(args: any[], isSingleSelect?: boolean) {
    const newCount = args.length;
    const selected = args && newCount === 1 ? args[0].data : null;
    this.hasSelected = !!selected;
    if (this.hasSelected) {
      this.globalStore.setBANO(selected.BANO);
      this.globalStore.setCAMU(selected.CAMU);
      this.globalStore.setSTQT(selected.STQT);
    }
  }

  private onError(message: string, error?: any) {
    const buttons = [
      {
        text: 'Ok',
        click: (e, modal) => {
          modal.close();
        },
      },
    ];
    this.messageService
      .error()
      .title('An error occured')
      .message(message + '. More details might be available in the browser console.')
      .buttons(buttons)
      .open();
  }
}
