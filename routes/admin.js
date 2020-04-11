var express = require('express');
var router = express.Router();

var uuidv1 = require('uuid/v1');
var formidable = require('formidable');
var co = require('co');
var OSS = require('ali-oss');

var store = new OSS({
	//* 域
	region: '***',
	//* 密钥id
	accessKeyId: '***',
	//* 密钥
	accessKeySecret: '***',
	//* 包名
	bucket: 'kunine'
});


router.get('/', (req, res) => {
	res.render('admin');
});

router.get('*', (req, res, next) => {
	if (!req.session.name) {
		delete req.session.name;
		delete req.session.lastAccess;
		res.json({
			code: 5005,
			msg: '请先登录!'
		});
	} else if (Date.now() - req.session.lastAccess > 360000) {
		res.json({
			code: 5005,
			mes: '登录超时'
		});
	} else {
		next();
	}
});

router.post('/uploadImg', (req, res) => {
	var form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		let type = 'png';
		switch (files.file.type) {
		case 'image/png':
			type = 'png';
			break;
		case 'image/jpeg':
		case 'image/jpg':
			type = 'jpg';
			break;
		case 'image/gif':
			type = 'gif';
			break;
		}
		co(function* () {
			var result = yield store.put(`CapMall/${uuidv1()}.${type}`, files.file.path);
			res.json(result.url);
		}).catch(function (err) {
			res.json({
				code: 5000,
				msg: '图片上传失败',
				more: err
			});
		});
	});
});

module.exports = router;
