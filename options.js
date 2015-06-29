// Saves options to chrome.storage
function save_options() {
  var gh_url = document.getElementById('gh_url').value;
	chrome.permissions.request({
			origins: [gh_url]
		}, function(granted) {
			if (!granted) {
				var error = document.getElementById('error');
    		error.textContent = 'Url format: <protocol>://<domain>.<tld>/';
			}
		});

  chrome.storage.sync.set({
    gh_url: gh_url
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    gh_url: ''
  }, function(items) {
    document.getElementById('gh_url').value = items.gh_url;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

