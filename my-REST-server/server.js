const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

function generateProducts() {
  const skills = ['JavaScript', 'CSS'];

  return skills.map((skill, i) => {
    return {
      "id": i + 1,
      "title": `Mastering ${skill}`,
      "description": `${skill} lorem  ipsum dkhd daklhd dakhdk dakhdk da`,
      "price": (i + 1) * 10
    }
  })
}

// This is my data (one day it will come from database)
let items = generateProducts();

// *** REST API ***

// LIST
app.get('/item', (req, res) => {
  res.json(items)
})

// READ
app.get('/item/:id', (req, res) => {
  const id = +req.params.id;
  const item = items.find(currItem => +currItem.id === id);
  res.json(item)
})

// DELETE
app.delete('/item/:id', (req, res) => {
  const id = +req.params.id;
  items = items.filter(currItem => +currItem.id !== id);
  res.end(`Product ${id} was deleted`)
})

// CREATE
app.post('/item', (req, res) => {
  const item = req.body;
  item.id = findNextId();
  console.log('item,', item);
  items.push(item);
  res.json('Item was added!');
})

// UPDATE
app.put(`/item`, (req, res) => {
  const newItem = req.body;
  console.log('newItem', newItem);
  items = items.map((item) => {
    if (+item.id === +newItem.id) item = newItem;
    return item
  });
  res.json(`Product ${newItem.id} was modified`)
})

app.listen(3003, () => {
  console.log('REST API listening on port 3003!');
  let time = new Date(Date.now()).toLocaleTimeString();
  console.log(`Start Time: ${time}`)
})

function findNextId() {
  var maxId = 0;
  items.forEach(item => {
    if (item.id > maxId) maxId = item.id
  });
  return maxId + 1
}
