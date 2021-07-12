import Vue from 'vue';

import ConfirmPrivateKey from './ConfirmPrivateKey.vue';
import ConfirmCerPassword from './ConfirmCerPassword.vue';
import RejectSigning from './RejectSigning.vue';
import GoBack from './GoBack.vue';
import HeaderTitle from './HeaderTitle.vue';
import AdvSearchModal from './AdvSearchModal.vue';
import ChangeCompanyRole from './ChangeCompanyRole.vue';
import SetDetailTagModal from './SetDetailTagModal.vue';
import SelectCompanyRoleModal from './SelectCompanyRoleModal.vue';
import selectPersonModal from './selectPersonModal.vue';
import CreateTagsModal from './CreateTagsModal.vue';

const components = {
  ConfirmPrivateKey,
  ConfirmCerPassword,
  RejectSigning,
  GoBack,
  HeaderTitle,
  AdvSearchModal,
  ChangeCompanyRole,
  SelectCompanyRoleModal,
  SetDetailTagModal,
  selectPersonModal,
  CreateTagsModal
};

Object.keys(components).forEach(key => {
  if (!components[key].hasOwnProperty('mixins')) {
    components[key]['mixins'] = [];
  }
  components[key].mixins.push({
    props: {
      extra: {
        default: null
      }
    }
  });

  Vue.component(key, components[key]);
});

export default components;

// import Vue from 'vue';
// import _ from 'lodash';

// const components = require.context('@/components', false, /[A-Z]\w+\.(vue)$/);
//
// _.forEach(components.keys(), fileName => {
//   const componentConfig = components(fileName);
//   const componentName = fileName
//     .split('/')
//     .pop()
//     .split('.')[0];
//   Vue.component(componentName, componentConfig.default || componentConfig);
// });
