import pandas as pd
import numpy as np
import os

import warnings
warnings.filterwarnings("ignore")

df = pd.read_spss("../Raw Data/WellnessActivities 3.12.24_JEH_4.sav")
df.to_csv("../Raw Data/WellnessActivities 3.12.24_JEH_4.csv")
