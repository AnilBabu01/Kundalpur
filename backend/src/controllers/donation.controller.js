const httpStatus = require("http-status");
const { donationService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const addNewDonation = catchAsync(async (req, res) => {
  const data = await donationService.addNewDonation(req);
  console.log(data,'elect')
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Donation addedd successfully.",
  });
});

const addelecDonation = catchAsync(async (req, res) => {
  const data = await donationService.addelecDonation(req);
  console.log(data,'elect')
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Electric Donation added successfully.",
  });
});


const getElecDonation = catchAsync(async(req,res)=>{
  const data = await donationService.getElecDonation(req)

  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  }
  res.status(httpStatus.CREATED).send({
    status: true,
    msg: "Succes",
    data:data
  });
})

const addCashDonation = catchAsync(async (req, res) => {
  const data = await donationService.cashDonation(req);
  res.status(httpStatus.CREATED).send(data);
});

const donationList = catchAsync(async (req, res) => {
  const data = await donationService.list(req);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, "!somthing Went Wrong");
  } else {
    res.status(200).send({
      msg: "All record.",
      donation: data,
    });
  }
});

const itemList = catchAsync(async (req, res) => {
  const data = await donationService.getItemList();
  res.status(200).send(data);
});

module.exports = {
  addCashDonation,
  donationList,
  itemList,
  addNewDonation,
  addelecDonation,
  getElecDonation
};
