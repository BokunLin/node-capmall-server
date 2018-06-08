const { provincesModel } = require('./index');
const { citiesModel } = require('./index');
const { areasModel } = require('./index');
const { streetsModel } = require('./index');

class Provinces {
	static save(data) {
		return new provincesModel(data).save();
	}

	static remove() {
		return provincesModel.remove();
	}

	static getList() {
		return provincesModel.find()
			.sort('value');
	}

	static findOne(value) {
		return provincesModel.findOne({ value });
	}

}

class Cities {
	static save(data) {
		return new citiesModel(data).save();
	}

	static getList() {
		return citiesModel.find()
			.sort('value');
	}

	static getCount() {
		return citiesModel.count();
	}

	static findByValue(val) {
		return citiesModel.find({ parent_value: val })
			.sort('value');
	}

	static findOne(value) {
		return citiesModel.findOne({ value });
	}

}

class Areas {
	static save(data) {
		return new areasModel(data).save();
	}

	static getList() {
		return areasModel.find()
			.sort('value');
	}

	static getCount() {
		return areasModel.count();
	}

	static findByValue(val) {
		return areasModel.find({ parent_value: val })
			.sort('value');
	}

	static findOne(value) {
		return areasModel.findOne({ value });
	}

}

class Streets {
	static save(data) {
		return new streetsModel(data).save();
	}

	static getList() {
		return streetsModel.find()
			.sort('value');
	}
	
	static getCount() {
		return streetsModel.count();
	}
	
	static remove() {
		return streetsModel.remove();
	}

	static findByValue(val) {
		return streetsModel.find({ parent_value: val })
			.sort('value');
	}

	static findOne(value) {
		return streetsModel.findOne({ value });
	}

}

module.exports = {
	Provinces,
	Cities,
	Areas,
	Streets
};