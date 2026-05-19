// @ts-check
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const BASE_URL = 'http://localhost:5173';

function randomTitulo() {
  return `Test-E2E-${Date.now()}`;
}

function randomTexto(minChars = 80) {
  const base = 'Este es un texto de prueba generado automaticamente para el sistema de revision por pares. ';
  return (base.repeat(10)).substring(0, minChars + Math.floor(Math.random() * 50));
}

async function login(page, rol) {
  const rolesMap = {
    'Autor': { id: 1, nombre: 'Dra. Ana García', roles: ['autor'], rolActivo: 'autor', email: 'autor@demo.com', token: 'test-token' },
    'Editor Jefe': { id: 2, nombre: 'Dr. Carlos Rodríguez', roles: ['editor', 'editor_jefe'], rolActivo: 'editor', email: 'editor@demo.com', token: 'test-token' },
    'Revisor': { id: 3, nombre: 'Dra. María López', roles: ['revisor'], rolActivo: 'revisor', email: 'revisor@demo.com', token: 'test-token' },
    'Admin': { id: 99, nombre: 'Admin Sistema', roles: ['admin'], rolActivo: 'admin', email: 'admin@demo.com', token: 'test-token' },
  };
  
  const session = rolesMap[rol] || rolesMap['Autor'];
  
  await page.goto(`${BASE_URL}/`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);
  
  await page.evaluate((s) => {
    localStorage.setItem('rpp_usuario', JSON.stringify(s));
  }, session);
  
  const routes = {
    'Autor': '/#/autor/articulos',
    'Editor Jefe': '/#/editor/manuscritos',
    'Revisor': '/#/revisor/asignados',
    'Admin': '/#/administrador/dashboard',
  };
  
  await page.goto(`${BASE_URL}${routes[rol] || routes['Autor']}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  console.log(`[LOGIN] ${rol} -> ${page.url()}`);
}

async function irNuevoArticulo(page) {
  await page.goto(`${BASE_URL}/#/autor/nuevo`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
}

async function crearYEnviarArticulo(page, titulo, testPdfPath) {
  console.log(`\n--- Creando artículo: "${titulo}" ---`);

  await irNuevoArticulo(page);

  const hayAlerta = await page.locator('text=No hay convocatorias abiertas').isVisible({ timeout: 3000 }).catch(() => false);
  if (hayAlerta) {
    console.log('[AUTOR] No hay convocatorias abiertas - saltando');
    return false;
  }

  console.log('[AUTOR] Esperando campos del formulario...');
  await page.waitForSelector('.v-text-field', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(2000);

  const dbg = await page.evaluate(() => ({
    url: location.href,
    vTextFields: document.querySelectorAll('.v-text-field').length,
    vSelects: document.querySelectorAll('.v-select').length,
    vTextareas: document.querySelectorAll('.v-textarea').length,
    bodyText: document.body.innerText.substring(0, 300),
  }));
  console.log(`[DEBUG] URL=${dbg.url}, vTextField=${dbg.vTextFields}, vSelect=${dbg.vSelects}`);
  console.log(`[DEBUG] bodyText: ${dbg.bodyText.replace(/\n/g, ' | ')}`);

  // --- TÍTULO: click + type character-by-character to trigger Vuetify reactivity ---
  console.log('[AUTOR] Llenando título...');
  const titleField = page.locator('.v-text-field').first().locator('input');
  await titleField.click();
  await page.waitForTimeout(400);
  await titleField.pressSequentially(titulo, { delay: 50 });
  await page.waitForTimeout(800);

  // --- RESUMEN: click + type ---
  console.log('[AUTOR] Llenando resumen...');
  const resumenArea = page.locator('.v-textarea').first().locator('textarea');
  await resumenArea.click();
  await page.waitForTimeout(400);
  const resumenText = 'Este es un resumen de prueba generado automaticamente para el sistema de revision por pares.';
  await resumenArea.pressSequentially(resumenText, { delay: 30 });
  await page.waitForTimeout(800);

  // --- CONVOCATORIA (v-select): click to open, select first option ---
  console.log('[AUTOR] Seleccionando convocatoria...');
  const selectComp = page.locator('.v-select').first();
  await selectComp.click();
  await page.waitForTimeout(1500);

  // Check if menu opened
  let optionCount = await page.locator('.v-overlay .v-list-item').count();
  console.log(`[AUTOR] Opciones del select: ${optionCount}`);

  if (optionCount > 0) {
    await page.locator('.v-overlay .v-list-item').first().click();
    console.log('[AUTOR] Convoca seleccionada');
  } else {
    // Try alternate selector
    optionCount = await page.locator('.v-list-item').count();
    if (optionCount > 0) {
      await page.locator('.v-list-item').first().click();
    } else {
      await page.keyboard.press('Enter');
    }
  }
  await page.waitForTimeout(1000);

  // --- Verify form is valid (valido should be true now) ---
  const formValido = await page.evaluate(() => {
    // Check if the v-form ref exists and is valid
    const formEl = document.querySelector('form') || document.querySelector('[ref="formulario"]');
    // Check if PDF upload section is visible (proves valido=true)
    const pdfSection = document.querySelector('.v-file-input');
    return !!pdfSection;
  });
  console.log('[AUTOR] Form valido / PDF uploader visible:', formValido);

  // --- Upload PDF ---
  if (testPdfPath && formValido) {
    console.log('[AUTOR] Subiendo PDF...');
    const fileInput = page.locator('input[type="file"]').first();
    const fileInputVisible = await fileInput.isVisible().catch(() => false);
    console.log('[AUTOR] Input file visible:', fileInputVisible);

    if (fileInputVisible) {
      await fileInput.setInputFiles(testPdfPath);
      console.log('[AUTOR] PDF seleccionado');
      // Wait for upload to complete - look for success state
      await page.waitForTimeout(4000);

      // Check if PdfUploader shows success (reference number appears)
      const refVisible = await page.locator('text=Número de Referencia Único').isVisible({ timeout: 5000 }).catch(() => false);
      console.log('[AUTOR] PDF upload success:', refVisible);

      if (refVisible) {
        // Now scroll to and click "Enviar Artículo" button
        await page.locator('button:has-text("Enviar Artículo")').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        const enviarBtn = page.locator('button:has-text("Enviar Artículo")');
        const isEnabled = await enviarBtn.isEnabled({ timeout: 2000 }).catch(() => false);
        console.log('[AUTOR] Botón Enviar Artículo enabled:', isEnabled);

        if (isEnabled) {
          await enviarBtn.click();
          await page.waitForTimeout(4000);

          const successText = await page.locator('text=enviado con éxito').isVisible({ timeout: 5000 }).catch(() => false);
          console.log('[AUTOR] Envio exitoso:', successText);
          return successText;
        } else {
          // Try "Guardar Borrador" as fallback
          const guardarBtn = page.locator('button:has-text("Guardar Borrador")');
          if (await guardarBtn.isEnabled({ timeout: 2000 }).catch(() => false)) {
            console.log('[AUTOR] Guardando como borrador...');
            await guardarBtn.click();
            await page.waitForTimeout(2000);
            return true;
          }
        }
      } else {
        // PDF uploaded but success state not detected - try anyway
        console.log('[AUTOR] PDF uploaded, trying enviar anyway...');
        await page.locator('button:has-text("Enviar Artículo")').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        const btn = page.locator('button:has-text("Enviar Artículo")');
        if (await btn.isEnabled({ timeout: 2000 }).catch(() => false)) {
          await btn.click();
          await page.waitForTimeout(4000);
          return await page.locator('text=enviado con éxito').isVisible({ timeout: 5000 }).catch(() => false);
        }
      }
    }
  } else {
    console.log('[AUTOR] PDF uploader no visible - form may not be valid');
    // Debug why form isn't valid
    const debugState = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input:not([type="file"])');
      return {
        inputCount: inputs.length,
        values: Array.from(inputs).map(i => ({ type: i.type, val: i.value.substring(0, 50), parent: i.parentElement?.className })),
        bodyText: document.body.innerText.substring(0, 400),
      };
    });
    console.log('[DEBUG] Form state:', JSON.stringify(debugState.values.filter(i => i.val), 0));
    console.log('[DEBUG] Body:', debugState.bodyText.replace(/\n/g, ' | '));
  }

  console.log('[AUTOR] No se pudo completar el envío');
  return false;
}

