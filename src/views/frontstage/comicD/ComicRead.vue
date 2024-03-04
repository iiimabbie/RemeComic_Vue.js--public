<template>
    <div class="mainContainer">
        <FrontstageHeader class=" header"/>
        <div class="episodeContainer">    
            <div class="episodeInfo">
            <table class="episodeInfoTable">
                <div class="episodeHeader">
                    <p>{{ comicTitle }}</p>
                    <img :src="comicHorizontalCover "/>                   
                </div>
                <div class="episodeSearch">
                    <button @click="handlelikesSort">
                        <font-awesome-icon :icon="['far', 'heart']"
                        :style = "likesSort ? {color:'rgba(250, 131, 174, 1)', fontSize:'24px'}:{}" />
                    </button>
                    <button @click="handlePurchaseSort">
                        <font-awesome-icon :icon="['fas', 'sack-dollar']"
                        :style = "purchaseSort ? {fontSize:'24px', color:'rgba(255, 221, 111, 1)'}:{}"/>
                    </button>
                    <button @click="handleBookMarkSort">
                        <font-awesome-icon :icon="['far', 'bookmark']"
                        :style = "bookMarkSort ? {fontSize:'24px', color:'rgba(124, 173, 252, 1)'}:{}"/>
                    </button>
                    <button @click="handleSort"
                    :style="{transform: orderSort ? 'rotate(0deg)': 'rotate(180deg)'}">
                        <font-awesome-icon :icon="['fas', 'arrow-up-wide-short']" />
                    </button>
                    <div class="line"></div>
                </div>
                <tr class="episodeList" v-for="episode in episodeData"
                :key="episode.episodeId">
                    <td :class="{'locked': episode.episodeNum > 3 && !userOrders.includes(episode.episodeId)}">
                        <!-- <div>  -->
                            <img :src="episode.episodeCover"
                            @click="episode.episodeNum <= 3 || userOrders.includes(episode.episodeId) ? fetchPageData(episode.episodeId):null"
                            class="episodeCover"
                            >
                            <img :src=lock.url :alt=lock.imageTitle
                            v-show="episode.episodeNum>3 && !userOrders.includes(episode.episodeId)"
                            @click="handleLock(episode.episodeId,episode.purchasePrice, episode.rentalPrice)"
                            class="episodeLock">
                        <!-- </div>  -->
                    </td>
                    <td class="inboxText">
                        <span class="episodeNum">Episode &nbsp; {{ episode.episodeNum }}</span>
                        <span class=bookMark
                        @click="scrollToPage(bookMarkedPage[0])" 
                        :class="{ 'bookMarkVisible': userBookMark.includes(episode.episodeId) }">
                            <font-awesome-icon :icon="['fas', 'bookmark']" />
                        </span>
                        <span class="episodeLikes" @click="handleLikes(episode.episodeId)">
                            <font-awesome-icon :icon="['fas', 'heart']"
                            :style = "userLikes.includes(episode.episodeId)?{color:'pink'}:{}"/>
                            {{ formatToDisplay(episode.episodeLikes) }}
                        </span>
                        <div
                        class="readBar"
                        :class="{ 'readBarVisible': userReadsEpisodeId.includes(episode.episodeId) }">
                            <div :style = "getReadBarStyle(episode.episodeId)"></div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div class="episodeBody">
            <div class="pageTr"
                v-for="(page, index) in episodeBody"
                style="width:80vw;"
                @mouseover="handleScroll(index, page.pageId, page.episodeId)"
                :key="page.pageId" >
                    <img :src="page.pagePhoto"
                    :id="`page${page.pageId}`">
            </div>  
            <div class="episodeFuntionContainer">
                <div class="bodyFunction"> 
                    <font-awesome-icon 
                    class=icon 
                    @click="sendBookMaked"
                    :class="{'bookMarkedPage': bookMarkedPage.includes(bodyCurrentPageId) }"
                    :icon="['fas', 'bookmark']" />
                    <img :src="caretUp.url"
                    @click="scrollToPage(firstPageOfEpisode)"/>
                    <img :src="commentToggleUrl" 
                    :class = "{'toggleComment' : commentToggle }"
                    @click="handleCommentToggle"/>   
                </div>
                <div class="comment" id="comicDescription">
                    <div class="commentTable">
                        <table>
                            <tr 
                            v-show="pageComment.length>0"
                            v-for="(comment) in pageComment" 
                            :key="comment.commentId">
                                <div class="headshot" v-show="comment.commentContent">
                                    <img :src="comment.userPhoto ? comment.userPhoto:originalFanTuan.url"/>
                                </div>
                                <td v-show="comment.commentContent">    
                                    <div class="userInfo"> {{ comment.userName }}
                                    <span class="commentDate" >{{ comment.commentDate }}</span>
                                    </div>
                                    <div class="commentContext">{{ comment.commentContent}}
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="input-group">
                        <textarea class="form-control"
                        v-model="commentInput"></textarea>
                        <button 
                        @click="sendComment"
                        class="btn btn-secondary" 
                        type="button" >comment</button>
                    </div>
                </div>
            </div>    
        </div>  
        
    </div>
