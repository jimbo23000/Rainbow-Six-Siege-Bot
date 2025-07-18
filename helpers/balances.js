const { Users } = require('../load-database');

const { Collection } = require('discord.js');
const accounts = new Collection();

(async () => {
	const storedAccounts = await Users.findAll();
	storedAccounts.forEach(a => accounts.set(a.user_id, a));
})();

async function addBalance(id, amount) {
	let user = accounts.get(id);
	if (user) {
		user.balance += Number(amount);
		return user.save();
	} else {
		user = await Users.create({ user_id: id, balance: amount });
		accounts.set(id, user);
		return user;
	}
}

function getBalance(id) {
    const user = accounts.get(id);
	return user ? user.balance : 0;
}

module.exports = { addBalance, getBalance };