import type { Competitor, Niche, Post, Signal, SignalType } from "./types";

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

interface Template {
  signalType: SignalType;
  caption: string;
  summary: string;
  evidenceQuote: string;
  importance: number;
}

const TEMPLATES: Record<Niche, Template[]> = {
  gym: [
    { signalType: "referral", caption: "REFER A FRIEND. 3 WEEKS FREE for both of you. This week only. Tag a mate below 👇 #ironwill", summary: "3 weeks free for both members when referring a friend — this week only", evidenceQuote: "3 WEEKS FREE for both of you. This week only.", importance: 0.92 },
    { signalType: "promo", caption: "$0 joining fee until Sunday. Lock in $19/week — forever. Link in bio.", summary: "$0 joining fee + $19/wk locked in until Sunday", evidenceQuote: "$0 joining fee until Sunday. Lock in $19/week — forever.", importance: 0.85 },
    { signalType: "launch", caption: "NEW: 6am Hyrox class drops Monday. Capped at 12 spots. Coached by @marcusft.", summary: "Launching 6am Hyrox class Monday, 12-spot cap", evidenceQuote: "NEW: 6am Hyrox class drops Monday.", importance: 0.7 },
    { signalType: "event", caption: "Community lift night Friday 6pm. BBQ + DJ. Bring a non-member, they train free.", summary: "Community lift night Friday — non-members train free", evidenceQuote: "Bring a non-member, they train free.", importance: 0.6 },
    { signalType: "hire", caption: "We're hiring a head of strength. DM if interested.", summary: "Hiring a head of strength coach", evidenceQuote: "We're hiring a head of strength.", importance: 0.3 },
    { signalType: "price_change", caption: "Annual memberships moving to $899 (was $749) from June 1. Lock in the old rate this week.", summary: "Annual price rising to $899 from June 1 (was $749)", evidenceQuote: "Annual memberships moving to $899 (was $749) from June 1.", importance: 0.78 },
    { signalType: "other", caption: "Good session today. Big squats from @sam.", summary: "Member highlight post", evidenceQuote: "Good session today.", importance: 0.1 },
  ],
  restaurant: [
    { signalType: "promo", caption: "Tuesday $25 set menu starts next week. Three courses, glass of vino. Bookings open.", summary: "$25 three-course set menu launching Tuesdays", evidenceQuote: "Tuesday $25 set menu starts next week.", importance: 0.88 },
    { signalType: "menu_change", caption: "New autumn menu drops Thursday. Chestnut tortellini is going to ruin you (in a good way).", summary: "New autumn menu drops Thursday", evidenceQuote: "New autumn menu drops Thursday.", importance: 0.72 },
    { signalType: "event", caption: "Wine pairing dinner Sat 24th. 6 courses + 6 pours. $145pp. 14 seats.", summary: "Wine pairing dinner Sat, $145pp, 14 seats", evidenceQuote: "Wine pairing dinner Sat 24th. 6 courses + 6 pours. $145pp.", importance: 0.75 },
    { signalType: "discount", caption: "Mid-week treat: 20% off your bill Mon–Wed in May. Walk-ins welcome.", summary: "20% off bill Mon–Wed through May", evidenceQuote: "20% off your bill Mon–Wed in May.", importance: 0.84 },
    { signalType: "launch", caption: "Now serving Sunday lunch. 12–3, family-style, kids eat free.", summary: "Sunday lunch launched, kids eat free", evidenceQuote: "kids eat free", importance: 0.8 },
    { signalType: "price_change", caption: "Quick heads-up — $1 surcharge moving to $2 on Sundays from next month.", summary: "Sunday surcharge increasing to $2", evidenceQuote: "$1 surcharge moving to $2 on Sundays", importance: 0.4 },
    { signalType: "other", caption: "Behind the pass tonight. Service was 🔥.", summary: "Service highlight reel", evidenceQuote: "Service was 🔥.", importance: 0.1 },
  ],
  cafe: [
    { signalType: "promo", caption: "Free oat milk upgrade ALL of May. Loyalty card holders only — grab one in store.", summary: "Free oat milk for loyalty card holders all May", evidenceQuote: "Free oat milk upgrade ALL of May.", importance: 0.82 },
    { signalType: "launch", caption: "NEW loyalty punch card. 10th coffee free. Stamp anywhere — even cold drip days.", summary: "New punch card: 10th coffee free", evidenceQuote: "NEW loyalty punch card. 10th coffee free.", importance: 0.86 },
    { signalType: "menu_change", caption: "Brunch menu refresh Monday. Hello miso mushroom toast, goodbye smashed avo (sorry).", summary: "Brunch menu refresh Monday", evidenceQuote: "Brunch menu refresh Monday.", importance: 0.6 },
    { signalType: "event", caption: "Cupping session Sat 9am. Free if you bring your own cup. New Colombia just landed.", summary: "Free cupping session Saturday 9am", evidenceQuote: "Cupping session Sat 9am. Free if you bring your own cup.", importance: 0.55 },
    { signalType: "discount", caption: "Happy hour 3–5pm weekdays. $4 batch brew, $5 lattes. Until end of June.", summary: "Coffee happy hour 3-5pm weekdays, $4 batch", evidenceQuote: "Happy hour 3–5pm weekdays. $4 batch brew, $5 lattes.", importance: 0.78 },
    { signalType: "launch", caption: "Beans now on subscription. 250g monthly, delivered to your door. Pause anytime.", summary: "Beans-on-subscription launched", evidenceQuote: "Beans now on subscription.", importance: 0.7 },
    { signalType: "other", caption: "Latte art Thursday with @sasha. Come watch.", summary: "Latte art demo Thursday", evidenceQuote: "Latte art Thursday with @sasha.", importance: 0.15 },
  ],
  retail: [
    { signalType: "discount", caption: "FRI–SUN ONLY. 30% off EVERYTHING in store. Yes everything. Yes including the new arrivals.", summary: "30% off store-wide Fri–Sun (incl new arrivals)", evidenceQuote: "30% off EVERYTHING in store.", importance: 0.94 },
    { signalType: "event", caption: "Vintage market this Saturday in the laneway. 12 traders, DJs, drinks.", summary: "In-store vintage market Saturday, 12 traders", evidenceQuote: "Vintage market this Saturday in the laneway.", importance: 0.7 },
    { signalType: "launch", caption: "New consignment program — bring us your good stuff, take 60% of the sale.", summary: "Consignment program launched, 60% to seller", evidenceQuote: "bring us your good stuff, take 60% of the sale", importance: 0.82 },
    { signalType: "promo", caption: "Buy two, get one free on all denim through Sunday. Stack high, save high.", summary: "BOGO on all denim through Sunday", evidenceQuote: "Buy two, get one free on all denim through Sunday.", importance: 0.85 },
    { signalType: "discount", caption: "Final markdowns: winter coats 50% off. Tagged in pink. They will not last.", summary: "Winter coats 50% off final markdown", evidenceQuote: "winter coats 50% off", importance: 0.8 },
    { signalType: "menu_change", caption: "New arrival drop Thursday: 200 pieces of 90s sportswear. Cash buyer in this morning.", summary: "200pc 90s sportswear drop Thursday", evidenceQuote: "200 pieces of 90s sportswear", importance: 0.68 },
    { signalType: "other", caption: "Spotted: customer absolutely wearing this fit better than the mannequin.", summary: "Customer style spotlight", evidenceQuote: "absolutely wearing this fit", importance: 0.1 },
  ],
};

