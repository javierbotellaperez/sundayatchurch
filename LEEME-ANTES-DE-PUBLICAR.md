# Sunday At Church — El Confesionario (versión en castellano)

Esta carpeta contiene la versión íntegramente en castellano de la experiencia de participación de la Fase 01: El Confesionario.

## Archivos que debes subir a GitHub

- `confessional.html` → raíz del repositorio (o como página independiente `confesionario.html`, ajustando los enlaces).
- `confessional.js` → raíz del repositorio.
- `styles.css` → raíz del repositorio (hoja de estilos compartida; no está traducida porque no contiene textos visibles relevantes).
- `src/index.js` → código del Worker, si quieres que los mensajes de error de la API también aparezcan en castellano.
- `Aviso_de_Privacidad_Sunday_At_Church_ES.pdf` → raíz del repositorio para que funcione el enlace al aviso de privacidad.
- `Autorizacion_de_Participacion_Sunday_At_Church_ES.pdf` → copia descargable de la autorización firmada / documento de referencia.
- `manual-verification-tracker.csv` → hoja de seguimiento manual.

La página utiliza el formulario de Adobe Sign en castellano. No incluye selector de idioma ni textos visibles en inglés, salvo el nombre propio del proyecto, las marcas técnicas y algunos nombres propios de servicios externos.

## Recorrido de participación

1. **Inicio:** presentación del proyecto, contexto de la confesión y explicación de las dos fases.
2. **Consentimiento:** datos de la persona participante, enlace al aviso de privacidad y formulario de Adobe Sign en castellano.
3. **Confesión:** 20 preguntas, diez principales y diez opcionales; la primera es «Ave María Purísima. La última vez que fui a una sauna fue…».
4. **Envío:** verificación de seguridad y envío de los vídeos. Cada envío queda pendiente de comprobación manual.

## Importante antes de publicar

- La casilla de Adobe Sign es una declaración de la persona participante; no verifica automáticamente que el PDF esté firmado.
- Comprueba manualmente el PDF firmado y los vídeos recibidos.
- Mantén privado el bucket R2. El Worker no ofrece endpoints públicos para listar o descargar archivos.
- Comprueba que `ALLOWED_ORIGINS` incluye `https://javierbotellaperez.com` y, si procede, `https://www.javierbotellaperez.com`.
- Mantén configuradas la clave pública de Turnstile y su clave secreta en el Worker. No incluyas secretos en GitHub.
- Comprueba que Turnstile permite el dominio real de la web.
- `ENABLE_SUBMISSIONS=true` permite recibir envíos reales. Déjalo activado solo si estás preparado para recibirlos.
- Antes de difundir el enlace, realiza una prueba controlada con una persona adulta que haya dado su consentimiento y con material no sensible.
- Tras recibir un envío, verifica el PDF, reproduce los vídeos, archiva los archivos en dos unidades cifradas, comprueba ambas copias y solo entonces elimina la copia temporal de R2.

## Límites técnicos

El Worker admite hasta 20 vídeos, con un máximo de 40 MB por vídeo y 200 MB en total. Los formatos admitidos son WebM y MP4. La grabación se conserva inicialmente en la sesión del navegador; si la persona cierra o recarga la página antes de enviar, puede perder los clips.

## Privacidad y revisión legal

Este paquete es una implementación técnica y editorial, no una certificación de cumplimiento legal. Antes de publicar, confirma que el aviso de privacidad describe correctamente quién es responsable del tratamiento, la base jurídica, el tratamiento de categorías especiales de datos cuando corresponda, los proveedores, las ubicaciones de alojamiento, los plazos de conservación, las medidas de seguridad, los derechos de las personas participantes y el canal de contacto. No prometas anonimato mediante edición posterior: las condiciones y límites deben explicarse antes de grabar.