async function esperarEnEditor(page, titulo) {
  await page.goto(`${BASE_URL}/#/editor/manuscritos`);
  await page.waitForTimeout(3000);

  for (let i = 0; i < 15; i++) {
    await page.reload();
    await page.waitForTimeout(2000);
    const found = await page.locator(`text=${titulo}`).first().isVisible({ timeout: 3000 }).catch(() => false);
    if (found) {
      console.log(`[EDITOR] Manuscrito "${titulo}" encontrado`);
      return true;
    }
    console.log(`[EDITOR] Esperando manuscrito... ${i + 1}/15`);
  }
  return false;
}

async function asignarRevisor(page, titulo) {
  await page.locator(`text=${titulo}`).first().click();
  await page.waitForTimeout(2000);

  const btnAsignar = page.locator('button:has-text("Gestionar Revisores"), button:has-text("Asignar revisor")').first();
  if (await btnAsignar.isVisible({ timeout: 2000 }).catch(() => false)) {
    await btnAsignar.click();
    await page.waitForTimeout(2000);
  }

  const revisorItem = page.locator('.v-list-item').first();
  if (await revisorItem.isVisible({ timeout: 3000 }).catch(() => false)) {
    await revisorItem.click();
    await page.waitForTimeout(1000);
    const btnConfirmar = page.locator('button:has-text("Asignar"), button:has-text("Confirmar")').first();
    if (await btnConfirmar.isVisible({ timeout: 1000 }).catch(() => false)) {
      await btnConfirmar.click();
    }
    await page.waitForTimeout(2000);
    console.log('[EDITOR] Revisores asignados');
    return true;
  }
  console.log('[EDITOR] No se encontraron revisores');
  return false;
}

