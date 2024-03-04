<template>
    <ag-grid-vue
    class="ag-theme-material"
    style="height:500px"
    :columnDefs="columnDefs"
    :rowData="comics"
    @grid-ready="onGridReady"
    :defaultColDef="defaultColDef"
    :animateRoes="true"
    ></ag-grid-vue>
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps, defineExpose } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import moment from 'moment';
import DOMPurify from 'dompurify';
//import swal from 'sweetalert'


const columnDefs = [
    {field:'comicId', width:80, editable: false},
    {field:'comicTitle'},
    {field:'comicDescription'},
    {field:'updateDay',},
    {field:'publishDate', comparator:dateComparator},  
    {field:'genreName'},
    {field:'comicViews',
    valueFormatter: params => numberWithCommas(params.value),},
    {field:'comicLikes',
    valueFormatter: params => numberWithCommas(params.value),}, 
    {field:'comments',
    valueFormatter: params => numberWithCommas(params.value),},
    {field:'purchasePrice',width:180,
    valueFormatter: params => `$ ${params.value}.00`,},
    {field:'rentalPrice',width:180,
    valueFormatter: params => `$ ${params.value}.00`,},
    {field:'editorChoice'},
]

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

const props = defineProps(['changedRows']);
const emit = defineEmits(['cell-edited', 'updateChangedRows']);
function edited(event) {
        /*const cell = params.api.getCellRendererInstances({ rowNodes: [params.node], columns: [params.column] })[0];
        cell.eGui.classList.add('edited-style');*/
        let sanitizedValue = DOMPurify.sanitize(event.newValue);
        event.data[event.colDef.field] = sanitizedValue;
        event.api.refreshCells({ rowNodes: [event.node], columns: [event.colDef.field] });
        const updatedData = {
            comicId: event.data.comicId,
            [event.column.colId]: sanitizedValue,
        };  
        emit('cell-edited');
        emit('updateChangedRows', updatedData);
        
        
}

const defaultColDef = {
    sortable:true,
    filter:true,
    resizable:true,
    editable: true,
    cellClass: 'center-text',
    width:150,
    onCellValueChanged:edited,
       
}

let gridApi = null;
let gridColumnApi = null;
const sizeToFit = (isChecked)=>{
    if(isChecked && gridApi){
        gridApi.sizeColumnsToFit()
    }else {
        gridColumnApi.getAllColumns().forEach(column => {
            gridColumnApi.setColumnWidth(column, 150);
        });
    }
}

const onGridReady = (params)=>{
    gridApi = params.api;
    gridColumnApi = params.columnApi;
}


const comics = ref([]);
onMounted(()=>{
    fetch("http://localhost:8080/remecomic/comicD/calculatedcomics/fast")
    .then(res => res.json())
    .then(data => {
        data.forEach( comic => {
            comic.comicLikes += comic.comicLikesEP;
            comic.publishDate = moment(comic.publishDate).format('MMM-DD/YYYY')
            if(!comic.comments) comic.comments = 0 ;
        });
        comics.value = data;
    })
    .catch(err => console.log(err.message))
    })

    defineExpose({sizeToFit});

</script>


<style scoped>
.center-text {
    text-align: center;
}

.edited-style {
    background-color:crimson;
}

</style>