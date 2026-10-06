## What this article is — and is not

This article is a beginner-first walkthrough of a 10-minute screen recording in which the speaker demonstrates **Proxima**, a multi-chain token-launch manager. The recording is promotional: the speaker repeatedly recommends the product, shows a referral flow at the end, and makes performance and stealth claims that are not independently verified here. The goal of this article is therefore **not** to repeat those claims as facts. It is to decode the interface, explain the moving parts, and make the on-chain logic understandable to someone who has never launched a token before.

The source video spends most of its time on Solana and a Pump.fun-style launch flow. It also mentions other chains and venues, but does not demonstrate them in comparable detail. Where the video says something like “this works on every chain,” treat that as the speaker's claim, not as a verified compatibility matrix.

> **Important framing**
> A launch manager can coordinate wallets, funding, purchases, transfers, and sales. Those same capabilities can be used for legitimate treasury or launch operations, but they can also be used to make coordinated activity look less coordinated. The video itself uses phrases such as “stealth,” “not flagged,” and “looks organic.” This article explains those mechanics without giving an evasion playbook.

<!-- visual:dashboard -->

## Chapter 1. The mental model: what a “bundler” is actually doing

The easiest mistake is to hear *bundler* and imagine one magical transaction. The interface in the video is better understood as an **orchestrator for a launch workflow**.

A normal manual launch can involve several separate jobs:

1. create or configure the token;
2. decide which wallet creates it;
3. decide which wallets will buy it;
4. fund those wallets with SOL;
5. submit the launch and buy transactions;
6. monitor which wallets received tokens;
7. later sell, transfer, or withdraw funds.

Proxima puts those jobs behind one dashboard. In the recording, the user does not manually copy five addresses into five terminals and sign transactions one by one. The interface creates a launch object, assigns wallet roles, distributes SOL, and then coordinates the launch and follow-on actions.

That is the first useful mental model:

**Proxima is not the token and it is not the launchpad. It sits between the operator and the launchpad as a control surface for many wallets and many transactions.**

This distinction matters because the launchpad still determines the market mechanics. Proxima is automating *how the operator participates in those mechanics*.

## Chapter 2. Token configuration: the simple part first

The recording starts with **Create Launch**, chooses Solana, and then chooses a Pump.fun-style launch path. The next screen looks familiar if you have ever created a token: name, symbol, description, image, and optional social links.

<!-- visual:token-config -->

The fields are conceptually simple:

- **Name / symbol** identify the token in wallets and interfaces.
- **Description** is human-readable metadata.
- **Image** becomes part of the token's displayed identity.
- **X / website links** are metadata references that trading interfaces may display.
- **Advanced / custom contract fields** are for cases where the operator is not starting from a completely fresh default launch.

The speaker loosely describes a custom token address as “put your mint here” and then says “it means private key.” Those are not the same concept. A **mint address** is a public identifier for a Solana token mint; a **private key** is secret signing material. The video does not explain that distinction carefully, so a beginner should not treat that sentence as a precise definition.

At this stage nothing interesting has happened economically yet. You have only defined the object that will be launched and how it should appear.

## Chapter 3. The real decision: launch mode

The important part of the interface appears when the video reaches **Launch Settings**. The speaker contrasts two modes: **Block-0 Mode** and **Organic Mode**.

<!-- visual:mode-selector -->

Think of the difference as a question of **when and how coordinated buying happens**.

### Block-0 Mode

The speaker describes Block-0 as concentrating the desired initial acquisition at the launch boundary, so the controlled wallets get their intended position before ordinary market participants can get in front of them. The interface exposes parameters for a developer allocation, a target amount or supply share, and holder-wallet distribution.

The important idea is not the exact percentages shown in the demo. It is the sequencing:

**launch event → coordinated initial buys → tokens distributed across selected wallets**

This is why the speaker talks about avoiding being “sniped” or “front-run.” In plain English, the operator wants its own transactions to land before competing traders can react to the new token.

### Organic Mode

Later, the speaker demonstrates Organic Mode and explicitly says the purchases are spread across multiple blocks so that they “look organic.” Here the operator specifies an amount to spend rather than a guaranteed supply percentage, because market conditions can change between purchases.

