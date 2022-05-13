<!-- 组件说明 -->
<template>
	<div class="">
		<a-form-model :layout="'horizontal'">
			<a-form-model-item label="数据处理">
				<a-card>
					<a-row :gutter="[20, 20]">
						<a-col :span="24"
							><a-button type="primary" @click="syncData"
								>同步数据</a-button
							>
							<span class="ml-20"
								>从数据库中获取爬虫最近数据</span
							>
						</a-col>
						<a-col :span="24"
							><a-button type="primary" @click="showImportJson"
								>导入数据</a-button
							>
							<span class="ml-20"
								>从导出的Json文件中获取资源信息</span
							>
						</a-col>
						<a-col :span="24"
							><a-button type="primary" @click="exportJson"
								>导出数据</a-button
							>
							<span class="ml-20">导出Json数据文件</span>
						</a-col>
						<a-col :span="24"
							><a-button type="primary" @click="handleChecked"
								>本地校对</a-button
							>
							<span class="ml-20">校对本地文件是否存在</span>
						</a-col>
						<a-col :span="24"
							><a-button type="primary" @click="createThumb"
								>生成缩略图</a-button
							>
							<span class="ml-20">校对本地文件是否存在</span>
						</a-col>
					</a-row>
				</a-card>
			</a-form-model-item>
			<a-form-model-item label="操作配置">
				<a-card>
					<a-row :gutter="[20, 20]">
						<a-col :span="24"
							><a-button @click="showDatabaseConfig"
								>配置数据库</a-button
							>
							<span class="ml-20">同步数据库的mysql配置</span>
						</a-col>
						<a-col :span="24"
							><a-button @click="showResourcePathConfig"
								>资源路径</a-button
							>
							<span class="ml-20">配置资源路径</span>
						</a-col>
					</a-row>
				</a-card>
			</a-form-model-item>
			<a-form-model-item label="数据清理">
				<a-card>
					<a-row :gutter="[20, 20]">
						<a-col :span="24"
							><a-button
								type="danger"
								@click="clearTable('resource')"
								>清除资源数据</a-button
							>
							<span class="ml-20">清除资源数据表</span>
						</a-col>
						<a-col :span="24"
							><a-button type="danger" @click="clearTable('user')"
								>清除用户数据</a-button
							>
							<span class="ml-20">清除用户数据表</span>
						</a-col>
						<a-col :span="24"
							><a-button type="danger" @click="clearTable('all')"
								>清除所有数据</a-button
							>
							<span class="ml-20">清除所有数据表</span>
						</a-col>
					</a-row>
				</a-card>
			</a-form-model-item>
			<a-form-model-item label="用户管理">
				<a-card>
					<a-row :gutter="[20, 20]">
						<a-col :span="24"
							><a-button @click="showUserConfigModal"
								>用户管理</a-button
							>
							<span class="ml-20">指定用户指定删除,更改</span>
						</a-col>
					</a-row>
				</a-card>
			</a-form-model-item>
		</a-form-model>
		<SettingDatabaseConfigModal
			ref="SettingDatabaseConfigModal"
		></SettingDatabaseConfigModal>
		<SettingResourcePathConfigModal
			ref="SettingResourcePathConfigModal"
		></SettingResourcePathConfigModal>
		<SettingImportJsonConfigModal
			ref="SettingImportJsonConfigModal"
		></SettingImportJsonConfigModal>
		<SettingUserConfigModal
			ref="SettingUserConfigModal"
		></SettingUserConfigModal>
	</div>
</template>

<script>
//import x from ''
import db from '@/api/dexie/api.js'
import { ipcRenderer } from 'electron'
import SettingDatabaseConfigModal from '@/views/settings/modules/SettingDatabaseConfigModal.vue';
import SettingResourcePathConfigModal from '@/views/settings/modules/SettingResourcePathConfigModal.vue';
import SettingImportJsonConfigModal from '@/views/settings/modules/SettingImportJsonConfigModal.vue';
import SettingUserConfigModal from '@/views/settings/modules/SettingUserConfigModal.vue';
export default {
	name: 'Settings',
	components: {
		SettingDatabaseConfigModal, SettingResourcePathConfigModal, SettingImportJsonConfigModal, SettingUserConfigModal
	},
	data () {
		return {
		};
	},
	computed: {

	},
	created () {
		this.ipcListen()
	},
	methods: {
		showDatabaseConfig () {
			this.$refs['SettingDatabaseConfigModal'].show()
		},
		showResourcePathConfig () {
			this.$refs['SettingResourcePathConfigModal'].show()
		},
		async syncData () {
			const config = this.$ls.get('database_config', {})
			ipcRenderer.send('syncMysqlData', config)
		},
		async exportJson () {
			const eLink = document.createElement('a')
			const data = await db.getJsonData()
			console.log(data);
			const dataStr = JSON.stringify(data)
			const blob = new Blob([dataStr]);
			const href = window.URL.createObjectURL(blob)
			eLink.href = href
			const time = new Date().getTime()
			eLink.setAttribute('download', `iwaraJson数据${time}.json`)
			eLink.style.display = 'none'
			document.body.appendChild(eLink)
			eLink.click()
			document.body.removeChild(eLink)
		},
		showImportJson () {
			this.$refs['SettingImportJsonConfigModal'].show()
		},
		async clearTable (type) {
			if (type == 'resource') {
				await db.iwara_info.clear()
			} else if (type == 'user') {
				await db.iwara_love.clear()
				await db.iwara_user.clear()
				await db.iwara_collection_list.clear()
				await db.iwara_collection_list_item.clear()
			}
			else if (type == 'all') {
				await db.iwara_info.clear()
				await db.iwara_love.clear()
				await db.iwara_user.clear()
				await db.iwara_collection_list.clear()
				await db.iwara_collection_list_item.clear()
			}
		},
		async handleChecked () {
			const srcPath = this.$ls.get('resource_path').resourcePath
			const data = { srcPath }
			ipcRenderer.send('checkedFile', data)

		},
		async createThumb () {
			const srcPath = this.$ls.get('resource_path').resourcePath
			const data = { srcPath }
			ipcRenderer.send('createThumb', data)

		},
		showUserConfigModal () {
			this.$refs['SettingUserConfigModal'].show()
		},
		ipcListen () {
			const that = this
			ipcRenderer.on('createThumbRe', async (ev, data) => {
				console.log(data);
				that.$message.success('新增缩略图成功')
			})
			ipcRenderer.on('checkedFileRe', async (ev, data) => {
				await db.putCheck(data)
				that.$message.success('检查文件下载情况完成')
			})
			ipcRenderer.on('syncMysqlDataRe', async (ev, data) => {
				await db.syncData(data)
				that.$message.success('同步数据成功')
			})
		}
	},
}
</script>

<style lang='scss' scoped>
//@import url()
</style>