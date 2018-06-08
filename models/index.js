const mongoose =  require('mongoose');
//* 连接数据库 CapMall
mongoose.connect('mongodb://localhost:10027/CapMall', { useMongoClient: true });
//* 使用 bluebird 为 mongoose 添加 Promise
mongoose.Promise = require('bluebird');
//* 创建模型
const Schema = mongoose.Schema;

//* 用户表 在此时仅定义
const userSchema = new Schema({
	name: String,				//* 用户名
	pw: String,					//* 密码
	nick: String,				//* 昵称
	type: Number,				//* 用户类型， 0是管理员，1是顾客
	createTime: Number	//* 创建时间
});

//* 商品表
const productsSchema = new Schema({
	name: String, 			//* 商品名称
	imgs: Array,				//* 商品图片
	detail: String,			//* 商品简介
	tags: String,				//* 标签id
	price: Number,			//* 价格
	banner: String,			//* 轮播图
	showBanner: Boolean,//* 是否开启轮播图
	createTime: Number
});

//* 购物车表
const shopCarSchema = new Schema({
	user: String,				//* 用户id
	product: String,		//* 商品id
	count: Number,			//* 购买数量
	createTiem: Number
});

//* 标签表
const tagSchema = new Schema({
	name: String,				//* 标签名
	createTime: Number
});

//* 订单表
const orderSchema = new Schema({
	user: String,				//* 用户id
	address: String,		//* 收货地址id
	snapShoot: Array,		//* 快照 id 数组
	total: Number,			//* 订单总价
	state: Number,			//* 订单状态 -1为已删除订单 0为已发货， 1为已完成
	createTime: Number
});

//* 快照表
const snapShootSchema = new Schema({
	name: String,				//* 商品名
	img: String,				//* 商品图片
	count: String,			//* 商品数量
	price: Number,			//* 商品单价
	createTime: Number
});

//* 收货地址表
const addressSchema = new Schema({
	user: String, 			//* 用户id
	name: String, 			//* 收货人名字
	address: Array, 		//* 长度为4的数组，分别为省、市、区和街道的id
	detail: String,			//* 详细地址
	phone: Number,			//* 联系方式
	createTime: Number
});

//* 地域四级联动表

//* 省份表
const provincesSchema = new Schema({
	value: Number,
	label: String
});
//* 市表
const citiesSchema = new Schema({
	value: Number,
	label: String,
	parent_value: Number
});
//* 区表
const areasSchema = new Schema({
	value: Number,
	label: String,
	parent_value: Number
});
//* 街道表
const streetsSchema = new Schema({
	value: Number,
	label: String,
	parent_value: Number
});

exports.UserModel = mongoose.model('user', userSchema);	//* 关联 Users 集合
exports.ProductsModel = mongoose.model('products', productsSchema);
exports.TagsModel = mongoose.model('tag', tagSchema);
exports.OrderModel = mongoose.model('order', orderSchema);
exports.addressModel = mongoose.model('address', addressSchema);
exports.snapShootModel = mongoose.model('snapShoot', snapShootSchema);
exports.shopCarModel = mongoose.model('shopCar', shopCarSchema);
//* 四级联动
exports.provincesModel = mongoose.model('provinces', provincesSchema);
exports.citiesModel = mongoose.model('cities', citiesSchema);
exports.areasModel = mongoose.model('areasSchema', areasSchema);
exports.streetsModel = mongoose.model('streetsSchema', streetsSchema);