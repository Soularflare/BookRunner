const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require('./routes/order');


mongoose.connect(
	process.env.MONGO_URI,
	{useNewUrlParser: true}
	)
.then(() => console.log('Connected'))

mongoose.connection.on('error', err => {
	console.log('error: ${err.message}')
});

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);

if (process.env.NODE_ENV === 'production'){		//provides client-side assets in production
	app.use(express.static('ecommerce-client/build'));

	const path = require('path');
	app.get('*', (req,res) => {
		res.sendFile(path.resolve(__dirname, 'ecommerce-client', 'build', 'index.html'));
	});

}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});