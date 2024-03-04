<template>
    <div>
        <button id="saveButton" class="btn-secondary" @click="save"> Save </button>
        <button id="discardButton" class="btn-secondary" @click="discard"> Discard</button>
    </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';
import httpClient from '@/main.js';
const emits = defineEmits(['saveCompleted', 'discardCompleted']);
const props = defineProps(['uniqueChangedRows']);

const save = () => {
    httpClient.put("/comicD/comic/update/multiple", props.uniqueChangedRows
    ).then(res => {

    }).catch(err => console.log(err));
    emits('saveCompleted', {resetData:true});
};

const discard = () => {
    emits('discardCompleted')
};
</script>

<style>
#saveButton{
    border: 0px;
    border-radius: 5px;
    background: rgb(64, 162, 223);
    -webkit-text-stroke: 0.1px rgb(62, 62, 62);
    color: white;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3);
    font-size:18px;
}

#discardButton{
    margin:0 0px 0 20px;
    border: 1px solid rgb(64, 162, 223);
    border-radius: 5px;
    background-color: white;
    color: rgb(64, 162, 223);
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3);
    font-size:18px;
}
</style>