</div>  
</template>

<script setup>
import {ref, nextTick, onMounted} from 'vue'
import httpClient from '@/main.js'
import {useRoute} from 'vue-router'
import {useRouter} from 'vue-router'
import {useCounterStore} from '@/stores/counter'

const counterStore = useCounterStore();
const route = useRoute();
const router = useRouter();
import Images from "@/assets/Images.json"
import FrontstageHeader from "@/components/frontstage/basic/FrontstageHeader.vue";
import Swal from 'sweetalert2';
import moment from 'moment';

const lock = Images.find(image => image.imageId == 25)
const account = Images.find(image => image.imageId == 26)
const accountEmpty = Images.find(image => image.imageId == 27)
const toggleOn = Images.find(image => image.imageId == 31)
const toggleOff = Images.find(image => image.imageId == 32)
const caretUp = Images.find(image => image.imageId == 33)
const originalFanTuan = Images.find(image => image.imageId == 3)


const isUserData = ref(false);
const userId = ref(localStorage.getItem("userId"));
const episodeData = ref();
const episodeDataOrigin = ref();
const episodeBody = ref();
const firstPageOfEpisode = ref();
const comicTitle = ref();
const comicHorizontalCover = ref('');
const comicId = ref(route.params.comicId);
const commentInput = ref("");
const addComment = ref(false);

const orderSort = ref(false);
const likesSort = ref(false);
const purchaseSort = ref(false);
const bookMarkSort = ref(false);


const userLikes = ref([]);
const episodeLike = ref(0);

const userOrders = ref([]);

const userReads = ref([]);
const userReadsEpisodeId = ref([]);
const userBookMark = ref([]);
const pageRefs = ref([]);
const progressBarRefs = ref({});
const bookMarkedPage = ref([]);
const bookMarkedToggle = ref(false);


const commentToggle = ref(false);
const commentToggleUrl = ref(toggleOn.url);
const bodyCurrentPageId = ref(0);
const currentEpisodeId = ref(0);
const pageComment =ref([]);



function formatToDisplay(number){
    const num = parseInt(number);
    if (num>=1000000){
        return Math.floor(num/1000000) + "M";
    }else if(num>1000 && num<10000000){
        let numberInThousands = num / 1000;
        return numberInThousands.toFixed(2) + "K";
    }
}


