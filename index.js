const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const res = require('express/lib/response');
const path = require('path');
const app = express();
const methodOverride = require('method-override');

const Product = require('./models/product');
const Farm = require('./models/farm');
const { send } = require('process');

// Database configuration
mongoose.connect('mongodb://localhost:27017/ShopApp')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.log(error);
    });

const categories = ["fruit", "vegetable", "dairy", "fish"]

// Application configuration
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
dotenv.config();

// Farm Route
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms })
})

app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})

app.post('/farms', async (req, res) => {
    const newFarm = new Farm(req.body);
    await newFarm.save();
    console.log(newFarm);
    console.log("New farm saved");
    res.redirect('/farms');
})

app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate("products");
    res.render('farms/show', { farm });
})

app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const { name } = await Farm.findById(id)
    res.render('products/new', { categories, id, name });
})

app.post('/farms/:id/products/', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const product = new Product(req.body);
    farm.products.push(product);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.redirect('/farms/' + id)
})

app.delete('/farms/:id', async (req, res) => {
    const { id } = req.params;
    const deletedFarm = await Farm.findByIdAndDelete(id);
    console.log(deletedFarm)
    res.redirect('/farms');
})

// Product Routes
app.get('/', function (req, res) {
    res.send('Hello world!');
})

app.get('/products', async (req, res) => {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category });
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({});
        res.render('products/index', { products, category })
    }

})

app.get('/products/new', function (req, res) {
    res.render('products/new', { categories });
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    console.log("New product saved");
    res.redirect('/products');
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id })
    console.log(product);
    res.render('products/show', { product });
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id })
    console.log(product);
    res.render('products/edit', { product, categories });
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true })
    console.log(product);
    console.log("Updated product");
    res.redirect('/products/' + id);
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    console.log('Item id: ' + id + 'is deleted');
    res.redirect('/products');
})

app.listen(3000, function () {
    console.log('listening on port ' + 3000);
})