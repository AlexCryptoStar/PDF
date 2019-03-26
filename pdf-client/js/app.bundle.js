/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "94732bec3363655d30d9";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./main.css":
/*!******************!*\
  !*** ./main.css ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./node_modules/moment/locale sync recursive ^\\.\\/.*$":
/*!**************************************************!*\
  !*** ./node_modules/moment/locale sync ^\.\/.*$ ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "./node_modules/moment/locale/af.js",
	"./af.js": "./node_modules/moment/locale/af.js",
	"./ar": "./node_modules/moment/locale/ar.js",
	"./ar-dz": "./node_modules/moment/locale/ar-dz.js",
	"./ar-dz.js": "./node_modules/moment/locale/ar-dz.js",
	"./ar-kw": "./node_modules/moment/locale/ar-kw.js",
	"./ar-kw.js": "./node_modules/moment/locale/ar-kw.js",
	"./ar-ly": "./node_modules/moment/locale/ar-ly.js",
	"./ar-ly.js": "./node_modules/moment/locale/ar-ly.js",
	"./ar-ma": "./node_modules/moment/locale/ar-ma.js",
	"./ar-ma.js": "./node_modules/moment/locale/ar-ma.js",
	"./ar-sa": "./node_modules/moment/locale/ar-sa.js",
	"./ar-sa.js": "./node_modules/moment/locale/ar-sa.js",
	"./ar-tn": "./node_modules/moment/locale/ar-tn.js",
	"./ar-tn.js": "./node_modules/moment/locale/ar-tn.js",
	"./ar.js": "./node_modules/moment/locale/ar.js",
	"./az": "./node_modules/moment/locale/az.js",
	"./az.js": "./node_modules/moment/locale/az.js",
	"./be": "./node_modules/moment/locale/be.js",
	"./be.js": "./node_modules/moment/locale/be.js",
	"./bg": "./node_modules/moment/locale/bg.js",
	"./bg.js": "./node_modules/moment/locale/bg.js",
	"./bm": "./node_modules/moment/locale/bm.js",
	"./bm.js": "./node_modules/moment/locale/bm.js",
	"./bn": "./node_modules/moment/locale/bn.js",
	"./bn.js": "./node_modules/moment/locale/bn.js",
	"./bo": "./node_modules/moment/locale/bo.js",
	"./bo.js": "./node_modules/moment/locale/bo.js",
	"./br": "./node_modules/moment/locale/br.js",
	"./br.js": "./node_modules/moment/locale/br.js",
	"./bs": "./node_modules/moment/locale/bs.js",
	"./bs.js": "./node_modules/moment/locale/bs.js",
	"./ca": "./node_modules/moment/locale/ca.js",
	"./ca.js": "./node_modules/moment/locale/ca.js",
	"./cs": "./node_modules/moment/locale/cs.js",
	"./cs.js": "./node_modules/moment/locale/cs.js",
	"./cv": "./node_modules/moment/locale/cv.js",
	"./cv.js": "./node_modules/moment/locale/cv.js",
	"./cy": "./node_modules/moment/locale/cy.js",
	"./cy.js": "./node_modules/moment/locale/cy.js",
	"./da": "./node_modules/moment/locale/da.js",
	"./da.js": "./node_modules/moment/locale/da.js",
	"./de": "./node_modules/moment/locale/de.js",
	"./de-at": "./node_modules/moment/locale/de-at.js",
	"./de-at.js": "./node_modules/moment/locale/de-at.js",
	"./de-ch": "./node_modules/moment/locale/de-ch.js",
	"./de-ch.js": "./node_modules/moment/locale/de-ch.js",
	"./de.js": "./node_modules/moment/locale/de.js",
	"./dv": "./node_modules/moment/locale/dv.js",
	"./dv.js": "./node_modules/moment/locale/dv.js",
	"./el": "./node_modules/moment/locale/el.js",
	"./el.js": "./node_modules/moment/locale/el.js",
	"./en-SG": "./node_modules/moment/locale/en-SG.js",
	"./en-SG.js": "./node_modules/moment/locale/en-SG.js",
	"./en-au": "./node_modules/moment/locale/en-au.js",
	"./en-au.js": "./node_modules/moment/locale/en-au.js",
	"./en-ca": "./node_modules/moment/locale/en-ca.js",
	"./en-ca.js": "./node_modules/moment/locale/en-ca.js",
	"./en-gb": "./node_modules/moment/locale/en-gb.js",
	"./en-gb.js": "./node_modules/moment/locale/en-gb.js",
	"./en-ie": "./node_modules/moment/locale/en-ie.js",
	"./en-ie.js": "./node_modules/moment/locale/en-ie.js",
	"./en-il": "./node_modules/moment/locale/en-il.js",
	"./en-il.js": "./node_modules/moment/locale/en-il.js",
	"./en-nz": "./node_modules/moment/locale/en-nz.js",
	"./en-nz.js": "./node_modules/moment/locale/en-nz.js",
	"./eo": "./node_modules/moment/locale/eo.js",
	"./eo.js": "./node_modules/moment/locale/eo.js",
	"./es": "./node_modules/moment/locale/es.js",
	"./es-do": "./node_modules/moment/locale/es-do.js",
	"./es-do.js": "./node_modules/moment/locale/es-do.js",
	"./es-us": "./node_modules/moment/locale/es-us.js",
	"./es-us.js": "./node_modules/moment/locale/es-us.js",
	"./es.js": "./node_modules/moment/locale/es.js",
	"./et": "./node_modules/moment/locale/et.js",
	"./et.js": "./node_modules/moment/locale/et.js",
	"./eu": "./node_modules/moment/locale/eu.js",
	"./eu.js": "./node_modules/moment/locale/eu.js",
	"./fa": "./node_modules/moment/locale/fa.js",
	"./fa.js": "./node_modules/moment/locale/fa.js",
	"./fi": "./node_modules/moment/locale/fi.js",
	"./fi.js": "./node_modules/moment/locale/fi.js",
	"./fo": "./node_modules/moment/locale/fo.js",
	"./fo.js": "./node_modules/moment/locale/fo.js",
	"./fr": "./node_modules/moment/locale/fr.js",
	"./fr-ca": "./node_modules/moment/locale/fr-ca.js",
	"./fr-ca.js": "./node_modules/moment/locale/fr-ca.js",
	"./fr-ch": "./node_modules/moment/locale/fr-ch.js",
	"./fr-ch.js": "./node_modules/moment/locale/fr-ch.js",
	"./fr.js": "./node_modules/moment/locale/fr.js",
	"./fy": "./node_modules/moment/locale/fy.js",
	"./fy.js": "./node_modules/moment/locale/fy.js",
	"./ga": "./node_modules/moment/locale/ga.js",
	"./ga.js": "./node_modules/moment/locale/ga.js",
	"./gd": "./node_modules/moment/locale/gd.js",
	"./gd.js": "./node_modules/moment/locale/gd.js",
	"./gl": "./node_modules/moment/locale/gl.js",
	"./gl.js": "./node_modules/moment/locale/gl.js",
	"./gom-latn": "./node_modules/moment/locale/gom-latn.js",
	"./gom-latn.js": "./node_modules/moment/locale/gom-latn.js",
	"./gu": "./node_modules/moment/locale/gu.js",
	"./gu.js": "./node_modules/moment/locale/gu.js",
	"./he": "./node_modules/moment/locale/he.js",
	"./he.js": "./node_modules/moment/locale/he.js",
	"./hi": "./node_modules/moment/locale/hi.js",
	"./hi.js": "./node_modules/moment/locale/hi.js",
	"./hr": "./node_modules/moment/locale/hr.js",
	"./hr.js": "./node_modules/moment/locale/hr.js",
	"./hu": "./node_modules/moment/locale/hu.js",
	"./hu.js": "./node_modules/moment/locale/hu.js",
	"./hy-am": "./node_modules/moment/locale/hy-am.js",
	"./hy-am.js": "./node_modules/moment/locale/hy-am.js",
	"./id": "./node_modules/moment/locale/id.js",
	"./id.js": "./node_modules/moment/locale/id.js",
	"./is": "./node_modules/moment/locale/is.js",
	"./is.js": "./node_modules/moment/locale/is.js",
	"./it": "./node_modules/moment/locale/it.js",
	"./it-ch": "./node_modules/moment/locale/it-ch.js",
	"./it-ch.js": "./node_modules/moment/locale/it-ch.js",
	"./it.js": "./node_modules/moment/locale/it.js",
	"./ja": "./node_modules/moment/locale/ja.js",
	"./ja.js": "./node_modules/moment/locale/ja.js",
	"./jv": "./node_modules/moment/locale/jv.js",
	"./jv.js": "./node_modules/moment/locale/jv.js",
	"./ka": "./node_modules/moment/locale/ka.js",
	"./ka.js": "./node_modules/moment/locale/ka.js",
	"./kk": "./node_modules/moment/locale/kk.js",
	"./kk.js": "./node_modules/moment/locale/kk.js",
	"./km": "./node_modules/moment/locale/km.js",
	"./km.js": "./node_modules/moment/locale/km.js",
	"./kn": "./node_modules/moment/locale/kn.js",
	"./kn.js": "./node_modules/moment/locale/kn.js",
	"./ko": "./node_modules/moment/locale/ko.js",
	"./ko.js": "./node_modules/moment/locale/ko.js",
	"./ku": "./node_modules/moment/locale/ku.js",
	"./ku.js": "./node_modules/moment/locale/ku.js",
	"./ky": "./node_modules/moment/locale/ky.js",
	"./ky.js": "./node_modules/moment/locale/ky.js",
	"./lb": "./node_modules/moment/locale/lb.js",
	"./lb.js": "./node_modules/moment/locale/lb.js",
	"./lo": "./node_modules/moment/locale/lo.js",
	"./lo.js": "./node_modules/moment/locale/lo.js",
	"./lt": "./node_modules/moment/locale/lt.js",
	"./lt.js": "./node_modules/moment/locale/lt.js",
	"./lv": "./node_modules/moment/locale/lv.js",
	"./lv.js": "./node_modules/moment/locale/lv.js",
	"./me": "./node_modules/moment/locale/me.js",
	"./me.js": "./node_modules/moment/locale/me.js",
	"./mi": "./node_modules/moment/locale/mi.js",
	"./mi.js": "./node_modules/moment/locale/mi.js",
	"./mk": "./node_modules/moment/locale/mk.js",
	"./mk.js": "./node_modules/moment/locale/mk.js",
	"./ml": "./node_modules/moment/locale/ml.js",
	"./ml.js": "./node_modules/moment/locale/ml.js",
	"./mn": "./node_modules/moment/locale/mn.js",
	"./mn.js": "./node_modules/moment/locale/mn.js",
	"./mr": "./node_modules/moment/locale/mr.js",
	"./mr.js": "./node_modules/moment/locale/mr.js",
	"./ms": "./node_modules/moment/locale/ms.js",
	"./ms-my": "./node_modules/moment/locale/ms-my.js",
	"./ms-my.js": "./node_modules/moment/locale/ms-my.js",
	"./ms.js": "./node_modules/moment/locale/ms.js",
	"./mt": "./node_modules/moment/locale/mt.js",
	"./mt.js": "./node_modules/moment/locale/mt.js",
	"./my": "./node_modules/moment/locale/my.js",
	"./my.js": "./node_modules/moment/locale/my.js",
	"./nb": "./node_modules/moment/locale/nb.js",
	"./nb.js": "./node_modules/moment/locale/nb.js",
	"./ne": "./node_modules/moment/locale/ne.js",
	"./ne.js": "./node_modules/moment/locale/ne.js",
	"./nl": "./node_modules/moment/locale/nl.js",
	"./nl-be": "./node_modules/moment/locale/nl-be.js",
	"./nl-be.js": "./node_modules/moment/locale/nl-be.js",
	"./nl.js": "./node_modules/moment/locale/nl.js",
	"./nn": "./node_modules/moment/locale/nn.js",
	"./nn.js": "./node_modules/moment/locale/nn.js",
	"./pa-in": "./node_modules/moment/locale/pa-in.js",
	"./pa-in.js": "./node_modules/moment/locale/pa-in.js",
	"./pl": "./node_modules/moment/locale/pl.js",
	"./pl.js": "./node_modules/moment/locale/pl.js",
	"./pt": "./node_modules/moment/locale/pt.js",
	"./pt-br": "./node_modules/moment/locale/pt-br.js",
	"./pt-br.js": "./node_modules/moment/locale/pt-br.js",
	"./pt.js": "./node_modules/moment/locale/pt.js",
	"./ro": "./node_modules/moment/locale/ro.js",
	"./ro.js": "./node_modules/moment/locale/ro.js",
	"./ru": "./node_modules/moment/locale/ru.js",
	"./ru.js": "./node_modules/moment/locale/ru.js",
	"./sd": "./node_modules/moment/locale/sd.js",
	"./sd.js": "./node_modules/moment/locale/sd.js",
	"./se": "./node_modules/moment/locale/se.js",
	"./se.js": "./node_modules/moment/locale/se.js",
	"./si": "./node_modules/moment/locale/si.js",
	"./si.js": "./node_modules/moment/locale/si.js",
	"./sk": "./node_modules/moment/locale/sk.js",
	"./sk.js": "./node_modules/moment/locale/sk.js",
	"./sl": "./node_modules/moment/locale/sl.js",
	"./sl.js": "./node_modules/moment/locale/sl.js",
	"./sq": "./node_modules/moment/locale/sq.js",
	"./sq.js": "./node_modules/moment/locale/sq.js",
	"./sr": "./node_modules/moment/locale/sr.js",
	"./sr-cyrl": "./node_modules/moment/locale/sr-cyrl.js",
	"./sr-cyrl.js": "./node_modules/moment/locale/sr-cyrl.js",
	"./sr.js": "./node_modules/moment/locale/sr.js",
	"./ss": "./node_modules/moment/locale/ss.js",
	"./ss.js": "./node_modules/moment/locale/ss.js",
	"./sv": "./node_modules/moment/locale/sv.js",
	"./sv.js": "./node_modules/moment/locale/sv.js",
	"./sw": "./node_modules/moment/locale/sw.js",
	"./sw.js": "./node_modules/moment/locale/sw.js",
	"./ta": "./node_modules/moment/locale/ta.js",
	"./ta.js": "./node_modules/moment/locale/ta.js",
	"./te": "./node_modules/moment/locale/te.js",
	"./te.js": "./node_modules/moment/locale/te.js",
	"./tet": "./node_modules/moment/locale/tet.js",
	"./tet.js": "./node_modules/moment/locale/tet.js",
	"./tg": "./node_modules/moment/locale/tg.js",
	"./tg.js": "./node_modules/moment/locale/tg.js",
	"./th": "./node_modules/moment/locale/th.js",
	"./th.js": "./node_modules/moment/locale/th.js",
	"./tl-ph": "./node_modules/moment/locale/tl-ph.js",
	"./tl-ph.js": "./node_modules/moment/locale/tl-ph.js",
	"./tlh": "./node_modules/moment/locale/tlh.js",
	"./tlh.js": "./node_modules/moment/locale/tlh.js",
	"./tr": "./node_modules/moment/locale/tr.js",
	"./tr.js": "./node_modules/moment/locale/tr.js",
	"./tzl": "./node_modules/moment/locale/tzl.js",
	"./tzl.js": "./node_modules/moment/locale/tzl.js",
	"./tzm": "./node_modules/moment/locale/tzm.js",
	"./tzm-latn": "./node_modules/moment/locale/tzm-latn.js",
	"./tzm-latn.js": "./node_modules/moment/locale/tzm-latn.js",
	"./tzm.js": "./node_modules/moment/locale/tzm.js",
	"./ug-cn": "./node_modules/moment/locale/ug-cn.js",
	"./ug-cn.js": "./node_modules/moment/locale/ug-cn.js",
	"./uk": "./node_modules/moment/locale/uk.js",
	"./uk.js": "./node_modules/moment/locale/uk.js",
	"./ur": "./node_modules/moment/locale/ur.js",
	"./ur.js": "./node_modules/moment/locale/ur.js",
	"./uz": "./node_modules/moment/locale/uz.js",
	"./uz-latn": "./node_modules/moment/locale/uz-latn.js",
	"./uz-latn.js": "./node_modules/moment/locale/uz-latn.js",
	"./uz.js": "./node_modules/moment/locale/uz.js",
	"./vi": "./node_modules/moment/locale/vi.js",
	"./vi.js": "./node_modules/moment/locale/vi.js",
	"./x-pseudo": "./node_modules/moment/locale/x-pseudo.js",
	"./x-pseudo.js": "./node_modules/moment/locale/x-pseudo.js",
	"./yo": "./node_modules/moment/locale/yo.js",
	"./yo.js": "./node_modules/moment/locale/yo.js",
	"./zh-cn": "./node_modules/moment/locale/zh-cn.js",
	"./zh-cn.js": "./node_modules/moment/locale/zh-cn.js",
	"./zh-hk": "./node_modules/moment/locale/zh-hk.js",
	"./zh-hk.js": "./node_modules/moment/locale/zh-hk.js",
	"./zh-tw": "./node_modules/moment/locale/zh-tw.js",
	"./zh-tw.js": "./node_modules/moment/locale/zh-tw.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/moment/locale sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./node_modules/semantic-ui-css/semantic.min.css":
/*!*******************************************************!*\
  !*** ./node_modules/semantic-ui-css/semantic.min.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "./src/api/api.errors.ts":
/*!*******************************!*\
  !*** ./src/api/api.errors.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class NetworkProblems extends Error {
}
exports.NetworkProblems = NetworkProblems;
class ServerError extends Error {
}
exports.ServerError = ServerError;
class AuthError extends Error {
}
exports.AuthError = AuthError;
var ApiErrorCode;
(function (ApiErrorCode) {
})(ApiErrorCode = exports.ApiErrorCode || (exports.ApiErrorCode = {}));
class ApiError extends Error {
    constructor(code) {
        super();
        this.code = code;
    }
}
exports.ApiError = ApiError;


/***/ }),

