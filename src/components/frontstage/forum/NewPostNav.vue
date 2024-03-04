<template>
    <div class="choosePostBar">
        <nav>
            <ul style="border-radius: 1rem;overflow: hidden;">
                <li v-for="profileView in profileNav">
                    <span @click="changeViewShow(profileView, $event)" :class="{ nowView: profileView == nowView }">{{
                        profileView }}</span>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script setup>
import { onActivated, onDeactivated, onMounted, ref } from 'vue';
import PostWall from "@/components/frontstage/forum/PostWall.vue"
import { useRouter } from 'vue-router';

onMounted(() => {
    if (props.nowView) {
        nowView.value = props.nowView
    }
})
const props = defineProps(['nowView'])

const router = useRouter();
const profileNav = ['Follow', 'All'];
const nowView = ref('Follow');

async function changeViewShow(targetView, event) {
    nowView.value = targetView
    if (targetView == 'Follow') {
        console.log('nav targetView & periodNumber', targetView)
        await router.push({ name: 'following' });
    } else if (targetView == 'All') {
        await router.push({ name: 'new all' });
    }
    location.href = "#";
}



onActivated(() => {
    console.log('onActivated')
})
onDeactivated(() => {
    console.log('onDeactivated')
})

</script>
<style scoped>
.choosePostBar ul {
    display: flex;
    list-style-type: none;
    padding-left: 0;
}

.choosePostBar li {
    background-color: #6e6b6b;
    width: 100%;
    font-size: 2rem;
    text-align: center;
    position: relative;
}

.choosePostBar li span {
    padding: 1.5rem 0;
    display: inline-block;
    height: 100%;
    width: 100%;
}

.choosePostBar li span:hover {
    background-color: salmon;
    cursor: pointer;
}

.nowView {
    background-color: rgb(179, 18, 0);
}
</style>