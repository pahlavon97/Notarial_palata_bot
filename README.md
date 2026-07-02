# O‘zbekiston Notarial Palatasi Murojaatlar Boti

Ushbu bot fuqarolardan taklif va shikoyatlarni qabul qilish uchun mo'ljallangan.

## Xususiyatlari
- Ikki tilda (O'zbek va Rus) ishlash
- SQLite ma'lumotlar bazasi
- Excelga eksport qilish
- Ko'p adminli tizim
- Admin tomonidan javob qaytarish imkoniyati
- Spamdan himoya (10 daqiqada 1 ta murojaat)

## O'rnatish

1. `.env.example` faylini `.env` ga o'zgartiring va o'z ma'lumotlaringizni kiriting.
2. Kutubxonalarni o'rnating:
   ```bash
   pip install -r requirements.txt
   ```
3. Botni ishga tushiring:
   ```bash
   python main.py
   ```

## Render-ga joylash
- Build Command: `pip install -r requirements.txt`
- Start Command: `python main.py`
- Environment Variables: `.env` faylidagi barcha o'zgaruvchilarni Render Dashboard-da qo'shing.
