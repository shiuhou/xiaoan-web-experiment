import Image from "next/image";
import { V2_ASSETS } from "@/content/v2-content";

export function ConceptA() {
  return (
    <main className="concept concept-a">
      <div className="concept-a__void" aria-hidden="true">
        <i />
        <i />
      </div>
      <header className="concept-meta concept-a__meta">
        <span><b>A /</b> <em>裂屏成形</em></span>
        <span>SIGNAL TAKES FORM</span>
      </header>
      <div className="concept-a__type concept-a__type--back" aria-hidden="true">
        <span>小安，</span>
        <span>不只存在於</span>
      </div>
      <div className="concept-a__product">
        <div className="concept-a__slit" aria-hidden="true" />
        <Image
          src={V2_ASSETS.hero}
          alt="Xiao-An robot and Intel DK-2500 dock"
          fill
          priority
          sizes="(max-width: 700px) 94vw, 62vw"
        />
      </div>
      <h1 className="concept-a__type concept-a__type--front">
        <span>屏幕</span>
        <span>裡。</span>
      </h1>
      <p className="concept-a__descriptor">XIAO-AN / EMBODIED DESKTOP AGENT</p>
      <p className="concept-a__note">冷的界面，被一個真實存在切開。</p>
    </main>
  );
}
