/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - ARACÁ INTERIORES
 * Webhook unificado para ambas as calculadoras:
 *  1) Calculadora de Custo de Projeto & Reforma (/calculadora-custo-projeto-design-interiores & /calculadora-projeto)
 *  2) Calculadora de Custo de Obra / Reforma (/quanto-custa-reformar)
 * ==============================================================================
 *
 * INSTRUÇÕES PASSO A PASSO PARA CONFIGURAR:
 *
 * 1. Abra o Google Drive e crie uma Planilha nova (ex: "Leads Aracá Interiores - Calculadoras").
 * 2. No menu superior da planilha, clique em: Extensões > Apps Script.
 * 3. Apague qualquer código existente no editor (Code.gs) e cole TODO o código abaixo.
 * 4. Clique no ícone de "Salvar" (disquete) ou pressione Ctrl + S.
 * 5. No canto superior direito, clique no botão azul "Implantar" (Deploy) > "Nova implantação".
 * 6. Na engrenagem ao lado de "Selecionar tipo", escolha "App da Web" (Web app).
 * 7. Preencha as configurações rigorosamente assim:
 *    - Descrição: Webhook Calculadoras Aracá
 *    - Executar como: "Eu" (seu e-mail Google)
 *    - Quem pode acessar: "Qualquer pessoa" (Anyone) -> [MUITO IMPORTANTE para funcionar!]
 * 8. Clique em "Implantar". Se o Google solicitar permissões da sua conta, clique em "Avançado" e "Acessar (não seguro)".
 * 9. Copie o "URL do app da Web" (o link termina com /exec).
 * 10. Cole esse link no seu arquivo .env.local:
 *     GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID_AQUI/exec
 *     NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID_AQUI/exec
 *
 * Pronto! As duas abas ("Leads_Projeto" e "Leads_Obra") serão criadas automaticamente
 * na sua planilha assim que o primeiro lead for preenchido em qualquer uma das calculadoras.
 */

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: "online",
      message: "Webhook das Calculadoras Aracá Interiores ativo e funcionando!",
      timestamp: new Date().toISOString()
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: "error", message: "Nenhum dado recebido no payload POST." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Roteador de leads pelo tipo/origem da calculadora
    var isObra = data.tipo === "calculadora_obra" || 
                 (data.origem && data.origem.toLowerCase().indexOf("obra") !== -1);

    if (isObra) {
      salvarLeadObra(ss, data);
    } else {
      salvarLeadProjeto(ss, data);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ 
        status: "success", 
        tipo: isObra ? "obra" : "projeto",
        message: "Lead gravado com sucesso na planilha!" 
      })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ------------------------------------------------------------------------------
// 1. ABA DE LEADS: CALCULADORA DE OBRA / REFORMA
// ------------------------------------------------------------------------------
function salvarLeadObra(ss, data) {
  var sheetName = "Leads_Obra";
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = [
      "Data/Hora",
      "Nome",
      "Telefone/WhatsApp",
      "E-mail",
      "Origem",
      "Área (m²)",
      "Padrão Escolhido",
      "Custo Médio Estimado",
      "Faixa Mín - Máx",
      "Serviços Ativos"
    ];
    sheet.appendRow(headers);
    formatarCabecalho(sheet, headers.length);
  }

  var row = [
    data.dataHora || new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    data.nome || "",
    data.telefone || "",
    data.email || "",
    data.origem || "Calculadora de Obra",
    data.area || (data.detalhes && data.detalhes.totalArea ? data.detalhes.totalArea + " m²" : ""),
    data.padrao || "",
    data.custoMedio || "",
    data.faixaEstimada || "",
    data.servicos || ""
  ];

  sheet.appendRow(row);
}

// ------------------------------------------------------------------------------
// 2. ABA DE LEADS: CALCULADORA DE PROJETO & REFORMA
// ------------------------------------------------------------------------------
function salvarLeadProjeto(ss, data) {
  var sheetName = "Leads_Projeto";
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = [
      "Data/Hora",
      "Nome",
      "WhatsApp",
      "E-mail",
      "Endereço / Região",
      "Tipo Imóvel",
      "Status Imóvel",
      "Metragem (m²)",
      "Padrão Acabamento",
      "Precisa de RRT?",
      "Demolição de Paredes",
      "Moradores",
      "Pets",
      "Ambientes Selecionados",
      "Intervenções / Serviços",
      "Estilo Visual",
      "Projeto Mín (R$)",
      "Projeto Máx (R$)",
      "Obra Mín (R$)",
      "Obra Máx (R$)",
      "Total Mín (R$)",
      "Total Máx (R$)"
    ];
    sheet.appendRow(headers);
    formatarCabecalho(sheet, headers.length);
  }

  // Formatador de lista de ambientes
  var ambientesTexto = "";
  if (data.ambientes && typeof data.ambientes === "object") {
    var parts = [];
    for (var key in data.ambientes) {
      if (data.ambientes.hasOwnProperty(key)) {
        parts.push(key + " (" + data.ambientes[key] + ")");
      }
    }
    ambientesTexto = parts.join(", ");
  }

  // Formatador de serviços
  var servicosTexto = Array.isArray(data.servicos) ? data.servicos.join(", ") : (data.servicos || "");

  var row = [
    data.dataHora || new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    data.nome || "",
    data.whatsapp || "",
    data.email || "",
    data.endereco || "Não informado",
    data.tipoImovel || "Não informado",
    data.statusImovel || "",
    data.metragem || "",
    data.padrao || "",
    data.rrt || "Não informado",
    data.demolicao || "",
    data.moradores || "Não informado",
    data.pets || "Não informado",
    ambientesTexto,
    servicosTexto,
    data.estilo || "",
    data.estimativaProjetoMin || "",
    data.estimativaProjetoMax || "",
    data.estimativaObraMin || "",
    data.estimativaObraMax || "",
    data.totalMin || "",
    data.totalMax || ""
  ];

  sheet.appendRow(row);
}

// ------------------------------------------------------------------------------
// Formatação visual da primeira linha da planilha
// ------------------------------------------------------------------------------
function formatarCabecalho(sheet, numCols) {
  var headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange.setBackground("#1F3D32"); // Mineral Green Aracá
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  for (var i = 1; i <= numCols; i++) {
    sheet.autoResizeColumn(i);
  }
}
