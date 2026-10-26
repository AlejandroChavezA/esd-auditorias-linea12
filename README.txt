AUDITORÍAS ESD · LÍNEA 12

Qué hace:
- Usa el catálogo real de Linea12.xlsx (53 equipos).
- Permite auditar un ID (por lista, QR o texto).
- Actualiza estado, fecha, auditor, supervisor, ingeniero y coordinador ESD.
- Importa un Excel nuevo para actualizar el catálogo.
- Descarga un Excel más ordenado: hoja Linea 12, Historial y Resumen.

Cómo abrirlo:
1. En la carpeta del prototipo: python3 -m http.server 8080
2. Abre http://localhost:8080
3. Para la cámara del QR hace falta localhost (no abrir el archivo a pelo).

Flujo:
1. Actualizar Excel → elige Linea12.xlsx o una versión más nueva.
2. Auditar equipos (o escanear QR).
3. Descargar Excel → se genera Linea12-auditorias-AAAA-MM-DD.xlsx

Los cambios viven en este navegador hasta que descargues o importes otro archivo.
