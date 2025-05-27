<template>
    <div class="task-box">
        <span class="title" :title="item.fileName">{{ item.fileName }}</span>

        <div class="progress">
            <el-progress
                :percentage="percentage"
                :indeterminate="indeterminate"
                :status="progressStatus"
                :format="format"
            />
        </div>

        <div
            v-if="item.status !== TaskType.endTask && item.status !== TaskType.abortTask"
            class="status"
            :title="$t(`task.${item.status}`)"
        >
            {{ $t(`task.${item.status}`) }}
        </div>
        <div v-if="item.status === TaskType.abortTask" class="status" :title="item.data.msg">
            {{ $t(`task.${item.status}`) }}
        </div>
        <div v-if="item.status === TaskType.endTask" class="status">
            <a v-if="item.data.isBuild" href="#" :title="$t('task.openFolder')" @click="handleClick">{{
                $t(`task.${item.status}`)
            }}</a>
            <span v-else>{{ $t(`task.${item.status}`) }}</span>
        </div>
    </div>
</template>

<script setup>
import { watchEffect, ref } from 'vue'
import { TaskType } from '../const/TaskType'

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const percentage = ref(0)
const indeterminate = ref(false)
const progressStatus = ref('')
const isShowPercentage = ref(true)

const format = (percentage) => {
    if (!isShowPercentage.value) return null
    return `${percentage}%`
}

const handleChangeProgress = (status, data) => {
    if (TaskType.startTask === status) {
        isShowPercentage.value = false
        percentage.value = 25
        indeterminate.value = true
    }

    if (TaskType.uploadProgress === status) {
        if (!isShowPercentage.value) isShowPercentage.value = true
        percentage.value = Math.min(Math.round((data.uploadedCount / data.totalCount) * 100 * 100) / 100, 100)
    }

    if (TaskType.endTask === status) {
        percentage.value = 100
        indeterminate.value = false
        progressStatus.value = 'success'
    }

    if (TaskType.abortTask === status) {
        percentage.value = 100
        indeterminate.value = false
        progressStatus.value = 'warning'
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
    }
}
</style>