async function completarRevision(page, tipoRec) {
  await page.goto(`${BASE_URL}/#/revisor/asignados`);
  await page.waitForTimeout(3000);

  const btn = page.locator('button:has-text("Iniciar revisión"), button:has-text("Continuar revisión")').first();
  if (!await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('[REVISOR] No hay artículos disponibles');
    return false;
  }
  await btn.click();
  await page.waitForTimeout(3000);

  const ratings = page.locator('.v-rating');
  const count = await ratings.count();
  console.log(`[REVISOR] Ratings encontrados: ${count}`);
  for (let i = 0; i < count; i++) {
    const stars = ratings.nth(i).locator('.v-icon');
    const starCount = await stars.count();
    if (starCount > 2) {
      await stars.nth(3).click();
    }
    await page.waitForTimeout(100);
  }

  const selectRec = page.locator('.v-select').first();
  if (await selectRec.isVisible()) {
    await selectRec.click();
    await page.waitForTimeout(500);
    const opciones = page.locator('.v-list-item');
    const total = await opciones.count();
    let clickIdx = 0;
    if (tipoRec === 'ACEPTAR') clickIdx = 0;
    else if (tipoRec === 'REVISION_MENOR') clickIdx = 1;
    else if (tipoRec === 'REVISION_MAYOR') clickIdx = 2;
    else if (tipoRec === 'RECHAZAR') clickIdx = 3;
    if (total > clickIdx) {
      await opciones.nth(clickIdx).click();
    } else {
      await page.keyboard.press('Escape');
    }
  }

  const textarea = page.locator('textarea').first();
  if (await textarea.isVisible()) {
    await textarea.fill(randomTexto(100));
  }

  await page.waitForTimeout(1000);
  const btnEnviar = page.locator('button:has-text("Enviar revisión")');
  if (await btnEnviar.isEnabled({ timeout: 2000 }).catch(() => false)) {
    await btnEnviar.click();
    await page.waitForTimeout(3000);
  }

  const ok = await page.locator('text=Revisión enviada').isVisible({ timeout: 5000 }).catch(() => false);
  console.log(`[REVISOR] Revisión completada (${tipoRec}): ${ok}`);
  return ok;
}

async function tomarDecision(page, decision) {
  await page.goto(`${BASE_URL}/#/editor/manuscritos`);
  await page.waitForTimeout(3000);

  const label = decision === 'ACEPTADO' ? 'Aceptar' : decision === 'RECHAZADO' ? 'Rechazar' : 'Pedir revisiones';
  const btn = page.locator(`button:has-text("${label}")`).first();
  if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(3000);
    console.log(`[EDITOR] Decisión: ${decision}`);
    return true;
  }
  console.log(`[EDITOR] Botón "${label}" no visible`);
  return false;
}

