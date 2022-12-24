const sequelize = require('../db/db-connection');
module.exports.userModel = require('./user.model');
module.exports.otpModel = require('./otp.model');
module.exports.roleModel = require('./role.model');
module.exports.usersRolesModel = require('./users_roles.model');
module.exports.passwordReset = require('./password_reset.model');
module.exports.donationModel = require('./donationDetail.model');
module.exports.donationItem = require('./donationItem.model');
module.exports.itemList = require('./item.model');

sequelize.sync().then((result) => {
    console.log('data synced')
}).catch((e) => {
    console.log('error in sync', e)
});



