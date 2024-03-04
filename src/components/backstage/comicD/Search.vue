<template>
    <div class="main-header row">
        <div class="input-group col-md-3">
            <input class="form-control" placeholder="Search..." v-model="inputSearch" @change="handleSearch">
            <button class="btn btn-outline-secondary" type="button">
                <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
            </button>
        </div>
        <button class="mediaButton col-md-1" @click="tableSearchTrigger">
            {{ mediaButton }}   
        </button>
        <div class="checkBox col-md-2">
            <div class="checkBoxEditor">
                <input type="checkbox" id="checkboxEditor">
                <label for="checkboxEditor"> Editor's Choice
                </label>
            </div>
        </div>
        
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const emits = defineEmits(['tableTrigger', 'tableSearch']);


const inputSearch = ref("");
const handleSearch = () => {
    emits('tableSearch', inputSearch.value)
}


const mediaButton = ref("Media")
const tableSearchTrigger = () => {
    if (mediaButton.value == "Media") {
        mediaButton.value = "Comic"
    } else {
        mediaButton.value = "Media"
    }
    emits('tableTrigger');
}


</script>

<style scoped>
.main-header {
    display: flex;
    align-items: flex-end;
}

.input-group {
    width: 300px;
    height: 40px;
}

.checkBox {
    width:200px;
    font-size: 18px;
    color: rgb(164, 164, 164);
}

.checkBox input {
    width: 25px;
    border: 1px solid rgb(198, 198, 198);
    margin: 0 3px 0 0;
}

.checkBoxEditor {
    position: absolute;
    bottom: -4px;
}

/* .checkBoxImages{
    position: absolute;
    bottom:-4px;
    left: 180px;
} */
.mediaButton {
    width: 80px;
    border: 1px solid gray;
    border-radius: 20px;
    margin: 0 10px 0 0;
}
</style>