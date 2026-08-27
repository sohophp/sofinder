import { t as e } from "./jsx-runtime-CmCsaYvT.js";
import { t } from "./react-B5TC723I.js";
//#region src/components/EntryVisuals.tsx
var n = t(), r = e(), i = (e) => e.includes(".") && e.split(".").pop()?.toLowerCase() || "", a = (e, t) => t.includes(e), o = (e, t = null, n = !1) => {
	if (n) return "folder";
	let r = i(e), o = (t || "").toLowerCase();
	return r === "pdf" || o === "application/pdf" ? "pdf" : a(r, [
		"doc",
		"docx",
		"odt",
		"rtf"
	]) || o.includes("wordprocessing") || o.includes("msword") || o.includes("opendocument.text") ? "word" : a(r, [
		"xls",
		"xlsx",
		"ods",
		"csv",
		"tsv"
	]) || o.includes("spreadsheet") || o.includes("ms-excel") || o.includes("opendocument.spreadsheet") || o === "text/csv" ? "sheet" : a(r, [
		"ppt",
		"pptx",
		"odp"
	]) || o.includes("presentation") || o.includes("ms-powerpoint") ? "slides" : a(r, [
		"zip",
		"rar",
		"7z",
		"tar",
		"gz",
		"bz2",
		"xz",
		"tgz"
	]) || o.includes("zip") || o.includes("compressed") || o.includes("archive") ? "archive" : o.startsWith("image/") || a(r, [
		"jpg",
		"jpeg",
		"png",
		"gif",
		"webp",
		"avif",
		"bmp",
		"svg",
		"ico",
		"heic",
		"heif"
	]) ? "image" : o.startsWith("audio/") || a(r, [
		"mp3",
		"wav",
		"flac",
		"aac",
		"ogg",
		"m4a"
	]) ? "audio" : o.startsWith("video/") || a(r, [
		"mp4",
		"webm",
		"mov",
		"avi",
		"mkv",
		"m4v"
	]) ? "video" : a(r, [
		"js",
		"jsx",
		"ts",
		"tsx",
		"php",
		"py",
		"rb",
		"go",
		"rs",
		"java",
		"c",
		"cpp",
		"h",
		"css",
		"scss",
		"html",
		"xml",
		"json",
		"yaml",
		"yml",
		"sh",
		"sql"
	]) || ["application/json", "application/xml"].includes(o) ? "code" : o.startsWith("text/") || a(r, [
		"txt",
		"md",
		"log",
		"ini",
		"conf"
	]) ? "text" : "file";
}, s = (e) => /* @__PURE__ */ (0, r.jsxs)(r.Fragment, { children: [
	/* @__PURE__ */ (0, r.jsx)("path", {
		d: "M10 5h19l9 9v29H10z",
		fill: "currentColor",
		opacity: ".1"
	}),
	/* @__PURE__ */ (0, r.jsx)("path", {
		d: "M10 5h19l9 9v29H10zM29 5v10h9",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}),
	/* @__PURE__ */ (0, r.jsx)("rect", {
		x: "6",
		y: "27",
		width: "36",
		height: "14",
		rx: "3",
		fill: "currentColor"
	}),
	/* @__PURE__ */ (0, r.jsx)("text", {
		x: "24",
		y: "37",
		textAnchor: "middle",
		fontSize: 8.5,
		fontWeight: "800",
		fill: "white",
		stroke: "none",
		children: e
	})
] }), c = ({ kind: e, name: t = "", mimeType: n = null, directory: i = !1 }) => (e ?? (e = o(t, n, i)), e === "folder" ? /* @__PURE__ */ (0, r.jsxs)("svg", {
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, r.jsx)("path", {
		d: "M5 12h15l4 5h19v23H5z",
		fill: "currentColor",
		opacity: ".2"
	}), /* @__PURE__ */ (0, r.jsx)("path", {
		d: "M5 12h15l4 5h19v23H5z",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	})]
}) : e === "image" ? /* @__PURE__ */ (0, r.jsxs)("svg", {
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ (0, r.jsx)("rect", {
			x: "7",
			y: "5",
			width: "34",
			height: "38",
			rx: "4",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5"
		}),
		/* @__PURE__ */ (0, r.jsx)("circle", {
			cx: "17",
			cy: "16",
			r: "4",
			fill: "currentColor",
			opacity: ".35"
		}),
		/* @__PURE__ */ (0, r.jsx)("path", {
			d: "m10 37 10-11 7 7 5-5 7 9",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5",
			strokeLinejoin: "round"
		})
	]
}) : e === "pdf" ? /* @__PURE__ */ (0, r.jsx)("svg", {
	className: "sf-file-icon-pdf",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: s("PDF")
}) : e === "word" ? /* @__PURE__ */ (0, r.jsx)("svg", {
	className: "sf-file-icon-word",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: s("DOC")
}) : e === "sheet" ? /* @__PURE__ */ (0, r.jsx)("svg", {
	className: "sf-file-icon-sheet",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: s("XLS")
}) : e === "slides" ? /* @__PURE__ */ (0, r.jsx)("svg", {
	className: "sf-file-icon-slides",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: s("PPT")
}) : e === "archive" ? /* @__PURE__ */ (0, r.jsxs)("svg", {
	className: "sf-file-icon-archive",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ (0, r.jsx)("path", {
			d: "M10 5h19l9 9v29H10zM29 5v10h9",
			fill: "currentColor",
			opacity: ".1",
			stroke: "currentColor",
			strokeWidth: "2.5",
			strokeLinejoin: "round"
		}),
		/* @__PURE__ */ (0, r.jsx)("path", {
			d: "M23 7h5v5h-5v5h5v5h-5v5h5",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5"
		}),
		/* @__PURE__ */ (0, r.jsx)("rect", {
			x: "20",
			y: "28",
			width: "11",
			height: "10",
			rx: "2",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5"
		})
	]
}) : e === "audio" ? /* @__PURE__ */ (0, r.jsxs)("svg", {
	className: "sf-file-icon-audio",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ (0, r.jsx)("path", {
			d: "M18 36V13l20-4v22",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "3",
			strokeLinejoin: "round"
		}),
		/* @__PURE__ */ (0, r.jsx)("ellipse", {
			cx: "12",
			cy: "36",
			rx: "7",
			ry: "5",
			fill: "currentColor",
			opacity: ".75"
		}),
		/* @__PURE__ */ (0, r.jsx)("ellipse", {
			cx: "32",
			cy: "31",
			rx: "7",
			ry: "5",
			fill: "currentColor",
			opacity: ".75"
		})
	]
}) : e === "video" ? /* @__PURE__ */ (0, r.jsxs)("svg", {
	className: "sf-file-icon-video",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, r.jsx)("rect", {
		x: "5",
		y: "8",
		width: "38",
		height: "32",
		rx: "5",
		fill: "currentColor",
		opacity: ".12",
		stroke: "currentColor",
		strokeWidth: "2.5"
	}), /* @__PURE__ */ (0, r.jsx)("path", {
		d: "m20 17 13 7-13 7z",
		fill: "currentColor"
	})]
}) : e === "code" ? /* @__PURE__ */ (0, r.jsxs)("svg", {
	className: "sf-file-icon-code",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, r.jsx)("path", {
		d: "M10 5h19l9 9v29H10zM29 5v10h9",
		fill: "currentColor",
		opacity: ".08",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}), /* @__PURE__ */ (0, r.jsx)("path", {
		d: "m20 22-6 6 6 6m8-12 6 6-6 6m-2-15-4 18",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	})]
}) : e === "text" ? /* @__PURE__ */ (0, r.jsxs)("svg", {
	className: "sf-file-icon-text",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, r.jsx)("path", {
		d: "M10 5h19l9 9v29H10zM29 5v10h9",
		fill: "currentColor",
		opacity: ".08",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}), /* @__PURE__ */ (0, r.jsx)("path", {
		d: "M16 22h16M16 28h16M16 34h11",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinecap: "round"
	})]
}) : /* @__PURE__ */ (0, r.jsxs)("svg", {
	className: "sf-file-icon-generic",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, r.jsx)("path", {
		d: "M10 5h19l9 9v29H10z",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}), /* @__PURE__ */ (0, r.jsx)("path", {
		d: "M29 5v10h9",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5"
	})]
})), l = ({ src: e, alt: t, lazy: i = !1 }) => {
	let [a, o] = (0, n.useState)(0), [s, l] = (0, n.useState)(!1), u = (0, n.useRef)(null);
	if ((0, n.useEffect)(() => (o(0), l(!1), () => {
		u.current !== null && window.clearTimeout(u.current);
	}), [e]), s) return /* @__PURE__ */ (0, r.jsx)(c, { kind: "image" });
	let d = a === 0 ? e : `${e}${e.includes("?") ? "&" : "?"}retry=${a}`;
	return /* @__PURE__ */ (0, r.jsx)("img", {
		src: d,
		alt: t,
		loading: i ? "lazy" : void 0,
		decoding: "async",
		onError: () => {
			if (u.current !== null && window.clearTimeout(u.current), a >= 2) {
				l(!0);
				return;
			}
			u.current = window.setTimeout(() => o((e) => e + 1), 700 * (a + 1));
		}
	});
};
//#endregion
export { l as n, c as t };
