const { readFileSync } = require('fs');

class ServicoCalculoFatura {

  constructor(repo) {
    this.repo = repo;
  }

  calcularTotalApresentacao(apre) {
    let total = 0;
    switch (this.repo.getPeca(apre).tipo) {
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
        throw new Error(`Peça desconhecia: ${this.repo.getPeca(apre).tipo}`);
    }
    return total;
  }
  
  calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (this.repo.getPeca(apre).tipo === "comedia") 
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

class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}

function gerarFaturaStr (fatura, calc) {

  const formato = formatarMoeda;

  // corpo principal (após funções aninhadas)
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formato(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formato(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
  return faturaStr;
}

function gerarFaturaHTML(fatura, calc) {
  const formato = formatarMoeda;

  // corpo principal (após funções aninhadas)
  let faturaStr = "<html>"
  faturaStr += `<p>Fatura ${fatura.cliente}</p>`;
  faturaStr += "<ul>";
  for (let apre of fatura.apresentacoes) {
    faturaStr += `<li>  ${calc.repo.getPeca(apre).nome}: ${formato(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)</li>`;
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

const faturas = JSON.parse(readFileSync('./faturas.json'));

const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
const faturaHtml = gerarFaturaHTML(faturas, calc);
console.log(faturaStr);
//console.log(faturaHtml);
