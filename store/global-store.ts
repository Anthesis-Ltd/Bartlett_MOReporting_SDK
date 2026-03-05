import { Injectable } from '@angular/core';
import { Store } from './store';
import { IUserContext, MIRecord } from '@infor-up/m3-odin';

class GlobalState {
   isBusy = false;
   userContext = {} as IUserContext;

   ITNO = '';
   FUDS = '';
   BANO = '';
   FACI = '';
   STMR = '';
   PYNO = '';
   PYNO2 = '';
   STMR2 = '';
   PONO = '';
   MCON = '';
   DMSO = '';
   VRNO = '';
   PHN2 = '';
   TFNO = '';
   CAMU = '';

   STQT = '';

   CORG = '';
   ETYP = '';

   DMSO2 = '';
   CUA1 = '';
   CUA2 = '';

   PYCD = '';
   CUNO = '';
   CUNM = '';
   CUA3 = '';
   RORN = '';
   YREF = '';
   YRE2 = '';

   CUA4 = '';
   TOWN = '';
   INRC = '';
   INRC2 = '';

   PYCD2 = '';
   WHLO = '';
   PHNO = '';
   SRES = '';
   SRES2 = '';
   WHSL = '';
   FUDSRetrieved = false;
   ATNR = '';
   PRDT = '';
   PACT = '';
   DISY = '';
   DISY2 = '';

   PLTB = '';
   VTCD = '';
   VTCD2 = '';

   PRGP = '';

   IVGP = '';
   IVGP2 = '';

   UNMS = '';
   CFC2 = '';
   CDRC = '';
   CDRC2 = '';

   CFC22 = '';

   CFC9 = '';
   DIGR = '';
   DIGR2 = '';

   CFC0 = '';
   CFC6 = '';
   CFC62 = '';

   CFC02 = '';
   CFC8 = '';
   CFC82 = '';


   CFC4 = '';
   CFC42 = '';


   CFC92 = '';
   AGNB = '';
   ITGR = '';
   REOP = '';
   UNMU = '';
   CFC32 = '';
   ECAR = '';
   ITCL = '';
   TMPL = '';
   ECAR2 = '';

   PK01 = '';
   PK02 = '';
   A030 = '';
   A130 = '';

   CHK1 = '';
   DIGI = '';
   FCCM = '';
   NOTE = '';
   PR = '';
   PW = '';
   SUWH = '';
   RESP = '';
   MOQT = '';
   ITPL = '';
   CSCD = '';
   SITE = '';
   PUPR = '';
   PRCD = '';
   CUCD2 = '';
   ITDS = '';
   ITNOM = '';
   MXST = '';
   PLTB2 = '';
   SDST2 = '';
   ABCD = '';
   ITTY = '';
   CSCD2 = '';
   SUNO = '';
   LOQT = '';
   STAT = '';
   SSQT = '';
   SDST = '';
   CFC3 = '';
   PRNO = '';
   EOQM = '';
   LEA1 = '';
   CUCD = '';
   ORTY = '';
   CUCL = '';
   CUCL2 = '';
   MFNO = '';
   ORCO = '';
   SAPR = '';
   DIGC = '';
   DIGC2 = '';
   TEPY = '';
   BUYE = '';
   TXAP = '';
   TXAP2 = '';
   CFC5 = '';
   CFC52 = '';

   CFI1 = '';
   PLGR = '';
   CFI3 = '';
   DPID = '';
   WCLN = '';
   CFI4 = '';
   PANR = '';
   TEPY2 = '';
   PANM = '';
   DLIX = '';
   valitem: any[];

}

@Injectable({ providedIn: 'root' })
export class GlobalStore extends Store<GlobalState> {

   setvalitems: any;
   constructor() {
      super(new GlobalState());
   }

   // tslint:disable-next-line: typedef
   setBusy(isBusy: boolean) {
      this.setState({ ...this.state, isBusy });
   }

   setUserContext(userContext: IUserContext) {
      this.setState({ ...this.state, userContext });
   }

   getUserContext() {
      return this.state.userContext;
   }

   setITNO(item: any) {
      this.setState({ ...this.state, ITNO: item });
   }
   getITNO() {
      return this.state.ITNO;
   }

