from flask import Flask, request
from data_preprocessing import prepare_data
from nn_anomaly_detection import feature_extracting

app = Flask(__name__)


def get_file_paths(res):
    return {
        'ext1': res.ext1,
        'ext2': res.ext2,
        'catch': res.catch,
        'product': res.product,
    }


@app.route('/')
def _hello():
    return {
        'hello': 'world'
    }


@app.route('/heatmap', methods=['POST'])
def _heatmap():
    files = get_file_paths(**request.json)
    data = prepare_data(
        files.get('catch'),
        files.get('product'),
        files.get('catch'),
        files.get('product')
    )
    return feature_extracting(data)
