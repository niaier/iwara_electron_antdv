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
			</a-form-model>
			<template slot="footer">
				<a-button @click="handleCancel">取消</a-button>
				<a-button type="primary" @click="handleLogin">登录</a-button>
			</template>
		</a-modal>
	</div>
</template>

<script>
//import x from ''
import db from '@/api/dexie/api.js'

export default {
	name: 'Login',
	components: {

	},
	data () {
		return {
			visible: false,
			form: {},
			title: '登录',
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
			rules: {
				password: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
				username: [{ required: true, message: '请输入密码', trigger: 'blur' },],
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
		handleLogin () {
			this.$refs['ruleForm'].validate(async valid => {
				if (valid) {
					const { username, password } = this.form
					const data = { username, password }
					const res = await db.login(data)
					console.log(res);
					if (res != [] && res.length > 0) {
						this.visible = false
						this.$ls.set('user_info', res[0])
						this.$message.success('登录成功')
						this.$emit('updateUser')

					} else {
						this.$message.error('登录失败')
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