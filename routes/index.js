var express = require('express');
var router = express.Router();
// var async = require('async');

const admin = require('./admin');
const user = require('./admin/user');
const tags = require('./admin/tags');
const order = require('./admin/order');
const products = require('./admin/products');

const web = require('./web');

// const data = require('../public/javascripts/streets');
// const { Provinces, Cities, Areas, Streets} = require('../models/PCAS');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
});

// router.get('/uploadPCAS', function(req, res) {
// 	let index = 0;
// Streets.remove().then(res => {
// 	async.forEachOf(data, (value, key, callback) => {
// 		Streets.save(value).then(res => {
// 			index++;
// 			console.log(index);
// 			callback();
// 		});
// 	}, err => {
// 		if (err) console.error(err.message);
// 	});
// });
// Streets.getList().then(res => {
// 	console.log(res[0])
// })
// Streets.getCount().then(res => {
// 	console.log(res);
// 	console.log('length', data.length);
// });
// });

module.exports = app => {
	app.use('/', router);
	app.use('/web', web);
	app.use('/admin', admin);
	app.use('/admin/user', user);
	app.use('/admin/tags', tags);
	app.use('/admin/order', order);
	app.use('/admin/products', products);
};