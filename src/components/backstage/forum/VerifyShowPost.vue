<template>
    <!-- Vue 註解 -->
    <div class="reportShow flexCenter">

        <!-- 審核進度展示 -->
        <div class="verifyingReportCountSection" style="position: absolute;top: 0;left: 0;">
            <div class="btn-group groupProgressCheck" role="group" aria-label="Basic checkbox toggle button group"
                style="display: flex;flex-direction: column;max-width: fit-content;">
                <div class="singleProgressCheck" style="cursor: default;">
                    <input type="button" style="cursor: default;" class="btn-check">
                    <label class="singleProgressCheckLabel" style="cursor:default;">
                        <span style="font-size: 2rem;">Progress</span></label>
                    <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25"
                        aria-valuemin="0" aria-valuemax="100" style="border-radius:0;">
                        <div class="progress-bar" :style="{
                            width: verifyProgress + '%', backgroundColor: '#0dcaf0'
                        }">{{ verifyProgress }}%</div>
                    </div>
                </div>
                <div class="singleProgressCheck">
                    <input type="button" class="btn-check">
                    <label class="singleProgressCheckLabel" style="cursor:default;"><span
                            style="font-size: 1rem;">Post:</span>
                        {{ (haveVerifyPostId.length == 0 ? 0 : haveVerifyPostId.length) }} /
                        {{ (posts == null ? 0 : posts.length) }}</label>
                </div>
                <div class="singleProgressCheck">
                    <input type="button" class="btn-check">
                    <label class="singleProgressCheckLabel" style="cursor:default;"><span
                            style="font-size: 1rem;">Report:</span>
                        {{ (haveVerifyReportId.length) }} /
                        {{ (reports == null ? 0 : reports.length) }}</label>
                </div>
            </div>
        </div>

        <div class="postShow flexCenter" style="flex-direction: column;">

            <!-- 分頁跳轉 -->
            <div class="pageChangeBar"
                style="margin: 1rem;width: 100%;text-align: center;display: flex;justify-content: center;">

                <!-- 當前頁數 + 前後頁 -->
                <div v-for="(post, index) in posts" :key="index">
                    <button v-if="shouldDisplayButton(index)" :class="{
                        pageBtnCss: true,
                        finishBtnCss: haveVerifyPostId.includes(posts[index].postId),
                        nowPageBtnCss: (index === currentPostIndex)
                    }" @click="changePostIndex(index)">
                        {{ index + 1 }}
                    </button>

                </div>

            </div>

            <div class="onePostSection flexCenter" v-if="currentPost">

                <font-awesome-icon :icon="['fas', 'circle-arrow-right']" rotation=180 @click="prePost" class="clickIcon" />
                <!-- 貼文顯示 -->

                <SimpleOnePost :id="currentPost.postId" :key="currentPost.postId" :propsPost.sync="currentPost"
                    :loginUserId="currentPost.postUserId" />

                <font-awesome-icon :icon="['fas', 'circle-arrow-right']" @click="nextPost" class="clickIcon" />

            </div>
            <!-- 該貼文收到的檢舉顯示(按檢舉理由) -->

            <div class="verifyCheckSection flexCenter" style="flex-wrap:wrap;margin: 2rem;">

                <div class="btn-group groupReasonCheck" role="group" aria-label="Basic checkbox toggle button group">
                    <div v-for="(  reason, index  ) in   currentPostReasons  " :key="reason"
                        class="singleReasonCheck flexCenter" style="flex-wrap: wrap-reverse;">
                        <input type="checkbox" v-model="verifyResult[currentPost.postId][reason]" class="btn-check"
                            :id="'btncheck' + index" autocomplete="off"
                            @change="changeToSendBackResult(verifyResult[currentPost.postId][reason], currentPost.postId, reason)">
                        <label
                            :class="{ 'singleReasonCheckLabel': true, 'checkedBecomeBlue': verifyResult[currentPost.postId][reason] }"
                            :for="'btncheck' + index">
                            {{ reasons[reason - 1].reasonContent }}
                            <span style="background-color: gray;" class="badge rounded-pill currentPostReasonBadge"
                                data-bs-toggle="modal" data-bs-target="#exampleModal"
                                @click.stop="showModal($event, reason)">
                                {{ currentPost.reportReasonMap[reason].length }}</span>

                            <!-- 顯示該以該理由檢舉這則貼文的檢舉 -->
                            <!-- Modal -->
                            <div class="currentPostReportSection">
                                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                                    aria-hidden="true">
                                    <div class="modal-dialog" style="max-width: fit-content;position: relative;top: 6rem;">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="exampleModalLabe">[
                                                    {{ reasons[getModalReason - 1].reasonContent }} ] Reports </h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                Reason : {{ reasons[getModalReason - 1].reasonContent }}<br />
                                                Number of Reports : {{ getReportReasonCount }}
                                                <hr>
                                                <table>
                                                    <tr>
                                                        <th v-for="column in reportTableColumn">{{ column }}</th>
                                                    </tr>
                                                    <tr v-for="reportReason in currentPost.reportReasonMap[getModalReason]">
                                                        <td v-for="column in reportTableColumn">
                                                            <span v-if="column != 'reason' && column != 'verifyStatus'">
                                                                {{ reportReason[column] }}</span>
                                                            <!-- <span v-else-if="column == 'reason'">
                                                                {{ reasons[(reportReason['reasonId'] - 1)]['reasonContent']
                                                                }}</span> -->
                                                            <!-- <span v-else-if="column == 'verifyStatus'">
                                                                {{ verifys[(reportReason['verifyId'] - 1)] }}</span> -->
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary"
                                                    data-bs-dismiss="modal">Close</button>
                                                <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>



                        </label>



                    </div>
                </div>
            </div>
        </div>

        <div class="postReportAmount"></div>
        <button @click="saveResult" :class="{ saveBtn: true, disabledCss: verifyProgress != 100 }"
            style="position: absolute;right: 0;bottom: 0;border-color: transparent;" :disabled="verifyProgress != 100">NEXT
            STEP</button>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import axios from 'axios';
