const bcrypt = require('bcryptjs');

const password = 'william'; // The password you're testing
const storedHash = '$2a$12$.eBv2BLXbuFVao.jsNxf3urJC70SH6tzSEnBWbpTACgcV1AQfRcuS'; // The stored hash

// Hash a new password with 12 rounds
bcrypt.hash(password, 12, function(err, hash) {
    console.log('New hash:', hash);
    // Compare the new hash with the stored hash
    bcrypt.compare(password, storedHash, function(err, result) {
        console.log('Comparison with stored hash:', result);
    });
});
