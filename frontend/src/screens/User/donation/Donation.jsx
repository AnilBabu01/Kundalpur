import React, { useEffect, useState } from "react";
import { serverInstance } from "../../../API/ServerInstance";
import badebaba from "../../../assets/badebaba.jpg";
import { displayRazorpay } from "../../../RazorPay/RazorPay";
import PaymentSuccessfull from "./PaymentSuccessfull/PaymentSuccessfull";
import ChequeSuccessfull from "./chequeSuccessfull/ChequeSuccessfull";
import { TypesOfDonation } from "./TypesOfDonation";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Swal from "sweetalert2";
import "./Donation.css";
import { useJwt } from "react-jwt";
import { useAuth } from "../../../Context/AuthContext";
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
  const [fordonatoin, setfordonatoin] = useState("");
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
  const auth = useAuth();
  const { user } = useSelector((state) => state.userReducer);
  console.log(user);
  console.log(user.name);
  if (donationdata.selected === "yes1" && !user.name) {
    nagivate("/profile");
  }
  const onChange = (e) => {
    setDonationdata({ ...donationdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
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
            MODE_OF_DONATION: 1,
            AMOUNT: amount,
            CHEQUE_NO: donationdata?.chequeno,
            DATE_OF_CHEQUE: donationdata?.date_of_sub,
            NAME_OF_BANK: donationdata?.name_of_bank,
            DATE_OF_DAAN: new Date(),
            PAYMENT_ID: data.razorpay_order_id,
            TYPE: donationdata?.donationtype,
            REMARK: donationdata?.Remark,
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

    if (
      mode === "Cheque" &&
      donationdata.name &&
      donationdata.chequeno &&
      amount &&
      donationdata.date_of_sub &&
      donationdata.donationtype &&
      donationdata.name_of_bank
    ) {
      axios.defaults.headers.post[
        "Authorization"
      ] = `Bearer ${sessionStorage.getItem("token")}`;

      const res = await axios.post(
        `http://localhost:4543/api/user/add-donation`,
        {
          NAME: donationdata.name,
          MODE_OF_DONATION: 2,
          AMOUNT: amount,
          CHEQUE_NO: donationdata?.chequeno,
          DATE_OF_CHEQUE: donationdata?.date_of_sub,
          NAME_OF_BANK: donationdata?.name_of_bank,
          DATE_OF_DAAN: new Date(),
          PAYMENT_ID: "",
          TYPE: donationdata?.donationtype,
          REMARK: donationdata?.Remark,
        }
      );
      console.log(donationdata);

      if (res.data.status === true) {
        handleOpen1();
      } else {
        Swal.fire("Error!", "Somthing went wrong!!", "error");
      }
    }
  };
  useEffect(() => {}, [formerror, donationdata]);
  console.log(useJwt(sessionStorage.getItem("token")));
  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Please enter name";
    }

    if (!amount) {
      errors.amount = "Please enter amount";
    }

    if (values.donationtype === "Please Select") {
      errors.donationtype = "Please selection donation type";
    }

    if (!values.selected) {
      errors.selected = "Please donation for";
    }
    if (!values.chequeno) {
      errors.chequeno = "Please enter cheque no";
    }
    if (!values.date_of_sub) {
      errors.date_of_sub = "Plase enter date submission";
    }

    if (!values.name_of_bank) {
      errors.name_of_bank = "Please enter name of bank";
    }

    return errors;
  };

  return auth.verify ? (
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
              <div
                style={{ marginRight: "5.3rem" }}
                className="inner-checkbox-div"
              >
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
                  value={
                    donationdata.selected === "yes1" && user.name
                      ? user.name
                      : donationdata.name
                  }
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
                      <div className="inner-input-div">
                        <label>Address</label>
                        <input
                          type="text"
                          name="Remark"
                          placeholder="Address"
                          // value={donationdata.Remark}
                          // onChange={onChange}
                        />
                        <label style={{ marginTop: "1rem" }}>Remark</label>
                        <input
                          type="text"
                          name="Remark"
                          placeholder="Remark"
                          value={donationdata.Remark}
                          onChange={onChange}
                        />
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
                        <label>Remark</label>
                        <input
                          type="text"
                          name="Remark"
                          placeholder="Remark"
                          value={donationdata.Remark}
                          onChange={onChange}
                        />
                      </div>
                    </div>
                    <div className="inner-input-div">
                      <label>Upload Chueqe</label>
                      <input
                        type="file"
                        name="name_of_bank"
                        placeholder="Bank Name"
                        // value={donationdata.name_of_bank}
                        // onChange={onChange}
                      />

                      <p style={{ color: "red", marginTop: "5px" }}>
                        {formerror.name_of_bank}
                      </p>
                      <div className="inner-input-div">
                        <label style={{ marginTop: "1rem" }}>Address</label>
                        <input
                          type="text"
                          name="name_of_bank"
                          placeholder="Address"
                          // value={donationdata.name_of_bank}
                          // onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="main-input-div remark-divvv"
                    style={{ marginTop: "-25px" }}
                  ></div>

                  <div className="save-div-btn">
                    <button onClick={handlesubmit} className="save-btn">
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
  ) : (
    <div>Loading ...</div>
  );
}

export default Donation;
