import { computed, ref } from "vue";

import { defineStore } from "pinia";


export const forumStore = defineStore("forumStore", () => {

    const storePost = ref({});
    const loginUserId = ref(1);

    // 更新 storePost 的值
    const updateStorePost = (postId, postData) => {
        storePost.value[postId] = postData;
    };

    return {
        storePost, loginUserId, updateStorePost
    };
});
