<template>
    <div class="title">
        <div class="title-box">{{ appName }}</div>
        <div class="btn-box">
            <a-button type="text" class="btn" :title="$t('header.btn.minusTitle')" @click="handleMinus"
                ><MinusOutlined
            /></a-button>
            <a-button type="text" class="btn close" :title="$t('header.btn.closeTitle')" @click="handleClose"
                ><CloseOutlined
            /></a-button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CloseOutlined, MinusOutlined } from '@ant-design/icons-vue'

const appName = ref('Loading...')

onMounted(async () => {
    const packageJson = await window.api.getPackageJson()
    appName.value = packageJson.productName || 'ConvertMdPicture'
})

const handleMinus = () => {
    window.api.minimize()
}

const handleClose = () => {
    window.api.closeApp()
}
</script>

<style lang="less" scoped>
.title {
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    -webkit-app-region: drag;
}

.title-box {
    padding-left: 8px;
}

.btn-box {
    position: absolute;
    display: flex;
    align-items: center;
    right: 0;
    height: 100%;

    .btn {
        border-radius: 0;
        height: 100%;
        border: none;
        -webkit-app-region: no-drag;
    }

    .close {
        &:hover {
            color: white;
            background-color: rgba(235, 87, 87, 0.8);
        }

        &:active {
            color: white;
            background-color: rgba(211, 47, 47, 0.9);
        }
    }
}
</style>
