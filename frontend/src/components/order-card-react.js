import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignDriver from './assign-driver';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const CardDisplay = ({ data }) => {
    // {console.log(data)}
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                title={`Order Id:${data.OrderId}`}
                subheader={`date:${data.OrderPlacedDate}`}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    <div>Sender Name: {data.SenderName}</div>
                    <div>Receiver Name: {data.ReceiverName}</div>
                    <div>Service Type: {data.ServiceType}</div>
                    <div>Destination Address: {data.DestinationAddress}</div>
                    {/* {data.senderName} */}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <AssignDriver data={data}></AssignDriver>
            </Collapse>
        </Card>
    );
}

const OrderCard = () => {

    const [orders, setOrders] = React.useState({})
    const url = "http://localhost:5000/"

    const fetchAllOrders =async () => {
        const allOrders = await axios.get(`${url}/getAllOrders`);
        {console.log(allOrders)}
        if (allOrders.status === 200) {
            setOrders(allOrders.data);
        } else {
            toast.error(allOrders.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    }

    React.useEffect(()=>{
        fetchAllOrders();
    },[])

    return (
        <div>
            <ToastContainer/>
            {Object.keys(orders).map((key,value)=>{
                return (
                    <CardDisplay data={orders[key]} key={value}></CardDisplay>
                )
            })}
        </div>
    )
}

export default OrderCard;