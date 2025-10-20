const mysql = require('mysql2/promise');

async function checkUsers() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Efrain24TR',
      database: 'secondbite_db'
    });

    console.log('✅ Conectado a la base de datos\n');

    const [users] = await connection.execute(
      'SELECT id, email, user_type, full_name, created_at FROM users ORDER BY id'
    );

    console.log('👥 USUARIOS EN LA BASE DE DATOS:');
    console.log('================================\n');
    
    users.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Tipo: ${user.user_type}`);
      console.log(`Nombre: ${user.full_name}`);
      console.log(`Creado: ${user.created_at}`);
      console.log('---');
    });

    console.log(`\nTotal de usuarios: ${users.length}`);

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUsers();
