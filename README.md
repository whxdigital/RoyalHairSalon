# Royal Hair Salon - Barbearia Odivelas 👑✂️

Website oficial e landing page de alta conversão para o **Royal Hair Salon (Barbearia Odivelas)** desenvolvida com o framework **Astro** e **Tailwind CSS**.

📍 **Morada:** Rua Alves Redol 10A, 2675-284 Odivelas, Portugal  
⭐ **Google My Business:** 4.9★ (250+ Avaliações) [Ver Perfil Google](https://share.google/2O3L2FtG55BM0sQ7y)  
📞 **Marcações:** +351 912 345 678 | WhatsApp Direto

---

## 🚀 Funcionalidades & Destaques

1. **Animação Avançada de Corte Interativo (Cutting Animation Canvas & SVG)**:
   - Partículas de fios de cabelo a flutuar no hero e lâminas de tesoura douradas interativas.
   - Botão **"Testar Corte"** que corta os fios no ecrã com efeitos de faíscas douradas.
   - Efeito sonoro sintetizado em tempo real com **Web Audio API** (som realista de tesoura *snip* e máquina sem ficheiros pesados externos).

2. **Slider Interativo Antes / Depois (Transformação Fade)**:
   - Comparador interativo de transformação onde o utilizador arrasta a lâmina para ver a diferença entre cabelo desalinhado e um **Royal Fade** perfeito.

3. **Poste de Barbeiro 3D Rotativo (Barber Pole)**:
   - Cilindro de vidro iluminado com riscas clássicas em espiral contínua (vermelho, branco e azul marinho) e topos cromados em ouro real.

4. **Motor de Agendamento Online em 3 Passos (Com WhatsApp)**:
   - **Passo 1:** Seleção do serviço (Corte Fade, Barboterapia, Combo Royal VIP, etc.).
   - **Passo 2:** Escolha do barbeiro (Marco Silva, David Santos, ou Primeiro Disponível) + Data + Horário.
   - **Passo 3:** Dados de contacto do cliente.
   - **Geração Automática do Link de WhatsApp:** Mensagem pré-formatada em português pronta a enviar para o número do salão com 1 clique!

5. **Local SEO Otimizado para Odivelas & Lisboa**:
   - Meta tags e Open Graph com palavras-chave estratégicas (*barbearia odivelas, corte de cabelo masculino odivelas, skin fade lisboa*).
   - Dados Estruturados Schema.org (`LocalBusiness` / `HairSalon` JSON-LD) com morada, coordenadas GPS, horário e classificação 4.9★.

6. **Tabela de Preços com Filtros de Categoria**:
   - Abas para alternar entre: *Todos*, *Cabelo*, *Barba*, *Combos VIP* e *Tratamentos*.
   - Botão direto "Reservar Este" que abre o agendamento com o serviço pré-selecionado.

7. **Mapa Interativo Google Maps & Contactos**:
   - Embed interativo centrado na Rua Alves Redol 10A, Odivelas.
   - Botões de GPS ("Como Chegar"), chamada telefónica e WhatsApp.

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (v18+)

### 1. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
O servidor estará disponível em: `http://localhost:4321`

### 2. Compilar para Produção (Build)
```bash
npm run build
```
Os ficheiros estáticos ultra-rápidos e otimizados serão gerados na pasta `dist/`.

---

## 📂 Estrutura do Projeto (Astro)

```
w:/Hair salon/
├── public/
│   ├── favicon.svg
│   └── js/
│       ├── app.js               # Lógica interativa do slider, modal e tabs
│       └── scissors-canvas.js   # Motor de animação de corte e sintetizador de som
├── src/
│   ├── components/
│   │   ├── About.astro          # História e ambiente do salão
│   │   ├── BeforeAfterSlider.astro # Slider interativo de fade
│   │   ├── BookingModal.astro   # Modal de agendamento em 3 etapas com WhatsApp
│   │   ├── Faq.astro            # Perguntas frequentes
│   │   ├── Footer.astro         # Rodapé com barra fixa mobile
│   │   ├── Gallery.astro        # Galeria filtrável e lightbox
│   │   ├── Hero.astro           # Hero com animações de corte e SEO local
│   │   ├── LocationContact.astro# Morada, horário e Google Maps
│   │   ├── Navbar.astro         # Barra de navegação e controlo de som
│   │   ├── Reviews.astro        # Avaliações Google 4.9★
│   │   ├── Services.astro       # Grelha de serviços e preços em Euros
│   │   ├── Team.astro           # Apresentação dos barbeiros mestres
│   │   └── WhyChooseUs.astro    # 4 Pilares de excelência
│   ├── layouts/
│   │   └── Layout.astro         # Layout base com Schema.org e SEO
│   ├── pages/
│   │   └── index.astro          # Página principal
│   └── styles/
│       └── global.css           # Estilos personalizados, gradientes e animações
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```
