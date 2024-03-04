<template>
    <ul>
      <li @click="handleSelect" :class="{active : isSelected}">
        Comics
      </li>
      <!-- <router-link to="/frontstage/orgcomic/orghome"> -->
      <li @click="handleSelect" :class="{active : !isSelected}" >
        Original
      </li>
    <!-- </router-link> -->
    </ul>
</template>
ß
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const isSelected = ref(false);
const router = useRouter()
const handleSelect = ()=>{
  isSelected.value = !isSelected.value;
  if(!isSelected.value){
    router.push("/frontstage/orgcomic/orghome");
  }
}

onMounted(()=>{
 isSelected.value =true
})
  
</script>



<style scoped>
.genreContainer{
  width:600px;
}
li{
  display:flex;
  justify-content: center;
  list-style-type: none;
  color:rgb(191, 191, 191) ;
  font-size: 24px;
}

li:hover{
  cursor: pointer;
  font-weight: bold;
  transform: scale(1.5);
  color:white;
  text-shadow: 0 0 8px rgb(154, 233, 246), 0 0 10px rgb(166, 236, 247)
}
.active {
  font-weight: bold;
  transform: scale(1.2);
  color:rgba(254, 254, 254, 1) !important;
  text-shadow: 0 0 4px rgb(154, 233, 246), 0 0 6px rgb(166, 236, 247);
}
</style>


