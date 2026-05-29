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

**Produção (deploy via CLI):** https://proenem-lab-v2.vercel.app

### Deploy contínuo pelo GitHub

1. Envie o código para [ProENEMLab/Projeto_V2](https://github.com/ProENEMLab/Projeto_V2) (veja abaixo).
2. Na Vercel: **Add New Project** → importe `ProENEMLab/Projeto_V2`.
3. **Root Directory:** `Projeto`.
4. Framework: deixe detectar **Flask** (`requirements.txt` / `pyproject.toml`).
5. Deploy.

A Vercel usa `app.py` com a instância `app` e Python 3.12 (`.python-version`).

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
