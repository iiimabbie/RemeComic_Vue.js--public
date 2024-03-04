<template>
    <button @click="goToMyBooks" class="myComicsButton">
      <font-awesome-icon class="myComicBar" :icon="['fas', 'book-bookmark']"/>
    </button>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {useRouter} from "vue-router";
import {watch, defineProps} from 'vue';
const props = defineProps(["buttonClicked"]);
const emits = defineEmits(["emitClickEvent"])

watch(()=> props.buttonClicked, (newValue)=>{
  if(newValue){
    goToMyBooks();
  }
})
const router = useRouter(); 

const goToMyBooks = () => {
  console.log("clicked me")
  router.push("/frontstage/money/myBooks/");
}
</script>

<style>
.myComicBar{
  font-size:18px;
  color:white;
}
.myComicsButton{
  border:0px;
  background-color:transparent;
}

</style>