/***/ "./src/api/domain.api.ts":
/*!*******************************!*\
  !*** ./src/api/domain.api.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/Rx.js");
const c_1 = __webpack_require__(/*! ../c */ "./src/c.tsx");
const api_errors_1 = __webpack_require__(/*! ./api.errors */ "./src/api/api.errors.ts");
class DomainApi {
    constructor() {
        this.progressObservable = rxjs_1.Observable.create((observer) => {
            var keepAlive = true;
            var ws;
            const connect = () => {
                console.log('connecting to ' + c_1.C.API_WS_URI);
                ws = new WebSocket(c_1.C.API_WS_URI);
                ws.onopen = () => {
                    console.log('ws connection established');
                };
                ws.onmessage = (event) => {
                    observer.next(event);
                };
                ws.onerror = (event) => {
                    console.log('ws error', event);
                };
                ws.onclose = (event) => {
                    if (keepAlive) {
                        console.log('ws connection closed when keepAlive', event.code, event.reason);
                        ws.onmessage = () => null;
                        ws.onclose = () => null;
                        setTimeout(connect, 1000);
                    }
                    else {
                        observer.complete();
                    }
                };
            };
            connect();
            return () => {
                if (ws) {
                    keepAlive = false;
                    ws.close();
                }
            };
        }).share();
    }
    catchNetworkProblems(error) {
        if (error instanceof TypeError && error.message == 'Failed to fetch')
            return rxjs_1.Observable.throw(new api_errors_1.NetworkProblems());
        return rxjs_1.Observable.throw(error);
    }
    json(res, auth) {
        if (auth && res.status === 403) {
            auth.onRejected();
            return rxjs_1.Observable.throw(new api_errors_1.AuthError());
        }
        if (res.status != 200)
            return rxjs_1.Observable.throw(new api_errors_1.ServerError());
        return rxjs_1.Observable.fromPromise(res.json());
    }
    searchCertificates(auth, query) {
        let uri = c_1.C.API_BASE_URI + '/certificates';
        if (query)
            uri += `?search=${encodeURIComponent(query)}`;
        let headers = { 'X-Secret': auth.secret };
        return rxjs_1.Observable.fromPromise(fetch(uri, { headers }))
            ._catch(this.catchNetworkProblems)
            .flatMap(res => this.json(res, auth))
            .map(json => {
            return json.data.map(item => {
                const certificate = {
                    id: item.id,
                    contractNumber: item.contract_number,
                    certificateNumber: item.certificate_number,
                    collectionMethod: item.collection_method,
                    syncDate: new Date(item.sync_date),
                    issueDate: item.issue_date,
                    deliveryDate: item.delivery_date,
                    webpageUri: item.webpage_uri,
                    viewPdfUri: item.view_pdf_uri,
                    downloadPdfUri: item.download_pdf_uri,
                    specs: item.specs,
                };
                return certificate;
            });
        });
    }
    syncCertificates(auth, numbers) {
        return rxjs_1.Observable.fromPromise(fetch(c_1.C.API_BASE_URI + '/certificates', {
            method: 'POST',
            headers: {
                'X-Secret': auth.secret,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ numbers })
        }))
            ._catch(this.catchNetworkProblems)
            .flatMap(res => this.json(res, auth))
            .map(json => json.status === 'RUNNING');
    }
    listenSyncCertificatesProgress() {
        return this.progressObservable
            .map(event => JSON.parse(event.data))
            .filter(data => ['SYNC_COMPLETE', 'SYNC_ERROR', 'SYNC_PROGRESS']
            .includes(data.type));
    }
    searchContracts(auth, query) {
        let uri = c_1.C.API_BASE_URI + '/contracts';
        if (query)
            uri += `?search=${encodeURIComponent(query)}`;
        let headers = { 'X-Secret': auth.secret };
        return rxjs_1.Observable.fromPromise(fetch(uri, { headers }))
            ._catch(this.catchNetworkProblems)
            .flatMap(res => this.json(res, auth))
            .map(json => {
            return json.data.map(item => {
                const contract = {
                    id: item.id,
                    contractTimestamp: item.contract_timestamp,
                    downloadPdfUri: item.download_pdf_uri,
                    syncDate: new Date(item.sync_date)
                };
                return contract;
            });
        });
    }
    uploadContracts(auth, files) {
        const data = new FormData();
        files.forEach(file => data.append(file.name, file));
        let headers = { 'X-Secret': auth.secret };
        return rxjs_1.Observable.fromPromise(fetch(c_1.C.API_BASE_URI + '/contracts', {
            method: 'POST',
            body: data,
            headers,
        }))
            ._catch(this.catchNetworkProblems)
            .flatMap(res => this.json(res, auth))
            .map(json => json.status === 'RUNNING');
    }
    listenUploadContractsProgress() {
        return this.progressObservable
            .map(event => JSON.parse(event.data))
            .filter(data => ['UPLOAD_COMPLETE', 'UPLOAD_ERROR', 'UPLOAD_PROGRESS']
            .includes(data.type));
    }
}
exports.DomainApi = DomainApi;


