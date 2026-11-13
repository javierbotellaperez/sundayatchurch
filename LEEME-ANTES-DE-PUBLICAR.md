# Sunday At Church — paquete bilingüe

## Punto de entrada
Publica el contenido de esta carpeta en la raíz del repositorio de GitHub Pages. La página principal es `index.html`: presenta el proyecto y permite escoger **Castellano** o **English**.

## Versiones completas
- Castellano: `confesionario.html` + `confesionario.js`
- English: `confessional-en.html` + `confessional-en.js`
- Ambas utilizan `styles.css` y envían los vídeos al mismo Worker configurado en `src/index.js`.

Cada versión mantiene sus propios textos, preguntas, instrucciones y formulario Adobe Sign. La versión castellana utiliza el formulario de Adobe Sign en castellano; la inglesa utiliza el formulario en inglés.

## Documentos incluidos
- `Autorizacion_de_Participacion_Sunday_At_Church_ES.pdf`
- `Aviso_de_Privacidad_Sunday_At_Church_ES.pdf`
- `Participant_Release_Sunday_At_Church_EN.pdf`
- `Privacy_Notice_Sunday_At_Church_EN.pdf`

## Antes de publicar
1. Comprueba que el Worker `sundayatchurch-api` sigue desplegado y que `ALLOWED_ORIGINS` incluye el dominio público exacto.
2. Comprueba que Turnstile permite el dominio donde se publica GitHub Pages y/o el dominio personalizado.
3. Haz un envío de prueba en cada idioma y confirma que el campo `language` se guarda como `es` o `en`.
4. Comprueba manualmente cada formulario Adobe Sign y el flujo de verificación de consentimiento.
5. Revisa los avisos de privacidad antes de publicar para confirmar que describen fielmente el almacenamiento, los plazos y el tratamiento real de los datos.

## Importante
El ZIP no despliega cambios ni modifica la configuración de Cloudflare, Adobe Sign o GitHub. La participación sigue pendiente de verificación manual de la autorización firmada y de los vídeos recibidos.


## Formularios Adobe Sign
Los dos formularios se muestran mediante sus URL públicas de Adobe Sign dentro de iframes. Se ha aumentado la altura visible para evitar que los campos inferiores queden recortados. Si siguen faltando campos incluso al final del formulario, comprueba que la URL pública (wid) corresponde a la versión publicada más reciente del Web Form: editar el documento original o la plantilla no siempre actualiza un Web Form ya publicado. En ese caso, publica/actualiza el Web Form en Adobe Sign y sustituye el `wid` correspondiente en el iframe de cada idioma.
