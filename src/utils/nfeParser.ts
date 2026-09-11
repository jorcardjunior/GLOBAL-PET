import { ImportedItem, ImportedNFe } from '../types';

export function parseNFeXML(xmlString: string, defaultMarkup: number = 45): ImportedNFe {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Arquivo XML inválido ou corrompido: ' + parserError.textContent);
  }

  // Chave de acesso
  const infNFe = xmlDoc.querySelector('infNFe');
  const rawId = infNFe?.getAttribute('Id') || '';
  const chaveAcesso = rawId.replace(/^NFe/i, '') || `3526${Math.floor(Math.random() * 1e12)}55001000${Math.floor(Math.random() * 1e8)}`;

  // Ide
  const nNF = xmlDoc.querySelector('ide > nNF')?.textContent?.trim() || 'NF-' + Math.floor(10000 + Math.random() * 90000);
  const serie = xmlDoc.querySelector('ide > serie')?.textContent?.trim() || '1';
  const dhEmi = xmlDoc.querySelector('ide > dhEmi')?.textContent?.trim() ||
                 xmlDoc.querySelector('ide > dEmi')?.textContent?.trim() ||
                 new Date().toISOString().split('T')[0];

  // Emitente (Fornecedor)
  const emitNome = xmlDoc.querySelector('emit > xFant')?.textContent?.trim() ||
                   xmlDoc.querySelector('emit > xNome')?.textContent?.trim() ||
                   'Distribuidora Parceira Pet & Agro';
  const emitCnpj = xmlDoc.querySelector('emit > CNPJ')?.textContent?.trim() || '00.000.000/0001-00';

  // Valor Total
  const vNF = parseFloat(xmlDoc.querySelector('total > ICMSTot > vNF')?.textContent || '0');

  // Itens (det)
  const detElements = Array.from(xmlDoc.querySelectorAll('det'));
  const items: ImportedItem[] = [];

  detElements.forEach((det, idx) => {
    const prod = det.querySelector('prod');
    if (!prod) return;

    const cProd = prod.querySelector('cProd')?.textContent?.trim() || `SKU-${idx + 1}`;
    const rawEan = prod.querySelector('cEAN')?.textContent?.trim() || '';
    const ean = (rawEan === 'SEM GTIN' || !rawEan) ? '' : rawEan;
    const xProd = prod.querySelector('xProd')?.textContent?.trim() || `Produto ${idx + 1}`;
    const ncm = prod.querySelector('NCM')?.textContent?.trim() || '2309.90.10';
    const uCom = (prod.querySelector('uCom')?.textContent?.trim() || 'UN').toUpperCase();
    const qCom = parseFloat(prod.querySelector('qCom')?.textContent || '1') || 1;
    const vUnCom = parseFloat(prod.querySelector('vUnCom')?.textContent || '0') || 0;
    const vProd = parseFloat(prod.querySelector('vProd')?.textContent || '0') || (qCom * vUnCom);

    // Detecção inteligente de Categoria
    const lowerName = xProd.toLowerCase();
    let category: 'fechados' | 'granel' | 'farmacia' | 'petcare' = 'fechados';
    if (lowerName.includes('verm') || lowerName.includes('pulga') || lowerName.includes('simparic') || lowerName.includes('bravecto') || lowerName.includes('nexgard') || lowerName.includes('vacina') || lowerName.includes('shampoo')) {
      category = lowerName.includes('shampoo') ? 'petcare' : 'farmacia';
    } else if (lowerName.includes('granel') || lowerName.includes('quilo') || lowerName.includes('silo')) {
      category = 'granel';
    } else if (lowerName.includes('brinquedo') || lowerName.includes('coleira') || lowerName.includes('guia') || lowerName.includes('cama')) {
      category = 'petcare';
    }

    // Fator de Conversão Pet Shop & Agropecuária
    let conversionType: 'unidade' | 'fracionar_caixa' | 'despejar_granel' = 'unidade';
    let conversionFactor = 1;
    let convertedUnit = uCom;

    // 1. Verificação de Caixas fracionáveis (Sachês, Medicamentos, Pipetas)
    const matchBox12 = lowerName.match(/(cx|caixa|display|c\/|com)\s*(\d+)/i);
    const matchUnitUn = lowerName.match(/(\d+)\s*(un|und|saches|sachês)/i);

    if (uCom === 'CX' || uCom === 'FD' || matchBox12) {
      const extractedFactor = matchBox12 ? parseInt(matchBox12[2], 10) : (matchUnitUn ? parseInt(matchUnitUn[1], 10) : 12);
      if (extractedFactor > 1) {
        conversionType = 'fracionar_caixa';
        conversionFactor = extractedFactor;
        convertedUnit = 'UN';
      }
    }

    // 2. Verificação de Sacos de Ração para Granel (15kg, 20kg, 25kg)
    const matchKg = lowerName.match(/(\d+(?:\.\d+)?)\s*(kg|kilos|quilos)/i);
    if ((lowerName.includes('racao') || lowerName.includes('ração') || lowerName.includes('dog') || lowerName.includes('cat') || lowerName.includes('premier') || lowerName.includes('golden') || lowerName.includes('special')) && matchKg) {
      const kgWeight = parseFloat(matchKg[1]);
      if (kgWeight >= 10 && (uCom === 'SC' || uCom === 'UN' || uCom === 'PCT')) {
        conversionType = 'despejar_granel';
        conversionFactor = kgWeight;
        convertedUnit = 'kg';
        category = 'granel';
      }
    }

    const convertedQuantity = qCom * conversionFactor;
    const convertedUnitCost = vUnCom / conversionFactor;

    // Cálculo da Margem de Venda Sugerida
    const marginMultiplier = 1 + (defaultMarkup / 100);
    const suggestedSalePrice = Number((convertedUnitCost * marginMultiplier).toFixed(2));

    items.push({
      id: `item-${idx + 1}-${Date.now()}`,
      code: cProd,
      ean,
      name: xProd,
      ncm,
      unit: uCom,
      quantity: qCom,
      unitCost: vUnCom,
      totalCost: vProd,
      suggestedSalePrice,
      marginPercent: defaultMarkup,
      category,
      conversionType,
      conversionFactor,
      convertedQuantity,
      convertedUnitCost,
      convertedUnit
    });
  });

  // Duplicatas / Boletos a pagar
  const boletos: { numero: string; vencimento: string; valor: number }[] = [];
  const dupElements = Array.from(xmlDoc.querySelectorAll('cobr > dup'));

  dupElements.forEach((dup, idx) => {
    const nDup = dup.querySelector('nDup')?.textContent?.trim() || `00${idx + 1}`;
    const dVenc = dup.querySelector('dVenc')?.textContent?.trim() || '';
    const vDup = parseFloat(dup.querySelector('vDup')?.textContent || '0') || 0;

    boletos.push({
      numero: `Boleto ${nDup} - NF ${nNF}`,
      vencimento: dVenc,
      valor: vDup
    });
  });

  // Se não houver duplicatas explícitas, sugere parcela padrão
  if (boletos.length === 0 && vNF > 0) {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 28);
    boletos.push({
      numero: `Boleto Único - NF ${nNF}`,
      vencimento: defaultDate.toISOString().split('T')[0],
      valor: vNF
    });
  }

  return {
    id: `nfe-${Date.now()}`,
    chaveAcesso,
    numeroNota: nNF,
    serie,
    dataEmissao: dhEmi.substring(0, 10),
    fornecedorNome: emitNome,
    fornecedorCnpj: emitCnpj,
    valorTotal: vNF > 0 ? vNF : items.reduce((acc, i) => acc + i.totalCost, 0),
    status: 'pendente_conferencia',
    sourceType: 'xml',
    items,
    boletos,
    createdAt: new Date().toISOString()
  };
}
