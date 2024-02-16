import pandas as pd
import numpy as np
import os

import warnings
warnings.filterwarnings("ignore")

df = pd.read_spss("../Raw Data/Wellbeing1000.sav")
df = df.iloc[13:]  # first 13 lines are all test data
df = df.rename(columns={'SleepFreqFreq': 'SleepTimeFreq'})

goals = ['Sleep', 'Phys', 'Emo', 'Product', 'Social']

for g in goals:
    print('Goal:', g)

    df_goal = df.loc[df[g + 'Goal'] != 0]
    print('Total Individuals:', len(df_goal))

    act_cols = [col for col in df_goal if col.startswith(g) and '_' not in col and col != g + 'Goal']
    act_cols = act_cols[0:25]
    duration_cols = [col for col in df_goal if col.startswith(g) and sum(map(str.isupper, col)) >= 3 and col.endswith('Time')]
    freq_cols = [col for col in df_goal if col.startswith(g) and sum(map(str.isupper, col)) >= 3 and col.endswith('Freq')]

    df_acts = df_goal[act_cols]
    df_acts = df_acts.loc[:,~df_acts.columns.str.contains('26|27|28|29|30')]  # remove write-ins
    df_acts.replace(0, np.nan, inplace=True)

    df_duration = df_goal[duration_cols]
    df_freq = df_goal[freq_cols]
    df_freq[df_freq.iloc[:, :] > 7] = np.nan
    
    df_final = pd.DataFrame()

    df_final['Count'] = df_acts.count()
    df_final['Percentage'] = (len(df_acts) - df_acts.isnull().sum()) * 100 / len(df_acts)
    df_final['Duration (min)'] = df_duration.mean().values
    df_final['Frequency (days)'] = df_freq.mean().values
    df_final = df_final.sort_values(by ='Count', ascending=False)
    # print(df_final)

    if not os.path.exists('../output.xlsx'):
        df_final.to_excel("../output.xlsx", sheet_name=g)
    else:
        with pd.ExcelWriter('../output.xlsx', mode='a') as writer:  
            df_final.to_excel(writer, sheet_name=g)

    print('')
    # exit()



# df.to_csv("../Raw Data/Wellbeing1000.csv")