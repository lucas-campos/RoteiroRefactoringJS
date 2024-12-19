const { readFileSync } = require('fs');

class ServicoCalculoFatura {

  calcularTotalApresentacao(apre) {
    let total = 0;
    switch (getPeca(apre).tipo) {
      case "tragedia":
        total = 40000;
        if (apre.audiencia > 30) {
          total += 1000 * (apre.audiencia - 30);
        }
        break;
      case "comedia":
        total = 30000;
        if (apre.audiencia > 20) {
            total += 10000 + 500 * (apre.audiencia - 20);
        }
        total += 300 * apre.audiencia;
        break;
      default:
        throw new Error(`Peça desconhecia: ${getPeca(apre).tipo}`);
    }
    return total;
  }
  
  calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(apre).tipo === "comedia") 
        creditos += Math.floor(apre.audiencia / 5);
    return creditos;   
  }
  
  calcularTotalFatura(apresentacoes) {
    let totalFatura = 0;
    for (let apre of apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(apre);
    }
    return totalFatura;
  }
  
  calcularTotalCreditos(apresentacoes) {
    let creditos = 0;
    for (let apre of apresentacoes) {
      creditos += this.calcularCredito(apre);
    }
    return creditos;
  }
}

function gerarFaturaStr (fatura, pecas, calc) {

  const formato = formatarMoeda;

  // corpo principal (após funções aninhadas)
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(apre).nome}: ${formato(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formato(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
  return faturaStr;
}

function gerarFaturaHTML(fatura, pecas, calc) {
  const formato = formatarMoeda;

  // corpo principal (após funções aninhadas)
  let faturaStr = "<html>"
  faturaStr += `<p>Fatura ${fatura.cliente}</p>`;
  faturaStr += "<ul>";
  for (let apre of fatura.apresentacoes) {
    faturaStr += `<li>  ${getPeca(apre).nome}: ${formato(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)</li>`;
  }
  faturaStr += "</ul>";
  faturaStr += `<p> Valor total: ${formato(calc.calcularTotalFatura(fatura.apresentacoes))} </p>`;
  faturaStr += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} </p>`;
  faturaStr += "</html>";
  return faturaStr;
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100);
}

// função query
function getPeca(apresentacao) {
  return pecas[apresentacao.id];
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

const calc = new ServicoCalculoFatura();
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
const faturaHtml = gerarFaturaHTML(faturas, pecas, calc);
console.log(faturaStr);
//console.log(faturaHtml);
