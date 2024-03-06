import pandas as pd
import numpy as np
import os
import plotly.graph_objects as go
from tqdm import tqdm
import warnings
warnings.filterwarnings("ignore")

df = pd.read_spss("../Raw Data/WellnessActivities2.23.24.sav")
df['ageG'] = df['age'].apply(lambda x: 1 if x >= 18 and x <= 29 else (2 if x >= 30 and x <= 49 else 3))

goals = ['Sleep', 'Phys', 'Emo', 'Product', 'Social']
# goals = ['Sleep']
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

colors=['#828BFB', '#F37964', '#33D6AB']

def get_top_activities(df_goal, goal):
    act_cols = [col for col in df_goal if col.startswith(g) and '_' not in col and col != g + 'Goal' and col not in dontuse]
    act_cols = act_cols[0:25 - len([n for n in dontuse if n.startswith(g)])]

    df_acts = df_goal[act_cols]
    df_acts = df_acts.loc[:,~df_acts.columns.str.contains('26|27|28|29|30')]  # remove write-ins
    df_acts.replace(0, np.nan, inplace=True)

    return list(df_acts.count().sort_values(ascending=False).index.values[0:10])

def count_cols(row, d):
    df_new = pd.DataFrame(columns=['demo', 'activity'])

    for act in row.loc[lambda x: x != 0.0].index.values:
        if act != d:
            new_record = pd.DataFrame([{'demo':row[d], 'activity':act}])
            df_new = pd.concat([df_new, new_record], ignore_index=True)

    return df_new

for g in tqdm(goals):
    print('Goal:', g)
    df_goal = df.loc[df[g + 'Goal'] != 0]
    for d in tqdm(demos, leave=False):
        act_cols = [col for col in df_goal if col.startswith(g) and '_' not in col and col != g + 'Goal' and col not in dontuse]
        act_cols = act_cols[0:25 - len([n for n in dontuse if n.startswith(g)])]
        act_cols.append(d)

        df_acts = df_goal[act_cols]
        # top_acts = list(df_acts.loc[:, df_acts.columns != d].count().sort_values(ascending=False).index.values[0:10])

        df_sankey = pd.concat(df_acts.apply(lambda x: count_cols(x, d), axis=1).tolist())
        df_sankey.reset_index(drop=True, inplace=True)

        # Count activity occurrences by demo
        activity_counts = df_sankey.groupby(['demo', 'activity']).size().reset_index(name='count')


        top_activities = activity_counts.groupby('demo').apply(lambda x: x.nlargest(10, 'count')).reset_index(drop=True)

        # Calculate total counts per demo
        total_counts = top_activities.groupby('demo')['count'].sum()

        # Calculate percentages
        top_activities['percentage'] = top_activities.apply(lambda row: row['count'] / total_counts[row['demo']], axis=1)

        # Create nodes and labels
        nodes = []
        node_labels = {}
        for i, de in enumerate(top_activities['demo'].unique()):
            nodes.append(dict(label=str(de)))
            node_labels[de] = i

        activity_labels = {}
        for i, activity in enumerate(top_activities['activity'].unique()):
            # if activity in top_acts:
            nodes.append(dict(label=activity))
            activity_labels[activity] = i + len(top_activities['demo'].unique())

        # Create links
        links = []
        for _, row in top_activities.iterrows():
            # if row['activity'] in top_acts:
                source = node_labels[row['demo']]
                target = activity_labels[row['activity']]
                color = colors[activity_counts['demo'].unique().tolist().index(row['demo'])]
                links.append(dict(source=source, target=target, value=row['percentage'], color=color))

        # Create Sankey plot
        fig = go.Figure(data=[go.Sankey(
            node=dict(
                pad=15,
                thickness=20,
                line=dict(color="black", width=0.5),
                label=[node['label'] for node in nodes],
            ),
            link=dict(
                source=[link['source'] for link in links],
                target=[link['target'] for link in links],
                value=[link['value'] for link in links],
                color=[link['color'] for link in links]
            )
        )])

        fig.update_layout(title_text=g + " activities broken down by " + d)
        fig.write_image("../sankey/" + g + "_" + d + ".png", scale=2)
