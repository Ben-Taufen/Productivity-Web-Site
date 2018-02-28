
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
  checkbox.setAttribute("onclick","check(this)");
  checkbox.setAttribute("checked",false);
  complete.appendChild(checkbox);

  var remove = document.createElement('input');
  remove.type ="button";
  remove.value = "Remove";
  remove.setAttribute("onclick","removeRow(this)")

  removeTask.appendChild(remove);
  saveTable();
  createPieChart();

}
function changeFunc(){
  var selected = document.getElementById("sort").value;
  var n = 3; //set to sort by added
  if(selected==="added"){
    n=3;
  }else if(selected ==="deadline"){
    n=4;
  }else if(selected ==="category"){
    n=2;
  }else if(selected ==="complete"){
    n=0;
  }
  sortTable(n);
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
  cats.selectedIndex=index;
  document.getElementById("newCategory").style.display="none";
  document.getElementById("color").style.display="none";
  document.getElementById("addCategory").style.display="none";


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
    localStorage.clear();
    setTable();
  }
  createPieChart();
}
function createPieChart(){
  var canvas = document.getElementById('chartCanvas');
  canvas.width = 300;
  canvas.height = 300;
  var ctx = canvas.getContext('2d');



  var categs = [];
  var colors = [];
  var td = document.getElementById("todo").getElementsByTagName('td');
  var i=0;
  for(i=0;i<td.length;i++){
    if(td.item(i).cellIndex===2){
      var c = td.item(i).textContent;
      if(!categs.includes(c)){
        categs.push(c);
        colors.push(td.item(i).parentNode.style.backgroundColor)
      }
    }
  }
  var nums = [];
  for(i=0;i<categs.length;i++){
    nums.push(countCategory(categs[i]));
  }
  var chartCats = {};
  for(i=0;i<categs.length;i++){
    chartCats[categs[i]] = nums[i];
  }


  var PieChart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors=options.colors;
    this.legend=options.legend;

    this.draw = function(){
      var total_value = 0;
      var color_index = 0;
      for (var categ in this.options.data){
        val = this.options.data[categ];
        total_value+=val;
      }
      var start_angle = 0;
      for(categ in this.options.data){
        val = this.options.data[categ];
        var slice_angle = 2 * Math.PI * val/total_value;
        var pieRadius = Math.min(this.canvas.width/2,this.canvas.height/2);
        var labelX = this.canvas.width/2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle/2);
        var labelY = this.canvas.height/2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle/2);


        drawSlice(this.ctx,this.canvas.width/2,this.canvas.height/2,Math.min(this.canvas.width/2,this.canvas.height/2),start_angle,start_angle+slice_angle,this.colors[color_index%this.colors.length]);

        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 20px Arial";
        this.ctx.fillText(val,labelX,labelY);

        start_angle+=slice_angle;
        color_index++;
      }
      if(this.options.legend){
        color_index=0;
        var legendHTML = "";
        for (categ in this.options.data){
          legendHTML += "<div><span style='display:inline-block;width:20px;background-color:"+this.colors[color_index++]+";'>&nbsp;</span> "+categ+"</div>";
        }
        this.options.legend.innerHTML = legendHTML;
      }
    }
  }
  var myLegend = document.getElementById("chartLegend");
  var myPieChart = new PieChart({
    canvas:canvas,
    data:chartCats,
    colors:colors,
    legend:myLegend
  });
  myPieChart.draw();
}

function drawLine(ctx,startX,startY,endX,endY){
  ctx.beginPath();
  ctx.moveTo(startX,startY);
  ctx.lineTo(endX,endY);
  ctx.stroke();
}
function drawArc(ctx,centerX,centerY,radius,startAngle,endAngle){
  ctx.beginPath();
  ctx.arc(centerX,centerY,radius,startAngle,endAngle);
  ctx.stroke();
}
function drawSlice(ctx,centerX,centerY,radius,startAngle,endAngle,color){
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX,centerY);
  ctx.arc(centerX,centerY,radius,startAngle,endAngle);
  ctx.closePath();
  ctx.fill();
}
function countCategory(cat){

    var count = 0;
    var td = document.getElementById("todo").getElementsByTagName('td');
    var i=0;
    for(i=0;i<td.length;i++){
      if(td.item(i).textContent===cat && td.item(i).cellIndex===2){
        count++;
      }
    }

    return count;
}


