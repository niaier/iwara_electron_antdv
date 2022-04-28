<!-- 组件说明 -->
<template>
	<div class="">
		<a-drawer
			:title="info.title"
			:visible="visible"
			@close="handleClose"
			width="100%"
			:bodyStyle="bodyStyle"
			:keyboard="keyboardFlag"
		>
			<a-row class="h-100p" type="flex" justify="center">
				<a-col :span="20" class="h-100p">
					<a-row class="h-100p">
						<!-- 左侧 START -->
						<a-col :span="16" class="h-100p">
							<div
								:style="{
									width: '95%',
									height: '100%',
									background: '',
								}"
							>
								<VueKeepRatio
									:style="{
										width: '100%',
									}"
									:ratio="16 / 9"
								>
									<video
										ref="video"
										id="video"
										:src="videoSrc"
										:style="{
											width: '100%',
											height: '100%',
										}"
										:class="{
											'page-full-screen':
												isPageFullscreen,
										}"
										controls
									></video>
								</VueKeepRatio>
								<!-- 功能按键区域 START -->
								<div
									class="mt-10"
									:style="{
										height: '50px',
										background: '#fff',
										'border-bottom': '1px solid #ddd',
									}"
								>
									<a-row
										:style="{
											'font-size': '30px',
										}"
									>
										<a-col
											:span="6"
											v-if="!user_id"
										></a-col>
										<!-- 喜爱 -->
										<a-col :span="3" v-if="user_id">
											<a-icon
												type="heart"
												:style="{
													cursor: 'pointer',
												}"
												@click="showAddToLoveModal"
											/>
										</a-col>
										<!-- 收藏 -->
										<a-col :span="3" v-if="user_id">
											<a-icon
												type="star"
												:style="{
													cursor: 'pointer',
												}"
												@click="
													showAddToCollectionListModal
												"
											/>
										</a-col>
										<a-col :span="18">
											<div class="">
												<a-button
													type="primary"
													class="float-right mt-10"
													:style="{}"
													@click="
														handlePageFullScreen
													"
												>
													网页全屏
												</a-button>
											</div>
										</a-col>
									</a-row>
								</div>
								<!-- 功能按键区域 END -->
								<!-- 简介说明区域 START -->
								<div class="mt-15">
									<a-row :gutter="[10, 10]">
										<a-col :span="24">
											<a-icon
												type="info-circle"
												theme="filled"
												:style="{ color: '#3b7efc' }"
											/>
											<span class="ml-10">简介说明</span>
											<span class="ml-10">{{
												uploadTime
											}}</span>
										</a-col>
										<a-col :span="24">
											{{ info.description }}
										</a-col>
									</a-row>
								</div>
								<!-- 简介说明区域 END -->
								<!-- 标签区域 START -->
								<div class="mt-15">
									<a-row :gutter="[10, 10]">
										<a-col :span="24">
											<a-tag
												v-for="(item, index) in tagList"
												:class="{
													'ml-10': index != 0,
													'tag-item': true,
												}"
												:key="index"
											>
												{{ item }}
											</a-tag>
										</a-col>
									</a-row>
								</div>
								<!-- 标签区域 START -->
							</div>
						</a-col>
						<!-- 左侧 START -->
						<!-- 右侧 START -->
						<a-col :span="8">
							<!-- 作者头像部分 START -->
							<a-row type="flex">
								<a-col flex="60px">
									<a-avatar
										:size="48"
										icon="user"
										:style="{
											cursor: 'pointer',
										}"
										@click="jumpToProducerPage"
									/>
								</a-col>
								<a-col flex="auto">
									<h3
										:style="{
											cursor: 'pointer',
										}"
										@click="jumpToProducerPage"
									>
										{{ info.producer }}
									</h3>
								</a-col>
							</a-row>

							<!-- 作者头像部分 END -->
							<!-- 作者作品部分 START -->
							<a-row class="mt-20">
								<a-col>
									<h4>作品列表</h4>
								</a-col>
								<a-col
									v-for="item in curVideoProducerProductionList"
									:key="item.id"
									:style="{
										cursor: 'pointer',
									}"
									@click="changePlaying(item)"
								>
									<a-row type="flex" :gutter="[10, 20]">
										<a-col flex="161px">
											<img
												src=""
												alt=""
												width="141"
												height="80"
											/>
										</a-col>
										<a-col flex="200px">
											{{ item.title }}
										</a-col>
									</a-row>
									<div></div>
								</a-col>
							</a-row>
							<!-- 作者作品部分 END -->
						</a-col>

						<!-- 右侧 END -->
					</a-row>
				</a-col>
			</a-row>
		</a-drawer>

		<AddToLoveModal
			ref="AddToLoveModal"
			@updateLove="updateLove"
		></AddToLoveModal>
		<AddToCollectionListModal
			ref="AddToCollectionListModal"
		></AddToCollectionListModal>
	</div>