/***/ }),

/***/ "./src/api/index.ts":
/*!**************************!*\
  !*** ./src/api/index.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const domain_api_1 = __webpack_require__(/*! ./domain.api */ "./src/api/domain.api.ts");
class Api {
    constructor() {
        this.domain = new domain_api_1.DomainApi();
    }
}
exports.Api = Api;


/***/ }),

/***/ "./src/app.tsx":
/*!*********************!*\
  !*** ./src/app.tsx ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(/*! semantic-ui-css/semantic.min.css */ "./node_modules/semantic-ui-css/semantic.min.css");
__webpack_require__(/*! ../main.css */ "./main.css");
const React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
const ReactDOM = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
const react_router_dom_1 = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/index.js");
const mobx_react_1 = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/index.module.js");
const semantic_ui_react_1 = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/index.js");
const app_bar_1 = __webpack_require__(/*! ./views/components/app_bar */ "./src/views/components/app_bar.tsx");
const certificates_screen_1 = __webpack_require__(/*! ./views/screens/certificates.screen */ "./src/views/screens/certificates.screen.tsx");
const sync_screen_1 = __webpack_require__(/*! ./views/screens/sync.screen */ "./src/views/screens/sync.screen.tsx");
const api_1 = __webpack_require__(/*! ./api */ "./src/api/index.ts");
const stores_1 = __webpack_require__(/*! ./stores */ "./src/stores/index.ts");
const upload_screen_1 = __webpack_require__(/*! ./views/screens/upload.screen */ "./src/views/screens/upload.screen.tsx");
const contracts_screen_1 = __webpack_require__(/*! ./views/screens/contracts.screen */ "./src/views/screens/contracts.screen.tsx");
const api = new api_1.Api();
const stores = stores_1.createStores(api);
class App extends React.Component {
    render() {
        return (React.createElement(mobx_react_1.Provider, Object.assign({}, stores),
            React.createElement(react_router_dom_1.BrowserRouter, null,
                React.createElement(semantic_ui_react_1.Container, { id: 'screen' },
                    React.createElement(app_bar_1.AppBar, null),
                    React.createElement(react_router_dom_1.Route, { exact: true, path: "/", component: certificates_screen_1.CertificateListScreen }),
                    React.createElement(react_router_dom_1.Route, { path: "/certificates", component: certificates_screen_1.CertificateListScreen }),
                    React.createElement(react_router_dom_1.Route, { path: "/contracts", component: contracts_screen_1.ContractListScreen }),
                    React.createElement(react_router_dom_1.Route, { path: "/sync", component: sync_screen_1.SyncContractsScreen }),
                    React.createElement(react_router_dom_1.Route, { path: "/upload", component: upload_screen_1.UploadScreen })))));
    }
}
ReactDOM.render(React.createElement(App, null), document.getElementById('content'));


/***/ }),

/***/ "./src/c.tsx":
/*!*******************!*\
  !*** ./src/c.tsx ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var C;
(function (C) {
    C.BACKEND_HOST =  false ? undefined : '127.0.0.1';
    C.BACKEND_PORT = 3001;
    C.API_BASE_URI = `http://${C.BACKEND_HOST}:${C.BACKEND_PORT}/api/v2`;
    C.API_WS_URI = `ws://${C.BACKEND_HOST}:${C.BACKEND_PORT}`;
    C.CERTIFICATES_PER_PAGE = 50;
    C.CONTRACTS_PER_PAGE = C.CERTIFICATES_PER_PAGE;
    C.SYNC_STATES_PER_PAGE = C.CERTIFICATES_PER_PAGE;
    C.UPLOADT_STATES_PER_PAGE = C.CERTIFICATES_PER_PAGE;
})(C = exports.C || (exports.C = {}));


/***/ }),

/***/ "./src/i18n/index.ts":
/*!***************************!*\
  !*** ./src/i18n/index.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const async_models_1 = __webpack_require__(/*! ../models/async.models */ "./src/models/async.models.ts");
const domain_models_1 = __webpack_require__(/*! ../models/domain.models */ "./src/models/domain.models.ts");
class I18N {
    static asyncError(error) {
        switch (error.type) {
            case async_models_1.AsyncErrorType.NETWORK_PROBLEMS:
                return {
                    title: 'Network problems',
                    subtitle: 'Please, check your internet connection'
                };
            case async_models_1.AsyncErrorType.SERVER_ERROR:
                return {
                    title: 'Server Error',
                    subtitle: 'Please, try again later'
                };
            case async_models_1.AsyncErrorType.AUTH_ERROR:
                return {
                    title: 'Invalid Secret Key',
                    subtitle: 'Reload page to continue'
                };
            default:
                return {
                    title: 'Application Error',
                    subtitle: 'Please, contact your system administrator'
                };
        }
    }
}
I18N.common_appName = 'PDF Search';
I18N.common_documents = 'Documents';
I18N.common_certificates = 'Certificates';
I18N.common_contacts = 'Contracts';
I18N.common_sync = 'Sync';
I18N.common_syncCertificates = 'Sync Certificates';
I18N.common_uploadContracts = 'Upload Contracts';
I18N.common_upload = 'Upload';
I18N.common_search = 'Search';
I18N.common_searchPlaceholder = 'Search...';
I18N.common_syncPlaceholder = 'Contract numbers (1,2,3 or 1-3)';
I18N.certificate_contractNumber = '合同号';
I18N.certificate_certificateNumber = '证书号';
I18N.certificate_collectionMethod = '收集方式';
I18N.certificate_syncDate = 'Sync Date';
I18N.certificate_issueDate = '签发日期';
I18N.certificate_deliveryDate = '交货日期';
I18N.certificate_webpageUri = 'Webpage';
I18N.certificate_viewPdfUri = '查看PDF详情';
I18N.certificate_openPdfLink = 'PDF';
I18N.certificate_openWebpageLink = 'Webpage';
I18N.contract_timestamp = 'Name';
I18N.contract_syncDate = I18N.certificate_syncDate;
I18N.contract_downloadPdfUri = I18N.certificate_viewPdfUri;
I18N.contract_openPdfLink = 'PDF';
I18N.searchCertificate_resultMessage = (number) => number == 1 ? '1 certificate found' : `${number} certificates found`;
I18N.searchCertificate_emptyQueryError = 'Enter contract numbers range';
I18N.searchCertificate_invalidQueryError = {
    message: 'Invalid contract numbers format, use:',
    example1: 'list (1,2,3,99)',
    example2: 'range (1-99)'
};
I18N.searchContract_resultMessage = (number) => number == 1 ? '1 contract found' : `${number} contracts found`;
I18N.syncCertificate_confirmSyncMessage = (query, number) => `Are you sure you want to synchronize ${query} certificate(s). Total number is ${number}.`;
I18N.syncCertificate_syncFinishedMessage = (count) => `Sync complete with ${count} successfully processed certificates`;
I18N.syncCertificate_contractNumber = I18N.certificate_contractNumber;
I18N.syncCertificate_phase = 'Status';
I18N.syncCertificate_progress = 'Progress';
I18N.syncCertificate_fromSyncPhase = (phase) => {
    switch (phase) {
        case domain_models_1.SyncPhase.AWAITS:
            return 'Waiting...';
        case domain_models_1.SyncPhase.PARSING_WEBPAGE:
            return 'Parsing webpage';
        case domain_models_1.UploadPhase.UPLOADIN_PDF:
            return 'Uploading PDF';
        case domain_models_1.SyncPhase.DOWNLOADIN_PDF:
            return 'Downloading PDF';
        case domain_models_1.SyncPhase.PARSING_PDF:
            return 'Parsing PDF';
        case domain_models_1.SyncPhase.STORING_DATA:
            return 'Storing result';
        case domain_models_1.SyncPhase.COMPLETE:
            return 'Complete';
        case domain_models_1.SyncPhase.DOCUMENT_NOT_FOUND:
            return 'Certificate not found';
        case domain_models_1.SyncPhase.TIMEOUT_ERROR:
            return 'Timeout';
        case domain_models_1.SyncPhase.CONNECTION_PROBLEMS:
            return 'Failed to connect to esales.baosteel.com';
        default:
            return 'Server error';
    }
};
I18N.uploadContract_phase = I18N.syncCertificate_phase;
I18N.uploadContract_progress = I18N.syncCertificate_progress;
I18N.uploadContract_noSuitableFilesError = 'No suitable pdf files selected';
I18N.uploadContract_confirmMessage = (count) => `Are you sure you want to upload ${count} contracts(s)?`;
I18N.uploadContract_finishMessage = (count) => `${count} contract(s) uploaded successfully`;
exports.I18N = I18N;


/***/ }),

/***/ "./src/models/async.models.ts":
/*!************************************!*\
  !*** ./src/models/async.models.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const api_errors_1 = __webpack_require__(/*! ../api/api.errors */ "./src/api/api.errors.ts");
