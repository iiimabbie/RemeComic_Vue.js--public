<template>
    <div class="frontpageContainer">


 <div class="center">
   <h1 class="white">Add Comic Body</h1>
   <form @submit.prevent="addOrgComicBody">

     <label for="comicId" class="white">Comic Id:</label>
     <input v-model="orgComicBodyDto.comicId" id="comicId" required /><br><br>


<label for="comicEpisode" class="white">Comic Episode:</label>
     <input v-model="orgComicBodyDto.comicEpisode" id="comicEpisode" required /><br><br>

     <label for="comicBodyPhoto" class="white">Comic Body Photo:</label>
     <input v-model="orgComicBodyDto.comicBodyPhoto" id="comicBodyPhoto" required /><br><br>

     <button type="submit">Add Comic</button><br><br>

   </form>
 </div>
</div>

</template>

<script setup>
// import HorizontalNavBar from '@/components/frontstage/basic/HorizontalNavbar.vue'
// import Test from'@/components/frontstage/comicD/Test.vue'
import Promo from '@/components/frontstage/basic/Promo.vue'
import Logo from '@/components/frontstage/basic/Logo.vue'
import Search from '@/components/frontstage/comicD/Search.vue'
import ForumBar  from '@/components/frontstage/basic/ForumBar.vue'
import MyComicBar from '@/components/frontstage/basic/MyComicBar.vue'
import HelpCenterBar from '@/components/frontstage/basic/HelpCenterBar.vue'
import UserBar  from '@/components/frontstage/basic/UserBar.vue'
import OrderBy from '@/components/frontstage/comicD/OrderBy.vue'
// import Genre from '@/components/frontstage/comicD/Genre.vue'
// import ComicArrange from '@/components/frontstage/comicD/ComicArrange.vue'
import {ref} from 'vue'
import axios from 'axios'


const orgComicBodyDto = ref({
 comicId: '',
 comicEpisode: '',
 comicBodyPhoto: '',
});

const addOrgComicBody = () => {
 axios.post('http://localhost:8080/remecomic/comicbody/add', orgComicBodyDto.value)
   .then(response => {
     alert('Comic successfully added');
   })
   .catch(error => {
    alert('Error adding comic', error);
   });
};
</script>

<style>
.center {
 text-align: justify; 
}
.frontpageContainer{
 background-color:black;
 display: flex;
 flex-direction: column;
 align-items: center;
 min-height: 2000px; 
}
.row {
 width: 800px;
}
.row1 {
 width: 100%;
 position: fixed;
}
.logo {
 position: absolute;
 margin: 8px 0 0 5px;
}
.promo {
 position: absolute;
 top: 33px;
 left: 130px;
}
.promo::-webkit-scrollbar {
 display: none;
}
.searchButton {
 position: absolute;
 top: 32.5px;
 left: 36%;
}

.myComicBar {
 position: absolute;
 top: 36px;
 left: 38%;
}
.forumBar {
 position: absolute;
 top: 25px;
 left: 90%;
}
.helpCenterBar {
 position: absolute;
 top: 36px;
 left: 43.6%;
}
.userBar {
 position: absolute;
 top: 35px;
 left: 46%;
}
.row4 {
 position: absolute;
 top: 100px;
}
.comicArrange {
 z-index: 0;
}
.orderBy {
 position: absolute;
 top: 40%;
 left: 9%;
 z-index: 3;
}
.genre {
 position: fixed;
 top: 0px;
 z-index: 1;
}
.horizontalNavBar {
 position: fixed;
 top: 30%;
 right: 0%;
}
.borderLine {
 background-color: white;
 width: 100%;
 height: 1.6px;
 position: fixed;
 top: 400px;
}
.white {
 color: white;
}
ul > li {
 color: white;
}
.bgc-black {
 background-color: black;
}
.indent-2 {
 text-indent: 2em;
}
.flex {
 display: flex;
}
.jcc {
 justify-content: center;
}
.jcfs {
 justify-content: flex-start;
}
ul > li {
 margin: 5px 5% 5px 5px;
}
p{
   color: black;
}
</style>