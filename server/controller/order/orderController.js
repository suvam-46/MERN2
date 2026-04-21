const Order = require("../../model/orderModel.js");
const Cart = require("../../model/cartModel.js");
const axios = require("axios");

// Environment Constants - Use 'dev' for Sandbox/Test keys
const KHALTI_INITIATE_URL = "https://dev.khalti.com/api/v2/epayment/initiate/";
const KHALTI_LOOKUP_URL = "https://dev.khalti.com/api/v2/epayment/lookup/";

exports.createOrder = async (req, res) => {
  try {
    const { 
      shippingAddress, 
      paymentMethod, 
      itemsPrice, 
      shippingPrice, 
      totalPrice,
      orderItems 
    } = req.body;

    // Basic Validation
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No order items found" });
    }

    // Build the Order Object
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map(item => ({
        product: item.product,
        productName: item.productName,
        quantity: Number(item.quantity),
        selectedSize: String(item.selectedSize),
        selectedColor: item.selectedColor,
        price: Number(item.price),
        image: item.image
      })),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        address: shippingAddress.address,
        city: shippingAddress.city,
        phoneNo: shippingAddress.phoneNo,
        postalCode: shippingAddress.postalCode || ""
      },
      paymentInfo: {
        method: paymentMethod,
        status: "Pending"
      },
      itemsPrice: Number(itemsPrice),
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice),
      orderStatus: "Processing"
    });

    const savedOrder = await order.save();

    // --- KHALTI LOGIC ---
    if (paymentMethod === "Khalti") {
      try {
        const khaltiPayload = {
          return_url: "http://localhost:5173/payment-success",
          website_url: "http://localhost:5173",
          amount: Math.round(totalPrice * 100), // Convert to Paisa (Integer)
          purchase_order_id: savedOrder._id,
          purchase_order_name: `FootWear Order #${savedOrder._id}`,
          customer_info: {
            name: shippingAddress.fullName,
            phone: shippingAddress.phoneNo // Must be 10 digits
          }
        };

        const khaltiResponse = await axios.post(
          KHALTI_INITIATE_URL,
          khaltiPayload,
          {
            headers: {
              Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
              "Content-Type": "application/json"
            }
          }
        );

        // Update order with pidx (payment identifier)
        savedOrder.paymentInfo.pidx = khaltiResponse.data.pidx;
        await savedOrder.save();

        return res.status(201).json({
          success: true,
          payment_url: khaltiResponse.data.payment_url,
          orderId: savedOrder._id
        });

      } catch (khaltiError) {
        // Detailed logging for debugging 400 errors
        console.error("--- KHALTI INITIATION ERROR ---");
        console.dir(khaltiError.response?.data || khaltiError.message);
        
        return res.status(400).json({ 
          success: false, 
          message: "Failed to connect with Khalti payment gateway",
          error: khaltiError.response?.data
        });
      }
    }

    // --- COD LOGIC ---
    if (paymentMethod === "COD") {
      await Cart.findOneAndDelete({ user: req.user._id });
      return res.status(201).json({ 
        success: true, 
        message: "Order placed successfully (COD)", 
        order: savedOrder 
      });
    }

    res.status(400).json({ success: false, message: "Invalid payment method" });

  } catch (error) {
    console.error("Order Creation Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during order creation" });
  }
};

// --- 2. VERIFY KHALTI PAYMENT ---
exports.verifyPayment = async (req, res) => {
  try {
    const { pidx } = req.body;
    console.log("Verifying payment for pidx:", pidx); // Debug Log

    if (!pidx) {
      return res.status(400).json({ success: false, message: "pidx is required" });
    }

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/", // Double check this is 'dev'
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY.trim()}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Khalti Lookup Response:", response.data.status); // Debug Log

    if (response.data.status === "Completed") {
      // Find the order that has this pidx
      const order = await Order.findOne({ "paymentInfo.pidx": pidx });
      
      if (!order) {
        console.log("Order not found for pidx:", pidx);
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Update fields
      order.paymentInfo.status = "Paid";
      order.paymentInfo.transactionId = response.data.transaction_id;
      order.pointsEarned = Math.floor(order.totalPrice / 100); 
      
      await order.save();
      console.log("Order marked as PAID in database");

      // Clear the Cart
      await Cart.findOneAndDelete({ user: order.user });

      return res.status(200).json({ success: true, message: "Payment Successful" });
    }

    res.status(400).json({ 
      success: false, 
      message: `Khalti status: ${response.data.status}` 
    });

  } catch (error) {
    console.error("Verification Error Detail:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Internal Verification Error" });
  }
};

// --- 3. GET SINGLE ORDER ---
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details" });
  }
};

// --- 4. GET LOGGED-IN USER ORDERS ---
exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching your history" });
  }
};

// --- 5. ADMIN: GET ALL ORDERS ---
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name").sort({ createdAt: -1 });
    let totalAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    res.status(200).json({ success: true, totalAmount, orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
};