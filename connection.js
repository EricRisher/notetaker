// Import the 'dotenv' package to load environment variables from a .env file
require("dotenv").config();

// Import mysql2
const mysql = require("mysql2");

// Create a MySQL connection using environment variables
let connection;

// Check if a JAWSDB_URL environment variable is present (indicating production on Heroku)
if (process.env.JAWSDB_URL) {
  // If JAWSDB_URL is available, use it for database connection
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  // If not, use local MySQL credentials for database connection
  connection = mysql.createConnection({
    host: "localhost", // Database host (local)
    user: process.env.DB_USER, // Database user
    password: process.env.DB_PASS, // Database password
    database: process.env.DB_NAME, // Database name
    port: 3306, // Database port
  });
}

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");
});

// Export the MySQL connection for use in other parts of the application
module.exports = connection;
