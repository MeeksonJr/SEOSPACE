import { AIReplyOption, ReviewItem } from "@/types/trustpulse";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY_FALLBACK ||
  "";

export async function generateAIReplyOptions(
  review: ReviewItem,
  businessName: string,
  businessCategory: string = "Local Business"
): Promise<AIReplyOption[]> {
  // If API key is present, attempt real Gemini generation
  if (GEMINI_API_KEY) {
    try {
      const prompt = `You are an expert reputation manager and local SEO specialist for "${businessName}" (${businessCategory}).
A customer left this review:
Rating: ${review.rating} / 5 Stars
Platform: ${review.platform}
Author: ${review.authorName}
Review Text: "${review.reviewText}"

Please generate three professional, distinct reply drafts in JSON format:
1. "seo_boosted": Warm, authentic gratitude that naturally weaves in the business name, city or service keywords to boost Google Maps local ranking without keyword stuffing.
2. "de_escalation": Empathetic, highly professional, acknowledging any points raised, assuring quality control, and providing a direct line to management if appropriate.
3. "loyalty_reward": Engaging and friendly, encouraging a repeat visit, recommending a complementary service or asking them to refer family/friends.

Output strictly valid JSON with this shape:
{
  "seo_boosted": "...",
  "de_escalation": "...",
  "loyalty_reward": "..."
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return [
            {
              type: "seo_boosted",
              title: "SEO-Boosted Gratitude",
              description: "Optimized for Google My Business local search ranking signals",
              content: parsed.seo_boosted,
            },
            {
              type: "de_escalation",
              title: "Professional & Empathetic",
              description: "Defuses tension, demonstrates stellar customer care",
              content: parsed.de_escalation,
            },
            {
              type: "loyalty_reward",
              title: "Loyalty & Referral Angle",
              description: "Encourages return bookings and word-of-mouth advocacy",
              content: parsed.loyalty_reward,
            },
          ];
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to heuristic engine:", err);
    }
  }

  // High-fidelity fallback engine
  return generateHeuristicReplies(review, businessName, businessCategory);
}

function generateHeuristicReplies(
  review: ReviewItem,
  businessName: string,
  businessCategory: string
): AIReplyOption[] {
  const firstName = review.authorName.split(" ")[0] || "Valued Customer";

  if (review.rating >= 4) {
    return [
      {
        type: "seo_boosted",
        title: "SEO-Boosted Gratitude",
        description: "Optimized for Google My Business local search ranking signals",
        content: `Thank you so much for the 5-star review, ${firstName}! The entire team at ${businessName} is thrilled that you had such a wonderful experience with our ${businessCategory.toLowerCase()} services. We take great pride in delivering top-tier care, and feedback like yours motivates us every single day. See you again soon!`,
      },
      {
        type: "de_escalation",
        title: "Professional & Attentive",
        description: "Polished and appreciative response from leadership",
        content: `Hi ${firstName}, thank you for taking the time to share your experience with ${businessName}. Maintaining exceptional standards is our highest priority, and we are grateful for your kind words and trust in our team. Please don't hesitate to reach out if we can assist you with anything in the future.`,
      },
      {
        type: "loyalty_reward",
        title: "Loyalty & Referral Angle",
        description: "Encourages return visits and word-of-mouth advocacy",
        content: `We love hearing this, ${firstName}! Thank you for choosing ${businessName}. Clients like you are the reason we love what we do. Mention this review on your next visit for a VIP courtesy upgrade, and be sure to tell your friends and colleagues!`,
      },
    ];
  }

  return [
    {
      type: "de_escalation",
      title: "De-escalation & Resolution",
      description: "Immediate conflict resolution with direct manager contact",
      content: `Hello ${firstName}, thank you for sharing your candid feedback. At ${businessName}, we hold ourselves to rigorous standards and we are genuinely disheartened to hear that your experience fell short. We want to investigate this immediately and make things right. Please contact our leadership directly at support@trustpulse.internal or call our office so we can resolve this for you right away.`,
    },
    {
      type: "seo_boosted",
      title: "Constructive Brand Protection",
      description: "Maintains high brand integrity while addressing concerns",
      content: `Dear ${firstName}, we appreciate all feedback as it helps ${businessName} continually refine our patient and customer care protocols. While unexpected delays or miscommunications are rare, we treat every grievance with the utmost seriousness. Our management team is already reviewing your notes to ensure this is addressed systematically.`,
    },
    {
      type: "loyalty_reward",
      title: "Second Chance Courtesy",
      description: "Invites customer back with complimentary compensation",
      content: `Hi ${firstName}, we truly apologize that we did not deliver our customary 5-star standard during your recent visit to ${businessName}. We value your patronage tremendously and would love the opportunity to welcome you back for a complimentary follow-up on us. Please reach out to our team so we can arrange this for you.`,
    },
  ];
}
