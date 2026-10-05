// Algoritmo calcula_hash da Alura adaptado para JS
function calculaHash(texto) {
    let valor = 0;
    for (let i = 0; i < texto.length; i++) {
        // Multiplica por 31 e soma o código ASCII do caractere
        valor = (valor * 31 + texto.charCodeAt(i));
        // Limita o valor ao equivalente a 32-bit (2**32) em JS
        valor = valor % 4294967296;
    }
    // Converte para hexadecimal com 8 dígitos e prefixo 0x
    const hex = valor.toString(16).padStart(8, '0');
    return `0x${hex}`;
}

// Elementos da interface
const input1 = document.getElementById('palavra1');
const input2 = document.getElementById('palavra2');
const hash1Span = document.getElementById('hash1');
const hash2Span = document.getElementById('hash2');
const statusDiv = document.getElementById('status-comparacao');
const btnBuscar = document.getElementById('btn-buscar');
const resultadoBusca = document.getElementById('resultado-busca');

// Atualiza validação na tela em tempo real
function atualizarComparacao() {
    const val1 = input1.value;
    const val2 = input2.value;

    if (val1.length === 0 || val2.length === 0) {
        hash1Span.textContent = "Hash: -";
        hash2Span.textContent = "Hash: -";
        statusDiv.className = "status";
        statusDiv.textContent = "";
        return;
    }

    const h1 = calculaHash(val1);
    const h2 = calculaHash(val2);

    hash1Span.textContent = `Hash: ${h1}`;
    hash2Span.textContent = `Hash: ${h2}`;

    if (val1.length < 2 || val2.length < 2) {
        statusDiv.className = "status diferente";
        statusDiv.textContent = "⚠️ Ambas as palavras precisam ter pelo menos 2 letras!";
    } else if (val1 === val2) {
        statusDiv.className = "status diferente";
        statusDiv.textContent = "⚠️ As palavras devem ser DIFERENTES!";
    } else if (h1 === h2) {
        statusDiv.className = "status sucesso";
        statusDiv.textContent = "🎉 COLISÃO ENCONTRADA! As duas palavras geram o mesmo hash!";
    } else {
        statusDiv.className = "status diferente";
        statusDiv.textContent = "❌ Os hashes são diferentes. Tente outras palavras.";
    }
}

input1.addEventListener('input', atualizarComparacao);
input2.addEventListener('input', atualizarComparacao);

// Função para buscar colisão via brute force / gerador
btnBuscar.addEventListener('click', () => {
    const caracteres = "abcdefghijklmnopqrstuvwxyz";
    const hashesVistos = new Map();

    // Gera palavras de 2 e 3 letras até encontrar uma colisão
    for (let c1 of caracteres) {
        for (let c2 of caracteres) {
            const palavra = c1 + c2;
            const h = calculaHash(palavra);

            if (hashesVistos.has(h) && hashesVistos.get(h) !== palavra) {
                exibirResultadoBusca(hashesVistos.get(h), palavra, h);
                return;
            }
            hashesVistos.set(h, palavra);
        }
    }

    // Tenta com 3 letras se não achar em 2
    for (let c1 of caracteres) {
        for (let c2 of caracteres) {
            for (let c3 of caracteres) {
                const palavra = c1 + c2 + c3;
                const h = calculaHash(palavra);

                if (hashesVistos.has(h) && hashesVistos.get(h) !== palavra) {
                    exibirResultadoBusca(hashesVistos.get(h), palavra, h);
                    return;
                }
                hashesVistos.set(h, palavra);
            }
        }
    }
});

function exibirResultadoBusca(p1, p2, hash) {
    resultadoBusca.classList.remove('hidden');
    resultadoBusca.innerHTML = `
        <strong>Colisão Encontrada!</strong><br>
        • Palavra 1: <code>"${p1}"</code><br>
        • Palavra 2: <code>"${p2}"</code><br>
        • Hash comum: <code>${hash}</code>
    `;

    // Preenche os inputs para mostrar na tela principal
    input1.value = p1;
    input2.value = p2;
    atualizarComparacao();
}
