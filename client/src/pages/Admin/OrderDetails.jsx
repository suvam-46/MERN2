import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const getDetails = async () => {
            const { data } = await axios.get(`http://localhost:5000/api/order/single/${id}`, { withCredentials: true });
            setOrder(data.order);
        };
        getDetails();
    }, [id]);

    if (!order) return <div>Loading...</div>;

    return (
        <div className="order-details">
            <h2>Order #{order._id}</h2>
            <div className="section">
                <h3>Shipping Info</h3>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p>Phone: {order.shippingAddress.phoneNo}</p>
            </div>
            <div className="section">
                <h3>Items</h3>
                {order.orderItems.map(item => (
                    <div key={item._id} className="item-row">
                        <img src={item.image} alt={item.productName} width="50" />
                        <span>{item.productName} ({item.selectedSize}) - Rs. {item.price} x {item.quantity}</span>
                    </div>
                ))}
            </div>
            <div className="section">
                <h3>Summary</h3>
                <p>Status: <strong>{order.orderStatus}</strong></p>
                <p>Total Amount: <strong>Rs. {order.totalPrice}</strong></p>
            </div>
        </div>
    );
};

export default OrderDetails;