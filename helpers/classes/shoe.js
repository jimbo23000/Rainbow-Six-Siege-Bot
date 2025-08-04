const { Deck } = require('./deck.js');

class Shoe {
    constructor(numOfDecks = 6) {
        this.cards = [];
        this.createShoe(numOfDecks);
    }
    
    createShoe(numOfDecks) {
        for (let i = 0; i < numOfDecks; ++i) {
            const deck = new Deck();
            deck.shuffle();
            deck.cards.forEach(card => {
                this.cards.push(card);
            });
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        return this.cards.pop();
    }

    size() {
        return this.cards.size;
    }
}

module.exports = { Shoe }