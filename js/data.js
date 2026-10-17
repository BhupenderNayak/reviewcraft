const REVIEWCRAFT_DATA = {
  whatsappNumber: "918178228895",
  instagramUrl: "https://www.instagram.com/mapsupport.in/",
  analytics: {
    provider: "none",
    googleMeasurementId: "G-XXXXXXXXXX",
    goatCounterScriptUrl: "https://gc.zgo.at/count.js",
    goatCounterUrl: "",
    adminPin: "2026",
    storageKey: "reviewcraft_analytics_events",
  },
  pricingPlans: [
    {
      id: "starter",
      name: "Starter",
      pricePerReview: 25,
      features: [
        "Gradual Posting",
        "Safe & Manual Process",
        "SEO Keyword Based",
      ],
    },
    {
      id: "growth",
      name: "Growth",
      pricePerReview: 27,
      mostPopular: true,
      features: [
        "SEO Optimized Reviews",
        "Location Based Reviews",
        "Gradual Posting Strategy",
        "High Authority Profiles",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      pricePerReview: 30,
      features: [
        "SEO & Location Targeted",
        "High Authority Profiles",
        "Gradual Natural Posting",
        "5-10 reviews extra",
        "Next order 10%-20% discount",
      ],
    },
  ],
  promotions: [
    {
      id: "promotion-4",
      title: "ReviewCraft Promotion",
      imagePath: "assets/posters/file_0000000030dc8208a5b913fdc15bf711.png",
      whatsappInquiryText: "Hi ReviewCraft, I want to know more about this offer.",
    },
    {
      id: "promotion-5",
      title: "ReviewCraft Promotion",
      imagePath: "assets/posters/file_0000000069ec81fa80f6dc9b33ca1024.png",
      whatsappInquiryText: "Hi ReviewCraft, I want to know more about this offer.",
    },
    {
      id: "promotion-6",
      title: "ReviewCraft Promotion",
      imagePath: "assets/posters/file_000000007e9481fdbc26533cbd52ae0d.png",
      whatsappInquiryText: "Hi ReviewCraft, I want to know more about this offer.",
    },
    {
      id: "promotion-7",
      title: "ReviewCraft Promotion",
      imagePath: "assets/posters/file_00000000b454820695c9b05dbd473813.png",
      whatsappInquiryText: "Hi ReviewCraft, I want to know more about this offer.",
    },
    {
      id: "promotion-8",
      title: "ReviewCraft Promotion",
      imagePath: "assets/posters/file_00000000ed8081faa2135fe34996bbef.png",
      whatsappInquiryText: "Hi ReviewCraft, I want to know more about this offer.",
    },
    {
      id: "promotion-9",
      title: "ReviewCraft Promotion",
      imagePath: "assets/posters/file_00000000eef082438bf17732d04789df.png",
      whatsappInquiryText: "Hi ReviewCraft, I want to know more about this offer.",
    },
  ],
  testimonials: [
    {
      clientName: "Dr. A. Sharma",
      businessName: "SmileCare Dental Clinic",
      addressLocation: "India",
      rating: 5,
      reviewCountAdded: 50,
      serviceDetails: {
        packageUsed: "Growth Package",
        locationTargeted: "Bengaluru, Karnataka",
        reviewRetentionRate: "100%",
      },
      testimonyText:
        "We tried another vendor before and half the reviews disappeared in a week. ReviewCraft's gradual drip from real local profiles kept 100% of our reviews live and pushed our dental clinic into the top 3 on Google Maps.",
    },
    {
      clientName: "Vikram Kapoor",
      businessName: "Metro Real Estate",
      addressLocation: "India",
      rating: 5,
      reviewCountAdded: 100,
      serviceDetails: {
        packageUsed: "Growth Package",
        locationTargeted: "Gurugram, Haryana",
        reviewRetentionRate: "98%",
      },
      testimonyText:
        "The Growth Package at ₹27/review is insane value. Because they include location and service keywords inside the reviews, our inbound customer calls doubled within a month.",
    },
    {
      clientName: "Neha Patel",
      businessName: "Elevate Digital",
      addressLocation: "India",
      rating: 5,
      reviewCountAdded: 75,
      serviceDetails: {
        packageUsed: "Premium Package",
        locationTargeted: "Pune, Maharashtra",
        reviewRetentionRate: "100%",
      },
      testimonyText:
        "We resell ReviewCraft's Premium Package to our own marketing clients. The 5-10 extra bonus reviews and repeat order discount make them our go-to partner.",
    },
    {
      clientName: "Rohan Mehta",
      businessName: "The Curry Leaf Kitchen",
      addressLocation: "Mumbai, Maharashtra",
      rating: 5,
      reviewCountAdded: 60,
      serviceDetails: {
        packageUsed: "Starter Package",
        locationTargeted: "Andheri West, Mumbai",
        reviewRetentionRate: "97%",
      },
      testimonyText:
        "ReviewCraft understood that our restaurant needed visibility in a very specific neighbourhood. The steady posting schedule brought in more discovery calls and kept the new reviews looking natural.",
    },
    {
      clientName: "Priya Nair",
      businessName: "Coastal Homes Realty",
      addressLocation: "Kochi, Kerala",
      rating: 5,
      reviewCountAdded: 80,
      serviceDetails: {
        packageUsed: "Premium Package",
        locationTargeted: "Kochi, Kerala",
        reviewRetentionRate: "99%",
      },
      testimonyText:
        "Our local property enquiries improved noticeably after the campaign began. The team shared clear updates throughout and tailored the review language around the areas and services we actually cover.",
    },
    {
      clientName: "Arjun Singh",
      businessName: "Velocity Auto Works",
      addressLocation: "Jaipur, Rajasthan",
      rating: 5,
      reviewCountAdded: 45,
      serviceDetails: {
        packageUsed: "Growth Package",
        locationTargeted: "Jaipur, Rajasthan",
        reviewRetentionRate: "100%",
      },
      testimonyText:
        "The location-focused approach helped our workshop stand out when nearby customers searched for car servicing. Every review was paced carefully and the results have remained consistent.",
    },
  ],
};

if (typeof window !== "undefined") {
  window.REVIEWCRAFT_DATA = REVIEWCRAFT_DATA;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { REVIEWCRAFT_DATA };
}