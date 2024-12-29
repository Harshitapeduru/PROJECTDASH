from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import pandas as pd

app = Flask(__name__, static_folder='../frontend/build/static', static_url_path='/static')
CORS(app)

# Route for the homepage
@app.route('/')
def home():
    return send_from_directory('../frontend/build', 'index.html')

# Handle favicon.ico requests to avoid 404 errors
@app.route('/favicon.ico')
def favicon():
    return '', 204  # Returns no content

# Load data
data = pd.read_csv('data.csv')

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(data.to_dict(orient='records'))

@app.route('/api/summary', methods=['GET'])
def get_summary():
    summary = {
        "rows": len(data),
        "columns": len(data.columns),
        "column_names": data.columns.tolist(),
    }
    return jsonify(summary)

if __name__ == '__main__':
    app.run(debug=True)