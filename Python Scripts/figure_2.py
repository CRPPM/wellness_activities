import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
# import plotly.express as px

sns.set(style='white')
colors = ["#7EC8BC", "#EDE1AB", "#99C2FF", "#D1B59E", "#FF9B70"]
sns.set_palette(sns.color_palette(colors))

desired_order = ['Gender', 'Sexual Orientation', 'Income', 'Age', 'MH Diagnosis',
                 'PH Diagnosis', 'Wearable Use', 'Meditation App Use', 'Extraversion', 'Perseverance']


def get_demo(x):
    match x:
        case 'Men' | 'Women':
            return 'Gender'
        case 'Heterosexual' | 'Sexual Minority':
            return 'Sexual Orientation'
        case 'Low Income' | 'High Income':
            return 'Income'
        case 'Under 30 Years' | 'Over 50 Years':
            return 'Age'
        case 'MH Diagnosis' | 'No MH Diagnosis':
            return 'MH Diagnosis'
        case 'PH Diagnosis' | 'No PH Diagnosis':
            return 'PH Diagnosis'
        case 'Wearable Use' | 'No Wearable Use':
            return 'Wearable Use'
        case 'Meditation App Use' | 'No Meditation App Use':
            return 'Meditation App Use'
        case 'High Extraversion' | 'Low Extraversion':
            return 'Extraversion'
        case 'High Perseverance' | 'Low Perseverance':
            return 'Perseverance'
    print(x)


def categorize_demo_subset(x):
    match x:
        case 'Men' | 'Heterosexual' | 'Low Income' | 'Under 30 Years' | 'MH Diagnosis' | 'PH Diagnosis' | 'Wearable Use' | 'Meditation App Use' | 'High Extraversion' | 'High Perseverance':
            return 0
    return 1


def subtract_demos(x):

    cols = ['Men', 'Heterosexual', 'Low Income', 'Under 30 Years', 'MH Diagnosis', 'PH Diagnosis',
            'Wearable Use', 'Meditation App Use', 'High Extraversion', 'High Perseverance']
    difference = x.loc[x['Demographic Subset'].isin(
        cols), 'Percentage (%)'].values[0] - x.loc[~x['Demographic Subset'].isin(cols), 'Percentage (%)'].values[0]

    return pd.Series([x.iloc[0]['Goal'], x.iloc[0]['Demographic'], difference], index=['Goal', 'Demographic', 'Percent Difference (%)'])


def plot_preferences():
    df = pd.read_csv("../Raw Data/preferences_by_demo.csv")
    df = df.melt(id_vars=['Goal'], value_vars=[
                 col for col in df.columns if col != 'Goal'], var_name='Demographic Subset', value_name='Percentage (%)')
    df['Demographic'] = df.apply(
        lambda x: get_demo(x['Demographic Subset']), axis=1)

    df['Percentage (%)'] = df['Percentage (%)'] * 100
    df_final = pd.DataFrame()
    grouped = df.groupby(['Demographic', 'Goal'])
    df_final = grouped.apply(
        subtract_demos,  include_groups=True).reset_index(drop=True)
    print(df)
    print(df_final)

    sns.barplot(df_final, x='Demographic', y='Percent Difference (%)',
                hue='Goal', order=desired_order, legend=False)
    plt.axhline(y=0, color='black')
    plt.ylim(-17, 17)
    sns.despine(left=False, right=True, top=True, bottom=True)

    ax = plt.gca()

    # Add light gray background behind every other group of bars
    category_labels = df['Demographic'].unique()
    bar_width = 1  # Adjust as needed
    for i, category_label in enumerate(category_labels):
        if i % 2 == 1:  # Check if it's the second, fourth, etc. category
            left = ax.get_xticks()[i] - bar_width / 2
            right = ax.get_xticks()[i] + bar_width / 2
            ax.axvspan(left, right, color='lightgray', alpha=0.2)

    # Move y tick labels down
    plt.tick_params(axis='x', pad=25)
    plt.show()


if __name__ == "__main__":
    plot_preferences()
