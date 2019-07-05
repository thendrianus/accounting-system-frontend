import { Component, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../../';

@Component({
  selector: 'inventorydetailcategory',
  styleUrls: ['./inventorydetailcategory.scss'],
  templateUrl: './inventorydetailcategory.html'
})

export class Inventorydetailcategory {
  @Output() setInventorydetailcategory: EventEmitter<string> = new EventEmitter<string>();
  inventorydetailcategory: any = [];
  selectedInventorydetailcategory: string = '';

  constructor(
    protected httpService: HttpService,
  ) {
    this.httpService.http_api_get('inventory/inventorydetailcategory/')
      .subscribe((value) => {
        if (value.success) {
          this.inventorydetailcategory = value.data.inventorydetailcategory;
          if (this.inventorydetailcategory.length > 0) {
            this.selectedInventorydetailcategory = this.inventorydetailcategory[0].inventory_detail_category_id;
            this.inventorydetailcategoryChange();
          }
        }
      },
        error => {
          //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
          console.log(error);
        });
  }

  inventorydetailcategoryChange() {
    this.setInventorydetailcategory.emit(this.selectedInventorydetailcategory);
  }
}
