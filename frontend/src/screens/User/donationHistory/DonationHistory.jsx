import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import ChequeSuccessfull from "../donation/chequeSuccessfull/ChequeSuccessfull";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import moment from "moment";
import "./DonationHistory.css";
import { useNavigate } from "react-router-dom";
import { serverInstance } from "../../../API/ServerInstance";
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
let status;
function DonationHistory({ setopendashboard, setshowreciept }) {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [isrow, setisrow] = useState([]);
  const [page, setPage] = useState(0);
  const [open1, setOpen1] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [useindonationhistory, setuseindonationhistory] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  console.log(isrow);
  React.useEffect(() => {
    gettable();
  }, []);
  useEffect(() => {
    setshowreciept(false);
  }, []);

  const gettable = () => {
    serverInstance("user/donation-list", "get").then((res) => {
      if (res.status === 404) {
        Swal.fire("Error!", "please authenticate", "error");
        return false;
      }
      try {
        setisrow(res.donation);
      } catch (error) {
        Swal.fire("Error!", "please authenticate", "error");
      }
    });
  };

  const downloadrecept = (row) => {
    if (row.active === "0") {
      handleOpen1();
      setuseindonationhistory(true);
    } else {
      navigation("/reciept", {
        state: {
          userdata: row,
        },
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open1}
        onClose={handleClose1}
        closeAfterTransition
      >
        <Fade in={open1}>
          <Box sx={style}>
            <ChequeSuccessfull
              handleClose={handleClose1}
              useindonationhistory={useindonationhistory}
            />
          </Box>
        </Fade>
      </Modal>
      <div className="DonationHistory-main-div">
        <div>
          <div className="table-div-maain-donation-table-main">
            <div className="donation-history-text">
              <h2>DONATIONS</h2>
              <p>All Donations History</p>
            </div>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead style={{ background: "#FFEEE0" }}>
                  <TableRow>
                    <TableCell align="left">DATE</TableCell>
                    <TableCell align="left">NAME</TableCell>
                    <TableCell align="left">Donation Type</TableCell>
                    <TableCell align="left">Amount</TableCell>
                    <TableCell align="left">Cheque No.</TableCell>
                    <TableCell align="left">Date Of submission</TableCell>
                    <TableCell align="left">Name of Bank</TableCell>
                    <TableCell align="left">Payment id</TableCell>
                    <TableCell align="left">certificate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? isrow &&
                      isrow.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : isrow
                  ).map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <div style={{ display: "none" }}>
                        {(status = row.active)}
                      </div>
                      <TableCell align="left">
                        {moment(row?.DATE_OF_DAAN).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell align="left">{row.NAME}</TableCell>
                      <TableCell align="left">{row.MODE_OF_DONATION}</TableCell>
                      <TableCell align="left">{row.AMOUNT}</TableCell>
                      <TableCell align="left">
                        {row.CHEQUE_NO ? row.CHEQUE_NO : "-"}
                      </TableCell>
                      <TableCell align="left">
                        {row.DATE_OF_CHEQUE ? row.DATE_OF_CHEQUE : "-"}
                      </TableCell>
                      <TableCell align="left">
                        {row.NAME_OF_BANK ? row.NAME_OF_BANK : "-"}
                      </TableCell>
                      <TableCell align="left">
                        {row.PAYMENT_ID ? row.PAYMENT_ID : "-"}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          downloadrecept(row);
                        }}
                        align="left"
                        style={{
                          cursor: "pointer",
                          color: status === "0" ? "red" : "",
                        }}
                      >
                        downolod
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      count={isrow.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25]}
                      labelRowsPerPage={<span>Rows:</span>}
                      labelDisplayedRows={({ page }) => {
                        return `Page: ${page}`;
                      }}
                      backIconButtonProps={{
                        color: "secondary",
                      }}
                      nextIconButtonProps={{ color: "secondary" }}
                      SelectProps={{
                        inputProps: {
                          "aria-label": "page number",
                        },
                      }}
                      // showFirstButton={true}
                      // showLastButton={true}
                      //ActionsComponent={TablePaginationActions}
                      //component={Box}
                      //sx and classes prop discussed in styling section
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default DonationHistory;
