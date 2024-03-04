<template>
    <div class="checkboxContainer">
        <input type="checkbox" class="checkboxDelete" @click="showDeleteButton">
    </div>
</template>

<script setup>
import {defineProps} from 'vue'
const props = defineProps(['params'])

const showDeleteButton = () => {
    props.params.context.onShowDeleteButton();
}

</script>

<style scoped>
.checkboxDelete{
    width:18px;
    height:18px;
}

</style>