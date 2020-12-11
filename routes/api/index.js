const router = require('express').Router();
const departmentRoutes = require('./department-routes');
// const productRoutes = require('./product-routes');


router.use('/departments', departmentRoutes);
// router.use('/products', productRoutes);


module.exports = router;
