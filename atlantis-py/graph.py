import random


class Node:
    def __init__(self, index, in_val, out_val):
        self.in_val = in_val
        self.out_val = out_val
        self.index = index

    def __str__(self):
        return f"{round(self.in_val, 3)} {round(self.out_val, 3)}"


class Adj:
    def __init__(self, node_1, node_2, weight):
        self.weight = weight
        self.node_1 = node_1
        self.node_2 = node_2

    def __str__(self):
        return f"({self.node_1}) ({self.node_2}) {round(self.weight, 3)}"


class Graph:
    def __init__(self, nodes):
        self.neighbours = dict()
        self.neighbours_back = dict()
        self.nodes = []

        self.all_adj = []
        for i in nodes:
            self.neighbours[i] = []
            self.neighbours_back[i] = []
            self.nodes.append(i)

    def del_adj(self, adj):
        ind1 = adj.node_1
        ind2 = adj.node_2

        self.all_adj.remove(adj)
        self.neighbours[ind1].remove(adj)
        self.neighbours_back[ind2].remove(adj)

    def add_adj(self, adj):
        ind1 = adj.node_1
        ind2 = adj.node_2

        self.all_adj.append(adj)
        self.neighbours[ind1].append(adj)
        self.neighbours_back[ind2].append(adj)

    def get_random_adj(self):
        return random.choice(self.all_adj)

    def count_node_extra_weight(self, node):
        res = node.out_val - node.in_val

        for i in self.neighbours[node]:
            res -= i.weight

        for i in self.neighbours_back[node]:
            res += i.weight

        return res

    def create_random_adj(self):
        node_1 = random.choice(self.nodes)
        node_2 = node_1

        while node_2 == node_1:
            node_2 = random.choice(self.nodes)

        weight = self.count_node_extra_weight(node_1)
        if weight < 0:
            node_1, node_2 = node_2, node_1

        return Adj(node_1, node_2, weight)

    def count_error(self):
        res = 0

        for i in self.nodes:
            # print(f"counting extra weight for {i}: {self.count_node_extra_weight(i)}")
            res += self.count_node_extra_weight(i) ** 4

        return abs(res) // int(1e6)

