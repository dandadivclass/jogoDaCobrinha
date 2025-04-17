const canvas = document.querySelector('canvas');
const menu = document.querySelector('.menu');
const pontuacaoAtual = document.querySelector('.pontuacao-valor');
const pontuacaoFinal = document.querySelector('.pontuacao-final > span');
const botaoJogarNovamente = document.querySelector('.botao-jogar');

const contexto = canvas.getContext('2d');
const audio = new Audio('../assets/audioComeu.mp3')

const tamanhoCobrinha = 30;
let coordenadasCriarCobrinha = [
    {x: 270, y: 0}
]

let velocidade = 120; 

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

const posicaoAleatoriaObstaculo = () => {
    const numero = numeroAleatorio(0, canvas.width - tamanhoCobrinha);
    return Math.round(numero / 35) * 30;  
};

const posicaoAleatoriaPocoes= () => {
    const numero = numeroAleatorio(0, canvas.width - tamanhoCobrinha);
    return Math.round(numero / 40) * 30;  
};

const comida = {
    x: posicaoAleatoriaComida(), 
    y: posicaoAleatoriaComida(), 
    color: "white"
};

const obstaculos = [
    { x: posicaoAleatoriaObstaculo(), y: posicaoAleatoriaObstaculo() }
];


const pocao = {
    x: posicaoAleatoriaPocoes(),
    y: posicaoAleatoriaPocoes()
}

let direcao, jogoLoop;

const desenhandoCobrinha = () => {
    coordenadasCriarCobrinha.forEach((parte) => {
        contexto.fillStyle = corTemporariaCobra || corOriginalCobra;
        contexto.fillRect(parte.x, parte.y, tamanhoCobrinha, tamanhoCobrinha);
    });
}

const desenhandoComida = () => {
    const comidaImagem = new Image();
    comidaImagem.src='../assets/moedaDourada.png';
    contexto.drawImage(comidaImagem, comida.x, comida.y, 30, 30)

    // contexto.fillStyle = comida.color;
    // contexto.fillRect(comida.x, comida.y, tamanhoCobrinha, tamanhoCobrinha);
}

const desenhandoObstaculo = () => {
    const obstaculoImagem = new Image();
    obstaculoImagem.src = '../assets/espada2.png';

    obstaculos.forEach(obst => {
        contexto.drawImage(obstaculoImagem, obst.x, obst.y, 30, 30);
    });
};


let pocaoVermelha = '../assets/pocaoV.png';
let pocaoRoxa = '../assets/pocaoR.png';
let pocaoAmarela = '../assets/pocaoAmarela.png';
let pocaoVerde = '../assets/pocaoVD.png';

let corOriginalCobra = '#FFFFFF'; 
let corTemporariaCobra = null;
let tempoCorTemporaria = 0;
const tempoMaxCorTemporaria = 80; // 

