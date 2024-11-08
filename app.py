import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import faiss
from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the Universal Sentence Encoder
embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")

# Initialize FAISS index
embedding_dim = 512  # Dimension of the embeddings from USE
index = faiss.IndexFlatL2(embedding_dim)
document_chunks = []


def embed_text(text):
    embeddings = embed([text])
    return np.array(embeddings)


def process_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text


def add_document_to_index(text, chunk_size=500):
    chunks = [text[i : i + chunk_size] for i in range(0, len(text), chunk_size)]
    for chunk in chunks:
        embedding = embed_text(chunk)
        index.add(embedding)
        document_chunks.append(chunk)


# Process the provided PDFs
sofi_2024_text = process_pdf("SOFI-2024.pdf")
sofi_2023_text = process_pdf("SOFI-2023.pdf")
add_document_to_index(sofi_2024_text)
add_document_to_index(sofi_2023_text)


@app.route("/query", methods=["POST"])
def query():
    user_query = request.json.get("query")
    if not user_query:
        return jsonify({"error": "Query is required"}), 400

    # Embed the user query
    query_embedding = embed_text(user_query)

    # Search for similar document chunks
    D, I = index.search(query_embedding, k=5)
    retrieved_chunks = [document_chunks[i] for i in I[0]]

    # Combine retrieved chunks
    context = " ".join(retrieved_chunks)

    # Generate response (Placeholder for your generative model)
    answer = f"Based on the context: {context}, the answer to your question '{user_query}' is ..."

    # Format the response as a paragraph
    formatted_answer = answer.replace("\n", " ").strip()

    return jsonify({"answer": formatted_answer})


if __name__ == "__main__":
    app.run(debug=True)
