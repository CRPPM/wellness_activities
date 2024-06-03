import pandas as pd
import numpy as np
import os
import plotly.graph_objects as go
from tqdm import tqdm
import warnings
warnings.filterwarnings("ignore")

colors = ['#DECBE2', '#E58A9E', '#91BFCA']
demo_colors = ['#B589BD', '#CE2D4F', '#0B7189']
goal_colors = {'Sleep': '#7EC8BC', 'Phys': '#EDE1AB',
               'Emo': '#9AC2FF', 'Product': '#D2B59E', 'Social': '#FF9B70'}


def get_demos(goal):
    match goal:
        case 'Sleep':
            demos = ['WellnessAppG']
        case 'Phys':
            demos = ['MedCardioSelf']
        case 'Emo':
            demos = ['MedDepSelf']
        case 'Product':
            demos = ['incomeB']
        case 'Social':
            demos = ['MedAnxSelf']

    return demos


def count_cols(row, d):
    df_new = pd.DataFrame(columns=['demo', 'activity'])

    for act in row.loc[lambda x: x != 0.0].index.values:
        if act != d:
            new_record = pd.DataFrame([{'demo': row[d], 'activity':act}])
            df_new = pd.concat([df_new, new_record], ignore_index=True)

    return df_new


def graph_sankey(goal, df, demos):
    df_goal = df.loc[df[goal + 'Goal'] != 0]

    for d in demos:

        act_cols = [col for col in df_goal if col.startswith(
            goal) and '_' not in col and col != goal + 'Goal']
        act_cols = act_cols[0:25]
        act_cols.append(d)

        if d == 'WellnessAppG':
            m = {"Other": ["None", "All other apps"],
                 "Headspace or Calm": ["Headspace or Calm"]}
            m2 = {v: k for k, vv in m.items() for v in vv}
            df_goal[d] = df_goal[d].map(m2).astype("category")

        df_acts = df_goal[act_cols]

        df_sankey = pd.concat(df_acts.apply(
            lambda x: count_cols(x, d), axis=1).tolist())
        df_sankey.reset_index(drop=True, inplace=True)

        # Count activity occurrences by demo
        activity_counts = df_sankey.groupby(
            ['demo', 'activity']).size().reset_index(name='count')

        top_activities = activity_counts.groupby('demo').apply(
            lambda x: x.nlargest(10, 'count', keep='all')).reset_index(drop=True)

        # Calculate total counts per demo
        total_counts = top_activities.groupby('demo')['count'].sum()

        # Calculate percentages
        top_activities['percentage'] = top_activities.apply(
            lambda row: row['count'] / total_counts[row['demo']], axis=1)
        print(top_activities)

        # Create nodes
        nodes = []
        node_labels = {}
        for i, de in enumerate(top_activities['demo'].unique()):
            nodes.append(
                dict(label=str(de), color=demo_colors[i], thickness=100))
            node_labels[de] = i

        activity_labels = {}
        for i, activity in enumerate(top_activities['activity'].unique()):
            nodes.append(
                dict(label=activity, color=goal_colors[goal], thickness=10))
            activity_labels[activity] = i + \
                len(top_activities['demo'].unique())

        # Create links
        links = []
        for _, row in top_activities.iterrows():
            source = node_labels[row['demo']]
            target = activity_labels[row['activity']]
            color = colors[activity_counts['demo'].unique(
            ).tolist().index(row['demo'])]
            links.append(dict(source=source, target=target,
                              value=row['percentage'], color=color))

        # Specify width if needed and pass into Figure
        # layout = go.Layout(
        #     width=500,
        # )

        # Create Sankey plot
        fig = go.Figure(data=[go.Sankey(
            node=dict(
                pad=10,
                thickness=10,
                line=dict(color="black", width=0),
                # label=[node['label'] for node in nodes],
                color=[node['color'] for node in nodes],
            ),
            link=dict(
                source=[link['source'] for link in links],
                target=[link['target'] for link in links],
                value=[link['value'] for link in links],
                color=[link['color'] for link in links]
            )
        )])
        # , layout=layout)

        fig.update_layout(paper_bgcolor="rgba(0,0,0,0)",
                          plot_bgcolor="rgba(0,0,0,0)")
        fig.write_image("../sankey/" + goal + "_" + d + ".svg", scale=2)
        # fig.show()


if __name__ == "__main__":
    goal = 'Social'
    df = pd.read_spss("../Raw Data/WellnessActivities 3.12.24_JEH_4.sav")

    df.reset_index(drop=True, inplace=True)
    df['ageG'] = df['age'].apply(
        lambda x: 1 if x >= 18 and x <= 29 else (2 if x >= 30 and x <= 49 else 3))
    demos = get_demos(goal)
    graph_sankey(goal, df, demos)
