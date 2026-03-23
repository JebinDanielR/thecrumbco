import json
import re
import random

# (Products will be loaded dynamically within chatbot_response)


# 🧠 Conversational intent patterns
GREETINGS     = ["hi", "hello", "hey", "howdy", "hiya", "good morning", "good evening", "good afternoon"]
THANKS        = ["thank", "thanks", "thank you", "thx", "ty"]
HELP_WORDS    = ["help", "what can you do", "what do you do", "how can you help", "assist"]
BYE_WORDS     = ["bye", "goodbye", "see you", "cya", "take care"]
CONTACT_KEYS  = ["contact", "email", "phone", "address", "location", "reach you", "where are you", "number", "call", "mail"]
DELIVERY_KEYS = ["deliver", "shipping", "order", "home delivery", "ship", "receive"]
HOURS_KEYS    = ["open", "closed", "timing", "hours", "when", "time", "sunday"]
BEST_KEYS     = ["best", "popular", "recommendation", "favorite", "suggest", "top", "good"]
SURPRISE_KEYS = ["surprise", "confused", "suggest something", "pick for me", "random", "anything", "decide"]
BULK_KEYS     = ["bulk", "catering", "birthday", "party", "wedding", "large order", "wholesale", "corporate"]
TIPS_KEYS     = ["tip", "secret", "baking", "how to bake", "recipe", "hack"]
JOKE_KEYS     = ["joke", "funny", "laugh", "make me smile", "humor"]
PRODUCT_KEYS  = ["cookie", "brownie", "cupcake", "dessert", "cheap", "under", "above", "price", "show", "find", "add", "cart"]

BAKING_TIPS = [
    "Always use room temperature butter and eggs for a smoother batter! 🧈",
    "Don't overmix your brownie batter if you want them fudgy! 🍫",
    "Chill your cookie dough for at least 30 minutes before baking to prevent spreading! 🍪",
    "Measure your flour by spooning it into the cup rather than scooping it—it keeps cakes light! 🧁",
    "Add a pinch of salt to your chocolate recipes to make the flavor pop! 🧂"
]

BAKERY_JOKES = [
    "Why did the cookie go to the doctor? Because he was feeling crumb-y! 🍪",
    "What do you call a fake noodle? An impasta... wait, that's pasta. What about: Why did the cake join the team? Because it was a real 'batter' up! 🍰",
    "How does a baker greet their friends? 'Gluten' tag! 🥨",
    "What's a balanced diet? A cookie in each hand! 🍪🍪",
    "Why was the cupcake so happy? Because it was 'frosted' with love! 🧁"
]

import difflib

def correct_and_merge(words, vocabulary):
    corrected = []

    i = 0
    while i < len(words):
        word = words[i]

        # Try merging with next word (cup + cake → cupcake)
        if i < len(words) - 1:
            merged = word + words[i + 1]

            match = difflib.get_close_matches(merged, vocabulary, n=1, cutoff=0.75)
            if match:
                corrected.append(match[0])
                i += 2
                continue

        # Otherwise correct single word
        match = difflib.get_close_matches(word, vocabulary, n=1, cutoff=0.75)
        corrected.append(match[0] if match else word)

        i += 1

    return corrected

def is_product_query(query):
    return any(kw in query for kw in PRODUCT_KEYS) or bool(re.search(r'\d+', query))


def plural(word, count):
    """Return singular or plural form of a word based on count."""
    if count == 1:
        return word
    # Simple English plural rules
    if word.endswith(('s', 'sh', 'ch', 'x', 'z')):
        return word + 'es'
    return word + 's'


def item_count_reply(count, category):
    """Build a natural reply based on count and category."""
    cat_label = category or "item"
    if count == 0:
        return f"Sorry, I couldn't find any {plural(cat_label, 2)} matching that 😔 Try a different filter!"
    elif count == 1:
        return f"Here is 1 {cat_label} for you 🍪"
    else:
        return f"Here are {count} {plural(cat_label, count)} for you 🍪"

