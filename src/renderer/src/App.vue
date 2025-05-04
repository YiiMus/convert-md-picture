<template>
    <a-layout class="app">
        <a-layout-sider class="transparent-background app-sider" width="230">
            <SideBar />
        </a-layout-sider>
        <a-layout>
            <a-layout-header class="transparent-background app-header">
                <Header />
            </a-layout-header>
            <a-layout-content class="transparent-background app-content">
                <router-view />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup>
import Header from './components/Header.vue'
import SideBar from './components/SideBar.vue'
</script>

<style lang="css" scoped>
.app {
    height: 100vh;
    background: transparent;
    user-select: none;

    .app-sider {
        border-right: 1px solid rgb(204, 204, 204);
        background-color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
    }

    .app-header {
        height: auto;
        padding: 0;
        border-bottom: 1px solid rgb(220, 220, 220);
        background-color: rgb(255, 255, 255);
    }

    .app-content {
        background-color: #fff;
    }
}

.transparent-background {
    background: transparent;
}
</style>
