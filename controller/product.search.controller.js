import Products from "../model/products.models.js"; // Adjust path as needed

export const searchProducts = async (req, res) => {
  try {
    const { query, minPrice, maxPrice, deal, gender, discount, size, sort = "createdAt", order = "desc" } = req.query;

    if (!query && !minPrice && !maxPrice && !deal && !gender && !discount && !size) {
      return res.status(400).json({ message: "At least one search filter is required" });
    }

    // Define search conditions
    let searchConditions = {};

    // ✅ Search by query (name, category, description)
    if (query) {
      searchConditions.$or = [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    // ✅ Filter by Gender
    if (gender) {
      searchConditions.gender = new RegExp(`^${gender}$`, "i"); // Case-insensitive exact match
    }

    // ✅ Filter by price range
    if (minPrice || maxPrice) {
      searchConditions.price = {};
      if (minPrice) searchConditions.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchConditions.price.$lte = parseFloat(maxPrice);
    }

    // ✅ Filter by Deals
    if (deal) {
      searchConditions.deal = deal;
    }

    // ✅ Filter by Discount (Ensure it's a number)
    // if (discount) {
    //   const discountValue = parseInt(discount);
    //   if (!isNaN(discountValue)) {
    //     searchConditions.discount = { $gte: discountValue };
    //   }
    // }

    // ✅ Filter by Size (Strict Exact Match in Array)
    // if (size) {
    //   const sizeArray = size.split(",").map((s) => s.trim()); // Convert string to array
    //   searchConditions.size = { $in: [size.toUpperCase()] };
    //   // searchConditions.size = sizeArray; // Ensures exact match within array
    //   console.log(searchConditions.size);
      
    // }

    // ✅ Convert `order` to `1` (asc) or `-1` (desc)
    const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;

    // Fetch products matching conditions and sort
    const products = await Products.find(searchConditions).sort({ [sort]: sortOrder });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
