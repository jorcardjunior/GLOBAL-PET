import { SefazIncomingInvoice } from '../types';

export const MOCK_NFE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe35260904581290001845500100004820121894210984" versao="4.00">
      <ide>
        <cUF>35</cUF>
        <cNF>04820121</cNF>
        <natOp>VENDA DE MERCADORIA ADQUIRIDA</natOp>
        <mod>55</mod>
        <serie>1</serie>
        <nNF>48201</nNF>
        <dhEmi>2026-09-05T10:30:00-03:00</dhEmi>
        <tpNF>1</tpNF>
        <idDest>1</idDest>
        <cMunFG>3550308</cMunFG>
        <tpImp>1</tpImp>
        <tpEmis>1</tpEmis>
      </ide>
      <emit>
        <CNPJ>08.329.110/0001-45</CNPJ>
        <xNome>DISTRIBUIDORA PET BRASIL LTDA</xNome>
        <xFant>PET BRASIL ATACADO & DISTRIBUIÇÃO</xFant>
        <IE>114892019112</IE>
        <CRT>3</CRT>
      </emit>
      <dest>
        <CNPJ>45.981.230/0001-84</CNPJ>
        <xNome>GLOBAL PET AGROPECUARIA E COMERCIO LTDA</xNome>
        <xFant>GLOBAL PET & AGRO</xFant>
        <IE>244901827110</IE>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>RC-MAXI-15</cProd>
          <cEAN>7896181210452</cEAN>
          <xProd>RAÇÃO ROYAL CANIN MAXI ADULT SACO 15KG</xProd>
          <NCM>2309.90.10</NCM>
          <uCom>SC</uCom>
          <qCom>4.0000</qCom>
          <vUnCom>248.5000</vUnCom>
          <vProd>994.00</vProd>
        </prod>
      </det>
      <det nItem="2">
        <prod>
          <cProd>GD-SPEC-15</cProd>
          <cEAN>7897348201948</cEAN>
          <xProd>RAÇÃO GOLDEN SPECIAL CÃES ADULTOS FRANGO E CARNE 15KG</xProd>
          <NCM>2309.90.10</NCM>
          <uCom>SC</uCom>
          <qCom>6.0000</qCom>
          <vUnCom>115.9000</vUnCom>
          <vProd>695.40</vProd>
        </prod>
      </det>
      <det nItem="3">
        <prod>
          <cProd>WHIS-SACH-CX12</cProd>
          <cEAN>7896014283912</cEAN>
          <xProd>SACHÊ WHISKAS CARNE AO MOLHO CX COM 12 UNIDADES 85G</xProd>
          <NCM>2309.10.00</NCM>
          <uCom>CX</uCom>
          <qCom>10.0000</qCom>
          <vUnCom>34.8000</vUnCom>
          <vProd>348.00</vProd>
        </prod>
      </det>
      <det nItem="4">
        <prod>
          <cProd>NX-SPEC-1020</cProd>
          <cEAN>7898568290123</cEAN>
          <xProd>ANTIPULGAS NEXGARD SPECTRA 7.5 A 15KG DISPLAY C/ 6 COMPRIMIDOS</xProd>
          <NCM>3004.90.99</NCM>
          <uCom>CX</uCom>
          <qCom>5.0000</qCom>
          <vUnCom>285.0000</vUnCom>
          <vProd>1425.00</vProd>
        </prod>
      </det>
      <det nItem="5">
        <prod>
          <cProd>SHAMP-COCO-5L</cProd>
          <cEAN>7898349102834</cEAN>
          <xProd>SHAMPOO PROFISSIONAL PET CARE COCO GALAO 5 LITROS</xProd>
          <NCM>3305.10.00</NCM>
          <uCom>UN</uCom>
          <qCom>3.0000</qCom>
          <vUnCom>68.9000</vUnCom>
          <vProd>206.70</vProd>
        </prod>
      </det>
      <total>
        <ICMSTot>
          <vBC>3669.10</vBC>
          <vICMS>440.29</vICMS>
          <vProd>3669.10</vProd>
          <vFrete>120.00</vFrete>
          <vSeg>0.00</vSeg>
          <vDesc>0.00</vDesc>
          <vNF>3789.10</vNF>
        </ICMSTot>
      </total>
      <cobr>
        <fat>
          <nFat>48201</nFat>
          <vOrig>3789.10</vOrig>
          <vLiq>3789.10</vLiq>
        </fat>
        <dup>
          <nDup>001</nDup>
          <dVenc>2026-09-25</dVenc>
          <vDup>1894.55</vDup>
        </dup>
        <dup>
          <nDup>002</nDup>
          <dVenc>2026-10-25</dVenc>
          <vDup>1894.55</vDup>
        </dup>
      </cobr>
    </infNFe>
  </NFe>
</nfeProc>`;

export const MOCK_PDF_ORDER_TEXT = `ROMANEIO DE ENTREGA & PEDIDO DE COMPRA
FORNECEDOR: AGROSUL NUTRIÇÃO ANIMAL & RAÇÕES LTDA
CNPJ: 14.891.029/0001-72 | TEL: (19) 3844-9000
DESTINATÁRIO: GLOBAL PET & AGROPECUÁRIA (CNPJ 45.981.230/0001-84)
PEDIDO Nº: PED-2026/894 | DATA: 04/09/2026
CONDIÇÃO: BOLETO BANCÁRIO 30 DIAS

