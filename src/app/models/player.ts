import CARD from './card';

export default class PLAYER {
  private name: string;
  private amount: number;
  private onHand: CARD[];           // store player's cards on hand.
  private countAces: number;        // store how many Aces on hand.
  private betting: number;
  private isSplited: boolean;       // help tracking player did split of not.
  private canDrawCard: boolean;     // help taacking player is active or not.
  private inPlay: boolean;          // help tracking player joined the game or not.
  private prevResult: string        // to say the last hand's result.

  constructor(name, amount, inPlay=false) {
    this.name = name;
    this.amount = amount;
    this.onHand = [];
    this.countAces = 0;
    this.betting = 5;
    this.isSplited = false;
    this.canDrawCard = inPlay;
    this.inPlay = inPlay;
    this.prevResult = 'Welcome!';
  }

  getName() {  return this.name;  }
  getAmount() {  return this.amount;  }
  getBetting() {  return this.betting;  }
  getOnHand() {  return this.onHand;  }
  getCountAce() {  return this.countAces;  }
  getInPlay() {  return  this.inPlay;  }
  getCanDraw() { return this.canDrawCard; }
  getIsSplited() { return this.isSplited; }
  getPrevResult() {  return this.prevResult;  }
  getScore() {
    let score = 0, count = 0;
    this.onHand.forEach(card => {
      score += card.getValue();
      if (card.getValue() > 10) count++;
    });
    while (score > 21 && count-- > 0) score -= 10;
    return score;
  }
  // lastCard() {  return this.onHand[this.onHand.length-1];  }

  setInPlay(status) { 
    this.inPlay = status;
    this.canDrawCard = status;
  }
  setCanDraw(status) { this.canDrawCard = status; }
  updateAmount(amt) { this.amount += amt; }
  setBetting(amt) {  this.betting = amt;  }
  setPrevResult(result) { this.prevResult = result; }
  setIsSplited(status) { this.isSplited = status; }
  setOnHand(hand) { 
    this.onHand = hand; 
    this.countAces = 0;
  }
  addOnHand(card) {
    if (card.getKey() === 'A') this.countAces++;
    this.onHand.push(card);
  }
  looseHand() {
    this.amount -= this.betting;
    this.canDrawCard = false;
    this.countAces = 0;
    this.prevResult = 'Lost hand!';
  }
  blackjack() {
    this.betting = this.betting * 1.5;
    this.canDrawCard = false;
    this.countAces = 0;
    this.prevResult = 'Blackjack. Wow!';
  }
  winHand() {
    this.amount += this.betting;
    this.canDrawCard = false;
    this.countAces = 0;
    this.prevResult = 'Won hand!';
  }
  evenHand() {
    this.canDrawCard = false;
    this.countAces = 0;
    this.prevResult = 'Even hand!';
  }

  setInitPlayer(config) {
    if (!config.keepLastBet) this.betting = +config.minBetting
    this.inPlay = config.keepInPlay;
    this.canDrawCard = false;
    this.countAces = 0;
  }
  
  hasBlackjack() {
    if (this.onHand.length > 2) return false;
    let index = this.onHand.findIndex(card => card.getKey() === 'A');
    if (index < 0) return false;
    index = index < 1 ? 1 : 0;
    return this.onHand[index].getValue() === 10;
  }
}
