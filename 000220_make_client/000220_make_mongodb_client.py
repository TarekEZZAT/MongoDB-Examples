import os
import pandas as pd
import numpy as np
from IPython.core.display import display, HTML
import pymongo
from pymongo import MongoClient
print ('Mongo version', pymongo.__version__)
client = MongoClient('localhost', 27017)

db = client.training
collection = db.contacts