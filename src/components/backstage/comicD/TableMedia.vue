<template>
    <ag-grid-vue class="ag-theme-material" 
        style="height:80vh; text-align:center;"     
        :gridOptions="gridOptions" 
        :rowData="comicEpisodesForRow"
        @grid-ready="onGridReady" 
        :defaultColDef="defaultColDef">
    </ag-grid-vue>
    <div class="pageButtonConatiner" v-if="hasData" >
        <button 
        :class= "{selectedButton: currentPage == page, pageButton: currentPage !== page} " 
        v-for="page in pages" 
        :key="page" 
        @click="handlePageClick(page)">
            {{ page }}
        </button>
    </div>
    <!-- <UploadPhotoButton :gridOptions="gridOptions" :params="params"/> -->
</template>

<script setup>
import { ref, watch, onMounted, defineProps} from 'vue';
import httpClient from '@/main.js';
import UploadPhotoButton from './UploadPhotoButton.vue';
import { AgGridVue } from 'ag-grid-vue3';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
const props = defineProps(['searchComicIds'])


const defaultColDef = ref({
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    cellClass: 'center-text',
    width: 160,
    // onCellValueChanged:edited, 
})


let gridApi = ref(null);
let gridColumnApi = ref(null);
const onGridReady = (params) => {
    gridApi.value = params.api;
    gridColumnApi.value = params.columnApi;
}

const handleRefreshTable = () => {
    console.log(currentPage.value)
    if(currentPage.value!==0 || currentPage.value!== null){
        fetchData(currentPage.value)
    }else{
        fetchData(1);
    }
    
}

const gridOptions = ref({ 
    columnDefs: [
    { field: 'comicTitle', pinned: 'left' },
            {
                field: '',
                sortable: false,
                editable: false,
                filter: false,
                width: 20,
                onCellClicked: event => handleRowClick(event),
                cellRenderer: function (params) {
                    if (params.data.isNewRow) {
                        return "";
                    }
                    params.data.rotateImage ? 'transform: rotate(180deg);' : '';
                    return '<img src="https://firebasestorage.googleapis.com/v0/b/remetest-e1cbe.appspot.com/o/Basic%2FdownCaret.png?alt=media&token=fd8c8277-a7ed-44f0-9768-eb3302ab0852" alt="down" style="width:22px; margin:0 3px 0 0";/>'
                }
            },
            { field: 'comicId', hide: true, filter:false },
            { field: 'episodeId', hide: true },
            { field: 'comicCover',
            cellRenderer: (params) => {
            return `<img src="${params.value}" alt="" style="height:100%"/> `  
            } },
            { field: 'episodeNum' },
            { field: 'episodeLikes' },
            { field: 'episodeViews' },
            { field: 'episodeCover',
            cellRenderer: (params) => {
                return `<img src="${params.value}" alt="" style="height:100%"/> `  
            } },
            {
            headerName:'',
            field: 'updatePhoto',
            filter: false,
            sortable: false,
            width: 300,
            cellRenderer:'uploadPhotoButton',
            },
    ]
    ,
    defaultColDef: defaultColDef,
    animateRows: true,
    getRowId: (params) => {
        return `unique-${params.data.episodeId}-${params.data.comicId}`;
    },
    components: {
        uploadPhotoButton: UploadPhotoButton,
    },
    rowHeight:80,
    enableCellChangeFlash: true,
    context:{onRefreshTable: handleRefreshTable}

});



