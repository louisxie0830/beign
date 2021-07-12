<template>
  <detail-list size="small" :col="2" class="detail-layout">
    <template>
      <div class="card_content" style="background-color: #f3f6fd;padding:77px 24px 20px 24px;">
        <h3 class="h3">{{ $t('Index.shipment.partner') }}</h3>
        <div style="background-color: #f3f6fd; padding: 6px;">
          <a-row :gutter="50">
            <a-col :sm="{ span: 24 }" :lg="{ span: 8 }" class="card1">
              <a-card :bordered="false">
                <div slot="title">
                  <p>
                    <span>{{ $t('Index.exporters') }}</span>
                  </p>
                  <p>
                    <span>{{ (info && info.exporter && info.exporter.companyName) || '&nbsp;' }}</span>
                  </p>
                </div>
                <p>
                  <a-row>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.name') }}</span>
                      </p>
                      <p>
                        {{ (info && info.exporter && info.exporter.companyName) || '&nbsp;' }}
                      </p>
                    </a-col>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.taxId') }}</span>
                      </p>
                      <p>{{ info && info.exporter && info.exporter.taxId }}</p>
                    </a-col>
                  </a-row>
                </p>
                <a-divider style="margin: 4px 0" />
                <p>
                  <a-row>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.telephone') }}</span>
                      </p>
                      <p>
                        {{ (info && info.exporter && info.exporter.phoneNo) || '&nbsp;' }}
                      </p>
                    </a-col>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.faxNo') }}</span>
                      </p>
                      <p>
                        {{ (info && info.exporter && info.exporter.faxNo) || '&nbsp;' }}
                      </p>
                    </a-col>
                  </a-row>
                </p>
                <a-divider style="margin: 4px 0" />
                <p>
                  <span class="p_title">{{ $t('Index.email') }}：</span>
                </p>
                <p>{{ (info && info.exporter && info.exporter.contactEmail) || '&nbsp;' }}</p>
                <a-divider style="margin: 4px 0" />
                <p>
                  <span class="p_title">{{ $t('Index.address') }}</span>
                </p>
                <p>
                  {{ (info && info.exporter && info.exporter.address) || '&nbsp;' }}
                </p>
              </a-card>
            </a-col>
            <a-col :sm="{ span: 24 }" :lg="{ span: 8 }" class="card2">
              <a-card :bordered="false">
                <div slot="title">
                  <p>
                    <span>{{ $t('Index.importers') }}</span>
                  </p>
                  <p>
                    <span>{{ (info && info.importer && info.importer.companyName) || '&nbsp;' }}</span>
                  </p>
                </div>
                <p>
                  <a-row>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.name') }}</span>
                      </p>
                      <p>
                        {{ (info && info.importer && info.importer.companyName) || '&nbsp;' }}
                      </p>
                    </a-col>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.taxId') }}</span>
                      </p>
                      <p>{{ info && info.importer && info.importer.taxId }}</p>
                    </a-col>
                  </a-row>
                </p>
                <a-divider style="margin: 4px 0" />
                <p>
                  <a-row>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.telephone') }}</span>
                      </p>
                      <p>
                        {{ (info && info.importer && info.importer.phoneNo) || '&nbsp;' }}
                      </p>
                    </a-col>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.faxNo') }}</span>
                      </p>
                      <p>
                        {{ (info && info.importer && info.importer.faxNo) || '&nbsp;' }}
                      </p>
                    </a-col>
                  </a-row>
                </p>
                <a-divider style="margin: 4px 0" />
                <p>
                  <span class="p_title">{{ $t('Index.email') }}：</span>
                </p>
                <p>{{ (info && info.importer && info.importer.contactEmail) || '&nbsp;' }}</p>
                <a-divider style="margin: 4px 0" />
                <p>
                  <span class="p_title">{{ $t('Index.address') }}</span>
                </p>
                <p>
                  {{ (info && info.importer && info.importer.address) || '&nbsp;' }}
                </p>
              </a-card>
            </a-col>
            <a-col :sm="{ span: 24 }" :lg="{ span: 8 }" class="card3">
              <a-card :bordered="false">
                <div slot="title">
                  <p>
                    <span>{{ $t('Index.Customs.broker') }}</span>
                  </p>
                  <p>
                    <span>{{ (info && info.customsBroker && info.customsBroker.companyName) || '&nbsp;' }}</span>
                  </p>
                </div>
                <p>
                  <a-row>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.name') }}</span>
                      </p>
                      <p>
                        {{ (info && info.customsBroker && info.customsBroker.companyName) || '&nbsp;' }}
                      </p>
                    </a-col>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.taxId') }}</span>
                      </p>
                      <p>
                        {{ info && info.customsBroker && info.customsBroker.taxId }}
                      </p>
                    </a-col>
                  </a-row>
                </p>
                <a-divider style="margin: 4px 0" />
                <p>
                  <a-row>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.telephone') }}</span>
                      </p>
                      <p>
                        {{ (info && info.customsBroker && info.customsBroker.phoneNo) || '&nbsp;' }}
                      </p>
                    </a-col>
                    <a-col :span="12">
                      <p>
                        <span class="p_title">{{ $t('Index.faxNo') }}</span>
                      </p>
                      <p>
                        {{ (info && info.customsBroker && info.customsBroker.faxNo) || '&nbsp;' }}
                      </p>
                    </a-col>
                  </a-row>
                </p>
                <a-divider style="margin: 4px 0" />
                <p>
                  <span class="p_title">{{ $t('Index.email') }}：</span>
                </p>
                <p>{{ (info && info.customsBroker && info.customsBroker.contactEmail) || '&nbsp;' }}</p>
                <a-divider style="margin: 4px 0" />
                <p>
                  <span class="p_title">{{ $t('Index.address') }}</span>
                </p>
                <p>
                  {{ (info && info.customsBroker && info.customsBroker.address) || '&nbsp;' }}
                </p>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>
    </template>
  </detail-list>
