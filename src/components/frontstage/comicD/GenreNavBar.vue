<template>
    <div class="genreContainer">
        <span class="genreItem" v-for="genre in genresWithColor" :key="genre.genreId" >
            <input 
                type="checkbox" 
                :id="`genre${genre.genreId}`" 
                :checked="selectedGenreIds.includes(genre.genreId)"
                @change="()=>handleCheckBoxChange(genre.genreId)" >
            <label 
                :id="`genreLabel${genre.genreId}`" 
                :for="`genre${genre.genreId}`"
                :class="{ select: selectedGenreIds.includes(genre.genreId)}"
                style="text-transform: capitalize;">
            {{ genre.genreName }}</label>
            
        </span> 
    </div>
    
</template>

<script setup>
import {ref,defineEmits, onMounted} from 'vue';
import { useCounterStore } from '@/stores/counter';
import { useGenreStore } from '@/stores/genreManagement'; 
const counterStore = useCounterStore();
const emit = defineEmits(['sendComicData']);
const genresWithColor = ref(counterStore.genresWithColor);


const selectedGenreIds = ref([]);
const handleCheckBoxChange = (id)=>{
    const index = selectedGenreIds.value.indexOf(id);
    if(index > -1 ){   
        selectedGenreIds.value.splice(index,1);
        setGenres(selectedGenreIds.value);  
        //console.log("remove from the list", selectedGenreIds.value)
    }else if(index <= -1){
        selectedGenreIds.value.unshift(id); 
        //console.log("in the list", selectedGenreIds.value)
        setGenres(selectedGenreIds.value); 
    }else{
        setGenres(id);
    }
}

const setGenres = (selectedGenreIds) => {
    const genreStore = useGenreStore(); 
    genreStore.setSelectedGenre(selectedGenreIds); 
    console.log("insetting")

}

onMounted(() => {
    handleCheckBoxChange(2)
});

</script>

<style scoped>
.genreContainer{
    width:820px;
    height:100px;
    display:flex;
    overflow-x: auto;
    white-space: nowrap;
    background: black;
}

.genreContainer::-webkit-scrollbar {
    display: none;
}

.genreItem{
    flex: 0 0 auto;
    margin:30px 30px 0 0 ;
}

input[type="checkbox"] {
    display: none;
}

label {
    cursor: pointer;
    color:rgba(250, 243, 243, 0.5); 
    font-size:21px; 
    margin:0 5px 10px 0;  
} 

.select{
    border:2px solid rgb(249, 148, 172);
    background-color: rgb(255, 222, 231);
    border-radius:18px;
    color:rgb(210, 20, 20);
    padding:2px;
}

</style>