function numberWithCommas(value) {
    if (value === null || value === undefined) return value;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeRow(episodeId, comicId) {
    const uniqueId = `unique-${episodeId}-${comicId}`;
    const rowNode = gridApi.value.getRowNode(uniqueId);
    if (rowNode) {
        gridApi.value.applyTransaction({ remove: [rowNode.data] });
    } else {
        console.log("removeRow unsccuess")
    }
}


function createDetailRowData(episode, comicId) {
    return {
        episodeId: episode.episodeId,
        comicId: comicId,
        episodeNum: episode.episodeNum,
        episodeLikes: episode.episodeLikes,
        episodeViews: episode.episodeViews,
        episodeCover: episode.episodeCover,
        isNewRow: true,
    }
}

function handleRowClick(event) {
    const node = event.node;
    const data = node.data;
    data.expand = !data.expand;
    data.rotateImage = data.expand;

    if (data.expand) {
        data.episodes.forEach((episode) => {
            const detailData = createDetailRowData(episode, data.comicId);
            gridApi.value.applyTransaction({
                add: [detailData],
                addIndex: node.rowIndex + 1
            });
        })

    } else {
        data.episodes.forEach((episode) => {
            removeRow(episode.episodeId, data.comicId);
        })
    }

}


const fetchSearchData = (comicIds) =>{
    const updateData = {
        pageNum: 1,
        comicIds: comicIds }
    httpClient.post("/comicD/comics/episodes/search", updateData)
        .then(res =>  {
            return {comicEpisodes: res.data.comicEpisodes, pageUtil:res.data.pageUtil}
        })
        .then(({comicEpisodes,pageUtil}) => {
            comicEpisodes.forEach(comicEpisode => {
                comicEpisode['expand'] = false
                comicEpisode.episodes.forEach(episode => {
                    episode.episodeLikes = numberWithCommas(episode.episodeLikes),
                        episode.episodeViews = numberWithCommas(episode.episodeViews)
                })

            });
            comicEpisodesForRow.value = comicEpisodes
        })
        .catch(err => console.log(err.message))
}


const pages = ref({});
const fetchData = async (page) => {
    httpClient.get(`/comicD/comics/episodes?p=${page}`)
        .then(res => {
            return {comicEpisodes: res.data.comicEpisodes, pageUtil:res.data.pageUtil}
        })
        .then(({comicEpisodes, pageUtil}) => {
            comicEpisodes.forEach(comicEpisode => {
                comicEpisode['expand'] = false
                comicEpisode.episodes.forEach(episode => {
                    episode.episodeLikes = numberWithCommas(episode.episodeLikes),
                        episode.episodeViews = numberWithCommas(episode.episodeViews)
                })

            });           
            comicEpisodesForRow.value = comicEpisodes  
            pages.value = pageUtil[0].totalPages    
        })
        .then(()=>{
          hasData.value = true;
        })
        .catch(err => console.log(err.message))

}

const searchComicIds = ref(props.searchComicIds)
watch (searchComicIds, (newValue) => {
    if(newValue){
        fetchSearchData(newValue);
    }
})

const currentPage =ref(null);
const handlePageClick = (page) => {
    currentPage.value = page;
    fetchData(page);
}


const hasData = ref(false);
const comicEpisodesForRow = ref([]);
onMounted(() => {
    if(props.searchComicIds.length !== 0){
        fetchSearchData(props.searchComicIds);
    }else{
       fetchData(1);
       console.log("in else")
    }
    
})

</script>


<style scoped>
.pageButtonConatiner{
    position: absolute;
    top:2%;
    left:75%;

}
.pageButton{
    width:24px;
    height:24px;
    text-align: center;
    vertical-align: center;
    margin:0 0 0px 5px;
    border:0px;
    color:darkgrey;
    font-size:18px;
    background:transparent;
}

.pageButton:hover{
    background-color:rgb(93, 180, 238);
    transform: scale(1.2);
    color:white;
    border-radius:15px;
    box-shadow: 0 0 2px rgba(113, 254, 254, 0.431);
}

.selectedButton{
    width:30px;
    height:30px;
    text-align: center;
    vertical-align: center;
    background-color:rgb(93, 180, 238);
    color:white;
    font-size:20px;
    border-radius:15px;
    box-shadow: 0 0 2px rgba(113, 254, 254, 0.431);
    border:0px;
}
</style>