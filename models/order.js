const { OrderModel } = require('./index');

class Order {

	static save(data) {
		data.state = 0;
		data.createTime = Date.now();
		return new OrderModel(data).save();
	}

	static findOne(_id) {
		return OrderModel.findOne({ _id });
	}
	
	static updateState(_id, state) {
		return OrderModel.findByIdAndUpdate({ _id }, {
			state
		});
	}

	static getCount() {
		return OrderModel.count();
	}

	static remove(_id) {
		return OrderModel.remove({ _id });
	}

	//* 获取所有订单
	static getList(page = 1, count = 9) {
		return OrderModel.find()
			.sort('createTime')
			.skip((page - 1) * count)
			.limit(count);
	}
	//* 获取没被用户删除的订单
	static getLife(user) {
		return OrderModel.find({ state: { $ne: -1 }, user }).sort('-createTime');
	}

}

module.exports = Order;