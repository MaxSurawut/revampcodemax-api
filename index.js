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
  console.log(req.file);
  const image = req.file.filename;
  db.insertCustomer(image, res);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