import httpClient from '@/main.js';
import { isEmptyObject } from 'jquery';
import SimpleOnePost from '@/components/backstage/forum/SimpleOnePostForVerify.vue';

const props = defineProps(['haveFinishSteps', 'nowStep'])
const emit = defineEmits(['currentPostIndex', 'backFinishSteps', 'backNowStep', 'allposts', 'usersWithRejected', 'saveToBackendData', 'sendToBackendReportResult', 'noReport', 'reasons'])
//從後端接收的資料集
const reasons = ref([])
const posts = ref({})
const reports = ref([])
const usersWithRejected = ref([])

//處理並記錄即時狀況的資料集
const verifyResult = ref([])
const currentPostIndex = ref(0)
const currentPost = ref(null)
const currentPostReasons = ref(null)
const haveVerifyPostId = ref([])
const haveVerifyReportId = ref([])

const verifyProgress = computed(() => {
    if (posts.value.length == 1) {
        console.log('posts.value.length', posts.value.length)
        return 100;
    } else {
        return (reports.value == null) || (haveVerifyPostId.value.length == 0) ? 0 :
            ((((haveVerifyPostId.value.length - 1) / (posts.value.length - 1)) * 100).toFixed())
    }

})
const lastPostIndex = computed(() => {
    return posts.value.length - 1;
});
const isPageHaveVerifyPost = computed(() => {
    if (!posts.value || !haveVerifyPostId.value) {
        return false; // 防止未定義的情況
    }
    const lastPost = posts.value[lastPostIndex.value];
    if (!lastPost || !lastPost.postId) {
        return false; // 防止未定義的情況
    }

    return haveVerifyPostId.value.includes(lastPost.postId);
});

