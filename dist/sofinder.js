import { n as e, t } from "./jsx-runtime-CmCsaYvT.js";
import { t as n } from "./react-B5TC723I.js";
import { t as r } from "./defineProperty-B_lfzbVN.js";
import { t as i } from "./UiIcon-ClFQjiWf.js";
import { t as a } from "./Modal-Fr6Afibb.js";
import { t as o } from "./nameValidation-DURyMFRU.js";
import { n as s, t as c } from "./EntryVisuals-COz6M0oc.js";
import { t as l } from "./format-GD3_dnvn.js";
//#region node_modules/.pnpm/scheduler@0.27.0/node_modules/scheduler/cjs/scheduler.production.js
var u = /* @__PURE__ */ e(((e) => {
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
				t !== null && se(x, t.startTime - e);
			}
		}
	}
	var ee = !1, te = -1, S = 5, C = -1;
	function ne() {
		return g ? !0 : !(e.unstable_now() - C < S);
	}
	function re() {
		if (g = !1, ee) {
			var t = e.unstable_now();
			C = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(te), te = -1), p = !0;
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
								u !== null && se(x, u.startTime - t), i = !1;
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
		var ae = new MessageChannel(), oe = ae.port2;
		ae.port1.onmessage = re, ie = function() {
			oe.postMessage(null);
		};
	} else ie = function() {
		_(re, 0);
	};
	function se(t, n) {
		te = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : S = 0 < e ? Math.floor(1e3 / e) : 5;
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
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(te), te = -1) : h = !0, se(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, ee || (ee = !0, ie()))), r;
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
})), d = /* @__PURE__ */ e(((e, t) => {
	t.exports = u();
})), f = /* @__PURE__ */ e(((e) => {
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
})), p = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = f();
})), m = /* @__PURE__ */ e(((e) => {
	var t = d(), r = n(), i = p();
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
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), ee = Symbol.for("react.consumer"), te = Symbol.for("react.context"), S = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), ne = Symbol.for("react.suspense_list"), re = Symbol.for("react.memo"), ie = Symbol.for("react.lazy"), ae = Symbol.for("react.activity"), oe = Symbol.for("react.memo_cache_sentinel"), se = Symbol.iterator;
	function ce(e) {
		return typeof e != "object" || !e ? null : (e = se && e[se] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var le = Symbol.for("react.client.reference");
	function ue(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === le ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case C: return "Suspense";
			case ne: return "SuspenseList";
			case ae: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case te: return e.displayName || "Context";
			case ee: return (e._context.displayName || "Context") + ".Consumer";
			case S:
				var t = e.render;
				return e = e.displayName, e || (e = t.displayName || t.name || "", e = e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case re: return t = e.displayName || null, t === null ? ue(e.type) || "Memo" : t;
			case ie:
				t = e._payload, e = e._init;
				try {
					return ue(e(t));
				} catch {}
		}
		return null;
	}
	var de = Array.isArray, w = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, T = i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, fe = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, pe = [], me = -1;
	function he(e) {
		return { current: e };
	}
	function E(e) {
		0 > me || (e.current = pe[me], pe[me] = null, me--);
	}
	function D(e, t) {
		me++, pe[me] = e.current, e.current = t;
	}
	var ge = he(null), _e = he(null), ve = he(null), ye = he(null);
	function be(e, t) {
		switch (D(ve, t), D(_e, e), D(ge, null), t.nodeType) {
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
		E(ge), D(ge, e);
	}
	function xe() {
		E(ge), E(_e), E(ve);
	}
	function Se(e) {
		e.memoizedState !== null && D(ye, e);
		var t = ge.current, n = Hd(t, e.type);
		t !== n && (D(_e, e), D(ge, n));
	}
	function Ce(e) {
		_e.current === e && (E(ge), E(_e)), ye.current === e && (E(ye), Qf._currentValue = fe);
	}
	var O, we;
	function Te(e) {
		if (O === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			O = t && t[1] || "", we = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + O + e + we;
	}
	var Ee = !1;
	function De(e, t) {
		if (!e || Ee) return "";
		Ee = !0;
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
			Ee = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? Te(n) : "";
	}
	function Oe(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return Te(e.type);
			case 16: return Te("Lazy");
			case 13: return e.child !== t && t !== null ? Te("Suspense Fallback") : Te("Suspense");
			case 19: return Te("SuspenseList");
			case 0:
			case 15: return De(e.type, !1);
			case 11: return De(e.type.render, !1);
			case 1: return De(e.type, !0);
			case 31: return Te("Activity");
			default: return "";
		}
	}
	function ke(e) {
		try {
			var t = "", n = null;
			do
				t += Oe(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Ae = Object.prototype.hasOwnProperty, je = t.unstable_scheduleCallback, Me = t.unstable_cancelCallback, Ne = t.unstable_shouldYield, Pe = t.unstable_requestPaint, Fe = t.unstable_now, Ie = t.unstable_getCurrentPriorityLevel, Le = t.unstable_ImmediatePriority, Re = t.unstable_UserBlockingPriority, ze = t.unstable_NormalPriority, Be = t.unstable_LowPriority, Ve = t.unstable_IdlePriority, He = t.log, Ue = t.unstable_setDisableYieldValue, We = null, Ge = null;
	function Ke(e) {
		if (typeof He == "function" && Ue(e), Ge && typeof Ge.setStrictMode == "function") try {
			Ge.setStrictMode(We, e);
		} catch {}
	}
	var qe = Math.clz32 ? Math.clz32 : Xe, Je = Math.log, Ye = Math.LN2;
	function Xe(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Je(e) / Ye | 0) | 0;
	}
	var Ze = 256, Qe = 262144, $e = 4194304;
	function et(e) {
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
	function tt(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = et(n))) : i = et(o) : i = et(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = et(n))) : i = et(o)) : i = et(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function nt(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function rt(e, t) {
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
	function it() {
		var e = $e;
		return $e <<= 1, !($e & 62914560) && ($e = 4194304), e;
	}
	function at(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function ot(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function st(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - qe(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && ct(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function ct(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - qe(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function lt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - qe(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function ut(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : dt(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function dt(e) {
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
	function ft(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function pt() {
		var e = T.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : mp(e.type)) : e;
	}
	function mt(e, t) {
		var n = T.p;
		try {
			return T.p = e, t();
		} finally {
			T.p = n;
		}
	}
	var ht = Math.random().toString(36).slice(2), gt = "__reactFiber$" + ht, _t = "__reactProps$" + ht, vt = "__reactContainer$" + ht, yt = "__reactEvents$" + ht, bt = "__reactListeners$" + ht, xt = "__reactHandles$" + ht, St = "__reactResources$" + ht, Ct = "__reactMarker$" + ht;
	function wt(e) {
		delete e[gt], delete e[_t], delete e[yt], delete e[bt], delete e[xt];
	}
	function Tt(e) {
		var t = e[gt];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[vt] || n[gt]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = df(e); e !== null;) {
					if (n = e[gt]) return n;
					e = df(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function Et(e) {
		if (e = e[gt] || e[vt]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function Dt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(a(33));
	}
	function Ot(e) {
		var t = e[St];
		return t || (t = e[St] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}), t;
	}
	function kt(e) {
		e[Ct] = !0;
	}
	var At = /* @__PURE__ */ new Set(), jt = {};
	function k(e, t) {
		Mt(e, t), Mt(e + "Capture", t);
	}
	function Mt(e, t) {
		for (jt[e] = t, e = 0; e < t.length; e++) At.add(t[e]);
	}
	var Nt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Pt = {}, Ft = {};
	function It(e) {
		return Ae.call(Ft, e) ? !0 : Ae.call(Pt, e) ? !1 : Nt.test(e) ? Ft[e] = !0 : (Pt[e] = !0, !1);
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
	function A(e, t, n) {
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
			var t = Vt(e) ? "checked" : "value";
			e._valueTracker = A(e, t, "" + e[t]);
		}
	}
	function Ut(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Vt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
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
	function j(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Bt(t)) : e.value !== "" + Bt(t) && (e.value = "" + Bt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Jt(e, o, Bt(n)) : Jt(e, o, Bt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Bt(s) : e.removeAttribute("name");
	}
	function qt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Ht(e);
				return;
			}
			n = n == null ? "" : "" + Bt(n), t = t == null ? n : "" + Bt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r = r ?? i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Ht(e);
	}
	function Jt(e, t, n) {
		t === "number" && Wt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Yt(e, t, n, r) {
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
	function Xt(e, t, n) {
		if (t != null && (t = "" + Bt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Bt(n);
	}
	function Zt(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(a(92));
				if (de(r)) {
					if (1 < r.length) throw Error(a(93));
					r = r[0];
				}
				n = r;
			}
			n ?? (n = ""), t = n;
		}
		n = Bt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Ht(e);
	}
	function Qt(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var $t = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function en(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || $t.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
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
		var t = Et(e);
		if (t && (e = t.stateNode)) {
			var n = e[_t] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (j(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Kt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var i = r[_t] || null;
								if (!i) throw Error(a(90));
								j(r, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Ut(r);
					}
					break a;
				case "textarea":
					Xt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Yt(e, !!n.multiple, t, !1);
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
		var r = n[_t] || null;
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
	function En(e) {
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
	var Dn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, On = En(Dn), kn = h({}, Dn, {
		view: 0,
		detail: 0
	}), An = En(kn), jn, Mn, Nn, Pn = h({}, kn, {
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
			return "movementX" in e ? e.movementX : (e !== Nn && (Nn && e.type === "mousemove" ? (jn = e.screenX - Nn.screenX, Mn = e.screenY - Nn.screenY) : Mn = jn = 0, Nn = e), jn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Mn;
		}
	}), Fn = En(Pn), In = En(h({}, Pn, { dataTransfer: 0 })), Ln = En(h({}, kn, { relatedTarget: 0 })), Rn = En(h({}, Dn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), zn = En(h({}, Dn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Bn = En(h({}, Dn, { data: 0 })), Vn = {
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
	}, Hn = {
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
	}, Un = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function M(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Un[e]) ? !!t[e] : !1;
	}
	function Wn() {
		return M;
	}
	var Gn = En(h({}, kn, {
		key: function(e) {
			if (e.key) {
				var t = Vn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = Cn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Hn[e.keyCode] || "Unidentified" : "";
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
	})), Kn = En(h({}, Pn, {
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
	})), qn = En(h({}, kn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Wn
	})), Jn = En(h({}, Dn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Yn = En(h({}, Pn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Xn = En(h({}, Dn, {
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
	function dr(e, t, n, r) {
		un ? dn ? dn.push(r) : dn = [r] : un = r, t = Ed(t, "onChange"), 0 < t.length && (n = new On("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var fr = null, pr = null;
	function mr(e) {
		yd(e, 0);
	}
	function hr(e) {
		if (Ut(Dt(e))) return e;
	}
	function gr(e, t) {
		if (e === "change") return t;
	}
	var _r = !1;
	if (gn) {
		var vr;
		if (gn) {
			var yr = "oninput" in document;
			if (!yr) {
				var br = document.createElement("div");
				br.setAttribute("oninput", "return;"), yr = typeof br.oninput == "function";
			}
			vr = yr;
		} else vr = !1;
		_r = vr && (!document.documentMode || 9 < document.documentMode);
	}
	function xr() {
		fr && (fr.detachEvent("onpropertychange", Sr), pr = fr = null);
	}
	function Sr(e) {
		if (e.propertyName === "value" && hr(pr)) {
			var t = [];
			dr(t, pr, e, ln(e)), mn(mr, t);
		}
	}
	function Cr(e, t, n) {
		e === "focusin" ? (xr(), fr = t, pr = n, fr.attachEvent("onpropertychange", Sr)) : e === "focusout" && xr();
	}
	function wr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return hr(pr);
	}
	function Tr(e, t) {
		if (e === "click") return hr(t);
	}
	function Er(e, t) {
		if (e === "input" || e === "change") return hr(t);
	}
	function Dr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var N = typeof Object.is == "function" ? Object.is : Dr;
	function Or(e, t) {
		if (N(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Ae.call(t, i) || !N(e[i], t[i])) return !1;
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
	function Nr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Pr = gn && "documentMode" in document && 11 >= document.documentMode, P = null, F = null, Fr = null, Ir = !1;
	function Lr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Ir || P == null || P !== Wt(r) || (r = P, "selectionStart" in r && Nr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Fr && Or(Fr, r) || (Fr = r, r = Ed(F, "onSelect"), 0 < r.length && (t = new On("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = P)));
	}
	function Rr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var zr = {
		animationend: Rr("Animation", "AnimationEnd"),
		animationiteration: Rr("Animation", "AnimationIteration"),
		animationstart: Rr("Animation", "AnimationStart"),
		transitionrun: Rr("Transition", "TransitionRun"),
		transitionstart: Rr("Transition", "TransitionStart"),
		transitioncancel: Rr("Transition", "TransitionCancel"),
		transitionend: Rr("Transition", "TransitionEnd")
	}, Br = {}, Vr = {};
	gn && (Vr = document.createElement("div").style, "AnimationEvent" in window || (delete zr.animationend.animation, delete zr.animationiteration.animation, delete zr.animationstart.animation), "TransitionEvent" in window || delete zr.transitionend.transition);
	function Hr(e) {
		if (Br[e]) return Br[e];
		if (!zr[e]) return e;
		var t = zr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Vr) return Br[e] = t[n];
		return e;
	}
	var Ur = Hr("animationend"), Wr = Hr("animationiteration"), Gr = Hr("animationstart"), Kr = Hr("transitionrun"), qr = Hr("transitionstart"), Jr = Hr("transitioncancel"), Yr = Hr("transitionend"), Xr = /* @__PURE__ */ new Map(), Zr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Zr.push("scrollEnd");
	function Qr(e, t) {
		Xr.set(e, t), k(t, [e]);
	}
	var $r = typeof reportError == "function" ? reportError : function(e) {
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
	}, I = [], ei = 0, ti = 0;
	function ni() {
		for (var e = ei, t = ti = ei = 0; t < e;) {
			var n = I[t];
			I[t++] = null;
			var r = I[t];
			I[t++] = null;
			var i = I[t];
			I[t++] = null;
			var a = I[t];
			if (I[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && ii(n, i, a);
		}
	}
	function ri(e, t, n, r) {
		I[ei++] = e, I[ei++] = t, I[ei++] = n, I[ei++] = r, ti |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function L(e, t, n, r) {
		return ri(e, t, n, r), ai(e);
	}
	function R(e, t) {
		return ri(e, null, null, t), ai(e);
	}
	function ii(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - qe(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function ai(e) {
		if (50 < du) throw du = 0, fu = null, Error(a(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var oi = {};
	function si(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function ci(e, t, n, r) {
		return new si(e, t, n, r);
	}
	function li(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function ui(e, t) {
		var n = e.alternate;
		return n === null ? (n = ci(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function di(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function fi(e, t, n, r, i, o) {
		var s = 0;
		if (r = e, typeof e == "function") li(e) && (s = 1);
		else if (typeof e == "string") s = Uf(e, n, ge.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case ae: return e = ci(31, n, t, i), e.elementType = ae, e.lanes = o, e;
			case y: return pi(n.children, i, o, t);
			case b:
				s = 8, i |= 24;
				break;
			case x: return e = ci(12, n, t, i | 2), e.elementType = x, e.lanes = o, e;
			case C: return e = ci(13, n, t, i), e.elementType = C, e.lanes = o, e;
			case ne: return e = ci(19, n, t, i), e.elementType = ne, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case te:
						s = 10;
						break a;
					case ee:
						s = 9;
						break a;
					case S:
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
		return t = ci(s, n, t, i), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function pi(e, t, n, r) {
		return e = ci(7, e, r, t), e.lanes = n, e;
	}
	function mi(e, t, n) {
		return e = ci(6, e, null, t), e.lanes = n, e;
	}
	function hi(e) {
		var t = ci(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function gi(e, t, n) {
		return t = ci(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var _i = /* @__PURE__ */ new WeakMap();
	function vi(e, t) {
		if (typeof e == "object" && e) {
			var n = _i.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: ke(t)
			}, _i.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: ke(t)
		};
	}
	var yi = [], bi = 0, xi = null, Si = 0, Ci = [], wi = 0, Ti = null, Ei = 1, Di = "";
	function Oi(e, t) {
		yi[bi++] = Si, yi[bi++] = xi, xi = e, Si = t;
	}
	function ki(e, t, n) {
		Ci[wi++] = Ei, Ci[wi++] = Di, Ci[wi++] = Ti, Ti = e;
		var r = Ei;
		e = Di;
		var i = 32 - qe(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - qe(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Ei = 1 << 32 - qe(t) + i | n << i | r, Di = a + e;
		} else Ei = 1 << a | n << i | r, Di = e;
	}
	function Ai(e) {
		e.return !== null && (Oi(e, 1), ki(e, 1, 0));
	}
	function ji(e) {
		for (; e === xi;) xi = yi[--bi], yi[bi] = null, Si = yi[--bi], yi[bi] = null;
		for (; e === Ti;) Ti = Ci[--wi], Ci[wi] = null, Di = Ci[--wi], Ci[wi] = null, Ei = Ci[--wi], Ci[wi] = null;
	}
	function Mi(e, t) {
		Ci[wi++] = Ei, Ci[wi++] = Di, Ci[wi++] = Ti, Ei = t.id, Di = t.overflow, Ti = e;
	}
	var Ni = null, z = null, B = !1, Pi = null, Fi = !1, Ii = Error(a(519));
	function Li(e) {
		throw Ui(vi(Error(a(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Ii;
	}
	function Ri(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[gt] = e, t[_t] = r, n) {
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
				Q("invalid", t), qt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), Zt(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Md(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = sn), t = !0) : t = !1, t || Li(e, !0);
	}
	function zi(e) {
		for (Ni = e.return; Ni;) switch (Ni.tag) {
			case 5:
			case 31:
			case 13:
				Fi = !1;
				return;
			case 27:
			case 3:
				Fi = !0;
				return;
			default: Ni = Ni.return;
		}
	}
	function Bi(e) {
		if (e !== Ni) return !1;
		if (!B) return zi(e), B = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || Ud(e.type, e.memoizedProps)), n = !n), n && z && Li(e), zi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(317));
			z = uf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(317));
			z = uf(e);
		} else t === 27 ? (t = z, Zd(e.type) ? (e = lf, lf = null, z = e) : z = t) : z = Ni ? cf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Vi() {
		z = Ni = null, B = !1;
	}
	function Hi() {
		var e = Pi;
		return e !== null && (Zl === null ? Zl = e : Zl.push.apply(Zl, e), Pi = null), e;
	}
	function Ui(e) {
		Pi === null ? Pi = [e] : Pi.push(e);
	}
	var Wi = he(null), Gi = null, Ki = null;
	function qi(e, t, n) {
		D(Wi, t._currentValue), t._currentValue = n;
	}
	function Ji(e) {
		e._currentValue = Wi.current, E(Wi);
	}
	function Yi(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Xi(e, t, n, r) {
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
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Yi(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (i.tag === 18) {
				if (s = i.return, s === null) throw Error(a(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Yi(s, n, e), s = null;
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
	function Zi(e, t, n, r) {
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
					N(i.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (i === ye.current) {
				if (s = i.alternate, s === null) throw Error(a(387));
				s.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e === null ? e = [Qf] : e.push(Qf));
			}
			i = i.return;
		}
		e !== null && Xi(t, e, n, r), t.flags |= 262144;
	}
	function Qi(e) {
		for (e = e.firstContext; e !== null;) {
			if (!N(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function $i(e) {
		Gi = e, Ki = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function ea(e) {
		return na(Gi, e);
	}
	function ta(e, t) {
		return Gi === null && $i(e), na(e, t);
	}
	function na(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Ki === null) {
			if (e === null) throw Error(a(308));
			Ki = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Ki = Ki.next = t;
		return n;
	}
	var ra = typeof AbortController < "u" ? AbortController : function() {
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
	}, ia = t.unstable_scheduleCallback, aa = t.unstable_NormalPriority, V = {
		$$typeof: te,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function oa() {
		return {
			controller: new ra(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function sa(e) {
		e.refCount--, e.refCount === 0 && ia(aa, function() {
			e.controller.abort();
		});
	}
	var ca = null, la = 0, ua = 0, da = null;
	function fa(e, t) {
		if (ca === null) {
			var n = ca = [];
			la = 0, ua = dd(), da = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return la++, t.then(pa, pa), t;
	}
	function pa() {
		if (--la === 0 && ca !== null) {
			da !== null && (da.status = "fulfilled");
			var e = ca;
			ca = null, ua = 0, da = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function ma(e, t) {
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
	var ha = w.S;
	w.S = function(e, t) {
		eu = Fe(), typeof t == "object" && t && typeof t.then == "function" && fa(e, t), ha !== null && ha(e, t);
	};
	var ga = he(null);
	function H() {
		var e = ga.current;
		return e === null ? q.pooledCache : e;
	}
	function _a(e, t) {
		t === null ? D(ga, ga.current) : D(ga, t.pool);
	}
	function va() {
		var e = H();
		return e === null ? null : {
			parent: V._currentValue,
			pool: e
		};
	}
	var ya = Error(a(460)), ba = Error(a(474)), xa = Error(a(542)), Sa = { then: function() {} };
	function Ca(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function wa(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(sn, sn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Oa(e), e;
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
					case "rejected": throw e = t.reason, Oa(e), e;
				}
				throw Ea = t, ya;
		}
	}
	function Ta(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Ea = e, ya) : e;
		}
	}
	var Ea = null;
	function Da() {
		if (Ea === null) throw Error(a(459));
		var e = Ea;
		return Ea = null, e;
	}
	function Oa(e) {
		if (e === ya || e === xa) throw Error(a(483));
	}
	var ka = null, Aa = 0;
	function ja(e) {
		var t = Aa;
		return Aa += 1, ka === null && (ka = []), wa(ka, e, t);
	}
	function Ma(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Na(e, t) {
		throw t.$$typeof === g ? Error(a(525)) : (e = Object.prototype.toString.call(t), Error(a(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function Pa(e) {
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
			return e = ui(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = mi(n, e.mode, r), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var a = n.type;
			return a === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === a || typeof a == "object" && a && a.$$typeof === ie && Ta(a) === t.type) ? (t = i(t, n.props), Ma(t, n), t.return = e, t) : (t = fi(n.type, n.key, n.props, null, e.mode, r), Ma(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = gi(n, e.mode, r), t.return = e, t) : (t = i(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, a) {
			return t === null || t.tag !== 7 ? (t = pi(n, e.mode, r, a), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = mi("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = fi(t.type, t.key, t.props, null, e.mode, n), Ma(n, t), n.return = e, n;
					case v: return t = gi(t, e.mode, n), t.return = e, t;
					case ie: return t = Ta(t), f(e, t, n);
				}
				if (de(t) || ce(t)) return t = pi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, ja(t), n);
				if (t.$$typeof === te) return f(e, ta(e, t), n);
				Na(e, t);
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
					case ie: return n = Ta(n), p(e, t, n, r);
				}
				if (de(n) || ce(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, ja(n), r);
				if (n.$$typeof === te) return p(e, t, ta(e, n), r);
				Na(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case ie: return r = Ta(r), m(e, t, n, r, i);
				}
				if (de(r) || ce(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, ja(r), i);
				if (r.$$typeof === te) return m(e, t, n, ta(t, r), i);
				Na(t, r);
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
			if (h === s.length) return n(i, d), B && Oi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return B && Oi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), B && Oi(i, h), l;
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
			if (v.done) return n(i, h), B && Oi(i, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(i, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return B && Oi(i, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, i, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(i, e);
			}), B && Oi(i, g), u;
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
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === ie && Ta(l) === r.type) {
										n(e, r.sibling), c = i(r, o.props), Ma(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === y ? (c = pi(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = fi(o.type, o.key, o.props, null, e.mode, c), Ma(c, o), c.return = e, e = c);
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
							c = gi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case ie: return o = Ta(o), b(e, r, o, c);
				}
				if (de(o)) return h(e, r, o, c);
				if (ce(o)) {
					if (l = ce(o), typeof l != "function") throw Error(a(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, ja(o), c);
				if (o.$$typeof === te) return b(e, r, ta(e, o), c);
				Na(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = i(r, o), c.return = e, e = c) : (n(e, r), c = mi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Aa = 0;
				var i = b(e, t, n, r);
				return ka = null, i;
			} catch (t) {
				if (t === ya || t === xa) throw t;
				var a = ci(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var Fa = Pa(!0), Ia = Pa(!1), La = !1;
	function Ra(e) {
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
	function za(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Ba(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Va(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, K & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = ai(e), ii(e, null, n), t;
		}
		return ri(e, r, t, n), ai(e);
	}
	function Ha(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, lt(e, n);
		}
	}
	function Ua(e, t) {
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
	var Wa = !1;
	function Ga() {
		if (Wa) {
			var e = da;
			if (e !== null) throw e;
		}
	}
	function Ka(e, t, n, r) {
		Wa = !1;
		var i = e.updateQueue;
		La = !1;
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
					f !== 0 && f === ua && (Wa = !0), u !== null && (u = u.next = {
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
							case 2: La = !0;
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
	function qa(e, t) {
		if (typeof e != "function") throw Error(a(191, e));
		e.call(t);
	}
	function Ja(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) qa(n[e], t);
	}
	var Ya = he(null), Xa = he(0);
	function Za(e, t) {
		e = Ul, D(Xa, e), D(Ya, t), Ul = e | t.baseLanes;
	}
	function Qa() {
		D(Xa, Ul), D(Ya, Ya.current);
	}
	function $a() {
		Ul = Xa.current, E(Ya), E(Xa);
	}
	var eo = he(null), to = null;
	function no(e) {
		var t = e.alternate;
		D(so, so.current & 1), D(eo, e), to === null && (t === null || Ya.current !== null || t.memoizedState !== null) && (to = e);
	}
	function ro(e) {
		D(so, so.current), D(eo, e), to === null && (to = e);
	}
	function io(e) {
		e.tag === 22 ? (D(so, so.current), D(eo, e), to === null && (to = e)) : ao(e);
	}
	function ao() {
		D(so, so.current), D(eo, eo.current);
	}
	function oo(e) {
		E(eo), to === e && (to = null), E(so);
	}
	var so = he(0);
	function co(e) {
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
	var lo = 0, U = null, W = null, uo = null, fo = !1, po = !1, mo = !1, ho = 0, go = 0, _o = null, vo = 0;
	function yo() {
		throw Error(a(321));
	}
	function bo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!N(e[n], t[n])) return !1;
		return !0;
	}
	function xo(e, t, n, r, i, a) {
		return lo = a, U = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, w.H = e === null || e.memoizedState === null ? Rs : zs, mo = !1, a = n(r, i), mo = !1, po && (a = Co(t, n, r, i)), So(e), a;
	}
	function So(e) {
		w.H = Ls;
		var t = W !== null && W.next !== null;
		if (lo = 0, uo = W = U = null, fo = !1, go = 0, _o = null, t) throw Error(a(300));
		e === null || nc || (e = e.dependencies, e !== null && Qi(e) && (nc = !0));
	}
	function Co(e, t, n, r) {
		U = e;
		var i = 0;
		do {
			if (po && (_o = null), go = 0, po = !1, 25 <= i) throw Error(a(301));
			if (i += 1, uo = W = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			w.H = Bs, o = t(n, r);
		} while (po);
		return o;
	}
	function wo() {
		var e = w.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? jo(t) : t, e = e.useState()[0], (W === null ? null : W.memoizedState) !== e && (U.flags |= 1024), t;
	}
	function To() {
		var e = ho !== 0;
		return ho = 0, e;
	}
	function Eo(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function Do(e) {
		if (fo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			fo = !1;
		}
		lo = 0, uo = W = U = null, po = !1, go = ho = 0, _o = null;
	}
	function Oo() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return uo === null ? U.memoizedState = uo = e : uo = uo.next = e, uo;
	}
	function ko() {
		if (W === null) {
			var e = U.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = W.next;
		var t = uo === null ? U.memoizedState : uo.next;
		if (t !== null) uo = t, W = e;
		else {
			if (e === null) throw U.alternate === null ? Error(a(467)) : Error(a(310));
			W = e, e = {
				memoizedState: W.memoizedState,
				baseState: W.baseState,
				baseQueue: W.baseQueue,
				queue: W.queue,
				next: null
			}, uo === null ? U.memoizedState = uo = e : uo = uo.next = e;
		}
		return uo;
	}
	function Ao() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function jo(e) {
		var t = go;
		return go += 1, _o === null && (_o = []), e = wa(_o, e, t), t = U, (uo === null ? t.memoizedState : uo.next) === null && (t = t.alternate, w.H = t === null || t.memoizedState === null ? Rs : zs), e;
	}
	function Mo(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return jo(e);
			if (e.$$typeof === te) return ea(e);
		}
		throw Error(a(438, String(e)));
	}
	function No(e) {
		var t = null, n = U.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = U.alternate;
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
		}), n === null && (n = Ao(), U.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = oe;
		return t.index++, n;
	}
	function Po(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Fo(e) {
		return Io(ko(), W, e);
	}
	function Io(e, t, n) {
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
				if (f === u.lane ? (lo & f) === f : (Y & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === ua && (d = !0);
					else if ((lo & p) === p) {
						u = u.next, p === ua && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, U.lanes |= p, Gl |= p;
					f = u.action, mo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, U.lanes |= f, Gl |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !N(o, e.memoizedState) && (nc = !0, d && (n = da, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return i === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Lo(e) {
		var t = ko(), n = t.queue;
		if (n === null) throw Error(a(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, i = n.pending, o = t.memoizedState;
		if (i !== null) {
			n.pending = null;
			var s = i = i.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== i);
			N(o, t.memoizedState) || (nc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Ro(e, t, n) {
		var r = U, i = ko(), o = B;
		if (o) {
			if (n === void 0) throw Error(a(407));
			n = n();
		} else n = t();
		var s = !N((W || i).memoizedState, n);
		if (s && (i.memoizedState = n, nc = !0), i = i.queue, ls(Vo.bind(null, r, i, e), [e]), i.getSnapshot !== t || s || uo !== null && uo.memoizedState.tag & 1) {
			if (r.flags |= 2048, is(9, { destroy: void 0 }, Bo.bind(null, r, i, n, t), null), q === null) throw Error(a(349));
			o || lo & 127 || zo(r, t, n);
		}
		return n;
	}
	function zo(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = U.updateQueue, t === null ? (t = Ao(), U.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Bo(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Ho(t) && Uo(e);
	}
	function Vo(e, t, n) {
		return n(function() {
			Ho(t) && Uo(e);
		});
	}
	function Ho(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !N(e, n);
		} catch {
			return !0;
		}
	}
	function Uo(e) {
		var t = R(e, 2);
		t !== null && hu(t, e, 2);
	}
	function Wo(e) {
		var t = Oo();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), mo) {
				Ke(!0);
				try {
					n();
				} finally {
					Ke(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Po,
			lastRenderedState: e
		}, t;
	}
	function Go(e, t, n, r) {
		return e.baseState = n, Io(e, W, typeof r == "function" ? r : Po);
	}
	function Ko(e, t, n, r, i) {
		if (Ps(e)) throw Error(a(485));
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
			w.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, qo(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function qo(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = w.T, o = {};
			w.T = o;
			try {
				var s = n(i, r), c = w.S;
				c !== null && c(o, s), Jo(e, t, s);
			} catch (n) {
				Xo(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), w.T = a;
			}
		} else try {
			a = n(i, r), Jo(e, t, a);
		} catch (n) {
			Xo(e, t, n);
		}
	}
	function Jo(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Yo(e, t, n);
		}, function(n) {
			return Xo(e, t, n);
		}) : Yo(e, t, n);
	}
	function Yo(e, t, n) {
		t.status = "fulfilled", t.value = n, Zo(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, qo(e, n)));
	}
	function Xo(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Zo(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Zo(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Qo(e, t) {
		return t;
	}
	function $o(e, t) {
		if (B) {
			var n = q.formState;
			if (n !== null) {
				a: {
					var r = U;
					if (B) {
						if (z) {
							b: {
								for (var i = z, a = Fi; i.nodeType !== 8;) {
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
								z = cf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Li(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = Oo(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Qo,
			lastRenderedState: t
		}, n.queue = r, n = js.bind(null, U, r), r.dispatch = n, r = Wo(!1), a = Ns.bind(null, U, !1, r.queue), r = Oo(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Ko.bind(null, U, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function es(e) {
		return ts(ko(), W, e);
	}
	function ts(e, t, n) {
		if (t = Io(e, t, Qo)[0], e = Fo(Po)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = jo(t);
		} catch (e) {
			throw e === ya ? xa : e;
		}
		else r = t;
		t = ko();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (U.flags |= 2048, is(9, { destroy: void 0 }, ns.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function ns(e, t) {
		e.action = t;
	}
	function rs(e) {
		var t = ko(), n = W;
		if (n !== null) return ts(t, n, e);
		ko(), t = t.memoizedState, n = ko();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function is(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = U.updateQueue, t === null && (t = Ao(), U.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function as() {
		return ko().memoizedState;
	}
	function os(e, t, n, r) {
		var i = Oo();
		U.flags |= e, i.memoizedState = is(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function ss(e, t, n, r) {
		var i = ko();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		W !== null && r !== null && bo(r, W.memoizedState.deps) ? i.memoizedState = is(t, a, n, r) : (U.flags |= e, i.memoizedState = is(1 | t, a, n, r));
	}
	function cs(e, t) {
		os(8390656, 8, e, t);
	}
	function ls(e, t) {
		ss(2048, 8, e, t);
	}
	function us(e) {
		U.flags |= 4;
		var t = U.updateQueue;
		if (t === null) t = Ao(), U.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function ds(e) {
		var t = ko().memoizedState;
		return us({
			ref: t,
			nextImpl: e
		}), function() {
			if (K & 2) throw Error(a(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function fs(e, t) {
		return ss(4, 2, e, t);
	}
	function ps(e, t) {
		return ss(4, 4, e, t);
	}
	function ms(e, t) {
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
	function hs(e, t, n) {
		n = n == null ? null : n.concat([e]), ss(4, 4, ms.bind(null, t, e), n);
	}
	function gs() {}
	function _s(e, t) {
		var n = ko();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && bo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function vs(e, t) {
		var n = ko();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && bo(t, r[1])) return r[0];
		if (r = e(), mo) {
			Ke(!0);
			try {
				e();
			} finally {
				Ke(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function ys(e, t, n) {
		return n === void 0 || lo & 1073741824 && !(Y & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = mu(), U.lanes |= e, Gl |= e, n);
	}
	function bs(e, t, n, r) {
		return N(n, t) ? n : Ya.current === null ? !(lo & 42) || lo & 1073741824 && !(Y & 261930) ? (nc = !0, e.memoizedState = n) : (e = mu(), U.lanes |= e, Gl |= e, t) : (e = ys(e, n, r), N(e, t) || (nc = !0), e);
	}
	function xs(e, t, n, r, i) {
		var a = T.p;
		T.p = a !== 0 && 8 > a ? a : 8;
		var o = w.T, s = {};
		w.T = s, Ns(e, !1, t, n);
		try {
			var c = i(), l = w.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Ms(e, t, ma(c, r), pu(e)) : Ms(e, t, r, pu(e));
		} catch (n) {
			Ms(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, pu());
		} finally {
			T.p = a, o !== null && s.types !== null && (o.types = s.types), w.T = o;
		}
	}
	function Ss() {}
	function Cs(e, t, n, r) {
		if (e.tag !== 5) throw Error(a(476));
		var i = ws(e).queue;
		xs(e, i, t, fe, n === null ? Ss : function() {
			return Ts(e), n(r);
		});
	}
	function ws(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: fe,
			baseState: fe,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Po,
				lastRenderedState: fe
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
				lastRenderedReducer: Po,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Ts(e) {
		var t = ws(e);
		t.next === null && (t = e.alternate.memoizedState), Ms(e, t.next.queue, {}, pu());
	}
	function Es() {
		return ea(Qf);
	}
	function Ds() {
		return ko().memoizedState;
	}
	function Os() {
		return ko().memoizedState;
	}
	function ks(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = pu();
					e = Ba(n);
					var r = Va(t, e, n);
					r !== null && (hu(r, t, n), Ha(r, t, n)), t = { cache: oa() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function As(e, t, n) {
		var r = pu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Ps(e) ? Fs(t, n) : (n = L(e, t, n, r), n !== null && (hu(n, e, r), Is(n, t, r)));
	}
	function js(e, t, n) {
		Ms(e, t, n, pu());
	}
	function Ms(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Ps(e)) Fs(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, N(s, o)) return ri(e, t, i, 0), q === null && ni(), !1;
			} catch {}
			if (n = L(e, t, i, r), n !== null) return hu(n, e, r), Is(n, t, r), !0;
		}
		return !1;
	}
	function Ns(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: dd(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Ps(e)) {
			if (t) throw Error(a(479));
		} else t = L(e, n, r, 2), t !== null && hu(t, e, 2);
	}
	function Ps(e) {
		var t = e.alternate;
		return e === U || t !== null && t === U;
	}
	function Fs(e, t) {
		po = fo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Is(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, lt(e, n);
		}
	}
	var Ls = {
		readContext: ea,
		use: Mo,
		useCallback: yo,
		useContext: yo,
		useEffect: yo,
		useImperativeHandle: yo,
		useLayoutEffect: yo,
		useInsertionEffect: yo,
		useMemo: yo,
		useReducer: yo,
		useRef: yo,
		useState: yo,
		useDebugValue: yo,
		useDeferredValue: yo,
		useTransition: yo,
		useSyncExternalStore: yo,
		useId: yo,
		useHostTransitionStatus: yo,
		useFormState: yo,
		useActionState: yo,
		useOptimistic: yo,
		useMemoCache: yo,
		useCacheRefresh: yo
	};
	Ls.useEffectEvent = yo;
	var Rs = {
		readContext: ea,
		use: Mo,
		useCallback: function(e, t) {
			return Oo().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: ea,
		useEffect: cs,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), os(4194308, 4, ms.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return os(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			os(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = Oo();
			t = t === void 0 ? null : t;
			var r = e();
			if (mo) {
				Ke(!0);
				try {
					e();
				} finally {
					Ke(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = Oo();
			if (n !== void 0) {
				var i = n(t);
				if (mo) {
					Ke(!0);
					try {
						n(t);
					} finally {
						Ke(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = As.bind(null, U, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = Oo();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Wo(e);
			var t = e.queue, n = js.bind(null, U, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: gs,
		useDeferredValue: function(e, t) {
			return ys(Oo(), e, t);
		},
		useTransition: function() {
			var e = Wo(!1);
			return e = xs.bind(null, U, e.queue, !0, !1), Oo().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = U, i = Oo();
			if (B) {
				if (n === void 0) throw Error(a(407));
				n = n();
			} else {
				if (n = t(), q === null) throw Error(a(349));
				Y & 127 || zo(r, t, n);
			}
			i.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return i.queue = o, cs(Vo.bind(null, r, o, e), [e]), r.flags |= 2048, is(9, { destroy: void 0 }, Bo.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = Oo(), t = q.identifierPrefix;
			if (B) {
				var n = Di, r = Ei;
				n = (r & ~(1 << 32 - qe(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = ho++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = vo++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Es,
		useFormState: $o,
		useActionState: $o,
		useOptimistic: function(e) {
			var t = Oo();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Ns.bind(null, U, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: No,
		useCacheRefresh: function() {
			return Oo().memoizedState = ks.bind(null, U);
		},
		useEffectEvent: function(e) {
			var t = Oo(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (K & 2) throw Error(a(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, zs = {
		readContext: ea,
		use: Mo,
		useCallback: _s,
		useContext: ea,
		useEffect: ls,
		useImperativeHandle: hs,
		useInsertionEffect: fs,
		useLayoutEffect: ps,
		useMemo: vs,
		useReducer: Fo,
		useRef: as,
		useState: function() {
			return Fo(Po);
		},
		useDebugValue: gs,
		useDeferredValue: function(e, t) {
			return bs(ko(), W.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Fo(Po)[0], t = ko().memoizedState;
			return [typeof e == "boolean" ? e : jo(e), t];
		},
		useSyncExternalStore: Ro,
		useId: Ds,
		useHostTransitionStatus: Es,
		useFormState: es,
		useActionState: es,
		useOptimistic: function(e, t) {
			return Go(ko(), W, e, t);
		},
		useMemoCache: No,
		useCacheRefresh: Os
	};
	zs.useEffectEvent = ds;
	var Bs = {
		readContext: ea,
		use: Mo,
		useCallback: _s,
		useContext: ea,
		useEffect: ls,
		useImperativeHandle: hs,
		useInsertionEffect: fs,
		useLayoutEffect: ps,
		useMemo: vs,
		useReducer: Lo,
		useRef: as,
		useState: function() {
			return Lo(Po);
		},
		useDebugValue: gs,
		useDeferredValue: function(e, t) {
			var n = ko();
			return W === null ? ys(n, e, t) : bs(n, W.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Lo(Po)[0], t = ko().memoizedState;
			return [typeof e == "boolean" ? e : jo(e), t];
		},
		useSyncExternalStore: Ro,
		useId: Ds,
		useHostTransitionStatus: Es,
		useFormState: rs,
		useActionState: rs,
		useOptimistic: function(e, t) {
			var n = ko();
			return W === null ? (n.baseState = e, [e, n.queue.dispatch]) : Go(n, W, e, t);
		},
		useMemoCache: No,
		useCacheRefresh: Os
	};
	Bs.useEffectEvent = ds;
	function Vs(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Hs = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = pu(), i = Ba(r);
			i.payload = t, n != null && (i.callback = n), t = Va(e, i, r), t !== null && (hu(t, e, r), Ha(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = pu(), i = Ba(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Va(e, i, r), t !== null && (hu(t, e, r), Ha(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = pu(), r = Ba(n);
			r.tag = 2, t != null && (r.callback = t), t = Va(e, r, n), t !== null && (hu(t, e, n), Ha(t, e, n));
		}
	};
	function Us(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Or(n, r) || !Or(i, a) : !0;
	}
	function Ws(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Hs.enqueueReplaceState(t, t.state, null);
	}
	function Gs(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = h({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Ks(e) {
		$r(e);
	}
	function qs(e) {
		console.error(e);
	}
	function Js(e) {
		$r(e);
	}
	function Ys(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Xs(e, t, n) {
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
	function Zs(e, t, n) {
		return n = Ba(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Ys(e, t);
		}, n;
	}
	function Qs(e) {
		return e = Ba(e), e.tag = 3, e;
	}
	function $s(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Xs(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Xs(t, n, r), typeof i != "function" && (ru === null ? ru = /* @__PURE__ */ new Set([this]) : ru.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function ec(e, t, n, r, i) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Zi(t, n, i, !0), n = eo.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return to === null ? Du() : n.alternate === null && Wl === 0 && (Wl = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, r === Sa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), Gu(e, r, i)), !1;
					case 22: return n.flags |= 65536, r === Sa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), Gu(e, r, i)), !1;
				}
				throw Error(a(435, n.tag));
			}
			return Gu(e, r, i), Du(), !1;
		}
		if (B) return t = eo.current, t === null ? (r !== Ii && (t = Error(a(423), { cause: r }), Ui(vi(t, n))), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, r = vi(r, n), i = Zs(e.stateNode, r, i), Ua(e, i), Wl !== 4 && (Wl = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = i, r !== Ii && (e = Error(a(422), { cause: r }), Ui(vi(e, n)))), !1;
		var o = Error(a(520), { cause: r });
		if (o = vi(o, n), Xl === null ? Xl = [o] : Xl.push(o), Wl !== 4 && (Wl = 2), t === null) return !0;
		r = vi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = i & -i, n.lanes |= e, e = Zs(n.stateNode, r, e), Ua(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (ru === null || !ru.has(o)))) return n.flags |= 65536, i &= -i, n.lanes |= i, i = Qs(i), $s(i, e, n, r), Ua(n, i), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var tc = Error(a(461)), nc = !1;
	function rc(e, t, n, r) {
		t.child = e === null ? Ia(t, null, n, r) : Fa(t, e.child, n, r);
	}
	function ic(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return $i(t), r = xo(e, t, n, o, a, i), s = To(), e !== null && !nc ? (Eo(e, t, i), Oc(e, t, i)) : (B && s && Ai(t), t.flags |= 1, rc(e, t, r, i), t.child);
	}
	function ac(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !li(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, oc(e, t, a, r, i)) : (e = fi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !kc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Or : n, n(o, r) && e.ref === t.ref) return Oc(e, t, i);
		}
		return t.flags |= 1, e = ui(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function oc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Or(a, r) && e.ref === t.ref) {
				if (nc = !1, t.pendingProps = r = a, kc(e, i)) e.flags & 131072 && (nc = !0);
				else return t.lanes = e.lanes, Oc(e, t, i);
			}
		}
		return mc(e, t, n, r, i);
	}
	function sc(e, t, n, r) {
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
				return lc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && _a(t, a === null ? null : a.cachePool), a === null ? Qa() : Za(t, a), io(t);
			else return r = t.lanes = 536870912, lc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && _a(t, null), Qa(), ao(t)) : (_a(t, a.cachePool), Za(t, a), ao(t), t.memoizedState = null);
		return rc(e, t, i, n), t.child;
	}
	function cc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function lc(e, t, n, r, i) {
		var a = H();
		return a = a === null ? null : {
			parent: V._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && _a(t, null), Qa(), io(t), e !== null && Zi(e, t, r, !0), t.childLanes = i, null;
	}
	function uc(e, t) {
		return t = Cc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function dc(e, t, n) {
		return Fa(t, e.child, null, n), e = uc(t, t.pendingProps), e.flags |= 2, oo(t), t.memoizedState = null, e;
	}
	function fc(e, t, n) {
		var r = t.pendingProps, i = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (B) {
				if (r.mode === "hidden") return e = uc(t, r), t.lanes = 536870912, cc(null, e);
				if (ro(t), (e = z) ? (e = rf(e, Fi), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ti === null ? null : {
						id: Ei,
						overflow: Di
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = hi(e), n.return = t, t.child = n, Ni = t, z = null)) : e = null, e === null) throw Li(t);
				return t.lanes = 536870912, null;
			}
			return uc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (ro(t), i) {
				if (t.flags & 256) t.flags &= -257, t = dc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(a(558));
			} else if (nc || Zi(e, t, n, !1), i = (n & e.childLanes) !== 0, nc || i) {
				if (r = q, r !== null && (s = ut(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, R(e, s), hu(r, e, s), tc;
				Du(), t = dc(e, t, n);
			} else e = o.treeContext, z = cf(s.nextSibling), Ni = t, B = !0, Pi = null, Fi = !1, e !== null && Mi(t, e), t = uc(t, r), t.flags |= 4096;
			return t;
		}
		return e = ui(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function pc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(a(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function mc(e, t, n, r, i) {
		return $i(t), n = xo(e, t, n, r, void 0, i), r = To(), e !== null && !nc ? (Eo(e, t, i), Oc(e, t, i)) : (B && r && Ai(t), t.flags |= 1, rc(e, t, n, i), t.child);
	}
	function hc(e, t, n, r, i, a) {
		return $i(t), t.updateQueue = null, n = Co(t, r, n, i), So(e), r = To(), e !== null && !nc ? (Eo(e, t, a), Oc(e, t, a)) : (B && r && Ai(t), t.flags |= 1, rc(e, t, n, a), t.child);
	}
	function gc(e, t, n, r, i) {
		if ($i(t), t.stateNode === null) {
			var a = oi, o = n.contextType;
			typeof o == "object" && o && (a = ea(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Hs, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Ra(t), o = n.contextType, a.context = typeof o == "object" && o ? ea(o) : oi, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Vs(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Hs.enqueueReplaceState(a, a.state, null), Ka(t, r, a, i), Ga(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Gs(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = oi, typeof u == "object" && u && (o = ea(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Ws(t, a, r, o), La = !1;
			var f = t.memoizedState;
			a.state = f, Ka(t, r, a, i), Ga(), l = t.memoizedState, s || f !== l || La ? (typeof d == "function" && (Vs(t, n, d, r), l = t.memoizedState), (c = La || Us(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, za(e, t), o = t.memoizedProps, u = Gs(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = oi, typeof l == "object" && l && (c = ea(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Ws(t, a, r, c), La = !1, f = t.memoizedState, a.state = f, Ka(t, r, a, i), Ga();
			var p = t.memoizedState;
			o !== d || f !== p || La || e !== null && e.dependencies !== null && Qi(e.dependencies) ? (typeof s == "function" && (Vs(t, n, s, r), p = t.memoizedState), (u = La || Us(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Qi(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, pc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Fa(t, e.child, null, i), t.child = Fa(t, null, n, i)) : rc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Oc(e, t, i), e;
	}
	function _c(e, t, n, r) {
		return Vi(), t.flags |= 256, rc(e, t, n, r), t.child;
	}
	var vc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function yc(e) {
		return {
			baseLanes: e,
			cachePool: va()
		};
	}
	function bc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= Jl), e;
	}
	function xc(e, t, n) {
		var r = t.pendingProps, i = !1, o = !!(t.flags & 128), s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : !!(so.current & 2)), s && (i = !0, t.flags &= -129), s = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (B) {
				if (i ? no(t) : ao(t), (e = z) ? (e = rf(e, Fi), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Ti === null ? null : {
						id: Ei,
						overflow: Di
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = hi(e), n.return = t, t.child = n, Ni = t, z = null)) : e = null, e === null) throw Li(t);
				return of(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, i ? (ao(t), i = t.mode, c = Cc({
				mode: "hidden",
				children: c
			}, i), r = pi(r, i, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = yc(n), r.childLanes = bc(e, s, n), t.memoizedState = vc, cc(null, r)) : (no(t), Sc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (no(t), t.flags &= -257, t = wc(e, t, n)) : t.memoizedState === null ? (ao(t), c = r.fallback, i = t.mode, r = Cc({
				mode: "visible",
				children: r.children
			}, i), c = pi(c, i, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, Fa(t, e.child, null, n), r = t.child, r.memoizedState = yc(n), r.childLanes = bc(e, s, n), t.memoizedState = vc, t = cc(null, r)) : (ao(t), t.child = e.child, t.flags |= 128, t = null);
			else if (no(t), of(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(a(419)), r.stack = "", r.digest = s, Ui({
					value: r,
					source: null,
					stack: null
				}), t = wc(e, t, n);
			} else if (nc || Zi(e, t, n, !1), s = (n & e.childLanes) !== 0, nc || s) {
				if (s = q, s !== null && (r = ut(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, R(e, r), hu(s, e, r), tc;
				af(c) || Du(), t = wc(e, t, n);
			} else af(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, z = cf(c.nextSibling), Ni = t, B = !0, Pi = null, Fi = !1, e !== null && Mi(t, e), t = Sc(t, r.children), t.flags |= 4096);
			return t;
		}
		return i ? (ao(t), c = r.fallback, i = t.mode, l = e.child, u = l.sibling, r = ui(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = pi(c, i, n, null), c.flags |= 2) : c = ui(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, cc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = yc(n) : (i = c.cachePool, i === null ? i = va() : (l = V._currentValue, i = i.parent === l ? i : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: i
		}), r.memoizedState = c, r.childLanes = bc(e, s, n), t.memoizedState = vc, cc(e.child, r)) : (no(t), n = e.child, e = n.sibling, n = ui(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function Sc(e, t) {
		return t = Cc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Cc(e, t) {
		return e = ci(22, e, null, t), e.lanes = 0, e;
	}
	function wc(e, t, n) {
		return Fa(t, e.child, null, n), e = Sc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Tc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Yi(e.return, t, n);
	}
	function Ec(e, t, n, r, i, a) {
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
	function Dc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = so.current, s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, D(so, o), rc(e, t, r, n), r = B ? Si : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Tc(e, n, t);
			else if (e.tag === 19) Tc(e, n, t);
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
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && co(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Ec(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && co(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Ec(t, !0, n, null, a, r);
				break;
			case "together":
				Ec(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function Oc(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), Gl |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Zi(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(a(153));
		if (t.child !== null) {
			for (e = t.child, n = ui(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = ui(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function kc(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && Qi(e)));
	}
	function Ac(e, t, n) {
		switch (t.tag) {
			case 3:
				be(t, t.stateNode.containerInfo), qi(t, V, e.memoizedState.cache), Vi();
				break;
			case 27:
			case 5:
				Se(t);
				break;
			case 4:
				be(t, t.stateNode.containerInfo);
				break;
			case 10:
				qi(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, ro(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (no(t), e = Oc(e, t, n), e === null ? null : e.sibling) : xc(e, t, n) : (no(t), t.flags |= 128, null);
				no(t);
				break;
			case 19:
				var i = !!(e.flags & 128);
				if (r = (n & t.childLanes) !== 0, r || (Zi(e, t, n, !1), r = (n & t.childLanes) !== 0), i) {
					if (r) return Dc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), D(so, so.current), r) break;
				return null;
			case 22: return t.lanes = 0, sc(e, t, n, t.pendingProps);
			case 24: qi(t, V, e.memoizedState.cache);
		}
		return Oc(e, t, n);
	}
	function jc(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) nc = !0;
			else {
				if (!kc(e, n) && !(t.flags & 128)) return nc = !1, Ac(e, t, n);
				nc = !!(e.flags & 131072);
			}
		} else nc = !1, B && t.flags & 1048576 && ki(t, Si, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Ta(t.elementType), t.type = e, typeof e == "function") li(e) ? (r = Gs(e, r), t.tag = 1, t = gc(null, t, e, r, n)) : (t.tag = 0, t = mc(null, t, e, r, n));
					else {
						if (e != null) {
							var i = e.$$typeof;
							if (i === S) {
								t.tag = 11, t = ic(null, t, e, r, n);
								break a;
							}
							if (i === re) {
								t.tag = 14, t = ac(null, t, e, r, n);
								break a;
							}
						}
						throw t = ue(e) || e, Error(a(306, t, ""));
					}
				}
				return t;
			case 0: return mc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, i = Gs(r, t.pendingProps), gc(e, t, r, i, n);
			case 3:
				a: {
					if (be(t, t.stateNode.containerInfo), e === null) throw Error(a(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					i = o.element, za(e, t), Ka(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, qi(t, V, r), r !== o.cache && Xi(t, [V], n, !0), Ga(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = _c(e, t, r, n);
							break a;
						}
						if (r !== i) {
							i = vi(Error(a(424)), t), Ui(i), t = _c(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (z = cf(e.firstChild), Ni = t, B = !0, Pi = null, Fi = !0, n = Ia(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					} else {
						if (Vi(), r === i) {
							t = Oc(e, t, n);
							break a;
						}
						rc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return pc(e, t), e === null ? (n = kf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : B || (n = t.type, e = t.pendingProps, r = Bd(ve.current).createElement(n), r[gt] = t, r[_t] = e, Pd(r, n, e), kt(r), t.stateNode = r) : t.memoizedState = kf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return Se(t), e === null && B && (r = t.stateNode = ff(t.type, t.pendingProps, ve.current), Ni = t, Fi = !0, i = z, Zd(t.type) ? (lf = i, z = cf(r.firstChild)) : z = i), rc(e, t, t.pendingProps.children, n), pc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && B && ((i = r = z) && (r = tf(r, t.type, t.pendingProps, Fi), r === null ? i = !1 : (t.stateNode = r, Ni = t, z = cf(r.firstChild), Fi = !1, i = !0)), i || Li(t)), Se(t), i = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Ud(i, o) ? r = null : s !== null && Ud(i, s) && (t.flags |= 32), t.memoizedState !== null && (i = xo(e, t, wo, null, null, n), Qf._currentValue = i), pc(e, t), rc(e, t, r, n), t.child;
			case 6: return e === null && B && ((e = n = z) && (n = nf(n, t.pendingProps, Fi), n === null ? e = !1 : (t.stateNode = n, Ni = t, z = null, e = !0)), e || Li(t)), null;
			case 13: return xc(e, t, n);
			case 4: return be(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Fa(t, null, r, n) : rc(e, t, r, n), t.child;
			case 11: return ic(e, t, t.type, t.pendingProps, n);
			case 7: return rc(e, t, t.pendingProps, n), t.child;
			case 8: return rc(e, t, t.pendingProps.children, n), t.child;
			case 12: return rc(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, qi(t, t.type, r.value), rc(e, t, r.children, n), t.child;
			case 9: return i = t.type._context, r = t.pendingProps.children, $i(t), i = ea(i), r = r(i), t.flags |= 1, rc(e, t, r, n), t.child;
			case 14: return ac(e, t, t.type, t.pendingProps, n);
			case 15: return oc(e, t, t.type, t.pendingProps, n);
			case 19: return Dc(e, t, n);
			case 31: return fc(e, t, n);
			case 22: return sc(e, t, n, t.pendingProps);
			case 24: return $i(t), r = ea(V), e === null ? (i = H(), i === null && (i = q, o = oa(), i.pooledCache = o, o.refCount++, o !== null && (i.pooledCacheLanes |= n), i = o), t.memoizedState = {
				parent: r,
				cache: i
			}, Ra(t), qi(t, V, i)) : ((e.lanes & n) !== 0 && (za(e, t), Ka(t, null, null, n), Ga()), i = e.memoizedState, o = t.memoizedState, i.parent === r ? (r = o.cache, qi(t, V, r), r !== i.cache && Xi(t, [V], n, !0)) : (i = {
				parent: r,
				cache: r
			}, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), qi(t, V, r))), rc(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(a(156, t.tag));
	}
	function Mc(e) {
		e.flags |= 4;
	}
	function Nc(e, t, n, r, i) {
		if ((t = !!(e.mode & 32)) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (wu()) e.flags |= 8192;
				else throw Ea = Sa, ba;
			}
		} else e.flags &= -16777217;
	}
	function Pc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Wf(t)) {
			if (wu()) e.flags |= 8192;
			else throw Ea = Sa, ba;
		}
	}
	function Fc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : it(), e.lanes |= t, Yl |= t);
	}
	function Ic(e, t) {
		if (!B) switch (e.tailMode) {
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
	function G(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Lc(e, t, n) {
		var r = t.pendingProps;
		switch (ji(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return G(t), null;
			case 1: return G(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Ji(V), xe(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Bi(t) ? Mc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Hi())), G(t), null;
			case 26:
				var i = t.type, o = t.memoizedState;
				return e === null ? (Mc(t), o === null ? (G(t), Nc(t, i, null, r, n)) : (G(t), Pc(t, o))) : o ? o === e.memoizedState ? (G(t), t.flags &= -16777217) : (Mc(t), G(t), Pc(t, o)) : (e = e.memoizedProps, e !== r && Mc(t), G(t), Nc(t, i, e, r, n)), null;
			case 27:
				if (Ce(t), n = ve.current, i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Mc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(a(166));
						return G(t), null;
					}
					e = ge.current, Bi(t) ? Ri(t, e) : (e = ff(i, r, n), t.stateNode = e, Mc(t));
				}
				return G(t), null;
			case 5:
				if (Ce(t), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Mc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(a(166));
						return G(t), null;
					}
					if (o = ge.current, Bi(t)) Ri(t, o);
					else {
						var s = Bd(ve.current);
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
						o[gt] = t, o[_t] = r;
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
						r && Mc(t);
					}
				}
				return G(t), Nc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Mc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(a(166));
					if (e = ve.current, Bi(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, i = Ni, i !== null) switch (i.tag) {
							case 27:
							case 5: r = i.memoizedProps;
						}
						e[gt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Md(e.nodeValue, n)), e || Li(t, !0);
					} else e = Bd(e).createTextNode(r), e[gt] = t, t.stateNode = e;
				}
				return G(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Bi(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(a(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(557));
							e[gt] = t;
						} else Vi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						G(t), e = !1;
					} else n = Hi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (oo(t), t) : (oo(t), null);
					if (t.flags & 128) throw Error(a(558));
				}
				return G(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (i = Bi(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!i) throw Error(a(318));
							if (i = t.memoizedState, i = i === null ? null : i.dehydrated, !i) throw Error(a(317));
							i[gt] = t;
						} else Vi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						G(t), i = !1;
					} else i = Hi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
					if (!i) return t.flags & 256 ? (oo(t), t) : (oo(t), null);
				}
				return oo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, i = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (i = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== i && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Fc(t, t.updateQueue), G(t), null);
			case 4: return xe(), e === null && Sd(t.stateNode.containerInfo), G(t), null;
			case 10: return Ji(t.type), G(t), null;
			case 19:
				if (E(so), r = t.memoizedState, r === null) return G(t), null;
				if (i = !!(t.flags & 128), o = r.rendering, o === null) {
					if (i) Ic(r, !1);
					else {
						if (Wl !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = co(e), o !== null) {
								for (t.flags |= 128, Ic(r, !1), e = o.updateQueue, t.updateQueue = e, Fc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) di(n, e), n = n.sibling;
								return D(so, so.current & 1 | 2), B && Oi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Fe() > tu && (t.flags |= 128, i = !0, Ic(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!i) {
						if (e = co(o), e !== null) {
							if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, Fc(t, e), Ic(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !B) return G(t), null;
						} else 2 * Fe() - r.renderingStartTime > tu && n !== 536870912 && (t.flags |= 128, i = !0, Ic(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (G(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Fe(), e.sibling = null, n = so.current, D(so, i ? n & 1 | 2 : n & 1), B && Oi(t, r.treeForkCount), e);
			case 22:
			case 23: return oo(t), $a(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (G(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : G(t), n = t.updateQueue, n !== null && Fc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && E(ga), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Ji(V), G(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(a(156, t.tag));
	}
	function Rc(e, t) {
		switch (ji(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Ji(V), xe(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Ce(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (oo(t), t.alternate === null) throw Error(a(340));
					Vi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (oo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(a(340));
					Vi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return E(so), null;
			case 4: return xe(), null;
			case 10: return Ji(t.type), null;
			case 22:
			case 23: return oo(t), $a(), e !== null && E(ga), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Ji(V), null;
			case 25: return null;
			default: return null;
		}
	}
	function zc(e, t) {
		switch (ji(t), t.tag) {
			case 3:
				Ji(V), xe();
				break;
			case 26:
			case 27:
			case 5:
				Ce(t);
				break;
			case 4:
				xe();
				break;
			case 31:
				t.memoizedState !== null && oo(t);
				break;
			case 13:
				oo(t);
				break;
			case 19:
				E(so);
				break;
			case 10:
				Ji(t.type);
				break;
			case 22:
			case 23:
				oo(t), $a(), e !== null && E(ga);
				break;
			case 24: Ji(V);
		}
	}
	function Bc(e, t) {
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
	function Vc(e, t, n) {
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
	function Hc(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Ja(t, n);
			} catch (t) {
				Z(e, e.return, t);
			}
		}
	}
	function Uc(e, t, n) {
		n.props = Gs(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Wc(e, t) {
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
	function Gc(e, t) {
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
	function Kc(e) {
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
	function qc(e, t, n) {
		try {
			var r = e.stateNode;
			Fd(r, e.type, n, t), r[_t] = t;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Jc(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Zd(e.type) || e.tag === 4;
	}
	function Yc(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Jc(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Zd(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Xc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = sn));
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (Xc(e, t, n), e = e.sibling; e !== null;) Xc(e, t, n), e = e.sibling;
	}
	function Zc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (Zc(e, t, n), e = e.sibling; e !== null;) Zc(e, t, n), e = e.sibling;
	}
	function Qc(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Pd(t, r, n), t[gt] = e, t[_t] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var $c = !1, el = !1, tl = !1, nl = typeof WeakSet == "function" ? WeakSet : Set, rl = null;
	function il(e, t) {
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
		}, sp = !1, rl = t; rl !== null;) if (t = rl, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, rl = e;
		else for (; rl !== null;) {
			switch (t = rl, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) i = e[n], i.ref.impl = i.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, i = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = Gs(n.type, i);
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
				e.return = t.return, rl = e;
				break;
			}
			rl = t.return;
		}
	}
	function al(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				bl(e, n), r & 4 && Bc(5, n);
				break;
			case 1:
				if (bl(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Z(n, n.return, e);
					}
					else {
						var i = Gs(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Z(n, n.return, e);
						}
					}
				}
				r & 64 && Hc(n), r & 512 && Wc(n, n.return);
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
						Ja(e, t);
					} catch (e) {
						Z(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Qc(n);
			case 26:
			case 5:
				bl(e, n), t === null && r & 4 && Kc(n), r & 512 && Wc(n, n.return);
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
				if (r = n.memoizedState !== null || $c, !r) {
					t = t !== null && t.memoizedState !== null || el, i = $c;
					var a = el;
					$c = r, (el = t) && !a ? Sl(e, n, !!(n.subtreeFlags & 8772)) : bl(e, n), $c = i, el = a;
				}
				break;
			case 30: break;
			default: bl(e, n);
		}
	}
	function ol(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, ol(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && wt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var sl = null, cl = !1;
	function ll(e, t, n) {
		for (n = n.child; n !== null;) ul(e, t, n), n = n.sibling;
	}
	function ul(e, t, n) {
		if (Ge && typeof Ge.onCommitFiberUnmount == "function") try {
			Ge.onCommitFiberUnmount(We, n);
		} catch {}
		switch (n.tag) {
			case 26:
				el || Gc(n, t), ll(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				el || Gc(n, t);
				var r = sl, i = cl;
				Zd(n.type) && (sl = n.stateNode, cl = !1), ll(e, t, n), pf(n.stateNode), sl = r, cl = i;
				break;
			case 5: el || Gc(n, t);
			case 6:
				if (r = sl, i = cl, sl = null, ll(e, t, n), sl = r, cl = i, sl !== null) {
					if (cl) try {
						(sl.nodeType === 9 ? sl.body : sl.nodeName === "HTML" ? sl.ownerDocument.body : sl).removeChild(n.stateNode);
					} catch (e) {
						Z(n, t, e);
					}
					else try {
						sl.removeChild(n.stateNode);
					} catch (e) {
						Z(n, t, e);
					}
				}
				break;
			case 18:
				sl !== null && (cl ? (e = sl, Qd(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Np(e)) : Qd(sl, n.stateNode));
				break;
			case 4:
				r = sl, i = cl, sl = n.stateNode.containerInfo, cl = !0, ll(e, t, n), sl = r, cl = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Vc(2, n, t), el || Vc(4, n, t), ll(e, t, n);
				break;
			case 1:
				el || (Gc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Uc(n, t, r)), ll(e, t, n);
				break;
			case 21:
				ll(e, t, n);
				break;
			case 22:
				el = (r = el) || n.memoizedState !== null, ll(e, t, n), el = r;
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
				return t === null && (t = e.stateNode = new nl()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new nl()), t;
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
							sl = c.stateNode, cl = !1;
							break a;
						}
						break;
					case 5:
						sl = c.stateNode, cl = !1;
						break a;
					case 3:
					case 4:
						sl = c.stateNode.containerInfo, cl = !0;
						break a;
				}
				c = c.return;
			}
			if (sl === null) throw Error(a(160));
			ul(o, s, i), sl = null, cl = !1, o = i.alternate, o !== null && (o.return = null), i.return = null;
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
				hl(t, e), vl(e), r & 4 && (Vc(3, e, e.return), Bc(3, e), Vc(5, e, e.return));
				break;
			case 1:
				hl(t, e), vl(e), r & 512 && (el || n === null || Gc(n, n.return)), r & 64 && $c && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var i = gl;
				if (hl(t, e), vl(e), r & 512 && (el || n === null || Gc(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) {
						if (r === null) {
							if (e.stateNode === null) {
								a: {
									r = e.type, n = e.memoizedProps, i = i.ownerDocument || i;
									b: switch (r) {
										case "title":
											o = i.getElementsByTagName("title")[0], (!o || o[Ct] || o[gt] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = i.createElement(r), i.head.insertBefore(o, i.querySelector("head > title"))), Pd(o, r, n), o[gt] = e, kt(o), r = o;
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
									o[gt] = e, kt(o), r = o;
								}
								e.stateNode = r;
							} else Hf(i, e.type, e.stateNode);
						} else e.stateNode = If(i, r, e.memoizedProps);
					} else o === r ? r === null && e.stateNode !== null && qc(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Hf(i, e.type, e.stateNode) : If(i, r, e.memoizedProps));
				}
				break;
			case 27:
				hl(t, e), vl(e), r & 512 && (el || n === null || Gc(n, n.return)), n !== null && r & 4 && qc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (hl(t, e), vl(e), r & 512 && (el || n === null || Gc(n, n.return)), e.flags & 32) {
					i = e.stateNode;
					try {
						Qt(i, "");
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (i = e.memoizedProps, qc(e, i, n === null ? i : n.memoizedProps)), r & 1024 && (tl = !0);
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
				tl && (tl = !1, yl(e));
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
				hl(t, e), vl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && ($l = Fe()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, ml(e, r)));
				break;
			case 22:
				i = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = $c, d = el;
				if ($c = u || i, el = d || l, hl(t, e), el = d, $c = u, vl(e), r & 8192) a: for (t = e.stateNode, t._visibility = i ? t._visibility & -2 : t._visibility | 1, i && (n === null || l || $c || el || xl(e)), n = null, t = e;;) {
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
					if (Jc(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(a(160));
				switch (n.tag) {
					case 27:
						var i = n.stateNode;
						Zc(e, Yc(e), i);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && (Qt(o, ""), n.flags &= -33), Zc(e, Yc(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						Xc(e, Yc(e), s);
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
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) al(e, t.alternate, t), t = t.sibling;
	}
	function xl(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Vc(4, t, t.return), xl(t);
					break;
				case 1:
					Gc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && Uc(t, t.return, n), xl(t);
					break;
				case 27: pf(t.stateNode);
				case 26:
				case 5:
					Gc(t, t.return), xl(t);
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
					Sl(i, a, n), Bc(4, a);
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
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) qa(c[i], s);
						} catch (e) {
							Z(r, r.return, e);
						}
					}
					n && o & 64 && Hc(a), Wc(a, a.return);
					break;
				case 27: Qc(a);
				case 26:
				case 5:
					Sl(i, a, n), n && r === null && o & 4 && Kc(a), Wc(a, a.return);
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
					a.memoizedState === null && Sl(i, a, n), Wc(a, a.return);
					break;
				case 30: break;
				default: Sl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function Cl(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && sa(n));
	}
	function wl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && sa(e));
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
				Tl(e, t, n, r), i & 2048 && Bc(9, t);
				break;
			case 1:
				Tl(e, t, n, r);
				break;
			case 3:
				Tl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && sa(e)));
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
					Dl(a, o, s, c, i), Bc(8, o);
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
				rl = r, Il(r, e);
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
				Nl(e), e.flags & 2048 && Vc(9, e, e.return);
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
				rl = r, Il(r, e);
			}
			Ml(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Vc(8, t, t.return), Fl(t);
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
		for (; rl !== null;) {
			var n = rl;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Vc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: sa(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, rl = r;
			else a: for (n = e; rl !== null;) {
				r = rl;
				var i = r.sibling, a = r.return;
				if (ol(r), r === n) {
					rl = null;
					break a;
				}
				if (i !== null) {
					i.return = a, rl = i;
					break a;
				}
				rl = a;
			}
		}
	}
	var Ll = {
		getCacheForType: function(e) {
			var t = ea(V), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return ea(V).controller.signal;
		}
	}, Rl = typeof WeakMap == "function" ? WeakMap : Map, K = 0, q = null, J = null, Y = 0, X = 0, zl = null, Bl = !1, Vl = !1, Hl = !1, Ul = 0, Wl = 0, Gl = 0, Kl = 0, ql = 0, Jl = 0, Yl = 0, Xl = null, Zl = null, Ql = !1, $l = 0, eu = 0, tu = Infinity, nu = null, ru = null, iu = 0, au = null, ou = null, su = 0, cu = 0, lu = null, uu = null, du = 0, fu = null;
	function pu() {
		return K & 2 && Y !== 0 ? Y & -Y : w.T === null ? pt() : dd();
	}
	function mu() {
		if (Jl === 0) {
			if (!(Y & 536870912) || B) {
				var e = Qe;
				Qe <<= 1, !(Qe & 3932160) && (Qe = 262144), Jl = e;
			} else Jl = 536870912;
		}
		return e = eo.current, e !== null && (e.flags |= 32), Jl;
	}
	function hu(e, t, n) {
		(e === q && (X === 2 || X === 9) || e.cancelPendingCommit !== null) && (Su(e, 0), yu(e, Y, Jl, !1)), ot(e, n), (!(K & 2) || e !== q) && (e === q && (!(K & 2) && (Kl |= n), Wl === 4 && yu(e, Y, Jl, !1)), rd(e));
	}
	function gu(e, t, n) {
		if (K & 6) throw Error(a(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || nt(e, t), i = r ? Au(e, t) : Ou(e, t, !0), o = r;
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
				if ((t & 62914560) === t && (i = $l + 300 - Fe(), 10 < i)) {
					if (yu(r, t, Jl, !Bl), tt(r, 0, !0) !== 0) break a;
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
			var m = (a & 62914560) === a ? $l - Fe() : (a & 4194048) === a ? eu - Fe() : 0;
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
					if (!N(a(), i)) return !1;
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
			var a = 31 - qe(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && ct(e, n, t);
	}
	function bu() {
		return K & 6 ? !0 : (id(0, !1), !1);
	}
	function xu() {
		if (J !== null) {
			if (X === 0) var e = J.return;
			else e = J, Ki = Gi = null, Do(e), ka = null, Aa = 0, e = J;
			for (; e !== null;) zc(e.alternate, e), e = e.return;
			J = null;
		}
	}
	function Su(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, qd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), su = 0, xu(), q = e, J = n = ui(e.current, null), Y = t, X = 0, zl = null, Bl = !1, Vl = nt(e, t), Hl = !1, Yl = Jl = ql = Kl = Gl = Wl = 0, Zl = Xl = null, Ql = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - qe(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Ul = t, ni(), n;
	}
	function Cu(e, t) {
		U = null, w.H = Ls, t === ya || t === xa ? (t = Da(), X = 3) : t === ba ? (t = Da(), X = 4) : X = t === tc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, zl = t, J === null && (Wl = 1, Ys(e, vi(t, e.current)));
	}
	function wu() {
		var e = eo.current;
		return e === null ? !0 : (Y & 4194048) === Y ? to === null : (Y & 62914560) === Y || Y & 536870912 ? e === to : !1;
	}
	function Tu() {
		var e = w.H;
		return w.H = Ls, e === null ? Ls : e;
	}
	function Eu() {
		var e = w.A;
		return w.A = Ll, e;
	}
	function Du() {
		Wl = 4, Bl || (Y & 4194048) !== Y && eo.current !== null || (Vl = !0), !(Gl & 134217727) && !(Kl & 134217727) || q === null || yu(q, Y, Jl, !1);
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
							eo.current === null && (t = !0);
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
		return t && e.shellSuspendCounter++, Ki = Gi = null, K = r, w.H = i, w.A = a, J === null && (q = null, Y = 0, ni()), o;
	}
	function ku() {
		for (; J !== null;) Mu(J);
	}
	function Au(e, t) {
		var n = K;
		K |= 2;
		var r = Tu(), i = Eu();
		q !== e || Y !== t ? (nu = null, tu = Fe() + 500, Su(e, t)) : Vl = nt(e, t);
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
							if (Ca(o)) {
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
							Ca(o) ? (X = 0, zl = null, Nu(t)) : (X = 0, zl = null, Pu(e, t, o, 7));
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
		return Ki = Gi = null, w.H = r, w.A = i, K = n, J === null ? (q = null, Y = 0, ni(), Wl) : 0;
	}
	function ju() {
		for (; J !== null && !Ne();) Mu(J);
	}
	function Mu(e) {
		var t = jc(e.alternate, e, Ul);
		e.memoizedProps = e.pendingProps, t === null ? Fu(e) : J = t;
	}
	function Nu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = hc(n, t, t.pendingProps, t.type, void 0, Y);
				break;
			case 11:
				t = hc(n, t, t.pendingProps, t.type.render, t.ref, Y);
				break;
			case 5: Do(t);
			default: zc(n, t), t = J = di(t, Ul), t = jc(n, t, Ul);
		}
		e.memoizedProps = e.pendingProps, t === null ? Fu(e) : J = t;
	}
	function Pu(e, t, n, r) {
		Ki = Gi = null, Do(t), ka = null, Aa = 0;
		var i = t.return;
		try {
			if (ec(e, i, t, n, Y)) {
				Wl = 1, Ys(e, vi(n, e.current)), J = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw J = i, t;
			Wl = 1, Ys(e, vi(n, e.current)), J = null;
			return;
		}
		t.flags & 32768 ? (B || r === 1 ? e = !0 : Vl || Y & 536870912 ? e = !1 : (Bl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = eo.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Iu(t, e)) : Fu(t);
	}
	function Fu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Iu(t, Bl);
				return;
			}
			e = t.return;
			var n = Lc(t.alternate, t, Ul);
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
			var n = Rc(e.alternate, e);
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
			if (o = t.lanes | t.childLanes, o |= ti, st(e, n, o, s, c, l), e === q && (J = q = null, Y = 0), ou = t, au = e, su = n, cu = o, lu = i, uu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Xu(ze, function() {
				return Uu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
				r = w.T, w.T = null, i = T.p, T.p = 2, s = K, K |= 4;
				try {
					il(e, t, n);
				} finally {
					K = s, T.p = i, w.T = r;
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
				n = w.T, w.T = null;
				var r = T.p;
				T.p = 2;
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
					K = i, T.p = r, w.T = n;
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
				n = w.T, w.T = null;
				var r = T.p;
				T.p = 2;
				var i = K;
				K |= 4;
				try {
					al(e, t.alternate, t);
				} finally {
					K = i, T.p = r, w.T = n;
				}
			}
			iu = 3;
		}
	}
	function Bu() {
		if (iu === 4 || iu === 3) {
			iu = 0, Pe();
			var e = au, t = ou, n = su, r = uu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? iu = 5 : (iu = 0, ou = au = null, Vu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (ru = null), ft(n), t = t.stateNode, Ge && typeof Ge.onCommitFiberRoot == "function") try {
				Ge.onCommitFiberRoot(We, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = w.T, i = T.p, T.p = 2, w.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					w.T = t, T.p = i;
				}
			}
			su & 3 && Hu(), rd(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === fu ? du++ : (du = 0, fu = e) : du = 0, id(0, !1);
		}
	}
	function Vu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, sa(t)));
	}
	function Hu() {
		return Ru(), zu(), Bu(), Uu();
	}
	function Uu() {
		if (iu !== 5) return !1;
		var e = au, t = cu;
		cu = 0;
		var n = ft(su), r = w.T, i = T.p;
		try {
			T.p = 32 > n ? 32 : n, w.T = null, n = lu, lu = null;
			var o = au, s = su;
			if (iu = 0, ou = au = null, su = 0, K & 6) throw Error(a(331));
			var c = K;
			if (K |= 4, Pl(o.current), El(o, o.current, s, n), K = c, id(0, !1), Ge && typeof Ge.onPostCommitFiberRoot == "function") try {
				Ge.onPostCommitFiberRoot(We, o);
			} catch {}
			return !0;
		} finally {
			T.p = i, w.T = r, Vu(e, t);
		}
	}
	function Wu(e, t, n) {
		t = vi(n, t), t = Zs(e.stateNode, t, 2), e = Va(e, t, 2), e !== null && (ot(e, 2), rd(e));
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
					e = vi(n, e), n = Qs(2), r = Va(t, n, 2), r !== null && ($s(n, r, t, e), ot(r, 2), rd(r));
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
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, q === e && (Y & n) === n && (Wl === 4 || Wl === 3 && (Y & 62914560) === Y && 300 > Fe() - $l ? !(K & 2) && Su(e, 0) : ql |= n, Yl === Y && (Yl = 0)), rd(e);
	}
	function qu(e, t) {
		t === 0 && (t = it()), e = R(e, t), e !== null && (ot(e, t), rd(e));
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
		return je(e, t);
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
								a = (1 << 31 - qe(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, ld(r, a));
						} else a = Y, a = tt(r, r === q ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || nt(r, a) || (n = !0, ld(r, a));
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
		for (var t = Fe(), n = null, r = Zu; r !== null;) {
			var i = r.next, a = sd(r, t);
			a === 0 ? (r.next = null, n === null ? Zu = i : n.next = i, i === null && (Qu = n)) : (n = r, (e !== 0 || a & 3) && (ed = !0)), r = i;
		}
		iu !== 0 && iu !== 5 || id(e, !1), nd !== 0 && (nd = 0);
	}
	function sd(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - qe(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = rt(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = q, n = Y, n = tt(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (X === 2 || X === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Me(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || nt(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Me(r), ft(n)) {
				case 2:
				case 8:
					n = Re;
					break;
				case 32:
					n = ze;
					break;
				case 268435456:
					n = Ve;
					break;
				default: n = ze;
			}
			return r = cd.bind(null, e), n = je(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Me(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function cd(e, t) {
		if (iu !== 0 && iu !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Hu() && e.callbackNode !== n) return null;
		var r = Y;
		return r = tt(e, e === q ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (gu(e, r, t), sd(e, Fe()), e.callbackNode != null && e.callbackNode === n ? cd.bind(null, e) : null);
	}
	function ld(e, t) {
		if (Hu()) return null;
		gu(e, t, !0);
	}
	function ud() {
		Yd(function() {
			K & 6 ? je(Le, ad) : od();
		});
	}
	function dd() {
		if (nd === 0) {
			var e = ua;
			e === 0 && (e = Ze, Ze <<= 1, !(Ze & 261888) && (Ze = 256)), nd = e;
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
			var a = fd((i[_t] || null).action), o = r.submitter;
			o && (t = (t = o[_t] || null) ? fd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new On("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (nd !== 0) {
								var e = o ? pd(i, o) : new FormData(i);
								Cs(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? pd(i, o) : new FormData(i), Cs(n, {
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
	for (var hd = 0; hd < Zr.length; hd++) {
		var gd = Zr[hd];
		Qr(gd.toLowerCase(), "on" + (gd[0].toUpperCase() + gd.slice(1)));
	}
	Qr(Ur, "onAnimationEnd"), Qr(Wr, "onAnimationIteration"), Qr(Gr, "onAnimationStart"), Qr("dblclick", "onDoubleClick"), Qr("focusin", "onFocus"), Qr("focusout", "onBlur"), Qr(Kr, "onTransitionRun"), Qr(qr, "onTransitionStart"), Qr(Jr, "onTransitionCancel"), Qr(Yr, "onTransitionEnd"), Mt("onMouseEnter", ["mouseout", "mouseover"]), Mt("onMouseLeave", ["mouseout", "mouseover"]), Mt("onPointerEnter", ["pointerout", "pointerover"]), Mt("onPointerLeave", ["pointerout", "pointerover"]), k("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), k("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), k("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), k("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), k("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), k("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
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
						$r(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						$r(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[yt];
		n === void 0 && (n = t[yt] = /* @__PURE__ */ new Set());
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
			e[xd] = !0, At.forEach(function(t) {
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
					if (o = Tt(c), o === null) return;
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
				var c = Xr.get(e);
				if (c !== void 0) {
					var l = On, u = e;
					switch (e) {
						case "keypress": if (Cn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Gn;
							break;
						case "focusin":
							u = "focus", l = Ln;
							break;
						case "focusout":
							u = "blur", l = Ln;
							break;
						case "beforeblur":
						case "afterblur":
							l = Ln;
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
							l = Fn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = In;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = qn;
							break;
						case Ur:
						case Wr:
						case Gr:
							l = Rn;
							break;
						case Yr:
							l = Jn;
							break;
						case "scroll":
						case "scrollend":
							l = An;
							break;
						case "wheel":
							l = Yn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = zn;
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
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== cn && (u = n.relatedTarget || n.fromElement) && (Tt(u) || u[vt])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? Tt(u) : null, u !== null && (f = s(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = Fn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Kn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : Dt(l), h = u == null ? c : Dt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, Tt(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
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
					if (c = r ? Dt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = gr;
					else if (ur(c)) {
						if (_r) v = Er;
						else {
							v = wr;
							var y = Cr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && nn(r.elementType) && (v = gr) : v = Tr;
					if (v && (v = v(e, r))) {
						dr(o, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Jt(c, "number", c.value);
				}
				switch (y = r ? Dt(r) : window, e) {
					case "focusin":
						(ur(y) || y.contentEditable === "true") && (P = y, F = r, Fr = null);
						break;
					case "focusout":
						Fr = F = P = null;
						break;
					case "mousedown":
						Ir = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Ir = !1, Lr(o, n, i);
						break;
					case "selectionchange": if (Pr) break;
					case "keydown":
					case "keyup": Lr(o, n, i);
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
				x && (tr && n.locale !== "ko" && (or || x !== "onCompositionStart" ? x === "onCompositionEnd" && or && (b = Sn()) : (yn = i, bn = "value" in yn ? yn.value : yn.textContent, or = !0)), y = Ed(r, x), 0 < y.length && (x = new Bn(x, e, null, n, i), o.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = ar(n), b !== null && (x.data = b)))), (b = er ? sr(e, n) : cr(e, n)) && (x = Ed(r, "onBeforeInput"), 0 < x.length && (y = new Bn("onBeforeInput", "beforeinput", null, n, i), o.push({
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
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || Qt(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && Qt(e, "" + r);
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
				tn(e, r, o);
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
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = rn.get(n) || n, Lt(e, n, r));
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
				typeof r == "string" ? Qt(e, r) : (typeof r == "number" || typeof r == "bigint") && Qt(e, "" + r);
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
			default: if (!jt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), o = e[_t] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, i), typeof r == "function")) {
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
				qt(e, o, c, l, u, s, i, !1);
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
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Yt(e, !!r, n, !0) : Yt(e, !!r, t, !1);
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
				Zt(e, r, i, o);
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
				j(e, s, c, l, u, d, o, i);
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
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Yt(e, !!n, n ? [] : "", !1) : Yt(e, !!n, t, !0)) : Yt(e, !!n, p, !1);
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
				Xt(e, p, m);
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
						a[Ct] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
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
					ef(n), wt(n);
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
			} else if (!e[Ct]) switch (t) {
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
		wt(e);
	}
	var mf = /* @__PURE__ */ new Map(), hf = /* @__PURE__ */ new Set();
	function gf(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var _f = T.d;
	T.d = {
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
		var t = Et(e);
		t !== null && t.tag === 5 && t.type === "form" ? Ts(t) : _f.r(e);
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
			}, r.querySelector(i) === null && (t = r.createElement("link"), Pd(t, "link", e), kt(t), r.head.appendChild(t)));
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
			}, n), mf.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(jf(a)) || t === "script" && r.querySelector(Ff(a)) || (t = r.createElement("link"), Pd(t, "link", e), kt(t), r.head.appendChild(t)));
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
				r = n.createElement("link"), Pd(r, "link", e), kt(r), n.head.appendChild(r);
			}
		}
	}
	function Ef(e, t, n) {
		_f.S(e, t, n);
		var r = bf;
		if (r && e) {
			var i = Ot(r).hoistableStyles, a = Af(e);
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
					kt(c), Pd(c, "link", e), c._p = new Promise(function(e, t) {
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
			var r = Ot(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), kt(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
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
			var r = Ot(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), kt(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function kf(e, t, n, r) {
		var i = (i = ve.current) ? gf(i) : null;
		if (!i) throw Error(a(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Af(n.href), n = Ot(i).hoistableStyles, r = n.get(t), r || (r = {
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
					var o = Ot(i).hoistableStyles, s = o.get(e);
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
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Pf(n), n = Ot(i).hoistableScripts, r = n.get(t), r || (r = {
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
		}), Pd(t, "link", n), kt(t), e.head.appendChild(t));
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
				if (r) return t.instance = r, kt(r), r;
				var i = h({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), kt(r), Pd(r, "style", i), Lf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				i = Af(n.href);
				var o = e.querySelector(jf(i));
				if (o) return t.state.loading |= 4, t.instance = o, kt(o), o;
				r = Mf(n), (i = mf.get(i)) && Rf(r, i), o = (e.ownerDocument || e).createElement("link"), kt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Pd(o, "link", r), t.state.loading |= 4, Lf(o, n.precedence, e), t.instance = o;
			case "script": return o = Pf(n.src), (i = e.querySelector(Ff(o))) ? (t.instance = i, kt(i), i) : (r = n, (i = mf.get(o)) && (r = h({}, n), zf(r, i)), e = e.ownerDocument || e, i = e.createElement("script"), kt(i), Pd(i, "link", r), e.head.appendChild(i), t.instance = i);
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
			if (!(a[Ct] || a[gt] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
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
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Jf.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, kt(a);
					return;
				}
				a = t.ownerDocument || t, r = Mf(r), (i = mf.get(i)) && Rf(r, i), a = a.createElement("link"), kt(a);
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
		$$typeof: te,
		Provider: null,
		Consumer: null,
		_currentValue: fe,
		_currentValue2: fe,
		_threadCount: 0
	};
	function $f(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = at(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = at(0), this.hiddenUpdates = at(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new $f(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = ci(3, null, null, t), e.current = a, a.stateNode = e, t = oa(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Ra(a), e;
	}
	function tp(e) {
		return e ? (e = oi, e) : oi;
	}
	function np(e, t, n, r, i, a) {
		i = tp(i), r.context === null ? r.context = i : r.pendingContext = i, r = Ba(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Va(e, r, t), n !== null && (hu(n, e, t), Ha(n, e, t));
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
			var t = R(e, 67108864);
			t !== null && hu(t, e, 67108864), ip(e, 67108864);
		}
	}
	function op(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = pu();
			t = dt(t);
			var n = R(e, t);
			n !== null && hu(n, e, t), ip(e, t);
		}
	}
	var sp = !0;
	function cp(e, t, n, r) {
		var i = w.T;
		w.T = null;
		var a = T.p;
		try {
			T.p = 2, up(e, t, n, r);
		} finally {
			T.p = a, w.T = i;
		}
	}
	function lp(e, t, n, r) {
		var i = w.T;
		w.T = null;
		var a = T.p;
		try {
			T.p = 8, up(e, t, n, r);
		} finally {
			T.p = a, w.T = i;
		}
	}
	function up(e, t, n, r) {
		if (sp) {
			var i = dp(r);
			if (i === null) wd(e, t, r, fp, n), Cp(e, r);
			else if (Tp(i, e, t, n, r)) r.stopPropagation();
			else if (Cp(e, r), t & 4 && -1 < Sp.indexOf(e)) {
				for (; i !== null;) {
					var a = Et(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = et(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - qe(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									rd(a), !(K & 6) && (tu = Fe() + 500, id(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = R(a, 2), s !== null && hu(s, a, 2), bu(), ip(a, 2);
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
		if (fp = null, e = Tt(e), e !== null) {
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
			case "message": switch (Ie()) {
				case Le: return 2;
				case Re: return 8;
				case ze:
				case Be: return 32;
				case Ve: return 268435456;
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
		}, t !== null && (t = Et(t), t !== null && ap(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
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
		var t = Tt(e.target);
		if (t !== null) {
			var n = s(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, mt(e.priority, function() {
							op(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = l(n), t !== null) {
						e.blockedOn = t, mt(e.priority, function() {
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
			} else return t = Et(n), t !== null && ap(t), e.blockedOn = n, !1;
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
				var a = Et(n);
				a !== null && (e.splice(t, 3), t -= 3, Cs(a, {
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
			var i = n[r], a = n[r + 1], o = i[_t] || null;
			if (typeof a == "function") o || Mp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[_t] || null) s = o.formAction;
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
			np(e.current, 2, null, e, null, null), bu(), t[vt] = null;
		}
	};
	function Ip(e) {
		this._internalRoot = e;
	}
	Ip.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = pt();
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
	T.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(a(188)) : (e = Object.keys(e).join(","), Error(a(268, e)));
		return e = f(t), e = e === null ? null : m(e), e = e === null ? null : e.stateNode, e;
	};
	var Rp = {
		bundleType: 0,
		version: "19.2.8",
		rendererPackageName: "react-dom",
		currentDispatcherRef: w,
		reconcilerVersion: "19.2.8"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!zp.isDisabled && zp.supportsFiber) try {
			We = zp.inject(Rp), Ge = zp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!o(e)) throw Error(a(299));
		var n = !1, r = "", i = Ks, s = qs, c = Js;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = ep(e, 1, !1, null, null, n, r, null, i, s, c, Pp), e[vt] = t.current, Sd(e), new Fp(t);
	};
})), h = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = m();
})), g = n(), _ = h(), v = (e) => /^1(?:\.|$)/.test(e), y = class extends Error {
	constructor(e, t, n) {
		super(e), r(this, "code", void 0), r(this, "status", void 0), this.code = t, this.status = n, this.name = "ApiError";
	}
}, b = class {
	constructor(e) {
		r(this, "config", void 0), r(this, "base", void 0), r(this, "uploadStorageKey", "sofinder.uploadSessions.v1"), this.config = e, this.base = e.apiBase.replace(/\/config$/, "");
	}
	async configData() {
		let e = await this.request("/config");
		if (!v(e.apiVersion)) throw new y(`SoFinder UI requires API 1.x; server reported ${e.apiVersion || "an unknown version"}.`, "incompatible_api_version", 426);
		return e;
	}
	securityStatus() {
		return this.request("/security/status");
	}
	resolveAsset(e, t) {
		return this.request(`/assets/resolve?${new URLSearchParams({
			resource: e,
			path: t
		})}`);
	}
	asset(e) {
		return this.request(`/assets/${encodeURIComponent(e)}`);
	}
	updateAssetMetadata(e, t) {
		return this.request(`/assets/${encodeURIComponent(e)}/metadata`, {
			method: "PATCH",
			body: JSON.stringify(t)
		});
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
		return i.set("resource", e), i.set("path", t), i.set("upload", n), r.overwrite && i.set("overwrite", "1"), r.autoRename && i.set("autoRename", "1"), new Promise((e, t) => {
			let n = new XMLHttpRequest(), a = () => n.abort(), o = () => r.signal?.removeEventListener("abort", a);
			if (n.open("POST", this.base + "/uploads"), n.withCredentials = !0, n.setRequestHeader("Accept", "application/json"), n.setRequestHeader("X-CSRF-TOKEN", this.config.csrfToken), n.upload.addEventListener("progress", (e) => {
				e.lengthComputable && r.onProgress?.(Math.min(100, Math.round(e.loaded / e.total * 100)));
			}), n.addEventListener("load", () => {
				o();
				let i;
				try {
					i = JSON.parse(n.responseText);
				} catch {
					t(new y(`Request failed (${n.status})`, "invalid_response", n.status));
					return;
				}
				if (n.status < 200 || n.status >= 300 || !i.success || !i.data) {
					t(new y(i.error?.message || `Request failed (${n.status})`, i.error?.code || "upload_failed", n.status));
					return;
				}
				r.onProgress?.(100), e(i.data);
			}), n.addEventListener("error", () => {
				o(), t(new y("The upload failed because of a network error.", "network_error", 0));
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
		let i = 4e6, a = Math.ceil(n.size / i), o = this.findPendingUpload(e, t, n, !!r.overwrite, !!r.autoRename, a), s = o?.id || crypto.randomUUID(), c = o || {
			id: s,
			scope: this.base,
			resource: e,
			path: t,
			name: n.name,
			size: n.size,
			lastModified: n.lastModified,
			total: a,
			overwrite: !!r.overwrite,
			autoRename: !!r.autoRename,
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
				if (!(i instanceof y) || i.status !== 404) throw i;
				return this.removePendingUpload(s), this.chunkUpload(e, t, n, r);
			}
			for (let o = 0; o < a; o++) {
				if (r.signal?.aborted) throw new DOMException("The upload was cancelled.", "AbortError");
				if (l.has(o)) {
					r.onProgress?.(Math.round((o + 1) / a * 100));
					continue;
				}
				let u = new FormData();
				u.set("resource", e), u.set("path", t), u.set("name", n.name), u.set("uploadId", s), u.set("index", String(o)), u.set("total", String(a)), r.overwrite && u.set("overwrite", "1"), r.autoRename && u.set("autoRename", "1"), u.set("chunk", n.slice(o * i, Math.min(n.size, (o + 1) * i)), `${n.name}.part`);
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
				if (!d.ok || !f.success || !f.data) throw new y(f.error?.message || `Request failed (${d.status})`, f.error?.code || "upload_failed", d.status);
				if (r.onProgress?.(Math.round((o + 1) / a * 100)), this.savePendingUpload({
					...c,
					updatedAt: Date.now()
				}), f.data.complete && f.data.entry) return this.removePendingUpload(s), { entry: f.data.entry };
			}
			throw new y("The chunk upload did not complete.", "chunk_incomplete", 500);
		} catch (e) {
			throw e instanceof y && e.status >= 400 && e.status < 500 && this.removePendingUpload(s), e;
		} finally {
			r.signal?.removeEventListener("abort", l), r.signal?.aborted && this.removePendingUpload(s);
		}
	}
	pendingUploads() {
		try {
			let e = JSON.parse(localStorage.getItem(this.uploadStorageKey) || "[]");
			return Array.isArray(e) ? e.filter((e) => e.scope === this.base && Date.now() - e.updatedAt < 864e5).map((e) => ({
				...e,
				autoRename: e.autoRename === !0
			})) : [];
		} catch {
			return [];
		}
	}
	findPendingUpload(e, t, n, r, i = !1, a) {
		return this.pendingUploads().find((o) => o.resource === e && o.path === t && o.name === n.name && o.size === n.size && o.lastModified === n.lastModified && o.overwrite === r && o.autoRename === i && (a === void 0 || o.total === a));
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
			throw new y(e.error?.message || `Request failed (${n.status})`, e.error?.code || "archive_failed", n.status);
		}
		return n.blob();
	}
	async metadata(e) {
		let t = await this.request(`/metadata?${new URLSearchParams({ resource: e })}`), n = t.quickAccess || [];
		return {
			...t,
			quickAccess: n,
			quickAccessEntries: t.quickAccessEntries || n.map((e) => ({
				path: e,
				name: e.split("/").pop() || e,
				directory: null,
				mimeType: null,
				exists: !0
			}))
		};
	}
	async updateMetadata(e, t, n, r = {}) {
		let i = await this.request("/metadata", {
			method: "PATCH",
			body: JSON.stringify({
				resource: e,
				path: t,
				action: n,
				...r
			})
		}), a = i.quickAccess || [];
		return {
			...i,
			quickAccess: a,
			quickAccessEntries: i.quickAccessEntries || a.map((e) => ({
				path: e,
				name: e.split("/").pop() || e,
				directory: null,
				mimeType: null,
				exists: !0
			}))
		};
	}
	async request(e, t = {}) {
		let n = new Headers(t.headers);
		n.set("Accept", "application/json"), !(t.body instanceof FormData) && t.body !== void 0 && n.set("Content-Type", "application/json"), t.method && t.method !== "GET" && n.set("X-CSRF-TOKEN", this.config.csrfToken);
		let r = await fetch(this.base + e, {
			...t,
			headers: n,
			credentials: "same-origin"
		}), i = await r.json();
		if (!r.ok || !i.success || !i.data) throw new y(i.error?.message || `Request failed (${r.status})`, i.error?.code || "request_failed", r.status);
		return i.data;
	}
}, x = {
	en: () => import("./en-C_HF2M7I.js"),
	"zh-cn": () => import("./zh-cn-ChnTMfqI.js"),
	"zh-tw": () => import("./zh-tw-UihVQ5GS.js")
}, ee = async (e) => (await x[e]()).default, te = (e) => (t) => e[t], S = (e) => {
	let t = localStorage.getItem("sofinder.language");
	return t === "en" || t === "zh-cn" || t === "zh-tw" ? t : e;
}, C = t();
function ne({ title: e, label: t, initialValue: n = "", maximum: r, extension: i = "", invalidNameLabel: s, confirmLabel: c, cancelLabel: l, closeLabel: u, onConfirm: d, onClose: f }) {
	let [p, m] = (0, g.useState)(n), h = p + i, _ = Array.from(h).length, v = o(h, r), y = v === null;
	return /* @__PURE__ */ (0, C.jsx)(a, {
		title: e,
		closeLabel: u,
		onClose: f,
		className: "sf-form-modal",
		footer: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
			/* @__PURE__ */ (0, C.jsxs)("span", { children: [
				_,
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
				children: v === "tooLong" ? `${_} / ${r}` : s
			})]
		})
	});
}
function re({ title: e, message: t, detail: n, confirmLabel: r, cancelLabel: i, closeLabel: o, danger: s = !1, onConfirm: c, onClose: l }) {
	return /* @__PURE__ */ (0, C.jsx)(a, {
		title: e,
		closeLabel: o,
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
function ie({ fileName: e, title: t, renameLabel: n, overwriteLabel: r, skipLabel: i, closeLabel: o, onChoose: s }) {
	return /* @__PURE__ */ (0, C.jsx)(a, {
		title: t,
		closeLabel: o,
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
//#region src/preferences.ts
var ae = {
	resize: !1,
	crop: !1,
	rotate: !1,
	presets: !1,
	process: !1,
	batchRename: !1
}, oe = {
	grid: "medium",
	list: "medium"
}, se = {
	recent: !1,
	favorites: !1,
	sidebarFavorites: !0,
	sidebarQuickAccess: !0,
	quickAccessFiles: !0,
	tags: !1,
	archive: !1,
	trash: !0,
	folderTree: !1,
	qrCode: !1,
	autoCollapseUploads: !0
}, ce = {
	size: !0,
	modified: !0,
	type: !1
}, le = {
	recent: !0,
	favorites: !0,
	quickAccess: !0,
	quickAccessFiles: !0,
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
}, ue = (e, t) => {
	try {
		let n = JSON.parse(localStorage.getItem(e) || "{}");
		return Object.fromEntries(Object.entries(t).map(([e, t]) => [e, typeof n[e] == "boolean" ? n[e] : t]));
	} catch {
		return t;
	}
}, de = () => ue("sofinder.tools.v3", ae), w = () => {
	try {
		let e = JSON.parse(localStorage.getItem("sofinder.viewSizes.v1") || "{}"), t = (e) => e === "small" || e === "medium" || e === "large";
		return {
			grid: t(e.grid) ? e.grid : oe.grid,
			list: t(e.list) ? e.list : oe.list
		};
	} catch {
		return oe;
	}
}, T = (e) => {
	let t = localStorage.getItem("sofinder.uiScale.v1");
	return t === "compact" || t === "standard" || t === "large" || t === "xlarge" ? t : e;
}, fe = (e) => {
	let t = localStorage.getItem("sofinder.uploadConflictStrategy.v1");
	return t === "ask" || t === "rename" || t === "overwrite" || t === "skip" ? t : e;
}, pe = () => localStorage.getItem("sofinder.folderNavigation.position.v1") === "right" ? "right" : "left", me = () => localStorage.getItem("sofinder.quickAccess.scope.v1") === "resource" ? "resource" : "all", he = {
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
}, E = {
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
}, D = {
	default: 100,
	min: 10,
	max: 500
}, ge = (e) => Math.max(D.min, Math.min(D.max, Math.trunc(e))), _e = () => {
	let e = Number(localStorage.getItem("sofinder.pageSize.v1"));
	return Number.isFinite(e) && e > 0 ? ge(e) : D.default;
}, ve = (e) => {
	let t = he[e], n = localStorage.getItem(`sofinder.column.${e}`);
	if (n === null || n.trim() === "") return t.initial;
	let r = Number(n);
	return Number.isFinite(r) ? Math.max(t.min, Math.min(t.max, r)) : t.initial;
}, ye = (e, t) => {
	let n = E[e];
	return Math.round(Math.max(n.min, Math.min(n.max, t)));
}, be = () => {
	try {
		let e = JSON.parse(localStorage.getItem("sofinder.listColumnWidths.v1") || "{}");
		return Object.fromEntries(Object.keys(E).map((t) => {
			let n = Number(e[t]);
			return [t, Number.isFinite(n) ? ye(t, n) : E[t].initial];
		}));
	} catch {
		return Object.fromEntries(Object.keys(E).map((e) => [e, E[e].initial]));
	}
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
	let [n, r] = (0, g.useState)(e), [i, a] = (0, g.useState)(t), [o, s] = (0, g.useState)(""), [c, l] = (0, g.useState)([]), [u, d] = (0, g.useState)(""), [f, p] = (0, g.useState)("name"), [m, h] = (0, g.useState)("name"), [_, v] = (0, g.useState)("asc"), [y, b] = (0, g.useState)(0), [x, ee] = (0, g.useState)(0), [te, S] = (0, g.useState)(null), [C, ne] = (0, g.useState)(null), [re, ie] = (0, g.useState)([]), ae = (0, g.useRef)(_e()).current, [oe, se] = (0, g.useState)(ae), [ce, le] = (0, g.useState)(String(ae)), ue = (0, g.useRef)(ae), [de, w] = (0, g.useState)(() => localStorage.getItem("sofinder.view") === "list" ? "list" : "grid"), [T, fe] = (0, g.useState)(!0), [pe, me] = (0, g.useState)(""), [he, E] = (0, g.useState)({});
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
		pageCursor: te,
		setPageCursor: S,
		nextCursor: C,
		setNextCursor: ne,
		cursorHistory: re,
		setCursorHistory: ie,
		pageSize: oe,
		setPageSize: se,
		pageSizeDraft: ce,
		setPageSizeDraft: le,
		pageSizeRef: ue,
		view: de,
		setView: w,
		loading: T,
		setLoading: fe,
		notice: pe,
		setNotice: me,
		directoryCapabilities: he,
		setDirectoryCapabilities: E,
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
//#region src/uploadNaming.ts
var O = (e, t) => {
	if (!t) return e;
	let n = e.lastIndexOf(".");
	return n > 0 && n < e.length - 1 ? e.slice(0, n + 1) + e.slice(n + 1).toLowerCase() : e;
}, we = (e, t) => t === e.name ? e : new File([e], t, {
	type: e.type,
	lastModified: e.lastModified
});
function Te({ api: e, resource: t, path: n, currentResource: r, currentDepth: i, autoCollapse: a, conflictStrategy: s, lowercaseExtensions: c, t: l, ask: u, chooseConflict: d, reload: f, setNotice: p, report: m }) {
	let [h, _] = (0, g.useState)([]), [v, b] = (0, g.useState)(!1), x = (0, g.useRef)(null), ee = (0, g.useRef)(null), te = (0, g.useRef)(/* @__PURE__ */ new Map()), S = (0, g.useRef)(/* @__PURE__ */ new Map()), C = (0, g.useRef)(0), ne = (0, g.useRef)(Promise.resolve()), re = (e) => {
		if (s !== "ask") return Promise.resolve(s);
		let t = ne.current.then(() => d(e));
		return ne.current = t.then(() => void 0, () => void 0), t;
	};
	(0, g.useEffect)(() => {
		let t = e.pendingUploads().map((e) => ({
			id: `pending-${e.id}`,
			name: e.name,
			progress: 0,
			status: "error",
			message: l("uploadReselectToResume")
		}));
		t.length > 0 && (_((e) => [...e.filter((e) => !e.id.startsWith("pending-")), ...t]), b(!1));
	}, [e, l]), (0, g.useEffect)(() => {
		if (!a || h.length === 0 || h.some((e) => e.status === "queued" || e.status === "uploading")) return;
		let e = window.setTimeout(() => b(!0), 1200);
		return () => window.clearTimeout(e);
	}, [a, h]);
	let ie = (e, t) => {
		_((n) => n.map((n) => n.id === e ? {
			...n,
			...t
		} : n));
	}, ae = async (i, a = n) => {
		let u = Array.from(i).map((e) => we(e, O(e.name, c))), d = r ? u.filter((e) => o(e.name, r.maxFileNameLength) === null) : u;
		d.length !== u.length && r && p(u.map((e) => o(e.name, r.maxFileNameLength)).filter((e) => e !== null).includes("tooLong") ? `${l("fileNameTooLong")} ${r.maxFileNameLength}` : l("invalidEntryName"));
		let m = d.map((n) => {
			let r = `${Date.now()}-${++C.current}`, i = new AbortController();
			te.current.set(r, i), S.current.set(r, {
				file: n,
				targetPath: a
			});
			let o = e.findPendingUpload(t, a, n, !1);
			return {
				id: r,
				file: n,
				controller: i,
				pendingId: o ? `pending-${o.id}` : null
			};
		});
		if (m.length === 0) return;
		b(!1);
		let h = new Set(m.map((e) => e.pendingId).filter((e) => e !== null));
		_((e) => [...e.filter((e) => !h.has(e.id)), ...m.map(({ id: e, file: t, pendingId: n }) => ({
			id: e,
			name: t.name,
			progress: 0,
			status: "queued",
			message: n ? l("uploadResuming") : void 0
		}))]);
		let g = 0, v = async () => {
			for (; g < m.length;) {
				let n = m[g++];
				if (n.controller.signal.aborted) {
					te.current.delete(n.id);
					continue;
				}
				ie(n.id, {
					status: "uploading",
					progress: 0,
					message: void 0
				});
				let r = s === "overwrite", i = s === "rename";
				try {
					for (;;) try {
						await e.upload(t, a, n.file, {
							overwrite: r,
							autoRename: i,
							signal: n.controller.signal,
							onProgress: (e) => ie(n.id, { progress: e })
						}), ie(n.id, {
							status: "done",
							progress: 100
						});
						break;
					} catch (e) {
						if (e instanceof y && e.code === "conflict" && !r && !i) {
							let e = await re(n.file.name);
							if (e === "skip") {
								ie(n.id, {
									status: "skipped",
									progress: 0,
									message: l("uploadConflictSkip")
								});
								break;
							}
							r = e === "overwrite", i = e === "rename", ie(n.id, { progress: 0 });
							continue;
						}
						throw e;
					}
				} catch (e) {
					ie(n.id, e instanceof DOMException && e.name === "AbortError" ? {
						status: "cancelled",
						message: l("cancelled")
					} : {
						status: "error",
						message: e instanceof Error ? e.message : l("error")
					});
				} finally {
					te.current.delete(n.id);
				}
			}
		};
		await Promise.all(Array.from({ length: Math.min(3, m.length) }, () => v())), await f();
	}, oe = async (a) => {
		if (!r) return;
		let s = Array.from(a);
		if (s.length > 500) {
			p(l("folderUploadTooMany"));
			return;
		}
		let c = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Map();
		for (let e of s) {
			let t = e.webkitRelativePath.replace(/\\/g, "/").split("/").filter(Boolean);
			if (t.length < 2 || t.some((e) => o(e, e === t.at(-1) ? r.maxFileNameLength : r.maxFolderNameLength) !== null)) {
				p(l("invalidEntryName"));
				return;
			}
			let a = t.slice(0, -1);
			if (i + a.length > r.maxFolderDepth) {
				p(l("folderDepthReached"));
				return;
			}
			a.forEach((e, t) => c.add(a.slice(0, t + 1).join("/")));
			let s = [n, ...a].filter(Boolean).join("/");
			d.set(s, [...d.get(s) || [], e]);
		}
		let f = Array.from(c).filter((e) => !e.includes("/")).slice(0, 5);
		if (await u({
			title: l("uploadFolder"),
			message: `${s.length} ${l("files")} · ${c.size} ${l("folder")}`,
			detail: `${l("folderUploadPreview")}: ${f.join(", ")}${Array.from(c).filter((e) => !e.includes("/")).length > f.length ? "…" : ""}`
		})) try {
			for (let r of Array.from(c).sort((e, t) => e.split("/").length - t.split("/").length || e.localeCompare(t))) {
				let i = r.split("/"), a = i.pop() || "", o = [n, ...i].filter(Boolean).join("/");
				try {
					await e.createFolder(t, o, a);
				} catch (e) {
					if (!(e instanceof y) || e.code !== "conflict") throw e;
				}
			}
			for (let [e, t] of d) await ae(t, e);
		} catch (e) {
			m(e);
		}
	}, se = (e) => {
		te.current.get(e)?.abort(), ie(e, {
			status: "cancelled",
			message: l("cancelled")
		});
	}, ce = () => {
		te.current.forEach((e) => e.abort()), _((e) => e.map((e) => e.status === "queued" || e.status === "uploading" ? {
			...e,
			status: "cancelled",
			message: l("cancelled")
		} : e));
	}, le = (e) => {
		te.current.get(e)?.abort(), te.current.delete(e), S.current.delete(e), _((t) => t.filter((t) => t.id !== e));
	};
	return {
		uploads: h,
		uploadsCollapsed: v,
		setUploadsCollapsed: b,
		uploadInput: x,
		directoryUploadInput: ee,
		upload: ae,
		uploadTo: (e, t) => ae(t, e),
		uploadDirectory: oe,
		cancelUpload: se,
		cancelAllUploads: ce,
		removeUploadTask: le,
		retryUpload: (e) => {
			let t = S.current.get(e);
			t && (le(e), ae([t.file], t.targetPath));
		},
		clearFinishedUploads: () => {
			let e = new Set(h.filter((e) => e.status === "queued" || e.status === "uploading").map((e) => e.id));
			S.current.forEach((t, n) => {
				e.has(n) || S.current.delete(n);
			}), _((e) => e.filter((e) => e.status === "queued" || e.status === "uploading"));
		}
	};
}
//#endregion
//#region src/pluginUi.ts
var Ee = (e, t) => e.label[t] || e.label.en, De = (e, t) => {
	if (e.directory) return null;
	let n = e.mimeType?.toLowerCase() || "", r = e.name.includes(".") && e.name.split(".").pop()?.toLowerCase() || "";
	return t.find((e) => e.extensions.includes(r) || e.mimeTypes.some((e) => e === n || e.endsWith("/*") && n.startsWith(e.slice(0, -1)))) || null;
}, Oe = (e, t, n) => {
	let r = De(e, t);
	if (!r) return null;
	let i = new URL(r.url, window.location.href);
	return i.searchParams.set("resource", n), i.searchParams.set("path", e.path), i.toString();
}, ke = (e, t) => e.selection === "none" ? t === null : !t || e.selection === "file" && t.directory || e.selection === "image" && (t.directory || !t.mimeType?.startsWith("image/")) ? !1 : t.capabilities?.[e.requires] !== !1, Ae = /* @__PURE__ */ new Set([
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
]), je = /* @__PURE__ */ new Set([
	"zip",
	"rar",
	"7z",
	"tar",
	"gz",
	"bz2",
	"xz"
]), Me = (e) => e.name.includes(".") ? e.name.split(".").pop().toLowerCase() : "";
function Ne(e) {
	if (e.directory) return "folder";
	let t = (e.mimeType || "").toLowerCase(), n = Me(e);
	return t.startsWith("image/") ? "image" : t.startsWith("audio/") ? "audio" : t.startsWith("video/") ? "video" : t.startsWith("text/") || t.includes("document") || t.includes("sheet") || t.includes("presentation") || Ae.has(n) ? "document" : t.includes("zip") || t.includes("compressed") || t.includes("archive") || je.has(n) ? "archive" : "other";
}
function Pe(e, t) {
	return t === "all" ? e : e.filter((e) => Ne(e) === t);
}
function Fe(e, t, n, r = Date.now()) {
	if (t === "none") return [{
		key: "all",
		label: "",
		entries: e
	}];
	let i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let [e, o] = Ie(a, t, n, r), s = `${e}\0${o}`;
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
function Ie(e, t, n, r) {
	if (t === "type") {
		let t = Ne(e);
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
var Le = (0, g.lazy)(() => import("./ImageEditor-UI78vCJ4.js").then((e) => ({ default: e.ImageEditor }))), Re = (0, g.lazy)(() => import("./ImageProcessDialog-Aq1ZM9V6.js").then((e) => ({ default: e.ImageProcessDialog }))), ze = (0, g.lazy)(() => import("./SecurityStatusDialog-DVX5Nztn.js").then((e) => ({ default: e.SecurityStatusDialog }))), Be = (0, g.lazy)(() => import("./DocumentPreviewPane-DhmHG-pU.js")), Ve = (0, g.lazy)(() => import("./SettingsDialog-Bg5uGPeC.js").then((e) => ({ default: e.SettingsDialog }))), He = (0, g.lazy)(() => import("./DestinationDialog-BHVkDHLP.js").then((e) => ({ default: e.DestinationDialog }))), Ue = (0, g.lazy)(() => import("./BulkRenameDialog-CyN0IBjp.js").then((e) => ({ default: e.BulkRenameDialog }))), We = (0, g.lazy)(() => import("./TrashDialog-HQDbFSwF.js").then((e) => ({ default: e.TrashDialog }))), Ge = (0, g.lazy)(() => import("./TagsDialog-DFQ9ckXY.js").then((e) => ({ default: e.TagsDialog }))), Ke = (0, g.lazy)(() => import("./FolderTree-CmQzaPks.js").then((e) => ({ default: e.FolderTree }))), qe = (0, g.lazy)(() => import("./DetailsPanel-D6h8EgXg.js").then((e) => ({ default: e.DetailsPanel }))), Je = (0, g.lazy)(() => import("./ShareDialog-CB4j2Ekj.js")), Ye = (0, g.lazy)(() => import("./FavoritesPage-DOAEEtVv.js")), Xe = (0, g.lazy)(() => import("./MetadataSidebarPanels-CZ_bAocx.js")), Ze = (0, g.lazy)(() => import("./MetadataSidebarPanels-CZ_bAocx.js").then((e) => ({ default: e.RecentPanel }))), Qe = (0, g.lazy)(() => import("./ContextMenu-B5qP5e8D.js").then((e) => ({ default: e.ContextMenu }))), $e = (0, g.lazy)(() => import("./UploadQueue-EzYhnrud.js").then((e) => ({ default: e.UploadQueue }))), et = (0, g.lazy)(() => import("./ImagePreviewPane-D5O_-Lqv.js")), tt = (0, g.lazy)(() => import("./AssetMetadataDialog-DyQpAmp1.js").then((e) => ({ default: e.AssetMetadataDialog }))), nt = () => {
	let e = localStorage.getItem("sofinder.groupMode.v1");
	return e === "name" || e === "type" || e === "size" || e === "modified" || e === "tags" ? e : "none";
}, rt = () => {
	let e = localStorage.getItem("sofinder.typeFilter.v1");
	return e === "folder" || e === "image" || e === "document" || e === "audio" || e === "video" || e === "archive" || e === "other" ? e : "all";
};
function it({ config: e, initialMessages: t }) {
	let n = (0, g.useId)(), r = (0, g.useMemo)(() => new b(e), [e]), o = e.uiDefaults.mode ?? (e.selectMode ? "picker" : "manager"), u = e.featureAvailability ?? le, [d, f] = (0, g.useState)(() => {
		let t = localStorage.getItem("sofinder.language");
		return t === "en" || t === "zh-cn" || t === "zh-tw" ? t : e.language;
	}), [p, m] = (0, g.useState)(t), h = (0, g.useMemo)(() => te(p), [p]), _ = (0, g.useMemo)(() => new Intl.DateTimeFormat(d, {
		dateStyle: "medium",
		timeStyle: "short"
	}), [d]), [v, x] = (0, g.useState)([]), { resource: S, setResource: _e, path: O, setPath: we, resolvedPath: Ae, setResolvedPath: je, entries: Me, setEntries: Ne, search: Ie, setSearch: it, searchMode: ot, setSearchMode: st, sort: ct, setSort: lt, direction: ut, setDirection: dt, offset: ft, setOffset: pt, total: mt, setTotal: ht, pageCursor: gt, setPageCursor: _t, nextCursor: vt, setNextCursor: yt, cursorHistory: bt, setCursorHistory: xt, pageSize: St, setPageSize: Ct, pageSizeDraft: wt, setPageSizeDraft: Tt, pageSizeRef: Et, view: Dt, setView: Ot, loading: kt, setLoading: At, notice: jt, setNotice: k, directoryCapabilities: Mt, setDirectoryCapabilities: Nt, loadSequence: Pt, historyReady: Ft, restoringHistory: It, searchInitialized: Lt } = Se(e.resource, e.initialPath || ""), [Rt, zt] = (0, g.useState)({
		favorites: [],
		quickAccess: [],
		quickAccessEntries: [],
		tags: {},
		recent: []
	}), [Bt, Vt] = (0, g.useState)({}), [A, Ht] = (0, g.useState)(() => new URL(window.location.href).searchParams.get("collection") === "favorites" ? "favorites" : null), [Ut, Wt] = (0, g.useState)(null), [Gt, Kt] = (0, g.useState)(() => e.uiDefaults.fullTools ? {
		resize: !0,
		crop: !0,
		rotate: !0,
		presets: !0,
		process: !0,
		batchRename: !0
	} : de()), [j, qt] = (0, g.useState)(() => {
		let t = ue("sofinder.features.v2", {
			...se,
			folderTree: e.featureDefaults?.folderTree ?? !1
		});
		return {
			...t,
			folderTree: u.folderTree !== !1 && t.folderTree,
			recent: u.recent !== !1 && t.recent,
			favorites: u.favorites !== !1 && t.favorites,
			quickAccessFiles: u.quickAccessFiles !== !1 && t.quickAccessFiles,
			tags: u.tags !== !1 && t.tags,
			archive: u.archive !== !1 && t.archive,
			trash: u.trash !== !1 && t.trash,
			qrCode: u.qrCode !== !1 && t.qrCode
		};
	}), [Jt, Yt] = (0, g.useState)(() => ue("sofinder.listColumns.v1", ce)), [Xt, Zt] = (0, g.useState)(be), [Qt, $t] = (0, g.useState)(w), [en, tn] = (0, g.useState)(pe), [nn, rn] = (0, g.useState)(me), [an, on] = (0, g.useState)(!1), [sn, cn] = (0, g.useState)(!1), [ln, un] = (0, g.useState)(!1), [dn, fn] = (0, g.useState)(!1), [pn, mn] = (0, g.useState)(nt), [hn, gn] = (0, g.useState)(rt), [_n, vn] = (0, g.useState)(() => T(e.uiDefaults?.scale ?? "standard")), [yn, bn] = (0, g.useState)(() => fe(e.uiDefaults.uploadConflictStrategy ?? "ask")), xn = e.uiDefaults.lowercaseUploadExtensions ?? !0, { destinationDialog: Sn, setDestinationDialog: Cn, bulkRenameOpen: wn, setBulkRenameOpen: Tn } = Ce(), [En, Dn] = (0, g.useState)(!1), [On, kn] = (0, g.useState)(!1), [An, jn] = (0, g.useState)(null), [Mn, Nn] = (0, g.useState)(null), [Pn, Fn] = (0, g.useState)(null), [In, Ln] = (0, g.useState)(!1), [Rn, zn] = (0, g.useState)(!1), [Bn, Vn] = (0, g.useState)(null), [Hn, Un] = (0, g.useState)(null), [M, Wn] = (0, g.useState)(null), [Gn, Kn] = (0, g.useState)(null), [qn, Jn] = (0, g.useState)(null), [Yn, Xn] = (0, g.useState)(null), [Zn, Qn] = (0, g.useState)({}), [$n, er] = (0, g.useState)({
		driver: "",
		formats: []
	}), [tr, nr] = (0, g.useState)([]), [rr, ir] = (0, g.useState)({
		enabled: !1,
		defaultTtlSeconds: 300,
		maxTtlSeconds: 3600
	}), [ar, or] = (0, g.useState)(!1), [sr, cr] = (0, g.useState)([
		"en",
		"zh-cn",
		"zh-tw"
	]), [lr, ur] = (0, g.useState)(null), [dr, fr] = (0, g.useState)(() => ve("left")), [pr, mr] = (0, g.useState)(() => ve("right")), hr = (0, g.useRef)(null), gr = (0, g.useRef)(null), _r = (0, g.useRef)(null), vr = (0, g.useRef)(null), yr = (0, g.useRef)(null), br = (0, g.useRef)(null), xr = (0, g.useRef)(null), Sr = (0, g.useRef)(null), Cr = (0, g.useRef)(null), wr = (0, g.useRef)(S), Tr = (0, g.useRef)({}), Er = (0, g.useRef)({}), Dr = (0, g.useRef)(null);
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
	}, [e.theme]), (0, g.useEffect)(() => (document.documentElement.dataset.sofinderScale = _n, localStorage.setItem("sofinder.uiScale.v1", _n), () => {
		delete document.documentElement.dataset.sofinderScale;
	}), [_n]), (0, g.useEffect)(() => {
		localStorage.setItem("sofinder.uploadConflictStrategy.v1", yn);
	}, [yn]), (0, g.useEffect)(() => {
		localStorage.setItem("sofinder.language", d), document.documentElement.lang = d === "zh-cn" ? "zh-CN" : d === "zh-tw" ? "zh-TW" : "en";
		let e = !0;
		return ee(d).then((t) => {
			e && m(t);
		}), () => {
			e = !1;
		};
	}, [d]), (0, g.useEffect)(() => {
		if (!ln) return;
		let e = (e) => {
			e.target instanceof Node && !xr.current?.contains(e.target) && un(!1);
		}, t = (e) => {
			e.key === "Escape" && (e.preventDefault(), un(!1), Sr.current?.focus());
		};
		return document.addEventListener("pointerdown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("keydown", t);
		};
	}, [ln]), (0, g.useEffect)(() => {
		if (!dn) return;
		let e = (e) => {
			e.target instanceof Node && !Cr.current?.contains(e.target) && fn(!1);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [dn]);
	let N = (0, g.useCallback)((e) => k(e instanceof Error ? e.message : h("error")), [h]), Or = (0, g.useCallback)((e, t, n) => (Tr.current[e] || 0) === n && (wr.current === e && zt(t), Vt((n) => ({
		...n,
		[e]: t.quickAccessEntries
	})), !0), []), kr = (0, g.useCallback)(async (e, t = !1) => {
		if (!e || !t && (Er.current[e] || 0) > 0) return null;
		let n = (Tr.current[e] || 0) + 1;
		Tr.current[e] = n;
		let i = await r.metadata(e);
		return Or(e, i, n), i;
	}, [r, Or]), Ar = (0, g.useCallback)(async (e, t, n, i = {}) => {
		let a = (Tr.current[e] || 0) + 1;
		Tr.current[e] = a, Er.current[e] = (Er.current[e] || 0) + 1;
		try {
			let o = await r.updateMetadata(e, t, n, i);
			return Or(e, o, a), Dr.current?.postMessage({ resource: e }), o;
		} finally {
			Er.current[e] = Math.max(0, (Er.current[e] || 1) - 1), Er.current[e] === 0 && (Tr.current[e] || 0) !== a && kr(e, !0).catch(N);
		}
	}, [
		r,
		Or,
		kr,
		N
	]);
	(0, g.useEffect)(() => {
		wr.current = S;
	}, [S]), (0, g.useEffect)(() => {
		if (!("BroadcastChannel" in window)) return;
		let e;
		try {
			e = new BroadcastChannel("sofinder-metadata-v1");
		} catch {
			return;
		}
		return Dr.current = e, e.onmessage = (e) => {
			let t = typeof e.data?.resource == "string" ? e.data.resource : "";
			t && kr(t).catch(N);
		}, () => {
			Dr.current = null, e.close();
		};
	}, [kr, N]);
	let jr = (0, g.useCallback)((e) => new Promise((t) => {
		hr.current?.(!1), hr.current = t, Nn(e);
	}), []), Mr = (e) => {
		let t = hr.current;
		hr.current = null, Nn(null), t?.(e);
	}, Nr = (0, g.useCallback)((e) => new Promise((t) => {
		gr.current?.("skip"), gr.current = t, Fn(e);
	}), []), Pr = (e) => {
		let t = gr.current;
		gr.current = null, Fn(null), t?.(e);
	}, P = (0, g.useCallback)(async (e = S, t = O, n = Ie, i = ft, a = ct, o = ut, s = ot, c = gt) => {
		if (!e) return "error";
		let l = ++Pt.current;
		At(!0), k("");
		try {
			let u = await r.list(e, t, n, a, o, i, Et.current, s, c);
			return l === Pt.current ? (Ne(u.entries), we(u.path), je(u.path), pt(u.offset), ht(u.total), _t(c), yt(u.nextCursor ?? null), Nt(u.capabilities || {}), ti(/* @__PURE__ */ new Set()), ri(null), "ok") : "stale";
		} catch (n) {
			if (l !== Pt.current) return "stale";
			if (n instanceof y && n.code === "not_found" && t !== "") try {
				let t = await r.list(e, "", "", a, o, 0, Et.current, "name", null);
				return l === Pt.current ? (Ne(t.entries), we(t.path), je(t.path), pt(t.offset), ht(t.total), _t(null), yt(t.nextCursor ?? null), Nt(t.capabilities || {}), ti(/* @__PURE__ */ new Set()), ri(null), xt([]), k(h("missingPathFallback")), "not_found") : "stale";
			} catch (e) {
				n = e;
			}
			return Ne([]), we(t), pt(i), ht(null), _t(c), yt(null), Nt({}), ti(/* @__PURE__ */ new Set()), ri(null), N(n), "error";
		} finally {
			l === Pt.current && At(!1);
		}
	}, [
		r,
		ut,
		ft,
		gt,
		O,
		N,
		S,
		Ie,
		ot,
		ct,
		h
	]), F = v.find((e) => e.name === S), Fr = O === "" ? 0 : O.split("/").length, { uploads: Ir, uploadsCollapsed: Lr, setUploadsCollapsed: Rr, uploadInput: zr, directoryUploadInput: Br, upload: Vr, uploadTo: Hr, uploadDirectory: Ur, cancelUpload: Wr, cancelAllUploads: Gr, removeUploadTask: Kr, retryUpload: qr, clearFinishedUploads: Jr } = Te({
		api: r,
		resource: S,
		path: O,
		currentResource: F,
		currentDepth: Fr,
		autoCollapse: j.autoCollapseUploads,
		conflictStrategy: yn,
		lowercaseExtensions: xn,
		t: h,
		ask: jr,
		chooseConflict: Nr,
		reload: async () => {
			await P();
		},
		setNotice: k,
		report: N
	});
	(0, g.useEffect)(() => {
		r.configData().then(({ resources: t, plugins: n, imagePresets: r, imageCapabilities: i, signedUrls: a, assetCatalog: o }) => {
			x(t), nr(n || []), or(o?.enabled === !0), cr(o?.altLocales?.length ? o.altLocales : [
				"en",
				"zh-cn",
				"zh-tw"
			]), Qn(r || {}), er(i || {
				driver: "",
				formats: []
			}), ir(a || {
				enabled: !1,
				defaultTtlSeconds: 300,
				maxTtlSeconds: 3600
			});
			let s = t.some((t) => t.name === e.resource) ? e.resource : t[0]?.name || "";
			_e(s), s && (xt([]), P(s, e.initialPath || "", "", 0, ct, ut, "name", null));
		}).catch(N);
	}, [
		r,
		e.initialPath,
		e.resource
	]), (0, g.useEffect)(() => {
		let t = () => {
			let t = new URL(window.location.href), n = t.searchParams.get("type") || e.resource, r = t.searchParams.get("path") || "", i = t.searchParams.get("collection") === "favorites" ? "favorites" : null;
			It.current = !0, _e(n), Ht(i), it(""), st("name"), xt([]), i === null && P(n, r, "", 0, "name", "asc", "name", null);
		};
		return window.addEventListener("popstate", t), () => window.removeEventListener("popstate", t);
	}, [e.resource, P]), (0, g.useEffect)(() => {
		if (!S || kt) return;
		let e = new URL(window.location.href), t = e.searchParams.get("type") || "", n = e.searchParams.get("path") || "", r = e.searchParams.get("collection") === "favorites" ? "favorites" : null;
		if (t === S && n === O && r === A) {
			Ft.current = !0, It.current = !1;
			return;
		}
		e.searchParams.set("type", S), O ? e.searchParams.set("path", O) : e.searchParams.delete("path"), A ? e.searchParams.set("collection", A) : e.searchParams.delete("collection");
		let i = {
			...window.history.state || {},
			sofinder: {
				resource: S,
				path: O,
				collection: A
			}
		};
		!Ft.current || It.current ? window.history.replaceState(i, "", e) : window.history.pushState(i, "", e), Ft.current = !0, It.current = !1;
	}, [
		A,
		kt,
		O,
		S
	]), (0, g.useEffect)(() => {
		if (!Lt.current) {
			Lt.current = !0;
			return;
		}
		if (A) return;
		let e = window.setTimeout(() => {
			S && (xt([]), P(S, O, Ie, 0, ct, ut, ot, null));
		}, 250);
		return () => window.clearTimeout(e);
	}, [Ie, ot]), (0, g.useEffect)(() => {
		if (S) {
			if (!j.recent && !j.favorites && u.quickAccess === !1 && !j.tags) {
				zt({
					favorites: [],
					quickAccess: [],
					quickAccessEntries: [],
					tags: {},
					recent: []
				});
				return;
			}
			kr(S).catch(N);
		}
	}, [
		u.quickAccess,
		j.favorites,
		j.recent,
		j.tags,
		kr,
		N,
		S
	]), (0, g.useEffect)(() => {
		u.quickAccess === !1 || !j.sidebarQuickAccess || nn !== "all" || Promise.all(v.filter((e) => e.name !== S).map((e) => kr(e.name))).catch(N);
	}, [
		u.quickAccess,
		j.sidebarQuickAccess,
		kr,
		nn,
		N,
		S,
		v
	]), (0, g.useEffect)(() => {
		if (u.quickAccess === !1 || !j.sidebarQuickAccess) return;
		let e = window.setInterval(() => Object.entries(Bt).forEach(([e, t]) => {
			t.length > 0 && kr(e).catch(N);
		}), 6e4);
		return () => window.clearInterval(e);
	}, [
		u.quickAccess,
		j.sidebarQuickAccess,
		kr,
		Bt,
		N
	]), (0, g.useEffect)(() => {
		!j.favorites && A === "favorites" && Ht(null);
	}, [A, j.favorites]), (0, g.useEffect)(() => {
		let e = (e) => {
			let t = Array.from(e.clipboardData?.files || []);
			t.length > 0 && A === null && !F?.readOnly && Mt.upload !== !1 && (e.preventDefault(), Vr(t));
		};
		return window.addEventListener("paste", e), () => window.removeEventListener("paste", e);
	}, [
		A,
		F?.readOnly,
		Mt.upload,
		Vr
	]);
	let Yr = (0, g.useMemo)(() => O === "" ? [] : O.split("/"), [O]), Xr = (0, g.useCallback)((e) => {
		j.recent && Ar(S, e.path, "touch").catch(N);
	}, [
		j.recent,
		Ar,
		N,
		S
	]), Zr = (0, g.useMemo)(() => Pe(Me, hn), [Me, hn]), Qr = pn === "tags" && !j.tags ? "none" : pn, $r = (0, g.useMemo)(() => Fe(Zr, Qr, Rt.tags), [
		Zr,
		Qr,
		Rt.tags
	]), I = (0, g.useMemo)(() => $r.flatMap((e) => e.entries), [$r]), { selectedPaths: ei, setSelectedPaths: ti, selectionAnchor: ni, setSelectionAnchor: ri, selectedEntries: L, selected: R, selectEntry: ii } = xe(I, o === "picker", Xr), ai = (e) => $n.formats.find((t) => e.mimeType !== null && t.mimes.includes(e.mimeType.toLowerCase())), oi = (e) => !!(e && ai(e)?.thumbnail), si = (e) => !!(e && ai(e)?.edit), ci = L.filter((e) => si(e)), li = (t) => !!(t && !t.directory && t.url && (e.selectionKind !== "image" || ai(t)?.webEmbeddable)), ui = async (e) => {
		if (e.directory) return null;
		if (F?.entryUrlConfigured && e.url) return {
			url: new URL(e.url, document.baseURI).href,
			loginRequired: !0
		};
		if (rr.enabled && F?.deliveryMode === "proxy") {
			let t = await r.signedUrl(S, e.path, rr.defaultTtlSeconds);
			return {
				url: t.url,
				loginRequired: !1,
				expiresAt: t.expiresAt
			};
		}
		return {
			url: new URL(e.url || r.downloadUrl(S, e.path), document.baseURI).href,
			loginRequired: !e.url
		};
	}, di = async (e) => {
		try {
			let t = await ui(e);
			t && Xn({
				...t,
				fileName: e.name
			});
		} catch (e) {
			N(e);
		}
	}, fi = async (e) => {
		try {
			let t = await r.resolveAsset(S, e.path);
			if (!t.asset.assetId) return;
			ur(await r.asset(t.asset.assetId));
		} catch (e) {
			N(e);
		}
	}, pi = (e) => L.length > 0 && L.every((t) => t.capabilities?.[e] !== !1), mi = j.quickAccessFiles, hi = (e) => !!(e && (e.directory || Rt.quickAccess.includes(e.path) || mi)), gi = (0, g.useMemo)(() => tr.flatMap((e) => (e.uiActions || []).map((t) => ({
		...t,
		plugin: e.name
	}))), [tr]), _i = (0, g.useMemo)(() => tr.flatMap((e) => (e.previewers || []).map((t) => ({
		...t,
		plugin: e.name
	}))), [tr]), vi = (e, t) => {
		if (!ke(e, t)) return;
		let n = new URL(e.url, document.baseURI);
		n.searchParams.set("resource", S), n.searchParams.set("directory", O), t && n.searchParams.set("path", t.path), window.open(n, "_blank", "noopener");
	};
	(0, g.useEffect)(() => {
		if (Wt(null), !R || !ai(R)?.read) return;
		let e = !0;
		return r.imageInfo(S, R.path).then((t) => {
			e && Wt(t);
		}).catch((t) => {
			e && N(t);
		}), () => {
			e = !1;
		};
	}, [
		r,
		S,
		R?.path,
		R?.mimeType,
		N
	]), (0, g.useEffect)(() => {
		if (Kn(null), Jn(null), u.textPreview === !1 || !M || !at(M.mimeType)) return;
		let e = !0;
		return r.textPreview(S, M.path).then((t) => {
			e && Kn({
				path: M.path,
				content: t.content,
				truncated: t.truncated
			});
		}).catch((t) => {
			e && N(t);
		}), () => {
			e = !1;
		};
	}, [
		r,
		u.textPreview,
		M?.path,
		M?.mimeType,
		N,
		S
	]);
	let yi = (e) => {
		e.directory ? (xt([]), P(S, e.path, Ie, 0, ct, ut, ot, null)) : Ei(e);
	}, bi = async () => {
		F && jn({
			kind: "folder",
			title: h("newFolder"),
			label: h("folderName"),
			initial: "",
			maximum: F.maxFolderNameLength
		});
	}, xi = async () => {
		if (!R || !F) return;
		let e = R.directory ? -1 : R.name.lastIndexOf("."), t = e > 0 ? R.name.slice(e) : "", n = t ? R.name.slice(0, e) : R.name, r = R.directory ? F.maxFolderNameLength : F.maxFileNameLength;
		jn({
			kind: "rename",
			title: h("rename"),
			label: h(t ? "newBaseName" : "newName"),
			initial: n,
			maximum: r,
			extension: t
		});
	}, Si = async () => {
		if (!(L.length === 0 || !await jr({
			title: h("remove"),
			message: L.length === 1 ? h("confirmDelete") : `${h("confirmDeleteMany")} ${L.length}`,
			detail: F?.storageCapabilities?.recoverableDelete === !1 ? h("permanentDeleteWarning") : h("trashRetention"),
			danger: !0
		}))) try {
			let e = await r.batch("delete", S, L.map((e) => e.path)), t = e.failed === 0 ? `${e.succeeded} ${h("completed")}` : `${e.succeeded} ${h("completed")}, ${e.failed} ${h("failed")}`;
			await P(), k(e.purgedItems > 0 ? `${t} · ${h("trashAutoPurged")} ${e.purgedItems} ${h("items")} (${l(e.purgedBytes)})` : t);
		} catch (e) {
			N(e);
		}
	}, Ci = async (e) => {
		Tn(!1);
		try {
			let t = await r.batchRename(S, e);
			await P(), k(t.failed === 0 ? `${t.succeeded} ${h("completed")}` : `${t.succeeded} ${h("completed")}, ${t.failed} ${h("failed")}`);
		} catch (e) {
			N(e);
		}
	}, wi = async (e, t) => {
		try {
			let n = await r.batch(e, S, L.map((e) => e.path), t);
			Cn(null), await P(), k(n.failed === 0 ? `${n.succeeded} ${h("completed")}` : `${n.succeeded} ${h("completed")}, ${n.failed} ${h("failed")}`);
		} catch (e) {
			N(e);
		}
	}, Ti = async (e, t) => {
		Cn({
			operation: e,
			path: t,
			folders: [],
			loading: !0
		});
		try {
			let n = await r.list(S, t, "", "name", "asc", 0, 500);
			Cn({
				operation: e,
				path: n.path,
				folders: n.entries.filter((e) => e.directory),
				loading: !1
			});
		} catch (n) {
			if (n instanceof y && n.code === "not_found" && t !== "") try {
				let t = await r.list(S, "", "", "name", "asc", 0, 500);
				Cn({
					operation: e,
					path: t.path,
					folders: t.entries.filter((e) => e.directory),
					loading: !1
				}), k(h("missingDestinationFallback"));
				return;
			} catch (e) {
				n = e;
			}
			Cn((e) => e ? {
				...e,
				loading: !1
			} : null), N(n);
		}
	}, Ei = async (t = R) => {
		if (!li(t)) {
			t && e.selectionKind === "image" && k(h("webImageUnsupported"));
			return;
		}
		if (!t?.url) return;
		let n = t === R ? Ut : null;
		if (ai(t)?.read && n === null) try {
			n = await r.imageInfo(S, t.path);
		} catch {
			n = null;
		}
		let i = {
			...t,
			resource: S,
			url: t.url,
			width: n?.width ?? null,
			height: n?.height ?? null
		};
		if (ar) try {
			i = {
				...i,
				...(await r.resolveAsset(S, t.path)).asset
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
				entry: i
			}, e.pickerOrigin), window.opener && window.close();
			return;
		}
		window.dispatchEvent(new CustomEvent("sofinder:select", { detail: i }));
	}, Di = () => {
		ti(new Set(I.map((e) => e.path))), ri(null);
	}, Oi = () => {
		ti(/* @__PURE__ */ new Set()), ri(null);
	}, ki = () => {
		ti((e) => new Set(I.filter((t) => !e.has(t.path)).map((e) => e.path))), ri(null);
	}, Ai = async (e, t = 0, n = 0) => {
		if (!(!R || !si(R))) {
			At(!0);
			try {
				let i = e === 0 ? [{
					type: "resize",
					width: t,
					height: n
				}] : [{
					type: "rotate",
					degrees: e
				}], a = await r.applyImageActions(S, R.path, i, { mode: "copy" });
				k(`${h("imageCreated")}: ${a.entry.name} · ${a.result.width} × ${a.result.height} px`), await P();
			} catch (e) {
				N(e), At(!1);
			}
		}
	}, ji = () => {
		R && jn({
			kind: "resize",
			title: h("resize"),
			label: h("resizePrompt"),
			initial: "1200x1200",
			maximum: 9
		});
	}, Mi = () => {
		!R || !Ut || Dn(!0);
	}, Ni = (e, t) => {
		Kt((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.tools.v3", JSON.stringify(r)), r;
		});
	}, z = (e, t) => {
		(e === "autoCollapseUploads" || e === "sidebarFavorites" || e === "sidebarQuickAccess" || u[e] !== !1) && qt((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.features.v2", JSON.stringify(r)), r;
		});
	}, B = (e, t) => {
		Yt((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.listColumns.v1", JSON.stringify(r)), r;
		});
	}, Pi = (e, t) => {
		$t((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.viewSizes.v1", JSON.stringify(r)), r;
		});
	}, Fi = (e) => {
		tn(e), localStorage.setItem("sofinder.folderNavigation.position.v1", e);
	}, Ii = async () => {
		if (L.length !== 0) try {
			let e = await r.downloadArchive(S, L.map((e) => e.path)), t = URL.createObjectURL(e), n = document.createElement("a");
			n.href = t, n.download = "sofinder-download.zip", n.click(), window.setTimeout(() => URL.revokeObjectURL(t), 1e3);
		} catch (e) {
			N(e);
		}
	}, Li = async (e = R) => {
		if (e) try {
			await Ar(S, e.path, "favorite", { favorite: !Rt.favorites.includes(e.path) });
		} catch (e) {
			N(e);
		}
	}, Ri = async (e = R) => {
		if (e && !(!e.directory && !Rt.quickAccess.includes(e.path) && !mi)) try {
			await Ar(S, e.path, "quick_access", { pinned: !Rt.quickAccess.includes(e.path) });
		} catch (e) {
			N(e);
		}
	}, zi = async () => {
		R && zn(!0);
	}, Bi = async (e) => {
		let t = An;
		if (jn(null), t) try {
			if (t.kind === "folder") await r.createFolder(S, O, e);
			else if (t.kind === "rename" && R && e !== R.name) await r.rename(S, R.path, e);
			else if (t.kind === "resize") {
				let t = /^(\d{1,4})[x×](\d{1,4})$/i.exec(e.replace(/\s/g, ""));
				if (!t) {
					k(h("invalidDimensions"));
					return;
				}
				await Ai(0, Number(t[1]), Number(t[2]));
			}
			(t.kind === "folder" || t.kind === "rename") && await P();
		} catch (e) {
			N(e);
		}
	}, Vi = async (e) => {
		let t = e.includes("/") ? e.slice(0, e.lastIndexOf("/")) : "", n = e.split("/").pop() || e;
		try {
			if (!(await r.list(S, t, n, "name", "asc", 0, 500)).entries.some((t) => t.path === e)) {
				await Ar(S, e, "forget"), k(h("recentMissing"));
				return;
			}
			await P(S, t, "", 0), ti(/* @__PURE__ */ new Set([e]));
		} catch (t) {
			if (t instanceof y && t.code === "not_found") {
				try {
					await Ar(S, e, "forget");
				} catch (e) {
					N(e);
					return;
				}
				k(h("recentMissing"));
				return;
			}
			N(t);
		}
	}, Hi = (e) => {
		Ot(e), localStorage.setItem("sofinder.view", e);
	}, Ui = (e) => {
		let t = Bn?.entry ?? null;
		if (Vn(null), e.startsWith("plugin:")) {
			let n = gi.find((t) => `plugin:${t.plugin}:${t.id}` === e);
			n && vi(n, t);
			return;
		}
		e === "open" && t?.directory ? yi(t) : e === "preview" && t && !t.directory ? Wn(t) : e === "select" && t ? Ei(t) : e === "rename" ? xi() : e === "copy" ? Ti("copy", O) : e === "move" ? Ti("move", O) : e === "delete" ? Si() : e === "favorite" && t ? Li(t) : e === "quick-access" && t ? Ri(t) : e === "download" && t && !t.directory ? window.open(t.url || r.downloadUrl(S, t.path), "_blank", "noopener,noreferrer") : e === "share" && t && !t.directory ? di(t) : e === "asset-metadata" && t && !t.directory && fi(t);
	}, Wi = async (e) => {
		if (R) try {
			let t = await r.applyImageActions(S, R.path, [{
				type: "preset",
				name: e
			}], { mode: "copy" });
			k(`${h("imageCreated")}: ${t.entry.name} · ${t.result.width} × ${t.result.height} px`), await P();
		} catch (e) {
			N(e);
		}
	}, Gi = (e) => {
		window.requestAnimationFrame(() => {
			document.querySelector(`button.sf-entry[data-entry-index="${e}"]`)?.focus();
		});
	}, Ki = (e, t, n = !1) => {
		let r = he[e], i = Math.round(Math.max(r.min, Math.min(r.max, t)));
		e === "left" ? fr(i) : mr(i), n && localStorage.setItem(`sofinder.column.${e}`, String(i));
	}, qi = (e, t) => {
		t.preventDefault(), t.currentTarget.setPointerCapture(t.pointerId), t.currentTarget.classList.add("is-resizing");
		let n = e === "left" ? dr : pr;
		vr.current = {
			side: e,
			startX: t.clientX,
			startWidth: n,
			currentWidth: n,
			element: t.currentTarget
		};
	}, Ji = (e) => {
		let t = vr.current;
		if (!t) return;
		let n = e.clientX - t.startX, r = he[t.side];
		t.currentWidth = Math.round(Math.max(r.min, Math.min(r.max, t.startWidth + (t.side === "left" ? n : -n)))), Ki(t.side, t.currentWidth);
	}, Yi = () => {
		let e = vr.current;
		vr.current = null, e && (e.element.classList.remove("is-resizing"), Ki(e.side, e.currentWidth, !0));
	}, Xi = (e, t) => {
		let n = t.key === "ArrowLeft" ? -1 : +(t.key === "ArrowRight");
		n !== 0 && (t.preventDefault(), Ki(e, (e === "left" ? dr : pr) + (e === "left" ? n : -n) * 10, !0));
	}, Zi = (e, t, n = !1) => {
		let r = ye(e, t);
		Zt((t) => {
			let i = {
				...t,
				[e]: r
			};
			return n && localStorage.setItem("sofinder.listColumnWidths.v1", JSON.stringify(i)), i;
		});
	}, Qi = (e, t) => {
		t.preventDefault(), t.stopPropagation(), t.currentTarget.setPointerCapture(t.pointerId), t.currentTarget.classList.add("is-resizing");
		let n = Xt[e];
		yr.current = {
			column: e,
			startX: t.clientX,
			startWidth: n,
			currentWidth: n,
			element: t.currentTarget
		};
	}, $i = (e) => {
		let t = yr.current;
		t && (t.currentWidth = ye(t.column, t.startWidth + e.clientX - t.startX), Zi(t.column, t.currentWidth));
	}, ea = () => {
		let e = yr.current;
		yr.current = null, e && (e.element.classList.remove("is-resizing"), Zi(e.column, e.currentWidth, !0));
	}, ta = (e, t) => {
		let n = t.key === "ArrowLeft" ? -1 : +(t.key === "ArrowRight");
		n !== 0 && (t.preventDefault(), t.stopPropagation(), Zi(e, Xt[e] + n * 10, !0));
	}, na = (e) => {
		let t = br.current;
		if (!t) return;
		let n = e === "name" ? ".sf-entry-name" : e === "size" ? ".sf-entry-size" : e === "type" ? ".sf-entry-type" : ".sf-entry-modified", r = Array.from(t.querySelectorAll(n)), i = t.querySelector(`.sf-list-heading-${e} button`), a = (e) => {
			if (!e) return 0;
			let t = document.createRange();
			return t.selectNodeContents(e), Math.ceil(t.getBoundingClientRect().width);
		}, o = Math.max(a(i), ...r.map(a)) + 24;
		Zi(e, o, !0);
	}, ra = () => {
		let t = e.uiDefaults.fullTools ? {
			resize: !0,
			crop: !0,
			rotate: !0,
			presets: !0,
			process: !0,
			batchRename: !0
		} : ae;
		Object.keys(t).forEach((e) => Ni(e, t[e]));
		let n = {
			...se,
			folderTree: e.featureDefaults?.folderTree ?? !1
		};
		Object.keys(n).forEach((e) => z(e, n[e])), Object.keys(ce).forEach((e) => B(e, ce[e])), Object.keys(oe).forEach((e) => Pi(e, oe[e]));
		let r = Object.fromEntries(Object.keys(E).map((e) => [e, E[e].initial]));
		Zt(r), localStorage.setItem("sofinder.listColumnWidths.v1", JSON.stringify(r)), Ki("left", he.left.initial, !0), Ki("right", he.right.initial, !0), Fi("left"), rn("all"), localStorage.setItem("sofinder.quickAccess.scope.v1", "all"), vn(e.uiDefaults.scale ?? "standard"), bn(e.uiDefaults.uploadConflictStrategy ?? "ask");
	}, ia = (e) => {
		let t = e.target, n = t.matches("button.sf-entry");
		if (t.isContentEditable || [
			"INPUT",
			"SELECT",
			"TEXTAREA",
			"BUTTON",
			"A"
		].includes(t.tagName) && !n) return;
		if (o === "manager" && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
			e.preventDefault(), Di();
			return;
		}
		if (e.key === "Escape") {
			e.preventDefault(), ti(/* @__PURE__ */ new Set()), ri(null);
			return;
		}
		if (o === "manager" && e.key === "Delete" && pi("delete") && !F?.readOnly) {
			e.preventDefault(), Si();
			return;
		}
		if (o === "manager" && e.key === "F2" && L.length === 1 && pi("rename") && !F?.readOnly) {
			e.preventDefault(), xi();
			return;
		}
		if (e.key === "Enter" && L.length === 1) {
			e.preventDefault(), yi(L[0]);
			return;
		}
		let r = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : +(e.key === "ArrowRight" || e.key === "ArrowDown");
		if (r !== 0 && I.length > 0) {
			e.preventDefault();
			let t = ni || L[0]?.path, n = t ? I.findIndex((e) => e.path === t) : r > 0 ? -1 : I.length, i = Math.max(0, Math.min(I.length - 1, n + r)), a = I[i];
			ti(/* @__PURE__ */ new Set([a.path])), ri(a.path), Gi(i);
		}
	}, aa = Sn !== null && L.some((e) => {
		let t = e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : "", n = Sn.path === "" ? 0 : Sn.path.split("/").length;
		return Sn.operation === "move" && Sn.path === t || e.directory && F !== void 0 && n >= F.maxFolderDepth || e.directory && (Sn.path === e.path || Sn.path.startsWith(`${e.path}/`));
	}), V = Ir.some((e) => e.status === "queued" || e.status === "uploading"), oa = e.uiDefaults.fullTools === !0, sa = e.uiDefaults.logo !== !1, ca = F?.storageCapabilities?.recoverableDelete !== !1, la = j.folderTree && en === "left", ua = j.folderTree && en === "right", da = u.quickAccess !== !1, fa = nn === "resource" ? Rt.quickAccess.length > 0 : Object.values(Bt).some((e) => e.length > 0), pa = v.length > 1 || la || j.recent || j.favorites && j.sidebarFavorites || da && j.sidebarQuickAccess && fa || !!(F?.readOnly || F?.quotaBytes), ma = (e) => j.recent ? /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
		fallback: null,
		children: /* @__PURE__ */ (0, C.jsx)(Ze, {
			variant: e,
			items: Rt.recent,
			labels: {
				title: h("recent"),
				empty: h("recentEmpty"),
				home: h("home")
			},
			onOpen: (e) => void Vi(e)
		})
	}) : null, ha = (o === "manager" || oa) && L.length > 0, ga = ha || ua, H = (e, t) => /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)(i, { name: e }), /* @__PURE__ */ (0, C.jsx)("span", { children: t })] }), _a = (e, t, n = Ie) => {
		Ht(null), xt([]), P(e, t, n, 0, ct, ut, ot, null);
	}, va = () => {
		ti(/* @__PURE__ */ new Set()), ri(null), it(""), st("name"), Ht("favorites");
	}, ya = async (e, t, n, i) => {
		let a = t.includes("/") ? t.slice(0, t.lastIndexOf("/")) : "", o = t.split("/").pop() || t;
		try {
			if (i === !1) throw new y(h("quickAccessRemoved"), "not_found", 404);
			let n = (await r.list(e, a, o, "name", "asc", 0, 500)).entries.find((e) => e.path === t);
			if (!n) throw new y(h("favoriteMissing"), "not_found", 404);
			if (Ht(null), _e(e), n.directory) {
				if (xt([]), await P(e, n.path, "", 0, ct, ut, "name", null) === "not_found") throw new y(h("quickAccessRemoved"), "not_found", 404);
			} else await P(e, a, "", 0), ti(/* @__PURE__ */ new Set([n.path]));
		} catch (r) {
			if (r instanceof y && r.code === "not_found") {
				try {
					await Ar(e, t, n, n === "favorite" ? { favorite: !1 } : { pinned: !1 });
				} catch (e) {
					N(e);
					return;
				}
				k(h(n === "favorite" ? "favoriteMissing" : "quickAccessRemoved"));
			} else N(r);
		}
	}, ba = async (e) => {
		try {
			await Ar(e.resource, e.path, "quick_access", { pinned: !1 });
		} catch (e) {
			N(e);
		}
	}, xa = async (e) => {
		try {
			await Ar(S, e, "favorite", { favorite: !1 });
		} catch (e) {
			N(e);
		}
	}, Sa = () => {
		if (bt.length === 0) return;
		let e = bt.slice(0, -1), t = bt[bt.length - 1] ?? null;
		xt(e), P(S, O, Ie, Math.max(0, ft - St), ct, ut, ot, t);
	}, Ca = () => {
		vt !== null && (xt((e) => [...e, gt]), P(S, O, Ie, ft + St, ct, ut, ot, vt));
	}, wa = () => {
		let e = Number(wt);
		if (!Number.isFinite(e) || e <= 0) {
			Tt(String(St));
			return;
		}
		let t = ge(e);
		Tt(String(t)), t !== St && (Et.current = t, Ct(t), localStorage.setItem("sofinder.pageSize.v1", String(t)), xt([]), P(S, O, Ie, 0, ct, ut, ot, null));
	}, Ta = (e, t) => {
		let n = t && ct === e && ut === "asc" ? "desc" : "asc";
		lt(e), dt(n), xt([]), P(S, O, Ie, 0, e, n, ot, null);
	}, Ea = () => {
		let e = ut === "asc" ? "desc" : "asc";
		dt(e), xt([]), P(S, O, Ie, 0, ct, e, ot, null);
	}, Da = [
		"name",
		...Jt.size ? ["size"] : [],
		...Jt.type ? ["type"] : [],
		...Jt.modified ? ["modified"] : []
	], Oa = `${Da.map((e) => `${Xt[e]}px`).join(" ")} minmax(0, 1fr)`, ka = (e) => h(e === "modified" ? "modified" : e), Aa = (e) => e === "name" ? "" : `sf-list-${e}`, ja = (e, t, n = "", r = !1) => {
		let a = ct === e, o = h(ut === "asc" ? "ascending" : "descending");
		return /* @__PURE__ */ (0, C.jsxs)("div", {
			className: `sf-list-heading sf-list-heading-${e}`,
			children: [/* @__PURE__ */ (0, C.jsxs)("button", {
				type: "button",
				className: `${n}${a ? " active" : ""}`,
				disabled: F?.storageCapabilities?.sort === !1,
				"aria-pressed": a,
				"aria-label": a ? `${t}, ${o}` : t,
				onClick: () => Ta(e, !0),
				children: [/* @__PURE__ */ (0, C.jsx)("span", { children: t }), a && /* @__PURE__ */ (0, C.jsx)(i, { name: ut === "asc" ? "sort-asc" : "sort-desc" })]
			}), r && /* @__PURE__ */ (0, C.jsx)("div", {
				className: "sf-list-column-resizer",
				role: "separator",
				tabIndex: 0,
				"aria-label": `${h("resizeListColumn")}: ${t}`,
				title: h("autoFitListColumn"),
				"aria-orientation": "vertical",
				"aria-valuemin": E[e].min,
				"aria-valuemax": E[e].max,
				"aria-valuenow": Xt[e],
				onPointerDown: (t) => Qi(e, t),
				onPointerMove: $i,
				onPointerUp: ea,
				onPointerCancel: ea,
				onKeyDown: (t) => ta(e, t),
				onDoubleClick: (t) => {
					t.preventDefault(), t.stopPropagation(), na(e);
				}
			})]
		}, e);
	}, Ma = (e) => {
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
		return t[e] ? h(t[e]) : e;
	};
	return /* @__PURE__ */ (0, C.jsxs)("main", {
		className: `sf-app sf-mode-${o}${pa ? "" : " sf-no-sidebar"}${ga ? "" : " sf-no-details"}${(o === "manager" || oa) && L.length > 0 ? " sf-has-selection-actions" : ""}`,
		onKeyDown: ia,
		onDragOver: (e) => e.preventDefault(),
		onDrop: (e) => {
			e.preventDefault(), A === null && e.dataTransfer.files.length && Vr(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ (0, C.jsxs)("div", {
				className: `sf-commandbar ${sa ? "sf-has-brand" : "sf-no-brand"}`,
				children: [
					sa ? /* @__PURE__ */ (0, C.jsxs)("div", {
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
							onClick: () => _a(S, ""),
							children: h("home")
						}), A === "favorites" ? /* @__PURE__ */ (0, C.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, C.jsx)("strong", { children: h("favorites") })] }) : Yr.map((e, t) => /* @__PURE__ */ (0, C.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, C.jsx)("button", {
							onClick: () => _a(S, Yr.slice(0, t + 1).join("/")),
							children: e
						})] }, `${e}-${t}`))]
					}),
					e.uiDefaults.search !== !1 && /* @__PURE__ */ (0, C.jsxs)("div", {
						className: "sf-search",
						children: [
							/* @__PURE__ */ (0, C.jsx)(i, { name: "search" }),
							/* @__PURE__ */ (0, C.jsxs)("select", {
								value: ot,
								disabled: A !== null,
								onChange: (e) => {
									let t = e.target.value;
									st(t), pt(0);
								},
								"aria-label": h("searchScope"),
								children: [/* @__PURE__ */ (0, C.jsx)("option", {
									value: "name",
									disabled: F?.storageCapabilities?.search === !1,
									children: h("name")
								}), /* @__PURE__ */ (0, C.jsx)("option", {
									value: "tags",
									children: h("tags")
								})]
							}),
							/* @__PURE__ */ (0, C.jsx)("input", {
								disabled: A === null && ot === "name" && F?.storageCapabilities?.search === !1,
								value: Ie,
								onChange: (e) => it(e.target.value),
								placeholder: h(A === "favorites" ? "searchFavorites" : ot === "tags" ? "searchTags" : "search"),
								"aria-label": h(A === "favorites" ? "searchFavorites" : ot === "tags" ? "searchTags" : "search")
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
									children: h("workspace")
								}), /* @__PURE__ */ (0, C.jsx)("select", {
									"aria-label": h("workspace"),
									value: e.workspace?.id,
									disabled: V,
									title: h(V ? "workspaceUploadBlocked" : "workspace"),
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
							e.uiDefaults.viewSwitcher !== !1 && /* @__PURE__ */ (0, C.jsxs)("div", {
								className: "sf-view-toggle",
								role: "group",
								"aria-label": `${h("grid")} / ${h("list")}`,
								children: [/* @__PURE__ */ (0, C.jsx)("button", {
									className: Dt === "grid" ? "active" : "",
									disabled: A !== null,
									onClick: () => Hi("grid"),
									title: h("grid"),
									"aria-label": h("grid"),
									children: /* @__PURE__ */ (0, C.jsx)(i, { name: "grid" })
								}), /* @__PURE__ */ (0, C.jsx)("button", {
									className: Dt === "list" ? "active" : "",
									disabled: A !== null,
									onClick: () => Hi("list"),
									title: h("list"),
									"aria-label": h("list"),
									children: /* @__PURE__ */ (0, C.jsx)(i, { name: "list" })
								})]
							}),
							/* @__PURE__ */ (0, C.jsxs)("div", {
								ref: xr,
								className: "sf-utility",
								children: [/* @__PURE__ */ (0, C.jsx)("button", {
									ref: Sr,
									className: "sf-icon-only",
									onClick: () => un((e) => !e),
									"aria-expanded": ln,
									title: h("moreActions"),
									"aria-label": h("moreActions"),
									children: /* @__PURE__ */ (0, C.jsx)(i, { name: "more" })
								}), ln && /* @__PURE__ */ (0, C.jsxs)("div", {
									className: "sf-utility-menu",
									role: "menu",
									children: [
										e.uiDefaults.languageSwitcher !== !1 && /* @__PURE__ */ (0, C.jsxs)("label", { children: [/* @__PURE__ */ (0, C.jsx)("span", { children: h("language") }), /* @__PURE__ */ (0, C.jsxs)("select", {
											value: d,
											onChange: (e) => f(e.target.value),
											"aria-label": h("language"),
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
										/* @__PURE__ */ (0, C.jsxs)("label", { children: [/* @__PURE__ */ (0, C.jsx)("span", { children: h("sort") }), /* @__PURE__ */ (0, C.jsxs)("select", {
											value: ct,
											disabled: A !== null || F?.storageCapabilities?.sort === !1,
											"aria-label": h("sort"),
											onChange: (e) => Ta(e.target.value, !1),
											children: [
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "name",
													children: h("name")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "size",
													children: h("size")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "type",
													children: h("type")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "modified",
													children: h("modified")
												})
											]
										})] }),
										/* @__PURE__ */ (0, C.jsxs)("label", { children: [/* @__PURE__ */ (0, C.jsx)("span", { children: h("groupBy") }), /* @__PURE__ */ (0, C.jsxs)("select", {
											value: Qr,
											disabled: A !== null,
											"aria-label": h("groupBy"),
											onChange: (e) => {
												let t = e.target.value;
												mn(t), localStorage.setItem("sofinder.groupMode.v1", t);
											},
											children: [
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "none",
													children: h("groupNone")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "name",
													children: h("name")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "type",
													children: h("type")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "size",
													children: h("size")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "modified",
													children: h("modified")
												}),
												j.tags && /* @__PURE__ */ (0, C.jsx)("option", {
													value: "tags",
													children: h("tags")
												})
											]
										})] }),
										/* @__PURE__ */ (0, C.jsxs)("label", { children: [/* @__PURE__ */ (0, C.jsx)("span", { children: h("filterType") }), /* @__PURE__ */ (0, C.jsxs)("select", {
											value: hn,
											disabled: A !== null,
											"aria-label": h("filterType"),
											onChange: (e) => {
												let t = e.target.value;
												gn(t), localStorage.setItem("sofinder.typeFilter.v1", t), Oi();
											},
											children: [
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "all",
													children: h("allTypes")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "folder",
													children: h("folder")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "image",
													children: h("images")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "document",
													children: h("documents")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "audio",
													children: h("audio")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "video",
													children: h("video")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "archive",
													children: h("archives")
												}),
												/* @__PURE__ */ (0, C.jsx)("option", {
													value: "other",
													children: h("other")
												})
											]
										})] }),
										/* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											className: `sf-sort-direction ${ut}`,
											disabled: A !== null || F?.storageCapabilities?.sort === !1,
											"aria-label": `${h("direction")}: ${h(ut === "asc" ? "ascending" : "descending")}`,
											onClick: Ea,
											children: H(ut === "asc" ? "sort-asc" : "sort-desc", h(ut === "asc" ? "ascending" : "descending"))
										}),
										/* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											onClick: () => {
												un(!1), A === "favorites" ? kr(S, !0).catch(N) : P();
											},
											children: H("refresh", h("refresh"))
										}),
										/* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											onClick: () => {
												un(!1), on(!0);
											},
											children: H("settings", h("settings"))
										}),
										(o === "manager" || oa) && e.securityStatusAvailable !== !1 && /* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											onClick: () => {
												un(!1), cn(!0);
											},
											children: H("security", h("securityStatus"))
										}),
										(o === "manager" || oa) && j.trash && ca && /* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											onClick: () => {
												un(!1), Ln(!0);
											},
											children: H("trash", h("trash"))
										}),
										(o === "manager" || oa) && j.favorites && /* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											onClick: () => {
												un(!1), va();
											},
											children: H("favorite", h("favorites"))
										}),
										(o === "manager" || oa) && gi.filter((e) => e.slot === "utility" && ke(e, null)).map((e) => /* @__PURE__ */ (0, C.jsx)("button", {
											role: "menuitem",
											onClick: () => {
												un(!1), vi(e, null);
											},
											children: Ee(e, d)
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
				"aria-label": h("fileActions"),
				title: h("keyboardHelp"),
				children: [
					/* @__PURE__ */ (0, C.jsx)("button", {
						onClick: bi,
						disabled: A !== null || F?.readOnly || Mt.create_folder === !1 || F !== void 0 && Fr >= F.maxFolderDepth,
						title: F && Fr >= F.maxFolderDepth ? h("folderDepthReached") : void 0,
						children: H("add-folder", h("newFolder"))
					}),
					/* @__PURE__ */ (0, C.jsx)("button", {
						className: `primary sf-upload-trigger${V ? " is-active" : ""}`,
						"aria-busy": V,
						onClick: () => zr.current?.click(),
						disabled: A !== null || F?.readOnly || Mt.upload === !1,
						children: H("upload", `${h("upload")}${V ? ` (${Ir.filter((e) => e.status === "queued" || e.status === "uploading").length})` : ""}`)
					}),
					/* @__PURE__ */ (0, C.jsx)("input", {
						ref: zr,
						type: "file",
						multiple: !0,
						hidden: !0,
						onChange: (e) => {
							e.target.files && Vr(e.target.files), e.target.value = "";
						}
					}),
					u.folderUpload !== !1 && /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("button", {
						onClick: () => Br.current?.click(),
						disabled: A !== null || F?.readOnly || Mt.upload === !1,
						children: H("add-folder", h("uploadFolder"))
					}), /* @__PURE__ */ (0, C.jsx)("input", {
						ref: (e) => {
							Br.current = e, e?.setAttribute("webkitdirectory", "");
						},
						type: "file",
						multiple: !0,
						hidden: !0,
						onChange: (e) => {
							e.target.files && Ur(e.target.files), e.target.value = "";
						}
					})] }),
					(o === "manager" || oa) && /* @__PURE__ */ (0, C.jsxs)("div", {
						ref: Cr,
						className: "sf-utility sf-selection-menu",
						children: [/* @__PURE__ */ (0, C.jsx)("button", {
							onClick: () => fn((e) => !e),
							"aria-expanded": dn,
							children: H("select", h("selection"))
						}), dn && /* @__PURE__ */ (0, C.jsxs)("div", {
							className: "sf-utility-menu",
							role: "menu",
							children: [
								/* @__PURE__ */ (0, C.jsx)("button", {
									role: "menuitem",
									disabled: I.length === 0,
									onClick: () => {
										Di(), fn(!1);
									},
									children: h("selectAll")
								}),
								/* @__PURE__ */ (0, C.jsx)("button", {
									role: "menuitem",
									disabled: ei.size === 0,
									onClick: () => {
										Oi(), fn(!1);
									},
									children: h("clearSelection")
								}),
								/* @__PURE__ */ (0, C.jsx)("button", {
									role: "menuitem",
									disabled: I.length === 0,
									onClick: () => {
										ki(), fn(!1);
									},
									children: h("invertSelection")
								})
							]
						})]
					}),
					(o === "manager" || oa) && L.length > 0 && /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("span", { className: "sf-separator" }), /* @__PURE__ */ (0, C.jsxs)("div", {
						className: "sf-context-actions",
						children: [
							/* @__PURE__ */ (0, C.jsx)("button", {
								onClick: xi,
								disabled: L.length !== 1 || !pi("rename") || F?.readOnly,
								children: H("rename", h("rename"))
							}),
							u.batchRename !== !1 && Gt.batchRename && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => Tn(!0),
								disabled: L.length < 2 || !pi("rename") || F?.readOnly,
								children: H("rename", h("batchRename"))
							}),
							/* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void Ti("copy", O),
								disabled: !pi("copy") || F?.readOnly,
								children: H("copy", h("copy"))
							}),
							/* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void Ti("move", O),
								disabled: !pi("move") || F?.readOnly,
								children: H("move", h("move"))
							}),
							j.archive && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void Ii(),
								children: H("archive", h("downloadZip"))
							}),
							j.favorites && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void Li(),
								disabled: !R,
								children: H("favorite", h("favorite"))
							}),
							da && j.sidebarQuickAccess && hi(R) && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void Ri(),
								children: H("add-folder", R && Rt.quickAccess.includes(R.path) ? h("unpinQuickAccess") : h("pinQuickAccess"))
							}),
							j.tags && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void zi(),
								disabled: !R,
								children: H("tags", h("tags"))
							}),
							/* @__PURE__ */ (0, C.jsx)("button", {
								className: "danger",
								onClick: Si,
								disabled: !pi("delete") || F?.readOnly,
								children: H("delete", `${h("remove")}${L.length > 1 ? ` (${L.length})` : ""}`)
							}),
							u.imageEditing !== !1 && Gt.rotate && /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void Ai(270),
								disabled: !si(R) || F?.readOnly,
								children: H("rotate-left", h("rotateLeft"))
							}), /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void Ai(90),
								disabled: !si(R) || F?.readOnly,
								children: H("rotate-right", h("rotateRight"))
							})] }),
							u.imageEditing !== !1 && Gt.resize && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: ji,
								disabled: !si(R) || F?.readOnly,
								children: H("resize", h("resize"))
							}),
							u.imageEditing !== !1 && Gt.crop && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: Mi,
								disabled: !si(R) || !Ut || F?.readOnly,
								children: H("crop", h("crop"))
							}),
							u.imageProcessing !== !1 && Gt.process && /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => kn(!0),
								disabled: ci.length === 0 || ci.length !== L.length || F?.readOnly,
								children: H("resize", h("imageProcess"))
							}),
							u.imageEditing !== !1 && Gt.presets && /* @__PURE__ */ (0, C.jsxs)("label", {
								className: "sf-sort",
								children: [h("preset"), /* @__PURE__ */ (0, C.jsxs)("select", {
									value: "",
									disabled: !si(R) || F?.readOnly || Object.keys(Zn).length === 0,
									onChange: (e) => {
										let t = e.target.value;
										e.target.value = "", t && Wi(t);
									},
									children: [/* @__PURE__ */ (0, C.jsx)("option", {
										value: "",
										children: "—"
									}), Object.entries(Zn).map(([e, t]) => /* @__PURE__ */ (0, C.jsxs)("option", {
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
							R && gi.filter((e) => e.slot === "toolbar" && ke(e, R)).map((e) => /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => vi(e, R),
								children: Ee(e, d)
							}, `${e.plugin}:${e.id}`))
						]
					})] })
				]
			}),
			jt && /* @__PURE__ */ (0, C.jsxs)("div", {
				className: "sf-notice",
				role: "alert",
				children: [jt, /* @__PURE__ */ (0, C.jsx)("button", {
					onClick: () => k(""),
					"aria-label": h("close"),
					children: /* @__PURE__ */ (0, C.jsx)(i, { name: "close" })
				})]
			}),
			Ir.length > 0 && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, C.jsx)($e, {
					tasks: Ir,
					collapsed: Lr,
					labels: {
						title: h("uploadQueue"),
						expand: h("expand"),
						collapse: h("collapse"),
						cancel: h("cancel"),
						cancelAll: h("cancelAll"),
						clearFinished: h("clearFinished"),
						retry: h("retryUpload"),
						remove: h("removeUploadTask"),
						status: (e) => h(e)
					},
					onToggle: () => Rr((e) => !e),
					onCancel: Wr,
					onCancelAll: Gr,
					onClearFinished: Jr,
					onRetry: qr,
					onRemove: Kr
				})
			}),
			/* @__PURE__ */ (0, C.jsxs)("div", {
				className: "sf-layout",
				style: {
					"--sf-sidebar-width": `${dr}px`,
					"--sf-details-width": `${pr}px`
				},
				children: [
					pa && /* @__PURE__ */ (0, C.jsxs)("aside", {
						className: "sf-sidebar",
						"aria-label": "Resources",
						children: [
							v.map((e) => /* @__PURE__ */ (0, C.jsxs)("button", {
								className: e.name === S && A === null ? "active" : "",
								onClick: () => {
									Ht(null), _e(e.name), it(""), st("name"), e.storageCapabilities?.sort === !1 ? (lt("name"), dt("asc"), xt([]), P(e.name, "", "", 0, "name", "asc", "name", null)) : _a(e.name, "", "");
								},
								children: [/* @__PURE__ */ (0, C.jsx)("span", {
									className: "sf-resource-icon",
									children: /* @__PURE__ */ (0, C.jsx)(c, { kind: e.name.toLowerCase().includes("image") ? "image" : "folder" })
								}), e.name.toLowerCase().includes("image") ? h("images") : e.name.toLowerCase() === "files" ? h("files") : e.name]
							}, e.name)),
							la && S && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
								fallback: null,
								children: /* @__PURE__ */ (0, C.jsx)(Ke, {
									api: r,
									resource: S,
									currentPath: Ae,
									rootLabel: h("home"),
									onNavigate: (e) => _a(S, e, "")
								})
							}),
							(j.favorites && j.sidebarFavorites || da && j.sidebarQuickAccess && fa) && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
								fallback: null,
								children: /* @__PURE__ */ (0, C.jsx)(Xe, {
									favorites: Rt.favorites,
									quickAccessByResource: Bt,
									resources: v,
									currentResource: S,
									quickAccessScope: nn,
									showFavorites: j.favorites && j.sidebarFavorites,
									showQuickAccess: da && j.sidebarQuickAccess && fa,
									favoritesActive: A === "favorites",
									labels: {
										favorites: h("favorites"),
										favoritesEmpty: h("favoritesEmpty"),
										quickAccess: h("quickAccess"),
										quickAccessEmpty: h("quickAccessEmpty"),
										home: h("home"),
										more: h("moreItems"),
										missing: h("quickAccessMissing")
									},
									onOpenFavorites: va,
									onOpenFavorite: (e) => void ya(S, e, "favorite"),
									onOpenQuickAccess: (e) => void ya(e.resource, e.path, "quick_access", e.exists),
									onQuickAccessContext: (e, t) => {
										t.preventDefault(), Un({
											x: t.clientX,
											y: t.clientY,
											link: e
										});
									},
									onFavoriteContext: (e, t) => {
										t.preventDefault(), Un({
											x: t.clientX,
											y: t.clientY,
											link: {
												resource: S,
												path: e
											},
											favorite: !0
										});
									}
								})
							}),
							F && (F.readOnly || F.quotaBytes > 0) && /* @__PURE__ */ (0, C.jsxs)("div", {
								className: "sf-resource-status",
								children: [F.readOnly && /* @__PURE__ */ (0, C.jsx)("strong", { children: h("readOnly") }), F.quotaBytes > 0 && /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsxs)("span", { children: [
									h("storageUsage"),
									": ",
									l(F.usedBytes),
									" / ",
									l(F.quotaBytes)
								] }), /* @__PURE__ */ (0, C.jsx)("progress", {
									max: F.quotaBytes,
									value: Math.min(F.usedBytes, F.quotaBytes)
								})] })]
							}),
							ma("sidebar")
						]
					}),
					pa && /* @__PURE__ */ (0, C.jsx)("div", {
						className: "sf-column-resizer left",
						role: "separator",
						tabIndex: 0,
						"aria-label": h("resizeLeftPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": he.left.min,
						"aria-valuemax": he.left.max,
						"aria-valuenow": dr,
						onPointerDown: (e) => qi("left", e),
						onPointerMove: Ji,
						onPointerUp: Yi,
						onPointerCancel: Yi,
						onKeyDown: (e) => Xi("left", e),
						onDoubleClick: () => Ki("left", he.left.initial, !0)
					}),
					/* @__PURE__ */ (0, C.jsxs)("section", {
						className: "sf-content",
						children: [
							ma("mobile"),
							sa && /* @__PURE__ */ (0, C.jsxs)("nav", {
								className: "sf-breadcrumb",
								"aria-label": "Breadcrumb",
								children: [/* @__PURE__ */ (0, C.jsx)("button", {
									onClick: () => _a(S, ""),
									children: h("home")
								}), A === "favorites" ? /* @__PURE__ */ (0, C.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, C.jsx)("strong", { children: h("favorites") })] }) : Yr.map((e, t) => /* @__PURE__ */ (0, C.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, C.jsx)("button", {
									onClick: () => _a(S, Yr.slice(0, t + 1).join("/")),
									children: e
								})] }, `${e}-${t}`))]
							}),
							A === "favorites" ? /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
								fallback: /* @__PURE__ */ (0, C.jsx)("div", {
									className: "sf-state",
									children: h("loading")
								}),
								children: /* @__PURE__ */ (0, C.jsx)(Ye, {
									paths: Rt.favorites,
									search: Ie,
									locale: d,
									labels: {
										title: h("favorites"),
										hint: h("favoritesPageHint"),
										empty: h("favoritesEmpty"),
										noMatch: h("filterEmpty"),
										home: h("home"),
										open: h("open"),
										remove: h("removeFavorite")
									},
									onOpen: (e) => void ya(S, e, "favorite"),
									onRemove: (e) => void xa(e)
								})
							}) : kt ? /* @__PURE__ */ (0, C.jsx)("div", {
								className: "sf-state",
								children: h("loading")
							}) : I.length === 0 ? /* @__PURE__ */ (0, C.jsx)("div", {
								className: "sf-state",
								children: Me.length === 0 ? h("empty") : h("filterEmpty")
							}) : /* @__PURE__ */ (0, C.jsxs)("div", {
								ref: br,
								className: `sf-entries ${Dt} sf-grid-size-${Qt.grid} sf-list-size-${Qt.list}${Dt === "list" && Jt.size ? " sf-list-has-size" : ""}`,
								style: Dt === "list" ? { "--sf-list-columns": Oa } : void 0,
								role: "listbox",
								"aria-multiselectable": o === "manager",
								"aria-label": h("files"),
								children: [Dt === "list" && /* @__PURE__ */ (0, C.jsx)("div", {
									className: "sf-list-head",
									children: Da.map((e) => ja(e, ka(e), Aa(e), !0))
								}), $r.flatMap((e) => [...Qr === "none" ? [] : [/* @__PURE__ */ (0, C.jsxs)("div", {
									className: "sf-entry-group",
									children: [/* @__PURE__ */ (0, C.jsx)("strong", { children: Ma(e.label) }), /* @__PURE__ */ (0, C.jsx)("span", { children: e.entries.length })]
								}, `group-${e.key}`)], ...e.entries.map((e) => {
									let t = I.findIndex((t) => t.path === e.path), n = !e.directory && oi(e);
									return /* @__PURE__ */ (0, C.jsxs)("button", {
										"data-entry-index": t,
										role: "option",
										"aria-selected": ei.has(e.path),
										"aria-label": `${e.name}, ${e.directory ? h("folder") : l(e.size)}`,
										className: `sf-entry ${ei.has(e.path) ? "selected" : ""}`,
										onClick: (t) => ii(e, t),
										onDoubleClick: () => yi(e),
										onContextMenu: (t) => {
											t.preventDefault(), ti(/* @__PURE__ */ new Set([e.path])), ri(e.path), Vn({
												x: t.clientX,
												y: t.clientY,
												entry: e
											});
										},
										onPointerDown: (t) => {
											t.pointerType === "touch" && (_r.current = window.setTimeout(() => {
												ti(/* @__PURE__ */ new Set([e.path])), ri(e.path), Vn({
													x: t.clientX,
													y: t.clientY,
													entry: e
												});
											}, 550));
										},
										onPointerUp: () => {
											_r.current !== null && window.clearTimeout(_r.current), _r.current = null;
										},
										onPointerCancel: () => {
											_r.current !== null && window.clearTimeout(_r.current), _r.current = null;
										},
										onDragOver: (t) => {
											e.directory && t.preventDefault();
										},
										onDrop: (t) => {
											e.directory && t.dataTransfer.files.length && (t.preventDefault(), Hr(e.path, t.dataTransfer.files));
										},
										children: [
											/* @__PURE__ */ (0, C.jsx)("span", {
												className: "sf-entry-icon",
												children: n ? /* @__PURE__ */ (0, C.jsx)(s, {
													src: r.thumbnailUrl(S, e),
													alt: "",
													lazy: !0
												}) : /* @__PURE__ */ (0, C.jsx)(c, {
													name: e.name,
													mimeType: e.mimeType,
													directory: e.directory
												})
											}),
											/* @__PURE__ */ (0, C.jsxs)("span", {
												className: "sf-entry-name",
												title: e.name,
												children: [j.favorites && Rt.favorites.includes(e.path) && /* @__PURE__ */ (0, C.jsxs)("span", {
													"aria-label": h("favorite"),
													children: [/* @__PURE__ */ (0, C.jsx)(i, { name: "favorite" }), " "]
												}), e.name]
											}),
											Jt.size && /* @__PURE__ */ (0, C.jsx)("span", {
												className: "sf-entry-size",
												children: e.directory ? "—" : l(e.size)
											}),
											Jt.type && /* @__PURE__ */ (0, C.jsx)("span", {
												className: "sf-entry-type",
												children: e.directory ? h("folder") : e.mimeType || h("file")
											}),
											Jt.modified && /* @__PURE__ */ (0, C.jsx)("time", {
												className: "sf-entry-modified",
												dateTime: (/* @__PURE__ */ new Date(e.modifiedAt * 1e3)).toISOString(),
												children: _.format(e.modifiedAt * 1e3)
											})
										]
									}, e.path);
								})])]
							}),
							A === null && /* @__PURE__ */ (0, C.jsxs)("nav", {
								className: "sf-pagination",
								"aria-label": h("pagination"),
								children: [
									/* @__PURE__ */ (0, C.jsxs)("div", {
										className: "sf-page-navigation",
										children: [
											/* @__PURE__ */ (0, C.jsxs)("button", {
												disabled: bt.length === 0,
												onClick: Sa,
												children: [
													/* @__PURE__ */ (0, C.jsx)(i, { name: "chevron-left" }),
													" ",
													h("previous")
												]
											}),
											/* @__PURE__ */ (0, C.jsxs)("span", { children: [
												h("page"),
												" ",
												bt.length + 1,
												mt === null ? "" : ` / ${Math.max(1, Math.ceil(mt / St))}`
											] }),
											/* @__PURE__ */ (0, C.jsxs)("button", {
												disabled: vt === null,
												onClick: Ca,
												children: [
													h("next"),
													" ",
													/* @__PURE__ */ (0, C.jsx)(i, { name: "chevron-right" })
												]
											})
										]
									}),
									/* @__PURE__ */ (0, C.jsxs)("label", {
										className: "sf-page-size",
										children: [/* @__PURE__ */ (0, C.jsxs)("span", { children: [
											h("itemsPerPage"),
											" (",
											D.min,
											"–",
											D.max,
											")"
										] }), /* @__PURE__ */ (0, C.jsx)("input", {
											type: "number",
											min: D.min,
											max: D.max,
											step: "10",
											list: n,
											value: wt,
											onChange: (e) => Tt(e.target.value),
											onBlur: wa,
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
					ga && /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("div", {
						className: "sf-column-resizer right",
						role: "separator",
						tabIndex: 0,
						"aria-label": h("resizeRightPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": he.right.min,
						"aria-valuemax": he.right.max,
						"aria-valuenow": pr,
						onPointerDown: (e) => qi("right", e),
						onPointerMove: Ji,
						onPointerUp: Yi,
						onPointerCancel: Yi,
						onKeyDown: (e) => Xi("right", e),
						onDoubleClick: () => Ki("right", he.right.initial, !0)
					}), /* @__PURE__ */ (0, C.jsxs)("aside", {
						className: "sf-right-panel",
						"aria-label": h("rightSidebar"),
						children: [ua && S && /* @__PURE__ */ (0, C.jsxs)("section", {
							className: "sf-folder-navigation-right",
							children: [/* @__PURE__ */ (0, C.jsx)("h2", { children: h("folderNavigation") }), /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
								fallback: /* @__PURE__ */ (0, C.jsx)("div", {
									className: "sf-state",
									children: h("loading")
								}),
								children: /* @__PURE__ */ (0, C.jsx)(Ke, {
									api: r,
									resource: S,
									currentPath: Ae,
									rootLabel: h("home"),
									onNavigate: (e) => _a(S, e, "")
								})
							})]
						}), ha && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
							fallback: /* @__PURE__ */ (0, C.jsx)("div", {
								className: "sf-state",
								children: h("loading")
							}),
							children: /* @__PURE__ */ (0, C.jsx)(qe, {
								api: r,
								resource: S,
								selectedEntries: L,
								selected: R,
								imageInfo: Ut,
								metadata: Rt,
								showTags: j.tags,
								previewImage: oi(R),
								selectMode: !1,
								selectAllowed: li(R),
								assetMetadataEnabled: ar,
								labels: {
									details: h("details"),
									selected: h("selectedCount"),
									type: h("type"),
									folder: h("folder"),
									file: h("file"),
									size: h("size"),
									dimensions: h("dimensions"),
									modified: h("modified"),
									location: h("location"),
									select: h("select"),
									download: h("download"),
									share: h("share"),
									assetMetadata: h("assetMetadata"),
									unsupportedWebImage: h("webImageUnsupported")
								},
								formatDate: (e) => _.format(e * 1e3),
								onChoose: Ei,
								onShare: di,
								onAssetMetadata: (e) => void fi(e),
								pluginActions: R && gi.filter((e) => e.slot === "details" && ke(e, R)).map((e) => /* @__PURE__ */ (0, C.jsx)("button", {
									onClick: () => vi(e, R),
									children: Ee(e, d)
								}, `${e.plugin}:${e.id}`))
							})
						})]
					})] })
				]
			}),
			o === "picker" && R && !R.directory && /* @__PURE__ */ (0, C.jsxs)("div", {
				className: "sf-picker-bar",
				children: [
					/* @__PURE__ */ (0, C.jsxs)("div", { children: [/* @__PURE__ */ (0, C.jsx)("strong", { children: R.name }), /* @__PURE__ */ (0, C.jsx)("small", { children: l(R.size) })] }),
					!li(R) && /* @__PURE__ */ (0, C.jsx)("span", {
						role: "status",
						children: h("webImageUnsupported")
					}),
					/* @__PURE__ */ (0, C.jsx)("button", {
						className: "primary",
						disabled: !li(R),
						onClick: () => void Ei(),
						children: h("select")
					})
				]
			}),
			an && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: h("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(Ve, {
					resource: F,
					tools: Gt,
					features: j,
					columns: Jt,
					viewSizes: Qt,
					folderTreePlacement: en,
					quickAccessScope: nn,
					availability: u,
					scale: _n,
					uploadConflictStrategy: yn,
					translate: h,
					onToolChange: Ni,
					onFeatureChange: z,
					onColumnChange: B,
					onViewSizeChange: Pi,
					onFolderTreePlacementChange: Fi,
					onQuickAccessScopeChange: (e) => {
						rn(e), localStorage.setItem("sofinder.quickAccess.scope.v1", e);
					},
					onScaleChange: vn,
					onUploadConflictStrategyChange: bn,
					onReset: ra,
					onClose: () => on(!1)
				})
			}),
			sn && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: h("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(ze, {
					api: r,
					formatDate: (e) => _.format(e * 1e3),
					labels: {
						title: h("securityStatus"),
						close: h("close"),
						loading: h("loading"),
						enabled: h("malwareScanningEnabled"),
						disabled: h("malwareScanningDisabled"),
						provider: h("scanProvider"),
						service: h("serviceStatus"),
						scans: h("scanHistory"),
						passed: h("scanPassed"),
						quarantined: h("scanQuarantined"),
						failed: h("scanFailed"),
						pending: h("scanPending"),
						recent: h("recentScans"),
						none: h("noScans"),
						document: h("documentPreviewStatus"),
						mode: h("previewMode"),
						converter: h("previewConverter"),
						version: h("previewVersion"),
						cache: h("previewCache"),
						writable: h("previewCacheWritable"),
						readOnly: h("previewCacheReadOnly"),
						jobs: h("previewJobs"),
						lastSuccess: h("previewLastSuccess"),
						never: h("previewNever"),
						running: h("previewRunning"),
						ready: h("previewReady")
					},
					onClose: () => cn(!1)
				})
			}),
			Sn && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: h("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(He, {
					state: Sn,
					unsafe: aa,
					translate: h,
					onBrowse: (e, t) => void Ti(e, t),
					onConfirm: (e, t) => void wi(e, t),
					onClose: () => Cn(null)
				})
			}),
			wn && u.batchRename !== !1 && Gt.batchRename && F && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: h("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(Ue, {
					entries: L,
					maximum: F.maxFileNameLength,
					labels: {
						title: h("batchRename"),
						pattern: h("renamePattern"),
						hint: h("renamePatternHint"),
						oldName: h("oldName"),
						newName: h("newName"),
						invalid: h("invalidEntryName"),
						duplicate: h("duplicateRename"),
						cancel: h("cancel"),
						save: h("rename"),
						close: h("close")
					},
					onClose: () => Tn(!1),
					onSave: (e) => void Ci(e)
				})
			}),
			An && /* @__PURE__ */ (0, C.jsx)(ne, {
				title: An.title,
				label: An.label,
				initialValue: An.initial,
				maximum: An.maximum,
				extension: An.extension,
				invalidNameLabel: h("invalidEntryName"),
				confirmLabel: h("confirm"),
				cancelLabel: h("cancel"),
				closeLabel: h("close"),
				onConfirm: (e) => void Bi(e),
				onClose: () => jn(null)
			}),
			Mn && /* @__PURE__ */ (0, C.jsx)(re, {
				...Mn,
				confirmLabel: h("confirm"),
				cancelLabel: h("cancel"),
				closeLabel: h("close"),
				onConfirm: () => Mr(!0),
				onClose: () => Mr(!1)
			}),
			Pn && /* @__PURE__ */ (0, C.jsx)(ie, {
				fileName: Pn,
				title: h("replaceFile"),
				renameLabel: h("uploadConflictRename"),
				overwriteLabel: h("uploadConflictOverwrite"),
				skipLabel: h("uploadConflictSkip"),
				closeLabel: h("close"),
				onChoose: Pr
			}),
			In && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: h("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(We, {
					api: r,
					resource: S,
					locale: d,
					labels: {
						title: h("trash"),
						close: h("close"),
						cancel: h("cancel"),
						empty: h("trashEmpty"),
						restore: h("restore"),
						permanentDelete: h("permanentDelete"),
						expires: h("expires"),
						conflict: h("restoreConflict"),
						overwrite: h("restoreOverwrite"),
						autoRename: h("restoreAutoRename"),
						usage: h("trashUsage"),
						items: h("items"),
						previous: h("previous"),
						next: h("next"),
						search: h("searchTrash")
					},
					onClose: () => Ln(!1),
					onChanged: () => void P()
				})
			}),
			Rn && R && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: h("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(Ge, {
					initial: Rt.tags[R.path] || [],
					suggestions: Array.from(new Set(Object.values(Rt.tags).flat())).sort((e, t) => e.localeCompare(t, d)),
					labels: {
						title: h("tags"),
						close: h("close"),
						cancel: h("cancel"),
						save: h("save"),
						input: h("tagInput"),
						hint: h("tagInputHint"),
						maximum: h("tagMaximum")
					},
					onClose: () => zn(!1),
					onSave: (e) => {
						zn(!1), Ar(S, R.path, "tags", { tags: e }).catch(N);
					}
				})
			}),
			lr && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: h("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(tt, {
					asset: lr.asset,
					metadata: lr.metadata,
					locales: sr.map((e) => ({
						code: e,
						label: {
							en: h("languageEnglish"),
							"zh-cn": h("languageZhCn"),
							"zh-tw": h("languageZhTw")
						}[e] ?? e
					})),
					labels: {
						title: h("assetMetadata"),
						alt: h("assetAlt"),
						translatedAlt: h("translatedAlt"),
						translatedAltHelp: h("translatedAltHelp"),
						language: h("languageCode"),
						addLanguage: h("addLanguage"),
						assetTitle: h("assetTitle"),
						tags: h("tags"),
						decorative: h("decorativeImage"),
						unsetAlt: h("assetAltUnset"),
						inheritAlt: h("inheritAlt"),
						save: h("save"),
						cancel: h("cancel")
					},
					onClose: () => ur(null),
					onSave: async (e) => {
						await r.updateAssetMetadata(lr.asset.assetId || "", e), ur(null), k(h("assetMetadataSaved"));
					}
				})
			}),
			M && /* @__PURE__ */ (0, C.jsx)(a, {
				title: M.name,
				closeLabel: h("close"),
				maximizable: !0,
				onClose: () => Wn(null),
				className: "sf-file-preview-modal",
				footer: /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [
					/* @__PURE__ */ (0, C.jsx)("a", {
						className: "sf-icon-action",
						href: M.url || r.downloadUrl(S, M.path),
						target: "_blank",
						rel: "noopener noreferrer",
						title: h("download"),
						"aria-label": h("download"),
						children: /* @__PURE__ */ (0, C.jsx)(i, { name: "download" })
					}),
					/* @__PURE__ */ (0, C.jsx)("button", {
						className: "sf-icon-action",
						type: "button",
						onClick: () => void di(M),
						title: h("share"),
						"aria-label": h("share"),
						children: /* @__PURE__ */ (0, C.jsx)(i, { name: "share" })
					}),
					ar && M.capabilities?.["metadata.update"] !== !1 && /* @__PURE__ */ (0, C.jsx)("button", {
						className: "sf-icon-action",
						type: "button",
						onClick: () => void fi(M),
						title: h("assetMetadata"),
						"aria-label": h("assetMetadata"),
						children: /* @__PURE__ */ (0, C.jsx)(i, { name: "asset-metadata" })
					}),
					/* @__PURE__ */ (0, C.jsx)("button", {
						className: "primary",
						onClick: () => Wn(null),
						children: h("close")
					})
				] }),
				children: /* @__PURE__ */ (0, C.jsxs)("div", {
					className: "sf-file-preview-body",
					children: [oi(M) ? /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
						fallback: /* @__PURE__ */ (0, C.jsx)("div", {
							className: "sf-state",
							children: h("loading")
						}),
						children: /* @__PURE__ */ (0, C.jsx)(et, {
							api: r,
							resource: S,
							entry: M,
							labels: {
								actual: h("actualSize"),
								fit: h("fitToWindow"),
								zoom: h("zoomLevel"),
								center: h("centerImage"),
								loading: h("loadingOriginalImage"),
								failed: h("imagePreviewFailed"),
								retry: h("retryImagePreview"),
								warning: h("largeOriginalImageWarning"),
								continue: h("continueOriginalImage"),
								cancel: h("cancel"),
								dimensions: h("dimensions"),
								size: h("size")
							}
						})
					}) : /* @__PURE__ */ (0, C.jsx)("div", {
						className: "sf-file-preview-content",
						children: u.textPreview !== !1 && Gn?.path === M.path ? /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("pre", {
							className: "sf-text-preview",
							children: Gn.content
						}), Gn.truncated && /* @__PURE__ */ (0, C.jsx)("p", {
							className: "sf-warning",
							children: h("previewTruncated")
						})] }) : De(M, _i)?.plugin === "document-preview" ? /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
							fallback: null,
							children: /* @__PURE__ */ (0, C.jsx)(Be, {
								api: r,
								resource: S,
								entry: M,
								labels: {
									submitting: h("previewSubmitting"),
									queued: h("previewQueued"),
									converting: h("previewConverting"),
									loading: h("previewLoading"),
									failed: h("previewFailed"),
									retry: h("previewRetry"),
									elapsed: (e) => h("previewElapsed").replace("{seconds}", String(e))
								}
							})
						}) : Oe(M, _i, S) ? /* @__PURE__ */ (0, C.jsx)("iframe", {
							className: "sf-document-preview",
							src: Oe(M, _i, S) || void 0,
							title: M.name
						}) : /* @__PURE__ */ (0, C.jsxs)("div", {
							className: "sf-file-preview-fallback",
							children: [/* @__PURE__ */ (0, C.jsx)(c, { kind: "file" }), /* @__PURE__ */ (0, C.jsx)("p", { children: h("previewUnavailable") })]
						})
					}), /* @__PURE__ */ (0, C.jsxs)("dl", {
						className: "sf-file-preview-meta",
						children: [
							/* @__PURE__ */ (0, C.jsx)("dt", { children: h("type") }),
							/* @__PURE__ */ (0, C.jsx)("dd", { children: M.mimeType || h("file") }),
							/* @__PURE__ */ (0, C.jsx)("dt", { children: h("size") }),
							/* @__PURE__ */ (0, C.jsx)("dd", { children: l(M.size) }),
							/* @__PURE__ */ (0, C.jsx)("dt", { children: h("modified") }),
							/* @__PURE__ */ (0, C.jsx)("dd", { children: /* @__PURE__ */ (0, C.jsx)("time", {
								dateTime: (/* @__PURE__ */ new Date(M.modifiedAt * 1e3)).toISOString(),
								children: _.format(M.modifiedAt * 1e3)
							}) }),
							/* @__PURE__ */ (0, C.jsx)("dt", { children: h("location") }),
							/* @__PURE__ */ (0, C.jsx)("dd", { children: M.path }),
							u.checksum !== !1 && /* @__PURE__ */ (0, C.jsxs)(C.Fragment, { children: [/* @__PURE__ */ (0, C.jsx)("dt", { children: "SHA-256" }), /* @__PURE__ */ (0, C.jsx)("dd", { children: qn?.path === M.path ? /* @__PURE__ */ (0, C.jsx)("code", {
								className: "sf-checksum",
								children: qn.value
							}) : /* @__PURE__ */ (0, C.jsx)("button", {
								onClick: () => void r.checksum(S, M.path).then((e) => Jn({
									path: M.path,
									value: e.checksum
								})).catch(N),
								children: h("calculateChecksum")
							}) })] })
						]
					})]
				})
			}),
			Yn && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: h("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(Je, {
					...Yn,
					showQrCode: j.qrCode && u.qrCode !== !1,
					labels: {
						title: h("share"),
						close: h("close"),
						copyUrl: h("copyUrl"),
						copied: h("urlCopied"),
						copyFailed: h("copyUrlFailed"),
						downloadQr: h("downloadQrCode"),
						loginRequired: h("loginRequired"),
						expires: h("linkExpires"),
						hint: h("shareHint"),
						qrCode: h("qrCode"),
						qrFailed: h("qrCodeFailed")
					},
					formatDate: (e) => _.format(e * 1e3),
					onClose: () => Xn(null)
				})
			}),
			On && u.imageProcessing !== !1 && ci.length > 0 && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: h("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(Re, {
					entries: ci,
					resource: S,
					formats: $n.formats.filter((e) => e.edit && [
						"jpeg",
						"png",
						"webp",
						"avif"
					].includes(e.format)).map((e) => e.format),
					labels: {
						title: h("imageProcess"),
						close: h("close"),
						cancel: h("cancel"),
						apply: h("applyImageProcess"),
						processing: h("processingImages"),
						selected: h("processingSelected"),
						operation: h("operation"),
						optimize: h("optimizeImage"),
						textWatermark: h("textWatermark"),
						imageWatermark: h("imageWatermark"),
						outputFormat: h("outputFormat"),
						keepFormat: h("keepFormat"),
						watermarkText: h("watermarkText"),
						color: h("color"),
						watermarkResource: h("watermarkResource"),
						watermarkPath: h("watermarkPath"),
						position: h("position"),
						topLeft: h("topLeft"),
						topRight: h("topRight"),
						center: h("center"),
						bottomLeft: h("bottomLeft"),
						bottomRight: h("bottomRight"),
						opacity: h("opacity"),
						scale: h("watermarkScale"),
						quality: h("quality"),
						saveMode: h("saveMode"),
						saveCopy: h("saveCopy"),
						overwrite: h("overwrite"),
						conversionCopyHint: h("conversionCopyHint"),
						overwriteWarning: h("confirmImageOverwrite")
					},
					onClose: () => kn(!1),
					onApply: async (e, t) => {
						if (ci.length === 1) await r.applyImageActions(S, ci[0].path, e, t), k(`${h("completed")}: 1`);
						else {
							let n = await r.applyImageBatch(S, ci.map((e) => e.path), e, t);
							k(`${h("completed")}: ${n.succeeded} · ${h("failed")}: ${n.failed}`);
						}
						kn(!1), await P();
					}
				})
			}),
			En && R && Ut && /* @__PURE__ */ (0, C.jsx)(g.Suspense, {
				fallback: /* @__PURE__ */ (0, C.jsx)("div", {
					className: "sf-state",
					children: h("loading")
				}),
				children: /* @__PURE__ */ (0, C.jsx)(Le, {
					entry: R,
					info: Ut,
					imageUrl: r.contentUrl(S, R.path),
					maximumFileNameLength: F?.maxFileNameLength ?? 120,
					labels: {
						crop: h("crop"),
						close: h("close"),
						cancel: h("cancel"),
						save: h("save"),
						saving: h("saving"),
						ratio: h("ratio"),
						free: h("freeRatio"),
						original: h("originalRatio"),
						zoom: h("zoom"),
						undo: h("undo"),
						redo: h("redo"),
						reset: h("reset"),
						compare: h("compare"),
						x: "X",
						y: "Y",
						width: h("width"),
						height: h("height"),
						saveMode: h("saveMode"),
						saveCopy: h("saveCopy"),
						overwrite: h("overwrite"),
						fileName: h("fileName"),
						fileNameTooLong: h("fileNameTooLongMaximum"),
						invalidFileName: h("invalidEntryName"),
						formatLocked: h("imageFormatLocked"),
						overwriteWarning: h("confirmImageOverwrite"),
						panHint: h("panHint")
					},
					onClose: () => Dn(!1),
					onSave: async (e, t) => {
						let n = await r.applyImageActions(S, R.path, e, t);
						Dn(!1), k(`${h("imageCreated")}: ${n.entry.name} · ${n.result.width} × ${n.result.height} px`), await P();
					}
				})
			}),
			/* @__PURE__ */ (0, C.jsxs)(g.Suspense, {
				fallback: null,
				children: [Hn && /* @__PURE__ */ (0, C.jsx)(Qe, {
					x: Hn.x,
					y: Hn.y,
					onClose: () => Un(null),
					onSelect: () => {
						Un(null), Hn.favorite ? xa(Hn.link.path) : ba(Hn.link);
					},
					items: [{
						id: "remove",
						label: h(Hn.favorite ? "removeFavorite" : "unpinQuickAccess")
					}]
				}), Bn && /* @__PURE__ */ (0, C.jsx)(Qe, {
					x: Bn.x,
					y: Bn.y,
					onClose: () => Vn(null),
					onSelect: Ui,
					items: [
						{
							id: Bn.entry.directory ? "open" : "preview",
							label: Bn.entry.directory ? h("open") : h("preview")
						},
						...o === "picker" && !Bn.entry.directory ? [{
							id: "select",
							label: h("select"),
							disabled: !li(Bn.entry)
						}] : [],
						{
							id: "download",
							label: h("download"),
							disabled: Bn.entry.directory
						},
						{
							id: "share",
							label: h("share"),
							disabled: Bn.entry.directory
						},
						...o === "manager" ? [
							...j.favorites ? [{
								id: "favorite",
								label: Rt.favorites.includes(Bn.entry.path) ? h("removeFavorite") : h("favorite")
							}] : [],
							...da && j.sidebarQuickAccess && hi(Bn.entry) ? [{
								id: "quick-access",
								label: Rt.quickAccess.includes(Bn.entry.path) ? h("unpinQuickAccess") : h("pinQuickAccess")
							}] : [],
							...ar && !Bn.entry.directory && Bn.entry.capabilities?.["metadata.update"] !== !1 ? [{
								id: "asset-metadata",
								label: h("assetMetadata")
							}] : [],
							{
								id: "rename",
								label: h("rename"),
								disabled: Bn.entry.capabilities?.rename === !1
							},
							{
								id: "copy",
								label: h("copy"),
								disabled: Bn.entry.capabilities?.copy === !1
							},
							{
								id: "move",
								label: h("move"),
								disabled: Bn.entry.capabilities?.move === !1
							},
							{
								id: "delete",
								label: h("remove"),
								disabled: Bn.entry.capabilities?.delete === !1,
								danger: !0
							},
							...gi.filter((e) => e.slot === "context").map((e) => ({
								id: `plugin:${e.plugin}:${e.id}`,
								label: Ee(e, d),
								disabled: !ke(e, Bn.entry)
							}))
						] : []
					]
				})]
			}),
			/* @__PURE__ */ (0, C.jsx)("div", {
				className: "sf-sr-only",
				"aria-live": "polite",
				children: L.length > 0 ? `${L.length} ${h("selectedCount")}` : jt
			})
		]
	});
}
var at = (e) => !!(e && (e.startsWith("text/") || [
	"application/json",
	"application/ld+json",
	"application/xml",
	"application/x-yaml",
	"application/yaml"
].includes(e) || e.endsWith("+json") || e.endsWith("+xml"))), ot = document.getElementById("sofinder-root");
if (!ot) throw Error("SoFinder root element was not found.");
var st = JSON.parse(ot.dataset.config || "{}");
ee(S(st.language)).then((e) => {
	(0, _.createRoot)(ot).render(/* @__PURE__ */ (0, C.jsx)(g.StrictMode, { children: /* @__PURE__ */ (0, C.jsx)(it, {
		config: st,
		initialMessages: e
	}) }));
});
//#endregion
