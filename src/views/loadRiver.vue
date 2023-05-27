<template>
	<div class="layout-tool-template modelToolBar">
		<button @click="mapLabels()">地图标注</button>
		<!-- <button @click="getRiver()">getRiver</button> -->
	</div>
</template>
<script setup>
	import { mapLabels } from '@/utils/common.js';
</script>
<style scoped lang="scss">
	.modelToolBar {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 999;
		margin: 8px;
	}

	.water-bartool {
		margin-top: 10px;

		.waterInfo {
			font-size: 16px;
			font-weight: 600;
			color: red;
		}
	}

	.warningHeight {
		color: red;
		font-weight: 600;
	}
</style>
