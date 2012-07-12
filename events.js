// Events
// 为实例不管是new出来的实例还是工厂模式返回的实例。添加自定义事件绑定。
// @绑定事件 on/bind
// @取消绑定 off/unbind		
// @手动触发 fire/trigger
// @卸载绑定 destroy
function Events(o,handle){
	var E,m,event,split;
	handle = handle || 'Events';
	spliter = /\s+/;
	//重构---虽然破坏了原有的结构。但是一般来说不会重写这部分的把
	for(m in o){
		if(o[m].prototype){			
			(function(m){	
				var i,list,len,old,rs;
				old = o[m];
				o[m] = function(){				
					rs = o[m].old.apply(this,arguments);
					for(i=0,list=o[m].list,len=list.length; i<len; i++){
						list[i] && list[i](rs);
					}
					return rs;
				};
				o[m].list = [];
				o[m].old = old;
			})(m);
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
			if(!o[methed]) continue;
			for(i=0, len=o[methed].list.length; i<len; i++){
				if(o[methed].list[i].toString() === callback.toString()){
					break;
				}
			}
			len==i && o[methed].list.push(callback);
		}
	}
	
	//解除绑定函数 
	//exp:  
	//	解除单个函数 off('alert',function(){...});
	//	解除某个事件的所有函数 off('alert');
	//	解除所有事件的所有函数 off();
	E['off']=E['unbind']= function(metheds, callback){
		var m,i,len,list,methed;
		metheds = metheds || [];
		metheds = metheds.split(spliter);
		while(methed = metheds.shift()){
			if(!callback && !methed){
				for(m in o){
					if(o[m].prototype && o[m].list){
						o[m].list = [];
					} 
				}
			}else if(!callback){
				o[methed] 
					&& o[methed].prototype 
					&& o[methed].list 
					&& (o[methed].list = []);
			}else{
				if(o[methed].prototype && o[methed].list){
					for(i=0, len=o[methed].list.length; i<len; i++){
						if(o[methed].list[i].toString() === callback.toString()){
							o[methed].list.splice(i,1);
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
		var list,event,methed;
		metheds = metheds || [];
		metheds = metheds.split(spliter);
		while(methed = metheds.shift()){
			o[methed] 
				&& o[methed].prototype 
				&& o[methed].list 
				&& (list = o[methed].list);
			for(i=0,len=list.length; i<len; i++){
				list[i] && list[i](param);
			}
		}
	}

	//卸载Events
	E['destroy']= function(){
		delete o[handle];
		for(m in o){
			if(o[m].prototype && o[m].list && o[m].old){
				o[m] = o[m].old;
				delete o[m].list;
				delete o[m].old;
			}
		}
	}	
}