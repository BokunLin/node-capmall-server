const { snapShootModel } = require('./index');

class SnapShoot  {
	static save(data) {
		data.createTime = Date.now();
		return new snapShootModel(data).save();
	}

	static findOne(id) {
		return snapShootModel.findById(id);
	}

}

module.exports = SnapShoot;