import Products from "../model/products.models.js"; // Adjust the path based on your project structure

// Search Products by name, category, description, or price range
export const searchProducts = async (req, res) => {
  try {
    const { query, minPrice, maxPrice, deal, gender, discount } = req.query; // Get search parameters from request

    if (!query && !minPrice && !maxPrice && !deal && !gender && !discount) {
        return res.status(400).json({ message: "At least one search filter is required" });
    }

    // Define search conditions
    let searchConditions = {};

    if (query) {
      searchConditions.$or = [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      searchConditions.price = {};
      if (minPrice) searchConditions.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchConditions.price.$lte = parseFloat(maxPrice);
    }

    // Filter by Deals (Assuming "deals" is a boolean field)
    if (deal === "good" || deal === "great") {
        searchConditions.deal = deal;
    }

    if (gender) {
        searchConditions.gender = { $in: [gender, gender.toLowerCase(), gender.toUpperCase()] };
    }

    if (discount) {
        searchConditions.discount = { $gte: parseInt(discount) };
    }

    // Fetch products matching conditions
    const products = await Products.find(searchConditions);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