//即時記錄更改，傳送到後端的資料集
const sendToBackendVerifyData = ref({
    '1': [],
    '2': [],
    '3': []
})
//轉換後，傳送到後端的資料集
const toHiddenPosts = ref([])
const toDeletePosts = ref([])
const toBanPostUsers = ref([])
const toSearchBanReportUsers = ref([])//中介，會再用它傳給後端查一次資料，然後toBanReportUsers接回傳資料
const toBanReportUsers = ref([])
const saveToBackendData = computed(() => {
    const sendToBackendData = {
        'toHiddenPosts': toHiddenPosts.value,
        'toDeletePosts': toDeletePosts.value,
        'toBanPostUsers': toBanPostUsers.value,
        'toBanReportUsers': toBanReportUsers.value
    }
    return sendToBackendData
})
//小工具們╰(*°▽°*)╯
const axiosHelper = axios.create({
    withCredentials: true
})
const colors = ['#F1ACC2', '#D9B611', '#4C8DAE', '#789262', '#AEDDEF', '#003371', '#4A4266']
const reportTableColumn = ['reportId', 'reportUserName', 'reportTime']
const verifys = ['Not reviewed', 'Approved', 'Rejected']
const baseUrl = 'http://localhost:8080/remecomic'
const getPostUrl = '/post/report/show'
const getReasonUrl = '/reason/show'
const getReportUrl = '/report/show/withVerify'
const searchUsersRejectedReport = '/users/reportRejectCount'
const modalReason = ref(1)
const getModalReason = computed(() => {
    return modalReason.value
})
onMounted(() => {
    getPostWithReport()
    getReason()
    getReport()
})

//初始化頁面、載入資料
// getPostWithReport()
// getReason()
// getReport()

