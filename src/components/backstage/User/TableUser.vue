<template>
    <div>
        <!-- 用戶管理介面的主要容器 -->
        <div class="TableUser">
            <!-- 用戶數據表格 -->
            <vxe-table
                show-overflow
                border
                ref="xTable"
                height="700"
                :column-config="{ resizable: true }"
                :row-config="{ isHover: true, height: 120 }"
                :data="tableData"
                @cell-dblclick="cellDBLClickEvent"
                :empty-text="customEmptyText"
                column-config.resizable
                :loading="submitLoading"
                :edit-config="{ trigger: 'click', mode: 'cell' }"
            >
                <!-- 用戶數據列 -->
                <vxe-column
                    field="userId"
                    title="UserId"
                    width="100"
                    class="vxe-column"
                ></vxe-column>
                <vxe-column field="userPhoto" title="User Photo" width="120px">
                    <template #default="{ row }">
                        <div class="userPhotoCont">
                            <img
                                v-if="row.userPhoto"
                                :src="row.userPhoto"
                                alt="User Photo"
                            />
                            <img
                                v-else
                                :src="defaultPhoto"
                                alt="Default Photo"
                            />
                        </div>
                    </template>
                </vxe-column>

                <vxe-column field="name" title="Name"></vxe-column>
                <vxe-column
                    field="gender"
                    title="Gender"
                    :filters="genderFilters"
                ></vxe-column>
                <vxe-column
                    field="email"
                    title="Email"
                    width="200px"
                ></vxe-column>
                <vxe-column field="birthDate" title="Birthday"></vxe-column>
                <vxe-column
                    field="registerDate"
                    title="RegisterDate"
                ></vxe-column>

                <!-- 展開列，用戶徽章訊息 -->
                <vxe-column
                    field="badges"
                    title="Badges"
                    type="expand"
                    width="150"
                >
                    <template #content="{ row }">
                        <div class="expand-wrapper">
                            <!-- 顯示徽章圖片 -->
                            <span
                                class="badge-circle"
                                v-for="badge in row.badges"
                                :key="badge.badgeId"
                            >
                                <img
                                    class="badge_img"
                                    :src="badge.badgePhoto"
                                    alt="Badge Photo"
                                    :title="badge.badgeName"
                                    @click="openBadgeModal(row)"
                                />
                            </span>
                        </div>
                    </template>
                </vxe-column>
                <vxe-column
                    field="status"
                    title="Status"
                    :formatter="statusFormatter"
                ></vxe-column>

                <!-- 加載中的文字(可圖片) -->
                <template #loading>
                    <div>LOADING...</div>
                </template>
            </vxe-table>

            <!-- 用戶的彈出框 -->
            <vxe-modal
                v-model="showEdit"
                title="Status Edit"
                width="700"
                height="400"
                :loading="submitLoading"
                resize
                destroy-on-close
            >
                <!-- 表單 -->
                <template #default>
                    <vxe-form
                        :data="formData"
                        :rules="formRules"
                        title-align="right"
                        title-width="100"
                        @submit="submitEvent"
                    >
                        <vxe-form-item
                            title="Basic information"
                            title-align="left"
                            :title-width="200"
                            :span="24"
                            :title-prefix="{ icon: 'vxe-icon-comment' }"
                        ></vxe-form-item>
                        <vxe-form-item field="name" title="Name">
                            <template #default="{ data }">
                                <vxe-input
                                    v-model="data.name"
                                    disabled
                                ></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="email" title="Email">
                            <template #default="{ data }">
                                <vxe-input
                                    v-model="data.email"
                                    disabled
                                ></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="gender" title="Gender">
                            <template #default="{ data }">
                                <vxe-select v-model="data.gender" disabled>
                                </vxe-select>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item field="birthDate" title="Birthday">
                            <template #default="{ data }">
                                <vxe-input
                                    v-model="data.birthDate"
                                    type="date"
                                    disabled
                                ></vxe-input>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item
                            field="status"
                            title="Status"
                            :formatter="statusFormatter"
                        >
                            <template #default="{ data }">
                                <vxe-radio-group v-model="data.status.statusId">
                                    <vxe-radio
                                        :label="1"
                                        content="Administrator"
                                    />
                                    <vxe-radio :label="2" content="General" />
                                    <vxe-radio :label="3" content="Banned" />
                                </vxe-radio-group>
                            </template>
                        </vxe-form-item>
                        <vxe-form-item
                            align="center"
                            title-align="left"
                            :span="24"
                        >
                            <template #default>
                                <vxe-button type="submit">Send</vxe-button>
                                <vxe-button type="reset">Reset</vxe-button>
                            </template>
                        </vxe-form-item>
                    </vxe-form>
                </template>
            </vxe-modal>
        </div>

        <!-- 編輯/添加用戶徽章的彈出框 -->
        <vxe-modal v-model="showBadgeModal" title="Edit Badges">
            <!-- 所有badge -->
            <div class="all-badge-list">
                <span
                    class="all-badge-circle"
                    v-for="badge in allBadges"
                    :key="badge.badgeId"
                    :style="{
                        backgroundColor: isBadgeSelected(badge)
                            ? 'lightskyblue'
                            : 'lightgray',
                    }"
                    @click="toggleBadge(badge)"
                >
                    <img
                        class="all-badge-img"
                        :src="badge.badgePhoto"
                        :style="{
                            filter: isBadgeSelected(badge)
                                ? 'none'
                                : 'grayscale(100%)',
                        }"
                    />
                </span>
            </div>
            <!-- 送出按鈕 -->
            <vxe-button @click="submitBadgeChanges">Submit</vxe-button>
        </vxe-modal>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import httpClient from "@/main.js";
