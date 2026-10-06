import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  BadgeCheck,
  Bell,
  Bookmark,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  FileCheck2,
  Flag,
  Heart,
  Home,
  ListVideo,
  LockKeyhole,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  ThumbsUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { catalogue, creators, money, type RequestItem } from "./data";
import {
  requestTemplates,
  videoCategories,
  getRequestVideos,
  type DemoVideo,
} from "./videos";

type VideoState = {
  saved: string[];
  liked: string[];
  following: string[];
  history: string[];
  comments: Record<string, string[]>;
};
const initialLibrary: VideoState = {
  saved: ["v-5"],
  liked: [],
  following: ["milo", "rae"],
  history: [],
  comments: {},
};
export function useVideoLibrary() {
  const [data, setData] = useState<VideoState>(() => {
    try {
      const s = JSON.parse(
        localStorage.getItem("paul-video-library-v1") || "null",
      );
      if (
        s &&
        ["saved", "liked", "following", "history"].every((k) =>
          Array.isArray(s[k]),
        ) &&
        s.comments
      )
        return s;
    } catch {}
    return structuredClone(initialLibrary);
  });
  useEffect(() => {
    try {
      localStorage.setItem("paul-video-library-v1", JSON.stringify(data));
    } catch {}
  }, [data]);
  const toggle = (field: "saved" | "liked" | "following", id: string) =>
    setData((s) => ({
      ...s,
      [field]: s[field].includes(id)
        ? s[field].filter((x) => x !== id)
        : [id, ...s[field]],
    }));
  const record = (id: string) =>
    setData((s) => ({
      ...s,
      history: [id, ...s.history.filter((x) => x !== id)],
    }));
  const comment = (id: string, value: string) =>
    setData((s) => ({
      ...s,
      comments: { ...s.comments, [id]: [value, ...(s.comments[id] || [])] },
    }));
  return { data, toggle, record, comment };
}
export type Library = ReturnType<typeof useVideoLibrary>;
type Navigation = (path: string) => void;

export function PlatformShell({
  children,
  route,
  go,
  balance,
  onRequest,
  query,
  setQuery,
  library,
}: {
  children: ReactNode;
  route: string;
  go: Navigation;
  balance: number;
  onRequest: () => void;
  query: string;
  setQuery: (value: string) => void;
  library: Library;
}) {
  const [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false);
  const navigate = (path: string) => {
    setMobile(false);
    go(path);
  };
  const links = [
    { path: "/", text: "Home", icon: Home },
    { path: "/browse", text: "Requests", icon: FileCheck2 },
    { path: "/following", text: "Following", icon: Users },
    { path: "/saved", text: "Saved videos", icon: Bookmark },
  ];
  const personal = [
    { path: "/history", text: "History", icon: Clock3 },
    { path: "/activity", text: "My requests", icon: ListVideo },
    { path: "/wallet", text: "Demo wallet", icon: Wallet },
    { path: "/profile/you", text: "Your channel", icon: Camera },
  ];
  return (
    <div className={`video-platform ${collapsed ? "sidebar-collapsed" : ""}`}>
      <header className="platform-header">
        <div className="header-left">
          <button
            className="icon-button"
            aria-label="Toggle sidebar"
            onClick={() => {
              if (innerWidth < 1000) setMobile(!mobile);
              else setCollapsed(!collapsed);
            }}
          >
            <Menu size={21} />
          </button>
          <button
            className="platform-brand"
            onClick={() => navigate("/")}
            aria-label="Home"
          >
            <span>
              <Play size={17} fill="currentColor" />
            </span>
            <b>
              <span className="domain-first">illstickanything</span>
              <span className="domain-last">upmyass.com</span>
            </b>
            <small>18+</small>
          </button>
        </div>
        <form
          className="platform-search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/search");
          }}
        >
          <input
            aria-label="Search videos"
            placeholder="Search videos and creators"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
            >
              <X size={16} />
            </button>
          )}
          <button type="submit" aria-label="Search">
            <Search size={19} />
          </button>
        </form>
        <div className="platform-header-right">
          <button className="header-create" onClick={onRequest}>
            <Plus size={19} />
            <span>Create request</span>
          </button>
          <button
            className="platform-balance"
            onClick={() => navigate("/wallet")}
          >
            <Wallet size={16} />
            <b>{money(balance)}</b>
            <small>DEMO</small>
          </button>
          <button
            className="channel-avatar lime"
            aria-label="Your channel"
            onClick={() => navigate("/profile/you")}
          >
            Y
          </button>
        </div>
      </header>
      {mobile && (
        <button
          className="sidebar-scrim"
          onClick={() => setMobile(false)}
          aria-label="Close navigation"
        />
      )}
      <aside className={`platform-sidebar ${mobile ? "sidebar-open" : ""}`}>
        <div className="sidebar-section">
          {links.map((x) => (
            <button
              key={x.path}
              title={x.text}
              className={route === x.path ? "selected" : ""}
              onClick={() => navigate(x.path)}
            >
              <x.icon size={19} />
              <span>{x.text}</span>
            </button>
          ))}
        </div>
        <div className="sidebar-section">
          <h3>Your corner</h3>
          {personal.map((x) => (
            <button
              key={x.path}
              title={x.text}
              className={route === x.path ? "selected" : ""}
              onClick={() => navigate(x.path)}
            >
              <x.icon size={19} />
              <span>{x.text}</span>
            </button>
          ))}
        </div>
        <div className="sidebar-section subscription-section">
          <h3>Following</h3>
          {creators
            .filter((c) => library.data.following.includes(c.id))
            .map((c) => (
              <button key={c.id} onClick={() => navigate("/profile/" + c.id)}>
                <span className={`channel-avatar ${c.tone}`}>
                  {c.initials.slice(0, 1)}
                </span>
                <span>{c.name}</span>
                <span className="subscription-dot" />
              </button>
            ))}
          {!library.data.following.length && <p>No channels followed yet.</p>}
        </div>
        <div className="sidebar-section">
          <button
            className={route === "/rules" ? "selected" : ""}
            title="Guidelines"
            onClick={() => navigate("/rules")}
          >
            <ShieldCheck size={19} />
            <span>Guidelines</span>
          </button>
        </div>
        <div className="sidebar-footer">
          <p>illstickanythingupmyass.com</p>
          <span>Within reason. Always.</span>
          <p>
            Non-explicit demo.
            <br />
            Fictional creators & rewards.
          </p>
          <a
            href="https://github.com/0riceisnice0-hash/Project-Paul"
            target="_blank"
            rel="noreferrer"
          >
            Source on GitHub
          </a>
          <span className="copyright">© 2026 illstickanythingupmyass.com</span>
        </div>
      </aside>
      <main className="platform-main">
        <div className="platform-demo-note">
          <span className="demo-live-dot" />
          Demo mode
          <span>
            Adult catalogue requests · Private submissions · Demo credits
          </span>
          <button onClick={() => go("/rules")}>
            18+ & guidelines <ChevronRight size={12} />
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}

