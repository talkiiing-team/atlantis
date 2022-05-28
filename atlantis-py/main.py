import json
import numpy as np

from flask import Flask, request
from data_preprocessing import prepare_data
from nn_anomaly_detection import get_predict


class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

app = Flask(__name__)

@app.route('/')
def _hello():
    return {
        'hello': 'world'
    }


@app.route('/heatmap', methods=['POST'])
def _heatmap():
    print(request.json)
    data = prepare_data(
        request.json.get('catch'),
        request.json.get('product'),
        request.json.get('ext1'),
        request.json.get('ext2')
    )
    json_str = json.dumps(get_predict(data), cls=NpEncoder)
    return json_str
