import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'inventory',
  styleUrls: ['./inventory.scss'],
  templateUrl: './inventory.html',
})
export class Inventory {
  public inventorydata: any = {};
  public inventoryCategory: any;

  constructor(

  ) {
    this.inventoryCategory = { inventory_category_id: '1', category: 'Inventory' };

  }

  selectedInventorylabel(data) {

  }
}