   setSTQT(item: any) {
      this.setState({ ...this.state, STQT: item });
   }
   getSTQT() {
      return this.state.STQT;
   }



   setWCLN(item: any) {
      this.setState({ ...this.state, WCLN: item });
   }
   getWCLN() {
      return this.state.WCLN;
   }

   setPLGR(item: any) {
      this.setState({ ...this.state, PLGR: item });
   }
   getPLGR() {
      return this.state.PLGR;
   }



   setMFNO(item: any) {
      this.setState({ ...this.state, MFNO: item });
   }
   getMFNO() {
      return this.state.MFNO;
   }


   setCAMU(item: any) {
      this.setState({ ...this.state, CAMU: item });
   }
   getCAMU() {
      return this.state.CAMU;
   }


   setPYNO(item: any) {
      this.setState({ ...this.state, PYNO: item });
   }
   getPYNO() {
      return this.state.PYNO;
   }

   setPRNO(item: any) {
      this.setState({ ...this.state, PRNO: item });
   }
   getPRNO() {
      return this.state.PRNO;
   }


   setCFC5(item: any) {
      this.setState({ ...this.state, CFC5: item });
   }
   getCFC5() {
      return this.state.CFC5;
   }


   setRORN(item: any) {
      this.setState({ ...this.state, RORN: item });
   }
   getRORN() {
      return this.state.RORN;
   }

   setCFC52(item: any) {
      this.setState({ ...this.state, CFC52: item });
   }
   getCFC52() {
      return this.state.CFC52;
   }

   setDIGC2(item: any) {
      this.setState({ ...this.state, DIGC2: item });
   }
   getDIGC2() {
      return this.state.DIGC2;
   }


   setPONO(item: any) {
      this.setState({ ...this.state, PONO: item });
   }
   getPONO() {
      return this.state.PONO;
   }


   setDIGC(item: any) {
      this.setState({ ...this.state, DIGC: item });
   }
   getDIGC() {
      return this.state.DIGC;
   }


   setYREF(item: any) {
      this.setState({ ...this.state, YREF: item });
   }
   getYREF() {
      return this.state.YREF;
   }


   setMCON(item: any) {
      this.setState({ ...this.state, MCON: item });
   }
   getMCON() {
      return this.state.MCON;
   }

   setYRE2(item: any) {
      this.setState({ ...this.state, YRE2: item });
   }
   getYRE2() {
      return this.state.YRE2;
   }


   setPHN2(item: any) {
      this.setState({ ...this.state, PHN2: item });
   }
   getPHN2() {
      return this.state.PHN2;
   }

   setTFNO(item: any) {
      this.setState({ ...this.state, TFNO: item });
   }
   getTFNO() {
      return this.state.TFNO;
   }



   setTOWN(item: any) {
      this.setState({ ...this.state, TOWN: item });
   }
   getTOWN() {
      return this.state.TOWN;
   }



   setPYNO2(item: any) {
      this.setState({ ...this.state, PYNO2: item });
   }
   getPYNO2() {
      return this.state.PYNO2;
   }

   setPHNO(item: any) {
      this.setState({ ...this.state, PHNO: item });
   }
   getPHNO() {
      return this.state.PHNO;
   }


   setCUA3(item: any) {
      this.setState({ ...this.state, CUA3: item });
   }
   getCUA3() {
      return this.state.CUA3;
   }


   setVRNO(item: any) {
      this.setState({ ...this.state, VRNO: item });
   }
   getVRNO() {
      return this.state.VRNO;
   }

   setCORG(item: any) {
      this.setState({ ...this.state, CORG: item });
   }
   getCORG() {
      return this.state.CORG;
   }

   setETYP(item: any) {
      this.setState({ ...this.state, ETYP: item });
   }
   getETYP() {
      return this.state.ETYP;
   }



   setCUA4(item: any) {
      this.setState({ ...this.state, CUA4: item });
   }
   getCUA4() {
      return this.state.CUA4;
   }

   setCUA1(item: any) {
      this.setState({ ...this.state, CUA1: item });
   }
   getCUA1() {
      return this.state.CUA1;
   }

