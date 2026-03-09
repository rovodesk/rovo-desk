export interface Author {
	id: string;
	name: string;
	role: string;
	avatar: string;
	bio: string;
	twitter?: string;
	linkedin?: string;
}

export interface BlogPost {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	coverImage: string;
	category: Category;
	author: Author;
	publishedAt: string;
	readingTime: number;
	featured?: boolean;
	tags: string[];
}

export type Category = "Engineering" | "Product" | "AI" | "Guides" | "Company";

export const categories: Category[] = [
	"Engineering",
	"Product",
	"AI",
	"Guides",
	"Company",
];

const AnonymousAuthor = {
	id: "Anonymous",
	name: "Anonymous",
	role: "anonymous",
	avatar: "test",
	bio: "Anonymous Author",
};

export const authors: Author[] = [
	{
		id: "1",
		name: "Sarah Chen",
		role: "Head of Engineering",
		avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarah",
		bio: "Leading the engineering team at RovoDesk. Previously at Stripe and Linear.",
		twitter: "sarahchen",
	},
	{
		id: "2",
		name: "Marcus Rivera",
		role: "Product Lead",
		avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=marcus",
		bio: "Building the future of customer support at RovoDesk.",
		linkedin: "marcusrivera",
	},
	{
		id: "3",
		name: "Aisha Patel",
		role: "AI Research",
		avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=aisha",
		bio: "Researching and building AI systems that understand customer intent.",
	},
	{
		id: "4",
		name: "James Okoye",
		role: "Developer Relations",
		avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=james",
		bio: "Helping developers build better customer experiences with RovoDesk.",
	},
];

