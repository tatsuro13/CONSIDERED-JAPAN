export default function BuyGuidePage() {
  const methods = [
    {
      title: "International Shipping Brands",
      titleJp: "国際配送対応ブランド",
      description: "Some Japanese brands now ship internationally direct. We keep this list updated.",
      descriptionJp: "国際直送に対応しているブランドの最新リスト。",
      brands: ["sacai", "Y-3", "Comme des Garçons", "Yohji Yamamoto"],
    },
    {
      title: "Proxy Buying Services",
      titleJp: "代理購入サービス",
      description: "Services that buy on your behalf and ship worldwide. The most reliable option for brands without international shipping.",
      descriptionJp: "代わりに購入し世界中に発送してくれるサービス。国際発送非対応ブランドへの最も確実なアクセス方法。",
      brands: ["Buyee", "Tenso", "FROM JAPAN"],
    },
    {
      title: "Multi-brand Retailers",
      titleJp: "セレクトショップ（海外）",
      description: "International stores that carry Japanese brands. Easier checkout, but more limited selection.",
      descriptionJp: "日本ブランドを扱う海外セレクトショップ。手続きは簡単だが品揃えは限られる。",
      brands: ["END. Clothing", "SSENSE", "Dover Street Market"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="border-b border-border pb-6 mb-10">
        <p className="label">BUY GUIDE</p>
        <p className="label-jp mt-1">購入ガイド</p>
        <p className="bilingual-en mt-6 max-w-lg">
          Getting Japanese fashion from Tokyo to your door.
          A practical guide for international buyers.
        </p>
        <p className="bilingual-jp text-muted max-w-lg">
          日本のファッションを海外から手に入れるための実践ガイド。
        </p>
      </div>

      <div className="space-y-12">
        {methods.map((m, i) => (
          <div key={i} className="border-t border-border pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-sm font-medium tracking-wide">{m.title}</p>
                <p className="label-jp mt-1">{m.titleJp}</p>
              </div>
              <div className="md:col-span-2">
                <p className="bilingual-en">{m.description}</p>
                <p className="bilingual-jp text-muted">{m.descriptionJp}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {m.brands.map((b) => (
                    <span key={b} className="border border-border px-3 py-1 label">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