   setCUA2(item: any) {
      this.setState({ ...this.state, CUA2: item });
   }
   getCUA2() {
      return this.state.CUA2;
   }

   setVTCD(item: any) {
      this.setState({ ...this.state, VTCD: item });
   }
   getVTCD() {
      return this.state.VTCD;
   }





   setDMSO(item: any) {
      this.setState({ ...this.state, DMSO: item });
   }
   getDMSO() {
      return this.state.DMSO;
   }

   setDMSO2(item: any) {
      this.setState({ ...this.state, DMSO2: item });
   }
   getDMSO2() {
      return this.state.DMSO2;
   }

   setSRES(item: any) {
      this.setState({ ...this.state, SRES: item });
   }
   getSRES() {
      return this.state.SRES;
   }

   setSRES2(item: any) {
      this.setState({ ...this.state, SRES2: item });
   }
   getSRES2() {
      return this.state.SRES2;
   }



   setSTMR(item: any) {
      this.setState({ ...this.state, STMR: item });
   }
   getSTMR() {
      return this.state.STMR;
   }

   setSTMR2(item: any) {
      this.setState({ ...this.state, STMR2: item });
   }
   getSTMR2() {
      return this.state.STMR2;
   }



   setINRC2(item: any) {
      this.setState({ ...this.state, INRC2: item });
   }
   getINRC2() {
      return this.state.INRC2;
   }


   setCUNM(item: any) {
      this.setState({ ...this.state, CUNM: item });
   }
   getCUNM() {
      return this.state.CUNM;
   }


   setINRC(item: any) {
      this.setState({ ...this.state, INRC: item });
   }
   getINRC() {
      return this.state.INRC;
   }




   setCFC2(item: any) {
      this.setState({ ...this.state, CFC2: item });
   }
   getCFC2() {
      return this.state.CFC2;
   }


   setCFC22(item: any) {
      this.setState({ ...this.state, CFC22: item });
   }
   getCFC22() {
      return this.state.CFC22;
   }

   setCDRC(item: any) {
      this.setState({ ...this.state, CDRC: item });
   }
   getCDRC() {
      return this.state.CDRC;

   }

   setCDRC2(item: any) {
      this.setState({ ...this.state, CDRC2: item });
   }
   getCDRC2() {
      return this.state.CDRC2;

   }




   setIVGP(item: any) {
      this.setState({ ...this.state, IVGP: item });
   }
   getIVGP() {
      return this.state.IVGP;
   }


   setPYCD(item: any) {
      this.setState({ ...this.state, PYCD: item });
   }
   getPYCD() {
      return this.state.PYCD;
   }

   setPYCD2(item: any) {
      this.setState({ ...this.state, PYCD2: item });
   }
   getPYCD2() {
      return this.state.PYCD2;
   }



   setIVGP2(item: any) {
      this.setState({ ...this.state, IVGP2: item });
   }
   getIVGP2() {
      return this.state.IVGP2;
   }


   setTXAP(item: any) {
      this.setState({ ...this.state, TXAP: item });
   }
   getTXAP() {
      return this.state.TXAP;
   }

   setTXAP2(item: any) {
      this.setState({ ...this.state, TXAP2: item });
   }
   getTXAP2() {
      return this.state.TXAP2;
   }


   setVTCD2(item: any) {
      this.setState({ ...this.state, VTCD2: item });
   }
   getVTCD2() {
      return this.state.VTCD2;
   }



   setDISY(item: any) {
      this.setState({ ...this.state, DISY: item });
   }
   getDISY() {
      return this.state.DISY;
   }

   setCUCD(item: any) {
      this.setState({ ...this.state, CUCD: item });
   }
   getCUCD() {
      return this.state.CUCD;
   }


   setCUCD2(item: any) {
      this.setState({ ...this.state, CUCD2: item });
   }
   getCUCD2() {
      return this.state.CUCD2;
   }


   setDISY2(item: any) {
      this.setState({ ...this.state, DISY2: item });
   }
   getDISY2() {
      return this.state.DISY2;
   }



   setPLTB2(item: any) {
      this.setState({ ...this.state, PLTB2: item });
   }
   getPLTB2() {
      return this.state.PLTB2;
   }


