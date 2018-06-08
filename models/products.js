const { ProductsModel } = require('./index');

class Products {
	static save(data) {
		data.createTime = Date.now();
		data.showBanner = false;
		return new ProductsModel(data).save();
	}
	
	static edit(data) {
		return ProductsModel.findByIdAndUpdate({ _id: data._id }, {
			name: data.name,
			detail: data.detail,
			tags: data.tags,
			imgs: data.imgs,
			price: data.price,
			banner: data.banner,
			showBanner: data.showBanner
		});
	}
	//* 获取总数
	static getCount() {
		return ProductsModel.count();
	}

	static findOne(id) {
		return ProductsModel.findById(id);
	}

	static remove(id) {
		return ProductsModel.remove({ _id: id });
	}
	//* 根据分类名获取商品
	static getListByName({ tags, page = 1, count = 16 }) {
		return ProductsModel.find({ tags })
			.sort('-createTime')
			.skip((page -1) * count)
			.limit(count);
	}
	//* 根据分类名获取商品数量
	static getListCountByName({ tags }) {
		return ProductsModel.find({ tags }).count();
	}
	//* 获取某页的10个商品
	static getList(page, count = 9) {
		return ProductsModel.find()
			.sort('-createTime')
			.skip((page - 1) * count)
			.limit(count);
	}
	//* 获取最新年发布的3个商品
	static getNewProducts() {
		return ProductsModel.find()
			.sort('-createdTime')
			.limit(3);
	}
	static getBanner() {
		return ProductsModel.find({ showBanner: true });
	}
	//* 更改轮播图状态
	static updateBanner(id, showBanner) {
		return ProductsModel.findByIdAndUpdate(id, {
			showBanner
		});
	}

}

module.exports = Products;