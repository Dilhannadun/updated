import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Title from "./Title";
import axios from "axios";

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  approveBtn: {
    background: "#228B22",
    "&:hover": {
      background: "#006400",
    },
    color: "white",
    fontSize: "10px",
    left: "50px",
  },
  selector: {
    border: "solid 2px",
    borderRadius: "10px",
    width: "90px",
    height: "30px",
  },
}));

export default function CompManageUsers() {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [isloading, setLoading] = useState(true);

  function updateRole(user) {
    // console.log(user.id);
    // console.log(user.role);
    if (confirm("Are you sure?")) {
      axios
        .patch(`http://localhost:5000/api/user/${user.id}`, { role: user.role })
        .then((res) => {
          if (res.status == 200) {
            alert("updated");
          } else {
            alert("Error Updating!");
          }
        });
    }
  }

  function setUserRows(array) {
    let tempRows = [];
    array.map((user) => {
      let row = {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      };
      tempRows.push(row);
    });
    setRows(tempRows);
  }

  const getAllUsers = async () => {
    try {
      await axios.get("http://localhost:5000/api/user/getall").then((res) => {
        let attendees = res.data.result.filter(
          (user) =>
            user.role == "Attendee" ||
            user.role == "Editor" ||
            user.role == "Reviewer"
        );
        setUserRows(attendees);
        setLoading(false);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <React.Fragment>
      <Title>Manage User Roles</Title>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Name</strong>
            </TableCell>
            <TableCell>
              <strong>Role</strong>
            </TableCell>
            <TableCell>
              <strong>Email</strong>
            </TableCell>
            <TableCell align="right">
              <TableCell>
                <strong>Change Role</strong>
              </TableCell>
            </TableCell>
          </TableRow>
        </TableHead>
        {!isloading ? (
          <TableBody>
            {rows
              .filter((row) => {
                if (search == "") {
                  return row;
                } else if (
                  row.name.toLowerCase().includes(search.toLowerCase())
                ) {
                  return row;
                } else if (
                  row.role.toLowerCase().includes(search.toLowerCase())
                ) {
                  return row;
                }
              })
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell align="justify">
                    <select
                      id="select"
                      name="select"
                      className={classes.selector}
                      onChange={(e) => {
                        row.role = e.target.value;
                      }}
                    >
                      <option value="Reviewer">Reviewer</option>
                      <option value="Editor">Editor</option>
                      <option value="Attendee">Attendee</option>
                      <option selected>Select</option>
                    </select>
                    <Button
                      onClick={(e) => updateRole(row)}
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
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </React.Fragment>
  );
}
