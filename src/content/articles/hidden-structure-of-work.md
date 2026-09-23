## Introduction

A decision can be formally approved and still go nowhere. A technically correct proposal can lose to a weaker one. A team can be accountable for a result it does not control, and a person with no direct reports can quietly determine whether a senior leader's plan succeeds. Most people who have worked in an organization have seen some version of this. The usual explanations are thin. "Politics" is blamed as though it were weather. Individuals are credited with charisma or faulted for poor execution. The org chart is redrawn in the hope that clearer boxes will produce clearer outcomes.

This article starts from a different premise. An org chart records who is authorized to decide. It does not record who controls the resources a decision needs, who depends on whom, what each party wants, what each party knows, whether promises will be believed, what anyone can do if others refuse, how reputations form, who is connected to whom, or who can afford to act. Those conditions often decide what actually happens. They are not noise around the formal structure. They are the rest of the structure.

The difficulty is that each of these conditions belongs to a different body of work. Research on organizational power explains leverage through dependence. Research on political skill explains why people in similar positions produce different results. Game theory offers precise tools for thinking about incentives, credibility, bargaining, information, and repeated interaction, but its results hold only under explicit assumptions that organizations rarely satisfy. Practitioner writing describes something the formal traditions tend to omit: the same move can carry very different costs for different people.

Taken one at a time, each tradition misleads in a predictable way. A pure hierarchy view misses dependence. A pure power view can make every interaction look like a contest. A pure game-theory view can treat a stable outcome as a fair one, or treat a model's prediction as a description of real people. A pure advice view can recommend visibility, authenticity, or networking as though they were equally safe for everyone. The problem this article addresses is how to use these lenses together without letting any one of them take over.

The argument proceeds in a single line. It begins with the gap between formal authority and the dependencies that shape implementation. It then asks where leverage comes from, how people turn structural positions into influence, and how strategic conditions such as incentives, credibility, alternatives, information, and repetition change what actors are willing to do. From there it moves to networks, which turn individual positions into collective capacity, and to the unequal constraints that make the same tactic cheap for one person and costly for another. It ends with a diagnostic method and an account of where that method stops working.

By the end, a reader should be able to look at a stalled project, a contested decision, or a negotiation that is not going anywhere and ask better questions. Who controls what the outcome requires? What can each party do if the other refuses? Which statements about the future are credible? What is each actor inferring from the others' behavior? Who is positioned to be heard? And who can afford which move?

### How to read the evidence labels

The article draws on sources of very different kinds, and it marks the difference where it matters. Labels appear only where the kind of claim could be misread.

<!-- variant:legend -->

- `[EMPIRICAL]` A result from a study with identified data and methods.
- `[FORMAL MODEL]` A result that holds within a mathematical model under stated assumptions. It is not evidence about how real people behave.
- `[CONCEPTUAL]` An author's argument, often supported by cases, not by measurement.
- `[PRACTITIONER]` Advice, interviews, or personal accounts from practitioner writing.
- `[SYNTHESIS]` This article's own integration, interpretation, or analogy, including every hypothetical example.

## Chapter 1. The Org Chart Is Not the Organization

An organization has at least two structures.

The first is visible. It is the org chart: boxes, reporting lines, job titles, approval rights, and formal responsibilities. It says who is supposed to decide, who is supposed to execute, and who is accountable when something goes wrong.

The second is harder to see. It is made of dependencies. Someone controls the data another person needs. Someone else is the only person who understands a system everyone relies on. A team can approve a project on paper and still need another team's cooperation for access, staff, budget, distribution, or technical support. A manager may have the authority to request a change without the credibility, time, or relationships needed to make it stick.

That second structure often determines what actually happens. Formal authority still matters. It is one resource inside a larger system of coordination. The person with the title may hold the right to decide while someone else controls the conditions under which the decision can be carried out.

[SYNTHESIS] **Hypothetical example.** A product manager receives approval to launch an internal analytics tool. The org chart says the product manager owns the launch. But the data team controls access to the source tables, security controls the review queue, finance controls the contractor budget, and a senior sales leader controls whether the largest customer-facing group adopts the tool. The product manager has formal ownership. The launch depends on four other forms of cooperation.

<!-- visual:V1 -->

If the launch stalls, "the product manager failed to execute" is an incomplete diagnosis. More useful questions follow. Who controlled the resources? Who had reasons to cooperate? Who could delay the work without formally blocking it? Which dependencies were visible before the decision was made?

Jeffrey Pfeffer's *Managing with Power* begins from a related problem. It treats decisions and their implementation as political processes, because interests differ, resources are distributed unevenly, and support has to be assembled across organizational boundaries (Pfeffer, 1992, pp. 3–31). This is a conceptual and case-based argument, not a causal estimate. Its value is diagnostic. It directs attention to the conditions surrounding a decision instead of judging the decision-maker only by the quality of the idea.

Organizations routinely confuse authority with control. A person can own an outcome without controlling its inputs. A team can be accountable for a metric while another team controls the queue, data, staffing, or system access that drives it. A leader can announce a priority while relying on people whose incentives still point elsewhere.

The same gap explains why technical merit is not enough. A correct proposal can solve the problem its author defined and still fail as an organizational intervention. It may threaten another team's resources, create work for people who were not consulted, arrive at the wrong moment, or require cooperation from people who receive none of the benefit. This is not an argument against analysis. It is an argument for analyzing the conditions that allow analysis to become action.

The practical shift is from asking "Who is in charge?" to asking "What has to happen for this decision to become real?" The answer is a map of dependencies. It shows where authority is concentrated, where resources are held, where cooperation is voluntary, and where the official structure and the working structure diverge.

[SYNTHESIS] The organization, on this view, is not the org chart plus interpersonal noise. It is a system in which formal authority and dependence interact.

Once dependence becomes visible, a sharper question follows. Why does one dependency create leverage while another does not? Why can one person's request be ignored while another's is treated as urgent? Answering that requires a vocabulary of power.

## Chapter 2. Power Begins With Dependence

Power is often described as a personal possession: confidence, charisma, status, force of personality. A more useful starting point is relational. Power begins with dependence.

One actor has leverage over another when the second actor needs something the first controls, and when that thing is hard to replace. The resource may be obvious, such as budget or formal approval. It may also be specialized knowledge, access to a decision-maker, control over timing, information about a system, legitimacy with a particular audience, or the ability to reduce uncertainty.

Pfeffer places this diagnosis near the beginning of *Managing with Power*, in a chapter on diagnosing power and dependence (Pfeffer, 1992, pp. 49–67). The book does not reduce relationships to numbers. It argues that influence becomes easier to understand once we ask what each party needs, what each party controls, and what alternatives exist. Four questions make that concrete:

1. What does actor A need from actor B?
2. How important is that resource to A's goal?
3. How hard would it be for A to obtain it elsewhere?
4. What would B lose by refusing, delaying, or redirecting it?

These questions do not calculate power. They expose its conditions.

Controlling a resource does not automatically make someone powerful. The resource must matter to someone else in the situation at hand. A senior executive may have formal authority and little leverage over a specialist who can leave, delay, or cooperate only minimally. A junior analyst with no direct reports may hold the only reliable understanding of a fragile data pipeline. The analyst's influence is not imaginary. It comes from a bottleneck.

[SYNTHESIS] **Hypothetical example.** A department head asks an operations specialist to redesign a reporting process by Friday. The department head can formally assign the work. The specialist controls the undocumented logic that makes the current process function. If the deadline is unrealistic, the specialist can comply literally while withholding the judgment needed to prevent errors. The department head has authority over the assignment. The specialist has leverage over the quality and speed of implementation.

### Sources of leverage are broader than money

Pfeffer's account of where power comes from includes resources, allies, position in communication networks, formal authority, reputation, performance, location in the organization, and individual attributes (Pfeffer, 1992, pp. 71–185). These are different routes by which an actor becomes consequential to others. Resources create leverage when they are valued and controlled. Allies coordinate support and protect against isolation. Network position provides access to information, people, and decisions. Reputation shapes how an action is read before its substance is weighed. Location matters because units differ in visibility, budget, and access to senior decision-makers.

[CONCEPTUAL] This is a conceptual framework supported by cases and cited research. It does not show that everyone who builds a network gains power, or that powerful positions produce good decisions. The supportable claim is narrower: different forms of control and connection change dependence, and so change what an actor can get others to consider, support, or implement.

### Dependence changes with alternatives

Dependence is relative. If A has three workable alternatives, B's control over one of them matters less. If A has none, a small act of cooperation from B can be decisive. The same request can therefore draw different responses in different settings, even when the people and titles are unchanged. The useful question is not "Who has power?" but "Power over what, for whom, and given which alternatives?"

<!-- visual:V2 -->

That question prevents two common errors. The first treats power as a stable trait. People are influential in one domain and dependent in another. A senior manager may control priorities and depend on a peer for technical credibility. A celebrated expert may control knowledge and depend on a sponsor for access to promotion decisions.

The second error treats power as proof of legitimacy. Dependence explains leverage. It does not say whether the leverage is fair, wise, or beneficial. A bottleneck can protect quality and safety. It can also preserve status or block good alternatives. The mechanism is the same; the consequences are not.

[SYNTHESIS] **Hypothetical example.** A compliance reviewer delays a launch because required evidence is missing. Gate control alone does not reveal whether the delay protects the organization or obstructs it. That depends on the rule, the evidence, the reviewer's incentives, the available appeals, and who benefits from delay.

Dependence explains why a person may matter. It does not explain how that person turns a dependency into support. Two people in similar positions can produce different results. One reads the room accurately, identifies which concern is decisive for each stakeholder, and frames a request so that cooperation becomes acceptable. Another holds the same information and provokes resistance. Structural position creates possibilities. Social behavior helps determine how they are used.

## Chapter 3. Political Skill: The Human Execution Layer

"Political skill" can sound like a polite word for manipulation. The research definition is more specific.

Political skill is a multidimensional capability involving social astuteness, interpersonal influence, networking ability, and apparent sincerity (Ferris et al., 2005, pp. 126–152; Ferris et al., 2007, pp. 290–320). It concerns how people understand social situations and exercise influence. It is not the same as formal authority, extroversion, intelligence, moral virtue, or a guarantee of organizational benefit.

