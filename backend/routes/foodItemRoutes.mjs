import express from "express";
import MenuItem from "../models/MenuItem.mjs"; // adjust path if needed

const router = express.Router();

// =====================
// GET ALL FOOD ITEMS BY CITY
// =====================
router.get("/all", async (req, res) => {
  try {
    const { city, zipcode, locationName } = req.query;

    let query = {};

    if (city || zipcode || locationName) {
      // Build query when filters are provided
      query["locations.is_available"] = true;
      query.is_featured = true; // ✅ Only featured items
      query.is_active = true; // ✅ Only active items
      query.isArchive = false; // ✅ Exclude archived items

      if (city && city.trim()) {
        // Use case-insensitive and trimmed matching for city
        query["locations.city"] = { $regex: `^${city.trim()}$`, $options: "i" };
      }
      if (zipcode && !isNaN(zipcode))
        query["locations.zipcode"] = Number(zipcode);
      if (locationName && locationName.trim())
        query["locations.locationName"] = locationName.trim();
    } else {
      // ✅ No filters → fetch all active & non-archived items
      query = {
        is_active: true,
        isArchive: false,
        is_featured: true,
      };
    }

    // Fetch items
    const foodItems = await MenuItem.find(query).lean();

    // If filters are provided, map location-specific data
    let result = foodItems;
    if (city || zipcode || locationName) {
      result = foodItems.map((item) => {
        const locationInfo = item.locations.find((loc) => {
          return (
            (!city || loc.city === city.trim()) &&
            (!zipcode || loc.zipcode === Number(zipcode)) &&
            (!locationName || loc.locationName === locationName.trim())
          );
        });

        return {
          ...item,
          price: locationInfo?.price ?? item.price,
          discount_price: locationInfo?.discount_price ?? item.discount_price,
          total_orders: locationInfo?.total_orders ?? item.total_orders,
          is_available: locationInfo?.is_available ?? true,
        };
      });
    }

    return res.json(result);
  } catch (err) {
    console.error("Error fetching food items:", err);
    return res.status(500).json({ error: true, message: "Server error" });
  }
});

router.get("/chef_special", async (req, res) => {
  try {
    const { city, zipcode, locationName } = req.query;

    let query = {};

    if (city || zipcode || locationName) {
      // Filters provided → location + is_available + is_featured
      query["locations.is_available"] = true;
      query["is_featured"] = true; // ✅ featured only
      if (city && city.trim()) query["locations.city"] = city.trim();
      if (zipcode && !isNaN(zipcode))
        query["locations.zipcode"] = Number(zipcode);
      if (locationName && locationName.trim())
        query["locations.locationName"] = locationName.trim();
    } else {
      // No filters → all active, non-archived, featured items
      query = {
        is_active: true,
        isArchive: false,
      };
    }

    // Fetch items
    const foodItems = await MenuItem.find(query).lean();

    // If filters are provided, map location-specific data
    let result = foodItems;
    if (city || zipcode || locationName) {
      result = foodItems.map((item) => {
        const locationInfo = item.locations.find((loc) => {
          return (
            (!city || loc.city === city.trim()) &&
            (!zipcode || loc.zipcode === Number(zipcode)) &&
            (!locationName || loc.locationName === locationName.trim())
          );
        });

        return {
          ...item,
          price: locationInfo?.price ?? item.price,
          discount_price: locationInfo?.discount_price ?? item.discount_price,
          total_orders: locationInfo?.total_orders ?? item.total_orders,
          is_available: locationInfo?.is_available ?? true,
        };
      });
    }

    return res.json(result);
  } catch (err) {
    console.error("Error fetching chef special items:", err);
    return res.status(500).json({ error: true, message: "Server error" });
  }
});

// router.get("/category", async (req, res) => {
//   try {
//     const { category } = req.query;

//     let query = {};

//     if (category && category.trim()) {
//       // Category provided → fetch items where foodType matches
//       query["foodType"] = category.trim();
//     } else {
//       // No category → fetch all featured items
//       query["is_featured"] = true;
//     }

//     // Fetch items
//     const foodItems = await MenuItem.find(query).lean();

//     return res.json(foodItems);
//   } catch (err) {
//     console.error("Error fetching category items:", err);
//     return res.status(500).json({ error: true, message: "Server error" });
//   }
// });

router.get("/category", async (req, res) => {
  try {
    const { category, city, zipcode, locationName } = req.query;

    let query = {};

    // ----------------------
    // 1️⃣ Category filter
    // ----------------------
    if (category && category.trim()) {
      const cleanedCategory = category.trim().replace(/\s+/g, " ");
      query["foodType"] = { $regex: `^${cleanedCategory}$`, $options: "i" }; // case-insensitive exact match
    } else {
      // No category → fetch all featured items
      query["is_featured"] = true;
    }

    // ----------------------
    // 2️⃣ Location filters
    // ----------------------
    if (city || zipcode || locationName) {
      query["locations.is_available"] = true;
      if (city && city.trim()) query["locations.city"] = city.trim();
      if (zipcode && !isNaN(zipcode))
        query["locations.zipcode"] = Number(zipcode);
      if (locationName && locationName.trim())
        query["locations.locationName"] = locationName.trim();
    }

    // ----------------------
    // 3️⃣ Fetch items
    // ----------------------
    const foodItems = await MenuItem.find(query).lean();

    // ----------------------
    // 4️⃣ Map location-specific data if filters provided
    // ----------------------
    let result = foodItems;
    if (city || zipcode || locationName) {
      result = foodItems.map((item) => {
        const locationInfo = item.locations.find((loc) => {
          return (
            (!city || loc.city === city.trim()) &&
            (!zipcode || loc.zipcode === Number(zipcode)) &&
            (!locationName || loc.locationName === locationName.trim())
          );
        });

        return {
          ...item,
          price: locationInfo?.price ?? item.price,
          discount_price: locationInfo?.discount_price ?? item.discount_price,
          total_orders: locationInfo?.total_orders ?? item.total_orders,
          is_available: locationInfo?.is_available ?? true,
        };
      });
    }

    return res.json(result);
  } catch (err) {
    console.error("Error fetching category items:", err);
    return res.status(500).json({ error: true, message: "Server error" });
  }
});

export default router;
