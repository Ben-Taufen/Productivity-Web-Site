
function addTask(){
  var todo = document.getElementById("todo");
  var newTask = todo.insertRow();
  var complete = newTask.insertCell(0);
  var description = newTask.insertCell(1);
  var category = newTask.insertCell(2);
  var dateAdded = newTask.insertCell(3);
  var deadline = newTask.insertCell(4);

  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.name = "Complete";
  checkbox.value = "incomplete";
  checkbox.id = "complete";

  complete.appendChild(checkbox);
  task = document.getElementById("task").value;
  var obj=JSON.parse(document.getElementById("cat").value);
  category.innerHTML = obj.name;
  newTask.style.backgroundColor=obj.color;
  dl = document.getElementById("dl").value;
  description.innerHTML = task;
  dateAdded.innerHTML=Date();
  deadline.innerHTML=dl;

}

function handleCategory(newTask,category){
  var obj=JSON.parse(document.getElementById("cat").value);
  category.innerHTML = obj.name;
  newTask.styles.backgroundColor=obj.color;

}
