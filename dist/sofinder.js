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
	function te(e, t) {
		return typeof e == "object" && e && e.key != null ? ee("" + e.key) : t.toString(36);
	}
	function A(e) {
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
	function j(e, r, i, a, o) {
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
				case d: return c = e._init, j(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + te(e, 0) : a, S(o) ? (i = "", c != null && (i = c.replace(k, "$&/") + "/"), j(o, r, i, "", function(e) {
			return e;
		})) : o != null && (O(o) && (o = D(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(k, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (S(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + te(a, u), c += j(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + te(a, u++), c += j(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return j(A(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function ne(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return j(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function M(e) {
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
	var N = typeof reportError == "function" ? reportError : function(e) {
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
	}, P = {
		map: ne,
		forEach: function(e, t, n) {
			ne(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return ne(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return ne(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!O(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = P, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w, e.__COMPILER_RUNTIME = {
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
			_init: M
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
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(C, N);
		} catch (e) {
			N(e);
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
				t !== null && te(x, t.startTime - e);
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
								u !== null && te(x, u.startTime - t), i = !1;
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
	function te(t, n) {
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
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(C), C = -1) : h = !0, te(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, S || (S = !0, O()))), r;
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
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), S = Symbol.for("react.consumer"), C = Symbol.for("react.context"), w = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), E = Symbol.for("react.suspense_list"), D = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), ee = Symbol.for("react.activity"), k = Symbol.for("react.memo_cache_sentinel"), te = Symbol.iterator;
	function A(e) {
		return typeof e != "object" || !e ? null : (e = te && e[te] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var j = Symbol.for("react.client.reference");
	function ne(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === j ? null : e.displayName || e.name || null;
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
			case D: return t = e.displayName || null, t === null ? ne(e.type) || "Memo" : t;
			case O:
				t = e._payload, e = e._init;
				try {
					return ne(e(t));
				} catch {}
		}
		return null;
	}
	var M = Array.isArray, N = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, P = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, re = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, ie = [], ae = -1;
	function oe(e) {
		return { current: e };
	}
	function F(e) {
		0 > ae || (e.current = ie[ae], ie[ae] = null, ae--);
	}
	function I(e, t) {
		ae++, ie[ae] = e.current, e.current = t;
	}
	var se = oe(null), ce = oe(null), le = oe(null), ue = oe(null);
	function de(e, t) {
		switch (I(le, t), I(ce, e), I(se, null), t.nodeType) {
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
		F(se), I(se, e);
	}
	function fe() {
		F(se), F(ce), F(le);
	}
	function pe(e) {
		e.memoizedState !== null && I(ue, e);
		var t = se.current, n = Hd(t, e.type);
		t !== n && (I(ce, e), I(se, n));
	}
	function me(e) {
		ce.current === e && (F(se), F(ce)), ue.current === e && (F(ue), Qf._currentValue = re);
	}
	var he, ge;
	function _e(e) {
		if (he === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			he = t && t[1] || "", ge = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + he + e + ge;
	}
	var ve = !1;
	function ye(e, t) {
		if (!e || ve) return "";
		ve = !0;
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
			ve = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? _e(n) : "";
	}
	function be(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return _e(e.type);
			case 16: return _e("Lazy");
			case 13: return e.child !== t && t !== null ? _e("Suspense Fallback") : _e("Suspense");
			case 19: return _e("SuspenseList");
			case 0:
			case 15: return ye(e.type, !1);
			case 11: return ye(e.type.render, !1);
			case 1: return ye(e.type, !0);
			case 31: return _e("Activity");
			default: return "";
		}
	}
	function xe(e) {
		try {
			var t = "", n = null;
			do
				t += be(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var Se = Object.prototype.hasOwnProperty, Ce = t.unstable_scheduleCallback, we = t.unstable_cancelCallback, Te = t.unstable_shouldYield, Ee = t.unstable_requestPaint, De = t.unstable_now, Oe = t.unstable_getCurrentPriorityLevel, ke = t.unstable_ImmediatePriority, Ae = t.unstable_UserBlockingPriority, je = t.unstable_NormalPriority, L = t.unstable_LowPriority, Me = t.unstable_IdlePriority, Ne = t.log, Pe = t.unstable_setDisableYieldValue, Fe = null, Ie = null;
	function Le(e) {
		if (typeof Ne == "function" && Pe(e), Ie && typeof Ie.setStrictMode == "function") try {
			Ie.setStrictMode(Fe, e);
		} catch {}
	}
	var Re = Math.clz32 ? Math.clz32 : R, ze = Math.log, Be = Math.LN2;
	function R(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (ze(e) / Be | 0) | 0;
	}
	var Ve = 256, He = 262144, z = 4194304;
	function Ue(e) {
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
	function We(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = Ue(n))) : i = Ue(o) : i = Ue(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = Ue(n))) : i = Ue(o)) : i = Ue(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Ge(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function Ke(e, t) {
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
	function qe() {
		var e = z;
		return z <<= 1, !(z & 62914560) && (z = 4194304), e;
	}
	function Je(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function Ye(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function Xe(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - Re(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && Ze(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function Ze(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - Re(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function Qe(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - Re(n), i = 1 << r;
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
		var e = P.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : mp(e.type)) : e;
	}
	function rt(e, t) {
		var n = P.p;
		try {
			return P.p = e, t();
		} finally {
			P.p = n;
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
		return Se.call(Tt, e) ? !0 : Se.call(wt, e) ? !1 : Ct.test(e) ? Tt[e] = !0 : (wt[e] = !0, !1);
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
	var B = /[\n"\\]/g;
	function It(e) {
		return e.replace(B, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function V(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + At(t)) : e.value !== "" + At(t) && (e.value = "" + At(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Lt(e, o, At(n)) : Lt(e, o, At(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + At(s) : e.removeAttribute("name");
	}
	function H(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Nt(e);
				return;
			}
			n = n == null ? "" : "" + At(n), t = t == null ? n : "" + At(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r = r ?? i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Nt(e);
	}
	function Lt(e, t, n) {
		t === "number" && Ft(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Rt(e, t, n, r) {
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
	function zt(e, t, n) {
		if (t != null && (t = "" + At(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + At(n);
	}
	function Bt(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(i(92));
				if (M(r)) {
					if (1 < r.length) throw Error(i(93));
					r = r[0];
				}
				n = r;
			}
			n ?? (n = ""), t = n;
		}
		n = At(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Nt(e);
	}
	function Vt(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var Ht = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function Ut(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Ht.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function Wt(e, t, n) {
		if (t != null && typeof t != "object") throw Error(i(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var a in t) r = t[a], t.hasOwnProperty(a) && n[a] !== r && Ut(e, a, r);
		} else for (var o in t) t.hasOwnProperty(o) && Ut(e, o, t[o]);
	}
	function Gt(e) {
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
	var Kt = /* @__PURE__ */ new Map([
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
	]), qt = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function Jt(e) {
		return qt.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function Yt() {}
	var Xt = null;
	function Zt(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var Qt = null, $t = null;
	function en(e) {
		var t = ht(e);
		if (t && (e = t.stateNode)) {
			var n = e[ot] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (V(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + It("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var a = r[ot] || null;
								if (!a) throw Error(i(90));
								V(r, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Pt(r);
					}
					break a;
				case "textarea":
					zt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Rt(e, !!n.multiple, t, !1);
			}
		}
	}
	var tn = !1;
	function nn(e, t, n) {
		if (tn) return e(t, n);
		tn = !0;
		try {
			return e(t);
		} finally {
			if (tn = !1, (Qt !== null || $t !== null) && (bu(), Qt && (t = Qt, e = $t, $t = Qt = null, en(t), e))) for (t = 0; t < e.length; t++) en(e[t]);
		}
	}
	function rn(e, t) {
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
	var an = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), on = !1;
	if (an) try {
		var sn = {};
		Object.defineProperty(sn, "passive", { get: function() {
			on = !0;
		} }), window.addEventListener("test", sn, sn), window.removeEventListener("test", sn, sn);
	} catch {
		on = !1;
	}
	var cn = null, ln = null, un = null;
	function dn() {
		if (un) return un;
		var e, t = ln, n = t.length, r, i = "value" in cn ? cn.value : cn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return un = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function fn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function pn() {
		return !0;
	}
	function mn() {
		return !1;
	}
	function hn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? pn : mn, this.isPropagationStopped = mn, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = pn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = pn);
			},
			persist: function() {},
			isPersistent: pn
		}), t;
	}
	var gn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, _n = hn(gn), vn = h({}, gn, {
		view: 0,
		detail: 0
	}), yn = hn(vn), bn, xn, Sn, Cn = h({}, vn, {
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
		getModifierState: Pn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== Sn && (Sn && e.type === "mousemove" ? (bn = e.screenX - Sn.screenX, xn = e.screenY - Sn.screenY) : xn = bn = 0, Sn = e), bn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : xn;
		}
	}), wn = hn(Cn), Tn = hn(h({}, Cn, { dataTransfer: 0 })), En = hn(h({}, vn, { relatedTarget: 0 })), Dn = hn(h({}, gn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), On = hn(h({}, gn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), kn = hn(h({}, gn, { data: 0 })), An = {
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
	}, jn = {
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
	}, Mn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Nn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = Mn[e]) ? !!t[e] : !1;
	}
	function Pn() {
		return Nn;
	}
	var Fn = hn(h({}, vn, {
		key: function(e) {
			if (e.key) {
				var t = An[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = fn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? jn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Pn,
		charCode: function(e) {
			return e.type === "keypress" ? fn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? fn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), In = hn(h({}, Cn, {
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
	})), Ln = hn(h({}, vn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Pn
	})), Rn = hn(h({}, gn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), zn = hn(h({}, Cn, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), Bn = hn(h({}, gn, {
		newState: 0,
		oldState: 0
	})), Vn = [
		9,
		13,
		27,
		32
	], Hn = an && "CompositionEvent" in window, Un = null;
	an && "documentMode" in document && (Un = document.documentMode);
	var Wn = an && "TextEvent" in window && !Un, Gn = an && (!Hn || Un && 8 < Un && 11 >= Un), Kn = " ", qn = !1;
	function Jn(e, t) {
		switch (e) {
			case "keyup": return Vn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function Yn(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var Xn = !1;
	function Zn(e, t) {
		switch (e) {
			case "compositionend": return Yn(t);
			case "keypress": return t.which === 32 ? (qn = !0, Kn) : null;
			case "textInput": return e = t.data, e === Kn && qn ? null : e;
			default: return null;
		}
	}
	function Qn(e, t) {
		if (Xn) return e === "compositionend" || !Hn && Jn(e, t) ? (e = dn(), un = ln = cn = null, Xn = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return Gn && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var $n = {
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
	function er(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!$n[e.type] : t === "textarea";
	}
	function tr(e, t, n, r) {
		Qt ? $t ? $t.push(r) : $t = [r] : Qt = r, t = Ed(t, "onChange"), 0 < t.length && (n = new _n("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var nr = null, rr = null;
	function ir(e) {
		yd(e, 0);
	}
	function ar(e) {
		if (Pt(gt(e))) return e;
	}
	function or(e, t) {
		if (e === "change") return t;
	}
	var sr = !1;
	if (an) {
		var cr;
		if (an) {
			var lr = "oninput" in document;
			if (!lr) {
				var ur = document.createElement("div");
				ur.setAttribute("oninput", "return;"), lr = typeof ur.oninput == "function";
			}
			cr = lr;
		} else cr = !1;
		sr = cr && (!document.documentMode || 9 < document.documentMode);
	}
	function dr() {
		nr && (nr.detachEvent("onpropertychange", fr), rr = nr = null);
	}
	function fr(e) {
		if (e.propertyName === "value" && ar(rr)) {
			var t = [];
			tr(t, rr, e, Zt(e)), nn(ir, t);
		}
	}
	function pr(e, t, n) {
		e === "focusin" ? (dr(), nr = t, rr = n, nr.attachEvent("onpropertychange", fr)) : e === "focusout" && dr();
	}
	function mr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return ar(rr);
	}
	function hr(e, t) {
		if (e === "click") return ar(t);
	}
	function gr(e, t) {
		if (e === "input" || e === "change") return ar(t);
	}
	function _r(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var vr = typeof Object.is == "function" ? Object.is : _r;
	function yr(e, t) {
		if (vr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!Se.call(t, i) || !vr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function br(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function xr(e, t) {
		var n = br(e);
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
			n = br(n);
		}
	}
	function Sr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Sr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Cr(e) {
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
	function wr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Tr = an && "documentMode" in document && 11 >= document.documentMode, Er = null, Dr = null, Or = null, kr = !1;
	function Ar(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		kr || Er == null || Er !== Ft(r) || (r = Er, "selectionStart" in r && wr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Or && yr(Or, r) || (Or = r, r = Ed(Dr, "onSelect"), 0 < r.length && (t = new _n("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Er)));
	}
	function jr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var Mr = {
		animationend: jr("Animation", "AnimationEnd"),
		animationiteration: jr("Animation", "AnimationIteration"),
		animationstart: jr("Animation", "AnimationStart"),
		transitionrun: jr("Transition", "TransitionRun"),
		transitionstart: jr("Transition", "TransitionStart"),
		transitioncancel: jr("Transition", "TransitionCancel"),
		transitionend: jr("Transition", "TransitionEnd")
	}, Nr = {}, Pr = {};
	an && (Pr = document.createElement("div").style, "AnimationEvent" in window || (delete Mr.animationend.animation, delete Mr.animationiteration.animation, delete Mr.animationstart.animation), "TransitionEvent" in window || delete Mr.transitionend.transition);
	function Fr(e) {
		if (Nr[e]) return Nr[e];
		if (!Mr[e]) return e;
		var t = Mr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Pr) return Nr[e] = t[n];
		return e;
	}
	var Ir = Fr("animationend"), Lr = Fr("animationiteration"), Rr = Fr("animationstart"), zr = Fr("transitionrun"), Br = Fr("transitionstart"), Vr = Fr("transitioncancel"), Hr = Fr("transitionend"), Ur = /* @__PURE__ */ new Map(), Wr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Wr.push("scrollEnd");
	function Gr(e, t) {
		Ur.set(e, t), xt(t, [e]);
	}
	var Kr = typeof reportError == "function" ? reportError : function(e) {
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
	}, qr = [], Jr = 0, Yr = 0;
	function Xr() {
		for (var e = Jr, t = Yr = Jr = 0; t < e;) {
			var n = qr[t];
			qr[t++] = null;
			var r = qr[t];
			qr[t++] = null;
			var i = qr[t];
			qr[t++] = null;
			var a = qr[t];
			if (qr[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && ei(n, i, a);
		}
	}
	function Zr(e, t, n, r) {
		qr[Jr++] = e, qr[Jr++] = t, qr[Jr++] = n, qr[Jr++] = r, Yr |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function Qr(e, t, n, r) {
		return Zr(e, t, n, r), ti(e);
	}
	function $r(e, t) {
		return Zr(e, null, null, t), ti(e);
	}
	function ei(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - Re(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function ti(e) {
		if (50 < du) throw du = 0, fu = null, Error(i(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var ni = {};
	function ri(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function ii(e, t, n, r) {
		return new ri(e, t, n, r);
	}
	function ai(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function oi(e, t) {
		var n = e.alternate;
		return n === null ? (n = ii(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function si(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function ci(e, t, n, r, a, o) {
		var s = 0;
		if (r = e, typeof e == "function") ai(e) && (s = 1);
		else if (typeof e == "string") s = Uf(e, n, se.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case ee: return e = ii(31, n, t, a), e.elementType = ee, e.lanes = o, e;
			case y: return li(n.children, a, o, t);
			case b:
				s = 8, a |= 24;
				break;
			case x: return e = ii(12, n, t, a | 2), e.elementType = x, e.lanes = o, e;
			case T: return e = ii(13, n, t, a), e.elementType = T, e.lanes = o, e;
			case E: return e = ii(19, n, t, a), e.elementType = E, e.lanes = o, e;
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
		return t = ii(s, n, t, a), t.elementType = e, t.type = r, t.lanes = o, t;
	}
	function li(e, t, n, r) {
		return e = ii(7, e, r, t), e.lanes = n, e;
	}
	function ui(e, t, n) {
		return e = ii(6, e, null, t), e.lanes = n, e;
	}
	function di(e) {
		var t = ii(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function fi(e, t, n) {
		return t = ii(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var pi = /* @__PURE__ */ new WeakMap();
	function mi(e, t) {
		if (typeof e == "object" && e) {
			var n = pi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: xe(t)
			}, pi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: xe(t)
		};
	}
	var hi = [], gi = 0, _i = null, vi = 0, yi = [], bi = 0, xi = null, Si = 1, Ci = "";
	function wi(e, t) {
		hi[gi++] = vi, hi[gi++] = _i, _i = e, vi = t;
	}
	function Ti(e, t, n) {
		yi[bi++] = Si, yi[bi++] = Ci, yi[bi++] = xi, xi = e;
		var r = Si;
		e = Ci;
		var i = 32 - Re(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - Re(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, Si = 1 << 32 - Re(t) + i | n << i | r, Ci = a + e;
		} else Si = 1 << a | n << i | r, Ci = e;
	}
	function Ei(e) {
		e.return !== null && (wi(e, 1), Ti(e, 1, 0));
	}
	function Di(e) {
		for (; e === _i;) _i = hi[--gi], hi[gi] = null, vi = hi[--gi], hi[gi] = null;
		for (; e === xi;) xi = yi[--bi], yi[bi] = null, Ci = yi[--bi], yi[bi] = null, Si = yi[--bi], yi[bi] = null;
	}
	function Oi(e, t) {
		yi[bi++] = Si, yi[bi++] = Ci, yi[bi++] = xi, Si = t.id, Ci = t.overflow, xi = e;
	}
	var ki = null, Ai = null, U = !1, ji = null, Mi = !1, Ni = Error(i(519));
	function Pi(e) {
		throw Bi(mi(Error(i(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), Ni;
	}
	function Fi(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[at] = e, t[ot] = r, n) {
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
				Q("invalid", t), H(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), Bt(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Md(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = Yt), t = !0) : t = !1, t || Pi(e, !0);
	}
	function Ii(e) {
		for (ki = e.return; ki;) switch (ki.tag) {
			case 5:
			case 31:
			case 13:
				Mi = !1;
				return;
			case 27:
			case 3:
				Mi = !0;
				return;
			default: ki = ki.return;
		}
	}
	function Li(e) {
		if (e !== ki) return !1;
		if (!U) return Ii(e), U = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = n === "form" || n === "button" || Ud(e.type, e.memoizedProps)), n = !n), n && Ai && Pi(e), Ii(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Ai = uf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(317));
			Ai = uf(e);
		} else t === 27 ? (t = Ai, Zd(e.type) ? (e = lf, lf = null, Ai = e) : Ai = t) : Ai = ki ? cf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Ri() {
		Ai = ki = null, U = !1;
	}
	function zi() {
		var e = ji;
		return e !== null && (Zl === null ? Zl = e : Zl.push.apply(Zl, e), ji = null), e;
	}
	function Bi(e) {
		ji === null ? ji = [e] : ji.push(e);
	}
	var Vi = oe(null), Hi = null, Ui = null;
	function Wi(e, t, n) {
		I(Vi, t._currentValue), t._currentValue = n;
	}
	function Gi(e) {
		e._currentValue = Vi.current, F(Vi);
	}
	function Ki(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function qi(e, t, n, r) {
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
						o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Ki(o.return, n, e), r || (s = null);
						break a;
					}
					o = c.next;
				}
			} else if (a.tag === 18) {
				if (s = a.return, s === null) throw Error(i(341));
				s.lanes |= n, o = s.alternate, o !== null && (o.lanes |= n), Ki(s, n, e), s = null;
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
	function Ji(e, t, n, r) {
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
					vr(a.pendingProps.value, s.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (a === ue.current) {
				if (s = a.alternate, s === null) throw Error(i(387));
				s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (e === null ? e = [Qf] : e.push(Qf));
			}
			a = a.return;
		}
		e !== null && qi(t, e, n, r), t.flags |= 262144;
	}
	function Yi(e) {
		for (e = e.firstContext; e !== null;) {
			if (!vr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function Xi(e) {
		Hi = e, Ui = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function Zi(e) {
		return $i(Hi, e);
	}
	function Qi(e, t) {
		return Hi === null && Xi(e), $i(e, t);
	}
	function $i(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Ui === null) {
			if (e === null) throw Error(i(308));
			Ui = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Ui = Ui.next = t;
		return n;
	}
	var ea = typeof AbortController < "u" ? AbortController : function() {
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
	}, ta = t.unstable_scheduleCallback, na = t.unstable_NormalPriority, ra = {
		$$typeof: C,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function ia() {
		return {
			controller: new ea(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function aa(e) {
		e.refCount--, e.refCount === 0 && ta(na, function() {
			e.controller.abort();
		});
	}
	var oa = null, sa = 0, ca = 0, la = null;
	function ua(e, t) {
		if (oa === null) {
			var n = oa = [];
			sa = 0, ca = dd(), la = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return sa++, t.then(da, da), t;
	}
	function da() {
		if (--sa === 0 && oa !== null) {
			la !== null && (la.status = "fulfilled");
			var e = oa;
			oa = null, ca = 0, la = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function fa(e, t) {
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
	var pa = N.S;
	N.S = function(e, t) {
		eu = De(), typeof t == "object" && t && typeof t.then == "function" && ua(e, t), pa !== null && pa(e, t);
	};
	var ma = oe(null);
	function ha() {
		var e = ma.current;
		return e === null ? q.pooledCache : e;
	}
	function ga(e, t) {
		t === null ? I(ma, ma.current) : I(ma, t.pool);
	}
	function _a() {
		var e = ha();
		return e === null ? null : {
			parent: ra._currentValue,
			pool: e
		};
	}
	var va = Error(i(460)), ya = Error(i(474)), ba = Error(i(542)), xa = { then: function() {} };
	function Sa(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function Ca(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(Yt, Yt), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Da(e), e;
			default:
				if (typeof t.status == "string") t.then(Yt, Yt);
				else {
					if (e = q, e !== null && 100 < e.shellSuspendCounter) throw Error(i(482));
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
					case "rejected": throw e = t.reason, Da(e), e;
				}
				throw Ta = t, va;
		}
	}
	function wa(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (Ta = e, va) : e;
		}
	}
	var Ta = null;
	function Ea() {
		if (Ta === null) throw Error(i(459));
		var e = Ta;
		return Ta = null, e;
	}
	function Da(e) {
		if (e === va || e === ba) throw Error(i(483));
	}
	var Oa = null, ka = 0;
	function Aa(e) {
		var t = ka;
		return ka += 1, Oa === null && (Oa = []), Ca(Oa, e, t);
	}
	function ja(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Ma(e, t) {
		throw t.$$typeof === g ? Error(i(525)) : (e = Object.prototype.toString.call(t), Error(i(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function Na(e) {
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
			return e = oi(e, t), e.index = 0, e.sibling = null, e;
		}
		function o(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function s(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = ui(n, e.mode, r), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var i = n.type;
			return i === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === i || typeof i == "object" && i && i.$$typeof === O && wa(i) === t.type) ? (t = a(t, n.props), ja(t, n), t.return = e, t) : (t = ci(n.type, n.key, n.props, null, e.mode, r), ja(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = fi(n, e.mode, r), t.return = e, t) : (t = a(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, i) {
			return t === null || t.tag !== 7 ? (t = li(n, e.mode, r, i), t.return = e, t) : (t = a(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = ui("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = ci(t.type, t.key, t.props, null, e.mode, n), ja(n, t), n.return = e, n;
					case v: return t = fi(t, e.mode, n), t.return = e, t;
					case O: return t = wa(t), f(e, t, n);
				}
				if (M(t) || A(t)) return t = li(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Aa(t), n);
				if (t.$$typeof === C) return f(e, Qi(e, t), n);
				Ma(e, t);
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
					case O: return n = wa(n), p(e, t, n, r);
				}
				if (M(n) || A(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Aa(n), r);
				if (n.$$typeof === C) return p(e, t, Qi(e, n), r);
				Ma(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case O: return r = wa(r), m(e, t, n, r, i);
				}
				if (M(r) || A(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Aa(r), i);
				if (r.$$typeof === C) return m(e, t, n, Qi(t, r), i);
				Ma(t, r);
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
			if (h === s.length) return n(i, d), U && wi(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (a = o(d, a, h), u === null ? l = d : u.sibling = d, u = d);
				return U && wi(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), a = o(g, a, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), U && wi(i, h), l;
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
			if (v.done) return n(a, h), U && wi(a, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(a, v.value, l), v !== null && (s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
				return U && wi(a, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, a, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), s = o(v, s, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(a, e);
			}), U && wi(a, g), u;
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
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === O && wa(l) === r.type) {
										n(e, r.sibling), c = a(r, o.props), ja(c, o), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								}
								t(e, r), r = r.sibling;
							}
							o.type === y ? (c = li(o.props.children, e.mode, c, o.key), c.return = e, e = c) : (c = ci(o.type, o.key, o.props, null, e.mode, c), ja(c, o), c.return = e, e = c);
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
							c = fi(o, e.mode, c), c.return = e, e = c;
						}
						return s(e);
					case O: return o = wa(o), b(e, r, o, c);
				}
				if (M(o)) return h(e, r, o, c);
				if (A(o)) {
					if (l = A(o), typeof l != "function") throw Error(i(150));
					return o = l.call(o), g(e, r, o, c);
				}
				if (typeof o.then == "function") return b(e, r, Aa(o), c);
				if (o.$$typeof === C) return b(e, r, Qi(e, o), c);
				Ma(e, o);
			}
			return typeof o == "string" && o !== "" || typeof o == "number" || typeof o == "bigint" ? (o = "" + o, r !== null && r.tag === 6 ? (n(e, r.sibling), c = a(r, o), c.return = e, e = c) : (n(e, r), c = ui(o, e.mode, c), c.return = e, e = c), s(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				ka = 0;
				var i = b(e, t, n, r);
				return Oa = null, i;
			} catch (t) {
				if (t === va || t === ba) throw t;
				var a = ii(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var Pa = Na(!0), Fa = Na(!1), Ia = !1;
	function La(e) {
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
	function Ra(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function za(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Ba(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, K & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = ti(e), ei(e, null, n), t;
		}
		return Zr(e, r, t, n), ti(e);
	}
	function Va(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Qe(e, n);
		}
	}
	function Ha(e, t) {
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
	var Ua = !1;
	function Wa() {
		if (Ua) {
			var e = la;
			if (e !== null) throw e;
		}
	}
	function Ga(e, t, n, r) {
		Ua = !1;
		var i = e.updateQueue;
		Ia = !1;
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
					f !== 0 && f === ca && (Ua = !0), u !== null && (u = u.next = {
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
							case 2: Ia = !0;
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
	function Ka(e, t) {
		if (typeof e != "function") throw Error(i(191, e));
		e.call(t);
	}
	function qa(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Ka(n[e], t);
	}
	var Ja = oe(null), Ya = oe(0);
	function Xa(e, t) {
		e = Ul, I(Ya, e), I(Ja, t), Ul = e | t.baseLanes;
	}
	function Za() {
		I(Ya, Ul), I(Ja, Ja.current);
	}
	function Qa() {
		Ul = Ya.current, F(Ja), F(Ya);
	}
	var $a = oe(null), eo = null;
	function to(e) {
		var t = e.alternate;
		I(oo, oo.current & 1), I($a, e), eo === null && (t === null || Ja.current !== null || t.memoizedState !== null) && (eo = e);
	}
	function no(e) {
		I(oo, oo.current), I($a, e), eo === null && (eo = e);
	}
	function ro(e) {
		e.tag === 22 ? (I(oo, oo.current), I($a, e), eo === null && (eo = e)) : io(e);
	}
	function io() {
		I(oo, oo.current), I($a, $a.current);
	}
	function ao(e) {
		F($a), eo === e && (eo = null), F(oo);
	}
	var oo = oe(0);
	function so(e) {
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
	var co = 0, W = null, G = null, lo = null, uo = !1, fo = !1, po = !1, mo = 0, ho = 0, go = null, _o = 0;
	function vo() {
		throw Error(i(321));
	}
	function yo(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!vr(e[n], t[n])) return !1;
		return !0;
	}
	function bo(e, t, n, r, i, a) {
		return co = a, W = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, N.H = e === null || e.memoizedState === null ? Ls : Rs, po = !1, a = n(r, i), po = !1, fo && (a = So(t, n, r, i)), xo(e), a;
	}
	function xo(e) {
		N.H = Is;
		var t = G !== null && G.next !== null;
		if (co = 0, lo = G = W = null, uo = !1, ho = 0, go = null, t) throw Error(i(300));
		e === null || tc || (e = e.dependencies, e !== null && Yi(e) && (tc = !0));
	}
	function So(e, t, n, r) {
		W = e;
		var a = 0;
		do {
			if (fo && (go = null), ho = 0, fo = !1, 25 <= a) throw Error(i(301));
			if (a += 1, lo = G = null, e.updateQueue != null) {
				var o = e.updateQueue;
				o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
			}
			N.H = zs, o = t(n, r);
		} while (fo);
		return o;
	}
	function Co() {
		var e = N.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? Ao(t) : t, e = e.useState()[0], (G === null ? null : G.memoizedState) !== e && (W.flags |= 1024), t;
	}
	function wo() {
		var e = mo !== 0;
		return mo = 0, e;
	}
	function To(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function Eo(e) {
		if (uo) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			uo = !1;
		}
		co = 0, lo = G = W = null, fo = !1, ho = mo = 0, go = null;
	}
	function Do() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return lo === null ? W.memoizedState = lo = e : lo = lo.next = e, lo;
	}
	function Oo() {
		if (G === null) {
			var e = W.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = G.next;
		var t = lo === null ? W.memoizedState : lo.next;
		if (t !== null) lo = t, G = e;
		else {
			if (e === null) throw W.alternate === null ? Error(i(467)) : Error(i(310));
			G = e, e = {
				memoizedState: G.memoizedState,
				baseState: G.baseState,
				baseQueue: G.baseQueue,
				queue: G.queue,
				next: null
			}, lo === null ? W.memoizedState = lo = e : lo = lo.next = e;
		}
		return lo;
	}
	function ko() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function Ao(e) {
		var t = ho;
		return ho += 1, go === null && (go = []), e = Ca(go, e, t), t = W, (lo === null ? t.memoizedState : lo.next) === null && (t = t.alternate, N.H = t === null || t.memoizedState === null ? Ls : Rs), e;
	}
	function jo(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return Ao(e);
			if (e.$$typeof === C) return Zi(e);
		}
		throw Error(i(438, String(e)));
	}
	function Mo(e) {
		var t = null, n = W.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = W.alternate;
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
		}), n === null && (n = ko(), W.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = k;
		return t.index++, n;
	}
	function No(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Po(e) {
		return Fo(Oo(), G, e);
	}
	function Fo(e, t, n) {
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
				if (f === u.lane ? (co & f) === f : (Y & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === ca && (d = !0);
					else if ((co & p) === p) {
						u = u.next, p === ca && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, s = o) : l = l.next = f, W.lanes |= p, Gl |= p;
					f = u.action, po && n(o, f), o = u.hasEagerState ? u.eagerState : n(o, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, s = o) : l = l.next = p, W.lanes |= f, Gl |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? s = o : l.next = c, !vr(o, e.memoizedState) && (tc = !0, d && (n = la, n !== null))) throw n;
			e.memoizedState = o, e.baseState = s, e.baseQueue = l, r.lastRenderedState = o;
		}
		return a === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function Io(e) {
		var t = Oo(), n = t.queue;
		if (n === null) throw Error(i(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, a = n.pending, o = t.memoizedState;
		if (a !== null) {
			n.pending = null;
			var s = a = a.next;
			do
				o = e(o, s.action), s = s.next;
			while (s !== a);
			vr(o, t.memoizedState) || (tc = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
		}
		return [o, r];
	}
	function Lo(e, t, n) {
		var r = W, a = Oo(), o = U;
		if (o) {
			if (n === void 0) throw Error(i(407));
			n = n();
		} else n = t();
		var s = !vr((G || a).memoizedState, n);
		if (s && (a.memoizedState = n, tc = !0), a = a.queue, cs(Bo.bind(null, r, a, e), [e]), a.getSnapshot !== t || s || lo !== null && lo.memoizedState.tag & 1) {
			if (r.flags |= 2048, rs(9, { destroy: void 0 }, zo.bind(null, r, a, n, t), null), q === null) throw Error(i(349));
			o || co & 127 || Ro(r, t, n);
		}
		return n;
	}
	function Ro(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = W.updateQueue, t === null ? (t = ko(), W.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function zo(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Vo(t) && Ho(e);
	}
	function Bo(e, t, n) {
		return n(function() {
			Vo(t) && Ho(e);
		});
	}
	function Vo(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !vr(e, n);
		} catch {
			return !0;
		}
	}
	function Ho(e) {
		var t = $r(e, 2);
		t !== null && hu(t, e, 2);
	}
	function Uo(e) {
		var t = Do();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), po) {
				Le(!0);
				try {
					n();
				} finally {
					Le(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: No,
			lastRenderedState: e
		}, t;
	}
	function Wo(e, t, n, r) {
		return e.baseState = n, Fo(e, G, typeof r == "function" ? r : No);
	}
	function Go(e, t, n, r, a) {
		if (Ns(e)) throw Error(i(485));
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
			N.T === null ? o.isTransition = !1 : n(!0), r(o), n = t.pending, n === null ? (o.next = t.pending = o, Ko(t, o)) : (o.next = n.next, t.pending = n.next = o);
		}
	}
	function Ko(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = N.T, o = {};
			N.T = o;
			try {
				var s = n(i, r), c = N.S;
				c !== null && c(o, s), qo(e, t, s);
			} catch (n) {
				Yo(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), N.T = a;
			}
		} else try {
			a = n(i, r), qo(e, t, a);
		} catch (n) {
			Yo(e, t, n);
		}
	}
	function qo(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Jo(e, t, n);
		}, function(n) {
			return Yo(e, t, n);
		}) : Jo(e, t, n);
	}
	function Jo(e, t, n) {
		t.status = "fulfilled", t.value = n, Xo(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Ko(e, n)));
	}
	function Yo(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, Xo(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function Xo(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function Zo(e, t) {
		return t;
	}
	function Qo(e, t) {
		if (U) {
			var n = q.formState;
			if (n !== null) {
				a: {
					var r = W;
					if (U) {
						if (Ai) {
							b: {
								for (var i = Ai, a = Mi; i.nodeType !== 8;) {
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
								Ai = cf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Pi(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = Do(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Zo,
			lastRenderedState: t
		}, n.queue = r, n = As.bind(null, W, r), r.dispatch = n, r = Uo(!1), a = Ms.bind(null, W, !1, r.queue), r = Do(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Go.bind(null, W, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function $o(e) {
		return es(Oo(), G, e);
	}
	function es(e, t, n) {
		if (t = Fo(e, t, Zo)[0], e = Po(No)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = Ao(t);
		} catch (e) {
			throw e === va ? ba : e;
		}
		else r = t;
		t = Oo();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (W.flags |= 2048, rs(9, { destroy: void 0 }, ts.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function ts(e, t) {
		e.action = t;
	}
	function ns(e) {
		var t = Oo(), n = G;
		if (n !== null) return es(t, n, e);
		Oo(), t = t.memoizedState, n = Oo();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function rs(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = W.updateQueue, t === null && (t = ko(), W.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function is() {
		return Oo().memoizedState;
	}
	function as(e, t, n, r) {
		var i = Do();
		W.flags |= e, i.memoizedState = rs(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function os(e, t, n, r) {
		var i = Oo();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		G !== null && r !== null && yo(r, G.memoizedState.deps) ? i.memoizedState = rs(t, a, n, r) : (W.flags |= e, i.memoizedState = rs(1 | t, a, n, r));
	}
	function ss(e, t) {
		as(8390656, 8, e, t);
	}
	function cs(e, t) {
		os(2048, 8, e, t);
	}
	function ls(e) {
		W.flags |= 4;
		var t = W.updateQueue;
		if (t === null) t = ko(), W.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function us(e) {
		var t = Oo().memoizedState;
		return ls({
			ref: t,
			nextImpl: e
		}), function() {
			if (K & 2) throw Error(i(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function ds(e, t) {
		return os(4, 2, e, t);
	}
	function fs(e, t) {
		return os(4, 4, e, t);
	}
	function ps(e, t) {
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
	function ms(e, t, n) {
		n = n == null ? null : n.concat([e]), os(4, 4, ps.bind(null, t, e), n);
	}
	function hs() {}
	function gs(e, t) {
		var n = Oo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && yo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function _s(e, t) {
		var n = Oo();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && yo(t, r[1])) return r[0];
		if (r = e(), po) {
			Le(!0);
			try {
				e();
			} finally {
				Le(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function vs(e, t, n) {
		return n === void 0 || co & 1073741824 && !(Y & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = mu(), W.lanes |= e, Gl |= e, n);
	}
	function ys(e, t, n, r) {
		return vr(n, t) ? n : Ja.current === null ? !(co & 42) || co & 1073741824 && !(Y & 261930) ? (tc = !0, e.memoizedState = n) : (e = mu(), W.lanes |= e, Gl |= e, t) : (e = vs(e, n, r), vr(e, t) || (tc = !0), e);
	}
	function bs(e, t, n, r, i) {
		var a = P.p;
		P.p = a !== 0 && 8 > a ? a : 8;
		var o = N.T, s = {};
		N.T = s, Ms(e, !1, t, n);
		try {
			var c = i(), l = N.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? js(e, t, fa(c, r), pu(e)) : js(e, t, r, pu(e));
		} catch (n) {
			js(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, pu());
		} finally {
			P.p = a, o !== null && s.types !== null && (o.types = s.types), N.T = o;
		}
	}
	function xs() {}
	function Ss(e, t, n, r) {
		if (e.tag !== 5) throw Error(i(476));
		var a = Cs(e).queue;
		bs(e, a, t, re, n === null ? xs : function() {
			return ws(e), n(r);
		});
	}
	function Cs(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: re,
			baseState: re,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: No,
				lastRenderedState: re
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
				lastRenderedReducer: No,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function ws(e) {
		var t = Cs(e);
		t.next === null && (t = e.alternate.memoizedState), js(e, t.next.queue, {}, pu());
	}
	function Ts() {
		return Zi(Qf);
	}
	function Es() {
		return Oo().memoizedState;
	}
	function Ds() {
		return Oo().memoizedState;
	}
	function Os(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = pu();
					e = za(n);
					var r = Ba(t, e, n);
					r !== null && (hu(r, t, n), Va(r, t, n)), t = { cache: ia() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function ks(e, t, n) {
		var r = pu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Ns(e) ? Ps(t, n) : (n = Qr(e, t, n, r), n !== null && (hu(n, e, r), Fs(n, t, r)));
	}
	function As(e, t, n) {
		js(e, t, n, pu());
	}
	function js(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Ns(e)) Ps(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, vr(s, o)) return Zr(e, t, i, 0), q === null && Xr(), !1;
			} catch {}
			if (n = Qr(e, t, i, r), n !== null) return hu(n, e, r), Fs(n, t, r), !0;
		}
		return !1;
	}
	function Ms(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: dd(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Ns(e)) {
			if (t) throw Error(i(479));
		} else t = Qr(e, n, r, 2), t !== null && hu(t, e, 2);
	}
	function Ns(e) {
		var t = e.alternate;
		return e === W || t !== null && t === W;
	}
	function Ps(e, t) {
		fo = uo = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Fs(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, Qe(e, n);
		}
	}
	var Is = {
		readContext: Zi,
		use: jo,
		useCallback: vo,
		useContext: vo,
		useEffect: vo,
		useImperativeHandle: vo,
		useLayoutEffect: vo,
		useInsertionEffect: vo,
		useMemo: vo,
		useReducer: vo,
		useRef: vo,
		useState: vo,
		useDebugValue: vo,
		useDeferredValue: vo,
		useTransition: vo,
		useSyncExternalStore: vo,
		useId: vo,
		useHostTransitionStatus: vo,
		useFormState: vo,
		useActionState: vo,
		useOptimistic: vo,
		useMemoCache: vo,
		useCacheRefresh: vo
	};
	Is.useEffectEvent = vo;
	var Ls = {
		readContext: Zi,
		use: jo,
		useCallback: function(e, t) {
			return Do().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: Zi,
		useEffect: ss,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), as(4194308, 4, ps.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return as(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			as(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = Do();
			t = t === void 0 ? null : t;
			var r = e();
			if (po) {
				Le(!0);
				try {
					e();
				} finally {
					Le(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = Do();
			if (n !== void 0) {
				var i = n(t);
				if (po) {
					Le(!0);
					try {
						n(t);
					} finally {
						Le(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = ks.bind(null, W, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = Do();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Uo(e);
			var t = e.queue, n = As.bind(null, W, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: hs,
		useDeferredValue: function(e, t) {
			return vs(Do(), e, t);
		},
		useTransition: function() {
			var e = Uo(!1);
			return e = bs.bind(null, W, e.queue, !0, !1), Do().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = W, a = Do();
			if (U) {
				if (n === void 0) throw Error(i(407));
				n = n();
			} else {
				if (n = t(), q === null) throw Error(i(349));
				Y & 127 || Ro(r, t, n);
			}
			a.memoizedState = n;
			var o = {
				value: n,
				getSnapshot: t
			};
			return a.queue = o, ss(Bo.bind(null, r, o, e), [e]), r.flags |= 2048, rs(9, { destroy: void 0 }, zo.bind(null, r, o, n, t), null), n;
		},
		useId: function() {
			var e = Do(), t = q.identifierPrefix;
			if (U) {
				var n = Ci, r = Si;
				n = (r & ~(1 << 32 - Re(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = mo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = _o++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Ts,
		useFormState: Qo,
		useActionState: Qo,
		useOptimistic: function(e) {
			var t = Do();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Ms.bind(null, W, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Mo,
		useCacheRefresh: function() {
			return Do().memoizedState = Os.bind(null, W);
		},
		useEffectEvent: function(e) {
			var t = Do(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (K & 2) throw Error(i(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Rs = {
		readContext: Zi,
		use: jo,
		useCallback: gs,
		useContext: Zi,
		useEffect: cs,
		useImperativeHandle: ms,
		useInsertionEffect: ds,
		useLayoutEffect: fs,
		useMemo: _s,
		useReducer: Po,
		useRef: is,
		useState: function() {
			return Po(No);
		},
		useDebugValue: hs,
		useDeferredValue: function(e, t) {
			return ys(Oo(), G.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Po(No)[0], t = Oo().memoizedState;
			return [typeof e == "boolean" ? e : Ao(e), t];
		},
		useSyncExternalStore: Lo,
		useId: Es,
		useHostTransitionStatus: Ts,
		useFormState: $o,
		useActionState: $o,
		useOptimistic: function(e, t) {
			return Wo(Oo(), G, e, t);
		},
		useMemoCache: Mo,
		useCacheRefresh: Ds
	};
	Rs.useEffectEvent = us;
	var zs = {
		readContext: Zi,
		use: jo,
		useCallback: gs,
		useContext: Zi,
		useEffect: cs,
		useImperativeHandle: ms,
		useInsertionEffect: ds,
		useLayoutEffect: fs,
		useMemo: _s,
		useReducer: Io,
		useRef: is,
		useState: function() {
			return Io(No);
		},
		useDebugValue: hs,
		useDeferredValue: function(e, t) {
			var n = Oo();
			return G === null ? vs(n, e, t) : ys(n, G.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Io(No)[0], t = Oo().memoizedState;
			return [typeof e == "boolean" ? e : Ao(e), t];
		},
		useSyncExternalStore: Lo,
		useId: Es,
		useHostTransitionStatus: Ts,
		useFormState: ns,
		useActionState: ns,
		useOptimistic: function(e, t) {
			var n = Oo();
			return G === null ? (n.baseState = e, [e, n.queue.dispatch]) : Wo(n, G, e, t);
		},
		useMemoCache: Mo,
		useCacheRefresh: Ds
	};
	zs.useEffectEvent = us;
	function Bs(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Vs = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = pu(), i = za(r);
			i.payload = t, n != null && (i.callback = n), t = Ba(e, i, r), t !== null && (hu(t, e, r), Va(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = pu(), i = za(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Ba(e, i, r), t !== null && (hu(t, e, r), Va(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = pu(), r = za(n);
			r.tag = 2, t != null && (r.callback = t), t = Ba(e, r, n), t !== null && (hu(t, e, n), Va(t, e, n));
		}
	};
	function Hs(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !yr(n, r) || !yr(i, a) : !0;
	}
	function Us(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Vs.enqueueReplaceState(t, t.state, null);
	}
	function Ws(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = h({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Gs(e) {
		Kr(e);
	}
	function Ks(e) {
		console.error(e);
	}
	function qs(e) {
		Kr(e);
	}
	function Js(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Ys(e, t, n) {
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
	function Xs(e, t, n) {
		return n = za(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Js(e, t);
		}, n;
	}
	function Zs(e) {
		return e = za(e), e.tag = 3, e;
	}
	function Qs(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Ys(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Ys(t, n, r), typeof i != "function" && (ru === null ? ru = /* @__PURE__ */ new Set([this]) : ru.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function $s(e, t, n, r, a) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && Ji(t, n, a, !0), n = $a.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return eo === null ? Du() : n.alternate === null && Wl === 0 && (Wl = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, r === xa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), Gu(e, r, a)), !1;
					case 22: return n.flags |= 65536, r === xa ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), Gu(e, r, a)), !1;
				}
				throw Error(i(435, n.tag));
			}
			return Gu(e, r, a), Du(), !1;
		}
		if (U) return t = $a.current, t === null ? (r !== Ni && (t = Error(i(423), { cause: r }), Bi(mi(t, n))), e = e.current.alternate, e.flags |= 65536, a &= -a, e.lanes |= a, r = mi(r, n), a = Xs(e.stateNode, r, a), Ha(e, a), Wl !== 4 && (Wl = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = a, r !== Ni && (e = Error(i(422), { cause: r }), Bi(mi(e, n)))), !1;
		var o = Error(i(520), { cause: r });
		if (o = mi(o, n), Xl === null ? Xl = [o] : Xl.push(o), Wl !== 4 && (Wl = 2), t === null) return !0;
		r = mi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = a & -a, n.lanes |= e, e = Xs(n.stateNode, r, e), Ha(n, e), !1;
				case 1: if (t = n.type, o = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (ru === null || !ru.has(o)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = Zs(a), Qs(a, e, n, r), Ha(n, a), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var ec = Error(i(461)), tc = !1;
	function nc(e, t, n, r) {
		t.child = e === null ? Fa(t, null, n, r) : Pa(t, e.child, n, r);
	}
	function rc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return Xi(t), r = bo(e, t, n, o, a, i), s = wo(), e !== null && !tc ? (To(e, t, i), Dc(e, t, i)) : (U && s && Ei(t), t.flags |= 1, nc(e, t, r, i), t.child);
	}
	function ic(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !ai(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, ac(e, t, a, r, i)) : (e = ci(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !Oc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? yr : n, n(o, r) && e.ref === t.ref) return Dc(e, t, i);
		}
		return t.flags |= 1, e = oi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function ac(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (yr(a, r) && e.ref === t.ref) {
				if (tc = !1, t.pendingProps = r = a, Oc(e, i)) e.flags & 131072 && (tc = !0);
				else return t.lanes = e.lanes, Dc(e, t, i);
			}
		}
		return pc(e, t, n, r, i);
	}
	function oc(e, t, n, r) {
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
				return cc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && ga(t, a === null ? null : a.cachePool), a === null ? Za() : Xa(t, a), ro(t);
			else return r = t.lanes = 536870912, cc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && ga(t, null), Za(), io(t)) : (ga(t, a.cachePool), Xa(t, a), io(t), t.memoizedState = null);
		return nc(e, t, i, n), t.child;
	}
	function sc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function cc(e, t, n, r, i) {
		var a = ha();
		return a = a === null ? null : {
			parent: ra._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && ga(t, null), Za(), ro(t), e !== null && Ji(e, t, r, !0), t.childLanes = i, null;
	}
	function lc(e, t) {
		return t = Sc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function uc(e, t, n) {
		return Pa(t, e.child, null, n), e = lc(t, t.pendingProps), e.flags |= 2, ao(t), t.memoizedState = null, e;
	}
	function dc(e, t, n) {
		var r = t.pendingProps, a = !!(t.flags & 128);
		if (t.flags &= -129, e === null) {
			if (U) {
				if (r.mode === "hidden") return e = lc(t, r), t.lanes = 536870912, sc(null, e);
				if (no(t), (e = Ai) ? (e = rf(e, Mi), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: xi === null ? null : {
						id: Si,
						overflow: Ci
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = di(e), n.return = t, t.child = n, ki = t, Ai = null)) : e = null, e === null) throw Pi(t);
				return t.lanes = 536870912, null;
			}
			return lc(t, r);
		}
		var o = e.memoizedState;
		if (o !== null) {
			var s = o.dehydrated;
			if (no(t), a) {
				if (t.flags & 256) t.flags &= -257, t = uc(e, t, n);
				else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
				else throw Error(i(558));
			} else if (tc || Ji(e, t, n, !1), a = (n & e.childLanes) !== 0, tc || a) {
				if (r = q, r !== null && (s = $e(r, n), s !== 0 && s !== o.retryLane)) throw o.retryLane = s, $r(e, s), hu(r, e, s), ec;
				Du(), t = uc(e, t, n);
			} else e = o.treeContext, Ai = cf(s.nextSibling), ki = t, U = !0, ji = null, Mi = !1, e !== null && Oi(t, e), t = lc(t, r), t.flags |= 4096;
			return t;
		}
		return e = oi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function fc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(i(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function pc(e, t, n, r, i) {
		return Xi(t), n = bo(e, t, n, r, void 0, i), r = wo(), e !== null && !tc ? (To(e, t, i), Dc(e, t, i)) : (U && r && Ei(t), t.flags |= 1, nc(e, t, n, i), t.child);
	}
	function mc(e, t, n, r, i, a) {
		return Xi(t), t.updateQueue = null, n = So(t, r, n, i), xo(e), r = wo(), e !== null && !tc ? (To(e, t, a), Dc(e, t, a)) : (U && r && Ei(t), t.flags |= 1, nc(e, t, n, a), t.child);
	}
	function hc(e, t, n, r, i) {
		if (Xi(t), t.stateNode === null) {
			var a = ni, o = n.contextType;
			typeof o == "object" && o && (a = Zi(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Vs, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, La(t), o = n.contextType, a.context = typeof o == "object" && o ? Zi(o) : ni, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Bs(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Vs.enqueueReplaceState(a, a.state, null), Ga(t, r, a, i), Wa(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = Ws(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = ni, typeof u == "object" && u && (o = Zi(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Us(t, a, r, o), Ia = !1;
			var f = t.memoizedState;
			a.state = f, Ga(t, r, a, i), Wa(), l = t.memoizedState, s || f !== l || Ia ? (typeof d == "function" && (Bs(t, n, d, r), l = t.memoizedState), (c = Ia || Hs(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Ra(e, t), o = t.memoizedProps, u = Ws(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = ni, typeof l == "object" && l && (c = Zi(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Us(t, a, r, c), Ia = !1, f = t.memoizedState, a.state = f, Ga(t, r, a, i), Wa();
			var p = t.memoizedState;
			o !== d || f !== p || Ia || e !== null && e.dependencies !== null && Yi(e.dependencies) ? (typeof s == "function" && (Bs(t, n, s, r), p = t.memoizedState), (u = Ia || Hs(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && Yi(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, fc(e, t), r = !!(t.flags & 128), a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Pa(t, e.child, null, i), t.child = Pa(t, null, n, i)) : nc(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Dc(e, t, i), e;
	}
	function gc(e, t, n, r) {
		return Ri(), t.flags |= 256, nc(e, t, n, r), t.child;
	}
	var _c = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function vc(e) {
		return {
			baseLanes: e,
			cachePool: _a()
		};
	}
	function yc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= Jl), e;
	}
	function bc(e, t, n) {
		var r = t.pendingProps, a = !1, o = !!(t.flags & 128), s;
		if ((s = o) || (s = e !== null && e.memoizedState === null ? !1 : !!(oo.current & 2)), s && (a = !0, t.flags &= -129), s = !!(t.flags & 32), t.flags &= -33, e === null) {
			if (U) {
				if (a ? to(t) : io(t), (e = Ai) ? (e = rf(e, Mi), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: xi === null ? null : {
						id: Si,
						overflow: Ci
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = di(e), n.return = t, t.child = n, ki = t, Ai = null)) : e = null, e === null) throw Pi(t);
				return of(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, a ? (io(t), a = t.mode, c = Sc({
				mode: "hidden",
				children: c
			}, a), r = li(r, a, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = vc(n), r.childLanes = yc(e, s, n), t.memoizedState = _c, sc(null, r)) : (to(t), xc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (o) t.flags & 256 ? (to(t), t.flags &= -257, t = Cc(e, t, n)) : t.memoizedState === null ? (io(t), c = r.fallback, a = t.mode, r = Sc({
				mode: "visible",
				children: r.children
			}, a), c = li(c, a, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, Pa(t, e.child, null, n), r = t.child, r.memoizedState = vc(n), r.childLanes = yc(e, s, n), t.memoizedState = _c, t = sc(null, r)) : (io(t), t.child = e.child, t.flags |= 128, t = null);
			else if (to(t), of(c)) {
				if (s = c.nextSibling && c.nextSibling.dataset, s) var u = s.dgst;
				s = u, r = Error(i(419)), r.stack = "", r.digest = s, Bi({
					value: r,
					source: null,
					stack: null
				}), t = Cc(e, t, n);
			} else if (tc || Ji(e, t, n, !1), s = (n & e.childLanes) !== 0, tc || s) {
				if (s = q, s !== null && (r = $e(s, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, $r(e, r), hu(s, e, r), ec;
				af(c) || Du(), t = Cc(e, t, n);
			} else af(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, Ai = cf(c.nextSibling), ki = t, U = !0, ji = null, Mi = !1, e !== null && Oi(t, e), t = xc(t, r.children), t.flags |= 4096);
			return t;
		}
		return a ? (io(t), c = r.fallback, a = t.mode, l = e.child, u = l.sibling, r = oi(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = li(c, a, n, null), c.flags |= 2) : c = oi(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, sc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = vc(n) : (a = c.cachePool, a === null ? a = _a() : (l = ra._currentValue, a = a.parent === l ? a : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: a
		}), r.memoizedState = c, r.childLanes = yc(e, s, n), t.memoizedState = _c, sc(e.child, r)) : (to(t), n = e.child, e = n.sibling, n = oi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (s = t.deletions, s === null ? (t.deletions = [e], t.flags |= 16) : s.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function xc(e, t) {
		return t = Sc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Sc(e, t) {
		return e = ii(22, e, null, t), e.lanes = 0, e;
	}
	function Cc(e, t, n) {
		return Pa(t, e.child, null, n), e = xc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function wc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Ki(e.return, t, n);
	}
	function Tc(e, t, n, r, i, a) {
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
	function Ec(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = oo.current, s = !!(o & 2);
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, I(oo, o), nc(e, t, r, n), r = U ? vi : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && wc(e, n, t);
			else if (e.tag === 19) wc(e, n, t);
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
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && so(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Tc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && so(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Tc(t, !0, n, null, a, r);
				break;
			case "together":
				Tc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function Dc(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), Gl |= t.lanes, (n & t.childLanes) === 0) {
			if (e !== null) {
				if (Ji(e, t, n, !1), (n & t.childLanes) === 0) return null;
			} else return null;
		}
		if (e !== null && t.child !== e.child) throw Error(i(153));
		if (t.child !== null) {
			for (e = t.child, n = oi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = oi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function Oc(e, t) {
		return (e.lanes & t) !== 0 || (e = e.dependencies, !!(e !== null && Yi(e)));
	}
	function kc(e, t, n) {
		switch (t.tag) {
			case 3:
				de(t, t.stateNode.containerInfo), Wi(t, ra, e.memoizedState.cache), Ri();
				break;
			case 27:
			case 5:
				pe(t);
				break;
			case 4:
				de(t, t.stateNode.containerInfo);
				break;
			case 10:
				Wi(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, no(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (to(t), e = Dc(e, t, n), e === null ? null : e.sibling) : bc(e, t, n) : (to(t), t.flags |= 128, null);
				to(t);
				break;
			case 19:
				var i = !!(e.flags & 128);
				if (r = (n & t.childLanes) !== 0, r || (Ji(e, t, n, !1), r = (n & t.childLanes) !== 0), i) {
					if (r) return Ec(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), I(oo, oo.current), r) break;
				return null;
			case 22: return t.lanes = 0, oc(e, t, n, t.pendingProps);
			case 24: Wi(t, ra, e.memoizedState.cache);
		}
		return Dc(e, t, n);
	}
	function Ac(e, t, n) {
		if (e !== null) {
			if (e.memoizedProps !== t.pendingProps) tc = !0;
			else {
				if (!Oc(e, n) && !(t.flags & 128)) return tc = !1, kc(e, t, n);
				tc = !!(e.flags & 131072);
			}
		} else tc = !1, U && t.flags & 1048576 && Ti(t, vi, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = wa(t.elementType), t.type = e, typeof e == "function") ai(e) ? (r = Ws(e, r), t.tag = 1, t = hc(null, t, e, r, n)) : (t.tag = 0, t = pc(null, t, e, r, n));
					else {
						if (e != null) {
							var a = e.$$typeof;
							if (a === w) {
								t.tag = 11, t = rc(null, t, e, r, n);
								break a;
							}
							if (a === D) {
								t.tag = 14, t = ic(null, t, e, r, n);
								break a;
							}
						}
						throw t = ne(e) || e, Error(i(306, t, ""));
					}
				}
				return t;
			case 0: return pc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, a = Ws(r, t.pendingProps), hc(e, t, r, a, n);
			case 3:
				a: {
					if (de(t, t.stateNode.containerInfo), e === null) throw Error(i(387));
					r = t.pendingProps;
					var o = t.memoizedState;
					a = o.element, Ra(e, t), Ga(t, r, null, n);
					var s = t.memoizedState;
					if (r = s.cache, Wi(t, ra, r), r !== o.cache && qi(t, [ra], n, !0), Wa(), r = s.element, o.isDehydrated) {
						if (o = {
							element: r,
							isDehydrated: !1,
							cache: s.cache
						}, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
							t = gc(e, t, r, n);
							break a;
						}
						if (r !== a) {
							a = mi(Error(i(424)), t), Bi(a), t = gc(e, t, r, n);
							break a;
						}
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (Ai = cf(e.firstChild), ki = t, U = !0, ji = null, Mi = !0, n = Fa(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					} else {
						if (Ri(), r === a) {
							t = Dc(e, t, n);
							break a;
						}
						nc(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return fc(e, t), e === null ? (n = kf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : U || (n = t.type, e = t.pendingProps, r = Bd(le.current).createElement(n), r[at] = t, r[ot] = e, Pd(r, n, e), vt(r), t.stateNode = r) : t.memoizedState = kf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return pe(t), e === null && U && (r = t.stateNode = ff(t.type, t.pendingProps, le.current), ki = t, Mi = !0, a = Ai, Zd(t.type) ? (lf = a, Ai = cf(r.firstChild)) : Ai = a), nc(e, t, t.pendingProps.children, n), fc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && U && ((a = r = Ai) && (r = tf(r, t.type, t.pendingProps, Mi), r === null ? a = !1 : (t.stateNode = r, ki = t, Ai = cf(r.firstChild), Mi = !1, a = !0)), a || Pi(t)), pe(t), a = t.type, o = t.pendingProps, s = e === null ? null : e.memoizedProps, r = o.children, Ud(a, o) ? r = null : s !== null && Ud(a, s) && (t.flags |= 32), t.memoizedState !== null && (a = bo(e, t, Co, null, null, n), Qf._currentValue = a), fc(e, t), nc(e, t, r, n), t.child;
			case 6: return e === null && U && ((e = n = Ai) && (n = nf(n, t.pendingProps, Mi), n === null ? e = !1 : (t.stateNode = n, ki = t, Ai = null, e = !0)), e || Pi(t)), null;
			case 13: return bc(e, t, n);
			case 4: return de(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Pa(t, null, r, n) : nc(e, t, r, n), t.child;
			case 11: return rc(e, t, t.type, t.pendingProps, n);
			case 7: return nc(e, t, t.pendingProps, n), t.child;
			case 8: return nc(e, t, t.pendingProps.children, n), t.child;
			case 12: return nc(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, Wi(t, t.type, r.value), nc(e, t, r.children, n), t.child;
			case 9: return a = t.type._context, r = t.pendingProps.children, Xi(t), a = Zi(a), r = r(a), t.flags |= 1, nc(e, t, r, n), t.child;
			case 14: return ic(e, t, t.type, t.pendingProps, n);
			case 15: return ac(e, t, t.type, t.pendingProps, n);
			case 19: return Ec(e, t, n);
			case 31: return dc(e, t, n);
			case 22: return oc(e, t, n, t.pendingProps);
			case 24: return Xi(t), r = Zi(ra), e === null ? (a = ha(), a === null && (a = q, o = ia(), a.pooledCache = o, o.refCount++, o !== null && (a.pooledCacheLanes |= n), a = o), t.memoizedState = {
				parent: r,
				cache: a
			}, La(t), Wi(t, ra, a)) : ((e.lanes & n) !== 0 && (Ra(e, t), Ga(t, null, null, n), Wa()), a = e.memoizedState, o = t.memoizedState, a.parent === r ? (r = o.cache, Wi(t, ra, r), r !== a.cache && qi(t, [ra], n, !0)) : (a = {
				parent: r,
				cache: r
			}, t.memoizedState = a, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = a), Wi(t, ra, r))), nc(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(i(156, t.tag));
	}
	function jc(e) {
		e.flags |= 4;
	}
	function Mc(e, t, n, r, i) {
		if ((t = !!(e.mode & 32)) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) {
				if (e.stateNode.complete) e.flags |= 8192;
				else if (wu()) e.flags |= 8192;
				else throw Ta = xa, ya;
			}
		} else e.flags &= -16777217;
	}
	function Nc(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Wf(t)) {
			if (wu()) e.flags |= 8192;
			else throw Ta = xa, ya;
		}
	}
	function Pc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : qe(), e.lanes |= t, Yl |= t);
	}
	function Fc(e, t) {
		if (!U) switch (e.tailMode) {
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
	function Ic(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function Lc(e, t, n) {
		var r = t.pendingProps;
		switch (Di(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return Ic(t), null;
			case 1: return Ic(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Gi(ra), fe(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Li(t) ? jc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, zi())), Ic(t), null;
			case 26:
				var a = t.type, o = t.memoizedState;
				return e === null ? (jc(t), o === null ? (Ic(t), Mc(t, a, null, r, n)) : (Ic(t), Nc(t, o))) : o ? o === e.memoizedState ? (Ic(t), t.flags &= -16777217) : (jc(t), Ic(t), Nc(t, o)) : (e = e.memoizedProps, e !== r && jc(t), Ic(t), Mc(t, a, e, r, n)), null;
			case 27:
				if (me(t), n = le.current, a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && jc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Ic(t), null;
					}
					e = se.current, Li(t) ? Fi(t, e) : (e = ff(a, r, n), t.stateNode = e, jc(t));
				}
				return Ic(t), null;
			case 5:
				if (me(t), a = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && jc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(i(166));
						return Ic(t), null;
					}
					if (o = se.current, Li(t)) Fi(t, o);
					else {
						var s = Bd(le.current);
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
						r && jc(t);
					}
				}
				return Ic(t), Mc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && jc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(i(166));
					if (e = le.current, Li(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, a = ki, a !== null) switch (a.tag) {
							case 27:
							case 5: r = a.memoizedProps;
						}
						e[at] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Md(e.nodeValue, n)), e || Pi(t, !0);
					} else e = Bd(e).createTextNode(r), e[at] = t, t.stateNode = e;
				}
				return Ic(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Li(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(i(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(i(557));
							e[at] = t;
						} else Ri(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Ic(t), e = !1;
					} else n = zi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (ao(t), t) : (ao(t), null);
					if (t.flags & 128) throw Error(i(558));
				}
				return Ic(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (a = Li(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!a) throw Error(i(318));
							if (a = t.memoizedState, a = a === null ? null : a.dehydrated, !a) throw Error(i(317));
							a[at] = t;
						} else Ri(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						Ic(t), a = !1;
					} else a = zi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = a), a = !0;
					if (!a) return t.flags & 256 ? (ao(t), t) : (ao(t), null);
				}
				return ao(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, a = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (a = r.alternate.memoizedState.cachePool.pool), o = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (o = r.memoizedState.cachePool.pool), o !== a && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Pc(t, t.updateQueue), Ic(t), null);
			case 4: return fe(), e === null && Sd(t.stateNode.containerInfo), Ic(t), null;
			case 10: return Gi(t.type), Ic(t), null;
			case 19:
				if (F(oo), r = t.memoizedState, r === null) return Ic(t), null;
				if (a = !!(t.flags & 128), o = r.rendering, o === null) {
					if (a) Fc(r, !1);
					else {
						if (Wl !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
							if (o = so(e), o !== null) {
								for (t.flags |= 128, Fc(r, !1), e = o.updateQueue, t.updateQueue = e, Pc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) si(n, e), n = n.sibling;
								return I(oo, oo.current & 1 | 2), U && wi(t, r.treeForkCount), t.child;
							}
							e = e.sibling;
						}
						r.tail !== null && De() > tu && (t.flags |= 128, a = !0, Fc(r, !1), t.lanes = 4194304);
					}
				} else {
					if (!a) {
						if (e = so(o), e !== null) {
							if (t.flags |= 128, a = !0, e = e.updateQueue, t.updateQueue = e, Pc(t, e), Fc(r, !0), r.tail === null && r.tailMode === "hidden" && !o.alternate && !U) return Ic(t), null;
						} else 2 * De() - r.renderingStartTime > tu && n !== 536870912 && (t.flags |= 128, a = !0, Fc(r, !1), t.lanes = 4194304);
					}
					r.isBackwards ? (o.sibling = t.child, t.child = o) : (e = r.last, e === null ? t.child = o : e.sibling = o, r.last = o);
				}
				return r.tail === null ? (Ic(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = De(), e.sibling = null, n = oo.current, I(oo, a ? n & 1 | 2 : n & 1), U && wi(t, r.treeForkCount), e);
			case 22:
			case 23: return ao(t), Qa(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (Ic(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ic(t), n = t.updateQueue, n !== null && Pc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && F(ma), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Gi(ra), Ic(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(i(156, t.tag));
	}
	function Rc(e, t) {
		switch (Di(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Gi(ra), fe(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return me(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (ao(t), t.alternate === null) throw Error(i(340));
					Ri();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (ao(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(i(340));
					Ri();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return F(oo), null;
			case 4: return fe(), null;
			case 10: return Gi(t.type), null;
			case 22:
			case 23: return ao(t), Qa(), e !== null && F(ma), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Gi(ra), null;
			case 25: return null;
			default: return null;
		}
	}
	function zc(e, t) {
		switch (Di(t), t.tag) {
			case 3:
				Gi(ra), fe();
				break;
			case 26:
			case 27:
			case 5:
				me(t);
				break;
			case 4:
				fe();
				break;
			case 31:
				t.memoizedState !== null && ao(t);
				break;
			case 13:
				ao(t);
				break;
			case 19:
				F(oo);
				break;
			case 10:
				Gi(t.type);
				break;
			case 22:
			case 23:
				ao(t), Qa(), e !== null && F(ma);
				break;
			case 24: Gi(ra);
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
				qa(t, n);
			} catch (t) {
				Z(e, e.return, t);
			}
		}
	}
	function Uc(e, t, n) {
		n.props = Ws(e.type, e.memoizedProps), n.state = e.memoizedState;
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
			Fd(r, e.type, n, t), r[ot] = t;
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
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Yt));
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
			Pd(t, r, n), t[at] = e, t[ot] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var $c = !1, el = !1, tl = !1, nl = typeof WeakSet == "function" ? WeakSet : Set, rl = null;
	function il(e, t) {
		if (e = e.containerInfo, Rd = sp, e = Cr(e), wr(e)) {
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
		}, sp = !1, rl = t; rl !== null;) if (t = rl, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, rl = e;
		else for (; rl !== null;) {
			switch (t = rl, o = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) a = e[n], a.ref.impl = a.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && o !== null) {
						e = void 0, n = t, a = o.memoizedProps, o = o.memoizedState, r = n.stateNode;
						try {
							var h = Ws(n.type, a);
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
				default: if (e & 1024) throw Error(i(163));
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
						var i = Ws(n.type, t.memoizedProps);
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
						qa(e, t);
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
		t !== null && (e.alternate = null, ol(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && pt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var sl = null, cl = !1;
	function ll(e, t, n) {
		for (n = n.child; n !== null;) ul(e, t, n), n = n.sibling;
	}
	function ul(e, t, n) {
		if (Ie && typeof Ie.onCommitFiberUnmount == "function") try {
			Ie.onCommitFiberUnmount(Fe, n);
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
			default: throw Error(i(435, e.tag));
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
			var a = n[r], o = e, s = t, c = s;
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
			if (sl === null) throw Error(i(160));
			ul(o, s, a), sl = null, cl = !1, o = a.alternate, o !== null && (o.return = null), a.return = null;
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
				var a = gl;
				if (hl(t, e), vl(e), r & 512 && (el || n === null || Gc(n, n.return)), r & 4) {
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
					} else o === r ? r === null && e.stateNode !== null && qc(e, e.memoizedProps, n.memoizedProps) : (o === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : o.count--, r === null ? Hf(a, e.type, e.stateNode) : If(a, r, e.memoizedProps));
				}
				break;
			case 27:
				hl(t, e), vl(e), r & 512 && (el || n === null || Gc(n, n.return)), n !== null && r & 4 && qc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (hl(t, e), vl(e), r & 512 && (el || n === null || Gc(n, n.return)), e.flags & 32) {
					a = e.stateNode;
					try {
						Vt(a, "");
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (a = e.memoizedProps, qc(e, a, n === null ? a : n.memoizedProps)), r & 1024 && (tl = !0);
				break;
			case 6:
				if (hl(t, e), vl(e), r & 4) {
					if (e.stateNode === null) throw Error(i(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Bf = null, a = gl, gl = gf(t.containerInfo), hl(t, e), gl = a, vl(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
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
				hl(t, e), vl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && ($l = De()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, ml(e, r)));
				break;
			case 22:
				a = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = $c, d = el;
				if ($c = u || a, el = d || l, hl(t, e), el = d, $c = u, vl(e), r & 8192) a: for (t = e.stateNode, t._visibility = a ? t._visibility & -2 : t._visibility | 1, a && (n === null || l || $c || el || xl(e)), n = null, t = e;;) {
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
								Z(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = a ? "" : l.memoizedProps;
							} catch (e) {
								Z(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								a ? $d(m, !0) : $d(l.stateNode, !1);
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
				if (n == null) throw Error(i(160));
				switch (n.tag) {
					case 27:
						var a = n.stateNode;
						Zc(e, Yc(e), a);
						break;
					case 5:
						var o = n.stateNode;
						n.flags & 32 && (Vt(o, ""), n.flags &= -33), Zc(e, Yc(e), o);
						break;
					case 3:
					case 4:
						var s = n.stateNode.containerInfo;
						Xc(e, Yc(e), s);
						break;
					default: throw Error(i(161));
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
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) Ka(c[i], s);
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
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && aa(n));
	}
	function wl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && aa(e));
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
				Tl(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && aa(e)));
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
				case 24: aa(n.memoizedState.cache);
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
			var t = Zi(ra), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return Zi(ra).controller.signal;
		}
	}, Rl = typeof WeakMap == "function" ? WeakMap : Map, K = 0, q = null, J = null, Y = 0, X = 0, zl = null, Bl = !1, Vl = !1, Hl = !1, Ul = 0, Wl = 0, Gl = 0, Kl = 0, ql = 0, Jl = 0, Yl = 0, Xl = null, Zl = null, Ql = !1, $l = 0, eu = 0, tu = Infinity, nu = null, ru = null, iu = 0, au = null, ou = null, su = 0, cu = 0, lu = null, uu = null, du = 0, fu = null;
	function pu() {
		return K & 2 && Y !== 0 ? Y & -Y : N.T === null ? nt() : dd();
	}
	function mu() {
		if (Jl === 0) {
			if (!(Y & 536870912) || U) {
				var e = He;
				He <<= 1, !(He & 3932160) && (He = 262144), Jl = e;
			} else Jl = 536870912;
		}
		return e = $a.current, e !== null && (e.flags |= 32), Jl;
	}
	function hu(e, t, n) {
		(e === q && (X === 2 || X === 9) || e.cancelPendingCommit !== null) && (Su(e, 0), yu(e, Y, Jl, !1)), Ye(e, n), (!(K & 2) || e !== q) && (e === q && (!(K & 2) && (Kl |= n), Wl === 4 && yu(e, Y, Jl, !1)), rd(e));
	}
	function gu(e, t, n) {
		if (K & 6) throw Error(i(327));
		var r = !n && !(t & 127) && (t & e.expiredLanes) === 0 || Ge(e, t), a = r ? Au(e, t) : Ou(e, t, !0), o = r;
		do {
			if (a === 0) {
				Vl && !r && yu(e, t, 0, !1);
				break;
			}
			if (n = e.current.alternate, o && !vu(n)) {
				a = Ou(e, t, !1), o = !1;
				continue;
			}
			if (a === 2) {
				if (o = t, e.errorRecoveryDisabledLanes & o) var s = 0;
				else s = e.pendingLanes & -536870913, s = s === 0 ? s & 536870912 ? 536870912 : 0 : s;
				if (s !== 0) {
					t = s;
					a: {
						var c = e;
						a = Xl;
						var l = c.current.memoizedState.isDehydrated;
						if (l && (Su(c, s).flags |= 256), s = Ou(c, s, !1), s !== 2) {
							if (Hl && !l) {
								c.errorRecoveryDisabledLanes |= o, Kl |= o, a = 4;
								break a;
							}
							o = Zl, Zl = a, o !== null && (Zl === null ? Zl = o : Zl.push.apply(Zl, o));
						}
						a = s;
					}
					if (o = !1, a !== 2) continue;
				}
			}
			if (a === 1) {
				Su(e, 0), yu(e, t, 0, !0);
				break;
			}
			a: {
				switch (r = e, o = a, o) {
					case 0:
					case 1: throw Error(i(345));
					case 4: if ((t & 4194048) !== t) break;
					case 6:
						yu(r, t, Jl, !Bl);
						break a;
					case 2:
						Zl = null;
						break;
					case 3:
					case 5: break;
					default: throw Error(i(329));
				}
				if ((t & 62914560) === t && (a = $l + 300 - De(), 10 < a)) {
					if (yu(r, t, Jl, !Bl), We(r, 0, !0) !== 0) break a;
					su = t, r.timeoutHandle = Kd(_u.bind(null, r, n, Zl, nu, Ql, t, Jl, Kl, Yl, Bl, o, "Throttled", -0, 0), a);
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
				unsuspend: Yt
			}, jl(t, a, d);
			var m = (a & 62914560) === a ? $l - De() : (a & 4194048) === a ? eu - De() : 0;
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
					if (!vr(a(), i)) return !1;
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
			var a = 31 - Re(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && Ze(e, n, t);
	}
	function bu() {
		return K & 6 ? !0 : (id(0, !1), !1);
	}
	function xu() {
		if (J !== null) {
			if (X === 0) var e = J.return;
			else e = J, Ui = Hi = null, Eo(e), Oa = null, ka = 0, e = J;
			for (; e !== null;) zc(e.alternate, e), e = e.return;
			J = null;
		}
	}
	function Su(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, qd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), su = 0, xu(), q = e, J = n = oi(e.current, null), Y = t, X = 0, zl = null, Bl = !1, Vl = Ge(e, t), Hl = !1, Yl = Jl = ql = Kl = Gl = Wl = 0, Zl = Xl = null, Ql = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - Re(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Ul = t, Xr(), n;
	}
	function Cu(e, t) {
		W = null, N.H = Is, t === va || t === ba ? (t = Ea(), X = 3) : t === ya ? (t = Ea(), X = 4) : X = t === ec ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, zl = t, J === null && (Wl = 1, Js(e, mi(t, e.current)));
	}
	function wu() {
		var e = $a.current;
		return e === null ? !0 : (Y & 4194048) === Y ? eo === null : (Y & 62914560) === Y || Y & 536870912 ? e === eo : !1;
	}
	function Tu() {
		var e = N.H;
		return N.H = Is, e === null ? Is : e;
	}
	function Eu() {
		var e = N.A;
		return N.A = Ll, e;
	}
	function Du() {
		Wl = 4, Bl || (Y & 4194048) !== Y && $a.current !== null || (Vl = !0), !(Gl & 134217727) && !(Kl & 134217727) || q === null || yu(q, Y, Jl, !1);
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
							$a.current === null && (t = !0);
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
		return t && e.shellSuspendCounter++, Ui = Hi = null, K = r, N.H = i, N.A = a, J === null && (q = null, Y = 0, Xr()), o;
	}
	function ku() {
		for (; J !== null;) Mu(J);
	}
	function Au(e, t) {
		var n = K;
		K |= 2;
		var r = Tu(), a = Eu();
		q !== e || Y !== t ? (nu = null, tu = De() + 500, Su(e, t)) : Vl = Ge(e, t);
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
							if (Sa(o)) {
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
							Sa(o) ? (X = 0, zl = null, Nu(t)) : (X = 0, zl = null, Pu(e, t, o, 7));
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
						default: throw Error(i(462));
					}
				}
				ju();
				break;
			} catch (t) {
				Cu(e, t);
			}
		while (1);
		return Ui = Hi = null, N.H = r, N.A = a, K = n, J === null ? (q = null, Y = 0, Xr(), Wl) : 0;
	}
	function ju() {
		for (; J !== null && !Te();) Mu(J);
	}
	function Mu(e) {
		var t = Ac(e.alternate, e, Ul);
		e.memoizedProps = e.pendingProps, t === null ? Fu(e) : J = t;
	}
	function Nu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = mc(n, t, t.pendingProps, t.type, void 0, Y);
				break;
			case 11:
				t = mc(n, t, t.pendingProps, t.type.render, t.ref, Y);
				break;
			case 5: Eo(t);
			default: zc(n, t), t = J = si(t, Ul), t = Ac(n, t, Ul);
		}
		e.memoizedProps = e.pendingProps, t === null ? Fu(e) : J = t;
	}
	function Pu(e, t, n, r) {
		Ui = Hi = null, Eo(t), Oa = null, ka = 0;
		var i = t.return;
		try {
			if ($s(e, i, t, n, Y)) {
				Wl = 1, Js(e, mi(n, e.current)), J = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw J = i, t;
			Wl = 1, Js(e, mi(n, e.current)), J = null;
			return;
		}
		t.flags & 32768 ? (U || r === 1 ? e = !0 : Vl || Y & 536870912 ? e = !1 : (Bl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = $a.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Iu(t, e)) : Fu(t);
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
	function Lu(e, t, n, r, a, o, s, c, l) {
		e.cancelPendingCommit = null;
		do
			Hu();
		while (iu !== 0);
		if (K & 6) throw Error(i(327));
		if (t !== null) {
			if (t === e.current) throw Error(i(177));
			if (o = t.lanes | t.childLanes, o |= Yr, Xe(e, n, o, s, c, l), e === q && (J = q = null, Y = 0), ou = t, au = e, su = n, cu = o, lu = a, uu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Xu(je, function() {
				return Uu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = !!(t.flags & 13878), t.subtreeFlags & 13878 || r) {
				r = N.T, N.T = null, a = P.p, P.p = 2, s = K, K |= 4;
				try {
					il(e, t, n);
				} finally {
					K = s, P.p = a, N.T = r;
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
				n = N.T, N.T = null;
				var r = P.p;
				P.p = 2;
				var i = K;
				K |= 4;
				try {
					_l(t, e);
					var a = zd, o = Cr(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && Sr(s.ownerDocument.documentElement, s)) {
						if (c !== null && wr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = xr(s, h), v = xr(s, g);
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
					K = i, P.p = r, N.T = n;
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
				n = N.T, N.T = null;
				var r = P.p;
				P.p = 2;
				var i = K;
				K |= 4;
				try {
					al(e, t.alternate, t);
				} finally {
					K = i, P.p = r, N.T = n;
				}
			}
			iu = 3;
		}
	}
	function Bu() {
		if (iu === 4 || iu === 3) {
			iu = 0, Ee();
			var e = au, t = ou, n = su, r = uu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? iu = 5 : (iu = 0, ou = au = null, Vu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (ru = null), tt(n), t = t.stateNode, Ie && typeof Ie.onCommitFiberRoot == "function") try {
				Ie.onCommitFiberRoot(Fe, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = N.T, i = P.p, P.p = 2, N.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					N.T = t, P.p = i;
				}
			}
			su & 3 && Hu(), rd(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === fu ? du++ : (du = 0, fu = e) : du = 0, id(0, !1);
		}
	}
	function Vu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, aa(t)));
	}
	function Hu() {
		return Ru(), zu(), Bu(), Uu();
	}
	function Uu() {
		if (iu !== 5) return !1;
		var e = au, t = cu;
		cu = 0;
		var n = tt(su), r = N.T, a = P.p;
		try {
			P.p = 32 > n ? 32 : n, N.T = null, n = lu, lu = null;
			var o = au, s = su;
			if (iu = 0, ou = au = null, su = 0, K & 6) throw Error(i(331));
			var c = K;
			if (K |= 4, Pl(o.current), El(o, o.current, s, n), K = c, id(0, !1), Ie && typeof Ie.onPostCommitFiberRoot == "function") try {
				Ie.onPostCommitFiberRoot(Fe, o);
			} catch {}
			return !0;
		} finally {
			P.p = a, N.T = r, Vu(e, t);
		}
	}
	function Wu(e, t, n) {
		t = mi(n, t), t = Xs(e.stateNode, t, 2), e = Ba(e, t, 2), e !== null && (Ye(e, 2), rd(e));
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
					e = mi(n, e), n = Zs(2), r = Ba(t, n, 2), r !== null && (Qs(n, r, t, e), Ye(r, 2), rd(r));
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
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, q === e && (Y & n) === n && (Wl === 4 || Wl === 3 && (Y & 62914560) === Y && 300 > De() - $l ? !(K & 2) && Su(e, 0) : ql |= n, Yl === Y && (Yl = 0)), rd(e);
	}
	function qu(e, t) {
		t === 0 && (t = qe()), e = $r(e, t), e !== null && (Ye(e, t), rd(e));
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
		r !== null && r.delete(t), qu(e, n);
	}
	function Xu(e, t) {
		return Ce(e, t);
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
								a = (1 << 31 - Re(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
							}
							a !== 0 && (n = !0, ld(r, a));
						} else a = Y, a = We(r, r === q ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Ge(r, a) || (n = !0, ld(r, a));
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
		for (var t = De(), n = null, r = Zu; r !== null;) {
			var i = r.next, a = sd(r, t);
			a === 0 ? (r.next = null, n === null ? Zu = i : n.next = i, i === null && (Qu = n)) : (n = r, (e !== 0 || a & 3) && (ed = !0)), r = i;
		}
		iu !== 0 && iu !== 5 || id(e, !1), nd !== 0 && (nd = 0);
	}
	function sd(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - Re(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = Ke(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = q, n = Y, n = We(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (X === 2 || X === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && we(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Ge(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && we(r), tt(n)) {
				case 2:
				case 8:
					n = Ae;
					break;
				case 32:
					n = je;
					break;
				case 268435456:
					n = Me;
					break;
				default: n = je;
			}
			return r = cd.bind(null, e), n = Ce(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && we(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function cd(e, t) {
		if (iu !== 0 && iu !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Hu() && e.callbackNode !== n) return null;
		var r = Y;
		return r = We(e, e === q ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (gu(e, r, t), sd(e, De()), e.callbackNode != null && e.callbackNode === n ? cd.bind(null, e) : null);
	}
	function ld(e, t) {
		if (Hu()) return null;
		gu(e, t, !0);
	}
	function ud() {
		Yd(function() {
			K & 6 ? Ce(ke, ad) : od();
		});
	}
	function dd() {
		if (nd === 0) {
			var e = ca;
			e === 0 && (e = Ve, Ve <<= 1, !(Ve & 261888) && (Ve = 256)), nd = e;
		}
		return nd;
	}
	function fd(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Jt("" + e);
	}
	function pd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function md(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = fd((i[ot] || null).action), o = r.submitter;
			o && (t = (t = o[ot] || null) ? fd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new _n("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (nd !== 0) {
								var e = o ? pd(i, o) : new FormData(i);
								Ss(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? pd(i, o) : new FormData(i), Ss(n, {
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
	for (var hd = 0; hd < Wr.length; hd++) {
		var gd = Wr[hd];
		Gr(gd.toLowerCase(), "on" + (gd[0].toUpperCase() + gd.slice(1)));
	}
	Gr(Ir, "onAnimationEnd"), Gr(Lr, "onAnimationIteration"), Gr(Rr, "onAnimationStart"), Gr("dblclick", "onDoubleClick"), Gr("focusin", "onFocus"), Gr("focusout", "onBlur"), Gr(zr, "onTransitionRun"), Gr(Br, "onTransitionStart"), Gr(Vr, "onTransitionCancel"), Gr(Hr, "onTransitionEnd"), St("onMouseEnter", ["mouseout", "mouseover"]), St("onMouseLeave", ["mouseout", "mouseover"]), St("onPointerEnter", ["pointerout", "pointerover"]), St("onPointerLeave", ["pointerout", "pointerover"]), xt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), xt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), xt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), xt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), xt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), xt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
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
						Kr(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						Kr(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[ct];
		n === void 0 && (n = t[ct] = /* @__PURE__ */ new Set());
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
			e[xd] = !0, yt.forEach(function(t) {
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
		n = i.bind(null, t, n, e), i = void 0, !on || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function wd(e, t, n, r, i) {
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
		nn(function() {
			var r = a, i = Zt(n), s = [];
			a: {
				var c = Ur.get(e);
				if (c !== void 0) {
					var l = _n, u = e;
					switch (e) {
						case "keypress": if (fn(n) === 0) break a;
						case "keydown":
						case "keyup":
							l = Fn;
							break;
						case "focusin":
							u = "focus", l = En;
							break;
						case "focusout":
							u = "blur", l = En;
							break;
						case "beforeblur":
						case "afterblur":
							l = En;
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
							l = Tn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							l = Ln;
							break;
						case Ir:
						case Lr:
						case Rr:
							l = Dn;
							break;
						case Hr:
							l = Rn;
							break;
						case "scroll":
						case "scrollend":
							l = yn;
							break;
						case "wheel":
							l = zn;
							break;
						case "copy":
						case "cut":
						case "paste":
							l = On;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							l = In;
							break;
						case "toggle":
						case "beforetoggle": l = Bn;
					}
					var d = !!(t & 4), f = !d && (e === "scroll" || e === "scrollend"), p = d ? c === null ? null : c + "Capture" : c;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = rn(m, p), g != null && d.push(Td(m, g, h))), f) break;
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
					if (c = e === "mouseover" || e === "pointerover", l = e === "mouseout" || e === "pointerout", c && n !== Xt && (u = n.relatedTarget || n.fromElement) && (mt(u) || u[st])) break a;
					if ((l || c) && (c = i.window === i ? i : (c = i.ownerDocument) ? c.defaultView || c.parentWindow : window, l ? (u = n.relatedTarget || n.toElement, l = r, u = u ? mt(u) : null, u !== null && (f = o(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (l = null, u = r), l !== u)) {
						if (d = wn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = In, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = l == null ? c : gt(l), h = u == null ? c : gt(u), c = new d(g, m + "leave", l, n, i), c.target = f, c.relatedTarget = h, g = null, mt(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, l && u) b: {
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
						l !== null && Od(s, c, l, d, !1), u !== null && f !== null && Od(s, f, u, d, !0);
					}
				}
				a: {
					if (c = r ? gt(r) : window, l = c.nodeName && c.nodeName.toLowerCase(), l === "select" || l === "input" && c.type === "file") var v = or;
					else if (er(c)) {
						if (sr) v = gr;
						else {
							v = mr;
							var y = pr;
						}
					} else l = c.nodeName, !l || l.toLowerCase() !== "input" || c.type !== "checkbox" && c.type !== "radio" ? r && Gt(r.elementType) && (v = or) : v = hr;
					if (v && (v = v(e, r))) {
						tr(s, v, n, i);
						break a;
					}
					y && y(e, c, r), e === "focusout" && r && c.type === "number" && r.memoizedProps.value != null && Lt(c, "number", c.value);
				}
				switch (y = r ? gt(r) : window, e) {
					case "focusin":
						(er(y) || y.contentEditable === "true") && (Er = y, Dr = r, Or = null);
						break;
					case "focusout":
						Or = Dr = Er = null;
						break;
					case "mousedown":
						kr = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						kr = !1, Ar(s, n, i);
						break;
					case "selectionchange": if (Tr) break;
					case "keydown":
					case "keyup": Ar(s, n, i);
				}
				var b;
				if (Hn) b: {
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
				else Xn ? Jn(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (Gn && n.locale !== "ko" && (Xn || x !== "onCompositionStart" ? x === "onCompositionEnd" && Xn && (b = dn()) : (cn = i, ln = "value" in cn ? cn.value : cn.textContent, Xn = !0)), y = Ed(r, x), 0 < y.length && (x = new kn(x, e, null, n, i), s.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = Yn(n), b !== null && (x.data = b)))), (b = Wn ? Zn(e, n) : Qn(e, n)) && (x = Ed(r, "onBeforeInput"), 0 < x.length && (y = new kn("onBeforeInput", "beforeinput", null, n, i), s.push({
					event: y,
					listeners: x
				}), y.data = b)), md(s, e, r, n, i);
			}
			yd(s, t);
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
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = rn(e, n), i != null && r.unshift(Td(e, i, a)), i = rn(e, t), i != null && r.push(Td(e, i, a))), e.tag === 3) return r;
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
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = rn(n, a), l != null && o.unshift(Td(n, l, c))) : i || (l = rn(n, a), l != null && o.push(Td(n, l, c)))), n = n.return;
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
	function $(e, t, n, r, a, o) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || Vt(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && Vt(e, "" + r);
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
				Wt(e, r, o);
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
				r = Jt("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				}
				if (typeof o == "function" && (n === "formAction" ? (t !== "input" && $(e, t, "name", a.name, a, null), $(e, t, "formEncType", a.formEncType, a, null), $(e, t, "formMethod", a.formMethod, a, null), $(e, t, "formTarget", a.formTarget, a, null)) : ($(e, t, "encType", a.encType, a, null), $(e, t, "method", a.method, a, null), $(e, t, "target", a.target, a, null))), r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = Jt("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = Yt);
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				break;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
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
				n = Jt("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
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
				Q("beforetoggle", e), Q("toggle", e), Dt(e, "popover", r);
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
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Kt.get(n) || n, Dt(e, n, r));
		}
	}
	function Nd(e, t, n, r, a, o) {
		switch (n) {
			case "style":
				Wt(e, r, o);
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
				typeof r == "string" ? Vt(e, r) : (typeof r == "number" || typeof r == "bigint") && Vt(e, "" + r);
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				break;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = Yt);
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
				Q("error", e), Q("load", e);
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
						default: $(e, t, o, s, n, null);
					}
				}
				a && $(e, t, "srcSet", n.srcSet, n, null), r && $(e, t, "src", n.src, n, null);
				return;
			case "input":
				Q("invalid", e);
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
						default: $(e, t, r, d, n, null);
					}
				}
				H(e, o, c, l, u, s, a, !1);
				return;
			case "select":
				for (a in Q("invalid", e), r = s = o = null, n) if (n.hasOwnProperty(a) && (c = n[a], c != null)) switch (a) {
					case "value":
						o = c;
						break;
					case "defaultValue":
						s = c;
						break;
					case "multiple": r = c;
					default: $(e, t, a, c, n, null);
				}
				t = o, n = s, e.multiple = !!r, t == null ? n != null && Rt(e, !!r, n, !0) : Rt(e, !!r, t, !1);
				return;
			case "textarea":
				for (s in Q("invalid", e), o = a = r = null, n) if (n.hasOwnProperty(s) && (c = n[s], c != null)) switch (s) {
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
					default: $(e, t, s, c, n, null);
				}
				Bt(e, r, a, o);
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
					case "dangerouslySetInnerHTML": throw Error(i(137, t));
					default: $(e, t, u, r, n, null);
				}
				return;
			default: if (Gt(t)) {
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
				var a = null, o = null, s = null, c = null, l = null, u = null, d = null;
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
						default: m !== f && $(e, t, p, m, r, f);
					}
				}
				V(e, s, c, l, u, d, o, a);
				return;
			case "select":
				for (o in m = s = c = p = null, n) if (l = n[o], n.hasOwnProperty(o) && l != null) switch (o) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(o) || $(e, t, o, null, r, l);
				}
				for (a in r) if (o = r[a], l = n[a], r.hasOwnProperty(a) && (o != null || l != null)) switch (a) {
					case "value":
						p = o;
						break;
					case "defaultValue":
						c = o;
						break;
					case "multiple": s = o;
					default: o !== l && $(e, t, a, o, r, l);
				}
				t = c, n = s, r = m, p == null ? !!r != !!n && (t == null ? Rt(e, !!n, n ? [] : "", !1) : Rt(e, !!n, t, !0)) : Rt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (a = n[c], n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: $(e, t, c, null, r, a);
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
					default: a !== o && $(e, t, s, a, r, o);
				}
				zt(e, p, m);
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
						if (p != null) throw Error(i(137, t));
						break;
					default: $(e, t, u, p, r, m);
				}
				return;
			default: if (Gt(t)) {
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
	var _f = P.d;
	P.d = {
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
		var t = ht(e);
		t !== null && t.tag === 5 && t.type === "form" ? ws(t) : _f.r(e);
	}
	var bf = typeof document > "u" ? null : document;
	function xf(e, t, n) {
		var r = bf;
		if (r && typeof t == "string" && t) {
			var i = It(t);
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
			var i = "link[rel=\"preload\"][as=\"" + It(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + It(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + It(n.imageSizes) + "\"]")) : i += "[href=\"" + It(e) + "\"]";
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
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + It(r) + "\"][href=\"" + It(e) + "\"]", a = i;
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
		var a = (a = le.current) ? gf(a) : null;
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
		return "href=\"" + It(e) + "\"";
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
		return "[src=\"" + It(e) + "\"]";
	}
	function Ff(e) {
		return "script[async]" + e;
	}
	function If(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + It(n.href) + "\"]");
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
		_currentValue: re,
		_currentValue2: re,
		_threadCount: 0
	};
	function $f(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Je(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Je(0), this.hiddenUpdates = Je(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new $f(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = ii(3, null, null, t), e.current = a, a.stateNode = e, t = ia(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, La(a), e;
	}
	function tp(e) {
		return e ? (e = ni, e) : ni;
	}
	function np(e, t, n, r, i, a) {
		i = tp(i), r.context === null ? r.context = i : r.pendingContext = i, r = za(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Ba(e, r, t), n !== null && (hu(n, e, t), Va(n, e, t));
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
			var t = $r(e, 67108864);
			t !== null && hu(t, e, 67108864), ip(e, 67108864);
		}
	}
	function op(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = pu();
			t = et(t);
			var n = $r(e, t);
			n !== null && hu(n, e, t), ip(e, t);
		}
	}
	var sp = !0;
	function cp(e, t, n, r) {
		var i = N.T;
		N.T = null;
		var a = P.p;
		try {
			P.p = 2, up(e, t, n, r);
		} finally {
			P.p = a, N.T = i;
		}
	}
	function lp(e, t, n, r) {
		var i = N.T;
		N.T = null;
		var a = P.p;
		try {
			P.p = 8, up(e, t, n, r);
		} finally {
			P.p = a, N.T = i;
		}
	}
	function up(e, t, n, r) {
		if (sp) {
			var i = dp(r);
			if (i === null) wd(e, t, r, fp, n), Cp(e, r);
			else if (Tp(i, e, t, n, r)) r.stopPropagation();
			else if (Cp(e, r), t & 4 && -1 < Sp.indexOf(e)) {
				for (; i !== null;) {
					var a = ht(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = Ue(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - Re(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									rd(a), !(K & 6) && (tu = De() + 500, id(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = $r(a, 2), s !== null && hu(s, a, 2), bu(), ip(a, 2);
					}
					if (a = dp(r), a === null && wd(e, t, r, fp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else wd(e, t, r, null, n);
		}
	}
	function dp(e) {
		return e = Zt(e), pp(e);
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
			case "message": switch (Oe()) {
				case ke: return 2;
				case Ae: return 8;
				case je:
				case L: return 32;
				case Me: return 268435456;
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
				Xt = r, n.target.dispatchEvent(r), Xt = null;
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
				a !== null && (e.splice(t, 3), t -= 3, Ss(a, {
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
		np(n, pu(), e, t, null, null);
	}, Ip.prototype.unmount = Fp.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			np(e.current, 2, null, e, null, null), bu(), t[st] = null;
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
	P.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(i(188)) : (e = Object.keys(e).join(","), Error(i(268, e)));
		return e = d(t), e = e === null ? null : p(e), e = e === null ? null : e.stateNode, e;
	};
	var Rp = {
		bundleType: 0,
		version: "19.2.8",
		rendererPackageName: "react-dom",
		currentDispatcherRef: N,
		reconcilerVersion: "19.2.8"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!zp.isDisabled && zp.supportsFiber) try {
			Fe = zp.inject(Rp), Ie = zp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!a(e)) throw Error(i(299));
		var n = !1, r = "", o = Gs, s = Ks, c = qs;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (o = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = ep(e, 1, !1, null, null, n, r, null, o, s, c, Pp), e[st] = t.current, Sd(e), new Fp(t);
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
var C = class extends Error {
	constructor(e, t, n) {
		super(e), S(this, "code", void 0), S(this, "status", void 0), this.code = t, this.status = n, this.name = "ApiError";
	}
}, w = class {
	constructor(e) {
		S(this, "config", void 0), S(this, "base", void 0), S(this, "uploadStorageKey", "sofinder.uploadSessions.v1"), this.config = e, this.base = e.apiBase.replace(/\/config$/, "");
	}
	configData() {
		return this.request("/config");
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
					t(new C(`Request failed (${n.status})`, "invalid_response", n.status));
					return;
				}
				if (n.status < 200 || n.status >= 300 || !i.success || !i.data) {
					t(new C(i.error?.message || `Request failed (${n.status})`, i.error?.code || "upload_failed", n.status));
					return;
				}
				r.onProgress?.(100), e(i.data);
			}), n.addEventListener("error", () => {
				o(), t(new C("The upload failed because of a network error.", "network_error", 0));
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
				if (!(i instanceof C) || i.status !== 404) throw i;
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
				if (!d.ok || !f.success || !f.data) throw new C(f.error?.message || `Request failed (${d.status})`, f.error?.code || "upload_failed", d.status);
				if (r.onProgress?.(Math.round((o + 1) / a * 100)), this.savePendingUpload({
					...c,
					updatedAt: Date.now()
				}), f.data.complete && f.data.entry) return this.removePendingUpload(s), { entry: f.data.entry };
			}
			throw new C("The chunk upload did not complete.", "chunk_incomplete", 500);
		} catch (e) {
			throw e instanceof C && e.status >= 400 && e.status < 500 && this.removePendingUpload(s), e;
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
			throw new C(e.error?.message || `Request failed (${n.status})`, e.error?.code || "archive_failed", n.status);
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
		if (!r.ok || !i.success || !i.data) throw new C(i.error?.message || `Request failed (${r.status})`, i.error?.code || "request_failed", r.status);
		return i.data;
	}
}, T = {
	en: {
		files: "Files",
		images: "Images",
		newFolder: "New folder",
		upload: "Upload",
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
		grid: "Grid view",
		list: "List view",
		home: "Home",
		sort: "Sort",
		direction: "Sort direction",
		pagination: "Pagination",
		page: "Page",
		previous: "Previous",
		next: "Next",
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
		imageTools: "Image tools",
		rotationTools: "Rotation controls",
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
		toolSettingsHint: "Choose which image tools appear in the toolbar. Rotation and presets are hidden by default.",
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
		folderNameTooLong: "The folder name exceeds the character limit:",
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
		panHint: "Drag outside the selection to draw a new crop; drag its corners or edges to resize it; arrow keys nudge one pixel.",
		open: "Open",
		preview: "Preview",
		previewUnavailable: "A visual preview is not available for this file type."
	},
	"zh-cn": {
		files: "文件",
		images: "图片",
		newFolder: "新建文件夹",
		upload: "上传",
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
		grid: "网格视图",
		list: "列表视图",
		home: "首页",
		sort: "排序",
		direction: "排序方向",
		pagination: "分页",
		page: "第",
		previous: "上一页",
		next: "下一页",
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
		imageTools: "图片工具",
		rotationTools: "旋转工具",
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
		toolSettingsHint: "选择工具栏中显示的图片功能。旋转和预设尺寸默认隐藏。",
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
		folderNameTooLong: "文件夹名超过字数限制：",
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
		panHint: "在选区外拖动可重新框选；拖动四角或边线可调整大小，方向键每次微调一个像素。",
		open: "打开",
		preview: "预览",
		previewUnavailable: "此文件类型暂不支持可视化预览。"
	}
}, E = {
	files: "檔案",
	images: "圖片",
	newFolder: "新增資料夾",
	upload: "上傳",
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
	grid: "網格檢視",
	list: "清單檢視",
	home: "首頁",
	sort: "排序",
	direction: "排序方向",
	pagination: "分頁",
	page: "第",
	previous: "上一頁",
	next: "下一頁",
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
	imageTools: "圖片工具",
	rotationTools: "旋轉工具",
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
	toolSettingsHint: "選擇工具列中顯示的圖片功能。旋轉和預設尺寸預設為隱藏。",
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
	folderNameTooLong: "資料夾名稱超過字數限制：",
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
	panHint: "在選取範圍外拖曳可重新框選；拖曳四角或邊線可調整大小，方向鍵每次微調一個像素。",
	open: "開啟",
	preview: "預覽",
	previewUnavailable: "此檔案類型暫不支援視覺預覽。"
}, D = {
	...T,
	"zh-tw": E
}, O = (e) => (t) => D[e][t], ee = /* @__PURE__ */ o(((e) => {
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
})), k = (/* @__PURE__ */ o(((e, t) => {
	t.exports = ee();
})))(), te = {
	"add-folder": /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("path", { d: "M3 6.5h6l2 2h10v10.5H3z" }), /* @__PURE__ */ (0, k.jsx)("path", { d: "M12 11v6M9 14h6" })] }),
	upload: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("path", { d: "M12 16V4M7.5 8.5 12 4l4.5 4.5" }), /* @__PURE__ */ (0, k.jsx)("path", { d: "M4 15v5h16v-5" })] }),
	select: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("rect", {
		x: "4",
		y: "4",
		width: "16",
		height: "16",
		rx: "3"
	}), /* @__PURE__ */ (0, k.jsx)("path", { d: "m8 12 3 3 5-6" })] }),
	rename: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("path", { d: "m4 20 4.5-1 9.8-9.8-3.5-3.5L5 15.5z" }), /* @__PURE__ */ (0, k.jsx)("path", { d: "m13.8 6.8 3.5 3.5" })] }),
	copy: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("rect", {
		x: "8",
		y: "8",
		width: "12",
		height: "12",
		rx: "2"
	}), /* @__PURE__ */ (0, k.jsx)("path", { d: "M16 8V4H4v12h4" })] }),
	move: /* @__PURE__ */ (0, k.jsx)(k.Fragment, { children: /* @__PURE__ */ (0, k.jsx)("path", { d: "M5 12h14M14 7l5 5-5 5" }) }),
	delete: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("path", { d: "M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" }), /* @__PURE__ */ (0, k.jsx)("path", { d: "M10 11v5M14 11v5" })] }),
	trash: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("path", { d: "M5 8h14l-1 12H6zM8 8V5h8v3" }), /* @__PURE__ */ (0, k.jsx)("path", { d: "M9.5 12v4M14.5 12v4" })] }),
	refresh: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("path", { d: "M19 8a7 7 0 1 0 1 7" }), /* @__PURE__ */ (0, k.jsx)("path", { d: "M19 3v5h-5" })] }),
	settings: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("circle", {
		cx: "12",
		cy: "12",
		r: "3"
	}), /* @__PURE__ */ (0, k.jsx)("path", { d: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" })] }),
	grid: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
		/* @__PURE__ */ (0, k.jsx)("rect", {
			x: "4",
			y: "4",
			width: "6",
			height: "6",
			rx: "1"
		}),
		/* @__PURE__ */ (0, k.jsx)("rect", {
			x: "14",
			y: "4",
			width: "6",
			height: "6",
			rx: "1"
		}),
		/* @__PURE__ */ (0, k.jsx)("rect", {
			x: "4",
			y: "14",
			width: "6",
			height: "6",
			rx: "1"
		}),
		/* @__PURE__ */ (0, k.jsx)("rect", {
			x: "14",
			y: "14",
			width: "6",
			height: "6",
			rx: "1"
		})
	] }),
	list: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
		/* @__PURE__ */ (0, k.jsx)("path", { d: "M9 6h11M9 12h11M9 18h11" }),
		/* @__PURE__ */ (0, k.jsx)("circle", {
			cx: "5",
			cy: "6",
			r: "1"
		}),
		/* @__PURE__ */ (0, k.jsx)("circle", {
			cx: "5",
			cy: "12",
			r: "1"
		}),
		/* @__PURE__ */ (0, k.jsx)("circle", {
			cx: "5",
			cy: "18",
			r: "1"
		})
	] }),
	more: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
		/* @__PURE__ */ (0, k.jsx)("circle", {
			cx: "5",
			cy: "12",
			r: "1.2",
			fill: "currentColor",
			stroke: "none"
		}),
		/* @__PURE__ */ (0, k.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "1.2",
			fill: "currentColor",
			stroke: "none"
		}),
		/* @__PURE__ */ (0, k.jsx)("circle", {
			cx: "19",
			cy: "12",
			r: "1.2",
			fill: "currentColor",
			stroke: "none"
		})
	] }),
	archive: /* @__PURE__ */ (0, k.jsx)(k.Fragment, { children: /* @__PURE__ */ (0, k.jsx)("path", { d: "M4 7h16v13H4zM3 4h18v3H3zM9 11h6" }) }),
	favorite: /* @__PURE__ */ (0, k.jsx)("path", { d: "m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" }),
	tags: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("path", { d: "M4 5v6l8 8 7-7-8-8H5z" }), /* @__PURE__ */ (0, k.jsx)("circle", {
		cx: "8",
		cy: "8",
		r: "1"
	})] }),
	"rotate-left": /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("path", { d: "M7 8H3V4" }), /* @__PURE__ */ (0, k.jsx)("path", { d: "M4 8a8 8 0 1 1 1 9" })] }),
	"rotate-right": /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("path", { d: "M17 8h4V4" }), /* @__PURE__ */ (0, k.jsx)("path", { d: "M20 8a8 8 0 1 0-1 9" })] }),
	resize: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("path", { d: "M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" }), /* @__PURE__ */ (0, k.jsx)("path", { d: "m9 9 6 6M15 9l-6 6" })] }),
	crop: /* @__PURE__ */ (0, k.jsx)("path", { d: "M7 3v14a2 2 0 0 0 2 2h12M3 7h14a2 2 0 0 1 2 2v12" }),
	sort: /* @__PURE__ */ (0, k.jsx)(k.Fragment, { children: /* @__PURE__ */ (0, k.jsx)("path", { d: "M8 5v14M5 8l3-3 3 3M16 19V5M13 16l3 3 3-3" }) }),
	search: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("circle", {
		cx: "10.5",
		cy: "10.5",
		r: "6.5"
	}), /* @__PURE__ */ (0, k.jsx)("path", { d: "m16 16 4 4" })] }),
	close: /* @__PURE__ */ (0, k.jsx)("path", { d: "m6 6 12 12M18 6 6 18" }),
	add: /* @__PURE__ */ (0, k.jsx)("path", { d: "M12 5v14M5 12h14" }),
	history: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
		/* @__PURE__ */ (0, k.jsx)("path", { d: "M5 7H2V4" }),
		/* @__PURE__ */ (0, k.jsx)("path", { d: "M3 7a9 9 0 1 1 0 10" }),
		/* @__PURE__ */ (0, k.jsx)("path", { d: "M12 7v5l3 2" })
	] }),
	"chevron-left": /* @__PURE__ */ (0, k.jsx)("path", { d: "m15 5-7 7 7 7" }),
	"chevron-right": /* @__PURE__ */ (0, k.jsx)("path", { d: "m9 5 7 7-7 7" }),
	"chevron-down": /* @__PURE__ */ (0, k.jsx)("path", { d: "m5 9 7 7 7-7" })
};
function A({ name: e }) {
	return /* @__PURE__ */ (0, k.jsx)("svg", {
		className: "sf-ui-icon",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		focusable: "false",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: te[e]
	});
}
//#endregion
//#region src/components/Modal.tsx
function j({ title: e, closeLabel: t, onClose: n, children: r, footer: i, className: a = "" }) {
	let o = (0, _.useRef)(null), s = (0, _.useRef)(`sf-dialog-${Math.random().toString(36).slice(2)}`);
	return (0, _.useEffect)(() => {
		let e = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return (o.current?.querySelector("[autofocus],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[href],[tabindex]:not([tabindex='-1'])"))?.focus(), () => e?.focus();
	}, []), /* @__PURE__ */ (0, k.jsx)("div", {
		className: "sf-modal-backdrop",
		role: "presentation",
		onMouseDown: (e) => {
			e.target === e.currentTarget && n();
		},
		children: /* @__PURE__ */ (0, k.jsxs)("section", {
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
				/* @__PURE__ */ (0, k.jsxs)("header", { children: [/* @__PURE__ */ (0, k.jsx)("h2", {
					id: s.current,
					children: e
				}), /* @__PURE__ */ (0, k.jsx)("button", {
					type: "button",
					onClick: n,
					"aria-label": t,
					children: /* @__PURE__ */ (0, k.jsx)(A, { name: "close" })
				})] }),
				r,
				i && /* @__PURE__ */ (0, k.jsx)("footer", { children: i })
			]
		})
	});
}
//#endregion
//#region src/components/Dialogs.tsx
function ne({ title: e, label: t, initialValue: n = "", maximum: r, extension: i = "", confirmLabel: a, cancelLabel: o, closeLabel: s, onConfirm: c, onClose: l }) {
	let [u, d] = (0, _.useState)(n), f = Array.from(u + i).length, p = u.trim() !== "" && f <= r && !/[\\/\u0000-\u001f]/u.test(u);
	return /* @__PURE__ */ (0, k.jsx)(j, {
		title: e,
		closeLabel: s,
		onClose: l,
		className: "sf-form-modal",
		footer: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
			/* @__PURE__ */ (0, k.jsxs)("span", { children: [
				f,
				" / ",
				r
			] }),
			/* @__PURE__ */ (0, k.jsx)("button", {
				onClick: l,
				children: o
			}),
			/* @__PURE__ */ (0, k.jsx)("button", {
				className: "primary",
				disabled: !p,
				onClick: () => c(u.trim() + i),
				children: a
			})
		] }),
		children: /* @__PURE__ */ (0, k.jsxs)("div", {
			className: "sf-form-body",
			children: [/* @__PURE__ */ (0, k.jsxs)("label", { children: [t, /* @__PURE__ */ (0, k.jsxs)("span", {
				className: "sf-name-input",
				children: [/* @__PURE__ */ (0, k.jsx)("input", {
					autoFocus: !0,
					value: u,
					maxLength: r,
					onChange: (e) => d(e.target.value)
				}), i && /* @__PURE__ */ (0, k.jsx)("span", { children: i })]
			})] }), !p && u !== "" && /* @__PURE__ */ (0, k.jsx)("p", {
				role: "alert",
				children: f > r ? `${f} / ${r}` : t
			})]
		})
	});
}
function M({ title: e, message: t, detail: n, confirmLabel: r, cancelLabel: i, closeLabel: a, danger: o = !1, onConfirm: s, onClose: c }) {
	return /* @__PURE__ */ (0, k.jsx)(j, {
		title: e,
		closeLabel: a,
		onClose: c,
		className: "sf-confirm-modal",
		footer: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
			/* @__PURE__ */ (0, k.jsx)("span", {}),
			/* @__PURE__ */ (0, k.jsx)("button", {
				onClick: c,
				children: i
			}),
			/* @__PURE__ */ (0, k.jsx)("button", {
				className: o ? "danger" : "primary",
				onClick: s,
				children: r
			})
		] }),
		children: /* @__PURE__ */ (0, k.jsxs)("div", {
			className: "sf-form-body",
			children: [/* @__PURE__ */ (0, k.jsx)("p", { children: t }), n && /* @__PURE__ */ (0, k.jsx)("small", { children: n })]
		})
	});
}
//#endregion
//#region src/components/ContextMenu.tsx
function N({ x: e, y: t, items: n, onSelect: r, onClose: i }) {
	let a = (0, _.useRef)(null);
	return (0, _.useEffect)(() => {
		let e = () => i();
		return window.addEventListener("pointerdown", e), window.addEventListener("resize", e), a.current?.querySelector("button:not(:disabled)")?.focus(), () => {
			window.removeEventListener("pointerdown", e), window.removeEventListener("resize", e);
		};
	}, [i]), /* @__PURE__ */ (0, k.jsx)("div", {
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
		children: n.map((e) => /* @__PURE__ */ (0, k.jsx)("button", {
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
function P({ api: e, resource: t, currentPath: n, rootLabel: r, onNavigate: i }) {
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
		return r?.expanded ? r.children.map((e) => /* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsxs)("div", {
			className: `sf-tree-row ${n === e.path ? "active" : ""}`,
			style: { paddingInlineStart: `${8 + t * 16}px` },
			children: [/* @__PURE__ */ (0, k.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => c(e.path),
				"aria-expanded": a[e.path]?.expanded || !1,
				"aria-label": e.name,
				children: a[e.path]?.loading ? "…" : a[e.path]?.expanded ? "⌄" : "›"
			}), /* @__PURE__ */ (0, k.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => i(e.path),
				title: e.path,
				children: ["▰ ", e.name]
			})]
		}), l(e.path, t + 1)] }, e.path)) : null;
	};
	return /* @__PURE__ */ (0, k.jsxs)("nav", {
		className: "sf-folder-tree",
		"aria-label": r,
		children: [/* @__PURE__ */ (0, k.jsxs)("div", {
			className: `sf-tree-row ${n === "" ? "active" : ""}`,
			children: [/* @__PURE__ */ (0, k.jsx)("button", {
				className: "sf-tree-toggle",
				onClick: () => c(""),
				"aria-expanded": a[""]?.expanded || !1,
				children: "⌄"
			}), /* @__PURE__ */ (0, k.jsxs)("button", {
				className: "sf-tree-name",
				onClick: () => i(""),
				children: ["⌂ ", r]
			})]
		}), l("", 1)]
	});
}
//#endregion
//#region node_modules/.pnpm/cropperjs@1.6.2/node_modules/cropperjs/dist/cropper.css
var re = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
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
		var h = typeof window < "u" && window.document !== void 0, g = h ? window : {}, _ = h && g.document.documentElement ? "ontouchstart" in g.document.documentElement : !1, v = h ? "PointerEvent" in g : !1, y = "cropper", b = "all", x = "crop", S = "move", C = "zoom", w = "e", T = "w", E = "s", D = "n", O = "ne", ee = "nw", k = "se", te = "sw", A = `${y}-crop`, j = `${y}-disabled`, ne = `${y}-hidden`, M = `${y}-hide`, N = `${y}-invisible`, P = `${y}-modal`, re = `${y}-move`, ie = `${y}Action`, ae = `${y}Preview`, oe = "crop", F = "move", I = "none", se = "crop", ce = "cropend", le = "cropmove", ue = "cropstart", de = "dblclick", fe = _ ? "touchstart" : "mousedown", pe = _ ? "touchmove" : "mousemove", me = _ ? "touchend touchcancel" : "mouseup", he = v ? "pointerdown" : fe, ge = v ? "pointermove" : pe, _e = v ? "pointerup pointercancel" : me, ve = "ready", ye = "resize", be = "wheel", xe = "zoom", Se = "image/jpeg", Ce = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/, we = /^data:/, Te = /^data:image\/jpeg;base64,/, Ee = /^img|canvas$/i, De = 200, Oe = 100, ke = {
			viewMode: 0,
			dragMode: oe,
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
			minContainerWidth: De,
			minContainerHeight: Oe,
			ready: null,
			cropstart: null,
			cropmove: null,
			cropend: null,
			crop: null,
			zoom: null
		}, Ae = "<div class=\"cropper-container\" touch-action=\"none\"><div class=\"cropper-wrap-box\"><div class=\"cropper-canvas\"></div></div><div class=\"cropper-drag-box\"></div><div class=\"cropper-crop-box\"><span class=\"cropper-view-box\"></span><span class=\"cropper-dashed dashed-h\"></span><span class=\"cropper-dashed dashed-v\"></span><span class=\"cropper-center\"></span><span class=\"cropper-face\"></span><span class=\"cropper-line line-e\" data-cropper-action=\"e\"></span><span class=\"cropper-line line-n\" data-cropper-action=\"n\"></span><span class=\"cropper-line line-w\" data-cropper-action=\"w\"></span><span class=\"cropper-line line-s\" data-cropper-action=\"s\"></span><span class=\"cropper-point point-e\" data-cropper-action=\"e\"></span><span class=\"cropper-point point-n\" data-cropper-action=\"n\"></span><span class=\"cropper-point point-w\" data-cropper-action=\"w\"></span><span class=\"cropper-point point-s\" data-cropper-action=\"s\"></span><span class=\"cropper-point point-ne\" data-cropper-action=\"ne\"></span><span class=\"cropper-point point-nw\" data-cropper-action=\"nw\"></span><span class=\"cropper-point point-sw\" data-cropper-action=\"sw\"></span><span class=\"cropper-point point-se\" data-cropper-action=\"se\"></span></div></div>", je = Number.isNaN || g.isNaN;
		function L(e) {
			return typeof e == "number" && !je(e);
		}
		var Me = function(e) {
			return e > 0 && e < Infinity;
		};
		function Ne(e) {
			return e === void 0;
		}
		function Pe(e) {
			return i(e) === "object" && e !== null;
		}
		var Fe = Object.prototype.hasOwnProperty;
		function Ie(e) {
			if (!Pe(e)) return !1;
			try {
				var t = e.constructor, n = t.prototype;
				return t && n && Fe.call(n, "isPrototypeOf");
			} catch {
				return !1;
			}
		}
		function Le(e) {
			return typeof e == "function";
		}
		var Re = Array.prototype.slice;
		function ze(e) {
			return Array.from ? Array.from(e) : Re.call(e);
		}
		function Be(e, t) {
			return e && Le(t) && (Array.isArray(e) || L(e.length) ? ze(e).forEach(function(n, r) {
				t.call(e, n, r, e);
			}) : Pe(e) && Object.keys(e).forEach(function(n) {
				t.call(e, e[n], n, e);
			})), e;
		}
		var R = Object.assign || function(e) {
			var t = [...arguments].slice(1);
			return Pe(e) && t.length > 0 && t.forEach(function(t) {
				Pe(t) && Object.keys(t).forEach(function(n) {
					e[n] = t[n];
				});
			}), e;
		}, Ve = /\.\d*(?:0|9){12}\d*$/;
		function He(e) {
			var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1e11;
			return Ve.test(e) ? Math.round(e * t) / t : e;
		}
		var z = /^width|height|left|top|marginLeft|marginTop$/;
		function Ue(e, t) {
			var n = e.style;
			Be(t, function(e, t) {
				z.test(t) && L(e) && (e = `${e}px`), n[t] = e;
			});
		}
		function We(e, t) {
			return e.classList ? e.classList.contains(t) : e.className.indexOf(t) > -1;
		}
		function Ge(e, t) {
			if (t) {
				if (L(e.length)) {
					Be(e, function(e) {
						Ge(e, t);
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
		function Ke(e, t) {
			if (t) {
				if (L(e.length)) {
					Be(e, function(e) {
						Ke(e, t);
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
		function qe(e, t, n) {
			if (t) {
				if (L(e.length)) {
					Be(e, function(e) {
						qe(e, t, n);
					});
					return;
				}
				n ? Ge(e, t) : Ke(e, t);
			}
		}
		var Je = /([a-z\d])([A-Z])/g;
		function Ye(e) {
			return e.replace(Je, "$1-$2").toLowerCase();
		}
		function Xe(e, t) {
			return Pe(e[t]) ? e[t] : e.dataset ? e.dataset[t] : e.getAttribute(`data-${Ye(t)}`);
		}
		function Ze(e, t, n) {
			Pe(n) ? e[t] = n : e.dataset ? e.dataset[t] = n : e.setAttribute(`data-${Ye(t)}`, n);
		}
		function Qe(e, t) {
			if (Pe(e[t])) try {
				delete e[t];
			} catch {
				e[t] = void 0;
			}
			else if (e.dataset) try {
				delete e.dataset[t];
			} catch {
				e.dataset[t] = void 0;
			}
			else e.removeAttribute(`data-${Ye(t)}`);
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
			return Le(Event) && Le(CustomEvent) ? r = new CustomEvent(t, {
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
			L(i) && i !== 0 && o.push(`translateX(${i}px)`), L(a) && a !== 0 && o.push(`translateY(${a}px)`), L(t) && t !== 0 && o.push(`rotate(${t}deg)`), L(n) && n !== 1 && o.push(`scaleX(${n})`), L(r) && r !== 1 && o.push(`scaleY(${r})`);
			var s = o.length ? o.join(" ") : "none";
			return {
				WebkitTransform: s,
				msTransform: s,
				transform: s
			};
		}
		function ut(e) {
			var n = t({}, e), r = 0;
			return Be(e, function(e, t) {
				delete n[t], Be(n, function(t) {
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
			return Be(e, function(e) {
				var i = e.startX, a = e.startY;
				t += i, n += a, r += 1;
			}), t /= r, n /= r, {
				pageX: t,
				pageY: n
			};
		}
		function pt(e) {
			var t = e.aspectRatio, n = e.height, r = e.width, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "contain", a = Me(r), o = Me(n);
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
			var i = t.aspectRatio, a = t.naturalWidth, o = t.naturalHeight, s = t.rotate, c = s === void 0 ? 0 : s, u = t.scaleX, d = u === void 0 ? 1 : u, f = t.scaleY, p = f === void 0 ? 1 : f, m = n.aspectRatio, h = n.naturalWidth, g = n.naturalHeight, _ = r.fillColor, v = _ === void 0 ? "transparent" : _, y = r.imageSmoothingEnabled, b = y === void 0 || y, x = r.imageSmoothingQuality, S = x === void 0 ? "low" : x, C = r.maxWidth, w = C === void 0 ? Infinity : C, T = r.maxHeight, E = T === void 0 ? Infinity : T, D = r.minWidth, O = D === void 0 ? 0 : D, ee = r.minHeight, k = ee === void 0 ? 0 : ee, te = document.createElement("canvas"), A = te.getContext("2d"), j = pt({
				aspectRatio: m,
				width: w,
				height: E
			}), ne = pt({
				aspectRatio: m,
				width: O,
				height: k
			}, "cover"), M = Math.min(j.width, Math.max(ne.width, h)), N = Math.min(j.height, Math.max(ne.height, g)), P = pt({
				aspectRatio: i,
				width: w,
				height: E
			}), re = pt({
				aspectRatio: i,
				width: O,
				height: k
			}, "cover"), ie = Math.min(P.width, Math.max(re.width, a)), ae = Math.min(P.height, Math.max(re.height, o)), oe = [
				-ie / 2,
				-ae / 2,
				ie,
				ae
			];
			return te.width = He(M), te.height = He(N), A.fillStyle = v, A.fillRect(0, 0, M, N), A.save(), A.translate(M / 2, N / 2), A.rotate(c * Math.PI / 180), A.scale(d, p), A.imageSmoothingEnabled = b, A.imageSmoothingQuality = S, A.drawImage.apply(A, [e].concat(l(oe.map(function(e) {
				return Math.floor(He(e));
			})))), A.restore(), te;
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
			return Be(i, function(e, t) {
				i[t] = n.charCodeAt(t);
			}), r;
		}
		function bt(e, t) {
			for (var n = [], r = 8192, i = new Uint8Array(e); i.length > 0;) n.push(gt.apply(null, ze(i.subarray(0, r)))), i = i.subarray(r);
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
				Ge(r, ne), Ke(e, ne);
				var o = {
					width: Math.max(n.offsetWidth, i >= 0 ? i : De),
					height: Math.max(n.offsetHeight, a >= 0 ? a : Oe)
				};
				this.containerData = o, Ue(r, {
					width: o.width,
					height: o.height
				}), Ge(e, ne), Ke(r, ne);
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
				this.canvasData = l, this.limited = n === 1 || n === 2, this.limitCanvas(!0, !0), l.width = Math.min(Math.max(l.width, l.minWidth), l.maxWidth), l.height = Math.min(Math.max(l.height, l.minHeight), l.maxHeight), l.left = (e.width - l.width) / 2, l.top = (e.height - l.height) / 2, l.oldLeft = l.left, l.oldTop = l.top, this.initialCanvasData = R({}, l);
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
				(n.width > n.maxWidth || n.width < n.minWidth) && (n.left = n.oldLeft), (n.height > n.maxHeight || n.height < n.minHeight) && (n.top = n.oldTop), n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth), n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight), this.limitCanvas(!1, !0), n.left = Math.min(Math.max(n.left, n.minLeft), n.maxLeft), n.top = Math.min(Math.max(n.top, n.minTop), n.maxTop), n.oldLeft = n.left, n.oldTop = n.top, Ue(this.canvas, R({
					width: n.width,
					height: n.height
				}, lt({
					translateX: n.left,
					translateY: n.top
				}))), this.renderImage(e), this.cropped && this.limited && this.limitCropBox(!0, !0);
			},
			renderImage: function(e) {
				var t = this.canvasData, n = this.imageData, r = n.naturalWidth * (t.width / t.naturalWidth), i = n.naturalHeight * (t.height / t.naturalHeight);
				R(n, {
					width: r,
					height: i,
					left: (t.width - r) / 2,
					top: (t.height - i) / 2
				}), Ue(this.image, R({
					width: n.width,
					height: n.height
				}, lt(R({
					translateX: n.left,
					translateY: n.top
				}, n)))), e && this.output();
			},
			initCropBox: function() {
				var e = this.options, t = this.canvasData, n = e.aspectRatio || e.initialAspectRatio, r = Number(e.autoCropArea) || .8, i = {
					width: t.width,
					height: t.height
				};
				n && (t.height * n > t.width ? i.height = i.width / n : i.width = i.height * n), this.cropBoxData = i, this.limitCropBox(!0, !0), i.width = Math.min(Math.max(i.width, i.minWidth), i.maxWidth), i.height = Math.min(Math.max(i.height, i.minHeight), i.maxHeight), i.width = Math.max(i.minWidth, i.width * r), i.height = Math.max(i.minHeight, i.height * r), i.left = t.left + (t.width - i.width) / 2, i.top = t.top + (t.height - i.height) / 2, i.oldLeft = i.left, i.oldTop = i.top, this.initialCropBoxData = R({}, i);
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
				(n.width > n.maxWidth || n.width < n.minWidth) && (n.left = n.oldLeft), (n.height > n.maxHeight || n.height < n.minHeight) && (n.top = n.oldTop), n.width = Math.min(Math.max(n.width, n.minWidth), n.maxWidth), n.height = Math.min(Math.max(n.height, n.minHeight), n.maxHeight), this.limitCropBox(!1, !0), n.left = Math.min(Math.max(n.left, n.minLeft), n.maxLeft), n.top = Math.min(Math.max(n.top, n.minTop), n.maxTop), n.oldLeft = n.left, n.oldTop = n.top, e.movable && e.cropBoxMovable && Ze(this.face, ie, n.width >= t.width && n.height >= t.height ? S : b), Ue(this.cropBox, R({
					width: n.width,
					height: n.height
				}, lt({
					translateX: n.left,
					translateY: n.top
				}))), this.cropped && this.limited && this.limitCanvas(!0, !0), this.disabled || this.output();
			},
			output: function() {
				this.preview(), rt(this.element, se, this.getData());
			}
		}, wt = {
			initPreview: function() {
				var e = this.element, t = this.crossOrigin, n = this.options.preview, r = t ? this.crossOriginUrl : this.url, i = e.alt || "The image to preview", a = document.createElement("img");
				if (t && (a.crossOrigin = t), a.src = r, a.alt = i, this.viewBox.appendChild(a), this.viewBoxImage = a, n) {
					var o = n;
					typeof n == "string" ? o = e.ownerDocument.querySelectorAll(n) : n.querySelector && (o = [n]), this.previews = o, Be(o, function(e) {
						var n = document.createElement("img");
						Ze(e, ae, {
							width: e.offsetWidth,
							height: e.offsetHeight,
							html: e.innerHTML
						}), t && (n.crossOrigin = t), n.src = r, n.alt = i, n.style.cssText = "display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;\"", e.innerHTML = "", e.appendChild(n);
					});
				}
			},
			resetPreview: function() {
				Be(this.previews, function(e) {
					var t = Xe(e, ae);
					Ue(e, {
						width: t.width,
						height: t.height
					}), e.innerHTML = t.html, Qe(e, ae);
				});
			},
			preview: function() {
				var e = this.imageData, t = this.canvasData, n = this.cropBoxData, r = n.width, i = n.height, a = e.width, o = e.height, s = n.left - t.left - e.left, c = n.top - t.top - e.top;
				!this.cropped || this.disabled || (Ue(this.viewBoxImage, R({
					width: a,
					height: o
				}, lt(R({
					translateX: -s,
					translateY: -c
				}, e)))), Be(this.previews, function(t) {
					var n = Xe(t, ae), l = n.width, u = n.height, d = l, f = u, p = 1;
					r && (p = l / r, f = i * p), i && f > u && (p = u / i, d = r * p, f = u), Ue(t, {
						width: d,
						height: f
					}), Ue(t.getElementsByTagName("img")[0], R({
						width: a * p,
						height: o * p
					}, lt(R({
						translateX: -s * p,
						translateY: -c * p
					}, e))));
				}));
			}
		}, Tt = {
			bind: function() {
				var e = this.element, t = this.options, n = this.cropper;
				Le(t.cropstart) && nt(e, ue, t.cropstart), Le(t.cropmove) && nt(e, le, t.cropmove), Le(t.cropend) && nt(e, ce, t.cropend), Le(t.crop) && nt(e, se, t.crop), Le(t.zoom) && nt(e, xe, t.zoom), nt(n, he, this.onCropStart = this.cropStart.bind(this)), t.zoomable && t.zoomOnWheel && nt(n, be, this.onWheel = this.wheel.bind(this), {
					passive: !1,
					capture: !0
				}), t.toggleDragModeOnDblclick && nt(n, de, this.onDblclick = this.dblclick.bind(this)), nt(e.ownerDocument, ge, this.onCropMove = this.cropMove.bind(this)), nt(e.ownerDocument, _e, this.onCropEnd = this.cropEnd.bind(this)), t.responsive && nt(window, ye, this.onResize = this.resize.bind(this));
			},
			unbind: function() {
				var e = this.element, t = this.options, n = this.cropper;
				Le(t.cropstart) && tt(e, ue, t.cropstart), Le(t.cropmove) && tt(e, le, t.cropmove), Le(t.cropend) && tt(e, ce, t.cropend), Le(t.crop) && tt(e, se, t.crop), Le(t.zoom) && tt(e, xe, t.zoom), tt(n, he, this.onCropStart), t.zoomable && t.zoomOnWheel && tt(n, be, this.onWheel, {
					passive: !1,
					capture: !0
				}), t.toggleDragModeOnDblclick && tt(n, de, this.onDblclick), tt(e.ownerDocument, ge, this.onCropMove), tt(e.ownerDocument, _e, this.onCropEnd), t.responsive && tt(window, ye, this.onResize);
			}
		}, Et = {
			resize: function() {
				if (!this.disabled) {
					var e = this.options, t = this.container, n = this.containerData, r = t.offsetWidth / n.width, i = t.offsetHeight / n.height, a = Math.abs(r - 1) > Math.abs(i - 1) ? r : i;
					if (a !== 1) {
						var o, s;
						e.restore && (o = this.getCanvasData(), s = this.getCropBoxData()), this.render(), e.restore && (this.setCanvasData(Be(o, function(e, t) {
							o[t] = e * a;
						})), this.setCropBoxData(Be(s, function(e, t) {
							s[t] = e * a;
						})));
					}
				}
			},
			dblclick: function() {
				this.disabled || this.options.dragMode === I || this.setDragMode(We(this.dragBox, A) ? F : oe);
			},
			wheel: function(e) {
				var t = this, n = Number(this.options.wheelZoomRatio) || .1, r = 1;
				this.disabled || (e.preventDefault(), !this.wheeling && (this.wheeling = !0, setTimeout(function() {
					t.wheeling = !1;
				}, 50), e.deltaY ? r = e.deltaY > 0 ? 1 : -1 : e.wheelDelta ? r = -e.wheelDelta / 120 : e.detail && (r = e.detail > 0 ? 1 : -1), this.zoom(-r * n, e)));
			},
			cropStart: function(e) {
				var t = e.buttons, n = e.button;
				if (!(this.disabled || (e.type === "mousedown" || e.type === "pointerdown" && e.pointerType === "mouse") && (L(t) && t !== 1 || L(n) && n !== 0 || e.ctrlKey))) {
					var r = this.options, i = this.pointers, a;
					e.changedTouches ? Be(e.changedTouches, function(e) {
						i[e.identifier] = dt(e);
					}) : i[e.pointerId || 0] = dt(e), a = Object.keys(i).length > 1 && r.zoomable && r.zoomOnTouch ? C : Xe(e.target, ie), Ce.test(a) && rt(this.element, ue, {
						originalEvent: e,
						action: a
					}) !== !1 && (e.preventDefault(), this.action = a, this.cropping = !1, a === x && (this.cropping = !0, Ge(this.dragBox, P)));
				}
			},
			cropMove: function(e) {
				var t = this.action;
				if (!(this.disabled || !t)) {
					var n = this.pointers;
					e.preventDefault(), rt(this.element, le, {
						originalEvent: e,
						action: t
					}) !== !1 && (e.changedTouches ? Be(e.changedTouches, function(e) {
						R(n[e.identifier] || {}, dt(e, !0));
					}) : R(n[e.pointerId || 0] || {}, dt(e, !0)), this.change(e));
				}
			},
			cropEnd: function(e) {
				if (!this.disabled) {
					var t = this.action, n = this.pointers;
					e.changedTouches ? Be(e.changedTouches, function(e) {
						delete n[e.identifier];
					}) : delete n[e.pointerId || 0], t && (e.preventDefault(), Object.keys(n).length || (this.action = ""), this.cropping && (this.cropping = !1, qe(this.dragBox, P, this.cropped && this.options.modal)), rt(this.element, ce, {
						originalEvent: e,
						action: t
					}));
				}
			}
		}, Dt = { change: function(e) {
			var t = this.options, n = this.canvasData, r = this.containerData, i = this.cropBoxData, a = this.pointers, o = this.action, s = t.aspectRatio, c = i.left, l = i.top, u = i.width, d = i.height, f = c + u, p = l + d, m = 0, h = 0, g = r.width, _ = r.height, v = !0, y;
			!s && e.shiftKey && (s = u && d ? u / d : 1), this.limited && (m = i.minLeft, h = i.minTop, g = m + Math.min(r.width, n.width, n.left + n.width), _ = h + Math.min(r.height, n.height, n.top + n.height));
			var A = a[Object.keys(a)[0]], j = {
				x: A.endX - A.startX,
				y: A.endY - A.startY
			}, M = function(e) {
				switch (e) {
					case w:
						f + j.x > g && (j.x = g - f);
						break;
					case T:
						c + j.x < m && (j.x = m - c);
						break;
					case D:
						l + j.y < h && (j.y = h - l);
						break;
					case E: p + j.y > _ && (j.y = _ - p);
				}
			};
			switch (o) {
				case b:
					c += j.x, l += j.y;
					break;
				case w:
					if (j.x >= 0 && (f >= g || s && (l <= h || p >= _))) {
						v = !1;
						break;
					}
					M(w), u += j.x, u < 0 && (o = T, u = -u, c -= u), s && (d = u / s, l += (i.height - d) / 2);
					break;
				case D:
					if (j.y <= 0 && (l <= h || s && (c <= m || f >= g))) {
						v = !1;
						break;
					}
					M(D), d -= j.y, l += j.y, d < 0 && (o = E, d = -d, l -= d), s && (u = d * s, c += (i.width - u) / 2);
					break;
				case T:
					if (j.x <= 0 && (c <= m || s && (l <= h || p >= _))) {
						v = !1;
						break;
					}
					M(T), u -= j.x, c += j.x, u < 0 && (o = w, u = -u, c -= u), s && (d = u / s, l += (i.height - d) / 2);
					break;
				case E:
					if (j.y >= 0 && (p >= _ || s && (c <= m || f >= g))) {
						v = !1;
						break;
					}
					M(E), d += j.y, d < 0 && (o = D, d = -d, l -= d), s && (u = d * s, c += (i.width - u) / 2);
					break;
				case O:
					if (s) {
						if (j.y <= 0 && (l <= h || f >= g)) {
							v = !1;
							break;
						}
						M(D), d -= j.y, l += j.y, u = d * s;
					} else M(D), M(w), j.x >= 0 ? f < g ? u += j.x : j.y <= 0 && l <= h && (v = !1) : u += j.x, j.y <= 0 ? l > h && (d -= j.y, l += j.y) : (d -= j.y, l += j.y);
					u < 0 && d < 0 ? (o = te, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = ee, u = -u, c -= u) : d < 0 && (o = k, d = -d, l -= d);
					break;
				case ee:
					if (s) {
						if (j.y <= 0 && (l <= h || c <= m)) {
							v = !1;
							break;
						}
						M(D), d -= j.y, l += j.y, u = d * s, c += i.width - u;
					} else M(D), M(T), j.x <= 0 ? c > m ? (u -= j.x, c += j.x) : j.y <= 0 && l <= h && (v = !1) : (u -= j.x, c += j.x), j.y <= 0 ? l > h && (d -= j.y, l += j.y) : (d -= j.y, l += j.y);
					u < 0 && d < 0 ? (o = k, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = O, u = -u, c -= u) : d < 0 && (o = te, d = -d, l -= d);
					break;
				case te:
					if (s) {
						if (j.x <= 0 && (c <= m || p >= _)) {
							v = !1;
							break;
						}
						M(T), u -= j.x, c += j.x, d = u / s;
					} else M(E), M(T), j.x <= 0 ? c > m ? (u -= j.x, c += j.x) : j.y >= 0 && p >= _ && (v = !1) : (u -= j.x, c += j.x), j.y >= 0 ? p < _ && (d += j.y) : d += j.y;
					u < 0 && d < 0 ? (o = O, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = k, u = -u, c -= u) : d < 0 && (o = ee, d = -d, l -= d);
					break;
				case k:
					if (s) {
						if (j.x >= 0 && (f >= g || p >= _)) {
							v = !1;
							break;
						}
						M(w), u += j.x, d = u / s;
					} else M(E), M(w), j.x >= 0 ? f < g ? u += j.x : j.y >= 0 && p >= _ && (v = !1) : u += j.x, j.y >= 0 ? p < _ && (d += j.y) : d += j.y;
					u < 0 && d < 0 ? (o = ee, d = -d, u = -u, l -= d, c -= u) : u < 0 ? (o = te, u = -u, c -= u) : d < 0 && (o = O, d = -d, l -= d);
					break;
				case S:
					this.move(j.x, j.y), v = !1;
					break;
				case C:
					this.zoom(ut(a), e), v = !1;
					break;
				case x:
					if (!j.x || !j.y) {
						v = !1;
						break;
					}
					y = it(this.cropper), c = A.startX - y.left, l = A.startY - y.top, u = i.minWidth, d = i.minHeight, j.x > 0 ? o = j.y > 0 ? k : O : j.x < 0 && (c -= u, o = j.y > 0 ? te : ee), j.y < 0 && (l -= d), this.cropped || (Ke(this.cropBox, ne), this.cropped = !0, this.limited && this.limitCropBox(!0, !0));
			}
			v && (i.width = u, i.height = d, i.left = c, i.top = l, this.action = o, this.renderCropBox()), Be(a, function(e) {
				e.startX = e.endX, e.startY = e.endY;
			});
		} }, Ot = {
			crop: function() {
				return this.ready && !this.cropped && !this.disabled && (this.cropped = !0, this.limitCropBox(!0, !0), this.options.modal && Ge(this.dragBox, P), Ke(this.cropBox, ne), this.setCropBoxData(this.initialCropBoxData)), this;
			},
			reset: function() {
				return this.ready && !this.disabled && (this.imageData = R({}, this.initialImageData), this.canvasData = R({}, this.initialCanvasData), this.cropBoxData = R({}, this.initialCropBoxData), this.renderCanvas(), this.cropped && this.renderCropBox()), this;
			},
			clear: function() {
				return this.cropped && !this.disabled && (R(this.cropBoxData, {
					left: 0,
					top: 0,
					width: 0,
					height: 0
				}), this.cropped = !1, this.renderCropBox(), this.limitCanvas(!0, !0), this.renderCanvas(), Ke(this.dragBox, P), Ge(this.cropBox, ne)), this;
			},
			replace: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 && arguments[1];
				return !this.disabled && e && (this.isImg && (this.element.src = e), t ? (this.url = e, this.image.src = e, this.ready && (this.viewBoxImage.src = e, Be(this.previews, function(t) {
					t.getElementsByTagName("img")[0].src = e;
				}))) : (this.isImg && (this.replaced = !0), this.options.data = null, this.uncreate(), this.load(e))), this;
			},
			enable: function() {
				return this.ready && this.disabled && (this.disabled = !1, Ke(this.cropper, j)), this;
			},
			disable: function() {
				return this.ready && !this.disabled && (this.disabled = !0, Ge(this.cropper, j)), this;
			},
			destroy: function() {
				var e = this.element;
				return e[y] ? (e[y] = void 0, this.isImg && this.replaced && (e.src = this.originalUrl), this.uncreate(), this) : this;
			},
			move: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.canvasData, r = n.left, i = n.top;
				return this.moveTo(Ne(e) ? e : r + Number(e), Ne(t) ? t : i + Number(t));
			},
			moveTo: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.canvasData, r = !1;
				return e = Number(e), t = Number(t), this.ready && !this.disabled && this.options.movable && (L(e) && (n.left = e, r = !0), L(t) && (n.top = t, r = !0), r && this.renderCanvas(!0)), this;
			},
			zoom: function(e, t) {
				var n = this.canvasData;
				return e = Number(e), e = e < 0 ? 1 / (1 - e) : 1 + e, this.zoomTo(n.width * e / n.naturalWidth, null, t);
			},
			zoomTo: function(e, t, n) {
				var r = this.options, i = this.canvasData, a = i.width, o = i.height, s = i.naturalWidth, c = i.naturalHeight;
				if (e = Number(e), e >= 0 && this.ready && !this.disabled && r.zoomable) {
					var l = s * e, u = c * e;
					if (rt(this.element, xe, {
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
					} else Ie(t) && L(t.x) && L(t.y) ? (i.left -= (l - a) * ((t.x - i.left) / a), i.top -= (u - o) * ((t.y - i.top) / o)) : (i.left -= (l - a) / 2, i.top -= (u - o) / 2);
					i.width = l, i.height = u, this.renderCanvas(!0);
				}
				return this;
			},
			rotate: function(e) {
				return this.rotateTo((this.imageData.rotate || 0) + Number(e));
			},
			rotateTo: function(e) {
				return e = Number(e), L(e) && this.ready && !this.disabled && this.options.rotatable && (this.imageData.rotate = e % 360, this.renderCanvas(!0, !0)), this;
			},
			scaleX: function(e) {
				var t = this.imageData.scaleY;
				return this.scale(e, L(t) ? t : 1);
			},
			scaleY: function(e) {
				var t = this.imageData.scaleX;
				return this.scale(L(t) ? t : 1, e);
			},
			scale: function(e) {
				var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, n = this.imageData, r = !1;
				return e = Number(e), t = Number(t), this.ready && !this.disabled && this.options.scalable && (L(e) && (n.scaleX = e, r = !0), L(t) && (n.scaleY = t, r = !0), r && this.renderCanvas(!0, !0)), this;
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
					if (Be(a, function(e, t) {
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
				if (this.ready && !this.disabled && Ie(e)) {
					var a = !1;
					t.rotatable && L(e.rotate) && e.rotate !== n.rotate && (n.rotate = e.rotate, a = !0), t.scalable && (L(e.scaleX) && e.scaleX !== n.scaleX && (n.scaleX = e.scaleX, a = !0), L(e.scaleY) && e.scaleY !== n.scaleY && (n.scaleY = e.scaleY, a = !0)), a && this.renderCanvas(!0, !0);
					var o = n.width / n.naturalWidth;
					L(e.x) && (i.left = e.x * o + r.left), L(e.y) && (i.top = e.y * o + r.top), L(e.width) && (i.width = e.width * o), L(e.height) && (i.height = e.height * o), this.setCropBoxData(i);
				}
				return this;
			},
			getContainerData: function() {
				return this.ready ? R({}, this.containerData) : {};
			},
			getImageData: function() {
				return this.sized ? R({}, this.imageData) : {};
			},
			getCanvasData: function() {
				var e = this.canvasData, t = {};
				return this.ready && Be([
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
				return this.ready && !this.disabled && Ie(e) && (L(e.left) && (t.left = e.left), L(e.top) && (t.top = e.top), L(e.width) ? (t.width = e.width, t.height = e.width / n) : L(e.height) && (t.height = e.height, t.width = e.height * n), this.renderCanvas(!0)), this;
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
				return this.ready && this.cropped && !this.disabled && Ie(e) && (L(e.left) && (t.left = e.left), L(e.top) && (t.top = e.top), L(e.width) && e.width !== t.width && (r = !0, t.width = e.width), L(e.height) && e.height !== t.height && (i = !0, t.height = e.height), n && (r ? t.height = t.width / n : i && (t.width = t.height * n)), this.renderCropBox()), this;
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
				var te = [
					C,
					w,
					T,
					E
				];
				if (ee > 0 && k > 0) {
					var A = m / o;
					te.push(D * A, O * A, ee * A, k * A);
				}
				return _.drawImage.apply(_, [n].concat(l(te.map(function(e) {
					return Math.floor(He(e));
				})))), g;
			},
			setAspectRatio: function(e) {
				var t = this.options;
				return !this.disabled && !Ne(e) && (t.aspectRatio = Math.max(0, e) || NaN, this.ready && (this.initCropBox(), this.cropped && this.renderCropBox())), this;
			},
			setDragMode: function(e) {
				var t = this.options, n = this.dragBox, r = this.face;
				if (this.ready && !this.disabled) {
					var i = e === oe, a = t.movable && e === F;
					e = i || a ? e : I, t.dragMode = e, Ze(n, ie, e), qe(n, A, i), qe(n, re, a), t.cropBoxMovable || (Ze(r, ie, e), qe(r, A, i), qe(r, re, a));
				}
				return this;
			}
		}, kt = g.Cropper, At = /*#__PURE__*/ function() {
			function e(t) {
				var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				if (a(this, e), !t || !Ee.test(t.tagName)) throw Error("The first argument is required and must be an <img> or <canvas> element.");
				this.element = t, this.options = R({}, ke, Ie(n) && n), this.cropped = !1, this.disabled = !1, this.pointers = {}, this.ready = !1, this.reloading = !1, this.replaced = !1, this.sized = !1, this.sizing = !1, this.init();
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
							if (we.test(e)) {
								Te.test(e) ? this.read(yt(e)) : this.clone();
								return;
							}
							var i = new XMLHttpRequest(), a = this.clone.bind(this);
							this.reloading = !0, this.xhr = i, i.onabort = a, i.onerror = a, i.ontimeout = a, i.onprogress = function() {
								i.getResponseHeader("content-type") !== Se && i.abort();
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
							this.url = bt(e, Se);
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
						n && (i.crossOrigin = n), i.src = r || t, i.alt = e.alt || "The image to crop", this.image = i, i.onload = this.start.bind(this), i.onerror = this.stop.bind(this), Ge(i, M), e.parentNode.insertBefore(i, e.nextSibling);
					}
				},
				{
					key: "start",
					value: function() {
						var e = this, t = this.image;
						t.onload = null, t.onerror = null, this.sizing = !0;
						var n = g.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(g.navigator.userAgent), r = function(t, n) {
							R(e.imageData, {
								naturalWidth: t,
								naturalHeight: n,
								aspectRatio: t / n
							}), e.initialImageData = R({}, e.imageData), e.sizing = !1, e.sized = !0, e.build();
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
							i.innerHTML = Ae;
							var a = i.querySelector(`.${y}-container`), o = a.querySelector(`.${y}-canvas`), s = a.querySelector(`.${y}-drag-box`), c = a.querySelector(`.${y}-crop-box`), l = c.querySelector(`.${y}-face`);
							this.container = r, this.cropper = a, this.canvas = o, this.dragBox = s, this.cropBox = c, this.viewBox = a.querySelector(`.${y}-view-box`), this.face = l, o.appendChild(n), Ge(e, ne), r.insertBefore(a, e.nextSibling), Ke(n, M), this.initPreview(), this.bind(), t.initialAspectRatio = Math.max(0, t.initialAspectRatio) || NaN, t.aspectRatio = Math.max(0, t.aspectRatio) || NaN, t.viewMode = Math.max(0, Math.min(3, Math.round(t.viewMode))) || 0, Ge(c, ne), t.guides || Ge(c.getElementsByClassName(`${y}-dashed`), ne), t.center || Ge(c.getElementsByClassName(`${y}-center`), ne), t.background && Ge(a, `${y}-bg`), t.highlight || Ge(l, N), t.cropBoxMovable && (Ge(l, re), Ze(l, ie, b)), t.cropBoxResizable || (Ge(c.getElementsByClassName(`${y}-line`), ne), Ge(c.getElementsByClassName(`${y}-point`), ne)), this.render(), this.ready = !0, this.setDragMode(t.dragMode), t.autoCrop && this.crop(), this.setData(t.data), Le(t.ready) && nt(e, ve, t.ready, { once: !0 }), rt(e, ve);
						}
					}
				},
				{
					key: "unbuild",
					value: function() {
						if (this.ready) {
							this.ready = !1, this.unbind(), this.resetPreview();
							var e = this.cropper.parentNode;
							e && e.removeChild(this.cropper), Ke(this.element, ne);
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
					R(ke, Ie(e) && e);
				}
			}]);
		}();
		return R(At.prototype, Ct, wt, Tt, Et, Dt, Ot), At;
	}));
})))(), 1), ie = (e, t, n) => Math.max(t, Math.min(e, n));
function ae(e, t) {
	let n = ie(Math.round(e.x), 0, Math.max(0, t.width - 1)), r = ie(Math.round(e.y), 0, Math.max(0, t.height - 1));
	return {
		x: n,
		y: r,
		width: ie(Math.round(e.width), 1, Math.max(1, t.width - n)),
		height: ie(Math.round(e.height), 1, Math.max(1, t.height - r))
	};
}
//#endregion
//#region src/components/ImageEditor.tsx
var oe = (e, t) => e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
function F({ entry: e, info: t, imageUrl: n, labels: r, onClose: i, onSave: a }) {
	let o = (0, _.useRef)(null), s = (0, _.useRef)(null), c = {
		x: 0,
		y: 0,
		width: t.width,
		height: t.height
	}, l = (0, _.useRef)(c), u = (0, _.useRef)(null), d = (0, _.useRef)(1), f = (0, _.useRef)([]), p = (0, _.useRef)([]), [m, h] = (0, _.useState)(c), [g, v] = (0, _.useState)([]), [y, b] = (0, _.useState)([]), [x, S] = (0, _.useState)("free"), [C, w] = (0, _.useState)(1), [T, E] = (0, _.useState)(!1), [D, O] = (0, _.useState)("copy"), ee = e.name.lastIndexOf("."), te = ee > 0 ? `${e.name.slice(0, ee)}-edited${e.name.slice(ee)}` : `${e.name}-edited`, [A, ne] = (0, _.useState)(te), [M, N] = (0, _.useState)(!1), P = (e = x) => e === "original" ? t.width / t.height : e === "1:1" ? 1 : e === "4:3" ? 4 / 3 : e === "16:9" ? 16 / 9 : NaN, ie = (e) => ae(e, t), F = (e) => {
		l.current = e, h(e);
	}, I = (e) => {
		f.current = e, v(e);
	}, se = (e) => {
		p.current = e, b(e);
	}, ce = (e, t) => {
		oe(e, t) || (I([...f.current.slice(-39), e]), se([]));
	}, le = (e, n = !0) => {
		let r = ae(e, t);
		n && ce(l.current, r), s.current?.setData(r), F(r);
	};
	(0, _.useEffect)(() => {
		let e = o.current;
		if (!e) return;
		let t = new re.default(e, {
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
				s.current = t;
				let n = t.getImageData();
				d.current = n.naturalWidth > 0 ? n.width / n.naturalWidth : 1, F(ie(t.getData(!0)));
			},
			crop: (e) => F(ie(e.detail)),
			cropstart: () => {
				u.current = l.current;
			},
			cropend: (e) => {
				let t = e.currentTarget.cropper, n = ie(t.getData(!0));
				u.current && ce(u.current, n), u.current = null, F(n);
			}
		});
		return s.current = t, () => {
			t.destroy(), s.current = null;
		};
	}, [
		n,
		t.height,
		t.width
	]);
	let ue = (e) => {
		let t = s.current;
		if (S(e), !t) return;
		let n = l.current;
		t.setAspectRatio(P(e));
		let r = ie(t.getData(!0));
		ce(n, r), F(r);
	}, de = () => {
		let e = f.current, t = e.at(-1);
		t && (I(e.slice(0, -1)), se([l.current, ...p.current]), s.current?.setData(t), F(t));
	}, fe = () => {
		let [e, ...t] = p.current;
		e && (se(t), I([...f.current, l.current]), s.current?.setData(e), F(e));
	}, pe = () => {
		let e = s.current;
		if (!e) return;
		let t = l.current;
		e.reset().setAspectRatio(P());
		let n = e.getImageData();
		d.current = n.naturalWidth > 0 ? n.width / n.naturalWidth : 1, w(1);
		let r = ie(e.getData(!0));
		ce(t, r), F(r);
	}, me = async () => {
		let e = s.current ? ie(s.current.getData(!0)) : l.current;
		N(!0);
		try {
			await a([{
				type: "crop",
				...e
			}], {
				mode: D,
				...D === "copy" ? { name: A } : {}
			});
		} finally {
			N(!1);
		}
	};
	return /* @__PURE__ */ (0, k.jsxs)(j, {
		title: `${r.crop}: ${e.name}`,
		closeLabel: r.close,
		onClose: i,
		className: "sf-image-editor",
		footer: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
			/* @__PURE__ */ (0, k.jsxs)("span", { children: [
				m.width,
				" × ",
				m.height,
				" px"
			] }),
			/* @__PURE__ */ (0, k.jsx)("button", {
				onClick: i,
				children: r.cancel
			}),
			/* @__PURE__ */ (0, k.jsx)("button", {
				className: "primary",
				disabled: M || D === "copy" && A.trim() === "",
				onClick: () => void me(),
				children: M ? r.saving : r.save
			})
		] }),
		children: [
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "sf-editor-toolbar",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("select", {
						"aria-label": r.ratio,
						value: x,
						onChange: (e) => ue(e.target.value),
						children: [
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "free",
								children: r.free
							}),
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "original",
								children: r.original
							}),
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "1:1",
								children: "1:1"
							}),
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "4:3",
								children: "4:3"
							}),
							/* @__PURE__ */ (0, k.jsx)("option", {
								value: "16:9",
								children: "16:9"
							})
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("label", { children: [r.zoom, /* @__PURE__ */ (0, k.jsx)("input", {
						type: "range",
						min: "1",
						max: "3",
						step: "0.05",
						value: C,
						onChange: (e) => {
							let t = Number(e.target.value);
							w(t), s.current?.zoomTo(d.current * t);
						}
					})] }),
					/* @__PURE__ */ (0, k.jsx)("button", {
						disabled: g.length === 0,
						onClick: de,
						children: r.undo
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						disabled: y.length === 0,
						onClick: fe,
						children: r.redo
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						onClick: pe,
						children: r.reset
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						onPointerDown: () => E(!0),
						onPointerUp: () => E(!1),
						onPointerLeave: () => E(!1),
						children: r.compare
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: `sf-editor-canvas${T ? " sf-editor-comparing" : ""}`,
				tabIndex: 0,
				onKeyDown: (e) => {
					let t = e.shiftKey ? 10 : 1, n = e.key === "ArrowLeft" ? [-t, 0] : e.key === "ArrowRight" ? [t, 0] : e.key === "ArrowUp" ? [0, -t] : e.key === "ArrowDown" ? [0, t] : null;
					n && (e.preventDefault(), le({
						...l.current,
						x: l.current.x + n[0],
						y: l.current.y + n[1]
					})), (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && (e.preventDefault(), e.shiftKey ? fe() : de());
				},
				children: /* @__PURE__ */ (0, k.jsx)("img", {
					ref: o,
					src: n,
					alt: ""
				})
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "sf-editor-fields",
				children: [
					[
						"x",
						"y",
						"width",
						"height"
					].map((e) => /* @__PURE__ */ (0, k.jsxs)("label", { children: [r[e] || e, /* @__PURE__ */ (0, k.jsx)("input", {
						type: "number",
						min: +(e === "width" || e === "height"),
						value: m[e],
						onChange: (t) => le({
							...l.current,
							[e]: Number(t.target.value)
						})
					})] }, e)),
					/* @__PURE__ */ (0, k.jsxs)("label", { children: [r.saveMode, /* @__PURE__ */ (0, k.jsxs)("select", {
						value: D,
						onChange: (e) => O(e.target.value),
						children: [/* @__PURE__ */ (0, k.jsx)("option", {
							value: "copy",
							children: r.saveCopy
						}), /* @__PURE__ */ (0, k.jsx)("option", {
							value: "overwrite",
							children: r.overwrite
						})]
					})] }),
					D === "copy" && /* @__PURE__ */ (0, k.jsxs)("label", { children: [r.fileName, /* @__PURE__ */ (0, k.jsx)("input", {
						value: A,
						onChange: (e) => ne(e.target.value)
					})] }),
					D === "overwrite" && /* @__PURE__ */ (0, k.jsx)("p", {
						className: "sf-warning",
						role: "alert",
						children: r.overwriteWarning
					}),
					/* @__PURE__ */ (0, k.jsx)("small", { children: r.panHint })
				]
			})
		]
	});
}
//#endregion
//#region src/components/TrashDialog.tsx
function I({ api: e, resource: t, locale: n, labels: r, onClose: i, onChanged: a }) {
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
	return /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsxs)(j, {
		title: r.title,
		closeLabel: r.close,
		onClose: i,
		className: "sf-trash-modal",
		footer: /* @__PURE__ */ (0, k.jsx)("button", {
			className: "primary",
			onClick: i,
			children: r.close
		}),
		children: [
			m && /* @__PURE__ */ (0, k.jsx)("div", {
				className: "sf-notice",
				role: "alert",
				children: m
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "sf-trash-usage",
				children: [/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: r.usage }), /* @__PURE__ */ (0, k.jsxs)("span", { children: [
					C(o.usedBytes),
					" / ",
					C(o.maxBytes),
					" · ",
					o.usedItems,
					" / ",
					o.maxItems,
					" ",
					r.items
				] })] }), /* @__PURE__ */ (0, k.jsx)("progress", {
					max: Math.max(1, o.maxBytes),
					value: Math.min(o.usedBytes, o.maxBytes)
				})]
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "sf-trash-search",
				children: [
					/* @__PURE__ */ (0, k.jsx)(A, { name: "search" }),
					/* @__PURE__ */ (0, k.jsx)("input", {
						value: u,
						onChange: (e) => {
							d(e.target.value), l(0);
						},
						placeholder: r.search,
						"aria-label": r.search
					}),
					u && /* @__PURE__ */ (0, k.jsx)("button", {
						onClick: () => d(""),
						"aria-label": r.close,
						children: /* @__PURE__ */ (0, k.jsx)(A, { name: "close" })
					})
				]
			}),
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: "sf-trash-list",
				children: f ? /* @__PURE__ */ (0, k.jsx)("p", { children: "…" }) : o.items.length === 0 ? /* @__PURE__ */ (0, k.jsx)("p", { children: r.empty }) : o.items.map((e) => /* @__PURE__ */ (0, k.jsxs)("article", { children: [
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [
						/* @__PURE__ */ (0, k.jsx)("strong", { children: e.path.split("/").pop() }),
						/* @__PURE__ */ (0, k.jsx)("small", {
							title: e.path,
							children: e.path
						}),
						/* @__PURE__ */ (0, k.jsxs)("small", { children: [
							e.directory ? r.items : C(e.size),
							" · ",
							r.expires,
							": ",
							new Intl.DateTimeFormat(n, { dateStyle: "medium" }).format(e.expiresAt * 1e3)
						] })
					] }),
					/* @__PURE__ */ (0, k.jsx)("button", {
						onClick: () => void b(e),
						children: r.restore
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						className: "danger",
						onClick: () => void S(e),
						children: r.permanentDelete
					})
				] }, e.id))
			}),
			o.total > o.limit && /* @__PURE__ */ (0, k.jsxs)("nav", {
				className: "sf-trash-pagination",
				"aria-label": r.title,
				children: [
					/* @__PURE__ */ (0, k.jsxs)("button", {
						disabled: o.offset === 0 || f,
						onClick: () => l(Math.max(0, o.offset - o.limit)),
						children: [
							/* @__PURE__ */ (0, k.jsx)(A, { name: "chevron-left" }),
							" ",
							r.previous
						]
					}),
					/* @__PURE__ */ (0, k.jsxs)("span", { children: [
						w,
						"–",
						T,
						" / ",
						o.total
					] }),
					/* @__PURE__ */ (0, k.jsxs)("button", {
						disabled: o.offset + o.limit >= o.total || f,
						onClick: () => l(o.offset + o.limit),
						children: [
							r.next,
							" ",
							/* @__PURE__ */ (0, k.jsx)(A, { name: "chevron-right" })
						]
					})
				]
			})
		]
	}), g && /* @__PURE__ */ (0, k.jsx)(j, {
		title: r.conflict,
		closeLabel: r.close,
		onClose: () => v(null),
		className: "sf-confirm-modal",
		footer: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
			/* @__PURE__ */ (0, k.jsx)("button", {
				onClick: () => v(null),
				children: r.cancel
			}),
			/* @__PURE__ */ (0, k.jsx)("button", {
				onClick: () => void x("rename"),
				children: r.autoRename
			}),
			/* @__PURE__ */ (0, k.jsx)("button", {
				className: "danger",
				onClick: () => void x("overwrite"),
				children: r.overwrite
			})
		] }),
		children: /* @__PURE__ */ (0, k.jsx)("div", {
			className: "sf-form-body",
			children: /* @__PURE__ */ (0, k.jsx)("p", { children: g.path })
		})
	})] });
}
//#endregion
//#region src/components/TagsDialog.tsx
function se({ initial: e, suggestions: t, labels: n, onSave: r, onClose: i }) {
	let [a, o] = (0, _.useState)(() => e.slice(0, 10)), [s, c] = (0, _.useState)(""), l = (0, _.useMemo)(() => new Set(a.map((e) => e.toLocaleLowerCase())), [a]), u = t.filter((e) => !l.has(e.toLocaleLowerCase()) && (s.trim() === "" || e.toLocaleLowerCase().includes(s.trim().toLocaleLowerCase()))).slice(0, 8), d = (e = s) => {
		let t = e.trim().replace(/^[,，]+|[,，]+$/gu, "");
		t === "" || Array.from(t).length > 30 || a.length >= 10 || l.has(t.toLocaleLowerCase()) || (o((e) => [...e, t]), c(""));
	}, f = (e) => o((t) => t.filter((t) => t !== e));
	return /* @__PURE__ */ (0, k.jsx)(j, {
		title: n.title,
		closeLabel: n.close,
		onClose: i,
		className: "sf-tags-modal",
		footer: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
			/* @__PURE__ */ (0, k.jsxs)("span", { children: [a.length, " / 10"] }),
			/* @__PURE__ */ (0, k.jsx)("button", {
				onClick: i,
				children: n.cancel
			}),
			/* @__PURE__ */ (0, k.jsx)("button", {
				className: "primary",
				onClick: () => r(a),
				children: n.save
			})
		] }),
		children: /* @__PURE__ */ (0, k.jsxs)("div", {
			className: "sf-tags-editor",
			children: [
				/* @__PURE__ */ (0, k.jsxs)("div", {
					className: "sf-tags-input",
					onClick: (e) => e.currentTarget.querySelector("input")?.focus(),
					children: [a.map((e) => /* @__PURE__ */ (0, k.jsxs)("span", { children: [e, /* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						onClick: () => f(e),
						"aria-label": `${n.close}: ${e}`,
						children: /* @__PURE__ */ (0, k.jsx)(A, { name: "close" })
					})] }, e)), /* @__PURE__ */ (0, k.jsx)("input", {
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
				u.length > 0 && /* @__PURE__ */ (0, k.jsx)("div", {
					className: "sf-tag-suggestions",
					children: u.map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
						type: "button",
						onMouseDown: (e) => e.preventDefault(),
						onClick: () => d(e),
						children: [
							/* @__PURE__ */ (0, k.jsx)(A, { name: "add" }),
							" ",
							e
						]
					}, e))
				}),
				/* @__PURE__ */ (0, k.jsxs)("small", { children: [
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
function ce({ url: e, loginRequired: t, labels: n, onClose: r }) {
	let i = (0, _.useRef)(null), [a, o] = (0, _.useState)("");
	(0, _.useEffect)(() => i.current?.select(), []);
	let s = async () => {
		i.current?.focus(), i.current?.select();
		try {
			await navigator.clipboard.writeText(e), o("copied");
		} catch {
			o("failed");
		}
	};
	return /* @__PURE__ */ (0, k.jsx)(j, {
		title: n.title,
		closeLabel: n.close,
		onClose: r,
		className: "sf-url-modal",
		footer: /* @__PURE__ */ (0, k.jsx)("button", {
			className: "primary",
			onClick: r,
			children: n.close
		}),
		children: /* @__PURE__ */ (0, k.jsxs)("div", {
			className: "sf-url-dialog-body",
			children: [
				/* @__PURE__ */ (0, k.jsx)("p", { children: n.hint }),
				/* @__PURE__ */ (0, k.jsx)("input", {
					ref: i,
					autoFocus: !0,
					readOnly: !0,
					value: e,
					"aria-label": n.title,
					onFocus: (e) => e.currentTarget.select(),
					onClick: () => void s()
				}),
				t && /* @__PURE__ */ (0, k.jsx)("small", { children: n.loginRequired }),
				/* @__PURE__ */ (0, k.jsx)("span", {
					role: "status",
					"aria-live": "polite",
					children: a === "copied" ? n.copied : a === "failed" ? n.failed : ""
				})
			]
		})
	});
}
//#endregion
//#region src/components/EntryVisuals.tsx
var le = ({ kind: e }) => e === "folder" ? /* @__PURE__ */ (0, k.jsxs)("svg", {
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, k.jsx)("path", {
		d: "M5 12h15l4 5h19v23H5z",
		fill: "currentColor",
		opacity: ".2"
	}), /* @__PURE__ */ (0, k.jsx)("path", {
		d: "M5 12h15l4 5h19v23H5z",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	})]
}) : e === "image" ? /* @__PURE__ */ (0, k.jsxs)("svg", {
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ (0, k.jsx)("rect", {
			x: "7",
			y: "5",
			width: "34",
			height: "38",
			rx: "4",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5"
		}),
		/* @__PURE__ */ (0, k.jsx)("circle", {
			cx: "17",
			cy: "16",
			r: "4",
			fill: "currentColor",
			opacity: ".35"
		}),
		/* @__PURE__ */ (0, k.jsx)("path", {
			d: "m10 37 10-11 7 7 5-5 7 9",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5",
			strokeLinejoin: "round"
		})
	]
}) : /* @__PURE__ */ (0, k.jsxs)("svg", {
	viewBox: "0 0 48 48",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ (0, k.jsx)("path", {
		d: "M10 5h19l9 9v29H10z",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}), /* @__PURE__ */ (0, k.jsx)("path", {
		d: "M29 5v10h9",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2.5"
	})]
}), ue = () => /* @__PURE__ */ (0, k.jsx)("svg", {
	viewBox: "0 0 24 24",
	"aria-hidden": "true",
	children: /* @__PURE__ */ (0, k.jsx)("path", {
		d: "M9.5 14.5 14.5 9M7.8 17.2l-1.1 1.1a3.5 3.5 0 0 1-5-5l3.6-3.6a3.5 3.5 0 0 1 5 0M16.2 6.8l1.1-1.1a3.5 3.5 0 1 1 5 5l-3.6 3.6a3.5 3.5 0 0 1-5 0",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round"
	})
}), de = ({ src: e, alt: t, lazy: n = !1 }) => {
	let [r, i] = (0, _.useState)(0), [a, o] = (0, _.useState)(!1), s = (0, _.useRef)(null);
	if ((0, _.useEffect)(() => (i(0), o(!1), () => {
		s.current !== null && window.clearTimeout(s.current);
	}), [e]), a) return /* @__PURE__ */ (0, k.jsx)(le, { kind: "image" });
	let c = r === 0 ? e : `${e}${e.includes("?") ? "&" : "?"}retry=${r}`;
	return /* @__PURE__ */ (0, k.jsx)("img", {
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
}, fe = (e) => e < 1024 ? `${e} B` : e < 1024 ** 2 ? `${(e / 1024).toFixed(1)} KB` : `${(e / 1024 ** 2).toFixed(1)} MB`, pe = (e) => Array.from(e).length;
//#endregion
//#region src/components/UploadQueue.tsx
function me({ tasks: e, collapsed: t, labels: n, onToggle: r, onCancel: i, onCancelAll: a, onClearFinished: o, onRemove: s }) {
	if (e.length === 0) return null;
	let c = e.some((e) => e.status === "queued" || e.status === "uploading"), l = e.filter((e) => e.status !== "queued" && e.status !== "uploading").length;
	return /* @__PURE__ */ (0, k.jsxs)("section", {
		className: `sf-upload-panel${t ? " collapsed" : ""}`,
		"aria-label": n.title,
		children: [/* @__PURE__ */ (0, k.jsxs)("header", { children: [
			/* @__PURE__ */ (0, k.jsx)("button", {
				className: "sf-upload-collapse",
				onClick: r,
				"aria-expanded": !t,
				title: t ? n.expand : n.collapse,
				children: /* @__PURE__ */ (0, k.jsx)(A, { name: t ? "chevron-right" : "chevron-down" })
			}),
			/* @__PURE__ */ (0, k.jsx)("strong", { children: n.title }),
			/* @__PURE__ */ (0, k.jsxs)("span", { children: [
				l,
				"/",
				e.length
			] }),
			/* @__PURE__ */ (0, k.jsx)("button", {
				onClick: a,
				disabled: !c,
				children: n.cancelAll
			}),
			/* @__PURE__ */ (0, k.jsx)("button", {
				onClick: o,
				children: n.clearFinished
			})
		] }), !t && /* @__PURE__ */ (0, k.jsx)("div", {
			className: "sf-upload-list",
			children: e.map((e) => /* @__PURE__ */ (0, k.jsxs)("div", {
				className: `sf-upload-task ${e.status}`,
				children: [
					/* @__PURE__ */ (0, k.jsx)("span", {
						className: "sf-upload-name",
						title: e.name,
						children: e.name
					}),
					/* @__PURE__ */ (0, k.jsx)("progress", {
						max: "100",
						value: e.progress,
						"aria-label": `${e.name}: ${e.progress}%`
					}),
					/* @__PURE__ */ (0, k.jsx)("span", { children: e.status === "uploading" ? `${e.progress}%` : n.status(e.status) }),
					(e.status === "queued" || e.status === "uploading") && /* @__PURE__ */ (0, k.jsx)("button", {
						onClick: () => i(e.id),
						children: n.cancel
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						className: "sf-upload-remove",
						onClick: () => s(e.id),
						title: n.remove,
						"aria-label": `${n.remove}: ${e.name}`,
						children: /* @__PURE__ */ (0, k.jsx)(A, { name: "close" })
					}),
					e.message && /* @__PURE__ */ (0, k.jsx)("small", {
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
function he({ api: e, resource: t, selectedEntries: n, selected: r, imageInfo: i, metadata: a, showTags: o, previewImage: s, selectMode: c, selectAllowed: l, labels: u, formatDate: d, onChoose: f, onOpenUrl: p }) {
	return /* @__PURE__ */ (0, k.jsxs)("aside", {
		className: "sf-details",
		children: [/* @__PURE__ */ (0, k.jsx)("h2", { children: u.details }), n.length > 1 ? /* @__PURE__ */ (0, k.jsxs)("div", {
			className: "sf-state",
			children: [
				n.length,
				" ",
				u.selected
			]
		}) : r ? /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: "sf-preview",
				children: s ? /* @__PURE__ */ (0, k.jsx)(de, {
					src: e.thumbnailUrl(t, r, 800, 600),
					alt: r.name
				}) : /* @__PURE__ */ (0, k.jsx)(le, { kind: r.directory ? "folder" : "file" })
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: r.name }),
			/* @__PURE__ */ (0, k.jsxs)("dl", { children: [
				/* @__PURE__ */ (0, k.jsx)("dt", { children: u.type }),
				/* @__PURE__ */ (0, k.jsx)("dd", { children: r.directory ? u.folder : r.mimeType || u.file }),
				/* @__PURE__ */ (0, k.jsx)("dt", { children: u.size }),
				/* @__PURE__ */ (0, k.jsx)("dd", { children: r.directory ? "—" : fe(r.size) }),
				i && /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("dt", { children: u.dimensions }), /* @__PURE__ */ (0, k.jsxs)("dd", { children: [
					i.width,
					" × ",
					i.height,
					" px"
				] })] }),
				/* @__PURE__ */ (0, k.jsx)("dt", { children: u.modified }),
				/* @__PURE__ */ (0, k.jsx)("dd", { children: /* @__PURE__ */ (0, k.jsx)("time", {
					dateTime: (/* @__PURE__ */ new Date(r.modifiedAt * 1e3)).toISOString(),
					children: d(r.modifiedAt)
				}) }),
				/* @__PURE__ */ (0, k.jsx)("dt", { children: u.location }),
				/* @__PURE__ */ (0, k.jsx)("dd", { children: r.path })
			] }),
			o && (a.tags[r.path] || []).length > 0 && /* @__PURE__ */ (0, k.jsx)("div", {
				className: "sf-tags",
				children: a.tags[r.path].map((e) => /* @__PURE__ */ (0, k.jsx)("span", { children: e }, e))
			}),
			c && !r.directory && r.url && /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("button", {
				className: "sf-select primary",
				disabled: !l,
				onClick: f,
				children: u.select
			}), !l && /* @__PURE__ */ (0, k.jsx)("p", {
				className: "sf-warning",
				role: "status",
				children: u.unsupportedWebImage
			})] }),
			!r.directory && /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "sf-detail-actions",
				children: [/* @__PURE__ */ (0, k.jsx)("a", {
					className: "sf-download",
					href: e.downloadUrl(t, r.path),
					children: u.download
				}), /* @__PURE__ */ (0, k.jsx)("button", {
					type: "button",
					className: "sf-icon-button",
					onClick: () => p(r),
					title: u.copyUrl,
					"aria-label": u.copyUrl,
					children: /* @__PURE__ */ (0, k.jsx)(ue, {})
				})]
			})
		] }) : /* @__PURE__ */ (0, k.jsx)("div", {
			className: "sf-state",
			children: "—"
		})]
	});
}
//#endregion
//#region src/components/SettingsDialog.tsx
function ge({ resource: e, tools: t, features: n, scale: r, translate: i, onToolChange: a, onFeatureChange: o, onScaleChange: s, onClose: c }) {
	let l = i;
	return /* @__PURE__ */ (0, k.jsxs)(j, {
		title: l("settings"),
		closeLabel: l("close"),
		onClose: c,
		className: "sf-settings-modal",
		footer: /* @__PURE__ */ (0, k.jsx)("button", {
			className: "primary",
			onClick: c,
			children: l("done")
		}),
		children: [
			/* @__PURE__ */ (0, k.jsx)("p", { children: l("toolSettingsHint") }),
			e && /* @__PURE__ */ (0, k.jsxs)("p", {
				className: "sf-configured-limits",
				children: [
					l("configuredLimits"),
					": ",
					l("fileName"),
					" ",
					e.maxFileNameLength,
					" · ",
					l("folderName"),
					" ",
					e.maxFolderNameLength,
					" · ",
					l("folderDepth"),
					" ",
					e.maxFolderDepth
				]
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: l("interfaceScale") }),
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: "sf-scale-options",
				role: "radiogroup",
				"aria-label": l("interfaceScale"),
				children: [
					"compact",
					"standard",
					"large",
					"xlarge"
				].map((e) => /* @__PURE__ */ (0, k.jsxs)("label", { children: [/* @__PURE__ */ (0, k.jsx)("input", {
					type: "radio",
					name: "sofinder-scale",
					value: e,
					checked: r === e,
					onChange: () => s(e)
				}), /* @__PURE__ */ (0, k.jsx)("span", { children: l(e === "compact" ? "scaleCompact" : e === "standard" ? "scaleStandard" : e === "large" ? "scaleLarge" : "scaleExtraLarge") })] }, e))
			}),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: l("imageTools") }),
			[
				"resize",
				"crop",
				"rotate",
				"presets"
			].map((e) => /* @__PURE__ */ (0, k.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, k.jsx)("input", {
					type: "checkbox",
					checked: t[e],
					onChange: (t) => a(e, t.target.checked)
				}), /* @__PURE__ */ (0, k.jsx)("span", { children: l(e === "presets" ? "preset" : e === "rotate" ? "rotationTools" : e) })]
			}, e)),
			/* @__PURE__ */ (0, k.jsx)("h3", { children: l("optionalFeatures") }),
			/* @__PURE__ */ (0, k.jsx)("p", { children: l("featureSettingsHint") }),
			[
				"autoCollapseUploads",
				"folderTree",
				"recent",
				"favorites",
				"tags",
				"archive",
				"trash"
			].map((t) => /* @__PURE__ */ (0, k.jsxs)("label", {
				className: "sf-setting",
				children: [/* @__PURE__ */ (0, k.jsx)("input", {
					type: "checkbox",
					checked: n[t],
					disabled: t === "trash" && e?.storageCapabilities?.recoverableDelete === !1,
					onChange: (e) => o(t, e.target.checked)
				}), /* @__PURE__ */ (0, k.jsx)("span", { children: l(t === "folderTree" ? "folderTreeFeature" : t === "favorites" ? "favoriteFeature" : t === "archive" ? "archiveFeature" : t === "trash" ? "trashFeature" : t === "tags" ? "tagsFeature" : t === "recent" ? "recentFeature" : "autoCollapseUploads") })]
			}, t))
		]
	});
}
//#endregion
//#region src/components/DestinationDialog.tsx
function _e({ state: e, unsafe: t, translate: n, onBrowse: r, onConfirm: i, onClose: a }) {
	let o = n, s = e.path ? e.path.split("/") : [];
	return /* @__PURE__ */ (0, k.jsxs)(j, {
		title: e.operation === "move" ? o("moveDestination") : o("copyDestination"),
		closeLabel: o("close"),
		onClose: a,
		className: "sf-folder-modal",
		footer: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
			/* @__PURE__ */ (0, k.jsxs)("span", { children: [
				o("currentFolder"),
				": /",
				e.path
			] }),
			/* @__PURE__ */ (0, k.jsx)("button", {
				onClick: a,
				children: o("cancel")
			}),
			/* @__PURE__ */ (0, k.jsx)("button", {
				className: "primary",
				disabled: e.loading || t,
				onClick: () => i(e.operation, e.path),
				children: e.operation === "move" ? o("moveHere") : o("copyHere")
			})
		] }),
		children: [
			/* @__PURE__ */ (0, k.jsxs)("nav", {
				className: "sf-folder-crumbs",
				"aria-label": o("chooseFolder"),
				children: [/* @__PURE__ */ (0, k.jsx)("button", {
					onClick: () => r(e.operation, ""),
					children: o("rootFolder")
				}), s.map((t, n) => /* @__PURE__ */ (0, k.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, k.jsx)("button", {
					onClick: () => r(e.operation, s.slice(0, n + 1).join("/")),
					children: t
				})] }, `${t}-${n}`))]
			}),
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: "sf-folder-list",
				children: e.loading ? /* @__PURE__ */ (0, k.jsx)("div", {
					className: "sf-state",
					children: o("loading")
				}) : e.folders.length === 0 ? /* @__PURE__ */ (0, k.jsx)("div", {
					className: "sf-state",
					children: o("noFolders")
				}) : e.folders.map((t) => /* @__PURE__ */ (0, k.jsxs)("button", {
					onDoubleClick: () => r(e.operation, t.path),
					onClick: () => r(e.operation, t.path),
					children: [
						/* @__PURE__ */ (0, k.jsx)("span", {
							className: "sf-folder-small",
							children: /* @__PURE__ */ (0, k.jsx)(le, { kind: "folder" })
						}),
						t.name,
						/* @__PURE__ */ (0, k.jsx)("span", { children: "›" })
					]
				}, t.path))
			}),
			t && /* @__PURE__ */ (0, k.jsx)("p", {
				className: "sf-warning",
				role: "alert",
				children: o("unsafeDestination")
			})
		]
	});
}
//#endregion
//#region src/App.tsx
var ve = {
	resize: !1,
	crop: !1,
	rotate: !1,
	presets: !1
}, ye = {
	recent: !1,
	favorites: !1,
	tags: !1,
	archive: !1,
	trash: !0,
	folderTree: !1,
	autoCollapseUploads: !0
}, be = (e, t) => {
	try {
		let n = JSON.parse(localStorage.getItem(e) || "{}");
		return Object.fromEntries(Object.entries(t).map(([e, t]) => [e, typeof n[e] == "boolean" ? n[e] : t]));
	} catch {
		return t;
	}
}, xe = () => be("sofinder.imageTools.v2", ve), Se = (e) => {
	let t = localStorage.getItem("sofinder.uiScale.v1");
	return t === "compact" || t === "standard" || t === "large" || t === "xlarge" ? t : e;
}, Ce = {
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
}, we = (e) => {
	let t = Ce[e], n = localStorage.getItem(`sofinder.column.${e}`);
	if (n === null || n.trim() === "") return t.initial;
	let r = Number(n);
	return Number.isFinite(r) ? Math.max(t.min, Math.min(t.max, r)) : t.initial;
};
function Te({ config: e }) {
	let t = (0, _.useMemo)(() => new w(e), [e]), [n, r] = (0, _.useState)(() => {
		let t = localStorage.getItem("sofinder.language");
		return t === "en" || t === "zh-cn" || t === "zh-tw" ? t : e.language;
	}), i = (0, _.useMemo)(() => O(n), [n]), a = (0, _.useMemo)(() => new Intl.DateTimeFormat(n, {
		dateStyle: "medium",
		timeStyle: "short"
	}), [n]), [o, s] = (0, _.useState)([]), [c, l] = (0, _.useState)(e.resource), [u, d] = (0, _.useState)(""), [f, p] = (0, _.useState)([]), [m, h] = (0, _.useState)(() => /* @__PURE__ */ new Set()), [g, v] = (0, _.useState)(null), [y, b] = (0, _.useState)(""), [x, S] = (0, _.useState)("name"), [T, E] = (0, _.useState)("name"), [D, ee] = (0, _.useState)("asc"), [te, re] = (0, _.useState)(0), [ie, ae] = (0, _.useState)(0), [oe, ve] = (0, _.useState)(null), [Te, Ee] = (0, _.useState)(null), [De, Oe] = (0, _.useState)([]), [ke, Ae] = (0, _.useState)(() => localStorage.getItem("sofinder.view") === "list" ? "list" : "grid"), [je, L] = (0, _.useState)(!0), [Me, Ne] = (0, _.useState)(""), [Pe, Fe] = (0, _.useState)([]), [Ie, Le] = (0, _.useState)(!1), [Re, ze] = (0, _.useState)({
		favorites: [],
		tags: {},
		recent: []
	}), [Be, R] = (0, _.useState)(null), [Ve, He] = (0, _.useState)(xe), [z, Ue] = (0, _.useState)(() => be("sofinder.features.v2", {
		...ye,
		folderTree: e.featureDefaults?.folderTree ?? !1
	})), [We, Ge] = (0, _.useState)(!1), [Ke, qe] = (0, _.useState)(!1), [Je, Ye] = (0, _.useState)(() => Se(e.uiDefaults?.scale ?? "standard")), [Xe, Ze] = (0, _.useState)(null), [Qe, $e] = (0, _.useState)(!1), [et, tt] = (0, _.useState)(null), [nt, rt] = (0, _.useState)(null), [it, at] = (0, _.useState)(!1), [ot, st] = (0, _.useState)(!1), [ct, lt] = (0, _.useState)(null), [ut, dt] = (0, _.useState)(null), [ft, pt] = (0, _.useState)(null), [mt, ht] = (0, _.useState)({}), [gt, _t] = (0, _.useState)({
		driver: "",
		formats: []
	}), [vt, yt] = (0, _.useState)({}), [bt, xt] = (0, _.useState)(() => we("left")), [St, Ct] = (0, _.useState)(() => we("right")), wt = (0, _.useRef)(null), Tt = (0, _.useRef)(/* @__PURE__ */ new Map()), Et = (0, _.useRef)(0), Dt = (0, _.useRef)(null), Ot = (0, _.useRef)(null), kt = (0, _.useRef)(null), At = (0, _.useRef)(!1);
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
	}, [e.theme]), (0, _.useEffect)(() => (document.documentElement.dataset.sofinderScale = Je, localStorage.setItem("sofinder.uiScale.v1", Je), () => {
		delete document.documentElement.dataset.sofinderScale;
	}), [Je]), (0, _.useEffect)(() => {
		localStorage.setItem("sofinder.language", n), document.documentElement.lang = n === "zh-cn" ? "zh-CN" : n === "zh-tw" ? "zh-TW" : "en";
	}, [n]);
	let jt = (0, _.useCallback)((e) => Ne(e instanceof Error ? e.message : i("error")), [i]), Mt = (0, _.useCallback)((e) => new Promise((t) => {
		Dt.current?.(!1), Dt.current = t, rt(e);
	}), []), Nt = (e) => {
		let t = Dt.current;
		Dt.current = null, rt(null), t?.(e);
	}, Pt = (0, _.useCallback)(async (e = c, n = u, r = y, i = te, a = T, o = D, s = x, l = oe) => {
		if (e) {
			L(!0), Ne("");
			try {
				let c = await t.list(e, n, r, a, o, i, 100, s, l);
				p(c.entries), d(c.path), re(c.offset), ae(c.total), ve(l), Ee(c.nextCursor ?? null), yt(c.capabilities || {}), h(/* @__PURE__ */ new Set()), v(null);
			} catch (e) {
				jt(e);
			} finally {
				L(!1);
			}
		}
	}, [
		t,
		D,
		te,
		oe,
		u,
		jt,
		c,
		y,
		x,
		T
	]);
	(0, _.useEffect)(() => {
		t.configData().then(({ resources: t, imagePresets: n, imageCapabilities: r }) => {
			s(t), ht(n || {}), _t(r || {
				driver: "",
				formats: []
			});
			let i = t.some((t) => t.name === e.resource) ? e.resource : t[0]?.name || "";
			l(i), i && (Oe([]), Pt(i, "", "", 0, T, D, "name", null));
		}).catch(jt);
	}, [t, e.resource]), (0, _.useEffect)(() => {
		let e = t.pendingUploads().map((e) => ({
			id: `pending-${e.id}`,
			name: e.name,
			progress: 0,
			status: "error",
			message: i("uploadReselectToResume")
		}));
		e.length > 0 && (Fe((t) => [...t.filter((e) => !e.id.startsWith("pending-")), ...e]), Le(!1));
	}, [t, i]), (0, _.useEffect)(() => {
		if (!At.current) {
			At.current = !0;
			return;
		}
		let e = window.setTimeout(() => {
			c && (Oe([]), Pt(c, u, y, 0, T, D, x, null));
		}, 250);
		return () => window.clearTimeout(e);
	}, [y, x]), (0, _.useEffect)(() => {
		if (c) {
			if (!z.recent && !z.favorites && !z.tags) {
				ze({
					favorites: [],
					tags: {},
					recent: []
				});
				return;
			}
			t.metadata(c).then(ze).catch(jt);
		}
	}, [
		t,
		z.favorites,
		z.recent,
		z.tags,
		jt,
		c
	]), (0, _.useEffect)(() => {
		if (!z.autoCollapseUploads || Pe.length === 0 || Pe.some((e) => e.status === "queued" || e.status === "uploading")) return;
		let e = window.setTimeout(() => Le(!0), 1200);
		return () => window.clearTimeout(e);
	}, [z.autoCollapseUploads, Pe]), (0, _.useEffect)(() => {
		let e = (e) => {
			let t = Array.from(e.clipboardData?.files || []);
			Dn === "manager" && t.length > 0 && !B?.readOnly && vt.upload !== !1 && (e.preventDefault(), qt(t));
		};
		return window.addEventListener("paste", e), () => window.removeEventListener("paste", e);
	});
	let Ft = (0, _.useMemo)(() => u === "" ? [] : u.split("/"), [u]), B = o.find((e) => e.name === c), It = u === "" ? 0 : u.split("/").length, V = (0, _.useMemo)(() => f.filter((e) => m.has(e.path)), [f, m]), H = V.length === 1 ? V[0] : null, Lt = (e) => gt.formats.find((t) => e.mimeType !== null && t.mimes.includes(e.mimeType.toLowerCase())), Rt = (e) => !!(e && Lt(e)?.thumbnail), zt = (e) => !!(e && Lt(e)?.edit), Bt = (t) => !!(t && !t.directory && t.url && (e.selectionKind !== "image" || Lt(t)?.webEmbeddable)), Vt = (e) => {
		e.directory || pt({
			url: new URL(e.url || t.downloadUrl(c, e.path), document.baseURI).href,
			loginRequired: !e.url
		});
	}, Ht = (e) => V.length > 0 && V.every((t) => t.capabilities?.[e] !== !1);
	(0, _.useEffect)(() => {
		if (R(null), !H || !Lt(H)?.read) return;
		let e = !0;
		return t.imageInfo(c, H.path).then((t) => {
			e && R(t);
		}).catch((t) => {
			e && jt(t);
		}), () => {
			e = !1;
		};
	}, [
		t,
		c,
		H?.path,
		H?.mimeType,
		jt
	]);
	let Ut = (e, n) => {
		if (Dn === "picker") {
			h(/* @__PURE__ */ new Set([e.path])), v(e.path);
			return;
		}
		if (n.shiftKey && g) {
			let t = f.findIndex((e) => e.path === g), n = f.findIndex((t) => t.path === e.path);
			if (t >= 0 && n >= 0) {
				let [e, r] = t < n ? [t, n] : [n, t];
				h(new Set(f.slice(e, r + 1).map((e) => e.path)));
				return;
			}
		}
		n.ctrlKey || n.metaKey ? h((t) => {
			let n = new Set(t);
			return n.has(e.path) ? n.delete(e.path) : n.add(e.path), n;
		}) : h(/* @__PURE__ */ new Set([e.path])), v(e.path), z.recent && t.updateMetadata(c, e.path, "touch").then(ze).catch(() => void 0);
	}, Wt = (e) => {
		e.directory ? (Oe([]), Pt(c, e.path, y, 0, T, D, x, null)) : nn(e);
	}, Gt = async () => {
		B && tt({
			kind: "folder",
			title: i("newFolder"),
			label: i("folderName"),
			initial: "",
			maximum: B.maxFolderNameLength
		});
	}, Kt = (e, t) => {
		Fe((n) => n.map((n) => n.id === e ? {
			...n,
			...t
		} : n));
	}, qt = async (e, n = u) => {
		if (Dn !== "manager") return;
		let r = Array.from(e), a = B ? r.filter((e) => pe(e.name) <= B.maxFileNameLength) : r;
		a.length !== r.length && B && Ne(`${i("fileNameTooLong")} ${B.maxFileNameLength}`);
		let o = a.map((e) => {
			let r = `${Date.now()}-${++Et.current}`, i = new AbortController();
			Tt.current.set(r, i);
			let a = t.findPendingUpload(c, n, e, !1);
			return {
				id: r,
				file: e,
				controller: i,
				pendingId: a ? `pending-${a.id}` : null
			};
		});
		if (o.length === 0) return;
		Le(!1);
		let s = new Set(o.map((e) => e.pendingId).filter((e) => e !== null));
		Fe((e) => [...e.filter((e) => !s.has(e.id)), ...o.map(({ id: e, file: t, pendingId: n }) => ({
			id: e,
			name: t.name,
			progress: 0,
			status: "queued",
			message: n ? i("uploadResuming") : void 0
		}))]);
		let l = 0, d = async () => {
			for (; l < o.length;) {
				let e = o[l++];
				if (e.controller.signal.aborted) {
					Tt.current.delete(e.id);
					continue;
				}
				Kt(e.id, {
					status: "uploading",
					progress: 0,
					message: void 0
				});
				let r = !1;
				try {
					for (;;) try {
						await t.upload(c, n, e.file, {
							overwrite: r,
							signal: e.controller.signal,
							onProgress: (t) => Kt(e.id, { progress: t })
						}), Kt(e.id, {
							status: "done",
							progress: 100
						});
						break;
					} catch (t) {
						if (t instanceof C && t.code === "conflict" && !r && await Mt({
							title: i("replaceFile"),
							message: e.file.name,
							detail: i("confirmImageOverwrite")
						})) {
							r = !0, Kt(e.id, { progress: 0 });
							continue;
						}
						throw t;
					}
				} catch (t) {
					t instanceof DOMException && t.name === "AbortError" ? Kt(e.id, {
						status: "cancelled",
						message: i("cancelled")
					}) : Kt(e.id, {
						status: "error",
						message: t instanceof Error ? t.message : i("error")
					});
				} finally {
					Tt.current.delete(e.id);
				}
			}
		};
		await Promise.all(Array.from({ length: Math.min(3, o.length) }, () => d())), await Pt();
	}, Jt = (e, t) => qt(t, e), Yt = (e) => {
		Tt.current.get(e)?.abort(), Kt(e, {
			status: "cancelled",
			message: i("cancelled")
		});
	}, Xt = () => {
		Tt.current.forEach((e) => e.abort()), Fe((e) => e.map((e) => e.status === "queued" || e.status === "uploading" ? {
			...e,
			status: "cancelled",
			message: i("cancelled")
		} : e));
	}, Zt = (e) => {
		Tt.current.get(e)?.abort(), Tt.current.delete(e), Fe((t) => t.filter((t) => t.id !== e));
	}, Qt = async () => {
		if (!H || !B) return;
		let e = H.directory ? -1 : H.name.lastIndexOf("."), t = e > 0 ? H.name.slice(e) : "", n = t ? H.name.slice(0, e) : H.name, r = H.directory ? B.maxFolderNameLength : B.maxFileNameLength;
		tt({
			kind: "rename",
			title: i("rename"),
			label: i(t ? "newBaseName" : "newName"),
			initial: n,
			maximum: r,
			extension: t
		});
	}, $t = async () => {
		if (!(V.length === 0 || !await Mt({
			title: i("remove"),
			message: V.length === 1 ? i("confirmDelete") : `${i("confirmDeleteMany")} ${V.length}`,
			detail: B?.storageCapabilities?.recoverableDelete === !1 ? i("permanentDeleteWarning") : i("trashRetention"),
			danger: !0
		}))) try {
			let e = await t.batch("delete", c, V.map((e) => e.path)), n = e.failed === 0 ? `${e.succeeded} ${i("completed")}` : `${e.succeeded} ${i("completed")}, ${e.failed} ${i("failed")}`;
			Ne(e.purgedItems > 0 ? `${n} · ${i("trashAutoPurged")} ${e.purgedItems} ${i("items")} (${fe(e.purgedBytes)})` : n), await Pt();
		} catch (e) {
			jt(e);
		}
	}, en = async (e, n) => {
		try {
			let r = await t.batch(e, c, V.map((e) => e.path), n);
			Ze(null), Ne(r.failed === 0 ? `${r.succeeded} ${i("completed")}` : `${r.succeeded} ${i("completed")}, ${r.failed} ${i("failed")}`), await Pt();
		} catch (e) {
			jt(e);
		}
	}, tn = async (e, n) => {
		Ze({
			operation: e,
			path: n,
			folders: [],
			loading: !0
		});
		try {
			let r = await t.list(c, n, "", "name", "asc", 0, 500);
			Ze({
				operation: e,
				path: r.path,
				folders: r.entries.filter((e) => e.directory),
				loading: !1
			});
		} catch (e) {
			Ze(null), jt(e);
		}
	}, nn = (t = H) => {
		if (!Bt(t)) {
			t && e.selectionKind === "image" && Ne(i("webImageUnsupported"));
			return;
		}
		if (t?.url) {
			if (e.ckeditorFunction > 0) {
				(window.opener || window.parent).CKEDITOR?.tools?.callFunction?.(e.ckeditorFunction, t.url), window.close();
				return;
			}
			window.dispatchEvent(new CustomEvent("sofinder:select", { detail: t }));
		}
	}, rn = () => {
		h((e) => e.size === f.length ? /* @__PURE__ */ new Set() : new Set(f.map((e) => e.path))), v(null);
	}, an = async (e, n = 0, r = 0) => {
		if (!(!H || !zt(H))) {
			L(!0);
			try {
				let a = e === 0 ? [{
					type: "resize",
					width: n,
					height: r
				}] : [{
					type: "rotate",
					degrees: e
				}], o = await t.applyImageActions(c, H.path, a, { mode: "copy" });
				Ne(`${i("imageCreated")}: ${o.entry.name} · ${o.result.width} × ${o.result.height} px`), await Pt();
			} catch (e) {
				jt(e), L(!1);
			}
		}
	}, on = () => {
		H && tt({
			kind: "resize",
			title: i("resize"),
			label: i("resizePrompt"),
			initial: "1200x1200",
			maximum: 9
		});
	}, sn = () => {
		!H || !Be || $e(!0);
	}, cn = (e, t) => {
		He((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.imageTools.v2", JSON.stringify(r)), r;
		});
	}, ln = (e, t) => {
		Ue((n) => {
			let r = {
				...n,
				[e]: t
			};
			return localStorage.setItem("sofinder.features.v2", JSON.stringify(r)), r;
		});
	}, un = async () => {
		if (V.length !== 0) try {
			let e = await t.downloadArchive(c, V.map((e) => e.path)), n = URL.createObjectURL(e), r = document.createElement("a");
			r.href = n, r.download = "sofinder-download.zip", r.click(), window.setTimeout(() => URL.revokeObjectURL(n), 1e3);
		} catch (e) {
			jt(e);
		}
	}, dn = async () => {
		if (H) try {
			ze(await t.updateMetadata(c, H.path, "favorite", { favorite: !Re.favorites.includes(H.path) }));
		} catch (e) {
			jt(e);
		}
	}, fn = async () => {
		H && st(!0);
	}, pn = async (e) => {
		let n = et;
		if (tt(null), n) try {
			if (n.kind === "folder") await t.createFolder(c, u, e);
			else if (n.kind === "rename" && H && e !== H.name) await t.rename(c, H.path, e);
			else if (n.kind === "resize") {
				let t = /^(\d{1,4})[x×](\d{1,4})$/i.exec(e.replace(/\s/g, ""));
				if (!t) {
					Ne(i("invalidDimensions"));
					return;
				}
				await an(0, Number(t[1]), Number(t[2]));
			}
			(n.kind === "folder" || n.kind === "rename") && await Pt();
		} catch (e) {
			jt(e);
		}
	}, mn = async (e) => {
		let t = e.includes("/") ? e.slice(0, e.lastIndexOf("/")) : "";
		await Pt(c, t, "", 0), h(/* @__PURE__ */ new Set([e]));
	}, hn = (e) => {
		Ae(e), localStorage.setItem("sofinder.view", e);
	}, gn = (e) => {
		let n = ct?.entry ?? null;
		lt(null), e === "open" && n?.directory ? Wt(n) : e === "preview" && n && !n.directory ? dt(n) : e === "select" && n ? nn(n) : e === "rename" ? Qt() : e === "copy" ? tn("copy", u) : e === "move" ? tn("move", u) : e === "delete" ? $t() : e === "download" && n && !n.directory && window.location.assign(t.downloadUrl(c, n.path));
	}, _n = async (e) => {
		if (H) try {
			let n = await t.applyImageActions(c, H.path, [{
				type: "preset",
				name: e
			}], { mode: "copy" });
			Ne(`${i("imageCreated")}: ${n.entry.name} · ${n.result.width} × ${n.result.height} px`), await Pt();
		} catch (e) {
			jt(e);
		}
	}, vn = (e) => {
		window.requestAnimationFrame(() => {
			document.querySelector(`button.sf-entry[data-entry-index="${e}"]`)?.focus();
		});
	}, yn = (e, t, n = !1) => {
		let r = Ce[e], i = Math.round(Math.max(r.min, Math.min(r.max, t)));
		e === "left" ? xt(i) : Ct(i), n && localStorage.setItem(`sofinder.column.${e}`, String(i));
	}, bn = (e, t) => {
		t.preventDefault(), t.currentTarget.setPointerCapture(t.pointerId);
		let n = e === "left" ? bt : St;
		kt.current = {
			side: e,
			startX: t.clientX,
			startWidth: n,
			currentWidth: n
		};
	}, xn = (e) => {
		let t = kt.current;
		if (!t) return;
		let n = e.clientX - t.startX, r = Ce[t.side];
		t.currentWidth = Math.round(Math.max(r.min, Math.min(r.max, t.startWidth + (t.side === "left" ? n : -n)))), yn(t.side, t.currentWidth);
	}, Sn = () => {
		let e = kt.current;
		kt.current = null, e && yn(e.side, e.currentWidth, !0);
	}, Cn = (e, t) => {
		let n = t.key === "ArrowLeft" ? -1 : +(t.key === "ArrowRight");
		n !== 0 && (t.preventDefault(), yn(e, (e === "left" ? bt : St) + (e === "left" ? n : -n) * 10, !0));
	}, wn = (e) => {
		let t = e.target, n = t.matches("button.sf-entry");
		if (t.isContentEditable || [
			"INPUT",
			"SELECT",
			"TEXTAREA",
			"BUTTON",
			"A"
		].includes(t.tagName) && !n) return;
		if (Dn === "manager" && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
			e.preventDefault(), rn();
			return;
		}
		if (e.key === "Escape") {
			e.preventDefault(), h(/* @__PURE__ */ new Set()), v(null);
			return;
		}
		if (Dn === "manager" && e.key === "Delete" && Ht("delete") && !B?.readOnly) {
			e.preventDefault(), $t();
			return;
		}
		if (Dn === "manager" && e.key === "F2" && V.length === 1 && Ht("rename") && !B?.readOnly) {
			e.preventDefault(), Qt();
			return;
		}
		if (e.key === "Enter" && V.length === 1) {
			e.preventDefault(), Wt(V[0]);
			return;
		}
		let r = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : +(e.key === "ArrowRight" || e.key === "ArrowDown");
		if (r !== 0 && f.length > 0) {
			e.preventDefault();
			let t = g || V[0]?.path, n = t ? f.findIndex((e) => e.path === t) : r > 0 ? -1 : f.length, i = Math.max(0, Math.min(f.length - 1, n + r)), a = f[i];
			h(/* @__PURE__ */ new Set([a.path])), v(a.path), vn(i);
		}
	}, Tn = Xe !== null && V.some((e) => {
		let t = e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : "", n = Xe.path === "" ? 0 : Xe.path.split("/").length;
		return Xe.operation === "move" && Xe.path === t || e.directory && B !== void 0 && n >= B.maxFolderDepth || e.directory && (Xe.path === e.path || Xe.path.startsWith(`${e.path}/`));
	}), En = Pe.some((e) => e.status === "queued" || e.status === "uploading"), Dn = e.uiDefaults.mode ?? (e.selectMode ? "picker" : "manager"), On = B?.storageCapabilities?.recoverableDelete !== !1, kn = o.length > 1 || z.folderTree || z.recent || !!(B?.readOnly || B?.quotaBytes), An = Dn === "manager" && V.length > 0, jn = (e, t) => /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)(A, { name: e }), /* @__PURE__ */ (0, k.jsx)("span", { children: t })] }), Mn = (e, t, n = y) => {
		Oe([]), Pt(e, t, n, 0, T, D, x, null);
	};
	return /* @__PURE__ */ (0, k.jsxs)("main", {
		className: `sf-app sf-mode-${Dn}${kn ? "" : " sf-no-sidebar"}${An ? "" : " sf-no-details"}`,
		onKeyDown: wn,
		onDragOver: (e) => {
			Dn === "manager" && e.preventDefault();
		},
		onDrop: (e) => {
			Dn === "manager" && (e.preventDefault(), e.dataTransfer.files.length && qt(e.dataTransfer.files));
		},
		children: [
			e.uiDefaults.header && /* @__PURE__ */ (0, k.jsx)("header", {
				className: "sf-header",
				children: /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "sf-brand",
					children: [e.uiDefaults.logo && /* @__PURE__ */ (0, k.jsx)("span", {
						className: "sf-brand-mark",
						children: "S"
					}), /* @__PURE__ */ (0, k.jsx)("strong", { children: "SoFinder" })]
				})
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "sf-commandbar",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("nav", {
						className: "sf-breadcrumb",
						"aria-label": "Breadcrumb",
						children: [/* @__PURE__ */ (0, k.jsx)("button", {
							onClick: () => Mn(c, ""),
							children: i("home")
						}), Ft.map((e, t) => /* @__PURE__ */ (0, k.jsxs)("span", { children: ["› ", /* @__PURE__ */ (0, k.jsx)("button", {
							onClick: () => Mn(c, Ft.slice(0, t + 1).join("/")),
							children: e
						})] }, `${e}-${t}`))]
					}),
					e.uiDefaults.search !== !1 && /* @__PURE__ */ (0, k.jsxs)("div", {
						className: "sf-search",
						children: [
							/* @__PURE__ */ (0, k.jsx)(A, { name: "search" }),
							/* @__PURE__ */ (0, k.jsxs)("select", {
								value: x,
								onChange: (e) => {
									let t = e.target.value;
									S(t), re(0);
								},
								"aria-label": i("searchScope"),
								children: [/* @__PURE__ */ (0, k.jsx)("option", {
									value: "name",
									disabled: B?.storageCapabilities?.search === !1,
									children: i("name")
								}), /* @__PURE__ */ (0, k.jsx)("option", {
									value: "tags",
									disabled: !z.tags,
									children: i("tags")
								})]
							}),
							/* @__PURE__ */ (0, k.jsx)("input", {
								disabled: x === "name" && B?.storageCapabilities?.search === !1,
								value: y,
								onChange: (e) => b(e.target.value),
								placeholder: i(x === "tags" ? "searchTags" : "search"),
								"aria-label": i(x === "tags" ? "searchTags" : "search")
							})
						]
					}),
					e.uiDefaults.viewSwitcher !== !1 && /* @__PURE__ */ (0, k.jsxs)("div", {
						className: "sf-view-toggle",
						role: "group",
						"aria-label": `${i("grid")} / ${i("list")}`,
						children: [/* @__PURE__ */ (0, k.jsx)("button", {
							className: ke === "grid" ? "active" : "",
							onClick: () => hn("grid"),
							title: i("grid"),
							"aria-label": i("grid"),
							children: /* @__PURE__ */ (0, k.jsx)(A, { name: "grid" })
						}), /* @__PURE__ */ (0, k.jsx)("button", {
							className: ke === "list" ? "active" : "",
							onClick: () => hn("list"),
							title: i("list"),
							"aria-label": i("list"),
							children: /* @__PURE__ */ (0, k.jsx)(A, { name: "list" })
						})]
					}),
					/* @__PURE__ */ (0, k.jsxs)("div", {
						className: "sf-utility",
						children: [/* @__PURE__ */ (0, k.jsx)("button", {
							className: "sf-icon-only",
							onClick: () => qe((e) => !e),
							"aria-expanded": Ke,
							title: i("moreActions"),
							"aria-label": i("moreActions"),
							children: /* @__PURE__ */ (0, k.jsx)(A, { name: "more" })
						}), Ke && /* @__PURE__ */ (0, k.jsxs)("div", {
							className: "sf-utility-menu",
							role: "menu",
							children: [
								e.uiDefaults.languageSwitcher !== !1 && /* @__PURE__ */ (0, k.jsxs)("label", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: i("language") }), /* @__PURE__ */ (0, k.jsxs)("select", {
									value: n,
									onChange: (e) => r(e.target.value),
									"aria-label": i("language"),
									children: [
										/* @__PURE__ */ (0, k.jsx)("option", {
											value: "zh-cn",
											children: "简中"
										}),
										/* @__PURE__ */ (0, k.jsx)("option", {
											value: "zh-tw",
											children: "繁中"
										}),
										/* @__PURE__ */ (0, k.jsx)("option", {
											value: "en",
											children: "EN"
										})
									]
								})] }),
								/* @__PURE__ */ (0, k.jsxs)("label", { children: [/* @__PURE__ */ (0, k.jsx)("span", { children: i("sort") }), /* @__PURE__ */ (0, k.jsxs)("select", {
									value: T,
									disabled: B?.storageCapabilities?.sort === !1,
									onChange: (e) => {
										let t = e.target.value;
										E(t), Oe([]), Pt(c, u, y, 0, t, D, x, null);
									},
									children: [
										/* @__PURE__ */ (0, k.jsx)("option", {
											value: "name",
											children: i("name")
										}),
										/* @__PURE__ */ (0, k.jsx)("option", {
											value: "size",
											children: i("size")
										}),
										/* @__PURE__ */ (0, k.jsx)("option", {
											value: "modified",
											children: i("modified")
										})
									]
								})] }),
								/* @__PURE__ */ (0, k.jsx)("button", {
									role: "menuitem",
									disabled: B?.storageCapabilities?.sort === !1,
									onClick: () => {
										let e = D === "asc" ? "desc" : "asc";
										ee(e), Oe([]), Pt(c, u, y, 0, T, e, x, null);
									},
									children: jn("sort", i("direction"))
								}),
								/* @__PURE__ */ (0, k.jsx)("button", {
									role: "menuitem",
									onClick: () => {
										qe(!1), Pt();
									},
									children: jn("refresh", i("refresh"))
								}),
								/* @__PURE__ */ (0, k.jsx)("button", {
									role: "menuitem",
									onClick: () => {
										qe(!1), Ge(!0);
									},
									children: jn("settings", i("settings"))
								}),
								Dn === "manager" && z.trash && On && /* @__PURE__ */ (0, k.jsx)("button", {
									role: "menuitem",
									onClick: () => {
										qe(!1), at(!0);
									},
									children: jn("trash", i("trash"))
								})
							]
						})]
					})
				]
			}),
			Dn === "manager" && /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "sf-toolbar",
				role: "toolbar",
				"aria-label": i("fileActions"),
				title: i("keyboardHelp"),
				children: [
					/* @__PURE__ */ (0, k.jsx)("button", {
						onClick: Gt,
						disabled: B?.readOnly || vt.create_folder === !1 || B !== void 0 && It >= B.maxFolderDepth,
						title: B && It >= B.maxFolderDepth ? i("folderDepthReached") : void 0,
						children: jn("add-folder", i("newFolder"))
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						className: `primary sf-upload-trigger${En ? " is-active" : ""}`,
						"aria-busy": En,
						onClick: () => wt.current?.click(),
						disabled: B?.readOnly || vt.upload === !1,
						children: jn("upload", `${i("upload")}${En ? ` (${Pe.filter((e) => e.status === "queued" || e.status === "uploading").length})` : ""}`)
					}),
					/* @__PURE__ */ (0, k.jsx)("input", {
						ref: wt,
						type: "file",
						multiple: !0,
						hidden: !0,
						onChange: (e) => {
							e.target.files && qt(e.target.files), e.target.value = "";
						}
					}),
					V.length > 0 && /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("span", { className: "sf-separator" }), /* @__PURE__ */ (0, k.jsxs)("div", {
						className: "sf-context-actions",
						children: [
							/* @__PURE__ */ (0, k.jsx)("button", {
								onClick: rn,
								disabled: f.length === 0,
								children: jn("select", m.size === f.length && f.length > 0 ? i("clearSelection") : i("selectAll"))
							}),
							/* @__PURE__ */ (0, k.jsx)("button", {
								onClick: Qt,
								disabled: V.length !== 1 || !Ht("rename") || B?.readOnly,
								children: jn("rename", i("rename"))
							}),
							/* @__PURE__ */ (0, k.jsx)("button", {
								onClick: () => void tn("copy", u),
								disabled: !Ht("copy") || B?.readOnly,
								children: jn("copy", i("copy"))
							}),
							/* @__PURE__ */ (0, k.jsx)("button", {
								onClick: () => void tn("move", u),
								disabled: !Ht("move") || B?.readOnly,
								children: jn("move", i("move"))
							}),
							z.archive && /* @__PURE__ */ (0, k.jsx)("button", {
								onClick: () => void un(),
								children: jn("archive", i("downloadZip"))
							}),
							z.favorites && /* @__PURE__ */ (0, k.jsx)("button", {
								onClick: () => void dn(),
								disabled: !H,
								children: jn("favorite", i("favorite"))
							}),
							z.tags && /* @__PURE__ */ (0, k.jsx)("button", {
								onClick: () => void fn(),
								disabled: !H,
								children: jn("tags", i("tags"))
							}),
							/* @__PURE__ */ (0, k.jsx)("button", {
								className: "danger",
								onClick: $t,
								disabled: !Ht("delete") || B?.readOnly,
								children: jn("delete", `${i("remove")}${V.length > 1 ? ` (${V.length})` : ""}`)
							}),
							Ve.rotate && /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("button", {
								onClick: () => void an(270),
								disabled: !zt(H) || B?.readOnly,
								children: jn("rotate-left", i("rotateLeft"))
							}), /* @__PURE__ */ (0, k.jsx)("button", {
								onClick: () => void an(90),
								disabled: !zt(H) || B?.readOnly,
								children: jn("rotate-right", i("rotateRight"))
							})] }),
							Ve.resize && /* @__PURE__ */ (0, k.jsx)("button", {
								onClick: on,
								disabled: !zt(H) || B?.readOnly,
								children: jn("resize", i("resize"))
							}),
							Ve.crop && /* @__PURE__ */ (0, k.jsx)("button", {
								onClick: sn,
								disabled: !zt(H) || !Be || B?.readOnly,
								children: jn("crop", i("crop"))
							}),
							Ve.presets && /* @__PURE__ */ (0, k.jsxs)("label", {
								className: "sf-sort",
								children: [i("preset"), /* @__PURE__ */ (0, k.jsxs)("select", {
									value: "",
									disabled: !zt(H) || B?.readOnly || Object.keys(mt).length === 0,
									onChange: (e) => {
										let t = e.target.value;
										e.target.value = "", t && _n(t);
									},
									children: [/* @__PURE__ */ (0, k.jsx)("option", {
										value: "",
										children: "—"
									}), Object.entries(mt).map(([e, t]) => /* @__PURE__ */ (0, k.jsxs)("option", {
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
							})
						]
					})] })
				]
			}),
			Me && /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "sf-notice",
				role: "alert",
				children: [Me, /* @__PURE__ */ (0, k.jsx)("button", {
					onClick: () => Ne(""),
					"aria-label": i("close"),
					children: /* @__PURE__ */ (0, k.jsx)(A, { name: "close" })
				})]
			}),
			/* @__PURE__ */ (0, k.jsx)(me, {
				tasks: Pe,
				collapsed: Ie,
				labels: {
					title: i("uploadQueue"),
					expand: i("expand"),
					collapse: i("collapse"),
					cancel: i("cancel"),
					cancelAll: i("cancelAll"),
					clearFinished: i("clearFinished"),
					remove: i("removeUploadTask"),
					status: (e) => i(e)
				},
				onToggle: () => Le((e) => !e),
				onCancel: Yt,
				onCancelAll: Xt,
				onClearFinished: () => Fe((e) => e.filter((e) => e.status === "queued" || e.status === "uploading")),
				onRemove: Zt
			}),
			/* @__PURE__ */ (0, k.jsxs)("div", {
				className: "sf-layout",
				style: {
					"--sf-sidebar-width": `${bt}px`,
					"--sf-details-width": `${St}px`
				},
				children: [
					kn && /* @__PURE__ */ (0, k.jsxs)("aside", {
						className: "sf-sidebar",
						"aria-label": "Resources",
						children: [
							o.map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
								className: e.name === c ? "active" : "",
								onClick: () => {
									l(e.name), b(""), S("name"), e.storageCapabilities?.sort === !1 ? (E("name"), ee("asc"), Oe([]), Pt(e.name, "", "", 0, "name", "asc", "name", null)) : Mn(e.name, "", "");
								},
								children: [/* @__PURE__ */ (0, k.jsx)("span", {
									className: "sf-resource-icon",
									children: /* @__PURE__ */ (0, k.jsx)(le, { kind: e.name.toLowerCase().includes("image") ? "image" : "folder" })
								}), e.name.toLowerCase().includes("image") ? i("images") : e.name.toLowerCase() === "files" ? i("files") : e.name]
							}, e.name)),
							z.folderTree && c && /* @__PURE__ */ (0, k.jsx)(P, {
								api: t,
								resource: c,
								currentPath: u,
								rootLabel: i("home"),
								onNavigate: (e) => Mn(c, e, "")
							}),
							B && /* @__PURE__ */ (0, k.jsxs)("div", {
								className: "sf-resource-status",
								children: [B.readOnly && /* @__PURE__ */ (0, k.jsx)("strong", { children: i("readOnly") }), B.quotaBytes > 0 && /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsxs)("span", { children: [
									i("storageUsage"),
									": ",
									fe(B.usedBytes),
									" / ",
									fe(B.quotaBytes)
								] }), /* @__PURE__ */ (0, k.jsx)("progress", {
									max: B.quotaBytes,
									value: Math.min(B.usedBytes, B.quotaBytes)
								})] })]
							}),
							z.recent && Re.recent.length > 0 && /* @__PURE__ */ (0, k.jsxs)("div", {
								className: "sf-recent",
								children: [/* @__PURE__ */ (0, k.jsxs)("header", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: i("recent") }), /* @__PURE__ */ (0, k.jsx)("span", { children: Re.recent.length })] }), Re.recent.slice(0, 8).map((e) => /* @__PURE__ */ (0, k.jsxs)("button", {
									title: e.path,
									onClick: () => void mn(e.path),
									children: [/* @__PURE__ */ (0, k.jsx)("span", {
										className: "sf-recent-icon",
										children: /* @__PURE__ */ (0, k.jsx)(A, { name: "history" })
									}), /* @__PURE__ */ (0, k.jsxs)("span", { children: [/* @__PURE__ */ (0, k.jsx)("b", { children: e.path.split("/").pop() }), /* @__PURE__ */ (0, k.jsx)("small", { children: e.path.includes("/") ? e.path.slice(0, e.path.lastIndexOf("/")) : i("home") })] })]
								}, e.path))]
							})
						]
					}),
					kn && /* @__PURE__ */ (0, k.jsx)("div", {
						className: "sf-column-resizer left",
						role: "separator",
						tabIndex: 0,
						"aria-label": i("resizeLeftPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": Ce.left.min,
						"aria-valuemax": Ce.left.max,
						"aria-valuenow": bt,
						onPointerDown: (e) => bn("left", e),
						onPointerMove: xn,
						onPointerUp: Sn,
						onPointerCancel: Sn,
						onKeyDown: (e) => Cn("left", e),
						onDoubleClick: () => yn("left", Ce.left.initial, !0)
					}),
					/* @__PURE__ */ (0, k.jsxs)("section", {
						className: "sf-content",
						children: [je ? /* @__PURE__ */ (0, k.jsx)("div", {
							className: "sf-state",
							children: i("loading")
						}) : f.length === 0 ? /* @__PURE__ */ (0, k.jsx)("div", {
							className: "sf-state",
							children: i("empty")
						}) : /* @__PURE__ */ (0, k.jsxs)("div", {
							className: `sf-entries ${ke}`,
							role: "listbox",
							"aria-multiselectable": Dn === "manager",
							"aria-label": i("files"),
							children: [ke === "list" && /* @__PURE__ */ (0, k.jsxs)("div", {
								className: "sf-list-head",
								role: "presentation",
								"aria-hidden": "true",
								children: [
									/* @__PURE__ */ (0, k.jsx)("span", { children: i("name") }),
									/* @__PURE__ */ (0, k.jsx)("span", { children: i("size") }),
									/* @__PURE__ */ (0, k.jsx)("span", { children: i("modified") })
								]
							}), f.map((e, n) => {
								let r = !e.directory && Rt(e);
								return /* @__PURE__ */ (0, k.jsxs)("button", {
									"data-entry-index": n,
									role: "option",
									"aria-selected": m.has(e.path),
									"aria-label": `${e.name}, ${e.directory ? i("folder") : fe(e.size)}`,
									className: `sf-entry ${m.has(e.path) ? "selected" : ""}`,
									onClick: (t) => Ut(e, t),
									onDoubleClick: () => Wt(e),
									onContextMenu: (t) => {
										t.preventDefault(), h(/* @__PURE__ */ new Set([e.path])), v(e.path), lt({
											x: t.clientX,
											y: t.clientY,
											entry: e
										});
									},
									onPointerDown: (t) => {
										t.pointerType === "touch" && (Ot.current = window.setTimeout(() => {
											h(/* @__PURE__ */ new Set([e.path])), v(e.path), lt({
												x: t.clientX,
												y: t.clientY,
												entry: e
											});
										}, 550));
									},
									onPointerUp: () => {
										Ot.current !== null && window.clearTimeout(Ot.current), Ot.current = null;
									},
									onPointerCancel: () => {
										Ot.current !== null && window.clearTimeout(Ot.current), Ot.current = null;
									},
									onDragOver: (t) => {
										Dn === "manager" && e.directory && t.preventDefault();
									},
									onDrop: (t) => {
										Dn === "manager" && e.directory && t.dataTransfer.files.length && (t.preventDefault(), Jt(e.path, t.dataTransfer.files));
									},
									children: [
										/* @__PURE__ */ (0, k.jsx)("span", {
											className: "sf-entry-icon",
											children: r ? /* @__PURE__ */ (0, k.jsx)(de, {
												src: t.thumbnailUrl(c, e),
												alt: "",
												lazy: !0
											}) : /* @__PURE__ */ (0, k.jsx)(le, { kind: e.directory ? "folder" : "file" })
										}),
										/* @__PURE__ */ (0, k.jsxs)("span", {
											className: "sf-entry-name",
											title: e.name,
											children: [z.favorites && Re.favorites.includes(e.path) && /* @__PURE__ */ (0, k.jsxs)("span", {
												"aria-label": i("favorite"),
												children: [/* @__PURE__ */ (0, k.jsx)(A, { name: "favorite" }), " "]
											}), e.name]
										}),
										/* @__PURE__ */ (0, k.jsx)("span", {
											className: "sf-entry-size",
											children: e.directory ? "—" : fe(e.size)
										}),
										/* @__PURE__ */ (0, k.jsx)("time", {
											dateTime: (/* @__PURE__ */ new Date(e.modifiedAt * 1e3)).toISOString(),
											children: a.format(e.modifiedAt * 1e3)
										})
									]
								}, e.path);
							})]
						}), (De.length > 0 || Te !== null) && /* @__PURE__ */ (0, k.jsxs)("nav", {
							className: "sf-pagination",
							"aria-label": i("pagination"),
							children: [
								/* @__PURE__ */ (0, k.jsxs)("button", {
									disabled: De.length === 0,
									onClick: () => {
										if (De.length === 0) return;
										let e = De.slice(0, -1), t = De[De.length - 1] ?? null;
										Oe(e), Pt(c, u, y, Math.max(0, te - 100), T, D, x, t);
									},
									children: [
										/* @__PURE__ */ (0, k.jsx)(A, { name: "chevron-left" }),
										" ",
										i("previous")
									]
								}),
								/* @__PURE__ */ (0, k.jsxs)("span", { children: [
									i("page"),
									" ",
									De.length + 1,
									ie === null ? "" : ` / ${Math.max(1, Math.ceil(ie / 100))}`
								] }),
								/* @__PURE__ */ (0, k.jsxs)("button", {
									disabled: Te === null,
									onClick: () => {
										Te !== null && (Oe((e) => [...e, oe]), Pt(c, u, y, te + 100, T, D, x, Te));
									},
									children: [
										i("next"),
										" ",
										/* @__PURE__ */ (0, k.jsx)(A, { name: "chevron-right" })
									]
								})
							]
						})]
					}),
					An && /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [/* @__PURE__ */ (0, k.jsx)("div", {
						className: "sf-column-resizer right",
						role: "separator",
						tabIndex: 0,
						"aria-label": i("resizeRightPanel"),
						"aria-orientation": "vertical",
						"aria-valuemin": Ce.right.min,
						"aria-valuemax": Ce.right.max,
						"aria-valuenow": St,
						onPointerDown: (e) => bn("right", e),
						onPointerMove: xn,
						onPointerUp: Sn,
						onPointerCancel: Sn,
						onKeyDown: (e) => Cn("right", e),
						onDoubleClick: () => yn("right", Ce.right.initial, !0)
					}), /* @__PURE__ */ (0, k.jsx)(he, {
						api: t,
						resource: c,
						selectedEntries: V,
						selected: H,
						imageInfo: Be,
						metadata: Re,
						showTags: z.tags,
						previewImage: Rt(H),
						selectMode: !1,
						selectAllowed: Bt(H),
						labels: {
							details: i("details"),
							selected: i("selectedCount"),
							type: i("type"),
							folder: i("folder"),
							file: i("file"),
							size: i("size"),
							dimensions: i("dimensions"),
							modified: i("modified"),
							location: i("location"),
							select: i("select"),
							download: i("download"),
							copyUrl: i("copyUrl"),
							unsupportedWebImage: i("webImageUnsupported")
						},
						formatDate: (e) => a.format(e * 1e3),
						onChoose: nn,
						onOpenUrl: Vt
					})] })
				]
			}),
			Dn === "picker" && H && !H.directory && /* @__PURE__ */ (0, k.jsxs)("div", {
				className: "sf-picker-bar",
				children: [
					/* @__PURE__ */ (0, k.jsxs)("div", { children: [/* @__PURE__ */ (0, k.jsx)("strong", { children: H.name }), /* @__PURE__ */ (0, k.jsx)("small", { children: fe(H.size) })] }),
					!Bt(H) && /* @__PURE__ */ (0, k.jsx)("span", {
						role: "status",
						children: i("webImageUnsupported")
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						className: "primary",
						disabled: !Bt(H),
						onClick: () => nn(),
						children: i("select")
					})
				]
			}),
			We && /* @__PURE__ */ (0, k.jsx)(ge, {
				resource: B,
				tools: Ve,
				features: z,
				scale: Je,
				translate: i,
				onToolChange: cn,
				onFeatureChange: (e, t) => {
					ln(e, t), e === "tags" && !t && x === "tags" && S("name");
				},
				onScaleChange: Ye,
				onClose: () => Ge(!1)
			}),
			Xe && /* @__PURE__ */ (0, k.jsx)(_e, {
				state: Xe,
				unsafe: Tn,
				translate: i,
				onBrowse: (e, t) => void tn(e, t),
				onConfirm: (e, t) => void en(e, t),
				onClose: () => Ze(null)
			}),
			et && /* @__PURE__ */ (0, k.jsx)(ne, {
				title: et.title,
				label: et.label,
				initialValue: et.initial,
				maximum: et.maximum,
				extension: et.extension,
				confirmLabel: i("confirm"),
				cancelLabel: i("cancel"),
				closeLabel: i("close"),
				onConfirm: (e) => void pn(e),
				onClose: () => tt(null)
			}),
			nt && /* @__PURE__ */ (0, k.jsx)(M, {
				...nt,
				confirmLabel: i("confirm"),
				cancelLabel: i("cancel"),
				closeLabel: i("close"),
				onConfirm: () => Nt(!0),
				onClose: () => Nt(!1)
			}),
			it && /* @__PURE__ */ (0, k.jsx)(I, {
				api: t,
				resource: c,
				locale: n,
				labels: {
					title: i("trash"),
					close: i("close"),
					cancel: i("cancel"),
					empty: i("trashEmpty"),
					restore: i("restore"),
					permanentDelete: i("permanentDelete"),
					expires: i("expires"),
					conflict: i("restoreConflict"),
					overwrite: i("restoreOverwrite"),
					autoRename: i("restoreAutoRename"),
					usage: i("trashUsage"),
					items: i("items"),
					previous: i("previous"),
					next: i("next"),
					search: i("searchTrash")
				},
				onClose: () => at(!1),
				onChanged: () => void Pt()
			}),
			ot && H && /* @__PURE__ */ (0, k.jsx)(se, {
				initial: Re.tags[H.path] || [],
				suggestions: Array.from(new Set(Object.values(Re.tags).flat())).sort((e, t) => e.localeCompare(t, n)),
				labels: {
					title: i("tags"),
					close: i("close"),
					cancel: i("cancel"),
					save: i("save"),
					input: i("tagInput"),
					hint: i("tagInputHint"),
					maximum: i("tagMaximum")
				},
				onClose: () => st(!1),
				onSave: (e) => {
					st(!1), t.updateMetadata(c, H.path, "tags", { tags: e }).then(ze).catch(jt);
				}
			}),
			ut && /* @__PURE__ */ (0, k.jsx)(j, {
				title: ut.name,
				closeLabel: i("close"),
				onClose: () => dt(null),
				className: "sf-file-preview-modal",
				footer: /* @__PURE__ */ (0, k.jsxs)(k.Fragment, { children: [
					/* @__PURE__ */ (0, k.jsx)("button", {
						type: "button",
						className: "sf-icon-button",
						onClick: () => Vt(ut),
						title: i("copyUrl"),
						"aria-label": i("copyUrl"),
						children: /* @__PURE__ */ (0, k.jsx)(ue, {})
					}),
					/* @__PURE__ */ (0, k.jsx)("a", {
						className: "sf-preview-download",
						href: t.downloadUrl(c, ut.path),
						children: i("download")
					}),
					/* @__PURE__ */ (0, k.jsx)("button", {
						className: "primary",
						onClick: () => dt(null),
						children: i("close")
					})
				] }),
				children: /* @__PURE__ */ (0, k.jsxs)("div", {
					className: "sf-file-preview-body",
					children: [/* @__PURE__ */ (0, k.jsx)("div", {
						className: "sf-file-preview-content",
						children: Rt(ut) ? /* @__PURE__ */ (0, k.jsx)(de, {
							src: t.thumbnailUrl(c, ut, 512, 512),
							alt: ut.name
						}) : /* @__PURE__ */ (0, k.jsxs)("div", {
							className: "sf-file-preview-fallback",
							children: [/* @__PURE__ */ (0, k.jsx)(le, { kind: "file" }), /* @__PURE__ */ (0, k.jsx)("p", { children: i("previewUnavailable") })]
						})
					}), /* @__PURE__ */ (0, k.jsxs)("dl", {
						className: "sf-file-preview-meta",
						children: [
							/* @__PURE__ */ (0, k.jsx)("dt", { children: i("type") }),
							/* @__PURE__ */ (0, k.jsx)("dd", { children: ut.mimeType || i("file") }),
							/* @__PURE__ */ (0, k.jsx)("dt", { children: i("size") }),
							/* @__PURE__ */ (0, k.jsx)("dd", { children: fe(ut.size) }),
							/* @__PURE__ */ (0, k.jsx)("dt", { children: i("modified") }),
							/* @__PURE__ */ (0, k.jsx)("dd", { children: /* @__PURE__ */ (0, k.jsx)("time", {
								dateTime: (/* @__PURE__ */ new Date(ut.modifiedAt * 1e3)).toISOString(),
								children: a.format(ut.modifiedAt * 1e3)
							}) }),
							/* @__PURE__ */ (0, k.jsx)("dt", { children: i("location") }),
							/* @__PURE__ */ (0, k.jsx)("dd", { children: ut.path })
						]
					})]
				})
			}),
			ft && /* @__PURE__ */ (0, k.jsx)(ce, {
				url: ft.url,
				loginRequired: ft.loginRequired,
				labels: {
					title: i("fileUrl"),
					close: i("close"),
					copied: i("urlCopied"),
					failed: i("copyUrlFailed"),
					hint: i("clickUrlToCopy"),
					loginRequired: i("loginRequired")
				},
				onClose: () => pt(null)
			}),
			Qe && H && Be && /* @__PURE__ */ (0, k.jsx)(F, {
				entry: H,
				info: Be,
				imageUrl: t.contentUrl(c, H.path),
				labels: {
					crop: i("crop"),
					close: i("close"),
					cancel: i("cancel"),
					save: i("save"),
					saving: i("saving"),
					ratio: i("ratio"),
					free: i("freeRatio"),
					original: i("originalRatio"),
					zoom: i("zoom"),
					undo: i("undo"),
					redo: i("redo"),
					reset: i("reset"),
					compare: i("compare"),
					x: "X",
					y: "Y",
					width: i("width"),
					height: i("height"),
					saveMode: i("saveMode"),
					saveCopy: i("saveCopy"),
					overwrite: i("overwrite"),
					fileName: i("fileName"),
					overwriteWarning: i("confirmImageOverwrite"),
					panHint: i("panHint")
				},
				onClose: () => $e(!1),
				onSave: async (e, n) => {
					let r = await t.applyImageActions(c, H.path, e, n);
					$e(!1), Ne(`${i("imageCreated")}: ${r.entry.name} · ${r.result.width} × ${r.result.height} px`), await Pt();
				}
			}),
			ct && /* @__PURE__ */ (0, k.jsx)(N, {
				x: ct.x,
				y: ct.y,
				onClose: () => lt(null),
				onSelect: gn,
				items: [
					{
						id: ct.entry.directory ? "open" : "preview",
						label: ct.entry.directory ? i("open") : i("preview")
					},
					...Dn === "picker" && !ct.entry.directory ? [{
						id: "select",
						label: i("select"),
						disabled: !Bt(ct.entry)
					}] : [],
					{
						id: "download",
						label: i("download"),
						disabled: ct.entry.directory
					},
					...Dn === "manager" ? [
						{
							id: "rename",
							label: i("rename"),
							disabled: ct.entry.capabilities?.rename === !1
						},
						{
							id: "copy",
							label: i("copy"),
							disabled: ct.entry.capabilities?.copy === !1
						},
						{
							id: "move",
							label: i("move"),
							disabled: ct.entry.capabilities?.move === !1
						},
						{
							id: "delete",
							label: i("remove"),
							disabled: ct.entry.capabilities?.delete === !1,
							danger: !0
						}
					] : []
				]
			}),
			/* @__PURE__ */ (0, k.jsx)("div", {
				className: "sf-sr-only",
				"aria-live": "polite",
				children: V.length > 0 ? `${V.length} ${i("selectedCount")}` : Me
			})
		]
	});
}
//#endregion
//#region src/main.tsx
var Ee = document.getElementById("sofinder-root");
if (!Ee) throw Error("SoFinder root element was not found.");
var De = JSON.parse(Ee.dataset.config || "{}");
(0, v.createRoot)(Ee).render(/* @__PURE__ */ (0, k.jsx)(_.StrictMode, { children: /* @__PURE__ */ (0, k.jsx)(Te, { config: De }) }));
//#endregion
