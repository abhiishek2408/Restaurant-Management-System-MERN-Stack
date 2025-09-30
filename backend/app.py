from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import numpy as np
from sentence_transformers import SentenceTransformer, util
import os

app = Flask(__name__)
CORS(app)

# Load menu data safely
try:
    data_path = os.path.join(os.path.dirname(__file__), "trained_data.json")
    with open(data_path, "r") as f:
        menu_data = json.load(f)
    if not menu_data:
        raise ValueError("trained_data.json is empty")
except Exception as e:
    print(f"Error loading trained data: {e}")
    menu_data = []

# Load embedding model
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Error loading embedding model: {e}")
    model = None

# Precompute embeddings if data and model are available
menu_texts = [item["text"] for item in menu_data] if menu_data else []
menu_embeddings = model.encode(menu_texts, convert_to_tensor=True) if model is not None and menu_texts else None

@app.route("/")
def index():
    return jsonify({"status": "Flask is running"})

@app.route("/chat", methods=["GET", "POST"])
def chat():
    if request.method == "GET":
        return jsonify({"reply": "Send a POST request with JSON data to chat."})

    # Check if model or embeddings failed to load
    if model is None or menu_embeddings is None:
        return jsonify({"reply": "Backend not ready. Check server logs."})

    data = request.get_json()
    query = data.get("prompt", "").strip()

    if not query:
        return jsonify({"reply": "Please type something before asking."})

    try:
        # Compute embedding for user query
        query_embedding = model.encode(query, convert_to_tensor=True)

        # Compute cosine similarity
        cos_scores = util.cos_sim(query_embedding, menu_embeddings)[0]
        best_idx = int(np.argmax(cos_scores))

        # Return the most similar menu item
        reply = menu_texts[best_idx] if menu_texts else "Sorry, I don't have an answer for that."
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"reply": "Something went wrong: " + str(e)})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
