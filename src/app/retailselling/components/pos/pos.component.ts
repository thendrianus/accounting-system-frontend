import { Component, ViewChild, NgZone, Input } from '@angular/core';
import { HttpService, QzTrayService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'pos',
  styleUrls: ['./pos.scss'],
  templateUrl: './pos.html',
})
export class Pos {

  rowsPosDetail: any = [];

  posesDetail: any = [];
  showCreateUpdate: any = true;

  formPos;
  formPosDetail;
  formDelivery;
  formTerm;
  currentUser: any = { employee_job_id: 0 };

  public minDate: Date = void 0;
  public dateDisabled: { date: Date, mode: string }[];
  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  datetimeModel2 = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  @ViewChild('posSessionModal') public posSessionModal: ModalDirective; //term

  formPos_session;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formPos = { pos_id: '', pos_detail: [], pos_code: '', pos_session_id: '', currency_id: '', rate: '', businesspartner_id: '', branch_id: '', warehouse_id: '', transaction_date: moment().format("YYYY-MM-DD"), description: '-', discount_amount: 0, discount_persent: 0, tax_id: '', landed_cost: 0, salesman_id: '', receivable: 0, delivery_address: '-', tax: 0, sale_category_id: 1, transaction_payment_id: 1, sub_total: 0, discount_date: 0, due_date: 0, early_discount: 0, late_charge: 0, sale_link_id: 0, isdelivery: 0, delivery_note: '-', delivery_schedule: new Date(), reference_label: '-', reference_code: '-', sale_status_id: 5, downpayment: 0, downpayment_persent: 0, grand_total: 0, update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, orisale_status_id: 1, orisub_total: 0, oritax: 0, origrand_total: 0, oridownpayment: 0, orilanded_cost: 0, orireceivable: 0, list_filter: '' }

  _formDelivery = { delivery_address: '', delivery_note: '', delivery_schedule: moment().format("YYYY-MM-DD"), times: '', }

  _formTerm = { discount_date: 0, due_date: 0, early_discount: 0, late_charge: 0, }

  _formPosDetail = { pos_detail_id: '', pos_id: '', inventory_id: '', inventory_code: '', name: '', warehouse_id: '', ordered: 1, orderedeqv: 1, inventory_hpp: 0, delivered: 0, deliveredeqv: 0, price: 0, discount_persent: 0, discount_amount: 0, uom_order: 1, uom_label: '', row_order: 1, row_label: '', isdelivery: 0, tax_id: '', tax: 0, delivery_schedule: new Date(), delivery_note: '-', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, oriprice: 0, uom1: '', uom2: '', uom3: '', uom2equal: 1, uom3equal: 1, min_price: 0, retailselling_price: 0, retailselling_price2: 0, retailselling_price3: 0, min_retailselling_price: 0, min_retailselling_price2: 0, min_retailselling_price3: 0, stock: 0 }

