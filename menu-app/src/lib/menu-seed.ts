export type MenuSeed = {
  id: string;
  name: string;
  category: string;
};

export const fallbackMenus: MenuSeed[] = [
  { id: "1", name: "김치찌개", category: "한식" },
  { id: "2", name: "된장찌개", category: "한식" },
  { id: "3", name: "부대찌개", category: "한식" },
  { id: "4", name: "제육볶음", category: "한식" },
  { id: "5", name: "초밥", category: "일식" },
  { id: "6", name: "라멘", category: "일식" },
  { id: "7", name: "돈카츠", category: "일식" },
  { id: "8", name: "마라탕", category: "중식" },
  { id: "9", name: "짜장면", category: "중식" },
  { id: "10", name: "짬뽕", category: "중식" },
  { id: "11", name: "파스타", category: "양식" },
  { id: "12", name: "리조또", category: "양식" },
  { id: "13", name: "햄버거", category: "패스트푸드" },
  { id: "14", name: "샐러드볼", category: "샐러드" },
  { id: "15", name: "포케", category: "하와이안" },
];
