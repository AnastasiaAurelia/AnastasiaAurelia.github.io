## What this article is — and is not

A ten-minute screen recording can be deceptively dense. The speaker moves quickly through token metadata, launch modes, wallet groups, funding, launch execution, post-launch selling, and a second "organic" mode while assuming the viewer already knows what a mint, holder wallet, funder, block, front-run, MEV, and supply distribution are. If you do not already live inside Solana launch tooling, the buttons are easier to follow than the system.

This article rebuilds that system from the recording, in order, and explains what each visible control appears to mean. `[PRACTITIONER]` marks what the speaker explicitly demonstrates or says. `[SYNTHESIS]` marks my interpretation of how the pieces fit together. The screenshots are frames from the source video; timestamps refer to the recording.

> **Important boundary**
> Some features shown in the recording are explicitly described as making coordinated activity look "clean," "stealthy," or "organic," avoiding terminal flags, and reducing the chance of being front-run. Those are not neutral UX details. This article explains what those claims mean and why they matter, but it does not turn concealment, deceptive market appearance, or sandwiching into a reproducible playbook.

The simplest mental model is this: **Proxima is acting as an orchestration layer around a token launch.** Instead of manually creating a token, managing many wallets, funding them, submitting buys, watching the launch, and later selling from those wallets one by one, the interface coordinates those actions from one control surface.

## Chapter 1. Start With the System, Not the Buttons

Before touching the interface, separate the objects involved. A beginner will otherwise treat every address on screen as "a wallet" and miss why there are several different roles.

**Token.** The asset being created. In the demo it is a tutorial token. The token has a name, symbol, image, description, links, and an on-chain mint/contract address.

**Launchpad.** The venue where the token is created and begins trading. The speaker chooses Solana and a Pump-style launch path. The recording also claims the product supports other chains and venues, but those are not demonstrated in detail.

**Developer wallet.** The wallet associated with the creator side of the launch. The interface can assign a developer buy separately from the rest of the holder allocation.

**Holder wallets.** A set of wallets intended to end up holding portions of the token supply. Instead of one address owning the whole position, the position can be split across several addresses.

**Funder.** The address that receives the SOL used to finance the launch workflow, then distributes funds to the wallets that need them.

**Launch manager / bundler.** The coordinator. It calculates funding needs, prepares the participating wallets, submits transactions, tracks whether the coordinated build succeeded, and exposes controls for later buys, sells, reward claims, and withdrawals.

`[SYNTHESIS]` The key idea is that the bundler is not the token and it is not the market. It is the **control plane** sitting above several wallets and transactions. That distinction explains almost every screen that follows.

## Chapter 2. Token Configuration Is Mostly Metadata

The first configuration screen is the least mysterious part of the workflow. The speaker creates a new launch, chooses Solana, selects a launchpad, and fills in token details: name, description, image, and optional links.

<!-- visual:token-configuration -->

At roughly **01:18**, the screen shows the token-details form. `[PRACTITIONER]` The speaker names the token "tutorial," describes it as a coin made for a tutorial video, uploads an image, and explains that X/Twitter and website links can be attached to the token.

A beginner-friendly translation:

1. **Name / symbol** identify the asset in wallets and trading interfaces.
2. **Description** is human-readable context.
3. **Image** is the token's visual identity.
4. **Social / website links** are discoverability metadata, not trading logic.
5. **Custom token address / mint options** are advanced controls for cases where the creator already has a token or specific address material to use.

The important distinction is **metadata versus execution**. Nothing in this section determines how many wallets buy, how the funds are distributed, or how the initial transactions are sequenced. That comes in the launch settings.

## Chapter 3. Launch Mode Changes the Execution Pattern

The most important screen appears around **02:26**. The interface exposes three launch modes: **Block-0**, **Organic**, and **Manual**.

<!-- visual:launch-modes -->

The right-hand panel describes Block-0 as prioritizing execution certainty and sniper resistance over natural price action. That sentence contains the entire tradeoff.

### Block-0, in plain English

`[PRACTITIONER]` The speaker describes Block-0 as a mode where the coordinated buying happens at the beginning of the launch so that the desired position is acquired before unrelated traders can get ahead of it. The interface asks for a developer percentage, a holders' percentage, and a holder count.

Suppose the creator wants some initial allocation divided among several wallets. Conceptually, the bundler has to solve four problems:

