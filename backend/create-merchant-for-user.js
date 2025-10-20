const mysql = require('mysql2/promise');

async function createMerchantForUser() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Efrain24TR',
      database: 'secondbite_db'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Obtener el último usuario merchant sin merchant asociado
    const [users] = await connection.execute(
      `SELECT u.id, u.email, u.full_name 
       FROM users u 
       LEFT JOIN merchants m ON u.id = m.user_id 
       WHERE u.user_type = 'merchant' AND m.id IS NULL
       ORDER BY u.id DESC
       LIMIT 1`
    );

    if (users.length === 0) {
      console.log('❌ No hay usuarios merchant sin merchant asociado');
      await connection.end();
      return;
    }

    const user = users[0];
    console.log(`👤 Usuario encontrado: ID ${user.id} - ${user.email}`);

    // Crear merchant para el usuario
    const [result] = await connection.execute(
      `INSERT INTO merchants (user_id, business_name, business_type, description, business_hours)
       VALUES (?, ?, ?, ?, ?)`,
      [
        user.id, // user_id
        user.full_name || 'Mi Comercio', // business_name
        'grocery', // business_type
        'Comercio de prueba para desarrollo', // description
        JSON.stringify({
          monday: "9:00-20:00",
          tuesday: "9:00-20:00",
          wednesday: "9:00-20:00",
          thursday: "9:00-20:00",
          friday: "9:00-21:00",
          saturday: "10:00-21:00",
          sunday: "10:00-18:00"
        })
      ]
    );

    console.log('\n✅ Merchant creado exitosamente!');
    console.log(`Merchant ID: ${result.insertId}`);
    console.log(`User ID: ${user.id} (${user.email})`);
    console.log(`Business Name: ${user.full_name || 'Mi Comercio'}\n`);

    // Verificar
    const [merchants] = await connection.execute(
      `SELECT m.*, u.email, u.full_name 
       FROM merchants m 
       JOIN users u ON m.user_id = u.id 
       WHERE m.user_id = ?`,
      [user.id]
    );

    console.log('📋 Verificación:');
    console.table(merchants);

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createMerchantForUser();
