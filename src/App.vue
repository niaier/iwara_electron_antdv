<template>
	<a-layout id="components-layout-demo-custom-trigger" style="height: 100%">
		<a-layout-sider v-model="collapsed" :trigger="null" collapsible>
			<div class="logo" />
			<a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
				<a-menu-item
					v-for="(item, index) in menulist"
					:key="index"
					@click="jumpPage(item.path)"
				>
					<a-icon :type="item.icon" />
					<span>{{ item.name }}</span>
				</a-menu-item>
			</a-menu>
		</a-layout-sider>
		<a-layout>
			<a-layout-header style="background: #fff; padding: 0">
				<a-row type="flex" justify="space-between">
					<a-col :span="6">
						<a-icon
							class="trigger"
							:type="collapsed ? 'menu-unfold' : 'menu-fold'"
							@click="() => (collapsed = !collapsed)"
					/></a-col>
					<a-col :span="6">
						<div class="float-right">
							<a-button
								v-if="!user_info"
								type="primary"
								class="mr-20"
								@click="showLogin"
								>登录</a-button
							>
							<a-button
								v-if="!user_info"
								type="primary"
								class="mr-20"
								@click="showRegister"
								>注册</a-button
							>
							<span v-if="!!user_info" class="mr-20">{{
								user_info.username
							}}</span>
							<a-button
								v-if="!!user_info"
								type="primary"
								class="mr-20"
								@click="logout"
								>退出</a-button
							>
						</div>
					</a-col>
				</a-row>
			</a-layout-header>
			<a-layout-content
				:style="{
					margin: '24px 16px',
					padding: '24px',
					background: '#fff',
					minHeight: 'auto!important',
				}"
			>
				<router-view></router-view>
			</a-layout-content>
		</a-layout>
		<Login ref="Login" @updateUser="updateUser"></Login>
		<Register ref="Register" @updateUser="updateUser"></Register>
	</a-layout>
</template>
<script>

import Login from '@/components/login/Login.vue';
import Register from '@/components/login/Register.vue';
export default {
	components: { Login, Register },
	data () {
		return {
			collapsed: false,
			menulist: [
				{ name: '首页', path: '/Home', icon: 'user' },
				{ name: '资源', path: '/Resource', icon: 'video-camera' },
				{ name: '喜爱', path: '/Love', icon: 'heart' },
				{ name: '收藏', path: '/Collection', icon: 'star' },
				{ name: '设置', path: '/Settings', icon: 'setting' },
				{ name: '测试', path: '/Test', icon: 'upload' },
			],
			user_info: this.$ls.get('user_info'),
		};
	},
	methods: {
		jumpPage (path) {
			console.log(path);
			this.$router.push(path);
		},
		showLogin () {
			this.$refs['Login'].show()
		},

		showRegister () {
			this.$refs['Register'].show()

		},
		logout () {
			this.$ls.remove('user_info')
			this.user_info = this.$ls.get('user_info')
		},
		updateUser () {
			this.user_info = this.$ls.get('user_info')
			console.log(this.user_info);
		}
	}
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
	font-size: 18px;
	line-height: 64px;
	padding: 0 24px;
	cursor: pointer;
	transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
	color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
	height: 32px;
	background: rgba(255, 255, 255, 0.2);
	margin: 16px;
}
</style>