import { n as e, r as t, t as n } from "./jsx-runtime-CmCsaYvT.js";
import { t as r } from "./react-B5TC723I.js";
import { t as i } from "./imageActions-BRpJl8Vz.js";
import { t as a } from "./UiIcon-CyBzESIM.js";
import { t as o } from "./Modal-DhcERqG6.js";
import { t as s } from "./nameValidation-DURyMFRU.js";
//#region node_modules/.pnpm/cropperjs@1.6.2/node_modules/cropperjs/dist/cropper.js
var c = /* @__PURE__ */ e(((e, t) => {
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
		var h = typeof window < "u" && window.document !== void 0, g = h ? window : {}, _ = h && g.document.documentElement ? "ontouchstart" in g.document.documentElement : !1, v = h ? "PointerEvent" in g : !1, y = "cropper", ee = "all", b = "crop", x = "move", S = "zoom", C = "e", w = "w", T = "s", E = "n", D = "ne", O = "nw", k = "se", A = "sw", j = `${y}-crop`, M = `${y}-disabled`, N = `${y}-hidden`, P = `${y}-hide`, te = `${y}-invisible`, F = `${y}-modal`, I = `${y}-move`, L = `${y}Action`, ne = `${y}Preview`, R = "crop", re = "move", ie = "none", ae = "crop", oe = "cropend", se = "cropmove", ce = "cropstart", le = "dblclick", ue = _ ? "touchstart" : "mousedown", de = _ ? "touchmove" : "mousemove", fe = _ ? "touchend touchcancel" : "mouseup", pe = v ? "pointerdown" : ue, me = v ? "pointermove" : de, he = v ? "pointerup pointercancel" : fe, ge = "ready", _e = "resize", z = "wheel", ve = "zoom", ye = "image/jpeg", be = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/, xe = /^data:/, Se = /^data:image\/jpeg;base64,/, Ce = /^img|canvas$/i, we = 200, B = 100, Te = {
			viewMode: 0,
			dragMode: R,
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
			minContainerWidth: we,
			minContainerHeight: B,
			ready: null,
			cropstart: null,
			cropmove: null,
			cropend: null,
			crop: null,
			zoom: null
		}, Ee = "<div class=\"cropper-container\" touch-action=\"none\"><div class=\"cropper-wrap-box\"><div class=\"cropper-canvas\"></div></div><div class=\"cropper-drag-box\"></div><div class=\"cropper-crop-box\"><span class=\"cropper-view-box\"></span><span class=\"cropper-dashed dashed-h\"></span><span class=\"cropper-dashed dashed-v\"></span><span class=\"cropper-center\"></span><span class=\"cropper-face\"></span><span class=\"cropper-line line-e\" data-cropper-action=\"e\"></span><span class=\"cropper-line line-n\" data-cropper-action=\"n\"></span><span class=\"cropper-line line-w\" data-cropper-action=\"w\"></span><span class=\"cropper-line line-s\" data-cropper-action=\"s\"></span><span class=\"cropper-point point-e\" data-cropper-action=\"e\"></span><span class=\"cropper-point point-n\" data-cropper-action=\"n\"></span><span class=\"cropper-point point-w\" data-cropper-action=\"w\"></span><span class=\"cropper-point point-s\" data-cropper-action=\"s\"></span><span class=\"cropper-point point-ne\" data-cropper-action=\"ne\"></span><span class=\"cropper-point point-nw\" data-cropper-action=\"nw\"></span><span class=\"cropper-point point-sw\" data-cropper-action=\"sw\"></span><span class=\"cropper-point point-se\" data-cropper-action=\"se\"></span></div></div>", De = Number.isNaN || g.isNaN;
		function V(e) {
			return typeof e == "number" && !De(e);
		}
		var Oe = function(e) {
			return e > 0 && e < Infinity;
		};
		function H(e) {
			return e === void 0;
		}
		function ke(e) {
			return i(e) === "object" && e !== null;
		}
		var U = Object.prototype.hasOwnProperty;
		function Ae(e) {
			if (!ke(e)) return !1;
			try {
				var t = e.constructor, n = t.prototype;
				return t && n && U.call(n, "isPrototypeOf");
			} catch {
				return !1;
			}
		}
		function W(e) {
			return typeof e == "function";
		}
		var je = Array.prototype.slice;
		function Me(e) {
			return Array.from ? Array.from(e) : je.call(e);
		}
		function G(e, t) {
			return e && W(t) && (Array.isArray(e) || V(e.length) ? Me(e).forEach(function(n, r) {
				t.call(e, n, r, e);
			}) : ke(e) && Object.keys(e).forEach(function(n) {
				t.call(e, e[n], n, e);
			})), e;
		}
		var K = Object.assign || function(e) {
			var t = [...arguments].slice(1);
			return ke(e) && t.length > 0 && t.forEach(function(t) {
				ke(t) && Object.keys(t).forEach(function(n) {
					e[n] = t[n];
				});
			}), e;
		}, Ne = /\.\d*(?:0|9){12}\d*$/;
		function Pe(e) {
			var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1e11;
			return Ne.test(e) ? Math.round(e * t) / t : e;
		}
		var Fe = /^width|height|left|top|marginLeft|marginTop$/;
		function q(e, t) {
			var n = e.style;
			G(t, function(e, t) {
				Fe.test(t) && V(e) && (e = `${e}px`), n[t] = e;
			});
		}
		function Ie(e, t) {
			return e.classList ? e.classList.contains(t) : e.className.indexOf(t) > -1;
		}
		function J(e, t) {
			if (t) {
				if (V(e.length)) {
					G(e, function(e) {
						J(e, t);
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
		function Y(e, t) {
			if (t) {
				if (V(e.length)) {
					G(e, function(e) {
						Y(e, t);
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
		function Le(e, t, n) {
			if (t) {
				if (V(e.length)) {
					G(e, function(e) {
						Le(e, t, n);
					});
					return;
				}
				n ? J(e, t) : Y(e, t);
			}
		}
		var Re = /([a-z\d])([A-Z])/g;
		function ze(e) {
			return e.replace(Re, "$1-$2").toLowerCase();
		}
		function Be(e, t) {
			return ke(e[t]) ? e[t] : e.dataset ? e.dataset[t] : e.getAttribute(`data-${ze(t)}`);
		}
		function X(e, t, n) {
			ke(n) ? e[t] = n : e.dataset ? e.dataset[t] = n : e.setAttribute(`data-${ze(t)}`, n);
		}
		function Ve(e, t) {
			if (ke(e[t])) try {
				delete e[t];
			} catch {
				e[t] = void 0;
			}
			else if (e.dataset) try {
				delete e.dataset[t];
			} catch {
				e.dataset[t] = void 0;
			}
			else e.removeAttribute(`data-${ze(t)}`);
		}
		var He = /\s\s*/, Ue = function() {
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
		function Z(e, t, n) {
			var r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, i = n;
			t.trim().split(He).forEach(function(t) {
				if (!Ue) {
					var a = e.listeners;
					a && a[t] && a[t][n] && (i = a[t][n], delete a[t][n], Object.keys(a[t]).length === 0 && delete a[t], Object.keys(a).length === 0 && delete e.listeners);
				}
				e.removeEventListener(t, i, r);
			});
		}
		function Q(e, t, n) {
			var r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, i = n;
			t.trim().split(He).forEach(function(t) {
				if (r.once && !Ue) {
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
		function We(e, t, n) {
			var r;
			return W(Event) && W(CustomEvent) ? r = new CustomEvent(t, {
				detail: n,
				bubbles: !0,
				cancelable: !0
			}) : (r = document.createEvent("CustomEvent"), r.initCustomEvent(t, !0, !0, n)), e.dispatchEvent(r);
		}
		function Ge(e) {
			var t = e.getBoundingClientRect();
			return {
				left: t.left + (window.pageXOffset - document.documentElement.clientLeft),
				top: t.top + (window.pageYOffset - document.documentElement.clientTop)
			};
		}
		var Ke = g.location, qe = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;
		function Je(e) {
			var t = e.match(qe);
			return t !== null && (t[1] !== Ke.protocol || t[2] !== Ke.hostname || t[3] !== Ke.port);
		}
		function Ye(e) {
			var t = `timestamp=${(/* @__PURE__ */ new Date()).getTime()}`;
			return e + (e.indexOf("?") === -1 ? "?" : "&") + t;
		}
		function Xe(e) {
			var t = e.rotate, n = e.scaleX, r = e.scaleY, i = e.translateX, a = e.translateY, o = [];
			V(i) && i !== 0 && o.push(`translateX(${i}px)`), V(a) && a !== 0 && o.push(`translateY(${a}px)`), V(t) && t !== 0 && o.push(`rotate(${t}deg)`), V(n) && n !== 1 && o.push(`scaleX(${n})`), V(r) && r !== 1 && o.push(`scaleY(${r})`);
			var s = o.length ? o.join(" ") : "none";
			return {
				WebkitTransform: s,
				msTransform: s,
				transform: s
			};
		}
		function Ze(e) {
			var n = t({}, e), r = 0;
			return G(e, function(e, t) {
				delete n[t], G(n, function(t) {
					var n = Math.abs(e.startX - t.startX), i = Math.abs(e.startY - t.startY), a = Math.abs(e.endX - t.endX), o = Math.abs(e.endY - t.endY), s = Math.sqrt(n * n + i * i), c = (Math.sqrt(a * a + o * o) - s) / s;
					Math.abs(c) > Math.abs(r) && (r = c);
				});
			}), r;
		}
		function Qe(e, n) {
			var r = e.pageX, i = e.pageY, a = {
				endX: r,
				endY: i
			};
			return n ? a : t({
				startX: r,
				startY: i
			}, a);
		}
		function $e(e) {
			var t = 0, n = 0, r = 0;
			return G(e, function(e) {
				var i = e.startX, a = e.startY;
				t += i, n += a, r += 1;
			}), t /= r, n /= r, {
				pageX: t,
				pageY: n
			};
		}
		function $(e) {
			var t = e.aspectRatio, n = e.height, r = e.width, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "contain", a = Oe(r), o = Oe(n);
			if (a && o) {
				var s = n * t;
				i === "contain" && s > r || i === "cover" && s < r ? n = r / t : r = n * t;
			} else a ? n = r / t : o && (r = n * t);
			return {
				width: r,
				height: n
			};
		}
		function et(e) {
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
		function tt(e, t, n, r) {
			var i = t.aspectRatio, a = t.naturalWidth, o = t.naturalHeight, s = t.rotate, c = s === void 0 ? 0 : s, u = t.scaleX, d = u === void 0 ? 1 : u, f = t.scaleY, p = f === void 0 ? 1 : f, m = n.aspectRatio, h = n.naturalWidth, g = n.naturalHeight, _ = r.fillColor, v = _ === void 0 ? "transparent" : _, y = r.imageSmoothingEnabled, ee = y === void 0 || y, b = r.imageSmoothingQuality, x = b === void 0 ? "low" : b, S = r.maxWidth, C = S === void 0 ? Infinity : S, w = r.maxHeight, T = w === void 0 ? Infinity : w, E = r.minWidth, D = E === void 0 ? 0 : E, O = r.minHeight, k = O === void 0 ? 0 : O, A = document.createElement("canvas"), j = A.getContext("2d"), M = $({
				aspectRatio: m,
				width: C,
				height: T
			}), N = $({
				aspectRatio: m,
				width: D,
				height: k
			}, "cover"), P = Math.min(M.width, Math.max(N.width, h)), te = Math.min(M.height, Math.max(N.height, g)), F = $({
				aspectRatio: i,
				width: C,
				height: T
			}), I = $({
				aspectRatio: i,
				width: D,
				height: k
			}, "cover"), L = Math.min(F.width, Math.max(I.width, a)), ne = Math.min(F.height, Math.max(I.height, o)), R = [
				-L / 2,
				-ne / 2,
				L,
				ne
			];
			return A.width = Pe(P), A.height = Pe(te), j.fillStyle = v, j.fillRect(0, 0, P, te), j.save(), j.translate(P / 2, te / 2), j.rotate(c * Math.PI / 180), j.scale(d, p), j.imageSmoothingEnabled = ee, j.imageSmoothingQuality = x, j.drawImage.apply(j, [e].concat(l(R.map(function(e) {
				return Math.floor(Pe(e));
			})))), j.restore(), A;
		}
		var nt = String.fromCharCode;
		function rt(e, t, n) {
			var r = "";
			n += t;
			for (var i = t; i < n; i += 1) r += nt(e.getUint8(i));
			return r;
		}
		var it = /^data:.*,/;
		function at(e) {
			var t = e.replace(it, ""), n = atob(t), r = new ArrayBuffer(n.length), i = new Uint8Array(r);
			return G(i, function(e, t) {
				i[t] = n.charCodeAt(t);
			}), r;
		}
		function ot(e, t) {
			for (var n = [], r = 8192, i = new Uint8Array(e); i.length > 0;) n.push(nt.apply(null, Me(i.subarray(0, r)))), i = i.subarray(r);
			return `data:${t};base64,${btoa(n.join(""))}`;
		}
		function st(e) {
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
					if (rt(t, c, 4) === "Exif") {
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
		function ct(e) {
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
		var lt = {
			render: function() {
				this.initContainer(), this.initCanvas(), this.initCropBox(), this.renderCanvas(), this.cropped && this.renderCropBox();
			},
			initContainer: function() {
				var e = this.element, t = this.options, n = this.container, r = this.cropper, i = Number(t.minContainerWidth), a = Number(t.minContainerHeight);
				J(r, N), Y(e, N);
				var o = {
					width: Math.max(n.offsetWidth, i >= 0 ? i : we),
					height: Math.max(n.offsetHeight, a >= 0 ? a : B)
				};
				this.containerData = o, q(r, {
					width: o.width,
					height: o.height
				}), J(e, N), Y(r, N);
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
				this.canvasData = l, this.limited = n === 1 || n === 2, this.limitCanvas(!0, !0), l.width = Math.min(Math.max(l.width, l.minWidth), l.maxWidth), l.height = Math.min(Math.max(l.height, l.minHeight), l.maxHeight), l.left = (e.width - l.width) / 2, l.top = (e.height - l.height) / 2, l.oldLeft = l.left, l.oldTop = l.top, this.initialCanvasData = K({}, l);
			},
			limitCanvas: function(e, t) {
				var n = this.options, r = this.containerData, i = this.canvasData, a = this.cropBoxData, o = n.viewMode, s = i.aspectRatio, c = this.cropped && a;
				if (e) {
					var l = Number(n.minCanvasWidth) || 0, u = Number(n.minCanvasHeight) || 0;
					o > 1 ? (l = Math.max(l, r.width), u = Math.max(u, r.height), o === 3 && (u * s > l ? l = u * s : u = l / s)) : o > 0 && (l ? l = Math.max(l, c ? a.width : 0) : u ? u = Math.max(u, c ? a.height : 0) : c && (l = a.width, u = a.height, u * s > l ? l = u * s : u = l / s));
					var d = $({
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
					var i = et({
						width: r.naturalWidth * Math.abs(r.scaleX || 1),
						height: r.naturalHeight * Math.abs(r.scaleY || 1),
						degree: r.rotate || 0
					}), a = i.width, o = i.height, s = n.width * (a / n.naturalWidth), c = n.height * (o / n.naturalHeight);
					n.left -= (s - n.width) / 2, n.top -= (c - n.height) / 2, n.width = s, n.height = c, n.aspectRatio = a / o, n.naturalWidth = a, n.naturalHeight = o, this.limitCanvas(!0, !1);
				}
				(n.width > n.maxWidth || n.width < n.minWidth) && (n.left = n.oldLeft), (n.height > n.maxHeight || n.height < n.minHeight) && (n.top = n.oldTop), n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth), n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight), this.limitCanvas(!1, !0), n.left = Math.min(Math.max(n.left, n.minLeft), n.maxLeft), n.top = Math.min(Math.max(n.top, n.minTop), n.maxTop), n.oldLeft = n.left, n.oldTop = n.top, q(this.canvas, K({
					width: n.width,
					height: n.height
				}, Xe({
					translateX: n.left,
					translateY: n.top
				}))), this.renderImage(e), this.cropped && this.limited && this.limitCropBox(!0, !0);
			},
			renderImage: function(e) {
				var t = this.canvasData, n = this.imageData, r = n.naturalWidth * (t.width / t.naturalWidth), i = n.naturalHeight * (t.height / t.naturalHeight);
				K(n, {
					width: r,
					height: i,
					left: (t.width - r) / 2,
					top: (t.height - i) / 2
				}), q(this.image, K({
					width: n.width,
					height: n.height
				}, Xe(K({
					translateX: n.left,
					translateY: n.top
				}, n)))), e && this.output();
			},
			initCropBox: function() {
				var e = this.options, t = this.canvasData, n = e.aspectRatio || e.initialAspectRatio, r = Number(e.autoCropArea) || .8, i = {
					width: t.width,
					height: t.height
				};
				n && (t.height * n > t.width ? i.height = i.width / n : i.width = i.height * n), this.cropBoxData = i, this.limitCropBox(!0, !0), i.width = Math.min(Math.max(i.width, i.minWidth), i.maxWidth), i.height = Math.min(Math.max(i.height, i.minHeight), i.maxHeight), i.width = Math.max(i.minWidth, i.width * r), i.height = Math.max(i.minHeight, i.height * r), i.left = t.left + (t.width - i.width) / 2, i.top = t.top + (t.height - i.height) / 2, i.oldLeft = i.left, i.oldTop = i.top, this.initialCropBoxData = K({}, i);
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
				(n.width > n.maxWidth || n.width < n.minWidth) && (n.left = n.oldLeft), (n.height > n.maxHeight || n.height < n.minHeight) && (n.top = n.oldTop), n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth), n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight), this.limitCropBox(!1, !0), n.left = Math.min(Math.max(n.left, n.minLeft), n.maxLeft), n.top = Math.min(Math.max(n.top, n.minTop), n.maxTop), n.oldLeft = n.left, n.oldTop = n.top, e.movable && e.cropBoxMovable && X(this.face, L, n.width >= t.width && n.height >= t.height ? x : ee), q(this.cropBox, K({
					width: n.width,
					height: n.height
				}, Xe({
					translateX: n.left,
					translateY: n.top
				}))), this.cropped && this.limited && this.limitCanvas(!0, !0), this.disabled || this.output();
			},
			output: function() {
				this.preview(), We(this.element, ae, this.getData());
			}
		}, ut = {
			initPreview: function() {
				var e = this.element, t = this.crossOrigin, n = this.options.preview, r = t ? this.crossOriginUrl : this.url, i = e.alt || "The image to preview", a = document.createElement("img");
				if (t && (a.crossOrigin = t), a.src = r, a.alt = i, this.viewBox.appendChild(a), this.viewBoxImage = a, n) {
					var o = n;
					typeof n == "string" ? o = e.ownerDocument.querySelectorAll(n) : n.querySelector && (o = [n]), this.previews = o, G(o, function(e) {
						var n = document.createElement("img");
						X(e, ne, {
							width: e.offsetWidth,
							height: e.offsetHeight,
							html: e.innerHTML
						}), t && (n.crossOrigin = t), n.src = r, n.alt = i, n.style.cssText = "display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;\"", e.innerHTML = "", e.appendChild(n);
					});
				}
			},
			resetPreview: function() {
				G(this.previews, function(e) {
					var t = Be(e, ne);
					q(e, {
						width: t.width,
						height: t.height
					}), e.innerHTML = t.html, Ve(e, ne);
				});
			},
			preview: function() {
				var e = this.imageData, t = this.canvasData, n = this.cropBoxData, r = n.width, i = n.height, a = e.width, o = e.height, s = n.left - t.left - e.left, c = n.top - t.top - e.top;
				!this.cropped || this.disabled || (q(this.viewBoxImage, K({
					width: a,
					height: o
				}, Xe(K({
					translateX: -s,
					translateY: -c
				}, e)))), G(this.previews, function(t) {
					var n = Be(t, ne), l = n.width, u = n.height, d = l, f = u, p = 1;
					r && (p = l / r, f = i * p), i && f > u && (p = u / i, d = r * p, f = u), q(t, {
						width: d,
						height: f
					}), q(t.getElementsByTagName("img")[0], K({
						width: a * p,
						height: o * p
					}, Xe(K({
						translateX: -s * p,
						translateY: -c * p
					}, e))));
				}));
			}
		}, dt = {
			bind: function() {
				var e = this.element, t = this.options, n = this.cropper;
				W(t.cropstart) && Q(e, ce, t.cropstart), W(t.cropmove) && Q(e, se, t.cropmove), W(t.cropend) && Q(e, oe, t.cropend), W(t.crop) && Q(e, ae, t.crop), W(t.zoom) && Q(e, ve, t.zoom), Q(n, pe, this.onCropStart = this.cropStart.bind(this)), t.zoomable && t.zoomOnWheel && Q(n, z, this.onWheel = this.wheel.bind(this), {
					passive: !1,
					capture: !0
				}), t.toggleDragModeOnDblclick && Q(n, le, this.onDblclick = this.dblclick.bind(this)), Q(e.ownerDocument, me, this.onCropMove = this.cropMove.bind(this)), Q(e.ownerDocument, he, this.onCropEnd = this.cropEnd.bind(this)), t.responsive && Q(window, _e, this.onResize = this.resize.bind(this));
			},
			unbind: function() {
				var e = this.element, t = this.options, n = this.cropper;
				W(t.cropstart) && Z(e, ce, t.cropstart), W(t.cropmove) && Z(e, se, t.cropmove), W(t.cropend) && Z(e, oe, t.cropend), W(t.crop) && Z(e, ae, t.crop), W(t.zoom) && Z(e, ve, t.zoom), Z(n, pe, this.onCropStart), t.zoomable && t.zoomOnWheel && Z(n, z, this.onWheel, {
					passive: !1,
					capture: !0
				}), t.toggleDragModeOnDblclick && Z(n, le, this.onDblclick), Z(e.ownerDocument, me, this.onCropMove), Z(e.ownerDocument, he, this.onCropEnd), t.responsive && Z(window, _e, this.onResize);
			}
		}, ft = {
			resize: function() {
				if (!this.disabled) {
					var e = this.options, t = this.container, n = this.containerData, r = t.offsetWidth / n.width, i = t.offsetHeight / n.height, a = Math.abs(r - 1) > Math.abs(i - 1) ? r : i;
					if (a !== 1) {
						var o, s;
						e.restore && (o = this.getCanvasData(), s = this.getCropBoxData()), this.render(), e.restore && (this.setCanvasData(G(o, function(e, t) {
							o[t] = e * a;
						})), this.setCropBoxData(G(s, function(e, t) {
							s[t] = e * a;
						})));
					}
				}
			},
			dblclick: function() {
				this.disabled || this.options.dragMode === ie || this.setDragMode(Ie(this.dragBox, j) ? re : R);
			},
			wheel: function(e) {
				var t = this, n = Number(this.options.wheelZoomRatio) || .1, r = 1;
				this.disabled || (e.preventDefault(), !this.wheeling && (this.wheeling = !0, setTimeout(function() {
					t.wheeling = !1;
				}, 50), e.deltaY ? r = e.deltaY > 0 ? 1 : -1 : e.wheelDelta ? r = -e.wheelDelta / 120 : e.detail && (r = e.detail > 0 ? 1 : -1), this.zoom(-r * n, e)));
			},
			cropStart: function(e) {
				var t = e.buttons, n = e.button;
				if (!(this.disabled || (e.type === "mousedown" || e.type === "pointerdown" && e.pointerType === "mouse") && (V(t) && t !== 1 || V(n) && n !== 0 || e.ctrlKey))) {
					var r = this.options, i = this.pointers, a;
					e.changedTouches ? G(e.changedTouches, function(e) {
						i[e.identifier] = Qe(e);
					}) : i[e.pointerId || 0] = Qe(e), a = Object.keys(i).length > 1 && r.zoomable && r.zoomOnTouch ? S : Be(e.target, L), be.test(a) && We(this.element, ce, {
						originalEvent: e,
						action: a
					}) !== !1 && (e.preventDefault(), this.action = a, this.cropping = !1, a === b && (this.cropping = !0, J(this.dragBox, F)));
				}
			},
			cropMove: function(e) {
				var t = this.action;
				if (!(this.disabled || !t)) {
					var n = this.pointers;
					e.preventDefault(), We(this.element, se, {
						originalEvent: e,
						action: t
					}) !== !1 && (e.changedTouches ? G(e.changedTouches, function(e) {
						K(n[e.identifier] || {}, Qe(e, !0));
					}) : K(n[e.pointerId || 0] || {}, Qe(e, !0)), this.change(e));
				}
			},
			cropEnd: function(e) {
				if (!this.disabled) {
					var t = this.action, n = this.pointers;
					e.changedTouches ? G(e.changedTouches, function(e) {
						delete n[e.identifier];
					}) : delete n[e.pointerId || 0], t && (e.preventDefault(), Object.keys(n).length || (this.action = ""), this.cropping && (this.cropping = !1, Le(this.dragBox, F, this.cropped && this.options.modal)), We(this.element, oe, {
						originalEvent: e,
						action: t
					}));
				}
			}
		}, pt = { change: function(e) {
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
					this.zoom(Ze(a), e), v = !1;
					break;
				case b:
					if (!M.x || !M.y) {
						v = !1;
						break;
					}
					y = Ge(this.cropper), c = j.startX - y.left, l = j.startY - y.top, u = i.minWidth, d = i.minHeight, M.x > 0 ? o = M.y > 0 ? k : D : M.x < 0 && (c -= u, o = M.y > 0 ? A : O), M.y < 0 && (l -= d), this.cropped || (Y(this.cropBox, N), this.cropped = !0, this.limited && this.limitCropBox(!0, !0));
			}
			v && (i.width = u, i.height = d, i.left = c, i.top = l, this.action = o, this.renderCropBox()), G(a, function(e) {
				e.startX = e.endX, e.startY = e.endY;
			});
		} }, mt = {
			crop: function() {
				return this.ready && !this.cropped && !this.disabled && (this.cropped = !0, this.limitCropBox(!0, !0), this.options.modal && J(this.dragBox, F), Y(this.cropBox, N), this.setCropBoxData(this.initialCropBoxData)), this;
			},
			reset: function() {
				return this.ready && !this.disabled && (this.imageData = K({}, this.initialImageData), this.canvasData = K({}, this.initialCanvasData), this.cropBoxData = K({}, this.initialCropBoxData), this.renderCanvas(), this.cropped && this.renderCropBox()), this;
			},
			clear: function() {
				return this.cropped && !this.disabled && (K(this.cropBoxData, {
					left: 0,
					top: 0,
					width: 0,
					height: 0
				}), this.cropped = !1, this.renderCropBox(), this.limitCanvas(!0, !0), this.renderCanvas(), Y(this.dragBox, F), J(this.cropBox, N)), this;
			},
			replace: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 && arguments[1];
				return !this.disabled && e && (this.isImg && (this.element.src = e), t ? (this.url = e, this.image.src = e, this.ready && (this.viewBoxImage.src = e, G(this.previews, function(t) {
					t.getElementsByTagName("img")[0].src = e;
				}))) : (this.isImg && (this.replaced = !0), this.options.data = null, this.uncreate(), this.load(e))), this;
			},
			enable: function() {
				return this.ready && this.disabled && (this.disabled = !1, Y(this.cropper, M)), this;
			},
			disable: function() {
				return this.ready && !this.disabled && (this.disabled = !0, J(this.cropper, M)), this;
			},
			destroy: function() {
				var e = this.element;
				return e[y] ? (e[y] = void 0, this.isImg && this.replaced && (e.src = this.originalUrl), this.uncreate(), this) : this;
			},
			move: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.canvasData, r = n.left, i = n.top;
				return this.moveTo(H(e) ? e : r + Number(e), H(t) ? t : i + Number(t));
			},
			moveTo: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.canvasData, r = !1;
				return e = Number(e), t = Number(t), this.ready && !this.disabled && this.options.movable && (V(e) && (n.left = e, r = !0), V(t) && (n.top = t, r = !0), r && this.renderCanvas(!0)), this;
			},
			zoom: function(e, t) {
				var n = this.canvasData;
				return e = Number(e), e = e < 0 ? 1 / (1 - e) : 1 + e, this.zoomTo(n.width * e / n.naturalWidth, null, t);
			},
			zoomTo: function(e, t, n) {
				var r = this.options, i = this.canvasData, a = i.width, o = i.height, s = i.naturalWidth, c = i.naturalHeight;
				if (e = Number(e), e >= 0 && this.ready && !this.disabled && r.zoomable) {
					var l = s * e, u = c * e;
					if (We(this.element, ve, {
						ratio: e,
						oldRatio: a / s,
						originalEvent: n
					}) === !1) return this;
					if (n) {
						var d = this.pointers, f = Ge(this.cropper), p = d && Object.keys(d).length ? $e(d) : {
							pageX: n.pageX,
							pageY: n.pageY
						};
						i.left -= (l - a) * ((p.pageX - f.left - i.left) / a), i.top -= (u - o) * ((p.pageY - f.top - i.top) / o);
					} else Ae(t) && V(t.x) && V(t.y) ? (i.left -= (l - a) * ((t.x - i.left) / a), i.top -= (u - o) * ((t.y - i.top) / o)) : (i.left -= (l - a) / 2, i.top -= (u - o) / 2);
					i.width = l, i.height = u, this.renderCanvas(!0);
				}
				return this;
			},
			rotate: function(e) {
				return this.rotateTo((this.imageData.rotate || 0) + Number(e));
			},
			rotateTo: function(e) {
				return e = Number(e), V(e) && this.ready && !this.disabled && this.options.rotatable && (this.imageData.rotate = e % 360, this.renderCanvas(!0, !0)), this;
			},
			scaleX: function(e) {
				var t = this.imageData.scaleY;
				return this.scale(e, V(t) ? t : 1);
			},
			scaleY: function(e) {
				var t = this.imageData.scaleX;
				return this.scale(V(t) ? t : 1, e);
			},
			scale: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.imageData, r = !1;
				return e = Number(e), t = Number(t), this.ready && !this.disabled && this.options.scalable && (V(e) && (n.scaleX = e, r = !0), V(t) && (n.scaleY = t, r = !0), r && this.renderCanvas(!0, !0)), this;
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
					if (G(a, function(e, t) {
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
				if (this.ready && !this.disabled && Ae(e)) {
					var a = !1;
					t.rotatable && V(e.rotate) && e.rotate !== n.rotate && (n.rotate = e.rotate, a = !0), t.scalable && (V(e.scaleX) && e.scaleX !== n.scaleX && (n.scaleX = e.scaleX, a = !0), V(e.scaleY) && e.scaleY !== n.scaleY && (n.scaleY = e.scaleY, a = !0)), a && this.renderCanvas(!0, !0);
					var o = n.width / n.naturalWidth;
					V(e.x) && (i.left = e.x * o + r.left), V(e.y) && (i.top = e.y * o + r.top), V(e.width) && (i.width = e.width * o), V(e.height) && (i.height = e.height * o), this.setCropBoxData(i);
				}
				return this;
			},
			getContainerData: function() {
				return this.ready ? K({}, this.containerData) : {};
			},
			getImageData: function() {
				return this.sized ? K({}, this.imageData) : {};
			},
			getCanvasData: function() {
				var e = this.canvasData, t = {};
				return this.ready && G([
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
				return this.ready && !this.disabled && Ae(e) && (V(e.left) && (t.left = e.left), V(e.top) && (t.top = e.top), V(e.width) ? (t.width = e.width, t.height = e.width / n) : V(e.height) && (t.height = e.height, t.width = e.height * n), this.renderCanvas(!0)), this;
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
				return this.ready && this.cropped && !this.disabled && Ae(e) && (V(e.left) && (t.left = e.left), V(e.top) && (t.top = e.top), V(e.width) && e.width !== t.width && (r = !0, t.width = e.width), V(e.height) && e.height !== t.height && (i = !0, t.height = e.height), n && (r ? t.height = t.width / n : i && (t.width = t.height * n)), this.renderCropBox()), this;
			},
			getCroppedCanvas: function() {
				var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
				if (!this.ready || !window.HTMLCanvasElement) return null;
				var t = this.canvasData, n = tt(this.image, this.imageData, t, e);
				if (!this.cropped) return n;
				var r = this.getData(e.rounded), i = r.x, a = r.y, o = r.width, s = r.height, c = n.width / Math.floor(t.naturalWidth);
				c !== 1 && (i *= c, a *= c, o *= c, s *= c);
				var u = o / s, d = $({
					aspectRatio: u,
					width: e.maxWidth || Infinity,
					height: e.maxHeight || Infinity
				}), f = $({
					aspectRatio: u,
					width: e.minWidth || 0,
					height: e.minHeight || 0
				}, "cover"), p = $({
					aspectRatio: u,
					width: e.width || (c === 1 ? o : n.width),
					height: e.height || (c === 1 ? s : n.height)
				}), m = p.width, h = p.height;
				m = Math.min(d.width, Math.max(f.width, m)), h = Math.min(d.height, Math.max(f.height, h));
				var g = document.createElement("canvas"), _ = g.getContext("2d");
				g.width = Pe(m), g.height = Pe(h), _.fillStyle = e.fillColor || "transparent", _.fillRect(0, 0, m, h);
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
					return Math.floor(Pe(e));
				})))), g;
			},
			setAspectRatio: function(e) {
				var t = this.options;
				return !this.disabled && !H(e) && (t.aspectRatio = Math.max(0, e) || NaN, this.ready && (this.initCropBox(), this.cropped && this.renderCropBox())), this;
			},
			setDragMode: function(e) {
				var t = this.options, n = this.dragBox, r = this.face;
				if (this.ready && !this.disabled) {
					var i = e === R, a = t.movable && e === re;
					e = i || a ? e : ie, t.dragMode = e, X(n, L, e), Le(n, j, i), Le(n, I, a), t.cropBoxMovable || (X(r, L, e), Le(r, j, i), Le(r, I, a));
				}
				return this;
			}
		}, ht = g.Cropper, gt = /*#__PURE__*/ function() {
			function e(t) {
				var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				if (a(this, e), !t || !Ce.test(t.tagName)) throw Error("The first argument is required and must be an <img> or <canvas> element.");
				this.element = t, this.options = K({}, Te, Ae(n) && n), this.cropped = !1, this.disabled = !1, this.pointers = {}, this.ready = !1, this.reloading = !1, this.replaced = !1, this.sized = !1, this.sizing = !1, this.init();
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
							if (xe.test(e)) {
								Se.test(e) ? this.read(at(e)) : this.clone();
								return;
							}
							var i = new XMLHttpRequest(), a = this.clone.bind(this);
							this.reloading = !0, this.xhr = i, i.onabort = a, i.onerror = a, i.ontimeout = a, i.onprogress = function() {
								i.getResponseHeader("content-type") !== ye && i.abort();
							}, i.onload = function() {
								t.read(i.response);
							}, i.onloadend = function() {
								t.reloading = !1, t.xhr = null;
							}, r.checkCrossOrigin && Je(e) && n.crossOrigin && (e = Ye(e)), i.open("GET", e, !0), i.responseType = "arraybuffer", i.withCredentials = n.crossOrigin === "use-credentials", i.send();
						}
					}
				},
				{
					key: "read",
					value: function(e) {
						var t = this.options, n = this.imageData, r = st(e), i = 0, a = 1, o = 1;
						if (r > 1) {
							this.url = ot(e, ye);
							var s = ct(r);
							i = s.rotate, a = s.scaleX, o = s.scaleY;
						}
						t.rotatable && (n.rotate = i), t.scalable && (n.scaleX = a, n.scaleY = o), this.clone();
					}
				},
				{
					key: "clone",
					value: function() {
						var e = this.element, t = this.url, n = e.crossOrigin, r = t;
						this.options.checkCrossOrigin && Je(t) && (n || (n = "anonymous"), r = Ye(t)), this.crossOrigin = n, this.crossOriginUrl = r;
						var i = document.createElement("img");
						n && (i.crossOrigin = n), i.src = r || t, i.alt = e.alt || "The image to crop", this.image = i, i.onload = this.start.bind(this), i.onerror = this.stop.bind(this), J(i, P), e.parentNode.insertBefore(i, e.nextSibling);
					}
				},
				{
					key: "start",
					value: function() {
						var e = this, t = this.image;
						t.onload = null, t.onerror = null, this.sizing = !0;
						var n = g.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(g.navigator.userAgent), r = function(t, n) {
							K(e.imageData, {
								naturalWidth: t,
								naturalHeight: n,
								aspectRatio: t / n
							}), e.initialImageData = K({}, e.imageData), e.sizing = !1, e.sized = !0, e.build();
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
							i.innerHTML = Ee;
							var a = i.querySelector(`.${y}-container`), o = a.querySelector(`.${y}-canvas`), s = a.querySelector(`.${y}-drag-box`), c = a.querySelector(`.${y}-crop-box`), l = c.querySelector(`.${y}-face`);
							this.container = r, this.cropper = a, this.canvas = o, this.dragBox = s, this.cropBox = c, this.viewBox = a.querySelector(`.${y}-view-box`), this.face = l, o.appendChild(n), J(e, N), r.insertBefore(a, e.nextSibling), Y(n, P), this.initPreview(), this.bind(), t.initialAspectRatio = Math.max(0, t.initialAspectRatio) || NaN, t.aspectRatio = Math.max(0, t.aspectRatio) || NaN, t.viewMode = Math.max(0, Math.min(3, Math.round(t.viewMode))) || 0, J(c, N), t.guides || J(c.getElementsByClassName(`${y}-dashed`), N), t.center || J(c.getElementsByClassName(`${y}-center`), N), t.background && J(a, `${y}-bg`), t.highlight || J(l, te), t.cropBoxMovable && (J(l, I), X(l, L, ee)), t.cropBoxResizable || (J(c.getElementsByClassName(`${y}-line`), N), J(c.getElementsByClassName(`${y}-point`), N)), this.render(), this.ready = !0, this.setDragMode(t.dragMode), t.autoCrop && this.crop(), this.setData(t.data), W(t.ready) && Q(e, ge, t.ready, { once: !0 }), We(e, ge);
						}
					}
				},
				{
					key: "unbuild",
					value: function() {
						if (this.ready) {
							this.ready = !1, this.unbind(), this.resetPreview();
							var e = this.cropper.parentNode;
							e && e.removeChild(this.cropper), Y(this.element, N);
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
					K(Te, Ae(e) && e);
				}
			}]);
		}();
		return K(gt.prototype, lt, ut, dt, ft, pt, mt), gt;
	}));
})), l = r(), u = /* @__PURE__ */ t(c(), 1), d = (e, t, n) => Math.max(t, Math.min(e, n));
function f(e, t) {
	let n = d(Math.round(e.x), 0, Math.max(0, t.width - 1)), r = d(Math.round(e.y), 0, Math.max(0, t.height - 1));
	return {
		x: n,
		y: r,
		width: d(Math.round(e.width), 1, Math.max(1, t.width - n)),
		height: d(Math.round(e.height), 1, Math.max(1, t.height - r))
	};
}
//#endregion
//#region src/watermarkGeometry.ts
function p(e, t, n, r, i) {
	if (e <= 0 || t <= 0 || n <= 0 || r <= 0) return null;
	let a = Math.max(1, e * i / 100), o = Math.max(1, r * a / n);
	return o > t && (o = t, a = Math.max(1, n * o / r)), {
		width: a,
		height: o
	};
}
//#endregion
//#region src/components/ImageEditor.tsx
var m = n(), h = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, g = {
	"image/avif": ["avif"],
	"image/jpeg": ["jpg", "jpeg"],
	"image/png": ["png"],
	"image/webp": ["webp"],
	"image/gif": ["gif"],
	"image/bmp": ["bmp"],
	"image/x-bmp": ["bmp"],
	"image/vnd.microsoft.icon": ["ico"],
	"image/x-icon": ["ico"]
}, _ = {
	jpeg: "jpg",
	png: "png",
	webp: "webp",
	avif: "avif"
}, v = 95, y = 100, ee = {
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
function b({ entry: e, info: t, imageUrl: n, resource: r, watermarkUrl: c, presets: d, formats: b, actions: x, resizeLimits: S, enabledTools: C, maximumFileNameLength: w, labels: T, onClose: E, onSave: D }) {
	let O = (0, l.useRef)({
		x: 0,
		y: 0,
		width: t.width,
		height: t.height
	}).current, k = (0, l.useRef)(null), A = (0, l.useRef)(null), j = (0, l.useRef)(O), M = (0, l.useRef)(1), N = (0, l.useRef)(null), P = (0, l.useRef)(null), te = (0, l.useRef)(null), F = (0, l.useRef)(null), I = (0, l.useRef)([]), L = (0, l.useRef)([]), ne = [
		...C.crop ? ["crop"] : [],
		...C.rotate ? ["rotate"] : [],
		...C.resize ? ["resize"] : [],
		...C.presets ? ["preset"] : [],
		...C.process && i(x, "optimize") ? ["optimize"] : [],
		...C.process && (i(x, "watermarkText") || i(x, "watermarkImage")) ? ["watermark"] : []
	], [R, re] = (0, l.useState)(ne[0] || "crop"), [ie, ae] = (0, l.useState)(O), [oe, se] = (0, l.useState)(!1), [ce, le] = (0, l.useState)([]), [ue, de] = (0, l.useState)([]), [fe, pe] = (0, l.useState)("free"), [me, he] = (0, l.useState)(1), [ge, _e] = (0, l.useState)(!1), [z, ve] = (0, l.useState)(0), [ye, be] = (0, l.useState)(!1), [xe, Se] = (0, l.useState)(t.width), [Ce, we] = (0, l.useState)(t.height), [B, Te] = (0, l.useState)(""), [Ee, De] = (0, l.useState)(!1), [V, Oe] = (0, l.useState)(82), [H, ke] = (0, l.useState)("original"), [U, Ae] = (0, l.useState)("none"), [W, je] = (0, l.useState)("SoFinder"), [Me, G] = (0, l.useState)("interface"), [K, Ne] = (0, l.useState)("#ffffff"), [Pe, Fe] = (0, l.useState)(r), [q, Ie] = (0, l.useState)(""), [J, Y] = (0, l.useState)("bottom-right"), [Le, Re] = (0, l.useState)(100), [ze, Be] = (0, l.useState)(100), [X, Ve] = (0, l.useState)(60), [He, Ue] = (0, l.useState)(25), [Z, Q] = (0, l.useState)({
		left: 0,
		top: 0,
		width: 0,
		height: 0
	}), [We, Ge] = (0, l.useState)({
		width: 0,
		height: 0
	}), [Ke, qe] = (0, l.useState)("copy"), [Je, Ye] = (0, l.useState)(!1), [Xe, Ze] = (0, l.useState)(""), Qe = e.name.lastIndexOf("."), $e = Qe > 0 ? e.name.slice(Qe + 1) : "", $ = g[(e.mimeType || "").toLowerCase()] || [], et = $.includes($e.toLowerCase()) ? $e : $[0] || $e, tt = H === "original" ? et : _[H] || H, nt = `${Qe > 0 ? e.name.slice(0, Qe) : e.name}-edited`, [rt, it] = (0, l.useState)(nt), at = H === "original" ? Ke : "copy", ot = tt ? `${rt.trim()}.${tt}` : rt.trim(), st = at === "copy" ? s(ot, w) : null, ct = oe, lt = U === "text" ? !W.trim() : U === "image" && !q.trim(), ut = S?.width ?? 4096, dt = S?.height ?? 4096, ft = ye && (!Number.isInteger(xe) || !Number.isInteger(Ce) || xe < 1 || Ce < 1 || xe > ut || Ce > dt), pt = ct || z !== 0 || ye || !!B || Ee || U !== "none", mt = B ? d[B] : ye ? {
		width: xe,
		height: Ce
	} : oe ? ie : O, ht = !B && !ye && (z === 90 || z === 270) ? mt.height : mt.width, gt = !B && !ye && (z === 90 || z === 270) ? mt.width : mt.height, _t = (e) => f(e, t), vt = (e) => {
		j.current = e, ae(e);
	}, yt = (e) => {
		I.current = e, le(e);
	}, bt = (e) => {
		L.current = e, de(e);
	}, xt = (e, t) => {
		h(e, t) || (yt([...I.current.slice(-39), e]), bt([]));
	}, St = (e, n = !0) => {
		let r = f(e, t);
		n && xt(j.current, r), se(!0), A.current?.setData(r), vt(r);
	}, Ct = (e = fe) => e === "original" ? t.width / t.height : e === "1:1" ? 1 : e === "4:3" ? 4 / 3 : e === "16:9" ? 16 / 9 : NaN, wt = (e) => e === "top-left" ? [0, 0] : e === "top-right" ? [100, 0] : e === "center" ? [50, 50] : e === "bottom-left" ? [0, 100] : e === "bottom-right" ? [100, 100] : [Le, ze], Tt = (e) => {
		let [t, n] = wt(e);
		Y(e), Re(t), Be(n);
	}, Et = (e) => {
		let t = F.current, n = P.current, r = te.current;
		if (!t || !n || !r) return;
		let i = Math.max(1, n.clientWidth - r.offsetWidth), a = Math.max(1, n.clientHeight - r.offsetHeight);
		Re(Math.round(Math.max(0, Math.min(100, t.x + (e.clientX - t.clientX) * 100 / i)))), Be(Math.round(Math.max(0, Math.min(100, t.y + (e.clientY - t.clientY) * 100 / a)))), Y("custom");
	};
	(0, l.useEffect)(() => {
		let e = (e) => Et(e), t = (e) => Et(e), n = () => {
			F.current = null;
		};
		return window.addEventListener("pointermove", e), window.addEventListener("pointerup", n), window.addEventListener("pointercancel", n), window.addEventListener("mousemove", t), window.addEventListener("mouseup", n), () => {
			window.removeEventListener("pointermove", e), window.removeEventListener("pointerup", n), window.removeEventListener("pointercancel", n), window.removeEventListener("mousemove", t), window.removeEventListener("mouseup", n);
		};
	}, []), (0, l.useEffect)(() => {
		if (!k.current) return;
		let e = new u.default(k.current, {
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
				A.current = t;
				let n = t.getImageData();
				M.current = n.naturalWidth ? n.width / n.naturalWidth : 1, vt(_t(t.getData(!0)));
			},
			crop: (e) => vt(_t(e.detail)),
			cropstart: () => {
				N.current = j.current;
			},
			cropend: (e) => {
				let t = _t(e.currentTarget.cropper.getData(!0));
				N.current && xt(N.current, t), N.current = null, se(!0), vt(t);
			}
		});
		return A.current = e, () => {
			e.destroy(), A.current = null;
		};
	}, [
		n,
		t.width,
		t.height
	]), (0, l.useEffect)(() => {
		let e = () => {
			let e = A.current;
			if (!e) return;
			let t = oe ? e.getCropBoxData() : e.getCanvasData();
			Q({
				left: t.left,
				top: t.top,
				width: t.width,
				height: t.height
			});
		}, t = window.requestAnimationFrame(e), n = k.current?.closest(".sf-editor-canvas"), r = typeof ResizeObserver > "u" ? null : new ResizeObserver(e);
		return n && r?.observe(n), () => {
			window.cancelAnimationFrame(t), r?.disconnect();
		};
	}, [
		oe,
		ie,
		z,
		me
	]);
	let Dt = (e) => {
		pe(e), se(!0);
		let t = A.current;
		if (!t) return;
		let n = j.current;
		t.setAspectRatio(Ct(e));
		let r = _t(t.getData(!0));
		xt(n, r), vt(r);
	}, Ot = () => {
		let e = I.current.at(-1);
		e && (yt(I.current.slice(0, -1)), bt([j.current, ...L.current]), A.current?.setData(e), vt(e));
	}, kt = () => {
		let [e, ...t] = L.current;
		e && (bt(t), yt([...I.current, j.current]), A.current?.setData(e), vt(e));
	}, At = () => {
		let e = A.current;
		e?.reset().setAspectRatio(NaN), pe("free"), he(1), se(!1), yt([]), bt([]), e && vt(_t(e.getData(!0)));
	}, jt = (e) => {
		ve((z + e + 360) % 360), A.current?.rotate(e);
	}, Mt = () => {
		z && A.current?.rotate(-z), ve(0), At(), be(!1), Te(""), De(!1), ke("original"), Oe(82), Ae("none"), Y("bottom-right"), Re(100), Be(100);
	}, Nt = () => {
		let e = [];
		ct && e.push({
			type: "crop",
			...ie,
			quality: v
		}), z && e.push({
			type: "rotate",
			degrees: z,
			quality: v
		}), B ? e.push({
			type: "preset",
			name: B
		}) : ye && e.push({
			type: "resize",
			width: xe,
			height: Ce,
			quality: v
		});
		let t = J === "custom" ? {
			x: Le,
			y: ze
		} : {};
		return U === "text" ? e.push({
			type: "watermarkText",
			text: W.trim(),
			font: Me,
			color: K,
			position: J,
			...t,
			opacity: X,
			scale: He,
			quality: y
		}) : U === "image" && e.push({
			type: "watermarkImage",
			resource: Pe.trim() || r,
			path: q.trim(),
			position: J,
			...t,
			opacity: X,
			scale: He,
			quality: y
		}), Ee && e.push({
			type: "optimize",
			format: H,
			quality: V
		}), e;
	}, Pt = async () => {
		let e = Nt();
		if (!e.length) return;
		let t = at === "copy" ? {
			mode: at,
			...rt === nt && H === "original" ? {} : { name: ot }
		} : { mode: at };
		Ze(""), Ye(!0);
		try {
			await D(e, t);
		} catch (e) {
			Ze(e instanceof Error ? e.message : String(e));
		} finally {
			Ye(!1);
		}
	}, Ft = (e) => e === "preset" ? T.preset : e === "optimize" ? T.optimize : e === "watermark" ? T.watermark : T[e], It = [
		"top-left",
		"top-right",
		"center",
		"bottom-left",
		"bottom-right",
		"custom"
	], [Lt, Rt] = wt(J), zt = U === "image" && q.trim() ? c(Pe.trim() || r, q.trim()) : "", Bt = p(Z.width, Z.height, We.width, We.height, He);
	return (0, l.useEffect)(() => Ge({
		width: 0,
		height: 0
	}), [zt]), /* @__PURE__ */ (0, m.jsx)(o, {
		title: `${T.imageEdit}: ${e.name}`,
		closeLabel: T.close,
		onClose: E,
		className: "sf-image-editor",
		maximizable: !0,
		footer: /* @__PURE__ */ (0, m.jsxs)(m.Fragment, { children: [
			/* @__PURE__ */ (0, m.jsxs)("span", { children: [
				T.outputSize,
				": ",
				ht,
				" × ",
				gt,
				" px"
			] }),
			/* @__PURE__ */ (0, m.jsx)("button", {
				onClick: E,
				children: T.cancel
			}),
			/* @__PURE__ */ (0, m.jsx)("button", {
				className: "primary",
				disabled: Je || !pt || lt || ft || st !== null,
				onClick: () => void Pt(),
				children: Je ? T.saving : T.save
			})
		] }),
		children: /* @__PURE__ */ (0, m.jsxs)("div", {
			className: "sf-editor-workspace",
			children: [
				/* @__PURE__ */ (0, m.jsx)("nav", {
					className: "sf-editor-tools",
					"aria-label": T.imageTools,
					children: ne.map((e) => /* @__PURE__ */ (0, m.jsxs)("button", {
						className: R === e ? "active" : "",
						"aria-pressed": R === e,
						onClick: () => re(e),
						children: [/* @__PURE__ */ (0, m.jsx)(a, { name: e === "rotate" ? "rotate-right" : e === "crop" ? "crop" : "resize" }), /* @__PURE__ */ (0, m.jsx)("span", { children: Ft(e) })]
					}, e))
				}),
				/* @__PURE__ */ (0, m.jsxs)("div", {
					className: "sf-editor-main",
					children: [/* @__PURE__ */ (0, m.jsxs)("div", {
						className: "sf-editor-toolbar",
						children: [
							/* @__PURE__ */ (0, m.jsxs)("label", { children: [T.zoom, /* @__PURE__ */ (0, m.jsx)("input", {
								type: "range",
								min: "1",
								max: "3",
								step: "0.05",
								value: me,
								onChange: (e) => {
									let t = Number(e.target.value);
									he(t), A.current?.zoomTo(M.current * t);
								}
							})] }),
							/* @__PURE__ */ (0, m.jsx)("button", {
								disabled: !ce.length,
								onClick: Ot,
								children: T.undo
							}),
							/* @__PURE__ */ (0, m.jsx)("button", {
								disabled: !ue.length,
								onClick: kt,
								children: T.redo
							}),
							/* @__PURE__ */ (0, m.jsx)("button", {
								onClick: Mt,
								children: T.reset
							}),
							/* @__PURE__ */ (0, m.jsx)("button", {
								onPointerDown: () => _e(!0),
								onPointerUp: () => _e(!1),
								onPointerLeave: () => _e(!1),
								children: T.compare
							})
						]
					}), /* @__PURE__ */ (0, m.jsxs)("div", {
						className: `sf-editor-canvas${ge ? " sf-editor-comparing" : ""}${R === "crop" ? "" : " sf-editor-crop-inactive"}`,
						tabIndex: 0,
						onKeyDown: (e) => {
							let t = e.shiftKey ? 10 : 1, n = e.key === "ArrowLeft" ? [-t, 0] : e.key === "ArrowRight" ? [t, 0] : e.key === "ArrowUp" ? [0, -t] : e.key === "ArrowDown" ? [0, t] : null;
							n && R === "crop" && (e.preventDefault(), St({
								...j.current,
								x: j.current.x + n[0],
								y: j.current.y + n[1]
							})), (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && (e.preventDefault(), e.shiftKey ? kt() : Ot());
						},
						children: [/* @__PURE__ */ (0, m.jsx)("img", {
							ref: k,
							src: n,
							alt: ""
						}), U !== "none" && Z.width > 0 && /* @__PURE__ */ (0, m.jsx)("div", {
							ref: P,
							className: "sf-watermark-layer",
							style: Z,
							children: /* @__PURE__ */ (0, m.jsx)("div", {
								ref: te,
								className: `sf-watermark-preview${R === "watermark" ? " is-draggable" : ""}`,
								role: R === "watermark" ? "button" : void 0,
								tabIndex: R === "watermark" ? 0 : void 0,
								"aria-label": T.dragWatermark,
								style: {
									left: `${Lt}%`,
									top: `${Rt}%`,
									transform: `translate(-${Lt}%, -${Rt}%)`,
									color: K,
									opacity: X / 100,
									fontSize: `${Math.max(10, Math.min(Z.width, Z.height) * He / 500)}px`,
									width: U === "image" ? Bt ? `${Bt.width}px` : `${He}%` : void 0,
									height: U === "image" && Bt ? `${Bt.height}px` : void 0,
									...U === "text" ? ee[Me] : {}
								},
								onKeyDown: (e) => {
									let t = e.shiftKey ? 10 : 1;
									if (e.key === "ArrowLeft") Re(Math.max(0, Lt - t));
									else if (e.key === "ArrowRight") Re(Math.min(100, Lt + t));
									else if (e.key === "ArrowUp") Be(Math.max(0, Rt - t));
									else if (e.key === "ArrowDown") Be(Math.min(100, Rt + t));
									else return;
									e.preventDefault(), e.stopPropagation(), Y("custom");
								},
								onPointerDown: (e) => {
									R === "watermark" && e.pointerType !== "mouse" && (F.current = {
										clientX: e.clientX,
										clientY: e.clientY,
										x: Lt,
										y: Rt
									});
								},
								onMouseDown: (e) => {
									R === "watermark" && (e.preventDefault(), F.current = {
										clientX: e.clientX,
										clientY: e.clientY,
										x: Lt,
										y: Rt
									});
								},
								children: U === "text" ? W : zt && /* @__PURE__ */ (0, m.jsx)("img", {
									src: zt,
									alt: "",
									draggable: !1,
									onLoad: (e) => Ge({
										width: e.currentTarget.naturalWidth,
										height: e.currentTarget.naturalHeight
									})
								})
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, m.jsxs)("aside", {
					className: "sf-editor-panel",
					children: [
						/* @__PURE__ */ (0, m.jsx)("h3", { children: Ft(R) }),
						R === "crop" && /* @__PURE__ */ (0, m.jsxs)(m.Fragment, { children: [
							/* @__PURE__ */ (0, m.jsxs)("label", { children: [T.ratio, /* @__PURE__ */ (0, m.jsxs)("select", {
								"aria-label": T.ratio,
								value: fe,
								onChange: (e) => Dt(e.target.value),
								children: [
									/* @__PURE__ */ (0, m.jsx)("option", {
										value: "free",
										children: T.free
									}),
									/* @__PURE__ */ (0, m.jsx)("option", {
										value: "original",
										children: T.original
									}),
									/* @__PURE__ */ (0, m.jsx)("option", {
										value: "1:1",
										children: "1:1"
									}),
									/* @__PURE__ */ (0, m.jsx)("option", {
										value: "4:3",
										children: "4:3"
									}),
									/* @__PURE__ */ (0, m.jsx)("option", {
										value: "16:9",
										children: "16:9"
									})
								]
							})] }),
							/* @__PURE__ */ (0, m.jsx)("div", {
								className: "sf-editor-field-grid",
								children: [
									"x",
									"y",
									"width",
									"height"
								].map((e) => /* @__PURE__ */ (0, m.jsxs)("label", { children: [T[e], /* @__PURE__ */ (0, m.jsx)("input", {
									type: "number",
									min: +(e === "width" || e === "height"),
									value: ie[e],
									onChange: (t) => St({
										...j.current,
										[e]: Number(t.target.value)
									})
								})] }, e))
							}),
							/* @__PURE__ */ (0, m.jsx)("small", { children: T.panHint })
						] }),
						R === "rotate" && /* @__PURE__ */ (0, m.jsxs)(m.Fragment, { children: [/* @__PURE__ */ (0, m.jsxs)("div", {
							className: "sf-editor-action-row",
							children: [/* @__PURE__ */ (0, m.jsxs)("button", {
								onClick: () => jt(-90),
								children: [/* @__PURE__ */ (0, m.jsx)(a, { name: "rotate-left" }), T.rotateLeft]
							}), /* @__PURE__ */ (0, m.jsxs)("button", {
								onClick: () => jt(90),
								children: [/* @__PURE__ */ (0, m.jsx)(a, { name: "rotate-right" }), T.rotateRight]
							})]
						}), /* @__PURE__ */ (0, m.jsxs)("p", { children: [
							T.rotation,
							": ",
							z,
							"°"
						] })] }),
						R === "resize" && /* @__PURE__ */ (0, m.jsxs)(m.Fragment, { children: [/* @__PURE__ */ (0, m.jsxs)("label", {
							className: "sf-editor-check",
							children: [/* @__PURE__ */ (0, m.jsx)("input", {
								type: "checkbox",
								checked: ye,
								onChange: (e) => {
									be(e.target.checked), e.target.checked && Te("");
								}
							}), T.enableResize]
						}), /* @__PURE__ */ (0, m.jsxs)("div", {
							className: "sf-editor-field-grid",
							children: [/* @__PURE__ */ (0, m.jsxs)("label", { children: [T.width, /* @__PURE__ */ (0, m.jsx)("input", {
								type: "number",
								min: "1",
								max: ut,
								value: xe,
								onChange: (e) => Se(Number(e.target.value))
							})] }), /* @__PURE__ */ (0, m.jsxs)("label", { children: [T.height, /* @__PURE__ */ (0, m.jsx)("input", {
								type: "number",
								min: "1",
								max: dt,
								value: Ce,
								onChange: (e) => we(Number(e.target.value))
							})] })]
						})] }),
						R === "preset" && /* @__PURE__ */ (0, m.jsxs)("label", { children: [T.preset, /* @__PURE__ */ (0, m.jsxs)("select", {
							value: B,
							onChange: (e) => {
								Te(e.target.value), e.target.value && be(!1);
							},
							children: [/* @__PURE__ */ (0, m.jsx)("option", {
								value: "",
								children: T.noPreset
							}), Object.entries(d).map(([e, t]) => /* @__PURE__ */ (0, m.jsxs)("option", {
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
						R === "optimize" && /* @__PURE__ */ (0, m.jsxs)(m.Fragment, { children: [
							/* @__PURE__ */ (0, m.jsxs)("label", {
								className: "sf-editor-check",
								children: [/* @__PURE__ */ (0, m.jsx)("input", {
									type: "checkbox",
									checked: Ee,
									onChange: (e) => De(e.target.checked)
								}), T.enableOptimize]
							}),
							/* @__PURE__ */ (0, m.jsxs)("label", { children: [T.outputFormat, /* @__PURE__ */ (0, m.jsxs)("select", {
								value: H,
								onChange: (e) => {
									ke(e.target.value), De(!0);
								},
								children: [/* @__PURE__ */ (0, m.jsx)("option", {
									value: "original",
									children: T.keepFormat
								}), b.map((e) => /* @__PURE__ */ (0, m.jsx)("option", {
									value: e,
									children: e.toUpperCase()
								}, e))]
							})] }),
							/* @__PURE__ */ (0, m.jsxs)("label", { children: [
								T.quality,
								": ",
								V,
								/* @__PURE__ */ (0, m.jsx)("input", {
									type: "range",
									min: "1",
									max: "100",
									value: V,
									onChange: (e) => {
										Oe(Number(e.target.value)), De(!0);
									}
								})
							] })
						] }),
						R === "watermark" && /* @__PURE__ */ (0, m.jsxs)(m.Fragment, { children: [
							/* @__PURE__ */ (0, m.jsxs)("label", { children: [T.watermarkType, /* @__PURE__ */ (0, m.jsxs)("select", {
								value: U,
								onChange: (e) => Ae(e.target.value),
								children: [
									/* @__PURE__ */ (0, m.jsx)("option", {
										value: "none",
										children: T.noWatermark
									}),
									i(x, "watermarkText") && /* @__PURE__ */ (0, m.jsx)("option", {
										value: "text",
										children: T.textWatermark
									}),
									i(x, "watermarkImage") && /* @__PURE__ */ (0, m.jsx)("option", {
										value: "image",
										children: T.imageWatermark
									})
								]
							})] }),
							U === "text" && /* @__PURE__ */ (0, m.jsxs)(m.Fragment, { children: [/* @__PURE__ */ (0, m.jsxs)("label", { children: [T.watermarkText, /* @__PURE__ */ (0, m.jsx)("input", {
								value: W,
								maxLength: 200,
								onChange: (e) => je(e.target.value)
							})] }), /* @__PURE__ */ (0, m.jsxs)("div", {
								className: "sf-watermark-style-row",
								children: [/* @__PURE__ */ (0, m.jsxs)("label", { children: [T.watermarkFont, /* @__PURE__ */ (0, m.jsxs)("select", {
									value: Me,
									onChange: (e) => G(e.target.value),
									children: [
										/* @__PURE__ */ (0, m.jsx)("option", {
											value: "interface",
											children: T.interfaceFont
										}),
										/* @__PURE__ */ (0, m.jsx)("option", {
											value: "sans",
											children: T.sansFont
										}),
										/* @__PURE__ */ (0, m.jsx)("option", {
											value: "serif",
											children: T.serifFont
										})
									]
								})] }), /* @__PURE__ */ (0, m.jsxs)("label", {
									className: "sf-watermark-color",
									children: [T.color, /* @__PURE__ */ (0, m.jsx)("input", {
										type: "color",
										value: K,
										onChange: (e) => Ne(e.target.value)
									})]
								})]
							})] }),
							U === "image" && /* @__PURE__ */ (0, m.jsxs)(m.Fragment, { children: [/* @__PURE__ */ (0, m.jsxs)("label", { children: [T.watermarkResource, /* @__PURE__ */ (0, m.jsx)("input", {
								value: Pe,
								onChange: (e) => Fe(e.target.value)
							})] }), /* @__PURE__ */ (0, m.jsxs)("label", { children: [T.watermarkPath, /* @__PURE__ */ (0, m.jsx)("input", {
								value: q,
								placeholder: "branding/logo.png",
								onChange: (e) => Ie(e.target.value)
							})] })] }),
							U !== "none" && /* @__PURE__ */ (0, m.jsxs)(m.Fragment, { children: [
								/* @__PURE__ */ (0, m.jsxs)("label", { children: [T.position, /* @__PURE__ */ (0, m.jsx)("select", {
									value: J,
									onChange: (e) => Tt(e.target.value),
									children: It.map((e) => /* @__PURE__ */ (0, m.jsx)("option", {
										value: e,
										children: e === "custom" ? T.freePosition : T[e.replace(/-([a-z])/g, (e, t) => t.toUpperCase())]
									}, e))
								})] }),
								J === "custom" && /* @__PURE__ */ (0, m.jsxs)("div", {
									className: "sf-editor-field-grid",
									children: [/* @__PURE__ */ (0, m.jsxs)("label", { children: ["X (%)", /* @__PURE__ */ (0, m.jsx)("input", {
										type: "number",
										min: "0",
										max: "100",
										value: Le,
										onChange: (e) => Re(Math.max(0, Math.min(100, Number(e.target.value))))
									})] }), /* @__PURE__ */ (0, m.jsxs)("label", { children: ["Y (%)", /* @__PURE__ */ (0, m.jsx)("input", {
										type: "number",
										min: "0",
										max: "100",
										value: ze,
										onChange: (e) => Be(Math.max(0, Math.min(100, Number(e.target.value))))
									})] })]
								}),
								/* @__PURE__ */ (0, m.jsx)("small", { children: T.dragWatermarkHint }),
								/* @__PURE__ */ (0, m.jsxs)("label", { children: [
									T.opacity,
									": ",
									X,
									"%",
									/* @__PURE__ */ (0, m.jsx)("input", {
										type: "range",
										min: "1",
										max: "100",
										value: X,
										onChange: (e) => Ve(Number(e.target.value))
									})
								] }),
								/* @__PURE__ */ (0, m.jsxs)("label", { children: [
									T.watermarkScale,
									": ",
									He,
									"%",
									/* @__PURE__ */ (0, m.jsx)("input", {
										type: "range",
										min: "5",
										max: "80",
										value: He,
										onChange: (e) => Ue(Number(e.target.value))
									})
								] })
							] })
						] }),
						/* @__PURE__ */ (0, m.jsx)("hr", {}),
						/* @__PURE__ */ (0, m.jsxs)("label", { children: [T.saveMode, /* @__PURE__ */ (0, m.jsxs)("select", {
							value: at,
							disabled: H !== "original",
							onChange: (e) => qe(e.target.value),
							children: [/* @__PURE__ */ (0, m.jsx)("option", {
								value: "copy",
								children: T.saveCopy
							}), /* @__PURE__ */ (0, m.jsx)("option", {
								value: "overwrite",
								children: T.overwrite
							})]
						})] }),
						at === "copy" && /* @__PURE__ */ (0, m.jsxs)(m.Fragment, { children: [
							/* @__PURE__ */ (0, m.jsxs)("label", { children: [T.fileName, /* @__PURE__ */ (0, m.jsxs)("span", {
								className: "sf-name-input",
								children: [/* @__PURE__ */ (0, m.jsx)("input", {
									value: rt,
									maxLength: w,
									onChange: (e) => it(e.target.value)
								}), tt && /* @__PURE__ */ (0, m.jsxs)("span", {
									"aria-hidden": "true",
									children: [".", tt]
								})]
							})] }),
							/* @__PURE__ */ (0, m.jsxs)("small", { children: [
								Array.from(ot).length,
								" / ",
								w
							] }),
							st && rt && /* @__PURE__ */ (0, m.jsx)("p", {
								className: "sf-warning",
								role: "alert",
								children: st === "tooLong" ? T.fileNameTooLong.replace("{maximum}", String(w)) : T.invalidFileName
							})
						] }),
						H !== "original" && /* @__PURE__ */ (0, m.jsx)("p", {
							className: "sf-configured-limits",
							children: T.conversionCopyHint
						}),
						at === "overwrite" && /* @__PURE__ */ (0, m.jsx)("p", {
							className: "sf-warning",
							role: "alert",
							children: T.overwriteWarning
						}),
						Xe && /* @__PURE__ */ (0, m.jsx)("p", {
							className: "sf-warning",
							role: "alert",
							children: Xe
						})
					]
				})
			]
		})
	});
}
//#endregion
export { b as ImageEditor };