   setPLTB(item: any) {
      this.setState({ ...this.state, PLTB: item });
   }
   getPLTB() {
      return this.state.PLTB;
   }




   setTEPY(item: any) {
      this.setState({ ...this.state, TEPY: item });
   }
   getTEPY() {
      return this.state.TEPY;
   }



   setTEPY2(item: any) {
      this.setState({ ...this.state, TEPY2: item });
   }
   getTEPY2() {
      return this.state.TEPY2;
   }



   setDIGR(item: any) {
      this.setState({ ...this.state, DIGR: item });
   }
   getDIGR() {
      return this.state.DIGR;
   }

   setDIGR2(item: any) {
      this.setState({ ...this.state, DIGR2: item });
   }
   getDIGR2() {
      return this.state.DIGR2;
   }

   setCFC0(item: any) {
      this.setState({ ...this.state, CFC0: item });
   }
   getCFC0() {
      return this.state.CFC0;
   }


   setCFC4(item: any) {
      this.setState({ ...this.state, CFC4: item });
   }
   getCFC4() {
      return this.state.CFC4;
   }

   setCFC42(item: any) {
      this.setState({ ...this.state, CFC42: item });
   }
   getCFC42() {
      return this.state.CFC42;
   }


   setCFC6(item: any) {
      this.setState({ ...this.state, CFC6: item });
   }
   getCFC6() {
      return this.state.CFC6;
   }

   setCFC62(item: any) {
      this.setState({ ...this.state, CFC62: item });
   }
   getCFC62() {
      return this.state.CFC62;
   }


   setCFC02(item: any) {
      this.setState({ ...this.state, CFC02: item });
   }
   getCFC02() {
      return this.state.CFC02;
   }

   setCFC8(item: any) {
      this.setState({ ...this.state, CFC8: item });
   }
   getCFC8() {
      return this.state.CFC8;
   }

   setCFC82(item: any) {
      this.setState({ ...this.state, CFC82: item });
   }
   getCFC82() {
      return this.state.CFC82;
   }



   setSDST2(item: any) {
      this.setState({ ...this.state, SDST2: item });
   }
   getSDST2() {
      return this.state.SDST2;
   }


   setCFC9(item: any) {
      this.setState({ ...this.state, CFC9: item });
   }
   getCFC9() {
      return this.state.CFC9;
   }

   setCFC92(item: any) {
      this.setState({ ...this.state, CFC92: item });
   }
   getCFC92() {
      return this.state.CFC92;
   }



   setECAR2(item: any) {
      this.setState({ ...this.state, ECAR2: item });
   }
   getECAR2() {
      return this.state.ECAR2;
   }


   setCFC3(item: any) {
      this.setState({ ...this.state, CFC3: item });
   }
   getCFC3() {
      return this.state.CFC3;
   }

   setCFC32(item: any) {
      this.setState({ ...this.state, CFC32: item });
   }
   getCFC32() {
      return this.state.CFC32;
   }



   setSDST(item: any) {
      this.setState({ ...this.state, SDST: item });
   }
   getSDST() {
      return this.state.SDST;
   }


   setECAR(item: any) {
      this.setState({ ...this.state, ECAR: item });
   }
   getECAR() {
      return this.state.ECAR;
   }


   setPK01(item: any) {
      this.setState({ ...this.state, PK01: item });
   }
   getPK01() {
      return this.state.PK01;
   }

   setPK02(item: any) {
      this.setState({ ...this.state, PK02: item });
   }
   getPK02() {
      return this.state.PK02;
   }

   setA030(item: any) {
      this.setState({ ...this.state, A030: item });
   }
   getA030() {
      return this.state.A030;
   }

   setA130(item: any) {
      this.setState({ ...this.state, A130: item });
   }
   getA130() {
      return this.state.A130;
   }


   setFACI(item: any) {
      this.setState({ ...this.state, FACI: item });
   }
   getFACI() {
      return this.state.FACI;
   }

   setCUNO(item: any) {
      this.setState({ ...this.state, CUNO: item });
   }
   getCUNO() {
      return this.state.CUNO;
   }


