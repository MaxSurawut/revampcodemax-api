const express = require('express');
const db = require('./db/customer');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*'
}))



db.createCustomersTable();


app.get('/allcustomer', (req, res) => {
  db.showAllCustomer(res)
})

app.post('/customers', db.upload.single('image'), (req, res) => {
  let image = '';
  const {name, email, phone} = req.body;

  if(req.file){
    image = req.file.filename
  }
  db.insertCustomer(name, email, phone, image, res);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
