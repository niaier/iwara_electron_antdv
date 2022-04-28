<!-- 组件说明 -->
<template>
	<div class="">
		<a-modal :visible="visible" :title="title" @cancel="handleCancel">
			<a-form-model
				:model="form"
				:label-col="labelCol"
				:wrapper-col="wrapperCol"
			>
				<a-form-model-item label="主机">
					<a-input v-model="form.host" />
				</a-form-model-item>
				<a-form-model-item label="用户">
					<a-input v-model="form.user" />
				</a-form-model-item>
				<a-form-model-item label="密码">
					<a-input v-model="form.password" />
				</a-form-model-item>
				<a-form-model-item label="数据库">
					<a-input v-model="form.database" />
				</a-form-model-item>
			</a-form-model>
			<template slot="footer">
				<a-button @click="handleCancel">取消</a-button>
				<a-button @click="handleOk">确认</a-button>
			</template>
		</a-modal>
	</div>
</template>

<script>
//import x from ''
export default {
	name: 'SettingDatabaseConfigModal',
	components: {

	},
	data () {
		return {
			form: {},
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
			visible: false,
			title: '数据库配置'
		};
	},
	computed: {

	},
	methods: {
		initForm () {
			const res = this.$ls.get('database_config', {})
			this.form = res
		},
		show () {
			this.visible = true
			this.initForm()

		},
		handleCancel () {
			this.visible = false
		},
		handleOk () {
			this.$ls.set('database_config', this.form)
			this.visible = false

		}
	},
}
</script>

<style lang='scss' scoped>
//@import url()
</style>