const handleLock = (episodeId, purchasePrice, rentalPrice) =>{
    let userCoin = localStorage.getItem("userCoin");
    let purchaseCoin = purchasePrice*30;
    let rentalCoin = rentalPrice*30;
    if(userId.value){
        if(userCoin > rentalCoin){
            Swal.fire({
                html:`
                <p style="font-size:24px; font-weight:bold;"> 
                    Select a Price</p>
                <div style="font-size:14px;color:lightgrey">Account Coins:</div>
                <div style="font-size:14px;color:lightgrey"> ${userCoin} </div>
                <img src=${account.url} style="max-height:58px">
                <div 
                <div style="display:flex; justify-content:center; margin:15px 0 15px 0;">
                    <div style="width:120px;">
                        <p style="font-size:22px;">Rental</p>
                        <span style="font-size:14px; color:lightgrey">        
                        </span>
                        <button id="rental" 
                        style="
                        width:100px;
                        font-size:22px;
                        border-radius:15px;
                        background-color:white;
                        color:rgba(234, 78, 122, 0.8);
                        border:2.5px solid rgba(218, 68, 110)"> 
                            ${rentalCoin} 
                        </button>
                    </div>
                    <div style="width:120px;">
                        <p style="font-size:22px;"> Purchase</p>
                        <button id="purchase"
                        style="
                        width:100px;
                        font-size:22px;
                        border-radius:15px;
                        background-color:rgba(218, 68, 110);
                        color:white;
                        border:2.5px solid rgba(240, 174, 193, 0.8)"> 
                            ${purchaseCoin} 
                        </button>
                    <div>
                </div>`,
        showCloseButton: true,
        showConfirmButton: false,
        didOpen: () => {
          let transactionInfo = {};
          let formattedTranData;
          const buttons = document.querySelectorAll('button');
          buttons.forEach(button => {
            button.addEventListener("click", (event) => {
              if (event.target.id === "rental") {
                transactionInfo = {
                  coins: rentalCoin,
                  isRental: 1,
                  episodeId: episodeId,
                }

                const rentalDate = new Date();
                rentalDate.setFullYear(rentalDate.getFullYear() + 1);

                console.log(rentalDate);

                createOrder(userId.value, episodeId, rentalDate, rentalCoin);
              } else if (event.target.id === "purchase") {
                transactionInfo = {
                  coins: purchaseCoin,
                  isRental: 0,
                  episodeId: episodeId,
                }

                const buyOutDate = new Date();
                buyOutDate.setFullYear(buyOutDate.getFullYear() + 150);

                createOrder(userId.value, episodeId, buyOutDate, purchaseCoin);
              }
              formattedTranData = JSON.stringify(transactionInfo);
              localStorage.setItem("transactionInfo", formattedTranData);
              Swal.close();
            })
          })
        }
      })
    } else if (userCoin < rentalCoin) {
      Swal.fire({
        html: `
                <br>
                <p style="font-weight:bold; font-size:24px;color:crimson" > 
                    Oh No!
                    </p>
                    <p style="font-size:20px;"> Run out of coins.Please recharge!</p>
                    <p style="
                    font-size:20px; 
                    color:brown; 
                    font-weight:bold">
                        Account Coins:</p>
                    <p style="
                    font-size:22px; 
                    color:brown; 
                    font-weight:bold"> ${userCoin} </p>
                    <img src=${accountEmpty.url} style="width:100px" margin:0 0 10px 0>
                    <br>
                    <button id=recharge
                    style="
                        width:140px;
                        font-size:24px;
                        border-radius:20px;
                        background-color:rgba(218, 68, 110);
                        color:white;
                        border:2.5px solid rgba(245, 152, 176, 1);
                        box-shadow: 0 0 6px rgba(52, 250, 252, 0.8);
                        margin:15px 0 10px 0;
                        ">
                        
                    Recharge </button> `
        ,
        showCloseButton: true,
        showConfirmButton: false,
        didOpen: () => {
          document.getElementById("recharge").addEventListener("click", () => {
            //to the recharge place;
            Swal.close();
          })
        }
      })
    }

  } else {
    Swal.fire({
      html: `<p style="font-size:22px"> Please Login`,
      confirmButtonText: "login",
      showCancelButton: true,
      showCloseButton: true,
    })
    .then(res=>{
            if(res.isConfirmed){
                counterStore.login();
            }else{
                Swal.close();
            }
        })
    }
}

