import pandas as pd
import numpy as np
import os

import warnings
warnings.filterwarnings("ignore")

df = pd.read_spss("../Raw Data/WellnessActivities2.23.24.sav")

goals = ['Sleep', 'Phys', 'Emo', 'Product', 'Social']
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
    "ProductConsistent": "sticking to consistent sleep/wake times",
    "ProductPhone": "putting your phone away/on 'do not disturb'",
    "ProductSilent": "creating a silent environment",
    "ProductEliminate": "eliminating less important tasks and commitments from your schedule",
    "ProductWork": "scheduling time for uninterrupted work",
    "ProductBed": "making your bed to start your day",
    "ProductAskHelp": "asking for help from your support network",
    "ProductMeeting": "scheduling regular meetings with your coworkers",
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

    # Social
    "SocialJoin": "joining a group focused on a favorite hobby",
    "SocialReligion": "participating in a religious or cultural group",
    "SocialVolunteer": "volunteering in your community",
    "SocialCall": "texting/calling a loved one or friend",
    "SocialFriend": "spending in-person time with loved ones or friends",
    "SocialMeal": "sharing a meal with friend or family",
    "SocialAskHelp": "asking for help from your support network",
    "SocialDistance": "distancing yourself from someone toxic (unfollowing them on social media, saying no to an invite)",
    "SocialGreet": "greeting and introducing yourself to strangers",
    "SocialPets": "taking your dog to the park",
    "SocialSleep": "sticking to consistent sleep/wake times",
    "SocialGrateful": "expressing your gratitude to someone you care about",
    "SocialPhone": "putting your phone on 'do not disturb'",
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


act_cols = []
for g in goals:
    print('Goal:', g)
    df_goal = df.loc[df[g + 'Goal'] != 0]
    print('Total Individuals:', len(df_goal))

    act_cols.extend([col for col in df_goal if col.startswith(g) 
                     and '_' not in col
                     # and col != g + 'Goal'
                     # and col not in dontuse
                     and not any(n in col for n in ('26', '27', '28', '29', '30'))
                     and col not in [n + 'Time' for n in list(questions.keys()) if n.startswith(g)]
                     and col not in [n + 'Freq' for n in list(questions.keys()) if n.startswith(g)]])
                     # and col not in [n + 'TimeW' for n in dontuse if n.startswith(g)]
                     # and col not in [n + 'FreqW' for n in dontuse if n.startswith(g)]])

df_acts = df[act_cols]
df_acts.replace(0, np.nan, inplace=True)
df_acts = pd.concat([df_acts, df.loc[:, ["GenderB", "sexorB", "raceB", "incomeB", "locationB", "MHSG", "PHSG", "BFIExtraHi"]]], axis=1)
df_acts['ageG'] = df['age'].apply(lambda x: 1 if x >= 18 and x <= 29 else (2 if x >= 30 and x <= 49 else 3))

df_acts.to_json("activities.json", orient="table")
