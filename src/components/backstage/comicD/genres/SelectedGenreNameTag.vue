<template>
  <div style="margin:30px 0 0 0">
    <label 
    :style="getStyleGenreButtons(genre)"
    @change="genreSelected(genre)" 
    v-for="genre in genresWithColor" :key="genre.genreId">
      <input type="checkbox" style="display:none">
      {{ genre.genreName }}
    </label>
  </div>
  <div class="input-group" style="margin:30px 0 0 0">
    <input class="form-control" v-model="inputValue">
    <button class="input-group-text" @click="handleAddGenre">+</button>
  </div>
  <div style="display:flex; justify-content:center; margin:20px 0 0 0" v-for="temp in tempAdd" :key="temp">
      <button 
        :style="getStyleNewTagButton(tempColorStorage[temp].color, tempColorStorage[temp].borderColor)"> 
        {{ temp }}
      </button>
      <input 
        :style="getStyleColorInput()" 
        type="color" 
        :id="`colorPickerBG-${temp}`" 
        v-model="tempColorStorage[temp].color"/>
      <input 
        :style="getStyleColorInput()" 
        type="color" 
        :id="`colorPickerBorder-${temp}`" 
        v-model="tempColorStorage[temp].borderColor"/>
  </div>
  <button 
  @click="handleSaveButton"
  :style="getStyleSaveButton()" > 
    Save </button>
  <button 
  @click="handleCancelButton"
  :style="getStyleCancelButton()"> 
  Cancel </button>
  
</template>

<script setup>
import {ref, watch, defineProps, defineEmits} from 'vue';
import httpClient from '@/main.js'
import Swal from 'sweetalert2';
import {useCounterStore} from '@/stores/counter'
const counterStore = useCounterStore();
const genresWithColor = counterStore.genresWithColor;
const props = defineProps(['params','showGenres', 'onGenreDraftUpdate', 'draftGenreSelectComplete']);
const emits = defineEmits(['updateGenreSelection'])
const originGenreName = ref([]);

const comicId = props.params.data.comicId;
const draftData = props.params.data.draftData;
const draftId = draftData ? draftData.draftId : null;
const tempSelection = ref([]);

if(props.params.value && props.params.value.length>0){
      originGenreName.value = props.params.value
      tempSelection.value = [...originGenreName.value]

}else if(draftData && draftData.genres.length>0){
      originGenreName.value = draftData.genres
      console.log( draftData.genres);
      tempSelection.value = [...originGenreName.value]

}else{
      originGenreName.value = []; 
      tempSelection.value = [];
}

// watch(()=>props.params.data.draftData, (newValue)=>{
//   console.log("inGenreWatch",newValue.genres)
//   if(newValue.genres.length>0){  
//     tempSelection.value = [...newValue]
//   } 
// })

if(props.params.value){
  originGenreName.value = props.params.value
  console.log("in comic")
}else if(props.params.genreNameColors){
  originGenreName.value = props.params.genreNameColors
  console.log("in draft")
}else{
  // originGenreName.value =[genreName=null,genreId="",color="",];
  originGenreName.value =[];
  console.log("in all Else")
}


const genreSelected = (genre) => {
    const index = tempSelection.value.indexOf(genre.genreName);
    if (index > -1) {
        tempSelection.value.splice(index, 1);
        getStyleGenreButtons(genre);
    } else {
        tempSelection.value.push(genre.genreName);
        getStyleGenreButtons(genre);
    }
};


let inputValue = ref('');
const tempAdd = ref([]);
const tempColorStorage = ref([])
const handleAddGenre = () => {
  if(inputValue.value){
    const newGenre = inputValue.value;
    tempAdd.value.push(newGenre);
    tempColorStorage.value[newGenre] = {color:"#7fbffa", borderColor:'#013c73',genreName:newGenre}
    tempColorStorage.value.push( tempColorStorage.value[newGenre])
    inputValue.value = '';
  }
}


const handleSaveButton = () => {
  console.log("comicId", comicId);
  console.log("draftId",draftId);
  console.log("inhandleSaveButton")
  let transformSelection = tempSelection.value.map(genreName => {return {genreName: genreName}} );
  transformSelection = transformSelection.concat(tempColorStorage.value);
  let updateData = [];
  if(comicId!= undefined){
    console.log("inComicId",transformSelection)
    updateData = [{
      comicId:comicId, 
      genreNameColor:transformSelection,
    }]
    httpClient.put("/comicD/comic/update/multiple", updateData)
    .then( res => {
      console.log(res);
      props.params.context.onRefreshTable()

    })
    .catch(err =>{
      console.log(err)
    })
  }else if(draftId != undefined){
    const genreNames = transformSelection.filter(data => data.genreName).map(data => data.genreName)
    props.draftGenreSelectComplete(genreNames);
    console.log("inGenreSelection", transformSelection)
    updateData = {
      draftData:draftData, 
      genreNameColors:transformSelection,
    }
    console.log(updateData);
    httpClient.post("/comicD/comic/drafts/update", updateData)
    .then((res)=>{
      console.log("afterInDB", res.data.genres);
      console.log("tempSelection",tempSelection.value)
    }) 
    .catch (err => {
      console.log(err);
    })   
  }else{
    emits('updateGenreSelection')
  } 
  Swal.close()
}

const handleCancelButton = () => {
  tempSelection.value = originGenreName;
  Swal.close()
}

const getStyleGenreButtons = (genre) => {
    const style = {
        margin: "10px 0 0 8px",
        padding: "3px 7px 0px 7px",
        width: "120px",
        height: "30px",
        fontSize: "16px",
        color: "white",
        borderRadius: "15px",
        textAlign: "center",
        verticalAlign: "center",
        backgroundColor: "",
        border: "",
    };
    if (tempSelection.value.includes(genre.genreName)) {
        console.log("in style",tempSelection.value)
        const genreColor = genresWithColor.find(
            (g) => g.genreName == genre.genreName
        );
        style.backgroundColor = genreColor.color;
        style.border = `2px solid ${genreColor.borderColor}`;
    } else {
        style.backgroundColor = "lightgrey";
        style.border = "2px solid darkgrey";
    }
    return style;
};

const getStyleNewTagButton = (colorBG, colorBorder) => {
    return {
        width: "100px",
        height: "30px",
        fontSize: "15px",
        backgroundColor: `${colorBG}`,
        borderRadius: "15px",
        color: "white",
        boxShadow: "0 0 2px darkgrey",
        border: `2px solid ${colorBorder}`,
    };
};

const getStyleColorInput = () => {
    return {
        width: "30px",
        height: "30px",
        border: "1px solid white",
        borderRadius: "8px",
    };
};

const getStyleSaveButton = () => {
    return {
        width: "88px",
        height: "30px",
        fontSize: "22px",
        fontWeight: "bold",
        margin: "70px 40px 10px 0",
        backgroundColor: "rgba(39, 153, 245, 0.8)",
        borderRadius: "5px",
        color: "white",
        boxShadow: "0 0 8px rgba(88, 176, 248, 0.8)",
        border: "0px",
    };
};

const getStyleCancelButton = () => {
    return {
        width: "88px",
        height: "30px",
        fontSize: "22px",
        fontWeight: "bold",
        margin: "70px 0px 10px 0",
        backgroundColor: "white",
        borderRadius: "5px",
        color: "rgba(39, 153, 245, 0.8)",
        boxShadow: "0 0 2px rgba(88, 176, 248, 0.8)",
        border: "1.8px solid rgba(88, 176, 248, 0.8)",
    };
};
</script>

<style scoped></style>
