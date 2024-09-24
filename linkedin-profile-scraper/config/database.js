const { Sequelize } = require('sequelize');

// Create a connection to the database
const sequelize = new Sequelize('linkedin_profiles', 'root', 'mehek', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;