const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplyBycommentIdHandler,
    options: {
      auth: 'forum_api_jwt',
    },
  },
]);

module.exports = routes;
