import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

type MenuCardStatus = "active" | "comingSoon";
type MenuCardTone = "default" | "aim";

type MenuCard = {
  id: string;
  title: string;
  description: string;
  path?: string;
  tag: "UTILITY" | "MINIGAME" | "COMING SOON";
  status: MenuCardStatus;
  tone?: MenuCardTone;
  decoImage?: string;
  decoSize?: "default" | "small";
};

const MENU_CARDS: MenuCard[] = [
  {
    id: "shuffle",
    title: "팀 섞기",
    description: "LoL/PUBG 팀 랜덤 섞기",
    path: "/shuffle",
    tag: "UTILITY",
    status: "active",
    tone: "default",
    decoImage: `${import.meta.env.BASE_URL}img/penguin.png`,
    decoSize: "small",
  },
  {
    id: "aim-trainer",
    title: "에임 훈련장 (Aim Trainer)",
    description: "에임 훈련 미니게임",
    path: "/aim-trainer",
    tag: "MINIGAME",
    status: "active",
    tone: "aim",
    decoImage: `${import.meta.env.BASE_URL}img/penguin2.png`,
    decoSize: "small",
  },
];

type MenuCardItemProps = {
  card: MenuCard;
  order: number;
  onNavigate: (path: string) => void;
};

function MenuCardItem({ card, order, onNavigate }: MenuCardItemProps) {
  const isClickable = card.status === "active" && Boolean(card.path);
  const orderText = String(order).padStart(2, "0");

  const onCardClick = () => {
    if (isClickable && card.path) {
      onNavigate(card.path);
    }
  };

  const onCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if ((event.key === "Enter" || event.key === " ") && isClickable && card.path) {
      event.preventDefault();
      onNavigate(card.path);
    }
  };

  return (
    <article
      className={`menu-card menu-card-${card.status} menu-card-tone-${card.tone ?? "default"} ${
        isClickable ? "menu-card-clickable" : "menu-card-disabled"
      }`}
      onClick={onCardClick}
      onKeyDown={onCardKeyDown}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : -1}
    >
      <span className="menu-card-order" aria-hidden="true">
        {orderText}
      </span>

      <div>
        <span className={`menu-card-tag menu-card-tag-${card.status}`}>{card.tag}</span>
        <h2 className={`menu-card-title menu-card-title-${card.status}`}>{card.title}</h2>
        <p className={`menu-card-description menu-card-description-${card.status}`}>{card.description}</p>
      </div>

      {card.decoImage ? (
        <img
          src={card.decoImage}
          alt=""
          aria-hidden="true"
          className={`menu-card-deco-image${
            card.decoSize === "small" ? " menu-card-deco-image-small" : ""
          }`}
          loading="lazy"
        />
      ) : null}

    </article>
  );
}

export function MenuPage() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-[1120px] px-3 py-4">
      <div className="max-w-[980px]">
        <div className="mb-4">
          <p className="m-0 text-xs font-semibold tracking-[0.18em] text-slate-500 dark:text-slate-500">
            SELECT MODE
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {MENU_CARDS.map((card, index) => (
            <MenuCardItem key={card.id} card={card} order={index + 1} onNavigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
}
