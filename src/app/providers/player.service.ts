import { Injectable } from '@angular/core';
import PLAYER from '../models/player';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private players: PLAYER[];
  private playersSubject = new Subject<PLAYER[]>();
  private dealer: PLAYER;

  constructor() { 
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
}
