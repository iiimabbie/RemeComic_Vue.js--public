<template>
    <nav>
        <!-- <h3>Posts Show</h3> -->

        <SearchBar />

        <ul class="blockSection">
            <li v-for="view in navbarShowPostList" class="navItem">
                <div v-if="view == 'Hot Post'" @click="changeView(view)">
                    &nbsp;<font-awesome-icon :icon="['fas', 'fire']" />&nbsp;&nbsp;{{ view }}
                </div>
                <div v-else-if="view == 'New Post'" @click="changeView(view)">
                    &nbsp;<font-awesome-icon :icon="['fas', 'house']" />&nbsp;{{ view }}
                </div>
            </li>
        </ul>

        <ul class="blockSection">
            <li v-for="view in navbarList" @click="changeView(view)" class="navItem">
                <div v-if="view == 'My Profile'">
                    &nbsp;<font-awesome-icon :icon="['fas', 'id-card']" />&nbsp;{{ view }}
                </div>
                <div v-if="view == 'My Collect'">
                    &nbsp;<font-awesome-icon :icon="['far', 'bookmark']" />&ensp;{{ view }}
                </div>
                <div v-if="view == 'My Private'">
                    &nbsp;<font-awesome-icon :icon="['fas', 'user-secret']" />&nbsp;&nbsp;{{ view }}
                </div>

            </li>
        </ul>
    </nav>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import SearchBar from "@/components/frontstage/forum/SearchBar.vue"

const router = useRouter();
const props = defineProps([])
const emit = defineEmits([])

const navbarShowPostList = ['New Post', 'Hot Post']
const navbarList = ['My Profile', 'My Collect', 'My Private']
const navMoreList = ['Notify', 'Group', 'Report', 'Black List']
const nowView = ref('Following')
const locationUserId = ref(1);

onMounted(() => {
    if (localStorage.getItem("userId")) {
        locationUserId.value = localStorage.getItem("userId")
    }
    router.push({ name: nowView.value.toLowerCase() });
})

async function changeView(view, periodNumber) {
    nowView.value = view;
    if (view == 'Hot Post') {
        console.log('nav view & periodNumber', view + periodNumber)
        await router.push({ name: 'hot', params: { periodNumber: 1 } });
    } else if (view == 'New Post') {
        await router.push({ name: 'following' });
    } else if (view == 'My Profile') {
        await router.push({ path: '/frontstage/forum/profile/' + localStorage.getItem("userId") });
    } else {
        await router.push({ name: view.toLowerCase() });
    }
    location.href = "#";
}
</script>
<style scoped>
nav {
    display: flex;
    flex-direction: column;
    /* overflow: auto; */
}

.navItem:hover {
    background-color: rgb(17, 82, 147);
    cursor: pointer;
}

/* .selectGroupBtn {
    position: relative;
}

.selectGroupBtn>a {
    text-decoration: none;
    color: white;
    display: block;
} */

/* .menuBlock {
    width: 100%;
} */

.blockSection {
    background-color: rgb(108, 159, 180);
    list-style-type: none;
    padding-left: 0;
    border-radius: 1rem;
    font-size: 40px;
    overflow: hidden;
}

.blockSection>li {
    padding: 0.5rem 1rem;

}
</style>