1. **How much of the launch should the developer side acquire?**
2. **How much should the holder group acquire?**
3. **Across how many wallets should that holder position be split?**
4. **How should the transactions be ordered so the intended buys execute before competing transactions materially change the price?**

That fourth point is why this is not just a "multi-wallet" feature. It is also an execution-order feature.

### Why price can differ when orders arrive later

On an automated market or bonding-curve launch, later buyers can face a different price from earlier buyers because previous trades have already moved the state of the market. If you submit many independent buys over time, you are exposed to whatever happens between those transactions.

Block-0 is designed to reduce that uncertainty by concentrating the coordinated action into the earliest execution window. `[SYNTHESIS]` In system terms, it trades **natural-looking temporal dispersion** for **deterministic sequencing**.

### Holder count is not the same as supply

The interface separates *how much* is acquired from *how many wallets* receive it. Five percent across five wallets is still five percent total; the holder count changes the distribution topology, not the total economic exposure.

That distinction matters because a dashboard that only looks at "number of holders" can tell a different story from a dashboard that clusters funding sources and transaction timing.

## Chapter 4. Wallet Roles: Why the Interface Has More Than One Group

At roughly **03:18**, the recording moves into wallet selection and import.


`[PRACTITIONER]` The speaker selects multiple wallets for the holder side and refers to additional wallet roles around the execution path. The recording also mentions centralized-exchange funding as an optional route for additional "stealth."

For a beginner, the safest way to understand this screen is as a **transaction graph**:

- one address begins with the capital;
- capital is distributed outward;
- several participant wallets receive enough SOL to perform their assigned action;
- those wallets then interact with the launch;
- after the launch, token balances may be moved or managed from the launch dashboard.

`[SYNTHESIS]` The more important question is not "how many wallets exist?" but **whether those wallets are economically independent**. Ten addresses controlled and funded by one operator are ten on-chain addresses, but not ten independent market participants.

That is why the speaker's repeated use of terms such as "clean," "stealth," and "not flagged" deserves scrutiny. Address count can be visible while common control is obscured.

## Chapter 5. The Funder Is the Capital Distribution Hub

After the launch configuration is created, the interface presents a **funder** address. The speaker sends SOL to it, waits for the balance to arrive, and then triggers distribution.


At roughly **03:48**, the launch view shows the funding state and participating wallets. `[PRACTITIONER]` The speaker explains that the funder sends the required money to the wallets prepared for the launch.

A beginner can think of this as a two-stage cash flow:

**Stage A — operator to funder**

The operator moves one pool of SOL into the launch's funding address.

**Stage B — funder to execution wallets**

The system divides that pool according to what each wallet needs for its assigned buy plus transaction costs.

Why use a funder instead of manually paying every wallet? Because the bundler already knows the launch configuration. It can calculate the destination set and expected requirements, then execute the fan-out automatically.

### Withdrawal and "dust"

The speaker also demonstrates a withdrawal concept and refers to "dust." In wallet tooling, dust usually means a small residual balance left behind rather than emptying an address completely. The visible toggle is therefore not a mysterious trading feature; it is balance housekeeping.

`[SYNTHESIS]` This is a useful systems distinction: **funding is infrastructure; buying is market action.** The funding graph prepares the wallets. The later launch transactions are what actually interact with the market.

## Chapter 6. Launch Is the Moment Configuration Becomes Transactions

Once the wallets are funded, the speaker clicks **Launch**. The recording then moves from configuration screens to a live launch-management dashboard.

`[PRACTITIONER]` The speaker notes that the contract/mint address can be visible before the launch is executed, then triggers the launch and says the coin is live.


At approximately **05:26**, the UI shows the live market panel alongside wallet rows and creator controls. This is the point where the earlier abstractions become observable state:

- the token exists;
- the market has started trading;
- participating wallets have token balances or transaction statuses;
- the creator can see the coordinated build's progress;
- creator rewards/fees can be claimed;
- subsequent wallet actions can be managed from the same interface.

### What "build succeeded" means here

Later, around **06:19**, the interface reports that the build succeeded and the speaker says the configured wallets bought the token.


`[SYNTHESIS]` "Build" in this interface is not software compilation. It is the completion of the configured launch execution: the wallet set was prepared, funded, and the intended launch transactions reached the required state.

This is a good example of domain language being overloaded. A software engineer sees "build" and thinks source code to artifact. In this product, **build means coordinated launch construction**.

## Chapter 7. What the Video Calls "Stealth" Is the Part You Should Examine Most Carefully

