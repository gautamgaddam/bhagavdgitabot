// src/services/twitter.service.js
const { TwitterApi } = require("twitter-api-v2");
const config = require("../config/twitter.config");
const logger = require("../utils/logger");

class TwitterService {
  constructor() {
    try {
      this.client = new TwitterApi({
        appKey: config.apiKey,
        appSecret: config.apiSecret,
        accessToken: config.accessToken,
        accessSecret: config.accessSecret,
      });

      // Get read-write client
      this.rwClient = this.client.readWrite;

      // Verify credentials on startup
      this.verifyCredentials();
    } catch (error) {
      logger.error("Error initializing Twitter client:", error);
      throw error;
    }
  }

  async verifyCredentials() {
    try {
      const result = await this.client.v2.me();
      logger.info(
        `Twitter client initialized for user: ${result.data.username}`
      );
    } catch (error) {
      logger.error("Error verifying Twitter credentials:", error);
      throw error;
    }
  }

  async postTweet(verse) {
    try {
      const tweet = `🕉 Daily Wisdom from Bhagavad Gita 📖\n\nVerse ${verse.verse_number}\n\n${verse.sanskrit}\n\n${verse.english}\n\n#BhagavadGita #Krishna #Spirituality`;

      const response = await this.rwClient.v2.tweet(tweet);
      logger.info(`Tweet posted successfully: ${response.data.id}`);
      return response;
    } catch (error) {
      if (error.code === 403) {
        logger.error(
          "Authorization Error: Please check app permissions and tokens"
        );
      } else if (error.code === 429) {
        logger.error("Rate limit exceeded");
      }
      logger.error("Error details:", error.data);
      throw error;
    }
  }
}

module.exports = new TwitterService();