const handleSort = () =>{
    orderSort.value = !orderSort.value;
    if(orderSort.value){
        episodeData.value.sort((a, b) => b.episodeNum - a.episodeNum);
    }else{
        episodeData.value.sort((a, b) => a.episodeNum - b.episodeNum);
    }
}

const handleSelectedSort = () =>{
    let selectionSort = [];
    if (likesSort.value && !selectionSort.includes("like")) {
        selectionSort.push("like");
    } else {
        selectionSort = selectionSort.filter(sort => sort !== "like");
    }

    if (purchaseSort.value && !selectionSort.includes("purchase")) {
        selectionSort.push("purchase");
    } else {
        selectionSort = selectionSort.filter(sort => sort !== "purchase");
    }

    if (bookMarkSort.value && !selectionSort.includes("bookMark")) {
        selectionSort.push("bookMark");
    } else {
        selectionSort = selectionSort.filter(sort => sort !== "bookMark");
    }
    if(selectionSort.length == 0){
        console.log(selectionSort);
        console.log(episodeDataOrigin.value);
        episodeData.value = episodeDataOrigin.value;
    }else if(selectionSort.length > 0){
        console.log(selectionSort);
        handleAllSort(selectionSort)
    }
}


const handleAllSort = (selectionSort) =>{
    let selection = [...episodeDataOrigin.value];
    selectionSort.forEach((sort)=>{
        if(sort=="like"){
            console.log("inLike")
            selection = selection
        .filter(ep => userLikes.value.includes(ep.episodeId))

        }
        if(sort=="purchase"){
            selection = selection
        .filter(ep => userOrders.value.includes(ep.episodeId))
        }
        if(sort=="bookMark"){
            selection = selection
        .filter(ep => userBookMark.value.includes(ep.episodeId))
        }
    })
    episodeData.value = selection;
    console.log(episodeData.value);

}


const handlelikesSort = () =>{
    likesSort.value = !likesSort.value;
    handleSelectedSort();
}

const handlePurchaseSort = () =>{
    purchaseSort.value = !purchaseSort.value;
    handleSelectedSort();
}

const handleBookMarkSort =  () =>{
    bookMarkSort.value = !bookMarkSort.value;
    handleSelectedSort();
}


const handleReadBar = (episodeId) => {
    //let localRead = JSON.parse(localStorage.getItem("userReads"));
    const read = userReads.value.find(r => r.episodeId === episodeId);
    if (read) {
        const readPercentTemp = Math.round((read.maxPageNum / read.totalPage) * 240);
        console.log(readPercentTemp)
        return readPercentTemp > 222 ? 240 : readPercentTemp;
    }
    return 0;
}

const getReadBarStyle = (episodeId) => {
    const readPercent = handleReadBar(episodeId);
    return {
        position: 'absolute',
        top: '2.9px',
        left: '2px',
        height: '5px',
        width: readPercent + 'px',
        borderRadius: '5px',
        backgroundColor: 'rgb(247, 122, 182)',
        zIndex: 9,
        transition: 'width 0.5s ease-out'
    };
}


const handleLikes = (episodeId)=>{
    episodeLike.value = episodeLike.value === 0 ? 1 : 0 ;
    console.log(userLikes.value)
    if(episodeLike.value && !userLikes.value.includes(episodeId)){
        console.log("addLike")
        userLikes.value.push(episodeId);
    }else{
        console.log("removeLike")
        userLikes.value = userLikes.value.filter(likeEpisodeId => likeEpisodeId !== episodeId)
        console.log(userLikes.value)
    }

    const updateData = {
        userId:userId.value,
        episodeId:episodeId,
        episodeLike:episodeLike.value,
    }
    console.log(updateData);
    httpClient.post("/comicD/episode/rating/like", updateData)
    .then(res=>{
        localStorage.setItem("userLikes", JSON.stringify(userLikes.value));
    })
    .catch(err=>{
        console.log(err)
    })

}

