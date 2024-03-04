<template>
   <input type="text" v-model="inputValue" @blur="stopEditing" />
</template>

<script setup>
import {ref, onMounted, defineProps, defineEmits} from 'vue'
const props = defineProps(['params']);
const emits = defineEmits(['editedData']);
const inputValue = ref('');
onMounted(()=>{
    inputValue.value = props.params.value.join(",")
    
})

const stopEditing = () => {
    props.params.data.genreName = inputValue.value.split(",");
    props.params.api.stopEditing();
    // props.params.api.refreshCells({ rowNodes: [props.params.node] });
}
</script>

<style>

</style>