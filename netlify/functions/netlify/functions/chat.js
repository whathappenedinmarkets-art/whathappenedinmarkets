const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '2173347',
  key: '2c8fa3ec6496b43b8a32',
  secret: '413f447c6f11790cbc7f',
  cluster: 'us2',
  useTLS: true
});

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { type, username, text } = JSON.parse(event.body);
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    if (type === 'message') {
      await pusher.trigger('whim-market-chat', 'new-message', { username, text, time });
    } else if (type === 'join') {
      await pusher.trigger('whim-market-chat', 'user-joined', { username });
    } else if (type === 'leave') {
      await pusher.trigger('whim-market-chat', 'user-left', { username });
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
