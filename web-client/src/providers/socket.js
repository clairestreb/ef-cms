const socketRouter = app => {
  return event => {
    const message = JSON.parse(event.data);
    const { action } = message;

    switch (action) {
      case 'batch_download_ready':
        app.getSequence('batchDownloadReadySequence')({
          ...message,
        });
        break;
      default:
        break;
    }
  };
};

const createWebSocketClient = token => {
  const notificationsUrl = process.env.WS_URL || 'ws://localhost:3011';
  const connectionUrl = `${notificationsUrl}?token=${token}`;
  const socket = new WebSocket(connectionUrl);
  return socket;
};

export const socketProvider = () => {
  let app;
  let socket;

  const stop = () => {
    socket.close();
    socket = null;
  };

  const start = () => {
    const token = app.getState('token');

    if (socket && socket.close) {
      stop();
    }

    socket = createWebSocketClient(token);
    socket.onmessage = socketRouter(app);
  };

  const initialize = _app => {
    app = _app;
  };

  return {
    initialize,
    start,
    stop,
  };
};