function sortTable(n) {
  //I created this function with help from W3 schools https://www.w3schools.com/howto/howto_js_sort_table.asp
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("todo");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.getElementsByTagName("TR");
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {

        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function todoTable(complete,description,category,added,deadline,color){
  this.complete=complete;
  this.description=description;
  this.category=category;
  this.added=added;
  this.deadline=deadline;
  this.color=color;
}
function saveTable(){
  var table = document.getElementById("todo");
  var t = [];
  var col = 0;
  var rows = table.getElementsByTagName("TR");
  var i;
  for (i = 1; i < (rows.length); i++) {
    var co = rows[i].getElementsByTagName("TD")[0].innerHTML;
    var des = rows[i].getElementsByTagName("TD")[1].innerHTML;
    var ca = rows[i].getElementsByTagName("TD")[2].innerHTML;
    var a = rows[i].getElementsByTagName("TD")[3].innerHTML;
    var dea = rows[i].getElementsByTagName("TD")[4].innerHTML;
    var color = rows[i].style.backgroundColor;
    t.push(new todoTable(co,des,ca,a,dea,color));

  }
  localStorage.setItem("tableData",JSON.stringify(t));
}
function setTable(){
  var table = document.getElementById("todo");
  var t = localStorage.getItem("tableData");
  var obj=JSON.parse(t);
  var i;
  if(t==null){
    return;
  }
  for(i=0;i<t.length;i++){
    if(obj[i]==null){
`       //do nothing`
    }else{
    var newTask = table.insertRow();
    var complete = newTask.insertCell(0);
    var description = newTask.insertCell(1);
    var category = newTask.insertCell(2);
    var dateAdded = newTask.insertCell(3);
    var deadline = newTask.insertCell(4);
    var removeTask = newTask.insertCell(5);

    category.innerHTML = obj[i].category;
    newTask.style.backgroundColor=obj[i].color;
    description.innerHTML = obj[i].description;
    dateAdded.innerHTML=obj[i].added;
    deadline.innerHTML=obj[i].deadline;

    complete.innerHTML=obj[i].complete;

    var remove = document.createElement('input');
    remove.type ="button";
    remove.value = "Remove";
    remove.setAttribute("onclick","removeRow(this)")

    removeTask.appendChild(remove);

    createPieChart();
  }
  }
}
function openModal(){
  document.getElementById('myModal').style.display = "block";
}
function closeModal(){
  document.getElementById('myModal').style.display = "none";
}
var slideIndex = 1;
document.onkeydown = function(e){
  if(document.getElementById('myModal').style.display==="block"){
    if(e.keyCode=='39'){
      plusSlides(1);
    }
    if(e.keyCode=='37'){
      plusSlides(-1);
    }
    if(e.keyCode=='27'){
      closeModal();
    }
  }
}

function gallery(){

  showSlides(slideIndex);
}
function currentSlide(n){
  showSlides(slideIndex=n);
}
function plusSlides(n){
  showSlides(slideIndex += n);
}
function showSlides(n){
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  //var captionText = document.getElementById("caption");
  if(n>slides.length){
    slideIndex=1;
  }
  if(n<1){
    slideIndex=slides.length;
  }
  for(i=0;i<slides.length;i++){
    slides[i].style.display = "none";
  }
  for(i=0;i<dots.length;i++){
    dots[i].className=dots[i].className.replace(" active","");
  }
  slides[slideIndex-1].style.display="block";
  dots[slideIndex-1].className += " active";
  //captionText.innerHTML = dots[slideIndex-1].alt;
}
var play = false;

function playShow(){
  /*
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for(i=0;i<slides.length;i++){
    slides[i].style.display="none";
  }
  slideIndex++;
  if(slideIndex>slides.length){
    slideIndex=1;
  }
  slides[slideIndex-1].style.display = "block";
  setTimeout(playShow,2000);
*/

}
