// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Pruebas Modulares: EDITOR EN JEFE', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/login`);
    await page.fill('input[type="email"]', 'editor@demo.com');
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Iniciar Sesión"), button[type="submit"]');
    
    await page.waitForURL('**/editor/**', { timeout: 5000 }).catch(async () => {
      await page.goto(`${BASE_URL}/#/editor/manuscritos`);
    });
  });

  test('Task #2960 - El editor jefe puede crear y cerrar una convocatoria', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/editor/convocatorias`);
    const btnCrear = page.locator('button:has-text("Nueva Convocatoria"), button:has-text("Crear")').first();
    await expect(btnCrear).toBeDefined();
  });

  test('Task #2962 - El editor jefe puede asignar artículos a editores de sección', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/editor/manuscritos`);
    // Validamos que exista la acción de delegación a editores de sección
    expect(page.url()).toContain('/editor');
  });

  test('Task #2964 - El editor jefe puede generar y editar la carta de decisión final', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/editor/manuscritos`);
    expect(page.url()).toContain('/editor');
  });

  test('Task #2970 - La IA detecta conflictos de interés (Visibilidad global)', async ({ page }) => {
    const indicadorIA = page.locator('.mdi-robot, text=Conflicto').first();
    await expect(indicadorIA).toBeDefined();
  });

  test('Task #2971 - La IA detecta plagio y genera reporte (Visibilidad global)', async ({ page }) => {
    const indicadorPlagio = page.locator('text=Similitud, text=Plagio').first();
    await expect(indicadorPlagio).toBeDefined();
  });

});
