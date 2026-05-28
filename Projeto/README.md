# ProENEM Lab — Projeto V2

Landing page Flask do ProENEM Lab.

## Executar localmente

```bash
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py
```

Abra `http://127.0.0.1:5000/`.

## Deploy na Vercel

1. Importe o repositório [ProENEMLab/Projeto_V2](https://github.com/ProENEMLab/Projeto_V2).
2. Em **Project Settings → Build and Deployment → Root Directory**, defina: `Projeto`.
3. Framework Preset: **Other** (ou deixe a Vercel detectar Flask via `requirements.txt`).
4. Deploy.

A Vercel usa `app.py` com a instância `app` (Flask) e Python 3.12 (`.python-version`).

### Variáveis de ambiente (opcional)

| Variável     | Valor        | Uso                          |
|-------------|--------------|------------------------------|
| `FLASK_DEBUG` | `0`        | Desativa debug em produção   |

### CLI

```bash
npm i -g vercel@latest
cd Projeto   # ou configure Root Directory = Projeto no dashboard
vercel link
vercel --prod
```
