import React, { useState } from "react";
import "./BarcodeScannerInvoice.css"; // Import External CSS

const BarcodeScannerInvoice = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // Store selected products
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch products based on query (ID, name, category, etc.)
  const fetchProductDetails = async () => {
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost/onlinerestro/backend/getProductOnBarcodeSearch.php?query=${query}`
      );
      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        setProducts([]);
      } else {
        setProducts(data.data);
      }
    } catch (error) {
      setError("Failed to fetch product details");
      setProducts([]);
    }

    setLoading(false);
  };

  // Add Product to Cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.Id === product.Id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.Id === product.Id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove Product from Cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.Id !== productId));
  };

  // Calculate Total Price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Print Invoice for Cart
  const printInvoice = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const invoiceWindow = window.open("", "_blank");
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f4f4f4; }
            .total { font-weight: bold; font-size: 18px; color: #28a745; }
          </style>
        </head>
        <body>
          <h2>Invoice</h2>
          <table>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
            ${cart.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.food_category}</td>
                <td>$${item.price}</td>
                <td>${item.quantity}</td>
                <td>$${item.price * item.quantity}</td>
              </tr>
            `).join("")}
            <tr>
              <td colspan="4" class="total">Total Amount:</td>
              <td class="total">$${getTotalPrice()}</td>
            </tr>
          </table>
          <br/>
          <button onclick="window.print()">Print Invoice</button>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  };

  return (
    <div className="product-container">
      <h2 className="title">Search Product</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Enter ID, Name, Category, etc."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={fetchProductDetails} className="search-btn">
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Loading State */}
      {loading && <p className="loading">Loading...</p>}

      {/* Display Products */}
      {products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.Id} className="product-card">
              {product.product_image && (
                <img
                  src={`data:image/jpeg;base64,${product.product_image}`}
                  alt={product.name}
                  className="product-image"
                />
              )}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <p className="product-price">${product.price}</p>
                  <span className={`product-badge ${product.vegan === "Yes" ? "vegan" : "non-vegan"}`}>
                    {product.vegan === "Yes" ? "Vegan" : "Non-Vegan"}
                  </span>
                </div>
                <p className="product-rating">⭐ Rating: {product.rating}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shopping Cart Table */}
      {cart.length > 0 && (
        <div className="cart-container">
          <h3 className="cart-title">Shopping Cart</h3>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.Id}>
                  <td>{item.name}</td>
                  <td>{item.food_category}</td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price * item.quantity}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.Id)} className="remove-btn">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className="cart-total">Total: ${getTotalPrice()}</h4>
          <button onClick={printInvoice} className="print-btn">Print Invoice</button>
        </div>
      )}
    </div>
  );
};

export default BarcodeScannerInvoice;
