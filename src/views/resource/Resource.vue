<!-- 组件说明 -->
<template>
	<div class="resource">
		<!-- 搜索栏 START -->
		<a-row type="flex" justify="center">
			<a-col :span="14">
				<a-input-search
					placeholder="请输入搜索关键字"
					enter-button
					v-model="searchKeyword"
					@search="onSearch"
				/>
			</a-col>
		</a-row>
		<!-- 搜索栏 END -->

		<!-- 筛选器 START -->
		<a-row class="mt-20" :gutter="[16, 16]">
			<a-col :span="24">
				<a-radio-group v-model="sortBy" @change="sortChange">
					<a-radio-button value="love"> loved </a-radio-button>
					<a-radio-button value="views"> views </a-radio-button>
					<a-radio-button value="upload_time"> date </a-radio-button>
				</a-radio-group></a-col
			>
			<a-col :span="24">
				<a-radio-group v-model="mode" @change="checkedChange">
					<a-radio-button :value="1"> 校验通过 </a-radio-button>
					<a-radio-button :value="0"> 未通过 </a-radio-button>
				</a-radio-group></a-col
			>
		</a-row>
		<!-- 筛选器 END -->
		<!-- 分页器 START -->
		<a-row class="mt-20" type="flex" justify="center">
			<a-col>
				<a-pagination
					size="small"
					:current="pagination.current"
					:defaultCurrent="pagination.defaultCurrent"
					:pageSize="pagination.pageSize"
					:defaultPageSize="pagination.defaultPageSize"
					:pageSizeOptions="pagination.pageSizeOptions"
					:total="pagination.total"
					:showSizeChanger="pagination.showSizeChanger"
					:hideOnSinglePage="pagination.hideOnSinglePage"
					:showQuickJumper="pagination.showQuickJumper"
					@change="pageChange"
					@showSizeChange="showSizeChange"
				/>
			</a-col>
		</a-row>
		<!-- 分页器 END -->
		<!-- 视频列表 START -->
		<a-row class="mt-20" type="flex" justify="center">
			<a-col :span="24">
				<a-row :gutter="[16, 16]" type="flex" justify="center">
					<!-- 视频单元 START -->
					<a-col
						:sm="12"
						:md="8"
						:lg="6"
						v-for="(item, index) in datalist"
						:key="index"
					>
						<a-row class="mb-5" type="flex" justify="center"
							><a-col>
								<div
									class="position-absolute top-8 right-8"
									:style="{
										color: '#fff',
									}"
								>
									<a-icon type="heart" theme="filled" />
									<span class="ml-5">{{ item.love }}</span>
								</div>
								<div
									class="position-absolute top-8 left-8"
									:style="{
										color: '#fff',
									}"
								>
									<a-icon type="eye" theme="filled" />

									<span class="ml-5">{{ item.views }}</span>
								</div>

								<img
									:src="
										resourcePath +
										'\\' +
										item.dirname +
										'\\' +
										'thumb.jpg'
									"
									alt=""
									width="189"
									height="106"
									:style="{
										background: 'pink',
									}"
									@click="showPlaying(item)" /></a-col
						></a-row>
						<a-row type="flex" justify="center"
							><a-col>
								<div
									class="title"
									:style="{
										width: '189px',
									}"
								>
									<!-- 标题部分 -->
									{{ item.title }}
								</div>
							</a-col></a-row
						>
					</a-col>
					<!-- 视频单元 END -->
				</a-row>
			</a-col>
		</a-row>
		<!-- 视频列表 END -->
		<!-- 分页器 START -->
		<a-row class="mt-20" type="flex" justify="center">
			<a-col>
				<a-pagination
					size="small"
					:current="pagination.current"
					:defaultCurrent="pagination.defaultCurrent"
					:pageSize="pagination.pageSize"
					:defaultPageSize="pagination.defaultPageSize"
					:pageSizeOptions="pagination.pageSizeOptions"
					:total="pagination.total"
					:showSizeChanger="pagination.showSizeChanger"
					:hideOnSinglePage="pagination.hideOnSinglePage"
					:showQuickJumper="pagination.showQuickJumper"
					@change="pageChange"
					@showSizeChange="showSizeChange"
				/>
			</a-col>
		</a-row>
		<!-- 分页器 END -->
		<!-- 视频播放模态框 START -->
		<Playing ref="Playing"></Playing>
		<!-- 视频播放模态框 END -->
	</div>
</template>

<script>
//import x from ''
import db from '@/api/dexie/api.js'
import resourceMixin from '@/mixins/resource-list';
import Playing from '@/views/resource/components/Playing.vue'

export default {
	name: '',
	components: {
		Playing
	},
	mixins: [resourceMixin],
	data () {
		return {
			searchKeyword: "",
			mode: 1,
			resourcePath: this.$ls.get('resource_path').resourcePath,
			sortBy: ''
		};
	},
	computed: {

	},
	created () {
		this.getSinglePageData()
	},
	methods: {
		onSearch () {
			console.log(this.searchKeyword);
			this.getSinglePageData(this.searchKeyword)
		},

		showPlaying (item) {
			this.$refs['Playing'].show(item)
		},
		async getSinglePageData () {
			const sortBy = this.sortBy
			const page = this.pagination.current
			const pageSize = this.pagination.pageSize
			const direction = this.direction
			const mode = this.mode
			const searchKeyword = this.searchKeyword
			const data = {
				page, pageSize, direction, searchKeyword, mode, sortBy
			}
			const result = await db.getSinglePageData(data)
			this.datalist = result.list
			this.pagination.total = result.total
		},
		checkedChange () {
			this.getSinglePageData()
		},
		sortChange () {
			this.getSinglePageData()

		}
	},
}
</script>

<style lang='scss' scoped>
//@import url()
</style>