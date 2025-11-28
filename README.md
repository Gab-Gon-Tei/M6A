# 📊 M6A Analytics Framework

> **Modelo de Análise Estatística Esportiva de 6 Atributos**

O **M6A** é um framework analítico agnóstico ao esporte projetado para quantificar a qualidade e o desempenho de atletas e equipes. Nosso objetivo é eliminar o viés subjetivo ("olhômetro") e substituí-lo por uma pontuação de **0 a 100** fundamentada em evidências estatísticas avançadas.

-----

## 🎯 Objetivo

Transformar dados brutos em *insights* acionáveis para:

  * **Comparação Direta:** Avaliar jogadores de diferentes perfis na mesma régua.
  * **Scouting & Diagnóstico:** Identificar lacunas em elencos para contratações cirúrgicas.
  * **Previsão Probabilística:** Projetar resultados de partidas com base em *matchups* de atributos.

-----

## 🧩 Metodologia: O Hexágono de Atributos

O *Core* do modelo avalia seis pilares fundamentais. A nota final (Overall) é derivada destes seis vetores:

### 🛡️ 1. Defesa

Mede a eficácia em impedir o avanço e pontuação adversária.

  * **Futebol:** Desarmes, Interceptações, Duelos Aéreos, PSxG +/-.
  * **Basquete:** Defensive Rating, Roubos, Tocos, Defesa de Perímetro.

### ⚔️ 2. Ataque

Mede a produtividade direta em gerar pontos ou chances de gol.

  * **Métricas:** xG (Gols Esperados), xA, Participação em Gols/90, True Shooting % (TS%).

### ⚡ 3. Condição Física

Mede a disponibilidade, durabilidade e intensidade atlética.

  * **Métricas:** Minutos Jogados, Distância Percorrida, Recuperação de Lesões, Explosão.

### 🧠 4. Mentalidade

Mede a inteligência tática, disciplina e performance sob pressão (*Clutch*).

  * **Métricas:** Erros cruciais, Disciplina (Faltas/Cartões), Performance em Finais, Turnovers decisivos.

### 🎨 5. Técnica

Mede a qualidade de execução dos fundamentos com a bola.

  * **Métricas:** % Passe, Dribles, SCA (Shot-Creating Actions), Mecânica de Arremesso.

### 💎 6. Talento

Mede o teto de potencial (*Future Value*) e o impacto "extra-classe".

  * **Métricas:** Valor de Mercado, Idade vs. Performance, Histórico Base/Seleção.
      * *Nota: Este atributo corrige distorções para jovens promessas com baixo volume de dados.*

-----

## 🛠️ Stack Tecnológico & Dados

A integridade do M6A depende de fontes primárias de elite processadas por LLM.

| Tipo | Fonte | Finalidade |
| :--- | :--- | :--- |
| **Primária** | **FBref.com** | Estatísticas avançadas de Futebol. |
| **Primária** | **Basketball-Reference** | Estatísticas avançadas de NBA/Basquete. |
| **Secundária** | **Transfermarkt** | Valores de mercado e contratos. |
| **Secundária** | **Sofascore/Flashscore** | Status de lesão e escalações em tempo real. |
| **Engine** | **Google Gemini** | Analista de dados e interpretação de proxies estatísticos. |

-----

## 🚧 Limitações Conhecidas

1.  **Latência de Dados (Roster):** Dificuldade com transferências de última hora (ex: atualizações manuais necessárias para jogadores trocados recentemente).
2.  **Média Aritmética Simples:** Atualmente, todos os atributos têm peso igual. Um goleiro não deveria ter "Ataque" com o mesmo peso de "Defesa".
3.  **Fator Imponderável:** A "mística" de camisa pesada ou colapsos emocionais ainda são difíceis de quantificar via dados frios.

-----

## 🚀 Roadmap de Desenvolvimento

### Curto Prazo

  - [ ] **Pesos por Posição:** Implementar fórmulas distintas (ex: Goleiros -\> Defesa vale 50%).
  - [ ] **Check de Roster:** Validação automática de lesionados antes da análise.

### Médio Prazo

  - [ ] **Fator "Big Game":** Multiplicador de atributo para jogos de mata-mata (Mentalidade \> Técnica).
  - [ ] **Visual Generator:** Padronização dos prompts para geração dos Cards visuais dos jogadores.

-----


Documentação Técnica - Versão 1.0 (Beta)
Data de Publicação: 26/11/2025
