import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './empty-layout.component.html'
})
export class EmptyLayoutComponent implements OnInit {

  public disabled = false;
  public status: { isopen: boolean } = { isopen: false };
  windowheight = {};
  constructor(
    private router: Router,
    private ngZone: NgZone,
  ) {
    document.querySelector('body').classList.toggle('sidebar-hidden');
    this.windowheight = { 'height': window.innerHeight - 57 + 'px' };
    window.onresize = (e) => {
      //ngZone.run will help to run change detection
      this.windowheight = { 'height': window.innerHeight - 57 + 'px' };
      this.ngZone.run(() => {

      });
    };
  }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  ngOnInit(): void { }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentCompany');
    this.router.navigateByUrl('/');
  }


}
