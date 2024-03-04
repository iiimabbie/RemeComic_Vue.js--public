<template>
    <div class="hotTagSection">
        <h3 style="text-align: center;">Hot Tags</h3>
        <ul class="tagList">
            <li v-for="(tag, index) in hotTags" class="tagItem" @click="showTagPostWall(tag.tagId, tag.tagName)">
                <div class="tagContent">
                    <span class="rankNumber">{{ index + 1 }}</span>&nbsp;
                    <!-- <span>id:{{ tag.tagId }}</span>&nbsp; -->
                    <!-- <span class="tagInfo">#{{ tag.tagName }}</span> -->
                    <span class="tagInfo">#{{ tagNameShortInTen[index] }}</span>
                    &nbsp;
                    <span class="tagAmount">{{ tag.postAmount }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script setup>

import { computed, nextTick, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps([])
const emit = defineEmits([])

const hotTags = ref([])

//小工具們╰(*°▽°*)╯
const axiosHelper = axios.create({
    withCredentials: true
})
const hotTagUrl = '/tag/show/hot'
const baseUrl = 'http://localhost:8080/remecomic'

onMounted(async () => {
    await getHotTags()
    nextTick(() => {
        for (const tag of hotTags.value) {
            if (tag.tagName.length > 11) {
                tagNameShortInTen.value.push(tag.tagName.substring(0, 11) + '...')
            } else {
                tagNameShortInTen.value.push(tag.tagName);
            }
        }
        console.log('tagNameShortInTen', tagNameShortInTen)
    })

})
async function getHotTags(searchTimePeriod = 0) {
    console.log('searchTimePeriod', searchTimePeriod)
    // const hotTagUrl = '/tag/show/hot'
    await axiosHelper.get(baseUrl + hotTagUrl, {
        params: {
            // periodNumber: searchDatePeriod.value[searchTimePeriod]
            periodNumber: 100
        }
    }).then((res) => {
        console.log('hot tag', res.data)
        hotTags.value = res.data
    }).catch((err) => {
        console.log(err)
    })
}

async function showTagPostWall(tagId, tagName) {
    console.log('進入到此方法showTagPostWall')
    await router.push({ path: '/frontstage/forum/tag/' + tagId + '/' + tagName });

}
const tagNameShortInTen = ref([]);

</script>
<style scoped>
.rankNumber {
    color: rgb(255, 170, 0);
    font-weight: 900;
}


.tagList {
    background-color: rgb(108, 159, 180);
    list-style-type: none;
    padding-left: 0;
    border-radius: 1rem;
    font-size: 40px;
    overflow: hidden;
    position: relative;
}

.tagList>li {
    padding: 0.5rem 1rem;

}

.tagContent {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tagAmount {
    width: 3rem;
    height: 3rem;
    background-color: rgb(2, 144, 176);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: rgb(255, 255, 255);
    font-size: 35px;
    font-weight: 800;

}

.tagItem {
    position: relative;
}

.tagItem:hover {
    background-color: rgb(17, 82, 147);
    cursor: pointer;
}

.tagInfo {
    flex-grow: 1;
    font-size: 30px;
    width: 5rem;
}
</style>