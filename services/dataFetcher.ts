
import { BannerAd, ClassifiedAd } from "../types";

/**
 * Mapeia os dados brutos do Bubble.io (Classificados)
 */
function mapBubbleToClassified(item: any, tableName: string = "Classificado"): ClassifiedAd {
  // Para serviços, usa foto_anunciante; para outros, usa foto1
  let foto = "";
  if (tableName.toLowerCase() === 'servicos') {
    foto = item.foto_anunciante || item.fotoAnunciante || item.foto1 || item.foto || "";
  } else {
    foto = item.foto1 || item.foto || item.imagem || item.image || item.fotoPrincipal || "";
  }

  const imageUrl = foto.startsWith && foto.startsWith('//')
    ? `https:${foto}`
    : foto;

  // Para serviços, usa 'profissao' ao invés de 'titulo'
  let title = item.titulo || item.title || item.nome || "Sem título";
  if (tableName.toLowerCase() === 'servicos') {
    title = item.profissao || item.titulo || item.title || "Serviço";
  }

  // Monta a localização com bairro e cidade
  const bairro = item.bairro || "";
  const cidade = item.cidade || "";
  let location = "Lagoa da Prata";

  if (bairro && cidade) {
    location = `${bairro}, ${cidade}`;
  } else if (bairro) {
    location = `${bairro}, Lagoa da Prata`;
  } else if (cidade) {
    location = cidade;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    title: title,
    price: item.preco || item.price || item.valor || "Consulte",
    category: tableName.charAt(0).toUpperCase() + tableName.slice(1),
    imageUrl: imageUrl,
    location: location
  };
}

/**
 * Mapeia os dados brutos do Bubble.io (Banners de Empresas)
 */
function mapBubbleToBanner(item: any): BannerAd {
  const imageUrl = item.imagens.startsWith('//')
    ? `https:${item.imagens}`
    : item.imagens;

  return {
    id: Math.random().toString(36).substr(2, 9),
    imageUrl: imageUrl,
    companyName: item.nomeEmpresa || "Empresa Parceira",
    description: item.descricao || "Confira nossas ofertas e serviços."
  };
}

