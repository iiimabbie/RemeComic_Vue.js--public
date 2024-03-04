<template>
    <div class="addButtonContainer">
        <button class="btn addButton" @click="handleAddComic">Add Comic</button>
        <button class="btn addButton">Add Episode</button>
    </div>
</template>

<script setup>
import {defineEmits} from 'vue'
const emits = defineEmits(['newComicInputForm']);

const handleAddComic = () => {
    emits('newComicInputForm');
}

</script>

<style scoped>
.addButton{
    margin: 0 0 0 10px;
    padding:0 0 8px 0;
    width:200px;
    height:40px;
    font-size:28px;
    border:1px solid darkgrey;
    color: lightgrey;
}

.addButton:hover{
    border:2px solid rgb(90, 90, 90);
    color: rgb(82, 82, 82);
}
</style>