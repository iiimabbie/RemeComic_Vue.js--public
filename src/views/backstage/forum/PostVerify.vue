<template>
    <div v-if="noReportsToShow"
        style="width:30rem;height:20rem;background-color:lightgray;font-size:50px;margin:auto auto;text-align:center;color:white;display:flex;justify-content:center;align-items:center">
        <span>No Report</span>
    </div>
    <!--審核步驟進度條-->
    <div class="page" v-show="!noReportsToShow" style="margin-bottom: 1rem;">
        <div class="parentTopPage">
            <h4 style="text-align: center;text-transform: uppercase;margin-bottom: 2rem;">{{ getTitle }}</h4>
            <div class="stepProgress flexCenter marginCenter" style="width: 30%;position: relative;">
                <div class=" progress" style="width: 95%;margin: 0 auto;">
                    <div class="progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"
                        :style="{ width: stepPercent + '%', backgroundColor: '#78d7eb' }">
                    </div>
                </div>
                <div class="stepCircles flexCenter" style="position: absolute;justify-content: space-between;width: 100%">
                    <div v-for="(step, index) in getStepInfo" :key="index" @click="changeStep(index + 1)"
                        :class="{ flexCenter: true, stepSingleCircle: true, finishStepCss: step.finish, nowStepCss: nowStep == index + 1 }">
                        <span style="font-size:2rem;color: aliceblue;">{{ step.number }}</span>
                        <span :class="{ stepContent: true, nowStepSpanCss: nowStep == index + 1 }">{{ step.content }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="reportSection">
            <!-- 檢舉的審核 -->
            <VerifyShowPost v-show="showStepOne" :haveFinishSteps="haveFinishSteps" :nowStep="nowStep"
                @backFinishSteps="getBackFinishSteps" @backNowStep="getBackNowStep" @saveToBackendData="getSaveData"
                @allposts="getPosts" @usersWithRejected="getUsersWithRejected"
                @sendToBackendReportResult="getSendToBackendReportResult" @noReport="getNoReport" @reasons="getReasons" />
            <!-- 審核結果確認(貼文+使用者)--component -->
            <!-- <VerifyShowPost v-show="showStepOne" :haveFinishSteps="haveFinishSteps" :nowStep="nowStep"
                @backFinishSteps="getBackFinishSteps" @backNowStep="getBackNowStep" :style="{ hiddenCss: false }" /> -->
        </div>
        <div class="checkResult" v-if="showStepTwo" style="width: 70%;margin: 0 auto;">
            <!-- 貼文審核結果的確認 -->
            <div class="postCheckSection flexCenter" style="flex-direction: column;">
                <p class="d-inline-flex gap-1">
                    <button class="btn btn-primary btn-danger" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseExample1" aria-expanded="false" aria-controls="collapseExample1"
                        style="width:30rem">
                        {{ deleteAmountComputed }}&nbsp; Posts would be DELETED
                    </button>
                </p>
                <div class="collapse" id="collapseExample1" v-if="deleteAmountComputed > 0">
                    <div class="card card-body alert alert-danger">
                        these posts would be deleted:
                        <div v-for="deletePostEle in deletePostGroup">
                            <SimpleOnePost :id="deletePostEle.postId" :key="deletePostEle.postId"
                                :propsPost.sync="deletePostEle" :loginUserId="deletePostEle.postUserId" />
                        </div>
                    </div>
                </div>

                <p class="d-inline-flex gap-1">
                    <button class="btn btn-primary btn-warning" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample2"
                        style="width:30rem">
                        {{ hiddenAmountComputed }}&nbsp; Posts's show status would be set PRIVATE
                    </button>
                </p>
                <div class="collapse" id="collapseExample2" v-if="hiddenAmountComputed > 0">
                    <div class="card card-body alert alert-warning">
                        these posts would be hidden:
                        <div v-for="hiddenPostEle in hiddenPostGroup" style="margin: 1rem;">
                            <SimpleOnePost :id="hiddenPostEle.postId" :key="hiddenPostEle.postId"
                                :propsPost.sync="hiddenPostEle" :loginUserId="hiddenPostEle.postUserId" />
                        </div>
                    </div>
                </div>
                <button @click="saveResultStepTwo" class="saveBtn" style="position: absolute;right: 0;bottom: 0;">NEXT
                    STEP</button>
            </div>

            <!-- 使用者審核結果的確認 -->
        </div>

        <div class="checkResult" v-if="nowStep == 3" style="width: 70%;margin: 0 auto;">
            <!-- 貼文審核結果的確認 -->
            <div class="postCheckSection flexCenter" style="flex-direction: column;">

                <p class="d-inline-flex gap-1">
                    <button class="btn btn-primary btn-danger" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample2"
                        style="width:30rem">
                        {{ banPostUserAmountComputed }}&nbsp; Users couldn't POST in 3 days
                    </button>
                </p>
                <div class="collapse" id="collapseExample2" v-if="banPostUserAmountComputed > 0">
                    <div class="card card-body alert alert-danger">
                        these users would be ban the right of post:
                        <!-- <div v-for="hiddenPostEle in hiddenPostGroup">
                            <SimpleOnePost :id="hiddenPostEle.postId" :key="hiddenPostEle.postId"
                                :propsPost.sync="hiddenPostEle" :loginUserId="hiddenPostEle.postUserId" />
                        </div> -->
                    </div>
                </div>
                <p class="d-inline-flex gap-1">
                    <button class="btn btn-primary btn-warning" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseExample2" aria-expanded="false" aria-controls="collapseExample2"
                        style="width:30rem">
                        {{ banReportUserAmountComputed }}&nbsp; Users couldn't REPORT in 3 days
                    </button>
                </p>
                <div class="collapse" id="collapseExample2" v-if="banReportUserAmountComputed > 0">
                    <div class="card card-body alert alert-warning">
                        these users would be ban the right of report:
                        <div v-for="banReportUserEle in banUserReportGroup"
                            style="margin: 1rem;padding: 1rem;background-color: white;border-radius: 1rem;">

                            <div style="display: flex;justify-content: center;align-items: center;">
                                <img :src="banReportUserEle.userPhoto"
                                    style="width: 5rem;height: 5rem;object-fit: cover;border-radius: 50%;" />
                                <div style="margin-left: 1rem;">
                                    <span>userID={{ banReportUserEle.userId }}</span><br>
                                    <span>{{ banReportUserEle.userName }}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <button @click="saveResultStepThree" class="saveBtn" style="position: absolute;right: 0;bottom: 0;">SEND
                RESULT</button>
            <!-- 使用者審核結果的確認 -->
        </div>

        <!-- 確認/下一篇 -->



    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import VerifyShowPost from '@/components/backstage/forum/VerifyShowPost.vue'
import SimpleOnePost from '@/components/backstage/forum/SimpleOnePostForVerify.vue';

const stepPercent = computed(() => {
    return (nowStep.value == 1) ? 0 : (((nowStep.value - 1) / (getStepInfo.value.length - 1)) * 100);
})
// const stepInfo = ref([{ number: '1', content: 'verify report', finish: true }, { number: '2', content: 'check result', finish: true }, { number: '3', content: 'check ban user', finish: true }])
const getStepInfo = computed(() => {
    const stepInfo = ref([{ number: '1', content: 'verify report', now: nowStep.value == 1, finish: haveFinishSteps.value.includes(1) },
    { number: '2', content: "check POST's status", now: nowStep.value == 2, finish: haveFinishSteps.value.includes(2) },
    { number: '3', content: "modify USER's right", now: nowStep.value == 3, finish: haveFinishSteps.value.includes(3) }])
    return stepInfo.value
})
const haveFinishSteps = ref([])
const nowStep = ref(1)
const getTitle = computed(() => {
    return getStepInfo.value[nowStep.value - 1].content
})
const postsRef = ref([])

const sendToBackendReportResult = ref({})

function getBackFinishSteps(newFiniSteps) {
    haveFinishSteps.value = newFiniSteps
    console.log('parent haveFinishSteps', haveFinishSteps.value)
}
function getBackNowStep(newNowStep) {
    nowStep.value = newNowStep
    console.log('parent nowStep', nowStep.value)
}
function getSaveData(computedVal) {
    console.log('有進到getSaveData')
    console.log('parent computedVal', computedVal)
    sendToBackendData.value = computedVal
    console.log('parent sendToBackendData', sendToBackendData.value)
}
function getPosts(posts) {
    // 獲得posts
    console.log('獲得posts', posts)
    console.log('')
    postsRef.value = posts
}
const reasonRef = ref([]);
function getReasons(reasons) {
    reasonRef.value = reasons
}
function getSendToBackendReportResult(sendToBackendReportResultVal) {
    sendToBackendReportResult.value = sendToBackendReportResultVal;
}
const usersWithRejectedRef = ref({})
function getUsersWithRejected(usersWithRejected) {
    usersWithRejectedRef.value = usersWithRejected
}
const showStepOne = computed(() => {
    return nowStep.value == 1
})
const showStepTwo = computed(() => {
    return nowStep.value == 2
})
const showStepThree = computed(() => {
    return nowStep.value == 3
})
function changeStep(newStep) {
    console.log('newStep-1', newStep - 1)
    console.log('getStepInfo.value.length-1', getStepInfo.value.length - 1)
    nowStep.value = newStep
    console.log('stepPercent.value', stepPercent)
}
const sendToBackendData = ref(null)
const saveToBackendDataComputed = computed(() => {
    sendToBackendData.value = {
        'toHiddenPosts': toHiddenPosts.value,
        'toDeletePosts': toDeletePosts.value,
        'toBanPostUsers': toBanPostUsers.value,
        'toBanReportUsers': toBanReportUsers.value
    }
    return sendToBackendData
})
const deleteAmountComputed = computed(() => {
    const toDeletePostList = []
    if (sendToBackendData.value && sendToBackendData.value['toDeletePosts'] && sendToBackendData.value['toDeletePosts'].length > 0) {
        for (const post of postsRef.value) {
            console.log('post', post)
            console.log('sendToBackendData.value["toDeletePosts"]', sendToBackendData.value['toDeletePosts'])
            for (const data of sendToBackendData.value['toDeletePosts']) {
                if (data == post.postId) {
                    toDeletePostList.push(post)
                }
            }
        }
    }
    console.log('toDeletePostList', toDeletePostList)
    deletePostGroup.value = toDeletePostList;
    return sendToBackendData.value && sendToBackendData.value['toDeletePosts'] ? sendToBackendData.value['toDeletePosts'].length : 0;
})
const hiddenAmountComputed = computed(() => {
    const toHiddenPostList = []
    if (sendToBackendData.value && sendToBackendData.value['toHiddenPosts'] && sendToBackendData.value['toHiddenPosts'].length > 0) {
        for (const post of postsRef.value) {
            console.log('post', post)
            console.log('sendToBackendData.value["toHiddenPosts"]', sendToBackendData.value['toHiddenPosts'])
            for (const data of sendToBackendData.value['toHiddenPosts']) {
                if (data == post.postId) {
                    toHiddenPostList.push(post)
                }
            }
        }
    }
    console.log('toHiddenPostList', toHiddenPostList)
    hiddenPostGroup.value = toHiddenPostList;
    return sendToBackendData.value && sendToBackendData.value['toHiddenPosts'] ? sendToBackendData.value['toHiddenPosts'].length : 0;
})
const banPostUserAmountComputed = computed(() => {
    return sendToBackendData.value && sendToBackendData.value['toBanPostUsers'] ? sendToBackendData.value['toBanPostUsers'].length : 0;
})

const usersRef = ref({})
const banReportUserAmountComputed = computed(() => {
    let toBanUserReportList;
    if (sendToBackendData.value && sendToBackendData.value['toBanReportUsers'] && sendToBackendData.value['toBanReportUsers'].length > 0) {
        console.log('usersWithRejectedRef.value', usersWithRejectedRef.value)
        // for (const user of usersWithRejectedRef.value) {
        //     console.log('user', user)
        //     console.log('sendToBackendData.value[toBanReportUsers]', sendToBackendData.value['toBanReportUsers'])
        //     for (const data of sendToBackendData.value['toBanReportUsers']) {
        //         if (data == user.userId) {
        //             toBanUserReportList.push(user)
        //         }
        //     }
        // }
        getUsers();
    }



    return sendToBackendData.value && sendToBackendData.value['toBanReportUsers'] ? sendToBackendData.value['toBanReportUsers'].length : 0;
})

function getUsers() {
    let toBanUserReportList = []
    axiosHelper.get(baseUrl + '/forum/user')
        .then((res) => {
            console.log('res', res.data)
            usersRef.value = res.data

            for (const user of usersRef.value) {
                console.log('user', user)
                console.log('sendToBackendData.value[toBanReportUsers]', sendToBackendData.value['toBanReportUsers'])
                for (const data of sendToBackendData.value['toBanReportUsers']) {

                    if (data == user.userId) {
                        let userChange = {
                            userId: user.userId,
                            userName: user.name,
                            userPhoto: user.userPhoto
                        }
                        toBanUserReportList.push(userChange)
                        console.log('userChange', userChange)
                    }
                }
            }

            banUserReportGroup.value = toBanUserReportList;
            console.log('toBanUserReportList', toBanUserReportList)

        }).catch((err) => {
            console.log('err', err)
        })
    return toBanUserReportList;
}

const deletePostGroup = ref([])
const hiddenPostGroup = ref([])
const banUserReportGroup = ref([])
const banUserPosttGroup = ref([])

// 在 watch 中添加日誌
watch(sendToBackendData, (newValue, oldValue) => {
    console.log('sendToBackendData changed:', newValue);
});

watch(postsRef, (newValue, oldValue) => {
    console.log('posts changed:', newValue);
});

watch(deleteAmountComputed, (newValue, oldValue) => {
    console.log('deleteAmountComputed changed:', newValue);
});

watch(hiddenAmountComputed, (newValue, oldValue) => {
    console.log('hiddenAmountComputed changed:', newValue);
});


function saveResultStepTwo() {
    haveFinishSteps.value.push(2);
    console.log('parent haveFinishSteps', haveFinishSteps.value)
    nowStep.value = 3
    console.log('parent nowStep', nowStep.value)
}
function saveResultStepThree() {
    haveFinishSteps.value.push(3);
    console.log('parent haveFinishSteps', haveFinishSteps.value)
    nowStep.value = 3
    console.log('parent nowStep', nowStep.value)
    sendToBackendExecute();
}

import axios from 'axios';
import Swal from 'sweetalert2';
const axiosHelper = axios.create({
    withCredentials: true
})
const baseUrl = 'http://localhost:8080/remecomic'
const hiddenPostUrl = '/post/update/verifyToHidden' //postIdList、verifyIdList
const deletePostUrl = '/post/delete/verifyToDelete' //postIdList
const banUserPostUrl = '/users/update/toBanPost'
const banUserReportUrl = '/users/update/toBanReport'
const changeReportVerifyStatus = '/report/update';

async function sendToBackendExecute() {
    await axiosHelper.put(baseUrl + changeReportVerifyStatus, sendToBackendReportResult.value)
        .then((res) => {
            console.log(res.data)

            Swal.fire({
                title: "審核已完成",
                icon: 'success'
            })

        }).catch((err) => {
            console.log(err)
        })
    await changeTableByVerifyResult();

}
async function changeTableByVerifyResult() {
    if (sendToBackendData.value['toHiddenPosts'].length > 0) {
        await axiosHelper.put(baseUrl + hiddenPostUrl, {
            postIdList: sendToBackendData.value['toHiddenPosts'].join(","),
            verifyId: 2
        }).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    if (sendToBackendData.value['toDeletePosts'].length > 0) {
        await axiosHelper.delete(baseUrl + deletePostUrl, {
            postIdList: sendToBackendData.value['toDeletePosts'].join(",")
        }).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    if (sendToBackendData.value['toBanPostUsers'].length > 0) {
        await axiosHelper.put(baseUrl + banUserPostUrl, {
            userIdList: sendToBackendData.value['toBanPostUsers'].join(",")
        }).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }
    if (sendToBackendData.value['toBanReportUsers'].length > 0) {
        await axiosHelper.put(baseUrl + banUserReportUrl, {
            userIdList: sendToBackendData.value['toBanReportUsers'].join(",")
        }).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }
}
const noReportsToShow = ref(true)
function getNoReport(check) {
    noReportsToShow.value = check
}
</script>

<style scoped>
/* * {
    border: solid 0.5px;
} */

.parentTopPage {
    transform: translateY(-70px);
}

.flexCenter {
    display: flex;
    justify-content: center;
    align-items: center;
}

.marginCenter {
    margin: 0 auto;
}

.stepSingleCircle {
    border-radius: 50%;
    border: solid 3px white;
    width: 3rem;
    height: 3rem;
    background-color: gray;
    pointer-events: none;
}

.stepContent {
    position: absolute;
    bottom: -2rem;
    width: 10rem;
    text-align: center;
    color: gray;
}

.stepSingleCircle:hover .stepContent {
    color: #0dcaf0;
}

.stepSingleCircle:hover {
    cursor: pointer;
    background-color: #0dcaf0;
}

.finishStepCss {
    background-color: #78d7eb;
    pointer-events: all;
}

.nowStepCss {
    background-color: darkcyan;
    pointer-events: all;
}

.nowStepSpanCss {
    color: darkcyan;
}

.nowStepCss:hover {
    background-color: darkcyan;
}

.stepSingleCircle:hover .nowStepSpanCss {
    color: darkcyan;
}

.saveBtn {
    font-size: 1.5rem;
    padding: 0.5rem;
    border-radius: 1rem;
    background-color: #78d7eb;
    color: white;
    font-weight: 600;
    border: lightgray;
    transition: 0.5s;
    transform: translateY(4rem);
}
</style>