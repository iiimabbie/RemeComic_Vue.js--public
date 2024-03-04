<template>
    <aside class="pageRightBlock">

        <HotTag />
        <!-- <GoFollow /> -->
    </aside>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import HotTag from "@/components/frontstage/forum/HotTag.vue"
import GoFollow from "@/components/frontstage/forum/GoFollow.vue"
</script>
<style scoped></style>