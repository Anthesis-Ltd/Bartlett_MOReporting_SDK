import { Injectable } from '@angular/core';

import {
  IMIRequest,
  IMIResponse,
  MIRecord,
  ArrayUtil,
  CoreBase,
  IUserContext,
  IIonApiResponse,
} from '@infor-up/m3-odin';
import {
  MIService,
  UserService,
  ApplicationService,
  IonApiService,
} from '@infor-up/m3-odin-angular';
import { GlobalStore } from '../store/global-store';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  get_MITBAL(whlo, itno) {
    const request = {
      program: 'MMS200MI',
      transaction: 'GetItmWhsBasic',
      maxReturnedRecords: 1,
      includeMetadata: true,
      outputFields: ['WHSL'],
      typedOutput: false,
      record: {
        WHLO: whlo,
        ITNO: itno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  get_PMS080(faci, mfno, rpqa, whsl) {
    const request = {
      program: 'PMS080MI',
      transaction: 'RptByProduct',
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        MFNO: mfno,
        MTNO: 'STOCKFEED',
        RPQA: rpqa,
        REND: '1',
        WHSL: whsl,
        DSP1: '1',
        DSP2: '1',
        DSP3: '1',
        DSP6: '1',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  get_PMS100(faci, prno, mfno) {
    const request = {
      program: 'PMS100MI',
      transaction: 'UpdMO',
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        PRNO: prno,
        MFNO: mfno,
        DWNO: 'CLOSED',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  checkConnection(mfno) {
    const request = {
      program: 'CUSEXTMI',
      transaction: 'GetFieldValue',
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FILE: 'CONNECTMO',
        PK01: mfno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  addConnection(mfno, a030, camu) {
    const request = {
      program: 'CUSEXTMI',
      transaction: 'AddFieldValue',
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FILE: 'CONNECTMO',
        PK01: mfno,
        A030: a030,
        A130: camu,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  updConnection(mfno, a030, camu) {
    const request = {
      program: 'CUSEXTMI',
      transaction: 'ChgFieldValue',
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FILE: 'CONNECTMO',
        PK01: mfno,
        A030: a030,
        A130: camu,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  ListMaterials(faci, prno, mfno) {
    const request = {
      program: 'PMS100MI',
      transaction: 'LstMaterials',
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        PRNO: prno,
        MFNO: mfno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CloseMtrlLine(faci, prno, mfno, mseq) {
    const request = {
      program: 'PMS100MI',
      transaction: 'CloseMtrlLine',
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        PRNO: prno,
        MFNO: mfno,
        MSEQ: mseq,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  ListOperations(faci, prno, mfno) {
    const request = {
      program: 'PMS100MI',
      transaction: 'LstOperations',
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        PRNO: prno,
        MFNO: mfno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  ReportOperation(faci, prno, mfno, opno) {
    const request = {
      program: 'PMS070MI',
      transaction: 'RptOperation',
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        PRNO: prno,
        MFNO: mfno,
        REND: '1',
        OPNO: opno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  UpdateMO(faci, prno, mfno) {
    const request = {
      program: 'PMS100MI',
      transaction: 'UpdMO',
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        PRNO: prno,
        MFNO: mfno,
        RORL: '10',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  ReportReceipt(faci, prno, mfno) {
    const request = {
      program: 'PMS050MI',
      transaction: 'RptReceipt',
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        PRNO: prno,
        MFNO: mfno,
        REND: '1',
        DSP1: '1',
        DSP2: '1',
        DSP3: '1',
        DSP4: '1',
        DSP5: '1',
        DSP6: '1',
        DSP7: '1',
        DSP8: '1',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  get_PMS050(faci, prno, mfno) {
    const request = {
      program: 'PMS050MI',
      transaction: 'RptReceipt',
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        PRNO: prno,
        MFNO: mfno,
        REND: '1',
        DSP1: '1',
        DSP2: '1',
        DSP3: '1',
        DSP4: '1',
        DSP5: '1',
        DSP6: '1',
        DSP7: '1',
        DSP8: '1',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR0021(
    FACI: string,
    iPRNO: any,
    iMFNO: any,
  ): import('rxjs').Observable<unknown> {
    throw new Error('Method not implemented.');
  }

  GR0060(atnr, atid, atva) {
    const request = {
      program: 'ATS101MI',
      transaction: 'SetAttrValue',
      maxReturnedRecords: 5000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        ATNR: atnr,
        ATID: atid,
        ATVA: atva,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR011(faci, mfno) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_QREMQ',
      maxReturnedRecords: 5000,
      includeMetadata: true,
      outputFields: ['VHMFHL'],
      typedOutput: false,
      record: {
        VHFACI: faci,
        VHMFNO: mfno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  oPACT: any;
  oD1QT: string;
  items: any;

  packlines: any[] = [];
  obench: any;
  outv: any;

  constructor(
    private miService: MIService,
    protected ionApiService: IonApiService,
    private globalStore: GlobalStore,
    private userService: UserService,
  ) {}

  EXT800MI_CrtScalesEntry(panr, grwe) {
    const request = {
      program: 'EXT800MI',
      transaction: 'CrtScalesEntry',
      outputFields: ['STAT'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        PANR: panr,
        GRWE: grwe,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR001(faci, prno, mfno) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_Q_MWOHED1',
      outputFields: [
        'VHPRNO',
        'VHMFNO',
        'MMITDS',
        'MMITTY',
        'VHORQA',
        'VHMAQA',
        'VHRVQA',
        'VOMAQA',
        'VHBANO',
        'VHRORN',
        'VHMFHL',
        'VHWHST',
        'VHWHHS',
        'VHWMST',
        'VHWCLN',
      ],
      maxReturnedRecords: 10000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        VHFACI: faci,
        VHPRNO: prno,
        VHMFNO: mfno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR001Z(faci, prno, mfno) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_Q_BANO',
      outputFields: [
        'VMBANO',
        'MMITTY',
        'VMMSEQ',
        'VMCNQT',
        'MLCAMU',
        'VMMTNO',
        'MMITDS',
      ],
      maxReturnedRecords: 10000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        VMFACI: faci,
        VMPRNO: prno,
        VMMFNO: mfno,
        F_CRTM: '1',
        T_CRTM: '1',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR002(faci, prno, mfno) {
    const request = {
      program: 'PMS100MI',
      transaction: 'LstOperations',
      outputFields: ['PRNO', 'MFNO', 'PLGR'],
      maxReturnedRecords: 10000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        PRNO: prno,
        MFNO: mfno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GL001(faci, prno, mfno) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_QCheck1',
      outputFields: [
        'VHFACI',
        'VHMFNO',
        'VHMFHL',
        'VHPRNO',
        'VMMTNO',
        'VHBANO',
        'VHRORN',
        'MMITTY',
        'VMBANO',
        'M1BANO',
        'M1CAMU',
      ],
      maxReturnedRecords: 10000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        VHFACI: faci,
        VHPRNO: prno,
        VHMFNO: mfno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GL002a(camu, ridn, whlo, itno) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_QCheck2',
      outputFields: [
        'MTWHLO',
        'MTITNO',
        'MTCAMU',
        'MTRIDN',
        'MTBANO',
        'MTTTYP',
        'MTTRDT',
        'MTTRTM',
      ],
      maxReturnedRecords: 10000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        F_CAMU: camu,
        T_CAMU: camu,
        F_RIDN: ridn,
        T_RIDN: ridn,
        MTWHLO: whlo,
        MTITNO: itno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GL002b(ridn, whlo, itno) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_QCheck2',
      outputFields: [
        'MTWHLO',
        'MTITNO',
        'MTCAMU',
        'MTRIDN',
        'MTBANO',
        'MTTTYP',
        'MTTRDT',
        'MTTRTM',
      ],
      maxReturnedRecords: 10000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        F_RIDN: ridn,
        T_RIDN: ridn,
        MTWHLO: whlo,
        MTITNO: itno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR009(faci, mfno) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_ZReportX',
      outputFields: ['VHPRNO', 'VHMFNO', 'VHFACI'],
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        F_MFNO: mfno,
        T_MFNO: mfno,
        VHFACI: faci,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR003(faci, plgr) {
    const request = {
      program: 'PDS010MI',
      transaction: 'Get',
      outputFields: ['TWSL', 'WHSL'],
      maxReturnedRecords: 10000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        PLGR: plgr,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR001X(suno) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_GR_RECL',
      outputFields: [
        'F2DIVI',
        'F2FGTP',
        'F2SUNO',
        'F2SUDO',
        'F2PUNO',
        'F2PNLI',
        'F2PNLS',
        'IDCFI3',
        'F2FACI',
        'F2REPN',
        'F2RELP',
        'MTTRTP',
        'LMATNR',
        'F2ITNO',
        'MMITDS',
        'MMITGR',
        'F2TRDT',
        'F2BANO',
        'A1ATVA',
        'A2ATVA',
        'MLSTQT',
        'A3ATVA',
        'A4ATVA',
        'A5ATVA',
        'A6ATVA',
        'A7ATVN',
        'F2RPQA',
      ],
      maxReturnedRecords: 10000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        F2DIVI: 'ABA',
        F_FGTP: '80',
        T_FGTP: '80',
        F2SUNO: suno,
        F_RPQA: '1',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR001Y(puno, pnli) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_GR_APS450',
      outputFields: ['E5SINO', 'F2BANO'],
      maxReturnedRecords: 1000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        F2DIVI: 'ABA',
        F2PUNO: puno,
        F1PNLI: pnli,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR001A(itno) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_GR_Stock',
      outputFields: ['MBAVAL'],
      maxReturnedRecords: 5000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        F_ITNO: itno,
        T_ITNO: itno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR001B(puno, pnli) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_GR_MPLINE',
      outputFields: ['IBPUPR', 'IBAGNB', 'IBOURR', 'IDCFI3'],
      maxReturnedRecords: 5000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        IBPUNO: puno,
        IBPNLI: pnli,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR_PRICE01(suno, obv1, obv2) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_GRAgreement',
      outputFields: [
        'AJAGNB',
        'AJSUNO',
        'AJOBJ1',
        'AJOBV2',
        'AJFVDT',
        'AJPUPR',
        'AIUVDT',
      ],
      maxReturnedRecords: 5000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        AJSUNO: suno,
        AJGRPI: '30',
        F_OBV1: obv1,
        T_OBV1: obv1,
        F_OBV2: obv2,
        T_OBV2: obv2,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR_PRICE01A(suno, obv1) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_GRAgreement',
      outputFields: [
        'AJAGNB',
        'AJSUNO',
        'AJOBJ1',
        'AJOBV2',
        'AJFVDT',
        'AJPUPR',
        'AIUVDT',
      ],
      maxReturnedRecords: 5000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        AJSUNO: suno,
        AJGRPI: '30',
        F_OBV1: obv1,
        T_OBV1: obv1,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR0041(bano) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_GR_MITTRA',
      outputFields: ['MTTRQT', 'VHREND', 'MTRIDN', 'VHMFNO', 'VHORTY'],
      maxReturnedRecords: 5000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        F_BANO: bano,
        T_BANO: bano,
        F_TTYP: '31',
        T_TTYP: '31',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR0042(mfno) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_GR_EndProd',
      outputFields: ['VHFACI', 'VHBANO', 'VHPRNO', 'VHMFNO', 'VHRVQA'],
      maxReturnedRecords: 5000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        F_MFHL: mfno,
        T_MFHL: mfno,
        F_BANO: '1',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR004(whlo, itno) {
    const request = {
      program: 'MMS200MI',
      transaction: 'GetItmWhsBasic',

      outputFields: ['UNMU'],
      maxReturnedRecords: 5000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        WHLO: whlo,
        ITNO: itno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR005(faci, prno, mfno) {
    const request = {
      program: 'PMS100MI',
      transaction: 'LstMaterials',
      outputFields: ['MTNO', 'CNQT', 'ITDS'],
      maxReturnedRecords: 5000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        FACI: faci,
        PRNO: prno,
        MFNO: mfno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  GR006(whlo, itno, bano) {
    const request = {
      program: 'CMS100MI',
      transaction: 'Lst_Q_MITLOC1',
      outputFields: ['MLSTQT'],
      maxReturnedRecords: 5000,
      includeMetadata: true,
      typedOutput: false,
      record: {
        MLWHLO: whlo,
        MLITNO: itno,
        MLBANO: bano,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS050MI(unms) {
    const request = {
      program: 'CRS050MI',
      transaction: 'Get',
      outputFields: ['UNIT'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        UNIT: unms,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS175MI_DIGI(digi) {
    const request = {
      program: 'CRS175MI',
      transaction: 'GetGeneralCode',
      outputFields: ['TX15'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        STKY: digi,
        STCO: 'DIGI',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS175MI_CFI3(cfi3) {
    const request = {
      program: 'CRS175MI',
      transaction: 'GetGeneralCode',
      outputFields: ['TX15'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        STKY: cfi3,
        STCO: 'CFI3',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS175MI_CFI4(cfi4) {
    const request = {
      program: 'CRS175MI',
      transaction: 'GetGeneralCode',
      outputFields: ['TX15'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        STKY: cfi4,
        STCO: 'CFI4',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS175MI_ITGR(itgr) {
    const request = {
      program: 'CRS175MI',
      transaction: 'GetGeneralCode',
      outputFields: ['TX15'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        STKY: itgr,
        STCO: 'ITGR',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS175MI_ITCL(itcl) {
    const request = {
      program: 'CRS175MI',
      transaction: 'GetGeneralCode',
      outputFields: ['TX15'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        STKY: itcl,
        STCO: 'ITCL',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS175MI_PRGP(prgp) {
    const request = {
      program: 'CRS175MI',
      transaction: 'GetGeneralCode',
      outputFields: ['TX15'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        STKY: prgp,
        STCO: 'PRGP',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS175MI_CFI1(cfi1) {
    const request = {
      program: 'CRS175MI',
      transaction: 'GetGeneralCode',
      outputFields: ['TX15'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        STKY: cfi1,
        STCO: 'CFI1',
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS620MI_SUNO(suno) {
    const request = {
      program: 'CRS620MI',
      transaction: 'GetBasicData',
      outputFields: ['SUNO'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        SUNO: suno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS045MI_ORCO(cscd) {
    const request = {
      program: 'CRS045MI',
      transaction: 'GetBasicData',
      outputFields: ['CSCD'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        CSCD: cscd,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  PPS095MI_ORTY(orty) {
    const request = {
      program: 'PPS095MI',
      transaction: 'GetOrderType',
      outputFields: ['ORTY'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        ORTY: orty,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  MMS001(itno, itds, fuds) {
    const request = {
      program: 'MMS200MI',
      transaction: 'CpyItmViaItmTyp',
      outputFields: ['ITNO'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        ITNO: itno,
        ITDS: itds,
        FUDS: fuds,
        CITN: this.globalStore.getTMPL(),
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  MMS001U(itno, itds, fuds, digi, itgr, stat) {
    const request = {
      program: 'MMS200MI',
      transaction: 'UpdItmBasic',
      outputFields: ['ITNO'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        ITNO: itno,
        ITDS: itds,
        FUDS: fuds,
        DIGI: digi,
        ITGR: itgr,
        STAT: stat,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  MMS001V(itno, digi) {
    const request = {
      program: 'MMS200MI',
      transaction: 'UpdItmPrice',
      outputFields: ['ITNO'],
      maxReturnedRecords: 500,
      includeMetadata: true,
      typedOutput: false,
      record: {
        ITNO: itno,
        DIGI: digi,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS175MI_ITNO(itno) {
    const request = {
      program: 'MMS200MI',
      transaction: 'GetItmBasic',
      outputFields: ['ITNO'],
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        ITNO: itno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }

  CRS620(suno) {
    const request = {
      program: 'CRS620MI',
      transaction: 'GetBasicData',
      outputFields: ['SUNO'],
      maxReturnedRecords: 1,
      includeMetadata: true,
      typedOutput: false,
      record: {
        SUNO: suno,
      },
    };
    console.log(request);
    return this.miService.execute(request);
  }
}
