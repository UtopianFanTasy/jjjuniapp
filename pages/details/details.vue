<template>
	<view class="container">
		<!-- 详情图片 -->
		<view class="detailImage">
			<image :src="info.img|getImage">
		</view>
		<!-- 详情基本信息 -->
		<view class="detailInfo">
			<view class="detailInfoName">
				<label>{{info.goodsname}}</label>
			</view>
			<view class="detailInfoPrice">
				<label style="color: red;">￥{{info.price}}</label>
				<label style="font-size: 24rpx;color: #ccc;">(此价格不与套装优惠同时享受)</label>
			</view>
		</view>

		<!-- 基本信息改变 -->
		<view class="changeInfo">
			<view class="youhui">
				<view>促销：<label class="manjian">满减</label><label class="dazhe">满2件9折；3件8折</label></view>
			</view>
			<!-- 数量加减 -->
			<view class="changeNum">
				<view class="num">购买数量</view>
				<view class="action">
					<label class="jian"@click="sub">-</label>
					<label class="zhi">{{count}}</label>
					<label class="jia" @click="add">+</label>
				</view>
			</view>
			<!-- 商品属性 -->
			<view class="changeState">
				<view class="productStat">
					<label for="">商品属性</label>
				</view>
				<view class="productGuige">
					<label>{{info.specsattr}}</label>
					<view class="threed3i1">{{info.specsname}}</view>

				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		<view class="productDetail">
			<view class="productDetailTitle">商品详情</view>
			<!-- 需要处理图片自适应问题 -->
			<rich-text :nodes="info.description" mode="aspectFill"></rich-text>
		</view>

		<view class="productEval">
			<view class="eval">商品评价</view>
			<view>
				<label class="evalUsername">小李白</label>
				<label class="evalUsertitle">效果很好，物流到位，下次继续来</label>
				<view class="evalImage">
					<image src="../../static/detail/pingjia1.jpg" />
					<image src="../../static/detail/pingjia2.jpg" />
					<image src="../../static/detail/pingjia3.jpg" />

				</view>
				<label class="evalTime">2020-01-13</label>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="foot">
			<button class="footbtn1" @click="cart">加入购物车</button>
			<button class="footbtn2">立即购买</button>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				info: {},
				count: 1
			}
		},
		methods: {
			async cart() {
				let {
					uid,
					token
				} = uni.getStorageSync("userInfo")
				let goodsid = this.$mp.query.id
				let num = this.count;
				let result = await this.$http("/api/cartadd", "GET", {
					uid,
					goodsid,
					num
				}, {
				'authorization': token,
				'content-type': 'application/x-www-form-urlencoded'
			})
				wx.showToast({
					title:"成功添加"
				})
			},
			add() {
				this.count += 1
			},
			sub() {
				this.count -= 1
				if (this.count <= 1) {
					this.count = 1;
				}
			}
		},
		async mounted() {
			var id = this.$mp.query;
			let result = await this.$http("/api/getgoodsinfo", "GET", id)
			this.info = result.data.list[0]
		}
	}
</script>
<style>
	@import url("../../common/css/details.css");
</style>
