<template>
    <aside class="pageLeftBlock">
        <button type="button" class="postBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            <font-awesome-icon :icon="['fas', 'pen-to-square']" style="color: #dedede;width: 3rem;height: 3rem;" />
            &nbsp;<span style="font-size:40px;">POST</span>
        </button>
        <ForumNavbar />
    </aside>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ForumNavbar from "@/components/frontstage/forum/ForumNav.vue"
import AddPost from "@/components/frontstage/forum/AddPost.vue"

</script>
<style scoped>
.postBtn {
    border-radius: 2rem;
    /* overflow: hidden; */
    width: 100%;
    height: 100px;
    color: white;
    background-color: rgb(39, 185, 248);
    margin-bottom: 1rem;
}

.postBtn:hover {
    background-color: rgb(76, 199, 252);
}

.postBtn:active {
    background-color: rgb(0, 160, 224);
}
</style>