var AsyncStatus;
(function (AsyncStatus) {
    AsyncStatus["NEW"] = "NEW";
    AsyncStatus["IN_PROGRESS"] = "IN_PROGRESS";
    AsyncStatus["SUCCESS"] = "SUCCESS";
    AsyncStatus["FAILED"] = "FAILED";
})(AsyncStatus = exports.AsyncStatus || (exports.AsyncStatus = {}));
var AsyncErrorType;
(function (AsyncErrorType) {
    AsyncErrorType["NETWORK_PROBLEMS"] = "NETWORK_PROBLEMS";
    AsyncErrorType["SERVER_ERROR"] = "SERVER_ERROR";
    AsyncErrorType["AUTH_ERROR"] = "AUTH_ERROR";
    AsyncErrorType["APP_ERROR"] = "APP_ERROR";
    AsyncErrorType["API_ERROR"] = "API_ERROR";
})(AsyncErrorType = exports.AsyncErrorType || (exports.AsyncErrorType = {}));
var AsyncErrorSevirity;
(function (AsyncErrorSevirity) {
    AsyncErrorSevirity["ERROR"] = "ERROR";
    AsyncErrorSevirity["WARNING"] = "WARNING";
    AsyncErrorSevirity["EXPECRED"] = "EXPECRED";
})(AsyncErrorSevirity = exports.AsyncErrorSevirity || (exports.AsyncErrorSevirity = {}));
class AsyncError extends Error {
    constructor(type, sevirity, error) {
        super();
        this.type = type;
        this.sevirity = sevirity;
        this.error = error;
    }
}
AsyncError.networkProblems = () => new AsyncError(AsyncErrorType.NETWORK_PROBLEMS, AsyncErrorSevirity.WARNING);
AsyncError.serverError = () => new AsyncError(AsyncErrorType.SERVER_ERROR, AsyncErrorSevirity.ERROR);
AsyncError.appError = () => new AsyncError(AsyncErrorType.APP_ERROR, AsyncErrorSevirity.ERROR);
AsyncError.apiError = (code) => new AsyncError(AsyncErrorType.APP_ERROR, AsyncErrorSevirity.EXPECRED, code);
AsyncError.authError = () => new AsyncError(AsyncErrorType.AUTH_ERROR, AsyncErrorSevirity.WARNING);
exports.AsyncError = AsyncError;
class AsyncState {
    constructor(status, value, error) {
        this.isNew = () => this.status === AsyncStatus.NEW;
        this.isInProgress = () => this.status === AsyncStatus.IN_PROGRESS;
        this.isSuccessful = () => this.status === AsyncStatus.SUCCESS;
        this.isFailed = () => this.status == AsyncStatus.FAILED;
        this.isUseless = () => this.isNew() || this.isFailed();
        this.status = status || AsyncStatus.NEW;
        this.value = value;
        this.error = error;
    }
    static create(value) {
        return new AsyncState(AsyncStatus.NEW, value);
    }
    static success(value) {
        return new AsyncState(AsyncStatus.SUCCESS, value);
    }
    static inProgress(value) {
        return new AsyncState(AsyncStatus.IN_PROGRESS, value);
    }
    static failed(error, value) {
        if (error instanceof api_errors_1.NetworkProblems)
            return new AsyncState(AsyncStatus.FAILED, value, AsyncError.networkProblems());
        if (error instanceof api_errors_1.ServerError)
            return new AsyncState(AsyncStatus.FAILED, value, AsyncError.serverError());
        if (error instanceof api_errors_1.ApiError)
            return new AsyncState(AsyncStatus.FAILED, value, AsyncError.apiError(error.code));
        if (error instanceof AsyncError)
            return new AsyncState(AsyncStatus.FAILED, value, error);
        if (error instanceof api_errors_1.AuthError)
            return new AsyncState(AsyncStatus.FAILED, value, AsyncError.authError());
        console.error(error);
        if (error instanceof Error)
            console.log(error.stack);
        return new AsyncState(AsyncStatus.FAILED, value, AsyncError.appError());
    }
    isEqual(other) {
        return this.status === other.status && this.value === other.value;
    }
    isNotEqual(other) {
        return !this.isEqual(other);
    }
}
exports.AsyncState = AsyncState;


/***/ }),

/***/ "./src/models/domain.models.ts":
/*!*************************************!*\
  !*** ./src/models/domain.models.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Auth {
}
exports.Auth = Auth;
var SyncPhase;
(function (SyncPhase) {
    SyncPhase["AWAITS"] = "AWAITS";
    SyncPhase["PARSING_WEBPAGE"] = "PARSING_WEBPAGE";
    SyncPhase["DOWNLOADIN_PDF"] = "DOWNLOADIN_PDF";
    SyncPhase["PARSING_PDF"] = "PARSING_PDF";
    SyncPhase["STORING_DATA"] = "STORING_DATA";
    SyncPhase["COMPLETE"] = "COMPLETE";
    SyncPhase["DOCUMENT_NOT_FOUND"] = "DOCUMENT_NOT_FOUND";
    SyncPhase["CONNECTION_PROBLEMS"] = "CONNECTION_PROBLEMS";
    SyncPhase["TIMEOUT_ERROR"] = "TIMEOUT_ERROR";
    SyncPhase["ERROR"] = "ERROR";
})(SyncPhase = exports.SyncPhase || (exports.SyncPhase = {}));
exports.isSyncPhaseInProgress = (phase) => phase == SyncPhase.PARSING_WEBPAGE ||
    phase == SyncPhase.DOWNLOADIN_PDF ||
    phase == SyncPhase.PARSING_PDF ||
    phase == SyncPhase.STORING_DATA;
exports.isSyncPhaseFailed = (phase) => phase == SyncPhase.ERROR ||
    phase == SyncPhase.TIMEOUT_ERROR ||
    phase == SyncPhase.CONNECTION_PROBLEMS ||
    phase == SyncPhase.DOCUMENT_NOT_FOUND;
var UploadPhase;
(function (UploadPhase) {
    UploadPhase["AWAITS"] = "AWAITS";
    UploadPhase["UPLOADIN_PDF"] = "UPLOADIN_PDF";
    UploadPhase["PARSING_PDF"] = "PARSING_PDF";
    UploadPhase["STORING_DATA"] = "STORING_DATA";
    UploadPhase["COMPLETE"] = "COMPLETE";
    UploadPhase["TIMEOUT_ERROR"] = "TIMEOUT_ERROR";
    UploadPhase["ERROR"] = "ERROR";
})(UploadPhase = exports.UploadPhase || (exports.UploadPhase = {}));


/***/ }),

/***/ "./src/stores/domain.store.ts":
/*!************************************!*\
  !*** ./src/stores/domain.store.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = __webpack_require__(/*! mobx */ "./node_modules/mobx/lib/mobx.module.js");
const async_models_1 = __webpack_require__(/*! ../models/async.models */ "./src/models/async.models.ts");
const domain_models_1 = __webpack_require__(/*! ../models/domain.models */ "./src/models/domain.models.ts");
const api_errors_1 = __webpack_require__(/*! ../api/api.errors */ "./src/api/api.errors.ts");
const rxjs_1 = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/Rx.js");
class DomainStore {
    constructor(api) {
        this.syncCertificatesState = async_models_1.AsyncState.create();
        this.searchCertificatesState = async_models_1.AsyncState.create();
        this.searchContractsState = async_models_1.AsyncState.create();
        this.uploadContractsState = async_models_1.AsyncState.create();
        this.recentSearches = ['50.00mm×6.5'];
        this.syncHistory = [];
        this.batchUploading = false;
        this.api = api;
        this.setSecret(localStorage.getItem('X-Secret'));
        const certificateSearchResult = sessionStorage.getItem('certificateSearchResult');
        if (certificateSearchResult) {
            this.searchCertificatesState = async_models_1.AsyncState.success(JSON.parse(certificateSearchResult));
        }
        const contractsSearchResult = sessionStorage.getItem('contactSearchResult');
        if (contractsSearchResult) {
            this.searchContractsState = async_models_1.AsyncState.success(JSON.parse(contractsSearchResult));
        }
        const recentSearches = localStorage.getItem('recentSearches');
        if (recentSearches)
            this.recentSearches = recentSearches.split('\n');
        const syncHistory = localStorage.getItem('syncHistory');
        if (syncHistory)
            this.syncHistory = syncHistory.split('\n')
                .map(item => item.split(':'))
                .map(parts => ({ code: parts[0], query: parts[1] }));
        api.domain.listenSyncCertificatesProgress()
            .bufferTime(500)
            .filter(dataList => dataList.length > 0)
            .subscribe((dataBuf) => {
            var newState;
            for (let i = 0; i < dataBuf.length; i++) {
                const data = dataBuf[i];
                if (data.type == 'SYNC_ERROR') {
                    newState = async_models_1.AsyncState.failed(new api_errors_1.NetworkProblems());
                    break;
                }
                if (data.type == 'SYNC_COMPLETE') {
                    newState = async_models_1.AsyncState.success(data.results);
                    break;
                }
                if (data.type == 'SYNC_PROGRESS') {
                    if (!newState) {
                        var newState = async_models_1.AsyncState.inProgress(this.syncCertificatesState.isInProgress()
                            ? this.syncCertificatesState.value.slice()
                            : []);
                    }
                    data.results.forEach(state => {
                        const stateIdx = newState.value.findIndex(item => item.contractNumber === state.contractNumber);
                        if (stateIdx >= 0) {
                            newState.value[stateIdx] = state;
                        }
                        else {
                            newState.value.push(state);
                        }
                    });
                }
            }
            if (newState)
                this.syncCertificatesState = newState;
        });
        api.domain.listenUploadContractsProgress()
            .bufferTime(500)
            .filter(dataList => dataList.length > 0)
            .subscribe((dataBuf) => {
            var newState;
            for (let i = 0; i < dataBuf.length; i++) {
                const data = dataBuf[i];
                if (data.type == 'UPLOAD_ERROR') {
                    newState = async_models_1.AsyncState.failed(new api_errors_1.NetworkProblems());
                    break;
                }
                if (data.type == 'UPLOAD_COMPLETE') {
                    if (!this.batchUploading) {
                        newState = async_models_1.AsyncState.success(this.uploadContractsState.isInProgress()
                            ? this.uploadContractsState.value
                            : data.results);
                        break;
                    }
                }
                if (data.type == 'UPLOAD_PROGRESS') {
                    if (!newState) {
                        var newState = async_models_1.AsyncState.inProgress(this.uploadContractsState.isInProgress()
                            ? this.uploadContractsState.value.slice()
                            : []);
                    }
                    data.results.forEach(state => {
                        const stateIdx = newState.value.findIndex(item => item.contractTimestamp === state.contractTimestamp);
                        if (stateIdx >= 0) {
                            newState.value[stateIdx] = state;
                        }
                        else {
                            newState.value.push(state);
                        }
                    });
                }
            }
            if (newState)
                this.uploadContractsState = newState;
        });
    }
    setSecret(secret) {
        this.auth = {
            secret: secret,
            onRejected: () => {
                localStorage.removeItem('X-Secret');
            }
        };
        localStorage.setItem('X-Secret', secret);
    }
    saveSyncHistory(code, query) {
        const syncHistory = this.syncHistory.slice();
        const currentIdx = syncHistory.findIndex(i => i.code === code);
        if (currentIdx != -1)
            syncHistory.splice(currentIdx, 1);
        this.syncHistory = [{ code, query }].concat(syncHistory);
        localStorage.setItem('syncHistory', this.syncHistory.map(item => `${item.code}:${item.query}`).join('\n'));
    }
    searchCertificates(query) {
        console.log('searchCertificates()', query);
        this.searchCertificatesState = async_models_1.AsyncState.inProgress();
        if (query && query.length) {
            const recentSearches = [query].concat(this.recentSearches.filter(s => s != query));
            this.recentSearches = recentSearches.splice(0, 10);
            localStorage.setItem('recentSearches', this.recentSearches.join('\n'));
        }
        this.api.domain.searchCertificates(this.auth, query)
            .subscribe((data) => {
            this.searchCertificatesState = async_models_1.AsyncState.success(data);
            sessionStorage.setItem('certificateSearchResult', JSON.stringify(data));
        }, (error) => {
            this.searchCertificatesState = async_models_1.AsyncState.failed(error);
        });
    }
    syncCertificates(numbers) {
        console.log('syncCertificates()', numbers);
        this.syncCertificatesState = async_models_1.AsyncState.inProgress(numbers.map(n => {
            const state = {
                contractNumber: n,
                phase: domain_models_1.SyncPhase.AWAITS
            };
            return state;
        }));
        this.api.domain.syncCertificates(this.auth, numbers)
            .subscribe((_) => null, (error) => {
            this.syncCertificatesState = async_models_1.AsyncState.failed(error);
        });
    }
    searchContracts(query) {
        console.log('searchContracts()', query);
        this.searchContractsState = async_models_1.AsyncState.inProgress();
        this.api.domain.searchContracts(this.auth, query)
            .subscribe((data) => {
            this.searchContractsState = async_models_1.AsyncState.success(data);
            sessionStorage.setItem('contactSearchResult', JSON.stringify(data));
        }, (error) => {
            this.searchContractsState = async_models_1.AsyncState.failed(error);
        });
    }
    uploadContracts(files) {
        console.log('uploadContracts()');
        this.uploadContractsState = async_models_1.AsyncState.inProgress(files.map(file => {
            const state = {
                contractTimestamp: parseInt(file.name.slice(0, -4)),
                phase: domain_models_1.UploadPhase.AWAITS
            };
            return state;
        }));
        this.batchUploading = files.length > 1000;
        rxjs_1.Observable.from(files)
            .bufferCount(1000)
            .flatMap(batch => this.api.domain.uploadContracts(this.auth, batch), 1)
            .subscribe((_) => null, (error) => {
            this.uploadContractsState = async_models_1.AsyncState.failed(error);
        }, () => {
            this.batchUploading = false;
        });
    }
}
__decorate([
    mobx_1.observable,
    __metadata("design:type", domain_models_1.Auth)
], DomainStore.prototype, "auth", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", async_models_1.AsyncState)
], DomainStore.prototype, "syncCertificatesState", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", async_models_1.AsyncState)
], DomainStore.prototype, "searchCertificatesState", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", async_models_1.AsyncState)
], DomainStore.prototype, "searchContractsState", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", async_models_1.AsyncState)
], DomainStore.prototype, "uploadContractsState", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Array)
], DomainStore.prototype, "recentSearches", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Array)
], DomainStore.prototype, "syncHistory", void 0);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainStore.prototype, "setSecret", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DomainStore.prototype, "saveSyncHistory", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainStore.prototype, "searchCertificates", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], DomainStore.prototype, "syncCertificates", null);
__decorate([
    mobx_1.action,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DomainStore.prototype, "searchContracts", null);
exports.DomainStore = DomainStore;


/***/ }),

