const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ 
  path: path.join(process.cwd(), '.env')
});

module.exports={
  "development": {
    "username": process.env.MYSQL_DB_USER,
    "password": process.env.MYSQL_DB_PASSWORD,
    "database": "blog",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "",
    "database": "blog",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "",
    "database": "blog",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
