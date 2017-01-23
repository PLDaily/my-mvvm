/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	(function (window, undefined) {
		function _MVVM(root, data) {
			this.root = root;
			this.data = data;
			//事件处理集合
			this.eventList = {
				typeWriter: {
					type: 'input',
					fn: function fn() {
						data.title = this.value;
					}
				}
			};
		}
		_MVVM.prototype = {
			constructor: MVVM,
			//遍历DOM树解析指令
			scan: function scan(node) {
				for (var i = 0; i < node.children.length; i++) {
					var _thisNode = node.children[i];
					this.parseModel(_thisNode);
					this.parseClass(_thisNode);
					this.parseEvent(_thisNode);
					if (_thisNode.children.length) {
						this.scan(_thisNode);
					}
				}
			},
			//解析data-model
			parseModel: function parseModel(node) {
				if (node.getAttribute('data-model')) {
					var modalName = node.getAttribute('data-model');
					var _data = this.parseData(modalName, node);
					if (node.tagName == 'INPUT') {
						node.value = _data.data;
					} else {
						node.innerText = _data.data;
					}

					this.observer(this.data, _data.path, function (old, now) {
						if (node.tagName == 'INPUT') {
							node.value = now;
						} else {
							node.innerText = now;
						}
						console.log(old + '------' + now);
					});
				}
			},
			//数据劫持，监听data数据是否改变
			observer: function observer(obj, k, callback) {
				var old = obj[k];
				Object.defineProperty(obj, k, {
					enumerable: true,
					configurable: true,
					get: function get() {
						return old;
					},
					set: function set(now) {
						if (now !== old) {
							callback(old, now);
						}
						old = now;
					}
				});
			},
			//获取指令中的值
			parseData: function parseData(str, node) {
				var _this = this;

				var _list = str.split(':');
				var _data = void 0;
				var _path = void 0;
				var p = [];
				_list.forEach(function (key, index) {
					_data = _this.data[key];
					p.push(key);
				});
				return {
					data: _data,
					path: p
				};
			},
			//解析data-class
			parseClass: function parseClass(node) {
				if (node.getAttribute('data-class')) {
					var className = node.getAttribute('data-class');
					var _data = this.parseData(className, node);
					if (!node.classList.contains(_data.data)) {
						node.classList.add(_data.data);
					}
				}
			},
			//解析data-event
			parseEvent: function parseEvent(node) {
				if (node.getAttribute('data-event')) {
					var eventName = node.getAttribute('data-event');
					node.addEventListener(this.eventList[eventName].type, this.eventList[eventName].fn.bind(node), false);
				}
			}
		};
		function MVVM(root, data) {
			var mvvm = new _MVVM(root, data);
			mvvm.scan(root);
		}
		window.MVVM = MVVM;
	})(window);

/***/ }
/******/ ]);