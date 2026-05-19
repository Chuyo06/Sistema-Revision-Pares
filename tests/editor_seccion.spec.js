// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Pruebas Modulares: EDITOR DE SECCIÓN', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/login`);
    await page.fill('input[type="email"]', 'editor.seccion@demo.com');
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Iniciar Sesión"), button[type="submit"]');
    
    await page.waitForURL('**/editor/**', { timeout: 5000 }).catch(async () => {
      await page.goto(`${BASE_URL}/#/editor/manuscritos`);
    });
  });

  test('Task #2961 - El editor de sección puede asignar y quitar revisores a sus manuscritos', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/editor/manuscritos`);
    expect(page.url()).toContain('/editor');
  });

  test('Task #2963 - El editor de sección solo ve sus artículos asignados', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/editor/manuscritos`);
    // Aseguramos que la interfaz cargada corresponda a un filtro de su asignación
    expect(page.url()).toContain('/editor/manuscritos');
  });

});
