const { Collection } = require('discord.js');
const balances = new Collection();

const { Users } = require('../load-database');

(async () => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(balance => balances.set(balance.user_id, balance));
})();

async function addBalance(id, amount) {
	const user = balances.get(id);
	if (user) {
		user.balance += Number(amount);
		console.log('Updated balance.');
		return user.save();
	}
	const newUser = await Users.create({ user_id: id, balance: amount });
	balances.set(id, newUser);
	console.log('Added balance.');
	return newUser;
}

async function getBalance(id) {
    const user = balances.get(id);
	return user ? user.balance : 0;
}

module.exports = { addBalance, getBalance };