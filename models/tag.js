var { TagsModel } = require('./index');

class Tag {
	static save(tag) {
		tag.createTime = Date.now();
		return new TagsModel(tag).save();
	}

	static getTags() {
		return TagsModel.find();
	}

	static find(name) {
		return TagsModel.findOne({ name });
	}

	static edit(data) {
		return TagsModel.update({ _id: data._id}, { name: data.name });
	}

	static remove(id) {
		return TagsModel.remove({ _id: id });
	}
}

module.exports = Tag;