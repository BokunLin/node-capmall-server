const { addressModel } = require('./index');

class Address {
	static save(data) {
		data.createTime = Date.now();
		return new addressModel(data).save();
	}

	static findOne(id) {
		return addressModel.findById(id);
	}

	static edit(data) {
		return addressModel.findByIdAndUpdate(data._id, {
			name: data.name,
			phone: data.phone,
			detail: data.detail,
			address: data.address
		});
	}

	static remove(_id) {
		return addressModel.remove({ _id });
	}

	static findByUser(id) {
		return addressModel.find({ user: id });
	}

}

module.exports = Address;