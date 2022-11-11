import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchBar = ({ setSearchQuery }) => (
  <form>
    <TextField
      id="search-bar"
      className="text"
      onInput={(e) => {
        setSearchQuery(e.target.value);
      }}
      label="Type to search employee"
      variant="outlined"
      placeholder="Search..."
      size="small"
    />
    <IconButton type="submit" aria-label="search">
      <SearchIcon style={{ fill: "blue" }} />
    </IconButton>
  </form>
);

const filterData = (query, data) => {
  if (!query) {
    return data;
  } else {
    console.log(data.filter((d) => d.FullName.toLowerCase().includes(query)));
    return data.filter((d) => d.FullName.toLowerCase().includes(query));
  }
};

const SearchEmployees = () => {
  const [employeeData, setEmployeeData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const dataFiltered = filterData(searchQuery, employeeData);

  const url = "https://azure-nile-backend.azurewebsites.net/";

  const fetchData = async () => {
    const response = await axios.get(`${url}/searchEmployees`);
    if (response.status === 200) {
      setEmployeeData(response.data);
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 20,
      }}
    >
      <ToastContainer />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div style={{ padding: 3, alignItems: "center" }}>
        {console.log(dataFiltered)}
        {Object.keys(dataFiltered).map((key, value) => {
          return (
            <div>
              <b>{dataFiltered[key].FullName}</b>
              <p>{dataFiltered[key].Role}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchEmployees;
