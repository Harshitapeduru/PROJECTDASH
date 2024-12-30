from flask import Flask, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import pandas as pd
import time
import threading
import random

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Load initial data
data = pd.read_csv('data.csv')
data_dict = data.to_dict('records')

def generate_updates():
    """Simulate real-time updates"""
    while True:
        time.sleep(5)  # Update every 5 seconds
        for record in data_dict:
            # Simulate random changes in quantity and total
            record['quantity'] = max(1, record['quantity'] + random.randint(-1, 1))
            record['total'] = record['quantity'] * record['price']
            socketio.emit('sales_update', record)

@app.route('/api/data')
def get_data():
    return jsonify(data_dict)

@app.route('/api/summary')
def get_summary():
    # Generate summary data based on the loaded CSV data (data_dict)
    if data_dict:
        summary = {
            "rows": len(data_dict),
            "columns": len(data_dict[0]),
            "column_names": list(data_dict[0].keys())
        }
    else:
        summary = {
            "rows": 0,
            "columns": 0,
            "column_names": []
        }
    return jsonify(summary)

if __name__ == '__main__':
    # Start the update thread
    update_thread = threading.Thread(target=generate_updates)
    update_thread.daemon = True
    update_thread.start()
    
    # Run the app
    socketio.run(app, debug=True)
