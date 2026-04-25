export interface TimelineEntry {
    date: string;
    title: string;
    desc: string;
    image: string;
}

export interface ThemeColor {
    primary: string;
    gradientFrom: string;
    gradientTo: string;
}

export interface IntroConfig {
    title: string;
    subtitle: string;
    hint: string;
}

export interface LetterConfig {
    title: string;
    body: string;
    footer: string;
}

export interface SiteConfig {
    bgMusic: string;
    themeColor: ThemeColor;
    intro: IntroConfig;
    timeline: TimelineEntry[];
    letter: LetterConfig;
}

const siteConfig: SiteConfig = {
    bgMusic: "music/bgm.mp3",
    themeColor: {
        primary: "#e91e63",
        gradientFrom: "#fce4ec",
        gradientTo: "#f8bbd0",
    },
    intro: {
        title: "我们的故事",
        subtitle: "从遇见你的那天起",
        hint: "点击开始回忆",
    },
    timeline: [
        {
            date: "2023-05-20",
            title: "第一次见面",
            desc: "那天阳光很好，我们在咖啡店聊了一下午...",
            image: "images/pic1.png",
        },
        {
            date: "2023-06-10",
            title: "第一次约会",
            desc: "紧张又期待，精心准备的第一次正式约会...",
            image: "images/pic2.png",
        },
        {
            date: "2023-08-22",
            title: "第一个七夕节",
            desc: "属于我们的第一个中国情人节，浪漫而难忘...",
            image: "images/pic3.png",
        },
        {
            date: "2023-10-01",
            title: "第一次旅行",
            desc: "我们一起去了海边，看了最美的日落...",
            image: "images/pic4.png",
        },
        {
            date: "2023-12-25",
            title: "第一个圣诞节",
            desc: "在圣诞树下交换礼物，这是最温暖的冬天...",
            image: "images/pic5.png",
        },
        {
            date: "2024-02-10",
            title: "第一个春节",
            desc: "一起守岁看烟花，新的一年也要在一起...",
            image: "images/pic6.png",
        },
    ],
    letter: {
        title: "给你的一封信",
        body: "亲爱的，\n\n从我们相遇的那天起，每一天都变得特别。感谢你一直以来的陪伴和理解，让我成为了更好的人。\n\n未来的路，我们一起走。\n\n永远爱你的",
        footer: "愿我们的故事一直继续下去 ✨",
    },
};

export default siteConfig;