const tomandoPocao = () => {
    let pocaoImagem = new Image();
    let tipoPocao = null;

    if(parseInt(pontuacaoAtual.innerText) >= 30 && parseInt(pontuacaoAtual.innerText) <= 40){
        pocaoImagem.src = pocaoVermelha;
        tipoPocao = 'vermelha';
    }else if(parseInt(pontuacaoAtual.innerText) >= 60 && parseInt(pontuacaoAtual.innerText) <= 70){
        pocaoImagem.src = pocaoRoxa;
        tipoPocao = 'roxa';
    }else if(parseInt(pontuacaoAtual.innerText) >= 80 && parseInt(pontuacaoAtual.innerText) <= 90){
        pocaoImagem.src = pocaoAmarela;
        tipoPocao = 'amarela';
    }else if(parseInt(pontuacaoAtual.innerText) >= 100 && parseInt(pontuacaoAtual.innerText) <= 110){
        pocaoImagem.src = pocaoVerde;
        tipoPocao = 'verde';
    }

    contexto.drawImage(pocaoImagem, pocao.x, pocao.y, 30, 30);

    const cabecaCobrinha = coordenadasCriarCobrinha[coordenadasCriarCobrinha.length - 1];

    if(cabecaCobrinha.x == pocao.x && cabecaCobrinha.y == pocao.y && tipoPocao === 'vermelha'){
        corTemporariaCobra = '#B80C09';
        tempoCorTemporaria = tempoMaxCorTemporaria;
    
        pocao.x = posicaoAleatoriaPocoes();
        pocao.y = posicaoAleatoriaPocoes();
    }else if (cabecaCobrinha.x == pocao.x && cabecaCobrinha.y == pocao.y && tipoPocao === 'roxa') {
        corTemporariaCobra = '#5B1865';
        tempoCorTemporaria = tempoMaxCorTemporaria;

        velocidade = 90;
        setTimeout(() => {
            velocidade = 120;
        }, 6000);

        pocao.x = posicaoAleatoriaPocoes();
        pocao.y = posicaoAleatoriaPocoes();
    }else if (cabecaCobrinha.x == pocao.x && cabecaCobrinha.y == pocao.y && tipoPocao === 'amarela') {
        corTemporariaCobra = '#F4FF52';
        tempoCorTemporaria = tempoMaxCorTemporaria;

        velocidade = 150;
        setTimeout(() => {
            velocidade = 120;
        }, 5000);


        pocao.x = posicaoAleatoriaPocoes();
        pocao.y = posicaoAleatoriaPocoes();
    }else if (cabecaCobrinha.x == pocao.x && cabecaCobrinha.y == pocao.y && tipoPocao === 'verde') {
        corTemporariaCobra = '#A5BE00';
        tempoCorTemporaria = tempoMaxCorTemporaria;

        pocao.x = posicaoAleatoriaPocoes();
        pocao.y = posicaoAleatoriaPocoes();
    }

     desenhandoCobrinha();

     if (tempoCorTemporaria > 0) {
        tempoCorTemporaria--;
        if (tempoCorTemporaria === 0) {
            corTemporariaCobra = null;  
        }
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

    if (cabecaCobrinha.x == comida.x && cabecaCobrinha.y == comida.y) {
        coordenadasCriarCobrinha.push(cabecaCobrinha);
        atribuirPontuacao();
        audio.play();

        let x = posicaoAleatoriaComida();
        let y = posicaoAleatoriaComida();

        while (
            coordenadasCriarCobrinha.some(p => p.x == x && p.y == y) ||
            obstaculos.some(p => p.x == x && p.y == y)
        ) {
            x = posicaoAleatoriaComida();
            y = posicaoAleatoriaComida();
        }

        comida.x = x;
        comida.y = y;

        if (obstaculos.length < 4) {
            let novoX, novoY;
            do {
                novoX = posicaoAleatoriaObstaculo();
                novoY = posicaoAleatoriaObstaculo();
            } while (
                coordenadasCriarCobrinha.some(p => p.x == novoX && p.y == novoY) ||
                (comida.x == novoX && comida.y == novoY) ||
                obstaculos.some(p => p.x == novoX && p.y == novoY)
            );

            obstaculos.push({ x: novoX, y: novoY });
        }
    }
};



const cobrinhaBateuObstaculo = () => {
    const cabeca = coordenadasCriarCobrinha[coordenadasCriarCobrinha.length - 1];

    if (obstaculos.some(obst => obst.x === cabeca.x && obst.y === cabeca.y)) {
        vocePerdeu();
    }
};

 

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



let direcaoPendente = null;

document.addEventListener('keydown', (event) => {
    if (!jogoAtivo || direcaoPendente) return;

    if (document.activeElement.tagName === 'INPUT') return;

    if ((event.key == 'ArrowRight' || event.key == 'd')  && direcao != 'esquerda') {
        direcaoPendente = 'direita';
    }
    if ((event.key == 'ArrowLeft' || event.key == 'a') && direcao != 'direita') {
        direcaoPendente = 'esquerda';
    }
    if ((event.key == 'ArrowUp' || event.key == 'w')  && direcao != 'baixo') {
        direcaoPendente = 'cima';
    }
    if ((event.key == 'ArrowDown' || event.key == 's')  && direcao != 'cima') {
        direcaoPendente = 'baixo';
    }
});


let jogoAtivo = true;

const vocePerdeu = () => {
    jogoAtivo = false;
    direcao = undefined;
    menu.style.display = 'flex';
    pontuacaoFinal.innerText = pontuacaoAtual.innerText;
    corTemporariaCobra = null;
    corOriginalCobra = '#FFFFFF';

    salvarNoRanking();
}

const inputNome = document.getElementById('Nome');
const rankingList = document.getElementById('ranking-container');

const atualizarRanking = () => {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];

    ranking.sort((a, b) => b.pontos - a.pontos);

    const topRanking = ranking.slice(0, 3);

    rankingList.innerHTML = '';

    topRanking.forEach((item, index) => {
        const medalha = index === 0
            ? '../assets/moedaRanking.png'
            : index === 1
            ? '../assets/moedaRankingPrata.png'
            : '../assets/moedaRankingCobre.png';

        rankingList.innerHTML += `
            <div class="div-pontuacao-ranking">
                <img src="${medalha}" alt="medalha">
                <p>${item.nome}</p>
                <p class="pontos-ranking">${item.pontos}</p>
            </div>
        `;
    });
};

const salvarNoRanking = () => {
    const nome = inputNome.value.trim();

    const pontos = parseInt(pontuacaoAtual.innerText);

    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const existe = ranking.find(item => item.nome === nome);

    if (existe) {
        if (pontos > existe.pontos) {
            existe.pontos = pontos;
        }
    } else {
        ranking.push({ nome, pontos });
    }

    localStorage.setItem('ranking', JSON.stringify(ranking));
    atualizarRanking();
};

atualizarRanking();

document.getElementById('limpar-ranking').addEventListener('click', () => {
    localStorage.removeItem('ranking');
    atualizarRanking();
});

const jogo = () => {
    if (!jogoAtivo) return;

    clearInterval(jogoLoop);

    contexto.clearRect(0, 0, 600, 600);
    // desenhandoGrid();
    desenhandoComida();
    desenhandoCobrinha();
    desenhandoObstaculo();
    tomandoPocao();
    cobrinhaBateuObstaculo();

    if (direcaoPendente) {
        direcao = direcaoPendente;
        direcaoPendente = null;
    }
    
    moverCobrinha();
    cobrinhaComeu();
    colisao();

    jogoLoop = setTimeout(jogo, velocidade);
    
}

jogo();

 
botaoJogarNovamente.addEventListener('click', () => {
    jogoAtivo = true;
    pontuacaoAtual.innerText = '00';
    menu.style.display = 'none';
    coordenadasCriarCobrinha = [{x: 270, y: 240}];

    comida.x = posicaoAleatoriaComida();
    comida.y = posicaoAleatoriaComida();

    obstaculos.length = 0;
    obstaculos.push({
        x: posicaoAleatoriaObstaculo(),
        y: posicaoAleatoriaObstaculo()
    });

    jogo();


})