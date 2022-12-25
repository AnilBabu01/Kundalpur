const httpStatus = require("http-status");
const { userService, donationService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { generateAuthTokens } = require("../utils/tokens");

const adminLogin = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const data = await userService.loginAdmin(username, password);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  const tokens = await generateAuthTokens(data);
  res.send({
    user: {
      id: data.id,
      username: data.username,
      name: data.name,
      roles: data.roles,
      profile_image: data.profile_image,
    },
    tokens,
  });
});

const userRegister = async (req, res) => {
  // if (req.user.roleDetails.roles.role_name != "Admin") {
  //   res.status(httpStatus.CONFLICT).send({
  //     status: false,
  //     msg: "Only admin access.",
  //   });
  // }
  const userdata = await userService.createuser(req.body, req.files);
    if (!userdata) {
      res.status(httpStatus.CONFLICT).send({
        status: false,
        msg: "Username already exist.",
      });
    }
    res.status(httpStatus.CREATED).send(userdata);
};

const allList = catchAsync(async(req,res)=>{
  // if (req.user.roleDetails.roles.role_name != "Admin") {
  //   res.status(httpStatus.CONFLICT).send({
  //     status: false,
  //     msg: "Only admin access.",
  //   });
  // }
  const list = await donationService.allList(req);
  res.status(200).send({
    status:true,
    msg:'All List',
    data:list,
  })
})

module.exports = {
  adminLogin,
  userRegister,
  allList
};
