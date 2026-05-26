## ProENEM Lab

Plataforma de estudos voltada ao ENEM, com foco em exercícios, acompanhamento de desempenho e gamificação.

Este `README.md` documenta **o que existe hoje no projeto** e explica **o que cada arquivo faz** (HTML, CSS, JS e Flask), incluindo explicações linha‑a‑linha (ou por blocos quando a linha faz parte de um conjunto).

---

## Como executar (Flask)

### Pré‑requisitos

- Python 3.10+ (recomendado)
- Pip
- Flask (biblioteca Python)

### Executar a aplicação

No diretório `Projeto/`, rode:

```bash
pip install flask
```

Depois:

```bash
python app.py
```

Depois, acesse no navegador:

- `/` (landing) → `http://127.0.0.1:5000/`
- `/entrar` → `http://127.0.0.1:5000/entrar`
- `/cadastrar` → `http://127.0.0.1:5000/cadastrar`

> Observação: o `app.py` está com `debug=True`, então o servidor reinicia sozinho ao salvar arquivos.

### Observação importante sobre `static/assets/`

Os templates e CSS referenciam arquivos como:

- `static/assets/fonts/Raleway-VariableFont_wght.woff2`
- `static/assets/images/*.webp`

Se esses arquivos não existirem no seu projeto local, a página vai carregar, mas alguns **ícones/fundos/fontes** podem não aparecer (o navegador vai registrar `404` para esses recursos).

---

## Estrutura de pastas (o que cada coisa guarda)

- **`app.py`**: servidor Flask e rotas.
- **`templates/`**: páginas HTML renderizadas pelo Flask (Jinja2).
  - `landing.html`: página inicial (hoje está minimalista).
  - `entrar.html`: página de login (UI + validação no front).
  - `cadastrar.html`: página de cadastro (UI + validação no front + força da senha).
- **`static/`**: arquivos estáticos servidos pelo Flask.
  - **`static/css/`**
    - `presets.css`: variáveis globais (tema), reset e estilos compartilhados (ex.: toggle de tema).
    - `auth.css`: layout + animações + responsividade das telas de autenticação.
    - `landing.css`: reservado para estilos da landing (arquivo está vazio hoje).
  - **`static/js/`**
    - `global.js`: comportamento global (tema: claro/escuro/sistema).
    - `auth.js`: comportamento das telas de autenticação (validação, feedback, mostrar senha, força da senha).
  - **`static/assets/`**: imagens e fontes (referenciadas nos HTML/CSS).

---

## Back‑end (Flask) — `app.py` explicado linha a linha

Arquivo: `Projeto/app.py`

### Importações

- **Linha 1**: `from flask import Flask, render_template, url_for`
  - `Flask`: cria a aplicação web.
  - `render_template`: renderiza HTML da pasta `templates/`.
  - `url_for`: gera URLs (para rotas e arquivos estáticos).  
    - Observação: neste arquivo específico `url_for` não é usado diretamente, mas é usado nos templates.

### Instância do app

- **Linha 3**: `app = Flask(__name__)`
  - Cria o app Flask.
  - `__name__` ajuda o Flask a localizar recursos (templates/static) relativos ao pacote/arquivo.

### Rotas

- **Linhas 7–9**: rota `/`
  - `@app.route('/')`: define o caminho.
  - `def landing():`: função executada quando alguém acessa `/`.
  - `return render_template('landing.html')`: devolve o HTML `templates/landing.html`.

- **Linhas 11–13**: rota `/cadastrar`
  - Renderiza `templates/cadastrar.html`.

- **Linhas 15–17**: rota `/entrar`
  - Renderiza `templates/entrar.html`.

### Execução local

- **Linhas 21–22**:
  - `if __name__ == '__main__':` garante que o servidor só sobe quando o arquivo é executado diretamente.
  - `app.run(debug=True)`: inicia servidor em modo debug (útil em desenvolvimento).

---

## Templates (HTML + Jinja2)

Os arquivos em `templates/` são HTML normal, mas podem conter expressões Jinja2 como `{{ url_for(...) }}`.

### Sobre `url_for(...)` no HTML

Quando você escreve:

