const express = require('express');
const router = express.Router();
const async = require('async');

const Order = require('../../models/order');
const User = require('../../models/user');
const Address = require('../../models/address');
const {
	Provinces,
	Cities,
	Areas,
	Streets
} = require('../../models/PCAS');
const SnapShoot = require('../../models/snapShoot');

//* 获取订单
router.get('/', (req, res) =>{
	//* 订单格式化流程开始
	async.waterfall([
		//* 获取订单列表
		cb => {
			Order.getList(req.body).then(data => {
				cb(null, data);
			});
		},
		//* 提前格式化用户名
		(data, cb) => {
			async.map(data, (item, callback) => {
				User.findUser(item.user).then(user => {
					item.user = user.name;
					callback(null);
				});
			}, () => {
				cb(null, data);
			});
		},
		(data, cb) => {
			Order.getCount().then(count => {
				cb(null, { data, count });
			});
		}
	], (err, { data, count }) => {
		res.json({
			code: 2000,
			msg: '获取成功',
			count,
			data
		});
	});
});

router.post('/state', (req, res) => {
	Order.updateState({ id: req.body.id, state: req.body.state }).then(data => {
		if (data.n) {
			res.json({
				code: 5000,
				msg: '修改失败',
				data
			});
		} else {
			res.json({
				code: 2000,
				msg: '修改成功',
				data
			});
		}
	});
});

router.get('/address', (req, res) => {
	Address.findOne(req.query.id).then(address => {
		if (address) {
			async.parallel([
				cb => {
					Provinces.findOne(address.address[0]).then(data => {
						cb(null, data.label);
					});
				},
				cb => {
					Cities.findOne(address.address[1]).then(data => {
						cb(null, data.label);
					});
				},
				cb => {
					Areas.findOne(address.address[2]).then(data => {
						cb(null, data.label);
					});
				},
				cb => {
					Streets.findOne(address.address[3]).then(data => {
						cb(null, data.label);
					});
				}
			], (err, result) => {
				address.address = result.join('');
				res.json({
					code: 2000,
					msg: '获取成功',
					address
				});
			});
		} else {
			res.json({
				code: 2000,
				msg: '获取失败'
			});
		}
	});
});

router.post('/snapShoot', (req, res) => {
	let data = [];
	async.each(req.body.arr, (item, callback) => {
		SnapShoot.findOne(item).then(snap => {
			data.push(snap);
			callback();
		});
	}, () => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

router.post('/remove', (req, res) => {
	Order.remove(req.body.id).then(data => {
		if (data.result.n === 1) {
			res.json({
				code: 2000,
				msg: '删除成功',
				data
			});
		}
	});
});

module.exports = router;