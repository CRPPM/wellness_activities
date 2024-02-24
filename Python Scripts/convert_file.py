import pandas as pd
import numpy as np
import os

import warnings
warnings.filterwarnings("ignore")

df = pd.read_spss("../Raw Data/WellnessActivities2.23.24.sav")

# goals = ['Sleep', 'Phys', 'Emo', 'Product', 'Social']
goals = ['Phys']
dontuse = ['SleepAlc', 'SleepCaf', 'SleepNaps', 'SleepTime', 'SleepRoutine', 'SleepEnviron', 'SleepAvoidMeals',
           'EmoClothes', 'EmoWater', 'PhysSleep', 'PhysDr', 'PhysAlc', 'PhysWater', 'ProductConsistent',
           'ProductSilent', 'ProductEliminate', 'ProductAskHelp', 'ProductClothes', 'ProductWater', 'ProductMusic',
           'SocialJoin', 'SocialAskHelp', 'SocialDistance', 'SocialGreet', 'SocialSleep', 'SocialMedia']
dontusetime = [d + 'Time' for d in dontuse]
dontusefreq = [d + 'Freq' for d in dontuse]


questions = {
    # Sleep
    "SleepAlc": "limiting alcohol consumption",
    "SleepCaf": "limiting caffeine consumption",
    "SleepNaps": "avoiding naps",
    "SleepTime": "sticking to consistent sleep/wake times",
    "SleepRoutine": "sticking to a nightly routine",
    "SleepEnviron": "sleeping in a dark, quiet, comfortable environment",
    "SleepSched": "creating a schedule or plan for the next day",
    "SleepMed": "meditating/practicing mindfulness",
    "SleepNatSound": "listening to nature sounds or white noise",
    "SleepShow": "taking a restorative shower or bath",
    "SleepExMod": "exercising moderately (running, biking, lifting weights)",
    "SleepEarly": "going to bed earlier by __ mins",
    "SleepScreen": "turning off screens __ mins before bed",
    "SleepRead": "reading or listening to a podcast",
    "SleepMusic": "listening to relaxing music",
    "SleepBreaths": "taking some deep breaths",
    "SleepAvoidMeals": "avoiding large meals",
    "SleepYoga": "practicing yoga/stretching your body",
    "SleepBed": "making your bed",
    "SleepPray": "praying/reading religious texts",
    "SleepExLight": "exercising lightly (walking, dancing)",
    "SleepVis": "visualizing your happy place",
    "SleepNat": "spending time in nature",
    "SleepHealthyMeal": "eating a healthy, balanced meal",
    "SleepSun": "spending time in the sun",

    # Emotional
    "EmoCook": "cooking or baking",
    "EmoTherapist": "talking to or seeking out a mental health professional",
    "EmoTV": "watching a TV show, movie, or reading to relax",
    "EmoVolunteer": "volunteering in your community",
    "EmoPets": "playing with your pets",
    "EmoMusic": "listening to music",
    "EmoNature": "spending time in nature",
    "EmoDistract": "distracting yourself from a negative mood with a brief, funny video",
    "EmoFriend": "spending in-person time with loved ones or friends",
    "EmoModerateEx": "exercising moderately (running, biking, lifting weights)",
    "EmoGrateful": "thinking or writing about 3 things you are grateful for",
    "EmoMeditate": "meditating/practicing mindfulness",
    "EmoSun": "spending time in the sun",
    "EmoTreat": "treating yourself to a delicious snack or drink",
    "EmoNatureSounds": "listening to nature sounds or white noise",
    "EmoConfide": "confiding in a friend and expressing your feelings",
    "EmoBreaths": "taking some deep breaths",
    "EmoClean": "cleaning and organizing your space",
    "EmoClothes": "changing into comfortable clothing",
    "EmoCall": "texting/calling a loved one or friend",
    "EmoPray": "praying/reading religious texts",
    "EmoShower": "taking a restorative shower or bath",
    "EmoEat": "eating a healthy, balanced meal",
    "EmoYoga": "practicing yoga/stretching your body",
    "EmoWater": "drinking plenty of water",
    
    # Physical
    "PhysPets": "playing with your pets",
    "PhysSleep": "sticking to consistent sleep/wake times",
    "PhysLegs": "elevating your legs",
    "PhysDr": "talking to or seeking out a health care professional",
    "PhysFriend": "spending in-person time with loved ones or friends",
    "PhysAlc": "limiting alcohol consumption",
    "PhysStairs": "taking the stairs when possible",
    "PhysWater": "drinking plenty of water",
    "PhysModerateEx": "exercising moderately (running, biking, lifting weights)",
    "PhysCook": "cooking or baking",
    "PhysYoga": "practicing yoga",
    "PhysNature": "spending time in nature",
    "PhysSun": "spending time in the sun",
    "PhysLightEx": "exercising lightly (walking, dancing)",
    "PhysShower": "taking a restorative shower or bath",
    "PhysBreaths": "taking some deep breaths",
    "PhysNap": "taking a power nap (about an hour)",
    "PhysMusic": "listening to music while exercising",
    "PhysIntenseEx": "exercising intensely (HIIT, sprints, jump rope)",
    "PhysMeditate": "meditating/practicing mindfulness",
    "PhysStretch": "stretching",
    "PhysTreat": "treating yourself to a delicious snack or drink",
    "PhysStand": "taking breaks from sitting",
    "PhysEarlierBed": "going to bed earlier by __ mins",
    "PhysPray": "praying/reading religious texts",
    
    # Productivity
    "ProductConsistent": "sticking to consistent sleep/wake times",
    "ProductPhone": "putting your phone away/on do not disturb",
    "ProductSilent": "creating a silent environment",
    "ProductEliminate": "eliminating less important tasks and commitments from your schedule",
    "ProductWork": "scheduling time for uninterrupted work",
    "ProductBed": "making your bed to start your day",
    "ProductAskHelp": "asking for help from your support network",
    "ProductMeetings": "scheduling regular meetings with your coworkers",
    "ProductList": "writing down a list of your priorities",
    "ProductSchedule": "creating a schedule or plan",
    "ProductBreak": "taking planned breaks",
    "ProductOneTask": "tackling a task on your to-do list",
    "ProductSwitch": "switching tasks when you get stuck",
    "ProductClean": "cleaning and organizing your working space",
    "ProductClothes": "changing into appropriate clothes",
    "ProductPutOff": "scheduling something you've been putting off",
    "ProductWater": "drinking plenty of water",
    "ProductMusic": "listening to music while working",
    "ProductEat": "eating a healthy, balanced meal",
    "ProductModerateEx": "exercising moderately (running, biking, lifting weights)",
    "ProductNature": "spending time in nature",
    "ProductBreaths": "taking some deep breaths",
    "ProductMeditate": "meditating/practicing mindfulness",
    "ProductSun": "spending time in the sun",
    "ProductLightEx": "exercising lightly (walking, stretching, dancing)",

    # Social Wellness
    "SocialJoin": "joining a group focused on a favorite hobby",
    "SocialReligion": "participating in a religious or cultural group",
    "SocialVolunteer": "volunteering in your community",
    "SocialCall": "texting/calling a loved one or friend",
    "SocialPhone": "putting your phone on do not disturb",
    "SocialPublic": "routinely visiting a public space (coffee shop, park, farmer's market)",
    "SocialWorries": "telling someone your worries/expressing your feelings",
    "SocialMeditate": "meditating/practicing mindfulness",
    "SocialEat": "eating a healthy, balanced meal",
    "SocialConfide": "confiding in a friend and expressing your feelings",
    "SocialMedia": "limiting social media use",
    "SocialMentor": "finding opportunities to mentor, coach, or teach others",
    "SocialVacation": "planning a vacation with loved ones or friends",
    "SocialTherapist": "talking to or seeking out a mental health professional",
    "SocialReachout": "reaching out to someone you haven't talked to in a while",
    "SocialSchedule": "planning free time in your schedule",
    "SocialJoinOnline": "joining an online community (Facebook groups, virtual book club)"
    }

