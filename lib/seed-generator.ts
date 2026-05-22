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

// Templates flavoured for Brisbane local businesses. signalType maps to the
// four demo pills in the frontend:
//   promo | discount | referral | event       -> "Promo"
//   launch | menu_change                      -> "New product"
//   price_change                              -> "Pricing"
//   (any signal with engagementDelta > 0.75)  -> "Viral post" (overrides above)
const TEMPLATES: Record<Niche, Template[]> = {
  gym: [
    { signalType: "referral", caption: "REFER A MATE — 3 weeks free for BOTH of you. This week only. Tag them below 👇 #fitvalley", summary: "3 weeks free for both members when referring a friend — this week only", evidenceQuote: "3 weeks free for BOTH of you. This week only.", importance: 0.92 },
    { signalType: "promo", caption: "$0 joining fee until Sunday. Lock in $19/week — forever. Link in bio.", summary: "$0 joining fee + $19/wk locked in until Sunday", evidenceQuote: "$0 joining fee until Sunday. Lock in $19/week — forever.", importance: 0.85 },
    { signalType: "launch", caption: "NEW: 6am Hyrox class drops Monday. Capped at 12 spots. Coached by Marcus.", summary: "Launching 6am Hyrox class Monday, 12-spot cap", evidenceQuote: "NEW: 6am Hyrox class drops Monday.", importance: 0.72 },
    { signalType: "event", caption: "Community lift night Friday 6pm at the Valley. BBQ + DJ. Bring a non-member — they train free.", summary: "Community lift night Friday — non-members train free", evidenceQuote: "Bring a non-member — they train free.", importance: 0.6 },
    { signalType: "price_change", caption: "Annual memberships moving to $899 (was $749) from July 1. Lock in the old rate this week.", summary: "Annual price rising to $899 from July 1 (was $749)", evidenceQuote: "Annual memberships moving to $899 (was $749) from July 1.", importance: 0.78 },
    { signalType: "promo", caption: "Two weeks unlimited for $29. New members only, ends Sunday.", summary: "$29 for two weeks unlimited (new members)", evidenceQuote: "Two weeks unlimited for $29.", importance: 0.7 },
    { signalType: "launch", caption: "Recovery room is OPEN. Ice bath, sauna, compression. Members $0, casuals $25.", summary: "Recovery room launched — free for members", evidenceQuote: "Recovery room is OPEN.", importance: 0.74 },
    { signalType: "other", caption: "Sunday session highlight reel. Big PRs from the 9am crew.", summary: "Member highlight reel", evidenceQuote: "Big PRs from the 9am crew.", importance: 0.15 },
  ],
  restaurant: [
    { signalType: "promo", caption: "Tuesday $25 set menu starts next week. Three courses, glass of vino. Bookings open.", summary: "$25 three-course set menu launching Tuesdays", evidenceQuote: "Tuesday $25 set menu starts next week.", importance: 0.88 },
    { signalType: "menu_change", caption: "New winter menu drops Thursday. Chestnut tortellini is going to ruin you (in a good way).", summary: "New winter menu drops Thursday", evidenceQuote: "New winter menu drops Thursday.", importance: 0.72 },
    { signalType: "event", caption: "Wine pairing dinner Sat 24th. 6 courses + 6 pours. $145pp. 14 seats.", summary: "Wine pairing dinner Sat, $145pp, 14 seats", evidenceQuote: "6 courses + 6 pours. $145pp.", importance: 0.75 },
    { signalType: "discount", caption: "Mid-week treat: 20% off your bill Mon–Wed this month. Walk-ins welcome.", summary: "20% off bill Mon–Wed all month", evidenceQuote: "20% off your bill Mon–Wed this month.", importance: 0.84 },
    { signalType: "launch", caption: "Now serving Sunday lunch. 12–3, family-style, kids eat free.", summary: "Sunday lunch launched, kids eat free", evidenceQuote: "kids eat free", importance: 0.8 },
    { signalType: "price_change", caption: "Quick heads-up — $1 Sunday surcharge moving to $2 from next month.", summary: "Sunday surcharge increasing to $2", evidenceQuote: "$1 Sunday surcharge moving to $2.", importance: 0.42 },
    { signalType: "menu_change", caption: "Pasta of the week: pappardelle, slow-braised wagyu, sage butter. Tonight only.", summary: "Limited pasta special tonight", evidenceQuote: "pappardelle, slow-braised wagyu, sage butter", importance: 0.5 },
    { signalType: "other", caption: "Behind the pass tonight. Service was 🔥.", summary: "Service highlight reel", evidenceQuote: "Service was 🔥.", importance: 0.1 },
  ],
  cafe: [
    { signalType: "promo", caption: "Free oat milk upgrade ALL month. Loyalty card holders only — grab one in store.", summary: "Free oat milk for loyalty card holders all month", evidenceQuote: "Free oat milk upgrade ALL month.", importance: 0.82 },
    { signalType: "launch", caption: "NEW loyalty punch card. 10th coffee free. Stamp anywhere — even cold drip days.", summary: "New punch card: 10th coffee free", evidenceQuote: "NEW loyalty punch card. 10th coffee free.", importance: 0.86 },
    { signalType: "menu_change", caption: "Brunch menu refresh Monday. Hello miso mushroom toast, goodbye smashed avo (sorry).", summary: "Brunch menu refresh Monday", evidenceQuote: "Brunch menu refresh Monday.", importance: 0.62 },
    { signalType: "event", caption: "Cupping session Sat 9am. Free if you bring your own cup. New Colombia just landed.", summary: "Free cupping session Saturday 9am", evidenceQuote: "Cupping session Sat 9am. Free if you bring your own cup.", importance: 0.55 },
    { signalType: "discount", caption: "Happy hour 3–5pm weekdays. $4 batch brew, $5 lattes. Until end of month.", summary: "Coffee happy hour 3-5pm weekdays, $4 batch", evidenceQuote: "$4 batch brew, $5 lattes.", importance: 0.78 },
    { signalType: "launch", caption: "Beans now on subscription. 250g monthly, delivered to your door. Pause anytime.", summary: "Beans-on-subscription launched", evidenceQuote: "Beans now on subscription.", importance: 0.7 },
    { signalType: "price_change", caption: "Heads up: small lattes moving from $4.50 to $5 from Monday. Beans cost what they cost.", summary: "Small latte price rising to $5", evidenceQuote: "small lattes moving from $4.50 to $5", importance: 0.55 },
    { signalType: "other", caption: "Latte art Thursday with Sasha. Come watch.", summary: "Latte art demo Thursday", evidenceQuote: "Latte art Thursday with Sasha.", importance: 0.15 },
  ],
  retail: [
    { signalType: "discount", caption: "FRI–SUN ONLY. 30% off EVERYTHING in store. Yes everything. Yes including the new arrivals.", summary: "30% off store-wide Fri–Sun (incl new arrivals)", evidenceQuote: "30% off EVERYTHING in store.", importance: 0.94 },
    { signalType: "event", caption: "Vintage market this Saturday in the laneway. 12 traders, DJs, drinks.", summary: "In-store vintage market Saturday, 12 traders", evidenceQuote: "Vintage market this Saturday in the laneway.", importance: 0.7 },
    { signalType: "launch", caption: "New consignment program — bring us your good stuff, take 60% of the sale.", summary: "Consignment program launched, 60% to seller", evidenceQuote: "bring us your good stuff, take 60% of the sale", importance: 0.82 },
    { signalType: "promo", caption: "Buy two, get one free on all denim through Sunday. Stack high, save high.", summary: "BOGO on all denim through Sunday", evidenceQuote: "Buy two, get one free on all denim through Sunday.", importance: 0.85 },
    { signalType: "discount", caption: "Final markdowns: winter coats 50% off. Tagged in pink. They will not last.", summary: "Winter coats 50% off final markdown", evidenceQuote: "winter coats 50% off", importance: 0.8 },
    { signalType: "menu_change", caption: "New arrival drop Thursday: 200 pieces of 90s sportswear. Cash buyer in this morning.", summary: "200pc 90s sportswear drop Thursday", evidenceQuote: "200 pieces of 90s sportswear", importance: 0.68 },
    { signalType: "price_change", caption: "All denim resetting to flat $40 from next week. Easier for everyone, including us.", summary: "Flat $40 denim pricing from next week", evidenceQuote: "All denim resetting to flat $40 from next week.", importance: 0.6 },
    { signalType: "other", caption: "Spotted: customer absolutely wearing this fit better than the mannequin.", summary: "Customer style spotlight", evidenceQuote: "absolutely wearing this fit", importance: 0.1 },
  ],
};

