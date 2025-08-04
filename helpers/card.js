class Card {
    constructor(_rank, _suit) {
        this.rank = _rank;
        this.suit = _suit;
    }

    toString() {
        return `${this.rank} of ${this.suit}`;
    }
}

module.exports = { Card };