import { VXETable } from "vxe-table";
import "vxe-table/lib/style.css";
const xTable = ref();

const defaultPhoto =
    "https://firebasestorage.googleapis.com/v0/b/remetest-e1cbe.appspot.com/o/Basic%2F%E5%8E%9F%E5%A7%8B%E9%A3%AF%E7%B3%B0%E4%BA%BA.png?alt=media&token=2e261207-d91b-42ff-acc5-a78bbec1369a";

// form表單的數據
const formData = reactive({
    name: "",
    email: "",
    birthDate: "",
    gender: "",
    status: {
        statusId: 1,
    },
});

// 用於控制提交按鈕的 loading 狀態，當數據提交時會設置為 true。
const submitLoading = ref(false);

// 用於控制編輯/添加用戶的彈出框顯示與隱藏。
const showEdit = ref(false);

// 保存當前選中的用戶數據。
const selectRow = ref();

// 後端傳過來的UserData(json)
const tableData = ref([]);

// 性別的篩選器數據。
const genderFilters = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
];

// 用戶表單的驗證規則，包括對名稱和狀態的驗證規則。
const formRules = reactive({
    status: [{ required: true }],
});

// 編輯用戶的按鈕
const editEvent = (row) => {
    Object.assign(formData, row);
    selectRow.value = row;
    showEdit.value = true;
    formData.status.statusId = row.status.statusId;
    console.log(formData);
};

const cellDBLClickEvent = ({ row }) => {
    editEvent(row);
};

// 送出的按鈕
const submitEvent = () => {
    submitLoading.value = true;

    httpClient
        .put("/user/update", formData)
        .then(() => {
            VXETable.modal.message({
                content: "User updated successfully",
                status: "success",
            });
            // 在前端更新表格中的使用者資訊
            const index = tableData.value.findIndex(
                (item) => item.userId === formData.userId
            );
            if (index !== -1) {
                Object.assign(tableData.value[index], formData);
            }
            gettableData();
        })
        .catch((error) => {
            console.error("Error updating user:", error);
        })
        .finally(() => {
            submitLoading.value = false;
            showEdit.value = false;
        });
};

// onMounted(gettableData());

const gettableData = async () => {
    submitLoading.value = true;
    // const checkCookie = await httpClient.get("userA/checkCookie");
    const simpleuser = await httpClient.get("/user/simpleusers");
    const users = simpleuser.data;
    // console.log(tableData.value.status.statusId)

    // 獲得用戶所有badge
    const badges = users.reduce((acc, user) => {
        acc.push(...user.badges);
        return acc;
    }, []);

    // 將獲取到的userBadge存在 userBadges 中
    userBadges.value = badges;
    tableData.value = users;
    submitLoading.value = false;
};
gettableData();

// 用於格式化表格中status列的數據顯示。
const statusFormatter = ({ cellValue }) => {
    return cellValue && cellValue.statusName ? cellValue.statusName : "Unknown";
};

//run數據時wait
const customEmptyText = "No data available";

