const { Users } = require('../load-database');

const { Collection } = require('discord.js');
const accounts = new Collection();

(async () => {
	const storedAccounts = await Users.findAll();
	storedAccounts.forEach(a => accounts.set(a.user_id, a));
})();

async function addBalance(id, amount) {
	const user = accounts.get(id);
	if (user) {
		user.balance += Number(amount);
		return user.save();
	} else {
		const newUser = await Users.create({ user_id: id, balance: amount });
		accounts.set(id, newUser);
		return newUser;
	}
}

function getBalance(id) {
    const user = accounts.get(id);
	return user ? user.balance : 0;
}

module.exports = { addBalance, getBalance };