const { Card } = require('./card.js');

class Deck {
    static ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    static suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];

    constructor() {        
        this.cards = this.createDeck();
    }

    createDeck() {
        const cards = [];
        Deck.ranks.forEach(rank => {
            Deck.suits.forEach(suit => {
                cards.push(new Card(rank, suit));
            });
        });
        return cards;
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
        return this.cards.length;
    }
}

module.exports = { Deck };