</template>
<script>
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  props: {
    info: {
      type: Object,
      default: null
    }
  },
  components: {
    DetailList,
    DetailListItem
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.detail-layout /deep/ .card_content {
  padding: 10px;
  p {
    margin-bottom: 0.2em;
  }
}
.detail-layout /deep/ .description-list[data-v-4ae1a4c5] .content {
  line-height: 39px;
}

.detail-layout /deep/ .description-list[data-v-745c64a4] .term {
  line-height: 38px;
}

.detail-layout /deep/ .ant-col-12 h1 {
  margin-bottom: 0em;
}
.h2 {
  color: #5d81db;
}
.h3 {
  height: 45px;
  line-height: 45px;
  margin-bottom: 0em;
}
.p_title {
  font-weight: bolder;
}
.ant-row {
  /deep/ .ant-card {
    .ant-card-head {
      color: #fff;
      .ant-card-head-title {
        padding: 4px 0;
      }
    }
  }
  /deep/ .card1 {
    .ant-card-head {
      background-color: rgba(5, 133, 201, 0.56);
    }
    .ant-card-body {
      background: url('~@/assets/shipmentbg/Rectangle28-blue.png') no-repeat;
      background-size: 100% 100%;
      color: #fff;
    }
  }
  /deep/ .card2 {
    .ant-card-head {
      background-color: rgba(245, 166, 35, 0.67);
    }
    .ant-card-body {
      background: url('~@/assets/shipmentbg/Rectangle28-yellow.png') no-repeat;
      background-size: 100% 100%;
      color: #fff;
    }
  }
  /deep/ .card3 {
    .ant-card-head {
      background-color: rgba(128, 100, 162, 0.72);
    }
    .ant-card-body {
      background: url('~@/assets/shipmentbg/Rectangle28-purple.png') no-repeat;
      background-size: 100% 100%;
      color: #fff;
    }
  }
}
</style>
