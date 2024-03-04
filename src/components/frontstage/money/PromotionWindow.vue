<script setup>
import {defineProps, onMounted, ref} from "vue";
import httpClient from "@/main";

const props =
    defineProps
    (['promotionId', 'comicId', 'promotionName', 'promotionDesc', 'promotionStartDate', 'promotionEndDate']);
const comicCover = ref('');

onMounted(() => {
  findSpecificComic();
})

async function findSpecificComic() {
  const url = `/comicD/simplecomic?comicId=${props.comicId}`;

  try {
    const response = await httpClient.get(url);

    comicCover.value = response.data.comicCover;
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>

      <section id="card1" class="card">
        <img :src="comicCover" alt="Image" height="425" width="280.25">
        <div class="card__content">
          <p class="card__title">{{ props.promotionName }}</p>
          <p class="card__description">
            {{ props.promotionDesc }}
          </p>
        </div>
      </section>
 

</template>

<style scoped>
section.card {
  position: absolute;
  top: 10px;
  width: 280.25px;
  height: 425px;
  background-color: #f2f2f2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
  background-color: #000000;
  transform: rotateX(-90deg);
  transform-origin: bottom;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover .card__content {
  transform: rotateX(0deg);
  opacity: 0.75;
}

.card__title {
  margin: 0;
  padding-left: 5px;
  font-size: 20px;
  color: #f2f2f2;
  font-weight: 700;
}

.card:hover svg {
  scale: 0;
}

.card__description {
  margin: 10px 0 0;
  font-size: 14px;
  color: #f2f2f2;
  line-height: 1.4;
}

@media (prefers-color-scheme: dark) {
  .card:hover {
    box-shadow: 0 8px 16px #000000;
  }
}

</style>