export function VideoCard({
  video,
  go,
  compact = false,
}: {
  video: DemoVideo;
  go: Navigation;
  compact?: boolean;
}) {
  const creator = creators.find((c) => c.id === video.creatorId)!;
  return (
    <article className={`video-card ${compact ? "related-video" : ""}`}>
      <button
        className={`video-thumbnail catalogue-thumbnail ${catalogue.find((p) => p.id === video.productId)?.tone}`}
        onClick={() => go("/watch/" + video.id)}
        aria-label={`Watch ${video.title}`}
      >
        <span className="catalogue-thumb-code">
          {catalogue.find((p) => p.id === video.productId)?.code} · 18+
        </span>
        <span className="catalogue-thumb-lock">
          <LockKeyhole size={23} />
        </span>
        <span className="catalogue-thumb-name">{video.category}</span>
        <span className="catalogue-thumb-reward">
          {money(video.reward)}
          <small>DEMO REWARD</small>
        </span>
        <span className="thumbnail-sample">PRIVATE VIDEO · DEMO</span>
        <span
          className={`video-duration submission-status ${video.status.toLowerCase()}`}
        >
          {video.status}
        </span>
        <span className="thumbnail-hover">
          <Play size={25} fill="currentColor" />
        </span>
      </button>
      <div className="video-info">
        {!compact && (
          <button
            className={`channel-avatar ${creator.tone}`}
            onClick={() => go("/profile/" + creator.id)}
            aria-label={`View ${creator.name}'s channel`}
          >
            {creator.initials.slice(0, 1)}
          </button>
        )}
        <div>
          <button
            className="video-title"
            onClick={() => go("/watch/" + video.id)}
          >
            {video.title}
          </button>
          <button
            className="video-channel"
            onClick={() => go("/profile/" + creator.id)}
          >
            {creator.name}
            <BadgeCheck size={12} />
          </button>
          <p>
            Requester & reviewers only <span>·</span> {video.published}
          </p>
        </div>
      </div>
    </article>
  );
}

