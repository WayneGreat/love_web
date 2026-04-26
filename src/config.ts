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
    signature?: string;
    footer: string;
}

export interface PastLetter {
    date: string;
    body: string;
}

export interface SiteConfig {
    bgMusic: string;
    themeColor: ThemeColor;
    intro: IntroConfig;
    timeline: TimelineEntry[];
    pastLetters: PastLetter[];
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
    pastLetters: [
        {
            date: "2023-08-15",
            // body: "亲爱的，\n\n这是我们的第一个七夕节。\n我永远不会忘记那一天的星空和你在灯光下的笑容。",
            body: "最漂亮的林同学Lydia\n\n很开心有缘与你相识，对你的心动从第一次见面就开始了，因为你笑起来真好看。在与你交流的这段时间，你的乐观开朗，独立勇敢，幽默的性格吸引着我，甚至已经开始期待每天的哈哈哈。520快乐，祝永远年轻漂亮，工作愉快顺利。\n\n喜欢你的Wayne",
        },
        {
            date: "2024-02-14",
            body: "情人节快乐！\n\n第一次和你一起过西方的情人节，\n玫瑰和巧克力都不及你的万分之一甜。",
        },
        {
            date: "2024-08-10",
            body: "又一起走过了一年。\n\n时间飞逝，但每一秒因为有你而变得珍贵。\n期待下一个和你在一起的春夏秋冬。",
        },
    ],
    letter: {
        title: "给你的一封信",
        // body: "亲爱的，\n\n从我们相遇的那天起，每一天都变得特别。感谢你一直以来的陪伴和理解，让我成为了更好的人。\n\n未来的路，我们一起走。\n\n永远爱你的",
        body: `亲爱的靓靓姐姐：
        写这封信的时候，脑海里闪过的全是我们一起走过的点点滴滴。
        从第一次遇见你的心跳加速，到现在习惯了每天有你的陪伴，我才明白，原来幸福就是这么简单。
        谢谢你出现在我的生命里，谢谢你给我带来的所有快乐和感动。
        尽管我们相处之中有一些不愉快，但我会做出改变，变得成熟，让你有安全感
        未来的路还很长，我想一直牵着你的手走下去。`,
        signature: `爱你的小狗  \n${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日`,
        footer: "愿我们的故事一直继续下去 ✨",
    },
};

export default siteConfig;
