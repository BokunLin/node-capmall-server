const express = require('express');
const router = express.Router();
const Products = require('../../models/products');

router.post('/publish', (req, res) => {
	Products.save(req.body).then(result => {
		if (!result.n) {
			res.json({
				code: 2000,
				msg: '发布成功!',
				data: result
			});
		} else {
			res.json({
				code: 5000,
				msg: '发布失败, 请重试!',
				data: result
			});
		}
	});
});

router.post('/edit', (req, res) => {
	Products.edit(req.body.data).then(data => {
		if (!data.n) {
			res.json({
				code: 2000,
				msg: '修改成功',
				data
			});
		} else {
			res.json({
				code: 5000,
				msg: '修改失败，请重试！',
				data
			});
		}
	});
});

router.get('/findOne', (req, res) => {
	Products.findOne(req.query.id).then(data => {
		res.json({
			code: 2000,
			msg: '获取商品数据成功',
			data
		});
	}).catch(err => {
		res.json({
			code: 5000,
			msg: '获取商品数据失败',
			err
		});
	});
});

router.post('/remove', (req, res) => {
	Products.remove(req.body.id).then(data => {
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

//* 获取轮播图
router.get('/banner', (req, res) => {
	Products.getBanner().then(data => {
		res.json({
			code: 2000,
			msg: '获取成功',
			data
		});
	});
});

//* 修改轮播图状态
router.post('/banner', (req, res) => {
	Products.updateBanner(req.body.id, req.body.state).then(data => {
		if (data) {
			res.json({
				code: 2000,
				msg: '修改成功',
				data
			});
		} else {
			res.json({
				code: 5000,
				msg: '修改失败',
				data
			});
		}
	});
});

router.get('/getList', (req, res) => {
	Products.getCount().then(count => {
		Products.getList(req.query.page).then(result => {
			res.json({
				code: 2000,
				msg: '获取商品列表成功',
				data: result,
				count
			});
		});
	});
});

module.exports = router;