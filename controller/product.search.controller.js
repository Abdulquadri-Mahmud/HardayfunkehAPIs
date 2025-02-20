import Products from "../model/products.models.js"; // Adjust the path based on your project structure

// Search Products by name, category, or description
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query; // Get search query from request

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Case-insensitive search using regex
    const products = await Products.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