export function VideoFeed({
  route,
  query,
  go,
  library,
  requests,
}: {
  route: string;
  query: string;
  go: Navigation;
  library: Library;
  requests: RequestItem[];
}) {
  const [category, setCategory] = useState("All");
  const requestVideos = getRequestVideos(requests);
  let list = requestVideos;
  if (route === "/following")
    list = list.filter((v) => library.data.following.includes(v.creatorId));
  if (route === "/saved")
    list = list.filter((v) => library.data.saved.includes(v.id));
  if (route === "/history")
    list = library.data.history
      .map((id) => requestVideos.find((v) => v.id === id)!)
      .filter(Boolean);
  if (route === "/search" && query.trim())
    list = list.filter((v) =>
      `${v.title} ${v.category} ${creators.find((c) => c.id === v.creatorId)?.name}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    );
  if (category !== "All") list = list.filter((v) => v.category === category);
  const title =
    route === "/following"
      ? "From channels you follow"
      : route === "/saved"
        ? "Saved videos"
        : route === "/history"
          ? "Watch history"
          : route === "/search"
            ? query.trim()
              ? `Search results for “${query}”`
              : "Search the video library"
            : "";
  return (
    <section className="video-feed">
      {route === "/" && (
        <div className="adult-feed-heading">
          <div>
            <h1>illstickanythingupmyass.com</h1>
            <p>
              Within reason. Consensual adult anal-play requests. Approved toys
              only.
            </p>
          </div>
          <button onClick={() => go("/browse")}>
            <FileCheck2 size={17} /> Open requests <ChevronRight size={16} />
          </button>
          <span>
            Online only · Adults record themselves · Submissions stay private
          </span>
        </div>
      )}
      <div className="feed-chips">
        {videoCategories.map((x) => (
          <button
            className={category === x ? "active" : ""}
            key={x}
            onClick={() => setCategory(x)}
          >
            {x}
          </button>
        ))}
      </div>
      {title && (
        <div className="video-page-title">
          <h1>{title}</h1>
          <span>{list.length} demo submissions</span>
        </div>
      )}
      <div className="video-grid">
        {list.map((v) => (
          <VideoCard key={v.id} video={v} go={go} />
        ))}
      </div>
      {!list.length && (
        <div className="video-empty">
          <ListVideo size={32} />
          <h2>
            {route === "/history"
              ? "Your watch history starts here."
              : "Nothing here yet."}
          </h2>
          <p>
            {route === "/saved"
              ? "Save a video from its watch page."
              : route === "/following"
                ? "Follow a creator to see their videos here."
                : "Try another filter or browse the home feed."}
          </p>
          <button
            onClick={() => {
              setCategory("All");
              go("/");
            }}
          >
            Browse videos
          </button>
        </div>
      )}
      <div className="feed-end">
        <ShieldCheck size={14} />
        No public intimate media. Adult consent, a fixed catalogue, and private
        review.
      </div>
    </section>
  );
}

export function TemplateChoices({
  selected,
  onChoose,
}: {
  selected?: string;
  onChoose: (id: string) => void;
}) {
  return (
    <div className="template-options">
      {requestTemplates.map((t) => (
        <button
          type="button"
          key={t.id}
          onClick={() => onChoose(t.id)}
          className={selected === t.id ? "chosen" : ""}
        >
          <span className="template-icon">
            {t.icon === "question" ? (
              <MessageCircle size={19} />
            ) : t.icon === "tour" ? (
              <Camera size={19} />
            ) : (
              <FileCheck2 size={19} />
            )}
          </span>
          <span>
            <strong>{t.title}</strong>
            <small>
              {catalogue.find((c) => c.id === t.productId)?.name} · {t.category}
            </small>
          </span>
          <b>{money(t.reward)}</b>
          {selected === t.id && <Check size={15} />}
        </button>
      ))}
    </div>
  );
}
export function RequestTemplates({
  onChoose,
}: {
  onChoose: (id: string) => void;
}) {
  return (
    <section className="predefined-section">
      <div>
        <h2>Start with a predefined request</h2>
        <p>
          Pick a catalogue toy. Agree boundaries. The accepting adult records
          their own private submission.
        </p>
      </div>
      <TemplateChoices onChoose={onChoose} />
    </section>
  );
}

export function WatchPage({
  id,
  go,
  library,
  onRequest,
  notify,
  requests,
}: {
  id: string;
  go: Navigation;
  library: Library;
  onRequest: (id: string) => void;
  notify: (message: string) => void;
  requests: RequestItem[];
}) {
  const requestVideos = getRequestVideos(requests);
  const video = requestVideos.find((v) => v.id === id);
  const [started, setStarted] = useState(false),
    [comment, setComment] = useState(""),
    [reported, setReported] = useState(false);
  useEffect(() => {
    setStarted(false);
    setComment("");
    setReported(false);
  }, [id]);
  if (!video)
    return (
      <div className="video-empty">
        <h2>That video isn’t in the demo library.</h2>
        <button onClick={() => go("/")}>Browse videos</button>
      </div>
    );
  const c = creators.find((c) => c.id === video.creatorId)!,
    hasSubmission = ["SUBMITTED", "VERIFIED", "PAID"].includes(video.status),
    following = library.data.following.includes(c.id),
    saved = library.data.saved.includes(id),
    liked = library.data.liked.includes(id);
  const openSubmission = () => {
    setStarted(true);
    library.record(id);
  };
  const addComment = (e: FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 2) return;
    library.comment(id, comment.trim());
    setComment("");
    notify("Demo comment saved in this browser.");
  };
  return (
    <div className="watch-layout">
      <section className="watch-column">
        <div className={`video-player private-submission-player ${c.tone}`}>
          <span className="private-player-label">
            <LockKeyhole size={14} /> PRIVATE SUBMISSION · DEMO
          </span>
          {started ? (
            <div className="submission-record">
              <ShieldCheck size={38} />
              <h2>{video.category}</h2>
              <p>
                {hasSubmission
                  ? "Self-recorded adult submission"
                  : "Private request record · no submission yet"}
              </p>
              <div>
                <span>Request</span>
                <b>{video.requestId}</b>
              </div>
              <div>
                <span>Reward</span>
                <b>{money(video.reward)} demo GBP</b>
              </div>
              <div>
                <span>Status</span>
                <b>{video.status}</b>
              </div>
              <small>
                Interface placeholder only. No recording exists or is shown.
              </small>
              <button onClick={() => go("/requests/" + video.requestId)}>
                View request & consent terms <ChevronRight size={15} />
              </button>
            </div>
          ) : (
            <div className="private-player-intro">
              <LockKeyhole size={42} />
              <h2>{video.category}</h2>
              <p>
                {hasSubmission
                  ? "Private recording. Controlled access."
                  : "Awaiting a private adult submission."}
              </p>
              <button onClick={openSubmission}>
                <Play size={17} />{" "}
                {hasSubmission ? "Open demo submission" : "Open request record"}
              </button>
              <small>
                This opens a record placeholder, not intimate footage.
              </small>
            </div>
          )}
        </div>
        <div className="sample-caption">
          Private by design: self-recorded by the accepting adult, shared only
          for agreed review. All records here are fictional.
        </div>
        <h1 className="watch-title">{video.title}</h1>
        <div className="watch-actions">
          <button
            className="watch-creator"
            onClick={() => go("/profile/" + c.id)}
          >
            <span className={`channel-avatar ${c.tone}`}>
              {c.initials.slice(0, 1)}
            </span>
            <span>
              <b>
                {c.name}
                <BadgeCheck size={13} />
              </b>
              <small>{c.completed * 87} demo followers</small>
            </span>
          </button>
          <button
            className={`follow-button ${following ? "is-following" : ""}`}
            onClick={() => library.toggle("following", c.id)}
          >
            {following ? (
              <>
                <Check size={15} />
                Following
              </>
            ) : (
              "Follow"
            )}
          </button>
          <div className="watch-social">
            <button
              className={liked ? "selected" : ""}
              onClick={() => library.toggle("liked", id)}
              aria-pressed={liked}
            >
              <ThumbsUp size={16} />
              {liked ? "Liked" : "Like"}
            </button>
            <button
              className={saved ? "selected" : ""}
              onClick={() => library.toggle("saved", id)}
              aria-pressed={saved}
            >
              <Bookmark size={16} />
              {saved ? "Saved" : "Save"}
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(location.href);
                  notify(
                    "Listing link copied. Private media is never included.",
                  );
                } catch {
                  notify("Copy the link from your address bar.");
                }
              }}
            >
              <Share2 size={16} />
              Share listing
            </button>
          </div>
        </div>
        <div className="watch-description">
          <b>
            {money(video.reward)} demo reward · {video.status} ·{" "}
            {video.published}
          </b>
          <p>{video.description}</p>
          <button onClick={() => go("/rules")}>
            Catalogue only. Consent always. Read the guidelines.
          </button>
        </div>
        <div className="comments-section">
          <h2>
            {(library.data.comments[id]?.length || 0) + 2} demo discussion notes
          </h2>
          <form onSubmit={addComment}>
            <span className="channel-avatar lime">Y</span>
            <input
              aria-label="Demo comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={300}
              placeholder="Add a non-explicit demo comment…"
            />
            <button disabled={comment.trim().length < 2}>Comment</button>
          </form>
          {[
            ...(library.data.comments[id] || []),
            "The clear boundaries are appreciated.",
            "Private review only. No permission to repost the recording.",
          ].map((text, index) => (
            <div className="comment-row" key={index}>
              <span
                className={`channel-avatar ${index % 2 ? "pink" : "purple"}`}
              >
                {index < (library.data.comments[id]?.length || 0) ? "Y" : "D"}
              </span>
              <div>
                <b>
                  {index < (library.data.comments[id]?.length || 0)
                    ? "You"
                    : "Demo viewer"}
                  <small> · Fictional comment</small>
                </b>
                <p>{text}</p>
              </div>
            </div>
          ))}
          <button
            className="watch-report"
            disabled={reported}
            onClick={() => {
              setReported(true);
              notify("Demo concern flagged for this session.");
            }}
          >
            <Flag size={13} />
            {reported ? "Concern flagged" : "Flag a concern"}
          </button>
        </div>
      </section>
      <aside className="watch-right">
        <div className="watch-request-panel">
          <span className="request-panel-label">
            <FileCheck2 size={15} />
            REQUEST AN APPROVED TOY
          </span>
          <h2>Got a request?</h2>
          <p>
            Adults only. Choose a fixed catalogue item. The accepting adult
            decides their boundaries and records themselves.
          </p>
          <TemplateChoices onChoose={onRequest} />
          <small>Rewards are demo credits. Creators can decline or stop.</small>
        </div>
        <h3 className="up-next">More from the community</h3>
        {requestVideos
          .filter((v) => v.id !== id)
          .slice(0, 5)
          .map((v) => (
            <VideoCard key={v.id} video={v} go={go} compact />
          ))}
      </aside>
    </div>
  );
}

export function ChannelPage({
  id,
  go,
  library,
  onRequest,
  requests,
}: {
  id: string;
  go: Navigation;
  library: Library;
  onRequest: () => void;
  requests: RequestItem[];
}) {
  const [tab, setTab] = useState("Videos"),
    c = creators.find((c) => c.id === id) || creators[3],
    list = getRequestVideos(requests).filter((v) => v.creatorId === c.id),
    following = library.data.following.includes(c.id);
  useEffect(() => setTab("Videos"), [id]);
  return (
    <section className="channel-page">
      <div className={`channel-banner ${c.tone}`}>
        <span>
          {c.id === "you"
            ? "YOUR CORNER. YOUR RULES."
            : "WITHIN REASON. ALWAYS."}
        </span>
        <small>FICTIONAL DEMO CHANNEL</small>
      </div>
      <div className="channel-heading">
        <span className={`channel-avatar ${c.tone}`}>
          {c.initials.slice(0, 1)}
        </span>
        <div>
          <h1>
            {c.name}
            <BadgeCheck size={19} />
          </h1>
          <p>
            {c.handle} · {c.completed * 87} demo followers · {list.length}{" "}
            videos
          </p>
          <p>{c.bio}</p>
          <small>Profile and verification are simulated.</small>
        </div>
        {c.id === "you" ? (
          <button className="follow-button" onClick={onRequest}>
            Create request
          </button>
        ) : (
          <button
            className={`follow-button ${following ? "is-following" : ""}`}
            onClick={() => library.toggle("following", c.id)}
          >
            {following ? "Following" : "Follow"}
          </button>
        )}
      </div>
      <div className="channel-tabs">
        {["Videos", "Requests", "About"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Videos" ? (
        list.length ? (
          <div className="video-grid">
            {list.map((v) => (
              <VideoCard key={v.id} video={v} go={go} />
            ))}
          </div>
        ) : (
          <div className="video-empty">
            <Camera size={30} />
            <h2>Your demo channel is ready.</h2>
            <p>Real video uploads are disabled in this release.</p>
            <button onClick={() => go("/activity")}>View your requests</button>
          </div>
        )
      ) : tab === "Requests" ? (
        <div className="channel-about">
          <h2>Catalogue-only requests</h2>
          <p>
            Browse the community request board, or choose a predefined brief to
            create your own demo request.
          </p>
          <button
            className="button primary"
            onClick={() => go(c.id === "you" ? "/activity" : "/browse")}
          >
            View requests
          </button>
        </div>
      ) : (
        <div className="channel-about">
          <h2>About {c.name}</h2>
          <p>{c.bio}</p>
          <p>
            Adult catalogue requests and private submission records are
            fictional. The demo shows no personal recordings and grants no
            permission to repost creator media.
          </p>
          <button className="text-button" onClick={() => go("/rules")}>
            Read the community guidelines
          </button>
        </div>
      )}
    </section>
  );
}
