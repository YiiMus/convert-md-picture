<template>
    <div class="task-box">
        <span class="title" :title="item.fileName">{{ item.fileName }}</span>

        <div class="progress">
            <el-progress :percentage="percentage" :indeterminate="indeterminate" />
        </div>

        <div
            v-if="item.status !== 'taskFinished'"
            class="status"
            :title="$t(`task.${item.status || 'unKnown'}`)"
        >
            {{ $t(`task.${item.status || 'unKnown'}`) }}
        </div>
        <div v-else class="status">
            <a v-if="item.data.isBuild" href="#" :title="$t('task.openFolder')" @click="handleClick">{{
                $t(`task.${item.status || 'unKnown'}`)
            }}</a>
            <div v-else :title="$t('task.noParsed')">
                {{ $t('task.taskCancel') }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { watchEffect, ref } from 'vue'

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const percentage = ref(0)
const indeterminate = ref(false)

const handleChangeProgress = (status, data) => {
    // 进度为 0 的状态
    if (['waiting', 'startUpload'].includes(status)) {
        percentage.value = 0
        indeterminate.value = false
    }

    // 动画进度条
    if (['parsing', 'building'].includes(status)) {
        percentage.value = 0
        indeterminate.value = true
    }

    // 上传中
    if (status === 'uploading') {
        percentage.value = Math.min(Math.round((data.uploadedCount / data.totalCount) * 100 * 100) / 100, 100)
    }

    // 进度为  100 的状态
    if (['parsed', 'uploaded', 'builded', 'taskFinished'].includes(status)) {
        percentage.value = 100
        indeterminate.value = false
    }
}

const handleClick = (e) => {
    e.preventDefault()

    window.api.openFolder(props.item.data.outputPath)
}

watchEffect(() => {
    const { status, data } = props.item

    handleChangeProgress(status, data)
})
</script>

<style lang="less" scoped>
.task-box {
    padding: 0 40px;
    width: 100%;
    height: 60px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    flex-direction: row;

    &:hover {
        background-color: rgba(52, 152, 219, 0.1);
    }

    .text-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .title {
        .text-overflow;
        max-width: 230px;
    }

    .progress {
        flex: 1;
        padding: 0 24px;
    }

    .status {
        .text-overflow;
        width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
