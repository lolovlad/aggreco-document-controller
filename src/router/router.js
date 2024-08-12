import {
    createRouter,
    createWebHistory
} from "vue-router"
import {auth as $store} from "@/store/auth.model";
import LoginPage from "@/pages/LoginPage";
import AdminMainPage from "@/pages/AdminMainPage";
import AdminUserPage from "@/pages/UsersPage/AdminUserPage";
import UserPage from "@/pages/UserPage";
import AdminDocumentPage from "@/pages/AdminDocumentPage";
import AdminDocumentUserViewPage from "@/pages/AdminDocumentUserViewPage";
import AccessDeniedPage from "@/pages/ErrorPage/AccessDeniedPage";
import BaseAdminUserPage from "@/pages/UsersPage/BaseAdminUserPage";
import EditUserPage from "@/pages/UsersPage/EditUserPage";
import BaseAdminObjectPage from "@/pages/ObjectPage/BaseAdminObjectPage";
import ViewObjectAdminPage from "@/pages/ObjectPage/ViewObjectAdminPage";
import EditObjectPage from "@/pages/ObjectPage/EditObjectPage";
import ViewEquipmentAdminPage from "@/pages/EquipmentPage/ViewEquipmentAdminPage";
import EditEquipmentPage from "@/pages/EquipmentPage/EditEquipmentPage";
import BaseAdminEquipmentPage from "@/pages/EquipmentPage/BaseAdminEquipmentPage";
import BaseAdminAccidentPage from "@/pages/AccidentPage/BaseAdminAccidentPage";
import ViewAdminAccidentPage from "@/pages/AccidentPage/ViewAdminAccidentPage";
import EditAccidentAdminPage from "@/pages/AccidentPage/EditAccidentAdminPage";
import InfoAccidentPage from "@/pages/AccidentPage/InfoAccidentPage";

const routes = [
    {
        path: '/',
        component: LoginPage,
        beforeEnter: (to, from, next) => {
            const initialState = $store.state;
            if(initialState.status.loggedIn){
                if(initialState.user.type.name === "admin") {
                    next("/admin");
                }
                else {
                    next("/user");
                }
            }else{
                next()
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

        ],
        beforeEnter: (to, from, next) => {
            const initialState = $store.state;
            if(initialState.status.loggedIn){
                if(initialState.user.type.name === "admin") {
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
        path: '/user',
        component: UserPage,
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