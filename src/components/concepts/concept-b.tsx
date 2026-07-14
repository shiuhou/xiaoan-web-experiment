import Image from "next/image";
import { V2_ASSETS } from "@/content/v2-content";

export function ConceptB() {
  return (
    <main className="concept concept-b">
      <header className="concept-meta concept-b__meta">
        <span><b>B /</b> <em>作業系統解體</em></span>
        <span>INTERFACE COLLAPSE STUDY</span>
      </header>
      <div className="concept-b__ledger" aria-hidden="true">
        <span>CAMERA</span><span>VOICE</span><span>CONTEXT</span><span>MEMORY</span>
      </div>
      <div className="concept-b__headline">
        <span>智能</span>
        <strong>不該只是</strong>
        <span>另一個視窗。</span>
      </div>
      <div className="concept-b__window" aria-hidden="true">
        <span>OPENCLAW / SESSION</span>
        <i /><i /><i />
      </div>
      <div className="concept-b__product">
        <Image
          src={V2_ASSETS.hero}
          alt="Xiao-An robot and Intel DK-2500 dock"
          fill
          priority
          sizes="(max-width: 700px) 86vw, 48vw"
        />
      </div>
      <p className="concept-b__command">BREAK THE INTERFACE → ENTER THE SPACE</p>
    </main>
  );
}
