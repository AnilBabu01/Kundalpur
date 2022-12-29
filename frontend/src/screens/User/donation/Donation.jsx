import React, { useEffect, useState } from "react";
import { serverInstance } from "../../../API/ServerInstance";
import badebaba from "../../../assets/badebaba.jpg";
import { displayRazorpay } from "../../../RazorPay/RazorPay";
import PaymentSuccessfull from "./PaymentSuccessfull/PaymentSuccessfull";
import ChequeSuccessfull from "./chequeSuccessfull/ChequeSuccessfull";
import { TypesOfDonation } from "./TypesOfDonation";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Swal from "sweetalert2";
import "./Donation.css";
const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "12px",
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 2,
};
function Donation() {
  const nagivate = useNavigate();
  const [mode, setmode] = useState("");
  const [amount, setamount] = useState("");
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [formerror, setFormerror] = useState({});
  const [donationdata, setDonationdata] = useState({
    name: "",
    chequeno: "",
    date_of_sub: "",
    name_of_bank: "",
    Remark: "",
    donationtype: "Please Select",
    selected: "",
    amount: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const onChange = (e) => {
    setDonationdata({ ...donationdata, [e.target.name]: e.target.value });
  };
  const handlesubmit = (e) => {
    setFormerror(validate(donationdata));

    if (!sessionStorage.getItem("token")) {
      nagivate("/login");
      return false;
    }
    if (mode === "Onilne") {
      displayRazorpay(
        {
          ammount: amount,
          userid: 1,
        },
        (data) => {
          serverInstance("user/add-donation", "POST", {
            NAME: donationdata.name,
            MODE_OF_DONATION: mode === "Online" ? 1 : 2,
            AMOUNT: amount,
            CHEQUE_NO: donationdata?.chequeno,
            DATE_OF_CHEQUE: donationdata?.date_of_sub,
            NAME_OF_BANK: donationdata?.name_of_bank,
            DATE_OF_DAAN: new Date(),
            PAYMENT_ID: data.razorpay_order_id,
          }).then((res) => {
            if (res.status === true) {
              handleOpen();
            } else {
              Swal.fire("Error!", "Somthing went wrong!!", "error");
            }
          });
        }
      );
    }

    if (mode === "Cheque") {
      handleOpen1();
    }
  };
  useEffect(() => {}, [formerror, donationdata]);
  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = " name is required";
    }

    if (!amount) {
      errors.amount = "amount is required";
    }

    if (!values.Remark) {
      errors.Remark = "Remark is required";
    }

    if (values.donationtype === "Please Select") {
      errors.donationtype = "Donation type is required";
    }

    if (!values.selected) {
      errors.selected = "Please donation for";
    }
    if (!values.chequeno) {
      errors.chequeno = "cheque no is required";
    }
    if (!values.date_of_sub) {
      errors.date_of_sub = "date submission is required";
    }

    if (!values.name_of_bank) {
      errors.name_of_bank = "name of bank is required";
    }

    return errors;
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <PaymentSuccessfull
              handleClose={handleClose}
              name={donationdata.name}
              amount={amount}
              recieptno={"1"}
            />
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open1}
        onClose={handleClose1}
        closeAfterTransition
      >
        <Fade in={open1}>
          <Box sx={style}>
            <ChequeSuccessfull handleClose={handleClose} />
          </Box>
        </Fade>
      </Modal>

      <div className="supper-main-div">
        <div className="donation-top-img">
          <img src={badebaba} alt="badebaba" />
          <div className="donation-top-img-overlay">Donation</div>
        </div>

        <div className="supper-inear-main-div">
          <div className="main-form-div">
            <h2>Donate</h2>
            <div className="main-input-div">
              <div className="inner-checkbox-div">
                Donation For :
                <input
                  type="radio"
                  name="selected"
                  value="yes1"
                  onChange={onChange}
                />
                Self
                <input
                  type="radio"
                  name="selected"
                  value="yes2"
                  onChange={onChange}
                />
                Someone
                <p style={{ color: "red", marginTop: "5px" }}>
                  {formerror.selected}
                </p>
              </div>
              <div className="inner-checkbox-div">
                Mode :
                <input
                  type="radio"
                  value="Onilne"
                  name="mode"
                  onChange={(e) => setmode(e.target.value)}
                />
                Onilne
                <input
                  type="radio"
                  value="Cheque"
                  name="mode"
                  onChange={(e) => setmode(e.target.value)}
                />
                Cheque
              </div>
            </div>
            <div className="main-input-div">
              <div
                className={
                  formerror.name
                    ? "inner-input-div-input-red"
                    : "inner-input-div"
                }
              >
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={donationdata.name}
                  onChange={onChange}
                />
                <p style={{ color: "red", marginTop: "5px" }}>
                  {formerror.name}
                </p>
              </div>
              <div
                className={
                  formerror.donationtype
                    ? "inner-input-div-select-red"
                    : "inner-input-div"
                }
              >
                <label>Type of donation </label>
                <select
                  id="type"
                  name="donationtype"
                  value={donationdata.donationtype}
                  onChange={onChange}
                >
                  {TypesOfDonation.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
                <p style={{ color: "red", marginTop: "5px" }}>
                  {formerror.donationtype}
                </p>
              </div>
            </div>
            {mode === "Onilne" && (
              <>
                <div>
                  <div className="main-input-div">
                    <div className="inner-input-div">
                      <label>Amount</label>
                      <input
                        type="text"
                        value={amount}
                        placeholder="Amount"
                        onChange={(e) => setamount(e.target.value)}
                      />

                      <p style={{ color: "red", marginTop: "5px" }}>
                        {formerror.amount}
                      </p>

                      <div
                        className="donation-money-div-main"
                        style={{ marginTop: "10px" }}
                      >
                        <div className="btn-recharge-div">
                          <button onClick={() => setamount("1111")}>
                            ₹1111
                          </button>
                          <button onClick={() => setamount("2121")}>
                            ₹2121
                          </button>
                          <button onClick={() => setamount("5151")}>
                            ₹5151
                          </button>
                        </div>
                        <div className="btn-recharge-div">
                          <button onClick={() => setamount("11111")}>
                            ₹11,111
                          </button>
                          <button onClick={() => setamount("21211")}>
                            ₹21,211
                          </button>
                          <button onClick={() => setamount("51511")}>
                            ₹51,511
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div
                        className={
                          formerror.Remark
                            ? "inner-input-div-input-red"
                            : "inner-input-div"
                        }
                      >
                        <label>Remark</label>
                        <input
                          type="text"
                          name="Remark"
                          placeholder="Remark"
                          value={donationdata.Remark}
                          onChange={onChange}
                        />
                        <p style={{ color: "red", marginTop: "5px" }}>
                          {formerror.Remark}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="save-div-btn">
                    <button
                      // disabled={
                      //   name && Remark && donationtype && selected
                      //     ? false
                      //     : true
                      // }
                      className="save-btn"
                      onClick={handlesubmit}
                    >
                      Process to pay
                    </button>
                  </div>
                </div>
              </>
            )}
            {mode === "Cheque" && (
              <>
                <div>
                  <div className="main-input-div">
                    <div
                      className={
                        formerror.chequeno
                          ? "inner-input-div-input-red"
                          : "inner-input-div"
                      }
                    >
                      <label>Cheque No</label>
                      <input
                        type="text"
                        name="chequeno"
                        placeholder="Cheque No "
                        value={donationdata.chequeno}
                        onChange={onChange}
                      />
                      <p style={{ color: "red", marginTop: "5px" }}>
                        {formerror.chequeno}
                      </p>
                    </div>
                    <div
                      className={
                        formerror.date_of_sub
                          ? "inner-input-div-input-red"
                          : "inner-input-div"
                      }
                    >
                      <label>Date</label>
                      <input
                        type="date"
                        name="date_of_sub"
                        placeholder="DOB"
                        value={donationdata.date_of_sub}
                        onChange={onChange}
                      />
                      <p style={{ color: "red", marginTop: "5px" }}>
                        {formerror.date_of_sub}
                      </p>
                    </div>
                  </div>
                  <div className="main-input-div">
                    <div
                      className={
                        formerror.amount
                          ? "inner-input-div-input-red"
                          : "inner-input-div"
                      }
                    >
                      <label>Amout</label>
                      <input
                        type="text"
                        value={amount}
                        placeholder="Amount"
                        onChange={(e) => setamount(e.target.value)}
                      />
                      <p style={{ color: "red", marginTop: "5px" }}>
                        {formerror.amount}
                      </p>
                      <div
                        className="donation-money-div-main"
                        style={{ marginTop: "10px" }}
                      >
                        <div className="btn-recharge-div">
                          <button onClick={() => setamount("1111")}>
                            ₹1111
                          </button>
                          <button onClick={() => setamount("2121")}>
                            ₹2121
                          </button>
                          <button onClick={() => setamount("5151")}>
                            ₹5151
                          </button>
                        </div>
                        <div className="btn-recharge-div">
                          <button onClick={() => setamount("11111")}>
                            ₹11,111
                          </button>
                          <button onClick={() => setamount("21211")}>
                            ₹21,211
                          </button>
                          <button onClick={() => setamount("51511")}>
                            ₹51,511
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        formerror.name_of_bank
                          ? "inner-input-div-input-red"
                          : "inner-input-div"
                      }
                    >
                      <label> Bank Name</label>
                      <input
                        type="text"
                        name="name_of_bank"
                        placeholder="Bank Name"
                        value={donationdata.name_of_bank}
                        onChange={onChange}
                      />
                      <p style={{ color: "red", marginTop: "5px" }}>
                        {formerror.name_of_bank}
                      </p>
                      <div
                        className={
                          formerror.Remark
                            ? "inner-input-div-input-red"
                            : "inner-input-div"
                        }
                      >
                        <label>Remark</label>
                        <input
                          type="text"
                          name="Remark"
                          placeholder="Remark"
                          value={donationdata.Remark}
                          onChange={onChange}
                        />
                        <p style={{ color: "red", marginTop: "5px" }}>
                          {formerror.Remark}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="main-input-div remark-divvv"
                    style={{ marginTop: "-25px" }}
                  ></div>

                  <div className="save-div-btn">
                    <button
                      type="button"
                      onClick={handlesubmit}
                      className="save-btn"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Donation;
