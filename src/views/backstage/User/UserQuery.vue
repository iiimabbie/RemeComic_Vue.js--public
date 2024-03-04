<template>
    <div class="container-fluid">
        <!--Logo-->
        <div class="row row1">
            <div class="col-md-2 col-lg-2 d-md-block sidebar">
                <router-link to="/frontstage/home">
                    <img
                        id="logo-black"
                        src="https://firebasestorage.googleapis.com/v0/b/remetest-e1cbe.appspot.com/o/Basic%2FLogo_Black.png?alt=media&token=8a00ea4e-0872-4569-aa92-7c3e825d0d90"
                        alt="RemeLogo"
                    />
                    <img
                        id="logo-fantuan"
                        src="https://firebasestorage.googleapis.com/v0/b/remetest-e1cbe.appspot.com/o/Basic%2F%E7%AE%A1%E7%90%86%E5%93%A1.png?alt=media&token=e510767f-e7a3-465e-8a72-4d34caf275b4"
                        alt="RemeLogo"
                    />
                </router-link>
            </div>
        </div>
        <LoginButton />
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-2 col-lg-2 d-md-block sidebar">
                <Sidebar />
            </div>

            <!-- MainContent -->
            <main class="main-header2 col-md-10 col-lg-10 d-md-block">
                <div class="container">
                    <!--This is loading animation-->
                    <Loading :loading="loading" />
                </div>
            </main>
        </div>
    </div>
</template>
<script setup>
import LoginButton from "@/components/frontstage/basic/LoginButton.vue";
import { onMounted, ref } from "vue";
import Sidebar from "@/components/backstage/basic/Sidebar.vue";
import CouponList from "@/components/backstage/Money/CouponList.vue";
import httpClient from "@/main";
import Loading from "@/components/backstage/Basic/Loading.vue";
import { useLoading, LoadingPlugin } from "vue-loading-overlay";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
</script>
<style scoped>
.row1 {
    display: flex;
    align-items: end;
    margin: 15px 20px 0px 0;
}

#logo-black {
    width: 130px;
}

#logo-fantuan {
    width: 90px;
}

.sidebar-container {
    margin: 0 0 0 15px;
}

.main-header {
    margin: 30px 0px 0 0;
}

.main-header {
    display: flex;
    align-items: flex-end;
}

.input-icon {
    position: absolute;
    left: 170px;
    top: 50%;
    transform: translateY(-50%);
}

.input-icon-wrapper input {
    padding-left: 30px;
}

.main-header2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    max-width: 1000px;
    width: 100%;
}
</style>
