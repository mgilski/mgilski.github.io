!(function(d){
  // Variables to target our base class,  get carousel items, count how many carousel items there are, set the slide to 0 (which is the number that tells us the frame we're on), and set motion to true which disables interactivity.
  var itemClassName = "carousel__photo";
      items = d.getElementsByClassName(itemClassName),
      totalItems = items.length,
      slide = 0,
      moving = true,
      x0 = null; 

  // To initialise the carousel we'll want to update the DOM with our own classes
  function setInitialClasses() {

    // Target the last, initial, and next items and give them the relevant class.
    // This assumes there are three or more items.
    items[totalItems - 1].classList.add("prev");
    items[0].classList.add("active");
    items[1].classList.add("next");
  }

  function unify(e) { return e.changedTouches ? e.changedTouches[0] : e };

  function lock(e) { x0 = unify(e).clientX };

  function move(e) {
    if(x0 || x0 === 0) {
      let dx = unify(e).clientX - x0, s = Math.sign(dx);
    
      if(s > 0) { movePrev(); }
      else if(s < 0) { moveNext(); }
    
      x0 = null;
    }
  };

  // Set click events to navigation buttons

  function setEventListeners() {
    var next = d.getElementsByClassName('carousel__button--next')[0],
        prev = d.getElementsByClassName('carousel__button--prev')[0];

    next.addEventListener('click', moveNext);
    prev.addEventListener('click', movePrev);

    var imgs = d.getElementsByClassName('carousel__photo');

    for (let img of imgs) {
      img.addEventListener('mousedown', lock, false);
      img.addEventListener('touchstart', lock, false);

      img.addEventListener('mouseup', move, false);
      img.addEventListener('touchend', move, false);
      img.addEventListener('touchmove', e => {e.preventDefault()}, false);      
    }
  }

  // Disable interaction by setting 'moving' to true for the same duration as our transition (0.5s = 500ms)
  function disableInteraction() {
    moving = true;

    setTimeout(function(){
      moving = false
    }, 500);
  }

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function moveCarouselTo(slide, dirNext) {

    // Check if carousel is moving, if not, allow interaction
    if(!moving) {

      // temporarily disable interactivity
      disableInteraction();

      // Preemptively set variables for the current next and previous slide, as well as the potential next or previous slide.
      var newPrevious = mod(slide - 1, totalItems),
          newNext = (slide + 1) % totalItems,
          oldPrevious = mod(slide - 2, totalItems),
          oldNext = (slide + 2) % totalItems;
          console.log(slide);

      // Test if carousel has more than three items
      if (false/*totalItems  > 2*/) {

        // Checks if the new potential slide is out of bounds and sets slide numbers
        if (newPrevious <= 0) {
          oldPrevious = (totalItems - 1);
        } else if (newNext >= (totalItems - 1)){
          oldNext = 0;
        }

        // Check if current slide is at the beginning or end and sets slide numbers
        if (slide === 0) {
          newPrevious = (totalItems - 1);
          oldPrevious = (totalItems - 2);
          oldNext = (slide + 1);
        } else if (slide === (totalItems -1)) {
          newPrevious = (slide - 1);
          newNext = 0;
          oldNext = 1;
        }

        // Now we've worked out where we are and where we're going, by adding and removing classes, we'll be triggering the carousel's transitions.

        // Based on the current slide, reset to default classes.
        for (var i = items.length - 1; i >= 0; i--) {
          items[i].className = itemClassName;
        }
        // items[oldPrevious].className = itemClassName;
        // items[oldNext].className = itemClassName;

        // Add the new classes
        items[newPrevious].className = itemClassName + " prev";
        items[newNext].className = itemClassName + " next";
        items[slide].className = itemClassName + " active";
      }
      else {
        console.log(newPrevious);
        if (dirNext === 1) {
          // items[slide].classList.add('notransition');
          items[slide].className = itemClassName + " next notransition";
          items[slide].offsetHeight;
          items[slide].classList.remove('notransition');
          items[newNext].className = itemClassName;
          items[newPrevious].className = itemClassName + " prev";
          items[slide].className = itemClassName + " active";
        }
        else {
          // items[slide].classList.add('notransition');
          items[slide].className = itemClassName + " prev notransition";
          items[slide].offsetHeight;
          items[slide].classList.remove('notransition');
          items[newPrevious].className = itemClassName;
          items[newNext].className = itemClassName + " next";
          items[slide].className = itemClassName + " active";
        }

      }

    }
  }

  // Next navigation handler
  function moveNext() {
    // Check if moving
    if (!moving) {

      // If it's the last slide, reset to 0, else +1
      if (slide === (totalItems - 1)) {
        slide = 0;
      } else {
        slide++;
      }

      // Move carousel to updated slide
      moveCarouselTo(slide, 1);
    }
  }

  // Previous navigation handler
  function movePrev() {

    // Check if moving
    if (!moving) {

      // If it's the first slide, set as the last slide, else -1
      if (slide === 0) {
        slide = (totalItems - 1);
      } else {
        slide--;
      }

      // Move carousel to updated slide
      moveCarouselTo(slide, 0);
    }
  }

  // Initialise carousel
  function initCarousel() {
    setInitialClasses();
    setEventListeners();

    // Set moving to false now that the carousel is ready
    moving = false;
  }

  // make it rain
  initCarousel();

}(document));