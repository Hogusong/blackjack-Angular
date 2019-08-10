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
  countInPlayers = 0;
  gameConfig: any;
  configSubscription: Subscription;
  dialogBox = null;

  constructor(private baseService: BaseService,
              private playerService: PlayerService) {}

  ngOnInit() {
    this.gameConfig = this.baseService.getConfig();
    this.configSubscription = this.baseService.getConfigSubject()
      .subscribe(config => this.gameConfig = config);
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
    this.playersSubscription = this.playerService.getPlayersSubject()
      .subscribe(players => {
        if (players.length < 1) {
          const UIconfig = this.baseService.getAllFalseUIconfig();
          UIconfig.openAddNew = true;
          this.baseService.setUIconfig(UIconfig);
          this.oldUIC = this.baseService.getDefaultUIconfig();
        }    
      })
  }

  startGame() {
    if (this.playerService.countInPlayers() < 1) {
      this.dialogBox = { 
        open: true,
        markup: `<p>You should select players to start the Game!</p>`
      };
    } else {
      const uiConfig = this.baseService.getAllFalseUIconfig();
      uiConfig.gameStarted = true;
      uiConfig.openMenu = true;
      this.baseService.setUIconfig(uiConfig);
    }
  }
  
  changeAutoPlay(status) {
    this.gameConfig.autoPlay = status;
    this.baseService.setConfig(this.gameConfig);
  }

  ngOnDestroy() {
    this.UICsubscription.unsubscribe();
  }
}
