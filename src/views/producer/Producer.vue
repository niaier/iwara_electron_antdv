<!-- 组件说明 -->
<template>
	<div class="">
		<a-row>
			<a-col :span="6">
				<a-row type="flex">
					<a-col flex="60px">
						<a-avatar
							:size="48"
							icon="user"
							:style="{
								cursor: 'pointer',
							}"
						/>
					</a-col>
					<a-col flex="auto">
						<h3
							:style="{
								cursor: 'pointer',
							}"
						>
							{{ producer }}
						</h3>
					</a-col>
				</a-row>
			</a-col>
			<a-col :span="18">
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
			</a-col>
		</a-row>
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
			producer: this.$route.query.producer,
		};
	},
	computed: {

	},
	methods: {
		showPlaying (item) {
			this.$refs['Playing'].show(item)
		},
		async getSinglePageData () {
			// const orderBy = this.orderBy
			const page = this.pagination.current
			const pageSize = this.pagination.pageSize
			const producer = this.producer
			const result = await db.getProducerProductionList(page, pageSize, producer)
			this.datalist = result.list
			console.log(result.total);
			this.pagination.total = result.total
		},
	},
}
</script>

<style lang='scss' scoped>
//@import url()
</style>