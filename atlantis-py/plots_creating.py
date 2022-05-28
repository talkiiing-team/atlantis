import pandas as pd


def get_plots(dct_idves_to_data, id_prod_type_to_id_fish, id_to_fish):
    """

    :param dct_idves_to_data: словарик со всеми таблицами
    :param id_prod_type_to_id_fish: словарь перевода типа переработки в id рыбы
    :param id_to_fish: словарь перевода id рыбы в название

    :return: словарь dct[ID_VES] = [
    список дат (list[str]),
    список значений тоннажа пойманного (list[int]),
    список значений тоннажа переработанного (list[int]),
    список имен рыб, о которых идет речь в каждый из дней на графике поимки[str]
    список имен рыб, на которых речь шла на графике переработки [str]
    ]
    """

    dct_plots = dict()
    for id_ves in dct_idves_to_data.keys():
        if type(dct_idves_to_data[id_ves][0]) == pd.DataFrame:
            grouped_catched = dct_idves_to_data[id_ves][0].groupby(["date", "id_fish_catched"]).agg(
                {"catch_volume": "sum"})
            # grouped_catched = dct_idves_to_data[id_ves][0].groupby(["date"]).agg({"catch_volume":"sum"})
            # grouped_catched_indexes = grouped_catched.index.tolist()
        else:
            dct_plots[id_ves] = [[], [], []]
            continue

        if type(dct_idves_to_data[id_ves][1]) == pd.DataFrame:
            try:
                dct_idves_to_data[id_ves][1]["id_fish"] = dct_idves_to_data[id_ves][1]["id_prod_type"].apply(
                    lambda x: id_prod_type_to_id_fish[x])
            except KeyError as e:
                dct_plots[id_ves] = [[], [], []]
                continue
            else:
                grouped_product = dct_idves_to_data[id_ves][1].groupby(["date", "id_fish"]).agg({"prod_volume": "sum"})
                # grouped_product =  dct_idves_to_data[id_ves][1].groupby(["date"]).agg({"prod_volume":"sum"})
                grouped_product = grouped_product[grouped_product.prod_volume != 0]
                # grouped_product_indexes = grouped_product.index.tolist()

        values_out = grouped_product.prod_volume.tolist()
        values_in = grouped_catched.catch_volume.tolist()
        mn_len = min(len(values_in), len(values_out))
        values_in = values_in[:mn_len]
        values_out = values_out[:mn_len]
        dates_x = [i[0] for i in grouped_product.index.tolist()][:mn_len]

        fish_ids_out = [i[1] for i in grouped_product.index.tolist()][:mn_len]
        fish_names_out = [id_to_fish[i] for i in fish_ids_out]

        fish_ids_in = [i[1] for i in grouped_catched.index.tolist()][:mn_len]
        fish_names_in = [id_to_fish[i] for i in fish_ids_in]


        try:
            x = [i for i in range(len(values_out))]
            dct_plots[id_ves] = [dates_x, values_in, values_out, fish_names_in, fish_names_out]
        except Exception:
            dct_plots[id_ves] = [[], [], []]

    return dct_plots