function getReason() {
    axiosHelper.get(baseUrl + getReasonUrl)
        .then(res => {
            console.log(res.data)
            reasons.value = res.data
            console.log(verifyResult)
        }).catch(err => {
            console.log(err)
        })
}
function getPostWithReport() {
    axiosHelper.get(baseUrl + getPostUrl)
        .then(res => {
            console.log(res.data)
            posts.value = res.data
            if (res.data == null || res.data.length == 0) {
                emit('noReport', true)
            } else {
                emit('noReport', false)
            }
            for (let i = 0; i < posts.value.length; i++) {
                verifyResult.value[posts.value[i].postId] = {}

                let everyPostReasons = Object.keys(posts.value[i].reportReasonMap)
                for (let j = 0; j < everyPostReasons.length; j++) {
                    verifyResult.value[posts.value[i].postId][everyPostReasons[j]] = false
                }
            }
            currentPost.value = posts.value[currentPostIndex.value]
            currentPostReasons.value = Object.keys(currentPost.value.reportReasonMap)


        }).catch(err => {
            console.log(err)
        })
}
function getReport() {
    axiosHelper.get(baseUrl + getReportUrl)
        .then(res => {
            console.log(res.data)
            reports.value = res.data
            for (let i = 0; i < reports.value.length; i++) {
                sendToBackendVerifyData.value['1'].push(reports.value[i].reportId)
            }

        }).catch(err => {
            console.log(err)
        })
}
function searchUsersIfToBanReport() {
    axiosHelper.get(baseUrl + searchUsersRejectedReport, {
        params: {
            userIdList: Array.from(toSearchBanReportUsers.value).join(',')
        }
    })
        .then(res => {
            console.log('res data = ', res.data)
            usersWithRejected.value = res.data
            console.log('usersWithRejected.value', usersWithRejected.value)
            // console.log('usersWithRejected.value', usersWithRejected.value)
            emit('usersWithRejected', usersWithRejected.value)
            //轉換成 要送到後端的 toBanReportUsers
            //step 1. 獲得審核未通過的reprots ids
            const rejectedReportIdList = sendToBackendVerifyData.value['3']
            //step 2. 計算 此次 檢舉者的檢舉失敗的數量
            const userRejectedReportMap = {} //結構：{'user id1':本次審核通過的report 數量,'user id2': ...}
            //遍歷所有審核未通過的report
            rejectedReportIdList.forEach(rejectedReportId => {
                //獲得審核未通過的report詳細資料，從中獲得user id
                const report = reports.value.find(report => report.reportId == rejectedReportId)
                if (report != null) {
                    const reportUserId = report.reportUserId
                    if (userRejectedReportMap[reportUserId] === undefined) {
                        userRejectedReportMap[reportUserId] = 0
                    }
                    userRejectedReportMap[reportUserId] += 1
                }

            })
            console.log('本次審核中 檢舉者user 的檢舉未通過的總量:', userRejectedReportMap)
            //小結，如此一來，就獲得了 本次審核中 檢舉者user 的檢舉未通過的總量計算

            //step 3. 七天內 (此次+之前) 檢舉失敗的數量 >= 3 => 限制使用者三內內不可檢舉
            for (let reportUserId in userRejectedReportMap) {
                const thisTimeReportAmount = userRejectedReportMap[reportUserId]
                console.log('本次審核中 檢舉者user 的檢舉未通過的總量:', thisTimeReportAmount)
                const user = usersWithRejected.value.find(user => user.userId == reportUserId)
                const originalRejectedAmount = user ? user.rejectTimes : 0;
                console.log('過去審核中 檢舉者user 的檢舉未通過的總量:', originalRejectedAmount)
                if (thisTimeReportAmount + originalRejectedAmount >= 3) {
                    toBanReportUsers.value.push(reportUserId)
                }
            }
            //小結，完成要傳送給後端 的 user to ban report 處置資料

        }).catch(err => {
            console.log(err)
        })
}
function changeToSendBackResult(isVerifyTrue, postId, reasonId) {

    const post = posts.value.find(post => post.postId === postId)
    const postOneReasonMap = post.reportReasonMap[reasonId]
    for (let i = 0; i < postOneReasonMap.length; i++) {
        const reportId = postOneReasonMap[i].reportId


        const approveList = sendToBackendVerifyData.value['2'];
        const rejectList = sendToBackendVerifyData.value['3'];
        const haveNotVerifyList = sendToBackendVerifyData.value['1'];

        handleVerification(reportId, isVerifyTrue, approveList, rejectList, haveNotVerifyList);
    }
}
function handleVerification(reportId, isVerifyTrue, approveList, rejectList, haveNotVerifyList) {
    const approveListIndex = approveList.indexOf(reportId)
    const rejectListIndex = rejectList.indexOf(reportId)
    const haveNotVerifyListIndex = haveNotVerifyList.indexOf(reportId)
    if (isVerifyTrue) {//如果審核通過
        if (approveListIndex === -1) {
            approveList.push(reportId);
        }
        if (rejectListIndex != -1) {
            rejectList.splice(rejectListIndex, 1);
        }
    } else {//如果審核失敗
        if (rejectListIndex === -1) {
            rejectList.push(reportId);
        }
        if (approveListIndex != -1) {
            approveList.splice(approveListIndex, 1);
        }
    }
    // 移出未審核清單
    if (haveNotVerifyListIndex !== -1) {
        haveNotVerifyList.splice(haveNotVerifyListIndex, 1);
    }
}
function showModal(event, reason) {

    var modalBackdrop = document.querySelector('.modal-backdrop');

    // 如果找到，則從父節點中刪除它
    if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
    }
    event.stopPropagation();
    event.preventDefault();

    console.log('reason', reason)
    modalReason.value = reason
}
const saveResult = async () => {

    console.log('點擊')
    const childHaveFiniSteps = props.haveFinishSteps
    childHaveFiniSteps.push(props.nowStep)
    const newNowStep = props.nowStep + 1
    childHaveFiniSteps.push(newNowStep)
    console.log('child haveFinishSteps', childHaveFiniSteps)
    console.log('child nowStep', newNowStep)
    emit('backFinishSteps', childHaveFiniSteps)
    emit('backNowStep', newNowStep)

    sendToBackendVerifyData.value['3'] = sendToBackendVerifyData.value['3'].concat(sendToBackendVerifyData.value['1'])
    sendToBackendVerifyData.value['1'] = [];
    console.log('after', sendToBackendVerifyData.value)

    //計算要送到後端查詢/做確認的資料( 判斷：是否更刪貼文/ban使用者？)
    toHiddenPosts.value = []
    toDeletePosts.value = []
    toBanPostUsers.value = []
    toSearchBanReportUsers.value = []
    //關於post：計算 toHiddenPosts、 toDeletePosts 、toBanPostUsers

    // step 1
    //獲得審核通過的report ids
    const approvedReportIdList = sendToBackendVerifyData.value['2']
    //計算本次審核中各個post各自獲得了多少審核通過的report
    const postApprovedReportMap = {} //結構：{'post id 1':本次審核通過的report 數量 ,'post id 2':本次審核通過的report 數量...}
    //遍歷所有審核通過的report
    approvedReportIdList.forEach(approvedReportId => {
        //獲得審核通過的report詳細資料，從中獲得post id
        const report = reports.value.find(report => report.reportId == approvedReportId)
        if (report != null) {
            const postId = report.postId
            if (postApprovedReportMap[postId] === undefined) {
                postApprovedReportMap[postId] = 0
            }
            postApprovedReportMap[postId] += 1
        }

    })
    //小結，如此一來，就獲得了 本次審核中各個post各自獲得了多少審核通過的report 的計算

    // step 2
    //計算 各個 post 本次 與 原本 的 審核通過之檢舉 數量
    for (let postId in postApprovedReportMap) {
        const thisTimeReportAmount = postApprovedReportMap[postId]

        //獲得原本的數量值
        const report = reports.value.find(report => report.postId == postId)
        const originalReportAmount = report.postHaveApprovedReportCount
        const originalHiddenAmount = report.postVerifyHidden

        //判斷該post是否要hidden
        //>=3者要hidden
        if (thisTimeReportAmount + originalReportAmount >= 3) {
            //判斷該post是否要delete
            //該貼文已經被管理員隱藏太多次者，直接刪除貼文
            if (originalHiddenAmount >= 2) {
                toDeletePosts.value.push(postId)

                //如果該貼文要被刪除，判斷是否要限制發布貼文的使用者發文權利
                //判斷方式：使用者是否「已經」被刪除過>=2，這次將達到第三次以上的刪除紀錄？
                const originalDeleteAmount = report.postUserHaveBeenDeletedCount
                if (originalDeleteAmount >= 2) {
                    toBanPostUsers.value.push(report.postUserId)
                }
            } else {
                toHiddenPosts.value.push(postId)
            }
        }

    }
    //小結，完成要傳送給後端 的 (post to delete/to hidden)& ( user to ban post) 處置資料

    //計算 toSearchBanReportUsers

    // step 1
    //獲得審核「未通過」的report ids
    const rejectedReportIdList = sendToBackendVerifyData.value['3']
    //遍歷所有未通過的report ids
    for (let i = 0; i < rejectedReportIdList.length; i++) {
        //透過reports來獲得該report的檢舉者user id
        const report = reports.value.find(report => report.reportId === rejectedReportIdList[i])
        const reportUserId = report.reportUserId
        //不重複地把檢舉者的user id加入list
        if (!toSearchBanReportUsers.value.includes(reportUserId)) {
            toSearchBanReportUsers.value.push(reportUserId)
        }
    }
    console.log(toSearchBanReportUsers.value)
    //小結，完成要傳送給後端 去search 的 ban user to report 處置資料
    await searchUsersIfToBanReport();//完成要傳送給後端 的 ban user to report 處置資料
    console.log('發射posts前，確認posts', posts.value)
    emit('allposts', posts.value)

    console.log('saveToBackendData', saveToBackendData)
    emit('saveToBackendData', saveToBackendData.value)
    emit('sendToBackendReportResult', sendToBackendVerifyData.value)
    emit('reasons', reasons.value)
    // emit('backFinishSteps', childHaveFiniSteps)
    // emit('backNowStep', newNowStep)
}
function changePostIndex(newPostIndex) {
    currentPostIndex.value = newPostIndex
}
// function throwCurrentPostId() {
//     console.log('child postId', currentPostIndex.value)
//     emit('currentPostIndex', currentPostIndex.value)
// }
watch(currentPostIndex, () => {
    // throwCurrentPostId()
    currentPost.value = posts.value[currentPostIndex.value]
    currentPostReasons.value = Object.keys(currentPost.value.reportReasonMap)

    //顯示已審核完成的post、report數量的即時更新
    if (!haveVerifyPostId.value.includes(currentPost.value.postId)) {
        if (haveVerifyPostId.value.length == 0) {
            console.log('haveVerifyPostId is nothing')
            haveVerifyPostId.value.push(posts.value[0].postId)
        }
        haveVerifyPostId.value.push(currentPost.value.postId)
    }
    for (let i = 0; i < reports.value.length; i++) {
        if (reports.value[i].postId === currentPost.value.postId) {
            if (!haveVerifyReportId.value.includes(reports.value[i].reportId)) {
                haveVerifyReportId.value.push(reports.value[i].reportId)
            }
        }
    }



})
watch(sendToBackendVerifyData, () => {
    console.log(sendToBackendVerifyData.value)
}, { deep: true })
function nextPost() {
    currentPostIndex.value = (currentPostIndex.value + 1) % posts.value.length
    console.log('nextPost currentPostIndex.value', currentPostIndex.value)
    // throwCurrentPostId(currentPostIndex.value)
}
function prePost() {
    currentPostIndex.value = (currentPostIndex.value - 1 + posts.value.length) % posts.value.length
    console.log('prePost currentPostIndex.value', currentPostIndex.value)
    // throwCurrentPostId(currentPostIndex.value)
}
function shouldDisplayButton(index) {
    const lowerBound = currentPostIndex.value - 2;
    const upperBound = currentPostIndex.value + 2;
    return lowerBound <= index && index <= upperBound;

}
const getReportReasonCount = ref(0)
watch(modalReason, () => {
    getReportReasonCount.value = currentPost.value.reportReasonMap[modalReason.value].length;
});
</script>

