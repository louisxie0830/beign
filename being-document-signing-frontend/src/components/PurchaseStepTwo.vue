<template>
  <v-container pa-0>
    <v-layout row
              wrap>
      <v-flex xs12>
        <v-card class="b-card three mb-2">
          <v-card-text>
            <v-flex xs12>
              <p class="b-label heavy">{{ $t('purchase.customer.info.title') }}</p>
            </v-flex>
            <v-flex xs12>
              <v-form ref="form"
                      v-model="valid"
                      lazy-validation>
                <v-flex xs12>
                  <p class="b-label">{{ $t('common.name') }}</p>
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="name"
                              :rules="rules.name"
                              :placeholder="$t('add_contact.data.name_rules.input_name')"
                              validate-on-blur
                              single-line
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.phone')" />
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="phone"
                              v-disable-paste
                              :rules="rules.phone('TW')"
                              :placeholder="$t('common.phone_placeholder')"
                              validate-on-blur
                              single-line
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label">Email</p>
                </v-flex>
                <v-text-field class="b-input"
                              :value="email"
                              :rules="rules.email"
                              :placeholder="$t('purchase.invoice.email.text')"
                              validate-on-blur
                              v-model="email"
                              single-line
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('purchase.invoice.address.input.text')" />
                </v-flex>
                <v-text-field class="b-input"
                              :value="address"
                              :rules="rules.address"
                              :placeholder="$t('purchase.invoice.address.text')"
                              validate-on-blur
                              v-model="address"
                              single-line
                              outline
                              required />
              </v-form>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-card class="b-card three">
          <v-card-text>
            <v-flex xs12>
              <p class="b-label heavy">{{ $t('purchase.invoice.info.title') }}</p>
            </v-flex>
            <v-flex xs12>
              <p class="b-label">{{ $t('purchase.company.invoice.title') }}</p>
            </v-flex>
            <v-flex xs12>
              <v-form ref="formTwo"
                      v-model="threeValid"
                      lazy-validation>
                <v-flex xs12>
                  <p class="b-label">{{ $t('purchase.invoice.title') }}</p>
                </v-flex>
                <v-text-field class="b-input"
                              v-model="invoiceTitle"
                              v-disable-paste
                              :rules="rules.invoiceTitle"
                              :placeholder="$t('purchase.invoice.title.placeholder')"
                              validate-on-blur
                              single-line
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('purchase.invoice.no')" />
                </v-flex>
                <v-text-field class="b-input"
                              v-model="invoice"
                              v-disable-paste
                              :rules="rules.invoice"
                              :placeholder="$t('purchase.invoice.no.placeholder')"
                              maxlength="8"
                              validate-on-blur
                              single-line
                              outline
                              required />

              </v-form>
            </v-flex>
            <v-flex xs12>
              <p class="b-label">{{ $t('purchase.invoice.policy.text') }}</p>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12
              class="b-btn-area">
        <v-container pa-0>
          <v-layout row
                    wrap>
            <v-flex xs6
                    pr-1
                    pl-1>
              <v-btn round
                     large
                     block
                     class="b-btn white"
                     @click="goStep('prev')"
                     v-text="$t('common.pre_step')" />
            </v-flex>
            <v-flex xs6
                    pr-1
                    pl-1>
              <v-btn round
                     large
                     block
                     class="b-btn"
                     @click="goStep('next')">{{ $t('common.next_step') }}</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapActions } from 'vuex';
import { actions } from './../store/type.js';
import rulesMixin from './../mixins/Rules.js';
export default {
  mixins: [rulesMixin],
  props: {},
  data() {
    return {
      valid: false,
      threeValid: false,
      name: '',
      phone: '',
      email: '',
      address: '',
      invoiceTitle: '',
      invoice: null,
      payment: null
    };
  },
  methods: {
    async purchasePackage() {
      if (!this.$refs.formTwo.validate() || !this.$refs.form.validate()) {
        return;
      }

      console.log(paymentInfo);
    },
    goStep(step) {
      if (step === 'next') {
        if (!this.$refs.formTwo.validate() || !this.$refs.form.validate()) {
          return;
        }
      }
      const paymentInfo = {
        address: this.address,
        mobile: this.phone,
        name: this.name,
        tax_id: this.invoice,
        title: this.invoiceTitle,
        email: this.email,
        type: 3
      };
      this.$emit('setInvoiceData', paymentInfo);
      this.$emit('goStep', step);
    }
  }
};
</script>
<style lang="scss" scoped>
.b-card.three {
  .b-label.heavy {
    font-size: 17px;
    color: #1a1f25;
  }
}
</style>
