import {
    createRouter,
    createWebHistory
} from "vue-router"
import {auth as $store} from "@/store/auth.model";
import LoginPage from "@/pages/LoginPage";
import AdminMainPage from "@/pages/AdminMainPage";
import AdminUserPage from "@/pages/AdminPage/UsersPage/AdminUserPage";
import AdminDocumentPage from "@/pages/AdminDocumentPage";
import AdminDocumentUserViewPage from "@/pages/AdminDocumentUserViewPage";
import AccessDeniedPage from "@/pages/ErrorPage/AccessDeniedPage";
import BaseAdminUserPage from "@/pages/AdminPage/UsersPage/BaseAdminUserPage";
import EditUserPage from "@/pages/AdminPage/UsersPage/EditUserPage";
import BaseAdminObjectPage from "@/pages/AdminPage/ObjectPage/BaseAdminObjectPage";
import ViewObjectAdminPage from "@/pages/AdminPage/ObjectPage/ViewObjectAdminPage";
import EditObjectPage from "@/pages/AdminPage/ObjectPage/EditObjectPage";
import ViewEquipmentAdminPage from "@/pages/AdminPage/EquipmentPage/ViewEquipmentAdminPage";
import EditEquipmentPage from "@/pages/AdminPage/EquipmentPage/EditEquipmentPage";
import BaseAdminEquipmentPage from "@/pages/AdminPage/EquipmentPage/BaseAdminEquipmentPage";
import BaseAdminAccidentPage from "@/pages/AdminPage/AccidentPage/BaseAdminAccidentPage";
import ViewAdminAccidentPage from "@/pages/AdminPage/AccidentPage/ViewAdminAccidentPage";
import EditAccidentAdminPage from "@/pages/AdminPage/AccidentPage/EditAccidentAdminPage";
import InfoAccidentPage from "@/pages/AdminPage/AccidentPage/InfoAccidentPage";
import MainStatisticPage from "@/pages/AdminPage/StatisticPage/MainStatisticPage.vue";
import AllStatistic from "@/pages/AdminPage/StatisticPage/AllStatistic.vue";
import ObjectStatic from "@/pages/AdminPage/StatisticPage/ObjectStatic.vue";
import ProfessionPage from "@/pages/AdminPage/EnvPage/ProfessionPage.vue";
import ProfilePage from "@/pages/AdminPage/ProfilePage/ProfilePage.vue";
import EditAccountPage from "@/pages/AdminPage/ProfilePage/EditAccountPage.vue";
import EditSignaturePage from "@/pages/AdminPage/ProfilePage/EditSignaturePage.vue";
import ViewAccountPage from "@/pages/AdminPage/ProfilePage/ViewAccountPage.vue";
import WorkerMainPage from "@/pages/Workers/WorkerMainPage.vue";
import ClaimViewPage from "@/pages/Workers/ClaimPage/ClaimViewPage.vue";
import BasePage from "@/pages/Workers/ClaimPage/BasePage.vue";
import EditClaimPage from "@/pages/Workers/ClaimPage/EditClaimPage.vue";
import BaseAdminClaimPage from "@/pages/AdminPage/ClaimPage/BaseAdminClaimPage.vue";
import ClaimViewAdminPage from "@/pages/AdminPage/ClaimPage/ClaimViewAdminPage.vue";
import EditClaimAdminPage from "@/pages/AdminPage/ClaimPage/EditClaimAdminPage.vue";
import BaseWorkerObjectPage from "@/pages/Workers/ObjectPage/BaseWorkerObjectPage.vue";
import ViewObjectWorkerPage from "@/pages/Workers/ObjectPage/ViewObjectWorkerPage.vue";
import EditEquipmentWorkerPage from "@/pages/Workers/ObjectPage/EditEquipmentWorkerPage.vue";
import BaseAdminBlueprintPage from "@/pages/AdminPage/BlueprintPage/BaseAdminBlueprintPage.vue";
import ViewBlueprinAdminPage from "@/pages/AdminPage/BlueprintPage/ViewBlueprinAdminPage.vue";
import EditBlueprintAdminPage from "@/pages/AdminPage/BlueprintPage/EditBlueprintAdminPage.vue";
import BaseEnvPage from "@/pages/AdminPage/EnvPage/BaseEnvPage.vue";
import TypeEquipmentPage from "@/pages/AdminPage/EnvPage/TypeEquipmentPage.vue";
import RegionPage from "@/pages/AdminPage/EnvPage/RegionPage.vue";
import YandexAcceptPage from "@/pages/YandexAcceptPage.vue";

