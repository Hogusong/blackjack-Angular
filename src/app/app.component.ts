import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseService } from './providers/base.service';
import { PlayerService } from './providers/player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  UIC: any = {};
  oldUIC: any = {};                 // Keep the previous UI to return.
  UICsubscription: Subscription;    // Watching UIC's update.
  playersSubscription: Subscription;

  constructor(private baseService: BaseService,
              private playerService: PlayerService) {}

  ngOnInit() {
    this.UIC = this.baseService.getUIconfig();
    this.UICsubscription = this.baseService.getUIconfigSubject()
      .subscribe(config => {
        this.oldUIC = this.UIC;
        this.UIC = config;
      });
    if (this.playerService.getPlayers().length < 1) {
      const UIconfig = this.baseService.getAllFalseUIconfig();
      UIconfig.openAddNew = true;
      this.baseService.setUIconfig(UIconfig);
    }
  }

  ngOnDestroy() {
    this.UICsubscription.unsubscribe();
  }
}
