"use client";

import { useMemo, useState } from "react";

type Menu = {
  id: string;
  name: string;
  category: string;
};

type GraphQLResponse = {
  data?: {
    todayMenus: Menu[];
  };
  errors?: Array<{ message: string }>;
};

const roulettePalette = ["#cc5f2e", "#e07f41", "#f2a24f", "#f2c86b"];

const placeholderMenus: Menu[] = [
  { id: "placeholder-1", name: "메뉴 1", category: "-" },
  { id: "placeholder-2", name: "메뉴 2", category: "-" },
  { id: "placeholder-3", name: "메뉴 3", category: "-" },
  { id: "placeholder-4", name: "메뉴 4", category: "-" },
];

function buildConicGradient(itemCount: number): string {
  const step = 360 / Math.max(itemCount, 1);
  const segments = Array.from({ length: itemCount }, (_, index) => {
    const start = step * index;
    const end = step * (index + 1);
    return `${roulettePalette[index % roulettePalette.length]} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${segments.join(",")})`;
}

export function MenuRoulette() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<Menu | null>(null);
  const [spinDeg, setSpinDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const wheelMenus = menus.length > 0 ? menus : placeholderMenus;
  const wheelBackground = useMemo(
    () => buildConicGradient(wheelMenus.length),
    [wheelMenus.length],
  );

  const fetchMenus = async () => {
    setLoading(true);
    setError(null);
    setWinner(null);

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query:
            "query GetTodayMenus($count: Int!) { todayMenus(count: $count) { id name category } }",
          variables: { count: 4 },
        }),
      });

      if (!response.ok) {
        throw new Error(`요청 실패: ${response.status}`);
      }

      const payload = (await response.json()) as GraphQLResponse;
      if (payload.errors?.length) {
        throw new Error(payload.errors[0].message);
      }

      const nextMenus = payload.data?.todayMenus ?? [];
      if (nextMenus.length === 0) {
        throw new Error("추천 메뉴가 없습니다.");
      }

      setMenus(nextMenus);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "메뉴를 불러오는 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const spinRoulette = () => {
    if (menus.length === 0 || isSpinning) {
      return;
    }

    setIsSpinning(true);

    const nextWinnerIndex = Math.floor(Math.random() * menus.length);
    const arc = 360 / menus.length;
    const pointerAtTop = 270;
    const winnerCenter = nextWinnerIndex * arc + arc / 2;
    const target = (pointerAtTop - winnerCenter + 360) % 360;
    const extraSpins = 360 * (4 + Math.floor(Math.random() * 2));

    setSpinDeg((current) => {
      const currentNormalized = ((current % 360) + 360) % 360;
      const adjust = (target - currentNormalized + 360) % 360;
      return current + extraSpins + adjust;
    });

    window.setTimeout(() => {
      setWinner(menus[nextWinnerIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-8 px-6 py-14 md:px-10">
      <section className="rounded-3xl border border-black/10 bg-panel/85 p-6 shadow-[0_18px_70px_rgba(63,36,16,0.15)] backdrop-blur-sm md:p-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          오늘의 메뉴 룰렛
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          오늘의 메뉴 뽑기로 랜덤 4개를 받고, 룰렛으로 최종 1개를 선택하세요.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={fetchMenus}
            disabled={loading || isSpinning}
            className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "메뉴 불러오는 중..." : "오늘의 메뉴 뽑기"}
          </button>
          <button
            type="button"
            onClick={spinRoulette}
            disabled={menus.length === 0 || isSpinning || loading}
            className="rounded-xl border border-accent px-5 py-3 text-sm font-semibold text-accent transition hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSpinning ? "룰렛 회전 중..." : "룰렛 돌리기"}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      </section>

      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-black/10 bg-panel/80 p-6 shadow-[0_14px_45px_rgba(63,36,16,0.13)] md:p-8">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">
            추천 후보 메뉴
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {menus.length === 0 && (
              <li className="rounded-xl border border-dashed border-black/20 bg-white/40 p-4 text-sm text-muted">
                아직 후보가 없습니다. 먼저 메뉴를 뽑아주세요.
              </li>
            )}
            {menus.map((menu, index) => (
              <li
                key={menu.id}
                className="rounded-xl border border-black/10 bg-white/65 p-4"
              >
                <p className="text-xs font-semibold uppercase text-muted">
                  #{index + 1}
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {menu.name}
                </p>
                <p className="text-sm text-muted">{menu.category}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-black/10 bg-panel/80 p-6 shadow-[0_14px_45px_rgba(63,36,16,0.13)] md:p-8">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">
            룰렛
          </h2>
          <div className="relative mx-auto mt-6 w-full max-w-[320px]">
            <div className="absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 border-l-[12px] border-r-[12px] border-b-[24px] border-l-transparent border-r-transparent border-b-foreground" />
            <div
              className="relative aspect-square w-full rounded-full border-[10px] border-white shadow-[0_16px_40px_rgba(24,13,4,0.35)] transition-transform duration-[3000ms] ease-[cubic-bezier(0.12,0.72,0.03,1)]"
              style={{
                background: wheelBackground,
                transform: `rotate(${spinDeg}deg)`,
              }}
            >
              {wheelMenus.map((menu, index) => {
                const arc = 360 / wheelMenus.length;
                const angle = arc * index + arc / 2;
                const radian = (angle * Math.PI) / 180;
                const x = 50 + Math.cos(radian) * 34;
                const y = 50 + Math.sin(radian) * 34;

                return (
                  <div
                    key={menu.id}
                    className="pointer-events-none absolute"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span
                      className="block max-w-[92px] rounded-md bg-white/85 px-2 py-1 text-center text-xs font-bold text-[#3f2410] shadow-sm transition-transform duration-[3000ms] ease-[cubic-bezier(0.12,0.72,0.03,1)]"
                      style={{
                        transform: `rotate(${-spinDeg}deg)`,
                      }}
                    >
                      {menu.name}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-foreground/90" />
          </div>
          <p className="mt-6 min-h-7 text-base font-semibold text-foreground">
            {winner
              ? `오늘의 최종 메뉴: ${winner.name}`
              : "룰렛을 돌려 최종 메뉴를 정해보세요."}
          </p>
        </div>
      </section>
    </main>
  );
}
