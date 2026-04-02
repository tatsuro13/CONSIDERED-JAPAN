// node --env-file=.env.local scripts/seed-brands-detail.mjs
// Adds Slug, Description, DescriptionJp, HeroImage to Brands DB and updates all brand pages

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_BRANDS_DB_ID;

// Step 1: Add new properties to the DB
async function addProperties() {
  console.log("Adding properties to Brands DB...");
  await notion.databases.update({
    database_id: DB_ID,
    properties: {
      Slug: { rich_text: {} },
      Description: { rich_text: {} },
      DescriptionJp: { rich_text: {} },
      HeroImage: { url: {} },
    },
  });
  console.log("✓ Properties added");
}

const brandDetails = {
  nonnative: {
    slug: "nonnative",
    description: "Founded in 1999 by Daisuke Nishida, nonnative draws from workwear, military surplus, and outdoor equipment — reinterpreted with an obsessive attention to material and proportion. Functional thinking made human.",
    descriptionJp: "西田大輔が1999年に設立。ワークウェア、ミリタリー、アウトドアを独自の解釈で昇華。素材とプロポーションへの徹底したこだわりが、機能美を体現する。",
    heroImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
  },
  COMOLI: {
    slug: "comoli",
    description: "Hiroshi Komori's Tokyo label makes garments designed for the long term — natural materials chosen with the precision of a writer choosing words, cut to improve with every year of wear.",
    descriptionJp: "小森啓二郎によるトウキョウブランド。天然素材を言葉を選ぶような精度で選び、年月とともに育つ服を作る。",
    heroImage: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&q=80",
  },
  Graphpaper: {
    slug: "graphpaper",
    description: "Sho Kikuchi's 2016 label applies the structural logic of workwear to garments with contemporary refinement — clothes that disappear into use, which is to say, clothes that succeed completely.",
    descriptionJp: "菊地翔が2016年に設立。ワークウェアの構造的論理を現代的な洗練で昇華。日常に溶け込む服こそが、完全な成功だと信じる。",
    heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80",
  },
  Markaware: {
    slug: "markaware",
    description: "Toshiki Akabane works exclusively in organic, natural materials — treating sustainability not as a feature but as a design constraint, one that produces some of the most technically demanding garments in Japanese menswear.",
    descriptionJp: "赤羽俊樹はオーガニック素材のみで制作。サステナビリティをデザイン上の制約として捉え、日本メンズウェアで最も技術的に要求の高い服を生み出す。",
    heroImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=80",
  },
  "Porter Classic": {
    slug: "porter-classic",
    description: "A 2007 offshoot of the legendary Yoshida & Co., Porter Classic brings the same obsessive craft that built Japan's finest bags to ready-to-wear — indigo dyeing, hand-stitching, and fabrics sourced from century-old mills.",
    descriptionJp: "吉田カバンの2007年派生ブランド。伝説的なバッグ作りのクラフトをウェアに昇華。藍染め、手縫い、老舗工場の素材が生きる。",
    heroImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80",
  },
  sacai: {
    slug: "sacai",
    description: "Chitose Abe's hybrid practice — founded 1999, shown in Paris — layers two garments into one body not to create dissonance but harmony. Clothing that refuses to settle into a single identity.",
    descriptionJp: "阿部千登勢が1999年設立。パリでコレクションを発表。ふたつの服をひとつの身体に重ね、不和ではなく調和を生む。アイデンティティに収まることを拒む服。",
    heroImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&q=80",
  },
  "Y-3": {
    slug: "y-3",
    description: "The 2002 collaboration between Yohji Yamamoto and adidas remains one of fashion's most sustained experiments in sportswear and avant-garde design — a language that has grown more fluent with each passing decade.",
    descriptionJp: "山本耀司とadidasの2002年コラボレーション。スポーツウェアと前衛デザインを融合した、ファッション史上最も持続的な実験のひとつ。",
    heroImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
  },
  HYKE: {
    slug: "hyke",
    description: "Founded by Hideaki Yoshihara and Toru Yoshida in 2013, HYKE makes women's clothes that are minimal without being cold — drawing from military and utilitarian references to produce garments of quiet authority.",
    descriptionJp: "吉原秀明と吉田徹が2013年設立。ミリタリーとユーティリティを参照しながら、静かな力強さを持つミニマルなウィメンズウェアを作る。",
    heroImage: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=80",
  },
  Freshservice: {
    slug: "freshservice",
    description: "A 2008 Tokyo brand that approaches functional clothing as a design problem rather than a category — combining workwear structure with materials and finishing that belong to a different register entirely.",
    descriptionJp: "2008年東京発。機能的な服をカテゴリーではなくデザインの問いとして捉える。ワークウェアの構造と、全く異なる素材・仕上げを組み合わせる。",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
  },
  EYEVAN: {
    slug: "eyevan",
    description: "Established in 1972, EYEVAN makes eyewear in the Sabae region of Fukui — Japan's optical heartland. Each frame is the result of over two hundred hand processes, combining heritage craft with contemporary proportion.",
    descriptionJp: "1972年設立。日本のメガネの聖地、福井・鯖江でフレームを製作。200以上の手作業による工程と、現代的なプロポーションが共存する。",
    heroImage: "https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=1200&q=80",
  },
  "Kijima Takayuki": {
    slug: "kijima-takayuki",
    description: "The hat maker Takayuki Kijima works from a Tokyo atelier, shaping headwear that belongs to the long tradition of Japanese artisanship — natural straws, felts, and wools, hand-blocked to forms that have taken years to perfect.",
    descriptionJp: "帽子職人・木島タカユキが東京のアトリエで制作。天然素材を手成形で仕上げる帽子は、日本の職人技の伝統を受け継ぐ。",
    heroImage: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=1200&q=80",
  },
  "Comme des Garçons": {
    slug: "comme-des-garcons",
    description: "Rei Kawakubo's 1969 label changed what clothing was allowed to mean. Five decades later, the work remains as rigorous and as difficult as anything in fashion — a practice that has never confused relevance with accessibility.",
    descriptionJp: "川久保玲が1969年設立。服が持ちうる意味を変えた。半世紀を経た今も、ファッションで最も厳格で難解な実践であり続ける。",
    heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80",
  },
  "Yohji Yamamoto": {
    slug: "yohji-yamamoto",
    description: "Since 1972, Yohji Yamamoto has made clothes from an unwavering position: that darkness is beautiful, that asymmetry is honest, and that a garment should be large enough to contain a life rather than merely define a body.",
    descriptionJp: "1972年以来、山本耀司は一貫した姿勢で服を作り続ける。闇は美しく、非対称は誠実であり、服は身体を定義するのではなく、人生を包み込む大きさを持つべきだと。",
    heroImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80",
  },
};

async function updateBrands() {
  console.log("Fetching brand pages...");
  const res = await notion.databases.query({ database_id: DB_ID });

  for (const page of res.results) {
    const props = page.properties;
    const titleProp = props["名前"] ?? props["Name"] ?? Object.values(props).find(p => p.type === "title");
    const name = titleProp?.title?.[0]?.plain_text ?? "";
    const detail = brandDetails[name];

    if (!detail) {
      console.log(`  skipping: ${name}`);
      continue;
    }

    try {
      await notion.pages.update({
        page_id: page.id,
        properties: {
          Slug: { rich_text: [{ text: { content: detail.slug } }] },
          Description: { rich_text: [{ text: { content: detail.description } }] },
          DescriptionJp: { rich_text: [{ text: { content: detail.descriptionJp } }] },
          HeroImage: { url: detail.heroImage },
        },
      });
      console.log(`✓ ${name}`);
    } catch (err) {
      console.error(`✗ ${name}: ${err.message}`);
    }
  }
}

async function main() {
  await addProperties();
  await updateBrands();
  console.log("Done!");
}

main().catch(console.error);
