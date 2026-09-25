## What this article promises

Headlines about "better models" treat capability as if it were the product. This article follows one ordinary engineering request, a vague bug report saying that an application's left sidebar is laggy, from the inside of a transformer to the moment someone decides whether the fix was worth making. Along the way it explains six things:

1. How a model's architecture decides what it can learn, keeps training from blowing up, and sets the cost of every token it serves.
2. Why a highly capable model still fails without knowledge of *your* situation, and how that knowledge is loaded, stored, and corrupted.
3. How a coding agent turns a request into an executed, checked change.
4. Who, or what, should verify that change, and which rules belong in instructions versus infrastructure.
5. Why "learning" in this field refers to at least three different processes running on different clocks.
6. Where cost, reliability, human attention, and real user feedback limit the value of the whole enterprise.

The explanations draw on four recorded talks, checked against primary documents where possible. The framework that connects them is mine, and I will say clearly where the evidence ends and the synthesis begins.

## How to read this article

**Who it is for.** The article is written for an intelligent beginner who wants real understanding rather than a quick overview. No prior machine-learning background is assumed, but the article does not avoid mathematics. Every equation follows the same pattern:

1. what it is for;
2. what each symbol means;
3. the steps;
4. the intuition;
5. a small worked example;
6. its assumptions and limits.

If you skip the equations, the prose around them still carries the argument. Longer derivations are in the appendices.

**The four recordings.** Everything specific to a speaker is cited to a timestamp in one of four recordings:

| Key | Recording | Where the timestamps point |
|---|---|---|
| **TH** | Tatsunori Hashimoto, *Stanford CS336: Language Modeling from Scratch*, Spring 2026, Lecture 3, "Architectures, hyperparameters" (6 April 2026) | The official Stanford Online upload. Quotations were checked against its published captions and the lecture's slides |
| **LM** | Lamis Mukta (Anthropic), "Learning while you sleep: Beyond memory to dreaming", AI Native DevCon London, June 2026 | The official AI Native Dev upload. Quotations were checked against its published captions |
| **LT** | Lauren Tan (Cursor), live session "How Cursor Turned AI Agents Into Better Engineers", hosted by Colin Matthews, 12 August 2026 | Two public re-uploads of the same session, cited as `V01 / V02`. No official captions exist; quotations were cross-checked across three automatic caption tracks (not independent listening checks) |
| **LT-full** | The fullest public upload of the same Lauren Tan session (59:41), used for on-screen material: slides, charts and screenshots | Timestamps refer to that upload; "video frame" means I read the slide from a still frame |
| **SA** | Sam Altman in conversation; interviewer unconfirmed | The repost and the original posted by Cory Levy are the same recording (96.8% repost transcript word overlap). Passages paraphrase machine transcripts, not checked by listening; SA timestamps refer to the repost |

**Quotation policy.** No spoken wording is claimed as verified by listening. The decisive passages that depended on exact unverified wording are paraphrased or omitted. Remaining quotations reproduce published captions or machine transcripts, with the source-specific limits above; they should be read as caption/transcript excerpts, not independent transcriptions of speech. These excerpts are lightly cleaned. Filler words ("uh", "um", "you know") and immediate repetitions ("make make") are removed silently. Any other omission is marked "…". Words added for grammar are in [brackets].

**Four kinds of statements, kept apart.** Throughout, I distinguish:

- **What a speaker says.** "Tan says…", "Mukta argues…", with a timestamp.
- **What a document shows.** Slides, official documentation, a public code repository, or a research paper, cited as such.
- **What I infer.** Marked *[my inference]* or introduced as a reconstruction or synthesis.
- **What remains unverified.** Marked *(unverified)*.

> **A note on these sources before we start.**
>
> 1. *Two of the five links I was originally given are the same recording.* The "Lauren Tan Part 1" and "Part 2" uploads contain the same live session, with 96–98% of their words matching in the same order. Each has a different short montage at the start whose origin I could not trace, so I use neither montage.
> 2. *Social-media framing goes beyond the checked captions and transcripts.* The posts that circulated them attributed to Mukta a line absent from the checked captions ("we don't write prompts anymore, we build loops"). They attributed to Altman a line absent from the checked machine transcripts ("You can build 10 assistants in an afternoon with GPT-6 Astra"). They also described the Stanford lecture as "a 1-hour course". It is one lecture of about 89 minutes from a full course, published in April 2026.
> 3. *None of the talks measures productivity.* They contain practitioners' reports and one lecturer's survey of the field. Where I bring in measurements, they come from separately cited studies.

## The map, and the running case

The article moves up through six layers. Each layer answers a question that the layer below it leaves open.

<!-- visual:layer-map -->

The running case comes from Lauren Tan. She describes her team's agents struggling with user reports as vague as "the left sidebar is like laggy" or a screenshot captioned with question marks [LT V01 10:46](https://youtu.be/KwOX7vJyoOk?t=646) / [LT V02 10:32; V01 12:32 / V02 12:20](https://youtu.be/7urwyHZwtEo?t=632). *What she documents* is the problem, the tools she built for it, and the kinds of checks her codebase enforces. *What she does not document* is a specific sidebar bug, its cause, its fix, or any measurement. Where I walk the case through a layer, I mark which steps are hers and which are my **teaching reconstruction** built from her description and from her team's published tooling. The reconstruction never invents a measurement, an outcome, or a business result.

We start at the bottom, inside the model.

## Part I — The Model

> **The question for Part I:** what is "raw capability", physically? What does a language model compute, what design choices let it learn at enormous scale without collapsing, and what does it cost to run?