const handleScroll = (index,pageId) =>{
    bodyCurrentPageId.value = pageId;
    console.log(episodeBody.value);
    console.log("in scroll",addComment.value);
    const page = episodeBody.value.find(page => page.pageId ==  pageId ) //
    if(addComment.value){
        console.log("addComment");
        page.userComments = [...pageComment.value];
        addComment.value=false;
    }
    else if (page && !commentToggle.value) {
        pageComment.value = [...page.userComments]; 
    }
    else {
        pageComment.value = []; 
    }
    console.log(pageComment.value);


    const totalPage = episodeBody.value.length;
    if(!pageRefs.value.includes(pageId)){
        pageRefs.value.push(pageId)
    }
    if(userId && index%3==0 && index!==0 || index == totalPage ){
        const updateData = {
            userId:userId.value,
            pageIds:pageRefs.value,
        }
        console.log(updateData);
        httpClient.post("/comicD/comic/read/save", updateData)
        .then((res)=>{
            fetchUserData(comicId.value,userId.value);
            //getReadBarStyle(episodeId);
            pageRefs.value=[];
        })
    }

}

// const debouncedHandleScroll = debounce(handleScroll, 200);
let counter = 0;
const scrollToPage = (pageId) => {
  const element = document.getElementById(`page${pageId}`);
  console.log(element);
  if (element) {
    console.log("inScrollElement")
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  else if(!element && counter<=2){
    counter ++;
    console.log(`no Element call${counter}`);
    setTimeout(()=> scrollToPage(pageId), 300)
    }
}


const handleCommentToggle = () =>{
    commentToggle.value = !commentToggle.value;
    console.log(commentToggle.value);
    if(commentToggle.value){
        commentToggleUrl.value =  toggleOff.url;
        pageComment.value = [];
    }
    else if(!commentToggle.value){
        commentToggleUrl.value =  toggleOn.url;
        
    }
    

}

// const handlePageScroll = () => { 
//     console.log("inPageScroll")
    
// }



const fetchData = (comicId) =>{
    httpClient.get("/comicD/comic/simpleEpisode", {params:{comicId:comicId}})
    .then(res =>  {
        episodeData.value = res.data;
        episodeDataOrigin.value = res.data;
        comicTitle.value = res.data[0].comicTitle;
        comicHorizontalCover.value = res.data[0].horizontalPhoto;

        const firstEpisodeId = res.data.find(ep => ep.episodeNum == 1)
        .episodeId
        fetchPageData(firstEpisodeId);  
    })
    .catch(err=>{
        console.log(err);
      })
}

const fetchPageData = (episodeId) =>{
    currentEpisodeId.value = episodeId;
    httpClient.get("/comicD/episode/body", {params:{episodeId:episodeId, userId:userId.value}})
    .then(res=>{
        console.log(res.data)
        bookMarkedPage.value = res.data
        .filter(page => page.isBookMarked == 1)
        .map(page =>page.pageId);

        /*console.log(bookMarkedPage.value[0]);
        if(bookMarkedPage.value){
            nextTick(()=>{
                // scrollToPage(bookMarkedPage.value);
            })   
        }*/
        res.data.forEach((ep)=>{
            ep.userComments.forEach((comment)=>{
                comment.commentDate = 
                    moment(comment.commentDate).fromNow();
            })
        })
        pageComment.value = !commentToggle ? res.data[0].userComments : [];
        episodeBody.value = res.data ;
        let firstPage = res.data.find(ep => ep.pageNum=1)
        firstPageOfEpisode.value = firstPage.pageId
        console.log(firstPageOfEpisode);
        
    })
    .catch(err=>{
        console.log(err);
      })
}

const fetchUserData = (comicId, userId) =>{
    httpClient.get("/comicD/episode/user/data", {params:{comicId:comicId, userId:userId}})
    .then(res=>{
       console.log(res.data.userOrders)
       userLikes.value = res.data.userLikes;
       userOrders.value = res.data.userOrders;
       userReads.value = res.data.userReads;
    //    localStorage.setItem("userLikes", JSON.stringify([...res.data.userLikes]));
    //    localStorage.setItem("userOrders", JSON.stringify([...res.data.userOrders]));
    //    localStorage.setItem("userReads", JSON.stringify(res.data.userReads));

       userReadsEpisodeId.value=res.data.userReads.map(read => read.episodeId);
    //    handleReadBar();
       userBookMark.value=res.data.userReads.filter(read => read.isBookMarked == 1).map(read => read.episodeId);
       
    })
    .catch(err=>{
        console.log(err);
    })
}

const sendBookMaked = ()=>{
    bookMarkedToggle.value = !bookMarkedToggle.value;
    let isBookMarked = bookMarkedToggle.value ? 1 : 0;
    if(isBookMarked){
        bookMarkedPage.value.push(bodyCurrentPageId.value);
        userBookMark.value.push(currentEpisodeId.value);
    }else{
        bookMarkedPage.value = bookMarkedPage.value.filter(pageId => pageId != bodyCurrentPageId.value)
        userBookMark.value = userBookMark.value.filter(episodeId => episodeId != currentEpisodeId.value)
    }
    const updateData={
        userId:userId.value,
        pageId:bodyCurrentPageId.value,
        isBookMarked: isBookMarked       
    }
    httpClient.post("/comicD/episode/read/bookmark", updateData)
    .then((res)=>{       
        
    })
    .catch ((err)=>{
        console.log(err);
    })
}



const sendComment = ()=>{
    console.log("commentInput",commentInput.value);
    const updateData={
        userId:userId.value,
        pageId:bodyCurrentPageId.value,
        commentContent:commentInput.value
    }
    httpClient.post("/comicD/page/comment", updateData)
    .then((res)=>{
        res.data.commentDate = 
            moment(res.data.commentDate).fromNow();
        pageComment.value = [res.data, ...pageComment.value];
        addComment.value = true;
        console.log("comicData", res.data); 
        commentInput.value="";
        
        
    })
    .catch ((err)=>{
        console.log(err);
    })
}





async function createOrder(userId, episodeId, dueDate, price) {
  const url = `/money/orders/create?userId=${userId}`;

  try {
    await httpClient.post(url, {
      "episodeId": episodeId,
      "dueDate": dueDate,
      "price": price
    });

    await Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Order created successfully'
    });

    console.log('Order created successfully');
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error creating order'
    });

    console.error('Error creating order:', error.message);
  }
}

