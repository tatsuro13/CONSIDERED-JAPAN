// node --env-file=.env.local scripts/seed-journal-bulk.mjs
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_JOURNAL_DB_ID;

const articles = [
  {
    name: "COMOLI",
    title: "The Weight of Simplicity",
    titleJp: "簡素さの重み",
    slug: "comoli-the-weight-of-simplicity",
    date: "2026-03-21",
    blocks: [
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"There is a particular silence in COMOLI's work. The Tokyo label, founded in 2012 by Hiroshi Komori, does not explain itself. It does not need to. Each garment arrives fully formed — a linen shirt, a cotton trouser, a jacket cut in wool so fine it seems to breathe — and asks only that you wear it long enough to understand what it is doing." }}]}},
      { object:"block", type:"heading_2", heading_2:{ rich_text:[{ type:"text", text:{ content:"Material as Language" }}]}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"Komori's relationship with natural materials is not aesthetic preference — it is methodology. He selects fabrics the way a writer selects words: with precision, with patience, and with the understanding that the wrong choice collapses everything. Silk noil from Kyoto mills. Washi-blended cotton spun to a weight that falls correctly. Indigo-dyed chambray that deepens over years of washing rather than fading into approximation." }}]}},
      { object:"block", type:"quote", quote:{ rich_text:[{ type:"text", text:{ content:"Simplicity is not the absence of decision. It is the accumulation of them, compressed until nothing extraneous remains." }}]}},
      { object:"block", type:"heading_2", heading_2:{ rich_text:[{ type:"text", text:{ content:"Wearing In, Not Out" }}]}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"What distinguishes COMOLI from the broader wave of Japanese minimalism is its insistence on time. These are not garments designed to photograph well on the day of purchase. They are designed for the third year, the fifth year, the point at which the fabric has mapped itself to a specific body and a specific life. The stitching at the collar of a COMOLI shirt is reinforced in ways you will only notice when it has outlasted three other shirts bought the same season." }}]}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"To wear COMOLI is to enter into a quiet agreement. The brand will not flatter you with novelty. It will not reassure you with logos or provenance theater. It will give you cloth and cut and construction, and it will ask you to meet them halfway. Most clothing does not make this demand. That is precisely why COMOLI matters." }}]}},
    ],
  },
  {
    name: "Graphpaper",
    title: "The Architecture of the Ordinary",
    titleJp: "日常の建築",
    slug: "graphpaper-the-architecture-of-the-ordinary",
    date: "2026-03-22",
    blocks: [
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"Graphpaper begins with a problem most designers refuse to admit exists: the clothes people actually wear to work, to lunch, to the slow hours of an ordinary Tuesday, are the hardest clothes to make well. Sho Kikuchi founded the label in Tokyo in 2016 with this problem as his brief. Not ceremony. Not occasion. The persistent, unremarkable present." }}]}},
      { object:"block", type:"heading_2", heading_2:{ rich_text:[{ type:"text", text:{ content:"Workwear Without the Romance" }}]}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"The workwear revival of the last decade largely traded in nostalgia — denim selvedge, railroad stripes, the fetishization of American labor mythology. Graphpaper does something more difficult and more honest. It takes the structural logic of workwear — the reinforced pocket, the dropped shoulder for movement, the fabric that recovers after eight hours of sitting — and applies it to garments with the surface refinement of contemporary tailoring. There is no costuming here. Only function, elevated past the point where it becomes invisible." }}]}},
      { object:"block", type:"quote", quote:{ rich_text:[{ type:"text", text:{ content:"A well-made thing for an ordinary day is a more radical proposition than it appears. Most luxury is reserved for exception. Graphpaper refuses this economy." }}]}},
      { object:"block", type:"heading_2", heading_2:{ rich_text:[{ type:"text", text:{ content:"Proportion as Argument" }}]}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"Kikuchi's silhouettes are where the brand makes its clearest argument. Shoulders that sit slightly wide. Trousers with a rise that accommodates a body in motion rather than a body posed. Sleeves that can be pushed back without bunching. These are small decisions, each one arrived at through the kind of iterative fitting that most mass production cannot afford. But their cumulative effect is a garment that disappears into use — which is to say, a garment that succeeds completely." }}]}},
      { object:"block", type:"divider", divider:{}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"Graphpaper releases two collections a year and maintains a small but deeply considered range of permanent pieces. Its stockists are few, its advertising nonexistent. The brand spreads the way good things spread in Japan: by being consistently, undeniably correct, and by trusting that the people who need to find it eventually will." }}]}},
    ],
  },
  {
    name: "sacai",
    title: "Both Things at Once",
    titleJp: "同時に、ふたつのもの",
    slug: "sacai-both-things-at-once",
    date: "2026-03-23",
    blocks: [
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"Chitose Abe founded sacai in 1999 after leaving Comme des Garçons, and the label she built carries the mark of that education without being imprisoned by it. Where Kawakubo taught the industry to think in deconstruction, Abe turned the logic inside out: she deconstructs in order to reconstruct, layering two garments into one body not to create dissonance but to achieve a new, stranger harmony. A trench coat that is also a knitwear piece. A shirt that bifurcates into pleated skirt. The seam where they meet is never hidden." }}]}},
      { object:"block", type:"heading_2", heading_2:{ rich_text:[{ type:"text", text:{ content:"The Hybrid as Philosophy" }}]}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"Hybridization at sacai is not a formal trick. It is a position on what clothing can contain. Abe's interest lies in the charged space between identities — masculine and feminine, formal and casual, finished and undone — and her garments are attempts to hold both poles without resolving the tension between them. The result is clothing that reads differently depending on how it moves, what it is worn with, who is wearing it. This instability is the point. A sacai piece refuses to settle." }}]}},
      { object:"block", type:"quote", quote:{ rich_text:[{ type:"text", text:{ content:"Abe's genius is in the seam. Not what is on either side of it, but the line itself — the acknowledgment that two things were joined here, by choice, and the choice was worth making." }}]}},
      { object:"block", type:"heading_2", heading_2:{ rich_text:[{ type:"text", text:{ content:"Tokyo Womenswear, Global Reach" }}]}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"sacai shows in Paris but remains categorically, irreducibly a Tokyo brand. Abe has spoken of designing for women who do not want to choose between softness and strength, between professionalism and personality. Her clothes take this refusal of choice and make it structural." }}]}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"Over twenty-five years, sacai has accumulated a language specific enough to be instantly recognizable and flexible enough to remain surprising. It is one of the few labels in contemporary fashion that has deepened rather than simplified as its audience has grown. The work does not become easier to describe. It becomes more necessary to encounter." }}]}},
    ],
  },
  {
    name: "Markaware",
    title: "What the Earth Allows",
    titleJp: "大地が許すもの",
    slug: "markaware-what-the-earth-allows",
    date: "2026-03-24",
    blocks: [
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"Markaware arrived in 2011 with a constraint most brands treat as a marketing position but Toshiki Akabane treats as a design brief: only materials that the earth can take back. Organic cotton. Certified wool. Plant-based dyes. Natural rubber. Working within it has produced a body of work that looks, from the outside, like austere minimalism and is, from the inside, one of the most technically demanding practices in contemporary Japanese menswear." }}]}},
      { object:"block", type:"heading_2", heading_2:{ rich_text:[{ type:"text", text:{ content:"The Constraint Is the Work" }}]}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"Organic natural fibers behave differently from their conventional counterparts. They shrink unpredictably. They retain variation in texture and weight that synthetic finishing would smooth away. Dyes derived from plants produce colors that shift with washing and light in ways that synthetic colorants do not. Akabane's patterns account for all of this. The construction of a Markaware coat is an exercise in working with material behavior rather than against it — understanding that the fabric has intentions, and that the designer's role is partly to follow them." }}]}},
      { object:"block", type:"quote", quote:{ rich_text:[{ type:"text", text:{ content:"Sustainability, at its most honest, is not a feature. It is a limit. And limits, for a serious designer, are where the work begins." }}]}},
      { object:"block", type:"heading_2", heading_2:{ rich_text:[{ type:"text", text:{ content:"Slowness as Stance" }}]}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"Markaware does not release collections in the conventional cadence. Pieces are introduced when they are ready. Some styles remain in the range for years, amended season by season as Akabane finds better ways to cut or construct them. A jacket that takes three seasons to finalize is a jacket that will last a decade." }}]}},
      { object:"block", type:"paragraph", paragraph:{ rich_text:[{ type:"text", text:{ content:"There is a quietness to Markaware that is easy to mistake for modesty. The palette runs from undyed natural cream through charcoal to deep indigo — colors borrowed from the materials themselves rather than imposed upon them. To stand in front of a rail of Markaware garments is to feel the absence of urgency. That absence is, in 2026, an extraordinary thing to offer." }}]}},
      { object:"block", type:"divider", divider:{}},
    ],
  },
];

async function main() {
  console.log(`Seeding ${articles.length} journal articles...`);
  for (const article of articles) {
    try {
      await notion.pages.create({
        parent: { database_id: DB_ID },
        properties: {
          名前: { title: [{ text: { content: article.title } }] },
          TitleJp: { rich_text: [{ text: { content: article.titleJp } }] },
          Slug: { rich_text: [{ text: { content: article.slug } }] },
          Date: { date: { start: article.date } },
          Status: { select: { name: "Published" } },
        },
        children: article.blocks,
      });
      console.log(`✓ ${article.title}`);
    } catch (err) {
      console.error(`✗ ${article.title}: ${err.message}`);
    }
  }
  console.log("Done!");
}

main().catch(console.error);
