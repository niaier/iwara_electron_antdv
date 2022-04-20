<!-- 组件说明 -->
<template>
	<div class="">
		<a-modal
			:visible="visible"
			width="350px"
			centered
			:bodyStyle="{
				'text-align': 'center',
				padding: '10px 36px',
				'min-height': '300px',
			}"
			@cancel="handleCancel"
		>
			<a-row slot="title">
				<a-col
					:style="{
						'text-align': 'center',
					}"
				>
					<span> 添加到收藏列表 </span>
				</a-col>
			</a-row>

			<a-row :gutter="[10, 10]">
				<a-col
					v-for="(item, index) in collectionList"
					:span="24"
					:key="item.id"
					:style="{}"
				>
					<a-row
						:style="{
							'text-align': 'left',
						}"
					>
						<a-col :span="20">
							<a-checkbox
								:checked="!!item.checked"
								@change="checkedChange($event, index)"
								>{{ item.name }}</a-checkbox
							>
						</a-col>
						<a-col :span="4"> 100 </a-col>
					</a-row>
				</a-col>
			</a-row>
			<template slot="footer">
				<a-input-search
					v-model="collectionListName"
					placeholder="新建收藏列表"
					@search="addCollectionList"
				>
					<a-button slot="enterButton"> 新建 </a-button>
				</a-input-search>
			</template>
		</a-modal>
	</div>
</template>

<script>
//import x from ''
import db from '@/api/dexie/api.js'
export default {
	name: '',
	components: {
	},
	data () {
		return {
			visible: false,
			collectionListName: '',
			iwara_info_id: 0,
			iwara_collection_list_id: 0,
			iwara_user_id: this.$ls.get('user_info') ? this.$ls.get('user_info').id : '',
			collectionList: []
		};
	},
	computed: {

	},
	methods: {
		show (iwara_info_id, iwara_user_id) {
			this.visible = true;
			this.iwara_info_id = iwara_info_id
			this.iwara_user_id = iwara_user_id
			this.handleCurCollectionList()
		},
		handleCancel () {
			this.visible = false;
		},
		async addCollectionList () {
			const name = this.collectionListName;
			const iwara_user_id = this.iwara_user_id
			const data = { name, iwara_user_id }
			await db.addCollectionList(data)
			await this.handleCurCollectionList()
			this.$message.success('新增收藏列表成功')
		},
		async getCollectionList () {
			const result = await db.getCollectionList(this.iwara_user_id)
			return result
		},
		async addCollection (id) {
			const iwara_info_id = this.iwara_info_id
			const iwara_collection_list_id = id
			const iwara_user_id = this.iwara_user_id
			const data = { iwara_info_id, iwara_collection_list_id, iwara_user_id }
			await db.addCollection(data)
		},
		async deleteCollection (id) {
			const iwara_info_id = this.iwara_info_id
			const iwara_collection_list_id = id
			const iwara_user_id = this.iwara_user_id
			const data = { iwara_info_id, iwara_collection_list_id, iwara_user_id }
			await db.deleteCollection(data)
		},
		async checkedChange (e, index) {
			const checked = e.target.checked
			this.collectionList[index].checked = checked
			if (checked) {
				await this.addCollection(this.collectionList[index].id)
			} else {
				await this.deleteCollection(this.collectionList[index].id)
			}
			await this.handleCurCollectionList()
		},
		async getCurCollectionStatus () {
			const iwara_info_id = this.iwara_info_id
			const iwara_user_id = this.iwara_user_id
			const data = { iwara_info_id, iwara_user_id }
			const result = await db.getCurCollectionStatus(data)
			console.log(result);
			return result
		},
		async handleCurCollectionList () {
			const collectionList = await this.getCollectionList()
			const curCollectionStatus = await this.getCurCollectionStatus()
			collectionList.map(item => {
				curCollectionStatus.forEach(item2 => {
					if (item2.iwara_collection_list_id == item.id) {
						item.checked = true
					}
				})
			})
			this.collectionList = collectionList

		}
	},
}
</script>

<style lang='scss' scoped>
//@import url()
.hover_blue:hover {
	background-color: #acc9ff;
	cursor: pointer;
}
</style>