   setSUNO(item: any) {
      this.setState({ ...this.state, SUNO: item });
   }
   getSUNO() {
      return this.state.SUNO;
   }

   setCSCD2(item: any) {
      this.setState({ ...this.state, CSCD2: item });
   }
   getCSCD2() {
      return this.state.CSCD2;
   }

   setAGNB(item: any) {
      this.setState({ ...this.state, AGNB: item });
   }
   getAGNB() {
      return this.state.AGNB;
   }


   setSAPR(item: any) {
      this.setState({ ...this.state, SAPR: item });
   }
   getSAPR() {
      return this.state.SAPR;
   }


   setvalitem(item: any) {
      this.setState({ ...this.state, valitem: item });
   }
   getvalitem() {
      return this.state.valitem;
   }




   setPUPR(item: any) {
      this.setState({ ...this.state, PUPR: item });
   }
   getPUPR() {
      return this.state.PUPR;
   }

   setITNOM(item: any) {
      this.setState({ ...this.state, ITNOM: item });
   }
   getITNOM() {
      return this.state.ITNOM;
   }


   setCHK1(item: any) {
      this.setState({ ...this.state, CHK1: item });
   }
   getCHK1() {
      return this.state.CHK1;
   }


   setPR(item: any) {
      this.setState({ ...this.state, PR: item });
   }
   getPR() {
      return this.state.PR;
   }

   setPW(item: any) {
      this.setState({ ...this.state, PW: item });
   }
   getPW() {
      return this.state.PW;
   }

   setREOP(item: any) {
      this.setState({ ...this.state, REOP: item });
   }
   getREOP() {
      return this.state.REOP;
   }

   setMXST(item: any) {
      this.setState({ ...this.state, MXST: item });
   }
   getMXST() {
      return this.state.MXST;
   }


   setMOQT(item: any) {
      this.setState({ ...this.state, MOQT: item });
   }
   getMOQT() {
      return this.state.MOQT;
   }



   setEOQM(item: any) {
      this.setState({ ...this.state, EOQM: item });
   }
   getEOQM() {
      return this.state.EOQM;
   }


   setITPL(item: any) {
      this.setState({ ...this.state, ITPL: item });
   }
   getITPL() {
      return this.state.ITPL;
   }


   setITTY(item: any) {
      this.setState({ ...this.state, ITTY: item });
   }
   getITTY() {
      return this.state.ITTY;
   }


   setITDS(item: any) {
      this.setState({ ...this.state, ITDS: item });
   }
   getITDS() {
      return this.state.ITDS;
   }



   setSITE(item: any) {
      this.setState({ ...this.state, SITE: item });
   }
   getSITE() {
      return this.state.SITE;
   }


   setLEA1(item: any) {
      this.setState({ ...this.state, LEA1: item });
   }
   getLEA1() {
      return this.state.LEA1;
   }


   setLOQT(item: any) {
      this.setState({ ...this.state, LOQT: item });
   }
   getLOQT() {
      return this.state.LOQT;
   }



   setSTAT(item: any) {
      this.setState({ ...this.state, STAT: item });
   }
   getSTAT() {
      return this.state.STAT;
   }






   setNOTE(item: any) {
      this.setState({ ...this.state, NOTE: item });
   }
   getNOTE() {
      return this.state.NOTE;
   }



   setCUCL(item: any) {
      this.setState({ ...this.state, CUCL: item });
   }
   getCUCL() {
      return this.state.CUCL;
   }



   setUNMU(item: any) {
      this.setState({ ...this.state, UNMU: item });
   }
   getUNMU() {
      return this.state.UNMU;
   }

   setSSQT(item: any) {
      this.setState({ ...this.state, SSQT: item });
   }
   getSSQT() {
      return this.state.SSQT;
   }


   setRESP(item: any) {
      this.setState({ ...this.state, RESP: item });
   }
   getRESP() {
      return this.state.RESP;
   }

   setABCD(item: any) {
      this.setState({ ...this.state, ABCD: item });
   }
   getABCD() {
      return this.state.ABCD;
   }

   setORCO(item: any) {
      this.setState({ ...this.state, ORCO: item });
   }
   getORCO() {
      return this.state.ORCO;
   }


