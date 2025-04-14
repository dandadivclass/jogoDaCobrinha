const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


const tamanhoCobrinha = 30;
const coordenadasCobrinha = [
    {x: 270, y: 0}
]

const numeroAleatorio = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const posicaoAleatoriaComida = () => {
    const numero = numeroAleatorio(0, canvas.width - tamanhoCobrinha);
    return Math.round(numero / 30) * 30; //gerando numeros multiplos de 30
};

const comida = {
    x: posicaoAleatoriaComida(), 
    y: posicaoAleatoriaComida(), 
    color: "pink"
};

let direcao, jogoLoop;

const desenhandoCobrinha = () => {
    contexto.fillStyle = '#56d84a';

    //desenhando a cobra com base na posicao do array de objetos e definindo sua largura e altura como 30
    coordenadasCobrinha.forEach((posicao, index) =>  {
        //quando a cobra chegar na ultima coordenada em tamanho, a posição muda de cor
        if(index == coordenadasCobrinha.length - 1){
            contexto.fillStyle = '#10471a'
        }
        contexto.fillRect(posicao.x, posicao.y, tamanhoCobrinha, tamanhoCobrinha);
    })
}

const desenhandoComida = () => {
    contexto.fillStyle = comida.color;
    contexto.fillRect(comida.x, comida.y, tamanhoCobrinha, tamanhoCobrinha);
}

const moverCobrinha = () => {
    if(!direcao) return;

    const cabecaCobrinha = coordenadasCobrinha[coordenadasCobrinha.length - 1];

    coordenadasCobrinha.shift();
    if(direcao == 'direita'){
        coordenadasCobrinha.push({x: cabecaCobrinha.x + 30, y: cabecaCobrinha.y})
    }

    if(direcao == 'esquerda'){
        coordenadasCobrinha.push({x: cabecaCobrinha.x - 30, y: cabecaCobrinha.y})
    }

    if(direcao == 'cima'){
        coordenadasCobrinha.push({x: cabecaCobrinha.x, y: cabecaCobrinha.y - 30})
    }

    if(direcao == 'baixo'){
        coordenadasCobrinha.push({x: cabecaCobrinha.x, y: cabecaCobrinha.y + 30})
    }
}

const desenhandoGrid = () => {
    contexto.lineWidth = 1;
    contexto.strokeStyle = '#a4ddae2a';

    for(let index = 30; index < canvas.width; index += 30){
        contexto.beginPath();
        //linha começa da coordenada 0
        contexto.lineTo(index, 0);
        contexto.lineTo(index, 600);
        contexto.stroke();

        contexto.beginPath();
        contexto.lineTo(0, index);
        contexto.lineTo(600, index);
        contexto.stroke();
    }
}

const cobrinhaComeu = () => {
    const cabecaCobrinha = coordenadasCobrinha[coordenadasCobrinha.length - 1];

    //validando se a cabeça da cobra encostou na comida (se estão com a mesma posição no grid tanto horizontalmente quanto verticalmente)
    if(cabecaCobrinha.x == comida.x && cabecaCobrinha.y == comida.y){
        coordenadasCobrinha.push(cabecaCobrinha);

        comida.x = posicaoAleatoriaComida(), 
        comida.y = posicaoAleatoriaComida();
    }
}

const jogo = () => {
    //limpando o timeOut anterior 
    clearInterval(jogoLoop);

    contexto.clearRect(0, 0, 600, 600);
    desenhandoGrid();
    desenhandoComida();
    desenhandoCobrinha();
    moverCobrinha();
    cobrinhaComeu();

    jogoLoop = setTimeout(() => {
        jogo();
    }, 190)
}

jogo();

document.addEventListener('keydown', (event) => {
    if((event.key == 'ArrowRight' && direcao != 'esquerda') || (event.key == 'd' && direcao != 'esquerda')){
        direcao = 'direita';
    }
    if((event.key == 'ArrowLeft' && direcao != 'direita') || (event.key == 'a' && direcao != 'direita')){
        direcao = 'esquerda';
    }
    if((event.key == 'ArrowUp' && direcao != 'baixo') || (event.key == 'w' && direcao != 'baixo')){
        direcao = 'cima';
    }
    if((event.key == 'ArrowDown' && direcao != 'cima') || (event.key == 's' && direcao != 'cima')){
        direcao = 'baixo';
    }
})
