import { createRouter, createWebHistory } from "vue-router";
import FrontstageHome from "@/views/frontstage/basic/FrontstageHome.vue";
import BackstageHome from "@/views/backstage/basic/BackstageHome.vue";
import HelpQuestion from '@/views/backstage/helpCenter/TableQA.vue';
import HelpAddQA from '@/views/backstage/helpCenter/AddQA.vue';
import HelpResponseQuestion from "@/views/backstage/helpCenter/ResponseQuestion.vue";
import HelpRequestQuestion from "@/views/frontstage/helpCenter/RequestQuestion.vue";
import HelpHome from "@/views/frontstage/helpCenter/HelpHome.vue";
import MoneyPromoAdd from "@/views/backstage/money/MoneyPromoAdd.vue";
import MoneyPromoQuery from "@/views/backstage/money/MoneyPromoQuery.vue";
import MoneyOrdersQuery from "@/views/backstage/money/MoneyOrdersQuery.vue";
import MoneyCouponQuery from "@/views/backstage/money/MoneyCouponQuery.vue";
import MoneyCouponAdd from "@/views/backstage/money/MoneyCouponAdd.vue";
import MoneyPromotionUpdate from "@/views/backstage/money/MoneyPromotionUpdate.vue";
import MoneyOrdersDataAnalyze from "@/views/backstage/money/MoneyOrdersDataAnalyze.vue";
import RechargeRecord from "@/views/frontstage/money/RechargeRecord.vue";
import Orders from "@/views/frontstage/money/Orders.vue";
import Favorite from "@/views/frontstage/money/Favorite.vue";
import TestButton from "@/views/frontstage/money/TestButton.vue";
import MyBooks from "@/views/frontstage/money/MyBooks.vue";
import PromotionEXPO from "@/views/frontstage/money/PromotionEXPO.vue";
import TestAll from "@/views/frontstage/money/Chat.vue";
import PostVerify from "@/views/backstage/forum/PostVerify.vue";
import ForumHome from "@/views/frontstage/forum/NewHome.vue";
import ForumComment from "@/views/frontstage/forum/NewComment.vue";
import ForumPicture from "@/views/frontstage/forum/NewBigPic.vue";

import UserQuery from "@/views/backstage/User/UserQuery.vue";
import OrgComicShow from "@/views/backstage/OrgComic/OrgComicShow.vue";
import orgComicLikeCom from "@/views/backstage/OrgComic/orgComicLikeCom.vue";
import orgaddinfo from "@/views/frontstage/orgcomic/orgaddinfo.vue";
import orgaddbody from "@/views/frontstage/orgcomic/orgaddbody.vue";
import orgshowcomicbody from "@/views/frontstage/orgcomic/orgshowcomicbody.vue";
import orghome from "@/views/frontstage/orgcomic/orghome.vue";