</template>

<script>
//import x from ''
import db from '@/api/dexie/api.js'
import moment from 'moment'
import AddToLoveModal from '@/components/modal/PlayingAddToLoveModal.vue'
import AddToCollectionListModal from '@/components/modal/PlayingAddToCollectionListModal.vue'
// import _ from 'lodash'

export default {
	name: 'Playing',
	components: {
		AddToLoveModal,
		AddToCollectionListModal
	},
	data () {
		return {
			visible: false,
			videoFlag: true,
			info: {},
			bodyStyle: {
				height: '100%',
			},
			love_level: 0,
			iwara_love_id: 0,
			user_id: this.$ls.get('user_info') ? this.$ls.get('user_info').id : '',
			isPageFullscreen: false,
			curVideoProducerProductionList: [],

		};
	},
	computed: {
		keyboardFlag () {
			const keyboardFlag = this.isPageFullscreen ? false : true
			return keyboardFlag
		},
		tagList () {
			if (this.info.categories) {
				return this.info.categories.split(',')
			} else {
				return []
			}
		},
		videoSrc () {
			const videoSrc = this.$ls.get('resource_path').resourcePath + '\\' + this.info.dirname + '\\' + this.info.title + '.mp4'
			return videoSrc
		},
		uploadTime () {
			return moment(this.info.upload_time).format('YYYY-MM-DD HH:mm')
		}
	},
	created () {
		this.exitPageFullScreen()
	},
	methods: {
		show (info) {
			this.info = info
			this.visible = true;
			this.getLoveStatus()
			this.getCurVideoProducerProductionList()

		},
		handleClose () {
			this.visible = false;
		},
		showAddToLoveModal () {
			this.$refs['AddToLoveModal'].show(this.info, this.love_level, this.user_id, this.iwara_love_id)
		},
		showAddToCollectionListModal () {
			this.$refs['AddToCollectionListModal'].show(this.info.id, this.user_id)
		},

		async getLoveStatus () {
			const user_id = this.user_id
			const iwara_info_id = this.info.id
			const data = { user_id, iwara_info_id }
			const result = await db.getLoveStatus(data)
			if (result.length > 0) {
				this.iwara_love_id = result[0].id
				this.love_level = result[0].love_level
			}

		},
		async updateLove () {
			await this.getLoveStatus()
			this.$refs['AddToLoveModal'].love_level = this.love_level
		},
		handlePageFullScreen () {
			this.isPageFullscreen = true
			this.$message.info('按Esc键退出网页全屏')
		},
		exitPageFullScreen () {
			const that = this
			document.onkeyup = function (e) {
				if (that.isPageFullscreen == true && e.code === 'Escape') {
					that.isPageFullscreen = false
				}
			}
		},
		async getCurVideoProducerProductionList () {
			const data = this.info
			const result = await db.getCurVideoProducerProductionList(data)
			this.curVideoProducerProductionList = result
			console.log(result);
		},
		changePlaying (item) {
			this.info = item
		},
		jumpToProducerPage () {
			const url = '/producer'
			const params = {
				producer: this.info.producer
			}
			this.$router.push({ path: url, query: params })
		}

	},
	watch: {
		visible (value) {
			if (!value) {
				document.querySelector('#video').pause()
			}
		}
	}
}
</script>

<style lang='scss' scoped>
//@import url()
.h-100p {
	height: 100%;
}

.page-full-screen {
	z-index: 999;
	position: fixed !important;
	width: 100% !important;
	height: 100% !important;
	top: 0;
	left: 0;
}

.tag-item {
	border-radius: 10px;
}
</style>