- `{{ url_for('entrar') }}` → Flask procura a função Python `entrar()` e gera a URL dela.
- `{{ url_for('static', filename='css/auth.css') }}` → Flask gera a URL do arquivo dentro de `static/`.

Isso evita “hardcode” de caminhos e funciona bem mesmo se você mudar prefixos/host depois.

---

## `templates/landing.html` explicado (linha a linha)

Arquivo: `templates/landing.html`

- **Linhas 1–2**: `<!DOCTYPE html>` e `<html lang="pt-BR">`
  - Define HTML5 e idioma pt‑BR (acessibilidade/SEO).

- **Linhas 3–29 (`<head>`)**: metadados e recursos.
  - **Linhas 4–5**: `charset` e `viewport` (responsividade).
  - **Linha 6**: `description` (SEO).
  - **Linha 7**: `canonical` com `url_for('landing', _external=True)`
    - `_external=True` gera URL absoluta (útil para SEO e compartilhamento).
  - **Linhas 9–16**: Open Graph (preview ao compartilhar em redes).
  - **Linhas 18–21**: Twitter card (preview no Twitter/X).
  - **Linha 23**: favicon.
  - **Linha 25**: preload da fonte (melhora performance).
  - **Linhas 26–27**: CSS global (`presets.css`) e CSS da landing (`landing.css`).
  - **Linha 28**: título da aba.

- **Linhas 30–32 (`<body>`)**
  - **Linha 31**: carrega `static/js/global.js` com `defer`
    - `defer` garante que o JS execute após o HTML ser analisado, sem travar o carregamento.

> Observação: `landing.css` está vazio hoje, então a landing ainda é um “esqueleto” (somente head + JS global).

---

## `templates/entrar.html` explicado (linha a linha / por blocos)

Arquivo: `templates/entrar.html`

### Cabeçalho e SEO (linhas 1–34)

- Mesmo padrão da landing: `charset`, `viewport`, `description`, `canonical`, OpenGraph, Twitter, `favicon`, preloads.
- **Linhas 26–31**: preload de imagens “layer” para temas claro/escuro
  - Usa `media="(prefers-color-scheme: ...)"` para pré‑carregar de acordo com o tema preferido.
- **Linhas 32–33**: inclui `presets.css` (globais/tema) e `auth.css` (layout da página de autenticação).

### Estrutura do formulário (linhas 35–104)

- **Linha 36**: container do formulário `#auth_form_container`
  - Agrupa a UI e facilita posicionamento no CSS.

- **Linhas 37–50**: barra de tema `#style_section_toggle_theme_button`
  - Três botões (claro/escuro/sistema).
  - Cada botão tem:
    - um ícone (`img`) decorativo com `aria-hidden="true"`,
    - um texto oculto para leitores de tela (`.visually_hidden`).
  - IDs desses botões são usados no JS (`global.js`) para aplicar tema.

- **Linhas 51–103**: `<main>` e `<form novalidate id="auth_form_content">`
  - `novalidate` desliga a validação padrão do navegador para usar validação custom (JS em `auth.js`).
  - Campos:
    - **Email** (linhas 57–63):
      - `type="email"`, `autocomplete="email"`, `required`.
      - `span` de erro `#auth_form_content_email_title_error` (JS escreve mensagens aqui).
    - **Senha** (linhas 64–86):
      - Input `type="password"` e botão para mostrar/ocultar senha.
      - O botão tem `aria-pressed` e `aria-label` (acessibilidade).
      - Dois SVGs: um “olho fechado” e um “olho aberto”; o CSS decide qual aparece.
    - Links auxiliares (linhas 82–85): privacidade e “esqueci minha senha” (ainda como `href="#"`).
  - Rodapé:
    - **Botão submit** “Entrar” (linha 89) — o JS anima esse botão conforme erro/sucesso.
    - **Divider** “ou” (linhas 90–94) — apenas visual.
    - **Botão Google** (linhas 95–96) — visual; não há integração com OAuth ainda.
    - Link para cadastro (linhas 97–100) usando `url_for('cadastrar')`.

### Seção visual (linhas 105–114)

- `#auth_style_container` e layers (`layer_1/2/3`) são as ilustrações animadas.
- `#auth_style_section_title` mostra a marca “ProENEM Lab”.

