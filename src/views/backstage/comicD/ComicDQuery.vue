<template>
    <div class="comicDQueryContainer">
        <Search class ="search" 
        @tableTrigger="handleTableTrigger"
        @tableSearch="handleTableSearch" />
        <div class="secondSearch">
            <div class="date col-md-2 col-lg-2">
            <font-awesome-icon :icon="['far', 'calendar']" class="input-icon" />
            <input class="datepicker" type="text" placeholder="Start Date">
            </div>
            <div class="date col-md-2 col-lg-2">
            <font-awesome-icon :icon="['far', 'calendar']" class="input-icon" />
            <input class="datepicker" type="text" placeholder="End Date">
            </div>
            <div class="form-check col-md-1 col-lg-1 form-switch">
            <input class="form-check-input" type="checkbox" @change="callSizeToFit" role="switch"
                id="flexSwitchCheckDefault">
            <label class="form-check-label" for="flexSwitchCheckDefault">Shrink</label>
            </div>
            <SaveButton class="saveButton col-md-7 col-lg-7" v-if="isCellEdited" :uniqueChangedRows="uniqueChangedRows"
            @saveCompleted="handleSaveCompleted"
            @discardCompleted="handleDiscardCompleted" />
        </div>
        <br>
        <TableComicD v-if="tableSwitch" @cellEdited="handleCellEdited" @updateChangedRows="handleUpdateChangedRow" 
        @searchComicIds="handleSearchComicIds"
        :isRefreshTable="isRefreshTable"
        :searchTerm="searchTerm"/>
        <TableMedia v-if="!tableSwitch" 
        @cellEdited="handleCellEdited" @updateChangedRows="handleUpdateChangedRow" 
        :searchComicIds="searchComicIds" />
    </div>
</template>

<script setup>
import {ref, reactive} from 'vue';
import Search from '@/components/backstage/comicD/Search.vue'
import SaveButton from '@/components/backstage/comicD/SaveButton.vue'
import TableComicD from '@/components/backstage/ComicD/TableComicD.vue'
import TableMedia from '@/components/backstage/comicD/TableMedia.vue'

const searchTerm = ref("");
const handleTableSearch = (inputValue) => {
  searchTerm.value = inputValue;
}

const searchComicIds = ref([]);
const handleSearchComicIds = (comicIds) => {
  console.log(comicIds);
  searchComicIds.value = comicIds;
} 

const isCellEdited = ref(false);
const handleCellEdited = () => {
  isCellEdited.value = true;
};

const handleSaveCompleted = (event) => {
  if (event.resetData) {
    uniqueChangedRows = reactive([]);
    isCellEdited.value = false;
  }
};

const isRefreshTable = ref(false);
const handleDiscardCompleted = () => {
  isRefreshTable.value = true;
  isCellEdited.value = false;
  uniqueChangedRows = reactive([]);
};


let uniqueChangedRows = reactive([]);
const handleUpdateChangedRow = (updatedData) => {
  console.log(updatedData);
  uniqueChangedRows.push(updatedData);
};

const tableRef = ref(null);
const callSizeToFit = (event) => {
  if (event && event.target && tableRef.value) {
    tableRef.value.sizeToFit(event.target.checked);
  }
}

const tableSwitch = ref(true);
const handleTableTrigger = () => {
  tableSwitch.value = !tableSwitch.value;
}

</script>


<style scoped>
.search{
    position:absolute;
    top: -70px;
}
.secondSearch{
    display:flex;
    margin: 0 0 -10px 0;
    align-items: end;
    
}

.date {
  position: relative;
}
.datepicker {
  border: 0.8px solid lightgray;
  padding: 5px;
  border-radius: 5px;
}

.input-icon {
  position: absolute;
  left: 165px;
  top: 50%;
  transform: translateY(-50%);
}

.input-icon-wrapper input {
  padding-left: 30px;
}

</style>