export async function fetchPortalData(): Promise<{ banners: BannerAd[], classifieds: ClassifiedAd[] }> {
  const API_TOKEN = import.meta.env.VITE_BUBBLE_API_TOKEN;
  const BASE_URL = "https://standlocal.com.br/api/1.1/obj";

  // Dados estáticos como fallback
  const fallbackBanners = [
    {
      "descricao": "A vitrine ideal para seus negócios locais",
      "imagens": "//937d83ef6a30f733d527bec70e12f4a3.cdn.bubble.io/f1759531481013x167734514971100480/bannertop.png",
      "nomeEmpresa": "Stand Local"
    },
    {
      "descricao": "Pensou em qualidade de serviços, pensou Solutions GTI.",
      "imagens": "//937d83ef6a30f733d527bec70e12f4a3.cdn.bubble.io/f1761951441631x343702221993910100/solutions.png",
      "nomeEmpresa": "Solutions GTI"
    }
  ];

  const fallbackClassifieds = [
    { "bairro": "Lundcea II", "foto1": "//937d83ef6a30f733d527bec70e12f4a3.cdn.bubble.io/f1759072381694x842237584353458000/1000359041.jpg", "plano": "Ouro", "preco": "R$ 20,00", "status_pagamento": "approved", "titulo": "Sapato bebê " },
    { "bairro": "Lundcea II", "foto1": "//937d83ef6a30f733d527bec70e12f4a3.cdn.bubble.io/f1759668902986x651263930924663700/1000362788.jpg", "plano": "Ouro", "preco": "R$ 120,00", "status_pagamento": "approved", "titulo": "Cafeteira Oster " },
    { "bairro": "Vila Jardim Presidente", "foto1": "//937d83ef6a30f733d527bec70e12f4a3.cdn.bubble.io/f1759695056106x424679795022306700/image.jpg", "plano": "Ouro", "preco": "R$ 150,00", "status_pagamento": "approved", "titulo": "Móveis seminovos" },
    { "bairro": "Lundcea II", "foto1": "//937d83ef6a30f733d527bec70e12f4a3.cdn.bubble.io/f1759829069613x442549193307764100/5bacb871-82a9-48ce-9ee7-8a70c66cf234.jpeg", "plano": "Ouro", "preco": "R$ 150,00", "status_pagamento": "approved", "titulo": "Vestido Festa" },
    { "bairro": "Centro", "foto1": "//937d83ef6a30f733d527bec70e12f4a3.cdn.bubble.io/f1760088911890x789285607283854100/IMG_3425.jpeg", "plano": "Ouro", "preco": "R$ 90.000,00", "status_pagamento": "approved", "titulo": "Terreno Rural a Venda" },
    { "bairro": "Lundcea", "foto1": "//937d83ef6a30f733d527bec70e12f4a3.cdn.bubble.io/f1761169936341x708867888415630100/1000407202.webp", "plano": "Ouro", "preco": "R$ 200,00", "status_pagamento": "approved", "titulo": "Fritadeira AirFryer Digital" },
    { "bairro": "Jardim Imperial", "foto1": "//937d83ef6a30f733d527bec70e12f4a3.cdn.bubble.io/f1761588890576x443628404494722300/65183068-5EB2-4C2E-B89E-2203B842059C.jpeg", "plano": "Ouro", "preco": "R$ 16.000,00", "status_pagamento": "approved", "titulo": "Corsa Sedan Prata" },
    { "bairro": "Nossa Senhora de Fátima", "foto1": "//937d83ef6a30f733d527bec70e12f4a3.cdn.bubble.io/f1765544773505x686472218197132800/WhatsApp%20Image%202025-12-10%20at%2020.33.31.jpeg", "plano": "Ouro", "preco": "R$ 7.000,00", "status_pagamento": "approved", "titulo": "Bike Scott Scale 970" },
    { "bairro": "Moradas da Lapinha", "foto1": "//937d83ef6a30f733d527bec70e12f4a3.cdn.bubble.io/f1766095158366x587449078638345500/1001115105.jpg", "plano": "Bronze", "preco": "R$ 12.300,00", "status_pagamento": "approved", "titulo": "Moto PCX 2016" }
  ];

  try {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    };

    // Buscar banners da tabela 'bannertop'
    let banners: BannerAd[] = [];
    try {
      const response = await fetch(`${BASE_URL}/bannertop`, { headers });
      if (response.ok) {
        const data = await response.json();
        if (data.response?.results && data.response.results.length > 0) {
          banners = data.response.results.map(mapBubbleToBanner);
          console.log(`✅ ${banners.length} banners carregados da tabela: bannertop`);
        }
      }
    } catch (err) {
      console.log('❌ Erro ao buscar tabela bannertop, usando fallback');
      banners = fallbackBanners.map(mapBubbleToBanner);
    }

    // Se não encontrou banners, usa fallback
    if (banners.length === 0) {
      banners = fallbackBanners.map(mapBubbleToBanner);
    }

    // Buscar classificados de múltiplas tabelas NA ORDEM CORRETA
    const classifiedTables = ['Venda', 'servicos', 'locacao', 'doacao'];
    let allClassifieds: ClassifiedAd[] = [];

    for (const tableName of classifiedTables) {
      try {
        console.log(`🔍 Tentando buscar tabela: ${tableName}...`);
        const response = await fetch(`${BASE_URL}/${tableName}`, { headers });

        console.log(`📡 Status da resposta para ${tableName}: ${response.status}`);

        if (response.ok) {
          const data = await response.json();
          console.log(`📦 Dados recebidos de ${tableName}:`, data);

          // Verifica se tem results
          const results = data.response?.results || data.results || [];

          if (results.length > 0) {
            console.log(`📋 Estrutura do primeiro item:`, results[0]);

            // Data atual para comparação
            const now = new Date();

            // Filtra e mapeia com critérios específicos
            const tableClassifieds = results
              .filter((item: any) => {
                // Verifica data de expiração
                const dataExpiracao = item.dataExpiracao || item.data_expiracao || item.expiracao;
                let isNotExpired = true;

                if (dataExpiracao) {
                  const expirationDate = new Date(dataExpiracao);
                  isNotExpired = expirationDate > now;
                }

                // Critérios diferentes para doação
                if (tableName.toLowerCase() === 'doacao') {
                  // Doação: apenas verifica se não expirou
                  console.log(`  [Doação] "${item.titulo || item.title || item.nome}" - Válido: ${isNotExpired} (expira: ${dataExpiracao || 'N/A'})`);
                  return isNotExpired;
                } else {
                  // Venda, Serviços, Locação: deve ser Ouro E não expirado
                  const plano = item.plano || item.plan || "";
                  const isOuro = plano.toLowerCase() === "ouro";
                  const shouldInclude = isOuro && isNotExpired;

                  console.log(`  [${tableName}] "${item.titulo || item.title || item.nome || item.profissao}" - Incluir: ${shouldInclude} (plano: ${plano}, expira: ${dataExpiracao || 'N/A'})`);
                  return shouldInclude;
                }
              })
              .map((item: any) => mapBubbleToClassified(item, tableName));

            allClassifieds = allClassifieds.concat(tableClassifieds);
            console.log(`✅ ${tableClassifieds.length} classificados carregados da tabela: ${tableName}`);
          } else {
            console.log(`⚠️ Tabela ${tableName} retornou vazia ou sem results`);
          }
        } else {
          console.log(`❌ Erro HTTP ${response.status} ao buscar tabela ${tableName}`);
        }
      } catch (err) {
        console.error(`❌ Erro ao buscar tabela ${tableName}:`, err);
      }
    }

    console.log(`📊 Total de classificados carregados: ${allClassifieds.length}`);

    // Se não encontrou classificados, usa fallback
    if (allClassifieds.length === 0) {
      console.log('⚠️ Nenhum classificado encontrado na API, usando fallback');
      allClassifieds = fallbackClassifieds
        .filter(item => item.status_pagamento === "approved")
        .map(item => mapBubbleToClassified(item, "Vendas"));
    }

    return { banners, classifieds: allClassifieds };

  } catch (error) {
    console.error("⚠️ Erro ao carregar dados da API, usando fallback", error);

    // Usa dados estáticos como fallback
    const classifieds = fallbackClassifieds
      .filter(item => item.status_pagamento === "approved")
      .map(item => mapBubbleToClassified(item, "Classificado"));

    const banners = fallbackBanners.map(mapBubbleToBanner);

    return { banners, classifieds };
  }
}
