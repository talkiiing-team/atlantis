from flask import Flask, request
from data_preprocessing import prepare_data
from nn_anomaly_detection import get_predict

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
    return get_predict(data)
