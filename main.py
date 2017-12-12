from iota import Iota, TransactionHash

import Queue

api = Iota(
    'https://nodes.iota.cafe:443'
)

txhash = 'AYIEJ9IIFDWIJFDLKWQVGQM9RFIYQKNNXQGWGOHFJVVEONZMJDVGRGKNN9OBJUARFYMJJ9CZMRZQA9999'

tips = api.get_node_info()
n = 0
tocheck = [TransactionHash(txhash)]

while tocheck:
    approvees = api.find_transactions(approvees=tocheck)['hashes']
    n += len(approvees)
    tocheck = approvees

print n, '/', tips['tips']
