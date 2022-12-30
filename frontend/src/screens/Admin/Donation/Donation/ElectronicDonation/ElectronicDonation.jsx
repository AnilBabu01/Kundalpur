import React, { useEffect, useState } from "react";
import "./ElectronicDonation.css";
const CashDonation = ({ setOpen }) => {
  const [donationtype, setdonationtype] = useState("");
  const [noOfRows, setNoOfRows] = useState({ id: 1 });
  const [rowsData, setRowsData] = useState([noOfRows]);
  console.log(rowsData);
  const typesOfDonation = [
    "Please Select ",
    "बड़े बाबा मंदिर निर्माण दान (विशेष दान)",
    "कुण्डलपुर क्षेत्र विकास हेतु दान ",
    "गोलक दान जमा",
    "आहार दान ",
    "क्षेत्र भोजनालय दान",
    "त्यागीव्रती भोजनालय दान",
    "आवास सहयोग दान ",
    "औषधि दान",
    "गौशाला/ जीव दया दान ",
    "व्रत भण्डार दान",
    "पूजन द्रव्य दान ",
    "स्थाई पूजन दान",
    "गैस सिलेंडर दान",
    "बस वाहन दान",
    "कमरा सहयोग दान ",
    "रूम (कमरा) निर्माण दान",
    "क्षेत्र व्यवस्था दान",
    "कास्‍तकारी दान ",
    "फोटो साहित्य/स्टेशनरी दान ",
    "बिजली व्यवस्था दान ",
    "मंदिर/वेदी जीर्णोद्धार दान ",
    "उदासीन आश्रम दान",
    "वाचनालय दान",
    "विवाह चौक दान",
    "निर्वाचन दान जमा",
    "चातुर्मास कलश स्थापना दान",
    "त्रिकाल चौबीसी जिनबिम्ब दान ",
    "सहस्त्रकूट जिनालय दान ",
    "पंचकल्याणक महामहोत्सव दान ",
    "अग्रिम जमा",
    "अमानत जमा",
  ];
  const RemoveRow = (index) => {
    const data = rowsData.filter((i) => i.id !== index);

    setRowsData(data);
    console.log(index);
  };

  return (
    <>
      <div className="cash-donation-div">
        <div className="cash-donation-container-innser">
          <h2>Electronic Donation</h2>
          <div className="form-div">
            <p>Voucher No:</p>
            <div className="form-input-div">
              <div className="inner-input-div2">
                <label>Phone No:</label>
                <input
                  text="text"
                  className="forminput"
                  placeholder="Enter phone no"
                />
                <label>Donation Date:</label>
                <input text="text" className="forminput" />
              </div>

              <div className="inner-input-div2">
                <label>Name:</label>
                <input
                  text="text"
                  className="forminput"
                  placeholder="Full name"
                />
                <label>Donation Time:</label>
                <input text="text" className="forminput" />
              </div>
              <div className="inner-input-div3">
                <div className="inner-input-div2">
                  <label>Address:</label>
                  <input
                    text="text"
                    className="forminput"
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  New Member:
                  <input type="radio" name="selected" value="yes1" />
                  No
                  <input type="radio" name="selected" value="yes2" />
                  Yes
                </div>
              </div>
            </div>
            <div className="table_scrol_barrr">
              <table class="styled-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "start", width: "21rem" }}>
                      Type of donation
                    </th>
                    <th style={{ textAlign: "start", width: "27rem" }}>
                      Amout
                    </th>
                    <th colspan="2" style={{ textAlign: "start" }}>
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        className="inner-input-div1-select "
                        id="type"
                        name="mode"
                        value={donationtype}
                        onChange={(e) => setdonationtype(e.target.value)}
                      >
                        {typesOfDonation.map((mode) => (
                          <option key={mode} value={mode}>
                            {mode}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {" "}
                      <input
                        text="text"
                        className="forminput1"
                        placeholder=" Amout"
                      />
                    </td>
                    <td>
                      {" "}
                      <input
                        text="text"
                        className="forminput1"
                        placeholder=" Remark"
                      />
                    </td>
                    <td style={{ width: "8rem" }}></td>
                  </tr>
                  {rowsData.length > 1 &&
                    rowsData.slice(1).map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <td>
                            {" "}
                            <select
                              className="inner-input-div1-select "
                              id="type"
                              name="mode"
                              value={donationtype}
                              onChange={(e) => setdonationtype(e.target.value)}
                            >
                              {typesOfDonation.map((mode) => (
                                <option key={mode} value={mode}>
                                  {mode}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            {" "}
                            <input text="text" className="forminput1" />
                          </td>
                          <td>
                            {" "}
                            <input
                              text="text"
                              className="forminput1"
                              value={item.id}
                            />
                          </td>
                          <td
                            onClick={() => RemoveRow(item.id)}
                            style={{ width: "8rem" }}
                          >
                            Remove
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    <td>0.00</td>
                    <td colspan="2"></td>
                  </tr>
                </tfoot>
              </table>
              <button
                onClick={() => {
                  setNoOfRows({ id: noOfRows.id + 1 });
                  rowsData.push(noOfRows);
                  // setRowsData(noOfRows);
                }}
                className="add_itrm_btn"
              >
                Add Dontion Item
              </button>
            </div>
          </div>

          <div className="save-div-btn">
            <button className="save-btn1">Save</button>
            <button onClick={() => setOpen(false)} className="calcel-btn1">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CashDonation;
