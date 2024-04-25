var start = document.getElementById('Start');
var Stop = document.getElementById('stop');
var reset = document.getElementById('Reset');
var timer = document.getElementById('timer');
var interval;
var sec ;
var min;
var lefttime = 1500;



function clock(){
    
    min = Math.floor(lefttime/60);
    sec = lefttime%60;
    let update = timer.innerHTML = `${min.toString().padStart(2,0)}:${sec.toString().padStart(2,'0')}`
    
}
function startT(){
    
    interval = setInterval(()=>{
        lefttime--;
        clock();
        
    },1000)
}
        
    

function stopT(){
   clearInterval(interval);
  
}
function resetT(){
    clearInterval(interval);
    lefttime = 1500;
    clock();

}
start.addEventListener('click',startT);
reset.addEventListener('click',resetT);
Stop.addEventListener('click',stopT);