import type { NewStory } from "./types";

export const SEED_STORIES: NewStory[] = [
  {
    title: "Save a card for faster checkout",
    description:
      "As a returning shopper, I want to save my card details securely, so that I can check out without re-entering them.",
    acceptanceCriteria: [
      "Given I am signed in, when I tick 'Save this card' at payment, then the card is stored as a token and never as the full number.",
      "Given I have a saved card, when I reach payment, then it is preselected and only the CVV is requested.",
      "Given I remove a saved card, when I return to payment, then it no longer appears.",
    ],
    status: "in_progress",
    priority: "high",
    points: 8,
    epic: "Checkout",
  },
  {
    title: "Show delivery fee before the payment step",
    description:
      "As a shopper, I want to see the delivery fee as soon as I enter my address, so that there are no surprises at payment.",
    acceptanceCriteria: [
      "Given I enter a valid address, when the address is saved, then the cart total updates with the delivery fee within 1 second.",
      "Given my address is outside the delivery area, when I save it, then I see a clear message and cannot continue.",
    ],
    status: "ready",
    priority: "critical",
    points: 3,
    epic: "Checkout",
  },
  {
    title: "Apply a promo code at checkout",
    description:
      "As a shopper, I want to apply a promo code, so that I receive the discount I was offered.",
    acceptanceCriteria: [
      "Given a valid code, when I apply it, then the discount is shown as its own line item.",
      "Given an expired code, when I apply it, then I see why it was rejected.",
      "Only one promo code can be active per order.",
    ],
    status: "backlog",
    priority: "medium",
    points: 5,
    epic: "Checkout",
  },
  {
    title: "Retry a failed payment without losing the cart",
    description:
      "As a shopper whose payment was declined, I want to retry with another method, so that I do not have to rebuild my cart.",
    acceptanceCriteria: [
      "Given my payment is declined, when I return to payment, then my cart and address are unchanged.",
      "Given I retry with a different method, when it succeeds, then only one order is created.",
    ],
    status: "backlog",
    priority: "high",
    points: 5,
    epic: "Checkout",
  },
  {
    title: "Sign in with a one-time email code",
    description:
      "As a shopper who forgets passwords, I want to sign in with a code sent to my email, so that I can get back into my account quickly.",
    acceptanceCriteria: [
      "Given I request a code, when it is sent, then it expires after 10 minutes.",
      "Given I enter a wrong code 5 times, when I try again, then I must request a new code.",
    ],
    status: "done",
    priority: "high",
    points: 5,
    epic: "Accounts",
  },
  {
    title: "Download my personal data",
    description:
      "As an account holder, I want to download the data held about me, so that I can see what is stored and meet my privacy rights.",
    acceptanceCriteria: [
      "Given I request an export, when it is ready, then I receive a link that expires after 24 hours.",
      "The export includes orders, addresses, and saved preferences in a readable format.",
    ],
    status: "backlog",
    priority: "medium",
    points: 8,
    epic: "Accounts",
  },
  {
    title: "Manage multiple delivery addresses",
    description:
      "As a shopper who sends gifts, I want to store several addresses, so that I can pick one at checkout.",
    acceptanceCriteria: [
      "Given I have saved addresses, when I reach delivery, then I can choose one or add a new one.",
      "I can mark one address as my default.",
    ],
    status: "ready",
    priority: "low",
    points: 3,
    epic: "Accounts",
  },
  {
    title: "Notify me when an out-of-stock item returns",
    description:
      "As a shopper, I want to be told when a sold-out item is back, so that I do not have to keep checking.",
    acceptanceCriteria: [
      "Given an item is out of stock, when I tap 'Notify me', then I am subscribed for that item only.",
      "Given the item is restocked, when stock is updated, then I receive one email within 15 minutes.",
    ],
    status: "backlog",
    priority: "low",
    points: 3,
    epic: "Notifications",
  },
  {
    title: "Send order status updates by SMS",
    description:
      "As a shopper, I want SMS updates when my order ships and arrives, so that I know when to expect it.",
    acceptanceCriteria: [
      "Given I opted in, when my order ships, then I receive one SMS with a tracking link.",
      "Given I did not opt in, when my order ships, then no SMS is sent.",
    ],
    status: "in_progress",
    priority: "medium",
    points: 5,
    epic: "Notifications",
  },
  {
    title: "Daily sales summary for the operations team",
    description:
      "As an operations lead, I want a daily summary of orders and revenue, so that I can spot problems before stand-up.",
    acceptanceCriteria: [
      "Given it is 7:00 AM, when the summary runs, then it covers the previous calendar day.",
      "The summary shows order count, revenue, refunds, and the top 5 products.",
    ],
    status: "ready",
    priority: "medium",
    points: 5,
    epic: "Reporting",
  },
  {
    title: "Track checkout drop-off by step",
    description:
      "As a product owner, I want to see where shoppers abandon checkout, so that I can prioritise the right fixes.",
    acceptanceCriteria: [
      "Given checkout events are recorded, when I open the report, then I see the percentage leaving at each step.",
      "I can filter the report by device type and date range.",
    ],
    status: "backlog",
    priority: "critical",
    points: 8,
    epic: "Reporting",
  },
  {
    title: "Export refunds to CSV for finance",
    description:
      "As a finance analyst, I want to export refunds for a date range, so that I can reconcile them with the bank.",
    acceptanceCriteria: [
      "Given a date range, when I export, then the file includes order ID, amount, reason, and refund date.",
      "Exports of more than 10,000 rows are emailed rather than downloaded.",
    ],
    status: "done",
    priority: "medium",
    points: 3,
    epic: "Reporting",
  },
];
