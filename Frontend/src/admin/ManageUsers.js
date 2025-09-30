import React, { useState, useEffect } from "react";

export default function MenuManagement() {
  const [menuSections, setMenuSections] = useState([]);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMenuSections(currentPage);
  }, [currentPage]);

  const fetchMenuSections = async (page) => {
    try {
      const response = await fetch(`http://localhost/onlinerestro/backend/GetMenu.php?page=${page}`);
      const data = await response.json();
      setMenuSections(data.items || []);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const handleEditClick = (item) => {
    setEditData(item); // pre-fill modal
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setEditData((prev) => ({
          ...prev,
          product_image: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const originalItem = menuSections.find(m => m.Id === editData.Id);
    const mergedData = { ...originalItem, ...editData };

    const payload = {
      ...mergedData,
      isOffer: mergedData.isOffer ? 1 : 0,
      is_active: mergedData.is_active ? 1 : 0,
      is_featured: mergedData.is_featured ? 1 : 0,
      is_new: mergedData.is_new ? 1 : 0,
      price: parseFloat(mergedData.price) || 0,
      discount_price: parseFloat(mergedData.discount_price) || 0,
      rating: parseFloat(mergedData.rating) || 0,
      display_order: parseInt(mergedData.display_order) || 0,
      total_orders: parseInt(mergedData.total_orders) || 0,
    };

    try {
      const response = await fetch(`http://localhost/onlinerestro/backend/UpdateMenuItem.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        alert("Item updated successfully");
        setShowModal(false);
        fetchMenuSections(currentPage);
      } else {
        alert(result.message || "Update failed");
      }
    } catch (error) {
      alert("Error updating item: " + error.message);
    }
  };

  return (
    <div>
      <h1>Menu Management</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Price</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuSections.map(item => (
            <tr key={item.Id}>
              <td>{item.product_name}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => handleEditClick(item)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <form onSubmit={handleUpdateSubmit}>
            <label>Product Name:</label>
            <input
              type="text"
              value={editData.product_name || ""}
              onChange={(e) => setEditData({ ...editData, product_name: e.target.value })}
            />

            <label>Price:</label>
            <input
              type="number"
              value={editData.price || ""}
              onChange={(e) => setEditData({ ...editData, price: e.target.value })}
            />

            <label>Product Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {editData.product_image && (
              <img
                src={`data:image/jpeg;base64,${editData.product_image}`}
                alt="Preview"
                style={{ width: "80px", height: "80px", marginTop: "5px" }}
              />
            )}

            <button type="submit">Update</button>
            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}
