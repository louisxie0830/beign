import i18n from './../plugins/i18n';

export default {
  dingDingStatus: false,
  email: '',
  authorization: '',
  loginStatus: false,
  userAddress: '',
  companyId: null,
  companyList: [],
  userRole: null,
  letterData: {},
  document: null,
  corpId: '',
  isLoading: false,
  dingConfig: null,
  tagList: [],
  countryCode: 'TW',
  lang: i18n.locale,
  userName: '',
  userData: {},
  contact: [],
  paymentInfo: {},
  city: {},
  region: [],
  companyStamp: null,
  signatureInfo: {
    id: 0,
    title: '',
    fontStyleName: 'sans-serif',
    color: '#EA0606',
    pageOffsetX: 0,
    pageOffsetY: 0,
    width: 0,
    height: 0,
    page: 0,
    zoom: 1,
    content: '',
    renderPageIndex: null,
    couldBeRendered: false
  },
  signatureStatus: {
    isDragging: false,
    systemDate: moment(new Date()).format('YYYY/MM/DD'),
    fontStyleName: '',
    coordinate: {}
  },
  isShowFileTips: false,
  userEntity: 0
};
