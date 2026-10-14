/* ============================================================
   RUUH MOMO — Court Road, Baghpat
   ============================================================ */
window.SHOP = {
  slug: "ruuh-momo",
  name: "Ruuh Momo",
  tagline: "Steam · Fried · Kurkure · Gravy",
  logo: "images/logo.png",            // cut from the shop's own poster
  cover: "images/cover.jpg",          // the shop's poster, extended to fit phone screens
  coverLogo: "",

  theme: {
    accent: "#F2382F",                // "MoMo" red from the logo
    accent2: "#F8BD30",               // golden momo
    mode: "dark"                      // matches the chalkboard poster
  },

  creator: {
    name: "sdhiryan",
    link: "https://form-link-for-new-shops.vercel.app/",   // "Created by" opens this sign-up form
    cta: "Get a page like this",
    phone: "918533053912",
    tagline: "Want a page like this for your shop?",
    message: "Hi sdhiryan! I saw your NFC page at {shop} and I'd like one for my shop."
  },

  actions: [
    { type: "instagram", label: "Follow us on Instagram" },
    { type: "review",   label: "Rate us on Google" },
    { type: "menu",     label: "View Menu" },
    { type: "feedback", label: "Leave Anonymous Feedback" },
    { type: "game",     label: "Play Zero‑Kaata" },
    { type: "link",     label: "Get Directions", icon: "map",
      url: "https://www.google.com/maps/dir/?api=1&destination=Rooh+momo+Baghpat&destination_place_id=ChIJ38VPW4JVDDkR6TwF-IyIS0I" }
    // Add when known:
    // { type: "rewards", label: "Start earning rewards" },
    // { type: "wifi", label: "Connect to Wi‑Fi" },
    // { type: "link", label: "Call to order", icon: "phone", url: "tel:+91XXXXXXXXXX" },
  ],

  review: {
    area: "Baghpat",
    language: "hi",
    dishes: ["Kurkure Paneer Momo", "Cheese Corn Momo", "Paneer Tandoori Momo", "Veg Afgani Momo",
             "Steam Paneer Momo", "Fried Paneer Momo", "Kurkure Momo", "Steam Momo"]
  },

  links: {
    googleReview: "https://search.google.com/local/writereview?placeid=ChIJ38VPW4JVDDkR6TwF-IyIS0I"
  },

  socials: {
    instagram: "https://www.instagram.com/ruuh_momo/",
    youtube: "https://www.youtube.com/@Rashi_rooh",
    whatsapp: "",
    facebook: "",
    x: ""
  },

  wifi: { ssid: "", password: "" },

  rewards: { goal: 8, reward: "a free plate of Steam Momos", staffPin: "5823" },   // not shown until enabled above

  feedback: {
    title: "Honest Feedback",
    subtitle: "Speak freely — your feedback is completely anonymous.",
    endpoint: "",
    whatsapp: ""
  },

  menu: {
    title: "Our Menu",
    currency: "₹",
    categories: [
      {
        name: "Momos",
        note: "Half = 5 pcs · Full = 10 pcs (Kurkure: 4 / 8 pcs). Served hot with chutney.",
        sections: [
          { name: "Steam Momo", sizes: ["Half · 5 pcs", "Full · 10 pcs"], items: [
            { name: "Steam Veg Momo", prices: [40, 70] },
            { name: "Steam Paneer Momo", prices: [50, 80] }
          ]},
          { name: "Fried Momo", sizes: ["Half · 5 pcs", "Full · 10 pcs"], items: [
            { name: "Veg Momo", prices: [50, 80] },
            { name: "Paneer Momo", prices: [60, 100] },
            { name: "Cheese Corn Momo", prices: [70, 130] }
          ]},
          { name: "Kurkure Momo", sizes: ["Half · 4 pcs", "Full · 8 pcs"], items: [
            { name: "Veg Momo", prices: [60, 110] },
            { name: "Paneer Momo", prices: [70, 120] },
            { name: "Cheese Corn Momo", prices: [80, 150] }
          ]},
          { name: "Gravy Momo", sizes: ["Half · 5 pcs", "Full · 10 pcs"], items: [
            { name: "Veg Afgani Momo", prices: [80, 130] },
            { name: "Veg Tandoori Momo", prices: [80, 130] },
            { name: "Paneer Afgani Momo", prices: [90, 150] },
            { name: "Paneer Tandoori Momo", prices: [90, 150] }
          ]}
        ]
      }
    ]
  }
};
