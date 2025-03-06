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
    var exp = expressao.replace(/([A-Z])/g, match => valores[match]);
    exp = exp.replace(/\^/g, '&&').replace(/v/g, '||').replace(/˜/g, '!');
    return eval(exp) ? 1 : 0;
}
