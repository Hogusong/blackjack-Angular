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

  startGame() {}
}
