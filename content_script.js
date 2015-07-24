function buildVoteIcons() {
  var comments = [].slice.call(document.querySelectorAll('.timeline-comment-wrapper'), 0);
  var upAvatars = [];
  var downAvatars = [];
  var alreadySeenUp = [];
  var alreadySeenDown = [];

  function findUpVoter(comment) {
    findVoter('+1', 'thumbsup', comment, upAvatars, alreadySeenUp);
  }

  function findDownVoter(comment) {
    findVoter('-1', 'thumbsdown', comment, downAvatars, alreadySeenDown);
  }

  function findVoter(voteText, voteText2, comment, avatars, alreadySeen) {
    var regex = new RegExp('^\\' + voteText);
    var text = comment.querySelector('.comment-body').textContent.trim();
    if (
      text.match(regex) ||
      comment.querySelector('img[title=":' + voteText + ':"]') ||
      comment.querySelector('img[title=":' + voteText2 + ':"]')
    ) {
      var avatar = comment.querySelector('a').cloneNode(true);
      var user = avatar.href;
      if (alreadySeen.indexOf(user) < 0) {
        avatars.push(avatar);
        alreadySeen.push(user);
      }

      if (text.match(new RegExp('^\\' + voteText +'$')) || !text ) { // there wont be text if the comment is just a 👍
        comment.style.display='none';
      }
    }
  }

  function appendVotes(avatars, icon) {
    if (avatars.length > 0) {
      var div = document.createElement('div');
      div.className = 'js-' + (icon=='thumbsup' ? 'plus' : 'minus') + '-one-count flex-table gh-header-meta';
      div.innerHTML = ''+
        '<div class="flex-table-item">'+
        '  <div class="state" style="background: hsl(215, 50%, 50%)">'+
        '    <span class="octicon octicon-' + icon + '"></span>'+
        '    ' + (icon=='thumbsup' ? '+' : '-') + avatars.length +
        '  </div>'+
        '</div>'+
        '<div class="flex-table-item flex-table-item-primary"></div>';

      var avatarContainer = div.querySelector('.flex-table-item-primary');

      avatars.forEach(function(avatar) {
        avatar.className = 'tooltipped tooltipped-' + (icon=='thumbsup' ? 'n' : 's');
        avatar.style.float = 'left';
        var img = avatar.querySelector('img');
        avatar.setAttribute('aria-label', img.alt.substring(1));
        img.className = 'avatar avatar-small';
        img.setAttribute('height', '26px');
        img.setAttribute('width', '26px');
        avatarContainer.appendChild(avatar);
      });

      var currentCount = document.querySelector('.js-' + (icon=='thumbsup' ? 'plus' : 'minus') + '-one-count');
      if (currentCount) { currentCount.remove(); }

      document.querySelector('.gh-header-show').appendChild(div);
    }
  }

  comments.forEach(function(comment) {
    findUpVoter(comment);
    findDownVoter(comment);
  });

  appendVotes(upAvatars, 'thumbsup');
  appendVotes(downAvatars, 'thumbsdown');
}

var observer = new MutationObserver(function(mutations) {
  var needsRemoval = false;
  mutations.forEach(function(mutation) {
    Array.prototype.slice.call(mutation.addedNodes).forEach(function(node) {
      if (node instanceof Element && (node.querySelector('.js-comment') || node.classList.contains('js-comment'))) {
        needsRemoval = true;
      }
    });
  });

  if (needsRemoval) {
    buildVoteIcons();
  }
});

observer.observe(document.querySelector('div.js-discussion'), {childList: true});

buildVoteIcons();
