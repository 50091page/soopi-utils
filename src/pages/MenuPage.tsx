import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

type MenuCardStatus = "active" | "comingSoon";

type MenuCard = {
  id: string;
  title: string;
  description: string;
  path?: string;
  tag: "UTILITY" | "COMING SOON";
  status: MenuCardStatus;
  decoImage?: string;
};

const MENU_CARDS: MenuCard[] = [
  {
    id: "shuffle",
    title: "팀 섞기",
    description: "LoL/PUBG 팀 랜덤 섞기",
    path: "/shuffle",
    tag: "UTILITY",
    status: "active",
    decoImage: `${import.meta.env.BASE_URL}img/penguin.png`,
  },
  {
    id: "coming-soon",
    title: "추가 기능 준비중...",
    description: "업데이트 예정입니다.",
    tag: "COMING SOON",
    status: "comingSoon",
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
      className={`menu-card menu-card-${card.status} ${
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
          className="menu-card-deco-image"
          loading="lazy"
        />
      ) : null}

      {card.status === "comingSoon" ? <p className="menu-card-soon-text">준비중</p> : null}
    </article>
  );
}

export function MenuPage() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-[980px] px-3 py-4">
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
    </section>
  );
}
