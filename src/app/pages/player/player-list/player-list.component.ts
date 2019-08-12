import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseService } from 'src/app/providers/base.service';
import PLAYER from 'src/app/models/player';
import { Subscription } from 'rxjs';
import { PlayerService } from 'src/app/providers/player.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit, OnDestroy {
  dealer: PLAYER;
  players: PLAYER[] = [];
  config: any = {};
  betAmt = [];              // Contain each player's Betting Amount
  countInPlayers = 0;       // Keep the valid 'in-play' players
  configSub: Subscription;  // Keep watching the change of the Configuration.
  playerSub: Subscription;  // Keep watching the change of the players list

  constructor(private baseService: BaseService,
              private playerService: PlayerService) { }

  ngOnInit() {
    this.dealer = this.playerService.getDealer();
    this.players = this.playerService.getPlayers();
    this.config = this.baseService.getConfig();
    // Count players who are in 'in-play' mode and amount >= betting.
    this.countInPlayers = this.playerService.countInPlayers();
    this.betAmt = this.players.map(p => {
      if (p.getBetting() < this.config.minBetting) return this.config.minBetting;
      return p.getBetting();
    });

    this.configSub = this.baseService.getConfigSubject()
      .subscribe(res => {
        this.config = res;
      });
    this.playerSub = this. playerService.getPlayersSubject()
      .subscribe(res => {
        this.players = res;
        this.countInPlayers = this.playerService.countInPlayers();
        this.betAmt = this.players.map(p => {
          if (p.getBetting() < this.config.minBetting) return this.config.minBetting;
          return p.getBetting();
        });
      });
    // Start a new game automatically when 'AutoPlay = true' and valid player exist.
    if (this.config.autoPlay && this.playerService.countInPlayers() > 0 ) {
      const uiConfig = this.baseService.getAllFalseUIconfig();
      uiConfig.gameStarted = true;
      uiConfig.openMenu = true;
      // Update UI configuration to start a new GAME.
      this.baseService.setUIconfig(uiConfig);
    }
  }

  // Toggle the status of 'in-play' mode.
  changeStatus(i, status) {
    this.players[i].setInPlay(status);
    if (status)     this.players[i].setBetting(this.betAmt[i]);
    this.playerService.updatePlayer([...this.players]);
    this.countInPlayers = this.playerService.countInPlayers();
  }

  getStatus(i) {
    return this.players[i].getInPlay() ? 'In Play' : 'Stay Out';
  }

  setColor(i) {
    return this.players[i].getInPlay() ? 'c-blue' : 'c-red';
  }

  updateBetting(i) {
    this.players[i].setBetting(this.betAmt[i]);
    this.playerService.updatePlayer([...this.players]);
  }

  ngOnDestroy() {
    this.configSub.unsubscribe();
    this.playerSub.unsubscribe();
  }
}
