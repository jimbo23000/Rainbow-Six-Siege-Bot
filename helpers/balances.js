const { Collection } = require('discord.js');
const balances = new Collection();

const { Users } = require('../load-database');

(async () => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => balances.set(b.user_id, b));
})();

async function addBalance(id, amount) {
	const user = balances.get(id);
	if (user) {
		user.balance += Number(amount);
		console.log(`Added $${amount} to ${user.user_id}'s balance.`);
		return user.save();
	} else {
		const newUser = await Users.create({ user_id: id, balance: amount });
		balances.set(id, newUser);
		console.log(`Added $${amount} to ${newUser.user_id}'s balance.`);
		return newUser;
	}
}

function getBalance(id) {
    const user = balances.get(id);
	return user ? user.balance : 0;
}

module.exports = { addBalance, getBalance };