import Vue from 'vue';
import Router from 'vue-router';

export function loadView(view, path) {
  path || 'client';
  return () => import(`@/pages/${path}/${view}.vue`);
}

import WelcomePage from '@/pages/WelcomePage';
import Index from '@/pages/Index';
import Register from '@/pages/client/Register';
import RegisterByCode from '@/pages/client/RegisterByCode';
import Login from '@/pages/Login';
import SetMail from '@/pages/client/SetMail';
import AuthCode from '@/pages/client/AuthCode';
import AddContact from '@/pages/client/AddContact';
import Signing from '@/pages/client/Signing';
import ForgetPassword from '@/pages/client/ForgetPassword';
import SignDocuments from '@/pages/client/SignDocuments';
import SignDocumentInfo from '@/pages/client/SignDocumentInfo';
import ManagementIndex from '@/pages/admin/ManagementIndex.vue';
import CheckList from '@/pages/admin/CheckList.vue';
import EditManager from '@/pages/admin/EditManager.vue';
import CreateAuth from '@/pages/admin/CreateAuth.vue';
import AssignManager from '@/pages/admin/AssignManager.vue';
import ChangePassword from '@/pages/client/ChangePassword.vue';
import ResetPassword from '@/pages/client/ResetPassword.vue';
import ContactPerson from '@/pages/client/ContactPerson.vue';
import Policy from '@/pages/client/Policy.vue';
import Privacy from '@/pages/client/Privacy.vue';
import SetTags from '@/pages/client/SetTags.vue';
import Purchase from '@/pages/client/Purchase.vue';
import PurchaseResult from '@/pages/client/PurchaseResult.vue';
import SetLanguages from '@/pages/client/SetLanguages.vue';
import CheckFile from '@/pages/client/CheckFile.vue';
import PaymentInfo from '@/pages/client/PaymentInfo.vue';
import AccountInfo from '@/pages/client/AccountInfo.vue';
import InviteFriends from '@/pages/admin/InviteFriends.vue';
import UserInfo from '@/pages/admin/UserInfo.vue';
import DepartmentEditingPage from '@/pages/admin/DepartmentEditingPage.vue';
import DepartmentInfoPage from '@/pages/admin/DepartmentInfoPage.vue';
import CertificationPage from '@/pages/client/CertificationPage.vue';
import DepartmentMemberList from '@/pages/admin/DepartmentMemberList.vue';
import AddStamp from '@/pages/admin/AddStamp.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  scrollBehavior() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ x: 0, y: 1 });
      }, 100);
    });
  },
  routes: [
    {
      path: '/',
      name: 'WelcomePage',
      component: WelcomePage,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/Index',
      name: 'Index',
      component: Index,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/admin/ManagementIndex',
      name: 'ManagementIndex',
      component: ManagementIndex,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/admin/CheckList/:id',
      name: 'CheckList',
      component: CheckList,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/admin/EditManager/:type/:id',
      name: 'EditManager',
      component: EditManager,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/admin/CreateAuth/:type',
      name: 'CreateAuth',
      component: CreateAuth,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/admin/AssignManager/:companyId',
      name: 'AssignManager',
      component: AssignManager,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/client/Register',
      name: 'Register',
      component: Register,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/client/RegisterByCode',
      name: 'RegisterByCode',
      component: RegisterByCode,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/client/ForgetPassword',
      name: 'ForgetPassword',
      component: ForgetPassword,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/client/ChangePassword',
      name: 'ChangePassword',
      component: ChangePassword,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/client/ResetPassword',
      name: 'ResetPassword',
      component: ResetPassword,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/client/SignDocuments/:type',
      name: 'SignDocuments',
      component: SignDocuments,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/client/SignDocumentInfo/:letterId',
      name: 'SignDocumentInfo',
      component: SignDocumentInfo,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/client/AuthCode',
      name: 'AuthCode',
      component: AuthCode,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/client/ContactPerson',
      name: 'ContactPerson',
      component: ContactPerson,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/client/AddContact',
      name: 'AddContact',
      component: AddContact,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/client/Policy',
      name: 'Policy',
      component: Policy
    },
    {
      path: '/client/Privacy',
      name: 'Privacy',
      component: Privacy
    },
    {
      path: '/client/SetMail',
      name: 'SetMail',
      component: SetMail,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/client/Signing',
      name: 'Signing',
      component: Signing,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/client/SetTags',
      name: 'SetTags',
      component: SetTags,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/client/Purchase',
      name: 'Purchase',
      component: Purchase,
      meta: {
        keepAlive: false,
        requiresAuth: true
      }
    },
    {
      path: '/client/PurchaseResult/:orderId',
      name: 'PurchaseResult',
      component: PurchaseResult,
      meta: {
        keepAlive: false,
        requiresAuth: false
      }
    },
    {
      path: '/client/SetLanguages',
      name: 'SetLanguages',
      component: SetLanguages,
      meta: {
        keepAlive: false,
        requiresAuth: false
      }
    },
    {
      path: '/client/checkFile',
      name: 'CheckFile',
      component: CheckFile,
      meta: {
        keepAlive: false,
        requiresAuth: false
      }
    },
    {
      path: '/client/PaymentInfo',
      name: 'PaymentInfo',
      component: PaymentInfo,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/client/AccountInfo',
      name: 'AccountInfo',
      component: AccountInfo,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/admin/InviteFriends/:companyId',
      name: 'InviteFriends',
      component: InviteFriends,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/admin/UserInfo/:companyId/:userId',
      name: 'UserInfo',
      component: UserInfo,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/admin/DepartmentEditingPage/:id',
      name: 'DepartmentEditingPage',
      component: DepartmentEditingPage,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/admin/AddStamp/:id',
      name: 'AddStamp',
      component: AddStamp,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/admin/DepartmentInfoPage/:companyId',
      name: 'DepartmentInfoPage',
      component: DepartmentInfoPage,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/admin/DepartmentMemberList/:companyId/:departmentId/:departmentName',
      name: 'DepartmentMemberList',
      component: DepartmentMemberList,
      props: true,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/client/CertificationPage/',
      name: 'CertificationPage',
      component: CertificationPage,
      meta: {
        keepAlive: false
      }
    }
  ]
});
router.beforeEach((to, from, next) => {
  const LOGIN_STATUS = router.app.$store.getters['LOGIN_STATUS'];
  const USER_DATA = router.app.$store.getters['USER_DATA'];
  const DING_DING_STATUS = router.app.$store.getters['DING_DING_STATUS'];
  const requiresAuth = to.meta.requiresAuth;
  const toPageName = to.name;
  const fromPageName = from.name;
  if (!!requiresAuth) {
    if (!LOGIN_STATUS || JSON.stringify(USER_DATA) === '{}') {
      DING_DING_STATUS ? next({ name: 'WelcomePage' }) : next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