import MyInfo from '@/views/frontstage/user/MyInfo.vue';
import MyBadges from '@/views/frontstage/user/MyBadges.vue';
import MyCalendar from '@/views/frontstage/user/MyCalendar.vue';
import TestButton2 from "@/views/frontstage/money/RechargeSystem.vue";
import RechargeSystem from "@/views/frontstage/money/RechargeSystem.vue";
import Chat from "@/views/frontstage/money/Chat.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/backstage/home",
            component: BackstageHome,
        },
        {
            path: "/frontstage/home",
            component: FrontstageHome,
        },
        {
            path: "/backstage/money/promotion/add",
            name: "PromoAdd",
            component: MoneyPromoAdd,
        },
        {
            path: "/backstage/money/promotion/query",
            name: "PromoQuery",
            component: MoneyPromoQuery,
        },
        {
            path: "/backstage/money/promotion/update",
            name: "MoneyPromotionUpdate",
            component: MoneyPromotionUpdate,
        },
        {
            path: "/backstage/money/coupon/add",
            name: "CouponAdd",
            component: MoneyCouponAdd,
        },
        {
            path: "/backstage/money/coupon/query",
            name: "CouponQuery",
            component: MoneyCouponQuery,
        },
        {
            path: "/backstage/money/order/query",
            name: "OrderQuery",
            component: MoneyOrdersQuery,
        },
        {
            path: "/backstage/money/order/dataAnalyze",
            name: "OrderDataAnalyze",
            component: MoneyOrdersDataAnalyze,
        },
        {
            path: "/frontstage/money/rechargeRecord/",
            name: "RechargeRecord",
            component: RechargeRecord,
        },
        {
            path: "/frontstage/money/orders/",
            name: "Orders",
            component: Orders,
        },
        {
            path: "/frontstage/money/favorite/",
            name: "Favorite",
            component: Favorite,
        },
        {
            path: "/frontstage/money/TestButton/",
            name: "TestButton",
            component: TestButton,
        },
        {
            path: "/frontstage/money/RechargeSystem/",
            name: "RechargeSystem",
            component: RechargeSystem,
        },
        {
            path: "/frontstage/money/myBooks/",
            name: "MyBooks",
            component: MyBooks,
        },
        {
            path: "/frontstage/money/promotionEXPO/",
            name: "PromotionEXPO",
            component: PromotionEXPO,
        },
        {
            path: "/frontstage/money/chat",
            name: "Chat",
            component: Chat,
        },
        {
            path: '/backstage/help/question',
            component: HelpQuestion
        }
        ,
        {
            path: '/backstage/help/add',
            component: HelpAddQA
        }
        ,
        {
            path: '/backstage/help/responseQuestion',
            component: HelpResponseQuestion
        }
        ,
        {
            path: '/frontstage/help/home',
            component: HelpHome
        }
        ,
        {
            path: '/frontstage/help/requestQuestion',
            component: HelpRequestQuestion
        }
        ,
        {
            path: '/frontstage/user/MyInfo',
            component: MyInfo
        }
        ,
        {
            path: '/frontstage/user/MyBadges',
            component: MyBadges
        }
        ,
        {
            path: '/frontstage/user/MyCalendar',
            component: MyCalendar
        }
        ,

        {
            path: '/backstage/comicD/query',
            component: () => import(
                '@/views/backstage/ComicD/ComicDQuery.vue'
            )
        },
        {
            path: '/backstage/comicD/add',
            component: () => import(
                '@/views/backstage/ComicD/ComicDAdd.vue'
            )
        },
        {
            path: '/frontstage/comicD/comicRead/:comicId',
            name: 'ComicRead',
            component: () => import(
                '@/views/frontstage/comicD/ComicRead.vue'
            )
        },
        ,
        {
            path: "/backstage/user/query",
            name: "UserQuery",
            component: UserQuery,
        },
        {
            path: "/backstage/OrgComic/OrgComicShow",
            name: "OrgComicShow",
            component: OrgComicShow,
        },
        {
            path: "/backstage/OrgComic/orgComicLikeCom",
            name: "orgComicLikeCom",
            component: orgComicLikeCom,
        },
        {
            path: "/frontstage/orgcomic/orgaddinfo",
            name: "orgaddinfo",
            component: orgaddinfo,
        },
        {
            path: "/frontstage/orgcomic/orgaddbody",
            name: "orgaddbody",
            component: orgaddbody,
        },
        {
            path: "/frontstage/orgcomic/orgshowcomicbody/:comicId",
            name: "orgshowcomicbody",
            component: orgshowcomicbody,
        },
        {
            path: "/frontstage/orgcomic/orghome",
            name: "orghome",
            component: orghome,
        },
        {
            path: '/backstage/forum/verify',
            name: 'PostVerify',
            component: PostVerify
        },
        {
            path: '/frontstage/forum/home',
            name: 'ForumHome',
            component: ForumHome,
            children: [
                {
                    path: '/frontstage/forum/following',
                    name: 'following',
                    component: () => import(
                        '@/views/frontstage/forum/FollowingPost.vue')
                }, {
                    path: '/frontstage/forum/tag/:tagId/:tagName',
                    name: 'tag post',
                    component: () => import(
                        '@/views/frontstage/forum/TagPost.vue'),
                    props: true
                }, {
                    path: '/frontstage/forum/search/:searchString',
                    name: 'search post',
                    component: () => import(
                        '@/views/frontstage/forum/SearchPost.vue'),
                    props: true
                }, {
                    path: '/frontstage/forum/hot/:periodNumber',
                    name: 'hot',
                    component: () => import(
                        '@/views/frontstage/forum/HotPost.vue'),
                    props: true
                }, {
                    path: '/frontstage/forum/newNav',
                    name: 'new nav',
                    component: () => import(
                        '@/components/frontstage/forum/NewPostNav.vue')
                }, {
                    path: '/frontstage/forum/newAll',
                    name: 'new all',
                    component: () => import(
                        '@/views/frontstage/forum/NewAllPost.vue')
                },
                {
                    path: '/frontstage/forum/notify',
                    name: 'notify',
                    component: () => import(
                        '@/views/frontstage/forum/Notify.vue')
                },
                {
                    path: '/frontstage/forum/private',
                    name: 'my private',
                    component: () => import(
                        '@/views/frontstage/forum/MyPrivate.vue')
                },
                {
                    path: '/frontstage/forum/comment',
                    name: 'Comment',
                    component: ForumComment,
                    props: true
                },
                {
                    path: '/frontstage/forum/picture/:postId/:picIndex',
                    name: 'Picture',
                    component: ForumPicture,
                    props: true
                },
                {
                    path: '/frontstage/forum/profile/:profileUserId',
                    name: 'my profile',
                    component: () => import(
                        '@/views/frontstage/forum/Profile.vue'),
                    props: true
                },
                {
                    path: '/frontstage/forum/collect',
                    name: 'my collect',
                    component: () => import(
                        '@/views/frontstage/forum/Collect.vue')
                },
                {
                    path: '/frontstage/forum/friends/:conString/:targetUserId',
                    name: 'friends',
                    component: () => import(
                        '@/views/frontstage/forum/Friends.vue'),
                    props: true
                },
                {
                    path: '/frontstage/forum/group',
                    name: 'group',
                    component: () => import(
                        '@/views/frontstage/forum/Group.vue')
                },
                {
                    path: '/frontstage/forum/report',
                    name: 'report',
                    component: () => import(
                        '@/views/frontstage/forum/Report.vue')
                },
                {
                    path: '/frontstage/forum/blacklist',
                    name: 'black list',
                    component: () => import(
                        '@/views/frontstage/forum/BlackList.vue')
                }]
        },
    ]
});


export default router;
