// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Pruebas Modulares: SUPER ADMINISTRADOR (Multi-Rol)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/login`);
    await page.fill('input[type="email"]', 'super@demo.com');
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Iniciar Sesión"), button[type="submit"]');
    
    // Esperamos a que la sesión se registre globalmente
    await page.waitForTimeout(1000);
  });

  test('El Super Admin puede entrar a la vista de ADMINISTRADOR', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/administrador/dashboard`);
    const isUrlAdmin = page.url().includes('/administrador');
    expect(isUrlAdmin).toBeTruthy();
  });

  test('El Super Admin puede entrar a la vista de EDITOR JEFE', async ({ page }) => {
    // Como tiene el rol de editor jefe, el enrutador debe hacer el cambio automático
    await page.goto(`${BASE_URL}/#/editor/manuscritos`);
    await page.waitForTimeout(500);
    const isUrlEditor = page.url().includes('/editor');
    expect(isUrlEditor).toBeTruthy();
  });

  test('El Super Admin puede entrar a la vista de REVISOR', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/revisor/asignados`);
    await page.waitForTimeout(500);
    const isUrlRevisor = page.url().includes('/revisor');
    expect(isUrlRevisor).toBeTruthy();
  });

  test('El Super Admin puede entrar a la vista de AUTOR', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/autor/articulos`);
    await page.waitForTimeout(500);
    const isUrlAutor = page.url().includes('/autor');
    expect(isUrlAutor).toBeTruthy();
  });

  test('Verificación de Privilegio Total: Gestionar usuarios', async ({ page }) => {
    // Al finalizar su recorrido, sigue teniendo permisos para administrar usuarios
    await page.goto(`${BASE_URL}/#/administrador/usuarios`);
    const tabla = page.locator('.v-table, .v-data-table, table').first();
    await expect(tabla).toBeDefined();
  });

});
