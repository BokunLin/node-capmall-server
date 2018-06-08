const { shopCarModel } = require('./index');

class ShopCar {
	static save(data) {
		data.createTime = Date.now();
		return new shopCarModel(data).save();
	}

	static remove(_id) {
		return shopCarModel.remove({ _id });
	}
	

	static clear(user) {
		return shopCarModel.remove({ user });
	}
	
	static update({ _id, count}) {
		return shopCarModel.findByIdAndUpdate(_id, {
			count: count
		});
	}

	static getCar(user) {
		return shopCarModel.find({ user }).sort('-createTime');
	}

	//* 查找是否有重复的
	static findOne({ user, product }) {
		return shopCarModel.findOne({
			user,
			product
		});
	}
}

module.exports = ShopCar;