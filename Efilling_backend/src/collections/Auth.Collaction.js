const db = require("../models");
const { Op } = require("sequelize");
const TblUser = db.userModel;
const TblUsersRoles = db.usersRolesModel;
const TblOTP = db.otpModel;
const TblPasswordReset = db.passwordReset;

db.userModel.hasOne(db.otpModel,{foreignKey:'user_id',as:'otpDetails'})
db.otpModel.belongsTo(db.userModel,{foreignKey:'user_id',as:'userOTP'})

db.userModel.hasOne(db.usersRolesModel,{foreignKey:'user_id',as:'roleDetails'})
db.usersRolesModel.belongsTo(db.userModel,{foreignKey:'user_id',as:'userRole'})

db.roleModel.hasMany(db.usersRolesModel,{foreignKey:'role_id',as:'usersRoles'})
db.usersRolesModel.belongsTo(db.roleModel,{foreignKey:'role_id',as:'roles'})
// db.roleModel.belongsToMany(db.roleModel, { through: db.usersRolesModel,as:'myRoles' })


const bcrypt = require("bcryptjs");

class UserCollaction {
  getUserByEmail = async (email) => {
    let result = "";
    const query = await TblUser.findOne({
      where: {
        EMAIL: email,
      },
    }).then((res) => {
      result = res;
    });
    return result;
  };

  getUserName = async (username) => {
    const query = await TblUser.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username },
          { mobileNo: username }
        ]
      },
    });
    return query;
  };

  getAdminName = async (username) => {
    let result = "";
    const query = await TblUser.findOne({
      where: {
        username: username
      },
      include:[{
        model:TblUsersRoles, as: "roleDetails",
        where: { role_id: 1},
      }],
    }).then((res) => {
      result = res;
    });
    
    return result;
  };

  isPasswordMatch = async function (password, userPassword) {
    return bcrypt.compare(password, userPassword);
  };

  isOTPMatch = async (username, otp) => {    
    const data = await TblUser.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: username },
          { mobileNo: username }
        ]
      },
      include:[{
        model:TblOTP,
        as:'otpDetails',
        attributes:['otp']
      }]
    });
    
    if (data.otp != "" && data.otpDetails.dataValues.otp == otp) {
      await TblOTP.update({ otp: null},{where: {user_id: data.id}});
      await TblUser.update({veification_status:1,verified_by:'Mobile'},{where: {id: data.id}});
      return 1;
    }
    return 0;
  };

  checkOtpLastSend = async (id) => {
    const result =  await TblOTP.findOne({
      // logging: (sql, queryObject) => {
      //   sendToElasticAndLogToConsole(sql, queryObject)
      // },
      where:{user_id:id,otp: {
        [Op.not]: null
      }}
    })
    return result;
  }

  updateForgotPassToken = async(id,token,expire)=>{
     const record =  await TblPasswordReset.findOne({where:{user_id:id}});
     if(record){
      const data =  await TblPasswordReset.update({resetPasswordToken: token,resetPasswordExpires:expire},{where: {user_id:id}});
      return await TblPasswordReset.findOne({where:{user_id:id}});
     }else{
      return TblPasswordReset.create({
        user_id:id,
        resetPasswordToken: token,
        resetPasswordExpires:expire
      });
     }
  }

  isTokenMatch = async(body)=>{
    const {identity} = body;
    const user = await this.getUserName(identity);
    const forgot =  await TblPasswordReset.findOne({where:{user_id:user.id}});
    
    if(forgot.resetPasswordToken == body.token){
      return {
        resetPasswordToken:forgot.resetPasswordToken,
        resetPasswordExpires:forgot.resetPasswordExpires,
        user_id:user.id
      }
    }
    return null;
  }

} //end of class


function sendToElasticAndLogToConsole (sql, queryObject) {  
  // save the `sql` query in Elasticsearch
  console.log(sql)

  // use the queryObject if needed (e.g. for debugging)
}

module.exports = new UserCollaction();
