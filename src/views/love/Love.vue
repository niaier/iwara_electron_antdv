<!-- 组件说明 -->
<template>
	<div class="love-page" v-if="!!iwara_user_id">
		<!-- 按钮部分 START -->
		<a-row type="flex" justify="center">
			<a-col :span="16">
				<a-row :gutter="[10, 10]" type="flex" justify="center">
					<a-col
						:span="8"
						v-for="count of 9"
						:key="count"
						:style="{
							'text-align': 'center',
						}"
						><a-button
							shape="round"
							class="love-level-button"
							@click="getSinglePageData(count)"
							>LOVER LEVEL{{ count }}</a-button
						>
					</a-col>
				</a-row>
			</a-col>
		</a-row>
		<!-- 按钮部分 END -->

		<!-- 播放列表部分 START -->
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
				<a-row :gutter="[16, 16]">
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
								<img
									src=""
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
									标题部分
									<!-- {{ item.title }} -->
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
		<!-- 播放列表部分 END -->
		<!-- 视频播放模态框 START -->
		<Playing ref="Playing"></Playing>
		<!-- 视频播放模态框 END -->
	</div>
</template>

<script>
//import x from ''
import db from '@/api/dexie/api.js'
import Playing from '@/views/resource/components/Playing.vue'
import resourceMixin from '@/mixins/resource-list';

export default {
	name: '',
	components: {
		Playing
	},
	mixins: [resourceMixin],

	data () {
		return {
			iwara_user_id: this.$ls.get('user_info') ? this.$ls.get('user_info').id : '',
			selectedLoveLevel: null
		};
	},
	computed: {

	},
	created () {
		this.getSinglePageData()
	},
	methods: {
		async getSinglePageData (love_level) {
			const page = this.pagination.current
			const pageSize = this.pagination.pageSize
			const user_id = this.iwara_user_id
			const data = {
				page, pageSize, user_id, love_level
			}
			const result = await db.getLoveSinglePageData(data)
			console.log(data);
			console.log(result);
			this.datalist = result.list
			this.pagination.total = result.total
		},
		showPlaying (item) {
			this.$refs['Playing'].show(item)
		},
	},
}
</script>

<style lang='scss' scoped>
//@import url()

::v-deep.ant-btn:hover,
::v-deep.ant-btn:focus {
	color: #fda6b5;
	background-color: #fff;
	border-color: #fda6b5;
	font-weight: 600;
}
</style>