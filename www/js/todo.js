/**
 * 
* Author: Liz Conway
* Assignment: WE4
Mobile Web Applications, Digital Skills Academy
* Date : 2016/07/05
* Ref: website link to code referenced or the book, authors name and page number
 */
//var todoApp = angular.module("todoApp", ['ngStorage','ngRoute']);
var todoApp = angular.module("todoApp", ['ngRoute']);

/**
 * Used to navigate between ToDo page and Edit Type pages
 */
todoApp.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: "todo.html",
		controller: "todoController"
	})
	.when('/todo', {
		templateUrl: "todo.html",
		controller: "todoController"
	})
	.when('/types', {
		templateUrl: "types.html",
		controller: "todoController"
	})
	.otherwise({redirectTo: '/'});
});

/**
 * Used to retrieve a JSON file containing ToDo items
 * Supposed to be for saving and re-opening the todo list
 * If it was possible to save the list
 */
todoApp.factory("todoFactory", function($http) {
	var config = {
            headers : {
                'Content-Type': 'application/json;charset=utf-8;'
            }
        }

	
	return {
		getTodosFileAsync: function(fileName, callback) {
			$http.get(fileName).success(callback);
		},
		saveTodosAsync: function(todoList, callback) {
			//$http.delete('todo.json');
			//$http.post('todo.json', todoList, config).success(callback).error(function() {console.log("Failed to save todo.JSON");});
			//$http.post('todo.json', {todos: [{"todo": "Save fucking file", "type":"Fucking angular", "done": false}]}, config).success(callback).error(function() {console.log("Failed to save todo.JSON");});
			//$http.post('todo.json', JSON.stringify({"data1":"1", "data2":"2"}), config).success(callback).error(function() {console.log("Failed to save test.JSON");});
			//$http.put('todo.json', todoList, config).success(callback).error(function() {console.log("Failed to save todo.JSON");});
		    /*$http({
		        url: 'todo.json',
		        method: "POST",
		        data: { 'message' : 'fucking post' }
		    })
		    .then(function(response) {
		            console.log("Success????");
		    }, 
		    function(response) { // optional
		            console.log("Even this failed");
		    });*/

		}
	};
});

/**
 * Used to retrieve a JSON file containing ToDo types
 * Loads an initial list of ToDo types
 * Supposed to be for saving and re-opening the ToDo types
 * If it was possible to save them
 */
todoApp.factory("typesFactory", function($http) {
	return {
		getTypessAsync: function(callback) {
			$http.get('types.json').success(callback);
		},
		saveTypesAsync: function(callback) {
			$http.post('types.json', $scope.types).success(callback);
		}
	};
});

