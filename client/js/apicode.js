export function initFB() {
  window.fbAsyncInit = function() {
    FB.init({
      appId: '710291289713662',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v6.0'
    });
  };
}

function initGoogle() {
  gapi.load('auth2', function() {
    const auth2 = google.auth2.init({
      client_id: '679360714828-n4i9ihe8ip647rbq6ir3djii02v96p88.apps.googleusercontent.com'
    });

    return auth2;
  });
}

window.onload = function() {
  // init both APIs
  initFB();
  const auth2 = initGoogle();
};