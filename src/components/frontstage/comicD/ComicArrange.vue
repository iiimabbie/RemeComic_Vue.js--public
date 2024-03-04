<template>
    <div @scroll="handleScroll" v-if="comicLoadingComplete">
            <div class="topComic">
                <div class="textColumn">
                    <div class="comicTitle">{{ firstComic.comicTitle }}</div>
                    <div class="textBG" :class="{ textBgOthers: firstComic.comicId !== 11 }"></div>                
                </div>
                <div class="videoColumn"> 
                        
                        <img 
                        class="comicCover" 
                        :src="firstComic.comicCover" 
                        v-show="!firstComic.video"
                        />
                        <video class="video" v-show="firstComic.video" autoplay muted :key="firstComic.video">
                            <source :src="firstComic.video" />                
                            Your browser does not support the video tag.
                        </video>
                        <img class="videoBG" :src="firstComic.horizontalPhoto"/>             
                </div>
                <div class="promotionColumn">
                    <div class="promotionInnerBox">
                      <PromotionEXPO/>
                    </div>
                </div>
            </div>
        <table class="allComics">
            <tr  v-for="(group, groupIndex) in comicGroups" 
            :key="groupIndex" 
            class="group">
                <td v-for="(comic, comicIndex) in group"
                class="comic"
                @mouseenter="shiftLeft(comic.comicId,comicIndex, groupIndex)"
                @mouseleave="resetShift"
                @click="handleComicRead(comic.comicId)"
                :key="comic.comicId">
                    <span class="tags views"  v-show = "comic.comicViews">
                        <font-awesome-icon :icon="['fas', 'eye']" />
                        {{ formatToDisplay(comic.comicViews) }}
                    </span>
                    <span class="tags new" v-show = "!comic.comicViews">
                        <font-awesome-icon :icon="['fas', 'fire']" class="fireIcon" />
                        New
                    </span>
                    <img 
                        :src="comic.comicCover" 
                        :alt="comic.comicTitle" 
                        /> 
                    <div class="info" v-show="currentComicId === comic.comicId" >
                        <br>
                        <h4>{{ comic.comicTitle }}</h4>
                        <br>
                       <p> {{ comic.comicDescription }}</p>
                     </div>          
                </td> 
                
                <!-- <td class="description" v-show="currentTd">
                        {{ comicDescription }}
                </td>  -->
            </tr>
        </table>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import httpClient from '@/main.js';
import { useGenreStore } from '@/stores/genreManagement';
import PromotionEXPO from "@/views/frontstage/money/PromotionEXPO.vue";

const router = useRouter();
const genreStore = useGenreStore(); 

watch(()=> genreStore.getSelectedGenre, async (newValue)=>{
    if(newValue) {
        fetchData(newValue);
    }  
})

const comicLoadingComplete = ref(false);
const firstComic = ref({});
const comicGroups = ref([]);
const groupComics = async (comics) => {  
    firstComic.value = {};
    comicGroups.value = [];    
    if (comics == null || comics.length == 0) {
        return { firstComic: null, comicGroups: [] };
    }
    firstComic.value = comics[0];
    console.log(firstComic.value);

    //groupComics
    const comicsToGroup = comics.slice(1);
    const columnLength = 6
    const rows = Math.ceil(comicsToGroup.length / columnLength);
    for (let i = 0; i < rows; i++) {
        comicGroups.value.push(comicsToGroup.slice(i * columnLength, (i + 1) * columnLength));
    }
    comicLoadingComplete.value = true;
};


function formatToDisplay(number){
    const num = parseInt(number,10);
    if (num>=1000000){
        return Math.floor(num/1000000) + "M";
    }else if(num>10000 && num<10000000){
        return Math.floor(num/1000) + "K";
    }
}


const fetchData = (genreIds) => {
    const genreIdsFormatted = genreIds.join(",")
    httpClient.get("comicD/genre/ids", {params:{genreIds:genreIdsFormatted}})
    .then(res => {
        groupComics(res.data)
        console.log(res.data);
    })
}


