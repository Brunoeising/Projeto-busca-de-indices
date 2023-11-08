const puppeteer = require('puppeteer');
const express = require('express');
const { Valueindices } = require("../models/ValueIndices");
const conn = require('../db/conn');
const cron = require('node-cron');

const app = express();

// Conexão com o banco
conn();

const urlsEIds = [
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/14/TJ-Acre', fonteId: 2 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/15/TJ-Alagoas', fonteId: 3 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/16/TJ-Amapá', fonteId: 4 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/17/TJ-Amazonas', fonteId: 1 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/18/TJ-Bahia', fonteId: 5 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/19/TJ-Ceará', fonteId: 6 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/20/TJ-Distrito%20Federal', fonteId: 7 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/21/TJ-Espirito%20Santo', fonteId: 8 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/22/TJ-Goiás', fonteId: 9 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/23/TJ-Maranhão', fonteId: 10 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/24/TJ-Mato%20Grosso', fonteId: 11 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/25/TJ-Mato%20Grosso%20do%20Sul', fonteId: 12 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/26/TJ-Minas%20Gerais', fonteId: 13 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/27/TJ-Pará', fonteId: 14 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/28/TJ-Paraíba', fonteId: 15 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/29/TJ-Paraná', fonteId: 16 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/30/TJ-Pernambuco', fonteId: 17 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/31/TJ-Piauí', fonteId: 18 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/32/TJ-Rio%20de%20Janeiro', fonteId: 19 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/42/TJ-Rio%20Grande%20do%20Norte', fonteId: 20 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/33/TJ-Rio%20Grande%20do%20Sul', fonteId: 21 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/34/TJ-Rondônia', fonteId: 22 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/35/TJ-Roraima', fonteId: 23 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/37/TJ-Santa%20Catarina', fonteId: 24 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/38/TJ-São%20Paulo', fonteId: 25 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/39/TJ-Sergipe', fonteId: 26 },
  { dadosUrl: 'https://www.excelcontabilidade.com.br/indicador/40/TJ-Tocantins', fonteId: 27 },

];

async function extrairValorDaFonte(dadosUrl, fonteId) { // Adicione os parâmetros aqui
  const loginUrl = 'https://www.excelcontabilidade.com.br/painel/login';
  const cpf = '81145054000147';
  const senha = 'duo@2019';

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Acessar a página de login
  await page.goto(loginUrl);

  // Preencher o formulário de login
  await page.type('input[name="email-cpf"]', cpf);
  await page.type('input[name="pass"]', senha);

  // Enviar o formulário de login
  await page.click('button[type="submit"]');

  // Aguardar o redirecionamento para a página de dados
  await page.waitForNavigation();

  // Acessar a página de dados
  await page.goto(dadosUrl);

  const data = await page.evaluate(() => {
    const mesParaNumero = {
      "Janeiro": 1,
      "Fevereiro": 2,
      "Março": 3,
      "Abril": 4,
      "Maio": 5,
      "Junho": 6,
      "Julho": 7,
      "Agosto": 8,
      "Setembro": 9,
      "Outubro": 10,
      "Novembro": 11,
      "Dezembro": 12,
    };

    const tabela = document.querySelector('.tabela_indicadores');
    const linhas = tabela.querySelectorAll('tbody tr');
    let anoAnterior = null;

    return Array.from(linhas).slice(1).flatMap((linha, index) => {
        const colunas = linha.querySelectorAll('td');
        const ano = parseInt(colunas[0].textContent.trim()) || anoAnterior;
        anoAnterior = ano;

        return Array.from(colunas).slice(1).map((coluna, colunaIndex) => {
            const mesString = colunas[0].textContent.trim();
            const mesNumero = mesParaNumero[mesString] || (colunaIndex + 1);
            let valorTexto = coluna.textContent.trim();
            valorTexto = valorTexto === '---' ? null : valorTexto.replace(',', '.');
            const valor = valorTexto ? parseFloat(valorTexto) : null;

            return { 'Índice': '1', 'Mês': mesNumero, 'Ano': ano, 'Valor': valor };
        });
    });
});

for (const item of data) {
  if (item['Ano'] >= 1994) {  // Esta linha garante que apenas anos a partir de 1994 sejam considerados
      if (item['Valor'] !== null) {  
          const exists = await Valueindices.findOne({ ano: item['Ano'], mes: item['Mês'], fonteId: fonteId });
          if (!exists) {
              await Valueindices.create({
                  fonteId: fonteId,
                  ano: item['Ano'],
                  mes: item['Mês'],
                  valor: item['Valor'],
                  observações: ''
              });
          }
      }
  }
}

await browser.close();
}

// Para cada URL/ID, execute a função
for (const { dadosUrl, fonteId } of urlsEIds) {
  extrairValorDaFonte(dadosUrl, fonteId);
}