import { register } from 'register-service-worker';
const handelUpdateData = (() => {
  let refreshing = false;
  return () => {
    console.info('refreshing: ', refreshing);
    if (!!refreshing) return;
    if (window.matchMedia('(display-mode: standalone)').matches && confirm('已有新版，是否更新')) {
      refreshing = true;
      sessionStorage.removeItem('singing');
      location.reload();
      location.href = '/Login';
    }
  };
})();
if (process.env.DEPLOY_ENV === 'prod' || process.env.DEPLOY_ENV === 'sit' || process.env.DEPLOY_ENV === 'development') {
  register(`${location.origin}/service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' + 'For more details, visit https://goo.gl/AFskqB'
      );
    },
    registered(registration) {
      console.log('Service worker has been registered.');
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updatefound(registration) {
      console.log('New content is downloading.');
    },
    updated(registration) {
      handelUpdateData();
      console.log('New content is available; please refresh.');
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    }
  });
}
