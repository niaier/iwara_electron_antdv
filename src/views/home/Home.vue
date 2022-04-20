<!-- 组件说明 -->
<template>
	<div class="">
		<h1>Welcome !</h1>
	</div>
</template>

<script>
//import x from ''
import { getData } from '@/api/http/api.js'
import db from '@/api/dexie/api.js'
export default {
	name: '',
	components: {

	},
	data () {
		return {

		};
	},
	computed: {

	},
	methods: {
		async syncData () {
			const res = await getData()
			if (res.success) {
				this.$message.success(res.message)
				await db.syncData(res.result)
			} else {
				this.$message.error(res.message)
			}

		}
	},
}
</script>

<style lang='scss' scoped>
//@import url()
</style>