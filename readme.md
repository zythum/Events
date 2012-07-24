#Events 实例自定义事件绑定#
用了1个月backbone。发现Backbone.Events真的很好用。
但是只能用在oo的环境下。能不能用在工厂的情况下呢..
于是倒腾了1天。写了个Todo的实例，发现个诡异的问题。相见todo.js的注释中。
---
例如工厂函数如下

	A.Events.on('alert',function(){alert('alert1')});
	A.Events.bind('alert',function(){alert('alert2')});
实例 

	var A = {
	 alert = function(){},
	 msg = function(){}
	}	
@加载Events

	Events(A);
	//自定义命名空间
	Events(A,'E');
	A.E.on('alert',function(){alert('AA')});

@绑定事件 on/bind

	A.Events.on('alert',function(){alert('alert1')});
	A.Events.bind('alert',function(){alert('alert2')});
	A.Events.on('alert msg',function(){alert('alert1')});

@解除绑定 off/unbind

	A.Events.off('alert',function(){alert('alert2')});
	A.Events.off('alert');
	A.Events.off();
	
@手动触发绑定 fire/trigger
	
	A.Events.fire('msg');
	
@卸载Events destory
	
	A.Events.destroy();