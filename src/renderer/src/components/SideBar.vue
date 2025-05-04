<template>
    <div class="side-bar">
        <div class="icon">
            <a-avatar :size="64">
                <template #icon><UserOutlined /></template>
            </a-avatar>
        </div>
        <div class="router-list">
            <el-scrollbar :data="routerList">
                <a-list item-layout="horizontal" :data-source="routerList">
                    <template #renderItem="{ item }">
                        <div class="router-box">
                            <v-btn
                                :prepend-icon="item.icon"
                                :variant="item.path === activeRoute ? 'tonal' : 'text'"
                                rounded="lg"
                                @click="handleClick(item.path)"
                            >
                                {{ item.title }}</v-btn
                            >
                        </div>
                    </template>
                </a-list>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { UserOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const activeRoute = ref('/')

const routerList = [
    {
        icon: 'mdi-panorama-variant',
        title: t('router.convert'),
        path: '/'
    },
    {
        icon: 'mdi-file-settings',
        title: t('router.setting'),
        path: '/setting'
    },
    {
        icon: 'mdi-information-variant-box',
        title: t('router.about'),
        path: '/about'
    }
]

const handleClick = (path) => {
    router.push(path)
    activeRoute.value = path
}
</script>

<style lang="less" scoped>
.side-bar {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;

    .icon {
        width: 100%;
        height: 130px;
        -webkit-app-region: drag;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .router-list {
        width: 100%;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;

        .router-box {
            padding: 4px 12px;

            .v-btn {
                width: 100%;
                height: 48px;
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                justify-content: space-evenly;
                font-size: 16px;
                font-weight: 400;
            }
        }
    }
}
</style>
