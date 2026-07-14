import Image from "next/image";
import { V2_ASSETS } from "@/content/v2-content";

export function ConceptC() {
  return (
    <main className="concept concept-c">
      <div className="concept-c__sun" aria-hidden="true" />
      <header className="concept-meta concept-c__meta">
        <span><b>C /</b> <em>溫柔機械劇場</em></span>
        <span>PHYSICAL PRESENCE STUDY</span>
      </header>
      <div className="concept-c__copy">
        <p>不是另一塊屏幕。</p>
        <h1>是會走近你的，<br />一個存在。</h1>
        <span>XIAO-AN · 小安</span>
      </div>
      <div className="concept-c__product">
        <Image
          src={V2_ASSETS.hero}
          alt="Xiao-An robot and Intel DK-2500 dock"
          fill
          priority
          sizes="(max-width: 700px) 104vw, 68vw"
        />
      </div>
      <div className="concept-c__floor" aria-hidden="true" />
      <p className="concept-c__whisper">FROM VIRTUAL INTELLIGENCE<br />TO PHYSICAL PRESENCE</p>
    </main>
  );
}
