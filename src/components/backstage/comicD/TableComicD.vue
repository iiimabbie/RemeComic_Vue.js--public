<template>
    <button class="deleteButton" v-if="showDeleteButton">Delete</button>
    <button class="discard" v-if="showDeleteButton" @click="handleDeleteDiscard">Discard</button>
    <ag-grid-vue 
        class="ag-theme-material" 
        style="height:85vh;"     
        :gridOptions="gridOptions" 
        :rowData="comicsForRow"
        @grid-ready="onGridReady" 
        :defaultColDef="defaultColDef" 
        :animateRows="true">
    </ag-grid-vue>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits, defineProps, defineExpose } from 'vue';
import httpClient from '@/main.js'
import CheckBoxDelete from './CheckBoxDelete.vue';
import ShowGenreNames from './genres/ShowGenreNames.vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import moment from 'moment';
import DOMPurify from 'dompurify';
const props = defineProps(['changedRows', 'isRefreshTable', 'searchTerm']);
const emits = defineEmits(['cellEdited', 'updateChangedRows', 'searchComicIds']);


const showDeleteButton =ref(false);
const handleShowDeleteButton = () => {
    showDeleteButton.value = true;
}
const handleDeleteDiscard = ()=>{
    showDeleteButton.value = false;
    fetchData();
}

const handleEditedData = (editedData) => {
      console.log('Edited data received:', editedData);
    }

const handleRefreshTable = () =>{
//   var params = {
//         force: true,
//         suppressFlash: true
//       };
//   gridApi.value.refreshCells(params);
  fetchData();
}

const handleTableSearch = (newValue) => {
    const updateData ={searchTerm:newValue}
    httpClient.post("/comicD/calculatedcomics/search", updateData)
    .then(res => {
        return {comics:res.data.comics, comicIds:res.data.comicIds} })
    .then(({comics, comicIds}) => {
        comics.forEach(comic => {
            comic.comicLikes += comic.comicLikesEP;
            comic.publishDate = moment(comic.publishDate).format('MMM-DD/YYYY')
            if (!comic.comments) comic.comments = 0;
        });
        comicsForRow.value = comics;
        emits('searchComicIds', comicIds)
    })
    .catch(err => console.log(err.message))
}


const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    cellClass: 'center-text',
    width: 150,
    onCellValueChanged: edited,
}

const gridApi = ref();
const gridColumnApi = ref();
const onGridReady = (params) => {
    gridApi.value = params.api;
    gridColumnApi.value = params.columnApi;
}


const gridOptions = {
    columnDefs: [
        { field: '', width:40,sortable:false,filter:false, 
        cellRenderer: "checkBoxDelete"
        },
        { field: 'comicId', width: 66, editable: false },
        { field: 'comicTitle', width: 200, pinned: 'left' },
        { field: 'comicDescription' },
        { field: 'updateDay', },
        { field: 'publishDate', comparator: dateComparator },
        { field: 'genreName', width:245,
        cellRenderer: 'showGenreNames'
        },
        {
            field: 'comicViews',
            valueFormatter: params => numberWithCommas(params.value), editable: false
        },
        {
            field: 'comicLikes',
            valueFormatter: params => numberWithCommas(params.value), editable: false
        },
        {
            field: 'comments',
            filter:false,
            sortable:false,
            width:110,
            valueFormatter: params => numberWithCommas(params.value), editable: false
        },
        {
            field: 'purchasePrice', width: 180,
            valueFormatter: params => `$ ${params.value}.00`,
        },
        {
            field: 'rentalPrice', width: 180,
            valueFormatter: params => `$ ${params.value}.00`,
        },
        {
            field: 'editorChoice',
            cellRenderer: function (params) {
                let input = document.createElement('input');
                input.type = "checkbox";
                input.classList.add = "checkboxEditor";
                input.checked = params.value;
                input.style.width = '18px';
                input.style.height = '18px';
                input.addEventListener('click', function () {
                    params.value = !params.value;
                    params.node.data.fieldName = params.value;
                    edited(params);
                });
                return input;
            }
        },
    ],
    defaultColDef: defaultColDef,
    rowSelection: 'multiple',
    enableCellChangeFlash: true,
    components:{
        checkBoxDelete: CheckBoxDelete,
        showGenreNames:ShowGenreNames,
    },
    context:{
        onShowDeleteButton:handleShowDeleteButton,
        onEditedData: handleEditedData,
        onRefreshTable: handleRefreshTable,
    }

}

function numberWithCommas(value) {
    if (value === null || value === undefined) return value;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function dateComparator(date1, date2) {
    const dateFormat = 'MMM-DD/YYYY';
    const momentDate1 = moment(date1, dateFormat);
    const momentDate2 = moment(date2, dateFormat);
    return momentDate1 - momentDate2;
}


const sizeToFit = (isChecked) => {
    if (isChecked && gridApi) {
        gridApi.sizeColumnsToFit()
    } else {
        gridColumnApi.getAllColumns().forEach(column => {
            gridColumnApi.setColumnWidth(column, 150);
        });
    }
}

function edited(event) {
    console.log(event);
    let updatedData = {};
    if(event.colDef.field == 'genreName') {
        let sanitizedValue = DOMPurify.sanitize(event.data.genreName);
        event.data[event.colDef.field] = sanitizedValue;
        updatedData = {
            comicId: event.data.comicId,
            [event.column.colId]: sanitizedValue,
        };
        console.log(sanitizedValue);
    }else if(event.newValue!== null ){
        let sanitizedValue = DOMPurify.sanitize(event.newValue);
        event.data[event.colDef.field] = sanitizedValue;
        // event.api.getCellRendererInstances({ rowNodes: [event.node], columns: [event.colDef.field] }).forEach(instance => {
        //     instance.getGui().style.color = 'crimson'; 
        // });

        event.api.refreshCells({ rowNodes: [event.node], columns: [event.colDef.field] });
        updatedData = {
            comicId: event.data.comicId,
            [event.column.colId]: sanitizedValue,
        };
    }
    emits('cellEdited');
    emits('updateChangedRows', updatedData);
}

const isRefreshTable = ref(false);
watch (() => props.isRefreshTable, (newValue) => {
    isRefreshTable.value = newValue;
    if(newValue){
        fetchData();
    }
});

watch (() => props.searchTerm, (newValue) => {
    if(newValue){
        handleTableSearch(newValue);
    }
});

const fetchData = () => {
    httpClient.get("/comicD/calculatedcomics/fast")
        .then(res => {
            res.data.forEach(comic => {
                comic.comicLikes += comic.comicLikesEP;
                comic.publishDate = moment(comic.publishDate).format('MMM-DD/YYYY')
                if (!comic.comments) comic.comments = 0;
            });
            comicsForRow.value = res.data;
        })
        .catch(err => console.log(err.message))

}

const comicsForRow = ref([]);
onMounted(() => {
    fetchData();
})

defineExpose({ sizeToFit });


</script>


<style scoped>
.ag-theme-material::-webkit-scrollbar {
    width: 8px;
}
.center-text {
    text-align: center;
}
.edited-style {
    background-color: crimson;
}
.deleteButton{
    position:absolute;
    top: 0px;
    left: 42%;
    background-color: crimson ;
    color:white;
    border: 0px solid;
    border-radius:5px;
    font-size:18px;
    box-shadow: 0px 0px 5px;

}
.discard{
    position:absolute;
    top: 0px;
    left: 48%;
    color:crimson;
    background-color:white;
    border:1px solid crimson;
    border-radius:5px;
    font-size:18px;
    box-shadow: 0px 0px 2px;

}
</style>