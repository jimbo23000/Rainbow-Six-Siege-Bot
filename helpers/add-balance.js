const { Users } = require('../load-database.js');

const currency = new Map();
async function addBalance(id, amount) {
	const user = currency.get(id);
	if (!user) {
		user = await Users.findOne({ where: { user_id: id } });
	}
	if (user) {
		user.balance += Number(amount);
		await user.save();
		currency.set(id, user);
		return user;
	}
	const newUser = await Users.create({ user_id: id, balance: Number(amount) });
	currency.set(id, newUser);
	return newUser;
}

module.exports = { addBalance };