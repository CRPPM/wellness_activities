import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
from statistics import stdev

import warnings
warnings.filterwarnings("ignore")

sns.set(style='white')
colors = ["#7EC8BC", "#EDE1AB", "#99C2FF", "#D1B59E", "#FF9B70"]
sns.set_palette(sns.color_palette(colors))

df = pd.read_spss("../Raw Data/WellnessActivities 3.12.24_JEH_4.sav")
df = df[df['StartDate'].notna()]

df['ageG'] = df['age'].apply(
    lambda x: 1 if x >= 18 and x <= 29 else (2 if x >= 30 and x <= 49 else 3))
df['Per'] = pd.Categorical(df['SRP'].apply(
    lambda x: 'high' if x >= 10.3 else 'low'))

goals = {'Sleep': 'Sleep', 'Phys': 'Physical Health', 'Emo': 'Emotional Health',
         'Product': 'Productivity', 'Social': 'Social Wellness'}
demos_overall = {'GenderB': 'Gender', 'sexorB': 'Sexual Orientation',
                 'incomeB': 'Income', 'ageG': 'Age',
                 'MHSG': 'Mental Health Diagnosis', 'PHSG': 'Physical Health Diagnosis',
                 'WearYN': 'Wearable Use', 'WellnessAppG': 'Meditation App Use',
                 'BFIExtraHi': 'Extraversion', 'Per': 'Perseverance'}

demos_PHSG = {'MedWeightSelf': 'Unhealthy Weight', 'MedMuscleSelf': 'Musculoskeletal Disorder',
              'MedGastroSelf': 'Gastrointestinal Disorder', 'MedCancerSelf': 'Cancer',
              'MedDiabetesSelf': 'Diabetes', 'MedCardioSelf': 'Cardiovascular', 'MedLungSelf': 'Lung',
              'MedNeuroSelf': 'Neuro'}
demos_MHSG = {'MedDepSelf': 'Depression', 'MedPTSDSelf': 'PTSD', 'MedAnxSelf': 'Anxiety',
              'MedBipolarSelf': 'Bipolar', 'MedAutismSelf': 'Autism', 'MedSocialSelf': 'Social',
              'MedOCDSelf': 'OCD', 'MedPanicSelf': 'Panic Attacks'}


def minmax(val_list):
    min_val = round(min(val_list), 3)
    max_val = round(max(val_list), 3)

    return (min_val, max_val)


def calc_rbo(l1, l2, p):
    """ 
    Returns RBO indefinite rank similarity metric, as described in:
    Webber, W., Moffat, A., & Zobel, J. (2010). 
    A similarity measure for indefinite rankings. 
    ACM Transactions on Information Systems.
    doi:10.1145/1852102.1852106.
    """
    sl, ll = sorted([(len(l1), l1), (len(l2), l2)])
    s, S = sl
    l, L = ll

    # Calculate the overlaps at ranks 1 through l
    # (the longer of the two lists)
    ss = set([])
    ls = set([])
    overs = {}
    for i in range(l):
        ls.add(L[i])
        if i < s:
            ss.add(S[i])
        X_d = len(ss.intersection(ls))
        d = i+1
        overs[d] = float(X_d)

    # (1) \sum_{d=1}^l (X_d / d) * p^d
    sum1 = 0
    for i in range(l):
        d = i+1
        sum1 += overs[d]/d*pow(p, d)
    X_s = overs[s]
    X_l = overs[l]

    # (2) \sum_{d=s+1}^l [(X_s (d - s)) / (sd)] * p^d
    sum2 = 0
    for i in range(s, l):
        d = i+1
        sum2 += (X_s*(d-s)/(s*d))*pow(p, d)

    # (3) [(X_l - X_s) / l + X_s / s] * p^l
    sum3 = ((X_l-X_s)/l+X_s/s)*pow(p, l)

    # Equation 32.
    rbo_ext = (1-p)/p*(sum1+sum2)+sum3
    return rbo_ext


def get_top_activities(df_goal, goal):
    act_cols = [col for col in df_goal if col.startswith(
        goal) and '_' not in col and col != goal + 'Goal']
    act_cols = act_cols[0:25]

    df_acts = df_goal[act_cols]
    df_acts = df_acts.loc[:, ~df_acts.columns.str.contains(
        '26|27|28|29|30')]  # remove write-ins
    df_acts.replace(0, np.nan, inplace=True)

    return list(df_acts.count().sort_values(ascending=False).index.values[0:10])


def plot_RBO(demos, remove_other_demos=False):
    df_graph = pd.DataFrame(columns=['Goal', 'Demo', 'RBO', 'Label'])
    min_RBO = 2
    max_RBO = 0
    rbos = {}
    for g in goals.keys():
        print('Goal:', goals[g])
        df_goal = df.loc[df[g + 'Goal'] != 0]
        rbos[goals[g]] = []
        for d in demos.keys():
            if not remove_other_demos:
                if df[d].dtype == 'category':
                    A = df[d].cat.categories[0]
                    B = df[d].cat.categories[1]
                elif d == 'ageG':
                    A = 1
                    B = 3
                elif d == 'MHSG' or d == 'PHSG':
                    A = 1
                    B = 0
                else:
                    print('Breaks on ', d)
                    exit()

                df_A = df_goal.loc[df_goal[d] == A]
                df_B = df_goal.loc[df_goal[d] == B]

            else:
                if not (df_goal[d].cat.categories == [0.0, 'Self']).all:
                    print('Breaks on ', d)
                    exit()
                df_A = df_goal.loc[df_goal[d] == 0.0]
                for demo in demos.keys():
                    df_A = df_A.loc[df_A[demo] == 0.0]

                df_B = df_goal.loc[df_goal[d] == 'Self']

            A_list = get_top_activities(df_A, g)
            B_list = get_top_activities(df_B, g)

            rbo = calc_rbo(A_list, B_list, 0.98)
            rbos[goals[g]].append(rbo)
            max_RBO = max(max_RBO, rbo)
            min_RBO = min(min_RBO, rbo)

            new_record = pd.DataFrame(
                [{'Goal': goals[g], 'Demo':demos[d], 'RBO':rbo, 'Label': len(df_B)}])
            df_graph = pd.concat([df_graph, new_record], ignore_index=True)

    print('')
    print('Max RBO:', max_RBO)
    print('Min RBO:', min_RBO)
    print('')
    for r in rbos.keys():
        print(r, 'Stdev:', round(stdev(rbos[r]), 3), 'Range:', minmax(rbos[r]))
        print('')

    ax = sns.barplot(x='Demo', y='RBO', hue='Goal', data=df_graph)
    if remove_other_demos:
        for i, bar in enumerate(ax.patches[0:len(df_graph)]):
            bar_value = df_graph['Label'].iloc[i]
            text_x = bar.get_x() + bar.get_width() / 2
            text_y = bar.get_y() + bar.get_height()

            ax.text(text_x, text_y, bar_value,
                    ha='center', va='bottom', size=10)

    ax.set_xticklabels(ax.get_xticklabels(), rotation=45, ha='right')
    plt.xlabel('Demographics')
    plt.ylim([0.5, 1])
    sns.despine()
    plt.legend(loc='upper center', bbox_to_anchor=(0.5, -0.25), ncol=5)
    plt.show()


if __name__ == "__main__":
    # remove_other_demos should be True if MHSG or PHSG, otherwise False
    plot_RBO(demos_overall, remove_other_demos=False)
