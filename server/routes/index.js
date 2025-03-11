const express = require('express');
const authRoutes = require('./auth.route')
const userRoutes = require('./user.route')
const workshopRoutes = require('./workshop.route')

const feedRoutes = require('./feed.route')
const chatRoutes = require('./chat.route')

const router = express.Router();

const defaultRoutes = [

    {
      path: '/api/auth',
      route: authRoutes,
    },
    {
        path: '/api/user',
        route: userRoutes,
    },
    {
      path: '/api/posts',
      route: feedRoutes,
    },
    {
      path: '/api/chat',
      route: chatRoutes,
    },
  {
    path: '/api/workshop',
    route: workshopRoutes,
  },
  ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;