/***/ "./src/stores/index.ts":
/*!*****************************!*\
  !*** ./src/stores/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const domain_store_1 = __webpack_require__(/*! ./domain.store */ "./src/stores/domain.store.ts");
function createStores(api) {
    return {
        domainStore: new domain_store_1.DomainStore(api),
    };
}
exports.createStores = createStores;


/***/ }),

/***/ "./src/views/components/app_bar.tsx":
/*!******************************************!*\
  !*** ./src/views/components/app_bar.tsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
const mobx_1 = __webpack_require__(/*! mobx */ "./node_modules/mobx/lib/mobx.module.js");
const mobx_react_1 = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/index.module.js");
const react_router_dom_1 = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/es/index.js");
const semantic_ui_react_1 = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/index.js");
const i18n_1 = __webpack_require__(/*! ../../i18n */ "./src/i18n/index.ts");
const _1 = __webpack_require__(/*! . */ "./src/views/components/index.tsx");
const c_1 = __webpack_require__(/*! ../../c */ "./src/c.tsx");
let AppBarComponent = class AppBarComponent extends _1.BaseComponent {
    constructor(props) {
        super(props);
        this.runningOnMobile = navigator.userAgent.toLowerCase().search("iphone") > -1;
        this.state = {
            auth: props.domainStore.auth,
            searchCertificatesState: props.domainStore.searchCertificatesState,
            searchContractsState: props.domainStore.searchContractsState,
            syncCertificatesState: props.domainStore.syncCertificatesState,
            uploadContractsState: props.domainStore.uploadContractsState,
            searchCertificatesQuery: '50.00mm×6.5',
            searchContractsQuery: '',
            syncCertificatesCode: 'G6H66',
            syncCertificatesQuery: '',
            syncCertificatesQueryError: null,
            searchCertificateResultMessage: null,
            searchContractResultMessage: null,
            printCertificatesAfterSync: [],
        };
    }
    componentDidMount() {
        this.disposables = [
            mobx_1.reaction(() => this.props.domainStore.auth, (auth) => this.setState({ auth })),
            mobx_1.reaction(() => this.props.domainStore.searchCertificatesState, (searchCertificatesState) => {
                this.setState({
                    searchCertificatesState,
                    searchCertificateResultMessage: searchCertificatesState.isSuccessful()
                        ? i18n_1.I18N.searchCertificate_resultMessage(searchCertificatesState.value.length)
                        : null
                });
            }),
            mobx_1.reaction(() => this.props.domainStore.searchContractsState, (searchContractsState) => {
                this.setState({
                    searchContractsState,
                    searchContractResultMessage: searchContractsState.isSuccessful()
                        ? i18n_1.I18N.searchContract_resultMessage(searchContractsState.value.length)
                        : null
                });
            }),
            mobx_1.reaction(() => this.props.domainStore.syncCertificatesState, (syncCertificatesState) => {
                if (this.state.printCertificatesAfterSync.length &&
                    syncCertificatesState.isSuccessful() &&
                    this.state.syncCertificatesState.isInProgress()) {
                    this.printSertificatesSpecs(this.state.printCertificatesAfterSync, false);
                    this.state.printCertificatesAfterSync.splice(0);
                }
                if (this.state.printCertificatesAfterSync.length &&
                    syncCertificatesState.isFailed() &&
                    this.state.syncCertificatesState.isInProgress()) {
                    this.state.printCertificatesAfterSync.splice(0);
                }
                let syncCertificatesCode = this.state.syncCertificatesCode, syncCertificatesQuery = this.state.syncCertificatesQuery;
                if (syncCertificatesState.isSuccessful() && syncCertificatesState.value.length) {
                    syncCertificatesCode = syncCertificatesState.value[0].contractNumber.substring(0, 5);
                    try {
                        let min = 9999999, max = 0;
                        syncCertificatesState.value.forEach(s => {
                            const num = parseInt(s.contractNumber.substring(5));
                            if (min > num)
                                min = num;
                            if (max < num)
                                max = num;
                        });
                        syncCertificatesQuery = `${min}-${max}`;
                    }
                    catch (e) {
                        console.error('failed to parse contractNumbers range');
                    }
                }
                this.setState({ syncCertificatesState, syncCertificatesCode, syncCertificatesQuery });
            }),
            mobx_1.reaction(() => this.props.domainStore.uploadContractsState, (uploadContractsState) => {
                this.setState({ uploadContractsState });
            }),
        ];
    }
    searchCertificates() {
        if (this.state.searchCertificatesState.isInProgress())
            return;
        this.props.domainStore.searchCertificates(this.state.searchCertificatesQuery);
    }
    searchContracts() {
        if (this.state.searchContractsState.isInProgress())
            return;
        this.props.domainStore.searchContracts(this.state.searchContractsQuery);
    }
    printSertificatesSpecs(certs, syncWithoutSpecs) {
        if (syncWithoutSpecs) {
            const noSpecs = certs.filter(s => !s.specs).map(s => s.contractNumber);
            if (noSpecs.length) {
                if (this.state.syncCertificatesState.isInProgress()) {
                    alert('Sync already in progress, try again later...');
                    return;
                }
                this.props.domainStore.syncCertificates(noSpecs);
                this.setState({ printCertificatesAfterSync: certs });
                return;
            }
        }
        const uri = c_1.C.API_BASE_URI + '/certificates/specs?format=print&ids=' +
            certs.map(s => s.id).join(',');
        window.open(uri, '_self');
    }
    syncCertificates() {
        if (this.state.syncCertificatesState.isInProgress())
            return;
        const query = this.state.syncCertificatesQuery.trim();
        if (query.length == 0) {
            return this.setState({ syncCertificatesQueryError: i18n_1.I18N.searchCertificate_emptyQueryError });
        }
        const numbers = [];
        if (/^\d+$/.test(query)) {
            numbers.push(query);
        }
        else if (/^\d+-\d+$/.test(query)) {
            const range = query.split('-');
            for (var i = parseInt(range[0]); i <= parseInt(range[1]); i++) {
                numbers.push(i.toString());
            }
        }
        else if (/^\d+(,\d+)*$/.test(query)) {
            numbers.push(...query.split(','));
        }
        if (numbers.length == 0) {
            return this.setState({
                syncCertificatesQueryError: (React.createElement("div", null,
                    React.createElement("span", { style: { whiteSpace: 'nowrap' } }, i18n_1.I18N.searchCertificate_invalidQueryError.message),
                    React.createElement("li", null, i18n_1.I18N.searchCertificate_invalidQueryError.example1),
                    React.createElement("li", null, i18n_1.I18N.searchCertificate_invalidQueryError.example2)))
            });
        }
        const contractNumbers = numbers.map(n => ('0000' + n).substr(-5))
            .map(n => this.state.syncCertificatesCode + n);
        if (confirm(i18n_1.I18N.syncCertificate_confirmSyncMessage(query, contractNumbers.length))) {
            this.props.domainStore.syncCertificates(contractNumbers);
            this.props.domainStore.saveSyncHistory(this.state.syncCertificatesCode, query);
        }
    }
    upload(fileList) {
        const files = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList.item(i);
            if (/^\d{13}.pdf$/.test(file.name))
                files.push(file);
        }
        if (!files.length)
            return alert(i18n_1.I18N.uploadContract_noSuitableFilesError);
        if (confirm(i18n_1.I18N.uploadContract_confirmMessage(files.length)))
            this.props.domainStore.uploadContracts(files);
    }
    renderToolsPanel() {
        if (this.props.history.location.pathname == '/upload') {
            const uploading = this.state.uploadContractsState.isInProgress();
            return (React.createElement(semantic_ui_react_1.Menu.Menu, { position: 'right' },
                React.createElement("input", { type: "file", multiple: true, ref: (ref) => {
                        if (ref) {
                            ref.directory = true;
                            ref.webkitdirectory = true;
                            this.uploadInput = ref;
                        }
                    }, style: { display: 'none' }, onChange: (event) => {
                        this.upload(event.target.files);
                        event.target.value = '';
                    } }),
                React.createElement(semantic_ui_react_1.Menu.Item, { icon: uploading ? null : 'upload', name: i18n_1.I18N.common_upload, onClick: () => this.uploadInput.click() }, uploading ? React.createElement(semantic_ui_react_1.Loader, { active: true, inline: true, size: 'tiny' }) : null)));
        }
        else if (this.props.history.location.pathname == '/sync') {
            return (React.createElement(semantic_ui_react_1.Menu.Menu, { position: 'right' },
                React.createElement(semantic_ui_react_1.Menu.Item, null,
                    React.createElement(semantic_ui_react_1.Popup, { trigger: React.createElement(semantic_ui_react_1.Input, { id: 'syncInput', value: this.state.syncCertificatesQuery, placeholder: i18n_1.I18N.common_syncPlaceholder, error: this.state.syncCertificatesQueryError != null, label: React.createElement(semantic_ui_react_1.Dropdown, { item: true, search: true, selection: true, id: 'syncInputCode', icon: null, noResultsMessage: null, disabled: this.state.syncCertificatesState.isInProgress(), options: this.props.domainStore.syncHistory
                                    .map(item => item.code)
                                    .map((s, i) => ({ key: i, value: s, text: s })), searchInput: React.createElement(semantic_ui_react_1.Dropdown.SearchInput, { autoComplete: 'off', value: this.state.syncCertificatesCode, disabled: this.state.syncCertificatesState.isInProgress(), onChange: (_, data) => this.setState({ syncCertificatesCode: data.value }), onBlur: () => {
                                        if (!this.state.syncCertificatesCode)
                                            this.setState({ syncCertificatesCode: 'G6H66' });
                                    } }), onChange: (_, data) => {
                                    if (data.value) {
                                        const syncHistory = this.props.domainStore.syncHistory
                                            .find(i => i.code === data.value);
                                        this.setState(s => ({
                                            syncCertificatesCode: data.value,
                                            syncCertificatesQuery: syncHistory ?
                                                syncHistory.query : s.syncCertificatesQuery
                                        }));
                                    }
                                } }), loading: this.state.syncCertificatesState.isInProgress(), disabled: this.state.syncCertificatesState.isInProgress(), action: {
                                icon: this.state.syncCertificatesState.isInProgress()
                                    ? null
                                    : 'sync',
                                onClick: () => this.syncCertificates()
                            }, onChange: (_, data) => this.setState({ syncCertificatesQuery: data.value }), onKeyUp: (event) => {
                                event.preventDefault();
                                if (event.keyCode === 13)
                                    this.syncCertificates();
                            } }), content: React.createElement("div", { style: { display: 'flex' } },
                            React.createElement(semantic_ui_react_1.Icon, { name: 'warning circle', style: { paddingTop: 2 } }),
                            this.state.syncCertificatesQueryError), on: 'click', open: this.state.syncCertificatesQueryError != null, onClose: () => this.setState({ syncCertificatesQueryError: null }), position: 'bottom center', inverted: true, hideOnScroll: true }))));
        }
        else if (this.props.history.location.pathname == '/contracts') {
            return (React.createElement(semantic_ui_react_1.Menu.Menu, { position: 'right' },
                React.createElement(semantic_ui_react_1.Menu.Item, null,
                    React.createElement(semantic_ui_react_1.Popup, { trigger: React.createElement(semantic_ui_react_1.Input, { id: 'searchInput', value: this.state.searchContractsQuery, loading: this.state.searchContractsState.isInProgress(), placeholder: i18n_1.I18N.common_searchPlaceholder, action: {
                                icon: this.state.searchContractsState.isInProgress()
                                    ? null
                                    : 'search',
                                onClick: () => this.searchContracts()
                            }, onChange: (_, data) => this.setState({ searchContractsQuery: data.value }), onKeyUp: (event) => {
                                event.preventDefault();
                                if (event.keyCode === 13)
                                    this.searchContracts();
                            } }), content: this.state.searchContractResultMessage, on: 'click', open: this.state.searchContractResultMessage != null, onClose: () => this.setState({ searchContractResultMessage: null }), position: 'bottom right', inverted: true, hideOnScroll: true }))));
        }
        else {
            const specs = this.state.searchCertificatesState.isSuccessful()
                ? this.state.searchCertificatesState.value
                : [];
            return (React.createElement(semantic_ui_react_1.Menu.Menu, { position: 'right' },
                React.createElement(semantic_ui_react_1.Menu.Item, null,
                    React.createElement("div", { className: 'ui action input' },
                        React.createElement(semantic_ui_react_1.Dropdown, { item: true, search: true, selection: true, id: 'searchDropdown', icon: null, noResultsMessage: null, disabled: this.state.searchCertificatesState.isInProgress(), options: this.props.domainStore.recentSearches
                                .map((s, i) => ({ key: i, value: s, text: s })), searchInput: React.createElement(semantic_ui_react_1.Dropdown.SearchInput, { autoComplete: 'off', placeholder: i18n_1.I18N.common_searchPlaceholder, value: this.state.searchCertificatesQuery, disabled: this.state.searchCertificatesState.isInProgress(), onChange: (_, data) => this.setState({ searchCertificatesQuery: data.value }), onKeyUp: (event) => {
                                    event.preventDefault();
                                    if (event.keyCode === 13)
                                        this.searchCertificates();
                                } }), onChange: (event, data) => {
                                if (event instanceof KeyboardEvent && event.code === 'Enter') {
                                    return this.searchCertificates();
                                }
                                if (event.type === 'click' && data.value) {
                                    this.setState({ searchCertificatesQuery: data.value });
                                }
                            } }),
                        React.createElement(semantic_ui_react_1.Popup, { trigger: React.createElement(semantic_ui_react_1.Button, { icon: 'search', loading: this.state.searchCertificatesState.isInProgress(), disabled: this.state.searchCertificatesState.isInProgress(), onClick: (e) => this.searchCertificates() }), content: this.state.searchCertificateResultMessage, on: 'click', open: this.state.searchCertificateResultMessage != null, onClose: () => this.setState({ searchCertificateResultMessage: null }), position: 'bottom right', inverted: true, hideOnScroll: true })),
                    React.createElement(semantic_ui_react_1.Button, { icon: 'print', style: { marginLeft: 5 }, disabled: specs.length === 0, loading: this.state.printCertificatesAfterSync.length > 0, onClick: (e) => this.printSertificatesSpecs(specs, true) }))));
        }
    }
    render() {
        let secret = this.state.auth.secret;
        return (React.createElement(semantic_ui_react_1.Menu, { borderless: true, fixed: 'top' },
            React.createElement(semantic_ui_react_1.Modal, { basic: true, size: 'mini', dimmer: 'blurring', open: secret == null || secret.trim() == '' },
                React.createElement(semantic_ui_react_1.Header, { icon: 'key', content: 'Enter secret key' }),
                React.createElement(semantic_ui_react_1.Modal.Content, null,
                    React.createElement(semantic_ui_react_1.Input, { fluid: true, focus: true, type: 'password', onChange: (_, data) => secret = data.value })),
                React.createElement(semantic_ui_react_1.Modal.Actions, null,
                    React.createElement(semantic_ui_react_1.Button, { color: 'green', onClick: () => this.props.domainStore.setSecret(secret) }, "Save"))),
            React.createElement(semantic_ui_react_1.Container, null,
                React.createElement(semantic_ui_react_1.Menu.Item, { className: 'hideOnMobile logoItem' },
                    React.createElement(semantic_ui_react_1.Image, { size: 'mini', src: 'images/app-logo-small.png' })),
                React.createElement(semantic_ui_react_1.Menu.Item, { header: true, className: "hideOnMobile" }, i18n_1.I18N.common_appName),
                React.createElement(semantic_ui_react_1.Dropdown, { item: true, icon: null, trigger: React.createElement("span", null,
                        React.createElement(semantic_ui_react_1.Icon, { name: 'file pdf' }),
                        React.createElement("span", { className: "hideOnMobile", style: { paddingLeft: 5 } }, i18n_1.I18N.common_documents)) },
                    React.createElement(semantic_ui_react_1.Dropdown.Menu, null,
                        React.createElement(semantic_ui_react_1.Dropdown.Item, { icon: 'file pdf outline', active: this.props.history.location.pathname == '/'
                                || this.props.history.location.pathname == '/certificates', onClick: () => this.props.history.push('/certificates'), text: i18n_1.I18N.common_certificates }),
                        React.createElement(semantic_ui_react_1.Dropdown.Item, { icon: 'file pdf outline', active: this.props.history.location.pathname == '/contracts', onClick: () => this.props.history.push('/contracts'), text: i18n_1.I18N.common_contacts }))),
                React.createElement(semantic_ui_react_1.Dropdown, { item: true, icon: null, trigger: React.createElement("span", null,
                        React.createElement(semantic_ui_react_1.Icon, { name: 'sync' }),
                        React.createElement("span", { className: "hideOnMobile", style: { paddingLeft: 5 } }, i18n_1.I18N.common_sync)) },
                    React.createElement(semantic_ui_react_1.Dropdown.Menu, null,
                        React.createElement(semantic_ui_react_1.Dropdown.Item, { icon: 'sync', active: this.props.history.location.pathname == '/sync', onClick: () => this.props.history.push('/sync'), text: i18n_1.I18N.common_syncCertificates }),
                        React.createElement(semantic_ui_react_1.Dropdown.Item, { icon: 'upload', active: this.props.history.location.pathname == '/upload', onClick: () => this.props.history.push('/upload'), text: i18n_1.I18N.common_uploadContracts }))),
                this.renderToolsPanel())));
    }
};
AppBarComponent = __decorate([
    mobx_react_1.inject('domainStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [Object])
], AppBarComponent);
exports.AppBar = react_router_dom_1.withRouter(AppBarComponent);


/***/ }),

