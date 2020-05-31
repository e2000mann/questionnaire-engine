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

export function shareButtons(name, fb, tw) {
  const quote = `Have you answered ${name} yet? Do so with this questionnaire engine! ${window.location.href}`;

  //setting button actions
  fb.addEventListener("click", function() {
    FB.ui({
      method: 'share',
      href: window.location.href,
      quote: quote
    }, function(response) {});
  });
  tw.href = `https://twitter.com/intent/tweet?text=${quote}`;
}