The word "apparent" matters. Apparent sincerity describes how sincerity is perceived. It offers no access to anyone's private motives. Someone can appear genuine while pursuing self-serving ends, and someone with constructive motives can be read as calculating.

The two Ferris papers do different work. The 2007 paper is a conceptual framework that describes political skill from a cognition-affect-behavior perspective and proposes how it may operate in organizations (Ferris et al., 2007, p. 290). It is not a new empirical test. The 2005 paper supplies the measurement evidence. It reports three investigations involving seven samples used to develop and validate the Political Skill Inventory. In Study 1, two development samples were combined at N = 350, and the factor table reports reliability estimates of .87, .81, .79, and .78 for the four dimensions, with 62.94% cumulative variance. The paper also reports criterion-related work in which the inventory predicted performance ratings in two samples (Ferris et al., 2005, PDF pp. 2, 9, 12, 21).

[EMPIRICAL] These results support the construct and its measurement. They do not show that political skill causes promotion, that politically skilled people are ethical, or that influence exercised through political skill improves an organization. Prediction in two samples is not causation.

### Four dimensions, four mechanisms

**Social astuteness** is the ability to read social situations: what people care about, what they are not saying, how a decision is being interpreted, and where resistance actually lies. It is interpretation under incomplete information, not mind-reading.

**Interpersonal influence** is the ability to adapt how one communicates and persuades. The same proposal may need different explanations for a safety-focused reviewer, a budget owner, and a team worried about workload. Adaptation is not deception. It becomes a problem when framing hides material consequences or manufactures consent.

**Networking ability** is the capability to build and use relationships that can provide information, access, advice, or support. It is a property of the person. It is different from the structure of relationships a person happens to occupy, a distinction Chapter 9 depends on.

**Apparent sincerity** concerns whether others experience an actor as genuine. That perception can reduce resistance. It is not moral certification. It can be accurate, mistaken, cultivated, or performed.

The dimensions are useful together because no single one explains the process. A person may read a situation well and communicate poorly, communicate well and lack a network through which support can travel, or have access and be distrusted.

<!-- visual:V3 -->

### Political skill operates inside structure

Political skill does not replace structural analysis. A socially astute employee cannot talk past a missing budget, a legal prohibition, or a manager with the authority to veto the work. A well-connected person may still lack a workable alternative. And the same behavior can be read differently depending on who performs it.

[SYNTHESIS] **Hypothetical example.** Two project leads raise the same concern in a meeting. One is heard as decisive, the other as aggressive. The outcome alone does not reveal why. The explanation may lie in role, status, prior reputation, identity cues, the relationship with the audience, the wording, or the interests the concern threatens. Political skill shapes how each lead navigates the moment. It does not control the whole interpretive environment.

For this reason political skill should not be taught as a universal set of tactics. "Be visible," "build relationships," and "speak with confidence" can help in one setting and backfire in another. The Ferris papers provide a construct for analyzing social effectiveness. Chapter 10 examines why social effectiveness is not equally available, equally safe, or equally rewarded.

Political skill describes how a person reads and acts within a situation. It does not yet describe the situation's logic. When several actors depend on one another, each one's best move depends on what the others will do, and each is trying to anticipate the rest. Analyzing that interaction requires a vocabulary for strategy.

## Chapter 4. Organizations Are Strategic Systems

Dependence runs in one direction: A needs something B controls. Most organizational situations involve dependence running in several directions at once. Pfeffer calls this condition interdependence and, quoting earlier work with Jerry Salancik, defines it precisely: "interdependence exists whenever one actor does not entirely control all of the conditions necessary for the achievement of an action or for obtaining the outcome desired from the action" (Pfeffer, 1992, p. 38). Under interdependence, getting things done requires the capacity to influence the people on whom one depends.

Game theory starts from the same condition in a different vocabulary. Muhamet Yildiz's MIT lecture notes describe the field as a set of tools for analyzing decisions when there are several decision-makers and each one's payoff may depend on the actions of the others. Because of that dependence, each player's choice depends on beliefs about what the others will do (Yildiz, Ch. 1, p. 1).

[SYNTHESIS] The two traditions describe one structural condition from different directions. Pfeffer asks how people get things done when they do not control everything they need. The formal models ask which choices make sense when outcomes depend on other people's choices. This chapter borrows a small part of the second vocabulary to sharpen the first. It does not claim that organizations are games in the textbook sense.

### A minimal strategic grammar

Before calling a situation strategic, or predicting how someone will respond, six things need to be specified.

<!-- variant:grammar -->

| Element | Organizational question |
|---|---|
| **Actors** | Who can affect the outcome, including people outside the formal decision? |
| **Actions** | What can each actor actually do: approve, delay, escalate, comply minimally, exit? |
| **Incentives** | What does each actor gain or lose under each result, including status, workload, and risk? |
| **Information** | Who knows what about the facts, the options, and one another's priorities? |
| **Sequence** | What happens first, and who can see it before acting? |
| **Expectations** | What does each actor expect the others to do, and why? |

The first four elements correspond to what the notes say is needed to analyze a strategic situation: who the players are, which actions are available, how much each player values each outcome, and what each player knows (Yildiz, Ch. 3, p. 29). Sequence enters through the game tree, which records who moves when and what they have seen. Expectations enter because each player's action depends on beliefs about the others (Ch. 1, p. 1).

One formal idea has immediate organizational use. In the notes, a strategy is a "complete contingent-plan": it specifies what a player will do at every point where they might have to move, including points that will never be reached if the plan is followed (Yildiz, Ch. 3, p. 38). An escalation policy, a review rule, or a manager's statement about what happens "if this slips again" is a plan for situations that may never occur. Those unrealized branches still shape behavior, because people act in anticipation of them. That is where threats and promises live.

### One small matrix

[SYNTHESIS] **Hypothetical example.** Two teams must adopt a shared data format for a new integration. Team A has built tools around Format A, Team B around Format B. Both gain from matching, because mismatched formats break the integration. Each prefers to match on its own format, since the other team would then carry the migration work.

The numbers below are illustrative rankings, not measurements. They follow a standard teaching game, the Battle of the Sexes (Yildiz, Ch. 1, p. 3). The first number in each cell is Team A's payoff, meaning how much Team A values that outcome; the second is Team B's.

<!-- variant:matrix -->

|  | Team B uses Format A | Team B uses Format B |
|---|---|---|
| **Team A uses Format A** | 2, 1 | 0, 0 |
| **Team A uses Format B** | 0, 0 | 1, 2 |

Neither team has an option that is best whatever the other does. Each team's best choice depends on what it expects the other to do.

There are two stable outcomes: both on Format A, or both on Format B. In each, neither team gains by switching alone. This is the formal meaning of a **Nash equilibrium**: a combination of strategies in which each player's strategy is a best response to the others' (Yildiz, Ch. 6, p. 84). The notes add a useful reading. If a strategy combination is viewed as a social convention, being an equilibrium means being self-enforcing: nobody wants to deviate when they expect others to follow the convention (p. 84).

The model does not say which stable outcome will occur. Equilibria need not be unique (Yildiz, Ch. 6, p. 85), and the concept assumes that players correctly anticipate one another's strategies, an assumption the notes call reasonable mainly after long prior interaction or under an established convention (p. 83). In organizational terms, which format wins may depend on precedent, on who is seen as leading, on which team speaks first, or on what everyone expects everyone else to expect. The matrix identifies the stable possibilities. History, status, and timing select among them.

### What equilibrium does not mean

**Equilibrium is not prediction.** An equilibrium holds *if* players have the specified payoffs, information, and correct expectations. Real actors may be mistaken, uncertain, or working from a different picture of the situation. Identifying an equilibrium says which patterns would be stable under stated assumptions. It does not say that anyone calculates them, or that they will occur.

**Equilibrium is not fairness or efficiency.** In the Prisoners' Dilemma, each player does better by defecting whatever the other does, yet mutual defection leaves both worse off than mutual cooperation (Yildiz, Ch. 1, p. 6). In the matrix above, whichever format wins, one team carries a cost the other avoids. Stability means only that no one gains by deviating alone.

> **Model card: how sharp can a prediction be?** `[FORMAL MODEL]`
>
> - **Dominance.** A rational player does not choose an option that is worse than another option whatever the others do (Yildiz, Ch. 4, p. 51). When such an option exists, the prediction is sharp, but the notes observe that dominance alone often yields weak predictions (Ch. 5, p. 65).
> - **Rationalizability.** This removes only options that could not be best under any reasonable belief about others. So many options usually survive that the notes describe its predictions as weak (Ch. 6, p. 83).
> - **Nash equilibrium.** This adds the assumption that players correctly anticipate one another, which sharpens predictions but may leave several stable outcomes (Ch. 6, pp. 83–85).
>
> `[SYNTHESIS]` The organizational lesson, stated as an analogy: a colleague's choice that looks irrational may be sensible under beliefs the observer has not reconstructed.

### Analyzing the correct game

The most useful sentence in the notes' chapter on negotiation is not a theorem. After showing why a legislative "killer amendment" should fail under a standard analysis, and then describing a historical case in which one succeeded, Yildiz draws a methodological moral: "it is not enough that your analysis is correct. You must also be analyzing the correct game" (Yildiz, Ch. 10, p. 157).

That is the posture this article takes toward formal models. Their value lies in forcing assumptions into the open: who counts as an actor, which options exist, what each party wants and knows, what happens first, and what each expects. Organizations routinely violate the clean assumptions of lecture examples. Goals are ambiguous, membership changes, people play several games at once, and informal norms rule out actions a model treats as available. A model applied to the wrong game produces a confident answer to the wrong question.

[SYNTHESIS] The strategic grammar is therefore a checklist for diagnosis, not a machine for prediction. When a situation is puzzling, the productive question is usually not "What is the equilibrium?" but "Which element have I misspecified?"

The matrix also hides something. It assumes both teams choose at once without seeing each other's choice. Organizational decisions rarely work that way. Someone moves first, someone responds, and before either moves, people announce what they will do. Whether those announcements should be believed is the next question.

## Chapter 5. Credibility, Commitment, and Threats

