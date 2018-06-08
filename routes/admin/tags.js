var express = require('express');
var router = express.Router();
var Tag = require('../../models/tag');

router.get('/', (req, res) => {
	res.send('123');
});

router.get('/getList', (req, res) => {
	Tag.getTags().then(result => {
		res.json({
			code: 2000,
			msg: '请求成功',
			data: result
		});
	});
});

router.post('/add', (req, res) => {
	Tag.find(req.body.name).then(result => {
		if (result) {
			res.json({
				code: 5000,
				msg: '分类已经存在'
			});
		} else {
			Tag.save(req.body).then(() => {
				res.json({
					code: 2000,
					msg: '添加成功'
				});
			});
		}
	});
});

router.post('/edit', (req, res) => {
	Tag.edit(req.body).then(result => {
		let msg = '修改失败';
		if (result.n === 1) {
			msg = '修改成功';
		}
		res.json({
			code: 2000,
			msg
		});
	});
});

router.post('/remove', (req, res) => {
	Tag.remove(req.body.id).then(result => {
		res.json({
			code: 2000,
			msg: '删除成功'
		});
	});
});

module.exports = router;