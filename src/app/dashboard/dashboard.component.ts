import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CellClassRules, CellClickedEvent, ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { DashboardService } from './dashboard.service';
import { FormGroup, FormControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatRadioChange } from '@angular/material/radio';
import { MatInput } from '@angular/material/input';
import { MsalService } from '@azure/msal-angular';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardForm = new FormGroup({
    businessUnitValue: new FormControl(''),
    cioValue: new FormControl(''),
    chubbMgrValue: new FormControl(''),
    sowNoValue: new FormControl('')
  });
  loading=false;
  buttonDisabled: boolean = true;
  isDisabled: boolean = true;
  paginationPageSize: any;
  posts: any;
  cioValues: any;
  gridOptions: GridOptions;
  groupSelected: any;
  gridApi: GridApi;
  startDate: any;
  endDate: any;
  rowDataObj: any;
  rowDataArr: any = [];
  sowNumber: any;
  sowNumberModel: any;
  sowValue: any;
  searchValue: any;
  buModel: string;
  cioModel: string;
  chubbMgrModel: string;

  loggedInuserEmail:any;

 

  rowData = [];
  result: any;
  chubbValues: any;
  buId: any;
  cioId: any;
  chubbMgrId: any;
  searchBySowNo: any;
  constructor(private router: Router, private dashboardService: DashboardService
    ,private msalService:MsalService
    ) {
    this.gridOptions = {
      columnDefs: this.getColDefs(),
      rowData: [],
    };
  }

ngOnInit(): void {
    this.getBUOptions();
    this.getGridDetails(true);
//  this.activeAccount = this.msalService.instance.getActiveAccount();
   this.loggedInuserEmail=this.msalService.instance.getAllAccounts()[0]?.username

  }

  onCellClicked(event: CellClickedEvent) {
    this.sowValue = event.value;
    if (event.colDef.field == "soWCR") {
      this.router.navigate(['/sowTracker'], { queryParams: { category: this.sowValue } });
    }

  }

  navigateTochooseSOW() {
    this.router.navigate(['/chooseSOW']);
  }

  
  searchBySoWNoCheckBox(event: any) {
    this.isDisabled = !this.isDisabled;
    if (event.checked == false) {
      this.searchBySowNo = "";
      this.buttonDisabled = true;
    } else if (event.checked == true) {
      this.buModel = "";
      this.cioModel = "";
      this.chubbMgrModel = "";
    }
  }
  getBUOptions(): void {
    this.dashboardService.getBUValues()
      .subscribe(response => {
        this.posts = response.data;

      });
  }
  getCIOOptions(buId: any) {
    this.buId = buId;
    if (this.buId || this.cioId || this.chubbMgrId) {
      this.buttonDisabled = false;
    }
    this.dashboardService.getCIOValues(buId)
      .subscribe(response => {
        this.cioValues = response.data;

      });
  }
  getChubbManagerOptions(cioId: any) {
    this.cioId = cioId;
    this.dashboardService.getChubbManagerValues(cioId)
      .subscribe(response => {
        this.chubbValues = response.data;
      });
  }
  detailCellRendererParams = {
    // provide the Grid Options to use on the Detail Grid
    detailGridOptions: {
      columnDefs: [
        { headerName: 'Renewal Frequency', field: 'renewalRrequency', width: 204, menuTabs: [] },
        { headerName: 'IBM Onshore DM', field: 'IBMonshoreDM', width: 156, menuTabs: [] },
        { headerName: 'IBM Offshore DM', field: 'IBMoffshoreDM', width: 137, menuTabs: [] },
        { headerName: 'Original SoW', field: 'originalSoW', width: 300, menuTabs: [] }
      ]
    },
    // get the rows for each Detail Grid
    getDetailRowData: (params: any) => {
      params.successCallback(params.data.details);
    }
  };
  getChubbManagerID(value: any) {
    this.chubbMgrId = value;
  }
  onSearchChange(event: any): void {
    this.searchValue = (event.target as HTMLInputElement).value;
    if (this.searchValue) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
  }

  getGridDetails(onfirstload?:boolean) {
    this.loading=true;
    this.dashboardService.gridDetailsService(this.createRequestObject(onfirstload))
      .subscribe(response => {
        this.rowDataArr = [];

        if (Array.isArray(response.data) && response.data.length > 0) {
          for (let i = 0; i < response.data.length; i++) {
            this.rowDataObj = {
              soWCR: response.data[i]?.soWCR,
              businessUnit: response.data[i]?.businessUnit,
              cio: response.data[i]?.cio,
              stage: response.data[i]?.stage,
              startDate: this.formatDate(response.data[i].startDate),
              endDate: this.formatDate(response.data[i].endDate),
              details:[{
                renewalRrequency:response.data[i]?.renewalFrequency,
                IBMonshoreDM:response.data[i]?.ibmOnShoreDM ,
                IBMoffshoreDM: response.data[i]?.ibmOffShoreDM,
                originalSoW: response.data[i]?.originalSoW
              }]
            }
            this.rowDataArr.push(this.rowDataObj); 
          }
          this.rowData = this.rowDataArr;
        } else {
          this.rowData = [];
        }
        this.loading=false;
      })
  }
  getSoWNo() {

  }
  radioChange($event: MatRadioChange) {
    this.groupSelected = $event.value
    this.getGridDetails();
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit(); 
    //params.columnApi.autoSizeAllColumns();
  }
  
  onBtnExport() {
   // this.gridApi.exportDataAsExcel();
   this.dashboardService.gridDetailsService(this.createRequestObject())
   .subscribe(response => {
    this.dashboardService.exportAsExcelFile(response.data, "SoWInformation")  
   })
  }
  valuechange($event: any) {
  }


  onSubmit() {
    // TODO: Use EventEmitter with form value

  }


  resetForm() {
    this.dashboardForm.reset();
    this.searchBySowNo=''
    this.buttonDisabled = true;
  }


  //  format date on ui
  formatDate(date:any) {
    if(date==null) return null;
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [ month, day,year].join('/');
}






