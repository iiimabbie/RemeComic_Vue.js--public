<template>
    <div class="saerchSection" style="display: flex;justify-content: space-between;margin-bottom: 1rem;">
        <input type="search" placeholder="search for..."
            style="border-radius: 2rem;height: 4rem;width: 18rem;font-size: 30px;padding-left: 1rem;"
            v-model="searchInput" />
        <button style="border-radius: 1rem;height: 4rem;width:6rem;font-size: 30px;margin-left: 0.5rem;"
            @click="goSearchPostWall">GO</button>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps([])
const emit = defineEmits([])


const searchInput = ref("");


async function goSearchPostWall() {
    console.log('進入到此方法showTagPostWall')
    if (searchInput.value) {
        await router.push({ path: '/frontstage/forum/search/' + searchInput.value });
    }


}

</script>
<style scoped>
button:hover {
    background-color: gray;

}
</style>