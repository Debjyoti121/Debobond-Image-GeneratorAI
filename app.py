from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from huggingface_hub import InferenceClient
from PIL import Image
from dotenv import load_dotenv
import io
import base64
import os

app = Flask(__name__, template_folder="templates")  # Specify the templates folder
CORS(app)  # Enable CORS for all routes

# Load environment variables
load_dotenv()
token = os.getenv("HF_API_KEY")

# Initialize Hugging Face client
client = InferenceClient("stabilityai/stable-diffusion-3.5-large-turbo", token=token)

@app.route("/status", methods=["HEAD"])
def uptimerobot():
    return {}

# Route to serve the HTML page
@app.route("/")
def home():
    return render_template("index.html")  # Serves templates/index.html

@app.route("/generate", methods=["POST"])
def generate_image():
    data = request.json
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Generate the image
    image = client.text_to_image(prompt)

    # Convert image to base64 string
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return jsonify({"image": img_str})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
