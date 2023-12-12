// Import the 'dotenv' package to load environment variables from a .env file
require('dotenv').config();

// Import Sequelize
const Sequelize = require('sequelize');

// Initialize a Sequelize instance (sequelize)
let sequelize;

// Check if a JAWSDB_URL environment variable is present (indicating production on Heroku)
if (process.env.JAWSDB_URL) {
    // If JAWSDB_URL is available, use it for database connection
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    // If not, use local MySQL credentials for database connection
    sequelize = new Sequelize(
        process.env.DB_NAME,     // Database name
        process.env.DB_USER,     // Database user
        process.env.DB_PASS,     // Database password
        {
            host: 'localhost',    // Database host (local)
            dialect: 'mysql',      // Database dialect (MySQL)
            port: 3306             // Database port
        }
    );
}

// Export the configured Sequelize instance for use in other parts of the application
module.exports = sequelize;
