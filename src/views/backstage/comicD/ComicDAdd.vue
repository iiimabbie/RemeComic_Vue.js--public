<template>
    <h1 class="draftsTitle">Drafts</h1>
    <SelectButton class="selectButton"
    @newComicInputForm="handleNewComicInputForm"/>
    <div class="row">
        <TableDrafts class="col-5" :isRefreshDraftTable="isRefreshDraftTable"
        @onAddFormData="handleRefreshDraftForm"/>
        <AddComic class="col-7" @onRefreshDraftTable="handleRefreshDraftTable"
        :clickDraftIdFromTable="clickDraftIdFromTable" 
        :newInputForm="newInputForm"
        @completeResetForm="handleNewComicInputForm"
        />
    </div>

</template>

<script setup>
import {ref} from 'vue'
import SelectButton from '@/components/backstage/comicD/add/SelectButton.vue'
import TableDrafts from '@/components/backstage/comicD/add/TableDrafts.vue'
import AddComic from '@/components/backstage/comicD/add/AddComic.vue'

const isRefreshDraftTable = ref(0);
const handleRefreshDraftTable = () => {
    isRefreshDraftTable.value += 1 ;
}

const clickDraftIdFromTable = ref({});
const handleRefreshDraftForm = (data) => {
    clickDraftIdFromTable.value = data;
}

const newInputForm = ref(false);
const handleNewComicInputForm = () => {
    newInputForm.value = !newInputForm.value;
    console.log(newInputForm.value);
}

</script>

<style scoped>
.draftsTitle{
    position: absolute;
    top:-70px;
    left:3%;
}
</style>