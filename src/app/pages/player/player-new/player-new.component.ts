import { Component, OnInit, Input } from '@angular/core';
import { BaseService } from 'src/app/providers/base.service';
import PLAYER from 'src/app/models/player';
import { PlayerService } from 'src/app/providers/player.service';

@Component({
  selector: 'app-player-new',
  templateUrl: './player-new.component.html',
  styleUrls: ['./player-new.component.css']
})
export class PlayerNewComponent implements OnInit {
  @Input() UIC: any;
  playerName: string;
  players: PLAYER[];
  amount: number = 100;
  dialogBox = null;

  constructor(private baseService: BaseService,
              private playerService: PlayerService) { }

  ngOnInit() {
    this.players = this.playerService.getPlayers();
  }

  backToMain() {
    if (this.players.length > 0) this.baseService.setUIconfig(this.UIC);
    else {
      this.dialogBox = {
        open: true,
        markup: `<p>You have to add a player to start GAME.</p>`
      }
    }
  }

  saveNewPlayer() {
    this.playerName = this.playerName.trim();
    if (this.playerService.isNewName(this.playerName)) {
      const newPlayer = new PLAYER(this.playerName, this.amount);
      this.playerService.addNewPlayer(newPlayer);
      this.players.push(newPlayer);
      this.playerName = '';
      this.amount = 100;
    } else {
      this.dialogBox = {
        open: true,
        markup: `<p>Name was taken already. Try another name!</p>`
      }
    }
  }
}
