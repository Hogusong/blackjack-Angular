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
    // Confirm that the active player clicked the button.
    if (this.currIndex === i) {
      const onHand = this.players[i].getOnHand();
      const v_0 = onHand[0].getValue();
      const v_1 = onHand[1].getValue();
      if (onHand.length == 2 && v_0 == v_1) {
        if (v_0 == 11 && this.players[i].getIsSplited()) {
          this.errorMessage(`<p>Second SPLIT with double Aces is not allowed!</p>`);
        } else if (this.players[i].getAmount() < this.players[i].getBetting() * 2) {
          this.errorMessage(`<p>Sorry! You have not enough money for SPLIT.</p>`);
        } else {
          // Remark as 'SPLITED' and replace the hand with only one card.
          this.players[i].setIsSplited(true);
          this.players[i].setOnHand([onHand[0]]);
          // Duplicate player and let player has same one card and remark 
          const temp = this.playerService.clonePlayer(this.players[i]);
          temp.setIsSplited(true);
          temp.setOnHand([onHand[1]]);
          // Replace the current player and insert this duplicated player to the players list
          // and the gameResult list in same position(right next of the current player). 
          const P = this.players;
          this.players = [...P.slice(0, i), this.players[i], temp, ...P.slice(i+1)];
          this.gameResult = [...this.gameResult.slice(0,i), 0, 0, ...this.gameResult.slice(i+1)];
        }
      } else {
        this.errorMessage(`
          <p>Not allowed 'SPLIT'!</p>
          <p>You have more than 2 cards or not same cards!</p>`);
      }
    }
  }

  doubleDown(i) {
    // Confirm that the active player clicked the button.
    if (this.currIndex === i) {
      if (this.players[i].getOnHand().length != 2) {
        this.errorMessage(`<p>DOUBLE DOWN is allowed<br>when player has only 2 cards!</p>`);
      } else {
        this.cardService.drawCard(this.players[i]);
        if (this.players[i].getAmount() < this.players[i].getBetting() * 2) {
          this.players[i].setBetting(this.players[i].getAmount());          
          this.players[i].setPrevResult('DOUBLE betting for less. Good luck!');
        } else {
          this.players[i].setBetting(this.players[i].getBetting() * 2);
          this.players[i].setPrevResult('Player made DOUBLE betting. Good luck!');
        }
        this.players[i].setCanDraw(false);    // Disable this player. set pending.
        this.getCurrIndex();                  // Move to the next available player.
      }
    }
  }

  drawOneMore(i) {
    // Confirm that the active player clicked the button.
    if (this.currIndex === i) {
      this.cardService.drawCard(this.players[i]);

      // If this player had only one card which was 'A', 
      // let the player stay out as pending status after drew a card.
      const onHand = this.players[i].getOnHand();
      if (onHand.length == 2 && onHand[0].getValue() == 11) {
        this.players[i].setCanDraw(false);
        this.stayInGame(i);
      }
      // If the player's score went over 21, the player loose this hand.
      if (this.players[i].getScore() > 21) {
        this.players[i].setPrevResult('Player lost this hand!');
        this.players[i].looseHand();      // Process as lost and disable this player.
        this.gameResult[i] = -1;          // Remark as looser in the gameResult list.
        this.getCurrIndex();              // Move to the next available player.
      }
    }
  }

  stayInGame(i) {
    // Confirm that the active player clicked the button.
    if (this.currIndex === i) {
      if (this.players[i].getOnHand().length < 2) {
        this.errorMessage(`
          <p>Not allowed to stay with one card.<br>You must HIT this time!</p>`)
      } else {
        this.players[i].setPrevResult('Player stay with the current score.');
        this.players[i].setCanDraw(false);    // Disable this player. set pending.
        this.getCurrIndex();                  // Move to the next available player.
      }
    }
  }

  errorMessage(markup) {
    this.dialogBox = {
      open: true,
      markup: markup
    }
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