onMounted(()=>{
    if(comicId.value){
        fetchData(comicId.value, 1);
    }
    if(userId.value){
        fetchUserData(comicId.value, userId.value);
    }
   
});


</script>

<style scoped>
.mainContainer{
    position:fixed;
    width:100vw;
    height:100vh;
    /* overflow: hidden; */
    background: black;
}

.header{
    position:fixed;
    z-index:29;
}

.episodeContainer {
  position: fixed;
  left:6%;
  top: 60px;
  z-index: 9;
}

.episodeInfo{ /*this is table*/
    background-color:rgba(38, 37, 37, 0.8);
    position: relative;
    top:20px;
    left:0;
    width:400px;
    height:87vh;
    overflow-y: auto;
    overflow-x: hidden;
} 

.episodeInfo::-webkit-scrollbar {
    width: 8px;
    height:10px;
}

.episodeInfo::-webkit-scrollbar-track {
    background: black; /* color of the track */
}

.episodeInfo::-webkit-scrollbar-thumb {
    background: rgb(103, 103, 103);
    border-radius: 5px;
}

.episodeInfo::-webkit-scrollbar-thumb:hover {
    background: rgb(114, 114, 114); /* color of the track */
}


.episodeInfoTable td{
    position:relative;
    top:290px;
    z-index:8;
}
.episodeHeader{
    position:fixed;
    width:390px;
    height:250px;
    background-color:rgb(12, 12, 12);
    z-index:19;
}
.episodeHeader img{
    position:absolute;
    top:18%;
    left:0%;
    width:358px;
    border-radius:5px;
    z-index:19;
}
.episodeHeader button{
    position:absolute;
    top:105%;
    left:86%;
    background-color:transparent;
    border: 0px;
    color:white;
    font-size:25px;
    z-index:19;
}
.episodeHeader p{
    position:absolute;
    /* top:0%;
    left:0%; */
    font-size:30px;
    color:white;
    z-index:19;
}

