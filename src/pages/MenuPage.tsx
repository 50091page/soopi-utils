import { useNavigate } from "react-router-dom";

type MenuCard = {
  title: string;
  description: string;
  path?: string;
  tag: string;
  disabled?: boolean;
  decoImage?: string;
};

const MENU_CARDS: MenuCard[] = [
  {
    title: "팀 섞기",
    description: "LoL/PUBG 팀 랜덤 섞기",
    path: "/shuffle",
    tag: "UTILITY",
    decoImage: `${import.meta.env.BASE_URL}img/penguin.png`,
  },
  {
    title: "추가 기능 준비중...",
    description: "업데이트 예정입니다.",
    tag: "COMING SOON",
    disabled: true,
  },
];

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
      {MENU_CARDS.map((item) => (
        <article
          key={item.title}
          className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition duration-200 dark:border-slate-600 dark:bg-slate-800/85 dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] ${
            item.disabled
              ? "cursor-not-allowed opacity-72"
              : "cursor-pointer hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_44px_rgba(15,23,42,0.14)] dark:hover:border-slate-500"
          }`}
          onClick={() => {
            if (!item.disabled && item.path) {
              navigate(item.path);
            }
          }}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && !item.disabled && item.path) {
              event.preventDefault();
              navigate(item.path);
            }
          }}
          role={item.disabled ? undefined : "button"}
          tabIndex={item.disabled ? -1 : 0}
        >
          <span className="pointer-events-none absolute right-4 top-3 text-[52px] font-black leading-none text-slate-100 dark:text-slate-700">
            {item.tag === "UTILITY" ? "01" : "02"}
          </span>
          <div>
            <span className="inline-flex rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-slate-500 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-300">
              {item.tag}
            </span>
            <h2 className="mt-3 max-w-[86%] text-2xl font-semibold leading-tight text-slate-800 dark:text-slate-200">
              {item.title}
            </h2>
            <p className="mt-2 max-w-[88%] text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
          </div>
          {item.decoImage ? (
            <img
              src={item.decoImage}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 right-3 h-14 w-14 select-none object-contain opacity-95"
              loading="lazy"
            />
          ) : null}
          {item.disabled ? <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">준비중</p> : null}
        </article>
      ))}
      </div>
    </section>
  );
}
