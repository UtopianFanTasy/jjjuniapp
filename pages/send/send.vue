<template>
	<view class="box">
		<view class="row">
			<text>手机号</text>
			<input type="text" v-model="phone" maxlength="12" />
		</view>
		<view class="row">
			<view class="send">
				<button class="captcha" size="mini" :disabled="!tagCode" @click="duanxin">验证码</button>
				<text>{{number}}</text>
			</view>
			<input type="text" v-model="code" placeholder="- - - -" maxlength="4" />
		</view>
		<view class="row">
			<text style="font-size: 23rpx;">收不到验证码？试试 <text style="color:#00BB00;font-size: 23rpx;"> 语音验证</text></text>
			<!--   -->
			<button type="primary" :disabled="!tagLogin" style="width: 90%;border-radius: 80rpx;margin-top: 50rpx;"
				@click="login">登录</button>
		</view>
		<view class="row">
			<text style="color: #006699;text-align: center;">通过微信授权登录</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: "",
				code: "",
				tagCode: false,
				tagLogin: false,
				number: ""
			}
		},
		watch: {
			phone: function(newValue) {
				let result = /^1[35789]\d{9}$/.test(newValue)
				this.tagCode = result
			},
			code: function(newValue) {
				if (newValue.length == 4) {
					this.tagLogin = true
				} else {
					this.tagLogin = false
				}
			}

		},
		methods: {
			async duanxin() {
				this.number = 5;
				this.tagCode = false;
				let timer = setInterval(() => {
					this.number -= 1;
					if (this.number <= 0) {
						clearInterval(timer);
						this.number = ""
						this.tagCode = true;
					}
				}, 1000)
				let result = await this.$http("/api/sms", "GET", this.phone).catch(err => console.error(err))
				uni.setStorageSync("code", result.data.list.code)
			},
			async login() {
				let localcode = uni.getStorageSync("code")
				console.log(localcode)
				if (this.code == localcode) {
					let result = await this.$http("/api/wxlogin", "GET", this.phone)
					uni.setStorageSync("userInfo", result.data.list)
					uni.reLaunch({
						url: "/pages/mine/mine"
					})
				} else {
					uni.showToast({
						title: "验证码错误",
						icon: "none"
					})
				}
			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	/* @import url("../../common/css/index.css"); */
	.box {
		position: relative;
	}

	.row {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 40rpx;
	}

	.send {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.send text:nth-of-type(2) {
		color: #00BB00;
	}

	text {
		font-size: 27rpx;
		margin-bottom: 10rpx;
	}

	input {
		border-bottom: 1rpx solid gray;
		height: 65rpx;
	}

	.captcha {
		background: #007cfe;
		color: white;
		padding: 10rpx 20rpx;
		border-radius: 13rpx;
		margin: 0rpx;
	}
</style>
