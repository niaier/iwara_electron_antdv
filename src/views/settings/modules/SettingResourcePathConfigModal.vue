<!-- 组件说明 -->
<template>
	<div class="">
		<a-modal :visible="visible" :title="title" @cancel="handleCancel">
			<a-form-model
				:model="form"
				:label-col="labelCol"
				:wrapper-col="wrapperCol"
			>
				<a-form-model-item label="资源路径">
					<a-input v-model="form.resourcePath" />
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
	name: 'SettingResourcePathConfigModal',
	components: {

	},
	data () {
		return {
			form: {},
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
			visible: false,
			title: '资源路径配置'
		};
	},
	computed: {

	},
	methods: {
		initForm () {
			const res = this.$ls.get('resource_path', {})
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
			this.$ls.set('resource_path', this.form)
			this.visible = false
		}
	},
}
</script>

<style lang='scss' scoped>
//@import url()
</style>