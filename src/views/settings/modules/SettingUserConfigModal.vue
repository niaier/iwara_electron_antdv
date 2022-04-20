<!-- 组件说明 -->
<template>
	<div class="">
		<a-modal
			:visible="visible"
			:title="title"
			@cancel="handleCancel"
			:footer="null"
		>
			<a-table
				:columns="columns"
				:data-source="dataSource"
				:pagination="false"
				rowKey="id"
			>
				<span slot="action" slot-scope="text, record">
					<a @click="deleteUser(record)">删除</a>
				</span>
			</a-table>
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
			title: '用户管理',
			visible: false,
			dataSource: [],
			columns: [{
				title: 'id',
				dataIndex: 'id',
				key: 'id',
			}, {
				title: '用户名',
				dataIndex: 'username',
				key: 'username',
			}, {
				title: '密码',
				dataIndex: 'password',
				key: 'password',
			}, {
				title: '操作',
				key: 'action',
				scopedSlots: { customRender: 'action' },
			},]
		};
	},
	computed: {

	},
	methods: {
		show () {
			this.visible = true;
			this.getUserList()
		},
		handleCancel () {
			this.visible = false;
		},
		async getUserList () {
			this.dataSource = await db.getUserList()
		},
		async deleteUser (record) {
			await db.deleteUser(record)
			this.getUserList()
		}
	},
}
</script>

<style lang='scss' scoped>
//@import url()
</style>