<template>
	<view class="container">
		<view class="top">
			<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" v-for="(item,index) in list"
				:key="item.id">
				<view class="cartInfo" id="demo1">
					<!-- 购物车商品信息 -->
					<view class="cartInfochild">
						<!-- 选择框 -->
						<view class="cartInfo_switch common">
							<!-- 点击当前商品 -->
							<switch type="checkbox" :checked="item.checked" @click="singleCheck(index)" />
						</view>
						<!-- 图片 -->
						<view class="cartInfo_image common">
							<image :src="item.img|getImage" mode=""></image>
						</view>

						<!-- 信息 -->
						<view class="cartInfo_info">
							<label for="" style="font-size: 26rpx;">{{item.goodsname}}</label>
							<label for="" style="font-size: 24rpx; color: #ccc;">规格：黑色</label>
							<label for="" style="color: red;">￥{{item.price}}</label>
						</view>
						<!-- 加减数量 -->
						<view class="cartInfo_num">
							<view class="cartInfo_num_child">
								<label for="" @click="sub(index)">-</label>
								<label for="">{{item.num}}</label>
								<label for="" @click="add(index)">+</label>
							</view>
						</view>
					</view>
				</view>
				<view class="cartDel" id="demo2" @click="del(index)"><label for="">删除</label></view>
			</scroll-view>


		</view>

		<!-- 底部 -->
		<view class="foot">
			<view class="footd1">
				<switch type="checkbox" :checked="isAll" @change="handleAll" />
				<label>全选</label>
			</view>
			<view class="footd2">
				<view class="footd2sp1">
					总计：
					<label style="color: red;">￥{{allprice}}</label>
				</view>
				<label class="footd2sp2">不含运费，已优惠￥0.00</label>
			</view>
			<!-- 跳到提交订单，结算页面 -->
			<view class="footd3" @click="toOrder">
				<!-- 被选中的商品的个数 -->
				<label>去结算({{allitem}}件)</label>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []

			}
		},
		methods: {
			toOrder() {
				let arr = this.list.filter(item => {
					return item.checked == true
				})
				// console.log(arr)
				uni.setStorageSync("confirm", arr)
				uni.navigateTo({
					url: "/pages/confirm/confirm"
				})
			},
			async add(index) {
				this.list[index].num += 1;
				this.cartUpdate(index)
			},
			async sub(index) {
				this.list[index].num -= 1;
				if (this.list[index].num <= 1) {
					this.list[index].num = 1;
				}
				this.cartUpdate(index)
			},
			async cartUpdate(index) {
				let num = this.list[index].num;
				let id = this.list[index].id;
				let {
					token
				} = uni.getStorageSync("userInfo")

				let result = await this.$http("/api/cartedit", "GET", {
					num,
					id
				}, {
					'authorization': token,
					'content-type': 'application/x-www-form-urlencoded'
				})
			},
			singleCheck(index) {
				this.list[index].checked = !this.list[index].checked
			},
			handleAll() {
				this.isAll = !this.isAll
			},
			async del(index) {
				let id = this.list[index].id
				let {
					token
				} = uni.getStorageSync("userInfo")
				let result = await this.$http("/api/cartdelete", "GET", {
					id
				}, {
					'authorization': token,
					'content-type': 'application/x-www-form-urlencoded'
				}).catch(err => console.error(err))
				this.list.splice(index, 1)
			}
		},
		async onShow() {
			let {
				uid,
				token
			} = uni.getStorageSync("userInfo")
			let result = await this.$http("/api/cartlist", "GET", {
				uid
			}, {
				'authorization': token,
				'content-type': 'application/x-www-form-urlencoded'
			}).catch(err => {
				console.error(err)
			})
			let list = result.data.list
			if (list != null) {
				list.forEach(item => {
					item.checked = false
				})
				this.list = result.data.list
			}


		},
		computed: {
			allprice: {
				get: function() {
					let result = 0;
					this.list.forEach(item => {
						if (item.checked) {
							result += item.price * item.num
						}
					})

					return result
				}
			},
			allitem: {
				get: function() {
					let result = 0;

					this.list.forEach(item => {
						if (item.checked) {
							result += item.num
						}
					})

					return result
				}
			},
			isAll: {
				get: function() {
					let result = this.list.every(item => {
						return item.checked == true
					})
					return result;
				},
				set: function(newValue) {
					this.list.forEach(item => {
						item.checked = newValue
					})
				}
			}
		}
	};
</script>

<style>
	@import url('../../common/css/cart.css');

	.cartInfo_image_img {
		width: 120rpx;
		height: 120rpx;
	}
</style>
