let colorIndicator = document.getElementById('color-indicator');
let nomeBlocoTxt = document.getElementById('nome-bloco');
let listaBlocos = [];

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
            let imgPreview = document.getElementById('bloco-img');
            imgPreview.src = `blocks/${result.bloco}.png`;
        }
    }
});