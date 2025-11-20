#!/usr/bin/env python3
"""
AI News Agent - Automatically fetches and updates portfolio with AI news monthly
"""

import os
import json
import re
from datetime import datetime
from typing import Dict, Optional
import requests
from openai import OpenAI
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class AINewsAgent:
    """Agent that finds relevant AI news and updates the portfolio website"""

    def __init__(self):
        # Load environment variables
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.pushover_user = os.getenv('PUSHOVER_USER')
        self.pushover_token = os.getenv('PUSHOVER_TOKEN')

        # Validate environment variables (Brave API no longer needed)
        if not all([self.openai_api_key, self.pushover_user, self.pushover_token]):
            raise ValueError("Missing required environment variables")

        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=self.openai_api_key)

    def find_ai_news_with_search(self) -> Optional[Dict]:
        """Use OpenAI Responses API with native web search to find AI news"""
        current_month = datetime.now().strftime("%B %Y")
        current_date = datetime.now().strftime("%B %d, %Y")

        try:
            logger.info(f"Using OpenAI web search to find AI news for {current_month}")

            response = self.openai_client.responses.create(
                model="gpt-4o-mini",
                tools=[{
                    "type": "web_search_preview",
                    "search_context_size": "high"  # More thorough search
                }],
                input=f"""Today is {current_date}.

CRITICAL: You MUST find AI news published in {current_month}. Do NOT select news from earlier months.

Search the web for the most recent and significant AI research breakthrough or development published in {current_month}.

Search Strategy:
1. Search for: "AI breakthrough {current_month}" OR "AI research {current_month}" OR "artificial intelligence discovery {current_month}"
2. Focus on these sources: Science Daily, Nature, arXiv, MIT News, IEEE Spectrum, Stanford News
3. Filter publication dates - ONLY {current_month}

Requirements:
- MUST be from {current_month} (verify publication date)
- Academic/research focus (NOT business, startups, funding, stocks)
- From reputable scientific sources
- Significant development (even if incremental - ANY research from this month counts)

If you find MULTIPLE items from {current_month}, select the most significant one.
If you find NO items from {current_month}, search for "latest AI research" and find the MOST RECENT available, noting the actual date.

Return ONLY valid JSON (no markdown, no formatting):

{{
    "title": "exact headline",
    "summary": "one sentence: [specific breakthrough] enabling [impact]",
    "url": "full source URL",
    "publication_date": "exact date found",
    "verified_current_month": true/false
}}

Example summary: "Researchers achieved 99.2% accuracy in real-time translation across 200 languages using a new transformer architecture, enabling instant cross-language communication"
"""
            )

            # Parse the response
            response_text = response.output_text.strip()
            logger.info(f"OpenAI search response: {response_text}")

            # Extract JSON if wrapped in markdown
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            elif response_text.startswith("```") and response_text.endswith("```"):
                response_text = response_text[3:-3].strip()

            result = json.loads(response_text)

            # Validate result has required fields
            if not all(key in result for key in ['title', 'summary', 'url']):
                raise ValueError("Response missing required fields")

            logger.info(f"Found news: {result['title']}")
            return result

        except Exception as e:
            logger.error(f"Error finding AI news with web search: {e}")
            raise

    def update_portfolio_html(self, news_item: Dict) -> bool:
        """Update the index.html file with the new AI news"""
        try:
            # Read the current HTML file
            with open('index.html', 'r', encoding='utf-8') as f:
                html_content = f.read()

            # Create the new news content
            new_content = f"""<h3>AI News of the month</h3>
                        <div class="footer-links">
                          <p>
                            {news_item['summary']}
                            <a href="{news_item['url']}" target="_blank" rel="noopener noreferrer" class="ai-news-link">
                              Read more →
                            </a>
                          </p>
                        </div>"""

            # Find and replace the AI News section
            pattern = r'<h3>AI News of the month</h3>.*?</div>\s*</div>'
            replacement = new_content + '\n                      </div>'

            updated_html = re.sub(pattern, replacement, html_content,
                                flags=re.DOTALL)

            # Write the updated content back
            with open('index.html', 'w', encoding='utf-8') as f:
                f.write(updated_html)

            logger.info(f"Successfully updated portfolio with news: {news_item['title']}")
            return True

        except Exception as e:
            logger.error(f"Error updating HTML file: {e}")
            return False

    def send_notification(self, news_item: Dict, success: bool) -> None:
        """Send Pushover notification about the update"""
        url = "https://api.pushover.net/1/messages.json"

        if success:
            title = "✅ Portfolio Updated with AI News"
            message = f"Successfully updated your portfolio with:\n\n{news_item['title']}\n\n{news_item['summary']}"
        else:
            title = "❌ Portfolio Update Failed"
            message = "Failed to update the portfolio with new AI news. Please check the logs."

        data = {
            "token": self.pushover_token,
            "user": self.pushover_user,
            "title": title,
            "message": message,
            "priority": 0,
            "timestamp": int(datetime.now().timestamp())
        }

        try:
            response = requests.post(url, data=data)
            response.raise_for_status()
            logger.info("Notification sent successfully")
        except requests.RequestException as e:
            logger.error(f"Error sending notification: {e}")

    def run(self) -> None:
        """Main execution flow with fallback to keep existing news on failure"""
        logger.info(f"Starting AI News Agent - {datetime.now()}")

        try:
            # Search for AI news using OpenAI web search
            logger.info("Searching for AI news using OpenAI web search...")
            news_item = self.find_ai_news_with_search()

            if not news_item:
                raise ValueError("No suitable news item found")

            logger.info(f"Found: {news_item['title']}")

            # Update the portfolio
            logger.info("Updating portfolio HTML...")
            success = self.update_portfolio_html(news_item)

            if not success:
                raise RuntimeError("Failed to update portfolio HTML")

            # Send success notification
            self.send_notification(news_item, True)
            logger.info("AI News Agent completed successfully")

        except Exception as e:
            logger.error(f"AI News Agent failed: {e}")
            logger.info("FALLBACK: Keeping existing AI news (no changes made)")

            # Send failure notification with fallback message
            failure_message = {
                'title': 'Update Failed - Keeping Existing News',
                'summary': f"Error: {str(e)}. The existing AI news will remain unchanged."
            }
            self.send_notification(failure_message, False)

            # Don't raise - allow workflow to complete without changes
            # This ensures existing news stays on the website


def main():
    """Entry point for the script"""
    # Load .env file if it exists (for local testing)
    if Path('.env').exists():
        from dotenv import load_dotenv
        load_dotenv()

    agent = AINewsAgent()
    agent.run()


if __name__ == "__main__":
    main()
