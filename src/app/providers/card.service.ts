import { Injectable } from '@angular/core';
import CARD from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cards: CARD[];

  constructor() { 
    this.createCards();
  }

  createCards() {
    let cards = [];
    const noOfDecks = 6;
    for (let i = 0; i < noOfDecks; i++) {
      cards = [...cards, ...buildDeck()]
    }  
    this.cards = shuffle(cards, noOfDecks);
  }

  getCards() {
    return [...this.cards];
  }

  drawCard(player) {
    if (!player.getInPlay()) return;
    const card = this.cards.pop();
    player.addOnHand(card);      // Add the drawn card to the player's hand.
  }
}

function buildDeck() {
  const base = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suits = ['spades',  'clubs', 'hearts', 'diams'];
  const deck = [];
  for (let s of suits) {
    const keys = base.sort((a, b) => 0.5 - Math.random());
    for (let k of keys) {
      deck.push(new CARD(s, k));
    }
  }
  return deck;
}

function shuffle(cards, noOfDeck) {
  cards = cards.sort((a, b) => 0.5 - Math.random());
  const front = cards.slice(0, cards.length/2);
  const back =  cards.slice(cards.length/2);
  const count = front.length / noOfDeck;
  cards = []
  for (let i = 0; i < noOfDeck; i++) {
    cards = cards.concat(mixCards( front.slice(i*count, (i+1)*count), back.slice(i*count, (i+1)*count) ))
  }
  const cutCount = Math.floor(52 * noOfDeck / 12);
  return [...cards.splice(-cutCount), ...cards];
}

function mixCards(A, B) {
  const result = []
  for (let i = 0; i < A.length; i++) {
    result.push(A[i]);
    result.push(B[i]);
  }
  return [...result];
}