export const blogPosts: BlogPost[] = [
	{
		id: "1",
		slug: "introducing-rovodesk-ai-engine",
		title: "Introducing the RovoDesk AI Engine",
		excerpt:
			"Today we're launching our new AI engine that understands customer intent, routes conversations intelligently, and resolves requests automatically.",
		content: `
<h2 id="a-new-era">A New Era for Customer Support</h2>

<p>For years, customer support has been built on rigid ticket systems, manual routing, and scripted responses. We believe there's a better way. Today, we're introducing the RovoDesk AI Engine — a fundamentally new approach to understanding and resolving customer requests.</p>

<p>The AI Engine isn't just another chatbot. It's a system that deeply understands the context of every conversation, learns from your team's best responses, and takes action on behalf of your customers.</p>

<h2 id="how-it-works">How It Works</h2>

<p>At its core, the AI Engine processes every incoming message through three layers:</p>

<ul>
<li><strong>Intent Recognition</strong> — Understanding what the customer actually needs, not just what they said</li>
<li><strong>Context Assembly</strong> — Pulling together relevant account data, previous interactions, and knowledge base articles</li>
<li><strong>Action Resolution</strong> — Either resolving the request automatically or routing to the right team member with full context</li>
</ul>

<h2 id="real-results">Real Results</h2>

<p>In our beta program, companies using the AI Engine saw:</p>

<ul>
<li>73% reduction in first response time</li>
<li>45% of tickets resolved without human intervention</li>
<li>92% customer satisfaction score</li>
</ul>

<blockquote>
<p>"RovoDesk's AI Engine transformed how we handle support. Our team now focuses on complex issues while routine requests are handled automatically." — Head of Support, Series B SaaS Company</p>
</blockquote>

<h2 id="getting-started">Getting Started</h2>

<p>The AI Engine is available today for all RovoDesk customers. Head to your dashboard to enable it, or <a href="#">read the documentation</a> to learn more about configuration options.</p>

<p>We're just getting started. Over the coming months, we'll be adding more capabilities including multi-language support, proactive outreach, and deeper integrations with your existing tools.</p>
    `,
		coverImage: "/post-ai-support.jpg",
		category: "Product",
		author: authors[1] || AnonymousAuthor,
		publishedAt: "2026-03-05",
		readingTime: 6,
		featured: true,
		tags: ["AI", "Product Launch", "Customer Support"],
	},
	{
		id: "2",
		slug: "building-real-time-intent-classification",
		title: "Building Real-Time Intent Classification at Scale",
		excerpt:
			"A deep dive into how we built our intent classification system that processes thousands of messages per second with sub-50ms latency.",
		content: `
<h2 id="the-challenge">The Challenge</h2>

<p>When we set out to build RovoDesk's intent classification system, we had three hard requirements: it needed to be fast (sub-50ms), accurate (>95% precision), and able to handle thousands of concurrent requests.</p>

<p>Most existing solutions forced you to choose two of three. We wanted all three.</p>

<h2 id="architecture">Architecture Overview</h2>

<p>Our system uses a multi-stage pipeline that balances speed with accuracy:</p>

<pre><code>Message → Preprocessing → Fast Classifier → Confidence Check → Deep Model (if needed) → Result</code></pre>

<p>The fast classifier handles ~80% of messages with high confidence. Only ambiguous cases get routed to the deeper model, keeping our p99 latency well under 50ms.</p>

<h2 id="model-design">Model Design</h2>

<p>We use a distilled transformer model for the fast path, trained on millions of real customer support conversations. The model learns to recognize patterns like:</p>

<ul>
<li>Billing inquiries vs. technical issues</li>
<li>Urgent escalations vs. general questions</li>
<li>Feature requests vs. bug reports</li>
<li>Emotional tone and frustration levels</li>
</ul>

<h2 id="lessons-learned">Lessons Learned</h2>

<p>Building this system taught us several important lessons about production ML:</p>

<ol>
<li>Start with simple models and add complexity only when needed</li>
<li>Invest heavily in data quality over model size</li>
<li>Build monitoring from day one — model drift is real</li>
<li>Edge cases matter more than aggregate metrics</li>
</ol>

<p>We'll be open-sourcing our evaluation framework next month. Stay tuned.</p>
    `,
		coverImage: "/post-automation.jpg",
		category: "Engineering",
		author: authors[0] || AnonymousAuthor,
		publishedAt: "2026-02-28",
		readingTime: 8,
		tags: ["Engineering", "Machine Learning", "Architecture"],
	},
	{
		id: "3",
		slug: "future-of-ai-customer-support",
		title: "The Future of AI in Customer Support: Beyond Chatbots",
		excerpt:
			"Why the next generation of AI support tools will understand context, emotion, and intent — not just keywords.",
		content: `
<h2 id="beyond-keywords">Beyond Keyword Matching</h2>

<p>The first generation of AI in customer support was built on keyword matching and decision trees. If a customer mentioned "billing," they got routed to billing. Simple, but brittle.</p>

<p>The second generation brought chatbots — slightly smarter, but still fundamentally limited. They could handle FAQs but fell apart with nuanced requests.</p>

<p>We're now entering the third generation, and it's fundamentally different.</p>

<h2 id="understanding-intent">Understanding Intent</h2>

<p>Modern AI systems can understand what a customer actually wants, even when they don't express it clearly. A message like "this isn't working" could mean dozens of things — the AI needs to use context to figure out which one.</p>

<h2 id="emotional-intelligence">Emotional Intelligence</h2>

<p>Perhaps the most underrated capability is emotional understanding. An AI that can detect frustration, urgency, or confusion can route and respond appropriately — escalating sensitive situations to human agents while handling routine requests automatically.</p>

<blockquote>
<p>The best AI support doesn't feel like talking to a robot. It feels like talking to someone who actually understands your problem.</p>
</blockquote>

<h2 id="what-comes-next">What Comes Next</h2>

<p>We believe the future includes proactive support — reaching out to customers before they even know they have a problem. Imagine a system that detects a user struggling with a feature and offers help before they reach out.</p>

<p>That future is closer than you think.</p>
    `,
		coverImage: "/post-ai-support.jpg",
		category: "AI",
		author: authors[2] || AnonymousAuthor,
		publishedAt: "2026-02-20",
		readingTime: 5,
		tags: ["AI", "Industry Trends", "Customer Experience"],
	},
	{
		id: "4",
		slug: "setting-up-rovodesk-in-10-minutes",
		title: "Setting Up RovoDesk in 10 Minutes: A Complete Guide",
		excerpt:
			"A step-by-step guide to getting RovoDesk running with your existing tools, from installation to your first automated resolution.",
		content: `
<h2 id="prerequisites">Prerequisites</h2>

<p>Before we start, make sure you have:</p>

<ul>
<li>A RovoDesk account (sign up at rovodesk.com)</li>
<li>Admin access to your current support tool (for data import)</li>
<li>15 minutes of uninterrupted time</li>
</ul>

<h2 id="step-1">Step 1: Connect Your Channels</h2>

<p>RovoDesk supports email, live chat, Slack, and social media out of the box. Head to Settings → Channels and connect the ones you use.</p>

<h2 id="step-2">Step 2: Import Your Knowledge Base</h2>

<p>Upload your existing help articles, FAQs, and documentation. RovoDesk's AI will index everything and use it to answer customer questions.</p>

<h2 id="step-3">Step 3: Configure AI Routing</h2>

<p>Set up your team structure and routing rules. The AI will learn from these initial rules and improve over time.</p>

<h2 id="step-4">Step 4: Enable Auto-Resolution</h2>

<p>Turn on AI auto-resolution for common request types. Start conservative — you can always expand later as you build confidence in the system.</p>

<h2 id="next-steps">Next Steps</h2>

<p>Once you're set up, we recommend monitoring the AI's performance for the first week and adjusting confidence thresholds based on your results.</p>
    `,
		coverImage: "/post-automation.jpg",
		category: "Guides",
		author: authors[3] || AnonymousAuthor,
		publishedAt: "2026-02-15",
		readingTime: 4,
		tags: ["Tutorial", "Getting Started", "Setup"],
	},
	{
		id: "5",
		slug: "rovodesk-series-b-announcement",
		title: "RovoDesk Raises $40M Series B to Redefine Customer Support",
		excerpt:
			"We're thrilled to announce our Series B funding round, led by Accel, to accelerate our mission of making customer support intelligent.",
		content: `
<h2 id="the-news">The News</h2>

<p>Today we're announcing that RovoDesk has raised $40M in Series B funding, led by Accel with participation from Y Combinator, Sequoia Scout, and our existing investors.</p>

<h2 id="our-journey">Our Journey</h2>

<p>Two years ago, we started RovoDesk with a simple observation: customer support tools hadn't meaningfully changed in a decade. Companies were still using the same ticket queues, the same manual routing, the same scripted responses.</p>

<p>We believed AI could change that — not by replacing human agents, but by augmenting them. By handling the routine so humans can focus on what they do best: empathy, creativity, and complex problem-solving.</p>

<h2 id="whats-next">What's Next</h2>

<p>This funding will help us:</p>

<ul>
<li>Expand our AI research team</li>
<li>Launch in new markets (Europe and APAC)</li>
<li>Build deeper integrations with CRM and product tools</li>
<li>Invest in our open-source initiatives</li>
</ul>

<p>We're hiring across engineering, product, design, and go-to-market. If you're excited about building the future of customer support, <a href="#">we'd love to hear from you</a>.</p>
    `,
		coverImage: "/post-ai-support.jpg",
		category: "Company",
		author: authors[1] || AnonymousAuthor,
		publishedAt: "2026-02-10",
		readingTime: 3,
		tags: ["Company News", "Funding", "Milestone"],
	},
	{
		id: "6",
		slug: "designing-for-support-agents",
		title: "Designing for Support Agents: Lessons from 100 User Interviews",
		excerpt:
			"What we learned from talking to 100 support agents about their daily workflows, pain points, and what they actually need from their tools.",
		content: `
<h2 id="listening-first">Listening First</h2>

<p>Before building RovoDesk's agent interface, we spent three months interviewing 100 support agents across 30 companies. Here's what we learned.</p>

<h2 id="key-findings">Key Findings</h2>

<p>The biggest pain points weren't what we expected:</p>

<ul>
<li><strong>Context switching</strong> was the #1 complaint — agents juggle 5-8 tools per ticket</li>
<li><strong>Repetitive typing</strong> — agents estimated 40% of their responses were variations of the same message</li>
<li><strong>Lack of context</strong> — agents often couldn't see the customer's full history</li>
<li><strong>Metrics pressure</strong> — time-based metrics incentivized speed over quality</li>
</ul>

<h2 id="design-principles">Our Design Principles</h2>

<p>These interviews shaped our core design principles:</p>

<ol>
<li>Everything in one view — no tab switching</li>
<li>AI suggestions, not AI replacements</li>
<li>Quality metrics alongside speed metrics</li>
<li>Keyboard-first interaction design</li>
</ol>

<blockquote>
<p>"The best tool is one that gets out of your way and lets you focus on the customer." — Support Team Lead, E-commerce Company</p>
</blockquote>

<p>We're continuing to refine our interface based on ongoing feedback. If you're a support agent and want to share your experience, <a href="#">reach out to us</a>.</p>
    `,
		coverImage: "/post-automation.jpg",
		category: "Product",
		author: authors[1] || AnonymousAuthor,
		publishedAt: "2026-02-05",
		readingTime: 7,
		tags: ["Design", "UX Research", "Product"],
	},
];

export function getPostBySlug(slug: string): BlogPost | undefined {
	return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: Category): BlogPost[] {
	return blogPosts.filter((post) => post.category === category);
}

export function getFeaturedPost(): BlogPost | undefined {
	return blogPosts.find((post) => post.featured);
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
	const current = getPostBySlug(currentSlug);
	if (!current) return blogPosts.slice(0, limit);
	return blogPosts
		.filter(
			(post) => post.slug !== currentSlug && post.category === current.category
		)
		.slice(0, limit);
}