The sequencing becomes:

**launch event → market opens → purchases occur over multiple blocks → final acquired supply depends on execution prices**

That creates more market risk. Other traders can buy or sell between the coordinated purchases, so the operator no longer knows exactly how much token supply a fixed amount of SOL will acquire.

The labels “Block-0” and “Organic” are product terminology. The deeper distinction is **atomic-ish early coordination versus time-distributed market participation**.

## Chapter 4. Wallet roles: one operator, several identities on-chain

The interface then asks how many holder wallets should participate. This is where a beginner can lose the plot, because one human is now controlling several blockchain addresses.

<!-- visual:block-zero-settings -->

A wallet address is simply an on-chain account identity. If one operator controls six wallets, the chain still records six separate addresses. The blockchain does not automatically annotate them with “same human.” Analysts infer common control from funding paths, timing, transaction patterns, shared counterparties, and other signals.

The recording shows several kinds of wallet roles:

- a **developer wallet**, associated with the launch itself;
- **holder wallets**, intended to end up holding portions of the token;
- temporary or intermediate wallets used during the coordinated buy flow;
- a **funder**, which supplies SOL to the wallets that need transaction capital.

The speaker also mentions a “clean build” and centralized-exchange funding as ways to reduce obvious linkage. That is a crucial analytical point: **splitting activity across addresses does not create independent economic actors; it only changes the observable graph.**

For a beginner, the correct question is not “How many wallets are there?” but:

**Who ultimately controls them, where did their money come from, and how synchronized are their actions?**

## Chapter 5. The funder: why the launch needs a capital-distribution step

Before a wallet can buy a token on Solana, it needs SOL. SOL pays both for the asset purchase and for transaction fees. That means a multi-wallet launch has a bootstrapping problem: every participating wallet needs capital before it can act.

The recording solves that with a **funder address**.

<!-- visual:funder -->

The operator sends SOL to the funder, then presses **Distribute**. The interface allocates funds from that central pool to the wallets involved in the launch.

Conceptually:

`operator capital → funder → participating wallets → launch / buys`

This is operationally convenient because the user only has to top up one address. It is also analytically important because funding relationships are one of the strongest clues that supposedly separate wallets may be coordinated.

The video includes a withdrawal function that sends unused SOL back to an address chosen by the operator. The “leave dust” option means intentionally leaving a tiny residual balance instead of sweeping a wallet completely empty.

Again, the key concept is **capital routing**. The funder is not creating money; it is distributing the operator's money to the accounts that will execute the strategy.

## Chapter 6. What happens at launch

Once the wallets are funded, the speaker presses **Launch**. The token goes live and trading begins.

The video then moves to a market view showing the token, chart, wallet list, positions, and buy/sell controls.

<!-- visual:live-launch -->

There are now two layers to keep separate in your head:

1. **the public market**, where anybody can buy or sell the token; and
2. **the operator's controlled wallet set**, which the launch manager can act on together.

The speaker says other traders bought after the operator's initial position. That is exactly why the timing of the initial coordinated transactions matters economically: earlier purchases get a different entry price than later purchases if the launch mechanism has a rising bonding curve or otherwise price-sensitive execution.

The recording also shows a “claim rewards / creator fees” area. Those are proceeds associated with the launch mechanism, distinct from gains or losses on the token positions themselves.

A beginner should therefore separate three money buckets:

- **capital deposited** to fund wallets;
- **token-position P&L** from buying and selling;
- **creator / launch fees or rewards** generated by the launch venue.

They can all appear on one dashboard, but they are not the same source of money.

## Chapter 7. Why “stealth” and “looks organic” deserve scrutiny

This is the most important interpretive chapter, because the video uses product language that can make coordinated behavior sound cosmetically normal.

The speaker says the system can distribute supply “stealthily,” mentions funding routes for “additional stealth,” says one mode is less likely to be flagged in trading terminals, and describes Organic Mode as making purchases “look organic.” Those are not neutral phrases. They tell you that **appearance to outside observers is part of the product value proposition being demonstrated.**

