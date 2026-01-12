// Minimal Deployer injector for CTFd challenge modal/pages
(function () {
  var WIDGET_ID = 'deployer-widget';

  // Provide Alpine component used by deployer_element.html
  if (!window.Deployer) {
    window.Deployer = function (opts) {
      return {
        fqdn: (opts && opts.fqdn) || null,
        expires: (opts && opts.expires) || null,
        challenge_id: opts && opts.challenge_id,
        loading: false,
        get buttonText() { return this.fqdn ? 'Stop Instance' : 'Start Instance'; },
        init: function () {},
        startInstance: async function () {
          if (this.loading) return;
          this.loading = true;
          try {
            var r = await CTFd.fetch('/api/v1/deployer/start', {
              method: 'POST',
              credentials: 'same-origin',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              body: JSON.stringify({ challenge_id: this.challenge_id })
            });
            var data = await r.json().catch(function(){ return null; });
            if (data && data.fqdn) {
              this.fqdn = data.fqdn;
              this.expires = data.expires || null;
            } else {
              // Fallback: re-render server view
              refresh(this.challenge_id);
            }
          } catch (_) {
            // Silent fail; UX handled by button state
          } finally {
            this.loading = false;
          }
        },
        stopInstance: async function () {
          if (this.loading) return;
          this.loading = true;
          try {
            await CTFd.fetch('/api/v1/deployer/stop', {
              method: 'POST',
              credentials: 'same-origin',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
              body: JSON.stringify({ challenge_id: this.challenge_id })
            });
            this.fqdn = null;
            this.expires = null;
          } catch (_) {
          } finally {
            this.loading = false;
          }
        }
      };
    };
  }

  function insertWrapper() {
    // Prefer inserting before the submit row in the modal content
    var submitRow = document.querySelector('#challenge .submit-row, .submit-row');
    var container = submitRow ? submitRow.parentNode : document.querySelector('#challenge-window .modal-body') || document.body;
    if (!container) return null;

    var wrapper = document.getElementById(WIDGET_ID);
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = WIDGET_ID;
      wrapper.style.marginBottom = '1rem';
      if (submitRow && submitRow.parentNode) {
        submitRow.parentNode.insertBefore(wrapper, submitRow);
      } else {
        container.insertBefore(wrapper, container.firstChild);
      }
    }
    return wrapper;
  }

  function refresh(challengeId) {
    var wrapper = insertWrapper();
    if (!wrapper || !challengeId) return;
    fetch('/api/v1/deployer/' + challengeId, { credentials: 'include' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.view) {
          if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
          return;
        }
        wrapper.innerHTML = data.view;
      })
      .catch(function () {
        if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      });
  }

  function hookCTFd() {
    try {
      if (window.CTFd && CTFd._internal && CTFd._internal.challenge) {
        var prev = CTFd._internal.challenge.postRender;
        CTFd._internal.challenge.postRender = function () {
          try { if (typeof prev === 'function') prev(); } catch (_) {}
          var d = CTFd._internal.challenge.data || {};
          if (d && d.id) refresh(d.id);
        };
        return true;
      }
    } catch (_) {}
    return false;
  }

  function fallback() {
    var input = document.getElementById('challenge-id');
    var id = input && input.value ? parseInt(input.value, 10) : null;
    if (id) refresh(id);
  }

  function init() {
    if (!hookCTFd()) fallback();
    // Also refresh when the challenge modal is shown (Bootstrap 5)
    try {
      document.addEventListener('shown.bs.modal', function (e) {
        var target = e && e.target;
        if (!target) return;
        if (target.id === 'challenge-window' || (target.closest && target.closest('#challenge-window'))) {
          fallback();
        }
      });
    } catch (_) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


