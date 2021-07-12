// template.js
module.exports = {
  vueTemplate: compoenntName => {
    return `<template>
	<div class="${compoenntName}">
		${compoenntName}组件
	</div>
</template>
<script>
export default {
	name: '${compoenntName}'
};
</script>
<style lang="stylus" scoped>
.${compoenntName} {
};
</style>`;
  },
  entryTemplate: compoenntName => {
    return `import ${compoenntName} from './main.vue'
export default [{
	path: "/${compoenntName}",
	name: "${compoenntName}",
	component: ${compoenntName}
}]`;
  }
};
