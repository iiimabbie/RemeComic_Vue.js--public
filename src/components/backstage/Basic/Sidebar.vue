<template>
    <div class="position-sticky pt-3">
        <ul class="nav flex-column">
            <li class="nav-item">
                <div class="accordion" id="accordionContainer">
                    <div class="accordion-item" v-for="nav in sidebar" :key="nav.id">
                        <div class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                :data-bs-target="'#' + nav.id" aria-expanded="true" :aria-controls="nav.id">
                                <font-awesome-icon class="nav-icon" :icon="['fas', nav.icon]" />
                                {{ nav.name }}
                                <font-awesome-icon class="nav-caret" :icon="['fas', 'caret-down']" />
                            </button>
                        </div>

                        <div :id="nav.id" class="accordion-collapse collapse" data-bs-parent="#accordionContainer">
                            <div class="accordion-body">
            <li v-for="option in nav.options" :key="option.id" @click=handleOptionSelected(option.mainDisplay)>
                <!-- <router-link :to="option.route" > -->
                <font-awesome-icon class="body-caret" :icon="['fas', 'caret-right']" />
                {{ option.name }}
                <!-- </router-link> -->
            </li>
            <!-- :to="option.route"
                @click="
                emitOptionSelected(option.mainDisplay)
                " -->
    </div>
    </div>
    </div>
    </div>
    </li>
    </ul>
    </div>
</template>

<script setup>

import { ref, defineEmits } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import MoneyPromoQuery from "@/views/backstage/money/MoneyPromoQuery.vue";
import MoneyPromoAdd from "@/views/backstage/money/MoneyPromoAdd.vue";
import MoneyCouponQuery from "@/views/backstage/money/MoneyCouponQuery.vue";
import MoneyCouponAdd from "@/views/backstage/money/MoneyCouponAdd.vue";
import MoneyOrdersQuery from "@/views/backstage/money/MoneyOrdersQuery.vue";
import MoneyOrdersDataAnalyze from "@/views/backstage/money/MoneyOrdersDataAnalyze.vue";
import ComicDQuery from "@/views/backstage/ComicD/ComicDQuery.vue";
import ComicDAdd from '@/views/backstage/ComicD/ComicDAdd.vue';
import TableUser from "@/components/backstage/User/TableUser.vue";

import ForumVerify from '@/views/backstage/forum/PostVerify.vue';
import ForumPostTable from '@/views/backstage/forum/ForumPostTable.vue';
import ForumReportTable from '@/views/backstage/forum/ForumReportTable.vue';
import ForumUserTable from '@/views/backstage/forum/ForumUserTable.vue';

import AddQA from '@/views/backstage/helpCenter/AddQA.vue';
import TableQA from '@/views/backstage/helpCenter/TableQA.vue';
import ResponseQuestion from "@/views/backstage/helpCenter/ResponseQuestion.vue";

import OrgComic from "@/views/backstage/OrgComic/OrgComicShow.vue";
import orgaddP1 from "@/views/backstage/orgcomic/orgaddP1.vue";
import orgaddP2 from "@/views/backstage/orgcomic/orgaddP2.vue";


const props = defineProps(["showComicDAsHome"]);
const emits = defineEmits(["optionSelected"]);

const show = ref(false);
const comicD = [
    { id: 1, name: "Query", mainDisplay: ComicDQuery, route: '/backstage/comicD/query' },
    { id: 2, name: 'Add / Drafts', mainDisplay: ComicDAdd, route: '/backstage/comicD/add' },

];
const promo = [
    { id: 1, name: "Query", mainDisplay: MoneyPromoQuery, route: '/backstage/money/promotion/query' },
    { id: 2, name: "Add", mainDisplay: MoneyPromoAdd, route: "/backstage/money/promotion/add" },
];
const coupon = [
    { id: 1, name: "Query", mainDisplay: MoneyCouponQuery, route: "/backstage/money/coupon/query" },
    { id: 2, name: "Add", mainDisplay: MoneyCouponAdd, route: "/backstage/money/coupon/add" },
];
const userA = [
    { id: 1, name: "Query", mainDisplay: TableUser, route: "/backstage/home" },
];
const forum = [
    { id: 1, name: "Verify", mainDisplay: ForumVerify, route: "/backstage/forum/verify" },
    { id: 2, name: "Report", mainDisplay: ForumReportTable, route: "/backstage/forum/report" },
    { id: 3, name: "User", mainDisplay: ForumUserTable, route: "/backstage/forum/user" },
    { id: 4, name: "Post", mainDisplay: ForumPostTable, route: "/backstage/forum/post" },
];
const orders = [
    { id: 1, name: "Query", mainDisplay: MoneyOrdersQuery, route: "/backstage/money/order/query" },
    { id: 3, name: "DataAnalyze", mainDisplay: MoneyOrdersDataAnalyze, route: "/backstage/money/order/dataAnalyze" },
];
const helpCenter = [
    { id: 1, name: "Query", mainDisplay: TableQA, route: "/backstage/home" },
    { id: 2, name: "Add", mainDisplay: AddQA, route: "/backstage/home" },
    { id: 3, name: "ResponseQuestion", mainDisplay: ResponseQuestion, route: "/backstage/home" },
];
const orgComic = [

    { id: 1, name: "Query", mainDisplay: OrgComic },
    { id: 2, name: "UpdateComicSeries", mainDisplay: orgaddP1 },
    { id: 2, name: "UpdateComicEpisode", mainDisplay: orgaddP2 }

]
const sidebar = [
    { id: "item1", name: "Comic", icon: "book", options: comicD },
    { id: "item2", name: "Promo", icon: "gift", options: promo },
    { id: "item8", name: "Coupon", icon: "ticket", options: coupon },
    { id: "item3", name: "Users", icon: "user", options: userA },
    { id: "item4", name: "Orders", icon: "store", options: orders },
    {
        id: "item5",
        name: "Original",
        icon: "wand-magic-sparkles",
        options: orgComic,
    },
    { id: "item6", name: "Posts", icon: "blog", options: forum },
    { id: "item7", name: "Help", icon: "circle-info", options: helpCenter },
];

const handleOptionSelected = (mainDisplay) => {
    props.showComicDAsHome = false;
    //const currentDisplay = mainDisplay;
    emits("optionSelected", mainDisplay);
};
</script>

<style scoped>
.nav-icon {
    margin: 0 10px 0 20px;
}

.nav-caret {
    display: none;
}

.accordion-item:hover .nav-caret {
    color: lightblue;
    transform: scale(1.2);
    display: inline-block;
    margin: 0 0 0 60px;
}

.accordion-button {
    font-size: 24px;
    padding: 40px auto;
}

.accordion-button::after {
    display: none;
}

.accordion-body>li {
    margin: 0 0 10px 40px;
    font-size: 20px;
    text-decoration: none;
    color: gray;
    cursor: pointer;
}

.accordion-body>li:hover {
    transform: scale(1.2);
    color: lightblue;
}

.body-caret {
    margin: 0 6px 0 0;
}
</style>
