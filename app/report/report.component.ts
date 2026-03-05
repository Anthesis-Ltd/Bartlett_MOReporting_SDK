import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Buffer } from 'buffer';
import {
  CoreBase,
  IMIRequest,
  IMIResponse,
  MIRecord,
  IIonApiRequest,
  IIonApiResponse,
  IUserContext,
} from '@infor-up/m3-odin';
import {
  MIService,
  UserService,
  ApplicationService,
  IonApiService,
} from '@infor-up/m3-odin-angular';
import {
  SohoDataGridComponent,
  SohoMessageRef,
  SohoMessageService,
  SohoModalDialogService,
  SohoToastService,
} from 'ids-enterprise-ng';
import { InteractionService } from '../interaction.service';
import { DatePipe } from '@angular/common';
import { MfnoLookupComponent } from '../mfno-lookup/mfno-lookup.component';
import { BanoLookupComponent } from '../bano-lookup/bano-lookup.component';
import { DataService } from '../data.service';
import { GlobalStore } from '../../store/global-store';
import { lastValueFrom } from 'rxjs';
import { WhslLookupComponent } from '../whsl-lookup/whsl-lookup.component';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DatePipe],
})
export class ReportComponent extends CoreBase implements OnInit {
  issuemanual = false;
  issuem: any;
  respFR001: IMIResponse;
  respFR002: IMIResponse;
  curdivi: string;
  usid: string;
  issuel: any;
  flag01: string;
  respGL001: IMIResponse;
  respGL002: IMIResponse;
  qRORN: any;
  sCAMU: any;
  sRIDN: any;
  sBANO: any;
  qMFHL: any;
  respGL002a: IMIResponse;
  respGL002b: IMIResponse;
  rMTNO: any;
  rBANO: any;
  hMTNO: any;
  xITTY: any;
  zBANO: any;
  beforeBANO: any;
  currentMO: any;
  lMFHL: any;
  lMFNO: any;
  respGL00z5: IMIResponse;
  respGL00z6: IMIResponse;
  respGL00z7: IMIResponse;

