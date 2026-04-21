const Cart = require("../../model/cartModel");
const Product = require("../../model/productModel");

// 1. ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedSize, selectedColor } = req.body;
    const userId = req.user._id; // Assuming you have auth middleware

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Determine the price (use discountPrice if available)
    const price = product.discountPrice > 0 ? product.discountPrice : product.productPrice;

    // Find user's cart
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Check if this specific shoe (Product + Size + Color) already exists in cart
      const itemIndex = cart.items.findIndex((item) => 
        item.product.toString() === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );

      if (itemIndex > -1) {
        // If it exists, just update the quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // If it doesn't exist, push new item
        cart.items.push({ 
          product: productId, 
          quantity, 
          selectedSize, 
          selectedColor, 
          price 
        });
      }
      cart = await cart.save();
    } else {
      // If no cart exists for user, create a new one
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity, selectedSize, selectedColor, price }]
      });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. GET USER CART
// 2. GET USER CART
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      select: "productName productImages brand category"
    });

    // If the cart document exists but has no items, or doesn't exist at all
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ 
        success: true, 
        cart: { items: [], totalPrice: 0 } 
      });
    }

    // SUCCESS: Send the data exactly as the DB shows it
    res.status(200).json({ 
      success: true, 
      cart 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. REMOVE ITEM FROM CART
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params; // This is the _id of the item inside the items array
    
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Filter out the item
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    
    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. UPDATE QUANTITY (Increase/Decrease)
exports.updateQuantity = async (req, res) => {
  try {
    const { itemId, quantity } = req.body; // quantity here should be the NEW total quantity

    if (quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

    const cart = await Cart.findOne({ user: req.user._id });
    const item = cart.items.id(itemId); // Mongoose helper to find sub-document by ID

    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};