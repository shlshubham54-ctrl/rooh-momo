/* Review suggestions shared by every shop.
   Placeholders: {shop} {item} {area}. Lines with {area} are skipped if the shop has no area set.
   Tiers: 5 = loved it, 4 = liked it, 3 = okay, 1 = unhappy (1–2 stars).
   A shop can add its own lines in config.js → review.extra.                        */
window.REVIEWS = {
  en: {
    5: [
      "Best {item} in {area}! Fresh, hot and full of flavour. {shop} never disappoints.",
      "Visited {shop} today and loved it. The {item} was amazing and the staff were super friendly.",
      "Great taste, quick service and value for money. Must try the {item} at {shop}!",
      "{shop} is our family's favourite place in {area}. The {item} is a must-try.",
      "Ordered the {item} — perfectly made and generous portions. Highly recommend {shop}!",
      "Clean place, polite staff and delicious food. The {item} was the highlight. 5 stars!",
      "If you're in {area}, don't miss {shop}. Loved the {item}, will definitely come back.",
      "Amazing food at very reasonable prices. The {item} at {shop} is just perfect."
    ],
    4: [
      "Really good {item} at {shop}. Tasty and fresh — will visit again.",
      "Nice place in {area} with good food. The {item} was great and service was quick.",
      "Good taste and fair prices. Enjoyed the {item} at {shop}.",
      "Tasty food and friendly staff. The {item} is worth trying."
    ],
    3: [
      "The {item} was decent. Good place, but there's room to improve.",
      "Okay experience at {shop}. Food was fine, service could be a bit faster.",
      "Average visit — the {item} was good but I expected a little more."
    ],
    1: [
      "Didn't enjoy my visit this time. The {item} wasn't up to the mark.",
      "Service was slow and the food was cold. Hope {shop} improves.",
      "Not happy with today's order. Expected better quality."
    ]
  },
  hi: {
    5: [
      "{area} mein sabse best {item}! Taste ekdum mast tha, {shop} zaroor try karo.",
      "Aaj {shop} gaye, {item} bahut tasty tha aur staff bhi bahut friendly hai.",
      "Taste, service aur price — teeno ekdum badhiya. {shop} ka {item} must try hai!",
      "Family ke saath aaye the, sabko {item} bahut pasand aaya. Dobara zaroor aayenge.",
      "{shop} ka {item} khaake maza aa gaya! Fresh aur garma-garam mila.",
      "Paisa vasool jagah hai. {item} ekdum perfect tha, 5 star banta hai!",
      "{area} mein accha khana chahiye toh {shop} best hai. {item} zaroor try karna.",
      "Saaf-suthri jagah, achha behaviour aur lajawab {item}. Highly recommended!"
    ],
    4: [
      "{shop} ka {item} kaafi achha tha. Fresh aur tasty, phir aayenge.",
      "{area} mein achhi jagah hai. {item} badhiya tha, service bhi fast thi.",
      "Taste achha hai aur price bhi theek hai. {item} enjoy kiya.",
      "Khana tasty tha aur staff friendly. {item} try karne layak hai."
    ],
    3: [
      "{item} theek-thaak tha. Jagah achhi hai, thoda aur improve ho sakta hai.",
      "Experience okay raha. Khana theek tha, service thodi fast ho sakti hai.",
      "Average laga — {item} achha tha par thoda aur expect kiya tha."
    ],
    1: [
      "Is baar experience achha nahi raha. {item} utna achha nahi tha.",
      "Service slow thi aur khana thanda tha. Umeed hai {shop} improve karega.",
      "Aaj ka order pasand nahi aaya. Quality aur better honi chahiye."
    ]
  }
};
