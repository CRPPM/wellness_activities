import pandas as pd
import numpy as np
import os
import json

import warnings
warnings.filterwarnings("ignore")

# df = pd.read_spss("../Raw Data/WellnessActivities2.21.24.sav")

goals = ['Sleep', 'Phys', 'Emo', 'Product', 'Social']
dontuse = ['SleepAlc', 'SleepCaf', 'SleepNaps', 'SleepTime', 'SleepRoutine', 'SleepEnviron', 'SleepAvoidMeals',
           'EmoClothes', 'EmoWater', 'PhysSleep', 'PhysDr', 'PhysAlc', 'PhysWater', 'ProductConsistent',
           'ProductSilent', 'ProductEliminate', 'ProductAskHelp', 'ProductClothes', 'ProductWater', 'ProductMusic',
           'SocialJoin', 'SocialAskHelp', 'SocialDistance', 'SocialGreet', 'SocialSleep', 'SocialMedia']
dontusetime = [d + 'Time' for d in dontuse]
dontusefreq = [d + 'Freq' for d in dontuse]

questions = {}
df = pd.read_excel("../Raw Data/Wellness Survey Part II Data Dictionary.xlsx", sheet_name=['Sleep', 'Emo', 'Phys', 'Product', 'Social'])

def remove_parentheses(x):
    i = x.find(')')
    return x[i+2:].lower()

for g in ['Sleep', 'Emo', 'Phys', 'Product', 'Social']:
    df[g].Label = df[g].Label.apply(remove_parentheses)
    questions = questions | pd.Series(df[g].Label.values, index=df[g].Variable).to_dict()

with open('file.txt', 'w') as file:
     file.write(json.dumps(questions)) # use `json.loads` to do the reverse