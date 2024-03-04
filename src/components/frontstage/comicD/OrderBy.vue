<template>
  <table class="comicSortTable">
    <td class="comicSort">
        <!--  v-for="order in orders" :key="order.id"<input @change="handleCheckBoxChange(order.id)"  type="checkbox" :id="`order${order.id}`"> -->
        <label @click="handleMySpecial"> MySpecial</label>
        <font-awesome-icon  :style="{
            color: comicRecom.length == 0 ? 'white' : 'rgba(64, 155, 249, 1)', 
            transform: comicRecom.length == 0 ? 'rotate(0deg)' : 'rotate(180deg)'
        }" 
        :icon="['fas', 'person-rays']" />
    </td> 
  </table>
  <div class="recommandContainer" v-show="comicRecom.length>0">
    <table class="recommand" >
        <tr v-for="comic in comicRecom" :key="comic.comicId">
            <label>{{ comic.comicTitle }}</label>
            {{ comic.comicView }}
            <router-link :to="`/frontstage/comicD/comicRead/${comic.comicId}`">
                <img :src="comic.comicCover">
            </router-link>
        </tr>
    </table>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import httpClient from "@/main";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import $ from 'jquery'
const userId = ref(localStorage.getItem("userId"));
const comicRecom = ref([]);
const mySpecial = ref(false);
// const orders=[
//     // {id:1, title:"Likes"},
//     // {id:2, title:"Newest"},
//     {id:3, title:"Free"},
//     {id:4, title:"MySpecial"},
// ]

const handleCheckBoxChange = (id)=>{
    const checkbox = document.querySelector(`#order${id}`)
    const label = document.querySelector(`#label${id}`)
    if(checkbox.checked){
        label.classList.add("clickOrder")
    }else{
        label.classList.remove("clickOrder")
    }
}

const handleMySpecial = () => {
    mySpecial.value = !mySpecial.value;
    if(mySpecial.value && userId.value){
        httpClient("/comicD/comic/userPreference/user", {params:{userId:userId.value}})
        .then(res =>{
            console.log(res.data);
            comicRecom.value = res.data;    
        })
        .catch(err => console.log(err));
    }else{
        comicRecom.value =[]; 
    }
    
}

</script>


<style scoped>
/* .container{
    width:160px;
    text-align: center;
    background-color: #ec99b5;
} */


/* label {
    cursor: pointer;
    color:rgb(211, 212, 212); 
    font-size:18px; 
    margin:0 20px 0 0;  
    background-color:aqua; 
} 

/*.ligteningIcon{
    color:beige;
}

.clickOrder{
    color: rgba(85, 195, 247, 1);
    font-weight:bold;
    padding: 0 0 2px 0;
    text-decoration: underline;
} */

.comicSortTable{
    position:absolute;
    top:35%;
    left:37%;
    /* background-color: #800730; */
}
.comicSort {
    color:white;
    font-size:20px;
    /* background-color: #ec99b5; */
}
.comicSort label{
    margin:0 10px 0 0;
}
.comicSort:hover{
    transform: scale(1.1);
    color:rgb(243, 248, 255);
    background-color:rgb(8, 15, 115);
    border-radius:5px;
    cursor: pointer;
}
.recommandContainer{
    position:absolute;
    top:45%;
    left:20%;
    width:15vw;
    height: 48.9vh;
    overflow-y:scroll;
    overflow-x:hidden;
    /* background-color:rgb(249, 194, 123) ; */

}

.recommandContainer::-webkit-scrollbar{
    width:0px;
}

.recommand{
    /* position:absolute;
    top:5%;
    left:15%;
    right:15%; */
    width:100%;
    color:white;
    /* background-color:antiquewhite ; */
}
.recommand label{
    text-shadow:0 0 10px pink, 0 0 20px rgb(246, 96, 121);

}
.recommand tr{
    height:200px;
    font-size:30px;
    text-align: center;

}

.recommand img{
    width:100%;
}
</style>