const express = require('express');
const router = express.Router();
// const {signUp} = ("../controllers/userController");
const {
    signUp, 
    login,
    logout,
    forgotPassword, 
    passwordReset, 
    getLoggedInUserDetails, 
    changePassword,
    updateUserDetails, 
    adminAllUser,
    managerAllUser,
    adminOneUser,
    adminUpdateOneUserDetails,
    adminDeleteOneUserDetails,

} = require ("../controllers/userController");
const { isLoggedIn , customRole} = require('../middlewares/user');

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails); //req will first goes to isLoggedIn to verify thn get sdashboard
router.route("/password/update").post(isLoggedIn,changePassword);
router.route("/userdashboard/update").post(isLoggedIn,updateUserDetails);
//Admin only route
router.route("/admin/users").get(isLoggedIn, customRole('admin'), adminAllUser);
//admin get one user 
router.route("/admin/user/:id").get(isLoggedIn, customRole('admin'), adminOneUser);

router.route("/admin/user/:id").put(isLoggedIn, customRole('admin'), adminOneUser).put(isLoggedIn,customRole("admin"),adminUpdateOneUserDetails);

router.route("/admin/user/:id").put(isLoggedIn, customRole('admin'), adminOneUser).put(isLoggedIn,customRole("admin"),adminUpdateOneUserDetails).delete(isLoggedIn,customRole("admin"),adminDeleteOneUserDetails);
//manager only route
router.route("/manager/users").get(isLoggedIn, customRole('manager'), managerAllUser);


module.exports = router;