The recording repeatedly frames certain options in terms of avoiding detection or appearing natural. `[PRACTITIONER]` The speaker says one preset is less likely to be flagged in trading terminals, calls exchange-routed funding additional stealth, describes wallet actions intended to avoid being front-run, and later says Organic mode "looks more organic."

Those phrases are not interchangeable, so separate them.

### Privacy

Privacy means limiting unnecessary disclosure of information. A user may have legitimate reasons not to publish every internal treasury relationship.

### Execution protection

Execution protection means reducing the chance that another trader observes an intended transaction and races or reorders around it. This is related to MEV and transaction ordering.

### Evasion of analytics

Trying to make commonly controlled wallets look unrelated to analytics systems is different. The objective is no longer merely transaction quality; it is changing what observers infer about control or distribution.

### Manufactured appearance of organic demand

Distributing coordinated buys over time so that they *look like independent organic participation* is different again. If observers interpret that activity as unrelated market demand, the appearance can be misleading even though every individual transaction is publicly recorded.

`[SYNTHESIS]` This is the conceptual trap in bundler UIs: **on-chain transparency does not automatically produce economic transparency.** The ledger can show every transaction accurately while still leaving the ownership and coordination model ambiguous.

## Chapter 8. Selling, "Nuke," and Why Exit Controls Matter

After the demonstration launch, the speaker says it is only a tutorial token and does not intend to rug anyone. The recording then shows a control referred to as **Nuke**, used to sell the supply held by the configured wallets, including an option to include the developer wallet.

`[PRACTITIONER]` The speaker sells the tutorial position, claims creator rewards, and withdraws remaining funds.

For a beginner, treat this as the reverse path of the launch:

1. **Launch path:** SOL moves into wallets; wallets acquire tokens.
2. **Exit path:** wallets sell tokens; value returns to SOL or another quote asset.
3. **Settlement path:** remaining funds and creator rewards can be withdrawn.

The important market-structure point is that a one-click coordinated sell across wallets is economically very different from several independent holders deciding to sell. The interface may expose many wallet rows, but the control surface can collapse them into one operator decision.

That is why holder count alone is a weak measure of decentralization.

## Chapter 9. Organic Mode Changes Timing, Not Control

The second launch begins around **07:54**, when the speaker switches to **Organic Mode**.


`[PRACTITIONER]` The speaker explains that Organic mode spreads buys across multiple blocks instead of acquiring everything in the first coordinated execution. The stated benefit is that the activity looks more organic; the stated cost is that the operator can be front-run and cannot guarantee the exact supply acquired.

This is easiest to understand as a timing diagram.

**Block-0 style:**

`launch -> coordinated early acquisition -> later unrelated market activity`

**Organic style:**

`launch -> buy A -> block gap -> buy B -> block gap -> buy C -> ...`

The second pattern introduces more market exposure between buys. Price can move. Other traders can transact. The eventual token amount is therefore less predictable.

### What the interface asks for changes too

The speaker explicitly says that in Organic mode the user does not select a guaranteed supply percentage in the same way; instead the system works from an amount of SOL to spend because future execution prices are not known in advance.

That is a direct consequence of the mode's design. If the transactions happen later and across changing market states, **the input can be fixed while the output becomes variable**.

This is one of the most important concepts in the whole recording:

**Deterministic execution:** choose the desired result more directly, accept concentrated timing.

**Market-exposed execution:** choose a spending plan, accept uncertainty in how much supply that plan ultimately acquires.

## Chapter 10. Organic Wallet Funding Is Still Coordinated Funding

Around **09:17**, the recording shows the wallets funded for the Organic-mode launch.


The timing of the buys has changed, but the ownership structure has not magically become independent. `[PRACTITIONER]` The speaker still configures the wallets, funds them through the launch flow, and launches them from one interface.

`[SYNTHESIS]` That gives us a precise definition:

**Organic mode changes the execution pattern; it does not prove organic participants.**

This distinction is easy to miss because the word "organic" sounds like a property of the market participants. In the recording it is primarily a property of **how coordinated buys are distributed over blocks**.

That is a much narrower claim.

## Chapter 11. A Beginner's Map of Every Major Control