const currentComicId = ref(0);
const shiftLeft = (comicId, currentComicIndex, currentGroupIndex) =>{
    const groups = document.querySelectorAll(".group");
    const currentGroup = groups[currentGroupIndex];
    const comics = currentGroup.querySelectorAll(".comic");
   
    comics.forEach((comic, index) =>{
        if(index < currentComicIndex ){
            comic.style.transform = 'translateX(-430px)'
        }      
    });
    currentComicId.value=comicId;
}

const resetShift = () =>{
    const comics = document.querySelectorAll('.comic');
    comics.forEach(comic => {
        comic.style.transform = 'none';
    });
    currentComicId.value=null;

}

const handleComicRead = (comicIdIn) =>{
    console.log(comicIdIn);
    router.push(
        { name: 'ComicRead', params:{comicId:comicIdIn}}
    );
}

</script>

<style scoped>
.topComic {
    display: flex;
    align-content: flex-end;
    margin:0 0 2% 0;
    width:130%;
    height:40%;
    /* background-color: rgb(110, 135, 247); */
    /* overflow: hidden; */

}
.textColumn{
    /* background-color:beige; */
    position:relative;
    z-index:19;
}

.comicTitle{
    position:absolute;
    top:0;
    left:10px;
    width:100px;
    color:white;
    font-size:50px;
    font-weight:bold;
    text-shadow:0 0 4px white, 0 0 3px rgb(111, 5, 5);
    /* background-color: rgb(89, 233, 103); */
    text-align:left;
    z-index:9;
}
.textBG{
    position:absolute;
    top:0;
    left:0;
    width:250px;
    height:425px;
    background: linear-gradient(
        to right,
        rgb(146, 1, 30,1),
        rgb(146, 1, 30,1),
        transparent);
    border-radius: 2%;
    z-index:8;
}

.textBgOthers{
    position:absolute;
    top:0;
    left:0;
    width:250px;
    height:425px;
    background: linear-gradient(
        to right,
        rgb(255, 191, 204),
        rgb(247, 199, 208),
        transparent);
    border-radius: 2%;
    z-index:8;
    
}

.videoColumn{
    /* background-color:rgb(226, 226, 59); */
    position:relative;
    left:6%;
    z-index:18;
    
}

.video{
    position:absolute;
    top:14px;
    left:200px;
    width:486px;
    z-index:9;
}

.videoBG{
    position:absolute;
    top:70px;
    left:8px;
    width:800px;
    max-height: 355px;
    border-radius: 2%;
    z-index:7;
}
.comicCover{
    position:absolute;
    top:0px;
    left:340px;
    right:180px;
    height:420px;
}
.promotionColumn{
    position:relative;
    left:58%;
    right:10%;
    width:18% !important;
    /*background-color:rgb(125, 124, 124) ;*/
  background-color: black;
}
.promotionInnerBox{
  position: relative;
    height:425px;

}

.allComics{
    width:100%;
}
.allComics td {
    position:relative;
    width:auto;
    padding:1px;
    text-align: center;
    vertical-align: center;
    /* overflow: hidden; */
    /* overflow-x:visible;
    overflow-y: auto;  */
    transition: transform 0.3s ease;
}


.tags{
    position:absolute;
    box-shadow: 0 0 6px black;
    border-radius:4% ;
    width:70px;
    padding:0 2px 0 2px ;}

.views{
    background-color:crimson;
}

.new{
    background-color:rgb(222, 185, 4);
    color:white;
}

.fireIcon{
    color:crimson;
}

.allComics img{
    max-width:300px;
    width:100%;
}

.info{
    position: absolute;
    top:0px;
    right:250px;
    width:400px;
    height:300px;
    overflow-y:auto;
    font-size:20px;
    color: white;
    text-align: left;
    /* transition: visibility 0s, opacity 0.3s linear; */
}
.info::-webkit-scrollbar {
    width: 8px;
}

.info::-webkit-scrollbar-track{
    background: black; 
}
.info::-webkit-scrollbar-thumb {
    background: rgb(105, 104, 104);
    border-radius: 5px;
}

</style>