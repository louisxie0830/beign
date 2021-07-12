// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout } from '@/layouts'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'Index' },
    redirect: '/shipments',
    children: [
      // dashboard
      {
        path: '/shipments',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Workplace'),
        meta: {
          title: 'page.title.shipment',
          keepAlive: true,
          permission: ['IMPORTER', 'EXPORTER', 'CUSTOMS', 'CUSTOMS_BROKER']
        }
      },
      // customsAdmin
      {
        path: '/customsAdmin',
        name: 'customsAdmin',
        component: () => import('@/views/customsAdmin/Index'),
        meta: { title: 'page.title.customsAdmin', keepAlive: true, permission: ['SUPER_CUSTOMS'] }
      },
      // user listing
      {
        path: '/user/list',
        name: 'userList',
        component: () => import('@/views/superAdmin/userList'),
        meta: {
          title: 'page.title.userList',
          keepAlive: true,
          permission: ['ADMIN']
        }
      },
      // COMPANY LISTING
      {
        path: '/company/list',
        name: 'companyList',
        component: () => import('@/views/superAdmin/companyList'),
        meta: {
          title: 'page.title.companyList',
          keepAlive: true,
          permission: ['ADMIN']
        }
      },
      {
        path: '/company/create',
        name: 'companyCreate',
        hidden: true,
        component: () => import('@/views/superAdmin/createEntity'),
        meta: {
          title: 'companyList',
          keepAlive: true,
          permission: ['ADMIN']
        }
      },
      {
        path: '/company/edit',
        name: 'companyEdit',
        hidden: true,
        component: () => import('@/views/superAdmin/editEntity'),
        meta: {
          title: 'companyList',
          keepAlive: true,
          permission: ['ADMIN']
        }
      },
      {
        path: '/entity/edit',
        name: 'entityEdit',
        hidden: true,
        component: () => import('@/views/entity/edit'),
        meta: {
          title: 'Entity Management',
          keepAlive: true,
          permission: ['IMPORTER', 'EXPORTER', 'CUSTOMS_BROKER']
        }
      },
      // Customs User Management
      {
        path: '/customsUser',
        name: 'customsUser',
        component: () => import('@/views/customsUser/Index'),
        meta: { title: 'customsUser', keepAlive: true, permission: ['SUPER_CUSTOMS'] }
      },
      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        hidden: true,
        meta: {
          title: 'exception',
          icon: 'warning',
          permission: ['IMPORTER', 'EXPORTER', 'CUSTOMS', 'CUSTOMS_BROKER']
        },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: ['IMPORTER', 'EXPORTER', 'CUSTOMS', 'CUSTOMS_BROKER'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: ['IMPORTER', 'EXPORTER', 'CUSTOMS', 'CUSTOMS_BROKER'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: ['IMPORTER', 'EXPORTER', 'CUSTOMS', 'CUSTOMS_BROKER'] }
          }
        ]
      },
      // profile
      {
        path: '/shipment/info',
        name: 'profile',
        component: RouteView,
        redirect: '/shipment/info',
        hidden: true,
        meta: { title: 'detail', icon: 'profile', permission: ['IMPORTER', 'EXPORTER', 'CUSTOMS', 'CUSTOMS_BROKER'] },
        children: [
          {
            path: '/shipment/info',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic/Index'),
            meta: { title: 'basic detail', permission: ['IMPORTER', 'EXPORTER', 'CUSTOMS', 'CUSTOMS_BROKER'] }
          }
        ]
      },
      // create
      {
        path: '/create',
        name: 'create',
        hidden: true,
        component: () => import('@/views/create/Index'),
        // redirect: '/create/basic',
        // hidden: true,
        meta: { title: 'createShipment', icon: 'plus', permission: ['IMPORTER'], keepAlive: false }
      },
      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        hidden: true,
        name: 'account',
        meta: {
          title: 'system.settings',
          icon: 'user',
          keepAlive: true,
          permission: ['IMPORTER', 'EXPORTER', 'CUSTOMS', 'CUSTOMS_BROKER']
        },
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: {
              title: 'personal.setting',
              hideHeader: true,
              permission: ['IMPORTER', 'EXPORTER', 'CUSTOMS', 'CUSTOMS_BROKER']
            },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: {
                  title: 'Personal Settings',
                  hidden: true,
                  permission: ['IMPORTER', 'EXPORTER', 'CUSTOMS', 'CUSTOMS_BROKER']
                }
              }
            ]
          }
        ]
      },
      // register file to OTB
      {
        path: '/otbFile/register',
        name: 'otb_file_register',
        hidden: true,
        component: () => import('@/views/otbFile/register'),
        // redirect: '/create/basic',
        // hidden: true,
        meta: { title: 'OTB file register', icon: 'plus', permission: ['IMPORTER'], keepAlive: false }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: '/user/login_importer',
        name: 'loginImporter',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/LoginImporter')
      },
      {
        path: '/user/login_customs',
        name: 'loginCustoms',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/LoginCustoms')
      },
      {
        path: '/user/login_cb',
        name: 'loginCb',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/LoginCb')
      },
      {
        path: '/user/login_exporter',
        name: 'loginExporter',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/LoginExporter')
      }
    ]
  },
  {
    path: '/admin',
    component: UserLayout,
    redirect: '/admin/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'adminlogin',
        component: () => import(/* webpackChunkName: "user" */ '@/views/admin/Login')
      }
    ]
  },

  // {
  //   path: '/test',
  //   component: BlankLayout,
  //   redirect: '/test/home',
  //   children: [
  //     {
  //       path: 'home',
  //       name: 'TestHome',
  //       component: () => import('@/views/Home')
  //     }
  //   ]
  // },

  // create user
  {
    path: '/createAccount',
    component: BasicLayout,
    hidden: true,
    redirect: '/createAccount',
    children: [
      {
        path: '/createAccount',
        name: 'createAccount',
        component: () => import('@/views/createAccount/Index')
      }
    ]
  },
  {
    path: '/forgetPassword',
    component: BasicLayout,
    hidden: true,
    redirect: '/forgetPassword',
    children: [
      {
        path: '/forgetPassword',
        name: 'forgetPassword',
        component: () => import('@/views/forgetPassword/Index')
      },
      {
        path: '/success',
        name: 'success',
        component: () => import('@/views/forgetPassword/success')
      }
    ]
  },
  {
    path: '/resetPassword',
    component: BasicLayout,
    hidden: true,
    redirect: '/resetPassword',
    children: [
      {
        path: '/resetPassword',
        name: 'resetPassword',
        component: () => import('@/views/resetPassword/Index')
      },
      {
        path: '/resetSuccess',
        name: 'resetSuccess',
        component: () => import('@/views/resetPassword/resetSuccess')
      }
    ]
  },
  {
    path: '/invalidInviteCode',
    component: BasicLayout,
    hidden: true,
    redirect: '/invalidInviteCode',
    children: [
      {
        path: '/invalidInviteCode',
        name: 'invalidInviteCode',
        component: () => import('@/views/invalidInviteCode/Index')
      }
    ]
  },
  {
    path: '/userEmailExist',
    component: BasicLayout,
    hidden: true,
    redirect: '/userEmailExist',
    children: [
      {
        path: '/userEmailExist',
        name: 'userEmailExist',
        component: () => import('@/views/userEmailExist/Index')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