/***/ "./src/views/components/index.tsx":
/*!****************************************!*\
  !*** ./src/views/components/index.tsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
const semantic_ui_react_1 = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/index.js");
const async_models_1 = __webpack_require__(/*! ../../models/async.models */ "./src/models/async.models.ts");
const i18n_1 = __webpack_require__(/*! ../../i18n */ "./src/i18n/index.ts");
class BaseComponent extends React.Component {
    componentWillUnmount() {
        if (this.disposables)
            this.disposables.forEach(dispose => dispose());
    }
    asyncStateWidget(state, callbacks) {
        if (state != null) {
            if (state.value != null && callbacks.onValue != null)
                return callbacks.onValue(state.value);
            if (state.isSuccessful() && callbacks.onSuccess != null)
                return callbacks.onSuccess(state.value);
            if (state.isInProgress() && callbacks.onProgress != null)
                return callbacks.onProgress(state.value);
            if (state.isFailed() && callbacks.onFail != null)
                return callbacks.onFail(state.error);
        }
        if (callbacks.orElse != null)
            return callbacks.orElse();
        return null;
    }
    asyncErrorMessage(error) {
        const content = i18n_1.I18N.asyncError(error);
        return (React.createElement(semantic_ui_react_1.Message, { negative: error.sevirity == async_models_1.AsyncErrorSevirity.ERROR, warning: error.sevirity == async_models_1.AsyncErrorSevirity.WARNING, icon: 'warning circle', floating: true, header: content.title, content: content.subtitle }));
    }
    loadingParagraph() {
        return (React.createElement(semantic_ui_react_1.Segment, { loading: true },
            React.createElement(semantic_ui_react_1.Image, { src: 'https://react.semantic-ui.com/images/wireframe/paragraph.png' })));
    }
}
exports.BaseComponent = BaseComponent;


