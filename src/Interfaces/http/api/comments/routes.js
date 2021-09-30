const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentByThreadIdHandler,
    options: {
      auth: 'forum_api_jwt',
    },
  },
]);

module.exports = routes;
