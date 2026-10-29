module.exports.config = {
    name: "restore",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Sami",
    description: "গ্রুপের আগের থিম পুনরায় ফিরিয়ে আনে",
    commandCategory: "group",
    usages: "restore",
    cooldowns: 5
};

// ১. ব্যাকগ্রাউন্ডে গ্রুপের থিম অটো-সেভ করার ইভেন্ট হ্যান্ডলার
module.exports.handleEvent = async ({ api, event }) => {
    const { threadID, logMessageType, logMessageData } = event;
    if (logMessageType === "log:thread-color") {
        if (!global.oldGroupData) global.oldGroupData = {};
        global.oldGroupData[threadID] = {
            themeID: logMessageData.theme_id || logMessageData.color_gradient
        };
    }
};

// ২. কমান্ড রান করার ফাংশন
module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;

    if (!global.oldGroupData || !global.oldGroupData[threadID]) {
        return api.sendMessage("❌ এই গ্রুপের কোনো আগের থিমের ব্যাকআপ আমার কাছে নেই!", threadID, messageID);
    }

    const savedData = global.oldGroupData[threadID];

    try {
        if (savedData.themeID) {
            api.changeThreadTheme(savedData.themeID, threadID, (err) => {
                if (err) {
                    return api.sendMessage("⚠️ থিম রিস্টোর করতে সমস্যা হয়েছে!", threadID, messageID);
                }
                api.sendMessage("✅ গ্রুপের আগের থিম সফলভাবে ফিরিয়ে আনা হয়েছে!", threadID, messageID);
            });
        } else {
            api.sendMessage("❌ রিস্টোর করার মতো কোনো থিম ডাটা পাওয়া যায়নি!", threadID, messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ কিছু একটা সমস্যা হয়েছে!", threadID, messageID);
    }
};
