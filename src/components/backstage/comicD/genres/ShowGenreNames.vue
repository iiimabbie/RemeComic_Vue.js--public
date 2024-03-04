<template>
  <div class="genreNamesContainer">
    <button  
     class="btn"
      @click="popUpSelections" 
      @updateSelection="handelUpadteSelection" 
      v-for="genre in props.params.value" :key="genre"
      :style="getStyle(genre)">
      {{ genre }}
  </button>
  </div>
  
</template>

<script setup>
import { ref, defineProps, createApp} from 'vue';
import { useCounterStore } from '@/stores/counter';
import SelectedGenreNameTag from '@/components/backstage/comicD/genres/SelectedGenreNameTag.vue';
import Swal from 'sweetalert2';
const counterStore = useCounterStore();
const props = defineProps(['params']);
const genresWithColor = ref(counterStore.genresWithColor);
const popUpSelections = () => {
    Swal.fire({
        title:`Genre Selections`,
        html: `
          <span style:"color:lightGrey">Comic Title:</span>
          <br>
          ${props.params.data.comicTitle}
          <div id="genreList"></div>`,
        showConfirmButton: false,
        showCancelButton: false,
        didOpen: () => {
          const container = document.getElementById('genreList');
          createApp(SelectedGenreNameTag,{
            genresWithColor:genresWithColor,
            params:props.params,
          }).mount(container);
          //How to give data through the newly created App
        }
    })

}


const handelUpadteSelection = ()=>{
  console.log(tempSelection.value)
  showGenres.value = tempSelection.value;
}


const getStyle = (genreName) => {
    const genreColor = genresWithColor.value.find(g => g.genreName === genreName);
    return {
      margin: '0 0 0 8px',
      padding: '0 7px 2px 7px',
      height: '30px',
      fontSize: '13px',
      color: 'white',
      backgroundColor: `${genreColor ? genreColor.color : 'lightgrey'}`,
      border: `2px solid ${genreColor ? genreColor.borderColor : 'darkgrey'}`,
      borderRadius: '15px',
      textAlign: 'center',
      verticalAlign: 'center'
    };
  };

</script>

<style scoped>
.genreNamesContainer{
  overflow-x:scroll;

}
</style>