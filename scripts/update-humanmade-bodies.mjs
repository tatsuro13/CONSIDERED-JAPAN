/**
 * HUMAN MADE記事のボディコンテンツを日英バイリンガルで更新
 */
import { Client } from "@notionhq/client";
import https from "node:https";
import http from "node:http";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB = process.env.NOTION_JOURNAL_DB_ID;

// HTTP fetch for OG image
function fetchUrl(rawUrl, redirectCount = 0) {
  if (redirectCount > 5) return Promise.reject(new Error("Too many redirects"));
  return new Promise((resolve, reject) => {
    const parsed = new URL(rawUrl);
    const mod = parsed.protocol === "https:" ? https : http;
    const req = mod.get(
      { hostname: parsed.hostname, path: parsed.pathname + parsed.search,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; ConsideredJapanBot/1.0)" },
        timeout: 10000 },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location)
          return resolve(fetchUrl(res.headers.location, redirectCount + 1));
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        let data = ""; res.setEncoding("utf8");
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

async function fetchOgImage(url) {
  try {
    const html = await fetchUrl(url);
    const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return m ? m[1] : "";
  } catch { return ""; }
}

// Helper: create text block
function p(text) {
  return {
    object: "block", type: "paragraph",
    paragraph: { rich_text: [{ type: "text", text: { content: text } }] },
  };
}

function h2(text) {
  return {
    object: "block", type: "heading_2",
    heading_2: { rich_text: [{ type: "text", text: { content: text } }] },
  };
}

function divider() {
  return { object: "block", type: "divider", divider: {} };
}

// Article bodies keyed by slug (or partial slug)
const BODIES = {
  "buffer-human-made": [
    h2("A New Chapter in Accessible Streetwear"),
    p("Tetsu Nishiyama, the man behind WTAPS and a long-time confidant of NIGO, has launched Buffer — a new sub-brand under the Human Made umbrella aimed squarely at a younger audience. The debut collection, dropping in April 2026, features four graphic T-shirts priced to be genuinely accessible, each illustrated by a different artist from a rotating creative roster."),
    p("西山徹——WTAPSの創設者であり、NIGOの長年の盟友——がHUMAN MADE傘下の新ブランド「Buffer」を始動した。2026年4月に発売される最初のコレクションは、4種類のグラフィックTシャツで構成され、それぞれ異なるアーティストがデザインを手がけている。価格は若い世代にも手が届く設定だ。"),
    divider(),
    h2("Why Buffer Matters"),
    p("In a market flooded with premium Japanese streetwear, Buffer represents a deliberate counterpoint. The name itself suggests a space between — a zone where high-school students and young creatives can access the Human Made ethos without the price barrier. It is, in many ways, a gateway drug to considered fashion."),
    p("プレミアム価格の日本のストリートウェアが溢れる市場において、Bufferは意図的な対抗軸を示している。その名前が示す通り、高校生や若いクリエイターたちがHUMAN MADEの精神に価格の壁なく触れられる「緩衝地帯」だ。ある意味で、考えられたファッションへの入口となるブランドである。"),
    divider(),
    p("The pink rabbit logo — Buffer's mascot — nods to Human Made's signature heart motif while establishing its own playful identity. Nishiyama has described the project as something he wished existed when he was in high school: affordable, artist-driven, and deeply rooted in graphic culture."),
    p("Bufferのマスコットであるピンクのウサギのロゴは、HUMAN MADEのシグネチャーであるハートモチーフへのオマージュでありながら、独自の遊び心あるアイデンティティを確立している。西山は「自分が高校生のときにあってほしかったもの」とこのプロジェクトを語る。"),
  ],

  "human-made-bangkok-store-opening-thailand-kaws-exclusive-ite": [
    h2("Southeast Asia's First Human Made Flagship"),
    p("Human Made has opened its first Southeast Asian outpost in Bangkok, marking a strategic expansion into one of the region's fastest-growing fashion markets. The store features the brand's signature vintage Americana aesthetic adapted to a tropical context, with exclusive KAWS collaboration items available only at this location."),
    p("HUMAN MADEがバンコクに東南アジア初の旗艦店をオープンした。この地域で最も急成長するファッション市場のひとつへの戦略的な拡大を意味する。店舗にはブランドのシグネチャーであるヴィンテージ・アメリカーナの美学がトロピカルな文脈に適応された形で展開され、この店舗限定のKAWSコラボレーションアイテムも並ぶ。"),
    divider(),
    h2("The KAWS Connection"),
    p("The exclusive items blend KAWS's signature XX motif with Human Made's heart logo — a collaboration that speaks to both artists' roots in the intersection of street art and fashion. Limited-edition T-shirts, tote bags, and ceramic figures are among the offerings, each bearing dual branding that collectors will recognize instantly."),
    p("限定アイテムにはKAWSのシグネチャーXXモチーフとHUMAN MADEのハートロゴが融合されている。ストリートアートとファッションの交差点にルーツを持つ両アーティストの対話を体現するコラボレーションだ。限定Tシャツ、トートバッグ、セラミックフィギュアなどが展開される。"),
    divider(),
    p("Bangkok joins Tokyo, Osaka, Kyoto, Seoul, and the newly established US operations in Human Made's growing global retail network. The choice of Bangkok reflects NIGO's personal connection to Southeast Asian vintage culture and the city's emergence as a streetwear capital."),
    p("バンコクは、東京、大阪、京都、ソウル、そして新設の米国拠点に続くHUMAN MADEのグローバルリテールネットワークに加わった。バンコクの選択は、NIGOの東南アジアのヴィンテージカルチャーへの個人的な結びつきと、この街がストリートウェアの中心地として台頭していることを反映している。"),
  ],

  "nigo-human-made-us-subsidiary-expansion-announcment-info": [
    h2("A Quiet Move With Loud Implications"),
    p("Without fanfare or press releases, NIGO's Human Made has registered a US subsidiary capitalized at $4 million USD. The move, filed in early 2026, signals a serious commitment to the North American market that goes far beyond occasional pop-ups and wholesale partnerships."),
    p("プレスリリースもなく静かに、NIGOのHUMAN MADEが資本金400万ドルで米国子会社を登記した。2026年初頭に行われたこの動きは、単発のポップアップやホールセールのパートナーシップをはるかに超えた、北米市場への本格的なコミットメントを示している。"),
    divider(),
    h2("Post-IPO Strategy"),
    p("The US expansion follows Human Made's historic IPO on the Tokyo Stock Exchange in November 2025, which valued the company at approximately $460 million. With Pharrell Williams serving as both creative advisor and second-largest shareholder, the brand has the cultural capital and financial backing to compete directly in the American market."),
    p("この米国進出は、2025年11月の東京証券取引所への歴史的上場に続くものだ。時価総額約460億円と評価された同社は、クリエイティブアドバイザー兼第二位株主であるファレル・ウィリアムスの存在とともに、アメリカ市場で直接競争するための文化的資本と財務的裏付けを備えている。"),
    divider(),
    p("What makes this expansion notable is not just the financial investment but the philosophical one. Human Made's entire identity is built on Japanese craft sensibility applied to American vintage culture. A permanent US presence allows the brand to close the loop — bringing its reinterpretation of Americana back to its source."),
    p("この進出が注目に値するのは、財務的な投資だけでなく、哲学的な投資でもあるからだ。HUMAN MADEのアイデンティティ全体が、アメリカのヴィンテージカルチャーに日本のクラフト感覚を適用することで構築されている。米国での恒久的な存在は、アメリカーナの再解釈をその源泉に還すことを意味する。"),
  ],

  "pharrell-williams-human-made-advisor": [
    h2("Two Visionaries, One Brand"),
    p("The partnership between Pharrell Williams and NIGO predates Human Made itself — their friendship stretching back to the early 2000s when both were reshaping the boundaries between music, art, and fashion. Now, with Pharrell holding the second-largest stake in Human Made following its Tokyo IPO, the question is whether their combined influence can propel a niche Japanese brand into a global force."),
    p("ファレル・ウィリアムスとNIGOのパートナーシップは、HUMAN MADEの誕生以前にまで遡る。2000年代初頭、音楽とアートとファッションの境界を再定義していた頃からの友情だ。東京IPO後にファレルが第二位株主となった今、彼らの影響力の合算が、ニッチな日本ブランドをグローバルな存在に押し上げられるかが問われている。"),
    divider(),
    h2("Creative Advisor, Not Creative Director"),
    p("The distinction matters. Pharrell's role is explicitly advisory — he does not design collections or direct campaigns. Instead, he serves as a cultural bridge, connecting Human Made to networks in music, entertainment, and luxury that NIGO alone might not reach. It is a modern model of brand building: influence as infrastructure."),
    p("この区別は重要だ。ファレルの役割は明確にアドバイザリーであり、コレクションのデザインやキャンペーンのディレクションは行わない。彼はカルチャーの架け橋として、NIGOだけではリーチできなかった音楽、エンターテインメント、ラグジュアリーのネットワークとHUMAN MADEを接続する。インフルエンスをインフラとする、現代的なブランド構築のモデルだ。"),
    divider(),
    p("Whether this partnership can sustain the pressure of public markets remains to be seen. But the raw materials — decades of friendship, complementary skill sets, and a shared love of vintage culture — suggest this is more than a celebrity endorsement. It is an alignment of worldviews."),
    p("この関係性が株式公開市場のプレッシャーに耐えうるかはまだわからない。しかし、数十年にわたる友情、補完的なスキルセット、ヴィンテージカルチャーへの共有された愛——これらの素材は、単なるセレブリティの推薦以上のものであることを示唆している。世界観の一致だ。"),
  ],

  "nigo-human-made-simone-rocha-pitti-uomo-john-galliano-zara-a": [
    h2("Human Made US: The Headline"),
    p("NIGO has officially launched Human Made's US operations, the most significant international expansion in the brand's history. The move comes after months of quiet preparation, including the establishment of a $4 million subsidiary and strategic hires across retail and marketing. For a brand built on Japanese reinterpretations of American vintage, having a permanent American presence feels both inevitable and overdue."),
    p("NIGOがHUMAN MADEの米国事業を正式に始動させた。ブランド史上最も重要な国際展開だ。400万ドルの子会社設立やリテール・マーケティング部門の戦略的な人材採用など、数ヶ月にわたる静かな準備を経ての動きである。アメリカのヴィンテージを日本的に再解釈してきたブランドにとって、アメリカへの恒久的な進出は必然であり、同時に待望でもあった。"),
    divider(),
    h2("The Week in Context"),
    p("This week's fashion news was dominated by strategic moves: Simone Rocha's debut at Pitti Uomo brought a rare poetic sensibility to Florence's menswear trade fair, while John Galliano's designs for Zara continued to blur the line between high fashion and mass market. The adidas FW26 runway showed a brand reconnecting with its athletic roots through a fashion lens."),
    p("今週のファッションニュースは戦略的な動きに支配された。シモーネ・ロシャのピッティ・ウォモへのデビューはフィレンツェのメンズウェア見本市に稀有な詩的感性をもたらし、ジョン・ガリアーノのZaraへのデザインはハイファッションとマスマーケットの境界をさらに曖昧にした。"),
  ],

  "follow-the-pink-rabbit-tetsu-nishiyama-launches-buffer-under": [
    h2("Nishiyama's New Direction"),
    p("Tetsu Nishiyama — the founder of WTAPS and one of the most respected figures in Japanese streetwear — is stepping into unfamiliar territory with Buffer. Where WTAPS deals in military precision and mature silhouettes, Buffer is deliberately youthful, graphic-forward, and priced for accessibility. The debut collection of four T-shirts, each designed by a different illustrator, launches in April 2026."),
    p("WTAPS創設者であり、日本のストリートウェア界で最も尊敬される人物のひとり、西山徹がBufferで未知の領域に踏み出す。WTAPSがミリタリーの精緻さと成熟したシルエットを扱うのに対し、Bufferは意図的に若々しく、グラフィック重視で、手の届く価格設定だ。"),
    divider(),
    h2("The Artist Rotation Model"),
    p("What distinguishes Buffer from a typical diffusion line is its rotating artist model. Each season, new illustrators and graphic designers will contribute to the collection, ensuring that the brand's visual identity remains in constant flux. Nishiyama has likened it to a gallery that happens to sell T-shirts — a space where graphic culture and commerce intersect without pretension."),
    p("Bufferを典型的なディフュージョンラインと区別するのは、ローテーションアーティストモデルだ。毎シーズン新しいイラストレーターやグラフィックデザイナーがコレクションに参加し、ブランドのビジュアルアイデンティティが常に変化し続ける。西山はこれを「たまたまTシャツを売っているギャラリー」と表現する。"),
    divider(),
    p("The pink rabbit logo — Buffer's mascot — carries a lightness that feels intentional. In a market where Japanese streetwear often takes itself very seriously, Buffer's playfulness reads as a quiet rebellion. Follow the rabbit, Nishiyama seems to say, and see where it leads."),
    p("Bufferのマスコットであるピンクのウサギは、意図的な軽やかさを纏っている。日本のストリートウェアがしばしば自身を非常にシリアスに捉える市場において、Bufferの遊び心は静かな反乱のように映る。ウサギを追いかけてみろ、と西山は言っているようだ。"),
  ],

  "human-made-red-wing-boots-footwear-apparel-collection-releas": [
    h2("The Future Is in the Past"),
    p("Human Made and Red Wing Heritage have united under a shared philosophy — that the most meaningful path forward often looks backward. The limited-edition capsule pairs Red Wing's century-old American bootmaking tradition with Human Made's meticulous Japanese craft sensibility, resulting in pieces that feel simultaneously nostalgic and entirely new."),
    p("HUMAN MADEとRed Wing Heritageが共有する哲学のもとに手を組んだ——最も意義ある前進の道は、しばしば過去を振り返ることにある。100年以上の歴史を持つアメリカのブーツメイキングの伝統と、HUMAN MADEの緻密な日本のクラフト感覚が融合した限定カプセルは、ノスタルジックでありながら全く新しい。"),
    divider(),
    h2("The Collection"),
    p("Footwear includes the 8-inch Classic Moc with a medial zipper and Human Made emboss, and the Pecos with a heel zipper bearing the same treatment. The apparel range — a varsity jacket, raglan sweatshirt, and graphic T-shirt — translates Red Wing's heritage logo through Human Made's vintage lens. Retail prices range from $74.99 to $450."),
    p("フットウェアには、メディアルジッパーとHUMAN MADEの刻印を備えた8インチ・クラシック・モック、そしてヒールジッパーに同様の処理を施したペコスが含まれる。アパレルライン——バーシティジャケット、ラグランスウェット、グラフィックTシャツ——はRed Wingのヘリテージロゴをヒューマンメイドのヴィンテージの視点で翻訳する。"),
    divider(),
    p("What elevates this collaboration beyond the usual brand crossover is the depth of shared DNA. Both brands worship craftsmanship, both draw from workwear traditions, and both believe that well-made objects carry meaning beyond their function. The capsule is available through Human Made first, with Red Wing's global rollout following."),
    p("このコラボレーションを通常のブランドクロスオーバーの上に位置づけるのは、共有するDNAの深さだ。両ブランドともにクラフトマンシップを崇拝し、ワークウェアの伝統に根ざし、よく作られたモノは機能を超えた意味を持つと信じている。"),
  ],

  "nigo-pharrell-human-made-historic-ipo-tokyo-stock-exchange-a": [
    h2("A Historic First"),
    p("In November 2025, NIGO's Human Made became one of the first independent Japanese streetwear brands to list on the Tokyo Stock Exchange, achieving a valuation of approximately $460 million. The IPO represents not just a financial milestone for the brand, but a symbolic one for the entire Japanese fashion industry — proof that craft-driven streetwear can compete in public markets."),
    p("2025年11月、NIGOのHUMAN MADEが日本の独立系ストリートウェアブランドとして初めて東京証券取引所に上場し、約460億円の評価を受けた。このIPOはブランドにとっての財務的なマイルストーンであるだけでなく、日本のファッション業界全体にとっての象徴的な出来事だ——クラフト主導のストリートウェアが公開市場で戦えることの証明である。"),
    divider(),
    h2("The Pharrell Factor"),
    p("Pharrell Williams, who holds the second-largest stake in the company, has been instrumental in elevating Human Made's global profile. His role as creative advisor — distinct from creative director — allows NIGO to retain full design control while benefiting from Pharrell's vast network across music, entertainment, and luxury fashion."),
    p("第二位株主であるファレル・ウィリアムスは、HUMAN MADEのグローバルなプロフィール向上に不可欠な存在だ。クリエイティブディレクターとは異なるクリエイティブアドバイザーという役割は、NIGOにデザインの完全なコントロールを残しながら、ファレルの音楽、エンターテインメント、ラグジュアリーファッションにまたがる広大なネットワークの恩恵を可能にする。"),
    divider(),
    p("The IPO funds are earmarked for international expansion — the US subsidiary, the Bangkok flagship, and further Asian retail development. For a brand that started as NIGO's personal project celebrating American vintage through Japanese eyes, the journey from Harajuku to the stock exchange is nothing short of remarkable."),
    p("IPOで調達した資金は国際展開に充てられる——米国子会社、バンコク旗艦店、そしてさらなるアジアでのリテール開発だ。アメリカのヴィンテージを日本の目を通して称えるNIGOの個人プロジェクトとして始まったブランドにとって、原宿から証券取引所への道のりは驚嘆に値する。"),
  ],

  "nigo-nike-pendleton-2026-jan": [
    h2("College Style, Reimagined"),
    p("The NIGO × NIKE collaboration draws from the visual language of American college athletics — varsity letterman jackets, campus bookstore aesthetics, and the unforced cool of vintage athletic wear. The four-piece collection includes footwear and apparel that balance Nike's performance DNA with NIGO's obsessive attention to vintage detail."),
    p("NIGO × NIKEコラボレーションは、アメリカのカレッジアスレチックスの視覚言語から着想を得ている——バーシティのレタマンジャケット、キャンパスブックストアの美学、ヴィンテージアスレチックウェアの力まないクールさ。4ピースのコレクションは、Nikeのパフォーマンスと、NIGOのヴィンテージディテールへの執着的なこだわりのバランスを保つ。"),
    divider(),
    h2("World-First Release"),
    p("The collection launched exclusively through Human Made's online store on January 31, 2026, before wider retail distribution. This world-first approach has become a signature strategy for Human Made's collaborations, rewarding the brand's core community with early access while generating anticipation in the broader market."),
    p("コレクションは2026年1月31日にHUMAN MADEオンラインストアで世界先行発売された。この「ワールドファースト」アプローチは、HUMAN MADEのコラボレーションにおけるシグネチャー戦略となっている——コアコミュニティに先行アクセスを提供しながら、より広い市場での期待感を醸成する。"),
    divider(),
    p("For NIGO, who has long cited 1960s and 70s American campus culture as a primary influence, this Nike collaboration feels personal. It is not a commercial exercise dressed up as creativity, but a genuine expression of the things he has loved since he was a teenager in Tokyo, dreaming of a country he had never visited."),
    p("1960〜70年代のアメリカのキャンパスカルチャーを主要なインスピレーション源として長年挙げてきたNIGOにとって、このNikeコラボレーションは個人的なものだ。クリエイティビティを装った商業的な試みではなく、東京のティーンエイジャーだった頃からまだ訪れたことのない国に夢を馳せていたものたちへの、純粋な表現である。"),
  ],

  "nigo-nike-2025-nov": [
    h2("The Sneaker That Started It All"),
    p("Before the full college-inspired collection of January 2026, NIGO and Nike debuted their partnership with a single sneaker release in November 2025. Available exclusively through Human Made's online store, the shoe established the collaborative language that would define the broader collection: vintage athletic references filtered through Japanese craft precision."),
    p("2026年1月のカレッジインスパイアード・コレクションに先立ち、NIGOとNikeは2025年11月にスニーカー単体のリリースでパートナーシップをデビューさせた。HUMAN MADEのオンラインストア限定で発売されたこの一足は、その後のコレクション全体を定義するコラボレーションの言語を確立した——日本のクラフトの精密さを通して濾過されたヴィンテージアスレチックの参照。"),
    divider(),
    h2("Why It Matters"),
    p("NIGO's relationship with Nike dates back decades — from his early days collecting vintage Dunks in Harajuku to his tenure at KENZO, where athletic influences permeated the runway. This collaboration represents a full-circle moment: the collector becomes the collaborator, bringing an archivist's eye to one of the world's largest sportswear brands."),
    p("NIGOとNikeの関係は数十年に遡る——原宿でヴィンテージのダンクを集めていた初期の頃から、アスレチックの影響がランウェイに浸透したKENZO時代まで。このコラボレーションは円環の完成を意味する——コレクターがコラボレーターとなり、アーキビストの目を世界最大のスポーツウェアブランドにもたらす。"),
    divider(),
    p("The sneaker sold out within hours, confirming what the industry already suspected: when NIGO applies his curatorial instinct to a Nike silhouette, the result transcends both streetwear and sportswear categories entirely."),
    p("スニーカーは数時間で完売し、業界がすでに予感していたことを確認した——NIGOがそのキュレーション的本能をNikeのシルエットに適用するとき、その結果はストリートウェアとスポーツウェアの両カテゴリーを完全に超越する。"),
  ],
};

async function main() {
  const allPages = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: DB,
      filter: { property: "Status", select: { equals: "Published" } },
      page_size: 100,
      start_cursor: cursor,
    });
    allPages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  let updated = 0;

  for (const page of allPages) {
    const slug = page.properties.Slug?.rich_text?.[0]?.plain_text ?? "";

    // Match against our body data
    const body = BODIES[slug];
    if (!body) continue;

    const title = page.properties["名前"]?.title?.[0]?.plain_text ?? "";
    const sourceUrl = page.properties.SourceUrl?.url ?? "";
    process.stdout.write(`Updating: ${title.slice(0, 50)}... `);

    // Refresh HeroImage from source
    if (sourceUrl) {
      const freshImage = await fetchOgImage(sourceUrl);
      if (freshImage) {
        await notion.pages.update({
          page_id: page.id,
          properties: { HeroImage: { url: freshImage } },
        });
        process.stdout.write("hero✓ ");
      }
    }

    // Delete existing blocks first
    const existing = await notion.blocks.children.list({ block_id: page.id });
    for (const block of existing.results) {
      try {
        await notion.blocks.delete({ block_id: block.id });
      } catch (e) {
        // Some blocks can't be deleted, skip
      }
      await new Promise((r) => setTimeout(r, 100));
    }

    // Add new body blocks
    await notion.blocks.children.append({
      block_id: page.id,
      children: body,
    });

    console.log("DONE");
    updated++;
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\nDone. ${updated} articles updated with full body content.`);
}

main().catch(console.error);
