var { UserModel } = require('./index');

class User {
	//* 保存
	static save(user) {
		user.createTime = new Date().getTime();
		return new UserModel(user).save();
	}
	
	//* 获取所有用户
	static getUserList(page = 1, count = 10) {
		return UserModel.find({ type: 1 }) 					//* 查找
			.sort('-createTime')			//* 根据创建时间倒序
			.skip((page - 1) * count) //* 分页
			.limit(count);						//* 查询数量s
	}

	static getCount() {
		return UserModel.count();
	}
	
	//* 删除
	static remove(_id) {
		return UserModel.remove({ _id, type: 1 });
	}

	//* 根据id取用户
	static findUser(_id) {
		return UserModel.findOne({ _id });
	}

	//* 获取用户信息
	static getUser(data) {
		return UserModel.findOne(data);
	}
}

module.exports = User;