  _formPos_session = { pos_session_id: '', general_journal_id: '', inventoryledger_link_id: '', pos_stand_id: '', salesman_id: '', pos_session_status_id: 1, currency_id: '', rate: '', branch_id: '', warehouse_id: '', description: '-', session_begin: new Date(), session_end: new Date(), session_start: new Date(), session_finish: new Date(), timelimit: 0, update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, oripos_session_status_id: '' }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    protected qzTrayService: QzTrayService,
    private ngZone: NgZone,
    private sanitized: DomSanitizer
  ) {

    this.formPos = this.formBuilder.group({ //sssss
      pos_id: '',
      pos_detail: [],
      pos_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      pos_session_id: '',
      currency_id: '',
      rate: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      businesspartner_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      discount_amount: [0],
      discount_persent: [0],
      tax_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      landed_cost: [0],
      salesman_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      receivable: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      delivery_address: '-',
      tax: [0],
      sale_category_id: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_payment_id: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      sub_total: 0,
      discount_date: 0,
      due_date: 0,
      early_discount: 0,
      late_charge: 0,
      sale_link_id: 0,
      isdelivery: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      delivery_note: '-',
      delivery_schedule: new Date(),
      reference_label: '-',
      reference_code: ['-', [Validators.minLength(0), Validators.maxLength(20)]],
      sale_status_id: 5,
      downpayment: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      downpayment_persent: [0, [Validators.minLength(0), Validators.maxLength(15)]],
      grand_total: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      orisale_status_id: 1,
      orisub_total: 0,
      oritax: 0,
      origrand_total: 0,
      oridownpayment: 0,
      orilanded_cost: 0,
      orireceivable: 0,
      list_filter: ''
    });

    this.formDelivery = this.formBuilder.group({ //sssss
      delivery_address: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      delivery_note: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      delivery_schedule: moment().format("YYYY-MM-DD"),
      times: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    });

    this.formTerm = this.formBuilder.group({ //sssss
      discount_date: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      due_date: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      early_discount: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      late_charge: [0, [Validators.minLength(0), Validators.maxLength(20)]],
    });

    this.formPosDetail = this.formBuilder.group({ //sssss
      pos_detail_id: '',
      pos_id: '',
      inventory_id: '',
      inventory_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      ordered: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      orderedeqv: 1,
      inventory_hpp: 0,
      delivered: 0,
      deliveredeqv: 0,
      price: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      discount_persent: [0],
      discount_amount: 0,
      uom_order: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom_label: '',
      row_order: 1,
      row_label: '',
      isdelivery: 0,
      tax_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      tax: 0,
      delivery_schedule: new Date(),
      delivery_note: '-',
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      oriprice: 0,
      uom1: '',
      uom2: '',
      uom3: '',
      uom2equal: 1,
      uom3equal: 1,
      min_price: 0,
      retailselling_price: 0,
      retailselling_price2: 0,
      retailselling_price3: 0,
      min_retailselling_price: 0,
      min_retailselling_price2: 0,
      min_retailselling_price3: 0,
      stock: 0
    });

    this.formPos_session = this.formBuilder.group({ //sssss
      pos_session_id: [''],
      general_journal_id: '',
      inventoryledger_link_id: '',
      pos_stand_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      salesman_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      pos_session_status_id: 1,
      currency_id: '',
      rate: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      session_begin: new Date(),
      session_end: new Date(),
      session_start: new Date(),
      session_finish: new Date(),
      timelimit: 0,
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      oripos_session_status_id: ''
    });


  }

  printConsoleForm() {
    console.log('this.formPos');
    console.log(this.formPos);
    console.log('this.formDelivery');
    console.log(this.formDelivery);
    console.log('this.formTerm');
    console.log(this.formTerm);
    console.log('this.formPosDetail');
    console.log(this.formPosDetail);
  }

  formPosField = [{ name: "businesspartner_id" }, { name: "branch_id" }, { name: "warehouse_id" }, { name: "transaction_date" }, { name: "currency_id" } , { name: "rate" }, { name: "discount_amount" }, { name: "discount_persent" }, { name: "tax_id" }, { name: "landed_cost" }, { name: "salesman_id" }, { name: "sale_category_id" }, { name: "transaction_payment_id" }, { name: "isdelivery" }, { name: "reference_code" }, { name: "downpayment" }, { name: "downpayment_persent" }, { name: "description" }];

  formDeliveryField = [{ name: "delivery_address" }, { name: "delivery_note" }, { name: "delivery_schedule" }, { name: "times" }];

  formTermField = [{ name: "discount_date" }, { name: "due_date" }, { name: "early_discount" }, { name: "late_charge" }];

  formButton = [{ name: 'New Item', show: true }, { name: 'Import Reference', show: true }];

  disabledSpecialFormField() {
    this.disableInput.inventory_code = true;
    this.disableInput.name = true;
    this.disableInput.grand_total = true;
    this.disableInput.tax = true;
    this.disableInput.receivable = true;
  }

  formFieldDisabledEnabled(io) {
    if (io == 0) {
      for (let e of this.formPosField) {
        this.disableInput[e.name] = true;
      }
      for (let e of this.formDeliveryField) {
        this.disableInput[e.name] = true;
      }
      for (let e of this.formTermField) {
        this.disableInput[e.name] = true;
      }
      for (let e of this.formButton) {
        e.show = false;
      }
    } else {
      for (let e of this.formPosField) {
        this.disableInput[e.name] = false;
      }
      for (let e of this.formDeliveryField) {
        this.disableInput[e.name] = false;
      }
      for (let e of this.formTermField) {
        this.disableInput[e.name] = false;
      }
      for (let e of this.formButton) {
        e.show = true;
      }
    }

    if (this.formPos.value.pos_id == "") {
      this.disableInput.pos_code = false;
    } else {
      this.disableInput.pos_code = true;
    }

  }

  gen: any = { "app_component_id": 0, "_titleM1": "Title Modal", "_titleM2": "Title Modal", "_titleM3": "Title Modal", "_titleM4": "Title Modal", "_titleM5": "Title Modal", "_titleM6": "Title Modal", "ph_code": "Code", "ph_reference": "Reference", "ph_rate": "Rate", "ph_term": " Term", "ph_description": "Description", "ph_landed_cost": "Landed Cost", "ph_tax": "Tax", "ph_downpayment": "Downpayment", "ph_inventory_codeM1": "Inventory Code", "ph_nameM1": "Name", "ph_orderedM1": "Ordered", "ph_priceM1": "Price", "ph_discountM1": "Discount", "ph_descriptionM1": "Description", "ph_deliveryAddressM3": "Delivery Address", "ph_deliveryNoteM3": "Delivery Note", "ph_discountDateM5": "Discount Date", "ph_dueDateM5": "Due Date", "ph_earlyDiscountM5": "Early Discount", "ph_lateChargeM5": "Late Charge", "ph_pos_sessionM9": "POS Session", "ph_pos_standM9": "POS Stand", "ph_rateM9": "Rate", "ph_session_beginM9": "Session Begin", "ph_session_endM9": "Session End", "ph_descriptionM9": "Description", "at_code": "Code", "at_category": "Category", "at_customer": "Customer", "at_date": "Date", "at_reference": "Reference", "at_branch": "Branch", "at_warehouse": "Warehouse", "at_tax": "Tax", "at_payment": "Payment", "at_currency": "Currency", "at_rate": "Rate", "at_term": " Term", "at_salesman": "Salesman", "at_description": "Description", "at_delivery": "Delivery", "at_landed_cost": "Landed Cost", "at_discount": "Discount", "at_tax2": "Tax", "at_downpayment": "Downpayment", "at_receivable": "Receivable", "at_inventory_codeM1": "Inventory Code", "at_nameM1": "Name", "at_warehouseM1": "Warehouse", "at_quantityM1": "Quantity", "at_uomM1": "UOM", "at_priceM1": "Price", "at_discountM1": "Discount", "at_taxM1": "Tax", "at_descriptionM1": "Description", "at_dateM3": "Date", "at_deliveryAddressM3": "Delivery Address", "at_deliveryNoteM3": "Delivery Note", "at_discountDateM5": "Discount Date", "at_dueDateM5": "Due Date", "at_earlyDiscountM5": "Early Discount", "at_lateChargeM5": "Late Charge", "at_pos_sessionM9": "POS Session", "at_branchM9": "Branch", "at_pos_standM9": "POS Stand", "at_salesmanM9": "Salesman", "at_currencyM9": "Currency", "at_rateM9": "Rate", "at_warehouseM9": "Warehouse", "at_session_beginM9": "Session Begin", "at_session_endM9": "Session End", "at_descriptionM9": "Description", "btn_add": " Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear All", "btn_edit_transaction": "Edit Transaction", "btn_form_detail": "Form Detail", "btn_add_item": "Add Detail", "btn_term": " Term", "btn_delivery": "Delivery", "btn_new_item": "New Item", "btn_edit_detail": "Edit", "btn_delete_detail": "Delete", "btn_new_session": "New Session", "btn_closeM1": "Close", "btn_addM1": "Add ", "btn_editM1": "Edit", "btn_closeM2": "Close", "btn_closeM3": "Close", "btn_set_dataM3": "Set Data", "btn_closeM4": "Close", "btn_closeM5": "Close", "btn_set_dataM5": "Set Data", "btn_closeM6": "Close", "btn_addM6": "Add", "btn_editM6": "Edit", "btn_deleteM6": "Delete", "btn_clearM6": "Clear", "th_action": "Action", "th_salesman": "Salesman", "th_pos_stand": "POS Stand", "th_session_begin": "Session Begin", "th_session_end": "Session End", "th_session_start": "Session Start", "th_session_finish": "Session Fisnish", "th_description": "Description", "th_codeTbl2": "Code", "th_nameTbl2": "Name", "th_brandTbl2": "Brand", "th_priceTbl2": "Price", "th_uomTbl2": "UOM", "th_stockTbl2": "Stock", "th_descriptionTbl2": "Description", "th_branchTbl3": "Branch", "th_codeTbl3": "Code", "th_dateTbl3": "Date", "th_customerTbl3": "Customer", "th_currencyTbl3": "Currency", "th_paymentTbl3": "Payment", "th_grand_totalTbl3": "Grand Total", "th_statusTbl3": "Status", "th_createByTbl3": "Created By", "td_select": "Select", "td_edit": "Edit", "td_start": "Start", "td_finish": "Finish", "td_selectTbl2": "Select", "td_refreshTbl2": "Refresh", "td_selectTbl3": "Select", "td_refreshTbl3": "Refresh" };
  listProductHeight: any = '0px';
  ngOnInit() {

    window.scrollTo(0, 0);
    if (this.httpService.is_authorization) {
      this.getGen();
    } else {
      this.httpService.authorization(true).then(value => {
        this.getGen();
      });
    }
    this.listProductHeight = `${window.innerHeight - 115}px`;
    
  }

  printReceipt(){
    
    moment().format("YYYY-MM-DD")
    var printData = [
      '\x1B' + '\x40', // init 
      '\x1B' + '\x61' + '\x31', // center align 
      '\x1B' + '\x21' + '\x30', // em mode on 
      `${this.currentUser.company}` + '\x0A', 
      '\x1B' + '\x21' + '\x0A' + '\x1B' + '\x45' + '\x0A', // em mode off 
      `${this.currentUser.company_description}` + '\x0A', // text and line break 
      `${moment().format('MMMM Do YYYY, h:mm:ss a')}` + '\x0A',
      '\x1B' + '\x61' + '\x30', // left align 
      `Trx#123456            Stand:1`.replace('123456           ', this.formPos.value.pos_code + ('                 '.substring(1,this.formPos.value.pos_code.length))) + '\x0A',
      '=================================' + '\x0A',  
    ]

    for (let e of this.posesDetail) {

      if (e.is_active == 1) {
        
        let name = e.name.substring(0,30)
        printData.push('Ini                              '.replace('Ini                              ', name + '\x0A'))

        let price = e.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let itemPrint = 'i                 k             p'.replace('i       ', price + ('i       '.substring(price.length, 8)));

        let ordered = e.ordered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        itemPrint = itemPrint.replace('      k', ('       '.substring(ordered.length+1, 7))+ 'x' + ordered );

        let total = (e.price * e.ordered).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        itemPrint = itemPrint.replace('         p', ('          '.substring(total.length, 10)) + total );

        itemPrint = itemPrint + '\x0A';

        printData.push(itemPrint) 
        
      }

    }
    
    let grandtotal = this.formPos.value.grand_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let discountPercent = this.formPos.value.discount_persent.toString() + "%";

    printData.push(...
      [
        '---------------------------------' + '\x0A',
        '\x1B' + '\x45' + '\x0D', // bold on 
        'Total item:     8 Pcs!'.replace('     8', ('      '.substring(this.posDetailOrderedCount.toString().length-1,this.posDetailOrderedCount.toString().length))+ this.posDetailOrderedCount), 
        '\x1B' + '\x45' + '\x0A', // bold off
      ]
    )

    if(this.formPos.value.discount_persent != 0){
      printData.push(...
        [
          '\x0A' + '\x0A', 
          '\x1B' + '\x21' + '\x30', // em mode on 
          'Discount 300.0000     '.replace('300.0000     ', discountPercent + ('             '.substring(1,discountPercent.length)))+ '\x0A' + '\x0A', 
          '\x1B' + '\x21' + '\x0A' + '\x1B' + '\x45' + '\x0A', // em mode off 
        ]
      )
    }else{
      printData.push(...
        [
          '\x0A' + '\x0A'
        ]
      )
    }

    printData.push(...
      [
        '\x1B' + '\x21' + '\x30', // em mode on 
        'TOTAL'+ '\x0A', 
        'Rp.300.0000     '.replace('300.0000     ', grandtotal + ('             '.substring(1,grandtotal.length)))+ '\x0A' + '\x0A', 
        '\x1B' + '\x21' + '\x0A' + '\x1B' + '\x45' + '\x0A', // em mode off 
        '\x1B' + '\x4D' + '\x30', // normal text 
        '---------------------------------' + '\x0A', 
        '\x1B' + '\x61' + '\x31', // center align 
        'Terima kasih atas kunjungan anda.'+ '\x0A', 
        'Tuhan Memberkati ...'+ '\x0A',
        '\x1B' + '\x61' + '\x30', // left align 
        '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A' + '\x0A', 
        '\x1B' + '\x69', // cut paper 
      ]
    )
    console.log(printData)
    this.qzTrayService.printData("EPSON TM-U220 Receipt" ,printData).subscribe((data2)=>{
      console.log(data2)
    })
    
  }

  getGen() {
    this.httpService.getTranslate('49').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.disabledSpecialFormField();

          this.getWarehouse();
          this.getTax();
          this.getBusinesspartner();
          this.getBranch();
          this.getPosStand();
          this.gettransaction_payment();
          this.getPoscategory();
          this.getsalesman();
          this.getPosesStatus();

          this.getInventoryList();
          this.disableInput.pos_session_id = true;
          this.getPos_session();

        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  setpos(data) {
    if (data) {
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      // data.businesspartner_id = "" + data.businesspartner_id + "";
      data.delivery_schedule = moment(data.delivery_schedule).format("YYYY-MM-DD")
      this.formPos.patchValue(this.copying(data));
    } else {
      this.formPos.reset(this._formPos)
    }

  }

  listFilterChange(changes: any) {
    let data = this.formPos.value.list_filter
    if(data.length > 3){
      
      const parseData = this.rawInventoryData.filter((e, i)=>{
        
        if(e.label.toLowerCase().indexOf(data.toLowerCase()) != -1){
          return e
        }
      })
      this.processInventoryList(parseData)
    }else if(data.length == 0){
      this.processInventoryList(this.rawInventoryData)
    }

  }

  barcodeChange(change: any){
    
    if(change.target.value !== "" && this.formPos.value.orisale_status_id != 5){
      let data = change.target.value
      const parseData = this.rawInventoryData.filter((e, i)=>{
        if(e.barcode1.toLowerCase().indexOf(data.toLowerCase()) != -1){
          change.target.value = "";
          this.modal2Out(e, true)
          return e
        }
      })
    }
    
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  @ViewChild('childModal') public childModal: ModalDirective; // inventory search
  @ViewChild('childModal2') public childModal2: ModalDirective; // pos detail form
  @ViewChild('childModal3') public childModal3: ModalDirective; //pos delivery form
  @ViewChild('childModal4') public childModal4: ModalDirective; //pos search
  @ViewChild('childModal5') public childModal5: ModalDirective; //term
  public ModalHeader: string;

  modalShow(item) {

    this.ModalHeader = 'Account Detail';

    if (item == '-') {
      console.log(item)
      this.ifModal2show = -1;
      this.modal2Out(this.source[item], false);
      this.ModalHeader = this.gen._titleM1;
    } else {
      this.ifModal2show = item;
      this.modal2Out(this.posesDetail[item], false);
      this.ModalHeader = this.gen._titleM12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {

    if (this.ifModal2show == -1) {
      this.posesDetail.push(this.copying(this.formPosDetail.getRawValue()));
    } else {
      this.posesDetail[this.ifModal2show] = this.copying(this.formPosDetail.getRawValue());
    }
    this.formPosDetail.reset(this._formPosDetail)
    this.modalHide();
    this.count();

  }

  settings : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings() {
    return {
      actions: {
        delete: false,
        // add: false
      },
      mode: 'external',
      edit: {
        editButtonContent: `${this.gen.td_selectTbl2}`,
        confirmSave: true,
      },
      add: {
        addButtonContent: `${this.gen.td_refreshTbl2}`,
        confirmSave: true,
      },
      columns: this.httpService.generateng2columns({
        inventory_code: {
          title: this.gen.th_codeTbl2,
          type: 'string',
          editable: false,
          show: 1
        },
        name: {
          title: this.gen.th_nameTbl2,
          type: 'string',
          editable: false,
          show: 1
        },
        brand: {
          title: this.gen.th_brandTbl2,
          type: 'string',
          show: 1
        },
        selling_price: {
          title: this.gen.th_priceTbl2,
          type: 'string',
          show: 1
        },
        stock: {
          title: this.gen.th_stockTbl2,
          type: 'string',
          show: 1
        },
        uom1: {
          title: this.gen.th_uomTbl2,
          type: 'string',
          show: 1
        },
        description: {
          title: this.gen.th_descriptionTbl2,
          type: 'string',
          show: 1
        },
      })
    }
  };
  source: LocalDataSource = new LocalDataSource();

  edit() {

  }

  childModal2Refresh() {
    this.getInventoryList();
  }

  Modal2Header;
  ifModal2show = -1;
  modal2Show(item) {
    this.Modal2Header = 'Account Detail';

    if (item == '-') {
      this.ifModal2show = -1;
    } else {
      this.ifModal2show = item;
    }

    this.getInventoryList();

    this.childModal2.show();
  }

  modal2Hide() {
    this.childModal2.hide();
  }

  modal2Out(event, quickAdd) {

    if(this.formPos.value.orisale_status_id == 5){
      return;
    }
    if (quickAdd) {
      this.ifModal2show = -1;
    }

    for (let index = 0; index < this.posesDetail.length; index++) {

      if (this.posesDetail[index].inventory_id == event.inventory_id) {

        if (this.posesDetail[index].is_active == 1) {
          this.ifModal2show = index;
        } else {
          this.ifModal2show = -1;
        }
      }

    }

    if (this.ifModal2show == -1) {
      this.formPosDetail.reset(this._formPosDetail)
    } else {
      console.log(this.posesDetail[this.ifModal2show])
      console.log(this.posesDetail)
      if(quickAdd){
        this.posesDetail[this.ifModal2show].ordered += 1
        this.posesDetail[this.ifModal2show].orderedeqv += 1
      }
      this.formPosDetail.patchValue(this.copying(this.posesDetail[this.ifModal2show]));
    }

    if (this.formPosDetail.value.inventory_id != event.inventory_id) {
      this.formPosDetail.patchValue({
        uom_order: 1,
        uom_label: event.uom1,

        uom1: event.uom1,
        uom2: event.uom2,
        uom3: event.uom3,

        uom2equal: event.uom2equal,
        uom3equal: event.uom3equal,

        min_price: event.min_price,
        retailselling_price: event.retailselling_price,
        retailselling_price2: event.retailselling_price2,
        retailselling_price3: event.retailselling_price3,
        min_retailselling_price: event.min_retailselling_price,
        min_retailselling_price2: event.min_retailselling_price2,
        min_retailselling_price3: event.min_retailselling_price3,

        stock: event.stock,

        inventory_id: event.inventory_id,
        inventory_code: event.inventory_code,
        name: event.name,
        price: event.price,
        oriprice: event.price,
        inventory_hpp: event.inventory_hpp,
      })
    }

    if (quickAdd) {
      this.modalOut()
    } else {
      this.childModal.show();
      this.modal2Hide();
    }

  }
  rawInventoryData: any = []
  getInventoryList() {
    this.httpService.http_api_post('inventory/inventory/search', { inventory_category_id: 1, is_use: 1, is_action: 1 }).subscribe((value) => {

      if (value.success) {
        this.rawInventoryData = value.data.inventory
        this.source.load(value.data.inventory);
        this.processInventoryList(value.data.inventory)
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  processInventoryList(data) {
    
    this.rowsPosDetail = [{ detail: [] }];
    var index = 0;
    for (var variable in data) {
      if (index < 5) {
        this.rowsPosDetail[this.rowsPosDetail.length - 1].detail.push(this.copying(data[variable]));
      } else {
        index = 0;
        this.rowsPosDetail.push({ detail: [] });
        this.rowsPosDetail[this.rowsPosDetail.length - 1].detail.push(this.copying(data[variable]));
      }
    }
  }

  warehouseChange() {
    this._formPosDetail.warehouse_id = this.formPos.value.warehouse_id;
  }

  taxChange() {
    this._formPosDetail.tax_id = this.formPos.value.tax_id;
  }

  warehouseData: any = [];
  getWarehouse() {
    this.httpService.http_api_post('apps/warehouse/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.warehouseData = value.data.warehouse;
        if (value.data.warehouse.length > 0) {
          this._formPos.warehouse_id = value.data.warehouse[0].warehouse_id;
          this.formPos.patchValue({ warehouse_id: value.data.warehouse[0].warehouse_id });
          this._formPosDetail.warehouse_id = value.data.warehouse[0].warehouse_id;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  taxData: any = [];
  getTax() {
    this.httpService.http_api_post('apps/tax/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.taxData = value.data.tax;
        if (value.data.tax.length > 0) {
          this._formPos.tax_id = value.data.tax[0].tax_id;
          this.formPos.patchValue({ tax_id: value.data.tax[0].tax_id });
          this._formPosDetail.tax_id = value.data.tax[0].tax_id;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  businesspartnerData: any = [];
  getBusinesspartner() {
    this.httpService.http_api_post('company/businesspartner/select', { is_use: '1', businesspartner_category_id: 2 }).subscribe((value) => {

      if (value.success) {
        this.businesspartnerData = value.data.businesspartner;

        if (this.businesspartnerData[0]) {
          this.formPos.patchValue({
            businesspartner_id: this.businesspartnerData[0].businesspartner_id
          })
          this._formPos.businesspartner_id = this.businesspartnerData[0].businesspartner_id
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  branchData: any = [];
  getBranch() {
    this.httpService.http_api_post('apps/branch/s', {}).subscribe((value) => {

      if (value.success) {
        this.branchData = value.data.branch;
        if (value.data.branch.length > 0) {
          this._formPos.branch_id = value.data.branch[0].branch_id;
          this.formPos.patchValue({ branch_id: value.data.branch[0].branch_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  posStandData: any = [];
  getPosStand() {
    this.httpService.http_api_post('transaction/pos_stand/select', {}).subscribe((value) => {

      if (value.success) {
        this.posStandData = value.data.pos_stand;
        if (value.data.pos_stand.length > 0) {
          this._formPos_session.pos_stand_id = value.data.pos_stand[0].pos_stand_id;
          this.formPos_session.patchValue({ pos_stand_id: value.data.pos_stand[0].pos_stand_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  sale_categoryData: any = [];
  getPoscategory() {
    this.httpService.http_api_get('transaction/sale/category/').subscribe((value) => {

      if (value.success) {
        this.sale_categoryData = value.data.sale_category;
        if (value.data.sale_category.length > 0) {
          this._formPos.sale_category_id = value.data.sale_category[0].sale_category_id;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  transaction_paymentData: any = [];
  gettransaction_payment() {
    this.httpService.http_api_get('transaction/sale/payment/').subscribe((value) => {

      if (value.success) {
        this.transaction_paymentData = value.data.transaction_payment;
        if (value.data.transaction_payment.length > 0) {
          this._formPos.transaction_payment_id = value.data.transaction_payment[0].transaction_payment_id;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  salesmanData: any = [];
  getsalesman() {
    this.httpService.http_api_put('hrd/employee/select', { action: 'salesman' }).subscribe((value) => {

      if (value.success) {
        this.salesmanData = value.data.employee;
        if (value.data.employee.length > 0) {
          this._formPos.salesman_id = value.data.employee[0].employee_id;
          this.formPos.patchValue({ salesman_id: value.data.employee[0].employee_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  saleStatusData: any = [];
  getPosesStatus() {
    this.httpService.http_api_get('transaction/sale/status/').subscribe((value) => {

      if (value.success) {
        this.saleStatusData = value.data.status;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  posesDetailDelete(item) {
    if (confirm("Are you sure to delete this data?")) {
      item.is_active = 0;
      this.count();
    }
  }

  Modal3Header;
  modal3Show(item) {
    this.childModal3.show();
    this.getBusinesspartneraddress();
  }

  modal3Hide() {
    this.childModal3.hide();
  }

  formDeliverySubmit() {
    this.modal3Hide();
  }

  Modal4Header;
  modal4Show() {
    this.getPosList();
    this.childModal4.show();
  }

  modal4Hide() {
    this.childModal4.hide();
  }

  modal4Out(item) {

    this.setpos(item.data);

    if (this.formPos.value.orisale_status_id != 5) {
      this.formFieldDisabledEnabled(1);
    } else {
      this.formFieldDisabledEnabled(0);
    }

    this.getPosesDetail();
    this.modal4Hide();
  }

  settings2 : any = {
    actions: {
      delete: false,
      // add: false
    },
    mode: 'external',
    edit: {
      editButtonContent: `${this.gen.td_selectTbl3}`,
      confirmSave: true,
    },
    add: {
      addButtonContent: `${this.gen.td_refreshTbl3}`,
      confirmSave: true,
    },
    columns: {
      branch_name: {
        title: this.gen.th_branchTbl3,
        type: 'string',
        editable: false
      },
      pos_code: {
        title: this.gen.th_codeTbl3,
        type: 'string',
        editable: false
      },
      transaction_date_show: {
        title: this.gen.th_dateTbl3,
        type: 'string',
        editable: false
      },
      businesspartner_name: {
        title: this.gen.th_customerTbl3,
        type: 'string'
      },
      currency_id: {
        title: this.gen.th_currencyTbl3,
        type: 'string'
      },
      transaction_payment_name: {
        title: this.gen.th_paymentTbl3,
        type: 'string'
      },
      grand_total: {
        title: this.gen.th_grand_totalTbl3,
        type: 'number'
      },
      pos_status_name: {
        title: this.gen.th_statusTbl3,
        type: 'string'
      },
      employee_name: {
        title: this.gen.th_createByTbl3,
        type: 'string'
      },
    },
    pager: {
      perPage: 75
    }
  };
  source2: LocalDataSource = new LocalDataSource();

  getPosList() {
    this.httpService.http_api_post('transaction/pos/select', { is_use: 0, pos_session_id: this.formPos_session.value.pos_session_id }).subscribe((value) => {

      if (value.success) {
        this.source2.load(value.data.poses);
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  getPosesDetail() {
    this.httpService.http_api_post('transaction/pos/detail', { pos_id: this.formPos.value.pos_id }).subscribe((value) => {

      if (value.success) {
        this.posesDetail = value.data.pos_detail;
        this.count();
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  setCurrencyData(event) {
    this._formPos.currency_id = event.currency_id;
    this._formPos.rate = event.rate;
    this.formPos.patchValue({
      currency_id: event.currency_id,
      rate: event.rate
    })
  }

  ngModalChange() {

  }

  posParse: any;
  posSubmit(doesPrinting) {

    this.count();
    this.posParse = this.copying(this.formPos.getRawValue());
    this.posParse.pos_detail = this.copying(this.posesDetail);
    this.posParse.update_by = this.httpService.currentUser.employee_id;
    this.posParse.update_datetime = new Date();

    this.posParse.orisub_total = this.posParse.sub_total;
    this.posParse.oritax = this.posParse.tax;
    this.posParse.origrand_total = this.posParse.grand_total;
    this.posParse.oridownpayment = this.posParse.downpayment;
    this.posParse.orilanded_cost = this.posParse.landed_cost;
    this.posParse.orireceivable = this.posParse.receivable;

    if (this.posParse.pos_id == '') {
      this.posParse.create_by = this.httpService.currentUser.employee_id;
      this.posParse.create_datetime = new Date();
      this.httpService.http_api_post('transaction/pos', this.posParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setpos(this.posParse);
            this.formPos.patchValue({
              pos_code: value.data.pos_code,
              pos_id: value.data.pos_id,
              orisale_status_id: this.formPos.value.sale_status_id
            })

            if (this.formPos.value.orisale_status_id != 5) {
              this.formFieldDisabledEnabled(1);
            } else {
              this.formFieldDisabledEnabled(0);
            }
            if(doesPrinting){
              this.printReceipt()
            }
            this.getPosesDetail();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {

      this.saveUpdate(doesPrinting);
    }

  }

  saveUpdate(doesPrinting) {

    this.httpService.http_api_put('transaction/pos', this.posParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formPos.value.is_active == 0) {
            this.clearAll();
          } else {
            if (value.data.pos_code) {
              this.posParse.pos_code = value.data.pos_code;
            }
            this.setpos(this.posParse);
            this.formPos.patchValue({
              orisale_status_id: this.formPos.value.sale_status_id
            })
            if (this.formPos.value.orisale_status_id != 5) {
              this.formFieldDisabledEnabled(1);
            } else {
              this.formFieldDisabledEnabled(0);
            }
            if(doesPrinting){
              this.printReceipt()
            }
            this.getPosesDetail();
          }
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  posDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formPos.patchValue({ is_active: 0 });
      this.posSubmit(false);
    }
  }

  Modal5Header;
  modal5Show(item) {
    this.childModal5.show();
  }

  modal5Hide() {
    this.childModal5.hide();
  }

  formTermSubmit() {
    this.modal5Hide();
  }

  posesDetailChange(value) {

  }

  clearAll() {

    this.setpos(false);

    this.formFieldDisabledEnabled(1);

    this.posesDetail = JSON.parse("[]");
    this.formPosDetail.reset(this._formPosDetail)
    this.posDetailOrderedCount = 0;
    this.posDetailDiscountCount = 0;
    this.posDetailPriceCount = 0;
    this.posDetailLength = 0;
  }

  posDetailOrderedCount = 0;
  posDetailDiscountCount = 0;
  posDetailPriceCount = 0;

  posDetailLength = 0;

  count() {

    if (this.posesDetail.length > 0) {
      this.posDetailOrderedCount = 0;
      this.posDetailDiscountCount = 0;
      this.posDetailPriceCount = 0;
      this.posDetailLength = 0;

      this.formPos.patchValue({
        sub_total: 0,
        tax: 0
      })

      for (let e of this.posesDetail) {

        if (e.is_active == 1) {
          e.discount_amount = (e.price * e.ordered) * e.discount_persent / 100;

          this.posDetailOrderedCount += e.ordered;
          this.posDetailDiscountCount += e.discount_amount;
          this.posDetailLength += 1;
          this.posDetailPriceCount += e.price;
          var sub_totalParse = (e.price * e.ordered) - e.discount_amount;
          this.formPos.patchValue({
            sub_total: this.formPos.value.sub_total + sub_totalParse
          })

          e.orderedeqv = e.ordered;
          e.deliveredeqv = e.delivered;

          if (e.uom_order == 1) {
            e.orderedeqv = e.ordered;
            e.deliveredeqv = e.delivered;
          } else if (e.uom_order == 2) {
            e.orderedeqv = e.uom2equal * e.ordered;
            e.deliveredeqv = e.uom2equal * e.delivered;
          } else if (e.uom_order == 3) {
            e.orderedeqv = e.uom3equal * e.ordered;
            e.deliveredeqv = e.uom3equal * e.delivered;
          }

          for (let f of this.taxData) {

            if (e.tax_id == f.tax_id) {
              e.tax = sub_totalParse * f.percentage / 100;
              this.formPos.patchValue({
                tax: this.formPos.value.tax + e.tax
              })
            }

          }
        }

      }

      var grand_total = this.formPos.value.sub_total + this.formPos.value.landed_cost + this.formPos.value.tax - this.formPos.value.discount_amount;

      this.formPos.patchValue({
        grand_total: grand_total,
        receivable: grand_total - this.formPos.value.downpayment,
        downpayment_persent: this.formPos.value.downpayment / grand_total * 100,
      })

    }

  }

  posDiscountCountAmount(event) {
    if (this.posesDetail.length > 0) {
      this.formPos.patchValue({ discount_amount: (this.formPos.value.sub_total + this.formPos.value.landed_cost) * this.formPos.value.discount_persent / 100 });
      this.count();
    }
  }

  posDiscountCountPersent(event) {
    if (this.posesDetail.length > 0) {

      this.formPos.patchValue({ discount_persent: this.formPos.value.discount_amount / (this.formPos.value.sub_total + this.formPos.value.landed_cost) * 100 });
      this.count();
    }
  }

  posDownpaymentCountAmount(event) {
    if (this.posesDetail.length > 0) {
      this.formPos.patchValue({ downpayment: this.formPos.value.grand_total * this.formPos.value.downpayment_persent / 100 });
      this.count();
    }
  }

  posDownpaymentCountPersent(event) {
    if (this.posesDetail.length > 0) {
      this.formPos.patchValue({ downpayment_persent: this.formPos.value.downpayment / this.formPos.value.grand_total * 100 });
      this.count();
    }
  }

  posDetailUomOrderChange() {

    if (this.formPosDetail.value.uom_order == 1) {
      this.formPosDetail.patchValue({
        orderedeqv: this.formPosDetail.value.ordered,
        deliveredeqv: this.formPosDetail.value.delivered,
        uom_label: this.formPosDetail.value.uom1,
        price: this.formPosDetail.value.retailselling_price,
        min_price: this.formPosDetail.value.min_retailselling_price,
      })
    } else if (this.formPosDetail.value.uom_order == 2) {
      this.formPosDetail.patchValue({
        orderedeqv: this.formPosDetail.value.uom2equal * this.formPosDetail.value.ordered,
        deliveredeqv: this.formPosDetail.value.uom2equal * this.formPosDetail.value.delivered,
        uom_label: this.formPosDetail.value.uom2,
        price: this.formPosDetail.value.retailselling_price2,
        min_price: this.formPosDetail.value.min_retailselling_price,
      })
    } else if (this.formPosDetail.value.uom_order == 3) {
      this.formPosDetail.patchValue({
        orderedeqv: this.formPosDetail.value.uom3equal * this.formPosDetail.value.ordered,
        deliveredeqv: this.formPosDetail.value.uom3equal * this.formPosDetail.value.delivered,
        uom_label: this.formPosDetail.value.uom3,
        price: this.formPosDetail.value.retailselling_price3,
        min_price: this.formPosDetail.value.min_retailselling_price,
      })
    }

  }

  isSaleOrderOrdered() {
    if (this.formPos.value.orisale_status_id == 5) {
      return true;
    } else {
      return false;
    }
  }

  // dropdown buttons
  public status: { isopen } = { isopen: false };
  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  isFormDetailValue: boolean = false;

  formDetailValue() {
    this.isFormDetailValue = !this.isFormDetailValue;
  }


  pos_sessionCategoryData: any = [];

  pos_sessionData: any = [];
  getPos_session() {
    this.httpService.http_api_post('transaction/pos_session/select', { is_use: 0 }).subscribe((value) => {
      console.log(value)
      if (value.success) {
        this.pos_sessionData = value.data.pos_session;
        this.pos_sessionCategoryData = value.data.category;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  pos_sessionParse: any;
  pos_sessionSubmit(start, finish) {

    this.pos_sessionParse = this.copying(this.formPos_session.getRawValue());

    if (start) {
      this.pos_sessionParse.pos_session_status_id = 2;
    }
 
    if (finish) {
      this.pos_sessionParse.pos_session_status_id = 3;
    }

    this.pos_sessionParse.update_by = this.httpService.currentUser.employee_id;
    this.pos_sessionParse.update_datetime = new Date();

    // this.pos_sessionParse.branch_id = this.currentUser.branch_id;

    if (this.pos_sessionParse.pos_session_id == '') {
      this.pos_sessionParse.create_by = this.httpService.currentUser.employee_id;
      this.pos_sessionParse.create_datetime = new Date();

      this.httpService.http_api_post('transaction/pos_session', this.pos_sessionParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formPos_session.patchValue({
              ...this.copying(this.pos_sessionParse),
              pos_session_id: value.data.pos_session_id
            })

            this.getPos_session();
            this.posSessionModalHide();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.pos_sessionSaveUpdate();
    }

  }

  pos_sessionSaveUpdate() {

    this.httpService.http_api_put('transaction/pos_session', this.pos_sessionParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formPos_session.value.is_active == 0) {
            this.pos_sessionClearAll();
          } else {
            this.formPos_session.patchValue(this.copying(this.pos_sessionParse));
            this.getPos_session();
          }
          this.posSessionModalHide();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  pos_sessionDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formPos_session.patchValue({ is_active: 0 });
      this.pos_sessionSubmit(false, false);
    }
  }

  pos_sessionClearAll() {
    this.formPos_session.reset(this._formPos_session)
  }

  editPos_session(item) {
    this.posSessionModalShow();
    this.formPos_session.patchValue(this.copying(item));
  }

  posSessionStart(item) {
    this.formPos_session.patchValue(this.copying(item));
    this.pos_sessionSubmit(true, false);
  }

  posSessionFinish(item) {
    this.formPos_session.patchValue(this.copying(item));
    this.pos_sessionSubmit(false, true);
  }

  posSessionSelect(item) {
    this.formPos_session.patchValue(this.copying(item));
    this._formPos.pos_session_id = item.pos_session_id;
    this._formPos.currency_id = item.currency_id;
    this._formPos.rate = item.rate;
    this._formPos.branch_id = item.branch_id;
    this._formPos.warehouse_id = item.warehouse_id;
    this.setpos(false);
  }

  posSessionModalShow() {
    this.posSessionModal.show();
  }

  posSessionModalHide() {
    this.formPos_session.reset(this._formPos_session)
    this.posSessionModal.hide();
  }

  setCurrencyPOSSessionData(event) {
    this.formPos_session.patchValue({
      currency_id: event.currency_id,
      rate: event.rate
    })

  }

  businessPartneraddress: any = [];
  getBusinesspartneraddress() {
    this.businessPartneraddress = JSON.parse("[]");
    console.log(this.formPos.value.businesspartner_id);
    if (this.formPos.value.businesspartner_id != '') {
      this.httpService.http_api_post('company/businesspartner/addresslist', { businesspartner_id: this.formPos.value.businesspartner_id })
        .subscribe((value) => {

          if (value.success) {
            this.businessPartneraddress = value.data.address;
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    }
  }

  businesspartnerAddressSelect(address) {
    this.formPos.patchValue({ delivery_address: address });
  }

  selectedCustomer(event) {
    this.formPos.patchValue({
      discount_date: event.discount_date,
      due_date: event.due_date,
      early_discount: event.early_discount,
      late_charge: event.late_charge
    })

  }
}
