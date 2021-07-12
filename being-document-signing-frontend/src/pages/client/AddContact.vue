<template>
  <v-flex>
    <v-toolbar height="56"
               app>
      <v-flex xs2>
        <go-back />
      </v-flex>
      <v-flex xs8>
        <header-title :title="$t('add_contact.toolbar_title.text')"></header-title>
      </v-flex>
      <v-flex xs2 />
    </v-toolbar>
    <v-container pa-3>
      <v-layout>
        <v-flex xs12
                sm8
                md6
                offset-sm2
                offset-md3>
          <v-card>
            <v-card-text>
              <v-form ref="form"
                      v-model="valid">
                <v-flex xs12>
                  <p class="b-label"
                     v-text="$t('common.name')">姓名</p>
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="name"
                              validate-on-blur
                              :rules="rules.name"
                              :placeholder="$t('add_contact.data.name_rules.input_name')"
                              single-line
                              outline
                              required />
                <v-flex xs12>
                  <p class="b-label">Email</p>
                </v-flex>
                <v-text-field class="b-input"
                              v-model.trim="email"
                              validate-on-blur
                              :rules="rules.email"
                              :placeholder="$t('common.email_rules.input_email')"
                              type="text"
                              single-line
                              outline
                              required />

              </v-form>
            </v-card-text>
          </v-card>
          <v-flex xs12
                  sm12
                  mt-3
                  d-flex
                  class="b-btn-area">
            <v-btn round
                   large
                   class="b-btn"
                   @click="submit"
                   v-text="$t('common.add')">新增</v-btn>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>

<script>
import { mapActions } from 'vuex';
import { actions } from './../../store/type.js';
import rulesMixin from './../../mixins/Rules.js';
export default {
  mixins: [rulesMixin],
  data() {
    return {
      valid: false,
      name: '',
      email: ''
    };
  },
  methods: {
    ...mapActions({
      POST_ADD_CONTACT: actions.POST_ADD_CONTACT
    }),
    async submit() {
      if (this.$refs.form.validate()) {
        try {
          await this.POST_ADD_CONTACT({
            name: this.name,
            email: this.email
          });
          this.toast.show({
            icon: 'check',
            content: this.$t('common.add_success')
          });
        } finally {
          this.email = '';
          this.name = '';
          this.$refs.form.resetValidation();
        }
      }
    }
  }
};
</script>
