import type { Signal, SignalType } from "./types";

interface Recommendation {
  doingWell: string;
  undercut: string[];
}

const BY_TYPE: Record<SignalType, (s: Signal) => Recommendation> = {
  promo: () => ({
    doingWell:
      "A clear dollar saving with a deadline is easy to act on. Customers don't have to do maths, and they feel like they'll miss out if they wait.",
    undercut: [
      "Offer the same value but throw in something they can't easily copy — your team, your space, a small loyalty perk.",
      "Run a longer version of your own deal so people don't drift to them after their offer ends.",
      "Quietly mention what their deal is hiding — a joining fee, lock-in, or upsell they'll meet later.",
    ],
  }),
  discount: () => ({
    doingWell:
      "A simple percent off the whole shop gets attention because customers already know what they want — it just makes saying yes easier.",
    undercut: [
      "Don't discount everything. Pick the one or two things you both sell and beat them just on those.",
      "Add a freebie instead of cutting the price — protects what you charge and feels generous.",
      "Tease your next drop on socials so shoppers wait for you instead of buying from them now.",
    ],
  }),
  referral: () => ({
    doingWell:
      "Referral deals get new customers cheaply because your existing ones do the talking. They also bring friends who behave like the people who already love you.",
    undercut: [
      "Make yours reward both sides straight away. 'Get $20 today, give $20 today' beats anything they have to wait for.",
      "Give your top 5 regulars a small kickback to bring people in — a tighter version usually beats a public one.",
      "Make sure your version is shareable in a text — a code people can send a friend, not just walk a friend in.",
    ],
  }),
  event: () => ({
    doingWell:
      "Events give people something to post about. They get free word-of-mouth and a reason for customers to bring a friend.",
    undercut: [
      "Run your own event the same week with a sharper hook (bring-a-friend free, partner with another local business).",
      "Or wait two weeks and pick up the people who heard about theirs but didn't go.",
      "Hire someone good to film yours. Better photos and clips out-travel the event itself.",
    ],
  }),
  launch: () => ({
    doingWell:
      "A new product gives existing customers a reason to come back and gives them something fresh to post about.",
    undercut: [
      "Lean on the fact that yours already works — 'the one you already love, in stock now'.",
      "Drop your own twist quickly. A small variation on their idea can win back attention.",
      "Push customer reviews of your version. Their new thing has no reviews yet.",
    ],
  }),
  menu_change: () => ({
    doingWell:
      "A menu refresh gets regulars to come back in. The team gets excited and that energy shows up in service.",
    undercut: [
      "Bring back a customer favourite for a limited run. Remind regulars why they love you.",
      "Steal the dish idea and do it better. Menus aren't protected — execution is.",
      "Lean on consistency in your posts: 'the thing you come here for, every visit'.",
    ],
  }),
  price_change: (s) => ({
    doingWell:
      s.summary.toLowerCase().includes("rising") || s.summary.toLowerCase().includes("increasing")
        ? "They're testing whether customers will pay more. If it sticks, the whole market resets and you can do the same later with cover."
        : "Cutting prices grabs attention from people watching their spending right now.",
    undercut: [
      "Hold your price. Their increase is your opening — be the better value option.",
      "Add a small loyalty perk (free coffee on the 10th, members' hour) to soften the comparison.",
      "Don't react the same week — let their customers feel the increase first, then welcome them in.",
    ],
  }),
  hire: () => ({
    doingWell: "Hiring publicly signals they're growing — and they may be eyeing your team.",
    undercut: [
      "Have a quick check-in with your team this week. Keeping good people is cheaper than replacing them.",
      "Notice what role they're hiring for — it tells you what they're betting on next.",
    ],
  }),
  other: () => ({
    doingWell: "They post often, which keeps them showing up in feeds. Consistency beats polish on social.",
    undercut: [
      "Check how often you post. If they post twice as much as you, that gap grows over time.",
      "Match their volume with easy content — behind the scenes, customer photos — and save your effort for the posts that count.",
    ],
  }),
};

export function recommendationFor(signal: Signal): Recommendation {
  const fn = BY_TYPE[signal.signalType] ?? BY_TYPE.other;
  return fn(signal);
}

export function strengthsFor(signal: Signal): string {
  const delta = signal.engagementDelta;
  if (delta > 0.75) {
    return `This post is doing ${Math.round(delta * 100)}% better than their usual. Something about it really landed — worth a closer look at what they did differently.`;
  }
  if (delta > 0.25) {
    return `Engagement is ${Math.round(delta * 100)}% above their usual. A solid hit — people are paying attention.`;
  }
  if (delta < -0.2) {
    return `Engagement is ${Math.abs(Math.round(delta * 100))}% below their usual. They ran it anyway, which suggests it's doing a job (clearing stock, defending customers) rather than chasing likes.`;
  }
  return `Engagement is roughly normal for them — no breakout, but the offer itself might still be the threat.`;
}
