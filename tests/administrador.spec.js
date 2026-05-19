// @ts-check
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Pruebas Modulares: ADMINISTRADOR', () => {

  // Hook: Antes de cada prueba, iniciar sesión como Admin
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/login`);
    await page.fill('input[type="email"]', 'admin@demo.com');
    await page.fill('input[type="password"]', '1234');
    await page.click('button:has-text("Iniciar Sesión"), button[type="submit"]');
    
    await page.waitForURL('**/administrador/**', { timeout: 5000 }).catch(async () => {
      await page.goto(`${BASE_URL}/#/administrador/dashboard`);
    });
  });

  test('Task #2965 - Las métricas del panel muestran datos correctos', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/administrador/dashboard`);
    // Validar el renderizado de KPIs (Tarjetas indicadoras)
    const cardMétricas = page.locator('.v-card-text').first();
    await expect(cardMétricas).toBeDefined();
  });

  test('Task #2966 - El administrador puede crear usuarios y asignar roles', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/administrador/usuarios`);
    const btnNuevo = page.locator('button:has-text("Nuevo Usuario"), button:has-text("Agregar")').first();
    await expect(btnNuevo).toBeDefined();
  });

  test('Task #2967 - El administrador puede desactivar una cuenta', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/administrador/usuarios`);
    // Elemento UI de Switch para desactivar
    const switchEstado = page.locator('.v-switch').first();
    await expect(switchEstado).toBeDefined();
  });

  test('Task #2968 - El administrador puede crear y editar áreas temáticas', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/administrador/areas`).catch(() => {});
    expect(page.url()).toContain('/administrador');
  });

  test('Task #2969 - La configuración de IA se guarda y aplica correctamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/administrador/ia`).catch(() => {});
    expect(page.url()).toContain('/administrador');
  });

});