Organizations run on statements about the future. "If you ship without a security review, I will escalate." "Hit this target and the promotion is yours." "We will not integrate with a format we did not choose."

Each statement describes an action that will be taken later, if a situation arises. The listener must decide whether to believe it. The strategic grammar turns that decision into a sharper question: **when the moment arrives, will the speaker actually want to do what they said?** A statement that passes this test is **credible**. A **commitment** is any action that changes the answer in advance, by making a later choice costly or impossible to reverse.

### Reasoning backward from the moment of decision

[FORMAL MODEL] The formal tool is backward induction. In a sequential game where players see earlier moves, the analyst works out what each player would choose at the last decision, then reasons back to earlier ones. The method assumes it is common knowledge (everyone knows it, everyone knows that everyone knows it, and so on) that every player will act rationally at every future decision, including decisions that are never expected to arise (Yildiz, Ch. 9, p. 131).

The notes apply this to a sequential version of the coordination game above (Yildiz, Ch. 9, pp. 136–137). One player chooses first; the second sees that choice and then responds. There is an equilibrium in which the second player's plan says they will go to their own preferred option no matter what, and the first player, believing this, goes along. But that plan includes a move the second player would not make if the first player actually chose differently: at that point, matching would be better. The notes describe such an equilibrium as "based on 'an incredible threat'" (p. 137). A refinement called subgame-perfect equilibrium generalizes the test by requiring equilibrium behavior at every decision point, not only along the expected path (Ch. 11, p. 173). Its practical effect is to discard threats and promises that would not be carried out when the moment came.

[SYNTHESIS] **Hypothetical example, continued.** Suppose Team A moves first and builds the integration on Format A. Team B has said it will never integrate with a format it did not choose. Once Team A has built, Team B chooses again. Matching yields a positive payoff; refusing breaks the integration and yields nothing. Under these payoffs, the threat is not credible, and Team A has good reason to move first. The conclusion depends on the assumptions. If Team B also cares about something the matrix omits, such as a reputation for not backing down or a promise to a customer, its payoffs differ and so does the analysis. The point is that a threat's credibility depends on the speaker's incentives at the moment of decision, not on the confidence with which it was made.

<!-- visual:V5 -->

### Moving first

In the notes, the player who can commit to a choice gains from it (Yildiz, Ch. 9, p. 137), and the introductory chapter observes that being able to act first "enables Player 1 to commit to his actions, providing a strong position in the relation" (Ch. 1, p. 4).

Pfeffer reaches a similar conclusion from organizational cases. In a chapter on timing, the book argues that "by taking some action that will be difficult to undo, we can compel those who come later to accommodate themselves to our position," so that a completed action serves "as a base for further negotiations" (Pfeffer, 1992, pp. 227–228).

[SYNTHESIS] The model and the cases converge on one mechanism: an early move that is hard to reverse changes what later actors find worthwhile. The convergence is suggestive, not a test of either source by the other. Neither source makes "move first" a rule. The notes show that in some games the first mover is beaten because the second benefits from seeing the first move (Yildiz, Ch. 9, pp. 137–138). Pfeffer lists the costs of acting early: waiting lets you learn others' views, while acting first makes you visible and "a potential target for others" (Pfeffer, 1992, p. 227).

### Promises fail the same test

Credibility is equally a problem for promises. The notes' first backward-induction example is a relationship both players would prefer to continue, in which each would exit if they expected the other to exit next. Because neither can commit to staying, the relationship ends at the first opportunity and both lose outcomes they would have preferred (Yildiz, Ch. 9, pp. 132–134). The failure comes not from hostility but from the inability to make future behavior believable.

[PRACTITIONER] A practitioner version of the same doubt appears in Priscilla Claman's advice on counteroffers. When a current employer promises an improvement that will take months to arrive, Claman cautions that "this may be a promise your boss won't be able to fulfill," because circumstances change quickly (Claman, "Thinking of Quitting Your Job?", EPUB pg_128).

[SYNTHESIS] This is where credibility and apparent sincerity separate. Apparent sincerity is a perception of the speaker. Credibility is an assessment of the speaker's future situation. A promise can be made with complete sincerity and still not be credible, because the person making it will not control the relevant resource, or will face different incentives, when the time comes.

### Why stated intentions may not be believed

Drawing these threads together, a statement about future action is weaker when one or more of the following holds. The list is a diagnostic synthesis, not a validated instrument.

1. **Incentive at the moment of decision.** Carrying it out would cost the speaker more than abandoning it.
2. **Control.** The speaker will not control what is needed to deliver.
3. **Reversibility.** Nothing has been done that would be costly to undo.
4. **Observability.** No one will see whether the speaker followed through.
5. **Future interaction.** The speaker does not expect to deal with the same people again (Chapter 8).
6. **Private information.** The listener cannot see the speaker's real priorities or constraints (Chapter 7).

### Commitment, and its risks

If credibility depends on future incentives, a statement can be made credible by changing those incentives in advance: acting irreversibly, attaching visible costs to backing down, or giving up the option to do otherwise.

Pfeffer discusses commitment from a different angle. The book's "commitment process" is psychological: people become bound to actions that are chosen voluntarily, made public, irrevocable, and explicit about what they imply (Pfeffer, 1992, p. 192). Commitment in this sense works through self-perception and through social norms that reward consistency (pp. 192–194).

[SYNTHESIS] The two ideas share publicity and irrevocability but work through different channels. Strategic commitment changes what others expect the committed party to do. Psychological commitment changes what the committed party believes about themselves. They can reinforce each other, and that is also the risk. Pfeffer discusses research on escalation, in which decision-makers facing failure commit more resources to a failing course, and notes that consistency is often prized as a mark of strong leadership (Pfeffer, 1992, p. 193). The mechanisms that make a commitment believable can make a bad commitment hard to abandon. Credibility is not wisdom.

### A credible refusal

[PRACTITIONER] The same logic applies to saying no. In a chapter compiled by Paige Cohen from HBR colleagues' advice, one contributor, Nicole D. Smith, observes that there is "an uneven power dynamic" when a more senior person makes a request, and that a bare refusal "leaves room for the requester to assume why." The chapter's advice is to explain the reason, support it with data on current workload, and, for critical work, ask the manager to help reprioritize (Cohen, "Three Ways to Say No to Your Boss," EPUB pg_24–25).

[SYNTHESIS] Read through the credibility lens, that advice converts a private claim ("I cannot take this on") into something the listener can check. This is an interpretation of practitioner advice, not evidence that the tactic generally works.

The formal account of credibility is sharp because its assumptions are strong. Organizational threats are noisier: renegotiated, softened, carried out in modified form, or followed through out of anger or principle. A threat that looks incredible in a one-shot model may be entirely credible in a relationship that continues. What survives these limits is the central question, and answering it usually requires another: what happens if the parties fail to agree? A threat to walk away matters only if walking away is survivable.

## Chapter 6. Bargaining Power Comes From Alternatives

Pfeffer states the relationship between power and alternatives in one sentence: "Power is vested in us by the dependence of others, and that dependence is a function of how much others need what we control, as well as how many alternative sources for that resource there are" (Pfeffer, 1992, p. 92).

The book's illustration is historical. Corporate data-processing departments once held considerable power because they controlled centralized computing. As distributed computing spread, their power declined. Computing had not become less important. What changed was that technology "now provide[d] alternative ways of accomplishing the task without relying on the central unit" (p. 92). The resource stayed valuable; the dependence weakened because alternatives appeared.

[CONCEPTUAL] This is an argument illustrated by a case, not a measured effect. It states the chapter's mechanism: leverage depends on alternatives as well as on value.

### What a bargaining model adds

This chapter uses two terms consistently. An **alternative** is another way to obtain what one needs. A party's **fallback** is what it gets if negotiation fails. Economists often call the fallback an outside option or disagreement point. The MIT notes do not use those phrases, so "fallback" is this article's plain label for what their models make explicit.

[FORMAL MODEL] Applying backward induction to bargaining, the notes make three elements visible (Yildiz, Ch. 10, pp. 153–163):

- **The fallback anchors the deal.** In a pre-trial negotiation model, each side accepts a settlement only if it is at least as good as going to court, so the expected court outcome and its costs anchor every offer (pp. 157–160).
- **Delay has a price.** In a model where two players alternate offers to divide a sum and value money less the later it arrives, each accepts an offer only if it beats waiting. Read in words, the notes' formula implies that the first proposer's advantage shrinks as both players become more patient (pp. 160–163).
- **Procedure matters.** Who proposes, and in what order, changes the result. In the pre-trial model, "the last proposer has a great advantage" (p. 160).

These results hold within the models, under assumptions of known payoffs, fixed rules, and rational players. They are not a theory of workplace negotiation. They show that a negotiated outcome depends on what each side gets without agreement, how costly waiting is for each, and the rules for offers, not only on who argues best.

### Bargaining power is not formal authority

[SYNTHESIS] **Hypothetical example.** A product team needs a change to a shared platform service before a launch. The platform team has formal authority over the service. On paper, the product team must ask. Now vary one condition at a time.

- If the product team can meet its deadline with a vendor tool or a limited workaround, its fallback improves and the platform team's leverage shrinks, though its authority is unchanged.
- If the platform team is judged on adoption of its service, a failed negotiation costs it too. Its fallback worsens, and the product team gains leverage without gaining authority.
- If the launch date is fixed and public, delay costs the product team more. In the model's terms, the more impatient side tends to concede more.
- If a senior leader announces that roadmap disputes will be settled in a quarterly review, the procedure has changed, and with it the timing of when a refusal can be overturned.

None of these changes appears on the org chart. Each changes the bargain.

<!-- visual:V6 -->

**Formal authority determines who may decide. Bargaining power depends on what each party can do if the other says no.** Authority enters the bargain mainly through the fallback: a manager who can reassign work, escalate, or veto has a better fallback than one who cannot. But authority is one input among several and can be outweighed. A specialist with attractive options elsewhere, or knowledge no one else holds, can bargain from strength with a manager who formally outranks them.

### Dependence cuts both ways

Pfeffer draws a strategic implication from the account of dependence: "another strategy for developing power is to ensure that there are no alternative ways of obtaining access to valuable resources we control" (Pfeffer, 1992, p. 92).

