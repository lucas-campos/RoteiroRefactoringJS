const { readFileSync } = require('fs');
var Repositorio = require("./repositorio.js");
var ServicoCalculoFatura = require("./servico.js");
var gerarFaturaStr = require("./apresentacao.js");

const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);

// function gerarFaturaHTML(fatura, calc) {
//   const formato = formatarMoeda;
//   // corpo principal (após funções aninhadas)
//   let faturaStr = "<html>"
//   faturaStr += `<p>Fatura ${fatura.cliente}</p>`;
//   faturaStr += "<ul>";
//   for (let apre of fatura.apresentacoes) {
//     faturaStr += `<li>  ${calc.repo.getPeca(apre).nome}: ${formato(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)</li>`;
//   }
//   faturaStr += "</ul>";
//   faturaStr += `<p> Valor total: ${formato(calc.calcularTotalFatura(fatura.apresentacoes))} </p>`;
//   faturaStr += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} </p>`;
//   faturaStr += "</html>";
//   return faturaStr;
// }

// const faturaHtml = gerarFaturaHTML(faturas, calc);
// console.log(faturaHtml);
