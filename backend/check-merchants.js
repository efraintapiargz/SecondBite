const mysql = require('mysql2/promise');

async function checkMerchants() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Efrain24TR',
      database: 'secondbite_db'
    });

    console.log('✅ Conectado a la base de datos\n');

    // Obtener usuarios tipo merchant
    const [users] = await connection.execute(
      `SELECT u.id, u.email, u.user_type, u.full_name, 
              m.id as merchant_id, m.business_name
       FROM users u
       LEFT JOIN merchants m ON u.id = m.user_id
       WHERE u.user_type = 'merchant'
       ORDER BY u.id`
    );

    console.log('🏪 USUARIOS COMERCIANTES Y SUS NEGOCIOS:');
    console.log('==========================================\n');
    
    users.forEach(user => {
      console.log(`User ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Nombre: ${user.full_name}`);
      console.log(`Merchant ID: ${user.merchant_id || '❌ NO TIENE MERCHANT'}`);
      console.log(`Negocio: ${user.business_name || '❌ NO REGISTRADO'}`);
      console.log('---');
    });

    console.log(`\nTotal de comerciantes: ${users.length}`);

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkMerchants();
