<template>
	<view class="container">
		<!-- s收货地址 -->
		<view class="address">
			<view class="address_info">
				<label for="">收件人:{{receiver.username}}</label>
				<label for="">{{receiver.userphone}}</label>
			</view>
			<view class="address_res">
				收货地址：<label for="">{{receiver.address}}</label>
			</view>
		</view>

		<!-- 商品信息 -->
		<view class="carts">

			<view class="cartsInfo" v-for="(item,index) in list" :key="item.id">
				<!-- 70px -->
				<view class="carts_detail">
					<view class="carts_image">
						<image :src="item.img|getImage" mode=""></image>
					</view>
					<view class="carts_name">
						<view for="" style="font-size: 30rpx;">{{item.goodsname}}</view>
						<view for="" style="font-size: 26rpx; color: #C0C0C0;">规格:300</view>
					</view>
					<view class="carts_price">
						<label for="">￥ {{item.price}}</label>
					</view>
				</view>
				<!-- 50px -->
				<view class="cart_num">
					<view class="">
						购买数量：
					</view>
					<view class="">
						<label for="" class="jian" @click="sub(index)">-</label>
						<label for="" class="num">{{item.num}}</label>
						<label for="" class="jia" @click="add(index)">+</label>
					</view>
				</view>
				<!-- 横线 -->
				<view class="xian"></view>
			</view>



			<!-- 50px -->
			<view class="kuaidi">
				<label for="">配送方式</label>
				<label for="">XX快递</label>
			</view>
		</view>

		<!-- 优惠券 -->
		<view class="yhquan">
			<label for="">优惠券</label>
			<label for="" style="margin-right: 40rpx;">无可用</label>
		</view>
		<!-- jifen积分 -->
		<view class="jifen">
			<view class="use">
				<label for="">使用积分</label>
			</view>
			<view class="input" style="margin-right: 40rpx;">
				<input type="text" value="" placeholder="输入积分" />
				<label for="" class="input_use">使用</label>
				<label for="" class="input_keyi">可使用50积分</label>
			</view>
		</view>

		<!-- 具体详细 -->
		<view class="resDetail">
			<view class="">
				<label for="">商品金额</label>
				<label for="" style="margin-right:40rpx;color:red">￥{{allPrice}}</label>
			</view>
			<view class="">
				<label for="">运费</label>
				<label for="" style="margin-right:40rpx;color:red">+￥0.00</label>
			</view>
			<view class="">
				<label for="">优惠券</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">会员优惠</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">积分抵扣</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
		</view>
		<!-- 实付金额 -->
		<view class="sfje">
			实付金额：<label for="" style="color:red">￥{{ allPrice }}</label>
		</view>

		<!-- 确认订单按钮 -->
		<view class="btn">
			<!-- 点击提交订单按钮，发起支付请求 -->
			<button type="primary" @click="pay">提交订单</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				receiver: {
					username: "李狗蛋",
					userphone: "17733944177",
					address: "顶顶顶顶"
				}
			}
		},
		onLoad() {
			let arr = uni.getStorageSync("confirm")
			this.list = arr
		},
		computed: {
			allPrice() {
				let result = this.list.reduce((start, item) => {
					return start + item.num * item.price
				}, 0)
				return result
			},
			totalnum() {
				let result = this.list.reduce((start, item) => {
					return start + item.num
				}, 0)
				return result
			}
		},
		methods: {
			add(index) {
				this.list[index].num += 1
			},
			sub(index) {
				this.list[index].num -= 1
				if (this.list[index].num < 1) {
					this.list[index].num = 1
				}
			},
			async pay() {
				let {
					uid,
					token
				} = uni.getStorageSync("userInfo")
				let {
					username,
					userphone,
					address
				} = this.receiver
				let countmoney = this.allPrice
				let countnumber = this.totalnum
				let addtime = new Date().getTime()
				let params = {
					uid,
					username,
					userphone,
					address,
					countmoney,
					countnumber,
					addtime
				}
				params = JSON.stringify(params)
				let arr = this.list.map(item => {
					return item.id
				})
				let idstr = arr.join(",")
				let result = await this.$http("/api/orderadd", "GET", {
					params,
					idstr
				}, {
					'authorization': token,
					'content-type': 'application/x-www-form-urlencoded'
				})
				if (result.data.code = 200) {
					uni.showToast({
						title: "付款成功",
						icon: null,
						duration: 1500
					})
					setTimeout(() => {
						uni.reLaunch({
							url: "/pages/mine/mine",
						})
					}, 1500)
				}
			}
		}
	}
</script>
<style>
	@import url("../../common/css/confirm.css");
</style>
