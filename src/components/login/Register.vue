<!-- 组件说明 -->
<template>
	<div class="">
		<a-modal :visible="visible" :title="title" @cancel="handleCancel">
			<a-form-model
				:model="form"
				ref="ruleForm"
				:label-col="labelCol"
				:wrapper-col="wrapperCol"
				:rules="rules"
			>
				<a-form-model-item label="用户名" prop="username">
					<a-input v-model="form.username" />
				</a-form-model-item>
				<a-form-model-item label="密码" prop="password">
					<a-input v-model="form.password" />
				</a-form-model-item>
				<a-form-model-item label="再次输入密码" prop="checkPass">
					<a-input v-model="form.checkPass" />
				</a-form-model-item>
			</a-form-model>
			<template slot="footer">
				<a-button @click="handleCancel">取消</a-button>
				<a-button type="primary" @click="handleRegister">注册</a-button>
			</template>
		</a-modal>
	</div>
</template>

<script>
//import x from ''
import db from '@/api/dexie/api.js'

export default {
	name: 'Register',
	components: {

	},
	data () {
		let validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else if (value !== this.form.password) {
				callback(new Error("两次密码必须保持一致"));
			} else {
				callback();
			}
		};
		return {
			visible: false,
			form: {},
			title: '注册',
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
			rules: {
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				checkPass: [{ required: true, message: '请确认密码', trigger: 'blur', validator: validatePass2 }],
				username: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
			},
		};
	},
	computed: {

	},
	methods: {
		show () {
			this.visible = true;
		},
		handleCancel () {
			this.visible = false
		},
		handleRegister () {
			const that = this
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					const { username, password } = this.form
					const data = { username, password }
					const res = await db.register(data)
					if (res) {
						that.visible = false
						this.$message.success('注册成功')
					} else {
						this.$message.error('注册失败')
					}
				}
			});

		}
	},
}
</script>

<style lang='scss' scoped>
//@import url()
</style>