// get the column definition for the table
private getColDefs(): ColDef[] {
  return [{
    headerName: "SoW No.", field: 'soWCR', sortable: true, unSortIcon: true, resizable: true,
    width: 400, cellRenderer: 'agGroupCellRenderer', cellStyle: { color: '#0F62FE' , cursor: 'pointer'}
  },
  { headerName: "Business Unit", sortable: true, field: 'businessUnit', unSortIcon: true, resizable: true },
  { headerName: "CIO", sortable: true, field: 'cio', unSortIcon: true, resizable: true },
  {
    headerName: "Stage", sortable: true, field: 'stage', unSortIcon: true, resizable: true,
    cellStyle: params => {
      if (params.value === 'Close') {
        return {
          background: '#D7D7D7',
          opacity: 1
        };
      }
      if (params.value === 'Negotiate') {
        return {
          background: '#7ACB004D',
          opacity: 1
        };
      }
      if (params.value === 'Propose') {
        return {
          background: '#0F62FE33',
          opacity: 1
        };
      }
      if (params.value === 'Open') {
        return {
          background: '#E419134D',
          opacity: 1
        };
      }
      return null;
    }
  },
  { headerName: "Start Date", sortable: true, field: 'startDate', unSortIcon: true, resizable: true },
  { headerName: "End Date", sortable: true, field: 'endDate', unSortIcon: true, resizable: true }];
}

private createRequestObject(onfirstload?:boolean){
  if(this.searchBySowNo){
    const req= {
      "BusinessUnitId":  0,
      "CIOId":  0,
      "ChubbManagerId": 0,
      "SOWNumber": this.searchBySowNo,
      "StartDate": "",
      "EndDate": "",
      "RenewalFrequency": "",
      "IBMOnShoreDM": "",
      "IBMOffShoreDM": "",
      "OriginalSoW": "",
      "Status": "", 
      "Filter": 'ALL',
       "Value": ''  
        }
    return req;
  }
const req = {
  "BusinessUnitId": this.buId ? this.buId : 0,
  "CIOId": this.cioId ? this.cioId : 0,
  "ChubbManagerId": this.chubbMgrId ? this.chubbMgrId : 0,
  "SOWNumber": "",
  "StartDate": "",
  "EndDate": "",
  "RenewalFrequency": "",
  "IBMOnShoreDM": "",
  "IBMOffShoreDM": "",
  "OriginalSoW": "",
  "Status": "", 
  "Filter": onfirstload?'': (this.groupSelected ? this.groupSelected : "ALL"),
  "Value": onfirstload?'':((this.groupSelected=="AY") ? (this.loggedInuserEmail?this.loggedInuserEmail:'') : ""),    
  // pass email of logged in user  ,for AY(assiged to you) (when sso implemented , it is to be done.
  }
  return req;
}

// classs end
}
