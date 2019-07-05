import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<div class="loading" *ngIf="loading">Loading&#8230;</div><router-outlet></router-outlet>',
  styleUrls: ['./layouts.scss']
})
export class LayoutsComponent {
  loading: boolean = true;
  constructor(
    private router: Router
  ) {
    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }
  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }
}
