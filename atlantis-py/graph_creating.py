import random

import pandas as pd
import numpy as np
from copy import deepcopy
from pyvis.network import Network

from graph import Graph, Node, Adj

# import pickle



EPOCH_COUNT_SCALER = 5
MAX_VERTEX_COUNT = 150

random.seed(0)

def get_agg_data(dct_idves_to_data, id_prod_type_to_id_fish):
    bad_keys = [9751, 9748, 9745, 9754, 9755, 9821, 9823, 9777, 9822, 9790, 9791, 9792, 9785, 9792, 9805, 9785, 9780,
                9756, 9810]

    for i in bad_keys:
        id_prod_type_to_id_fish[i] = 0


    dct_agg_data = dict()

    for id_ves in dct_idves_to_data.keys():
        if type(dct_idves_to_data[id_ves][0]) == pd.DataFrame:
            grouped_catched = dct_idves_to_data[id_ves][0].groupby(["id_fish_catched", "date"]).agg(
                {"catch_volume": "sum"})
            # grouped_catched = dct_idves_to_data[id_ves][0].groupby(["date"]).agg({"catch_volume":"sum"})
            grouped_catched_indexes = grouped_catched.index.tolist()
        else:
            continue

        if type(dct_idves_to_data[id_ves][1]) == pd.DataFrame:
            try:
                dct_idves_to_data[id_ves][1]["id_fish"] = dct_idves_to_data[id_ves][1]["id_prod_type"].apply(
                    lambda x: id_prod_type_to_id_fish[x])
            except Exception as e:
                pass
            else:
                grouped_product = dct_idves_to_data[id_ves][1].groupby(["id_fish", "date"]).agg({"prod_volume": "sum"})
                # grouped_product =  dct_idves_to_data[id_ves][1].groupby(["date"]).agg({"prod_volume":"sum"})
                grouped_product = grouped_product[grouped_product.prod_volume != 0]
                grouped_product_indexes = grouped_product.index.tolist()

        try:
            dct_agg_data[id_ves] = [grouped_catched, grouped_product]
        except Exception:
            dct_agg_data[id_ves] = [[], [], []]

    return dct_agg_data


def get_graph(agg_data):
    data_2 = dict()
    for ind, val in agg_data.items():
        a, b = val
        if a.size > 0 and b.size > 0:
            data_2[ind] = (a, b)

    dct_graph_by_fish_id = dict()

    st_a = set()
    for id_ves, val in data_2.items():
        a, b = val
        st_a.update([i[0] for i in a.index])

    st_b = set()
    for id_ves, val in data_2.items():
        a, b = val
        st_b.update([i[0] for i in b.index])

    all_fish_id = st_a & st_b
    print("count_fish_types: ", len(all_fish_id))

    for ind, cur_fish_id in enumerate(all_fish_id):
        print(f"{ind}) cur fish id: {cur_fish_id}")
        vertexes = []
        for id_ves, val in data_2.items():
            a, b = val

            if cur_fish_id in [i[0] for i in a.index] and cur_fish_id in [i[0] for i in b.index]:
                in_value = a.loc[cur_fish_id].values.sum()
                out_value = b.loc[cur_fish_id].values.sum()

                # print(in_value)
                assert type(in_value) == np.float64 and type(out_value) == np.float64
                new_vertex = Node(id_ves, in_value, out_value)
                vertexes.append(new_vertex)

        vertexes = vertexes[:MAX_VERTEX_COUNT]
        if len(vertexes) == 1:
            continue

        print(f"Graph include: {len(vertexes)} vertexes")
        g = Graph(vertexes)

        # print(g.count_error())
        start_lose = g.count_error()
        losses = [start_lose]
        print("start lose: ", losses[0])

        new_er = None
        for i in range(int(EPOCH_COUNT_SCALER * len(g.nodes))):

            new_g = deepcopy(g)
            random_adj = new_g.create_random_adj()
            new_g.add_adj(random_adj)

            new_er = new_g.count_error()
            old_er = g.count_error()

            if i % 100 == 0:
                print("cur lose: ", old_er)

            if old_er == 0:
                break

            if new_er < old_er:
                g = deepcopy(new_g)
            losses.append(new_er)

            if len(g.all_adj) > len(g.nodes)*2:
                break

        print(f"end los {new_er}")

        net = Network(directed=True)
        for i in g.nodes:
            net.add_node(i.index)
        for edge in g.all_adj:
        #     if edge.node_1.index not in color_dct.keys():
        #         continue
            # color = color_dct[edge.node_1.index]
            # if color > 10:
            #     color = "red"
            # else:
            #     color = "green"

            net.add_edge(edge.node_1.index, edge.node_2.index, weight=edge.weight)

        dct_graph_by_fish_id[cur_fish_id] = net

    return dct_graph_by_fish_id
