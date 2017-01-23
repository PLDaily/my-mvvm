(function(window, undefined) {
	function _MVVM(root, data) {
		this.root = root;
		this.data = data;
		//事件处理集合
		this.eventList = {
		  	typeWriter: {
		    	type: 'input',
		    	fn: function() {
		     		data.title = this.value;
		    	}
		  	}
		};
    }
    _MVVM.prototype = {
    	constructor: MVVM,
    	//遍历DOM树解析指令
    	scan: function(node) {
    		for(let i = 0; i < node.children.length; i++) {
			    let _thisNode = node.children[i];
			    this.parseModel(_thisNode);
			    this.parseClass(_thisNode);
			    this.parseEvent(_thisNode);
			    if(_thisNode.children.length) {
			      	this.scan(_thisNode);
			    } 
		  	}
    	},
    	//解析data-model
    	parseModel: function(node) {
    		if(node.getAttribute('data-model')) {
				const modalName = node.getAttribute('data-model');
				const _data = this.parseData(modalName, node);
				if(node.tagName == 'INPUT') {
					node.value = _data.data;
				}else {
					node.innerText = _data.data;
				}
			
				this.observer(this.data, _data.path, function(old, now) {
					if(node.tagName == 'INPUT') {
						node.value = now;
					}else {
						node.innerText = now;
					}
					console.log(`${old}------${now}`);
				})
			}
    	},
    	//数据劫持，监听data数据是否改变
    	observer: function(obj, k, callback) {
		  	let old = obj[k]  
		  	Object.defineProperty(obj, k, {
		    	enumerable: true,
		    	configurable: true,
		    	get: function() {
		      		return old
		    	},
		    	set: function(now) {
			      	if(now !== old) {
			        	callback(old, now)
			      	}
		      		old = now
		    	}
		  	})
		},
		//获取指令中的值
		parseData: function(str, node) {
			let _list = str.split(':');
			let _data;
			let _path;
			let p = [];
			_list.forEach((key, index) => {
			    _data = this.data[key];
			    p.push(key);      
			});
			return {
				data: _data,
				path: p
			}
		},
		//解析data-class
		parseClass: function(node) {
		  	if(node.getAttribute('data-class')) {
			    let className = node.getAttribute('data-class');
			    let _data = this.parseData(className, node);
			    if(!node.classList.contains(_data.data)) {
			      node.classList.add(_data.data);
			    }
		  	}
		},
		//解析data-event
		parseEvent: function(node) {
		  	if(node.getAttribute('data-event')) {
		    	let eventName = node.getAttribute('data-event');
		    	node.addEventListener(this.eventList[eventName].type, this.eventList[eventName].fn.bind(node), false);
		  	}
		}
    }
    function MVVM(root, data) {
    	var mvvm = new _MVVM(root, data);
    	mvvm.scan(root);
    }
    window.MVVM = MVVM;
})(window)