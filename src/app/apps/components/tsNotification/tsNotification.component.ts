import { Component, Input } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'ts-notification',
  styleUrls: ['./tsNotification.scss'],
  templateUrl: './tsNotification.html',
})
export class tsNotification {

  @Input() notifSuccess: any = { title: '', content: '', setting: '', change: '' };
  @Input() notifAlert: any = { title: '', content: '', setting: '', change: '' };
  @Input() notifError: any = { title: '', content: '', setting: '', change: '' };
  @Input() notifInfo: any = { title: '', content: '', setting: '', change: '' };
  @Input() notifWarn: any = { title: '', content: '', setting: '', change: '' };

  ngOnChanges(changes: any) {

    if (changes.notifSuccess) {
      if (!changes.notifSuccess.firstChange) {
        this.successFunction(changes.notifSuccess.currentValue.title, changes.notifSuccess.currentValue.content, changes.notifSuccess.currentValue.setting);
      }
    }

    if (changes.notifAlert) {
      if (!changes.notifAlert.firstChange) {
        this.alertFunction(changes.notifAlert.currentValue.title, changes.notifAlert.currentValue.content, changes.notifAlert.currentValue.setting);
      }
    }

    if (changes.notifError) {
      if (!changes.notifError.firstChange) {
        this.errorFunction(changes.notifError.currentValue.title, changes.notifError.currentValue.content, changes.notifError.currentValue.setting);
      }
    }

    if (changes.notifInfo) {
      if (!changes.notifInfo.firstChange) {
        this.infoFunction(changes.notifInfo.currentValue.title, changes.notifInfo.currentValue.content, changes.notifInfo.currentValue.setting);
      }
    }

    if (changes.notifWarn) {
      if (!changes.notifWarn.firstChange) {
        this.warnFunction(changes.notifWarn.currentValue.title, changes.notifWarn.currentValue.content, changes.notifWarn.currentValue.setting);
      }
    }

  }

  constructor(
    private _notificationsService: NotificationsService
  ) {

  }

  successFunction(title, content, setting) {
    this._notificationsService.success(
      title,
      content, setting
    )
  }

  alertFunction(title, content, setting) {
    this._notificationsService.alert(
      title,
      content, setting
    )
  }

  errorFunction(title, content, setting) {
    this._notificationsService.error(
      title,
      content, setting
    )
  }

  infoFunction(title, content, setting) {
    this._notificationsService.info(
      title,
      content, setting
    )
  }

  warnFunction(title, content, setting) {
    this._notificationsService.warn(
      title,
      content, setting
    )
  }

}