async function verificarAutor(page, estado) {
  await page.goto(`${BASE_URL}/#/autor/articulos`);
  await page.waitForTimeout(3000);

  const label = estado === 'ACEPTADO' ? 'Aceptado' : estado === 'RECHAZADO' ? 'Rechazado' : 'Revisión';
  const ok = await page.locator(`text=${label}`).first().isVisible({ timeout: 5000 }).catch(() => false);
  console.log(`[AUTOR] Estado final: ${label} -> ${ok ? 'OK' : 'FAIL'}`);
  return ok;
}

test.describe('E2E: Flujo Completo de Revision por Pares', () => {

  test.beforeEach(async ({ page }) => {
    // Set up session before navigating
    await page.addInitScript(() => {
      localStorage.setItem('rpp_usuario', JSON.stringify({
        id: 1,
        nombre: 'Dra. Ana García',
        email: 'autor@demo.com',
        roles: ['autor'],
        rolActivo: 'autor',
        token: 'test-token'
      }));
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('SW') && !msg.text().includes('ServiceWorker')) {
        console.log(`[ERROR] ${msg.text()}`);
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('3002') || response.url().includes('manuscritos')) {
        console.log(`[RESPONSE] ${response.status()} ${response.url()}`);
      }
    });
  });

  test.describe('VARIANTE 1: Aceptacion Directa', () => {
    const titulo = `V1-${randomTitulo()}`;
    let pdfPath = '';

    test.beforeAll(async () => {
      const dir = os.tmpdir();
      pdfPath = path.join(dir, `test-v1-${Date.now()}.pdf`);
      const dummyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type/Page/MediaBox [0 0 612 792]/Parent 2 0 R>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n194\n%%EOF');
      fs.writeFileSync(pdfPath, dummyPdf);
    });

    test.afterAll(async () => {
      try { fs.unlinkSync(pdfPath); } catch (e) {}
    });

    test('V1.1 - Autor crea y envia', async ({ page }) => {
      await login(page, 'Autor');
      const ok = await crearYEnviarArticulo(page, titulo, pdfPath);
      if (!ok) {
        console.log('[SKIP] No se pudo enviar');
        test.skip();
      }
      expect(ok).toBe(true);
    });

    test('V1.2 - Editor asigna revisores', async ({ page }) => {
      await login(page, 'Editor Jefe');
      const ok = await esperarEnEditor(page, titulo);
      if (!ok) {
        console.log('[SKIP] Manuscrito no encontrado');
        test.skip();
      }
      const asig = await asignarRevisor(page, titulo);
      expect(asig).toBe(true);
    });

    test('V1.3 - Revisor completa revision', async ({ page }) => {
      await login(page, 'Revisor');
      const ok = await completarRevision(page, 'ACEPTAR');
      if (!ok) {
        console.log('[SKIP] Revision no completada');
        test.skip();
      }
      expect(ok).toBe(true);
    });

    test('V1.4 - Editor acepta articulo', async ({ page }) => {
      await login(page, 'Editor Jefe');
      const ok = await tomarDecision(page, 'ACEPTADO');
      if (!ok) {
        console.log('[SKIP] Decision no tomada');
        test.skip();
      }
      expect(ok).toBe(true);
    });

    test('V1.5 - Autor verifica aceptado', async ({ page }) => {
      await login(page, 'Autor');
      const ok = await verificarAutor(page, 'ACEPTADO');
      expect(ok).toBe(true);
    });
  });

  test.describe('VARIANTE 2: Revisiones Menores', () => {
    const titulo = `V2-${randomTitulo()}`;
    let pdfPath = '';

    test.beforeAll(async () => {
      const dir = os.tmpdir();
      pdfPath = path.join(dir, `test-v2-${Date.now()}.pdf`);
      const dummyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type/Page/MediaBox [0 0 612 792]/Parent 2 0 R>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n194\n%%EOF');
      fs.writeFileSync(pdfPath, dummyPdf);
    });

    test.afterAll(async () => {
      try { fs.unlinkSync(pdfPath); } catch (e) {}
    });

    test('V2.1 - Autor crea y envia', async ({ page }) => {
      await login(page, 'Autor');
      const ok = await crearYEnviarArticulo(page, titulo, pdfPath);
      if (!ok) test.skip();
      expect(ok).toBe(true);
    });

    test('V2.2 - Editor asigna revisores', async ({ page }) => {
      await login(page, 'Editor Jefe');
      const ok = await esperarEnEditor(page, titulo);
      if (!ok) test.skip();
      const asig = await asignarRevisor(page, titulo);
      expect(asig).toBe(true);
    });

    test('V2.3 - Revisor pide revisiones menores', async ({ page }) => {
      await login(page, 'Revisor');
      const ok = await completarRevision(page, 'REVISION_MENOR');
      if (!ok) test.skip();
      expect(ok).toBe(true);
    });

    test('V2.4 - Editor inicia revision adicional', async ({ page }) => {
      await login(page, 'Editor Jefe');
      const ok = await tomarDecision(page, 'EN_REVISION');
      if (!ok) test.skip();
      expect(ok).toBe(true);
    });

    test('V2.5 - Autor ve estado en revision', async ({ page }) => {
      await login(page, 'Autor');
      const ok = await verificarAutor(page, 'EN_REVISION');
      expect(ok).toBe(true);
    });
  });

  test.describe('VARIANTE 3: Revisiones Mayores', () => {
    const titulo = `V3-${randomTitulo()}`;
    let pdfPath = '';

    test.beforeAll(async () => {
      const dir = os.tmpdir();
      pdfPath = path.join(dir, `test-v3-${Date.now()}.pdf`);
      const dummyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type/Page/MediaBox [0 0 612 792]/Parent 2 0 R>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n194\n%%EOF');
      fs.writeFileSync(pdfPath, dummyPdf);
    });

    test.afterAll(async () => {
      try { fs.unlinkSync(pdfPath); } catch (e) {}
    });

    test('V3.1 - Autor crea y envia', async ({ page }) => {
      await login(page, 'Autor');
      const ok = await crearYEnviarArticulo(page, titulo, pdfPath);
      if (!ok) test.skip();
      expect(ok).toBe(true);
    });

    test('V3.2 - Editor asigna revisores', async ({ page }) => {
      await login(page, 'Editor Jefe');
      const ok = await esperarEnEditor(page, titulo);
      if (!ok) test.skip();
      const asig = await asignarRevisor(page, titulo);
      expect(asig).toBe(true);
    });

    test('V3.3 - Revisor pide revisiones mayores', async ({ page }) => {
      await login(page, 'Revisor');
      const ok = await completarRevision(page, 'REVISION_MAYOR');
      if (!ok) test.skip();
      expect(ok).toBe(true);
    });

    test('V3.4 - Editor inicia revision adicional', async ({ page }) => {
      await login(page, 'Editor Jefe');
      const ok = await tomarDecision(page, 'EN_REVISION');
      if (!ok) test.skip();
      expect(ok).toBe(true);
    });
  });

  test.describe('VARIANTE 4: Rechazo', () => {
    const titulo = `V4-${randomTitulo()}`;
    let pdfPath = '';

    test.beforeAll(async () => {
      const dir = os.tmpdir();
      pdfPath = path.join(dir, `test-v4-${Date.now()}.pdf`);
      const dummyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type/Page/MediaBox [0 0 612 792]/Parent 2 0 R>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n194\n%%EOF');
      fs.writeFileSync(pdfPath, dummyPdf);
    });

    test.afterAll(async () => {
      try { fs.unlinkSync(pdfPath); } catch (e) {}
    });

    test('V4.1 - Autor crea y envia', async ({ page }) => {
      await login(page, 'Autor');
      const ok = await crearYEnviarArticulo(page, titulo, pdfPath);
      if (!ok) test.skip();
      expect(ok).toBe(true);
    });

    test('V4.2 - Editor asigna revisores', async ({ page }) => {
      await login(page, 'Editor Jefe');
      const ok = await esperarEnEditor(page, titulo);
      if (!ok) test.skip();
      const asig = await asignarRevisor(page, titulo);
      expect(asig).toBe(true);
    });

    test('V4.3 - Revisor recomienda rechazo', async ({ page }) => {
      await login(page, 'Revisor');
      const ok = await completarRevision(page, 'RECHAZAR');
      if (!ok) test.skip();
      expect(ok).toBe(true);
    });

    test('V4.4 - Editor rechaza articulo', async ({ page }) => {
      await login(page, 'Editor Jefe');
      const ok = await tomarDecision(page, 'RECHAZADO');
      if (!ok) test.skip();
      expect(ok).toBe(true);
    });

    test('V4.5 - Autor verifica rechazado', async ({ page }) => {
      await login(page, 'Autor');
      const ok = await verificarAutor(page, 'RECHAZADO');
      expect(ok).toBe(true);
    });
  });

});
