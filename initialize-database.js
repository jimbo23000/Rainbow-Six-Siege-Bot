const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});
const CurrencyShop = require('./models/currency-shop.js')(sequelize, Sequelize.DataTypes);
require('./models/users.js')(sequelize, Sequelize.DataTypes);
require('./models/user-items.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');
sequelize.sync({ force }).then(async () => {
    const items = [];
    await new Promise((resolve, reject) => {
        const fs = require('fs');
        fs.createReadStream('./_data/items.csv')
            .pipe(require('csv-parse').parse({
                columns: true,
                skip_empty_lines: true
            }))
            .on('data', (row) => {
                items.push({ name: row.name, cost: Number(row.cost) })
            })
            .on('end', () => {
                console.log('Successfully parsed items.csv.');
                resolve();
            })
            .on('error', (error) => {
                console.error('Error parsing items.csv: ', error.message);
                reject(error);
            });
    });
    await Promise.all(items.map(item => CurrencyShop.upsert(item)));
    console.log('Database synced.');
    sequelize.close();
}).catch(console.error);