[PRACTITIONER] Liz Wiseman's chapter questioning the advice to make oneself indispensable offers a counterweight. It describes an HR manager, identified by a pseudonym, who kept critical tasks to herself, became a bottleneck, and eventually suffered a collapse in her health. Wiseman argues that making oneself irreplaceable can "tether you to your job," so that "you won't be able to step up into new opportunities as they arise" (Wiseman, "Should You Really Be Indispensable at Work?", EPUB pg_158–159).

[SYNTHESIS] Together the two sources describe a trade-off. Controlling a scarce resource raises others' dependence on you. It can also reduce your own alternatives, because the organization now depends on your staying where you are. Leverage in one negotiation can become confinement in the next. Wiseman's chapter draws on the author's interviews and surveys, which are not examined here, and should be read as a qualification of the bottleneck strategy rather than evidence against it.

### Revealing an alternative is itself a move

The models treat the fallback as a fixed fact. In organizations, disclosing an alternative changes more than the current negotiation.

[PRACTITIONER] Claman advises against telling a manager about a job search in most cases, because a manager who expects an employee to leave may begin treating them like a temporary worker, with less engaging assignments and exclusion from important meetings. In career conversations, the advice is: "don't say you'll leave or threaten to do so." And a manager who learns of a search may distrust the employee's commitment even after a counteroffer is accepted (Claman, "Thinking of Quitting Your Job?", EPUB pg_126–127).

[SYNTHESIS] In a one-shot bargaining model, a better fallback simply improves one's position. In an ongoing relationship, disclosing it also changes what the other party believes about one's future behavior, and those beliefs outlast the negotiation. Alternatives are also rarely known with certainty. Real actors estimate their own and others' options, often wrongly, and perceived alternatives shape a bargain even when actual ones differ. Finally, alternatives are not evenly distributed, and bargaining power describes leverage, not legitimacy.

Each of these points leads to the same gap in the analysis so far. It has assumed that parties know one another's incentives, constraints, and fallbacks. Usually they do not. A manager may not know whether an employee really has another offer. A team may not know whether a peer team's "we don't have capacity" describes a constraint or a negotiating position. When important facts are hidden, every action becomes something to interpret.

## Chapter 7. Information Changes the Game

The lecture notes treat hidden facts as the normal condition, not the exception. "In real life, players always have some private information that is not known by other parties. For example, we can hardly know other players' preferences and beliefs as well as they do" (Yildiz, Ch. 14, p. 265).

Once that is acknowledged, visible actions acquire meaning. People who cannot see one another's circumstances read them from what others do. The same action can then mean different things depending on what the observer knows, does not know, and believes.

### Five terms that are easy to blur

| Term | Meaning | Organizational example |
|---|---|---|
| **Information** | Facts relevant to a decision, whoever holds them | A team's actual workload |
| **Private information** | Information one party has and another lacks | The team lead knows how close the team is to overload; the director does not |
| **Belief** | An assessment of what is probably true about something one cannot observe | The director thinks the team is probably coping |
| **Inference** | Revising a belief after observing something | The director reconsiders after the team declines a new project |
| **Signal** | An action by a better-informed party that can change a less-informed party's belief | The team lead declines, knowing the refusal will be read |

[FORMAL MODEL] The models give these terms precise counterparts. A player's private information is called their **type** (Yildiz, Ch. 14, p. 266). In the notes' first example, a firm considers hiring a worker whose ability it cannot observe. The worker knows their own ability. The firm holds only a belief, expressed as a probability, and it knows that the worker knows (pp. 265–266). Beliefs are revised using Bayes' rule, a formula for updating a probability in light of new evidence (p. 267). And a strategy now specifies what each type would do (p. 268).

That last point carries the chapter. To interpret an action, an observer must ask not only "What did they do?" but "What would each kind of person have done in this position?" An action is informative only to the extent that different types would act differently. None of this implies that people calculate probabilities. The claim is weaker and more useful: whenever behavior is treated as evidence about something hidden, the model's logic describes what that evidence can and cannot support.

### When an action becomes a signal

[FORMAL MODEL] The notes illustrate signaling with a deliberately odd example, the Beer and Quiche game (Yildiz, Ch. 16, pp. 318–321). One player is strong or weak, and only that player knows which. The strong type prefers beer for breakfast, the weak type quiche. A bully watches the order and decides whether to fight, wanting to fight only the weak. Both types want above all to avoid a fight. In one equilibrium, the bully treats quiche "as a sign of weakness and fights. Anticipating this, none of the types orders quiche" (p. 320). The weak type orders a breakfast it likes less because of how the alternative would be read.

The notes distinguish two outcomes. In a **pooling** equilibrium, all types act alike, and the observer "does not learn anything" from the action (p. 321). In a **separating** equilibrium, types act differently, and the action reveals the type (p. 321). The same game can support more than one pattern, depending on what the observer would believe after an unexpected choice (p. 320).

[SYNTHESIS] **Hypothetical example.** Suppose a team reads leaving on time as a sign of low commitment. Committed and less-committed employees may then both stay late, because leaving would be read badly. Staying late has become a pooling action. It no longer tells the manager who is committed, yet everyone keeps paying its cost. The example is an analogy: it borrows the model's structure without claiming that any real team has these payoffs. What it shows is a mechanism by which an expectation about how an action will be read can make the action uninformative while keeping it costly.

The same logic explains why the refusal advice in Chapter 5 matters. A team that declines a project may be overloaded or merely uninterested. If only overloaded teams would decline, the refusal separates, and the director learns something. If both kinds decline when it suits them, the refusal pools. Workload data gives the observer evidence that an uninterested team could not easily produce.

<!-- visual:V7 -->

### Not everything is a signal

An action carries information only when someone observes it, the observer is uncertain about something the action bears on, and different kinds of actors would plausibly act differently. Many actions fail at least one of these conditions. They are unobserved, routine, or taken by everyone for reasons unrelated to private information. Treating all behavior as coded communication makes the same mistake as treating every situation as a textbook game.

[PRACTITIONER] The opposite error is to assume that good work is seen. Anand Tamboli describes an engineer passed over for a management role because their manager "couldn't predict how Arun would respond to challenging situations" or work across departments; the engineer's visible behavior demonstrated technical skill, not leadership (Tamboli, "When It Comes to Promotions, It's About Who Knows You," EPUB pg_127). In this chapter's terms, the manager lacked evidence on which to update a belief. The account is personal and practitioner-level.

### Information is also a move

The models treat information as something players have or lack. Pfeffer adds that it is something people use. *Managing with Power* argues that because organizations believe most problems have a right answer that analysis can uncover, "those in control of the facts and the analysis can exercise substantial influence," while facts themselves "are seldom so clear cut" (Pfeffer, 1992, pp. 247–248). In complex decisions, analysis rarely settles the question alone, which leaves room to advocate for criteria and data that favor one's position (pp. 248–249).

[CONCEPTUAL] This is an argument from cases, and it does not claim that information is always manipulated. It adds that who gathers information, how it is framed, and who sees it first are themselves strategic choices. Chapter 9 returns to this through the question of who sits on the paths between others.

### The same action, different readers

Inference depends on the observer's **prior belief**, what they believed before seeing the action. In the notes' version of Beer and Quiche in which the bully starts out believing the other player is probably weak, the pooling equilibria disappear and behavior changes (Yildiz, Ch. 16, p. 322).

[SYNTHESIS] In organizations, starting beliefs are shaped by role, history, reputation, and identity, including assumptions unrelated to the person being judged. This offers one explanation for the two project leads in Chapter 3 who raise the same concern and are heard differently: identical evidence can move differently anchored beliefs to different conclusions, without anyone deciding that it should.

The models ask a great deal. Every player must know which types exist, share starting probabilities, and hold beliefs consistent with everyone's strategies; the solution concept the notes use for dynamic games explicitly requires beliefs "consistent" with strategies (Yildiz, Ch. 16, p. 311). Real organizations rarely meet these conditions. The models' value is diagnostic. Before drawing a conclusion from behavior, ask what the observer was uncertain about, whether different kinds of actors would have acted differently, what the observer believed beforehand, and who controlled the information the observer received.

So far, inference has been a single event: one action, one revised belief. Colleagues rarely meet once. Each inference builds on the last, and accumulated beliefs about a person acquire strategic weight of their own.

## Chapter 8. Reputation Is a Repeated-Game Asset

A single interaction poses one strategic question: what is best to do now? A continuing relationship adds another: what will this action do to what happens next?

The notes' chapter on **repeated games**, the formal term for the same interaction played many times, opens with that shift. "In real life, most games are played within a larger context," and when players are patient, "the considerations about the future may take over," producing behavior "that may seem to be irrational when one considers the current situation alone" (Yildiz, Ch. 12, p. 199).

[SYNTHESIS] The chapter title is a synthesis. The repeated-game models supply a mechanism by which the future disciplines the present. Chapter 7 supplied a mechanism by which others form beliefs from behavior. Pfeffer supplies conceptual and case material on reputation as a source of power. The combined claim, that reputation works like an asset built through repeated interaction, is not tested directly by any source here.

### When the future disciplines the present

[FORMAL MODEL] Repetition does not automatically rescue cooperation. If the Prisoners' Dilemma is played a known number of times, both players defect in the last round, since nothing follows it. That makes the second-to-last round effectively final too, and the logic unravels to the first round: defection every time (Yildiz, Ch. 12, p. 201).

The result changes when there is no known last round. The notes analyze a strategy called Grim: cooperate until anyone defects, then defect forever (Yildiz, Ch. 12, p. 208). If both players follow it and value the future enough, cooperation is sustained, because defecting gains a little now and forfeits the stream of future cooperation. In the notes' example, the condition is a discount factor, the weight a player places on future payoffs relative to present ones, of at least 1/5 (p. 215). The punishment is credible in Chapter 5's sense, because once cooperation has broken down, mutual defection is itself stable. The notes also show that a more forgiving rule, tit-for-tat, fails that credibility test in their example except in a knife-edge case (pp. 215–216). A response rule can sound sensible and still not be credible when the moment to apply it arrives.

