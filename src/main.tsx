import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  FileCheck2,
  Flag,
  HeartHandshake,
  LockKeyhole,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wallet,
  X,
} from "lucide-react";
import {
  catalogue,
  creators,
  money,
  readState,
  seed,
  validateNotes,
  type Category,
  type DemoState,
  type RequestItem,
  type Status,
} from "./data";
import "./style.css";

const statusText: Record<Status, string> = {
  OPEN: "Open",
  ACCEPTED: "Accepted",
  SUBMITTED: "Submitted",
  VERIFIED: "Verified",
  PAID: "Paid",
  DECLINED: "Declined",
};
const routeNow = () => location.hash.replace(/^#/, "") || "/";
function ProductArt({
  tone,
  compact = false,
}: {
  tone: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`product-art ${tone} ${compact ? "compact" : ""}`}
      aria-hidden="true"
    >
      <div className="art-ring" />
      <div className="art-pebble" />
      <span className="art-cross">✳</span>
      <span className="art-grid" />
    </div>
  );
}
function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`badge ${className}`}>{children}</span>;
}
function App() {
  const [state, setState] = useState<DemoState>(readState);
  const [route, setRoute] = useState(routeNow);
  const [toast, setToast] = useState("");
  const [gate, setGate] = useState<null | (() => void)>(null);
  const [consent, setConsent] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All requests");
  const [category, setCategory] = useState("All categories");
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState("soft-one");
  const [requestCategory, setRequestCategory] = useState<Category>("Starter");
  const [notes, setNotes] = useState("");
  const [reward, setReward] = useState("40");
  const [agreed, setAgreed] = useState(false);
  const [proof, setProof] = useState("");
  const [attached, setAttached] = useState(false);
  const [submissionConsent, setSubmissionConsent] = useState(false);
  useEffect(() => {
    const cb = () => {
      setRoute(routeNow());
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", cb);
    return () => removeEventListener("hashchange", cb);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("paul-demo-v2", JSON.stringify(state));
    } catch {
      /* The demo remains usable without persistence. */
    }
  }, [state]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(t);
  }, [toast]);
  const go = (path: string) => {
    setMobile(false);
    if (route === path) window.scrollTo(0, 0);
    else location.hash = path;
  };
  const adultAction = (action: () => void) => {
    if (state.adult) action();
    else {
      setConsent(false);
      setGate(() => action);
    }
  };
  const startCreate = () =>
    adultAction(() => {
      setStep(1);
      setNotes("");
      setAgreed(false);
      go("/create");
    });
  const updateRequest = (id: string, changes: Partial<RequestItem>) =>
    setState((s) => ({
      ...s,
      requests: s.requests.map((r) => (r.id === id ? { ...r, ...changes } : r)),
    }));
  const accept = (r: RequestItem) =>
    adultAction(() => {
      updateRequest(r.id, { status: "ACCEPTED", claimant: "you" });
      setToast("Request accepted in the demo. You can change your mind.");
    });
  const decline = (r: RequestItem) => {
    updateRequest(r.id, { status: "DECLINED", claimant: "you" });
    setToast("Request declined. No obligation.");
  };
  const withdraw = (r: RequestItem) => {
    updateRequest(r.id, { status: "OPEN", claimant: undefined });
    setToast("You stepped back. The demo request is open again.");
    go("/browse");
  };
  const activeProduct = catalogue.find((p) => p.id === productId)!;
  const notesError = validateNotes(notes);
  const filtered = state.requests.filter(
    (r) =>
      (filter === "All requests" || r.status === filter) &&
      (category === "All categories" || r.category === category) &&
      `${catalogue.find((p) => p.id === r.productId)?.name} ${r.category} ${creators.find((c) => c.id === r.creatorId)?.name}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const currentRequest = state.requests.find(
    (r) => r.id === route.split("/")[2],
  );
  const pending = state.requests
    .filter(
      (r) =>
        r.claimant === "you" &&
        ["ACCEPTED", "SUBMITTED", "VERIFIED"].includes(r.status),
    )
    .reduce((n, r) => n + r.reward, 0);
  const createRequest = (e: FormEvent) => {
    e.preventDefault();
    if (
      !catalogue.some((p) => p.id === productId) ||
      requestCategory !== activeProduct.category ||
      notesError ||
      !agreed ||
      !Number.isFinite(Number(reward)) ||
      Number(reward) < 5 ||
      Number(reward) > 500 ||
      Number(reward) > state.balance
    ) {
      setToast("Check the catalogue, reward, and boundaries before posting.");
      return;
    }
    const id = "rq-" + crypto.randomUUID().slice(0, 8),
      amount = Number(reward);
    setState((s) => ({
      ...s,
      balance: s.balance - amount,
      requests: [
        {
          id,
          productId,
          category: requestCategory,
          reward: amount,
          status: "OPEN",
          creatorId: "you",
          notes:
            notes.trim() ||
            "Approved catalogue request. Respect the agreed brief, boundaries, and the right to stop.",
          createdAt: new Date().toISOString(),
        },
        ...s.requests,
      ],
      transactions: [
        {
          id: "demo-" + crypto.randomUUID().slice(0, 8),
          label: "Request reward reserved",
          amount: -amount,
          status: "Reserved",
          date: new Date().toISOString(),
          requestId: id,
        },
        ...s.transactions,
      ],
    }));
    setToast("Demo request posted. Your fictional reward is reserved.");
    go("/requests/" + id);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !currentRequest ||
      currentRequest.status !== "ACCEPTED" ||
      !attached ||
      proof.trim().length < 10 ||
      !submissionConsent
    )
      return;
    updateRequest(currentRequest.id, {
      status: "SUBMITTED",
      proof: proof.trim(),
    });
    setToast("Demo proof submitted. No real file was uploaded.");
    go("/moderation/" + currentRequest.id);
  };
  const pay = (r: RequestItem) => {
    if (r.status !== "VERIFIED") return;
    setState((s) => ({
      ...s,
      balance: s.balance + r.reward,
      requests: s.requests.map((x) =>
        x.id === r.id ? { ...x, status: "PAID" } : x,
      ),
      transactions: [
        {
          id: "demo-" + crypto.randomUUID().slice(0, 8),
          label: "Demo request payout",
          amount: r.reward,
          status: "Completed",
          date: new Date().toISOString(),
          requestId: r.id,
        },
        ...s.transactions.filter(
          (t) =>
            !(t.requestId === r.id && t.status === "Reserved" && t.amount > 0),
        ),
      ],
    }));
    setToast("Fictional payout added to your demo wallet.");
  };
  const reset = () => {
    setState({ ...structuredClone(seed), adult: state.adult });
    setToast("Demo reset. Original requests and wallet restored.");
    go("/");
  };
  const RequestCard = ({ r }: { r: RequestItem }) => {
    const p = catalogue.find((p) => p.id === r.productId)!,
      c = creators.find((c) => c.id === r.creatorId)!;
    return (
      <article className="request-card">
        <button
          className="card-art-button"
          onClick={() => go("/requests/" + r.id)}
          aria-label={`View ${money(r.reward)} ${r.category} request`}
        >
          <ProductArt tone={p.tone} />
          <Badge className={`status ${r.status.toLowerCase()}`}>
            <span />
            {r.status}
          </Badge>
          <span className="art-label">
            {p.code} <ArrowUpRight size={16} />
          </span>
        </button>
        <div className="card-content">
          <div className="card-eyebrow">
            {r.category.toUpperCase()} <span>·</span> DEMO APPROVED
          </div>
          <button
            className="card-title"
            onClick={() => go("/requests/" + r.id)}
          >
            {p.line} request
          </button>
          <div className="card-product">
            <ShieldCheck size={13} />
            {p.name} · Catalogue only
          </div>
          <div className="card-bottom">
            <button
              className="mini-creator"
              onClick={() => go("/profile/" + c.id)}
            >
              <span className={`avatar ${c.tone}`}>{c.initials}</span>
              <span>
                {c.name}
                <small>
                  <Star size={10} fill="currentColor" />
                  {c.rating} <BadgeCheck size={11} />
                </small>
              </span>
            </button>
            <div className="card-reward">
              <strong>{money(r.reward)}</strong>
              <small>DEMO REWARD</small>
            </div>
          </div>
        </div>
      </article>
    );
  };
  const Safety = () => (
    <section className="safety-block">
      <div className="safety-heading">
        <ShieldCheck size={22} />
        <h3>Anything? Within reason.</h3>
        <span className="micro">THE NON-NEGOTIABLES</span>
      </div>
      <p>
        No household objects. No sharp objects. No glass not designed for anal
        use. No fire. No pressurised containers. No drugs. No coercion. No
        minors. No exceptions.
      </p>
      <div className="safety-foot">
        <HeartHandshake size={15} /> Adults only. Consent always. An acceptance
        is never an obligation to continue.
      </div>
    </section>
  );
  const PageHead = ({
    kicker,
    title,
    copy,
  }: {
    kicker: string;
    title: string;
    copy: string;
  }) => (
    <div className="page-head">
      <div className="eyebrow">
        <span />
        {kicker}
      </div>
      <h1>
        {title}
        <em>.</em>
      </h1>
      <p>{copy}</p>
    </div>
  );
  let content: ReactNode;
  if (route === "/")
    content = (
      <>
        <section className="hero">
          <div className="hero-top">
            <Badge className="adult-badge">18+ ONLY</Badge>
            <span>THE NAME IS A JOKE. THE BOUNDARIES AREN’T.</span>
            <span className="hero-coordinate">CATALOGUE ONLY ↗</span>
          </div>
          <h1 className="domain">
            <span>illstickanything</span>
            <span>
              upmy
              <span className="domain-accent">
                ass.com<span className="asterisk">✳</span>
              </span>
            </span>
          </h1>
          <div className="hero-bottom">
            <div>
              <h2>
                Within reason<span>.</span>
              </h2>
              <p className="hero-boundary">
                Not literally anything. Adults only. Safe, consensual requests
                using approved products only.
              </p>
              <p className="hero-copy">
                Post a request. Set a reward. A verified adult can accept it,
                complete it, and get paid.
              </p>
              <div className="hero-cta">
                <button
                  className="button primary"
                  onClick={() => go("/browse")}
                >
                  Browse requests <ArrowUpRight size={17} />
                </button>
                <button className="button secondary" onClick={startCreate}>
                  Post a request <Plus size={17} />
                </button>
              </div>
            </div>
            <div className="hero-ticket">
              <div className="ticket-top">
                <span className="ticket-icon">
                  <ShieldCheck size={19} />
                </span>
                <span>
                  GOOD TASTE.
                  <br />
                  BETTER BOUNDARIES.
                </span>
                <ArrowUpRight size={18} />
              </div>
              <div className="ticket-rule" />
              <div className="ticket-row">
                <span>Adults</span>
                <b>Verified*</b>
              </div>
              <div className="ticket-row">
                <span>Products</span>
                <b>Catalogue only</b>
              </div>
              <div className="ticket-row">
                <span>Proof</span>
                <b>Private by design</b>
              </div>
              <small>*Simulated verification in this demo.</small>
            </div>
          </div>
        </section>
        <div className="ticker">
          <span>✳ CONSENT IS THE WHOLE POINT</span>
          <span>✳ APPROVED CATALOGUE ONLY</span>
          <span>✳ PRIVATE PROOF. PUBLIC BOUNDARIES.</span>
          <span>✳ NO PRESSURE. NO EXCEPTIONS.</span>
        </div>
        <section className="feed-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span />
                THE REQUEST BOARD
              </div>
              <h2>
                Good requests. <span>Real boundaries.</span>
              </h2>
              <p>
                Fictional people, fictional payouts. A very real product demo.
              </p>
            </div>
            <button className="text-button" onClick={() => go("/browse")}>
              View all requests <ArrowUpRight size={17} />
            </button>
          </div>
          <div className="request-grid">
            {state.requests.slice(0, 6).map((r) => (
              <RequestCard key={r.id} r={r} />
            ))}
          </div>
        </section>
        <section className="how-section">
          <div>
            <div className="eyebrow">
              <span />
              VERY SIMPLE. VERY CONSIDERED.
            </div>
            <h2>
              Big joke.
              <br />
              Proper process<span>.</span>
            </h2>
            <p>The reward should be clear. The boundaries should be clearer.</p>
          </div>
          <div className="how-steps">
            {[
              {
                n: "01",
                title: "Pick from the catalogue",
                copy: "Choose an approved product category. Set a reward. Add a respectful note.",
              },
              {
                n: "02",
                title: "An adult chooses to accept",
                copy: "Read the brief, agree to the boundaries, or decline. Consent can be withdrawn.",
              },
              {
                n: "03",
                title: "Private proof. Reviewed payout.",
                copy: "Proof goes to a private review. An approved request moves to payout.",
              },
            ].map((x) => (
              <div key={x.n}>
                <span>{x.n}</span>
                <div>
                  <h3>{x.title}</h3>
                  <p>{x.copy}</p>
                </div>
                <ArrowUpRight size={18} />
              </div>
            ))}
          </div>
        </section>
        <Safety />
      </>
    );
  else if (route === "/browse")
    content = (
      <>
        <PageHead
          kicker="THE REQUEST BOARD"
          title="Find your within reason"
          copy="Catalogue-only requests. Clear rewards. Every card is fictional in this demo."
        />
        <div className="browse-tools">
          <label className="search-input">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, category, or creator"
            />
          </label>
          <select
            aria-label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["All categories", "Starter", "Standard", "Premium"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            aria-label="Status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {[
              "All requests",
              "OPEN",
              "ACCEPTED",
              "SUBMITTED",
              "VERIFIED",
              "PAID",
            ].map((c) => (
              <option key={c} value={c}>
                {c === "All requests" ? c : statusText[c as Status]}
              </option>
            ))}
          </select>
        </div>
        <div className="results-line">
          <span>{filtered.length} demo requests</span>
          <span>
            NO PUBLIC MEDIA <LockKeyhole size={12} />
          </span>
        </div>
        {filtered.length ? (
          <div className="request-grid">
            {filtered.map((r) => (
              <RequestCard key={r.id} r={r} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={30} />
            <h3>No requests match.</h3>
            <p>Try another category or clear your search.</p>
            <button
              className="button secondary"
              onClick={() => {
                setSearch("");
                setCategory("All categories");
                setFilter("All requests");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
        <Safety />
      </>
    );
  else if (route === "/create")
    content = (
      <>
        <PageHead
          kicker="MAKE A REQUEST"
          title="Choose. Set. Respect"
          copy="A catalogue choice, a clear reward, and boundaries that aren’t up for negotiation."
        />
        <div className="builder-layout">
          <form className="panel builder" onSubmit={createRequest}>
            <div className="stepper">
              {["Product", "Brief", "Reward", "Review"].map((s, i) => (
                <div className={step >= i + 1 ? "current" : ""} key={s}>
                  <span>{step > i + 1 ? <Check size={13} /> : i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
            {step === 1 ? (
              <>
                <h2>Choose an approved product.</h2>
                <p className="muted">
                  This demo uses a fictional curated catalogue. You can’t add
                  custom objects.
                </p>
                <div className="product-options">
                  {catalogue.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      className={`product-option ${productId === p.id ? "chosen" : ""}`}
                      onClick={() => {
                        setProductId(p.id);
                        setRequestCategory(p.category);
                      }}
                    >
                      <ProductArt tone={p.tone} compact />
                      <span>
                        <strong>{p.name}</strong>
                        <small>
                          {p.line} · {p.category}
                        </small>
                      </span>
                      <span className="option-check">
                        {productId === p.id && <Check size={13} />}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="inline-note">
                  <ShieldCheck size={16} /> Catalogue labels are illustrative.
                  They are not real product safety certification.
                </div>
              </>
            ) : step === 2 ? (
              <>
                <h2>A clear brief. A clear boundary.</h2>
                <label className="field">
                  Permitted category
                  <select
                    value={requestCategory}
                    onChange={(e) =>
                      setRequestCategory(e.target.value as Category)
                    }
                  >
                    <option>{activeProduct.category}</option>
                  </select>
                  <small>The category is fixed by your catalogue choice.</small>
                </label>
                <label className="field">
                  Optional notes
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                    rows={5}
                    placeholder="Keep it respectful. Agree boundaries, timing, and review expectations."
                  />
                  <span className="field-counter">{notes.length}/500</span>
                </label>
                {notesError && (
                  <p className="field-error" role="alert">
                    {notesError}
                  </p>
                )}
                <div className="inline-note">
                  <HeartHandshake size={16} /> No explicit instructions. No
                  custom objects. No pressure to continue.
                </div>
              </>
            ) : step === 3 ? (
              <>
                <h2>Put a number on it.</h2>
                <label className="field">
                  Reward in demo GBP
                  <div className="reward-input">
                    <span>£</span>
                    <input
                      type="number"
                      min="5"
                      max="500"
                      step="1"
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                    />
                  </div>
                  <small>
                    £5–£500. Available demo balance: {money(state.balance)}.
                  </small>
                </label>
                <div className="quick-amounts">
                  {[35, 60, 100].map((n) => (
                    <button
                      type="button"
                      className={Number(reward) === n ? "chosen" : ""}
                      onClick={() => setReward(String(n))}
                      key={n}
                    >
                      {money(n)}
                    </button>
                  ))}
                </div>
                <div className="payment-summary">
                  <div>
                    <span>Request reward</span>
                    <b>{money(Number(reward) || 0)}</b>
                  </div>
                  <div>
                    <span>Demo service fee</span>
                    <b>£0</b>
                  </div>
                  <div>
                    <span>Total reserved</span>
                    <strong>{money(Number(reward) || 0)}</strong>
                  </div>
                </div>
                <div className="inline-note">
                  <Wallet size={16} /> Demo credits only. No crypto is sent,
                  charged, or held.
                </div>
              </>
            ) : (
              <>
                <h2>One last boundary check.</h2>
                <div className="review-summary">
                  <div>
                    <span>Product</span>
                    <b>{activeProduct.name}</b>
                  </div>
                  <div>
                    <span>Category</span>
                    <b>{requestCategory}</b>
                  </div>
                  <div>
                    <span>Reward</span>
                    <b>{money(Number(reward) || 0)} demo GBP</b>
                  </div>
                  <div>
                    <span>Notes</span>
                    <p>{notes || "No additional notes."}</p>
                  </div>
                </div>
                <label className="check-field">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span>
                    I’m 18+, I’ve read the boundaries, and I understand an adult
                    can decline or stop at any time.
                  </span>
                </label>
                <div className="inline-note">
                  <ShieldCheck size={16} /> This creates a fictional request in
                  your browser only.
                </div>
              </>
            )}
            <div className="builder-actions">
              {step > 1 ? (
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setStep(step - 1)}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  className="text-button"
                  onClick={() => go("/browse")}
                >
                  Cancel
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  className="button primary"
                  disabled={
                    (step === 2 && !!notesError) ||
                    (step === 3 &&
                      (!Number.isFinite(Number(reward)) ||
                        Number(reward) < 5 ||
                        Number(reward) > 500 ||
                        Number(reward) > state.balance))
                  }
                  onClick={() => setStep(step + 1)}
                >
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="button primary"
                  disabled={!agreed || !!notesError}
                >
                  Post demo request <ArrowUpRight size={16} />
                </button>
              )}
            </div>
          </form>
          <aside className="builder-aside">
            <span className="eyebrow">YOUR REQUEST PREVIEW</span>
            <ProductArt tone={activeProduct.tone} />
            <h3>{activeProduct.line} request</h3>
            <p>
              {activeProduct.name} · {requestCategory}
            </p>
            <div className="preview-reward">
              {money(Number(reward) || 0)}
              <small>DEMO REWARD</small>
            </div>
            <div className="aside-rule">
              <LockKeyhole size={16} />
              <p>
                Private review.
                <br />
                Public boundaries.
                <br />
                Always consensual.
              </p>
            </div>
          </aside>
        </div>
        <Safety />
      </>
    );
  else if (route.startsWith("/profile/")) {
    const c = creators.find((x) => x.id === route.split("/")[2]) || creators[3];
    const owned = state.requests.filter((r) => r.creatorId === c.id);
    content = (
      <>
        <button className="back-link" onClick={() => go("/browse")}>
          <ChevronLeft size={15} />
          Back to requests
        </button>
        <div className="profile-hero panel">
          <div className={`avatar profile-avatar ${c.tone}`}>{c.initials}</div>
          <div className="profile-intro">
            <Badge className="verified">
              <BadgeCheck size={13} /> VERIFIED ADULT · DEMO
            </Badge>
            <h1>
              {c.name}
              <span>✳</span>
            </h1>
            <p>{c.handle}</p>
            <div>{c.bio}</div>
          </div>
          <div className="profile-stats">
            <div>
              <Star size={17} />
              <strong>{c.rating}</strong>
              <small>CREATOR RATING</small>
            </div>
            <div>
              <CheckCheck size={17} />
              <strong>{c.completed}</strong>
              <small>REQUESTS COMPLETE</small>
            </div>
          </div>
        </div>
        <div className="profile-details">
          <div className="panel">
            <ShieldCheck size={20} />
            <h3>Boundaries first</h3>
            <p>
              Catalogue-only requests. Private evidence. Consent respected
              before, during, and after acceptance.
            </p>
          </div>
          <div className="panel">
            <Star size={20} />
            <h3>{c.reviews} fictional reviews</h3>
            <p>
              “Clear brief. Respectful communication. Exactly how a request
              should work.”
            </p>
            <small>DEMO REVIEW · NOT A REAL ENDORSEMENT</small>
          </div>
        </div>
        <div className="section-heading compact-heading">
          <h2>{c.id === "you" ? "Your requests" : "Requests by " + c.name}</h2>
          <span className="micro">FICTIONAL PROFILE</span>
        </div>
        {owned.length ? (
          <div className="request-grid">
            {owned.map((r) => (
              <RequestCard r={r} key={r.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Plus size={28} />
            <h3>Your first request starts here.</h3>
            <button className="button primary" onClick={startCreate}>
              Post a request <ArrowUpRight size={16} />
            </button>
          </div>
        )}
        <Safety />
      </>
    );
  } else if (route === "/wallet")
    content = (
      <>
        <PageHead
          kicker="THE DEMO WALLET"
          title="The bag, simulated"
          copy="A fictional balance and transaction history. No wallet connection or real funds required."
        />
        <div className="wallet-grid">
          <div className="wallet-main">
            <div>
              <span className="micro">AVAILABLE BALANCE</span>
              <Badge>DEMO GBP</Badge>
            </div>
            <strong>
              {money(state.balance)}
              <span>.00</span>
            </strong>
            <p>Absolutely zero actual money.</p>
            <button
              className="button dark"
              onClick={() => {
                setState((s) => ({
                  ...s,
                  balance: s.balance + 100,
                  transactions: [
                    {
                      id: "demo-" + crypto.randomUUID().slice(0, 8),
                      label: "Demo wallet top-up",
                      amount: 100,
                      status: "Completed",
                      date: new Date().toISOString(),
                    },
                    ...s.transactions,
                  ],
                }));
                setToast("£100 in fictional demo credits added.");
              }}
            >
              <Plus size={16} />
              Add £100 demo credits
            </button>
            <span className="wallet-star">✳</span>
          </div>
          <div className="panel wallet-side">
            <span className="micro">AWAITING COMPLETION OR REVIEW</span>
            <strong>{money(pending)}</strong>
            <p>
              Potential rewards from accepted, submitted, and verified demo
              requests.
            </p>
            <button className="text-button" onClick={() => go("/activity")}>
              View your activity <ArrowUpRight size={15} />
            </button>
            <div className="inline-note">
              <LockKeyhole size={16} /> No real crypto custody or withdrawals.
            </div>
          </div>
        </div>
        <section className="panel transactions">
          <div className="section-heading compact-heading">
            <h2>Transaction history</h2>
            <Badge>FICTIONAL LEDGER</Badge>
          </div>
          <div className="transaction-header">
            <span>TRANSACTION</span>
            <span>DATE</span>
            <span>STATUS</span>
            <span>AMOUNT</span>
          </div>
          {state.transactions.map((t) => (
            <button
              className="transaction-row"
              key={t.id}
              onClick={() =>
                t.requestId
                  ? go("/requests/" + t.requestId)
                  : setToast(
                      "This is a fictional top-up. No blockchain transaction exists.",
                    )
              }
            >
              <span className="tx-name">
                <span className={`tx-icon ${t.amount > 0 ? "incoming" : ""}`}>
                  {t.amount > 0 ? (
                    <ArrowDownLeft size={18} />
                  ) : (
                    <ArrowUpRight size={18} />
                  )}
                </span>
                <span>
                  <strong>{t.label}</strong>
                  <small>{t.id}</small>
                </span>
              </span>
              <span>
                {new Date(t.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <Badge className={t.status === "Completed" ? "verified" : ""}>
                {t.status}
              </Badge>
              <b className={t.amount > 0 ? "positive" : ""}>
                {t.amount > 0 ? "+" : ""}
                {money(t.amount)}
              </b>
            </button>
          ))}
        </section>
      </>
    );
  else if (route === "/activity") {
    const activity = state.requests.filter(
      (r) => r.claimant === "you" || r.creatorId === "you",
    );
    content = (
      <>
        <PageHead
          kicker="YOUR CORNER"
          title="Every request. Every status"
          copy="Follow your demo requests from acceptance through review to a fictional payout."
        />
        <div className="request-grid">
          {activity.map((r) => (
            <RequestCard r={r} key={r.id} />
          ))}
        </div>
        {!activity.length && (
          <div className="empty-state">
            <Clock3 size={30} />
            <h3>Quiet in here.</h3>
            <button className="button primary" onClick={() => go("/browse")}>
              Browse requests
            </button>
          </div>
        )}
      </>
    );
  } else if (route === "/rules")
    content = (
      <>
        <PageHead
          kicker="THE NON-NEGOTIABLES"
          title="The joke has boundaries"
          copy="The name gets your attention. The rules protect everyone."
        />
        <Safety />
        <div className="rules-grid">
          {[
            {
              icon: <BadgeCheck />,
              title: "Adults only",
              copy: "Production would require age and identity verification for every participant. All verification badges in this demo are fictional.",
            },
            {
              icon: <ShieldCheck />,
              title: "A controlled catalogue",
              copy: "The builder accepts only fixed catalogue IDs and their permitted categories. Optional notes cannot introduce prohibited objects.",
            },
            {
              icon: <HeartHandshake />,
              title: "Consent is ongoing",
              copy: "A person can decline a request or withdraw. Rewards never justify pressure, threats, or coercion.",
            },
            {
              icon: <LockKeyhole />,
              title: "Private evidence",
              copy: "The demo contains no explicit media and accepts no file uploads. A real evidence service would need restricted access and retention controls.",
            },
          ].map((x) => (
            <div className="panel" key={x.title}>
              {x.icon}
              <h3>{x.title}</h3>
              <p>{x.copy}</p>
            </div>
          ))}
        </div>
        <div className="demo-disclosure panel">
          <Sparkles size={22} />
          <div>
            <h3>This is a product demo.</h3>
            <p>
              Products, profiles, verification, ratings, balances, requests,
              proof, and payouts are simulated. Catalogue labels do not certify
              a real product. No real sexual activity, files, or funds are
              processed.
            </p>
          </div>
          <button className="button secondary" onClick={reset}>
            Reset demo
          </button>
        </div>
      </>
    );
  else if (currentRequest && route.startsWith("/requests/")) {
    const r = currentRequest,
      p = catalogue.find((x) => x.id === r.productId)!,
      c = creators.find((x) => x.id === r.creatorId)!;
    content = (
      <>
        <button className="back-link" onClick={() => go("/browse")}>
          <ChevronLeft size={15} />
          Back to requests
        </button>
        <div className="detail-grid">
          <div>
            <div className="detail-art">
              <ProductArt tone={p.tone} />
              <Badge className={`status ${r.status.toLowerCase()}`}>
                <span />
                {r.status}
              </Badge>
              <span className="detail-art-label">
                NO PUBLIC MEDIA. JUST THE BRIEF.
              </span>
            </div>
            <div className="panel detail-brief">
              <div className="eyebrow">THE BRIEF</div>
              <h2>{p.line} request</h2>
              <p>{r.notes}</p>
              <div className="detail-specs">
                <div>
                  <span>Approved product</span>
                  <strong>{p.name}</strong>
                </div>
                <div>
                  <span>Permitted category</span>
                  <strong>{r.category}</strong>
                </div>
                <div>
                  <span>Proof visibility</span>
                  <strong>Private review</strong>
                </div>
              </div>
              <div className="inline-note">
                <ShieldCheck size={16} /> Fictional catalogue item. No activity
                instructions or real safety certification.
              </div>
            </div>
          </div>
          <aside className="detail-aside panel">
            <div className="eyebrow">THE REWARD</div>
            <div className="big-reward">
              {money(r.reward)}
              <small>DEMO GBP</small>
            </div>
            <div className="reward-meta">
              <ShieldCheck size={14} />
              Simulated reward reservation
            </div>
            <button
              className="creator-block"
              onClick={() => go("/profile/" + c.id)}
            >
              <span className={`avatar ${c.tone}`}>{c.initials}</span>
              <span>
                <strong>
                  {c.name} <BadgeCheck size={14} />
                </strong>
                <small>{c.handle}</small>
              </span>
              <span className="creator-rating">
                <Star size={12} fill="currentColor" />
                {c.rating}
              </span>
            </button>
            <div className="detail-boundary">
              <HeartHandshake size={18} />
              <p>
                You choose. You can decline. You can stop. No reward changes
                that.
              </p>
            </div>
            {r.status === "OPEN" && r.creatorId !== "you" ? (
              <>
                <button
                  className="button primary wide"
                  onClick={() => accept(r)}
                >
                  Accept demo request <ArrowUpRight size={16} />
                </button>
                <button
                  className="button secondary wide"
                  onClick={() => decline(r)}
                >
                  Decline request
                </button>
              </>
            ) : r.status === "ACCEPTED" && r.claimant === "you" ? (
              <>
                <button
                  className="button primary wide"
                  onClick={() => {
                    setProof("");
                    setAttached(false);
                    setSubmissionConsent(false);
                    go("/submission/" + r.id);
                  }}
                >
                  Submit demo proof <ArrowUpRight size={16} />
                </button>
                <button
                  className="text-button centered"
                  onClick={() => withdraw(r)}
                >
                  Withdraw acceptance
                </button>
              </>
            ) : ["SUBMITTED", "VERIFIED", "PAID"].includes(r.status) ? (
              <button
                className="button primary wide"
                onClick={() => go("/moderation/" + r.id)}
              >
                View review status <ArrowUpRight size={16} />
              </button>
            ) : (
              <div className="inline-note">
                <Clock3 size={16} />
                {r.creatorId === "you"
                  ? "Your request is waiting for a demo acceptance."
                  : "This request was declined."}
              </div>
            )}
            <p className="action-footnote">
              All actions are simulated. No real activity or payment is
              requested.
            </p>
            <button
              className="report-button"
              onClick={() => {
                updateRequest(r.id, { flagged: true });
                setToast("Demo concern flagged in this browser.");
              }}
              disabled={r.flagged}
            >
              <Flag size={12} />{" "}
              {r.flagged ? "Concern flagged" : "Flag a concern"}
            </button>
          </aside>
        </div>
        <Safety />
      </>
    );
  } else if (currentRequest && route.startsWith("/submission/")) {
    const r = currentRequest;
    content = (
      <>
        <button className="back-link" onClick={() => go("/requests/" + r.id)}>
          <ChevronLeft size={15} />
          Back to request
        </button>
        <PageHead
          kicker="PRIVATE PROOF"
          title="Ready for a review"
          copy="Simulate a submission. This demo never accepts or stores real media."
        />
        {r.status === "ACCEPTED" && r.claimant === "you" ? (
          <div className="submission-grid">
            <form className="panel submission-form" onSubmit={submit}>
              <div className="proof-drop">
                <span>
                  <LockKeyhole size={27} />
                </span>
                <h3>
                  {attached
                    ? "Demo proof attached."
                    : "Keep it private. Keep it simulated."}
                </h3>
                <p>
                  {attached
                    ? "One fictional evidence placeholder. No actual file."
                    : "Add a placeholder to demonstrate the private evidence flow."}
                </p>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setAttached(!attached)}
                >
                  {attached ? <X size={14} /> : <Plus size={14} />}{" "}
                  {attached ? "Remove placeholder" : "Attach demo proof"}
                </button>
                <small>REAL FILE UPLOADS ARE DISABLED</small>
              </div>
              <label className="field">
                Submission note
                <textarea
                  value={proof}
                  onChange={(e) => setProof(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="A non-explicit demo note for the reviewer…"
                />
                <small>10–500 characters. No explicit descriptions.</small>
              </label>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={submissionConsent}
                  onChange={(e) => setSubmissionConsent(e.target.checked)}
                />
                <span>
                  I understand this is a simulated submission and contains no
                  real personal media.
                </span>
              </label>
              <button
                className="button primary wide"
                type="submit"
                disabled={
                  !attached || proof.trim().length < 10 || !submissionConsent
                }
              >
                Submit for demo review <ArrowUpRight size={16} />
              </button>
            </form>
            <aside className="panel submission-aside">
              <FileCheck2 size={25} />
              <h3>What happens next?</h3>
              <ol>
                <li>Placeholder received privately.</li>
                <li>Request moves to “Submitted”.</li>
                <li>Simulate a moderator approval.</li>
                <li>Release a fictional payout.</li>
              </ol>
              <div className="aside-reward">
                {money(r.reward)}
                <span>DEMO REWARD</span>
              </div>
              <p>
                In production, only authorised reviewers would have access to
                evidence.
              </p>
            </aside>
          </div>
        ) : (
          <div className="empty-state">
            <LockKeyhole size={30} />
            <h3>This request isn’t ready for submission.</h3>
            <button
              className="button primary"
              onClick={() => go("/requests/" + r.id)}
            >
              View request
            </button>
          </div>
        )}
      </>
    );
  } else if (currentRequest && route.startsWith("/moderation/")) {
    const r = currentRequest,
      stage = ["OPEN", "ACCEPTED", "SUBMITTED", "VERIFIED", "PAID"].indexOf(
        r.status,
      );
    content = (
      <>
        <button className="back-link" onClick={() => go("/requests/" + r.id)}>
          <ChevronLeft size={15} />
          Back to request
        </button>
        <PageHead
          kicker="MODERATION & PAYOUT"
          title={
            r.status === "PAID"
              ? "The demo bag is secured"
              : r.status === "VERIFIED"
                ? "Proof approved"
                : "A proper review process"
          }
          copy="Follow the simulated journey. Review decisions and payouts below are fictional."
        />
        <div className="moderation-grid">
          <div className="panel review-timeline">
            {[
              {
                status: "ACCEPTED",
                title: "Request accepted",
                copy: "The adult agreed to the brief and boundaries.",
                icon: <HeartHandshake size={19} />,
              },
              {
                status: "SUBMITTED",
                title: "Private proof submitted",
                copy: "A demo placeholder entered the review queue.",
                icon: <LockKeyhole size={19} />,
              },
              {
                status: "VERIFIED",
                title: "Moderator verified",
                copy: "The fictional submission matches the demo brief.",
                icon: <BadgeCheck size={19} />,
              },
              {
                status: "PAID",
                title: "Reward paid",
                copy: "Demo credits were added to the fictional wallet.",
                icon: <Wallet size={19} />,
              },
            ].map((x, i) => (
              <div
                className={`timeline-step ${stage >= i + 1 ? "done" : ""}`}
                key={x.status}
              >
                <span className="timeline-icon">
                  {stage >= i + 1 ? <Check size={18} /> : x.icon}
                </span>
                <div>
                  <h3>{x.title}</h3>
                  <p>{x.copy}</p>
                </div>
                <Badge>{stage >= i + 1 ? "DONE" : "PENDING"}</Badge>
              </div>
            ))}
          </div>
          <aside className="panel moderation-aside">
            <Badge className={`status static ${r.status.toLowerCase()}`}>
              <span />
              {r.status}
            </Badge>
            <div className="big-reward">
              {money(r.reward)}
              <small>DEMO REWARD</small>
            </div>
            <div className="review-note">
              <span className="micro">PRIVATE DEMO SUBMISSION</span>
              <p>{r.proof || "No demo submission yet."}</p>
              <span>
                <LockKeyhole size={12} />
                No actual file is stored.
              </span>
            </div>
            {r.status === "SUBMITTED" ? (
              <>
                <button
                  className="button primary wide"
                  onClick={() => {
                    updateRequest(r.id, { status: "VERIFIED" });
                    setToast(
                      "Moderator approval simulated. Ready for a demo payout.",
                    );
                  }}
                >
                  Simulate approval <BadgeCheck size={16} />
                </button>
                <button
                  className="text-button centered"
                  onClick={() => {
                    updateRequest(r.id, {
                      status: "ACCEPTED",
                      proof: undefined,
                    });
                    setToast("Demo review returned for a new submission.");
                  }}
                >
                  Return for resubmission
                </button>
              </>
            ) : r.status === "VERIFIED" ? (
              <button className="button primary wide" onClick={() => pay(r)}>
                Release demo payout <ArrowUpRight size={16} />
              </button>
            ) : r.status === "PAID" ? (
              <button
                className="button primary wide"
                onClick={() => go("/wallet")}
              >
                View demo wallet <ArrowUpRight size={16} />
              </button>
            ) : (
              <button
                className="button secondary wide"
                onClick={() => go("/requests/" + r.id)}
              >
                View request
              </button>
            )}
            <p className="action-footnote">
              You control every stage for demonstration purposes. No real
              moderation or funds.
            </p>
          </aside>
        </div>
      </>
    );
  } else
    content = (
      <div className="empty-state">
        <h1>That request wandered off.</h1>
        <p>It may have been removed when the demo was reset.</p>
        <button className="button primary" onClick={() => go("/browse")}>
          Back to the board
        </button>
      </div>
    );
  return (
    <div className="app">
      <div className="demo-strip">
        <span className="demo-dot" /> INTERACTIVE DEMO{" "}
        <span className="strip-divider">/</span> FICTIONAL REQUESTS & PAYOUTS{" "}
        <button onClick={() => go("/rules")}>
          See the boundaries <ArrowUpRight size={11} />
        </button>
      </div>
      <header className="header">
        <button className="brand" onClick={() => go("/")} aria-label="Home">
          <span className="brand-icon">✳</span>
          <span>
            anything<span className="brand-dot">.</span>
            <small>WITHIN REASON</small>
          </span>
        </button>
        <nav className={mobile ? "nav mobile-open" : "nav"}>
          <button
            className={route === "/browse" ? "active" : ""}
            onClick={() => go("/browse")}
          >
            Browse requests
          </button>
          <button
            className={route === "/activity" ? "active" : ""}
            onClick={() => go("/activity")}
          >
            My activity
          </button>
          <button
            className={route === "/rules" ? "active" : ""}
            onClick={() => go("/rules")}
          >
            The boundaries <ArrowUpRight size={11} />
          </button>
        </nav>
        <div className="header-actions">
          <button className="header-wallet" onClick={() => go("/wallet")}>
            <Wallet size={16} />
            <span>
              {money(state.balance)}
              <small>DEMO</small>
            </span>
          </button>
          <button
            className="header-profile"
            onClick={() => go("/profile/you")}
            aria-label="Your demo profile"
          >
            YO
            <BadgeCheck size={12} />
          </button>
          <button
            className="menu-button"
            onClick={() => setMobile(!mobile)}
            aria-label="Toggle navigation"
          >
            <Menu size={21} />
          </button>
        </div>
      </header>
      <main className={route === "/" ? "shell" : "shell inner-page"}>
        {content}
      </main>
      <footer className="footer shell">
        <div className="footer-top">
          <div>
            <span className="footer-brand">
              illstickanythingupmyass.com<span>✳</span>
            </span>
            <p>Within reason. Always.</p>
          </div>
          <button className="text-button" onClick={startCreate}>
            Make a demo request <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="footer-bottom">
          <span>© 2026 · 18+ PRODUCT DEMO · NO EXPLICIT PUBLIC MEDIA</span>
          <div>
            <button onClick={() => go("/rules")}>
              Boundaries & demo privacy
            </button>
            <a
              href="https://github.com/0riceisnice0-hash/Project-Paul"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
      </footer>
      {toast && (
        <div className="toast" role="status">
          <CircleCheck size={17} />
          <span>{toast}</span>
          <button onClick={() => setToast("")} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}
      {gate && (
        <div className="modal-scrim">
          <section
            className="age-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="age-title"
          >
            <button
              className="modal-close"
              onClick={() => setGate(null)}
              aria-label="Close"
            >
              <X size={19} />
            </button>
            <span className="age-symbol">
              18<span>+</span>
            </span>
            <div className="eyebrow">ADULTS. BOUNDARIES. CONSENT.</div>
            <h2 id="age-title">
              Grown-ups only<span>.</span>
            </h2>
            <p>
              This is a non-explicit product demo for adults. Real age
              verification would be required before a production launch.
            </p>
            <label className="check-field">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                I’m at least 18 and understand every request, verification
                badge, and payout here is simulated.
              </span>
            </label>
            <button
              className="button primary wide"
              disabled={!consent}
              onClick={() => {
                setState((s) => ({ ...s, adult: true }));
                const next = gate;
                setGate(null);
                next();
              }}
            >
              Enter the demo <ArrowRight size={17} />
            </button>
            <button
              className="text-button centered"
              onClick={() => {
                setGate(null);
                go("/rules");
              }}
            >
              Read the boundaries first
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
