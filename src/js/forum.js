import ky from 'ky';
import $ from 'jquery';

async function refreshMessages() {
  // GET https://ensmn.herokuapp.com/messages
  const messages = await ky.get('https://ensmn.herokuapp.com/messages').json();
  displayMessages(messages);
}

function displayMessages(messages) {
  const $container = $('#messages-container');

  // Clear list content on view
  $container.empty();

  // Iterate on messages and display getMessageView(message);
  for (const message of messages) {
    const view = getMessageView(message);
    $container.append(view);
  }
}

function getMessageView(message) {
  return `<div class="card my-3">
    <div class="card-body">
      <h5 class="card-title">${message.author} a dit</h5>
      <h6 class="card-subtitle mb-2 text-muted">${message.timestamp}</h6>
      ${message.content}
    </div>
  </div>`;
}

setInterval(() => {
  refreshMessages();
}, 10000);

async function sendMessage(username, message) {
  // POST https://ensmn.herokuapp.com/messages (username, message)
  await ky.post('https://ensmn.herokuapp.com/messages', {json: {username, message}}).json();

  // After success, getMessages()
  refreshMessages();
}

$('body').on('submit', '#form-messsage', (event) => {
  event.preventDefault(); // Avoid default form send

  const $username = $('#username');
  const $message = $('#message');

  const username = $username.val();
  const message = $message.val();

  if (username == null || username.length === 0) {
    return;
  }

  if (message == null || message.length === 0) {
    return;
  }

  sendMessage(username, message);

  $username.val('');
  $message.val('');
});

refreshMessages();