| Control / concept | What it means in the recording | What a beginner should remember |
|---|---|---|
| Chain | Network where the token launches | Different chains have different launch mechanics and transaction models |
| Launchpad | Venue / protocol used for creation and initial trading | The bundler orchestrates around the venue; it is not the venue itself |
| Token metadata | Name, image, description, links | Identity and discoverability, not execution |
| Developer buy | Creator-side initial acquisition | Separate from the holder-wallet allocation |
| Holders buy | Aggregate acquisition assigned to holder wallets | Total position and wallet count are separate variables |
| Holder count | Number of addresses receiving the coordinated position | Address count does not imply independent ownership |
| Funder | Address that supplies capital to execution wallets | Think "capital distribution hub" |
| Distribute | Fan funds from the funder to participant wallets | Preparation step before market interaction |
| Block-0 | Concentrated early execution | More certainty, less temporal dispersion |
| Organic mode | Buys spread over multiple blocks | More market exposure, less certainty |
| Build status | Whether the configured launch workflow completed | "Build" here means coordinated launch execution |
| Creator fees / rewards | Revenue associated with creator activity | Separate from token trading P&L |
| Nuke / sell-all style control | Coordinated liquidation across configured wallets | Many wallets can still represent one operator decision |
| Withdraw | Move remaining funds out of the launch workflow | Settlement / treasury operation |

## Chapter 12. The Whole Flow, End to End

If the individual screens still feel disconnected, reduce the recording to one pipeline:

1. **Choose the network and launch venue.** This defines the execution environment.
2. **Define token metadata.** This creates the human-facing identity of the asset.
3. **Choose an execution mode.** This determines whether the launch prioritizes concentrated certainty or spread-out timing.
4. **Specify the economic plan.** Developer allocation, holder allocation or spending amount, and number of wallets.
5. **Select/import wallets.** These are the addresses the system will coordinate.
6. **Fund the launch.** SOL enters the funder address.
7. **Distribute capital.** The funder sends required balances to participating wallets.
8. **Launch.** The token goes live and the configured transactions begin executing.
9. **Observe the build.** The dashboard tracks wallet status, balances, market activity, and completion.
10. **Manage the position.** The operator can perform later buys or sells from the managed wallet set.
11. **Settle.** Creator rewards and remaining funds can be withdrawn.

`[SYNTHESIS]` The product's value proposition is therefore not "create a token." Token creation is only one step. The product is selling **coordination**: one interface for metadata, capital routing, multi-wallet execution, launch monitoring, and exit management.

That is why calling it a "bundler" can undersell what is happening. It is closer to a **launch orchestration system**.

## Chapter 13. What the Video Does Not Prove

A careful reading should also mark the limits of the source.

The video demonstrates one operator's workflow and makes several product claims. It does **not** independently verify that every supported chain behaves identically, that every anti-front-run claim works under all network conditions, that a preset reliably avoids third-party clustering, or that activity labelled "organic" will be interpreted as organic by sophisticated analytics.

The speaker also mentions several other venues and chains near the end, but the recording does not walk through those flows. This article therefore does not generalize the exact Solana screens into exact instructions for Ethereum, Base, BNB Chain, or other environments.

That source discipline matters. A product demo tells us very well **what the product intends to do and how the presenter uses it**. It is weaker evidence for universal performance or detection-resistance claims.

## Chapter 14. The One Mental Model to Keep

If you remember only one picture, use this one:

**Metadata layer** — what the token is called and how it is described.

**Capital layer** — where the SOL starts and how it is distributed.

**Wallet layer** — which addresses participate and what role each one has.

**Execution layer** — when and in what order transactions hit the market.

**Monitoring layer** — whether the launch and wallet actions succeeded.

**Exit layer** — how positions, rewards, and remaining capital are sold or withdrawn.

Proxima's interface places all six layers behind one dashboard. The beginner mistake is to see a collection of buttons. The more accurate interpretation is a **state machine for a coordinated token launch**.

And the critical analytical question is not merely whether the system works. It is **what an outside observer is meant to infer from the activity it creates**. Execution protection, wallet management, privacy, analytics evasion, and manufactured organic appearance may sit next to each other in the same UI, but they are not ethically or economically equivalent.

## Source and screenshot notes

Primary source: B / @bschizojew, X video, approximately 10:58, supplied for this article from the public post: [source video](https://x.com/bschizojew/status/2106126122828361906?s=20).

Screenshots in this article are direct frames from that recording at approximately 01:18 and 02:26. UI labels and claims are described as they appear in the source; where the transcript was ambiguous, the visible UI was used to avoid silently inventing terminology.
