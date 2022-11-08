import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "../css/driver-landing.css";

const DriverLanding = () => {
  useEffect(() => {
    window.location.reload();
    window.stop();
  }, []);

  const [assignedOrders, setAssignedOrders] = React.useState({});
  const url = "https://azure-flask-nile.azurewebsites.net/";

  const fetchAssignedOrders = async () => {
    const email = window.localStorage.getItem("email");
    const orders = await axios.get(`${url}/getAssignedOrders/${email}`);
    console.log(email);
    console.log("Orders are", orders.data);
    if (orders.status === 200) {
      setAssignedOrders(orders.data);
    } else {
      toast.error(orders.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  return (
    <div>
      <ToastContainer />
      <h1>Hello this Driver Landing Page</h1>
      {Object.keys(assignedOrders).map((key, value) => {
        return (
          <div key={value} className="order-container">
            <div>Order Id: {assignedOrders[key].OrderId}</div>
            <div>Sender Name: {assignedOrders[key].SenderName}</div>
            <div>Receiver Name: {assignedOrders[key].ReceiverName}</div>
            <div>Service Type: {assignedOrders[key].ServiceType}</div>
            <button>Pick Up</button>
            <button>Mark As Delivered</button>
          </div>
        );
      })}
    </div>
  );
};

export default DriverLanding;
