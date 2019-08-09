import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private UIconfig: any;        // Keep UI configuration globally.
  private UIconfigSubject = new Subject<any>();
  private config: any;          // Keep game configuration globally.
  private configSubject = new Subject<any>();

  constructor() {
    this.config = JSON.parse(localStorage.getItem('bj-config'));
    if (!this.config) this.config = this.getDefaultConfig();
    this.config.delay4dealer = 1000;
    this.configSubject.next(this.config);
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

  getConfigSubject() {  return this.configSubject.asObservable();  }
  getConfig() {  return this.config;  }
  getDefaultConfig() {
    return {
      showResult: true,
      delay: 2000,
      delay4dealer: 1000,
      keepInPlay: true,
      keepLastBet: true,
      minBetting: 5,
      howManyDecks: 6,
      autoPlay: false,
    }
  }

  setConfig(config) {
    localStorage.setItem('bj-config', JSON.stringify(config));
    this.configSubject.next(this.config = config);
  }

  resetDefultConfig() {
    this.setConfig(this.getDefaultConfig());
  }
}