### Scripts (linhas 115–116)

- `global.js` (tema)
- `auth.js` (validação e interação do formulário)
- Ambos com `defer`.

---

## `templates/cadastrar.html` explicado (diferenças principais do “entrar”)

Arquivo: `templates/cadastrar.html`

Ele reaproveita quase toda a estrutura do `entrar.html`, mas tem diferenças:

- **Linha 37**: `<body class="auth_page_register">`
  - Essa classe é usada no `auth.js` e `auth.css` para:
    - habilitar o medidor de força de senha,
    - ajustar layout/espacamentos específicos do cadastro.

- **Linhas 59–65**: campo **Apelido**
  - `minlength="3" maxlength="32"`
  - `title="Letras, números ou sublinhado, entre 3 e 32 caracteres."`
  - `name="username"`
  - O JS valida com regex `USER_OK` e mostra erro em `#auth_form_content_username_title_error`.

- **Linhas 91–96**: bloco de **força da senha**
  - Elementos `#auth_password_strength_label` e `#auth_form_content_password_hint` são atualizados em tempo real pelo JS.

- **Linhas 98–109**: “termos de uso”
  - Checkbox customizado (sem o visual padrão).
  - SVG checkmark aparece quando marcado (controlado por CSS com `:checked + ...`).
  - Erros vão em `#auth_form_content_terms_error`.

- **Rodapé (linhas 111–116)**: botão “Criar conta” e link para “Entrar”.

---

## JavaScript global (tema) — `static/js/global.js` explicado linha a linha

Arquivo: `static/js/global.js`

- **Linha 1**: `THEME_KEY`
  - Chave usada no `localStorage` para persistir a escolha do usuário.

- **Linhas 2–6**: `THEME_TOGGLE_IDS`
  - Lista com IDs dos botões (claro/escuro/sistema) para o JS achar no DOM.

- **Linhas 8–13**: IIFE `applySavedTheme()`
  - Lê o tema salvo.
  - Se for `"light"` ou `"dark"`, aplica em `<html>` via `data-theme`.
  - Se for “system” (ou inexistente), não define `data-theme` e deixa o CSS usar `prefers-color-scheme`.

- **Linhas 15–28**: `syncThemeToggleFromStorage()`
  - Decide qual botão deve ficar “ativo” (com `aria-current="true"`).
  - Remove `aria-current` de todos e adiciona no ativo.

- **Linhas 30–44**: `toggleTheme(theme)`
  - Adiciona a classe `theme_is_switching` (o CSS desliga transições para evitar “flicker”).
  - Se `theme === "system"`:
    - remove `data-theme` e apaga o `localStorage`.
  - Senão:
    - define `data-theme="light|dark"` e salva no `localStorage`.
  - Sincroniza o botão ativo.
  - Usa `requestAnimationFrame` duplo para remover a classe após o browser “aplicar” as mudanças.

- **Linhas 46–53**: `DOMContentLoaded`
  - Garante que os botões existam antes de adicionar listeners.
  - Associa click de cada botão a `toggleTheme(...)`.

---

## JavaScript de autenticação — `static/js/auth.js` explicado linha a linha (por funções)

Arquivo: `static/js/auth.js`

### Constantes e utilitários (linhas 1–45)

- **Linhas 1–5**: regra de senha mínima e função `isPasswordLengthValid`.
  - Converte para string segura (`String(password ?? "")`) e mede o tamanho.

- **Linhas 7–29**: `scorePasswordStrength(password)`
  - Mede “variedade” (minúscula/maiúscula/dígito/especial) e tamanho.
  - Cria um `score` de 0–100.
  - Classifica em `weak`, `medium`, `strong` com thresholds.
  - Retorna `{ score, bucket }`.  
    - Observação: o `score` não é mostrado visualmente hoje; só o “bucket”.

- **Linhas 31–41**: constantes de animação e regex
  - `ANIM_FIELD`: animação CSS usada para mensagens de erro.
  - Classes de animação do botão (`auth_btn_anim_error` / `auth_btn_anim_ok`).
  - `EMAIL_OK`: regex simples para validar email.
  - `USER_OK`: apelido com letras/números `_` e tamanho 3–32.
  - `FIELD_ERROR_CLASS`: classe CSS que pinta o campo como erro.

