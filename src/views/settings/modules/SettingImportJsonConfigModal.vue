<!-- 组件说明 -->
<template>
	<div class="">
		<a-modal
			:visible="visible"
			:title="title"
			@cancel="handleCancel"
			@ok="handleOk"
		>
			<a-form-model
				:model="form"
				:label-col="labelCol"
				:wrapper-col="wrapperCol"
			>
				<a-upload-dragger
					accept="*.json"
					name="file"
					:beforeUpload="beforeUpload"
				>
					<p class="ant-upload-drag-icon">
						<a-icon type="inbox" />
					</p>
					<p class="ant-upload-text">
						点击或拖拽Json格式数据到当前区域
					</p>
				</a-upload-dragger>
			</a-form-model>
			<template slot="footer">
				<a-button @click="handleCancel">关闭</a-button>
				<a-button @click="handleOk">确认</a-button>
			</template>
		</a-modal>
	</div>
</template>

<script>
//import x from ''
import db from '@/api/dexie/api.js'

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
			title: '资源路径配置',
			importData: {}
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
		async handleOk () {
			this.importData.iwara_user = [{
				id: 1,
				password: 123
			}]
			const result = await db.importJsonData(this.importData)
			console.log(result);
			if (result == undefined) {
				this.$message.success('导入Json数据成功')

			} else {
				this.$message.error('导入Json数据失败')
			}
			this.visible = false
		},
		beforeUpload (file, files) {
			const that = this
			var reader = new FileReader();
			reader.readAsText(files[0]);
			reader.onload = function () {
				const data = (reader.result)
				const dataJson = JSON.parse(data)
				console.log(dataJson);
				that.importData = dataJson
			};
			return false
		},

	},
}
</script>

<style lang='scss' scoped>
//@import url()
</style>