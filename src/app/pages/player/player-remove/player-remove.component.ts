import { Component, OnInit, Input } from '@angular/core';
import { BaseService } from 'src/app/providers/base.service';
import PLAYER from 'src/app/models/player';
import { PlayerService } from 'src/app/providers/player.service';

@Component({
  selector: 'app-player-remove',
  templateUrl: './player-remove.component.html'
})
export class PlayerRemoveComponent implements OnInit {
  @Input() UIC: any;
  players: PLAYER[];

  constructor(private baseService: BaseService,
              private playerService: PlayerService) { }

  ngOnInit() {
    this.players = this.playerService.getPlayers();
  }

  removePlayer(i) {
    this.playerService.removePlayer(this.players[i].getName());
    this.players.splice(i, 1);
  }

  backToPreviousUI() {
    this.baseService.setUIconfig(this.UIC);
  }
}
