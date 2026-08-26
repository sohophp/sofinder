import { n as e, r as t, t as n } from "./jsx-runtime-BuvfPIin.js";
import { n as r, t as i } from "./Modal-C1uNxIi2.js";
import { t as a } from "./nameValidation-DURyMFRU.js";
import { n as o, r as s, t as c } from "./EntryVisuals-CZ0BEx0U.js";
import { t as l } from "./format-GD3_dnvn.js";
//#region node_modules/.pnpm/scheduler@0.27.0/node_modules/scheduler/cjs/scheduler.production.js
var u = /* @__PURE__ */ t(((e) => {
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
			if (n(c) !== null) m = !0, ee || (ee = !0, ie());
			else {
				var t = n(l);
				t !== null && oe(x, t.startTime - e);
			}
		}
	}
	var ee = !1, S = -1, te = 5, ne = -1;
	function C() {
		return g ? !0 : !(e.unstable_now() - ne < te);
	}
	function re() {
		if (g = !1, ee) {
			var t = e.unstable_now();
			ne = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(S), S = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && C());) {
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
								u !== null && oe(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? ie() : ee = !1;
			}
		}
	}
	var ie;
	if (typeof y == "function") ie = function() {
		y(re);
	};
	else if (typeof MessageChannel < "u") {
		var w = new MessageChannel(), ae = w.port2;
		w.port1.onmessage = re, ie = function() {
			ae.postMessage(null);
		};
	} else ie = function() {
		_(re, 0);
	};
	function oe(t, n) {
		S = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : te = 0 < e ? Math.floor(1e3 / e) : 5;
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
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(S), S = -1) : h = !0, oe(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, ee || (ee = !0, ie()))), r;
	}, e.unstable_shouldYield = C, e.unstable_wrapCallback = function(e) {
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
})), d = /* @__PURE__ */ t(((e, t) => {
	t.exports = u();
})), f = /* @__PURE__ */ t(((t) => {
	var n = e();
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
	var c = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function l(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	t.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = a, t.createPortal = function(e, t) {
		var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(r(299));
		return s(e, t, null, n);
	}, t.flushSync = function(e) {
		var t = c.T, n = a.p;
		try {
			if (c.T = null, a.p = 2, e) return e();
		} finally {
			c.T = t, a.p = n, a.d.f();
		}
	}, t.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, a.d.C(e, t));
	}, t.prefetchDNS = function(e) {
		typeof e == "string" && a.d.D(e);
	}, t.preinit = function(e, t) {
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
	}, t.preinitModule = function(e, t) {
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
	}, t.preload = function(e, t) {
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
	}, t.preloadModule = function(e, t) {
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
	}, t.requestFormReset = function(e) {
		a.d.r(e);
	}, t.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, t.useFormState = function(e, t, n) {
		return c.H.useFormState(e, t, n);
	}, t.useFormStatus = function() {
		return c.H.useHostTransitionStatus();
	}, t.version = "19.2.8";
})), p = /* @__PURE__ */ t(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = f();
})), m = /* @__PURE__ */ t(((t) => {
	var n = d(), r = e(), i = p();
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
	function f(e) {
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
	function m(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = m(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), ee = Symbol.for("react.consumer"), S = Symbol.for("react.context"), te = Symbol.for("react.forward_ref"), ne = Symbol.for("react.suspense"), C = Symbol.for("react.suspense_list"), re = Symbol.for("react.memo"), ie = Symbol.for("react.lazy"), w = Symbol.for("react.activity"), ae = Symbol.for("react.memo_cache_sentinel"), oe = Symbol.iterator;
	function se(e) {
		return typeof e != "object" || !e ? null : (e = oe && e[oe] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var ce = Symbol.for("react.client.reference");
	function le(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === ce ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case ne: return "Suspense";
			case C: return "SuspenseList";
			case w: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case S: return e.displayName || "Context";
			case ee: return (e._context.displayName || "Context") + ".Consumer";
			case te:
				var t = e.render;
				return e = e.displayName, e || (e = t.displayName || t.name || "", e = e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case re: return t = e.displayName || null, t === null ? le(e.type) || "Memo" : t;
			case ie:
				t = e._payload, e = e._init;
				try {
					return le(e(t));
				} catch {}
		}
		return null;
	}
	var ue = Array.isArray, T = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, E = i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, de = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, fe = [], pe = -1;
	function me(e) {
		return { current: e };
	}
	function D(e) {
		0 > pe || (e.current = fe[pe], fe[pe] = null, pe--);
	}
	function O(e, t) {
		pe++, fe[pe] = e.current, e.current = t;
	}
	var he = me(null), ge = me(null), _e = me(null), ve = me(null);
	function ye(e, t) {
		switch (O(_e, t), O(ge, e), O(he, null), t.nodeType) {
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
		D(he), O(he, e);
	}
	function k() {
		D(he), D(ge), D(_e);
	}
	function be(e) {
		e.memoizedState !== null && O(ve, e);
		var t = he.current, n = Hd(t, e.type);
		t !== n && (O(ge, e), O(he, n));
	}
	function xe(e) {
		ge.current === e && (D(he), D(ge)), ve.current === e && (D(ve), Qf._currentValue = de);
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
	var ke = Object.prototype.hasOwnProperty, Ae = n.unstable_scheduleCallback, je = n.unstable_cancelCallback, Me = n.unstable_shouldYield, Ne = n.unstable_requestPaint, Pe = n.unstable_now, Fe = n.unstable_getCurrentPriorityLevel, Ie = n.unstable_ImmediatePriority, Le = n.unstable_UserBlockingPriority, Re = n.unstable_NormalPriority, ze = n.unstable_LowPriority, Be = n.unstable_IdlePriority, Ve = n.log, He = n.unstable_setDisableYieldValue, Ue = null, We = null;
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
		var e = E.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : mp(e.type)) : e;
	}
	function pt(e, t) {
		var n = E.p;
		try {
			return E.p = e, t();
		} finally {
			E.p = n;
		}
	}
	var mt = Math.random().toString(36).slice(2), ht = "__reactFiber$" + mt, gt = "__reactProps$" + mt, _t = "__reactContainer$" + mt, vt = "__reactEvents$" + mt, yt = "__reactListeners$" + mt, bt = "__reactHandles$" + mt, xt = "__reactResources$" + mt, St = "__reactMarker$" + mt;
	function A(e) {
		delete e[ht], delete e[gt], delete e[vt], delete e[yt], delete e[bt];
	}
	function Ct(e) {
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
	function wt(e) {
		if (e = e[ht] || e[_t]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Tt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(a(33));
	}
	function Et(e) {
		var t = e[xt];
		return t || (t = e[xt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}), t;
	}
	function Dt(e) {
		e[St] = !0;
	}
	var Ot = /* @__PURE__ */ new Set(), kt = {};
	function At(e, t) {
		jt(e, t), jt(e + "Capture", t);
	}
	function jt(e, t) {
		for (kt[e] = t, e = 0; e < t.length; e++) Ot.add(t[e]);
	}
	var Mt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Nt = {}, Pt = {};
	function Ft(e) {
		return ke.call(Pt, e) ? !0 : ke.call(Nt, e) ? !1 : Mt.test(e) ? Pt[e] = !0 : (Nt[e] = !0, !1);
	}
	function It(e, t, n) {
		if (Ft(t)) {
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
	function Lt(e, t, n) {
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
	function Rt(e, t, n, r) {
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
	function zt(e) {
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
	function Bt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Vt(e, t, n) {
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
	function Ht(e) {
		if (!e._valueTracker) {
			var t = Bt(e) ? "checked" : "value";
			e._valueTracker = Vt(e, t, "" + e[t]);
		}
	}
	function Ut(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Bt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	function Wt(e) {
		if (e = e || (typeof document < "u" ? document : void 0), e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var Gt = /[\n"\\]/g;
	function Kt(e) {
		return e.replace(Gt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function qt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + zt(t)) : e.value !== "" + zt(t) && (e.value = "" + zt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Yt(e, o, zt(n)) : Yt(e, o, zt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + zt(s) : e.removeAttribute("name");
	}
	function Jt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Ht(e);
				return;
			}
			n = n == null ? "" : "" + zt(n), t = t == null ? n : "" + zt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r = r ?? i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Ht(e);
	}
	function Yt(e, t, n) {
		t === "number" && Wt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Xt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + zt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Zt(e, t, n) {
		if (t != null && (t = "" + zt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + zt(n);
	}
	function Qt(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(a(92));
				if (ue(r)) {
					if (1 < r.length) throw Error(a(93));
					r = r[0];
				}
				n = r;
			}
			n ?? (n = ""), t = n;
		}
		n = zt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Ht(e);
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
	var j = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function en(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || j.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function tn(e, t, n) {
		if (t != null && typeof t != "object") throw Error(a(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var i in t) r = t[i], t.hasOwnProperty(i) && n[i] !== r && en(e, i, r);
		} else for (var o in t) t.hasOwnProperty(o) && en(e, o, t[o]);
	}
	function nn(e) {
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
	var rn = /* @__PURE__ */ new Map([
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
		var t = wt(e);
		if (t && (e = t.stateNode)) {
			var n = e[gt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (qt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Kt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var i = r[gt] || null;
								if (!i) throw Error(a(90));
								qt(r, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Ut(r);
					}
					break a;
				case "textarea":
					Zt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Xt(e, !!n.multiple, t, !1);
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
	function M(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Cn() {
		return !0;
	}
	function wn() {
		return !1;
	}
	function N(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Cn : wn, this.isPropagationStopped = wn, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Cn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Cn);
			},
			persist: function() {},
			isPersistent: Cn
		}), t;
	}
	var P = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, Tn = N(P), En = h({}, P, {
		view: 0,
		detail: 0
	}), Dn = N(En), On, kn, An, jn = h({}, En, {
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
		getModifierState: Hn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== An && (An && e.type === "mousemove" ? (On = e.screenX - An.screenX, kn = e.screenY - An.screenY) : kn = On = 0, An = e), On);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : kn;
		}
	}), Mn = N(jn), Nn = N(h({}, jn, { dataTransfer: 0 })), Pn = N(h({}, En, { relatedTarget: 0 })), Fn = N(h({}, P, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), In = N(h({}, P, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Ln = N(h({}, P, { data: 0 })), Rn = {
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
	}, zn = {
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
	}, Bn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Vn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Bn[e]) ? !!t[e] : !1;
	}
	function Hn() {
		return Vn;
	}
	var Un = N(h({}, En, {
		key: function(e) {
			if (e.key) {
				var t = Rn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = M(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? zn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Hn,
		charCode: function(e) {
			return e.type === "keypress" ? M(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? M(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Wn = N(h({}, jn, {
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
	})), F = N(h({}, En, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Hn
	})), I = N(h({}, P, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Gn = N(h({}, jn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Kn = N(h({}, P, {
		newState: 0,
		oldState: 0
	})), qn = [
		9,
		13,
		27,
		32
	], Jn = gn && "CompositionEvent" in window, Yn = null;
	gn && "documentMode" in document && (Yn = document.documentMode);
	var Xn = gn && "TextEvent" in window && !Yn, Zn = gn && (!Jn || Yn && 8 < Yn && 11 >= Yn), Qn = " ", $n = !1;
	function er(e, t) {
		switch (e) {
			case "keyup": return qn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function tr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var nr = !1;
	function rr(e, t) {
		switch (e) {
			case "compositionend": return tr(t);
			case "keypress": return t.which === 32 ? ($n = !0, Qn) : null;
			case "textInput": return e = t.data, e === Qn && $n ? null : e;
			default: return null;
		}
	}
	function ir(e, t) {
		if (nr) return e === "compositionend" || !Jn && er(e, t) ? (e = Sn(), xn = bn = yn = null, nr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return Zn && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var ar = {
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
	function or(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!ar[e.type] : t === "textarea";
	}
	function sr(e, t, n, r) {
		un ? dn ? dn.push(r) : dn = [r] : un = r, t = Ed(t, "onChange"), 0 < t.length && (n = new Tn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var cr = null, lr = null;
	function ur(e) {
		yd(e, 0);
	}
	function dr(e) {
		if (Ut(Tt(e))) return e;
	}
	function fr(e, t) {
		if (e === "change") return t;
	}
	var pr = !1;
	if (gn) {
		var mr;
		if (gn) {
			var hr = "oninput" in document;
			if (!hr) {
				var gr = document.createElement("div");
				gr.setAttribute("oninput", "return;"), hr = typeof gr.oninput == "function";
			}
			mr = hr;
		} else mr = !1;
		pr = mr && (!document.documentMode || 9 < document.documentMode);
	}
	function _r() {
		cr && (cr.detachEvent("onpropertychange", vr), lr = cr = null);
	}
	function vr(e) {
		if (e.propertyName === "value" && dr(lr)) {
			var t = [];
			sr(t, lr, e, ln(e)), mn(ur, t);
		}
	}
	function yr(e, t, n) {
		e === "focusin" ? (_r(), cr = t, lr = n, cr.attachEvent("onpropertychange", vr)) : e === "focusout" && _r();
	}
	function br(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return dr(lr);
	}
	function xr(e, t) {
		if (e === "click") return dr(t);
	}
	function Sr(e, t) {
		if (e === "input" || e === "change") return dr(t);
	}
	function Cr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var wr = typeof Object.is == "function" ? Object.is : Cr;
	function Tr(e, t) {
		if (wr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!ke.call(t, i) || !wr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Er(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Dr(e, t) {
		var n = Er(e);
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
			n = Er(n);
		}
	}
	function Or(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Or(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function kr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Wt(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Wt(e.document);
		}
		return t;
	}
	function Ar(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var jr = gn && "documentMode" in document && 11 >= document.documentMode, Mr = null, Nr = null, Pr = null, Fr = !1;
	function Ir(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Fr || Mr == null || Mr !== Wt(r) || (r = Mr, "selectionStart" in r && Ar(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Pr && Tr(Pr, r) || (Pr = r, r = Ed(Nr, "onSelect"), 0 < r.length && (t = new Tn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Mr)));
	}
	function Lr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Rr = {
		animationend: Lr("Animation", "AnimationEnd"),
		animationiteration: Lr("Animation", "AnimationIteration"),
		animationstart: Lr("Animation", "AnimationStart"),
		transitionrun: Lr("Transition", "TransitionRun"),
		transitionstart: Lr("Transition", "TransitionStart"),
		transitioncancel: Lr("Transition", "TransitionCancel"),
		transitionend: Lr("Transition", "TransitionEnd")
	}, zr = {}, Br = {};
	gn && (Br = document.createElement("div").style, "AnimationEvent" in window || (delete Rr.animationend.animation, delete Rr.animationiteration.animation, delete Rr.animationstart.animation), "TransitionEvent" in window || delete Rr.transitionend.transition);
	function L(e) {
		if (zr[e]) return zr[e];
		if (!Rr[e]) return e;
		var t = Rr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Br) return zr[e] = t[n];
		return e;
	}
	var Vr = L("animationend"), Hr = L("animationiteration"), Ur = L("animationstart"), Wr = L("transitionrun"), Gr = L("transitionstart"), Kr = L("transitioncancel"), qr = L("transitionend"), Jr = /* @__PURE__ */ new Map(), Yr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Yr.push("scrollEnd");
	function Xr(e, t) {
		Jr.set(e, t), At(t, [e]);
	}
	var Zr = typeof reportError == "function" ? reportError : function(e) {
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
	}, Qr = [], $r = 0, ei = 0;
	function ti() {
		for (var e = $r, t = ei = $r = 0; t < e;) {
			var n = Qr[t];
			Qr[t++] = null;
			var r = Qr[t];
			Qr[t++] = null;
			var i = Qr[t];
			Qr[t++] = null;
			var a = Qr[t];
			if (Qr[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && ai(n, i, a);
		}
	}
	function ni(e, t, n, r) {
		Qr[$r++] = e, Qr[$r++] = t, Qr[$r++] = n, Qr[$r++] = r, ei |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function ri(e, t, n, r) {
		return ni(e, t, n, r), oi(e);
	}
	function ii(e, t) {
		return ni(e, null, null, t), oi(e);
	}
	function ai(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Ke(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function oi(e) {
		if (50 < du) throw du = 0, fu = null, Error(a(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var si = {};
	function ci(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function li(e, t, n, r) {
		return new ci(e, t, n, r);
	}
	function ui(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function di(e, t) {
		var n = e.alternate;
		return n === null ? (n = li(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function fi(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function pi(e, t, n, r, i, o) {
		var s = 0;
		if (r = e, typeof e == "function") ui(e) && (s = 1);
		else if (typeof e == "string") s = Uf(e, n, he.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case w: return e = li(31, n, t, i), e.elementType = w, e.lanes = o, e;
			case y: return mi(n.children, i, o, t);
			case b:
				s = 8, i |= 24;
				break;
			case x: return e = li(12, n, t, i | 2), e.elementType = x, e.lanes = o, e;
			case ne: return e = li(13, n, t, i), e.elementType = ne, e.lanes = o, e;
			case C: return e = li(19, n, t, i), e.elementType = C, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case S:
						s = 10;
						break a;
					case ee:
						s = 9;
						break a;
					case te:
						s = 11;
						break a;
					case re:
						s = 14;
						break a;
					case ie:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(a(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = li(s, n, t, i), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function mi(e, t, n, r) {
		return e = li(7, e, r, t), e.lanes = n, e;
	}
	function hi(e, t, n) {
		return e = li(6, e, null, t), e.lanes = n, e;
	}
	function gi(e) {
		var t = li(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function _i(e, t, n) {
		return t = li(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var vi = /* @__PURE__ */ new WeakMap();
	function yi(e, t) {
		if (typeof e == "object" && e) {
			var n = vi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Oe(t)
			}, vi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Oe(t)
		};
	}
	var bi = [], xi = 0, Si = null, Ci = 0, wi = [], Ti = 0, Ei = null, Di = 1, Oi = "";
	function ki(e, t) {
		bi[xi++] = Ci, bi[xi++] = Si, Si = e, Ci = t;
	}
	function Ai(e, t, n) {
		wi[Ti++] = Di, wi[Ti++] = Oi, wi[Ti++] = Ei, Ei = e;
		var r = Di;
		e = Oi;
		var i = 32 - Ke(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Ke(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Di = 1 << 32 - Ke(t) + i | n << i | r, Oi = a + e;
		} else Di = 1 << a | n << i | r, Oi = e;
	}
	function ji(e) {
		e.return !== null && (ki(e, 1), Ai(e, 1, 0));
	}
	function Mi(e) {
		for (; e === Si;) Si = bi[--xi], bi[xi] = null, Ci = bi[--xi], bi[xi] = null;
		for (; e === Ei;) Ei = wi[--Ti], wi[Ti] = null, Oi = wi[--Ti], wi[Ti] = null, Di = wi[--Ti], wi[Ti] = null;
	}
	function Ni(e, t) {
		wi[Ti++] = Di, wi[Ti++] = Oi, wi[Ti++] = Ei, Di = t.id, Oi = t.overflow, Ei = e;
	}
	var Pi = null, R = null, z = !1, Fi = null, Ii = !1, Li = Error(a(519));
	function Ri(e) {
		throw Wi(yi(Error(a(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Li;
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
				Q("invalid", t), Jt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), Qt(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Md(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = sn), t = !0) : t = !1, t || Ri(e, !0);
	}
	function Bi(e) {
		for (Pi = e.return; Pi;) switch (Pi.tag) {
			case 5:
			case 31:
			case 13:
				Ii = !1;
				return;
			case 27:
			case 3:
				Ii = !0;
				return;
			default: Pi = Pi.return;
		}
	}
	function Vi(e) {
		if (e !== Pi) return !1;
		if (!z) return Bi(e), z = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || Ud(e.type, e.memoizedProps)), n = !n), n && R && Ri(e), Bi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(317));
			R = uf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(317));
			R = uf(e);
		} else t === 27 ? (t = R, Zd(e.type) ? (e = lf, lf = null, R = e) : R = t) : R = Pi ? cf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Hi() {
		R = Pi = null, z = !1;
	}
	function Ui() {
		var e = Fi;
		return e !== null && (Zl === null ? Zl = e : Zl.push.apply(Zl, e), Fi = null), e;
	}
	function Wi(e) {
		Fi === null ? Fi = [e] : Fi.push(e);
	}
	var Gi = me(null), Ki = null, qi = null;
	function Ji(e, t, n) {
		O(Gi, t._currentValue), t._currentValue = n;
	}
	function Yi(e) {
		e._currentValue = Gi.current, D(Gi);
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
					wr(i.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (i === ve.current) {
				if (s = i.alternate, s === null) throw Error(a(387));
				s.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e === null ? e = [Qf] : e.push(Qf));
			}
			i = i.return;
		}
		e !== null && Zi(t, e, n, r), t.flags |= 262144;
	}
	function $i(e) {
		for (e = e.firstContext; e !== null;) {
			if (!wr(e.context._currentValue, e.memoizedValue)) return !0;
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
	}, aa = n.unstable_scheduleCallback, oa = n.unstable_NormalPriority, sa = {
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
	var _a = T.S;
	T.S = function(e, t) {
		eu = Pe(), typeof t == "object" && t && typeof t.then == "function" && ma(e, t), _a !== null && _a(e, t);
	};
	var va = me(null);
	function ya() {
		var e = va.current;
		return e === null ? K.pooledCache : e;
	}
	function ba(e, t) {
		t === null ? O(va, va.current) : O(va, t.pool);
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
					if (e = K, e !== null && 100 < e.shellSuspendCounter) throw Error(a(482));
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
			return e = di(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = hi(n, e.mode, r), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var a = n.type;
			return a === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === a || typeof a == "object" && a && a.$$typeof === ie && Oa(a) === t.type) ? (t = i(t, n.props), Fa(t, n), t.return = e, t) : (t = pi(n.type, n.key, n.props, null, e.mode, r), Fa(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = _i(n, e.mode, r), t.return = e, t) : (t = i(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, a) {
			return t === null || t.tag !== 7 ? (t = mi(n, e.mode, r, a), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = hi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = pi(t.type, t.key, t.props, null, e.mode, n), Fa(n, t), n.return = e, n;
					case v: return t = _i(t, e.mode, n), t.return = e, t;
					case ie: return t = Oa(t), f(e, t, n);
				}
				if (ue(t) || se(t)) return t = mi(t, e.mode, n, null), t.return = e, t;
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
					case ie: return n = Oa(n), p(e, t, n, r);
				}
				if (ue(n) || se(n)) return i === null ? d(e, t, n, r, null) : null;
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
					case ie: return r = Oa(r), m(e, t, n, r, i);
				}
				if (ue(r) || se(r)) return e = e.get(n) || null, d(t, e, r, i, null);
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
			if (h === s.length) return n(i, d), z && ki(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return z && ki(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), z && ki(i, h), l;
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
			if (v.done) return n(i, h), z && ki(i, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(i, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return z && ki(i, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, i, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(i, e);
			}), z && ki(i, g), u;
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
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === ie && Oa(l) === r.type) {
										n(e, r.sibling), c = i(r, o.props), Fa(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === y ? (c = mi(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = pi(o.type, o.key, o.props, null, e.mode, c), Fa(c, o), c.return = e, e = c);
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
							c = _i(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case ie: return o = Oa(o), b(e, r, o, c);
				}
				if (ue(o)) return h(e, r, o, c);
				if (se(o)) {
					if (l = se(o), typeof l != "function") throw Error(a(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Pa(o), c);
				if (o.$$typeof === S) return b(e, r, na(e, o), c);
				Ia(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = i(r, o), c.return = e, e = c) : (n(e, r), c = hi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Na = 0;
				var i = b(e, t, n, r);
				return Ma = null, i;
			} catch (t) {
				if (t === Sa || t === wa) throw t;
				var a = li(29, t, null, e.mode);
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
		if (r = r.shared, G & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = oi(e), ai(e, null, n), t;
		}
		return ni(e, r, t, n), oi(e);
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
				if (p ? (J & f) === f : (r & f) === f) {
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
	var Qa = me(null), $a = me(0);
	function eo(e, t) {
		e = Wl, O($a, e), O(Qa, t), Wl = e | t.baseLanes;
	}
	function to() {
		O($a, Wl), O(Qa, Qa.current);
	}
	function no() {
		Wl = $a.current, D(Qa), D($a);
	}
	var ro = me(null), io = null;
	function ao(e) {
		var t = e.alternate;
		O(uo, uo.current & 1), O(ro, e), io === null && (t === null || Qa.current !== null || t.memoizedState !== null) && (io = e);
	}
	function oo(e) {
		O(uo, uo.current), O(ro, e), io === null && (io = e);
	}
	function so(e) {
		e.tag === 22 ? (O(uo, uo.current), O(ro, e), io === null && (io = e)) : co(e);
	}
	function co() {
		O(uo, uo.current), O(ro, ro.current);
	}
	function lo(e) {
		D(ro), io === e && (io = null), D(uo);
	}
	var uo = me(0);
	function fo(e) {
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
	var po = 0, B = null, V = null, mo = null, ho = !1, go = !1, _o = !1, vo = 0, yo = 0, bo = null, xo = 0;
	function H() {
		throw Error(a(321));
	}
	function So(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!wr(e[n], t[n])) return !1;
		return !0;
	}
	function Co(e, t, n, r, i, a) {
		return po = a, B = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, T.H = e === null || e.memoizedState === null ? Bs : Vs, _o = !1, a = n(r, i), _o = !1, go && (a = To(t, n, r, i)), wo(e), a;
	}
	function wo(e) {
		T.H = zs;
		var t = V !== null && V.next !== null;
		if (po = 0, mo = V = B = null, ho = !1, yo = 0, bo = null, t) throw Error(a(300));
		e === null || ic || (e = e.dependencies, e !== null && $i(e) && (ic = !0));
	}
	function To(e, t, n, r) {
		B = e;
		var i = 0;
		do {
			if (go && (bo = null), yo = 0, go = !1, 25 <= i) throw Error(a(301));
			if (i += 1, mo = V = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			T.H = Hs, o = t(n, r);
		} while (go);
		return o;
	}
	function Eo() {
		var e = T.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? No(t) : t, e = e.useState()[0], (V === null ? null : V.memoizedState) !== e && (B.flags |= 1024), t;
	}
	function Do() {
		var e = vo !== 0;
		return vo = 0, e;
	}
	function Oo(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function ko(e) {
		if (ho) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			ho = !1;
		}
		po = 0, mo = V = B = null, go = !1, yo = vo = 0, bo = null;
	}
	function Ao() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return mo === null ? B.memoizedState = mo = e : mo = mo.next = e, mo;
	}
	function jo() {
		if (V === null) {
			var e = B.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = V.next;
		var t = mo === null ? B.memoizedState : mo.next;
		if (t !== null) mo = t, V = e;
		else {
			if (e === null) throw B.alternate === null ? Error(a(467)) : Error(a(310));
			V = e, e = {
				memoizedState: V.memoizedState,
				baseState: V.baseState,
				baseQueue: V.baseQueue,
				queue: V.queue,
				next: null
			}, mo === null ? B.memoizedState = mo = e : mo = mo.next = e;
		}
		return mo;
	}
	function Mo() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function No(e) {
		var t = yo;
		return yo += 1, bo === null && (bo = []), e = Da(bo, e, t), t = B, (mo === null ? t.memoizedState : mo.next) === null && (t = t.alternate, T.H = t === null || t.memoizedState === null ? Bs : Vs), e;
	}
	function Po(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return No(e);
			if (e.$$typeof === S) return ta(e);
		}
		throw Error(a(438, String(e)));
	}
	function Fo(e) {
		var t = null, n = B.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = B.alternate;
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
		}), n === null && (n = Mo(), B.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ae;
		return t.index++, n;
	}
	function Io(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Lo(e) {
		return Ro(jo(), V, e);
	}
	function Ro(e, t, n) {
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
				if (f === u.lane ? (po & f) === f : (J & f) === f) {
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
					else if ((po & p) === p) {
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
					}, l === null ? (c = l = f, s = o) : l = l.next = f, B.lanes |= p, Gl |= p;
					f = u.action, _o && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, B.lanes |= f, Gl |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !wr(o, e.memoizedState) && (ic = !0, d && (n = pa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return i === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function zo(e) {
		var t = jo(), n = t.queue;
		if (n === null) throw Error(a(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, i = n.pending, o = t.memoizedState;
		if (i !== null) {
			n.pending = null;
			var s = i = i.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== i);
			wr(o, t.memoizedState) || (ic = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Bo(e, t, n) {
		var r = B, i = jo(), o = z;
		if (o) {
			if (n === void 0) throw Error(a(407));
			n = n();
		} else n = t();
		var s = !wr((V || i).memoizedState, n);
		if (s && (i.memoizedState = n, ic = !0), i = i.queue, ds(Uo.bind(null, r, i, e), [e]), i.getSnapshot !== t || s || mo !== null && mo.memoizedState.tag & 1) {
			if (r.flags |= 2048, os(9, { destroy: void 0 }, Ho.bind(null, r, i, n, t), null), K === null) throw Error(a(349));
			o || po & 127 || Vo(r, t, n);
		}
		return n;
	}
	function Vo(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = B.updateQueue, t === null ? (t = Mo(), B.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Ho(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Wo(t) && Go(e);
	}
	function Uo(e, t, n) {
		return n(function() {
			Wo(t) && Go(e);
		});
	}
	function Wo(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !wr(e, n);
		} catch {
			return !0;
		}
	}
	function Go(e) {
		var t = ii(e, 2);
		t !== null && hu(t, e, 2);
	}
	function Ko(e) {
		var t = Ao();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), _o) {
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
			lastRenderedReducer: Io,
			lastRenderedState: e
		}, t;
	}
	function qo(e, t, n, r) {
		return e.baseState = n, Ro(e, V, typeof r == "function" ? r : Io);
	}
	function Jo(e, t, n, r, i) {
		if (Is(e)) throw Error(a(485));
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
			T.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Yo(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Yo(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = T.T, o = {};
			T.T = o;
			try {
				var s = n(i, r), c = T.S;
				c !== null && c(o, s), Xo(e, t, s);
			} catch (n) {
				Qo(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), T.T = a;
			}
		} else try {
			a = n(i, r), Xo(e, t, a);
		} catch (n) {
			Qo(e, t, n);
		}
	}
	function Xo(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Zo(e, t, n);
		}, function(n) {
			return Qo(e, t, n);
		}) : Zo(e, t, n);
	}
	function Zo(e, t, n) {
		t.status = "fulfilled", t.value = n, $o(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Yo(e, n)));
	}
	function Qo(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, $o(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function $o(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function es(e, t) {
		return t;
	}
	function ts(e, t) {
		if (z) {
			var n = K.formState;
			if (n !== null) {
				a: {
					var r = B;
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
		return n = Ao(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: es,
			lastRenderedState: t
		}, n.queue = r, n = Ns.bind(null, B, r), r.dispatch = n, r = Ko(!1), a = Fs.bind(null, B, !1, r.queue), r = Ao(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Jo.bind(null, B, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function ns(e) {
		return rs(jo(), V, e);
	}
	function rs(e, t, n) {
		if (t = Ro(e, t, es)[0], e = Lo(Io)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = No(t);
		} catch (e) {
			throw e === Sa ? wa : e;
		}
		else r = t;
		t = jo();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (B.flags |= 2048, os(9, { destroy: void 0 }, is.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function is(e, t) {
		e.action = t;
	}
	function as(e) {
		var t = jo(), n = V;
		if (n !== null) return rs(t, n, e);
		jo(), t = t.memoizedState, n = jo();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function os(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = B.updateQueue, t === null && (t = Mo(), B.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function ss() {
		return jo().memoizedState;
	}
	function cs(e, t, n, r) {
		var i = Ao();
		B.flags |= e, i.memoizedState = os(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function ls(e, t, n, r) {
		var i = jo();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		V !== null && r !== null && So(r, V.memoizedState.deps) ? i.memoizedState = os(t, a, n, r) : (B.flags |= e, i.memoizedState = os(1 | t, a, n, r));
	}
	function us(e, t) {
		cs(8390656, 8, e, t);
	}
	function ds(e, t) {
		ls(2048, 8, e, t);
	}
	function fs(e) {
		B.flags |= 4;
		var t = B.updateQueue;
		if (t === null) t = Mo(), B.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function ps(e) {
		var t = jo().memoizedState;
		return fs({
			ref: t,
			nextImpl: e
		}), function() {
			if (G & 2) throw Error(a(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function ms(e, t) {
		return ls(4, 2, e, t);
	}
	function hs(e, t) {
		return ls(4, 4, e, t);
	}
	function gs(e, t) {
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
	function _s(e, t, n) {
		n = n == null ? null : n.concat([e]), ls(4, 4, gs.bind(null, t, e), n);
	}
	function vs() {}
	function ys(e, t) {
		var n = jo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && So(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function bs(e, t) {
		var n = jo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && So(t, r[1])) return r[0];
		if (r = e(), _o) {
			Ge(!0);
			try {
				e();
			} finally {
				Ge(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function xs(e, t, n) {
		return n === void 0 || po & 1073741824 && !(J & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = mu(), B.lanes |= e, Gl |= e, n);
	}
	function Ss(e, t, n, r) {
		return wr(n, t) ? n : Qa.current === null ? !(po & 42) || po & 1073741824 && !(J & 261930) ? (ic = !0, e.memoizedState = n) : (e = mu(), B.lanes |= e, Gl |= e, t) : (e = xs(e, n, r), wr(e, t) || (ic = !0), e);
	}
	function Cs(e, t, n, r, i) {
		var a = E.p;
		E.p = a !== 0 && 8 > a ? a : 8;
		var o = T.T, s = {};
		T.T = s, Fs(e, !1, t, n);
		try {
			var c = i(), l = T.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Ps(e, t, ga(c, r), pu(e)) : Ps(e, t, r, pu(e));
		} catch (n) {
			Ps(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, pu());
		} finally {
			E.p = a, o !== null && s.types !== null && (o.types = s.types), T.T = o;
		}
	}
	function ws() {}
	function Ts(e, t, n, r) {
		if (e.tag !== 5) throw Error(a(476));
		var i = Es(e).queue;
		Cs(e, i, t, de, n === null ? ws : function() {
			return Ds(e), n(r);
		});
	}
	function Es(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: de,
			baseState: de,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Io,
				lastRenderedState: de
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
				lastRenderedReducer: Io,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Ds(e) {
		var t = Es(e);
		t.next === null && (t = e.alternate.memoizedState), Ps(e, t.next.queue, {}, pu());
	}
	function Os() {
		return ta(Qf);
	}
	function ks() {
		return jo().memoizedState;
	}
	function As() {
		return jo().memoizedState;
	}
	function js(e) {
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
	function Ms(e, t, n) {
		var r = pu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Is(e) ? Ls(t, n) : (n = ri(e, t, n, r), n !== null && (hu(n, e, r), Rs(n, t, r)));
	}
	function Ns(e, t, n) {
		Ps(e, t, n, pu());
	}
	function Ps(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Is(e)) Ls(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, wr(s, o)) return ni(e, t, i, 0), K === null && ti(), !1;
			} catch {}
			if (n = ri(e, t, i, r), n !== null) return hu(n, e, r), Rs(n, t, r), !0;
		}
		return !1;
	}
	function Fs(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: dd(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Is(e)) {
			if (t) throw Error(a(479));
		} else t = ri(e, n, r, 2), t !== null && hu(t, e, 2);
	}
	function Is(e) {
		var t = e.alternate;
		return e === B || t !== null && t === B;
	}
	function Ls(e, t) {
		go = ho = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Rs(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, ct(e, n);
		}
	}
	var zs = {
		readContext: ta,
		use: Po,
		useCallback: H,
		useContext: H,
		useEffect: H,
		useImperativeHandle: H,
		useLayoutEffect: H,
		useInsertionEffect: H,
		useMemo: H,
		useReducer: H,
		useRef: H,
		useState: H,
		useDebugValue: H,
		useDeferredValue: H,
		useTransition: H,
		useSyncExternalStore: H,
		useId: H,
		useHostTransitionStatus: H,
		useFormState: H,
		useActionState: H,
		useOptimistic: H,
		useMemoCache: H,
		useCacheRefresh: H
	};
	zs.useEffectEvent = H;
	var Bs = {
		readContext: ta,
		use: Po,
		useCallback: function(e, t) {
			return Ao().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: ta,
		useEffect: us,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), cs(4194308, 4, gs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return cs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			cs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = Ao();
			t = t === void 0 ? null : t;
			var r = e();
			if (_o) {
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
			var r = Ao();
			if (n !== void 0) {
				var i = n(t);
				if (_o) {
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
			}, r.queue = e, e = e.dispatch = Ms.bind(null, B, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = Ao();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Ko(e);
			var t = e.queue, n = Ns.bind(null, B, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			return xs(Ao(), e, t);
		},
		useTransition: function() {
			var e = Ko(!1);
			return e = Cs.bind(null, B, e.queue, !0, !1), Ao().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = B, i = Ao();
			if (z) {
				if (n === void 0) throw Error(a(407));
				n = n();
			} else {
				if (n = t(), K === null) throw Error(a(349));
				J & 127 || Vo(r, t, n);
			}
			i.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return i.queue = o, us(Uo.bind(null, r, o, e), [e]), r.flags |= 2048, os(9, { destroy: void 0 }, Ho.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = Ao(), t = K.identifierPrefix;
			if (z) {
				var n = Oi, r = Di;
				n = (r & ~(1 << 32 - Ke(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = vo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = xo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Os,
		useFormState: ts,
		useActionState: ts,
		useOptimistic: function(e) {
			var t = Ao();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Fs.bind(null, B, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Fo,
		useCacheRefresh: function() {
			return Ao().memoizedState = js.bind(null, B);
		},
		useEffectEvent: function(e) {
			var t = Ao(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (G & 2) throw Error(a(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Vs = {
		readContext: ta,
		use: Po,
		useCallback: ys,
		useContext: ta,
		useEffect: ds,
		useImperativeHandle: _s,
		useInsertionEffect: ms,
		useLayoutEffect: hs,
		useMemo: bs,
		useReducer: Lo,
		useRef: ss,
		useState: function() {
			return Lo(Io);
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			return Ss(jo(), V.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Lo(Io)[0], t = jo().memoizedState;
			return [typeof e == "boolean" ? e : No(e), t];
		},
		useSyncExternalStore: Bo,
		useId: ks,
		useHostTransitionStatus: Os,
		useFormState: ns,
		useActionState: ns,
		useOptimistic: function(e, t) {
			return qo(jo(), V, e, t);
		},
		useMemoCache: Fo,
		useCacheRefresh: As
	};
	Vs.useEffectEvent = ps;
	var Hs = {
		readContext: ta,
		use: Po,
		useCallback: ys,
		useContext: ta,
		useEffect: ds,
		useImperativeHandle: _s,
		useInsertionEffect: ms,
		useLayoutEffect: hs,
		useMemo: bs,
		useReducer: zo,
		useRef: ss,
		useState: function() {
			return zo(Io);
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			var n = jo();
			return V === null ? xs(n, e, t) : Ss(n, V.memoizedState, e, t);
		},
		useTransition: function() {
			var e = zo(Io)[0], t = jo().memoizedState;
			return [typeof e == "boolean" ? e : No(e), t];
		},
		useSyncExternalStore: Bo,
		useId: ks,
		useHostTransitionStatus: Os,
		useFormState: as,
		useActionState: as,
		useOptimistic: function(e, t) {
			var n = jo();
			return V === null ? (n.baseState = e, [e, n.queue.dispatch]) : qo(n, V, e, t);
		},
		useMemoCache: Fo,
		useCacheRefresh: As
	};
	Hs.useEffectEvent = ps;
	function Us(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Ws = {
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
	function Gs(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Tr(n, r) || !Tr(i, a) : !0;
	}
	function Ks(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Ws.enqueueReplaceState(t, t.state, null);
	}
	function qs(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = h({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Js(e) {
		Zr(e);
	}
	function Ys(e) {
		console.error(e);
	}
	function Xs(e) {
		Zr(e);
	}
	function Zs(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Qs(e, t, n) {
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
	function $s(e, t, n) {
		return n = Ua(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Zs(e, t);
		}, n;
	}
	function ec(e) {
		return e = Ua(e), e.tag = 3, e;
	}
	function tc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Qs(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Qs(t, n, r), typeof i != "function" && (ru === null ? ru = /* @__PURE__ */ new Set([this]) : ru.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function nc(e, t, n, r, i) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Qi(t, n, i, !0), n = ro.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return io === null ? Du() : n.alternate === null && X === 0 && (X = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, r === Ta ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), Gu(e, r, i)), !1;
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
		if (z) return t = ro.current, t === null ? (r !== Li && (t = Error(a(423), { cause: r }), Wi(yi(t, n))), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, r = yi(r, n), i = $s(e.stateNode, r, i), Ka(e, i), X !== 4 && (X = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = i, r !== Li && (e = Error(a(422), { cause: r }), Wi(yi(e, n)))), !1;
		var o = Error(a(520), { cause: r });
		if (o = yi(o, n), Xl === null ? Xl = [o] : Xl.push(o), X !== 4 && (X = 2), t === null) return !0;
		r = yi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = i & -i, n.lanes |= e, e = $s(n.stateNode, r, e), Ka(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (ru === null || !ru.has(o)))) return n.flags |= 65536, i &= -i, n.lanes |= i, i = ec(i), tc(i, e, n, r), Ka(n, i), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var rc = Error(a(461)), ic = !1;
	function ac(e, t, n, r) {
		t.child = e === null ? za(t, null, n, r) : Ra(t, e.child, n, r);
	}
	function oc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return ea(t), r = Co(e, t, n, o, a, i), s = Do(), e !== null && !ic ? (Oo(e, t, i), Ac(e, t, i)) : (z && s && ji(t), t.flags |= 1, ac(e, t, r, i), t.child);
	}
	function sc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !ui(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, cc(e, t, a, r, i)) : (e = pi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !jc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Tr : n, n(o, r) && e.ref === t.ref) return Ac(e, t, i);
		}
		return t.flags |= 1, e = di(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function cc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Tr(a, r) && e.ref === t.ref) {
				if (ic = !1, t.pendingProps = r = a, jc(e, i)) e.flags & 131072 && (ic = !0);
				else return t.lanes = e.lanes, Ac(e, t, i);
			}
		}
		return gc(e, t, n, r, i);
	}
	function lc(e, t, n, r) {
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
				return dc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && ba(t, a === null ? null : a.cachePool), a === null ? to() : eo(t, a), so(t);
			else return r = t.lanes = 536870912, dc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && ba(t, null), to(), co(t)) : (ba(t, a.cachePool), eo(t, a), co(t), t.memoizedState = null);
		return ac(e, t, i, n), t.child;
	}
	function uc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function dc(e, t, n, r, i) {
		var a = ya();
		return a = a === null ? null : {
			parent: sa._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && ba(t, null), to(), so(t), e !== null && Qi(e, t, r, !0), t.childLanes = i, null;
	}
	function fc(e, t) {
		return t = Tc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function pc(e, t, n) {
		return Ra(t, e.child, null, n), e = fc(t, t.pendingProps), e.flags |= 2, lo(t), t.memoizedState = null, e;
	}
	function mc(e, t, n) {
		var r = t.pendingProps, i = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (z) {
				if (r.mode === "hidden") return e = fc(t, r), t.lanes = 536870912, uc(null, e);
				if (oo(t), (e = R) ? (e = rf(e, Ii), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ei === null ? null : {
						id: Di,
						overflow: Oi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = gi(e), n.return = t, t.child = n, Pi = t, R = null)) : e = null, e === null) throw Ri(t);
				return t.lanes = 536870912, null;
			}
			return fc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (oo(t), i) {
				if (t.flags & 256) t.flags &= -257, t = pc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(a(558));
			} else if (ic || Qi(e, t, n, !1), i = (n & e.childLanes) !== 0, ic || i) {
				if (r = K, r !== null && (s = lt(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, ii(e, s), hu(r, e, s), rc;
				Du(), t = pc(e, t, n);
			} else e = o.treeContext, R = cf(s.nextSibling), Pi = t, z = !0, Fi = null, Ii = !1, e !== null && Ni(t, e), t = fc(t, r), t.flags |= 4096;
			return t;
		}
		return e = di(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function hc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(a(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function gc(e, t, n, r, i) {
		return ea(t), n = Co(e, t, n, r, void 0, i), r = Do(), e !== null && !ic ? (Oo(e, t, i), Ac(e, t, i)) : (z && r && ji(t), t.flags |= 1, ac(e, t, n, i), t.child);
	}
	function _c(e, t, n, r, i, a) {
		return ea(t), t.updateQueue = null, n = To(t, r, n, i), wo(e), r = Do(), e !== null && !ic ? (Oo(e, t, a), Ac(e, t, a)) : (z && r && ji(t), t.flags |= 1, ac(e, t, n, a), t.child);
	}
	function vc(e, t, n, r, i) {
		if (ea(t), t.stateNode === null) {
			var a = si, o = n.contextType;
			typeof o == "object" && o && (a = ta(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Ws, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Va(t), o = n.contextType, a.context = typeof o == "object" && o ? ta(o) : si, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Us(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Ws.enqueueReplaceState(a, a.state, null), Ya(t, r, a, i), Ja(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = qs(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = si, typeof u == "object" && u && (o = ta(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Ks(t, a, r, o), Ba = !1;
			var f = t.memoizedState;
			a.state = f, Ya(t, r, a, i), Ja(), l = t.memoizedState, s || f !== l || Ba ? (typeof d == "function" && (Us(t, n, d, r), l = t.memoizedState), (c = Ba || Gs(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Ha(e, t), o = t.memoizedProps, u = qs(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = si, typeof l == "object" && l && (c = ta(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Ks(t, a, r, c), Ba = !1, f = t.memoizedState, a.state = f, Ya(t, r, a, i), Ja();
			var p = t.memoizedState;
			o !== d || f !== p || Ba || e !== null && e.dependencies !== null && $i(e.dependencies) ? (typeof s == "function" && (Us(t, n, s, r), p = t.memoizedState), (u = Ba || Gs(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && $i(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, hc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Ra(t, e.child, null, i), t.child = Ra(t, null, n, i)) : ac(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Ac(e, t, i), e;
	}
	function yc(e, t, n, r) {
		return Hi(), t.flags |= 256, ac(e, t, n, r), t.child;
	}
	var bc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function xc(e) {
		return {
			baseLanes: e,
			cachePool: xa()
		};
	}
	function Sc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= Jl), e;
	}
	function Cc(e, t, n) {
		var r = t.pendingProps, i = !1, o = !!(t.flags & 128), s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : !!(uo.current & 2)), s && (i = !0, t.flags &= -129), s = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (z) {
				if (i ? ao(t) : co(t), (e = R) ? (e = rf(e, Ii), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ei === null ? null : {
						id: Di,
						overflow: Oi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = gi(e), n.return = t, t.child = n, Pi = t, R = null)) : e = null, e === null) throw Ri(t);
				return of(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, i ? (co(t), i = t.mode, c = Tc({
				mode: "hidden",
				children: c
			}, i), r = mi(r, i, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = xc(n), r.childLanes = Sc(e, s, n), t.memoizedState = bc, uc(null, r)) : (ao(t), wc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (ao(t), t.flags &= -257, t = Ec(e, t, n)) : t.memoizedState === null ? (co(t), c = r.fallback, i = t.mode, r = Tc({
				mode: "visible",
				children: r.children
			}, i), c = mi(c, i, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, Ra(t, e.child, null, n), r = t.child, r.memoizedState = xc(n), r.childLanes = Sc(e, s, n), t.memoizedState = bc, t = uc(null, r)) : (co(t), t.child = e.child, t.flags |= 128, t = null);
			else if (ao(t), of(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(a(419)), r.stack = "", r.digest = s, Wi({
					value: r,
					source: null,
					stack: null
				}), t = Ec(e, t, n);
			} else if (ic || Qi(e, t, n, !1), s = (n & e.childLanes) !== 0, ic || s) {
				if (s = K, s !== null && (r = lt(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, ii(e, r), hu(s, e, r), rc;
				af(c) || Du(), t = Ec(e, t, n);
			} else af(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, R = cf(c.nextSibling), Pi = t, z = !0, Fi = null, Ii = !1, e !== null && Ni(t, e), t = wc(t, r.children), t.flags |= 4096);
			return t;
		}
		return i ? (co(t), c = r.fallback, i = t.mode, l = e.child, u = l.sibling, r = di(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = mi(c, i, n, null), c.flags |= 2) : c = di(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, uc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = xc(n) : (i = c.cachePool, i === null ? i = xa() : (l = sa._currentValue, i = i.parent === l ? i : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: i
		}), r.memoizedState = c, r.childLanes = Sc(e, s, n), t.memoizedState = bc, uc(e.child, r)) : (ao(t), n = e.child, e = n.sibling, n = di(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function wc(e, t) {
		return t = Tc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Tc(e, t) {
		return e = li(22, e, null, t), e.lanes = 0, e;
	}
	function Ec(e, t, n) {
		return Ra(t, e.child, null, n), e = wc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Dc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Xi(e.return, t, n);
	}
	function Oc(e, t, n, r, i, a) {
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
	function kc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = uo.current, s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, O(uo, o), ac(e, t, r, n), r = z ? Ci : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Dc(e, n, t);
			else if (e.tag === 19) Dc(e, n, t);
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
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && fo(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Oc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && fo(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Oc(t, !0, n, null, a, r);
				break;
			case "together":
				Oc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function Ac(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), Gl |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Qi(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(a(153));
		if (t.child !== null) {
			for (e = t.child, n = di(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = di(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function jc(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && $i(e)));
	}
	function Mc(e, t, n) {
		switch (t.tag) {
			case 3:
				ye(t, t.stateNode.containerInfo), Ji(t, sa, e.memoizedState.cache), Hi();
				break;
			case 27:
			case 5:
				be(t);
				break;
			case 4:
				ye(t, t.stateNode.containerInfo);
				break;
			case 10:
				Ji(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, oo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (ao(t), e = Ac(e, t, n), e === null ? null : e.sibling) : Cc(e, t, n) : (ao(t), t.flags |= 128, null);
				ao(t);
				break;
			case 19:
				var i = !!(e.flags & 128);
				if (r = (n & t.childLanes) !== 0, r || (Qi(e, t, n, !1), r = (n & t.childLanes) !== 0), i) {
					if (r) return kc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), O(uo, uo.current), r) break;
				return null;
			case 22: return t.lanes = 0, lc(e, t, n, t.pendingProps);
			case 24: Ji(t, sa, e.memoizedState.cache);
		}
		return Ac(e, t, n);
	}
	function Nc(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) ic = !0;
			else {
				if (!jc(e, n) && !(t.flags & 128)) return ic = !1, Mc(e, t, n);
				ic = !!(e.flags & 131072);
			}
		} else ic = !1, z && t.flags & 1048576 && Ai(t, Ci, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Oa(t.elementType), t.type = e, typeof e == "function") ui(e) ? (r = qs(e, r), t.tag = 1, t = vc(null, t, e, r, n)) : (t.tag = 0, t = gc(null, t, e, r, n));
					else {
						if (e != null) {
							var i = e.$$typeof;
							if (i === te) {
								t.tag = 11, t = oc(null, t, e, r, n);
								break a;
							}
							if (i === re) {
								t.tag = 14, t = sc(null, t, e, r, n);
								break a;
							}
						}
						throw t = le(e) || e, Error(a(306, t, ""));
					}
				}
				return t;
			case 0: return gc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, i = qs(r, t.pendingProps), vc(e, t, r, i, n);
			case 3:
				a: {
					if (ye(t, t.stateNode.containerInfo), e === null) throw Error(a(387));
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
							t = yc(e, t, r, n);
							break a;
						}
						if (r !== i) {
							i = yi(Error(a(424)), t), Wi(i), t = yc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (R = cf(e.firstChild), Pi = t, z = !0, Fi = null, Ii = !0, n = za(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					} else {
						if (Hi(), r === i) {
							t = Ac(e, t, n);
							break a;
						}
						ac(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return hc(e, t), e === null ? (n = kf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : z || (n = t.type, e = t.pendingProps, r = Bd(_e.current).createElement(n), r[ht] = t, r[gt] = e, Pd(r, n, e), Dt(r), t.stateNode = r) : t.memoizedState = kf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return be(t), e === null && z && (r = t.stateNode = ff(t.type, t.pendingProps, _e.current), Pi = t, Ii = !0, i = R, Zd(t.type) ? (lf = i, R = cf(r.firstChild)) : R = i), ac(e, t, t.pendingProps.children, n), hc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && z && ((i = r = R) && (r = tf(r, t.type, t.pendingProps, Ii), r === null ? i = !1 : (t.stateNode = r, Pi = t, R = cf(r.firstChild), Ii = !1, i = !0)), i || Ri(t)), be(t), i = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Ud(i, o) ? r = null : s !== null && Ud(i, s) && (t.flags |= 32), t.memoizedState !== null && (i = Co(e, t, Eo, null, null, n), Qf._currentValue = i), hc(e, t), ac(e, t, r, n), t.child;
			case 6: return e === null && z && ((e = n = R) && (n = nf(n, t.pendingProps, Ii), n === null ? e = !1 : (t.stateNode = n, Pi = t, R = null, e = !0)), e || Ri(t)), null;
			case 13: return Cc(e, t, n);
			case 4: return ye(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Ra(t, null, r, n) : ac(e, t, r, n), t.child;
			case 11: return oc(e, t, t.type, t.pendingProps, n);
			case 7: return ac(e, t, t.pendingProps, n), t.child;
			case 8: return ac(e, t, t.pendingProps.children, n), t.child;
			case 12: return ac(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, Ji(t, t.type, r.value), ac(e, t, r.children, n), t.child;
			case 9: return i = t.type._context, r = t.pendingProps.children, ea(t), i = ta(i), r = r(i), t.flags |= 1, ac(e, t, r, n), t.child;
			case 14: return sc(e, t, t.type, t.pendingProps, n);
			case 15: return cc(e, t, t.type, t.pendingProps, n);
			case 19: return kc(e, t, n);
			case 31: return mc(e, t, n);
			case 22: return lc(e, t, n, t.pendingProps);
			case 24: return ea(t), r = ta(sa), e === null ? (i = ya(), i === null && (i = K, o = ca(), i.pooledCache = o, o.refCount++, o !== null && (i.pooledCacheLanes |= n), i = o), t.memoizedState = {
				parent: r,
				cache: i
			}, Va(t), Ji(t, sa, i)) : ((e.lanes & n) !== 0 && (Ha(e, t), Ya(t, null, null, n), Ja()), i = e.memoizedState, o = t.memoizedState, i.parent === r ? (r = o.cache, Ji(t, sa, r), r !== i.cache && Zi(t, [sa], n, !0)) : (i = {
				parent: r,
				cache: r
			}, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), Ji(t, sa, r))), ac(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(a(156, t.tag));
	}
	function Pc(e) {
		e.flags |= 4;
	}
	function Fc(e, t, n, r, i) {
		if ((t = !!(e.mode & 32)) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (wu()) e.flags |= 8192;
				else throw ka = Ta, Ca;
			}
		} else e.flags &= -16777217;
	}
	function Ic(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Wf(t)) {
			if (wu()) e.flags |= 8192;
			else throw ka = Ta, Ca;
		}
	}
	function Lc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : rt(), e.lanes |= t, Yl |= t);
	}
	function Rc(e, t) {
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
	function U(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function zc(e, t, n) {
		var r = t.pendingProps;
		switch (Mi(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return U(t), null;
			case 1: return U(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Yi(sa), k(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Vi(t) ? Pc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Ui())), U(t), null;
			case 26:
				var i = t.type, o = t.memoizedState;
				return e === null ? (Pc(t), o === null ? (U(t), Fc(t, i, null, r, n)) : (U(t), Ic(t, o))) : o ? o === e.memoizedState ? (U(t), t.flags &= -16777217) : (Pc(t), U(t), Ic(t, o)) : (e = e.memoizedProps, e !== r && Pc(t), U(t), Fc(t, i, e, r, n)), null;
			case 27:
				if (xe(t), n = _e.current, i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(a(166));
						return U(t), null;
					}
					e = he.current, Vi(t) ? zi(t, e) : (e = ff(i, r, n), t.stateNode = e, Pc(t));
				}
				return U(t), null;
			case 5:
				if (xe(t), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(a(166));
						return U(t), null;
					}
					if (o = he.current, Vi(t)) zi(t, o);
					else {
						var s = Bd(_e.current);
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
						r && Pc(t);
					}
				}
				return U(t), Fc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(a(166));
					if (e = _e.current, Vi(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, i = Pi, i !== null) switch (i.tag) {
							case 27:
							case 5: r = i.memoizedProps;
						}
						e[ht] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Md(e.nodeValue, n)), e || Ri(t, !0);
					} else e = Bd(e).createTextNode(r), e[ht] = t, t.stateNode = e;
				}
				return U(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Vi(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(a(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(557));
							e[ht] = t;
						} else Hi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						U(t), e = !1;
					} else n = Ui(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (lo(t), t) : (lo(t), null);
					if (t.flags & 128) throw Error(a(558));
				}
				return U(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (i = Vi(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!i) throw Error(a(318));
							if (i = t.memoizedState, i = i === null ? null : i.dehydrated, !i) throw Error(a(317));
							i[ht] = t;
						} else Hi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						U(t), i = !1;
					} else i = Ui(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
					if (!i) return t.flags & 256 ? (lo(t), t) : (lo(t), null);
				}
				return lo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, i = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (i = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== i && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Lc(t, t.updateQueue), U(t), null);
			case 4: return k(), e === null && Sd(t.stateNode.containerInfo), U(t), null;
			case 10: return Yi(t.type), U(t), null;
			case 19:
				if (D(uo), r = t.memoizedState, r === null) return U(t), null;
				if (i = !!(t.flags & 128), o = r.rendering, o === null) {
					if (i) Rc(r, !1);
					else {
						if (X !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = fo(e), o !== null) {
								for (t.flags |= 128, Rc(r, !1), e = o.updateQueue, t.updateQueue = e, Lc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) fi(n, e), n = n.sibling;
								return O(uo, uo.current & 1 | 2), z && ki(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Pe() > tu && (t.flags |= 128, i = !0, Rc(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!i) {
						if (e = fo(o), e !== null) {
							if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, Lc(t, e), Rc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !z) return U(t), null;
						} else 2 * Pe() - r.renderingStartTime > tu && n !== 536870912 && (t.flags |= 128, i = !0, Rc(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (U(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Pe(), e.sibling = null, n = uo.current, O(uo, i ? n & 1 | 2 : n & 1), z && ki(t, r.treeForkCount), e);
			case 22:
			case 23: return lo(t), no(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (U(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : U(t), n = t.updateQueue, n !== null && Lc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && D(va), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Yi(sa), U(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(a(156, t.tag));
	}
	function Bc(e, t) {
		switch (Mi(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Yi(sa), k(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return xe(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (lo(t), t.alternate === null) throw Error(a(340));
					Hi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (lo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(a(340));
					Hi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return D(uo), null;
			case 4: return k(), null;
			case 10: return Yi(t.type), null;
			case 22:
			case 23: return lo(t), no(), e !== null && D(va), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Yi(sa), null;
			case 25: return null;
			default: return null;
		}
	}
	function Vc(e, t) {
		switch (Mi(t), t.tag) {
			case 3:
				Yi(sa), k();
				break;
			case 26:
			case 27:
			case 5:
				xe(t);
				break;
			case 4:
				k();
				break;
			case 31:
				t.memoizedState !== null && lo(t);
				break;
			case 13:
				lo(t);
				break;
			case 19:
				D(uo);
				break;
			case 10:
				Yi(t.type);
				break;
			case 22:
			case 23:
				lo(t), no(), e !== null && D(va);
				break;
			case 24: Yi(sa);
		}
	}
	function Hc(e, t) {
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
	function Uc(e, t, n) {
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
	function Wc(e) {
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
	function Gc(e, t, n) {
		n.props = qs(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Kc(e, t) {
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
	function qc(e, t) {
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
	function Jc(e) {
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
	function Yc(e, t, n) {
		try {
			var r = e.stateNode;
			Fd(r, e.type, n, t), r[gt] = t;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Xc(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Zd(e.type) || e.tag === 4;
	}
	function Zc(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Xc(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Zd(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Qc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = sn));
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (Qc(e, t, n), e = e.sibling; e !== null;) Qc(e, t, n), e = e.sibling;
	}
	function $c(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode), e = e.child, e !== null)) for ($c(e, t, n), e = e.sibling; e !== null;) $c(e, t, n), e = e.sibling;
	}
	function el(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Pd(t, r, n), t[ht] = e, t[gt] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var tl = !1, nl = !1, rl = !1, il = typeof WeakSet == "function" ? WeakSet : Set, al = null;
	function ol(e, t) {
		if (e = e.containerInfo, Rd = sp, e = kr(e), Ar(e)) {
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
		}, sp = !1, al = t; al !== null;) if (t = al, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, al = e;
		else for (; al !== null;) {
			switch (t = al, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) i = e[n], i.ref.impl = i.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, i = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = qs(n.type, i);
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
				e.return = t.return, al = e;
				break;
			}
			al = t.return;
		}
	}
	function sl(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				xl(e, n), r & 4 && Hc(5, n);
				break;
			case 1:
				if (xl(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Z(n, n.return, e);
					}
					else {
						var i = qs(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Z(n, n.return, e);
						}
					}
				}
				r & 64 && Wc(n), r & 512 && Kc(n, n.return);
				break;
			case 3:
				if (xl(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
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
			case 27: t === null && r & 4 && el(n);
			case 26:
			case 5:
				xl(e, n), t === null && r & 4 && Jc(n), r & 512 && Kc(n, n.return);
				break;
			case 12:
				xl(e, n);
				break;
			case 31:
				xl(e, n), r & 4 && fl(e, n);
				break;
			case 13:
				xl(e, n), r & 4 && pl(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = Ju.bind(null, n), sf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || tl, !r) {
					t = t !== null && t.memoizedState !== null || nl, i = tl;
					var a = nl;
					tl = r, (nl = t) && !a ? Cl(e, n, !!(n.subtreeFlags & 8772)) : xl(e, n), tl = i, nl = a;
				}
				break;
			case 30: break;
			default: xl(e, n);
		}
	}
	function cl(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, cl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && A(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var W = null, ll = !1;
	function ul(e, t, n) {
		for (n = n.child; n !== null;) dl(e, t, n), n = n.sibling;
	}
	function dl(e, t, n) {
		if (We && typeof We.onCommitFiberUnmount == "function") try {
			We.onCommitFiberUnmount(Ue, n);
		} catch {}
		switch (n.tag) {
			case 26:
				nl || qc(n, t), ul(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				nl || qc(n, t);
				var r = W, i = ll;
				Zd(n.type) && (W = n.stateNode, ll = !1), ul(e, t, n), pf(n.stateNode), W = r, ll = i;
				break;
			case 5: nl || qc(n, t);
			case 6:
				if (r = W, i = ll, W = null, ul(e, t, n), W = r, ll = i, W !== null) {
					if (ll) try {
						(W.nodeType === 9 ? W.body : W.nodeName === "HTML" ? W.ownerDocument.body : W).removeChild(n.stateNode);
					} catch (e) {
						Z(n, t, e);
					}
					else try {
						W.removeChild(n.stateNode);
					} catch (e) {
						Z(n, t, e);
					}
				}
				break;
			case 18:
				W !== null && (ll ? (e = W, Qd(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Np(e)) : Qd(W, n.stateNode));
				break;
			case 4:
				r = W, i = ll, W = n.stateNode.containerInfo, ll = !0, ul(e, t, n), W = r, ll = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Uc(2, n, t), nl || Uc(4, n, t), ul(e, t, n);
				break;
			case 1:
				nl || (qc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Gc(n, t, r)), ul(e, t, n);
				break;
			case 21:
				ul(e, t, n);
				break;
			case 22:
				nl = (r = nl) || n.memoizedState !== null, ul(e, t, n), nl = r;
				break;
			default: ul(e, t, n);
		}
	}
	function fl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Np(e);
			} catch (e) {
				Z(t, t.return, e);
			}
		}
	}
	function pl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Np(e);
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function ml(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new il()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new il()), t;
			default: throw Error(a(435, e.tag));
		}
	}
	function hl(e, t) {
		var n = ml(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Yu.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function gl(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (Zd(c.type)) {
							W = c.stateNode, ll = !1;
							break a;
						}
						break;
					case 5:
						W = c.stateNode, ll = !1;
						break a;
					case 3:
					case 4:
						W = c.stateNode.containerInfo, ll = !0;
						break a;
				}
				c = c.return;
			}
			if (W === null) throw Error(a(160));
			dl(o, s, i), W = null, ll = !1, o = i.alternate, o !== null && (o.return = null), i.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) vl(t, e), t = t.sibling;
	}
	var _l = null;
	function vl(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				gl(t, e), yl(e), r & 4 && (Uc(3, e, e.return), Hc(3, e), Uc(5, e, e.return));
				break;
			case 1:
				gl(t, e), yl(e), r & 512 && (nl || n === null || qc(n, n.return)), r & 64 && tl && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var i = _l;
				if (gl(t, e), yl(e), r & 512 && (nl || n === null || qc(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) {
						if (r === null) {
							if (e.stateNode === null) {
								a: {
									r = e.type, n = e.memoizedProps, i = i.ownerDocument || i;
									b: switch (r) {
										case "title":
											o = i.getElementsByTagName("title")[0], (!o || o[St] || o[ht] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = i.createElement(r), i.head.insertBefore(o, i.querySelector("head > title"))), Pd(o, r, n), o[ht] = e, Dt(o), r = o;
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
									o[ht] = e, Dt(o), r = o;
								}
								e.stateNode = r;
							} else Hf(i, e.type, e.stateNode);
						} else e.stateNode = If(i, r, e.memoizedProps);
					} else o === r ? r === null && e.stateNode !== null && Yc(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Hf(i, e.type, e.stateNode) : If(i, r, e.memoizedProps));
				}
				break;
			case 27:
				gl(t, e), yl(e), r & 512 && (nl || n === null || qc(n, n.return)), n !== null && r & 4 && Yc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (gl(t, e), yl(e), r & 512 && (nl || n === null || qc(n, n.return)), e.flags & 32) {
					i = e.stateNode;
					try {
						$t(i, "");
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (i = e.memoizedProps, Yc(e, i, n === null ? i : n.memoizedProps)), r & 1024 && (rl = !0);
				break;
			case 6:
				if (gl(t, e), yl(e), r & 4) {
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
				if (Bf = null, i = _l, _l = gf(t.containerInfo), gl(t, e), _l = i, yl(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Np(t.containerInfo);
				} catch (t) {
					Z(e, e.return, t);
				}
				rl && (rl = !1, bl(e));
				break;
			case 4:
				r = _l, _l = gf(e.stateNode.containerInfo), gl(t, e), yl(e), _l = r;
				break;
			case 12:
				gl(t, e), yl(e);
				break;
			case 31:
				gl(t, e), yl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, hl(e, r)));
				break;
			case 13:
				gl(t, e), yl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && ($l = Pe()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, hl(e, r)));
				break;
			case 22:
				i = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = tl, d = nl;
				if (tl = u || i, nl = d || l, gl(t, e), nl = d, tl = u, yl(e), r & 8192) a: for (t = e.stateNode, t._visibility = i ? t._visibility & -2 : t._visibility | 1, i && (n === null || l || tl || nl || Sl(e)), n = null, t = e;;) {
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
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, hl(e, n))));
				break;
			case 19:
				gl(t, e), yl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, hl(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: gl(t, e), yl(e);
		}
	}
	function yl(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Xc(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(a(160));
				switch (n.tag) {
					case 27:
						var i = n.stateNode;
						$c(e, Zc(e), i);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && ($t(o, ""), n.flags &= -33), $c(e, Zc(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						Qc(e, Zc(e), s);
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
	function bl(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			bl(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function xl(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) sl(e, t.alternate, t), t = t.sibling;
	}
	function Sl(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Uc(4, t, t.return), Sl(t);
					break;
				case 1:
					qc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && Gc(t, t.return, n), Sl(t);
					break;
				case 27: pf(t.stateNode);
				case 26:
				case 5:
					qc(t, t.return), Sl(t);
					break;
				case 22:
					t.memoizedState === null && Sl(t);
					break;
				case 30:
					Sl(t);
					break;
				default: Sl(t);
			}
			e = e.sibling;
		}
	}
	function Cl(e, t, n) {
		for (n = n && !!(t.subtreeFlags & 8772), t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Cl(i, a, n), Hc(4, a);
					break;
				case 1:
					if (Cl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
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
					n && o & 64 && Wc(a), Kc(a, a.return);
					break;
				case 27: el(a);
				case 26:
				case 5:
					Cl(i, a, n), n && r === null && o & 4 && Jc(a), Kc(a, a.return);
					break;
				case 12:
					Cl(i, a, n);
					break;
				case 31:
					Cl(i, a, n), n && o & 4 && fl(i, a);
					break;
				case 13:
					Cl(i, a, n), n && o & 4 && pl(i, a);
					break;
				case 22:
					a.memoizedState === null && Cl(i, a, n), Kc(a, a.return);
					break;
				case 30: break;
				default: Cl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function wl(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && la(n));
	}
	function Tl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && la(e));
	}
	function El(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) Dl(e, t, n, r), t = t.sibling;
	}
	function Dl(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				El(e, t, n, r), i & 2048 && Hc(9, t);
				break;
			case 1:
				El(e, t, n, r);
				break;
			case 3:
				El(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && la(e)));
				break;
			case 12:
				if (i & 2048) {
					El(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						Z(t, t.return, e);
					}
				} else El(e, t, n, r);
				break;
			case 31:
				El(e, t, n, r);
				break;
			case 13:
				El(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? El(e, t, n, r) : (a._visibility |= 2, Ol(e, t, n, r, !!(t.subtreeFlags & 10256) || !1)) : a._visibility & 2 ? El(e, t, n, r) : kl(e, t), i & 2048 && wl(o, t);
				break;
			case 24:
				El(e, t, n, r), i & 2048 && Tl(t.alternate, t);
				break;
			default: El(e, t, n, r);
		}
	}
	function Ol(e, t, n, r, i) {
		for (i = i && (!!(t.subtreeFlags & 10256) || !1), t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Ol(a, o, s, c, i), Hc(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Ol(a, o, s, c, i)) : u._visibility & 2 ? Ol(a, o, s, c, i) : kl(a, o), i && l & 2048 && wl(o.alternate, o);
					break;
				case 24:
					Ol(a, o, s, c, i), i && l & 2048 && Tl(o.alternate, o);
					break;
				default: Ol(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function kl(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					kl(n, r), i & 2048 && wl(r.alternate, r);
					break;
				case 24:
					kl(n, r), i & 2048 && Tl(r.alternate, r);
					break;
				default: kl(n, r);
			}
			t = t.sibling;
		}
	}
	var Al = 8192;
	function jl(e, t, n) {
		if (e.subtreeFlags & Al) for (e = e.child; e !== null;) Ml(e, t, n), e = e.sibling;
	}
	function Ml(e, t, n) {
		switch (e.tag) {
			case 26:
				jl(e, t, n), e.flags & Al && e.memoizedState !== null && Gf(n, _l, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				jl(e, t, n);
				break;
			case 3:
			case 4:
				var r = _l;
				_l = gf(e.stateNode.containerInfo), jl(e, t, n), _l = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Al, Al = 16777216, jl(e, t, n), Al = r) : jl(e, t, n));
				break;
			default: jl(e, t, n);
		}
	}
	function Nl(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Pl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				al = r, Ll(r, e);
			}
			Nl(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Fl(e), e = e.sibling;
	}
	function Fl(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Pl(e), e.flags & 2048 && Uc(9, e, e.return);
				break;
			case 3:
				Pl(e);
				break;
			case 12:
				Pl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Il(e)) : Pl(e);
				break;
			default: Pl(e);
		}
	}
	function Il(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				al = r, Ll(r, e);
			}
			Nl(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Uc(8, t, t.return), Il(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Il(t));
					break;
				default: Il(t);
			}
			e = e.sibling;
		}
	}
	function Ll(e, t) {
		for (; al !== null;) {
			var n = al;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Uc(8, n, t);
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
			if (r = n.child, r !== null) r.return = n, al = r;
			else a: for (n = e; al !== null;) {
				r = al;
				var i = r.sibling, a = r.return;
				if (cl(r), r === n) {
					al = null;
					break a;
				}
				if (i !== null) {
					i.return = a, al = i;
					break a;
				}
				al = a;
			}
		}
	}
	var Rl = {
		getCacheForType: function(e) {
			var t = ta(sa), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return ta(sa).controller.signal;
		}
	}, zl = typeof WeakMap == "function" ? WeakMap : Map, G = 0, K = null, q = null, J = 0, Y = 0, Bl = null, Vl = !1, Hl = !1, Ul = !1, Wl = 0, X = 0, Gl = 0, Kl = 0, ql = 0, Jl = 0, Yl = 0, Xl = null, Zl = null, Ql = !1, $l = 0, eu = 0, tu = Infinity, nu = null, ru = null, iu = 0, au = null, ou = null, su = 0, cu = 0, lu = null, uu = null, du = 0, fu = null;
	function pu() {
		return G & 2 && J !== 0 ? J & -J : T.T === null ? ft() : dd();
	}
	function mu() {
		if (Jl === 0) {
			if (!(J & 536870912) || z) {
				var e = Ze;
				Ze <<= 1, !(Ze & 3932160) && (Ze = 262144), Jl = e;
			} else Jl = 536870912;
		}
		return e = ro.current, e !== null && (e.flags |= 32), Jl;
	}
	function hu(e, t, n) {
		(e === K && (Y === 2 || Y === 9) || e.cancelPendingCommit !== null) && (Su(e, 0), yu(e, J, Jl, !1)), at(e, n), (!(G & 2) || e !== K) && (e === K && (!(G & 2) && (Kl |= n), X === 4 && yu(e, J, Jl, !1)), rd(e));
	}
	function gu(e, t, n) {
		if (G & 6) throw Error(a(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || tt(e, t), i = r ? Au(e, t) : Ou(e, t, !0), o = r;
		do {
			if (i === 0) {
				Hl && !r && yu(e, t, 0, !1);
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
							if (Ul && !l) {
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
						yu(r, t, Jl, !Vl);
						break a;
					case 2:
						Zl = null;
						break;
					case 3:
					case 5: break;
					default: throw Error(a(329));
				}
				if ((t & 62914560) === t && (i = $l + 300 - Pe(), 10 < i)) {
					if (yu(r, t, Jl, !Vl), et(r, 0, !0) !== 0) break a;
					su = t, r.timeoutHandle = Kd(_u.bind(null, r, n, Zl, nu, Ql, t, Jl, Kl, Yl, Vl, o, "Throttled", -0, 0), i);
					break a;
				}
				_u(r, n, Zl, nu, Ql, t, Jl, Kl, Yl, Vl, o, null, -0, 0);
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
			}, Ml(t, a, d);
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
					if (!wr(a(), i)) return !1;
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
		return G & 6 ? !0 : (id(0, !1), !1);
	}
	function xu() {
		if (q !== null) {
			if (Y === 0) var e = q.return;
			else e = q, qi = Ki = null, ko(e), Ma = null, Na = 0, e = q;
			for (; e !== null;) Vc(e.alternate, e), e = e.return;
			q = null;
		}
	}
	function Su(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, qd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), su = 0, xu(), K = e, q = n = di(e.current, null), J = t, Y = 0, Bl = null, Vl = !1, Hl = tt(e, t), Ul = !1, Yl = Jl = ql = Kl = Gl = X = 0, Zl = Xl = null, Ql = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - Ke(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Wl = t, ti(), n;
	}
	function Cu(e, t) {
		B = null, T.H = zs, t === Sa || t === wa ? (t = Aa(), Y = 3) : t === Ca ? (t = Aa(), Y = 4) : Y = t === rc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Bl = t, q === null && (X = 1, Zs(e, yi(t, e.current)));
	}
	function wu() {
		var e = ro.current;
		return e === null ? !0 : (J & 4194048) === J ? io === null : (J & 62914560) === J || J & 536870912 ? e === io : !1;
	}
	function Tu() {
		var e = T.H;
		return T.H = zs, e === null ? zs : e;
	}
	function Eu() {
		var e = T.A;
		return T.A = Rl, e;
	}
	function Du() {
		X = 4, Vl || (J & 4194048) !== J && ro.current !== null || (Hl = !0), !(Gl & 134217727) && !(Kl & 134217727) || K === null || yu(K, J, Jl, !1);
	}
	function Ou(e, t, n) {
		var r = G;
		G |= 2;
		var i = Tu(), a = Eu();
		(K !== e || J !== t) && (nu = null, Su(e, t)), t = !1;
		var o = X;
		a: do
			try {
				if (Y !== 0 && q !== null) {
					var s = q, c = Bl;
					switch (Y) {
						case 8:
							xu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							ro.current === null && (t = !0);
							var l = Y;
							if (Y = 0, Bl = null, Pu(e, s, c, l), n && Hl) {
								o = 0;
								break a;
							}
							break;
						default: l = Y, Y = 0, Bl = null, Pu(e, s, c, l);
					}
				}
				ku(), o = X;
				break;
			} catch (t) {
				Cu(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, qi = Ki = null, G = r, T.H = i, T.A = a, q === null && (K = null, J = 0, ti()), o;
	}
	function ku() {
		for (; q !== null;) Mu(q);
	}
	function Au(e, t) {
		var n = G;
		G |= 2;
		var r = Tu(), i = Eu();
		K !== e || J !== t ? (nu = null, tu = Pe() + 500, Su(e, t)) : Hl = tt(e, t);
		a: do
			try {
				if (Y !== 0 && q !== null) {
					t = q;
					var o = Bl;
					b: switch (Y) {
						case 1:
							Y = 0, Bl = null, Pu(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (Ea(o)) {
								Y = 0, Bl = null, Nu(t);
								break;
							}
							t = function() {
								Y !== 2 && Y !== 9 || K !== e || (Y = 7), rd(e);
							}, o.then(t, t);
							break a;
						case 3:
							Y = 7;
							break a;
						case 4:
							Y = 5;
							break a;
						case 7:
							Ea(o) ? (Y = 0, Bl = null, Nu(t)) : (Y = 0, Bl = null, Pu(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (q.tag) {
								case 26: s = q.memoizedState;
								case 5:
								case 27:
									var c = q;
									if (s ? Wf(s) : c.stateNode.complete) {
										Y = 0, Bl = null;
										var l = c.sibling;
										if (l !== null) q = l;
										else {
											var u = c.return;
											u === null ? q = null : (q = u, Fu(u));
										}
										break b;
									}
							}
							Y = 0, Bl = null, Pu(e, t, o, 5);
							break;
						case 6:
							Y = 0, Bl = null, Pu(e, t, o, 6);
							break;
						case 8:
							xu(), X = 6;
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
		return qi = Ki = null, T.H = r, T.A = i, G = n, q === null ? (K = null, J = 0, ti(), X) : 0;
	}
	function ju() {
		for (; q !== null && !Me();) Mu(q);
	}
	function Mu(e) {
		var t = Nc(e.alternate, e, Wl);
		e.memoizedProps = e.pendingProps, t === null ? Fu(e) : q = t;
	}
	function Nu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = _c(n, t, t.pendingProps, t.type, void 0, J);
				break;
			case 11:
				t = _c(n, t, t.pendingProps, t.type.render, t.ref, J);
				break;
			case 5: ko(t);
			default: Vc(n, t), t = q = fi(t, Wl), t = Nc(n, t, Wl);
		}
		e.memoizedProps = e.pendingProps, t === null ? Fu(e) : q = t;
	}
	function Pu(e, t, n, r) {
		qi = Ki = null, ko(t), Ma = null, Na = 0;
		var i = t.return;
		try {
			if (nc(e, i, t, n, J)) {
				X = 1, Zs(e, yi(n, e.current)), q = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw q = i, t;
			X = 1, Zs(e, yi(n, e.current)), q = null;
			return;
		}
		t.flags & 32768 ? (z || r === 1 ? e = !0 : Hl || J & 536870912 ? e = !1 : (Vl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = ro.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Iu(t, e)) : Fu(t);
	}
	function Fu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Iu(t, Vl);
				return;
			}
			e = t.return;
			var n = zc(t.alternate, t, Wl);
			if (n !== null) {
				q = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				q = t;
				return;
			}
			q = t = e;
		} while (t !== null);
		X === 0 && (X = 5);
	}
	function Iu(e, t) {
		do {
			var n = Bc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, q = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				q = e;
				return;
			}
			q = e = n;
		} while (e !== null);
		X = 6, q = null;
	}
	function Lu(e, t, n, r, i, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			Hu();
		while (iu !== 0);
		if (G & 6) throw Error(a(327));
		if (t !== null) {
			if (t === e.current) throw Error(a(177));
			if (o = t.lanes | t.childLanes, o |= ei, ot(e, n, o, s, c, l), e === K && (q = K = null, J = 0), ou = t, au = e, su = n, cu = o, lu = i, uu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Xu(Re, function() {
				return Uu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
				r = T.T, T.T = null, i = E.p, E.p = 2, s = G, G |= 4;
				try {
					ol(e, t, n);
				} finally {
					G = s, E.p = i, T.T = r;
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
				n = T.T, T.T = null;
				var r = E.p;
				E.p = 2;
				var i = G;
				G |= 4;
				try {
					vl(t, e);
					var a = zd, o = kr(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && Or(s.ownerDocument.documentElement, s)) {
						if (c !== null && Ar(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Dr(s, h), v = Dr(s, g);
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
					G = i, E.p = r, T.T = n;
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
				n = T.T, T.T = null;
				var r = E.p;
				E.p = 2;
				var i = G;
				G |= 4;
				try {
					sl(e, t.alternate, t);
				} finally {
					G = i, E.p = r, T.T = n;
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
				t = T.T, i = E.p, E.p = 2, T.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					T.T = t, E.p = i;
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
		var n = dt(su), r = T.T, i = E.p;
		try {
			E.p = 32 > n ? 32 : n, T.T = null, n = lu, lu = null;
			var o = au, s = su;
			if (iu = 0, ou = au = null, su = 0, G & 6) throw Error(a(331));
			var c = G;
			if (G |= 4, Fl(o.current), Dl(o, o.current, s, n), G = c, id(0, !1), We && typeof We.onPostCommitFiberRoot == "function") try {
				We.onPostCommitFiberRoot(Ue, o);
			} catch {}
			return !0;
		} finally {
			E.p = i, T.T = r, Vu(e, t);
		}
	}
	function Wu(e, t, n) {
		t = yi(n, t), t = $s(e.stateNode, t, 2), e = Wa(e, t, 2), e !== null && (at(e, 2), rd(e));
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
					e = yi(n, e), n = ec(2), r = Wa(t, n, 2), r !== null && (tc(n, r, t, e), at(r, 2), rd(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function Gu(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new zl();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (Ul = !0, i.add(n), e = Ku.bind(null, e, t, n), t.then(e, e));
	}
	function Ku(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, K === e && (J & n) === n && (X === 4 || X === 3 && (J & 62914560) === J && 300 > Pe() - $l ? !(G & 2) && Su(e, 0) : ql |= n, Yl === J && (Yl = 0)), rd(e);
	}
	function qu(e, t) {
		t === 0 && (t = rt()), e = ii(e, t), e !== null && (at(e, t), rd(e));
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
						} else a = J, a = et(r, r === K ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || tt(r, a) || (n = !0, ld(r, a));
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
		if (t = K, n = J, n = et(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Y === 2 || Y === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && je(r), e.callbackNode = null, e.callbackPriority = 0;
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
		var r = J;
		return r = et(e, e === K ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (gu(e, r, t), sd(e, Pe()), e.callbackNode != null && e.callbackNode === n ? cd.bind(null, e) : null);
	}
	function ld(e, t) {
		if (Hu()) return null;
		gu(e, t, !0);
	}
	function ud() {
		Yd(function() {
			G & 6 ? Ae(Ie, ad) : od();
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
			var s = new Tn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (nd !== 0) {
								var e = o ? pd(i, o) : new FormData(i);
								Ts(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? pd(i, o) : new FormData(i), Ts(n, {
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
	for (var hd = 0; hd < Yr.length; hd++) {
		var gd = Yr[hd];
		Xr(gd.toLowerCase(), "on" + (gd[0].toUpperCase() + gd.slice(1)));
	}
	Xr(Vr, "onAnimationEnd"), Xr(Hr, "onAnimationIteration"), Xr(Ur, "onAnimationStart"), Xr("dblclick", "onDoubleClick"), Xr("focusin", "onFocus"), Xr("focusout", "onBlur"), Xr(Wr, "onTransitionRun"), Xr(Gr, "onTransitionStart"), Xr(Kr, "onTransitionCancel"), Xr(qr, "onTransitionEnd"), jt("onMouseEnter", ["mouseout", "mouseover"]), jt("onMouseLeave", ["mouseout", "mouseover"]), jt("onPointerEnter", ["pointerout", "pointerover"]), jt("onPointerLeave", ["pointerout", "pointerover"]), At("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), At("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), At("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), At("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), At("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), At("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
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
						Zr(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Zr(e);
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
			e[xd] = !0, Ot.forEach(function(t) {
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
					if (o = Ct(c), o === null) return;
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
				var c = Jr.get(e);
				if (c !== void 0) {
					var l = Tn, u = e;
					switch (e) {
						case "keypress": if (M(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Un;
							break;
						case "focusin":
							u = "focus", l = Pn;
							break;
						case "focusout":
							u = "blur", l = Pn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Pn;
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
							l = Mn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Nn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = F;
							break;
						case Vr:
						case Hr:
						case Ur:
							l = Fn;
							break;
						case qr:
							l = I;
							break;
						case "scroll":
						case "scrollend":
							l = Dn;
							break;
						case "wheel":
							l = Gn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = In;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Wn;
							break;
						case "toggle":
						case "beforetoggle": l = Kn;
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
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== cn && (u = n.relatedTarget || n.fromElement) && (Ct(u) || u[_t])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? Ct(u) : null, u !== null && (f = s(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = Mn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Wn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : Tt(l), h = u == null ? c : Tt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, Ct(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
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
					if (c = r ? Tt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = fr;
					else if (or(c)) {
						if (pr) v = Sr;
						else {
							v = br;
							var y = yr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && nn(r.elementType) && (v = fr) : v = xr;
					if (v && (v = v(e, r))) {
						sr(o, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Yt(c, "number", c.value);
				}
				switch (y = r ? Tt(r) : window, e) {
					case "focusin":
						(or(y) || y.contentEditable === "true") && (Mr = y, Nr = r, Pr = null);
						break;
					case "focusout":
						Pr = Nr = Mr = null;
						break;
					case "mousedown":
						Fr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Fr = !1, Ir(o, n, i);
						break;
					case "selectionchange": if (jr) break;
					case "keydown":
					case "keyup": Ir(o, n, i);
				}
				var b;
				if (Jn) b: {
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
				else nr ? er(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (Zn && n.locale !== "ko" && (nr || x !== "onCompositionStart" ? x === "onCompositionEnd" && nr && (b = Sn()) : (yn = i, bn = "value" in yn ? yn.value : yn.textContent, nr = !0)), y = Ed(r, x), 0 < y.length && (x = new Ln(x, e, null, n, i), o.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = tr(n), b !== null && (x.data = b)))), (b = Xn ? rr(e, n) : ir(e, n)) && (x = Ed(r, "onBeforeInput"), 0 < x.length && (y = new Ln("onBeforeInput", "beforeinput", null, n, i), o.push({
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
				Lt(e, "class", r);
				break;
			case "tabIndex":
				Lt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Lt(e, n, r);
				break;
			case "style":
				tn(e, r, o);
				break;
			case "data": if (t !== "object") {
				Lt(e, "data", r);
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
				Q("beforetoggle", e), Q("toggle", e), It(e, "popover", r);
				break;
			case "xlinkActuate":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Rt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Rt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Rt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Rt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				It(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = rn.get(n) || n, It(e, n, r));
		}
	}
	function Nd(e, t, n, r, i, o) {
		switch (n) {
			case "style":
				tn(e, r, o);
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
			default: if (!kt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), o = e[gt] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, i), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, i);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : It(e, n, r);
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
				Jt(e, o, c, l, u, s, i, !1);
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
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Xt(e, !!r, n, !0) : Xt(e, !!r, t, !1);
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
				Qt(e, r, i, o);
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
			default: if (nn(t)) {
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
				qt(e, s, c, l, u, d, o, i);
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
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Xt(e, !!n, n ? [] : "", !1) : Xt(e, !!n, t, !0)) : Xt(e, !!n, p, !1);
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
				Zt(e, p, m);
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
			default: if (nn(t)) {
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
					ef(n), A(n);
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
		A(e);
	}
	var mf = /* @__PURE__ */ new Map(), hf = /* @__PURE__ */ new Set();
	function gf(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var _f = E.d;
	E.d = {
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
		var t = wt(e);
		t !== null && t.tag === 5 && t.type === "form" ? Ds(t) : _f.r(e);
	}
	var bf = typeof document > "u" ? null : document;
	function xf(e, t, n) {
		var r = bf;
		if (r && typeof t == "string" && t) {
			var i = Kt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), hf.has(i) || (hf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Pd(t, "link", e), Dt(t), r.head.appendChild(t)));
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
			var i = "link[rel=\"preload\"][as=\"" + Kt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Kt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Kt(n.imageSizes) + "\"]")) : i += "[href=\"" + Kt(e) + "\"]";
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
			}, n), mf.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(jf(a)) || t === "script" && r.querySelector(Ff(a)) || (t = r.createElement("link"), Pd(t, "link", e), Dt(t), r.head.appendChild(t)));
		}
	}
	function Tf(e, t) {
		_f.m(e, t);
		var n = bf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Kt(r) + "\"][href=\"" + Kt(e) + "\"]", a = i;
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
				r = n.createElement("link"), Pd(r, "link", e), Dt(r), n.head.appendChild(r);
			}
		}
	}
	function Ef(e, t, n) {
		_f.S(e, t, n);
		var r = bf;
		if (r && e) {
			var i = Et(r).hoistableStyles, a = Af(e);
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
					Dt(c), Pd(c, "link", e), c._p = new Promise(function(e, t) {
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
			var r = Et(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), Dt(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
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
			var r = Et(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), Dt(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function kf(e, t, n, r) {
		var i = (i = _e.current) ? gf(i) : null;
		if (!i) throw Error(a(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Af(n.href), n = Et(i).hoistableStyles, r = n.get(t), r || (r = {
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
					var o = Et(i).hoistableStyles, s = o.get(e);
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
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Pf(n), n = Et(i).hoistableScripts, r = n.get(t), r || (r = {
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
		return "href=\"" + Kt(e) + "\"";
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
		}), Pd(t, "link", n), Dt(t), e.head.appendChild(t));
	}
	function Pf(e) {
		return "[src=\"" + Kt(e) + "\"]";
	}
	function Ff(e) {
		return "script[async]" + e;
	}
	function If(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Kt(n.href) + "\"]");
				if (r) return t.instance = r, Dt(r), r;
				var i = h({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), Dt(r), Pd(r, "style", i), Lf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				i = Af(n.href);
				var o = e.querySelector(jf(i));
				if (o) return t.state.loading |= 4, t.instance = o, Dt(o), o;
				r = Mf(n), (i = mf.get(i)) && Rf(r, i), o = (e.ownerDocument || e).createElement("link"), Dt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Pd(o, "link", r), t.state.loading |= 4, Lf(o, n.precedence, e), t.instance = o;
			case "script": return o = Pf(n.src), (i = e.querySelector(Ff(o))) ? (t.instance = i, Dt(i), i) : (r = n, (i = mf.get(o)) && (r = h({}, n), zf(r, i)), e = e.ownerDocument || e, i = e.createElement("script"), Dt(i), Pd(i, "link", r), e.head.appendChild(i), t.instance = i);
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
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Jf.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, Dt(a);
					return;
				}
				a = t.ownerDocument || t, r = Mf(r), (i = mf.get(i)) && Rf(r, i), a = a.createElement("link"), Dt(a);
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
		_currentValue: de,
		_currentValue2: de,
		_threadCount: 0
	};
	function $f(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = it(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = it(0), this.hiddenUpdates = it(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new $f(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = li(3, null, null, t), e.current = a, a.stateNode = e, t = ca(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Va(a), e;
	}
	function tp(e) {
		return e ? (e = si, e) : si;
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
			var t = ii(e, 67108864);
			t !== null && hu(t, e, 67108864), ip(e, 67108864);
		}
	}
	function op(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = pu();
			t = ut(t);
			var n = ii(e, t);
			n !== null && hu(n, e, t), ip(e, t);
		}
	}
	var sp = !0;
	function cp(e, t, n, r) {
		var i = T.T;
		T.T = null;
		var a = E.p;
		try {
			E.p = 2, up(e, t, n, r);
		} finally {
			E.p = a, T.T = i;
		}
	}
	function lp(e, t, n, r) {
		var i = T.T;
		T.T = null;
		var a = E.p;
		try {
			E.p = 8, up(e, t, n, r);
		} finally {
			E.p = a, T.T = i;
		}
	}
	function up(e, t, n, r) {
		if (sp) {
			var i = dp(r);
			if (i === null) wd(e, t, r, fp, n), Cp(e, r);
			else if (Tp(i, e, t, n, r)) r.stopPropagation();
			else if (Cp(e, r), t & 4 && -1 < Sp.indexOf(e)) {
				for (; i !== null;) {
					var a = wt(i);
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
									rd(a), !(G & 6) && (tu = Pe() + 500, id(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = ii(a, 2), s !== null && hu(s, a, 2), bu(), ip(a, 2);
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
		if (fp = null, e = Ct(e), e !== null) {
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
		}, t !== null && (t = wt(t), t !== null && ap(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
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
		var t = Ct(e.target);
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
			} else return t = wt(n), t !== null && ap(t), e.blockedOn = n, !1;
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
	function Ap(e, t) {
		e.blockedOn === t && (e.blockedOn = null, hp || (hp = !0, n.unstable_scheduleCallback(n.unstable_NormalPriority, kp)));
	}
	var jp = null;
	function Mp(e) {
		jp !== e && (jp = e, n.unstable_scheduleCallback(n.unstable_NormalPriority, function() {
			jp === e && (jp = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (pp(r || n) === null) continue;
					break;
				}
				var a = wt(n);
				a !== null && (e.splice(t, 3), t -= 3, Ts(a, {
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
	E.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(a(188)) : (e = Object.keys(e).join(","), Error(a(268, e)));
		return e = f(t), e = e === null ? null : m(e), e = e === null ? null : e.stateNode, e;
	};
	var Rp = {
		bundleType: 0,
		version: "19.2.8",
		rendererPackageName: "react-dom",
		currentDispatcherRef: T,
		reconcilerVersion: "19.2.8"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!zp.isDisabled && zp.supportsFiber) try {
			Ue = zp.inject(Rp), We = zp;
		} catch {}
	}
	t.createRoot = function(e, t) {
		if (!o(e)) throw Error(a(299));
		var n = !1, r = "", i = Js, s = Ys, c = Xs;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = ep(e, 1, !1, null, null, n, r, null, i, s, c, Pp), e[_t] = t.current, Sd(e), new Fp(t);
	};
})), h = /* @__PURE__ */ t(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = m();
})), g = e(), _ = h();
function v(e) {
	"@babel/helpers - typeof";
	return v = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, v(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPrimitive.js
function y(e, t) {
	if (v(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (v(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPropertyKey.js
function b(e) {
	var t = y(e, "string");
	return v(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/defineProperty.js
function x(e, t, n) {
	return (t = b(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
//#region src/api.ts
var ee = (e) => /^1(?:\.|$)/.test(e), S = class extends Error {
	constructor(e, t, n) {
		super(e), x(this, "code", void 0), x(this, "status", void 0), this.code = t, this.status = n, this.name = "ApiError";
	}
}, te = class {
	constructor(e) {
		x(this, "config", void 0), x(this, "base", void 0), x(this, "uploadStorageKey", "sofinder.uploadSessions.v1"), this.config = e, this.base = e.apiBase.replace(/\/config$/, "");
	}
	async configData() {
		let e = await this.request("/config");
		if (!ee(e.apiVersion)) throw new S(`SoFinder UI requires API 1.x; server reported ${e.apiVersion || "an unknown version"}.`, "incompatible_api_version", 426);
		return e;
	}
	securityStatus() {
		return this.request("/security/status");
	}
	prepareDocumentPreview(e, t, n = !1) {
		return this.request("/preview/document/jobs", {
			method: "POST",
			body: JSON.stringify({
				resource: e,
				path: t,
				retry: n
			})
		});
	}
	documentPreviewJob(e) {
		return this.request(`/preview/document/jobs/${encodeURIComponent(e)}`);
	}
	signedUrl(e, t, n, r = "attachment") {
		let i = new URLSearchParams({
			resource: e,
			path: t,
			disposition: r
		});
		return n !== void 0 && i.set("ttl", String(n)), this.request(`/signed-url?${i}`);
	}
	list(e, t, n = "", r = "name", i = "asc", a = 0, o = 100, s = "name", c = null) {
		let l = new URLSearchParams({
			resource: e,
			path: t,
			search: n,
			searchMode: s,
			sort: r,
			direction: i,
			offset: String(a),
			limit: String(o)
		});
		return c !== null && l.set("cursor", c), this.request(`/entries?${l}`);
	}
	createFolder(e, t, n) {
		return this.request("/folders", {
			method: "POST",
			body: JSON.stringify({
				resource: e,
				path: t,
				name: n
			})
		});
	}
	rename(e, t, n) {
		return this.request("/entries/rename", {
			method: "PATCH",
			body: JSON.stringify({
				resource: e,
				path: t,
				name: n
			})
		});
	}
	remove(e, t) {
		return this.request("/entries", {
			method: "DELETE",
			body: JSON.stringify({
				resource: e,
				path: t
			})
		});
	}
	transfer(e, t, n, r) {
		return this.request(`/entries/${e}`, {
			method: "POST",
			body: JSON.stringify({
				resource: t,
				path: n,
				destination: r,
				autoRename: !0
			})
		});
	}
	batch(e, t, n, r = "") {
		return this.request("/entries/batch", {
			method: "POST",
			body: JSON.stringify({
				operation: e,
				resource: t,
				paths: n,
				destination: r,
				autoRename: !0
			})
		});
	}
	batchRename(e, t) {
		return this.request("/entries/batch-rename", {
			method: "POST",
			body: JSON.stringify({
				resource: e,
				renames: t
			})
		});
	}
	upload(e, t, n, r = {}) {
		if (n.size > 5e6) return this.chunkUpload(e, t, n, r);
		let i = new FormData();
		return i.set("resource", e), i.set("path", t), i.set("upload", n), r.overwrite && i.set("overwrite", "1"), new Promise((e, t) => {
			let n = new XMLHttpRequest(), a = () => n.abort(), o = () => r.signal?.removeEventListener("abort", a);
			if (n.open("POST", this.base + "/uploads"), n.withCredentials = !0, n.setRequestHeader("Accept", "application/json"), n.setRequestHeader("X-CSRF-TOKEN", this.config.csrfToken), n.upload.addEventListener("progress", (e) => {
				e.lengthComputable && r.onProgress?.(Math.min(100, Math.round(e.loaded / e.total * 100)));
			}), n.addEventListener("load", () => {
				o();
				let i;
				try {
					i = JSON.parse(n.responseText);
				} catch {
					t(new S(`Request failed (${n.status})`, "invalid_response", n.status));
					return;
				}
				if (n.status < 200 || n.status >= 300 || !i.success || !i.data) {
					t(new S(i.error?.message || `Request failed (${n.status})`, i.error?.code || "upload_failed", n.status));
					return;
				}
				r.onProgress?.(100), e(i.data);
			}), n.addEventListener("error", () => {
				o(), t(new S("The upload failed because of a network error.", "network_error", 0));
			}), n.addEventListener("abort", () => {
				o(), t(new DOMException("The upload was cancelled.", "AbortError"));
			}), r.signal?.addEventListener("abort", a, { once: !0 }), r.signal?.aborted) {
				a();
				return;
			}
			n.send(i);
		});
	}
	async chunkUpload(e, t, n, r) {
		let i = 4e6, a = Math.ceil(n.size / i), o = this.findPendingUpload(e, t, n, !!r.overwrite, a), s = o?.id || crypto.randomUUID(), c = o || {
			id: s,
			scope: this.base,
			resource: e,
			path: t,
			name: n.name,
			size: n.size,
			lastModified: n.lastModified,
			total: a,
			overwrite: !!r.overwrite,
			updatedAt: Date.now()
		};
		this.savePendingUpload({
			...c,
			updatedAt: Date.now()
		});
		let l = () => {
			fetch(`${this.base}/uploads/chunks/${encodeURIComponent(s)}`, {
				method: "DELETE",
				headers: { "X-CSRF-TOKEN": this.config.csrfToken },
				credentials: "same-origin",
				keepalive: !0
			});
		};
		r.signal?.addEventListener("abort", l, { once: !0 });
		try {
			let l = /* @__PURE__ */ new Set();
			if (o) try {
				let e = await this.request(`/uploads/chunks/${encodeURIComponent(s)}`);
				l = new Set(e.received), l.size >= a && l.delete(a - 1);
			} catch (i) {
				if (!(i instanceof S) || i.status !== 404) throw i;
				return this.removePendingUpload(s), this.chunkUpload(e, t, n, r);
			}
			for (let o = 0; o < a; o++) {
				if (r.signal?.aborted) throw new DOMException("The upload was cancelled.", "AbortError");
				if (l.has(o)) {
					r.onProgress?.(Math.round((o + 1) / a * 100));
					continue;
				}
				let u = new FormData();
				u.set("resource", e), u.set("path", t), u.set("name", n.name), u.set("uploadId", s), u.set("index", String(o)), u.set("total", String(a)), r.overwrite && u.set("overwrite", "1"), u.set("chunk", n.slice(o * i, Math.min(n.size, (o + 1) * i)), `${n.name}.part`);
				let d = await fetch(this.base + "/uploads/chunks", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"X-CSRF-TOKEN": this.config.csrfToken
					},
					body: u,
					credentials: "same-origin",
					signal: r.signal
				}), f = await d.json();
				if (!d.ok || !f.success || !f.data) throw new S(f.error?.message || `Request failed (${d.status})`, f.error?.code || "upload_failed", d.status);
				if (r.onProgress?.(Math.round((o + 1) / a * 100)), this.savePendingUpload({
					...c,
					updatedAt: Date.now()
				}), f.data.complete && f.data.entry) return this.removePendingUpload(s), { entry: f.data.entry };
			}
			throw new S("The chunk upload did not complete.", "chunk_incomplete", 500);
		} catch (e) {
			throw e instanceof S && e.status >= 400 && e.status < 500 && this.removePendingUpload(s), e;
		} finally {
			r.signal?.removeEventListener("abort", l), r.signal?.aborted && this.removePendingUpload(s);
		}
	}
	pendingUploads() {
		try {
			let e = JSON.parse(localStorage.getItem(this.uploadStorageKey) || "[]");
			return Array.isArray(e) ? e.filter((e) => e.scope === this.base && Date.now() - e.updatedAt < 864e5) : [];
		} catch {
			return [];
		}
	}
	findPendingUpload(e, t, n, r, i) {
		return this.pendingUploads().find((a) => a.resource === e && a.path === t && a.name === n.name && a.size === n.size && a.lastModified === n.lastModified && a.overwrite === r && (i === void 0 || a.total === i));
	}
	savePendingUpload(e) {
		let t = this.readAllPendingUploads().filter((t) => t.id !== e.id);
		t.push(e), localStorage.setItem(this.uploadStorageKey, JSON.stringify(t.slice(-50)));
	}
	removePendingUpload(e) {
		localStorage.setItem(this.uploadStorageKey, JSON.stringify(this.readAllPendingUploads().filter((t) => t.id !== e)));
	}
	readAllPendingUploads() {
		try {
			let e = JSON.parse(localStorage.getItem(this.uploadStorageKey) || "[]");
			return Array.isArray(e) ? e : [];
		} catch {
			return [];
		}
	}
	downloadUrl(e, t) {
		return `${this.base}/download?${new URLSearchParams({
			resource: e,
			path: t
		})}`;
	}
	contentUrl(e, t) {
		return `${this.base}/content?${new URLSearchParams({
			resource: e,
			path: t,
			disposition: "inline"
		})}`;
	}
	textPreview(e, t) {
		return this.request(`/preview/text?${new URLSearchParams({
			resource: e,
			path: t
		})}`);
	}
	checksum(e, t) {
		return this.request(`/checksum?${new URLSearchParams({
			resource: e,
			path: t
		})}`);
	}
	thumbnailUrl(e, t, n = 240, r = 180) {
		return `${this.base}/images/thumbnail?${new URLSearchParams({
			resource: e,
			path: t.path,
			width: String(n),
			height: String(r),
			v: `${t.modifiedAt}-${t.size}`
		})}`;
	}
	imageInfo(e, t) {
		return this.request(`/images/info?${new URLSearchParams({
			resource: e,
			path: t
		})}`);
	}
	editImage(e, t, n = 0, r = 0, i = 0) {
		return this.request("/images/edit", {
			method: "PATCH",
			body: JSON.stringify({
				resource: e,
				path: t,
				rotation: n,
				width: r,
				height: i
			})
		});
	}
	cropImage(e, t, n, r, i, a) {
		return this.request("/images/edit", {
			method: "PATCH",
			body: JSON.stringify({
				operation: "crop",
				resource: e,
				path: t,
				x: n,
				y: r,
				width: i,
				height: a
			})
		});
	}
	applyImageActions(e, t, n, r) {
		return this.request("/images/edit", {
			method: "PATCH",
			body: JSON.stringify({
				resource: e,
				path: t,
				actions: n,
				save: r
			})
		});
	}
	applyImageBatch(e, t, n, r) {
		return this.request("/images/batch", {
			method: "PATCH",
			body: JSON.stringify({
				resource: e,
				paths: t,
				actions: n,
				save: r
			})
		});
	}
	trash(e, t = 0, n = 50, r = "") {
		return this.request(`/trash?${new URLSearchParams({
			resource: e,
			offset: String(t),
			limit: String(n),
			search: r
		})}`);
	}
	restoreTrash(e, t, n = "cancel") {
		return this.request(`/trash/${encodeURIComponent(t)}/restore`, {
			method: "POST",
			body: JSON.stringify({
				resource: e,
				conflict: n
			})
		});
	}
	permanentlyDeleteTrash(e, t) {
		return this.request(`/trash/${encodeURIComponent(t)}`, {
			method: "DELETE",
			body: JSON.stringify({ resource: e })
		});
	}
	async downloadArchive(e, t) {
		let n = await fetch(this.base + "/archive", {
			method: "POST",
			headers: {
				Accept: "application/zip, application/json",
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": this.config.csrfToken
			},
			credentials: "same-origin",
			body: JSON.stringify({
				resource: e,
				paths: t
			})
		});
		if (!n.ok) {
			let e = await n.json();
			throw new S(e.error?.message || `Request failed (${n.status})`, e.error?.code || "archive_failed", n.status);
		}
		return n.blob();
	}
	metadata(e) {
		return this.request(`/metadata?${new URLSearchParams({ resource: e })}`);
	}
	updateMetadata(e, t, n, r = {}) {
		return this.request("/metadata", {
			method: "PATCH",
			body: JSON.stringify({
				resource: e,
				path: t,
				action: n,
				...r
			})
		});
	}
	async request(e, t = {}) {
		let n = new Headers(t.headers);
		n.set("Accept", "application/json"), !(t.body instanceof FormData) && t.body !== void 0 && n.set("Content-Type", "application/json"), t.method && t.method !== "GET" && n.set("X-CSRF-TOKEN", this.config.csrfToken);
		let r = await fetch(this.base + e, {
			...t,
			headers: n,
			credentials: "same-origin"
		}), i = await r.json();
		if (!r.ok || !i.success || !i.data) throw new S(i.error?.message || `Request failed (${r.status})`, i.error?.code || "request_failed", r.status);
		return i.data;
	}
}, ne = {
	en: {
		files: "Files",
		images: "Images",
		newFolder: "New folder",
		upload: "Upload",
		uploadFolder: "Upload folder",
		folderUploadTooMany: "A folder upload is limited to 500 files.",
		folderUploadPreview: "Top-level folders",
		refresh: "Refresh",
		search: "Search files",
		searchTags: "Search tags (comma separates multiple)",
		searchScope: "Search scope",
		searchTrash: "Search deleted files",
		name: "Name",
		size: "Size",
		modified: "Modified",
		empty: "This folder is empty",
		select: "Select",
		rename: "Rename",
		batchRename: "Batch rename",
		renamePattern: "Name pattern",
		renamePatternHint: "Use {name} for the original base name, {n} for its sequence and {ext} for the locked extension.",
		oldName: "Current name",
		duplicateRename: "The preview contains duplicate names.",
		remove: "Delete",
		download: "Download",
		copy: "Copy",
		move: "Move",
		webImageUnsupported: "This image format cannot be embedded directly in a web page.",
		details: "Details",
		type: "Type",
		folder: "Folder",
		file: "File",
		location: "Location",
		chooseFolder: "Destination folder",
		fileUrl: "File URL",
		temporaryFileUrl: "Temporary file URL",
		linkExpires: "Expires",
		copyUrl: "Copy URL",
		urlCopied: "URL copied",
		copyUrlFailed: "Automatic copy failed. The URL remains selected for manual copying.",
		clickUrlToCopy: "Click the URL field to copy it.",
		loginRequired: "Login required",
		language: "Language",
		confirmDelete: "Delete the selected entry?",
		permanentDeleteWarning: "This storage does not provide a recycle bin. This action cannot be undone.",
		folderName: "Folder name",
		newName: "New name",
		newBaseName: "New name; extension is locked",
		loading: "Loading…",
		uploadDone: "Upload complete",
		error: "Something went wrong",
		missingPathFallback: "That folder no longer exists. Returned to the root folder.",
		missingDestinationFallback: "That destination no longer exists. Choose another folder from the root.",
		recentMissing: "That recent file no longer exists and was removed from the list.",
		grid: "Grid view",
		list: "List view",
		home: "Home",
		sort: "Sort",
		direction: "Sort direction",
		pagination: "Pagination",
		page: "Page",
		previous: "Previous",
		next: "Next",
		itemsPerPage: "Items per page",
		moreActions: "More actions",
		selectAll: "Select all",
		clearSelection: "Clear",
		selectedCount: "selected",
		confirmDeleteMany: "Delete selected entries? Count:",
		completed: "completed",
		failed: "failed",
		uploadQueue: "Uploads",
		cancel: "Cancel",
		cancelAll: "Cancel all",
		clearFinished: "Clear finished",
		retryUpload: "Retry / resume",
		removeUploadTask: "Remove task",
		collapse: "Collapse",
		expand: "Expand",
		queued: "Queued",
		uploading: "Uploading",
		done: "Done",
		cancelled: "Cancelled",
		replaceFile: "A file with this name exists. Replace it?",
		uploadReselectToResume: "Upload interrupted; select the same file to resume.",
		uploadResuming: "Resuming previous upload…",
		rotateLeft: "Rotate left",
		rotateRight: "Rotate right",
		resize: "Resize",
		resizePrompt: "Maximum width × height (1–4096)",
		invalidDimensions: "Enter dimensions such as 1200x1200.",
		imageUpdated: "Image updated",
		crop: "Crop",
		cropPrompt: "Crop rectangle: x,y,width,height",
		invalidCrop: "Enter a valid crop rectangle such as 0,0,800,600.",
		preset: "Preset",
		downloadZip: "Download ZIP",
		readOnly: "Read only",
		storageUsage: "Storage",
		favorite: "Favorite",
		tags: "Tags",
		tagsPrompt: "Tags separated by commas",
		recent: "Recent",
		recentEmpty: "No recent files yet. Select or open a file to add it here.",
		fileActions: "File actions",
		keyboardHelp: "Keyboard: arrows navigate, Enter opens, F2 renames, Delete removes, Ctrl+A selects all, Escape clears selection",
		dimensions: "Dimensions",
		width: "Width",
		height: "Height",
		settings: "Settings",
		interfaceScale: "Interface size",
		scaleCompact: "Compact (90%)",
		scaleStandard: "Standard (100%)",
		scaleLarge: "Large (112.5%)",
		scaleExtraLarge: "Extra large (125%)",
		gridItemSize: "Grid item size",
		listRowSize: "List row size",
		sizeSmall: "Small",
		sizeMedium: "Medium",
		sizeLarge: "Large",
		optionalTools: "Optional tools",
		imageTools: "Image tools",
		rotationTools: "Rotation controls",
		listColumns: "List columns",
		showSizeColumn: "Show size",
		showModifiedColumn: "Show modified time",
		showTypeColumn: "Show MIME type",
		optionalFeatures: "Optional features",
		featureSettingsHint: "Enable only the extra tools needed for this browser.",
		autoCollapseUploads: "Auto-collapse completed upload queue",
		folderTreeFeature: "Left folder tree",
		recentFeature: "Recent files",
		favoriteFeature: "Favorites",
		tagsFeature: "Tags",
		archiveFeature: "ZIP download",
		trashFeature: "Recycle bin management",
		resizeLeftPanel: "Resize left panel",
		resizeRightPanel: "Resize details panel",
		toolSettingsHint: "Choose the view density and enable only the tools you need. Batch rename, optimization and watermarking are hidden by default.",
		close: "Close",
		confirmImageOverwrite: "This operation overwrites the original image and cannot be undone. Continue?",
		moveDestination: "Move to folder",
		copyDestination: "Copy to folder",
		rootFolder: "Root",
		noFolders: "No subfolders",
		currentFolder: "Selected folder",
		moveHere: "Move here",
		copyHere: "Copy here",
		unsafeDestination: "Choose another folder. Moving to the current location, or placing a folder inside itself, is not allowed.",
		cropInstructions: "Drag over the image to select a crop area, then fine-tune the values if needed.",
		applyCrop: "Crop and overwrite",
		maximum: "maximum",
		fileName: "file name",
		folderDepth: "folder levels",
		configuredLimits: "Configured limits",
		fileNameTooLong: "The file name exceeds the character limit:",
		fileNameTooLongMaximum: "The file name exceeds the {maximum} character limit.",
		folderNameTooLong: "The folder name exceeds the character limit:",
		invalidEntryName: "The name cannot use reserved names, leading dots, trailing dots or spaces, control characters, or < > : \" / \\ | ? *.",
		folderDepthReached: "The configured maximum folder depth has been reached.",
		confirm: "Confirm",
		save: "Save",
		saving: "Saving…",
		overwrite: "Overwrite",
		trash: "Recycle bin",
		trashEmpty: "The recycle bin is empty",
		restore: "Restore",
		permanentDelete: "Delete permanently",
		expires: "Expires",
		restoreConflict: "The original location already contains an entry",
		restoreOverwrite: "Replace existing",
		restoreAutoRename: "Restore with new name",
		trashRetention: "The item will move to the private recycle bin and is retained for 30 days.",
		trashUsage: "Recycle bin usage",
		trashAutoPurged: "Recycle bin was full; oldest items automatically removed:",
		items: "items",
		tagInput: "Add a tag",
		tagInputHint: "Press Enter or comma to add; Backspace removes the last tag.",
		tagMaximum: "Up to 10 tags, 30 characters each",
		ratio: "Ratio",
		freeRatio: "Free",
		originalRatio: "Original",
		zoom: "Zoom",
		undo: "Undo",
		redo: "Redo",
		reset: "Reset",
		compare: "Hold to compare",
		saveMode: "Save mode",
		saveCopy: "Save as copy",
		imageCreated: "Image created",
		imageFormatLocked: "The {extension} format is fixed. Cropping does not convert the image format; the saved file is validated for its name, MIME type, dimensions and content safety.",
		panHint: "Drag outside the selection to draw a new crop; drag its corners or edges to resize it; arrow keys nudge one pixel.",
		open: "Open",
		preview: "Preview",
		previewUnavailable: "A visual preview is not available for this file type.",
		previewPreparing: "Preparing Office preview…",
		previewFailed: "The Office preview could not be prepared.",
		previewRetry: "Retry preview",
		previewTruncated: "Preview limited to the first 256 KiB.",
		calculateChecksum: "Calculate",
		imageProcess: "Optimize / watermark",
		applyImageProcess: "Process images",
		processingImages: "Processing…",
		processingSelected: "{count} images selected",
		operation: "Operation",
		optimizeImage: "Compress and convert",
		textWatermark: "Text watermark",
		imageWatermark: "Image watermark",
		outputFormat: "Output format",
		keepFormat: "Keep original format",
		watermarkText: "Watermark text",
		color: "Color",
		watermarkResource: "Watermark resource",
		watermarkPath: "Watermark image path",
		position: "Position",
		topLeft: "Top left",
		topRight: "Top right",
		center: "Center",
		bottomLeft: "Bottom left",
		bottomRight: "Bottom right",
		opacity: "Opacity",
		watermarkScale: "Watermark width",
		quality: "Quality",
		conversionCopyHint: "Format conversion always saves a new copy so the extension and MIME type remain consistent.",
		securityStatus: "Security status",
		malwareScanningEnabled: "Malware scanning enabled",
		malwareScanningDisabled: "Malware scanning disabled",
		scanProvider: "Provider",
		serviceStatus: "Service status",
		scanHistory: "Malware scan history",
		scanPassed: "Passed",
		scanQuarantined: "Blocked",
		scanFailed: "Failed",
		scanPending: "Pending",
		recentScans: "Recent scans",
		noScans: "No malware scans have been recorded."
	},
	"zh-cn": {
		files: "文件",
		images: "图片",
		newFolder: "新建文件夹",
		upload: "上传",
		uploadFolder: "上传文件夹",
		folderUploadTooMany: "单次文件夹上传最多 500 个文件。",
		folderUploadPreview: "顶层文件夹",
		refresh: "刷新",
		search: "搜索文件",
		searchTags: "搜索标签（多个标签用逗号分隔）",
		searchScope: "搜索范围",
		searchTrash: "搜索已删除文件",
		name: "名称",
		size: "大小",
		modified: "修改时间",
		empty: "此文件夹为空",
		select: "选择",
		rename: "重命名",
		batchRename: "批量重命名",
		renamePattern: "名称规则",
		renamePatternHint: "使用 {name} 表示原主文件名、{n} 表示序号、{ext} 表示锁定的扩展名。",
		oldName: "原名称",
		duplicateRename: "预览中存在重复名称。",
		remove: "删除",
		download: "下载",
		copy: "复制",
		move: "移动",
		webImageUnsupported: "此图片格式不能直接用于网页内容。",
		details: "详细信息",
		type: "类型",
		folder: "文件夹",
		file: "文件",
		location: "位置",
		chooseFolder: "目标文件夹",
		fileUrl: "文件网址",
		temporaryFileUrl: "临时文件网址",
		linkExpires: "失效时间",
		copyUrl: "复制网址",
		urlCopied: "网址已复制",
		copyUrlFailed: "自动复制失败，网址仍保持选中，可手动复制。",
		clickUrlToCopy: "点击网址输入框即可复制。",
		loginRequired: "需要登录",
		language: "语言",
		confirmDelete: "确定删除选中的项目吗？",
		permanentDeleteWarning: "此存储不提供回收站，本操作无法撤销。",
		folderName: "文件夹名称",
		newName: "新名称",
		newBaseName: "新名称；扩展名不可修改",
		loading: "加载中…",
		uploadDone: "上传完成",
		error: "操作失败",
		missingPathFallback: "该文件夹已不存在，已返回根目录。",
		missingDestinationFallback: "目标文件夹已不存在，请从根目录重新选择。",
		recentMissing: "该最近使用文件已不存在，已从列表移除。",
		grid: "网格视图",
		list: "列表视图",
		home: "首页",
		sort: "排序",
		direction: "排序方向",
		pagination: "分页",
		page: "第",
		previous: "上一页",
		next: "下一页",
		itemsPerPage: "每页数量",
		moreActions: "更多操作",
		selectAll: "全选",
		clearSelection: "取消全选",
		selectedCount: "项已选择",
		confirmDeleteMany: "确定删除所选项目吗？数量：",
		completed: "项完成",
		failed: "项失败",
		uploadQueue: "上传任务",
		cancel: "取消",
		cancelAll: "全部取消",
		clearFinished: "清除已完成",
		retryUpload: "重试 / 继续",
		removeUploadTask: "移除任务",
		collapse: "收起",
		expand: "展开",
		queued: "等待中",
		uploading: "上传中",
		done: "已完成",
		cancelled: "已取消",
		replaceFile: "已存在同名文件，是否覆盖？",
		uploadReselectToResume: "上传已中断，请重新选择同一文件继续。",
		uploadResuming: "正在继续上次上传…",
		rotateLeft: "向左旋转",
		rotateRight: "向右旋转",
		resize: "缩放",
		resizePrompt: "最大宽度 × 高度（1–4096）",
		invalidDimensions: "请输入类似 1200x1200 的尺寸。",
		imageUpdated: "图片已更新",
		crop: "裁剪",
		cropPrompt: "裁剪区域：x,y,宽度,高度",
		invalidCrop: "请输入有效区域，例如 0,0,800,600。",
		preset: "预设尺寸",
		downloadZip: "打包下载",
		readOnly: "只读",
		storageUsage: "存储空间",
		favorite: "收藏",
		tags: "标签",
		tagsPrompt: "使用逗号分隔标签",
		recent: "最近使用",
		recentEmpty: "暂无最近使用；选择或打开文件后会显示在这里。",
		fileActions: "文件操作",
		keyboardHelp: "键盘：方向键导航，回车打开，F2 重命名，Delete 删除，Ctrl+A 全选，Esc 清除选择",
		dimensions: "图片尺寸",
		width: "宽度",
		height: "高度",
		settings: "设置",
		interfaceScale: "界面大小",
		scaleCompact: "紧凑（90%）",
		scaleStandard: "标准（100%）",
		scaleLarge: "大（112.5%）",
		scaleExtraLarge: "特大（125%）",
		gridItemSize: "网格项目大小",
		listRowSize: "列表行大小",
		sizeSmall: "小",
		sizeMedium: "中",
		sizeLarge: "大",
		optionalTools: "可选工具",
		imageTools: "图片工具",
		rotationTools: "旋转工具",
		listColumns: "列表列",
		showSizeColumn: "显示大小",
		showModifiedColumn: "显示修改时间",
		showTypeColumn: "显示 MIME 类型",
		optionalFeatures: "可选功能",
		featureSettingsHint: "只开放当前文件管理器实际需要的附加功能。",
		autoCollapseUploads: "上传全部结束后自动收起队列",
		folderTreeFeature: "左侧目录树",
		recentFeature: "最近使用",
		favoriteFeature: "收藏",
		tagsFeature: "标签",
		archiveFeature: "打包下载",
		trashFeature: "回收站管理",
		resizeLeftPanel: "调整左侧栏宽度",
		resizeRightPanel: "调整详细信息栏宽度",
		toolSettingsHint: "设置视图密度，并只启用需要的工具。批量重命名、压缩和水印默认隐藏。",
		close: "关闭",
		confirmImageOverwrite: "此操作会覆盖原图片且无法撤销，确定继续吗？",
		moveDestination: "移动到文件夹",
		copyDestination: "复制到文件夹",
		rootFolder: "根目录",
		noFolders: "没有子文件夹",
		currentFolder: "已选文件夹",
		moveHere: "移动到这里",
		copyHere: "复制到这里",
		unsafeDestination: "请选择其他文件夹；不能移动到当前位置，也不能把文件夹放入自身或其子目录。",
		cropInstructions: "在图片上拖动以选择裁剪区域，也可以使用数值微调。",
		applyCrop: "裁剪并覆盖",
		maximum: "最多",
		fileName: "文件名",
		folderDepth: "文件夹层数",
		configuredLimits: "当前限制",
		fileNameTooLong: "文件名超过字数限制：",
		fileNameTooLongMaximum: "文件名不能超过 {maximum} 个字符。",
		folderNameTooLong: "文件夹名超过字数限制：",
		invalidEntryName: "名称不能使用系统保留名、开头点号、结尾点号或空格、控制字符，以及 < > : \" / \\ | ? *。",
		folderDepthReached: "已经达到配置的最大文件夹层数。",
		confirm: "确认",
		save: "保存",
		saving: "保存中…",
		overwrite: "覆盖原图",
		trash: "回收站",
		trashEmpty: "回收站为空",
		restore: "恢复",
		permanentDelete: "永久删除",
		expires: "到期时间",
		restoreConflict: "原位置已经存在同名项目",
		restoreOverwrite: "覆盖现有项目",
		restoreAutoRename: "自动改名恢复",
		trashRetention: "项目会移入私有回收站，并保留 30 天。",
		trashUsage: "回收站占用",
		trashAutoPurged: "回收站已满，已自动清理最旧项目：",
		items: "项",
		tagInput: "添加标签",
		tagInputHint: "按回车或逗号添加；空输入时按退格删除最后一个标签。",
		tagMaximum: "最多 10 个标签，每个 30 个字符",
		ratio: "比例",
		freeRatio: "自由比例",
		originalRatio: "原图比例",
		zoom: "缩放",
		undo: "撤销",
		redo: "重做",
		reset: "重置",
		compare: "按住前后对比",
		saveMode: "保存方式",
		saveCopy: "另存副本",
		imageCreated: "已生成图片",
		imageFormatLocked: "图片格式固定为 {extension}，裁剪不会转换格式；保存时会验证文件名、MIME 类型、图片尺寸和内容安全。",
		panHint: "在选区外拖动可重新框选；拖动四角或边线可调整大小，方向键每次微调一个像素。",
		open: "打开",
		preview: "预览",
		previewUnavailable: "此文件类型暂不支持可视化预览。",
		previewPreparing: "正在准备 Office 预览…",
		previewFailed: "无法生成 Office 预览。",
		previewRetry: "重试预览",
		previewTruncated: "预览仅显示前 256 KiB。",
		calculateChecksum: "计算校验值",
		imageProcess: "压缩 / 水印",
		applyImageProcess: "开始处理",
		processingImages: "处理中…",
		processingSelected: "已选择 {count} 张图片",
		operation: "处理方式",
		optimizeImage: "压缩与格式转换",
		textWatermark: "文字水印",
		imageWatermark: "图片水印",
		outputFormat: "输出格式",
		keepFormat: "保持原格式",
		watermarkText: "水印文字",
		color: "颜色",
		watermarkResource: "水印所在资源",
		watermarkPath: "水印图片路径",
		position: "位置",
		topLeft: "左上",
		topRight: "右上",
		center: "居中",
		bottomLeft: "左下",
		bottomRight: "右下",
		opacity: "透明度",
		watermarkScale: "水印宽度",
		quality: "质量",
		conversionCopyHint: "格式转换始终另存副本，以保证扩展名与 MIME 类型一致。",
		securityStatus: "安全状态",
		malwareScanningEnabled: "病毒扫描已启用",
		malwareScanningDisabled: "病毒扫描未启用",
		scanProvider: "扫描引擎",
		serviceStatus: "服务状态",
		scanHistory: "病毒扫描记录",
		scanPassed: "通过",
		scanQuarantined: "已拦截",
		scanFailed: "失败",
		scanPending: "待扫描",
		recentScans: "最近扫描",
		noScans: "尚无病毒扫描记录。"
	}
}, C = {
	files: "檔案",
	images: "圖片",
	newFolder: "新增資料夾",
	upload: "上傳",
	uploadFolder: "上傳資料夾",
	folderUploadTooMany: "單次資料夾上傳最多 500 個檔案。",
	folderUploadPreview: "頂層資料夾",
	refresh: "重新整理",
	search: "搜尋檔案",
	searchTags: "搜尋標籤（多個標籤以逗號分隔）",
	searchScope: "搜尋範圍",
	searchTrash: "搜尋已刪除的檔案",
	name: "名稱",
	size: "大小",
	modified: "修改時間",
	empty: "此資料夾是空的",
	select: "選取",
	rename: "重新命名",
	batchRename: "批次重新命名",
	renamePattern: "名稱規則",
	renamePatternHint: "使用 {name} 表示原主檔名、{n} 表示序號、{ext} 表示鎖定的副檔名。",
	oldName: "原名稱",
	duplicateRename: "預覽中有重複名稱。",
	remove: "刪除",
	download: "下載",
	copy: "複製",
	move: "移動",
	webImageUnsupported: "此圖片格式不能直接用於網頁內容。",
	details: "詳細資訊",
	type: "類型",
	folder: "資料夾",
	file: "檔案",
	location: "位置",
	chooseFolder: "目標資料夾",
	fileUrl: "檔案網址",
	temporaryFileUrl: "臨時檔案網址",
	linkExpires: "失效時間",
	copyUrl: "複製網址",
	urlCopied: "網址已複製",
	copyUrlFailed: "自動複製失敗，網址仍保持選取，可手動複製。",
	clickUrlToCopy: "點選網址輸入框即可複製。",
	loginRequired: "需要登入",
	language: "語言",
	confirmDelete: "確定要刪除選取的項目嗎？",
	permanentDeleteWarning: "此儲存空間不提供資源回收筒，此操作無法復原。",
	folderName: "資料夾名稱",
	newName: "新名稱",
	newBaseName: "新名稱；副檔名不可修改",
	loading: "載入中…",
	uploadDone: "上傳完成",
	error: "操作失敗",
	missingPathFallback: "該資料夾已不存在，已返回根目錄。",
	missingDestinationFallback: "目標資料夾已不存在，請從根目錄重新選擇。",
	recentMissing: "該最近使用檔案已不存在，已從清單移除。",
	grid: "網格檢視",
	list: "清單檢視",
	home: "首頁",
	sort: "排序",
	direction: "排序方向",
	pagination: "分頁",
	page: "第",
	previous: "上一頁",
	next: "下一頁",
	itemsPerPage: "每頁數量",
	moreActions: "更多操作",
	selectAll: "全選",
	clearSelection: "取消全選",
	selectedCount: "個項目已選取",
	confirmDeleteMany: "確定要刪除選取的項目嗎？數量：",
	completed: "個已完成",
	failed: "個失敗",
	uploadQueue: "上傳佇列",
	cancel: "取消",
	cancelAll: "全部取消",
	clearFinished: "清除已完成項目",
	retryUpload: "重試 / 繼續",
	removeUploadTask: "移除工作",
	collapse: "收合",
	expand: "展開",
	queued: "等待中",
	uploading: "上傳中",
	done: "已完成",
	cancelled: "已取消",
	replaceFile: "已有同名檔案，是否覆寫？",
	uploadReselectToResume: "上傳已中斷，請重新選取同一檔案繼續。",
	uploadResuming: "正在繼續上次上傳…",
	rotateLeft: "向左旋轉",
	rotateRight: "向右旋轉",
	resize: "縮放",
	resizePrompt: "最大寬度 × 高度（1–4096）",
	invalidDimensions: "請輸入類似 1200x1200 的尺寸。",
	imageUpdated: "圖片已更新",
	crop: "裁切",
	cropPrompt: "裁切範圍：x,y,寬度,高度",
	invalidCrop: "請輸入有效範圍，例如 0,0,800,600。",
	preset: "預設尺寸",
	downloadZip: "打包下載",
	readOnly: "唯讀",
	storageUsage: "儲存空間",
	favorite: "收藏",
	tags: "標籤",
	tagsPrompt: "使用逗號分隔標籤",
	recent: "最近使用",
	recentEmpty: "暫無最近使用；選取或開啟檔案後會顯示在這裡。",
	fileActions: "檔案操作",
	keyboardHelp: "鍵盤：方向鍵導覽，Enter 開啟，F2 重新命名，Delete 刪除，Ctrl+A 全選，Esc 清除選取",
	dimensions: "圖片尺寸",
	width: "寬度",
	height: "高度",
	settings: "設定",
	interfaceScale: "介面大小",
	scaleCompact: "緊湊（90%）",
	scaleStandard: "標準（100%）",
	scaleLarge: "大（112.5%）",
	scaleExtraLarge: "特大（125%）",
	gridItemSize: "網格項目大小",
	listRowSize: "清單列大小",
	sizeSmall: "小",
	sizeMedium: "中",
	sizeLarge: "大",
	optionalTools: "選用工具",
	imageTools: "圖片工具",
	rotationTools: "旋轉工具",
	listColumns: "清單欄位",
	showSizeColumn: "顯示大小",
	showModifiedColumn: "顯示修改時間",
	showTypeColumn: "顯示 MIME 類型",
	optionalFeatures: "選用功能",
	featureSettingsHint: "僅啟用此檔案管理器實際需要的附加功能。",
	autoCollapseUploads: "全部上傳完成後自動收合佇列",
	folderTreeFeature: "左側資料夾樹",
	recentFeature: "最近使用",
	favoriteFeature: "收藏",
	tagsFeature: "標籤",
	archiveFeature: "打包下載",
	trashFeature: "資源回收筒管理",
	resizeLeftPanel: "調整左側欄寬度",
	resizeRightPanel: "調整詳細資訊欄寬度",
	toolSettingsHint: "設定檢視密度，並僅啟用需要的工具。批次重新命名、壓縮和浮水印預設為隱藏。",
	close: "關閉",
	confirmImageOverwrite: "此操作會覆寫原始圖片且無法復原，確定要繼續嗎？",
	moveDestination: "移動到資料夾",
	copyDestination: "複製到資料夾",
	rootFolder: "根目錄",
	noFolders: "沒有子資料夾",
	currentFolder: "已選資料夾",
	moveHere: "移動到這裡",
	copyHere: "複製到這裡",
	unsafeDestination: "請選擇其他資料夾；不能移動到目前位置，也不能將資料夾放入自身或其子目錄。",
	cropInstructions: "在圖片上拖曳以選取裁切範圍，也可以使用數值微調。",
	applyCrop: "裁切並覆寫",
	maximum: "最多",
	fileName: "檔名",
	folderDepth: "資料夾層數",
	configuredLimits: "目前限制",
	fileNameTooLong: "檔名超過字數限制：",
	fileNameTooLongMaximum: "檔名不能超過 {maximum} 個字元。",
	folderNameTooLong: "資料夾名稱超過字數限制：",
	invalidEntryName: "名稱不能使用系統保留名、開頭點號、結尾點號或空格、控制字元，以及 < > : \" / \\ | ? *。",
	folderDepthReached: "已達到設定的最大資料夾層數。",
	confirm: "確認",
	save: "儲存",
	saving: "儲存中…",
	overwrite: "覆寫原圖",
	trash: "資源回收筒",
	trashEmpty: "資源回收筒是空的",
	restore: "還原",
	permanentDelete: "永久刪除",
	expires: "到期時間",
	restoreConflict: "原位置已有同名項目",
	restoreOverwrite: "覆寫現有項目",
	restoreAutoRename: "自動改名還原",
	trashRetention: "項目會移入私有資源回收筒，並保留 30 天。",
	trashUsage: "資源回收筒用量",
	trashAutoPurged: "資源回收筒已滿，已自動清除最舊項目：",
	items: "個項目",
	tagInput: "新增標籤",
	tagInputHint: "按 Enter 或逗號新增；輸入為空時按 Backspace 移除最後一個標籤。",
	tagMaximum: "最多 10 個標籤，每個 30 個字元",
	ratio: "比例",
	freeRatio: "自由比例",
	originalRatio: "原圖比例",
	zoom: "縮放",
	undo: "復原",
	redo: "重做",
	reset: "重設",
	compare: "按住以比較前後差異",
	saveMode: "儲存方式",
	saveCopy: "另存副本",
	imageCreated: "已產生圖片",
	imageFormatLocked: "圖片格式固定為 {extension}，裁切不會轉換格式；儲存時會驗證檔名、MIME 類型、圖片尺寸和內容安全。",
	panHint: "在選取範圍外拖曳可重新框選；拖曳四角或邊線可調整大小，方向鍵每次微調一個像素。",
	open: "開啟",
	preview: "預覽",
	previewUnavailable: "此檔案類型暫不支援視覺預覽。",
	previewPreparing: "正在準備 Office 預覽…",
	previewFailed: "無法產生 Office 預覽。",
	previewRetry: "重試預覽",
	previewTruncated: "預覽僅顯示前 256 KiB。",
	calculateChecksum: "計算校驗值",
	imageProcess: "壓縮 / 浮水印",
	applyImageProcess: "開始處理",
	processingImages: "處理中…",
	processingSelected: "已選取 {count} 張圖片",
	operation: "處理方式",
	optimizeImage: "壓縮與格式轉換",
	textWatermark: "文字浮水印",
	imageWatermark: "圖片浮水印",
	outputFormat: "輸出格式",
	keepFormat: "保留原格式",
	watermarkText: "浮水印文字",
	color: "顏色",
	watermarkResource: "浮水印所在資源",
	watermarkPath: "浮水印圖片路徑",
	position: "位置",
	topLeft: "左上",
	topRight: "右上",
	center: "置中",
	bottomLeft: "左下",
	bottomRight: "右下",
	opacity: "透明度",
	watermarkScale: "浮水印寬度",
	quality: "品質",
	conversionCopyHint: "格式轉換一律另存副本，以確保副檔名與 MIME 類型一致。",
	securityStatus: "安全狀態",
	malwareScanningEnabled: "病毒掃描已啟用",
	malwareScanningDisabled: "病毒掃描未啟用",
	scanProvider: "掃描引擎",
	serviceStatus: "服務狀態",
	scanHistory: "病毒掃描記錄",
	scanPassed: "通過",
	scanQuarantined: "已攔截",
	scanFailed: "失敗",
	scanPending: "待掃描",
	recentScans: "最近掃描",
	noScans: "尚無病毒掃描記錄。"
}, re = {
	...ne,
	"zh-tw": C
}, ie = (e) => (t) => re[e][t], w = n();
function ae({ title: e, label: t, initialValue: n = "", maximum: r, extension: o = "", invalidNameLabel: s, confirmLabel: c, cancelLabel: l, closeLabel: u, onConfirm: d, onClose: f }) {
	let [p, m] = (0, g.useState)(n), h = p + o, _ = Array.from(h).length, v = a(h, r), y = v === null;
	return /* @__PURE__ */ (0, w.jsx)(i, {
		title: e,
		closeLabel: u,
		onClose: f,
		className: "sf-form-modal",
		footer: /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [
			/* @__PURE__ */ (0, w.jsxs)("span", { children: [
				_,
				" / ",
				r
			] }),
			/* @__PURE__ */ (0, w.jsx)("button", {
				onClick: f,
				children: l
			}),
			/* @__PURE__ */ (0, w.jsx)("button", {
				className: "primary",
				disabled: !y,
				onClick: () => d(p.trim() + o),
				children: c
			})
		] }),
		children: /* @__PURE__ */ (0, w.jsxs)("div", {
			className: "sf-form-body",
			children: [/* @__PURE__ */ (0, w.jsxs)("label", { children: [t, /* @__PURE__ */ (0, w.jsxs)("span", {
				className: "sf-name-input",
				children: [/* @__PURE__ */ (0, w.jsx)("input", {
					autoFocus: !0,
					value: p,
					maxLength: r,
					onChange: (e) => m(e.target.value)
				}), o && /* @__PURE__ */ (0, w.jsx)("span", { children: o })]
			})] }), !y && p !== "" && /* @__PURE__ */ (0, w.jsx)("p", {
				role: "alert",
				children: v === "tooLong" ? `${_} / ${r}` : s
			})]
		})
	});
}
function oe({ title: e, message: t, detail: n, confirmLabel: r, cancelLabel: a, closeLabel: o, danger: s = !1, onConfirm: c, onClose: l }) {
	return /* @__PURE__ */ (0, w.jsx)(i, {
		title: e,
		closeLabel: o,
		onClose: l,
		className: "sf-confirm-modal",
		footer: /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [
			/* @__PURE__ */ (0, w.jsx)("span", {}),
			/* @__PURE__ */ (0, w.jsx)("button", {
				onClick: l,
				children: a
			}),
			/* @__PURE__ */ (0, w.jsx)("button", {
				className: s ? "danger" : "primary",
				onClick: c,
				children: r
			})
		] }),
		children: /* @__PURE__ */ (0, w.jsxs)("div", {
			className: "sf-form-body",
			children: [/* @__PURE__ */ (0, w.jsx)("p", { children: t }), n && /* @__PURE__ */ (0, w.jsx)("small", { children: n })]
		})
	});
}
//#endregion
//#region src/components/ContextMenu.tsx
function se({ x: e, y: t, items: n, onSelect: r, onClose: i }) {
	let a = (0, g.useRef)(null);
	return (0, g.useEffect)(() => {
		let e = () => i();
		return window.addEventListener("pointerdown", e), window.addEventListener("resize", e), a.current?.querySelector("button:not(:disabled)")?.focus(), () => {
			window.removeEventListener("pointerdown", e), window.removeEventListener("resize", e);
		};
	}, [i]), /* @__PURE__ */ (0, w.jsx)("div", {
		ref: a,
		className: "sf-context-menu",
		role: "menu",
		style: {
			left: Math.min(e, window.innerWidth - 220),
			top: Math.min(t, window.innerHeight - 320)
		},
		onPointerDown: (e) => e.stopPropagation(),
		onKeyDown: (e) => {
			e.key === "Escape" && i();
		},
		children: n.map((e) => /* @__PURE__ */ (0, w.jsx)("button", {
			role: "menuitem",
			disabled: e.disabled,
			className: e.danger ? "danger" : "",
			onClick: () => r(e.id),
			children: e.label
		}, e.id))
	});
}
//#endregion
//#region src/components/FolderTree.tsx
function ce({ api: e, resource: t, currentPath: n, rootLabel: r, onNavigate: i }) {
	let [a, o] = (0, g.useState)({ "": {
		loading: !1,
		loaded: !1,
		expanded: !0,
		children: []
	} }), s = (0, g.useCallback)(async (n, r = !0) => {
		o((e) => ({
			...e,
			[n]: {
				...e[n] || {
					children: [],
					loaded: !1
				},
				loading: !0,
				expanded: r
			}
		}));
		try {
			let i = await e.list(t, n, "", "name", "asc", 0, 500);
			o((e) => ({
				...e,
				[n]: {
					loading: !1,
					loaded: !0,
					expanded: r,
					children: i.entries.filter((e) => e.directory)
				}
			}));
		} catch {
			o((e) => ({
				...e,
				[n]: {
					...e[n] || {
						children: [],
						loaded: !1
					},
					loading: !1,
					expanded: r
				}
			}));
		}
	}, [e, t]);
	(0, g.useEffect)(() => {
		o({ "": {
			loading: !1,
			loaded: !1,
			expanded: !0,
			children: []
		} }), s("");
	}, [s, t]), (0, g.useEffect)(() => {
		let e = n === "" ? [] : n.split("/");
		e.forEach((t, n) => {
			let r = e.slice(0, n + 1).join("/");
			!a[r]?.loaded && !a[r]?.loading && s(r);
		});
	}, [
		n,
		s,
		a
	]);
	let c = (e) => {
		if (!a[e]?.loaded) {
			s(e);
			return;
		}
		o((t) => ({
			...t,
			[e]: {
				...t[e],
				expanded: !t[e].expanded
			}
		}));
	}, l = (e, t) => {
		let r = a[e];
		return r?.expanded ? r.children.map((e) => /* @__PURE__ */ (0, w.jsxs)("div", { children: [/* @__PURE__ */ (0, w.jsxs)("div", {
			className: `sf-tree-row ${n === e.path ? "active" : ""}`,
			style: { paddingInlineStart: `${8 + t * 16}px` },
			children: [/* @__PURE__ */ (0, w.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => c(e.path),
				"aria-expanded": a[e.path]?.expanded || !1,
				"aria-label": e.name,
				children: a[e.path]?.loading ? "…" : a[e.path]?.expanded ? "⌄" : "›"
			}), /* @__PURE__ */ (0, w.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => i(e.path),
				title: e.path,
				children: ["▰ ", e.name]
			})]
		}), l(e.path, t + 1)] }, e.path)) : null;
	};
	return /* @__PURE__ */ (0, w.jsxs)("nav", {
		className: "sf-folder-tree",
		"aria-label": r,
		children: [/* @__PURE__ */ (0, w.jsxs)("div", {
			className: `sf-tree-row ${n === "" ? "active" : ""}`,
			children: [/* @__PURE__ */ (0, w.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => c(""),
				"aria-expanded": a[""]?.expanded || !1,
				children: "⌄"
			}), /* @__PURE__ */ (0, w.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => i(""),
				children: ["⌂ ", r]
			})]
		}), l("", 1)]
	});
}
//#endregion
//#region src/components/UrlDialog.tsx
function le({ url: e, loginRequired: t, expiresAt: n, labels: r, onClose: a }) {
	let o = (0, g.useRef)(null), [s, c] = (0, g.useState)("");
	(0, g.useEffect)(() => o.current?.select(), []);
	let l = async () => {
		o.current?.focus(), o.current?.select();
		try {
			await navigator.clipboard.writeText(e), c("copied");
		} catch {
			c("failed");
		}
	};
	return /* @__PURE__ */ (0, w.jsx)(i, {
		title: r.title,
		closeLabel: r.close,
		onClose: a,
		className: "sf-url-modal",
		footer: /* @__PURE__ */ (0, w.jsx)("button", {
			className: "primary",
			onClick: a,
			children: r.close
		}),
		children: /* @__PURE__ */ (0, w.jsxs)("div", {
			className: "sf-url-dialog-body",
			children: [
				/* @__PURE__ */ (0, w.jsx)("p", { children: r.hint }),
				/* @__PURE__ */ (0, w.jsx)("input", {
					ref: o,
					autoFocus: !0,
					readOnly: !0,
					value: e,
					"aria-label": r.title,
					onFocus: (e) => e.currentTarget.select(),
					onClick: () => void l()
				}),
				t && /* @__PURE__ */ (0, w.jsx)("small", { children: r.loginRequired }),
				n && /* @__PURE__ */ (0, w.jsxs)("small", { children: [
					r.expires,
					": ",
					/* @__PURE__ */ (0, w.jsx)("time", {
						dateTime: (/* @__PURE__ */ new Date(n * 1e3)).toISOString(),
						children: (/* @__PURE__ */ new Date(n * 1e3)).toLocaleString()
					})
				] }),
				/* @__PURE__ */ (0, w.jsx)("span", {
					role: "status",
					"aria-live": "polite",
					children: s === "copied" ? r.copied : s === "failed" ? r.failed : ""
				})
			]
		})
	});
}
//#endregion
//#region src/components/UploadQueue.tsx
function ue({ tasks: e, collapsed: t, labels: n, onToggle: i, onCancel: a, onCancelAll: o, onClearFinished: s, onRetry: c, onRemove: l }) {
	if (e.length === 0) return null;
	let u = e.some((e) => e.status === "queued" || e.status === "uploading"), d = e.filter((e) => e.status !== "queued" && e.status !== "uploading").length;
	return /* @__PURE__ */ (0, w.jsxs)("section", {
		className: `sf-upload-panel${t ? " collapsed" : ""}`,
		"aria-label": n.title,
		children: [/* @__PURE__ */ (0, w.jsxs)("header", { children: [
			/* @__PURE__ */ (0, w.jsx)("button", {
				className: "sf-upload-collapse",
				onClick: i,
				"aria-expanded": !t,
				title: t ? n.expand : n.collapse,
				children: /* @__PURE__ */ (0, w.jsx)(r, { name: t ? "chevron-right" : "chevron-down" })
			}),
			/* @__PURE__ */ (0, w.jsx)("strong", { children: n.title }),
			/* @__PURE__ */ (0, w.jsxs)("span", { children: [
				d,
				"/",
				e.length
			] }),
			/* @__PURE__ */ (0, w.jsx)("button", {
				onClick: o,
				disabled: !u,
				children: n.cancelAll
			}),
			/* @__PURE__ */ (0, w.jsx)("button", {
				onClick: s,
				children: n.clearFinished
			})
		] }), !t && /* @__PURE__ */ (0, w.jsx)("div", {
			className: "sf-upload-list",
			children: e.map((e) => /* @__PURE__ */ (0, w.jsxs)("div", {
				className: `sf-upload-task ${e.status}`,
				children: [
					/* @__PURE__ */ (0, w.jsx)("span", {
						className: "sf-upload-name",
						title: e.name,
						children: e.name
					}),
					/* @__PURE__ */ (0, w.jsx)("progress", {
						max: "100",
						value: e.progress,
						"aria-label": `${e.name}: ${e.progress}%`
					}),
					/* @__PURE__ */ (0, w.jsx)("span", { children: e.status === "uploading" ? `${e.progress}%` : n.status(e.status) }),
					(e.status === "queued" || e.status === "uploading") && /* @__PURE__ */ (0, w.jsx)("button", {
						onClick: () => a(e.id),
						children: n.cancel
					}),
					(e.status === "error" || e.status === "cancelled") && /* @__PURE__ */ (0, w.jsx)("button", {
						onClick: () => c(e.id),
						children: n.retry
					}),
					/* @__PURE__ */ (0, w.jsx)("button", {
						className: "sf-upload-remove",
						onClick: () => l(e.id),
						title: n.remove,
						"aria-label": `${n.remove}: ${e.name}`,
						children: /* @__PURE__ */ (0, w.jsx)(r, { name: "close" })
					}),
					e.message && /* @__PURE__ */ (0, w.jsx)("small", {
						title: e.message,
						children: e.message
					})
				]
			}, e.id))
		})]
	});
}
//#endregion
//#region src/components/DetailsPanel.tsx
function T({ api: e, resource: t, selectedEntries: n, selected: r, imageInfo: i, metadata: a, showTags: u, previewImage: d, selectMode: f, selectAllowed: p, labels: m, formatDate: h, onChoose: g, onOpenUrl: _, pluginActions: v }) {
	return /* @__PURE__ */ (0, w.jsxs)("aside", {
		className: "sf-details",
		children: [/* @__PURE__ */ (0, w.jsx)("h2", { children: m.details }), n.length > 1 ? /* @__PURE__ */ (0, w.jsxs)("div", {
			className: "sf-state",
			children: [
				n.length,
				" ",
				m.selected
			]
		}) : r ? /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [
			/* @__PURE__ */ (0, w.jsx)("div", {
				className: "sf-preview",
				children: d ? /* @__PURE__ */ (0, w.jsx)(s, {
					src: e.thumbnailUrl(t, r, 800, 600),
					alt: r.name
				}) : /* @__PURE__ */ (0, w.jsx)(c, {
					name: r.name,
					mimeType: r.mimeType,
					directory: r.directory
				})
			}),
			/* @__PURE__ */ (0, w.jsx)("h3", { children: r.name }),
			/* @__PURE__ */ (0, w.jsxs)("dl", { children: [
				/* @__PURE__ */ (0, w.jsx)("dt", { children: m.type }),
				/* @__PURE__ */ (0, w.jsx)("dd", { children: r.directory ? m.folder : r.mimeType || m.file }),
				/* @__PURE__ */ (0, w.jsx)("dt", { children: m.size }),
				/* @__PURE__ */ (0, w.jsx)("dd", { children: r.directory ? "—" : l(r.size) }),
				i && /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [/* @__PURE__ */ (0, w.jsx)("dt", { children: m.dimensions }), /* @__PURE__ */ (0, w.jsxs)("dd", { children: [
					i.width,
					" × ",
					i.height,
					" px"
				] })] }),
				/* @__PURE__ */ (0, w.jsx)("dt", { children: m.modified }),
				/* @__PURE__ */ (0, w.jsx)("dd", { children: /* @__PURE__ */ (0, w.jsx)("time", {
					dateTime: (/* @__PURE__ */ new Date(r.modifiedAt * 1e3)).toISOString(),
					children: h(r.modifiedAt)
				}) }),
				/* @__PURE__ */ (0, w.jsx)("dt", { children: m.location }),
				/* @__PURE__ */ (0, w.jsx)("dd", { children: r.path })
			] }),
			u && (a.tags[r.path] || []).length > 0 && /* @__PURE__ */ (0, w.jsx)("div", {
				className: "sf-tags",
				children: a.tags[r.path].map((e) => /* @__PURE__ */ (0, w.jsx)("span", { children: e }, e))
			}),
			f && !r.directory && r.url && /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [/* @__PURE__ */ (0, w.jsx)("button", {
				className: "sf-select primary",
				disabled: !p,
				onClick: g,
				children: m.select
			}), !p && /* @__PURE__ */ (0, w.jsx)("p", {
				className: "sf-warning",
				role: "status",
				children: m.unsupportedWebImage
			})] }),
			!r.directory && /* @__PURE__ */ (0, w.jsxs)("div", {
				className: "sf-detail-actions",
				children: [/* @__PURE__ */ (0, w.jsx)("a", {
					className: "sf-download",
					href: r.url || e.downloadUrl(t, r.path),
					children: m.download
				}), /* @__PURE__ */ (0, w.jsx)("button", {
					type: "button",
					className: "sf-icon-button",
					onClick: () => _(r),
					title: m.copyUrl,
					"aria-label": m.copyUrl,
					children: /* @__PURE__ */ (0, w.jsx)(o, {})
				})]
			}),
			v && /* @__PURE__ */ (0, w.jsx)("div", {
				className: "sf-plugin-detail-actions",
				children: v
			})
		] }) : /* @__PURE__ */ (0, w.jsx)("div", {
			className: "sf-state",
			children: "—"
		})]
	});
}
//#endregion
//#region src/preferences.ts
var E = {
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
	tags: !1,
	archive: !1,
	trash: !0,
	folderTree: !1,
	autoCollapseUploads: !0
}, pe = {
	size: !0,
	modified: !0,
	type: !1
}, me = {
	recent: !0,
	favorites: !0,
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
	checksum: !0
}, D = (e, t) => {
	try {
		let n = JSON.parse(localStorage.getItem(e) || "{}");
		return Object.fromEntries(Object.entries(t).map(([e, t]) => [e, typeof n[e] == "boolean" ? n[e] : t]));
	} catch {
		return t;
	}
}, O = () => D("sofinder.tools.v3", E), he = () => {
	try {
		let e = JSON.parse(localStorage.getItem("sofinder.viewSizes.v1") || "{}"), t = (e) => e === "small" || e === "medium" || e === "large";
		return {
			grid: t(e.grid) ? e.grid : de.grid,
			list: t(e.list) ? e.list : de.list
		};
	} catch {
		return de;
	}
}, ge = (e) => {
	let t = localStorage.getItem("sofinder.uiScale.v1");
	return t === "compact" || t === "standard" || t === "large" || t === "xlarge" ? t : e;
}, _e = {
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
}, ve = {
	default: 100,
	min: 10,
	max: 500
}, ye = (e) => Math.max(ve.min, Math.min(ve.max, Math.trunc(e))), k = () => {
	let e = Number(localStorage.getItem("sofinder.pageSize.v1"));
	return Number.isFinite(e) && e > 0 ? ye(e) : ve.default;
}, be = (e) => {
	let t = _e[e], n = localStorage.getItem(`sofinder.column.${e}`);
	if (n === null || n.trim() === "") return t.initial;
	let r = Number(n);
	return Number.isFinite(r) ? Math.max(t.min, Math.min(t.max, r)) : t.initial;
};
//#endregion
//#region src/hooks/useEntrySelection.ts
function xe(e, t, n) {
	let [r, i] = (0, g.useState)(() => /* @__PURE__ */ new Set()), [a, o] = (0, g.useState)(null), s = (0, g.useMemo)(() => e.filter((e) => r.has(e.path)), [e, r]);
	return {
		selectedPaths: r,
		setSelectedPaths: i,
		selectionAnchor: a,
		setSelectionAnchor: o,
		selectedEntries: s,
		selected: s.length === 1 ? s[0] : null,
		selectEntry: (0, g.useCallback)((r, s) => {
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
function Se(e, t) {
	let [n, r] = (0, g.useState)(e), [i, a] = (0, g.useState)(t), [o, s] = (0, g.useState)(""), [c, l] = (0, g.useState)([]), [u, d] = (0, g.useState)(""), [f, p] = (0, g.useState)("name"), [m, h] = (0, g.useState)("name"), [_, v] = (0, g.useState)("asc"), [y, b] = (0, g.useState)(0), [x, ee] = (0, g.useState)(0), [S, te] = (0, g.useState)(null), [ne, C] = (0, g.useState)(null), [re, ie] = (0, g.useState)([]), w = (0, g.useRef)(k()).current, [ae, oe] = (0, g.useState)(w), [se, ce] = (0, g.useState)(String(w)), le = (0, g.useRef)(w), [ue, T] = (0, g.useState)(() => localStorage.getItem("sofinder.view") === "list" ? "list" : "grid"), [E, de] = (0, g.useState)(!0), [fe, pe] = (0, g.useState)(""), [me, D] = (0, g.useState)({});
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
		direction: _,
		setDirection: v,
		offset: y,
		setOffset: b,
		total: x,
		setTotal: ee,
		pageCursor: S,
		setPageCursor: te,
		nextCursor: ne,
		setNextCursor: C,
		cursorHistory: re,
		setCursorHistory: ie,
		pageSize: ae,
		setPageSize: oe,
		pageSizeDraft: se,
		setPageSizeDraft: ce,
		pageSizeRef: le,
		view: ue,
		setView: T,
		loading: E,
		setLoading: de,
		notice: fe,
		setNotice: pe,
		directoryCapabilities: me,
		setDirectoryCapabilities: D,
		loadSequence: (0, g.useRef)(0),
		historyReady: (0, g.useRef)(!1),
		restoringHistory: (0, g.useRef)(!1),
		searchInitialized: (0, g.useRef)(!1)
	};
}
//#endregion
//#region src/hooks/useBatchState.ts
function Ce() {
	let [e, t] = (0, g.useState)(null), [n, r] = (0, g.useState)(!1);
	return {
		destinationDialog: e,
		setDestinationDialog: t,
		bulkRenameOpen: n,
		setBulkRenameOpen: r
	};
}
//#endregion
//#region src/hooks/useUploads.ts
function we({ api: e, resource: t, path: n, currentResource: r, currentDepth: i, autoCollapse: o, t: s, ask: c, reload: l, setNotice: u, report: d }) {
	let [f, p] = (0, g.useState)([]), [m, h] = (0, g.useState)(!1), _ = (0, g.useRef)(null), v = (0, g.useRef)(null), y = (0, g.useRef)(/* @__PURE__ */ new Map()), b = (0, g.useRef)(/* @__PURE__ */ new Map()), x = (0, g.useRef)(0);
	(0, g.useEffect)(() => {
		let t = e.pendingUploads().map((e) => ({
			id: `pending-${e.id}`,
			name: e.name,
			progress: 0,
			status: "error",
			message: s("uploadReselectToResume")
		}));
		t.length > 0 && (p((e) => [...e.filter((e) => !e.id.startsWith("pending-")), ...t]), h(!1));
	}, [e, s]), (0, g.useEffect)(() => {
		if (!o || f.length === 0 || f.some((e) => e.status === "queued" || e.status === "uploading")) return;
		let e = window.setTimeout(() => h(!0), 1200);
		return () => window.clearTimeout(e);
	}, [o, f]);
	let ee = (e, t) => {
		p((n) => n.map((n) => n.id === e ? {
			...n,
			...t
		} : n));
	}, te = async (i, o = n) => {
		let d = Array.from(i), f = r ? d.filter((e) => a(e.name, r.maxFileNameLength) === null) : d;
		f.length !== d.length && r && u(d.map((e) => a(e.name, r.maxFileNameLength)).filter((e) => e !== null).includes("tooLong") ? `${s("fileNameTooLong")} ${r.maxFileNameLength}` : s("invalidEntryName"));
		let m = f.map((n) => {
			let r = `${Date.now()}-${++x.current}`, i = new AbortController();
			y.current.set(r, i), b.current.set(r, {
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
		if (m.length === 0) return;
		h(!1);
		let g = new Set(m.map((e) => e.pendingId).filter((e) => e !== null));
		p((e) => [...e.filter((e) => !g.has(e.id)), ...m.map(({ id: e, file: t, pendingId: n }) => ({
			id: e,
			name: t.name,
			progress: 0,
			status: "queued",
			message: n ? s("uploadResuming") : void 0
		}))]);
		let _ = 0, v = async () => {
			for (; _ < m.length;) {
				let n = m[_++];
				if (n.controller.signal.aborted) {
					y.current.delete(n.id);
					continue;
				}
				ee(n.id, {
					status: "uploading",
					progress: 0,
					message: void 0
				});
				let r = !1;
				try {
					for (;;) try {
						await e.upload(t, o, n.file, {
							overwrite: r,
							signal: n.controller.signal,
							onProgress: (e) => ee(n.id, { progress: e })
						}), ee(n.id, {
							status: "done",
							progress: 100
						});
						break;
					} catch (e) {
						if (e instanceof S && e.code === "conflict" && !r && await c({
							title: s("replaceFile"),
							message: n.file.name,
							detail: s("confirmImageOverwrite")
						})) {
							r = !0, ee(n.id, { progress: 0 });
							continue;
						}
						throw e;
					}
				} catch (e) {
					ee(n.id, e instanceof DOMException && e.name === "AbortError" ? {
						status: "cancelled",
						message: s("cancelled")
					} : {
						status: "error",
						message: e instanceof Error ? e.message : s("error")
					});
				} finally {
					y.current.delete(n.id);
				}
			}
		};
		await Promise.all(Array.from({ length: Math.min(3, m.length) }, () => v())), await l();
	}, ne = async (o) => {
		if (!r) return;
		let l = Array.from(o);
		if (l.length > 500) {
			u(s("folderUploadTooMany"));
			return;
		}
		let f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Map();
		for (let e of l) {
			let t = e.webkitRelativePath.replace(/\\/g, "/").split("/").filter(Boolean);
			if (t.length < 2 || t.some((e) => a(e, e === t.at(-1) ? r.maxFileNameLength : r.maxFolderNameLength) !== null)) {
				u(s("invalidEntryName"));
				return;
			}
			let o = t.slice(0, -1);
			if (i + o.length > r.maxFolderDepth) {
				u(s("folderDepthReached"));
				return;
			}
			o.forEach((e, t) => f.add(o.slice(0, t + 1).join("/")));
			let c = [n, ...o].filter(Boolean).join("/");
			p.set(c, [...p.get(c) || [], e]);
		}
		let m = Array.from(f).filter((e) => !e.includes("/")).slice(0, 5);
		if (await c({
			title: s("uploadFolder"),
			message: `${l.length} ${s("files")} · ${f.size} ${s("folder")}`,
			detail: `${s("folderUploadPreview")}: ${m.join(", ")}${Array.from(f).filter((e) => !e.includes("/")).length > m.length ? "…" : ""}`
		})) try {
			for (let r of Array.from(f).sort((e, t) => e.split("/").length - t.split("/").length || e.localeCompare(t))) {
				let i = r.split("/"), a = i.pop() || "", o = [n, ...i].filter(Boolean).join("/");
				try {
					await e.createFolder(t, o, a);
				} catch (e) {
					if (!(e instanceof S) || e.code !== "conflict") throw e;
				}
			}
			for (let [e, t] of p) await te(t, e);
		} catch (e) {
			d(e);
		}
	}, C = (e) => {
		y.current.get(e)?.abort(), ee(e, {
			status: "cancelled",
			message: s("cancelled")
		});
	}, re = () => {
		y.current.forEach((e) => e.abort()), p((e) => e.map((e) => e.status === "queued" || e.status === "uploading" ? {
			...e,
			status: "cancelled",
			message: s("cancelled")
		} : e));
	}, ie = (e) => {
		y.current.get(e)?.abort(), y.current.delete(e), b.current.delete(e), p((t) => t.filter((t) => t.id !== e));
	};
	return {
		uploads: f,
		uploadsCollapsed: m,
		setUploadsCollapsed: h,
		uploadInput: _,
		directoryUploadInput: v,
		upload: te,
		uploadTo: (e, t) => te(t, e),
		uploadDirectory: ne,
		cancelUpload: C,
		cancelAllUploads: re,
		removeUploadTask: ie,
		retryUpload: (e) => {
			let t = b.current.get(e);
			t && (ie(e), te([t.file], t.targetPath));
		},
		clearFinishedUploads: () => {
			let e = new Set(f.filter((e) => e.status === "queued" || e.status === "uploading").map((e) => e.id));
			b.current.forEach((t, n) => {
				e.has(n) || b.current.delete(n);
			}), p((e) => e.filter((e) => e.status === "queued" || e.status === "uploading"));
		}
	};
}
//#endregion
//#region src/pluginUi.ts
var Te = (e, t) => e.label[t] || e.label.en, Ee = (e, t) => {
	if (e.directory) return null;
	let n = e.mimeType?.toLowerCase() || "", r = e.name.includes(".") && e.name.split(".").pop()?.toLowerCase() || "";
	return t.find((e) => e.extensions.includes(r) || e.mimeTypes.some((e) => e === n || e.endsWith("/*") && n.startsWith(e.slice(0, -1)))) || null;
}, De = (e, t, n) => {
	let r = Ee(e, t);
	if (!r) return null;
	let i = new URL(r.url, window.location.href);
	return i.searchParams.set("resource", n), i.searchParams.set("path", e.path), i.toString();
}, Oe = (e, t) => e.selection === "none" ? t === null : !t || e.selection === "file" && t.directory || e.selection === "image" && (t.directory || !t.mimeType?.startsWith("image/")) ? !1 : t.capabilities?.[e.requires] !== !1, ke = (0, g.lazy)(() => import("./ImageEditor-CacYGDQE.js").then((e) => ({ default: e.ImageEditor }))), Ae = (0, g.lazy)(() => import("./ImageProcessDialog-DjWE4_D0.js").then((e) => ({ default: e.ImageProcessDialog }))), je = (0, g.lazy)(() => import("./SecurityStatusDialog-n-WcU-OL.js").then((e) => ({ default: e.SecurityStatusDialog }))), Me = (0, g.lazy)(() => import("./DocumentPreviewPane-DU8zWCno.js")), Ne = (0, g.lazy)(() => import("./SettingsDialog-Bf-Qbk6C.js").then((e) => ({ default: e.SettingsDialog }))), Pe = (0, g.lazy)(() => import("./DestinationDialog-DPemnj2C.js").then((e) => ({ default: e.DestinationDialog }))), Fe = (0, g.lazy)(() => import("./BulkRenameDialog-De2F7_GP.js").then((e) => ({ default: e.BulkRenameDialog }))), Ie = (0, g.lazy)(() => import("./TrashDialog-C9NRSLSA.js").then((e) => ({ default: e.TrashDialog }))), Le = (0, g.lazy)(() => import("./TagsDialog-ObFqAP7F.js").then((e) => ({ default: e.TagsDialog })));
function Re({ config: e }) {
	let t = (0, g.useId)(), n = (0, g.useMemo)(() => new te(e), [e]), a = e.uiDefaults.mode ?? (e.selectMode ? "picker" : "manager"), u = e.featureAvailability ?? me, [d, f] = (0, g.useState)(() => {
		let t = localStorage.getItem("sofinder.language");
		return t === "en" || t === "zh-cn" || t === "zh-tw" ? t : e.language;
	}), p = (0, g.useMemo)(() => ie(d), [d]), m = (0, g.useMemo)(() => new Intl.DateTimeFormat(d, {
		dateStyle: "medium",
		timeStyle: "short"
	}), [d]), [h, _] = (0, g.useState)([]), { resource: v, setResource: y, path: b, setPath: x, resolvedPath: ee, setResolvedPath: ne, entries: C, setEntries: re, search: E, setSearch: de, searchMode: k, setSearchMode: Re, sort: Be, setSort: Ve, direction: He, setDirection: Ue, offset: We, setOffset: Ge, total: Ke, setTotal: qe, pageCursor: Je, setPageCursor: Ye, nextCursor: Xe, setNextCursor: Ze, cursorHistory: Qe, setCursorHistory: $e, pageSize: et, setPageSize: tt, pageSizeDraft: nt, setPageSizeDraft: rt, pageSizeRef: it, view: at, setView: ot, loading: st, setLoading: ct, notice: lt, setNotice: ut, directoryCapabilities: dt, setDirectoryCapabilities: ft, loadSequence: pt, historyReady: mt, restoringHistory: ht, searchInitialized: gt } = Se(e.resource, e.initialPath || ""), [_t, vt] = (0, g.useState)({
		favorites: [],
		tags: {},
		recent: []
	}), [yt, bt] = (0, g.useState)(null), [xt, St] = (0, g.useState)(() => e.uiDefaults.fullTools ? {
		resize: !0,
		crop: !0,
		rotate: !0,
		presets: !0,
		process: !0,
		batchRename: !0
	} : O()), [A, Ct] = (0, g.useState)(() => {
		let t = D("sofinder.features.v2", {
			...fe,
			folderTree: e.featureDefaults?.folderTree ?? !1
		});
		return {
			...t,
			folderTree: u.folderTree !== !1 && t.folderTree,
			recent: u.recent !== !1 && t.recent,
			favorites: u.favorites !== !1 && t.favorites,
			tags: u.tags !== !1 && t.tags,
			archive: u.archive !== !1 && t.archive,
			trash: u.trash !== !1 && t.trash
		};
	}), [wt, Tt] = (0, g.useState)(() => D("sofinder.listColumns.v1", pe)), [Et, Dt] = (0, g.useState)(he), [Ot, kt] = (0, g.useState)(!1), [At, jt] = (0, g.useState)(!1), [Mt, Nt] = (0, g.useState)(!1), [Pt, Ft] = (0, g.useState)(() => ge(e.uiDefaults?.scale ?? "standard")), { destinationDialog: It, setDestinationDialog: Lt, bulkRenameOpen: Rt, setBulkRenameOpen: zt } = Ce(), [Bt, Vt] = (0, g.useState)(!1), [Ht, Ut] = (0, g.useState)(!1), [Wt, Gt] = (0, g.useState)(null), [Kt, qt] = (0, g.useState)(null), [Jt, Yt] = (0, g.useState)(!1), [Xt, Zt] = (0, g.useState)(!1), [Qt, $t] = (0, g.useState)(null), [j, en] = (0, g.useState)(null), [tn, nn] = (0, g.useState)(null), [rn, an] = (0, g.useState)(null), [on, sn] = (0, g.useState)(null), [cn, ln] = (0, g.useState)({}), [un, dn] = (0, g.useState)({
		driver: "",
		formats: []
	}), [fn, pn] = (0, g.useState)([]), [mn, hn] = (0, g.useState)({
		enabled: !1,
		defaultTtlSeconds: 300,
		maxTtlSeconds: 3600
	}), [gn, _n] = (0, g.useState)(() => be("left")), [vn, yn] = (0, g.useState)(() => be("right")), bn = (0, g.useRef)(null), xn = (0, g.useRef)(null), Sn = (0, g.useRef)(null);
	(0, g.useEffect)(() => {
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
	}, [e.theme]), (0, g.useEffect)(() => (document.documentElement.dataset.sofinderScale = Pt, localStorage.setItem("sofinder.uiScale.v1", Pt), () => {
		delete document.documentElement.dataset.sofinderScale;
	}), [Pt]), (0, g.useEffect)(() => {
		localStorage.setItem("sofinder.language", d), document.documentElement.lang = d === "zh-cn" ? "zh-CN" : d === "zh-tw" ? "zh-TW" : "en";
	}, [d]);
	let M = (0, g.useCallback)((e) => ut(e instanceof Error ? e.message : p("error")), [p]), Cn = (0, g.useCallback)((e) => new Promise((t) => {
		bn.current?.(!1), bn.current = t, qt(e);
	}), []), wn = (e) => {
		let t = bn.current;
		bn.current = null, qt(null), t?.(e);
	}, N = (0, g.useCallback)(async (e = v, t = b, r = E, i = We, a = Be, o = He, s = k, c = Je) => {
		if (!e) return;
		let l = ++pt.current;
		ct(!0), ut("");
		try {
			let u = await n.list(e, t, r, a, o, i, it.current, s, c);
			if (l !== pt.current) return;
			re(u.entries), x(u.path), ne(u.path), Ge(u.offset), qe(u.total), Ye(c), Ze(u.nextCursor ?? null), ft(u.capabilities || {}), Hn(/* @__PURE__ */ new Set()), Wn(null);
		} catch (r) {
			if (l !== pt.current) return;
			if (r instanceof S && r.code === "not_found" && t !== "") try {
				let t = await n.list(e, "", "", a, o, 0, it.current, "name", null);
				if (l !== pt.current) return;
				re(t.entries), x(t.path), ne(t.path), Ge(t.offset), qe(t.total), Ye(null), Ze(t.nextCursor ?? null), ft(t.capabilities || {}), Hn(/* @__PURE__ */ new Set()), Wn(null), $e([]), ut(p("missingPathFallback"));
				return;
			} catch (e) {
				r = e;
			}
			re([]), x(t), Ge(i), qe(null), Ye(c), Ze(null), ft({}), Hn(/* @__PURE__ */ new Set()), Wn(null), M(r);
		} finally {
			l === pt.current && ct(!1);
		}
	}, [
		n,
		He,
		We,
		Je,
		b,
		M,
		v,
		E,
		k,
		Be,
		p
	]), P = h.find((e) => e.name === v), Tn = b === "" ? 0 : b.split("/").length, { uploads: En, uploadsCollapsed: Dn, setUploadsCollapsed: On, uploadInput: kn, directoryUploadInput: An, upload: jn, uploadTo: Mn, uploadDirectory: Nn, cancelUpload: Pn, cancelAllUploads: Fn, removeUploadTask: In, retryUpload: Ln, clearFinishedUploads: Rn } = we({
		api: n,
		resource: v,
		path: b,
		currentResource: P,
		currentDepth: Tn,
		autoCollapse: A.autoCollapseUploads,
		t: p,
		ask: Cn,
		reload: async () => {
			await N();
		},
		setNotice: ut,
		report: M
	});
	(0, g.useEffect)(() => {
		n.configData().then(({ resources: t, plugins: n, imagePresets: r, imageCapabilities: i, signedUrls: a }) => {
			_(t), pn(n || []), ln(r || {}), dn(i || {
				driver: "",
				formats: []
			}), hn(a || {
				enabled: !1,
				defaultTtlSeconds: 300,
				maxTtlSeconds: 3600
			});
			let o = t.some((t) => t.name === e.resource) ? e.resource : t[0]?.name || "";
			y(o), o && ($e([]), N(o, e.initialPath || "", "", 0, Be, He, "name", null));
		}).catch(M);
	}, [
		n,
		e.initialPath,
		e.resource
	]), (0, g.useEffect)(() => {
		let t = () => {
			let t = new URL(window.location.href), n = t.searchParams.get("type") || e.resource, r = t.searchParams.get("path") || "";
			ht.current = !0, y(n), de(""), Re("name"), $e([]), N(n, r, "", 0, "name", "asc", "name", null);
		};
		return window.addEventListener("popstate", t), () => window.removeEventListener("popstate", t);
	}, [e.resource, N]), (0, g.useEffect)(() => {
		if (!v || st) return;
		let e = new URL(window.location.href), t = e.searchParams.get("type") || "", n = e.searchParams.get("path") || "";
		if (t === v && n === b) {
			mt.current = !0, ht.current = !1;
			return;
		}
		e.searchParams.set("type", v), b ? e.searchParams.set("path", b) : e.searchParams.delete("path");
		let r = {
			...window.history.state || {},
			sofinder: {
				resource: v,
				path: b
			}
		};
		!mt.current || ht.current ? window.history.replaceState(r, "", e) : window.history.pushState(r, "", e), mt.current = !0, ht.current = !1;
	}, [
		st,
		b,
		v
	]), (0, g.useEffect)(() => {
		if (!gt.current) {
			gt.current = !0;
			return;
		}
		let e = window.setTimeout(() => {
			v && ($e([]), N(v, b, E, 0, Be, He, k, null));
		}, 250);
		return () => window.clearTimeout(e);
	}, [E, k]), (0, g.useEffect)(() => {
		if (v) {
			if (!A.recent && !A.favorites && !A.tags) {
				vt({
					favorites: [],
					tags: {},
					recent: []
				});
				return;
			}
			n.metadata(v).then(vt).catch(M);
		}
	}, [
		n,
		A.favorites,
		A.recent,
		A.tags,
		M,
		v
	]), (0, g.useEffect)(() => {
		let e = (e) => {
			let t = Array.from(e.clipboardData?.files || []);
			t.length > 0 && !P?.readOnly && dt.upload !== !1 && (e.preventDefault(), jn(t));
		};
		return window.addEventListener("paste", e), () => window.removeEventListener("paste", e);
	});
	let zn = (0, g.useMemo)(() => b === "" ? [] : b.split("/"), [b]), Bn = (0, g.useCallback)((e) => {
		A.recent && n.updateMetadata(v, e.path, "touch").then(vt).catch(M);
	}, [
		n,
		A.recent,
		M,
		v
	]), { selectedPaths: Vn, setSelectedPaths: Hn, selectionAnchor: Un, setSelectionAnchor: Wn, selectedEntries: F, selected: I, selectEntry: Gn } = xe(C, a === "picker", Bn), Kn = (e) => un.formats.find((t) => e.mimeType !== null && t.mimes.includes(e.mimeType.toLowerCase())), qn = (e) => !!(e && Kn(e)?.thumbnail), Jn = (e) => !!(e && Kn(e)?.edit), Yn = F.filter((e) => Jn(e)), Xn = (t) => !!(t && !t.directory && t.url && (e.selectionKind !== "image" || Kn(t)?.webEmbeddable)), Zn = async (e) => {
		if (!e.directory) {
			if (P?.entryUrlConfigured && e.url) {
				sn({
					url: new URL(e.url, document.baseURI).href,
					loginRequired: !0
				});
				return;
			}
			if (mn.enabled && P?.deliveryMode === "proxy") {
				try {
					let t = await n.signedUrl(v, e.path, mn.defaultTtlSeconds);
					sn({
						url: t.url,
						loginRequired: !1,
						expiresAt: t.expiresAt
					});
				} catch (e) {
					M(e);
				}
				return;
			}
			sn({
				url: new URL(e.url || n.downloadUrl(v, e.path), document.baseURI).href,
				loginRequired: !e.url
			});
		}
	}, Qn = (e) => F.length > 0 && F.every((t) => t.capabilities?.[e] !== !1), $n = (0, g.useMemo)(() => fn.flatMap((e) => (e.uiActions || []).map((t) => ({
		...t,
		plugin: e.name
	}))), [fn]), er = (0, g.useMemo)(() => fn.flatMap((e) => (e.previewers || []).map((t) => ({
		...t,
		plugin: e.name
	}))), [fn]), tr = (e, t) => {
		if (!Oe(e, t)) return;
		let n = new URL(e.url, document.baseURI);
		n.searchParams.set("resource", v), n.searchParams.set("directory", b), t && n.searchParams.set("path", t.path), window.open(n, "_blank", "noopener");
	};
	(0, g.useEffect)(() => {
		if (bt(null), !I || !Kn(I)?.read) return;
		let e = !0;
		return n.imageInfo(v, I.path).then((t) => {
			e && bt(t);
		}).catch((t) => {
			e && M(t);
		}), () => {
			e = !1;
		};
	}, [
		n,
		v,
		I?.path,
		I?.mimeType,
		M
	]), (0, g.useEffect)(() => {
		if (nn(null), an(null), u.textPreview === !1 || !j || !ze(j.mimeType)) return;
		let e = !0;
		return n.textPreview(v, j.path).then((t) => {
			e && nn({
				path: j.path,
				content: t.content,
				truncated: t.truncated
			});
		}).catch((t) => {
			e && M(t);
		}), () => {
			e = !1;
		};
	}, [
		n,
		u.textPreview,
		j?.path,
		j?.mimeType,
		M,
		v
	]);
	let nr = (e) => {
		e.directory ? ($e([]), N(v, e.path, E, 0, Be, He, k, null)) : lr(e);
	}, rr = async () => {
		P && Gt({
			kind: "folder",
			title: p("newFolder"),
			label: p("folderName"),
			initial: "",
			maximum: P.maxFolderNameLength
		});
	}, ir = async () => {
		if (!I || !P) return;
		let e = I.directory ? -1 : I.name.lastIndexOf("."), t = e > 0 ? I.name.slice(e) : "", n = t ? I.name.slice(0, e) : I.name, r = I.directory ? P.maxFolderNameLength : P.maxFileNameLength;
		Gt({
			kind: "rename",
			title: p("rename"),
			label: p(t ? "newBaseName" : "newName"),
			initial: n,
			maximum: r,
			extension: t
		});
	}, ar = async () => {
		if (!(F.length === 0 || !await Cn({
			title: p("remove"),
			message: F.length === 1 ? p("confirmDelete") : `${p("confirmDeleteMany")} ${F.length}`,
			detail: P?.storageCapabilities?.recoverableDelete === !1 ? p("permanentDeleteWarning") : p("trashRetention"),
			danger: !0
		}))) try {
			let e = await n.batch("delete", v, F.map((e) => e.path)), t = e.failed === 0 ? `${e.succeeded} ${p("completed")}` : `${e.succeeded} ${p("completed")}, ${e.failed} ${p("failed")}`;
			await N(), ut(e.purgedItems > 0 ? `${t} · ${p("trashAutoPurged")} ${e.purgedItems} ${p("items")} (${l(e.purgedBytes)})` : t);
		} catch (e) {
			M(e);
		}
	}, or = async (e) => {
		zt(!1);
		try {
			let t = await n.batchRename(v, e);
			await N(), ut(t.failed === 0 ? `${t.succeeded} ${p("completed")}` : `${t.succeeded} ${p("completed")}, ${t.failed} ${p("failed")}`);
		} catch (e) {
			M(e);
		}
	}, sr = async (e, t) => {
		try {
			let r = await n.batch(e, v, F.map((e) => e.path), t);
			Lt(null), await N(), ut(r.failed === 0 ? `${r.succeeded} ${p("completed")}` : `${r.succeeded} ${p("completed")}, ${r.failed} ${p("failed")}`);
		} catch (e) {
			M(e);
		}
	}, cr = async (e, t) => {
		Lt({
			operation: e,
			path: t,
			folders: [],
			loading: !0
		});
		try {
			let r = await n.list(v, t, "", "name", "asc", 0, 500);
			Lt({
				operation: e,
				path: r.path,
				folders: r.entries.filter((e) => e.directory),
				loading: !1
			});
		} catch (r) {
			if (r instanceof S && r.code === "not_found" && t !== "") try {
				let t = await n.list(v, "", "", "name", "asc", 0, 500);
				Lt({
					operation: e,
					path: t.path,
					folders: t.entries.filter((e) => e.directory),
					loading: !1
				}), ut(p("missingDestinationFallback"));
				return;
			} catch (e) {
				r = e;
			}
			Lt((e) => e ? {
				...e,
				loading: !1
			} : null), M(r);
		}
	}, lr = async (t = I) => {
		if (!Xn(t)) {
			t && e.selectionKind === "image" && ut(p("webImageUnsupported"));
			return;
		}
		if (!t?.url) return;
		let r = t === I ? yt : null;
		if (Kn(t)?.read && r === null) try {
			r = await n.imageInfo(v, t.path);
		} catch {
			r = null;
		}
		let i = {
			...t,
			resource: v,
			url: t.url,
			width: r?.width ?? null,
			height: r?.height ?? null
		};
		if (e.ckeditorFunction > 0) {
			(window.opener || window.parent).CKEDITOR?.tools?.callFunction?.(e.ckeditorFunction, t.url), window.close();
			return;
		}
		if (e.pickerRequestId && e.pickerOrigin) {
			(window.opener || (window.parent === window ? null : window.parent))?.postMessage({
				type: "sofinder:select",
				version: "1.0",
				requestId: e.pickerRequestId,
				entry: i
			}, e.pickerOrigin), window.opener && window.close();
			return;
		}
		window.dispatchEvent(new CustomEvent("sofinder:select", { detail: i }));
	}, ur = () => {
		Hn((e) => e.size === C.length ? /* @__PURE__ */ new Set() : new Set(C.map((e) => e.path))), Wn(null);
	}, dr = async (e, t = 0, r = 0) => {
		if (!(!I || !Jn(I))) {
			ct(!0);
			try {
				let i = e === 0 ? [{
					type: "resize",
					width: t,
					height: r
				}] : [{
					type: "rotate",
					degrees: e
				}], a = await n.applyImageActions(v, I.path, i, { mode: "copy" });
				ut(`${p("imageCreated")}: ${a.entry.name} · ${a.result.width} × ${a.result.height} px`), await N();
			} catch (e) {
				M(e), ct(!1);
			}
		}
	}, fr = () => {
		I && Gt({
			kind: "resize",
			title: p("resize"),
			label: p("resizePrompt"),
			initial: "1200x1200",
			maximum: 9
		});
	}, pr = () => {
		!I || !yt || Vt(!0);
	}, mr = (e, t) => {
		St((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.tools.v3", JSON.stringify(r)), r;
		});
	}, hr = (e, t) => {
		(e === "autoCollapseUploads" || u[e] !== !1) && Ct((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.features.v2", JSON.stringify(r)), r;
		});
	}, gr = (e, t) => {
		Tt((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.listColumns.v1", JSON.stringify(r)), r;
		});
	}, _r = (e, t) => {
		Dt((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.viewSizes.v1", JSON.stringify(r)), r;
		});
	}, vr = async () => {
		if (F.length !== 0) try {
			let e = await n.downloadArchive(v, F.map((e) => e.path)), t = URL.createObjectURL(e), r = document.createElement("a");
			r.href = t, r.download = "sofinder-download.zip", r.click(), window.setTimeout(() => URL.revokeObjectURL(t), 1e3);
		} catch (e) {
			M(e);
		}
	}, yr = async () => {
		if (I) try {
			vt(await n.updateMetadata(v, I.path, "favorite", { favorite: !_t.favorites.includes(I.path) }));
		} catch (e) {
			M(e);
		}
	}, br = async () => {
		I && Zt(!0);
	}, xr = async (e) => {
		let t = Wt;
		if (Gt(null), t) try {
			if (t.kind === "folder") await n.createFolder(v, b, e);
			else if (t.kind === "rename" && I && e !== I.name) await n.rename(v, I.path, e);
			else if (t.kind === "resize") {
				let t = /^(\d{1,4})[x×](\d{1,4})$/i.exec(e.replace(/\s/g, ""));
				if (!t) {
					ut(p("invalidDimensions"));
					return;
				}
				await dr(0, Number(t[1]), Number(t[2]));
			}
			(t.kind === "folder" || t.kind === "rename") && await N();
		} catch (e) {
			M(e);
		}
	}, Sr = async (e) => {
		let t = e.includes("/") ? e.slice(0, e.lastIndexOf("/")) : "", r = e.split("/").pop() || e;
		try {
			if (!(await n.list(v, t, r, "name", "asc", 0, 500)).entries.some((t) => t.path === e)) {
				vt(await n.updateMetadata(v, e, "forget")), ut(p("recentMissing"));
				return;
			}
			await N(v, t, "", 0), Hn(/* @__PURE__ */ new Set([e]));
		} catch (t) {
			if (t instanceof S && t.code === "not_found") {
				try {
					vt(await n.updateMetadata(v, e, "forget"));
				} catch (e) {
					M(e);
					return;
				}
				ut(p("recentMissing"));
				return;
			}
			M(t);
		}
	}, Cr = (e) => {
		ot(e), localStorage.setItem("sofinder.view", e);
	}, wr = (e) => {
		let t = Qt?.entry ?? null;
		if ($t(null), e.startsWith("plugin:")) {
			let n = $n.find((t) => `plugin:${t.plugin}:${t.id}` === e);
			n && tr(n, t);
			return;
		}
		e === "open" && t?.directory ? nr(t) : e === "preview" && t && !t.directory ? en(t) : e === "select" && t ? lr(t) : e === "rename" ? ir() : e === "copy" ? cr("copy", b) : e === "move" ? cr("move", b) : e === "delete" ? ar() : e === "download" && t && !t.directory && window.location.assign(t.url || n.downloadUrl(v, t.path));
	}, Tr = async (e) => {
		if (I) try {
			let t = await n.applyImageActions(v, I.path, [{
				type: "preset",
				name: e
			}], { mode: "copy" });
			ut(`${p("imageCreated")}: ${t.entry.name} · ${t.result.width} × ${t.result.height} px`), await N();
		} catch (e) {
			M(e);
		}
	}, Er = (e) => {
		window.requestAnimationFrame(() => {
			document.querySelector(`button.sf-entry[data-entry-index="${e}"]`)?.focus();
		});
	}, Dr = (e, t, n = !1) => {
		let r = _e[e], i = Math.round(Math.max(r.min, Math.min(r.max, t)));
		e === "left" ? _n(i) : yn(i), n && localStorage.setItem(`sofinder.column.${e}`, String(i));
	}, Or = (e, t) => {
		t.preventDefault(), t.currentTarget.setPointerCapture(t.pointerId), t.currentTarget.classList.add("is-resizing");
		let n = e === "left" ? gn : vn;
		Sn.current = {
			side: e,
			startX: t.clientX,
			startWidth: n,
			currentWidth: n,
			element: t.currentTarget
		};
	}, kr = (e) => {
		let t = Sn.current;
		if (!t) return;
		let n = e.clientX - t.startX, r = _e[t.side];
		t.currentWidth = Math.round(Math.max(r.min, Math.min(r.max, t.startWidth + (t.side === "left" ? n : -n)))), Dr(t.side, t.currentWidth);
	}, Ar = () => {
		let e = Sn.current;
		Sn.current = null, e && (e.element.classList.remove("is-resizing"), Dr(e.side, e.currentWidth, !0));
	}, jr = (e, t) => {
		let n = t.key === "ArrowLeft" ? -1 : +(t.key === "ArrowRight");
		n !== 0 && (t.preventDefault(), Dr(e, (e === "left" ? gn : vn) + (e === "left" ? n : -n) * 10, !0));
	}, Mr = (e) => {
		let t = e.target, n = t.matches("button.sf-entry");
		if (t.isContentEditable || [
			"INPUT",
			"SELECT",
			"TEXTAREA",
			"BUTTON",
			"A"
		].includes(t.tagName) && !n) return;
		if (a === "manager" && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
			e.preventDefault(), ur();
			return;
		}
		if (e.key === "Escape") {
			e.preventDefault(), Hn(/* @__PURE__ */ new Set()), Wn(null);
			return;
		}
		if (a === "manager" && e.key === "Delete" && Qn("delete") && !P?.readOnly) {
			e.preventDefault(), ar();
			return;
		}
		if (a === "manager" && e.key === "F2" && F.length === 1 && Qn("rename") && !P?.readOnly) {
			e.preventDefault(), ir();
			return;
		}
		if (e.key === "Enter" && F.length === 1) {
			e.preventDefault(), nr(F[0]);
			return;
		}
		let r = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : +(e.key === "ArrowRight" || e.key === "ArrowDown");
		if (r !== 0 && C.length > 0) {
			e.preventDefault();
			let t = Un || F[0]?.path, n = t ? C.findIndex((e) => e.path === t) : r > 0 ? -1 : C.length, i = Math.max(0, Math.min(C.length - 1, n + r)), a = C[i];
			Hn(/* @__PURE__ */ new Set([a.path])), Wn(a.path), Er(i);
		}
	}, Nr = It !== null && F.some((e) => {
		let t = e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : "", n = It.path === "" ? 0 : It.path.split("/").length;
		return It.operation === "move" && It.path === t || e.directory && P !== void 0 && n >= P.maxFolderDepth || e.directory && (It.path === e.path || It.path.startsWith(`${e.path}/`));
	}), Pr = En.some((e) => e.status === "queued" || e.status === "uploading"), Fr = e.uiDefaults.fullTools === !0, Ir = e.uiDefaults.logo !== !1, Lr = P?.storageCapabilities?.recoverableDelete !== !1, Rr = h.length > 1 || A.folderTree || A.recent || !!(P?.readOnly || P?.quotaBytes), zr = (e) => A.recent ? /* @__PURE__ */ (0, w.jsxs)("div", {
		className: `sf-recent sf-recent-${e}`,
		children: [/* @__PURE__ */ (0, w.jsxs)("header", { children: [/* @__PURE__ */ (0, w.jsx)("strong", { children: p("recent") }), /* @__PURE__ */ (0, w.jsx)("span", { children: _t.recent.length })] }), _t.recent.length === 0 ? /* @__PURE__ */ (0, w.jsx)("p", {
			className: "sf-recent-empty",
			children: p("recentEmpty")
		}) : _t.recent.slice(0, 8).map((e) => /* @__PURE__ */ (0, w.jsxs)("button", {
			title: e.path,
			onClick: () => void Sr(e.path),
			children: [/* @__PURE__ */ (0, w.jsx)("span", {
				className: "sf-recent-icon",
				children: /* @__PURE__ */ (0, w.jsx)(r, { name: "history" })
			}), /* @__PURE__ */ (0, w.jsxs)("span", { children: [/* @__PURE__ */ (0, w.jsx)("b", { children: e.path.split("/").pop() }), /* @__PURE__ */ (0, w.jsx)("small", { children: e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : p("home") })] })]
		}, e.path))]
	}) : null, Br = (a === "manager" || Fr) && F.length > 0, L = (e, t) => /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [/* @__PURE__ */ (0, w.jsx)(r, { name: e }), /* @__PURE__ */ (0, w.jsx)("span", { children: t })] }), Vr = (e, t, n = E) => {
		$e([]), N(e, t, n, 0, Be, He, k, null);
	}, Hr = () => {
		if (Qe.length === 0) return;
		let e = Qe.slice(0, -1), t = Qe[Qe.length - 1] ?? null;
		$e(e), N(v, b, E, Math.max(0, We - et), Be, He, k, t);
	}, Ur = () => {
		Xe !== null && ($e((e) => [...e, Je]), N(v, b, E, We + et, Be, He, k, Xe));
	}, Wr = () => {
		let e = Number(nt);
		if (!Number.isFinite(e) || e <= 0) {
			rt(String(et));
			return;
		}
		let t = ye(e);
		rt(String(t)), t !== et && (it.current = t, tt(t), localStorage.setItem("sofinder.pageSize.v1", String(t)), $e([]), N(v, b, E, 0, Be, He, k, null));
	};
	return /* @__PURE__ */ (0, w.jsxs)("main", {
		className: `sf-app sf-mode-${a}${Rr ? "" : " sf-no-sidebar"}${Br ? "" : " sf-no-details"}${(a === "manager" || Fr) && F.length > 0 ? " sf-has-selection-actions" : ""}`,
		onKeyDown: Mr,
		onDragOver: (e) => e.preventDefault(),
		onDrop: (e) => {
			e.preventDefault(), e.dataTransfer.files.length && jn(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ (0, w.jsxs)("div", {
				className: `sf-commandbar ${Ir ? "sf-has-brand" : "sf-no-brand"}`,
				children: [
					Ir ? /* @__PURE__ */ (0, w.jsxs)("div", {
						className: "sf-brand",
						title: "SoFinder",
						children: [/* @__PURE__ */ (0, w.jsx)("span", {
							className: "sf-brand-mark",
							"aria-hidden": "true",
							children: "S"
						}), e.uiDefaults.header === !0 ? /* @__PURE__ */ (0, w.jsx)("strong", { children: "SoFinder" }) : /* @__PURE__ */ (0, w.jsx)("span", {
							className: "sf-sr-only",
							children: "SoFinder"
						})]
					}) : /* @__PURE__ */ (0, w.jsxs)("nav", {
						className: "sf-breadcrumb sf-command-breadcrumb",
						"aria-label": "Breadcrumb",
						children: [/* @__PURE__ */ (0, w.jsx)("button", {
							onClick: () => Vr(v, ""),
							children: p("home")
						}), zn.map((e, t) => /* @__PURE__ */ (0, w.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, w.jsx)("button", {
							onClick: () => Vr(v, zn.slice(0, t + 1).join("/")),
							children: e
						})] }, `${e}-${t}`))]
					}),
					e.uiDefaults.search !== !1 && /* @__PURE__ */ (0, w.jsxs)("div", {
						className: "sf-search",
						children: [
							/* @__PURE__ */ (0, w.jsx)(r, { name: "search" }),
							/* @__PURE__ */ (0, w.jsxs)("select", {
								value: k,
								onChange: (e) => {
									let t = e.target.value;
									Re(t), Ge(0);
								},
								"aria-label": p("searchScope"),
								children: [/* @__PURE__ */ (0, w.jsx)("option", {
									value: "name",
									disabled: P?.storageCapabilities?.search === !1,
									children: p("name")
								}), /* @__PURE__ */ (0, w.jsx)("option", {
									value: "tags",
									children: p("tags")
								})]
							}),
							/* @__PURE__ */ (0, w.jsx)("input", {
								disabled: k === "name" && P?.storageCapabilities?.search === !1,
								value: E,
								onChange: (e) => de(e.target.value),
								placeholder: p(k === "tags" ? "searchTags" : "search"),
								"aria-label": p(k === "tags" ? "searchTags" : "search")
							})
						]
					}),
					/* @__PURE__ */ (0, w.jsxs)("div", {
						className: "sf-command-actions",
						children: [e.uiDefaults.viewSwitcher !== !1 && /* @__PURE__ */ (0, w.jsxs)("div", {
							className: "sf-view-toggle",
							role: "group",
							"aria-label": `${p("grid")} / ${p("list")}`,
							children: [/* @__PURE__ */ (0, w.jsx)("button", {
								className: at === "grid" ? "active" : "",
								onClick: () => Cr("grid"),
								title: p("grid"),
								"aria-label": p("grid"),
								children: /* @__PURE__ */ (0, w.jsx)(r, { name: "grid" })
							}), /* @__PURE__ */ (0, w.jsx)("button", {
								className: at === "list" ? "active" : "",
								onClick: () => Cr("list"),
								title: p("list"),
								"aria-label": p("list"),
								children: /* @__PURE__ */ (0, w.jsx)(r, { name: "list" })
							})]
						}), /* @__PURE__ */ (0, w.jsxs)("div", {
							className: "sf-utility",
							children: [/* @__PURE__ */ (0, w.jsx)("button", {
								className: "sf-icon-only",
								onClick: () => Nt((e) => !e),
								"aria-expanded": Mt,
								title: p("moreActions"),
								"aria-label": p("moreActions"),
								children: /* @__PURE__ */ (0, w.jsx)(r, { name: "more" })
							}), Mt && /* @__PURE__ */ (0, w.jsxs)("div", {
								className: "sf-utility-menu",
								role: "menu",
								children: [
									e.uiDefaults.languageSwitcher !== !1 && /* @__PURE__ */ (0, w.jsxs)("label", { children: [/* @__PURE__ */ (0, w.jsx)("span", { children: p("language") }), /* @__PURE__ */ (0, w.jsxs)("select", {
										value: d,
										onChange: (e) => f(e.target.value),
										"aria-label": p("language"),
										children: [
											/* @__PURE__ */ (0, w.jsx)("option", {
												value: "zh-cn",
												children: "简中"
											}),
											/* @__PURE__ */ (0, w.jsx)("option", {
												value: "zh-tw",
												children: "繁中"
											}),
											/* @__PURE__ */ (0, w.jsx)("option", {
												value: "en",
												children: "EN"
											})
										]
									})] }),
									/* @__PURE__ */ (0, w.jsxs)("label", { children: [/* @__PURE__ */ (0, w.jsx)("span", { children: p("sort") }), /* @__PURE__ */ (0, w.jsxs)("select", {
										value: Be,
										disabled: P?.storageCapabilities?.sort === !1,
										onChange: (e) => {
											let t = e.target.value;
											Ve(t), $e([]), N(v, b, E, 0, t, He, k, null);
										},
										children: [
											/* @__PURE__ */ (0, w.jsx)("option", {
												value: "name",
												children: p("name")
											}),
											/* @__PURE__ */ (0, w.jsx)("option", {
												value: "size",
												children: p("size")
											}),
											/* @__PURE__ */ (0, w.jsx)("option", {
												value: "modified",
												children: p("modified")
											})
										]
									})] }),
									/* @__PURE__ */ (0, w.jsx)("button", {
										role: "menuitem",
										disabled: P?.storageCapabilities?.sort === !1,
										onClick: () => {
											let e = He === "asc" ? "desc" : "asc";
											Ue(e), $e([]), N(v, b, E, 0, Be, e, k, null);
										},
										children: L("sort", p("direction"))
									}),
									/* @__PURE__ */ (0, w.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											Nt(!1), N();
										},
										children: L("refresh", p("refresh"))
									}),
									/* @__PURE__ */ (0, w.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											Nt(!1), kt(!0);
										},
										children: L("settings", p("settings"))
									}),
									(a === "manager" || Fr) && e.securityStatusAvailable !== !1 && /* @__PURE__ */ (0, w.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											Nt(!1), jt(!0);
										},
										children: L("security", p("securityStatus"))
									}),
									(a === "manager" || Fr) && A.trash && Lr && /* @__PURE__ */ (0, w.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											Nt(!1), Yt(!0);
										},
										children: L("trash", p("trash"))
									}),
									(a === "manager" || Fr) && $n.filter((e) => e.slot === "utility" && Oe(e, null)).map((e) => /* @__PURE__ */ (0, w.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											Nt(!1), tr(e, null);
										},
										children: Te(e, d)
									}, `${e.plugin}:${e.id}`))
								]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, w.jsxs)("div", {
				className: "sf-toolbar",
				role: "toolbar",
				"aria-label": p("fileActions"),
				title: p("keyboardHelp"),
				children: [
					/* @__PURE__ */ (0, w.jsx)("button", {
						onClick: rr,
						disabled: P?.readOnly || dt.create_folder === !1 || P !== void 0 && Tn >= P.maxFolderDepth,
						title: P && Tn >= P.maxFolderDepth ? p("folderDepthReached") : void 0,
						children: L("add-folder", p("newFolder"))
					}),
					/* @__PURE__ */ (0, w.jsx)("button", {
						className: `primary sf-upload-trigger${Pr ? " is-active" : ""}`,
						"aria-busy": Pr,
						onClick: () => kn.current?.click(),
						disabled: P?.readOnly || dt.upload === !1,
						children: L("upload", `${p("upload")}${Pr ? ` (${En.filter((e) => e.status === "queued" || e.status === "uploading").length})` : ""}`)
					}),
					/* @__PURE__ */ (0, w.jsx)("input", {
						ref: kn,
						type: "file",
						multiple: !0,
						hidden: !0,
						onChange: (e) => {
							e.target.files && jn(e.target.files), e.target.value = "";
						}
					}),
					u.folderUpload !== !1 && /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [/* @__PURE__ */ (0, w.jsx)("button", {
						onClick: () => An.current?.click(),
						disabled: P?.readOnly || dt.upload === !1,
						children: L("add-folder", p("uploadFolder"))
					}), /* @__PURE__ */ (0, w.jsx)("input", {
						ref: (e) => {
							An.current = e, e?.setAttribute("webkitdirectory", "");
						},
						type: "file",
						multiple: !0,
						hidden: !0,
						onChange: (e) => {
							e.target.files && Nn(e.target.files), e.target.value = "";
						}
					})] }),
					(a === "manager" || Fr) && F.length > 0 && /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [/* @__PURE__ */ (0, w.jsx)("span", { className: "sf-separator" }), /* @__PURE__ */ (0, w.jsxs)("div", {
						className: "sf-context-actions",
						children: [
							/* @__PURE__ */ (0, w.jsx)("button", {
								onClick: ur,
								disabled: C.length === 0,
								children: L("select", Vn.size === C.length && C.length > 0 ? p("clearSelection") : p("selectAll"))
							}),
							/* @__PURE__ */ (0, w.jsx)("button", {
								onClick: ir,
								disabled: F.length !== 1 || !Qn("rename") || P?.readOnly,
								children: L("rename", p("rename"))
							}),
							u.batchRename !== !1 && xt.batchRename && /* @__PURE__ */ (0, w.jsx)("button", {
								onClick: () => zt(!0),
								disabled: F.length < 2 || !Qn("rename") || P?.readOnly,
								children: L("rename", p("batchRename"))
							}),
							/* @__PURE__ */ (0, w.jsx)("button", {
								onClick: () => void cr("copy", b),
								disabled: !Qn("copy") || P?.readOnly,
								children: L("copy", p("copy"))
							}),
							/* @__PURE__ */ (0, w.jsx)("button", {
								onClick: () => void cr("move", b),
								disabled: !Qn("move") || P?.readOnly,
								children: L("move", p("move"))
							}),
							A.archive && /* @__PURE__ */ (0, w.jsx)("button", {
								onClick: () => void vr(),
								children: L("archive", p("downloadZip"))
							}),
							A.favorites && /* @__PURE__ */ (0, w.jsx)("button", {
								onClick: () => void yr(),
								disabled: !I,
								children: L("favorite", p("favorite"))
							}),
							A.tags && /* @__PURE__ */ (0, w.jsx)("button", {
								onClick: () => void br(),
								disabled: !I,
								children: L("tags", p("tags"))
							}),
							/* @__PURE__ */ (0, w.jsx)("button", {
								className: "danger",
								onClick: ar,
								disabled: !Qn("delete") || P?.readOnly,
								children: L("delete", `${p("remove")}${F.length > 1 ? ` (${F.length})` : ""}`)
							}),
							u.imageEditing !== !1 && xt.rotate && /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [/* @__PURE__ */ (0, w.jsx)("button", {
								onClick: () => void dr(270),
								disabled: !Jn(I) || P?.readOnly,
								children: L("rotate-left", p("rotateLeft"))
							}), /* @__PURE__ */ (0, w.jsx)("button", {
								onClick: () => void dr(90),
								disabled: !Jn(I) || P?.readOnly,
								children: L("rotate-right", p("rotateRight"))
							})] }),
							u.imageEditing !== !1 && xt.resize && /* @__PURE__ */ (0, w.jsx)("button", {
								onClick: fr,
								disabled: !Jn(I) || P?.readOnly,
								children: L("resize", p("resize"))
							}),
							u.imageEditing !== !1 && xt.crop && /* @__PURE__ */ (0, w.jsx)("button", {
								onClick: pr,
								disabled: !Jn(I) || !yt || P?.readOnly,
								children: L("crop", p("crop"))
							}),
							u.imageProcessing !== !1 && xt.process && /* @__PURE__ */ (0, w.jsx)("button", {
								onClick: () => Ut(!0),
								disabled: Yn.length === 0 || Yn.length !== F.length || P?.readOnly,
								children: L("resize", p("imageProcess"))
							}),
							u.imageEditing !== !1 && xt.presets && /* @__PURE__ */ (0, w.jsxs)("label", {
								className: "sf-sort",
								children: [p("preset"), /* @__PURE__ */ (0, w.jsxs)("select", {
									value: "",
									disabled: !Jn(I) || P?.readOnly || Object.keys(cn).length === 0,
									onChange: (e) => {
										let t = e.target.value;
										e.target.value = "", t && Tr(t);
									},
									children: [/* @__PURE__ */ (0, w.jsx)("option", {
										value: "",
										children: "—"
									}), Object.entries(cn).map(([e, t]) => /* @__PURE__ */ (0, w.jsxs)("option", {
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
								})]
							}),
							I && $n.filter((e) => e.slot === "toolbar" && Oe(e, I)).map((e) => /* @__PURE__ */ (0, w.jsx)("button", {
								onClick: () => tr(e, I),
								children: Te(e, d)
							}, `${e.plugin}:${e.id}`))
						]
					})] })
				]
			}),
			lt && /* @__PURE__ */ (0, w.jsxs)("div", {
				className: "sf-notice",
				role: "alert",
				children: [lt, /* @__PURE__ */ (0, w.jsx)("button", {
					onClick: () => ut(""),
					"aria-label": p("close"),
					children: /* @__PURE__ */ (0, w.jsx)(r, { name: "close" })
				})]
			}),
			/* @__PURE__ */ (0, w.jsx)(ue, {
				tasks: En,
				collapsed: Dn,
				labels: {
					title: p("uploadQueue"),
					expand: p("expand"),
					collapse: p("collapse"),
					cancel: p("cancel"),
					cancelAll: p("cancelAll"),
					clearFinished: p("clearFinished"),
					retry: p("retryUpload"),
					remove: p("removeUploadTask"),
					status: (e) => p(e)
				},
				onToggle: () => On((e) => !e),
				onCancel: Pn,
				onCancelAll: Fn,
				onClearFinished: Rn,
				onRetry: Ln,
				onRemove: In
			}),
			/* @__PURE__ */ (0, w.jsxs)("div", {
				className: "sf-layout",
				style: {
					"--sf-sidebar-width": `${gn}px`,
					"--sf-details-width": `${vn}px`
				},
				children: [
					Rr && /* @__PURE__ */ (0, w.jsxs)("aside", {
						className: "sf-sidebar",
						"aria-label": "Resources",
						children: [
							h.map((e) => /* @__PURE__ */ (0, w.jsxs)("button", {
								className: e.name === v ? "active" : "",
								onClick: () => {
									y(e.name), de(""), Re("name"), e.storageCapabilities?.sort === !1 ? (Ve("name"), Ue("asc"), $e([]), N(e.name, "", "", 0, "name", "asc", "name", null)) : Vr(e.name, "", "");
								},
								children: [/* @__PURE__ */ (0, w.jsx)("span", {
									className: "sf-resource-icon",
									children: /* @__PURE__ */ (0, w.jsx)(c, { kind: e.name.toLowerCase().includes("image") ? "image" : "folder" })
								}), e.name.toLowerCase().includes("image") ? p("images") : e.name.toLowerCase() === "files" ? p("files") : e.name]
							}, e.name)),
							A.folderTree && v && /* @__PURE__ */ (0, w.jsx)(ce, {
								api: n,
								resource: v,
								currentPath: ee,
								rootLabel: p("home"),
								onNavigate: (e) => Vr(v, e, "")
							}),
							P && /* @__PURE__ */ (0, w.jsxs)("div", {
								className: "sf-resource-status",
								children: [P.readOnly && /* @__PURE__ */ (0, w.jsx)("strong", { children: p("readOnly") }), P.quotaBytes > 0 && /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [/* @__PURE__ */ (0, w.jsxs)("span", { children: [
									p("storageUsage"),
									": ",
									l(P.usedBytes),
									" / ",
									l(P.quotaBytes)
								] }), /* @__PURE__ */ (0, w.jsx)("progress", {
									max: P.quotaBytes,
									value: Math.min(P.usedBytes, P.quotaBytes)
								})] })]
							}),
							zr("sidebar")
						]
					}),
					Rr && /* @__PURE__ */ (0, w.jsx)("div", {
						className: "sf-column-resizer left",
						role: "separator",
						tabIndex: 0,
						"aria-label": p("resizeLeftPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": _e.left.min,
						"aria-valuemax": _e.left.max,
						"aria-valuenow": gn,
						onPointerDown: (e) => Or("left", e),
						onPointerMove: kr,
						onPointerUp: Ar,
						onPointerCancel: Ar,
						onKeyDown: (e) => jr("left", e),
						onDoubleClick: () => Dr("left", _e.left.initial, !0)
					}),
					/* @__PURE__ */ (0, w.jsxs)("section", {
						className: "sf-content",
						children: [
							zr("mobile"),
							Ir && /* @__PURE__ */ (0, w.jsxs)("nav", {
								className: "sf-breadcrumb",
								"aria-label": "Breadcrumb",
								children: [/* @__PURE__ */ (0, w.jsx)("button", {
									onClick: () => Vr(v, ""),
									children: p("home")
								}), zn.map((e, t) => /* @__PURE__ */ (0, w.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, w.jsx)("button", {
									onClick: () => Vr(v, zn.slice(0, t + 1).join("/")),
									children: e
								})] }, `${e}-${t}`))]
							}),
							st ? /* @__PURE__ */ (0, w.jsx)("div", {
								className: "sf-state",
								children: p("loading")
							}) : C.length === 0 ? /* @__PURE__ */ (0, w.jsx)("div", {
								className: "sf-state",
								children: p("empty")
							}) : /* @__PURE__ */ (0, w.jsxs)("div", {
								className: `sf-entries ${at} sf-grid-size-${Et.grid} sf-list-size-${Et.list}${at === "list" && wt.size ? " sf-list-has-size" : ""}`,
								style: at === "list" ? { "--sf-list-columns": [
									"minmax(220px, 1fr)",
									...wt.size ? ["100px"] : [],
									...wt.type ? ["160px"] : [],
									...wt.modified ? ["180px"] : []
								].join(" ") } : void 0,
								role: "listbox",
								"aria-multiselectable": a === "manager",
								"aria-label": p("files"),
								children: [at === "list" && /* @__PURE__ */ (0, w.jsxs)("div", {
									className: "sf-list-head",
									role: "presentation",
									"aria-hidden": "true",
									children: [
										/* @__PURE__ */ (0, w.jsx)("span", { children: p("name") }),
										wt.size && /* @__PURE__ */ (0, w.jsx)("span", {
											className: "sf-list-size",
											children: p("size")
										}),
										wt.type && /* @__PURE__ */ (0, w.jsx)("span", {
											className: "sf-list-type",
											children: p("type")
										}),
										wt.modified && /* @__PURE__ */ (0, w.jsx)("span", {
											className: "sf-list-modified",
											children: p("modified")
										})
									]
								}), C.map((e, t) => {
									let i = !e.directory && qn(e);
									return /* @__PURE__ */ (0, w.jsxs)("button", {
										"data-entry-index": t,
										role: "option",
										"aria-selected": Vn.has(e.path),
										"aria-label": `${e.name}, ${e.directory ? p("folder") : l(e.size)}`,
										className: `sf-entry ${Vn.has(e.path) ? "selected" : ""}`,
										onClick: (t) => Gn(e, t),
										onDoubleClick: () => nr(e),
										onContextMenu: (t) => {
											t.preventDefault(), Hn(/* @__PURE__ */ new Set([e.path])), Wn(e.path), $t({
												x: t.clientX,
												y: t.clientY,
												entry: e
											});
										},
										onPointerDown: (t) => {
											t.pointerType === "touch" && (xn.current = window.setTimeout(() => {
												Hn(/* @__PURE__ */ new Set([e.path])), Wn(e.path), $t({
													x: t.clientX,
													y: t.clientY,
													entry: e
												});
											}, 550));
										},
										onPointerUp: () => {
											xn.current !== null && window.clearTimeout(xn.current), xn.current = null;
										},
										onPointerCancel: () => {
											xn.current !== null && window.clearTimeout(xn.current), xn.current = null;
										},
										onDragOver: (t) => {
											e.directory && t.preventDefault();
										},
										onDrop: (t) => {
											e.directory && t.dataTransfer.files.length && (t.preventDefault(), Mn(e.path, t.dataTransfer.files));
										},
										children: [
											/* @__PURE__ */ (0, w.jsx)("span", {
												className: "sf-entry-icon",
												children: i ? /* @__PURE__ */ (0, w.jsx)(s, {
													src: n.thumbnailUrl(v, e),
													alt: "",
													lazy: !0
												}) : /* @__PURE__ */ (0, w.jsx)(c, {
													name: e.name,
													mimeType: e.mimeType,
													directory: e.directory
												})
											}),
											/* @__PURE__ */ (0, w.jsxs)("span", {
												className: "sf-entry-name",
												title: e.name,
												children: [A.favorites && _t.favorites.includes(e.path) && /* @__PURE__ */ (0, w.jsxs)("span", {
													"aria-label": p("favorite"),
													children: [/* @__PURE__ */ (0, w.jsx)(r, { name: "favorite" }), " "]
												}), e.name]
											}),
											wt.size && /* @__PURE__ */ (0, w.jsx)("span", {
												className: "sf-entry-size",
												children: e.directory ? "—" : l(e.size)
											}),
											wt.type && /* @__PURE__ */ (0, w.jsx)("span", {
												className: "sf-entry-type",
												children: e.directory ? p("folder") : e.mimeType || p("file")
											}),
											wt.modified && /* @__PURE__ */ (0, w.jsx)("time", {
												className: "sf-entry-modified",
												dateTime: (/* @__PURE__ */ new Date(e.modifiedAt * 1e3)).toISOString(),
												children: m.format(e.modifiedAt * 1e3)
											})
										]
									}, e.path);
								})]
							}),
							/* @__PURE__ */ (0, w.jsxs)("nav", {
								className: "sf-pagination",
								"aria-label": p("pagination"),
								children: [
									/* @__PURE__ */ (0, w.jsxs)("div", {
										className: "sf-page-navigation",
										children: [
											/* @__PURE__ */ (0, w.jsxs)("button", {
												disabled: Qe.length === 0,
												onClick: Hr,
												children: [
													/* @__PURE__ */ (0, w.jsx)(r, { name: "chevron-left" }),
													" ",
													p("previous")
												]
											}),
											/* @__PURE__ */ (0, w.jsxs)("span", { children: [
												p("page"),
												" ",
												Qe.length + 1,
												Ke === null ? "" : ` / ${Math.max(1, Math.ceil(Ke / et))}`
											] }),
											/* @__PURE__ */ (0, w.jsxs)("button", {
												disabled: Xe === null,
												onClick: Ur,
												children: [
													p("next"),
													" ",
													/* @__PURE__ */ (0, w.jsx)(r, { name: "chevron-right" })
												]
											})
										]
									}),
									/* @__PURE__ */ (0, w.jsxs)("label", {
										className: "sf-page-size",
										children: [/* @__PURE__ */ (0, w.jsxs)("span", { children: [
											p("itemsPerPage"),
											" (",
											ve.min,
											"–",
											ve.max,
											")"
										] }), /* @__PURE__ */ (0, w.jsx)("input", {
											type: "number",
											min: ve.min,
											max: ve.max,
											step: "10",
											list: t,
											value: nt,
											onChange: (e) => rt(e.target.value),
											onBlur: Wr,
											onKeyDown: (e) => {
												e.key === "Enter" && e.currentTarget.blur();
											}
										})]
									}),
									/* @__PURE__ */ (0, w.jsx)("datalist", {
										id: t,
										children: [
											20,
											50,
											100,
											200,
											500
										].map((e) => /* @__PURE__ */ (0, w.jsx)("option", { value: e }, e))
									})
								]
							})
						]
					}),
					Br && /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [/* @__PURE__ */ (0, w.jsx)("div", {
						className: "sf-column-resizer right",
						role: "separator",
						tabIndex: 0,
						"aria-label": p("resizeRightPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": _e.right.min,
						"aria-valuemax": _e.right.max,
						"aria-valuenow": vn,
						onPointerDown: (e) => Or("right", e),
						onPointerMove: kr,
						onPointerUp: Ar,
						onPointerCancel: Ar,
						onKeyDown: (e) => jr("right", e),
						onDoubleClick: () => Dr("right", _e.right.initial, !0)
					}), /* @__PURE__ */ (0, w.jsx)(T, {
						api: n,
						resource: v,
						selectedEntries: F,
						selected: I,
						imageInfo: yt,
						metadata: _t,
						showTags: A.tags,
						previewImage: qn(I),
						selectMode: !1,
						selectAllowed: Xn(I),
						labels: {
							details: p("details"),
							selected: p("selectedCount"),
							type: p("type"),
							folder: p("folder"),
							file: p("file"),
							size: p("size"),
							dimensions: p("dimensions"),
							modified: p("modified"),
							location: p("location"),
							select: p("select"),
							download: p("download"),
							copyUrl: p("copyUrl"),
							unsupportedWebImage: p("webImageUnsupported")
						},
						formatDate: (e) => m.format(e * 1e3),
						onChoose: lr,
						onOpenUrl: Zn,
						pluginActions: I && $n.filter((e) => e.slot === "details" && Oe(e, I)).map((e) => /* @__PURE__ */ (0, w.jsx)("button", {
							onClick: () => tr(e, I),
							children: Te(e, d)
						}, `${e.plugin}:${e.id}`))
					})] })
				]
			}),
			a === "picker" && I && !I.directory && /* @__PURE__ */ (0, w.jsxs)("div", {
				className: "sf-picker-bar",
				children: [
					/* @__PURE__ */ (0, w.jsxs)("div", { children: [/* @__PURE__ */ (0, w.jsx)("strong", { children: I.name }), /* @__PURE__ */ (0, w.jsx)("small", { children: l(I.size) })] }),
					!Xn(I) && /* @__PURE__ */ (0, w.jsx)("span", {
						role: "status",
						children: p("webImageUnsupported")
					}),
					/* @__PURE__ */ (0, w.jsx)("button", {
						className: "primary",
						disabled: !Xn(I),
						onClick: () => void lr(),
						children: p("select")
					})
				]
			}),
			Ot && /* @__PURE__ */ (0, w.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, w.jsx)("div", {
					className: "sf-state",
					children: p("loading")
				}),
				children: /* @__PURE__ */ (0, w.jsx)(Ne, {
					resource: P,
					tools: xt,
					features: A,
					columns: wt,
					viewSizes: Et,
					availability: u,
					scale: Pt,
					translate: p,
					onToolChange: mr,
					onFeatureChange: hr,
					onColumnChange: gr,
					onViewSizeChange: _r,
					onScaleChange: Ft,
					onClose: () => kt(!1)
				})
			}),
			At && /* @__PURE__ */ (0, w.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, w.jsx)("div", {
					className: "sf-state",
					children: p("loading")
				}),
				children: /* @__PURE__ */ (0, w.jsx)(je, {
					api: n,
					formatDate: (e) => m.format(e * 1e3),
					labels: {
						title: p("securityStatus"),
						close: p("close"),
						loading: p("loading"),
						enabled: p("malwareScanningEnabled"),
						disabled: p("malwareScanningDisabled"),
						provider: p("scanProvider"),
						service: p("serviceStatus"),
						scans: p("scanHistory"),
						passed: p("scanPassed"),
						quarantined: p("scanQuarantined"),
						failed: p("scanFailed"),
						pending: p("scanPending"),
						recent: p("recentScans"),
						none: p("noScans")
					},
					onClose: () => jt(!1)
				})
			}),
			It && /* @__PURE__ */ (0, w.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, w.jsx)("div", {
					className: "sf-state",
					children: p("loading")
				}),
				children: /* @__PURE__ */ (0, w.jsx)(Pe, {
					state: It,
					unsafe: Nr,
					translate: p,
					onBrowse: (e, t) => void cr(e, t),
					onConfirm: (e, t) => void sr(e, t),
					onClose: () => Lt(null)
				})
			}),
			Rt && u.batchRename !== !1 && xt.batchRename && P && /* @__PURE__ */ (0, w.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, w.jsx)("div", {
					className: "sf-state",
					children: p("loading")
				}),
				children: /* @__PURE__ */ (0, w.jsx)(Fe, {
					entries: F,
					maximum: P.maxFileNameLength,
					labels: {
						title: p("batchRename"),
						pattern: p("renamePattern"),
						hint: p("renamePatternHint"),
						oldName: p("oldName"),
						newName: p("newName"),
						invalid: p("invalidEntryName"),
						duplicate: p("duplicateRename"),
						cancel: p("cancel"),
						save: p("rename"),
						close: p("close")
					},
					onClose: () => zt(!1),
					onSave: (e) => void or(e)
				})
			}),
			Wt && /* @__PURE__ */ (0, w.jsx)(ae, {
				title: Wt.title,
				label: Wt.label,
				initialValue: Wt.initial,
				maximum: Wt.maximum,
				extension: Wt.extension,
				invalidNameLabel: p("invalidEntryName"),
				confirmLabel: p("confirm"),
				cancelLabel: p("cancel"),
				closeLabel: p("close"),
				onConfirm: (e) => void xr(e),
				onClose: () => Gt(null)
			}),
			Kt && /* @__PURE__ */ (0, w.jsx)(oe, {
				...Kt,
				confirmLabel: p("confirm"),
				cancelLabel: p("cancel"),
				closeLabel: p("close"),
				onConfirm: () => wn(!0),
				onClose: () => wn(!1)
			}),
			Jt && /* @__PURE__ */ (0, w.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, w.jsx)("div", {
					className: "sf-state",
					children: p("loading")
				}),
				children: /* @__PURE__ */ (0, w.jsx)(Ie, {
					api: n,
					resource: v,
					locale: d,
					labels: {
						title: p("trash"),
						close: p("close"),
						cancel: p("cancel"),
						empty: p("trashEmpty"),
						restore: p("restore"),
						permanentDelete: p("permanentDelete"),
						expires: p("expires"),
						conflict: p("restoreConflict"),
						overwrite: p("restoreOverwrite"),
						autoRename: p("restoreAutoRename"),
						usage: p("trashUsage"),
						items: p("items"),
						previous: p("previous"),
						next: p("next"),
						search: p("searchTrash")
					},
					onClose: () => Yt(!1),
					onChanged: () => void N()
				})
			}),
			Xt && I && /* @__PURE__ */ (0, w.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, w.jsx)("div", {
					className: "sf-state",
					children: p("loading")
				}),
				children: /* @__PURE__ */ (0, w.jsx)(Le, {
					initial: _t.tags[I.path] || [],
					suggestions: Array.from(new Set(Object.values(_t.tags).flat())).sort((e, t) => e.localeCompare(t, d)),
					labels: {
						title: p("tags"),
						close: p("close"),
						cancel: p("cancel"),
						save: p("save"),
						input: p("tagInput"),
						hint: p("tagInputHint"),
						maximum: p("tagMaximum")
					},
					onClose: () => Zt(!1),
					onSave: (e) => {
						Zt(!1), n.updateMetadata(v, I.path, "tags", { tags: e }).then(vt).catch(M);
					}
				})
			}),
			j && /* @__PURE__ */ (0, w.jsx)(i, {
				title: j.name,
				closeLabel: p("close"),
				onClose: () => en(null),
				className: "sf-file-preview-modal",
				footer: /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [
					/* @__PURE__ */ (0, w.jsx)("button", {
						type: "button",
						className: "sf-icon-button",
						onClick: () => Zn(j),
						title: p("copyUrl"),
						"aria-label": p("copyUrl"),
						children: /* @__PURE__ */ (0, w.jsx)(o, {})
					}),
					/* @__PURE__ */ (0, w.jsx)("a", {
						className: "sf-preview-download",
						href: j.url || n.downloadUrl(v, j.path),
						children: p("download")
					}),
					/* @__PURE__ */ (0, w.jsx)("button", {
						className: "primary",
						onClick: () => en(null),
						children: p("close")
					})
				] }),
				children: /* @__PURE__ */ (0, w.jsxs)("div", {
					className: "sf-file-preview-body",
					children: [/* @__PURE__ */ (0, w.jsx)("div", {
						className: "sf-file-preview-content",
						children: qn(j) ? /* @__PURE__ */ (0, w.jsx)(s, {
							src: n.thumbnailUrl(v, j, 512, 512),
							alt: j.name
						}) : u.textPreview !== !1 && tn?.path === j.path ? /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [/* @__PURE__ */ (0, w.jsx)("pre", {
							className: "sf-text-preview",
							children: tn.content
						}), tn.truncated && /* @__PURE__ */ (0, w.jsx)("p", {
							className: "sf-warning",
							children: p("previewTruncated")
						})] }) : Ee(j, er)?.plugin === "document-preview" ? /* @__PURE__ */ (0, w.jsx)(g.Suspense, {
							fallback: /* @__PURE__ */ (0, w.jsx)("div", {
								className: "sf-state",
								children: p("previewPreparing")
							}),
							children: /* @__PURE__ */ (0, w.jsx)(Me, {
								api: n,
								resource: v,
								entry: j,
								labels: {
									preparing: p("previewPreparing"),
									failed: p("previewFailed"),
									retry: p("previewRetry")
								}
							})
						}) : De(j, er, v) ? /* @__PURE__ */ (0, w.jsx)("iframe", {
							className: "sf-document-preview",
							src: De(j, er, v) || void 0,
							title: j.name
						}) : /* @__PURE__ */ (0, w.jsxs)("div", {
							className: "sf-file-preview-fallback",
							children: [/* @__PURE__ */ (0, w.jsx)(c, { kind: "file" }), /* @__PURE__ */ (0, w.jsx)("p", { children: p("previewUnavailable") })]
						})
					}), /* @__PURE__ */ (0, w.jsxs)("dl", {
						className: "sf-file-preview-meta",
						children: [
							/* @__PURE__ */ (0, w.jsx)("dt", { children: p("type") }),
							/* @__PURE__ */ (0, w.jsx)("dd", { children: j.mimeType || p("file") }),
							/* @__PURE__ */ (0, w.jsx)("dt", { children: p("size") }),
							/* @__PURE__ */ (0, w.jsx)("dd", { children: l(j.size) }),
							/* @__PURE__ */ (0, w.jsx)("dt", { children: p("modified") }),
							/* @__PURE__ */ (0, w.jsx)("dd", { children: /* @__PURE__ */ (0, w.jsx)("time", {
								dateTime: (/* @__PURE__ */ new Date(j.modifiedAt * 1e3)).toISOString(),
								children: m.format(j.modifiedAt * 1e3)
							}) }),
							/* @__PURE__ */ (0, w.jsx)("dt", { children: p("location") }),
							/* @__PURE__ */ (0, w.jsx)("dd", { children: j.path }),
							u.checksum !== !1 && /* @__PURE__ */ (0, w.jsxs)(w.Fragment, { children: [/* @__PURE__ */ (0, w.jsx)("dt", { children: "SHA-256" }), /* @__PURE__ */ (0, w.jsx)("dd", { children: rn?.path === j.path ? /* @__PURE__ */ (0, w.jsx)("code", {
								className: "sf-checksum",
								children: rn.value
							}) : /* @__PURE__ */ (0, w.jsx)("button", {
								onClick: () => void n.checksum(v, j.path).then((e) => an({
									path: j.path,
									value: e.checksum
								})).catch(M),
								children: p("calculateChecksum")
							}) })] })
						]
					})]
				})
			}),
			on && /* @__PURE__ */ (0, w.jsx)(le, {
				url: on.url,
				loginRequired: on.loginRequired,
				expiresAt: on.expiresAt,
				labels: {
					title: on.expiresAt ? p("temporaryFileUrl") : p("fileUrl"),
					close: p("close"),
					copied: p("urlCopied"),
					failed: p("copyUrlFailed"),
					hint: p("clickUrlToCopy"),
					loginRequired: p("loginRequired"),
					expires: p("linkExpires")
				},
				onClose: () => sn(null)
			}),
			Ht && u.imageProcessing !== !1 && Yn.length > 0 && /* @__PURE__ */ (0, w.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, w.jsx)("div", {
					className: "sf-state",
					children: p("loading")
				}),
				children: /* @__PURE__ */ (0, w.jsx)(Ae, {
					entries: Yn,
					resource: v,
					formats: un.formats.filter((e) => e.edit && [
						"jpeg",
						"png",
						"webp",
						"avif"
					].includes(e.format)).map((e) => e.format),
					labels: {
						title: p("imageProcess"),
						close: p("close"),
						cancel: p("cancel"),
						apply: p("applyImageProcess"),
						processing: p("processingImages"),
						selected: p("processingSelected"),
						operation: p("operation"),
						optimize: p("optimizeImage"),
						textWatermark: p("textWatermark"),
						imageWatermark: p("imageWatermark"),
						outputFormat: p("outputFormat"),
						keepFormat: p("keepFormat"),
						watermarkText: p("watermarkText"),
						color: p("color"),
						watermarkResource: p("watermarkResource"),
						watermarkPath: p("watermarkPath"),
						position: p("position"),
						topLeft: p("topLeft"),
						topRight: p("topRight"),
						center: p("center"),
						bottomLeft: p("bottomLeft"),
						bottomRight: p("bottomRight"),
						opacity: p("opacity"),
						scale: p("watermarkScale"),
						quality: p("quality"),
						saveMode: p("saveMode"),
						saveCopy: p("saveCopy"),
						overwrite: p("overwrite"),
						conversionCopyHint: p("conversionCopyHint"),
						overwriteWarning: p("confirmImageOverwrite")
					},
					onClose: () => Ut(!1),
					onApply: async (e, t) => {
						if (Yn.length === 1) await n.applyImageActions(v, Yn[0].path, e, t), ut(`${p("completed")}: 1`);
						else {
							let r = await n.applyImageBatch(v, Yn.map((e) => e.path), e, t);
							ut(`${p("completed")}: ${r.succeeded} · ${p("failed")}: ${r.failed}`);
						}
						Ut(!1), await N();
					}
				})
			}),
			Bt && I && yt && /* @__PURE__ */ (0, w.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, w.jsx)("div", {
					className: "sf-state",
					children: p("loading")
				}),
				children: /* @__PURE__ */ (0, w.jsx)(ke, {
					entry: I,
					info: yt,
					imageUrl: n.contentUrl(v, I.path),
					maximumFileNameLength: P?.maxFileNameLength ?? 120,
					labels: {
						crop: p("crop"),
						close: p("close"),
						cancel: p("cancel"),
						save: p("save"),
						saving: p("saving"),
						ratio: p("ratio"),
						free: p("freeRatio"),
						original: p("originalRatio"),
						zoom: p("zoom"),
						undo: p("undo"),
						redo: p("redo"),
						reset: p("reset"),
						compare: p("compare"),
						x: "X",
						y: "Y",
						width: p("width"),
						height: p("height"),
						saveMode: p("saveMode"),
						saveCopy: p("saveCopy"),
						overwrite: p("overwrite"),
						fileName: p("fileName"),
						fileNameTooLong: p("fileNameTooLongMaximum"),
						invalidFileName: p("invalidEntryName"),
						formatLocked: p("imageFormatLocked"),
						overwriteWarning: p("confirmImageOverwrite"),
						panHint: p("panHint")
					},
					onClose: () => Vt(!1),
					onSave: async (e, t) => {
						let r = await n.applyImageActions(v, I.path, e, t);
						Vt(!1), ut(`${p("imageCreated")}: ${r.entry.name} · ${r.result.width} × ${r.result.height} px`), await N();
					}
				})
			}),
			Qt && /* @__PURE__ */ (0, w.jsx)(se, {
				x: Qt.x,
				y: Qt.y,
				onClose: () => $t(null),
				onSelect: wr,
				items: [
					{
						id: Qt.entry.directory ? "open" : "preview",
						label: Qt.entry.directory ? p("open") : p("preview")
					},
					...a === "picker" && !Qt.entry.directory ? [{
						id: "select",
						label: p("select"),
						disabled: !Xn(Qt.entry)
					}] : [],
					{
						id: "download",
						label: p("download"),
						disabled: Qt.entry.directory
					},
					...a === "manager" ? [
						{
							id: "rename",
							label: p("rename"),
							disabled: Qt.entry.capabilities?.rename === !1
						},
						{
							id: "copy",
							label: p("copy"),
							disabled: Qt.entry.capabilities?.copy === !1
						},
						{
							id: "move",
							label: p("move"),
							disabled: Qt.entry.capabilities?.move === !1
						},
						{
							id: "delete",
							label: p("remove"),
							disabled: Qt.entry.capabilities?.delete === !1,
							danger: !0
						},
						...$n.filter((e) => e.slot === "context").map((e) => ({
							id: `plugin:${e.plugin}:${e.id}`,
							label: Te(e, d),
							disabled: !Oe(e, Qt.entry)
						}))
					] : []
				]
			}),
			/* @__PURE__ */ (0, w.jsx)("div", {
				className: "sf-sr-only",
				"aria-live": "polite",
				children: F.length > 0 ? `${F.length} ${p("selectedCount")}` : lt
			})
		]
	});
}
var ze = (e) => !!(e && (e.startsWith("text/") || [
	"application/json",
	"application/ld+json",
	"application/xml",
	"application/x-yaml",
	"application/yaml"
].includes(e) || e.endsWith("+json") || e.endsWith("+xml"))), Be = document.getElementById("sofinder-root");
if (!Be) throw Error("SoFinder root element was not found.");
var Ve = JSON.parse(Be.dataset.config || "{}");
(0, _.createRoot)(Be).render(/* @__PURE__ */ (0, w.jsx)(g.StrictMode, { children: /* @__PURE__ */ (0, w.jsx)(Re, { config: Ve }) }));
//#endregion
