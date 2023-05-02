const mysql = require('mysql');
const multer = require('multer');
const path = require('path')
const fs = require('fs');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'customerInfo'
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage
})

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }

  console.log('Connected to database successfully!');
});

const createCustomersTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      image VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  connection.query('SHOW TABLES LIKE "customers"', (err, results) => {
    if (err) {
      console.error('Error checking if customers table exists: ', err);
      return;
    }

    if (results.length === 0) {
      connection.query(query, (err, results) => {
        if (err) {
          console.error('Error creating customers table: ', err);
          return;
        }

        console.log('Customers table created successfully!');
      });
    } else {
      console.log('Customers table already exists!');
    }
  });
};

const insertCustomer = (name, email, phone, image, res) => {
  const sql = 'INSERT INTO customers (name, email, phone, image) VALUES (?, ?, ?, ?)';

  connection.query(sql, [name, email, phone, image], (err, result) => {
    if (err) {
      console.error('Error inserting customer: ', err);
      return res.status(500).send('Error inserting customer');
    }
    res.json({Status: "Success"});
  });
};

const showAllCustomer = (res) => {
  const query = 'SELECT * FROM customers'

  connection.query(query, (err, result) => {
    if(err) throw err
    res.send(result)
  })
}

  // const query = `
  //     INSERT INTO customers (name, email, phone) 
  //     VALUES (?, ?, ?)
  //   `;

  // connection.query(query, [name, email, phone], (err, results) => {
  //   if (err) {
  //     console.error('Error inserting customer: ', err);
  //     return;
  //   }

  //   console.log('Customer inserted successfully!');
  // });



module.exports = {
  createCustomersTable,
  insertCustomer,
  upload,
  showAllCustomer
};