That does not automatically prove fraud or manipulation. There are legitimate reasons to use multiple wallets: operational separation, treasury structure, key-risk compartmentalization, testing, market-making mandates, or access controls. But the analytical burden changes when the explicit objective is to make common control less visible.

A useful rule is:

**Address diversity is not the same as owner diversity.**

If five wallets are funded by one source, buy the same new token within a tightly synchronized window, and later sell through the same control interface, an analyst should not casually interpret them as five independent holders.

This is also why wallet-distribution charts on token terminals can be misleading if read literally. “Top 10 holders own X%” is only an address-level statistic. It says nothing by itself about how many independent people control those addresses.

## Chapter 8. The sell / “nuke” step: coordinated exit in one control surface

After demonstrating the launch, the speaker says the token is only a tutorial and uses a bulk sell function labeled **Nuke**. The interface allows selected controlled wallets, including the developer wallet, to sell their token balances.

<!-- visual:wallet-control -->

The important concept is **batched control**, not the dramatic button name.

Without a launch manager, an operator might need to open each wallet and submit separate sell transactions manually. With a control surface, the operator can issue a higher-level instruction and let the system coordinate the underlying transactions.

Economically, selling many controlled positions can move the market sharply, particularly in a thin-liquidity token. That means a dashboard action that looks like one click can represent a large amount of on-chain sell pressure.

The recording's tutorial token is sold shortly after launch. The speaker explicitly says the intention is to close a test position, not to “rug” participants. That statement explains the speaker's claimed intent in this example; it does not establish what every similar workflow is used for in the wild.

## Chapter 9. Organic Mode: same orchestration, different execution risk

The second demonstration repeats most of the same workflow with Organic Mode.

<!-- visual:organic-mode -->

The token metadata is configured again, wallets are selected, a funder is topped up, and funds are distributed. The key difference is that the purchases are not treated as one tightly packed initial acquisition. They are spread through the market over time.

That changes three things:

1. **Price certainty falls.** Each later purchase may execute at a different price.
2. **Supply certainty falls.** A fixed SOL budget buys an unknown final percentage of supply.
3. **Interaction with other traders increases.** Other transactions can land between the operator's transactions.

The video explicitly acknowledges this: the speaker says the operator can lose money or be front-run in Organic Mode.

<!-- visual:organic-funded -->

Notice what does *not* change: the wallets are still coordinated by one interface and funded as part of one launch plan. “Organic” here describes the *execution pattern*, not necessarily independent ownership.

That distinction is essential. A sequence can look temporally less synchronized while still being centrally orchestrated.

## Chapter 10. The complete flow, end to end

If the UI still feels like a blur, reduce the entire recording to this state machine:

1. **Define the token.** Name, symbol, description, image, links.
2. **Choose a launch venue and mode.** This determines the execution pattern.
3. **Assign wallet roles.** Developer, holders, and any intermediate participants.
4. **Choose the acquisition plan.** How much capital or supply the controlled set is intended to acquire.
5. **Fund the system.** Send SOL to the funder.
6. **Distribute capital.** Move SOL from the funder to the wallets that will transact.
7. **Launch.** Create the token / open the market.
8. **Execute buys.** Either concentrated near launch or spread across blocks, depending on mode.
9. **Monitor positions.** The dashboard aggregates controlled wallets and market state.
10. **Manage the exit.** Sell, transfer, claim fees, and withdraw remaining SOL.

That is all the product is doing at the highest level: **turning a complicated multi-wallet transaction graph into a guided workflow.**

The complexity comes from what that graph means to outsiders. A screen can show five holder wallets, but economically there may still be one decision-maker. A screen can show purchases over several blocks, but those purchases may still have been scheduled by one launch configuration.

## Chapter 11. What the video does not establish

The recording is useful as a product demonstration, but it leaves several questions unanswered.

### It does not prove the marketing claims

The speaker calls Proxima the “best bundler in the market” and presents revenue / P&L figures on the account dashboard. The video does not provide independent evidence for those claims, methodology for the P&L calculation, or a comparison against competitors.

