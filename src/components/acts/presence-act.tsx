import Image from "next/image";
import { V2_ACTS, V2_ASSETS, V2_LINKS } from "@/content/v2-content";

export function PresenceAct() {
  const act = V2_ACTS[5];

  return (
    <section
      id="presence"
      className="v2-act v2-act--presence presence-act"
      data-act="presence"
      aria-labelledby="presence-title"
    >
      <div className="presence-act__light" aria-hidden="true" />
      <div className="presence-act__product">
        <Image
          src={V2_ASSETS.productForeground}
          alt="Close view of Xiao-An in physical space"
          fill
          loading="lazy"
          sizes="(max-width: 767px) 150vw, 82vw"
        />
      </div>

      <div className="presence-act__copy">
        <span>06 / PRESENCE</span>
        <h2 id="presence-title">
          <span>從虛擬中走出來，</span>
          <strong>在現實中走近你。</strong>
        </h2>
        <p lang="en">{act.en}</p>
      </div>

      <footer className="presence-act__footer">
        <div>
          <strong>XIAO-AN / 小安</strong>
          <span>INTELLIGENT DESKTOP COMPANION · HKUST(GZ) · 2026</span>
        </div>
        <nav aria-label="Closing links">
          <a href="#wake">EXPLORE AGAIN</a>
          <a href={V2_LINKS.github} target="_blank" rel="noreferrer">
            GITHUB
          </a>
        </nav>
      </footer>
    </section>
  );
}
