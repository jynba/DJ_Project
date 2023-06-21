<!--
 * @Descripttion: 搜索组件
 * @version: 1.0.0
 * @Author: 朱海东
 * @Date: 2023-06-20 20:44:11
 * @LastEditTime: 2023-06-20 20:59:26
-->
<template>
    <div>
        <form action="/">
            <van-search v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" />
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Toast } from 'vant';

const value = ref('');
const onSearch = (val) => Toast(val);
const onCancel = () => Toast('取消');

</script>
<style lang="scss"></style>