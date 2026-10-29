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

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;

    // গ্লোবাল অবজেক্টে আগের ডেটা সেভ করা আছে কিনা চেক করা
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
      
