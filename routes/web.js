const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Prodcuts = require('../models/products');
const Order = require('../models/order');
const Address = require('../models/address');
const SnapShoot = require('../models/snapShoot');
const ShopCar = require('../models/shopCar');
const Tag = require('../models/tag');
const { Provinces, Cities, Areas, Streets } = require('../models/PCAS');
const async = require('async');
const sha1 = require('sha1');


router.get('/', (req, res) => {
	res.send('web');
});

//* 登录验证
function checkLogin(req, res, next) {
	req.session.lastAccess = Date.now();
	if (!req.session.name) {
		delete req.session.name;
		delete req.session.lastAccess;
		res.json({
			code: 5005,
			msg: '请先登录!'
		});
	} else if (Date.now() - req.session.lastAccess > 360000) {
		res.json({
			code: 5000,
			mes: '登录超时'
		});
	} else {
		next();
	}
}


//* 登录
router.post('/login', (req, res) => {
	User.getUser({ name: req.body.name, pw: sha1(req.body.pw), type: 1 }).then(data => {
		if (!data) {
			res.json({
				code: 5005,
				msg: '账号或密码错误',
				data
			});
		} else {
			req.session.name = data.name;
			req.session.userId = data._id;
			res.json({
				code: 2000,
				msg: '登录成功',
				data
			});
		}
	});
});

//* 登出
router.get('/login', (req, res) => {
	req.session.lastAccess = '';
	req.session.user = '';
	req.session.userId = '';
	res.json({
		code: 2000,
		msg: '登出成功'
	});
});

//* 注册
router.post('/signup', (req, res) => {
	User.getUser({ name: req.body.name, type: 1 }).then(data => {
		if (data) {
			res.json({
				code: 5000,
				msg: '账号已存在',
				data
			});
		} else {
			req.body.type = 1;
			req.body.pw = sha1(req.body.pw);
			User.save(req.body).then(data => {
				req.session.name = data.name;
				req.session.userId = data._id;
				res.json({
					code: 2000,
					msg: '注册成功',
					data
				});
			});
		}
	});
});

//* 根据 id 获取商品
router.get('/getProduct', (req, res) => {
	Prodcuts.findOne(req.query.id).then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

//* 根据类型名获取商品
router.get('/getListByName', (req, res) => {
	Tag.find(req.query.tags).then(tag => {
		req.query.tags = tag._id;
		Prodcuts.getListByName(req.query).then(data => {
			Prodcuts.getListCountByName(req.query).then(count => {
				res.json({
					code: 2000,
					msg: '获取成功',
					data,
					count
				});
			});
		});
	});
});

//* 获取最新发布的3个商品
router.get('/getNewProducts', (req, res) => {
	Prodcuts.getNewProducts().then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

//* 添加入购物车
router.post('/addToCar', checkLogin, (req, res) => {
	//* 查找库中是否有记录
	ShopCar.findOne({ user: req.session.userId, product: req.body.product }).then(record => {
		if (record) {
			ShopCar.update({ _id: record._id, count: req.body.count }).then(data => {
				res.json({
					code: 2000,
					msg: '更改数量成功',
					data
				});
			});
		} else {
			req.body.user = req.session.userId;
			ShopCar.save(req.body).then(data => {
				res.json({
					code: 2000,
					msg: '添加成功',
					data
				});
			});
		}
	});
});

//* 获取购物车
router.get('/getCar', checkLogin, (req, res) => {
	ShopCar.getCar(req.session.userId).then(data => {
		res.json({
			code: 2000, 
			msg: '获取成功',
			data
		});
	});
});

//* 删除购物车
router.get('/removeCar', checkLogin, (req, res) =>{
	ShopCar.remove(req.query.id).then(data => {
		res.json({
			code: 2000,
			msg: '删除成功',
			data
		});
	});
});

//* 生成订单
router.post('/order', checkLogin, (req, res) => {
	async.map(req.body.snapShoot, (item, cb) => {
		SnapShoot.save(item).then(snap => {
			cb(null, snap._id);
		});
	}, (err, snapShoot) => {
		Order.save({
			user: req.session.userId,
			address: req.body.address,
			snapShoot,
			total: req.body.total
		}).then(data => {
			ShopCar.clear(req.session.userId).then(car => {
				if(car.result.n) {
					res.json({
						code: 2000,
						msg: '订单生成成功!',
						data
					});
				} else {
					res.json({
						code: 5000,
						msg: '订单生成时出错',
						data
					});
				}
			});
		});
	});
});

//* 获取未删除订单
router.get('/order', checkLogin, (req, res) => {
	//* 获取当前用户订单
	Order.getLife(req.session.userId).then(data => {
		//* 遍历快照表
		async.map(data.snapShoot, (item, cb) =>{
			SnapShoot.findOne(item).then(snap => {
				cb(null, snap);
			});
		}, (err, snapResult) => {
			//* 获取当前订单收获地址
			Address.findOne(data.address).then(address => {
				data.address = address;
				data.snapShoot = snapResult;
				res.json({
					code: 2000,
					msg: '获取成功',
					data
				});
			});
		});
	});
});

//* 确认收货
router.post('/order/confirm', checkLogin, (req, res) => {
	Order.updateState(req.body.id, 1).then(data => {
		res.json({
			code: 2000,
			msg: '修改成功',
			data
		});
	});
});

//* 删除订单
router.post('/order/remove', checkLogin, (req, res) => {
	Order.remove(req.body.id).then(data => {
		res.json({
			code: 2000,
			msg: '删除成功',
			data
		});
	});
});

//* 添加收货地址
router.post('/address', checkLogin, (req, res) => {
	req.body.data.user = req.session.userId;
	Address.save(req.body.data).then(data => {
		res.json({
			code: 2000,
			msg: '添加成功',
			data
		});
	});
});

//* 获取收货地址
router.get('/address', checkLogin, (req, res) => {
	Address.findByUser(req.session.userId).then(data => {
		res.json({
			code:2000,
			msg: '获取成功',
			data
		});
	});
});

//* 根据id获取收货地址
router.get('/address/id', checkLogin, (req, res) => {
	Address.findOne(req.query.id).then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

//* 修改收货地址
router.post('/address/edit', checkLogin, (req, res) => {
	Address.edit(req.body.data).then(data => {
		if (data.n) {
			res.json({
				code: 2000,
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

//* 删除收货地址
router.post('/address/remove', checkLogin, (req, res) => {
	Address.remove(req.body.id).then(data => {
		if (data.n === 1) {
			res.json({
				code: 2000,
				msg: '删除成功',
				data
			});
		} else {
			res.json({
				code: 2000,
				msg: '删除失败',
				data
			});
		}
	});
});

router.get('/banner', (req, res) => {
	Prodcuts.getBanner().then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

router.get('/provinces', (req, res) => {
	Provinces.getList().then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

router.get('/cities', (req, res) => {
	Cities.findByValue(req.query.val).then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

router.get('/areas', (req, res) => {
	Areas.findByValue(req.query.val).then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

router.get('/streets', (req, res) => {
	Streets.findByValue(req.query.val).then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

router.get('/provinces/getLabel', (req, res) => {
	Provinces.findOne(req.query.val).then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

router.get('/cities/getLabel', (req, res) => {
	Cities.findOne(req.query.val).then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

router.get('/areas/getLabel', (req, res) => {
	Areas.findOne(req.query.val).then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

router.get('/streets/getLabel', (req, res) => {
	Streets.findOne(req.query.val).then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

router.get('/snapShoot', (req, res) => {
	SnapShoot.findOne(req.query.id).then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

module.exports = router;