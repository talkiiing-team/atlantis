import pandas as pd

class RefDictsGenerator:
    def __init__(self, ref_path):
        """
        Возвращает картеж из всех словарей, необходимых для расшифровки основного датасета
        :param ref_path: путь до папки ref датасета
        """
        fish =  pd.read_csv(f"{ref_path}//fish.csv", sep=";")
        prod_designate = pd.read_csv(f"{ref_path}//prod_designate.csv", sep=";")
        prod_type = pd.read_csv(f"{ref_path}//prod_type.csv", sep=";")
        regime = pd.read_csv(f"{ref_path}//regime.csv", sep=";")
        region = pd.read_csv(f"{ref_path}//region.csv", sep=";")

        self.id_to_region = {k: v for k, v in zip(list(region["id_region"]), list(region["region"]))}
        self.id_to_regime = {k: v for k, v in zip(list(regime["id_regime"]), list(regime["regime"]))}
        self.id_to_fish = {k: v for k, v in zip(list(fish["id_fish"]), list(fish["fish"]))}
        self.id_to_prod_type = {k: v for k, v in zip(list(prod_type["id_prod_type"]), list(prod_type["prod_type"]))}
        self.id_to_prod_type_full = {k: v for k, v in zip(list(prod_type["id_fish"]), list(prod_type["prod_type_full"]))}
        self.id_to_prod_designate = {k: v for k, v in
                                zip(list(prod_designate["id_prod_designate"]), list(prod_designate["prod_designate"]))}
        self.id_prod_type_to_id_fish = {k: v for k, v in zip(list(prod_type.id_prod_type), list(prod_type.id_fish))}
        self.fish_to_id = {v: k for k, v in self.id_to_fish.items()}
