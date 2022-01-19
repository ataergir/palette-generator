//special shoutout to davy henry!!!

let h = document.querySelector("input[name='--h']");
let s = document.querySelector("input[name='--s']");
let l = document.querySelector("input[name='--l']");
let x = 0;
let prevX = 0;

//updates the colors when h, s or l changes
h.addEventListener('change', () => main());
s.addEventListener('change', () => main());
l.addEventListener('change', () => main());

//initialize background to primary color
main(1);

//selected color to primary or to clipboard
function buttons(e, x){
    //get h, s, l values from parent of the button
    let element = e.parentNode;
    hcopy = element.getAttribute("data-h");
    scopy = element.getAttribute("data-s");
    lcopy = element.getAttribute("data-l");
    
    //to primary
    if(x==1){
        h.value = hcopy;
        s.value = scopy;
        l.value = lcopy;
        main();
    }
    //to clipboard
    else if(x==2){
        copyToClipboard("hsl(" + hcopy + ", " + scopy + "%, " + lcopy + "%)");
    }
}

const copyToClipboard = str => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
        return navigator.clipboard.writeText(str);
    return Promise.reject('Clipboard API not available');
};
  
  
//main function 
function main(x = null){
    //allows to run the main function when h,s or l changes (without changing x)
    prevX = x ? x : prevX;
    let colorsBg = document.querySelector(".colors-bg-wrapper");
    const hsl = [parseFloat(h.value), parseFloat(s.value), parseFloat(l.value)];

    //8 darken, 9 lighten
    if(prevX == 8 || prevX == 9){
        luminosity(prevX);
    }else{
    
    //offest according to which button is/was clicked (x)
    let allColorsOffset = [[0],[0, 180], [150, 0, 210], [30, 0, -30], [120, 0, -120], [0, 90, 180, 270], [0, 60, 180, 240]];
    let colorsOffset = allColorsOffset[prevX - 1];

    let output = "";
    colorsOffset.forEach(offset => {
        hsl[offset] = hsl[0] + offset;
        if(hsl[offset]> 360){hsl[offset] = hsl[offset] - 360};
        if(hsl[offset]< 0){hsl[offset] = hsl[offset] + 360};

        let hslValue = `hsl(${Math.floor(hsl[offset])},${Math.floor(hsl[1])}%, ${Math.floor(hsl[2])}%)`;
        output += `<div class="color-bg" style="background-color: ${hslValue}" data-h="${hsl[offset]}" data-s="${hsl[1]}" data-l="${hsl[2]}">
        <button class="colorbtn primarybtn">primary</button>
        <button class="colorbtn copybtn">copy</button>
        <p>${hslValue}</p>
        </div>`;
    })
    colorsBg.innerHTML = output;

    //event listeners for "primary" and "copy" buttons
    document.querySelectorAll(".primarybtn").forEach(item =>{
    item.addEventListener('click', () => buttons(item, 1));
    })

    document.querySelectorAll(".copybtn").forEach(item =>{
        item.addEventListener('click', () => buttons(item, 2));
        })
    }
}

function luminosity(y){
    const hsl = [parseFloat(h.value), parseFloat(s.value), parseFloat(l.value)];

    let nbShades = document.querySelector(".shades-number").value; 

    //++ to avoid getting black or white
    nbShades++;

    let colorsBg = document.querySelector(".colors-bg-wrapper");
    
    let lumi = Array();
    lumi[0] = Math.floor(hsl[2]);
    for(k = 1; k < nbShades; k++){
        if(y == 8){
            lumi[k] = hsl[2] - hsl[2] / nbShades * k;
        }else if(y == 9){
            lumi[k] = hsl[2] + (100 - hsl[2]) / nbShades * k;
        }
    }

    let output = "";
    lumi.forEach(i => {
        let hslValue = `hsl(${Math.floor(hsl[0])},${Math.floor(hsl[1])}%, ${Math.floor(i)}%)`;
        output += `<div class="color-bg" style="background-color: ${hslValue}" data-h="${hsl[0]}" data-s="${hsl[1]}" data-l="${i}">
        <button class="colorbtn primarybtn">primary</button>
        <button class="colorbtn copybtn">copy</button>
        <p>${hslValue}</p>
        </div>`;     
    })
    colorsBg.innerHTML = output;

    document.querySelectorAll(".primarybtn").forEach(item =>{
        item.addEventListener('click', () => buttons(item, 1));
    })
    
    document.querySelectorAll(".copybtn").forEach(item =>{
        item.addEventListener('click', () => buttons(item, 2));
    })
}
