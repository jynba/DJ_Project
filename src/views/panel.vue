<template>
	<div class="modelToolBar">
		<button @click="showPanel = !showPanel">展示命名面板</button>
	</div>

	<div v-if="showPanel" id="panel2" class="jy-content">
		<div class="title">
			<p>你当前选择的是：</p>
			<p>长江-长江-长江</p>
		</div>
		<div class="container">
			<div class="current">
				<p>当前河段名 <span>*</span> ：</p>
				<input type="text" value="长江" />
				<input type="text" value="长江" />
			</div>
			<div class="rely">
				<p>命名依据 <span style="color: red; font-size: 18px">*</span> ：</p>
				<select id="selectValue" onchange="getBasisValue()">
					<option value="0">所在国标准地图</option>
					<option value="1">镇志</option>
					<option value="2">县志</option>
					<option value="3">市志</option>
					<option value="4">当地相传</option>
					<option value="5">本人考察论证</option>
					<option value="6">其他</option>
				</select>
			</div>
			<div class="code">
				<p>中国河流代码：</p>
				<input type="text" value="111111" />
			</div>
			<div class="average">
				<input type="text" value="0" />
			</div>
			<div class="info">
				<p>水文站信息：</p>
				<input type="text" />
				<button>匹配信息</button>
			</div>
		</div>
		<div class="bottom">
			<button>关闭</button>
			<button>确认命名</button>
		</div>
	</div>
</template>
<script setup>
	import { ref } from 'vue';
	const showPanel = ref(false);
</script>
<style scoped>
	.modelToolBar {
		position: absolute;
		left: 100px;
		top: 0;
		z-index: 999;
		margin: 8px;
	}

	.jy-content {
		z-index: 100000;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 540px;
		height: 400px;
		background: rgba(4, 9, 27, 0.7);
		color: rgb(239, 229, 241);
	}
</style>
