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
		this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
		this.suits = ['hearts', 'clubs', 'spades', 'diamonds'];
		this.cards = [];
	}

	addCard(card) {
		this.cards.push(card);
	}

	shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      this.swapCardsPosition(i, j);
      /* const x = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = x;*/
    }
  }

  setInitialState(intialNumbers = []) {
    // Generate random suits that doesn't repeat
    const initialCards = [];
    for (let i = 0; i < intialNumbers.length; i++) {
      let randomSuit = this.suits[Math.round(Math.random() * 10) % 4];
      let c = new Card(intialNumbers[i], randomSuit);
      while (initialCards.find(x => x.number === c.number && x.suit === c.suit)) {
        randomSuit = this.suits[Math.round(Math.random() * 10) % 4];
        c = new Card(intialNumbers[i], randomSuit);
      }
      initialCards.push(c);
      const ic = this.findCardPosition(c);
      this.swapCardsPosition(i, ic);
    }
  }
}
