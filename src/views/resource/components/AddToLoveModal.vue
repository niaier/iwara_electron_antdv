<!-- 组件说明 -->
<template>
	<div class="">
		<a-modal
			:visible="visible"
			title="添加到喜欢"
			width="200px"
			centered
			:bodyStyle="{
				'text-align': 'center',
				padding: '10px',
			}"
			@cancel="handleCancel"
			@ok="handleOk"
			:footer="null"
		>
			<a-row :gutter="[10, 10]">
				<a-col
					class="hover_blue"
					v-for="count of 9"
					:span="24"
					:key="count"
					:style="{
						background: love_level == count ? 'pink' : '',
					}"
					@click="addToLove(count)"
				>
					<span>LOVE LEVEL {{ count }}</span>
				</a-col>
				<a-col
					class="hover_blue cancel_to_love"
					:span="24"
					@click="addToLove(0)"
				>
					<span>CANCEL TO LOVE</span>
				</a-col>
			</a-row>
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
			info: {},
			love_level: 0,
			user_id: 1,
			iwara_love_id: 0
		};
	},
	computed: {

	},
	methods: {
		show (info, love_level, user_id, iwara_love_id) {
			console.log(info, love_level, user_id);
			this.visible = true
			this.info = info
			this.love_level = love_level
			this.user_id = user_id
			this.iwara_love_id = iwara_love_id
		},
		handleOk () {
			this.visible = false
		},
		handleCancel () {
			this.visible = false
		},
		async addToLove (love_level) {
			const { id } = this.info
			const data = {
				id: this.iwara_love_id,
				iwara_info_id: id,
				love_level,
				user_id: 1
			}
			await db.addToLove(data)
			this.updateLove()
		},
		updateLove () {

			this.$emit('updateLove')
		}
	},
}
</script>

<style lang='scss' scoped>
//@import url()
.hover_blue:hover {
	background-color: #acc9ff;
	color: #fff;
	cursor: pointer;
}

.cancel_to_love {
	border: 2px solid #acc9ff;
	color: #78a7ff;
	font-weight: 600;
	&:hover {
		color: #fff;
	}
}
</style>