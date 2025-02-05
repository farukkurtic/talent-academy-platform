const express = require('express');
const authRoutes = require('./auth.route')
const userRoutes = require('./user.route')

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
  ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;