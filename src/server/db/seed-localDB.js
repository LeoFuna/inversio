const db = require("./localDB.js");

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (name TEXT, lastName TEXT, email TEXT UNIQUE, password TEXT)');
  db.run('INSERT INTO users (name, lastName, email, password) VALUES ("John", "Doe", "john@email.com", "123456")');
  db.run('INSERT INTO users (name, lastName, email, password) VALUES ("Marta", "Santos", "marta@email.com", "123")');

  db.run('CREATE TABLE IF NOT EXISTS trades (id TEXT UNIQUE, code TEXT, priceInCents INTEGER, quantity INTEGER, date TEXT, resultInCents INTEGER)');
  db.run('INSERT INTO trades (id, code, priceInCents, quantity, date, resultInCents) VALUES ("1", "PETR4", 300, 100, "2021-01-01", 310)');
});
console.log('Seed completed!');