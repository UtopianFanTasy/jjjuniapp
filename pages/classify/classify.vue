<template>
	<view class="container">
		<!-- left左侧列表 -->
		<view class="left">
			<!-- 循环遍历的 -->
			<view class="left_list" v-for="(item,index) in list" :key="item.id" @click="tabclick(index)"
				:class="activeindex==index?'activeList':''">
				<label for="">{{item.catename}}</label>
			</view>
		</view>
		<!-- right右侧详细分类商品 -->
		<view class="right">
			<!-- 每一个小类 -->
			<view class="right_list">
				<!-- 商品 -->
				<view class="bottom" v-if="list.length>0">
					<view class="bottom_list" v-for="(item,index) in list[activeindex].children" :key="item.id" @click="todetail(item.id)">
						<!-- 每个最多显示6个 -->
						<view>
							<image :src="item.img|getImage" alt="">
						</view>
						<view class="title">
							<span>{{item.catename}}</span>
						</view>
					</view>
				</view>

			</view>
		</view>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				activeindex: 0

			}
		},
		async onLoad() {
			let result = await this.$http("/api/getcates")
			this.list = result.data.list



		},
		methods: {
			tabclick(index) {
				this.activeindex = index
			},
			todetail(id){
				uni.navigateTo({
					url:"../details/details?id="+id
				})
			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("../../common/css/classify.css");

	/* 点击左侧导航，显示动态样式 */
	.activeList {
		border-left: 6rpx solid #f26b11;
		color: #f26b11;
	}
</style>
