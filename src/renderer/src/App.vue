<template>
    <Header />
    <a-button type="primary" @click="handleClick">Primary Button</a-button>
</template>

<script setup>
import Header from './components/Header.vue'

const handleClick = () => {
    console.log('clicked', window.api.ping())
}
</script>
