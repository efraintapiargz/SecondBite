/*
 Seed demo products for existing merchants.
 - If there are already products, it will skip to avoid duplicates.
 - If there are no merchants, it will abort with a helpful message.
*/

require('dotenv').config();
const { pool } = require('../src/config/database');

async function main() {
  const conn = await pool.getConnection();
  try {
    console.log('🔄 Iniciando seed de productos de ejemplo...');

    const [[{ total_products }]] = await conn.query('SELECT COUNT(*) AS total_products FROM products');
    if (total_products > 0) {
      console.log(`ℹ️  Ya existen ${total_products} productos en la base de datos. Omitiendo seed para evitar duplicados.`);
      return;
    }

    const [merchants] = await conn.query('SELECT id, business_name FROM merchants ORDER BY id LIMIT 2');
    if (merchants.length === 0) {
      console.log('❌ No hay comerciantes (merchants) en la base de datos. Crea al menos uno antes de ejecutar el seed.');
      return;
    }

    const today = new Date();
    function addDays(d) { const dt = new Date(today); dt.setDate(dt.getDate() + d); return dt; }

    const demoProductsByMerchant = (merchant_id, idx = 0) => [
      {
        merchant_id,
        name: idx === 0 ? 'Paquete anti-desperdicio' : 'Sorpresa del día',
        description: 'Selección de excedentes frescos a precio especial',
        category: idx === 0 ? 'prepared_food' : 'bakery',
        original_price: idx === 0 ? 120.00 : 60.00,
        discounted_price: idx === 0 ? 70.00 : 35.00,
        quantity_available: idx === 0 ? 5 : 10,
        expiry_date: addDays(1)
      },
      {
        merchant_id,
        name: 'Combo ahorro',
        description: 'Productos cercanos a fecha de consumo con gran descuento',
        category: 'other',
        original_price: 90.00,
        discounted_price: 50.00,
        quantity_available: 6,
        expiry_date: addDays(2)
      },
      {
        merchant_id,
        name: 'Pan del día anterior',
        description: 'Panadería fresca con descuento por excedente',
        category: 'bakery',
        original_price: 25.00,
        discounted_price: 12.00,
        quantity_available: 20,
        expiry_date: addDays(1)
      }
    ];

    const insertSql = `
      INSERT INTO products (
        merchant_id, name, description, category, original_price,
        discounted_price, discount_percentage, quantity_available, expiry_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')
    `;

    let totalInserted = 0;
    for (let i = 0; i < merchants.length; i++) {
      const m = merchants[i];
      const products = demoProductsByMerchant(m.id, i);
      for (const p of products) {
        const discount_percentage = Math.round(((p.original_price - p.discounted_price) / p.original_price) * 100);
        await conn.execute(insertSql, [
          p.merchant_id,
          p.name,
          p.description,
          p.category,
          p.original_price,
          p.discounted_price,
          discount_percentage,
          p.quantity_available,
          p.expiry_date.toISOString().slice(0, 10) // YYYY-MM-DD
        ]);
        totalInserted++;
      }
    }

    console.log(`✅ Seed completado. Productos insertados: ${totalInserted}`);
  } catch (err) {
    console.error('❌ Error durante el seed:', err.message);
    process.exitCode = 1;
  } finally {
    conn.release();
  }
}

main().then(() => process.exit());