// 用於控制編輯/添加用戶徽章的彈出框顯示與隱藏。
const showBadgeModal = ref(false);

// 保存當前處理的用戶數據。
const rowUser = ref({});

// 控制徽章彈出框的顯示
const openModal = ref(false);

// 包含所有徽章的數據。
const allBadges = ref([]);

// 保存用戶的徽章數據。
const userBadges = ref([]);

// 控制徽章彈出框的顯示。
const openBadgeModal = (row) => {
    // 在打開編輯badge的彈窗時設置選中的用戶ID
    // console.log("row" + row);
    // console.log("row user" + row.userId);

    if (selectRow.value) {
    } else {
        console.error("No user selected.");
    }
    showBadgeModal.value = true;

    rowUser.value = row;
    openModal.value = true;
    userBadges.value = row.badges;
    const rowUserId = row.userId;
    httpClient.get("/badge/simplebadges").then((response) => {
        allBadges.value = response.data;
    });
};

// 判斷徽章是否被選中的方法
const isBadgeSelected = (badge) => {
    return userBadges.value.some(
        (userBadge) => userBadge.badgeId === badge.badgeId
    );
};

// 點擊徽章時切換選中狀態的方法。
const toggleBadge = (badge) => {
    const badgeIndex = userBadges.value.findIndex(
        (userBadge) => userBadge.badgeId === badge.badgeId
    );
    if (badgeIndex !== -1) {
        // 已有該徽章就移除
        userBadges.value.splice(badgeIndex, 1);
    } else {
        // 沒有該徽章就添加
        userBadges.value.push(badge);
    }
};

// 保存用戶所選擇的徽章數據。
// const selectedBadges = ref([]);

// 提交用戶徽章更改的方法，將用戶選擇的徽章數據提交到後端。
const submitBadgeChanges = () => {
    // const userId = row.userId; // 從 formData 中獲取 userId

    // console.log("Current userId:", rowUser.value.userId);
    // console.log("Current badge:", userBadges.value);

    const userId = rowUser.value.userId;
    const badge = userBadges.value;
    let badgeIdList = [];

    badge.forEach((badge) => {
        badgeIdList.push(badge.badgeId);
    });

    const updateData = {
        userId: userId,
        userBadgeId: badgeIdList,
    };

    console.log(updateData);
    // console.log("Current userId:", userId);
    // 將所選擇的徽章信息提交到後端
    httpClient
        .put(`/user/updateBadges`, updateData)
        .then((response) => {
            // 成功提交徽章變更
            // console.log("Badges updated successfully:", response.data);
            showBadgeModal.value = false;
            VXETable.modal.message({
                content: "UserBadge updated successfully",
                status: "success",
            });
        })
        .catch((error) => {
            console.error("Error updating badges:", error);
        });
};
</script>

<style scoped>
.TableUser {
    margin: 20px 10px 0 10px;
}

/* .badge_img {
    width: 50px;
} */
.expand-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.badge-circle {
    height: 50px;
    width: 50px;
    widows: 50px;
    border-radius: 50%;
    margin: 10px 5px 10px 0;
    background-size: cover;
    background-color: lightskyblue;
    display: flex;
    align-items: center;
    justify-content: center;
}

.badge-circle img {
    max-width: 100%;
    max-height: 100%;
}

.all-badge-circle {
    height: 50px;
    width: 50px;
    widows: 50px;
    border-radius: 50%;
    margin-right: 5px;
    background-size: cover;
    background-color: lightskyblue;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px;
}

.all-badge-circle img {
    max-width: 100%;
    max-height: 100%;
}

/* .allbadgeimg  {
    width: 50px;
} */
.all-badge-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.vxe-radio-group .vxe-radio {
    color: black;
    /* 將文字顏色設置為黑色 */
}

.userPhotoCont {
    width: 100px;
    /* 這裡可以根據需求調整圖片容器的寬高 */
    height: 100px;
    border-radius: 50%;
    /* 使圖片容器變成圓形 */
    overflow: hidden;
    /* 隱藏圖片溢出的部分 */
}

.userPhotoCont img {
    width: 100%;
    /* 讓圖片充滿整個圖片容器 */
    height: 100%;
    object-fit: cover;
    /* 保持圖片比例並填充容器 */
}

.vxe-column {
    max-height: 50px !important;
}
</style>
