import { n as e, r as t, t as n } from "./jsx-runtime-CmCsaYvT.js";
import { t as r } from "./react-B5TC723I.js";
import { t as i } from "./UiIcon-JdLj8VHV.js";
import { t as a } from "./Modal-ClPLM5jI.js";
import { t as o } from "./nameValidation-DURyMFRU.js";
//#region node_modules/.pnpm/cropperjs@1.6.2/node_modules/cropperjs/dist/cropper.js
var s = /* @__PURE__ */ e(((e, t) => {
	(function(n, r) {
		typeof e == "object" && t !== void 0 ? t.exports = r() : typeof define == "function" && define.amd ? define(r) : (n = typeof globalThis < "u" ? globalThis : n || self, n.Cropper = r());
	})(e, (function() {
		function e(e, t) {
			var n = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var r = Object.getOwnPropertySymbols(e);
				t && (r = r.filter(function(t) {
					return Object.getOwnPropertyDescriptor(e, t).enumerable;
				})), n.push.apply(n, r);
			}
			return n;
		}
		function t(t) {
			for (var n = 1; n < arguments.length; n++) {
				var r = arguments[n] == null ? {} : arguments[n];
				n % 2 ? e(Object(r), !0).forEach(function(e) {
					c(t, e, r[e]);
				}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : e(Object(r)).forEach(function(e) {
					Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e));
				});
			}
			return t;
		}
		function n(e, t) {
			if (typeof e != "object" || !e) return e;
			var n = e[Symbol.toPrimitive];
			if (n !== void 0) {
				var r = n.call(e, t || "default");
				if (typeof r != "object") return r;
				throw TypeError("@@toPrimitive must return a primitive value.");
			}
			return (t === "string" ? String : Number)(e);
		}
		function r(e) {
			var t = n(e, "string");
			return typeof t == "symbol" ? t : t + "";
		}
		function i(e) {
			"@babel/helpers - typeof";
			return i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
				return typeof e;
			} : function(e) {
				return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
			}, i(e);
		}
		function a(e, t) {
			if (!(e instanceof t)) throw TypeError("Cannot call a class as a function");
		}
		function o(e, t) {
			for (var n = 0; n < t.length; n++) {
				var i = t[n];
				i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, r(i.key), i);
			}
		}
		function s(e, t, n) {
			return t && o(e.prototype, t), n && o(e, n), Object.defineProperty(e, "prototype", { writable: !1 }), e;
		}
		function c(e, t, n) {
			return t = r(t), t in e ? Object.defineProperty(e, t, {
				value: n,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[t] = n, e;
		}
		function l(e) {
			return u(e) || d(e) || f(e) || m();
		}
		function u(e) {
			if (Array.isArray(e)) return p(e);
		}
		function d(e) {
			if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
		}
		function f(e, t) {
			if (e) {
				if (typeof e == "string") return p(e, t);
				var n = Object.prototype.toString.call(e).slice(8, -1);
				if (n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set") return Array.from(e);
				if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return p(e, t);
			}
		}
		function p(e, t) {
			(t == null || t > e.length) && (t = e.length);
			for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
			return r;
		}
		function m() {
			throw TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var h = typeof window < "u" && window.document !== void 0, g = h ? window : {}, _ = h && g.document.documentElement ? "ontouchstart" in g.document.documentElement : !1, v = h ? "PointerEvent" in g : !1, y = "cropper", ee = "all", b = "crop", x = "move", S = "zoom", C = "e", w = "w", T = "s", E = "n", D = "ne", O = "nw", k = "se", A = "sw", j = `${y}-crop`, M = `${y}-disabled`, N = `${y}-hidden`, P = `${y}-hide`, te = `${y}-invisible`, ne = `${y}-modal`, F = `${y}-move`, re = `${y}Action`, I = `${y}Preview`, ie = "crop", ae = "move", oe = "none", se = "crop", ce = "cropend", le = "cropmove", ue = "cropstart", de = "dblclick", fe = _ ? "touchstart" : "mousedown", pe = _ ? "touchmove" : "mousemove", me = _ ? "touchend touchcancel" : "mouseup", he = v ? "pointerdown" : fe, ge = v ? "pointermove" : pe, L = v ? "pointerup pointercancel" : me, _e = "ready", ve = "resize", ye = "wheel", be = "zoom", xe = "image/jpeg", Se = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/, Ce = /^data:/, we = /^data:image\/jpeg;base64,/, Te = /^img|canvas$/i, Ee = 200, De = 100, Oe = {
			viewMode: 0,
			dragMode: ie,
			initialAspectRatio: NaN,
			aspectRatio: NaN,
			data: null,
			preview: "",
			responsive: !0,
			restore: !0,
			checkCrossOrigin: !0,
			checkOrientation: !0,
			modal: !0,
			guides: !0,
			center: !0,
			highlight: !0,
			background: !0,
			autoCrop: !0,
			autoCropArea: .8,
			movable: !0,
			rotatable: !0,
			scalable: !0,
			zoomable: !0,
			zoomOnTouch: !0,
			zoomOnWheel: !0,
			wheelZoomRatio: .1,
			cropBoxMovable: !0,
			cropBoxResizable: !0,
			toggleDragModeOnDblclick: !0,
			minCanvasWidth: 0,
			minCanvasHeight: 0,
			minCropBoxWidth: 0,
			minCropBoxHeight: 0,
			minContainerWidth: Ee,
			minContainerHeight: De,
			ready: null,
			cropstart: null,
			cropmove: null,
			cropend: null,
			crop: null,
			zoom: null
		}, ke = "<div class=\"cropper-container\" touch-action=\"none\"><div class=\"cropper-wrap-box\"><div class=\"cropper-canvas\"></div></div><div class=\"cropper-drag-box\"></div><div class=\"cropper-crop-box\"><span class=\"cropper-view-box\"></span><span class=\"cropper-dashed dashed-h\"></span><span class=\"cropper-dashed dashed-v\"></span><span class=\"cropper-center\"></span><span class=\"cropper-face\"></span><span class=\"cropper-line line-e\" data-cropper-action=\"e\"></span><span class=\"cropper-line line-n\" data-cropper-action=\"n\"></span><span class=\"cropper-line line-w\" data-cropper-action=\"w\"></span><span class=\"cropper-line line-s\" data-cropper-action=\"s\"></span><span class=\"cropper-point point-e\" data-cropper-action=\"e\"></span><span class=\"cropper-point point-n\" data-cropper-action=\"n\"></span><span class=\"cropper-point point-w\" data-cropper-action=\"w\"></span><span class=\"cropper-point point-s\" data-cropper-action=\"s\"></span><span class=\"cropper-point point-ne\" data-cropper-action=\"ne\"></span><span class=\"cropper-point point-nw\" data-cropper-action=\"nw\"></span><span class=\"cropper-point point-sw\" data-cropper-action=\"sw\"></span><span class=\"cropper-point point-se\" data-cropper-action=\"se\"></span></div></div>", R = Number.isNaN || g.isNaN;
		function z(e) {
			return typeof e == "number" && !R(e);
		}
		var B = function(e) {
			return e > 0 && e < Infinity;
		};
		function Ae(e) {
			return e === void 0;
		}
		function V(e) {
			return i(e) === "object" && e !== null;
		}
		var je = Object.prototype.hasOwnProperty;
		function Me(e) {
			if (!V(e)) return !1;
			try {
				var t = e.constructor, n = t.prototype;
				return t && n && je.call(n, "isPrototypeOf");
			} catch {
				return !1;
			}
		}
		function H(e) {
			return typeof e == "function";
		}
		var Ne = Array.prototype.slice;
		function Pe(e) {
			return Array.from ? Array.from(e) : Ne.call(e);
		}
		function U(e, t) {
			return e && H(t) && (Array.isArray(e) || z(e.length) ? Pe(e).forEach(function(n, r) {
				t.call(e, n, r, e);
			}) : V(e) && Object.keys(e).forEach(function(n) {
				t.call(e, e[n], n, e);
			})), e;
		}
		var W = Object.assign || function(e) {
			var t = [...arguments].slice(1);
			return V(e) && t.length > 0 && t.forEach(function(t) {
				V(t) && Object.keys(t).forEach(function(n) {
					e[n] = t[n];
				});
			}), e;
		}, Fe = /\.\d*(?:0|9){12}\d*$/;
		function Ie(e) {
			var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1e11;
			return Fe.test(e) ? Math.round(e * t) / t : e;
		}
		var Le = /^width|height|left|top|marginLeft|marginTop$/;
		function G(e, t) {
			var n = e.style;
			U(t, function(e, t) {
				Le.test(t) && z(e) && (e = `${e}px`), n[t] = e;
			});
		}
		function Re(e, t) {
			return e.classList ? e.classList.contains(t) : e.className.indexOf(t) > -1;
		}
		function K(e, t) {
			if (t) {
				if (z(e.length)) {
					U(e, function(e) {
						K(e, t);
					});
					return;
				}
				if (e.classList) {
					e.classList.add(t);
					return;
				}
				var n = e.className.trim();
				n ? n.indexOf(t) < 0 && (e.className = `${n} ${t}`) : e.className = t;
			}
		}
		function q(e, t) {
			if (t) {
				if (z(e.length)) {
					U(e, function(e) {
						q(e, t);
					});
					return;
				}
				if (e.classList) {
					e.classList.remove(t);
					return;
				}
				e.className.indexOf(t) >= 0 && (e.className = e.className.replace(t, ""));
			}
		}
		function J(e, t, n) {
			if (t) {
				if (z(e.length)) {
					U(e, function(e) {
						J(e, t, n);
					});
					return;
				}
				n ? K(e, t) : q(e, t);
			}
		}
		var ze = /([a-z\d])([A-Z])/g;
		function Be(e) {
			return e.replace(ze, "$1-$2").toLowerCase();
		}
		function Y(e, t) {
			return V(e[t]) ? e[t] : e.dataset ? e.dataset[t] : e.getAttribute(`data-${Be(t)}`);
		}
		function Ve(e, t, n) {
			V(n) ? e[t] = n : e.dataset ? e.dataset[t] = n : e.setAttribute(`data-${Be(t)}`, n);
		}
		function He(e, t) {
			if (V(e[t])) try {
				delete e[t];
			} catch {
				e[t] = void 0;
			}
			else if (e.dataset) try {
				delete e.dataset[t];
			} catch {
				e.dataset[t] = void 0;
			}
			else e.removeAttribute(`data-${Be(t)}`);
		}
		var Ue = /\s\s*/, We = function() {
			var e = !1;
			if (h) {
				var t = !1, n = function() {}, r = Object.defineProperty({}, "once", {
					get: function() {
						return e = !0, t;
					},
					set: function(e) {
						t = e;
					}
				});
				g.addEventListener("test", n, r), g.removeEventListener("test", n, r);
			}
			return e;
		}();
		function X(e, t, n) {
			var r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, i = n;
			t.trim().split(Ue).forEach(function(t) {
				if (!We) {
					var a = e.listeners;
					a && a[t] && a[t][n] && (i = a[t][n], delete a[t][n], Object.keys(a[t]).length === 0 && delete a[t], Object.keys(a).length === 0 && delete e.listeners);
				}
				e.removeEventListener(t, i, r);
			});
		}
		function Z(e, t, n) {
			var r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, i = n;
			t.trim().split(Ue).forEach(function(t) {
				if (r.once && !We) {
					var a = e.listeners, o = a === void 0 ? {} : a;
					i = function() {
						delete o[t][n], e.removeEventListener(t, i, r);
						var a = [...arguments];
						n.apply(e, a);
					}, o[t] || (o[t] = {}), o[t][n] && e.removeEventListener(t, o[t][n], r), o[t][n] = i, e.listeners = o;
				}
				e.addEventListener(t, i, r);
			});
		}
		function Ge(e, t, n) {
			var r;
			return H(Event) && H(CustomEvent) ? r = new CustomEvent(t, {
				detail: n,
				bubbles: !0,
				cancelable: !0
			}) : (r = document.createEvent("CustomEvent"), r.initCustomEvent(t, !0, !0, n)), e.dispatchEvent(r);
		}
		function Ke(e) {
			var t = e.getBoundingClientRect();
			return {
				left: t.left + (window.pageXOffset - document.documentElement.clientLeft),
				top: t.top + (window.pageYOffset - document.documentElement.clientTop)
			};
		}
		var qe = g.location, Je = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;
		function Ye(e) {
			var t = e.match(Je);
			return t !== null && (t[1] !== qe.protocol || t[2] !== qe.hostname || t[3] !== qe.port);
		}
		function Xe(e) {
			var t = `timestamp=${(/* @__PURE__ */ new Date()).getTime()}`;
			return e + (e.indexOf("?") === -1 ? "?" : "&") + t;
		}
		function Ze(e) {
			var t = e.rotate, n = e.scaleX, r = e.scaleY, i = e.translateX, a = e.translateY, o = [];
			z(i) && i !== 0 && o.push(`translateX(${i}px)`), z(a) && a !== 0 && o.push(`translateY(${a}px)`), z(t) && t !== 0 && o.push(`rotate(${t}deg)`), z(n) && n !== 1 && o.push(`scaleX(${n})`), z(r) && r !== 1 && o.push(`scaleY(${r})`);
			var s = o.length ? o.join(" ") : "none";
			return {
				WebkitTransform: s,
				msTransform: s,
				transform: s
			};
		}
		function Qe(e) {
			var n = t({}, e), r = 0;
			return U(e, function(e, t) {
				delete n[t], U(n, function(t) {
					var n = Math.abs(e.startX - t.startX), i = Math.abs(e.startY - t.startY), a = Math.abs(e.endX - t.endX), o = Math.abs(e.endY - t.endY), s = Math.sqrt(n * n + i * i), c = (Math.sqrt(a * a + o * o) - s) / s;
					Math.abs(c) > Math.abs(r) && (r = c);
				});
			}), r;
		}
		function $e(e, n) {
			var r = e.pageX, i = e.pageY, a = {
				endX: r,
				endY: i
			};
			return n ? a : t({
				startX: r,
				startY: i
			}, a);
		}
		function et(e) {
			var t = 0, n = 0, r = 0;
			return U(e, function(e) {
				var i = e.startX, a = e.startY;
				t += i, n += a, r += 1;
			}), t /= r, n /= r, {
				pageX: t,
				pageY: n
			};
		}
		function Q(e) {
			var t = e.aspectRatio, n = e.height, r = e.width, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "contain", a = B(r), o = B(n);
			if (a && o) {
				var s = n * t;
				i === "contain" && s > r || i === "cover" && s < r ? n = r / t : r = n * t;
			} else a ? n = r / t : o && (r = n * t);
			return {
				width: r,
				height: n
			};
		}
		function tt(e) {
			var t = e.width, n = e.height, r = e.degree;
			if (r = Math.abs(r) % 180, r === 90) return {
				width: n,
				height: t
			};
			var i = r % 90 * Math.PI / 180, a = Math.sin(i), o = Math.cos(i), s = t * o + n * a, c = t * a + n * o;
			return r > 90 ? {
				width: c,
				height: s
			} : {
				width: s,
				height: c
			};
		}
		function nt(e, t, n, r) {
			var i = t.aspectRatio, a = t.naturalWidth, o = t.naturalHeight, s = t.rotate, c = s === void 0 ? 0 : s, u = t.scaleX, d = u === void 0 ? 1 : u, f = t.scaleY, p = f === void 0 ? 1 : f, m = n.aspectRatio, h = n.naturalWidth, g = n.naturalHeight, _ = r.fillColor, v = _ === void 0 ? "transparent" : _, y = r.imageSmoothingEnabled, ee = y === void 0 || y, b = r.imageSmoothingQuality, x = b === void 0 ? "low" : b, S = r.maxWidth, C = S === void 0 ? Infinity : S, w = r.maxHeight, T = w === void 0 ? Infinity : w, E = r.minWidth, D = E === void 0 ? 0 : E, O = r.minHeight, k = O === void 0 ? 0 : O, A = document.createElement("canvas"), j = A.getContext("2d"), M = Q({
				aspectRatio: m,
				width: C,
				height: T
			}), N = Q({
				aspectRatio: m,
				width: D,
				height: k
			}, "cover"), P = Math.min(M.width, Math.max(N.width, h)), te = Math.min(M.height, Math.max(N.height, g)), ne = Q({
				aspectRatio: i,
				width: C,
				height: T
			}), F = Q({
				aspectRatio: i,
				width: D,
				height: k
			}, "cover"), re = Math.min(ne.width, Math.max(F.width, a)), I = Math.min(ne.height, Math.max(F.height, o)), ie = [
				-re / 2,
				-I / 2,
				re,
				I
			];
			return A.width = Ie(P), A.height = Ie(te), j.fillStyle = v, j.fillRect(0, 0, P, te), j.save(), j.translate(P / 2, te / 2), j.rotate(c * Math.PI / 180), j.scale(d, p), j.imageSmoothingEnabled = ee, j.imageSmoothingQuality = x, j.drawImage.apply(j, [e].concat(l(ie.map(function(e) {
				return Math.floor(Ie(e));
			})))), j.restore(), A;
		}
		var rt = String.fromCharCode;
		function it(e, t, n) {
			var r = "";
			n += t;
			for (var i = t; i < n; i += 1) r += rt(e.getUint8(i));
			return r;
		}
		var at = /^data:.*,/;
		function ot(e) {
			var t = e.replace(at, ""), n = atob(t), r = new ArrayBuffer(n.length), i = new Uint8Array(r);
			return U(i, function(e, t) {
				i[t] = n.charCodeAt(t);
			}), r;
		}
		function st(e, t) {
			for (var n = [], r = 8192, i = new Uint8Array(e); i.length > 0;) n.push(rt.apply(null, Pe(i.subarray(0, r)))), i = i.subarray(r);
			return `data:${t};base64,${btoa(n.join(""))}`;
		}
		function ct(e) {
			var t = new DataView(e), n;
			try {
				var r, i, a;
				if (t.getUint8(0) === 255 && t.getUint8(1) === 216) for (var o = t.byteLength, s = 2; s + 1 < o;) {
					if (t.getUint8(s) === 255 && t.getUint8(s + 1) === 225) {
						i = s;
						break;
					}
					s += 1;
				}
				if (i) {
					var c = i + 4, l = i + 10;
					if (it(t, c, 4) === "Exif") {
						var u = t.getUint16(l);
						if (r = u === 18761, (r || u === 19789) && t.getUint16(l + 2, r) === 42) {
							var d = t.getUint32(l + 4, r);
							d >= 8 && (a = l + d);
						}
					}
				}
				if (a) {
					var f = t.getUint16(a, r), p, m;
					for (m = 0; m < f; m += 1) if (p = a + m * 12 + 2, t.getUint16(p, r) === 274) {
						p += 8, n = t.getUint16(p, r), t.setUint16(p, 1, r);
						break;
					}
				}
			} catch {
				n = 1;
			}
			return n;
		}
		function lt(e) {
			var t = 0, n = 1, r = 1;
			switch (e) {
				case 2:
					n = -1;
					break;
				case 3:
					t = -180;
					break;
				case 4:
					r = -1;
					break;
				case 5:
					t = 90, r = -1;
					break;
				case 6:
					t = 90;
					break;
				case 7:
					t = 90, n = -1;
					break;
				case 8: t = -90;
			}
			return {
				rotate: t,
				scaleX: n,
				scaleY: r
			};
		}
		var ut = {
			render: function() {
				this.initContainer(), this.initCanvas(), this.initCropBox(), this.renderCanvas(), this.cropped && this.renderCropBox();
			},
			initContainer: function() {
				var e = this.element, t = this.options, n = this.container, r = this.cropper, i = Number(t.minContainerWidth), a = Number(t.minContainerHeight);
				K(r, N), q(e, N);
				var o = {
					width: Math.max(n.offsetWidth, i >= 0 ? i : Ee),
					height: Math.max(n.offsetHeight, a >= 0 ? a : De)
				};
				this.containerData = o, G(r, {
					width: o.width,
					height: o.height
				}), K(e, N), q(r, N);
			},
			initCanvas: function() {
				var e = this.containerData, t = this.imageData, n = this.options.viewMode, r = Math.abs(t.rotate) % 180 == 90, i = r ? t.naturalHeight : t.naturalWidth, a = r ? t.naturalWidth : t.naturalHeight, o = i / a, s = e.width, c = e.height;
				e.height * o > e.width ? n === 3 ? s = e.height * o : c = e.width / o : n === 3 ? c = e.width / o : s = e.height * o;
				var l = {
					aspectRatio: o,
					naturalWidth: i,
					naturalHeight: a,
					width: s,
					height: c
				};
				this.canvasData = l, this.limited = n === 1 || n === 2, this.limitCanvas(!0, !0), l.width = Math.min(Math.max(l.width, l.minWidth), l.maxWidth), l.height = Math.min(Math.max(l.height, l.minHeight), l.maxHeight), l.left = (e.width - l.width) / 2, l.top = (e.height - l.height) / 2, l.oldLeft = l.left, l.oldTop = l.top, this.initialCanvasData = W({}, l);
			},
			limitCanvas: function(e, t) {
				var n = this.options, r = this.containerData, i = this.canvasData, a = this.cropBoxData, o = n.viewMode, s = i.aspectRatio, c = this.cropped && a;
				if (e) {
					var l = Number(n.minCanvasWidth) || 0, u = Number(n.minCanvasHeight) || 0;
					o > 1 ? (l = Math.max(l, r.width), u = Math.max(u, r.height), o === 3 && (u * s > l ? l = u * s : u = l / s)) : o > 0 && (l ? l = Math.max(l, c ? a.width : 0) : u ? u = Math.max(u, c ? a.height : 0) : c && (l = a.width, u = a.height, u * s > l ? l = u * s : u = l / s));
					var d = Q({
						aspectRatio: s,
						width: l,
						height: u
					});
					l = d.width, u = d.height, i.minWidth = l, i.minHeight = u, i.maxWidth = Infinity, i.maxHeight = Infinity;
				}
				if (t) {
					if (o > +!c) {
						var f = r.width - i.width, p = r.height - i.height;
						i.minLeft = Math.min(0, f), i.minTop = Math.min(0, p), i.maxLeft = Math.max(0, f), i.maxTop = Math.max(0, p), c && this.limited && (i.minLeft = Math.min(a.left, a.left + (a.width - i.width)), i.minTop = Math.min(a.top, a.top + (a.height - i.height)), i.maxLeft = a.left, i.maxTop = a.top, o === 2 && (i.width >= r.width && (i.minLeft = Math.min(0, f), i.maxLeft = Math.max(0, f)), i.height >= r.height && (i.minTop = Math.min(0, p), i.maxTop = Math.max(0, p))));
					} else i.minLeft = -i.width, i.minTop = -i.height, i.maxLeft = r.width, i.maxTop = r.height;
				}
			},
			renderCanvas: function(e, t) {
				var n = this.canvasData, r = this.imageData;
				if (t) {
					var i = tt({
						width: r.naturalWidth * Math.abs(r.scaleX || 1),
						height: r.naturalHeight * Math.abs(r.scaleY || 1),
						degree: r.rotate || 0
					}), a = i.width, o = i.height, s = n.width * (a / n.naturalWidth), c = n.height * (o / n.naturalHeight);
					n.left -= (s - n.width) / 2, n.top -= (c - n.height) / 2, n.width = s, n.height = c, n.aspectRatio = a / o, n.naturalWidth = a, n.naturalHeight = o, this.limitCanvas(!0, !1);
				}
				(n.width > n.maxWidth || n.width < n.minWidth) && (n.left = n.oldLeft), (n.height > n.maxHeight || n.height < n.minHeight) && (n.top = n.oldTop), n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth), n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight), this.limitCanvas(!1, !0), n.left = Math.min(Math.max(n.left, n.minLeft), n.maxLeft), n.top = Math.min(Math.max(n.top, n.minTop), n.maxTop), n.oldLeft = n.left, n.oldTop = n.top, G(this.canvas, W({
					width: n.width,
					height: n.height
				}, Ze({
					translateX: n.left,
					translateY: n.top
				}))), this.renderImage(e), this.cropped && this.limited && this.limitCropBox(!0, !0);
			},
			renderImage: function(e) {
				var t = this.canvasData, n = this.imageData, r = n.naturalWidth * (t.width / t.naturalWidth), i = n.naturalHeight * (t.height / t.naturalHeight);
				W(n, {
					width: r,
					height: i,
					left: (t.width - r) / 2,
					top: (t.height - i) / 2
				}), G(this.image, W({
					width: n.width,
					height: n.height
				}, Ze(W({
					translateX: n.left,
					translateY: n.top
				}, n)))), e && this.output();
			},
			initCropBox: function() {
				var e = this.options, t = this.canvasData, n = e.aspectRatio || e.initialAspectRatio, r = Number(e.autoCropArea) || .8, i = {
					width: t.width,
					height: t.height
				};
				n && (t.height * n > t.width ? i.height = i.width / n : i.width = i.height * n), this.cropBoxData = i, this.limitCropBox(!0, !0), i.width = Math.min(Math.max(i.width, i.minWidth), i.maxWidth), i.height = Math.min(Math.max(i.height, i.minHeight), i.maxHeight), i.width = Math.max(i.minWidth, i.width * r), i.height = Math.max(i.minHeight, i.height * r), i.left = t.left + (t.width - i.width) / 2, i.top = t.top + (t.height - i.height) / 2, i.oldLeft = i.left, i.oldTop = i.top, this.initialCropBoxData = W({}, i);
			},
			limitCropBox: function(e, t) {
				var n = this.options, r = this.containerData, i = this.canvasData, a = this.cropBoxData, o = this.limited, s = n.aspectRatio;
				if (e) {
					var c = Number(n.minCropBoxWidth) || 0, l = Number(n.minCropBoxHeight) || 0, u = o ? Math.min(r.width, i.width, i.width + i.left, r.width - i.left) : r.width, d = o ? Math.min(r.height, i.height, i.height + i.top, r.height - i.top) : r.height;
					c = Math.min(c, r.width), l = Math.min(l, r.height), s && (c && l ? l * s > c ? l = c / s : c = l * s : c ? l = c / s : l && (c = l * s), d * s > u ? d = u / s : u = d * s), a.minWidth = Math.min(c, u), a.minHeight = Math.min(l, d), a.maxWidth = u, a.maxHeight = d;
				}
				t && (o ? (a.minLeft = Math.max(0, i.left), a.minTop = Math.max(0, i.top), a.maxLeft = Math.min(r.width, i.left + i.width) - a.width, a.maxTop = Math.min(r.height, i.top + i.height) - a.height) : (a.minLeft = 0, a.minTop = 0, a.maxLeft = r.width - a.width, a.maxTop = r.height - a.height));
			},
			renderCropBox: function() {
				var e = this.options, t = this.containerData, n = this.cropBoxData;
				(n.width > n.maxWidth || n.width < n.minWidth) && (n.left = n.oldLeft), (n.height > n.maxHeight || n.height < n.minHeight) && (n.top = n.oldTop), n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth), n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight), this.limitCropBox(!1, !0), n.left = Math.min(Math.max(n.left, n.minLeft), n.maxLeft), n.top = Math.min(Math.max(n.top, n.minTop), n.maxTop), n.oldLeft = n.left, n.oldTop = n.top, e.movable && e.cropBoxMovable && Ve(this.face, re, n.width >= t.width && n.height >= t.height ? x : ee), G(this.cropBox, W({
					width: n.width,
					height: n.height
				}, Ze({
					translateX: n.left,
					translateY: n.top
				}))), this.cropped && this.limited && this.limitCanvas(!0, !0), this.disabled || this.output();
			},
			output: function() {
				this.preview(), Ge(this.element, se, this.getData());
			}
		}, dt = {
			initPreview: function() {
				var e = this.element, t = this.crossOrigin, n = this.options.preview, r = t ? this.crossOriginUrl : this.url, i = e.alt || "The image to preview", a = document.createElement("img");
				if (t && (a.crossOrigin = t), a.src = r, a.alt = i, this.viewBox.appendChild(a), this.viewBoxImage = a, n) {
					var o = n;
					typeof n == "string" ? o = e.ownerDocument.querySelectorAll(n) : n.querySelector && (o = [n]), this.previews = o, U(o, function(e) {
						var n = document.createElement("img");
						Ve(e, I, {
							width: e.offsetWidth,
							height: e.offsetHeight,
							html: e.innerHTML
						}), t && (n.crossOrigin = t), n.src = r, n.alt = i, n.style.cssText = "display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;\"", e.innerHTML = "", e.appendChild(n);
					});
				}
			},
			resetPreview: function() {
				U(this.previews, function(e) {
					var t = Y(e, I);
					G(e, {
						width: t.width,
						height: t.height
					}), e.innerHTML = t.html, He(e, I);
				});
			},
			preview: function() {
				var e = this.imageData, t = this.canvasData, n = this.cropBoxData, r = n.width, i = n.height, a = e.width, o = e.height, s = n.left - t.left - e.left, c = n.top - t.top - e.top;
				!this.cropped || this.disabled || (G(this.viewBoxImage, W({
					width: a,
					height: o
				}, Ze(W({
					translateX: -s,
					translateY: -c
				}, e)))), U(this.previews, function(t) {
					var n = Y(t, I), l = n.width, u = n.height, d = l, f = u, p = 1;
					r && (p = l / r, f = i * p), i && f > u && (p = u / i, d = r * p, f = u), G(t, {
						width: d,
						height: f
					}), G(t.getElementsByTagName("img")[0], W({
						width: a * p,
						height: o * p
					}, Ze(W({
						translateX: -s * p,
						translateY: -c * p
					}, e))));
				}));
			}
		}, ft = {
			bind: function() {
				var e = this.element, t = this.options, n = this.cropper;
				H(t.cropstart) && Z(e, ue, t.cropstart), H(t.cropmove) && Z(e, le, t.cropmove), H(t.cropend) && Z(e, ce, t.cropend), H(t.crop) && Z(e, se, t.crop), H(t.zoom) && Z(e, be, t.zoom), Z(n, he, this.onCropStart = this.cropStart.bind(this)), t.zoomable && t.zoomOnWheel && Z(n, ye, this.onWheel = this.wheel.bind(this), {
					passive: !1,
					capture: !0
				}), t.toggleDragModeOnDblclick && Z(n, de, this.onDblclick = this.dblclick.bind(this)), Z(e.ownerDocument, ge, this.onCropMove = this.cropMove.bind(this)), Z(e.ownerDocument, L, this.onCropEnd = this.cropEnd.bind(this)), t.responsive && Z(window, ve, this.onResize = this.resize.bind(this));
			},
			unbind: function() {
				var e = this.element, t = this.options, n = this.cropper;
				H(t.cropstart) && X(e, ue, t.cropstart), H(t.cropmove) && X(e, le, t.cropmove), H(t.cropend) && X(e, ce, t.cropend), H(t.crop) && X(e, se, t.crop), H(t.zoom) && X(e, be, t.zoom), X(n, he, this.onCropStart), t.zoomable && t.zoomOnWheel && X(n, ye, this.onWheel, {
					passive: !1,
					capture: !0
				}), t.toggleDragModeOnDblclick && X(n, de, this.onDblclick), X(e.ownerDocument, ge, this.onCropMove), X(e.ownerDocument, L, this.onCropEnd), t.responsive && X(window, ve, this.onResize);
			}
		}, pt = {
			resize: function() {
				if (!this.disabled) {
					var e = this.options, t = this.container, n = this.containerData, r = t.offsetWidth / n.width, i = t.offsetHeight / n.height, a = Math.abs(r - 1) > Math.abs(i - 1) ? r : i;
					if (a !== 1) {
						var o, s;
						e.restore && (o = this.getCanvasData(), s = this.getCropBoxData()), this.render(), e.restore && (this.setCanvasData(U(o, function(e, t) {
							o[t] = e * a;
						})), this.setCropBoxData(U(s, function(e, t) {
							s[t] = e * a;
						})));
					}
				}
			},
			dblclick: function() {
				this.disabled || this.options.dragMode === oe || this.setDragMode(Re(this.dragBox, j) ? ae : ie);
			},
			wheel: function(e) {
				var t = this, n = Number(this.options.wheelZoomRatio) || .1, r = 1;
				this.disabled || (e.preventDefault(), !this.wheeling && (this.wheeling = !0, setTimeout(function() {
					t.wheeling = !1;
				}, 50), e.deltaY ? r = e.deltaY > 0 ? 1 : -1 : e.wheelDelta ? r = -e.wheelDelta / 120 : e.detail && (r = e.detail > 0 ? 1 : -1), this.zoom(-r * n, e)));
			},
			cropStart: function(e) {
				var t = e.buttons, n = e.button;
				if (!(this.disabled || (e.type === "mousedown" || e.type === "pointerdown" && e.pointerType === "mouse") && (z(t) && t !== 1 || z(n) && n !== 0 || e.ctrlKey))) {
					var r = this.options, i = this.pointers, a;
					e.changedTouches ? U(e.changedTouches, function(e) {
						i[e.identifier] = $e(e);
					}) : i[e.pointerId || 0] = $e(e), a = Object.keys(i).length > 1 && r.zoomable && r.zoomOnTouch ? S : Y(e.target, re), Se.test(a) && Ge(this.element, ue, {
						originalEvent: e,
						action: a
					}) !== !1 && (e.preventDefault(), this.action = a, this.cropping = !1, a === b && (this.cropping = !0, K(this.dragBox, ne)));
				}
			},
			cropMove: function(e) {
				var t = this.action;
				if (!(this.disabled || !t)) {
					var n = this.pointers;
					e.preventDefault(), Ge(this.element, le, {
						originalEvent: e,
						action: t
					}) !== !1 && (e.changedTouches ? U(e.changedTouches, function(e) {
						W(n[e.identifier] || {}, $e(e, !0));
					}) : W(n[e.pointerId || 0] || {}, $e(e, !0)), this.change(e));
				}
			},
			cropEnd: function(e) {
				if (!this.disabled) {
					var t = this.action, n = this.pointers;
					e.changedTouches ? U(e.changedTouches, function(e) {
						delete n[e.identifier];
					}) : delete n[e.pointerId || 0], t && (e.preventDefault(), Object.keys(n).length || (this.action = ""), this.cropping && (this.cropping = !1, J(this.dragBox, ne, this.cropped && this.options.modal)), Ge(this.element, ce, {
						originalEvent: e,
						action: t
					}));
				}
			}
		}, $ = { change: function(e) {
			var t = this.options, n = this.canvasData, r = this.containerData, i = this.cropBoxData, a = this.pointers, o = this.action, s = t.aspectRatio, c = i.left, l = i.top, u = i.width, d = i.height, f = c + u, p = l + d, m = 0, h = 0, g = r.width, _ = r.height, v = !0, y;
			!s && e.shiftKey && (s = u && d ? u / d : 1), this.limited && (m = i.minLeft, h = i.minTop, g = m + Math.min(r.width, n.width, n.left + n.width), _ = h + Math.min(r.height, n.height, n.top + n.height));
			var j = a[Object.keys(a)[0]], M = {
				x: j.endX - j.startX,
				y: j.endY - j.startY
			}, P = function(e) {
				switch (e) {
					case C:
						f + M.x > g && (M.x = g - f);
						break;
					case w:
						c + M.x < m && (M.x = m - c);
						break;
					case E:
						l + M.y < h && (M.y = h - l);
						break;
					case T: p + M.y > _ && (M.y = _ - p);
				}
			};
			switch (o) {
				case ee:
					c += M.x, l += M.y;
					break;
				case C:
					if (M.x >= 0 && (f >= g || s && (l <= h || p >= _))) {
						v = !1;
						break;
					}
					P(C), u += M.x, u < 0 && (o = w, u = -u, c -= u), s && (d = u / s, l += (i.height - d) / 2);
					break;
				case E:
					if (M.y <= 0 && (l <= h || s && (c <= m || f >= g))) {
						v = !1;
						break;
					}
					P(E), d -= M.y, l += M.y, d < 0 && (o = T, d = -d, l -= d), s && (u = d * s, c += (i.width - u) / 2);
					break;
				case w:
					if (M.x <= 0 && (c <= m || s && (l <= h || p >= _))) {
						v = !1;
						break;
					}
					P(w), u -= M.x, c += M.x, u < 0 && (o = C, u = -u, c -= u), s && (d = u / s, l += (i.height - d) / 2);
					break;
				case T:
					if (M.y >= 0 && (p >= _ || s && (c <= m || f >= g))) {
						v = !1;
						break;
					}
					P(T), d += M.y, d < 0 && (o = E, d = -d, l -= d), s && (u = d * s, c += (i.width - u) / 2);
					break;
				case D:
					if (s) {
						if (M.y <= 0 && (l <= h || f >= g)) {
							v = !1;
							break;
						}
						P(E), d -= M.y, l += M.y, u = d * s;
					} else P(E), P(C), M.x >= 0 ? f < g ? u += M.x : M.y <= 0 && l <= h && (v = !1) : u += M.x, M.y <= 0 ? l > h && (d -= M.y, l += M.y) : (d -= M.y, l += M.y);
					u < 0 && d < 0 ? (o = A, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = O, u = -u, c -= u) : d < 0 && (o = k, d = -d, l -= d);
					break;
				case O:
					if (s) {
						if (M.y <= 0 && (l <= h || c <= m)) {
							v = !1;
							break;
						}
						P(E), d -= M.y, l += M.y, u = d * s, c += i.width - u;
					} else P(E), P(w), M.x <= 0 ? c > m ? (u -= M.x, c += M.x) : M.y <= 0 && l <= h && (v = !1) : (u -= M.x, c += M.x), M.y <= 0 ? l > h && (d -= M.y, l += M.y) : (d -= M.y, l += M.y);
					u < 0 && d < 0 ? (o = k, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = D, u = -u, c -= u) : d < 0 && (o = A, d = -d, l -= d);
					break;
				case A:
					if (s) {
						if (M.x <= 0 && (c <= m || p >= _)) {
							v = !1;
							break;
						}
						P(w), u -= M.x, c += M.x, d = u / s;
					} else P(T), P(w), M.x <= 0 ? c > m ? (u -= M.x, c += M.x) : M.y >= 0 && p >= _ && (v = !1) : (u -= M.x, c += M.x), M.y >= 0 ? p < _ && (d += M.y) : d += M.y;
					u < 0 && d < 0 ? (o = D, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = k, u = -u, c -= u) : d < 0 && (o = O, d = -d, l -= d);
					break;
				case k:
					if (s) {
						if (M.x >= 0 && (f >= g || p >= _)) {
							v = !1;
							break;
						}
						P(C), u += M.x, d = u / s;
					} else P(T), P(C), M.x >= 0 ? f < g ? u += M.x : M.y >= 0 && p >= _ && (v = !1) : u += M.x, M.y >= 0 ? p < _ && (d += M.y) : d += M.y;
					u < 0 && d < 0 ? (o = O, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = A, u = -u, c -= u) : d < 0 && (o = D, d = -d, l -= d);
					break;
				case x:
					this.move(M.x, M.y), v = !1;
					break;
				case S:
					this.zoom(Qe(a), e), v = !1;
					break;
				case b:
					if (!M.x || !M.y) {
						v = !1;
						break;
					}
					y = Ke(this.cropper), c = j.startX - y.left, l = j.startY - y.top, u = i.minWidth, d = i.minHeight, M.x > 0 ? o = M.y > 0 ? k : D : M.x < 0 && (c -= u, o = M.y > 0 ? A : O), M.y < 0 && (l -= d), this.cropped || (q(this.cropBox, N), this.cropped = !0, this.limited && this.limitCropBox(!0, !0));
			}
			v && (i.width = u, i.height = d, i.left = c, i.top = l, this.action = o, this.renderCropBox()), U(a, function(e) {
				e.startX = e.endX, e.startY = e.endY;
			});
		} }, mt = {
			crop: function() {
				return this.ready && !this.cropped && !this.disabled && (this.cropped = !0, this.limitCropBox(!0, !0), this.options.modal && K(this.dragBox, ne), q(this.cropBox, N), this.setCropBoxData(this.initialCropBoxData)), this;
			},
			reset: function() {
				return this.ready && !this.disabled && (this.imageData = W({}, this.initialImageData), this.canvasData = W({}, this.initialCanvasData), this.cropBoxData = W({}, this.initialCropBoxData), this.renderCanvas(), this.cropped && this.renderCropBox()), this;
			},
			clear: function() {
				return this.cropped && !this.disabled && (W(this.cropBoxData, {
					left: 0,
					top: 0,
					width: 0,
					height: 0
				}), this.cropped = !1, this.renderCropBox(), this.limitCanvas(!0, !0), this.renderCanvas(), q(this.dragBox, ne), K(this.cropBox, N)), this;
			},
			replace: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 && arguments[1];
				return !this.disabled && e && (this.isImg && (this.element.src = e), t ? (this.url = e, this.image.src = e, this.ready && (this.viewBoxImage.src = e, U(this.previews, function(t) {
					t.getElementsByTagName("img")[0].src = e;
				}))) : (this.isImg && (this.replaced = !0), this.options.data = null, this.uncreate(), this.load(e))), this;
			},
			enable: function() {
				return this.ready && this.disabled && (this.disabled = !1, q(this.cropper, M)), this;
			},
			disable: function() {
				return this.ready && !this.disabled && (this.disabled = !0, K(this.cropper, M)), this;
			},
			destroy: function() {
				var e = this.element;
				return e[y] ? (e[y] = void 0, this.isImg && this.replaced && (e.src = this.originalUrl), this.uncreate(), this) : this;
			},
			move: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.canvasData, r = n.left, i = n.top;
				return this.moveTo(Ae(e) ? e : r + Number(e), Ae(t) ? t : i + Number(t));
			},
			moveTo: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.canvasData, r = !1;
				return e = Number(e), t = Number(t), this.ready && !this.disabled && this.options.movable && (z(e) && (n.left = e, r = !0), z(t) && (n.top = t, r = !0), r && this.renderCanvas(!0)), this;
			},
			zoom: function(e, t) {
				var n = this.canvasData;
				return e = Number(e), e = e < 0 ? 1 / (1 - e) : 1 + e, this.zoomTo(n.width * e / n.naturalWidth, null, t);
			},
			zoomTo: function(e, t, n) {
				var r = this.options, i = this.canvasData, a = i.width, o = i.height, s = i.naturalWidth, c = i.naturalHeight;
				if (e = Number(e), e >= 0 && this.ready && !this.disabled && r.zoomable) {
					var l = s * e, u = c * e;
					if (Ge(this.element, be, {
						ratio: e,
						oldRatio: a / s,
						originalEvent: n
					}) === !1) return this;
					if (n) {
						var d = this.pointers, f = Ke(this.cropper), p = d && Object.keys(d).length ? et(d) : {
							pageX: n.pageX,
							pageY: n.pageY
						};
						i.left -= (l - a) * ((p.pageX - f.left - i.left) / a), i.top -= (u - o) * ((p.pageY - f.top - i.top) / o);
					} else Me(t) && z(t.x) && z(t.y) ? (i.left -= (l - a) * ((t.x - i.left) / a), i.top -= (u - o) * ((t.y - i.top) / o)) : (i.left -= (l - a) / 2, i.top -= (u - o) / 2);
					i.width = l, i.height = u, this.renderCanvas(!0);
				}
				return this;
			},
			rotate: function(e) {
				return this.rotateTo((this.imageData.rotate || 0) + Number(e));
			},
			rotateTo: function(e) {
				return e = Number(e), z(e) && this.ready && !this.disabled && this.options.rotatable && (this.imageData.rotate = e % 360, this.renderCanvas(!0, !0)), this;
			},
			scaleX: function(e) {
				var t = this.imageData.scaleY;
				return this.scale(e, z(t) ? t : 1);
			},
			scaleY: function(e) {
				var t = this.imageData.scaleX;
				return this.scale(z(t) ? t : 1, e);
			},
			scale: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.imageData, r = !1;
				return e = Number(e), t = Number(t), this.ready && !this.disabled && this.options.scalable && (z(e) && (n.scaleX = e, r = !0), z(t) && (n.scaleY = t, r = !0), r && this.renderCanvas(!0, !0)), this;
			},
			getData: function() {
				var e = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], t = this.options, n = this.imageData, r = this.canvasData, i = this.cropBoxData, a;
				if (this.ready && this.cropped) {
					a = {
						x: i.left - r.left,
						y: i.top - r.top,
						width: i.width,
						height: i.height
					};
					var o = n.width / n.naturalWidth;
					if (U(a, function(e, t) {
						a[t] = e / o;
					}), e) {
						var s = Math.round(a.y + a.height), c = Math.round(a.x + a.width);
						a.x = Math.round(a.x), a.y = Math.round(a.y), a.width = c - a.x, a.height = s - a.y;
					}
				} else a = {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				};
				return t.rotatable && (a.rotate = n.rotate || 0), t.scalable && (a.scaleX = n.scaleX || 1, a.scaleY = n.scaleY || 1), a;
			},
			setData: function(e) {
				var t = this.options, n = this.imageData, r = this.canvasData, i = {};
				if (this.ready && !this.disabled && Me(e)) {
					var a = !1;
					t.rotatable && z(e.rotate) && e.rotate !== n.rotate && (n.rotate = e.rotate, a = !0), t.scalable && (z(e.scaleX) && e.scaleX !== n.scaleX && (n.scaleX = e.scaleX, a = !0), z(e.scaleY) && e.scaleY !== n.scaleY && (n.scaleY = e.scaleY, a = !0)), a && this.renderCanvas(!0, !0);
					var o = n.width / n.naturalWidth;
					z(e.x) && (i.left = e.x * o + r.left), z(e.y) && (i.top = e.y * o + r.top), z(e.width) && (i.width = e.width * o), z(e.height) && (i.height = e.height * o), this.setCropBoxData(i);
				}
				return this;
			},
			getContainerData: function() {
				return this.ready ? W({}, this.containerData) : {};
			},
			getImageData: function() {
				return this.sized ? W({}, this.imageData) : {};
			},
			getCanvasData: function() {
				var e = this.canvasData, t = {};
				return this.ready && U([
					"left",
					"top",
					"width",
					"height",
					"naturalWidth",
					"naturalHeight"
				], function(n) {
					t[n] = e[n];
				}), t;
			},
			setCanvasData: function(e) {
				var t = this.canvasData, n = t.aspectRatio;
				return this.ready && !this.disabled && Me(e) && (z(e.left) && (t.left = e.left), z(e.top) && (t.top = e.top), z(e.width) ? (t.width = e.width, t.height = e.width / n) : z(e.height) && (t.height = e.height, t.width = e.height * n), this.renderCanvas(!0)), this;
			},
			getCropBoxData: function() {
				var e = this.cropBoxData, t;
				return this.ready && this.cropped && (t = {
					left: e.left,
					top: e.top,
					width: e.width,
					height: e.height
				}), t || {};
			},
			setCropBoxData: function(e) {
				var t = this.cropBoxData, n = this.options.aspectRatio, r, i;
				return this.ready && this.cropped && !this.disabled && Me(e) && (z(e.left) && (t.left = e.left), z(e.top) && (t.top = e.top), z(e.width) && e.width !== t.width && (r = !0, t.width = e.width), z(e.height) && e.height !== t.height && (i = !0, t.height = e.height), n && (r ? t.height = t.width / n : i && (t.width = t.height * n)), this.renderCropBox()), this;
			},
			getCroppedCanvas: function() {
				var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
				if (!this.ready || !window.HTMLCanvasElement) return null;
				var t = this.canvasData, n = nt(this.image, this.imageData, t, e);
				if (!this.cropped) return n;
				var r = this.getData(e.rounded), i = r.x, a = r.y, o = r.width, s = r.height, c = n.width / Math.floor(t.naturalWidth);
				c !== 1 && (i *= c, a *= c, o *= c, s *= c);
				var u = o / s, d = Q({
					aspectRatio: u,
					width: e.maxWidth || Infinity,
					height: e.maxHeight || Infinity
				}), f = Q({
					aspectRatio: u,
					width: e.minWidth || 0,
					height: e.minHeight || 0
				}, "cover"), p = Q({
					aspectRatio: u,
					width: e.width || (c === 1 ? o : n.width),
					height: e.height || (c === 1 ? s : n.height)
				}), m = p.width, h = p.height;
				m = Math.min(d.width, Math.max(f.width, m)), h = Math.min(d.height, Math.max(f.height, h));
				var g = document.createElement("canvas"), _ = g.getContext("2d");
				g.width = Ie(m), g.height = Ie(h), _.fillStyle = e.fillColor || "transparent", _.fillRect(0, 0, m, h);
				var v = e.imageSmoothingEnabled, y = v === void 0 || v, ee = e.imageSmoothingQuality;
				_.imageSmoothingEnabled = y, ee && (_.imageSmoothingQuality = ee);
				var b = n.width, x = n.height, S = i, C = a, w, T, E, D, O, k;
				S <= -o || S > b ? (S = 0, w = 0, E = 0, O = 0) : S <= 0 ? (E = -S, S = 0, w = Math.min(b, o + S), O = w) : S <= b && (E = 0, w = Math.min(o, b - S), O = w), w <= 0 || C <= -s || C > x ? (C = 0, T = 0, D = 0, k = 0) : C <= 0 ? (D = -C, C = 0, T = Math.min(x, s + C), k = T) : C <= x && (D = 0, T = Math.min(s, x - C), k = T);
				var A = [
					S,
					C,
					w,
					T
				];
				if (O > 0 && k > 0) {
					var j = m / o;
					A.push(E * j, D * j, O * j, k * j);
				}
				return _.drawImage.apply(_, [n].concat(l(A.map(function(e) {
					return Math.floor(Ie(e));
				})))), g;
			},
			setAspectRatio: function(e) {
				var t = this.options;
				return !this.disabled && !Ae(e) && (t.aspectRatio = Math.max(0, e) || NaN, this.ready && (this.initCropBox(), this.cropped && this.renderCropBox())), this;
			},
			setDragMode: function(e) {
				var t = this.options, n = this.dragBox, r = this.face;
				if (this.ready && !this.disabled) {
					var i = e === ie, a = t.movable && e === ae;
					e = i || a ? e : oe, t.dragMode = e, Ve(n, re, e), J(n, j, i), J(n, F, a), t.cropBoxMovable || (Ve(r, re, e), J(r, j, i), J(r, F, a));
				}
				return this;
			}
		}, ht = g.Cropper, gt = /*#__PURE__*/ function() {
			function e(t) {
				var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				if (a(this, e), !t || !Te.test(t.tagName)) throw Error("The first argument is required and must be an <img> or <canvas> element.");
				this.element = t, this.options = W({}, Oe, Me(n) && n), this.cropped = !1, this.disabled = !1, this.pointers = {}, this.ready = !1, this.reloading = !1, this.replaced = !1, this.sized = !1, this.sizing = !1, this.init();
			}
			return s(e, [
				{
					key: "init",
					value: function() {
						var e = this.element, t = e.tagName.toLowerCase(), n;
						if (!e[y]) {
							if (e[y] = this, t === "img") {
								if (this.isImg = !0, n = e.getAttribute("src") || "", this.originalUrl = n, !n) return;
								n = e.src;
							} else t === "canvas" && window.HTMLCanvasElement && (n = e.toDataURL());
							this.load(n);
						}
					}
				},
				{
					key: "load",
					value: function(e) {
						var t = this;
						if (e) {
							this.url = e, this.imageData = {};
							var n = this.element, r = this.options;
							if (!r.rotatable && !r.scalable && (r.checkOrientation = !1), !r.checkOrientation || !window.ArrayBuffer) {
								this.clone();
								return;
							}
							if (Ce.test(e)) {
								we.test(e) ? this.read(ot(e)) : this.clone();
								return;
							}
							var i = new XMLHttpRequest(), a = this.clone.bind(this);
							this.reloading = !0, this.xhr = i, i.onabort = a, i.onerror = a, i.ontimeout = a, i.onprogress = function() {
								i.getResponseHeader("content-type") !== xe && i.abort();
							}, i.onload = function() {
								t.read(i.response);
							}, i.onloadend = function() {
								t.reloading = !1, t.xhr = null;
							}, r.checkCrossOrigin && Ye(e) && n.crossOrigin && (e = Xe(e)), i.open("GET", e, !0), i.responseType = "arraybuffer", i.withCredentials = n.crossOrigin === "use-credentials", i.send();
						}
					}
				},
				{
					key: "read",
					value: function(e) {
						var t = this.options, n = this.imageData, r = ct(e), i = 0, a = 1, o = 1;
						if (r > 1) {
							this.url = st(e, xe);
							var s = lt(r);
							i = s.rotate, a = s.scaleX, o = s.scaleY;
						}
						t.rotatable && (n.rotate = i), t.scalable && (n.scaleX = a, n.scaleY = o), this.clone();
					}
				},
				{
					key: "clone",
					value: function() {
						var e = this.element, t = this.url, n = e.crossOrigin, r = t;
						this.options.checkCrossOrigin && Ye(t) && (n || (n = "anonymous"), r = Xe(t)), this.crossOrigin = n, this.crossOriginUrl = r;
						var i = document.createElement("img");
						n && (i.crossOrigin = n), i.src = r || t, i.alt = e.alt || "The image to crop", this.image = i, i.onload = this.start.bind(this), i.onerror = this.stop.bind(this), K(i, P), e.parentNode.insertBefore(i, e.nextSibling);
					}
				},
				{
					key: "start",
					value: function() {
						var e = this, t = this.image;
						t.onload = null, t.onerror = null, this.sizing = !0;
						var n = g.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(g.navigator.userAgent), r = function(t, n) {
							W(e.imageData, {
								naturalWidth: t,
								naturalHeight: n,
								aspectRatio: t / n
							}), e.initialImageData = W({}, e.imageData), e.sizing = !1, e.sized = !0, e.build();
						};
						if (t.naturalWidth && !n) {
							r(t.naturalWidth, t.naturalHeight);
							return;
						}
						var i = document.createElement("img"), a = document.body || document.documentElement;
						this.sizingImage = i, i.onload = function() {
							r(i.width, i.height), n || a.removeChild(i);
						}, i.src = t.src, n || (i.style.cssText = "left:0;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:0;position:absolute;top:0;z-index:-1;", a.appendChild(i));
					}
				},
				{
					key: "stop",
					value: function() {
						var e = this.image;
						e.onload = null, e.onerror = null, e.parentNode.removeChild(e), this.image = null;
					}
				},
				{
					key: "build",
					value: function() {
						if (!(!this.sized || this.ready)) {
							var e = this.element, t = this.options, n = this.image, r = e.parentNode, i = document.createElement("div");
							i.innerHTML = ke;
							var a = i.querySelector(`.${y}-container`), o = a.querySelector(`.${y}-canvas`), s = a.querySelector(`.${y}-drag-box`), c = a.querySelector(`.${y}-crop-box`), l = c.querySelector(`.${y}-face`);
							this.container = r, this.cropper = a, this.canvas = o, this.dragBox = s, this.cropBox = c, this.viewBox = a.querySelector(`.${y}-view-box`), this.face = l, o.appendChild(n), K(e, N), r.insertBefore(a, e.nextSibling), q(n, P), this.initPreview(), this.bind(), t.initialAspectRatio = Math.max(0, t.initialAspectRatio) || NaN, t.aspectRatio = Math.max(0, t.aspectRatio) || NaN, t.viewMode = Math.max(0, Math.min(3, Math.round(t.viewMode))) || 0, K(c, N), t.guides || K(c.getElementsByClassName(`${y}-dashed`), N), t.center || K(c.getElementsByClassName(`${y}-center`), N), t.background && K(a, `${y}-bg`), t.highlight || K(l, te), t.cropBoxMovable && (K(l, F), Ve(l, re, ee)), t.cropBoxResizable || (K(c.getElementsByClassName(`${y}-line`), N), K(c.getElementsByClassName(`${y}-point`), N)), this.render(), this.ready = !0, this.setDragMode(t.dragMode), t.autoCrop && this.crop(), this.setData(t.data), H(t.ready) && Z(e, _e, t.ready, { once: !0 }), Ge(e, _e);
						}
					}
				},
				{
					key: "unbuild",
					value: function() {
						if (this.ready) {
							this.ready = !1, this.unbind(), this.resetPreview();
							var e = this.cropper.parentNode;
							e && e.removeChild(this.cropper), q(this.element, N);
						}
					}
				},
				{
					key: "uncreate",
					value: function() {
						this.ready ? (this.unbuild(), this.ready = !1, this.cropped = !1) : this.sizing ? (this.sizingImage.onload = null, this.sizing = !1, this.sized = !1) : this.reloading ? (this.xhr.onabort = null, this.xhr.abort()) : this.image && this.stop();
					}
				}
			], [{
				key: "noConflict",
				value: function() {
					return window.Cropper = ht, e;
				}
			}, {
				key: "setDefaults",
				value: function(e) {
					W(Oe, Me(e) && e);
				}
			}]);
		}();
		return W(gt.prototype, ut, dt, ft, pt, $, mt), gt;
	}));
})), c = r(), l = /* @__PURE__ */ t(s(), 1), u = (e, t, n) => Math.max(t, Math.min(e, n));
function d(e, t) {
	let n = u(Math.round(e.x), 0, Math.max(0, t.width - 1)), r = u(Math.round(e.y), 0, Math.max(0, t.height - 1));
	return {
		x: n,
		y: r,
		width: u(Math.round(e.width), 1, Math.max(1, t.width - n)),
		height: u(Math.round(e.height), 1, Math.max(1, t.height - r))
	};
}
//#endregion
//#region src/watermarkGeometry.ts
function f(e, t, n, r, i) {
	if (e <= 0 || t <= 0 || n <= 0 || r <= 0) return null;
	let a = Math.max(1, e * i / 100), o = Math.max(1, r * a / n);
	return o > t && (o = t, a = Math.max(1, n * o / r)), {
		width: a,
		height: o
	};
}
//#endregion
//#region src/components/ImageEditor.tsx
var p = n(), m = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, h = {
	"image/avif": ["avif"],
	"image/jpeg": ["jpg", "jpeg"],
	"image/png": ["png"],
	"image/webp": ["webp"],
	"image/gif": ["gif"],
	"image/bmp": ["bmp"],
	"image/x-bmp": ["bmp"],
	"image/vnd.microsoft.icon": ["ico"],
	"image/x-icon": ["ico"]
}, g = {
	jpeg: "jpg",
	png: "png",
	webp: "webp",
	avif: "avif"
}, _ = 95, v = 100, y = {
	interface: {
		fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif",
		fontWeight: 700
	},
	sans: {
		fontFamily: "\"Noto Sans CJK SC\", \"Microsoft YaHei\", \"PingFang SC\", sans-serif",
		fontWeight: 400
	},
	serif: {
		fontFamily: "\"Noto Serif CJK SC\", \"Songti SC\", SimSun, serif",
		fontWeight: 600
	}
};
function ee({ entry: e, info: t, imageUrl: n, resource: r, watermarkUrl: s, presets: u, formats: ee, enabledTools: b, maximumFileNameLength: x, labels: S, onClose: C, onSave: w }) {
	let T = (0, c.useRef)({
		x: 0,
		y: 0,
		width: t.width,
		height: t.height
	}).current, E = (0, c.useRef)(null), D = (0, c.useRef)(null), O = (0, c.useRef)(T), k = (0, c.useRef)(1), A = (0, c.useRef)(null), j = (0, c.useRef)(null), M = (0, c.useRef)(null), N = (0, c.useRef)(null), P = (0, c.useRef)([]), te = (0, c.useRef)([]), ne = [
		...b.crop ? ["crop"] : [],
		...b.rotate ? ["rotate"] : [],
		...b.resize ? ["resize"] : [],
		...b.presets ? ["preset"] : [],
		...b.process ? ["optimize", "watermark"] : []
	], [F, re] = (0, c.useState)(ne[0] || "crop"), [I, ie] = (0, c.useState)(T), [ae, oe] = (0, c.useState)(!1), [se, ce] = (0, c.useState)([]), [le, ue] = (0, c.useState)([]), [de, fe] = (0, c.useState)("free"), [pe, me] = (0, c.useState)(1), [he, ge] = (0, c.useState)(!1), [L, _e] = (0, c.useState)(0), [ve, ye] = (0, c.useState)(!1), [be, xe] = (0, c.useState)(t.width), [Se, Ce] = (0, c.useState)(t.height), [we, Te] = (0, c.useState)(""), [Ee, De] = (0, c.useState)(!1), [Oe, ke] = (0, c.useState)(82), [R, z] = (0, c.useState)("original"), [B, Ae] = (0, c.useState)("none"), [V, je] = (0, c.useState)("SoFinder"), [Me, H] = (0, c.useState)("interface"), [Ne, Pe] = (0, c.useState)("#ffffff"), [U, W] = (0, c.useState)(r), [Fe, Ie] = (0, c.useState)(""), [Le, G] = (0, c.useState)("bottom-right"), [Re, K] = (0, c.useState)(100), [q, J] = (0, c.useState)(100), [ze, Be] = (0, c.useState)(60), [Y, Ve] = (0, c.useState)(25), [He, Ue] = (0, c.useState)({
		left: 0,
		top: 0,
		width: 0,
		height: 0
	}), [We, X] = (0, c.useState)({
		width: 0,
		height: 0
	}), [Z, Ge] = (0, c.useState)("copy"), [Ke, qe] = (0, c.useState)(!1), [Je, Ye] = (0, c.useState)(""), Xe = e.name.lastIndexOf("."), Ze = Xe > 0 ? e.name.slice(Xe + 1) : "", Qe = h[(e.mimeType || "").toLowerCase()] || [], $e = Qe.includes(Ze.toLowerCase()) ? Ze : Qe[0] || Ze, et = R === "original" ? $e : g[R] || R, Q = `${Xe > 0 ? e.name.slice(0, Xe) : e.name}-edited`, [tt, nt] = (0, c.useState)(Q), rt = R === "original" ? Z : "copy", it = et ? `${tt.trim()}.${et}` : tt.trim(), at = rt === "copy" ? o(it, x) : null, ot = ae, st = B === "text" ? !V.trim() : B === "image" && !Fe.trim(), ct = ve && (!Number.isInteger(be) || !Number.isInteger(Se) || be < 1 || Se < 1 || be > 4096 || Se > 4096), lt = ot || L !== 0 || ve || !!we || Ee || B !== "none", ut = we ? u[we] : ve ? {
		width: be,
		height: Se
	} : ae ? I : T, dt = !we && !ve && (L === 90 || L === 270) ? ut.height : ut.width, ft = !we && !ve && (L === 90 || L === 270) ? ut.width : ut.height, pt = (e) => d(e, t), $ = (e) => {
		O.current = e, ie(e);
	}, mt = (e) => {
		P.current = e, ce(e);
	}, ht = (e) => {
		te.current = e, ue(e);
	}, gt = (e, t) => {
		m(e, t) || (mt([...P.current.slice(-39), e]), ht([]));
	}, _t = (e, n = !0) => {
		let r = d(e, t);
		n && gt(O.current, r), oe(!0), D.current?.setData(r), $(r);
	}, vt = (e = de) => e === "original" ? t.width / t.height : e === "1:1" ? 1 : e === "4:3" ? 4 / 3 : e === "16:9" ? 16 / 9 : NaN, yt = (e) => e === "top-left" ? [0, 0] : e === "top-right" ? [100, 0] : e === "center" ? [50, 50] : e === "bottom-left" ? [0, 100] : e === "bottom-right" ? [100, 100] : [Re, q], bt = (e) => {
		let [t, n] = yt(e);
		G(e), K(t), J(n);
	}, xt = (e) => {
		let t = N.current, n = j.current, r = M.current;
		if (!t || !n || !r) return;
		let i = Math.max(1, n.clientWidth - r.offsetWidth), a = Math.max(1, n.clientHeight - r.offsetHeight);
		K(Math.round(Math.max(0, Math.min(100, t.x + (e.clientX - t.clientX) * 100 / i)))), J(Math.round(Math.max(0, Math.min(100, t.y + (e.clientY - t.clientY) * 100 / a)))), G("custom");
	};
	(0, c.useEffect)(() => {
		let e = (e) => xt(e), t = (e) => xt(e), n = () => {
			N.current = null;
		};
		return window.addEventListener("pointermove", e), window.addEventListener("pointerup", n), window.addEventListener("pointercancel", n), window.addEventListener("mousemove", t), window.addEventListener("mouseup", n), () => {
			window.removeEventListener("pointermove", e), window.removeEventListener("pointerup", n), window.removeEventListener("pointercancel", n), window.removeEventListener("mousemove", t), window.removeEventListener("mouseup", n);
		};
	}, []), (0, c.useEffect)(() => {
		if (!E.current) return;
		let e = new l.default(E.current, {
			viewMode: 1,
			dragMode: "crop",
			aspectRatio: NaN,
			autoCropArea: .86,
			responsive: !0,
			restore: !1,
			background: !1,
			guides: !0,
			center: !0,
			highlight: !0,
			movable: !0,
			cropBoxMovable: !0,
			cropBoxResizable: !0,
			zoomable: !0,
			zoomOnTouch: !0,
			zoomOnWheel: !1,
			toggleDragModeOnDblclick: !1,
			ready: (e) => {
				let t = e.currentTarget.cropper;
				D.current = t;
				let n = t.getImageData();
				k.current = n.naturalWidth ? n.width / n.naturalWidth : 1, $(pt(t.getData(!0)));
			},
			crop: (e) => $(pt(e.detail)),
			cropstart: () => {
				A.current = O.current;
			},
			cropend: (e) => {
				let t = pt(e.currentTarget.cropper.getData(!0));
				A.current && gt(A.current, t), A.current = null, oe(!0), $(t);
			}
		});
		return D.current = e, () => {
			e.destroy(), D.current = null;
		};
	}, [
		n,
		t.width,
		t.height
	]), (0, c.useEffect)(() => {
		let e = () => {
			let e = D.current;
			if (!e) return;
			let t = ae ? e.getCropBoxData() : e.getCanvasData();
			Ue({
				left: t.left,
				top: t.top,
				width: t.width,
				height: t.height
			});
		}, t = window.requestAnimationFrame(e), n = E.current?.closest(".sf-editor-canvas"), r = typeof ResizeObserver > "u" ? null : new ResizeObserver(e);
		return n && r?.observe(n), () => {
			window.cancelAnimationFrame(t), r?.disconnect();
		};
	}, [
		ae,
		I,
		L,
		pe
	]);
	let St = (e) => {
		fe(e), oe(!0);
		let t = D.current;
		if (!t) return;
		let n = O.current;
		t.setAspectRatio(vt(e));
		let r = pt(t.getData(!0));
		gt(n, r), $(r);
	}, Ct = () => {
		let e = P.current.at(-1);
		e && (mt(P.current.slice(0, -1)), ht([O.current, ...te.current]), D.current?.setData(e), $(e));
	}, wt = () => {
		let [e, ...t] = te.current;
		e && (ht(t), mt([...P.current, O.current]), D.current?.setData(e), $(e));
	}, Tt = () => {
		let e = D.current;
		e?.reset().setAspectRatio(NaN), fe("free"), me(1), oe(!1), mt([]), ht([]), e && $(pt(e.getData(!0)));
	}, Et = (e) => {
		_e((L + e + 360) % 360), D.current?.rotate(e);
	}, Dt = () => {
		L && D.current?.rotate(-L), _e(0), Tt(), ye(!1), Te(""), De(!1), z("original"), ke(82), Ae("none"), G("bottom-right"), K(100), J(100);
	}, Ot = () => {
		let e = [];
		ot && e.push({
			type: "crop",
			...I,
			quality: _
		}), L && e.push({
			type: "rotate",
			degrees: L,
			quality: _
		}), we ? e.push({
			type: "preset",
			name: we
		}) : ve && e.push({
			type: "resize",
			width: be,
			height: Se,
			quality: _
		});
		let t = Le === "custom" ? {
			x: Re,
			y: q
		} : {};
		return B === "text" ? e.push({
			type: "watermarkText",
			text: V.trim(),
			font: Me,
			color: Ne,
			position: Le,
			...t,
			opacity: ze,
			scale: Y,
			quality: v
		}) : B === "image" && e.push({
			type: "watermarkImage",
			resource: U.trim() || r,
			path: Fe.trim(),
			position: Le,
			...t,
			opacity: ze,
			scale: Y,
			quality: v
		}), Ee && e.push({
			type: "optimize",
			format: R,
			quality: Oe
		}), e;
	}, kt = async () => {
		let e = Ot();
		if (!e.length) return;
		let t = rt === "copy" ? {
			mode: rt,
			...tt === Q && R === "original" ? {} : { name: it }
		} : { mode: rt };
		Ye(""), qe(!0);
		try {
			await w(e, t);
		} catch (e) {
			Ye(e instanceof Error ? e.message : String(e));
		} finally {
			qe(!1);
		}
	}, At = (e) => e === "preset" ? S.preset : e === "optimize" ? S.optimize : e === "watermark" ? S.watermark : S[e], jt = [
		"top-left",
		"top-right",
		"center",
		"bottom-left",
		"bottom-right",
		"custom"
	], [Mt, Nt] = yt(Le), Pt = B === "image" && Fe.trim() ? s(U.trim() || r, Fe.trim()) : "", Ft = f(He.width, He.height, We.width, We.height, Y);
	return (0, c.useEffect)(() => X({
		width: 0,
		height: 0
	}), [Pt]), /* @__PURE__ */ (0, p.jsx)(a, {
		title: `${S.imageEdit}: ${e.name}`,
		closeLabel: S.close,
		onClose: C,
		className: "sf-image-editor",
		maximizable: !0,
		footer: /* @__PURE__ */ (0, p.jsxs)(p.Fragment, { children: [
			/* @__PURE__ */ (0, p.jsxs)("span", { children: [
				S.outputSize,
				": ",
				dt,
				" × ",
				ft,
				" px"
			] }),
			/* @__PURE__ */ (0, p.jsx)("button", {
				onClick: C,
				children: S.cancel
			}),
			/* @__PURE__ */ (0, p.jsx)("button", {
				className: "primary",
				disabled: Ke || !lt || st || ct || at !== null,
				onClick: () => void kt(),
				children: Ke ? S.saving : S.save
			})
		] }),
		children: /* @__PURE__ */ (0, p.jsxs)("div", {
			className: "sf-editor-workspace",
			children: [
				/* @__PURE__ */ (0, p.jsx)("nav", {
					className: "sf-editor-tools",
					"aria-label": S.imageTools,
					children: ne.map((e) => /* @__PURE__ */ (0, p.jsxs)("button", {
						className: F === e ? "active" : "",
						"aria-pressed": F === e,
						onClick: () => re(e),
						children: [/* @__PURE__ */ (0, p.jsx)(i, { name: e === "rotate" ? "rotate-right" : e === "crop" ? "crop" : "resize" }), /* @__PURE__ */ (0, p.jsx)("span", { children: At(e) })]
					}, e))
				}),
				/* @__PURE__ */ (0, p.jsxs)("div", {
					className: "sf-editor-main",
					children: [/* @__PURE__ */ (0, p.jsxs)("div", {
						className: "sf-editor-toolbar",
						children: [
							/* @__PURE__ */ (0, p.jsxs)("label", { children: [S.zoom, /* @__PURE__ */ (0, p.jsx)("input", {
								type: "range",
								min: "1",
								max: "3",
								step: "0.05",
								value: pe,
								onChange: (e) => {
									let t = Number(e.target.value);
									me(t), D.current?.zoomTo(k.current * t);
								}
							})] }),
							/* @__PURE__ */ (0, p.jsx)("button", {
								disabled: !se.length,
								onClick: Ct,
								children: S.undo
							}),
							/* @__PURE__ */ (0, p.jsx)("button", {
								disabled: !le.length,
								onClick: wt,
								children: S.redo
							}),
							/* @__PURE__ */ (0, p.jsx)("button", {
								onClick: Dt,
								children: S.reset
							}),
							/* @__PURE__ */ (0, p.jsx)("button", {
								onPointerDown: () => ge(!0),
								onPointerUp: () => ge(!1),
								onPointerLeave: () => ge(!1),
								children: S.compare
							})
						]
					}), /* @__PURE__ */ (0, p.jsxs)("div", {
						className: `sf-editor-canvas${he ? " sf-editor-comparing" : ""}${F === "crop" ? "" : " sf-editor-crop-inactive"}`,
						tabIndex: 0,
						onKeyDown: (e) => {
							let t = e.shiftKey ? 10 : 1, n = e.key === "ArrowLeft" ? [-t, 0] : e.key === "ArrowRight" ? [t, 0] : e.key === "ArrowUp" ? [0, -t] : e.key === "ArrowDown" ? [0, t] : null;
							n && F === "crop" && (e.preventDefault(), _t({
								...O.current,
								x: O.current.x + n[0],
								y: O.current.y + n[1]
							})), (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && (e.preventDefault(), e.shiftKey ? wt() : Ct());
						},
						children: [/* @__PURE__ */ (0, p.jsx)("img", {
							ref: E,
							src: n,
							alt: ""
						}), B !== "none" && He.width > 0 && /* @__PURE__ */ (0, p.jsx)("div", {
							ref: j,
							className: "sf-watermark-layer",
							style: He,
							children: /* @__PURE__ */ (0, p.jsx)("div", {
								ref: M,
								className: `sf-watermark-preview${F === "watermark" ? " is-draggable" : ""}`,
								role: F === "watermark" ? "button" : void 0,
								tabIndex: F === "watermark" ? 0 : void 0,
								"aria-label": S.dragWatermark,
								style: {
									left: `${Mt}%`,
									top: `${Nt}%`,
									transform: `translate(-${Mt}%, -${Nt}%)`,
									color: Ne,
									opacity: ze / 100,
									fontSize: `${Math.max(10, Math.min(He.width, He.height) * Y / 500)}px`,
									width: B === "image" ? Ft ? `${Ft.width}px` : `${Y}%` : void 0,
									height: B === "image" && Ft ? `${Ft.height}px` : void 0,
									...B === "text" ? y[Me] : {}
								},
								onKeyDown: (e) => {
									let t = e.shiftKey ? 10 : 1;
									if (e.key === "ArrowLeft") K(Math.max(0, Mt - t));
									else if (e.key === "ArrowRight") K(Math.min(100, Mt + t));
									else if (e.key === "ArrowUp") J(Math.max(0, Nt - t));
									else if (e.key === "ArrowDown") J(Math.min(100, Nt + t));
									else return;
									e.preventDefault(), e.stopPropagation(), G("custom");
								},
								onPointerDown: (e) => {
									F === "watermark" && e.pointerType !== "mouse" && (N.current = {
										clientX: e.clientX,
										clientY: e.clientY,
										x: Mt,
										y: Nt
									});
								},
								onMouseDown: (e) => {
									F === "watermark" && (e.preventDefault(), N.current = {
										clientX: e.clientX,
										clientY: e.clientY,
										x: Mt,
										y: Nt
									});
								},
								children: B === "text" ? V : Pt && /* @__PURE__ */ (0, p.jsx)("img", {
									src: Pt,
									alt: "",
									draggable: !1,
									onLoad: (e) => X({
										width: e.currentTarget.naturalWidth,
										height: e.currentTarget.naturalHeight
									})
								})
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, p.jsxs)("aside", {
					className: "sf-editor-panel",
					children: [
						/* @__PURE__ */ (0, p.jsx)("h3", { children: At(F) }),
						F === "crop" && /* @__PURE__ */ (0, p.jsxs)(p.Fragment, { children: [
							/* @__PURE__ */ (0, p.jsxs)("label", { children: [S.ratio, /* @__PURE__ */ (0, p.jsxs)("select", {
								"aria-label": S.ratio,
								value: de,
								onChange: (e) => St(e.target.value),
								children: [
									/* @__PURE__ */ (0, p.jsx)("option", {
										value: "free",
										children: S.free
									}),
									/* @__PURE__ */ (0, p.jsx)("option", {
										value: "original",
										children: S.original
									}),
									/* @__PURE__ */ (0, p.jsx)("option", {
										value: "1:1",
										children: "1:1"
									}),
									/* @__PURE__ */ (0, p.jsx)("option", {
										value: "4:3",
										children: "4:3"
									}),
									/* @__PURE__ */ (0, p.jsx)("option", {
										value: "16:9",
										children: "16:9"
									})
								]
							})] }),
							/* @__PURE__ */ (0, p.jsx)("div", {
								className: "sf-editor-field-grid",
								children: [
									"x",
									"y",
									"width",
									"height"
								].map((e) => /* @__PURE__ */ (0, p.jsxs)("label", { children: [S[e], /* @__PURE__ */ (0, p.jsx)("input", {
									type: "number",
									min: +(e === "width" || e === "height"),
									value: I[e],
									onChange: (t) => _t({
										...O.current,
										[e]: Number(t.target.value)
									})
								})] }, e))
							}),
							/* @__PURE__ */ (0, p.jsx)("small", { children: S.panHint })
						] }),
						F === "rotate" && /* @__PURE__ */ (0, p.jsxs)(p.Fragment, { children: [/* @__PURE__ */ (0, p.jsxs)("div", {
							className: "sf-editor-action-row",
							children: [/* @__PURE__ */ (0, p.jsxs)("button", {
								onClick: () => Et(-90),
								children: [/* @__PURE__ */ (0, p.jsx)(i, { name: "rotate-left" }), S.rotateLeft]
							}), /* @__PURE__ */ (0, p.jsxs)("button", {
								onClick: () => Et(90),
								children: [/* @__PURE__ */ (0, p.jsx)(i, { name: "rotate-right" }), S.rotateRight]
							})]
						}), /* @__PURE__ */ (0, p.jsxs)("p", { children: [
							S.rotation,
							": ",
							L,
							"°"
						] })] }),
						F === "resize" && /* @__PURE__ */ (0, p.jsxs)(p.Fragment, { children: [/* @__PURE__ */ (0, p.jsxs)("label", {
							className: "sf-editor-check",
							children: [/* @__PURE__ */ (0, p.jsx)("input", {
								type: "checkbox",
								checked: ve,
								onChange: (e) => {
									ye(e.target.checked), e.target.checked && Te("");
								}
							}), S.enableResize]
						}), /* @__PURE__ */ (0, p.jsxs)("div", {
							className: "sf-editor-field-grid",
							children: [/* @__PURE__ */ (0, p.jsxs)("label", { children: [S.width, /* @__PURE__ */ (0, p.jsx)("input", {
								type: "number",
								min: "1",
								max: "4096",
								value: be,
								onChange: (e) => xe(Number(e.target.value))
							})] }), /* @__PURE__ */ (0, p.jsxs)("label", { children: [S.height, /* @__PURE__ */ (0, p.jsx)("input", {
								type: "number",
								min: "1",
								max: "4096",
								value: Se,
								onChange: (e) => Ce(Number(e.target.value))
							})] })]
						})] }),
						F === "preset" && /* @__PURE__ */ (0, p.jsxs)("label", { children: [S.preset, /* @__PURE__ */ (0, p.jsxs)("select", {
							value: we,
							onChange: (e) => {
								Te(e.target.value), e.target.value && ye(!1);
							},
							children: [/* @__PURE__ */ (0, p.jsx)("option", {
								value: "",
								children: S.noPreset
							}), Object.entries(u).map(([e, t]) => /* @__PURE__ */ (0, p.jsxs)("option", {
								value: e,
								children: [
									e,
									" (",
									t.width,
									"×",
									t.height,
									")"
								]
							}, e))]
						})] }),
						F === "optimize" && /* @__PURE__ */ (0, p.jsxs)(p.Fragment, { children: [
							/* @__PURE__ */ (0, p.jsxs)("label", {
								className: "sf-editor-check",
								children: [/* @__PURE__ */ (0, p.jsx)("input", {
									type: "checkbox",
									checked: Ee,
									onChange: (e) => De(e.target.checked)
								}), S.enableOptimize]
							}),
							/* @__PURE__ */ (0, p.jsxs)("label", { children: [S.outputFormat, /* @__PURE__ */ (0, p.jsxs)("select", {
								value: R,
								onChange: (e) => {
									z(e.target.value), De(!0);
								},
								children: [/* @__PURE__ */ (0, p.jsx)("option", {
									value: "original",
									children: S.keepFormat
								}), ee.map((e) => /* @__PURE__ */ (0, p.jsx)("option", {
									value: e,
									children: e.toUpperCase()
								}, e))]
							})] }),
							/* @__PURE__ */ (0, p.jsxs)("label", { children: [
								S.quality,
								": ",
								Oe,
								/* @__PURE__ */ (0, p.jsx)("input", {
									type: "range",
									min: "1",
									max: "100",
									value: Oe,
									onChange: (e) => {
										ke(Number(e.target.value)), De(!0);
									}
								})
							] })
						] }),
						F === "watermark" && /* @__PURE__ */ (0, p.jsxs)(p.Fragment, { children: [
							/* @__PURE__ */ (0, p.jsxs)("label", { children: [S.watermarkType, /* @__PURE__ */ (0, p.jsxs)("select", {
								value: B,
								onChange: (e) => Ae(e.target.value),
								children: [
									/* @__PURE__ */ (0, p.jsx)("option", {
										value: "none",
										children: S.noWatermark
									}),
									/* @__PURE__ */ (0, p.jsx)("option", {
										value: "text",
										children: S.textWatermark
									}),
									/* @__PURE__ */ (0, p.jsx)("option", {
										value: "image",
										children: S.imageWatermark
									})
								]
							})] }),
							B === "text" && /* @__PURE__ */ (0, p.jsxs)(p.Fragment, { children: [/* @__PURE__ */ (0, p.jsxs)("label", { children: [S.watermarkText, /* @__PURE__ */ (0, p.jsx)("input", {
								value: V,
								maxLength: 200,
								onChange: (e) => je(e.target.value)
							})] }), /* @__PURE__ */ (0, p.jsxs)("div", {
								className: "sf-watermark-style-row",
								children: [/* @__PURE__ */ (0, p.jsxs)("label", { children: [S.watermarkFont, /* @__PURE__ */ (0, p.jsxs)("select", {
									value: Me,
									onChange: (e) => H(e.target.value),
									children: [
										/* @__PURE__ */ (0, p.jsx)("option", {
											value: "interface",
											children: S.interfaceFont
										}),
										/* @__PURE__ */ (0, p.jsx)("option", {
											value: "sans",
											children: S.sansFont
										}),
										/* @__PURE__ */ (0, p.jsx)("option", {
											value: "serif",
											children: S.serifFont
										})
									]
								})] }), /* @__PURE__ */ (0, p.jsxs)("label", {
									className: "sf-watermark-color",
									children: [S.color, /* @__PURE__ */ (0, p.jsx)("input", {
										type: "color",
										value: Ne,
										onChange: (e) => Pe(e.target.value)
									})]
								})]
							})] }),
							B === "image" && /* @__PURE__ */ (0, p.jsxs)(p.Fragment, { children: [/* @__PURE__ */ (0, p.jsxs)("label", { children: [S.watermarkResource, /* @__PURE__ */ (0, p.jsx)("input", {
								value: U,
								onChange: (e) => W(e.target.value)
							})] }), /* @__PURE__ */ (0, p.jsxs)("label", { children: [S.watermarkPath, /* @__PURE__ */ (0, p.jsx)("input", {
								value: Fe,
								placeholder: "branding/logo.png",
								onChange: (e) => Ie(e.target.value)
							})] })] }),
							B !== "none" && /* @__PURE__ */ (0, p.jsxs)(p.Fragment, { children: [
								/* @__PURE__ */ (0, p.jsxs)("label", { children: [S.position, /* @__PURE__ */ (0, p.jsx)("select", {
									value: Le,
									onChange: (e) => bt(e.target.value),
									children: jt.map((e) => /* @__PURE__ */ (0, p.jsx)("option", {
										value: e,
										children: e === "custom" ? S.freePosition : S[e.replace(/-([a-z])/g, (e, t) => t.toUpperCase())]
									}, e))
								})] }),
								Le === "custom" && /* @__PURE__ */ (0, p.jsxs)("div", {
									className: "sf-editor-field-grid",
									children: [/* @__PURE__ */ (0, p.jsxs)("label", { children: ["X (%)", /* @__PURE__ */ (0, p.jsx)("input", {
										type: "number",
										min: "0",
										max: "100",
										value: Re,
										onChange: (e) => K(Math.max(0, Math.min(100, Number(e.target.value))))
									})] }), /* @__PURE__ */ (0, p.jsxs)("label", { children: ["Y (%)", /* @__PURE__ */ (0, p.jsx)("input", {
										type: "number",
										min: "0",
										max: "100",
										value: q,
										onChange: (e) => J(Math.max(0, Math.min(100, Number(e.target.value))))
									})] })]
								}),
								/* @__PURE__ */ (0, p.jsx)("small", { children: S.dragWatermarkHint }),
								/* @__PURE__ */ (0, p.jsxs)("label", { children: [
									S.opacity,
									": ",
									ze,
									"%",
									/* @__PURE__ */ (0, p.jsx)("input", {
										type: "range",
										min: "1",
										max: "100",
										value: ze,
										onChange: (e) => Be(Number(e.target.value))
									})
								] }),
								/* @__PURE__ */ (0, p.jsxs)("label", { children: [
									S.watermarkScale,
									": ",
									Y,
									"%",
									/* @__PURE__ */ (0, p.jsx)("input", {
										type: "range",
										min: "5",
										max: "80",
										value: Y,
										onChange: (e) => Ve(Number(e.target.value))
									})
								] })
							] })
						] }),
						/* @__PURE__ */ (0, p.jsx)("hr", {}),
						/* @__PURE__ */ (0, p.jsxs)("label", { children: [S.saveMode, /* @__PURE__ */ (0, p.jsxs)("select", {
							value: rt,
							disabled: R !== "original",
							onChange: (e) => Ge(e.target.value),
							children: [/* @__PURE__ */ (0, p.jsx)("option", {
								value: "copy",
								children: S.saveCopy
							}), /* @__PURE__ */ (0, p.jsx)("option", {
								value: "overwrite",
								children: S.overwrite
							})]
						})] }),
						rt === "copy" && /* @__PURE__ */ (0, p.jsxs)(p.Fragment, { children: [
							/* @__PURE__ */ (0, p.jsxs)("label", { children: [S.fileName, /* @__PURE__ */ (0, p.jsxs)("span", {
								className: "sf-name-input",
								children: [/* @__PURE__ */ (0, p.jsx)("input", {
									value: tt,
									maxLength: x,
									onChange: (e) => nt(e.target.value)
								}), et && /* @__PURE__ */ (0, p.jsxs)("span", {
									"aria-hidden": "true",
									children: [".", et]
								})]
							})] }),
							/* @__PURE__ */ (0, p.jsxs)("small", { children: [
								Array.from(it).length,
								" / ",
								x
							] }),
							at && tt && /* @__PURE__ */ (0, p.jsx)("p", {
								className: "sf-warning",
								role: "alert",
								children: at === "tooLong" ? S.fileNameTooLong.replace("{maximum}", String(x)) : S.invalidFileName
							})
						] }),
						R !== "original" && /* @__PURE__ */ (0, p.jsx)("p", {
							className: "sf-configured-limits",
							children: S.conversionCopyHint
						}),
						rt === "overwrite" && /* @__PURE__ */ (0, p.jsx)("p", {
							className: "sf-warning",
							role: "alert",
							children: S.overwriteWarning
						}),
						Je && /* @__PURE__ */ (0, p.jsx)("p", {
							className: "sf-warning",
							role: "alert",
							children: Je
						})
					]
				})
			]
		})
	});
}
//#endregion
export { ee as ImageEditor };
