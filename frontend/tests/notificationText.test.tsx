// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { NotificationText } from "../src/components/NotificationText";

afterEach(cleanup);

it("links each reference title while hiding relative and absolute URLs", () => {
  const text = "图片有引用：公司页面 (/newadmin/CompanyPage/edit/7?language_id=2&tab=content)；文章（https://cms.example/edit/8）。";
  const { container } = render(<NotificationText text={text}/>);
  expect(container.textContent).toBe("图片有引用：公司页面；文章。");
  expect(screen.getByRole("link", { name: "公司页面" })).toBeVisible();
  expect(screen.getByRole("link", { name: "文章" })).toBeVisible();
  expect(screen.getAllByRole("link")).toHaveLength(2);
  for (const link of screen.getAllByRole("link")) {
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  expect(screen.getAllByRole("link")[0]).toHaveAttribute("href", "/newadmin/CompanyPage/edit/7?language_id=2&tab=content");
});

it("keeps the complete reference title from the Winstar deletion notification", () => {
  const { container } = render(<NotificationText text="0 個已完成, 1 個失敗 · 123/README.md-qr.png：檔案或目錄仍有 1 筆引用：公司頁面 #49 · content · 語言 #209 (/winstar2024/newadmin/CompanyPage/edit/49?language_id=209)。請先移除引用。"/>);
  expect(screen.getByRole("link", { name: "公司頁面 #49 · content · 語言 #209" })).toHaveAttribute("href", "/winstar2024/newadmin/CompanyPage/edit/49?language_id=209");
  expect(container.textContent).not.toContain("/winstar2024/");
  expect(container.textContent).toContain("123/README.md-qr.png");
});

it("keeps unsafe URLs and HTML-looking labels as plain text", () => {
  const text = '<img src=x onerror=alert(1)> (javascript:alert(1)) (data:text/html,test) (//evil.example/x) (/\\evil.example/x) (https://user:secret@example.test/x)';
  const { container } = render(<NotificationText text={text}/>);
  expect(container.textContent).toBe(text);
  expect(screen.queryAllByRole("link")).toHaveLength(0);
  expect(container.querySelector("img")).toBeNull();
});
