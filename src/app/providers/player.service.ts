import { Injectable } from '@angular/core';
import PLAYER from '../models/player';
import { Subject } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private players: PLAYER[];
  private playersSubject = new Subject<PLAYER[]>();
  private dealer: PLAYER;

  constructor(private baseService: BaseService) { 
    const data = JSON.parse(localStorage.getItem('players'));
    this.players = data ? data.map(d => new PLAYER(d[0], d[1])) : [];
    this.playersSubject.next([...this.players]);
    this.dealer = new PLAYER('Dealer', 10000000, true);
  }

  getDealer() {  return this.dealer;  }
  getPlayers() { return [...this.players];  }
  getPlayersSubject() {  return this.playersSubject.asObservable();  }

  addNewPlayer(player) {
    this.players.push(player);
    this.updateStorage();
  }

  updatePlayer(players) {
    this.players = players;
    this.playersSubject.next([...this.players]);  
  }

  removePlayer(name) {
    const index = this.players.findIndex(p => p.getName() === name);
    if (index >= 0) {
      this.players.splice(index, 1);
      this.updateStorage();
    }
  }

  private updateStorage() {
    this.playersSubject.next([...this.players]);
    const data = this.players.map(p => [p.getName(), p.getAmount()]);
    localStorage.setItem('players', JSON.stringify(data));
  }

  isNewName(name) {
    return this.players.findIndex(p => p.getName() === name) < 0;
  }

  countInPlayers() {
    let count = 0;
    this.players.forEach(p => {
      if (p.getInPlay() && p.getAmount() >= p.getBetting()) count ++;
    });
    return count;
  }

  // Collect all valid players and return the list for the game.
  // Whoelse select 'in-play' option and pocket amount >= betting amount.
  getActivePlayers() {
    let inPlayers = [];
    this.players.forEach((p) => {
      if (p.getInPlay()) {
        if (p.getAmount() >= p.getBetting()) inPlayers.push(this.clonePlayer(p));  
      } else p.setPrevResult("didn't play");
    });
    return [...inPlayers];
  }

  clonePlayer(P) {
    const newP = new PLAYER(P.getName(), P.getAmount(), true);
    newP.setBetting(P.getBetting());
    newP.setPrevResult('');
    return newP;
  }

  updateInsurance(I, hadBlackjack) {
    I.forEach(i => {
      const index = this.players.findIndex(p => p.getName() === i.name);
      if (index >= 0) {
        if (i.insured) {
          if (hadBlackjack) this.players[index].updateAmount(i.betting)
          else this.players[index].updateAmount(-i.betting/2)
        }
      }
    })
  }

  updateGameResult(P, gameResult) {
    P.forEach((p, index) => {
      const i = this.players.findIndex(pb => pb.getName() === p.getName());
      if (i >= 0) {
        if (gameResult[index] > 0) {          // Player won this hand.
          this.players[i].updateAmount(p.getBetting());
        } else if (gameResult[index] < 0) {   // Player lost this hand.
          this.players[i].updateAmount(-p.getBetting());
          p.setPrevResult('Lost hand!');
        }
        this.players[i].setPrevResult(p.getPrevResult());
        this.players[i].setInitPlayer(this.baseService.getConfig());
      }
    });
    this.updateStorage();
  }
}