function pickTemplate(
  rng: () => number,
  niche: Niche,
  weekIndex: number,
  forceHot: boolean,
): Template {
  const pool = TEMPLATES[niche];
  // Bias high-importance templates into recent weeks so the initiatives feed
  // has fresh material at the top. Viral weeks must land on a hot template so
  // the analytics filter doesn't drop them as "other".
  if (forceHot || (weekIndex <= 2 && rng() < 0.75)) {
    const hot = pool.filter((t) => t.importance >= 0.78);
    return hot[Math.floor(rng() * hot.length)];
  }
  return pool[Math.floor(rng() * pool.length)];
}

const WEEKS = 12;

export function generatePostsAndSignals(competitors: Competitor[]): {
  posts: Post[];
  signals: Signal[];
} {
  const posts: Post[] = [];
  const signals: Signal[] = [];
  const now = new Date();
  now.setUTCHours(12, 0, 0, 0);

  for (const c of competitors) {
    const rng = mulberry32(hashSeed(c.id));
    // One viral spike per competitor, placed in weeks 1–3 (recent) so it
    // shows up on both the engagement chart and the initiatives feed.
    const viralWeek = 1 + Math.floor(rng() * 3);

    for (let i = 0; i < WEEKS; i++) {
      const daysAgo = i * 7 + Math.floor(rng() * 3); // weekly cadence ± jitter
      const postedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const isViral = i === viralWeek;
      const tmpl = pickTemplate(rng, c.niche, i, isViral);

      const engagementMult = isViral
        ? 3.2 + rng() * 1.6 // 3.2x – 4.8x baseline
        : tmpl.importance > 0.7
          ? 1.2 + rng() * 0.7
          : 0.55 + rng() * 0.7;

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
        // Bump importance on the viral post so it surfaces in the initiatives feed
        importance: isViral ? Math.max(tmpl.importance, 0.9) : tmpl.importance,
        engagementDelta,
        postedAt: postedAt.toISOString(),
      });
    }
  }
  return { posts, signals };
}
