<!-- 组件说明 -->
<template>
	<div class="h-100p" v-if="!!iwara_user_id">
		<a-layout class="h-100p">
			<a-layout-sider class="h-100p">
				<a-menu
					mode="inline"
					:default-selected-keys="['1']"
					:default-open-keys="['sub1']"
					:style="{ height: '100%', borderRight: 0 }"
				>
					<a-sub-menu key="sub1">
						<span slot="title"><a-icon type="user" />收藏列表</span>
						<a-menu-item
							v-for="(item, index) in collectionList"
							:key="index"
							@click="changeList(item.id)"
						>
							<a-row>
								<a-col :span="20"
									><span>{{ item.name }}</span></a-col
								>
								<a-col :span="4"
									><a-icon
										type="delete"
										class="ml-10px"
										@click="deleteList(item)"
								/></a-col>
							</a-row>
						</a-menu-item>
					</a-sub-menu>
				</a-menu>
			</a-layout-sider>
			<a-layout class="h-100p">
				<a-layout-content
					class="h-100p"
					:style="{
						'background-color': '#fff',
						'border-left': '1px solid #ccc',
					}"
				>
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
							<a-row
								:gutter="[16, 16]"
								type="flex"
								justify="center"
							>
								<!-- 视频单元 START -->
								<a-col
									:sm="12"
									:md="8"
									:lg="6"
									v-for="(item, index) in datalist"
									:key="index"
								>
									<a-row
										class="mb-5"
										type="flex"
										justify="center"
										><a-col>
											<div
												class="
													position-absolute
													top-8
													right-8
												"
												:style="{
													color: '#fff',
												}"
											>
												<a-icon
													type="heart"
													theme="filled"
												/>
												<span class="ml-5">{{
													item.love
												}}</span>
											</div>
											<div
												class="
													position-absolute
													top-8
													left-8
												"
												:style="{
													color: '#fff',
												}"
											>
												<a-icon
													type="eye"
													theme="filled"
												/>

												<span class="ml-5">{{
													item.views
												}}</span>
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
												@click="
													showPlaying(item)
												" /></a-col
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
				</a-layout-content>
			</a-layout>
		</a-layout>
		<!-- 视频播放模态框 START -->
		<Playing ref="Playing"></Playing>
		<!-- 视频播放模态框 END -->
	</div>
</template>

<script>
//import x from ''
import db from '@/api/dexie/api.js'
import resourceMixin from '@/mixins/resource-list';
import Playing from '@/components/drawer/Playing.vue'




export default {
	name: '',
	components: {
		Playing

	},
	mixins: [resourceMixin],

	data () {
		return {
			iwara_user_id: this.$ls.get('user_info') ? this.$ls.get('user_info').id : '',
			collectionList: [],
			resourcePath: this.$ls.get('resource_path').resourcePath,



		};
	},
	computed: {
	},
	created () {
		this.getCollectionList()
	},
	methods: {
		async getCollectionList () {
			const iwara_user_id = this.iwara_user_id
			const result = await db.getCollectionList(iwara_user_id)
			this.collectionList = result
			return result
		},
		async getSinglePageData (iwara_collection_list_id) {
			const page = this.pagination.current
			const pageSize = this.pagination.pageSize
			const iwara_user_id = this.iwara_user_id
			const data = { page, pageSize, iwara_user_id, iwara_collection_list_id }
			// console.log(data);
			const result = await db.getCollectionListSinglePage(data)
			console.log(result);
			this.datalist = result.list
			this.pagination.total = result.total
		},
		// async getSinglePageData () { },
		changeList (id) {
			console.log(id);
			this.getSinglePageData(id)
		},
		showPlaying (item) {
			this.$refs['Playing'].show(item)
		},
		async deleteList (item) {
			const id = item.id
			const iwara_user_id = this.iwara_user_id
			const data = { id, iwara_user_id }
			await db.deleteCollectionList(data)
			this.getCollectionList()
		}
	},
}
</script>

<style lang='scss' scoped>
//@import url()
.h-100p {
	height: 100% !important;
}
</style>