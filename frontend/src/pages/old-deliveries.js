import axios from "axios";
import { useEffect, useState } from "react";

const OldDeliveries = () => {
  const url = "https://azure-nile-backend.azurewebsites.net";
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    const response = await axios.get(`${url}/getDeliveredOrders`);
    if (response.status === 200) {
      setOrders(response.data);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      {Object.keys(orders).map((key, value) => {
        return (
          <div key={value} className="order-container">
            <div>Order Id: {orders[key].OrderId}</div>
            <div>Sender Name: {orders[key].SenderName}</div>
            <div>Receiver Name: {orders[key].ReceiverName}</div>
            <div>Service Type: {orders[key].ServiceType}</div>
            <div>Order Placed Date: {orders[key].OrderPlacedDate}</div>
            <div>Destination Address: {orders[key].DestinationAddress}</div>
            <div>Delivery Status: {orders[key].Status}</div>
          </div>
        );
      })}
    </div>
  );
};

export default OldDeliveries;
