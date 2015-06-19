function removePlusOnes() {
  var comments = [].slice.call(document.querySelectorAll('.timeline-comment-wrapper'), 0);
  var avatars = [];
  var alreadySeen = [];
  comments.forEach(function (comment) {
    var text = comment.querySelector('.comment-body').textContent.trim();
    if (
      text.match(/^\+1/) ||
      comment.querySelector('img[title=":+1:"]') ||
      comment.querySelector('img[title=":thumbsup:"]')
    ) {
      var avatar = comment.querySelector('a').cloneNode(true);
      var user = avatar.href;
      if(alreadySeen.indexOf(user) < 0) {
        avatars.push(avatar);
        alreadySeen.push(user);
      }
      if(text.match(/^\+1$/) || !text) { // there wont be text if the comment is just a 👍
        comment.style.display = 'none';
      }
    }
  });

  if(avatars.length > 0) {
    var div = document.createElement('div');
    div.className = 'flex-table gh-header-meta';
    div.innerHTML = '' +
        '<div class="flex-table-item">' +
        '  <div class="state" style="background: hsl(215, 50%, 50%)">' +
        '    <span class="octicon octicon-thumbsup"></span>' +
        '    +' + avatars.length +
        '  </div>' +
        '</div>' +
        '<div class="flex-table-item flex-table-item-primary"></div>';

    var avatarContainer = div.querySelector('.flex-table-item-primary');
    avatarContainer.style.paddingTop = 0;

    avatars.forEach(function (avatar) {
      var img = avatar.querySelector('img');
      img.className = '';
      img.style.height = '26px';
      img.style.width = '26px';
      img.style.margin = '0 2px';
      img.style.borderRadius = '3px';
      avatarContainer.appendChild(avatar);
    });

    document.querySelector('.gh-header-show').appendChild(div);
  }
}

var observer = new MutationObserver(function(mutations) {
  var needsRemoval = false;
  mutations.forEach(function(mutation) {
    Array.prototype.slice.call(mutation.addedNodes).forEach(function(node) {
      if (node instanceof Element && (node.querySelector(".js-discussion") || node.classList.contains("js-discussion"))) {
        needsRemoval = true;
      }
    });
  });

  if (needsRemoval) {
    removePlusOnes();
  }
});

observer.observe(document, {childList: true, subtree: true});

removePlusOnes();