The mechanism rests on explicit conditions: actions are observed (the notes' analysis concerns "infinitely repeated games with observed actions," p. 207), the interaction is expected to continue, players are patient enough, and responses to deviation are credible.

[SYNTHESIS] Each condition has an organizational counterpart that may or may not hold. Is the behavior visible to those who would respond? Do the parties expect to keep working together, and do they value that future? Would the promised response be carried out? The finite-horizon result suggests a caution, as an analogy rather than a finding: relationships with a known end, such as the weeks before a reorganization or a departure, may lose some of the discipline an open-ended future provides.

### Repetition expands what is stable. It does not select what is good.

[FORMAL MODEL] The folk theorem, as the notes present it, states that sufficiently patient players can sustain "a large set of behavior" in equilibrium: any combination of payoffs the players could jointly achieve, provided each receives more than the lowest payoff the others could force on them (Yildiz, Ch. 12, pp. 216–220). Repetition widens the range of stable outcomes without choosing among them. Cooperation is one possibility. Lopsided, wasteful, and harsh arrangements are others.

The notes' application to implicit cartels makes this concrete. Firms that interact repeatedly can sustain high prices without explicit agreement, and more patient firms can hold prices higher, at the expense of consumers (Yildiz, Ch. 13, p. 252). Such arrangements can be enforced by punishments costly to the punishers themselves, who carry them out because failing to punish would prolong the punishment (p. 247). In one variant, any deviation during a price war restarts the war (p. 256).

[SYNTHESIS] Internal coalitions are not cartels, and market results are not evidence about organizations. The models matter here for a narrower reason. The mechanism that sustains cooperation among insiders can equally sustain outcomes that disadvantage outsiders, and punishment regimes can escalate and perpetuate themselves. By analogy, a long relationship between two departments may support trust and fast coordination. The same structure may support mutual protection from scrutiny, exclusion of newcomers, or years of retaliation. Repeated interaction is a mechanism, not a virtue.

<!-- visual:V8 -->

### Reputation as accumulated belief

Repeated-game models with fully known payoffs explain how future responses shape behavior. They do not yet explain reputation in the ordinary sense: what others believe about the kind of person you are.

[FORMAL MODEL] The notes bridge the two in a section titled "A Simple Example of Reputation Formation" (Yildiz, Ch. 16, pp. 324–326). They observe that the assumption of known payoffs "almost never holds" in real life and ask what happens under "a small amount of doubt" (pp. 324–325). In the example, one player assigns a small probability to the other being an unusual type who never exits. That small doubt changes the equilibrium substantially: the ordinary type must sometimes behave like the unusual one (pp. 325–326).

[SYNTHESIS] This suggests a precise definition. A **reputation** is others' uncertainty about your type, together with the behavior that sustains or resolves it. Within the model, such uncertainty can make it worthwhile to act so as to preserve others' belief. Extending this to reputations for reliability, toughness, or fairness is a well-motivated analogy, not a tested result.

[CONCEPTUAL] Pfeffer treats reputation as a major source of power that compounds. One wants a reputation as "someone who is reliable and predictable, someone who can get things done, and someone who has power," and "the reputation for having power brings more power" (Pfeffer, 1992, p. 136). People perceived as influential are challenged less, accomplish more with less effort, and so strengthen their reputation further (p. 136). Reputation also shapes how real resources are allocated. Discussing a study of managers' evaluations over five years, the book judges it more plausible that favorable early reputations led to better assignments, training, and mentoring than that early ratings simply measured ability (p. 137). Reputations, it adds, form soon after entry (p. 140). These are Pfeffer's interpretations of cases and reported research, not verified here. They match the formal mechanism in one respect: in both, what others believe about an actor changes how they treat that actor, and the treatment feeds back into behavior.

[SYNTHESIS] "Asset" is therefore a useful word, with limits. A reputation is built through costly past action, yields returns in later interactions, and can be lost. Unlike most assets, it is not held by its owner. It exists in other people's beliefs, which its owner can influence but not control.

### When the record is unclear

The mechanism assumes actions are observed. Pfeffer's account of performance shows why that assumption is fragile: "history is often ambiguous." Consequences arrive late, the people involved move on, and responsibility is shared, so credit and blame cannot be assigned cleanly (Pfeffer, 1992, p. 144). The book also doubts that organizations reliably discover which decisions were good (p. 249).

[SYNTHESIS] Under these conditions, reputation may track visibility more closely than contribution. Someone whose work is hard to see may cooperate consistently and receive little credit. Someone present when results are announced may receive credit they did not earn. Retaliation can be misdirected at whoever appears responsible. Noisy observation does not break the logic of repetition, but it weakens the link between what people do and what others come to believe. Membership changes, authority is unequal, and a continuing relationship is not equally valuable or safe for every participant, a qualification Chapter 10 develops.

One more limit points forward. The models describe two players observing each other. Organizational reputations rarely form that way. People learn about one another second-hand, through what colleagues say, who vouches for whom, and whose account reaches decision-makers first. Reputation travels through networks, and networks do more than carry it.

## Chapter 9. Networks Turn Individual Power Into Collective Power

Most of the analysis so far has examined pairs: two teams, a manager and an employee, a promise and a listener. Organizations are overlapping relationships through which information, obligation, reputation, and support flow.

Pfeffer states the practical consequence bluntly. Organizations are large, interdependent systems "in which it is difficult to get things done by yourself," and managers at every level overlook "the importance of coalitions of support" (Pfeffer, 1992, p. 101). "Respect, competence, and intelligence are not enough. One needs friends and allies" (p. 110).

This chapter asks how relationships among many people turn individual resources into collective capacity. It rests on two distinctions.

### Two distinctions

**Network position is not political skill.** Political skill, including networking ability, is a capability of a person (Chapter 3). **Network position** is a property of a structure: where a person sits in the pattern of relationships, whom they are connected to, and how information and support reach them or pass through them.

[SYNTHESIS] The two interact but differ. A politically skilled person may be poorly placed, able to read a room but unable to reach the one where the decision is made. A person may occupy a valuable position through a job assignment or timing and lack the skill to use it. Over time, skill can build position and position gives skill something to work with. The Ferris papers measure and theorize the capability, not network structure, and nothing here establishes how strongly the two are related.

**Many contacts are not the same as a useful position.** Pfeffer draws this distinction with three standard measures of network centrality (Pfeffer, 1992, pp. 111–112):

- **Betweenness** measures how often a person lies on the paths linking other pairs. The book calls it "a particularly useful indicator of information control."
- **Connectedness** "simply describes the number of others with whom one has contact" and is "more a measure of communication activity than of one's centrality in the network."
- **Closeness** measures how few steps a person needs to reach everyone else. It indicates independence, because such a person "cannot as readily have his or her access to those others controlled by someone else."

A person can know many people who all know one another and occupy an ordinary position. Another can know few people and be the only link between two groups. Position also depends on "the power of the people with whom one is connected" (p. 111).

<!-- visual:V9 -->

### Brokerage: standing between groups

A person who connects otherwise separate groups occupies a **brokerage** position. In *Power*, Pfeffer draws on Ronald Burt's term "structural holes" for gaps between groups that interact internally but not with each other, notes that people tend to associate with others like themselves, which creates such gaps, and describes brokerage as profiting from connecting them (Pfeffer, 2010, Ch. 6). The book's example is an engineer at a Japanese utility who, despite a junior title, became the channel between nuclear engineering and international business development and was increasingly consulted by senior managers. The chapter reports that research "strongly suggests" brokerage positions help careers (Pfeffer, 2010, Ch. 6). That is Pfeffer's summary of research not examined here, and it describes an association, not a guarantee.

[CONCEPTUAL] A broker controls what each side learns about the other, and that control can coordinate or distort. *Managing with Power* recounts Andrew Pettigrew's study of a firm's computer purchase, in which a manager named Kenny sat at the junction of communication channels between his technical subordinates, the manufacturers, and the board that held formal authority. In Pettigrew's account, the position let Kenny "exert biases in favor of his own demands and at the same time feed the board negative information about the demands of his opponents" (Pfeffer, 1992, p. 114), and an analysis of the decision documents found his favored manufacturer mentioned more often and more positively (p. 115). The board held the authority. The broker shaped the information on which it acted. The org chart, it turns out, shows neither who controls implementation nor who controls the conditions of decision.

Pfeffer also reviews studies linking communication position to influence and promotion in particular organizations (Pfeffer, 1992, pp. 115–116). These describe specific settings and should not be generalized beyond them.

### Coalitions: assembling support

A network is a pattern of relationships. A **coalition** is a set of actors whose support has been assembled for a purpose.

[CONCEPTUAL] *Managing with Power* describes two ways coalitions are built: placing supporters in key positions through hiring and promotion, and doing favors (Pfeffer, 1992, pp. 101–106). Favors work through the norm of reciprocity, which "says that we are obligated to future repayment of favors" (p. 106). Reciprocity differs from market exchange: the favor may be unrequested, the obligation is unspecified, and the result is "a diffuse, generalized obligation" (pp. 106–107).

[SYNTHESIS] Repeated interaction explains why a diffuse obligation is worth anything. An unspecified debt is enforceable only through future dealings and reputation; someone who never repays eventually finds that no one extends favors. Reciprocity is one practical form of the repeated-game mechanism, operating across many relationships at once. The link is an interpretation. Pfeffer grounds reciprocity in social norms, not in game theory.

The book makes a strong claim about why coalitions matter: "Failures in implementation are almost invariably failures to build successful coalitions" (Pfeffer, 1992, p. 108). This is a generalization from cases, not a measured rate, and it is best read as diagnostic emphasis. The same passage acknowledges that "networks of allies can obviously be misused," while insisting they are essential for getting things done (p. 108).

[SYNTHESIS] A coalition changes the strategic situation in ways the earlier chapters describe. Pooled resources create dependence no single member could create. A collective refusal can be credible where an individual one would not be. And a coalition narrows everyone else's alternatives, because a party negotiating against an assembled group has fewer ways around it. This is the sense in which networks turn individual power into collective power. They do not simply add up individual influence; they change the dependence, credibility, and alternatives that shape every later bargain.

### Mentors and sponsors

[PRACTITIONER] Janice Omadeke distinguishes two relationships often run together. A mentor shares knowledge and guidance. A sponsor advocates, putting a protégé's name forward for promotion and speaking for their work "when they are not in the room." The sponsor "is putting their reputation and professional branding behind the protégé," which makes sponsorship riskier than mentoring and explains why it tends to grow out of an established mentoring relationship (Omadeke, "What's the Difference Between a Mentor and a Sponsor?", EPUB pg_139–141).

[SYNTHESIS] In the terms of the previous two chapters, sponsorship is a transfer of reputation. The sponsor spends their own credibility to change what decision-makers believe about someone else. That is why sponsorship is scarce and follows trust: a sponsor who vouches for someone who then fails pays a reputational cost.

[PRACTITIONER] Tamboli's account of a later career stage makes a related point. A manager told Tamboli that a senior role would require support from "influential people who can speak to your work and advocate for you when you're not in the room," and that one manager's voice was not enough (Tamboli, "When It Comes to Promotions, It's About Who Knows You," EPUB pg_124). Such champions are either decision-makers themselves or people decision-makers listen to (pg_126). The chapter's title puts the position distinction plainly: what matters is not only whom you know but who knows you, and whether they are positioned to be heard. These are practitioner accounts. They are consistent with Pfeffer's framework and do not show that sponsorship causes advancement in general.

### Networks are not equally open

[PRACTITIONER] AiLun Ku and Ray Reyes describe networks as "both stubborn gatekeepers and transformative door openers," argue that their benefits "still skew away from those faced with systemic barriers," and note that professionals from underrepresented backgrounds are often told to "network for opportunities" without the unwritten rules others inherit (Ku and Reyes, "Networking Skills for Professionals from Underrepresented Backgrounds," EPUB pg_131–134).

[SYNTHESIS] The conceptual and practitioner sources point the same way. If people tend to associate with others like themselves, as Pfeffer notes in discussing structural holes (Pfeffer, 2010, Ch. 6), existing networks will tend to reproduce existing patterns of access. A coalition that coordinates well for its members can coordinate just as well to keep others out, and the repeated-interaction mechanism that sustains insider cooperation does not require that outsiders benefit.

[PRACTITIONER] Niven Postma's account shows the cost of treating networks as optional: laid off despite strong performance, Postma attributes the outcome to having neglected relationships with people "who had the power to advocate for my job" (Postma, "You Can't Sit Out Office Politics," EPUB pg_81). It is one personal experience. Its value is to show that opting out of networks is not a neutral choice. It is also a position.

None of this supports the claim that networking universally improves careers. The supportable claim is narrower. Network position can affect access to information, advocacy, and support. Positions differ in value, not only in number of contacts. Networks that open doors for some can close them for others. And building and using a network takes skill, time, and social safety, which are not evenly distributed. That last point is not a footnote to the analysis. It changes the price of nearly every move described so far.

## Chapter 10. The Same Move Does Not Cost Everyone the Same

Each mechanism described so far explains why a move can work. A refusal can be credible. A disclosure can change beliefs. A sponsor can transfer reputation. A coalition can change everyone's alternatives. Each explanation also made a quiet assumption: that the move was available on the same terms to anyone who chose it.

This chapter drops that assumption. **A strategy may be structurally available without being equally safe, affordable, or sustainable for everyone.** Two people in the same role can face the same dependencies, hold the same information, and consider the same tactic, and still face different prices, risks, and interpretations.

[SYNTHESIS] The chapter treats this as a qualification of the whole argument, not a separate theory. Most of its evidence is practitioner material: advice, interviews, and personal accounts. Where a practitioner author reports research, the finding is attributed to that author; the underlying studies are outside this corpus.

### Where the difference comes from

The mechanisms are already on the table. They only need to be reread with different actors in mind.

**Interpretation depends on prior belief.** Observers read actions against what they already believed. If starting beliefs differ by role, tenure, or identity, the same action is read differently without anything about the action changing.

**Reputation is a buffer, and not everyone has one.** A person with a long, favorable record can take a risky action and have it read charitably. A newcomer cannot. Vasundhara Sawhney's advice on declining extra work makes the point practically: colleagues "haven't had an opportunity to get to know you yet, and they may make negative assumptions about your personality or work ethic" if a new employee simply says no (Sawhney, "How to Say No to Extra Work," EPUB pg_94). The same refusal carries more reputational risk for someone with less history to set it against.

**Alternatives are unevenly distributed.** People's fallbacks differ for reasons that have little to do with skill, including health, workload, reputation, and how revealing an alternative would be read. A threat to leave is credible only for someone who can leave.

**Access to networks and sponsors is uneven.** Sponsors stake their own reputation, which makes them selective, and networks gate access as well as open it. A tactic that depends on already being connected is less available to people who are not.

None of these requires anyone to intend unfairness. They follow from how inference, reputation, alternatives, and networks work, which is why the qualification belongs inside the analysis rather than beside it.

<!-- visual:V10 -->

### Authenticity and disclosure

Career advice often recommends authenticity and openness as routes to relationships. The HBR volume on authenticity both supports and complicates that advice, and its authors do not speak with one voice.

[PRACTITIONER] In an interview, the late Katherine W. Phillips connects cohesion in teams to connection and trust, which "requires some self-disclosure." She also describes catching herself withholding an ordinary weekend detail because she worried it would highlight her race and religion to a colleague who, she realized, never hesitated to share such details himself (Phillips, interviewed by Kersey, "Self-Disclosure at Work," EPUB pg_39–41). The account illustrates a mechanism: the relationship-building that creates network access may require disclosures that feel riskier to some people than to others.

[PRACTITIONER] Dannie Lynn Fountain is emphatic that "there is no mandate to disclose any identity, ever," and notes that disclosure can bring stressors that nonetheless "impact your ability to earn an income" (Fountain, "Should You Disclose an Invisible Marginalized Identity at Work?", EPUB pg_49). Fountain also names a cost strategic analysis rarely counts: split-second decisions about whether to respond to microaggressions can take "more headspace than any other part of my job" (pg_48–49). The cost here is attention and effort, not only outcomes.

[PRACTITIONER] Dorie Clark's chapter pushes in another direction. Under the heading "What's Your Evidence for Believing You'll Be Penalized?", Clark asks readers to test their expectations, which may be "only conjecture," while acknowledging that for some categories the consequences are serious and "should be evaluated carefully" (Clark, "When You Don't Feel Comfortable Being Yourself at Work," EPUB pg_106–107).

[SYNTHESIS] Together these chapters support a precise claim and resist a broad one. The precise claim: disclosure is an informational move whose risks depend on the observer, the setting, and what is disclosed, and those risks are not evenly distributed. The broad claim, that a given group always pays a particular penalty, is not supported by this corpus. Clark's question disciplines the analyst as much as the individual: risk should be assessed from evidence about the specific setting, not assumed from a category.

### The same tactic, contested evidence

[CONCEPTUAL] Pfeffer's *Power* shows how unsettled these differences can be even where research exists. Discussing whether displaying anger helps a person appear powerful, the book asks whether the advice holds "across gender and cultures" and reports studies pointing in different directions: some found that women gained less status than men from expressing anger, while another researcher reported finding no gender differences in her studies. The book concludes that "the question of gender differences in the effectiveness of expressing anger remains open" (Pfeffer, 2010, Ch. 7). These are Pfeffer's summaries of studies not examined here.

[SYNTHESIS] The example matters for its structure. A tactic that works for some people may work less well, or backfire, for others, and the available evidence may not settle which. The defensible stance is neither to assume tactics are neutral nor to assume any penalty is universal, but to treat the interpretation of a tactic as one of the variables in the situation.

### Hidden costs of performed sincerity

[PRACTITIONER] Susan David defines emotional labor as "the effort it takes to keep your professional game face on when what you're doing does not align with how you feel," distinguishing "deep acting," which stays connected to one's values, from "surface acting," which fakes or suppresses emotion. The chapter reports research associating habitual surface acting with costs including burnout (David, "Managing the Hidden Stress of Emotional Labor," EPUB pg_75–76); that research is not verified here.

[SYNTHESIS] Apparent sincerity, one dimension of political skill, is a perception that can be accurate or performed. Emotional labor names the price of the performed case. Two people can produce the same appearance of sincerity in the same meeting. For one, it matches what they feel. For the other, it is sustained effort. The observed behavior is identical; the cost is not.

### Work that consumes capacity without producing power

[PRACTITIONER] Linda Babcock, Brenda Peyser, Lise Vesterlund, and Laurie Weingart describe **nonpromotable tasks**: work that helps the organization but does little to advance the person doing it (Babcock et al., "Are You Taking On Too Many Nonpromotable Tasks?", EPUB pg_117–118). Such tasks are not central to the organization's mission, are often invisible to others, and "may not require specialized skills," so many people could do them (pg_119–120). The authors report from their own research that this work falls disproportionately on women, partly because women are more often asked and expected to say yes (pg_118). The finding is theirs and is not independently examined here.

[SYNTHESIS] The three features map precisely onto the article's mechanisms. Work outside the mission creates little dependence. Invisible work builds no reputation, because no one observes it. Work anyone could do gives no leverage, because the organization has alternatives. Nonpromotable work, in this article's terms, consumes capacity without producing power. If it is assigned unevenly, the strategies of the preceding chapters are unevenly affordable, whatever anyone's skill.

> **Constraint box: capacity is finite** `[SYNTHESIS]`
>
> Every strategy in this article consumes something: time to build relationships, attention to read situations, energy to sustain performances, and slack to absorb the risk of refusal. These are limited, and they are not equal across people.
>
> - **Time.** Coalitions and reputations are built through repeated interaction. Someone absorbing extra work has less time for either.
> - **Attention.** Monitoring how one's actions will be read is itself work.
> - **Energy and health.** The HBR *Finding Balance* volume treats burnout, stress, and mental health as real constraints rather than private failings. Ioana Lupu and Mayra Ruiz-Castro report interviews at two London professional firms in which many took for granted that long hours were necessary for success, while some consciously resisted overwork (Lupu and Ruiz-Castro, "Work-Life Balance Is a Cycle, Not an Achievement," EPUB pg_3–4). That observation fits the pooling mechanism in Chapter 7, in which an action can become expected and costly without informing anyone.
> - **Boundaries.** Some advice frames boundaries as a personal decision about "who we give power to" (Sanok, "A Guide to Setting Better Boundaries," EPUB pg_32). That is useful for individuals but is not evidence that structural overload can be solved individually. Whether a boundary holds depends on the person's alternatives and reputation.
>
> Before recommending a tactic, ask whether this person can afford it, not only whether it would work.

### What this chapter does not claim

It does not claim that every member of a social group experiences the same costs, or that identity determines outcomes. The sources are mostly personal accounts and advice, and they differ among themselves. It does not claim that strategic action is futile for people facing higher costs; the same sources offer practical approaches because action remains possible. And it does not claim that every difference in cost is unfair; some reflect tenure or track record, which organizations may reasonably weigh.

It does claim that cost, risk, and feasibility are variables. An analysis that holds them fixed will misread situations systematically, treating a tactic that worked for one person as available to another on the same terms.

With this qualification in place, the article has assembled many mechanisms, each of which explains part of what happens and none of which explains enough alone. Using them together, without collapsing a situation into one lens or losing it among a dozen, requires a method.

## Chapter 11. A Systems Diagnostic for Real Organizations

[SYNTHESIS] This chapter assembles the article's mechanisms into a structured way of examining a real situation. It is necessary to be exact about what the result is not.

- It is **not validated**. No one has tested whether using it improves decisions.
- It is **not predictive**. It does not forecast outcomes.
- It is **not an equation**. Its dimensions are not combined by any formula.
- It is **not a score**. Its dimensions share no scale and should never be added up.
- It is **not a scientific law**. It is a synthesis of sources of very different kinds: formal models, conceptual arguments, case material, measurement research, and practitioner advice.

What it offers is a disciplined sequence of questions that makes a reader less likely to miss a mechanism or over-trust a single explanation. Each dimension below points back to the chapter that develops it rather than re-teaching it.

### The sequence

Thirteen dimensions are grouped into six stages that follow the article's argument:

**formal structure → dependence → strategic conditions → time → social structure → execution under constraint**

The order is a reading order, not a causal claim. It runs from what is easiest to observe (the org chart) to what is hardest (who can afford which move). In practice a reader will loop back: a finding about network position may change an answer about alternatives.

<!-- visual:V11 -->

### Stage 1. Formal structure

**1. Formal authority** (Chapter 1)
- *Question:* Who has the formal right to decide, approve, or veto?
- *Look for:* Titles, reporting lines, approval rights, formal accountability.
- *Why it matters:* Authority settles who may decide and improves a party's fallback when negotiation fails.
- *Common misreading:* Assuming the person with authority controls implementation.

### Stage 2. Dependence

**2. Resource control** (Chapter 2)
- *Question:* What does the outcome require, and who effectively controls each part?
- *Look for:* Budget, data, access, expertise, timing, approval queues. Effective control "is not always perfectly correlated either with ownership or with official responsibilities" (Pfeffer, 1992, p. 92).
- *Why it matters:* Resources are the raw material of leverage.
- *Common misreading:* Counting only money and formal approvals.

**3. Dependence** (Chapters 2 and 6)
- *Question:* Who needs what from whom, and how hard would it be to get elsewhere?
- *Look for:* Bottlenecks, single points of failure, resources without substitutes.
- *Why it matters:* Dependence converts control into leverage.
- *Common misreading:* Treating dependence as one-directional; making others depend on you can also confine you.

### Stage 3. Strategic conditions

**4. Incentives** (Chapter 4)
- *Question:* What does each actor gain or lose under each plausible outcome?
- *Look for:* Metrics, workload effects, status, risk, career consequences, including unstated ones.
- *Why it matters:* Each actor's best response depends on their payoffs and expectations of others.
- *Common misreading:* Calling resistance irrational before reconstructing the resister's incentives and beliefs.

**5. Alternatives and fallbacks** (Chapter 6)
- *Question:* What can each party do if the other says no?
- *Look for:* Workarounds, other providers, escalation paths, exit options, the cost of delay for each side, and who controls the procedure.
- *Why it matters:* What each side gets without agreement anchors what agreement looks like.
- *Common misreading:* Equating bargaining power with formal authority, or assuming an alternative is costless to reveal.

**6. Information distribution** (Chapter 7)
- *Question:* Who knows what, who does not, and who controls what others learn?
- *Look for:* Private knowledge of workload, capability, or intentions; who compiles the analysis; who sits on communication paths.
- *Why it matters:* When facts are hidden, actions are read as evidence and control of information becomes influence.
- *Common misreading:* Treating every action as a deliberate signal, or assuming good work is seen.

**7. Credibility** (Chapter 5)
- *Question:* When the moment arrives, will each party actually want to do what it has said?
- *Look for:* The cost of follow-through to the speaker, whether the speaker will control what is needed, anything irreversible already done, whether follow-through will be observed.
- *Why it matters:* Statements about the future shape behavior only if they are believed.
- *Common misreading:* Confusing sincerity with credibility.

### Stage 4. Time

**8. Repeated interaction** (Chapter 8)
- *Question:* Will these parties deal with each other again, and do they expect to?
- *Look for:* Ongoing relationships, known end dates, whether behavior is visible to those who would respond.
- *Why it matters:* An expected future can discipline present behavior; a known end can remove that discipline.
- *Common misreading:* Assuming long relationships are healthy. Repetition can sustain retaliation, exclusion, and arrangements that serve insiders at others' expense.

**9. Reputation** (Chapter 8)
- *Question:* What do relevant others believe about each actor, and on what evidence?
- *Look for:* Track records, early impressions, whose contributions are visible and whose are not.
- *Why it matters:* Reputation shapes how actions are read and how resources are allocated.
- *Common misreading:* Assuming reputation tracks contribution; where history is ambiguous, it may track visibility.

### Stage 5. Social structure

**10. Network position** (Chapter 9)
- *Question:* Where does each actor sit, and who connects groups that otherwise do not talk?
- *Look for:* Brokers, gatekeepers on communication paths, access to people decision-makers listen to.
- *Why it matters:* Position shapes access to information and control over what others learn.
- *Common misreading:* Equating many contacts with a useful position.

**11. Coalitions** (Chapter 9)
- *Question:* Whose support is needed, whose is already assembled, and what holds it together?
- *Look for:* Allies in key positions, reciprocal obligations, sponsors, groups whose joint refusal would matter.
- *Why it matters:* Coalitions pool resources, make collective refusals credible, and narrow others' alternatives.
- *Common misreading:* Treating coalition-building as inherently corrupt, or inherently benign.

### Stage 6. Execution under constraint

**12. Political skill** (Chapter 3)
- *Question:* Who can read this situation accurately and adapt to different audiences?
- *Look for:* Social astuteness, interpersonal influence, networking ability, apparent sincerity.
- *Why it matters:* Structural possibilities do not act on their own; people must recognize and use them.
- *Common misreading:* Treating political skill as good character, apparent sincerity as sincere motive, or skill as the same thing as network position.

**13. Individual and social constraints** (Chapter 10)
- *Question:* Can this particular person afford this particular move?
- *Look for:* Reputation buffer and tenure, available alternatives, interpretation risk, workload including nonpromotable tasks, health and capacity.
- *Why it matters:* A strategy may be structurally available without being equally safe, affordable, or sustainable.
- *Common misreading:* Assuming a tactic that worked for one person is available to another on the same terms, or assuming a category of person always faces the same penalty.

### How the dimensions connect

Three chains recur throughout the article. They are synthesis diagrams that summarize its argument, not tested causal models.

- **Resource control → dependence → leverage.** Control creates leverage only to the extent that others need the resource and lack alternatives.
- **Private information → belief → interpretation → strategic response.** When facts are hidden, observers respond to their reading of behavior rather than to the facts.
- **Network position → access → coalition possibilities → implementation capacity.** Whom one can reach shapes which coalitions can form and what can actually be carried out.

Links also cross stages. Reputation changes credibility, because a party known to follow through is more easily believed. Constraints change alternatives, because someone who cannot afford to leave has a weaker fallback. Information distribution changes reputation, because only observed behavior can be credited.

### A worked example

[SYNTHESIS] **Hypothetical example.** Return to the product manager whose approved analytics launch has stalled. The diagnostic produces questions, not a verdict.

- **Formal authority:** The product manager owns the launch. That is all the org chart shows.
- **Resources and dependence:** Data, security, finance, and a senior sales leader each control something the launch needs. None depends much on the product manager.
- **Incentives and fallbacks:** Does the data team's scorecard reward supporting this launch? If sales can keep using existing spreadsheets, its fallback is comfortable and its leverage high.
- **Information:** Does the security reviewer know the tool's real risk profile? Does the product manager know the data team's actual backlog, or only the stated one?
- **Credibility:** The product manager promises the tool will save sales time. Is that credible to people who have watched earlier tools fail?
- **Time and reputation:** Has the product manager delivered for these teams before? Will they need the product manager's help later?
- **Network and coalitions:** Who connects the product manager to the sales leader? Whose endorsement would change the sales leader's belief?
- **Skill and constraints:** Can the product manager tell which concern is decisive for each group, and does the product manager have the time and standing to build these relationships while also delivering?

A reader might conclude that the decisive obstacle is the sales leader's comfortable fallback, not the security queue. That is an informed judgment, not a calculated result, and it identifies which facts should be checked before acting.

### Recommended practice

This synthesis proposes three practices. They are recommendations for careful use, not tested procedures.

- **Record the evidence behind each answer.** "The data team is overloaded" is a belief. A queue of open requests is evidence. The distinction between belief and evidence applies to the analyst too.
- **Look for the fact that would change the diagnosis.** The most useful question is often which single finding, if different, would reverse the conclusion.
- **Never total the dimensions.** A situation favorable on twelve dimensions can be decided by the thirteenth.

A framework assembled from formal models, conceptual arguments, and practitioner advice inherits the limits of each. Those limits need to be stated as precisely as the framework itself.

## Chapter 12. Where These Models Break

The aim of this chapter is not to retreat into "it depends." Each limit below has a definite shape, and they rest on different grounds, so they are sorted into three kinds: limits the sources themselves establish, methodological cautions that follow from the kind of evidence used, and limits of this article's synthesis.

### A. Limits the sources establish

**Formal results depend on their assumptions.** Rationality in the notes is a modeling definition: a rational player maximizes expected payoff given beliefs (Yildiz, Ch. 4, p. 51). Backward induction assumes common knowledge of rational play at every future decision (Ch. 9, p. 131). Nash equilibrium assumes players correctly anticipate one another (Ch. 6, p. 83). And the notes state that the assumption of known payoffs "almost never holds" in real life (Ch. 16, p. 324). A result that holds under these assumptions is a result about the model.

**Equilibrium is not prediction.** Games often have several equilibria (Yildiz, Ch. 6, p. 85), and patient players in repeated interaction can sustain "a large set of behavior" (Ch. 12, pp. 216–217). A concept that permits many outcomes cannot by itself say which will occur.

**Equilibrium is not fairness.** The Prisoners' Dilemma yields a stable outcome that leaves both players worse off (Yildiz, Ch. 1, p. 6), and implicit cartels sustain stable cooperation at consumers' expense (Ch. 13, p. 252). Stability says nothing about who deserved what.

**The wrong game produces confident errors.** The notes' own example is a historical vote in which the standard analysis predicted one result and another occurred, because preferences were uncertain and electoral incentives lay outside the simple model (Yildiz, Ch. 10, pp. 156–157).

**Measurement is not causation.** The Political Skill Inventory research supports the construct and its measurement, and reports that the inventory predicted performance ratings in two samples. It does not show that political skill causes promotion, performance, or ethical behavior (Ferris et al., 2005, pp. 126–152).

**The same evidence can support rival explanations.** *Managing with Power* names two explanations for the stability of managers' ratings over five years, early accuracy or self-reinforcing opportunity, and judges the second more plausible (Pfeffer, 1992, p. 137). The data as reported do not decide between them. An association between network position and advancement raises the same question of which caused which.

**Organizational history is hard to read.** "History is often ambiguous": consequences arrive late, people move on, and responsibility is shared (Pfeffer, 1992, p. 144), and organizations often avoid learning which decisions were good (p. 249). Every lens here that depends on observed behavior, including credibility, reputation, and repeated interaction, inherits this limit.

**Political lenses can be over-applied.** Pfeffer warns that misjudging how politicized a situation is can lead a person "to use power and influence when it is unnecessary, and thereby violate behavioral norms as well as waste resources" (Pfeffer, 1992, p. 33). Not every delay is a power play, and not every action is a signal.

**People are not fully deliberate optimizers.** Pfeffer describes consistency as a way to economize on cognitive effort and avoid confronting failure (Pfeffer, 1992, pp. 193–194). The practitioner material treats emotion and stress as real influences on behavior. The formal models never claimed to describe psychology; these accounts mark where the models' simplifications stop matching behavior.

**Practitioner advice is not uniform evidence.** The HBR chapters are advice, interviews, and personal accounts. They disagree with one another, and where they cite research, the studies lie outside this corpus. They support qualified statements about what their authors observe and recommend, not general effects.

### B. Methodological cautions

**Models built for games and markets may not transfer.** The formal examples involve breakfasts and bullies, legislatures, lawsuits, and markets with a few competing firms. Organizations have asymmetric authority, changing membership, ambiguous goals, and many simultaneous interactions. Every organizational use of a formal result in this article is labeled an analogy for that reason, and each is useful only to the extent that its assumptions can be checked in the case at hand.

**Cases illustrate; they do not estimate.** Case material can show that a mechanism exists and how it operates. It cannot show how often it operates or how strong it typically is.

**Culture and institutions are thinly covered.** The corpus rarely addresses legal systems, national cultures, or industry institutions, and Pfeffer's own question about whether a tactic works "across gender and cultures" is left open (Pfeffer, 2010, Ch. 7). The article therefore makes no claims about cultural variation. That silence is a limit of the evidence, not a finding that culture does not matter.

**Some supplied sources were excluded.** Two documents in the research corpus could not be verified for authorship or provenance and carry no evidentiary weight here. The account of organizational power leans correspondingly on Pfeffer's books, which combine argument, cases, and reported research.

**Ethics lies outside what the models settle.** The models describe what is stable, not what is right. Effectiveness and legitimacy are both legitimate questions, but they are different questions, and nothing in the diagnostic decides whether a given use of power is justified.

### C. Limits of this article's synthesis

**The diagnostic has not been tested.** Its structure reflects this article's argument, not an empirical result.

**Agreement across sources is not independent confirmation.** When a formal model, a case, and a practitioner account point the same way, the convergence is suggestive, but the organizational reading of the model was chosen to fit and the account was selected for relevance. That is why each convergence here is labeled synthesis.

**The lenses can crowd out simpler explanations.** A thirteen-dimension framework can find strategic meaning in events with plainer causes: a mistake, a misunderstanding, a lack of resources, a rule followed without thought. It should be used after simpler explanations have been checked, not instead of checking them.

<!-- visual:V12 -->

### Conclusion

No single lens explains an organization.

Hierarchy tells you who is formally authorized. Dependence tells you where leverage comes from. Strategic analysis clarifies incentives and credibility. Information shapes interpretation. Repetition changes current incentives. Networks shape access and the capacity to form coalitions. Political skill affects social execution. Individual constraints change the cost of action.

Each lens also carries its own assumptions and fails in its own way. Dependence explains leverage but not interpretation. The formal models explain credibility and stability under stated conditions but not fairness or psychology. Network analysis explains access but not skill. Political skill explains execution but not structure. The practitioner material exposes costs the other lenses omit but does not supply general effects.

The advantage this article offers is a specific kind of judgment: identifying which mechanism is actually operating in a given situation, which lens explains it, what that lens assumes, and what evidence would show that the assumption has failed.

## References

In-text citations use author, year, and printed page for books and articles; chapter and printed page for the MIT lecture notes; chapter only for Pfeffer (2010), whose printed pagination could not be verified in the supplied edition; and author, chapter title, and EPUB page marker for chapters in the HBR collection. PDF page numbers are cited only where a printed page could not be recovered (Ferris et al., 2005).

### Academic articles

- Ferris, Gerald R., Darren C. Treadway, Robert W. Kolodinsky, Wayne A. Hochwarter, Charles J. Kacmar, Ceasar Douglas, and Dwight D. Frink. 2005. "Development and Validation of the Political Skill Inventory." *Journal of Management* 31(1): 126–152. https://doi.org/10.1177/0149206304271386
- Ferris, Gerald R., Darren C. Treadway, Pamela L. Perrewé, Robyn L. Brouer, Ceasar Douglas, and Sean Lux. 2007. "Political Skill in Organizations." *Journal of Management* 33(3): 290–320. https://doi.org/10.1177/0149206307300813

### Books

- Pfeffer, Jeffrey. 1992. *Managing with Power: Politics and Influence in Organizations*. Boston: Harvard Business School Press. (Paperback 1994.)
- Pfeffer, Jeffrey. 2010. *Power: Why Some People Have It—and Others Don't*. New York: HarperBusiness. EPUB ISBN 978-0-06-201061-2. Cited by chapter.

### Lecture notes

Yildiz, Muhamet. 2012. *14.12 Economic Applications of Game Theory*, lecture notes, Massachusetts Institute of Technology. Chapters cited:

- Ch. 1, "Introduction" (pp. 1–8)
- Ch. 3, "Representation of Games" (begins p. 29)
- Ch. 4, "Dominance" (begins p. 51)
- Ch. 5, "Rationalizability" (begins p. 65)
- Ch. 6, "Nash Equilibrium" (begins p. 83)
- Ch. 9, "Backward Induction" (begins p. 131)
- Ch. 10, "Application: Negotiation" (begins p. 153)
- Ch. 11, "Subgame-Perfect Nash Equilibrium" (begins p. 173)
- Ch. 12, "Repeated Games" (begins p. 199)
- Ch. 13, "Application: Implicit Cartels" (begins p. 247)
- Ch. 14, "Static Games with Incomplete Information" (begins p. 265)
- Ch. 16, "Dynamic Games with Incomplete Information" (begins p. 311)

### Chapters in *The HBR Work Smart Collection (4 Books)*

Harvard Business Review Press, 2024, ISBN 9798892790659. The collection contains four internal works without separate book-level publication records in the supplied file [book-level metadata incomplete]. EPUB page markers restart within each internal work.

*Authenticity and the Power of You*

- Clark, Dorie. "When You Don't Feel Comfortable Being Yourself at Work." EPUB pg_105–110.
- David, Susan. "Managing the Hidden Stress of Emotional Labor." EPUB pg_75–79.
- Fountain, Dannie Lynn. "Should You Disclose an Invisible Marginalized Identity at Work?" EPUB pg_47–56.
- Phillips, Katherine W., interviewed by Amanda Kersey. "Self-Disclosure at Work." EPUB pg_39–45.

*What Does It Mean to Have a Career?*

- Claman, Priscilla. "Thinking of Quitting Your Job?" EPUB pg_123–130.
- Wiseman, Liz. "Should You Really Be Indispensable at Work?" EPUB pg_157–163.

*Finding Balance*

- Babcock, Linda R., Brenda Peyser, Lise Vesterlund, and Laurie Weingart. "Are You Taking On Too Many Nonpromotable Tasks?" EPUB pg_117–124.
- Lupu, Ioana, and Mayra Ruiz-Castro. "Work-Life Balance Is a Cycle, Not an Achievement." EPUB pg_3–10.
- Sanok, Joe. "A Guide to Setting Better Boundaries." EPUB pg_31–39.
- Sawhney, Vasundhara. "How to Say No to Extra Work." EPUB pg_93–98.

*The Two Key Ingredients to Great Work Relationships*

- Cohen, Paige. "Three Ways to Say No to Your Boss." EPUB pg_21–27. (Includes contribution by Nicole D. Smith.)
- Ku, AiLun, and Ray Reyes. "Networking Skills for Professionals from Underrepresented Backgrounds." EPUB pg_131–138.
- Omadeke, Janice. "What's the Difference Between a Mentor and a Sponsor?" EPUB pg_139–143.
- Postma, Niven. "You Can't Sit Out Office Politics." EPUB pg_81–92.
- Tamboli, Anand. "When It Comes to Promotions, It's About Who Knows You." EPUB pg_123–130.
