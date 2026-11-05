# ჯადოსნური ბუმბული — Books-Hub

ზღაპრების, წიგნების (PDF) და ლექსების მაღაზია: საიტი + ადმინ პანელი.

- `backend/` — Express API (კატეგორიები ხისებრად, პროდუქტები, ბანერები, ადმინის ავტორიზაცია, ფაილების ატვირთვა)
- `frontend/` — React (Vite): საიტი `/` და ადმინ პანელი `/admin`

## გაშვება ლოკალურად

```bash
cd backend && npm install && cp .env.example .env   # ჩაწერე ADMIN_PASSWORD და JWT_SECRET
npm run dev                                          # http://localhost:4100
```

```bash
cd frontend && npm install
npm run dev -- --port 5180                           # http://localhost:5180, ადმინი: /admin
```

Supabase-ის გასაღებების გარეშე backend მონაცემებს ინახავს `backend/data/`-ში (JSON + ფაილები) და პირველ გაშვებაზე ამჟამინდელი საიტის კონტენტით ივსება.

## Supabase (უფასო ბაზა და ფაილების საცავი)

უფასო გეგმა: 500 MB ბაზა, 1 GB ფაილები, ერთი ფაილი მაქს. 50 MB.

1. შექმენი პროექტი supabase.com-ზე.
2. SQL Editor-ში გაუშვი `backend/supabase/schema.sql` — შექმნის ცხრილებს და ორ bucket-ს: `images` (საჯარო) და `pdfs` (დახურული).
3. Project Settings → API-დან `backend/.env`-ში ჩაწერე `SUPABASE_URL` და `SUPABASE_SERVICE_ROLE_KEY`.

service-role გასაღები მხოლოდ backend-ში ინახება, ბრაუზერამდე არ მიდის.

## PDF-ების წესები

- **უფასო** პროდუქტის PDF ყველას შეუძლია ჩამოტვირთოს პროდუქტის გვერდიდან.
- **ფასიანი** PDF საჯაროდ არ ჩანს: მყიდველი WhatsApp-ით ყიდულობს, ადმინს კი შეუძლია პანელიდან გადმოწეროს და გაუგზავნოს.

## Production

- Frontend: `VITE_API_URL` = backend-ის მისამართი (მაგ. Netlify-ზე), `VITE_WHATSAPP` = ნომერი.
- Backend: `CORS_ORIGIN` = frontend-ის მისამართი.
