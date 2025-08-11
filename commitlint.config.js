module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0, 'always', 200], // Aumenta el límite a 200 caracteres o establece 0 para deshabilitar
    'body-max-line-length': [0, 'always'], // Deshabilita el límite de longitud en el cuerpo del mensaje
    'footer-max-line-length': [0, 'always'], // Deshabilita el límite de longitud en el pie del mensaje
  }
};