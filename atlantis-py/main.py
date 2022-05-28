import json
import numpy as np

from flask import Flask, request
from data_preprocessing import prepare_data
from nn_anomaly_detection import get_predict
from plots_creating import get_plots
from dicts_generator import RefDictsGenerator


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

@app.route('/plots', methods=['POST'])
def _plots():
    REF_PATH = 'ref'
    dct_idves_to_data = prepare_data(
        request.json.get('catch'),
        request.json.get('product'),
        request.json.get('ext1'),
        request.json.get('ext2')
    )
    dicts_generator = RefDictsGenerator(REF_PATH)
    id_to_region = dicts_generator.id_to_region
    id_to_regime = dicts_generator.id_to_regime
    id_to_fish = dicts_generator.id_to_fish
    id_to_prod_type = dicts_generator.id_to_prod_type
    id_to_prod_type_full = dicts_generator.id_to_prod_type_full
    id_to_prod_designate = dicts_generator.id_to_prod_designate
    id_prod_type_to_id_fish = dicts_generator.id_prod_type_to_id_fish
    fish_to_id = dicts_generator.fish_to_id

    dct_plots = get_plots(dct_idves_to_data, id_prod_type_to_id_fish, id_to_fish)
    json_str = json.dumps(dct_plots, cls=NpEncoder)
    return json_str
