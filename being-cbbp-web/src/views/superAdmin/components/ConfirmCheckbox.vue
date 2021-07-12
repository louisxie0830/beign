<template>
  <div>
    <a-form-item>
      <a-checkbox
        v-decorator="[
          'confirm',
          {
            valuePropName: 'checked',
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (value) {
                    callback()
                  } else {
                    callback(this.$t('admin.validate.confirm.data'))
                  }
                  callback()
                }
              }
            ]
          }
        ]"
      >{{ $t('comfirm.information') }}</a-checkbox
      >
    </a-form-item>
  </div>
</template>
<script>
export default {}
</script>
