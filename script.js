let colorIndicator = document.getElementById('color-indicator');
let nomeBlocoTxt = document.getElementById('nome-bloco');
let listaBlocos = [];

const imgPreview = document.getElementById('bloco-img');

fetch('cores_blocos.json')
    .then(response => response.json())
    .then(data => {
        blockList = data;
        console.log("Dados carregados!");
    });

var colorPicker = new iro.ColorPicker("#picker", {
    width: 180, color: "#fff" 
});

function findClosest(targetRGB) {
    let bestMatch = null;
    let closestDistance = Infinity;

    blockList.forEach(bloco => {
        const rB = parseInt(bloco.hex.substring(1, 3), 16);
        const gB = parseInt(bloco.hex.substring(3, 5), 16);
        const bB = parseInt(bloco.hex.substring(5, 7), 16);

        const dist = Math.sqrt(
            Math.pow(targetRGB.r - rB, 2) +
            Math.pow(targetRGB.g - gB, 2) +
            Math.pow(targetRGB.b - bB, 2)
        );

        if (dist < closestDistance) {
            closestDistance = dist;
            bestMatch = bloco;
        }
    });
    return bestMatch;
}

colorPicker.on('color:change', function(color) {
    colorIndicator.style.backgroundColor = color.hexString;

    if (blockList.length > 0) {
        const result = findClosest(color.rgb);

        if (result) {
            console.log("Closest block: ", result.bloco);
            imgPreview.src = `blocks/${result.bloco}.png`;
        }
    }
});

function setupPalette() {
    const boxes = document.querySelectorAll('.box');
    if (!boxes || boxes.length === 0) {
        console.error("Could not find any elements with class 'box'");
        return;
    }
    
    imgPreview.addEventListener('click', () => {
        const currentSrc = imgPreview.getAttribute('src');

        if (!currentSrc || currentSrc === "") { console.log("No block selected yet!"); return; }

        let added = false;
        for (let box of boxes) {
            if (box.children.length === 0) {
                const newImg = document.createElement('img');
                newImg.src = currentSrc;

                newImg.style.width = "100%";
                newImg.style.imageRendering = "pixelated";

                box.onclick = () => { box.innerHTML = ""; };

                box.appendChild(newImg);
                added = true;
                break;
            }
        }

        if (!added) {
            console.log("Pallete is full!");
        }

    });

}

document.addEventListener('DOMContentLoaded', setupPalette);