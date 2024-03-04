<template>
    <div class="pageWindow" v-if="showWindowRef">
        <div class="contentPage">

            <div class="photoMain">

                <div id="carouselExampleIndicators" class="carousel slide" @wheel.stop="">
                    <div class="carousel-indicators">
                        <button v-for="(photoEle, index) in picPostComputed.photos" type="button"
                            data-bs-target="#carouselExampleIndicators" :data-bs-slide-to="index" :id="'pic' + index"
                            :class="{ 'active': index == picIndexComputed }" aria-current="true"
                            aria-label="Slide 1"></button>
                        <!-- <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                            aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                            aria-label="Slide 3"></button> -->
                    </div>
                    <div class="carousel-inner">
                        <div v-for="(photoEle, index) in picPostComputed.photos" :id="'pic' + index"
                            :class="{ 'carousel-item': true, active: index == picIndexComputed }">
                            <div class="imgContainer">
                                <img :src="photoEle.photo" alt="">
                            </div>
                        </div>
                    </div>
                    <div v-show="photoLengthComputed">
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                            data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                            data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

            </div>

            <div class="closeBtn">
                <font-awesome-icon :icon="['fas', 'circle-xmark']" style="width: 3rem;height: 3rem;"
                    @click="closePicWindow" />
            </div>

            <PostCommemt :picShowPost2="picPostComputed" :loginUserId="1" class="postAndCommentShow" :state="'picture'" />

        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// import PostCommemt from '@/components/frontstage/forum/PostComment.vue';
import PostCommemt from '@/views/frontstage/forum/NewComment.vue';
import { forumStore } from '@/stores/forum.js';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

const router = useRouter();
const store = forumStore();
const props = defineProps(['picShowPost2', 'picIndex2', 'loginUserId', 'postId', 'picIndex', 'picPost']);
const emit = defineEmits(['closePicWindowAndScrollY', 'picShowPost3', 'picIndex3', 'tempHideWindowAndMainWall', 'closeWindow']);
const creatCount = ref(0);

onMounted(() => {
    nextTick(() => {
        console.log(' picPostRef.value', picPostRef.value);
        console.log(' picIndexRef.value', picIndexRef.value);
        picPostRef.value = props.picPost;
        picIndexRef.value = props.picIndex;
    });

    // 隱藏html&body滾動條
    const hideScrollStyle = document.getElementById('hideScrollStyle');
    if (!hideScrollStyle) {
        const style = document.createElement('style');
        style.id = 'hideScrollStyle';
        style.textContent = 'html { scroll-behavior: auto !important; }';
        document.head.appendChild(style);
    }
    document.body.style.overflow = 'hidden';
})
// watch(() => props.postId, () => {
//     picPostRef.value = store.storePost[props.postId];
//     picIndexRef.value = props.picIndex;
//     creatCount.value++;
//     console.log('creatCount', creatCount.value)
// })
watch(() => props.picPost, () => {
    picPostRef.value = props.picPost;
    picIndexRef.value = props.picIndex;
    creatCount.value++;
    console.log('picIndex', picIndexRef.value)
    console.log('picPost', picPostRef.value)
    console.log('creatCount', creatCount.value)
})
const picPostRef = ref({})
const picIndexRef = ref(0);
const showWindowRef = ref(true);

const picPostComputed = computed(() => {
    return picPostRef.value
})
const picIndexComputed = computed(() => {
    return picIndexRef.value
})

function closePicWindow() {
    // router.go(-(creatCount.value + 1));
    // showWindowRef.value = false;
    emit('closeWindow', true)
}

const photoLengthComputed = computed(() => {
    return picPostRef.value?.photos && Object.entries(picPostRef.value.photos).length > 1;
})
</script>
<style scoped>
.pageWindow {
    background-color: rgb(0, 0, 0);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.contentPage {
    display: flex;
    height: 100%;
    padding: 6rem 0 0 0;
}

.photoMain {
    /* background-color: black; */
    height: 100vh;
    position: relative;
    /* width: 100%; */
    flex: 3;
    /* display: flex;
    justify-content: center;
    align-items: center; */
    object-fit: scale-down;
    /* padding: 2rem; */
}

.postAndCommentShow {
    flex: 1.5;
    /* background-color: blue; */
    /* width: 40%; */
    height: 100%;
    overflow: auto;
}


.carousel {
    width: 100%;
    height: 100%;
    /* background-color: blueviolet; */
    /* object-fit: contain; */
}

.carousel-indicators {
    transform: translateY(-6rem);
}


.carousel-inner {
    /* width: 75%; */
    /* width: 100%;*/
    /* background-color: cadetblue; */
    height: 100%;
    object-fit: scale-down;
    position: relative;
    /* margin: 1rem; */
}


.imgContainer {
    /* border: 2px red solid; */
    text-align: center;
    position: relative;
    top: 50vh;
    transform: translateY(-50%);
}

.carousel-item img {
    object-fit: scale-down;
    max-width: 90%;
    max-height: 90vh;
    padding-bottom: 5rem;
}

.closeBtn {
    z-index: 1001;
    cursor: pointer;
    width: 2.5rem;
    height: 2.5rem;
    /* border: #71747a 1px solid; */
    margin: 1rem 1.5rem;
    position: absolute;
    background-color: rgb(24, 24, 24);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.closeBtn:hover {
    background-color: rgb(137, 124, 124);
}
</style>