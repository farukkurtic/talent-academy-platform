const express = require('express');
const authRoutes = require('./auth.route')
const userRoutes = require('./user.route')
const workshopRoutes = require('./workshop.route')


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
      path: '/api/workshop',
      route: workshopRoutes,
  },
  ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;