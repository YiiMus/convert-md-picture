<template>
    <div class="home">
        <div class="select-box">
            <v-btn @click="selectFiles">{{ $t('home.selectFile') }}</v-btn>
        </div>
        <div class="handler-box">
            <p v-for="(item, index) in fileList" :key="index">{{ item }}</p>
        </div>
    </div>
</template>

<script setup>
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
import { onMounted, ref } from 'vue'

const fileList = ref([])

const selectFiles = async () => {
    const selectedFiles = await window.api.selectFiles()

    if (selectedFiles.length > 0) {
        fileList.value = selectedFiles
        await window.api.uploadImage(selectedFiles)
    }
}

onMounted(async () => {
    await window.api.onUploadProgress((event, progress) => {
        console.log('onUploadProgress', progress)
    })
})
</script>

<style lang="less" scoped>
.home {
    width: 100%;
    height: 100%;

    .select-box {
        width: 100%;
        min-height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        top: 0;
    }

    .handler-box {
        width: 100%;
        position: relative;
        top: 0;
        height: 100%;
    }
}
</style>