.episodeSearch{
    position:fixed;
    top:32%;
    width:360px;
    height:40px;
    z-index:19;
    text-align: right;
}

/* .episodeSearch .line{
    position:fixed;
    top:10%;
    height:20px;
    background-color:rgba(249, 247, 248, 0.467);
} */
.episodeSearch button{
    width:50px;
    height:100%;
    background-color:transparent;
    border:0px;
    color:white;
    opacity: 0.8;
    font-size:20px;
}
/* .episodeSearch img{
    position:relative;
    top:-1px;
    height:82%;
} */

.episodeSearch button:hover{
    cursor:pointer;
    transform: scale(1.2);
}


.episodeList{
   position:relative;
   top:-38px;
   left:-10px;
   color:white;
}

.episodeCover{
    position:relative;
    left:10px;
    height:100px;
    z-index:8;
    
}

.locked .episodeCover {
  opacity: 0.4;
}

.episodeLock{
    position:absolute;
    top:35%;
    left:35%;
    z-index:9;
    filter: brightness(1.3);
    /* box-shadow: 0 0 5px rgb(159, 241, 255);  */
}

.transButton {
  border-radius: 20px;
  background-color: pink;
  color: brown;
}
.inboxText{
    position:relative;
    top:0px;
    left:5%;
    width:350px;
    padding:5px 0 0 0;
    /* background-color: rgb(24, 155, 155); */
}

.episodeNum{
    position:absolute;
    top:30%;
    left:0px;
    width:120px;
    /* background-color: rgb(245, 9, 115); */
    font-size:20px;
}