  onCheckboxChange(newValue: boolean) {
    console.log('Checkbox value changed:', newValue);

    // Persist immediately for downstream logic
    const flag01 = newValue ? '1' : '0';
    this.flag01 = flag01;
    localStorage.setItem('ISSUE', flag01);

    // Keep UI as the user clicked (avoid "double click" caused by overwriting from GetFieldValue)
    this.model.checkBox1Value = newValue;

    this.userService.getUserContext().subscribe(
      (_context) => {
        const input = new MIRecord();
        input.setString('FILE', 'ISSUE01');
        input.setString('PK01', this.usid);

        const request: IMIRequest = {
          program: 'CUSEXTMI',
          transaction: 'GetFieldValue',
          record: input,
          outputFields: ['N096'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          (_response: IMIResponse) => {
            // If GetFieldValue succeeds, record exists -> update it
            this.updateTick(this.usid, this.flag01);
          },
          (_error) => {
            // If GetFieldValue errors, record likely doesn't exist -> create it
            this.createTick(this.usid, this.flag01);
            this.setBusy(false);
          },
        );
      },
      (_error) => {
        this.setBusy(false);
      },
    );
  }

  createTick(usid: string, flag01: string) {
    this.userService.getUserContext().subscribe(
      (_context) => {
        const input = new MIRecord();
        input.setString('FILE', 'ISSUE01');
        input.setString('PK01', usid);
        input.setString('N096', flag01);

        const request: IMIRequest = {
          program: 'CUSEXTMI',
          transaction: 'AddFieldValue',
          record: input,
          outputFields: ['N096'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          (_response: IMIResponse) => {
            // no-op
            this.setBusy(false);
          },
          (_error) => {
            this.setBusy(false);
          },
        );
      },
      (_error) => {
        this.setBusy(false);
      },
    );
  }

  updateTick(usid: string, flag01: string) {
    this.userService.getUserContext().subscribe(
      (_context) => {
        const input = new MIRecord();
        input.setString('FILE', 'ISSUE01');
        input.setString('PK01', usid);
        input.setString('N096', flag01);

        const request: IMIRequest = {
          program: 'CUSEXTMI',
          transaction: 'ChgFieldValue',
          record: input,
          outputFields: ['N096'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          (_response: IMIResponse) => {
            // no-op
            this.setBusy(false);
          },
          (_error) => {
            this.setBusy(false);
          },
        );
      },
      (_error) => {
        this.setBusy(false);
      },
    );
  }

  oPJBAL: any;
  oAVAL2C: number;
  oPJBALS: number;
  oPJBALP: number;
  sMFHL: any;
  respGR009: IMIResponse;
  respGR011: IMIResponse;
  respGetMITBAL: IMIResponse;

  hPRNO: any;
  hMFNO: any;
  received: any;
  washedx: number;
  respGR0011: unknown;
  zMFHL: any;
  xxBANO: any;
  xxMTNO: any;
  iagatva: string;
  respPMS080: IMIResponse;
  respPMS100: IMIResponse;
  respPMS050: IMIResponse;

  userContext = {} as IUserContext;

  public model = {
    checkBox1Value: false,
    checkBox2Value: false,
    checkBox3Value: false,
    checkBox4Value: true,
    checkBox5Value: true,
  };

  public id1 = 'checkbox1';
  public id2 = 'checkbox2';
  public id3 = 'checkbox3';
  public id4 = 'checkbox4';
  public id5 = 'checkbox5';
  public id6 = 'checkbox6';

  processStockFeed() {
    this.openConfirmation();
  }

  async processClose() {
    this.toastService.show({ title: 'Pack Order Close...', message: '' });

    console.log('fred ' + this.FACI + ' ' + this.iPRNO + ' ' + this.iMFNO);

    // read/close all material lines//
    try {
      this.respFR001 = await lastValueFrom(
        this.dataService.ListMaterials(this.FACI, this.iPRNO, this.iMFNO),
      );
      for (let b = 0; b < this.respFR001.items.length; b++) {
        const item = this.respFR001.items[b];

        this.CloseMaterialLines(this.FACI, this.iPRNO, this.iMFNO, item.MSEQ);
      }
    } catch (error) {}

    // read/close all operations//
    try {
      this.respGR001 = await lastValueFrom(
        this.dataService.ListOperations(this.FACI, this.iPRNO, this.iMFNO),
      );
      for (let b = 0; b < this.respFR001.items.length; b++) {
        const item = this.respFR001.items[b];

        this.ReportOperation(this.FACI, this.iPRNO, this.iMFNO, item.OPNO);
      }
    } catch (error) {}

    // Update MO
    try {
      this.respGR001 = await lastValueFrom(
        this.dataService.UpdateMO(this.FACI, this.iPRNO, this.iMFNO),
      );
      for (let b = 0; b < this.respFR001.items.length; b++) {
        const item = this.respFR001.items[b];
      }
    } catch (error) {}

    // Report Receipt
    try {
      this.respGR001 = await lastValueFrom(
        this.dataService.ReportReceipt(this.FACI, this.iPRNO, this.iMFNO),
      );
      for (let b = 0; b < this.respFR001.items.length; b++) {
        const item = this.respFR001.items[b];
      }
    } catch (error) {}
  }
  async ReportOperation(faci, prno, mfno, opno) {
    try {
      this.respFR002 = await lastValueFrom(
        this.dataService.ReportOperation(faci, prno, mfno, opno),
      );
    } catch (error) {}
  }

  async CloseMaterialLines(faci, prno, mfno, mseq) {
    try {
      this.respFR002 = await lastValueFrom(
        this.dataService.CloseMtrlLine(faci, prno, mfno, mseq),
      );
    } catch (error) {}
  }

  oMATNR: any;
  yyBANO: any;
  rrMTNO: any;
  pBAL: any;
  pospro: boolean;
  negpro: boolean;
  posproS: boolean;
  negproS: boolean;

  posproP: boolean;
  negproP: boolean;

  negmo: boolean;
  packed: boolean;
  produce: boolean;
  posmo: boolean;

  oAVAL3: number;
  oAVAL3C: number;

  xMREM: any;
  XMREM: number;
  WHSLLookup() {
    this.globalStore.setPRNO(this.qMTNO);

    console.log('ShowDialog');
    const lblClose = 'Close';
    var lblUpdate = 'Select';
    const lblTitle = 'Stock Location Lookup';
    const options: SohoModalOptions = {
      cssClass: 'app-modal-window',
    };
    const dialogRef = this.modalService
      .modal(WhslLookupComponent, this.placeholder, options)
      .buttons([
        {
          text: lblClose,
          click: () => {
            dialogRef.close('CLOSE');
          },
        },
        {
          text: lblUpdate,
          click: () => {
            dialogRef.close('SUBMIT');
          },
          isDefault: false,
        },
      ])
      .title(lblTitle)
      .open()
      .beforeClose(() => {
        console.log('before close ' + dialogRef.dialogResult);
        if (dialogRef.dialogResult === 'CANCEL') {
          return true;
        }
      })
      .afterClose((result) => {
        console.log('afterClose', result);
        if (result === 'SUBMIT') {
          this.iTWSL = this.globalStore.getWHSL();

          localStorage.setItem('D008', this.iTWSL);
        }
      });
  }

  cWHSL(event: any) {
    localStorage.setItem('D008', event.target.value);
  }
  qBANO: any;
  oAVAL2: any;
  oAVAl3: any;
  oAVAC = 0;
  closeResult?: string;

  qMO: boolean = false;

  openConfirmation() {
    const buttons = [
      {
        text: 'Yes',
        click: (_e: any, modal: any) => {
          this.closeResult = 'Yes';

          (this.dialog as any) = null;
          modal.close(true);
        },
        isDefault: true,
      },
      {
        text: 'No',
        click: (_e: any, modal: any) => {
          this.closeResult = 'No';
          (this.dialog as any) = null;
          modal.close(true);
        },
      },
    ];

    this.dialog = (this.messageService as any)
      .message()
      .title('<span>Close MO and Process StockFeed?</span>')
      .message(
        '<span class="message">Click Yes to proceed to close MO, and process ' +
          this.oPJBALP +
          '  Stock Feed</span>',
      )
      .buttons(buttons)
      .beforeClose(() => {
        console.log('before close');

        if (this.closeResult === 'Yes') {
          this.processFeed();
        }

        return true;
      })
      .beforeOpen(() => {
        console.log('before open');
        return true;
      })
      .opened(() => {
        console.log('opened');
      })
      .open();
  }

  async processFeed() {
    // Get WHSL - location from MMS002
    try {
      this.respGetMITBAL = await lastValueFrom(
        this.dataService.get_MITBAL(this.FACI, 'STOCKFEED'),
      );
    } catch (error) {}

    for (let s = 0; s < this.respGetMITBAL.items.length; s++) {
      const item = this.respGetMITBAL.items[s];

      //PMS080 - Report by Product
      try {
        this.respPMS080 = await lastValueFrom(
          this.dataService.get_PMS080(
            this.FACI,
            this.iMFNO,
            this.oPJBALP,
            item.WHSL,
          ),
        );
      } catch (error) {}

      //PMS100 - Update PMS100 record to Closed
      try {
        this.respPMS100 = await lastValueFrom(
          this.dataService.get_PMS100(this.FACI, this.iPRNO, this.iMFNO),
        );
      } catch (error) {}

      //PMS050 - Update PMS100 record to Closed
      try {
        this.respPMS050 = await lastValueFrom(
          this.dataService.get_PMS050(this.FACI, this.iPRNO, this.iMFNO),
        );
      } catch (error) {}

      this.openError02('StockFeed Processed');

      if (this.produce === true && this.qstock === true) {
        this.oPJBALP = 0;
      }
    }
  }

  MFNODisconnect() {
    this.linkedMO1('?');
    this.oRORN = null;
  }

  newlotno: string;
  qMSEQ: any;
  respGR0021a: unknown;
  respGR001Z: IMIResponse;
  oCombined: string;
  MMITDS: any;
  qCAMU: any;

  linked01() {
    if (this.oRORN === null) {
      this.linkedMO1('?');
    } else {
      this.linkedMO1(this.oRORN);
    }
  }
  lotexists = false;
  acamu = false;
  qstock = false;

  processing = false;

  alerts: any[] = [];
  ALLOK: any;
  xBANO: any;
  attra: any[] = [];
  attrb: any[] = [];
  samea: boolean;

  DrillbackATS101() {
    this.applicationService.launch(
      'mforms://_automation?data=<?xml+version="1.0"+encoding="utf-8"?><sequence><step+command="RUN"+value="MMS235"></step><step+command="KEY"+value="ENTER"><field+name="WWQTTP">1</field><field+name="W1ITNO">' +
        this.qMTNO +
        '</field></step><step+command="KEY"+value="ENTER"><field+name="W1BANO">' +
        this.oBANO +
        '</field></step><step+command="LSTOPT"+value="28"></step></sequence>',
    );
  }

  xATNR: any;
  iPLGR: any;
  iWCLN: any;
  sWCLN: any;
  currentCompany: any;
  currentDivision: any;

  ConnectMO() {
    //    this.updateMOAttributes('101');
  }

  updateMOAttributes(orca) {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('AHORCA', orca);
        input.setString('AHRIDN', this.iMFNO);

        const request: IMIRequest = {
          program: 'CMS100MI',
          transaction: 'Lst_Q_MOAT',
          record: input,
          outputFields: ['AHATNR', 'AHATID'],
          maxReturnedRecords: 1,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];
                this.xATNR = item.AHATNR;
              }

              this.Lst_Attributes();
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.openError02(error.errorMessage);
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  Lst_Attributes() {
    for (let i = 0; i < this.itemsbano.length; i++) {
      const item = this.itemsbano[i];
      this.Update_MOAttributes(item.ATID2, item.ATVA, this.xATNR);
    }

    setTimeout(() => {
      //refresh widget
      this.triggerBusinessContext_01('refresh');
    }, 3000);
  }

  Update_MOAttributes(atid, atva, atnr) {
    console.log('inhere');

    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('ATNR', atnr);
        input.setString('ATID', atid);
        input.setString('ATAV', atva);

        const request: IMIRequest = {
          program: 'ATS101MI',
          transaction: 'SetAttrValue',
          record: input,
          outputFields: [],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.addAttributes(atid, atva, atnr);
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  addAttributes(atid, atva, atnr) {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('ATNR', atnr);
        input.setString('ATID', atid);
        input.setString('ATAV', atva);

        const request: IMIRequest = {
          program: 'ATS101MI',
          transaction: 'AddAttr',
          record: input,
          outputFields: [],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  triggerBusinessContext_01(refresh) {
    try {
      var type = 'inforBusinessContext';
      var data = {
        screenId: 'm3_PMS100_B',
        entities: [
          {
            entityType: 'Refresh_Widget',
            accountingEntity: this.currentCompany + '_' + this.currentDivision,
            visible: true,
            id1: refresh,
            drillbackURL:
              '?LogicalId=lid://infor.m3.m3&program=OIS390&fieldNames=W1REPN,400000047,W1CUNO,,WWWHLO,SNV,WFCRSB,0,WTCRSB,2&includeStartPanel=True&source=MForms&requirePanel=True&sortingOrder=1&tableName=OCHEAD&keys=OCCONO,100,OCWHLO,+,OCREPN,+,OCCUNO,+&startpanel=B',
          },
        ],
        session: {
          cono: this.currentCompany,
          divi: this.currentDivision,
          panel: 'OIA390BC',
          iid: '6eb46647a42c3420e89dfc2650dfefd2',
          lng: 'GB',
          jobid: '627347afbac5465fa0f6080584053574',
          chgby: '',
          url: '',
          dsep: '.',
          moddate: '',
          user: 'Remco Driessen',
          userid: 'RDRIESSEN',
          df: 'MMDDYY',
          regdate: '',
        },
        program: 'OIS390',
        panel: 'B1',
        screenIdBase: 'OIS390',
      };

      window.parent['infor'].companyon.client.registerMessageHandler;
      window.parent['infor'].companyon.client.sendMessage(type, data);
    } catch (err) {
      //Odin.Log.error("Error in MainCtrl_triggerBusinessContext: " + err);
    }
  }

  triggerBusinessContext_02(mfno) {
    try {
      var type = 'inforBusinessContext';
      var data = {
        screenId: 'm3_PMS100_B',
        entities: [
          {
            entityType: 'InforProductionOrder',
            accountingEntity: this.currentCompany + '_' + this.currentDivision,
            visible: true,
            id1: mfno,
            drillbackURL:
              '?LogicalId=lid://infor.m3.m3&program=OIS390&fieldNames=W1REPN,400000047,W1CUNO,,WWWHLO,SNV,WFCRSB,0,WTCRSB,2&includeStartPanel=True&source=MForms&requirePanel=True&sortingOrder=1&tableName=OCHEAD&keys=OCCONO,100,OCWHLO,+,OCREPN,+,OCCUNO,+&startpanel=B',
          },
        ],
        session: {
          cono: this.currentCompany,
          divi: this.currentDivision,
          panel: 'OIA390BC',
          iid: '6eb46647a42c3420e89dfc2650dfefd2',
          lng: 'GB',
          jobid: '627347afbac5465fa0f6080584053574',
          chgby: '',
          url: '',
          dsep: '.',
          moddate: '',
          user: 'Remco Driessen',
          userid: 'RDRIESSEN',
          df: 'MMDDYY',
          regdate: '',
        },
        program: 'OIS390',
        panel: 'B1',
        screenIdBase: 'OIS390',
      };

      window.parent['infor'].companyon.client.registerMessageHandler;
      window.parent['infor'].companyon.client.sendMessage(type, data);
    } catch (err) {
      //Odin.Log.error("Error in MainCtrl_triggerBusinessContext: " + err);
    }
  }

  iTWSL: string;
  iPRNO: any;
  iMFNO: any;
  iRPQA: any;
  iWHSL: any;
  FACI: string;
  respGR001: IMIResponse;
  respGR002: IMIResponse;
  respGR003: IMIResponse;
  WHLO: any;
  respGR004: IMIResponse;
  respGR005: IMIResponse;
  respGR006: IMIResponse;
  respGR0021: IMIResponse;

  qMFNO() {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('FACI', this.FACI);
        input.setString('MFNO', this.oRORN);
        input.setString('PRNO', this.iPRNO);

        const request: IMIRequest = {
          program: 'PMS100MI',
          transaction: 'Get',
          record: input,
          outputFields: [],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              this.linkedMO1(this.oRORN);
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.openError02(error.errorMessage);
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  cMFNO(event: any) {}

  reqstock: number;
  posstock = false;
  negstock = false;

  cRPQA(event: any) {
    this.reqstock = parseFloat(this.iRPQA) * parseFloat(this.qCNQT);

    setTimeout(() => {
      this.oPJBAL = Math.round(this.oAVAL2C - this.iRPQA);

      if (this.sMFHL !== this.iMFNO) {
        this.oPJBAL = Math.round(this.xMREM - this.iRPQA);
      }

      if (this.oPJBAL > 0) {
        this.pospro = true;
        this.negpro = false;

        if (this.qMO === true) {
          localStorage.setItem('D100', '1');
        }
      } else {
        this.pospro = false;
        this.negpro = true;

        if (this.qMO === true) {
          localStorage.setItem('D100', '');
          localStorage.setItem('D100', this.oPJBAL.toString());
        }
      }
    }, 1000);

    setTimeout(() => {
      this.oPJBALS = Math.round(this.oAVAC - this.iRPQA);

      if (this.oPJBALS > 0) {
        this.posproS = true;
        this.negproS = false;

        if (this.qstock === true && this.packed === true) {
          localStorage.setItem('D100', '1');
        }
      } else {
        this.posproS = false;
        this.negproS = true;

        if (this.qstock === true && this.packed === true) {
          localStorage.setItem('D100', '');
          localStorage.setItem('D100', this.oPJBALS.toString());
        }
      }
    }, 1000);

    setTimeout(() => {
      this.oPJBALP = Math.round(this.xMREM - this.iRPQA);

      if (this.oPJBALP > 0) {
        this.posproP = true;
        this.negproP = false;

        if (this.qstock === true && this.produce === true) {
          localStorage.setItem('D100', '1');
        }
      } else {
        this.posproP = false;
        this.negproP = true;

        if (this.qstock === true && this.produce === true) {
          localStorage.setItem('D100', '');
          localStorage.setItem('D100', this.oPJBALP.toString());
        }
      }
    }, 1000);

    setTimeout(() => {
      this.negmo = false;
      this.posmo = false;

      this.oAVAL3 = this.oAVAL2 - this.iRPQA * this.qCNQT;

      this.oAVAL3C = this.oAVAL3 / this.qCNQT;

      if (this.oAVAL3 > 0) {
        console.log();
        this.posmo = true;
        this.negmo = false;
      } else {
        this.posmo = false;
        this.negmo = true;
      }
    }, 1000);

    this.oAVAP = this.oAVAL - this.reqstock;

    if (this.oAVAP < 0) {
      this.posstock = false;
      this.negstock = true;
    }
    if (this.oAVAP >= 0) {
      this.posstock = true;
      this.negstock = false;
    }

    localStorage.setItem('D007', this.iRPQA);

    this.pBAL = parseFloat(this.xMREM) - parseFloat(this.iRPQA);
    this.oCombined = this.oAVAL + ' / ' + this.oAVAP;
  }
  oAVAP: any;

  cRORN(event: any) {
    this.linkedMO = false;
  }

  linkedMO = true;
  linkedLot = false;
  negative = false;

  cBANO(event: any) {}

  sWHST: any;
  sWHHS: any;

  dialog?: SohoMessageRef;
  sWMST: any;
  qMTNO: any;
  qCNQT: any;
  itemsbano: any[] = [];

  private itemsbanoReady: Promise<void> | null = null;
  private resolveItemsbanoReady: (() => void) | null = null;

  // Option 1 = “latest selection wins” guard + snapshot decision inputs
  // Add this property once in your component (outside the method):
  // private selectionSeq = 0;

  private selectionSeq = 0;

  MFNOLookup() {
    this.globalStore.setPRNO(this.qMTNO);
    this.globalStore.setWCLN(this.sWCLN);

    // snapshot what MO we had BEFORE opening the lookup
    this.currentMO = this.oRORN;

    console.log('current01 ' + this.currentMO + ' ' + this.qMO);

    const lblClose = 'Close';
    const lblUpdate = 'Select';
    const lblTitle = 'MO Lookup';

    const options: SohoModalOptions = {
      cssClass: 'app-modal-window',
    };

    const dialogRef = this.modalService
      .modal(MfnoLookupComponent, this.placeholder, options)
      .buttons([
        {
          text: lblClose,
          click: () => dialogRef.close('CLOSE'),
        },
        {
          text: lblUpdate,
          click: () => dialogRef.close('SUBMIT'),
          isDefault: false,
        },
      ])
      .title(lblTitle)
      .open()
      .beforeClose(() => {
        console.log('before close ' + dialogRef.dialogResult);
        if (dialogRef.dialogResult === 'CANCEL') {
          return true;
        }
      })
      .afterClose(async (result) => {
        console.log('afterClose', result);
        if (result !== 'SUBMIT') return;

        // ✅ token for THIS selection; if another lookup happens, old flow stops applying
        const seq = ++this.selectionSeq;

        // ✅ snapshot previous MO (don’t rely on this.currentMO later)
        const prevMO = this.currentMO;

        // set new MO from lookup
        const selectedMO = this.globalStore.getMFNO();
        this.oRORN = selectedMO;

        console.log('new01 ' + this.newlotno);

        this.linkedMO = true;

        // ✅ wait UpdMO
        await this.linkedMO1Await(selectedMO);
        if (seq !== this.selectionSeq) return;

        // ✅ wait getlinkedMOData
        await this.getlinkedMODataAwait(selectedMO);
        if (seq !== this.selectionSeq) return;

        // ✅ freeze decision inputs BEFORE any further async work can mutate them
        const qMOAtDecision = this.qMO;
        const oBANOAtDecision = this.oBANO;
        const oRORNAtDecision = this.oRORN; // should still be selectedMO
        const prevMOAtDecision = prevMO;

        // ✅ now run GL001 after both are done
        try {
          this.respGL001 = await lastValueFrom(
            this.dataService.GL001(this.FACI, this.iPRNO, this.iMFNO),
          );
          if (seq !== this.selectionSeq) return;

          for (let y6 = 0; y6 < this.respGL001.items.length; y6++) {
            const itemy6 = this.respGL001.items[y6];

            //    this.qCAMU = itemy6.M1CAMU;
            this.qRORN = itemy6.VHRORN;
            this.qMTNO = itemy6.VMMTNO;
            this.qMFHL = itemy6.VHMFHL;
            this.rBANO = itemy6.VMBANO;
            this.xITTY = itemy6.MMITTY;

            console.log('current02 ' + this.qRORN + ' ' + this.qMO);

            // ✅ compute from SNAPSHOTS (not live this.*)
            let newlot = '0';

            // priority: qMO false => always '1' if oBANO filled
            if (!qMOAtDecision && oBANOAtDecision) {
              newlot = '1';
              this.updateMOConnect(this.iMFNO, '1', '');
            } else if (
              !prevMOAtDecision ||
              prevMOAtDecision === oRORNAtDecision
            ) {
              newlot = '0';
              this.updateMOConnect(this.iMFNO, '0', '');
            } else {
              newlot = '1';
              this.updateMOConnect(this.iMFNO, '1', '');
            }

            this.newlotno = newlot;
            localStorage.setItem('BANO', newlot);

            // keep your existing behaviour
            this.oBANO = '';
            this.acamu = false;
            this.qMO = true;
            this.qstock = false;

            // optional: if you need this finished too:
            await this.connectMFNO(this.qRORN, this.FACI, this.qMTNO);
            if (seq !== this.selectionSeq) return;
          }
        } catch (error) {
          // keep your existing behaviour (swallow)
        }
      });
  }

  private linkedMO1Await(rorn: any): Promise<void> {
    return new Promise<void>((resolve) => {
      this.userService.getUserContext().subscribe(
        (_context) => {
          const input = new MIRecord();
          input.setString('FACI', this.FACI);
          input.setString('MFNO', this.iMFNO);
          input.setString('PRNO', this.iPRNO);
          input.setString('RORN', rorn);

          const request: IMIRequest = {
            program: 'PMS100MI',
            transaction: 'UpdMO',
            record: input,
            outputFields: [],
            maxReturnedRecords: this.maxRecords,
            company: this.curcono,
          };

          this.miService.execute(request).subscribe(
            (_response: IMIResponse) => {
              // keep your original behaviour
              this.linkedMO = false;
              resolve();
            },
            (_error) => {
              this.setBusy(false);
              resolve(); // don't block
            },
          );
        },
        (_error) => {
          this.setBusy(false);
          resolve();
        },
      );
    });
  }

  private getlinkedMODataAwait(mfno: any): Promise<void> {
    return new Promise<void>((resolve) => {
      this.userService.getUserContext().subscribe(
        (_context) => {
          const input = new MIRecord();
          input.setString('VHFACI', this.FACI);
          input.setString('F_MFNO', mfno);
          input.setString('T_MFNO', mfno);

          const request: IMIRequest = {
            program: 'CMS100MI',
            transaction: 'Lst_Q_MWOHED2',
            record: input,
            outputFields: [
              'VHORQA',
              'VHRVQA',
              'VHBANO',
              'VHPRNO',
              'VMMTNO',
              'VMBANO',
            ],
            maxReturnedRecords: this.maxRecords,
            company: this.curcono,
          };

          this.miService.execute(request).subscribe(
            (response: IMIResponse) => {
              if (!response.hasError()) {
                for (let i = 0; i < response.items.length; i++) {
                  const item = response.items[i];

                  // keep your existing behaviour
                  this.getlinkedMOData02(mfno);

                  localStorage.removeItem('D010');
                  localStorage.setItem('D010', item.VHBANO);

                  this.yyBANO = item.VMBANO;
                  this.rrMTNO = item.VMMTNO;
                }

                this.updateGridData();
              } else {
                this.setBusy(false);
              }

              resolve();
            },
            (_error) => {
              this.setBusy(false);
              resolve();
            },
          );
        },
        (_error) => {
          this.setBusy(false);
          resolve();
        },
      );
    });
  }

  async getlinkedMOData02(rorn) {
    try {
      this.respGR011 = await lastValueFrom(
        this.dataService.GR011(this.FACI, rorn),
      );
      for (let y1 = 0; y1 < this.respGR011.items.length; y1++) {
        const itemy1 = this.respGR011.items[y1];
        this.zMFHL = itemy1.VHMFHL;
      }
    } catch (error) {}

    if (rorn !== this.zMFHL && this.packed == true) {
      this.checkBOM02(this.zMFHL);
    }

    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('F_RIDN', rorn);
        input.setString('T_RIDN', rorn);

        const request: IMIRequest = {
          program: 'CMS100MI',
          transaction: 'Lst_QREM',
          record: input,
          outputFields: ['MTTRQT', 'VHMFHL'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                //      this.oAVAL2 = -parseFloat(item.MTTRQT);
                this.oAVAL2 = Math[this.oAVAL2 < 0 ? 'ceil' : 'floor'](
                  -parseFloat(item.MTTRQT),
                );
                //    this.oAVAL2C = -parseFloat(item.MTTRQT) / this.qCNQT;
                this.oAVAL2C = Math.floor(
                  -parseFloat(item.MTTRQT) / this.qCNQT,
                );

                console.log(
                  'ffd ' + rorn + ' ' + this.zMFHL + ' ' + this.packed,
                );

                if (rorn !== this.zMFHL && this.packed == true) {
                  this.checkBOM02(this.zMFHL);
                }

                setTimeout(() => {
                  this.oPJBAL = this.oAVAL2C - this.iRPQA;

                  if (this.sMFHL !== this.iMFNO) {
                    this.oPJBAL = Math.round(this.xMREM - this.iRPQA);
                  }

                  if (this.oPJBAL > 0) {
                    this.pospro = true;
                    this.negpro = false;

                    if (this.qMO === true) {
                      localStorage.setItem('D100', '1');
                    }
                  } else {
                    this.pospro = false;
                    this.negpro = true;

                    if (this.qMO === true) {
                      localStorage.setItem('D100', '');
                      localStorage.setItem('D100', this.oPJBAL.toString());
                    }
                  }
                }, 1500);

                setTimeout(() => {
                  this.oPJBALS = this.oAVAC - this.iRPQA;

                  if (this.oPJBALS > 0) {
                    this.posproS = true;
                    this.negproS = false;

                    if (this.packed === true && this.qstock === true) {
                      localStorage.setItem('D100', '1');
                    }
                  } else {
                    this.posproS = false;
                    this.negproS = true;

                    if (this.packed === true && this.qstock === true) {
                      localStorage.setItem('D100', '');
                      localStorage.setItem('D100', this.oPJBALS.toString());
                    }
                  }
                }, 1500);

                setTimeout(() => {
                  this.posmo = false;
                  this.negmo = false;
                  this.oAVAL3 = this.oAVAL2 - this.iRPQA * this.qCNQT;
                  this.oAVAL3C = this.oAVAL3 / this.qCNQT;

                  if (this.oAVAL3 > 0) {
                    this.posmo = true;
                    this.negmo = false;
                  } else {
                    this.posmo = false;
                    this.negmo = true;
                  }
                }, 1500);
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }
  checkBOM02(mfhl) {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('F_MFHL', mfhl);
        input.setString('T_MFHL', mfhl);
        input.setString('VHFACI', this.FACI);
        input.setString('VHMFHL', mfhl);

        const request: IMIRequest = {
          program: 'CMS100MI',
          transaction: 'Lst_QMREM2',
          record: input,
          outputFields: [
            'VHMFNO',
            'VHMFHL',
            'VHRVQT',
            'VMCRTM',
            'VMBANO',
            'VMMTNO',
            'MTBANO',
          ],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                this.received = item.VHRVQT;
                this.xxBANO = item.MTBANO;
                this.xxMTNO = item.VMMTNO;

                console.log('at10_01 ' + this.xxMTNO + ' ' + this.xxBANO);
                //0103            this.ListAttributes(this.xxMTNO, this.xxBANO);
                this.getordered(mfhl);
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }
  getordered(mfhl: any) {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('F_RIDN', mfhl);
        input.setString('T_RIDN', mfhl);

        const request: IMIRequest = {
          program: 'CMS100MI',
          transaction: 'Lst_QREM',
          record: input,
          outputFields: ['MTTRQT'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                this.washedx =
                  -parseFloat(item.MTTRQT) - parseFloat(this.received);

                this.oAVAL2 = this.washedx;

                //    this.oAVAL2C = this.washedx / this.qCNQT;
                this.oAVAL2C = Math.floor(this.washedx / this.qCNQT);

                setTimeout(() => {
                  this.oPJBAL = this.oAVAL2C - this.iRPQA;

                  if (this.oPJBAL > 0) {
                    this.pospro = true;
                    this.negpro = false;

                    if (this.qMO === true) {
                      localStorage.setItem('D100', '1');
                    }
                  } else {
                    this.pospro = false;
                    this.negpro = true;

                    if (this.qMO === true) {
                      localStorage.setItem('D100', '');
                      localStorage.setItem('D100', this.oPJBAL.toString());
                    }
                  }
                }, 1500);

                setTimeout(() => {
                  this.oPJBALS = this.oAVAC - this.iRPQA;

                  if (this.oPJBALS > 0) {
                    this.posproS = true;
                    this.negproS = false;

                    if (this.packed === true && this.qstock === true) {
                      localStorage.setItem('D100', '1');
                    }
                  } else {
                    this.posproS = false;
                    this.negproS = true;

                    if (this.packed === true && this.qstock === true) {
                      localStorage.setItem('D100', '');
                      localStorage.setItem('D100', this.oPJBALS.toString());
                    }
                  }
                }, 1500);

                setTimeout(() => {
                  this.posmo = false;
                  this.negmo = false;
                  this.oAVAL3 = this.oAVAL2 - this.iRPQA * this.qCNQT;
                  this.oAVAL3C = this.oAVAL3 / this.qCNQT;

                  if (this.oAVAL3 > 0) {
                    this.posmo = true;
                    this.negmo = false;
                  } else {
                    this.posmo = false;
                    this.negmo = true;
                  }
                }, 1500);
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  linkedMO1(rorn) {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('FACI', this.FACI);
        input.setString('MFNO', this.iMFNO);
        input.setString('PRNO', this.iPRNO);
        input.setString('RORN', rorn);

        const request: IMIRequest = {
          program: 'PMS100MI',
          transaction: 'UpdMO',
          record: input,
          outputFields: [],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              this.linkedMO = false;
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.openError02(error.errorMessage);
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  openError02(errormessage) {
    const buttons = [
      {
        text: 'Close',
        click: (_e: any, modal: any) => {
          modal.close(true);
          (this.dialog as any) = null;
        },
        isDefault: true,
      },
    ];

    this.dialog = this.messageService
      .error()
      .title('<span>Alert</span>')
      .message(errormessage)
      .buttons(buttons)
      .beforeOpen(() => {
        console.log('before open');
        return true;
      })
      .beforeClose(() => {
        console.log('before close');
        return true;
      })
      .open();
  }

  // add once in component:
  private banoSelectionSeq = 0;

  BANOLookup() {
    this.globalStore.setPRNO(this.qMTNO);

    // snapshot the "before" lot at the time you open lookup
    this.beforeBANO = this.oBANO;

    console.log('rub01 ' + this.beforeBANO);

    const lblClose = 'Close';
    const lblUpdate = 'Select';
    const lblTitle = 'Lot Number Lookup';
    const options: SohoModalOptions = { cssClass: 'app-modal-window' };

    const dialogRef = this.modalService
      .modal(BanoLookupComponent, this.placeholder, options)
      .buttons([
        { text: lblClose, click: () => dialogRef.close('CLOSE') },
        {
          text: lblUpdate,
          click: () => dialogRef.close('SUBMIT'),
          isDefault: false,
        },
      ])
      .title(lblTitle)
      .open()
      .beforeClose(() => {
        console.log('before close ' + dialogRef.dialogResult);
        if (dialogRef.dialogResult === 'CANCEL') return true;
      })
      .afterClose(async (result) => {
        console.log('afterClose', result);
        if (result !== 'SUBMIT') return;

        // ✅ token for THIS selection; if another lookup happens, old flow stops applying
        const seq = ++this.banoSelectionSeq;

        // ✅ snapshot inputs that affect newlotno decision
        const beforeBANOAtOpen = this.beforeBANO;
        const qMOAtDecision0 = this.qMO;

        // take selected values from the lookup
        const selectedBANO = this.globalStore.getBANO();
        const selectedCAMU = this.globalStore.getCAMU();

        // apply selected values
        this.oBANO = selectedBANO;
        this.qCAMU = selectedCAMU;

        // wait update mat line
        await this.updateBANOAwait(selectedBANO);
        if (seq !== this.banoSelectionSeq) return;

        // ✅ decide using SNAPSHOTS + selected values (not live-mutating fields)
        let newlot = '0';

        if (qMOAtDecision0 && selectedBANO) {
          newlot = '1';

          this.updateMOConnect(this.iMFNO, '1', selectedCAMU);
        } else if (!beforeBANOAtOpen || selectedBANO === beforeBANOAtOpen) {
          newlot = '0';
          this.updateMOConnect(this.iMFNO, '0', selectedCAMU);
        } else {
          newlot = '1';
          this.updateMOConnect(this.iMFNO, '1', selectedCAMU);
        }

        this.newlotno = newlot;
        localStorage.setItem('BANO', newlot);

        // Check connection according latest transaction 1
        try {
          this.respGL001 = await lastValueFrom(
            this.dataService.GL001(this.FACI, this.iPRNO, this.iMFNO),
          );
          if (seq !== this.banoSelectionSeq) return;

          for (let y6 = 0; y6 < this.respGL001.items.length; y6++) {
            const itemy6 = this.respGL001.items[y6];

            //    this.qCAMU = itemy6.M1CAMU;
            this.qRORN = itemy6.VHRORN;
            this.qMTNO = itemy6.VMMTNO;
            this.qMFHL = itemy6.VHMFHL;
            this.rBANO = itemy6.VMBANO;
            this.xITTY = itemy6.MMITTY;

            // if connectBANO is async in the future, you can await it + seq guard again
            this.connectBANO(this.qMFHL, this.FACI, this.qMTNO);
            if (seq !== this.banoSelectionSeq) return;
          }
        } catch (error) {}

        // keep your existing behaviour
        this.acamu = true;
        this.oRORN = '';
        this.linkedMO1('?');

        console.log(
          'at10_02 ' + this.qMTNO + ' ' + this.oBANO + ' ' + this.qCAMU,
        );

        localStorage.setItem('D010', this.oBANO);
        localStorage.setItem('D011', selectedCAMU);

        this.oAVAP =
          parseFloat(this.globalStore.getSTQT()) - this.iRPQA * this.qCNQT;
        this.oAVAL = parseFloat(this.globalStore.getSTQT());
        this.oAVAC = +this.qCNQT ? Math.floor(this.oAVAL / +this.qCNQT) : 0;

        if (this.oAVAP <= 0) {
          this.posstock = false;
          this.negstock = true;
        }
        if (this.oAVAP > 0) {
          this.posstock = true;
          this.negstock = false;
        }

        this.qstock = true;
        this.qMO = false;

        this.oPJBAL = Math.round(this.oAVAL2C - this.iRPQA);
        this.oPJBALS = Math.round(this.oAVAC - this.iRPQA);
        this.oPJBALP = Math.round(this.xMREM - this.iRPQA);

        if (this.oPJBAL > 0) {
          this.pospro = true;
          this.negpro = false;
        } else {
          this.pospro = false;
          this.negpro = true;
        }

        if (this.oPJBALS > 0) {
          this.posproS = true;
          this.negproS = false;

          if (this.packed === true && this.qstock === true) {
            localStorage.setItem('D100', '1');
          }
        } else {
          this.posproS = false;
          this.negproS = true;

          if (this.packed === true && this.qstock === true) {
            localStorage.setItem('D100', '');
            localStorage.setItem('D100', this.oPJBALS.toString());
          }
        }

        if (this.oPJBALP > 0) {
          this.posproP = true;
          this.negproP = false;

          if (this.produce === true && this.qstock === true) {
            localStorage.setItem('D100', '1');
          }
        } else {
          this.posproP = false;
          this.negproP = true;

          if (this.produce === true && this.qstock === true) {
            localStorage.setItem('D100', '');
            localStorage.setItem('D100', this.oPJBALP.toString());
          }
        }

        setTimeout(() => {
          // if a newer selection happened, don’t apply stale setTimeout recalcs
          if (seq !== this.banoSelectionSeq) return;

          this.oPJBAL = Math.round(this.oAVAL2C - this.iRPQA);

          if (this.oPJBAL > 0) {
            this.pospro = true;
            this.negpro = false;

            if (this.qMO === true) {
              localStorage.setItem('D100', '1');
            }
          } else {
            this.pospro = false;
            this.negpro = true;

            if (this.qMO === true) {
              localStorage.setItem('D100', '');
              localStorage.setItem('D100', this.oPJBAL.toString());
            }
          }
        }, 1000);

        setTimeout(() => {
          if (seq !== this.banoSelectionSeq) return;

          this.oPJBALS = Math.round(this.oAVAC - this.iRPQA);

          if (this.oPJBALS > 0) {
            this.posproS = true;
            this.negproS = false;

            if (this.packed === true && this.qstock === true) {
              localStorage.setItem('D100', '1');
            }
          } else {
            this.posproS = false;
            this.negproS = true;

            if (this.packed === true && this.qstock === true) {
              localStorage.setItem('D100', '');
              localStorage.setItem('D100', this.oPJBALS.toString());
            }
          }
        }, 1000);
      });
  }
  updateMOConnect(mfno, lot, camu) {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('FILE', 'CONNECTMO');
        input.setString('PK01', mfno);

        const request: IMIRequest = {
          program: 'CUSEXTMI',
          transaction: 'GetFieldValue',
          record: input,
          outputFields: ['A030', 'A130'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                this.updateRecord(mfno, lot, camu);
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.addRecord(mfno, lot, camu);
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }
  async addRecord(mfno, lot, camu) {
    try {
      this.respGL00z7 = await lastValueFrom(
        this.dataService.addConnection(mfno, lot, camu),
      );
    } catch (error) {}
  }
  async updateRecord(mfno, lot, camu) {
    // check on lot number status
    try {
      this.respGL00z6 = await lastValueFrom(
        this.dataService.updConnection(mfno, lot, camu),
      );
    } catch (error) {}
  }

  private updateBANOAwait(bano: any): Promise<void> {
    return new Promise<void>((resolve) => {
      this.userService.getUserContext().subscribe(
        (_context) => {
          const input = new MIRecord();
          input.setString('FACI', this.FACI);
          input.setString('PRNO', this.iPRNO);
          input.setString('MFNO', this.iMFNO);
          input.setString('BANO', bano);
          input.setString('MSEQ', this.qMSEQ);

          const request: IMIRequest = {
            program: 'PMS100MI',
            transaction: 'UpdMatLine',
            record: input,
            outputFields: [],
            maxReturnedRecords: this.maxRecords,
            company: this.curcono,
          };

          this.miService.execute(request).subscribe(
            (_response: IMIResponse) => {
              // keep behaviour (you currently do nothing on success)
              resolve();
            },
            (_error) => {
              // keep behaviour
              this.setBusy(false);
              resolve(); // don't block flow
            },
          );
        },
        (_error) => {
          this.setBusy(false);
          resolve();
        },
      );
    });
  }

  async CheckFinishedLot(prno, bano): Promise<void> {
    console.log('finished ' + prno + ' ' + bano);
    console.log('receivedw ' + this.oRVQA);

    this.attra = [];
    const input = new MIRecord();

    // ✅ If ListAttributes is currently loading itemsbano, wait for it
    if (this.itemsbanoReady) {
      try {
        await this.itemsbanoReady;
      } catch {
        // ignore; keep behaviour as "best effort"
      }
    }

    try {
      // keep structure same as your subscribe chain
      const _context = await lastValueFrom(this.userService.getUserContext());

      const rec = new MIRecord();
      rec.setString('AGITNO', prno);
      rec.setString('AGBANO', bano);

      const request: IMIRequest = {
        program: 'CMS100MI',
        transaction: 'Lst_GR_ATID',
        record: rec,
        outputFields: ['AGATID', 'AGATVA', 'AGATVN', 'AATX30'],
        maxReturnedRecords: this.maxRecords,
        company: this.curcono,
      };

      const response: IMIResponse = await lastValueFrom(
        this.miService.execute(request),
      );

      if (!response.hasError()) {
        for (let i = 0; i < response.items.length; i++) {
          const item = response.items[i];

          if (
            item.AGATID === 'CROPCYCLE' ||
            item.AGATID === 'SIZE' ||
            item.AGATID === 'VARIETY' ||
            item.AGATID === 'FIELD' ||
            item.AGATID === 'GNAME' ||
            item.AGATID === 'GAREA'
          ) {
            this.attra.push({
              ATID: item.AATX30.trim(),
              ATVA: item.AGATVA.trim(),
              ATVN: item.AGATVN.trim(),
              ATID2: item.AGATID.trim(),
            });
          }
        }

        console.log('q01' + JSON.stringify(this.attra));
        console.log('q02' + this.qMTNO + ' ' + this.oBANO);
        console.log('q03' + this.rrMTNO + ' ' + this.yyBANO);
        console.log('q01' + JSON.stringify(this.attra));

        // ✅ Deterministic compare (no setTimeout)
        const norm = (arr: any[]) =>
          (arr ?? [])
            .map((x) => ({
              ATID2: (x.ATID2 ?? '').toString().trim(),
              ATVA: (x.ATVA ?? '').toString().trim(),
            }))
            .sort((a, b) => a.ATID2.localeCompare(b.ATID2));

        console.log('new04 ' + this.newlotno);

        if (this.attra.length === 0) {
          this.newlotno = '0';
          localStorage.setItem('BANO', this.newlotno);
        }

        console.log('blot03 ' + this.newlotno);

        //  else {
        //    this.newlotno =
        //     JSON.stringify(norm(this.attra)) ===
        //    JSON.stringify(norm(this.itemsbano))
        //      ? '0'
        //      : '1';
        //  }

        //    localStorage.setItem('BANO', this.newlotno);

        //if received qty == 0
        if (parseFloat(this.oRVQA) === 0 || this.packed === true) {
          if (this.oRORN === '') {
            this.CheckComponentAttributes(this.qMTNO, this.oBANO);
          } else {
            this.CheckComponentAttributes(this.rrMTNO, this.yyBANO);
          }
        } else {
          this.CheckMOAttributes(this.iMFNO);
        }
      } else {
        this.setBusy(false);
      }
    } catch (error) {
      this.setBusy(false);
    }
  }

  CheckMOAttributes(mfno) {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('ORCA', '101');
        input.setString('RIDN', mfno);

        const request: IMIRequest = {
          program: 'ATS101MI',
          transaction: 'LstAttrByRef',
          record: input,
          outputFields: ['ATID', 'ATAV'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                if (item.ATID === 'CROPCYCLE')
                  localStorage.setItem('CROPCYCLE', item.ATAV.trim());
                if (item.ATID === 'SIZE')
                  localStorage.setItem('SIZE', item.ATAV.trim());
                if (item.ATID === 'VARIETY')
                  localStorage.setItem('VARIETY', item.ATAV.trim());
                if (item.ATID === 'FIELD')
                  localStorage.setItem('FIELD', item.ATAV.trim());
                if (item.ATID === 'GNAME')
                  localStorage.setItem('GNAME', item.ATAV.trim());
                if (item.ATID === 'GAREA')
                  localStorage.setItem('GAREA', item.ATAV.trim());
              }

              //    this.newlotno = '0';

              //trigger new lot number, or keep the same one
              //    localStorage.removeItem('BANO');
              //    localStorage.setItem('BANO', this.newlotno);
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  CheckComponentAttributes(prno, bano) {
    this.attrb = [];

    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('AGITNO', prno);
        input.setString('AGBANO', bano);

        const request: IMIRequest = {
          program: 'CMS100MI',
          transaction: 'Lst_GR_ATID',
          record: input,
          outputFields: ['AGATID', 'AGATVA', 'AGATVN'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                if (item.AGATID === 'CROPCYCLE')
                  localStorage.setItem('CROPCYCLE', item.AGATVA.trim());
                if (item.AGATID === 'SIZE')
                  localStorage.setItem('SIZE', item.AGATVA.trim());
                if (item.AGATID === 'VARIETY')
                  localStorage.setItem('VARIETY', item.AGATVA.trim());
                if (item.AGATID === 'FIELD')
                  localStorage.setItem('FIELD', item.AGATVA.trim());
                if (item.AGATID === 'GNAME')
                  localStorage.setItem('GNAME', item.AGATVA.trim());
                if (item.AGATID === 'GAREA')
                  localStorage.setItem('GAREA', item.AGATVA.trim());

                if (
                  item.AGATID === 'CROPCYCLE' ||
                  item.AGATID === 'SIZE' ||
                  item.AGATID === 'VARIETY' ||
                  item.AGATID === 'FIELD' ||
                  item.AGATID === 'GNAME' ||
                  item.AGATID === 'GAREA'
                ) {
                  this.attrb.push({
                    ATID: item.AGATID.trim(),
                    ATVA: item.AGATVA.trim(),
                    ATVN: item.AGATVN.trim(),
                  });
                }
              }

              //           console.log('attra1 ' + JSON.stringify(this.attra));
              //          console.log('attrb1 ' + JSON.stringify(this.itemsbano));

              //         if (this.attra.length === 0) {
              // No attributes returned → ignore, keep lot number unchanged
              //          this.newlotno = '0';
              //       } else {
              //        if (
              //         JSON.stringify(this.attra) === JSON.stringify(this.itemsbano)
              //       ) {
              //          console.log('attributes01');
              //          this.newlotno = '0'; // same attributes
              //        } else {
              //          console.log('attributes02');
              //          this.newlotno = '1'; // attributes changed
              //        }
              //      }

              //trigger new lot number, or keep the same one
              //     localStorage.removeItem('BANO');
              //     localStorage.setItem('BANO', this.newlotno);
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  updateBANO(bano) {
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('FACI', this.FACI);
        input.setString('PRNO', this.iPRNO);
        input.setString('MFNO', this.iMFNO);
        input.setString('BANO', bano);
        input.setString('MSEQ', this.qMSEQ);

        const request: IMIRequest = {
          program: 'PMS100MI',
          transaction: 'UpdMatLine',
          record: input,
          outputFields: [],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              //   this.toastService.show({ title: 'LotNo ' + bano + ' has been connected', message: '' });
              //       this.ListAttributes(bano);
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.openError02(error.errorMessage);
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  iCFI1: any;
  iCFI2: any;
  workcenter: any;
  iCFI1a: any;
  faci: string;

  unconnected: boolean;
  oCUCL: any;
  oRORN: any;
  oMAQA: any;
  oRVQA: any;
  oORQA: any;
  qPRNO: any;
  qITDS: any;
  oAVAL: any;

  placeholder: ViewContainerRef;
  oBANO: any;
  sITDS: any;

  CFI4Lookup() {
    throw new Error('Method not implemented.');
  }

  iCFI4: any;
  cCFI4($event: any) {
    throw new Error('Method not implemented.');
  }
  CFI3Lookup() {
    throw new Error('Method not implemented.');
  }
  iCFI3: any;
  cCFI3($event: any) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('ReportDatagrid') datagrid: SohoDataGridComponent;

  datagridOptions: SohoDataGridOptions;
  items: any[] = [];
  detailItem: any;
  hasSelected: boolean;
  isBusy = false;
  isDetailBusy = false;
  sum: number;
  reportstatus: string;

  private maxRecords = 10000;
  private pageSize = 20;

  private DWDTfrom = '00000000';
  private DWDTto = '99999999';
  private PLDTfrom = '00000000';
  private PLDTto = '99999999';
  private PUDTfrom = '00000000';
  private PUDTto = '99999999';

  input01: string;
  items001: any[] = [];
  items002: any[] = [];
  poresult: any[] = [];
  poresult15: any[] = [];
  poresult20: any[] = [];
  poresult40: any[] = [];
  poresult75: any[] = [];
  poresult85: any[] = [];
  selitem: any;
  iPNLI: any;
  iPONO: any;
  status01s: string;
  status02s: string;
  poresult20L: any[];
  poresult40L: any[];
  poresult75L: any[];
  poresult85L: any[];
  items004: any[] = [];
  poresult2: any[];
  items005: any[] = [];
  poresult3: any[];
  season: string;
  supplier01: string;
  planfrom: string;
  planto: string;
  reqfrom: string;
  reqto: string;
  planfromO: string;
  plantoO: string;
  reqfromO: string;
  reqtoO: string;
  items006: any[] = [];
  poresult4: any[] = [];

  myDate = new Date();
  curdate01: string;
  curtime01: string;
  curtimestamp: string;
  today: number = Date.now();
  curdatexx1: number;
  curdatel: string;
  curdatem: string;

  api001: string;
  api002: string;
  api003: string;
  api004: string;
  api005: string;
  ordfromO: string;
  ordfrom: any;
  ordto: string;
  ordtoO: string;
  items100: any[] = [];
  items001F: any[] = [];
  items002F: any[] = [];
  items003F: any[] = [];
  items004F: any[] = [];
  items005F: any[] = [];
  poresult2f: any[] = [];
  poresult3f: any[] = [];
  poresult4f: any[] = [];
  poresultf: any[] = [];
  items001FG: any = [];
  items002FG: any = [];
  items003FG: any = [];
  items004FG: any = [];
  items005FG: any = [];
  items001T: any = [];
  Items001T: any[];
  text: string;
  puno: any;
  pnli: any;
  potext01: string;
  potextarr: any = [];
  phead: any;
  pline: any;
  poheadT: any;
  polinT: any;
  potextarr1: any = [];
  curcono: string;
  fromord: number;
  toord: number;
  ordfromN: number;
  ordtoN: number;
  index: any;
  queryid: number;
  queryId: any;
  querystatus: string;
  curstatus: string;
  currows: string;
  puno1: string;
  PUNO1: string;
  result001: any = [];
  resultset: any = [];
  body01: any;
  polines: any = [];
  subr01: string;
  items001x01: any = [];
  iREPN: any;
  iWHLO: any;
  iCUNO: any;
  nvalue: any;
  nta3: any;
  count: number;
  TX15: any;
  STKY: any;
  AITM: any;

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:variable-name
  constructor(
    private toastService: SohoToastService,
    private dataService: DataService,
    private ionApiService: IonApiService,
    private datePipe: DatePipe,
    private globalStore: GlobalStore,
    private _interactionService: InteractionService,
    private modalService: SohoModalDialogService,
    private miService: MIService,
    private userService: UserService,
    private messageService: SohoMessageService,
    private applicationService: ApplicationService,
  ) {
    super('ReportComponent');

    this.userService.getUserContext().subscribe(
      (userContext: IUserContext) => {
        this.userContext = userContext;
        const lang = userContext.currentLanguage;
        const divi = userContext.currentDivision;
        this.curcono = userContext.currentCompany;
        this.curdivi = userContext.currentDivision;
        this.usid = userContext.USID;
      },
      (errorContext: IUserContext) => {
        // Handle error
      },
    );

    this.initGrid();
  }

  async ngOnInit() {
    this.items001x01 = [];

    this.FACI = localStorage.getItem('D003');
    this.iMFNO = localStorage.getItem('D004');
    this.iPRNO = localStorage.getItem('D005');

    this.globalStore.setFACI(this.FACI);

    this.getMOAttributeNO(this.iMFNO);

    localStorage.setItem('ISSUE', '');
    localStorage.setItem('ISSUE', '0');

    this.newlotno = '0';
    localStorage.setItem('BANO', this.newlotno);

    this.checkIssueManual();

    //Check connection according latest transaction 1
    try {
      this.respGL001 = await lastValueFrom(
        this.dataService.GL001(this.FACI, this.iPRNO, this.iMFNO),
      );
      for (let y6 = 0; y6 < this.respGL001.items.length; y6++) {
        const itemy6 = this.respGL001.items[y6];

        //   this.qCAMU = itemy6.M1CAMU;
        this.qRORN = itemy6.VHRORN;
        this.qMTNO = itemy6.VMMTNO;
        this.qMFHL = itemy6.VHMFHL;
        this.rBANO = itemy6.VMBANO;
        this.xITTY = itemy6.MMITTY;

        if (this.qRORN) {
          this.connectMFNO(this.qRORN, this.FACI, this.qMTNO);
        } else {
          this.connectBANO(this.qMFHL, this.FACI, this.qMTNO);
        }
      }
    } catch (error) {}

    //Get MO and product number
    try {
      this.respGR001 = await lastValueFrom(
        this.dataService.GR001(this.FACI, this.iPRNO, this.iMFNO),
      );

      for (let y = 0; y < this.respGR001.items.length; y++) {
        const item = this.respGR001.items[y];

        this.oORQA = item.VHORQA;
        this.oMAQA = item.VOMAQA;
        this.oRVQA = item.VHRVQA;
        this.oRORN = item.VHRORN;
        this.sITDS = item.MMITDS;
        this.sMFHL = item.VHMFHL;

        if (this.oRORN !== '') {
          this.qstock = false;
          this.qMO = true;

          this.getlinkedMOData(this.oRORN);

          this.linkedMO = false;
        } else {
          this.qstock = true;
          this.qMO = false;
          this.linkedMO = true;
        }

        this.sWHST = item.VHWHST;
        this.sWHHS = item.VHWHHS;
        this.sWMST = item.VHWMST;
        this.sWCLN = item.VHWCLN;
        this.xBANO = item.VHBANO;

        this.getWashedBalance(this.iMFNO);

        if (this.sWHST === '10') {
          this.sWHST = '10- Preliminary';
        }
        if (this.sWHST === '20') {
          this.sWHST = '20- Definitive';
        }
        if (this.sWHST === '40') {
          this.sWHST = '40- Component availability checked';
        }
        if (this.sWHST === '50') {
          this.sWHST = '50- Work center scheduled';
        }
        if (this.sWHST === '60') {
          this.sWHST = '60- Order started';
        }
        if (this.sWHST === '80') {
          this.sWHST = '80- Order completed, but not fully reported';
        }
        if (this.sWHST === '90') {
          this.sWHST = '90- Order ready for cost follow up';
        }

        if (this.sWHHS === '10') {
          this.sWHHS = '10- Preliminary';
        }
        if (this.sWHHS === '20') {
          this.sWHHS = '20- Definitive';
        }
        if (this.sWHHS === '34') {
          this.sWHHS = '34- Previous operation ready to start';
        }
        if (this.sWHHS === '35') {
          this.sWHHS = '35- Previous operation dispatch list configured';
        }
        if (this.sWHHS === '36') {
          this.sWHHS = '36- Previous operation started';
        }
        if (this.sWHHS === '37') {
          this.sWHHS = '37- Previous operation partially reported';
        }
        if (this.sWHHS === '40') {
          this.sWHHS = '40- Ready to start / previous operation done';
        }
        if (this.sWHHS === '50') {
          this.sWHHS = '50- Dispatch list configured';
        }
        if (this.sWHHS === '60') {
          this.sWHHS = '60- Started';
        }
        if (this.sWHHS === '70') {
          this.sWHHS = '70- Paritally reported';
        }
        if (this.sWHHS === '80') {
          this.sWHHS = '80- Stopped';
        }
        if (this.sWHHS === '89') {
          this.sWHHS = '89- Flagged as completed - work order not closed';
        }
        if (this.sWHHS === '90') {
          this.sWHHS = '90- Finish marked';
        }

        if (this.sWMST === '22') {
          this.sWMST = '22- Remains to allocate';
        }
        if (this.sWMST === '33') {
          this.sWMST = '33- Allocated';
        }
        if (this.sWMST === '44') {
          this.sWMST = '44- Picking list printed';
        }
        if (this.sWMST === '99') {
          this.sWMST = '99- Material issues reported';
        }

        if (item.MMITTY === 'PRD') {
          this.items001x01.push({
            MFNO: item.VHMFNO,
            ITDS: item.MMITDS,
            ORQA: item.VHORQA,
            MAQA: item.VHMAQA,
            RVQA: item.VHRVQA,
            RORN: item.VHRORN,
          });
        }

        if (item.MMITTY === 'PRD') {
          this.produce = true;
          this.packed = false;
        } else {
          this.produce = false;
          this.packed = true;
        }

        //        this.getlinkedproduct(item.VHRORN)
      }
    } catch (error) {}

    //Get reverse BOM

    if (this.iMFNO !== this.sMFHL) {
      try {
        this.respGR009 = await lastValueFrom(
          this.dataService.GR009(this.FACI, this.sMFHL),
        );
        for (let y1 = 0; y1 < this.respGR009.items.length; y1++) {
          const itemy1 = this.respGR009.items[y1];
          this.hPRNO = itemy1.VHPRNO;
          this.hMFNO = itemy1.VHMFNO;
        }
      } catch (error) {}

      //Get Work Centre
      try {
        this.respGR001Z = await lastValueFrom(
          this.dataService.GR001Z(this.FACI, this.hPRNO, this.hMFNO),
        );
        for (let y2 = 0; y2 < this.respGR001Z.items.length; y2++) {
          const itemy2 = this.respGR001Z.items[y2];

          this.qMSEQ = itemy2.VMMSEQ;
          this.qMTNO = itemy2.VMMTNO;
          this.qCNQT = parseFloat(itemy2.VMCNQT).toFixed(1);
          this.qITDS = itemy2.MMITDS;
        }
      } catch (error) {}

      //Get Work Centre
      try {
        this.respGR002 = await lastValueFrom(
          this.dataService.GR002(this.FACI, this.hPRNO, this.hMFNO),
        );
        for (let y1 = 0; y1 < this.respGR002.items.length; y1++) {
          const itemy1 = this.respGR002.items[y1];
          this.workcenter = itemy1.PLGR;
          this.iPLGR = this.workcenter;
        }
      } catch (error) {}

      //Get Materials
      try {
        this.respGR005 = await lastValueFrom(
          this.dataService.GR005(this.FACI, this.hPRNO, this.hMFNO),
        );
        for (let y1 = 0; y1 < this.respGR005.items.length; y1++) {
          const itemy1 = this.respGR005.items[y1];
          //    this.qMTNO = itemy1.MTNO;
          //   this.qCNQT = parseFloat(itemy1.CNQT).toFixed(0);
          //  this.qITDS = itemy1.ITDS;
        }

        this.listlotno(this.FACI, this.hPRNO, this.hMFNO);
      } catch (error) {}

      //Get Location info
      try {
        this.respGR003 = await lastValueFrom(
          this.dataService.GR003(this.FACI, this.workcenter),
        );

        for (let y1 = 0; y1 < this.respGR003.items.length; y1++) {
          const itemy1 = this.respGR003.items[y1];
          this.iTWSL = itemy1.TWSL;
          this.iWHSL = itemy1.WHSL;

          this.globalStore.setWHSL(this.iTWSL);

          localStorage.setItem('D008', this.iTWSL);
        }
      } catch (error) {}

      this.getWashedBalance(this.hMFNO);
    } else {
      //Get Work Centre
      try {
        this.respGR001Z = await lastValueFrom(
          this.dataService.GR001Z(this.FACI, this.iPRNO, this.iMFNO),
        );
        for (let y2 = 0; y2 < this.respGR001Z.items.length; y2++) {
          const itemy2 = this.respGR001Z.items[y2];

          this.qMSEQ = itemy2.VMMSEQ;
          this.qMTNO = itemy2.VMMTNO;
          this.qCNQT = parseFloat(itemy2.VMCNQT).toFixed(1);
          this.qITDS = itemy2.MMITDS;
        }
      } catch (error) {}

      //Get Work Centre
      try {
        this.respGR002 = await lastValueFrom(
          this.dataService.GR002(this.FACI, this.iPRNO, this.iMFNO),
        );
        for (let y1 = 0; y1 < this.respGR002.items.length; y1++) {
          const itemy1 = this.respGR002.items[y1];
          this.workcenter = itemy1.PLGR;
          this.iPLGR = this.workcenter;
        }
      } catch (error) {}

      //Get Materials
      try {
        this.respGR005 = await lastValueFrom(
          this.dataService.GR005(this.FACI, this.iPRNO, this.iMFNO),
        );
        for (let y1 = 0; y1 < this.respGR005.items.length; y1++) {
          const itemy1 = this.respGR005.items[y1];
          //    this.qMTNO = itemy1.MTNO;
          //   this.qCNQT = parseFloat(itemy1.CNQT).toFixed(0);
          //  this.qITDS = itemy1.ITDS;
        }

        this.listlotno(this.FACI, this.iPRNO, this.iMFNO);
      } catch (error) {}

      //Get Location info
      try {
        this.respGR003 = await lastValueFrom(
          this.dataService.GR003(this.FACI, this.workcenter),
        );

        for (let y1 = 0; y1 < this.respGR003.items.length; y1++) {
          const itemy1 = this.respGR003.items[y1];
          this.iTWSL = itemy1.TWSL;
          this.iWHSL = itemy1.WHSL;

          this.globalStore.setWHSL(this.iTWSL);

          localStorage.setItem('D008', this.iTWSL);
        }
      } catch (error) {}
    }

    //CheckStock

    this.oAVAL = 0;
    this.oAVAP = 0;

    console.log(this.qMTNO);

    //Get PalletQty
    try {
      this.respGR004 = await lastValueFrom(
        this.dataService.GR004(this.FACI, this.iPRNO),
      );
      for (let y1 = 0; y1 < this.respGR004.items.length; y1++) {
        const itemy1 = this.respGR004.items[y1];
        this.iRPQA = parseFloat(itemy1.UNMU).toFixed(0);
        localStorage.setItem('D007', this.iRPQA);
      }
    } catch (error) {}

    //  this.CheckFinishedLot(this.iPRNO, this.xBANO);

    this.alerts = [];

    if (this.iPLGR === '' || this.iPLGR === undefined) {
      this.alerts.push({ ERROR: 'Work Centre doesnt exist' });
    }
    if (this.iTWSL === '' || this.iTWSL === undefined) {
      this.alerts.push({ ERROR: 'To Location doesnt exist' });
    }

    if (this.alerts.length === 0) {
      this.ALLOK = 'No issues!';
    }

    if (localStorage.getItem('PROCESSING') === '20') {
      this.processing = true;
    } else {
      this.processing = false;
    }
  }

  async connectMFNO(rorn, faci, mtno) {
    console.log('connectMFNO');

    //Check connection according latest transaction 1
    try {
      this.respGL001 = await lastValueFrom(
        this.dataService.GL001(this.FACI, mtno, this.qRORN),
      );
      for (let y8 = 0; y8 < this.respGL001.items.length; y8++) {
        const itemy8 = this.respGL001.items[y8];

        this.qCAMU = itemy8.M1CAMU;
        this.qRORN = itemy8.VHRORN;
        this.hMTNO = itemy8.VMMTNO;
        this.lMFHL = itemy8.VHMFHL;
        this.lMFNO = itemy8.VHMFNO;
        this.rBANO = itemy8.VMBANO;
      }
    } catch (error) {}

    //Check connection according latest transaction 2
    try {
      this.respGL002a = await lastValueFrom(
        this.dataService.GL002b(rorn, faci, this.hMTNO),
      );

      for (let y2 = 0; y2 < this.respGL002a.items.length; y2++) {
        const itemy2 = this.respGL002a.items[y2];

        this.sCAMU = itemy2.MTCAMU;
        this.sRIDN = itemy2.MTRIDN;
        this.sBANO = itemy2.MTBANO;
      }
    } catch (error) {}

    // check on lot number status
    try {
      this.respGL00z5 = await lastValueFrom(
        this.dataService.checkConnection(this.iMFNO),
      );
      for (let z5 = 0; z5 < this.respGL00z5.items.length; z5++) {
        const itemz5 = this.respGL00z5.items[z5];

        localStorage.setItem('BANO', itemz5.A030);
      }
    } catch (error) {}

    this.ListAttributes(this.hMTNO, this.sBANO);
  }

  async connectBANO(ridn, faci, mtno) {
    console.log('connectBANO');

    //Check connection according latest transaction 2
    try {
      this.respGL002b = await lastValueFrom(
        this.dataService.GL002b(ridn, faci, mtno),
      );
      for (let y2 = 0; y2 < this.respGL002b.items.length; y2++) {
        const itemy2 = this.respGL002b.items[y2];

        this.sCAMU = itemy2.MTCAMU;
        this.sRIDN = itemy2.MTRIDN;
        this.sBANO = itemy2.MTBANO;
      }
    } catch (error) {}

    // check on lot number status
    try {
      this.respGL00z5 = await lastValueFrom(
        this.dataService.checkConnection(this.iMFNO),
      );
      for (let z5 = 0; z5 < this.respGL00z5.items.length; z5++) {
        const itemz5 = this.respGL00z5.items[z5];

        this.qCAMU = itemz5.A130;

        localStorage.setItem('BANO', itemz5.A030);
        localStorage.setItem('CAMU', itemz5.A130);
      }
    } catch (error) {}

    if (this.xITTY === 'PRD') {
      this.oBANO = this.sBANO;
      this.ListAttributes(mtno, this.sBANO);
    } else {
      this.oBANO = this.rBANO;
      this.ListAttributes(mtno, this.rBANO);
    }
  }

  checkIssueManual() {
    this.issuemanual = false;

    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('FILE', 'ISSUE');
        input.setString('PK01', this.FACI);

        const request: IMIRequest = {
          program: 'CUSEXTMI',
          transaction: 'GetFieldValue',
          record: input,
          outputFields: ['A030'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                this.issuem = item.A030;

                if (this.issuem === '1') {
                  this.issuemanual = true;

                  this.CheckSetting(this.usid);
                }
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }
  CheckSetting(usid: string) {
    this.model.checkBox1Value = false;

    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('FILE', 'ISSUE01');
        input.setString('PK01', usid);

        const request: IMIRequest = {
          program: 'CUSEXTMI',
          transaction: 'GetFieldValue',
          record: input,
          outputFields: ['N096'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                console.log('111W' + item.N096);

                if (item.N096 === '1.000000') {
                  this.model.checkBox1Value = true;

                  localStorage.setItem('ISSUE', '');
                  localStorage.setItem('ISSUE', '1');
                } else {
                  localStorage.setItem('ISSUE', '');
                  localStorage.setItem('ISSUE', '0');
                }
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }
  getWashedBalance(mfno) {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('F_RIDN', mfno);
        input.setString('T_RIDN', mfno);

        const request: IMIRequest = {
          program: 'CMS100MI',
          transaction: 'Lst_QREM',
          record: input,
          outputFields: ['MTTRQT'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                this.xMREM = -parseFloat(item.MTTRQT);
                this.pBAL = parseFloat(this.xMREM) - parseFloat(this.iRPQA);

                this.checkBOM(mfno);
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }
  checkBOM(mfno) {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('F_MFHL', mfno);
        input.setString('T_MFHL', mfno);
        input.setString('VHFACI', this.FACI);
        input.setString('VHMFHL', mfno);

        const request: IMIRequest = {
          program: 'CMS100MI',
          transaction: 'Lst_QMREM2',
          record: input,
          outputFields: ['VHMFNO', 'VHMFHL', 'VHRVQT'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                if (item.VHMFNO !== item.VHMFHL) {
                  this.xMREM = this.xMREM - parseFloat(item.VHRVQT);
                }
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  getMOAttributeNO(mfno) {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();

        input.setString('ORCA', '101');
        input.setString('RIDN', mfno);

        const request: IMIRequest = {
          program: 'ATS101MI',
          transaction: 'LstAttrByRef',
          record: input,
          outputFields: ['ATNR'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                this.oMATNR = item.ATNR;
                localStorage.setItem('MATNR', this.oMATNR);
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  getlinkedMOData(mfno) {
    const input = new MIRecord();
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();

        input.setString('VHFACI', this.FACI);
        input.setString('F_MFNO', mfno);
        input.setString('T_MFNO', mfno);

        const request: IMIRequest = {
          program: 'CMS100MI',
          transaction: 'Lst_Q_MWOHED2',
          record: input,
          outputFields: [
            'VHORQA',
            'VHRVQA',
            'VHBANO',
            'VHPRNO',
            'VMMTNO',
            'VMBANO',
          ],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                //     this.oAVAL2 = parseFloat(item.VHORQA) - parseFloat(item.VHRVQA);

                this.getlinkedMOData02(mfno);

                localStorage.removeItem('D010');
                localStorage.setItem('D010', item.VHBANO);

                this.yyBANO = item.VMBANO;
                this.rrMTNO = item.VMMTNO;

                console.log('at10_03 ' + item.VMMTNO + ' ' + item.VMBANO);

                //    this.ListAttributes(item.VMMTNO, item.VMBANO);
                //      this.CheckFinishedLot(this.iPRNO, this.xBANO);
              }

              this.updateGridData();
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  clearReport() {
    this.datagrid
      ? (this.datagrid.dataset = [])
      : (this.datagridOptions.dataset = []);
    this.supplier01 = null;
  }

  async ListAttributes(itno, bano): Promise<void> {
    // mark "loading" so CheckFinishedLot can await it
    this.itemsbanoReady = new Promise<void>((resolve) => {
      this.resolveItemsbanoReady = resolve;
    });

    this.itemsbano = [];

    // keep your trigger as-is (but without setTimeout)
    try {
      this.triggerBusinessContext_02(this.iMFNO);
    } catch {
      // ignore, same as previous behaviour
    }

    try {
      const _context = await lastValueFrom(this.userService.getUserContext());

      const rec = new MIRecord();
      rec.setString('AGITNO', itno);
      rec.setString('AGBANO', bano);

      const request: IMIRequest = {
        program: 'CMS100MI',
        transaction: 'Lst_GR_ATID',
        record: rec,
        outputFields: ['AGATID', 'AGATVA', 'AGATVN', 'AATX30'],
        maxReturnedRecords: this.maxRecords,
        company: this.curcono,
      };

      const response: IMIResponse = await lastValueFrom(
        this.miService.execute(request),
      );

      if (!response.hasError()) {
        for (let i = 0; i < response.items.length; i++) {
          const item = response.items[i];

          if (item.AGATVN > 0) {
            item.AGATVA = item.AGATVN;
          }

          if (
            item.AGATID === 'CROPCYCLE' ||
            item.AGATID === 'SIZE' ||
            item.AGATID === 'VARIETY' ||
            item.AGATID === 'FIELD' ||
            item.AGATID === 'GNAME' ||
            item.AGATID === 'GAREA'
          ) {
            this.setattribute(item.AGATID, item.AGATVA, item.AGATVN);

            this.itemsbano.push({
              ATID: item.AATX30,
              ATVA: item.AGATVA,
              ATVN: item.AGATVN,
              ATID2: item.AGATID,
            });

            if (item.AGATID === 'CROPCYCLE')
              localStorage.setItem('CROPCYCLE', item.AGATVA.trim());
            if (item.AGATID === 'SIZE')
              localStorage.setItem('SIZE', item.AGATVA.trim());
            if (item.AGATID === 'VARIETY')
              localStorage.setItem('VARIETY', item.AGATVA.trim());
            if (item.AGATID === 'FIELD')
              localStorage.setItem('FIELD', item.AGATVA.trim());
            if (item.AGATID === 'GNAME')
              localStorage.setItem('GNAME', item.AGATVA.trim());
            if (item.AGATID === 'GAREA')
              localStorage.setItem('GAREA', item.AGATVA.trim());
          }
        }

        this.updateMOAttributes('101');

        this.updateGridData();

        // ✅ signal itemsbano is ready, then do the dependent call deterministically
        if (this.resolveItemsbanoReady) this.resolveItemsbanoReady();
        this.itemsbanoReady = null;
        this.resolveItemsbanoReady = null;

        //   await this.CheckFinishedLot(this.iPRNO, this.xBANO);
      } else {
        this.setBusy(false);

        if (this.resolveItemsbanoReady) this.resolveItemsbanoReady();
        this.itemsbanoReady = null;
        this.resolveItemsbanoReady = null;
      }
    } catch (error) {
      this.setBusy(false);

      // ensure we never leave CheckFinishedLot hanging
      if (this.resolveItemsbanoReady) this.resolveItemsbanoReady();
      this.itemsbanoReady = null;
      this.resolveItemsbanoReady = null;
    }
  }

  setattribute(agatid, agatva, agatvn) {
    if (agatva === '' || agatva === null || agatva === undefined) {
      this.iagatva = '?';
    } else {
      this.iagatva = agatva;
    }

    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();

        input.setString('ATNR', this.oMATNR);
        input.setString('ATID', agatid);
        input.setString('ATAV', this.iagatva);

        const request: IMIRequest = {
          program: 'ATS101MI',
          transaction: 'SetAttrValue',
          record: input,
          outputFields: [],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            console.log(error.errorMessage);

            //     if (this.packed === true) {
            //       this.openError02(error.errorMessage);
            //     }

            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  listlotno(faci, prno, mfno) {
    console.log('fred ' + this.oBANO);

    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();
        input.setString('VMFACI', faci);
        input.setString('VMPRNO', prno);
        input.setString('VMMFNO', mfno);
        input.setString('F_CRTM', '1');
        input.setString('T_CRTM', '1');

        const request: IMIRequest = {
          program: 'CMS100MI',
          transaction: 'Lst_Q_BANO',
          record: input,
          outputFields: ['VMBANO', 'MMITTY', 'VMMSEQ', 'MLCAMU'],
          maxReturnedRecords: 5000,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                this.acamu = true;

                if (this.oRORN === '') {
                  this.qBANO = item.VMBANO;
                  //      this.oBANO = item.VMBANO;
                  //  this.qCAMU = item.MLCAMU;

                  //  this.oBANO = this.sBANO;

                  //   localStorage.removeItem('D011');
                  // localStorage.setItem('D011', this.qCAMU);

                  localStorage.removeItem('D010');
                  localStorage.setItem('D010', this.oBANO);

                  try {
                    this.respGR006 = await lastValueFrom(
                      this.dataService.GR006(this.FACI, this.qMTNO, this.oBANO),
                    );
                    for (let y1 = 0; y1 < this.respGR006.items.length; y1++) {
                      const itemy1 = this.respGR006.items[y1];
                      this.oAVAL = itemy1.MLSTQT;
                      //   this.oAVAC = this.oAVAL / this.qCNQT;
                      // Uses toFixed then converts back to number
                      //    this.oAVAC = +this.qCNQT
                      //      ? Number((this.oAVAL / +this.qCNQT).toFixed(2))
                      //      : 0;

                      this.oAVAC = +this.qCNQT
                        ? Math.floor(this.oAVAL / +this.qCNQT)
                        : 0;
                    }

                    setTimeout(() => {
                      this.oPJBALS = Math.round(this.oAVAC - this.iRPQA);

                      if (this.oPJBALS > 0) {
                        this.posproS = true;
                        this.negproS = false;

                        if (this.packed === true && this.qstock === true) {
                          localStorage.setItem('D100', '1');
                        }
                      } else {
                        this.posproS = false;
                        this.negproS = true;

                        if (this.packed === true && this.qstock === true) {
                          localStorage.setItem('D100', '');
                          localStorage.setItem('D100', this.oPJBALS.toString());
                        }
                      }
                    }, 1000);

                    setTimeout(() => {
                      this.oPJBALP = Math.round(this.xMREM - this.iRPQA);

                      if (this.oPJBALP > 0) {
                        this.posproP = true;
                        this.negproP = false;

                        if (this.produce === true && this.qstock === true) {
                          localStorage.setItem('D100', '1');
                        }
                      } else {
                        this.posproP = false;
                        this.negproP = true;

                        if (this.produce === true && this.qstock === true) {
                          localStorage.setItem('D100', '');
                          localStorage.setItem('D100', this.oPJBALP.toString());
                        }
                      }
                    }, 1000);

                    setTimeout(() => {
                      this.reqstock =
                        parseFloat(this.iRPQA) * parseFloat(this.qCNQT);
                      this.oAVAP = this.oAVAL - this.reqstock;
                    }, 1000);
                  } catch (error) {}
                }
                if (this.oRORN !== '') {
                  this.oBANO = null;
                }
              }
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  getlinkedproduct(vhrorn) {
    this.userService.getUserContext().subscribe(
      (context) => {
        const input = new MIRecord();

        input.setString('VHFACI', this.FACI);
        input.setString('F_MFNO', vhrorn);
        input.setString('T_MFNO', vhrorn);

        const request: IMIRequest = {
          program: 'CMS100MI',
          transaction: 'Lst_Q_MWOHED2',
          record: input,
          outputFields: ['VHPRNO', 'MMITDS', 'VHBANO', 'MBAVAL'],
          maxReturnedRecords: this.maxRecords,
          company: this.curcono,
        };

        this.miService.execute(request).subscribe(
          async (response: IMIResponse) => {
            if (!response.hasError()) {
              for (let i = 0; i < response.items.length; i++) {
                const item = response.items[i];

                this.qPRNO = item.VHPRNO;
                this.qITDS = item.MMITDS;
                //     this.oBANO = item.VHBANO;
                this.oAVAL = item.MBAVAL;
                //      this.oAVAC = this.oAVAL / this.qCNQT;
                // Uses toFixed then converts back to number
                //   this.oAVAC = +this.qCNQT
                //     ? Number((this.oAVAL / +this.qCNQT).toFixed(2))
                //     : 0;

                this.oAVAC = +this.qCNQT
                  ? Math.floor(this.oAVAL / +this.qCNQT)
                  : 0;
              }

              this.updateGridData();
            } else {
              this.setBusy(false);
            }
          },
          (error) => {
            this.setBusy(false);
          },
        );
      },
      (error) => {
        this.setBusy(false);
      },
    );
  }

  updateGridData() {
    const allowedIds = [
      'CROPCYCLE',
      'SIZE',
      'VARIETY',
      'FIELD',
      'GNAME',
      'GAREA',
    ];

    // Deduplicate by ATID2 (AGATID)
    const uniqueMap = new Map<string, any>();

    for (const row of this.itemsbano) {
      if (!allowedIds.includes(row.ATID2)) {
        continue; // ignore any extra attributes
      }

      // Last one wins – overwrite previous
      uniqueMap.set(row.ATID2, row);
    }

    // Recreate clean array
    this.itemsbano = Array.from(uniqueMap.values());

    //  this.CheckFinishedLot(this.iPRNO, this.xBANO);

    // Update your grid as before
    if (this.datagrid) {
      this.datagrid.dataset = this.itemsbano;
    } else {
      this.datagridOptions.dataset = this.itemsbano;
    }

    this.setBusy(false);
  }

  onSelected(args: any[], isSingleSelect?: boolean) {
    if (this.isBusy) {
      return;
    }

    const newCount = args.length;
    const selected = args && newCount === 1 ? args[0].data : null;
    this.hasSelected = !!selected;
    if (this.hasSelected) {
      console.log(selected.F1A030);

      this.iREPN = selected.REPN;
      this.iWHLO = selected.WHLO;
      this.AITM = selected.AITM;

      localStorage.setItem('D004', '');
      localStorage.setItem('D004', this.AITM);

      console.log(this.iREPN);
      console.log(this.iWHLO);
    }
  }

  // tslint:disable-next-line:typedef
  private initGrid() {
    const options: SohoDataGridOptions = {
      selectable: 'single' as SohoDataGridSelectable,
      disableRowDeactivation: true,
      clickToSelect: true,
      alternateRowShading: false,
      cellNavigation: false,
      idProperty: 'col-cuno',
      rowHeight: 'short',
      filterable: false,
      paging: false,
      pagesize: this.pageSize,
      indeterminate: false,
      columns: [
        {
          id: 'col-puno',
          field: 'ATID',
          name: 'Attribute',
          resizable: true,
          filterType: 'text',
          sortable: true,
          width: 70,
        },
        {
          id: 'col-pnli',
          field: 'ATVA',
          name: 'Value',
          resizable: true,
          filterType: 'text',
          sortable: true,
          width: 30,
        },
      ],
      dataset: [],
    };
    this.datagridOptions = options;
  }

  private setBusy(isBusy: boolean, isDetail?: boolean) {
    isDetail ? (this.isDetailBusy = isBusy) : (this.isBusy = isBusy);
  }

  private handleError(message: string, error?: any) {
    this.logError(message, error ? '- Error: ' + JSON.stringify(error) : '');
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
      .message(
        message + '. More details might be available in the browser console.',
      )
      .buttons(buttons)
      .open();
  }
}
