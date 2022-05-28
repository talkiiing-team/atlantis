import pandas as pd


def prepare_data(catch_path, product_path, ext1_path, ext2_path):
    """
    Для форматирования данных в тот тип, который в дальнейшем юзается для анализа и подаётся в детектор аномалий
    """
    catch = pd.read_csv(catch_path)
    product = pd.read_csv(product_path)
    ext = pd.read_csv(ext1_path)
    ext2 = pd.read_csv(ext2_path)
    ext_merged = ext.merge(ext2, left_on='id_vsd', right_on='id_vsd')

    catch_grouped = catch.groupby('id_ves')
    product_grouped = product.groupby('id_ves')
    ext_grouped = ext_merged.groupby("id_ves")

    dct_idves_to_data = dict()
    for i in set(catch.id_ves.unique().tolist() + product.id_ves.unique().tolist()):
        dct_idves_to_data[i] = [[], []]

        try:
            if dct_idves_to_data[i][0] == []:
                dct_idves_to_data[i][0] = catch_grouped.get_group(i)
            else:
                dct_idves_to_data[i][0].append(catch_grouped.get_group(i))
        except Exception:
            pass

        try:
            if dct_idves_to_data[i][1] == []:
                dct_idves_to_data[i][1] = product_grouped.get_group(i)
            else:
                dct_idves_to_data[i][1].append(product_grouped.get_group(i))
        except Exception:
            pass

    all_id_ves = set(ext_merged["id_ves"])

    for id_ves in dct_idves_to_data.keys():
        if len(dct_idves_to_data[id_ves][0]) == 0:
            dct_idves_to_data[id_ves].append([])
            continue
        dct_idves_to_data[id_ves][0] = dct_idves_to_data[id_ves][0].rename(
            columns={"id_fish": "id_fish_catched"})
        if id_ves in all_id_ves:
            dct_idves_to_data[id_ves].append(ext_grouped.get_group(id_ves))
        else:
            dct_idves_to_data[id_ves].append([])

    return dct_idves_to_data