Everything in this part comes from, or is checked against, Tatsunori Hashimoto's lecture on transformer architectures in Stanford's CS336 course, its published slides, and the papers the slides cite. Hashimoto frames the subject in one sentence that this part unpacks: an architecture "has to learn from data, so it has to generalize. It has to train efficiently on GPUs. And it has to not blow up" [TH 05:53](https://youtu.be/lVynu4bo1rY?t=353). Those three requirements, **learning**, **efficiency**, and **stability**, get "baked straight into the architecture", which is why, as he puts it, "architectures are actually a very complex set of trade offs" [TH 05:47](https://youtu.be/lVynu4bo1rY?t=347).

## Chapter 1. What a transformer computes

**The question:** before we can talk about what makes a model better or cheaper, what is the machine actually doing?

### 1.1 Text becomes vectors

A language model never sees letters or words directly. A **tokenizer** first cuts text into pieces called **tokens**. A token might be a whole common word, part of a rarer word, a space, or a punctuation mark. Each token has an ID in a fixed **vocabulary**. Hashimoto notes that early English-only models used vocabularies around 30,000 tokens, while multilingual and production models use 100,000–200,000 [TH 55:40–55:53](https://youtu.be/lVynu4bo1rY?t=3340).

Each token ID is mapped to a list of numbers called an **embedding vector**. The length of this list is the model's width, written d (or d_model). A typical large model might use d = 4096. From here on, "the text" is a stack of n vectors, one per token, each of length d.

### 1.2 The residual stream

The model is a tall stack of identical **blocks** (also called layers). The key design idea is that the blocks do not replace the vectors; they **add** to them. Picture each token's vector as a running notepad, called the **residual stream**, which flows from the bottom of the network to the top. Each block reads the notepad, computes a small correction, and adds that correction back. Hashimoto: "you have the residual stream that's x, that runs through the whole network", and each component adds "a delta back into the residual stream" [TH 08:01](https://youtu.be/lVynu4bo1rY?t=481). The practical rule he quotes from architecture designers is "keep your residual stream clean" [TH 11:08](https://youtu.be/lVynu4bo1rY?t=668). Chapter 2 explains why.

Each block contains two kinds of computation:

- **Attention**, which lets each token gather information from other tokens.
- A **feed-forward network** (FFN, also called an MLP), which transforms each token's vector on its own.

### 1.3 Attention: tokens looking at each other

Attention answers the question "which earlier tokens matter for this one, and what should I take from them?" It does this with three learned projections of every token vector:

- a **query** q: what this token is looking for;
- a **key** k: what this token offers to be found by;
- a **value** v: what this token hands over if chosen.

#### Equation 1 — Scaled dot-product attention

**Purpose.** To compute, for each token, a weighted average of other tokens' values, where the weights reflect how well their keys match its query.

$$\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

**Symbols.**
- Q, K, V are matrices whose rows are the queries, keys and values of the n tokens.
- d_k is the length of each query and key vector.
- QKᵀ is the table of all dot products, where entry (i, j) is q_i · k_j, a number that is large when the two vectors point the same way.
- softmax turns each row of that table into positive weights summing to 1: softmax(z)_j = e^{z_j} / Σ_m e^{z_m}.

**Steps.**
1. Score every pair (i, j) by q_i · k_j.
2. Divide by √d_k.
3. Turn each row of scores into weights with softmax.
4. Output, for token i, the weighted sum of the value vectors.

In a language model a **causal mask** sets the scores for future tokens to −∞ before the softmax, so token i can only look at tokens 1…i.

**Why divide by √d_k?** A dot product sums d_k products. If the entries are random with unit variance, the sum's typical size grows like √d_k. Without the division, larger heads would produce ever larger scores, softmax would put almost all weight on one token, and gradients would vanish. Dividing keeps scores in a similar range whatever the head size.

**Worked example.** Take a two-token sequence and d_k = 2. Let the second token's query be q₂ = (1, 0), the keys be k₁ = (1, 0) and k₂ = (0, 1), and the values be v₁ = (10, 0) and v₂ = (0, 10).

1. Scores: q₂·k₁ = 1 and q₂·k₂ = 0.
2. Scaled: 1/√2 ≈ 0.707 and 0.
3. Softmax: e^{0.707} ≈ 2.028 and e⁰ = 1, so the weights are 2.028/3.028 ≈ 0.670 and 0.330.
4. Output: 0.670·(10, 0) + 0.330·(0, 10) = (6.70, 3.30).

Token 2 "listens" mostly to token 1, whose key matched its query.

**Assumptions and limits.** This is **dense** attention: every token scores every earlier token, so the work grows with n². Hashimoto's lecture covers only dense attention and defers alternatives such as state-space models to a later lecture [TH 1:14:15; slides p. 7, 57](https://youtu.be/lVynu4bo1rY?t=4455). Attention by itself also has no notion of order. "Attention is positionally independent. They're just inner products" [TH 31:30](https://youtu.be/lVynu4bo1rY?t=1890). If you shuffled the tokens, the dot products would not change. Position has to be injected separately (§2.4).

### 1.4 The feed-forward network

After attention mixes information across tokens, the FFN transforms each token's vector individually. The classic form is:

$$\text{FFN}(x) = \max(0,\ xW_1 + b_1)\,W_2 + b_2$$

(slide p. 37). W₁ expands the vector from width d to a larger hidden width d_ff. The function max(0, ·), called **ReLU**, zeroes out negative entries. W₂ projects back down to d. Most of a model's parameters live in these matrices. Chapter 2 shows how modern models change this block.

### 1.5 From vectors to a prediction, and how the model is trained

At the top of the stack, each token's final vector is multiplied by an output matrix to produce one score, called a **logit**, per vocabulary entry. A softmax turns the logits into a probability distribution over "the next token". Generating text means sampling a token from that distribution, appending it, and repeating.

#### Equation 2 — Next-token cross-entropy loss

**Purpose.** To define what "doing well" means during training, as a single number the training process can push down.

$$L = -\frac{1}{T}\sum_{t=1}^{T} \log p_\theta(x_t \mid x_{<t})$$

**Symbols.**
- x₁…x_T are the tokens of a training text.
- p_θ(x_t | x_{<t}) is the probability the model, with parameters θ, assigned to the *actual* next token x_t given everything before it.
- log is the natural logarithm.

**Steps.** For each position, look up the probability the model gave to the token that really came next. Take its logarithm, which is negative because probabilities are below 1. Average, and flip the sign.

**Intuition.** The model is rewarded only for putting probability on what actually happened. Probability 1 on the right token costs 0. Probability 0.01 costs −log 0.01 ≈ 4.6.

**Worked example.** Suppose that over three positions the model gave the true next tokens probabilities 0.5, 0.25 and 0.8. The per-position losses are 0.693, 1.386 and 0.223 nats. The average is L ≈ 0.767.

**Assumptions and limits.** The loss measures prediction of training text, not usefulness, truthfulness or safety. Everything that makes a model's behaviour useful in an application, the subject of Parts II–VI, sits outside this objective.

> **Property of the model, not of an agent.** A trained model computes one thing: a probability distribution over the next token, given the tokens in its window. It has no tools, no memory beyond that window, and no way to check anything. Every capability discussed later in this article, such as reading files, running an app, remembering last week, or being stopped by a CI check, belongs to the **system built around** the model.

**Running case.** At this layer, "the left sidebar is laggy" is just a short sequence of tokens. Whatever the model does next, whether writing a plan, calling a tool or proposing a patch, will be one next-token prediction after another.

**The question this leaves.** A useful model has dozens of these blocks and billions of parameters, and is trained on trillions of tokens. How do you make such a deep stack learn at all, without the training run collapsing?

## Chapter 2. Making it learn without blowing up

**The question:** which design choices let a deep transformer train reliably, and why did the field converge on them?

Hashimoto's historical sketch sets the scene. After an early period of experimentation, "Llama 2 comes out. And everyone's like, wow, Llama 2 is great" [TH 06:45](https://youtu.be/lVynu4bo1rY?t=405), and many labs trained close variants. Then came "architecture modifications that make training more stable" and, more recently, "architecture variations that enable longer context dependence" [TH 07:01–07:09](https://youtu.be/lVynu4bo1rY?t=421). The course's own reference architecture deliberately departs from the 2017 original: layer norm moved to the front of each block, rotary position embeddings, and a gated FFN instead of ReLU [TH 02:28; slides p. 4](https://youtu.be/lVynu4bo1rY?t=148). "We've copied a lot of this over from … Llama" [TH 02:43](https://youtu.be/lVynu4bo1rY?t=163). This chapter explains each of those choices, plus the stability tricks that came later.

### 2.1 Where the normalisation goes: pre-norm vs post-norm

A **normalisation** layer rescales a vector to a standard size. That keeps numbers from drifting too large or too small as they pass through many layers. The question is where to put it.

#### Equation 3 — Post-norm and pre-norm blocks

**Purpose.** To show why moving the normalisation out of the residual path makes deep networks easier to train.

$$\text{post-norm:}\quad x_{\ell+1} = \mathrm{Norm}\big(x_\ell + F(x_\ell)\big)$$

$$\text{pre-norm:}\quad x_{\ell+1} = x_\ell + F\big(\mathrm{Norm}(x_\ell)\big)$$

**Symbols.** x_ℓ is the residual stream entering block ℓ. F is the block's computation (attention or FFN). Norm is the normalisation.

**Steps.** In post-norm, the original 2017 design, every block's output passes *through* a normalisation, so the stream itself is renormalised at each layer. In pre-norm, the block reads a normalised *copy* of the stream, but its output is simply added to the untouched stream.

**Intuition via a toy model.** Training works by sending an error signal (a gradient) backwards from the top of the network to the bottom. In pre-norm, unrolling the recursion gives

x_L = x₀ + Σ_ℓ F_ℓ(Norm(x_ℓ)).

So the top of the network contains the bottom input x₀ **directly**, with coefficient 1. The gradient has a "straight-through" path whose strength does not depend on depth. In post-norm, the gradient must pass through every normalisation on the way down, and each normalisation can rescale it.

*A deliberately simplified scalar illustration [my toy example].* Suppose each post-norm layer multiplies the backward signal by 0.7. After 10 layers the signal is 0.7¹⁰ ≈ 0.028 of its original size, and after 30 layers it is about 0.00002. In the pre-norm version the identity path still delivers 1, whatever else happens.

**What the evidence says.** Hashimoto describes the empirical record rather than a proof:

- The early motivation was removing the learning-rate warm-up period [TH 09:49](https://youtu.be/lVynu4bo1rY?t=589).
- Researchers then found that pre-norm improved "the sizes and frequencies of gradient spikes" [TH 12:14](https://youtu.be/lVynu4bo1rY?t=734).
- The slides cite Xiong et al. (2020) for gradient attenuation and Nguyen & Salazar (2019) for gradient spikes (slides p. 10, 12).

The practical conclusion is near-universal: "almost all modern LMs use pre-norm". The slides name one "somewhat funny exception", OPT-350M [TH 09:07; slides p. 10](https://youtu.be/lVynu4bo1rY?t=547). Some recent models (Grok, Gemma 2, OLMo 2) add a second normalisation *after* the computation but still outside the residual stream [TH 13:05; slides p. 13](https://youtu.be/lVynu4bo1rY?t=785). The lesson that has "actually been proven right", Hashimoto says with some amusement, is that if training is unstable "you can sprinkle in LayerNorms everywhere" [TH 13:29](https://youtu.be/lVynu4bo1rY?t=809).

**Assumptions and limits.** The toy model is only an illustration. Real gradients are vectors, and normalisations do not scale them by a fixed constant. The case for pre-norm is empirical: training curves and gradient statistics from the cited papers, not a derivation.

### 2.2 Which normalisation: LayerNorm vs RMSNorm

#### Equation 4 — LayerNorm and RMSNorm

**Purpose.** To see exactly what modern models removed from the original normalisation, and why removing it was a "free" gain.

$$\text{LayerNorm}(x) = \frac{x - \mu}{\sqrt{\sigma^2+\epsilon}}\cdot\gamma + \beta$$

$$\text{RMSNorm}(x) = \frac{x}{\sqrt{\tfrac{1}{d}\sum_i x_i^2+\epsilon}}\cdot\gamma$$

**Symbols.**
- x = (x₁, …, x_d) is a token's vector.
- μ is the mean of its entries and σ² their variance.
- ε is a tiny constant that avoids division by zero.
- γ is a learned per-dimension scale and β a learned per-dimension shift.

**Steps.** LayerNorm subtracts the mean (re-centres), divides by the standard deviation (rescales), then applies a learned scale and shift. RMSNorm skips the re-centring and the shift. It divides by the root-mean-square size of the vector and applies a learned scale.

**Worked example.** Take x = [1, 2, 3, 6], γ = 1, β = 0, ε ≈ 0.

- *LayerNorm:* μ = 3, deviations [−2, −1, 0, 3], σ² = (4+1+0+9)/4 = 3.5, σ ≈ 1.871. Output ≈ [−1.069, −0.535, 0, 1.604]. It has zero mean and unit variance.
- *RMSNorm:* RMS = √((1+4+9+36)/4) = √12.5 ≈ 3.536. Output ≈ [0.283, 0.566, 0.849, 1.697]. It has the same direction as x, rescaled to unit RMS.

**Intuition.** LayerNorm is strictly more expressive: it can do everything RMSNorm does and also re-centre. Yet "RMSNorm is nice, because in practice, there's really no expressiveness loss" [TH 14:38](https://youtu.be/lVynu4bo1rY?t=878), and it has fewer operations. (The slide writes the RMSNorm denominator as √(‖x‖²₂ + ε), without the 1/d. The difference is a constant factor that the learned γ can absorb [slides p. 14](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=14).)

**Why fewer operations matter more than their count suggests.** One of the most important ideas in the lecture is printed on the slide in bold: "FLOPS are not runtime!" [slides p. 16; TH 15:49](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=16). The slide reproduces a table from Ivanov et al., *Data Movement Is All You Need* (MLSys 2021). Table 1 in the MLSys 2021 paper (PDF page 4, §§3–3.2) reports the PyTorch profile of one BERT encoder layer during training. Its three rows match slide 16, including the 0.17% / 25.5% pair. The slide’s year label, 2023, is incorrect; the paper is from 2021. The three classes are:

| Operator class | % of floating-point operations | % of runtime |
|---|---|---|
| Tensor contraction (matrix multiplies) | 99.80 | 61.0 |
| Statistical normalisation (softmax, layer norm) | 0.17 | 25.5 |
| Element-wise operations | 0.03 | 13.5 |

Source: [Ivanov et al., Table 1](https://proceedings.mlsys.org/paper_files/paper/2021/file/bc86e95606a6392f51f95a8de106728d-Paper.pdf#page=4)

In Ivanov et al.'s classification, "statistical normalizations" include both **softmax and layer normalisation**. The paper concludes that these operators "are indeed memory-bound". Hashimoto's spoken version is that normalisation is "0.17% of the total floating point operations" but "can be up to 25% of the runtime" [TH 15:43, 16:11](https://youtu.be/lVynu4bo1rY?t=943). He adds that the percentage "in this case is quite extreme", because it comes from a small model with small matrices [TH 17:18](https://youtu.be/lVynu4bo1rY?t=1038). The point is not the exact number for any modern model. It is that a tiny share of the arithmetic can take a large share of the time. To see why, we need one more concept.

#### Equation 5 — Arithmetic intensity

**Purpose.** To explain when a computation is limited by arithmetic speed and when it is limited by how fast data can be moved. This idea returns in Chapter 3, where it becomes the key to serving costs.

$$I = \frac{\text{floating-point operations performed}}{\text{bytes moved to and from memory}}$$

**Symbols.** I is the arithmetic intensity in FLOP per byte.

**Steps and intuition.** A GPU can do a very large number of multiplications per second, but it can only fetch data from its main memory at a finite rate. If an operation does few calculations per byte it fetches, the arithmetic units sit idle waiting for data, and the operation is **memory-bound**. If it does many calculations per byte, it is **compute-bound**. The dividing line, sometimes called the ridge point, is the chip's peak FLOP rate divided by its memory bandwidth.

**Worked example (my estimates, order of magnitude only).**
- *The chip.* NVIDIA lists the H100 SXM at 1,979 BF16 teraFLOP/s *with sparsity* and 3.35 TB/s of memory bandwidth. The dense figure is conventionally half the sparse one, about 990 TFLOP/s, which puts the ridge near 990 / 3.35 ≈ 300 FLOP per byte.
- *RMSNorm.* On 16-bit numbers it does roughly 4 operations per element (square, accumulate, multiply by the inverse RMS, multiply by γ). It reads 2 bytes and writes 2 bytes per element, so I ≈ 1 FLOP/byte, far below 300. The chip mostly waits.
- *A matrix multiply* of n = 4096 token vectors by a 4096×4096 weight matrix does 2·n·d² ≈ 1.4×10¹¹ operations. It moves roughly 2·(d² + 2nd) ≈ 1.0×10⁸ bytes, so I ≈ 1,400 FLOP/byte, comfortably compute-bound.

**Assumptions and limits.** These estimates ignore caching, kernel fusion (combining several operations into one pass over memory), and many hardware details. The point is qualitative: operations that do little arithmetic per byte are expensive out of all proportion to their FLOP count. As Hashimoto puts it, "it's not really about the flops" [TH 15:49](https://youtu.be/lVynu4bo1rY?t=949).

Dropping the **bias** terms (the "+ b" in linear layers) follows the same logic. Hashimoto notes that bias terms "are generally not that useful" [TH 18:08](https://youtu.be/lVynu4bo1rY?t=1088), and the slide lists memory and optimisation stability as the reasons for dropping them [slides p. 18](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=18).

### 2.3 Gated feed-forward layers

Nearly every recent model replaces the ReLU FFN with a **gated linear unit**. Hashimoto: "almost all credible modern language models use a gated linear unit of some kind" [TH 21:41](https://youtu.be/lVynu4bo1rY?t=1301).

#### Equation 6 — The SwiGLU feed-forward layer and the 2/3 rule

**Purpose.** To show what "gating" adds, and why gated models use a narrower hidden layer.

$$\text{FFN}_{\text{ReLU}}(x) = \max(0, xW_1)\,W_2$$

$$\text{FFN}_{\text{SwiGLU}}(x) = \big(\text{Swish}(xW_1) \otimes xV\big)\,W_2$$

**Symbols.**
- W₁ and V are both d × d_ff matrices, and W₂ is d_ff × d.
- ⊗ is element-by-element multiplication.
- Swish(z) = z·σ(z), where σ(z) = 1/(1 + e^{−z}) is the logistic sigmoid (slide p. 23).
- GeGLU is the same construction with GELU in place of Swish.

**Steps.** Compute two d_ff-wide projections of x. Pass one through a smooth nonlinearity. Multiply the two element by element, so that one acts as a data-dependent "gate" on the other. Project back down.

**The parameter count.** The ReLU FFN has two matrices, so 2·d·d_ff parameters. The gated one has three, so 3·d·d_ff′. To keep the parameter count equal, set 3·d·d_ff′ = 2·d·d_ff, giving d_ff′ = (2/3)·d_ff. Since the classic rule of thumb is d_ff = 4d, "almost always" [slides p. 37](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=37), gated models end up with d_ff′ = (8/3)·d ≈ 2.67·d [slides p. 38](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=38).

**Worked example.** With d = 4096 and d_ff = 4·4096 = 16,384, the ReLU FFN has 2 · 4096 · 16,384 ≈ 134.2 million parameters per layer. A parameter-matched SwiGLU uses d_ff′ = (2/3)·16,384 ≈ 10,923, and 3 · 4096 · 10,923 ≈ 134.2 million.

The slide's table shows real models clustering around this value: LLaMA 70B at 2.68, Qwen 14B at 2.67, DeepSeek 67B at 2.68. Some are larger (Mistral 7B and LLaMA-2 70B at 3.5; PaLM at 4) [slides p. 38](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=38). Hashimoto explains the LLaMA-2 choice as the designers multiplying by "an arbitrary 1.33" because efficient attention freed budget for the MLP [TH 46:15](https://youtu.be/lVynu4bo1rY?t=2775).

**Evidence and limits.** Shazeer's original comparisons showed "very small deltas", but consistent ones, and "the GLU variants are almost always consistently better than the nonGLU variants" in parameter-matched comparisons [TH 25:22](https://youtu.be/lVynu4bo1rY?t=1522). Google's large comparison study (Narang et al.) found the same [TH 25:50; slides p. 25](https://youtu.be/lVynu4bo1rY?t=1550). Gating is not strictly necessary: GPT-3 used GELU without a gate, and Nemotron-4 340B used squared ReLU [TH 26:49](https://youtu.be/lVynu4bo1rY?t=1609). Consensus here means "reliably a bit better", not "required".

### 2.4 Position: rotary embeddings (RoPE)

Because attention ignores order (§1.3), position must be injected. The original transformer *added* sine and cosine patterns to the token vectors [TH 31:39](https://youtu.be/lVynu4bo1rY?t=1899). Later models used learned absolute positions, or relative offsets added inside attention. Most models since 2024 use **rotary position embeddings** [TH 32:34](https://youtu.be/lVynu4bo1rY?t=1954).

The design goal is a relative one. The attention score between a word at position m and a word at position n should depend on the words and on the **distance** n − m, not on where the pair sits in the text [TH 33:08–33:45](https://youtu.be/lVynu4bo1rY?t=1988).

#### Equation 7 — Rotations make attention depend only on relative position

**Purpose.** To show how rotating vectors by an angle proportional to position gives exactly this property.

In two dimensions, let R(α) be the rotation by angle α:

$$R(\alpha) = \begin{pmatrix}\cos\alpha & -\sin\alpha\\ \sin\alpha & \cos\alpha\end{pmatrix}$$

RoPE rotates the query of the token at position m by mθ, and the key of the token at position n by nθ. Then

$$\big(R(m\theta)q\big)\cdot\big(R(n\theta)k\big) = q\cdot R\big((n-m)\theta\big)k$$

**Why the identity holds.** A dot product is unchanged when both vectors are rotated by the same angle. "we know that inner products of any kind are invariant to arbitrary rotation" [TH 34:34](https://youtu.be/lVynu4bo1rY?t=2074). Rotating both vectors back by mθ leaves q unrotated and k rotated by (n − m)θ.

**Worked example.** This is Hashimoto's own sentence pair [TH 34:51–35:47](https://youtu.be/lVynu4bo1rY?t=2091). In "we know that", *we* is at position 0 and *know* is at position 1. In "of course we know", *we* is at position 2 and *know* is at position 3. Take θ = 30° and q = k = (1, 0) for illustration.

- In the first sentence the score is cos((1 − 0)·30°) = cos 30° ≈ 0.866.
- In the second it is cos((3 − 2)·30°) ≈ 0.866.

The absolute positions moved, but "the relative angle between these two is still separated by 1" [TH 35:47](https://youtu.be/lVynu4bo1rY?t=2147), so the score is identical.

**From two dimensions to d.** "Do the simplest possible thing" [TH 36:20](https://youtu.be/lVynu4bo1rY?t=2180): split the d-dimensional vector into d/2 pairs of coordinates and rotate each pair by its own angle (slides p. 34). The RoFormer paper that introduced RoPE sets the angles to

θ_i = 10000^{−2(i−1)/d}, for i = 1, …, d/2 (Su et al., eq. 15).

The first pairs rotate quickly and so are sensitive to nearby positions. The last pairs rotate very slowly and can track long-range structure [TH 36:44](https://youtu.be/lVynu4bo1rY?t=2204). RoPE is applied to the queries and keys inside every attention layer, not once at the input [TH 38:44](https://youtu.be/lVynu4bo1rY?t=2324). Unlike additive sinusoidal embeddings, it is "not additive, no cross terms" [slides p. 34](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=34), so the scores carry no absolute-position information.

**Assumptions and limits.** RoPE builds in the assumption that relative position is what matters. Variants exist: Gemma 4, Hashimoto notes, uses "proportional RoPE or p-RoPE" and rotates only part of the coordinates [TH 37:21–37:26](https://youtu.be/lVynu4bo1rY?t=2241). Alternatives that add a bias directly to the attention scores (for example, ALiBi) also work but have not become dominant [TH 43:19](https://youtu.be/lVynu4bo1rY?t=2599). The full derivation using complex numbers is in Appendix B.

### 2.5 Keeping training stable

Every choice so far helps stability to some degree. Hashimoto then turns to explicit stability interventions, and explains why they matter economically: a large run that diverges after "millions of dollars in training" may be unrecoverable [TH 1:05:49](https://youtu.be/lVynu4bo1rY?t=3949). The usual suspect is the softmax, which "has two things that are both really bad for stability": an exponential, which can overflow, and a division, which can blow up when the denominator is tiny [TH 1:06:26](https://youtu.be/lVynu4bo1rY?t=3986). A language model has two softmaxes: one at the output, over the vocabulary, and one inside every attention layer.

#### Equation 8 — The output softmax and the z-loss

**Purpose.** To show how a small extra penalty keeps the output softmax numerically well behaved without changing the model's predictions.

$$\log p(y) = u_y - \log Z$$

$$Z = \sum_{j=1}^{|V|} e^{u_j}$$

$$L_{\text{total}} = L + \alpha\,(\log Z)^2$$

**Symbols.**
- u_j is the logit for vocabulary entry j and u_y the logit of the correct token.
- Z is the softmax normaliser and |V| the vocabulary size.
- L is the cross-entropy loss from Equation 2.
- α is a small weight. PaLM used α = 10⁻⁴: "z_loss = 10⁻⁴ · log² Z to encourage the softmax normalizer log(Z) to be close to 0" [slides p. 54, quoting the PaLM paper](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=54).

**The key fact.** The softmax is *over-parameterised*. Adding the same constant c to every logit changes neither the probabilities nor the loss L, but it shifts log Z by c. The model can therefore drift toward huge or tiny logits for no benefit, and that drift is where numerical trouble starts. The z-loss "is just penalizing how far away your log z is from 0" [TH 1:08:49](https://youtu.be/lVynu4bo1rY?t=4129). It picks the harmless shift and pins it.

**Worked example.** Take logits [10, 12, 11].

1. log Z = log(e¹⁰ + e¹² + e¹¹) = 12 + log(1 + e⁻¹ + e⁻²) ≈ 12.408.
2. The probability of the second token is exp(12 − 12.408) ≈ 0.665.
3. The z-loss is 10⁻⁴ · 12.408² ≈ 0.0154.
4. Now shift every logit by −12, giving [−2, 0, −1]. The probabilities are unchanged, but log Z ≈ 0.408 and the z-loss is about 1.7×10⁻⁵. The penalty pushes the model toward the second, numerically safer representation.

**Where it is used.** The technique traces to Devlin et al. (2014) [TH 1:08:40](https://youtu.be/lVynu4bo1rY?t=4120). It was used in PaLM and later in Baichuan 2, DCLM, OLMo 2 and OLMo 3 [slides p. 54; TH 1:09:14](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=54).

**Limits.** The z-loss makes training more robust. It does not make the model know anything more.

#### QK-norm: taming the attention softmax

For the attention softmax, the popular fix is to "just throw in a LayerNorm before we multiply the Qs and Ks" [TH 1:10:31](https://youtu.be/lVynu4bo1rY?t=4231). Queries and keys are each normalised (usually with RMSNorm) before their dot product.

**A useful bound [my addition].** After RMSNorm with unit gains, each d_k-dimensional vector has length √d_k. By the Cauchy–Schwarz inequality their dot product is at most √d_k · √d_k = d_k in absolute value. After the 1/√d_k scaling of Equation 1, it is at most √d_k. With d_k = 128 that is about 11.3, before the learned gains. The scores can no longer grow without limit as the weights drift.

QK-norm is "originally from the multimodal world" [TH 1:11:01](https://youtu.be/lVynu4bo1rY?t=4261). The slide traces it to vision and multimodal models (Dehghani et al. 2023, IDEFICS, Chameleon) and lists later language models that use it: DCLM, OLMo 2, Gemma 2, Qwen3, OLMo 3 and Gemma 4 [slides p. 55](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=55).

#### Equation 9 — Logit soft-capping

**Purpose.** To show a harder alternative that bounds the logits directly, and what it costs.

$$\ell' = c \cdot \tanh(\ell / c)$$

**Symbols.** ℓ is a raw logit, c is the cap, and tanh is the hyperbolic tangent. For small ℓ, ℓ′ ≈ ℓ. As ℓ grows, ℓ′ approaches ±c but never exceeds it. Gemma 2 set "the soft_cap parameter to 50.0 for the self-attention layers and to 30.0 for the final layer" [slides p. 56, quoting the Gemma 2 report](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=56).

**Worked example.** With c = 30, a logit of 10 becomes 30·tanh(1/3) ≈ 9.64, almost unchanged. A logit of 100 becomes 30·tanh(3.33) ≈ 29.92.

**Trade-off, and what the evidence shows.** Hashimoto's concern is that soft-capping is a blunt instrument: "You can never express very confident signals in your softmax" beyond the cap [TH 1:13:36](https://youtu.be/lVynu4bo1rY?t=4416). He describes a "quality degradation that happens" when it is used alone [TH 1:13:32](https://youtu.be/lVynu4bo1rY?t=4412). The comparison on his slide comes from a 2024 study by Rybakov et al., *Methods of improving LLM training stability*. The slide’s row labels and values match Table 4 of the paper: bf16 baseline 11.19, soft_cap 11.24, QKV_norm 10.85, QK_norm_cap 11.00, QK_norm 10.84, and QK_FC_norm 10.87. The study used an 830-million-parameter model; the perplexity comparison used 0.2T training tokens and learning rate 3 × 10⁻⁴, with reported 95% intervals of ±0.1 [slides p. 56; Rybakov et al., Table 4 and §5](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=56):

- baseline: 11.19;
- soft-capping alone: 11.24;
- QK-norm: 10.84.

The paper's own reading is more cautious than the lecture on one point. It finds soft-capping alone shows "no significant perplexity difference" from the baseline, while the normalisation variants improve perplexity significantly. So the fair summary is this. At that scale, QK-norm made the model both more stable and better, while soft-capping alone bought stability without a measurable gain in quality. Whether soft-capping costs quality at larger scales is not settled by that table. Soft-capping is used in the Gemma family: "Gemma 2, 3, and 4 all use the logit soft[-capping] trick" [TH 1:12:54](https://youtu.be/lVynu4bo1rY?t=4374).

One more training-time finding, about weight decay, is saved for Chapter 13, where it belongs with the training loop.

> **Property of the model, not of an agent.** Stability tricks decide whether a *training run* succeeds and how aggressively it can be tuned. They do not decide whether any given *output* is correct. "Stable" in this chapter means "the optimisation did not diverge". It is unrelated to whether an agent built on the model can be trusted, the subject of Part IV.

**Running case.** Nothing in this chapter touches the sidebar directly. It explains why the model that will read the bug report exists at all, and why its designers spent so much effort on things that are invisible to the user.

**The question this leaves.** A stable, capable model still has to be *run*, one token at a time, for every user and every request. What does that cost, and what makes it expensive?

## Chapter 3. What it costs to serve

**The question:** once a model is trained, what determines the cost and speed of using it, and why does the amount of text in the window matter so much?

"You've trained this very big model, and now you need to serve it to lots of users, and you're going to pay a cost for serving" [TH 1:15:28](https://youtu.be/lVynu4bo1rY?t=4528). Two resources are consumed: arithmetic (FLOPs) and memory traffic (bytes moved). Equation 5 told us which one binds.

### 3.1 Prefill and decode

Serving a request has two phases:

1. **Prefill.** The whole prompt (system instructions, conversation, file contents, tool output) is processed at once. All n tokens go through the network in parallel, much as in training. Large matrix multiplications dominate, and the GPU is kept busy.
2. **Decode.** The response is generated one token at a time. Each new token depends on the previous one, so generation cannot be parallelised across positions. Hashimoto calls this "the curse of autoregressive language modeling" [TH 1:17:18](https://youtu.be/lVynu4bo1rY?t=4638).

### 3.2 The KV cache

When generating token t + 1, the model needs attention scores against the keys and values of **all** previous tokens. Recomputing them at every step would be wasteful. Instead they are stored in "what's called a KV cache" [TH 1:17:29](https://youtu.be/lVynu4bo1rY?t=4649), and each step adds one new key and value per layer. This saves a large amount of compute, but it changes what the bottleneck is. At every step the model must read its weights and the whole cache from memory. It "is going to be reading parameters all the time" [TH 1:18:11](https://youtu.be/lVynu4bo1rY?t=4691).

<!-- visual:kv-cache -->

#### Equation 10 — The size of the KV cache

**Purpose.** To make concrete how much memory a long context occupies while a response is being generated.

$$\text{KV bytes} = 2 \times L \times h_{kv} \times d_{\text{head}} \times n \times b \times s$$

**Symbols.**
- The leading 2 counts one key and one value per token.
- L is the number of layers.
- h_kv is the number of key/value heads.
- d_head is the size of each head.
- n is the number of tokens in the context and b the number of sequences served together (the batch).
- s is the bytes per number (2 for 16-bit formats).

**Worked example [my illustrative configuration].** Take a mid-sized model with L = 32 layers and 32 attention heads, each with its own keys and values (h_kv = 32), d_head = 128, stored in 16 bits.

- **Per token:** 2 × 32 × 32 × 128 × 2 bytes = 524,288 bytes = **0.5 MiB**.
- **A 4,096-token context:** 2 GiB for one sequence.
- **A 32,768-token context:** 16 GiB.

If the model instead shares each key/value head among 4 query heads (h_kv = 8; see §3.4), the figures drop to 0.125 MiB, 0.5 GiB and 4 GiB.

**Assumptions and limits.** This is arithmetic from the definition, not a measurement of any product. Production servers reduce the footprint with techniques such as paging, quantisation and sharing a common prefix among requests, and providers price tokens in ways that reflect this. The qualitative lesson holds anyway: **every token of context has a memory cost that is paid again at every generated token.**

#### Equation 11 — Arithmetic intensity in prefill vs decode

**Purpose.** To show, using the lecture's own symbols, why decode is memory-bound and why long contexts make it worse.

The slides define d as the model width, b the batch, n the sequence length (assumed smaller than d), h the number of heads, and k = d/h the head size [slides p. 58](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=58). Counting work and memory traffic for one attention layer:

| Phase | Operations | Memory traffic | Arithmetic intensity |
|---|---|---|---|
| Prefill / training | O(bnd²) | O(bnd + bhn² + d²) | O((1/k + 1/(bn))⁻¹) |
| Decode with KV cache | O(bnd²) | O(bn²d + nd²) | O((n/d + 1/b)⁻¹) |
| Decode with multi-query attention | O(bnd²) | O(bnd + bn²k + nd²) | O((1/d + n/(dh) + 1/b)⁻¹) |

Sources: slides p. 58, 60 and 61, which follow Shazeer (2019).

**Steps.**
- **Operations.** The arithmetic is about the same in both phases: the same matrices get multiplied, only incrementally in decode.
- **Memory traffic.** It changes completely. In decode, each of the n steps re-reads the projection weights (the nd² term) and the growing cache of keys and values (the bn²d term).
- **Intensity.** Dividing operations by traffic gives the last column. For decode that is (n/d + 1/b)⁻¹, "not good", and it needs "large batches plus short sequence length or … really big model dimensions" [slides p. 60; TH 1:19:05](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=60).

**Worked example [my arithmetic, orders of magnitude only].** Use d = 4096, b = 8, n = 2048, h = 32, k = 128.

- **Prefill:** 1/k + 1/(bn) = 1/128 + 1/16,384 ≈ 0.0079, so the intensity is about **127**.
- **Decode:** n/d + 1/b = 0.5 + 0.125 = 0.625, so the intensity is about **1.6**.
- **Multi-query decode:** 1/d + n/(dh) + 1/b ≈ 0.0002 + 0.0156 + 0.125 = 0.141, so the intensity is about **7.1**.

**Intuition.** In decode, the n/d term is the obstacle: the longer the context relative to the model's width, the more bytes move per useful operation. "The n/d term is difficult to reduce" [slides p. 60](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=60). Multi-query attention divides that term by h. What remains is dominated by 1/b, which is one reason serving systems batch many users together.

**Assumptions and limits.** These are big-O expressions with constant factors dropped. Ratios *between* rows are meaningful, but the absolute numbers cannot be compared with the ≈300 FLOP/byte ridge point from Equation 5. The derivation is for one attention layer and ignores the feed-forward layers, kernel fusion and hardware detail. Appendix C counts every term.

### 3.3 Why context length is a cost, not only a capacity

Putting Equations 10 and 11 together gives a conclusion that matters for everything in Parts II and III. In decode, **cost grows with the number of tokens already in the window.** Long contexts occupy memory that could otherwise serve more users, and they lower the arithmetic intensity of every generated token. Architectures have responded directly. Hashimoto notes that this year's trend is toward "architecture variations that enable longer context dependence" [TH 07:09](https://youtu.be/lVynu4bo1rY?t=429). Besides the head-sharing tricks below, many models use **sparse or sliding-window attention**, in which some layers attend only to a recent window of tokens (GPT-3, GPT-OSS, Gemma 4 are among the examples on the slides) [TH 1:14:42; slides p. 64](https://youtu.be/lVynu4bo1rY?t=4482).

### 3.4 Sharing keys and values: MQA and GQA

The most widely adopted fix attacks the KV cache directly. In **multi-query attention** (MQA), all heads keep their own queries but "keep the Ks and the Vs the same across all the heads" [TH 1:19:48](https://youtu.be/lVynu4bo1rY?t=4788). The cache shrinks by a factor of h. The cost is expressiveness: "you do, in fact, lose significant expressive power" [TH 1:20:48](https://youtu.be/lVynu4bo1rY?t=4848). Shazeer's original paper reports "only minor quality degradation", and the slide summarises it as a "small PPL hit" [slides p. 63](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=63).

**Grouped-query attention** (GQA) sits in between. It keeps a small number of key/value heads, each shared by a group of query heads, so the ratio between the two "is a simple knob to control expressiveness … and inference efficiency" [slides p. 62; TH 1:21:27](https://raw.githubusercontent.com/stanford-cs336/lectures/main/lecture_03.pdf#page=62). The GQA paper reports that it "achieves quality close to multi-head attention with comparable speed to MQA" (Ainslie et al. 2023). Hashimoto's verdict: "very low inference cost, nearly the same performance as your full multihead", which is why "models today, almost all, adopt this GQA structure" [TH 1:22:30–1:22:57](https://youtu.be/lVynu4bo1rY?t=4950). A further variant, DeepSeek's multi-head latent attention, compresses keys and values differently [TH 1:21:40](https://youtu.be/lVynu4bo1rY?t=4900).

| Scheme | Key/value heads | KV cache relative to MHA | Decode intensity (big-O) | Quality evidence |
|---|---|---|---|---|
| Multi-head (MHA) | h | 1 | (n/d + 1/b)⁻¹ | Baseline |
| Grouped-query (GQA), g groups | g | g/h | ≈ (1/d + n·g/(d·h) + 1/b)⁻¹ *[my generalisation]* | "quality close to MHA" (Ainslie 2023) |
| Multi-query (MQA) | 1 | 1/h | (1/d + n/(dh) + 1/b)⁻¹ | "minor quality degradation" (Shazeer 2019) |

> **Property of the model, not of an agent.** The cost of one token of context, and how steeply cost rises with context length, is set by architecture, hardware and batching. **How many** tokens of context get loaded is decided by the system that builds the prompt. That second quantity is the subject of Part II.

**Running case.** A bug report plus a few relevant source files might be a few thousand tokens. The same report plus the whole codebase, every design document and every past conversation might be hundreds of thousands. Equations 10 and 11 show that this difference is not only a question of whether it fits in the window. It changes the memory and bandwidth consumed at every token the agent writes. *[My inference; the lecture does not discuss agents.]*

**The question this leaves.** We now know what the model computes, how it is kept stable, and what it costs. How does anyone know which of these many choices is right? And what, exactly, does all of this *not* tell us?

## Chapter 4. How the field knows, and what a model is not

**The question:** how is knowledge about architectures actually established, and where does "the model" stop and "the system" begin?

### 4.1 Learning from many experiments

Hashimoto is candid that architecture is not derived from first principles: "you can't really reason about this beforehand" [TH 19:45](https://youtu.be/lVynu4bo1rY?t=1185). The course's method follows from that. The best approach is to train models yourself; the second best is to learn from what everyone else has done, and he surveys the models released each year for exactly that purpose [TH 03:13](https://youtu.be/lVynu4bo1rY?t=193). From that survey come statements of a particular kind: "the kind of statement that we can make on the basis of what we do when we look at a variety of different models" [TH 20:02](https://youtu.be/lVynu4bo1rY?t=1202). He warns that "reading any single paper in isolation is very, very difficult", because no single report gives full detail. His advice for building intuition is to combine broad reading with trying things "yourself, even a much smaller scale" [TH 39:58–40:10](https://youtu.be/lVynu4bo1rY?t=2398).

The lecture also shows what honest uncertainty sounds like:

- Parallel attention/FFN blocks were once reported to cost no quality while improving hardware utilisation by 15% [TH 40:57](https://youtu.be/lVynu4bo1rY?t=2457). They have since "fallen out of popularity" [TH 28:59](https://youtu.be/lVynu4bo1rY?t=1739), perhaps because making them parallel means "you've lost half of your depth" [TH 29:21](https://youtu.be/lVynu4bo1rY?t=1761). But "no one's done the ablations" to settle it [TH 41:15](https://youtu.be/lVynu4bo1rY?t=2475).
- Most of the year's new models are mixtures of experts, which this lecture explicitly leaves for another day [TH 04:11](https://youtu.be/lVynu4bo1rY?t=251).

### 4.2 Forgiving hyperparameters

Many numbers that look critical turn out to sit in wide, flat "basins" where most reasonable choices work. The slides and the lecture give consensus values:

- **Feed-forward width.** "four times your hidden dimension" [TH 45:06](https://youtu.be/lVynu4bo1rY?t=2706), or about 8/3 for gated units (§2.3). T5 once used a "64x multiplier" [TH 47:10](https://youtu.be/lVynu4bo1rY?t=2830); its successor T5 v1.1 went "back to the standard 2.5 multiplier" [TH 49:31](https://youtu.be/lVynu4bo1rY?t=2971). A sweep from Kaplan et al. (2020) shows a broad flat region [TH 48:01](https://youtu.be/lVynu4bo1rY?t=2881).
- **Head size × number of heads = model width.** This holds in most models (slides p. 42).
- **Aspect ratio** (width relative to depth). Most models sit at "about 100 D model over n layers" [TH 52:29](https://youtu.be/lVynu4bo1rY?t=3149), partly for systems reasons, because splitting a model by depth across GPUs ("pipeline parallel") is much more painful than splitting by width [TH 53:11](https://youtu.be/lVynu4bo1rY?t=3191).
- **Vocabulary.** About 30,000 for English-only models; 100,000–200,000 for multilingual and production models [TH 55:40–55:53](https://youtu.be/lVynu4bo1rY?t=3340).

One study he cites goes further: across depth–width trade-offs, "the only thing that matters, in some sense, is flops" [TH 54:40](https://youtu.be/lVynu4bo1rY?t=3280). Beyond the basin, more compute makes a better model. Hashimoto closes the hyperparameter section by noting that, in practice, labs change architectural choices "one at a time", while weight decay is typically adjusted "in concert with learning rate" [TH 1:24:26](https://youtu.be/lVynu4bo1rY?t=5066). Appendix D collects the numbers.

### 4.3 The boundary between a model and a system

This chapter ends Part I by drawing the line that the rest of the article depends on.

| Question | Answered by the **model** (Part I) | Answered by the **agent system** (Parts II–V) |
|---|---|---|
| What can it represent and predict? | Architecture, parameters, training data, compute | — |
| What does it know about *this* codebase, user or organisation? | Only what happened to be in its training data | Context supplied at run time (Part II) |
| What can it do? | Emit tokens | Tools, execution environments, permissions (Part III) |
| How is its output checked? | Not at all | Tests, execution, CI, reviewers (Part IV) |
| How does it improve? | New training run (Chapter 13) | Memory, skills, rules updated between runs (Chapter 14) |
| What does a token cost? | Architecture × hardware × batch (Chapter 3) | How many tokens the system chooses to spend |
| Who controls it? | The lab that trains it | The team that deploys it |

**Running case.** Everything the agent will need to fix the sidebar that is *not* in the left column must come from somewhere else. A model that aced every benchmark would still not know which component in *your* application is the left sidebar, how to launch your development build, or what your team forbids. Those gaps define Part II.

**The question this leaves.** If the model's knowledge is general, where does situational knowledge come from, and how much of it should be put in front of the model?

## Part II — Context

> **The question for Part II:** a model trained on general text knows nothing specific about *your* codebase, users or organisation. What does it need to know to act on a real task, how should that knowledge be put in front of it, and how can that knowledge go wrong?

The main source for this part is Lamis Mukta's talk on context engineering at Anthropic. She opens with the question this whole article is about: "what it really takes to take the raw model intelligence that we have today and translate that into durable, scalable, useful products" [LM 01:24](https://youtu.be/tTcxVv8HHNw?t=84). Her answer, at least for the part of the problem she addresses, is **context**. Lauren Tan's account of building tools for Cursor's agents supplies the concrete case.

## Chapter 5. Why capability is not knowledge of your situation

**The question:** if models keep getting smarter, why do they still fail on ordinary tasks inside a particular organisation?

### 5.1 Mukta's claim

Mukta's central claim is that model improvements, on their own, do not carry over into a specific deployment:

In Mukta’s account, useful improvement requires context specific to the task and organisation; better general intelligence alone does not supply that context [LM 02:41; paraphrase of published captions](https://youtu.be/tTcxVv8HHNw?t=161).

The needed context, she says, is "often kind of orthogonal to the model intelligence" [LM 02:49](https://youtu.be/tTcxVv8HHNw?t=169). A newly released model will not, out of the box, know what it takes to succeed in your organisation. Her examples are familiar to anyone who has used a coding agent: "agents not knowing their way around a code base, or knowing enough about your own user preferences". She adds a failure of learning: agents do not get better the next time they do the task [LM 03:18–03:30](https://youtu.be/tTcxVv8HHNw?t=198).

She goes one step further and says that investing in context "has the effect of multiplying the intelligence even as models get smarter" [LM 03:09](https://youtu.be/tTcxVv8HHNw?t=189). That is a vivid metaphor, but the talk offers no measurement that would make "multiplying" more than a figure of speech. I treat it as her opinion.

### 5.2 The same point from the other side: an agent that could act but could not find anything

Tan's experience at Cursor shows the same gap from a practitioner's side. She had built a skill that let an agent launch Cursor's Electron-based "agents window" and record performance traces (Chapter 8 explains how). The agent could act. But:

In Tan’s account, an agent with application-control tools still struggled to connect a vague sidebar-performance report to the relevant feature in the agents window [LT V01 10:38–10:52](https://youtu.be/KwOX7vJyoOk?t=638) / [LT V02 10:13–10:40; paraphrase of machine transcripts](https://youtu.be/7urwyHZwtEo?t=613).

It "would spend a lot of time trying to like look up the code … How do I actually get to it on the UI which made it basically completely useless… it was just an awful experience" [LT V01 11:02–11:18](https://youtu.be/KwOX7vJyoOk?t=662) / [LT V02 10:48–11:05](https://youtu.be/7urwyHZwtEo?t=648). Many real reports were worse than "the sidebar is laggy". Often they were just "a screenshot" with "question mark question mark question mark" [LT V01 12:32](https://youtu.be/KwOX7vJyoOk?t=752) / [LT V02 12:20](https://youtu.be/7urwyHZwtEo?t=740).

Her fix was not a better model. It was a file: a **feature map** that "teaches the agent how to get to all of the features that you have". For something like the sidebar it records the sub-features, how a user reaches them, the keyboard shortcuts, and "the DOM elements … the attributes that you use for selecting things through the CDP" (the Chrome DevTools Protocol, the interface the agent uses to drive the app) [LT V01 11:24–13:16](https://youtu.be/KwOX7vJyoOk?t=684) / [LT V02 11:11–13:06](https://youtu.be/7urwyHZwtEo?t=671). On screen, the map's README also carries "Driving conventions" for the agent: prefer accessibility labels and dedicated `data-*` attributes as selectors, keep developer overlays off, and wait for observable end states because streaming output is non-deterministic [LT-full 13:40, video frame](https://youtu.be/Cmoh-yR-usA?t=820). Her team's public plugin, pstack, now generates such maps automatically. They take the form of an index plus one file per feature, recording "what the app does and what result proves each feature works" [repo: pstack, docs/guide/06-verify-and-ship.md](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/06-verify-and-ship.md).

**Running case: what is documented.** A report like "the left sidebar is laggy" arrives. Without a feature map, Tan's agent could not connect the words "left sidebar" to anything in the running application or the code. With the map, it has a route to the component and a way to select it.

### 5.3 Four kinds of context

"Context" covers several different things, and they fail in different ways. The following distinction is **my framework**, assembled from what the two speakers describe:

| Kind | What it is | Who writes it | When it enters the model's window | How it goes wrong | Examples in the sources |
|---|---|---|---|---|---|
| **Standing instructions** | Short, always-relevant rules and orientation | Humans (sometimes agents) | At the start of every session | Grows too long; goes out of date | CLAUDE.md files [LM 03:46–04:40](https://youtu.be/tTcxVv8HHNw?t=226); AGENTS.md [LT V01 42:05](https://youtu.be/KwOX7vJyoOk?t=2525) / [LT V02 42:39](https://youtu.be/7urwyHZwtEo?t=2559) |
| **Procedural knowledge** | How to carry out a kind of task | Humans with agents | When the task calls for it | Wrong or outdated procedure applied confidently | Skills [LM 05:30–07:10](https://youtu.be/tTcxVv8HHNw?t=330); Tan's skills [LT V01 16:02](https://youtu.be/KwOX7vJyoOk?t=962) / [LT V02 15:56](https://youtu.be/7urwyHZwtEo?t=956) |
| **Situational maps** | Where things are in *this* system and how to reach them | Generated from the code, then maintained | When navigating or verifying | "Feature maps rot" as the app changes [repo: pstack guide](https://github.com/cursor/plugins/blob/main/pstack/README.md) | Tan's feature map |
| **Accumulated experience** | What happened before: mistakes, preferences, outcomes | Mostly agents, during or after work | On demand, via search | Stale, contradictory, or deliberately poisoned (Chapter 7) | Memory [LM 04:40–08:40](https://youtu.be/tTcxVv8HHNw?t=280) |

**What the sources support.** Both speakers independently describe agents failing for lack of situation-specific information and succeeding once it is supplied. Neither measures the size of the effect. Mukta reports better results "the second time the agent does the task" [LM 14:23](https://youtu.be/tTcxVv8HHNw?t=863) but gives no figures. Tan describes the before and after qualitatively.

**The question this leaves.** If missing context is the problem, why not load everything the agent might ever need: every document, every file, every past conversation?

## Chapter 6. Loading the right context

**The question:** how do practitioners decide what goes into the model's window, and when?

### 6.1 Mukta's timeline

Mukta presents Anthropic's context engineering as a short history. The whole timeline "only really spanned the past year", and it follows a principle she states up front: "at Anthropic, we like to say do the simple thing that works" [LM 03:46](https://youtu.be/tTcxVv8HHNw?t=226).

1. **CLAUDE.md.** A Markdown file of instructions injected at the start of every session. Its effect "was kind of unreasonably effective" at steering the agent [LM 04:01](https://youtu.be/tTcxVv8HHNw?t=241). It also has problems: "what happens when this file with very important preferences gets very, very long?" [LM 04:39](https://youtu.be/tTcxVv8HHNw?t=279). What survived from this stage was the idea of a simple, human-readable file that both people and agents can edit.
2. **Memory tools.** The agent itself decides "when they read, when they write and when they update memories" [LM 05:17](https://youtu.be/tTcxVv8HHNw?t=317). This happens **in band**: "within the context of a session" [LM 05:22](https://youtu.be/tTcxVv8HHNw?t=322). In her account, this autonomy "proves to work really well".
3. **Skills and progressive disclosure.** A skill packages a procedure. "The agent only looks at this front matter", a short description at the top of the file, "before loading the skill" [LM 06:21](https://youtu.be/tTcxVv8HHNw?t=381). The full body loads only when the task needs it. Her analogy: "as if I had a bookshelf in my room". She scans the titles as a conversation goes and pulls a book off the shelf only when it is relevant [LM 06:41](https://youtu.be/tTcxVv8HHNw?t=401). If someone speaks French to her, she can take down a French dictionary without having kept "seven years of French classes" loaded in her head [LM 06:57–07:09](https://youtu.be/tTcxVv8HHNw?t=417). She also names a limitation: people still decide, in advance, which procedures deserve to be skills.
4. **Memory as a file system.** Anthropic's current approach is "modeling these memory systems just as file systems" [LM 07:43](https://youtu.be/tTcxVv8HHNw?t=463). Memories are Markdown files, and "agents are actually just very good at using normal file system tools like bash and grep" [LM 07:55](https://youtu.be/tTcxVv8HHNw?t=475), so the agent searches its memory the way it searches code. Her summary: Markdown is a good format for memories, memories may grow large as long as agents can search them, and agents should have autonomy over what they write [LM 08:29](https://youtu.be/tTcxVv8HHNw?t=509).

### 6.2 What the documentation adds

Anthropic's public documentation for Agent Skills describes progressive disclosure precisely, in three levels [docs: Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview):

| Level | What loads | When | Documented size |
|---|---|---|---|
| 1. Metadata | The skill's name and description | Always, at startup | "~100 tokens per Skill" |
| 2. Instructions | The body of SKILL.md | When the skill is triggered | "Under 5k tokens" |
| 3. Resources and code | Extra files, scripts | Only when referenced | "None until accessed". A script's code never enters the window; "only its output" does |

The last row matters for Part IV. A script that validates something runs as **deterministic code**, and the model sees only the result.

#### Equation 12 — The token budget of progressive disclosure

**Purpose.** To show, in numbers, why loading descriptions first and bodies on demand is so much cheaper than loading everything.

$$C_{\text{upfront}} = \sum_{i=1}^{S} m_i$$

$$C_{\text{everything}} = \sum_{i=1}^{S} (m_i + B_i)$$

**Symbols.** S is the number of available skills, m_i is the size in tokens of skill i's metadata, and B_i is the size of its body.

**Steps.** At the start of a session, only the metadata is paid for. Each skill actually triggered adds its body B_i. The "load everything" alternative pays for every body in every session.

**Worked example (hypothetical skill library).** Take S = 40 skills with the documented ~100-token metadata and, as an assumption, 3,000-token bodies (within the documented "under 5k").

- C_upfront ≈ 40 × 100 = **4,000 tokens**.
- C_everything ≈ 40 × 3,100 = **124,000 tokens**.

A task that triggers two skills pays about 4,000 + 6,000 = 10,000 tokens.

**Connecting to Part I [my inference].** Using the illustrative model from Equation 10 (0.5 MiB of KV cache per token), 4,000 tokens occupy about 2 GiB of cache per sequence while every response token is generated. 124,000 tokens would occupy about 60 GiB. Real deployments use grouped-query attention, caching and other techniques that shrink these numbers considerably, so the absolute figures are not predictions. The *ratio* is the point. **Mukta does not give cost as her reason.** She talks about files growing unwieldy and the agent's attention being overloaded. The serving-cost argument is my addition, built on Chapter 3.

**Assumptions and limits.** Progressive disclosure works only if the short descriptions are good enough for the model to choose the right skill. A poorly described skill is never loaded. A vaguely described one may be loaded when it shouldn't be.

### 6.3 Quality, not just cost

There is a second reason not to load everything, and it is independent of cost. Models do not use long contexts uniformly. In a 2023 study, Liu et al. found that "performance is often highest when relevant information occurs at the beginning or end of the input context, and significantly degrades when models must access relevant information in the middle" (*Lost in the Middle*). Newer models may behave better, and this should not be read as a fixed law. But it means that more context can **hide** the relevant fact as well as supply it.

### 6.4 Tan's version: skills written from observed failures

Tan arrives at the same design from the practitioner's end. A skill, she says, is "just markdown" that "encodes a lot of information [and] instructions" [LT V01 16:02](https://youtu.be/KwOX7vJyoOk?t=962) / [LT V02 15:56](https://youtu.be/7urwyHZwtEo?t=956). She built hers one at a time by watching agents fail. When the agent guessed at a bug's cause without reading the relevant code, she wrote a skill telling it to "stop hallucinating, actually go and … look up the code, use a lot of sub agents" [LT V01 16:23–16:58](https://youtu.be/KwOX7vJyoOk?t=983) / [LT V02 16:27–17:02](https://youtu.be/7urwyHZwtEo?t=987). Her explanation of *why* skills work invokes the idea, borrowed from "people on Twitter", that high-quality tokens pull the model into "a different latent space" [LT V01 16:17](https://youtu.be/KwOX7vJyoOk?t=977) / [LT V02 16:12](https://youtu.be/7urwyHZwtEo?t=972). That is a folk theory of the mechanism, not an established one, and I do not rely on it.

**Running case: reconstruction.** When the sidebar report arrives, a well-built setup loads, in stages:

1. Standing instructions about the repository.
2. The metadata of every skill.
3. The body of the skill that matches, for example a verification skill.
4. The single feature-map entry for the sidebar.
5. Whatever the agent finds by searching the code and any memory files.

*Mukta's and Tan's descriptions each cover parts of this sequence. The combined sequence is my reconstruction.*

**The question this leaves.** Selective loading solves the size problem, but it depends on the context being **right**. What happens when the context itself is wrong, out of date, or maliciously planted, especially once agents write it for each other?

## Chapter 7. When context misleads

**The question:** how can context make a capable model *worse*, and which failures appear only when many agents share it?

### 7.1 Failures that appear at scale

Mukta is explicit that a design that works for one agent breaks in production. She lists the problems her team has "seen … in production time and time again" [LM 09:26](https://youtu.be/tTcxVv8HHNw?t=566):

- **Concurrent writes.** "Multiple agents trying to write to a memory file at the same time. How do you manage that?" [LM 09:33](https://youtu.be/tTcxVv8HHNw?t=573)
- **Shared-context contamination.** One agent that runs into a problem and decides to update the organisation-wide context "that every other agent is currently reading from". If that update is wrong, "that would scale to all of your agents and be pretty disastrous" [LM 09:47](https://youtu.be/tTcxVv8HHNw?t=587).
- **Human–agent co-editing.** Keeping track of what's going on when people and agents edit the same memory [LM 09:54](https://youtu.be/tTcxVv8HHNw?t=594).
- **Staleness.** "Memories can go stale. Of course, something that was relevant in the past might not be relevant today, or maybe it was written incorrectly" [LM 10:03](https://youtu.be/tTcxVv8HHNw?t=603).
- **Poisoning.** A memory might be "even maliciously injected by someone trying to prompt inject your agents to write bad things to memory" [LM 10:09](https://youtu.be/tTcxVv8HHNw?t=609).

Each of these failures makes the model worse *because* it is capable. A model that reliably follows its context will reliably follow bad context too.

### 7.2 A cross-source example: agents writing misleading context for other agents

Tan describes the same mechanism in code rather than in memory files [my connection between the two sources]. Her team bans code comments in one codebase because "99% of the time agents just write code comments that kind of describe some historical thing that is actually totally irrelevant to the code" [LT V01 38:57–39:13](https://youtu.be/KwOX7vJyoOk?t=2337) / [LT V02 39:27–39:43](https://youtu.be/7urwyHZwtEo?t=2367). Her example:

> "it will often say like, you know, oh, Lauren said you should never do this and it's now in in a code comment. I'm like, what?… I didn't say that as like a durable, you know, global rule." [LT V01 39:15–39:30](https://youtu.be/KwOX7vJyoOk?t=2355) / [LT V02 39:45–40:00](https://youtu.be/7urwyHZwtEo?t=2385)

A remark made in one review became a permanent instruction in the codebase. Future agents read the codebase as context, and "agents just love to copy existing patterns" [LT V01 42:31](https://youtu.be/KwOX7vJyoOk?t=2551) / [LT V02 43:07](https://youtu.be/7urwyHZwtEo?t=2587). So a local, mistaken note becomes a propagating rule. That is Mukta's shared-memory contamination, reproduced through a different channel.

Tan also describes how context degrades when nobody curates it. In a "completely vibe coded application", she says, "you essentially have no guardrails whatsoever", and agents solve each task "in whatever method is the most convenient". Over time the codebase spirals, optimised "for shortcuts" [LT V01 33:12–33:30](https://youtu.be/KwOX7vJyoOk?t=1992) / [LT V02 33:33–33:51](https://youtu.be/7urwyHZwtEo?t=2013). The codebase is itself context, and here it is context that teaches the wrong lessons.

### 7.3 In-band vs out-of-band

Mukta introduces a distinction that becomes central in Part V. **In-band** memory is read and written by an agent during its own session. It has two built-in limitations [LM 16:03–16:53](https://youtu.be/tTcxVv8HHNw?t=963):

1. **"an inherent split of focus and resources"** [LM 16:03](https://youtu.be/tTcxVv8HHNw?t=963). The agent is asked to finish its task and, at the same time, to curate memory for future runs. How much effort should it spend helping future versions of itself rather than doing what it was asked?
2. **"an inherent visibility limitation"** [LM 16:35](https://youtu.be/tTcxVv8HHNw?t=995). An agent sees only its own session. It "has a new context window in each of those" sessions [LM 16:53](https://youtu.be/tTcxVv8HHNw?t=1013), so it cannot notice a mistake it keeps making across sessions, or failures that other agents in the fleet are running into.

She also adds staleness: something must periodically check that what is written is still correct [LM 18:01](https://youtu.be/tTcxVv8HHNw?t=1081). Her remedy, an **out-of-band** process she calls "dreaming", is explained in Chapter 14, where it belongs with the other learning loops.

### 7.4 Summary of failure modes

| Failure | Example | Mechanism | Mitigation described in the sources | Where the mitigation lives |
|---|---|---|---|---|
| Too much context | Long instruction files; loading everything | Relevant facts diluted; cost grows (Ch. 3) | Progressive disclosure; search instead of preload [LM; docs](https://youtu.be/tTcxVv8HHNw?t=0) | Harness design |
| Missing situational context | "Left sidebar" with no map | Model cannot ground the words | Feature map [LT](https://youtu.be/Cmoh-yR-usA) | Maintained context file |
| Stale context | Old preferences; feature maps that "rot" | World changed, context didn't | Maintenance passes [LT/pstack](https://youtu.be/Cmoh-yR-usA); out-of-band review [LM](https://youtu.be/tTcxVv8HHNw?t=0) | Scheduled processes (Ch. 14) |
| Contaminated shared context | One agent's bad write read by all | Shared state without controls | Permissions; versioning [LM](https://youtu.be/tTcxVv8HHNw?t=0) | Infrastructure (Ch. 11) |
| Agent-written pseudo-rules | "Lauren said never do this" comments | Local remark promoted to durable context | Banning the artefact; CI enforcement [LT](https://youtu.be/Cmoh-yR-usA) | Infrastructure (Ch. 11) |
| Malicious injection | Prompt-injected memory writes | Untrusted input treated as instruction | Permissions, provenance, review [LM](https://youtu.be/tTcxVv8HHNw?t=0) | Infrastructure and human review |

**What the sources support.** Mukta describes these failures as observed in production and gives no incident data. Tan's comment example is a first-hand observation with a stated frequency ("99% of the time") that is clearly informal.

**Running case: reconstruction.** Suppose a previous agent that worked on the sidebar left a note, in memory or in a comment, saying "the sidebar lag is caused by the file-tree component". If that was never true, or has since stopped being true, the next agent will start its investigation in the wrong place, and will do so confidently. *Nothing in Tan's talk says this happened with the sidebar. This is an illustration of the mechanisms both speakers describe.*

**The question this leaves.** So far the agent has only been *reading*. To do anything about a laggy sidebar it has to act: open files, run the application, measure, change code, and see what happened. How does that work, and how does the agent know whether its action succeeded?

## Part III — Action

> **The question for Part III:** knowing things is not the same as doing things. How does a coding agent turn a request into an executed change, and, crucially, how does it *see* what its change did?

The source for this part is Lauren Tan's account of how she works with coding agents at Cursor. It is supplemented by the public repository of her plugin, **pstack**, which documents the tools she describes. Two cautions apply throughout. First, the repository is current as of September 2026. The session took place on 12 August 2026, and some tools may have changed between the two dates. Second, Tan is describing her own tools and her own results; nothing here is an independent evaluation.

## Chapter 8. From request to checked change

**The question:** what are the steps between "the left sidebar is laggy" and a change that has actually been shown to fix it?

### 8.1 The failure that motivates everything: the human as the verifier

Tan starts with trust. When agents are "winging it … guessing, hallucinating … confidently stating that they found the smoking gun", yet again, you lose trust in them [LT V01 01:48](https://youtu.be/KwOX7vJyoOk?t=108) / [LT V02 01:20](https://youtu.be/7urwyHZwtEo?t=80). Without trust, you fall back on what she compares to micromanagement [LT V01 02:25](https://youtu.be/KwOX7vJyoOk?t=145) / [LT V02 01:58](https://youtu.be/7urwyHZwtEo?t=118).

Her first week on Cursor's agents window shows what this looks like. The team needed performance fixes before a launch. She opened Chrome's developer tools, recorded a trace, and stared at a flame graph of a codebase she barely knew [LT V01 08:13](https://youtu.be/KwOX7vJyoOk?t=493) / [LT V02 07:55](https://youtu.be/7urwyHZwtEo?t=475). Her agent was no better off. She sent it screenshots and downloaded traces, and it "would like confidently state like it's this thing", which then turned out not to be the problem [LT V01 08:35](https://youtu.be/KwOX7vJyoOk?t=515) / [LT V02 08:18](https://youtu.be/7urwyHZwtEo?t=498). She draws the general lesson:

Tan describes the human as the verification bottleneck when the agent cannot check its own work [LT V01 08:52](https://youtu.be/KwOX7vJyoOk?t=532) / [LT V02 08:35; paraphrase of machine transcripts](https://youtu.be/7urwyHZwtEo?t=515).

The loop in that situation runs through the human. The agent writes code. The human opens the build, sees it doesn't work, and copies "screenshots or console errors" back to the agent [LT V01 09:04](https://youtu.be/KwOX7vJyoOk?t=544) / [LT V02 08:48](https://youtu.be/7urwyHZwtEo?t=528). "So there's really no way to parallelize" [LT V01 09:22](https://youtu.be/KwOX7vJyoOk?t=562) / [LT V02 09:06](https://youtu.be/7urwyHZwtEo?t=546), because a second agent would need a second copy of the human.

### 8.2 Verification: letting the agent run the real thing

Tan's answer is the claim at the centre of her talk:

Tan gives verification priority: the agent should run the application through the interfaces users encounter and gather evidence such as CPU traces or heap snapshots. That gives it feedback on its changes [LT V01 06:03–06:40](https://youtu.be/KwOX7vJyoOk?t=363) / [LT V02 05:42–06:18; paraphrase of machine transcripts](https://youtu.be/7urwyHZwtEo?t=342).

She states its limit in the same breath:

Her distinction is between checking behaviour and judging code quality: execution-based verification helps with the former but does not establish the latter [LT V01 06:41](https://youtu.be/KwOX7vJyoOk?t=401) / [LT V02 06:21; paraphrase of machine transcripts](https://youtu.be/7urwyHZwtEo?t=381).

**The mechanism.** For Cursor's agents window, which is an Electron desktop app (internally called "Glass"), she built a "control glass" skill [LT V01 09:24](https://youtu.be/KwOX7vJyoOk?t=564) / [LT V02 09:08](https://youtu.be/7urwyHZwtEo?t=548). It teaches the agent to launch a development build and drive it through the **Chrome DevTools Protocol** (CDP) [LT V01 09:55](https://youtu.be/KwOX7vJyoOk?t=595) / [LT V02 09:40](https://youtu.be/7urwyHZwtEo?t=580). CDP is the interface that browser developer tools themselves use. Through it, a program can click elements, read the page structure, and start and stop performance recordings. For iOS apps, Apple's simulator utilities play the same role. She notes that "the code itself is not super interesting. Your agent can very easily make one for you" [LT V01 09:40](https://youtu.be/KwOX7vJyoOk?t=580) / [LT V02 09:24](https://youtu.be/7urwyHZwtEo?t=564). The value is in giving the agent eyes and hands on the real application.

The pstack repository makes the structure explicit. Its generator, `/create-verification-skill`, writes a project skill with five sections: **Launch, Doctor, Drive, Evidence, Cleanup**. It adds a feature map that indexes "what the app does and what result proves each feature works". Before handing the skill over, the generator "proves the skill once end to end", and "if that proof fails, don't use the output". The guide's first principle is blunt: "'It compiles' is not evidence." A reply that claims success "without evidence" is to be treated as "a red flag". The check must match the change [repo: pstack, docs/guide/06-verify-and-ship.md](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/06-verify-and-ship.md):

| Kind of change | What the agent must run |
|---|---|
| Command-line tool | The real command |
| User interface | Walk the changed flow in the running app |
| Parser or migration | Replay a saved input |
| Performance | Compare before and after profiles |
| Storage | Read back the written value |

### 8.3 Decomposition: investigate, delegate, keep units small

A request is rarely one step. Tan's practices, and the repository's playbooks, break the work down.

- **Make the agent look before it claims.** Tan noticed that her agent "wasn't actually reading the code that I thought should be affected" [LT V01 15:10](https://youtu.be/KwOX7vJyoOk?t=910) / [LT V02 15:02](https://youtu.be/7urwyHZwtEo?t=902). She wrote skills telling it to stop guessing and to use sub-agents to search [LT V01 16:54–16:59](https://youtu.be/KwOX7vJyoOk?t=1014) / [LT V02 16:50–16:55](https://youtu.be/7urwyHZwtEo?t=1010).
- **Route the task to a procedure.** pstack's `/poteto-mode` reads the request and chooses among **twenty-three playbooks**, including investigation, bug fix, perf, feature, refactoring, eval, babysit and shipping [repo: pstack README](https://github.com/cursor/plugins/blob/main/pstack/README.md).
- **Keep changes small and ordered.** Tan asks agents to split work into multiple PRs, because "the git history is a very rich source of context" and a small PR makes it easier "to revert changes". A bug shipped in a small PR is findable, "not in this 40,000 line PR" [LT V01 36:58–37:32](https://youtu.be/KwOX7vJyoOk?t=2218) / [LT V02 37:24–38:00](https://youtu.be/7urwyHZwtEo?t=2244). The repository's guide says the same: "Five narrow PRs beat one fat one."
- **Isolate parallel work.** Her host asks whether this happens in separate git worktrees with sub-agents and a reviewer agent [LT V01 23:39](https://youtu.be/KwOX7vJyoOk?t=1419) / [LT V02 23:45](https://youtu.be/7urwyHZwtEo?t=1425). Tan's answer is to start locally, where you can watch [§9.1].

### 8.4 The running case, step by step

This is the heart of the article's running case. I keep three layers of evidence visibly separate.

**What Tan documents.**
- Vague reports like "the left sidebar is like laggy" [LT V01 10:46](https://youtu.be/KwOX7vJyoOk?t=646) / [LT V02 10:32](https://youtu.be/7urwyHZwtEo?t=632).
- An agent that could drive the app but was "completely useless" at finding features until it had a feature map [LT V01 11:02](https://youtu.be/KwOX7vJyoOk?t=662) / [LT V02 10:48](https://youtu.be/7urwyHZwtEo?t=648).
- A control skill that takes traces.
- An agents window whose performance "regresses super often", largely because of "very poor … isolation between processes" [LT V01 40:18–40:24](https://youtu.be/KwOX7vJyoOk?t=2418) / [LT V02 40:50–40:56](https://youtu.be/7urwyHZwtEo?t=2450).

**What pstack documents.** The **perf playbook** [repo: pstack, skills/poteto-mode/playbooks/perf-issue.md](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/perf-issue.md):

1. "Capture a baseline trace via the matching control skill."
2. Ground hypotheses in the code before claiming anything; "don't read source instead of measuring".
3. Plan the fix from the trace, delegate the implementation to a sub-agent, review the diff, and "capture a post-fix trace".
4. "Parse and compare the artifacts … 'Inconclusive' or wrong-surface is not a pass."
5. "Cite the measurement in the PR."

The playbook lists eight "strategy families" to generate hypotheses. One is **scheduling**: "the work must happen, but not during the interactive moment. Move it to where nobody is waiting".

**My teaching reconstruction** (not a record of any real sidebar bug):

1. **Ground the words.** The agent looks up the sidebar in the feature map and finds how to open it and which DOM attributes select it.
2. **Launch and reproduce.** It starts a development build through the control skill and drives the sidebar the way a user would. It records a baseline performance trace while doing so.
3. **Read the trace.** It looks for **long tasks** on the renderer's main thread (§8.5). Suppose, hypothetically, it finds work the sidebar triggers that holds up rendering.
4. **Hypothesise and trace the cause in code.** Using the scheduling family as a lens, it asks whether that work could run somewhere other than the interactive moment.
5. **Change the code**, ideally via a sub-agent with a narrow scope.
6. **Re-measure.** It records a post-fix trace of the same interaction on the same build surface.
7. **Report with evidence**: baseline, post-fix, the difference, and where the artefacts are. If the comparison is inconclusive, it says so.

*I do not know, and do not claim, what any real trace showed, what the cause was, or whether the fix worked. The numbers the playbook asks for would come from the run. None are given here.*

### 8.5 Why this particular check needs execution: the frame budget

Tan explains why her team's app keeps regressing on performance. In an Electron app, the **renderer** draws the user interface, and other work can run in a separate **main** process. If heavy computation or I/O accidentally lands on the renderer, "all of a sudden you're competing with the renderer". At 60 frames per second, "every frame that gets drawn has to be done in 16 milliseconds" [LT V01 40:49–40:58](https://youtu.be/KwOX7vJyoOk?t=2449) / [LT V02 41:21–41:31](https://youtu.be/7urwyHZwtEo?t=2481). Otherwise "you start … losing frames… long tasks that take more than 16 milliseconds and you just get this really choppy experience" [LT V01 41:18](https://youtu.be/KwOX7vJyoOk?t=2478) / [LT V02 41:51](https://youtu.be/7urwyHZwtEo?t=2511).

#### Equation 13 — The frame budget

**Purpose.** To make "laggy" precise, and to show why it must be measured rather than inferred from reading code.

$$t_{\text{frame}} = \frac{1000\ \text{ms}}{f}$$

**Symbols.** f is the target frame rate in frames per second, and t_frame is the time available to produce each frame.

**Steps and intuition.** At f = 60, t_frame = 1000/60 ≈ 16.7 ms. Tan rounds this to 16 ms. Any piece of work that occupies the rendering thread for longer than this makes at least one frame miss its deadline, and the user sees a stutter.

**Worked example (arithmetic only).** A single uninterrupted task of 40 ms spans the budgets of about 40/16.7 ≈ 2.4 frames, so at least two frames will be late or dropped. Five 10 ms tasks spread across five separate frames might cause none.

**Assumptions and limits.** Real rendering pipelines have more stages (layout, paint, compositing), and displays may run at higher refresh rates, which shrinks the budget. The key point survives: whether a change causes jank depends on **when** work runs and **for how long**, which static reading of code cannot reliably determine. That is why the perf playbook insists on before-and-after traces.

**What the sources support.** Tan's account establishes that (a) she considers verification by execution the most important agent capability, (b) she built tools for it, and (c) a navigational context file was necessary for those tools to be useful. The repository establishes what those tools require and produce. **Neither establishes how often agent-produced fixes are correct, or how much time they save.**

**The question this leaves.** One agent that can check its own work is useful. What changes when there are many of them, running without anyone watching?

## Chapter 9. Scaling action: local, cloud, automation

**The question:** how does agent work scale beyond one person watching one agent, and what limits it?

### 9.1 From watching to delegating

Tan describes the progression as a **trust curve** she drew herself, "not a very scientific chart" [LT V01 02:39](https://youtu.be/KwOX7vJyoOk?t=159) / [LT V02 02:12](https://youtu.be/7urwyHZwtEo?t=132). On screen, it plots "trust" rising steeply and then flattening against the "number of agents". The horizontal axis is marked 1, 1 to 5, 5 to 10, 10 to 20, hundreds, thousands. Beside it is her list of answers to "how do I trust my [agents]": verification, high-quality skills, pstack, and refactoring or rewriting code to be agent-friendly [LT-full 04:30, video frame](https://youtu.be/Cmoh-yR-usA?t=270):

1. **Heavily in the loop.** A year earlier she was watching "every single output" from a handful of agents. You "can't … spawn 100 agents when you don't even trust the output of one agent" [LT V01 03:02–03:32](https://youtu.be/KwOX7vJyoOk?t=182) / [LT V02 02:51–03:07](https://youtu.be/7urwyHZwtEo?t=171).
2. **Local verification.** Her advice for anyone building a verification skill is to "definitely start local", so you can watch how the agent interacts with the application [LT V01 24:09](https://youtu.be/KwOX7vJyoOk?t=1449) / [LT V02 24:16](https://youtu.be/7urwyHZwtEo?t=1456).
3. **Cloud agents.** She is now "mostly all in on cloud agents" [LT V01 24:40](https://youtu.be/KwOX7vJyoOk?t=1480) / [LT V02 24:47](https://youtu.be/7urwyHZwtEo?t=1487). Verification skills that work in the cloud, she says, "levels up your whole team" [LT V01 25:02](https://youtu.be/KwOX7vJyoOk?t=1502) / [LT V02 25:10](https://youtu.be/7urwyHZwtEo?t=1510), not only one engineer.
4. **Automations.** An agent called **Benny** takes incoming bug reports, "opens up a cloud … desktop… runs Cursor in its own computer", and uses the same control skills to try to reproduce the bug [LT V01 25:24–25:43](https://youtu.be/KwOX7vJyoOk?t=1524) / [LT V02 25:32–25:52](https://youtu.be/7urwyHZwtEo?t=1532). In the example she shows, Benny reproduced a bug and found that it was "already fixed on main", so the only remaining step was a new release [LT V01 25:59](https://youtu.be/KwOX7vJyoOk?t=1559) / [LT V02 26:08](https://youtu.be/7urwyHZwtEo?t=1568). The screen shows a Slack thread in an on-call channel for the agents window. Benny's reply is headed "Reproduced but already fixed on main", with the note "reproduced on the prior commit, gone on the fix" [LT-full 27:50, video frame](https://youtu.be/Cmoh-yR-usA?t=1670). The user's original report, visible in the same thread, is about an "apps sidebar" that kept reopening blank when focus changed. *That is a behaviour bug in a sidebar, not a performance complaint. It is her real example of the automation working, and it is not the laggy-sidebar case this article reconstructs.*

The repository's Benny automation shows how cautiously this is designed [repo: pstack, automations/benny/skills/reproduce-and-fix-issues/SKILL.md](https://github.com/cursor/plugins/blob/main/pstack/automations/benny/skills/reproduce-and-fix-issues/SKILL.md). It opens "a bounded draft pull request only after before-and-after proof":

- "The exact discriminating symptom must appear twice through real UI interaction."
- "No confirmed repro means no authored fix."
- If an existing PR or commit is found, the run switches to verifying it.
- Delegated analysis workers are **read-only**. Only a coordinator may post to Slack.
- A code-writing worker may edit only if its environment "provably excludes Slack credentials".

These are **permissions enforced by the harness**, not requests to the model. Chapter 11 returns to exactly this distinction.

### 9.2 What scale costs

Tan is direct that the curve cannot be skipped. "You have to trust it first" [LT V01 26:34](https://youtu.be/KwOX7vJyoOk?t=1594) / [LT V02 26:44](https://youtu.be/7urwyHZwtEo?t=1604). Jumping straight to thousands of cloud agents means "you're just going to waste a lot of tokens" [LT V01 26:56](https://youtu.be/KwOX7vJyoOk?t=1616) / [LT V02 27:07](https://youtu.be/7urwyHZwtEo?t=1627).

Asked whether her approach is realistic on an ordinary token budget, Tan cautions that others should not necessarily follow her setup in exactly the same way [LT-full 51:11–51:44; machine transcripts](https://youtu.be/Cmoh-yR-usA?t=3071). This supports a limit on generalisation, not a quantified claim about her token allowance. The disputed wording about that allowance is omitted because the caption tracks and Whisper disagree and it has not been checked by listening.

She frames the upfront spend as a return-on-investment question: tokens spent building verification and constraints, weighed against hiring. Her view is that the answer will usually be positive [LT V01 48:29–50:27](https://youtu.be/KwOX7vJyoOk?t=2909) / [LT V02 49:14–51:11](https://youtu.be/7urwyHZwtEo?t=2954). She offers no figures. The host, for comparison, describes his own practice as "two to three [agents] locally", and guesses most of the audience is the same [LT V01 47:25](https://youtu.be/KwOX7vJyoOk?t=2845) / [LT V02 48:08](https://youtu.be/7urwyHZwtEo?t=2888).

### 9.3 Throughput claims, and what they are not

This is also where Tan's headline numbers belong. To explain her journey she shows a chart of her contributions: a profile header reading "poteto · 3,159 commits", monthly contributions rising steeply through 2026, and the handwritten caption "i shipped 3000+ PRs in 5 months" [LT-full 06:50, video frame](https://youtu.be/Cmoh-yR-usA?t=410). These are figures shown in her presentation, not an independently audited count of completed or useful work.

She immediately anticipates the objection: "I'm sure a lot of you will definitely be questioning … how much of this code is actually good" [LT V01 05:24](https://youtu.be/KwOX7vJyoOk?t=324) / [LT V02 05:02](https://youtu.be/7urwyHZwtEo?t=302). That is the right question, and the talk does not answer it with data. PR counts measure **activity**, not value. They also depend on how work is split, and Tan deliberately splits work into small PRs (§8.3). The auto-merge arrangement is her own configuration. The public pstack guide, by contrast, says its PR-driving playbook "stops at merge-ready. It never merges… because merging is a different decision" [repo: pstack guide](https://github.com/cursor/plugins/blob/main/pstack/README.md). Chapter 12 returns to that difference.

| Mode | What the human sees | Parallelism | Main cost | Main risk |
|---|---|---|---|---|
| Local, watched | Every step | 1–3 agents | Human attention | Human becomes the bottleneck |
| Local, verified | Evidence at the end | Several | Tokens + setup | Verification skill wrong or stale |
| Cloud agents | Reports and PRs | Many | Tokens, infrastructure | Unobserved failure modes |
| Automations (e.g., Benny) | Draft PRs with proof | Continuous | Tokens, permissions design | Acting on bad triggers; overreach |

**What the sources support.** Tan's account documents a progression she followed and the tools she used. The repository documents safeguards. Nothing documents error rates, costs or time saved at any stage.

**Running case: reconstruction.** In the watched mode, the sidebar report waits for an engineer to reproduce it. In the automated mode it might be picked up by a Benny-like process, reproduced twice through the UI, compared against the main branch, and turned into a draft PR with before-and-after traces. Or it might be rejected because the symptom did not reproduce. *Tan's shown Benny example (§9.1) involved a sidebar behaviour bug, not a lag report. Nothing she presents describes a performance report going through this path.*

**The question this leaves.** At this scale no one reads every change. Something has to decide whether the agent's work is acceptable. What kinds of checks exist, what does each actually establish, and which of them can be left to the agent's own judgement?

## Part IV — Trust

> **The question for Part IV:** once agents act at a scale no one can watch, who or what decides whether their work is acceptable? Which rules can be left to the agent to interpret, and which must be guaranteed by machinery the agent cannot bypass?

This part draws on both practitioners. Tan describes how she enforces standards on agent-written code. Mukta describes the guardrails Anthropic puts around agent-written memory. Their domains differ, but the structure of their answers is strikingly similar. That similarity is **my observation**, not a claim either of them makes.

## Chapter 10. Who verifies? A taxonomy of checks

**The question:** what different kinds of checking exist, and what can each one actually establish?

Chapter 8 introduced one kind of check, running the real application. It is not the only kind, and it cannot catch everything. The distinctions below are **my framework**. Every example comes from the sources.

| Check | What it looks at | Examples in the sources | What it can catch | What it misses | Deterministic? |
|---|---|---|---|---|---|
| **Syntactic and static** | The code's form, without running it | Compiler errors; type checks; lint rules; import-graph rules [LT](https://youtu.be/Cmoh-yR-usA) | Malformed code; banned constructs; forbidden dependencies | Wrong behaviour in well-formed code | Yes |
| **Tests** | Behaviour on specified inputs | Unit and integration tests; pstack's "failing repro first" | Regressions on behaviour someone specified | Behaviour nobody specified; wrong tests | Yes, given the tests |
| **Execution against the real system** | The running product, as a user experiences it | CDP-driven UI walks, performance traces, simulators [LT; pstack](https://youtu.be/Cmoh-yR-usA) | User-visible behaviour; performance; integration faults | Paths nobody exercised; design quality | The evidence is; its *interpretation* may be an agent's |
| **Architectural constraints** | Structure across the codebase | "Dune" conventions; banned APIs; process-separation rules [LT](https://youtu.be/Cmoh-yR-usA) | Structural drift; whole classes of bugs | New kinds of failure nobody encoded | Yes, once encoded |
| **Human judgement** | Value, taste, fit | Review; product sense; "stamp" [LT](https://youtu.be/Cmoh-yR-usA) | Whether the change is *good* and *wanted* | Scale; fatigue; inconsistency | No |

Two observations follow.

**First, the rows answer different questions.** Execution against the real system is how an agent learns that its code is **correct** in Tan's sense. It "doesn't guarantee your agent writes good code" [LT V01 06:41](https://youtu.be/KwOX7vJyoOk?t=401) / [LT V02 06:21](https://youtu.be/7urwyHZwtEo?t=381). "Good" (maintainable, consistent, well-structured) is a matter for architectural constraints and human judgement.

**Second, only some rows are deterministic.** A compiler gives the same answer every time. A lint rule either fires or does not. A human reviewer, or an agent reading a trace, may judge the same evidence differently on different days. This distinction becomes the centre of Chapter 11.

#### Equation 14 — Why layered checks help, and why the arithmetic flatters them

**Purpose.** To show why practitioners stack several imperfect checks rather than seeking one perfect check, and to show the assumption that makes simple arithmetic over-optimistic.

$$P(\text{escape}) = \prod_{i=1}^{m} (1 - c_i)$$

(This form holds only if the checks are independent.)

**Symbols.** m is the number of checks, and c_i is the probability that check i catches a given defect.

**Steps.** A defect escapes only if every check misses it. If the misses were independent events, the probability of missing everything would be the product of the individual miss probabilities.

**Worked example (hypothetical rates, chosen for arithmetic only; not measured by anyone).** Four checks that each catch 50%, 60%, 70% and 50% of some class of defects would, if independent, let through 0.5 × 0.4 × 0.3 × 0.5 = 0.03, or 3%. No single check comes close to that.

**Assumptions and limits.** Independence is almost always false. Checks share blind spots. A test suite and a reviewer written by the same people tend to miss the same unanticipated behaviour. When checks are positively correlated, the true escape rate is **higher** than the product, sometimes much higher. The formula explains why layering is attractive, and also why checks of genuinely **different kinds** (static, execution, human) are worth more than several checks of the same kind. It says nothing about the actual catch rates of any real system. The sources provide none.

**Running case.** For the sidebar, the rows would contribute:
- **Static checks** would reject code that violates the project's rules.
- **Tests** would protect behaviour someone specified.
- **Execution** would show whether the interaction still produces long tasks.
- **Architectural constraints** could reject a fix that moves heavy work into the renderer.
- **A human** would decide whether the fix is the right one.

*This division is my reconstruction.*

**The question this leaves.** If some checks are deterministic and some are judgement calls, where should each rule live? In instructions the agent reads and interprets, or in machinery it cannot get around?

## Chapter 11. Instructions versus infrastructure

**The question:** which rules can safely be left to an agent's interpretation, and which must be guaranteed by deterministic mechanisms?

### 11.1 Tan's layers of enforcement

Tan describes "multiple layers … for building a good codebase" [LT V01 42:14](https://youtu.be/KwOX7vJyoOk?t=2534) / [LT V02 42:48](https://youtu.be/7urwyHZwtEo?t=2568). Her screen lists five layers in this order [LT-full 48:20, video frame](https://youtu.be/Cmoh-yR-usA?t=2900). The enforcement ranking below follows her machine-transcribed commentary; the frame itself establishes the names and ordering:

<!-- visual:enforcement-ladder -->

The five items, in her words: "codebase"; "static analysis (lint/compiler/ci)"; "rules/bugbot"; "skills"; and "style guide", in quotation marks on the slide.

Her spoken commentary explains each rung.

- **The codebase.** An architecture that is "extremely strict" about how features are built is "the strongest … level of enforcement, because agents just love to copy existing patterns" [LT V01 42:29–42:31](https://youtu.be/KwOX7vJyoOk?t=2549) / [LT V02 43:05–43:07](https://youtu.be/7urwyHZwtEo?t=2585). In her team's newer app, a feature lives entirely in one directory, so an agent working on it "just looks at the feature" [LT V01 42:56](https://youtu.be/KwOX7vJyoOk?t=2576) / [LT V02 43:32](https://youtu.be/7urwyHZwtEo?t=2612).
- **Static analysis.** "CI checks", "a lot of lints for bad patterns that we observe", and "compiler diagnostics" [LT V01 44:35–44:39](https://youtu.be/KwOX7vJyoOk?t=2675) / [LT V02 45:14–45:18](https://youtu.be/7urwyHZwtEo?t=2714).
- **Rules and Bugbot, skills, style guides.** Bugbot is Cursor's automated code-review tool, which runs in CI [LT V01 41:57](https://youtu.be/KwOX7vJyoOk?t=2517) / [LT V02 42:31](https://youtu.be/7urwyHZwtEo?t=2551). These are the soft layers.

In the machine transcripts, Tan contrasts the first two layers with the last three: mechanically enforced constraints can fail CI, whereas agents may fail to apply rules, skills, or review guidance consistently. This is her rationale for combining layers, not a claim that every codebase structure automatically creates a CI check [LT V01 44:42–45:23](https://youtu.be/KwOX7vJyoOk?t=2682) / [LT V02 45:20–46:03; paraphrase, not listening-verified](https://youtu.be/7urwyHZwtEo?t=2720).

**The design contract behind it.** Just before the layers, Tan scrolls through a document titled "Agent-friendly architecture", which describes the Dune framework. Its "Contract" section is the most direct written statement in any of the sources of *why* soft instructions fail with agents [LT-full 45:20 and 48:20, video frames](https://youtu.be/Cmoh-yR-usA?t=2720). The following text is from the document she screen-shares, not a transcription of her speech; its separate authorship is not established:

> "A coding agent usually optimizes for what fits in its context:
> - copy the nearest working pattern;
> - edit the file already open;
> - choose the shortest path that compiles;
> - avoid deleting code whose callers are not visible;
> - follow the requested implementation even when it conflicts with a system invariant.
>
> These behaviors are predictable inputs to the framework design."

The document then lists five rules:

1. "The conventional path requires fewer decisions than a shortcut."
2. "Forbidden dependencies fail mechanically."
3. "Every durable value has one obvious writer."
4. "New product work adds isolated files rather than branches in shared roots."
5. "Exceptions are narrow, explicit, and reviewed as architecture changes."

Read against Part II, this is a remarkable statement. It treats the agent's dependence on **what fits in its context** (Chapter 6) as a design input, and answers it with mechanisms rather than instructions. Rule 2 is the renderer/main import check in one sentence.

**Concrete hard rules.** In the architecture her team built for its newer app, code-named **Dune**, "the CI looks pretty annoying because there's checks for everything" [LT V01 38:01–38:11](https://youtu.be/KwOX7vJyoOk?t=2281) / [LT V02 38:30–38:40](https://youtu.be/7urwyHZwtEo?t=2310). Examples:

- **`useEffect` is banned.** It is a React hook she calls one of React's "biggest foot guns" [LT V01 38:26](https://youtu.be/KwOX7vJyoOk?t=2306) / [LT V02 38:55](https://youtu.be/7urwyHZwtEo?t=2335).
- **Code comments are banned**, for the reason given in Chapter 7 [LT V01 38:57](https://youtu.be/KwOX7vJyoOk?t=2337) / [LT V02 39:27](https://youtu.be/7urwyHZwtEo?t=2367).
- **Import-graph checks.** The code is split into `electron-main` and `electron-renderer` directories, and "import … checks" examine "the dependency graph to make sure you're not accidentally importing code from one directory to another". This targets exactly the renderer-blocking mistake of Chapter 8, and "it becomes like a hard failure" [LT V01 41:34–41:47](https://youtu.be/KwOX7vJyoOk?t=2494) / [LT V02 42:08–42:21](https://youtu.be/7urwyHZwtEo?t=2528).

*Note the boundary: Tan says the agents window, where her performance problems occurred, "doesn't have this architecture yet"* [LT V01 40:10](https://youtu.be/KwOX7vJyoOk?t=2410) / [LT V02 40:41](https://youtu.be/7urwyHZwtEo?t=2441)*. The import-graph rule is from the other app.*

**A design principle.** "The shortest path is the best path" [LT V01 43:36](https://youtu.be/KwOX7vJyoOk?t=2616) / [LT V02 44:13](https://youtu.be/7urwyHZwtEo?t=2653). Agents "take shortcuts… they'll find the quickest way to solve the problem. So why not make that the best way?" The framework is designed so that even "the dumbest agent" does not have to think [LT V01 43:28](https://youtu.be/KwOX7vJyoOk?t=2608) / [LT V02 44:04](https://youtu.be/7urwyHZwtEo?t=2644).

**A promotion rule.** The part of her talk with the most general application is a rule for turning judgement into infrastructure:

Tan recommends converting recurring review comments into lint rules or CI failures, or changing the architecture so the mistake is harder to make [LT V01 46:30–46:59](https://youtu.be/KwOX7vJyoOk?t=2790) / [LT V02 47:11–47:42; paraphrase of machine transcripts](https://youtu.be/7urwyHZwtEo?t=2831).

Her public plugin writes the same rule down as a principle, "Encode Lessons in Structure", which "turns advice you've repeated twice into a lint, check, or script" [repo: pstack, docs/guide/08-principles.md](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/08-principles.md).

She offers Rust as an example of hard enforcement by a compiler: if agents avoid `unsafe` blocks, "you can more or less feel somewhat confident that if the code compiles, it probably works" [LT V01 45:53–46:03](https://youtu.be/KwOX7vJyoOk?t=2753) / [LT V02 46:34–46:44](https://youtu.be/7urwyHZwtEo?t=2794). That is a strong generalisation. A compiler guarantees memory safety and type-correctness, not that the program does what the user wanted. Her own hedges ("more or less", "somewhat", "probably") are worth keeping.

### 11.2 Mukta's guardrails for memory

Mukta arrives at the same structure from a different direction. Having argued that agents should manage their own memory freely (Chapter 6), she lists the principles Anthropic uses so that "these nice autonomous memory systems actually work in production" [LM 10:18](https://youtu.be/tTcxVv8HHNw?t=618):

1. **Versioning.** "The very first thing is versioning" [LM 10:42](https://youtu.be/tTcxVv8HHNw?t=642). Every change to memory is stored as a version, so a bad update can be rolled back. It also records **provenance**: "which agent session? Which transcript resulted in me wanting to make this update?", and who made the change, human or agent [LM 11:02](https://youtu.be/tTcxVv8HHNw?t=662).
2. **Concurrency.** "The second thing is concurrency" [LM 11:17](https://youtu.be/tTcxVv8HHNw?t=677). When thousands of agents may write to the same memory, an agent "takes a hash", drafts its edit, and takes another hash before writing. "If those two things do not match, then the agent cannot write it, because it means that some update was made in the meantime" [LM 11:34–11:43](https://youtu.be/tTcxVv8HHNw?t=694). It then re-reads the memory, redrafts, and tries again [LM 11:50; wording of the caption unclear](https://youtu.be/tTcxVv8HHNw?t=710).
3. **Permissions.** "Permissions is really important" [LM 12:11](https://youtu.be/tTcxVv8HHNw?t=731). Memory ranges from carefully curated organisation-wide principles down to an agent's own scratchpad. You "might want that as read only", while "for its own scratchpad, you would want it to have write access" [LM 12:55](https://youtu.be/tTcxVv8HHNw?t=775).
4. **Portability.** Carefully curated memory should be reachable "across … multiple product surfaces" through "a clean API in which it's portable" [LM 13:10–13:45](https://youtu.be/tTcxVv8HHNw?t=790).

Together these are "production level guardrails" [LM 13:58](https://youtu.be/tTcxVv8HHNw?t=838). Her summary later in the talk: for long-running, many-agent systems, add features "that allow those agents to manage their memory in a way that is safe, verifiable, auditable" [LM 26:01](https://youtu.be/tTcxVv8HHNw?t=1561).

#### Algorithm box — Optimistic concurrency, step by step

**Purpose.** To show how the hashing scheme Mukta describes prevents two agents from silently overwriting each other.

```
read memory file  →  contents C, fingerprint h = hash(C)
draft an edit     →  new contents C′
before writing:   →  h_now = hash(current contents)
if h_now == h:    →  write C′ (nobody changed it meanwhile)
else:             →  discard C′, re-read, redraft, retry
```

**Terms.**
- A **hash** is a short fingerprint computed from a file's contents. Any change to the contents changes the fingerprint.
- This pattern, check that nothing changed and only then write, is known in databases as **optimistic concurrency control**, or compare-and-swap.

**Worked example.**
1. Agents A and B both read version 7 of a memory file, fingerprint h₇.
2. A finishes first. The file still has fingerprint h₇, so A writes version 8.
3. B finishes. It checks and finds fingerprint h₈ ≠ h₇, so it refuses to write.
4. B re-reads version 8 and redrafts its edit on top of A's change.

Without the check, B would have silently erased A's update.

**Assumptions and limits.** Under heavy contention, agents may retry repeatedly. The scheme guarantees that no update is silently lost. It says **nothing** about whether the content of an update is correct. That is what permissions, provenance and review are for.

**An example permission matrix [my illustration, following Mukta's description].**

| Memory tier | Agents may | Humans may | Why |
|---|---|---|---|
| Organisation-wide principles | Read | Edit | One bad write would affect every agent |
| Team or project conventions | Read; propose changes | Approve changes | Shared, but closer to the work |
| An agent's own scratchpad | Read and write | Inspect | Private working memory |

### 11.3 The move they share: decide versus guarantee

At the end of her talk, an audience member asked whether all the versioning and concurrency control amounts to "reinventing databases from first principles" [LM 30:24](https://youtu.be/tTcxVv8HHNw?t=1824). Mukta's answer is, I think, the most important sentence in either practitioner's talk:

Mukta describes the design problem as deciding which choices agents should make autonomously and which operations the harness should implement programmatically [LM 30:47–30:52; paraphrase of published captions](https://youtu.be/tTcxVv8HHNw?t=1847).

At first, agents simply wrote Markdown files and committed "whatever they wanted". Now, having seen which primitives work, "we have enough signal now to know that those things should just be done in a very deterministic way, and there's no need to reinvent the wheel" [LM 31:34](https://youtu.be/tTcxVv8HHNw?t=1894).

Put Tan's promotion rule next to Mukta's boundary and the common structure appears **[my synthesis]**:

| | What the agent may **decide** | What the system must **guarantee** |
|---|---|---|
| Tan (code) | How to implement a feature within the conventions; what to investigate; how to fix a bug | No `useEffect`; no comments; no cross-process imports; CI must pass |
| Mukta (memory) | What to remember, when to read, how to organise notes | Versions and provenance; no lost concurrent writes; who may write where |
| Benny (automation) | How to analyse a bug report | Read-only workers; only the coordinator may post; no fix without a confirmed repro [repo](https://github.com/cursor/plugins/blob/main/pstack/README.md) |
| pstack skills (docs) | Instructions that guide the agent's approach | Bundled **scripts** that run deterministically, with only their output entering the model's context [docs: Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) |

**Why agents move the boundary [my inference, drawing on Tan].** None of the mechanisms in the right-hand column is new. CI, lint rules, compare-and-swap and access control are decades old. What agents change is where it makes sense to draw the line, and they change it in two directions at once.

1. **The adversary has changed.** Among humans, many rules were enforced socially, through review comments, habit and reputation. Agents take the shortest path and copy whatever patterns exist (§11.1). They can also turn a remark into a pseudo-rule (Chapter 7). Rules that once held because people remembered them now need a mechanism.
2. **Hardening has become cheap.** Tan: "the thing I couldn't do before is like enforce this level of constraints in a codebase by myself… it would have taken me years to build this framework … and do all the refactoring" [LT V01 49:33–49:40](https://youtu.be/KwOX7vJyoOk?t=2973) / [LT V02 50:19–50:27](https://youtu.be/7urwyHZwtEo?t=3019). Her refactor of one app onto the strict architecture took "over 600 PRs", largely agent-written [LT V01 34:12](https://youtu.be/KwOX7vJyoOk?t=2052) / [LT V02 34:34](https://youtu.be/7urwyHZwtEo?t=2074). Meanwhile "agents absorb all of that annoyance" of strict CI [LT V01 35:15](https://youtu.be/KwOX7vJyoOk?t=2115) / [LT V02 35:39](https://youtu.be/7urwyHZwtEo?t=2139).

She also connects this to big-tech practice. Large companies already build frameworks, conventions and guardrails aimed at "the least capable engineer on your team", and restrict credentials "so that … your intern doesn't wipe your production database" [LT V01 31:26–31:36](https://youtu.be/KwOX7vJyoOk?t=1886) / [LT V02 31:44–31:54](https://youtu.be/7urwyHZwtEo?t=1904). Codebases that already have such guardrails give agents a head start.

**What the sources support.** Two practitioners, in different domains, describe moving rules from interpretation to mechanism once the rules are known to matter. Neither provides evidence that doing so improves outcomes compared with alternatives. The convergence is my reading of their talks.

**Running case: reconstruction.** Suppose the agent's first fix for the sidebar moves some computation, but accidentally imports a heavy module into the renderer.

- In a codebase with only a **style guide** saying "keep heavy work out of the renderer", this might slip through if the agent forgets the guide, or if a reviewer misses the import.
- In a codebase with Dune's **import-graph check**, CI fails and the agent must restructure.

The rule "renderer code must not import main-process modules" has been **promoted** from something the agent should remember to something the system guarantees. *Tan describes such a check in her other app, not in the agents window.*

**The question this leaves.** If so much depends on the enforcement machinery, and on the skills and evals that remain soft, who checks that *those* work?

## Chapter 12. Checking the checkers

**The question:** how do practitioners test the tools that test the agent, and where does human judgement remain?

### 12.1 Evals: unit tests for agent behaviour

Tan's host asks two questions: how are skills maintained as the product changes, and how do you know your verification is good enough? [LT V01 17:13](https://youtu.be/KwOX7vJyoOk?t=1033) / [LT V02 17:09](https://youtu.be/7urwyHZwtEo?t=1029). Her answer to both is **evals**, "like a unit test for an agent" [LT V01 17:56](https://youtu.be/KwOX7vJyoOk?t=1076) / [LT V02 17:53](https://youtu.be/7urwyHZwtEo?t=1073). Her procedure, which the pstack eval playbook records in detail, is as follows.

- **Blind the candidates.** A coordinating agent writes a rubric and spawns sub-agents in directories "cleverly named to not let the sub agent know that it's being evaluated". The reason: "agents can actually tell, and when they do they change their behavior" [LT V01 19:16–19:22](https://youtu.be/KwOX7vJyoOk?t=1156) / [LT V02 19:15–19:21](https://youtu.be/7urwyHZwtEo?t=1155). The playbook forbids words like "eval", "test", "judge", "rubric" and "benchmark" anywhere a candidate can see, and requires the prompt to look like "an organic user request" [repo: pstack, skills/poteto-mode/playbooks/eval.md](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/eval.md).
- **Vary the model.** Cursor supports many models, so a skill can be evaluated "across all sorts of different models" [LT V01 19:42](https://youtu.be/KwOX7vJyoOk?t=1182) / [LT V02 19:42](https://youtu.be/7urwyHZwtEo?t=1182).
- **Judge with a different model.** A judge agent "of a different model" cross-checks the scores so the first model "is not being biased" [LT V01 21:40](https://youtu.be/KwOX7vJyoOk?t=1300) / [LT V02 21:43](https://youtu.be/7urwyHZwtEo?t=1303). The playbook specifies "one blinded judge on a different model family" that sees outputs only by sanitised label [repo](https://github.com/cursor/plugins/blob/main/pstack/README.md).
- **Grade what happened, not what was claimed.** The playbook requires verifying "the chain from transcripts, not self-report": which files each candidate actually opened. The author must also "read every candidate output yourself" and treat disagreement with the judge as a sign of bias or an ambiguous rubric [repo](https://github.com/cursor/plugins/blob/main/pstack/README.md).
- **Hill-climb.** Loop on an eval "until everything is 10 out of 10" [LT V01 21:59–22:03](https://youtu.be/KwOX7vJyoOk?t=1319) / [LT V02 22:02–22:07](https://youtu.be/7urwyHZwtEo?t=1322).

Tan's claim that agents detect evaluations has independent support. In a 2025 study, Needham et al. found that frontier models "clearly demonstrate above-random evaluation awareness" in distinguishing evaluation transcripts from real use. The best model reached an AUC of 0.83 against a human baseline of 0.92, and models did better in agentic settings (*Large Language Models Often Know When They Are Being Evaluated*). The study does not show that the effect changes coding behaviour in the way Tan describes, but it makes her precaution reasonable.

**A caution [my addition].** Hill-climbing an eval "until everything is 10 out of 10" risks optimising the rubric instead of the behaviour: the familiar problem that a measure pursued as a target stops measuring what it was meant to. The playbook's insistence on reading every output and cross-checking the judge is a partial safeguard.

### 12.2 Maintaining verification itself

Verification skills go stale as the product changes. pstack's `/maintain-verification-skill` audits them: "one read-only source reader per feature in parallel, then one live pass that drives every mapped feature". It ends in one of three outcomes:

- **clean**;
- **changed**: a PR of corrections confined to the skill's own directory;
- **blocked**.

"It never edits product code. If the live pass catches a product regression, it reports the regression instead of papering over it in docs" [repo: pstack guide](https://github.com/cursor/plugins/blob/main/pstack/README.md). The checker is itself subject to a hard rule about what it may modify.

### 12.3 Merging is a separate decision

Tan's own setup auto-merges agent PRs, and she reviews them "on main" afterwards [LT V01 03:57–04:07](https://youtu.be/KwOX7vJyoOk?t=237) / [LT V02 03:32–03:42](https://youtu.be/7urwyHZwtEo?t=212). The public tooling separates the two steps more strictly [repo: pstack guide](https://github.com/cursor/plugins/blob/main/pstack/README.md):

- Its **Babysit** playbook drives a PR through conflicts, review threads and CI, but "stops at merge-ready. It never merges, even with everything green, because merging is a different decision."
- Its **Shipping** playbook verifies each PR "independently before it arms anything". "The agent that judges a change is never the one that wrote it." It lands only "the contiguous verified run from the bottom" of a stack of PRs.

Both descriptions can be true at once. The public defaults are conservative, and a user can configure more automation. An article should not imply that the tool auto-merges by default.

### 12.4 Where human judgement remains

Tan is clear that none of this removes judgement. It moves it.

- Building and maintaining skills "requires … a lot of taste and observation. So you kind of need to be very good at being a backseat driver" [LT V01 20:15–20:22](https://youtu.be/KwOX7vJyoOk?t=1215) / [LT V02 20:15–20:23](https://youtu.be/7urwyHZwtEo?t=1215): reading tool calls and "thinking blocks" to see where agents fail [LT V01 21:00](https://youtu.be/KwOX7vJyoOk?t=1260) / [LT V02 21:02](https://youtu.be/7urwyHZwtEo?t=1262).
- Her image for the new role is a head chef who no longer cooks everything but whose "job [is] to really design the environment" [LT V01 23:03](https://youtu.be/KwOX7vJyoOk?t=1383) / [LT V02 23:09](https://youtu.be/7urwyHZwtEo?t=1389).
- When product managers now ship fixes, she still reviews them, even if the review ends in "okay, stamp" [LT V01 54:24](https://youtu.be/KwOX7vJyoOk?t=3264) / [LT V02 55:17](https://youtu.be/7urwyHZwtEo?t=3317). She credits the strict architecture with letting "people who are not experts in engineering … contribute at a high level" [LT V01 54:34](https://youtu.be/KwOX7vJyoOk?t=3274) / [LT V02 55:28](https://youtu.be/7urwyHZwtEo?t=3328).

Mukta's design keeps a person at the point where memory changes. In her description of dreaming, "you as the individual can decide where you want to accept changes to the memory, where you want to reject them" [LM 23:37](https://youtu.be/tTcxVv8HHNw?t=1417). (The public documentation describes this slightly differently; see Chapter 14.)

**What the sources support.** The eval procedure is documented in public tooling. Its effectiveness is not measured in the sources. Evaluation awareness is independently documented as a real phenomenon.

**Running case: reconstruction.** Suppose the team's verification skill for the agents window has not been updated since the sidebar was redesigned. The feature map might then point to elements that no longer exist. A maintenance pass would find this, drive the sidebar live, and either correct the map or report a regression. It would not "fix" the product silently. Separately, any skill that tells agents how to investigate performance problems could be evaluated blind, across models, with a judge from a different model family. *This is an application of the documented procedures, not a report of their use on this case.*

**The question this leaves.** Every check in Part IV produces a stream of failures and corrections. Something ought to *learn* from them. But "learning" hides several very different processes, and running them together is one of the most common mistakes in discussions of AI and productivity.

## Part V — Learning and Feedback

> **The question for Part V:** failures and corrections are only valuable if something improves because of them. But what improves, how, and on what timescale? This part separates three processes that are all casually called "learning" or "feedback": a model being trained, an agent system that remembers and adjusts, and a founder learning from users. They are different loops. The rest of the article depends on not mixing them up.

## Chapter 13. Loop 1: training a model

**The question:** what does "learning" mean for the model itself, and who controls it?

### 13.1 What changes

When a model is trained, its **parameters**, the billions of numbers in its weight matrices, are adjusted to reduce the loss from Equation 2. This is the only process in this article that changes the model itself.

#### Equation 15 — One step of gradient descent with weight decay

**Purpose.** To show concretely what one update of a model's parameters does, and where a surprising finding about weight decay fits.

$$\theta \leftarrow \theta - \eta\,\big(\hat g + \lambda\,\theta\big)$$

**Symbols.**
- θ stands for the model's parameters.
- ĝ is the gradient of the loss with respect to θ, estimated from a batch of training text. It points in the direction that would increase the loss fastest.
- η is the learning rate, i.e. the step size.
- λ is the weight-decay coefficient.

**Steps.**
1. Estimate how the loss would change if each parameter moved slightly (ĝ).
2. Move every parameter a small step against that direction.
3. At the same time, shrink every parameter slightly toward zero (the λθ term).

**Worked example (single number).** Take θ = 2, ĝ = 0.5, η = 0.1 and λ = 0.1. The update is θ ← 2 − 0.1 × (0.5 + 0.1 × 2) = 2 − 0.07 = **1.93**. Without weight decay it would be 1.95. The extra 0.02 is the shrinkage.

**Intuition, and the lecture's twist.** Classical machine learning uses weight decay (and dropout) as a **regulariser**, a way to stop a model from memorising its training data. Large language models, however, are usually trained in a *single pass* over more text than they will ever revisit: "There is more internet data than there is flops" [TH 1:00:00](https://youtu.be/lVynu4bo1rY?t=3600). So "overfitting is not really a problem, almost ever" [TH 1:00:19](https://youtu.be/lVynu4bo1rY?t=3619). Why, then, does weight decay remain common? Hashimoto presents evidence that in this regime weight decay "is actually not a regularizer, sometimes" [TH 1:01:39](https://youtu.be/lVynu4bo1rY?t=3699). It acts instead as an **optimisation** aid. Combined with a learning rate that decays over training, runs with stronger weight decay start slower but "end up converging" to a better loss [TH 1:02:19–1:02:24](https://youtu.be/lVynu4bo1rY?t=3739). It is "an optimization intervention and not necessarily a regularization intervention" [TH 1:03:05](https://youtu.be/lVynu4bo1rY?t=3785). In practice, labs tune weight decay "in concert with learning rate" [TH 1:24:26](https://youtu.be/lVynu4bo1rY?t=5066).

**Assumptions and limits.** This is plain gradient descent, written for clarity. Real training uses adaptive optimisers from the Adam family, in which the weight-decay term is applied separately from the adaptive gradient step. The structure of "step against the gradient, and shrink" is the same.

### 13.2 The loop's properties

- **What updates:** the model's weights.
- **Signal:** prediction error on training data (later stages may add other objectives; the lecture does not cover them).
- **Timescale:** a large run takes weeks to months. A run that diverges can waste "millions of dollars" [TH 1:05:49](https://youtu.be/lVynu4bo1rY?t=3949), which is why Chapter 2's stability work matters.
- **Who controls it:** the lab that trains the model.
- **What it does *not* do:** it does not happen while you use the model. A deployed model's weights are fixed. Nothing an agent does in your codebase today changes them.

**Running case.** Whatever the agent learns while fixing the sidebar, the model underneath it is exactly the same model tomorrow.

**The question this leaves.** If the weights are frozen at deployment, how can an agent "do it better the second time", as Mukta claims?

## Chapter 14. Loop 2: an agent system that remembers and improves

**The question:** how does an agent *system* improve between tasks without changing the model, and what are the options for doing it?

### 14.1 Changing what the model is given, not what it is

The answer is that the system changes the **context** the frozen model receives (Part II) and the **harness** around it (Parts III–IV):

- memories the agent reads next time;
- skills that describe better procedures;
- rules and CI checks that block known mistakes.

Mukta reports that with well-designed memory, "the second time the agent does the task, it actually does it better", and that agents "can … more easily one shot" tasks, spending fewer tokens [LM 14:23–14:43](https://youtu.be/tTcxVv8HHNw?t=863). As in Chapter 5, these are claims without figures.

### 14.2 In-band memory: fast but myopic

In-band memory is the agent writing notes during its own session. Its strength is speed: in the very next session "that agent will be better", so there is "a shorter time to kind of seeing that change" [LM 24:17](https://youtu.be/tTcxVv8HHNw?t=1457). Its weaknesses were laid out in Chapter 7: a split of focus between task and memory [LM 16:03](https://youtu.be/tTcxVv8HHNw?t=963), and a view limited to one session at a time [LM 16:35–16:53](https://youtu.be/tTcxVv8HHNw?t=995).

### 14.3 Out-of-band memory: "dreaming"

Mukta's remedy borrows from a school. Students submit work and teachers mark it, but there is also "a head teacher that reviews everything" [LM 17:28](https://youtu.be/tTcxVv8HHNw?t=1048), someone with dedicated time and a view of the whole school. She calls the corresponding process **dreaming**, "a second-order process over memory" [LM 18:15](https://youtu.be/tTcxVv8HHNw?t=1095):

> "dreaming, which is a process that runs in batch and asynchronously with its own allocated resources to ensure that those memories themselves are effective, up to date and helping the agents learn over time." [LM 18:33](https://youtu.be/tTcxVv8HHNw?t=1113)

**The mechanism as she describes it** [LM 18:40–23:40](https://youtu.be/tTcxVv8HHNw?t=1120):

1. Take an existing memory store and a set of transcripts from agent sessions over a period of time.
2. "We give these together to an agent, which reviews all of the transcripts, looks at the memory store" and starts to identify patterns [LM 19:11](https://youtu.be/tTcxVv8HHNw?t=1151). It reads the conversation, but it also "scrutiniz[es] those tool calls and all of the other metadata" [LM 21:13](https://youtu.be/tTcxVv8HHNw?t=1273).
3. An orchestrator deploys a fleet of sub-agents to analyse the transcripts. It then decides where there are "prevalent enough patterns" to warrant a change [LM 22:19–23:03](https://youtu.be/tTcxVv8HHNw?t=1339).
4. It proposes changes, with example transcripts and "some stats on like how prevalent this issue is" [LM 23:26](https://youtu.be/tTcxVv8HHNw?t=1406).
5. A person decides which changes to accept [LM 23:37](https://youtu.be/tTcxVv8HHNw?t=1417).
6. The process can be steered, by telling it what matters in your case and what doesn't [LM 22:32](https://youtu.be/tTcxVv8HHNw?t=1352).

**Her examples are analogies, not case data.**
- A head teacher who notices that "every geography student has incorrectly answered a question" because the topic is missing from the curriculum [LM 20:05–20:09](https://youtu.be/tTcxVv8HHNw?t=1205).
- Students "outputting radians when it's meant to be degrees", which for agents corresponds to a misconfigured tool [LM 20:40](https://youtu.be/tTcxVv8HHNw?t=1240).
- An organisation-wide style problem, such as everyone using too many dashes [LM 21:28](https://youtu.be/tTcxVv8HHNw?t=1288).

**What the public documentation adds, and one difference.** Anthropic's documentation for the feature, called "Dreams" in Claude Managed Agents, confirms the core design [docs: Dreams](https://platform.claude.com/docs/en/managed-agents/dreams):

- A dream "reads an existing memory store alongside past session transcripts, then produces a new, reorganized memory store: duplicates merged, stale or contradicted entries replaced with the latest value, and new insights surfaced".
- It takes 1 to 100 sessions, runs asynchronously for "minutes to a few hours", and accepts optional `instructions` to steer it.
- It is billed at ordinary token rates, and "cost scales roughly linearly with the number and length of input sessions".
- **It is a research preview.**

On one point the documentation is more specific than the talk. The dream writes a **separate** output store: "The input store is never modified, so you can review the output and discard it". Review therefore happens at the level of the whole new store. Targeted edits to individual memories go through a separate API. The talk's description of accepting or rejecting individual changes may reflect another interface. I report both and do not reconcile them.

**The cost argument.** Mukta anticipates the objection that this means spending extra tokens: "Why would I want to chuck extra resources at this?" Her answer is that better memory lets agents one-shot tasks, so "you can see a bunch of costs go down" [LM 24:51–24:58](https://youtu.be/tTcxVv8HHNw?t=1491). The documentation makes the cost side concrete (linear in transcripts). The saving side is asserted, not measured.

### 14.4 The harness loop: skills, evals and rules

Tan's practice is a second form of loop 2, operating on procedures and rules rather than memory:

1. Watch agents fail by reading their tool calls and thinking [LT V01 21:00](https://youtu.be/KwOX7vJyoOk?t=1260) / [LT V02 21:02](https://youtu.be/7urwyHZwtEo?t=1262).
2. Write a skill for the failure [LT V01 16:23–16:58](https://youtu.be/KwOX7vJyoOk?t=983) / [LT V02 16:27–17:02](https://youtu.be/7urwyHZwtEo?t=987).
3. Evaluate the skill blind, across models (Chapter 12).
4. Hill-climb it.
5. When a correction keeps recurring, promote it into a lint or CI rule (Chapter 11).

pstack's "hillclimb" playbook formalises the metric-driven version: "sustained, scientific improvement of one metric against a target … with before/after measurement and one commit per accepted win" [repo: pstack README](https://github.com/cursor/plugins/blob/main/pstack/README.md).

### 14.5 The loop's properties

| | In-band memory | Out-of-band dreaming | Harness loop (skills, evals, rules) |
|---|---|---|---|
| What updates | Memory files | A new memory store | Skills, eval suites, CI rules |
| Signal | What the agent notices in-session | Patterns across many transcripts, including tool calls | Observed failures; eval scores; repeated review comments |
| Timescale | Seconds to minutes | Minutes to hours per run; scheduled | Hours to weeks |
| Who controls | The agent | The system, steered and reviewed by people | Engineers |
| Main risk | Myopia; contamination | Plausible but wrong generalisations; cost | Overfitting to the eval; stale rules |

**What the sources support.** Mukta and the documentation establish how dreaming is designed. Tan and the repository establish how her harness loop is designed. **Neither establishes how much these loops improve outcomes.**

**Running case: reconstruction.** Suppose several agents, over several weeks, investigate performance reports and repeatedly start by profiling the wrong process.
- An **in-band** agent would not see the repetition.
- A **dream** over those transcripts might notice it and propose a memory entry such as "for UI jank in this app, profile the renderer first", with example transcripts and a count, for a person to accept or discard.
- An engineer following Tan's **harness loop** might instead turn the lesson into a skill, or, if a structural cause is found, into a CI rule.

*None of this is reported for the sidebar case. It applies the described mechanisms to it.*

**The question this leaves.** Loops 1 and 2 improve the machine. Neither says anything about whether anyone wants what the machine produces. That question has its own loop, and it runs on human time.

## Chapter 15. Loop 3: a founder learning from users, and why the three loops are not one

**The question:** what does product feedback look like when building gets cheaper, and how does it relate to the other two loops?

### 15.1 What Altman says

Sam Altman’s conversation includes advice about startup iteration and user feedback. The account below paraphrases machine transcripts; it is not a listening-verified quotation. Comparison with the original posted by Cory Levy matched 4,877 of the repost transcript’s 5,036 words (96.8%), confirming the same recording, not exact words or speaker turns. The interviewer remains unidentified. All SA timestamps refer to the repost.

**On what has changed.** Altman presents AI-assisted implementation as dramatically faster than the work expected of an early startup team. He uses a comparison between months of startup work and minutes with Codex to illustrate his belief, without specifying a task or measuring the result [SA 10:55–11:23](https://x.com/res1dualedge/status/2098523926691254447).

**On what that means.** The lesson he draws is about iteration: founders should use cheaper building to test more ideas, make incremental improvements and obtain feedback [SA 11:23–11:44](https://x.com/res1dualedge/status/2098523926691254447).

**On how to find out what users want.** He recommends hands-on recruitment of the first few hundred users, followed by close attention to what they value and how they describe the product [SA 18:30–19:18](https://x.com/res1dualedge/status/2098523926691254447).

### 15.2 Faster-building rhetoric is not a benchmark

This is a belief expressed by the leader of the company selling Codex. It is not a measurement: there is no specified task, quality bar, test, deployment or comparison group.

The one controlled study of experienced developers I know of points the other way. In METR's 2025 randomised trial, 16 experienced open-source developers completed 246 tasks in codebases they knew well. With AI tools allowed, mostly Cursor Pro with Claude 3.5/3.7 Sonnet, tasks took **19% longer**. Beforehand the developers expected a 24% speed-up, and afterwards they believed they had been 20% faster (Becker et al., 2025). An earlier controlled experiment on a single, well-specified task (writing an HTTP server in JavaScript) found GitHub Copilot users finishing 55.8% faster (Peng et al., 2023). These studies used earlier tools on different kinds of tasks. They do not settle what is true in 2026. They show that the answer depends heavily on the task, the tools and the people, and that **people's sense of their own speed-up can be wrong.**

### 15.3 Why fast building does not make the product loop fast

Read carefully, Altman's own point contains its limit **[my analysis]**. The founder's loop has at least four segments:

<!-- visual:three-loops -->

Faster building compresses the first segment. It may also let a founder try more variants in parallel. But the third segment, real people finding, trying, using, abandoning and talking about a product, runs on human time. Altman's own advice about the first few hundred users is advice about that slow segment. Testing ideas and obtaining feedback faster is possible only to the extent that feedback itself can be obtained faster.

He also imagines an assistant that draws on user-permitted information about screen activity and meetings, offering suggestions while leaving decisions to the person [SA 19:32–20:44; paraphrase of machine transcripts](https://x.com/res1dualedge/status/2098523926691254447). The exact forecast and its timing are omitted because speaker turns and wording have not been verified by listening. The relevant idea is **context** combined with a human who still **decides**.

### 15.4 Three loops, side by side

| | Loop 1: Training (TH) | Loop 2: Agent memory and harness (LM, LT) | Loop 3: Founder and product (SA) |
|---|---|---|---|
| **What updates** | Model weights | Memory stores, skills, rules | The product; the founder's beliefs and strategy |
| **Signal** | Loss on training data | Transcripts, traces, tests, evals, review comments | What users do and say; sales conversations |
| **Timescale** | Weeks to months per run | Seconds to days | Days to months |
| **Who controls it** | The lab | The team operating the agents | The founder |
| **Can agents speed it up?** | Not directly (outside these talks' scope) | Yes, this is what they run | Only the build segment |
| **Error if confused with the others** | Expecting daily use to "teach the model" | Mistaking remembered context for new capability | Mistaking build speed for learning speed |

**Connections between loops, and their limits [my framework].** Outputs of one loop can become inputs to another. What users report (loop 3) can become an agent's context or a new CI rule (loop 2). The "left sidebar is laggy" report is exactly that: a user signal entering the engineering loop. Agent transcripts could in principle become training data for future models (loop 1), but nothing in these talks describes that, and I do not assume it. The loops connect, but they do not merge. Each has its own signal, clock and owner.

**Running case.** The sidebar report is a small instance of loop 3 feeding loop 2.
- **Loop 2** can make handling reports like it faster and more reliable.
- **Loop 1** is untouched.
- **Whether the fix mattered** is a loop-3 question: did users stop reporting it, and did they use the sidebar more? No talk and no reconstruction here can answer it.

**The question this leaves.** We now have six layers and three loops. The article's question can finally be asked directly: when a model gets better, what actually improves, and what still limits the value of the work?

## Part VI — Value

> **The question for Part VI:** when model capability improves, what actually improves in the value of the work, and what still limits it?
>
> **Status of this part.** Parts I–V reported what the sources say and show. This part is **my synthesis**. The four recordings do not state this framework and do not test it. I use their claims as inputs, cite them where I do, and mark where the argument goes beyond them.

## Chapter 16. What better models do and do not solve

**The question:** if the model at the bottom of the stack gets better, which of the constraints discussed so far loosen, and which don't?

### 16.1 A layer-by-layer answer

| Constraint | Does a better model loosen it? | Reasoning and sources |
|---|---|---|
| **What can be attempted at all** | Yes | This is what capability means (Part I). |
| **Cost per unit of capability** | Often, but not automatically | Architectural work such as GQA exists to cut serving cost at little loss in quality (Ch. 3). Tan says that Grok 4.6, announced on the day of her session, costs the same per token as Grok 4.5 while being smarter [LT V01 51:13](https://youtu.be/KwOX7vJyoOk?t=3073) / [LT V02 52:02](https://youtu.be/7urwyHZwtEo?t=3122). The list prices bear her out. SpaceXAI's announcements give both models the same API price of $2 per million input tokens and $6 per million output tokens [Grok 4.5 announcement](https://x.ai/news/grok-4-5) and [Grok 4.6 announcement](https://x.ai/news/grok-4-6). She describes the aim of "cursor and SpaceX AI" as the frontier "of … cost versus intelligence", rather than "the biggest model ever" [LT V01 51:25–51:35](https://youtu.be/KwOX7vJyoOk?t=3085) / [LT V02 52:14–52:25](https://youtu.be/7urwyHZwtEo?t=3134). (The two companies were closely tied at the time; SpaceXAI describes Grok 4.5 as "trained alongside Cursor".) Better and cheaper can move together, but only through deliberate engineering. |
| **Using supplied context well** | Partly | Long-context behaviour has improved over time, but position effects (Ch. 6) show that more context is not automatically better-used context. |
| **Knowing *your* situation** | No, unless it is supplied | Mukta: needed context is "orthogonal to the model intelligence" [LM 02:49](https://youtu.be/tTcxVv8HHNw?t=169). No training run knows where *your* sidebar lives. |
| **Your organisation's invariants** | No | "No cross-process imports", "only the coordinator posts to Slack", "org memory is read-only" are **commitments**, not skills. A smarter model can follow them more reliably, but it cannot decide them for you (Ch. 11). |
| **Checking its own work** | Partly | Better models may reason more carefully, but Tan's point stands: verification requires *running the real thing* (Ch. 8), and that is an environment, not a capability. |
| **Human attention** | Partly | Fewer errors mean less rework. But the review, taste and decision tasks of Ch. 12 remain. |
| **Whether anyone wants the output** | No | That is loop 3, and it runs on users' time (Ch. 15). |

### 16.2 The strongest objection: capability will absorb the harness

A serious reader will object that this table underrates capability. The history of machine learning is full of hand-built structure that was later made unnecessary by scale. That is the lesson Rich Sutton called "the bitter lesson". The sources themselves contain evidence for the objection.

- **Mukta's own trajectory moves away from hand-designed tools.** Over time Anthropic became "even less opinionated about what these tools need to look like" [LM 05:42](https://youtu.be/tTcxVv8HHNw?t=342). It let agents search plain files with bash and grep "rather than being opinionated about the specific tools" [LM 08:00](https://youtu.be/tTcxVv8HHNw?t=480).
- **Tan says constraints let weaker models do well.** Once a codebase is strict enough, "even agents that are not … fable size do an excellent job of writing code" [LT V01 50:24](https://youtu.be/KwOX7vJyoOk?t=3024) / [LT V02 51:11](https://youtu.be/7urwyHZwtEo?t=3071). That cuts both ways. It could mean that harnesses substitute for capability, and so will matter less as capability grows.
- **Altman expects a step change soon.** He describes a context-rich assistant as a near-term possibility [SA 19:32–20:44; paraphrase of machine transcripts, not a verified forecast](https://x.com/res1dualedge/status/2098523926691254447).

**My response, and its limits.** The sources separate two things that the objection runs together.

1. **Tooling for content** is becoming *less* opinionated as models improve. This covers how the agent searches, what format memories take, and which procedure it follows. That part of the harness is plausibly absorbed by capability.
2. **Invariants** are becoming *more* deterministic. This covers versioning, concurrency, permissions, architectural rules and the requirement to show evidence. Mukta's own answer to the "databases" question is that proven primitives should be done "in a very deterministic way" [LM 31:34](https://youtu.be/tTcxVv8HHNw?t=1894). These are not compensations for a weak model. They are the organisation's decisions about what must always hold, and a stronger model does not make them unnecessary, any more than a stronger employee makes access control unnecessary.

This is an argument, not a demonstration. It predicts that as models improve, the instruction-shaped parts of harnesses will shrink while the guarantee-shaped parts persist. The sources are consistent with that prediction, but too few and too recent to confirm it.

**Running case.** A much better model might find the sidebar component without a feature map. It would still need a running build to measure the lag. It would still be stopped by the import-graph rule if it broke it. And it still could not tell you whether users care.

**The question this leaves.** Where capability does help, which other resources then become the binding limits?

## Chapter 17. The binding constraints, and what the evidence shows

**The question:** what limits the value of agent-produced work in practice, and how much do the four recordings actually establish about it?

### 17.1 A simple accounting of value

Talk about AI productivity usually counts outputs: lines, PRs, features, claims of rapid implementation. An honest account also has to count what each output cost and whether it was wanted.

#### Equation 16 — Net value of agent-produced changes (an accounting identity, not a model)

**Purpose.** To name every term that a claim about "value" must include, so that we can see which terms any given claim leaves out. **No values are estimated here.** The sources provide none.

$$V_{\text{net}} = \sum_{j \in \text{accepted}} u_j \;-\; C_{\text{total}}$$

$$C_{\text{total}} = C_{\text{tokens}} + C_{\text{verify}} + C_{\text{attention}} + C_{\text{escapes}}$$

**Symbols.**
- The sum runs over changes that were accepted and shipped.
- u_j is the value to users of change j. It is only knowable through loop 3 (Ch. 15).
- C_tokens is model usage for all attempts, including failed ones and out-of-band processes such as dreaming.
- C_verify is the cost of running verification: environments, traces, CI.
- C_attention is human time spent specifying, reviewing, deciding and maintaining skills and rules.
- C_escapes is the cost of defects that got past every check (Ch. 10).

**How the chapters map onto the terms.**

| Term | Where it comes from | What the sources say |
|---|---|---|
| u_j | Loop 3 | Nothing measured. Altman: listen to the first few hundred users [SA 18:53–19:18](https://x.com/res1dualedge/status/2098523926691254447) |
| C_tokens | Chapters 3, 6, 14 | Tan: "tokens are pretty expensive" [LT V01 50:49](https://youtu.be/KwOX7vJyoOk?t=3049) / [LT V02 51:38](https://youtu.be/7urwyHZwtEo?t=3098). Her token allowance is not established; she cautions against copying her setup exactly [LT-full 51:31–51:44; machine transcripts](https://youtu.be/Cmoh-yR-usA?t=3091). Dreaming cost is linear in transcripts [docs](https://platform.claude.com/docs/en/managed-agents/dreams) |
| C_verify | Chapter 8 | Setup effort described. No cost figures |
| C_attention | Chapters 8, 12 | "You are the verifier" [LT](https://youtu.be/Cmoh-yR-usA). Taste and review remain [LT](https://youtu.be/Cmoh-yR-usA). A human gate on memory [LM](https://youtu.be/tTcxVv8HHNw?t=0) |
| C_escapes | Chapter 10 | No data |

**Reasoning with the identity (qualitative only).**
- A throughput claim, such as a PR count or claims of rapid implementation, reports how many terms enter the sum. It says nothing about u_j or any cost term.
- Adding verification raises C_tokens and C_verify. It pays off only if it lowers C_attention (the human stops being the verifier) and C_escapes by more. Tan's argument is that it does. The sources show the mechanism but not the magnitudes.
- Tan frames the whole question as return on investment: whether to "hire someone" or "spend the tokens to set up a codebase so that even … the dumbest agents can do a good job" [LT V01 50:08–50:24](https://youtu.be/KwOX7vJyoOk?t=3008) / [LT V02 50:55–51:11](https://youtu.be/7urwyHZwtEo?t=3055). For her, the value of agents is "allowing you to do things that you couldn't do before" [LT V01 49:20](https://youtu.be/KwOX7vJyoOk?t=2960) / [LT V02 50:06](https://youtu.be/7urwyHZwtEo?t=3006). She also wants to avoid growing into "a 10,000 person engineering org" [LT V01 48:59](https://youtu.be/KwOX7vJyoOk?t=2939) / [LT V02 49:44](https://youtu.be/7urwyHZwtEo?t=2984). That is the identity written in words. Her answer, that the return "will be pretty positive", is her judgement; the talk supplies no token budget or measured return.

**Assumptions and limits.** This is an accounting identity: true by construction, and useful only for checking what a claim includes. It says nothing about the size of any term. Some terms (u_j, C_escapes) may take months to become visible.

### 17.2 Human attention as the scarcest input

Across all four sources, one resource keeps reappearing as the thing everything else is designed to save.

- **Tan.** The first problem was that the human was the verifier and the bottleneck (Ch. 8). The whole trust curve is about spending less attention per unit of agent work (Ch. 9).
- **Mukta.** She justifies memory partly as freeing "capacity and context for you as product developers" [LM 15:00](https://youtu.be/tTcxVv8HHNw?t=900). Yet she keeps a human at the point of memory change (Ch. 14).
- **Altman.** His imagined assistant helps a person process more customer feedback while leaving decisions to that person [SA 20:02–20:10; paraphrase of machine transcripts](https://x.com/res1dualedge/status/2098523926691254447).
- **Hashimoto.** In training the equivalent is compute: "the only thing that matters, in some sense, is flops" [TH 54:40](https://youtu.be/lVynu4bo1rY?t=3280). This is an analogy only. His lecture concerns machines, not people.

The pattern **[my synthesis]**: better models raise the ceiling on what one unit of human attention can oversee. Verification and hard constraints raise it further. But every design in the sources still ends in a human decision, whether to accept a memory change, stamp a PR, or keep building a product. Value is therefore limited by the quality of those decisions as much as by the quantity of agent output.

### 17.3 What the evidence shows, and what it doesn't

It is worth being precise about what this article's sources can bear.

**What they establish.**
- **Hashimoto** (checked against slides and cited papers). How modern transformers are designed, trained stably and served. Why decode is memory-bound. Why the field adopted pre-norm, RMSNorm, gated FFNs, RoPE, QK-norm and GQA. How that knowledge was built: surveys across many models, controlled comparisons, and open admissions of what is untested.
- **Mukta** (checked against the official captions and documentation). How Anthropic's context-engineering practice evolved; which failures appear in production memory systems; how out-of-band dreaming is designed.
- **Tan** (cross-checked across three caption tracks and against her public repository). What tools and rules one highly experienced engineer uses to make agent work checkable, and the order in which she came to trust them.
- **Altman** (machine transcript). What he believes about iteration speed and early-stage product feedback.

**What they do not establish.**
- That any of these practices improves outcomes compared with alternatives. None of the talks reports a controlled comparison.
- Any rate of correctness, defects, reverts or time saved for agent-produced work.
- That practices from well-resourced vendors (Tan's individual setup; Mukta's product, Claude Managed Agents, which she notes she is "not allowed" to pitch but names when asked [LM 28:16–28:42](https://youtu.be/tTcxVv8HHNw?t=1696); Altman's Codex) transfer to other organisations.
- Anything about how widely these practices are used.

**How the claims degraded in circulation.** The opening note described how the social-media posts that spread these recordings misquoted two speakers and mislabelled the lecture. Every distortion made the claim more dramatic and less accurate. That is a small but real warning about how evidence on this topic travels.

**A standard to aim for.** Hashimoto's lecture shows what mature evidence looks like in one part of this field. Findings come from many independent models. Comparisons are matched in parameters and compute. Gains are reported with error bars. And there is an explicit list of what "no one's done the ablations" on [TH 41:15](https://youtu.be/lVynu4bo1rY?t=2475). Claims about agent workflows are not yet held to that standard. The METR study (Ch. 15) is one example of what holding them to it could look like, and its result was a surprise to the participants and to forecasters.

**Running case.** For the sidebar, the sources can tell us how an agent could be equipped to reproduce, measure, fix and prove a fix for a performance complaint, and which rules would stop the most likely mistakes. They cannot tell us whether doing so was worth it. That depends on u_j, which only the application's users can reveal.

## Epilogue — A diagnostic

The six layers are not a theory of AI. They are a way to find where a problem actually lies. When an agent's work disappoints, ask which of these is true:

| Symptom | Likely layer | Question to ask | Chapter |
|---|---|---|---|
| The output is incoherent or the model can't do the task at all | **Model** | Is this beyond current capability, or too costly to serve at the needed context length? | 1–4 |
| The agent is capable but wrong about *your* system | **Context** | Did it have the situational knowledge? Was that knowledge current and trustworthy? | 5–7 |
| It claimed success that wasn't real | **Action** | Could it run the real system and see the result, and did it show evidence? | 8–9 |
| It did something it should never do | **Trust** | Was that rule an instruction it could forget, or a guarantee it could not bypass? | 10–12 |
| It makes the same mistake again tomorrow | **Learning** | Which loop should have absorbed the correction: memory, a skill, a rule? | 13–15 |
| It worked, and nobody cared | **Value** | What did users actually do, and what did it cost to find out? | 16–17 |

And one working rule, which is Tan's, restated with its limits. When you correct an agent the same way twice, ask **which layer that correction belongs in**. Maybe it is context the agent needs in order to check its own work. Maybe it is an invariant that the system should guarantee. Or maybe it is a judgement that should stay with a person. Tan found that for her codebase, more corrections belonged in the second category than she first expected. Whether that holds for yours is an empirical question, and that is the point.

## Appendix A — The transformer block, dimension by dimension

**Purpose.** To make the parameter counts in Chapters 2–3 concrete for one illustrative configuration.

**Notation.**
- d is the model width and L the number of layers.
- h is the number of query heads, and d_head = d/h is the size of each head.
- g is the number of key/value heads: g = h for multi-head attention, 1 for multi-query attention, and in between for grouped-query attention.
- d_ff is the hidden width of the feed-forward layer.
- |V| is the vocabulary size.

**Parameters per block (no biases, as in most modern models).**

| Component | Matrices | Parameters |
|---|---|---|
| Query projection | d × d | d² |
| Key and value projections | 2 × (d × g·d_head) | 2·d·g·d_head |
| Output projection | d × d | d² |
| SwiGLU FFN | W₁, V: d × d_ff; W₂: d_ff × d | 3·d·d_ff |
| Two RMSNorms | γ vectors | 2d |

**Illustrative configuration (my choice, resembling a 7B-class model; not a specific published model).** d = 4096, L = 32, h = g = 32, d_head = 128, d_ff = (8/3)·d ≈ 10,923, |V| = 32,000.

- Attention: 4d² ≈ 67.1 M per layer.
- FFN: 3 · 4096 · 10,923 ≈ 134.2 M per layer.
- Per block ≈ 201.3 M. Over 32 layers ≈ 6.44 B.
- Input embedding and output matrix: 2 · |V| · d ≈ 0.26 B.
- **Total ≈ 6.7 B parameters.**

With GQA and g = 8, the key/value projections shrink from 2d² to 2·d·(8 · 128) = d²/2. That saves about 25 M parameters per layer. More importantly, it shrinks the KV cache by a factor of 4 (Equation 10).

**Shapes through one block, for a batch of b sequences of n tokens.** The input X has shape b×n×d. The projections give Q with shape b×h×n×d_head, and K and V with shape b×g×n×d_head. Attention scores have shape b×h×n×n and are masked causally. The output of attention has shape b×n×d and is added to the residual stream. The FFN hidden layer has shape b×n×d_ff, and its output b×n×d is added to the residual stream.

## Appendix B — RoPE via complex numbers

**Purpose.** To derive the relative-position property of Equation 7 compactly, in the form the RoFormer paper uses.

1. Treat each pair of coordinates (x₁, x₂) as one complex number z = x₁ + i·x₂.
2. Rotating by an angle α is multiplication by e^{iα}.
3. The real dot product of two 2-D vectors equals the real part of one complex number times the conjugate of the other: (a, b)·(c, d) = Re[(a + ib)·conj(c + id)].
4. RoPE sets q̃ = q·e^{imθ} for the query at position m and k̃ = k·e^{inθ} for the key at position n. Then

   Re[q̃·conj(k̃)] = Re[q·conj(k)·e^{i(m−n)θ}],

   which depends on the positions only through m − n.
5. For d dimensions, apply this independently to d/2 pairs with frequencies θ_j = 10000^{−2(j−1)/d}, for j = 1, …, d/2 (Su et al., eq. 15). The resulting attention score is q_mᵀ k_n = xᵀ W_q R_{Θ, n−m} W_k x_n. The rotation between them depends only on the offset.

**Frequencies.** With d = 128:
- the first pair rotates by 1 radian per position (a full turn about every 6 tokens);
- the last pair rotates by about 10000^{−126/128} ≈ 1.15 × 10⁻⁴ radians per position (a full turn about every 55,000 tokens).

This spread lets different pairs encode short-range and long-range offsets. RoFormer argues that this choice also gives inner products a "long-term decay" as relative distance grows.

**Variants.** Hashimoto mentions Gemma 4's "proportional RoPE", which rotates only some coordinates [TH 37:21–37:26](https://youtu.be/lVynu4bo1rY?t=2241). In the Q&A he explains that the rationale is that the low-frequency pairs barely rotate anyway [TH 41:44](https://youtu.be/lVynu4bo1rY?t=2504).

## Appendix C — Arithmetic intensity and the KV cache: the full count

**Purpose.** To derive the three rows of Equation 11's table from the slides' symbols. The source is slides pp. 58, 60 and 61, following Shazeer (2019). Notation: b is the batch size, n the sequence length (assumed n < d), d the model width, h the number of heads, and k = d/h the head size. Constant factors are dropped throughout.

**Prefill (all n positions at once).**
- *Operations.* The projections multiply b·n vectors by d×d matrices, so O(bnd²). Attention scores add O(bn²d), which is smaller because n < d.
- *Memory.* Read and write the activations, O(bnd). Materialise the h score matrices, O(bhn²). Read the weights once, O(d²).
- *Intensity.* bnd² / (bnd + bhn² + d²) = 1 / (1/d + hn/d² + 1/(bn)). Since hn/d² = n/(dk) < 1/k when n < d, the slide's simplified bound is O((1/k + 1/(bn))⁻¹). That is high whenever heads are reasonably large and b·n is large.

**Decode with a KV cache (n steps, one new token per step).**
- *Operations.* The same O(bnd²) in total, done incrementally.
- *Memory.*
  - Each step re-reads the weight matrices, so O(d²) per step and O(nd²) over n steps.
  - At step t it reads the cached keys and values of t tokens for each sequence, O(b·t·d). Summed over t = 1…n this is O(bn²d).
- *Intensity.* bnd² / (bn²d + nd²) = 1 / (n/d + 1/b).

**Multi-query attention.** Keys and values have dimension k instead of d, because one head is shared across all queries. The cache reads become O(bn²k), and the query and output traffic O(bnd) is still counted.
- *Intensity.* bnd² / (bnd + bn²k + nd²) = 1 / (1/d + nk/d² + 1/b) = 1 / (1/d + n/(dh) + 1/b), using k = d/h.

**Grouped-query attention [my generalisation, same method].** With g key/value heads, the cache traffic is O(bn²·g·k). That gives an intensity ≈ 1 / (1/d + n·g/(d·h) + 1/b). Setting g = h recovers the multi-head row, and g = 1 recovers the multi-query row.

**Worked numbers (from Chapter 3).** Take d = 4096, b = 8, n = 2048, h = 32, k = 128.

| Case | Intensity (big-O) |
|---|---|
| Prefill | ≈ 127 |
| Decode (MHA) | ≈ 1.6 |
| Decode (GQA, g = 8) | ≈ 4.0 |
| Decode (MQA) | ≈ 7.1 |

These are relative magnitudes only.

## Appendix D — Stability and hyperparameter reference

**Consensus choices** (Hashimoto's survey, lecture slides; model lists as given on the slides):

| Choice | Consensus | Notable models or exceptions (slides) |
|---|---|---|
| Norm placement | Pre-norm, outside the residual stream | Exception: OPT-350M. Non-residual post-norm also used: Grok, Gemma 2, OLMo 2 (p. 10, 13) |
| Norm type | RMSNorm | LayerNorm: GPT-1/2/3, OPT, GPT-J, BLOOM. RMSNorm: LLaMA family, PaLM, Chinchilla, T5 (p. 14) |
| Biases | Dropped | Reasons given: memory, optimisation stability (p. 18) |
| FFN activation | Gated (SwiGLU/GeGLU) | GeGLU: T5 v1.1, mT5, LaMDA, Phi3, Gemma 2/3/4. SwiGLU: LLaMA 1/2/3, PaLM, Mistral, OLMo (p. 23) |
| FFN ratio d_ff/d | 4 (ungated), about 8/3 (gated) | PaLM 4; Mistral 7B 3.5; LLaMA-2 70B 3.5; LLaMA 70B 2.68; Qwen 14B 2.67; DeepSeek 67B 2.68; Yi 34B 2.85; T5 v1.1 2.5. T5 v1 used 64 (p. 37–38) |
| Heads × head size | = d | Most models have a ratio of about 1. Exceptions are some Google models (p. 42) |
| Aspect ratio d/L | About 100 | Partly a systems choice (pipeline vs tensor parallelism) [TH 52:29–53:11](https://youtu.be/lVynu4bo1rY?t=3149) |
| Vocabulary | 30k (monolingual); 100–200k (multilingual/production) | [TH 55:40–55:53](https://youtu.be/lVynu4bo1rY?t=3340) |
| Position | RoPE | Most models since 2024 [TH 32:34](https://youtu.be/lVynu4bo1rY?t=1954) |
| Output-softmax stability | z-loss, α = 10⁻⁴ (PaLM) | Baichuan 2, DCLM, OLMo 2, OLMo 3 (p. 54) |
| Attention-softmax stability | QK-norm | DCLM, OLMo 2, Gemma 2, Qwen3, OLMo 3, Gemma 4; originally from vision and multimodal work (p. 55) |
| Logit soft-capping | c = 50 (attention), 30 (final), Gemma 2 | Perplexity comparison on slide p. 56, matched to [Rybakov et al., Table 4](https://arxiv.org/html/2410.16682v1#S5) |
| Attention heads for inference | GQA | "Models today, almost all, adopt this GQA structure" [TH 1:22:57](https://youtu.be/lVynu4bo1rY?t=4977) |
| Long context | Sparse or sliding-window attention in some layers | GPT-3, GPT-OSS, Gemma 4 (p. 64) |

## Appendix E — Memory-system engineering

**A provenance-carrying memory update [my illustration of Mukta's versioning principle, LM 10:42–11:02].**

```
memory/org/code-style.md   version 12 → 13
  author:       agent session  sess_…  (or: human, name)
  motivated by: transcripts   [sess_…, sess_…]
  change:       + "Profile the renderer process first for UI jank reports."
  parent hash:  h12   (compare-and-swap, Chapter 11)
  approval:     pending human review   (tier: org-wide → read-only for agents)
```

**Failure catalogue (Chapter 7) with the mitigation's layer.**

| Failure | Mitigation | Deterministic? |
|---|---|---|
| Lost concurrent write | Compare-and-swap on a content hash | Yes |
| Bad write to shared tier | Permission tiers; human approval | Permissions yes; approval no |
| Unknown origin of a memory | Provenance fields (session, transcripts, author) | Yes (recording); no (judging) |
| Stale or contradicted memory | Out-of-band consolidation (dreaming); maintenance passes | No (model-driven), reviewed by people |
| Prompt-injected memory | Provenance + permissions + review | Partly |

**Dreams, as documented [docs: Dreams, research preview](https://platform.claude.com/docs/en/managed-agents/dreams).**
- Inputs: one memory store plus 1–100 sessions, and optional `instructions` (up to 4,096 characters).
- Output: a new, separate memory store. The input is never modified.
- Runtime: asynchronous, "minutes to a few hours".
- Billing: standard token rates; cost scales roughly linearly with the number and length of sessions.
- Lifecycle: pending → running → completed | failed | canceled. A failed or cancelled dream leaves partial output for inspection.

## Appendix F — Anatomy of a verification skill, an eval, and a guarded automation

*The source for this appendix is the pstack repository (github.com/cursor/plugins, `pstack/`), read in September 2026.*

**A generated verification skill** (`/create-verification-skill`) has these sections:

| Section | Role |
|---|---|
| Launch | How to start the app locally |
| Doctor | How to check that the environment is healthy |
| Drive | How to operate it (existing harness, CDP, PTY, or HTTP) |
| Evidence | What output proves behaviour |
| Cleanup | How to shut it down |

It also writes a feature map: an index plus one file per feature, giving how to reach it and what proves it works. The generator must prove the skill end to end once before hand-off.

**Maintenance** (`/maintain-verification-skill`) runs read-only source readers per feature, then one live pass. It ends in exactly one of `clean`, `changed` (a PR confined to the skill directory) or `blocked`. It never edits product code.

**The eval playbook (`playbooks/eval.md`), in brief.**

- **Blind the candidates.**
  - No words like eval, test, judge, rubric or benchmark anywhere a candidate sees.
  - Use an organic prompt.
  - Don't reveal that other candidates exist.
- **Run the candidates.** N parallel candidates on different models, each in a sanitised directory.
- **Judge blind.** One judge from a different model family, seeing outputs only by sanitised label.
- **Grade from evidence.** Grade chain-following from the files each candidate actually read, not from its self-report.
- **Read the outputs yourself.** The author reads every output. Disagreement with the judge signals bias or an ambiguous rubric.

**The perf playbook (`playbooks/perf-issue.md`).**
1. Baseline trace via the control skill.
2. Hypotheses from the code, using eight strategy families (elimination, divide and conquer, caching, indirection, batching, redundancy, lazy evaluation, scheduling). A family is tried only when the trace shows its signal.
3. Plan; delegate the implementation; review; post-fix trace.
4. Compare the artefacts; "inconclusive" is not a pass.
5. Cite the measurement in the PR.
6. Reply with baseline, post-fix, delta, and artefact path.

**The Benny automation (`automations/benny/…/reproduce-and-fix-issues`), selected hard rules.**
- The symptom must appear twice through real UI interaction.
- No confirmed repro, no authored fix.
- An existing PR or commit switches the run to verify mode.
- Delegated workers are read-only.
- Only the coordinator posts to Slack.
- Code-writing workers must provably lack Slack credentials.
- The output is a draft PR "only after before-and-after proof".

**Landing** (guide).
- Babysit "never merges".
- Shipping verifies each PR with a fresh agent that did not write it, then lands only the contiguous verified run.

## Appendix G — Sources and evidence

**The four recordings.**

| Key | Speaker, event, date | Link used | Checked against |
|---|---|---|---|
| TH | Tatsunori Hashimoto; Stanford CS336 Lecture 3; 6 Apr 2026 | [recording lVynu4bo1rY](https://youtu.be/lVynu4bo1rY) (Stanford Online; 1:29:14) | Official manual captions; lecture slides (github.com/stanford-cs336/lectures, `lecture_03.pdf`); cited papers |
| LM | Lamis Mukta (Anthropic); AI Native DevCon London; Jun 2026 | [recording tTcxVv8HHNw](https://youtu.be/tTcxVv8HHNw) (AI Native Dev; 31:58) | Official manual captions; Claude documentation (Agent Skills; Dreams); name and talk confirmed on the organiser's speaker page (Tessl) |
| LT | Lauren Tan (Cursor); Maven live session, host Colin Matthews; 12 Aug 2026 | [recording KwOX7vJyoOk](https://youtu.be/KwOX7vJyoOk) and [recording 7urwyHZwtEo](https://youtu.be/7urwyHZwtEo) (re-uploads of the same session); fuller upload [recording Cmoh-yR-usA](https://youtu.be/Cmoh-yR-usA) for on-screen material | Three YouTube caption tracks plus an independent Whisper transcript of the audio; slides and screenshots read from still frames; the pstack repository; the [Maven event page](https://maven.com/p/e23d9c/how-cursor-turned-ai-agents-into-better-engineers) |
| SA | Sam Altman; interviewer unconfirmed | Reposted copy ([video post](https://x.com/res1dualedge/status/2098523926691254447)) | Original posted at [video post](https://x.com/cory/status/2087060650870907170) matches the repost recording: 4,877/5,036 transcript words (96.8%). This is not listening verification. All SA timestamps use the repost |

X links open the corresponding post; seek manually to the printed SA timestamp in the **repost**, not the longer original. YouTube citation links seek to the start of the printed interval. V01 and V02 have separate links because their clocks differ.

**Quotation checks.**
- Every quotation from TH and LM matches the uploader-provided captions of the official videos. Where those captions disagree with the slides (TH "3D case" for "2D case"), the slides were followed.
- LT wording was compared across caption tracks and Whisper; these are machine checks, not listening verification. The disputed token-allowance quotation is omitted. The five layer names and Dune contract were checked directly in video frames (LT-full 48:20 and 45:20).
- SA passages paraphrase machine transcripts. Original/repost overlap establishes recording identity, not exact words, speaker turns, or interviewer identity.

**Social-media framing that the recordings do not support.**
- "We don't write prompts anymore. We build loops" (attributed to Mukta): not supported by the checked captions.
- "You can build 10 assistants in an afternoon with GPT-6 Astra" (attributed to Altman): not supported by the checked machine transcripts.
- "Stanford just dropped a 1-hour course" (about Hashimoto's lecture): it is one ≈89-minute lecture of a course, published in April 2026.
- The two Lauren Tan uploads are titled "part1" and "part2" but contain the same session.

**Primary references.**

- [Ivanov et al. — Data Movement Is All You Need (MLSys 2021), Table 1](https://proceedings.mlsys.org/paper_files/paper/2021/file/bc86e95606a6392f51f95a8de106728d-Paper.pdf#page=4)
- [Su et al. — RoFormer](https://arxiv.org/abs/2104.09864)
- [Shazeer — Fast Transformer Decoding (MQA)](https://arxiv.org/abs/1911.02150)
- [Ainslie et al. — GQA](https://arxiv.org/abs/2305.13245)
- [Liu et al. — Lost in the Middle](https://arxiv.org/abs/2307.03172)
- [Needham et al. — Large Language Models Often Know When They Are Being Evaluated](https://arxiv.org/abs/2505.23836)
- [Becker et al. — METR developer productivity trial](https://arxiv.org/abs/2507.09089)
- [Peng et al. — GitHub Copilot productivity experiment](https://arxiv.org/abs/2302.06590)
- [Rybakov et al. — Methods of improving LLM training stability, Table 4](https://arxiv.org/html/2410.16682v1#S5)
- [Gemma 2 technical report](https://arxiv.org/abs/2408.00118)
- [PaLM technical report](https://arxiv.org/abs/2204.02311)
- [NVIDIA H100 specifications](https://www.nvidia.com/en-us/data-center/h100/)
- [Anthropic Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Anthropic Dreams documentation](https://platform.claude.com/docs/en/managed-agents/dreams)
- [Cursor pstack repository](https://github.com/cursor/plugins/tree/main/pstack)
- [Stanford CS336 lecture slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf)
- [Sutton — The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)
- [Grok 4.5 announcement](https://x.ai/news/grok-4-5)
- [Grok 4.6 announcement](https://x.ai/news/grok-4-6)

Architecture comparisons attributed only to the lecture remain lecture evidence; a linked paper is not a claim that every result in it was independently replicated. Repository and product documentation describe the September 2026 review snapshot, which can differ from the recordings.

**What each recording does not establish.**
- **TH:** anything about agents, context engineering, verification or productivity.
- **LM:** any quantified benefit of memory or dreaming.
- **LT:** any rate of correctness, defects or time saved; generality beyond the individual setup described by a very experienced engineer.
- **SA:** any measurement of productivity.

## Appendix H — Where the speakers differ, and where they only seem to

| Topic | Positions | Real disagreement? |
|---|---|---|
| **Does intelligence compound?** | Altman emphasises cumulative AI progress [SA 15:25](https://x.com/res1dualedge/status/2098523926691254447); Mukta emphasises deployment-specific context [LM 02:41](https://youtu.be/tTcxVv8HHNw?t=161). Both are paraphrases of transcripts/captions | **No.** They are talking about different things: AI progress in the world at large vs one model deployed in one organisation. Opposite-sounding sentences, compatible claims |
| **Autonomy vs determinism** | Mukta praises agent autonomy over memory [LM 05:17; 08:36](https://youtu.be/tTcxVv8HHNw?t=317) and moves infrastructure into deterministic code [LM 31:34](https://youtu.be/tTcxVv8HHNw?t=1894). Tan lets agents implement freely inside strict CI | **No.** Both apply autonomy to *content* and determinism to *invariants* (Ch. 11) |
| **Throughput vs quality** | Tan’s displayed chart claims 3000+ PRs in five months [LT-full 07:10, video frame](https://youtu.be/Cmoh-yR-usA?t=430), but she distinguishes behavioural checks from code quality. The [pstack README](https://github.com/cursor/plugins/blob/main/pstack/README.md) prioritises quality over throughput | **Different measures**, not evidence that more PRs mean more value |
| **Auto-merge** | Tan's setup auto-merges [LT V01 03:57](https://youtu.be/KwOX7vJyoOk?t=237) / [LT V02 03:32](https://youtu.be/7urwyHZwtEo?t=212). pstack's public Babysit "never merges" | **Configuration difference**, not a contradiction |
| **How dream output is reviewed** | Talk: accept or reject changes [LM 23:37](https://youtu.be/tTcxVv8HHNw?t=1417). Docs: review or discard a whole new store | **Unresolved detail.** Both are reported |
| **Does more capability make harnesses obsolete?** | Suggested by Altman’s optimism about a context-rich assistant [SA 19:32–20:44; transcript paraphrase](https://x.com/res1dualedge/status/2098523926691254447) and Mukta's less-opinionated tools [LM 05:42](https://youtu.be/tTcxVv8HHNw?t=342). Against: Mukta's determinism answer [LM 31:34](https://youtu.be/tTcxVv8HHNw?t=1894); Tan's hard constraints | **Open.** My content/invariant distinction (Ch. 16) is an argument, not evidence |
| **Speed-up from AI coding** | Altman: dramatic speed-up rhetoric (transcript paraphrase). Tan: high personal throughput (self-report). METR RCT: 19% slower for experienced developers, early 2025 | **Genuinely open.** Different tasks, tools, periods and kinds of evidence |

## Appendix I — Glossary

- **Ablation** — an experiment that removes or changes one component to measure its effect.
- **Agent** — a system that uses a language model to choose and carry out actions (reading files, running commands, calling tools) toward a goal.
- **Arithmetic intensity** — operations performed per byte moved to or from memory (Equation 5).
- **Attention** — the mechanism by which each token computes a weighted mix of other tokens' values (Equation 1).
- **CDP (Chrome DevTools Protocol)** — the interface through which a program can inspect and drive a Chromium-based browser or Electron app.
- **CI (continuous integration)** — automated checks run on every proposed change. A failing check blocks the change.
- **Compare-and-swap / optimistic concurrency** — write only if the data hasn't changed since you read it; otherwise retry.
- **Context (of a model)** — the tokens in the model's window for a given request.
- **Context engineering** — deciding what information enters that window, when, and in what form.
- **Cross-entropy loss** — the average negative log-probability assigned to the true next token (Equation 2).
- **Decode / prefill** — generating output one token at a time vs processing the prompt all at once.
- **Dreaming** — Anthropic's name for an out-of-band batch process that consolidates an agent memory store using past transcripts.
- **Eval** — a repeatable test of an agent's or skill's behaviour.
- **Feature map** — in Tan's usage, a file indexing an app's features: how to reach each one and what proves it works.
- **FFN / MLP** — the per-token feed-forward sub-layer of a transformer block.
- **FLOP** — one floating-point operation.
- **Frame budget** — the time available to render one frame (≈16.7 ms at 60 fps; Equation 13).
- **GQA / MQA / MHA** — grouped-, multi-query and multi-head attention: different ways of sharing key/value heads.
- **Hash** — a short fingerprint of data that changes when the data changes.
- **Harness** — the software around a model that builds its context, executes its tool calls, and enforces rules.
- **In-band / out-of-band** — during an agent's own session vs in a separate process.
- **KV cache** — stored keys and values of previous tokens, reused during decoding (Equation 10).
- **Logit** — an unnormalised score before a softmax.
- **Pre-norm / post-norm** — normalisation before a block's computation (outside the residual path) vs after the residual addition (Equation 3).
- **Progressive disclosure** — loading short descriptions first and full content only when needed (Equation 12).
- **Residual stream** — the running vector per token to which each block adds its output.
- **RMSNorm / LayerNorm** — normalisations: rescale only, vs re-centre and rescale (Equation 4).
- **RoPE** — rotary position embedding (Equation 7).
- **Skill** — a packaged procedure (instructions, optionally scripts and resources) that an agent loads on demand.
- **Softmax** — turns scores into positive weights summing to 1.
- **Soft-capping** — bounding logits with c·tanh(ℓ/c) (Equation 9).
- **SwiGLU / GeGLU** — gated feed-forward layers (Equation 6).
- **Token** — the unit of text a model reads and writes.
- **Verification (in Tan's sense)** — the agent running the real application to check that its change works.
- **Weight decay** — shrinking parameters toward zero at each update (Equation 15).
- **z-loss** — a penalty on the squared log of the softmax normaliser (Equation 8).
