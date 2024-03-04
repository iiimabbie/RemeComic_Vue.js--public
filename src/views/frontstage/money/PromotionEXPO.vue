<script setup>
import httpClient from "@/main";
import {onMounted, ref} from "vue";
import PromotionWindow from "@/components/frontstage/money/PromotionWindow.vue";

const promotionList = ref([]);
const currentIndex = ref(0);

const handleIndex = (next) => {
  if (next) {
    currentIndex.value = (currentIndex.value + 1) % promotionList.value.length;
  } else {
    currentIndex.value = (currentIndex.value - 1) % promotionList.value.length;
  }
  console.log(currentIndex.value);
}
onMounted(() => {
  showAllPromotion();
})

async function showAllPromotion() {
  const url = "/money/promotion/findAll";

  try {
    const response = await httpClient.get(url);

    promotionList.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

</script>

<template>

  <div class="button-container">
    <button @click="handleIndex" class="button">
      <div class="button-box">
    <span class="button-elem">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 40">
        <path
            d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
      </svg>
    </span>
        <span class="button-elem">
      <svg viewBox="0 0 46 40">
        <path
            d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"></path>
      </svg>
    </span>
      </div>
    </button>

    <button @click="handleIndex(true)" class="button2">
      <div class="button-box2">
    <span class="button-elem2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 40">
         <path
             d="M0 20.038c0-.7.3-1.5.8-2.1l16-17c1.1-1 3.2-1.4 4.4-.3 1.2 1.1 1.2 3.3 0 4.4l-11.3 11.9H43c1.7 0 3 1.3 3 3s-1.3 3-3 3H8.9l11.3 11.9c1 1 1.2 3.3 0 4.4-1.2 1.1-3.3.8-4.4-.3l-16-17c-.5-.5-.8-1.1-.8-1.9z"></path></svg>
    </span>
        <span class="button-elem2">
      <svg viewBox="0 0 46 40">
         <path
             d="M0 20.038c0-.7.3-1.5.8-2.1l16-17c1.1-1 3.2-1.4 4.4-.3 1.2 1.1 1.2 3.3 0 4.4l-11.3 11.9H43c1.7 0 3 1.3 3 3s-1.3 3-3 3H8.9l11.3 11.9c1 1 1.2 3.3 0 4.4-1.2 1.1-3.3.8-4.4-.3l-16-17c-.5-.5-.8-1.1-.8-1.9z"></path> </svg>
    </span>
      </div>
    </button>
  </div>
  <ul>
    <li>
      <PromotionWindow v-for="(promotion, index) in promotionList"
                       v-show="currentIndex == index"
                       :key="promotion.promotionId"
                       :promotionId="promotion.promotionId"
                       :comicId="promotion.comicId"
                       :promotionName="promotion.promotionName"
                       :promotionDesc="promotion.promotionDesc"
                       :promotionStartDate="promotion.startDate"
                       :promotionEndDate="promotion.endDate"
      />
    </li>
  </ul>

</template>

<style scoped>
section.card {
  position: relative;
  width: 250px;
  height: 350px;
  background-color: #f2f2f2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

ul {
  list-style-type: none;
}

.card svg {
  fill: #000;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 3px;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px #000000;
  background-color: #f2f2f2;
  color: #ffffff;
}

.card__content {
  color: #000000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  transform: rotateX(-90deg);
  transform-origin: bottom;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover .card__content {
  transform: rotateX(0deg);
}

.card__title {
  margin: 0;
  padding-left: 5px;
  font-size: 24px;
  color: #000000;
  font-weight: 700;
}

.card:hover svg {
  scale: 0;
}

.card__description {
  margin: 10px 0 0;
  font-size: 14px;
  color: #000000;
  line-height: 1.4;
}

@media (prefers-color-scheme: dark) {
  .card:hover {
    box-shadow: 0 8px 16px #000000;
  }
}

.button-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  display: block;
  position: relative;
  width: 56px;
  height: 56px;
  margin: 0;
  overflow: hidden;
  outline: none;
  background-color: transparent;
  border: 0;
}

.button:before,
.button:after {
  content: "";
  position: absolute;
  border-radius: 50%;
  inset: 7px;
}

.button:before {
  border: 4px solid #F0EEEF;
  transition: opacity .4s cubic-bezier(.77, 0, .175, 1) 80ms, transform .5s cubic-bezier(.455, .03, .515, .955) 80ms;
}

.button:after {
  border: 4px solid #96daf0;
  transform: scale(1.3);
  transition: opacity .4s cubic-bezier(.165, .84, .44, 1), transform .5s cubic-bezier(.25, .46, .45, .94);
  opacity: 0;
}

.button:hover:before,
.button:focus:before {
  opacity: 0;
  transform: scale(0.7);
  transition: opacity .4s cubic-bezier(.165, .84, .44, 1), transform .5s cubic-bezier(.25, .46, .45, .94);
}

.button:hover:after,
.button:focus:after {
  opacity: 1;
  transform: scale(1);
  transition: opacity .4s cubic-bezier(.77, 0, .175, 1) 80ms, transform .5s cubic-bezier(.455, .03, .515, .955) 80ms;
}

.button-box {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
}

.button-elem {
  display: block;
  width: 20px;
  height: 20px;
  margin: 17px 18px 0 18px;
  transform: rotate(180deg);
  fill: #F0EEEF;
}

.button:hover .button-box,
.button:focus .button-box {
  transition: .4s;
  transform: translateX(-56px);
}

.button2 {
  display: block;
  position: relative;
  width: 56px;
  height: 56px;
  margin: 0;
  overflow: hidden;
  outline: none;
  background-color: transparent;
  border: 0;
}

.button2:before,
.button2:after {
  content: "";
  position: absolute;
  border-radius: 50%;
  inset: 7px;
}

.button2:before {
  border: 4px solid #F0EEEF;
  transition: opacity .4s cubic-bezier(.77, 0, .175, 1) 80ms, transform .5s cubic-bezier(.455, .03, .515, .955) 80ms;
}

.button2:after {
  border: 4px solid #96daf0;
  transform: scale(1.3);
  transition: opacity .4s cubic-bezier(.165, .84, .44, 1), transform .5s cubic-bezier(.25, .46, .45, .94);
  opacity: 0;
}

.button2:hover:before,
.button2:focus:before {
  opacity: 0;
  transform: scale(0.7);
  transition: opacity .4s cubic-bezier(.165, .84, .44, 1), transform .5s cubic-bezier(.25, .46, .45, .94);
}

.button2:hover:after,
.button2:focus:after {
  opacity: 1;
  transform: scale(1);
  transition: opacity .4s cubic-bezier(.77, 0, .175, 1) 80ms, transform .5s cubic-bezier(.455, .03, .515, .955) 80ms;
}

.button-box2 {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
}

.button-elem2 {
  display: block;
  width: 20px;
  height: 20px;
  margin: 17px 18px 0 18px;
  transform: rotate(180deg);
  fill: #F0EEEF;
}

.button2:hover .button-box2,
.button2:focus .button-box2 {
  transition: .4s;
  transform: translateX(56px);
}
</style>