const httpStatus = require("http-status");
const { userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { generateAuthTokens } = require("../utils/tokens");
const { isEmailValid } = require("../utils/checkEmail");
const ApiError = require("../utils/ApiError");

const createUser = catchAsync(async (req, res) => {
  const userdata = await userService.createuser(req.body);
  res.status(httpStatus.CREATED).send(userdata);
});

const login = catchAsync(async (req, res) => {
  const { identity, password } = req.body;

  console.log(req.body);
  const data = await userService.loginuser(identity, password);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  const tokens = await generateAuthTokens(data);
  res.send({
    status: true,
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

const loginWithMobile = catchAsync(async (req, res) => {
  const login = await userService.mobileLogin(req.body);
  if (!login) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(200).send({
    status: 1,
    msg: "OTP successfully send to your mobile number.",
  });
});

const loginWithEmail = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  let data = await userService.loginuser(email, password);
  console.log(data)
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  const tokens = await generateAuthTokens(data);
  res.status(200).send({
    user: {
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email,
      gender: data.gender,
      role: data.role_name,
      role_id: data.role_id,
    },
    tokens,
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { username, otp } = req.body;

  const data = await userService.verifyOTP(username, otp);

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  const tokens = await generateAuthTokens(data);
  res.status(200).send({
    user: {
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email,
      gender: data.gender,
      role: data.role_name,
      role_id: data.role_id,
    },
    tokens,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await userService.forgotPass(req.body);
  res.status(200).send({
    status: true,
    data: result,
  });
});

const forgotPasswordSecond = catchAsync(async (req, res) => {
  const result = await userService.forgotPassSecond(req.body);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Otp mismatch.");
  }
  res.status(200).send({
    status: true,
    msg: "OTP matched.",
    token: result,
  });
});

const forgotPasswordThird = catchAsync(async (req, res) => {
  const result = await userService.forgotPasswordThird(req.body);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Something went wrong!");
  }
  res.status(200).send({
    status: true,
    msg: "Password reset successfully.",
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const update = await userService.profileUpdate(req);
  if (!update) {
    throw new ApiError(httpStatus.NOT_FOUND, "Something wrong!");
  }
  res.status(200).send({
    status: true,
    msg: "Profile Update Successfully.",
  });
});

const profileList = catchAsync(async (req, res) => {
  const list = await userService.profileList(req);
  if (!list) {
    throw new ApiError(httpStatus.NOT_FOUND, "Something wrong!");
  }
  res.status(200).send({
    status: true,
    msg: "Profile List.",
    profile: list,
  });
});

const createAccount = catchAsync(async (req, res) => {
  const create = await userService.createAccount(req);
  if (create?.status === 0) {
    res.status(401).send({
      status:create.status,
      message:create.error
    })
  }

  res.status(200).send({
    status: true,
    msg: "Account created successfully.",
  });
});


const getUsers = catchAsync(async (req, res) => {
  const create = await userService.getUsers(req);
  console.log(create)
  if (create?.status === 0) {
    res.status(401).send({
      status:create.status,
      message:create.error
    })
  }
  res.status(200).send({
    status: true,
    data: create
  });
});


module.exports = {
  createUser,
  login,
  loginWithMobile,
  loginWithEmail,
  verifyOTP,
  forgotPassword,
  forgotPasswordSecond,
  forgotPasswordThird,
  updateProfile,
  profileList,
  createAccount,
  getUsers
};