/***/ }),

/***/ "./src/views/screens/certificates.screen.tsx":
/*!***************************************************!*\
  !*** ./src/views/screens/certificates.screen.tsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
const mobx_1 = __webpack_require__(/*! mobx */ "./node_modules/mobx/lib/mobx.module.js");
const mobx_react_1 = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/index.module.js");
const moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
const semantic_ui_react_1 = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/index.js");
const components_1 = __webpack_require__(/*! ../components */ "./src/views/components/index.tsx");
const domain_models_1 = __webpack_require__(/*! ../../models/domain.models */ "./src/models/domain.models.ts");
const i18n_1 = __webpack_require__(/*! ../../i18n */ "./src/i18n/index.ts");
const c_1 = __webpack_require__(/*! ../../c */ "./src/c.tsx");
let CertificateListScreen = class CertificateListScreen extends components_1.BaseComponent {
    constructor(props) {
        super(props);
        this.runningOnMobile = navigator.userAgent.toLowerCase().search("iphone") > -1;
        this.state = {
            searchState: props.domainStore.searchCertificatesState,
            syncState: props.domainStore.syncCertificatesState,
            page: 1
        };
    }
    componentDidMount() {
        document.title = i18n_1.I18N.common_certificates;
        this.disposables = [
            mobx_1.reaction(() => this.props.domainStore.searchCertificatesState, (searchState) => {
                this.setState({
                    searchState,
                    page: 1
                });
            }),
            mobx_1.reaction(() => this.props.domainStore.syncCertificatesState, (syncState) => {
                if (this.state.syncState.isInProgress() &&
                    syncState.isSuccessful()) {
                }
                this.setState({ syncState });
            }),
        ];
    }
    render() {
        return this.asyncStateWidget(this.state.searchState, {
            onFail: (error) => this.asyncErrorMessage(error),
            onSuccess: (value) => this.renderTable(value),
        });
    }
    renderTable(certificates) {
        const pageCount = Math.ceil(certificates.length / c_1.C.CERTIFICATES_PER_PAGE);
        const footer = pageCount > 1 ? (React.createElement(semantic_ui_react_1.Table.Footer, null,
            React.createElement(semantic_ui_react_1.Table.Row, null,
                React.createElement(semantic_ui_react_1.Table.HeaderCell, { colSpan: '8', className: 'right aligned' },
                    React.createElement(semantic_ui_react_1.Pagination, { size: 'tiny', activePage: this.state.page, totalPages: pageCount, nextItem: false, prevItem: false, siblingRange: 1, boundaryRange: 0, ellipsisItem: false, onPageChange: (_, data) => this.setState({
                            page: data.activePage
                        }) }))))) : null;
        const startIndex = (this.state.page - 1) * c_1.C.CERTIFICATES_PER_PAGE;
        return (React.createElement(semantic_ui_react_1.Table, { celled: true, size: 'small' },
            React.createElement(semantic_ui_react_1.Table.Header, { className: 'hideOnMobile' },
                React.createElement(semantic_ui_react_1.Table.Row, null,
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.certificate_contractNumber),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.certificate_certificateNumber),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.certificate_collectionMethod),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.certificate_issueDate),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.certificate_deliveryDate),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.certificate_syncDate),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.certificate_viewPdfUri),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.certificate_webpageUri))),
            React.createElement(semantic_ui_react_1.Table.Body, null, certificates
                .slice(startIndex, startIndex + c_1.C.CERTIFICATES_PER_PAGE)
                .map(certificate => (React.createElement(semantic_ui_react_1.Table.Row, { key: 'certificateRow' + certificate.id, style: {
                    color: certificate.specs == true ||
                        this.state.syncState.value &&
                            this.state.syncState.value.findIndex((s) => s.contractNumber === certificate.contractNumber &&
                                s.phase === domain_models_1.SyncPhase.COMPLETE) >= 0
                        ? 'black' : 'grey'
                } },
                React.createElement(semantic_ui_react_1.Table.Cell, null,
                    certificate.contractNumber,
                    this.state.syncState.isInProgress() &&
                        this.state.syncState.value.findIndex((s) => s.contractNumber === certificate.contractNumber &&
                            domain_models_1.isSyncPhaseInProgress(s.phase)) >= 0
                        ? React.createElement(semantic_ui_react_1.Loader, { active: true, inline: true, size: 'mini', style: { marginLeft: 5 } })
                        : this.state.syncState.isSuccessful() &&
                            this.state.syncState.value.findIndex((s) => s.contractNumber === certificate.contractNumber &&
                                domain_models_1.isSyncPhaseFailed(s.phase)) >= 0
                            ? React.createElement(semantic_ui_react_1.Icon, { color: 'red', name: 'warning sign', style: { marginLeft: 5 } })
                            : null),
                React.createElement(semantic_ui_react_1.Table.Cell, null, certificate.certificateNumber),
                React.createElement(semantic_ui_react_1.Table.Cell, null, certificate.collectionMethod),
                React.createElement(semantic_ui_react_1.Table.Cell, null, certificate.issueDate),
                React.createElement(semantic_ui_react_1.Table.Cell, null, certificate.deliveryDate),
                React.createElement(semantic_ui_react_1.Table.Cell, null, moment(certificate.syncDate).format('YYYY/MM/DD')),
                React.createElement(semantic_ui_react_1.Table.Cell, null,
                    React.createElement("a", { className: 'download-pdf-link', href: c_1.C.API_BASE_URI + '/certificates/pdf/' +
                            certificate.contractNumber +
                            (this.runningOnMobile ? '?download=1' : ''), target: this.runningOnMobile ? '_self' : '_blank' }, i18n_1.I18N.certificate_openPdfLink)),
                React.createElement(semantic_ui_react_1.Table.Cell, null,
                    React.createElement("a", { className: 'open-webpage-link', href: certificate.webpageUri, target: this.runningOnMobile ? '_self' : '_blank' }, i18n_1.I18N.certificate_openWebpageLink)))))),
            footer));
    }
};
CertificateListScreen = __decorate([
    mobx_react_1.inject('domainStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [Object])
], CertificateListScreen);
exports.CertificateListScreen = CertificateListScreen;


/***/ }),

/***/ "./src/views/screens/contracts.screen.tsx":
/*!************************************************!*\
  !*** ./src/views/screens/contracts.screen.tsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
const mobx_1 = __webpack_require__(/*! mobx */ "./node_modules/mobx/lib/mobx.module.js");
const mobx_react_1 = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/index.module.js");
const moment = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
const semantic_ui_react_1 = __webpack_require__(/*! semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/index.js");
const components_1 = __webpack_require__(/*! ../components */ "./src/views/components/index.tsx");
const i18n_1 = __webpack_require__(/*! ../../i18n */ "./src/i18n/index.ts");
const c_1 = __webpack_require__(/*! ../../c */ "./src/c.tsx");
let ContractListScreen = class ContractListScreen extends components_1.BaseComponent {
    constructor(props) {
        super(props);
        this.runningOnMobile = navigator.userAgent.toLowerCase().search("iphone") > -1;
        this.state = {
            searchState: props.domainStore.searchContractsState,
            page: 1
        };
    }
    componentDidMount() {
        document.title = i18n_1.I18N.common_contacts;
        this.disposables = [
            mobx_1.reaction(() => this.props.domainStore.searchContractsState, (searchState) => {
                this.setState({
                    searchState,
                    page: 1
                });
            }),
        ];
    }
    render() {
        return this.asyncStateWidget(this.state.searchState, {
            onFail: (error) => this.asyncErrorMessage(error),
            onSuccess: (value) => this.renderTable(value),
        });
    }
    renderTable(contracts) {
        const pageCount = Math.ceil(contracts.length / c_1.C.CONTRACTS_PER_PAGE);
        const footer = pageCount > 1 ? (React.createElement(semantic_ui_react_1.Table.Footer, null,
            React.createElement(semantic_ui_react_1.Table.Row, null,
                React.createElement(semantic_ui_react_1.Table.HeaderCell, { colSpan: '8', className: 'right aligned' },
                    React.createElement(semantic_ui_react_1.Pagination, { size: 'tiny', activePage: this.state.page, totalPages: pageCount, nextItem: false, prevItem: false, siblingRange: 1, boundaryRange: 0, ellipsisItem: false, onPageChange: (_, data) => this.setState({
                            page: data.activePage
                        }) }))))) : null;
        const startIndex = (this.state.page - 1) * c_1.C.CONTRACTS_PER_PAGE;
        return (React.createElement(semantic_ui_react_1.Table, { celled: true, size: 'small' },
            React.createElement(semantic_ui_react_1.Table.Header, { className: 'hideOnMobile' },
                React.createElement(semantic_ui_react_1.Table.Row, null,
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.contract_timestamp),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.contract_syncDate),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.contract_downloadPdfUri))),
            React.createElement(semantic_ui_react_1.Table.Body, null, contracts
                .slice(startIndex, startIndex + c_1.C.CONTRACTS_PER_PAGE)
                .map(contract => (React.createElement(semantic_ui_react_1.Table.Row, { key: 'contractRow' + contract.id },
                React.createElement(semantic_ui_react_1.Table.Cell, null, contract.contractTimestamp),
                React.createElement(semantic_ui_react_1.Table.Cell, null, moment(contract.syncDate).format('YYYY/MM/DD')),
                React.createElement(semantic_ui_react_1.Table.Cell, null,
                    React.createElement("a", { href: contract.downloadPdfUri, target: this.runningOnMobile ? '_self' : '_blank' }, i18n_1.I18N.contract_openPdfLink)))))),
            footer));
    }
};
ContractListScreen = __decorate([
    mobx_react_1.inject('domainStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [Object])
], ContractListScreen);
exports.ContractListScreen = ContractListScreen;


/***/ }),

