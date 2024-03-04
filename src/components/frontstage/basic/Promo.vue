<template>
    <table class="promoContainer">
      <tr>
          <td class="imgTd">
            <img :src="promoSpeaker.url" :alt="promoSpeaker.imageTitle">
          </td>
          <td class="textTd" >
            <span class="promo-text-container">
                <span class="promo-item" v-for="promo in promos" :key="promo.promotionId">
                    <!-- <font-awesome-icon class="promoIcon" :icon="['fas', 'hand-peace']" rotation=90 /> -->
                    <span> &nbsp; {{promo.promotionName}} </span>
                </span>  
            </span>
          </td>
        </tr>
      </table>
</template>

<script setup>
import {ref} from 'vue'
import Images from '@/assets/Images.json'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const promoSpeaker = Images.find(image => image.imageId == 11);

const promos = ref([{promotionId:1,promotionName:"Free Comics to Read"}, {promotionId:2,promotionName:"New Comic Get Free Reading Pass!!"}]);
/*fetch('http://localhost:8080/remecomic/money/promotion/findAll')
.then(res => res.json())
.then(data => promos.value = data)
.catch(err => console.log(err.message()))*/

</script>

<style scoped>
.promoContainer{
  width:357px;
  height:50px;
  overflow-x:scroll;
  white-space: nowrap;  
  /* background-color: blue; */
  
}

.imgTd{
  max-width:11px;
  padding:20px 0 0 0;
  text-align: left;
  vertical-align: bottom;
  /* background-color: rgb(78, 78, 187); */
}

.textTd{
  max-width:105px;
  padding:20px 10px 0 0;
  vertical-align: bottom;
  /* background-color: rgb(185, 78, 187); */
  overflow: hidden;
}

.promoContainer img{
  width:40px;
}

@keyframes spin-and-color {
  0% {
    transform: rotate(-270deg);
    color: white;
  }
  50% {
    color: rgb(255, 67, 121);
    transform:scale(1.2);
  }
  100% {
    transform:scale(1.0);
    transform: rotate(360deg);
    color: rgb(255, 239, 243);
  }
}

@keyframes enlarge-text {
  0% {
    color: white;
    font-size:16.5px
  }
  50% {
    color: rgba(241, 64, 126, 0.788);
    font-size:17px
  }
  100% {
    font-size:16px;
    color: white;
  }
}

.promoIcon{
    color: rgba(200, 155, 181, 0.8);
    margin:0 5px 0 0;
    animation:spin-and-color 1s ease-in-out;
    animation-fill-mode: forwards;
}

.promo-item>span{
    color:white;
    animation:enlarge-text 1s ease-in-out;
    animation-fill-mode: forwards;
}
.promo-item>span:hover{
    cursor:pointer;
    background-color:rgb(160, 160, 118);
}


</style>