### It does not explain custody and key security in depth

The interface imports and manages wallets, but the recording does not give a security architecture for where keys are stored, how they are encrypted, whether signing occurs locally or remotely, what recovery model is used, or what happens if the service is compromised.

For any tool that controls multiple funded wallets, those questions matter more than the convenience of the launch screen.

### It does not prove activity is undetectable

The speaker talks about avoiding flags and increasing stealth. That is not the same as proving that sophisticated chain analytics cannot cluster the wallets. Funding provenance, transaction timing, shared behavior, common exits, and program interactions can all provide linkage signals.

### It does not explain legal or venue-policy boundaries

The recording is a technical product demo, not legal advice. Market-manipulation rules, platform terms, disclosure requirements, and token-launch obligations vary by jurisdiction and venue. A workflow being technically possible does not make every use of it permissible.

## Chapter 12. How to read a launch like an analyst

The most valuable lesson from the recording is not which button to press. It is the list of questions the interface teaches you to ask when inspecting a token launch from the outside.

When you see many early wallets, ask:

- Did they receive funding from the same source?
- Were they created or funded within the same narrow time window?
- Did they buy in unusually synchronized patterns?
- Did tokens later consolidate or move through common destinations?
- Did several wallets sell at nearly the same time?
- Are apparent “holders” economically independent, or merely separate addresses?

When you see a clean-looking holder distribution, ask whether the distribution describes **addresses** or **beneficial owners**.

When you see a launch that appears organic because buys are spread out, ask whether timing alone is enough to infer independence.

And when a tool advertises “stealth,” ask what observable relationship it is trying to make harder to see: funding, timing, ownership, transaction ordering, or all of the above.

That is the durable mental model. The specific UI will change. The underlying graph — capital source, wallet control, timing, token flow, and exit behavior — is what survives product changes.

## Glossary

**Bundler / launch manager** — In this video, a control system that coordinates token-launch configuration, wallets, funding, purchases, transfers, and sales. The word is product-context specific; do not assume it means the same thing as “bundler” in unrelated blockchain infrastructure.

**Developer wallet / dev wallet** — The wallet associated with creating or controlling the launch in the demonstrated workflow.

**Funder** — A wallet used as the capital source for other participating wallets.

**Holder wallet** — A wallet intended to hold some portion of the token supply after the coordinated launch flow.

**Mint address** — On Solana, the public address identifying a token mint. It is not a private key.

**Private key** — Secret cryptographic signing material that authorizes transactions for an account. It should never be exposed publicly.

**Front-running** — Broadly, another participant getting a transaction executed ahead of yours after learning or predicting that your transaction is coming. Exact mechanisms differ by chain and venue.

**Sniping** — Informal trading slang for attempting to buy a newly launched token extremely early, often with automation.

**Block** — A unit in which blockchain transactions are ordered and finalized. Solana's execution details differ from Ethereum's, but for this article the beginner-safe mental model is simply “a small slice of ordered chain activity.”

**Bonding curve** — A pricing mechanism where the token price changes according to a formula as supply is bought or sold. The source video assumes familiarity with the launch venue and does not derive its curve mathematically.

**Creator fee / reward** — Revenue associated with the token's launch or trading mechanism, separate from the P&L of holding the token itself.

**Dust** — A tiny residual balance intentionally or unintentionally left in a wallet after funds are moved out.

## Source and evidence notes

Primary source: the screen recording posted by the speaker on X and supplied with this article as a local video/transcript reference. Screenshots in this article are frames from that recording, captured at the timestamps indicated in their captions. The article's descriptions of what the speaker says are source-derived; interpretive explanations are clearly separated from claims that the video itself demonstrates.

The source recording is promotional and contains a referral-code segment. This article intentionally omits the referral code because it is not necessary to understand the system.

The article also does not reproduce an operational recipe for disguising common wallet control or evading detection. Where the video frames a feature as “stealth” or “organic,” the explanation focuses on what observable transaction structure is being changed and why that matters analytically.

[Original X post](https://x.com/bschizojew/status/2106126122828361906?s=20)
