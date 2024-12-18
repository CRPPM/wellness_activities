// [string, exclude time]
export const QUESTIONS = {
    // Sleep
    SleepAlc: ["limiting alcohol consumption", 1],
    SleepCaf: ["limiting caffeine consumption", 1],
    SleepNaps: ["avoiding naps", 1],
    SleepTime: ["sticking to consistent sleep and wake times", 1],
    SleepRoutine: ["sticking to a nightly routine", 1],
    SleepEnviron: ["sleeping in a dark, quiet, comfortable environment", 1],
    SleepSched: ["creating a schedule or plan for the next day", 0],
    SleepMed: ["meditating or practicing mindfulness", 0],
    SleepNatSound: ["listening to nature sounds or white noise", 0],
    SleepShow: ["taking a restorative shower or bath", 0],
    SleepExMod: ["exercising moderately (running, biking, lifting weights)", 0],
    SleepEarly: ["going to bed earlier by __ minutes", 0],
    SleepScreen: ["turning off screens __ minutes before bed", 0],
    SleepRead: ["reading or listening to a podcast", 0],
    SleepMusic: ["listening to relaxing music", 0],
    SleepBreaths: ["taking some deep breaths", 0],
    SleepAvoidMeals: ["avoiding large meals", 1],
    SleepYoga: ["practicing yoga or stretching your body", 0],
    SleepBed: ["making your bed", 0],
    SleepPray: ["praying or reading religious texts", 0],
    SleepExLight: ["exercising lightly (walking, dancing)", 0],
    SleepVis: ["visualizing your happy place", 0],
    SleepNat: ["spending time in nature", 0],
    SleepHealthyMeal: ["eating a healthy, balanced meal", 0],
    SleepSun: ["spending time in the sun", 0],

    // Emotional
    EmoCook: ["cooking or baking", 0],
    EmoTherapist: ["talking to or seeking out a mental health professional", 0],
    EmoTV: ["watching a TV show, movie, or reading to relax", 0],
    EmoVolunteer: ["volunteering in your community", 0],
    EmoPets: ["playing with your pets", 0],
    EmoMusic: ["listening to music", 0],
    EmoNature: ["spending time in nature", 0],
    EmoDistract: [
        "distracting yourself from a negative mood with a brief, funny video",
        0,
    ],
    EmoFriend: ["spending in-person time with loved ones or friends", 0],
    EmoModerateEx: [
        "exercising moderately (running, biking, lifting weights)",
        0,
    ],
    EmoGrateful: ["thinking or writing about 3 things you are grateful for", 0],
    EmoMeditate: ["meditating or practicing mindfulness", 0],
    EmoSun: ["spending time in the sun", 0],
    EmoTreat: ["treating yourself to a delicious snack or drink", 0],
    EmoNatureSounds: ["listening to nature sounds or white noise", 0],
    EmoConfide: ["confiding in a friend and expressing your feelings", 0],
    EmoBreaths: ["taking some deep breaths", 0],
    EmoClean: ["cleaning and organizing your space", 0],
    EmoClothes: ["changing into comfortable clothing", 1],
    EmoCall: ["texting or calling a loved one or friend", 0],
    EmoPray: ["praying or reading religious texts", 0],
    EmoShower: ["taking a restorative shower or bath", 0],
    EmoEat: ["eating a healthy, balanced meal", 0],
    EmoYoga: ["practicing yoga or stretching your body", 0],
    EmoWater: ["drinking plenty of water", 1],

    // Physical
    PhysPets: ["playing with your pets", 0],
    PhysSleep: ["sticking to consistent sleep and wake times", 1],
    PhysLegs: ["elevating your legs", 0],
    PhysDr: ["talking to or seeking out a health care professional", 1],
    PhysFriend: ["spending in-person time with loved ones or friends", 0],
    PhysAlc: ["limiting alcohol consumption", 1],
    PhysStairs: ["taking the stairs when possible", 0],
    PhysWater: ["drinking plenty of water", 1],
    PhysModerateEx: [
        "exercising moderately (running, biking, lifting weights)",
        0,
    ],
    PhysCook: ["cooking or baking", 0],
    PhysYoga: ["practicing yoga", 0],
    PhysNature: ["spending time in nature", 0],
    PhysSun: ["spending time in the sun", 0],
    PhysLightEx: ["exercising lightly (walking, dancing)", 0],
    PhysShower: ["taking a restorative shower or bath", 0],
    PhysBreaths: ["taking some deep breaths", 0],
    PhysNap: ["taking a power nap (about an hour)", 0],
    PhysMusic: ["listening to music while exercising", 0],
    PhysIntenseEx: ["exercising intensely (HIIT, sprints, jump rope)", 0],
    PhysMeditate: ["meditating or practicing mindfulness", 0],
    PhysStretch: ["stretching", 0],
    PhysTreat: ["treating yourself to a delicious snack or drink", 0],
    PhysStand: ["taking breaks from sitting", 0],
    PhysEarlierBed: ["going to bed earlier by __ minutes", 0],
    PhysPray: ["praying or reading religious texts", 0],

    // Productivity
    ProductConsistent: ["sticking to consistent sleep and wake times", 1],
    ProductPhone: ["putting your phone away or on do not disturb", 0],
    ProductSilent: ["creating a silent environment", 1],
    ProductEliminate: [
        "eliminating less important tasks and commitments from your schedule",
        1,
    ],
    ProductWork: ["scheduling time for uninterrupted work", 0],
    ProductBed: ["making your bed to start your day", 0],
    ProductAskHelp: ["asking for help from your support network", 1],
    ProductMeeting: ["scheduling regular meetings with your coworkers", 0],
    ProductList: ["writing down a list of your priorities", 0],
    ProductSchedule: ["creating a schedule or plan", 0],
    ProductBreak: ["taking planned breaks", 0],
    ProductOneTask: ["tackling a task on your to-do list", 0],
    ProductSwitch: ["switching tasks when you get stuck", 0],
    ProductClean: ["cleaning and organizing your working space", 0],
    ProductClothes: ["changing into appropriate clothes", 1],
    ProductPutOff: ["scheduling something you've been putting off", 0],
    ProductWater: ["drinking plenty of water", 1],
    ProductMusic: ["listening to music while working", 1],
    ProductEat: ["eating a healthy, balanced meal", 0],
    ProductModerateEx: [
        "exercising moderately (running, biking, lifting weights)",
        0,
    ],
    ProductNature: ["spending time in nature", 0],
    ProductBreaths: ["taking some deep breaths", 0],
    ProductMeditate: ["meditating or practicing mindfulness", 0],
    ProductSun: ["spending time in the sun", 0],
    ProductLightEx: ["exercising lightly (walking, stretching, dancing)", 0],

    // Social Wellness
    SocialJoin: ["joining a group focused on a favorite hobby", 1],
    SocialReligion: ["participating in a religious or cultural group", 0],
    SocialVolunteer: ["volunteering in your community", 0],
    SocialCall: ["texting or calling a loved one or friend", 0],
    SocialFriend: ["spending in-person time with loved ones or friends", 0],
    SocialMeal: ["sharing a meal with friend or family", 0],
    SocialAskHelp: ["asking for help from your support network", 1],
    SocialDistance: ["distancing yourself from someone toxic", 1],
    SocialGreet: ["greeting and introducing yourself to strangers", 1],
    SocialPets: ["taking your dog to the park", 0],
    SocialSleep: ["sticking to consistent sleep and wake times", 1],
    SocialGrateful: ["expressing your gratitude to someone you care about", 0],
    SocialPhone: ["putting your phone on do not disturb", 0],
    SocialPublic: [
        "routinely visiting a public space (coffee shop, park, farmer's market)",
        0,
    ],
    SocialWorries: [
        "telling someone your worries or expressing your feelings",
        0,
    ],
    SocialMeditate: ["meditating or practicing mindfulness", 0],
    SocialEat: ["eating a healthy, balanced meal", 0],
    SocialConfide: ["confiding in a friend and expressing your feelings", 0],
    SocialMedia: ["limiting social media use", 1],
    SocialMentor: [
        "finding opportunities to mentor, coach, or teach others",
        0,
    ],
    SocialVacation: ["planning a vacation with loved ones or friends", 0],
    SocialTherapist: [
        "talking to or seeking out a mental health professional",
        0,
    ],
    SocialReachout: [
        "reaching out to someone you haven't talked to in a while",
        0,
    ],
    SocialSchedule: ["planning free time in your schedule", 0],
    SocialJoinOnline: ["joining an online community", 0],
};