/***/ "./src/views/screens/sync.screen.tsx":
/*!*******************************************!*\
  !*** ./src/views/screens/sync.screen.tsx ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
const mobx_1 = __webpack_require__(/*! mobx */ "./node_modules/mobx/lib/mobx.module.js");
const mobx_react_1 = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/index.module.js");
const semantic_ui_react_1 = __webpack_require__(/*! ../../../node_modules/semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/index.js");
const components_1 = __webpack_require__(/*! ../components */ "./src/views/components/index.tsx");
const domain_models_1 = __webpack_require__(/*! ../../models/domain.models */ "./src/models/domain.models.ts");
const i18n_1 = __webpack_require__(/*! ../../i18n */ "./src/i18n/index.ts");
const c_1 = __webpack_require__(/*! ../../c */ "./src/c.tsx");
let SyncContractsScreen = class SyncContractsScreen extends components_1.BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            syncState: props.domainStore.syncCertificatesState,
            page: 1,
        };
    }
    componentDidMount() {
        document.title = i18n_1.I18N.common_syncCertificates;
        this.disposables = [
            mobx_1.reaction(() => this.props.domainStore.syncCertificatesState, (syncState) => {
                if (this.state.syncState.isInProgress() &&
                    syncState.isSuccessful()) {
                    const successCount = syncState.value.filter(s => s.phase === 'COMPLETE').length;
                    alert(i18n_1.I18N.syncCertificate_syncFinishedMessage(successCount));
                }
                this.setState({ syncState });
            }),
        ];
    }
    render() {
        return this.asyncStateWidget(this.state.syncState, {
            onFail: (error) => this.asyncErrorMessage(error),
            onValue: (value) => this.renderTable(value.sort((s1, s2) => s1.contractNumber.localeCompare(s2.contractNumber))),
        });
    }
    renderTable(states) {
        const pageCount = Math.ceil(states.length / c_1.C.SYNC_STATES_PER_PAGE);
        const footer = pageCount > 1 ? (React.createElement(semantic_ui_react_1.Table.Footer, null,
            React.createElement(semantic_ui_react_1.Table.Row, null,
                React.createElement(semantic_ui_react_1.Table.HeaderCell, { colSpan: '8', className: 'right aligned' },
                    React.createElement(semantic_ui_react_1.Pagination, { size: 'tiny', activePage: this.state.page, totalPages: pageCount, nextItem: false, prevItem: false, siblingRange: 1, boundaryRange: 0, ellipsisItem: false, onPageChange: (_, data) => this.setState({
                            page: data.activePage
                        }) }))))) : null;
        const startIndex = (this.state.page - 1) * c_1.C.SYNC_STATES_PER_PAGE;
        return (React.createElement(semantic_ui_react_1.Table, { celled: true, size: 'small' },
            React.createElement(semantic_ui_react_1.Table.Header, { className: 'hideOnMobile' },
                React.createElement(semantic_ui_react_1.Table.Row, null,
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.certificate_contractNumber),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, { width: '5' }, i18n_1.I18N.syncCertificate_phase),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, { width: '7' }, i18n_1.I18N.syncCertificate_progress))),
            React.createElement(semantic_ui_react_1.Table.Body, null, states
                .slice(startIndex, startIndex + c_1.C.SYNC_STATES_PER_PAGE)
                .map(state => (React.createElement(semantic_ui_react_1.Table.Row, { key: 'syncRow' + state.contractNumber },
                React.createElement(semantic_ui_react_1.Table.Cell, null, state.contractNumber),
                React.createElement(semantic_ui_react_1.Table.Cell, null, i18n_1.I18N.syncCertificate_fromSyncPhase(state.phase)),
                React.createElement(semantic_ui_react_1.Table.Cell, null,
                    React.createElement(semantic_ui_react_1.Progress, { color: state.phase == domain_models_1.SyncPhase.AWAITS ? 'grey' : 'yellow', success: state.phase == domain_models_1.SyncPhase.COMPLETE, error: domain_models_1.isSyncPhaseFailed(state.phase), active: domain_models_1.isSyncPhaseInProgress(state.phase), total: 5, value: state.phase == domain_models_1.SyncPhase.AWAITS ? 0 :
                            state.phase == domain_models_1.SyncPhase.PARSING_WEBPAGE ? 2 :
                                state.phase == domain_models_1.SyncPhase.DOWNLOADIN_PDF ? 3 :
                                    state.phase == domain_models_1.SyncPhase.PARSING_PDF ? 4 :
                                        state.phase == domain_models_1.SyncPhase.STORING_DATA ? 5 : 6 })))))),
            footer));
    }
};
SyncContractsScreen = __decorate([
    mobx_react_1.inject('domainStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [Object])
], SyncContractsScreen);
exports.SyncContractsScreen = SyncContractsScreen;


/***/ }),

/***/ "./src/views/screens/upload.screen.tsx":
/*!*********************************************!*\
  !*** ./src/views/screens/upload.screen.tsx ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
const mobx_1 = __webpack_require__(/*! mobx */ "./node_modules/mobx/lib/mobx.module.js");
const mobx_react_1 = __webpack_require__(/*! mobx-react */ "./node_modules/mobx-react/index.module.js");
const semantic_ui_react_1 = __webpack_require__(/*! ../../../node_modules/semantic-ui-react */ "./node_modules/semantic-ui-react/dist/es/index.js");
const components_1 = __webpack_require__(/*! ../components */ "./src/views/components/index.tsx");
const domain_models_1 = __webpack_require__(/*! ../../models/domain.models */ "./src/models/domain.models.ts");
const i18n_1 = __webpack_require__(/*! ../../i18n */ "./src/i18n/index.ts");
const c_1 = __webpack_require__(/*! ../../c */ "./src/c.tsx");
let UploadScreen = class UploadScreen extends components_1.BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            uploadState: props.domainStore.uploadContractsState,
            page: 1,
        };
    }
    componentDidMount() {
        document.title = i18n_1.I18N.common_uploadContracts;
        this.disposables = [
            mobx_1.reaction(() => this.props.domainStore.uploadContractsState, (uploadState) => {
                if (this.state.uploadState.isInProgress() &&
                    uploadState.isSuccessful()) {
                    const num = uploadState.value.filter(s => s.phase === 'COMPLETE').length;
                    alert(i18n_1.I18N.uploadContract_finishMessage(num));
                }
                this.setState({ uploadState });
            }),
        ];
    }
    render() {
        return this.asyncStateWidget(this.state.uploadState, {
            onFail: (error) => this.asyncErrorMessage(error),
            onValue: (value) => this.renderTable(value.sort((s1, s2) => s1.contractTimestamp - s2.contractTimestamp)),
        });
    }
    renderTable(states) {
        const pageCount = Math.ceil(states.length / c_1.C.UPLOADT_STATES_PER_PAGE);
        const footer = pageCount > 1 ? (React.createElement(semantic_ui_react_1.Table.Footer, null,
            React.createElement(semantic_ui_react_1.Table.Row, null,
                React.createElement(semantic_ui_react_1.Table.HeaderCell, { colSpan: '8', className: 'right aligned' },
                    React.createElement(semantic_ui_react_1.Pagination, { size: 'tiny', activePage: this.state.page, totalPages: pageCount, nextItem: false, prevItem: false, siblingRange: 1, boundaryRange: 0, ellipsisItem: false, onPageChange: (_, data) => this.setState({
                            page: data.activePage
                        }) }))))) : null;
        const startIndex = (this.state.page - 1) * c_1.C.UPLOADT_STATES_PER_PAGE;
        return (React.createElement(semantic_ui_react_1.Table, { celled: true, size: 'small' },
            React.createElement(semantic_ui_react_1.Table.Header, { className: 'hideOnMobile' },
                React.createElement(semantic_ui_react_1.Table.Row, null,
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, null, i18n_1.I18N.contract_timestamp),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, { width: '5' }, i18n_1.I18N.uploadContract_phase),
                    React.createElement(semantic_ui_react_1.Table.HeaderCell, { width: '7' }, i18n_1.I18N.uploadContract_progress))),
            React.createElement(semantic_ui_react_1.Table.Body, null, states
                .slice(startIndex, startIndex + c_1.C.UPLOADT_STATES_PER_PAGE)
                .map(state => (React.createElement(semantic_ui_react_1.Table.Row, { key: 'uploadRow' + state.contractTimestamp },
                React.createElement(semantic_ui_react_1.Table.Cell, null, state.contractTimestamp),
                React.createElement(semantic_ui_react_1.Table.Cell, null, i18n_1.I18N.syncCertificate_fromSyncPhase(state.phase)),
                React.createElement(semantic_ui_react_1.Table.Cell, null,
                    React.createElement(semantic_ui_react_1.Progress, { color: state.phase == domain_models_1.UploadPhase.AWAITS ? 'grey' : 'yellow', success: state.phase == domain_models_1.UploadPhase.COMPLETE, error: state.phase == domain_models_1.UploadPhase.ERROR ||
                            state.phase == domain_models_1.UploadPhase.TIMEOUT_ERROR, active: state.phase == domain_models_1.UploadPhase.PARSING_PDF ||
                            state.phase == domain_models_1.UploadPhase.STORING_DATA, total: 4, value: state.phase == domain_models_1.UploadPhase.AWAITS ? 0 :
                            state.phase == domain_models_1.UploadPhase.UPLOADIN_PDF ? 1 :
                                state.phase == domain_models_1.UploadPhase.PARSING_PDF ? 2 :
                                    state.phase == domain_models_1.UploadPhase.STORING_DATA ? 3 : 4 })))))),
            footer));
    }
};
UploadScreen = __decorate([
    mobx_react_1.inject('domainStore'),
    mobx_react_1.observer,
    __metadata("design:paramtypes", [Object])
], UploadScreen);
exports.UploadScreen = UploadScreen;


/***/ }),

/***/ 0:
/*!*********************************************************!*\
  !*** multi ./src/app.tsx webpack-hot-middleware/client ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./src/app.tsx */"./src/app.tsx");
module.exports = __webpack_require__(/*! webpack-hot-middleware/client */"./node_modules/webpack-hot-middleware/client.js");


/***/ })

/******/ });
//# sourceMappingURL=app.bundle.js.map