.bookMark{
    position:absolute;
    top:30%;
    left:108px;
    color:rgba(109, 138, 246, 0.9);
    width:20px;
    /* background-color: rgb(38, 37, 38); */
    font-size:20px;
    opacity:0;
    transform: translateX(-10px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.bookMarkVisible{
    opacity:1;
    transform: translateY(0);
}
.bookMark:hover{
    cursor:pointer;
    transform: scale(1.5);
}
.episodeLikes{
    position:absolute;
    top:34%;
    left:180px;
    width:100px;
    color: rgb(255, 251, 253);
    /* background-color: rgb(9, 64, 245); */
}
.episodeLikes:hover{
    transform:scale(1.1);

}

.readBar{
    position:absolute;
    top:80%;
    width:245px;
    height:10px;
    border-radius:5px;
    opacity: 0;
    transform: translateX(-10px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    background-color: rgba(218, 226, 247, 0.5);
    z-index:8;
}

.readBarVisible{
    opacity: 1;
    transform: translateY(0);
}
/* .readBar>div{
    position:absolute;
    top:2.9px;
    left:2px;
    height:5px;
    border-radius:5px;
    background-color: rgb(247, 122, 182);
    z-index:9;
    transition: width 0.5s ease-out;
} */

.episodeReadBar{
    position:relative;
    top:0px;
    left:-60%;
    background-color: rgb(9, 64, 245);

}

.pageTr img{
    width:50%;
    object-fit: contain;
}
/* .pagePhoto{
    width:100%;
} */
.episodeBody{
    position:absolute;
    width:40vw;
    top:50px;
    left:137%;
    height:84vh;
    background-color: rgb(4, 4, 4);
    overflow-y: scroll;
    overflow-x: hidden;
    z-index:99;
}


.episodeBody::-webkit-scrollbar {
    width: 8px;
}

.episodeBody::-webkit-scrollbar-track {
    background: black; /* color of the track */
}

.episodeBody::-webkit-scrollbar-thumb {
    background: rgb(151, 151, 151);
    border-radius: 5px;
}

.episodeBody::-webkit-scrollbar-thumb:hover {
    background: rgb(114, 114, 114); /* color of the track */
}

.episodeFuntionContainer {
  position: fixed;
  top:80px;
  bottom:0%;
  left: 74%;
  width:20vw;
  height:90vh;
  /* background-color: rgb(247, 184, 184); */
}

.bodyFunction{
    position:relative;
    left:8%;
    display: flex;
    margin:20px 0 20px 0;

}

.bodyFunction .icon{
    position:relative;
    top:4px;
    left:0;
    color:rgb(236, 235, 235);
    opacity:0.7;
    font-size: 31px;
    margin: 0px 20px 0 0;
    cursor: pointer;
}

.bodyFunction .icon.bookMarkedPage{
    color:rgba(126, 152, 249, 1);
    background: radial-gradient(circle at center, white, transparent);

}


.bodyFunction img{
    position:relative;
    top:0%;
    height:40px;
    cursor: pointer;
    filter: brightness(1.1);
    transition: transform 0.7s ease-in-out, opacity 0.2s ease-in-out;
    will-change: transform, opacity;
    margin: 0 15px 0 0; 
    /* background-color: transparent;
    border:0px; */
}
.bodyFunction .toggleComment {
    transition: transform 0.6s, opacity 0.2s ease-in-out;;
    /* filter: brightness(0.8); */
    opacity:0.7;
}

.comment {
    width:100%;
    z-index:19;
    position:relative;
    left:8%;

}
.commentTable{
    position:relative;
    top:0px;
    left:0;
    height:500px;
    background-color: rgb(63, 63, 63);
    background-image: linear-gradient(to top,rgb(2, 2, 2), 
    rgba(5, 2, 100, 0.396));
    border-radius:20px ;
    overflow-y:auto;
    overflow-x:hidden;

}
.commentTable::before{
    content: '';
    position: absolute;
    /* top: -5px; left: -5px; right: -5px; bottom: -5px; slightly larger than the element */
    filter: blur(10px);
    background: inherit;
    z-index: -1;
}

.commentTable::-webkit-scrollbar{
    width:0px;
}
.commentTable::-webkit-scrollbar-track{
    background: black;
}
.commentTable::-webkit-scrollbar-thumb {
    background: rgb(151, 151, 151);
    border-radius: 5px;
}

.commentTable::-webkit-scrollbar-thumb:hover {
    background: rgb(114, 114, 114); /* color of the track */
}


.commentTable table{
    width:100%;
    margin:5px 5px 10px 5px;
    /* background-color: beige; */
}

.commentTable td{
    position: relative;
    left:10px;
    width:90%;
    color: white;
    font-size:20px;
    /* background-color: rgb(186, 204, 251); */
    transition: transform 1s ease-in;
}
.headshot {
    margin:2px 0px 0 0px;
    width:32px;
    height:32px;
    border-radius:16px;
    background: rgb(177, 192, 206);
}
.headshot img{
    width: 100%;
    height: 100%;
    border-radius: 16px; 
    object-fit: cover;
}
.userInfo{
    color:rgb(250, 230, 233);
    font-weight:bold;
}
.commentDate{
    margin:0 0 0 10px;
    color:rgb(189, 189, 189);
    font-size:16px;

}

.comment .input-group{
    position:absolute;
    top:106%;
    /* bottom:-25%; */
}

.comment textarea{
    height:120px;
    background-color: black;
    color:white;
    font-size:22px;
    border:2.5px solid rgb(237, 34, 132);
}
.comment button{
    width:28%;
    background-color:lightpink ;
    color:rgb(237, 34, 132);
    border:2.5px solid rgb(237, 34, 132);
    font-size:19px;
    font-weight:bold;
}


</style>