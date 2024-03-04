<template>
  <CouponAnnounce/>
  <body>
    <FrontstageHeader 
    class=" frontstageHeader"
      v-show="isFrontpageNavBarVisible"
      :isGenreNavBarVisible="isGenreNavBarVisible"/>    
      <table class="mainTable" >
        <tr>
          <td class="leftSideBar">
            <SideComponents class="sideComponent"/>
            <OrderBy class="orderBy" />   
          </td>
          <td rowspan="2" class="mainLeft">
            <ComicArrange class="comicArrange"/>  
          </td>
          <td class="sideMargin"></td>
        </tr> 
        <tr>
          <td></td>
        </tr>   
      </table>
    </body>
</template>

<script setup>
import FrontstageHeader from '@/components/frontstage/basic/FrontstageHeader.vue'
import SideComponents from '@/components/frontstage/basic/SideComponets.vue'
import OrderBy from '@/components/frontstage/comicD/OrderBy.vue'
import ComicArrange from '@/components/frontstage/comicD/ComicArrange.vue'
import {ref, onMounted} from 'vue'
import CouponAnnounce from "@/components/frontstage/money/CouponAnnounce.vue";

const isGenreNavBarVisible = ref(true);
const isFrontpageNavBarVisible = ref(true);
// const handleScroll = () => {
//   if(window.scrollY > 80){
//     isFrontpageNavBarVisible.value = false;
//   }else{
//     isFrontpageNavBarVisible.value = true;
//   }
// }

const handleMyComicClick = ()=>{
  console.log("clickedMe")
  buttonClicked.value = !buttonClicked.value;
}


// onMounted(()=>{
//   window.addEventListener('scroll', handleScroll)
// })

</script>

<style scoped>
body{
  background-color: black;
  z-index:0;
}

::-webkit-scrollbar {
    width: 4px;
    background-color: #232323; /* Light grey background */
}

::-webkit-scrollbar-thumb {
    background-color: #ec99b5; /* Darker grey thumb */
    border-radius: 5px;
}
.frontstageHeader{
  position:fixed;
  background-color: black;
  z-index:20;
  width:100vw;

}

.mainTable{
  position:relative;
  top:120px;
  height:80%;
  /* width:98vw; */
  background-color: black;
  overflow: hidden;
}

.leftSideBar{
  position:relative;
  top:0;
  left:0;
  width:27%;
  /* background-color: brown; */
}
.sideComponent{
  position:absolute;
  top:20%;
  left:7%;
  right:16%;
  bottom:20%;
}
.orderBy{
  position:absolute;
  top:0px;
  left:500px;
  background-color: #ec99b5;
}

.mainLeft{
  width:80%;
  /* background-color: cadetblue; */
}

.comicArrange{
  z-index:10;
}

</style>