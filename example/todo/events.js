// Events
// 为实例不管是new出来的实例还是工厂模式返回的实例。添加自定义事件绑定。
// @绑定事件 on/bind
// @取消绑定 off/unbind		
// @手动触发 fire/trigger
// @卸载绑定 destroy
function Events(o,handle){
	var E,split;
	handle = handle || 'Events';
	spliter = /\s+/;

	if(o[handle]) {return false};

	//重构---虽然破坏了原有的结构。但是一般来说不会重写这部分的把
	// for(m in o){
	// 	if(o[m].prototype){			
	// 		(function(m){	
	// 			var i,_cache,len,old,rs;
	// 			old = o[m];
	// 			o[m] = function(){				
	// 				rs = o[m].old.apply(this,arguments);
	// 				for(i=0,_cache=o[m]._cache,len=_cache.length; i<len; i++){
	// 					_cache[i] && _cache[i](rs);
	// 				}
	// 				return rs;
	// 			};
	// 			o[m]._cache = [];
	// 			o[m].old = old;
	// 		})(m);
	// 	}
	// };
	// 需要是再重构。这样顺便解决顺序问题
	var init = function(m){
		if(o[m].prototype){			
			var i,_cache,len,old,rs;
			old = o[m];
			o[m] = function(){				
				rs = o[m].old.apply(o,arguments);
				for(i=0,_cache=o[m]._cache,len=_cache.length; i<len; i++){
					_cache[i] && _cache[i](rs);
				}
				return rs;
			};
			o[m]._cache = [];
			o[m].old = old; //原方法迁移到这里
		}
	}

	//添加自定义函数，命名空间是Events
	E = o[handle] = o[handle] || {};
	//绑定函数 
	//exp:  
	//	on('alert',function(){...});
	E['on']=E['bind']= function(metheds, callback){
		var i,len,methed;
		metheds = metheds || [];
		metheds = metheds.split(spliter);
		while(methed = metheds.shift()){
			if(!o[methed] || !o[methed].prototype) {continue;}
			if(!o[methed]._cache) {init(methed);}
			for(i=0, len=o[methed]._cache.length; i<len; i++){
				if(o[methed]._cache[i].toString() === callback.toString()){
					break;
				}
			}
			len==i && o[methed]._cache.push(callback);
		}
	}
	
	//解除绑定函数 
	//exp:  
	//	解除单个函数 off('alert',function(){...});
	//	解除某个事件的所有函数 off('alert');
	//	解除所有事件的所有函数 off();
	E['off']=E['unbind']= function(metheds, callback){
		var m,i,len,_cache,methed;
		metheds = metheds || [];
		metheds = metheds.split(spliter);
		while(methed = metheds.shift()){
			if(!callback && !methed){
				for(m in o){
					if(o[m].prototype && o[m]._cache){
						o[m]._cache = [];
					} 
				}
			}else if(!callback){
				o[methed] 
					&& o[methed].prototype 
					&& o[methed]._cache 
					&& (o[methed]._cache = []);
			}else{
				if(o[methed].prototype && o[methed]._cache){
					for(i=0, len=o[methed]._cache.length; i<len; i++){
						if(o[methed]._cache[i].toString() === callback.toString()){
							o[methed]._cache.splice(i,1);
							break;
						}
					}
				}
			}
		}
	}

	//触发某个事件的所有函数
	//exp:
	//	fire('alert')
	E['fire']=E['trigger']= function(metheds,param){
		var _cache,event,methed;
		metheds = metheds || [];
		metheds = metheds.split(spliter);
		while(methed = metheds.shift()){
			o[methed] 
				&& o[methed].prototype 
				&& o[methed]._cache 
				&& (_cache = o[methed]._cache);
			for(i=0,len=_cache.length; i<len; i++){
				_cache[i] && _cache[i](param);
			}
		}
	};

	//卸载Events
	E['destroy']= function(){
		delete o[handle];
		for(m in o){
			if(o[m].prototype && o[m]._cache && o[m].old){
				o[m] = o[m].old;
				delete o[m]._cache;
				delete o[m].old;
			}
		}
	};	
}