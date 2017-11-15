document.addEventListener('DOMContentLoaded', main);

function main(){
  const x = document.querySelector('.playBtn');
  x.addEventListener('click', function(handlePlayClick) {
    const hideButton = document.querySelector('.start');
    hideButton.hidden = "true";
    evt.preventDefault();
  });
}

class Card {
  constructor(number, suit) {
    this.number = number;
    this.suit = suit;
  }
}

class Deck {
  constructor() {
    this.numbers = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
    this.suits = ["hearts", "clubs", "spades", "diamonds"];
    this.deck = [];
  }
  cleanDeck() {
    this.deck = [];
  }
  generateDeck() {
    this.cleanDeck();
    for (let suitIndex in suits) {
      for (let numberIndex in numbers) {
        const card = new Card(this.numbers);
        this.addCard(card);
      }
    }
  }
  addCard(card) {
    this.deck.push(cards);
  }
  shuffleDeck() {
    for (let i = this.card.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const x = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = x;
    }
  }
  });
}
