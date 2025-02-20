import Products from "../model/products.models.js"; // Adjust the path based on your project structure

// Search Products with filters (name, category, description, price, deal, gender, discount)
export const searchProducts = async (req, res) => {
  try {
    const { query, minPrice, maxPrice, deal, gender, discount } = req.query;

    if (!query && !minPrice && !maxPrice && !deal && !gender && !discount) {
      return res.status(400).json({ message: "At least one search filter is required" });
    }

    let filters = {};

    // Search by name, category, or description (if query exists)
    if (query) {
      filters.$or = [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    // Filter by Deal (Assuming "deal" is a boolean field)
    if (deal === "true") {
      filters.deal = true;
    }

    // Filter by Gender (Assuming gender is stored as "Men", "Women", "Unisex", etc.)
    if (gender) {
      filters.gender = { $regex: new RegExp(gender, "i") }; // Case-insensitive
    }

    // Filter by Discount (Assuming discount is a percentage field)
    if (discount) {
      filters.discount = { $gte: parseInt(discount) }; // Show products with at least this discount
    }

    // Fetch products matching the filters
    const products = await Products.find(filters);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
