import STATUS from './../utils/status';
const { LETTER_STATUS } = STATUS;
export default {
  data() {
    return {
      LETTER_TAGS: [
        // {
        //   type: LETTER_STATUS.AWAITING_SIGNATURE, // 待簽署
        //   color: '#13c3ea',
        //   wording: i18n.t('common.status_awaiting_signature')
        // },
        {
          type: LETTER_STATUS.WITHDRAWN, // 已撤回
          color: '#C5CAD3',
          wording: this.$t('common.status_withdrawed')
        },
        {
          type: LETTER_STATUS.SIGNING, // 簽署中
          color: '#3296fa',
          wording: this.$t('common.status_signing')
        },
        {
          type: LETTER_STATUS.REJECTED, // 已拒絕
          color: '#f25643',
          wording: this.$t('common.status_rejected')
        },
        {
          type: LETTER_STATUS.COMPLETED, // 已完成
          color: '#15bc83',
          wording: this.$t('common.status_completed')
        }
      ]
    };
  }
};
