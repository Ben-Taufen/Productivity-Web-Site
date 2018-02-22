
function addTask(){
  var todo = document.getElementById("todo");
  var newTask = todo.insertRow();
  var complete = newTask.insertCell(0);
  var description = newTask.insertCell(1);
  var category = newTask.insertCell(2);
  var dateAdded = newTask.insertCell(3);
  var deadline = newTask.insertCell(4);
  var removeTask = newTask.insertCell(5);


  task = document.getElementById("task").value;

  var obj=JSON.parse(document.getElementById("cat").value);
  category.innerHTML = obj.name;
  newTask.style.backgroundColor=obj.color;
  dl = document.getElementById("dl").value;
  description.innerHTML = task;
  dateAdded.innerHTML=Date();
  deadline.innerHTML=dl;

  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.setAttribute("onclick","check(this)")
  checkbox.setAttribute("checked",false)
  complete.appendChild(checkbox);

  var remove = document.createElement('input');
  remove.type ="button";
  remove.value = "Remove";
  remove.setAttribute("onclick","removeRow(this)")

  removeTask.appendChild(remove);


}
function changeFunc(){
  sort();
}
function sort(){
  var tasks = document.getElementById('todo');
  var selected = document.getElementById("sort").value;
  if(selected==="added"){

  }
}
function toggleAddCategory(){
  if(document.getElementById("cat").value===''){
    document.getElementById("newCategory").style.display="inline";
    document.getElementById("color").style.display="inline";
    document.getElementById("addCategory").style.display="inline";

  }

}
function addCategory(){
  var cats = document.getElementById("cat");
  var option = document.createElement("option");

  var newCat = document.getElementById("newCategory").value;
  var color = document.getElementById("color").value;

  option.text = newCat;
  option.value = "{\"name\":\"" + newCat + "\",\"color\":\"" + color + "\"}";
  var index = cats.selectedIndex;
  cats.add(option,index);
}
function check(checkbox){
  var temp = checkbox.checked;
  temp = !temp;
  checkbox.setAttribute("checked",temp);
}
function removeRow(btn){
  if (confirm('Are you sure you want to remove this task?')) {
    var row = btn.parentNode.parentNode.rowIndex;
    document.getElementById("todo").deleteRow(row);
  }
}
