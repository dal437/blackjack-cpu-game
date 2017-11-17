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
      .findIndex(x => card && x.number === card.number && x.suit === card.suit);
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
			let ammountOfAces = 0;
			for (let i = 0; i < arr.length; i++) {
				if (arr[i].number === 1) {
					total += 11;
					ammountOfAces++;
				}else if (arr[i].number > 10) {
					total += 10;
				}else total += arr[i].number;
			}

			// Here we handle if it's more than 21
			if (ammountOfAces && total > 21) {
				let times = Math.floor(total / 11) - 1;
				if (times > ammountOfAces) {
					times = ammountOfAces;
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

	class UI {
		constructor(game, doc) {
			this.game = game;
			// Pass it through parameter to make it more stand-alone
			this.document = doc;
		}

		setUpListeners(hit, stand, reset) {
			hit.addEventListener('click', e => {
				console.log('hitted');
				e.preventDefault();
				if (!this.game.active) {
					return console.log('[Game]', 'Not active');
				}
				const c = this.game.putCardInPlayer();
				this.renderCard(this.document.querySelector('#player_cards'), c);
				const sum = game.getSumPlayerHand();
				this.document.querySelector('#player_total').innerHTML = sum;
				if (sum > 21) {
					this.game.finishGame();
					this.makeCPUWinner();
				}
			});

			stand.addEventListener('click', e => {
				let cpuTotal = this.game.getSumCpuHand();
				e.preventDefault();
				if (!this.game.active) {
					return console.log('[Game]', 'Not active');
				}
				this.flipFirstCard();

				const sumInitial = this.game.getSumCpuHand();
				this.document.querySelector('#computer_total').innerHTML = sumInitial;

				while(cpuTotal < 21) {
					const c = this.game.putCardInCPU();
					this.renderCard(this.document.querySelector('#computer_cards'), c);

					const sum = this.game.getSumCpuHand();
					this.document.querySelector('#computer_total').innerHTML = sum;
					cpuTotal = sum;
				}

				if (cpuTotal === this.game.getSumPlayerHand()) {
					this.makeTie();
					this.game.finishGame();
				}else if (cpuTotal === 21) {
					this.makeCPUWinner();
					this.game.finishGame();
				}else if (cpuTotal > 21) {
					this.makePlayerWinner();
					this.game.finishGame();
				}
			});

			reset.addEventListener('click', e => {
				e.preventDefault();
				this.restartUI();
			});
		}

		renderInitial(rootDOM) {
			const mainWrap = this.document.createElement('section');
			mainWrap.className = 'main_wrap';

			const topWrap = this.document.createElement('article');
			topWrap.className = 'top';
			const firstSpanTop = this.document.createElement('span');
			const firstSpanTopText = this.document.createTextNode('Computer Hand - Total ');
			firstSpanTop.appendChild(firstSpanTopText);
			const secondSpanTop = this.document.createElement('span');
			const secondSpanTopText = this.document.createTextNode('?');
			secondSpanTop.appendChild(secondSpanTopText);
			secondSpanTop.id = 'computer_total';
			const pTop = this.document.createElement('p');
			pTop.appendChild(firstSpanTop);
			pTop.appendChild(secondSpanTop);
			const computerCards = this.document.createElement('div');
			computerCards.id = 'computer_cards';
			computerCards.className = 'cards_wrap';

			topWrap.appendChild(pTop);
			topWrap.appendChild(computerCards);


			const bottomWrap = this.document.createElement('article');
			bottomWrap.className = 'bottom';
			const firstSpanBottom = this.document.createElement('span');
			const firstSpanBottomText = this.document.createTextNode('Player Hand - Total ');
			firstSpanBottom.appendChild(firstSpanBottomText);
			const secondSpanBottom = this.document.createElement('span');
			const secondSpanBottomText = this.document.createTextNode('?');
			secondSpanBottom.appendChild(secondSpanBottomText);
			secondSpanBottom.id = 'player_total';
			const pBottom = this.document.createElement('p');
			pBottom.appendChild(firstSpanBottom);
			pBottom.appendChild(secondSpanBottom);
			const playerCards = this.document.createElement('div');
			playerCards.id = 'player_cards';
			playerCards.className = 'cards_wrap';

			bottomWrap.appendChild(pBottom);
			bottomWrap.appendChild(playerCards);

			const button = this.document.createElement('article');
			button.className = 'button';
			const hitButton = this.document.createElement('button');
			const hitButtonText = this.document.createTextNode('Hit');
			hitButton.id = 'hit';
			hitButton.appendChild(hitButtonText);
			const standButton = this.document.createElement('button');
			const standButtonText = this.document.createTextNode('Stand');
			standButton.id = 'stand';
			standButton.appendChild(standButtonText);
			const resetButton = this.document.createElement('button');
			const resetButtonText = this.document.createTextNode('Reset');
			resetButton.id = 'reset';
			resetButton.appendChild(resetButtonText);

			button.appendChild(hitButton);
			button.appendChild(standButton);
			button.appendChild(resetButton);

			mainWrap.appendChild(topWrap);
			mainWrap.appendChild(bottomWrap);
			mainWrap.appendChild(button);

			// delete previous one
			if (rootDOM.firstChild) {
				rootDOM.removeChild(rootDOM.firstChild);
			}
			rootDOM.appendChild(mainWrap);
		}

		restartUI() {
			/* const hit = document.querySelector('#hit');
			const stand = document.querySelector('#stand');
			const reset = document.querySelector('#reset');*/

			this.game.init();

			this.renderInitial(this.document.querySelector('.game'));

			// this.setUpListeners(hit, stand, reset);

			this.document.querySelector('.game').classList.add('hidden');
			this.document.querySelector('.start').classList.remove('hidden');
		}

		createCardNode(card) {
			const c = this.document.createElement('div');
			c.className = `card ${card.suit}`;
			if (card.flipped) {
				c.className += ' flipped';
			}
			// Random between -2 to 2
			const randomRotation = (parseInt(Math.round(Math.random()) * -1) || 1) * (Math.round((Math.random() * 10) % 3));
			c.style.transform = `rotate(${randomRotation}deg)`;
			c.appendChild(this.document.createTextNode(mapNumberToStr(card.number)));
			return c;
		}

		renderCards(domNode, cards = []) {
			for (let i = 0; i < cards.length; i++) {
				const c = this.createCardNode(cards[i]);
				domNode.appendChild(c);
			}
		}

		renderCard(domNode, card) {
			const c = this.createCardNode(card);
			domNode.appendChild(c);
		}

		makeCPUWinner() {
			console.log('[Result]', 'Player Lost (Bust) :(');
			this.flipFirstCard();
			const sum = this.game.getSumCpuHand();
			this.document.querySelector('#computer_total').innerHTML = sum;
		}

		makePlayerWinner() {
			console.log('[Result]', 'Player Won :D');
		}

		makeTie() {
			console.log('[Result]', 'TIE !!!!');
		}

		flipFirstCard() {
			this.document.querySelector('#computer_cards').firstChild.classList.remove('flipped');
		}
	}

	const game = new Game();
	const ui = new UI(game, document);
	// add some logic

	// UI variables
	// Start
	const start = document.querySelector('.start');
	const playBtn = document.querySelector('.playBtn');
	const startValues = document.querySelector('#startValues');
	// Game
	const gameWrap = document.querySelector('.game');

	// Initial UI Setup
	gameWrap.classList.add('hidden');
	ui.renderInitial(gameWrap);

	// After Render variables
	/* const computerTotal = document.querySelector('#computer_total');
	const playerTotal = document.querySelector('#player_total');*/

	/*const computerCards = document.querySelector('#computer_cards');
	const playerCards = document.querySelector('#player_cards');*/

	// Setup listeners
	playBtn.addEventListener('click', e => {
		e.preventDefault();
		if (!ui.game.active) {
			return console.log('[Game]', 'Not active');
		}
		const v = startValues.value ?
			startValues.value.split(',').map(x => mapStrToNumber(x)) : undefined;
		start.classList.add('hidden');
		gameWrap.classList.remove('hidden');
		ui.game.init(v);

		document.querySelector('#player_total').innerHTML = ui.game.getSumPlayerHand();
		ui.renderCards(document.querySelector('#computer_cards'), game.cpuHand);
		ui.renderCards(document.querySelector('#player_cards'), game.playersHand);
		ui.setUpListeners(document.querySelector('#hit'), document.querySelector('#stand'), document.querySelector('#reset'));
	});
	// ui.setUpListeners(document.querySelector('#hit'), document.querySelector('#stand'), document.querySelector('#reset'));

	function mapStrToNumber(str) {
		switch (str) {
			case 'J':
				return 11;
			case 'Q':
				return 12;
			case 'K':
				return 13;
			case 'A':
				return 1;
			default:
				return parseInt(str, 10);
		}
	}

	function mapNumberToStr(number) {
		switch (number) {
			case 11:
				return 'J';
			case 12:
				return 'Q';
			case 13:
				return 'K';
			case 1:
				return 'A';
			default:
				return number + '';
		}
	}
}

document.addEventListener('DOMContentLoaded', main);
