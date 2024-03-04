<template>
  <header class="frontpageHeader">    
      <table class="rightBar">
        <tr>
          <td class="logotd"><Logo class="logo"/></td>
          <td class="promoTd"><Promo class="promo" v-show="props.isGenreNavBarVisible"/></td>
        </tr>
      </table>
      <div class="genreNavBar">
          <GenreNavBar  v-if="props.isGenreNavBarVisible"/>
          <div  v-if="!props.isGenreNavBarVisible" class="spaceTemp" 
          ></div>
      </div>
      <table class="leftBar" >
        <tr>
          <td><ChatBar class="chatButton" /></td>
          <td><Search class="searchButton" /></td>
          <td> <MyComicBar class="myComicBar" /></td>
          <td> <HelpCenterBar class="helpCenterBar" /></td>
          <td> <ForumBar class="forumBar" /></td>
          <td><UserBar class="userBar" /></td>
        </tr>
      </table>
  </header>
</template>

<script setup>
import Promo from "@/components/frontstage/basic/Promo.vue";
import Logo from "@/components/frontstage/basic/Logo.vue";
import Search from "@/components/frontstage/comicD/Search.vue";
import ForumBar from "@/components/frontstage/basic/ForumBar.vue";
import MyComicBar from "@/components/frontstage/basic/MyComicBar.vue";
import HelpCenterBar from "@/components/frontstage/basic/HelpCenterBar.vue";
import UserBar from "@/components/frontstage/basic/UserBar.vue";
import GenreNavBar from '@/components/frontstage/comicD/GenreNavbar.vue'
import {defineProps} from 'vue';
import ChatBar from "@/components/frontstage/basic/ChatBar.vue";
const props = defineProps(["isGenreNavBarVisible"])


</script>

<style scoped>
.frontpageHeader {
  display: grid;
  background-color: black;
  /*margin: 10px;*/
  padding:10px;
  width:100vw;
  grid-template-columns: 1fr 4fr 1fr; 
  gap: 10px;
  z-index:9999 !important;
}
.rightBar{
  /* background-color: rgb(65, 201, 255); */
  vertical-align: bottom;
}
.logotd{
  width:80px;
  position:relative;
  left:2%;
  text-align: left;
  /* padding:0 80px 0 0; */
}

.promoTd{
  position:relative;
  left:3%;
  width:200px;
  text-align: left;
  padding:0 20px 0 0;
}

.promo::-webkit-scrollbar {
  display: none;
}

.genreNavBar{
  /* background-color: rgb(255, 0, 225) ; */
  position:relative;
  width:40vw;
  left:5%;
  vertical-align: bottom;
}
.spaceTemp{
  width:40vw;
}

.leftBar{
  margin:0 25% 0 0;
}

.leftBar td{
  padding:0px 30px 8% 0;
  width:20px;
  /* background-color: red ; */
  vertical-align: bottom;
}

</style>
