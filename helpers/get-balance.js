const { Users } = require('../load-database.js');

const currency = new Map();
async function getBalance(id) {
	const user = currency.get(id);
    if (!user) {
        user = await Users.findOne({ where: { user_id: id } });
    }
	return user ? user.balance : 0;
}

module.exports = { getBalance };