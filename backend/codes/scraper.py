import feedparser
import json
import os
from datetime import datetime
import hashlib
import en_core_web_sm

# Load spaCy model
nlp = en_core_web_sm.load()

# RSS feed URLs
RSS_FEEDS = {
    "TOI Pune": "https://timesofindia.indiatimes.com/rssfeeds/-2128821991.cms",
    "Hindustan Times Pune": "https://www.hindustantimes.com/feeds/rss/cities/pune-news/rssfeed.xml",
    "Indian Express Pune": "https://indianexpress.com/section/cities/pune/feed/",
    "Pune Mirror": "https://punemirror.com/feed/"
}

# Crime keywords
CRIME_KEYWORDS = [
    "theft", "robbery", "assault", "murder", "kidnap", "chain snatching",
    "burglary", "violence", "rape", "molestation", "fraud", "attack",
    "shooting", "arrested", "gang", "गुन्हा", "चोरी", "हत्या", "लुट", "अपहरण"
]

# Gazetteer of Pune localities
PUNE_LOCALITIES = [
    "FC Road", "JM Road", "Koregaon Park", "Koregaon Park Lane 5",
    "Shivajinagar", "Wakad", "Baner", "Hinjewadi", "Aundh",
    "Kothrud", "Swargate", "Hadapsar", "Katraj", "Bibvewadi",
    "Viman Nagar", "Yerwada", "Pimpri", "Chinchwad", "Nigdi",
    "Camp", "Laxmi Road", "Sinhagad Road" ,"Alandi"
]

OUTPUT_FILE = "crime_locations.json"


def is_crime_related(text):
    text = text.lower()
    return any(kw in text for kw in CRIME_KEYWORDS)


def extract_location(text):
    """Extract sub-location (ignore generic 'Pune')."""
    locations = []

    # Gazetteer check
    for loc in PUNE_LOCALITIES:
        if loc.lower() in text.lower():
            locations.append(loc)

    # spaCy NER
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ in ["GPE", "LOC"]:
            if ent.text.lower() != "pune":  # ignore plain Pune
                locations.append(ent.text)

    return ", ".join(set(locations)) if locations else None


def make_id(entry):
    """Unique hash based on summary+link"""
    text = entry.get("summary", "") + entry.get("link", "")
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def load_existing():
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def fetch_feed(name, url, existing_ids):
    feed = feedparser.parse(url)
    articles = []

    for entry in feed.entries:
        title = entry.get("title", "")
        summary = entry.get("summary", "")
        full_text = title + " " + summary

        if is_crime_related(full_text):
            location = extract_location(full_text)
            if location:  # only keep if specific location found
                article = {
                    "id": make_id(entry),
                    "location_string": location,
                    "summary": summary,
                    "link": entry.get("link", ""),
                    "source": name,
                    "timestamp": datetime.utcnow().isoformat()
                }
                if article["id"] not in existing_ids:
                    articles.append(article)
                    print(f"[+] {location} | {summary[:60]}...")

    return articles


def run_scraper():
    print(f"=== Running Crime Scraper @ {datetime.utcnow()} ===")

    existing = load_existing()
    existing_ids = {a["id"] for a in existing}

    new_articles = []
    for name, url in RSS_FEEDS.items():
        new_articles.extend(fetch_feed(name, url, existing_ids))

    if new_articles:
        all_articles = existing + new_articles
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(all_articles, f, ensure_ascii=False, indent=2)
        print(f"[✓] Added {len(new_articles)} new articles. Total now: {len(all_articles)}")
    else:
        print("[=] No new articles found.")


if __name__ == "__main__":
    run_scraper()
