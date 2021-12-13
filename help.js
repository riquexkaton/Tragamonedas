lottie.loadAnimation({
    container: document.querySelector(".multi-img"), // the dom element that will contain the animation
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'money.json' // the path to the animation json
  });

  gsap.to(".item",{
      yoyo:true,
      stagger: 4,
      backgroundColor:"#F2C14E",
      repeat:-1,
      duration:0.5
  });

  gsap.from("h1",{
      opacity:0,
      duration:3
  });