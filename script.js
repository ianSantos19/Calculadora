function insert(caractere) {
    const mapeamento = {
        '1': '^',
        '2': '→',
        '3': '↔',
        '˜': '¬',
    };

    const caractereVisivel = mapeamento[caractere] || caractere;

    var resultado = document.getElementById('resultado');
    resultado.innerHTML += caractereVisivel;
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
    const mapeamentoInverso = {
        '^': '1',
        '→': '2',
        '↔': '3',
        '¬': '˜',
    };

    let exp = expressao.replace(/[→↔¬]/g, match => mapeamentoInverso[match]);

    exp = exp
        .replace(/\^/g, '&&')
        .replace(/v/g, '||')
        .replace(/2/g, '|| !')
        .replace(/3/g, '==')
        .replace(/˜/g, '!');

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
