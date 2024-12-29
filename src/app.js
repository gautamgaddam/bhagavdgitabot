const cron = require("node-cron");
const twitterService = require("./services/twitter.service");
const verses = require("./data/verse").default;
const logger = require("./utils/logger");

// Function to get a random verse
function getRandomVerse() {
  return verses[Math.floor(Math.random() * verses.length)];
}

// Function to post tweet
async function postDailyVerse() {
  try {
    const verse = getRandomVerse();
    await twitterService.postTweet(verse);
    logger.info(`Daily verse ${verse.verse_number} posted successfully`);
  } catch (error) {
    logger.error("Error posting daily verse:", error);
  }
}

// Schedule the tweet to be posted every day at 6 AM
cron.schedule("0 6 * * *", () => {
  postDailyVerse();
});

// Initial post on startup (optional)
postDailyVerse();

logger.info("Gita Twitter Bot started successfully");
