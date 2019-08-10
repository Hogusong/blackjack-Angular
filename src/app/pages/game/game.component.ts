import { Component, OnInit } from '@angular/core';
import CARD from 'src/app/models/card';
import PLAYER from 'src/app/models/player';
import { BaseService } from 'src/app/providers/base.service';
import { PlayerService } from 'src/app/providers/player.service';
import { CardService } from 'src/app/providers/card.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  config: any;              // to carry game configuration
  dialogBox = null;
  dealer: PLAYER;
  d_onHand: CARD[];         // to contain dealer's cards
  cards: CARD[];            // to carry the current decks
  players: PLAYER[];        // to contain all active players who choose 'in-play'.
  gameResult = [];          // 1 for winner, -1 for looser, 0 for pending of tie.
  insurance = [];           // to contain player's insurance status.
  currIndex: number = -1;   // to track the current player to allow all actions.
  dealerBlackjack = false; 
  openDealerCards = false;
  showGameResult = false;
  drawDealerCard = false;
  drawPlayerCard = false;
  askInsurance = false;     // to open the asking box, when dealer's 1st card = 'A'.

  constructor(private playerService: PlayerService,
              private baseService: BaseService,
              private cardService: CardService) { }

  ngOnInit() {
    this.config = this.baseService.getConfig();
    this.cards = this.cardService.getCards();
    this.dealer = this.playerService.getDealer();
    this.players = this.playerService.getActivePlayers();
    if (this.players.length > 0) this.initialDraw();
  }

  initialDraw() {
    // Shuffe cards again when too little cards left as avaiable.
    const limit = Math.max(this.players.length * 7, 40); 
    if (this.cards.length < limit) {
      this.cardService.createCards();
    }
    this.dealer.setOnHand([]);         // Make empty the dealer's onHand[].

    // Draw cards for Dealer and all Players
    this.cardService.drawCard(this.dealer);
    this.players.forEach(player => this.cardService.drawCard(player));
    this.cardService.drawCard(this.dealer);
    this.players.forEach(player => this.cardService.drawCard(player));

    // Check dealer's 1st card to ask for the insurance to all players.
    if (this.dealer.getOnHand()[0].getKey() === 'A') {
      this.insurance = this.players.map(p => {
        return { name: p.getName(), betting: p.getBetting(), score: p.getScore(), insured: false }
      });
      this.askInsurance = true;   // Open a Box to ask getting insurance.
    } else {
      this.startGame();           // Start game: dealer's 1st card is not 'A"
    }
  }

  startGame() {
    // Check Blackjack for dealer's hand first.
    this.dealerBlackjack = this.dealer.hasBlackjack();
    if (this.dealerBlackjack) {
      // Generate game result by checking player's hand.
      this.gameResult = this.players.map(p=> {
        if (p.hasBlackjack()) {
          p.evenHand();           // Both dealer & player have Blackjack.
          return 0;
        } else {
          p.looseHand();          // Dealer has Blackjack but player does not have.
          return -1;
        }
      });
      // Just open dealer's hand without drawing a card.
      this.openDealerCards = true;
      this.updateGameResult();
    } else {
      // Prepare to let player start game.
      this.gameResult = this.players.map(p => {
        if (p.hasBlackjack()) {
          p.blackjack();        // reset canDrawCard = false
          return 1;             // Player win cause player has a Blackkjack
        }
        return 0;               // Let player choose one of the game options.
      });
      this.drawPlayerCard = true;
      this.getCurrIndex();      // Find next available player and set the index up.
    }
  }

  getCurrIndex() {
    // Find the first player who is ready to decide for his/her hand.
    this.currIndex = this.players.findIndex(p => p.getCanDraw());
    if (this.currIndex < 0) {
      this.drawPlayerCard = false;
      if (this.gameResult.includes(0)) {    // '0' mean player need to see dealer's
        // Players are waiting for dealer to draw cards.
        this.openDealerCards = true;
        this.drawDealerCards();
      } else {
        // Dealer does not need to draw a card because all players got the RESULT.
        this.openDealerCards = true;
        this.updateGameResult();
      }
    }
  }

  splitCards(i) {
    console.log('split', i)
  }

  doubleDown(i) {
    console.log('double down', i)
  }

  drawOneMore(i) {
    console.log('hit', i)
  }

  stayInGame(i) {
    console.log('stay', i)
  }

  drawDealerCards() {

  }

  submitInsurance() {
    this.askInsurance = false;
    this.startGame();
  }

  compareScore() {

  }

  // Update the result of the game and the insurance to the storage.
  updateGameResult() {
  }
}
