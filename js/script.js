var itemsArray = document.getElementsByClassName('slide');
var slContainer = document.getElementsByClassName('slide-container')[0];

window.onload = function(){
  SizeCorrection(itemsArray, slContainer.parentNode.getBoundingClientRect().width);

  // Hashed references disabling
  var aArray = document.querySelectorAll('a[href="#"]');
  for (var i = 0, length = aArray.length; i < length; i++){
    aArray[i].addEventListener('click', Stop, false);
    }
  function Stop(e){
    e.preventDefault();
  }

  // Nav menu hide/show
  var menu = document.getElementsByClassName("menu")[0];
  var mClose = menu.getElementsByClassName("menu-closer")[0];
  var mShow = document.getElementsByClassName("menu-show")[0];

  if (mClose.addEventListener){
    mClose.addEventListener("click", toggleHide, false);
    mShow.addEventListener("click", toggleHide, false);
  }
  else if (mClose.attachEvent){
    mClose.attachEvent("onclick", toggleHide);
    mShow.attachEvent("onclick", toggleHide);
  }

  function toggleHide(){
    menu.classList.toggle("is-hidden");
  }

}();

window.onresize = function(){
  SizeCorrection(itemsArray, slContainer.parentNode.getBoundingClientRect().width)
};

/* ---- Slide resize depending on viewport width ---- */
function SizeCorrection(elems, width){
  var boundRect = elems[0].getBoundingClientRect();
  // element's default or current width
  var rectWidth = width || boundRect.width || (boundRect.right - boundRect.left);
  // Browser viewport width
  var docWidth = document.body.clientWidth;
  var actualWidth = (rectWidth <= docWidth) ? rectWidth : docWidth;

  for (var i = 0; i < itemsArray.length; i++) {
    itemsArray[i].style.width = actualWidth + 'px';
  };

  // Correcting current translateX value
  var curTranslateX = Math.round(window.getComputedStyle(slContainer, "").transform.match(/\S+(?=,\s\S+\))/)[0]);// getting rounded value from matrix()
  var visibleSlideNo = Math.round(Math.abs(curTranslateX) / actualWidth);// get visible slide at the moment
  var correctTo;
  if(visibleSlideNo == 0) return;
  if(visibleSlideNo == 1){
    correctTo = curTranslateX + (actualWidth - Math.abs(curTranslateX)) * -1;
  }
  else{ // if slider has more than 2 slides
    correctTo = curTranslateX + ((visibleSlideNo -1) * (actualWidth - Math.abs(curTranslateX))) * -1;
  }
  slContainer.style.WebkitTransform = "translateX(" + correctTo + "px)";
  slContainer.style.msTransform = "translateX(" + correctTo + "px)";
  slContainer.style.MozTransform = "translateX(" + correctTo + "px)";
  slContainer.style.transform = "translateX(" + correctTo + "px)";
};




    /* ---- Slider ---- */




/* Sliding using arrows */
var slider = document.getElementsByClassName('slider')[0];
var getClicked;
var delay = 800;

if (slider.addEventListener){
  slider.addEventListener("click", isToggle, false);
}
else if (slider.attachEvent){
  slider.attachEvent("onclick", isToggle);
}

function isToggle(event){

  event.preventDefault();

    // Ban premature pressing
  var lastTimeOfClick = +localStorage.lastTimeOfClick;
  var nowTime = +new Date();
  if (lastTimeOfClick && (lastTimeOfClick + delay > nowTime)){
    return;
  }
  else{
    localStorage.lastTimeOfClick = nowTime;
  }

  var target = event.target; // Clicked object

  // Saves current active bullet
  var whatBullet = 0;
  for (var i = 0; i < pager.getElementsByTagName("a").length; i++) {
    if (pager.getElementsByTagName("a")[i].classList.contains("is-active")){
      whatBullet = i;
      break;
    };
  };

  if (target.className.match(/\bslider-prev\b/) || target.className.match(/\bslider-next\b/)) {
    if (target.className.match(/\bslider-prev\b/)){
      slideMotion(1);
      return;
    }
    else {
      slideMotion(-1);
      return;
    };
  }
  else {
    return;
  };

  function slideMotion( direction ){

    var containerBox = slContainer.getBoundingClientRect();
    var contWidth = containerBox.width || (containerBox.right - containerBox.left);
    var moveStep = contWidth / slContainer.getElementsByClassName("slide").length;
    // Calculation of "TranslateX" value to assign
    var stepTo = Math.round(window.getComputedStyle(slContainer, "").transform.match(/\S+(?=,\s\S+\))/)[0]) + moveStep * direction;
    // Prevent sliding over margin slides
    getClicked = slider.getBoundingClientRect();
    var sliderWidth = getClicked.width || (getClicked.right - getClicked.left);
    if ((contWidth - sliderWidth) < Math.abs(stepTo) || (stepTo > 0) ){
      return;
    };

    slContainer.style.WebkitTransform = "translateX(" + stepTo + "px)";
    slContainer.style.msTransform = "translateX(" + stepTo + "px)";
    slContainer.style.MozTransform = "translateX(" + stepTo + "px)";
    slContainer.style.transform = "translateX(" + stepTo + "px)";

  // Checking what bullet to be active (lighted)
    for (var i = 0; i < pager.getElementsByTagName("a").length; i++) {
      pager.getElementsByTagName("a")[i].classList.remove("is-active");
    };
    if(direction === 1){
      pager.getElementsByTagName("a")[whatBullet-1].classList.add("is-active");
    }
    else{
      pager.getElementsByTagName("a")[whatBullet+1].classList.add("is-active");
    }

  };
}




/* Sliding using "bullets" */
var pager = document.getElementsByClassName("slider-pager")[0];

if(pager.addEventListener){
  pager.addEventListener("click", changeSlide, false)
}
else if (pager.attachEvent){
  pager.attachEvent("onclick", changeSlide)
};

function changeSlide(event){

  event.preventDefault();
    // Ban premature pressing
  var lastTimeOfClick = +localStorage.lastTimeOfClick;
  var nowTime = +new Date();
  if (lastTimeOfClick && (lastTimeOfClick + delay > nowTime)){
    console.log("Banned!!! Clicking too often.")
    return;
  }
  else{
    localStorage.lastTimeOfClick = nowTime;
  }

  function getBulletIndex(elem) { // get the bullet order number
      var index = 0;
      while ( (elem = elem.previousSibling) ) {
          if (elem.nodeType != 3 || !/^\s*$/.test(elem.data)) {
              index++;
          }
      }
      return index;
  }
  var tog = event.target; // Clicked "bullet"

  if(tog == this || tog.classList.contains("is-active")) return;

  var r = slContainer.parentNode.getBoundingClientRect();
  // Determine number to translate sliderContainer depending on clicked bullet num.
  var translateRange = (r.width || (r.right - r.left)) * getBulletIndex(tog) * -1;

  slContainer.style.WebkitTransform = "translateX(" + translateRange + "px)";
  slContainer.style.msTransform = "translateX(" + translateRange + "px)";
  slContainer.style.MozTransform = "translateX(" + translateRange + "px)";
  slContainer.style.transform = "translateX(" + translateRange + "px)";
  // Changing active (lighted) bullet
  pager.getElementsByClassName("is-active")[0].classList.remove("is-active");
  tog.classList.add("is-active");
}