const mysql = require('mysql2/promise');

async function tryPasswords() {
  const passwords = ['Efrain24TR'];
  
  for (const pwd of passwords) {
    try {
      console.log(`🔐 Intentando con password: "${pwd || '(vacía)'}"`);
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: pwd,
        database: 'secondbite_db'
      });

      console.log('✅ Conexión exitosa!');
      console.log('📝 Actualizando tabla orders...');
      
      await connection.execute(
        "ALTER TABLE orders MODIFY COLUMN payment_method ENUM('cash', 'card', 'transfer', 'store') DEFAULT 'store'"
      );

      console.log('✅ payment_method actualizado correctamente');
      console.log('   Ahora acepta: cash, card, transfer, store');
      
      await connection.end();
      return true;
    } catch (error) {
      if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        continue; // Intentar siguiente contraseña
      } else {
        console.error('❌ Error:', error.message);
        throw error;
      }
    }
  }
  
  console.error('❌ No se pudo conectar con ninguna contraseña común');
  console.log('Por favor ejecuta manualmente en MySQL:');
  console.log("ALTER TABLE orders MODIFY COLUMN payment_method ENUM('cash', 'card', 'transfer', 'store') DEFAULT 'store';");
}

tryPasswords();
