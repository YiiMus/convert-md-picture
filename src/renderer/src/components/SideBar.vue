<template>
    <div class="side-bar">
        <div class="icon">
            <a-avatar :size="64">
                <template #icon><UserOutlined /></template>
            </a-avatar>
        </div>
        <div class="action-list">
            <el-scrollbar>
                <a-list item-layout="horizontal" :data-source="data">
                    <template #renderItem="{ item }">
                        <a-list-item>
                            {{ item.title }}
                        </a-list-item>
                    </template>
                </a-list>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
import { UserOutlined } from '@ant-design/icons-vue'

const data = [
    {
        title: 'Ant Design Title 1'
    },
    {
        title: 'Ant Design Title 2'
    },
    {
        title: 'Ant Design Title 3'
    }
]
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

    .action-list {
        width: 100%;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
    }
}
</style>
