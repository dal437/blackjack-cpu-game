function main () {
	class Card {
		constructor(number, suit) {
			this.number = number;
			this.suit = suit;
			this.flipped = false;
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

		findCardPosition(card) {
			return this.cards
				.findIndex(x => x.number === card.number && x.suit === card.suit);
		}

		swapCardsPosition(pos1, pos2) {
			const x = this.cards[pos1];
		    this.cards[pos1] = this.cards[pos2];
		    this.cards[pos2] = x;
		}

		clean() {
			this.cards = [];
		}

		generate() {
			this.clean();
			for (let isuit in this.suits) {
				for (let inumber in this.numbers) {
					const card = new Card(this.numbers[inumber], this.suits[isuit]);
					this.addCard(card);
				}
			}
		}

		print() {
			for (let icard in this.cards) {
				console.log(this.cards[icard].suit, this.cards[icard].number);
			}
		}

		getCard(index) {
			return this.cards[index];
		}
	}

	class Game {
		constructor() {
			this.deck = new Deck();
			// Index of the current card playing
			this.index = 0;
			// Array of cards
			this.playersHand = [];
			this.cpuHand = [];
			this.active = true;
		}

		init(initialNumbers = []) {
			this.active = true;
			this.playersHand = [];
			this.cpuHand = [];
			this.deck = new Deck();
			this.deck.generate();
			this.deck.shuffle();
			this.deck.setInitialState(initialNumbers);
			// Initialize first 4 cards
			this.putCardInCPU(true);
			this.putCardInPlayer();
			this.putCardInCPU();
			this.putCardInPlayer();
		}

		putCardInCPU(flipped = false) {
			const c = this.deck.getCard(this.index);
			c.flipped = flipped;
			this.cpuHand.push(c);
			this.index++;
			return c;
		}

		putCardInPlayer() {
			const c = this.deck.getCard(this.index);
			this.playersHand.push(c);
			this.index++;
			return c;
		}

		getSumHand(arr, b) {
			let total = 0;
			let ammountOfAses = 0;
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].number === 1) {
					total += 11;
					ammountOfAses++;
				}else if (arr[i].number > 10) {
					total += 10;
				}else total += arr[i].number;
			}

			// Here we handle if it's more than 21
			if (ammountOfAses && total > 21) {
				let times = Math.floor(total / 11) - 1;
				if (times > ammountOfAses) {
					times = ammountOfAses;
				}
				total = total - (times * 10);
			}
			return total;
		}

		getSumPlayerHand() {
			return this.getSumHand(this.playersHand);
		}

		getSumCpuHand() {
			return this.getSumHand(this.cpuHand, true);
		}

		finishGame() {
			this.active = false;
		}

		print() {
			console.log('[Computer]');
			for (let icpu in this.cpuHand) {
				console.log('\t', this.cpuHand[icpu].suit, this.cpuHand[icpu].number);
			}
			console.log('[Player]');
			for (let ipl in this.playersHand) {
				console.log('\t', this.playersHand[ipl].suit, this.playersHand[ipl].number);
			}
		}
	}
}

document.addEventListener('DOMContentLoaded', main);