ITENS DO PEDIDO:
Item | Código | EAN          | Descrição do Produto                             | Qtd | Un | Custo Unit | Total R$
01   | FEN-AL | 789901823901 | FENO TIFTON ESPECIAL FARDOS 12KG                | 15  | FD | R$ 38,50   | R$ 577,50
02   | MIL-50 | 789891283002 | MILHO MOÍDO QUIRERA GROSSA SC 50KG               | 8   | SC | R$ 62,00   | R$ 496,00
03   | RAC-EQ | 789781290384 | RAÇÃO EQUINOS HIPISMO ALTA ENERGIA SC 25KG      | 10  | SC | R$ 89,90   | R$ 899,00
04   | SAL-BO | 789872910394 | SAL MINERAL BOVINOS 80 FOSFATO SC 25KG          | 6   | SC | R$ 74,00   | R$ 444,00
05   | GL-PRE | 789849201948 | PREMIER AMBIENTES INTERNOS CÃES ADULTOS 15KG     | 5   | SC | R$ 195,00  | R$ 975,00
06   | PET-BX | 789920194820 | PETISCO DENTAL BONE DISPLAY C/ 24 UNIDADES       | 4   | CX | R$ 48,00   | R$ 192,00

TOTAL DOS PRODUTOS: R$ 3.583,50
FRETE CIF: R$ 0,00 (ENTREGA PRÓPRIA AGROSUL)
TOTAL FATURADO: R$ 3.583,50
VENCIMENTO DO BOLETO: 04/10/2026 (R$ 3.583,50)`;

export const MOCK_LEGACY_CSV = `codigo_barra;nome_produto;preco_custo;preco_venda;estoque_atual;estoque_minimo;categoria;unidade
7896181210452;Ração Royal Canin Maxi Adult 15kg;248.50;349.90;8;3;fechados;SC
7897348201948;Ração Golden Special Frango 15kg;115.90;169.90;14;5;fechados;SC
7896014283912;Sachê Whiskas Carne 85g;2.40;3.89;60;20;fechados;UN
7898568290123;Nexgard Spectra 7.5 a 15kg;47.50;79.90;12;4;farmacia;UN
7898349102834;Shampoo Pet Care Neutro 5L;68.90;119.00;4;2;petcare;UN
7899018239014;Feno Tifton Especial Kg;3.20;6.50;180;50;granel;kg
7898912830021;Milho Quirera a Granel Kg;1.24;2.49;350;100;granel;kg
7898492019489;Ração Premier Raças Pequenas 15kg;195.00;279.00;6;2;fechados;SC
7898729103948;Vermífugo Drontal Plus Cães 10kg;34.00;58.00;18;6;farmacia;UN
7899201948203;Coleira Antipulgas Seresto P;145.00;229.00;8;3;farmacia;UN
7898129038472;Ração Pro Plan Cães Adultos 15kg;280.00;399.00;5;2;fechados;SC
7899482910384;Guia Retrátil para Cães 5m;28.50;59.90;10;3;petcare;UN
7898920194821;Brinquedo Mordedor Osso Nylon G;18.20;39.90;15;5;petcare;UN
7898749201948;Areia Higiênica Pipicat 4kg;11.50;19.90;30;10;fechados;PCT
7899182903847;Biscoito Premier Cookie Cães 250g;8.90;15.90;24;8;fechados;PCT
7898392019482;Arranhador Torre com Casinha Gatos;89.00;169.00;4;2;petcare;UN
7899401928472;Suplemento Vitamínico Glicopan Pet 125ml;32.50;54.90;9;3;farmacia;UN
7898201948291;Ração Granel Cães Adultos Premium Kg;8.50;14.90;120;40;granel;kg`;

export const MOCK_SEFAZ_INVOICES: SefazIncomingInvoice[] = [
  {
    id: 'sef-01',
    chaveAcesso: '35260908329110000145550010000482011894210984',
    numero: '48201',
    serie: '1',
    emitenteNome: 'DISTRIBUIDORA PET BRASIL LTDA',
    emitenteCnpj: '08.329.110/0001-45',
    dataEmissao: '2026-09-05',
    valor: 3789.10,
    itensCount: 5,
    statusManifestacao: 'ciencia',
    statusEntrada: 'pendente',
    xmlPreload: MOCK_NFE_XML
  },
  {
    id: 'sef-02',
    chaveAcesso: '35260946281092000199550020000192841928491820',
    numero: '19284',
    serie: '2',
    emitenteNome: 'PREMIER PET NUTRIÇÃO ANIMAL S/A',
    emitenteCnpj: '46.281.092/0001-99',
    dataEmissao: '2026-09-04',
    valor: 6420.00,
    itensCount: 8,
    statusManifestacao: 'confirmada',
    statusEntrada: 'pendente'
  },
  {
    id: 'sef-03',
    chaveAcesso: '35260902849102000188550010000392811029384918',
    numero: '39281',
    serie: '1',
    emitenteNome: 'ZOETIS INDÚSTRIA VETERINÁRIA LTDA',
    emitenteCnpj: '02.849.102/0001-88',
    dataEmissao: '2026-09-03',
    valor: 2150.80,
    itensCount: 4,
    statusManifestacao: 'sem_manifestacao',
    statusEntrada: 'pendente'
  },
  {
    id: 'sef-04',
    chaveAcesso: '35260914891029000172550010000089421928491029',
    numero: '08942',
    serie: '1',
    emitenteNome: 'AGROSUL NUTRIÇÃO & FENOS LTDA',
    emitenteCnpj: '14.891.029/0001-72',
    dataEmissao: '2026-08-28',
    valor: 3583.50,
    itensCount: 6,
    statusManifestacao: 'confirmada',
    statusEntrada: 'importada'
  }
];
