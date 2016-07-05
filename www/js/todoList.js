/**
 * 
 */
var todoApp = angular.module("todoApp", ['ngRoute']);

todoApp.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: "todo.html",
		controller: "todoListController"
	})
	.when('/todo', {
		templateUrl: "todo.html",
		controller: "todoController"
	})
	.when('/types', {
		templateUrl: "types.html",
		controller: "typesController"
	})
	.otherwise({redirectTo: '/'});
});

todoApp.factory("todoFactory", function($http) {
	return {
		getTodosAsync: function(callback) {
			$http.get('bucket-list.json').success(callback);
		},
		getTodosFileAsync: function(fileName, callback) {
			$http.get(fileName).success(callback);
		}
	};
});

/*
 * REF http://stackoverflow.com/questions/21919962/share-data-between-angularjs-controllers
 * 
 */

todoApp.factory("typesFactory", function($http) {
	return {
		getTypessAsync: function(callback) {
			$http.get('types.json').success(callback);
		}
	};
});



todoApp.controller("todoController", function($scope, todoFactory) {
	
	$scope.newDo = "";
	$scope.newDoType = "";
	$scope.filterType = "";
	$scope.newType = "";
	//$scope.descending = false;
	$scope.descending = true;
	
	$scope.showTodos = true;
	
	/*$("#add-button").on("click", function() {
		alert("Add button was clicked");
	});*/
	
		
	/*todoFactory.getTodosAsync(function (results) {
		console.log('todoController async read in the JSON File');
		$scope.todos = results.todos;
		$scope.todos.forEach(function(Entry){
			console.log(Entry);
		});
	});*/
	
	todoFactory.getTodosFileAsync('todo.json', function (results) {
		console.log('todoController async read in the todo.JSON File');
		$scope.todoList = results.todos;
		/*console.log("TO DO :  ");
		console.log("-----------");
		$scope.todoList.forEach(function(Entry){
			console.log(Entry);
		});
		console.log("------------------");*/
		sortToDos("done");	// Sorting ensures a ToDo item is at the bottom of the list, thus ensuring that the last item has rounded corners - to fit
	});
	
	todoFactory.getTodosFileAsync('bucket-list.json', function (results) {
		console.log('todoController async read in the bucket-list.JSON File');
		$scope.bucket = results.todos;
		/*console.log("Bucket List :  ");
		console.log("-----------");
		$scope.bucket.forEach(function(Entry){
			console.log(Entry);
		});*/
	});
	
	todoFactory.getTodosFileAsync('types.json', function (results) {
		console.log('todoController async read in the types.JSON File');
		$scope.types = results.types;
		/*console.log("ToDo Types :  ");
		console.log("-----------");
		$scope.types.forEach(function(Entry){
			console.log(Entry);
		});*/
	});
	
	/*typesFactory.getTypesAsync(function (results) {
		console.log('todoController async read in the types.JSON File');
		$scope.types = results.types;
		$scope.types.forEach(function(Entry){
			console.log("ToDo type :  " + Entry);
		});
	});*/
	
	
	$scope.addTodo = function() {
		console.log("Adding new Entry :  " + $scope.newDo);
		$scope.todoList.push(
				{
					todo:$scope.newDo,
					type:$scope.newDoType,
					done:false
				}
		);
		$scope.newDo = "";
		$scope.newDoType = "";
	}
	
	$scope.deleteEntry = function(index) {
		console.log("In deleteEntry");
		console.log("Deleting entry #" + index);
		
		$scope.todoList.splice(index, 1);
//		$scope.todos.splice(index, 1);
	}

	/*$scope.addType = function() {
		$scope.inUse = "";
		console.log("Adding new Entry :  " + $scope.newType);
		$scope.types.push(
				{
					type:$scope.newType,
				}
		);
		$scope.newType = "";
	}
	
	$scope.deleteType = function(index) {
		$scope.inUse = "";
		console.log("In deleteType");
		var delType = $scope.types[index].type;
		console.log("Deleting type #" + index);
		console.log("Deleting type :  " + delType);
		//console.log("Deleting type :  " + delType.type);
		
		var typeInUse = false;
		
		$scope.todoList.forEach(function(toDoItem){
			console.log("ToDo type :  " + toDoItem.type);
			if(toDoItem.type === delType) {
				console.log("Deleted type is in use!!!!!!");
				typeInUse = true;
			}
		});

		if(typeInUse) {
			$scope.inUse = delType + " type is used by one or more ToDo items.<br>It cannot be removed";
		} else {
			$scope.types.splice(index, 1);
		}
	}*/

	$scope.orderByToDo = function() {
		console.log("Ordering by ToDo");
		sortToDos("todo");
	}
	
	$scope.printTodoList = function() {
		console.log("Printing ToDo List");
		$scope.todoList.forEach(function(Entry){
			console.log(Entry);
		});
	}
	
	$scope.updateList = function() {
		console.log("Updating the List!");
		$scope.$apply();
	}
	
	/* 
	 * REF :  http://stackoverflow.com/questions/881510/sorting-json-by-values
	 */
	function sortToDos(prop) {
		var asc = !$scope.descending;
		console.log("In sortToDos");
		console.log("prop variable::" + prop);
	    $scope.todoList = $scope.todoList.sort(function(a, b) {
	        /*if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
	        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);*/
	    	if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
	        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
	    });
	}
	/*
	 * REF http://stackoverflow.com/questions/5545649/can-i-combine-nth-child-or-nth-of-type-with-an-arbitrary-selector
	 */
	/*$('ul.todo-list').each(function() {
		$('li.shown:even').addClass('todoOdd');
		$('li.shown:odd').addClass('todoEven');
		$('li.shown:first-of-type').addClass('todoFirst');
		$('li.shown:last-of-type').addClass('todoLast');
	});*/

});

todoApp.controller("typesController", function($scope) {
	$scope.inUse = "";
	
	/*todoFactory.getTodosFileAsync('types.json', function (results) {
		console.log('todoController async read in the types.JSON File');
		$scope.types = results.types;
		console.log("ToDo Types :  ");
		console.log("-----------");
		$scope.types.forEach(function(Entry){
			console.log(Entry);
		});
	});*/
	
	$scope.addType = function() {
		$scope.inUse = "";
		console.log("Adding new Entry :  " + $scope.newType);
		$scope.types.push(
				{
					type:$scope.newType,
				}
		);
		$scope.newType = "";
	}
	
	$scope.deleteType = function(index) {
		$scope.inUse = "";
		console.log("In deleteType");
		var delType = $scope.types[index].type;
		console.log("Deleting type #" + index);
		console.log("Deleting type :  " + delType);
		//console.log("Deleting type :  " + delType.type);
		
		var typeInUse = false;
		
		$scope.todoList.forEach(function(toDoItem){
			console.log("ToDo type :  " + toDoItem.type);
			if(toDoItem.type === delType) {
				console.log("Deleted type is in use!!!!!!");
				typeInUse = true;
			}
		});
		
		if(!typeInUse) {
			$scope.types.splice(index, 1);
		} else {
			$scope.inUse = "'" + delType + "' is used by a ToDo item.\n  It cannot be removed!";
		}
	}
	
	$scope.showEditTypesPage = function() {
		$scope.showTodos = false;
	}
	
	$scope.showToDoListPage = function() {
		$scope.showTodos = true;
	}
	
});
