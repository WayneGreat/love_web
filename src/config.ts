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

export interface PasswordGateConfig {
    title: string;
    subtitle: string;
    placeholder: string;
    buttonText: string;
    errorText: string;
    ariaLabel: string;
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
    password: string;
    passwordGate: PasswordGateConfig;
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
            date: "2025-05-02",
            title: "第一次见面",
            desc: "那天天气很好，我还记得你穿着白色裤子搭配吊带上衣，笑起来是那么阳光灿烂。",
            image: "images/pic1.png",
        },
        {
            date: "2025-05-30",
            title: "第一次约会",
            desc: "我们一起吃漂亮饭、看电影，逛博物馆，聊天也聊的很晚。恋爱的感觉让人愉悦。",
            image: "images/pic2.png",
        },
        {
            date: "2025-08-29",
            title: "第一个七夕节",
            desc: "那晚错过烛光晚餐，但送你喜欢的香水写下爱意，期待后面与你相处的美好日子。",
            image: "images/pic3.png",
        },
        {
            date: "2025-10-03",
            title: "第一次旅行",
            desc: "首次远行至海南，享受海浪沙滩椰子鸡，旅途充满欢声笑语，至今令我们心心念念",
            image: "images/pic4.png",
        },
        {
            date: "2025-12-25",
            title: "第一个圣诞节",
            desc: "为庆祝节日气氛，逛圣诞集市买装饰，拍了许多漂亮合照，记录下两人甜蜜的关系",
            image: "images/pic5.png",
        },
        {
            date: "2026-02-19",
            title: "第一个春节",
            desc: "春节到你家见到热情亲友，逛西湖与十里银滩。也是你本命年，祝你事业马到成功",
            image: "images/pic6.png",
        },
    ],
    pastLetters: [
        {
            date: "",
            body: "最漂亮的林同学Lydia\n\n很开心有缘与你相识，对你的心动从第一次见面就开始了，因为你笑起来真好看。在与你交流的这段时间，你的乐观开朗，独立勇敢，幽默的性格吸引着我，甚至已经开始期待每天的哈哈哈。520快乐，祝永远年轻漂亮，工作愉快顺利。\n\n喜欢你的Wayne",
        },
        {
            date: "",
            body: "天天哈哈哈的静老板：\n\n虽然被你抢先一步，但是我还想送这束花，告诉你：我爱你，并且这份爱会随着时间越来越深。在未来的每一天，我都想陪在你身边，陪你笑，陪你闹，陪你度过每一个日子。希望你天天开心，好好吃饭，多多休息，早日达成梦想❤\n\n喜欢陪你哈哈哈的Way"
        },
        {
            date: "",
            body: "七夕快乐，靓靓姐姐，时间过得很快，我们已经认识119天。虽然相处的大部分时间都是异地聊天，但是这让我格外珍惜每次的线下见面。若如香水一般，期待与愉悦交织。\n\n永远爱你的猪头"
        },
        {
            date: "",
            body: "生日快乐，Lydia！时间可能会改变很多事，但唯一不变的是我对你的爱，遇见你是我这辈子最幸运的事。愿你所有的梦想成真，爱你一辈紫的Wayne"
        },
        {
            date: "",
            body: "My sweet Lydia，\n\nYou have an incredible ability to overcome challenges, and I’m so proud of you. Whenever you need a break, I’m here to help you recharge. If work ever wears you down, take a moment to recharge with me before moving forward. I’m always by your side, every step of the way.\n\nLove always, Wayne"
        },
    ],
    letter: {
        title: "给你的一封信",
        body: `亲爱的靓靓姐姐：
写这封信的时候，脑海里闪过的全是我们一起走过的点点滴滴。
从第一次见面被你笑容吸引，到一起逛博物馆吃漂亮饭；从七夕送你香水写下爱意，到海南的海浪沙滩和椰子鸡；从圣诞集市的合照，到春节去你家见亲友逛西湖……原来我们已经一起积累了这么多闪着光的回忆。
谢谢你出现在我的生命里，谢谢你给我带来的所有快乐和感动。
现在的我已经习惯了每天有你的陪伴，才明白原来幸福就是这么简单。
我会一直努力成长，变成更成熟可靠的人，给你稳稳的安全感和更多甜蜜。
未来的路还很长，我想一直牵着你的手走下去。`,
        signature: `爱你的小狗    \n${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日`,
        footer: "愿我们的故事一直继续下去 ✨",
    },
    password: "lwj0903",
    passwordGate: {
        title: "送给你的礼物",
        subtitle: "请输入密令",
        placeholder: "在这里输入密令...",
        buttonText: "进入",
        errorText: "不正确哦，再猜再猜",
        ariaLabel: "密令输入",
    },
};

export default siteConfig;
