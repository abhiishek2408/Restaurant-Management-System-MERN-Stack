import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import './UpdateOffers.css';


const UpdateOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newOffer, setNewOffer] = useState({
    food_type: '',
    food_category: '',
    name: '',
    description: '',
    price: '',
    vegan: 0,
    rating: '',
    start_timing: '',
    end_timing: '',
    product_image: '',
    offers: '',
    quantity: ''
  });

// eslint-disable-next-line
  const fetchOffers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost/onlinerestro/backend/get_offers.php");
      setOffers(res.data.offers || []);
    } catch (err) {
      console.error("Error loading offers:", err);
      showTemporaryMessage("Failed to load offers", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const showTemporaryMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewOffer((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };
  
  // Handle image file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For preview or upload, you might want to use URL.createObjectURL(file) or upload to server
      setNewOffer((prev) => ({
        ...prev,
        product_image: file.name // or file if you want to upload the file object
      }));
    }
  };
// Removed duplicate fetchOffers and useEffect

  const handleAddOrUpdateOffer = async () => {
    const { name, price, product_image } = newOffer;
    if (!name || !price || !product_image) {
      showTemporaryMessage("Name, Price, and Image are required", "error");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        // Update offer
        const res = await axios.post("http://localhost/onlinerestro/backend/update_offer.php", {
          id: editingId,
          ...newOffer
        });
        if (res.data.success) {
          showTemporaryMessage("Offer updated successfully", "success");
        } else {
          showTemporaryMessage(res.data.message || "Failed to update", "error");
        }
      } else {
        // Add new offer
        const res = await axios.post("http://localhost/onlinerestro/backend/add_offer.php", newOffer);
        if (res.data.success) {
          showTemporaryMessage("Offer added successfully", "success");
        } else {
          showTemporaryMessage(res.data.message || "Failed to add", "error");
        }
      }
      setShowModal(false);
      setEditingId(null);
      setNewOffer({
        food_type: '',
        food_category: '',
        name: '',
        description: '',
        price: '',
        vegan: 0,
        rating: '',
        start_timing: '',
        end_timing: '',
        product_image: '',
        offers: '',
        quantity: ''
      });
      fetchOffers();
    } catch (err) {
      console.error(err);
      showTemporaryMessage("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNewOffer({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      setLoading(true);
      const res = await axios.post("http://localhost/onlinerestro/backend/delete_offer.php", { id });
      if (res.data.success) {
        showTemporaryMessage("Offer deleted", "success");
        fetchOffers();
      } else {
        showTemporaryMessage(res.data.message || "Delete failed", "error");
      }
    } catch (err) {
      console.error(err);
      showTemporaryMessage("Server error", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="admin-offers-dashboard">
      {message && <div className={`message-display ${messageType}`}>{message}</div>}
      <h2 style={{ color: '#d63384', marginBottom: '20px', textAlign:'center' }}>Offers</h2>
      <button
        className="flex items-center gap-2 px-4 py-2 ml-12 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out"
        onClick={() => {
          setNewOffer({
            food_type: '',
            food_category: '',
            name: '',
            description: '',
            price: '',
            vegan: 0,
            rating: '',
            start_timing: '',
            end_timing: '',
            product_image: '',
            offers: '',
            quantity: ''
          });
          setEditingId(null);
          setShowModal(true);
        }}
      >
        <PlusCircle size={20} /> Add New Offer
      </button>

      {loading ? (
        <p className="loading-text">Loading offers...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Offers</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.rating} ⭐</td>
                  <td>{item.offers}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      title="Edit Offer"
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      title="Delete Offer"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingId ? "Update Offer" : "Add New Offer"}</h3>

            <div className="input-row">
              <input type="text" name="name" placeholder="Name" value={newOffer.name} onChange={handleInputChange} />
              <textarea name="description" placeholder="Description" value={newOffer.description} onChange={handleInputChange}></textarea>
            </div>

            <div className="input-row">
              <input type="number" name="price" placeholder="Price" value={newOffer.price} onChange={handleInputChange} />
              <input type="number" step="0.1" name="rating" placeholder="Rating (e.g., 4.5)" value={newOffer.rating} onChange={handleInputChange} />
            </div>

            <div className="time-row">
              <input type="time" name="start_timing" placeholder="Start Time" value={newOffer.start_timing} onChange={handleInputChange} />
              <input type="time" name="end_timing" placeholder="End Time" value={newOffer.end_timing} onChange={handleInputChange} />
            </div>

            <div className="input-row">
              <input type="number" name="quantity" placeholder="Quantity" value={newOffer.quantity} onChange={handleInputChange} />
              <input type="text" name="offers" placeholder="Offers (e.g., 10% OFF)" value={newOffer.offers} onChange={handleInputChange} />
            </div>

            <div className="input-row">
              <input type="text" name="food_type" placeholder="Food Type (e.g., Veg)" value={newOffer.food_type} onChange={handleInputChange} />
              <input type="text" name="food_category" placeholder="Food Category (e.g., Starter)" value={newOffer.food_category} onChange={handleInputChange} />
            </div>

            <div className="input-row" style={{ alignItems: 'center' }}>
              <label style={{ marginBottom: '0', flex: '1' }}>
                <input type="checkbox" name="vegan" checked={newOffer.vegan === 1} onChange={handleInputChange} />Vegan
              </label>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ flex: '1', marginBottom: '0' }} />
            </div>


            <div className="modal-buttons">
              <button className="btn-add" onClick={handleAddOrUpdateOffer}>
                {editingId ? "Update Offer" : "Add Offer"}
              </button>
              <button className="btn-cancel" onClick={() => { setShowModal(false); setEditingId(null); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateOffers;