for g in goals:
    print('Goal:', g)
    # print(questions)
    df_goal = df.loc[df[g + 'Goal'] != 0]
    print('Total Individuals:', len(df_goal))

    act_cols = [col for col in df_goal if col.startswith(g) and '_' not in col and col != g + 'Goal' and col not in dontuse]
    act_cols = act_cols[0:25 - len([n for n in dontuse if n.startswith(g)])]
    duration_cols = [col for col in df_goal if col.startswith(g) and sum(map(str.isupper, col)) >= 3 and col.endswith('TimeW') and col not in dontusetime]
    freq_cols = [col for col in df_goal if col.startswith(g) and sum(map(str.isupper, col)) >= 3 and col.endswith('FreqW') and col not in dontusefreq]

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
    df_final['Duration_sum'] = df_duration.sum().values
    df_final['Duration_total'] = df_duration.count().values
    df_final['Frequency (days)'] = df_freq.mean().values
    df_final = df_final.sort_values(by ='Count', ascending=False)

    # df_acts.apply(updating_verbs)

    # df_final.rename(index=questions, inplace=True)
    # print(df_final)

    df_duration
    # if not os.path.exists('../outputtest2.xlsx'):
        # df_final.to_excel("../outputtest2.xlsx", sheet_name=g)
    # else:
    #     with pd.ExcelWriter('../outputtest.xlsx', mode='a') as writer:  
    #         df_final.to_excel(writer, sheet_name=g)

    # print('')
    # df_final.to_json(g + ".json", orient="table")
    # exit()



# df.to_csv("../Raw Data/WellnessActivities2.21.24.csv")