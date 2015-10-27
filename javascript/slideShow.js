window.addEventListener('load', slideShow);

function slideShow() {
  
  /* GLOBALS **********************************************************************************************/
  var globals = {
    slideDelay: 2500, fadeDelay: 35, 
    wrapperID: "slideShowImages",buttonID: "slideShowButton", 
    buttonStartText: "Start Slides",buttonStopText: "Stop Slides", 
    wrapperObject: null, buttonObject: null, 
    slideImages: [], slideShowID: null,
    slideShowRunning: true,slideIndex: 0
  }
  /* MAIN *************************************************************************************************/
  initializeGlobals();  

  if ( insufficientSlideShowMarkup() ) {
    return; 
  }
  if (globals.slideImages.length == 1) {
    return; 
  }
  initializeSlideShowMarkup();
  globals.wrapperObject.addEventListener('click', toggleSlideShow, false);
  if (globals.buttonObject) {
    globals.buttonObject.addEventListener('click', toggleSlideShow, false);
  }   
  startSlideShow();
  /* FUNCTIONS ********************************************************************************************/

  function initializeGlobals() {   
    globals.wrapperObject = (document.getElementById(globals.wrapperID) ? document.getElementById(globals.wrapperID) : null);
    globals.buttonObject = (document.getElementById(globals.buttonID) ? document.getElementById(globals.buttonID) : null);   
    
    if (globals.wrapperObject) {
      globals.slideImages = (globals.wrapperObject.querySelectorAll('img') ? globals.wrapperObject.querySelectorAll('img') : []);
    }
  } // initializeGlobals
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function insufficientSlideShowMarkup() {
    if (!globals.wrapperObject) { // There is no wrapper element whose ID is globals.wrapperID - fatal error.
      if (globals.buttonObject) {
        globals.buttonObject.style.display = "none"; // Hide the not needed slide show button element when present.
      }
      return true;
    }

    if (!globals.slideImages.length) { // There needs to be at least one slide <img> element - fatal error.
      if (globals.wrapperObject) {
        globals.wrapperObject.style.display = "none"; // Hide the not needed <div> wrapper element.
      }
    
      if (globals.buttonObject) {
        globals.buttonObject.style.display = "none"; // Hide the not needed slide show button element.
      }
    
      return true;
    }
    
    return false; 
  } 
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function initializeSlideShowMarkup() {  
    var slideWidthMax = maxSlideWidth(); 
    var slideHeightMax = maxSlideHeight();
    
    globals.wrapperObject.style.position = "relative";
    globals.wrapperObject.style.overflow = "hidden";
    globals.wrapperObject.style.width = slideWidthMax + "px";
    globals.wrapperObject.style.height = slideHeightMax + "px";
    var slideCount = globals.slideImages.length;
    for (var i = 0; i < slideCount; i++) { 
      globals.slideImages[i].style.opacity = 0;
      globals.slideImages[i].style.position = "absolute";
      globals.slideImages[i].style.top = (slideHeightMax - globals.slideImages[i].getBoundingClientRect().height) / 2 + "px";   
      globals.slideImages[i].style.left = (slideWidthMax - globals.slideImages[i].getBoundingClientRect().width) / 2 + "px";               
    }
    
    globals.slideImages[0].style.opacity = 1; 
        
    if (globals.buttonObject) {
      globals.buttonObject.textContent = globals.buttonStopText;
    }
  } 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    
  function maxSlideWidth() {
    var maxWidth = 0;
    var maxSlideIndex = 0;
    var slideCount = globals.slideImages.length;
    
    for (var i = 0; i < slideCount; i++) {
      if (globals.slideImages[i].width > maxWidth) {
        maxWidth = globals.slideImages[i].width;
        maxSlideIndex = i; 
      }
    }
    return globals.slideImages[maxSlideIndex].getBoundingClientRect().width; 
  } 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function maxSlideHeight() {
    var maxHeight = 0;
    var maxSlideIndex = 0;    
    var slideCount = globals.slideImages.length;
    
    for (var i = 0; i < slideCount; i++) {
      if (globals.slideImages[i].height > maxHeight) {
        maxHeight = globals.slideImages[i].height; 
        maxSlideIndex = i; 
      }
    }
    return globals.slideImages[maxSlideIndex].getBoundingClientRect().height; // Account for the image's border, padding, and margin values. Note that getBoundingClientRect() is always in units of pixels.
  } 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function startSlideShow() {
    globals.slideShowID = setInterval(transitionSlides, globals.slideDelay);                
  } 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function haltSlideShow() {
    clearInterval(globals.slideShowID);   
  } 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function toggleSlideShow() {
    if (globals.slideShowRunning) {
      haltSlideShow();
      if (globals.buttonObject) { 
        globals.buttonObject.textContent = globals.buttonStartText; 
      }
    }
    else {
      startSlideShow();
      if (globals.buttonObject) { 
        globals.buttonObject.textContent = globals.buttonStopText; 
      }            
    }
    globals.slideShowRunning = !(globals.slideShowRunning);
  } 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function transitionSlides() {
    var currentSlide = globals.slideImages[globals.slideIndex];
    ++(globals.slideIndex);
    if (globals.slideIndex >= globals.slideImages.length) {
      globals.slideIndex = 0;
    }
    var nextSlide = globals.slideImages[globals.slideIndex];
    var currentSlideOpacity = 1; // Fade the current slide out.
    var nextSlideOpacity = 0; // Fade the next slide in.
    var opacityLevelIncrement = 1 / globals.fadeDelay;
    var fadeActiveSlidesID = setInterval(fadeActiveSlides, globals.fadeDelay);
    function fadeActiveSlides() {
      currentSlideOpacity -= opacityLevelIncrement;
      nextSlideOpacity += opacityLevelIncrement;
      // console.log(currentSlideOpacity + nextSlideOpacity); // This should always be very close to 1.
      if (currentSlideOpacity >= 0 && nextSlideOpacity <= 1) {
        currentSlide.style.opacity = currentSlideOpacity;
        nextSlide.style.opacity = nextSlideOpacity; 
      }
      else {
        currentSlide.style.opacity = 0;
        nextSlide.style.opacity = 1; 
        clearInterval(fadeActiveSlidesID);
      }        
    } // fadeActiveSlides
  } // transitionSlides  
} // slideShow