function bind(el, { value }) {
  let onScrollOutside = value;
  el.handler = function(e) {
    if (el && !el.contains(e.target)) {
      onScrollOutside(e);
    }
  };
  document.addEventListener('scroll', el.handler, true);
  document.addEventListener('touchmove', el.handler, true);
}
function unbind(el) {
  document.removeEventListener('scroll', el.handler, true);
  document.removeEventListener('touchmove', el.handler, true);
  el.handler = null;
}

export default {
  bind,
  unbind
};