def normalize_query(query):
    query = query.lower().strip()

    # Replace hyphens with space
    query = query.replace("-", " ")

    words = query.split()
    normalized = []

    for word in words:
        # plural → singular
        if word.endswith("ies"):
            word = word[:-3] + "y"
        elif word.endswith("s") and len(word) > 3:
            word = word[:-1]

        normalized.append(word)

    return normalized  # return LIST instead of string

def chatbot_response(query):
    # 🔄 Dynamic Load from DB
    import os
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_path, "db.json")
    
    try:
        with open(db_path) as f:
            data = json.load(f)
        products = data["products"]
    except Exception as e:
        print(f"Error loading products: {e}")
        products = []

    words = normalize_query(query)

    # Build vocabulary
    vocabulary = set()
    for p in products:
        w = p["name"].lower().split()
        vocabulary.update(w)
        vocabulary.add("".join(w))  # merged words

    # Fix typos + merge words
    corrected_words = correct_and_merge(words, vocabulary)

    query_lower = " ".join(corrected_words)

    response = {
        "products": [],
        "reply": "",
        "suggestions": []
    }

    # 👋 Greetings (More precise matching to avoid false positives like "choc-hi-p")
    words = query_lower.split()
    if any(g in words for g in GREETINGS):
        response["reply"] = "Hey there! 👋 Welcome to Crumb Co! I can help you find cookies, brownies, and cupcakes, filter by price, or add items to your cart. What are you craving today? 🍪"
        response["suggestions"] = ["Show all cookies", "Brownies above 100", "Cookies under 60", "Show all cupcakes"]
        return response

    # 🙏 Thanks
    if any(t in query_lower for t in THANKS):
        response["reply"] = "You're welcome! 😊 Let me know if you need anything else. Happy munching! 🍪"
        response["suggestions"] = ["Show all cookies", "Brownies above 100", "Cookies under 60"]
        return response

    # 👋 Goodbye
    if any(b in query_lower for b in BYE_WORDS):
        response["reply"] = "Goodbye! 👋 Come back soon for more delicious treats! 🍪"
        return response

    # ❓ Help
    if any(h in query_lower for h in HELP_WORDS):
        response["reply"] = "I can help you with:\n🍪 Browse cookies, brownies & cupcakes\n💰 Filter by price (e.g. 'cookies under 60')\n🛒 Add items to your cart\n📞 Provide our contact details"
        response["suggestions"] = ["Show all cookies", "Brownies above 100", "Contact details", "Add 2 brownies"]
        return response

    # 📍 Contact Info (Specific or General)
    if any(c in query_lower for c in CONTACT_KEYS):
        email_str = "📧 Email: orders@thecrumbco.com"
        phone_str = "📞 Phone: +91-9876543210"
        addr_str = "📍 Address: 123 Baker Street, Sweet Valley, Chennai - 600001"
        
        if any(w in query_lower for w in ["email", "mail"]):
            response["reply"] = f"Here is our email address: {email_str}"
        elif any(w in query_lower for w in ["phone", "number", "call"]):
            response["reply"] = f"You can reach us at: {phone_str}"
        elif any(w in query_lower for w in ["address", "location", "where"]):
            response["reply"] = f"Our bakery is located at: {addr_str}"
        else:
            response["reply"] = (
                "You can reach us through any of these channels! 🧁\n\n"
                f"{email_str}\n{phone_str}\n{addr_str}"
            )
        
        response["suggestions"] = ["Show all cookies", "Bestsellers", "Help"]
        return response

    # 🚚 Delivery
    if any(d in query_lower for d in DELIVERY_KEYS):
        response["reply"] = "Yes, we deliver! 🚚 We offer home delivery across the city within 2-4 hours of your order. Shipping is free for orders above ₹300! 🍪"
        response["suggestions"] = ["Show all products", "Cookies under 60", "Help"]
        return response

    # 🕒 Hours
    if any(h in query_lower for h in HOURS_KEYS):
        response["reply"] = "We are open every day to satisfy your cravings! 🕒\n\nMonday - Saturday: 9:00 AM - 9:00 PM\nSunday: 10:00 AM - 6:00 PM"
        response["suggestions"] = ["Contact details", "Show all cookies", "Help"]
        return response

    # ⭐ Recommendations
    if any(b in query_lower for b in BEST_KEYS):
        response["reply"] = "Everything we bake is made with love, but our Absolute Bestsellers are the Classic Brownie 🍫 and the Choco-Chip Cookie 🍪. You can't go wrong with those!"
        response["suggestions"] = ["Show Classic Brownie", "Add Choco-Chip Cookie", "Help"]
        return response

    # 🎲 Surprise Me
    if any(s in query_lower for s in SURPRISE_KEYS):
        random_item = random.choice(products)
        response["reply"] = f"Feeling adventurous? 🎲 I've picked out the '{random_item['name']}' just for you! It's one of our favorites. Shall I add it to your cart?"
        response["products"] = [random_item]
        response["suggestions"] = ["Add to cart", "Surprise me again!", "Show all cookies"]
        return response

    # 🎂 Bulk / Special Occasions
    if any(b in query_lower for b in BULK_KEYS):
        response["reply"] = (
            "Planning something big? 🎂 We love being part of your special moments!\n\n"
            "We handle:\n"
            "✨ Birthday & Wedding Cakes\n"
            "🎁 Corporate Gift Boxes\n"
            "🥳 Party Trays (Bulk Brownies/Cookies)\n\n"
            "For custom quotes and bulk pricing, please email us directly at orders@thecrumbco.com!"
        )
        response["suggestions"] = ["Contact details", "Show all cupcakes", "Help"]
        return response

    # 💡 Baking Tips
    if any(t in query_lower for t in TIPS_KEYS):
        tip = random.choice(BAKING_TIPS)
        response["reply"] = f"Here's a Crumb Co Baker's Secret just for you! 🤫\n\n{tip}"
        response["suggestions"] = ["Tell me a joke!", "Surprise me", "Show all cookies"]
        return response

    # 😆 Jokes
    if any(j in query_lower for j in JOKE_KEYS):
        joke = random.choice(BAKERY_JOKES)
        response["reply"] = f"Haha, I've got a fresh one for you! 😂\n\n{joke}"
        response["suggestions"] = ["Another joke!", "Baking tip", "Show all products"]
        return response

    # 🔍 Search products if query has intent keywords, category, or matches product names
    intent_keywords = ["add", "find", "show", "search", "get", "tell me", "look", "buy", "cart", "want", "need", "have"]
    product_keywords = ["expensive", "cheap", "price", "under", "above"]
    
    has_intent = any(kw in query_lower for kw in intent_keywords)
    has_product_kw = any(kw in query_lower for kw in product_keywords)
    
    # Check if they named a category directly (e.g. just typing "cookies")
    dynamic_categories = set(p["name"].split()[-1].lower() for p in products)
    has_category = any(cat in query_lower for cat in dynamic_categories)

    # Check if any word in the query is part of a product name (e.g. "coffee")
    has_product_word = any(
        any(word in p["name"].lower() for word in query_lower.split() if len(word) > 2)
        for p in products
    )

    # 🚨 If no known keywords at all AND no category AND no product word AND not single word, give help
    if not (has_intent or has_category or has_product_kw or is_product_query(query_lower) or len(query_lower.split()) == 1 or has_product_word):
        response["reply"] = "I'm here to help you find the perfect treat! 🍪 Try asking about cookies, brownies, or cupcakes, or filter by price."
        response["suggestions"] = ["Show all cookies", "Brownies above 100", "Cookies under 60", "Add 2 brownies"]
        return response

    # 🔍 Detect number
    number_match = re.search(r'\d+', query_lower)
    number = int(number_match.group()) if number_match else None

    # 🔍 Dynamic Categories from DB (extract last word of each name)
    dynamic_categories = set(p["name"].split()[-1].lower() for p in products)
    category = None
    for cat in dynamic_categories:
        if cat in query_lower:
            category = cat
            break

    # 🔍 Search by specific names, categories, or keywords (like 'coffee')
    results = []
    
    # Check if the query itself is a substring of a product name or description
    substring_matches = [p for p in products if query_lower in p["name"].lower() or query_lower in p.get("desc", "").lower()]
    
    # Check if any word in the query matches a product name (for things like "Add Choco-Chip Cookie")
    product_matches = [p for p in products if p["name"].lower() in query_lower]
    
    if substring_matches:
        results = substring_matches
    elif product_matches:
        results = product_matches
    elif category:
        results = [p for p in products if category in p["name"].lower()]
    elif any(kw in query_lower for kw in ["all", "everything", "shop", "items", "dish", "dessert", "cheap", "under", "above", "price", "expensive"]):
        # If no category but price filter or general browse, start with all products
        results = list(products)
    else:
        # Final fallback: check if any individual word from the query matches a product name partially
        query_words = [w for w in query_lower.split() if len(w) > 2] # avoid matching 'the', 'is', etc.
        for word in query_words:
            word_matches = [p for p in products if word in p["name"].lower() or word in p.get("desc", "").lower()]
            if word_matches:
                results.extend(word_matches)
        
        # Deduplicate results if we found matches via words
        if results:
            seen_ids = set()
            unique_results = []
            for p in results:
                if p["id"] not in seen_ids:
                    unique_results.append(p)
                    seen_ids.add(p["id"])
            results = unique_results

    # 💰 Price filtering
    if results and (number or "expensive" in query_lower or "cheap" in query_lower):
        # Avoid filtering if they asked for a specific product by name (like "Add 1 Brownie")
        if not product_matches:
            if "under" in query_lower:
                results = [p for p in results if int(p["price"]) <= number]
            elif "above" in query_lower:
                results = [p for p in results if int(p["price"]) >= number]
            elif "expensive" in query_lower:
                results = [p for p in results if int(p["price"]) >= 140]
            elif "cheap" in query_lower:
                results = [p for p in results if int(p["price"]) <= 60]
    
    # 🧠 Product replies with correct singular/plural
    # REFINED ADD LOGIC: Only add if it's a SPECIFIC product match, not just a category
    is_add_intent = "add" in query_lower or "cart" in query_lower
    
    if is_add_intent and product_matches:
        # ✅ SPECIFIC MATCH: Add to cart automatically
        qty = number if number else 1
        target = product_matches[0]
        response["reply"] = f"Added {target['name']} to cart successfully! 🛒\n\nGo to cart to checkout."
        response["products"] = [target] * qty
        
        # 🎲 Dynamic 'Also Try' - ALWAYS added for cart success
        other_products = [p["name"] for p in products if p["name"] != target["name"]]
        random_suggestions = random.sample(other_products, min(3, len(other_products)))
        response["suggestions"] = ["also try: " + s for s in random_suggestions]

    elif results:
        # 🔍 SEARCH / CATEGORY MATCH: Just show the cards
        response["reply"] = item_count_reply(len(results), category)
        response["products"] = results
        
        # 🎲 Dynamic 'Also Try' from DB for search
        current_names = [p["name"] for p in results]
        other_products = [p["name"] for p in products if p["name"] not in current_names]
        if other_products:
            random_suggestions = random.sample(other_products, min(3, len(other_products)))
            response["suggestions"] = ["also try: " + s for s in random_suggestions]

    else:
        # ❌ NO MATCH: Custom sorry message
        # Check if the query contained ANY word that looks like a food name (not a greeting)
        if not (any(g in query_lower for g in GREETINGS) or any(h in query_lower for h in HELP_WORDS)):
            response["reply"] = "I'm sorry, we are not serving that particular item at the moment. 😔"
        else:
            response["reply"] = "Sorry, I couldn't find any treats matching that. Try checking our categories below! 🍪"
            
        response["suggestions"] = ["Show all cookies", "Show all brownies", "Show all cupcakes"]
        return response

    # 💡 Smart suggestions (default if none set)
    if not response["suggestions"]:
        response["suggestions"] = [
            "Cookies under 60",
            "Brownies above 100",
            "Cheap desserts",
            "Add 2 brownies"
        ]

    return response