function pickTemplate(rng: () => number, niche: Niche, weekIndex: number): Template {
  const pool = TEMPLATES[niche];
  // Bias high-importance templates into recent weeks so initiatives feed has hits
  if (weekIndex <= 1 && rng() < 0.75) {
    const hot = pool.filter((t) => t.importance >= 0.78);
    return hot[Math.floor(rng() * hot.length)];
  }
  return pool[Math.floor(rng() * pool.length)];
}

export function generatePostsAndSignals(competitors: Competitor[]): {
  posts: Post[];
  signals: Signal[];
} {
  const posts: Post[] = [];
  const signals: Signal[] = [];
  const now = new Date();
  // Anchor "now" to a fixed point so dev experience is stable across reloads
  now.setUTCHours(12, 0, 0, 0);

  for (const c of competitors) {
    const rng = mulberry32(hashSeed(c.id));
    const postsPerCompetitor = 8;
    for (let i = 0; i < postsPerCompetitor; i++) {
      const daysAgo = Math.floor(i * 5 + rng() * 4); // ~ every 5 days over ~6 weeks
      const postedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const weekIndex = Math.floor(daysAgo / 7);
      const tmpl = pickTemplate(rng, c.niche, weekIndex);
      const engagementMult = tmpl.importance > 0.7 ? 1.4 + rng() * 1.2 : 0.6 + rng() * 0.8;
      const likeCount = Math.round(c.baselineLikes * engagementMult);
      const commentCount = Math.round(likeCount * (0.04 + rng() * 0.06));
      const postId = `p-${c.id}-${i}`;
      posts.push({
        id: postId,
        competitorId: c.id,
        postedAt: postedAt.toISOString(),
        caption: tmpl.caption,
        mediaUrl: `https://picsum.photos/seed/${c.id}-${i}/600/600`,
        likeCount,
        commentCount,
      });
      const engagementDelta = (likeCount - c.baselineLikes) / c.baselineLikes;
      signals.push({
        id: `s-${c.id}-${i}`,
        postId,
        competitorId: c.id,
        businessId: c.businessId,
        signalType: tmpl.signalType,
        summary: tmpl.summary,
        evidenceQuote: tmpl.evidenceQuote,
        confidence: 0.6 + rng() * 0.4,
        importance: tmpl.importance,
        engagementDelta,
        postedAt: postedAt.toISOString(),
      });
    }
  }
  return { posts, signals };
}