const routes = [
    {
        path: '/',
        component: LoginPage,
        beforeEnter: (to, from, next) => {
            const initialState = $store.state;
            if(initialState.status.loggedIn){
                if(initialState.user.type.name !== "user") {
                    next("/admin/claim");
                }
                else {
                    next("/worker/object");
                }
            }else{
                next()
            }
        }
    },
    {
        path: '/login/yandex',
        component: YandexAcceptPage,
        beforeEnter: (to, from, next) => {
            const initialState = $store.state;
            if(initialState.status.loggedIn){
                if(initialState.user.type.name !== "user") {
                    next("/admin/claim");
                }
                else {
                    next("/worker/object");
                }
            }else{
                next()
            }
        }
    },
    {
        path: "/profile",
        component: ProfilePage,
        children: [
            {
                path: "account",
                component: EditAccountPage
            },
            {
                path: "signature",
                component: EditSignaturePage
            },
            {
                path: '',
                component: ViewAccountPage
            }
        ],
        beforeEnter: (to, from, next) => {
            const initialState = $store.state;
            if(initialState.status.loggedIn){
                next();
            }else{
                next('/')
            }
        }
    },
    {
        path: '/admin',
        component: AdminMainPage,
        children:[
            {
                path: "user",
                component: BaseAdminUserPage,
                children: [
                    {
                        path: "edit/:uuid",
                        component: EditUserPage,
                    },
                    {
                        path: "add",
                        component: EditUserPage,
                    },
                    {
                        path: "",
                        component: AdminUserPage
                    }
                ]
            },
            {
                path: "",
                component: BaseAdminUserPage
            },
            {
                path: "document",
                children: [
                    {
                        path: "",
                        component: AdminDocumentPage,
                    },
                    {
                        path: "users/:uuid",
                        component: AdminDocumentUserViewPage
                    }
                ]
            },
            {
                path: "object",
                component: BaseAdminObjectPage,
                children: [
                    {
                        path: "edit/:uuid",
                        component: EditObjectPage,
                    },
                    {
                        path: "add",
                        component: EditObjectPage,
                    },
                    {
                        path: "",
                        component: ViewObjectAdminPage
                    },
                    {
                        path: ":uuid/equip",
                        component: BaseAdminEquipmentPage,
                        children: [
                            {
                                path: "edit/:uuid_equip",
                                component: EditEquipmentPage,
                            },
                            {
                                path: "add",
                                component: EditEquipmentPage,
                            },
                            {
                                path: "",
                                component: ViewEquipmentAdminPage
                            },
                        ]
                    }
                ]
            },
            {
                path: "accident",
                component: BaseAdminAccidentPage,
                children: [
                    {
                        path: "edit/:uuid",
                        component: EditAccidentAdminPage,
                    },
                    {
                        path: "",
                        component: ViewAdminAccidentPage
                    },
                    {
                        path: ":uuid/equip",
                        component: BaseAdminEquipmentPage,
                        children: [
                            {
                                path: "edit/:uuid_equip",
                                component: EditEquipmentPage,
                            },
                            {
                                path: "add",
                                component: EditEquipmentPage,
                            },
                            {
                                path: "",
                                component: ViewEquipmentAdminPage
                            },
                        ]
                    }
                ]
            },
            {
                path: "statistic",
                component: MainStatisticPage,
                children: [
                    {
                        path: "",
                        component: AllStatistic
                    },
                    {
                        path: "object",
                        component: ObjectStatic
                    }
                ]
            },
            {
                path: "claim",
                component: BaseAdminClaimPage,
                children: [
                    {
                        path: "",
                        component: ClaimViewAdminPage
                    },
                    {
                        path: "edit/:uuid",
                        component: EditClaimAdminPage
                    }
                ]
            },
            {
                path: "env",
                component: BaseEnvPage,
                children: [
                    {
                        path: "profession",
                        component: ProfessionPage
                    },
                    {
                        path: "type_equipment",
                        component: TypeEquipmentPage
                    },
                    {
                        path: "region",
                        component: RegionPage
                    },
                    {
                        path: "blueprint",
                        component: BaseAdminBlueprintPage,
                        children: [
                            {
                                path: "",
                                component: ViewBlueprinAdminPage
                            },
                            {
                                path: "add",
                                component: EditBlueprintAdminPage
                            },
                            {
                                path: "edit/:id",
                                component: EditBlueprintAdminPage
                            }
                        ]
                    },
                ]
            }

        ],
        beforeEnter: (to, from, next) => {
            const initialState = $store.state;
            if(initialState.status.loggedIn){
                if(initialState.user.type.name !== "user") {
                    next();
                }
                else {
                    next(false);
                }
            }else{
                next('/')
            }
        }
    },
    {
        path: '/worker',
        component: WorkerMainPage,
        children: [
            {
                path: "claim",
                component: BasePage,
                children: [
                    {
                        path: "",
                        component: ClaimViewPage
                    },
                    {
                        path: "edit/:uuid",
                        component: EditClaimPage
                    }
                ]
            },
            {
                path: "object",
                component: BaseWorkerObjectPage,
                children: [
                    {
                        path: "",
                        component: ViewObjectWorkerPage
                    },
                    {
                        path: ":uuid/equip/edit/:uuid_equip",
                        component: EditEquipmentWorkerPage,
                    },
                    {
                        path: ":uuid/equip/add",
                        component: EditEquipmentWorkerPage,
                    }
                ]
            },
        ],
        beforeEnter: (to, from, next) => {
            const initialState = $store.state;
            if(initialState.status.loggedIn){
                if(initialState.user.type.name === "user") {
                    next();
                }
                else {
                    next(false);
                }
            }else{
                next('/')
            }
        }
    },
    {
        path: '/access_denied',
        component: AccessDeniedPage,
    },
    {
        path: '/accident/:uuid_accident',
        component: InfoAccidentPage,
    }
]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL)
})

export default router;