<style scoped>
* {
    /* border: 1px solid; */
    box-sizing: border-box;
}

/* :root {
    --primary: Aquamarine;
    --background-color: Teal;
} */

.flexCenter {
    display: flex;
    justify-content: center;
    align-items: center;
}

.marginCenter {
    margin: 0 auto;
}

.reportShow {
    position: relative;
    border-radius: 5px;
    margin: 0rem 0 0 0;
}

.postShow {
    border-radius: 5px;
    background-color: lightgray;
    margin: 0;
    width: 50rem;
    font-size: smaller;
    /* height: 500px; */
    /* transform: scale(80%) translateY(-5rem); */
}

.clickIcon:hover {
    cursor: pointer;
}

.clickIcon {
    width: 3rem;
    height: 3rem;
    margin: 1rem;
    background-color: white;
    border-radius: 50%;
}

.singleReasonCheck {
    border: solid 2px #78d7eb;
    overflow: hidden;
    border-color: lightgray;
    background-color: #e9ecef;
}

.singleProgressCheck {
    border: solid 2px #78d7eb;
    overflow: hidden;
    border-color: white;
    background-color: #e9ecef;
    /* width: 270px; */
}

.singleReasonCheck:first-child {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
}

.singleReasonCheck:last-child {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
}

.singleReasonCheckLabel,
.singleProgressCheckLabel {
    width: 100%;
    height: 100%;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: 0.25s;
}