   setCSCD(item: any) {
      this.setState({ ...this.state, CSCD: item });
   }
   getCSCD() {
      return this.state.CSCD;
   }


   setBUYE(item: any) {
      this.setState({ ...this.state, BUYE: item });
   }
   getBUYE() {
      return this.state.BUYE;
   }

   setSUWH(item: any) {
      this.setState({ ...this.state, SUWH: item });
   }
   getSUWH() {
      return this.state.SUWH;
   }


   setFCCM(item: any) {
      this.setState({ ...this.state, FCCM: item });
   }
   getFCCM() {
      return this.state.FCCM;
   }


   setPRCD(item: any) {
      this.setState({ ...this.state, PRCD: item });
   }
   getPRCD() {
      return this.state.PRCD;
   }

   setORTY(item: any) {
      this.setState({ ...this.state, ORTY: item });
   }
   getORTY() {
      return this.state.ORTY;
   }

   setCUCL2(item: any) {
      this.setState({ ...this.state, CUCL2: item });
   }
   getCUCL2() {
      return this.state.CUCL2;
   }


   setDPID(item: any) {
      this.setState({ ...this.state, DPID: item });
   }
   getDPID() {
      return this.state.DPID;
   }


   setTMPL(item: any) {
      this.setState({ ...this.state, TMPL: item });
   }
   getTMPL() {
      return this.state.TMPL;
   }



   setPACT(item: any) {
      this.setState({ ...this.state, PACT: item });
   }
   getPACT() {
      return this.state.PACT;
   }

   setDIGI(item: any) {
      this.setState({ ...this.state, DIGI: item });
   }
   getDIGI() {
      return this.state.DIGI;
   }

   setITGR(item: any) {
      this.setState({ ...this.state, ITGR: item });
   }
   getITGR() {
      return this.state.ITGR;
   }

   setITCL(item: any) {
      this.setState({ ...this.state, ITCL: item });
   }
   getITCL() {
      return this.state.ITCL;
   }

   setCFI4(item: any) {
      this.setState({ ...this.state, CFI4: item });
   }
   getCFI4() {
      return this.state.CFI4;
   }

   setUNMS(item: any) {
      this.setState({ ...this.state, UNMS: item });
   }
   getUNMS() {
      return this.state.UNMS;
   }

   setCFI3(item: any) {
      this.setState({ ...this.state, CFI3: item });
   }
   getCFI3() {
      return this.state.CFI3;
   }

   setPANR(item: any) {
      this.setState({ ...this.state, PANR: item });
   }
   getPANR() {
      return this.state.PANR;
   }

   setPRGP(item: any) {
      this.setState({ ...this.state, PRGP: item });
   }
   getPRGP() {
      return this.state.PRGP;
   }



   setDLIX(item: any) {
      this.setState({ ...this.state, DLIX: item });
   }
   getDLIX() {
      return this.state.DLIX;
   }

   setCFI1(item: any) {
      this.setState({ ...this.state, CFI1: item });
   }
   getCFI1() {
      return this.state.CFI1;
   }


   setPANM(item: any) {
      this.setState({ ...this.state, PANM: item });
   }
   getPANM() {
      return this.state.PANM;
   }



   setFUDS(item: any) {
      this.setState({ ...this.state, FUDS: item });
   }
   getFUDS() {
      return this.state.FUDS;
   }
   setWHLO(item: any) {
      this.setState({ ...this.state, WHLO: item });
   }
   getWHLO() {
      return this.state.WHLO;
   }
   setWHSL(item: any) {
      this.setState({ ...this.state, WHSL: item });
   }
   getWHSL() {
      return this.state.WHSL;
   }
   setBANO(item: any) {
      this.setState({ ...this.state, BANO: item });
   }
   getBANO() {
      return this.state.BANO;
   }
   setATNR(item: any) {
      this.setState({ ...this.state, ATNR: item });
   }
   getATNR() {
      return this.state.ATNR;
   }
   setPRDT(item: any) {
      this.setState({ ...this.state, PRDT: item });
   }
   getPRDT() {
      return this.state.PRDT;
   }
}
