import numpy as np
import pandas as pd
from joblib import load
import warnings
warnings.filterwarnings("ignore")


clf_a_b = load('anomaly_detection_models//clf_a_b.joblib')
clf_a_b_c = load('anomaly_detection_models//clf_a_b_c.joblib')
clf_b = load('anomaly_detection_models//clf_b.joblib')


def feature_extracting(dct_idves_to_data):
    """
    Принимает на вход данные из data_preprocessing, генерит фичи для моделек
    """

    values = []
    indexes = []        # id_ves for each value

    data_a = [[], [], []]  # only catched
    data_b = [[], [], []]  # only product
    data_a_b = [[], [], []]  # catched + product
    data_a_c = [[], [], []]  # catched + in global db
    data_b_c = [[], [], []]  # product + in global db
    data_a_b_c = [[], [], []]  # catched + product + in global db

    for id_ves in list(dct_idves_to_data.keys()):

        a, b, c = dct_idves_to_data[id_ves]
        features = []
        features_dscr = []

        flag_a = type(a) == pd.DataFrame
        flag_b = type(b) == pd.DataFrame
        flag_c = type(c) == pd.DataFrame

        if flag_a:
            a.date = pd.to_datetime(a.date)

        if flag_a:
            # кол-во уникальных пойманных рыб
            feature_3 = len(a.id_fish_catched.unique())
            # кол-во уникальных регионов ловли
            feature_2 = len(a.id_region.unique())
            # суммарное пойманное кол-во рыбы
            feature_4 = a.catch_volume.sum()
            feature_6 = a.catch_volume.mean()               # среднее пойманное кол-во рыбы
            # кол-во уникальных владельцев судна
            feature_9 = len(a.id_own.unique())
            # время всех сессий ловли
            feature_11 = (max(a.date) - min(a.date)).days
            features.extend([feature_3, feature_2, feature_4,
                            feature_6, feature_9, feature_11])
            features_dscr.extend(["вид рыбы", "территория ловли", "тоннаж рыбы",
                                 "средний тоннаж рыбы", "владелец судна", "время ловли"])

        if flag_b:
            # суммарное кол-во рыб для переработк
            feature_5 = b.prod_volume.sum()
            # среднее кол-во рыб для перерадотк
            feature_7 = b.prod_volume.mean()
            # среднее значение итогового объема на борту
            feature_12 = b.prod_board_volume.mean()
            features.extend([feature_5, feature_7, feature_12])
            features_dscr.extend(["суммарное кол-во переработанной рыбы",
                                 "среднее кол-во переработанной рыбы", "среднее значение итогового объема на борту"])

        if flag_a and flag_b:
            catched_val = a.catch_volume.sum()
            prod_val = b.prod_volume.sum()
            # объем пойманное - объем проданной
            feature_10 = catched_val - prod_val
            features.extend([feature_10])
            features_dscr.extend(["пойманная рыба относительно проданной"])

        if flag_c:
            c.date_fishery = pd.to_datetime(c.date_fishery)
            c.date_vsd = pd.to_datetime(c.date_vsd)
            delta_time = c.date_vsd - c.date_fishery
            delta = delta_time.mean()
            feature_13 = delta.days*24 + delta.seconds//3600
            # средняя разница между временем регистрации и сертификата и временем вылова
            features.extend([feature_13])
            features_dscr.extend(["время регистрации и сертификации"])

        if flag_a and not flag_b and not flag_c:
            data_a[0].append(features)
            data_a[1].append(id_ves)
            data_a[2].append(features_dscr)
        elif flag_a and flag_b and not flag_c:
            data_a_b[0].append(features)
            data_a_b[1].append(id_ves)
            data_a_b[2].append(features_dscr)
        elif flag_a and flag_b and flag_c:
            data_a_b_c[0].append(features)
            data_a_b_c[1].append(id_ves)
            data_a_b_c[2].append(features_dscr)
        elif not flag_a and flag_b and not flag_c:
            data_b[0].append(features)
            data_b[1].append(id_ves)
            data_b[2].append(features_dscr)
        elif not flag_a and flag_b and flag_c:
            data_b_c[0].append(features)
            data_b_c[1].append(id_ves)
            data_b_c[2].append(features_dscr)
        else:
            data_a_c[0].append(features)
            data_a_c[1].append(id_ves)
            data_a_c[2].append(features_dscr)

    indexes.append(id_ves)
    indexes = pd.Series(indexes)
    return data_a, data_b, data_a_b, data_a_c, data_b_c, data_a_b_c

def get_predict(dct_idves_to_data):
    output_data = {}
    THRESHOLD = 20
    data_a, data_b, data_a_b, data_a_c, data_b_c, data_a_b_c = feature_extracting(
        dct_idves_to_data)
    data_a_b_weights = np.array([0.025686, 0.0416141, 0.20481122, 0.21418742,
                                 0.0752326, 0.04461282, 0.1182098, 0.0667577, 0.14285058, 0.06603775])
    data_a_b_c_weights = np.array([0.04488525, 0.04124833, 0.1083084, 0.15362563, 0.04764852,
                                   0.06395468, 0.12995028, 0.14714424, 0.10627046, 0.10767445, 0.04928976])
    data_b_weights = np.array([0.2124619, 0.25082631, 0.53671179])

    scores = clf_a_b.decision_function(np.array(data_a_b[0]))
    class_ids = np.array([int(e > THRESHOLD) for e in scores])
    scores = (scores-min(scores))/(max(scores) - min(scores)) * 100
    for i in range(len(data_a_b[0])):
        r = []
        r.append(class_ids[i])
        s = scores[i]
        probs = data_a_b_weights * s
        probs_dict = {data_a_b[2][i][j]: min(
            probs[j]*(r[0]*10+1), 100) for j in range(len(probs))}
        r.append(probs_dict)
        output_data[data_a_b[1][i]] = r
    scores = clf_a_b_c.decision_function(np.array(data_a_b_c[0]))
    class_ids = np.array([int(e > THRESHOLD) for e in scores])
    scores = (scores-min(scores))/(max(scores) - min(scores)) * 100
    for i in range(len(data_a_b_c[0])):
        r = []
        r.append(class_ids[i])
        s = scores[i]
        probs = data_a_b_c_weights * s
        probs_dict = {data_a_b_c[2][i][j]: min(
            probs[j]*(r[0]*10+1), 100) for j in range(len(probs))}
        r.append(probs_dict)
        output_data[data_a_b_c[1][i]] = r
    scores = clf_b.decision_function(np.array(data_b[0]))
    class_ids = clf_b.predict(np.array(data_b[0]))
    scores = (scores-min(scores))/(max(scores) - min(scores)) * 100
    for i in range(len(data_b[0])):
        r = []
        r.append(class_ids[i])
        s = scores[i]
        probs = data_b_weights * s
        probs_dict = {data_b[2][i][j]: min(
            probs[j]*(r[0]*10+1), 100) for j in range(len(probs))}
        r.append(probs_dict)
        output_data[data_b[1][i]] = r

    for i in (set(dct_idves_to_data.keys()) - set(output_data.keys())):
        output_data[i] = []

    return output_data
