import { fallbackMenus, type MenuSeed } from "@/lib/menu-seed";
import { getSupabaseClient } from "@/lib/supabase";

export type Menu = {
  id: string;
  name: string;
  category: string;
};

function shuffle<T>(items: T[]): T[] {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

function normalizeMenu(menu: MenuSeed): Menu {
  return {
    id: String(menu.id),
    name: menu.name,
    category: menu.category,
  };
}

export async function getRandomMenus(count: number): Promise<Menu[]> {
  const desiredCount = Math.max(1, Math.min(count, 8));
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.from("menus").select("id,name,category");

      if (error) {
        console.error("[supabase] Failed to fetch menus from public.menus", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
      } else if (data && data.length > 0) {
        return shuffle(
          data.map((menu) => ({
            id: String(menu.id),
            name: menu.name,
            category: menu.category ?? "Other",
          })),
        ).slice(0, desiredCount);
      } else {
        console.warn(
          "[supabase] Query succeeded but returned no rows from public.menus. Using fallback menus.",
        );
      }
    } catch (error) {
      console.error("[supabase] Unexpected error while fetching menus", error);
    }
  }

  return shuffle(fallbackMenus.map(normalizeMenu)).slice(0, desiredCount);
}
