import plotly.graph_objects as go
import pandas as pd

country = ['Male/Female', 'Heterosexual/Sexual Minority',
           'Emotional Health', 'Productivity', 'Social']
colors_outline = ["#7EC8BC", "#EDE1AB", "#99C2FF", "#D1B59E", "#FF9B70"]
colors_fill = ['rgba(126, 200, 188, 0.9)', 'rgba(237, 225, 171, 0.9)',
               'rgba(153, 194, 255, 0.9)', 'rgba(209, 181, 158, 0.9)', 'rgba(255, 155, 112, 0.9)']


def add_demo(fig, col1, col2):
    name = col1.name + '/' + col2.name

    fig.add_trace(go.Scatter(
        x=col1.values * 100,
        y=[name] * len(col1),
        marker=dict(
            color=colors_fill,

        ),
    ))

    fig.add_trace(go.Scatter(
        x=col2.values * 100,
        y=[name] * len(col2),
        marker=dict(
            color='rgba(255, 255, 255, 0.9)',
            line=dict(
                color=colors_fill,
                width=3
            )
        ),
    ))


def plot_preferences():
    df = pd.read_csv("../Raw Data/preferences_by_demo.csv")
    df.set_index('Goal', inplace=True)

    fig = go.Figure()
    df = df[df.columns[::-1]]
    for i in range(0, len(df.columns), 2):
        add_demo(fig, df[df.columns[i+1]], df[df.columns[i]])

    fig.update_traces(mode='markers+text', marker=dict(
        symbol='circle', size=16))
    fig.update_layout(
        xaxis=dict(
            showgrid=False,
            showline=True,
            linecolor='rgb(102, 102, 102)',
            tickfont_color='rgb(102, 102, 102)',
            tickfont_size=14,
            showticklabels=True,
            dtick=10,
            ticks='outside',
            tickcolor='rgb(102, 102, 102)',
            title="Percentage (%)",
            titlefont_size=16,
        ),
        yaxis=dict(
            title="Demographics",
            titlefont_size=16,
            showgrid=True,
            gridwidth=1,
            gridcolor='black',
            tickfont_size=14,
            ticksuffix=' ',
        ),


        margin=dict(l=140, r=40, b=50, t=80),
        showlegend=False,
        width=1200,
        height=700,
        paper_bgcolor='white',
        plot_bgcolor='white',
        hovermode='closest',
    )
    fig.show()


if __name__ == "__main__":
    plot_preferences()