- **Linhas 42–44**: `isRegisterPage()`
  - Detecta cadastro checando `body.auth_page_register`.

### Mensagens de erro (linhas 46–80)

- **`clearError(el)`**: limpa texto e remove animação.
- **`getFieldContainer(inputEl)`**:
  - Acha o container do input para aplicar a classe de erro.
  - Suporta campos normais e a seção de termos.
- **`clearFieldError(inputEl, errorEl)`**:
  - Limpa a mensagem e remove a classe `auth_field_has_error`.
- **`setFieldError(inputEl, errorEl, message)`**:
  - Escreve a mensagem, aplica animação, marca o container com erro.
  - Adiciona um listener “uma vez” para limpar o erro assim que o usuário editar:
    - `input` para inputs comuns
    - `change` para checkbox

### Animações de botão sem “race condition” (linhas 82–102)

- **`triggerAnimClass(el, className)`**
  - Gera um `token` incremental (`dataset.animToken`) para evitar que animações antigas limpem classes de animações novas.
  - Remove e re‑adiciona a classe forçando reflow (`void el.offsetWidth`) para reiniciar animação.
  - Retorna `Promise` que resolve quando a animação termina/cancela.

### Estado “busy” no botão (linhas 104–109)

- **`setButtonBusy(btn, busy)`**
  - Desabilita o botão e seta atributos ARIA (`aria-disabled`, `aria-busy`).

### Validação no submit (linhas 111–169)

- **`verify_authentication(e)`**
  - `e.preventDefault()` impede envio real (não há backend de autenticação ainda).
  - Busca todos os elementos por ID.
  - Limpa erros anteriores.
  - Calcula:
    - `userOk`: só no cadastro; no login passa automaticamente.
    - `emailOk`: regex de email.
    - `passOk`: tamanho mínimo.
    - `termsOk`: só existe no cadastro (checkbox); se não existir, passa.
  - Se algo estiver errado:
    - anima o botão com erro,
    - escreve mensagens nos campos inválidos.
  - Se estiver tudo ok:
    - trava o botão (busy),
    - anima sucesso,
    - destrava o botão.

> Importante: hoje “ok” não faz request para o servidor; é só validação/UX.

### Mostrar/ocultar senha (linhas 171–192)

- **`initPasswordToggle()`**
  - Alterna `passwordInput.type` entre `"password"` e `"text"`.
  - Atualiza `aria-pressed` e `aria-label`.
  - Adiciona/remove a classe `password-visible` para o CSS decidir qual SVG mostrar.

### Medidor de força da senha (linhas 194–234)

- **`initPasswordStrengthMeter()`**
  - Só roda no cadastro (`isRegisterPage()`).
  - Chama `scorePasswordStrength`.
  - Atualiza:
    - texto do label (“Força: fraca/média/forte”)
    - cor (variável success/error e um amarelo para média)
    - borda do input e cor do label/título
  - Registra listener `input` para atualizar em tempo real.

### Inicialização (linhas 236–240)

- No `DOMContentLoaded`:
  - adiciona `submit` no form,
  - ativa toggle de senha,
  - ativa medidor de força (se for cadastro).

---

## CSS global — `static/css/presets.css` explicado (o essencial)

Arquivo: `static/css/presets.css`

### Fonte e reset (linhas 1–14)

- `@font-face`: registra “Raleway” carregando `.woff2` (preferido) e `.ttf` (fallback).
- `* { box-sizing, margin, padding }`: reset básico para previsibilidade.

### Variáveis de tema (linhas 16–67)

- `:root { --background-color ... }`
  - Centraliza todas as cores e tokens de UI.
  - Inclui também tokens de z-index e tokens de animação do “intro” das telas auth.

### Tema escuro automático e manual (linhas 69–101)

- `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { ... } }`
  - Se o usuário preferir escuro e **não** houver override manual, aplica variáveis “dark”.
- `html[data-theme="dark"] { ... }`
  - Override manual para escuro.

### Acessibilidade (linhas 112–122)

