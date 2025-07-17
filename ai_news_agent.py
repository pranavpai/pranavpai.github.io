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
        self.brave_api_key = os.getenv('BRAVE_API_KEY')
        self.pushover_user = os.getenv('PUSHOVER_USER')
        self.pushover_token = os.getenv('PUSHOVER_TOKEN')
        
        # Validate environment variables
        if not all([self.openai_api_key, self.brave_api_key, 
                   self.pushover_user, self.pushover_token]):
            raise ValueError("Missing required environment variables")
        
        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=self.openai_api_key)
        
    def search_ai_news(self) -> Dict:
        """Search for recent AI news using Brave Search API"""
        url = "https://api.search.brave.com/res/v1/web/search"
        
        # Search for general AI news from the current month
        current_month = datetime.now().strftime("%B %Y")
        query = f"AI breakthrough discovery research {current_month} accuracy performance model -company -startup -funding -stock"
        
        headers = {
            "Accept": "application/json",
            "X-Subscription-Token": self.brave_api_key
        }
        
        params = {
            "q": query,
            "count": 10,
            "freshness": "pm",  # Past month
            "text_decorations": False,
            "search_lang": "en"
        }
        
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error searching for news: {e}")
            raise
    
    def select_best_news(self, search_results: Dict) -> Optional[Dict]:
        """Use OpenAI to select the most relevant and interesting AI news"""
        if not search_results.get('web', {}).get('results'):
            logger.warning("No search results found")
            return None
        
        # Prepare search results for OpenAI
        news_items = []
        for idx, result in enumerate(search_results['web']['results'][:5]):
            news_items.append({
                "index": idx,
                "title": result.get('title', ''),
                "description": result.get('description', ''),
                "url": result.get('url', '')
            })
        
        # Create prompt for OpenAI
        current_month = datetime.now().strftime("%B")
        prompt = f"""You are an AI news curator. Select ONE piece of AI news that is most relevant to a general audience and represents a significant breakthrough.

        News items:
        {json.dumps(news_items, indent=2)}

        Respond with ONLY valid JSON (no markdown, no extra text):

        {{
            "selected_index": 0,
            "summary": "{current_month}: ONE medium sentence with specific details and brief impact",
            "reason": "why this was selected"
        }}

        Summary format: "{current_month}: [Specific breakthrough with numbers/names] enabling [brief impact]"
        
        Good example: "July: Researchers achieved 99.2% accuracy in real-time translation across 200 languages using a new transformer, enabling instant communication without internet"
        """
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional AI news curator. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            response_content = response.choices[0].message.content.strip()
            logger.info(f"OpenAI response: {response_content}")
            
            # Try to extract JSON if it's wrapped in markdown or other text
            if "```json" in response_content:
                json_start = response_content.find("```json") + 7
                json_end = response_content.find("```", json_start)
                response_content = response_content[json_start:json_end].strip()
            elif response_content.startswith("```") and response_content.endswith("```"):
                response_content = response_content[3:-3].strip()
            
            result = json.loads(response_content)
            selected_news = news_items[result['selected_index']]
            
            return {
                'title': selected_news['title'],
                'summary': result['summary'],
                'url': selected_news['url'],
                'reason': result['reason']
            }
        except Exception as e:
            logger.error(f"Error selecting news with OpenAI: {e}")
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
                            <a href="{news_item['url']}" target="_blank" rel="noopener noreferrer" 
                               style="color: var(--color-primary); text-decoration: none; 
                                      border-bottom: 1px solid var(--color-primary);">
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
        """Main execution flow"""
        logger.info(f"Starting AI News Agent - {datetime.now()}")
        
        try:
            # Search for AI news
            logger.info("Searching for AI news...")
            search_results = self.search_ai_news()
            
            # Select the best news item
            logger.info("Selecting best news item...")
            news_item = self.select_best_news(search_results)
            
            if not news_item:
                raise ValueError("No suitable news item found")
            
            logger.info(f"Selected: {news_item['title']}")
            logger.info(f"Reason: {news_item['reason']}")
            
            # Update the portfolio
            logger.info("Updating portfolio HTML...")
            success = self.update_portfolio_html(news_item)
            
            # Send notification
            self.send_notification(news_item, success)
            
            if success:
                logger.info("AI News Agent completed successfully")
            else:
                raise RuntimeError("Failed to update portfolio")
                
        except Exception as e:
            logger.error(f"AI News Agent failed: {e}")
            self.send_notification({}, False)
            raise


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