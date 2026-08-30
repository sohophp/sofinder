import { n as e, t } from "./jsx-runtime-CmCsaYvT.js";
import { t as n } from "./react-B5TC723I.js";
import { n as r, t as i } from "./api-Cq-FmALq.js";
import { t as a } from "./UiIcon-JdLj8VHV.js";
import { t as o } from "./Modal-ClPLM5jI.js";
import { t as s } from "./nameValidation-DURyMFRU.js";
import { n as c, t as l } from "./EntryVisuals-COz6M0oc.js";
import { t as u } from "./format-GD3_dnvn.js";
//#region node_modules/.pnpm/scheduler@0.27.0/node_modules/scheduler/cjs/scheduler.production.js
var d = /* @__PURE__ */ e(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) {
			if (n(c) !== null) m = !0, ee || (ee = !0, w());
			else {
				var t = n(l);
				t !== null && ae(x, t.startTime - e);
			}
		}
	}
	var ee = !1, S = -1, C = 5, te = -1;
	function ne() {
		return g ? !0 : !(e.unstable_now() - te < C);
	}
	function re() {
		if (g = !1, ee) {
			var t = e.unstable_now();
			te = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(S), S = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && ne());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && ae(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? w() : ee = !1;
			}
		}
	}
	var w;
	if (typeof y == "function") w = function() {
		y(re);
	};
	else if (typeof MessageChannel < "u") {
		var ie = new MessageChannel(), T = ie.port2;
		ie.port1.onmessage = re, w = function() {
			T.postMessage(null);
		};
	} else w = function() {
		_(re, 0);
	};
	function ae(t, n) {
		S = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : C = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(S), S = -1) : h = !0, ae(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, ee || (ee = !0, w()))), r;
	}, e.unstable_shouldYield = ne, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), f = /* @__PURE__ */ e(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ e(((e) => {
	var t = n();
	function r(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function i() {}
	var a = {
		d: {
			f: i,
			r: function() {
				throw Error(r(522));
			},
			D: i,
			C: i,
			L: i,
			m: i,
			X: i,
			S: i,
			M: i
		},
		p: 0,
		findDOMNode: null
	}, o = Symbol.for("react.portal");
	function s(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: o,
			key: r == null ? null : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var c = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function l(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = a, e.createPortal = function(e, t) {
		var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(r(299));
		return s(e, t, null, n);
	}, e.flushSync = function(e) {
		var t = c.T, n = a.p;
		try {
			if (c.T = null, a.p = 2, e) return e();
		} finally {
			c.T = t, a.p = n, a.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, a.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && a.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = l(n, t.crossOrigin), i = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? a.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: i,
				fetchPriority: o
			}) : n === "script" && a.d.X(e, {
				crossOrigin: r,
				integrity: i,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = l(t.as, t.crossOrigin);
					a.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0
					});
				}
			} else t ?? a.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = l(n, t.crossOrigin);
			a.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") {
			if (t) {
				var n = l(t.as, t.crossOrigin);
				a.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0
				});
			} else a.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		a.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return c.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return c.H.useHostTransitionStatus();
	}, e.version = "19.2.8";
})), m = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ e(((e) => {
	var t = f(), r = n(), i = m();
	function a(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function o(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function s(e) {
		var t = e, n = e;
		if (e.alternate) for (; t.return;) t = t.return;
		else {
			e = t;
			do
				t = e, t.flags & 4098 && (n = t.return), e = t.return;
			while (e);
		}
		return t.tag === 3 ? n : null;
	}
	function c(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function u(e) {
		if (s(e) !== e) throw Error(a(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = s(e), t === null) throw Error(a(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var i = n.return;
			if (i === null) break;
			var o = i.alternate;
			if (o === null) {
				if (r = i.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (i.child === o.child) {
				for (o = i.child; o;) {
					if (o === n) return u(i), e;
					if (o === r) return u(i), t;
					o = o.sibling;
				}
				throw Error(a(188));
			}
			if (n.return !== r.return) n = i, r = o;
			else {
				for (var c = !1, l = i.child; l;) {
					if (l === n) {
						c = !0, n = i, r = o;
						break;
					}
					if (l === r) {
						c = !0, r = i, n = o;
						break;
					}
					l = l.sibling;
				}
				if (!c) {
					for (l = o.child; l;) {
						if (l === n) {
							c = !0, n = o, r = i;
							break;
						}
						if (l === r) {
							c = !0, r = o, n = i;
							break;
						}
						l = l.sibling;
					}
					if (!c) throw Error(a(189));
				}
			}
			if (n.alternate !== r) throw Error(a(190));
		}
		if (n.tag !== 3) throw Error(a(188));
		return n.stateNode.current === n ? e : t;
	}
	function p(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = p(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), ee = Symbol.for("react.consumer"), S = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), te = Symbol.for("react.suspense"), ne = Symbol.for("react.suspense_list"), re = Symbol.for("react.memo"), w = Symbol.for("react.lazy"), ie = Symbol.for("react.activity"), T = Symbol.for("react.memo_cache_sentinel"), ae = Symbol.iterator;
	function oe(e) {
		return typeof e != "object" || !e ? null : (e = ae && e[ae] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var se = Symbol.for("react.client.reference");
	function E(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === se ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case te: return "Suspense";
			case ne: return "SuspenseList";
			case ie: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case S: return e.displayName || "Context";
			case ee: return (e._context.displayName || "Context") + ".Consumer";
			case C:
				var t = e.render;
				return e = e.displayName, e || (e = t.displayName || t.name || "", e = e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case re: return t = e.displayName || null, t === null ? E(e.type) || "Memo" : t;
			case w:
				t = e._payload, e = e._init;
				try {
					return E(e(t));
				} catch {}
		}
		return null;
	}
	var ce = Array.isArray, D = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, O = i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, le = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, ue = [], de = -1;
	function fe(e) {
		return { current: e };
	}
	function pe(e) {
		0 > de || (e.current = ue[de], ue[de] = null, de--);
	}
	function k(e, t) {
		de++, ue[de] = e.current, e.current = t;
	}
	var me = fe(null), he = fe(null), ge = fe(null), _e = fe(null);
	function ve(e, t) {
		switch (k(ge, t), k(he, e), k(me, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? Vd(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = Vd(t), e = Hd(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		pe(me), k(me, e);
	}
	function ye() {
		pe(me), pe(he), pe(ge);
	}
	function be(e) {
		e.memoizedState !== null && k(_e, e);
		var t = me.current, n = Hd(t, e.type);
		t !== n && (k(he, e), k(me, n));
	}
	function xe(e) {
		he.current === e && (pe(me), pe(he)), _e.current === e && (pe(_e), Qf._currentValue = le);
	}
	var Se, Ce;
	function we(e) {
		if (Se === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Se = t && t[1] || "", Ce = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Se + e + Ce;
	}
	var Te = !1;
	function Ee(e, t) {
		if (!e || Te) return "";
		Te = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							e.call(n.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Te = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? we(n) : "";
	}
	function De(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return we(e.type);
			case 16: return we("Lazy");
			case 13: return e.child !== t && t !== null ? we("Suspense Fallback") : we("Suspense");
			case 19: return we("SuspenseList");
			case 0:
			case 15: return Ee(e.type, !1);
			case 11: return Ee(e.type.render, !1);
			case 1: return Ee(e.type, !0);
			case 31: return we("Activity");
			default: return "";
		}
	}
	function Oe(e) {
		try {
			var t = "", n = null;
			do
				t += De(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var ke = Object.prototype.hasOwnProperty, Ae = t.unstable_scheduleCallback, je = t.unstable_cancelCallback, Me = t.unstable_shouldYield, Ne = t.unstable_requestPaint, Pe = t.unstable_now, Fe = t.unstable_getCurrentPriorityLevel, Ie = t.unstable_ImmediatePriority, Le = t.unstable_UserBlockingPriority, Re = t.unstable_NormalPriority, ze = t.unstable_LowPriority, Be = t.unstable_IdlePriority, Ve = t.log, He = t.unstable_setDisableYieldValue, Ue = null, We = null;
	function Ge(e) {
		if (typeof Ve == "function" && He(e), We && typeof We.setStrictMode == "function") try {
			We.setStrictMode(Ue, e);
		} catch {}
	}
	var Ke = Math.clz32 ? Math.clz32 : Ye, qe = Math.log, Je = Math.LN2;
	function Ye(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (qe(e) / Je | 0) | 0;
	}
	var Xe = 256, Ze = 262144, Qe = 4194304;
	function $e(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function et(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = $e(n))) : i = $e(o) : i = $e(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = $e(n))) : i = $e(o)) : i = $e(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function tt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function nt(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function rt() {
		var e = Qe;
		return Qe <<= 1, !(Qe & 62914560) && (Qe = 4194304), e;
	}
	function it(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function at(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function ot(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Ke(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && st(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function st(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Ke(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function ct(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Ke(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function lt(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : ut(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function ut(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function dt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function ft() {
		var e = O.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : mp(e.type)) : e;
	}
	function pt(e, t) {
		var n = O.p;
		try {
			return O.p = e, t();
		} finally {
			O.p = n;
		}
	}
	var mt = Math.random().toString(36).slice(2), ht = "__reactFiber$" + mt, gt = "__reactProps$" + mt, _t = "__reactContainer$" + mt, vt = "__reactEvents$" + mt, yt = "__reactListeners$" + mt, bt = "__reactHandles$" + mt, xt = "__reactResources$" + mt, St = "__reactMarker$" + mt;
	function Ct(e) {
		delete e[ht], delete e[gt], delete e[vt], delete e[yt], delete e[bt];
	}
	function wt(e) {
		var t = e[ht];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[_t] || n[ht]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = df(e); e !== null;) {
					if (n = e[ht]) return n;
					e = df(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Tt(e) {
		if (e = e[ht] || e[_t]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Et(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(a(33));
	}
	function Dt(e) {
		var t = e[xt];
		return t || (t = e[xt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}), t;
	}
	function Ot(e) {
		e[St] = !0;
	}
	var kt = /* @__PURE__ */ new Set(), At = {};
	function jt(e, t) {
		Mt(e, t), Mt(e + "Capture", t);
	}
	function Mt(e, t) {
		for (At[e] = t, e = 0; e < t.length; e++) kt.add(t[e]);
	}
	var Nt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Pt = {}, Ft = {};
	function It(e) {
		return ke.call(Ft, e) ? !0 : ke.call(Pt, e) ? !1 : Nt.test(e) ? Ft[e] = !0 : (Pt[e] = !0, !1);
	}
	function Lt(e, t, n) {
		if (It(t)) {
			if (n === null) e.removeAttribute(t);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						e.removeAttribute(t);
						return;
					case "boolean":
						var r = t.toLowerCase().slice(0, 5);
						if (r !== "data-" && r !== "aria-") {
							e.removeAttribute(t);
							return;
						}
				}
				e.setAttribute(t, "" + n);
			}
		}
	}
	function Rt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, "" + n);
		}
	}
	function zt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, "" + r);
		}
	}
	function Bt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function Vt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Ht(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function Ut(e) {
		if (!e._valueTracker) {
			var t = Vt(e) ? "checked" : "value";
			e._valueTracker = Ht(e, t, "" + e[t]);
		}
	}
	function Wt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Vt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	function Gt(e) {
		if (e = e || (typeof document < "u" ? document : void 0), e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var Kt = /[\n"\\]/g;
	function qt(e) {
		return e.replace(Kt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Jt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Bt(t)) : e.value !== "" + Bt(t) && (e.value = "" + Bt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Xt(e, o, Bt(n)) : Xt(e, o, Bt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Bt(s) : e.removeAttribute("name");
	}
	function Yt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Ut(e);
				return;
			}
			n = n == null ? "" : "" + Bt(n), t = t == null ? n : "" + Bt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r = r ?? i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Ut(e);
	}
	function Xt(e, t, n) {
		t === "number" && Gt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Zt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Bt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Qt(e, t, n) {
		if (t != null && (t = "" + Bt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Bt(n);
	}
	function A(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(a(92));
				if (ce(r)) {
					if (1 < r.length) throw Error(a(93));
					r = r[0];
				}
				n = r;
			}
			n ?? (n = ""), t = n;
		}
		n = Bt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Ut(e);
	}
	function $t(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var en = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function tn(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || en.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function nn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(a(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var i in t) r = t[i], t.hasOwnProperty(i) && n[i] !== r && tn(e, i, r);
		} else for (var o in t) t.hasOwnProperty(o) && tn(e, o, t[o]);
	}
	function rn(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var j = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), an = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function on(e) {
		return an.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function sn() {}
	var cn = null;
	function ln(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var un = null, dn = null;
	function fn(e) {
		var t = Tt(e);
		if (t && (e = t.stateNode)) {
			var n = e[gt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Jt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + qt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var i = r[gt] || null;
								if (!i) throw Error(a(90));
								Jt(r, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Wt(r);
					}
					break a;
				case "textarea":
					Qt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Zt(e, !!n.multiple, t, !1);
			}
		}
	}
	var pn = !1;
	function mn(e, t, n) {
		if (pn) return e(t, n);
		pn = !0;
		try {
			return e(t);
		} finally {
			if (pn = !1, (un !== null || dn !== null) && (bu(), un && (t = un, e = dn, dn = un = null, fn(t), e))) for (t = 0; t < e.length; t++) fn(e[t]);
		}
	}
	function hn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[gt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = e !== "button" && e !== "input" && e !== "select" && e !== "textarea"), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(a(231, t, typeof n));
		return n;
	}
	var gn = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), _n = !1;
	if (gn) try {
		var vn = {};
		Object.defineProperty(vn, "passive", { get: function() {
			_n = !0;
		} }), window.addEventListener("test", vn, vn), window.removeEventListener("test", vn, vn);
	} catch {
		_n = !1;
	}
	var yn = null, bn = null, xn = null;
	function Sn() {
		if (xn) return xn;
		var e, t = bn, n = t.length, r, i = "value" in yn ? yn.value : yn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return xn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function Cn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function wn() {
		return !0;
	}
	function Tn() {
		return !1;
	}
	function M(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? wn : Tn, this.isPropagationStopped = Tn, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = wn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = wn);
			},
			persist: function() {},
			isPersistent: wn
		}), t;
	}
	var En = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Dn = M(En), On = h({}, En, {
		view: 0,
		detail: 0
	}), kn = M(On), An, jn, Mn, Nn = h({}, On, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: Wn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Mn && (Mn && e.type === "mousemove" ? (An = e.screenX - Mn.screenX, jn = e.screenY - Mn.screenY) : jn = An = 0, Mn = e), An);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : jn;
		}
	}), Pn = M(Nn), Fn = M(h({}, Nn, { dataTransfer: 0 })), In = M(h({}, On, { relatedTarget: 0 })), Ln = M(h({}, En, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Rn = M(h({}, En, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), zn = M(h({}, En, { data: 0 })), Bn = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, Vn = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, Hn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Un(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Hn[e]) ? !!t[e] : !1;
	}
	function Wn() {
		return Un;
	}
	var Gn = M(h({}, On, {
		key: function(e) {
			if (e.key) {
				var t = Bn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Cn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Vn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Wn,
		charCode: function(e) {
			return e.type === "keypress" ? Cn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? Cn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Kn = M(h({}, Nn, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), qn = M(h({}, On, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Wn
	})), Jn = M(h({}, En, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Yn = M(h({}, Nn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Xn = M(h({}, En, {
		newState: 0,
		oldState: 0
	})), Zn = [
		9,
		13,
		27,
		32
	], Qn = gn && "CompositionEvent" in window, $n = null;
	gn && "documentMode" in document && ($n = document.documentMode);
	var er = gn && "TextEvent" in window && !$n, tr = gn && (!Qn || $n && 8 < $n && 11 >= $n), nr = " ", rr = !1;
	function ir(e, t) {
		switch (e) {
			case "keyup": return Zn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function ar(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var or = !1;
	function sr(e, t) {
		switch (e) {
			case "compositionend": return ar(t);
			case "keypress": return t.which === 32 ? (rr = !0, nr) : null;
			case "textInput": return e = t.data, e === nr && rr ? null : e;
			default: return null;
		}
	}
	function cr(e, t) {
		if (or) return e === "compositionend" || !Qn && ir(e, t) ? (e = Sn(), xn = bn = yn = null, or = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return tr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var lr = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function ur(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!lr[e.type] : t === "textarea";
	}
	function N(e, t, n, r) {
		un ? dn ? dn.push(r) : dn = [r] : un = r, t = Ed(t, "onChange"), 0 < t.length && (n = new Dn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var dr = null, fr = null;
	function pr(e) {
		yd(e, 0);
	}
	function mr(e) {
		if (Wt(Et(e))) return e;
	}
	function hr(e, t) {
		if (e === "change") return t;
	}
	var gr = !1;
	if (gn) {
		var _r;
		if (gn) {
			var vr = "oninput" in document;
			if (!vr) {
				var yr = document.createElement("div");
				yr.setAttribute("oninput", "return;"), vr = typeof yr.oninput == "function";
			}
			_r = vr;
		} else _r = !1;
		gr = _r && (!document.documentMode || 9 < document.documentMode);
	}
	function br() {
		dr && (dr.detachEvent("onpropertychange", xr), fr = dr = null);
	}
	function xr(e) {
		if (e.propertyName === "value" && mr(fr)) {
			var t = [];
			N(t, fr, e, ln(e)), mn(pr, t);
		}
	}
	function Sr(e, t, n) {
		e === "focusin" ? (br(), dr = t, fr = n, dr.attachEvent("onpropertychange", xr)) : e === "focusout" && br();
	}
	function Cr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return mr(fr);
	}
	function wr(e, t) {
		if (e === "click") return mr(t);
	}
	function Tr(e, t) {
		if (e === "input" || e === "change") return mr(t);
	}
	function Er(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Dr = typeof Object.is == "function" ? Object.is : Er;
	function Or(e, t) {
		if (Dr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!ke.call(t, i) || !Dr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function kr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Ar(e, t) {
		var n = kr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = kr(n);
		}
	}
	function jr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? jr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Mr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Gt(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Gt(e.document);
		}
		return t;
	}
	function Nr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Pr = gn && "documentMode" in document && 11 >= document.documentMode, Fr = null, Ir = null, Lr = null, Rr = !1;
	function zr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Rr || Fr == null || Fr !== Gt(r) || (r = Fr, "selectionStart" in r && Nr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Lr && Or(Lr, r) || (Lr = r, r = Ed(Ir, "onSelect"), 0 < r.length && (t = new Dn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Fr)));
	}
	function Br(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Vr = {
		animationend: Br("Animation", "AnimationEnd"),
		animationiteration: Br("Animation", "AnimationIteration"),
		animationstart: Br("Animation", "AnimationStart"),
		transitionrun: Br("Transition", "TransitionRun"),
		transitionstart: Br("Transition", "TransitionStart"),
		transitioncancel: Br("Transition", "TransitionCancel"),
		transitionend: Br("Transition", "TransitionEnd")
	}, Hr = {}, Ur = {};
	gn && (Ur = document.createElement("div").style, "AnimationEvent" in window || (delete Vr.animationend.animation, delete Vr.animationiteration.animation, delete Vr.animationstart.animation), "TransitionEvent" in window || delete Vr.transitionend.transition);
	function Wr(e) {
		if (Hr[e]) return Hr[e];
		if (!Vr[e]) return e;
		var t = Vr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Ur) return Hr[e] = t[n];
		return e;
	}
	var Gr = Wr("animationend"), Kr = Wr("animationiteration"), qr = Wr("animationstart"), Jr = Wr("transitionrun"), Yr = Wr("transitionstart"), Xr = Wr("transitioncancel"), Zr = Wr("transitionend"), Qr = /* @__PURE__ */ new Map(), $r = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	$r.push("scrollEnd");
	function ei(e, t) {
		Qr.set(e, t), jt(t, [e]);
	}
	var ti = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, ni = [], ri = 0, ii = 0;
	function P() {
		for (var e = ri, t = ii = ri = 0; t < e;) {
			var n = ni[t];
			ni[t++] = null;
			var r = ni[t];
			ni[t++] = null;
			var i = ni[t];
			ni[t++] = null;
			var a = ni[t];
			if (ni[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && ci(n, i, a);
		}
	}
	function ai(e, t, n, r) {
		ni[ri++] = e, ni[ri++] = t, ni[ri++] = n, ni[ri++] = r, ii |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function oi(e, t, n, r) {
		return ai(e, t, n, r), li(e);
	}
	function si(e, t) {
		return ai(e, null, null, t), li(e);
	}
	function ci(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Ke(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function li(e) {
		if (50 < du) throw du = 0, fu = null, Error(a(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var ui = {};
	function di(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function F(e, t, n, r) {
		return new di(e, t, n, r);
	}
	function I(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function fi(e, t) {
		var n = e.alternate;
		return n === null ? (n = F(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function pi(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function mi(e, t, n, r, i, o) {
		var s = 0;
		if (r = e, typeof e == "function") I(e) && (s = 1);
		else if (typeof e == "string") s = Uf(e, n, me.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case ie: return e = F(31, n, t, i), e.elementType = ie, e.lanes = o, e;
			case y: return hi(n.children, i, o, t);
			case b:
				s = 8, i |= 24;
				break;
			case x: return e = F(12, n, t, i | 2), e.elementType = x, e.lanes = o, e;
			case te: return e = F(13, n, t, i), e.elementType = te, e.lanes = o, e;
			case ne: return e = F(19, n, t, i), e.elementType = ne, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case S:
						s = 10;
						break a;
					case ee:
						s = 9;
						break a;
					case C:
						s = 11;
						break a;
					case re:
						s = 14;
						break a;
					case w:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(a(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = F(s, n, t, i), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function hi(e, t, n, r) {
		return e = F(7, e, r, t), e.lanes = n, e;
	}
	function gi(e, t, n) {
		return e = F(6, e, null, t), e.lanes = n, e;
	}
	function _i(e) {
		var t = F(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function vi(e, t, n) {
		return t = F(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var yi = /* @__PURE__ */ new WeakMap();
	function bi(e, t) {
		if (typeof e == "object" && e) {
			var n = yi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Oe(t)
			}, yi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Oe(t)
		};
	}
	var xi = [], Si = 0, Ci = null, wi = 0, Ti = [], Ei = 0, Di = null, Oi = 1, ki = "";
	function Ai(e, t) {
		xi[Si++] = wi, xi[Si++] = Ci, Ci = e, wi = t;
	}
	function ji(e, t, n) {
		Ti[Ei++] = Oi, Ti[Ei++] = ki, Ti[Ei++] = Di, Di = e;
		var r = Oi;
		e = ki;
		var i = 32 - Ke(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Ke(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Oi = 1 << 32 - Ke(t) + i | n << i | r, ki = a + e;
		} else Oi = 1 << a | n << i | r, ki = e;
	}
	function Mi(e) {
		e.return !== null && (Ai(e, 1), ji(e, 1, 0));
	}
	function Ni(e) {
		for (; e === Ci;) Ci = xi[--Si], xi[Si] = null, wi = xi[--Si], xi[Si] = null;
		for (; e === Di;) Di = Ti[--Ei], Ti[Ei] = null, ki = Ti[--Ei], Ti[Ei] = null, Oi = Ti[--Ei], Ti[Ei] = null;
	}
	function Pi(e, t) {
		Ti[Ei++] = Oi, Ti[Ei++] = ki, Ti[Ei++] = Di, Oi = t.id, ki = t.overflow, Di = e;
	}
	var L = null, R = null, z = !1, Fi = null, Ii = !1, Li = Error(a(519));
	function Ri(e) {
		throw Wi(bi(Error(a(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Li;
	}
	function zi(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[ht] = e, t[gt] = r, n) {
			case "dialog":
				Q("cancel", t), Q("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Q("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < _d.length; n++) Q(_d[n], t);
				break;
			case "source":
				Q("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Q("error", t), Q("load", t);
				break;
			case "details":
				Q("toggle", t);
				break;
			case "input":
				Q("invalid", t), Yt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), A(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Md(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = sn), t = !0) : t = !1, t || Ri(e, !0);
	}
	function Bi(e) {
		for (L = e.return; L;) switch (L.tag) {
			case 5:
			case 31:
			case 13:
				Ii = !1;
				return;
			case 27:
			case 3:
				Ii = !0;
				return;
			default: L = L.return;
		}
	}
	function Vi(e) {
		if (e !== L) return !1;
		if (!z) return Bi(e), z = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || Ud(e.type, e.memoizedProps)), n = !n), n && R && Ri(e), Bi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(317));
			R = uf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(317));
			R = uf(e);
		} else t === 27 ? (t = R, Zd(e.type) ? (e = lf, lf = null, R = e) : R = t) : R = L ? cf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Hi() {
		R = L = null, z = !1;
	}
	function Ui() {
		var e = Fi;
		return e !== null && (Zl === null ? Zl = e : Zl.push.apply(Zl, e), Fi = null), e;
	}
	function Wi(e) {
		Fi === null ? Fi = [e] : Fi.push(e);
	}
	var Gi = fe(null), Ki = null, qi = null;
	function Ji(e, t, n) {
		k(Gi, t._currentValue), t._currentValue = n;
	}
	function Yi(e) {
		e._currentValue = Gi.current, pe(Gi);
	}
	function Xi(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Zi(e, t, n, r) {
		var i = e.child;
		for (i !== null && (i.return = e); i !== null;) {
			var o = i.dependencies;
			if (o !== null) {
				var s = i.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = i;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Xi(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (i.tag === 18) {
				if (s = i.return, s === null) throw Error(a(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Xi(s, n, e), s = null;
			} else s = i.child;
			if (s !== null) s.return = i;
			else for (s = i; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (i = s.sibling, i !== null) {
					i.return = s.return, s = i;
					break;
				}
				s = s.return;
			}
			i = s;
		}
	}
	function Qi(e, t, n, r) {
		e = null;
		for (var i = t, o = !1; i !== null;) {
			if (!o) {
				if (i.flags & 524288) o = !0;
				else if (i.flags & 262144) break;
			}
			if (i.tag === 10) {
				var s = i.alternate;
				if (s === null) throw Error(a(387));
				if (s = s.memoizedProps, s !== null) {
					var c = i.type;
					Dr(i.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (i === _e.current) {
				if (s = i.alternate, s === null) throw Error(a(387));
				s.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e === null ? e = [Qf] : e.push(Qf));
			}
			i = i.return;
		}
		e !== null && Zi(t, e, n, r), t.flags |= 262144;
	}
	function $i(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Dr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function ea(e) {
		Ki = e, qi = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function ta(e) {
		return ra(Ki, e);
	}
	function na(e, t) {
		return Ki === null && ea(e), ra(e, t);
	}
	function ra(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, qi === null) {
			if (e === null) throw Error(a(308));
			qi = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else qi = qi.next = t;
		return n;
	}
	var ia = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, aa = t.unstable_scheduleCallback, oa = t.unstable_NormalPriority, sa = {
		$$typeof: S,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function ca() {
		return {
			controller: new ia(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function la(e) {
		e.refCount--, e.refCount === 0 && aa(oa, function() {
			e.controller.abort();
		});
	}
	var ua = null, da = 0, fa = 0, pa = null;
	function ma(e, t) {
		if (ua === null) {
			var n = ua = [];
			da = 0, fa = dd(), pa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return da++, t.then(ha, ha), t;
	}
	function ha() {
		if (--da === 0 && ua !== null) {
			pa !== null && (pa.status = "fulfilled");
			var e = ua;
			ua = null, fa = 0, pa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function ga(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var _a = D.S;
	D.S = function(e, t) {
		eu = Pe(), typeof t == "object" && t && typeof t.then == "function" && ma(e, t), _a !== null && _a(e, t);
	};
	var va = fe(null);
	function ya() {
		var e = va.current;
		return e === null ? q.pooledCache : e;
	}
	function ba(e, t) {
		t === null ? k(va, va.current) : k(va, t.pool);
	}
	function xa() {
		var e = ya();
		return e === null ? null : {
			parent: sa._currentValue,
			pool: e
		};
	}
	var Sa = Error(a(460)), Ca = Error(a(474)), wa = Error(a(542)), Ta = { then: function() {} };
	function Ea(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Da(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(sn, sn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, ja(e), e;
			default:
				if (typeof t.status == "string") t.then(sn, sn);
				else {
					if (e = q, e !== null && 100 < e.shellSuspendCounter) throw Error(a(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, ja(e), e;
				}
				throw ka = t, Sa;
		}
	}
	function Oa(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (ka = e, Sa) : e;
		}
	}
	var ka = null;
	function Aa() {
		if (ka === null) throw Error(a(459));
		var e = ka;
		return ka = null, e;
	}
	function ja(e) {
		if (e === Sa || e === wa) throw Error(a(483));
	}
	var Ma = null, Na = 0;
	function Pa(e) {
		var t = Na;
		return Na += 1, Ma === null && (Ma = []), Da(Ma, e, t);
	}
	function Fa(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Ia(e, t) {
		throw t.$$typeof === g ? Error(a(525)) : (e = Object.prototype.toString.call(t), Error(a(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function La(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function i(e, t) {
			return e = fi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = gi(n, e.mode, r), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var a = n.type;
			return a === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === a || typeof a == "object" && a && a.$$typeof === w && Oa(a) === t.type) ? (t = i(t, n.props), Fa(t, n), t.return = e, t) : (t = mi(n.type, n.key, n.props, null, e.mode, r), Fa(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = vi(n, e.mode, r), t.return = e, t) : (t = i(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, a) {
			return t === null || t.tag !== 7 ? (t = hi(n, e.mode, r, a), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = gi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = mi(t.type, t.key, t.props, null, e.mode, n), Fa(n, t), n.return = e, n;
					case v: return t = vi(t, e.mode, n), t.return = e, t;
					case w: return t = Oa(t), f(e, t, n);
				}
				if (ce(t) || oe(t)) return t = hi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Pa(t), n);
				if (t.$$typeof === S) return f(e, na(e, t), n);
				Ia(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case _: return n.key === i ? l(e, t, n, r) : null;
					case v: return n.key === i ? u(e, t, n, r) : null;
					case w: return n = Oa(n), p(e, t, n, r);
				}
				if (ce(n) || oe(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Pa(n), r);
				if (n.$$typeof === S) return p(e, t, na(e, n), r);
				Ia(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case w: return r = Oa(r), m(e, t, n, r, i);
				}
				if (ce(r) || oe(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Pa(r), i);
				if (r.$$typeof === S) return m(e, t, n, na(t, r), i);
				Ia(t, r);
			}
			return null;
		}
		function h(i, a, s, c) {
			for (var l = null, u = null, d = a, h = a = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), a = o(_, a, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), z && Ai(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return z && Ai(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), z && Ai(i, h), l;
		}
		function g(i, s, c, l) {
			if (c == null) throw Error(a(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(i, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(i, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(i, h), z && Ai(i, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(i, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return z && Ai(i, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, i, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(i, e);
			}), z && Ai(i, g), u;
		}
		function b(e, r, o, c) {
			if (typeof o == "object" && o && o.type === y && o.key === null && (o = o.props.children), typeof o == "object" && o) {
				switch (o.$$typeof) {
					case _:
						a: {
							for (var l = o.key; r !== null;) {
								if (r.key === l) {
									if (l = o.type, l === y) {
										if (r.tag === 7) {
											n(e, r.sibling), c = i(r, o.props.children), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === w && Oa(l) === r.type) {
										n(e, r.sibling), c = i(r, o.props), Fa(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === y ? (c = hi(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = mi(o.type, o.key, o.props, null, e.mode, c), Fa(c, o), c.return = e, e = c);
						}
						return s(e);
					case v:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = i(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = vi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case w: return o = Oa(o), b(e, r, o, c);
				}
				if (ce(o)) return h(e, r, o, c);
				if (oe(o)) {
					if (l = oe(o), typeof l != "function") throw Error(a(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Pa(o), c);
				if (o.$$typeof === S) return b(e, r, na(e, o), c);
				Ia(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = i(r, o), c.return = e, e = c) : (n(e, r), c = gi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Na = 0;
				var i = b(e, t, n, r);
				return Ma = null, i;
			} catch (t) {
				if (t === Sa || t === wa) throw t;
				var a = F(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var Ra = La(!0), za = La(!1), Ba = !1;
	function Va(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function Ha(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Ua(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Wa(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, K & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = li(e), ci(e, null, n), t;
		}
		return ai(e, r, t, n), li(e);
	}
	function Ga(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, ct(e, n);
		}
	}
	function Ka(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
			return;
		}
		e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var qa = !1;
	function Ja() {
		if (qa) {
			var e = pa;
			if (e !== null) throw e;
		}
	}
	function Ya(e, t, n, r) {
		qa = !1;
		var i = e.updateQueue;
		Ba = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (Y & f) === f : (r & f) === f) {
					f !== 0 && f === fa && (qa = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, g = s;
						f = t;
						var _ = n;
						switch (g.tag) {
							case 1:
								if (m = g.payload, typeof m == "function") {
									d = m.call(_, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = g.payload, f = typeof m == "function" ? m.call(_, d, f) : m, f == null) break a;
								d = h({}, d, f);
								break a;
							case 2: Ba = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), Gl |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Xa(e, t) {
		if (typeof e != "function") throw Error(a(191, e));
		e.call(t);
	}
	function Za(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Xa(n[e], t);
	}
	var Qa = fe(null), $a = fe(0);
	function eo(e, t) {
		e = Ul, k($a, e), k(Qa, t), Ul = e | t.baseLanes;
	}
	function to() {
		k($a, Ul), k(Qa, Qa.current);
	}
	function no() {
		Ul = $a.current, pe(Qa), pe($a);
	}
	var ro = fe(null), B = null;
	function io(e) {
		var t = e.alternate;
		k(lo, lo.current & 1), k(ro, e), B === null && (t === null || Qa.current !== null || t.memoizedState !== null) && (B = e);
	}
	function ao(e) {
		k(lo, lo.current), k(ro, e), B === null && (B = e);
	}
	function oo(e) {
		e.tag === 22 ? (k(lo, lo.current), k(ro, e), B === null && (B = e)) : so(e);
	}
	function so() {
		k(lo, lo.current), k(ro, ro.current);
	}
	function co(e) {
		pe(ro), B === e && (B = null), pe(lo);
	}
	var lo = fe(0);
	function uo(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || af(n) || of(n))) return t;
			} else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var fo = 0, V = null, H = null, po = null, mo = !1, ho = !1, go = !1, _o = 0, vo = 0, yo = null, bo = 0;
	function U() {
		throw Error(a(321));
	}
	function xo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Dr(e[n], t[n])) return !1;
		return !0;
	}
	function So(e, t, n, r, i, a) {
		return fo = a, V = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, D.H = e === null || e.memoizedState === null ? zs : Bs, go = !1, a = n(r, i), go = !1, ho && (a = wo(t, n, r, i)), Co(e), a;
	}
	function Co(e) {
		D.H = Rs;
		var t = H !== null && H.next !== null;
		if (fo = 0, po = H = V = null, mo = !1, vo = 0, yo = null, t) throw Error(a(300));
		e === null || rc || (e = e.dependencies, e !== null && $i(e) && (rc = !0));
	}
	function wo(e, t, n, r) {
		V = e;
		var i = 0;
		do {
			if (ho && (yo = null), vo = 0, ho = !1, 25 <= i) throw Error(a(301));
			if (i += 1, po = H = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			D.H = Vs, o = t(n, r);
		} while (ho);
		return o;
	}
	function To() {
		var e = D.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? Mo(t) : t, e = e.useState()[0], (H === null ? null : H.memoizedState) !== e && (V.flags |= 1024), t;
	}
	function Eo() {
		var e = _o !== 0;
		return _o = 0, e;
	}
	function Do(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function Oo(e) {
		if (mo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			mo = !1;
		}
		fo = 0, po = H = V = null, ho = !1, vo = _o = 0, yo = null;
	}
	function ko() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return po === null ? V.memoizedState = po = e : po = po.next = e, po;
	}
	function Ao() {
		if (H === null) {
			var e = V.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = H.next;
		var t = po === null ? V.memoizedState : po.next;
		if (t !== null) po = t, H = e;
		else {
			if (e === null) throw V.alternate === null ? Error(a(467)) : Error(a(310));
			H = e, e = {
				memoizedState: H.memoizedState,
				baseState: H.baseState,
				baseQueue: H.baseQueue,
				queue: H.queue,
				next: null
			}, po === null ? V.memoizedState = po = e : po = po.next = e;
		}
		return po;
	}
	function jo() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function Mo(e) {
		var t = vo;
		return vo += 1, yo === null && (yo = []), e = Da(yo, e, t), t = V, (po === null ? t.memoizedState : po.next) === null && (t = t.alternate, D.H = t === null || t.memoizedState === null ? zs : Bs), e;
	}
	function No(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return Mo(e);
			if (e.$$typeof === S) return ta(e);
		}
		throw Error(a(438, String(e)));
	}
	function Po(e) {
		var t = null, n = V.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = V.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ?? (t = {
			data: [],
			index: 0
		}), n === null && (n = jo(), V.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = T;
		return t.index++, n;
	}
	function Fo(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Io(e) {
		return Lo(Ao(), H, e);
	}
	function Lo(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(a(311));
		r.lastRenderedReducer = n;
		var i = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (i !== null) {
				var s = i.next;
				i.next = o.next, o.next = s;
			}
			t.baseQueue = i = o, r.pending = null;
		}
		if (o = e.baseState, i === null) e.memoizedState = o;
		else {
			t = i.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (fo & f) === f : (Y & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === fa && (d = !0);
					else if ((fo & p) === p) {
						u = u.next, p === fa && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, V.lanes |= p, Gl |= p;
					f = u.action, go && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, V.lanes |= f, Gl |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !Dr(o, e.memoizedState) && (rc = !0, d && (n = pa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return i === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Ro(e) {
		var t = Ao(), n = t.queue;
		if (n === null) throw Error(a(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, i = n.pending, o = t.memoizedState;
		if (i !== null) {
			n.pending = null;
			var s = i = i.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== i);
			Dr(o, t.memoizedState) || (rc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function zo(e, t, n) {
		var r = V, i = Ao(), o = z;
		if (o) {
			if (n === void 0) throw Error(a(407));
			n = n();
		} else n = t();
		var s = !Dr((H || i).memoizedState, n);
		if (s && (i.memoizedState = n, rc = !0), i = i.queue, us(Ho.bind(null, r, i, e), [e]), i.getSnapshot !== t || s || po !== null && po.memoizedState.tag & 1) {
			if (r.flags |= 2048, as(9, { destroy: void 0 }, Vo.bind(null, r, i, n, t), null), q === null) throw Error(a(349));
			o || fo & 127 || Bo(r, t, n);
		}
		return n;
	}
	function Bo(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = V.updateQueue, t === null ? (t = jo(), V.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Vo(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Uo(t) && Wo(e);
	}
	function Ho(e, t, n) {
		return n(function() {
			Uo(t) && Wo(e);
		});
	}
	function Uo(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Dr(e, n);
		} catch {
			return !0;
		}
	}
	function Wo(e) {
		var t = si(e, 2);
		t !== null && hu(t, e, 2);
	}
	function Go(e) {
		var t = ko();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), go) {
				Ge(!0);
				try {
					n();
				} finally {
					Ge(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Fo,
			lastRenderedState: e
		}, t;
	}
	function Ko(e, t, n, r) {
		return e.baseState = n, Lo(e, H, typeof r == "function" ? r : Fo);
	}
	function qo(e, t, n, r, i) {
		if (Fs(e)) throw Error(a(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: i,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					o.listeners.push(e);
				}
			};
			D.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Jo(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Jo(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = D.T, o = {};
			D.T = o;
			try {
				var s = n(i, r), c = D.S;
				c !== null && c(o, s), Yo(e, t, s);
			} catch (n) {
				Zo(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), D.T = a;
			}
		} else try {
			a = n(i, r), Yo(e, t, a);
		} catch (n) {
			Zo(e, t, n);
		}
	}
	function Yo(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Xo(e, t, n);
		}, function(n) {
			return Zo(e, t, n);
		}) : Xo(e, t, n);
	}
	function Xo(e, t, n) {
		t.status = "fulfilled", t.value = n, Qo(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Jo(e, n)));
	}
	function Zo(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Qo(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Qo(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function $o(e, t) {
		return t;
	}
	function es(e, t) {
		if (z) {
			var n = q.formState;
			if (n !== null) {
				a: {
					var r = V;
					if (z) {
						if (R) {
							b: {
								for (var i = R, a = Ii; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = cf(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								R = cf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Ri(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = ko(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: $o,
			lastRenderedState: t
		}, n.queue = r, n = Ms.bind(null, V, r), r.dispatch = n, r = Go(!1), a = Ps.bind(null, V, !1, r.queue), r = ko(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = qo.bind(null, V, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function ts(e) {
		return ns(Ao(), H, e);
	}
	function ns(e, t, n) {
		if (t = Lo(e, t, $o)[0], e = Io(Fo)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = Mo(t);
		} catch (e) {
			throw e === Sa ? wa : e;
		}
		else r = t;
		t = Ao();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (V.flags |= 2048, as(9, { destroy: void 0 }, rs.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function rs(e, t) {
		e.action = t;
	}
	function is(e) {
		var t = Ao(), n = H;
		if (n !== null) return ns(t, n, e);
		Ao(), t = t.memoizedState, n = Ao();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function as(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = V.updateQueue, t === null && (t = jo(), V.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function os() {
		return Ao().memoizedState;
	}
	function ss(e, t, n, r) {
		var i = ko();
		V.flags |= e, i.memoizedState = as(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function cs(e, t, n, r) {
		var i = Ao();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		H !== null && r !== null && xo(r, H.memoizedState.deps) ? i.memoizedState = as(t, a, n, r) : (V.flags |= e, i.memoizedState = as(1 | t, a, n, r));
	}
	function ls(e, t) {
		ss(8390656, 8, e, t);
	}
	function us(e, t) {
		cs(2048, 8, e, t);
	}
	function ds(e) {
		V.flags |= 4;
		var t = V.updateQueue;
		if (t === null) t = jo(), V.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function fs(e) {
		var t = Ao().memoizedState;
		return ds({
			ref: t,
			nextImpl: e
		}), function() {
			if (K & 2) throw Error(a(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function ps(e, t) {
		return cs(4, 2, e, t);
	}
	function ms(e, t) {
		return cs(4, 4, e, t);
	}
	function hs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function gs(e, t, n) {
		n = n == null ? null : n.concat([e]), cs(4, 4, hs.bind(null, t, e), n);
	}
	function _s() {}
	function vs(e, t) {
		var n = Ao();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && xo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function ys(e, t) {
		var n = Ao();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && xo(t, r[1])) return r[0];
		if (r = e(), go) {
			Ge(!0);
			try {
				e();
			} finally {
				Ge(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function bs(e, t, n) {
		return n === void 0 || fo & 1073741824 && !(Y & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = mu(), V.lanes |= e, Gl |= e, n);
	}
	function xs(e, t, n, r) {
		return Dr(n, t) ? n : Qa.current === null ? !(fo & 42) || fo & 1073741824 && !(Y & 261930) ? (rc = !0, e.memoizedState = n) : (e = mu(), V.lanes |= e, Gl |= e, t) : (e = bs(e, n, r), Dr(e, t) || (rc = !0), e);
	}
	function Ss(e, t, n, r, i) {
		var a = O.p;
		O.p = a !== 0 && 8 > a ? a : 8;
		var o = D.T, s = {};
		D.T = s, Ps(e, !1, t, n);
		try {
			var c = i(), l = D.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Ns(e, t, ga(c, r), pu(e)) : Ns(e, t, r, pu(e));
		} catch (n) {
			Ns(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, pu());
		} finally {
			O.p = a, o !== null && s.types !== null && (o.types = s.types), D.T = o;
		}
	}
	function Cs() {}
	function ws(e, t, n, r) {
		if (e.tag !== 5) throw Error(a(476));
		var i = Ts(e).queue;
		Ss(e, i, t, le, n === null ? Cs : function() {
			return Es(e), n(r);
		});
	}
	function Ts(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: le,
			baseState: le,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Fo,
				lastRenderedState: le
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Fo,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Es(e) {
		var t = Ts(e);
		t.next === null && (t = e.alternate.memoizedState), Ns(e, t.next.queue, {}, pu());
	}
	function Ds() {
		return ta(Qf);
	}
	function Os() {
		return Ao().memoizedState;
	}
	function ks() {
		return Ao().memoizedState;
	}
	function As(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = pu();
					e = Ua(n);
					var r = Wa(t, e, n);
					r !== null && (hu(r, t, n), Ga(r, t, n)), t = { cache: ca() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function js(e, t, n) {
		var r = pu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Fs(e) ? Is(t, n) : (n = oi(e, t, n, r), n !== null && (hu(n, e, r), Ls(n, t, r)));
	}
	function Ms(e, t, n) {
		Ns(e, t, n, pu());
	}
	function Ns(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Fs(e)) Is(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Dr(s, o)) return ai(e, t, i, 0), q === null && P(), !1;
			} catch {}
			if (n = oi(e, t, i, r), n !== null) return hu(n, e, r), Ls(n, t, r), !0;
		}
		return !1;
	}
	function Ps(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: dd(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Fs(e)) {
			if (t) throw Error(a(479));
		} else t = oi(e, n, r, 2), t !== null && hu(t, e, 2);
	}
	function Fs(e) {
		var t = e.alternate;
		return e === V || t !== null && t === V;
	}
	function Is(e, t) {
		ho = mo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Ls(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, ct(e, n);
		}
	}
	var Rs = {
		readContext: ta,
		use: No,
		useCallback: U,
		useContext: U,
		useEffect: U,
		useImperativeHandle: U,
		useLayoutEffect: U,
		useInsertionEffect: U,
		useMemo: U,
		useReducer: U,
		useRef: U,
		useState: U,
		useDebugValue: U,
		useDeferredValue: U,
		useTransition: U,
		useSyncExternalStore: U,
		useId: U,
		useHostTransitionStatus: U,
		useFormState: U,
		useActionState: U,
		useOptimistic: U,
		useMemoCache: U,
		useCacheRefresh: U
	};
	Rs.useEffectEvent = U;
	var zs = {
		readContext: ta,
		use: No,
		useCallback: function(e, t) {
			return ko().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: ta,
		useEffect: ls,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), ss(4194308, 4, hs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return ss(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			ss(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = ko();
			t = t === void 0 ? null : t;
			var r = e();
			if (go) {
				Ge(!0);
				try {
					e();
				} finally {
					Ge(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = ko();
			if (n !== void 0) {
				var i = n(t);
				if (go) {
					Ge(!0);
					try {
						n(t);
					} finally {
						Ge(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = js.bind(null, V, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = ko();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Go(e);
			var t = e.queue, n = Ms.bind(null, V, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: _s,
		useDeferredValue: function(e, t) {
			return bs(ko(), e, t);
		},
		useTransition: function() {
			var e = Go(!1);
			return e = Ss.bind(null, V, e.queue, !0, !1), ko().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = V, i = ko();
			if (z) {
				if (n === void 0) throw Error(a(407));
				n = n();
			} else {
				if (n = t(), q === null) throw Error(a(349));
				Y & 127 || Bo(r, t, n);
			}
			i.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return i.queue = o, ls(Ho.bind(null, r, o, e), [e]), r.flags |= 2048, as(9, { destroy: void 0 }, Vo.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = ko(), t = q.identifierPrefix;
			if (z) {
				var n = ki, r = Oi;
				n = (r & ~(1 << 32 - Ke(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = _o++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = bo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Ds,
		useFormState: es,
		useActionState: es,
		useOptimistic: function(e) {
			var t = ko();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Ps.bind(null, V, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Po,
		useCacheRefresh: function() {
			return ko().memoizedState = As.bind(null, V);
		},
		useEffectEvent: function(e) {
			var t = ko(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (K & 2) throw Error(a(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Bs = {
		readContext: ta,
		use: No,
		useCallback: vs,
		useContext: ta,
		useEffect: us,
		useImperativeHandle: gs,
		useInsertionEffect: ps,
		useLayoutEffect: ms,
		useMemo: ys,
		useReducer: Io,
		useRef: os,
		useState: function() {
			return Io(Fo);
		},
		useDebugValue: _s,
		useDeferredValue: function(e, t) {
			return xs(Ao(), H.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Io(Fo)[0], t = Ao().memoizedState;
			return [typeof e == "boolean" ? e : Mo(e), t];
		},
		useSyncExternalStore: zo,
		useId: Os,
		useHostTransitionStatus: Ds,
		useFormState: ts,
		useActionState: ts,
		useOptimistic: function(e, t) {
			return Ko(Ao(), H, e, t);
		},
		useMemoCache: Po,
		useCacheRefresh: ks
	};
	Bs.useEffectEvent = fs;
	var Vs = {
		readContext: ta,
		use: No,
		useCallback: vs,
		useContext: ta,
		useEffect: us,
		useImperativeHandle: gs,
		useInsertionEffect: ps,
		useLayoutEffect: ms,
		useMemo: ys,
		useReducer: Ro,
		useRef: os,
		useState: function() {
			return Ro(Fo);
		},
		useDebugValue: _s,
		useDeferredValue: function(e, t) {
			var n = Ao();
			return H === null ? bs(n, e, t) : xs(n, H.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Ro(Fo)[0], t = Ao().memoizedState;
			return [typeof e == "boolean" ? e : Mo(e), t];
		},
		useSyncExternalStore: zo,
		useId: Os,
		useHostTransitionStatus: Ds,
		useFormState: is,
		useActionState: is,
		useOptimistic: function(e, t) {
			var n = Ao();
			return H === null ? (n.baseState = e, [e, n.queue.dispatch]) : Ko(n, H, e, t);
		},
		useMemoCache: Po,
		useCacheRefresh: ks
	};
	Vs.useEffectEvent = fs;
	function Hs(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Us = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = pu(), i = Ua(r);
			i.payload = t, n != null && (i.callback = n), t = Wa(e, i, r), t !== null && (hu(t, e, r), Ga(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = pu(), i = Ua(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Wa(e, i, r), t !== null && (hu(t, e, r), Ga(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = pu(), r = Ua(n);
			r.tag = 2, t != null && (r.callback = t), t = Wa(e, r, n), t !== null && (hu(t, e, n), Ga(t, e, n));
		}
	};
	function Ws(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Or(n, r) || !Or(i, a) : !0;
	}
	function Gs(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Us.enqueueReplaceState(t, t.state, null);
	}
	function Ks(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = h({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function qs(e) {
		ti(e);
	}
	function Js(e) {
		console.error(e);
	}
	function Ys(e) {
		ti(e);
	}
	function Xs(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Zs(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Qs(e, t, n) {
		return n = Ua(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Xs(e, t);
		}, n;
	}
	function $s(e) {
		return e = Ua(e), e.tag = 3, e;
	}
	function ec(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Zs(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Zs(t, n, r), typeof i != "function" && (ru === null ? ru = /* @__PURE__ */ new Set([this]) : ru.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function tc(e, t, n, r, i) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Qi(t, n, i, !0), n = ro.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return B === null ? Du() : n.alternate === null && Wl === 0 && (Wl = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, r === Ta ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), Gu(e, r, i)), !1;
					case 22: return n.flags |= 65536, r === Ta ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), Gu(e, r, i)), !1;
				}
				throw Error(a(435, n.tag));
			}
			return Gu(e, r, i), Du(), !1;
		}
		if (z) return t = ro.current, t === null ? (r !== Li && (t = Error(a(423), { cause: r }), Wi(bi(t, n))), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, r = bi(r, n), i = Qs(e.stateNode, r, i), Ka(e, i), Wl !== 4 && (Wl = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = i, r !== Li && (e = Error(a(422), { cause: r }), Wi(bi(e, n)))), !1;
		var o = Error(a(520), { cause: r });
		if (o = bi(o, n), Xl === null ? Xl = [o] : Xl.push(o), Wl !== 4 && (Wl = 2), t === null) return !0;
		r = bi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = i & -i, n.lanes |= e, e = Qs(n.stateNode, r, e), Ka(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (ru === null || !ru.has(o)))) return n.flags |= 65536, i &= -i, n.lanes |= i, i = $s(i), ec(i, e, n, r), Ka(n, i), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var nc = Error(a(461)), rc = !1;
	function ic(e, t, n, r) {
		t.child = e === null ? za(t, null, n, r) : Ra(t, e.child, n, r);
	}
	function ac(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return ea(t), r = So(e, t, n, o, a, i), s = Eo(), e !== null && !rc ? (Do(e, t, i), kc(e, t, i)) : (z && s && Mi(t), t.flags |= 1, ic(e, t, r, i), t.child);
	}
	function oc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !I(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, sc(e, t, a, r, i)) : (e = mi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !Ac(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Or : n, n(o, r) && e.ref === t.ref) return kc(e, t, i);
		}
		return t.flags |= 1, e = fi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function sc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Or(a, r) && e.ref === t.ref) {
				if (rc = !1, t.pendingProps = r = a, Ac(e, i)) e.flags & 131072 && (rc = !0);
				else return t.lanes = e.lanes, kc(e, t, i);
			}
		}
		return hc(e, t, n, r, i);
	}
	function cc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return uc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && ba(t, a === null ? null : a.cachePool), a === null ? to() : eo(t, a), oo(t);
			else return r = t.lanes = 536870912, uc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && ba(t, null), to(), so(t)) : (ba(t, a.cachePool), eo(t, a), so(t), t.memoizedState = null);
		return ic(e, t, i, n), t.child;
	}
	function lc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function uc(e, t, n, r, i) {
		var a = ya();
		return a = a === null ? null : {
			parent: sa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && ba(t, null), to(), oo(t), e !== null && Qi(e, t, r, !0), t.childLanes = i, null;
	}
	function dc(e, t) {
		return t = wc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function fc(e, t, n) {
		return Ra(t, e.child, null, n), e = dc(t, t.pendingProps), e.flags |= 2, co(t), t.memoizedState = null, e;
	}
	function pc(e, t, n) {
		var r = t.pendingProps, i = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (z) {
				if (r.mode === "hidden") return e = dc(t, r), t.lanes = 536870912, lc(null, e);
				if (ao(t), (e = R) ? (e = rf(e, Ii), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Di === null ? null : {
						id: Oi,
						overflow: ki
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = _i(e), n.return = t, t.child = n, L = t, R = null)) : e = null, e === null) throw Ri(t);
				return t.lanes = 536870912, null;
			}
			return dc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (ao(t), i) {
				if (t.flags & 256) t.flags &= -257, t = fc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(a(558));
			} else if (rc || Qi(e, t, n, !1), i = (n & e.childLanes) !== 0, rc || i) {
				if (r = q, r !== null && (s = lt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, si(e, s), hu(r, e, s), nc;
				Du(), t = fc(e, t, n);
			} else e = o.treeContext, R = cf(s.nextSibling), L = t, z = !0, Fi = null, Ii = !1, e !== null && Pi(t, e), t = dc(t, r), t.flags |= 4096;
			return t;
		}
		return e = fi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function mc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(a(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function hc(e, t, n, r, i) {
		return ea(t), n = So(e, t, n, r, void 0, i), r = Eo(), e !== null && !rc ? (Do(e, t, i), kc(e, t, i)) : (z && r && Mi(t), t.flags |= 1, ic(e, t, n, i), t.child);
	}
	function gc(e, t, n, r, i, a) {
		return ea(t), t.updateQueue = null, n = wo(t, r, n, i), Co(e), r = Eo(), e !== null && !rc ? (Do(e, t, a), kc(e, t, a)) : (z && r && Mi(t), t.flags |= 1, ic(e, t, n, a), t.child);
	}
	function _c(e, t, n, r, i) {
		if (ea(t), t.stateNode === null) {
			var a = ui, o = n.contextType;
			typeof o == "object" && o && (a = ta(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Us, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Va(t), o = n.contextType, a.context = typeof o == "object" && o ? ta(o) : ui, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Hs(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Us.enqueueReplaceState(a, a.state, null), Ya(t, r, a, i), Ja(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Ks(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = ui, typeof u == "object" && u && (o = ta(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Gs(t, a, r, o), Ba = !1;
			var f = t.memoizedState;
			a.state = f, Ya(t, r, a, i), Ja(), l = t.memoizedState, s || f !== l || Ba ? (typeof d == "function" && (Hs(t, n, d, r), l = t.memoizedState), (c = Ba || Ws(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Ha(e, t), o = t.memoizedProps, u = Ks(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = ui, typeof l == "object" && l && (c = ta(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Gs(t, a, r, c), Ba = !1, f = t.memoizedState, a.state = f, Ya(t, r, a, i), Ja();
			var p = t.memoizedState;
			o !== d || f !== p || Ba || e !== null && e.dependencies !== null && $i(e.dependencies) ? (typeof s == "function" && (Hs(t, n, s, r), p = t.memoizedState), (u = Ba || Ws(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && $i(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, mc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Ra(t, e.child, null, i), t.child = Ra(t, null, n, i)) : ic(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = kc(e, t, i), e;
	}
	function vc(e, t, n, r) {
		return Hi(), t.flags |= 256, ic(e, t, n, r), t.child;
	}
	var yc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function bc(e) {
		return {
			baseLanes: e,
			cachePool: xa()
		};
	}
	function xc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= Jl), e;
	}
	function Sc(e, t, n) {
		var r = t.pendingProps, i = !1, o = !!(t.flags & 128), s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : !!(lo.current & 2)), s && (i = !0, t.flags &= -129), s = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (z) {
				if (i ? io(t) : so(t), (e = R) ? (e = rf(e, Ii), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Di === null ? null : {
						id: Oi,
						overflow: ki
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = _i(e), n.return = t, t.child = n, L = t, R = null)) : e = null, e === null) throw Ri(t);
				return of(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, i ? (so(t), i = t.mode, c = wc({
				mode: "hidden",
				children: c
			}, i), r = hi(r, i, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = bc(n), r.childLanes = xc(e, s, n), t.memoizedState = yc, lc(null, r)) : (io(t), Cc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (io(t), t.flags &= -257, t = Tc(e, t, n)) : t.memoizedState === null ? (so(t), c = r.fallback, i = t.mode, r = wc({
				mode: "visible",
				children: r.children
			}, i), c = hi(c, i, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, Ra(t, e.child, null, n), r = t.child, r.memoizedState = bc(n), r.childLanes = xc(e, s, n), t.memoizedState = yc, t = lc(null, r)) : (so(t), t.child = e.child, t.flags |= 128, t = null);
			else if (io(t), of(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(a(419)), r.stack = "", r.digest = s, Wi({
					value: r,
					source: null,
					stack: null
				}), t = Tc(e, t, n);
			} else if (rc || Qi(e, t, n, !1), s = (n & e.childLanes) !== 0, rc || s) {
				if (s = q, s !== null && (r = lt(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, si(e, r), hu(s, e, r), nc;
				af(c) || Du(), t = Tc(e, t, n);
			} else af(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, R = cf(c.nextSibling), L = t, z = !0, Fi = null, Ii = !1, e !== null && Pi(t, e), t = Cc(t, r.children), t.flags |= 4096);
			return t;
		}
		return i ? (so(t), c = r.fallback, i = t.mode, l = e.child, u = l.sibling, r = fi(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = hi(c, i, n, null), c.flags |= 2) : c = fi(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, lc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = bc(n) : (i = c.cachePool, i === null ? i = xa() : (l = sa._currentValue, i = i.parent === l ? i : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: i
		}), r.memoizedState = c, r.childLanes = xc(e, s, n), t.memoizedState = yc, lc(e.child, r)) : (io(t), n = e.child, e = n.sibling, n = fi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Cc(e, t) {
		return t = wc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function wc(e, t) {
		return e = F(22, e, null, t), e.lanes = 0, e;
	}
	function Tc(e, t, n) {
		return Ra(t, e.child, null, n), e = Cc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Ec(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Xi(e.return, t, n);
	}
	function Dc(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function Oc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = lo.current, s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, k(lo, o), ic(e, t, r, n), r = z ? wi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Ec(e, n, t);
			else if (e.tag === 19) Ec(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "forwards":
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && uo(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Dc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && uo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Dc(t, !0, n, null, a, r);
				break;
			case "together":
				Dc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function kc(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), Gl |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Qi(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(a(153));
		if (t.child !== null) {
			for (e = t.child, n = fi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = fi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function Ac(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && $i(e)));
	}
	function jc(e, t, n) {
		switch (t.tag) {
			case 3:
				ve(t, t.stateNode.containerInfo), Ji(t, sa, e.memoizedState.cache), Hi();
				break;
			case 27:
			case 5:
				be(t);
				break;
			case 4:
				ve(t, t.stateNode.containerInfo);
				break;
			case 10:
				Ji(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, ao(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (io(t), e = kc(e, t, n), e === null ? null : e.sibling) : Sc(e, t, n) : (io(t), t.flags |= 128, null);
				io(t);
				break;
			case 19:
				var i = !!(e.flags & 128);
				if (r = (n & t.childLanes) !== 0, r || (Qi(e, t, n, !1), r = (n & t.childLanes) !== 0), i) {
					if (r) return Oc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), k(lo, lo.current), r) break;
				return null;
			case 22: return t.lanes = 0, cc(e, t, n, t.pendingProps);
			case 24: Ji(t, sa, e.memoizedState.cache);
		}
		return kc(e, t, n);
	}
	function Mc(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) rc = !0;
			else {
				if (!Ac(e, n) && !(t.flags & 128)) return rc = !1, jc(e, t, n);
				rc = !!(e.flags & 131072);
			}
		} else rc = !1, z && t.flags & 1048576 && ji(t, wi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Oa(t.elementType), t.type = e, typeof e == "function") I(e) ? (r = Ks(e, r), t.tag = 1, t = _c(null, t, e, r, n)) : (t.tag = 0, t = hc(null, t, e, r, n));
					else {
						if (e != null) {
							var i = e.$$typeof;
							if (i === C) {
								t.tag = 11, t = ac(null, t, e, r, n);
								break a;
							}
							if (i === re) {
								t.tag = 14, t = oc(null, t, e, r, n);
								break a;
							}
						}
						throw t = E(e) || e, Error(a(306, t, ""));
					}
				}
				return t;
			case 0: return hc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, i = Ks(r, t.pendingProps), _c(e, t, r, i, n);
			case 3:
				a: {
					if (ve(t, t.stateNode.containerInfo), e === null) throw Error(a(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					i = o.element, Ha(e, t), Ya(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, Ji(t, sa, r), r !== o.cache && Zi(t, [sa], n, !0), Ja(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = vc(e, t, r, n);
							break a;
						}
						if (r !== i) {
							i = bi(Error(a(424)), t), Wi(i), t = vc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (R = cf(e.firstChild), L = t, z = !0, Fi = null, Ii = !0, n = za(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					} else {
						if (Hi(), r === i) {
							t = kc(e, t, n);
							break a;
						}
						ic(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return mc(e, t), e === null ? (n = kf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : z || (n = t.type, e = t.pendingProps, r = Bd(ge.current).createElement(n), r[ht] = t, r[gt] = e, Pd(r, n, e), Ot(r), t.stateNode = r) : t.memoizedState = kf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return be(t), e === null && z && (r = t.stateNode = ff(t.type, t.pendingProps, ge.current), L = t, Ii = !0, i = R, Zd(t.type) ? (lf = i, R = cf(r.firstChild)) : R = i), ic(e, t, t.pendingProps.children, n), mc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && z && ((i = r = R) && (r = tf(r, t.type, t.pendingProps, Ii), r === null ? i = !1 : (t.stateNode = r, L = t, R = cf(r.firstChild), Ii = !1, i = !0)), i || Ri(t)), be(t), i = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Ud(i, o) ? r = null : s !== null && Ud(i, s) && (t.flags |= 32), t.memoizedState !== null && (i = So(e, t, To, null, null, n), Qf._currentValue = i), mc(e, t), ic(e, t, r, n), t.child;
			case 6: return e === null && z && ((e = n = R) && (n = nf(n, t.pendingProps, Ii), n === null ? e = !1 : (t.stateNode = n, L = t, R = null, e = !0)), e || Ri(t)), null;
			case 13: return Sc(e, t, n);
			case 4: return ve(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Ra(t, null, r, n) : ic(e, t, r, n), t.child;
			case 11: return ac(e, t, t.type, t.pendingProps, n);
			case 7: return ic(e, t, t.pendingProps, n), t.child;
			case 8: return ic(e, t, t.pendingProps.children, n), t.child;
			case 12: return ic(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, Ji(t, t.type, r.value), ic(e, t, r.children, n), t.child;
			case 9: return i = t.type._context, r = t.pendingProps.children, ea(t), i = ta(i), r = r(i), t.flags |= 1, ic(e, t, r, n), t.child;
			case 14: return oc(e, t, t.type, t.pendingProps, n);
			case 15: return sc(e, t, t.type, t.pendingProps, n);
			case 19: return Oc(e, t, n);
			case 31: return pc(e, t, n);
			case 22: return cc(e, t, n, t.pendingProps);
			case 24: return ea(t), r = ta(sa), e === null ? (i = ya(), i === null && (i = q, o = ca(), i.pooledCache = o, o.refCount++, o !== null && (i.pooledCacheLanes |= n), i = o), t.memoizedState = {
				parent: r,
				cache: i
			}, Va(t), Ji(t, sa, i)) : ((e.lanes & n) !== 0 && (Ha(e, t), Ya(t, null, null, n), Ja()), i = e.memoizedState, o = t.memoizedState, i.parent === r ? (r = o.cache, Ji(t, sa, r), r !== i.cache && Zi(t, [sa], n, !0)) : (i = {
				parent: r,
				cache: r
			}, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), Ji(t, sa, r))), ic(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(a(156, t.tag));
	}
	function Nc(e) {
		e.flags |= 4;
	}
	function Pc(e, t, n, r, i) {
		if ((t = !!(e.mode & 32)) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (wu()) e.flags |= 8192;
				else throw ka = Ta, Ca;
			}
		} else e.flags &= -16777217;
	}
	function Fc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Wf(t)) {
			if (wu()) e.flags |= 8192;
			else throw ka = Ta, Ca;
		}
	}
	function Ic(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : rt(), e.lanes |= t, Yl |= t);
	}
	function Lc(e, t) {
		if (!z) switch (e.tailMode) {
			case "hidden":
				t = e.tail;
				for (var n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
				break;
			case "collapsed":
				n = e.tail;
				for (var r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
		}
	}
	function W(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Rc(e, t, n) {
		var r = t.pendingProps;
		switch (Ni(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return W(t), null;
			case 1: return W(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Yi(sa), ye(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Vi(t) ? Nc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Ui())), W(t), null;
			case 26:
				var i = t.type, o = t.memoizedState;
				return e === null ? (Nc(t), o === null ? (W(t), Pc(t, i, null, r, n)) : (W(t), Fc(t, o))) : o ? o === e.memoizedState ? (W(t), t.flags &= -16777217) : (Nc(t), W(t), Fc(t, o)) : (e = e.memoizedProps, e !== r && Nc(t), W(t), Pc(t, i, e, r, n)), null;
			case 27:
				if (xe(t), n = ge.current, i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Nc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(a(166));
						return W(t), null;
					}
					e = me.current, Vi(t) ? zi(t, e) : (e = ff(i, r, n), t.stateNode = e, Nc(t));
				}
				return W(t), null;
			case 5:
				if (xe(t), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Nc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(a(166));
						return W(t), null;
					}
					if (o = me.current, Vi(t)) zi(t, o);
					else {
						var s = Bd(ge.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", i);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", i);
								break;
							default: switch (i) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", i);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", i);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(i, { is: r.is }) : s.createElement(i);
							}
						}
						o[ht] = t, o[gt] = r;
						a: for (s = t.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue;
							}
							if (s === t) break a;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === t) break a;
								s = s.return;
							}
							s.sibling.return = s.return, s = s.sibling;
						}
						t.stateNode = o;
						a: switch (Pd(o, i, r), i) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && Nc(t);
					}
				}
				return W(t), Pc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Nc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(a(166));
					if (e = ge.current, Vi(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, i = L, i !== null) switch (i.tag) {
							case 27:
							case 5: r = i.memoizedProps;
						}
						e[ht] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Md(e.nodeValue, n)), e || Ri(t, !0);
					} else e = Bd(e).createTextNode(r), e[ht] = t, t.stateNode = e;
				}
				return W(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Vi(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(a(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(557));
							e[ht] = t;
						} else Hi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						W(t), e = !1;
					} else n = Ui(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (co(t), t) : (co(t), null);
					if (t.flags & 128) throw Error(a(558));
				}
				return W(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (i = Vi(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!i) throw Error(a(318));
							if (i = t.memoizedState, i = i === null ? null : i.dehydrated, !i) throw Error(a(317));
							i[ht] = t;
						} else Hi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						W(t), i = !1;
					} else i = Ui(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
					if (!i) return t.flags & 256 ? (co(t), t) : (co(t), null);
				}
				return co(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, i = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (i = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== i && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Ic(t, t.updateQueue), W(t), null);
			case 4: return ye(), e === null && Sd(t.stateNode.containerInfo), W(t), null;
			case 10: return Yi(t.type), W(t), null;
			case 19:
				if (pe(lo), r = t.memoizedState, r === null) return W(t), null;
				if (i = !!(t.flags & 128), o = r.rendering, o === null) {
					if (i) Lc(r, !1);
					else {
						if (Wl !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = uo(e), o !== null) {
								for (t.flags |= 128, Lc(r, !1), e = o.updateQueue, t.updateQueue = e, Ic(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) pi(n, e), n = n.sibling;
								return k(lo, lo.current & 1 | 2), z && Ai(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Pe() > tu && (t.flags |= 128, i = !0, Lc(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!i) {
						if (e = uo(o), e !== null) {
							if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, Ic(t, e), Lc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !z) return W(t), null;
						} else 2 * Pe() - r.renderingStartTime > tu && n !== 536870912 && (t.flags |= 128, i = !0, Lc(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (W(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Pe(), e.sibling = null, n = lo.current, k(lo, i ? n & 1 | 2 : n & 1), z && Ai(t, r.treeForkCount), e);
			case 22:
			case 23: return co(t), no(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (W(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : W(t), n = t.updateQueue, n !== null && Ic(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && pe(va), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Yi(sa), W(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(a(156, t.tag));
	}
	function zc(e, t) {
		switch (Ni(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Yi(sa), ye(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return xe(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (co(t), t.alternate === null) throw Error(a(340));
					Hi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (co(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(a(340));
					Hi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return pe(lo), null;
			case 4: return ye(), null;
			case 10: return Yi(t.type), null;
			case 22:
			case 23: return co(t), no(), e !== null && pe(va), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Yi(sa), null;
			case 25: return null;
			default: return null;
		}
	}
	function Bc(e, t) {
		switch (Ni(t), t.tag) {
			case 3:
				Yi(sa), ye();
				break;
			case 26:
			case 27:
			case 5:
				xe(t);
				break;
			case 4:
				ye();
				break;
			case 31:
				t.memoizedState !== null && co(t);
				break;
			case 13:
				co(t);
				break;
			case 19:
				pe(lo);
				break;
			case 10:
				Yi(t.type);
				break;
			case 22:
			case 23:
				co(t), no(), e !== null && pe(va);
				break;
			case 24: Yi(sa);
		}
	}
	function Vc(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Hc(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Z(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Uc(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Za(t, n);
			} catch (t) {
				Z(e, e.return, t);
			}
		}
	}
	function Wc(e, t, n) {
		n.props = Ks(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Gc(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Kc(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				Z(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				Z(e, t, n);
			}
			else n.current = null;
		}
	}
	function qc(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Jc(e, t, n) {
		try {
			var r = e.stateNode;
			Fd(r, e.type, n, t), r[gt] = t;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Yc(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Zd(e.type) || e.tag === 4;
	}
	function Xc(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Yc(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Zd(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Zc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = sn));
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (Zc(e, t, n), e = e.sibling; e !== null;) Zc(e, t, n), e = e.sibling;
	}
	function Qc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (Qc(e, t, n), e = e.sibling; e !== null;) Qc(e, t, n), e = e.sibling;
	}
	function $c(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Pd(t, r, n), t[ht] = e, t[gt] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var el = !1, tl = !1, nl = !1, rl = typeof WeakSet == "function" ? WeakSet : Set, il = null;
	function al(e, t) {
		if (e = e.containerInfo, Rd = sp, e = Mr(e), Nr(e)) {
			if ("selectionStart" in e) var n = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				n = (n = e.ownerDocument) && n.defaultView || window;
				var r = n.getSelection && n.getSelection();
				if (r && r.rangeCount !== 0) {
					n = r.anchorNode;
					var i = r.anchorOffset, o = r.focusNode;
					r = r.focusOffset;
					try {
						n.nodeType, o.nodeType;
					} catch {
						n = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== n || i !== 0 && f.nodeType !== 3 || (c = s + i), f !== o || r !== 0 && f.nodeType !== 3 || (l = s + r), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === n && ++u === i && (c = s), p === o && ++d === r && (l = s), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					n = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else n = null;
			}
			n = n || {
				start: 0,
				end: 0
			};
		} else n = null;
		for (zd = {
			focusedElem: e,
			selectionRange: n
		}, sp = !1, il = t; il !== null;) if (t = il, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, il = e;
		else for (; il !== null;) {
			switch (t = il, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) i = e[n], i.ref.impl = i.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, i = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = Ks(n.type, i);
							e = r.getSnapshotBeforeUpdate(h, o), r.__reactInternalSnapshotBeforeUpdate = e;
						} catch (e) {
							Z(n, n.return, e);
						}
					}
					break;
				case 3:
					if (e & 1024) {
						if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9) ef(e);
						else if (n === 1) switch (e.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								ef(e);
								break;
							default: e.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				default: if (e & 1024) throw Error(a(163));
			}
			if (e = t.sibling, e !== null) {
				e.return = t.return, il = e;
				break;
			}
			il = t.return;
		}
	}
	function ol(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				bl(e, n), r & 4 && Vc(5, n);
				break;
			case 1:
				if (bl(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Z(n, n.return, e);
					}
					else {
						var i = Ks(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Z(n, n.return, e);
						}
					}
				}
				r & 64 && Uc(n), r & 512 && Gc(n, n.return);
				break;
			case 3:
				if (bl(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Za(e, t);
					} catch (e) {
						Z(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && $c(n);
			case 26:
			case 5:
				bl(e, n), t === null && r & 4 && qc(n), r & 512 && Gc(n, n.return);
				break;
			case 12:
				bl(e, n);
				break;
			case 31:
				bl(e, n), r & 4 && dl(e, n);
				break;
			case 13:
				bl(e, n), r & 4 && fl(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = Ju.bind(null, n), sf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || el, !r) {
					t = t !== null && t.memoizedState !== null || tl, i = el;
					var a = tl;
					el = r, (tl = t) && !a ? Sl(e, n, !!(n.subtreeFlags & 8772)) : bl(e, n), el = i, tl = a;
				}
				break;
			case 30: break;
			default: bl(e, n);
		}
	}
	function sl(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, sl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Ct(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var G = null, cl = !1;
	function ll(e, t, n) {
		for (n = n.child; n !== null;) ul(e, t, n), n = n.sibling;
	}
	function ul(e, t, n) {
		if (We && typeof We.onCommitFiberUnmount == "function") try {
			We.onCommitFiberUnmount(Ue, n);
		} catch {}
		switch (n.tag) {
			case 26:
				tl || Kc(n, t), ll(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				tl || Kc(n, t);
				var r = G, i = cl;
				Zd(n.type) && (G = n.stateNode, cl = !1), ll(e, t, n), pf(n.stateNode), G = r, cl = i;
				break;
			case 5: tl || Kc(n, t);
			case 6:
				if (r = G, i = cl, G = null, ll(e, t, n), G = r, cl = i, G !== null) {
					if (cl) try {
						(G.nodeType === 9 ? G.body : G.nodeName === "HTML" ? G.ownerDocument.body : G).removeChild(n.stateNode);
					} catch (e) {
						Z(n, t, e);
					}
					else try {
						G.removeChild(n.stateNode);
					} catch (e) {
						Z(n, t, e);
					}
				}
				break;
			case 18:
				G !== null && (cl ? (e = G, Qd(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Np(e)) : Qd(G, n.stateNode));
				break;
			case 4:
				r = G, i = cl, G = n.stateNode.containerInfo, cl = !0, ll(e, t, n), G = r, cl = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Hc(2, n, t), tl || Hc(4, n, t), ll(e, t, n);
				break;
			case 1:
				tl || (Kc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Wc(n, t, r)), ll(e, t, n);
				break;
			case 21:
				ll(e, t, n);
				break;
			case 22:
				tl = (r = tl) || n.memoizedState !== null, ll(e, t, n), tl = r;
				break;
			default: ll(e, t, n);
		}
	}
	function dl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Np(e);
			} catch (e) {
				Z(t, t.return, e);
			}
		}
	}
	function fl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Np(e);
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function pl(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new rl()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new rl()), t;
			default: throw Error(a(435, e.tag));
		}
	}
	function ml(e, t) {
		var n = pl(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Yu.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function hl(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (Zd(c.type)) {
							G = c.stateNode, cl = !1;
							break a;
						}
						break;
					case 5:
						G = c.stateNode, cl = !1;
						break a;
					case 3:
					case 4:
						G = c.stateNode.containerInfo, cl = !0;
						break a;
				}
				c = c.return;
			}
			if (G === null) throw Error(a(160));
			ul(o, s, i), G = null, cl = !1, o = i.alternate, o !== null && (o.return = null), i.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) _l(t, e), t = t.sibling;
	}
	var gl = null;
	function _l(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				hl(t, e), vl(e), r & 4 && (Hc(3, e, e.return), Vc(3, e), Hc(5, e, e.return));
				break;
			case 1:
				hl(t, e), vl(e), r & 512 && (tl || n === null || Kc(n, n.return)), r & 64 && el && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var i = gl;
				if (hl(t, e), vl(e), r & 512 && (tl || n === null || Kc(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) {
						if (r === null) {
							if (e.stateNode === null) {
								a: {
									r = e.type, n = e.memoizedProps, i = i.ownerDocument || i;
									b: switch (r) {
										case "title":
											o = i.getElementsByTagName("title")[0], (!o || o[St] || o[ht] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = i.createElement(r), i.head.insertBefore(o, i.querySelector("head > title"))), Pd(o, r, n), o[ht] = e, Ot(o), r = o;
											break a;
										case "link":
											var s = Vf("link", "href", i).get(r + (n.href || ""));
											if (s) {
												for (var c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && o.getAttribute("rel") === (n.rel == null ? null : n.rel) && o.getAttribute("title") === (n.title == null ? null : n.title) && o.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
													s.splice(c, 1);
													break b;
												}
											}
											o = i.createElement(r), Pd(o, r, n), i.head.appendChild(o);
											break;
										case "meta":
											if (s = Vf("meta", "content", i).get(r + (n.content || ""))) {
												for (c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("content") === (n.content == null ? null : "" + n.content) && o.getAttribute("name") === (n.name == null ? null : n.name) && o.getAttribute("property") === (n.property == null ? null : n.property) && o.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && o.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
													s.splice(c, 1);
													break b;
												}
											}
											o = i.createElement(r), Pd(o, r, n), i.head.appendChild(o);
											break;
										default: throw Error(a(468, r));
									}
									o[ht] = e, Ot(o), r = o;
								}
								e.stateNode = r;
							} else Hf(i, e.type, e.stateNode);
						} else e.stateNode = If(i, r, e.memoizedProps);
					} else o === r ? r === null && e.stateNode !== null && Jc(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Hf(i, e.type, e.stateNode) : If(i, r, e.memoizedProps));
				}
				break;
			case 27:
				hl(t, e), vl(e), r & 512 && (tl || n === null || Kc(n, n.return)), n !== null && r & 4 && Jc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (hl(t, e), vl(e), r & 512 && (tl || n === null || Kc(n, n.return)), e.flags & 32) {
					i = e.stateNode;
					try {
						$t(i, "");
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (i = e.memoizedProps, Jc(e, i, n === null ? i : n.memoizedProps)), r & 1024 && (nl = !0);
				break;
			case 6:
				if (hl(t, e), vl(e), r & 4) {
					if (e.stateNode === null) throw Error(a(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Bf = null, i = gl, gl = gf(t.containerInfo), hl(t, e), gl = i, vl(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Np(t.containerInfo);
				} catch (t) {
					Z(e, e.return, t);
				}
				nl && (nl = !1, yl(e));
				break;
			case 4:
				r = gl, gl = gf(e.stateNode.containerInfo), hl(t, e), vl(e), gl = r;
				break;
			case 12:
				hl(t, e), vl(e);
				break;
			case 31:
				hl(t, e), vl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, ml(e, r)));
				break;
			case 13:
				hl(t, e), vl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && ($l = Pe()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, ml(e, r)));
				break;
			case 22:
				i = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = el, d = tl;
				if (el = u || i, tl = d || l, hl(t, e), tl = d, el = u, vl(e), r & 8192) a: for (t = e.stateNode, t._visibility = i ? t._visibility & -2 : t._visibility | 1, i && (n === null || l || el || tl || xl(e)), n = null, t = e;;) {
					if (t.tag === 5 || t.tag === 26) {
						if (n === null) {
							l = n = t;
							try {
								if (o = l.stateNode, i) s = o.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none";
								else {
									c = l.stateNode;
									var f = l.memoizedProps.style, p = f != null && f.hasOwnProperty("display") ? f.display : null;
									c.style.display = p == null || typeof p == "boolean" ? "" : ("" + p).trim();
								}
							} catch (e) {
								Z(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = i ? "" : l.memoizedProps;
							} catch (e) {
								Z(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								i ? $d(m, !0) : $d(l.stateNode, !1);
							} catch (e) {
								Z(l, l.return, e);
							}
						}
					} else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
						t.child.return = t, t = t.child;
						continue;
					}
					if (t === e) break a;
					for (; t.sibling === null;) {
						if (t.return === null || t.return === e) break a;
						n === t && (n = null), t = t.return;
					}
					n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
				}
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, ml(e, n))));
				break;
			case 19:
				hl(t, e), vl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, ml(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: hl(t, e), vl(e);
		}
	}
	function vl(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Yc(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(a(160));
				switch (n.tag) {
					case 27:
						var i = n.stateNode;
						Qc(e, Xc(e), i);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && ($t(o, ""), n.flags &= -33), Qc(e, Xc(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						Zc(e, Xc(e), s);
						break;
					default: throw Error(a(161));
				}
			} catch (t) {
				Z(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function yl(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			yl(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function bl(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) ol(e, t.alternate, t), t = t.sibling;
	}
	function xl(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Hc(4, t, t.return), xl(t);
					break;
				case 1:
					Kc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && Wc(t, t.return, n), xl(t);
					break;
				case 27: pf(t.stateNode);
				case 26:
				case 5:
					Kc(t, t.return), xl(t);
					break;
				case 22:
					t.memoizedState === null && xl(t);
					break;
				case 30:
					xl(t);
					break;
				default: xl(t);
			}
			e = e.sibling;
		}
	}
	function Sl(e, t, n) {
		for (n = n && !!(t.subtreeFlags & 8772), t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Sl(i, a, n), Vc(4, a);
					break;
				case 1:
					if (Sl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Z(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) Xa(c[i], s);
						} catch (e) {
							Z(r, r.return, e);
						}
					}
					n && o & 64 && Uc(a), Gc(a, a.return);
					break;
				case 27: $c(a);
				case 26:
				case 5:
					Sl(i, a, n), n && r === null && o & 4 && qc(a), Gc(a, a.return);
					break;
				case 12:
					Sl(i, a, n);
					break;
				case 31:
					Sl(i, a, n), n && o & 4 && dl(i, a);
					break;
				case 13:
					Sl(i, a, n), n && o & 4 && fl(i, a);
					break;
				case 22:
					a.memoizedState === null && Sl(i, a, n), Gc(a, a.return);
					break;
				case 30: break;
				default: Sl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Cl(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && la(n));
	}
	function wl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && la(e));
	}
	function Tl(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) El(e, t, n, r), t = t.sibling;
	}
	function El(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Tl(e, t, n, r), i & 2048 && Vc(9, t);
				break;
			case 1:
				Tl(e, t, n, r);
				break;
			case 3:
				Tl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && la(e)));
				break;
			case 12:
				if (i & 2048) {
					Tl(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						Z(t, t.return, e);
					}
				} else Tl(e, t, n, r);
				break;
			case 31:
				Tl(e, t, n, r);
				break;
			case 13:
				Tl(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? Tl(e, t, n, r) : (a._visibility |= 2, Dl(e, t, n, r, !!(t.subtreeFlags & 10256) || !1)) : a._visibility & 2 ? Tl(e, t, n, r) : Ol(e, t), i & 2048 && Cl(o, t);
				break;
			case 24:
				Tl(e, t, n, r), i & 2048 && wl(t.alternate, t);
				break;
			default: Tl(e, t, n, r);
		}
	}
	function Dl(e, t, n, r, i) {
		for (i = i && (!!(t.subtreeFlags & 10256) || !1), t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Dl(a, o, s, c, i), Vc(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Dl(a, o, s, c, i)) : u._visibility & 2 ? Dl(a, o, s, c, i) : Ol(a, o), i && l & 2048 && Cl(o.alternate, o);
					break;
				case 24:
					Dl(a, o, s, c, i), i && l & 2048 && wl(o.alternate, o);
					break;
				default: Dl(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function Ol(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					Ol(n, r), i & 2048 && Cl(r.alternate, r);
					break;
				case 24:
					Ol(n, r), i & 2048 && wl(r.alternate, r);
					break;
				default: Ol(n, r);
			}
			t = t.sibling;
		}
	}
	var kl = 8192;
	function Al(e, t, n) {
		if (e.subtreeFlags & kl) for (e = e.child; e !== null;) jl(e, t, n), e = e.sibling;
	}
	function jl(e, t, n) {
		switch (e.tag) {
			case 26:
				Al(e, t, n), e.flags & kl && e.memoizedState !== null && Gf(n, gl, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				Al(e, t, n);
				break;
			case 3:
			case 4:
				var r = gl;
				gl = gf(e.stateNode.containerInfo), Al(e, t, n), gl = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = kl, kl = 16777216, Al(e, t, n), kl = r) : Al(e, t, n));
				break;
			default: Al(e, t, n);
		}
	}
	function Ml(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Nl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				il = r, Il(r, e);
			}
			Ml(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Pl(e), e = e.sibling;
	}
	function Pl(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Nl(e), e.flags & 2048 && Hc(9, e, e.return);
				break;
			case 3:
				Nl(e);
				break;
			case 12:
				Nl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Fl(e)) : Nl(e);
				break;
			default: Nl(e);
		}
	}
	function Fl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				il = r, Il(r, e);
			}
			Ml(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Hc(8, t, t.return), Fl(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Fl(t));
					break;
				default: Fl(t);
			}
			e = e.sibling;
		}
	}
	function Il(e, t) {
		for (; il !== null;) {
			var n = il;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Hc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: la(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, il = r;
			else a: for (n = e; il !== null;) {
				r = il;
				var i = r.sibling, a = r.return;
				if (sl(r), r === n) {
					il = null;
					break a;
				}
				if (i !== null) {
					i.return = a, il = i;
					break a;
				}
				il = a;
			}
		}
	}
	var Ll = {
		getCacheForType: function(e) {
			var t = ta(sa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return ta(sa).controller.signal;
		}
	}, Rl = typeof WeakMap == "function" ? WeakMap : Map, K = 0, q = null, J = null, Y = 0, X = 0, zl = null, Bl = !1, Vl = !1, Hl = !1, Ul = 0, Wl = 0, Gl = 0, Kl = 0, ql = 0, Jl = 0, Yl = 0, Xl = null, Zl = null, Ql = !1, $l = 0, eu = 0, tu = Infinity, nu = null, ru = null, iu = 0, au = null, ou = null, su = 0, cu = 0, lu = null, uu = null, du = 0, fu = null;
	function pu() {
		return K & 2 && Y !== 0 ? Y & -Y : D.T === null ? ft() : dd();
	}
	function mu() {
		if (Jl === 0) {
			if (!(Y & 536870912) || z) {
				var e = Ze;
				Ze <<= 1, !(Ze & 3932160) && (Ze = 262144), Jl = e;
			} else Jl = 536870912;
		}
		return e = ro.current, e !== null && (e.flags |= 32), Jl;
	}
	function hu(e, t, n) {
		(e === q && (X === 2 || X === 9) || e.cancelPendingCommit !== null) && (Su(e, 0), yu(e, Y, Jl, !1)), at(e, n), (!(K & 2) || e !== q) && (e === q && (!(K & 2) && (Kl |= n), Wl === 4 && yu(e, Y, Jl, !1)), rd(e));
	}
	function gu(e, t, n) {
		if (K & 6) throw Error(a(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || tt(e, t), i = r ? Au(e, t) : Ou(e, t, !0), o = r;
		do {
			if (i === 0) {
				Vl && !r && yu(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !vu(n)) {
				i = Ou(e, t, !1), o = !1;
				continue;
			}
			if (i === 2) {
				if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
				else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
				if (s !== 0) {
					t = s;
					a: {
						var c = e;
						i = Xl;
						var l = c.current.memoizedState.isDehydrated;
						if (l && (Su(c, s).flags |= 256), s = Ou(c, s, !1), s !== 2) {
							if (Hl && !l) {
								c.errorRecoveryDisabledLanes |= o, Kl |= o, i = 4;
								break a;
							}
							o = Zl, Zl = i, o !== null && (Zl === null ? Zl = o : Zl.push.apply(Zl, o));
						}
						i = s;
					}
					if (o = !1, i !== 2) continue;
				}
			}
			if (i === 1) {
				Su(e, 0), yu(e, t, 0, !0);
				break;
			}
			a: {
				switch (r = e, o = i, o) {
					case 0:
					case 1: throw Error(a(345));
					case 4: if ((t & 4194048) !== t) break;
					case 6:
						yu(r, t, Jl, !Bl);
						break a;
					case 2:
						Zl = null;
						break;
					case 3:
					case 5: break;
					default: throw Error(a(329));
				}
				if ((t & 62914560) === t && (i = $l + 300 - Pe(), 10 < i)) {
					if (yu(r, t, Jl, !Bl), et(r, 0, !0) !== 0) break a;
					su = t, r.timeoutHandle = Kd(_u.bind(null, r, n, Zl, nu, Ql, t, Jl, Kl, Yl, Bl, o, "Throttled", -0, 0), i);
					break a;
				}
				_u(r, n, Zl, nu, Ql, t, Jl, Kl, Yl, Bl, o, null, -0, 0);
			}
			break;
		} while (1);
		rd(e);
	}
	function _u(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: sn
			}, jl(t, a, d);
			var m = (a & 62914560) === a ? $l - Pe() : (a & 4194048) === a ? eu - Pe() : 0;
			if (m = qf(d, m), m !== null) {
				su = a, e.cancelPendingCommit = m(Lu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), yu(e, a, o, !l);
				return;
			}
		}
		Lu(e, t, a, n, r, i, o, s, c);
	}
	function vu(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Dr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function yu(e, t, n, r) {
		t &= ~ql, t &= ~Kl, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - Ke(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && st(e, n, t);
	}
	function bu() {
		return K & 6 ? !0 : (id(0, !1), !1);
	}
	function xu() {
		if (J !== null) {
			if (X === 0) var e = J.return;
			else e = J, qi = Ki = null, Oo(e), Ma = null, Na = 0, e = J;
			for (; e !== null;) Bc(e.alternate, e), e = e.return;
			J = null;
		}
	}
	function Su(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, qd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), su = 0, xu(), q = e, J = n = fi(e.current, null), Y = t, X = 0, zl = null, Bl = !1, Vl = tt(e, t), Hl = !1, Yl = Jl = ql = Kl = Gl = Wl = 0, Zl = Xl = null, Ql = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - Ke(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Ul = t, P(), n;
	}
	function Cu(e, t) {
		V = null, D.H = Rs, t === Sa || t === wa ? (t = Aa(), X = 3) : t === Ca ? (t = Aa(), X = 4) : X = t === nc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, zl = t, J === null && (Wl = 1, Xs(e, bi(t, e.current)));
	}
	function wu() {
		var e = ro.current;
		return e === null ? !0 : (Y & 4194048) === Y ? B === null : (Y & 62914560) === Y || Y & 536870912 ? e === B : !1;
	}
	function Tu() {
		var e = D.H;
		return D.H = Rs, e === null ? Rs : e;
	}
	function Eu() {
		var e = D.A;
		return D.A = Ll, e;
	}
	function Du() {
		Wl = 4, Bl || (Y & 4194048) !== Y && ro.current !== null || (Vl = !0), !(Gl & 134217727) && !(Kl & 134217727) || q === null || yu(q, Y, Jl, !1);
	}
	function Ou(e, t, n) {
		var r = K;
		K |= 2;
		var i = Tu(), a = Eu();
		(q !== e || Y !== t) && (nu = null, Su(e, t)), t = !1;
		var o = Wl;
		a: do
			try {
				if (X !== 0 && J !== null) {
					var s = J, c = zl;
					switch (X) {
						case 8:
							xu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							ro.current === null && (t = !0);
							var l = X;
							if (X = 0, zl = null, Pu(e, s, c, l), n && Vl) {
								o = 0;
								break a;
							}
							break;
						default: l = X, X = 0, zl = null, Pu(e, s, c, l);
					}
				}
				ku(), o = Wl;
				break;
			} catch (t) {
				Cu(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, qi = Ki = null, K = r, D.H = i, D.A = a, J === null && (q = null, Y = 0, P()), o;
	}
	function ku() {
		for (; J !== null;) Mu(J);
	}
	function Au(e, t) {
		var n = K;
		K |= 2;
		var r = Tu(), i = Eu();
		q !== e || Y !== t ? (nu = null, tu = Pe() + 500, Su(e, t)) : Vl = tt(e, t);
		a: do
			try {
				if (X !== 0 && J !== null) {
					t = J;
					var o = zl;
					b: switch (X) {
						case 1:
							X = 0, zl = null, Pu(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Ea(o)) {
								X = 0, zl = null, Nu(t);
								break;
							}
							t = function() {
								X !== 2 && X !== 9 || q !== e || (X = 7), rd(e);
							}, o.then(t, t);
							break a;
						case 3:
							X = 7;
							break a;
						case 4:
							X = 5;
							break a;
						case 7:
							Ea(o) ? (X = 0, zl = null, Nu(t)) : (X = 0, zl = null, Pu(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (J.tag) {
								case 26: s = J.memoizedState;
								case 5:
								case 27:
									var c = J;
									if (s ? Wf(s) : c.stateNode.complete) {
										X = 0, zl = null;
										var l = c.sibling;
										if (l !== null) J = l;
										else {
											var u = c.return;
											u === null ? J = null : (J = u, Fu(u));
										}
										break b;
									}
							}
							X = 0, zl = null, Pu(e, t, o, 5);
							break;
						case 6:
							X = 0, zl = null, Pu(e, t, o, 6);
							break;
						case 8:
							xu(), Wl = 6;
							break a;
						default: throw Error(a(462));
					}
				}
				ju();
				break;
			} catch (t) {
				Cu(e, t);
			}
		while (1);
		return qi = Ki = null, D.H = r, D.A = i, K = n, J === null ? (q = null, Y = 0, P(), Wl) : 0;
	}
	function ju() {
		for (; J !== null && !Me();) Mu(J);
	}
	function Mu(e) {
		var t = Mc(e.alternate, e, Ul);
		e.memoizedProps = e.pendingProps, t === null ? Fu(e) : J = t;
	}
	function Nu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = gc(n, t, t.pendingProps, t.type, void 0, Y);
				break;
			case 11:
				t = gc(n, t, t.pendingProps, t.type.render, t.ref, Y);
				break;
			case 5: Oo(t);
			default: Bc(n, t), t = J = pi(t, Ul), t = Mc(n, t, Ul);
		}
		e.memoizedProps = e.pendingProps, t === null ? Fu(e) : J = t;
	}
	function Pu(e, t, n, r) {
		qi = Ki = null, Oo(t), Ma = null, Na = 0;
		var i = t.return;
		try {
			if (tc(e, i, t, n, Y)) {
				Wl = 1, Xs(e, bi(n, e.current)), J = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw J = i, t;
			Wl = 1, Xs(e, bi(n, e.current)), J = null;
			return;
		}
		t.flags & 32768 ? (z || r === 1 ? e = !0 : Vl || Y & 536870912 ? e = !1 : (Bl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = ro.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Iu(t, e)) : Fu(t);
	}
	function Fu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Iu(t, Bl);
				return;
			}
			e = t.return;
			var n = Rc(t.alternate, t, Ul);
			if (n !== null) {
				J = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				J = t;
				return;
			}
			J = t = e;
		} while (t !== null);
		Wl === 0 && (Wl = 5);
	}
	function Iu(e, t) {
		do {
			var n = zc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, J = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				J = e;
				return;
			}
			J = e = n;
		} while (e !== null);
		Wl = 6, J = null;
	}
	function Lu(e, t, n, r, i, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			Hu();
		while (iu !== 0);
		if (K & 6) throw Error(a(327));
		if (t !== null) {
			if (t === e.current) throw Error(a(177));
			if (o = t.lanes | t.childLanes, o |= ii, ot(e, n, o, s, c, l), e === q && (J = q = null, Y = 0), ou = t, au = e, su = n, cu = o, lu = i, uu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Xu(Re, function() {
				return Uu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
				r = D.T, D.T = null, i = O.p, O.p = 2, s = K, K |= 4;
				try {
					al(e, t, n);
				} finally {
					K = s, O.p = i, D.T = r;
				}
			}
			iu = 1, Ru(), zu(), Bu();
		}
	}
	function Ru() {
		if (iu === 1) {
			iu = 0;
			var e = au, t = ou, n = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || n) {
				n = D.T, D.T = null;
				var r = O.p;
				O.p = 2;
				var i = K;
				K |= 4;
				try {
					_l(t, e);
					var a = zd, o = Mr(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && jr(s.ownerDocument.documentElement, s)) {
						if (c !== null && Nr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Ar(s, h), v = Ar(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					sp = !!Rd, zd = Rd = null;
				} finally {
					K = i, O.p = r, D.T = n;
				}
			}
			e.current = t, iu = 2;
		}
	}
	function zu() {
		if (iu === 2) {
			iu = 0;
			var e = au, t = ou, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = D.T, D.T = null;
				var r = O.p;
				O.p = 2;
				var i = K;
				K |= 4;
				try {
					ol(e, t.alternate, t);
				} finally {
					K = i, O.p = r, D.T = n;
				}
			}
			iu = 3;
		}
	}
	function Bu() {
		if (iu === 4 || iu === 3) {
			iu = 0, Ne();
			var e = au, t = ou, n = su, r = uu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? iu = 5 : (iu = 0, ou = au = null, Vu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (ru = null), dt(n), t = t.stateNode, We && typeof We.onCommitFiberRoot == "function") try {
				We.onCommitFiberRoot(Ue, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = D.T, i = O.p, O.p = 2, D.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					D.T = t, O.p = i;
				}
			}
			su & 3 && Hu(), rd(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === fu ? du++ : (du = 0, fu = e) : du = 0, id(0, !1);
		}
	}
	function Vu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, la(t)));
	}
	function Hu() {
		return Ru(), zu(), Bu(), Uu();
	}
	function Uu() {
		if (iu !== 5) return !1;
		var e = au, t = cu;
		cu = 0;
		var n = dt(su), r = D.T, i = O.p;
		try {
			O.p = 32 > n ? 32 : n, D.T = null, n = lu, lu = null;
			var o = au, s = su;
			if (iu = 0, ou = au = null, su = 0, K & 6) throw Error(a(331));
			var c = K;
			if (K |= 4, Pl(o.current), El(o, o.current, s, n), K = c, id(0, !1), We && typeof We.onPostCommitFiberRoot == "function") try {
				We.onPostCommitFiberRoot(Ue, o);
			} catch {}
			return !0;
		} finally {
			O.p = i, D.T = r, Vu(e, t);
		}
	}
	function Wu(e, t, n) {
		t = bi(n, t), t = Qs(e.stateNode, t, 2), e = Wa(e, t, 2), e !== null && (at(e, 2), rd(e));
	}
	function Z(e, t, n) {
		if (e.tag === 3) Wu(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				Wu(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (ru === null || !ru.has(r))) {
					e = bi(n, e), n = $s(2), r = Wa(t, n, 2), r !== null && (ec(n, r, t, e), at(r, 2), rd(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function Gu(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Rl();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (Hl = !0, i.add(n), e = Ku.bind(null, e, t, n), t.then(e, e));
	}
	function Ku(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, q === e && (Y & n) === n && (Wl === 4 || Wl === 3 && (Y & 62914560) === Y && 300 > Pe() - $l ? !(K & 2) && Su(e, 0) : ql |= n, Yl === Y && (Yl = 0)), rd(e);
	}
	function qu(e, t) {
		t === 0 && (t = rt()), e = si(e, t), e !== null && (at(e, t), rd(e));
	}
	function Ju(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), qu(e, n);
	}
	function Yu(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, i = e.memoizedState;
				i !== null && (n = i.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(a(314));
		}
		r !== null && r.delete(t), qu(e, n);
	}
	function Xu(e, t) {
		return Ae(e, t);
	}
	var Zu = null, Qu = null, $u = !1, ed = !1, td = !1, nd = 0;
	function rd(e) {
		e !== Qu && e.next === null && (Qu === null ? Zu = Qu = e : Qu = Qu.next = e), ed = !0, $u || ($u = !0, ud());
	}
	function id(e, t) {
		if (!td && ed) {
			td = !0;
			do
				for (var n = !1, r = Zu; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - Ke(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, ld(r, a));
						} else a = Y, a = et(r, r === q ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || tt(r, a) || (n = !0, ld(r, a));
					}
					r = r.next;
				}
			while (n);
			td = !1;
		}
	}
	function ad() {
		od();
	}
	function od() {
		ed = $u = !1;
		var e = 0;
		nd !== 0 && Gd() && (e = nd);
		for (var t = Pe(), n = null, r = Zu; r !== null;) {
			var i = r.next, a = sd(r, t);
			a === 0 ? (r.next = null, n === null ? Zu = i : n.next = i, i === null && (Qu = n)) : (n = r, (e !== 0 || a & 3) && (ed = !0)), r = i;
		}
		iu !== 0 && iu !== 5 || id(e, !1), nd !== 0 && (nd = 0);
	}
	function sd(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Ke(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = nt(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = q, n = Y, n = et(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (X === 2 || X === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && je(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || tt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && je(r), dt(n)) {
				case 2:
				case 8:
					n = Le;
					break;
				case 32:
					n = Re;
					break;
				case 268435456:
					n = Be;
					break;
				default: n = Re;
			}
			return r = cd.bind(null, e), n = Ae(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && je(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function cd(e, t) {
		if (iu !== 0 && iu !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Hu() && e.callbackNode !== n) return null;
		var r = Y;
		return r = et(e, e === q ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (gu(e, r, t), sd(e, Pe()), e.callbackNode != null && e.callbackNode === n ? cd.bind(null, e) : null);
	}
	function ld(e, t) {
		if (Hu()) return null;
		gu(e, t, !0);
	}
	function ud() {
		Yd(function() {
			K & 6 ? Ae(Ie, ad) : od();
		});
	}
	function dd() {
		if (nd === 0) {
			var e = fa;
			e === 0 && (e = Xe, Xe <<= 1, !(Xe & 261888) && (Xe = 256)), nd = e;
		}
		return nd;
	}
	function fd(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : on("" + e);
	}
	function pd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function md(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = fd((i[gt] || null).action), o = r.submitter;
			o && (t = (t = o[gt] || null) ? fd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new Dn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (nd !== 0) {
								var e = o ? pd(i, o) : new FormData(i);
								ws(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? pd(i, o) : new FormData(i), ws(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var hd = 0; hd < $r.length; hd++) {
		var gd = $r[hd];
		ei(gd.toLowerCase(), "on" + (gd[0].toUpperCase() + gd.slice(1)));
	}
	ei(Gr, "onAnimationEnd"), ei(Kr, "onAnimationIteration"), ei(qr, "onAnimationStart"), ei("dblclick", "onDoubleClick"), ei("focusin", "onFocus"), ei("focusout", "onBlur"), ei(Jr, "onTransitionRun"), ei(Yr, "onTransitionStart"), ei(Xr, "onTransitionCancel"), ei(Zr, "onTransitionEnd"), Mt("onMouseEnter", ["mouseout", "mouseover"]), Mt("onMouseLeave", ["mouseout", "mouseover"]), Mt("onPointerEnter", ["pointerout", "pointerover"]), Mt("onPointerLeave", ["pointerout", "pointerover"]), jt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), jt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), jt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), jt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), jt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), jt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var _d = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), vd = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(_d));
	function yd(e, t) {
		t = !!(t & 4);
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						ti(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						ti(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[vt];
		n === void 0 && (n = t[vt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Cd(t, e, 2, !1), n.add(r));
	}
	function bd(e, t, n) {
		var r = 0;
		t && (r |= 4), Cd(n, e, r, t);
	}
	var xd = "_reactListening" + Math.random().toString(36).slice(2);
	function Sd(e) {
		if (!e[xd]) {
			e[xd] = !0, kt.forEach(function(t) {
				t !== "selectionchange" && (vd.has(t) || bd(t, !1, e), bd(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[xd] || (t[xd] = !0, bd("selectionchange", !1, t));
		}
	}
	function Cd(e, t, n, r) {
		switch (mp(t)) {
			case 2:
				var i = cp;
				break;
			case 8:
				i = lp;
				break;
			default: i = up;
		}
		n = i.bind(null, t, n, e), i = void 0, !_n || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function wd(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var o = r.tag;
			if (o === 3 || o === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (o === 4) for (o = r.return; o !== null;) {
					var l = o.tag;
					if ((l === 3 || l === 4) && o.stateNode.containerInfo === i) return;
					o = o.return;
				}
				for (; c !== null;) {
					if (o = wt(c), o === null) return;
					if (l = o.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = o;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		mn(function() {
			var r = a, i = ln(n), o = [];
			a: {
				var c = Qr.get(e);
				if (c !== void 0) {
					var l = Dn, u = e;
					switch (e) {
						case "keypress": if (Cn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Gn;
							break;
						case "focusin":
							u = "focus", l = In;
							break;
						case "focusout":
							u = "blur", l = In;
							break;
						case "beforeblur":
						case "afterblur":
							l = In;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							l = Pn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Fn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = qn;
							break;
						case Gr:
						case Kr:
						case qr:
							l = Ln;
							break;
						case Zr:
							l = Jn;
							break;
						case "scroll":
						case "scrollend":
							l = kn;
							break;
						case "wheel":
							l = Yn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Rn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Kn;
							break;
						case "toggle":
						case "beforetoggle": l = Xn;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = hn(m, p), g != null && d.push(Td(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), o.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== cn && (u = n.relatedTarget || n.fromElement) && (wt(u) || u[_t])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? wt(u) : null, u !== null && (f = s(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = Pn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Kn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : Et(l), h = u == null ? c : Et(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, wt(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
							for (d = Dd, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
							g = 0;
							for (var _ = m; _; _ = d(_)) g++;
							for (; 0 < h - g;) p = d(p), h--;
							for (; 0 < g - h;) m = d(m), g--;
							for (; h--;) {
								if (p === m || m !== null && p === m.alternate) {
									d = p;
									break b;
								}
								p = d(p), m = d(m);
							}
							d = null;
						}
						else d = null;
						l !== null && Od(o, c, l, d, !1), u !== null && f !== null && Od(o, f, u, d, !0);
					}
				}
				a: {
					if (c = r ? Et(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = hr;
					else if (ur(c)) {
						if (gr) v = Tr;
						else {
							v = Cr;
							var y = Sr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && rn(r.elementType) && (v = hr) : v = wr;
					if (v && (v = v(e, r))) {
						N(o, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Xt(c, "number", c.value);
				}
				switch (y = r ? Et(r) : window, e) {
					case "focusin":
						(ur(y) || y.contentEditable === "true") && (Fr = y, Ir = r, Lr = null);
						break;
					case "focusout":
						Lr = Ir = Fr = null;
						break;
					case "mousedown":
						Rr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Rr = !1, zr(o, n, i);
						break;
					case "selectionchange": if (Pr) break;
					case "keydown":
					case "keyup": zr(o, n, i);
				}
				var b;
				if (Qn) b: {
					switch (e) {
						case "compositionstart":
							var x = "onCompositionStart";
							break b;
						case "compositionend":
							x = "onCompositionEnd";
							break b;
						case "compositionupdate":
							x = "onCompositionUpdate";
							break b;
					}
					x = void 0;
				}
				else or ? ir(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (tr && n.locale !== "ko" && (or || x !== "onCompositionStart" ? x === "onCompositionEnd" && or && (b = Sn()) : (yn = i, bn = "value" in yn ? yn.value : yn.textContent, or = !0)), y = Ed(r, x), 0 < y.length && (x = new zn(x, e, null, n, i), o.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = ar(n), b !== null && (x.data = b)))), (b = er ? sr(e, n) : cr(e, n)) && (x = Ed(r, "onBeforeInput"), 0 < x.length && (y = new zn("onBeforeInput", "beforeinput", null, n, i), o.push({
					event: y,
					listeners: x
				}), y.data = b)), md(o, e, r, n, i);
			}
			yd(o, t);
		});
	}
	function Td(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Ed(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = hn(e, n), i != null && r.unshift(Td(e, i, a)), i = hn(e, t), i != null && r.push(Td(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Dd(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Od(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = hn(n, a), l != null && o.unshift(Td(n, l, c))) : i || (l = hn(n, a), l != null && o.push(Td(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var kd = /\r\n?/g, Ad = /\u0000|\uFFFD/g;
	function jd(e) {
		return (typeof e == "string" ? e : "" + e).replace(kd, "\n").replace(Ad, "");
	}
	function Md(e, t) {
		return t = jd(t), jd(e) === t;
	}
	function $(e, t, n, r, i, o) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || $t(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && $t(e, "" + r);
				break;
			case "className":
				Rt(e, "class", r);
				break;
			case "tabIndex":
				Rt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Rt(e, n, r);
				break;
			case "style":
				nn(e, r, o);
				break;
			case "data": if (t !== "object") {
				Rt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href")) {
					e.removeAttribute(n);
					break;
				}
				if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = on("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && $(e, t, "name", i.name, i, null), $(e, t, "formEncType", i.formEncType, i, null), $(e, t, "formMethod", i.formMethod, i, null), $(e, t, "formTarget", i.formTarget, i, null)) : ($(e, t, "encType", i.encType, i, null), $(e, t, "method", i.method, i, null), $(e, t, "target", i.target, i, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = on("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = sn);
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				break;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(a(61));
					if (n = r.__html, n != null) {
						if (i.children != null) throw Error(a(60));
						e.innerHTML = n;
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = on("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "" + r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Q("beforetoggle", e), Q("toggle", e), Lt(e, "popover", r);
				break;
			case "xlinkActuate":
				zt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				zt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				zt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				zt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				zt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				zt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				zt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				zt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				zt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Lt(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = j.get(n) || n, Lt(e, n, r));
		}
	}
	function Nd(e, t, n, r, i, o) {
		switch (n) {
			case "style":
				nn(e, r, o);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(a(61));
					if (n = r.__html, n != null) {
						if (i.children != null) throw Error(a(60));
						e.innerHTML = n;
					}
				}
				break;
			case "children":
				typeof r == "string" ? $t(e, r) : (typeof r == "number" || typeof r == "bigint") && $t(e, "" + r);
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				break;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = sn);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!At.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), o = e[gt] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, i), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, i);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Lt(e, n, r);
			}
		}
	}
	function Pd(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Q("error", e), Q("load", e);
				var r = !1, i = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							i = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(a(137, t));
						default: $(e, t, o, s, n, null);
					}
				}
				i && $(e, t, "srcSet", n.srcSet, n, null), r && $(e, t, "src", n.src, n, null);
				return;
			case "input":
				Q("invalid", e);
				var c = o = s = i = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							i = d;
							break;
						case "type":
							s = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							o = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(a(137, t));
							break;
						default: $(e, t, r, d, n, null);
					}
				}
				Yt(e, o, c, l, u, s, i, !1);
				return;
			case "select":
				for (i in Q("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(i) && (c = n[i], c != null)) switch (i) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: $(e, t, i, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Zt(e, !!r, n, !0) : Zt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Q("invalid", e), o = i = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						i = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(a(91));
						break;
					default: $(e, t, s, c, n, null);
				}
				A(e, r, i, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: $(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Q("beforetoggle", e), Q("toggle", e), Q("cancel", e), Q("close", e);
				break;
			case "iframe":
			case "object":
				Q("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < _d.length; r++) Q(_d[r], e);
				break;
			case "image":
				Q("error", e), Q("load", e);
				break;
			case "details":
				Q("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Q("error", e), Q("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(a(137, t));
					default: $(e, t, u, r, n, null);
				}
				return;
			default: if (rn(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && Nd(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && $(e, t, c, r, n, null));
	}
	function Fd(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var i = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || $(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							o = m;
							break;
						case "name":
							i = m;
							break;
						case "checked":
							u = m;
							break;
						case "defaultChecked":
							d = m;
							break;
						case "value":
							s = m;
							break;
						case "defaultValue":
							c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(a(137, t));
							break;
						default: m !== f && $(e, t, p, m, r, f);
					}
				}
				Jt(e, s, c, l, u, d, o, i);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || $(e, t, o, null, r, l);
				}
				for (i in r) if (o = r[i], l = n[i], r.hasOwnProperty(i) && (o != null || l != null)) switch (i) {
					case "value":
						p = o;
						break;
					case "defaultValue":
						c = o;
						break;
					case "multiple": s = o;
					default: o !== l && $(e, t, i, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Zt(e, !!n, n ? [] : "", !1) : Zt(e, !!n, t, !0)) : Zt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (i = n[c], n.hasOwnProperty(c) && i != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: $(e, t, c, null, r, i);
				}
				for (s in r) if (i = r[s], o = n[s], r.hasOwnProperty(s) && (i != null || o != null)) switch (s) {
					case "value":
						p = i;
						break;
					case "defaultValue":
						m = i;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (i != null) throw Error(a(91));
						break;
					default: i !== o && $(e, t, s, i, r, o);
				}
				Qt(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: $(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: $(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && $(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(a(137, t));
						break;
					default: $(e, t, u, p, r, m);
				}
				return;
			default: if (rn(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && Nd(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || Nd(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && $(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || $(e, t, f, p, r, m);
	}
	function Id(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function Ld() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && Id(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && Id(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var Rd = null, zd = null;
	function Bd(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function Vd(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function Hd(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function Ud(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var Wd = null;
	function Gd() {
		var e = window.event;
		return e && e.type === "popstate" ? e !== Wd && (Wd = e, !0) : (Wd = null, !1);
	}
	var Kd = typeof setTimeout == "function" ? setTimeout : void 0, qd = typeof clearTimeout == "function" ? clearTimeout : void 0, Jd = typeof Promise == "function" ? Promise : void 0, Yd = typeof queueMicrotask == "function" ? queueMicrotask : Jd === void 0 ? Kd : function(e) {
		return Jd.resolve(null).then(e).catch(Xd);
	};
	function Xd(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Zd(e) {
		return e === "head";
	}
	function Qd(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) {
				if (n = i.data, n === "/$" || n === "/&") {
					if (r === 0) {
						e.removeChild(i), Np(t);
						return;
					}
					r--;
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
				else if (n === "html") pf(e.ownerDocument.documentElement);
				else if (n === "head") {
					n = e.ownerDocument.head, pf(n);
					for (var a = n.firstChild; a;) {
						var o = a.nextSibling, s = a.nodeName;
						a[St] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
					}
				} else n === "body" && pf(e.ownerDocument.body);
			}
			n = i;
		} while (n);
		Np(t);
	}
	function $d(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) {
				if (n = r.data, n === "/$") {
					if (e === 0) break;
					e--;
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			}
			n = r;
		} while (n);
	}
	function ef(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					ef(n), Ct(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function tf(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) {
				if (t === "input" && e.type === "hidden") {
					var a = i.name == null ? null : "" + i.name;
					if (i.type === "hidden" && e.getAttribute("name") === a) return e;
				} else return e;
			} else if (!e[St]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = cf(e.nextSibling), e === null) break;
		}
		return null;
	}
	function nf(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = cf(e.nextSibling), e === null)) return null;
		return e;
	}
	function rf(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = cf(e.nextSibling), e === null)) return null;
		return e;
	}
	function af(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function of(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function sf(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function cf(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var lf = null;
	function uf(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return cf(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function df(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function ff(e, t, n) {
		switch (t = Bd(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(a(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(a(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(a(454));
				return e;
			default: throw Error(a(451));
		}
	}
	function pf(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		Ct(e);
	}
	var mf = /* @__PURE__ */ new Map(), hf = /* @__PURE__ */ new Set();
	function gf(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var _f = O.d;
	O.d = {
		f: vf,
		r: yf,
		D: Sf,
		C: Cf,
		L: wf,
		m: Tf,
		X: Df,
		S: Ef,
		M: Of
	};
	function vf() {
		var e = _f.f(), t = bu();
		return e || t;
	}
	function yf(e) {
		var t = Tt(e);
		t !== null && t.tag === 5 && t.type === "form" ? Es(t) : _f.r(e);
	}
	var bf = typeof document > "u" ? null : document;
	function xf(e, t, n) {
		var r = bf;
		if (r && typeof t == "string" && t) {
			var i = qt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), hf.has(i) || (hf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Pd(t, "link", e), Ot(t), r.head.appendChild(t)));
		}
	}
	function Sf(e) {
		_f.D(e), xf("dns-prefetch", e, null);
	}
	function Cf(e, t) {
		_f.C(e, t), xf("preconnect", e, t);
	}
	function wf(e, t, n) {
		_f.L(e, t, n);
		var r = bf;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + qt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + qt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + qt(n.imageSizes) + "\"]")) : i += "[href=\"" + qt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Af(e);
					break;
				case "script": a = Pf(e);
			}
			mf.has(a) || (e = h({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), mf.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(jf(a)) || t === "script" && r.querySelector(Ff(a)) || (t = r.createElement("link"), Pd(t, "link", e), Ot(t), r.head.appendChild(t)));
		}
	}
	function Tf(e, t) {
		_f.m(e, t);
		var n = bf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + qt(r) + "\"][href=\"" + qt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Pf(e);
			}
			if (!mf.has(a) && (e = h({
				rel: "modulepreload",
				href: e
			}, t), mf.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Ff(a))) return;
				}
				r = n.createElement("link"), Pd(r, "link", e), Ot(r), n.head.appendChild(r);
			}
		}
	}
	function Ef(e, t, n) {
		_f.S(e, t, n);
		var r = bf;
		if (r && e) {
			var i = Dt(r).hoistableStyles, a = Af(e);
			t = t || "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(jf(a))) s.loading = 5;
				else {
					e = h({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = mf.get(a)) && Rf(e, n);
					var c = o = r.createElement("link");
					Ot(c), Pd(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Lf(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Df(e, t) {
		_f.X(e, t);
		var n = bf;
		if (n && e) {
			var r = Dt(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), Ot(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Of(e, t) {
		_f.M(e, t);
		var n = bf;
		if (n && e) {
			var r = Dt(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), Ot(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function kf(e, t, n, r) {
		var i = (i = ge.current) ? gf(i) : null;
		if (!i) throw Error(a(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Af(n.href), n = Dt(i).hoistableStyles, r = n.get(t), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Af(n.href);
					var o = Dt(i).hoistableStyles, s = o.get(e);
					if (s || (i = i.ownerDocument || i, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = i.querySelector(jf(e))) && !o._p && (s.instance = o, s.state.loading = 5), mf.has(e) || (n = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, mf.set(e, n), o || Nf(i, e, n, s.state))), t && r === null) throw Error(a(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(a(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Pf(n), n = Dt(i).hoistableScripts, r = n.get(t), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(a(444, e));
		}
	}
	function Af(e) {
		return "href=\"" + qt(e) + "\"";
	}
	function jf(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Mf(e) {
		return h({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Nf(e, t, n, r) {
		e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = 1 : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		}), Pd(t, "link", n), Ot(t), e.head.appendChild(t));
	}
	function Pf(e) {
		return "[src=\"" + qt(e) + "\"]";
	}
	function Ff(e) {
		return "script[async]" + e;
	}
	function If(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + qt(n.href) + "\"]");
				if (r) return t.instance = r, Ot(r), r;
				var i = h({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Ot(r), Pd(r, "style", i), Lf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				i = Af(n.href);
				var o = e.querySelector(jf(i));
				if (o) return t.state.loading |= 4, t.instance = o, Ot(o), o;
				r = Mf(n), (i = mf.get(i)) && Rf(r, i), o = (e.ownerDocument || e).createElement("link"), Ot(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Pd(o, "link", r), t.state.loading |= 4, Lf(o, n.precedence, e), t.instance = o;
			case "script": return o = Pf(n.src), (i = e.querySelector(Ff(o))) ? (t.instance = i, Ot(i), i) : (r = n, (i = mf.get(o)) && (r = h({}, n), zf(r, i)), e = e.ownerDocument || e, i = e.createElement("script"), Ot(i), Pd(i, "link", r), e.head.appendChild(i), t.instance = i);
			case "void": return null;
			default: throw Error(a(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Lf(r, n.precedence, e));
		return t.instance;
	}
	function Lf(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Rf(e, t) {
		e.crossOrigin ?? (e.crossOrigin = t.crossOrigin), e.referrerPolicy ?? (e.referrerPolicy = t.referrerPolicy), e.title ?? (e.title = t.title);
	}
	function zf(e, t) {
		e.crossOrigin ?? (e.crossOrigin = t.crossOrigin), e.referrerPolicy ?? (e.referrerPolicy = t.referrerPolicy), e.integrity ?? (e.integrity = t.integrity);
	}
	var Bf = null;
	function Vf(e, t, n) {
		if (Bf === null) {
			var r = /* @__PURE__ */ new Map(), i = Bf = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Bf, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[St] || a[ht] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Hf(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Uf(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Wf(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Gf(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Af(r.href), a = t.querySelector(jf(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Jf.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Ot(a);
					return;
				}
				a = t.ownerDocument || t, r = Mf(r), (i = mf.get(i)) && Rf(r, i), a = a.createElement("link"), Ot(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Pd(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = Jf.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var Kf = 0;
	function qf(e, t) {
		return e.stylesheets && e.count === 0 && Xf(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && Xf(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && Kf === 0 && (Kf = 62500 * Ld());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Xf(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > Kf ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function Jf() {
		if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
			if (this.stylesheets) Xf(this, this.stylesheets);
			else if (this.unsuspend) {
				var e = this.unsuspend;
				this.unsuspend = null, e();
			}
		}
	}
	var Yf = null;
	function Xf(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, Yf = /* @__PURE__ */ new Map(), t.forEach(Zf, e), Yf = null, Jf.call(e));
	}
	function Zf(e, t) {
		if (!(t.state.loading & 4)) {
			var n = Yf.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), Yf.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = Jf.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var Qf = {
		$$typeof: S,
		Provider: null,
		Consumer: null,
		_currentValue: le,
		_currentValue2: le,
		_threadCount: 0
	};
	function $f(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = it(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = it(0), this.hiddenUpdates = it(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new $f(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = F(3, null, null, t), e.current = a, a.stateNode = e, t = ca(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Va(a), e;
	}
	function tp(e) {
		return e ? (e = ui, e) : ui;
	}
	function np(e, t, n, r, i, a) {
		i = tp(i), r.context === null ? r.context = i : r.pendingContext = i, r = Ua(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Wa(e, r, t), n !== null && (hu(n, e, t), Ga(n, e, t));
	}
	function rp(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ip(e, t) {
		rp(e, t), (e = e.alternate) && rp(e, t);
	}
	function ap(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = si(e, 67108864);
			t !== null && hu(t, e, 67108864), ip(e, 67108864);
		}
	}
	function op(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = pu();
			t = ut(t);
			var n = si(e, t);
			n !== null && hu(n, e, t), ip(e, t);
		}
	}
	var sp = !0;
	function cp(e, t, n, r) {
		var i = D.T;
		D.T = null;
		var a = O.p;
		try {
			O.p = 2, up(e, t, n, r);
		} finally {
			O.p = a, D.T = i;
		}
	}
	function lp(e, t, n, r) {
		var i = D.T;
		D.T = null;
		var a = O.p;
		try {
			O.p = 8, up(e, t, n, r);
		} finally {
			O.p = a, D.T = i;
		}
	}
	function up(e, t, n, r) {
		if (sp) {
			var i = dp(r);
			if (i === null) wd(e, t, r, fp, n), Cp(e, r);
			else if (Tp(i, e, t, n, r)) r.stopPropagation();
			else if (Cp(e, r), t & 4 && -1 < Sp.indexOf(e)) {
				for (; i !== null;) {
					var a = Tt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = $e(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Ke(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									rd(a), !(K & 6) && (tu = Pe() + 500, id(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = si(a, 2), s !== null && hu(s, a, 2), bu(), ip(a, 2);
					}
					if (a = dp(r), a === null && wd(e, t, r, fp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else wd(e, t, r, null, n);
		}
	}
	function dp(e) {
		return e = ln(e), pp(e);
	}
	var fp = null;
	function pp(e) {
		if (fp = null, e = wt(e), e !== null) {
			var t = s(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = c(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = l(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return fp = e, null;
	}
	function mp(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Fe()) {
				case Ie: return 2;
				case Le: return 8;
				case Re:
				case ze: return 32;
				case Be: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var hp = !1, gp = null, _p = null, vp = null, yp = /* @__PURE__ */ new Map(), bp = /* @__PURE__ */ new Map(), xp = [], Sp = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Cp(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				gp = null;
				break;
			case "dragenter":
			case "dragleave":
				_p = null;
				break;
			case "mouseover":
			case "mouseout":
				vp = null;
				break;
			case "pointerover":
			case "pointerout":
				yp.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": bp.delete(t.pointerId);
		}
	}
	function wp(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = Tt(t), t !== null && ap(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Tp(e, t, n, r, i) {
		switch (t) {
			case "focusin": return gp = wp(gp, e, t, n, r, i), !0;
			case "dragenter": return _p = wp(_p, e, t, n, r, i), !0;
			case "mouseover": return vp = wp(vp, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return yp.set(a, wp(yp.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, bp.set(a, wp(bp.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Ep(e) {
		var t = wt(e.target);
		if (t !== null) {
			var n = s(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, pt(e.priority, function() {
							op(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = l(n), t !== null) {
						e.blockedOn = t, pt(e.priority, function() {
							op(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Dp(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = dp(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				cn = r, n.target.dispatchEvent(r), cn = null;
			} else return t = Tt(n), t !== null && ap(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Op(e, t, n) {
		Dp(e) && n.delete(t);
	}
	function kp() {
		hp = !1, gp !== null && Dp(gp) && (gp = null), _p !== null && Dp(_p) && (_p = null), vp !== null && Dp(vp) && (vp = null), yp.forEach(Op), bp.forEach(Op);
	}
	function Ap(e, n) {
		e.blockedOn === n && (e.blockedOn = null, hp || (hp = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, kp)));
	}
	var jp = null;
	function Mp(e) {
		jp !== e && (jp = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			jp === e && (jp = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (pp(r || n) === null) continue;
					break;
				}
				var a = Tt(n);
				a !== null && (e.splice(t, 3), t -= 3, ws(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Np(e) {
		function t(t) {
			return Ap(t, e);
		}
		gp !== null && Ap(gp, e), _p !== null && Ap(_p, e), vp !== null && Ap(vp, e), yp.forEach(t), bp.forEach(t);
		for (var n = 0; n < xp.length; n++) {
			var r = xp[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < xp.length && (n = xp[0], n.blockedOn === null);) Ep(n), n.blockedOn === null && xp.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[gt] || null;
			if (typeof a == "function") o || Mp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[gt] || null) s = o.formAction;
					else if (pp(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Mp(n);
			}
		}
	}
	function Pp() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Fp(e) {
		this._internalRoot = e;
	}
	Ip.prototype.render = Fp.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(a(409));
		var n = t.current;
		np(n, pu(), e, t, null, null);
	}, Ip.prototype.unmount = Fp.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			np(e.current, 2, null, e, null, null), bu(), t[_t] = null;
		}
	};
	function Ip(e) {
		this._internalRoot = e;
	}
	Ip.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = ft();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < xp.length && t !== 0 && t < xp[n].priority; n++);
			xp.splice(n, 0, e), n === 0 && Ep(e);
		}
	};
	var Lp = r.version;
	if (Lp !== "19.2.8") throw Error(a(527, Lp, "19.2.8"));
	O.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(a(188)) : (e = Object.keys(e).join(","), Error(a(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var Rp = {
		bundleType: 0,
		version: "19.2.8",
		rendererPackageName: "react-dom",
		currentDispatcherRef: D,
		reconcilerVersion: "19.2.8"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!zp.isDisabled && zp.supportsFiber) try {
			Ue = zp.inject(Rp), We = zp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!o(e)) throw Error(a(299));
		var n = !1, r = "", i = qs, s = Js, c = Ys;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = ep(e, 1, !1, null, null, n, r, null, i, s, c, Pp), e[_t] = t.current, Sd(e), new Fp(t);
	};
})), g = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = n(), v = m(), y = g(), b = {
	en: () => import("./en-CZwiohvI.js"),
	"zh-cn": () => import("./zh-cn-hijqT1SP.js"),
	"zh-tw": () => import("./zh-tw-Byn1hYw0.js")
}, x = async (e) => (await b[e]()).default, ee = (e) => (t) => e[t], S = (e) => {
	let t = localStorage.getItem("sofinder.language");
	return t === "en" || t === "zh-cn" || t === "zh-tw" ? t : e;
}, C = t();
function te({ title: e, label: t, initialValue: n = "", maximum: r, extension: i = "", invalidNameLabel: a, confirmLabel: c, cancelLabel: l, closeLabel: u, onConfirm: d, onClose: f }) {
	let [p, m] = (0, _.useState)(n), h = p + i, g = Array.from(h).length, v = s(h, r), y = v === null;
	return /* @__PURE__ */ (0, C.jsx)(o, {
		title: e,
		closeLabel: u,
		onClose: f,
		className: "sf-form-modal",
		footer: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
			/* @__PURE__ */ (0, C.jsxs)("span", { children: [
				g,
				" / ",
				r
			] }),
			/* @__PURE__ */ (0, C.jsx)("button", {
				onClick: f,
				children: l
			}),
			/* @__PURE__ */ (0, C.jsx)("button", {
				className: "primary",
				disabled: !y,
				onClick: () => d(p.trim() + i),
				children: c
			})
		] }),
		children: /* @__PURE__ */ (0, C.jsxs)("div", {
			className: "sf-form-body",
			children: [/* @__PURE__ */ (0, C.jsxs)("label", { children: [t, /* @__PURE__ */ (0, C.jsxs)("span", {
				className: "sf-name-input",
				children: [/* @__PURE__ */ (0, C.jsx)("input", {
					autoFocus: !0,
					value: p,
					maxLength: r,
					onChange: (e) => m(e.target.value)
				}), i && /* @__PURE__ */ (0, C.jsx)("span", { children: i })]
			})] }), !y && p !== "" && /* @__PURE__ */ (0, C.jsx)("p", {
				role: "alert",
				children: v === "tooLong" ? `${g} / ${r}` : a
			})]
		})
	});
}
function ne({ title: e, message: t, detail: n, confirmLabel: r, cancelLabel: i, closeLabel: a, danger: s = !1, onConfirm: c, onClose: l }) {
	return /* @__PURE__ */ (0, C.jsx)(o, {
		title: e,
		closeLabel: a,
		onClose: l,
		className: "sf-confirm-modal",
		footer: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
			/* @__PURE__ */ (0, C.jsx)("span", {}),
			/* @__PURE__ */ (0, C.jsx)("button", {
				onClick: l,
				children: i
			}),
			/* @__PURE__ */ (0, C.jsx)("button", {
				className: s ? "danger" : "primary",
				onClick: c,
				children: r
			})
		] }),
		children: /* @__PURE__ */ (0, C.jsxs)("div", {
			className: "sf-form-body",
			children: [/* @__PURE__ */ (0, C.jsx)("p", { children: t }), n && /* @__PURE__ */ (0, C.jsx)("small", { children: n })]
		})
	});
}
function re({ fileName: e, title: t, renameLabel: n, overwriteLabel: r, skipLabel: i, closeLabel: a, onChoose: s }) {
	return /* @__PURE__ */ (0, C.jsx)(o, {
		title: t,
		closeLabel: a,
		onClose: () => s("skip"),
		className: "sf-confirm-modal",
		footer: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
			/* @__PURE__ */ (0, C.jsx)("button", {
				onClick: () => s("skip"),
				children: i
			}),
			/* @__PURE__ */ (0, C.jsx)("button", {
				className: "primary",
				onClick: () => s("rename"),
				children: n
			}),
			/* @__PURE__ */ (0, C.jsx)("button", {
				className: "danger",
				onClick: () => s("overwrite"),
				children: r
			})
		] }),
		children: /* @__PURE__ */ (0, C.jsx)("div", {
			className: "sf-form-body",
			children: /* @__PURE__ */ (0, C.jsx)("p", { children: e })
		})
	});
}
//#endregion
//#region src/components/SortMenu.tsx
var w = 160, ie = 96, T = 6, ae = 12;
function oe({ sort: e, direction: t, group: n, available: r, groupingAvailable: i, tagsEnabled: o, labels: s, onSortChange: c, onDirectionChange: l, onGroupChange: u, onOpen: d }) {
	let [f, p] = (0, _.useState)(!1), [m, h] = (0, _.useState)(!1), [g, v] = (0, _.useState)({
		side: "right",
		width: w
	}), y = (0, _.useRef)(null), b = (0, _.useRef)(null), x = (0, _.useRef)(null);
	(0, _.useEffect)(() => {
		if (!f) return;
		let e = (e) => {
			e.target instanceof Node && !y.current?.contains(e.target) && (p(!1), h(!1));
		}, t = (e) => {
			if (e.key === "Escape") {
				if (e.preventDefault(), m) {
					h(!1), x.current?.focus();
					return;
				}
				p(!1), b.current?.focus();
			}
		};
		return document.addEventListener("pointerdown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("keydown", t);
		};
	}, [m, f]), (0, _.useLayoutEffect)(() => {
		if (!m) return;
		let e = () => {
			let e = x.current?.getBoundingClientRect();
			if (!e) return;
			let t = Math.max(0, window.innerWidth - e.right - T - ae), n = Math.max(0, e.left - T - ae), r = t >= ie ? "right" : n >= ie ? "left" : t >= n ? "right" : "left", i = Math.min(w, Math.floor(r === "right" ? t : n));
			v((e) => e.side === r && e.width === i ? e : {
				side: r,
				width: i
			});
		};
		return e(), window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
	}, [m]);
	let ee = (e) => /* @__PURE__ */ (0, C.jsx)("span", {
		className: "sf-sort-menu-mark",
		"aria-hidden": "true",
		children: e ? "✓" : ""
	}), S = (e) => {
		c(e), p(!1), h(!1);
	}, te = (e) => {
		l(e), p(!1), h(!1);
	}, ne = (e) => {
		u(e), p(!1), h(!1);
	}, re = (t, n) => /* @__PURE__ */ (0, C.jsxs)("button", {
		type: "button",
		role: "menuitemradio",
		disabled: !r,
		"aria-checked": e === t,
		onClick: () => S(t),
		children: [ee(e === t), /* @__PURE__ */ (0, C.jsx)("span", { children: n })]
	}), oe = (e, t) => /* @__PURE__ */ (0, C.jsxs)("button", {
		type: "button",
		role: "menuitemradio",
		"aria-checked": n === e,
		onClick: () => ne(e),
		children: [ee(n === e), /* @__PURE__ */ (0, C.jsx)("span", { children: t })]
	});
	return /* @__PURE__ */ (0, C.jsxs)("div", {
		ref: y,
		className: "sf-sort-menu sf-utility",
		children: [/* @__PURE__ */ (0, C.jsxs)("button", {
			ref: b,
			type: "button",
			className: "sf-sort-menu-trigger",
			"aria-label": s.sort,
			"aria-haspopup": "menu",
			"aria-expanded": f,
			onClick: () => p((e) => {
				let t = !e;
				return t ? d?.() : h(!1), t;
			}),
			children: [
				/* @__PURE__ */ (0, C.jsx)(a, { name: "sort" }),
				/* @__PURE__ */ (0, C.jsx)("span", { children: s.sort }),
				/* @__PURE__ */ (0, C.jsx)(a, { name: "chevron-down" })
			]
		}), f && /* @__PURE__ */ (0, C.jsxs)("div", {
			className: "sf-utility-menu sf-sort-menu-popup",
			role: "menu",
			"aria-label": s.sort,
			children: [
				/* @__PURE__ */ (0, C.jsxs)("div", {
					className: "sf-sort-menu-section",
					children: [
						re("name", s.name),
						re("modified", s.modified),
						re("type", s.type),
						re("size", s.size)
					]
				}),
				/* @__PURE__ */ (0, C.jsxs)("div", {
					className: "sf-sort-menu-section",
					children: [/* @__PURE__ */ (0, C.jsxs)("button", {
						type: "button",
						className: "sf-sort-direction-option",
						role: "menuitemradio",
						disabled: !r,
						"aria-checked": t === "asc",
						onClick: () => te("asc"),
						children: [
							ee(t === "asc"),
							/* @__PURE__ */ (0, C.jsx)(a, { name: "sort-asc" }),
							/* @__PURE__ */ (0, C.jsx)("span", { children: s.ascending })
						]
					}), /* @__PURE__ */ (0, C.jsxs)("button", {
						type: "button",
						className: "sf-sort-direction-option",
						role: "menuitemradio",
						disabled: !r,
						"aria-checked": t === "desc",
						onClick: () => te("desc"),
						children: [
							ee(t === "desc"),
							/* @__PURE__ */ (0, C.jsx)(a, { name: "sort-desc" }),
							/* @__PURE__ */ (0, C.jsx)("span", { children: s.descending })
						]
					})]
				}),
				/* @__PURE__ */ (0, C.jsxs)("div", {
					className: "sf-sort-menu-section sf-sort-group",
					children: [/* @__PURE__ */ (0, C.jsxs)("button", {
						ref: x,
						type: "button",
						role: "menuitem",
						disabled: !i,
						"aria-haspopup": "menu",
						"aria-expanded": m,
						onClick: () => h((e) => !e),
						children: [
							/* @__PURE__ */ (0, C.jsx)("span", {
								className: "sf-sort-menu-mark",
								"aria-hidden": "true",
								children: n === "none" ? "" : "•"
							}),
							/* @__PURE__ */ (0, C.jsx)("span", { children: s.groupBy }),
							/* @__PURE__ */ (0, C.jsx)(a, { name: "chevron-right" })
						]
					}), m && /* @__PURE__ */ (0, C.jsxs)("div", {
						className: `sf-utility-menu sf-sort-submenu opens-${g.side}`,
						style: { width: `${g.width}px` },
						role: "menu",
						"aria-label": s.groupBy,
						children: [
							oe("none", s.groupNone),
							oe("name", s.name),
							oe("modified", s.modified),
							oe("type", s.type),
							oe("size", s.size),
							o && oe("tags", s.tags)
						]
					})]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/ViewMenu.tsx
function se({ view: e, viewAvailable: t, viewSizes: n, scale: r, folderNavigation: i, folderNavigationAvailable: o, detailsPane: s, detailsPaneAvailable: c, columns: l, labels: u, onViewChange: d, onViewSizeChange: f, onCompactChange: p, onFolderNavigationChange: m, onDetailsPaneChange: h, onColumnChange: g, onOpen: v }) {
	let [y, b] = (0, _.useState)(!1), x = (0, _.useRef)(null), ee = (0, _.useRef)(null);
	(0, _.useEffect)(() => {
		if (!y) return;
		let e = (e) => {
			e.target instanceof Node && !x.current?.contains(e.target) && b(!1);
		}, t = (e) => {
			e.key === "Escape" && (e.preventDefault(), b(!1), ee.current?.focus());
		};
		return document.addEventListener("pointerdown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("keydown", t);
		};
	}, [y]);
	let S = (e) => {
		f("grid", e), d("grid"), b(!1);
	}, te = (e) => {
		f("list", e), d("list"), b(!1);
	}, ne = (e) => /* @__PURE__ */ (0, C.jsx)("span", {
		className: "sf-view-menu-mark",
		"aria-hidden": "true",
		children: e ? "✓" : ""
	}), re = (e, t, n, r) => /* @__PURE__ */ (0, C.jsxs)("button", {
		type: "button",
		role: "menuitemcheckbox",
		"aria-checked": t,
		disabled: n,
		onClick: () => r(!t),
		children: [ne(t), /* @__PURE__ */ (0, C.jsx)("span", { children: e })]
	});
	return /* @__PURE__ */ (0, C.jsxs)("div", {
		ref: x,
		className: "sf-view-menu sf-utility",
		children: [/* @__PURE__ */ (0, C.jsxs)("button", {
			ref: ee,
			type: "button",
			className: "sf-view-menu-trigger",
			"aria-label": u.view,
			"aria-haspopup": "menu",
			"aria-expanded": y,
			onClick: () => b((e) => {
				let t = !e;
				return t && v?.(), t;
			}),
			children: [
				/* @__PURE__ */ (0, C.jsx)(a, { name: e === "grid" ? "grid" : "list" }),
				/* @__PURE__ */ (0, C.jsx)("span", { children: u.view }),
				/* @__PURE__ */ (0, C.jsx)(a, { name: "chevron-down" })
			]
		}), y && /* @__PURE__ */ (0, C.jsxs)("div", {
			className: "sf-utility-menu sf-view-menu-popup",
			role: "menu",
			"aria-label": u.view,
			children: [
				/* @__PURE__ */ (0, C.jsxs)("div", {
					className: "sf-view-menu-section",
					children: [
						/* @__PURE__ */ (0, C.jsxs)("button", {
							type: "button",
							role: "menuitemradio",
							disabled: !t,
							"aria-checked": e === "grid" && n.grid === "large",
							onClick: () => S("large"),
							children: [
								ne(e === "grid" && n.grid === "large"),
								/* @__PURE__ */ (0, C.jsx)(a, { name: "grid" }),
								/* @__PURE__ */ (0, C.jsx)("span", { children: u.largeIcons })
							]
						}),
						/* @__PURE__ */ (0, C.jsxs)("button", {
							type: "button",
							role: "menuitemradio",
							disabled: !t,
							"aria-checked": e === "grid" && n.grid === "medium",
							onClick: () => S("medium"),
							children: [
								ne(e === "grid" && n.grid === "medium"),
								/* @__PURE__ */ (0, C.jsx)(a, { name: "grid" }),
								/* @__PURE__ */ (0, C.jsx)("span", { children: u.mediumIcons })
							]
						}),
						/* @__PURE__ */ (0, C.jsxs)("button", {
							type: "button",
							role: "menuitemradio",
							disabled: !t,
							"aria-checked": e === "grid" && n.grid === "small",
							onClick: () => S("small"),
							children: [
								ne(e === "grid" && n.grid === "small"),
								/* @__PURE__ */ (0, C.jsx)(a, { name: "grid" }),
								/* @__PURE__ */ (0, C.jsx)("span", { children: u.smallIcons })
							]
						}),
						/* @__PURE__ */ (0, C.jsxs)("button", {
							type: "button",
							role: "menuitemradio",
							disabled: !t,
							"aria-checked": e === "list" && n.list === "small",
							onClick: () => te("small"),
							children: [
								ne(e === "list" && n.list === "small"),
								/* @__PURE__ */ (0, C.jsx)(a, { name: "list" }),
								/* @__PURE__ */ (0, C.jsx)("span", { children: u.list })
							]
						}),
						/* @__PURE__ */ (0, C.jsxs)("button", {
							type: "button",
							role: "menuitemradio",
							disabled: !t,
							"aria-checked": e === "list" && n.list === "medium",
							onClick: () => te("medium"),
							children: [
								ne(e === "list" && n.list === "medium"),
								/* @__PURE__ */ (0, C.jsx)(a, { name: "list" }),
								/* @__PURE__ */ (0, C.jsx)("span", { children: u.detailsView })
							]
						}),
						/* @__PURE__ */ (0, C.jsxs)("button", {
							type: "button",
							role: "menuitemradio",
							disabled: !t,
							"aria-checked": e === "list" && n.list === "large",
							onClick: () => te("large"),
							children: [
								ne(e === "list" && n.list === "large"),
								/* @__PURE__ */ (0, C.jsx)(a, { name: "list" }),
								/* @__PURE__ */ (0, C.jsx)("span", { children: u.contentView })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-view-menu-section",
					children: re(u.compactView, r === "compact", !1, p)
				}),
				/* @__PURE__ */ (0, C.jsxs)("div", {
					className: "sf-view-menu-section",
					"aria-label": u.show,
					children: [
						/* @__PURE__ */ (0, C.jsx)("strong", { children: u.show }),
						re(u.folderNavigation, i, !o, m),
						re(u.detailsPane, s, !c, h),
						re(u.showSizeColumn, l.size, !1, (e) => g("size", e)),
						re(u.showTypeColumn, l.type, !1, (e) => g("type", e)),
						re(u.showModifiedColumn, l.modified, !1, (e) => g("modified", e))
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/SidebarSectionFrame.tsx
var E = [
	"folderNavigation",
	"quickAccess",
	"favorites",
	"recent"
], ce = "sofinder.sidebarLayout.v1", D = (e) => {
	let t = e === "right" ? {
		left: [
			"quickAccess",
			"favorites",
			"recent"
		],
		right: ["folderNavigation"]
	} : {
		left: [...E],
		right: []
	};
	try {
		let e = JSON.parse(localStorage.getItem(ce) || "null");
		if (!e || !Array.isArray(e.left) || !Array.isArray(e.right)) return t;
		let n = /* @__PURE__ */ new Set(), r = (e) => {
			let t = [];
			for (let r of e) !E.includes(r) || n.has(r) || (n.add(r), t.push(r));
			return t;
		}, i = r(e.left), a = r(e.right);
		for (let e of E) n.has(e) || i.push(e);
		return {
			left: i,
			right: a
		};
	} catch {
		return t;
	}
}, O = (e) => localStorage.setItem(ce, JSON.stringify(e));
function le({ id: e, side: t, title: n, dragging: r, children: i, onDragStart: o, onDragEnd: s, onDrop: c, onKeyboardMove: l }) {
	return /* @__PURE__ */ (0, C.jsxs)("div", {
		className: `sf-sidebar-section-frame${r ? " dragging" : ""}`,
		"data-sidebar-section": e,
		"data-sidebar-side": t,
		onDragOver: (e) => {
			e.preventDefault(), e.stopPropagation();
			let t = e.currentTarget.getBoundingClientRect();
			e.currentTarget.dataset.dropPosition = e.clientY >= t.top + t.height / 2 ? "after" : "before";
		},
		onDragLeave: (e) => {
			e.currentTarget.contains(e.relatedTarget) || delete e.currentTarget.dataset.dropPosition;
		},
		onDrop: (n) => {
			n.preventDefault(), n.stopPropagation();
			let r = n.currentTarget.dataset.dropPosition === "after";
			delete n.currentTarget.dataset.dropPosition, c(e, t, r);
		},
		children: [/* @__PURE__ */ (0, C.jsx)("button", {
			className: "sf-sidebar-drag-handle",
			type: "button",
			draggable: !0,
			title: n,
			"aria-label": n,
			onDragStart: (t) => {
				t.stopPropagation(), t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", e), o(e);
			},
			onDragEnd: s,
			onKeyDown: (t) => {
				[
					"ArrowUp",
					"ArrowDown",
					"ArrowLeft",
					"ArrowRight",
					"Home",
					"End"
				].includes(t.key) && (t.preventDefault(), t.stopPropagation(), l(e, t.key));
			},
			children: /* @__PURE__ */ (0, C.jsx)(a, { name: "grip" })
		}), i]
	});
}
//#endregion
//#region src/preferences.ts
var ue = {
	resize: !1,
	crop: !1,
	rotate: !1,
	presets: !1,
	process: !1,
	batchRename: !1
}, de = {
	grid: "medium",
	list: "medium"
}, fe = {
	recent: !1,
	favorites: !1,
	sidebarFavorites: !0,
	sidebarQuickAccess: !0,
	quickAccessFiles: !1,
	tags: !1,
	archive: !1,
	trash: !0,
	folderTree: !1,
	qrCode: !1,
	autoCollapseUploads: !0
}, pe = {
	size: !0,
	modified: !0,
	type: !1
}, k = {
	recent: !0,
	favorites: !0,
	quickAccess: !0,
	quickAccessFiles: !1,
	tags: !0,
	archive: !0,
	trash: !0,
	folderTree: !0,
	batchRename: !0,
	imageEditing: !0,
	imageProcessing: !0,
	documentPreview: !0,
	securityStatus: !0,
	folderUpload: !0,
	textPreview: !0,
	checksum: !0,
	qrCode: !0
}, me = (e, t) => {
	try {
		let n = JSON.parse(localStorage.getItem(e) || "{}");
		return Object.fromEntries(Object.entries(t).map(([e, t]) => [e, typeof n[e] == "boolean" ? n[e] : t]));
	} catch {
		return t;
	}
}, he = () => me("sofinder.tools.v3", ue), ge = () => {
	try {
		let e = JSON.parse(localStorage.getItem("sofinder.viewSizes.v1") || "{}"), t = (e) => e === "small" || e === "medium" || e === "large";
		return {
			grid: t(e.grid) ? e.grid : de.grid,
			list: t(e.list) ? e.list : de.list
		};
	} catch {
		return de;
	}
}, _e = (e) => {
	let t = localStorage.getItem("sofinder.uiScale.v1");
	return t === "compact" || t === "standard" || t === "large" || t === "xlarge" ? t : e;
}, ve = (e) => {
	let t = localStorage.getItem("sofinder.uploadConflictStrategy.v1");
	return t === "ask" || t === "rename" || t === "overwrite" || t === "skip" ? t : e;
}, ye = () => localStorage.getItem("sofinder.folderNavigation.position.v1") === "right" ? "right" : "left", be = () => localStorage.getItem("sofinder.quickAccess.scope.v1") === "resource" ? "resource" : "all", xe = {
	left: {
		initial: 220,
		min: 110,
		max: 330
	},
	right: {
		initial: 270,
		min: 135,
		max: 405
	}
}, Se = {
	name: {
		initial: 360,
		min: 180,
		max: 720
	},
	size: {
		initial: 100,
		min: 72,
		max: 180
	},
	type: {
		initial: 160,
		min: 120,
		max: 360
	},
	modified: {
		initial: 180,
		min: 150,
		max: 320
	}
}, Ce = {
	default: 100,
	min: 10,
	max: 500
}, we = (e) => Math.max(Ce.min, Math.min(Ce.max, Math.trunc(e))), Te = () => {
	let e = Number(localStorage.getItem("sofinder.pageSize.v1"));
	return Number.isFinite(e) && e > 0 ? we(e) : Ce.default;
}, Ee = (e) => {
	let t = xe[e], n = localStorage.getItem(`sofinder.column.${e}`);
	if (n === null || n.trim() === "") return t.initial;
	let r = Number(n);
	return Number.isFinite(r) ? Math.max(t.min, Math.min(t.max, r)) : t.initial;
}, De = (e, t) => {
	let n = Se[e];
	return Math.round(Math.max(n.min, Math.min(n.max, t)));
}, Oe = () => {
	try {
		let e = JSON.parse(localStorage.getItem("sofinder.listColumnWidths.v1") || "{}");
		return Object.fromEntries(Object.keys(Se).map((t) => {
			let n = Number(e[t]);
			return [t, Number.isFinite(n) ? De(t, n) : Se[t].initial];
		}));
	} catch {
		return Object.fromEntries(Object.keys(Se).map((e) => [e, Se[e].initial]));
	}
};
//#endregion
//#region src/hooks/useEntrySelection.ts
function ke(e, t, n) {
	let [r, i] = (0, _.useState)(() => /* @__PURE__ */ new Set()), [a, o] = (0, _.useState)(null), s = (0, _.useMemo)(() => e.filter((e) => r.has(e.path)), [e, r]);
	return {
		selectedPaths: r,
		setSelectedPaths: i,
		selectionAnchor: a,
		setSelectionAnchor: o,
		selectedEntries: s,
		selected: s.length === 1 ? s[0] : null,
		selectEntry: (0, _.useCallback)((r, s) => {
			if (t) {
				i(/* @__PURE__ */ new Set([r.path])), o(r.path);
				return;
			}
			if (s.shiftKey && a) {
				let t = e.findIndex((e) => e.path === a), n = e.findIndex((e) => e.path === r.path);
				if (t >= 0 && n >= 0) {
					let [r, a] = t < n ? [t, n] : [n, t];
					i(new Set(e.slice(r, a + 1).map((e) => e.path)));
					return;
				}
			}
			s.ctrlKey || s.metaKey ? i((e) => {
				let t = new Set(e);
				return t.has(r.path) ? t.delete(r.path) : t.add(r.path), t;
			}) : i(/* @__PURE__ */ new Set([r.path])), o(r.path), n(r);
		}, [
			e,
			n,
			t,
			a
		])
	};
}
//#endregion
//#region src/hooks/useBrowserState.ts
function Ae(e, t) {
	let [n, r] = (0, _.useState)(e), [i, a] = (0, _.useState)(t), [o, s] = (0, _.useState)(""), [c, l] = (0, _.useState)([]), [u, d] = (0, _.useState)(""), [f, p] = (0, _.useState)("name"), [m, h] = (0, _.useState)("name"), [g, v] = (0, _.useState)("asc"), [y, b] = (0, _.useState)(0), [x, ee] = (0, _.useState)(0), [S, C] = (0, _.useState)(null), [te, ne] = (0, _.useState)(null), [re, w] = (0, _.useState)([]), ie = (0, _.useRef)(Te()).current, [T, ae] = (0, _.useState)(ie), [oe, se] = (0, _.useState)(String(ie)), E = (0, _.useRef)(ie), [ce, D] = (0, _.useState)(() => localStorage.getItem("sofinder.view") === "list" ? "list" : "grid"), [O, le] = (0, _.useState)(!0), [ue, de] = (0, _.useState)(""), [fe, pe] = (0, _.useState)({});
	return {
		resource: n,
		setResource: r,
		path: i,
		setPath: a,
		resolvedPath: o,
		setResolvedPath: s,
		entries: c,
		setEntries: l,
		search: u,
		setSearch: d,
		searchMode: f,
		setSearchMode: p,
		sort: m,
		setSort: h,
		direction: g,
		setDirection: v,
		offset: y,
		setOffset: b,
		total: x,
		setTotal: ee,
		pageCursor: S,
		setPageCursor: C,
		nextCursor: te,
		setNextCursor: ne,
		cursorHistory: re,
		setCursorHistory: w,
		pageSize: T,
		setPageSize: ae,
		pageSizeDraft: oe,
		setPageSizeDraft: se,
		pageSizeRef: E,
		view: ce,
		setView: D,
		loading: O,
		setLoading: le,
		notice: ue,
		setNotice: de,
		directoryCapabilities: fe,
		setDirectoryCapabilities: pe,
		loadSequence: (0, _.useRef)(0),
		historyReady: (0, _.useRef)(!1),
		restoringHistory: (0, _.useRef)(!1),
		searchInitialized: (0, _.useRef)(!1)
	};
}
//#endregion
//#region src/hooks/useBatchState.ts
function je() {
	let [e, t] = (0, _.useState)(null), [n, r] = (0, _.useState)(!1);
	return {
		destinationDialog: e,
		setDestinationDialog: t,
		bulkRenameOpen: n,
		setBulkRenameOpen: r
	};
}
//#endregion
//#region src/uploadNaming.ts
var Me = (e, t) => {
	if (!t) return e;
	let n = e.lastIndexOf(".");
	return n > 0 && n < e.length - 1 ? e.slice(0, n + 1) + e.slice(n + 1).toLowerCase() : e;
}, Ne = (e, t) => t === e.name ? e : new File([e], t, {
	type: e.type,
	lastModified: e.lastModified
});
function Pe({ api: e, resource: t, path: n, currentResource: i, currentDepth: a, autoCollapse: o, conflictStrategy: c, lowercaseExtensions: l, t: u, ask: d, chooseConflict: f, reload: p, setNotice: m, report: h }) {
	let [g, v] = (0, _.useState)([]), [y, b] = (0, _.useState)(!1), x = (0, _.useRef)(null), ee = (0, _.useRef)(null), S = (0, _.useRef)(/* @__PURE__ */ new Map()), C = (0, _.useRef)(/* @__PURE__ */ new Map()), te = (0, _.useRef)(0), ne = (0, _.useRef)(Promise.resolve()), re = (e) => {
		if (c !== "ask") return Promise.resolve(c);
		let t = ne.current.then(() => f(e));
		return ne.current = t.then(() => void 0, () => void 0), t;
	};
	(0, _.useEffect)(() => {
		let t = e.pendingUploads().map((e) => ({
			id: `pending-${e.id}`,
			name: e.name,
			progress: 0,
			status: "error",
			message: u("uploadReselectToResume")
		}));
		t.length > 0 && (v((e) => [...e.filter((e) => !e.id.startsWith("pending-")), ...t]), b(!1));
	}, [e, u]), (0, _.useEffect)(() => {
		if (!o || g.length === 0 || g.some((e) => e.status === "queued" || e.status === "uploading")) return;
		let e = window.setTimeout(() => b(!0), 1200);
		return () => window.clearTimeout(e);
	}, [o, g]);
	let w = (e, t) => {
		v((n) => n.map((n) => n.id === e ? {
			...n,
			...t
		} : n));
	}, ie = async (a, o = n) => {
		let d = Array.from(a).map((e) => Ne(e, Me(e.name, l))), f = i ? d.filter((e) => s(e.name, i.maxFileNameLength) === null) : d;
		f.length !== d.length && i && m(d.map((e) => s(e.name, i.maxFileNameLength)).filter((e) => e !== null).includes("tooLong") ? `${u("fileNameTooLong")} ${i.maxFileNameLength}` : u("invalidEntryName"));
		let h = f.map((n) => {
			let r = `${Date.now()}-${++te.current}`, i = new AbortController();
			S.current.set(r, i), C.current.set(r, {
				file: n,
				targetPath: o
			});
			let a = e.findPendingUpload(t, o, n, !1);
			return {
				id: r,
				file: n,
				controller: i,
				pendingId: a ? `pending-${a.id}` : null
			};
		});
		if (h.length === 0) return;
		b(!1);
		let g = new Set(h.map((e) => e.pendingId).filter((e) => e !== null));
		v((e) => [...e.filter((e) => !g.has(e.id)), ...h.map(({ id: e, file: t, pendingId: n }) => ({
			id: e,
			name: t.name,
			progress: 0,
			status: "queued",
			message: n ? u("uploadResuming") : void 0
		}))]);
		let _ = 0, y = async () => {
			for (; _ < h.length;) {
				let n = h[_++];
				if (n.controller.signal.aborted) {
					S.current.delete(n.id);
					continue;
				}
				w(n.id, {
					status: "uploading",
					progress: 0,
					message: void 0
				});
				let i = c === "overwrite", a = c === "rename";
				try {
					for (;;) try {
						await e.upload(t, o, n.file, {
							overwrite: i,
							autoRename: a,
							signal: n.controller.signal,
							onProgress: (e) => w(n.id, { progress: e })
						}), w(n.id, {
							status: "done",
							progress: 100
						});
						break;
					} catch (e) {
						if (e instanceof r && e.code === "conflict" && !i && !a) {
							let e = await re(n.file.name);
							if (e === "skip") {
								w(n.id, {
									status: "skipped",
									progress: 0,
									message: u("uploadConflictSkip")
								});
								break;
							}
							i = e === "overwrite", a = e === "rename", w(n.id, { progress: 0 });
							continue;
						}
						throw e;
					}
				} catch (e) {
					w(n.id, e instanceof DOMException && e.name === "AbortError" ? {
						status: "cancelled",
						message: u("cancelled")
					} : {
						status: "error",
						message: e instanceof Error ? e.message : u("error")
					});
				} finally {
					S.current.delete(n.id);
				}
			}
		};
		await Promise.all(Array.from({ length: Math.min(3, h.length) }, () => y())), await p();
	}, T = async (o) => {
		if (!i) return;
		let c = Array.from(o);
		if (c.length > 500) {
			m(u("folderUploadTooMany"));
			return;
		}
		let l = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map();
		for (let e of c) {
			let t = e.webkitRelativePath.replace(/\\/g, "/").split("/").filter(Boolean);
			if (t.length < 2 || t.some((e) => s(e, e === t.at(-1) ? i.maxFileNameLength : i.maxFolderNameLength) !== null)) {
				m(u("invalidEntryName"));
				return;
			}
			let r = t.slice(0, -1);
			if (a + r.length > i.maxFolderDepth) {
				m(u("folderDepthReached"));
				return;
			}
			r.forEach((e, t) => l.add(r.slice(0, t + 1).join("/")));
			let o = [n, ...r].filter(Boolean).join("/");
			f.set(o, [...f.get(o) || [], e]);
		}
		let p = Array.from(l).filter((e) => !e.includes("/")).slice(0, 5);
		if (await d({
			title: u("uploadFolder"),
			message: `${c.length} ${u("files")} · ${l.size} ${u("folder")}`,
			detail: `${u("folderUploadPreview")}: ${p.join(", ")}${Array.from(l).filter((e) => !e.includes("/")).length > p.length ? "…" : ""}`
		})) try {
			for (let i of Array.from(l).sort((e, t) => e.split("/").length - t.split("/").length || e.localeCompare(t))) {
				let a = i.split("/"), o = a.pop() || "", s = [n, ...a].filter(Boolean).join("/");
				try {
					await e.createFolder(t, s, o);
				} catch (e) {
					if (!(e instanceof r) || e.code !== "conflict") throw e;
				}
			}
			for (let [e, t] of f) await ie(t, e);
		} catch (e) {
			h(e);
		}
	}, ae = (e) => {
		S.current.get(e)?.abort(), w(e, {
			status: "cancelled",
			message: u("cancelled")
		});
	}, oe = () => {
		S.current.forEach((e) => e.abort()), v((e) => e.map((e) => e.status === "queued" || e.status === "uploading" ? {
			...e,
			status: "cancelled",
			message: u("cancelled")
		} : e));
	}, se = (e) => {
		S.current.get(e)?.abort(), S.current.delete(e), C.current.delete(e), v((t) => t.filter((t) => t.id !== e));
	};
	return {
		uploads: g,
		uploadsCollapsed: y,
		setUploadsCollapsed: b,
		uploadInput: x,
		directoryUploadInput: ee,
		upload: ie,
		uploadTo: (e, t) => ie(t, e),
		uploadDirectory: T,
		cancelUpload: ae,
		cancelAllUploads: oe,
		removeUploadTask: se,
		retryUpload: (e) => {
			let t = C.current.get(e);
			t && (se(e), ie([t.file], t.targetPath));
		},
		clearFinishedUploads: () => {
			let e = new Set(g.filter((e) => e.status === "queued" || e.status === "uploading").map((e) => e.id));
			C.current.forEach((t, n) => {
				e.has(n) || C.current.delete(n);
			}), v((e) => e.filter((e) => e.status === "queued" || e.status === "uploading"));
		}
	};
}
//#endregion
//#region src/pluginUi.ts
var Fe = (e, t) => e.label[t] || e.label.en, Ie = (e, t) => {
	if (e.directory) return null;
	let n = e.mimeType?.toLowerCase() || "", r = e.name.includes(".") && e.name.split(".").pop()?.toLowerCase() || "";
	return t.find((e) => e.extensions.includes(r) || e.mimeTypes.some((e) => e === n || e.endsWith("/*") && n.startsWith(e.slice(0, -1)))) || null;
}, Le = (e, t, n) => {
	let r = Ie(e, t);
	if (!r) return null;
	let i = new URL(r.url, window.location.href);
	return i.searchParams.set("resource", n), i.searchParams.set("path", e.path), i.toString();
}, Re = (e, t) => e.selection === "none" ? t === null : !t || e.selection === "file" && t.directory || e.selection === "image" && (t.directory || !t.mimeType?.startsWith("image/")) ? !1 : t.capabilities?.[e.requires] !== !1, ze = /* @__PURE__ */ new Set([
	"doc",
	"docx",
	"xls",
	"xlsx",
	"ppt",
	"pptx",
	"odt",
	"ods",
	"odp",
	"rtf",
	"pdf"
]), Be = /* @__PURE__ */ new Set([
	"zip",
	"rar",
	"7z",
	"tar",
	"gz",
	"bz2",
	"xz"
]), Ve = (e) => e.name.includes(".") ? e.name.split(".").pop().toLowerCase() : "";
function He(e) {
	if (e.directory) return "folder";
	let t = (e.mimeType || "").toLowerCase(), n = Ve(e);
	return t.startsWith("image/") ? "image" : t.startsWith("audio/") ? "audio" : t.startsWith("video/") ? "video" : t.startsWith("text/") || t.includes("document") || t.includes("sheet") || t.includes("presentation") || ze.has(n) ? "document" : t.includes("zip") || t.includes("compressed") || t.includes("archive") || Be.has(n) ? "archive" : "other";
}
function Ue(e, t) {
	return t === "all" ? e : e.filter((e) => He(e) === t);
}
function We(e, t, n, r = Date.now()) {
	if (t === "none") return [{
		key: "all",
		label: "",
		entries: e
	}];
	let i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let [e, o] = Ge(a, t, n, r), s = `${e}\0${o}`;
		i.set(s, [...i.get(s) || [], a]);
	}
	return Array.from(i, ([e, t]) => {
		let [n, r] = e.split("\0");
		return {
			key: n,
			label: r,
			entries: t
		};
	});
}
function Ge(e, t, n, r) {
	if (t === "type") {
		let t = He(e);
		return [t, t];
	}
	if (t === "name") {
		let t = e.name.trim().charAt(0).toUpperCase();
		return /^[A-H]$/.test(t) ? ["name-a-h", "A–H"] : /^[I-P]$/.test(t) ? ["name-i-p", "I–P"] : /^[Q-Z]$/.test(t) ? ["name-q-z", "Q–Z"] : /^[0-9]$/.test(t) ? ["name-number", "0–9"] : ["name-other", "#"];
	}
	if (t === "size") return e.directory ? ["folder", "folder"] : e.size === 0 ? ["empty-size", "emptySize"] : e.size < 1048576 ? ["small", "smallFiles"] : e.size < 104857600 ? ["medium", "mediumFiles"] : ["large", "largeFiles"];
	if (t === "tags") {
		let t = n[e.path]?.[0];
		return t ? [`tag-${t.toLocaleLowerCase()}`, t] : ["untagged", "untagged"];
	}
	let i = Math.max(0, r - e.modifiedAt * 1e3);
	return i < 864e5 ? ["today", "today"] : i < 6048e5 ? ["this-week", "thisWeek"] : i < 26784e5 ? ["this-month", "thisMonth"] : ["earlier", "earlier"];
}
//#endregion
//#region src/App.tsx
var Ke = (0, _.lazy)(() => import("./ImageEditor-DS0tdHUd.js").then((e) => ({ default: e.ImageEditor }))), qe = (0, _.lazy)(() => import("./ImageProcessDialog-DvreG9XB.js").then((e) => ({ default: e.ImageProcessDialog }))), Je = (0, _.lazy)(() => import("./SecurityStatusDialog-BCJGJBZr.js").then((e) => ({ default: e.SecurityStatusDialog }))), Ye = (0, _.lazy)(() => import("./DocumentPreviewPane-DhmHG-pU.js")), Xe = (0, _.lazy)(() => import("./SettingsDialog-CBeIvSUg.js").then((e) => ({ default: e.SettingsDialog }))), Ze = (0, _.lazy)(() => import("./DestinationDialog-_vPHUvHt.js").then((e) => ({ default: e.DestinationDialog }))), Qe = (0, _.lazy)(() => import("./BulkRenameDialog-CpYqUNbh.js").then((e) => ({ default: e.BulkRenameDialog }))), $e = (0, _.lazy)(() => import("./TrashDialog-B7Isdie0.js").then((e) => ({ default: e.TrashDialog }))), et = (0, _.lazy)(() => import("./TagsDialog-DgzGQFxx.js").then((e) => ({ default: e.TagsDialog }))), tt = (0, _.lazy)(() => import("./FolderTree-BH9KXooH.js").then((e) => ({ default: e.FolderTree }))), nt = (0, _.lazy)(() => import("./DetailsPanel-Bn1jENLP.js").then((e) => ({ default: e.DetailsPanel }))), rt = (0, _.lazy)(() => import("./ShareDialog-DOqdA2sG.js")), it = (0, _.lazy)(() => import("./FavoritesPage-B3df6J_M.js")), at = (0, _.lazy)(() => import("./RecentPage-E7b8zcwP.js")), ot = (0, _.lazy)(() => import("./MetadataSidebarPanels-CtA4heON.js").then((e) => ({ default: e.QuickAccessPanel }))), st = (0, _.lazy)(() => import("./MetadataSidebarPanels-CtA4heON.js").then((e) => ({ default: e.FavoritesPanel }))), ct = (0, _.lazy)(() => import("./MetadataSidebarPanels-CtA4heON.js").then((e) => ({ default: e.RecentPanel }))), lt = (0, _.lazy)(() => import("./ContextMenu-B5qP5e8D.js").then((e) => ({ default: e.ContextMenu }))), ut = (0, _.lazy)(() => import("./UploadQueue-xAGgFoMh.js").then((e) => ({ default: e.UploadQueue }))), dt = (0, _.lazy)(() => import("./ImagePreviewPane-D5O_-Lqv.js")), ft = (0, _.lazy)(() => import("./AssetMetadataDialog-nI-9C5A1.js").then((e) => ({ default: e.AssetMetadataDialog }))), pt = (0, _.lazy)(() => import("./AssetSearchDialog-CjUBVpG6.js").then((e) => ({ default: e.AssetSearchDialog }))), mt = () => {
	let e = localStorage.getItem("sofinder.groupMode.v1");
	return e === "name" || e === "type" || e === "size" || e === "modified" || e === "tags" ? e : "none";
}, ht = () => {
	let e = localStorage.getItem("sofinder.typeFilter.v1");
	return e === "folder" || e === "image" || e === "document" || e === "audio" || e === "video" || e === "archive" || e === "other" ? e : "all";
}, gt = () => localStorage.getItem("sofinder.detailsPane.v1") !== "hidden";
function _t({ config: e, initialMessages: t }) {
	let n = (0, _.useId)(), s = (0, _.useMemo)(() => new i(e), [e]), d = e.uiDefaults.mode ?? (e.selectMode ? "picker" : "manager"), f = d === "picker" ? e.pickerResource ?? null : null, p = e.featureAvailability ?? k, [m, h] = (0, _.useState)(() => {
		let t = localStorage.getItem("sofinder.language");
		return t === "en" || t === "zh-cn" || t === "zh-tw" ? t : e.language;
	}), [g, y] = (0, _.useState)(t), b = (0, _.useMemo)(() => ee(g), [g]), S = (0, _.useMemo)(() => new Intl.DateTimeFormat(m, {
		dateStyle: "medium",
		timeStyle: "short"
	}), [m]), [w, ie] = (0, _.useState)([]), { resource: T, setResource: ae, path: E, setPath: ce, resolvedPath: Te, setResolvedPath: Me, entries: Ne, setEntries: ze, search: Be, setSearch: Ve, searchMode: He, setSearchMode: Ge, sort: _t, setSort: yt, direction: bt, setDirection: xt, offset: St, setOffset: Ct, total: wt, setTotal: Tt, pageCursor: Et, setPageCursor: Dt, nextCursor: Ot, setNextCursor: kt, cursorHistory: At, setCursorHistory: jt, pageSize: Mt, setPageSize: Nt, pageSizeDraft: Pt, setPageSizeDraft: Ft, pageSizeRef: It, view: Lt, setView: Rt, loading: zt, setLoading: Bt, notice: Vt, setNotice: Ht, directoryCapabilities: Ut, setDirectoryCapabilities: Wt, loadSequence: Gt, historyReady: Kt, restoringHistory: qt, searchInitialized: Jt } = Ae(e.resource, e.initialPath || ""), [Yt, Xt] = (0, _.useState)({
		favorites: [],
		quickAccess: [],
		quickAccessEntries: [],
		tags: {},
		recent: []
	}), [Zt, Qt] = (0, _.useState)({}), [A, $t] = (0, _.useState)(() => {
		let e = new URL(window.location.href).searchParams.get("collection");
		return e === "favorites" || e === "recent" ? e : null;
	}), [en, tn] = (0, _.useState)(null), [nn, rn] = (0, _.useState)(() => e.uiDefaults.fullTools ? {
		resize: !0,
		crop: !0,
		rotate: !0,
		presets: !0,
		process: !0,
		batchRename: !0
	} : he()), [j, an] = (0, _.useState)(() => {
		let t = me("sofinder.features.v2", {
			...fe,
			folderTree: e.featureDefaults?.folderTree ?? !1
		});
		return {
			...t,
			folderTree: p.folderTree !== !1 && t.folderTree,
			recent: p.recent !== !1 && t.recent,
			favorites: p.favorites !== !1 && t.favorites,
			quickAccessFiles: !1,
			tags: p.tags !== !1 && t.tags,
			archive: p.archive !== !1 && t.archive,
			trash: p.trash !== !1 && t.trash,
			qrCode: p.qrCode !== !1 && t.qrCode
		};
	}), [on, sn] = (0, _.useState)(() => me("sofinder.listColumns.v1", pe)), [cn, ln] = (0, _.useState)(Oe), [un, dn] = (0, _.useState)(ge), [fn, pn] = (0, _.useState)(() => D(ye())), [mn, hn] = (0, _.useState)(null), gn = fn.right.includes("folderNavigation") ? "right" : "left", [_n, vn] = (0, _.useState)(gt), [yn, bn] = (0, _.useState)(be), [xn, Sn] = (0, _.useState)(!1), [Cn, wn] = (0, _.useState)(!1), [Tn, M] = (0, _.useState)(!1), [En, Dn] = (0, _.useState)(!1), [On, kn] = (0, _.useState)(!1), [An, jn] = (0, _.useState)({
		left: 0,
		top: 0
	}), [Mn, Nn] = (0, _.useState)(mt), [Pn, Fn] = (0, _.useState)(ht), [In, Ln] = (0, _.useState)(() => _e(e.uiDefaults?.scale ?? "standard")), [Rn, zn] = (0, _.useState)(() => ve(e.uiDefaults.uploadConflictStrategy ?? "ask")), Bn = e.uiDefaults.lowercaseUploadExtensions ?? !0, { destinationDialog: Vn, setDestinationDialog: Hn, bulkRenameOpen: Un, setBulkRenameOpen: Wn } = je(), [Gn, Kn] = (0, _.useState)(!1), [qn, Jn] = (0, _.useState)(0), [Yn, Xn] = (0, _.useState)(!1), [Zn, Qn] = (0, _.useState)(null), [$n, er] = (0, _.useState)(null), [tr, nr] = (0, _.useState)(null), [rr, ir] = (0, _.useState)(!1), [ar, or] = (0, _.useState)(!1), [sr, cr] = (0, _.useState)(null), [lr, ur] = (0, _.useState)(null), [N, dr] = (0, _.useState)(null), [fr, pr] = (0, _.useState)(null), [mr, hr] = (0, _.useState)(null), [gr, _r] = (0, _.useState)(null), [vr, yr] = (0, _.useState)({}), [br, xr] = (0, _.useState)({
		driver: "",
		formats: []
	}), [Sr, Cr] = (0, _.useState)([]), [wr, Tr] = (0, _.useState)({
		enabled: !1,
		defaultTtlSeconds: 300,
		maxTtlSeconds: 3600
	}), [Er, Dr] = (0, _.useState)(!1), [Or, kr] = (0, _.useState)([
		"en",
		"zh-cn",
		"zh-tw"
	]), [Ar, jr] = (0, _.useState)(!1), [Mr, Nr] = (0, _.useState)(!1), [Pr, Fr] = (0, _.useState)(() => new URL(window.location.href).searchParams.has("asset_q")), [Ir, Lr] = (0, _.useState)(null), [Rr, zr] = (0, _.useState)(() => Ee("left")), [Br, Vr] = (0, _.useState)(() => Ee("right")), Hr = (0, _.useRef)(null), Ur = (0, _.useRef)(null), Wr = (0, _.useRef)(null), Gr = (0, _.useRef)(null), Kr = (0, _.useRef)(null), qr = (0, _.useRef)(null), Jr = (0, _.useRef)(null), Yr = (0, _.useRef)(null), Xr = (0, _.useRef)(null), Zr = (0, _.useRef)(null), Qr = (0, _.useRef)(null), $r = (0, _.useRef)(null), ei = (0, _.useRef)(T), ti = (0, _.useRef)({}), ni = (0, _.useRef)({}), ri = (0, _.useRef)(null);
	(0, _.useEffect)(() => {
		let t = {
			accent: "--sf-accent",
			background: "--sf-bg",
			panel: "--sf-panel",
			text: "--sf-text",
			muted: "--sf-muted",
			danger: "--sf-danger",
			radius: "--sf-radius"
		}, n = document.documentElement, r = Object.values(t).map((e) => [e, n.style.getPropertyValue(e)]);
		return Object.entries(t).forEach(([t, r]) => n.style.setProperty(r, e.theme[t])), () => r.forEach(([e, t]) => t ? n.style.setProperty(e, t) : n.style.removeProperty(e));
	}, [e.theme]), (0, _.useEffect)(() => (document.documentElement.dataset.sofinderScale = In, localStorage.setItem("sofinder.uiScale.v1", In), () => {
		delete document.documentElement.dataset.sofinderScale;
	}), [In]), (0, _.useEffect)(() => {
		localStorage.setItem("sofinder.uploadConflictStrategy.v1", Rn);
	}, [Rn]), (0, _.useEffect)(() => {
		localStorage.setItem("sofinder.language", m), document.documentElement.lang = m === "zh-cn" ? "zh-CN" : m === "zh-tw" ? "zh-TW" : "en";
		let e = !0;
		return x(m).then((t) => {
			e && y(t);
		}), () => {
			e = !1;
		};
	}, [m]), (0, _.useEffect)(() => {
		if (!Tn) return;
		let e = (e) => {
			e.target instanceof Node && !Jr.current?.contains(e.target) && M(!1);
		}, t = (e) => {
			e.key === "Escape" && (e.preventDefault(), M(!1), Yr.current?.focus());
		};
		return document.addEventListener("pointerdown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("keydown", t);
		};
	}, [Tn]), (0, _.useEffect)(() => {
		if (!En) return;
		let e = (e) => {
			e.target instanceof Node && !Xr.current?.contains(e.target) && Dn(!1);
		}, t = (e) => {
			e.key === "Escape" && (e.preventDefault(), Dn(!1), Zr.current?.focus());
		};
		return document.addEventListener("pointerdown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("keydown", t);
		};
	}, [En]), (0, _.useEffect)(() => {
		if (!On) return;
		let e = (e) => {
			e.target instanceof Node && !Qr.current?.contains(e.target) && !$r.current?.contains(e.target) && kn(!1);
		}, t = (e) => {
			e.key === "Escape" && (e.preventDefault(), kn(!1), Qr.current?.querySelector(":scope > button")?.focus());
		}, n = () => kn(!1);
		return document.addEventListener("pointerdown", e), document.addEventListener("keydown", t), window.addEventListener("resize", n), window.addEventListener("scroll", n, !0), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("keydown", t), window.removeEventListener("resize", n), window.removeEventListener("scroll", n, !0);
		};
	}, [On]);
	let ii = (e) => {
		if (On) {
			kn(!1);
			return;
		}
		let t = e.currentTarget.getBoundingClientRect();
		jn({
			left: Math.max(8, Math.min(t.left, window.innerWidth - 180 - 8)),
			top: t.bottom + 7
		}), kn(!0);
	}, P = (0, _.useCallback)((e) => Ht(e instanceof Error ? e.message : b("error")), [b]), ai = (0, _.useCallback)((e, t, n) => (ti.current[e] || 0) === n && (ei.current === e && Xt(t), Qt((n) => ({
		...n,
		[e]: t.quickAccessEntries
	})), !0), []), oi = (0, _.useCallback)(async (e, t = !1) => {
		if (!e || !t && (ni.current[e] || 0) > 0) return null;
		let n = (ti.current[e] || 0) + 1;
		ti.current[e] = n;
		let r = await s.metadata(e);
		return ai(e, r, n), r;
	}, [s, ai]), si = (0, _.useCallback)(async (e, t, n, r = {}) => {
		let i = (ti.current[e] || 0) + 1;
		ti.current[e] = i, ni.current[e] = (ni.current[e] || 0) + 1;
		try {
			let a = await s.updateMetadata(e, t, n, r);
			return ai(e, a, i), ri.current?.postMessage({ resource: e }), a;
		} finally {
			ni.current[e] = Math.max(0, (ni.current[e] || 1) - 1), ni.current[e] === 0 && (ti.current[e] || 0) !== i && oi(e, !0).catch(P);
		}
	}, [
		s,
		ai,
		oi,
		P
	]);
	(0, _.useEffect)(() => {
		ei.current = T;
	}, [T]), (0, _.useEffect)(() => {
		if (!("BroadcastChannel" in window)) return;
		let e;
		try {
			e = new BroadcastChannel("sofinder-metadata-v1");
		} catch {
			return;
		}
		return ri.current = e, e.onmessage = (e) => {
			let t = typeof e.data?.resource == "string" ? e.data.resource : "";
			t && oi(t).catch(P);
		}, () => {
			ri.current = null, e.close();
		};
	}, [oi, P]);
	let ci = (0, _.useCallback)((e) => new Promise((t) => {
		Hr.current?.(!1), Hr.current = t, er(e);
	}), []), li = (e) => {
		let t = Hr.current;
		Hr.current = null, er(null), t?.(e);
	}, ui = (0, _.useCallback)((e) => new Promise((t) => {
		Ur.current?.("skip"), Ur.current = t, nr(e);
	}), []), di = (e) => {
		let t = Ur.current;
		Ur.current = null, nr(null), t?.(e);
	}, F = (0, _.useCallback)(async (e = T, t = E, n = Be, i = St, a = _t, o = bt, c = He, l = Et) => {
		if (!e) return "error";
		let u = ++Gt.current;
		Bt(!0), Ht("");
		try {
			let r = await s.list(e, t, n, a, o, i, It.current, c, l);
			return u === Gt.current ? (ze(r.entries), ce(r.path), Me(r.path), Ct(r.offset), Tt(r.total), Dt(l), kt(r.nextCursor ?? null), Wt(r.capabilities || {}), Ni(/* @__PURE__ */ new Set()), L(null), "ok") : "stale";
		} catch (n) {
			if (u !== Gt.current) return "stale";
			if (n instanceof r && n.code === "not_found" && t !== "") try {
				let t = await s.list(e, "", "", a, o, 0, It.current, "name", null);
				return u === Gt.current ? (ze(t.entries), ce(t.path), Me(t.path), Ct(t.offset), Tt(t.total), Dt(null), kt(t.nextCursor ?? null), Wt(t.capabilities || {}), Ni(/* @__PURE__ */ new Set()), L(null), jt([]), Ht(b("missingPathFallback")), "not_found") : "stale";
			} catch (e) {
				n = e;
			}
			return ze([]), ce(t), Ct(i), Tt(null), Dt(l), kt(null), Wt({}), Ni(/* @__PURE__ */ new Set()), L(null), P(n), "error";
		} finally {
			u === Gt.current && Bt(!1);
		}
	}, [
		s,
		bt,
		St,
		Et,
		E,
		P,
		T,
		Be,
		He,
		_t,
		b
	]), I = w.find((e) => e.name === T), fi = E === "" ? 0 : E.split("/").length, { uploads: pi, uploadsCollapsed: mi, setUploadsCollapsed: hi, uploadInput: gi, directoryUploadInput: _i, upload: vi, uploadTo: yi, uploadDirectory: bi, cancelUpload: xi, cancelAllUploads: Si, removeUploadTask: Ci, retryUpload: wi, clearFinishedUploads: Ti } = Pe({
		api: s,
		resource: T,
		path: E,
		currentResource: I,
		currentDepth: fi,
		autoCollapse: j.autoCollapseUploads,
		conflictStrategy: Rn,
		lowercaseExtensions: Bn,
		t: b,
		ask: ci,
		chooseConflict: ui,
		reload: async () => {
			await F();
		},
		setNotice: Ht,
		report: P
	});
	(0, _.useEffect)(() => {
		s.configData().then(({ resources: t, plugins: n, imagePresets: r, imageCapabilities: i, signedUrls: a, assetCatalog: o, assetSearch: s, assetUsage: c }) => {
			let l = f === null ? t : t.filter((e) => e.name === f);
			ie(l), Cr(n || []), Dr(o?.enabled === !0), kr(o?.altLocales?.length ? o.altLocales : [
				"en",
				"zh-cn",
				"zh-tw"
			]), jr(s?.enabled === !0), Nr(c?.enabled === !0), yr(r || {}), xr(i || {
				driver: "",
				formats: []
			}), Tr(a || {
				enabled: !1,
				defaultTtlSeconds: 300,
				maxTtlSeconds: 3600
			});
			let u = f ?? (l.some((t) => t.name === e.resource) ? e.resource : l[0]?.name || "");
			ae(u), u && (jt([]), F(u, e.initialPath || "", "", 0, _t, bt, "name", null));
		}).catch(P);
	}, [
		s,
		e.initialPath,
		e.resource,
		f
	]), (0, _.useEffect)(() => {
		let t = () => {
			let t = new URL(window.location.href), n = f ?? (t.searchParams.get("type") || e.resource), r = t.searchParams.get("path") || "", i = t.searchParams.get("collection"), a = i === "favorites" || i === "recent" ? i : null;
			qt.current = !0, ae(n), $t(a), Ve(""), Ge("name"), jt([]), a === null && F(n, r, "", 0, "name", "asc", "name", null);
		};
		return window.addEventListener("popstate", t), () => window.removeEventListener("popstate", t);
	}, [
		e.resource,
		F,
		f
	]), (0, _.useEffect)(() => {
		if (!T || zt) return;
		let e = new URL(window.location.href), t = e.searchParams.get("type") || "", n = e.searchParams.get("path") || "", r = e.searchParams.get("collection");
		if (t === T && n === E && (r === "favorites" || r === "recent" ? r : null) === A) {
			Kt.current = !0, qt.current = !1;
			return;
		}
		e.searchParams.set("type", T), E ? e.searchParams.set("path", E) : e.searchParams.delete("path"), A ? e.searchParams.set("collection", A) : e.searchParams.delete("collection");
		let i = {
			...window.history.state || {},
			sofinder: {
				resource: T,
				path: E,
				collection: A
			}
		};
		!Kt.current || qt.current ? window.history.replaceState(i, "", e) : window.history.pushState(i, "", e), Kt.current = !0, qt.current = !1;
	}, [
		A,
		zt,
		E,
		T
	]), (0, _.useEffect)(() => {
		if (!Jt.current) {
			Jt.current = !0;
			return;
		}
		if (A) return;
		let e = window.setTimeout(() => {
			T && (jt([]), F(T, E, Be, 0, _t, bt, He, null));
		}, 250);
		return () => window.clearTimeout(e);
	}, [Be, He]), (0, _.useEffect)(() => {
		if (T) {
			if (!j.recent && !j.favorites && p.quickAccess === !1 && !j.tags) {
				Xt({
					favorites: [],
					quickAccess: [],
					quickAccessEntries: [],
					tags: {},
					recent: []
				});
				return;
			}
			oi(T).catch(P);
		}
	}, [
		p.quickAccess,
		j.favorites,
		j.recent,
		j.tags,
		oi,
		P,
		T
	]), (0, _.useEffect)(() => {
		p.quickAccess === !1 || !j.sidebarQuickAccess || yn !== "all" || Promise.all(w.filter((e) => e.name !== T).map((e) => oi(e.name))).catch(P);
	}, [
		p.quickAccess,
		j.sidebarQuickAccess,
		oi,
		yn,
		P,
		T,
		w
	]), (0, _.useEffect)(() => {
		if (p.quickAccess === !1 || !j.sidebarQuickAccess) return;
		let e = window.setInterval(() => Object.entries(Zt).forEach(([e, t]) => {
			t.length > 0 && oi(e).catch(P);
		}), 6e4);
		return () => window.clearInterval(e);
	}, [
		p.quickAccess,
		j.sidebarQuickAccess,
		oi,
		Zt,
		P
	]), (0, _.useEffect)(() => {
		!j.favorites && A === "favorites" && $t(null), !j.recent && A === "recent" && $t(null);
	}, [
		A,
		j.favorites,
		j.recent
	]), (0, _.useEffect)(() => {
		let e = (e) => {
			let t = Array.from(e.clipboardData?.files || []);
			t.length > 0 && A === null && !I?.readOnly && Ut.upload !== !1 && (e.preventDefault(), vi(t));
		};
		return window.addEventListener("paste", e), () => window.removeEventListener("paste", e);
	}, [
		A,
		I?.readOnly,
		Ut.upload,
		vi
	]);
	let Ei = (0, _.useMemo)(() => E === "" ? [] : E.split("/"), [E]), Di = (0, _.useCallback)((e) => {
		j.recent && si(T, e.path, "touch").catch(P);
	}, [
		j.recent,
		si,
		P,
		T
	]), Oi = (0, _.useMemo)(() => Ue(Ne, Pn), [Ne, Pn]), ki = Mn === "tags" && !j.tags ? "none" : Mn, Ai = (0, _.useMemo)(() => We(Oi, ki, Yt.tags), [
		Oi,
		ki,
		Yt.tags
	]), ji = (0, _.useMemo)(() => Ai.flatMap((e) => e.entries), [Ai]), { selectedPaths: Mi, setSelectedPaths: Ni, selectionAnchor: Pi, setSelectionAnchor: L, selectedEntries: R, selected: z, selectEntry: Fi } = ke(ji, d === "picker", Di), Ii = (e) => br.formats.find((t) => e.mimeType !== null && t.mimes.includes(e.mimeType.toLowerCase())), Li = (e) => !!(e && Ii(e)?.thumbnail), Ri = (e) => !!(e && Ii(e)?.edit), zi = R.filter((e) => Ri(e)), Bi = (t) => !!(t && !t.directory && t.url && (e.selectionKind !== "image" || Ii(t)?.webEmbeddable)), Vi = async (e) => {
		if (e.directory) return null;
		if (I?.entryUrlConfigured && e.url) return {
			url: new URL(e.url, document.baseURI).href,
			loginRequired: !0
		};
		if (wr.enabled && I?.deliveryMode === "proxy") {
			let t = await s.signedUrl(T, e.path, wr.defaultTtlSeconds);
			return {
				url: t.url,
				loginRequired: !1,
				expiresAt: t.expiresAt
			};
		}
		return {
			url: new URL(e.url || s.downloadUrl(T, e.path), document.baseURI).href,
			loginRequired: !e.url
		};
	}, Hi = async (e) => {
		try {
			let t = await Vi(e);
			t && _r({
				...t,
				fileName: e.name
			});
		} catch (e) {
			P(e);
		}
	}, Ui = async (e) => {
		try {
			let t = await s.resolveAsset(T, e.path);
			if (!t.asset.assetId) return;
			Lr(await s.asset(t.asset.assetId));
		} catch (e) {
			P(e);
		}
	}, Wi = (e) => R.length > 0 && R.every((t) => t.capabilities?.[e] !== !1), Gi = (e) => !!(e && !e.directory), Ki = (e) => !!e?.directory, qi = (0, _.useMemo)(() => Sr.flatMap((e) => (e.uiActions || []).map((t) => ({
		...t,
		plugin: e.name
	}))), [Sr]), Ji = (0, _.useMemo)(() => Sr.flatMap((e) => (e.previewers || []).map((t) => ({
		...t,
		plugin: e.name
	}))), [Sr]), Yi = (e, t) => {
		if (!Re(e, t)) return;
		let n = new URL(e.url, document.baseURI);
		n.searchParams.set("resource", T), n.searchParams.set("directory", E), t && n.searchParams.set("path", t.path), window.open(n, "_blank", "noopener");
	};
	(0, _.useEffect)(() => {
		if (tn(null), !z || !Ii(z)?.read) return;
		let e = !0;
		return s.imageInfo(T, z.path).then((t) => {
			e && tn(t);
		}).catch((t) => {
			e && P(t);
		}), () => {
			e = !1;
		};
	}, [
		s,
		T,
		z?.path,
		z?.mimeType,
		P
	]), (0, _.useEffect)(() => {
		if (pr(null), hr(null), p.textPreview === !1 || !N || !vt(N.mimeType)) return;
		let e = !0;
		return s.textPreview(T, N.path).then((t) => {
			e && pr({
				path: N.path,
				content: t.content,
				truncated: t.truncated
			});
		}).catch((t) => {
			e && P(t);
		}), () => {
			e = !1;
		};
	}, [
		s,
		p.textPreview,
		N?.path,
		N?.mimeType,
		P,
		T
	]);
	let Xi = (e) => {
		e.directory ? (jt([]), F(T, e.path, Be, 0, _t, bt, He, null)) : ra(e);
	}, Zi = async () => {
		I && Qn({
			kind: "folder",
			title: b("newFolder"),
			label: b("folderName"),
			initial: "",
			maximum: I.maxFolderNameLength
		});
	}, Qi = async () => {
		if (!z || !I) return;
		let e = z.directory ? -1 : z.name.lastIndexOf("."), t = e > 0 ? z.name.slice(e) : "", n = t ? z.name.slice(0, e) : z.name, r = z.directory ? I.maxFolderNameLength : I.maxFileNameLength;
		Qn({
			kind: "rename",
			title: b("rename"),
			label: b(t ? "newBaseName" : "newName"),
			initial: n,
			maximum: r,
			extension: t
		});
	}, $i = async () => {
		if (R.length === 0) return;
		let e = "";
		if (Mr) try {
			let t = await s.checkAssetDeletion(T, R.map((e) => e.path));
			t.complete === !1 ? e = b("assetDeleteCheckIncomplete") : t.safe || (e = `${b("assetUsedWarning").replace("{count}", String(t.total))} ${t.assets.flatMap((e) => e.usages.slice(0, 3).map((e) => e.label)).slice(0, 3).join("、")}`);
		} catch (e) {
			P(e);
			return;
		}
		let t = I?.storageCapabilities?.recoverableDelete === !1 ? b("permanentDeleteWarning") : b("trashRetention");
		if (await ci({
			title: b("remove"),
			message: R.length === 1 ? b("confirmDelete") : `${b("confirmDeleteMany")} ${R.length}`,
			detail: e ? `${e}\n${t}` : t,
			danger: !0
		})) try {
			let e = await s.batch("delete", T, R.map((e) => e.path)), t = e.failed === 0 ? `${e.succeeded} ${b("completed")}` : `${e.succeeded} ${b("completed")}, ${e.failed} ${b("failed")}`;
			await F(), Ht(e.purgedItems > 0 ? `${t} · ${b("trashAutoPurged")} ${e.purgedItems} ${b("items")} (${u(e.purgedBytes)})` : t);
		} catch (e) {
			P(e);
		}
	}, ea = async (e) => {
		Wn(!1);
		try {
			let t = await s.batchRename(T, e);
			await F(), Ht(t.failed === 0 ? `${t.succeeded} ${b("completed")}` : `${t.succeeded} ${b("completed")}, ${t.failed} ${b("failed")}`);
		} catch (e) {
			P(e);
		}
	}, ta = async (e, t) => {
		try {
			let n = await s.batch(e, T, R.map((e) => e.path), t);
			Hn(null), await F(), Ht(n.failed === 0 ? `${n.succeeded} ${b("completed")}` : `${n.succeeded} ${b("completed")}, ${n.failed} ${b("failed")}`);
		} catch (e) {
			P(e);
		}
	}, na = async (e, t) => {
		Hn({
			operation: e,
			path: t,
			folders: [],
			loading: !0
		});
		try {
			let n = await s.list(T, t, "", "name", "asc", 0, 500);
			Hn({
				operation: e,
				path: n.path,
				folders: n.entries.filter((e) => e.directory),
				loading: !1
			});
		} catch (n) {
			if (n instanceof r && n.code === "not_found" && t !== "") try {
				let t = await s.list(T, "", "", "name", "asc", 0, 500);
				Hn({
					operation: e,
					path: t.path,
					folders: t.entries.filter((e) => e.directory),
					loading: !1
				}), Ht(b("missingDestinationFallback"));
				return;
			} catch (e) {
				n = e;
			}
			Hn((e) => e ? {
				...e,
				loading: !1
			} : null), P(n);
		}
	}, ra = async (t = z) => {
		if (f !== null && T !== f) return;
		if (!Bi(t)) {
			t && e.selectionKind === "image" && Ht(b("webImageUnsupported"));
			return;
		}
		if (!t?.url) return;
		let n = t === z ? en : null;
		if (Ii(t)?.read && n === null) try {
			n = await s.imageInfo(T, t.path);
		} catch {
			n = null;
		}
		let r = {
			...t,
			resource: T,
			url: t.url,
			width: n?.width ?? null,
			height: n?.height ?? null
		};
		if (Er) try {
			r = {
				...r,
				...(await s.resolveAsset(T, t.path)).asset
			};
		} catch {}
		if (e.ckeditorFunction > 0) {
			(window.opener || window.parent).CKEDITOR?.tools?.callFunction?.(e.ckeditorFunction, t.url), window.close();
			return;
		}
		if (e.pickerRequestId && e.pickerOrigin) {
			(window.opener || (window.parent === window ? null : window.parent))?.postMessage({
				type: "sofinder:select",
				version: "1.0",
				requestId: e.pickerRequestId,
				entry: r
			}, e.pickerOrigin), window.opener && window.close();
			return;
		}
		window.dispatchEvent(new CustomEvent("sofinder:select", { detail: r }));
	}, ia = () => {
		Ni(new Set(ji.map((e) => e.path))), L(null);
	}, aa = () => {
		Ni(/* @__PURE__ */ new Set()), L(null);
	}, oa = () => {
		Ni((e) => new Set(ji.filter((t) => !e.has(t.path)).map((e) => e.path))), L(null);
	}, sa = async (e, t = 0, n = 0) => {
		if (!(!z || !Ri(z))) {
			Bt(!0);
			try {
				let r = e === 0 ? [{
					type: "resize",
					width: t,
					height: n
				}] : [{
					type: "rotate",
					degrees: e
				}], i = await s.applyImageActions(T, z.path, r, { mode: "copy" });
				Ht(`${b("imageCreated")}: ${i.entry.name} · ${i.result.width} × ${i.result.height} px`), await F();
			} catch (e) {
				P(e), Bt(!1);
			}
		}
	}, ca = () => {
		!z || !en || (Jn(Date.now()), Kn(!0));
	}, la = (e, t) => {
		rn((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.tools.v3", JSON.stringify(r)), r;
		});
	}, ua = (e, t) => {
		(e === "autoCollapseUploads" || e === "sidebarFavorites" || e === "sidebarQuickAccess" || p[e] !== !1) && an((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.features.v2", JSON.stringify(r)), r;
		});
	}, da = (e, t) => {
		sn((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.listColumns.v1", JSON.stringify(r)), r;
		});
	}, fa = (e, t) => {
		dn((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.viewSizes.v1", JSON.stringify(r)), r;
		});
	}, pa = (e) => {
		pn((t) => {
			let n = e(t);
			return O(n), localStorage.setItem("sofinder.folderNavigation.position.v1", n.right.includes("folderNavigation") ? "right" : "left"), n;
		});
	}, ma = (e, t, n = null, r = !0) => {
		pa((i) => {
			let a = {
				left: i.left.filter((t) => t !== e),
				right: i.right.filter((t) => t !== e)
			}, o = n === null ? -1 : a[t].indexOf(n), s = o < 0 ? a[t].length : o + +!!r;
			return a[t].splice(s, 0, e), a;
		});
	}, ha = (e, t) => {
		pa((n) => {
			let r = n.right.includes(e) ? "right" : "left";
			if (t === "ArrowLeft" || t === "ArrowRight") {
				let i = t === "ArrowLeft" ? "left" : "right";
				if (i === r) return n;
				let a = {
					left: n.left.filter((t) => t !== e),
					right: n.right.filter((t) => t !== e)
				};
				return a[i].push(e), a;
			}
			let i = [...n[r]], a = i.indexOf(e), o = t === "Home" ? 0 : t === "End" ? i.length - 1 : t === "ArrowUp" ? Math.max(0, a - 1) : Math.min(i.length - 1, a + 1);
			return a < 0 || o === a ? n : (i.splice(a, 1), i.splice(o, 0, e), {
				...n,
				[r]: i
			});
		});
	}, ga = (e) => {
		ma("folderNavigation", e);
	}, _a = (e) => {
		vn(e), localStorage.setItem("sofinder.detailsPane.v1", e ? "visible" : "hidden");
	}, va = async () => {
		if (R.length !== 0) try {
			let e = await s.downloadArchive(T, R.map((e) => e.path)), t = URL.createObjectURL(e), n = document.createElement("a");
			n.href = t, n.download = "sofinder-download.zip", n.click(), window.setTimeout(() => URL.revokeObjectURL(t), 1e3);
		} catch (e) {
			P(e);
		}
	}, ya = async (e = z) => {
		if (Gi(e)) try {
			await si(T, e.path, "favorite", { favorite: !Yt.favorites.includes(e.path) });
		} catch (e) {
			P(e);
		}
	}, ba = async (e = z) => {
		if (Ki(e)) try {
			await si(T, e.path, "quick_access", { pinned: !Yt.quickAccess.includes(e.path) });
		} catch (e) {
			P(e);
		}
	}, xa = async () => {
		z && or(!0);
	}, Sa = async (e) => {
		let t = Zn;
		if (Qn(null), t) try {
			if (t.kind === "folder") await s.createFolder(T, E, e);
			else if (t.kind === "rename" && z && e !== z.name) await s.rename(T, z.path, e);
			else if (t.kind === "resize") {
				let t = /^(\d{1,4})[x×](\d{1,4})$/i.exec(e.replace(/\s/g, ""));
				if (!t) {
					Ht(b("invalidDimensions"));
					return;
				}
				await sa(0, Number(t[1]), Number(t[2]));
			}
			(t.kind === "folder" || t.kind === "rename") && await F();
		} catch (e) {
			P(e);
		}
	}, Ca = async (e) => {
		let t = e.includes("/") ? e.slice(0, e.lastIndexOf("/")) : "", n = e.split("/").pop() || e;
		try {
			if (!(await s.list(T, t, n, "name", "asc", 0, 500)).entries.some((t) => t.path === e)) {
				await si(T, e, "forget"), Ht(b("recentMissing"));
				return;
			}
			await F(T, t, "", 0), Ni(/* @__PURE__ */ new Set([e]));
		} catch (t) {
			if (t instanceof r && t.code === "not_found") {
				try {
					await si(T, e, "forget");
				} catch (e) {
					P(e);
					return;
				}
				Ht(b("recentMissing"));
				return;
			}
			P(t);
		}
	}, wa = (e) => {
		Rt(e), localStorage.setItem("sofinder.view", e);
	}, Ta = (e) => {
		let t = sr?.entry ?? null;
		if (cr(null), e.startsWith("plugin:")) {
			let n = qi.find((t) => `plugin:${t.plugin}:${t.id}` === e);
			n && Yi(n, t);
			return;
		}
		e === "open" && t?.directory ? Xi(t) : e === "preview" && t && !t.directory ? dr(t) : e === "select" && t ? ra(t) : e === "rename" ? Qi() : e === "copy" ? na("copy", E) : e === "move" ? na("move", E) : e === "delete" ? $i() : e === "favorite" && t ? ya(t) : e === "quick-access" && t ? ba(t) : e === "download" && t && !t.directory ? window.open(t.url || s.downloadUrl(T, t.path), "_blank", "noopener,noreferrer") : e === "share" && t && !t.directory ? Hi(t) : e === "asset-metadata" && t && !t.directory && Ui(t);
	}, Ea = (e) => {
		window.requestAnimationFrame(() => {
			document.querySelector(`button.sf-entry[data-entry-index="${e}"]`)?.focus();
		});
	}, Da = (e, t, n = !1) => {
		let r = xe[e], i = Math.round(Math.max(r.min, Math.min(r.max, t)));
		e === "left" ? zr(i) : Vr(i), n && localStorage.setItem(`sofinder.column.${e}`, String(i));
	}, Oa = (e, t) => {
		t.preventDefault(), t.currentTarget.setPointerCapture(t.pointerId), t.currentTarget.classList.add("is-resizing");
		let n = e === "left" ? Rr : Br;
		Gr.current = {
			side: e,
			startX: t.clientX,
			startWidth: n,
			currentWidth: n,
			element: t.currentTarget
		};
	}, ka = (e) => {
		let t = Gr.current;
		if (!t) return;
		let n = e.clientX - t.startX, r = xe[t.side];
		t.currentWidth = Math.round(Math.max(r.min, Math.min(r.max, t.startWidth + (t.side === "left" ? n : -n)))), Da(t.side, t.currentWidth);
	}, Aa = () => {
		let e = Gr.current;
		Gr.current = null, e && (e.element.classList.remove("is-resizing"), Da(e.side, e.currentWidth, !0));
	}, ja = (e, t) => {
		let n = t.key === "ArrowLeft" ? -1 : +(t.key === "ArrowRight");
		n !== 0 && (t.preventDefault(), Da(e, (e === "left" ? Rr : Br) + (e === "left" ? n : -n) * 10, !0));
	}, Ma = (e, t, n = !1) => {
		let r = De(e, t);
		ln((t) => {
			let i = {
				...t,
				[e]: r
			};
			return n && localStorage.setItem("sofinder.listColumnWidths.v1", JSON.stringify(i)), i;
		});
	}, Na = (e, t) => {
		t.preventDefault(), t.stopPropagation(), t.currentTarget.setPointerCapture(t.pointerId), t.currentTarget.classList.add("is-resizing");
		let n = cn[e];
		Kr.current = {
			column: e,
			startX: t.clientX,
			startWidth: n,
			currentWidth: n,
			element: t.currentTarget
		};
	}, Pa = (e) => {
		let t = Kr.current;
		t && (t.currentWidth = De(t.column, t.startWidth + e.clientX - t.startX), Ma(t.column, t.currentWidth));
	}, Fa = () => {
		let e = Kr.current;
		Kr.current = null, e && (e.element.classList.remove("is-resizing"), Ma(e.column, e.currentWidth, !0));
	}, Ia = (e, t) => {
		let n = t.key === "ArrowLeft" ? -1 : +(t.key === "ArrowRight");
		n !== 0 && (t.preventDefault(), t.stopPropagation(), Ma(e, cn[e] + n * 10, !0));
	}, La = (e) => {
		let t = qr.current;
		if (!t) return;
		let n = e === "name" ? ".sf-entry-name" : e === "size" ? ".sf-entry-size" : e === "type" ? ".sf-entry-type" : ".sf-entry-modified", r = Array.from(t.querySelectorAll(n)), i = t.querySelector(`.sf-list-heading-${e} button`), a = (e) => {
			if (!e) return 0;
			let t = document.createRange();
			return t.selectNodeContents(e), Math.ceil(t.getBoundingClientRect().width);
		}, o = Math.max(a(i), ...r.map(a)) + 24;
		Ma(e, o, !0);
	}, Ra = () => {
		let t = e.uiDefaults.fullTools ? {
			resize: !0,
			crop: !0,
			rotate: !0,
			presets: !0,
			process: !0,
			batchRename: !0
		} : ue;
		Object.keys(t).forEach((e) => la(e, t[e]));
		let n = {
			...fe,
			folderTree: e.featureDefaults?.folderTree ?? !1
		};
		Object.keys(n).forEach((e) => ua(e, n[e])), Object.keys(pe).forEach((e) => da(e, pe[e])), Object.keys(de).forEach((e) => fa(e, de[e]));
		let r = Object.fromEntries(Object.keys(Se).map((e) => [e, Se[e].initial]));
		ln(r), localStorage.setItem("sofinder.listColumnWidths.v1", JSON.stringify(r)), Da("left", xe.left.initial, !0), Da("right", xe.right.initial, !0);
		let i = {
			left: [
				"folderNavigation",
				"quickAccess",
				"favorites",
				"recent"
			],
			right: []
		};
		pn(i), O(i), localStorage.setItem("sofinder.folderNavigation.position.v1", "left"), _a(!0), bn("all"), localStorage.setItem("sofinder.quickAccess.scope.v1", "all"), Ln(e.uiDefaults.scale ?? "standard"), zn(e.uiDefaults.uploadConflictStrategy ?? "ask");
	}, za = (e) => {
		let t = e.target, n = t.matches("button.sf-entry");
		if (t.isContentEditable || [
			"INPUT",
			"SELECT",
			"TEXTAREA",
			"BUTTON",
			"A"
		].includes(t.tagName) && !n) return;
		if (d === "manager" && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
			e.preventDefault(), ia();
			return;
		}
		if (e.key === "Escape") {
			e.preventDefault(), Ni(/* @__PURE__ */ new Set()), L(null);
			return;
		}
		if (d === "manager" && e.key === "Delete" && Wi("delete") && !I?.readOnly) {
			e.preventDefault(), $i();
			return;
		}
		if (d === "manager" && e.key === "F2" && R.length === 1 && Wi("rename") && !I?.readOnly) {
			e.preventDefault(), Qi();
			return;
		}
		if (e.key === "Enter" && R.length === 1) {
			e.preventDefault(), Xi(R[0]);
			return;
		}
		let r = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : +(e.key === "ArrowRight" || e.key === "ArrowDown");
		if (r !== 0 && ji.length > 0) {
			e.preventDefault();
			let t = Pi || R[0]?.path, n = t ? ji.findIndex((e) => e.path === t) : r > 0 ? -1 : ji.length, i = Math.max(0, Math.min(ji.length - 1, n + r)), a = ji[i];
			Ni(/* @__PURE__ */ new Set([a.path])), L(a.path), Ea(i);
		}
	}, Ba = Vn !== null && R.some((e) => {
		let t = e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : "", n = Vn.path === "" ? 0 : Vn.path.split("/").length;
		return Vn.operation === "move" && Vn.path === t || e.directory && I !== void 0 && n >= I.maxFolderDepth || e.directory && (Vn.path === e.path || Vn.path.startsWith(`${e.path}/`));
	}), Va = pi.some((e) => e.status === "queued" || e.status === "uploading"), Ha = pi.length === 0 ? 0 : Math.round(pi.reduce((e, t) => e + t.progress, 0) / pi.length), Ua = e.uiDefaults.fullTools === !0, Wa = e.uiDefaults.logo !== !1, Ga = I?.storageCapabilities?.recoverableDelete !== !1, Ka = p.quickAccess !== !1, qa = yn === "resource" ? Yt.quickAccessEntries.length > 0 : Object.values(Zt).some((e) => e.length > 0), Ja = (e) => e === "folderNavigation" ? j.folderTree && !!T : e === "quickAccess" ? Ka && j.sidebarQuickAccess && qa : e === "favorites" ? j.favorites && j.sidebarFavorites : j.recent, Ya = fn.left.filter(Ja), Xa = fn.right.filter(Ja), Za = (d === "manager" || Ua) && j.trash && Ga, Qa = Za && w.length <= 1 && Ya.length === 0 && !I?.readOnly && !I?.quotaBytes, $a = w.length > 1 || Ya.length > 0 || Za || !!(I?.readOnly || I?.quotaBytes) || mn !== null, eo = (e) => j.recent ? /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
		fallback: null,
		children: /* @__PURE__ */ (0, C.jsx)(ct, {
			variant: e,
			items: Yt.recent,
			currentResource: T,
			active: A === "recent",
			labels: {
				title: b("recent"),
				empty: b("recentEmpty"),
				home: b("home")
			},
			onOpen: (e) => void Ca(e),
			onOpenAll: () => so()
		})
	}) : null, to = d === "manager" || Ua, no = _n && to && R.length > 0, ro = no || Xa.length > 0 || mn !== null, B = (e, t) => /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)(a, { name: e }), /* @__PURE__ */ (0, C.jsx)("span", { children: t })] }), io = (e, t, n = Be) => {
		$t(null), jt([]), F(e, t, n, 0, _t, bt, He, null);
	}, ao = async (e, t) => {
		let n = t.includes("/") ? t.slice(0, t.lastIndexOf("/")) : "";
		Fr(!1), Ve(""), Ge("name"), ae(e), ce(n), jt([]), await F(e, n, "", 0, _t, bt, "name", null), Ni(/* @__PURE__ */ new Set([t])), L(t);
	}, oo = () => {
		Ni(/* @__PURE__ */ new Set()), L(null), Ve(""), Ge("name"), $t("favorites");
	}, so = () => {
		Ni(/* @__PURE__ */ new Set()), L(null), Ve(""), Ge("name"), $t("recent");
	}, co = async (e, t, n, i) => {
		let a = t.includes("/") ? t.slice(0, t.lastIndexOf("/")) : "", o = t.split("/").pop() || t;
		try {
			if (i === !1) throw new r(b("quickAccessRemoved"), "not_found", 404);
			let n = (await s.list(e, a, o, "name", "asc", 0, 500)).entries.find((e) => e.path === t);
			if (!n) throw new r(b("favoriteMissing"), "not_found", 404);
			if ($t(null), ae(e), n.directory) {
				if (jt([]), await F(e, n.path, "", 0, _t, bt, "name", null) === "not_found") throw new r(b("quickAccessRemoved"), "not_found", 404);
			} else await F(e, a, "", 0), Ni(/* @__PURE__ */ new Set([n.path]));
		} catch (i) {
			if (i instanceof r && i.code === "not_found") {
				try {
					await si(e, t, n, n === "favorite" ? { favorite: !1 } : { pinned: !1 });
				} catch (e) {
					P(e);
					return;
				}
				Ht(b(n === "favorite" ? "favoriteMissing" : "quickAccessRemoved"));
			} else P(i);
		}
	}, lo = async (e) => {
		try {
			await si(e.resource, e.path, "quick_access", { pinned: !1 });
		} catch (e) {
			P(e);
		}
	}, uo = async (e) => {
		try {
			await si(T, e, "favorite", { favorite: !1 });
		} catch (e) {
			P(e);
		}
	}, fo = () => {
		if (At.length === 0) return;
		let e = At.slice(0, -1), t = At[At.length - 1] ?? null;
		jt(e), F(T, E, Be, Math.max(0, St - Mt), _t, bt, He, t);
	}, V = () => {
		Ot !== null && (jt((e) => [...e, Et]), F(T, E, Be, St + Mt, _t, bt, He, Ot));
	}, H = () => {
		let e = Number(Pt);
		if (!Number.isFinite(e) || e <= 0) {
			Ft(String(Mt));
			return;
		}
		let t = we(e);
		Ft(String(t)), t !== Mt && (It.current = t, Nt(t), localStorage.setItem("sofinder.pageSize.v1", String(t)), jt([]), F(T, E, Be, 0, _t, bt, He, null));
	}, po = (e, t) => {
		let n = t && _t === e && bt === "asc" ? "desc" : "asc";
		yt(e), xt(n), jt([]), F(T, E, Be, 0, e, n, He, null);
	}, mo = (e) => {
		e !== bt && (xt(e), jt([]), F(T, E, Be, 0, _t, e, He, null));
	}, ho = (e) => {
		Nn(e), localStorage.setItem("sofinder.groupMode.v1", e);
	}, go = [
		"name",
		...on.size ? ["size"] : [],
		...on.type ? ["type"] : [],
		...on.modified ? ["modified"] : []
	], _o = `${go.map((e) => `${cn[e]}px`).join(" ")} minmax(0, 1fr)`, vo = (e) => b(e === "modified" ? "modified" : e), yo = (e) => e === "name" ? "" : `sf-list-${e}`, bo = (e, t, n = "", r = !1) => {
		let i = _t === e, o = b(bt === "asc" ? "ascending" : "descending");
		return /* @__PURE__ */ (0, C.jsxs)("div", {
			className: `sf-list-heading sf-list-heading-${e}`,
			children: [/* @__PURE__ */ (0, C.jsxs)("button", {
				type: "button",
				className: `${n}${i ? " active" : ""}`,
				disabled: I?.storageCapabilities?.sort === !1,
				"aria-pressed": i,
				"aria-label": i ? `${t}, ${o}` : t,
				onClick: () => po(e, !0),
				children: [/* @__PURE__ */ (0, C.jsx)("span", { children: t }), i && /* @__PURE__ */ (0, C.jsx)(a, { name: bt === "asc" ? "sort-asc" : "sort-desc" })]
			}), r && /* @__PURE__ */ (0, C.jsx)("div", {
				className: "sf-list-column-resizer",
				role: "separator",
				tabIndex: 0,
				"aria-label": `${b("resizeListColumn")}: ${t}`,
				title: b("autoFitListColumn"),
				"aria-orientation": "vertical",
				"aria-valuemin": Se[e].min,
				"aria-valuemax": Se[e].max,
				"aria-valuenow": cn[e],
				onPointerDown: (t) => Na(e, t),
				onPointerMove: Pa,
				onPointerUp: Fa,
				onPointerCancel: Fa,
				onKeyDown: (t) => Ia(e, t),
				onDoubleClick: (t) => {
					t.preventDefault(), t.stopPropagation(), La(e);
				}
			})]
		}, e);
	}, U = (e) => {
		let t = {
			folder: "folder",
			image: "images",
			document: "documents",
			audio: "audio",
			video: "video",
			archive: "archives",
			other: "other",
			emptySize: "emptySize",
			smallFiles: "smallFiles",
			mediumFiles: "mediumFiles",
			largeFiles: "largeFiles",
			untagged: "untagged",
			today: "today",
			thisWeek: "thisWeek",
			thisMonth: "thisMonth",
			earlier: "earlier"
		};
		return t[e] ? b(t[e]) : e;
	}, xo = {
		favorites: Yt.favorites,
		quickAccessByResource: Zt,
		resources: w,
		currentResource: T,
		quickAccessScope: yn,
		showFavorites: j.favorites && j.sidebarFavorites,
		showQuickAccess: Ka && j.sidebarQuickAccess && qa,
		favoritesActive: A === "favorites",
		labels: {
			favorites: b("favorites"),
			favoritesEmpty: b("favoritesEmpty"),
			quickAccess: b("quickAccess"),
			quickAccessEmpty: b("quickAccessEmpty"),
			home: b("home"),
			more: b("moreItems"),
			missing: b("quickAccessMissing")
		},
		onOpenFavorites: oo,
		onOpenFavorite: (e) => void co(T, e, "favorite"),
		onOpenQuickAccess: (e) => void co(e.resource, e.path, "quick_access", e.exists),
		onQuickAccessContext: (e, t) => {
			t.preventDefault(), ur({
				x: t.clientX,
				y: t.clientY,
				link: e
			});
		},
		onFavoriteContext: (e, t) => {
			t.preventDefault(), ur({
				x: t.clientX,
				y: t.clientY,
				link: {
					resource: T,
					path: e
				},
				favorite: !0
			});
		}
	}, So = (e) => b(e === "folderNavigation" ? "folderNavigation" : e === "quickAccess" ? "quickAccess" : e === "favorites" ? "favorites" : "recent"), Co = (e, t) => {
		let n = e === "folderNavigation" ? /* @__PURE__ */ (0, C.jsxs)("section", {
			className: `sf-folder-navigation-section${t === "right" ? " sf-folder-navigation-right" : ""}`,
			children: [/* @__PURE__ */ (0, C.jsx)("h2", { children: b("folderNavigation") }), /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(tt, {
					api: s,
					resource: T,
					currentPath: Te,
					rootLabel: b("home"),
					onNavigate: (e) => io(T, e, "")
				})
			})]
		}) : e === "quickAccess" ? /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, C.jsx)(ot, { ...xo })
		}) : e === "favorites" ? /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, C.jsx)(st, { ...xo })
		}) : eo("sidebar");
		return /* @__PURE__ */ (0, C.jsx)(le, {
			id: e,
			side: t,
			title: `${b("moveSidebarSection")}: ${So(e)}`,
			dragging: mn === e,
			onDragStart: hn,
			onDragEnd: () => hn(null),
			onDrop: (e, t, n) => {
				mn && ma(mn, t, e, n), hn(null);
			},
			onKeyboardMove: ha,
			children: n
		}, e);
	}, wo = (e, t) => /* @__PURE__ */ (0, C.jsxs)("div", {
		className: `sf-sidebar-sections sf-sidebar-sections-${e}${mn ? " is-dragging" : ""}`,
		"data-sidebar-dropzone": e,
		onDragOver: (e) => {
			mn && (e.preventDefault(), e.stopPropagation());
		},
		onDrop: (t) => {
			mn && (t.preventDefault(), t.stopPropagation(), ma(mn, e), hn(null));
		},
		children: [t.map((t) => Co(t, e)), mn && /* @__PURE__ */ (0, C.jsx)("div", {
			className: "sf-sidebar-drop-end",
			"aria-hidden": "true"
		})]
	});
	return /* @__PURE__ */ (0, C.jsxs)("main", {
		className: `sf-app sf-mode-${d}${$a ? "" : " sf-no-sidebar"}${ro ? "" : " sf-no-details"}${(d === "manager" || Ua) && R.length > 0 ? " sf-has-selection-actions" : ""}`,
		onKeyDown: za,
		onDragOver: (e) => e.preventDefault(),
		onDrop: (e) => {
			e.preventDefault(), A === null && e.dataTransfer.files.length && vi(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ (0, C.jsxs)("div", {
				className: `sf-commandbar ${Wa ? "sf-has-brand" : "sf-no-brand"}`,
				children: [
					Wa ? /* @__PURE__ */ (0, C.jsxs)("div", {
						className: "sf-brand",
						title: "SoFinder",
						children: [/* @__PURE__ */ (0, C.jsx)("span", {
							className: "sf-brand-mark",
							"aria-hidden": "true",
							children: "S"
						}), e.uiDefaults.header === !0 ? /* @__PURE__ */ (0, C.jsx)("strong", { children: "SoFinder" }) : /* @__PURE__ */ (0, C.jsx)("span", {
							className: "sf-sr-only",
							children: "SoFinder"
						})]
					}) : /* @__PURE__ */ (0, C.jsxs)("nav", {
						className: "sf-breadcrumb sf-command-breadcrumb",
						"aria-label": "Breadcrumb",
						children: [/* @__PURE__ */ (0, C.jsx)("button", {
							onClick: () => io(T, ""),
							children: b("home")
						}), A ? /* @__PURE__ */ (0, C.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, C.jsx)("strong", { children: b(A === "favorites" ? "favorites" : "recent") })] }) : Ei.map((e, t) => /* @__PURE__ */ (0, C.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, C.jsx)("button", {
							onClick: () => io(T, Ei.slice(0, t + 1).join("/")),
							children: e
						})] }, `${e}-${t}`))]
					}),
					e.uiDefaults.search !== !1 && /* @__PURE__ */ (0, C.jsxs)("div", {
						className: "sf-search",
						children: [
							/* @__PURE__ */ (0, C.jsx)(a, { name: "search" }),
							/* @__PURE__ */ (0, C.jsxs)("select", {
								value: He,
								disabled: A !== null,
								onChange: (e) => {
									let t = e.target.value;
									Ge(t), Ct(0);
								},
								"aria-label": b("searchScope"),
								children: [/* @__PURE__ */ (0, C.jsx)("option", {
									value: "name",
									disabled: I?.storageCapabilities?.search === !1,
									children: b("name")
								}), /* @__PURE__ */ (0, C.jsx)("option", {
									value: "tags",
									children: b("tags")
								})]
							}),
							/* @__PURE__ */ (0, C.jsx)("input", {
								disabled: A === null && He === "name" && I?.storageCapabilities?.search === !1,
								value: Be,
								onChange: (e) => Ve(e.target.value),
								placeholder: b(A === "favorites" ? "searchFavorites" : A === "recent" ? "searchRecent" : He === "tags" ? "searchTags" : "search"),
								"aria-label": b(A === "favorites" ? "searchFavorites" : A === "recent" ? "searchRecent" : He === "tags" ? "searchTags" : "search")
							}),
							Ar && /* @__PURE__ */ (0, C.jsx)("button", {
								className: "sf-advanced-search-trigger",
								type: "button",
								onClick: () => Fr(!0),
								title: b("advancedSearch"),
								"aria-label": b("advancedSearch"),
								children: /* @__PURE__ */ (0, C.jsx)(a, { name: "filter" })
							})
						]
					}),
					/* @__PURE__ */ (0, C.jsxs)("div", {
						className: "sf-command-actions",
						children: [
							(e.workspace?.options?.length ?? 0) > 1 && /* @__PURE__ */ (0, C.jsxs)("label", {
								className: "sf-workspace-switcher",
								children: [/* @__PURE__ */ (0, C.jsx)("span", {
									className: "sf-sr-only",
									children: b("workspace")
								}), /* @__PURE__ */ (0, C.jsx)("select", {
									"aria-label": b("workspace"),
									value: e.workspace?.id,
									disabled: Va,
									title: b(Va ? "workspaceUploadBlocked" : "workspace"),
									onChange: (t) => {
										let n = e.workspace?.options?.find((e) => e.id === t.target.value);
										n && window.location.assign(n.url);
									},
									children: e.workspace?.options?.map((e) => /* @__PURE__ */ (0, C.jsx)("option", {
										value: e.id,
										children: e.label
									}, e.id))
								})]
							}),
							/* @__PURE__ */ (0, C.jsx)(oe, {
								sort: _t,
								direction: bt,
								group: ki,
								available: A === null && I?.storageCapabilities?.sort !== !1,
								groupingAvailable: A === null,
								tagsEnabled: j.tags,
								labels: {
									sort: b("sort"),
									name: b("name"),
									modified: b("modified"),
									type: b("type"),
									size: b("size"),
									ascending: b("ascending"),
									descending: b("descending"),
									groupBy: b("groupBy"),
									groupNone: b("groupNone"),
									tags: b("tags")
								},
								onSortChange: (e) => po(e, !1),
								onDirectionChange: mo,
								onGroupChange: ho,
								onOpen: () => M(!1)
							}),
							e.uiDefaults.viewSwitcher !== !1 && /* @__PURE__ */ (0, C.jsx)(se, {
								view: Lt,
								viewAvailable: A === null,
								viewSizes: un,
								scale: In,
								folderNavigation: j.folderTree,
								folderNavigationAvailable: p.folderTree !== !1,
								detailsPane: _n,
								detailsPaneAvailable: to,
								columns: on,
								labels: {
									view: b("view"),
									largeIcons: b("largeIcons"),
									mediumIcons: b("mediumIcons"),
									smallIcons: b("smallIcons"),
									list: b("list"),
									detailsView: b("detailsView"),
									contentView: b("contentView"),
									compactView: b("compactView"),
									show: b("show"),
									folderNavigation: b("folderNavigation"),
									detailsPane: b("detailsPane"),
									showSizeColumn: b("showSizeColumn"),
									showTypeColumn: b("showTypeColumn"),
									showModifiedColumn: b("showModifiedColumn")
								},
								onViewChange: wa,
								onViewSizeChange: fa,
								onCompactChange: (e) => Ln(e ? "compact" : "standard"),
								onFolderNavigationChange: (e) => ua("folderTree", e),
								onDetailsPaneChange: _a,
								onColumnChange: da,
								onOpen: () => M(!1)
							}),
							/* @__PURE__ */ (0, C.jsxs)("div", {
								ref: Jr,
								className: "sf-utility",
								children: [/* @__PURE__ */ (0, C.jsx)("button", {
									ref: Yr,
									className: "sf-icon-only",
									onClick: () => M((e) => !e),
									"aria-expanded": Tn,
									title: b("moreActions"),
									"aria-label": b("moreActions"),
									children: /* @__PURE__ */ (0, C.jsx)(a, { name: "more" })
								}), Tn && /* @__PURE__ */ (0, C.jsxs)("div", {
									className: "sf-utility-menu",
									role: "menu",
									children: [
										e.uiDefaults.languageSwitcher !== !1 && /* @__PURE__ */ (0, C.jsxs)("label", { children: [/* @__PURE__ */ (0, C.jsx)("span", { children: b("language") }), /* @__PURE__ */ (0, C.jsxs)("select", {
											value: m,
											onChange: (e) => h(e.target.value),
											"aria-label": b("language"),
											children: [
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "zh-cn",
													children: "简中"
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "zh-tw",
													children: "繁中"
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "en",
													children: "EN"
												})
											]
										})] }),
										/* @__PURE__ */ (0, C.jsxs)("label", { children: [/* @__PURE__ */ (0, C.jsx)("span", { children: b("filterType") }), /* @__PURE__ */ (0, C.jsxs)("select", {
											value: Pn,
											disabled: A !== null,
											"aria-label": b("filterType"),
											onChange: (e) => {
												let t = e.target.value;
												Fn(t), localStorage.setItem("sofinder.typeFilter.v1", t), aa();
											},
											children: [
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "all",
													children: b("allTypes")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "folder",
													children: b("folder")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "image",
													children: b("images")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "document",
													children: b("documents")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "audio",
													children: b("audio")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "video",
													children: b("video")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "archive",
													children: b("archives")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "other",
													children: b("other")
												})
											]
										})] }),
										/* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											onClick: () => {
												M(!1), A === "favorites" ? oi(T, !0).catch(P) : F();
											},
											children: B("refresh", b("refresh"))
										}),
										/* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											onClick: () => {
												M(!1), Sn(!0);
											},
											children: B("settings", b("settings"))
										}),
										(d === "manager" || Ua) && e.securityStatusAvailable !== !1 && /* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											onClick: () => {
												M(!1), wn(!0);
											},
											children: B("security", b("securityStatus"))
										}),
										(d === "manager" || Ua) && j.favorites && /* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											onClick: () => {
												M(!1), oo();
											},
											children: B("favorite", b("favorites"))
										}),
										(d === "manager" || Ua) && qi.filter((e) => e.slot === "utility" && Re(e, null)).map((e) => /* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											onClick: () => {
												M(!1), Yi(e, null);
											},
											children: Fe(e, m)
										}, `${e.plugin}:${e.id}`))
									]
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, C.jsxs)("div", {
				className: "sf-toolbar",
				role: "toolbar",
				"aria-label": b("fileActions"),
				title: b("keyboardHelp"),
				children: [
					/* @__PURE__ */ (0, C.jsx)("button", {
						onClick: Zi,
						disabled: A !== null || I?.readOnly || Ut.create_folder === !1 || I !== void 0 && fi >= I.maxFolderDepth,
						title: I && fi >= I.maxFolderDepth ? b("folderDepthReached") : void 0,
						children: B("add-folder", b("newFolder"))
					}),
					pi.length > 0 && /* @__PURE__ */ (0, C.jsx)("button", {
						className: "sf-upload-progress-trigger",
						style: { "--sf-upload-progress": Ha },
						onClick: () => hi(!1),
						"aria-expanded": !mi,
						title: `${b("uploadQueue")}: ${Ha}%`,
						"aria-label": `${b("uploadQueue")}: ${Ha}%`,
						children: /* @__PURE__ */ (0, C.jsxs)("span", { children: [Ha, "%"] })
					}),
					/* @__PURE__ */ (0, C.jsxs)("div", {
						ref: Xr,
						className: "sf-upload-split",
						children: [
							/* @__PURE__ */ (0, C.jsx)("button", {
								className: `primary sf-upload-trigger${Va ? " is-active" : ""}`,
								"aria-busy": Va,
								onClick: () => gi.current?.click(),
								disabled: A !== null || I?.readOnly || Ut.upload === !1,
								children: B("upload", `${b("upload")}${Va ? ` (${pi.filter((e) => e.status === "queued" || e.status === "uploading").length})` : ""}`)
							}),
							p.folderUpload !== !1 && /* @__PURE__ */ (0, C.jsx)("button", {
								ref: Zr,
								className: "primary sf-upload-menu-trigger",
								onClick: () => Dn((e) => !e),
								disabled: A !== null || I?.readOnly || Ut.upload === !1,
								"aria-haspopup": "menu",
								"aria-expanded": En,
								title: b("uploadOptions"),
								"aria-label": b("uploadOptions"),
								children: /* @__PURE__ */ (0, C.jsx)(a, { name: "chevron-down" })
							}),
							En && /* @__PURE__ */ (0, C.jsxs)("div", {
								className: "sf-utility-menu sf-upload-menu",
								role: "menu",
								children: [/* @__PURE__ */ (0, C.jsx)("button", {
									role: "menuitem",
									onClick: () => {
										Dn(!1), gi.current?.click();
									},
									children: B("file", b("uploadFile"))
								}), /* @__PURE__ */ (0, C.jsx)("button", {
									role: "menuitem",
									onClick: () => {
										Dn(!1), _i.current?.click();
									},
									children: B("add-folder", b("uploadFolder"))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, C.jsx)("input", {
						ref: gi,
						type: "file",
						multiple: !0,
						hidden: !0,
						onChange: (e) => {
							e.target.files && vi(e.target.files), e.target.value = "";
						}
					}),
					p.folderUpload !== !1 && /* @__PURE__ */ (0, C.jsx)("input", {
						ref: (e) => {
							_i.current = e, e?.setAttribute("webkitdirectory", "");
						},
						type: "file",
						multiple: !0,
						hidden: !0,
						onChange: (e) => {
							e.target.files && bi(e.target.files), e.target.value = "";
						}
					}),
					(d === "manager" || Ua) && /* @__PURE__ */ (0, C.jsx)("div", {
						ref: Qr,
						className: "sf-utility sf-selection-menu",
						children: /* @__PURE__ */ (0, C.jsx)("button", {
							onClick: ii,
							"aria-expanded": On,
							"aria-haspopup": "menu",
							children: B("select", b("selection"))
						})
					}),
					(d === "manager" || Ua) && R.length > 0 && /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("span", { className: "sf-separator" }), /* @__PURE__ */ (0, C.jsxs)("div", {
						className: "sf-context-actions",
						children: [
							/* @__PURE__ */ (0, C.jsx)("button", {
								onClick: Qi,
								disabled: R.length !== 1 || !Wi("rename") || I?.readOnly,
								children: B("rename", b("rename"))
							}),
							p.batchRename !== !1 && nn.batchRename && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => Wn(!0),
								disabled: R.length < 2 || !Wi("rename") || I?.readOnly,
								children: B("rename", b("batchRename"))
							}),
							/* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void na("copy", E),
								disabled: !Wi("copy") || I?.readOnly,
								children: B("copy", b("copy"))
							}),
							/* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void na("move", E),
								disabled: !Wi("move") || I?.readOnly,
								children: B("move", b("move"))
							}),
							j.archive && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void va(),
								children: B("archive", b("downloadZip"))
							}),
							j.favorites && Gi(z) && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void ya(),
								children: B("favorite", b("favorite"))
							}),
							Ka && j.sidebarQuickAccess && Ki(z) && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void ba(),
								children: B("pin", z && Yt.quickAccess.includes(z.path) ? b("unpinQuickAccess") : b("pinQuickAccess"))
							}),
							j.tags && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void xa(),
								disabled: !z,
								children: B("tags", b("tags"))
							}),
							/* @__PURE__ */ (0, C.jsx)("button", {
								className: "danger",
								onClick: $i,
								disabled: !Wi("delete") || I?.readOnly,
								children: B("delete", `${b("remove")}${R.length > 1 ? ` (${R.length})` : ""}`)
							}),
							(p.imageEditing !== !1 && (nn.rotate || nn.resize || nn.crop || nn.presets) || p.imageProcessing !== !1 && nn.process) && R.length === 1 && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: ca,
								disabled: !Ri(z) || !en || I?.readOnly,
								children: B("crop", b("imageEdit"))
							}),
							p.imageProcessing !== !1 && nn.process && R.length > 1 && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => Xn(!0),
								disabled: zi.length === 0 || zi.length !== R.length || I?.readOnly,
								children: B("resize", b("imageProcess"))
							}),
							z && qi.filter((e) => e.slot === "toolbar" && Re(e, z)).map((e) => /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => Yi(e, z),
								children: Fe(e, m)
							}, `${e.plugin}:${e.id}`))
						]
					})] })
				]
			}),
			On && (0, v.createPortal)(/* @__PURE__ */ (0, C.jsxs)("div", {
				ref: $r,
				className: "sf-utility-menu sf-selection-menu-popup",
				role: "menu",
				style: An,
				children: [
					/* @__PURE__ */ (0, C.jsx)("button", {
						role: "menuitem",
						disabled: ji.length === 0,
						onClick: () => {
							ia(), kn(!1);
						},
						children: b("selectAll")
					}),
					/* @__PURE__ */ (0, C.jsx)("button", {
						role: "menuitem",
						disabled: Mi.size === 0,
						onClick: () => {
							aa(), kn(!1);
						},
						children: b("clearSelection")
					}),
					/* @__PURE__ */ (0, C.jsx)("button", {
						role: "menuitem",
						disabled: ji.length === 0,
						onClick: () => {
							oa(), kn(!1);
						},
						children: b("invertSelection")
					})
				]
			}), document.body),
			Vt && /* @__PURE__ */ (0, C.jsxs)("div", {
				className: "sf-notice",
				role: "alert",
				children: [Vt, /* @__PURE__ */ (0, C.jsx)("button", {
					onClick: () => Ht(""),
					"aria-label": b("close"),
					children: /* @__PURE__ */ (0, C.jsx)(a, { name: "close" })
				})]
			}),
			pi.length > 0 && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, C.jsx)(ut, {
					tasks: pi,
					collapsed: mi,
					labels: {
						title: b("uploadQueue"),
						close: b("close"),
						cancel: b("cancel"),
						cancelAll: b("cancelAll"),
						clearFinished: b("clearFinished"),
						retry: b("retryUpload"),
						remove: b("removeUploadTask"),
						status: (e) => b(e)
					},
					onToggle: () => hi(!0),
					onCancel: xi,
					onCancelAll: Si,
					onClearFinished: Ti,
					onRetry: wi,
					onRemove: Ci
				})
			}),
			/* @__PURE__ */ (0, C.jsxs)("div", {
				className: "sf-layout",
				style: {
					"--sf-sidebar-width": `${Rr}px`,
					"--sf-details-width": `${Br}px`
				},
				children: [
					$a && /* @__PURE__ */ (0, C.jsxs)("aside", {
						className: `sf-sidebar${Qa ? " sf-trash-only-sidebar" : ""}`,
						"aria-label": "Resources",
						children: [
							w.map((e) => /* @__PURE__ */ (0, C.jsxs)("button", {
								className: e.name === T && A === null ? "active" : "",
								onClick: () => {
									$t(null), ae(e.name), Ve(""), Ge("name"), e.storageCapabilities?.sort === !1 ? (yt("name"), xt("asc"), jt([]), F(e.name, "", "", 0, "name", "asc", "name", null)) : io(e.name, "", "");
								},
								children: [/* @__PURE__ */ (0, C.jsx)("span", {
									className: "sf-resource-icon",
									children: /* @__PURE__ */ (0, C.jsx)(l, { kind: e.name.toLowerCase().includes("image") ? "image" : "folder" })
								}), e.name.toLowerCase().includes("image") ? b("images") : e.name.toLowerCase() === "files" ? b("files") : e.name]
							}, e.name)),
							Za && /* @__PURE__ */ (0, C.jsxs)("button", {
								onClick: () => ir(!0),
								children: [/* @__PURE__ */ (0, C.jsx)("span", {
									className: "sf-resource-icon",
									children: /* @__PURE__ */ (0, C.jsx)(a, { name: "trash" })
								}), b("trash")]
							}),
							I && (I.readOnly || I.quotaBytes > 0) && /* @__PURE__ */ (0, C.jsxs)("div", {
								className: "sf-resource-status",
								children: [I.readOnly && /* @__PURE__ */ (0, C.jsx)("strong", { children: b("readOnly") }), I.quotaBytes > 0 && /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsxs)("span", { children: [
									b("storageUsage"),
									": ",
									u(I.usedBytes),
									" / ",
									u(I.quotaBytes)
								] }), /* @__PURE__ */ (0, C.jsx)("progress", {
									max: I.quotaBytes,
									value: Math.min(I.usedBytes, I.quotaBytes)
								})] })]
							}),
							wo("left", Ya)
						]
					}),
					$a && /* @__PURE__ */ (0, C.jsx)("div", {
						className: "sf-column-resizer left",
						role: "separator",
						tabIndex: 0,
						"aria-label": b("resizeLeftPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": xe.left.min,
						"aria-valuemax": xe.left.max,
						"aria-valuenow": Rr,
						onPointerDown: (e) => Oa("left", e),
						onPointerMove: ka,
						onPointerUp: Aa,
						onPointerCancel: Aa,
						onKeyDown: (e) => ja("left", e),
						onDoubleClick: () => Da("left", xe.left.initial, !0)
					}),
					/* @__PURE__ */ (0, C.jsxs)("section", {
						className: "sf-content",
						children: [
							eo("mobile"),
							Wa && /* @__PURE__ */ (0, C.jsxs)("nav", {
								className: "sf-breadcrumb",
								"aria-label": "Breadcrumb",
								children: [/* @__PURE__ */ (0, C.jsx)("button", {
									onClick: () => io(T, ""),
									children: b("home")
								}), A ? /* @__PURE__ */ (0, C.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, C.jsx)("strong", { children: b(A === "favorites" ? "favorites" : "recent") })] }) : Ei.map((e, t) => /* @__PURE__ */ (0, C.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, C.jsx)("button", {
									onClick: () => io(T, Ei.slice(0, t + 1).join("/")),
									children: e
								})] }, `${e}-${t}`))]
							}),
							A === "favorites" ? /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
								fallback: /* @__PURE__ */ (0, C.jsx)("div", {
									className: "sf-state",
									children: b("loading")
								}),
								children: /* @__PURE__ */ (0, C.jsx)(it, {
									paths: Yt.favorites,
									search: Be,
									locale: m,
									labels: {
										title: b("favorites"),
										hint: b("favoritesPageHint"),
										empty: b("favoritesEmpty"),
										noMatch: b("filterEmpty"),
										home: b("home"),
										open: b("open"),
										remove: b("removeFavorite")
									},
									onOpen: (e) => void co(T, e, "favorite"),
									onRemove: (e) => void uo(e)
								})
							}) : A === "recent" ? /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
								fallback: /* @__PURE__ */ (0, C.jsx)("div", {
									className: "sf-state",
									children: b("loading")
								}),
								children: /* @__PURE__ */ (0, C.jsx)(at, {
									items: Yt.recent,
									search: Be,
									locale: m,
									labels: {
										title: b("recent"),
										hint: b("recentPageHint"),
										empty: b("recentEmpty"),
										noMatch: b("filterEmpty"),
										home: b("home"),
										open: b("open")
									},
									onOpen: (e) => void Ca(e)
								})
							}) : zt ? /* @__PURE__ */ (0, C.jsx)("div", {
								className: "sf-state",
								children: b("loading")
							}) : ji.length === 0 ? /* @__PURE__ */ (0, C.jsx)("div", {
								className: "sf-state",
								children: Ne.length === 0 ? b("empty") : b("filterEmpty")
							}) : /* @__PURE__ */ (0, C.jsxs)("div", {
								ref: qr,
								className: `sf-entries ${Lt} sf-grid-size-${un.grid} sf-list-size-${un.list}${Lt === "list" && on.size ? " sf-list-has-size" : ""}`,
								style: Lt === "list" ? { "--sf-list-columns": _o } : void 0,
								role: "listbox",
								"aria-multiselectable": d === "manager",
								"aria-label": b("files"),
								children: [Lt === "list" && /* @__PURE__ */ (0, C.jsx)("div", {
									className: "sf-list-head",
									children: go.map((e) => bo(e, vo(e), yo(e), !0))
								}), Ai.flatMap((e) => [...ki === "none" ? [] : [/* @__PURE__ */ (0, C.jsxs)("div", {
									className: "sf-entry-group",
									children: [/* @__PURE__ */ (0, C.jsx)("strong", { children: U(e.label) }), /* @__PURE__ */ (0, C.jsx)("span", { children: e.entries.length })]
								}, `group-${e.key}`)], ...e.entries.map((e) => {
									let t = ji.findIndex((t) => t.path === e.path), n = !e.directory && Li(e);
									return /* @__PURE__ */ (0, C.jsxs)("button", {
										"data-entry-index": t,
										role: "option",
										"aria-selected": Mi.has(e.path),
										"aria-label": `${e.name}, ${e.directory ? b("folder") : u(e.size)}`,
										className: `sf-entry ${Mi.has(e.path) ? "selected" : ""}`,
										onClick: (t) => Fi(e, t),
										onDoubleClick: () => Xi(e),
										onContextMenu: (t) => {
											t.preventDefault(), Ni(/* @__PURE__ */ new Set([e.path])), L(e.path), cr({
												x: t.clientX,
												y: t.clientY,
												entry: e
											});
										},
										onPointerDown: (t) => {
											t.pointerType === "touch" && (Wr.current = window.setTimeout(() => {
												Ni(/* @__PURE__ */ new Set([e.path])), L(e.path), cr({
													x: t.clientX,
													y: t.clientY,
													entry: e
												});
											}, 550));
										},
										onPointerUp: () => {
											Wr.current !== null && window.clearTimeout(Wr.current), Wr.current = null;
										},
										onPointerCancel: () => {
											Wr.current !== null && window.clearTimeout(Wr.current), Wr.current = null;
										},
										onDragOver: (t) => {
											e.directory && t.preventDefault();
										},
										onDrop: (t) => {
											e.directory && t.dataTransfer.files.length && (t.preventDefault(), yi(e.path, t.dataTransfer.files));
										},
										children: [
											/* @__PURE__ */ (0, C.jsx)("span", {
												className: "sf-entry-icon",
												children: n ? /* @__PURE__ */ (0, C.jsx)(c, {
													src: s.thumbnailUrl(T, e),
													alt: "",
													lazy: !0
												}) : /* @__PURE__ */ (0, C.jsx)(l, {
													name: e.name,
													mimeType: e.mimeType,
													directory: e.directory
												})
											}),
											/* @__PURE__ */ (0, C.jsxs)("span", {
												className: "sf-entry-name",
												title: e.name,
												children: [j.favorites && Yt.favorites.includes(e.path) && /* @__PURE__ */ (0, C.jsxs)("span", {
													"aria-label": b("favorite"),
													children: [/* @__PURE__ */ (0, C.jsx)(a, { name: "favorite" }), " "]
												}), e.name]
											}),
											on.size && /* @__PURE__ */ (0, C.jsx)("span", {
												className: "sf-entry-size",
												children: e.directory ? "—" : u(e.size)
											}),
											on.type && /* @__PURE__ */ (0, C.jsx)("span", {
												className: "sf-entry-type",
												children: e.directory ? b("folder") : e.mimeType || b("file")
											}),
											on.modified && /* @__PURE__ */ (0, C.jsx)("time", {
												className: "sf-entry-modified",
												dateTime: (/* @__PURE__ */ new Date(e.modifiedAt * 1e3)).toISOString(),
												children: S.format(e.modifiedAt * 1e3)
											})
										]
									}, e.path);
								})])]
							}),
							A === null && /* @__PURE__ */ (0, C.jsxs)("nav", {
								className: "sf-pagination",
								"aria-label": b("pagination"),
								children: [
									/* @__PURE__ */ (0, C.jsxs)("div", {
										className: "sf-page-navigation",
										children: [
											/* @__PURE__ */ (0, C.jsx)("button", {
												disabled: At.length === 0,
												onClick: fo,
												"aria-label": b("previous"),
												title: b("previous"),
												children: /* @__PURE__ */ (0, C.jsx)(a, { name: "chevron-left" })
											}),
											/* @__PURE__ */ (0, C.jsxs)("span", {
												className: "sf-page-indicator",
												children: [
													/* @__PURE__ */ (0, C.jsx)("span", { children: b("page") }),
													/* @__PURE__ */ (0, C.jsx)("strong", { children: At.length + 1 }),
													wt !== null && /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("i", {
														"aria-hidden": "true",
														children: "/"
													}), /* @__PURE__ */ (0, C.jsx)("span", { children: Math.max(1, Math.ceil(wt / Mt)) })] })
												]
											}),
											/* @__PURE__ */ (0, C.jsx)("button", {
												disabled: Ot === null,
												onClick: V,
												"aria-label": b("next"),
												title: b("next"),
												children: /* @__PURE__ */ (0, C.jsx)(a, { name: "chevron-right" })
											})
										]
									}),
									/* @__PURE__ */ (0, C.jsxs)("label", {
										className: "sf-page-size",
										children: [/* @__PURE__ */ (0, C.jsx)("span", { children: b("itemsPerPage") }), /* @__PURE__ */ (0, C.jsx)("input", {
											type: "number",
											min: Ce.min,
											max: Ce.max,
											step: "10",
											list: n,
											value: Pt,
											"aria-label": `${b("itemsPerPage")} (${Ce.min}–${Ce.max})`,
											onChange: (e) => Ft(e.target.value),
											onBlur: H,
											onKeyDown: (e) => {
												e.key === "Enter" && e.currentTarget.blur();
											}
										})]
									}),
									/* @__PURE__ */ (0, C.jsx)("datalist", {
										id: n,
										children: [
											20,
											50,
											100,
											200,
											500
										].map((e) => /* @__PURE__ */ (0, C.jsx)("option", { value: e }, e))
									})
								]
							})
						]
					}),
					ro && /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("div", {
						className: "sf-column-resizer right",
						role: "separator",
						tabIndex: 0,
						"aria-label": b("resizeRightPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": xe.right.min,
						"aria-valuemax": xe.right.max,
						"aria-valuenow": Br,
						onPointerDown: (e) => Oa("right", e),
						onPointerMove: ka,
						onPointerUp: Aa,
						onPointerCancel: Aa,
						onKeyDown: (e) => ja("right", e),
						onDoubleClick: () => Da("right", xe.right.initial, !0)
					}), /* @__PURE__ */ (0, C.jsxs)("aside", {
						className: "sf-right-panel",
						"aria-label": b("rightSidebar"),
						children: [wo("right", Xa), no && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
							fallback: /* @__PURE__ */ (0, C.jsx)("div", {
								className: "sf-state",
								children: b("loading")
							}),
							children: /* @__PURE__ */ (0, C.jsx)(nt, {
								api: s,
								resource: T,
								selectedEntries: R,
								selected: z,
								imageInfo: en,
								metadata: Yt,
								showTags: j.tags,
								previewImage: Li(z),
								selectMode: !1,
								selectAllowed: Bi(z),
								assetMetadataEnabled: Er,
								assetAltLocales: Or.map((e) => ({
									code: e,
									label: {
										en: b("languageEnglish"),
										"zh-cn": b("languageZhCn"),
										"zh-tw": b("languageZhTw")
									}[e] ?? e
								})),
								labels: {
									details: b("details"),
									information: b("information"),
									selected: b("selectedCount"),
									type: b("type"),
									folder: b("folder"),
									file: b("file"),
									size: b("size"),
									dimensions: b("dimensions"),
									modified: b("modified"),
									location: b("location"),
									select: b("select"),
									download: b("download"),
									share: b("share"),
									assetMetadata: b("assetMetadata"),
									assetAlt: b("assetAlt"),
									translatedAlt: b("translatedAlt"),
									language: b("languageCode"),
									addLanguage: b("addLanguage"),
									assetTitle: b("assetTitle"),
									tags: b("tags"),
									decorative: b("decorativeImage"),
									unsetAlt: b("assetAltUnset"),
									inheritAlt: b("inheritAlt"),
									save: b("save"),
									loading: b("loading"),
									saved: b("assetMetadataSaved"),
									unsaved: b("unsavedChanges"),
									conflict: b("assetMetadataConflict"),
									metadataError: b("assetMetadataError"),
									unsupportedWebImage: b("webImageUnsupported")
								},
								formatDate: (e) => S.format(e * 1e3),
								onChoose: ra,
								onShare: Hi,
								onAssetMetadata: (e) => void Ui(e),
								pluginActions: z && qi.filter((e) => e.slot === "details" && Re(e, z)).map((e) => /* @__PURE__ */ (0, C.jsx)("button", {
									onClick: () => Yi(e, z),
									children: Fe(e, m)
								}, `${e.plugin}:${e.id}`))
							})
						})]
					})] })
				]
			}),
			d === "picker" && z && !z.directory && /* @__PURE__ */ (0, C.jsxs)("div", {
				className: "sf-picker-bar",
				children: [
					/* @__PURE__ */ (0, C.jsxs)("div", { children: [/* @__PURE__ */ (0, C.jsx)("strong", { children: z.name }), /* @__PURE__ */ (0, C.jsx)("small", { children: u(z.size) })] }),
					!Bi(z) && /* @__PURE__ */ (0, C.jsx)("span", {
						role: "status",
						children: b("webImageUnsupported")
					}),
					/* @__PURE__ */ (0, C.jsx)("button", {
						className: "primary",
						disabled: !Bi(z),
						onClick: () => void ra(),
						children: b("select")
					})
				]
			}),
			xn && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(Xe, {
					resource: I,
					tools: nn,
					features: j,
					columns: on,
					viewSizes: un,
					folderTreePlacement: gn,
					quickAccessScope: yn,
					availability: p,
					scale: In,
					uploadConflictStrategy: Rn,
					translate: b,
					onToolChange: la,
					onFeatureChange: ua,
					onColumnChange: da,
					onViewSizeChange: fa,
					onFolderTreePlacementChange: ga,
					onQuickAccessScopeChange: (e) => {
						bn(e), localStorage.setItem("sofinder.quickAccess.scope.v1", e);
					},
					onScaleChange: Ln,
					onUploadConflictStrategyChange: zn,
					onReset: Ra,
					onClose: () => Sn(!1)
				})
			}),
			Cn && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(Je, {
					api: s,
					formatDate: (e) => S.format(e * 1e3),
					labels: {
						title: b("securityStatus"),
						close: b("close"),
						loading: b("loading"),
						enabled: b("malwareScanningEnabled"),
						disabled: b("malwareScanningDisabled"),
						provider: b("scanProvider"),
						service: b("serviceStatus"),
						scans: b("scanHistory"),
						passed: b("scanPassed"),
						quarantined: b("scanQuarantined"),
						failed: b("scanFailed"),
						pending: b("scanPending"),
						recent: b("recentScans"),
						none: b("noScans"),
						document: b("documentPreviewStatus"),
						mode: b("previewMode"),
						converter: b("previewConverter"),
						version: b("previewVersion"),
						cache: b("previewCache"),
						writable: b("previewCacheWritable"),
						readOnly: b("previewCacheReadOnly"),
						jobs: b("previewJobs"),
						lastSuccess: b("previewLastSuccess"),
						never: b("previewNever"),
						running: b("previewRunning"),
						ready: b("previewReady")
					},
					onClose: () => wn(!1)
				})
			}),
			Vn && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(Ze, {
					state: Vn,
					unsafe: Ba,
					translate: b,
					onBrowse: (e, t) => void na(e, t),
					onConfirm: (e, t) => void ta(e, t),
					onClose: () => Hn(null)
				})
			}),
			Un && p.batchRename !== !1 && nn.batchRename && I && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(Qe, {
					entries: R,
					maximum: I.maxFileNameLength,
					labels: {
						title: b("batchRename"),
						pattern: b("renamePattern"),
						hint: b("renamePatternHint"),
						oldName: b("oldName"),
						newName: b("newName"),
						invalid: b("invalidEntryName"),
						duplicate: b("duplicateRename"),
						cancel: b("cancel"),
						save: b("rename"),
						close: b("close")
					},
					onClose: () => Wn(!1),
					onSave: (e) => void ea(e)
				})
			}),
			Zn && /* @__PURE__ */ (0, C.jsx)(te, {
				title: Zn.title,
				label: Zn.label,
				initialValue: Zn.initial,
				maximum: Zn.maximum,
				extension: Zn.extension,
				invalidNameLabel: b("invalidEntryName"),
				confirmLabel: b("confirm"),
				cancelLabel: b("cancel"),
				closeLabel: b("close"),
				onConfirm: (e) => void Sa(e),
				onClose: () => Qn(null)
			}),
			$n && /* @__PURE__ */ (0, C.jsx)(ne, {
				...$n,
				confirmLabel: b("confirm"),
				cancelLabel: b("cancel"),
				closeLabel: b("close"),
				onConfirm: () => li(!0),
				onClose: () => li(!1)
			}),
			tr && /* @__PURE__ */ (0, C.jsx)(re, {
				fileName: tr,
				title: b("replaceFile"),
				renameLabel: b("uploadConflictRename"),
				overwriteLabel: b("uploadConflictOverwrite"),
				skipLabel: b("uploadConflictSkip"),
				closeLabel: b("close"),
				onChoose: di
			}),
			rr && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)($e, {
					api: s,
					resource: T,
					locale: m,
					labels: {
						title: b("trash"),
						close: b("close"),
						cancel: b("cancel"),
						empty: b("trashEmpty"),
						restore: b("restore"),
						permanentDelete: b("permanentDelete"),
						expires: b("expires"),
						conflict: b("restoreConflict"),
						overwrite: b("restoreOverwrite"),
						autoRename: b("restoreAutoRename"),
						usage: b("trashUsage"),
						items: b("items"),
						previous: b("previous"),
						next: b("next"),
						search: b("searchTrash")
					},
					onClose: () => ir(!1),
					onChanged: () => void F()
				})
			}),
			ar && z && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(et, {
					initial: Yt.tags[z.path] || [],
					suggestions: Array.from(new Set(Object.values(Yt.tags).flat())).sort((e, t) => e.localeCompare(t, m)),
					labels: {
						title: b("tags"),
						close: b("close"),
						cancel: b("cancel"),
						save: b("save"),
						input: b("tagInput"),
						hint: b("tagInputHint"),
						maximum: b("tagMaximum")
					},
					onClose: () => or(!1),
					onSave: (e) => {
						or(!1), si(T, z.path, "tags", { tags: e }).catch(P);
					}
				})
			}),
			Pr && Ar && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(pt, {
					api: s,
					resources: w.map((e) => e.name),
					currentResource: T,
					currentPath: E,
					formatDate: (e) => S.format(e * 1e3),
					labels: {
						advancedSearch: b("advancedSearch"),
						close: b("close"),
						keywords: b("keywords"),
						searchAssets: b("searchAssets"),
						scope: b("searchScope"),
						currentDirectory: b("currentDirectory"),
						currentResource: b("currentResource"),
						allResources: b("allResources"),
						type: b("type"),
						allTypes: b("allTypes"),
						image: b("images"),
						document: b("documents"),
						audio: b("audio"),
						video: b("video"),
						archive: b("archives"),
						other: b("other"),
						tags: b("tags"),
						extensions: b("extensions"),
						commaSeparated: b("commaSeparated"),
						minimumSize: b("minimumSizeMb"),
						maximumSize: b("maximumSizeMb"),
						modifiedAfter: b("modifiedAfter"),
						modifiedBefore: b("modifiedBefore"),
						searchFields: b("searchFields"),
						name: b("name"),
						title: b("assetTitle"),
						alt: b("assetAlt"),
						searching: b("searching"),
						search: b("search"),
						recentSearches: b("recentSearches"),
						filteredAssets: b("filteredAssets"),
						searchFailed: b("searchFailed"),
						results: b("searchResultCount"),
						scanned: b("searchScannedCount"),
						truncated: b("searchTruncated"),
						noResults: b("filterEmpty"),
						previous: b("previous"),
						next: b("next")
					},
					onOpen: (e, t) => void ao(e, t),
					onClose: () => Fr(!1)
				})
			}),
			Ir && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(ft, {
					asset: Ir.asset,
					metadata: Ir.metadata,
					locales: Or.map((e) => ({
						code: e,
						label: {
							en: b("languageEnglish"),
							"zh-cn": b("languageZhCn"),
							"zh-tw": b("languageZhTw")
						}[e] ?? e
					})),
					labels: {
						title: b("assetMetadata"),
						alt: b("assetAlt"),
						translatedAlt: b("translatedAlt"),
						translatedAltHelp: b("translatedAltHelp"),
						language: b("languageCode"),
						addLanguage: b("addLanguage"),
						assetTitle: b("assetTitle"),
						tags: b("tags"),
						decorative: b("decorativeImage"),
						unsetAlt: b("assetAltUnset"),
						inheritAlt: b("inheritAlt"),
						save: b("save"),
						cancel: b("cancel")
					},
					onClose: () => Lr(null),
					onSave: async (e) => {
						await s.updateAssetMetadata(Ir.asset.assetId || "", e), Lr(null), Ht(b("assetMetadataSaved"));
					}
				})
			}),
			N && /* @__PURE__ */ (0, C.jsx)(o, {
				title: N.name,
				closeLabel: b("close"),
				maximizable: !0,
				onClose: () => dr(null),
				className: "sf-file-preview-modal",
				footer: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
					/* @__PURE__ */ (0, C.jsx)("a", {
						className: "sf-icon-action",
						href: N.url || s.downloadUrl(T, N.path),
						target: "_blank",
						rel: "noopener noreferrer",
						title: b("download"),
						"aria-label": b("download"),
						children: /* @__PURE__ */ (0, C.jsx)(a, { name: "download" })
					}),
					/* @__PURE__ */ (0, C.jsx)("button", {
						className: "sf-icon-action",
						type: "button",
						onClick: () => void Hi(N),
						title: b("share"),
						"aria-label": b("share"),
						children: /* @__PURE__ */ (0, C.jsx)(a, { name: "share" })
					}),
					Er && N.capabilities?.["metadata.update"] !== !1 && /* @__PURE__ */ (0, C.jsx)("button", {
						className: "sf-icon-action",
						type: "button",
						onClick: () => void Ui(N),
						title: b("assetMetadata"),
						"aria-label": b("assetMetadata"),
						children: /* @__PURE__ */ (0, C.jsx)(a, { name: "asset-metadata" })
					}),
					/* @__PURE__ */ (0, C.jsx)("button", {
						className: "primary",
						onClick: () => dr(null),
						children: b("close")
					})
				] }),
				children: /* @__PURE__ */ (0, C.jsxs)("div", {
					className: "sf-file-preview-body",
					children: [Li(N) ? /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
						fallback: /* @__PURE__ */ (0, C.jsx)("div", {
							className: "sf-state",
							children: b("loading")
						}),
						children: /* @__PURE__ */ (0, C.jsx)(dt, {
							api: s,
							resource: T,
							entry: N,
							labels: {
								actual: b("actualSize"),
								fit: b("fitToWindow"),
								zoom: b("zoomLevel"),
								center: b("centerImage"),
								loading: b("loadingOriginalImage"),
								failed: b("imagePreviewFailed"),
								retry: b("retryImagePreview"),
								warning: b("largeOriginalImageWarning"),
								continue: b("continueOriginalImage"),
								cancel: b("cancel"),
								dimensions: b("dimensions"),
								size: b("size")
							}
						})
					}) : /* @__PURE__ */ (0, C.jsx)("div", {
						className: "sf-file-preview-content",
						children: p.textPreview !== !1 && fr?.path === N.path ? /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("pre", {
							className: "sf-text-preview",
							children: fr.content
						}), fr.truncated && /* @__PURE__ */ (0, C.jsx)("p", {
							className: "sf-warning",
							children: b("previewTruncated")
						})] }) : Ie(N, Ji)?.plugin === "document-preview" ? /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
							fallback: null,
							children: /* @__PURE__ */ (0, C.jsx)(Ye, {
								api: s,
								resource: T,
								entry: N,
								labels: {
									submitting: b("previewSubmitting"),
									queued: b("previewQueued"),
									converting: b("previewConverting"),
									loading: b("previewLoading"),
									failed: b("previewFailed"),
									retry: b("previewRetry"),
									elapsed: (e) => b("previewElapsed").replace("{seconds}", String(e))
								}
							})
						}) : Le(N, Ji, T) ? /* @__PURE__ */ (0, C.jsx)("iframe", {
							className: "sf-document-preview",
							src: Le(N, Ji, T) || void 0,
							title: N.name
						}) : /* @__PURE__ */ (0, C.jsxs)("div", {
							className: "sf-file-preview-fallback",
							children: [/* @__PURE__ */ (0, C.jsx)(l, { kind: "file" }), /* @__PURE__ */ (0, C.jsx)("p", { children: b("previewUnavailable") })]
						})
					}), /* @__PURE__ */ (0, C.jsxs)("dl", {
						className: "sf-file-preview-meta",
						children: [
							/* @__PURE__ */ (0, C.jsx)("dt", { children: b("type") }),
							/* @__PURE__ */ (0, C.jsx)("dd", { children: N.mimeType || b("file") }),
							/* @__PURE__ */ (0, C.jsx)("dt", { children: b("size") }),
							/* @__PURE__ */ (0, C.jsx)("dd", { children: u(N.size) }),
							/* @__PURE__ */ (0, C.jsx)("dt", { children: b("modified") }),
							/* @__PURE__ */ (0, C.jsx)("dd", { children: /* @__PURE__ */ (0, C.jsx)("time", {
								dateTime: (/* @__PURE__ */ new Date(N.modifiedAt * 1e3)).toISOString(),
								children: S.format(N.modifiedAt * 1e3)
							}) }),
							/* @__PURE__ */ (0, C.jsx)("dt", { children: b("location") }),
							/* @__PURE__ */ (0, C.jsx)("dd", { children: N.path }),
							p.checksum !== !1 && /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("dt", { children: "SHA-256" }), /* @__PURE__ */ (0, C.jsx)("dd", { children: mr?.path === N.path ? /* @__PURE__ */ (0, C.jsx)("code", {
								className: "sf-checksum",
								children: mr.value
							}) : /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void s.checksum(T, N.path).then((e) => hr({
									path: N.path,
									value: e.checksum
								})).catch(P),
								children: b("calculateChecksum")
							}) })] })
						]
					})]
				})
			}),
			gr && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(rt, {
					...gr,
					showQrCode: j.qrCode && p.qrCode !== !1,
					labels: {
						title: b("share"),
						close: b("close"),
						copyUrl: b("copyUrl"),
						copied: b("urlCopied"),
						copyFailed: b("copyUrlFailed"),
						downloadQr: b("downloadQrCode"),
						loginRequired: b("loginRequired"),
						expires: b("linkExpires"),
						hint: b("shareHint"),
						qrCode: b("qrCode"),
						qrFailed: b("qrCodeFailed")
					},
					formatDate: (e) => S.format(e * 1e3),
					onClose: () => _r(null)
				})
			}),
			Yn && p.imageProcessing !== !1 && zi.length > 0 && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(qe, {
					entries: zi,
					resource: T,
					formats: br.formats.filter((e) => e.edit && [
						"jpeg",
						"png",
						"webp",
						"avif"
					].includes(e.format)).map((e) => e.format),
					labels: {
						title: b("imageProcess"),
						close: b("close"),
						cancel: b("cancel"),
						apply: b("applyImageProcess"),
						processing: b("processingImages"),
						selected: b("processingSelected"),
						operation: b("operation"),
						optimize: b("optimizeImage"),
						textWatermark: b("textWatermark"),
						imageWatermark: b("imageWatermark"),
						outputFormat: b("outputFormat"),
						keepFormat: b("keepFormat"),
						watermarkText: b("watermarkText"),
						watermarkFont: b("watermarkFont"),
						interfaceFont: b("interfaceFont"),
						sansFont: b("sansFont"),
						serifFont: b("serifFont"),
						color: b("color"),
						watermarkResource: b("watermarkResource"),
						watermarkPath: b("watermarkPath"),
						position: b("position"),
						topLeft: b("topLeft"),
						topRight: b("topRight"),
						center: b("center"),
						bottomLeft: b("bottomLeft"),
						bottomRight: b("bottomRight"),
						opacity: b("opacity"),
						scale: b("watermarkScale"),
						quality: b("quality"),
						saveMode: b("saveMode"),
						saveCopy: b("saveCopy"),
						overwrite: b("overwrite"),
						conversionCopyHint: b("conversionCopyHint"),
						overwriteWarning: b("confirmImageOverwrite")
					},
					onClose: () => Xn(!1),
					onApply: async (e, t) => {
						if (zi.length === 1) await s.applyImageActions(T, zi[0].path, e, t), Ht(`${b("completed")}: 1`);
						else {
							let n = await s.applyImageBatch(T, zi.map((e) => e.path), e, t);
							Ht(`${b("completed")}: ${n.succeeded} · ${b("failed")}: ${n.failed}`);
						}
						Xn(!1), await F();
					}
				})
			}),
			Gn && z && en && /* @__PURE__ */ (0, C.jsx)(_.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: b("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(Ke, {
					entry: z,
					info: en,
					imageUrl: `${s.contentUrl(T, z.path)}&v=${z.modifiedAt}-${z.size}-${qn}`,
					resource: T,
					watermarkUrl: (e, t) => s.contentUrl(e, t),
					presets: vr,
					formats: br.formats.filter((e) => e.edit && [
						"jpeg",
						"png",
						"webp",
						"avif"
					].includes(e.format)).map((e) => e.format),
					enabledTools: {
						crop: nn.crop && p.imageEditing !== !1,
						rotate: nn.rotate && p.imageEditing !== !1,
						resize: nn.resize && p.imageEditing !== !1,
						presets: nn.presets && p.imageEditing !== !1,
						process: nn.process && p.imageProcessing !== !1
					},
					maximumFileNameLength: I?.maxFileNameLength ?? 120,
					labels: {
						imageEdit: b("imageEdit"),
						imageTools: b("imageTools"),
						crop: b("crop"),
						rotate: b("rotationTools"),
						resize: b("resize"),
						preset: b("preset"),
						optimize: b("optimizeImage"),
						watermark: b("watermark"),
						close: b("close"),
						cancel: b("cancel"),
						save: b("save"),
						saving: b("saving"),
						ratio: b("ratio"),
						free: b("freeRatio"),
						original: b("originalRatio"),
						zoom: b("zoom"),
						undo: b("undo"),
						redo: b("redo"),
						reset: b("reset"),
						compare: b("compare"),
						x: "X",
						y: "Y",
						width: b("width"),
						height: b("height"),
						outputSize: b("outputSize"),
						rotation: b("rotation"),
						rotateLeft: b("rotateLeft"),
						rotateRight: b("rotateRight"),
						enableResize: b("enableResize"),
						noPreset: b("noPreset"),
						enableOptimize: b("enableOptimize"),
						outputFormat: b("outputFormat"),
						keepFormat: b("keepFormat"),
						quality: b("quality"),
						watermarkType: b("watermarkType"),
						noWatermark: b("noWatermark"),
						textWatermark: b("textWatermark"),
						imageWatermark: b("imageWatermark"),
						watermarkText: b("watermarkText"),
						watermarkFont: b("watermarkFont"),
						interfaceFont: b("interfaceFont"),
						sansFont: b("sansFont"),
						serifFont: b("serifFont"),
						color: b("color"),
						watermarkResource: b("watermarkResource"),
						watermarkPath: b("watermarkPath"),
						position: b("position"),
						topLeft: b("topLeft"),
						topRight: b("topRight"),
						center: b("center"),
						bottomLeft: b("bottomLeft"),
						bottomRight: b("bottomRight"),
						freePosition: b("freePosition"),
						dragWatermark: b("dragWatermark"),
						dragWatermarkHint: b("dragWatermarkHint"),
						opacity: b("opacity"),
						watermarkScale: b("watermarkScale"),
						saveMode: b("saveMode"),
						saveCopy: b("saveCopy"),
						overwrite: b("overwrite"),
						fileName: b("fileName"),
						fileNameTooLong: b("fileNameTooLongMaximum"),
						invalidFileName: b("invalidEntryName"),
						overwriteWarning: b("confirmImageOverwrite"),
						panHint: b("panHint"),
						conversionCopyHint: b("conversionCopyHint")
					},
					onClose: () => Kn(!1),
					onSave: async (e, t) => {
						let n = await s.applyImageActions(T, z.path, e, t);
						Kn(!1), Ht(`${b("imageCreated")}: ${n.entry.name} · ${n.result.width} × ${n.result.height} px`), await F(), Ni(/* @__PURE__ */ new Set([n.entry.path])), L(n.entry.path), Jn(Date.now());
					}
				})
			}),
			/* @__PURE__ */ (0, C.jsxs)(_.Suspense, {
				fallback: null,
				children: [lr && /* @__PURE__ */ (0, C.jsx)(lt, {
					x: lr.x,
					y: lr.y,
					onClose: () => ur(null),
					onSelect: () => {
						ur(null), lr.favorite ? uo(lr.link.path) : lo(lr.link);
					},
					items: [{
						id: "remove",
						label: b(lr.favorite ? "removeFavorite" : "unpinQuickAccess")
					}]
				}), sr && /* @__PURE__ */ (0, C.jsx)(lt, {
					x: sr.x,
					y: sr.y,
					onClose: () => cr(null),
					onSelect: Ta,
					items: [
						{
							id: sr.entry.directory ? "open" : "preview",
							label: sr.entry.directory ? b("open") : b("preview")
						},
						...d === "picker" && !sr.entry.directory ? [{
							id: "select",
							label: b("select"),
							disabled: !Bi(sr.entry)
						}] : [],
						{
							id: "download",
							label: b("download"),
							disabled: sr.entry.directory
						},
						{
							id: "share",
							label: b("share"),
							disabled: sr.entry.directory
						},
						...d === "manager" ? [
							...j.favorites && Gi(sr.entry) ? [{
								id: "favorite",
								label: Yt.favorites.includes(sr.entry.path) ? b("removeFavorite") : b("favorite")
							}] : [],
							...Ka && j.sidebarQuickAccess && Ki(sr.entry) ? [{
								id: "quick-access",
								label: Yt.quickAccess.includes(sr.entry.path) ? b("unpinQuickAccess") : b("pinQuickAccess")
							}] : [],
							...Er && !sr.entry.directory && sr.entry.capabilities?.["metadata.update"] !== !1 ? [{
								id: "asset-metadata",
								label: b("assetMetadata")
							}] : [],
							{
								id: "rename",
								label: b("rename"),
								disabled: sr.entry.capabilities?.rename === !1
							},
							{
								id: "copy",
								label: b("copy"),
								disabled: sr.entry.capabilities?.copy === !1
							},
							{
								id: "move",
								label: b("move"),
								disabled: sr.entry.capabilities?.move === !1
							},
							{
								id: "delete",
								label: b("remove"),
								disabled: sr.entry.capabilities?.delete === !1,
								danger: !0
							},
							...qi.filter((e) => e.slot === "context").map((e) => ({
								id: `plugin:${e.plugin}:${e.id}`,
								label: Fe(e, m),
								disabled: !Re(e, sr.entry)
							}))
						] : []
					]
				})]
			}),
			/* @__PURE__ */ (0, C.jsx)("div", {
				className: "sf-sr-only",
				"aria-live": "polite",
				children: R.length > 0 ? `${R.length} ${b("selectedCount")}` : Vt
			})
		]
	});
}
var vt = (e) => !!(e && (e.startsWith("text/") || [
	"application/json",
	"application/ld+json",
	"application/xml",
	"application/x-yaml",
	"application/yaml"
].includes(e) || e.endsWith("+json") || e.endsWith("+xml"))), yt = document.getElementById("sofinder-root");
if (!yt) throw Error("SoFinder root element was not found.");
var bt = JSON.parse(yt.dataset.config || "{}");
x(S(bt.language)).then((e) => {
	(0, y.createRoot)(yt).render(/* @__PURE__ */ (0, C.jsx)(_.StrictMode, { children: /* @__PURE__ */ (0, C.jsx)(_t, {
		config: bt,
		initialMessages: e
	}) }));
});
//#endregion
