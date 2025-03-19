function insert(letras) {
    var letra = document.getElementById('resultado').innerHTML;
    document.getElementById('resultado').innerHTML = letra + letras;
}

function clean() {
    document.getElementById('resultado').innerHTML = '';
}

function back() {
    var resultado = document.getElementById('resultado').innerHTML;
    document.getElementById('resultado').innerHTML = resultado.substring(0, resultado.length - 1);
}

function calcular() {
    var expressao = document.getElementById('resultado').innerHTML;
    var tabela = document.getElementById('tabela');

    tabela.innerHTML = '';

    var variaveis = Array.from(new Set(expressao.match(/[A-Z]/g)));
    if (!variaveis) {
        alert("Expressão inválida: nenhuma variável encontrada.");
        return;
    }
    variaveis.sort();

    var linhas = Math.pow(2, variaveis.length);

    var cabecalho = '<tr>';
    for (var v of variaveis) {
        cabecalho += `<th>${v}</th>`;
    }
    cabecalho += `<th>Resultado</th></tr>`;
    tabela.innerHTML += cabecalho;

    for (var i = 0; i < linhas; i++) {
        var valores = {};
        var linha = '<tr>';

        for (var j = 0; j < variaveis.length; j++) {
            valores[variaveis[j]] = (i >> (variaveis.length - j - 1)) & 1;
            linha += `<td>${valores[variaveis[j]]}</td>`;
        }

        var resultado = avaliarExpressao(expressao, valores);
        linha += `<td>${resultado}</td></tr>`;
        tabela.innerHTML += linha;
    }
}

function avaliarExpressao(expressao, valores) {
    let exp = expressao.replace(/1/g, '&&').replace(/v/g, '||').replace(/2/g, '|| !').replace(/3/g, '==').replace(/˜/g, '!');

    exp = exp.replace(/([A-Z])/g, match => {
        if (valores[match] === undefined) {
            throw new Error(`Variável ${match} não encontrada nos valores fornecidos.`);
        }
        return valores[match];
    });

    exp = exp.replace(/\s+/g, '');

    try {
        const fn = new Function(`return ${exp}`);
        const resultado = fn();
        return resultado ? 1 : 0;
    } catch (e) {
        console.error("Erro ao avaliar a expressão:", e);
        console.error("Expressão que causou o erro:", exp);
        return 0;
    }
}

function implicacaoLogica(numeroVariaveis) {
    // Verifica se o número de variáveis é válido
    if (numeroVariaveis < 2) {
        alert("A implicação lógica requer pelo menos 2 variáveis.");
        return;
    }

    // Cria as variáveis (A, B, C, ...)
    var variaveis = [];
    for (let i = 0; i < numeroVariaveis; i++) {
        variaveis.push(String.fromCharCode(65 + i)); // 65 é o código ASCII para 'A'
    }

    // Obtém a referência da tabela
    var tabela = document.getElementById('tabela');
    tabela.innerHTML = ''; // Limpa a tabela

    // Cria o cabeçalho da tabela
    var cabecalho = '<tr>';
    for (let v of variaveis) {
        cabecalho += `<th>${v}</th>`;
    }
    cabecalho += `<th>A → B</th></tr>`; // Adiciona a coluna para a implicação
    tabela.innerHTML += cabecalho;

    // Calcula o número de linhas (2^numeroVariaveis)
    var linhas = Math.pow(2, numeroVariaveis);

    // Gera as linhas da tabela verdade
    for (let i = 0; i < linhas; i++) {
        var valores = {};
        var linha = '<tr>';

        // Preenche os valores das variáveis
        for (let j = 0; j < numeroVariaveis; j++) {
            valores[variaveis[j]] = (i >> (numeroVariaveis - j - 1)) & 1; // 0 ou 1
            linha += `<td>${valores[variaveis[j]]}</td>`;
        }

        // Cria a expressão lógica para a implicação (A → B)
        var expressao = `${variaveis[0]}->${variaveis[1]}`;

        // Usa a função avaliarExpressao para calcular o resultado
        var resultado = avaliarExpressao(expressao, valores);

        // Adiciona o resultado na linha
        linha += `<td>${resultado}</td></tr>`;
        tabela.innerHTML += linha;
    }
}