//todoApp.controller("todoController", function($scope, $localStorage, todoFactory) {
//todoApp.controller("todoController", function($scope, todoFactory, $localStorage) {
todoApp.controller("todoController", function($scope, todoFactory) {	
	$scope.todoList ="";			/** The list itself */
	$scope.newDo = "";				/** Variable to bind the new ToDo input */
	$scope.newDoType = "";			/** Variable to bind the new ToDo type selection */
	$scope.filterType = "";			/** Variable to bind the filter type selection */
	$scope.newType = "";			/** Variable to bind the new type input - on Edit type page */
	//$scope.descending = false;
	$scope.descending = true;		/** For sorting the ToDo list - helps with the screen layout if 
									 *  not done items are at the bottom of the list */
	
	$scope.showTodos = true;		/** Variable to manage 'page' display
									 *  true = Show ToDo page
									 *  false = Show Edit Type page */
	$scope.allDone = false;			/** Variable to control showing the 'Do All' button */
		
	todoFactory.getTodosFileAsync('todo.json', function (results) {
		console.log('todoController async read in the todo.JSON File');
		/** Sets todoList in $scope as a JSON object - even if the list is empty */
		$scope.todoList = results.todos;
		if(localStorage.todoList) {		// We have stored ToDo list?
			$scope.todoList = JSON.parse(localStorage.getItem("todoList"));
		}
		//console.log($scope.todoList.length);
		/*console.log("TO DO :  ");
		console.log("-----------");
		$scope.todoList.forEach(function(Entry){
			console.log(Entry);
		});
		console.log("------------------");*/
		if($scope.todoList.length === 0) {
			/** No ToDo items - so do not show the 'Do All' button */
			$scope.allDone = true;
		} else {
			sortToDos("done");	// Sorting ensures a ToDo item is at the bottom of the list, thus ensuring that the last item has rounded corners - to fit
		}
		/**
		 * For some reason localStorage puts a value into this variable
		 * So have to reset it
		 */
		$scope.newDo ="";
	});
	
	todoFactory.getTodosFileAsync('types.json', function (results) {
		console.log('todoController async read in the types.JSON File');
		$scope.types = results.types;
		/*console.log("ToDo Types :  ");
		console.log("-----------");
		$scope.types.forEach(function(Entry){
			console.log(Entry);
		});*/
		if(localStorage.todoTypes) {	/** If we have types stored - use these instead */
			$scope.types = JSON.parse(localStorage.getItem("todoTypes"));
		}
	});
	
	/**
	 * Method to add the entered ToDo item to the ToDo list
	 */
	$scope.addTodo = function() {
		console.log("Adding new Entry :  " + $scope.newDo);
			$scope.todoList.push({
				todo : $scope.newDo,
				type : $scope.newDoType,
				done : false
			});
			/** Binding - blank out the input fields */
			$scope.newDo = "";
			$scope.newDoType = "";
			$scope.allDone = false;		/** We have at least the new item in the ToDo list
										 *  Show the 'Do All' button */
	}
	
	$scope.disableAdd = function() {
		$("#add-button").enabled = false;
	}
	
	$scope.enableAdd = function() {
		$("#add-button").enabled = true;
	}
	
	/**
	 * Method to delete a ToDo item entirely
	 */
	$scope.deleteEntry = function(index) {
		console.log("In deleteEntry");
		console.log("Deleting entry #" + index);
		
		$scope.todoList.splice(index, 1);
	}

	/**
	 * Expose method to order the ToDo list
	 */
	$scope.orderByToDo = function() {
		console.log("Ordering by ToDo");
		sortToDos("todo");
	}
	
	/**
	 * Method to mark all undone ToDo items as done
	 */
	$scope.doAll = function() {
		console.log("Doing all");
		$scope.todoList.forEach(function(todoItem) {
			todoItem.done = true;
		});
		$scope.allDone = true;		/** Binding - hide the 'Do All' button */
	}
	
	/**
	 * Print ToDo list to the console
	 */
	$scope.printTodoList = function() {
		console.log("Printing ToDo List");
		$scope.todoList.forEach(function(Entry){
			console.log(Entry);
		});
	}
	
	/**
	 * Attempt to refresh the screen after clicking a checkbox
	 */
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
	    	if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
	        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
	    });
	}
	
	/**
	 * Save the ToDo list
	 */
	$scope.saveToDoList = function() {
		/*todoFactory.saveTodosAsync($scope.todoList, function() {
			console.log("ToDo List successfully saved");	// Success function called as long as the todo.json file exists
		});*/
		localStorage.setItem("todoList", JSON.stringify($scope.todoList));
	}
	
	$scope.inUse = "";		/** Variable used to prevent deletion of a ToDo type
							 *  that is associated with a ToDo item 
							 *  Hold the message that displays on screen 
							 *  if the ToDo type is already in use 
							 *  Error message on screen is bound to this variable
							 *  and will show when it is not blank */
	
	/**
	 * Method to add a new ToDo type
	 */
	$scope.addType = function() {
		$scope.inUse = "";		/** Binding - Ensure error message is not displayed */
		console.log("Adding new Entry :  " + $scope.newType);
		$scope.types.push(
				{
					type:$scope.newType,
				}
		);
		$scope.newType = "";		/** Binding - blank the ToDo type input field */
	}
	
	/**
	 * Method to save the ToDo types
	 */
	$scope.saveType = function() {
		$scope.inUse = "";		/** Binding - Ensure error message is not displayed */
		console.log("Saving ToDo types");
		localStorage.setItem("todoTypes", JSON.stringify($scope.types));
		$scope.newType = "";		/** Binding - blank the ToDo type input field */
	}
	
	/**
	 * Method to delete a ToDo type
	 */
	$scope.deleteType = function(index) {
		$scope.inUse = "";		/** Binding - Ensure error message is not displayed */
		console.log("In deleteType");
		var delType = $scope.types[index].type;
		console.log("Deleting type #" + index);
		console.log("Deleting type :  " + delType);
		
		var typeInUse = false;
		
		$scope.todoList.forEach(function(toDoItem){
			console.log("ToDo type :  " + toDoItem.type);
			if(toDoItem.type === delType) {
				console.log("Deleted type is in use!!!!!!");
				typeInUse = true;
			}
		});
		
		if(!typeInUse) {
			$scope.types.splice(index, 1);		/** Remove the ToDo type */
		} else {
			/** ToDo type is in use
			 * 	Set the inUse variable to an appropriate message - shows on screen
			 */
			$scope.inUse = "'" + delType + "' is used by a ToDo item.\n  It cannot be removed!";
		}
	}
	
	/**
	 * Method to display the Edit Types page
	 */
	$scope.showEditTypesPage = function() {
		$scope.showTodos = false;
	}
	
	/**
	 * Method to display the ToDo page
	 */
	$scope.showToDoListPage = function() {
		$scope.showTodos = true;
	}
	
});
