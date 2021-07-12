function bind(el) {
  el.addEventListener('paste', e => e.preventDefault(), false);
}
function unbind(el) {
  el.removeEventListener('paste', e => e.preventDefault());
}

export default {
  bind,
  unbind
};
