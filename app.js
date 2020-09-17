const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const md5 = require('md5');

// config dotenv to my config file
dotenv.config({ path: './config.env' });

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

// USER SCHEMA DESIGN
const userSchema = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	password: {
		type: String,
		trim: true,
		required: true
	}
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
	res.status(200).render('homepage', { title: 'Hi' });
});

// REGISTER FUNCTIONALITY
app.post('/signup', async (req, res) => {
	try {
		const email = req.body.register_email;
		const password = req.body.register_password;
		const password_a = req.body.register_password_a;
		if (password !== password_a) throw new Error('Password and Confirm password is not matched');
		const newUser = await User.create({ email: email, password: md5(password) });
		console.log(newUser);
		res.status(200).render('secret', { title: 'Secret Page' });
	} catch (err) {
		res.status(404).render('error', { title: 'Error Occured', error: err.message });
	}
});

// LOGIN FUNCTIONALITY
app.post('/signin', async (req, res) => {
	try {
		const email = req.body.login_email;
		console.log(email);
		const password = md5(req.body.login_password);

		const user = await User.findOne({ email: email });
		if (!user) {
			throw new Error('User not found!');
		} else {
			if (user.password !== password) throw new Error('Email and Password not matched');
			res.status(200).render('secret', { title: 'Secret Page' });
		}
	} catch (err) {
		res.status(404).render('error', { title: 'Error Occured', error: err.message });
	}
});
mongoose.connect('mongodb://localhost:27017/userDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
app.listen(3000, (req, res) => {
	console.log('App is running on port 3000');
});
