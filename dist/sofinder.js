import { n as e, t } from "./jsx-runtime-CmCsaYvT.js";
import { t as n } from "./react-B5TC723I.js";
import { t as r } from "./UiIcon-CeAgi5_o.js";
import { t as i } from "./Modal-aP8IYcPB.js";
import { t as a } from "./nameValidation-DURyMFRU.js";
import { n as o, t as s } from "./EntryVisuals-COz6M0oc.js";
import { t as c } from "./format-GD3_dnvn.js";
//#region node_modules/.pnpm/scheduler@0.27.0/node_modules/scheduler/cjs/scheduler.production.js
var l = /* @__PURE__ */ e(((e) => {
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
			if (n(c) !== null) m = !0, S || (S = !0, T());
			else {
				var t = n(l);
				t !== null && ae(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, ee = -1;
	function te() {
		return g ? !0 : !(e.unstable_now() - ee < w);
	}
	function ne() {
		if (g = !1, S) {
			var t = e.unstable_now();
			ee = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && te());) {
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
				i ? T() : S = !1;
			}
		}
	}
	var T;
	if (typeof y == "function") T = function() {
		y(ne);
	};
	else if (typeof MessageChannel < "u") {
		var re = new MessageChannel(), ie = re.port2;
		re.port1.onmessage = ne, T = function() {
			ie.postMessage(null);
		};
	} else T = function() {
		_(ne, 0);
	};
	function ae(t, n) {
		C = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : w = 0 < e ? Math.floor(1e3 / e) : 5;
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
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, ae(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, T()))), r;
	}, e.unstable_shouldYield = te, e.unstable_wrapCallback = function(e) {
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
})), u = /* @__PURE__ */ e(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ e(((e) => {
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
})), f = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = d();
})), p = /* @__PURE__ */ e(((e) => {
	var t = u(), r = n(), i = f();
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
	function d(e) {
		if (s(e) !== e) throw Error(a(188));
	}
	function p(e) {
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
					if (o === n) return d(i), e;
					if (o === r) return d(i), t;
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
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), S = Symbol.for("react.consumer"), C = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), ee = Symbol.for("react.suspense"), te = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), re = Symbol.for("react.activity"), ie = Symbol.for("react.memo_cache_sentinel"), ae = Symbol.iterator;
	function oe(e) {
		return typeof e != "object" || !e ? null : (e = ae && e[ae] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var se = Symbol.for("react.client.reference");
	function ce(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === se ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case ee: return "Suspense";
			case te: return "SuspenseList";
			case re: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case C: return e.displayName || "Context";
			case S: return (e._context.displayName || "Context") + ".Consumer";
			case w:
				var t = e.render;
				return e = e.displayName, e || (e = t.displayName || t.name || "", e = e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case ne: return t = e.displayName || null, t === null ? ce(e.type) || "Memo" : t;
			case T:
				t = e._payload, e = e._init;
				try {
					return ce(e(t));
				} catch {}
		}
		return null;
	}
	var le = Array.isArray, E = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, D = i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ue = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, de = [], fe = -1;
	function pe(e) {
		return { current: e };
	}
	function me(e) {
		0 > fe || (e.current = de[fe], de[fe] = null, fe--);
	}
	function O(e, t) {
		fe++, de[fe] = e.current, e.current = t;
	}
	var he = pe(null), ge = pe(null), _e = pe(null), ve = pe(null);
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
		me(he), O(he, e);
	}
	function be() {
		me(he), me(ge), me(_e);
	}
	function xe(e) {
		e.memoizedState !== null && O(ve, e);
		var t = he.current, n = Hd(t, e.type);
		t !== n && (O(ge, e), O(he, n));
	}
	function Se(e) {
		ge.current === e && (me(he), me(ge)), ve.current === e && (me(ve), Qf._currentValue = ue);
	}
	var Ce, we;
	function Te(e) {
		if (Ce === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Ce = t && t[1] || "", we = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Ce + e + we;
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
		var e = D.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : mp(e.type)) : e;
	}
	function mt(e, t) {
		var n = D.p;
		try {
			return D.p = e, t();
		} finally {
			D.p = n;
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
	function Mt(e, t) {
		Nt(e, t), Nt(e + "Capture", t);
	}
	function Nt(e, t) {
		for (jt[e] = t, e = 0; e < t.length; e++) At.add(t[e]);
	}
	var Pt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ft = {}, It = {};
	function Lt(e) {
		return Ae.call(It, e) ? !0 : Ae.call(Ft, e) ? !1 : Pt.test(e) ? It[e] = !0 : (Ft[e] = !0, !1);
	}
	function Rt(e, t, n) {
		if (Lt(t)) {
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
	function zt(e, t, n) {
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
	function Bt(e, t, n, r) {
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
	function Vt(e) {
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
	function k(e) {
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
			var t = k(e) ? "checked" : "value";
			e._valueTracker = Ht(e, t, "" + e[t]);
		}
	}
	function Wt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = k(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
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
	function A(e) {
		return e.replace(Kt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function qt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Vt(t)) : e.value !== "" + Vt(t) && (e.value = "" + Vt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Yt(e, o, Vt(n)) : Yt(e, o, Vt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Vt(s) : e.removeAttribute("name");
	}
	function Jt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Ut(e);
				return;
			}
			n = n == null ? "" : "" + Vt(n), t = t == null ? n : "" + Vt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r = r ?? i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Ut(e);
	}
	function Yt(e, t, n) {
		t === "number" && Gt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Xt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Vt(n), t = null, i = 0; i < e.length; i++) {
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
		if (t != null && (t = "" + Vt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Vt(n);
	}
	function Qt(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(a(92));
				if (le(r)) {
					if (1 < r.length) throw Error(a(93));
					r = r[0];
				}
				n = r;
			}
			n ?? (n = ""), t = n;
		}
		n = Vt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Ut(e);
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
	var an = /* @__PURE__ */ new Map([
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
	]), on = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function sn(e) {
		return on.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function cn() {}
	var ln = null;
	function un(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var dn = null, fn = null;
	function pn(e) {
		var t = Et(e);
		if (t && (e = t.stateNode)) {
			var n = e[_t] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (qt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + A("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var i = r[_t] || null;
								if (!i) throw Error(a(90));
								qt(r, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Wt(r);
					}
					break a;
				case "textarea":
					Zt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Xt(e, !!n.multiple, t, !1);
			}
		}
	}
	var mn = !1;
	function hn(e, t, n) {
		if (mn) return e(t, n);
		mn = !0;
		try {
			return e(t);
		} finally {
			if (mn = !1, (dn !== null || fn !== null) && (bu(), dn && (t = dn, e = fn, fn = dn = null, pn(t), e))) for (t = 0; t < e.length; t++) pn(e[t]);
		}
	}
	function gn(e, t) {
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
	var _n = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), vn = !1;
	if (_n) try {
		var yn = {};
		Object.defineProperty(yn, "passive", { get: function() {
			vn = !0;
		} }), window.addEventListener("test", yn, yn), window.removeEventListener("test", yn, yn);
	} catch {
		vn = !1;
	}
	var bn = null, xn = null, Sn = null;
	function Cn() {
		if (Sn) return Sn;
		var e, t = xn, n = t.length, r, i = "value" in bn ? bn.value : bn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return Sn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function wn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function Tn() {
		return !0;
	}
	function En() {
		return !1;
	}
	function Dn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? Tn : En, this.isPropagationStopped = En, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Tn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Tn);
			},
			persist: function() {},
			isPersistent: Tn
		}), t;
	}
	var On = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, kn = Dn(On), An = h({}, On, {
		view: 0,
		detail: 0
	}), jn = Dn(An), Mn, Nn, Pn, Fn = h({}, An, {
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
		getModifierState: Gn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Pn && (Pn && e.type === "mousemove" ? (Mn = e.screenX - Pn.screenX, Nn = e.screenY - Pn.screenY) : Nn = Mn = 0, Pn = e), Mn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Nn;
		}
	}), In = Dn(Fn), Ln = Dn(h({}, Fn, { dataTransfer: 0 })), Rn = Dn(h({}, An, { relatedTarget: 0 })), zn = Dn(h({}, On, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Bn = Dn(h({}, On, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Vn = Dn(h({}, On, { data: 0 })), Hn = {
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
	}, Un = {
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
	}, j = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Wn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = j[e]) ? !!t[e] : !1;
	}
	function Gn() {
		return Wn;
	}
	var Kn = Dn(h({}, An, {
		key: function(e) {
			if (e.key) {
				var t = Hn[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = wn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Un[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Gn,
		charCode: function(e) {
			return e.type === "keypress" ? wn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? wn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), qn = Dn(h({}, Fn, {
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
	})), Jn = Dn(h({}, An, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Gn
	})), Yn = Dn(h({}, On, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Xn = Dn(h({}, Fn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Zn = Dn(h({}, On, {
		newState: 0,
		oldState: 0
	})), Qn = [
		9,
		13,
		27,
		32
	], $n = _n && "CompositionEvent" in window, er = null;
	_n && "documentMode" in document && (er = document.documentMode);
	var tr = _n && "TextEvent" in window && !er, nr = _n && (!$n || er && 8 < er && 11 >= er), rr = " ", ir = !1;
	function ar(e, t) {
		switch (e) {
			case "keyup": return Qn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function or(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var sr = !1;
	function cr(e, t) {
		switch (e) {
			case "compositionend": return or(t);
			case "keypress": return t.which === 32 ? (ir = !0, rr) : null;
			case "textInput": return e = t.data, e === rr && ir ? null : e;
			default: return null;
		}
	}
	function lr(e, t) {
		if (sr) return e === "compositionend" || !$n && ar(e, t) ? (e = Cn(), Sn = xn = bn = null, sr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return nr && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var ur = {
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
	function dr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!ur[e.type] : t === "textarea";
	}
	function fr(e, t, n, r) {
		dn ? fn ? fn.push(r) : fn = [r] : dn = r, t = Ed(t, "onChange"), 0 < t.length && (n = new kn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var pr = null, mr = null;
	function hr(e) {
		yd(e, 0);
	}
	function gr(e) {
		if (Wt(Dt(e))) return e;
	}
	function _r(e, t) {
		if (e === "change") return t;
	}
	var vr = !1;
	if (_n) {
		var yr;
		if (_n) {
			var br = "oninput" in document;
			if (!br) {
				var xr = document.createElement("div");
				xr.setAttribute("oninput", "return;"), br = typeof xr.oninput == "function";
			}
			yr = br;
		} else yr = !1;
		vr = yr && (!document.documentMode || 9 < document.documentMode);
	}
	function M() {
		pr && (pr.detachEvent("onpropertychange", Sr), mr = pr = null);
	}
	function Sr(e) {
		if (e.propertyName === "value" && gr(mr)) {
			var t = [];
			fr(t, mr, e, un(e)), hn(hr, t);
		}
	}
	function Cr(e, t, n) {
		e === "focusin" ? (M(), pr = t, mr = n, pr.attachEvent("onpropertychange", Sr)) : e === "focusout" && M();
	}
	function wr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return gr(mr);
	}
	function Tr(e, t) {
		if (e === "click") return gr(t);
	}
	function Er(e, t) {
		if (e === "input" || e === "change") return gr(t);
	}
	function Dr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Or = typeof Object.is == "function" ? Object.is : Dr;
	function N(e, t) {
		if (Or(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Ae.call(t, i) || !Or(e[i], t[i])) return !1;
		}
		return !0;
	}
	function P(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function kr(e, t) {
		var n = P(e);
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
			n = P(n);
		}
	}
	function Ar(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Ar(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function jr(e) {
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
	function Mr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Nr = _n && "documentMode" in document && 11 >= document.documentMode, Pr = null, Fr = null, Ir = null, Lr = !1;
	function Rr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Lr || Pr == null || Pr !== Gt(r) || (r = Pr, "selectionStart" in r && Mr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Ir && N(Ir, r) || (Ir = r, r = Ed(Fr, "onSelect"), 0 < r.length && (t = new kn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Pr)));
	}
	function zr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Br = {
		animationend: zr("Animation", "AnimationEnd"),
		animationiteration: zr("Animation", "AnimationIteration"),
		animationstart: zr("Animation", "AnimationStart"),
		transitionrun: zr("Transition", "TransitionRun"),
		transitionstart: zr("Transition", "TransitionStart"),
		transitioncancel: zr("Transition", "TransitionCancel"),
		transitionend: zr("Transition", "TransitionEnd")
	}, Vr = {}, Hr = {};
	_n && (Hr = document.createElement("div").style, "AnimationEvent" in window || (delete Br.animationend.animation, delete Br.animationiteration.animation, delete Br.animationstart.animation), "TransitionEvent" in window || delete Br.transitionend.transition);
	function Ur(e) {
		if (Vr[e]) return Vr[e];
		if (!Br[e]) return e;
		var t = Br[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Hr) return Vr[e] = t[n];
		return e;
	}
	var Wr = Ur("animationend"), Gr = Ur("animationiteration"), Kr = Ur("animationstart"), qr = Ur("transitionrun"), Jr = Ur("transitionstart"), Yr = Ur("transitioncancel"), Xr = Ur("transitionend"), Zr = /* @__PURE__ */ new Map(), Qr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Qr.push("scrollEnd");
	function F(e, t) {
		Zr.set(e, t), Mt(t, [e]);
	}
	var I = typeof reportError == "function" ? reportError : function(e) {
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
	}, $r = [], ei = 0, ti = 0;
	function ni() {
		for (var e = ei, t = ti = ei = 0; t < e;) {
			var n = $r[t];
			$r[t++] = null;
			var r = $r[t];
			$r[t++] = null;
			var i = $r[t];
			$r[t++] = null;
			var a = $r[t];
			if ($r[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && oi(n, i, a);
		}
	}
	function ri(e, t, n, r) {
		$r[ei++] = e, $r[ei++] = t, $r[ei++] = n, $r[ei++] = r, ti |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function ii(e, t, n, r) {
		return ri(e, t, n, r), si(e);
	}
	function ai(e, t) {
		return ri(e, null, null, t), si(e);
	}
	function oi(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - qe(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function si(e) {
		if (50 < du) throw du = 0, fu = null, Error(a(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var ci = {};
	function li(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function ui(e, t, n, r) {
		return new li(e, t, n, r);
	}
	function di(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function fi(e, t) {
		var n = e.alternate;
		return n === null ? (n = ui(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
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
		if (r = e, typeof e == "function") di(e) && (s = 1);
		else if (typeof e == "string") s = Uf(e, n, he.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case re: return e = ui(31, n, t, i), e.elementType = re, e.lanes = o, e;
			case y: return hi(n.children, i, o, t);
			case b:
				s = 8, i |= 24;
				break;
			case x: return e = ui(12, n, t, i | 2), e.elementType = x, e.lanes = o, e;
			case ee: return e = ui(13, n, t, i), e.elementType = ee, e.lanes = o, e;
			case te: return e = ui(19, n, t, i), e.elementType = te, e.lanes = o, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case C:
						s = 10;
						break a;
					case S:
						s = 9;
						break a;
					case w:
						s = 11;
						break a;
					case ne:
						s = 14;
						break a;
					case T:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(a(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = ui(s, n, t, i), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function hi(e, t, n, r) {
		return e = ui(7, e, r, t), e.lanes = n, e;
	}
	function gi(e, t, n) {
		return e = ui(6, e, null, t), e.lanes = n, e;
	}
	function _i(e) {
		var t = ui(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function vi(e, t, n) {
		return t = ui(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
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
				stack: ke(t)
			}, yi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: ke(t)
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
		var i = 32 - qe(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - qe(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Oi = 1 << 32 - qe(t) + i | n << i | r, ki = a + e;
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
	var Fi = null, L = null, R = !1, Ii = null, Li = !1, Ri = Error(a(519));
	function zi(e) {
		throw Gi(bi(Error(a(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Ri;
	}
	function Bi(e) {
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
				Q("invalid", t), Jt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), Qt(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Md(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = cn), t = !0) : t = !1, t || zi(e, !0);
	}
	function Vi(e) {
		for (Fi = e.return; Fi;) switch (Fi.tag) {
			case 5:
			case 31:
			case 13:
				Li = !1;
				return;
			case 27:
			case 3:
				Li = !0;
				return;
			default: Fi = Fi.return;
		}
	}
	function Hi(e) {
		if (e !== Fi) return !1;
		if (!R) return Vi(e), R = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || Ud(e.type, e.memoizedProps)), n = !n), n && L && zi(e), Vi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(317));
			L = uf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(317));
			L = uf(e);
		} else t === 27 ? (t = L, Zd(e.type) ? (e = lf, lf = null, L = e) : L = t) : L = Fi ? cf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Ui() {
		L = Fi = null, R = !1;
	}
	function Wi() {
		var e = Ii;
		return e !== null && (Zl === null ? Zl = e : Zl.push.apply(Zl, e), Ii = null), e;
	}
	function Gi(e) {
		Ii === null ? Ii = [e] : Ii.push(e);
	}
	var Ki = pe(null), qi = null, Ji = null;
	function Yi(e, t, n) {
		O(Ki, t._currentValue), t._currentValue = n;
	}
	function Xi(e) {
		e._currentValue = Ki.current, me(Ki);
	}
	function Zi(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Qi(e, t, n, r) {
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
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Zi(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (i.tag === 18) {
				if (s = i.return, s === null) throw Error(a(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Zi(s, n, e), s = null;
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
	function $i(e, t, n, r) {
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
					Or(i.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (i === ve.current) {
				if (s = i.alternate, s === null) throw Error(a(387));
				s.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e === null ? e = [Qf] : e.push(Qf));
			}
			i = i.return;
		}
		e !== null && Qi(t, e, n, r), t.flags |= 262144;
	}
	function ea(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Or(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function ta(e) {
		qi = e, Ji = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function na(e) {
		return ia(qi, e);
	}
	function ra(e, t) {
		return qi === null && ta(e), ia(e, t);
	}
	function ia(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Ji === null) {
			if (e === null) throw Error(a(308));
			Ji = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Ji = Ji.next = t;
		return n;
	}
	var aa = typeof AbortController < "u" ? AbortController : function() {
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
	}, oa = t.unstable_scheduleCallback, sa = t.unstable_NormalPriority, z = {
		$$typeof: C,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function ca() {
		return {
			controller: new aa(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function la(e) {
		e.refCount--, e.refCount === 0 && oa(sa, function() {
			e.controller.abort();
		});
	}
	var ua = null, B = 0, da = 0, fa = null;
	function pa(e, t) {
		if (ua === null) {
			var n = ua = [];
			B = 0, da = dd(), fa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return B++, t.then(ma, ma), t;
	}
	function ma() {
		if (--B === 0 && ua !== null) {
			fa !== null && (fa.status = "fulfilled");
			var e = ua;
			ua = null, da = 0, fa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function ha(e, t) {
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
	var ga = E.S;
	E.S = function(e, t) {
		eu = Fe(), typeof t == "object" && t && typeof t.then == "function" && pa(e, t), ga !== null && ga(e, t);
	};
	var _a = pe(null);
	function va() {
		var e = _a.current;
		return e === null ? K.pooledCache : e;
	}
	function ya(e, t) {
		t === null ? O(_a, _a.current) : O(_a, t.pool);
	}
	function ba() {
		var e = va();
		return e === null ? null : {
			parent: z._currentValue,
			pool: e
		};
	}
	var xa = Error(a(460)), Sa = Error(a(474)), Ca = Error(a(542)), wa = { then: function() {} };
	function Ta(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Ea(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(cn, cn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Aa(e), e;
			default:
				if (typeof t.status == "string") t.then(cn, cn);
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
					case "rejected": throw e = t.reason, Aa(e), e;
				}
				throw Oa = t, xa;
		}
	}
	function Da(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Oa = e, xa) : e;
		}
	}
	var Oa = null;
	function ka() {
		if (Oa === null) throw Error(a(459));
		var e = Oa;
		return Oa = null, e;
	}
	function Aa(e) {
		if (e === xa || e === Ca) throw Error(a(483));
	}
	var ja = null, Ma = 0;
	function Na(e) {
		var t = Ma;
		return Ma += 1, ja === null && (ja = []), Ea(ja, e, t);
	}
	function Pa(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Fa(e, t) {
		throw t.$$typeof === g ? Error(a(525)) : (e = Object.prototype.toString.call(t), Error(a(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function Ia(e) {
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
			return a === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === a || typeof a == "object" && a && a.$$typeof === T && Da(a) === t.type) ? (t = i(t, n.props), Pa(t, n), t.return = e, t) : (t = mi(n.type, n.key, n.props, null, e.mode, r), Pa(t, n), t.return = e, t);
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
					case _: return n = mi(t.type, t.key, t.props, null, e.mode, n), Pa(n, t), n.return = e, n;
					case v: return t = vi(t, e.mode, n), t.return = e, t;
					case T: return t = Da(t), f(e, t, n);
				}
				if (le(t) || oe(t)) return t = hi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Na(t), n);
				if (t.$$typeof === C) return f(e, ra(e, t), n);
				Fa(e, t);
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
					case T: return n = Da(n), p(e, t, n, r);
				}
				if (le(n) || oe(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Na(n), r);
				if (n.$$typeof === C) return p(e, t, ra(e, n), r);
				Fa(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case T: return r = Da(r), m(e, t, n, r, i);
				}
				if (le(r) || oe(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Na(r), i);
				if (r.$$typeof === C) return m(e, t, n, ra(t, r), i);
				Fa(t, r);
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
			if (h === s.length) return n(i, d), R && Ai(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return R && Ai(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), R && Ai(i, h), l;
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
			if (v.done) return n(i, h), R && Ai(i, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(i, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return R && Ai(i, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, i, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(i, e);
			}), R && Ai(i, g), u;
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
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === T && Da(l) === r.type) {
										n(e, r.sibling), c = i(r, o.props), Pa(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === y ? (c = hi(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = mi(o.type, o.key, o.props, null, e.mode, c), Pa(c, o), c.return = e, e = c);
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
					case T: return o = Da(o), b(e, r, o, c);
				}
				if (le(o)) return h(e, r, o, c);
				if (oe(o)) {
					if (l = oe(o), typeof l != "function") throw Error(a(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Na(o), c);
				if (o.$$typeof === C) return b(e, r, ra(e, o), c);
				Fa(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = i(r, o), c.return = e, e = c) : (n(e, r), c = gi(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Ma = 0;
				var i = b(e, t, n, r);
				return ja = null, i;
			} catch (t) {
				if (t === xa || t === Ca) throw t;
				var a = ui(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var La = Ia(!0), Ra = Ia(!1), za = !1;
	function Ba(e) {
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
	function Va(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Ha(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Ua(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, G & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = si(e), oi(e, null, n), t;
		}
		return ri(e, r, t, n), si(e);
	}
	function Wa(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, lt(e, n);
		}
	}
	function Ga(e, t) {
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
	var Ka = !1;
	function qa() {
		if (Ka) {
			var e = fa;
			if (e !== null) throw e;
		}
	}
	function Ja(e, t, n, r) {
		Ka = !1;
		var i = e.updateQueue;
		za = !1;
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
					f !== 0 && f === da && (Ka = !0), u !== null && (u = u.next = {
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
							case 2: za = !0;
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
	function Ya(e, t) {
		if (typeof e != "function") throw Error(a(191, e));
		e.call(t);
	}
	function Xa(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Ya(n[e], t);
	}
	var Za = pe(null), Qa = pe(0);
	function $a(e, t) {
		e = Wl, O(Qa, e), O(Za, t), Wl = e | t.baseLanes;
	}
	function eo() {
		O(Qa, Wl), O(Za, Za.current);
	}
	function to() {
		Wl = Qa.current, me(Za), me(Qa);
	}
	var no = pe(null), ro = null;
	function io(e) {
		var t = e.alternate;
		O(lo, lo.current & 1), O(no, e), ro === null && (t === null || Za.current !== null || t.memoizedState !== null) && (ro = e);
	}
	function ao(e) {
		O(lo, lo.current), O(no, e), ro === null && (ro = e);
	}
	function oo(e) {
		e.tag === 22 ? (O(lo, lo.current), O(no, e), ro === null && (ro = e)) : so(e);
	}
	function so() {
		O(lo, lo.current), O(no, no.current);
	}
	function co(e) {
		me(no), ro === e && (ro = null), me(lo);
	}
	var lo = pe(0);
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
	function xo() {
		throw Error(a(321));
	}
	function So(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Or(e[n], t[n])) return !1;
		return !0;
	}
	function Co(e, t, n, r, i, a) {
		return fo = a, V = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, E.H = e === null || e.memoizedState === null ? Bs : Vs, go = !1, a = n(r, i), go = !1, ho && (a = To(t, n, r, i)), wo(e), a;
	}
	function wo(e) {
		E.H = zs;
		var t = H !== null && H.next !== null;
		if (fo = 0, po = H = V = null, mo = !1, vo = 0, yo = null, t) throw Error(a(300));
		e === null || ic || (e = e.dependencies, e !== null && ea(e) && (ic = !0));
	}
	function To(e, t, n, r) {
		V = e;
		var i = 0;
		do {
			if (ho && (yo = null), vo = 0, ho = !1, 25 <= i) throw Error(a(301));
			if (i += 1, po = H = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			E.H = Hs, o = t(n, r);
		} while (ho);
		return o;
	}
	function Eo() {
		var e = E.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? No(t) : t, e = e.useState()[0], (H === null ? null : H.memoizedState) !== e && (V.flags |= 1024), t;
	}
	function Do() {
		var e = _o !== 0;
		return _o = 0, e;
	}
	function Oo(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function ko(e) {
		if (mo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			mo = !1;
		}
		fo = 0, po = H = V = null, ho = !1, vo = _o = 0, yo = null;
	}
	function Ao() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return po === null ? V.memoizedState = po = e : po = po.next = e, po;
	}
	function jo() {
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
	function Mo() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function No(e) {
		var t = vo;
		return vo += 1, yo === null && (yo = []), e = Ea(yo, e, t), t = V, (po === null ? t.memoizedState : po.next) === null && (t = t.alternate, E.H = t === null || t.memoizedState === null ? Bs : Vs), e;
	}
	function Po(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return No(e);
			if (e.$$typeof === C) return na(e);
		}
		throw Error(a(438, String(e)));
	}
	function Fo(e) {
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
		}), n === null && (n = Mo(), V.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ie;
		return t.index++, n;
	}
	function Io(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Lo(e) {
		return Ro(jo(), H, e);
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
				if (f === u.lane ? (fo & f) === f : (J & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === da && (d = !0);
					else if ((fo & p) === p) {
						u = u.next, p === da && (d = !0);
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
			if (l === null ? s = o : l.next = c, !Or(o, e.memoizedState) && (ic = !0, d && (n = fa, n !== null))) throw n;
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
			Or(o, t.memoizedState) || (ic = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Bo(e, t, n) {
		var r = V, i = jo(), o = R;
		if (o) {
			if (n === void 0) throw Error(a(407));
			n = n();
		} else n = t();
		var s = !Or((H || i).memoizedState, n);
		if (s && (i.memoizedState = n, ic = !0), i = i.queue, ds(Uo.bind(null, r, i, e), [e]), i.getSnapshot !== t || s || po !== null && po.memoizedState.tag & 1) {
			if (r.flags |= 2048, os(9, { destroy: void 0 }, Ho.bind(null, r, i, n, t), null), K === null) throw Error(a(349));
			o || fo & 127 || Vo(r, t, n);
		}
		return n;
	}
	function Vo(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = V.updateQueue, t === null ? (t = Mo(), V.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
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
			return !Or(e, n);
		} catch {
			return !0;
		}
	}
	function Go(e) {
		var t = ai(e, 2);
		t !== null && hu(t, e, 2);
	}
	function Ko(e) {
		var t = Ao();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), go) {
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
			lastRenderedReducer: Io,
			lastRenderedState: e
		}, t;
	}
	function qo(e, t, n, r) {
		return e.baseState = n, Ro(e, H, typeof r == "function" ? r : Io);
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
			E.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Yo(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Yo(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = E.T, o = {};
			E.T = o;
			try {
				var s = n(i, r), c = E.S;
				c !== null && c(o, s), Xo(e, t, s);
			} catch (n) {
				Qo(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), E.T = a;
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
		if (R) {
			var n = K.formState;
			if (n !== null) {
				a: {
					var r = V;
					if (R) {
						if (L) {
							b: {
								for (var i = L, a = Li; i.nodeType !== 8;) {
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
								L = cf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						zi(r);
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
		}, n.queue = r, n = Ns.bind(null, V, r), r.dispatch = n, r = Ko(!1), a = Fs.bind(null, V, !1, r.queue), r = Ao(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Jo.bind(null, V, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function ns(e) {
		return rs(jo(), H, e);
	}
	function rs(e, t, n) {
		if (t = Ro(e, t, es)[0], e = Lo(Io)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = No(t);
		} catch (e) {
			throw e === xa ? Ca : e;
		}
		else r = t;
		t = jo();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (V.flags |= 2048, os(9, { destroy: void 0 }, is.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function is(e, t) {
		e.action = t;
	}
	function as(e) {
		var t = jo(), n = H;
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
		}, t = V.updateQueue, t === null && (t = Mo(), V.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function ss() {
		return jo().memoizedState;
	}
	function cs(e, t, n, r) {
		var i = Ao();
		V.flags |= e, i.memoizedState = os(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function ls(e, t, n, r) {
		var i = jo();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		H !== null && r !== null && So(r, H.memoizedState.deps) ? i.memoizedState = os(t, a, n, r) : (V.flags |= e, i.memoizedState = os(1 | t, a, n, r));
	}
	function us(e, t) {
		cs(8390656, 8, e, t);
	}
	function ds(e, t) {
		ls(2048, 8, e, t);
	}
	function fs(e) {
		V.flags |= 4;
		var t = V.updateQueue;
		if (t === null) t = Mo(), V.updateQueue = t, t.events = [e];
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
		if (r = e(), go) {
			Ke(!0);
			try {
				e();
			} finally {
				Ke(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function xs(e, t, n) {
		return n === void 0 || fo & 1073741824 && !(J & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = mu(), V.lanes |= e, Gl |= e, n);
	}
	function Ss(e, t, n, r) {
		return Or(n, t) ? n : Za.current === null ? !(fo & 42) || fo & 1073741824 && !(J & 261930) ? (ic = !0, e.memoizedState = n) : (e = mu(), V.lanes |= e, Gl |= e, t) : (e = xs(e, n, r), Or(e, t) || (ic = !0), e);
	}
	function Cs(e, t, n, r, i) {
		var a = D.p;
		D.p = a !== 0 && 8 > a ? a : 8;
		var o = E.T, s = {};
		E.T = s, Fs(e, !1, t, n);
		try {
			var c = i(), l = E.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Ps(e, t, ha(c, r), pu(e)) : Ps(e, t, r, pu(e));
		} catch (n) {
			Ps(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, pu());
		} finally {
			D.p = a, o !== null && s.types !== null && (o.types = s.types), E.T = o;
		}
	}
	function ws() {}
	function Ts(e, t, n, r) {
		if (e.tag !== 5) throw Error(a(476));
		var i = Es(e).queue;
		Cs(e, i, t, ue, n === null ? ws : function() {
			return Ds(e), n(r);
		});
	}
	function Es(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: ue,
			baseState: ue,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Io,
				lastRenderedState: ue
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
		return na(Qf);
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
					e = Ha(n);
					var r = Ua(t, e, n);
					r !== null && (hu(r, t, n), Wa(r, t, n)), t = { cache: ca() }, e.payload = t;
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
		}, Is(e) ? Ls(t, n) : (n = ii(e, t, n, r), n !== null && (hu(n, e, r), Rs(n, t, r)));
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
				if (i.hasEagerState = !0, i.eagerState = s, Or(s, o)) return ri(e, t, i, 0), K === null && ni(), !1;
			} catch {}
			if (n = ii(e, t, i, r), n !== null) return hu(n, e, r), Rs(n, t, r), !0;
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
		} else t = ii(e, n, r, 2), t !== null && hu(t, e, 2);
	}
	function Is(e) {
		var t = e.alternate;
		return e === V || t !== null && t === V;
	}
	function Ls(e, t) {
		ho = mo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Rs(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, lt(e, n);
		}
	}
	var zs = {
		readContext: na,
		use: Po,
		useCallback: xo,
		useContext: xo,
		useEffect: xo,
		useImperativeHandle: xo,
		useLayoutEffect: xo,
		useInsertionEffect: xo,
		useMemo: xo,
		useReducer: xo,
		useRef: xo,
		useState: xo,
		useDebugValue: xo,
		useDeferredValue: xo,
		useTransition: xo,
		useSyncExternalStore: xo,
		useId: xo,
		useHostTransitionStatus: xo,
		useFormState: xo,
		useActionState: xo,
		useOptimistic: xo,
		useMemoCache: xo,
		useCacheRefresh: xo
	};
	zs.useEffectEvent = xo;
	var Bs = {
		readContext: na,
		use: Po,
		useCallback: function(e, t) {
			return Ao().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: na,
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
			if (go) {
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
			var r = Ao();
			if (n !== void 0) {
				var i = n(t);
				if (go) {
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
			}, r.queue = e, e = e.dispatch = Ms.bind(null, V, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = Ao();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Ko(e);
			var t = e.queue, n = Ns.bind(null, V, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			return xs(Ao(), e, t);
		},
		useTransition: function() {
			var e = Ko(!1);
			return e = Cs.bind(null, V, e.queue, !0, !1), Ao().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = V, i = Ao();
			if (R) {
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
			if (R) {
				var n = ki, r = Oi;
				n = (r & ~(1 << 32 - qe(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = _o++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = bo++, t = "_" + t + "r_" + n.toString(32) + "_";
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
			return t.queue = n, t = Fs.bind(null, V, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Fo,
		useCacheRefresh: function() {
			return Ao().memoizedState = js.bind(null, V);
		},
		useEffectEvent: function(e) {
			var t = Ao(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (G & 2) throw Error(a(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Vs = {
		readContext: na,
		use: Po,
		useCallback: ys,
		useContext: na,
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
			return Ss(jo(), H.memoizedState, e, t);
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
			return qo(jo(), H, e, t);
		},
		useMemoCache: Fo,
		useCacheRefresh: As
	};
	Vs.useEffectEvent = ps;
	var Hs = {
		readContext: na,
		use: Po,
		useCallback: ys,
		useContext: na,
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
			return H === null ? xs(n, e, t) : Ss(n, H.memoizedState, e, t);
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
			return H === null ? (n.baseState = e, [e, n.queue.dispatch]) : qo(n, H, e, t);
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
			var r = pu(), i = Ha(r);
			i.payload = t, n != null && (i.callback = n), t = Ua(e, i, r), t !== null && (hu(t, e, r), Wa(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = pu(), i = Ha(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Ua(e, i, r), t !== null && (hu(t, e, r), Wa(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = pu(), r = Ha(n);
			r.tag = 2, t != null && (r.callback = t), t = Ua(e, r, n), t !== null && (hu(t, e, n), Wa(t, e, n));
		}
	};
	function Gs(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !N(n, r) || !N(i, a) : !0;
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
		I(e);
	}
	function Ys(e) {
		console.error(e);
	}
	function Xs(e) {
		I(e);
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
		return n = Ha(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Zs(e, t);
		}, n;
	}
	function ec(e) {
		return e = Ha(e), e.tag = 3, e;
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
			if (t = n.alternate, t !== null && $i(t, n, i, !0), n = no.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return ro === null ? Du() : n.alternate === null && X === 0 && (X = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, r === wa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), Gu(e, r, i)), !1;
					case 22: return n.flags |= 65536, r === wa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), Gu(e, r, i)), !1;
				}
				throw Error(a(435, n.tag));
			}
			return Gu(e, r, i), Du(), !1;
		}
		if (R) return t = no.current, t === null ? (r !== Ri && (t = Error(a(423), { cause: r }), Gi(bi(t, n))), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, r = bi(r, n), i = $s(e.stateNode, r, i), Ga(e, i), X !== 4 && (X = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = i, r !== Ri && (e = Error(a(422), { cause: r }), Gi(bi(e, n)))), !1;
		var o = Error(a(520), { cause: r });
		if (o = bi(o, n), Xl === null ? Xl = [o] : Xl.push(o), X !== 4 && (X = 2), t === null) return !0;
		r = bi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = i & -i, n.lanes |= e, e = $s(n.stateNode, r, e), Ga(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (ru === null || !ru.has(o)))) return n.flags |= 65536, i &= -i, n.lanes |= i, i = ec(i), tc(i, e, n, r), Ga(n, i), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var rc = Error(a(461)), ic = !1;
	function ac(e, t, n, r) {
		t.child = e === null ? Ra(t, null, n, r) : La(t, e.child, n, r);
	}
	function oc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return ta(t), r = Co(e, t, n, o, a, i), s = Do(), e !== null && !ic ? (Oo(e, t, i), Ac(e, t, i)) : (R && s && Mi(t), t.flags |= 1, ac(e, t, r, i), t.child);
	}
	function sc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !di(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, cc(e, t, a, r, i)) : (e = mi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !jc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? N : n, n(o, r) && e.ref === t.ref) return Ac(e, t, i);
		}
		return t.flags |= 1, e = fi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function cc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (N(a, r) && e.ref === t.ref) {
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
			}, e !== null && ya(t, a === null ? null : a.cachePool), a === null ? eo() : $a(t, a), oo(t);
			else return r = t.lanes = 536870912, dc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && ya(t, null), eo(), so(t)) : (ya(t, a.cachePool), $a(t, a), so(t), t.memoizedState = null);
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
		var a = va();
		return a = a === null ? null : {
			parent: z._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && ya(t, null), eo(), oo(t), e !== null && $i(e, t, r, !0), t.childLanes = i, null;
	}
	function fc(e, t) {
		return t = Tc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function pc(e, t, n) {
		return La(t, e.child, null, n), e = fc(t, t.pendingProps), e.flags |= 2, co(t), t.memoizedState = null, e;
	}
	function mc(e, t, n) {
		var r = t.pendingProps, i = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (R) {
				if (r.mode === "hidden") return e = fc(t, r), t.lanes = 536870912, uc(null, e);
				if (ao(t), (e = L) ? (e = rf(e, Li), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Di === null ? null : {
						id: Oi,
						overflow: ki
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = _i(e), n.return = t, t.child = n, Fi = t, L = null)) : e = null, e === null) throw zi(t);
				return t.lanes = 536870912, null;
			}
			return fc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (ao(t), i) {
				if (t.flags & 256) t.flags &= -257, t = pc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(a(558));
			} else if (ic || $i(e, t, n, !1), i = (n & e.childLanes) !== 0, ic || i) {
				if (r = K, r !== null && (s = ut(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, ai(e, s), hu(r, e, s), rc;
				Du(), t = pc(e, t, n);
			} else e = o.treeContext, L = cf(s.nextSibling), Fi = t, R = !0, Ii = null, Li = !1, e !== null && Pi(t, e), t = fc(t, r), t.flags |= 4096;
			return t;
		}
		return e = fi(e.child, {
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
		return ta(t), n = Co(e, t, n, r, void 0, i), r = Do(), e !== null && !ic ? (Oo(e, t, i), Ac(e, t, i)) : (R && r && Mi(t), t.flags |= 1, ac(e, t, n, i), t.child);
	}
	function _c(e, t, n, r, i, a) {
		return ta(t), t.updateQueue = null, n = To(t, r, n, i), wo(e), r = Do(), e !== null && !ic ? (Oo(e, t, a), Ac(e, t, a)) : (R && r && Mi(t), t.flags |= 1, ac(e, t, n, a), t.child);
	}
	function vc(e, t, n, r, i) {
		if (ta(t), t.stateNode === null) {
			var a = ci, o = n.contextType;
			typeof o == "object" && o && (a = na(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Ws, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Ba(t), o = n.contextType, a.context = typeof o == "object" && o ? na(o) : ci, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Us(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Ws.enqueueReplaceState(a, a.state, null), Ja(t, r, a, i), qa(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = qs(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = ci, typeof u == "object" && u && (o = na(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Ks(t, a, r, o), za = !1;
			var f = t.memoizedState;
			a.state = f, Ja(t, r, a, i), qa(), l = t.memoizedState, s || f !== l || za ? (typeof d == "function" && (Us(t, n, d, r), l = t.memoizedState), (c = za || Gs(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Va(e, t), o = t.memoizedProps, u = qs(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = ci, typeof l == "object" && l && (c = na(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Ks(t, a, r, c), za = !1, f = t.memoizedState, a.state = f, Ja(t, r, a, i), qa();
			var p = t.memoizedState;
			o !== d || f !== p || za || e !== null && e.dependencies !== null && ea(e.dependencies) ? (typeof s == "function" && (Us(t, n, s, r), p = t.memoizedState), (u = za || Gs(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && ea(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, hc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = La(t, e.child, null, i), t.child = La(t, null, n, i)) : ac(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Ac(e, t, i), e;
	}
	function yc(e, t, n, r) {
		return Ui(), t.flags |= 256, ac(e, t, n, r), t.child;
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
			cachePool: ba()
		};
	}
	function Sc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= Jl), e;
	}
	function Cc(e, t, n) {
		var r = t.pendingProps, i = !1, o = !!(t.flags & 128), s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : !!(lo.current & 2)), s && (i = !0, t.flags &= -129), s = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (R) {
				if (i ? io(t) : so(t), (e = L) ? (e = rf(e, Li), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Di === null ? null : {
						id: Oi,
						overflow: ki
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = _i(e), n.return = t, t.child = n, Fi = t, L = null)) : e = null, e === null) throw zi(t);
				return of(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, i ? (so(t), i = t.mode, c = Tc({
				mode: "hidden",
				children: c
			}, i), r = hi(r, i, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = xc(n), r.childLanes = Sc(e, s, n), t.memoizedState = bc, uc(null, r)) : (io(t), wc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (io(t), t.flags &= -257, t = Ec(e, t, n)) : t.memoizedState === null ? (so(t), c = r.fallback, i = t.mode, r = Tc({
				mode: "visible",
				children: r.children
			}, i), c = hi(c, i, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, La(t, e.child, null, n), r = t.child, r.memoizedState = xc(n), r.childLanes = Sc(e, s, n), t.memoizedState = bc, t = uc(null, r)) : (so(t), t.child = e.child, t.flags |= 128, t = null);
			else if (io(t), of(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(a(419)), r.stack = "", r.digest = s, Gi({
					value: r,
					source: null,
					stack: null
				}), t = Ec(e, t, n);
			} else if (ic || $i(e, t, n, !1), s = (n & e.childLanes) !== 0, ic || s) {
				if (s = K, s !== null && (r = ut(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, ai(e, r), hu(s, e, r), rc;
				af(c) || Du(), t = Ec(e, t, n);
			} else af(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, L = cf(c.nextSibling), Fi = t, R = !0, Ii = null, Li = !1, e !== null && Pi(t, e), t = wc(t, r.children), t.flags |= 4096);
			return t;
		}
		return i ? (so(t), c = r.fallback, i = t.mode, l = e.child, u = l.sibling, r = fi(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = hi(c, i, n, null), c.flags |= 2) : c = fi(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, uc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = xc(n) : (i = c.cachePool, i === null ? i = ba() : (l = z._currentValue, i = i.parent === l ? i : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: i
		}), r.memoizedState = c, r.childLanes = Sc(e, s, n), t.memoizedState = bc, uc(e.child, r)) : (io(t), n = e.child, e = n.sibling, n = fi(n, {
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
		return e = ui(22, e, null, t), e.lanes = 0, e;
	}
	function Ec(e, t, n) {
		return La(t, e.child, null, n), e = wc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Dc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Zi(e.return, t, n);
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
		var o = lo.current, s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, O(lo, o), ac(e, t, r, n), r = R ? wi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
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
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && uo(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Oc(t, !1, i, n, a, r);
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
				if ($i(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(a(153));
		if (t.child !== null) {
			for (e = t.child, n = fi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = fi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function jc(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && ea(e)));
	}
	function Mc(e, t, n) {
		switch (t.tag) {
			case 3:
				ye(t, t.stateNode.containerInfo), Yi(t, z, e.memoizedState.cache), Ui();
				break;
			case 27:
			case 5:
				xe(t);
				break;
			case 4:
				ye(t, t.stateNode.containerInfo);
				break;
			case 10:
				Yi(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, ao(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (io(t), e = Ac(e, t, n), e === null ? null : e.sibling) : Cc(e, t, n) : (io(t), t.flags |= 128, null);
				io(t);
				break;
			case 19:
				var i = !!(e.flags & 128);
				if (r = (n & t.childLanes) !== 0, r || ($i(e, t, n, !1), r = (n & t.childLanes) !== 0), i) {
					if (r) return kc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), O(lo, lo.current), r) break;
				return null;
			case 22: return t.lanes = 0, lc(e, t, n, t.pendingProps);
			case 24: Yi(t, z, e.memoizedState.cache);
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
		} else ic = !1, R && t.flags & 1048576 && ji(t, wi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Da(t.elementType), t.type = e, typeof e == "function") di(e) ? (r = qs(e, r), t.tag = 1, t = vc(null, t, e, r, n)) : (t.tag = 0, t = gc(null, t, e, r, n));
					else {
						if (e != null) {
							var i = e.$$typeof;
							if (i === w) {
								t.tag = 11, t = oc(null, t, e, r, n);
								break a;
							}
							if (i === ne) {
								t.tag = 14, t = sc(null, t, e, r, n);
								break a;
							}
						}
						throw t = ce(e) || e, Error(a(306, t, ""));
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
					i = o.element, Va(e, t), Ja(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, Yi(t, z, r), r !== o.cache && Qi(t, [z], n, !0), qa(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = yc(e, t, r, n);
							break a;
						}
						if (r !== i) {
							i = bi(Error(a(424)), t), Gi(i), t = yc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (L = cf(e.firstChild), Fi = t, R = !0, Ii = null, Li = !0, n = Ra(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					} else {
						if (Ui(), r === i) {
							t = Ac(e, t, n);
							break a;
						}
						ac(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return hc(e, t), e === null ? (n = kf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : R || (n = t.type, e = t.pendingProps, r = Bd(_e.current).createElement(n), r[gt] = t, r[_t] = e, Pd(r, n, e), kt(r), t.stateNode = r) : t.memoizedState = kf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return xe(t), e === null && R && (r = t.stateNode = ff(t.type, t.pendingProps, _e.current), Fi = t, Li = !0, i = L, Zd(t.type) ? (lf = i, L = cf(r.firstChild)) : L = i), ac(e, t, t.pendingProps.children, n), hc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && R && ((i = r = L) && (r = tf(r, t.type, t.pendingProps, Li), r === null ? i = !1 : (t.stateNode = r, Fi = t, L = cf(r.firstChild), Li = !1, i = !0)), i || zi(t)), xe(t), i = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Ud(i, o) ? r = null : s !== null && Ud(i, s) && (t.flags |= 32), t.memoizedState !== null && (i = Co(e, t, Eo, null, null, n), Qf._currentValue = i), hc(e, t), ac(e, t, r, n), t.child;
			case 6: return e === null && R && ((e = n = L) && (n = nf(n, t.pendingProps, Li), n === null ? e = !1 : (t.stateNode = n, Fi = t, L = null, e = !0)), e || zi(t)), null;
			case 13: return Cc(e, t, n);
			case 4: return ye(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = La(t, null, r, n) : ac(e, t, r, n), t.child;
			case 11: return oc(e, t, t.type, t.pendingProps, n);
			case 7: return ac(e, t, t.pendingProps, n), t.child;
			case 8: return ac(e, t, t.pendingProps.children, n), t.child;
			case 12: return ac(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, Yi(t, t.type, r.value), ac(e, t, r.children, n), t.child;
			case 9: return i = t.type._context, r = t.pendingProps.children, ta(t), i = na(i), r = r(i), t.flags |= 1, ac(e, t, r, n), t.child;
			case 14: return sc(e, t, t.type, t.pendingProps, n);
			case 15: return cc(e, t, t.type, t.pendingProps, n);
			case 19: return kc(e, t, n);
			case 31: return mc(e, t, n);
			case 22: return lc(e, t, n, t.pendingProps);
			case 24: return ta(t), r = na(z), e === null ? (i = va(), i === null && (i = K, o = ca(), i.pooledCache = o, o.refCount++, o !== null && (i.pooledCacheLanes |= n), i = o), t.memoizedState = {
				parent: r,
				cache: i
			}, Ba(t), Yi(t, z, i)) : ((e.lanes & n) !== 0 && (Va(e, t), Ja(t, null, null, n), qa()), i = e.memoizedState, o = t.memoizedState, i.parent === r ? (r = o.cache, Yi(t, z, r), r !== i.cache && Qi(t, [z], n, !0)) : (i = {
				parent: r,
				cache: r
			}, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), Yi(t, z, r))), ac(e, t, t.pendingProps.children, n), t.child;
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
				else throw Oa = wa, Sa;
			}
		} else e.flags &= -16777217;
	}
	function Ic(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Wf(t)) {
			if (wu()) e.flags |= 8192;
			else throw Oa = wa, Sa;
		}
	}
	function Lc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : it(), e.lanes |= t, Yl |= t);
	}
	function Rc(e, t) {
		if (!R) switch (e.tailMode) {
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
		switch (Ni(t), t.tag) {
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
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Xi(z), be(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Hi(t) ? Pc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Wi())), U(t), null;
			case 26:
				var i = t.type, o = t.memoizedState;
				return e === null ? (Pc(t), o === null ? (U(t), Fc(t, i, null, r, n)) : (U(t), Ic(t, o))) : o ? o === e.memoizedState ? (U(t), t.flags &= -16777217) : (Pc(t), U(t), Ic(t, o)) : (e = e.memoizedProps, e !== r && Pc(t), U(t), Fc(t, i, e, r, n)), null;
			case 27:
				if (Se(t), n = _e.current, i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(a(166));
						return U(t), null;
					}
					e = he.current, Hi(t) ? Bi(t, e) : (e = ff(i, r, n), t.stateNode = e, Pc(t));
				}
				return U(t), null;
			case 5:
				if (Se(t), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(a(166));
						return U(t), null;
					}
					if (o = he.current, Hi(t)) Bi(t, o);
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
						r && Pc(t);
					}
				}
				return U(t), Fc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(a(166));
					if (e = _e.current, Hi(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, i = Fi, i !== null) switch (i.tag) {
							case 27:
							case 5: r = i.memoizedProps;
						}
						e[gt] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Md(e.nodeValue, n)), e || zi(t, !0);
					} else e = Bd(e).createTextNode(r), e[gt] = t, t.stateNode = e;
				}
				return U(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Hi(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(a(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(a(557));
							e[gt] = t;
						} else Ui(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						U(t), e = !1;
					} else n = Wi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (co(t), t) : (co(t), null);
					if (t.flags & 128) throw Error(a(558));
				}
				return U(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (i = Hi(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!i) throw Error(a(318));
							if (i = t.memoizedState, i = i === null ? null : i.dehydrated, !i) throw Error(a(317));
							i[gt] = t;
						} else Ui(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						U(t), i = !1;
					} else i = Wi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
					if (!i) return t.flags & 256 ? (co(t), t) : (co(t), null);
				}
				return co(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, i = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (i = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== i && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Lc(t, t.updateQueue), U(t), null);
			case 4: return be(), e === null && Sd(t.stateNode.containerInfo), U(t), null;
			case 10: return Xi(t.type), U(t), null;
			case 19:
				if (me(lo), r = t.memoizedState, r === null) return U(t), null;
				if (i = !!(t.flags & 128), o = r.rendering, o === null) {
					if (i) Rc(r, !1);
					else {
						if (X !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = uo(e), o !== null) {
								for (t.flags |= 128, Rc(r, !1), e = o.updateQueue, t.updateQueue = e, Lc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) pi(n, e), n = n.sibling;
								return O(lo, lo.current & 1 | 2), R && Ai(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Fe() > tu && (t.flags |= 128, i = !0, Rc(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!i) {
						if (e = uo(o), e !== null) {
							if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, Lc(t, e), Rc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !R) return U(t), null;
						} else 2 * Fe() - r.renderingStartTime > tu && n !== 536870912 && (t.flags |= 128, i = !0, Rc(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (U(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Fe(), e.sibling = null, n = lo.current, O(lo, i ? n & 1 | 2 : n & 1), R && Ai(t, r.treeForkCount), e);
			case 22:
			case 23: return co(t), to(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (U(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : U(t), n = t.updateQueue, n !== null && Lc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && me(_a), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Xi(z), U(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(a(156, t.tag));
	}
	function Bc(e, t) {
		switch (Ni(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Xi(z), be(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return Se(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (co(t), t.alternate === null) throw Error(a(340));
					Ui();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (co(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(a(340));
					Ui();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return me(lo), null;
			case 4: return be(), null;
			case 10: return Xi(t.type), null;
			case 22:
			case 23: return co(t), to(), e !== null && me(_a), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Xi(z), null;
			case 25: return null;
			default: return null;
		}
	}
	function Vc(e, t) {
		switch (Ni(t), t.tag) {
			case 3:
				Xi(z), be();
				break;
			case 26:
			case 27:
			case 5:
				Se(t);
				break;
			case 4:
				be();
				break;
			case 31:
				t.memoizedState !== null && co(t);
				break;
			case 13:
				co(t);
				break;
			case 19:
				me(lo);
				break;
			case 10:
				Xi(t.type);
				break;
			case 22:
			case 23:
				co(t), to(), e !== null && me(_a);
				break;
			case 24: Xi(z);
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
				Xa(t, n);
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
			Fd(r, e.type, n, t), r[_t] = t;
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
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = cn));
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
			Pd(t, r, n), t[gt] = e, t[_t] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var tl = !1, nl = !1, rl = !1, il = typeof WeakSet == "function" ? WeakSet : Set, al = null;
	function ol(e, t) {
		if (e = e.containerInfo, Rd = sp, e = jr(e), Mr(e)) {
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
						Xa(e, t);
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
		t !== null && (e.alternate = null, cl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && wt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var W = null, ll = !1;
	function ul(e, t, n) {
		for (n = n.child; n !== null;) dl(e, t, n), n = n.sibling;
	}
	function dl(e, t, n) {
		if (Ge && typeof Ge.onCommitFiberUnmount == "function") try {
			Ge.onCommitFiberUnmount(We, n);
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
				gl(t, e), yl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && ($l = Fe()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, hl(e, r)));
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
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) Ya(c[i], s);
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
			var t = na(z), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return na(z).controller.signal;
		}
	}, zl = typeof WeakMap == "function" ? WeakMap : Map, G = 0, K = null, q = null, J = 0, Y = 0, Bl = null, Vl = !1, Hl = !1, Ul = !1, Wl = 0, X = 0, Gl = 0, Kl = 0, ql = 0, Jl = 0, Yl = 0, Xl = null, Zl = null, Ql = !1, $l = 0, eu = 0, tu = Infinity, nu = null, ru = null, iu = 0, au = null, ou = null, su = 0, cu = 0, lu = null, uu = null, du = 0, fu = null;
	function pu() {
		return G & 2 && J !== 0 ? J & -J : E.T === null ? pt() : dd();
	}
	function mu() {
		if (Jl === 0) {
			if (!(J & 536870912) || R) {
				var e = Qe;
				Qe <<= 1, !(Qe & 3932160) && (Qe = 262144), Jl = e;
			} else Jl = 536870912;
		}
		return e = no.current, e !== null && (e.flags |= 32), Jl;
	}
	function hu(e, t, n) {
		(e === K && (Y === 2 || Y === 9) || e.cancelPendingCommit !== null) && (Su(e, 0), yu(e, J, Jl, !1)), ot(e, n), (!(G & 2) || e !== K) && (e === K && (!(G & 2) && (Kl |= n), X === 4 && yu(e, J, Jl, !1)), rd(e));
	}
	function gu(e, t, n) {
		if (G & 6) throw Error(a(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || nt(e, t), i = r ? Au(e, t) : Ou(e, t, !0), o = r;
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
				if ((t & 62914560) === t && (i = $l + 300 - Fe(), 10 < i)) {
					if (yu(r, t, Jl, !Vl), tt(r, 0, !0) !== 0) break a;
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
				unsuspend: cn
			}, Ml(t, a, d);
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
					if (!Or(a(), i)) return !1;
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
		return G & 6 ? !0 : (id(0, !1), !1);
	}
	function xu() {
		if (q !== null) {
			if (Y === 0) var e = q.return;
			else e = q, Ji = qi = null, ko(e), ja = null, Ma = 0, e = q;
			for (; e !== null;) Vc(e.alternate, e), e = e.return;
			q = null;
		}
	}
	function Su(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, qd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), su = 0, xu(), K = e, q = n = fi(e.current, null), J = t, Y = 0, Bl = null, Vl = !1, Hl = nt(e, t), Ul = !1, Yl = Jl = ql = Kl = Gl = X = 0, Zl = Xl = null, Ql = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - qe(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Wl = t, ni(), n;
	}
	function Cu(e, t) {
		V = null, E.H = zs, t === xa || t === Ca ? (t = ka(), Y = 3) : t === Sa ? (t = ka(), Y = 4) : Y = t === rc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Bl = t, q === null && (X = 1, Zs(e, bi(t, e.current)));
	}
	function wu() {
		var e = no.current;
		return e === null ? !0 : (J & 4194048) === J ? ro === null : (J & 62914560) === J || J & 536870912 ? e === ro : !1;
	}
	function Tu() {
		var e = E.H;
		return E.H = zs, e === null ? zs : e;
	}
	function Eu() {
		var e = E.A;
		return E.A = Rl, e;
	}
	function Du() {
		X = 4, Vl || (J & 4194048) !== J && no.current !== null || (Hl = !0), !(Gl & 134217727) && !(Kl & 134217727) || K === null || yu(K, J, Jl, !1);
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
							no.current === null && (t = !0);
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
		return t && e.shellSuspendCounter++, Ji = qi = null, G = r, E.H = i, E.A = a, q === null && (K = null, J = 0, ni()), o;
	}
	function ku() {
		for (; q !== null;) Mu(q);
	}
	function Au(e, t) {
		var n = G;
		G |= 2;
		var r = Tu(), i = Eu();
		K !== e || J !== t ? (nu = null, tu = Fe() + 500, Su(e, t)) : Hl = nt(e, t);
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
							if (Ta(o)) {
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
							Ta(o) ? (Y = 0, Bl = null, Nu(t)) : (Y = 0, Bl = null, Pu(e, t, o, 7));
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
		return Ji = qi = null, E.H = r, E.A = i, G = n, q === null ? (K = null, J = 0, ni(), X) : 0;
	}
	function ju() {
		for (; q !== null && !Ne();) Mu(q);
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
			default: Vc(n, t), t = q = pi(t, Wl), t = Nc(n, t, Wl);
		}
		e.memoizedProps = e.pendingProps, t === null ? Fu(e) : q = t;
	}
	function Pu(e, t, n, r) {
		Ji = qi = null, ko(t), ja = null, Ma = 0;
		var i = t.return;
		try {
			if (nc(e, i, t, n, J)) {
				X = 1, Zs(e, bi(n, e.current)), q = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw q = i, t;
			X = 1, Zs(e, bi(n, e.current)), q = null;
			return;
		}
		t.flags & 32768 ? (R || r === 1 ? e = !0 : Hl || J & 536870912 ? e = !1 : (Vl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = no.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Iu(t, e)) : Fu(t);
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
			if (o = t.lanes | t.childLanes, o |= ti, st(e, n, o, s, c, l), e === K && (q = K = null, J = 0), ou = t, au = e, su = n, cu = o, lu = i, uu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Xu(ze, function() {
				return Uu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
				r = E.T, E.T = null, i = D.p, D.p = 2, s = G, G |= 4;
				try {
					ol(e, t, n);
				} finally {
					G = s, D.p = i, E.T = r;
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
				n = E.T, E.T = null;
				var r = D.p;
				D.p = 2;
				var i = G;
				G |= 4;
				try {
					vl(t, e);
					var a = zd, o = jr(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && Ar(s.ownerDocument.documentElement, s)) {
						if (c !== null && Mr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = kr(s, h), v = kr(s, g);
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
					G = i, D.p = r, E.T = n;
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
				n = E.T, E.T = null;
				var r = D.p;
				D.p = 2;
				var i = G;
				G |= 4;
				try {
					sl(e, t.alternate, t);
				} finally {
					G = i, D.p = r, E.T = n;
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
				t = E.T, i = D.p, D.p = 2, E.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					E.T = t, D.p = i;
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
		var n = ft(su), r = E.T, i = D.p;
		try {
			D.p = 32 > n ? 32 : n, E.T = null, n = lu, lu = null;
			var o = au, s = su;
			if (iu = 0, ou = au = null, su = 0, G & 6) throw Error(a(331));
			var c = G;
			if (G |= 4, Fl(o.current), Dl(o, o.current, s, n), G = c, id(0, !1), Ge && typeof Ge.onPostCommitFiberRoot == "function") try {
				Ge.onPostCommitFiberRoot(We, o);
			} catch {}
			return !0;
		} finally {
			D.p = i, E.T = r, Vu(e, t);
		}
	}
	function Wu(e, t, n) {
		t = bi(n, t), t = $s(e.stateNode, t, 2), e = Ua(e, t, 2), e !== null && (ot(e, 2), rd(e));
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
					e = bi(n, e), n = ec(2), r = Ua(t, n, 2), r !== null && (tc(n, r, t, e), ot(r, 2), rd(r));
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
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, K === e && (J & n) === n && (X === 4 || X === 3 && (J & 62914560) === J && 300 > Fe() - $l ? !(G & 2) && Su(e, 0) : ql |= n, Yl === J && (Yl = 0)), rd(e);
	}
	function qu(e, t) {
		t === 0 && (t = it()), e = ai(e, t), e !== null && (ot(e, t), rd(e));
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
						} else a = J, a = tt(r, r === K ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || nt(r, a) || (n = !0, ld(r, a));
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
		if (t = K, n = J, n = tt(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Y === 2 || Y === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Me(r), e.callbackNode = null, e.callbackPriority = 0;
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
		var r = J;
		return r = tt(e, e === K ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (gu(e, r, t), sd(e, Fe()), e.callbackNode != null && e.callbackNode === n ? cd.bind(null, e) : null);
	}
	function ld(e, t) {
		if (Hu()) return null;
		gu(e, t, !0);
	}
	function ud() {
		Yd(function() {
			G & 6 ? je(Le, ad) : od();
		});
	}
	function dd() {
		if (nd === 0) {
			var e = da;
			e === 0 && (e = Ze, Ze <<= 1, !(Ze & 261888) && (Ze = 256)), nd = e;
		}
		return nd;
	}
	function fd(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : sn("" + e);
	}
	function pd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function md(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = fd((i[_t] || null).action), o = r.submitter;
			o && (t = (t = o[_t] || null) ? fd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new kn("action", "action", null, r, i);
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
	for (var hd = 0; hd < Qr.length; hd++) {
		var gd = Qr[hd];
		F(gd.toLowerCase(), "on" + (gd[0].toUpperCase() + gd.slice(1)));
	}
	F(Wr, "onAnimationEnd"), F(Gr, "onAnimationIteration"), F(Kr, "onAnimationStart"), F("dblclick", "onDoubleClick"), F("focusin", "onFocus"), F("focusout", "onBlur"), F(qr, "onTransitionRun"), F(Jr, "onTransitionStart"), F(Yr, "onTransitionCancel"), F(Xr, "onTransitionEnd"), Nt("onMouseEnter", ["mouseout", "mouseover"]), Nt("onMouseLeave", ["mouseout", "mouseover"]), Nt("onPointerEnter", ["pointerout", "pointerover"]), Nt("onPointerLeave", ["pointerout", "pointerover"]), Mt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Mt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Mt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Mt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Mt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Mt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
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
						I(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						I(e);
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
		n = i.bind(null, t, n, e), i = void 0, !vn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
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
		hn(function() {
			var r = a, i = un(n), o = [];
			a: {
				var c = Zr.get(e);
				if (c !== void 0) {
					var l = kn, u = e;
					switch (e) {
						case "keypress": if (wn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Kn;
							break;
						case "focusin":
							u = "focus", l = Rn;
							break;
						case "focusout":
							u = "blur", l = Rn;
							break;
						case "beforeblur":
						case "afterblur":
							l = Rn;
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
							l = In;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = Ln;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Jn;
							break;
						case Wr:
						case Gr:
						case Kr:
							l = zn;
							break;
						case Xr:
							l = Yn;
							break;
						case "scroll":
						case "scrollend":
							l = jn;
							break;
						case "wheel":
							l = Xn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = Bn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = qn;
							break;
						case "toggle":
						case "beforetoggle": l = Zn;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = gn(m, p), g != null && d.push(Td(m, g, h))), f) break;
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
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== ln && (u = n.relatedTarget || n.fromElement) && (Tt(u) || u[vt])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? Tt(u) : null, u !== null && (f = s(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = In, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = qn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : Dt(l), h = u == null ? c : Dt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, Tt(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
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
					if (c = r ? Dt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = _r;
					else if (dr(c)) {
						if (vr) v = Er;
						else {
							v = wr;
							var y = Cr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && rn(r.elementType) && (v = _r) : v = Tr;
					if (v && (v = v(e, r))) {
						fr(o, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Yt(c, "number", c.value);
				}
				switch (y = r ? Dt(r) : window, e) {
					case "focusin":
						(dr(y) || y.contentEditable === "true") && (Pr = y, Fr = r, Ir = null);
						break;
					case "focusout":
						Ir = Fr = Pr = null;
						break;
					case "mousedown":
						Lr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Lr = !1, Rr(o, n, i);
						break;
					case "selectionchange": if (Nr) break;
					case "keydown":
					case "keyup": Rr(o, n, i);
				}
				var b;
				if ($n) b: {
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
				else sr ? ar(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (nr && n.locale !== "ko" && (sr || x !== "onCompositionStart" ? x === "onCompositionEnd" && sr && (b = Cn()) : (bn = i, xn = "value" in bn ? bn.value : bn.textContent, sr = !0)), y = Ed(r, x), 0 < y.length && (x = new Vn(x, e, null, n, i), o.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = or(n), b !== null && (x.data = b)))), (b = tr ? cr(e, n) : lr(e, n)) && (x = Ed(r, "onBeforeInput"), 0 < x.length && (y = new Vn("onBeforeInput", "beforeinput", null, n, i), o.push({
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
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = gn(e, n), i != null && r.unshift(Td(e, i, a)), i = gn(e, t), i != null && r.push(Td(e, i, a))), e.tag === 3) return r;
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
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = gn(n, a), l != null && o.unshift(Td(n, l, c))) : i || (l = gn(n, a), l != null && o.push(Td(n, l, c)))), n = n.return;
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
				zt(e, "class", r);
				break;
			case "tabIndex":
				zt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				zt(e, n, r);
				break;
			case "style":
				nn(e, r, o);
				break;
			case "data": if (t !== "object") {
				zt(e, "data", r);
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
				r = sn("" + r), e.setAttribute(n, r);
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
				r = sn("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = cn);
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
				n = sn("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
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
				Q("beforetoggle", e), Q("toggle", e), Rt(e, "popover", r);
				break;
			case "xlinkActuate":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Bt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Bt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Rt(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = an.get(n) || n, Rt(e, n, r));
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
				r != null && (e.onclick = cn);
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
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Rt(e, n, r);
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
	var _f = D.d;
	D.d = {
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
		t !== null && t.tag === 5 && t.type === "form" ? Ds(t) : _f.r(e);
	}
	var bf = typeof document > "u" ? null : document;
	function xf(e, t, n) {
		var r = bf;
		if (r && typeof t == "string" && t) {
			var i = A(t);
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
			var i = "link[rel=\"preload\"][as=\"" + A(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + A(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + A(n.imageSizes) + "\"]")) : i += "[href=\"" + A(e) + "\"]";
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
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + A(r) + "\"][href=\"" + A(e) + "\"]", a = i;
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
		var i = (i = _e.current) ? gf(i) : null;
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
		return "href=\"" + A(e) + "\"";
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
		return "[src=\"" + A(e) + "\"]";
	}
	function Ff(e) {
		return "script[async]" + e;
	}
	function If(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + A(n.href) + "\"]");
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
		$$typeof: C,
		Provider: null,
		Consumer: null,
		_currentValue: ue,
		_currentValue2: ue,
		_threadCount: 0
	};
	function $f(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = at(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = at(0), this.hiddenUpdates = at(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new $f(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = ui(3, null, null, t), e.current = a, a.stateNode = e, t = ca(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Ba(a), e;
	}
	function tp(e) {
		return e ? (e = ci, e) : ci;
	}
	function np(e, t, n, r, i, a) {
		i = tp(i), r.context === null ? r.context = i : r.pendingContext = i, r = Ha(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Ua(e, r, t), n !== null && (hu(n, e, t), Wa(n, e, t));
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
			var t = ai(e, 67108864);
			t !== null && hu(t, e, 67108864), ip(e, 67108864);
		}
	}
	function op(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = pu();
			t = dt(t);
			var n = ai(e, t);
			n !== null && hu(n, e, t), ip(e, t);
		}
	}
	var sp = !0;
	function cp(e, t, n, r) {
		var i = E.T;
		E.T = null;
		var a = D.p;
		try {
			D.p = 2, up(e, t, n, r);
		} finally {
			D.p = a, E.T = i;
		}
	}
	function lp(e, t, n, r) {
		var i = E.T;
		E.T = null;
		var a = D.p;
		try {
			D.p = 8, up(e, t, n, r);
		} finally {
			D.p = a, E.T = i;
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
									rd(a), !(G & 6) && (tu = Fe() + 500, id(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = ai(a, 2), s !== null && hu(s, a, 2), bu(), ip(a, 2);
					}
					if (a = dp(r), a === null && wd(e, t, r, fp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else wd(e, t, r, null, n);
		}
	}
	function dp(e) {
		return e = un(e), pp(e);
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
				ln = r, n.target.dispatchEvent(r), ln = null;
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
	D.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(a(188)) : (e = Object.keys(e).join(","), Error(a(268, e)));
		return e = p(t), e = e === null ? null : m(e), e = e === null ? null : e.stateNode, e;
	};
	var Rp = {
		bundleType: 0,
		version: "19.2.8",
		rendererPackageName: "react-dom",
		currentDispatcherRef: E,
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
		var n = !1, r = "", i = Js, s = Ys, c = Xs;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = ep(e, 1, !1, null, null, n, r, null, i, s, c, Pp), e[vt] = t.current, Sd(e), new Fp(t);
	};
})), m = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = n(), g = m();
function _(e) {
	"@babel/helpers - typeof";
	return _ = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, _(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPrimitive.js
function v(e, t) {
	if (_(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (_(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPropertyKey.js
function y(e) {
	var t = v(e, "string");
	return _(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/defineProperty.js
function b(e, t, n) {
	return (t = y(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
//#region src/api.ts
var x = (e) => /^1(?:\.|$)/.test(e), S = class extends Error {
	constructor(e, t, n) {
		super(e), b(this, "code", void 0), b(this, "status", void 0), this.code = t, this.status = n, this.name = "ApiError";
	}
}, C = class {
	constructor(e) {
		b(this, "config", void 0), b(this, "base", void 0), b(this, "uploadStorageKey", "sofinder.uploadSessions.v1"), this.config = e, this.base = e.apiBase.replace(/\/config$/, "");
	}
	async configData() {
		let e = await this.request("/config");
		if (!x(e.apiVersion)) throw new S(`SoFinder UI requires API 1.x; server reported ${e.apiVersion || "an unknown version"}.`, "incompatible_api_version", 426);
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
			throw new S(e.error?.message || `Request failed (${n.status})`, e.error?.code || "archive_failed", n.status);
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
		if (!r.ok || !i.success || !i.data) throw new S(i.error?.message || `Request failed (${r.status})`, i.error?.code || "request_failed", r.status);
		return i.data;
	}
}, w = {
	en: () => import("./en-C9IYgA52.js"),
	"zh-cn": () => import("./zh-cn-BKI-ICDG.js"),
	"zh-tw": () => import("./zh-tw-D7YgC_eW.js")
}, ee = async (e) => (await w[e]()).default, te = (e) => (t) => e[t], ne = (e) => {
	let t = localStorage.getItem("sofinder.language");
	return t === "en" || t === "zh-cn" || t === "zh-tw" ? t : e;
}, T = t();
function re({ title: e, label: t, initialValue: n = "", maximum: r, extension: o = "", invalidNameLabel: s, confirmLabel: c, cancelLabel: l, closeLabel: u, onConfirm: d, onClose: f }) {
	let [p, m] = (0, h.useState)(n), g = p + o, _ = Array.from(g).length, v = a(g, r), y = v === null;
	return /* @__PURE__ */ (0, T.jsx)(i, {
		title: e,
		closeLabel: u,
		onClose: f,
		className: "sf-form-modal",
		footer: /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [
			/* @__PURE__ */ (0, T.jsxs)("span", { children: [
				_,
				" / ",
				r
			] }),
			/* @__PURE__ */ (0, T.jsx)("button", {
				onClick: f,
				children: l
			}),
			/* @__PURE__ */ (0, T.jsx)("button", {
				className: "primary",
				disabled: !y,
				onClick: () => d(p.trim() + o),
				children: c
			})
		] }),
		children: /* @__PURE__ */ (0, T.jsxs)("div", {
			className: "sf-form-body",
			children: [/* @__PURE__ */ (0, T.jsxs)("label", { children: [t, /* @__PURE__ */ (0, T.jsxs)("span", {
				className: "sf-name-input",
				children: [/* @__PURE__ */ (0, T.jsx)("input", {
					autoFocus: !0,
					value: p,
					maxLength: r,
					onChange: (e) => m(e.target.value)
				}), o && /* @__PURE__ */ (0, T.jsx)("span", { children: o })]
			})] }), !y && p !== "" && /* @__PURE__ */ (0, T.jsx)("p", {
				role: "alert",
				children: v === "tooLong" ? `${_} / ${r}` : s
			})]
		})
	});
}
function ie({ title: e, message: t, detail: n, confirmLabel: r, cancelLabel: a, closeLabel: o, danger: s = !1, onConfirm: c, onClose: l }) {
	return /* @__PURE__ */ (0, T.jsx)(i, {
		title: e,
		closeLabel: o,
		onClose: l,
		className: "sf-confirm-modal",
		footer: /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [
			/* @__PURE__ */ (0, T.jsx)("span", {}),
			/* @__PURE__ */ (0, T.jsx)("button", {
				onClick: l,
				children: a
			}),
			/* @__PURE__ */ (0, T.jsx)("button", {
				className: s ? "danger" : "primary",
				onClick: c,
				children: r
			})
		] }),
		children: /* @__PURE__ */ (0, T.jsxs)("div", {
			className: "sf-form-body",
			children: [/* @__PURE__ */ (0, T.jsx)("p", { children: t }), n && /* @__PURE__ */ (0, T.jsx)("small", { children: n })]
		})
	});
}
function ae({ fileName: e, title: t, renameLabel: n, overwriteLabel: r, skipLabel: a, closeLabel: o, onChoose: s }) {
	return /* @__PURE__ */ (0, T.jsx)(i, {
		title: t,
		closeLabel: o,
		onClose: () => s("skip"),
		className: "sf-confirm-modal",
		footer: /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [
			/* @__PURE__ */ (0, T.jsx)("button", {
				onClick: () => s("skip"),
				children: a
			}),
			/* @__PURE__ */ (0, T.jsx)("button", {
				className: "primary",
				onClick: () => s("rename"),
				children: n
			}),
			/* @__PURE__ */ (0, T.jsx)("button", {
				className: "danger",
				onClick: () => s("overwrite"),
				children: r
			})
		] }),
		children: /* @__PURE__ */ (0, T.jsx)("div", {
			className: "sf-form-body",
			children: /* @__PURE__ */ (0, T.jsx)("p", { children: e })
		})
	});
}
//#endregion
//#region src/preferences.ts
var oe = {
	resize: !1,
	crop: !1,
	rotate: !1,
	presets: !1,
	process: !1,
	batchRename: !1
}, se = {
	grid: "medium",
	list: "medium"
}, ce = {
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
}, le = {
	size: !0,
	modified: !0,
	type: !1
}, E = {
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
}, D = (e, t) => {
	try {
		let n = JSON.parse(localStorage.getItem(e) || "{}");
		return Object.fromEntries(Object.entries(t).map(([e, t]) => [e, typeof n[e] == "boolean" ? n[e] : t]));
	} catch {
		return t;
	}
}, ue = () => D("sofinder.tools.v3", oe), de = () => {
	try {
		let e = JSON.parse(localStorage.getItem("sofinder.viewSizes.v1") || "{}"), t = (e) => e === "small" || e === "medium" || e === "large";
		return {
			grid: t(e.grid) ? e.grid : se.grid,
			list: t(e.list) ? e.list : se.list
		};
	} catch {
		return se;
	}
}, fe = (e) => {
	let t = localStorage.getItem("sofinder.uiScale.v1");
	return t === "compact" || t === "standard" || t === "large" || t === "xlarge" ? t : e;
}, pe = (e) => {
	let t = localStorage.getItem("sofinder.uploadConflictStrategy.v1");
	return t === "ask" || t === "rename" || t === "overwrite" || t === "skip" ? t : e;
}, me = () => localStorage.getItem("sofinder.folderNavigation.position.v1") === "right" ? "right" : "left", O = () => localStorage.getItem("sofinder.quickAccess.scope.v1") === "resource" ? "resource" : "all", he = {
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
}, ge = {
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
}, _e = {
	default: 100,
	min: 10,
	max: 500
}, ve = (e) => Math.max(_e.min, Math.min(_e.max, Math.trunc(e))), ye = () => {
	let e = Number(localStorage.getItem("sofinder.pageSize.v1"));
	return Number.isFinite(e) && e > 0 ? ve(e) : _e.default;
}, be = (e) => {
	let t = he[e], n = localStorage.getItem(`sofinder.column.${e}`);
	if (n === null || n.trim() === "") return t.initial;
	let r = Number(n);
	return Number.isFinite(r) ? Math.max(t.min, Math.min(t.max, r)) : t.initial;
}, xe = (e, t) => {
	let n = ge[e];
	return Math.round(Math.max(n.min, Math.min(n.max, t)));
}, Se = () => {
	try {
		let e = JSON.parse(localStorage.getItem("sofinder.listColumnWidths.v1") || "{}");
		return Object.fromEntries(Object.keys(ge).map((t) => {
			let n = Number(e[t]);
			return [t, Number.isFinite(n) ? xe(t, n) : ge[t].initial];
		}));
	} catch {
		return Object.fromEntries(Object.keys(ge).map((e) => [e, ge[e].initial]));
	}
};
//#endregion
//#region src/hooks/useEntrySelection.ts
function Ce(e, t, n) {
	let [r, i] = (0, h.useState)(() => /* @__PURE__ */ new Set()), [a, o] = (0, h.useState)(null), s = (0, h.useMemo)(() => e.filter((e) => r.has(e.path)), [e, r]);
	return {
		selectedPaths: r,
		setSelectedPaths: i,
		selectionAnchor: a,
		setSelectionAnchor: o,
		selectedEntries: s,
		selected: s.length === 1 ? s[0] : null,
		selectEntry: (0, h.useCallback)((r, s) => {
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
function we(e, t) {
	let [n, r] = (0, h.useState)(e), [i, a] = (0, h.useState)(t), [o, s] = (0, h.useState)(""), [c, l] = (0, h.useState)([]), [u, d] = (0, h.useState)(""), [f, p] = (0, h.useState)("name"), [m, g] = (0, h.useState)("name"), [_, v] = (0, h.useState)("asc"), [y, b] = (0, h.useState)(0), [x, S] = (0, h.useState)(0), [C, w] = (0, h.useState)(null), [ee, te] = (0, h.useState)(null), [ne, T] = (0, h.useState)([]), re = (0, h.useRef)(ye()).current, [ie, ae] = (0, h.useState)(re), [oe, se] = (0, h.useState)(String(re)), ce = (0, h.useRef)(re), [le, E] = (0, h.useState)(() => localStorage.getItem("sofinder.view") === "list" ? "list" : "grid"), [D, ue] = (0, h.useState)(!0), [de, fe] = (0, h.useState)(""), [pe, me] = (0, h.useState)({});
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
		setSort: g,
		direction: _,
		setDirection: v,
		offset: y,
		setOffset: b,
		total: x,
		setTotal: S,
		pageCursor: C,
		setPageCursor: w,
		nextCursor: ee,
		setNextCursor: te,
		cursorHistory: ne,
		setCursorHistory: T,
		pageSize: ie,
		setPageSize: ae,
		pageSizeDraft: oe,
		setPageSizeDraft: se,
		pageSizeRef: ce,
		view: le,
		setView: E,
		loading: D,
		setLoading: ue,
		notice: de,
		setNotice: fe,
		directoryCapabilities: pe,
		setDirectoryCapabilities: me,
		loadSequence: (0, h.useRef)(0),
		historyReady: (0, h.useRef)(!1),
		restoringHistory: (0, h.useRef)(!1),
		searchInitialized: (0, h.useRef)(!1)
	};
}
//#endregion
//#region src/hooks/useBatchState.ts
function Te() {
	let [e, t] = (0, h.useState)(null), [n, r] = (0, h.useState)(!1);
	return {
		destinationDialog: e,
		setDestinationDialog: t,
		bulkRenameOpen: n,
		setBulkRenameOpen: r
	};
}
//#endregion
//#region src/uploadNaming.ts
var Ee = (e, t) => {
	if (!t) return e;
	let n = e.lastIndexOf(".");
	return n > 0 && n < e.length - 1 ? e.slice(0, n + 1) + e.slice(n + 1).toLowerCase() : e;
}, De = (e, t) => t === e.name ? e : new File([e], t, {
	type: e.type,
	lastModified: e.lastModified
});
function Oe({ api: e, resource: t, path: n, currentResource: r, currentDepth: i, autoCollapse: o, conflictStrategy: s, lowercaseExtensions: c, t: l, ask: u, chooseConflict: d, reload: f, setNotice: p, report: m }) {
	let [g, _] = (0, h.useState)([]), [v, y] = (0, h.useState)(!1), b = (0, h.useRef)(null), x = (0, h.useRef)(null), C = (0, h.useRef)(/* @__PURE__ */ new Map()), w = (0, h.useRef)(/* @__PURE__ */ new Map()), ee = (0, h.useRef)(0), te = (0, h.useRef)(Promise.resolve()), ne = (e) => {
		if (s !== "ask") return Promise.resolve(s);
		let t = te.current.then(() => d(e));
		return te.current = t.then(() => void 0, () => void 0), t;
	};
	(0, h.useEffect)(() => {
		let t = e.pendingUploads().map((e) => ({
			id: `pending-${e.id}`,
			name: e.name,
			progress: 0,
			status: "error",
			message: l("uploadReselectToResume")
		}));
		t.length > 0 && (_((e) => [...e.filter((e) => !e.id.startsWith("pending-")), ...t]), y(!1));
	}, [e, l]), (0, h.useEffect)(() => {
		if (!o || g.length === 0 || g.some((e) => e.status === "queued" || e.status === "uploading")) return;
		let e = window.setTimeout(() => y(!0), 1200);
		return () => window.clearTimeout(e);
	}, [o, g]);
	let T = (e, t) => {
		_((n) => n.map((n) => n.id === e ? {
			...n,
			...t
		} : n));
	}, re = async (i, o = n) => {
		let u = Array.from(i).map((e) => De(e, Ee(e.name, c))), d = r ? u.filter((e) => a(e.name, r.maxFileNameLength) === null) : u;
		d.length !== u.length && r && p(u.map((e) => a(e.name, r.maxFileNameLength)).filter((e) => e !== null).includes("tooLong") ? `${l("fileNameTooLong")} ${r.maxFileNameLength}` : l("invalidEntryName"));
		let m = d.map((n) => {
			let r = `${Date.now()}-${++ee.current}`, i = new AbortController();
			C.current.set(r, i), w.current.set(r, {
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
		y(!1);
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
					C.current.delete(n.id);
					continue;
				}
				T(n.id, {
					status: "uploading",
					progress: 0,
					message: void 0
				});
				let r = s === "overwrite", i = s === "rename";
				try {
					for (;;) try {
						await e.upload(t, o, n.file, {
							overwrite: r,
							autoRename: i,
							signal: n.controller.signal,
							onProgress: (e) => T(n.id, { progress: e })
						}), T(n.id, {
							status: "done",
							progress: 100
						});
						break;
					} catch (e) {
						if (e instanceof S && e.code === "conflict" && !r && !i) {
							let e = await ne(n.file.name);
							if (e === "skip") {
								T(n.id, {
									status: "skipped",
									progress: 0,
									message: l("uploadConflictSkip")
								});
								break;
							}
							r = e === "overwrite", i = e === "rename", T(n.id, { progress: 0 });
							continue;
						}
						throw e;
					}
				} catch (e) {
					T(n.id, e instanceof DOMException && e.name === "AbortError" ? {
						status: "cancelled",
						message: l("cancelled")
					} : {
						status: "error",
						message: e instanceof Error ? e.message : l("error")
					});
				} finally {
					C.current.delete(n.id);
				}
			}
		};
		await Promise.all(Array.from({ length: Math.min(3, m.length) }, () => v())), await f();
	}, ie = async (o) => {
		if (!r) return;
		let s = Array.from(o);
		if (s.length > 500) {
			p(l("folderUploadTooMany"));
			return;
		}
		let c = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Map();
		for (let e of s) {
			let t = e.webkitRelativePath.replace(/\\/g, "/").split("/").filter(Boolean);
			if (t.length < 2 || t.some((e) => a(e, e === t.at(-1) ? r.maxFileNameLength : r.maxFolderNameLength) !== null)) {
				p(l("invalidEntryName"));
				return;
			}
			let o = t.slice(0, -1);
			if (i + o.length > r.maxFolderDepth) {
				p(l("folderDepthReached"));
				return;
			}
			o.forEach((e, t) => c.add(o.slice(0, t + 1).join("/")));
			let s = [n, ...o].filter(Boolean).join("/");
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
					if (!(e instanceof S) || e.code !== "conflict") throw e;
				}
			}
			for (let [e, t] of d) await re(t, e);
		} catch (e) {
			m(e);
		}
	}, ae = (e) => {
		C.current.get(e)?.abort(), T(e, {
			status: "cancelled",
			message: l("cancelled")
		});
	}, oe = () => {
		C.current.forEach((e) => e.abort()), _((e) => e.map((e) => e.status === "queued" || e.status === "uploading" ? {
			...e,
			status: "cancelled",
			message: l("cancelled")
		} : e));
	}, se = (e) => {
		C.current.get(e)?.abort(), C.current.delete(e), w.current.delete(e), _((t) => t.filter((t) => t.id !== e));
	};
	return {
		uploads: g,
		uploadsCollapsed: v,
		setUploadsCollapsed: y,
		uploadInput: b,
		directoryUploadInput: x,
		upload: re,
		uploadTo: (e, t) => re(t, e),
		uploadDirectory: ie,
		cancelUpload: ae,
		cancelAllUploads: oe,
		removeUploadTask: se,
		retryUpload: (e) => {
			let t = w.current.get(e);
			t && (se(e), re([t.file], t.targetPath));
		},
		clearFinishedUploads: () => {
			let e = new Set(g.filter((e) => e.status === "queued" || e.status === "uploading").map((e) => e.id));
			w.current.forEach((t, n) => {
				e.has(n) || w.current.delete(n);
			}), _((e) => e.filter((e) => e.status === "queued" || e.status === "uploading"));
		}
	};
}
//#endregion
//#region src/pluginUi.ts
var ke = (e, t) => e.label[t] || e.label.en, Ae = (e, t) => {
	if (e.directory) return null;
	let n = e.mimeType?.toLowerCase() || "", r = e.name.includes(".") && e.name.split(".").pop()?.toLowerCase() || "";
	return t.find((e) => e.extensions.includes(r) || e.mimeTypes.some((e) => e === n || e.endsWith("/*") && n.startsWith(e.slice(0, -1)))) || null;
}, je = (e, t, n) => {
	let r = Ae(e, t);
	if (!r) return null;
	let i = new URL(r.url, window.location.href);
	return i.searchParams.set("resource", n), i.searchParams.set("path", e.path), i.toString();
}, Me = (e, t) => e.selection === "none" ? t === null : !t || e.selection === "file" && t.directory || e.selection === "image" && (t.directory || !t.mimeType?.startsWith("image/")) ? !1 : t.capabilities?.[e.requires] !== !1, Ne = /* @__PURE__ */ new Set([
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
]), Pe = /* @__PURE__ */ new Set([
	"zip",
	"rar",
	"7z",
	"tar",
	"gz",
	"bz2",
	"xz"
]), Fe = (e) => e.name.includes(".") ? e.name.split(".").pop().toLowerCase() : "";
function Ie(e) {
	if (e.directory) return "folder";
	let t = (e.mimeType || "").toLowerCase(), n = Fe(e);
	return t.startsWith("image/") ? "image" : t.startsWith("audio/") ? "audio" : t.startsWith("video/") ? "video" : t.startsWith("text/") || t.includes("document") || t.includes("sheet") || t.includes("presentation") || Ne.has(n) ? "document" : t.includes("zip") || t.includes("compressed") || t.includes("archive") || Pe.has(n) ? "archive" : "other";
}
function Le(e, t) {
	return t === "all" ? e : e.filter((e) => Ie(e) === t);
}
function Re(e, t, n, r = Date.now()) {
	if (t === "none") return [{
		key: "all",
		label: "",
		entries: e
	}];
	let i = /* @__PURE__ */ new Map();
	for (let a of e) {
		let [e, o] = ze(a, t, n, r), s = `${e}\0${o}`;
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
function ze(e, t, n, r) {
	if (t === "type") {
		let t = Ie(e);
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
var Be = (0, h.lazy)(() => import("./ImageEditor-BC9FnRNj.js").then((e) => ({ default: e.ImageEditor }))), Ve = (0, h.lazy)(() => import("./ImageProcessDialog-BXXUiXNB.js").then((e) => ({ default: e.ImageProcessDialog }))), He = (0, h.lazy)(() => import("./SecurityStatusDialog-CLbhkkDo.js").then((e) => ({ default: e.SecurityStatusDialog }))), Ue = (0, h.lazy)(() => import("./DocumentPreviewPane-DhmHG-pU.js")), We = (0, h.lazy)(() => import("./SettingsDialog-BhOPM_OQ.js").then((e) => ({ default: e.SettingsDialog }))), Ge = (0, h.lazy)(() => import("./DestinationDialog-CHfiXcOr.js").then((e) => ({ default: e.DestinationDialog }))), Ke = (0, h.lazy)(() => import("./BulkRenameDialog-Dr9MLWWP.js").then((e) => ({ default: e.BulkRenameDialog }))), qe = (0, h.lazy)(() => import("./TrashDialog-CRUzG7u0.js").then((e) => ({ default: e.TrashDialog }))), Je = (0, h.lazy)(() => import("./TagsDialog-C5MRKRfY.js").then((e) => ({ default: e.TagsDialog }))), Ye = (0, h.lazy)(() => import("./FolderTree-CmQzaPks.js").then((e) => ({ default: e.FolderTree }))), Xe = (0, h.lazy)(() => import("./DetailsPanel-VAkzkQQp.js").then((e) => ({ default: e.DetailsPanel }))), Ze = (0, h.lazy)(() => import("./ShareDialog-eimnLvhx.js")), Qe = (0, h.lazy)(() => import("./FavoritesPage-CsbtbprE.js")), $e = (0, h.lazy)(() => import("./MetadataSidebarPanels-B5JLnmbU.js")), et = (0, h.lazy)(() => import("./MetadataSidebarPanels-B5JLnmbU.js").then((e) => ({ default: e.RecentPanel }))), tt = (0, h.lazy)(() => import("./ContextMenu-B5qP5e8D.js").then((e) => ({ default: e.ContextMenu }))), nt = (0, h.lazy)(() => import("./UploadQueue-DORLpY6-.js").then((e) => ({ default: e.UploadQueue }))), rt = (0, h.lazy)(() => import("./ImagePreviewPane-D5O_-Lqv.js")), it = () => {
	let e = localStorage.getItem("sofinder.groupMode.v1");
	return e === "name" || e === "type" || e === "size" || e === "modified" || e === "tags" ? e : "none";
}, at = () => {
	let e = localStorage.getItem("sofinder.typeFilter.v1");
	return e === "folder" || e === "image" || e === "document" || e === "audio" || e === "video" || e === "archive" || e === "other" ? e : "all";
};
function ot({ config: e, initialMessages: t }) {
	let n = (0, h.useId)(), a = (0, h.useMemo)(() => new C(e), [e]), l = e.uiDefaults.mode ?? (e.selectMode ? "picker" : "manager"), u = e.featureAvailability ?? E, [d, f] = (0, h.useState)(() => {
		let t = localStorage.getItem("sofinder.language");
		return t === "en" || t === "zh-cn" || t === "zh-tw" ? t : e.language;
	}), [p, m] = (0, h.useState)(t), g = (0, h.useMemo)(() => te(p), [p]), _ = (0, h.useMemo)(() => new Intl.DateTimeFormat(d, {
		dateStyle: "medium",
		timeStyle: "short"
	}), [d]), [v, y] = (0, h.useState)([]), { resource: b, setResource: x, path: w, setPath: ne, resolvedPath: ye, setResolvedPath: Ee, entries: De, setEntries: Ne, search: Pe, setSearch: Fe, searchMode: Ie, setSearchMode: ze, sort: ot, setSort: ct, direction: lt, setDirection: ut, offset: dt, setOffset: ft, total: pt, setTotal: mt, pageCursor: ht, setPageCursor: gt, nextCursor: _t, setNextCursor: vt, cursorHistory: yt, setCursorHistory: bt, pageSize: xt, setPageSize: St, pageSizeDraft: Ct, setPageSizeDraft: wt, pageSizeRef: Tt, view: Et, setView: Dt, loading: Ot, setLoading: kt, notice: At, setNotice: jt, directoryCapabilities: Mt, setDirectoryCapabilities: Nt, loadSequence: Pt, historyReady: Ft, restoringHistory: It, searchInitialized: Lt } = we(e.resource, e.initialPath || ""), [Rt, zt] = (0, h.useState)({
		favorites: [],
		quickAccess: [],
		quickAccessEntries: [],
		tags: {},
		recent: []
	}), [Bt, Vt] = (0, h.useState)({}), [k, Ht] = (0, h.useState)(() => new URL(window.location.href).searchParams.get("collection") === "favorites" ? "favorites" : null), [Ut, Wt] = (0, h.useState)(null), [Gt, Kt] = (0, h.useState)(() => e.uiDefaults.fullTools ? {
		resize: !0,
		crop: !0,
		rotate: !0,
		presets: !0,
		process: !0,
		batchRename: !0
	} : ue()), [A, qt] = (0, h.useState)(() => {
		let t = D("sofinder.features.v2", {
			...ce,
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
	}), [Jt, Yt] = (0, h.useState)(() => D("sofinder.listColumns.v1", le)), [Xt, Zt] = (0, h.useState)(Se), [Qt, $t] = (0, h.useState)(de), [en, tn] = (0, h.useState)(me), [nn, rn] = (0, h.useState)(O), [an, on] = (0, h.useState)(!1), [sn, cn] = (0, h.useState)(!1), [ln, un] = (0, h.useState)(!1), [dn, fn] = (0, h.useState)(!1), [pn, mn] = (0, h.useState)(it), [hn, gn] = (0, h.useState)(at), [_n, vn] = (0, h.useState)(() => fe(e.uiDefaults?.scale ?? "standard")), [yn, bn] = (0, h.useState)(() => pe(e.uiDefaults.uploadConflictStrategy ?? "ask")), xn = e.uiDefaults.lowercaseUploadExtensions ?? !0, { destinationDialog: Sn, setDestinationDialog: Cn, bulkRenameOpen: wn, setBulkRenameOpen: Tn } = Te(), [En, Dn] = (0, h.useState)(!1), [On, kn] = (0, h.useState)(!1), [An, jn] = (0, h.useState)(null), [Mn, Nn] = (0, h.useState)(null), [Pn, Fn] = (0, h.useState)(null), [In, Ln] = (0, h.useState)(!1), [Rn, zn] = (0, h.useState)(!1), [Bn, Vn] = (0, h.useState)(null), [Hn, Un] = (0, h.useState)(null), [j, Wn] = (0, h.useState)(null), [Gn, Kn] = (0, h.useState)(null), [qn, Jn] = (0, h.useState)(null), [Yn, Xn] = (0, h.useState)(null), [Zn, Qn] = (0, h.useState)({}), [$n, er] = (0, h.useState)({
		driver: "",
		formats: []
	}), [tr, nr] = (0, h.useState)([]), [rr, ir] = (0, h.useState)({
		enabled: !1,
		defaultTtlSeconds: 300,
		maxTtlSeconds: 3600
	}), [ar, or] = (0, h.useState)(() => be("left")), [sr, cr] = (0, h.useState)(() => be("right")), lr = (0, h.useRef)(null), ur = (0, h.useRef)(null), dr = (0, h.useRef)(null), fr = (0, h.useRef)(null), pr = (0, h.useRef)(null), mr = (0, h.useRef)(null), hr = (0, h.useRef)(null), gr = (0, h.useRef)(null), _r = (0, h.useRef)(null), vr = (0, h.useRef)(b), yr = (0, h.useRef)({}), br = (0, h.useRef)({}), xr = (0, h.useRef)(null);
	(0, h.useEffect)(() => {
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
	}, [e.theme]), (0, h.useEffect)(() => (document.documentElement.dataset.sofinderScale = _n, localStorage.setItem("sofinder.uiScale.v1", _n), () => {
		delete document.documentElement.dataset.sofinderScale;
	}), [_n]), (0, h.useEffect)(() => {
		localStorage.setItem("sofinder.uploadConflictStrategy.v1", yn);
	}, [yn]), (0, h.useEffect)(() => {
		localStorage.setItem("sofinder.language", d), document.documentElement.lang = d === "zh-cn" ? "zh-CN" : d === "zh-tw" ? "zh-TW" : "en";
		let e = !0;
		return ee(d).then((t) => {
			e && m(t);
		}), () => {
			e = !1;
		};
	}, [d]), (0, h.useEffect)(() => {
		if (!ln) return;
		let e = (e) => {
			e.target instanceof Node && !hr.current?.contains(e.target) && un(!1);
		}, t = (e) => {
			e.key === "Escape" && (e.preventDefault(), un(!1), gr.current?.focus());
		};
		return document.addEventListener("pointerdown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("keydown", t);
		};
	}, [ln]), (0, h.useEffect)(() => {
		if (!dn) return;
		let e = (e) => {
			e.target instanceof Node && !_r.current?.contains(e.target) && fn(!1);
		};
		return document.addEventListener("pointerdown", e), () => document.removeEventListener("pointerdown", e);
	}, [dn]);
	let M = (0, h.useCallback)((e) => jt(e instanceof Error ? e.message : g("error")), [g]), Sr = (0, h.useCallback)((e, t, n) => (yr.current[e] || 0) === n && (vr.current === e && zt(t), Vt((n) => ({
		...n,
		[e]: t.quickAccessEntries
	})), !0), []), Cr = (0, h.useCallback)(async (e, t = !1) => {
		if (!e || !t && (br.current[e] || 0) > 0) return null;
		let n = (yr.current[e] || 0) + 1;
		yr.current[e] = n;
		let r = await a.metadata(e);
		return Sr(e, r, n), r;
	}, [a, Sr]), wr = (0, h.useCallback)(async (e, t, n, r = {}) => {
		let i = (yr.current[e] || 0) + 1;
		yr.current[e] = i, br.current[e] = (br.current[e] || 0) + 1;
		try {
			let o = await a.updateMetadata(e, t, n, r);
			return Sr(e, o, i), xr.current?.postMessage({ resource: e }), o;
		} finally {
			br.current[e] = Math.max(0, (br.current[e] || 1) - 1), br.current[e] === 0 && (yr.current[e] || 0) !== i && Cr(e, !0).catch(M);
		}
	}, [
		a,
		Sr,
		Cr,
		M
	]);
	(0, h.useEffect)(() => {
		vr.current = b;
	}, [b]), (0, h.useEffect)(() => {
		if (!("BroadcastChannel" in window)) return;
		let e;
		try {
			e = new BroadcastChannel("sofinder-metadata-v1");
		} catch {
			return;
		}
		return xr.current = e, e.onmessage = (e) => {
			let t = typeof e.data?.resource == "string" ? e.data.resource : "";
			t && Cr(t).catch(M);
		}, () => {
			xr.current = null, e.close();
		};
	}, [Cr, M]);
	let Tr = (0, h.useCallback)((e) => new Promise((t) => {
		lr.current?.(!1), lr.current = t, Nn(e);
	}), []), Er = (e) => {
		let t = lr.current;
		lr.current = null, Nn(null), t?.(e);
	}, Dr = (0, h.useCallback)((e) => new Promise((t) => {
		ur.current?.("skip"), ur.current = t, Fn(e);
	}), []), Or = (e) => {
		let t = ur.current;
		ur.current = null, Fn(null), t?.(e);
	}, N = (0, h.useCallback)(async (e = b, t = w, n = Pe, r = dt, i = ot, o = lt, s = Ie, c = ht) => {
		if (!e) return "error";
		let l = ++Pt.current;
		kt(!0), jt("");
		try {
			let u = await a.list(e, t, n, i, o, r, Tt.current, s, c);
			return l === Pt.current ? (Ne(u.entries), ne(u.path), Ee(u.path), ft(u.offset), mt(u.total), gt(c), vt(u.nextCursor ?? null), Nt(u.capabilities || {}), Xr(/* @__PURE__ */ new Set()), Qr(null), "ok") : "stale";
		} catch (n) {
			if (l !== Pt.current) return "stale";
			if (n instanceof S && n.code === "not_found" && t !== "") try {
				let t = await a.list(e, "", "", i, o, 0, Tt.current, "name", null);
				return l === Pt.current ? (Ne(t.entries), ne(t.path), Ee(t.path), ft(t.offset), mt(t.total), gt(null), vt(t.nextCursor ?? null), Nt(t.capabilities || {}), Xr(/* @__PURE__ */ new Set()), Qr(null), bt([]), jt(g("missingPathFallback")), "not_found") : "stale";
			} catch (e) {
				n = e;
			}
			return Ne([]), ne(t), ft(r), mt(null), gt(c), vt(null), Nt({}), Xr(/* @__PURE__ */ new Set()), Qr(null), M(n), "error";
		} finally {
			l === Pt.current && kt(!1);
		}
	}, [
		a,
		lt,
		dt,
		ht,
		w,
		M,
		b,
		Pe,
		Ie,
		ot,
		g
	]), P = v.find((e) => e.name === b), kr = w === "" ? 0 : w.split("/").length, { uploads: Ar, uploadsCollapsed: jr, setUploadsCollapsed: Mr, uploadInput: Nr, directoryUploadInput: Pr, upload: Fr, uploadTo: Ir, uploadDirectory: Lr, cancelUpload: Rr, cancelAllUploads: zr, removeUploadTask: Br, retryUpload: Vr, clearFinishedUploads: Hr } = Oe({
		api: a,
		resource: b,
		path: w,
		currentResource: P,
		currentDepth: kr,
		autoCollapse: A.autoCollapseUploads,
		conflictStrategy: yn,
		lowercaseExtensions: xn,
		t: g,
		ask: Tr,
		chooseConflict: Dr,
		reload: async () => {
			await N();
		},
		setNotice: jt,
		report: M
	});
	(0, h.useEffect)(() => {
		a.configData().then(({ resources: t, plugins: n, imagePresets: r, imageCapabilities: i, signedUrls: a }) => {
			y(t), nr(n || []), Qn(r || {}), er(i || {
				driver: "",
				formats: []
			}), ir(a || {
				enabled: !1,
				defaultTtlSeconds: 300,
				maxTtlSeconds: 3600
			});
			let o = t.some((t) => t.name === e.resource) ? e.resource : t[0]?.name || "";
			x(o), o && (bt([]), N(o, e.initialPath || "", "", 0, ot, lt, "name", null));
		}).catch(M);
	}, [
		a,
		e.initialPath,
		e.resource
	]), (0, h.useEffect)(() => {
		let t = () => {
			let t = new URL(window.location.href), n = t.searchParams.get("type") || e.resource, r = t.searchParams.get("path") || "", i = t.searchParams.get("collection") === "favorites" ? "favorites" : null;
			It.current = !0, x(n), Ht(i), Fe(""), ze("name"), bt([]), i === null && N(n, r, "", 0, "name", "asc", "name", null);
		};
		return window.addEventListener("popstate", t), () => window.removeEventListener("popstate", t);
	}, [e.resource, N]), (0, h.useEffect)(() => {
		if (!b || Ot) return;
		let e = new URL(window.location.href), t = e.searchParams.get("type") || "", n = e.searchParams.get("path") || "", r = e.searchParams.get("collection") === "favorites" ? "favorites" : null;
		if (t === b && n === w && r === k) {
			Ft.current = !0, It.current = !1;
			return;
		}
		e.searchParams.set("type", b), w ? e.searchParams.set("path", w) : e.searchParams.delete("path"), k ? e.searchParams.set("collection", k) : e.searchParams.delete("collection");
		let i = {
			...window.history.state || {},
			sofinder: {
				resource: b,
				path: w,
				collection: k
			}
		};
		!Ft.current || It.current ? window.history.replaceState(i, "", e) : window.history.pushState(i, "", e), Ft.current = !0, It.current = !1;
	}, [
		k,
		Ot,
		w,
		b
	]), (0, h.useEffect)(() => {
		if (!Lt.current) {
			Lt.current = !0;
			return;
		}
		if (k) return;
		let e = window.setTimeout(() => {
			b && (bt([]), N(b, w, Pe, 0, ot, lt, Ie, null));
		}, 250);
		return () => window.clearTimeout(e);
	}, [Pe, Ie]), (0, h.useEffect)(() => {
		if (b) {
			if (!A.recent && !A.favorites && u.quickAccess === !1 && !A.tags) {
				zt({
					favorites: [],
					quickAccess: [],
					quickAccessEntries: [],
					tags: {},
					recent: []
				});
				return;
			}
			Cr(b).catch(M);
		}
	}, [
		u.quickAccess,
		A.favorites,
		A.recent,
		A.tags,
		Cr,
		M,
		b
	]), (0, h.useEffect)(() => {
		u.quickAccess === !1 || !A.sidebarQuickAccess || nn !== "all" || Promise.all(v.filter((e) => e.name !== b).map((e) => Cr(e.name))).catch(M);
	}, [
		u.quickAccess,
		A.sidebarQuickAccess,
		Cr,
		nn,
		M,
		b,
		v
	]), (0, h.useEffect)(() => {
		if (u.quickAccess === !1 || !A.sidebarQuickAccess) return;
		let e = window.setInterval(() => Object.entries(Bt).forEach(([e, t]) => {
			t.length > 0 && Cr(e).catch(M);
		}), 6e4);
		return () => window.clearInterval(e);
	}, [
		u.quickAccess,
		A.sidebarQuickAccess,
		Cr,
		Bt,
		M
	]), (0, h.useEffect)(() => {
		!A.favorites && k === "favorites" && Ht(null);
	}, [k, A.favorites]), (0, h.useEffect)(() => {
		let e = (e) => {
			let t = Array.from(e.clipboardData?.files || []);
			t.length > 0 && k === null && !P?.readOnly && Mt.upload !== !1 && (e.preventDefault(), Fr(t));
		};
		return window.addEventListener("paste", e), () => window.removeEventListener("paste", e);
	}, [
		k,
		P?.readOnly,
		Mt.upload,
		Fr
	]);
	let Ur = (0, h.useMemo)(() => w === "" ? [] : w.split("/"), [w]), Wr = (0, h.useCallback)((e) => {
		A.recent && wr(b, e.path, "touch").catch(M);
	}, [
		A.recent,
		wr,
		M,
		b
	]), Gr = (0, h.useMemo)(() => Le(De, hn), [De, hn]), Kr = pn === "tags" && !A.tags ? "none" : pn, qr = (0, h.useMemo)(() => Re(Gr, Kr, Rt.tags), [
		Gr,
		Kr,
		Rt.tags
	]), Jr = (0, h.useMemo)(() => qr.flatMap((e) => e.entries), [qr]), { selectedPaths: Yr, setSelectedPaths: Xr, selectionAnchor: Zr, setSelectionAnchor: Qr, selectedEntries: F, selected: I, selectEntry: $r } = Ce(Jr, l === "picker", Wr), ei = (e) => $n.formats.find((t) => e.mimeType !== null && t.mimes.includes(e.mimeType.toLowerCase())), ti = (e) => !!(e && ei(e)?.thumbnail), ni = (e) => !!(e && ei(e)?.edit), ri = F.filter((e) => ni(e)), ii = (t) => !!(t && !t.directory && t.url && (e.selectionKind !== "image" || ei(t)?.webEmbeddable)), ai = async (e) => {
		if (e.directory) return null;
		if (P?.entryUrlConfigured && e.url) return {
			url: new URL(e.url, document.baseURI).href,
			loginRequired: !0
		};
		if (rr.enabled && P?.deliveryMode === "proxy") {
			let t = await a.signedUrl(b, e.path, rr.defaultTtlSeconds);
			return {
				url: t.url,
				loginRequired: !1,
				expiresAt: t.expiresAt
			};
		}
		return {
			url: new URL(e.url || a.downloadUrl(b, e.path), document.baseURI).href,
			loginRequired: !e.url
		};
	}, oi = async (e) => {
		try {
			let t = await ai(e);
			t && Xn({
				...t,
				fileName: e.name
			});
		} catch (e) {
			M(e);
		}
	}, si = (e) => F.length > 0 && F.every((t) => t.capabilities?.[e] !== !1), ci = A.quickAccessFiles, li = (e) => !!(e && (e.directory || Rt.quickAccess.includes(e.path) || ci)), ui = (0, h.useMemo)(() => tr.flatMap((e) => (e.uiActions || []).map((t) => ({
		...t,
		plugin: e.name
	}))), [tr]), di = (0, h.useMemo)(() => tr.flatMap((e) => (e.previewers || []).map((t) => ({
		...t,
		plugin: e.name
	}))), [tr]), fi = (e, t) => {
		if (!Me(e, t)) return;
		let n = new URL(e.url, document.baseURI);
		n.searchParams.set("resource", b), n.searchParams.set("directory", w), t && n.searchParams.set("path", t.path), window.open(n, "_blank", "noopener");
	};
	(0, h.useEffect)(() => {
		if (Wt(null), !I || !ei(I)?.read) return;
		let e = !0;
		return a.imageInfo(b, I.path).then((t) => {
			e && Wt(t);
		}).catch((t) => {
			e && M(t);
		}), () => {
			e = !1;
		};
	}, [
		a,
		b,
		I?.path,
		I?.mimeType,
		M
	]), (0, h.useEffect)(() => {
		if (Kn(null), Jn(null), u.textPreview === !1 || !j || !st(j.mimeType)) return;
		let e = !0;
		return a.textPreview(b, j.path).then((t) => {
			e && Kn({
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
		a,
		u.textPreview,
		j?.path,
		j?.mimeType,
		M,
		b
	]);
	let pi = (e) => {
		e.directory ? (bt([]), N(b, e.path, Pe, 0, ot, lt, Ie, null)) : bi(e);
	}, mi = async () => {
		P && jn({
			kind: "folder",
			title: g("newFolder"),
			label: g("folderName"),
			initial: "",
			maximum: P.maxFolderNameLength
		});
	}, hi = async () => {
		if (!I || !P) return;
		let e = I.directory ? -1 : I.name.lastIndexOf("."), t = e > 0 ? I.name.slice(e) : "", n = t ? I.name.slice(0, e) : I.name, r = I.directory ? P.maxFolderNameLength : P.maxFileNameLength;
		jn({
			kind: "rename",
			title: g("rename"),
			label: g(t ? "newBaseName" : "newName"),
			initial: n,
			maximum: r,
			extension: t
		});
	}, gi = async () => {
		if (!(F.length === 0 || !await Tr({
			title: g("remove"),
			message: F.length === 1 ? g("confirmDelete") : `${g("confirmDeleteMany")} ${F.length}`,
			detail: P?.storageCapabilities?.recoverableDelete === !1 ? g("permanentDeleteWarning") : g("trashRetention"),
			danger: !0
		}))) try {
			let e = await a.batch("delete", b, F.map((e) => e.path)), t = e.failed === 0 ? `${e.succeeded} ${g("completed")}` : `${e.succeeded} ${g("completed")}, ${e.failed} ${g("failed")}`;
			await N(), jt(e.purgedItems > 0 ? `${t} · ${g("trashAutoPurged")} ${e.purgedItems} ${g("items")} (${c(e.purgedBytes)})` : t);
		} catch (e) {
			M(e);
		}
	}, _i = async (e) => {
		Tn(!1);
		try {
			let t = await a.batchRename(b, e);
			await N(), jt(t.failed === 0 ? `${t.succeeded} ${g("completed")}` : `${t.succeeded} ${g("completed")}, ${t.failed} ${g("failed")}`);
		} catch (e) {
			M(e);
		}
	}, vi = async (e, t) => {
		try {
			let n = await a.batch(e, b, F.map((e) => e.path), t);
			Cn(null), await N(), jt(n.failed === 0 ? `${n.succeeded} ${g("completed")}` : `${n.succeeded} ${g("completed")}, ${n.failed} ${g("failed")}`);
		} catch (e) {
			M(e);
		}
	}, yi = async (e, t) => {
		Cn({
			operation: e,
			path: t,
			folders: [],
			loading: !0
		});
		try {
			let n = await a.list(b, t, "", "name", "asc", 0, 500);
			Cn({
				operation: e,
				path: n.path,
				folders: n.entries.filter((e) => e.directory),
				loading: !1
			});
		} catch (n) {
			if (n instanceof S && n.code === "not_found" && t !== "") try {
				let t = await a.list(b, "", "", "name", "asc", 0, 500);
				Cn({
					operation: e,
					path: t.path,
					folders: t.entries.filter((e) => e.directory),
					loading: !1
				}), jt(g("missingDestinationFallback"));
				return;
			} catch (e) {
				n = e;
			}
			Cn((e) => e ? {
				...e,
				loading: !1
			} : null), M(n);
		}
	}, bi = async (t = I) => {
		if (!ii(t)) {
			t && e.selectionKind === "image" && jt(g("webImageUnsupported"));
			return;
		}
		if (!t?.url) return;
		let n = t === I ? Ut : null;
		if (ei(t)?.read && n === null) try {
			n = await a.imageInfo(b, t.path);
		} catch {
			n = null;
		}
		let r = {
			...t,
			resource: b,
			url: t.url,
			width: n?.width ?? null,
			height: n?.height ?? null
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
				entry: r
			}, e.pickerOrigin), window.opener && window.close();
			return;
		}
		window.dispatchEvent(new CustomEvent("sofinder:select", { detail: r }));
	}, xi = () => {
		Xr(new Set(Jr.map((e) => e.path))), Qr(null);
	}, Si = () => {
		Xr(/* @__PURE__ */ new Set()), Qr(null);
	}, Ci = () => {
		Xr((e) => new Set(Jr.filter((t) => !e.has(t.path)).map((e) => e.path))), Qr(null);
	}, wi = async (e, t = 0, n = 0) => {
		if (!(!I || !ni(I))) {
			kt(!0);
			try {
				let r = e === 0 ? [{
					type: "resize",
					width: t,
					height: n
				}] : [{
					type: "rotate",
					degrees: e
				}], i = await a.applyImageActions(b, I.path, r, { mode: "copy" });
				jt(`${g("imageCreated")}: ${i.entry.name} · ${i.result.width} × ${i.result.height} px`), await N();
			} catch (e) {
				M(e), kt(!1);
			}
		}
	}, Ti = () => {
		I && jn({
			kind: "resize",
			title: g("resize"),
			label: g("resizePrompt"),
			initial: "1200x1200",
			maximum: 9
		});
	}, Ei = () => {
		!I || !Ut || Dn(!0);
	}, Di = (e, t) => {
		Kt((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.tools.v3", JSON.stringify(r)), r;
		});
	}, Oi = (e, t) => {
		(e === "autoCollapseUploads" || e === "sidebarFavorites" || e === "sidebarQuickAccess" || u[e] !== !1) && qt((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.features.v2", JSON.stringify(r)), r;
		});
	}, ki = (e, t) => {
		Yt((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.listColumns.v1", JSON.stringify(r)), r;
		});
	}, Ai = (e, t) => {
		$t((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.viewSizes.v1", JSON.stringify(r)), r;
		});
	}, ji = (e) => {
		tn(e), localStorage.setItem("sofinder.folderNavigation.position.v1", e);
	}, Mi = async () => {
		if (F.length !== 0) try {
			let e = await a.downloadArchive(b, F.map((e) => e.path)), t = URL.createObjectURL(e), n = document.createElement("a");
			n.href = t, n.download = "sofinder-download.zip", n.click(), window.setTimeout(() => URL.revokeObjectURL(t), 1e3);
		} catch (e) {
			M(e);
		}
	}, Ni = async (e = I) => {
		if (e) try {
			await wr(b, e.path, "favorite", { favorite: !Rt.favorites.includes(e.path) });
		} catch (e) {
			M(e);
		}
	}, Pi = async (e = I) => {
		if (e && !(!e.directory && !Rt.quickAccess.includes(e.path) && !ci)) try {
			await wr(b, e.path, "quick_access", { pinned: !Rt.quickAccess.includes(e.path) });
		} catch (e) {
			M(e);
		}
	}, Fi = async () => {
		I && zn(!0);
	}, L = async (e) => {
		let t = An;
		if (jn(null), t) try {
			if (t.kind === "folder") await a.createFolder(b, w, e);
			else if (t.kind === "rename" && I && e !== I.name) await a.rename(b, I.path, e);
			else if (t.kind === "resize") {
				let t = /^(\d{1,4})[x×](\d{1,4})$/i.exec(e.replace(/\s/g, ""));
				if (!t) {
					jt(g("invalidDimensions"));
					return;
				}
				await wi(0, Number(t[1]), Number(t[2]));
			}
			(t.kind === "folder" || t.kind === "rename") && await N();
		} catch (e) {
			M(e);
		}
	}, R = async (e) => {
		let t = e.includes("/") ? e.slice(0, e.lastIndexOf("/")) : "", n = e.split("/").pop() || e;
		try {
			if (!(await a.list(b, t, n, "name", "asc", 0, 500)).entries.some((t) => t.path === e)) {
				await wr(b, e, "forget"), jt(g("recentMissing"));
				return;
			}
			await N(b, t, "", 0), Xr(/* @__PURE__ */ new Set([e]));
		} catch (t) {
			if (t instanceof S && t.code === "not_found") {
				try {
					await wr(b, e, "forget");
				} catch (e) {
					M(e);
					return;
				}
				jt(g("recentMissing"));
				return;
			}
			M(t);
		}
	}, Ii = (e) => {
		Dt(e), localStorage.setItem("sofinder.view", e);
	}, Li = (e) => {
		let t = Bn?.entry ?? null;
		if (Vn(null), e.startsWith("plugin:")) {
			let n = ui.find((t) => `plugin:${t.plugin}:${t.id}` === e);
			n && fi(n, t);
			return;
		}
		e === "open" && t?.directory ? pi(t) : e === "preview" && t && !t.directory ? Wn(t) : e === "select" && t ? bi(t) : e === "rename" ? hi() : e === "copy" ? yi("copy", w) : e === "move" ? yi("move", w) : e === "delete" ? gi() : e === "favorite" && t ? Ni(t) : e === "quick-access" && t ? Pi(t) : e === "download" && t && !t.directory ? window.open(t.url || a.downloadUrl(b, t.path), "_blank", "noopener,noreferrer") : e === "share" && t && !t.directory && oi(t);
	}, Ri = async (e) => {
		if (I) try {
			let t = await a.applyImageActions(b, I.path, [{
				type: "preset",
				name: e
			}], { mode: "copy" });
			jt(`${g("imageCreated")}: ${t.entry.name} · ${t.result.width} × ${t.result.height} px`), await N();
		} catch (e) {
			M(e);
		}
	}, zi = (e) => {
		window.requestAnimationFrame(() => {
			document.querySelector(`button.sf-entry[data-entry-index="${e}"]`)?.focus();
		});
	}, Bi = (e, t, n = !1) => {
		let r = he[e], i = Math.round(Math.max(r.min, Math.min(r.max, t)));
		e === "left" ? or(i) : cr(i), n && localStorage.setItem(`sofinder.column.${e}`, String(i));
	}, Vi = (e, t) => {
		t.preventDefault(), t.currentTarget.setPointerCapture(t.pointerId), t.currentTarget.classList.add("is-resizing");
		let n = e === "left" ? ar : sr;
		fr.current = {
			side: e,
			startX: t.clientX,
			startWidth: n,
			currentWidth: n,
			element: t.currentTarget
		};
	}, Hi = (e) => {
		let t = fr.current;
		if (!t) return;
		let n = e.clientX - t.startX, r = he[t.side];
		t.currentWidth = Math.round(Math.max(r.min, Math.min(r.max, t.startWidth + (t.side === "left" ? n : -n)))), Bi(t.side, t.currentWidth);
	}, Ui = () => {
		let e = fr.current;
		fr.current = null, e && (e.element.classList.remove("is-resizing"), Bi(e.side, e.currentWidth, !0));
	}, Wi = (e, t) => {
		let n = t.key === "ArrowLeft" ? -1 : +(t.key === "ArrowRight");
		n !== 0 && (t.preventDefault(), Bi(e, (e === "left" ? ar : sr) + (e === "left" ? n : -n) * 10, !0));
	}, Gi = (e, t, n = !1) => {
		let r = xe(e, t);
		Zt((t) => {
			let i = {
				...t,
				[e]: r
			};
			return n && localStorage.setItem("sofinder.listColumnWidths.v1", JSON.stringify(i)), i;
		});
	}, Ki = (e, t) => {
		t.preventDefault(), t.stopPropagation(), t.currentTarget.setPointerCapture(t.pointerId), t.currentTarget.classList.add("is-resizing");
		let n = Xt[e];
		pr.current = {
			column: e,
			startX: t.clientX,
			startWidth: n,
			currentWidth: n,
			element: t.currentTarget
		};
	}, qi = (e) => {
		let t = pr.current;
		t && (t.currentWidth = xe(t.column, t.startWidth + e.clientX - t.startX), Gi(t.column, t.currentWidth));
	}, Ji = () => {
		let e = pr.current;
		pr.current = null, e && (e.element.classList.remove("is-resizing"), Gi(e.column, e.currentWidth, !0));
	}, Yi = (e, t) => {
		let n = t.key === "ArrowLeft" ? -1 : +(t.key === "ArrowRight");
		n !== 0 && (t.preventDefault(), t.stopPropagation(), Gi(e, Xt[e] + n * 10, !0));
	}, Xi = (e) => {
		let t = mr.current;
		if (!t) return;
		let n = e === "name" ? ".sf-entry-name" : e === "size" ? ".sf-entry-size" : e === "type" ? ".sf-entry-type" : ".sf-entry-modified", r = Array.from(t.querySelectorAll(n)), i = t.querySelector(`.sf-list-heading-${e} button`), a = (e) => {
			if (!e) return 0;
			let t = document.createRange();
			return t.selectNodeContents(e), Math.ceil(t.getBoundingClientRect().width);
		}, o = Math.max(a(i), ...r.map(a)) + 24;
		Gi(e, o, !0);
	}, Zi = () => {
		let t = e.uiDefaults.fullTools ? {
			resize: !0,
			crop: !0,
			rotate: !0,
			presets: !0,
			process: !0,
			batchRename: !0
		} : oe;
		Object.keys(t).forEach((e) => Di(e, t[e]));
		let n = {
			...ce,
			folderTree: e.featureDefaults?.folderTree ?? !1
		};
		Object.keys(n).forEach((e) => Oi(e, n[e])), Object.keys(le).forEach((e) => ki(e, le[e])), Object.keys(se).forEach((e) => Ai(e, se[e]));
		let r = Object.fromEntries(Object.keys(ge).map((e) => [e, ge[e].initial]));
		Zt(r), localStorage.setItem("sofinder.listColumnWidths.v1", JSON.stringify(r)), Bi("left", he.left.initial, !0), Bi("right", he.right.initial, !0), ji("left"), rn("all"), localStorage.setItem("sofinder.quickAccess.scope.v1", "all"), vn(e.uiDefaults.scale ?? "standard"), bn(e.uiDefaults.uploadConflictStrategy ?? "ask");
	}, Qi = (e) => {
		let t = e.target, n = t.matches("button.sf-entry");
		if (t.isContentEditable || [
			"INPUT",
			"SELECT",
			"TEXTAREA",
			"BUTTON",
			"A"
		].includes(t.tagName) && !n) return;
		if (l === "manager" && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
			e.preventDefault(), xi();
			return;
		}
		if (e.key === "Escape") {
			e.preventDefault(), Xr(/* @__PURE__ */ new Set()), Qr(null);
			return;
		}
		if (l === "manager" && e.key === "Delete" && si("delete") && !P?.readOnly) {
			e.preventDefault(), gi();
			return;
		}
		if (l === "manager" && e.key === "F2" && F.length === 1 && si("rename") && !P?.readOnly) {
			e.preventDefault(), hi();
			return;
		}
		if (e.key === "Enter" && F.length === 1) {
			e.preventDefault(), pi(F[0]);
			return;
		}
		let r = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : +(e.key === "ArrowRight" || e.key === "ArrowDown");
		if (r !== 0 && Jr.length > 0) {
			e.preventDefault();
			let t = Zr || F[0]?.path, n = t ? Jr.findIndex((e) => e.path === t) : r > 0 ? -1 : Jr.length, i = Math.max(0, Math.min(Jr.length - 1, n + r)), a = Jr[i];
			Xr(/* @__PURE__ */ new Set([a.path])), Qr(a.path), zi(i);
		}
	}, $i = Sn !== null && F.some((e) => {
		let t = e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : "", n = Sn.path === "" ? 0 : Sn.path.split("/").length;
		return Sn.operation === "move" && Sn.path === t || e.directory && P !== void 0 && n >= P.maxFolderDepth || e.directory && (Sn.path === e.path || Sn.path.startsWith(`${e.path}/`));
	}), ea = Ar.some((e) => e.status === "queued" || e.status === "uploading"), ta = e.uiDefaults.fullTools === !0, na = e.uiDefaults.logo !== !1, ra = P?.storageCapabilities?.recoverableDelete !== !1, ia = A.folderTree && en === "left", aa = A.folderTree && en === "right", oa = u.quickAccess !== !1, sa = nn === "resource" ? Rt.quickAccess.length > 0 : Object.values(Bt).some((e) => e.length > 0), z = v.length > 1 || ia || A.recent || A.favorites && A.sidebarFavorites || oa && A.sidebarQuickAccess && sa || !!(P?.readOnly || P?.quotaBytes), ca = (e) => A.recent ? /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
		fallback: null,
		children: /* @__PURE__ */ (0, T.jsx)(et, {
			variant: e,
			items: Rt.recent,
			labels: {
				title: g("recent"),
				empty: g("recentEmpty"),
				home: g("home")
			},
			onOpen: (e) => void R(e)
		})
	}) : null, la = (l === "manager" || ta) && F.length > 0, ua = la || aa, B = (e, t) => /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [/* @__PURE__ */ (0, T.jsx)(r, { name: e }), /* @__PURE__ */ (0, T.jsx)("span", { children: t })] }), da = (e, t, n = Pe) => {
		Ht(null), bt([]), N(e, t, n, 0, ot, lt, Ie, null);
	}, fa = () => {
		Xr(/* @__PURE__ */ new Set()), Qr(null), Fe(""), ze("name"), Ht("favorites");
	}, pa = async (e, t, n, r) => {
		let i = t.includes("/") ? t.slice(0, t.lastIndexOf("/")) : "", o = t.split("/").pop() || t;
		try {
			if (r === !1) throw new S(g("quickAccessRemoved"), "not_found", 404);
			let n = (await a.list(e, i, o, "name", "asc", 0, 500)).entries.find((e) => e.path === t);
			if (!n) throw new S(g("favoriteMissing"), "not_found", 404);
			if (Ht(null), x(e), n.directory) {
				if (bt([]), await N(e, n.path, "", 0, ot, lt, "name", null) === "not_found") throw new S(g("quickAccessRemoved"), "not_found", 404);
			} else await N(e, i, "", 0), Xr(/* @__PURE__ */ new Set([n.path]));
		} catch (r) {
			if (r instanceof S && r.code === "not_found") {
				try {
					await wr(e, t, n, n === "favorite" ? { favorite: !1 } : { pinned: !1 });
				} catch (e) {
					M(e);
					return;
				}
				jt(g(n === "favorite" ? "favoriteMissing" : "quickAccessRemoved"));
			} else M(r);
		}
	}, ma = async (e) => {
		try {
			await wr(e.resource, e.path, "quick_access", { pinned: !1 });
		} catch (e) {
			M(e);
		}
	}, ha = async (e) => {
		try {
			await wr(b, e, "favorite", { favorite: !1 });
		} catch (e) {
			M(e);
		}
	}, ga = () => {
		if (yt.length === 0) return;
		let e = yt.slice(0, -1), t = yt[yt.length - 1] ?? null;
		bt(e), N(b, w, Pe, Math.max(0, dt - xt), ot, lt, Ie, t);
	}, _a = () => {
		_t !== null && (bt((e) => [...e, ht]), N(b, w, Pe, dt + xt, ot, lt, Ie, _t));
	}, va = () => {
		let e = Number(Ct);
		if (!Number.isFinite(e) || e <= 0) {
			wt(String(xt));
			return;
		}
		let t = ve(e);
		wt(String(t)), t !== xt && (Tt.current = t, St(t), localStorage.setItem("sofinder.pageSize.v1", String(t)), bt([]), N(b, w, Pe, 0, ot, lt, Ie, null));
	}, ya = (e, t) => {
		let n = t && ot === e && lt === "asc" ? "desc" : "asc";
		ct(e), ut(n), bt([]), N(b, w, Pe, 0, e, n, Ie, null);
	}, ba = () => {
		let e = lt === "asc" ? "desc" : "asc";
		ut(e), bt([]), N(b, w, Pe, 0, ot, e, Ie, null);
	}, xa = [
		"name",
		...Jt.size ? ["size"] : [],
		...Jt.type ? ["type"] : [],
		...Jt.modified ? ["modified"] : []
	], Sa = `${xa.map((e) => `${Xt[e]}px`).join(" ")} minmax(0, 1fr)`, Ca = (e) => g(e === "modified" ? "modified" : e), wa = (e) => e === "name" ? "" : `sf-list-${e}`, Ta = (e, t, n = "", i = !1) => {
		let a = ot === e, o = g(lt === "asc" ? "ascending" : "descending");
		return /* @__PURE__ */ (0, T.jsxs)("div", {
			className: `sf-list-heading sf-list-heading-${e}`,
			children: [/* @__PURE__ */ (0, T.jsxs)("button", {
				type: "button",
				className: `${n}${a ? " active" : ""}`,
				disabled: P?.storageCapabilities?.sort === !1,
				"aria-pressed": a,
				"aria-label": a ? `${t}, ${o}` : t,
				onClick: () => ya(e, !0),
				children: [/* @__PURE__ */ (0, T.jsx)("span", { children: t }), a && /* @__PURE__ */ (0, T.jsx)(r, { name: lt === "asc" ? "sort-asc" : "sort-desc" })]
			}), i && /* @__PURE__ */ (0, T.jsx)("div", {
				className: "sf-list-column-resizer",
				role: "separator",
				tabIndex: 0,
				"aria-label": `${g("resizeListColumn")}: ${t}`,
				title: g("autoFitListColumn"),
				"aria-orientation": "vertical",
				"aria-valuemin": ge[e].min,
				"aria-valuemax": ge[e].max,
				"aria-valuenow": Xt[e],
				onPointerDown: (t) => Ki(e, t),
				onPointerMove: qi,
				onPointerUp: Ji,
				onPointerCancel: Ji,
				onKeyDown: (t) => Yi(e, t),
				onDoubleClick: (t) => {
					t.preventDefault(), t.stopPropagation(), Xi(e);
				}
			})]
		}, e);
	}, Ea = (e) => {
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
		return t[e] ? g(t[e]) : e;
	};
	return /* @__PURE__ */ (0, T.jsxs)("main", {
		className: `sf-app sf-mode-${l}${z ? "" : " sf-no-sidebar"}${ua ? "" : " sf-no-details"}${(l === "manager" || ta) && F.length > 0 ? " sf-has-selection-actions" : ""}`,
		onKeyDown: Qi,
		onDragOver: (e) => e.preventDefault(),
		onDrop: (e) => {
			e.preventDefault(), k === null && e.dataTransfer.files.length && Fr(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ (0, T.jsxs)("div", {
				className: `sf-commandbar ${na ? "sf-has-brand" : "sf-no-brand"}`,
				children: [
					na ? /* @__PURE__ */ (0, T.jsxs)("div", {
						className: "sf-brand",
						title: "SoFinder",
						children: [/* @__PURE__ */ (0, T.jsx)("span", {
							className: "sf-brand-mark",
							"aria-hidden": "true",
							children: "S"
						}), e.uiDefaults.header === !0 ? /* @__PURE__ */ (0, T.jsx)("strong", { children: "SoFinder" }) : /* @__PURE__ */ (0, T.jsx)("span", {
							className: "sf-sr-only",
							children: "SoFinder"
						})]
					}) : /* @__PURE__ */ (0, T.jsxs)("nav", {
						className: "sf-breadcrumb sf-command-breadcrumb",
						"aria-label": "Breadcrumb",
						children: [/* @__PURE__ */ (0, T.jsx)("button", {
							onClick: () => da(b, ""),
							children: g("home")
						}), k === "favorites" ? /* @__PURE__ */ (0, T.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, T.jsx)("strong", { children: g("favorites") })] }) : Ur.map((e, t) => /* @__PURE__ */ (0, T.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, T.jsx)("button", {
							onClick: () => da(b, Ur.slice(0, t + 1).join("/")),
							children: e
						})] }, `${e}-${t}`))]
					}),
					e.uiDefaults.search !== !1 && /* @__PURE__ */ (0, T.jsxs)("div", {
						className: "sf-search",
						children: [
							/* @__PURE__ */ (0, T.jsx)(r, { name: "search" }),
							/* @__PURE__ */ (0, T.jsxs)("select", {
								value: Ie,
								disabled: k !== null,
								onChange: (e) => {
									let t = e.target.value;
									ze(t), ft(0);
								},
								"aria-label": g("searchScope"),
								children: [/* @__PURE__ */ (0, T.jsx)("option", {
									value: "name",
									disabled: P?.storageCapabilities?.search === !1,
									children: g("name")
								}), /* @__PURE__ */ (0, T.jsx)("option", {
									value: "tags",
									children: g("tags")
								})]
							}),
							/* @__PURE__ */ (0, T.jsx)("input", {
								disabled: k === null && Ie === "name" && P?.storageCapabilities?.search === !1,
								value: Pe,
								onChange: (e) => Fe(e.target.value),
								placeholder: g(k === "favorites" ? "searchFavorites" : Ie === "tags" ? "searchTags" : "search"),
								"aria-label": g(k === "favorites" ? "searchFavorites" : Ie === "tags" ? "searchTags" : "search")
							})
						]
					}),
					/* @__PURE__ */ (0, T.jsxs)("div", {
						className: "sf-command-actions",
						children: [e.uiDefaults.viewSwitcher !== !1 && /* @__PURE__ */ (0, T.jsxs)("div", {
							className: "sf-view-toggle",
							role: "group",
							"aria-label": `${g("grid")} / ${g("list")}`,
							children: [/* @__PURE__ */ (0, T.jsx)("button", {
								className: Et === "grid" ? "active" : "",
								disabled: k !== null,
								onClick: () => Ii("grid"),
								title: g("grid"),
								"aria-label": g("grid"),
								children: /* @__PURE__ */ (0, T.jsx)(r, { name: "grid" })
							}), /* @__PURE__ */ (0, T.jsx)("button", {
								className: Et === "list" ? "active" : "",
								disabled: k !== null,
								onClick: () => Ii("list"),
								title: g("list"),
								"aria-label": g("list"),
								children: /* @__PURE__ */ (0, T.jsx)(r, { name: "list" })
							})]
						}), /* @__PURE__ */ (0, T.jsxs)("div", {
							ref: hr,
							className: "sf-utility",
							children: [/* @__PURE__ */ (0, T.jsx)("button", {
								ref: gr,
								className: "sf-icon-only",
								onClick: () => un((e) => !e),
								"aria-expanded": ln,
								title: g("moreActions"),
								"aria-label": g("moreActions"),
								children: /* @__PURE__ */ (0, T.jsx)(r, { name: "more" })
							}), ln && /* @__PURE__ */ (0, T.jsxs)("div", {
								className: "sf-utility-menu",
								role: "menu",
								children: [
									e.uiDefaults.languageSwitcher !== !1 && /* @__PURE__ */ (0, T.jsxs)("label", { children: [/* @__PURE__ */ (0, T.jsx)("span", { children: g("language") }), /* @__PURE__ */ (0, T.jsxs)("select", {
										value: d,
										onChange: (e) => f(e.target.value),
										"aria-label": g("language"),
										children: [
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "zh-cn",
												children: "简中"
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "zh-tw",
												children: "繁中"
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "en",
												children: "EN"
											})
										]
									})] }),
									/* @__PURE__ */ (0, T.jsxs)("label", { children: [/* @__PURE__ */ (0, T.jsx)("span", { children: g("sort") }), /* @__PURE__ */ (0, T.jsxs)("select", {
										value: ot,
										disabled: k !== null || P?.storageCapabilities?.sort === !1,
										"aria-label": g("sort"),
										onChange: (e) => ya(e.target.value, !1),
										children: [
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "name",
												children: g("name")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "size",
												children: g("size")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "type",
												children: g("type")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "modified",
												children: g("modified")
											})
										]
									})] }),
									/* @__PURE__ */ (0, T.jsxs)("label", { children: [/* @__PURE__ */ (0, T.jsx)("span", { children: g("groupBy") }), /* @__PURE__ */ (0, T.jsxs)("select", {
										value: Kr,
										disabled: k !== null,
										"aria-label": g("groupBy"),
										onChange: (e) => {
											let t = e.target.value;
											mn(t), localStorage.setItem("sofinder.groupMode.v1", t);
										},
										children: [
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "none",
												children: g("groupNone")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "name",
												children: g("name")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "type",
												children: g("type")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "size",
												children: g("size")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "modified",
												children: g("modified")
											}),
											A.tags && /* @__PURE__ */ (0, T.jsx)("option", {
												value: "tags",
												children: g("tags")
											})
										]
									})] }),
									/* @__PURE__ */ (0, T.jsxs)("label", { children: [/* @__PURE__ */ (0, T.jsx)("span", { children: g("filterType") }), /* @__PURE__ */ (0, T.jsxs)("select", {
										value: hn,
										disabled: k !== null,
										"aria-label": g("filterType"),
										onChange: (e) => {
											let t = e.target.value;
											gn(t), localStorage.setItem("sofinder.typeFilter.v1", t), Si();
										},
										children: [
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "all",
												children: g("allTypes")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "folder",
												children: g("folder")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "image",
												children: g("images")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "document",
												children: g("documents")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "audio",
												children: g("audio")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "video",
												children: g("video")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "archive",
												children: g("archives")
											}),
											/* @__PURE__ */ (0, T.jsx)("option", {
												value: "other",
												children: g("other")
											})
										]
									})] }),
									/* @__PURE__ */ (0, T.jsx)("button", {
										role: "menuitem",
										className: `sf-sort-direction ${lt}`,
										disabled: k !== null || P?.storageCapabilities?.sort === !1,
										"aria-label": `${g("direction")}: ${g(lt === "asc" ? "ascending" : "descending")}`,
										onClick: ba,
										children: B(lt === "asc" ? "sort-asc" : "sort-desc", g(lt === "asc" ? "ascending" : "descending"))
									}),
									/* @__PURE__ */ (0, T.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											un(!1), k === "favorites" ? Cr(b, !0).catch(M) : N();
										},
										children: B("refresh", g("refresh"))
									}),
									/* @__PURE__ */ (0, T.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											un(!1), on(!0);
										},
										children: B("settings", g("settings"))
									}),
									(l === "manager" || ta) && e.securityStatusAvailable !== !1 && /* @__PURE__ */ (0, T.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											un(!1), cn(!0);
										},
										children: B("security", g("securityStatus"))
									}),
									(l === "manager" || ta) && A.trash && ra && /* @__PURE__ */ (0, T.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											un(!1), Ln(!0);
										},
										children: B("trash", g("trash"))
									}),
									(l === "manager" || ta) && A.favorites && /* @__PURE__ */ (0, T.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											un(!1), fa();
										},
										children: B("favorite", g("favorites"))
									}),
									(l === "manager" || ta) && ui.filter((e) => e.slot === "utility" && Me(e, null)).map((e) => /* @__PURE__ */ (0, T.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											un(!1), fi(e, null);
										},
										children: ke(e, d)
									}, `${e.plugin}:${e.id}`))
								]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, T.jsxs)("div", {
				className: "sf-toolbar",
				role: "toolbar",
				"aria-label": g("fileActions"),
				title: g("keyboardHelp"),
				children: [
					/* @__PURE__ */ (0, T.jsx)("button", {
						onClick: mi,
						disabled: k !== null || P?.readOnly || Mt.create_folder === !1 || P !== void 0 && kr >= P.maxFolderDepth,
						title: P && kr >= P.maxFolderDepth ? g("folderDepthReached") : void 0,
						children: B("add-folder", g("newFolder"))
					}),
					/* @__PURE__ */ (0, T.jsx)("button", {
						className: `primary sf-upload-trigger${ea ? " is-active" : ""}`,
						"aria-busy": ea,
						onClick: () => Nr.current?.click(),
						disabled: k !== null || P?.readOnly || Mt.upload === !1,
						children: B("upload", `${g("upload")}${ea ? ` (${Ar.filter((e) => e.status === "queued" || e.status === "uploading").length})` : ""}`)
					}),
					/* @__PURE__ */ (0, T.jsx)("input", {
						ref: Nr,
						type: "file",
						multiple: !0,
						hidden: !0,
						onChange: (e) => {
							e.target.files && Fr(e.target.files), e.target.value = "";
						}
					}),
					u.folderUpload !== !1 && /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [/* @__PURE__ */ (0, T.jsx)("button", {
						onClick: () => Pr.current?.click(),
						disabled: k !== null || P?.readOnly || Mt.upload === !1,
						children: B("add-folder", g("uploadFolder"))
					}), /* @__PURE__ */ (0, T.jsx)("input", {
						ref: (e) => {
							Pr.current = e, e?.setAttribute("webkitdirectory", "");
						},
						type: "file",
						multiple: !0,
						hidden: !0,
						onChange: (e) => {
							e.target.files && Lr(e.target.files), e.target.value = "";
						}
					})] }),
					(l === "manager" || ta) && /* @__PURE__ */ (0, T.jsxs)("div", {
						ref: _r,
						className: "sf-utility sf-selection-menu",
						children: [/* @__PURE__ */ (0, T.jsx)("button", {
							onClick: () => fn((e) => !e),
							"aria-expanded": dn,
							children: B("select", g("selection"))
						}), dn && /* @__PURE__ */ (0, T.jsxs)("div", {
							className: "sf-utility-menu",
							role: "menu",
							children: [
								/* @__PURE__ */ (0, T.jsx)("button", {
									role: "menuitem",
									disabled: Jr.length === 0,
									onClick: () => {
										xi(), fn(!1);
									},
									children: g("selectAll")
								}),
								/* @__PURE__ */ (0, T.jsx)("button", {
									role: "menuitem",
									disabled: Yr.size === 0,
									onClick: () => {
										Si(), fn(!1);
									},
									children: g("clearSelection")
								}),
								/* @__PURE__ */ (0, T.jsx)("button", {
									role: "menuitem",
									disabled: Jr.length === 0,
									onClick: () => {
										Ci(), fn(!1);
									},
									children: g("invertSelection")
								})
							]
						})]
					}),
					(l === "manager" || ta) && F.length > 0 && /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [/* @__PURE__ */ (0, T.jsx)("span", { className: "sf-separator" }), /* @__PURE__ */ (0, T.jsxs)("div", {
						className: "sf-context-actions",
						children: [
							/* @__PURE__ */ (0, T.jsx)("button", {
								onClick: hi,
								disabled: F.length !== 1 || !si("rename") || P?.readOnly,
								children: B("rename", g("rename"))
							}),
							u.batchRename !== !1 && Gt.batchRename && /* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => Tn(!0),
								disabled: F.length < 2 || !si("rename") || P?.readOnly,
								children: B("rename", g("batchRename"))
							}),
							/* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => void yi("copy", w),
								disabled: !si("copy") || P?.readOnly,
								children: B("copy", g("copy"))
							}),
							/* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => void yi("move", w),
								disabled: !si("move") || P?.readOnly,
								children: B("move", g("move"))
							}),
							A.archive && /* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => void Mi(),
								children: B("archive", g("downloadZip"))
							}),
							A.favorites && /* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => void Ni(),
								disabled: !I,
								children: B("favorite", g("favorite"))
							}),
							oa && A.sidebarQuickAccess && li(I) && /* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => void Pi(),
								children: B("add-folder", I && Rt.quickAccess.includes(I.path) ? g("unpinQuickAccess") : g("pinQuickAccess"))
							}),
							A.tags && /* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => void Fi(),
								disabled: !I,
								children: B("tags", g("tags"))
							}),
							/* @__PURE__ */ (0, T.jsx)("button", {
								className: "danger",
								onClick: gi,
								disabled: !si("delete") || P?.readOnly,
								children: B("delete", `${g("remove")}${F.length > 1 ? ` (${F.length})` : ""}`)
							}),
							u.imageEditing !== !1 && Gt.rotate && /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [/* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => void wi(270),
								disabled: !ni(I) || P?.readOnly,
								children: B("rotate-left", g("rotateLeft"))
							}), /* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => void wi(90),
								disabled: !ni(I) || P?.readOnly,
								children: B("rotate-right", g("rotateRight"))
							})] }),
							u.imageEditing !== !1 && Gt.resize && /* @__PURE__ */ (0, T.jsx)("button", {
								onClick: Ti,
								disabled: !ni(I) || P?.readOnly,
								children: B("resize", g("resize"))
							}),
							u.imageEditing !== !1 && Gt.crop && /* @__PURE__ */ (0, T.jsx)("button", {
								onClick: Ei,
								disabled: !ni(I) || !Ut || P?.readOnly,
								children: B("crop", g("crop"))
							}),
							u.imageProcessing !== !1 && Gt.process && /* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => kn(!0),
								disabled: ri.length === 0 || ri.length !== F.length || P?.readOnly,
								children: B("resize", g("imageProcess"))
							}),
							u.imageEditing !== !1 && Gt.presets && /* @__PURE__ */ (0, T.jsxs)("label", {
								className: "sf-sort",
								children: [g("preset"), /* @__PURE__ */ (0, T.jsxs)("select", {
									value: "",
									disabled: !ni(I) || P?.readOnly || Object.keys(Zn).length === 0,
									onChange: (e) => {
										let t = e.target.value;
										e.target.value = "", t && Ri(t);
									},
									children: [/* @__PURE__ */ (0, T.jsx)("option", {
										value: "",
										children: "—"
									}), Object.entries(Zn).map(([e, t]) => /* @__PURE__ */ (0, T.jsxs)("option", {
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
							I && ui.filter((e) => e.slot === "toolbar" && Me(e, I)).map((e) => /* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => fi(e, I),
								children: ke(e, d)
							}, `${e.plugin}:${e.id}`))
						]
					})] })
				]
			}),
			At && /* @__PURE__ */ (0, T.jsxs)("div", {
				className: "sf-notice",
				role: "alert",
				children: [At, /* @__PURE__ */ (0, T.jsx)("button", {
					onClick: () => jt(""),
					"aria-label": g("close"),
					children: /* @__PURE__ */ (0, T.jsx)(r, { name: "close" })
				})]
			}),
			Ar.length > 0 && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, T.jsx)(nt, {
					tasks: Ar,
					collapsed: jr,
					labels: {
						title: g("uploadQueue"),
						expand: g("expand"),
						collapse: g("collapse"),
						cancel: g("cancel"),
						cancelAll: g("cancelAll"),
						clearFinished: g("clearFinished"),
						retry: g("retryUpload"),
						remove: g("removeUploadTask"),
						status: (e) => g(e)
					},
					onToggle: () => Mr((e) => !e),
					onCancel: Rr,
					onCancelAll: zr,
					onClearFinished: Hr,
					onRetry: Vr,
					onRemove: Br
				})
			}),
			/* @__PURE__ */ (0, T.jsxs)("div", {
				className: "sf-layout",
				style: {
					"--sf-sidebar-width": `${ar}px`,
					"--sf-details-width": `${sr}px`
				},
				children: [
					z && /* @__PURE__ */ (0, T.jsxs)("aside", {
						className: "sf-sidebar",
						"aria-label": "Resources",
						children: [
							v.map((e) => /* @__PURE__ */ (0, T.jsxs)("button", {
								className: e.name === b && k === null ? "active" : "",
								onClick: () => {
									Ht(null), x(e.name), Fe(""), ze("name"), e.storageCapabilities?.sort === !1 ? (ct("name"), ut("asc"), bt([]), N(e.name, "", "", 0, "name", "asc", "name", null)) : da(e.name, "", "");
								},
								children: [/* @__PURE__ */ (0, T.jsx)("span", {
									className: "sf-resource-icon",
									children: /* @__PURE__ */ (0, T.jsx)(s, { kind: e.name.toLowerCase().includes("image") ? "image" : "folder" })
								}), e.name.toLowerCase().includes("image") ? g("images") : e.name.toLowerCase() === "files" ? g("files") : e.name]
							}, e.name)),
							ia && b && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
								fallback: null,
								children: /* @__PURE__ */ (0, T.jsx)(Ye, {
									api: a,
									resource: b,
									currentPath: ye,
									rootLabel: g("home"),
									onNavigate: (e) => da(b, e, "")
								})
							}),
							(A.favorites && A.sidebarFavorites || oa && A.sidebarQuickAccess && sa) && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
								fallback: null,
								children: /* @__PURE__ */ (0, T.jsx)($e, {
									favorites: Rt.favorites,
									quickAccessByResource: Bt,
									resources: v,
									currentResource: b,
									quickAccessScope: nn,
									showFavorites: A.favorites && A.sidebarFavorites,
									showQuickAccess: oa && A.sidebarQuickAccess && sa,
									favoritesActive: k === "favorites",
									labels: {
										favorites: g("favorites"),
										favoritesEmpty: g("favoritesEmpty"),
										quickAccess: g("quickAccess"),
										quickAccessEmpty: g("quickAccessEmpty"),
										home: g("home"),
										more: g("moreItems"),
										missing: g("quickAccessMissing")
									},
									onOpenFavorites: fa,
									onOpenFavorite: (e) => void pa(b, e, "favorite"),
									onOpenQuickAccess: (e) => void pa(e.resource, e.path, "quick_access", e.exists),
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
												resource: b,
												path: e
											},
											favorite: !0
										});
									}
								})
							}),
							P && (P.readOnly || P.quotaBytes > 0) && /* @__PURE__ */ (0, T.jsxs)("div", {
								className: "sf-resource-status",
								children: [P.readOnly && /* @__PURE__ */ (0, T.jsx)("strong", { children: g("readOnly") }), P.quotaBytes > 0 && /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [/* @__PURE__ */ (0, T.jsxs)("span", { children: [
									g("storageUsage"),
									": ",
									c(P.usedBytes),
									" / ",
									c(P.quotaBytes)
								] }), /* @__PURE__ */ (0, T.jsx)("progress", {
									max: P.quotaBytes,
									value: Math.min(P.usedBytes, P.quotaBytes)
								})] })]
							}),
							ca("sidebar")
						]
					}),
					z && /* @__PURE__ */ (0, T.jsx)("div", {
						className: "sf-column-resizer left",
						role: "separator",
						tabIndex: 0,
						"aria-label": g("resizeLeftPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": he.left.min,
						"aria-valuemax": he.left.max,
						"aria-valuenow": ar,
						onPointerDown: (e) => Vi("left", e),
						onPointerMove: Hi,
						onPointerUp: Ui,
						onPointerCancel: Ui,
						onKeyDown: (e) => Wi("left", e),
						onDoubleClick: () => Bi("left", he.left.initial, !0)
					}),
					/* @__PURE__ */ (0, T.jsxs)("section", {
						className: "sf-content",
						children: [
							ca("mobile"),
							na && /* @__PURE__ */ (0, T.jsxs)("nav", {
								className: "sf-breadcrumb",
								"aria-label": "Breadcrumb",
								children: [/* @__PURE__ */ (0, T.jsx)("button", {
									onClick: () => da(b, ""),
									children: g("home")
								}), k === "favorites" ? /* @__PURE__ */ (0, T.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, T.jsx)("strong", { children: g("favorites") })] }) : Ur.map((e, t) => /* @__PURE__ */ (0, T.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, T.jsx)("button", {
									onClick: () => da(b, Ur.slice(0, t + 1).join("/")),
									children: e
								})] }, `${e}-${t}`))]
							}),
							k === "favorites" ? /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
								fallback: /* @__PURE__ */ (0, T.jsx)("div", {
									className: "sf-state",
									children: g("loading")
								}),
								children: /* @__PURE__ */ (0, T.jsx)(Qe, {
									paths: Rt.favorites,
									search: Pe,
									locale: d,
									labels: {
										title: g("favorites"),
										hint: g("favoritesPageHint"),
										empty: g("favoritesEmpty"),
										noMatch: g("filterEmpty"),
										home: g("home"),
										open: g("open"),
										remove: g("removeFavorite")
									},
									onOpen: (e) => void pa(b, e, "favorite"),
									onRemove: (e) => void ha(e)
								})
							}) : Ot ? /* @__PURE__ */ (0, T.jsx)("div", {
								className: "sf-state",
								children: g("loading")
							}) : Jr.length === 0 ? /* @__PURE__ */ (0, T.jsx)("div", {
								className: "sf-state",
								children: De.length === 0 ? g("empty") : g("filterEmpty")
							}) : /* @__PURE__ */ (0, T.jsxs)("div", {
								ref: mr,
								className: `sf-entries ${Et} sf-grid-size-${Qt.grid} sf-list-size-${Qt.list}${Et === "list" && Jt.size ? " sf-list-has-size" : ""}`,
								style: Et === "list" ? { "--sf-list-columns": Sa } : void 0,
								role: "listbox",
								"aria-multiselectable": l === "manager",
								"aria-label": g("files"),
								children: [Et === "list" && /* @__PURE__ */ (0, T.jsx)("div", {
									className: "sf-list-head",
									children: xa.map((e) => Ta(e, Ca(e), wa(e), !0))
								}), qr.flatMap((e) => [...Kr === "none" ? [] : [/* @__PURE__ */ (0, T.jsxs)("div", {
									className: "sf-entry-group",
									children: [/* @__PURE__ */ (0, T.jsx)("strong", { children: Ea(e.label) }), /* @__PURE__ */ (0, T.jsx)("span", { children: e.entries.length })]
								}, `group-${e.key}`)], ...e.entries.map((e) => {
									let t = Jr.findIndex((t) => t.path === e.path), n = !e.directory && ti(e);
									return /* @__PURE__ */ (0, T.jsxs)("button", {
										"data-entry-index": t,
										role: "option",
										"aria-selected": Yr.has(e.path),
										"aria-label": `${e.name}, ${e.directory ? g("folder") : c(e.size)}`,
										className: `sf-entry ${Yr.has(e.path) ? "selected" : ""}`,
										onClick: (t) => $r(e, t),
										onDoubleClick: () => pi(e),
										onContextMenu: (t) => {
											t.preventDefault(), Xr(/* @__PURE__ */ new Set([e.path])), Qr(e.path), Vn({
												x: t.clientX,
												y: t.clientY,
												entry: e
											});
										},
										onPointerDown: (t) => {
											t.pointerType === "touch" && (dr.current = window.setTimeout(() => {
												Xr(/* @__PURE__ */ new Set([e.path])), Qr(e.path), Vn({
													x: t.clientX,
													y: t.clientY,
													entry: e
												});
											}, 550));
										},
										onPointerUp: () => {
											dr.current !== null && window.clearTimeout(dr.current), dr.current = null;
										},
										onPointerCancel: () => {
											dr.current !== null && window.clearTimeout(dr.current), dr.current = null;
										},
										onDragOver: (t) => {
											e.directory && t.preventDefault();
										},
										onDrop: (t) => {
											e.directory && t.dataTransfer.files.length && (t.preventDefault(), Ir(e.path, t.dataTransfer.files));
										},
										children: [
											/* @__PURE__ */ (0, T.jsx)("span", {
												className: "sf-entry-icon",
												children: n ? /* @__PURE__ */ (0, T.jsx)(o, {
													src: a.thumbnailUrl(b, e),
													alt: "",
													lazy: !0
												}) : /* @__PURE__ */ (0, T.jsx)(s, {
													name: e.name,
													mimeType: e.mimeType,
													directory: e.directory
												})
											}),
											/* @__PURE__ */ (0, T.jsxs)("span", {
												className: "sf-entry-name",
												title: e.name,
												children: [A.favorites && Rt.favorites.includes(e.path) && /* @__PURE__ */ (0, T.jsxs)("span", {
													"aria-label": g("favorite"),
													children: [/* @__PURE__ */ (0, T.jsx)(r, { name: "favorite" }), " "]
												}), e.name]
											}),
											Jt.size && /* @__PURE__ */ (0, T.jsx)("span", {
												className: "sf-entry-size",
												children: e.directory ? "—" : c(e.size)
											}),
											Jt.type && /* @__PURE__ */ (0, T.jsx)("span", {
												className: "sf-entry-type",
												children: e.directory ? g("folder") : e.mimeType || g("file")
											}),
											Jt.modified && /* @__PURE__ */ (0, T.jsx)("time", {
												className: "sf-entry-modified",
												dateTime: (/* @__PURE__ */ new Date(e.modifiedAt * 1e3)).toISOString(),
												children: _.format(e.modifiedAt * 1e3)
											})
										]
									}, e.path);
								})])]
							}),
							k === null && /* @__PURE__ */ (0, T.jsxs)("nav", {
								className: "sf-pagination",
								"aria-label": g("pagination"),
								children: [
									/* @__PURE__ */ (0, T.jsxs)("div", {
										className: "sf-page-navigation",
										children: [
											/* @__PURE__ */ (0, T.jsxs)("button", {
												disabled: yt.length === 0,
												onClick: ga,
												children: [
													/* @__PURE__ */ (0, T.jsx)(r, { name: "chevron-left" }),
													" ",
													g("previous")
												]
											}),
											/* @__PURE__ */ (0, T.jsxs)("span", { children: [
												g("page"),
												" ",
												yt.length + 1,
												pt === null ? "" : ` / ${Math.max(1, Math.ceil(pt / xt))}`
											] }),
											/* @__PURE__ */ (0, T.jsxs)("button", {
												disabled: _t === null,
												onClick: _a,
												children: [
													g("next"),
													" ",
													/* @__PURE__ */ (0, T.jsx)(r, { name: "chevron-right" })
												]
											})
										]
									}),
									/* @__PURE__ */ (0, T.jsxs)("label", {
										className: "sf-page-size",
										children: [/* @__PURE__ */ (0, T.jsxs)("span", { children: [
											g("itemsPerPage"),
											" (",
											_e.min,
											"–",
											_e.max,
											")"
										] }), /* @__PURE__ */ (0, T.jsx)("input", {
											type: "number",
											min: _e.min,
											max: _e.max,
											step: "10",
											list: n,
											value: Ct,
											onChange: (e) => wt(e.target.value),
											onBlur: va,
											onKeyDown: (e) => {
												e.key === "Enter" && e.currentTarget.blur();
											}
										})]
									}),
									/* @__PURE__ */ (0, T.jsx)("datalist", {
										id: n,
										children: [
											20,
											50,
											100,
											200,
											500
										].map((e) => /* @__PURE__ */ (0, T.jsx)("option", { value: e }, e))
									})
								]
							})
						]
					}),
					ua && /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [/* @__PURE__ */ (0, T.jsx)("div", {
						className: "sf-column-resizer right",
						role: "separator",
						tabIndex: 0,
						"aria-label": g("resizeRightPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": he.right.min,
						"aria-valuemax": he.right.max,
						"aria-valuenow": sr,
						onPointerDown: (e) => Vi("right", e),
						onPointerMove: Hi,
						onPointerUp: Ui,
						onPointerCancel: Ui,
						onKeyDown: (e) => Wi("right", e),
						onDoubleClick: () => Bi("right", he.right.initial, !0)
					}), /* @__PURE__ */ (0, T.jsxs)("aside", {
						className: "sf-right-panel",
						"aria-label": g("rightSidebar"),
						children: [aa && b && /* @__PURE__ */ (0, T.jsxs)("section", {
							className: "sf-folder-navigation-right",
							children: [/* @__PURE__ */ (0, T.jsx)("h2", { children: g("folderNavigation") }), /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
								fallback: /* @__PURE__ */ (0, T.jsx)("div", {
									className: "sf-state",
									children: g("loading")
								}),
								children: /* @__PURE__ */ (0, T.jsx)(Ye, {
									api: a,
									resource: b,
									currentPath: ye,
									rootLabel: g("home"),
									onNavigate: (e) => da(b, e, "")
								})
							})]
						}), la && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
							fallback: /* @__PURE__ */ (0, T.jsx)("div", {
								className: "sf-state",
								children: g("loading")
							}),
							children: /* @__PURE__ */ (0, T.jsx)(Xe, {
								api: a,
								resource: b,
								selectedEntries: F,
								selected: I,
								imageInfo: Ut,
								metadata: Rt,
								showTags: A.tags,
								previewImage: ti(I),
								selectMode: !1,
								selectAllowed: ii(I),
								labels: {
									details: g("details"),
									selected: g("selectedCount"),
									type: g("type"),
									folder: g("folder"),
									file: g("file"),
									size: g("size"),
									dimensions: g("dimensions"),
									modified: g("modified"),
									location: g("location"),
									select: g("select"),
									download: g("download"),
									share: g("share"),
									unsupportedWebImage: g("webImageUnsupported")
								},
								formatDate: (e) => _.format(e * 1e3),
								onChoose: bi,
								onShare: oi,
								pluginActions: I && ui.filter((e) => e.slot === "details" && Me(e, I)).map((e) => /* @__PURE__ */ (0, T.jsx)("button", {
									onClick: () => fi(e, I),
									children: ke(e, d)
								}, `${e.plugin}:${e.id}`))
							})
						})]
					})] })
				]
			}),
			l === "picker" && I && !I.directory && /* @__PURE__ */ (0, T.jsxs)("div", {
				className: "sf-picker-bar",
				children: [
					/* @__PURE__ */ (0, T.jsxs)("div", { children: [/* @__PURE__ */ (0, T.jsx)("strong", { children: I.name }), /* @__PURE__ */ (0, T.jsx)("small", { children: c(I.size) })] }),
					!ii(I) && /* @__PURE__ */ (0, T.jsx)("span", {
						role: "status",
						children: g("webImageUnsupported")
					}),
					/* @__PURE__ */ (0, T.jsx)("button", {
						className: "primary",
						disabled: !ii(I),
						onClick: () => void bi(),
						children: g("select")
					})
				]
			}),
			an && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
				fallback: /* @__PURE__ */ (0, T.jsx)("div", {
					className: "sf-state",
					children: g("loading")
				}),
				children: /* @__PURE__ */ (0, T.jsx)(We, {
					resource: P,
					tools: Gt,
					features: A,
					columns: Jt,
					viewSizes: Qt,
					folderTreePlacement: en,
					quickAccessScope: nn,
					availability: u,
					scale: _n,
					uploadConflictStrategy: yn,
					translate: g,
					onToolChange: Di,
					onFeatureChange: Oi,
					onColumnChange: ki,
					onViewSizeChange: Ai,
					onFolderTreePlacementChange: ji,
					onQuickAccessScopeChange: (e) => {
						rn(e), localStorage.setItem("sofinder.quickAccess.scope.v1", e);
					},
					onScaleChange: vn,
					onUploadConflictStrategyChange: bn,
					onReset: Zi,
					onClose: () => on(!1)
				})
			}),
			sn && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
				fallback: /* @__PURE__ */ (0, T.jsx)("div", {
					className: "sf-state",
					children: g("loading")
				}),
				children: /* @__PURE__ */ (0, T.jsx)(He, {
					api: a,
					formatDate: (e) => _.format(e * 1e3),
					labels: {
						title: g("securityStatus"),
						close: g("close"),
						loading: g("loading"),
						enabled: g("malwareScanningEnabled"),
						disabled: g("malwareScanningDisabled"),
						provider: g("scanProvider"),
						service: g("serviceStatus"),
						scans: g("scanHistory"),
						passed: g("scanPassed"),
						quarantined: g("scanQuarantined"),
						failed: g("scanFailed"),
						pending: g("scanPending"),
						recent: g("recentScans"),
						none: g("noScans"),
						document: g("documentPreviewStatus"),
						mode: g("previewMode"),
						converter: g("previewConverter"),
						version: g("previewVersion"),
						cache: g("previewCache"),
						writable: g("previewCacheWritable"),
						readOnly: g("previewCacheReadOnly"),
						jobs: g("previewJobs"),
						lastSuccess: g("previewLastSuccess"),
						never: g("previewNever"),
						running: g("previewRunning"),
						ready: g("previewReady")
					},
					onClose: () => cn(!1)
				})
			}),
			Sn && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
				fallback: /* @__PURE__ */ (0, T.jsx)("div", {
					className: "sf-state",
					children: g("loading")
				}),
				children: /* @__PURE__ */ (0, T.jsx)(Ge, {
					state: Sn,
					unsafe: $i,
					translate: g,
					onBrowse: (e, t) => void yi(e, t),
					onConfirm: (e, t) => void vi(e, t),
					onClose: () => Cn(null)
				})
			}),
			wn && u.batchRename !== !1 && Gt.batchRename && P && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
				fallback: /* @__PURE__ */ (0, T.jsx)("div", {
					className: "sf-state",
					children: g("loading")
				}),
				children: /* @__PURE__ */ (0, T.jsx)(Ke, {
					entries: F,
					maximum: P.maxFileNameLength,
					labels: {
						title: g("batchRename"),
						pattern: g("renamePattern"),
						hint: g("renamePatternHint"),
						oldName: g("oldName"),
						newName: g("newName"),
						invalid: g("invalidEntryName"),
						duplicate: g("duplicateRename"),
						cancel: g("cancel"),
						save: g("rename"),
						close: g("close")
					},
					onClose: () => Tn(!1),
					onSave: (e) => void _i(e)
				})
			}),
			An && /* @__PURE__ */ (0, T.jsx)(re, {
				title: An.title,
				label: An.label,
				initialValue: An.initial,
				maximum: An.maximum,
				extension: An.extension,
				invalidNameLabel: g("invalidEntryName"),
				confirmLabel: g("confirm"),
				cancelLabel: g("cancel"),
				closeLabel: g("close"),
				onConfirm: (e) => void L(e),
				onClose: () => jn(null)
			}),
			Mn && /* @__PURE__ */ (0, T.jsx)(ie, {
				...Mn,
				confirmLabel: g("confirm"),
				cancelLabel: g("cancel"),
				closeLabel: g("close"),
				onConfirm: () => Er(!0),
				onClose: () => Er(!1)
			}),
			Pn && /* @__PURE__ */ (0, T.jsx)(ae, {
				fileName: Pn,
				title: g("replaceFile"),
				renameLabel: g("uploadConflictRename"),
				overwriteLabel: g("uploadConflictOverwrite"),
				skipLabel: g("uploadConflictSkip"),
				closeLabel: g("close"),
				onChoose: Or
			}),
			In && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
				fallback: /* @__PURE__ */ (0, T.jsx)("div", {
					className: "sf-state",
					children: g("loading")
				}),
				children: /* @__PURE__ */ (0, T.jsx)(qe, {
					api: a,
					resource: b,
					locale: d,
					labels: {
						title: g("trash"),
						close: g("close"),
						cancel: g("cancel"),
						empty: g("trashEmpty"),
						restore: g("restore"),
						permanentDelete: g("permanentDelete"),
						expires: g("expires"),
						conflict: g("restoreConflict"),
						overwrite: g("restoreOverwrite"),
						autoRename: g("restoreAutoRename"),
						usage: g("trashUsage"),
						items: g("items"),
						previous: g("previous"),
						next: g("next"),
						search: g("searchTrash")
					},
					onClose: () => Ln(!1),
					onChanged: () => void N()
				})
			}),
			Rn && I && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
				fallback: /* @__PURE__ */ (0, T.jsx)("div", {
					className: "sf-state",
					children: g("loading")
				}),
				children: /* @__PURE__ */ (0, T.jsx)(Je, {
					initial: Rt.tags[I.path] || [],
					suggestions: Array.from(new Set(Object.values(Rt.tags).flat())).sort((e, t) => e.localeCompare(t, d)),
					labels: {
						title: g("tags"),
						close: g("close"),
						cancel: g("cancel"),
						save: g("save"),
						input: g("tagInput"),
						hint: g("tagInputHint"),
						maximum: g("tagMaximum")
					},
					onClose: () => zn(!1),
					onSave: (e) => {
						zn(!1), wr(b, I.path, "tags", { tags: e }).catch(M);
					}
				})
			}),
			j && /* @__PURE__ */ (0, T.jsx)(i, {
				title: j.name,
				closeLabel: g("close"),
				maximizable: !0,
				onClose: () => Wn(null),
				className: "sf-file-preview-modal",
				footer: /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [
					/* @__PURE__ */ (0, T.jsx)("a", {
						className: "sf-preview-download",
						href: j.url || a.downloadUrl(b, j.path),
						target: "_blank",
						rel: "noopener noreferrer",
						children: g("download")
					}),
					/* @__PURE__ */ (0, T.jsx)("button", {
						type: "button",
						onClick: () => void oi(j),
						children: g("share")
					}),
					/* @__PURE__ */ (0, T.jsx)("button", {
						className: "primary",
						onClick: () => Wn(null),
						children: g("close")
					})
				] }),
				children: /* @__PURE__ */ (0, T.jsxs)("div", {
					className: "sf-file-preview-body",
					children: [ti(j) ? /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
						fallback: /* @__PURE__ */ (0, T.jsx)("div", {
							className: "sf-state",
							children: g("loading")
						}),
						children: /* @__PURE__ */ (0, T.jsx)(rt, {
							api: a,
							resource: b,
							entry: j,
							labels: {
								actual: g("actualSize"),
								fit: g("fitToWindow"),
								zoom: g("zoomLevel"),
								center: g("centerImage"),
								loading: g("loadingOriginalImage"),
								failed: g("imagePreviewFailed"),
								retry: g("retryImagePreview"),
								warning: g("largeOriginalImageWarning"),
								continue: g("continueOriginalImage"),
								cancel: g("cancel"),
								dimensions: g("dimensions"),
								size: g("size")
							}
						})
					}) : /* @__PURE__ */ (0, T.jsx)("div", {
						className: "sf-file-preview-content",
						children: u.textPreview !== !1 && Gn?.path === j.path ? /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [/* @__PURE__ */ (0, T.jsx)("pre", {
							className: "sf-text-preview",
							children: Gn.content
						}), Gn.truncated && /* @__PURE__ */ (0, T.jsx)("p", {
							className: "sf-warning",
							children: g("previewTruncated")
						})] }) : Ae(j, di)?.plugin === "document-preview" ? /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
							fallback: null,
							children: /* @__PURE__ */ (0, T.jsx)(Ue, {
								api: a,
								resource: b,
								entry: j,
								labels: {
									submitting: g("previewSubmitting"),
									queued: g("previewQueued"),
									converting: g("previewConverting"),
									loading: g("previewLoading"),
									failed: g("previewFailed"),
									retry: g("previewRetry"),
									elapsed: (e) => g("previewElapsed").replace("{seconds}", String(e))
								}
							})
						}) : je(j, di, b) ? /* @__PURE__ */ (0, T.jsx)("iframe", {
							className: "sf-document-preview",
							src: je(j, di, b) || void 0,
							title: j.name
						}) : /* @__PURE__ */ (0, T.jsxs)("div", {
							className: "sf-file-preview-fallback",
							children: [/* @__PURE__ */ (0, T.jsx)(s, { kind: "file" }), /* @__PURE__ */ (0, T.jsx)("p", { children: g("previewUnavailable") })]
						})
					}), /* @__PURE__ */ (0, T.jsxs)("dl", {
						className: "sf-file-preview-meta",
						children: [
							/* @__PURE__ */ (0, T.jsx)("dt", { children: g("type") }),
							/* @__PURE__ */ (0, T.jsx)("dd", { children: j.mimeType || g("file") }),
							/* @__PURE__ */ (0, T.jsx)("dt", { children: g("size") }),
							/* @__PURE__ */ (0, T.jsx)("dd", { children: c(j.size) }),
							/* @__PURE__ */ (0, T.jsx)("dt", { children: g("modified") }),
							/* @__PURE__ */ (0, T.jsx)("dd", { children: /* @__PURE__ */ (0, T.jsx)("time", {
								dateTime: (/* @__PURE__ */ new Date(j.modifiedAt * 1e3)).toISOString(),
								children: _.format(j.modifiedAt * 1e3)
							}) }),
							/* @__PURE__ */ (0, T.jsx)("dt", { children: g("location") }),
							/* @__PURE__ */ (0, T.jsx)("dd", { children: j.path }),
							u.checksum !== !1 && /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [/* @__PURE__ */ (0, T.jsx)("dt", { children: "SHA-256" }), /* @__PURE__ */ (0, T.jsx)("dd", { children: qn?.path === j.path ? /* @__PURE__ */ (0, T.jsx)("code", {
								className: "sf-checksum",
								children: qn.value
							}) : /* @__PURE__ */ (0, T.jsx)("button", {
								onClick: () => void a.checksum(b, j.path).then((e) => Jn({
									path: j.path,
									value: e.checksum
								})).catch(M),
								children: g("calculateChecksum")
							}) })] })
						]
					})]
				})
			}),
			Yn && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
				fallback: /* @__PURE__ */ (0, T.jsx)("div", {
					className: "sf-state",
					children: g("loading")
				}),
				children: /* @__PURE__ */ (0, T.jsx)(Ze, {
					...Yn,
					showQrCode: A.qrCode && u.qrCode !== !1,
					labels: {
						title: g("share"),
						close: g("close"),
						copyUrl: g("copyUrl"),
						copied: g("urlCopied"),
						copyFailed: g("copyUrlFailed"),
						downloadQr: g("downloadQrCode"),
						loginRequired: g("loginRequired"),
						expires: g("linkExpires"),
						hint: g("shareHint"),
						qrCode: g("qrCode"),
						qrFailed: g("qrCodeFailed")
					},
					formatDate: (e) => _.format(e * 1e3),
					onClose: () => Xn(null)
				})
			}),
			On && u.imageProcessing !== !1 && ri.length > 0 && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
				fallback: /* @__PURE__ */ (0, T.jsx)("div", {
					className: "sf-state",
					children: g("loading")
				}),
				children: /* @__PURE__ */ (0, T.jsx)(Ve, {
					entries: ri,
					resource: b,
					formats: $n.formats.filter((e) => e.edit && [
						"jpeg",
						"png",
						"webp",
						"avif"
					].includes(e.format)).map((e) => e.format),
					labels: {
						title: g("imageProcess"),
						close: g("close"),
						cancel: g("cancel"),
						apply: g("applyImageProcess"),
						processing: g("processingImages"),
						selected: g("processingSelected"),
						operation: g("operation"),
						optimize: g("optimizeImage"),
						textWatermark: g("textWatermark"),
						imageWatermark: g("imageWatermark"),
						outputFormat: g("outputFormat"),
						keepFormat: g("keepFormat"),
						watermarkText: g("watermarkText"),
						color: g("color"),
						watermarkResource: g("watermarkResource"),
						watermarkPath: g("watermarkPath"),
						position: g("position"),
						topLeft: g("topLeft"),
						topRight: g("topRight"),
						center: g("center"),
						bottomLeft: g("bottomLeft"),
						bottomRight: g("bottomRight"),
						opacity: g("opacity"),
						scale: g("watermarkScale"),
						quality: g("quality"),
						saveMode: g("saveMode"),
						saveCopy: g("saveCopy"),
						overwrite: g("overwrite"),
						conversionCopyHint: g("conversionCopyHint"),
						overwriteWarning: g("confirmImageOverwrite")
					},
					onClose: () => kn(!1),
					onApply: async (e, t) => {
						if (ri.length === 1) await a.applyImageActions(b, ri[0].path, e, t), jt(`${g("completed")}: 1`);
						else {
							let n = await a.applyImageBatch(b, ri.map((e) => e.path), e, t);
							jt(`${g("completed")}: ${n.succeeded} · ${g("failed")}: ${n.failed}`);
						}
						kn(!1), await N();
					}
				})
			}),
			En && I && Ut && /* @__PURE__ */ (0, T.jsx)(h.Suspense, {
				fallback: /* @__PURE__ */ (0, T.jsx)("div", {
					className: "sf-state",
					children: g("loading")
				}),
				children: /* @__PURE__ */ (0, T.jsx)(Be, {
					entry: I,
					info: Ut,
					imageUrl: a.contentUrl(b, I.path),
					maximumFileNameLength: P?.maxFileNameLength ?? 120,
					labels: {
						crop: g("crop"),
						close: g("close"),
						cancel: g("cancel"),
						save: g("save"),
						saving: g("saving"),
						ratio: g("ratio"),
						free: g("freeRatio"),
						original: g("originalRatio"),
						zoom: g("zoom"),
						undo: g("undo"),
						redo: g("redo"),
						reset: g("reset"),
						compare: g("compare"),
						x: "X",
						y: "Y",
						width: g("width"),
						height: g("height"),
						saveMode: g("saveMode"),
						saveCopy: g("saveCopy"),
						overwrite: g("overwrite"),
						fileName: g("fileName"),
						fileNameTooLong: g("fileNameTooLongMaximum"),
						invalidFileName: g("invalidEntryName"),
						formatLocked: g("imageFormatLocked"),
						overwriteWarning: g("confirmImageOverwrite"),
						panHint: g("panHint")
					},
					onClose: () => Dn(!1),
					onSave: async (e, t) => {
						let n = await a.applyImageActions(b, I.path, e, t);
						Dn(!1), jt(`${g("imageCreated")}: ${n.entry.name} · ${n.result.width} × ${n.result.height} px`), await N();
					}
				})
			}),
			/* @__PURE__ */ (0, T.jsxs)(h.Suspense, {
				fallback: null,
				children: [Hn && /* @__PURE__ */ (0, T.jsx)(tt, {
					x: Hn.x,
					y: Hn.y,
					onClose: () => Un(null),
					onSelect: () => {
						Un(null), Hn.favorite ? ha(Hn.link.path) : ma(Hn.link);
					},
					items: [{
						id: "remove",
						label: g(Hn.favorite ? "removeFavorite" : "unpinQuickAccess")
					}]
				}), Bn && /* @__PURE__ */ (0, T.jsx)(tt, {
					x: Bn.x,
					y: Bn.y,
					onClose: () => Vn(null),
					onSelect: Li,
					items: [
						{
							id: Bn.entry.directory ? "open" : "preview",
							label: Bn.entry.directory ? g("open") : g("preview")
						},
						...l === "picker" && !Bn.entry.directory ? [{
							id: "select",
							label: g("select"),
							disabled: !ii(Bn.entry)
						}] : [],
						{
							id: "download",
							label: g("download"),
							disabled: Bn.entry.directory
						},
						{
							id: "share",
							label: g("share"),
							disabled: Bn.entry.directory
						},
						...l === "manager" ? [
							...A.favorites ? [{
								id: "favorite",
								label: Rt.favorites.includes(Bn.entry.path) ? g("removeFavorite") : g("favorite")
							}] : [],
							...oa && A.sidebarQuickAccess && li(Bn.entry) ? [{
								id: "quick-access",
								label: Rt.quickAccess.includes(Bn.entry.path) ? g("unpinQuickAccess") : g("pinQuickAccess")
							}] : [],
							{
								id: "rename",
								label: g("rename"),
								disabled: Bn.entry.capabilities?.rename === !1
							},
							{
								id: "copy",
								label: g("copy"),
								disabled: Bn.entry.capabilities?.copy === !1
							},
							{
								id: "move",
								label: g("move"),
								disabled: Bn.entry.capabilities?.move === !1
							},
							{
								id: "delete",
								label: g("remove"),
								disabled: Bn.entry.capabilities?.delete === !1,
								danger: !0
							},
							...ui.filter((e) => e.slot === "context").map((e) => ({
								id: `plugin:${e.plugin}:${e.id}`,
								label: ke(e, d),
								disabled: !Me(e, Bn.entry)
							}))
						] : []
					]
				})]
			}),
			/* @__PURE__ */ (0, T.jsx)("div", {
				className: "sf-sr-only",
				"aria-live": "polite",
				children: F.length > 0 ? `${F.length} ${g("selectedCount")}` : At
			})
		]
	});
}
var st = (e) => !!(e && (e.startsWith("text/") || [
	"application/json",
	"application/ld+json",
	"application/xml",
	"application/x-yaml",
	"application/yaml"
].includes(e) || e.endsWith("+json") || e.endsWith("+xml"))), ct = document.getElementById("sofinder-root");
if (!ct) throw Error("SoFinder root element was not found.");
var lt = JSON.parse(ct.dataset.config || "{}");
ee(ne(lt.language)).then((e) => {
	(0, g.createRoot)(ct).render(/* @__PURE__ */ (0, T.jsx)(h.StrictMode, { children: /* @__PURE__ */ (0, T.jsx)(ot, {
		config: lt,
		initialMessages: e
	}) }));
});
//#endregion
