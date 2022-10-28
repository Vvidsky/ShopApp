const mongoose = require('mongoose');
const Product = require('./models/product');

// Database configuration
mongoose.connect('mongodb://localhost:27017/ShopApp')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.log(error);
    });

const seedProducts = [
    {
        name: 'Cauliflower',
        price: 175,
        category: "vegetable",
    },
    {
        name: 'Coffee Bean',
        price: 15,
        category: "vegetable",
    },
    {
        name: 'Garlic',
        price: 60,
        category: "vegetable",
    },
    {
        name: 'Strawberry',
        price: 120,
        category: "fruit",
    },
    {
        name: 'Blueberry',
        price: 50,
        category: "fruit",
    },
    {
        name: 'Melon',
        price: 250,
        category: "fruit",
    },
    {
        name: 'Goat Cheese',
        price: 400,
        category: "dairy",
    },
    {
        name: 'Mayonnaise',
        price: 190,
        category: "dairy",
    },
]

Product.insertMany(seedProducts)
.then(res => {
    console.log(res)
})
.catch(err => {
    console.log(err)
})