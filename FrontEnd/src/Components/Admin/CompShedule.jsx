import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import {CircularProgress} from '@material-ui/core'
import Title from "./Title";
import Popup from "./PopupInput";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },

  rejectBtn: {
    fontSize: "10px",
  },
  rejectBtn2: {
    fontSize: "10px",
    top: "20px",
    left: "190px",
  },
  viewBtn: {
    fontSize: "10px",
  },
  approveBtn: {
    background: "#228B22",
    "&:hover": {
      background: "#006400",
    },
    color: "white",
    fontSize: "10px",
  },
}));

export default function CompShedule() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [response, setResponse] = useState({});
  const [search, setSearch] = useState("");
  const messageRef = useRef('')
  console.log(response);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/conferences/60d76048aa132a4cf07b74dd")
      .then((res) => {
        setResponse(res.data);
        setIsLoading(false);
      })

      .catch((err) => console.log(err));
  }, []);

  function approveSchdule(Shedule) {
    console.log(Shedule);
    if (confirm("Are you sure?")) {
      axios
        .patch(
          "http://localhost:5000/api/conferences/approve-schedule/60d76048aa132a4cf07b74dd",
          Shedule
        )
        .then((res) => {
          if (res.status == 200) {
            alert("Succeeded");
          } else {
            alert("Error Updating!");
          }
        })
        .then(() => {
          window.location.reload(false);
        });
    }
  }

  const history = useHistory();

  const routeChange = (schedule) => {
    let path = `/admin/view-schedules/${schedule._id}`;
    history.push(path);
  };

  const sendMessage = (row) => {
    let msgTitle = ''
    row.paper ? msgTitle = row.paper.title : msgTitle = row.workshop.title
    console.log(messageRef.current.value);
    const message = `Title: ${msgTitle}: ${messageRef.current.value}`;
    const notification = {
      userId: '60d9a9a6528bc923cc12ee3b',
      message
    }

    axios.post('http://localhost:5000/api/notifications/send-notification', notification)
    .then(res => {
      if(res.status == 201){
        alert("Message sent");
      }
      togglePopup();
    })
  }

  return (
    <React.Fragment>
      <Table>
        <TableBody>
          <TableCell>
            <Title>Pending Schedules</Title>
          </TableCell>
          <TableCell>
            <input
              type="text"
              placeholder="Search Time..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </TableCell>
          <TableCell>
            <div className={classes.seeMore}>
              <Link to="/admin/all-pendings" color="primary">
                See All Pendings
              </Link>
            </div>
          </TableCell>
        </TableBody>
      </Table>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        {!isLoading ? response.conference === undefined ? null : (
          <TableBody>
            {[
              ...response.conference.sortedWorkshopSchedule.workshops.filter(
                (data) => data.isApproved == false
              ),
              ...response.conference.sortedPaperSchedule.researchPapers.filter(
                (data) => data.isApproved == false
              ),
            ]
              .filter((row) => {
                if (search == "") {
                  return row;
                } else if (
                  row.startTime.toLowerCase().includes(search.toLowerCase())
                ) {
                  return row;
                } else if (
                  row.endTime.toLowerCase().includes(search.toLowerCase())
                ) {
                  return row;
                }
              })
              .map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell>{row.endTime}</TableCell>
                  {row.paper ? (
                    <TableCell>
                      {row.paper !== undefined
                        ? row.paper.title
                        : row.workshop.title}
                      - Paper
                    </TableCell>
                  ) : (
                    <TableCell>
                      {row.paper !== undefined
                        ? row.paper.title
                        : row.workshop.title}
                      - Workshop
                    </TableCell>
                  )}

                  {row.isApproved === false ? (
                    <TableCell>Not Approved</TableCell>
                  ) : (
                    <TableCell>Approved</TableCell>
                  )}
                  <TableCell align="right">
                    <Button
                      className={classes.rejectBtn}
                      onClick={togglePopup}
                      variant="contained"
                      size="small"
                      color="secondary"
                    >
                      Reject
                    </Button>
                  </TableCell>
                  {isOpen && (
                    <Popup
                      content={
                        <>
                          <form>
                            <TextField
                              id="filled-multiline-static"
                              label="Reason"
                              inputRef={messageRef}
                              multiline
                              rows={5}
                              variant="filled"
                            />
                            <Button
                              className={classes.rejectBtn2}
                              onClick={e => {sendMessage(row)}}
                              variant="contained"
                              size="medium"
                              color="secondary"
                            >
                              Reject
                            </Button>
                          </form>
                        </>
                      }
                      handleClose={togglePopup}
                    />
                  )}
                  <TableCell align="right">
                    <Button
                      className={classes.viewBtn}
                      onClick={(e) => routeChange(row)}
                      variant="contained"
                      size="small"
                      color="primary"
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={(e) => approveSchdule(row)}
                      className={classes.approveBtn}
                      variant="contained"
                      size="small"
                    >
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        ) : (<TableBody>
            <TableRow>
              <TableCell colSpan={8} align="center"><CircularProgress/></TableCell>
            </TableRow>
          </TableBody>)}
      </Table>
    </React.Fragment>
  );
}
