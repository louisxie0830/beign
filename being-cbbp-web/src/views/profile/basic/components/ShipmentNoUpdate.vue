<template>
  <div style="margin-bottom: 20px;" align="center">
    <!-- <span v-if="customNoShow">{{ $t('list.shipment.declaration') }} : {{ no }}</span> -->
    <a-form v-if="inputEnab" layout="inline">
      <a-form-item :label="$t('list.shipment.declaration')">
        <a-row :gutter="24">
          <a-col :span="4">
            <a-input class="input-no" :class="{ 'red-border': class1 }" v-model="customsBrokerNoPart1" maxlength="2" />
          </a-col>
          <a-col :span="4">
            <a-input class="input-no" :class="{ 'red-border': class2 }" v-model="customsBrokerNoPart2" maxlength="2" />
          </a-col>
          <a-col :span="4">
            <a-input class="input-no" :class="{ 'red-border': class3 }" v-model="customsBrokerNoPart3" maxlength="2" />
          </a-col>
          <a-col :span="4">
            <a-input class="input-no" :class="{ 'red-border': class4 }" v-model="customsBrokerNoPart4" maxlength="3" />
          </a-col>
          <a-col :span="4">
            <a-input class="input-no" :class="{ 'red-border': class5 }" v-model="customsBrokerNoPart5" maxlength="5" />
          </a-col>
        </a-row>
      </a-form-item>
      <a-button :loading="btnLoading" style="margin-top: 4px;" type="primary" @click="updateCustomsNo()">{{
        $t('personal.save')
      }}</a-button>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
import { shipmentCustomsNo } from '@/api/manage'
export default {
  name: 'ShipmentNoUpdate',
  data () {
    return {
      customsBrokerNoPart1: '',
      customsBrokerNoPart2: '',
      customsBrokerNoPart3: '',
      customsBrokerNoPart4: '',
      customsBrokerNoPart5: '',
      class1: false,
      class2: false,
      class3: false,
      class4: false,
      class5: false,
      btnLoading: false
    }
  },
  props: {
    roles: {
      type: Object,
      default: null
    },
    number: {
      type: Number,
      default: 0
    },
    no: {
      type: String,
      default: ''
    },
    shipmentno: {
      type: String,
      default: ''
    }
  },
  computed: {
    inputEnab () {
      return this.roles.name === 'CUSTOMS_BROKER' && this.number === 1
    },
    customNoShow () {
      return this.number >= 1 && this.roles.name !== 'CUSTOMS_BROKER'
    }
  },
  watch: {
    no: {
      handler (oldVal, newVal) {
        console.log('oldVal', oldVal, 'newVal', newVal)
        if (oldVal !== newVal && (newVal !== '' || oldVal !== '')) {
          this.customsBrokerNoPart1 = this.no.substring(0, 2)
          this.customsBrokerNoPart2 = this.no
            .substring(2, 4)
            .replace(/_/g, '')
            .replace(/ /g, '')
          this.customsBrokerNoPart3 = this.no.substring(4, 6)
          this.customsBrokerNoPart4 = this.no.substring(6, 9)
          this.customsBrokerNoPart5 = this.no.substring(9, 14)
        }
      }
    }
  },
  methods: {
    updateCustomsNo () {
      const list1 = ['A', 'B', 'C', 'D']
      const list2 = ['A', 'B', 'E', 'H', 'L', 'M', 'P', 'S', 'T', 'W', 'X']
      const list3 = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'J',
        'K',
        'M',
        'N',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y'
      ]
      const list4 = [
        'A',
        'B',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'V',
        'U',
        'W',
        'X',
        'Y',
        'K',
        'Z',
        'U',
        'J'
      ]
      const list5 = ['A', 'B', 'C', 'M', 'P', 'S', 'T', 'F']
      const validateMap = {
        A: list2,
        B: list3,
        C: list4,
        D: list5
      }
      const firstLetter1 = this.customsBrokerNoPart1.substring(0, 1)
      const firstLetter2 = this.customsBrokerNoPart2.substring(0, 1)
      const lastLetter1 = this.customsBrokerNoPart1.substring(1, 2)
      const lastLetter2 = this.customsBrokerNoPart2.substring(1, 2)
      const isNotNext1 = list1.indexOf(firstLetter1) < 0 || validateMap[firstLetter1].indexOf(lastLetter1) < 0
      const isNotNext2 = list1.indexOf(firstLetter2) < 0 || validateMap[firstLetter2].indexOf(lastLetter2) < 0
      if (isNotNext1) {
        this.$message.warn(this.$t('detail.update.no.tip1'))
        this.class1 = true
        return
      }
      this.class1 = false
      if (this.customsBrokerNoPart2 !== '' && isNotNext2) {
        this.$message.warn(this.$t('detail.update.no.tip2'))
        this.class2 = true
        return
      }
      this.class2 = false
      const y = (moment().format('YYYY') - 1911).toString().slice(-2)
      if (this.customsBrokerNoPart3 !== y) {
        this.$message.warn(this.$t('detail.update.no.tip3'))
        this.class3 = true
        return
      }
      this.class3 = false
      const reg4 = new RegExp('^(?![A-Z]+$)[A-Z0-9]{3}$')
      if (!reg4.test(this.customsBrokerNoPart4)) {
        this.$message.warn(this.$t('detail.update.no.tip4'))
        this.class4 = true
        return
      }
      this.class4 = false
      const reg5 = new RegExp('^(?![A-Z]+$)[A-Z0-9]{5}$')
      if (!reg5.test(this.customsBrokerNoPart5)) {
        this.$message.warn(this.$t('detail.update.no.tip5'))
        this.class5 = true
        return
      }
      this.class5 = false
      const customsBrokerNo =
        this.customsBrokerNoPart1 +
        (this.customsBrokerNoPart2 || '  ') +
        this.customsBrokerNoPart3 +
        this.customsBrokerNoPart4 +
        this.customsBrokerNoPart5
      this.postCustomsNo(customsBrokerNo)
    },
    // 修改报行号
    postCustomsNo (customsBrokerNo) {
      this.$store
        .dispatch('handleWeb3Decrypt')
        .then(() => {
          this.btnLoading = true
          shipmentCustomsNo({ shipmentNo: this.shipmentno, customsBrokerNo: customsBrokerNo })
            .then(res => {
              this.$message.info(this.$t('button.CbSaveDeclarationTip'))
            })
            .catch(err => {
              this.$store.dispatch('errHandler', err)
            })
            .finally(() => {
              this.btnLoading = false
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.red-border {
  border-color: red;
}
.input-no {
  width: 80px;
}
</style>
