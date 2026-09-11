import { Product, MigrationColumnMapping } from '../types';

export function parseCSVToMatrix(csvContent: string): { headers: string[]; rows: string[][] } {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  // Detect delimiter: check semicolon, comma, tab
  const firstLine = lines[0];
  const countSemicolon = (firstLine.match(/;/g) || []).length;
  const countComma = (firstLine.match(/,/g) || []).length;
  const countTab = (firstLine.match(/\t/g) || []).length;

  let delimiter = ',';
  if (countSemicolon >= countComma && countSemicolon >= countTab) delimiter = ';';
  else if (countTab > countComma && countTab > countSemicolon) delimiter = '\t';

  const parseLine = (line: string): string[] => {
    // Basic CSV splitting handling quotes
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim().replace(/^"|"$/g, ''));
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine).filter(r => r.some(col => col.length > 0));

  return { headers, rows };
}

export function autoGuessColumnMapping(headers: string[]): MigrationColumnMapping {
  const findIndex = (patterns: string[]): number => {
    return headers.findIndex(h => {
      const clean = h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return patterns.some(p => clean.includes(p));
    });
  };

  return {
    eanCol: findIndex(['ean', 'barra', 'gtin', 'cod']),
    nameCol: findIndex(['nome', 'descri', 'produto', 'item', 'titulo']),
    costCol: findIndex(['custo', 'compra', 'preco_custo', 'vlr_custo']),
    priceCol: findIndex(['venda', 'preco', 'valor', 'preco_venda', 'vlr_venda']),
    stockCol: findIndex(['estoque', 'qtd', 'quantidade', 'saldo', 'saldo_atual']),
    minStockCol: findIndex(['min', 'minimo', 'est_min']),
    categoryCol: findIndex(['categoria', 'grupo', 'secao', 'tipo']),
    unitCol: findIndex(['unidade', 'un', 'unid', 'medida'])
  };
}

export function convertRowsToProducts(
  rows: string[][],
  mapping: MigrationColumnMapping,
  defaultMarkupPercent: number = 45
): Product[] {
  return rows.map((row, idx) => {
    const rawName = (mapping.nameCol >= 0 ? row[mapping.nameCol] : '') || `Item Importado ${idx + 1}`;
    const rawEan = (mapping.eanCol >= 0 ? row[mapping.eanCol] : '') || '';
    const cleanEan = rawEan.replace(/\D/g, '');

    const parseNum = (val: string): number => {
      if (!val) return 0;
      const clean = val.replace(/[R$\s]/g, '').replace(',', '.');
      return parseFloat(clean) || 0;
    };

    let costPrice = mapping.costCol >= 0 ? parseNum(row[mapping.costCol]) : 0;
    let salePrice = mapping.priceCol >= 0 ? parseNum(row[mapping.priceCol]) : 0;

    if (salePrice === 0 && costPrice > 0) {
      salePrice = Number((costPrice * (1 + defaultMarkupPercent / 100)).toFixed(2));
    } else if (costPrice === 0 && salePrice > 0) {
      costPrice = Number((salePrice / (1 + defaultMarkupPercent / 100)).toFixed(2));
    }

    const stock = mapping.stockCol >= 0 ? parseNum(row[mapping.stockCol]) : 10;
    const minStock = mapping.minStockCol >= 0 ? parseNum(row[mapping.minStockCol]) : 5;

    const rawCategory = mapping.categoryCol >= 0 ? (row[mapping.categoryCol] || '').toLowerCase() : '';
    let category: 'fechados' | 'granel' | 'farmacia' | 'petcare' = 'fechados';
    const lowerName = rawName.toLowerCase();

    if (rawCategory.includes('farm') || rawCategory.includes('medic') || lowerName.includes('simparic') || lowerName.includes('bravecto') || lowerName.includes('verm') || lowerName.includes('vacina')) {
      category = 'farmacia';
    } else if (rawCategory.includes('granel') || lowerName.includes('granel') || lowerName.includes('quilo') || lowerName.includes('kg')) {
      category = 'granel';
    } else if (rawCategory.includes('estetica') || rawCategory.includes('higiene') || lowerName.includes('shampoo') || lowerName.includes('brinquedo')) {
      category = 'petcare';
    }

    const unit = (mapping.unitCol >= 0 ? row[mapping.unitCol] : '') || (category === 'granel' ? 'kg' : 'UN');
    const isGranel = category === 'granel';

    return {
      id: `imported-prod-${idx + 1}-${Date.now()}`,
      name: rawName,
      sku: cleanEan || `IMP-${String(idx + 1).padStart(4, '0')}`,
      price: salePrice > 0 ? salePrice : 29.90,
      costPrice: costPrice > 0 ? costPrice : 18.50,
      marginPercent: defaultMarkupPercent,
      unit,
      stock,
      minStock,
      location: isGranel ? 'Silo Central' : 'Prateleira A',
      image: isGranel
        ? 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&auto=format&fit=crop&q=80',
      isGranel,
      remainingKg: isGranel ? stock : undefined,
      maxKg: isGranel ? Math.max(stock, 25) : undefined,
      category,
      supplier: 'Migração de Sistema'
    };
  });
}
