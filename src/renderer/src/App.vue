<template>
    <Header />
    <a-button type="primary" @click="handleClick">print loading</a-button>
</template>

<script setup>
import Header from './components/Header.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const handleClick = () => {
    console.log(t('header.loading'))
}
</script>