- `.visually_hidden`: texto acessível para leitores de tela sem aparecer visualmente.

### Toggle de tema (linhas 134–235)

- Estiliza `#style_section_toggle_theme_button` e seus botões.
- Usa `aria-current="true"` para indicar botão ativo.
- Em `.theme_is_switching`, desliga transições para evitar “piscadas” durante troca.

### Redução de movimento (linhas 237–244)

- Respeita `prefers-reduced-motion: reduce` desativando animações/transições.

---

## CSS das telas auth — `static/css/auth.css` explicado (por seções)

Arquivo: `static/css/auth.css` (grande; abaixo vai a lógica do arquivo por blocos)

### 1) Animações (começo do arquivo)

- `@keyframes ...` define:
  - entrada de elementos
  - camadas “layer” descendo (efeito de arte)
  - animações de validação (erro e sucesso)
- As classes `.auth_btn_anim_error` e `.auth_btn_anim_ok` são acionadas via JS (`auth.js`).

### 2) Tokens CSS e assets por tema

- `:root` define tokens de layout com `clamp(...)` para responsividade.
- Variáveis `--auth-art-1/2/3` apontam para imagens diferentes conforme tema:
  - `html[data-theme="light"]` e `html[data-theme="dark"]`
  - e também `prefers-color-scheme` quando não há override.

### 3) Layout principal (grid / responsivo)

- `body` vira grid em telas grandes (form de um lado, arte do outro).
- Em telas menores/portrait, esconde `#auth_style_container` e aplica background direto no form.

### 4) Formulário e campos

- `#auth_form_content`: container do form com scroll interno em desktop.
- `.auth_form_content_input_container`: grid para label + input.
- `.auth_form_content_input_title_error`: espaço fixo para mensagem de erro sem “pular layout”.
- `.auth_form_content_input`: bordas, foco e cores (usa variáveis do tema).

### 5) Senha (toggle)

- `.auth_form_content_password_wrap`: posiciona o botão dentro do input.
- `.password-visible` decide qual ícone aparece (olho aberto/fechado).

### 6) Termos (cadastro)

- Checkbox é custom (`appearance: none`) e o “check” é um SVG ao lado.
- `:checked` muda fundo/borda e mostra o SVG.

### 7) Erros visuais

- `.auth_field_has_error` altera borda e cores dos títulos/checkbox.
- O JS adiciona/remove essa classe ao validar.

### 8) Ajustes específicos do cadastro

- `body.auth_page_register ...` ajusta espaçamento, scrollbar e força de senha.
- `--password-strength-color` é setada via JS para “amarrar” o foco/borda à força.

---

## Arquivo vazio (intencional por enquanto)

- `static/css/landing.css` está vazio:
  - Serve como “ponto de extensão” para estilizar a landing page no futuro sem misturar com `presets.css`.

---

## Status do projeto

- **11/04/2026**: início do desenvolvimento.
- **15/04/2026**: parte do front da tela de autenticação finalizada; início da página de políticas/termos.

---

## Roadmap / lista de tarefas

### Produto / validações (“tarefas físicas”)

1. Avaliar uso de APIs de IA para gerar questões personalizadas.
2. Caso a aplicação avance, buscar parcerias com o COTEMIG e escolas.
3. Caso a aplicação avance, desenvolver perfil das escolas fornecedoras de questões.
4. Caso a aplicação avance, desenvolver correção de redação.

### Back-end e banco de dados

- Definir tarefas de back-end e DB.

### Front-end

#### Prioridade máxima

1. Landing page (expandir conteúdo e layout).
2. Página de estatísticas.
3. Página de exercícios:
   - filtro de questões (fácil / média / difícil)
   - gabarito
   - textos e vídeos de apoio
   - observação: questões baseadas em editais e provas anteriores do ENEM
4. Página “ProENEM Map” (roadmap).
5. Gamificação (recompensas).

#### Prioridade média

1. Página de termos de segurança e política de privacidade.
2. Temporizador de estudos (Pomodoro).
3. Sistema de metas/objetivos.
4. Streaks + calendário semanal.
5. Sistema de provas/testes de conhecimento com recompensas.

#### Prioridade baixa

- A definir.

