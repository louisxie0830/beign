<template>
  <div>
    <p class="title">{{ $t('superadmin.customs.broker.information') }}</p>
    <a-divider />
    <a-row>
      <a-col :span="7"></a-col>
      <a-col class="boxHeaderLeft" :span="4">{{ $t('superadmin.customs.zone') }}</a-col>
      <a-col class="boxHeaderRight" :span="6">{{ $t('superadmin.case.no') }}</a-col>
      <a-col :span="7"></a-col>
    </a-row>
    <a-row v-for="item in dataSourceCB" :key="item.key">
      <a-col :span="7"></a-col>
      <a-col class="boxLabel" :span="4">{{ $t('customsRegions')[item.role] }}</a-col>
      <a-col class="boxInput" :span="6">
        <a-form-item>
          <a-input
            :placeholder="$t('superadmin.casenumber.tip')"
            @change="e => $emit('handleCbChange', e.target.value, item)"
            v-decorator="[
              `boxes-${item.role}`,
              {
                initialValue: dataSourceCBMap[item.role],
                rules: [{ max: 4, message: $t('superadmin.boxNo.maxLength.tip') }]
              }
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="7"></a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  props: {
    dataSourceCB: {
      type: Array,
      default: () => []
    },
    dataSourceCBMap: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped lang="less">
.boxLabel {
  padding: 20px;
  height: 73px;
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  border-left: 1px solid #e8e8e8;
}
.boxInput {
  padding: 13px;
  height: 73px;
  border: 1px solid #e8e8e8;
}
.boxHeaderLeft {
  background: #fafafa;
  padding: 13px;
  height: 50px;
  font-weight: 600;
  border-top: 1px solid #e8e8e8;
  border-left: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
}
.boxHeaderRight {
  background: #fafafa;
  padding: 13px;
  height: 50px;
  font-weight: 600;
  border-top: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
}
</style>
