function byId(id){
	return document.getElementById(id);
}
var Data = function(){
	var that = {}
		,list = {},
		count = 0;
	that.add = function(content){
		var oneView = One(count,content);
		var one = {
			content: content
			,view: oneView
			,done: false
			,id: count++
		}
		list[one.id] = one;
		return one;
	};
	that.done = function(id){
		list[id].done = true;
		return list[id];
	};
	that.allDone = function(id){
		var i;
		for(i in list){
			list[i].done = true;
		}
		return list;
	}
	that.undone = function(id){
		list[id].done = false;
		return list[id];
	};
	that.allUndone = function(id){
		var i;
		for(i in list){
			list[i].done = false;
		}
		return list;
	};
	that.isAllDone = function(){
		var i;
		for(i in list){
			if(!list[i].done){
				return false;
			}
		}
		return true;
	};
	that.remove = function(id){
		var del = list[id];
		delete list[id];
		return del;	
	};
	that.num = function(){
		var i,count=0,done=0;
		for(i in list){
			count++;
			if(list[i].done){
				done++;
			}				
		}
		return [done,count];
	};
	return that;
}
var data = Data();
Events(data);

var App = function(){
	var that = {}
		,input = byId('new')
		,list = byId('list')
		,alldone = byId('alldone')
		,num = byId('num');
	
	var show = function(){
		var n = data.num();
		num.innerHTML = '<i>'+n[0]+' </i>done / <i>'+n[1]+' </i>item';
	};	
	data.Events.on('add',function(rs){
		list.appendChild(rs.view.getDOM());		
	});
	data.Events.on('remove',function(rs){
		list.removeChild(rs.view.getDOM());
	});
	data.Events.on('done',function(rs){
		rs.view.viewDone();
	});
	data.Events.on('undone',function(rs){
		rs.view.viewUndone();
	});
	data.Events.on('allDone',function(rs){
		for(var i in rs){
			rs[i].view.viewDone();
		}
	});
	data.Events.on('allUndone',function(rs){
		for(var i in rs){
			rs[i].view.viewUndone();
		}
	});
	data.Events.on('add remove done undone allDone allUndone',function(rs){
		if(data.isAllDone()){
			alldone.checked = true;
		}else{
			alldone.checked = false;
		}
		show();
	});
	//Event
	input.addEventListener('keypress',function(e){
		if(e.keyCode===13){
			data.add(input.value);
			input.value = '';
		}
	});
	alldone.addEventListener('change',function(e){
		if(alldone.checked){
			data.allDone();
		}else{
			data.allUndone();
		}
	});
	show();
	return that;
}
var app = App();
Events(app);

var One = function(id, content){
	var that={}, oneLi, oneContent, oneCheck, oneDelete;
	oneLi = document.createElement('li');
	oneLi.className = 'one';
	oneContent = document.createElement('span');
	oneContent.className = 'content';
	oneContent.innerHTML = content;
	oneDelete = document.createElement('button');
	oneDelete.className = 'delete';
	oneDelete.innerHTML = 'x';
	oneCheck = document.createElement('input');
	oneCheck.className = 'done';
	oneCheck.type = "checkbox";
	oneLi.appendChild(oneContent);
	oneLi.appendChild(oneDelete);
	oneLi.appendChild(oneCheck);
	
	//Q：这块求助。
	//为什么在里面的所有that都是第一个。用过闭包，也不能解决。
	//发现个问题，现在只能给实例化的实例用。而不能自动工厂函数实例出来自动加载。
	//
	// data.Events.on('add',function(){
	// 	console.log(that.getId); // 一直是0
	// });

	that.viewDone = function(){
		oneCheck.checked = true;
		oneContent.style.color = '#aaa';
	}
	that.viewUndone = function(){
		oneCheck.checked = false;
		oneContent.style.color = '';
	}
	that.getDOM = function(){
		return oneLi;
	};
	that.getId = function(){
		return id;
	};
	
	oneCheck.addEventListener('change',function(){
		if(oneCheck.checked){
			data.done(that.getId());
		}else{
			data.undone(that.getId());
		}
	});
	oneDelete.addEventListener('click',function(){
		data.remove(that.getId());
	});
	
	return that;
}
