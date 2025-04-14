const canvas = document.querySelector('canvas');
const menu = document.querySelector('.menu');
const pontuacaoAtual = document.querySelector('.pontuacao-valor');
const pontuacaoFinal = document.querySelector('.pontuacao-final > span');
const botaoJogarNovamente = document.querySelector('.botao-jogar');

const contexto = canvas.getContext('2d');
const audio = new Audio('./assets/audioComeu.mp3')

const tamanhoCobrinha = 30;
let coordenadasCriarCobrinha = [
    {x: 270, y: 0}
]

const atribuirPontuacao = () => {
    pontuacaoAtual.innerText = parseInt(pontuacaoAtual.innerText) + 10;
}

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
    color: "white"
};

let direcao, jogoLoop;

const desenhandoCobrinha = () => {
    contexto.fillStyle = '#7be0ae';

    //desenhando a cobra com base na posicao do array de objetos e definindo sua largura e altura como 30
    coordenadasCriarCobrinha.forEach((posicao, index) =>  {
        //quando a cobra chegar na ultima coordenada em tamanho, a posição muda de cor
        if(index == coordenadasCriarCobrinha.length - 1){
            contexto.fillStyle = '#459db8'
        }
        contexto.fillRect(posicao.x, posicao.y, tamanhoCobrinha, tamanhoCobrinha);
    })
}

const desenhandoComida = () => {
     const comidaImagem = new Image();
     comidaImagem.src='./assets/peixeComida.png';
     comidaImagem.onload = function() {
        contexto.drawImage(comidaImagem, comida.x, comida.y, tamanhoCobrinha, tamanhoCobrinha)
    }
}

const moverCobrinha = () => {
    if(!direcao) return;

    const cabecaCobrinha = coordenadasCriarCobrinha[coordenadasCriarCobrinha.length - 1];

    coordenadasCriarCobrinha.shift();
    if(direcao == 'direita'){
        coordenadasCriarCobrinha.push({x: cabecaCobrinha.x + 30, y: cabecaCobrinha.y})
    }

    if(direcao == 'esquerda'){
        coordenadasCriarCobrinha.push({x: cabecaCobrinha.x - 30, y: cabecaCobrinha.y})
    }

    if(direcao == 'cima'){
        coordenadasCriarCobrinha.push({x: cabecaCobrinha.x, y: cabecaCobrinha.y - 30})
    }

    if(direcao == 'baixo'){
        coordenadasCriarCobrinha.push({x: cabecaCobrinha.x, y: cabecaCobrinha.y + 30})
    }
}

const desenhandoGrid = () => {
    contexto.lineWidth = 1;
    contexto.strokeStyle = '#00000020';

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
    const cabecaCobrinha = coordenadasCriarCobrinha[coordenadasCriarCobrinha.length - 1];
    
    //validando se a cabeça da cobra encostou na comida (se estão com a mesma posição no grid tanto horizontalmente quanto verticalmente)
    if(cabecaCobrinha.x == comida.x && cabecaCobrinha.y == comida.y){
        coordenadasCriarCobrinha.push(cabecaCobrinha);
        atribuirPontuacao();
        audio.play();

        comida.x = posicaoAleatoriaComida(), 
        comida.y = posicaoAleatoriaComida();
    }
}

const colisao = () => {
    const cabecaCobrinha = coordenadasCriarCobrinha[coordenadasCriarCobrinha.length - 1];
    const limiteCanvas = canvas.width - tamanhoCobrinha;
    const antesCabecaCobra = coordenadasCriarCobrinha.length - 2;

    const colisaoParede = cabecaCobrinha.x < 0 || cabecaCobrinha.x > limiteCanvas || cabecaCobrinha.y < 0 || cabecaCobrinha.y > limiteCanvas
    const colisaoCobra = coordenadasCriarCobrinha.find((posicao, index) => {
        return index < antesCabecaCobra && posicao.x == cabecaCobrinha.x && posicao.y == cabecaCobrinha.y;
    })

    if(colisaoParede || colisaoCobra){
        vocePerdeu();
    }
}

const vocePerdeu = () => {
    direcao = undefined;
    menu.style.display = 'flex';
    pontuacaoFinal.innerText = pontuacaoAtual.innerText;
}

const jogo = () => {
    //limpando o timeOut anterior 
    clearInterval(jogoLoop);

    contexto.clearRect(0, 0, 600, 600);
    // desenhandoGrid();
    desenhandoComida();
    desenhandoCobrinha();
    moverCobrinha();
    cobrinhaComeu();
    colisao();

    jogoLoop = setTimeout(() => {
        jogo();
    }, 150)
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
 
botaoJogarNovamente.addEventListener('click', () => {
    pontuacaoAtual.innerText = '00';
    menu.style.display = 'none';
    coordenadasCriarCobrinha = [{x: 270, y: 240}];
})