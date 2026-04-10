const Product = require("../../model/productModel");
const { cloudinary } = require("../../middlewear/cloudinary");

// 1. Create Shoe Product
exports.createProduct = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please upload at least one image" });
        }

        const productImages = req.files.map((file) => ({
            public_id: file.filename, 
            url: file.path,          
        }));

        const { sizes, colors, productPrice, discountPercent, ...rest } = req.body;

        // --- CALCULATION LOGIC ---
        const price = parseFloat(productPrice);
        const percent = parseFloat(discountPercent) || 0;
        
        // Calculate the final price: Price - (Price * Percent / 100)
        // Using .toFixed(2) and parseFloat to ensure 2 decimal places
        const calculatedDiscountPrice = parseFloat((price - (price * (percent / 100))).toFixed(2));

        const productData = {
            ...rest,
            productPrice: price,
            discountPercent: percent,
            discountPrice: calculatedDiscountPrice, // Store the final price
            vendor: req.user.id,
            productImages,
            sizes: typeof sizes === "string" ? sizes.split(",").map(Number) : sizes,
            colors: typeof colors === "string" ? colors.split(",").map(s => s.trim()) : colors,
        };

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            message: "Shoe listed successfully!",
            product,
        });
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ message: error.message || "Error creating product" });
    }
};

// 2. Get Vendor's Shoes
exports.getVendorProducts = async (req, res) => {
    try {
        // Fetch products and sort by newest first
        const products = await Product.find({ vendor: req.user.id }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
};

// 3. Update Shoe Product
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check ownership
        if (product.vendor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Handle Image Update
        if (req.files && req.files.length > 0) {
            // Delete old images from Cloudinary
            for (const img of product.productImages) {
                await cloudinary.uploader.destroy(img.public_id);
            }

            const newImages = req.files.map((file) => ({
                public_id: file.filename,
                url: file.path,
            }));
            req.body.productImages = newImages;
        }

        // Handle array parsing for updates
        if (req.body.sizes) {
            req.body.sizes = typeof req.body.sizes === "string" 
                ? req.body.sizes.split(",").map(Number) 
                : req.body.sizes;
        }
        if (req.body.colors) {
            req.body.colors = typeof req.body.colors === "string" 
                ? req.body.colors.split(",").map(s => s.trim()) 
                : req.body.colors;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ 
            success: true, 
            message: "Product updated successfully",
            product 
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating product" });
    }
};

// 4. Delete Shoe Product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.vendor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Cleanup Cloudinary
        for (const img of product.productImages) {
            await cloudinary.uploader.destroy(img.public_id);
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Shoe and images deleted permanently",
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
};