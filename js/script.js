console.log("JS script integrated");

function openpage() {
    let current_url = window.location;
    open.play();
    console.log("current_url main === ", current_url);
    setTimeout(() => {
        current_url = current_url + 'pages/blogview.html';
        console.log("current_url === ", current_url);
        window.location.replace(current_url);

    }, 2000);
}
 
const burst = new mojs.Burst({
    radius:   { 0: 300 },
    count:    30,
    children: {
    //   shape:      'rect',
      shape:      'polygon',
      points:     30,
      fill:       [ '#573e67', '#600f92' , '#cfcbd1' ],
      rotate:      { 180: 0 },
      radius:   8,
      duration:   2000,
      strokeWidth:  8,
      delay:      'stagger(0, 100)'
    }
  });

  const open = new mojs.Burst({
    radius:   { 0: 100 },
    count:    10,
    children: {
      shape:      'polygon',
      points:     5,
      fill:       { 'purple' : 'white' },
      rotate:      { 360: 0 },
      duration:   2000,
      delay:      'stagger(0, 100)'
    }
  });

//   setInterval(  ()=>{
//     // burst.generate();
//     burst.play();
//   }, 100);
  burst.play();