const express = require('express');
const db = require('./db/customer');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}))
db.createCustomersTable();

app.post('/customers', db.upload.single('image'), (req, res) => {
    const { name, email, phone, image } = req.body;
   
  
    if (req.file) {
      imageFilePath = req.file.path;
    }
  
    db.insertCustomer(name, email, phone, image);
  
    res.send('Customer inserted successfully!');
  });

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
