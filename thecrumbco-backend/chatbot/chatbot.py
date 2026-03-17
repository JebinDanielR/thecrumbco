import json
import re

with open("../db.json") as f:
    data = json.load(f)

products = data["products"]


def chatbot_response(query):

    query = query.lower()

    response = {
        "products": [],
        "reply": "",
        "suggestions": []
    }

    # 🔍 detect number
    number_match = re.search(r'\d+', query)
    number = int(number_match.group()) if number_match else None

    # 🔍 detect category
    category = None
    if "brownie" in query:
        category = "brownie"
    elif "cookie" in query:
        category = "cookie"
    elif "cupcake" in query:
        category = "cupcake"

    results = products

    if category:
        results = [p for p in results if category in p["name"].lower()]

    # 💰 price filtering
    if number:
        if "under" in query:
            results = [p for p in results if int(p["price"]) <= number]
        elif "above" in query:
            results = [p for p in results if int(p["price"]) >= number]

    # 🧠 conversational replies
    if "add" in query and number and category:
        response["reply"] = f"Adding {number} {category}s to your cart 🛒"
        response["products"] = results[:number]

    elif results:
        response["reply"] = f"Here are some {category or 'items'} for you 🍪"
        response["products"] = results

    else:
        response["reply"] = "Sorry, I couldn't find that 😔"

    # 💡 smart suggestions
    response["suggestions"] = [
        "Cookies under 60",
        "Brownies above 100",
        "Cheap desserts",
        "Add 2 brownies"
    ]

    return response