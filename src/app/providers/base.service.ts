import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private UIconfig: any;
  private UIconfigSubject = new Subject<any>()
  constructor() {
    this.UIconfigSubject.next(this.UIconfig = this.getDefaultUIconfig());
  }

  getDefaultUIconfig() {
    return { openMenu: true,  selectPlayers: true };
  }

  getAllFalseUIconfig() {
    return {
      openMenu: false,
      selectPlayers: false,
      openAddNew: false,
      openRemove: false,
      gameStarted: false,
      openGameGuide: false,
      openBJCharts: false,
      openOptions: false
    }
  }

  getUIconfig() {  return this.UIconfig;  }
  getUIconfigSubject() {  return this.UIconfigSubject.asObservable();  }
  setUIconfig(config) {  this.UIconfigSubject.next(this.UIconfig = config);  }
}
