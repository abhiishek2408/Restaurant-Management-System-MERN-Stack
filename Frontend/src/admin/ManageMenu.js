import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";

const MenuManagement = () => {
  const [menuSections, setMenuSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchMenuSections = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost/onlinerestro/backend/ManageMenu.php?page=${page}`
      );
      const data = await response.json();

      if (data.success) {
        setMenuSections(data.data);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message || "Failed to fetch menu sections");
      }
    } catch (err) {
      setError(`Error fetching data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuSections(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/onlinerestro/backend/DeleteMenuItem.php?id=${id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (result.success) {
        alert("Item deleted successfully");
        fetchMenuSections(currentPage);
      } else {
        alert(result.message || "Failed to delete item");
      }
    } catch (err) {
      alert("Error deleting item: " + err.message);
    }
  };

  const handleEditClick = (item) => {
    setEditData({ ...item, newImage: null }); // Store file separately
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setEditData({ ...editData, newImage: files[0] });
    } else {
      setEditData({
        ...editData,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Id", editData.Id);
    formData.append("name", editData.name);
    formData.append("price", editData.price || 0);
    formData.append("discount_price", editData.discount_price || 0);
    formData.append("rating", editData.rating || 0);
    formData.append("isOffer", editData.isOffer ? 1 : 0);
    formData.append("is_active", editData.is_active ? 1 : 0);
    formData.append("is_featured", editData.is_featured ? 1 : 0);
    formData.append("is_new", editData.is_new ? 1 : 0);
    formData.append("display_order", editData.display_order || 0);
    formData.append("total_orders", editData.total_orders || 0);

    if (editData.newImage) {
      formData.append("product_image", editData.newImage);
    }

    try {
      const response = await fetch(
        `http://localhost/onlinerestro/backend/UpdateMenuItem.php`,
        {
          method: "POST",
          body: formData, // Browser sets correct Content-Type
        }
      );

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

  if (loading)
    return <div className="max-w-5xl mx-auto p-6">Loading...</div>;
  if (error)
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-600">{error}</div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-center text-pink-600 text-2xl font-bold mb-5">
        Menu Management
      </h2>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-pink-50 text-pink-600 uppercase text-xs">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Discount</th>
            <th className="p-2 text-left">Rating</th>
            <th className="p-2 text-left">Image</th>
            <th className="p-2 text-left">Offer</th>
            <th className="p-2 text-left">Active</th>
            <th className="p-2 text-left">Featured</th>
            <th className="p-2 text-left">Orders</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuSections.map((item) => (
            <tr key={item.Id} className="border-b hover:bg-gray-50">
              <td className="p-2">{item.Id}</td>
              <td className="p-2">{item.name}</td>
              <td className="p-2">₹{item.price}</td>
              <td className="p-2">
                {item.discount_price ? `₹${item.discount_price}` : "-"}
              </td>
              <td className="p-2">{item.rating || "-"}</td>
              <td className="p-2">
                {item.product_image ? (
                  <img
                    src={`data:image/jpeg;base64,${item.product_image}`}
                    alt="Product"
                    className="w-12 h-12 object-cover rounded-md"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="p-2">{item.isOffer ? "Yes" : "No"}</td>
              <td className="p-2">{item.is_active ? "Yes" : "No"}</td>
              <td className="p-2">{item.is_featured ? "Yes" : "No"}</td>
              <td className="p-2">{item.total_orders || 0}</td>
              <td className="p-2 flex items-center space-x-2">
                <button
                  onClick={() => handleDelete(item.Id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => handleEditClick(item)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="text-center mt-5 flex justify-center items-center gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-pink-300 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-pink-300 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {showModal && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-pink-600 mb-4">
              Update Menu Item
            </h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col flex-1">
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleEditChange}
                    required
                    className="border rounded p-2"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label>Discount Price:</label>
                  <input
                    type="number"
                    name="discount_price"
                    value={editData.discount_price || ""}
                    onChange={handleEditChange}
                    className="border rounded p-2"
                  />
                </div>
              </div>

              <div>
                <label>Rating:</label>
                <input
                  type="number"
                  step="0.1"
                  name="rating"
                  value={editData.rating || ""}
                  onChange={handleEditChange}
                  className="border rounded p-2 w-full"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  name="product_image"
                  onChange={handleEditChange}
                  className="border rounded p-2 w-full"
                />
                {editData.product_image && !editData.newImage && (
                  <img
                    src={`data:image/jpeg;base64,${editData.product_image}`}
                    alt="Current"
                    className="w-16 h-16 object-cover mt-2 rounded"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isOffer"
                    checked={!!editData.isOffer}
                    onChange={handleEditChange}
                  />
                  Offer
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={!!editData.is_active}
                    onChange={handleEditChange}
                  />
                  Active
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={!!editData.is_featured}
                    onChange={handleEditChange}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_new"
                    checked={!!editData.is_new}
                    onChange={handleEditChange}
                  />
                  New
                </label>
              </div>

              <div>
                <label>Display Order:</label>
                <input
                  type="number"
                  name="display_order"
                  value={editData.display_order || ""}
                  onChange={handleEditChange}
                  className="border rounded p-2 w-full"
                />
              </div>

              <div>
                <label>Total Orders:</label>
                <input
                  type="number"
                  name="total_orders"
                  value={editData.total_orders || ""}
                  onChange={handleEditChange}
                  className="border rounded p-2 w-full"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-pink-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
