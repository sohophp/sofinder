//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), l = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.iterator;
	function m(e) {
		return typeof e != "object" || !e ? null : (e = p && e[p] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var h = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, g = Object.assign, _ = {};
	function v(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	v.prototype.isReactComponent = {}, v.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, v.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function y() {}
	y.prototype = v.prototype;
	function b(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	var x = b.prototype = new y();
	x.constructor = b, g(x, v.prototype), x.isPureReactComponent = !0;
	var S = Array.isArray;
	function C() {}
	var w = {
		H: null,
		A: null,
		T: null,
		S: null
	}, T = Object.prototype.hasOwnProperty;
	function E(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function D(e, t) {
		return E(e.type, t, e.props);
	}
	function O(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function ee(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var k = /\/+/g;
	function A(e, t) {
		return typeof e == "object" && e && e.key != null ? ee("" + e.key) : t.toString(36);
	}
	function j(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(C, C) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function M(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, M(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + A(e, 0) : a, S(o) ? (i = "", c != null && (i = c.replace(k, "$&/") + "/"), M(o, r, i, "", function(e) {
			return e;
		})) : o != null && (O(o) && (o = D(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(k, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (S(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + A(a, u), c += M(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + A(a, u++), c += M(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return M(j(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function N(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return M(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function P(e) {
		if (e._status === -1) {
			var t = e._result;
			t = t(), t.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t);
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t);
			}), e._status === -1 && (e._status = 0, e._result = t);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var F = typeof reportError == "function" ? reportError : function(e) {
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
	}, I = {
		map: N,
		forEach: function(e, t, n) {
			N(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return N(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return N(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!O(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = I, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return w.H.useMemoCache(e);
		}
	}, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = g({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !T.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return E(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) T.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return E(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = O, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: P
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = function(e) {
		var t = w.T, n = {};
		w.T = n;
		try {
			var r = e(), i = w.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(C, F);
		} catch (e) {
			F(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), w.T = t;
		}
	}, e.unstable_useCacheRefresh = function() {
		return w.H.useCacheRefresh();
	}, e.use = function(e) {
		return w.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return w.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return w.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return w.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return w.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return w.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return w.H.useEffectEvent(e);
	}, e.useId = function() {
		return w.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return w.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return w.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return w.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return w.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return w.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return w.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return w.H.useRef(e);
	}, e.useState = function(e) {
		return w.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return w.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return w.H.useTransition();
	}, e.version = "19.2.8";
})), u = /* @__PURE__ */ o(((e, t) => {
	t.exports = l();
})), d = /* @__PURE__ */ o(((e) => {
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
			if (n(c) !== null) m = !0, S || (S = !0, O());
			else {
				var t = n(l);
				t !== null && A(x, t.startTime - e);
			}
		}
	}
	var S = !1, C = -1, w = 5, T = -1;
	function E() {
		return g ? !0 : !(e.unstable_now() - T < w);
	}
	function D() {
		if (g = !1, S) {
			var t = e.unstable_now();
			T = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(C), C = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && E());) {
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
								u !== null && A(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? O() : S = !1;
			}
		}
	}
	var O;
	if (typeof y == "function") O = function() {
		y(D);
	};
	else if (typeof MessageChannel < "u") {
		var ee = new MessageChannel(), k = ee.port2;
		ee.port1.onmessage = D, O = function() {
			k.postMessage(null);
		};
	} else O = function() {
		_(D, 0);
	};
	function A(t, n) {
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
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, A(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
	}, e.unstable_shouldYield = E, e.unstable_wrapCallback = function(e) {
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
})), f = /* @__PURE__ */ o(((e, t) => {
	t.exports = d();
})), p = /* @__PURE__ */ o(((e) => {
	var t = u();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var i = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, a = Symbol.for("react.portal");
	function o(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: a,
			key: r == null ? null : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var s = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function c(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return o(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = s.T, n = i.p;
		try {
			if (s.T = null, i.p = 2, e) return e();
		} finally {
			s.T = t, i.p = n, i.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, i.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && i.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin), a = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? i.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o
			}) : n === "script" && i.d.X(e, {
				crossOrigin: r,
				integrity: a,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") {
			if (typeof t == "object" && t) {
				if (t.as == null || t.as === "script") {
					var n = c(t.as, t.crossOrigin);
					i.d.M(e, {
						crossOrigin: n,
						integrity: typeof t.integrity == "string" ? t.integrity : void 0,
						nonce: typeof t.nonce == "string" ? t.nonce : void 0
					});
				}
			} else t ?? i.d.M(e);
		}
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = c(n, t.crossOrigin);
			i.d.L(e, n, {
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
				var n = c(t.as, t.crossOrigin);
				i.d.m(e, {
					as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0
				});
			} else i.d.m(e);
		}
	}, e.requestFormReset = function(e) {
		i.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return s.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return s.H.useHostTransitionStatus();
	}, e.version = "19.2.8";
})), m = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = p();
})), h = /* @__PURE__ */ o(((e) => {
	var t = f(), n = u(), r = m();
	function i(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function a(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function o(e) {
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
	function s(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function c(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function l(e) {
		if (o(e) !== e) throw Error(i(188));
	}
	function d(e) {
		var t = e.alternate;
		if (!t) {
			if (t = o(e), t === null) throw Error(i(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var a = n.return;
			if (a === null) break;
			var s = a.alternate;
			if (s === null) {
				if (r = a.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (a.child === s.child) {
				for (s = a.child; s;) {
					if (s === n) return l(a), e;
					if (s === r) return l(a), t;
					s = s.sibling;
				}
				throw Error(i(188));
			}
			if (n.return !== r.return) n = a, r = s;
			else {
				for (var c = !1, u = a.child; u;) {
					if (u === n) {
						c = !0, n = a, r = s;
						break;
					}
					if (u === r) {
						c = !0, r = a, n = s;
						break;
					}
					u = u.sibling;
				}
				if (!c) {
					for (u = s.child; u;) {
						if (u === n) {
							c = !0, n = s, r = a;
							break;
						}
						if (u === r) {
							c = !0, r = s, n = a;
							break;
						}
						u = u.sibling;
					}
					if (!c) throw Error(i(189));
				}
			}
			if (n.alternate !== r) throw Error(i(190));
		}
		if (n.tag !== 3) throw Error(i(188));
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
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), S = Symbol.for("react.consumer"), C = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), E = Symbol.for("react.suspense_list"), D = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), ee = Symbol.for("react.activity"), k = Symbol.for("react.memo_cache_sentinel"), A = Symbol.iterator;
	function j(e) {
		return typeof e != "object" || !e ? null : (e = A && e[A] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var M = Symbol.for("react.client.reference");
	function N(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === M ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case T: return "Suspense";
			case E: return "SuspenseList";
			case ee: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case C: return e.displayName || "Context";
			case S: return (e._context.displayName || "Context") + ".Consumer";
			case w:
				var t = e.render;
				return e = e.displayName, e || (e = t.displayName || t.name || "", e = e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case D: return t = e.displayName || null, t === null ? N(e.type) || "Memo" : t;
			case O:
				t = e._payload, e = e._init;
				try {
					return N(e(t));
				} catch {}
		}
		return null;
	}
	var P = Array.isArray, F = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, I = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, te = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, ne = [], re = -1;
	function ie(e) {
		return { current: e };
	}
	function ae(e) {
		0 > re || (e.current = ne[re], ne[re] = null, re--);
	}
	function L(e, t) {
		re++, ne[re] = e.current, e.current = t;
	}
	var oe = ie(null), se = ie(null), ce = ie(null), le = ie(null);
	function ue(e, t) {
		switch (L(ce, t), L(se, e), L(oe, null), t.nodeType) {
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
		ae(oe), L(oe, e);
	}
	function de() {
		ae(oe), ae(se), ae(ce);
	}
	function fe(e) {
		e.memoizedState !== null && L(le, e);
		var t = oe.current, n = Hd(t, e.type);
		t !== n && (L(se, e), L(oe, n));
	}
	function pe(e) {
		se.current === e && (ae(oe), ae(se)), le.current === e && (ae(le), Qf._currentValue = te);
	}
	var me, he;
	function ge(e) {
		if (me === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			me = t && t[1] || "", he = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + me + e + he;
	}
	var _e = !1;
	function ve(e, t) {
		if (!e || _e) return "";
		_e = !0;
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
			_e = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? ge(n) : "";
	}
	function ye(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return ge(e.type);
			case 16: return ge("Lazy");
			case 13: return e.child !== t && t !== null ? ge("Suspense Fallback") : ge("Suspense");
			case 19: return ge("SuspenseList");
			case 0:
			case 15: return ve(e.type, !1);
			case 11: return ve(e.type.render, !1);
			case 1: return ve(e.type, !0);
			case 31: return ge("Activity");
			default: return "";
		}
	}
	function be(e) {
		try {
			var t = "", n = null;
			do
				t += ye(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var xe = Object.prototype.hasOwnProperty, Se = t.unstable_scheduleCallback, Ce = t.unstable_cancelCallback, we = t.unstable_shouldYield, Te = t.unstable_requestPaint, Ee = t.unstable_now, De = t.unstable_getCurrentPriorityLevel, Oe = t.unstable_ImmediatePriority, ke = t.unstable_UserBlockingPriority, Ae = t.unstable_NormalPriority, R = t.unstable_LowPriority, je = t.unstable_IdlePriority, Me = t.log, Ne = t.unstable_setDisableYieldValue, Pe = null, Fe = null;
	function Ie(e) {
		if (typeof Me == "function" && Ne(e), Fe && typeof Fe.setStrictMode == "function") try {
			Fe.setStrictMode(Pe, e);
		} catch {}
	}
	var Le = Math.clz32 ? Math.clz32 : Be, Re = Math.log, ze = Math.LN2;
	function Be(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Re(e) / ze | 0) | 0;
	}
	var Ve = 256, He = 262144, Ue = 4194304;
	function We(e) {
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
	function Ge(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = We(n))) : i = We(o) : i = We(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = We(n))) : i = We(o)) : i = We(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Ke(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function qe(e, t) {
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
	function Je() {
		var e = Ue;
		return Ue <<= 1, !(Ue & 62914560) && (Ue = 4194304), e;
	}
	function Ye(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function Xe(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function Ze(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Le(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && z(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function z(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Le(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function Qe(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Le(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function $e(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : et(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function et(e) {
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
	function tt(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function nt() {
		var e = I.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : mp(e.type)) : e;
	}
	function rt(e, t) {
		var n = I.p;
		try {
			return I.p = e, t();
		} finally {
			I.p = n;
		}
	}
	var it = Math.random().toString(36).slice(2), at = "__reactFiber$" + it, ot = "__reactProps$" + it, st = "__reactContainer$" + it, ct = "__reactEvents$" + it, lt = "__reactListeners$" + it, ut = "__reactHandles$" + it, dt = "__reactResources$" + it, ft = "__reactMarker$" + it;
	function pt(e) {
		delete e[at], delete e[ot], delete e[ct], delete e[lt], delete e[ut];
	}
	function mt(e) {
		var t = e[at];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[st] || n[at]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = df(e); e !== null;) {
					if (n = e[at]) return n;
					e = df(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function ht(e) {
		if (e = e[at] || e[st]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function gt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(i(33));
	}
	function _t(e) {
		var t = e[dt];
		return t || (t = e[dt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}), t;
	}
	function vt(e) {
		e[ft] = !0;
	}
	var yt = /* @__PURE__ */ new Set(), bt = {};
	function xt(e, t) {
		St(e, t), St(e + "Capture", t);
	}
	function St(e, t) {
		for (bt[e] = t, e = 0; e < t.length; e++) yt.add(t[e]);
	}
	var Ct = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), wt = {}, Tt = {};
	function Et(e) {
		return xe.call(Tt, e) ? !0 : xe.call(wt, e) ? !1 : Ct.test(e) ? Tt[e] = !0 : (wt[e] = !0, !1);
	}
	function Dt(e, t, n) {
		if (Et(t)) {
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
	function Ot(e, t, n) {
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
	function kt(e, t, n, r) {
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
	function At(e) {
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
	function jt(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function Mt(e, t, n) {
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
	function Nt(e) {
		if (!e._valueTracker) {
			var t = jt(e) ? "checked" : "value";
			e._valueTracker = Mt(e, t, "" + e[t]);
		}
	}
	function Pt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = jt(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n && (t.setValue(e), !0);
	}
	function Ft(e) {
		if (e = e || (typeof document < "u" ? document : void 0), e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var It = /[\n"\\]/g;
	function Lt(e) {
		return e.replace(It, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Rt(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + At(t)) : e.value !== "" + At(t) && (e.value = "" + At(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : B(e, o, At(n)) : B(e, o, At(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + At(s) : e.removeAttribute("name");
	}
	function zt(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Nt(e);
				return;
			}
			n = n == null ? "" : "" + At(n), t = t == null ? n : "" + At(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r = r ?? i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Nt(e);
	}
	function B(e, t, n) {
		t === "number" && Ft(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Bt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + At(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Vt(e, t, n) {
		if (t != null && (t = "" + At(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + At(n);
	}
	function Ht(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (P(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ?? (n = ""), t = n;
		}
		n = At(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Nt(e);
	}
	function Ut(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var Wt = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function Gt(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Wt.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function Kt(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && Gt(e, a, r);
		} else for (var o in t) t.hasOwnProperty(o) && Gt(e, o, t[o]);
	}
	function qt(e) {
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
	var Jt = /* @__PURE__ */ new Map([
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
	]), Yt = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function Xt(e) {
		return Yt.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function Zt() {}
	var Qt = null;
	function $t(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var en = null, tn = null;
	function nn(e) {
		var t = ht(e);
		if (t && (e = t.stateNode)) {
			var n = e[ot] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Rt(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Lt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[ot] || null;
								if (!a) throw Error(i(90));
								Rt(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Pt(r);
					}
					break a;
				case "textarea":
					Vt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Bt(e, !!n.multiple, t, !1);
			}
		}
	}
	var rn = !1;
	function an(e, t, n) {
		if (rn) return e(t, n);
		rn = !0;
		try {
			return e(t);
		} finally {
			if (rn = !1, (en !== null || tn !== null) && (yu(), en && (t = en, e = tn, tn = en = null, nn(t), e))) for (t = 0; t < e.length; t++) nn(e[t]);
		}
	}
	function on(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[ot] || null;
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
		if (n && typeof n != "function") throw Error(i(231, t, typeof n));
		return n;
	}
	var sn = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), cn = !1;
	if (sn) try {
		var ln = {};
		Object.defineProperty(ln, "passive", { get: function() {
			cn = !0;
		} }), window.addEventListener("test", ln, ln), window.removeEventListener("test", ln, ln);
	} catch {
		cn = !1;
	}
	var un = null, dn = null, fn = null;
	function pn() {
		if (fn) return fn;
		var e, t = dn, n = t.length, r, i = "value" in un ? un.value : un.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return fn = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function mn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function hn() {
		return !0;
	}
	function gn() {
		return !1;
	}
	function _n(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? hn : gn, this.isPropagationStopped = gn, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = hn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = hn);
			},
			persist: function() {},
			isPersistent: hn
		}), t;
	}
	var vn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, yn = _n(vn), V = h({}, vn, {
		view: 0,
		detail: 0
	}), bn = _n(V), xn, Sn, Cn, H = h({}, V, {
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
		getModifierState: Mn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Cn && (Cn && e.type === "mousemove" ? (xn = e.screenX - Cn.screenX, Sn = e.screenY - Cn.screenY) : Sn = xn = 0, Cn = e), xn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : Sn;
		}
	}), wn = _n(H), U = _n(h({}, H, { dataTransfer: 0 })), W = _n(h({}, V, { relatedTarget: 0 })), Tn = _n(h({}, vn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), En = _n(h({}, vn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), Dn = _n(h({}, vn, { data: 0 })), On = {
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
	}, kn = {
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
	}, An = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function jn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = An[e]) ? !!t[e] : !1;
	}
	function Mn() {
		return jn;
	}
	var Nn = _n(h({}, V, {
		key: function(e) {
			if (e.key) {
				var t = On[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = mn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? kn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Mn,
		charCode: function(e) {
			return e.type === "keypress" ? mn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? mn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Pn = _n(h({}, H, {
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
	})), Fn = _n(h({}, V, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Mn
	})), In = _n(h({}, vn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Ln = _n(h({}, H, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Rn = _n(h({}, vn, {
		newState: 0,
		oldState: 0
	})), zn = [
		9,
		13,
		27,
		32
	], Bn = sn && "CompositionEvent" in window, Vn = null;
	sn && "documentMode" in document && (Vn = document.documentMode);
	var Hn = sn && "TextEvent" in window && !Vn, Un = sn && (!Bn || Vn && 8 < Vn && 11 >= Vn), Wn = " ", Gn = !1;
	function Kn(e, t) {
		switch (e) {
			case "keyup": return zn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function qn(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var Jn = !1;
	function Yn(e, t) {
		switch (e) {
			case "compositionend": return qn(t);
			case "keypress": return t.which === 32 ? (Gn = !0, Wn) : null;
			case "textInput": return e = t.data, e === Wn && Gn ? null : e;
			default: return null;
		}
	}
	function Xn(e, t) {
		if (Jn) return e === "compositionend" || !Bn && Kn(e, t) ? (e = pn(), fn = dn = un = null, Jn = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return Un && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var Zn = {
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
	function Qn(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!Zn[e.type] : t === "textarea";
	}
	function $n(e, t, n, r) {
		en ? tn ? tn.push(r) : tn = [r] : en = r, t = Td(t, "onChange"), 0 < t.length && (n = new yn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var er = null, tr = null;
	function nr(e) {
		vd(e, 0);
	}
	function rr(e) {
		if (Pt(gt(e))) return e;
	}
	function ir(e, t) {
		if (e === "change") return t;
	}
	var ar = !1;
	if (sn) {
		var or;
		if (sn) {
			var sr = "oninput" in document;
			if (!sr) {
				var cr = document.createElement("div");
				cr.setAttribute("oninput", "return;"), sr = typeof cr.oninput == "function";
			}
			or = sr;
		} else or = !1;
		ar = or && (!document.documentMode || 9 < document.documentMode);
	}
	function lr() {
		er && (er.detachEvent("onpropertychange", ur), tr = er = null);
	}
	function ur(e) {
		if (e.propertyName === "value" && rr(tr)) {
			var t = [];
			$n(t, tr, e, $t(e)), an(nr, t);
		}
	}
	function dr(e, t, n) {
		e === "focusin" ? (lr(), er = t, tr = n, er.attachEvent("onpropertychange", ur)) : e === "focusout" && lr();
	}
	function fr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return rr(tr);
	}
	function pr(e, t) {
		if (e === "click") return rr(t);
	}
	function mr(e, t) {
		if (e === "input" || e === "change") return rr(t);
	}
	function hr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var gr = typeof Object.is == "function" ? Object.is : hr;
	function _r(e, t) {
		if (gr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!xe.call(t, i) || !gr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function vr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function yr(e, t) {
		var n = vr(e);
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
			n = vr(n);
		}
	}
	function br(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? br(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function xr(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = Ft(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = Ft(e.document);
		}
		return t;
	}
	function Sr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Cr = sn && "documentMode" in document && 11 >= document.documentMode, wr = null, Tr = null, Er = null, Dr = !1;
	function Or(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Dr || wr == null || wr !== Ft(r) || (r = wr, "selectionStart" in r && Sr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Er && _r(Er, r) || (Er = r, r = Td(Tr, "onSelect"), 0 < r.length && (t = new yn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = wr)));
	}
	function kr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Ar = {
		animationend: kr("Animation", "AnimationEnd"),
		animationiteration: kr("Animation", "AnimationIteration"),
		animationstart: kr("Animation", "AnimationStart"),
		transitionrun: kr("Transition", "TransitionRun"),
		transitionstart: kr("Transition", "TransitionStart"),
		transitioncancel: kr("Transition", "TransitionCancel"),
		transitionend: kr("Transition", "TransitionEnd")
	}, jr = {}, Mr = {};
	sn && (Mr = document.createElement("div").style, "AnimationEvent" in window || (delete Ar.animationend.animation, delete Ar.animationiteration.animation, delete Ar.animationstart.animation), "TransitionEvent" in window || delete Ar.transitionend.transition);
	function Nr(e) {
		if (jr[e]) return jr[e];
		if (!Ar[e]) return e;
		var t = Ar[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Mr) return jr[e] = t[n];
		return e;
	}
	var Pr = Nr("animationend"), Fr = Nr("animationiteration"), Ir = Nr("animationstart"), Lr = Nr("transitionrun"), Rr = Nr("transitionstart"), zr = Nr("transitioncancel"), Br = Nr("transitionend"), Vr = /* @__PURE__ */ new Map(), Hr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Hr.push("scrollEnd");
	function Ur(e, t) {
		Vr.set(e, t), xt(t, [e]);
	}
	var Wr = typeof reportError == "function" ? reportError : function(e) {
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
	}, Gr = [], Kr = 0, qr = 0;
	function Jr() {
		for (var e = Kr, t = qr = Kr = 0; t < e;) {
			var n = Gr[t];
			Gr[t++] = null;
			var r = Gr[t];
			Gr[t++] = null;
			var i = Gr[t];
			Gr[t++] = null;
			var a = Gr[t];
			if (Gr[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && Qr(n, i, a);
		}
	}
	function Yr(e, t, n, r) {
		Gr[Kr++] = e, Gr[Kr++] = t, Gr[Kr++] = n, Gr[Kr++] = r, qr |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function Xr(e, t, n, r) {
		return Yr(e, t, n, r), $r(e);
	}
	function Zr(e, t) {
		return Yr(e, null, null, t), $r(e);
	}
	function Qr(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Le(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function $r(e) {
		if (50 < uu) throw uu = 0, du = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var ei = {};
	function ti(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function ni(e, t, n, r) {
		return new ti(e, t, n, r);
	}
	function ri(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function ii(e, t) {
		var n = e.alternate;
		return n === null ? (n = ni(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function ai(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function oi(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof e == "function") ri(e) && (s = 1);
		else if (typeof e == "string") s = Uf(e, n, oe.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case ee: return e = ni(31, n, t, a), e.elementType = ee, e.lanes = o, e;
			case y: return si(n.children, a, o, t);
			case b:
				s = 8, a |= 24;
				break;
			case x: return e = ni(12, n, t, a | 2), e.elementType = x, e.lanes = o, e;
			case T: return e = ni(13, n, t, a), e.elementType = T, e.lanes = o, e;
			case E: return e = ni(19, n, t, a), e.elementType = E, e.lanes = o, e;
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
					case D:
						s = 14;
						break a;
					case O:
						s = 16, r = null;
						break a;
				}
				s = 29, n = Error(i(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = ni(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function si(e, t, n, r) {
		return e = ni(7, e, r, t), e.lanes = n, e;
	}
	function ci(e, t, n) {
		return e = ni(6, e, null, t), e.lanes = n, e;
	}
	function li(e) {
		var t = ni(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function ui(e, t, n) {
		return t = ni(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var di = /* @__PURE__ */ new WeakMap();
	function fi(e, t) {
		if (typeof e == "object" && e) {
			var n = di.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: be(t)
			}, di.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: be(t)
		};
	}
	var pi = [], mi = 0, hi = null, gi = 0, _i = [], vi = 0, yi = null, bi = 1, xi = "";
	function Si(e, t) {
		pi[mi++] = gi, pi[mi++] = hi, hi = e, gi = t;
	}
	function Ci(e, t, n) {
		_i[vi++] = bi, _i[vi++] = xi, _i[vi++] = yi, yi = e;
		var r = bi;
		e = xi;
		var i = 32 - Le(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Le(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, bi = 1 << 32 - Le(t) + i | n << i | r, xi = a + e;
		} else bi = 1 << a | n << i | r, xi = e;
	}
	function wi(e) {
		e.return !== null && (Si(e, 1), Ci(e, 1, 0));
	}
	function Ti(e) {
		for (; e === hi;) hi = pi[--mi], pi[mi] = null, gi = pi[--mi], pi[mi] = null;
		for (; e === yi;) yi = _i[--vi], _i[vi] = null, xi = _i[--vi], _i[vi] = null, bi = _i[--vi], _i[vi] = null;
	}
	function Ei(e, t) {
		_i[vi++] = bi, _i[vi++] = xi, _i[vi++] = yi, bi = t.id, xi = t.overflow, yi = e;
	}
	var Di = null, Oi = null, G = !1, ki = null, Ai = !1, ji = Error(i(519));
	function Mi(e) {
		throw Ri(fi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), ji;
	}
	function Ni(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[at] = e, t[ot] = r, n) {
			case "dialog":
				$("cancel", t), $("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				$("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < gd.length; n++) $(gd[n], t);
				break;
			case "source":
				$("error", t);
				break;
			case "img":
			case "image":
			case "link":
				$("error", t), $("load", t);
				break;
			case "details":
				$("toggle", t);
				break;
			case "input":
				$("invalid", t), zt(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				$("invalid", t);
				break;
			case "textarea": $("invalid", t), Ht(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || jd(t.textContent, n) ? (r.popover != null && ($("beforetoggle", t), $("toggle", t)), r.onScroll != null && $("scroll", t), r.onScrollEnd != null && $("scrollend", t), r.onClick != null && (t.onclick = Zt), t = !0) : t = !1, t || Mi(e, !0);
	}
	function Pi(e) {
		for (Di = e.return; Di;) switch (Di.tag) {
			case 5:
			case 31:
			case 13:
				Ai = !1;
				return;
			case 27:
			case 3:
				Ai = !0;
				return;
			default: Di = Di.return;
		}
	}
	function Fi(e) {
		if (e !== Di) return !1;
		if (!G) return Pi(e), G = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || Ud(e.type, e.memoizedProps)), n = !n), n && Oi && Mi(e), Pi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Oi = uf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Oi = uf(e);
		} else t === 27 ? (t = Oi, Zd(e.type) ? (e = lf, lf = null, Oi = e) : Oi = t) : Oi = Di ? cf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Ii() {
		Oi = Di = null, G = !1;
	}
	function Li() {
		var e = ki;
		return e !== null && (Xl === null ? Xl = e : Xl.push.apply(Xl, e), ki = null), e;
	}
	function Ri(e) {
		ki === null ? ki = [e] : ki.push(e);
	}
	var zi = ie(null), Bi = null, Vi = null;
	function Hi(e, t, n) {
		L(zi, t._currentValue), t._currentValue = n;
	}
	function Ui(e) {
		e._currentValue = zi.current, ae(zi);
	}
	function Wi(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function Gi(e, t, n, r) {
		var a = e.child;
		for (a !== null && (a.return = e); a !== null;) {
			var o = a.dependencies;
			if (o !== null) {
				var s = a.child;
				o = o.firstContext;
				a: for (; o !== null;) {
					var c = o;
					o = a;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Wi(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Wi(s, n, e), s = null;
			} else s = a.child;
			if (s !== null) s.return = a;
			else for (s = a; s !== null;) {
				if (s === e) {
					s = null;
					break;
				}
				if (a = s.sibling, a !== null) {
					a.return = s.return, s = a;
					break;
				}
				s = s.return;
			}
			a = s;
		}
	}
	function Ki(e, t, n, r) {
		e = null;
		for (var a = t, o = !1; a !== null;) {
			if (!o) {
				if (a.flags & 524288) o = !0;
				else if (a.flags & 262144) break;
			}
			if (a.tag === 10) {
				var s = a.alternate;
				if (s === null) throw Error(i(387));
				if (s = s.memoizedProps, s !== null) {
					var c = a.type;
					gr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === le.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [Qf] : e.push(Qf));
			}
			a = a.return;
		}
		e !== null && Gi(t, e, n, r), t.flags |= 262144;
	}
	function qi(e) {
		for (e = e.firstContext; e !== null;) {
			if (!gr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Ji(e) {
		Bi = e, Vi = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Yi(e) {
		return Zi(Bi, e);
	}
	function Xi(e, t) {
		return Bi === null && Ji(e), Zi(e, t);
	}
	function Zi(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Vi === null) {
			if (e === null) throw Error(i(308));
			Vi = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Vi = Vi.next = t;
		return n;
	}
	var Qi = typeof AbortController < "u" ? AbortController : function() {
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
	}, $i = t.unstable_scheduleCallback, ea = t.unstable_NormalPriority, ta = {
		$$typeof: C,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function na() {
		return {
			controller: new Qi(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function ra(e) {
		e.refCount--, e.refCount === 0 && $i(ea, function() {
			e.controller.abort();
		});
	}
	var ia = null, aa = 0, oa = 0, sa = null;
	function ca(e, t) {
		if (ia === null) {
			var n = ia = [];
			aa = 0, oa = ud(), sa = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return aa++, t.then(la, la), t;
	}
	function la() {
		if (--aa === 0 && ia !== null) {
			sa !== null && (sa.status = "fulfilled");
			var e = ia;
			ia = null, oa = 0, sa = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function ua(e, t) {
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
	var da = F.S;
	F.S = function(e, t) {
		$l = Ee(), typeof t == "object" && t && typeof t.then == "function" && ca(e, t), da !== null && da(e, t);
	};
	var fa = ie(null);
	function pa() {
		var e = fa.current;
		return e === null ? Ll.pooledCache : e;
	}
	function ma(e, t) {
		t === null ? L(fa, fa.current) : L(fa, t.pool);
	}
	function ha() {
		var e = pa();
		return e === null ? null : {
			parent: ta._currentValue,
			pool: e
		};
	}
	var ga = Error(i(460)), _a = Error(i(474)), va = Error(i(542)), ya = { then: function() {} };
	function ba(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function xa(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(Zt, Zt), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Ta(e), e;
			default:
				if (typeof t.status == "string") t.then(Zt, Zt);
				else {
					if (e = Ll, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
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
					case "rejected": throw e = t.reason, Ta(e), e;
				}
				throw Ca = t, ga;
		}
	}
	function Sa(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Ca = e, ga) : e;
		}
	}
	var Ca = null;
	function wa() {
		if (Ca === null) throw Error(i(459));
		var e = Ca;
		return Ca = null, e;
	}
	function Ta(e) {
		if (e === ga || e === va) throw Error(i(483));
	}
	var Ea = null, Da = 0;
	function Oa(e) {
		var t = Da;
		return Da += 1, Ea === null && (Ea = []), xa(Ea, e, t);
	}
	function ka(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Aa(e, t) {
		throw t.$$typeof === g ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function ja(e) {
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
		function a(e, t) {
			return e = ii(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = ci(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === O && Sa(i) === t.type) ? (t = a(t, n.props), ka(t, n), t.return = e, t) : (t = oi(n.type, n.key, n.props, null, e.mode, r), ka(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = ui(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = si(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = ci("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = oi(t.type, t.key, t.props, null, e.mode, n), ka(n, t), n.return = e, n;
					case v: return t = ui(t, e.mode, n), t.return = e, t;
					case O: return t = Sa(t), f(e, t, n);
				}
				if (P(t) || j(t)) return t = si(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Oa(t), n);
				if (t.$$typeof === C) return f(e, Xi(e, t), n);
				Aa(e, t);
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
					case O: return n = Sa(n), p(e, t, n, r);
				}
				if (P(n) || j(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Oa(n), r);
				if (n.$$typeof === C) return p(e, t, Xi(e, n), r);
				Aa(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case O: return r = Sa(r), m(e, t, n, r, i);
				}
				if (P(r) || j(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Oa(r), i);
				if (r.$$typeof === C) return m(e, t, n, Xi(t, r), i);
				Aa(t, r);
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
			if (h === s.length) return n(i, d), G && Si(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return G && Si(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), G && Si(i, h), l;
		}
		function g(a, s, c, l) {
			if (c == null) throw Error(i(151));
			for (var u = null, d = null, h = s, g = s = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(a, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(a, h), s = o(y, s, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(a, h), G && Si(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return G && Si(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), G && Si(a, g), u;
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
											n(e, r.sibling), c = a(r, o.props.children), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === O && Sa(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), ka(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === y ? (c = si(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = oi(o.type, o.key, o.props, null, e.mode, c), ka(c, o), c.return = e, e = c);
						}
						return s(e);
					case v:
						a: {
							for (l = o.key; r !== null;) {
								if (r.key === l) {
									if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
										n(e, r.sibling), c = a(r, o.children || []), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							c = ui(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case O: return o = Sa(o), b(e, r, o, c);
				}
				if (P(o)) return h(e, r, o, c);
				if (j(o)) {
					if (l = j(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Oa(o), c);
				if (o.$$typeof === C) return b(e, r, Xi(e, o), c);
				Aa(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = ci(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Da = 0;
				var i = b(e, t, n, r);
				return Ea = null, i;
			} catch (t) {
				if (t === ga || t === va) throw t;
				var a = ni(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var Ma = ja(!0), Na = ja(!1), Pa = !1;
	function Fa(e) {
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
	function Ia(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function La(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Ra(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, J & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = $r(e), Qr(e, null, n), t;
		}
		return Yr(e, r, t, n), $r(e);
	}
	function za(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Qe(e, n);
		}
	}
	function Ba(e, t) {
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
	var Va = !1;
	function Ha() {
		if (Va) {
			var e = sa;
			if (e !== null) throw e;
		}
	}
	function Ua(e, t, n, r) {
		Va = !1;
		var i = e.updateQueue;
		Pa = !1;
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
				if (p ? (X & f) === f : (r & f) === f) {
					f !== 0 && f === oa && (Va = !0), u !== null && (u = u.next = {
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
							case 2: Pa = !0;
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
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), Wl |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Wa(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function Ga(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Wa(n[e], t);
	}
	var Ka = ie(null), qa = ie(0);
	function Ja(e, t) {
		e = Hl, L(qa, e), L(Ka, t), Hl = e | t.baseLanes;
	}
	function Ya() {
		L(qa, Hl), L(Ka, Ka.current);
	}
	function Xa() {
		Hl = qa.current, ae(Ka), ae(qa);
	}
	var Za = ie(null), Qa = null;
	function $a(e) {
		var t = e.alternate;
		L(io, io.current & 1), L(Za, e), Qa === null && (t === null || Ka.current !== null || t.memoizedState !== null) && (Qa = e);
	}
	function eo(e) {
		L(io, io.current), L(Za, e), Qa === null && (Qa = e);
	}
	function to(e) {
		e.tag === 22 ? (L(io, io.current), L(Za, e), Qa === null && (Qa = e)) : no(e);
	}
	function no() {
		L(io, io.current), L(Za, Za.current);
	}
	function ro(e) {
		ae(Za), Qa === e && (Qa = null), ae(io);
	}
	var io = ie(0);
	function ao(e) {
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
	var oo = 0, K = null, q = null, so = null, co = !1, lo = !1, uo = !1, fo = 0, po = 0, mo = null, ho = 0;
	function go() {
		throw Error(i(321));
	}
	function _o(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!gr(e[n], t[n])) return !1;
		return !0;
	}
	function vo(e, t, n, r, i, a) {
		return oo = a, K = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, F.H = e === null || e.memoizedState === null ? Fs : Is, uo = !1, a = n(r, i), uo = !1, lo && (a = bo(t, n, r, i)), yo(e), a;
	}
	function yo(e) {
		F.H = Ps;
		var t = q !== null && q.next !== null;
		if (oo = 0, so = q = K = null, co = !1, po = 0, mo = null, t) throw Error(i(300));
		e === null || $s || (e = e.dependencies, e !== null && qi(e) && ($s = !0));
	}
	function bo(e, t, n, r) {
		K = e;
		var a = 0;
		do {
			if (lo && (mo = null), po = 0, lo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, so = q = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			F.H = Ls, o = t(n, r);
		} while (lo);
		return o;
	}
	function xo() {
		var e = F.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? Oo(t) : t, e = e.useState()[0], (q === null ? null : q.memoizedState) !== e && (K.flags |= 1024), t;
	}
	function So() {
		var e = fo !== 0;
		return fo = 0, e;
	}
	function Co(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function wo(e) {
		if (co) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			co = !1;
		}
		oo = 0, so = q = K = null, lo = !1, po = fo = 0, mo = null;
	}
	function To() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return so === null ? K.memoizedState = so = e : so = so.next = e, so;
	}
	function Eo() {
		if (q === null) {
			var e = K.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = q.next;
		var t = so === null ? K.memoizedState : so.next;
		if (t !== null) so = t, q = e;
		else {
			if (e === null) throw K.alternate === null ? Error(i(467)) : Error(i(310));
			q = e, e = {
				memoizedState: q.memoizedState,
				baseState: q.baseState,
				baseQueue: q.baseQueue,
				queue: q.queue,
				next: null
			}, so === null ? K.memoizedState = so = e : so = so.next = e;
		}
		return so;
	}
	function Do() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function Oo(e) {
		var t = po;
		return po += 1, mo === null && (mo = []), e = xa(mo, e, t), t = K, (so === null ? t.memoizedState : so.next) === null && (t = t.alternate, F.H = t === null || t.memoizedState === null ? Fs : Is), e;
	}
	function ko(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return Oo(e);
			if (e.$$typeof === C) return Yi(e);
		}
		throw Error(i(438, String(e)));
	}
	function Ao(e) {
		var t = null, n = K.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = K.alternate;
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
		}), n === null && (n = Do(), K.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = k;
		return t.index++, n;
	}
	function jo(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Mo(e) {
		return No(Eo(), q, e);
	}
	function No(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(i(311));
		r.lastRenderedReducer = n;
		var a = e.baseQueue, o = r.pending;
		if (o !== null) {
			if (a !== null) {
				var s = a.next;
				a.next = o.next, o.next = s;
			}
			t.baseQueue = a = o, r.pending = null;
		}
		if (o = e.baseState, a === null) e.memoizedState = o;
		else {
			t = a.next;
			var c = s = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (oo & f) === f : (X & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === oa && (d = !0);
					else if ((oo & p) === p) {
						u = u.next, p === oa && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, K.lanes |= p, Wl |= p;
					f = u.action, uo && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, K.lanes |= f, Wl |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !gr(o, e.memoizedState) && ($s = !0, d && (n = sa, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Po(e) {
		var t = Eo(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			gr(o, t.memoizedState) || ($s = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Fo(e, t, n) {
		var r = K, a = Eo(), o = G;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !gr((q || a).memoizedState, n);
		if (s && (a.memoizedState = n, $s = !0), a = a.queue, os(Ro.bind(null, r, a, e), [e]), a.getSnapshot !== t || s || so !== null && so.memoizedState.tag & 1) {
			if (r.flags |= 2048, ts(9, { destroy: void 0 }, Lo.bind(null, r, a, n, t), null), Ll === null) throw Error(i(349));
			o || oo & 127 || Io(r, t, n);
		}
		return n;
	}
	function Io(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = K.updateQueue, t === null ? (t = Do(), K.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Lo(e, t, n, r) {
		t.value = n, t.getSnapshot = r, zo(t) && Bo(e);
	}
	function Ro(e, t, n) {
		return n(function() {
			zo(t) && Bo(e);
		});
	}
	function zo(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !gr(e, n);
		} catch {
			return !0;
		}
	}
	function Bo(e) {
		var t = Zr(e, 2);
		t !== null && mu(t, e, 2);
	}
	function Vo(e) {
		var t = To();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), uo) {
				Ie(!0);
				try {
					n();
				} finally {
					Ie(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: jo,
			lastRenderedState: e
		}, t;
	}
	function Ho(e, t, n, r) {
		return e.baseState = n, No(e, q, typeof r == "function" ? r : jo);
	}
	function Uo(e, t, n, r, a) {
		if (js(e)) throw Error(i(485));
		if (e = t.action, e !== null) {
			var o = {
				payload: a,
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
			F.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Wo(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Wo(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = F.T, o = {};
			F.T = o;
			try {
				var s = n(i, r), c = F.S;
				c !== null && c(o, s), Go(e, t, s);
			} catch (n) {
				qo(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), F.T = a;
			}
		} else try {
			a = n(i, r), Go(e, t, a);
		} catch (n) {
			qo(e, t, n);
		}
	}
	function Go(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Ko(e, t, n);
		}, function(n) {
			return qo(e, t, n);
		}) : Ko(e, t, n);
	}
	function Ko(e, t, n) {
		t.status = "fulfilled", t.value = n, Jo(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Wo(e, n)));
	}
	function qo(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Jo(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Jo(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Yo(e, t) {
		return t;
	}
	function Xo(e, t) {
		if (G) {
			var n = Ll.formState;
			if (n !== null) {
				a: {
					var r = K;
					if (G) {
						if (Oi) {
							b: {
								for (var i = Oi, a = Ai; i.nodeType !== 8;) {
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
								Oi = cf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Mi(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = To(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Yo,
			lastRenderedState: t
		}, n.queue = r, n = Os.bind(null, K, r), r.dispatch = n, r = Vo(!1), a = As.bind(null, K, !1, r.queue), r = To(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Uo.bind(null, K, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function Zo(e) {
		return Qo(Eo(), q, e);
	}
	function Qo(e, t, n) {
		if (t = No(e, t, Yo)[0], e = Mo(jo)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = Oo(t);
		} catch (e) {
			throw e === ga ? va : e;
		}
		else r = t;
		t = Eo();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (K.flags |= 2048, ts(9, { destroy: void 0 }, $o.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function $o(e, t) {
		e.action = t;
	}
	function es(e) {
		var t = Eo(), n = q;
		if (n !== null) return Qo(t, n, e);
		Eo(), t = t.memoizedState, n = Eo();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function ts(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = K.updateQueue, t === null && (t = Do(), K.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function ns() {
		return Eo().memoizedState;
	}
	function rs(e, t, n, r) {
		var i = To();
		K.flags |= e, i.memoizedState = ts(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function is(e, t, n, r) {
		var i = Eo();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		q !== null && r !== null && _o(r, q.memoizedState.deps) ? i.memoizedState = ts(t, a, n, r) : (K.flags |= e, i.memoizedState = ts(1 | t, a, n, r));
	}
	function as(e, t) {
		rs(8390656, 8, e, t);
	}
	function os(e, t) {
		is(2048, 8, e, t);
	}
	function ss(e) {
		K.flags |= 4;
		var t = K.updateQueue;
		if (t === null) t = Do(), K.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function cs(e) {
		var t = Eo().memoizedState;
		return ss({
			ref: t,
			nextImpl: e
		}), function() {
			if (J & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function ls(e, t) {
		return is(4, 2, e, t);
	}
	function us(e, t) {
		return is(4, 4, e, t);
	}
	function ds(e, t) {
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
	function fs(e, t, n) {
		n = n == null ? null : n.concat([e]), is(4, 4, ds.bind(null, t, e), n);
	}
	function ps() {}
	function ms(e, t) {
		var n = Eo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && _o(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function hs(e, t) {
		var n = Eo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && _o(t, r[1])) return r[0];
		if (r = e(), uo) {
			Ie(!0);
			try {
				e();
			} finally {
				Ie(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function gs(e, t, n) {
		return n === void 0 || oo & 1073741824 && !(X & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = pu(), K.lanes |= e, Wl |= e, n);
	}
	function _s(e, t, n, r) {
		return gr(n, t) ? n : Ka.current === null ? !(oo & 42) || oo & 1073741824 && !(X & 261930) ? ($s = !0, e.memoizedState = n) : (e = pu(), K.lanes |= e, Wl |= e, t) : (e = gs(e, n, r), gr(e, t) || ($s = !0), e);
	}
	function vs(e, t, n, r, i) {
		var a = I.p;
		I.p = a !== 0 && 8 > a ? a : 8;
		var o = F.T, s = {};
		F.T = s, As(e, !1, t, n);
		try {
			var c = i(), l = F.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? ks(e, t, ua(c, r), fu(e)) : ks(e, t, r, fu(e));
		} catch (n) {
			ks(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, fu());
		} finally {
			I.p = a, o !== null && s.types !== null && (o.types = s.types), F.T = o;
		}
	}
	function ys() {}
	function bs(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = xs(e).queue;
		vs(e, a, t, te, n === null ? ys : function() {
			return Ss(e), n(r);
		});
	}
	function xs(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: te,
			baseState: te,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: jo,
				lastRenderedState: te
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
				lastRenderedReducer: jo,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Ss(e) {
		var t = xs(e);
		t.next === null && (t = e.alternate.memoizedState), ks(e, t.next.queue, {}, fu());
	}
	function Cs() {
		return Yi(Qf);
	}
	function ws() {
		return Eo().memoizedState;
	}
	function Ts() {
		return Eo().memoizedState;
	}
	function Es(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = fu();
					e = La(n);
					var r = Ra(t, e, n);
					r !== null && (mu(r, t, n), za(r, t, n)), t = { cache: na() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function Ds(e, t, n) {
		var r = fu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, js(e) ? Ms(t, n) : (n = Xr(e, t, n, r), n !== null && (mu(n, e, r), Ns(n, t, r)));
	}
	function Os(e, t, n) {
		ks(e, t, n, fu());
	}
	function ks(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (js(e)) Ms(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, gr(s, o)) return Yr(e, t, i, 0), Ll === null && Jr(), !1;
			} catch {}
			if (n = Xr(e, t, i, r), n !== null) return mu(n, e, r), Ns(n, t, r), !0;
		}
		return !1;
	}
	function As(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: ud(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, js(e)) {
			if (t) throw Error(i(479));
		} else t = Xr(e, n, r, 2), t !== null && mu(t, e, 2);
	}
	function js(e) {
		var t = e.alternate;
		return e === K || t !== null && t === K;
	}
	function Ms(e, t) {
		lo = co = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Ns(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Qe(e, n);
		}
	}
	var Ps = {
		readContext: Yi,
		use: ko,
		useCallback: go,
		useContext: go,
		useEffect: go,
		useImperativeHandle: go,
		useLayoutEffect: go,
		useInsertionEffect: go,
		useMemo: go,
		useReducer: go,
		useRef: go,
		useState: go,
		useDebugValue: go,
		useDeferredValue: go,
		useTransition: go,
		useSyncExternalStore: go,
		useId: go,
		useHostTransitionStatus: go,
		useFormState: go,
		useActionState: go,
		useOptimistic: go,
		useMemoCache: go,
		useCacheRefresh: go
	};
	Ps.useEffectEvent = go;
	var Fs = {
		readContext: Yi,
		use: ko,
		useCallback: function(e, t) {
			return To().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Yi,
		useEffect: as,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), rs(4194308, 4, ds.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return rs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			rs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = To();
			t = t === void 0 ? null : t;
			var r = e();
			if (uo) {
				Ie(!0);
				try {
					e();
				} finally {
					Ie(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = To();
			if (n !== void 0) {
				var i = n(t);
				if (uo) {
					Ie(!0);
					try {
						n(t);
					} finally {
						Ie(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = Ds.bind(null, K, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = To();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Vo(e);
			var t = e.queue, n = Os.bind(null, K, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: ps,
		useDeferredValue: function(e, t) {
			return gs(To(), e, t);
		},
		useTransition: function() {
			var e = Vo(!1);
			return e = vs.bind(null, K, e.queue, !0, !1), To().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = K, a = To();
			if (G) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), Ll === null) throw Error(i(349));
				X & 127 || Io(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, as(Ro.bind(null, r, o, e), [e]), r.flags |= 2048, ts(9, { destroy: void 0 }, Lo.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = To(), t = Ll.identifierPrefix;
			if (G) {
				var n = xi, r = bi;
				n = (r & ~(1 << 32 - Le(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = fo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = ho++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Cs,
		useFormState: Xo,
		useActionState: Xo,
		useOptimistic: function(e) {
			var t = To();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = As.bind(null, K, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Ao,
		useCacheRefresh: function() {
			return To().memoizedState = Es.bind(null, K);
		},
		useEffectEvent: function(e) {
			var t = To(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (J & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Is = {
		readContext: Yi,
		use: ko,
		useCallback: ms,
		useContext: Yi,
		useEffect: os,
		useImperativeHandle: fs,
		useInsertionEffect: ls,
		useLayoutEffect: us,
		useMemo: hs,
		useReducer: Mo,
		useRef: ns,
		useState: function() {
			return Mo(jo);
		},
		useDebugValue: ps,
		useDeferredValue: function(e, t) {
			return _s(Eo(), q.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Mo(jo)[0], t = Eo().memoizedState;
			return [typeof e == "boolean" ? e : Oo(e), t];
		},
		useSyncExternalStore: Fo,
		useId: ws,
		useHostTransitionStatus: Cs,
		useFormState: Zo,
		useActionState: Zo,
		useOptimistic: function(e, t) {
			return Ho(Eo(), q, e, t);
		},
		useMemoCache: Ao,
		useCacheRefresh: Ts
	};
	Is.useEffectEvent = cs;
	var Ls = {
		readContext: Yi,
		use: ko,
		useCallback: ms,
		useContext: Yi,
		useEffect: os,
		useImperativeHandle: fs,
		useInsertionEffect: ls,
		useLayoutEffect: us,
		useMemo: hs,
		useReducer: Po,
		useRef: ns,
		useState: function() {
			return Po(jo);
		},
		useDebugValue: ps,
		useDeferredValue: function(e, t) {
			var n = Eo();
			return q === null ? gs(n, e, t) : _s(n, q.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Po(jo)[0], t = Eo().memoizedState;
			return [typeof e == "boolean" ? e : Oo(e), t];
		},
		useSyncExternalStore: Fo,
		useId: ws,
		useHostTransitionStatus: Cs,
		useFormState: es,
		useActionState: es,
		useOptimistic: function(e, t) {
			var n = Eo();
			return q === null ? (n.baseState = e, [e, n.queue.dispatch]) : Ho(n, q, e, t);
		},
		useMemoCache: Ao,
		useCacheRefresh: Ts
	};
	Ls.useEffectEvent = cs;
	function Rs(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var zs = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = fu(), i = La(r);
			i.payload = t, n != null && (i.callback = n), t = Ra(e, i, r), t !== null && (mu(t, e, r), za(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = fu(), i = La(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Ra(e, i, r), t !== null && (mu(t, e, r), za(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = fu(), r = La(n);
			r.tag = 2, t != null && (r.callback = t), t = Ra(e, r, n), t !== null && (mu(t, e, n), za(t, e, n));
		}
	};
	function Bs(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !_r(n, r) || !_r(i, a) : !0;
	}
	function Vs(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && zs.enqueueReplaceState(t, t.state, null);
	}
	function Hs(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = h({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Us(e) {
		Wr(e);
	}
	function Ws(e) {
		console.error(e);
	}
	function Gs(e) {
		Wr(e);
	}
	function Ks(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function qs(e, t, n) {
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
	function Js(e, t, n) {
		return n = La(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Ks(e, t);
		}, n;
	}
	function Ys(e) {
		return e = La(e), e.tag = 3, e;
	}
	function Xs(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				qs(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			qs(t, n, r), typeof i != "function" && (nu === null ? nu = /* @__PURE__ */ new Set([this]) : nu.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function Zs(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Ki(t, n, a, !0), n = Za.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return Qa === null ? Eu() : n.alternate === null && Ul === 0 && (Ul = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === ya ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), Wu(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === ya ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), Wu(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return Wu(e, r, a), Eu(), !1;
		}
		if (G) return t = Za.current, t === null ? (r !== ji && (t = Error(i(423), { cause: r }), Ri(fi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = fi(r, n), a = Js(e.stateNode, r, a), Ba(e, a), Ul !== 4 && (Ul = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== ji && (e = Error(i(422), { cause: r }), Ri(fi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = fi(o, n), Yl === null ? Yl = [o] : Yl.push(o), Ul !== 4 && (Ul = 2), t === null) return !0;
		r = fi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Js(n.stateNode, r, e), Ba(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (nu === null || !nu.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Ys(a), Xs(a, e, n, r), Ba(n, a), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var Qs = Error(i(461)), $s = !1;
	function ec(e, t, n, r) {
		t.child = e === null ? Na(t, null, n, r) : Ma(t, e.child, n, r);
	}
	function tc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Ji(t), r = vo(e, t, n, o, a, i), s = So(), e !== null && !$s ? (Co(e, t, i), Tc(e, t, i)) : (G && s && wi(t), t.flags |= 1, ec(e, t, r, i), t.child);
	}
	function nc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !ri(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, rc(e, t, a, r, i)) : (e = oi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !Ec(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? _r : n, n(o, r) && e.ref === t.ref) return Tc(e, t, i);
		}
		return t.flags |= 1, e = ii(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function rc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (_r(a, r) && e.ref === t.ref) {
				if ($s = !1, t.pendingProps = r = a, Ec(e, i)) e.flags & 131072 && ($s = !0);
				else return t.lanes = e.lanes, Tc(e, t, i);
			}
		}
		return dc(e, t, n, r, i);
	}
	function ic(e, t, n, r) {
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
				return oc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && ma(t, a === null ? null : a.cachePool), a === null ? Ya() : Ja(t, a), to(t);
			else return r = t.lanes = 536870912, oc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && ma(t, null), Ya(), no(t)) : (ma(t, a.cachePool), Ja(t, a), no(t), t.memoizedState = null);
		return ec(e, t, i, n), t.child;
	}
	function ac(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function oc(e, t, n, r, i) {
		var a = pa();
		return a = a === null ? null : {
			parent: ta._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && ma(t, null), Ya(), to(t), e !== null && Ki(e, t, r, !0), t.childLanes = i, null;
	}
	function sc(e, t) {
		return t = bc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function cc(e, t, n) {
		return Ma(t, e.child, null, n), e = sc(t, t.pendingProps), e.flags |= 2, ro(t), t.memoizedState = null, e;
	}
	function lc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (G) {
				if (r.mode === "hidden") return e = sc(t, r), t.lanes = 536870912, ac(null, e);
				if (eo(t), (e = Oi) ? (e = rf(e, Ai), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: yi === null ? null : {
						id: bi,
						overflow: xi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = li(e), n.return = t, t.child = n, Di = t, Oi = null)) : e = null, e === null) throw Mi(t);
				return t.lanes = 536870912, null;
			}
			return sc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (eo(t), a) {
				if (t.flags & 256) t.flags &= -257, t = cc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if ($s || Ki(e, t, n, !1), a = (n & e.childLanes) !== 0, $s || a) {
				if (r = Ll, r !== null && (s = $e(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, Zr(e, s), mu(r, e, s), Qs;
				Eu(), t = cc(e, t, n);
			} else e = o.treeContext, Oi = cf(s.nextSibling), Di = t, G = !0, ki = null, Ai = !1, e !== null && Ei(t, e), t = sc(t, r), t.flags |= 4096;
			return t;
		}
		return e = ii(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function uc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function dc(e, t, n, r, i) {
		return Ji(t), n = vo(e, t, n, r, void 0, i), r = So(), e !== null && !$s ? (Co(e, t, i), Tc(e, t, i)) : (G && r && wi(t), t.flags |= 1, ec(e, t, n, i), t.child);
	}
	function fc(e, t, n, r, i, a) {
		return Ji(t), t.updateQueue = null, n = bo(t, r, n, i), yo(e), r = So(), e !== null && !$s ? (Co(e, t, a), Tc(e, t, a)) : (G && r && wi(t), t.flags |= 1, ec(e, t, n, a), t.child);
	}
	function pc(e, t, n, r, i) {
		if (Ji(t), t.stateNode === null) {
			var a = ei, o = n.contextType;
			typeof o == "object" && o && (a = Yi(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = zs, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Fa(t), o = n.contextType, a.context = typeof o == "object" && o ? Yi(o) : ei, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Rs(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && zs.enqueueReplaceState(a, a.state, null), Ua(t, r, a, i), Ha(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Hs(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = ei, typeof u == "object" && u && (o = Yi(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Vs(t, a, r, o), Pa = !1;
			var f = t.memoizedState;
			a.state = f, Ua(t, r, a, i), Ha(), l = t.memoizedState, s || f !== l || Pa ? (typeof d == "function" && (Rs(t, n, d, r), l = t.memoizedState), (c = Pa || Bs(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Ia(e, t), o = t.memoizedProps, u = Hs(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = ei, typeof l == "object" && l && (c = Yi(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Vs(t, a, r, c), Pa = !1, f = t.memoizedState, a.state = f, Ua(t, r, a, i), Ha();
			var p = t.memoizedState;
			o !== d || f !== p || Pa || e !== null && e.dependencies !== null && qi(e.dependencies) ? (typeof s == "function" && (Rs(t, n, s, r), p = t.memoizedState), (u = Pa || Bs(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && qi(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, uc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Ma(t, e.child, null, i), t.child = Ma(t, null, n, i)) : ec(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Tc(e, t, i), e;
	}
	function mc(e, t, n, r) {
		return Ii(), t.flags |= 256, ec(e, t, n, r), t.child;
	}
	var hc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function gc(e) {
		return {
			baseLanes: e,
			cachePool: ha()
		};
	}
	function _c(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= ql), e;
	}
	function vc(e, t, n) {
		var r = t.pendingProps, a = !1, o = !!(t.flags & 128), s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : !!(io.current & 2)), s && (a = !0, t.flags &= -129), s = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (G) {
				if (a ? $a(t) : no(t), (e = Oi) ? (e = rf(e, Ai), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: yi === null ? null : {
						id: bi,
						overflow: xi
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = li(e), n.return = t, t.child = n, Di = t, Oi = null)) : e = null, e === null) throw Mi(t);
				return of(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, a ? (no(t), a = t.mode, c = bc({
				mode: "hidden",
				children: c
			}, a), r = si(r, a, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = gc(n), r.childLanes = _c(e, s, n), t.memoizedState = hc, ac(null, r)) : ($a(t), yc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? ($a(t), t.flags &= -257, t = xc(e, t, n)) : t.memoizedState === null ? (no(t), c = r.fallback, a = t.mode, r = bc({
				mode: "visible",
				children: r.children
			}, a), c = si(c, a, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, Ma(t, e.child, null, n), r = t.child, r.memoizedState = gc(n), r.childLanes = _c(e, s, n), t.memoizedState = hc, t = ac(null, r)) : (no(t), t.child = e.child, t.flags |= 128, t = null);
			else if ($a(t), of(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(i(419)), r.stack = "", r.digest = s, Ri({
					value: r,
					source: null,
					stack: null
				}), t = xc(e, t, n);
			} else if ($s || Ki(e, t, n, !1), s = (n & e.childLanes) !== 0, $s || s) {
				if (s = Ll, s !== null && (r = $e(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, Zr(e, r), mu(s, e, r), Qs;
				af(c) || Eu(), t = xc(e, t, n);
			} else af(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, Oi = cf(c.nextSibling), Di = t, G = !0, ki = null, Ai = !1, e !== null && Ei(t, e), t = yc(t, r.children), t.flags |= 4096);
			return t;
		}
		return a ? (no(t), c = r.fallback, a = t.mode, l = e.child, u = l.sibling, r = ii(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = si(c, a, n, null), c.flags |= 2) : c = ii(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, ac(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = gc(n) : (a = c.cachePool, a === null ? a = ha() : (l = ta._currentValue, a = a.parent === l ? a : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: a
		}), r.memoizedState = c, r.childLanes = _c(e, s, n), t.memoizedState = hc, ac(e.child, r)) : ($a(t), n = e.child, e = n.sibling, n = ii(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function yc(e, t) {
		return t = bc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function bc(e, t) {
		return e = ni(22, e, null, t), e.lanes = 0, e;
	}
	function xc(e, t, n) {
		return Ma(t, e.child, null, n), e = yc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Sc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Wi(e.return, t, n);
	}
	function Cc(e, t, n, r, i, a) {
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
	function wc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = io.current, s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, L(io, o), ec(e, t, r, n), r = G ? gi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Sc(e, n, t);
			else if (e.tag === 19) Sc(e, n, t);
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
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && ao(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Cc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && ao(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Cc(t, !0, n, null, a, r);
				break;
			case "together":
				Cc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function Tc(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), Wl |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Ki(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = ii(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = ii(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function Ec(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && qi(e)));
	}
	function Dc(e, t, n) {
		switch (t.tag) {
			case 3:
				ue(t, t.stateNode.containerInfo), Hi(t, ta, e.memoizedState.cache), Ii();
				break;
			case 27:
			case 5:
				fe(t);
				break;
			case 4:
				ue(t, t.stateNode.containerInfo);
				break;
			case 10:
				Hi(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, eo(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? ($a(t), e = Tc(e, t, n), e === null ? null : e.sibling) : vc(e, t, n) : ($a(t), t.flags |= 128, null);
				$a(t);
				break;
			case 19:
				var i = !!(e.flags & 128);
				if (r = (n & t.childLanes) !== 0, r || (Ki(e, t, n, !1), r = (n & t.childLanes) !== 0), i) {
					if (r) return wc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), L(io, io.current), r) break;
				return null;
			case 22: return t.lanes = 0, ic(e, t, n, t.pendingProps);
			case 24: Hi(t, ta, e.memoizedState.cache);
		}
		return Tc(e, t, n);
	}
	function Oc(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) $s = !0;
			else {
				if (!Ec(e, n) && !(t.flags & 128)) return $s = !1, Dc(e, t, n);
				$s = !!(e.flags & 131072);
			}
		} else $s = !1, G && t.flags & 1048576 && Ci(t, gi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Sa(t.elementType), t.type = e, typeof e == "function") ri(e) ? (r = Hs(e, r), t.tag = 1, t = pc(null, t, e, r, n)) : (t.tag = 0, t = dc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === w) {
								t.tag = 11, t = tc(null, t, e, r, n);
								break a;
							}
							if (a === D) {
								t.tag = 14, t = nc(null, t, e, r, n);
								break a;
							}
						}
						throw t = N(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return dc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Hs(r, t.pendingProps), pc(e, t, r, a, n);
			case 3:
				a: {
					if (ue(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, Ia(e, t), Ua(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, Hi(t, ta, r), r !== o.cache && Gi(t, [ta], n, !0), Ha(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = mc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = fi(Error(i(424)), t), Ri(a), t = mc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Oi = cf(e.firstChild), Di = t, G = !0, ki = null, Ai = !0, n = Na(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					} else {
						if (Ii(), r === a) {
							t = Tc(e, t, n);
							break a;
						}
						ec(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return uc(e, t), e === null ? (n = kf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : G || (n = t.type, e = t.pendingProps, r = Bd(ce.current).createElement(n), r[at] = t, r[ot] = e, Pd(r, n, e), vt(r), t.stateNode = r) : t.memoizedState = kf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return fe(t), e === null && G && (r = t.stateNode = ff(t.type, t.pendingProps, ce.current), Di = t, Ai = !0, a = Oi, Zd(t.type) ? (lf = a, Oi = cf(r.firstChild)) : Oi = a), ec(e, t, t.pendingProps.children, n), uc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && G && ((a = r = Oi) && (r = tf(r, t.type, t.pendingProps, Ai), r === null ? a = !1 : (t.stateNode = r, Di = t, Oi = cf(r.firstChild), Ai = !1, a = !0)), a || Mi(t)), fe(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Ud(a, o) ? r = null : s !== null && Ud(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = vo(e, t, xo, null, null, n), Qf._currentValue = a), uc(e, t), ec(e, t, r, n), t.child;
			case 6: return e === null && G && ((e = n = Oi) && (n = nf(n, t.pendingProps, Ai), n === null ? e = !1 : (t.stateNode = n, Di = t, Oi = null, e = !0)), e || Mi(t)), null;
			case 13: return vc(e, t, n);
			case 4: return ue(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Ma(t, null, r, n) : ec(e, t, r, n), t.child;
			case 11: return tc(e, t, t.type, t.pendingProps, n);
			case 7: return ec(e, t, t.pendingProps, n), t.child;
			case 8: return ec(e, t, t.pendingProps.children, n), t.child;
			case 12: return ec(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, Hi(t, t.type, r.value), ec(e, t, r.children, n), t.child;
			case 9: return a = t.type._context, r = t.pendingProps.children, Ji(t), a = Yi(a), r = r(a), t.flags |= 1, ec(e, t, r, n), t.child;
			case 14: return nc(e, t, t.type, t.pendingProps, n);
			case 15: return rc(e, t, t.type, t.pendingProps, n);
			case 19: return wc(e, t, n);
			case 31: return lc(e, t, n);
			case 22: return ic(e, t, n, t.pendingProps);
			case 24: return Ji(t), r = Yi(ta), e === null ? (a = pa(), a === null && (a = Ll, o = na(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, Fa(t), Hi(t, ta, a)) : ((e.lanes & n) !== 0 && (Ia(e, t), Ua(t, null, null, n), Ha()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, Hi(t, ta, r), r !== a.cache && Gi(t, [ta], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), Hi(t, ta, r))), ec(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function kc(e) {
		e.flags |= 4;
	}
	function Ac(e, t, n, r, i) {
		if ((t = !!(e.mode & 32)) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (Cu()) e.flags |= 8192;
				else throw Ca = ya, _a;
			}
		} else e.flags &= -16777217;
	}
	function jc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Wf(t)) {
			if (Cu()) e.flags |= 8192;
			else throw Ca = ya, _a;
		}
	}
	function Mc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : Je(), e.lanes |= t, Jl |= t);
	}
	function Nc(e, t) {
		if (!G) switch (e.tailMode) {
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
	function Pc(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Fc(e, t, n) {
		var r = t.pendingProps;
		switch (Ti(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return Pc(t), null;
			case 1: return Pc(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Ui(ta), de(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Fi(t) ? kc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Li())), Pc(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (kc(t), o === null ? (Pc(t), Ac(t, a, null, r, n)) : (Pc(t), jc(t, o))) : o ? o === e.memoizedState ? (Pc(t), t.flags &= -16777217) : (kc(t), Pc(t), jc(t, o)) : (e = e.memoizedProps, e !== r && kc(t), Pc(t), Ac(t, a, e, r, n)), null;
			case 27:
				if (pe(t), n = ce.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && kc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Pc(t), null;
					}
					e = oe.current, Fi(t) ? Ni(t, e) : (e = ff(a, r, n), t.stateNode = e, kc(t));
				}
				return Pc(t), null;
			case 5:
				if (pe(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && kc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Pc(t), null;
					}
					if (o = oe.current, Fi(t)) Ni(t, o);
					else {
						var s = Bd(ce.current);
						switch (o) {
							case 1:
								o = s.createElementNS("http://www.w3.org/2000/svg", a);
								break;
							case 2:
								o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
								break;
							default: switch (a) {
								case "svg":
									o = s.createElementNS("http://www.w3.org/2000/svg", a);
									break;
								case "math":
									o = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
									break;
								case "script":
									o = s.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(o.firstChild);
									break;
								case "select":
									o = typeof r.is == "string" ? s.createElement("select", { is: r.is }) : s.createElement("select"), r.multiple ? o.multiple = !0 : r.size && (o.size = r.size);
									break;
								default: o = typeof r.is == "string" ? s.createElement(a, { is: r.is }) : s.createElement(a);
							}
						}
						o[at] = t, o[ot] = r;
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
						a: switch (Pd(o, a, r), a) {
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
						r && kc(t);
					}
				}
				return Pc(t), Ac(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && kc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = ce.current, Fi(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = Di, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[at] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || jd(e.nodeValue, n)), e || Mi(t, !0);
					} else e = Bd(e).createTextNode(r), e[at] = t, t.stateNode = e;
				}
				return Pc(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Fi(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[at] = t;
						} else Ii(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Pc(t), e = !1;
					} else n = Li(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (ro(t), t) : (ro(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return Pc(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = Fi(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[at] = t;
						} else Ii(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Pc(t), a = !1;
					} else a = Li(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (ro(t), t) : (ro(t), null);
				}
				return ro(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Mc(t, t.updateQueue), Pc(t), null);
			case 4: return de(), e === null && xd(t.stateNode.containerInfo), Pc(t), null;
			case 10: return Ui(t.type), Pc(t), null;
			case 19:
				if (ae(io), r = t.memoizedState, r === null) return Pc(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) Nc(r, !1);
					else {
						if (Ul !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = ao(e), o !== null) {
								for (t.flags |= 128, Nc(r, !1), e = o.updateQueue, t.updateQueue = e, Mc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) ai(n, e), n = n.sibling;
								return L(io, io.current & 1 | 2), G && Si(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && Ee() > eu && (t.flags |= 128, a = !0, Nc(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = ao(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Mc(t, e), Nc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !G) return Pc(t), null;
						} else 2 * Ee() - r.renderingStartTime > eu && n !== 536870912 && (t.flags |= 128, a = !0, Nc(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (Pc(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Ee(), e.sibling = null, n = io.current, L(io, a ? n & 1 | 2 : n & 1), G && Si(t, r.treeForkCount), e);
			case 22:
			case 23: return ro(t), Xa(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Pc(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Pc(t), n = t.updateQueue, n !== null && Mc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && ae(fa), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Ui(ta), Pc(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(i(156, t.tag));
	}
	function Ic(e, t) {
		switch (Ti(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Ui(ta), de(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return pe(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (ro(t), t.alternate === null) throw Error(i(340));
					Ii();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (ro(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					Ii();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return ae(io), null;
			case 4: return de(), null;
			case 10: return Ui(t.type), null;
			case 22:
			case 23: return ro(t), Xa(), e !== null && ae(fa), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Ui(ta), null;
			case 25: return null;
			default: return null;
		}
	}
	function Lc(e, t) {
		switch (Ti(t), t.tag) {
			case 3:
				Ui(ta), de();
				break;
			case 26:
			case 27:
			case 5:
				pe(t);
				break;
			case 4:
				de();
				break;
			case 31:
				t.memoizedState !== null && ro(t);
				break;
			case 13:
				ro(t);
				break;
			case 19:
				ae(io);
				break;
			case 10:
				Ui(t.type);
				break;
			case 22:
			case 23:
				ro(t), Xa(), e !== null && ae(fa);
				break;
			case 24: Ui(ta);
		}
	}
	function Rc(e, t) {
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
			Q(t, t.return, e);
		}
	}
	function zc(e, t, n) {
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
								Q(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Q(t, t.return, e);
		}
	}
	function Bc(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				Ga(t, n);
			} catch (t) {
				Q(e, e.return, t);
			}
		}
	}
	function Vc(e, t, n) {
		n.props = Hs(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Q(e, t, n);
		}
	}
	function Hc(e, t) {
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
			Q(e, t, n);
		}
	}
	function Uc(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) {
			if (typeof r == "function") try {
				r();
			} catch (n) {
				Q(e, t, n);
			} finally {
				e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
			}
			else if (typeof n == "function") try {
				n(null);
			} catch (n) {
				Q(e, t, n);
			}
			else n.current = null;
		}
	}
	function Wc(e) {
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
			Q(e, e.return, t);
		}
	}
	function Gc(e, t, n) {
		try {
			var r = e.stateNode;
			Fd(r, e.type, n, t), r[ot] = t;
		} catch (t) {
			Q(e, e.return, t);
		}
	}
	function Kc(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Zd(e.type) || e.tag === 4;
	}
	function qc(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Kc(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Zd(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Jc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Zt));
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (Jc(e, t, n), e = e.sibling; e !== null;) Jc(e, t, n), e = e.sibling;
	}
	function Yc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode), e = e.child, e !== null)) for (Yc(e, t, n), e = e.sibling; e !== null;) Yc(e, t, n), e = e.sibling;
	}
	function Xc(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Pd(t, r, n), t[at] = e, t[ot] = n;
		} catch (t) {
			Q(e, e.return, t);
		}
	}
	var Zc = !1, Qc = !1, $c = !1, el = typeof WeakSet == "function" ? WeakSet : Set, tl = null;
	function nl(e, t) {
		if (e = e.containerInfo, Rd = sp, e = xr(e), Sr(e)) {
			if ("selectionStart" in e) var n = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				n = (n = e.ownerDocument) && n.defaultView || window;
				var r = n.getSelection && n.getSelection();
				if (r && r.rangeCount !== 0) {
					n = r.anchorNode;
					var a = r.anchorOffset, o = r.focusNode;
					r = r.focusOffset;
					try {
						n.nodeType, o.nodeType;
					} catch {
						n = null;
						break a;
					}
					var s = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== n || a !== 0 && f.nodeType !== 3 || (c = s + a), f !== o || r !== 0 && f.nodeType !== 3 || (l = s + r), f.nodeType === 3 && (s += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === n && ++u === a && (c = s), p === o && ++d === r && (l = s), (m = f.nextSibling) !== null) break;
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
		}, sp = !1, tl = t; tl !== null;) if (t = tl, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, tl = e;
		else for (; tl !== null;) {
			switch (t = tl, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) a = e[n], a.ref.impl = a.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, a = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = Hs(n.type, a);
							e = r.getSnapshotBeforeUpdate(h, o), r.__reactInternalSnapshotBeforeUpdate = e;
						} catch (e) {
							Q(n, n.return, e);
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
				default: if (e & 1024) throw Error(i(163));
			}
			if (e = t.sibling, e !== null) {
				e.return = t.return, tl = e;
				break;
			}
			tl = t.return;
		}
	}
	function rl(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				vl(e, n), r & 4 && Rc(5, n);
				break;
			case 1:
				if (vl(e, n), r & 4) {
					if (e = n.stateNode, t === null) try {
						e.componentDidMount();
					} catch (e) {
						Q(n, n.return, e);
					}
					else {
						var i = Hs(n.type, t.memoizedProps);
						t = t.memoizedState;
						try {
							e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
						} catch (e) {
							Q(n, n.return, e);
						}
					}
				}
				r & 64 && Bc(n), r & 512 && Hc(n, n.return);
				break;
			case 3:
				if (vl(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						Ga(e, t);
					} catch (e) {
						Q(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && Xc(n);
			case 26:
			case 5:
				vl(e, n), t === null && r & 4 && Wc(n), r & 512 && Hc(n, n.return);
				break;
			case 12:
				vl(e, n);
				break;
			case 31:
				vl(e, n), r & 4 && ll(e, n);
				break;
			case 13:
				vl(e, n), r & 4 && ul(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = qu.bind(null, n), sf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || Zc, !r) {
					t = t !== null && t.memoizedState !== null || Qc, i = Zc;
					var a = Qc;
					Zc = r, (Qc = t) && !a ? bl(e, n, !!(n.subtreeFlags & 8772)) : vl(e, n), Zc = i, Qc = a;
				}
				break;
			case 30: break;
			default: vl(e, n);
		}
	}
	function il(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, il(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && pt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var al = null, ol = !1;
	function sl(e, t, n) {
		for (n = n.child; n !== null;) cl(e, t, n), n = n.sibling;
	}
	function cl(e, t, n) {
		if (Fe && typeof Fe.onCommitFiberUnmount == "function") try {
			Fe.onCommitFiberUnmount(Pe, n);
		} catch {}
		switch (n.tag) {
			case 26:
				Qc || Uc(n, t), sl(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				Qc || Uc(n, t);
				var r = al, i = ol;
				Zd(n.type) && (al = n.stateNode, ol = !1), sl(e, t, n), pf(n.stateNode), al = r, ol = i;
				break;
			case 5: Qc || Uc(n, t);
			case 6:
				if (r = al, i = ol, al = null, sl(e, t, n), al = r, ol = i, al !== null) {
					if (ol) try {
						(al.nodeType === 9 ? al.body : al.nodeName === "HTML" ? al.ownerDocument.body : al).removeChild(n.stateNode);
					} catch (e) {
						Q(n, t, e);
					}
					else try {
						al.removeChild(n.stateNode);
					} catch (e) {
						Q(n, t, e);
					}
				}
				break;
			case 18:
				al !== null && (ol ? (e = al, Qd(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Np(e)) : Qd(al, n.stateNode));
				break;
			case 4:
				r = al, i = ol, al = n.stateNode.containerInfo, ol = !0, sl(e, t, n), al = r, ol = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				zc(2, n, t), Qc || zc(4, n, t), sl(e, t, n);
				break;
			case 1:
				Qc || (Uc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Vc(n, t, r)), sl(e, t, n);
				break;
			case 21:
				sl(e, t, n);
				break;
			case 22:
				Qc = (r = Qc) || n.memoizedState !== null, sl(e, t, n), Qc = r;
				break;
			default: sl(e, t, n);
		}
	}
	function ll(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Np(e);
			} catch (e) {
				Q(t, t.return, e);
			}
		}
	}
	function ul(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Np(e);
		} catch (e) {
			Q(t, t.return, e);
		}
	}
	function dl(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new el()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new el()), t;
			default: throw Error(i(435, e.tag));
		}
	}
	function fl(e, t) {
		var n = dl(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Ju.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function pl(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var a = n[r], o = e, s = t, c = s;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (Zd(c.type)) {
							al = c.stateNode, ol = !1;
							break a;
						}
						break;
					case 5:
						al = c.stateNode, ol = !1;
						break a;
					case 3:
					case 4:
						al = c.stateNode.containerInfo, ol = !0;
						break a;
				}
				c = c.return;
			}
			if (al === null) throw Error(i(160));
			cl(o, s, a), al = null, ol = !1, o = a.alternate, o !== null && (o.return = null), a.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) hl(t, e), t = t.sibling;
	}
	var ml = null;
	function hl(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				pl(t, e), gl(e), r & 4 && (zc(3, e, e.return), Rc(3, e), zc(5, e, e.return));
				break;
			case 1:
				pl(t, e), gl(e), r & 512 && (Qc || n === null || Uc(n, n.return)), r & 64 && Zc && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var a = ml;
				if (pl(t, e), gl(e), r & 512 && (Qc || n === null || Uc(n, n.return)), r & 4) {
					var o = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) {
						if (r === null) {
							if (e.stateNode === null) {
								a: {
									r = e.type, n = e.memoizedProps, a = a.ownerDocument || a;
									b: switch (r) {
										case "title":
											o = a.getElementsByTagName("title")[0], (!o || o[ft] || o[at] || o.namespaceURI === "http://www.w3.org/2000/svg" || o.hasAttribute("itemprop")) && (o = a.createElement(r), a.head.insertBefore(o, a.querySelector("head > title"))), Pd(o, r, n), o[at] = e, vt(o), r = o;
											break a;
										case "link":
											var s = Vf("link", "href", a).get(r + (n.href || ""));
											if (s) {
												for (var c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && o.getAttribute("rel") === (n.rel == null ? null : n.rel) && o.getAttribute("title") === (n.title == null ? null : n.title) && o.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
													s.splice(c, 1);
													break b;
												}
											}
											o = a.createElement(r), Pd(o, r, n), a.head.appendChild(o);
											break;
										case "meta":
											if (s = Vf("meta", "content", a).get(r + (n.content || ""))) {
												for (c = 0; c < s.length; c++) if (o = s[c], o.getAttribute("content") === (n.content == null ? null : "" + n.content) && o.getAttribute("name") === (n.name == null ? null : n.name) && o.getAttribute("property") === (n.property == null ? null : n.property) && o.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && o.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
													s.splice(c, 1);
													break b;
												}
											}
											o = a.createElement(r), Pd(o, r, n), a.head.appendChild(o);
											break;
										default: throw Error(i(468, r));
									}
									o[at] = e, vt(o), r = o;
								}
								e.stateNode = r;
							} else Hf(a, e.type, e.stateNode);
						} else e.stateNode = If(a, r, e.memoizedProps);
					} else o === r ? r === null && e.stateNode !== null && Gc(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Hf(a, e.type, e.stateNode) : If(a, r, e.memoizedProps));
				}
				break;
			case 27:
				pl(t, e), gl(e), r & 512 && (Qc || n === null || Uc(n, n.return)), n !== null && r & 4 && Gc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (pl(t, e), gl(e), r & 512 && (Qc || n === null || Uc(n, n.return)), e.flags & 32) {
					a = e.stateNode;
					try {
						Ut(a, "");
					} catch (t) {
						Q(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (a = e.memoizedProps, Gc(e, a, n === null ? a : n.memoizedProps)), r & 1024 && ($c = !0);
				break;
			case 6:
				if (pl(t, e), gl(e), r & 4) {
					if (e.stateNode === null) throw Error(i(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						Q(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Bf = null, a = ml, ml = gf(t.containerInfo), pl(t, e), ml = a, gl(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Np(t.containerInfo);
				} catch (t) {
					Q(e, e.return, t);
				}
				$c && ($c = !1, _l(e));
				break;
			case 4:
				r = ml, ml = gf(e.stateNode.containerInfo), pl(t, e), gl(e), ml = r;
				break;
			case 12:
				pl(t, e), gl(e);
				break;
			case 31:
				pl(t, e), gl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, fl(e, r)));
				break;
			case 13:
				pl(t, e), gl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Ql = Ee()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, fl(e, r)));
				break;
			case 22:
				a = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = Zc, d = Qc;
				if (Zc = u || a, Qc = d || l, pl(t, e), Qc = d, Zc = u, gl(e), r & 8192) a: for (t = e.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, a && (n === null || l || Zc || Qc || yl(e)), n = null, t = e;;) {
					if (t.tag === 5 || t.tag === 26) {
						if (n === null) {
							l = n = t;
							try {
								if (o = l.stateNode, a) s = o.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none";
								else {
									c = l.stateNode;
									var f = l.memoizedProps.style, p = f != null && f.hasOwnProperty("display") ? f.display : null;
									c.style.display = p == null || typeof p == "boolean" ? "" : ("" + p).trim();
								}
							} catch (e) {
								Q(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = a ? "" : l.memoizedProps;
							} catch (e) {
								Q(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								a ? $d(m, !0) : $d(l.stateNode, !1);
							} catch (e) {
								Q(l, l.return, e);
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
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, fl(e, n))));
				break;
			case 19:
				pl(t, e), gl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, fl(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: pl(t, e), gl(e);
		}
	}
	function gl(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Kc(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var a = n.stateNode;
						Yc(e, qc(e), a);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && (Ut(o, ""), n.flags &= -33), Yc(e, qc(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						Jc(e, qc(e), s);
						break;
					default: throw Error(i(161));
				}
			} catch (t) {
				Q(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function _l(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			_l(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function vl(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) rl(e, t.alternate, t), t = t.sibling;
	}
	function yl(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					zc(4, t, t.return), yl(t);
					break;
				case 1:
					Uc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && Vc(t, t.return, n), yl(t);
					break;
				case 27: pf(t.stateNode);
				case 26:
				case 5:
					Uc(t, t.return), yl(t);
					break;
				case 22:
					t.memoizedState === null && yl(t);
					break;
				case 30:
					yl(t);
					break;
				default: yl(t);
			}
			e = e.sibling;
		}
	}
	function bl(e, t, n) {
		for (n = n && !!(t.subtreeFlags & 8772), t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					bl(i, a, n), Rc(4, a);
					break;
				case 1:
					if (bl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Q(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) Wa(c[i], s);
						} catch (e) {
							Q(r, r.return, e);
						}
					}
					n && o & 64 && Bc(a), Hc(a, a.return);
					break;
				case 27: Xc(a);
				case 26:
				case 5:
					bl(i, a, n), n && r === null && o & 4 && Wc(a), Hc(a, a.return);
					break;
				case 12:
					bl(i, a, n);
					break;
				case 31:
					bl(i, a, n), n && o & 4 && ll(i, a);
					break;
				case 13:
					bl(i, a, n), n && o & 4 && ul(i, a);
					break;
				case 22:
					a.memoizedState === null && bl(i, a, n), Hc(a, a.return);
					break;
				case 30: break;
				default: bl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function xl(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && ra(n));
	}
	function Sl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ra(e));
	}
	function Cl(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) wl(e, t, n, r), t = t.sibling;
	}
	function wl(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Cl(e, t, n, r), i & 2048 && Rc(9, t);
				break;
			case 1:
				Cl(e, t, n, r);
				break;
			case 3:
				Cl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && ra(e)));
				break;
			case 12:
				if (i & 2048) {
					Cl(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						Q(t, t.return, e);
					}
				} else Cl(e, t, n, r);
				break;
			case 31:
				Cl(e, t, n, r);
				break;
			case 13:
				Cl(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? Cl(e, t, n, r) : (a._visibility |= 2, Tl(e, t, n, r, !!(t.subtreeFlags & 10256) || !1)) : a._visibility & 2 ? Cl(e, t, n, r) : El(e, t), i & 2048 && xl(o, t);
				break;
			case 24:
				Cl(e, t, n, r), i & 2048 && Sl(t.alternate, t);
				break;
			default: Cl(e, t, n, r);
		}
	}
	function Tl(e, t, n, r, i) {
		for (i = i && (!!(t.subtreeFlags & 10256) || !1), t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Tl(a, o, s, c, i), Rc(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Tl(a, o, s, c, i)) : u._visibility & 2 ? Tl(a, o, s, c, i) : El(a, o), i && l & 2048 && xl(o.alternate, o);
					break;
				case 24:
					Tl(a, o, s, c, i), i && l & 2048 && Sl(o.alternate, o);
					break;
				default: Tl(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function El(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					El(n, r), i & 2048 && xl(r.alternate, r);
					break;
				case 24:
					El(n, r), i & 2048 && Sl(r.alternate, r);
					break;
				default: El(n, r);
			}
			t = t.sibling;
		}
	}
	var Dl = 8192;
	function Ol(e, t, n) {
		if (e.subtreeFlags & Dl) for (e = e.child; e !== null;) kl(e, t, n), e = e.sibling;
	}
	function kl(e, t, n) {
		switch (e.tag) {
			case 26:
				Ol(e, t, n), e.flags & Dl && e.memoizedState !== null && Gf(n, ml, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				Ol(e, t, n);
				break;
			case 3:
			case 4:
				var r = ml;
				ml = gf(e.stateNode.containerInfo), Ol(e, t, n), ml = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Dl, Dl = 16777216, Ol(e, t, n), Dl = r) : Ol(e, t, n));
				break;
			default: Ol(e, t, n);
		}
	}
	function Al(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function jl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				tl = r, Pl(r, e);
			}
			Al(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Ml(e), e = e.sibling;
	}
	function Ml(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				jl(e), e.flags & 2048 && zc(9, e, e.return);
				break;
			case 3:
				jl(e);
				break;
			case 12:
				jl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Nl(e)) : jl(e);
				break;
			default: jl(e);
		}
	}
	function Nl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				tl = r, Pl(r, e);
			}
			Al(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					zc(8, t, t.return), Nl(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Nl(t));
					break;
				default: Nl(t);
			}
			e = e.sibling;
		}
	}
	function Pl(e, t) {
		for (; tl !== null;) {
			var n = tl;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					zc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: ra(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, tl = r;
			else a: for (n = e; tl !== null;) {
				r = tl;
				var i = r.sibling, a = r.return;
				if (il(r), r === n) {
					tl = null;
					break a;
				}
				if (i !== null) {
					i.return = a, tl = i;
					break a;
				}
				tl = a;
			}
		}
	}
	var Fl = {
		getCacheForType: function(e) {
			var t = Yi(ta), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Yi(ta).controller.signal;
		}
	}, Il = typeof WeakMap == "function" ? WeakMap : Map, J = 0, Ll = null, Y = null, X = 0, Z = 0, Rl = null, zl = !1, Bl = !1, Vl = !1, Hl = 0, Ul = 0, Wl = 0, Gl = 0, Kl = 0, ql = 0, Jl = 0, Yl = null, Xl = null, Zl = !1, Ql = 0, $l = 0, eu = Infinity, tu = null, nu = null, ru = 0, iu = null, au = null, ou = 0, su = 0, cu = null, lu = null, uu = 0, du = null;
	function fu() {
		return J & 2 && X !== 0 ? X & -X : F.T === null ? nt() : ud();
	}
	function pu() {
		if (ql === 0) {
			if (!(X & 536870912) || G) {
				var e = He;
				He <<= 1, !(He & 3932160) && (He = 262144), ql = e;
			} else ql = 536870912;
		}
		return e = Za.current, e !== null && (e.flags |= 32), ql;
	}
	function mu(e, t, n) {
		(e === Ll && (Z === 2 || Z === 9) || e.cancelPendingCommit !== null) && (xu(e, 0), vu(e, X, ql, !1)), Xe(e, n), (!(J & 2) || e !== Ll) && (e === Ll && (!(J & 2) && (Gl |= n), Ul === 4 && vu(e, X, ql, !1)), nd(e));
	}
	function hu(e, t, n) {
		if (J & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || Ke(e, t), a = r ? ku(e, t) : Du(e, t, !0), o = r;
		do {
			if (a === 0) {
				Bl && !r && vu(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !_u(n)) {
				a = Du(e, t, !1), o = !1;
				continue;
			}
			if (a === 2) {
				if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
				else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
				if (s !== 0) {
					t = s;
					a: {
						var c = e;
						a = Yl;
						var l = c.current.memoizedState.isDehydrated;
						if (l && (xu(c, s).flags |= 256), s = Du(c, s, !1), s !== 2) {
							if (Vl && !l) {
								c.errorRecoveryDisabledLanes |= o, Gl |= o, a = 4;
								break a;
							}
							o = Xl, Xl = a, o !== null && (Xl === null ? Xl = o : Xl.push.apply(Xl, o));
						}
						a = s;
					}
					if (o = !1, a !== 2) continue;
				}
			}
			if (a === 1) {
				xu(e, 0), vu(e, t, 0, !0);
				break;
			}
			a: {
				switch (r = e, o = a, o) {
					case 0:
					case 1: throw Error(i(345));
					case 4: if ((t & 4194048) !== t) break;
					case 6:
						vu(r, t, ql, !zl);
						break a;
					case 2:
						Xl = null;
						break;
					case 3:
					case 5: break;
					default: throw Error(i(329));
				}
				if ((t & 62914560) === t && (a = Ql + 300 - Ee(), 10 < a)) {
					if (vu(r, t, ql, !zl), Ge(r, 0, !0) !== 0) break a;
					ou = t, r.timeoutHandle = Kd(gu.bind(null, r, n, Xl, tu, Zl, t, ql, Gl, Jl, zl, o, "Throttled", -0, 0), a);
					break a;
				}
				gu(r, n, Xl, tu, Zl, t, ql, Gl, Jl, zl, o, null, -0, 0);
			}
			break;
		} while (1);
		nd(e);
	}
	function gu(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: Zt
			}, kl(t, a, d);
			var m = (a & 62914560) === a ? Ql - Ee() : (a & 4194048) === a ? $l - Ee() : 0;
			if (m = qf(d, m), m !== null) {
				ou = a, e.cancelPendingCommit = m(Iu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), vu(e, a, o, !l);
				return;
			}
		}
		Iu(e, t, a, n, r, i, o, s, c);
	}
	function _u(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!gr(a(), i)) return !1;
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
	function vu(e, t, n, r) {
		t &= ~Kl, t &= ~Gl, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - Le(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && z(e, n, t);
	}
	function yu() {
		return J & 6 ? !0 : (rd(0, !1), !1);
	}
	function bu() {
		if (Y !== null) {
			if (Z === 0) var e = Y.return;
			else e = Y, Vi = Bi = null, wo(e), Ea = null, Da = 0, e = Y;
			for (; e !== null;) Lc(e.alternate, e), e = e.return;
			Y = null;
		}
	}
	function xu(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, qd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), ou = 0, bu(), Ll = e, Y = n = ii(e.current, null), X = t, Z = 0, Rl = null, zl = !1, Bl = Ke(e, t), Vl = !1, Jl = ql = Kl = Gl = Wl = Ul = 0, Xl = Yl = null, Zl = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - Le(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Hl = t, Jr(), n;
	}
	function Su(e, t) {
		K = null, F.H = Ps, t === ga || t === va ? (t = wa(), Z = 3) : t === _a ? (t = wa(), Z = 4) : Z = t === Qs ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Rl = t, Y === null && (Ul = 1, Ks(e, fi(t, e.current)));
	}
	function Cu() {
		var e = Za.current;
		return e === null ? !0 : (X & 4194048) === X ? Qa === null : (X & 62914560) === X || X & 536870912 ? e === Qa : !1;
	}
	function wu() {
		var e = F.H;
		return F.H = Ps, e === null ? Ps : e;
	}
	function Tu() {
		var e = F.A;
		return F.A = Fl, e;
	}
	function Eu() {
		Ul = 4, zl || (X & 4194048) !== X && Za.current !== null || (Bl = !0), !(Wl & 134217727) && !(Gl & 134217727) || Ll === null || vu(Ll, X, ql, !1);
	}
	function Du(e, t, n) {
		var r = J;
		J |= 2;
		var i = wu(), a = Tu();
		(Ll !== e || X !== t) && (tu = null, xu(e, t)), t = !1;
		var o = Ul;
		a: do
			try {
				if (Z !== 0 && Y !== null) {
					var s = Y, c = Rl;
					switch (Z) {
						case 8:
							bu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							Za.current === null && (t = !0);
							var l = Z;
							if (Z = 0, Rl = null, Nu(e, s, c, l), n && Bl) {
								o = 0;
								break a;
							}
							break;
						default: l = Z, Z = 0, Rl = null, Nu(e, s, c, l);
					}
				}
				Ou(), o = Ul;
				break;
			} catch (t) {
				Su(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, Vi = Bi = null, J = r, F.H = i, F.A = a, Y === null && (Ll = null, X = 0, Jr()), o;
	}
	function Ou() {
		for (; Y !== null;) ju(Y);
	}
	function ku(e, t) {
		var n = J;
		J |= 2;
		var r = wu(), a = Tu();
		Ll !== e || X !== t ? (tu = null, eu = Ee() + 500, xu(e, t)) : Bl = Ke(e, t);
		a: do
			try {
				if (Z !== 0 && Y !== null) {
					t = Y;
					var o = Rl;
					b: switch (Z) {
						case 1:
							Z = 0, Rl = null, Nu(e, t, o, 1);
							break;
						case 2:
						case 9:
							if (ba(o)) {
								Z = 0, Rl = null, Mu(t);
								break;
							}
							t = function() {
								Z !== 2 && Z !== 9 || Ll !== e || (Z = 7), nd(e);
							}, o.then(t, t);
							break a;
						case 3:
							Z = 7;
							break a;
						case 4:
							Z = 5;
							break a;
						case 7:
							ba(o) ? (Z = 0, Rl = null, Mu(t)) : (Z = 0, Rl = null, Nu(e, t, o, 7));
							break;
						case 5:
							var s = null;
							switch (Y.tag) {
								case 26: s = Y.memoizedState;
								case 5:
								case 27:
									var c = Y;
									if (s ? Wf(s) : c.stateNode.complete) {
										Z = 0, Rl = null;
										var l = c.sibling;
										if (l !== null) Y = l;
										else {
											var u = c.return;
											u === null ? Y = null : (Y = u, Pu(u));
										}
										break b;
									}
							}
							Z = 0, Rl = null, Nu(e, t, o, 5);
							break;
						case 6:
							Z = 0, Rl = null, Nu(e, t, o, 6);
							break;
						case 8:
							bu(), Ul = 6;
							break a;
						default: throw Error(i(462));
					}
				}
				Au();
				break;
			} catch (t) {
				Su(e, t);
			}
		while (1);
		return Vi = Bi = null, F.H = r, F.A = a, J = n, Y === null ? (Ll = null, X = 0, Jr(), Ul) : 0;
	}
	function Au() {
		for (; Y !== null && !we();) ju(Y);
	}
	function ju(e) {
		var t = Oc(e.alternate, e, Hl);
		e.memoizedProps = e.pendingProps, t === null ? Pu(e) : Y = t;
	}
	function Mu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = fc(n, t, t.pendingProps, t.type, void 0, X);
				break;
			case 11:
				t = fc(n, t, t.pendingProps, t.type.render, t.ref, X);
				break;
			case 5: wo(t);
			default: Lc(n, t), t = Y = ai(t, Hl), t = Oc(n, t, Hl);
		}
		e.memoizedProps = e.pendingProps, t === null ? Pu(e) : Y = t;
	}
	function Nu(e, t, n, r) {
		Vi = Bi = null, wo(t), Ea = null, Da = 0;
		var i = t.return;
		try {
			if (Zs(e, i, t, n, X)) {
				Ul = 1, Ks(e, fi(n, e.current)), Y = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw Y = i, t;
			Ul = 1, Ks(e, fi(n, e.current)), Y = null;
			return;
		}
		t.flags & 32768 ? (G || r === 1 ? e = !0 : Bl || X & 536870912 ? e = !1 : (zl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = Za.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Fu(t, e)) : Pu(t);
	}
	function Pu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Fu(t, zl);
				return;
			}
			e = t.return;
			var n = Fc(t.alternate, t, Hl);
			if (n !== null) {
				Y = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				Y = t;
				return;
			}
			Y = t = e;
		} while (t !== null);
		Ul === 0 && (Ul = 5);
	}
	function Fu(e, t) {
		do {
			var n = Ic(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, Y = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				Y = e;
				return;
			}
			Y = e = n;
		} while (e !== null);
		Ul = 6, Y = null;
	}
	function Iu(e, t, n, r, a, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			Vu();
		while (ru !== 0);
		if (J & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			if (o = t.lanes | t.childLanes, o |= qr, Ze(e, n, o, s, c, l), e === Ll && (Y = Ll = null, X = 0), au = t, iu = e, ou = n, su = o, cu = a, lu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Yu(Ae, function() {
				return Hu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
				r = F.T, F.T = null, a = I.p, I.p = 2, s = J, J |= 4;
				try {
					nl(e, t, n);
				} finally {
					J = s, I.p = a, F.T = r;
				}
			}
			ru = 1, Lu(), Ru(), zu();
		}
	}
	function Lu() {
		if (ru === 1) {
			ru = 0;
			var e = iu, t = au, n = !!(t.flags & 13878);
			if (t.subtreeFlags & 13878 || n) {
				n = F.T, F.T = null;
				var r = I.p;
				I.p = 2;
				var i = J;
				J |= 4;
				try {
					hl(t, e);
					var a = zd, o = xr(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && br(s.ownerDocument.documentElement, s)) {
						if (c !== null && Sr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = yr(s, h), v = yr(s, g);
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
					J = i, I.p = r, F.T = n;
				}
			}
			e.current = t, ru = 2;
		}
	}
	function Ru() {
		if (ru === 2) {
			ru = 0;
			var e = iu, t = au, n = !!(t.flags & 8772);
			if (t.subtreeFlags & 8772 || n) {
				n = F.T, F.T = null;
				var r = I.p;
				I.p = 2;
				var i = J;
				J |= 4;
				try {
					rl(e, t.alternate, t);
				} finally {
					J = i, I.p = r, F.T = n;
				}
			}
			ru = 3;
		}
	}
	function zu() {
		if (ru === 4 || ru === 3) {
			ru = 0, Te();
			var e = iu, t = au, n = ou, r = lu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? ru = 5 : (ru = 0, au = iu = null, Bu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (nu = null), tt(n), t = t.stateNode, Fe && typeof Fe.onCommitFiberRoot == "function") try {
				Fe.onCommitFiberRoot(Pe, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = F.T, i = I.p, I.p = 2, F.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					F.T = t, I.p = i;
				}
			}
			ou & 3 && Vu(), nd(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === du ? uu++ : (uu = 0, du = e) : uu = 0, rd(0, !1);
		}
	}
	function Bu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, ra(t)));
	}
	function Vu() {
		return Lu(), Ru(), zu(), Hu();
	}
	function Hu() {
		if (ru !== 5) return !1;
		var e = iu, t = su;
		su = 0;
		var n = tt(ou), r = F.T, a = I.p;
		try {
			I.p = 32 > n ? 32 : n, F.T = null, n = cu, cu = null;
			var o = iu, s = ou;
			if (ru = 0, au = iu = null, ou = 0, J & 6) throw Error(i(331));
			var c = J;
			if (J |= 4, Ml(o.current), wl(o, o.current, s, n), J = c, rd(0, !1), Fe && typeof Fe.onPostCommitFiberRoot == "function") try {
				Fe.onPostCommitFiberRoot(Pe, o);
			} catch {}
			return !0;
		} finally {
			I.p = a, F.T = r, Bu(e, t);
		}
	}
	function Uu(e, t, n) {
		t = fi(n, t), t = Js(e.stateNode, t, 2), e = Ra(e, t, 2), e !== null && (Xe(e, 2), nd(e));
	}
	function Q(e, t, n) {
		if (e.tag === 3) Uu(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				Uu(t, e, n);
				break;
			}
			if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (nu === null || !nu.has(r))) {
					e = fi(n, e), n = Ys(2), r = Ra(t, n, 2), r !== null && (Xs(n, r, t, e), Xe(r, 2), nd(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function Wu(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new Il();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (Vl = !0, i.add(n), e = Gu.bind(null, e, t, n), t.then(e, e));
	}
	function Gu(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, Ll === e && (X & n) === n && (Ul === 4 || Ul === 3 && (X & 62914560) === X && 300 > Ee() - Ql ? !(J & 2) && xu(e, 0) : Kl |= n, Jl === X && (Jl = 0)), nd(e);
	}
	function Ku(e, t) {
		t === 0 && (t = Je()), e = Zr(e, t), e !== null && (Xe(e, t), nd(e));
	}
	function qu(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), Ku(e, n);
	}
	function Ju(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, a = e.memoizedState;
				a !== null && (n = a.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(i(314));
		}
		r !== null && r.delete(t), Ku(e, n);
	}
	function Yu(e, t) {
		return Se(e, t);
	}
	var Xu = null, Zu = null, Qu = !1, $u = !1, ed = !1, td = 0;
	function nd(e) {
		e !== Zu && e.next === null && (Zu === null ? Xu = Zu = e : Zu = Zu.next = e), $u = !0, Qu || (Qu = !0, ld());
	}
	function rd(e, t) {
		if (!ed && $u) {
			ed = !0;
			do
				for (var n = !1, r = Xu; r !== null;) {
					if (!t) {
						if (e !== 0) {
							var i = r.pendingLanes;
							if (i === 0) var a = 0;
							else {
								var o = r.suspendedLanes, s = r.pingedLanes;
								a = (1 << 31 - Le(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, cd(r, a));
						} else a = X, a = Ge(r, r === Ll ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Ke(r, a) || (n = !0, cd(r, a));
					}
					r = r.next;
				}
			while (n);
			ed = !1;
		}
	}
	function id() {
		ad();
	}
	function ad() {
		$u = Qu = !1;
		var e = 0;
		td !== 0 && Gd() && (e = td);
		for (var t = Ee(), n = null, r = Xu; r !== null;) {
			var i = r.next, a = od(r, t);
			a === 0 ? (r.next = null, n === null ? Xu = i : n.next = i, i === null && (Zu = n)) : (n = r, (e !== 0 || a & 3) && ($u = !0)), r = i;
		}
		ru !== 0 && ru !== 5 || rd(e, !1), td !== 0 && (td = 0);
	}
	function od(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Le(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = qe(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = Ll, n = X, n = Ge(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Z === 2 || Z === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && Ce(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Ke(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && Ce(r), tt(n)) {
				case 2:
				case 8:
					n = ke;
					break;
				case 32:
					n = Ae;
					break;
				case 268435456:
					n = je;
					break;
				default: n = Ae;
			}
			return r = sd.bind(null, e), n = Se(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && Ce(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function sd(e, t) {
		if (ru !== 0 && ru !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Vu() && e.callbackNode !== n) return null;
		var r = X;
		return r = Ge(e, e === Ll ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (hu(e, r, t), od(e, Ee()), e.callbackNode != null && e.callbackNode === n ? sd.bind(null, e) : null);
	}
	function cd(e, t) {
		if (Vu()) return null;
		hu(e, t, !0);
	}
	function ld() {
		Yd(function() {
			J & 6 ? Se(Oe, id) : ad();
		});
	}
	function ud() {
		if (td === 0) {
			var e = oa;
			e === 0 && (e = Ve, Ve <<= 1, !(Ve & 261888) && (Ve = 256)), td = e;
		}
		return td;
	}
	function dd(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Xt("" + e);
	}
	function fd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function pd(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = dd((i[ot] || null).action), o = r.submitter;
			o && (t = (t = o[ot] || null) ? dd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new yn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (td !== 0) {
								var e = o ? fd(i, o) : new FormData(i);
								bs(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? fd(i, o) : new FormData(i), bs(n, {
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
	for (var md = 0; md < Hr.length; md++) {
		var hd = Hr[md];
		Ur(hd.toLowerCase(), "on" + (hd[0].toUpperCase() + hd.slice(1)));
	}
	Ur(Pr, "onAnimationEnd"), Ur(Fr, "onAnimationIteration"), Ur(Ir, "onAnimationStart"), Ur("dblclick", "onDoubleClick"), Ur("focusin", "onFocus"), Ur("focusout", "onBlur"), Ur(Lr, "onTransitionRun"), Ur(Rr, "onTransitionStart"), Ur(zr, "onTransitionCancel"), Ur(Br, "onTransitionEnd"), St("onMouseEnter", ["mouseout", "mouseover"]), St("onMouseLeave", ["mouseout", "mouseover"]), St("onPointerEnter", ["pointerout", "pointerover"]), St("onPointerLeave", ["pointerout", "pointerover"]), xt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), xt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), xt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), xt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), xt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), xt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var gd = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), _d = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(gd));
	function vd(e, t) {
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
						Wr(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Wr(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function $(e, t) {
		var n = t[ct];
		n === void 0 && (n = t[ct] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Sd(t, e, 2, !1), n.add(r));
	}
	function yd(e, t, n) {
		var r = 0;
		t && (r |= 4), Sd(n, e, r, t);
	}
	var bd = "_reactListening" + Math.random().toString(36).slice(2);
	function xd(e) {
		if (!e[bd]) {
			e[bd] = !0, yt.forEach(function(t) {
				t !== "selectionchange" && (_d.has(t) || yd(t, !1, e), yd(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[bd] || (t[bd] = !0, yd("selectionchange", !1, t));
		}
	}
	function Sd(e, t, n, r) {
		switch (mp(t)) {
			case 2:
				var i = cp;
				break;
			case 8:
				i = lp;
				break;
			default: i = up;
		}
		n = i.bind(null, t, n, e), i = void 0, !cn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function Cd(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var s = r.tag;
			if (s === 3 || s === 4) {
				var c = r.stateNode.containerInfo;
				if (c === i) break;
				if (s === 4) for (s = r.return; s !== null;) {
					var l = s.tag;
					if ((l === 3 || l === 4) && s.stateNode.containerInfo === i) return;
					s = s.return;
				}
				for (; c !== null;) {
					if (s = mt(c), s === null) return;
					if (l = s.tag, l === 5 || l === 6 || l === 26 || l === 27) {
						r = a = s;
						continue a;
					}
					c = c.parentNode;
				}
			}
			r = r.return;
		}
		an(function() {
			var r = a, i = $t(n), s = [];
			a: {
				var c = Vr.get(e);
				if (c !== void 0) {
					var l = yn, u = e;
					switch (e) {
						case "keypress": if (mn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Nn;
							break;
						case "focusin":
							u = "focus", l = W;
							break;
						case "focusout":
							u = "blur", l = W;
							break;
						case "beforeblur":
						case "afterblur":
							l = W;
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
							l = wn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							l = U;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Fn;
							break;
						case Pr:
						case Fr:
						case Ir:
							l = Tn;
							break;
						case Br:
							l = In;
							break;
						case "scroll":
						case "scrollend":
							l = bn;
							break;
						case "wheel":
							l = Ln;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = En;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = Pn;
							break;
						case "toggle":
						case "beforetoggle": l = Rn;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = on(m, p), g != null && d.push(wd(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (c = new l(c, u, null, n, i), s.push({
						event: c,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== Qt && (u = n.relatedTarget || n.fromElement) && (mt(u) || u[st])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? mt(u) : null, u !== null && (f = o(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = wn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Pn, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : gt(l), h = u == null ? c : gt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, mt(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
							for (d = Ed, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
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
						l !== null && Dd(s, c, l, d, !1), u !== null && f !== null && Dd(s, f, u, d, !0);
					}
				}
				a: {
					if (c = r ? gt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = ir;
					else if (Qn(c)) {
						if (ar) v = mr;
						else {
							v = fr;
							var y = dr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && qt(r.elementType) && (v = ir) : v = pr;
					if (v && (v = v(e, r))) {
						$n(s, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && B(c, "number", c.value);
				}
				switch (y = r ? gt(r) : window, e) {
					case "focusin":
						(Qn(y) || y.contentEditable === "true") && (wr = y, Tr = r, Er = null);
						break;
					case "focusout":
						Er = Tr = wr = null;
						break;
					case "mousedown":
						Dr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Dr = !1, Or(s, n, i);
						break;
					case "selectionchange": if (Cr) break;
					case "keydown":
					case "keyup": Or(s, n, i);
				}
				var b;
				if (Bn) b: {
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
				else Jn ? Kn(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (Un && n.locale !== "ko" && (Jn || x !== "onCompositionStart" ? x === "onCompositionEnd" && Jn && (b = pn()) : (un = i, dn = "value" in un ? un.value : un.textContent, Jn = !0)), y = Td(r, x), 0 < y.length && (x = new Dn(x, e, null, n, i), s.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = qn(n), b !== null && (x.data = b)))), (b = Hn ? Yn(e, n) : Xn(e, n)) && (x = Td(r, "onBeforeInput"), 0 < x.length && (y = new Dn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: y,
					listeners: x
				}), y.data = b)), pd(s, e, r, n, i);
			}
			vd(s, t);
		});
	}
	function wd(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Td(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = on(e, n), i != null && r.unshift(wd(e, i, a)), i = on(e, t), i != null && r.push(wd(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Ed(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Dd(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = on(n, a), l != null && o.unshift(wd(n, l, c))) : i || (l = on(n, a), l != null && o.push(wd(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var Od = /\r\n?/g, kd = /\u0000|\uFFFD/g;
	function Ad(e) {
		return (typeof e == "string" ? e : "" + e).replace(Od, "\n").replace(kd, "");
	}
	function jd(e, t) {
		return t = Ad(t), Ad(e) === t;
	}
	function Md(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || Ut(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && Ut(e, "" + r);
				break;
			case "className":
				Ot(e, "class", r);
				break;
			case "tabIndex":
				Ot(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Ot(e, n, r);
				break;
			case "style":
				Kt(e, r, o);
				break;
			case "data": if (t !== "object") {
				Ot(e, "data", r);
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
				r = Xt("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && Md(e, t, "name", a.name, a, null), Md(e, t, "formEncType", a.formEncType, a, null), Md(e, t, "formMethod", a.formMethod, a, null), Md(e, t, "formTarget", a.formTarget, a, null)) : (Md(e, t, "encType", a.encType, a, null), Md(e, t, "method", a.method, a, null), Md(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = Xt("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = Zt);
				break;
			case "onScroll":
				r != null && $("scroll", e);
				break;
			case "onScrollEnd":
				r != null && $("scrollend", e);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
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
				n = Xt("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
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
				$("beforetoggle", e), $("toggle", e), Dt(e, "popover", r);
				break;
			case "xlinkActuate":
				kt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				kt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				kt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				kt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				kt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				kt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				kt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				kt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				kt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				Dt(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Jt.get(n) || n, Dt(e, n, r));
		}
	}
	function Nd(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				Kt(e, r, o);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(i(61));
					if (n = r.__html, n != null) {
						if (a.children != null) throw Error(i(60));
						e.innerHTML = n;
					}
				}
				break;
			case "children":
				typeof r == "string" ? Ut(e, r) : (typeof r == "number" || typeof r == "bigint") && Ut(e, "" + r);
				break;
			case "onScroll":
				r != null && $("scroll", e);
				break;
			case "onScrollEnd":
				r != null && $("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = Zt);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!bt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), t = n.slice(2, a ? n.length - 7 : void 0), o = e[ot] || null, o = o == null ? null : o[n], typeof o == "function" && e.removeEventListener(t, o, a), typeof r == "function")) {
					typeof o != "function" && o !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, a);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : Dt(e, n, r);
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
				$("error", e), $("load", e);
				var r = !1, a = !1, o;
				for (o in n) if (n.hasOwnProperty(o)) {
					var s = n[o];
					if (s != null) switch (o) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							a = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(i(137, t));
						default: Md(e, t, o, s, n, null);
					}
				}
				a && Md(e, t, "srcSet", n.srcSet, n, null), r && Md(e, t, "src", n.src, n, null);
				return;
			case "input":
				$("invalid", e);
				var c = o = s = a = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							a = d;
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
							if (d != null) throw Error(i(137, t));
							break;
						default: Md(e, t, r, d, n, null);
					}
				}
				zt(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in $("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: Md(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Bt(e, !!r, n, !0) : Bt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in $("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						a = c;
						break;
					case "children":
						o = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(i(91));
						break;
					default: Md(e, t, s, c, n, null);
				}
				Ht(e, r, a, o);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: Md(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				$("beforetoggle", e), $("toggle", e), $("cancel", e), $("close", e);
				break;
			case "iframe":
			case "object":
				$("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < gd.length; r++) $(gd[r], e);
				break;
			case "image":
				$("error", e), $("load", e);
				break;
			case "details":
				$("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": $("error", e), $("load", e);
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
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: Md(e, t, u, r, n, null);
				}
				return;
			default: if (qt(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && Nd(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && Md(e, t, c, r, n, null));
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
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || Md(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							o = m;
							break;
						case "name":
							a = m;
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
							if (m != null) throw Error(i(137, t));
							break;
						default: m !== f && Md(e, t, p, m, r, f);
					}
				}
				Rt(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || Md(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						p = o;
						break;
					case "defaultValue":
						c = o;
						break;
					case "multiple": s = o;
					default: o !== l && Md(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Bt(e, !!n, n ? [] : "", !1) : Bt(e, !!n, t, !0)) : Bt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: Md(e, t, c, null, r, a);
				}
				for (s in r) if (a = r[s], o = n[s], r.hasOwnProperty(s) && (a != null || o != null)) switch (s) {
					case "value":
						p = a;
						break;
					case "defaultValue":
						m = a;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (a != null) throw Error(i(91));
						break;
					default: a !== o && Md(e, t, s, a, r, o);
				}
				Vt(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: Md(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: Md(e, t, l, p, r, m);
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
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && Md(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(i(137, t));
						break;
					default: Md(e, t, u, p, r, m);
				}
				return;
			default: if (qt(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && Nd(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || Nd(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && Md(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || Md(e, t, f, p, r, m);
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
						a[ft] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
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
					ef(n), pt(n);
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
			} else if (!e[ft]) switch (t) {
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
				if (e = t.documentElement, !e) throw Error(i(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(i(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(i(454));
				return e;
			default: throw Error(i(451));
		}
	}
	function pf(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		pt(e);
	}
	var mf = /* @__PURE__ */ new Map(), hf = /* @__PURE__ */ new Set();
	function gf(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var _f = I.d;
	I.d = {
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
		var e = _f.f(), t = yu();
		return e || t;
	}
	function yf(e) {
		var t = ht(e);
		t !== null && t.tag === 5 && t.type === "form" ? Ss(t) : _f.r(e);
	}
	var bf = typeof document > "u" ? null : document;
	function xf(e, t, n) {
		var r = bf;
		if (r && typeof t == "string" && t) {
			var i = Lt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), hf.has(i) || (hf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Pd(t, "link", e), vt(t), r.head.appendChild(t)));
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
			var i = "link[rel=\"preload\"][as=\"" + Lt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Lt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Lt(n.imageSizes) + "\"]")) : i += "[href=\"" + Lt(e) + "\"]";
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
			}, n), mf.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(jf(a)) || t === "script" && r.querySelector(Ff(a)) || (t = r.createElement("link"), Pd(t, "link", e), vt(t), r.head.appendChild(t)));
		}
	}
	function Tf(e, t) {
		_f.m(e, t);
		var n = bf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Lt(r) + "\"][href=\"" + Lt(e) + "\"]", a = i;
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
				r = n.createElement("link"), Pd(r, "link", e), vt(r), n.head.appendChild(r);
			}
		}
	}
	function Ef(e, t, n) {
		_f.S(e, t, n);
		var r = bf;
		if (r && e) {
			var i = _t(r).hoistableStyles, a = Af(e);
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
					vt(c), Pd(c, "link", e), c._p = new Promise(function(e, t) {
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
			var r = _t(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), vt(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
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
			var r = _t(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), vt(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function kf(e, t, n, r) {
		var a = (a = ce.current) ? gf(a) : null;
		if (!a) throw Error(i(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Af(n.href), n = _t(a).hoistableStyles, r = n.get(t), r || (r = {
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
					var o = _t(a).hoistableStyles, s = o.get(e);
					if (s || (a = a.ownerDocument || a, s = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, o.set(e, s), (o = a.querySelector(jf(e))) && !o._p && (s.instance = o, s.state.loading = 5), mf.has(e) || (n = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, mf.set(e, n), o || Nf(a, e, n, s.state))), t && r === null) throw Error(i(528, ""));
					return s;
				}
				if (t && r !== null) throw Error(i(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Pf(n), n = _t(a).hoistableScripts, r = n.get(t), r || (r = {
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
			default: throw Error(i(444, e));
		}
	}
	function Af(e) {
		return "href=\"" + Lt(e) + "\"";
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
		}), Pd(t, "link", n), vt(t), e.head.appendChild(t));
	}
	function Pf(e) {
		return "[src=\"" + Lt(e) + "\"]";
	}
	function Ff(e) {
		return "script[async]" + e;
	}
	function If(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Lt(n.href) + "\"]");
				if (r) return t.instance = r, vt(r), r;
				var a = h({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), vt(r), Pd(r, "style", a), Lf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				a = Af(n.href);
				var o = e.querySelector(jf(a));
				if (o) return t.state.loading |= 4, t.instance = o, vt(o), o;
				r = Mf(n), (a = mf.get(a)) && Rf(r, a), o = (e.ownerDocument || e).createElement("link"), vt(o);
				var s = o;
				return s._p = new Promise(function(e, t) {
					s.onload = e, s.onerror = t;
				}), Pd(o, "link", r), t.state.loading |= 4, Lf(o, n.precedence, e), t.instance = o;
			case "script": return o = Pf(n.src), (a = e.querySelector(Ff(o))) ? (t.instance = a, vt(a), a) : (r = n, (a = mf.get(o)) && (r = h({}, n), zf(r, a)), e = e.ownerDocument || e, a = e.createElement("script"), vt(a), Pd(a, "link", r), e.head.appendChild(a), t.instance = a);
			case "void": return null;
			default: throw Error(i(443, t.type));
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
			if (!(a[ft] || a[at] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
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
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Jf.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, vt(a);
					return;
				}
				a = t.ownerDocument || t, r = Mf(r), (i = mf.get(i)) && Rf(r, i), a = a.createElement("link"), vt(a);
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
		_currentValue: te,
		_currentValue2: te,
		_threadCount: 0
	};
	function $f(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Ye(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Ye(0), this.hiddenUpdates = Ye(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new $f(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = ni(3, null, null, t), e.current = a, a.stateNode = e, t = na(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Fa(a), e;
	}
	function tp(e) {
		return e ? (e = ei, e) : ei;
	}
	function np(e, t, n, r, i, a) {
		i = tp(i), r.context === null ? r.context = i : r.pendingContext = i, r = La(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Ra(e, r, t), n !== null && (mu(n, e, t), za(n, e, t));
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
			var t = Zr(e, 67108864);
			t !== null && mu(t, e, 67108864), ip(e, 67108864);
		}
	}
	function op(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = fu();
			t = et(t);
			var n = Zr(e, t);
			n !== null && mu(n, e, t), ip(e, t);
		}
	}
	var sp = !0;
	function cp(e, t, n, r) {
		var i = F.T;
		F.T = null;
		var a = I.p;
		try {
			I.p = 2, up(e, t, n, r);
		} finally {
			I.p = a, F.T = i;
		}
	}
	function lp(e, t, n, r) {
		var i = F.T;
		F.T = null;
		var a = I.p;
		try {
			I.p = 8, up(e, t, n, r);
		} finally {
			I.p = a, F.T = i;
		}
	}
	function up(e, t, n, r) {
		if (sp) {
			var i = dp(r);
			if (i === null) Cd(e, t, r, fp, n), Cp(e, r);
			else if (Tp(i, e, t, n, r)) r.stopPropagation();
			else if (Cp(e, r), t & 4 && -1 < Sp.indexOf(e)) {
				for (; i !== null;) {
					var a = ht(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = We(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Le(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									nd(a), !(J & 6) && (eu = Ee() + 500, rd(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = Zr(a, 2), s !== null && mu(s, a, 2), yu(), ip(a, 2);
					}
					if (a = dp(r), a === null && Cd(e, t, r, fp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else Cd(e, t, r, null, n);
		}
	}
	function dp(e) {
		return e = $t(e), pp(e);
	}
	var fp = null;
	function pp(e) {
		if (fp = null, e = mt(e), e !== null) {
			var t = o(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = s(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = c(t), e !== null) return e;
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
			case "message": switch (De()) {
				case Oe: return 2;
				case ke: return 8;
				case Ae:
				case R: return 32;
				case je: return 268435456;
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
		}, t !== null && (t = ht(t), t !== null && ap(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
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
		var t = mt(e.target);
		if (t !== null) {
			var n = o(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = s(n), t !== null) {
						e.blockedOn = t, rt(e.priority, function() {
							op(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = c(n), t !== null) {
						e.blockedOn = t, rt(e.priority, function() {
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
				Qt = r, n.target.dispatchEvent(r), Qt = null;
			} else return t = ht(n), t !== null && ap(t), e.blockedOn = n, !1;
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
				var a = ht(n);
				a !== null && (e.splice(t, 3), t -= 3, bs(a, {
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
			var i = n[r], a = n[r + 1], o = i[ot] || null;
			if (typeof a == "function") o || Mp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[ot] || null) s = o.formAction;
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
		if (t === null) throw Error(i(409));
		var n = t.current;
		np(n, fu(), e, t, null, null);
	}, Ip.prototype.unmount = Fp.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			np(e.current, 2, null, e, null, null), yu(), t[st] = null;
		}
	};
	function Ip(e) {
		this._internalRoot = e;
	}
	Ip.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = nt();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < xp.length && t !== 0 && t < xp[n].priority; n++);
			xp.splice(n, 0, e), n === 0 && Ep(e);
		}
	};
	var Lp = n.version;
	if (Lp !== "19.2.8") throw Error(i(527, Lp, "19.2.8"));
	I.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var Rp = {
		bundleType: 0,
		version: "19.2.8",
		rendererPackageName: "react-dom",
		currentDispatcherRef: F,
		reconcilerVersion: "19.2.8"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!zp.isDisabled && zp.supportsFiber) try {
			Pe = zp.inject(Rp), Fe = zp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Us, s = Ws, c = Gs;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = ep(e, 1, !1, null, null, n, r, null, o, s, c, Pp), e[st] = t.current, xd(e), new Fp(t);
	};
})), g = /* @__PURE__ */ o(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = h();
})), _ = u(), v = g();
function y(e) {
	"@babel/helpers - typeof";
	return y = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, y(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPrimitive.js
function b(e, t) {
	if (y(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (y(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPropertyKey.js
function x(e) {
	var t = b(e, "string");
	return y(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/defineProperty.js
function S(e, t, n) {
	return (t = x(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
//#region src/api.ts
var C = (e) => /^1(?:\.|$)/.test(e), w = class extends Error {
	constructor(e, t, n) {
		super(e), S(this, "code", void 0), S(this, "status", void 0), this.code = t, this.status = n, this.name = "ApiError";
	}
}, T = class {
	constructor(e) {
		S(this, "config", void 0), S(this, "base", void 0), S(this, "uploadStorageKey", "sofinder.uploadSessions.v1"), this.config = e, this.base = e.apiBase.replace(/\/config$/, "");
	}
	async configData() {
		let e = await this.request("/config");
		if (!C(e.apiVersion)) throw new w(`SoFinder UI requires API 1.x; server reported ${e.apiVersion || "an unknown version"}.`, "incompatible_api_version", 426);
		return e;
	}
	securityStatus() {
		return this.request("/security/status");
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
					t(new w(`Request failed (${n.status})`, "invalid_response", n.status));
					return;
				}
				if (n.status < 200 || n.status >= 300 || !i.success || !i.data) {
					t(new w(i.error?.message || `Request failed (${n.status})`, i.error?.code || "upload_failed", n.status));
					return;
				}
				r.onProgress?.(100), e(i.data);
			}), n.addEventListener("error", () => {
				o(), t(new w("The upload failed because of a network error.", "network_error", 0));
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
				if (!(i instanceof w) || i.status !== 404) throw i;
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
				if (!d.ok || !f.success || !f.data) throw new w(f.error?.message || `Request failed (${d.status})`, f.error?.code || "upload_failed", d.status);
				if (r.onProgress?.(Math.round((o + 1) / a * 100)), this.savePendingUpload({
					...c,
					updatedAt: Date.now()
				}), f.data.complete && f.data.entry) return this.removePendingUpload(s), { entry: f.data.entry };
			}
			throw new w("The chunk upload did not complete.", "chunk_incomplete", 500);
		} catch (e) {
			throw e instanceof w && e.status >= 400 && e.status < 500 && this.removePendingUpload(s), e;
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
			throw new w(e.error?.message || `Request failed (${n.status})`, e.error?.code || "archive_failed", n.status);
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
		if (!r.ok || !i.success || !i.data) throw new w(i.error?.message || `Request failed (${r.status})`, i.error?.code || "request_failed", r.status);
		return i.data;
	}
}, E = {
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
}, D = {
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
}, O = {
	...E,
	"zh-tw": D
}, ee = (e) => (t) => O[e][t], k = /* @__PURE__ */ o(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), A = (/* @__PURE__ */ o(((e, t) => {
	t.exports = k();
})))(), j = {
	"add-folder": /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("path", { d: "M3 6.5h6l2 2h10v10.5H3z" }), /* @__PURE__ */ (0, A.jsx)("path", { d: "M12 11v6M9 14h6" })] }),
	upload: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("path", { d: "M12 16V4M7.5 8.5 12 4l4.5 4.5" }), /* @__PURE__ */ (0, A.jsx)("path", { d: "M4 15v5h16v-5" })] }),
	select: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("rect", {
		x: "4",
		y: "4",
		width: "16",
		height: "16",
		rx: "3"
	}), /* @__PURE__ */ (0, A.jsx)("path", { d: "m8 12 3 3 5-6" })] }),
	rename: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("path", { d: "m4 20 4.5-1 9.8-9.8-3.5-3.5L5 15.5z" }), /* @__PURE__ */ (0, A.jsx)("path", { d: "m13.8 6.8 3.5 3.5" })] }),
	copy: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("rect", {
		x: "8",
		y: "8",
		width: "12",
		height: "12",
		rx: "2"
	}), /* @__PURE__ */ (0, A.jsx)("path", { d: "M16 8V4H4v12h4" })] }),
	move: /* @__PURE__ */ (0, A.jsx)(A.Fragment, { children: /* @__PURE__ */ (0, A.jsx)("path", { d: "M5 12h14M14 7l5 5-5 5" }) }),
	delete: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("path", { d: "M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" }), /* @__PURE__ */ (0, A.jsx)("path", { d: "M10 11v5M14 11v5" })] }),
	trash: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("path", { d: "M5 8h14l-1 12H6zM8 8V5h8v3" }), /* @__PURE__ */ (0, A.jsx)("path", { d: "M9.5 12v4M14.5 12v4" })] }),
	refresh: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("path", { d: "M19 8a7 7 0 1 0 1 7" }), /* @__PURE__ */ (0, A.jsx)("path", { d: "M19 3v5h-5" })] }),
	settings: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "3"
	}), /* @__PURE__ */ (0, A.jsx)("path", { d: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" })] }),
	security: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("path", { d: "M12 3 5 6v5c0 4.6 2.9 8 7 10 4.1-2 7-5.4 7-10V6z" }), /* @__PURE__ */ (0, A.jsx)("path", { d: "m9 12 2 2 4-5" })] }),
	grid: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
		/* @__PURE__ */ (0, A.jsx)("rect", {
			x: "4",
			y: "4",
			width: "6",
			height: "6",
			rx: "1"
		}),
		/* @__PURE__ */ (0, A.jsx)("rect", {
			x: "14",
			y: "4",
			width: "6",
			height: "6",
			rx: "1"
		}),
		/* @__PURE__ */ (0, A.jsx)("rect", {
			x: "4",
			y: "14",
			width: "6",
			height: "6",
			rx: "1"
		}),
		/* @__PURE__ */ (0, A.jsx)("rect", {
			x: "14",
			y: "14",
			width: "6",
			height: "6",
			rx: "1"
		})
	] }),
	list: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
		/* @__PURE__ */ (0, A.jsx)("path", { d: "M9 6h11M9 12h11M9 18h11" }),
		/* @__PURE__ */ (0, A.jsx)("circle", {
			cx: "5",
			cy: "6",
			r: "1"
		}),
		/* @__PURE__ */ (0, A.jsx)("circle", {
			cx: "5",
			cy: "12",
			r: "1"
		}),
		/* @__PURE__ */ (0, A.jsx)("circle", {
			cx: "5",
			cy: "18",
			r: "1"
		})
	] }),
	more: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
		/* @__PURE__ */ (0, A.jsx)("circle", {
			cx: "5",
			cy: "12",
			r: "1.2",
			fill: "currentColor",
			stroke: "none"
		}),
		/* @__PURE__ */ (0, A.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "1.2",
			fill: "currentColor",
			stroke: "none"
		}),
		/* @__PURE__ */ (0, A.jsx)("circle", {
			cx: "19",
			cy: "12",
			r: "1.2",
			fill: "currentColor",
			stroke: "none"
		})
	] }),
	archive: /* @__PURE__ */ (0, A.jsx)(A.Fragment, { children: /* @__PURE__ */ (0, A.jsx)("path", { d: "M4 7h16v13H4zM3 4h18v3H3zM9 11h6" }) }),
	favorite: /* @__PURE__ */ (0, A.jsx)("path", { d: "m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" }),
	tags: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("path", { d: "M4 5v6l8 8 7-7-8-8H5z" }), /* @__PURE__ */ (0, A.jsx)("circle", {
		cx: "8",
		cy: "8",
		r: "1"
	})] }),
	"rotate-left": /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("path", { d: "M7 8H3V4" }), /* @__PURE__ */ (0, A.jsx)("path", { d: "M4 8a8 8 0 1 1 1 9" })] }),
	"rotate-right": /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("path", { d: "M17 8h4V4" }), /* @__PURE__ */ (0, A.jsx)("path", { d: "M20 8a8 8 0 1 0-1 9" })] }),
	resize: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("path", { d: "M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" }), /* @__PURE__ */ (0, A.jsx)("path", { d: "m9 9 6 6M15 9l-6 6" })] }),
	crop: /* @__PURE__ */ (0, A.jsx)("path", { d: "M7 3v14a2 2 0 0 0 2 2h12M3 7h14a2 2 0 0 1 2 2v12" }),
	sort: /* @__PURE__ */ (0, A.jsx)(A.Fragment, { children: /* @__PURE__ */ (0, A.jsx)("path", { d: "M8 5v14M5 8l3-3 3 3M16 19V5M13 16l3 3 3-3" }) }),
	search: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("circle", {
		cx: "10.5",
		cy: "10.5",
		r: "6.5"
	}), /* @__PURE__ */ (0, A.jsx)("path", { d: "m16 16 4 4" })] }),
	close: /* @__PURE__ */ (0, A.jsx)("path", { d: "m6 6 12 12M18 6 6 18" }),
	add: /* @__PURE__ */ (0, A.jsx)("path", { d: "M12 5v14M5 12h14" }),
	history: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
		/* @__PURE__ */ (0, A.jsx)("path", { d: "M5 7H2V4" }),
		/* @__PURE__ */ (0, A.jsx)("path", { d: "M3 7a9 9 0 1 1 0 10" }),
		/* @__PURE__ */ (0, A.jsx)("path", { d: "M12 7v5l3 2" })
	] }),
	"chevron-left": /* @__PURE__ */ (0, A.jsx)("path", { d: "m15 5-7 7 7 7" }),
	"chevron-right": /* @__PURE__ */ (0, A.jsx)("path", { d: "m9 5 7 7-7 7" }),
	"chevron-down": /* @__PURE__ */ (0, A.jsx)("path", { d: "m5 9 7 7 7-7" })
};
function M({ name: e }) {
	return /* @__PURE__ */ (0, A.jsx)("svg", {
		className: "sf-ui-icon",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		focusable: "false",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: j[e]
	});
}
//#endregion
//#region src/components/Modal.tsx
function N({ title: e, closeLabel: t, onClose: n, children: r, footer: i, className: a = "" }) {
	let o = (0, _.useRef)(null), s = (0, _.useRef)(`sf-dialog-${Math.random().toString(36).slice(2)}`);
	return (0, _.useEffect)(() => {
		let e = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return (o.current?.querySelector("[autofocus],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[href],[tabindex]:not([tabindex='-1'])"))?.focus(), () => e?.focus();
	}, []), /* @__PURE__ */ (0, A.jsx)("div", {
		className: "sf-modal-backdrop",
		role: "presentation",
		onMouseDown: (e) => {
			e.target === e.currentTarget && n();
		},
		children: /* @__PURE__ */ (0, A.jsxs)("section", {
			ref: o,
			className: `sf-modal ${a}`,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": s.current,
			onKeyDown: (e) => {
				if (e.key === "Escape") {
					e.preventDefault(), n();
					return;
				}
				if (e.key !== "Tab" || !o.current) return;
				let t = Array.from(o.current.querySelectorAll("button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[href],[tabindex]:not([tabindex='-1'])"));
				if (t.length === 0) return;
				let r = t[0], i = t[t.length - 1];
				e.shiftKey && document.activeElement === r ? (e.preventDefault(), i.focus()) : !e.shiftKey && document.activeElement === i && (e.preventDefault(), r.focus());
			},
			children: [
				/* @__PURE__ */ (0, A.jsxs)("header", { children: [/* @__PURE__ */ (0, A.jsx)("h2", {
					id: s.current,
					children: e
				}), /* @__PURE__ */ (0, A.jsx)("button", {
					type: "button",
					onClick: n,
					"aria-label": t,
					children: /* @__PURE__ */ (0, A.jsx)(M, { name: "close" })
				})] }),
				r,
				i && /* @__PURE__ */ (0, A.jsx)("footer", { children: i })
			]
		})
	});
}
//#endregion
//#region src/nameValidation.ts
var P = /[<>:"/\\|?*\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u, F = /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/iu, I = (e, t) => e.trim() === "" ? "empty" : Array.from(e).length > t ? "tooLong" : e !== e.trim() || e.startsWith(".") || e.endsWith(".") || P.test(e) || F.test(e) ? "unsafe" : null;
//#endregion
//#region src/components/Dialogs.tsx
function te({ title: e, label: t, initialValue: n = "", maximum: r, extension: i = "", invalidNameLabel: a, confirmLabel: o, cancelLabel: s, closeLabel: c, onConfirm: l, onClose: u }) {
	let [d, f] = (0, _.useState)(n), p = d + i, m = Array.from(p).length, h = I(p, r), g = h === null;
	return /* @__PURE__ */ (0, A.jsx)(N, {
		title: e,
		closeLabel: c,
		onClose: u,
		className: "sf-form-modal",
		footer: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
			/* @__PURE__ */ (0, A.jsxs)("span", { children: [
				m,
				" / ",
				r
			] }),
			/* @__PURE__ */ (0, A.jsx)("button", {
				onClick: u,
				children: s
			}),
			/* @__PURE__ */ (0, A.jsx)("button", {
				className: "primary",
				disabled: !g,
				onClick: () => l(d.trim() + i),
				children: o
			})
		] }),
		children: /* @__PURE__ */ (0, A.jsxs)("div", {
			className: "sf-form-body",
			children: [/* @__PURE__ */ (0, A.jsxs)("label", { children: [t, /* @__PURE__ */ (0, A.jsxs)("span", {
				className: "sf-name-input",
				children: [/* @__PURE__ */ (0, A.jsx)("input", {
					autoFocus: !0,
					value: d,
					maxLength: r,
					onChange: (e) => f(e.target.value)
				}), i && /* @__PURE__ */ (0, A.jsx)("span", { children: i })]
			})] }), !g && d !== "" && /* @__PURE__ */ (0, A.jsx)("p", {
				role: "alert",
				children: h === "tooLong" ? `${m} / ${r}` : a
			})]
		})
	});
}
function ne({ title: e, message: t, detail: n, confirmLabel: r, cancelLabel: i, closeLabel: a, danger: o = !1, onConfirm: s, onClose: c }) {
	return /* @__PURE__ */ (0, A.jsx)(N, {
		title: e,
		closeLabel: a,
		onClose: c,
		className: "sf-confirm-modal",
		footer: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
			/* @__PURE__ */ (0, A.jsx)("span", {}),
			/* @__PURE__ */ (0, A.jsx)("button", {
				onClick: c,
				children: i
			}),
			/* @__PURE__ */ (0, A.jsx)("button", {
				className: o ? "danger" : "primary",
				onClick: s,
				children: r
			})
		] }),
		children: /* @__PURE__ */ (0, A.jsxs)("div", {
			className: "sf-form-body",
			children: [/* @__PURE__ */ (0, A.jsx)("p", { children: t }), n && /* @__PURE__ */ (0, A.jsx)("small", { children: n })]
		})
	});
}
//#endregion
//#region src/components/ContextMenu.tsx
function re({ x: e, y: t, items: n, onSelect: r, onClose: i }) {
	let a = (0, _.useRef)(null);
	return (0, _.useEffect)(() => {
		let e = () => i();
		return window.addEventListener("pointerdown", e), window.addEventListener("resize", e), a.current?.querySelector("button:not(:disabled)")?.focus(), () => {
			window.removeEventListener("pointerdown", e), window.removeEventListener("resize", e);
		};
	}, [i]), /* @__PURE__ */ (0, A.jsx)("div", {
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
		children: n.map((e) => /* @__PURE__ */ (0, A.jsx)("button", {
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
function ie({ api: e, resource: t, currentPath: n, rootLabel: r, onNavigate: i }) {
	let [a, o] = (0, _.useState)({ "": {
		loading: !1,
		loaded: !1,
		expanded: !0,
		children: []
	} }), s = (0, _.useCallback)(async (n, r = !0) => {
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
	(0, _.useEffect)(() => {
		o({ "": {
			loading: !1,
			loaded: !1,
			expanded: !0,
			children: []
		} }), s("");
	}, [s, t]), (0, _.useEffect)(() => {
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
		return r?.expanded ? r.children.map((e) => /* @__PURE__ */ (0, A.jsxs)("div", { children: [/* @__PURE__ */ (0, A.jsxs)("div", {
			className: `sf-tree-row ${n === e.path ? "active" : ""}`,
			style: { paddingInlineStart: `${8 + t * 16}px` },
			children: [/* @__PURE__ */ (0, A.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => c(e.path),
				"aria-expanded": a[e.path]?.expanded || !1,
				"aria-label": e.name,
				children: a[e.path]?.loading ? "…" : a[e.path]?.expanded ? "⌄" : "›"
			}), /* @__PURE__ */ (0, A.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => i(e.path),
				title: e.path,
				children: ["▰ ", e.name]
			})]
		}), l(e.path, t + 1)] }, e.path)) : null;
	};
	return /* @__PURE__ */ (0, A.jsxs)("nav", {
		className: "sf-folder-tree",
		"aria-label": r,
		children: [/* @__PURE__ */ (0, A.jsxs)("div", {
			className: `sf-tree-row ${n === "" ? "active" : ""}`,
			children: [/* @__PURE__ */ (0, A.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => c(""),
				"aria-expanded": a[""]?.expanded || !1,
				children: "⌄"
			}), /* @__PURE__ */ (0, A.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => i(""),
				children: ["⌂ ", r]
			})]
		}), l("", 1)]
	});
}
//#endregion
//#region node_modules/.pnpm/cropperjs@1.6.2/node_modules/cropperjs/dist/cropper.css
var ae = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
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
		var h = typeof window < "u" && window.document !== void 0, g = h ? window : {}, _ = h && g.document.documentElement ? "ontouchstart" in g.document.documentElement : !1, v = h ? "PointerEvent" in g : !1, y = "cropper", b = "all", x = "crop", S = "move", C = "zoom", w = "e", T = "w", E = "s", D = "n", O = "ne", ee = "nw", k = "se", A = "sw", j = `${y}-crop`, M = `${y}-disabled`, N = `${y}-hidden`, P = `${y}-hide`, F = `${y}-invisible`, I = `${y}-modal`, te = `${y}-move`, ne = `${y}Action`, re = `${y}Preview`, ie = "crop", ae = "move", L = "none", oe = "crop", se = "cropend", ce = "cropmove", le = "cropstart", ue = "dblclick", de = _ ? "touchstart" : "mousedown", fe = _ ? "touchmove" : "mousemove", pe = _ ? "touchend touchcancel" : "mouseup", me = v ? "pointerdown" : de, he = v ? "pointermove" : fe, ge = v ? "pointerup pointercancel" : pe, _e = "ready", ve = "resize", ye = "wheel", be = "zoom", xe = "image/jpeg", Se = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/, Ce = /^data:/, we = /^data:image\/jpeg;base64,/, Te = /^img|canvas$/i, Ee = 200, De = 100, Oe = {
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
		}, ke = "<div class=\"cropper-container\" touch-action=\"none\"><div class=\"cropper-wrap-box\"><div class=\"cropper-canvas\"></div></div><div class=\"cropper-drag-box\"></div><div class=\"cropper-crop-box\"><span class=\"cropper-view-box\"></span><span class=\"cropper-dashed dashed-h\"></span><span class=\"cropper-dashed dashed-v\"></span><span class=\"cropper-center\"></span><span class=\"cropper-face\"></span><span class=\"cropper-line line-e\" data-cropper-action=\"e\"></span><span class=\"cropper-line line-n\" data-cropper-action=\"n\"></span><span class=\"cropper-line line-w\" data-cropper-action=\"w\"></span><span class=\"cropper-line line-s\" data-cropper-action=\"s\"></span><span class=\"cropper-point point-e\" data-cropper-action=\"e\"></span><span class=\"cropper-point point-n\" data-cropper-action=\"n\"></span><span class=\"cropper-point point-w\" data-cropper-action=\"w\"></span><span class=\"cropper-point point-s\" data-cropper-action=\"s\"></span><span class=\"cropper-point point-ne\" data-cropper-action=\"ne\"></span><span class=\"cropper-point point-nw\" data-cropper-action=\"nw\"></span><span class=\"cropper-point point-sw\" data-cropper-action=\"sw\"></span><span class=\"cropper-point point-se\" data-cropper-action=\"se\"></span></div></div>", Ae = Number.isNaN || g.isNaN;
		function R(e) {
			return typeof e == "number" && !Ae(e);
		}
		var je = function(e) {
			return e > 0 && e < Infinity;
		};
		function Me(e) {
			return e === void 0;
		}
		function Ne(e) {
			return i(e) === "object" && e !== null;
		}
		var Pe = Object.prototype.hasOwnProperty;
		function Fe(e) {
			if (!Ne(e)) return !1;
			try {
				var t = e.constructor, n = t.prototype;
				return t && n && Pe.call(n, "isPrototypeOf");
			} catch {
				return !1;
			}
		}
		function Ie(e) {
			return typeof e == "function";
		}
		var Le = Array.prototype.slice;
		function Re(e) {
			return Array.from ? Array.from(e) : Le.call(e);
		}
		function ze(e, t) {
			return e && Ie(t) && (Array.isArray(e) || R(e.length) ? Re(e).forEach(function(n, r) {
				t.call(e, n, r, e);
			}) : Ne(e) && Object.keys(e).forEach(function(n) {
				t.call(e, e[n], n, e);
			})), e;
		}
		var Be = Object.assign || function(e) {
			var t = [...arguments].slice(1);
			return Ne(e) && t.length > 0 && t.forEach(function(t) {
				Ne(t) && Object.keys(t).forEach(function(n) {
					e[n] = t[n];
				});
			}), e;
		}, Ve = /\.\d*(?:0|9){12}\d*$/;
		function He(e) {
			var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1e11;
			return Ve.test(e) ? Math.round(e * t) / t : e;
		}
		var Ue = /^width|height|left|top|marginLeft|marginTop$/;
		function We(e, t) {
			var n = e.style;
			ze(t, function(e, t) {
				Ue.test(t) && R(e) && (e = `${e}px`), n[t] = e;
			});
		}
		function Ge(e, t) {
			return e.classList ? e.classList.contains(t) : e.className.indexOf(t) > -1;
		}
		function Ke(e, t) {
			if (t) {
				if (R(e.length)) {
					ze(e, function(e) {
						Ke(e, t);
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
		function qe(e, t) {
			if (t) {
				if (R(e.length)) {
					ze(e, function(e) {
						qe(e, t);
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
		function Je(e, t, n) {
			if (t) {
				if (R(e.length)) {
					ze(e, function(e) {
						Je(e, t, n);
					});
					return;
				}
				n ? Ke(e, t) : qe(e, t);
			}
		}
		var Ye = /([a-z\d])([A-Z])/g;
		function Xe(e) {
			return e.replace(Ye, "$1-$2").toLowerCase();
		}
		function Ze(e, t) {
			return Ne(e[t]) ? e[t] : e.dataset ? e.dataset[t] : e.getAttribute(`data-${Xe(t)}`);
		}
		function z(e, t, n) {
			Ne(n) ? e[t] = n : e.dataset ? e.dataset[t] = n : e.setAttribute(`data-${Xe(t)}`, n);
		}
		function Qe(e, t) {
			if (Ne(e[t])) try {
				delete e[t];
			} catch {
				e[t] = void 0;
			}
			else if (e.dataset) try {
				delete e.dataset[t];
			} catch {
				e.dataset[t] = void 0;
			}
			else e.removeAttribute(`data-${Xe(t)}`);
		}
		var $e = /\s\s*/, et = function() {
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
		function tt(e, t, n) {
			var r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, i = n;
			t.trim().split($e).forEach(function(t) {
				if (!et) {
					var a = e.listeners;
					a && a[t] && a[t][n] && (i = a[t][n], delete a[t][n], Object.keys(a[t]).length === 0 && delete a[t], Object.keys(a).length === 0 && delete e.listeners);
				}
				e.removeEventListener(t, i, r);
			});
		}
		function nt(e, t, n) {
			var r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, i = n;
			t.trim().split($e).forEach(function(t) {
				if (r.once && !et) {
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
		function rt(e, t, n) {
			var r;
			return Ie(Event) && Ie(CustomEvent) ? r = new CustomEvent(t, {
				detail: n,
				bubbles: !0,
				cancelable: !0
			}) : (r = document.createEvent("CustomEvent"), r.initCustomEvent(t, !0, !0, n)), e.dispatchEvent(r);
		}
		function it(e) {
			var t = e.getBoundingClientRect();
			return {
				left: t.left + (window.pageXOffset - document.documentElement.clientLeft),
				top: t.top + (window.pageYOffset - document.documentElement.clientTop)
			};
		}
		var at = g.location, ot = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;
		function st(e) {
			var t = e.match(ot);
			return t !== null && (t[1] !== at.protocol || t[2] !== at.hostname || t[3] !== at.port);
		}
		function ct(e) {
			var t = `timestamp=${(/* @__PURE__ */ new Date()).getTime()}`;
			return e + (e.indexOf("?") === -1 ? "?" : "&") + t;
		}
		function lt(e) {
			var t = e.rotate, n = e.scaleX, r = e.scaleY, i = e.translateX, a = e.translateY, o = [];
			R(i) && i !== 0 && o.push(`translateX(${i}px)`), R(a) && a !== 0 && o.push(`translateY(${a}px)`), R(t) && t !== 0 && o.push(`rotate(${t}deg)`), R(n) && n !== 1 && o.push(`scaleX(${n})`), R(r) && r !== 1 && o.push(`scaleY(${r})`);
			var s = o.length ? o.join(" ") : "none";
			return {
				WebkitTransform: s,
				msTransform: s,
				transform: s
			};
		}
		function ut(e) {
			var n = t({}, e), r = 0;
			return ze(e, function(e, t) {
				delete n[t], ze(n, function(t) {
					var n = Math.abs(e.startX - t.startX), i = Math.abs(e.startY - t.startY), a = Math.abs(e.endX - t.endX), o = Math.abs(e.endY - t.endY), s = Math.sqrt(n * n + i * i), c = (Math.sqrt(a * a + o * o) - s) / s;
					Math.abs(c) > Math.abs(r) && (r = c);
				});
			}), r;
		}
		function dt(e, n) {
			var r = e.pageX, i = e.pageY, a = {
				endX: r,
				endY: i
			};
			return n ? a : t({
				startX: r,
				startY: i
			}, a);
		}
		function ft(e) {
			var t = 0, n = 0, r = 0;
			return ze(e, function(e) {
				var i = e.startX, a = e.startY;
				t += i, n += a, r += 1;
			}), t /= r, n /= r, {
				pageX: t,
				pageY: n
			};
		}
		function pt(e) {
			var t = e.aspectRatio, n = e.height, r = e.width, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "contain", a = je(r), o = je(n);
			if (a && o) {
				var s = n * t;
				i === "contain" && s > r || i === "cover" && s < r ? n = r / t : r = n * t;
			} else a ? n = r / t : o && (r = n * t);
			return {
				width: r,
				height: n
			};
		}
		function mt(e) {
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
		function ht(e, t, n, r) {
			var i = t.aspectRatio, a = t.naturalWidth, o = t.naturalHeight, s = t.rotate, c = s === void 0 ? 0 : s, u = t.scaleX, d = u === void 0 ? 1 : u, f = t.scaleY, p = f === void 0 ? 1 : f, m = n.aspectRatio, h = n.naturalWidth, g = n.naturalHeight, _ = r.fillColor, v = _ === void 0 ? "transparent" : _, y = r.imageSmoothingEnabled, b = y === void 0 || y, x = r.imageSmoothingQuality, S = x === void 0 ? "low" : x, C = r.maxWidth, w = C === void 0 ? Infinity : C, T = r.maxHeight, E = T === void 0 ? Infinity : T, D = r.minWidth, O = D === void 0 ? 0 : D, ee = r.minHeight, k = ee === void 0 ? 0 : ee, A = document.createElement("canvas"), j = A.getContext("2d"), M = pt({
				aspectRatio: m,
				width: w,
				height: E
			}), N = pt({
				aspectRatio: m,
				width: O,
				height: k
			}, "cover"), P = Math.min(M.width, Math.max(N.width, h)), F = Math.min(M.height, Math.max(N.height, g)), I = pt({
				aspectRatio: i,
				width: w,
				height: E
			}), te = pt({
				aspectRatio: i,
				width: O,
				height: k
			}, "cover"), ne = Math.min(I.width, Math.max(te.width, a)), re = Math.min(I.height, Math.max(te.height, o)), ie = [
				-ne / 2,
				-re / 2,
				ne,
				re
			];
			return A.width = He(P), A.height = He(F), j.fillStyle = v, j.fillRect(0, 0, P, F), j.save(), j.translate(P / 2, F / 2), j.rotate(c * Math.PI / 180), j.scale(d, p), j.imageSmoothingEnabled = b, j.imageSmoothingQuality = S, j.drawImage.apply(j, [e].concat(l(ie.map(function(e) {
				return Math.floor(He(e));
			})))), j.restore(), A;
		}
		var gt = String.fromCharCode;
		function _t(e, t, n) {
			var r = "";
			n += t;
			for (var i = t; i < n; i += 1) r += gt(e.getUint8(i));
			return r;
		}
		var vt = /^data:.*,/;
		function yt(e) {
			var t = e.replace(vt, ""), n = atob(t), r = new ArrayBuffer(n.length), i = new Uint8Array(r);
			return ze(i, function(e, t) {
				i[t] = n.charCodeAt(t);
			}), r;
		}
		function bt(e, t) {
			for (var n = [], r = 8192, i = new Uint8Array(e); i.length > 0;) n.push(gt.apply(null, Re(i.subarray(0, r)))), i = i.subarray(r);
			return `data:${t};base64,${btoa(n.join(""))}`;
		}
		function xt(e) {
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
					if (_t(t, c, 4) === "Exif") {
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
		function St(e) {
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
		var Ct = {
			render: function() {
				this.initContainer(), this.initCanvas(), this.initCropBox(), this.renderCanvas(), this.cropped && this.renderCropBox();
			},
			initContainer: function() {
				var e = this.element, t = this.options, n = this.container, r = this.cropper, i = Number(t.minContainerWidth), a = Number(t.minContainerHeight);
				Ke(r, N), qe(e, N);
				var o = {
					width: Math.max(n.offsetWidth, i >= 0 ? i : Ee),
					height: Math.max(n.offsetHeight, a >= 0 ? a : De)
				};
				this.containerData = o, We(r, {
					width: o.width,
					height: o.height
				}), Ke(e, N), qe(r, N);
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
				this.canvasData = l, this.limited = n === 1 || n === 2, this.limitCanvas(!0, !0), l.width = Math.min(Math.max(l.width, l.minWidth), l.maxWidth), l.height = Math.min(Math.max(l.height, l.minHeight), l.maxHeight), l.left = (e.width - l.width) / 2, l.top = (e.height - l.height) / 2, l.oldLeft = l.left, l.oldTop = l.top, this.initialCanvasData = Be({}, l);
			},
			limitCanvas: function(e, t) {
				var n = this.options, r = this.containerData, i = this.canvasData, a = this.cropBoxData, o = n.viewMode, s = i.aspectRatio, c = this.cropped && a;
				if (e) {
					var l = Number(n.minCanvasWidth) || 0, u = Number(n.minCanvasHeight) || 0;
					o > 1 ? (l = Math.max(l, r.width), u = Math.max(u, r.height), o === 3 && (u * s > l ? l = u * s : u = l / s)) : o > 0 && (l ? l = Math.max(l, c ? a.width : 0) : u ? u = Math.max(u, c ? a.height : 0) : c && (l = a.width, u = a.height, u * s > l ? l = u * s : u = l / s));
					var d = pt({
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
					var i = mt({
						width: r.naturalWidth * Math.abs(r.scaleX || 1),
						height: r.naturalHeight * Math.abs(r.scaleY || 1),
						degree: r.rotate || 0
					}), a = i.width, o = i.height, s = n.width * (a / n.naturalWidth), c = n.height * (o / n.naturalHeight);
					n.left -= (s - n.width) / 2, n.top -= (c - n.height) / 2, n.width = s, n.height = c, n.aspectRatio = a / o, n.naturalWidth = a, n.naturalHeight = o, this.limitCanvas(!0, !1);
				}
				(n.width > n.maxWidth || n.width < n.minWidth) && (n.left = n.oldLeft), (n.height > n.maxHeight || n.height < n.minHeight) && (n.top = n.oldTop), n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth), n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight), this.limitCanvas(!1, !0), n.left = Math.min(Math.max(n.left, n.minLeft), n.maxLeft), n.top = Math.min(Math.max(n.top, n.minTop), n.maxTop), n.oldLeft = n.left, n.oldTop = n.top, We(this.canvas, Be({
					width: n.width,
					height: n.height
				}, lt({
					translateX: n.left,
					translateY: n.top
				}))), this.renderImage(e), this.cropped && this.limited && this.limitCropBox(!0, !0);
			},
			renderImage: function(e) {
				var t = this.canvasData, n = this.imageData, r = n.naturalWidth * (t.width / t.naturalWidth), i = n.naturalHeight * (t.height / t.naturalHeight);
				Be(n, {
					width: r,
					height: i,
					left: (t.width - r) / 2,
					top: (t.height - i) / 2
				}), We(this.image, Be({
					width: n.width,
					height: n.height
				}, lt(Be({
					translateX: n.left,
					translateY: n.top
				}, n)))), e && this.output();
			},
			initCropBox: function() {
				var e = this.options, t = this.canvasData, n = e.aspectRatio || e.initialAspectRatio, r = Number(e.autoCropArea) || .8, i = {
					width: t.width,
					height: t.height
				};
				n && (t.height * n > t.width ? i.height = i.width / n : i.width = i.height * n), this.cropBoxData = i, this.limitCropBox(!0, !0), i.width = Math.min(Math.max(i.width, i.minWidth), i.maxWidth), i.height = Math.min(Math.max(i.height, i.minHeight), i.maxHeight), i.width = Math.max(i.minWidth, i.width * r), i.height = Math.max(i.minHeight, i.height * r), i.left = t.left + (t.width - i.width) / 2, i.top = t.top + (t.height - i.height) / 2, i.oldLeft = i.left, i.oldTop = i.top, this.initialCropBoxData = Be({}, i);
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
				(n.width > n.maxWidth || n.width < n.minWidth) && (n.left = n.oldLeft), (n.height > n.maxHeight || n.height < n.minHeight) && (n.top = n.oldTop), n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth), n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight), this.limitCropBox(!1, !0), n.left = Math.min(Math.max(n.left, n.minLeft), n.maxLeft), n.top = Math.min(Math.max(n.top, n.minTop), n.maxTop), n.oldLeft = n.left, n.oldTop = n.top, e.movable && e.cropBoxMovable && z(this.face, ne, n.width >= t.width && n.height >= t.height ? S : b), We(this.cropBox, Be({
					width: n.width,
					height: n.height
				}, lt({
					translateX: n.left,
					translateY: n.top
				}))), this.cropped && this.limited && this.limitCanvas(!0, !0), this.disabled || this.output();
			},
			output: function() {
				this.preview(), rt(this.element, oe, this.getData());
			}
		}, wt = {
			initPreview: function() {
				var e = this.element, t = this.crossOrigin, n = this.options.preview, r = t ? this.crossOriginUrl : this.url, i = e.alt || "The image to preview", a = document.createElement("img");
				if (t && (a.crossOrigin = t), a.src = r, a.alt = i, this.viewBox.appendChild(a), this.viewBoxImage = a, n) {
					var o = n;
					typeof n == "string" ? o = e.ownerDocument.querySelectorAll(n) : n.querySelector && (o = [n]), this.previews = o, ze(o, function(e) {
						var n = document.createElement("img");
						z(e, re, {
							width: e.offsetWidth,
							height: e.offsetHeight,
							html: e.innerHTML
						}), t && (n.crossOrigin = t), n.src = r, n.alt = i, n.style.cssText = "display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;\"", e.innerHTML = "", e.appendChild(n);
					});
				}
			},
			resetPreview: function() {
				ze(this.previews, function(e) {
					var t = Ze(e, re);
					We(e, {
						width: t.width,
						height: t.height
					}), e.innerHTML = t.html, Qe(e, re);
				});
			},
			preview: function() {
				var e = this.imageData, t = this.canvasData, n = this.cropBoxData, r = n.width, i = n.height, a = e.width, o = e.height, s = n.left - t.left - e.left, c = n.top - t.top - e.top;
				!this.cropped || this.disabled || (We(this.viewBoxImage, Be({
					width: a,
					height: o
				}, lt(Be({
					translateX: -s,
					translateY: -c
				}, e)))), ze(this.previews, function(t) {
					var n = Ze(t, re), l = n.width, u = n.height, d = l, f = u, p = 1;
					r && (p = l / r, f = i * p), i && f > u && (p = u / i, d = r * p, f = u), We(t, {
						width: d,
						height: f
					}), We(t.getElementsByTagName("img")[0], Be({
						width: a * p,
						height: o * p
					}, lt(Be({
						translateX: -s * p,
						translateY: -c * p
					}, e))));
				}));
			}
		}, Tt = {
			bind: function() {
				var e = this.element, t = this.options, n = this.cropper;
				Ie(t.cropstart) && nt(e, le, t.cropstart), Ie(t.cropmove) && nt(e, ce, t.cropmove), Ie(t.cropend) && nt(e, se, t.cropend), Ie(t.crop) && nt(e, oe, t.crop), Ie(t.zoom) && nt(e, be, t.zoom), nt(n, me, this.onCropStart = this.cropStart.bind(this)), t.zoomable && t.zoomOnWheel && nt(n, ye, this.onWheel = this.wheel.bind(this), {
					passive: !1,
					capture: !0
				}), t.toggleDragModeOnDblclick && nt(n, ue, this.onDblclick = this.dblclick.bind(this)), nt(e.ownerDocument, he, this.onCropMove = this.cropMove.bind(this)), nt(e.ownerDocument, ge, this.onCropEnd = this.cropEnd.bind(this)), t.responsive && nt(window, ve, this.onResize = this.resize.bind(this));
			},
			unbind: function() {
				var e = this.element, t = this.options, n = this.cropper;
				Ie(t.cropstart) && tt(e, le, t.cropstart), Ie(t.cropmove) && tt(e, ce, t.cropmove), Ie(t.cropend) && tt(e, se, t.cropend), Ie(t.crop) && tt(e, oe, t.crop), Ie(t.zoom) && tt(e, be, t.zoom), tt(n, me, this.onCropStart), t.zoomable && t.zoomOnWheel && tt(n, ye, this.onWheel, {
					passive: !1,
					capture: !0
				}), t.toggleDragModeOnDblclick && tt(n, ue, this.onDblclick), tt(e.ownerDocument, he, this.onCropMove), tt(e.ownerDocument, ge, this.onCropEnd), t.responsive && tt(window, ve, this.onResize);
			}
		}, Et = {
			resize: function() {
				if (!this.disabled) {
					var e = this.options, t = this.container, n = this.containerData, r = t.offsetWidth / n.width, i = t.offsetHeight / n.height, a = Math.abs(r - 1) > Math.abs(i - 1) ? r : i;
					if (a !== 1) {
						var o, s;
						e.restore && (o = this.getCanvasData(), s = this.getCropBoxData()), this.render(), e.restore && (this.setCanvasData(ze(o, function(e, t) {
							o[t] = e * a;
						})), this.setCropBoxData(ze(s, function(e, t) {
							s[t] = e * a;
						})));
					}
				}
			},
			dblclick: function() {
				this.disabled || this.options.dragMode === L || this.setDragMode(Ge(this.dragBox, j) ? ae : ie);
			},
			wheel: function(e) {
				var t = this, n = Number(this.options.wheelZoomRatio) || .1, r = 1;
				this.disabled || (e.preventDefault(), !this.wheeling && (this.wheeling = !0, setTimeout(function() {
					t.wheeling = !1;
				}, 50), e.deltaY ? r = e.deltaY > 0 ? 1 : -1 : e.wheelDelta ? r = -e.wheelDelta / 120 : e.detail && (r = e.detail > 0 ? 1 : -1), this.zoom(-r * n, e)));
			},
			cropStart: function(e) {
				var t = e.buttons, n = e.button;
				if (!(this.disabled || (e.type === "mousedown" || e.type === "pointerdown" && e.pointerType === "mouse") && (R(t) && t !== 1 || R(n) && n !== 0 || e.ctrlKey))) {
					var r = this.options, i = this.pointers, a;
					e.changedTouches ? ze(e.changedTouches, function(e) {
						i[e.identifier] = dt(e);
					}) : i[e.pointerId || 0] = dt(e), a = Object.keys(i).length > 1 && r.zoomable && r.zoomOnTouch ? C : Ze(e.target, ne), Se.test(a) && rt(this.element, le, {
						originalEvent: e,
						action: a
					}) !== !1 && (e.preventDefault(), this.action = a, this.cropping = !1, a === x && (this.cropping = !0, Ke(this.dragBox, I)));
				}
			},
			cropMove: function(e) {
				var t = this.action;
				if (!(this.disabled || !t)) {
					var n = this.pointers;
					e.preventDefault(), rt(this.element, ce, {
						originalEvent: e,
						action: t
					}) !== !1 && (e.changedTouches ? ze(e.changedTouches, function(e) {
						Be(n[e.identifier] || {}, dt(e, !0));
					}) : Be(n[e.pointerId || 0] || {}, dt(e, !0)), this.change(e));
				}
			},
			cropEnd: function(e) {
				if (!this.disabled) {
					var t = this.action, n = this.pointers;
					e.changedTouches ? ze(e.changedTouches, function(e) {
						delete n[e.identifier];
					}) : delete n[e.pointerId || 0], t && (e.preventDefault(), Object.keys(n).length || (this.action = ""), this.cropping && (this.cropping = !1, Je(this.dragBox, I, this.cropped && this.options.modal)), rt(this.element, se, {
						originalEvent: e,
						action: t
					}));
				}
			}
		}, Dt = { change: function(e) {
			var t = this.options, n = this.canvasData, r = this.containerData, i = this.cropBoxData, a = this.pointers, o = this.action, s = t.aspectRatio, c = i.left, l = i.top, u = i.width, d = i.height, f = c + u, p = l + d, m = 0, h = 0, g = r.width, _ = r.height, v = !0, y;
			!s && e.shiftKey && (s = u && d ? u / d : 1), this.limited && (m = i.minLeft, h = i.minTop, g = m + Math.min(r.width, n.width, n.left + n.width), _ = h + Math.min(r.height, n.height, n.top + n.height));
			var j = a[Object.keys(a)[0]], M = {
				x: j.endX - j.startX,
				y: j.endY - j.startY
			}, P = function(e) {
				switch (e) {
					case w:
						f + M.x > g && (M.x = g - f);
						break;
					case T:
						c + M.x < m && (M.x = m - c);
						break;
					case D:
						l + M.y < h && (M.y = h - l);
						break;
					case E: p + M.y > _ && (M.y = _ - p);
				}
			};
			switch (o) {
				case b:
					c += M.x, l += M.y;
					break;
				case w:
					if (M.x >= 0 && (f >= g || s && (l <= h || p >= _))) {
						v = !1;
						break;
					}
					P(w), u += M.x, u < 0 && (o = T, u = -u, c -= u), s && (d = u / s, l += (i.height - d) / 2);
					break;
				case D:
					if (M.y <= 0 && (l <= h || s && (c <= m || f >= g))) {
						v = !1;
						break;
					}
					P(D), d -= M.y, l += M.y, d < 0 && (o = E, d = -d, l -= d), s && (u = d * s, c += (i.width - u) / 2);
					break;
				case T:
					if (M.x <= 0 && (c <= m || s && (l <= h || p >= _))) {
						v = !1;
						break;
					}
					P(T), u -= M.x, c += M.x, u < 0 && (o = w, u = -u, c -= u), s && (d = u / s, l += (i.height - d) / 2);
					break;
				case E:
					if (M.y >= 0 && (p >= _ || s && (c <= m || f >= g))) {
						v = !1;
						break;
					}
					P(E), d += M.y, d < 0 && (o = D, d = -d, l -= d), s && (u = d * s, c += (i.width - u) / 2);
					break;
				case O:
					if (s) {
						if (M.y <= 0 && (l <= h || f >= g)) {
							v = !1;
							break;
						}
						P(D), d -= M.y, l += M.y, u = d * s;
					} else P(D), P(w), M.x >= 0 ? f < g ? u += M.x : M.y <= 0 && l <= h && (v = !1) : u += M.x, M.y <= 0 ? l > h && (d -= M.y, l += M.y) : (d -= M.y, l += M.y);
					u < 0 && d < 0 ? (o = A, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = ee, u = -u, c -= u) : d < 0 && (o = k, d = -d, l -= d);
					break;
				case ee:
					if (s) {
						if (M.y <= 0 && (l <= h || c <= m)) {
							v = !1;
							break;
						}
						P(D), d -= M.y, l += M.y, u = d * s, c += i.width - u;
					} else P(D), P(T), M.x <= 0 ? c > m ? (u -= M.x, c += M.x) : M.y <= 0 && l <= h && (v = !1) : (u -= M.x, c += M.x), M.y <= 0 ? l > h && (d -= M.y, l += M.y) : (d -= M.y, l += M.y);
					u < 0 && d < 0 ? (o = k, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = O, u = -u, c -= u) : d < 0 && (o = A, d = -d, l -= d);
					break;
				case A:
					if (s) {
						if (M.x <= 0 && (c <= m || p >= _)) {
							v = !1;
							break;
						}
						P(T), u -= M.x, c += M.x, d = u / s;
					} else P(E), P(T), M.x <= 0 ? c > m ? (u -= M.x, c += M.x) : M.y >= 0 && p >= _ && (v = !1) : (u -= M.x, c += M.x), M.y >= 0 ? p < _ && (d += M.y) : d += M.y;
					u < 0 && d < 0 ? (o = O, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = k, u = -u, c -= u) : d < 0 && (o = ee, d = -d, l -= d);
					break;
				case k:
					if (s) {
						if (M.x >= 0 && (f >= g || p >= _)) {
							v = !1;
							break;
						}
						P(w), u += M.x, d = u / s;
					} else P(E), P(w), M.x >= 0 ? f < g ? u += M.x : M.y >= 0 && p >= _ && (v = !1) : u += M.x, M.y >= 0 ? p < _ && (d += M.y) : d += M.y;
					u < 0 && d < 0 ? (o = ee, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = A, u = -u, c -= u) : d < 0 && (o = O, d = -d, l -= d);
					break;
				case S:
					this.move(M.x, M.y), v = !1;
					break;
				case C:
					this.zoom(ut(a), e), v = !1;
					break;
				case x:
					if (!M.x || !M.y) {
						v = !1;
						break;
					}
					y = it(this.cropper), c = j.startX - y.left, l = j.startY - y.top, u = i.minWidth, d = i.minHeight, M.x > 0 ? o = M.y > 0 ? k : O : M.x < 0 && (c -= u, o = M.y > 0 ? A : ee), M.y < 0 && (l -= d), this.cropped || (qe(this.cropBox, N), this.cropped = !0, this.limited && this.limitCropBox(!0, !0));
			}
			v && (i.width = u, i.height = d, i.left = c, i.top = l, this.action = o, this.renderCropBox()), ze(a, function(e) {
				e.startX = e.endX, e.startY = e.endY;
			});
		} }, Ot = {
			crop: function() {
				return this.ready && !this.cropped && !this.disabled && (this.cropped = !0, this.limitCropBox(!0, !0), this.options.modal && Ke(this.dragBox, I), qe(this.cropBox, N), this.setCropBoxData(this.initialCropBoxData)), this;
			},
			reset: function() {
				return this.ready && !this.disabled && (this.imageData = Be({}, this.initialImageData), this.canvasData = Be({}, this.initialCanvasData), this.cropBoxData = Be({}, this.initialCropBoxData), this.renderCanvas(), this.cropped && this.renderCropBox()), this;
			},
			clear: function() {
				return this.cropped && !this.disabled && (Be(this.cropBoxData, {
					left: 0,
					top: 0,
					width: 0,
					height: 0
				}), this.cropped = !1, this.renderCropBox(), this.limitCanvas(!0, !0), this.renderCanvas(), qe(this.dragBox, I), Ke(this.cropBox, N)), this;
			},
			replace: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 && arguments[1];
				return !this.disabled && e && (this.isImg && (this.element.src = e), t ? (this.url = e, this.image.src = e, this.ready && (this.viewBoxImage.src = e, ze(this.previews, function(t) {
					t.getElementsByTagName("img")[0].src = e;
				}))) : (this.isImg && (this.replaced = !0), this.options.data = null, this.uncreate(), this.load(e))), this;
			},
			enable: function() {
				return this.ready && this.disabled && (this.disabled = !1, qe(this.cropper, M)), this;
			},
			disable: function() {
				return this.ready && !this.disabled && (this.disabled = !0, Ke(this.cropper, M)), this;
			},
			destroy: function() {
				var e = this.element;
				return e[y] ? (e[y] = void 0, this.isImg && this.replaced && (e.src = this.originalUrl), this.uncreate(), this) : this;
			},
			move: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.canvasData, r = n.left, i = n.top;
				return this.moveTo(Me(e) ? e : r + Number(e), Me(t) ? t : i + Number(t));
			},
			moveTo: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.canvasData, r = !1;
				return e = Number(e), t = Number(t), this.ready && !this.disabled && this.options.movable && (R(e) && (n.left = e, r = !0), R(t) && (n.top = t, r = !0), r && this.renderCanvas(!0)), this;
			},
			zoom: function(e, t) {
				var n = this.canvasData;
				return e = Number(e), e = e < 0 ? 1 / (1 - e) : 1 + e, this.zoomTo(n.width * e / n.naturalWidth, null, t);
			},
			zoomTo: function(e, t, n) {
				var r = this.options, i = this.canvasData, a = i.width, o = i.height, s = i.naturalWidth, c = i.naturalHeight;
				if (e = Number(e), e >= 0 && this.ready && !this.disabled && r.zoomable) {
					var l = s * e, u = c * e;
					if (rt(this.element, be, {
						ratio: e,
						oldRatio: a / s,
						originalEvent: n
					}) === !1) return this;
					if (n) {
						var d = this.pointers, f = it(this.cropper), p = d && Object.keys(d).length ? ft(d) : {
							pageX: n.pageX,
							pageY: n.pageY
						};
						i.left -= (l - a) * ((p.pageX - f.left - i.left) / a), i.top -= (u - o) * ((p.pageY - f.top - i.top) / o);
					} else Fe(t) && R(t.x) && R(t.y) ? (i.left -= (l - a) * ((t.x - i.left) / a), i.top -= (u - o) * ((t.y - i.top) / o)) : (i.left -= (l - a) / 2, i.top -= (u - o) / 2);
					i.width = l, i.height = u, this.renderCanvas(!0);
				}
				return this;
			},
			rotate: function(e) {
				return this.rotateTo((this.imageData.rotate || 0) + Number(e));
			},
			rotateTo: function(e) {
				return e = Number(e), R(e) && this.ready && !this.disabled && this.options.rotatable && (this.imageData.rotate = e % 360, this.renderCanvas(!0, !0)), this;
			},
			scaleX: function(e) {
				var t = this.imageData.scaleY;
				return this.scale(e, R(t) ? t : 1);
			},
			scaleY: function(e) {
				var t = this.imageData.scaleX;
				return this.scale(R(t) ? t : 1, e);
			},
			scale: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.imageData, r = !1;
				return e = Number(e), t = Number(t), this.ready && !this.disabled && this.options.scalable && (R(e) && (n.scaleX = e, r = !0), R(t) && (n.scaleY = t, r = !0), r && this.renderCanvas(!0, !0)), this;
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
					if (ze(a, function(e, t) {
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
				if (this.ready && !this.disabled && Fe(e)) {
					var a = !1;
					t.rotatable && R(e.rotate) && e.rotate !== n.rotate && (n.rotate = e.rotate, a = !0), t.scalable && (R(e.scaleX) && e.scaleX !== n.scaleX && (n.scaleX = e.scaleX, a = !0), R(e.scaleY) && e.scaleY !== n.scaleY && (n.scaleY = e.scaleY, a = !0)), a && this.renderCanvas(!0, !0);
					var o = n.width / n.naturalWidth;
					R(e.x) && (i.left = e.x * o + r.left), R(e.y) && (i.top = e.y * o + r.top), R(e.width) && (i.width = e.width * o), R(e.height) && (i.height = e.height * o), this.setCropBoxData(i);
				}
				return this;
			},
			getContainerData: function() {
				return this.ready ? Be({}, this.containerData) : {};
			},
			getImageData: function() {
				return this.sized ? Be({}, this.imageData) : {};
			},
			getCanvasData: function() {
				var e = this.canvasData, t = {};
				return this.ready && ze([
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
				return this.ready && !this.disabled && Fe(e) && (R(e.left) && (t.left = e.left), R(e.top) && (t.top = e.top), R(e.width) ? (t.width = e.width, t.height = e.width / n) : R(e.height) && (t.height = e.height, t.width = e.height * n), this.renderCanvas(!0)), this;
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
				return this.ready && this.cropped && !this.disabled && Fe(e) && (R(e.left) && (t.left = e.left), R(e.top) && (t.top = e.top), R(e.width) && e.width !== t.width && (r = !0, t.width = e.width), R(e.height) && e.height !== t.height && (i = !0, t.height = e.height), n && (r ? t.height = t.width / n : i && (t.width = t.height * n)), this.renderCropBox()), this;
			},
			getCroppedCanvas: function() {
				var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
				if (!this.ready || !window.HTMLCanvasElement) return null;
				var t = this.canvasData, n = ht(this.image, this.imageData, t, e);
				if (!this.cropped) return n;
				var r = this.getData(e.rounded), i = r.x, a = r.y, o = r.width, s = r.height, c = n.width / Math.floor(t.naturalWidth);
				c !== 1 && (i *= c, a *= c, o *= c, s *= c);
				var u = o / s, d = pt({
					aspectRatio: u,
					width: e.maxWidth || Infinity,
					height: e.maxHeight || Infinity
				}), f = pt({
					aspectRatio: u,
					width: e.minWidth || 0,
					height: e.minHeight || 0
				}, "cover"), p = pt({
					aspectRatio: u,
					width: e.width || (c === 1 ? o : n.width),
					height: e.height || (c === 1 ? s : n.height)
				}), m = p.width, h = p.height;
				m = Math.min(d.width, Math.max(f.width, m)), h = Math.min(d.height, Math.max(f.height, h));
				var g = document.createElement("canvas"), _ = g.getContext("2d");
				g.width = He(m), g.height = He(h), _.fillStyle = e.fillColor || "transparent", _.fillRect(0, 0, m, h);
				var v = e.imageSmoothingEnabled, y = v === void 0 || v, b = e.imageSmoothingQuality;
				_.imageSmoothingEnabled = y, b && (_.imageSmoothingQuality = b);
				var x = n.width, S = n.height, C = i, w = a, T, E, D, O, ee, k;
				C <= -o || C > x ? (C = 0, T = 0, D = 0, ee = 0) : C <= 0 ? (D = -C, C = 0, T = Math.min(x, o + C), ee = T) : C <= x && (D = 0, T = Math.min(o, x - C), ee = T), T <= 0 || w <= -s || w > S ? (w = 0, E = 0, O = 0, k = 0) : w <= 0 ? (O = -w, w = 0, E = Math.min(S, s + w), k = E) : w <= S && (O = 0, E = Math.min(s, S - w), k = E);
				var A = [
					C,
					w,
					T,
					E
				];
				if (ee > 0 && k > 0) {
					var j = m / o;
					A.push(D * j, O * j, ee * j, k * j);
				}
				return _.drawImage.apply(_, [n].concat(l(A.map(function(e) {
					return Math.floor(He(e));
				})))), g;
			},
			setAspectRatio: function(e) {
				var t = this.options;
				return !this.disabled && !Me(e) && (t.aspectRatio = Math.max(0, e) || NaN, this.ready && (this.initCropBox(), this.cropped && this.renderCropBox())), this;
			},
			setDragMode: function(e) {
				var t = this.options, n = this.dragBox, r = this.face;
				if (this.ready && !this.disabled) {
					var i = e === ie, a = t.movable && e === ae;
					e = i || a ? e : L, t.dragMode = e, z(n, ne, e), Je(n, j, i), Je(n, te, a), t.cropBoxMovable || (z(r, ne, e), Je(r, j, i), Je(r, te, a));
				}
				return this;
			}
		}, kt = g.Cropper, At = /*#__PURE__*/ function() {
			function e(t) {
				var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				if (a(this, e), !t || !Te.test(t.tagName)) throw Error("The first argument is required and must be an <img> or <canvas> element.");
				this.element = t, this.options = Be({}, Oe, Fe(n) && n), this.cropped = !1, this.disabled = !1, this.pointers = {}, this.ready = !1, this.reloading = !1, this.replaced = !1, this.sized = !1, this.sizing = !1, this.init();
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
								we.test(e) ? this.read(yt(e)) : this.clone();
								return;
							}
							var i = new XMLHttpRequest(), a = this.clone.bind(this);
							this.reloading = !0, this.xhr = i, i.onabort = a, i.onerror = a, i.ontimeout = a, i.onprogress = function() {
								i.getResponseHeader("content-type") !== xe && i.abort();
							}, i.onload = function() {
								t.read(i.response);
							}, i.onloadend = function() {
								t.reloading = !1, t.xhr = null;
							}, r.checkCrossOrigin && st(e) && n.crossOrigin && (e = ct(e)), i.open("GET", e, !0), i.responseType = "arraybuffer", i.withCredentials = n.crossOrigin === "use-credentials", i.send();
						}
					}
				},
				{
					key: "read",
					value: function(e) {
						var t = this.options, n = this.imageData, r = xt(e), i = 0, a = 1, o = 1;
						if (r > 1) {
							this.url = bt(e, xe);
							var s = St(r);
							i = s.rotate, a = s.scaleX, o = s.scaleY;
						}
						t.rotatable && (n.rotate = i), t.scalable && (n.scaleX = a, n.scaleY = o), this.clone();
					}
				},
				{
					key: "clone",
					value: function() {
						var e = this.element, t = this.url, n = e.crossOrigin, r = t;
						this.options.checkCrossOrigin && st(t) && (n || (n = "anonymous"), r = ct(t)), this.crossOrigin = n, this.crossOriginUrl = r;
						var i = document.createElement("img");
						n && (i.crossOrigin = n), i.src = r || t, i.alt = e.alt || "The image to crop", this.image = i, i.onload = this.start.bind(this), i.onerror = this.stop.bind(this), Ke(i, P), e.parentNode.insertBefore(i, e.nextSibling);
					}
				},
				{
					key: "start",
					value: function() {
						var e = this, t = this.image;
						t.onload = null, t.onerror = null, this.sizing = !0;
						var n = g.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(g.navigator.userAgent), r = function(t, n) {
							Be(e.imageData, {
								naturalWidth: t,
								naturalHeight: n,
								aspectRatio: t / n
							}), e.initialImageData = Be({}, e.imageData), e.sizing = !1, e.sized = !0, e.build();
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
							this.container = r, this.cropper = a, this.canvas = o, this.dragBox = s, this.cropBox = c, this.viewBox = a.querySelector(`.${y}-view-box`), this.face = l, o.appendChild(n), Ke(e, N), r.insertBefore(a, e.nextSibling), qe(n, P), this.initPreview(), this.bind(), t.initialAspectRatio = Math.max(0, t.initialAspectRatio) || NaN, t.aspectRatio = Math.max(0, t.aspectRatio) || NaN, t.viewMode = Math.max(0, Math.min(3, Math.round(t.viewMode))) || 0, Ke(c, N), t.guides || Ke(c.getElementsByClassName(`${y}-dashed`), N), t.center || Ke(c.getElementsByClassName(`${y}-center`), N), t.background && Ke(a, `${y}-bg`), t.highlight || Ke(l, F), t.cropBoxMovable && (Ke(l, te), z(l, ne, b)), t.cropBoxResizable || (Ke(c.getElementsByClassName(`${y}-line`), N), Ke(c.getElementsByClassName(`${y}-point`), N)), this.render(), this.ready = !0, this.setDragMode(t.dragMode), t.autoCrop && this.crop(), this.setData(t.data), Ie(t.ready) && nt(e, _e, t.ready, { once: !0 }), rt(e, _e);
						}
					}
				},
				{
					key: "unbuild",
					value: function() {
						if (this.ready) {
							this.ready = !1, this.unbind(), this.resetPreview();
							var e = this.cropper.parentNode;
							e && e.removeChild(this.cropper), qe(this.element, N);
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
					return window.Cropper = kt, e;
				}
			}, {
				key: "setDefaults",
				value: function(e) {
					Be(Oe, Fe(e) && e);
				}
			}]);
		}();
		return Be(At.prototype, Ct, wt, Tt, Et, Dt, Ot), At;
	}));
})))(), 1), L = (e, t, n) => Math.max(t, Math.min(e, n));
function oe(e, t) {
	let n = L(Math.round(e.x), 0, Math.max(0, t.width - 1)), r = L(Math.round(e.y), 0, Math.max(0, t.height - 1));
	return {
		x: n,
		y: r,
		width: L(Math.round(e.width), 1, Math.max(1, t.width - n)),
		height: L(Math.round(e.height), 1, Math.max(1, t.height - r))
	};
}
//#endregion
//#region src/components/ImageEditor.tsx
var se = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height, ce = {
	"image/avif": ["avif"],
	"image/bmp": ["bmp"],
	"image/x-bmp": ["bmp"],
	"image/gif": ["gif"],
	"image/vnd.microsoft.icon": ["ico"],
	"image/x-icon": ["ico"],
	"image/jpeg": ["jpg", "jpeg"],
	"image/png": ["png"],
	"image/webp": ["webp"]
};
function le({ entry: e, info: t, imageUrl: n, maximumFileNameLength: r, labels: i, onClose: a, onSave: o }) {
	let s = (0, _.useRef)(null), c = (0, _.useRef)(null), l = {
		x: 0,
		y: 0,
		width: t.width,
		height: t.height
	}, u = (0, _.useRef)(l), d = (0, _.useRef)(null), f = (0, _.useRef)(1), p = (0, _.useRef)([]), m = (0, _.useRef)([]), [h, g] = (0, _.useState)(l), [v, y] = (0, _.useState)([]), [b, x] = (0, _.useState)([]), [S, C] = (0, _.useState)("free"), [w, T] = (0, _.useState)(1), [E, D] = (0, _.useState)(!1), [O, ee] = (0, _.useState)("copy"), k = e.name.lastIndexOf("."), j = k > 0 ? e.name.slice(k + 1) : "", M = ce[(e.mimeType || "").toLowerCase()] || [], P = M.includes(j.toLowerCase()) ? j : M[0] || j, F = `${k > 0 && j === P ? e.name.slice(0, k) : e.name}-edited`, [te, ne] = (0, _.useState)(F), [re, ie] = (0, _.useState)(!1), [L, le] = (0, _.useState)(""), ue = P === "" ? te : `${te}.${P}`, de = O === "copy" ? I(ue, r) : null, fe = (e = S) => e === "original" ? t.width / t.height : e === "1:1" ? 1 : e === "4:3" ? 4 / 3 : e === "16:9" ? 16 / 9 : NaN, pe = (e) => oe(e, t), me = (e) => {
		u.current = e, g(e);
	}, he = (e) => {
		p.current = e, y(e);
	}, ge = (e) => {
		m.current = e, x(e);
	}, _e = (e, t) => {
		se(e, t) || (he([...p.current.slice(-39), e]), ge([]));
	}, ve = (e, n = !0) => {
		let r = oe(e, t);
		n && _e(u.current, r), c.current?.setData(r), me(r);
	};
	(0, _.useEffect)(() => {
		let e = s.current;
		if (!e) return;
		let t = new ae.default(e, {
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
				c.current = t;
				let n = t.getImageData();
				f.current = n.naturalWidth > 0 ? n.width / n.naturalWidth : 1, me(pe(t.getData(!0)));
			},
			crop: (e) => me(pe(e.detail)),
			cropstart: () => {
				d.current = u.current;
			},
			cropend: (e) => {
				let t = e.currentTarget.cropper, n = pe(t.getData(!0));
				d.current && _e(d.current, n), d.current = null, me(n);
			}
		});
		return c.current = t, () => {
			t.destroy(), c.current = null;
		};
	}, [
		n,
		t.height,
		t.width
	]);
	let ye = (e) => {
		let t = c.current;
		if (C(e), !t) return;
		let n = u.current;
		t.setAspectRatio(fe(e));
		let r = pe(t.getData(!0));
		_e(n, r), me(r);
	}, be = () => {
		let e = p.current, t = e.at(-1);
		t && (he(e.slice(0, -1)), ge([u.current, ...m.current]), c.current?.setData(t), me(t));
	}, xe = () => {
		let [e, ...t] = m.current;
		e && (ge(t), he([...p.current, u.current]), c.current?.setData(e), me(e));
	}, Se = () => {
		let e = c.current;
		if (!e) return;
		let t = u.current;
		e.reset().setAspectRatio(fe());
		let n = e.getImageData();
		f.current = n.naturalWidth > 0 ? n.width / n.naturalWidth : 1, T(1);
		let r = pe(e.getData(!0));
		_e(t, r), me(r);
	}, Ce = async () => {
		let e = c.current ? pe(c.current.getData(!0)) : u.current, t = te.trim(), n = P === "" ? t : `${t}.${P}`, r = O === "copy" ? {
			mode: O,
			...te === F ? {} : { name: n }
		} : { mode: O };
		le(""), ie(!0);
		try {
			await o([{
				type: "crop",
				...e
			}], r);
		} catch (e) {
			le(e instanceof Error ? e.message : String(e));
		} finally {
			ie(!1);
		}
	};
	return /* @__PURE__ */ (0, A.jsxs)(N, {
		title: `${i.crop}: ${e.name}`,
		closeLabel: i.close,
		onClose: a,
		className: "sf-image-editor",
		footer: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
			/* @__PURE__ */ (0, A.jsxs)("span", { children: [
				h.width,
				" × ",
				h.height,
				" px"
			] }),
			/* @__PURE__ */ (0, A.jsx)("button", {
				onClick: a,
				children: i.cancel
			}),
			/* @__PURE__ */ (0, A.jsx)("button", {
				className: "primary",
				disabled: re || de !== null,
				onClick: () => void Ce(),
				children: re ? i.saving : i.save
			})
		] }),
		children: [
			/* @__PURE__ */ (0, A.jsxs)("div", {
				className: "sf-editor-toolbar",
				children: [
					/* @__PURE__ */ (0, A.jsxs)("select", {
						"aria-label": i.ratio,
						value: S,
						onChange: (e) => ye(e.target.value),
						children: [
							/* @__PURE__ */ (0, A.jsx)("option", {
								value: "free",
								children: i.free
							}),
							/* @__PURE__ */ (0, A.jsx)("option", {
								value: "original",
								children: i.original
							}),
							/* @__PURE__ */ (0, A.jsx)("option", {
								value: "1:1",
								children: "1:1"
							}),
							/* @__PURE__ */ (0, A.jsx)("option", {
								value: "4:3",
								children: "4:3"
							}),
							/* @__PURE__ */ (0, A.jsx)("option", {
								value: "16:9",
								children: "16:9"
							})
						]
					}),
					/* @__PURE__ */ (0, A.jsxs)("label", { children: [i.zoom, /* @__PURE__ */ (0, A.jsx)("input", {
						type: "range",
						min: "1",
						max: "3",
						step: "0.05",
						value: w,
						onChange: (e) => {
							let t = Number(e.target.value);
							T(t), c.current?.zoomTo(f.current * t);
						}
					})] }),
					/* @__PURE__ */ (0, A.jsx)("button", {
						disabled: v.length === 0,
						onClick: be,
						children: i.undo
					}),
					/* @__PURE__ */ (0, A.jsx)("button", {
						disabled: b.length === 0,
						onClick: xe,
						children: i.redo
					}),
					/* @__PURE__ */ (0, A.jsx)("button", {
						onClick: Se,
						children: i.reset
					}),
					/* @__PURE__ */ (0, A.jsx)("button", {
						onPointerDown: () => D(!0),
						onPointerUp: () => D(!1),
						onPointerLeave: () => D(!1),
						children: i.compare
					})
				]
			}),
			/* @__PURE__ */ (0, A.jsx)("div", {
				className: `sf-editor-canvas${E ? " sf-editor-comparing" : ""}`,
				tabIndex: 0,
				onKeyDown: (e) => {
					let t = e.shiftKey ? 10 : 1, n = e.key === "ArrowLeft" ? [-t, 0] : e.key === "ArrowRight" ? [t, 0] : e.key === "ArrowUp" ? [0, -t] : e.key === "ArrowDown" ? [0, t] : null;
					n && (e.preventDefault(), ve({
						...u.current,
						x: u.current.x + n[0],
						y: u.current.y + n[1]
					})), (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && (e.preventDefault(), e.shiftKey ? xe() : be());
				},
				children: /* @__PURE__ */ (0, A.jsx)("img", {
					ref: s,
					src: n,
					alt: ""
				})
			}),
			/* @__PURE__ */ (0, A.jsxs)("div", {
				className: "sf-editor-fields",
				children: [
					[
						"x",
						"y",
						"width",
						"height"
					].map((e) => /* @__PURE__ */ (0, A.jsxs)("label", { children: [i[e] || e, /* @__PURE__ */ (0, A.jsx)("input", {
						type: "number",
						min: +(e === "width" || e === "height"),
						value: h[e],
						onChange: (t) => ve({
							...u.current,
							[e]: Number(t.target.value)
						})
					})] }, e)),
					/* @__PURE__ */ (0, A.jsxs)("label", { children: [i.saveMode, /* @__PURE__ */ (0, A.jsxs)("select", {
						value: O,
						onChange: (e) => ee(e.target.value),
						children: [/* @__PURE__ */ (0, A.jsx)("option", {
							value: "copy",
							children: i.saveCopy
						}), /* @__PURE__ */ (0, A.jsx)("option", {
							value: "overwrite",
							children: i.overwrite
						})]
					})] }),
					O === "copy" && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
						/* @__PURE__ */ (0, A.jsxs)("label", { children: [i.fileName, /* @__PURE__ */ (0, A.jsxs)("span", {
							className: "sf-name-input",
							children: [/* @__PURE__ */ (0, A.jsx)("input", {
								value: te,
								maxLength: r,
								onChange: (e) => ne(e.target.value)
							}), P && /* @__PURE__ */ (0, A.jsxs)("span", {
								"aria-hidden": "true",
								children: [".", P]
							})]
						})] }),
						/* @__PURE__ */ (0, A.jsxs)("small", { children: [
							Array.from(ue).length,
							" / ",
							r,
							" · ",
							i.formatLocked.replace("{extension}", P === "" ? "" : `.${P}`)
						] }),
						de && te !== "" && /* @__PURE__ */ (0, A.jsx)("p", {
							className: "sf-warning",
							role: "alert",
							children: de === "tooLong" ? i.fileNameTooLong.replace("{maximum}", String(r)) : i.invalidFileName
						})
					] }),
					O === "overwrite" && /* @__PURE__ */ (0, A.jsx)("p", {
						className: "sf-warning",
						role: "alert",
						children: i.overwriteWarning
					}),
					L && /* @__PURE__ */ (0, A.jsx)("p", {
						className: "sf-warning",
						role: "alert",
						children: L
					}),
					/* @__PURE__ */ (0, A.jsx)("small", { children: i.panHint })
				]
			})
		]
	});
}
//#endregion
//#region src/components/TrashDialog.tsx
function ue({ api: e, resource: t, locale: n, labels: r, onClose: i, onChanged: a }) {
	let [o, s] = (0, _.useState)({
		items: [],
		total: 0,
		offset: 0,
		limit: 50,
		usedItems: 0,
		usedBytes: 0,
		maxItems: 0,
		maxBytes: 0
	}), [c, l] = (0, _.useState)(0), [u, d] = (0, _.useState)(""), [f, p] = (0, _.useState)(!0), [m, h] = (0, _.useState)(""), [g, v] = (0, _.useState)(null), y = (0, _.useCallback)((n = c) => {
		p(!0), h(""), e.trash(t, n, 50, u).then((e) => {
			s(e), l(e.offset);
		}).catch((e) => h(e instanceof Error ? e.message : String(e))).finally(() => p(!1));
	}, [
		e,
		c,
		t,
		u
	]);
	(0, _.useEffect)(() => {
		let e = window.setTimeout(() => y(c), 200);
		return () => window.clearTimeout(e);
	}, [y, c]);
	let b = async (n) => {
		try {
			await e.restoreTrash(t, n.id, "cancel"), y(c), a();
		} catch (e) {
			if (e instanceof Error && "code" in e && e.code === "conflict") {
				v(n);
				return;
			}
			h(e instanceof Error ? e.message : String(e));
		}
	}, x = async (n) => {
		if (g) try {
			await e.restoreTrash(t, g.id, n), v(null), y(c), a();
		} catch (e) {
			h(e instanceof Error ? e.message : String(e));
		}
	}, S = async (n) => {
		try {
			await e.permanentlyDeleteTrash(t, n.id), y(c);
		} catch (e) {
			h(e instanceof Error ? e.message : String(e));
		}
	}, C = (e) => e < 1024 ? `${e} B` : e < 1024 ** 2 ? `${(e / 1024).toFixed(1)} KB` : e < 1024 ** 3 ? `${(e / 1024 ** 2).toFixed(1)} MB` : `${(e / 1024 ** 3).toFixed(1)} GB`, w = o.total === 0 ? 0 : o.offset + 1, T = Math.min(o.offset + o.items.length, o.total);
	return /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsxs)(N, {
		title: r.title,
		closeLabel: r.close,
		onClose: i,
		className: "sf-trash-modal",
		footer: /* @__PURE__ */ (0, A.jsx)("button", {
			className: "primary",
			onClick: i,
			children: r.close
		}),
		children: [
			m && /* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-notice",
				role: "alert",
				children: m
			}),
			/* @__PURE__ */ (0, A.jsxs)("div", {
				className: "sf-trash-usage",
				children: [/* @__PURE__ */ (0, A.jsxs)("div", { children: [/* @__PURE__ */ (0, A.jsx)("strong", { children: r.usage }), /* @__PURE__ */ (0, A.jsxs)("span", { children: [
					C(o.usedBytes),
					" / ",
					C(o.maxBytes),
					" · ",
					o.usedItems,
					" / ",
					o.maxItems,
					" ",
					r.items
				] })] }), /* @__PURE__ */ (0, A.jsx)("progress", {
					max: Math.max(1, o.maxBytes),
					value: Math.min(o.usedBytes, o.maxBytes)
				})]
			}),
			/* @__PURE__ */ (0, A.jsxs)("div", {
				className: "sf-trash-search",
				children: [
					/* @__PURE__ */ (0, A.jsx)(M, { name: "search" }),
					/* @__PURE__ */ (0, A.jsx)("input", {
						value: u,
						onChange: (e) => {
							d(e.target.value), l(0);
						},
						placeholder: r.search,
						"aria-label": r.search
					}),
					u && /* @__PURE__ */ (0, A.jsx)("button", {
						onClick: () => d(""),
						"aria-label": r.close,
						children: /* @__PURE__ */ (0, A.jsx)(M, { name: "close" })
					})
				]
			}),
			/* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-trash-list",
				children: f ? /* @__PURE__ */ (0, A.jsx)("p", { children: "…" }) : o.items.length === 0 ? /* @__PURE__ */ (0, A.jsx)("p", { children: r.empty }) : o.items.map((e) => /* @__PURE__ */ (0, A.jsxs)("article", { children: [
					/* @__PURE__ */ (0, A.jsxs)("div", { children: [
						/* @__PURE__ */ (0, A.jsx)("strong", { children: e.path.split("/").pop() }),
						/* @__PURE__ */ (0, A.jsx)("small", {
							title: e.path,
							children: e.path
						}),
						/* @__PURE__ */ (0, A.jsxs)("small", { children: [
							e.directory ? r.items : C(e.size),
							" · ",
							r.expires,
							": ",
							new Intl.DateTimeFormat(n, { dateStyle: "medium" }).format(e.expiresAt * 1e3)
						] })
					] }),
					/* @__PURE__ */ (0, A.jsx)("button", {
						onClick: () => void b(e),
						children: r.restore
					}),
					/* @__PURE__ */ (0, A.jsx)("button", {
						className: "danger",
						onClick: () => void S(e),
						children: r.permanentDelete
					})
				] }, e.id))
			}),
			o.total > o.limit && /* @__PURE__ */ (0, A.jsxs)("nav", {
				className: "sf-trash-pagination",
				"aria-label": r.title,
				children: [
					/* @__PURE__ */ (0, A.jsxs)("button", {
						disabled: o.offset === 0 || f,
						onClick: () => l(Math.max(0, o.offset - o.limit)),
						children: [
							/* @__PURE__ */ (0, A.jsx)(M, { name: "chevron-left" }),
							" ",
							r.previous
						]
					}),
					/* @__PURE__ */ (0, A.jsxs)("span", { children: [
						w,
						"–",
						T,
						" / ",
						o.total
					] }),
					/* @__PURE__ */ (0, A.jsxs)("button", {
						disabled: o.offset + o.limit >= o.total || f,
						onClick: () => l(o.offset + o.limit),
						children: [
							r.next,
							" ",
							/* @__PURE__ */ (0, A.jsx)(M, { name: "chevron-right" })
						]
					})
				]
			})
		]
	}), g && /* @__PURE__ */ (0, A.jsx)(N, {
		title: r.conflict,
		closeLabel: r.close,
		onClose: () => v(null),
		className: "sf-confirm-modal",
		footer: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
			/* @__PURE__ */ (0, A.jsx)("button", {
				onClick: () => v(null),
				children: r.cancel
			}),
			/* @__PURE__ */ (0, A.jsx)("button", {
				onClick: () => void x("rename"),
				children: r.autoRename
			}),
			/* @__PURE__ */ (0, A.jsx)("button", {
				className: "danger",
				onClick: () => void x("overwrite"),
				children: r.overwrite
			})
		] }),
		children: /* @__PURE__ */ (0, A.jsx)("div", {
			className: "sf-form-body",
			children: /* @__PURE__ */ (0, A.jsx)("p", { children: g.path })
		})
	})] });
}
//#endregion
//#region src/components/TagsDialog.tsx
function de({ initial: e, suggestions: t, labels: n, onSave: r, onClose: i }) {
	let [a, o] = (0, _.useState)(() => e.slice(0, 10)), [s, c] = (0, _.useState)(""), l = (0, _.useMemo)(() => new Set(a.map((e) => e.toLocaleLowerCase())), [a]), u = t.filter((e) => !l.has(e.toLocaleLowerCase()) && (s.trim() === "" || e.toLocaleLowerCase().includes(s.trim().toLocaleLowerCase()))).slice(0, 8), d = (e = s) => {
		let t = e.trim().replace(/^[,，]+|[,，]+$/gu, "");
		t === "" || Array.from(t).length > 30 || a.length >= 10 || l.has(t.toLocaleLowerCase()) || (o((e) => [...e, t]), c(""));
	}, f = (e) => o((t) => t.filter((t) => t !== e));
	return /* @__PURE__ */ (0, A.jsx)(N, {
		title: n.title,
		closeLabel: n.close,
		onClose: i,
		className: "sf-tags-modal",
		footer: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
			/* @__PURE__ */ (0, A.jsxs)("span", { children: [a.length, " / 10"] }),
			/* @__PURE__ */ (0, A.jsx)("button", {
				onClick: i,
				children: n.cancel
			}),
			/* @__PURE__ */ (0, A.jsx)("button", {
				className: "primary",
				onClick: () => r(a),
				children: n.save
			})
		] }),
		children: /* @__PURE__ */ (0, A.jsxs)("div", {
			className: "sf-tags-editor",
			children: [
				/* @__PURE__ */ (0, A.jsxs)("div", {
					className: "sf-tags-input",
					onClick: (e) => e.currentTarget.querySelector("input")?.focus(),
					children: [a.map((e) => /* @__PURE__ */ (0, A.jsxs)("span", { children: [e, /* @__PURE__ */ (0, A.jsx)("button", {
						type: "button",
						onClick: () => f(e),
						"aria-label": `${n.close}: ${e}`,
						children: /* @__PURE__ */ (0, A.jsx)(M, { name: "close" })
					})] }, e)), /* @__PURE__ */ (0, A.jsx)("input", {
						autoFocus: !0,
						value: s,
						maxLength: 30,
						disabled: a.length >= 10,
						placeholder: a.length === 0 ? n.input : "",
						onChange: (e) => {
							let t = e.target.value;
							/[,，]$/u.test(t) ? d(t) : c(t);
						},
						onKeyDown: (e) => {
							(e.key === "Enter" || e.key === ",") && (e.preventDefault(), d()), e.key === "Backspace" && s === "" && a.length > 0 && f(a.at(-1) || "");
						},
						onBlur: () => d()
					})]
				}),
				u.length > 0 && /* @__PURE__ */ (0, A.jsx)("div", {
					className: "sf-tag-suggestions",
					children: u.map((e) => /* @__PURE__ */ (0, A.jsxs)("button", {
						type: "button",
						onMouseDown: (e) => e.preventDefault(),
						onClick: () => d(e),
						children: [
							/* @__PURE__ */ (0, A.jsx)(M, { name: "add" }),
							" ",
							e
						]
					}, e))
				}),
				/* @__PURE__ */ (0, A.jsxs)("small", { children: [
					n.hint,
					" · ",
					n.maximum
				] })
			]
		})
	});
}
//#endregion
//#region src/components/UrlDialog.tsx
function fe({ url: e, loginRequired: t, expiresAt: n, labels: r, onClose: i }) {
	let a = (0, _.useRef)(null), [o, s] = (0, _.useState)("");
	(0, _.useEffect)(() => a.current?.select(), []);
	let c = async () => {
		a.current?.focus(), a.current?.select();
		try {
			await navigator.clipboard.writeText(e), s("copied");
		} catch {
			s("failed");
		}
	};
	return /* @__PURE__ */ (0, A.jsx)(N, {
		title: r.title,
		closeLabel: r.close,
		onClose: i,
		className: "sf-url-modal",
		footer: /* @__PURE__ */ (0, A.jsx)("button", {
			className: "primary",
			onClick: i,
			children: r.close
		}),
		children: /* @__PURE__ */ (0, A.jsxs)("div", {
			className: "sf-url-dialog-body",
			children: [
				/* @__PURE__ */ (0, A.jsx)("p", { children: r.hint }),
				/* @__PURE__ */ (0, A.jsx)("input", {
					ref: a,
					autoFocus: !0,
					readOnly: !0,
					value: e,
					"aria-label": r.title,
					onFocus: (e) => e.currentTarget.select(),
					onClick: () => void c()
				}),
				t && /* @__PURE__ */ (0, A.jsx)("small", { children: r.loginRequired }),
				n && /* @__PURE__ */ (0, A.jsxs)("small", { children: [
					r.expires,
					": ",
					/* @__PURE__ */ (0, A.jsx)("time", {
						dateTime: (/* @__PURE__ */ new Date(n * 1e3)).toISOString(),
						children: (/* @__PURE__ */ new Date(n * 1e3)).toLocaleString()
					})
				] }),
				/* @__PURE__ */ (0, A.jsx)("span", {
					role: "status",
					"aria-live": "polite",
					children: o === "copied" ? r.copied : o === "failed" ? r.failed : ""
				})
			]
		})
	});
}
//#endregion
//#region src/components/EntryVisuals.tsx
var pe = (e) => e.includes(".") && e.split(".").pop()?.toLowerCase() || "", me = (e, t) => t.includes(e), he = (e, t = null, n = !1) => {
	if (n) return "folder";
	let r = pe(e), i = (t || "").toLowerCase();
	return r === "pdf" || i === "application/pdf" ? "pdf" : me(r, [
		"doc",
		"docx",
		"odt",
		"rtf"
	]) || i.includes("wordprocessing") || i.includes("msword") || i.includes("opendocument.text") ? "word" : me(r, [
		"xls",
		"xlsx",
		"ods",
		"csv",
		"tsv"
	]) || i.includes("spreadsheet") || i.includes("ms-excel") || i.includes("opendocument.spreadsheet") || i === "text/csv" ? "sheet" : me(r, [
		"ppt",
		"pptx",
		"odp"
	]) || i.includes("presentation") || i.includes("ms-powerpoint") ? "slides" : me(r, [
		"zip",
		"rar",
		"7z",
		"tar",
		"gz",
		"bz2",
		"xz",
		"tgz"
	]) || i.includes("zip") || i.includes("compressed") || i.includes("archive") ? "archive" : i.startsWith("image/") || me(r, [
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
	]) ? "image" : i.startsWith("audio/") || me(r, [
		"mp3",
		"wav",
		"flac",
		"aac",
		"ogg",
		"m4a"
	]) ? "audio" : i.startsWith("video/") || me(r, [
		"mp4",
		"webm",
		"mov",
		"avi",
		"mkv",
		"m4v"
	]) ? "video" : me(r, [
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
	]) || ["application/json", "application/xml"].includes(i) ? "code" : i.startsWith("text/") || me(r, [
		"txt",
		"md",
		"log",
		"ini",
		"conf"
	]) ? "text" : "file";
}, ge = (e) => /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
	/* @__PURE__ */ (0, A.jsx)("path", {
		d: "M10 5h19l9 9v29H10z",
		fill: "currentColor",
		opacity: ".1"
	}),
	/* @__PURE__ */ (0, A.jsx)("path", {
		d: "M10 5h19l9 9v29H10zM29 5v10h9",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}),
	/* @__PURE__ */ (0, A.jsx)("rect", {
		x: "6",
		y: "27",
		width: "36",
		height: "14",
		rx: "3",
		fill: "currentColor"
	}),
	/* @__PURE__ */ (0, A.jsx)("text", {
		x: "24",
		y: "37",
		textAnchor: "middle",
		fontSize: 8.5,
		fontWeight: "800",
		fill: "white",
		stroke: "none",
		children: e
	})
] }), _e = ({ kind: e, name: t = "", mimeType: n = null, directory: r = !1 }) => (e ?? (e = he(t, n, r)), e === "folder" ? /* @__PURE__ */ (0, A.jsxs)("svg", {
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, A.jsx)("path", {
		d: "M5 12h15l4 5h19v23H5z",
		fill: "currentColor",
		opacity: ".2"
	}), /* @__PURE__ */ (0, A.jsx)("path", {
		d: "M5 12h15l4 5h19v23H5z",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	})]
}) : e === "image" ? /* @__PURE__ */ (0, A.jsxs)("svg", {
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ (0, A.jsx)("rect", {
			x: "7",
			y: "5",
			width: "34",
			height: "38",
			rx: "4",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5"
		}),
		/* @__PURE__ */ (0, A.jsx)("circle", {
			cx: "17",
			cy: "16",
			r: "4",
			fill: "currentColor",
			opacity: ".35"
		}),
		/* @__PURE__ */ (0, A.jsx)("path", {
			d: "m10 37 10-11 7 7 5-5 7 9",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5",
			strokeLinejoin: "round"
		})
	]
}) : e === "pdf" ? /* @__PURE__ */ (0, A.jsx)("svg", {
	className: "sf-file-icon-pdf",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: ge("PDF")
}) : e === "word" ? /* @__PURE__ */ (0, A.jsx)("svg", {
	className: "sf-file-icon-word",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: ge("DOC")
}) : e === "sheet" ? /* @__PURE__ */ (0, A.jsx)("svg", {
	className: "sf-file-icon-sheet",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: ge("XLS")
}) : e === "slides" ? /* @__PURE__ */ (0, A.jsx)("svg", {
	className: "sf-file-icon-slides",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: ge("PPT")
}) : e === "archive" ? /* @__PURE__ */ (0, A.jsxs)("svg", {
	className: "sf-file-icon-archive",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ (0, A.jsx)("path", {
			d: "M10 5h19l9 9v29H10zM29 5v10h9",
			fill: "currentColor",
			opacity: ".1",
			stroke: "currentColor",
			strokeWidth: "2.5",
			strokeLinejoin: "round"
		}),
		/* @__PURE__ */ (0, A.jsx)("path", {
			d: "M23 7h5v5h-5v5h5v5h-5v5h5",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5"
		}),
		/* @__PURE__ */ (0, A.jsx)("rect", {
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
}) : e === "audio" ? /* @__PURE__ */ (0, A.jsxs)("svg", {
	className: "sf-file-icon-audio",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ (0, A.jsx)("path", {
			d: "M18 36V13l20-4v22",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "3",
			strokeLinejoin: "round"
		}),
		/* @__PURE__ */ (0, A.jsx)("ellipse", {
			cx: "12",
			cy: "36",
			rx: "7",
			ry: "5",
			fill: "currentColor",
			opacity: ".75"
		}),
		/* @__PURE__ */ (0, A.jsx)("ellipse", {
			cx: "32",
			cy: "31",
			rx: "7",
			ry: "5",
			fill: "currentColor",
			opacity: ".75"
		})
	]
}) : e === "video" ? /* @__PURE__ */ (0, A.jsxs)("svg", {
	className: "sf-file-icon-video",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, A.jsx)("rect", {
		x: "5",
		y: "8",
		width: "38",
		height: "32",
		rx: "5",
		fill: "currentColor",
		opacity: ".12",
		stroke: "currentColor",
		strokeWidth: "2.5"
	}), /* @__PURE__ */ (0, A.jsx)("path", {
		d: "m20 17 13 7-13 7z",
		fill: "currentColor"
	})]
}) : e === "code" ? /* @__PURE__ */ (0, A.jsxs)("svg", {
	className: "sf-file-icon-code",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, A.jsx)("path", {
		d: "M10 5h19l9 9v29H10zM29 5v10h9",
		fill: "currentColor",
		opacity: ".08",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}), /* @__PURE__ */ (0, A.jsx)("path", {
		d: "m20 22-6 6 6 6m8-12 6 6-6 6m-2-15-4 18",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	})]
}) : e === "text" ? /* @__PURE__ */ (0, A.jsxs)("svg", {
	className: "sf-file-icon-text",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, A.jsx)("path", {
		d: "M10 5h19l9 9v29H10zM29 5v10h9",
		fill: "currentColor",
		opacity: ".08",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}), /* @__PURE__ */ (0, A.jsx)("path", {
		d: "M16 22h16M16 28h16M16 34h11",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinecap: "round"
	})]
}) : /* @__PURE__ */ (0, A.jsxs)("svg", {
	className: "sf-file-icon-generic",
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, A.jsx)("path", {
		d: "M10 5h19l9 9v29H10z",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}), /* @__PURE__ */ (0, A.jsx)("path", {
		d: "M29 5v10h9",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5"
	})]
})), ve = () => /* @__PURE__ */ (0, A.jsx)("svg", {
	viewBox: "0 0 24 24",
	"aria-hidden": "true",
	children: /* @__PURE__ */ (0, A.jsx)("path", {
		d: "M9.5 14.5 14.5 9M7.8 17.2l-1.1 1.1a3.5 3.5 0 0 1-5-5l3.6-3.6a3.5 3.5 0 0 1 5 0M16.2 6.8l1.1-1.1a3.5 3.5 0 1 1 5 5l-3.6 3.6a3.5 3.5 0 0 1-5 0",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round"
	})
}), ye = ({ src: e, alt: t, lazy: n = !1 }) => {
	let [r, i] = (0, _.useState)(0), [a, o] = (0, _.useState)(!1), s = (0, _.useRef)(null);
	if ((0, _.useEffect)(() => (i(0), o(!1), () => {
		s.current !== null && window.clearTimeout(s.current);
	}), [e]), a) return /* @__PURE__ */ (0, A.jsx)(_e, { kind: "image" });
	let c = r === 0 ? e : `${e}${e.includes("?") ? "&" : "?"}retry=${r}`;
	return /* @__PURE__ */ (0, A.jsx)("img", {
		src: c,
		alt: t,
		loading: n ? "lazy" : void 0,
		decoding: "async",
		onError: () => {
			if (s.current !== null && window.clearTimeout(s.current), r >= 2) {
				o(!0);
				return;
			}
			s.current = window.setTimeout(() => i((e) => e + 1), 700 * (r + 1));
		}
	});
}, be = (e) => e < 1024 ? `${e} B` : e < 1024 ** 2 ? `${(e / 1024).toFixed(1)} KB` : `${(e / 1024 ** 2).toFixed(1)} MB`;
//#endregion
//#region src/components/UploadQueue.tsx
function xe({ tasks: e, collapsed: t, labels: n, onToggle: r, onCancel: i, onCancelAll: a, onClearFinished: o, onRetry: s, onRemove: c }) {
	if (e.length === 0) return null;
	let l = e.some((e) => e.status === "queued" || e.status === "uploading"), u = e.filter((e) => e.status !== "queued" && e.status !== "uploading").length;
	return /* @__PURE__ */ (0, A.jsxs)("section", {
		className: `sf-upload-panel${t ? " collapsed" : ""}`,
		"aria-label": n.title,
		children: [/* @__PURE__ */ (0, A.jsxs)("header", { children: [
			/* @__PURE__ */ (0, A.jsx)("button", {
				className: "sf-upload-collapse",
				onClick: r,
				"aria-expanded": !t,
				title: t ? n.expand : n.collapse,
				children: /* @__PURE__ */ (0, A.jsx)(M, { name: t ? "chevron-right" : "chevron-down" })
			}),
			/* @__PURE__ */ (0, A.jsx)("strong", { children: n.title }),
			/* @__PURE__ */ (0, A.jsxs)("span", { children: [
				u,
				"/",
				e.length
			] }),
			/* @__PURE__ */ (0, A.jsx)("button", {
				onClick: a,
				disabled: !l,
				children: n.cancelAll
			}),
			/* @__PURE__ */ (0, A.jsx)("button", {
				onClick: o,
				children: n.clearFinished
			})
		] }), !t && /* @__PURE__ */ (0, A.jsx)("div", {
			className: "sf-upload-list",
			children: e.map((e) => /* @__PURE__ */ (0, A.jsxs)("div", {
				className: `sf-upload-task ${e.status}`,
				children: [
					/* @__PURE__ */ (0, A.jsx)("span", {
						className: "sf-upload-name",
						title: e.name,
						children: e.name
					}),
					/* @__PURE__ */ (0, A.jsx)("progress", {
						max: "100",
						value: e.progress,
						"aria-label": `${e.name}: ${e.progress}%`
					}),
					/* @__PURE__ */ (0, A.jsx)("span", { children: e.status === "uploading" ? `${e.progress}%` : n.status(e.status) }),
					(e.status === "queued" || e.status === "uploading") && /* @__PURE__ */ (0, A.jsx)("button", {
						onClick: () => i(e.id),
						children: n.cancel
					}),
					(e.status === "error" || e.status === "cancelled") && /* @__PURE__ */ (0, A.jsx)("button", {
						onClick: () => s(e.id),
						children: n.retry
					}),
					/* @__PURE__ */ (0, A.jsx)("button", {
						className: "sf-upload-remove",
						onClick: () => c(e.id),
						title: n.remove,
						"aria-label": `${n.remove}: ${e.name}`,
						children: /* @__PURE__ */ (0, A.jsx)(M, { name: "close" })
					}),
					e.message && /* @__PURE__ */ (0, A.jsx)("small", {
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
function Se({ api: e, resource: t, selectedEntries: n, selected: r, imageInfo: i, metadata: a, showTags: o, previewImage: s, selectMode: c, selectAllowed: l, labels: u, formatDate: d, onChoose: f, onOpenUrl: p, pluginActions: m }) {
	return /* @__PURE__ */ (0, A.jsxs)("aside", {
		className: "sf-details",
		children: [/* @__PURE__ */ (0, A.jsx)("h2", { children: u.details }), n.length > 1 ? /* @__PURE__ */ (0, A.jsxs)("div", {
			className: "sf-state",
			children: [
				n.length,
				" ",
				u.selected
			]
		}) : r ? /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
			/* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-preview",
				children: s ? /* @__PURE__ */ (0, A.jsx)(ye, {
					src: e.thumbnailUrl(t, r, 800, 600),
					alt: r.name
				}) : /* @__PURE__ */ (0, A.jsx)(_e, {
					name: r.name,
					mimeType: r.mimeType,
					directory: r.directory
				})
			}),
			/* @__PURE__ */ (0, A.jsx)("h3", { children: r.name }),
			/* @__PURE__ */ (0, A.jsxs)("dl", { children: [
				/* @__PURE__ */ (0, A.jsx)("dt", { children: u.type }),
				/* @__PURE__ */ (0, A.jsx)("dd", { children: r.directory ? u.folder : r.mimeType || u.file }),
				/* @__PURE__ */ (0, A.jsx)("dt", { children: u.size }),
				/* @__PURE__ */ (0, A.jsx)("dd", { children: r.directory ? "—" : be(r.size) }),
				i && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("dt", { children: u.dimensions }), /* @__PURE__ */ (0, A.jsxs)("dd", { children: [
					i.width,
					" × ",
					i.height,
					" px"
				] })] }),
				/* @__PURE__ */ (0, A.jsx)("dt", { children: u.modified }),
				/* @__PURE__ */ (0, A.jsx)("dd", { children: /* @__PURE__ */ (0, A.jsx)("time", {
					dateTime: (/* @__PURE__ */ new Date(r.modifiedAt * 1e3)).toISOString(),
					children: d(r.modifiedAt)
				}) }),
				/* @__PURE__ */ (0, A.jsx)("dt", { children: u.location }),
				/* @__PURE__ */ (0, A.jsx)("dd", { children: r.path })
			] }),
			o && (a.tags[r.path] || []).length > 0 && /* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-tags",
				children: a.tags[r.path].map((e) => /* @__PURE__ */ (0, A.jsx)("span", { children: e }, e))
			}),
			c && !r.directory && r.url && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("button", {
				className: "sf-select primary",
				disabled: !l,
				onClick: f,
				children: u.select
			}), !l && /* @__PURE__ */ (0, A.jsx)("p", {
				className: "sf-warning",
				role: "status",
				children: u.unsupportedWebImage
			})] }),
			!r.directory && /* @__PURE__ */ (0, A.jsxs)("div", {
				className: "sf-detail-actions",
				children: [/* @__PURE__ */ (0, A.jsx)("a", {
					className: "sf-download",
					href: r.url || e.downloadUrl(t, r.path),
					children: u.download
				}), /* @__PURE__ */ (0, A.jsx)("button", {
					type: "button",
					className: "sf-icon-button",
					onClick: () => p(r),
					title: u.copyUrl,
					"aria-label": u.copyUrl,
					children: /* @__PURE__ */ (0, A.jsx)(ve, {})
				})]
			}),
			m && /* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-plugin-detail-actions",
				children: m
			})
		] }) : /* @__PURE__ */ (0, A.jsx)("div", {
			className: "sf-state",
			children: "—"
		})]
	});
}
//#endregion
//#region src/components/SettingsDialog.tsx
function Ce({ resource: e, tools: t, features: n, columns: r, viewSizes: i, availability: a, scale: o, translate: s, onToolChange: c, onFeatureChange: l, onColumnChange: u, onViewSizeChange: d, onScaleChange: f, onClose: p }) {
	let m = s;
	return /* @__PURE__ */ (0, A.jsxs)(N, {
		title: m("settings"),
		closeLabel: m("close"),
		onClose: p,
		className: "sf-settings-modal",
		footer: /* @__PURE__ */ (0, A.jsx)("button", {
			className: "primary",
			onClick: p,
			children: m("done")
		}),
		children: [
			/* @__PURE__ */ (0, A.jsx)("p", { children: m("toolSettingsHint") }),
			e && /* @__PURE__ */ (0, A.jsxs)("p", {
				className: "sf-configured-limits",
				children: [
					m("configuredLimits"),
					": ",
					m("fileName"),
					" ",
					e.maxFileNameLength,
					" · ",
					m("folderName"),
					" ",
					e.maxFolderNameLength,
					" · ",
					m("folderDepth"),
					" ",
					e.maxFolderDepth
				]
			}),
			/* @__PURE__ */ (0, A.jsx)("h3", { children: m("interfaceScale") }),
			/* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-scale-options",
				role: "radiogroup",
				"aria-label": m("interfaceScale"),
				children: [
					"compact",
					"standard",
					"large",
					"xlarge"
				].map((e) => /* @__PURE__ */ (0, A.jsxs)("label", { children: [/* @__PURE__ */ (0, A.jsx)("input", {
					type: "radio",
					name: "sofinder-scale",
					value: e,
					checked: o === e,
					onChange: () => f(e)
				}), /* @__PURE__ */ (0, A.jsx)("span", { children: m(e === "compact" ? "scaleCompact" : e === "standard" ? "scaleStandard" : e === "large" ? "scaleLarge" : "scaleExtraLarge") })] }, e))
			}),
			["grid", "list"].map((e) => /* @__PURE__ */ (0, A.jsxs)("div", { children: [/* @__PURE__ */ (0, A.jsx)("h3", { children: m(e === "grid" ? "gridItemSize" : "listRowSize") }), /* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-scale-options",
				role: "radiogroup",
				"aria-label": m(e === "grid" ? "gridItemSize" : "listRowSize"),
				children: [
					"small",
					"medium",
					"large"
				].map((t) => /* @__PURE__ */ (0, A.jsxs)("label", { children: [/* @__PURE__ */ (0, A.jsx)("input", {
					type: "radio",
					name: `sofinder-${e}-size`,
					value: t,
					checked: i[e] === t,
					onChange: () => d(e, t)
				}), /* @__PURE__ */ (0, A.jsx)("span", { children: m(t === "small" ? "sizeSmall" : t === "medium" ? "sizeMedium" : "sizeLarge") })] }, t))
			})] }, e)),
			/* @__PURE__ */ (0, A.jsx)("h3", { children: m("optionalTools") }),
			a.batchRename !== !1 && /* @__PURE__ */ (0, A.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, A.jsx)("input", {
					type: "checkbox",
					checked: t.batchRename,
					onChange: (e) => c("batchRename", e.target.checked)
				}), /* @__PURE__ */ (0, A.jsx)("span", { children: m("batchRename") })]
			}),
			(a.imageEditing !== !1 || a.imageProcessing !== !1) && /* @__PURE__ */ (0, A.jsx)("h3", { children: m("imageTools") }),
			[
				"resize",
				"crop",
				"rotate",
				"presets",
				"process"
			].filter((e) => e === "process" ? a.imageProcessing !== !1 : a.imageEditing !== !1).map((e) => /* @__PURE__ */ (0, A.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, A.jsx)("input", {
					type: "checkbox",
					checked: t[e],
					onChange: (t) => c(e, t.target.checked)
				}), /* @__PURE__ */ (0, A.jsx)("span", { children: m(e === "presets" ? "preset" : e === "rotate" ? "rotationTools" : e === "process" ? "imageProcess" : e) })]
			}, e)),
			/* @__PURE__ */ (0, A.jsx)("h3", { children: m("listColumns") }),
			[
				"size",
				"modified",
				"type"
			].map((e) => /* @__PURE__ */ (0, A.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, A.jsx)("input", {
					type: "checkbox",
					checked: r[e],
					onChange: (t) => u(e, t.target.checked)
				}), /* @__PURE__ */ (0, A.jsx)("span", { children: m(e === "size" ? "showSizeColumn" : e === "modified" ? "showModifiedColumn" : "showTypeColumn") })]
			}, e)),
			/* @__PURE__ */ (0, A.jsx)("h3", { children: m("optionalFeatures") }),
			/* @__PURE__ */ (0, A.jsx)("p", { children: m("featureSettingsHint") }),
			[
				"autoCollapseUploads",
				"folderTree",
				"recent",
				"favorites",
				"tags",
				"archive",
				"trash"
			].filter((e) => e === "autoCollapseUploads" || a[e] !== !1).map((t) => /* @__PURE__ */ (0, A.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, A.jsx)("input", {
					type: "checkbox",
					checked: n[t],
					disabled: t === "trash" && e?.storageCapabilities?.recoverableDelete === !1,
					onChange: (e) => l(t, e.target.checked)
				}), /* @__PURE__ */ (0, A.jsx)("span", { children: m(t === "folderTree" ? "folderTreeFeature" : t === "favorites" ? "favoriteFeature" : t === "archive" ? "archiveFeature" : t === "trash" ? "trashFeature" : t === "tags" ? "tagsFeature" : t === "recent" ? "recentFeature" : "autoCollapseUploads") })]
			}, t))
		]
	});
}
//#endregion
//#region src/components/DestinationDialog.tsx
function we({ state: e, unsafe: t, translate: n, onBrowse: r, onConfirm: i, onClose: a }) {
	let o = n, s = e.path ? e.path.split("/") : [];
	return /* @__PURE__ */ (0, A.jsxs)(N, {
		title: e.operation === "move" ? o("moveDestination") : o("copyDestination"),
		closeLabel: o("close"),
		onClose: a,
		className: "sf-folder-modal",
		footer: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
			/* @__PURE__ */ (0, A.jsxs)("span", { children: [
				o("currentFolder"),
				": /",
				e.path
			] }),
			/* @__PURE__ */ (0, A.jsx)("button", {
				onClick: a,
				children: o("cancel")
			}),
			/* @__PURE__ */ (0, A.jsx)("button", {
				className: "primary",
				disabled: e.loading || t,
				onClick: () => i(e.operation, e.path),
				children: e.operation === "move" ? o("moveHere") : o("copyHere")
			})
		] }),
		children: [
			/* @__PURE__ */ (0, A.jsxs)("nav", {
				className: "sf-folder-crumbs",
				"aria-label": o("chooseFolder"),
				children: [/* @__PURE__ */ (0, A.jsx)("button", {
					onClick: () => r(e.operation, ""),
					children: o("rootFolder")
				}), s.map((t, n) => /* @__PURE__ */ (0, A.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, A.jsx)("button", {
					onClick: () => r(e.operation, s.slice(0, n + 1).join("/")),
					children: t
				})] }, `${t}-${n}`))]
			}),
			/* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-folder-list",
				children: e.loading ? /* @__PURE__ */ (0, A.jsx)("div", {
					className: "sf-state",
					children: o("loading")
				}) : e.folders.length === 0 ? /* @__PURE__ */ (0, A.jsx)("div", {
					className: "sf-state",
					children: o("noFolders")
				}) : e.folders.map((t) => /* @__PURE__ */ (0, A.jsxs)("button", {
					onDoubleClick: () => r(e.operation, t.path),
					onClick: () => r(e.operation, t.path),
					children: [
						/* @__PURE__ */ (0, A.jsx)("span", {
							className: "sf-folder-small",
							children: /* @__PURE__ */ (0, A.jsx)(_e, { kind: "folder" })
						}),
						t.name,
						/* @__PURE__ */ (0, A.jsx)("span", { children: "›" })
					]
				}, t.path))
			}),
			t && /* @__PURE__ */ (0, A.jsx)("p", {
				className: "sf-warning",
				role: "alert",
				children: o("unsafeDestination")
			})
		]
	});
}
//#endregion
//#region src/components/BulkRenameDialog.tsx
var Te = (e, t, n) => {
	let r = e.directory ? -1 : e.name.lastIndexOf("."), i = r > 0 ? e.name.slice(r) : "", a = i ? e.name.slice(0, r) : e.name;
	return t.replaceAll("{name}", a).replaceAll("{ext}", i).replaceAll("{n}", String(n + 1));
};
function Ee({ entries: e, maximum: t, labels: n, onClose: r, onSave: i }) {
	let [a, o] = (0, _.useState)("{name}-{n}{ext}"), s = (0, _.useMemo)(() => e.map((e, t) => ({
		path: e.path,
		name: Te(e, a, t)
	})), [e, a]), c = s.map((e) => e.name.toLocaleLowerCase()), l = new Set(c).size !== c.length, u = s.some((n, r) => I(n.name, t) !== null || !e[r].directory && n.name.slice(n.name.lastIndexOf(".")) !== e[r].name.slice(e[r].name.lastIndexOf(".")));
	return /* @__PURE__ */ (0, A.jsxs)(N, {
		title: n.title,
		closeLabel: n.close,
		onClose: r,
		className: "sf-bulk-rename-modal",
		footer: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("button", {
			onClick: r,
			children: n.cancel
		}), /* @__PURE__ */ (0, A.jsx)("button", {
			className: "primary",
			disabled: u || l || a.trim() === "",
			onClick: () => i(s),
			children: n.save
		})] }),
		children: [
			/* @__PURE__ */ (0, A.jsxs)("label", {
				className: "sf-field",
				children: [
					/* @__PURE__ */ (0, A.jsx)("span", { children: n.pattern }),
					/* @__PURE__ */ (0, A.jsx)("input", {
						autoFocus: !0,
						value: a,
						onChange: (e) => o(e.target.value),
						maxLength: t
					}),
					/* @__PURE__ */ (0, A.jsx)("small", { children: n.hint })
				]
			}),
			u && /* @__PURE__ */ (0, A.jsx)("p", {
				className: "sf-warning",
				role: "alert",
				children: n.invalid
			}),
			l && /* @__PURE__ */ (0, A.jsx)("p", {
				className: "sf-warning",
				role: "alert",
				children: n.duplicate
			}),
			/* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-rename-preview",
				children: /* @__PURE__ */ (0, A.jsxs)("table", { children: [/* @__PURE__ */ (0, A.jsx)("thead", { children: /* @__PURE__ */ (0, A.jsxs)("tr", { children: [/* @__PURE__ */ (0, A.jsx)("th", { children: n.oldName }), /* @__PURE__ */ (0, A.jsx)("th", { children: n.newName })] }) }), /* @__PURE__ */ (0, A.jsx)("tbody", { children: e.map((e, t) => /* @__PURE__ */ (0, A.jsxs)("tr", { children: [/* @__PURE__ */ (0, A.jsx)("td", { children: e.name }), /* @__PURE__ */ (0, A.jsx)("td", { children: s[t].name })] }, e.path)) })] })
			})
		]
	});
}
//#endregion
//#region src/components/SecurityStatusDialog.tsx
function De({ api: e, labels: t, formatDate: n, onClose: r }) {
	let [i, a] = (0, _.useState)(null), [o, s] = (0, _.useState)("");
	(0, _.useEffect)(() => {
		let t = !0;
		return e.securityStatus().then((e) => {
			t && a(e);
		}).catch((e) => {
			t && s(e instanceof Error ? e.message : String(e));
		}), () => {
			t = !1;
		};
	}, [e]);
	let c = i?.malwareScanning;
	return /* @__PURE__ */ (0, A.jsx)(N, {
		title: t.title,
		closeLabel: t.close,
		onClose: r,
		className: "sf-security-modal",
		footer: /* @__PURE__ */ (0, A.jsx)("button", {
			className: "primary",
			onClick: r,
			children: t.close
		}),
		children: o ? /* @__PURE__ */ (0, A.jsx)("p", {
			className: "sf-warning",
			role: "alert",
			children: o
		}) : c ? /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
			/* @__PURE__ */ (0, A.jsxs)("section", {
				className: `sf-security-summary sf-security-${c.status}`,
				children: [
					/* @__PURE__ */ (0, A.jsx)("span", {
						className: "sf-security-indicator",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, A.jsxs)("div", { children: [/* @__PURE__ */ (0, A.jsx)("strong", { children: c.enabled ? t.enabled : t.disabled }), /* @__PURE__ */ (0, A.jsx)("small", { children: c.message })] }),
					/* @__PURE__ */ (0, A.jsxs)("dl", { children: [
						/* @__PURE__ */ (0, A.jsx)("dt", { children: t.provider }),
						/* @__PURE__ */ (0, A.jsx)("dd", { children: c.provider ?? "—" }),
						/* @__PURE__ */ (0, A.jsx)("dt", { children: t.service }),
						/* @__PURE__ */ (0, A.jsx)("dd", { children: c.status })
					] })
				]
			}),
			/* @__PURE__ */ (0, A.jsxs)("div", {
				className: "sf-security-counts",
				"aria-label": t.scans,
				children: [
					/* @__PURE__ */ (0, A.jsxs)("span", { children: [/* @__PURE__ */ (0, A.jsx)("b", { children: c.counts.passed }), t.passed] }),
					/* @__PURE__ */ (0, A.jsxs)("span", { children: [/* @__PURE__ */ (0, A.jsx)("b", { children: c.counts.quarantined }), t.quarantined] }),
					/* @__PURE__ */ (0, A.jsxs)("span", { children: [/* @__PURE__ */ (0, A.jsx)("b", { children: c.counts.failed }), t.failed] }),
					/* @__PURE__ */ (0, A.jsxs)("span", { children: [/* @__PURE__ */ (0, A.jsx)("b", { children: c.counts.pending }), t.pending] })
				]
			}),
			/* @__PURE__ */ (0, A.jsx)("h3", { children: t.recent }),
			c.recent.length === 0 ? /* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-state",
				children: t.none
			}) : /* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-security-history",
				children: c.recent.map((e) => /* @__PURE__ */ (0, A.jsxs)("article", { children: [
					/* @__PURE__ */ (0, A.jsx)("span", {
						className: `sf-scan-status sf-scan-${e.status}`,
						children: e.status
					}),
					/* @__PURE__ */ (0, A.jsxs)("div", { children: [/* @__PURE__ */ (0, A.jsx)("strong", { children: e.fileName }), /* @__PURE__ */ (0, A.jsxs)("small", { children: [
						e.resource,
						" · ",
						be(e.bytes),
						" · ",
						n(e.finishedAt ?? e.startedAt),
						e.durationMilliseconds === null ? "" : ` · ${e.durationMilliseconds} ms`
					] })] }),
					e.code && /* @__PURE__ */ (0, A.jsx)("code", { children: e.code })
				] }, e.id))
			})
		] }) : /* @__PURE__ */ (0, A.jsx)("div", {
			className: "sf-state",
			children: t.loading
		})
	});
}
//#endregion
//#region src/components/ImageProcessDialog.tsx
function Oe({ entries: e, resource: t, formats: n, labels: r, onClose: i, onApply: a }) {
	let [o, s] = (0, _.useState)("optimize"), [c, l] = (0, _.useState)(82), [u, d] = (0, _.useState)("original"), [f, p] = (0, _.useState)("SoFinder"), [m, h] = (0, _.useState)("#ffffff"), [g, v] = (0, _.useState)(t), [y, b] = (0, _.useState)(""), [x, S] = (0, _.useState)("bottom-right"), [C, w] = (0, _.useState)(60), [T, E] = (0, _.useState)(25), [D, O] = (0, _.useState)("copy"), [ee, k] = (0, _.useState)(!1), [j, M] = (0, _.useState)(""), P = o === "optimize" && u !== "original" ? "copy" : D, F = e.length === 0 || o === "text" && f.trim() === "" || o === "image" && y.trim() === "", I = async () => {
		let e = {
			position: x,
			opacity: C,
			scale: T,
			quality: c
		}, n = o === "optimize" ? {
			type: "optimize",
			format: u,
			quality: c
		} : o === "text" ? {
			type: "watermarkText",
			text: f.trim(),
			color: m,
			...e
		} : {
			type: "watermarkImage",
			resource: g.trim() || t,
			path: y.trim(),
			...e
		};
		k(!0), M("");
		try {
			await a([n], { mode: P });
		} catch (e) {
			M(e instanceof Error ? e.message : String(e));
		} finally {
			k(!1);
		}
	};
	return /* @__PURE__ */ (0, A.jsxs)(N, {
		title: r.title,
		closeLabel: r.close,
		onClose: i,
		className: "sf-image-process-modal",
		footer: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
			/* @__PURE__ */ (0, A.jsx)("span", { children: r.selected.replace("{count}", String(e.length)) }),
			/* @__PURE__ */ (0, A.jsx)("button", {
				onClick: i,
				children: r.cancel
			}),
			/* @__PURE__ */ (0, A.jsx)("button", {
				className: "primary",
				disabled: ee || F,
				onClick: () => void I(),
				children: ee ? r.processing : r.apply
			})
		] }),
		children: [
			/* @__PURE__ */ (0, A.jsxs)("div", {
				className: "sf-image-process-grid",
				children: [
					/* @__PURE__ */ (0, A.jsxs)("label", { children: [r.operation, /* @__PURE__ */ (0, A.jsxs)("select", {
						value: o,
						onChange: (e) => s(e.target.value),
						children: [
							/* @__PURE__ */ (0, A.jsx)("option", {
								value: "optimize",
								children: r.optimize
							}),
							/* @__PURE__ */ (0, A.jsx)("option", {
								value: "text",
								children: r.textWatermark
							}),
							/* @__PURE__ */ (0, A.jsx)("option", {
								value: "image",
								children: r.imageWatermark
							})
						]
					})] }),
					o === "optimize" && /* @__PURE__ */ (0, A.jsxs)("label", { children: [r.outputFormat, /* @__PURE__ */ (0, A.jsxs)("select", {
						value: u,
						onChange: (e) => d(e.target.value),
						children: [/* @__PURE__ */ (0, A.jsx)("option", {
							value: "original",
							children: r.keepFormat
						}), n.map((e) => /* @__PURE__ */ (0, A.jsx)("option", {
							value: e,
							children: e.toUpperCase()
						}, e))]
					})] }),
					o === "text" && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsxs)("label", {
						className: "sf-process-wide",
						children: [r.watermarkText, /* @__PURE__ */ (0, A.jsx)("input", {
							value: f,
							maxLength: 200,
							onChange: (e) => p(e.target.value)
						})]
					}), /* @__PURE__ */ (0, A.jsxs)("label", { children: [r.color, /* @__PURE__ */ (0, A.jsx)("input", {
						type: "color",
						value: m,
						onChange: (e) => h(e.target.value)
					})] })] }),
					o === "image" && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsxs)("label", { children: [r.watermarkResource, /* @__PURE__ */ (0, A.jsx)("input", {
						value: g,
						onChange: (e) => v(e.target.value)
					})] }), /* @__PURE__ */ (0, A.jsxs)("label", {
						className: "sf-process-wide",
						children: [r.watermarkPath, /* @__PURE__ */ (0, A.jsx)("input", {
							value: y,
							placeholder: "branding/logo.png",
							onChange: (e) => b(e.target.value)
						})]
					})] }),
					o !== "optimize" && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
						/* @__PURE__ */ (0, A.jsxs)("label", { children: [r.position, /* @__PURE__ */ (0, A.jsxs)("select", {
							value: x,
							onChange: (e) => S(e.target.value),
							children: [
								/* @__PURE__ */ (0, A.jsx)("option", {
									value: "top-left",
									children: r.topLeft
								}),
								/* @__PURE__ */ (0, A.jsx)("option", {
									value: "top-right",
									children: r.topRight
								}),
								/* @__PURE__ */ (0, A.jsx)("option", {
									value: "center",
									children: r.center
								}),
								/* @__PURE__ */ (0, A.jsx)("option", {
									value: "bottom-left",
									children: r.bottomLeft
								}),
								/* @__PURE__ */ (0, A.jsx)("option", {
									value: "bottom-right",
									children: r.bottomRight
								})
							]
						})] }),
						/* @__PURE__ */ (0, A.jsxs)("label", { children: [
							r.opacity,
							": ",
							C,
							"%",
							/* @__PURE__ */ (0, A.jsx)("input", {
								type: "range",
								min: "1",
								max: "100",
								value: C,
								onChange: (e) => w(Number(e.target.value))
							})
						] }),
						/* @__PURE__ */ (0, A.jsxs)("label", { children: [
							r.scale,
							": ",
							T,
							"%",
							/* @__PURE__ */ (0, A.jsx)("input", {
								type: "range",
								min: "5",
								max: "80",
								value: T,
								onChange: (e) => E(Number(e.target.value))
							})
						] })
					] }),
					/* @__PURE__ */ (0, A.jsxs)("label", { children: [
						r.quality,
						": ",
						c,
						/* @__PURE__ */ (0, A.jsx)("input", {
							type: "range",
							min: "1",
							max: "100",
							value: c,
							onChange: (e) => l(Number(e.target.value))
						})
					] }),
					/* @__PURE__ */ (0, A.jsxs)("label", { children: [r.saveMode, /* @__PURE__ */ (0, A.jsxs)("select", {
						value: P,
						disabled: o === "optimize" && u !== "original",
						onChange: (e) => O(e.target.value),
						children: [/* @__PURE__ */ (0, A.jsx)("option", {
							value: "copy",
							children: r.saveCopy
						}), /* @__PURE__ */ (0, A.jsx)("option", {
							value: "overwrite",
							children: r.overwrite
						})]
					})] })
				]
			}),
			o === "optimize" && u !== "original" && /* @__PURE__ */ (0, A.jsx)("p", {
				className: "sf-configured-limits",
				children: r.conversionCopyHint
			}),
			P === "overwrite" && /* @__PURE__ */ (0, A.jsx)("p", {
				className: "sf-warning",
				children: r.overwriteWarning
			}),
			j && /* @__PURE__ */ (0, A.jsx)("p", {
				className: "sf-warning",
				role: "alert",
				children: j
			})
		]
	});
}
//#endregion
//#region src/App.tsx
var ke = {
	resize: !1,
	crop: !1,
	rotate: !1,
	presets: !1,
	process: !1,
	batchRename: !1
}, Ae = {
	grid: "medium",
	list: "medium"
}, R = {
	recent: !1,
	favorites: !1,
	tags: !1,
	archive: !1,
	trash: !0,
	folderTree: !1,
	autoCollapseUploads: !0
}, je = {
	size: !0,
	modified: !0,
	type: !1
}, Me = {
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
}, Ne = (e, t) => {
	try {
		let n = JSON.parse(localStorage.getItem(e) || "{}");
		return Object.fromEntries(Object.entries(t).map(([e, t]) => [e, typeof n[e] == "boolean" ? n[e] : t]));
	} catch {
		return t;
	}
}, Pe = () => Ne("sofinder.tools.v3", ke), Fe = () => {
	try {
		let e = JSON.parse(localStorage.getItem("sofinder.viewSizes.v1") || "{}"), t = (e) => e === "small" || e === "medium" || e === "large";
		return {
			grid: t(e.grid) ? e.grid : Ae.grid,
			list: t(e.list) ? e.list : Ae.list
		};
	} catch {
		return Ae;
	}
}, Ie = (e) => {
	let t = localStorage.getItem("sofinder.uiScale.v1");
	return t === "compact" || t === "standard" || t === "large" || t === "xlarge" ? t : e;
}, Le = {
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
}, Re = {
	default: 100,
	min: 10,
	max: 500
}, ze = (e) => Math.max(Re.min, Math.min(Re.max, Math.trunc(e))), Be = () => {
	let e = Number(localStorage.getItem("sofinder.pageSize.v1"));
	return Number.isFinite(e) && e > 0 ? ze(e) : Re.default;
}, Ve = (e) => {
	let t = Le[e], n = localStorage.getItem(`sofinder.column.${e}`);
	if (n === null || n.trim() === "") return t.initial;
	let r = Number(n);
	return Number.isFinite(r) ? Math.max(t.min, Math.min(t.max, r)) : t.initial;
};
function He({ config: e }) {
	let t = (0, _.useId)(), n = (0, _.useMemo)(() => new T(e), [e]), r = e.featureAvailability ?? Me, [i, a] = (0, _.useState)(() => {
		let t = localStorage.getItem("sofinder.language");
		return t === "en" || t === "zh-cn" || t === "zh-tw" ? t : e.language;
	}), o = (0, _.useMemo)(() => ee(i), [i]), s = (0, _.useMemo)(() => new Intl.DateTimeFormat(i, {
		dateStyle: "medium",
		timeStyle: "short"
	}), [i]), [c, l] = (0, _.useState)([]), [u, d] = (0, _.useState)(e.resource), [f, p] = (0, _.useState)(e.initialPath || ""), [m, h] = (0, _.useState)(""), [g, v] = (0, _.useState)([]), [y, b] = (0, _.useState)(() => /* @__PURE__ */ new Set()), [x, S] = (0, _.useState)(null), [C, E] = (0, _.useState)(""), [D, O] = (0, _.useState)("name"), [k, j] = (0, _.useState)("name"), [P, F] = (0, _.useState)("asc"), [ae, L] = (0, _.useState)(0), [oe, se] = (0, _.useState)(0), [ce, pe] = (0, _.useState)(null), [me, he] = (0, _.useState)(null), [ge, Te] = (0, _.useState)([]), ke = (0, _.useRef)(Be()).current, [Ae, He] = (0, _.useState)(ke), [We, Ge] = (0, _.useState)(String(ke)), Ke = (0, _.useRef)(ke), [qe, Je] = (0, _.useState)(() => localStorage.getItem("sofinder.view") === "list" ? "list" : "grid"), [Ye, Xe] = (0, _.useState)(!0), [Ze, z] = (0, _.useState)(""), [Qe, $e] = (0, _.useState)([]), [et, tt] = (0, _.useState)(!1), [nt, rt] = (0, _.useState)({
		favorites: [],
		tags: {},
		recent: []
	}), [it, at] = (0, _.useState)(null), [ot, st] = (0, _.useState)(() => e.uiDefaults.fullTools ? {
		resize: !0,
		crop: !0,
		rotate: !0,
		presets: !0,
		process: !0,
		batchRename: !0
	} : Pe()), [ct, lt] = (0, _.useState)(() => {
		let t = Ne("sofinder.features.v2", {
			...R,
			folderTree: e.featureDefaults?.folderTree ?? !1
		});
		return {
			...t,
			folderTree: r.folderTree !== !1 && t.folderTree,
			recent: r.recent !== !1 && t.recent,
			favorites: r.favorites !== !1 && t.favorites,
			tags: r.tags !== !1 && t.tags,
			archive: r.archive !== !1 && t.archive,
			trash: r.trash !== !1 && t.trash
		};
	}), [ut, dt] = (0, _.useState)(() => Ne("sofinder.listColumns.v1", je)), [ft, pt] = (0, _.useState)(Fe), [mt, ht] = (0, _.useState)(!1), [gt, _t] = (0, _.useState)(!1), [vt, yt] = (0, _.useState)(!1), [bt, xt] = (0, _.useState)(() => Ie(e.uiDefaults?.scale ?? "standard")), [St, Ct] = (0, _.useState)(null), [wt, Tt] = (0, _.useState)(!1), [Et, Dt] = (0, _.useState)(!1), [Ot, kt] = (0, _.useState)(!1), [At, jt] = (0, _.useState)(null), [Mt, Nt] = (0, _.useState)(null), [Pt, Ft] = (0, _.useState)(!1), [It, Lt] = (0, _.useState)(!1), [Rt, zt] = (0, _.useState)(null), [B, Bt] = (0, _.useState)(null), [Vt, Ht] = (0, _.useState)(null), [Ut, Wt] = (0, _.useState)(null), [Gt, Kt] = (0, _.useState)(null), [qt, Jt] = (0, _.useState)({}), [Yt, Xt] = (0, _.useState)({
		driver: "",
		formats: []
	}), [Zt, Qt] = (0, _.useState)([]), [$t, en] = (0, _.useState)({
		enabled: !1,
		defaultTtlSeconds: 300,
		maxTtlSeconds: 3600
	}), [tn, nn] = (0, _.useState)({}), [rn, an] = (0, _.useState)(() => Ve("left")), [on, sn] = (0, _.useState)(() => Ve("right")), cn = (0, _.useRef)(null), ln = (0, _.useRef)(null), un = (0, _.useRef)(/* @__PURE__ */ new Map()), dn = (0, _.useRef)(/* @__PURE__ */ new Map()), fn = (0, _.useRef)(0), pn = (0, _.useRef)(0), mn = (0, _.useRef)(!1), hn = (0, _.useRef)(!1), gn = (0, _.useRef)(null), _n = (0, _.useRef)(null), vn = (0, _.useRef)(null), yn = (0, _.useRef)(!1);
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
	}, [e.theme]), (0, _.useEffect)(() => (document.documentElement.dataset.sofinderScale = bt, localStorage.setItem("sofinder.uiScale.v1", bt), () => {
		delete document.documentElement.dataset.sofinderScale;
	}), [bt]), (0, _.useEffect)(() => {
		localStorage.setItem("sofinder.language", i), document.documentElement.lang = i === "zh-cn" ? "zh-CN" : i === "zh-tw" ? "zh-TW" : "en";
	}, [i]);
	let V = (0, _.useCallback)((e) => z(e instanceof Error ? e.message : o("error")), [o]), bn = (0, _.useCallback)((e) => new Promise((t) => {
		gn.current?.(!1), gn.current = t, Nt(e);
	}), []), xn = (e) => {
		let t = gn.current;
		gn.current = null, Nt(null), t?.(e);
	}, Sn = (0, _.useCallback)(async (e = u, t = f, r = C, i = ae, a = k, s = P, c = D, l = ce) => {
		if (!e) return;
		let d = ++pn.current;
		Xe(!0), z("");
		try {
			let o = await n.list(e, t, r, a, s, i, Ke.current, c, l);
			if (d !== pn.current) return;
			v(o.entries), p(o.path), h(o.path), L(o.offset), se(o.total), pe(l), he(o.nextCursor ?? null), nn(o.capabilities || {}), b(/* @__PURE__ */ new Set()), S(null);
		} catch (r) {
			if (d !== pn.current) return;
			if (r instanceof w && r.code === "not_found" && t !== "") try {
				let t = await n.list(e, "", "", a, s, 0, Ke.current, "name", null);
				if (d !== pn.current) return;
				v(t.entries), p(t.path), h(t.path), L(t.offset), se(t.total), pe(null), he(t.nextCursor ?? null), nn(t.capabilities || {}), b(/* @__PURE__ */ new Set()), S(null), Te([]), z(o("missingPathFallback"));
				return;
			} catch (e) {
				r = e;
			}
			v([]), p(t), L(i), se(null), pe(l), he(null), nn({}), b(/* @__PURE__ */ new Set()), S(null), V(r);
		} finally {
			d === pn.current && Xe(!1);
		}
	}, [
		n,
		P,
		ae,
		ce,
		f,
		V,
		u,
		C,
		D,
		k,
		o
	]);
	(0, _.useEffect)(() => {
		n.configData().then(({ resources: t, plugins: n, imagePresets: r, imageCapabilities: i, signedUrls: a }) => {
			l(t), Qt(n || []), Jt(r || {}), Xt(i || {
				driver: "",
				formats: []
			}), en(a || {
				enabled: !1,
				defaultTtlSeconds: 300,
				maxTtlSeconds: 3600
			});
			let o = t.some((t) => t.name === e.resource) ? e.resource : t[0]?.name || "";
			d(o), o && (Te([]), Sn(o, e.initialPath || "", "", 0, k, P, "name", null));
		}).catch(V);
	}, [
		n,
		e.initialPath,
		e.resource
	]), (0, _.useEffect)(() => {
		let t = () => {
			let t = new URL(window.location.href), n = t.searchParams.get("type") || e.resource, r = t.searchParams.get("path") || "";
			hn.current = !0, d(n), E(""), O("name"), Te([]), Sn(n, r, "", 0, "name", "asc", "name", null);
		};
		return window.addEventListener("popstate", t), () => window.removeEventListener("popstate", t);
	}, [e.resource, Sn]), (0, _.useEffect)(() => {
		if (!u || Ye) return;
		let e = new URL(window.location.href), t = e.searchParams.get("type") || "", n = e.searchParams.get("path") || "";
		if (t === u && n === f) {
			mn.current = !0, hn.current = !1;
			return;
		}
		e.searchParams.set("type", u), f ? e.searchParams.set("path", f) : e.searchParams.delete("path");
		let r = {
			...window.history.state || {},
			sofinder: {
				resource: u,
				path: f
			}
		};
		!mn.current || hn.current ? window.history.replaceState(r, "", e) : window.history.pushState(r, "", e), mn.current = !0, hn.current = !1;
	}, [
		Ye,
		f,
		u
	]), (0, _.useEffect)(() => {
		let e = n.pendingUploads().map((e) => ({
			id: `pending-${e.id}`,
			name: e.name,
			progress: 0,
			status: "error",
			message: o("uploadReselectToResume")
		}));
		e.length > 0 && ($e((t) => [...t.filter((e) => !e.id.startsWith("pending-")), ...e]), tt(!1));
	}, [n, o]), (0, _.useEffect)(() => {
		if (!yn.current) {
			yn.current = !0;
			return;
		}
		let e = window.setTimeout(() => {
			u && (Te([]), Sn(u, f, C, 0, k, P, D, null));
		}, 250);
		return () => window.clearTimeout(e);
	}, [C, D]), (0, _.useEffect)(() => {
		if (u) {
			if (!ct.recent && !ct.favorites && !ct.tags) {
				rt({
					favorites: [],
					tags: {},
					recent: []
				});
				return;
			}
			n.metadata(u).then(rt).catch(V);
		}
	}, [
		n,
		ct.favorites,
		ct.recent,
		ct.tags,
		V,
		u
	]), (0, _.useEffect)(() => {
		if (!ct.autoCollapseUploads || Qe.length === 0 || Qe.some((e) => e.status === "queued" || e.status === "uploading")) return;
		let e = window.setTimeout(() => tt(!0), 1200);
		return () => window.clearTimeout(e);
	}, [ct.autoCollapseUploads, Qe]), (0, _.useEffect)(() => {
		let e = (e) => {
			let t = Array.from(e.clipboardData?.files || []);
			t.length > 0 && !H?.readOnly && tn.upload !== !1 && (e.preventDefault(), Un(t));
		};
		return window.addEventListener("paste", e), () => window.removeEventListener("paste", e);
	});
	let Cn = (0, _.useMemo)(() => f === "" ? [] : f.split("/"), [f]), H = c.find((e) => e.name === u), wn = f === "" ? 0 : f.split("/").length, U = (0, _.useMemo)(() => g.filter((e) => y.has(e.path)), [g, y]), W = U.length === 1 ? U[0] : null, Tn = (e) => Yt.formats.find((t) => e.mimeType !== null && t.mimes.includes(e.mimeType.toLowerCase())), En = (e) => !!(e && Tn(e)?.thumbnail), Dn = (e) => !!(e && Tn(e)?.edit), On = U.filter((e) => Dn(e)), kn = (t) => !!(t && !t.directory && t.url && (e.selectionKind !== "image" || Tn(t)?.webEmbeddable)), An = async (e) => {
		if (!e.directory) {
			if (H?.entryUrlConfigured && e.url) {
				Kt({
					url: new URL(e.url, document.baseURI).href,
					loginRequired: !0
				});
				return;
			}
			if ($t.enabled && H?.deliveryMode === "proxy") {
				try {
					let t = await n.signedUrl(u, e.path, $t.defaultTtlSeconds);
					Kt({
						url: t.url,
						loginRequired: !1,
						expiresAt: t.expiresAt
					});
				} catch (e) {
					V(e);
				}
				return;
			}
			Kt({
				url: new URL(e.url || n.downloadUrl(u, e.path), document.baseURI).href,
				loginRequired: !e.url
			});
		}
	}, jn = (e) => U.length > 0 && U.every((t) => t.capabilities?.[e] !== !1), Mn = (0, _.useMemo)(() => Zt.flatMap((e) => (e.uiActions || []).map((t) => ({
		...t,
		plugin: e.name
	}))), [Zt]), Nn = (0, _.useMemo)(() => Zt.flatMap((e) => (e.previewers || []).map((t) => ({
		...t,
		plugin: e.name
	}))), [Zt]), Pn = (e) => e.label[i] || e.label.en, Fn = (e) => {
		if (e.directory) return null;
		let t = e.mimeType?.toLowerCase() || "", n = e.name.includes(".") && e.name.split(".").pop()?.toLowerCase() || "";
		return Nn.find((e) => e.extensions.includes(n) || e.mimeTypes.some((e) => e === t || e.endsWith("/*") && t.startsWith(e.slice(0, -1)))) || null;
	}, In = (e) => {
		let t = Fn(e);
		if (!t) return null;
		let n = new URL(t.url, window.location.href);
		return n.searchParams.set("resource", u), n.searchParams.set("path", e.path), n.toString();
	}, Ln = (e, t) => e.selection === "none" ? t === null : !t || e.selection === "file" && t.directory || e.selection === "image" && (t.directory || !t.mimeType?.startsWith("image/")) ? !1 : t.capabilities?.[e.requires] !== !1, Rn = (e, t) => {
		if (!Ln(e, t)) return;
		let n = new URL(e.url, document.baseURI);
		n.searchParams.set("resource", u), n.searchParams.set("directory", f), t && n.searchParams.set("path", t.path), window.open(n, "_blank", "noopener");
	};
	(0, _.useEffect)(() => {
		if (at(null), !W || !Tn(W)?.read) return;
		let e = !0;
		return n.imageInfo(u, W.path).then((t) => {
			e && at(t);
		}).catch((t) => {
			e && V(t);
		}), () => {
			e = !1;
		};
	}, [
		n,
		u,
		W?.path,
		W?.mimeType,
		V
	]), (0, _.useEffect)(() => {
		if (Ht(null), Wt(null), r.textPreview === !1 || !B || !Ue(B.mimeType)) return;
		let e = !0;
		return n.textPreview(u, B.path).then((t) => {
			e && Ht({
				path: B.path,
				content: t.content,
				truncated: t.truncated
			});
		}).catch((t) => {
			e && V(t);
		}), () => {
			e = !1;
		};
	}, [
		n,
		r.textPreview,
		B?.path,
		B?.mimeType,
		V,
		u
	]);
	let zn = (e, t) => {
		if (Or === "picker") {
			b(/* @__PURE__ */ new Set([e.path])), S(e.path);
			return;
		}
		if (t.shiftKey && x) {
			let t = g.findIndex((e) => e.path === x), n = g.findIndex((t) => t.path === e.path);
			if (t >= 0 && n >= 0) {
				let [e, r] = t < n ? [t, n] : [n, t];
				b(new Set(g.slice(e, r + 1).map((e) => e.path)));
				return;
			}
		}
		t.ctrlKey || t.metaKey ? b((t) => {
			let n = new Set(t);
			return n.has(e.path) ? n.delete(e.path) : n.add(e.path), n;
		}) : b(/* @__PURE__ */ new Set([e.path])), S(e.path), ct.recent && n.updateMetadata(u, e.path, "touch").then(rt).catch(V);
	}, Bn = (e) => {
		e.directory ? (Te([]), Sn(u, e.path, C, 0, k, P, D, null)) : nr(e);
	}, Vn = async () => {
		H && jt({
			kind: "folder",
			title: o("newFolder"),
			label: o("folderName"),
			initial: "",
			maximum: H.maxFolderNameLength
		});
	}, Hn = (e, t) => {
		$e((n) => n.map((n) => n.id === e ? {
			...n,
			...t
		} : n));
	}, Un = async (e, t = f) => {
		let r = Array.from(e), i = H ? r.filter((e) => I(e.name, H.maxFileNameLength) === null) : r;
		if (i.length !== r.length && H) {
			let e = r.map((e) => I(e.name, H.maxFileNameLength)).filter((e) => e !== null);
			z(e.includes("tooLong") ? `${o("fileNameTooLong")} ${H.maxFileNameLength}` : o("invalidEntryName"));
		}
		let a = i.map((e) => {
			let r = `${Date.now()}-${++fn.current}`, i = new AbortController();
			un.current.set(r, i), dn.current.set(r, {
				file: e,
				targetPath: t
			});
			let a = n.findPendingUpload(u, t, e, !1);
			return {
				id: r,
				file: e,
				controller: i,
				pendingId: a ? `pending-${a.id}` : null
			};
		});
		if (a.length === 0) return;
		tt(!1);
		let s = new Set(a.map((e) => e.pendingId).filter((e) => e !== null));
		$e((e) => [...e.filter((e) => !s.has(e.id)), ...a.map(({ id: e, file: t, pendingId: n }) => ({
			id: e,
			name: t.name,
			progress: 0,
			status: "queued",
			message: n ? o("uploadResuming") : void 0
		}))]);
		let c = 0, l = async () => {
			for (; c < a.length;) {
				let e = a[c++];
				if (e.controller.signal.aborted) {
					un.current.delete(e.id);
					continue;
				}
				Hn(e.id, {
					status: "uploading",
					progress: 0,
					message: void 0
				});
				let r = !1;
				try {
					for (;;) try {
						await n.upload(u, t, e.file, {
							overwrite: r,
							signal: e.controller.signal,
							onProgress: (t) => Hn(e.id, { progress: t })
						}), Hn(e.id, {
							status: "done",
							progress: 100
						});
						break;
					} catch (t) {
						if (t instanceof w && t.code === "conflict" && !r && await bn({
							title: o("replaceFile"),
							message: e.file.name,
							detail: o("confirmImageOverwrite")
						})) {
							r = !0, Hn(e.id, { progress: 0 });
							continue;
						}
						throw t;
					}
				} catch (t) {
					t instanceof DOMException && t.name === "AbortError" ? Hn(e.id, {
						status: "cancelled",
						message: o("cancelled")
					}) : Hn(e.id, {
						status: "error",
						message: t instanceof Error ? t.message : o("error")
					});
				} finally {
					un.current.delete(e.id);
				}
			}
		};
		await Promise.all(Array.from({ length: Math.min(3, a.length) }, () => l())), await Sn();
	}, Wn = (e, t) => Un(t, e), Gn = async (e) => {
		if (!H) return;
		let t = Array.from(e);
		if (t.length > 500) {
			z(o("folderUploadTooMany"));
			return;
		}
		let r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
		for (let e of t) {
			let t = e.webkitRelativePath.replace(/\\/g, "/").split("/").filter(Boolean);
			if (t.length < 2 || t.some((e) => I(e, e === t.at(-1) ? H.maxFileNameLength : H.maxFolderNameLength) !== null)) {
				z(o("invalidEntryName"));
				return;
			}
			let n = t.slice(0, -1);
			if (wn + n.length > H.maxFolderDepth) {
				z(o("folderDepthReached"));
				return;
			}
			n.forEach((e, t) => r.add(n.slice(0, t + 1).join("/")));
			let a = [f, ...n].filter(Boolean).join("/");
			i.set(a, [...i.get(a) || [], e]);
		}
		let a = Array.from(r).filter((e) => !e.includes("/")).slice(0, 5);
		if (await bn({
			title: o("uploadFolder"),
			message: `${t.length} ${o("files")} · ${r.size} ${o("folder")}`,
			detail: `${o("folderUploadPreview")}: ${a.join(", ")}${Array.from(r).filter((e) => !e.includes("/")).length > a.length ? "…" : ""}`
		})) try {
			for (let e of Array.from(r).sort((e, t) => e.split("/").length - t.split("/").length || e.localeCompare(t))) {
				let t = e.split("/"), r = t.pop() || "", i = [f, ...t].filter(Boolean).join("/");
				try {
					await n.createFolder(u, i, r);
				} catch (e) {
					if (!(e instanceof w) || e.code !== "conflict") throw e;
				}
			}
			for (let [e, t] of i) await Un(t, e);
		} catch (e) {
			V(e);
		}
	}, Kn = (e) => {
		un.current.get(e)?.abort(), Hn(e, {
			status: "cancelled",
			message: o("cancelled")
		});
	}, qn = () => {
		un.current.forEach((e) => e.abort()), $e((e) => e.map((e) => e.status === "queued" || e.status === "uploading" ? {
			...e,
			status: "cancelled",
			message: o("cancelled")
		} : e));
	}, Jn = (e) => {
		un.current.get(e)?.abort(), un.current.delete(e), dn.current.delete(e), $e((t) => t.filter((t) => t.id !== e));
	}, Yn = (e) => {
		let t = dn.current.get(e);
		t && (Jn(e), Un([t.file], t.targetPath));
	}, Xn = () => {
		let e = new Set(Qe.filter((e) => e.status === "queued" || e.status === "uploading").map((e) => e.id));
		dn.current.forEach((t, n) => {
			e.has(n) || dn.current.delete(n);
		}), $e((e) => e.filter((e) => e.status === "queued" || e.status === "uploading"));
	}, Zn = async () => {
		if (!W || !H) return;
		let e = W.directory ? -1 : W.name.lastIndexOf("."), t = e > 0 ? W.name.slice(e) : "", n = t ? W.name.slice(0, e) : W.name, r = W.directory ? H.maxFolderNameLength : H.maxFileNameLength;
		jt({
			kind: "rename",
			title: o("rename"),
			label: o(t ? "newBaseName" : "newName"),
			initial: n,
			maximum: r,
			extension: t
		});
	}, Qn = async () => {
		if (!(U.length === 0 || !await bn({
			title: o("remove"),
			message: U.length === 1 ? o("confirmDelete") : `${o("confirmDeleteMany")} ${U.length}`,
			detail: H?.storageCapabilities?.recoverableDelete === !1 ? o("permanentDeleteWarning") : o("trashRetention"),
			danger: !0
		}))) try {
			let e = await n.batch("delete", u, U.map((e) => e.path)), t = e.failed === 0 ? `${e.succeeded} ${o("completed")}` : `${e.succeeded} ${o("completed")}, ${e.failed} ${o("failed")}`;
			await Sn(), z(e.purgedItems > 0 ? `${t} · ${o("trashAutoPurged")} ${e.purgedItems} ${o("items")} (${be(e.purgedBytes)})` : t);
		} catch (e) {
			V(e);
		}
	}, $n = async (e) => {
		Tt(!1);
		try {
			let t = await n.batchRename(u, e);
			await Sn(), z(t.failed === 0 ? `${t.succeeded} ${o("completed")}` : `${t.succeeded} ${o("completed")}, ${t.failed} ${o("failed")}`);
		} catch (e) {
			V(e);
		}
	}, er = async (e, t) => {
		try {
			let r = await n.batch(e, u, U.map((e) => e.path), t);
			Ct(null), await Sn(), z(r.failed === 0 ? `${r.succeeded} ${o("completed")}` : `${r.succeeded} ${o("completed")}, ${r.failed} ${o("failed")}`);
		} catch (e) {
			V(e);
		}
	}, tr = async (e, t) => {
		Ct({
			operation: e,
			path: t,
			folders: [],
			loading: !0
		});
		try {
			let r = await n.list(u, t, "", "name", "asc", 0, 500);
			Ct({
				operation: e,
				path: r.path,
				folders: r.entries.filter((e) => e.directory),
				loading: !1
			});
		} catch (r) {
			if (r instanceof w && r.code === "not_found" && t !== "") try {
				let t = await n.list(u, "", "", "name", "asc", 0, 500);
				Ct({
					operation: e,
					path: t.path,
					folders: t.entries.filter((e) => e.directory),
					loading: !1
				}), z(o("missingDestinationFallback"));
				return;
			} catch (e) {
				r = e;
			}
			Ct((e) => e ? {
				...e,
				loading: !1
			} : null), V(r);
		}
	}, nr = async (t = W) => {
		if (!kn(t)) {
			t && e.selectionKind === "image" && z(o("webImageUnsupported"));
			return;
		}
		if (!t?.url) return;
		let r = t === W ? it : null;
		if (Tn(t)?.read && r === null) try {
			r = await n.imageInfo(u, t.path);
		} catch {
			r = null;
		}
		let i = {
			...t,
			resource: u,
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
	}, rr = () => {
		b((e) => e.size === g.length ? /* @__PURE__ */ new Set() : new Set(g.map((e) => e.path))), S(null);
	}, ir = async (e, t = 0, r = 0) => {
		if (!(!W || !Dn(W))) {
			Xe(!0);
			try {
				let i = e === 0 ? [{
					type: "resize",
					width: t,
					height: r
				}] : [{
					type: "rotate",
					degrees: e
				}], a = await n.applyImageActions(u, W.path, i, { mode: "copy" });
				z(`${o("imageCreated")}: ${a.entry.name} · ${a.result.width} × ${a.result.height} px`), await Sn();
			} catch (e) {
				V(e), Xe(!1);
			}
		}
	}, ar = () => {
		W && jt({
			kind: "resize",
			title: o("resize"),
			label: o("resizePrompt"),
			initial: "1200x1200",
			maximum: 9
		});
	}, or = () => {
		!W || !it || Dt(!0);
	}, sr = (e, t) => {
		st((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.tools.v3", JSON.stringify(r)), r;
		});
	}, cr = (e, t) => {
		(e === "autoCollapseUploads" || r[e] !== !1) && lt((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.features.v2", JSON.stringify(r)), r;
		});
	}, lr = (e, t) => {
		dt((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.listColumns.v1", JSON.stringify(r)), r;
		});
	}, ur = (e, t) => {
		pt((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.viewSizes.v1", JSON.stringify(r)), r;
		});
	}, dr = async () => {
		if (U.length !== 0) try {
			let e = await n.downloadArchive(u, U.map((e) => e.path)), t = URL.createObjectURL(e), r = document.createElement("a");
			r.href = t, r.download = "sofinder-download.zip", r.click(), window.setTimeout(() => URL.revokeObjectURL(t), 1e3);
		} catch (e) {
			V(e);
		}
	}, fr = async () => {
		if (W) try {
			rt(await n.updateMetadata(u, W.path, "favorite", { favorite: !nt.favorites.includes(W.path) }));
		} catch (e) {
			V(e);
		}
	}, pr = async () => {
		W && Lt(!0);
	}, mr = async (e) => {
		let t = At;
		if (jt(null), t) try {
			if (t.kind === "folder") await n.createFolder(u, f, e);
			else if (t.kind === "rename" && W && e !== W.name) await n.rename(u, W.path, e);
			else if (t.kind === "resize") {
				let t = /^(\d{1,4})[x×](\d{1,4})$/i.exec(e.replace(/\s/g, ""));
				if (!t) {
					z(o("invalidDimensions"));
					return;
				}
				await ir(0, Number(t[1]), Number(t[2]));
			}
			(t.kind === "folder" || t.kind === "rename") && await Sn();
		} catch (e) {
			V(e);
		}
	}, hr = async (e) => {
		let t = e.includes("/") ? e.slice(0, e.lastIndexOf("/")) : "", r = e.split("/").pop() || e;
		try {
			if (!(await n.list(u, t, r, "name", "asc", 0, 500)).entries.some((t) => t.path === e)) {
				rt(await n.updateMetadata(u, e, "forget")), z(o("recentMissing"));
				return;
			}
			await Sn(u, t, "", 0), b(/* @__PURE__ */ new Set([e]));
		} catch (t) {
			if (t instanceof w && t.code === "not_found") {
				try {
					rt(await n.updateMetadata(u, e, "forget"));
				} catch (e) {
					V(e);
					return;
				}
				z(o("recentMissing"));
				return;
			}
			V(t);
		}
	}, gr = (e) => {
		Je(e), localStorage.setItem("sofinder.view", e);
	}, _r = (e) => {
		let t = Rt?.entry ?? null;
		if (zt(null), e.startsWith("plugin:")) {
			let n = Mn.find((t) => `plugin:${t.plugin}:${t.id}` === e);
			n && Rn(n, t);
			return;
		}
		e === "open" && t?.directory ? Bn(t) : e === "preview" && t && !t.directory ? Bt(t) : e === "select" && t ? nr(t) : e === "rename" ? Zn() : e === "copy" ? tr("copy", f) : e === "move" ? tr("move", f) : e === "delete" ? Qn() : e === "download" && t && !t.directory && window.location.assign(t.url || n.downloadUrl(u, t.path));
	}, vr = async (e) => {
		if (W) try {
			let t = await n.applyImageActions(u, W.path, [{
				type: "preset",
				name: e
			}], { mode: "copy" });
			z(`${o("imageCreated")}: ${t.entry.name} · ${t.result.width} × ${t.result.height} px`), await Sn();
		} catch (e) {
			V(e);
		}
	}, yr = (e) => {
		window.requestAnimationFrame(() => {
			document.querySelector(`button.sf-entry[data-entry-index="${e}"]`)?.focus();
		});
	}, br = (e, t, n = !1) => {
		let r = Le[e], i = Math.round(Math.max(r.min, Math.min(r.max, t)));
		e === "left" ? an(i) : sn(i), n && localStorage.setItem(`sofinder.column.${e}`, String(i));
	}, xr = (e, t) => {
		t.preventDefault(), t.currentTarget.setPointerCapture(t.pointerId), t.currentTarget.classList.add("is-resizing");
		let n = e === "left" ? rn : on;
		vn.current = {
			side: e,
			startX: t.clientX,
			startWidth: n,
			currentWidth: n,
			element: t.currentTarget
		};
	}, Sr = (e) => {
		let t = vn.current;
		if (!t) return;
		let n = e.clientX - t.startX, r = Le[t.side];
		t.currentWidth = Math.round(Math.max(r.min, Math.min(r.max, t.startWidth + (t.side === "left" ? n : -n)))), br(t.side, t.currentWidth);
	}, Cr = () => {
		let e = vn.current;
		vn.current = null, e && (e.element.classList.remove("is-resizing"), br(e.side, e.currentWidth, !0));
	}, wr = (e, t) => {
		let n = t.key === "ArrowLeft" ? -1 : +(t.key === "ArrowRight");
		n !== 0 && (t.preventDefault(), br(e, (e === "left" ? rn : on) + (e === "left" ? n : -n) * 10, !0));
	}, Tr = (e) => {
		let t = e.target, n = t.matches("button.sf-entry");
		if (t.isContentEditable || [
			"INPUT",
			"SELECT",
			"TEXTAREA",
			"BUTTON",
			"A"
		].includes(t.tagName) && !n) return;
		if (Or === "manager" && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
			e.preventDefault(), rr();
			return;
		}
		if (e.key === "Escape") {
			e.preventDefault(), b(/* @__PURE__ */ new Set()), S(null);
			return;
		}
		if (Or === "manager" && e.key === "Delete" && jn("delete") && !H?.readOnly) {
			e.preventDefault(), Qn();
			return;
		}
		if (Or === "manager" && e.key === "F2" && U.length === 1 && jn("rename") && !H?.readOnly) {
			e.preventDefault(), Zn();
			return;
		}
		if (e.key === "Enter" && U.length === 1) {
			e.preventDefault(), Bn(U[0]);
			return;
		}
		let r = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : +(e.key === "ArrowRight" || e.key === "ArrowDown");
		if (r !== 0 && g.length > 0) {
			e.preventDefault();
			let t = x || U[0]?.path, n = t ? g.findIndex((e) => e.path === t) : r > 0 ? -1 : g.length, i = Math.max(0, Math.min(g.length - 1, n + r)), a = g[i];
			b(/* @__PURE__ */ new Set([a.path])), S(a.path), yr(i);
		}
	}, Er = St !== null && U.some((e) => {
		let t = e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : "", n = St.path === "" ? 0 : St.path.split("/").length;
		return St.operation === "move" && St.path === t || e.directory && H !== void 0 && n >= H.maxFolderDepth || e.directory && (St.path === e.path || St.path.startsWith(`${e.path}/`));
	}), Dr = Qe.some((e) => e.status === "queued" || e.status === "uploading"), Or = e.uiDefaults.mode ?? (e.selectMode ? "picker" : "manager"), kr = e.uiDefaults.fullTools === !0, Ar = e.uiDefaults.logo !== !1, jr = H?.storageCapabilities?.recoverableDelete !== !1, Mr = c.length > 1 || ct.folderTree || ct.recent || !!(H?.readOnly || H?.quotaBytes), Nr = (e) => ct.recent ? /* @__PURE__ */ (0, A.jsxs)("div", {
		className: `sf-recent sf-recent-${e}`,
		children: [/* @__PURE__ */ (0, A.jsxs)("header", { children: [/* @__PURE__ */ (0, A.jsx)("strong", { children: o("recent") }), /* @__PURE__ */ (0, A.jsx)("span", { children: nt.recent.length })] }), nt.recent.length === 0 ? /* @__PURE__ */ (0, A.jsx)("p", {
			className: "sf-recent-empty",
			children: o("recentEmpty")
		}) : nt.recent.slice(0, 8).map((e) => /* @__PURE__ */ (0, A.jsxs)("button", {
			title: e.path,
			onClick: () => void hr(e.path),
			children: [/* @__PURE__ */ (0, A.jsx)("span", {
				className: "sf-recent-icon",
				children: /* @__PURE__ */ (0, A.jsx)(M, { name: "history" })
			}), /* @__PURE__ */ (0, A.jsxs)("span", { children: [/* @__PURE__ */ (0, A.jsx)("b", { children: e.path.split("/").pop() }), /* @__PURE__ */ (0, A.jsx)("small", { children: e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : o("home") })] })]
		}, e.path))]
	}) : null, Pr = (Or === "manager" || kr) && U.length > 0, Fr = (e, t) => /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)(M, { name: e }), /* @__PURE__ */ (0, A.jsx)("span", { children: t })] }), Ir = (e, t, n = C) => {
		Te([]), Sn(e, t, n, 0, k, P, D, null);
	}, Lr = () => {
		if (ge.length === 0) return;
		let e = ge.slice(0, -1), t = ge[ge.length - 1] ?? null;
		Te(e), Sn(u, f, C, Math.max(0, ae - Ae), k, P, D, t);
	}, Rr = () => {
		me !== null && (Te((e) => [...e, ce]), Sn(u, f, C, ae + Ae, k, P, D, me));
	}, zr = () => {
		let e = Number(We);
		if (!Number.isFinite(e) || e <= 0) {
			Ge(String(Ae));
			return;
		}
		let t = ze(e);
		Ge(String(t)), t !== Ae && (Ke.current = t, He(t), localStorage.setItem("sofinder.pageSize.v1", String(t)), Te([]), Sn(u, f, C, 0, k, P, D, null));
	};
	return /* @__PURE__ */ (0, A.jsxs)("main", {
		className: `sf-app sf-mode-${Or}${Mr ? "" : " sf-no-sidebar"}${Pr ? "" : " sf-no-details"}${(Or === "manager" || kr) && U.length > 0 ? " sf-has-selection-actions" : ""}`,
		onKeyDown: Tr,
		onDragOver: (e) => e.preventDefault(),
		onDrop: (e) => {
			e.preventDefault(), e.dataTransfer.files.length && Un(e.dataTransfer.files);
		},
		children: [
			/* @__PURE__ */ (0, A.jsxs)("div", {
				className: `sf-commandbar ${Ar ? "sf-has-brand" : "sf-no-brand"}`,
				children: [
					Ar ? /* @__PURE__ */ (0, A.jsxs)("div", {
						className: "sf-brand",
						title: "SoFinder",
						children: [/* @__PURE__ */ (0, A.jsx)("span", {
							className: "sf-brand-mark",
							"aria-hidden": "true",
							children: "S"
						}), e.uiDefaults.header === !0 ? /* @__PURE__ */ (0, A.jsx)("strong", { children: "SoFinder" }) : /* @__PURE__ */ (0, A.jsx)("span", {
							className: "sf-sr-only",
							children: "SoFinder"
						})]
					}) : /* @__PURE__ */ (0, A.jsxs)("nav", {
						className: "sf-breadcrumb sf-command-breadcrumb",
						"aria-label": "Breadcrumb",
						children: [/* @__PURE__ */ (0, A.jsx)("button", {
							onClick: () => Ir(u, ""),
							children: o("home")
						}), Cn.map((e, t) => /* @__PURE__ */ (0, A.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, A.jsx)("button", {
							onClick: () => Ir(u, Cn.slice(0, t + 1).join("/")),
							children: e
						})] }, `${e}-${t}`))]
					}),
					e.uiDefaults.search !== !1 && /* @__PURE__ */ (0, A.jsxs)("div", {
						className: "sf-search",
						children: [
							/* @__PURE__ */ (0, A.jsx)(M, { name: "search" }),
							/* @__PURE__ */ (0, A.jsxs)("select", {
								value: D,
								onChange: (e) => {
									let t = e.target.value;
									O(t), L(0);
								},
								"aria-label": o("searchScope"),
								children: [/* @__PURE__ */ (0, A.jsx)("option", {
									value: "name",
									disabled: H?.storageCapabilities?.search === !1,
									children: o("name")
								}), /* @__PURE__ */ (0, A.jsx)("option", {
									value: "tags",
									children: o("tags")
								})]
							}),
							/* @__PURE__ */ (0, A.jsx)("input", {
								disabled: D === "name" && H?.storageCapabilities?.search === !1,
								value: C,
								onChange: (e) => E(e.target.value),
								placeholder: o(D === "tags" ? "searchTags" : "search"),
								"aria-label": o(D === "tags" ? "searchTags" : "search")
							})
						]
					}),
					/* @__PURE__ */ (0, A.jsxs)("div", {
						className: "sf-command-actions",
						children: [e.uiDefaults.viewSwitcher !== !1 && /* @__PURE__ */ (0, A.jsxs)("div", {
							className: "sf-view-toggle",
							role: "group",
							"aria-label": `${o("grid")} / ${o("list")}`,
							children: [/* @__PURE__ */ (0, A.jsx)("button", {
								className: qe === "grid" ? "active" : "",
								onClick: () => gr("grid"),
								title: o("grid"),
								"aria-label": o("grid"),
								children: /* @__PURE__ */ (0, A.jsx)(M, { name: "grid" })
							}), /* @__PURE__ */ (0, A.jsx)("button", {
								className: qe === "list" ? "active" : "",
								onClick: () => gr("list"),
								title: o("list"),
								"aria-label": o("list"),
								children: /* @__PURE__ */ (0, A.jsx)(M, { name: "list" })
							})]
						}), /* @__PURE__ */ (0, A.jsxs)("div", {
							className: "sf-utility",
							children: [/* @__PURE__ */ (0, A.jsx)("button", {
								className: "sf-icon-only",
								onClick: () => yt((e) => !e),
								"aria-expanded": vt,
								title: o("moreActions"),
								"aria-label": o("moreActions"),
								children: /* @__PURE__ */ (0, A.jsx)(M, { name: "more" })
							}), vt && /* @__PURE__ */ (0, A.jsxs)("div", {
								className: "sf-utility-menu",
								role: "menu",
								children: [
									e.uiDefaults.languageSwitcher !== !1 && /* @__PURE__ */ (0, A.jsxs)("label", { children: [/* @__PURE__ */ (0, A.jsx)("span", { children: o("language") }), /* @__PURE__ */ (0, A.jsxs)("select", {
										value: i,
										onChange: (e) => a(e.target.value),
										"aria-label": o("language"),
										children: [
											/* @__PURE__ */ (0, A.jsx)("option", {
												value: "zh-cn",
												children: "简中"
											}),
											/* @__PURE__ */ (0, A.jsx)("option", {
												value: "zh-tw",
												children: "繁中"
											}),
											/* @__PURE__ */ (0, A.jsx)("option", {
												value: "en",
												children: "EN"
											})
										]
									})] }),
									/* @__PURE__ */ (0, A.jsxs)("label", { children: [/* @__PURE__ */ (0, A.jsx)("span", { children: o("sort") }), /* @__PURE__ */ (0, A.jsxs)("select", {
										value: k,
										disabled: H?.storageCapabilities?.sort === !1,
										onChange: (e) => {
											let t = e.target.value;
											j(t), Te([]), Sn(u, f, C, 0, t, P, D, null);
										},
										children: [
											/* @__PURE__ */ (0, A.jsx)("option", {
												value: "name",
												children: o("name")
											}),
											/* @__PURE__ */ (0, A.jsx)("option", {
												value: "size",
												children: o("size")
											}),
											/* @__PURE__ */ (0, A.jsx)("option", {
												value: "modified",
												children: o("modified")
											})
										]
									})] }),
									/* @__PURE__ */ (0, A.jsx)("button", {
										role: "menuitem",
										disabled: H?.storageCapabilities?.sort === !1,
										onClick: () => {
											let e = P === "asc" ? "desc" : "asc";
											F(e), Te([]), Sn(u, f, C, 0, k, e, D, null);
										},
										children: Fr("sort", o("direction"))
									}),
									/* @__PURE__ */ (0, A.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											yt(!1), Sn();
										},
										children: Fr("refresh", o("refresh"))
									}),
									/* @__PURE__ */ (0, A.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											yt(!1), ht(!0);
										},
										children: Fr("settings", o("settings"))
									}),
									(Or === "manager" || kr) && e.securityStatusAvailable !== !1 && /* @__PURE__ */ (0, A.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											yt(!1), _t(!0);
										},
										children: Fr("security", o("securityStatus"))
									}),
									(Or === "manager" || kr) && ct.trash && jr && /* @__PURE__ */ (0, A.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											yt(!1), Ft(!0);
										},
										children: Fr("trash", o("trash"))
									}),
									(Or === "manager" || kr) && Mn.filter((e) => e.slot === "utility" && Ln(e, null)).map((e) => /* @__PURE__ */ (0, A.jsx)("button", {
										role: "menuitem",
										onClick: () => {
											yt(!1), Rn(e, null);
										},
										children: Pn(e)
									}, `${e.plugin}:${e.id}`))
								]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, A.jsxs)("div", {
				className: "sf-toolbar",
				role: "toolbar",
				"aria-label": o("fileActions"),
				title: o("keyboardHelp"),
				children: [
					/* @__PURE__ */ (0, A.jsx)("button", {
						onClick: Vn,
						disabled: H?.readOnly || tn.create_folder === !1 || H !== void 0 && wn >= H.maxFolderDepth,
						title: H && wn >= H.maxFolderDepth ? o("folderDepthReached") : void 0,
						children: Fr("add-folder", o("newFolder"))
					}),
					/* @__PURE__ */ (0, A.jsx)("button", {
						className: `primary sf-upload-trigger${Dr ? " is-active" : ""}`,
						"aria-busy": Dr,
						onClick: () => cn.current?.click(),
						disabled: H?.readOnly || tn.upload === !1,
						children: Fr("upload", `${o("upload")}${Dr ? ` (${Qe.filter((e) => e.status === "queued" || e.status === "uploading").length})` : ""}`)
					}),
					/* @__PURE__ */ (0, A.jsx)("input", {
						ref: cn,
						type: "file",
						multiple: !0,
						hidden: !0,
						onChange: (e) => {
							e.target.files && Un(e.target.files), e.target.value = "";
						}
					}),
					r.folderUpload !== !1 && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("button", {
						onClick: () => ln.current?.click(),
						disabled: H?.readOnly || tn.upload === !1,
						children: Fr("add-folder", o("uploadFolder"))
					}), /* @__PURE__ */ (0, A.jsx)("input", {
						ref: (e) => {
							ln.current = e, e?.setAttribute("webkitdirectory", "");
						},
						type: "file",
						multiple: !0,
						hidden: !0,
						onChange: (e) => {
							e.target.files && Gn(e.target.files), e.target.value = "";
						}
					})] }),
					(Or === "manager" || kr) && U.length > 0 && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("span", { className: "sf-separator" }), /* @__PURE__ */ (0, A.jsxs)("div", {
						className: "sf-context-actions",
						children: [
							/* @__PURE__ */ (0, A.jsx)("button", {
								onClick: rr,
								disabled: g.length === 0,
								children: Fr("select", y.size === g.length && g.length > 0 ? o("clearSelection") : o("selectAll"))
							}),
							/* @__PURE__ */ (0, A.jsx)("button", {
								onClick: Zn,
								disabled: U.length !== 1 || !jn("rename") || H?.readOnly,
								children: Fr("rename", o("rename"))
							}),
							r.batchRename !== !1 && ot.batchRename && /* @__PURE__ */ (0, A.jsx)("button", {
								onClick: () => Tt(!0),
								disabled: U.length < 2 || !jn("rename") || H?.readOnly,
								children: Fr("rename", o("batchRename"))
							}),
							/* @__PURE__ */ (0, A.jsx)("button", {
								onClick: () => void tr("copy", f),
								disabled: !jn("copy") || H?.readOnly,
								children: Fr("copy", o("copy"))
							}),
							/* @__PURE__ */ (0, A.jsx)("button", {
								onClick: () => void tr("move", f),
								disabled: !jn("move") || H?.readOnly,
								children: Fr("move", o("move"))
							}),
							ct.archive && /* @__PURE__ */ (0, A.jsx)("button", {
								onClick: () => void dr(),
								children: Fr("archive", o("downloadZip"))
							}),
							ct.favorites && /* @__PURE__ */ (0, A.jsx)("button", {
								onClick: () => void fr(),
								disabled: !W,
								children: Fr("favorite", o("favorite"))
							}),
							ct.tags && /* @__PURE__ */ (0, A.jsx)("button", {
								onClick: () => void pr(),
								disabled: !W,
								children: Fr("tags", o("tags"))
							}),
							/* @__PURE__ */ (0, A.jsx)("button", {
								className: "danger",
								onClick: Qn,
								disabled: !jn("delete") || H?.readOnly,
								children: Fr("delete", `${o("remove")}${U.length > 1 ? ` (${U.length})` : ""}`)
							}),
							r.imageEditing !== !1 && ot.rotate && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("button", {
								onClick: () => void ir(270),
								disabled: !Dn(W) || H?.readOnly,
								children: Fr("rotate-left", o("rotateLeft"))
							}), /* @__PURE__ */ (0, A.jsx)("button", {
								onClick: () => void ir(90),
								disabled: !Dn(W) || H?.readOnly,
								children: Fr("rotate-right", o("rotateRight"))
							})] }),
							r.imageEditing !== !1 && ot.resize && /* @__PURE__ */ (0, A.jsx)("button", {
								onClick: ar,
								disabled: !Dn(W) || H?.readOnly,
								children: Fr("resize", o("resize"))
							}),
							r.imageEditing !== !1 && ot.crop && /* @__PURE__ */ (0, A.jsx)("button", {
								onClick: or,
								disabled: !Dn(W) || !it || H?.readOnly,
								children: Fr("crop", o("crop"))
							}),
							r.imageProcessing !== !1 && ot.process && /* @__PURE__ */ (0, A.jsx)("button", {
								onClick: () => kt(!0),
								disabled: On.length === 0 || On.length !== U.length || H?.readOnly,
								children: Fr("resize", o("imageProcess"))
							}),
							r.imageEditing !== !1 && ot.presets && /* @__PURE__ */ (0, A.jsxs)("label", {
								className: "sf-sort",
								children: [o("preset"), /* @__PURE__ */ (0, A.jsxs)("select", {
									value: "",
									disabled: !Dn(W) || H?.readOnly || Object.keys(qt).length === 0,
									onChange: (e) => {
										let t = e.target.value;
										e.target.value = "", t && vr(t);
									},
									children: [/* @__PURE__ */ (0, A.jsx)("option", {
										value: "",
										children: "—"
									}), Object.entries(qt).map(([e, t]) => /* @__PURE__ */ (0, A.jsxs)("option", {
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
							W && Mn.filter((e) => e.slot === "toolbar" && Ln(e, W)).map((e) => /* @__PURE__ */ (0, A.jsx)("button", {
								onClick: () => Rn(e, W),
								children: Pn(e)
							}, `${e.plugin}:${e.id}`))
						]
					})] })
				]
			}),
			Ze && /* @__PURE__ */ (0, A.jsxs)("div", {
				className: "sf-notice",
				role: "alert",
				children: [Ze, /* @__PURE__ */ (0, A.jsx)("button", {
					onClick: () => z(""),
					"aria-label": o("close"),
					children: /* @__PURE__ */ (0, A.jsx)(M, { name: "close" })
				})]
			}),
			/* @__PURE__ */ (0, A.jsx)(xe, {
				tasks: Qe,
				collapsed: et,
				labels: {
					title: o("uploadQueue"),
					expand: o("expand"),
					collapse: o("collapse"),
					cancel: o("cancel"),
					cancelAll: o("cancelAll"),
					clearFinished: o("clearFinished"),
					retry: o("retryUpload"),
					remove: o("removeUploadTask"),
					status: (e) => o(e)
				},
				onToggle: () => tt((e) => !e),
				onCancel: Kn,
				onCancelAll: qn,
				onClearFinished: Xn,
				onRetry: Yn,
				onRemove: Jn
			}),
			/* @__PURE__ */ (0, A.jsxs)("div", {
				className: "sf-layout",
				style: {
					"--sf-sidebar-width": `${rn}px`,
					"--sf-details-width": `${on}px`
				},
				children: [
					Mr && /* @__PURE__ */ (0, A.jsxs)("aside", {
						className: "sf-sidebar",
						"aria-label": "Resources",
						children: [
							c.map((e) => /* @__PURE__ */ (0, A.jsxs)("button", {
								className: e.name === u ? "active" : "",
								onClick: () => {
									d(e.name), E(""), O("name"), e.storageCapabilities?.sort === !1 ? (j("name"), F("asc"), Te([]), Sn(e.name, "", "", 0, "name", "asc", "name", null)) : Ir(e.name, "", "");
								},
								children: [/* @__PURE__ */ (0, A.jsx)("span", {
									className: "sf-resource-icon",
									children: /* @__PURE__ */ (0, A.jsx)(_e, { kind: e.name.toLowerCase().includes("image") ? "image" : "folder" })
								}), e.name.toLowerCase().includes("image") ? o("images") : e.name.toLowerCase() === "files" ? o("files") : e.name]
							}, e.name)),
							ct.folderTree && u && /* @__PURE__ */ (0, A.jsx)(ie, {
								api: n,
								resource: u,
								currentPath: m,
								rootLabel: o("home"),
								onNavigate: (e) => Ir(u, e, "")
							}),
							H && /* @__PURE__ */ (0, A.jsxs)("div", {
								className: "sf-resource-status",
								children: [H.readOnly && /* @__PURE__ */ (0, A.jsx)("strong", { children: o("readOnly") }), H.quotaBytes > 0 && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsxs)("span", { children: [
									o("storageUsage"),
									": ",
									be(H.usedBytes),
									" / ",
									be(H.quotaBytes)
								] }), /* @__PURE__ */ (0, A.jsx)("progress", {
									max: H.quotaBytes,
									value: Math.min(H.usedBytes, H.quotaBytes)
								})] })]
							}),
							Nr("sidebar")
						]
					}),
					Mr && /* @__PURE__ */ (0, A.jsx)("div", {
						className: "sf-column-resizer left",
						role: "separator",
						tabIndex: 0,
						"aria-label": o("resizeLeftPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": Le.left.min,
						"aria-valuemax": Le.left.max,
						"aria-valuenow": rn,
						onPointerDown: (e) => xr("left", e),
						onPointerMove: Sr,
						onPointerUp: Cr,
						onPointerCancel: Cr,
						onKeyDown: (e) => wr("left", e),
						onDoubleClick: () => br("left", Le.left.initial, !0)
					}),
					/* @__PURE__ */ (0, A.jsxs)("section", {
						className: "sf-content",
						children: [
							Nr("mobile"),
							Ar && /* @__PURE__ */ (0, A.jsxs)("nav", {
								className: "sf-breadcrumb",
								"aria-label": "Breadcrumb",
								children: [/* @__PURE__ */ (0, A.jsx)("button", {
									onClick: () => Ir(u, ""),
									children: o("home")
								}), Cn.map((e, t) => /* @__PURE__ */ (0, A.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, A.jsx)("button", {
									onClick: () => Ir(u, Cn.slice(0, t + 1).join("/")),
									children: e
								})] }, `${e}-${t}`))]
							}),
							Ye ? /* @__PURE__ */ (0, A.jsx)("div", {
								className: "sf-state",
								children: o("loading")
							}) : g.length === 0 ? /* @__PURE__ */ (0, A.jsx)("div", {
								className: "sf-state",
								children: o("empty")
							}) : /* @__PURE__ */ (0, A.jsxs)("div", {
								className: `sf-entries ${qe} sf-grid-size-${ft.grid} sf-list-size-${ft.list}${qe === "list" && ut.size ? " sf-list-has-size" : ""}`,
								style: qe === "list" ? { "--sf-list-columns": [
									"minmax(220px, 1fr)",
									...ut.size ? ["100px"] : [],
									...ut.type ? ["160px"] : [],
									...ut.modified ? ["180px"] : []
								].join(" ") } : void 0,
								role: "listbox",
								"aria-multiselectable": Or === "manager",
								"aria-label": o("files"),
								children: [qe === "list" && /* @__PURE__ */ (0, A.jsxs)("div", {
									className: "sf-list-head",
									role: "presentation",
									"aria-hidden": "true",
									children: [
										/* @__PURE__ */ (0, A.jsx)("span", { children: o("name") }),
										ut.size && /* @__PURE__ */ (0, A.jsx)("span", {
											className: "sf-list-size",
											children: o("size")
										}),
										ut.type && /* @__PURE__ */ (0, A.jsx)("span", {
											className: "sf-list-type",
											children: o("type")
										}),
										ut.modified && /* @__PURE__ */ (0, A.jsx)("span", {
											className: "sf-list-modified",
											children: o("modified")
										})
									]
								}), g.map((e, t) => {
									let r = !e.directory && En(e);
									return /* @__PURE__ */ (0, A.jsxs)("button", {
										"data-entry-index": t,
										role: "option",
										"aria-selected": y.has(e.path),
										"aria-label": `${e.name}, ${e.directory ? o("folder") : be(e.size)}`,
										className: `sf-entry ${y.has(e.path) ? "selected" : ""}`,
										onClick: (t) => zn(e, t),
										onDoubleClick: () => Bn(e),
										onContextMenu: (t) => {
											t.preventDefault(), b(/* @__PURE__ */ new Set([e.path])), S(e.path), zt({
												x: t.clientX,
												y: t.clientY,
												entry: e
											});
										},
										onPointerDown: (t) => {
											t.pointerType === "touch" && (_n.current = window.setTimeout(() => {
												b(/* @__PURE__ */ new Set([e.path])), S(e.path), zt({
													x: t.clientX,
													y: t.clientY,
													entry: e
												});
											}, 550));
										},
										onPointerUp: () => {
											_n.current !== null && window.clearTimeout(_n.current), _n.current = null;
										},
										onPointerCancel: () => {
											_n.current !== null && window.clearTimeout(_n.current), _n.current = null;
										},
										onDragOver: (t) => {
											e.directory && t.preventDefault();
										},
										onDrop: (t) => {
											e.directory && t.dataTransfer.files.length && (t.preventDefault(), Wn(e.path, t.dataTransfer.files));
										},
										children: [
											/* @__PURE__ */ (0, A.jsx)("span", {
												className: "sf-entry-icon",
												children: r ? /* @__PURE__ */ (0, A.jsx)(ye, {
													src: n.thumbnailUrl(u, e),
													alt: "",
													lazy: !0
												}) : /* @__PURE__ */ (0, A.jsx)(_e, {
													name: e.name,
													mimeType: e.mimeType,
													directory: e.directory
												})
											}),
											/* @__PURE__ */ (0, A.jsxs)("span", {
												className: "sf-entry-name",
												title: e.name,
												children: [ct.favorites && nt.favorites.includes(e.path) && /* @__PURE__ */ (0, A.jsxs)("span", {
													"aria-label": o("favorite"),
													children: [/* @__PURE__ */ (0, A.jsx)(M, { name: "favorite" }), " "]
												}), e.name]
											}),
											ut.size && /* @__PURE__ */ (0, A.jsx)("span", {
												className: "sf-entry-size",
												children: e.directory ? "—" : be(e.size)
											}),
											ut.type && /* @__PURE__ */ (0, A.jsx)("span", {
												className: "sf-entry-type",
												children: e.directory ? o("folder") : e.mimeType || o("file")
											}),
											ut.modified && /* @__PURE__ */ (0, A.jsx)("time", {
												className: "sf-entry-modified",
												dateTime: (/* @__PURE__ */ new Date(e.modifiedAt * 1e3)).toISOString(),
												children: s.format(e.modifiedAt * 1e3)
											})
										]
									}, e.path);
								})]
							}),
							/* @__PURE__ */ (0, A.jsxs)("nav", {
								className: "sf-pagination",
								"aria-label": o("pagination"),
								children: [
									/* @__PURE__ */ (0, A.jsxs)("div", {
										className: "sf-page-navigation",
										children: [
											/* @__PURE__ */ (0, A.jsxs)("button", {
												disabled: ge.length === 0,
												onClick: Lr,
												children: [
													/* @__PURE__ */ (0, A.jsx)(M, { name: "chevron-left" }),
													" ",
													o("previous")
												]
											}),
											/* @__PURE__ */ (0, A.jsxs)("span", { children: [
												o("page"),
												" ",
												ge.length + 1,
												oe === null ? "" : ` / ${Math.max(1, Math.ceil(oe / Ae))}`
											] }),
											/* @__PURE__ */ (0, A.jsxs)("button", {
												disabled: me === null,
												onClick: Rr,
												children: [
													o("next"),
													" ",
													/* @__PURE__ */ (0, A.jsx)(M, { name: "chevron-right" })
												]
											})
										]
									}),
									/* @__PURE__ */ (0, A.jsxs)("label", {
										className: "sf-page-size",
										children: [/* @__PURE__ */ (0, A.jsxs)("span", { children: [
											o("itemsPerPage"),
											" (",
											Re.min,
											"–",
											Re.max,
											")"
										] }), /* @__PURE__ */ (0, A.jsx)("input", {
											type: "number",
											min: Re.min,
											max: Re.max,
											step: "10",
											list: t,
											value: We,
											onChange: (e) => Ge(e.target.value),
											onBlur: zr,
											onKeyDown: (e) => {
												e.key === "Enter" && e.currentTarget.blur();
											}
										})]
									}),
									/* @__PURE__ */ (0, A.jsx)("datalist", {
										id: t,
										children: [
											20,
											50,
											100,
											200,
											500
										].map((e) => /* @__PURE__ */ (0, A.jsx)("option", { value: e }, e))
									})
								]
							})
						]
					}),
					Pr && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("div", {
						className: "sf-column-resizer right",
						role: "separator",
						tabIndex: 0,
						"aria-label": o("resizeRightPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": Le.right.min,
						"aria-valuemax": Le.right.max,
						"aria-valuenow": on,
						onPointerDown: (e) => xr("right", e),
						onPointerMove: Sr,
						onPointerUp: Cr,
						onPointerCancel: Cr,
						onKeyDown: (e) => wr("right", e),
						onDoubleClick: () => br("right", Le.right.initial, !0)
					}), /* @__PURE__ */ (0, A.jsx)(Se, {
						api: n,
						resource: u,
						selectedEntries: U,
						selected: W,
						imageInfo: it,
						metadata: nt,
						showTags: ct.tags,
						previewImage: En(W),
						selectMode: !1,
						selectAllowed: kn(W),
						labels: {
							details: o("details"),
							selected: o("selectedCount"),
							type: o("type"),
							folder: o("folder"),
							file: o("file"),
							size: o("size"),
							dimensions: o("dimensions"),
							modified: o("modified"),
							location: o("location"),
							select: o("select"),
							download: o("download"),
							copyUrl: o("copyUrl"),
							unsupportedWebImage: o("webImageUnsupported")
						},
						formatDate: (e) => s.format(e * 1e3),
						onChoose: nr,
						onOpenUrl: An,
						pluginActions: W && Mn.filter((e) => e.slot === "details" && Ln(e, W)).map((e) => /* @__PURE__ */ (0, A.jsx)("button", {
							onClick: () => Rn(e, W),
							children: Pn(e)
						}, `${e.plugin}:${e.id}`))
					})] })
				]
			}),
			Or === "picker" && W && !W.directory && /* @__PURE__ */ (0, A.jsxs)("div", {
				className: "sf-picker-bar",
				children: [
					/* @__PURE__ */ (0, A.jsxs)("div", { children: [/* @__PURE__ */ (0, A.jsx)("strong", { children: W.name }), /* @__PURE__ */ (0, A.jsx)("small", { children: be(W.size) })] }),
					!kn(W) && /* @__PURE__ */ (0, A.jsx)("span", {
						role: "status",
						children: o("webImageUnsupported")
					}),
					/* @__PURE__ */ (0, A.jsx)("button", {
						className: "primary",
						disabled: !kn(W),
						onClick: () => void nr(),
						children: o("select")
					})
				]
			}),
			mt && /* @__PURE__ */ (0, A.jsx)(Ce, {
				resource: H,
				tools: ot,
				features: ct,
				columns: ut,
				viewSizes: ft,
				availability: r,
				scale: bt,
				translate: o,
				onToolChange: sr,
				onFeatureChange: cr,
				onColumnChange: lr,
				onViewSizeChange: ur,
				onScaleChange: xt,
				onClose: () => ht(!1)
			}),
			gt && /* @__PURE__ */ (0, A.jsx)(De, {
				api: n,
				formatDate: (e) => s.format(e * 1e3),
				labels: {
					title: o("securityStatus"),
					close: o("close"),
					loading: o("loading"),
					enabled: o("malwareScanningEnabled"),
					disabled: o("malwareScanningDisabled"),
					provider: o("scanProvider"),
					service: o("serviceStatus"),
					scans: o("scanHistory"),
					passed: o("scanPassed"),
					quarantined: o("scanQuarantined"),
					failed: o("scanFailed"),
					pending: o("scanPending"),
					recent: o("recentScans"),
					none: o("noScans")
				},
				onClose: () => _t(!1)
			}),
			St && /* @__PURE__ */ (0, A.jsx)(we, {
				state: St,
				unsafe: Er,
				translate: o,
				onBrowse: (e, t) => void tr(e, t),
				onConfirm: (e, t) => void er(e, t),
				onClose: () => Ct(null)
			}),
			wt && r.batchRename !== !1 && ot.batchRename && H && /* @__PURE__ */ (0, A.jsx)(Ee, {
				entries: U,
				maximum: H.maxFileNameLength,
				labels: {
					title: o("batchRename"),
					pattern: o("renamePattern"),
					hint: o("renamePatternHint"),
					oldName: o("oldName"),
					newName: o("newName"),
					invalid: o("invalidEntryName"),
					duplicate: o("duplicateRename"),
					cancel: o("cancel"),
					save: o("rename"),
					close: o("close")
				},
				onClose: () => Tt(!1),
				onSave: (e) => void $n(e)
			}),
			At && /* @__PURE__ */ (0, A.jsx)(te, {
				title: At.title,
				label: At.label,
				initialValue: At.initial,
				maximum: At.maximum,
				extension: At.extension,
				invalidNameLabel: o("invalidEntryName"),
				confirmLabel: o("confirm"),
				cancelLabel: o("cancel"),
				closeLabel: o("close"),
				onConfirm: (e) => void mr(e),
				onClose: () => jt(null)
			}),
			Mt && /* @__PURE__ */ (0, A.jsx)(ne, {
				...Mt,
				confirmLabel: o("confirm"),
				cancelLabel: o("cancel"),
				closeLabel: o("close"),
				onConfirm: () => xn(!0),
				onClose: () => xn(!1)
			}),
			Pt && /* @__PURE__ */ (0, A.jsx)(ue, {
				api: n,
				resource: u,
				locale: i,
				labels: {
					title: o("trash"),
					close: o("close"),
					cancel: o("cancel"),
					empty: o("trashEmpty"),
					restore: o("restore"),
					permanentDelete: o("permanentDelete"),
					expires: o("expires"),
					conflict: o("restoreConflict"),
					overwrite: o("restoreOverwrite"),
					autoRename: o("restoreAutoRename"),
					usage: o("trashUsage"),
					items: o("items"),
					previous: o("previous"),
					next: o("next"),
					search: o("searchTrash")
				},
				onClose: () => Ft(!1),
				onChanged: () => void Sn()
			}),
			It && W && /* @__PURE__ */ (0, A.jsx)(de, {
				initial: nt.tags[W.path] || [],
				suggestions: Array.from(new Set(Object.values(nt.tags).flat())).sort((e, t) => e.localeCompare(t, i)),
				labels: {
					title: o("tags"),
					close: o("close"),
					cancel: o("cancel"),
					save: o("save"),
					input: o("tagInput"),
					hint: o("tagInputHint"),
					maximum: o("tagMaximum")
				},
				onClose: () => Lt(!1),
				onSave: (e) => {
					Lt(!1), n.updateMetadata(u, W.path, "tags", { tags: e }).then(rt).catch(V);
				}
			}),
			B && /* @__PURE__ */ (0, A.jsx)(N, {
				title: B.name,
				closeLabel: o("close"),
				onClose: () => Bt(null),
				className: "sf-file-preview-modal",
				footer: /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
					/* @__PURE__ */ (0, A.jsx)("button", {
						type: "button",
						className: "sf-icon-button",
						onClick: () => An(B),
						title: o("copyUrl"),
						"aria-label": o("copyUrl"),
						children: /* @__PURE__ */ (0, A.jsx)(ve, {})
					}),
					/* @__PURE__ */ (0, A.jsx)("a", {
						className: "sf-preview-download",
						href: B.url || n.downloadUrl(u, B.path),
						children: o("download")
					}),
					/* @__PURE__ */ (0, A.jsx)("button", {
						className: "primary",
						onClick: () => Bt(null),
						children: o("close")
					})
				] }),
				children: /* @__PURE__ */ (0, A.jsxs)("div", {
					className: "sf-file-preview-body",
					children: [/* @__PURE__ */ (0, A.jsx)("div", {
						className: "sf-file-preview-content",
						children: En(B) ? /* @__PURE__ */ (0, A.jsx)(ye, {
							src: n.thumbnailUrl(u, B, 512, 512),
							alt: B.name
						}) : r.textPreview !== !1 && Vt?.path === B.path ? /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("pre", {
							className: "sf-text-preview",
							children: Vt.content
						}), Vt.truncated && /* @__PURE__ */ (0, A.jsx)("p", {
							className: "sf-warning",
							children: o("previewTruncated")
						})] }) : In(B) ? /* @__PURE__ */ (0, A.jsx)("iframe", {
							className: "sf-document-preview",
							src: In(B) || void 0,
							title: B.name
						}) : /* @__PURE__ */ (0, A.jsxs)("div", {
							className: "sf-file-preview-fallback",
							children: [/* @__PURE__ */ (0, A.jsx)(_e, { kind: "file" }), /* @__PURE__ */ (0, A.jsx)("p", { children: o("previewUnavailable") })]
						})
					}), /* @__PURE__ */ (0, A.jsxs)("dl", {
						className: "sf-file-preview-meta",
						children: [
							/* @__PURE__ */ (0, A.jsx)("dt", { children: o("type") }),
							/* @__PURE__ */ (0, A.jsx)("dd", { children: B.mimeType || o("file") }),
							/* @__PURE__ */ (0, A.jsx)("dt", { children: o("size") }),
							/* @__PURE__ */ (0, A.jsx)("dd", { children: be(B.size) }),
							/* @__PURE__ */ (0, A.jsx)("dt", { children: o("modified") }),
							/* @__PURE__ */ (0, A.jsx)("dd", { children: /* @__PURE__ */ (0, A.jsx)("time", {
								dateTime: (/* @__PURE__ */ new Date(B.modifiedAt * 1e3)).toISOString(),
								children: s.format(B.modifiedAt * 1e3)
							}) }),
							/* @__PURE__ */ (0, A.jsx)("dt", { children: o("location") }),
							/* @__PURE__ */ (0, A.jsx)("dd", { children: B.path }),
							r.checksum !== !1 && /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [/* @__PURE__ */ (0, A.jsx)("dt", { children: "SHA-256" }), /* @__PURE__ */ (0, A.jsx)("dd", { children: Ut?.path === B.path ? /* @__PURE__ */ (0, A.jsx)("code", {
								className: "sf-checksum",
								children: Ut.value
							}) : /* @__PURE__ */ (0, A.jsx)("button", {
								onClick: () => void n.checksum(u, B.path).then((e) => Wt({
									path: B.path,
									value: e.checksum
								})).catch(V),
								children: o("calculateChecksum")
							}) })] })
						]
					})]
				})
			}),
			Gt && /* @__PURE__ */ (0, A.jsx)(fe, {
				url: Gt.url,
				loginRequired: Gt.loginRequired,
				expiresAt: Gt.expiresAt,
				labels: {
					title: Gt.expiresAt ? o("temporaryFileUrl") : o("fileUrl"),
					close: o("close"),
					copied: o("urlCopied"),
					failed: o("copyUrlFailed"),
					hint: o("clickUrlToCopy"),
					loginRequired: o("loginRequired"),
					expires: o("linkExpires")
				},
				onClose: () => Kt(null)
			}),
			Ot && r.imageProcessing !== !1 && On.length > 0 && /* @__PURE__ */ (0, A.jsx)(Oe, {
				entries: On,
				resource: u,
				formats: Yt.formats.filter((e) => e.edit && [
					"jpeg",
					"png",
					"webp",
					"avif"
				].includes(e.format)).map((e) => e.format),
				labels: {
					title: o("imageProcess"),
					close: o("close"),
					cancel: o("cancel"),
					apply: o("applyImageProcess"),
					processing: o("processingImages"),
					selected: o("processingSelected"),
					operation: o("operation"),
					optimize: o("optimizeImage"),
					textWatermark: o("textWatermark"),
					imageWatermark: o("imageWatermark"),
					outputFormat: o("outputFormat"),
					keepFormat: o("keepFormat"),
					watermarkText: o("watermarkText"),
					color: o("color"),
					watermarkResource: o("watermarkResource"),
					watermarkPath: o("watermarkPath"),
					position: o("position"),
					topLeft: o("topLeft"),
					topRight: o("topRight"),
					center: o("center"),
					bottomLeft: o("bottomLeft"),
					bottomRight: o("bottomRight"),
					opacity: o("opacity"),
					scale: o("watermarkScale"),
					quality: o("quality"),
					saveMode: o("saveMode"),
					saveCopy: o("saveCopy"),
					overwrite: o("overwrite"),
					conversionCopyHint: o("conversionCopyHint"),
					overwriteWarning: o("confirmImageOverwrite")
				},
				onClose: () => kt(!1),
				onApply: async (e, t) => {
					if (On.length === 1) await n.applyImageActions(u, On[0].path, e, t), z(`${o("completed")}: 1`);
					else {
						let r = await n.applyImageBatch(u, On.map((e) => e.path), e, t);
						z(`${o("completed")}: ${r.succeeded} · ${o("failed")}: ${r.failed}`);
					}
					kt(!1), await Sn();
				}
			}),
			Et && W && it && /* @__PURE__ */ (0, A.jsx)(le, {
				entry: W,
				info: it,
				imageUrl: n.contentUrl(u, W.path),
				maximumFileNameLength: H?.maxFileNameLength ?? 120,
				labels: {
					crop: o("crop"),
					close: o("close"),
					cancel: o("cancel"),
					save: o("save"),
					saving: o("saving"),
					ratio: o("ratio"),
					free: o("freeRatio"),
					original: o("originalRatio"),
					zoom: o("zoom"),
					undo: o("undo"),
					redo: o("redo"),
					reset: o("reset"),
					compare: o("compare"),
					x: "X",
					y: "Y",
					width: o("width"),
					height: o("height"),
					saveMode: o("saveMode"),
					saveCopy: o("saveCopy"),
					overwrite: o("overwrite"),
					fileName: o("fileName"),
					fileNameTooLong: o("fileNameTooLongMaximum"),
					invalidFileName: o("invalidEntryName"),
					formatLocked: o("imageFormatLocked"),
					overwriteWarning: o("confirmImageOverwrite"),
					panHint: o("panHint")
				},
				onClose: () => Dt(!1),
				onSave: async (e, t) => {
					let r = await n.applyImageActions(u, W.path, e, t);
					Dt(!1), z(`${o("imageCreated")}: ${r.entry.name} · ${r.result.width} × ${r.result.height} px`), await Sn();
				}
			}),
			Rt && /* @__PURE__ */ (0, A.jsx)(re, {
				x: Rt.x,
				y: Rt.y,
				onClose: () => zt(null),
				onSelect: _r,
				items: [
					{
						id: Rt.entry.directory ? "open" : "preview",
						label: Rt.entry.directory ? o("open") : o("preview")
					},
					...Or === "picker" && !Rt.entry.directory ? [{
						id: "select",
						label: o("select"),
						disabled: !kn(Rt.entry)
					}] : [],
					{
						id: "download",
						label: o("download"),
						disabled: Rt.entry.directory
					},
					...Or === "manager" ? [
						{
							id: "rename",
							label: o("rename"),
							disabled: Rt.entry.capabilities?.rename === !1
						},
						{
							id: "copy",
							label: o("copy"),
							disabled: Rt.entry.capabilities?.copy === !1
						},
						{
							id: "move",
							label: o("move"),
							disabled: Rt.entry.capabilities?.move === !1
						},
						{
							id: "delete",
							label: o("remove"),
							disabled: Rt.entry.capabilities?.delete === !1,
							danger: !0
						},
						...Mn.filter((e) => e.slot === "context").map((e) => ({
							id: `plugin:${e.plugin}:${e.id}`,
							label: Pn(e),
							disabled: !Ln(e, Rt.entry)
						}))
					] : []
				]
			}),
			/* @__PURE__ */ (0, A.jsx)("div", {
				className: "sf-sr-only",
				"aria-live": "polite",
				children: U.length > 0 ? `${U.length} ${o("selectedCount")}` : Ze
			})
		]
	});
}
var Ue = (e) => !!(e && (e.startsWith("text/") || [
	"application/json",
	"application/ld+json",
	"application/xml",
	"application/x-yaml",
	"application/yaml"
].includes(e) || e.endsWith("+json") || e.endsWith("+xml"))), We = document.getElementById("sofinder-root");
if (!We) throw Error("SoFinder root element was not found.");
var Ge = JSON.parse(We.dataset.config || "{}");
(0, v.createRoot)(We).render(/* @__PURE__ */ (0, A.jsx)(_.StrictMode, { children: /* @__PURE__ */ (0, A.jsx)(He, { config: Ge }) }));
//#endregion
