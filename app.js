import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://localhost:27017/shop');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
    res.header("Acess-Control-Allow-Origin","*");
    res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Request-With, Content-Type, Accept, Authorization"
    );
    if  (req.method ==='OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET' );

        return res.status(200).json({});
    }
    next();
});

app.use('/products',productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('not found');
    error.status(404);
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
