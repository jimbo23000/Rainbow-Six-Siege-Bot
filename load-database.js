const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const CurrencyShop = require('./models/currency-shop.js')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/user-items.js')(sequelize, Sequelize.DataTypes);
const Users = require('./models/users.js')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

Reflect.defineProperty(Users.prototype, 'addItem', {
	value: async function (item) {
		const userItem = await UserItems.findOne({ where: { user_id: this.user_id, item_id: item.id } });
		if (userItem) {
			userItem.amount += 1;
			return userItem.save();
		}
		return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
	},
});

Reflect.defineProperty(Users.prototype, 'getItems', {
	value: function () {
		return UserItems.findAll({
			where: { user_id: this.user_id },
			include: ['item'],
		});
	},
});

module.exports = { CurrencyShop, UserItems, Users };