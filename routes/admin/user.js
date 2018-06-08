var express = require('express');
var router = express.Router();

var User = require('../../models/user.js');
var sha1 = require('sha1');

router.post('/checkLogin', (req, res) => {
	if (req.body.user === req.session.name) {
		res.json({
			code: 2000,
			msg: '登录有效'
		});
	} else {
		res.json({
			code: 5005,
			msg: '登录失效'
		});
	}
});

//* 登录
router.post('/login', (req, res) => {
	User.getUser({ name: req.body.name, pw: sha1(req.body.pw) }).then(data => {
		if (!data) {
			res.json({
				msg: '账号或密码错误',
				code: 4004
			});
		} else {
			req.session.name = data.name;
			res.json({
				msg: '登录成功',
				code: 2000,
				data
			});
		}
	});
});

//* 注册
router.post('/signup', (req, res) => {
	User.getUser({ name: req.body.name }).then(data => {
		if (!data) {
			req.body.type = 0;
			req.body.pw = sha1(req.body.pw);
			User.save(req.body).then(userInfo => {
				req.session.name = userInfo.name;
				res.json({
					msg: '注册成功',
					code: 2000,
					data: userInfo
				});
			});
		} else {
			res.json({
				msg: '该用户已存在',
				code: 4004
			});
		}
	});
});

//* 登出
router.get('/loginOut', (req, res) => {
	req.session.name = '';
	res.json({
		code: 2000,
		msg: '登出成功'
	});
});



//* 获取用户列表
router.get('/', (req, res) => {
	User.getUserList(req.query.page).then(data => {
		User.getCount().then(count => {
			res.json({
				code: 2000,
				msg: '获取成功',
				count,
				data
			});
		});
	});
});

//* 删除用户
router.post('/', (req, res) => {
	User.remove(req.body.id).then(data => {
		if (data.result.n === 1) {
			res.json({
				code: 2000,
				msg: '删除成功',
				data
			});
		} else {
			res.json({
				code: 5000,
				msg: '删除失败',
				data
			});
		}
	});
});

//* 查找用户
router.get('/find', (req, res) => {
	User.findUser(req.query.id).then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

module.exports = router;