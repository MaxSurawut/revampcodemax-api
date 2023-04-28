const mysql = require('mysql');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'customerInfo'
});

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

const insertCustomer = (name, email, phone, image) => {
    console.log(image); // add this line to check if imageFilePath is being passed correctly
    const query = `
      INSERT INTO customers (name, email, phone, image) 
      VALUES (?, ?, ?, ?)
    `;
    
    if (fs.existsSync(image)) {
        const imageFile = fs.readFileSync(image);
        const imageBuffer = Buffer.from(imageFile);
        
        connection.query(query, [name, email, phone, imageBuffer], (err, results) => {
          if (err) {
            console.error('Error inserting customer: ', err);
            return;
          }
        
          console.log('Customer inserted successfully!');
        });
      } else {
        console.error('Error inserting customer: Image file does not exist');
      }
  };

module.exports = {
  createCustomersTable,
  insertCustomer,
  upload
};