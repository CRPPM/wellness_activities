import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns

import warnings
warnings.filterwarnings("ignore")

sns.set(style='white')

df = pd.read_spss("../Raw Data/WellnessActivities2.23.24.sav")
df['ageG'] = df['age'].apply(lambda x: 1 if x >= 18 and x <= 29 else (2 if x >= 30 and x <= 49 else 3))

goals = ['Sleep', 'Phys', 'Emo', 'Product', 'Social']
demos = ['ChronicYN', 'MedWeightSelf',
         'MedMuscleSelf', 'MedGastroSelf', 'MedDepSelf',
         'MedAnxSelf', 'MedPTSDSelf', 'MedSocialSelf',
         'MedPanicSelf', 'GenderB', 'sexorB', 'raceB',
         'incomeB', 'locationB', 'ageG', 'MHSG', 'PHSG',
         'BFIExtraHi', 'WearYN']

dontuse = ['SleepAlc', 'SleepCaf', 'SleepNaps', 'SleepTime', 'SleepRoutine', 'SleepEnviron', 'SleepAvoidMeals',
           'EmoClothes', 'EmoWater', 'PhysSleep', 'PhysDr', 'PhysAlc', 'PhysWater', 'ProductConsistent',
           'ProductSilent', 'ProductEliminate', 'ProductAskHelp', 'ProductClothes', 'ProductWater', 'ProductMusic',
           'SocialJoin', 'SocialAskHelp', 'SocialDistance', 'SocialGreet', 'SocialSleep', 'SocialMedia']
dontusetime = [d + 'Time' for d in dontuse]
dontusefreq = [d + 'Freq' for d in dontuse]

def calc_rbo(l1,l2,p):
    """ 
    Returns RBO indefinite rank similarity metric, as described in:
    Webber, W., Moffat, A., & Zobel, J. (2010). 
    A similarity measure for indefinite rankings. 
    ACM Transactions on Information Systems.
    doi:10.1145/1852102.1852106.
    """
    sl,ll = sorted([(len(l1), l1),(len(l2),l2)])
    s, S = sl
    l, L = ll
    
    # Calculate the overlaps at ranks 1 through l 
    # (the longer of the two lists)
    ss = set([])
    ls = set([])
    overs = {}
    for i in range(l):
        ls.add(L[i])
        if i<s:
           ss.add(S[i])
        X_d = len(ss.intersection(ls))
        d = i+1
        overs[d] = float(X_d)
    
    # (1) \sum_{d=1}^l (X_d / d) * p^d
    sum1 = 0
    for i in range(l):
        d=i+1
        sum1+=overs[d]/d*pow(p,d)
    X_s = overs[s]
    X_l = overs[l]

    # (2) \sum_{d=s+1}^l [(X_s (d - s)) / (sd)] * p^d
    sum2 = 0
    for i in range(s,l):
        d=i+1
        sum2+=(X_s*(d-s)/(s*d))*pow(p,d)

    # (3) [(X_l - X_s) / l + X_s / s] * p^l
    sum3 = ((X_l-X_s)/l+X_s/s)*pow(p,l)
    
    # Equation 32. 
    rbo_ext = (1-p)/p*(sum1+sum2)+sum3
    return rbo_ext

def get_top_activities(df_goal, goal):
    act_cols = [col for col in df_goal if col.startswith(g) and '_' not in col and col != g + 'Goal' and col not in dontuse]
    act_cols = act_cols[0:25 - len([n for n in dontuse if n.startswith(g)])]

    df_acts = df_goal[act_cols]
    df_acts = df_acts.loc[:,~df_acts.columns.str.contains('26|27|28|29|30')]  # remove write-ins
    df_acts.replace(0, np.nan, inplace=True)

    return list(df_acts.count().sort_values(ascending=False).index.values[0:10])


df_graph = pd.DataFrame(columns=['Goal', 'Demo', 'RBO'])

for g in goals:
    print('Goal:', g)
    df_goal = df.loc[df[g + 'Goal'] != 0]

    for d in demos:

        if d in ['GenderB']:
            A = 1
            B = 2
        elif df[d].dtype == 'category':
            A = df[d].cat.categories[0]
            B = df[d].cat.categories[1]
        elif d == 'ageG':
            A = 1
            B = 3

        df_A = df_goal.loc[df_goal[d] == A]
        df_B = df_goal.loc[df_goal[d] == B]

        A_list = get_top_activities(df_A, g)
        B_list = get_top_activities(df_B, g)

        new_record = pd.DataFrame([{'Goal':g, 'Demo':d, 'RBO':calc_rbo(A_list, B_list, 0.98)}])
        df_graph = pd.concat([df_graph, new_record], ignore_index=True)

print(df_graph)
ax = sns.barplot(x='Demo', y='RBO', hue='Goal', data=df_graph)
ax.set_xticklabels(ax.get_xticklabels(), rotation=45, ha='right')
sns.despine()
plt.legend(loc='upper right')
plt.show()
