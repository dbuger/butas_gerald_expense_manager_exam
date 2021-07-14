import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';

import Main from '@/modules/main/main.vue';
import Login from '@/modules/login/login.vue';

import Dashboard from '@/pages/dashboard/dashboard.vue';
import Roles from '@/pages/roles/roles.vue';
import Users from '@/pages/users/user.vue';
import ChangePassword from '@/pages/change-password/change-password.vue';
import ExpenseCategories from '@/pages/expense-categories/index.vue';
import Expenses from '@/pages/expenses/index.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Main',
        component: Main,
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: Dashboard
            },
            {
                meta:{
                    permissions:['can_change_password']
                },
                path: '/change_password',
                name: 'ChangePassword',
                component: ChangePassword
            }
        ]
    },
    {
        path: '/user_management',
        meta:{
            role:'Administrator'  
        },
        redirect: '/user_management/roles',
        name: 'UserManagement',
        component: Main,
        children: [
            {
                path: '/user_management/roles',
                name: 'Roles',
                component: Roles
            },
            {
                path: '/user_management/users',
                name: 'Users',
                component: Users
            }
        ]
    },
    {
        path: '/expense_management',
        redirect: 'expense_management/expense_categories',
        name: 'ExpenseManagement',
        component: Main,
        children: [
            {
                meta:{
                    role:'Administrator'
                },
                path: '/expense_management/expense_categories',
                name: 'ExpenseCategories',
                component: ExpenseCategories
            },
            {
                path: '/expense_management/expenses',
                name: 'Expenses',
                component: Expenses
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
