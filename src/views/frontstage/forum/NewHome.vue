<template>
    <div>
        <FrontstageHeader style="position:fixed;box-shadow: 0px 3px rgb(109, 109, 109);" />
    </div>
    <div class="pageCoreBlock" style="display: flex;justify-content: center;">

        <div class="canvas"></div>
        <ForumLeftNav class="sideNav leftNav" />
        <div class="router-view-container">
            <!-- <keep-alive> -->
            <router-view />
            <!-- </keep-alive> -->
        </div>
        <ForumRightNav class="sideNav rightNav" />


        <!-- Modal -->
        <div class="modal fade modalSection" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
            tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-8" id="staticBackdropLabel" style="color: darkcyan;">
                            Post</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <AddPost />
                    </div>
                    <!-- <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Understood</button>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import ForumLeftNav from '@/components/frontstage/forum/ForumLeftNav.vue';
import ForumRightNav from '@/components/frontstage/forum/ForumRightNav.vue';
import AddPost from "@/components/frontstage/forum/AddPost.vue";
import FrontstageHeader from '@/components/frontstage/basic/FrontstageHeader.vue';

onMounted(() => {
    console.log('loginUserId', localStorage.getItem("userId"));
    if (!localStorage.getItem("userId")) {
        localStorage.setItem('userId', 1);
        console.log('loginUserId', localStorage.getItem("userId"));
    }

})

</script>
<style scoped>
* {
    /* border: solid 1px; */
    box-sizing: border-box;
    /* font-family: 'Roboto', sans-serif; */
    font-family: 'Nunito', sans-serif;
    /* font-family: 'Roboto Mono', monospace; */
}

body,
html {
    height: 100%;
    margin: 0;
    /* background-color: black; */
    position: relative;
}

h3 {
    text-align: center;
}

.canvas {
    height: 100vh;
    /* background-color: black; */

}

.modal-body {
    background-color: lightblue;
}

.pageCoreBlock {
    height: 100%;
    position: relative;
    padding: 0 10rem;
    color: white;
    background-color: black;
}

.sideNav {
    width: 20%;
    padding: 1rem;
    position: fixed;
    top: 6rem;
    /* background-color: lightblue; */
}


.leftNav {
    left: 5rem;
}

.rightNav {
    right: 5rem;
}

.router-view-container {
    width: 60%;
    padding: 0 3rem;
    background-color: black;
    height: 100%;
    margin-top: 6rem
}

.modalSection {
    transform: translateY(5rem);
}
</style>