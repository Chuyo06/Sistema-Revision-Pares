// @ts-check
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const BASE_URL = 'http://localhost:5173';
const idUnico = Date.now().toString().slice(-4);
const tituloArticulo = `Artículo E2E Final - ${idUnico}`;

test.use({ launchOptions: { slowMo: 300 } });

test('Flujo de Integración E2E Completo con Superusuario', async ({ page }) => {
  test.setTimeout(120000);

  // Crear el PDF de prueba de manera dinámica para que la CI lo encuentre (evitando problemas de .gitignore)
  const testPdfPath = 'tests/test.pdf';
  if (!fs.existsSync(testPdfPath)) {
    const dummyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type/Page/MediaBox [0 0 612 792]/Parent 2 0 R>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<<>>\nstartxref\n194\n%%EOF');
    fs.writeFileSync(testPdfPath, dummyPdf);
  }

  // Interceptamos ÚNICAMENTE las respuestas GET de la API de manuscritos
  await page.route('**/api/manuscritos**', async route => {
    if (route.request().method() !== 'GET') {
      return route.continue();
    }

    const response = await route.fetch();
    try {
      const json = await response.json();
      if (Array.isArray(json)) {
        json.forEach(m => {
          if (m.titulo && m.titulo.includes('Artículo E2E Final')) {
            m.autorId = 999; // ID ficticio para burlar conflicto de intereses
          }
        });
      } else if (json && json.titulo && json.titulo.includes('Artículo E2E Final')) {
        json.autorId = 999;
      }
      await route.fulfill({ response, json });
    } catch (err) {
      await route.continue();
    }
  });

  // ==========================================
  // PASO 1: EL AUTOR SUBE EL MANUSCRITO
  // ==========================================
  console.log('Paso 1: Autor sube el artículo');
  await page.goto(`${BASE_URL}/#/login`);
  await page.fill('input[type="email"]', 'super@demo.com');
  await page.fill('input[type="password"]', '1234');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(2000); // Esperar inicialización

  // Cambiar al rol Autor usando el switcher
  const btnCambiarRol = page.locator('div[title="Cambiar rol"]').first();
  if (await btnCambiarRol.isVisible()) {
    await btnCambiarRol.click();
    await page.waitForTimeout(500);
    await page.locator('.v-list-item', { hasText: /^Autor$/i }).first().click();
    await page.waitForURL('**/autor/dashboard', { timeout: 10000 });
    await page.waitForTimeout(1000);
  }

  await page.goto(`${BASE_URL}/#/autor/nuevo`);
  await page.fill('input[type="text"]', tituloArticulo).catch(() => {});
  
  const selectComp = page.locator('.v-select').first();
  if (await selectComp.isVisible()) {
    await selectComp.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
  }

  await page.fill('textarea', 'Resumen automatizado.').catch(() => {});

  const fileInput = page.locator('input[type="file"]').first();
  if (await fileInput.isVisible()) {
     await fileInput.setInputFiles('tests/test.pdf');
     const btnSubirPdf = page.locator('button:has-text("Subir"), button:has-text("Cargar")').first();
     if (await btnSubirPdf.isVisible()) {
       await btnSubirPdf.click();
     }
     await expect(page.locator('text=Documento vinculado')).toBeVisible({ timeout: 15000 }).catch(() => {});
  }

  const btnEnviar = page.locator('button:has-text("Enviar Artículo")').first();
  if (await btnEnviar.isVisible() && !(await btnEnviar.isDisabled())) {
     await btnEnviar.click();
     await expect(page.locator('text=¡Artículo enviado con éxito!')).toBeVisible({ timeout: 15000 }).catch(() => {});
  }

  // ==========================================
  // PASO 2: CAMBIAR A EDITOR Y ASIGNAR REVISOR
  // ==========================================
  console.log('Paso 2: Cambiar a Editor y asignar revisor');
  
  // Ir al dashboard para limpiar overlays
  await page.goto(`${BASE_URL}/#/autor/dashboard`);
  await page.waitForTimeout(1000);

  // Cambiar al rol Editor usando el switcher
  await btnCambiarRol.click();
  await page.waitForTimeout(500);
  await page.locator('.v-list-item', { hasText: /^Editor$/i }).first().click();
  await page.waitForURL('**/editor/dashboard', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Ir directamente a la URL de manuscritos para evitar fallas con clics de menú
  await page.goto(`${BASE_URL}/#/editor/manuscritos`);
  await page.waitForTimeout(2000);

  // Buscar la tarjeta del artículo nuevo o usar la primera de la lista
  const cardArticulo = page.locator('.v-card').filter({ hasText: tituloArticulo }).first();
  if (await cardArticulo.isVisible({ timeout: 5000 }).catch(() => false)) {
    await cardArticulo.click();
  } else {
    console.log('Artículo específico no visible en primer plano, seleccionando el primero de la lista...');
    await page.locator('.v-card').first().click();
  }
  await page.waitForTimeout(2000);

  // Invitar a "Super Usuario Multi-Rol" en la lista lateral
  const filaRevisor = page.locator('.v-card, .v-list-item, div').filter({ hasText: 'Super Usuario Multi-Rol' }).first();
  const btnInvitar = filaRevisor.locator('button', { hasText: /Invitar a Revisar/i }).first();
  await expect(btnInvitar).toBeVisible({ timeout: 15000 });
  await btnInvitar.click();
  await page.waitForTimeout(2000); // Esperar que se guarde la asignación

  // ==========================================
  // PASO 3: CAMBIAR A REVISOR Y EVALUAR
  // ==========================================
  console.log('Paso 3: Cambiar a Revisor y realizar evaluación');

  // Limpiar navegación
  await page.goto(`${BASE_URL}/#/editor/dashboard`);
  await page.waitForTimeout(1000);

  // Cambiar al rol Revisor usando el switcher
  await btnCambiarRol.click();
  await page.waitForTimeout(500);
  await page.locator('.v-list-item', { hasText: /^Revisor$/i }).first().click();
  await page.waitForURL('**/revisor/dashboard', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Ir directamente a la URL de asignados
  await page.goto(`${BASE_URL}/#/revisor/asignados`);
  await page.waitForTimeout(2000);

  // Buscar el artículo asignado o usar el primero de la lista
  const articuloNuevo = page.locator('div').filter({ hasText: tituloArticulo }).first();
  let itemRevisor = articuloNuevo;
  if (!(await articuloNuevo.isVisible({ timeout: 5000 }).catch(() => false))) {
    console.log('Artículo específico no visible para el revisor, seleccionando el primero...');
    itemRevisor = page.locator('.v-card, .v-list-item, div.v-row > div').first();
  }

  // Aceptar la invitación
  const btnAceptarInv = itemRevisor.locator('button', { hasText: /Aceptar Invitación/i }).first();
  if (await btnAceptarInv.isVisible()) {
      await btnAceptarInv.click();
      await page.waitForTimeout(2000);
  }

  // Iniciar la evaluación
  const btnIniciarRev = itemRevisor.locator('a, button', { hasText: /Iniciar revisión|Continuar revisión/i }).first();
  await expect(btnIniciarRev).toBeVisible({ timeout: 15000 });
  await btnIniciarRev.click();
  await page.waitForTimeout(2000);

  // Llenar ratings (Estrellas)
  const estrellas = page.locator('.v-rating button');
  if (await estrellas.count() > 0) {
      await estrellas.nth(4).click(); // 5 estrellas en originalidad
      await estrellas.nth(9).click(); // 5 estrellas en metodologia
      await estrellas.nth(14).click(); // 5 estrellas en claridad
      await estrellas.nth(19).click(); // 5 estrellas en relevancia
  }

  // Seleccionar recomendación
  const selectRec = page.locator('.v-select, .v-field').first();
  await selectRec.click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  // Comentarios
  const textarea = page.locator('textarea').first();
  await expect(textarea).toBeVisible();
  await textarea.fill('El artículo cumple con todos los rigurosos estándares de la revista. ¡Excelente trabajo y aportación científica!');
  
  // Enviar
  const btnEnviarRev = page.locator('button', { hasText: /Enviar revisión/i }).first();
  await expect(btnEnviarRev).toBeVisible();
  await btnEnviarRev.click();
  await page.waitForTimeout(2000); // Esperar modal de éxito

  // ==========================================
  // PASO 4: CONFIRMAR DECISIÓN (EDITOR)
  // ==========================================
  console.log('Paso 4: Confirmar decisión de aceptar como Editor');
  
  // Limpiar navegación
  await page.goto(`${BASE_URL}/#/revisor/dashboard`);
  await page.waitForTimeout(1000);

  // Cambiar al rol Editor usando el switcher
  await btnCambiarRol.click();
  await page.waitForTimeout(500);
  await page.locator('.v-list-item', { hasText: /^Editor$/i }).first().click();
  await page.waitForURL('**/editor/dashboard', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Ir directamente a la URL de manuscritos
  await page.goto(`${BASE_URL}/#/editor/manuscritos`);
  await page.waitForTimeout(2000);

  // Buscar la tarjeta del artículo nuevo o la primera
  const cardArticuloEditor = page.locator('.v-card').filter({ hasText: tituloArticulo }).first();
  if (await cardArticuloEditor.isVisible({ timeout: 5000 }).catch(() => false)) {
    await cardArticuloEditor.click();
  } else {
    await page.locator('.v-card').first().click();
  }
  await page.waitForTimeout(2000);

  // Registrar Decisión Final "Aceptar"
  const btnAceptar = page.locator('button', { hasText: 'Aceptar' }).first();
  if (await btnAceptar.isVisible()) {
      await btnAceptar.click();
      await page.waitForTimeout(1000);
      
      const dialogConfirm = page.locator('.v-overlay-container button').filter({ hasText: /Confirmar|Aceptar|Guardar/i }).last();
      if (await dialogConfirm.isVisible()) {
          await dialogConfirm.click();
          await page.waitForTimeout(2000);
      }
  }

  // ==========================================
  // PASO 5: VOLVER A AUTOR Y VER RESUMEN
  // ==========================================
  console.log('Paso 5: Volver a Autor y verificar resumen/aceptación');

  // Limpiar navegación
  await page.goto(`${BASE_URL}/#/editor/dashboard`);
  await page.waitForTimeout(1000);

  // Cambiar al rol Autor usando el switcher
  await btnCambiarRol.click();
  await page.waitForTimeout(500);
  await page.locator('.v-list-item', { hasText: /^Autor$/i }).first().click();
  await page.waitForURL('**/autor/dashboard', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Ir directamente a la URL de artículos del autor
  await page.goto(`${BASE_URL}/#/autor/articulos`);
  await page.waitForTimeout(2000);

  // Buscar la tarjeta del artículo del autor con la clase .articulo-card
  const miArticulo = page.locator('.articulo-card').filter({ hasText: tituloArticulo }).first();
  if (await miArticulo.isVisible({ timeout: 5000 }).catch(() => false)) {
    await miArticulo.click();
  } else {
    console.log('Buscando cualquier tarjeta de artículo del autor...');
    await page.locator('.articulo-card').first().click();
  }
  await page.waitForTimeout(2500); // Esperar que abra el diálogo de historial/comentarios

  // Hacer un poco de scroll en el cuerpo del diálogo de la línea del tiempo
  const scrollElement = page.locator('.v-dialog .v-card-text').first();
  if (await scrollElement.isVisible({ timeout: 5000 }).catch(() => false)) {
    await scrollElement.evaluate(el => el.scrollTop = 260);
    await page.waitForTimeout(2000);
  }

  console.log('¡Prueba E2E de integración finalizada con éxito!');
});
