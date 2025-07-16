const { Collection } = require('discord.js');
const accounts = new Collection();

const { Users } = require('../load-database');

(async () => {
	const storedAccounts = await Users.findAll();
	storedAccounts.forEach(a => accounts.set(a.user_id, a));
})();

async function addBalance(id, amount) {
	const user = accounts.get(id);
	if (user) {
		user.balance += Number(amount);
		console.log(`Added $${amount} to ${user.user_id}'s account.`);
		return user.save();
	} else {
		const newUser = await Users.create({ user_id: id, balance: amount });
		accounts.set(id, newUser);
		if (amount > 0) {
			console.log(`Added $${amount} to ${newUser.user_id}'s account.`);
		} else {
			console.log(`Subtracted $${amount} from ${newUser.user_id}'s account.`);
		}
		return newUser;
	}
}

function getBalance(id) {
    const user = accounts.get(id);
	return user ? user.balance : 0;
}

module.exports = { addBalance, getBalance };