.checkedBecomeBlue {
    background-color: #78d7eb;
    color: white;
}

.singleProgressCheck {
    font-size: 1.5rem;
    color: #fff;
}

.singleProgressCheck:first-child {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    font-size: 3rem;

    background: linear-gradient(45deg, gray, #054452);
    font-weight: 900;

}

.singleProgressCheck:nth-child(2) {
    background: linear-gradient(45deg, gray, #46a4b8);
}

.singleProgressCheck:last-child {
    background: linear-gradient(45deg, gray, #46a4b8);
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}

table {
    text-align: center;
}

td,
th {
    padding: 0.5rem 1rem;
    border-bottom: solid lightgray 1px;
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
    /* transform: translateY(4rem); */
}

.saveBtn:hover {
    background-color: #0dcaf0;
}

.saveBtn:active {
    background-color: #054452;
}

.pageBtnCss {
    border: transparent solid 1px;
    border-radius: 50%;
    color: white;
    background-color: gray;
    font-weight: 900;
    width: 2rem;
    height: 2rem;
    margin: 0 0.5rem;
}

.pageBtnCss:hover {
    transform: scale(1.1);
}

.finishBtnCss {
    background-color: darkgray
}

.nowPageBtnCss {
    background-color: #0dcaf0;
    color: white;
}

.nowPageBtnCss:hover {
    transform: scale(1.1);
}

.canvas {
    height: 100vh;
}

.disabledCss {
    background-color: gray;
}
</style>